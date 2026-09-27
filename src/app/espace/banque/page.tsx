"use client";

import React, { useState, useRef, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Search,
  FileCheck,
  Scale,
  AlertTriangle,
  Lock,
  Upload,
  QrCode,
  Camera,
  X,
  Printer,
  Sparkles,
  ExternalLink,
  UserCheck,
  UserX,
  FileText,
  BadgeAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";

export default function BanquePage() {
  const { user } = useAuth();

  // Demandeur de crédit (état initial vierge sans simulation)
  const [demandeurNom, setDemandeurNom] = useState("");
  const [demandeurNpi, setDemandeurNpi] = useState("");
  const [creditAmount, setCreditAmount] = useState("");

  // Recherche & Vérification
  const [codeQuery, setCodeQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Résultat de la vérification cadastrale & hypothécaire (null initialement -> zéro simulation !)
  const [verificationData, setVerificationData] = useState<any | null>(null);

  // Inscription hypothèque
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredHypotheque, setRegisteredHypotheque] = useState<any | null>(null);

  // Scanner & Upload PDF
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [manualScanInput, setManualScanInput] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("L'accès à la caméra n'est pas pris en charge par votre navigateur.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Caméra indisponible", err);
      setCameraError(err.message || "Impossible d'accéder au capteur optique. Veuillez utiliser l'upload PDF ou la saisie manuelle.");
      setCameraActive(false);
    }
  };

  // Exécution de la vérification auprès de l'API bancaire
  const runVerification = async (queryCode: string, applicantNpi = demandeurNpi, applicantNom = demandeurNom) => {
    let cleanCode = (queryCode || "").trim();
    if (cleanCode.startsWith("{")) {
      try {
        const parsed = JSON.parse(cleanCode);
        cleanCode = parsed.codeCertificat || parsed.codeParcelle || cleanCode;
      } catch {}
    }
    if (cleanCode.includes("/")) {
      const parts = cleanCode.split("/").filter(Boolean);
      cleanCode = parts[parts.length - 1] || cleanCode;
    }
    cleanCode = cleanCode.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMsg("Veuillez renseigner un code cadastral (ex: OUI-0421) ou un code de certificat municipal.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setRegisteredHypotheque(null);

    try {
      const res = await fetch("/api/v1/banque/verifier-garantie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: cleanCode,
          demandeurNpi: applicantNpi.trim(),
          demandeurNom: applicantNom.trim(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setVerificationData(json.data);
        if (json.data.titularite?.conforme) {
          setSuccessMsg(
            `Parcelle ${json.data.parcelle.codeUnique} identifiée. Titularité du demandeur conforme et taxes vérifiées sur BéninChain.`
          );
        } else if (!applicantNom.trim() && !applicantNpi.trim()) {
          setSuccessMsg(`Parcelle ${json.data.parcelle.codeUnique} identifiée au Cadastre National. Veuillez renseigner le demandeur du crédit.`);
        } else {
          setErrorMsg(json.data.titularite?.message || "Non-conformité de titularité détectée.");
        }
      } else {
        setVerificationData(null);
        setErrorMsg(json.error || "Parcelle introuvable dans le Cadastre National.");
      }
    } catch (e: any) {
      setVerificationData(null);
      setErrorMsg("Erreur réseau lors de l'interrogation du registre foncier et des sûretés.");
    } finally {
      setLoading(false);
    }
  };

  // Traitement d'un document PDF téléversé (Certificat Municipal)
  const handleProcessUploadedPdf = async (file: File) => {
    setIsAnalyzingPdf(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/commune/certificats/decode-pdf", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        const cert = json.data;
        const targetCode = cert.codeParcelle || cert.codeCertificat;
        setCodeQuery(targetCode);
        setIsScannerModalOpen(false);
        stopCamera();

        // Déclenchement automatique de la vérification avec le code extrait
        await runVerification(targetCode);
        return;
      }

      // Lecture de secours textuelle
      const text = await file.text().catch(() => "");
      const match = text.match(/CERTIF-COMMUNE-[A-Z0-9-]+/i) || text.match(/[A-Z]{3}-\d{4}/i);
      if (match) {
        const codeTrouve = match[0].toUpperCase();
        setCodeQuery(codeTrouve);
        setIsScannerModalOpen(false);
        stopCamera();
        await runVerification(codeTrouve);
        return;
      }

      setErrorMsg(
        json.error ||
          "Aucun Certificat Municipal ou QR-Code officiel n'a été détecté dans ce document. Veuillez fournir le PDF délivré par la Mairie."
      );
    } catch (e: any) {
      console.error("Erreur analyse document bancaire", e);
      setErrorMsg("Erreur lors de l'analyse du document. Veuillez vérifier le fichier déposé.");
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  // Inscription réelle de l'Hypothèque de Rang 1
  const handleRegisterMortgage = async () => {
    if (!verificationData) return;

    const parcelle = verificationData.parcelle;
    const certif = verificationData.certificatMunicipal;

    if (parcelle.enLitige) {
      setErrorMsg("Inscription refusée : La parcelle fait l'objet d'un gel conservatoire CSAF.");
      return;
    }
    if (parcelle.enVerrouMutation) {
      setErrorMsg("Inscription refusée : Une procédure de mutation notariale est déjà active avec verrou.");
      return;
    }
    if (!demandeurNom.trim() || !demandeurNpi.trim()) {
      setErrorMsg("Inscription refusée : L'identité complète (Nom et NPI) du demandeur de crédit est requise.");
      return;
    }
    if (!creditAmount || Number(creditAmount) <= 0) {
      setErrorMsg("Inscription refusée : Veuillez indiquer un montant de crédit valide à garantir.");
      return;
    }
    if (!verificationData.titularite?.conforme) {
      setErrorMsg("Inscription refusée : Défaut de titularité. Le demandeur de crédit n'est pas le titulaire légitime immatriculé.");
      return;
    }

    setIsRegistering(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/v1/banque/hypotheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: parcelle.codeUnique,
          demandeurNom: demandeurNom.trim(),
          demandeurNpi: demandeurNpi.trim(),
          banqueNom: user?.etablissementNom || "Banque Nationale du Bénin (BNB)",
          banqueNpiAgent: user?.npi || "FICTIF-BEN-2026-0700",
          montantCreditFcfa: Number(creditAmount),
          valeurGarantieFcfa: verificationData.prudence?.valeurHomologueeFcfa || Number(creditAmount),
          certificatMairieRef: certif?.codeCertificat,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setRegisteredHypotheque(json.data);
        setSuccessMsg(json.message);
        // Rafraîchir les données de garantie
        await runVerification(parcelle.codeUnique);
      } else {
        setErrorMsg(json.error || "Erreur lors de l'enregistrement de la sûreté réelle.");
      }
    } catch (e: any) {
      setErrorMsg("Erreur de communication avec le guichet télématique des sûretés.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleApplyPreset = (nom: string, npi: string, code: string, montant: string) => {
    setDemandeurNom(nom);
    setDemandeurNpi(npi);
    setCodeQuery(code);
    setCreditAmount(montant);
    runVerification(code, npi, nom);
  };

  return (
    <>
      <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin print:hidden">
      <main
        id="main-content"
        className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise"
      >
        {/* En-tête Espace Banque certifié */}
        <Card className="border-cyan-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Portail Bancaire &amp; Guichet des Sûretés Réelles
                    </CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold px-2.5">
                      Garanties Hypothécaires Officielles
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Vérification d&apos;authenticité des Titres Fonciers, confrontation de titularité du demandeur, et inscription électronique de sûretés de Rang 1 (BCEAO / OHADA)
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Établissement Agréé</span>
                <strong className="text-foreground">
                  {user?.etablissementNom || "Banque Nationale du Bénin (BNB)"} &bull; {user?.prenom} {user?.nom}
                </strong>
                <span className="block text-[10px] font-mono text-muted-foreground mt-0.5">
                  NPI Analyste : {user?.npi || "FICTIF-BEN-2026-0700"}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Notifications & Feedback */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="leading-relaxed font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Section 1 : Identification du Demandeur de Crédit */}
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-500" />
                  <span>1. Identité du Demandeur de Crédit</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Renseignez le titulaire du dossier pour vérifier automatiquement sa concordance avec le registre foncier national.
                </CardDescription>
              </div>

              {/* Raccourcis de test rapide */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground font-medium mr-1">Cas d&apos;école :</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleApplyPreset("Germain Dossou", "FICTIF-BEN-2026-0041", "OUI-0421", "2500000")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-cyan-500/10 hover:border-cyan-500/50"
                >
                  Germain Dossou (OUI-0421)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleApplyPreset("Famille Houessou", "FICTIF-BEN-2026-0004", "OUI-0104", "25000000")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-cyan-500/10 hover:border-cyan-500/50"
                >
                  Famille Houessou (OUI-0104)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleApplyPreset("Koffi Mensah", "FICTIF-BEN-2026-0003", "OUI-0421", "2000000")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-rose-500/10 hover:border-rose-500/50 text-rose-600 dark:text-rose-400 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>Non-titulaire (Test de Conformité)</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Nom &amp; Prénoms du Demandeur
                </label>
                <Input
                  type="text"
                  value={demandeurNom}
                  onChange={(e) => setDemandeurNom(e.target.value)}
                  placeholder="Ex : Germain Dossou"
                  className="h-9 text-xs bg-background"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  NPI (Numéro Personnel d&apos;Identification)
                </label>
                <Input
                  type="text"
                  value={demandeurNpi}
                  onChange={(e) => setDemandeurNpi(e.target.value.toUpperCase())}
                  placeholder="Ex : FICTIF-BEN-2026-0041"
                  className="h-9 text-xs font-mono uppercase bg-background"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                  Montant du Crédit Sollicité (FCFA)
                </label>
                <Input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="2500000"
                  className="h-9 text-xs font-mono bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2 : Les 3 Modes de Vérification de la Garantie */}
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-500" />
              <span>2. Recherche &amp; Vérification de la Parcelle en Garantie</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Utilisez l&apos;un des 3 modes certifiés : saisie manuelle de référence, téléversement direct du document PDF délivré par la Mairie, ou scan optique du QR-Code.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              {/* Mode A : Renseigner le code manuellement */}
              <div className="flex-1 flex gap-2">
                <Input
                  type="text"
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value.toUpperCase())}
                  className="font-mono uppercase h-10 text-xs flex-1 bg-background"
                  placeholder="IUF Parcelle (ex: OUI-0421) ou Code Certificat (ex: CERTIF-COMMUNE-OUI-0421-2026)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      runVerification(codeQuery);
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => runVerification(codeQuery)}
                  disabled={loading}
                  className="h-10 px-4 font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 gap-1.5 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{loading ? "Vérification..." : "Vérifier la Disponibilité"}</span>
                </Button>
              </div>

              {/* Séparateur visuel */}
              <div className="hidden md:flex items-center text-xs text-muted-foreground uppercase font-bold px-1">
                OU
              </div>

              {/* Mode B : Téléverser le document PDF */}
              <div className="flex gap-2 shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleProcessUploadedPdf(f);
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzingPdf}
                  className="h-10 px-4 text-xs font-semibold border-cyan-500/50 hover:bg-cyan-500/10 text-foreground gap-1.5 cursor-pointer"
                >
                  {isAnalyzingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                  ) : (
                    <Upload className="w-4 h-4 text-cyan-500" />
                  )}
                  <span>{isAnalyzingPdf ? "Analyse PDF..." : "Téléverser le PDF de Mairie"}</span>
                </Button>

                {/* Mode C : Scanner le QR-Code */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsScannerModalOpen(true);
                    startCamera();
                  }}
                  className="h-10 px-3.5 text-xs font-semibold border-border hover:bg-muted text-foreground gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-cyan-500" />
                  <span className="hidden sm:inline">Scanner QR</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 : Diagnostic et Résultats de la Garantie */}
        {verificationData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
            {/* Colonne gauche (7 cols) : Titularité, Cadastre, Évaluation Municipale et Action */}
            <div className="lg:col-span-7 space-y-6">
              {/* Bloc 1 : Diagnostic de Titularité */}
              <Card
                className={`shadow-xl border ${
                  verificationData.titularite?.conforme
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-destructive/60 bg-destructive/5"
                }`}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      {verificationData.titularite?.conforme ? (
                        <>
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Titularité Foncière Certifiée Conforme
                          </span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 text-rose-500" />
                          <span className="text-rose-700 dark:text-rose-400">
                            {!demandeurNom.trim() && !demandeurNpi.trim()
                              ? "Identification du Demandeur Requise"
                              : "Non-Conformité de Titularité Détectée"}
                          </span>
                        </>
                      )}
                    </CardTitle>
                    <Badge
                      variant={verificationData.titularite?.conforme ? "success" : "destructive"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {verificationData.titularite?.conforme
                        ? "Propriétaire Titré"
                        : !demandeurNom.trim() && !demandeurNpi.trim()
                        ? "Demandeur Non Renseigné"
                        : "Fraude / Usurpation"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs text-foreground mt-1">
                    {verificationData.titularite?.message}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-background/80 p-3 rounded-lg border border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Demandeur du Crédit</span>
                      <strong className="text-foreground font-mono">{demandeurNom || "Non renseigné"}</strong>
                      <span className="block text-[10px] font-mono text-muted-foreground">NPI : {demandeurNpi || "Non renseigné"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Titulaire Enregistré au Cadastre</span>
                      <strong className="text-foreground font-mono">{verificationData.parcelle.proprietaireNom}</strong>
                      <span className="block text-[10px] font-mono text-muted-foreground">
                        NPI : {verificationData.parcelle.proprietaireNpi}
                      </span>
                    </div>
                  </div>

                  {!demandeurNom.trim() && !demandeurNpi.trim() && (
                    <div className="mt-3 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] text-foreground font-medium">
                        Le demandeur est-il le titulaire cadastral ({verificationData.parcelle.proprietaireNom}) ?
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setDemandeurNom(verificationData.parcelle.proprietaireNom);
                          setDemandeurNpi(verificationData.parcelle.proprietaireNpi);
                          runVerification(
                            verificationData.parcelle.codeUnique,
                            verificationData.parcelle.proprietaireNpi,
                            verificationData.parcelle.proprietaireNom
                          );
                        }}
                        className="h-7 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                      >
                        Valider comme Demandeur
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bloc 2 : Fiche Cadastrale & Certificat Municipal */}
              <Card className="border-border shadow-xl bg-card">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-lg text-foreground">
                        {verificationData.parcelle.codeUnique}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {verificationData.parcelle.commune} ({verificationData.parcelle.arrondissement} - {verificationData.parcelle.village})
                      </span>
                    </div>
                    <Badge
                      variant={
                        verificationData.parcelle.statutJuridique === "TITRE_FONCIER" ||
                        verificationData.parcelle.statutJuridique === "CPF"
                          ? "success"
                          : "outline"
                      }
                      className="text-[10px] font-semibold"
                    >
                      {verificationData.parcelle.statutJuridique === "TITRE_FONCIER"
                        ? "Titre Foncier Immatriculé"
                        : verificationData.parcelle.statutJuridique === "CPF"
                        ? "Certificat Foncier (CPF)"
                        : "Bien Coutumier"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  {/* Grille des valeurs et taxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Valeur Homologuée</span>
                      <strong className="text-foreground text-sm font-mono mt-0.5 block">
                        {formatFcfa(verificationData.prudence.valeurHomologueeFcfa)}
                      </strong>
                      <span className="text-[9px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mt-0.5 font-medium">
                        {verificationData.certificatMunicipal ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                            <span>Fixée par la Mairie</span>
                          </>
                        ) : (
                          <span>Barème national</span>
                        )}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Taxes Municipales</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">
                        {verificationData.certificatMunicipal?.taxesPayees ? "Payées (TrésorPay)" : "En attente"}
                      </strong>
                      <span className="text-[9px] font-mono text-muted-foreground block mt-0.5 truncate">
                        {verificationData.certificatMunicipal?.quittanceTresorRef || "Aucune quittance"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-background border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Statut Sûreté</span>
                      <strong
                        className={`text-sm mt-0.5 block ${
                          verificationData.hypothequeActive ? "text-amber-500" : "text-emerald-500"
                        }`}
                      >
                        {verificationData.hypothequeActive ? "Hypothèque Active" : "Libre de Privilège"}
                      </strong>
                      <span className="text-[9px] text-muted-foreground block mt-0.5">
                        Superficie : {verificationData.parcelle.superficieM2} m²
                      </span>
                    </div>
                  </div>

                  {/* Preuves Blockchain */}
                  {verificationData.certificatMunicipal && (
                    <div className="p-3.5 rounded-xl bg-background border border-cyan-500/30 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-foreground">
                        <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Certificat Municipal Scellé sur Blockchain</span>
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {verificationData.certificatMunicipal.codeCertificat}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground truncate">
                        SHA-256 : {verificationData.certificatMunicipal.hashSha256}
                      </div>
                      <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                        Horodatage Bitcoin : {verificationData.certificatMunicipal.otsProof}
                      </div>
                    </div>
                  )}

                  {/* Alertes d'inégibilité éventuelle */}
                  {verificationData.parcelle.enLitige && (
                    <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Attention : Parcelle sous gel conservatoire CSAF pour instance contentieuse.</span>
                    </div>
                  )}

                  {verificationData.parcelle.enVerrouMutation && (
                    <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Attention : Procédure de mutation notariale déjà en cours sur cette parcelle.</span>
                    </div>
                  )}

                  {verificationData.hypothequeActive && (
                    <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Attention : Une hypothèque de Rang 1 est déjà inscrite au profit de {verificationData.hypothequeActive.banqueNom} ({verificationData.hypothequeActive.codeHypotheque}).
                      </span>
                    </div>
                  )}

                  {/* Formulaire d'Inscription d'Hypothèque Rang 1 */}
                  {verificationData.prudence.eligibleCredit ? (
                    <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs font-semibold whitespace-nowrap">Montant à Garantir :</label>
                        <Input
                          type="number"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          className="h-9 font-mono text-xs w-40 bg-background"
                        />
                        <span className="text-xs text-muted-foreground">FCFA</span>
                      </div>
                      <Button
                        type="button"
                        onClick={handleRegisterMortgage}
                        disabled={isRegistering}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer w-full sm:w-auto h-9 gap-1.5"
                      >
                        {isRegistering ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileCheck className="w-4 h-4" />
                        )}
                        <span>{isRegistering ? "Scellement..." : "Inscrire l'Hypothèque Rang 1 (BCEAO)"}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted text-muted-foreground text-xs flex items-center gap-2">
                      <BadgeAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        Inscription impossible : {verificationData.prudence.blocageMotif || "Critères de conformité non satisfaits."}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bloc 3 : Bordereau d'Inscription Hypothécaire A4 imprimable */}
              {registeredHypotheque && (
                <Card className="border-emerald-500/50 shadow-xl bg-card animate-rise">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-emerald-500" />
                        <span>Bordereau Officiel d&apos;Inscription Hypothécaire de Rang 1</span>
                      </CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                        className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimer le Bordereau A4</span>
                      </Button>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Document officiel délivré pour opposabilité aux tiers et transmission télématique au Livre Foncier ANDF.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="p-4 rounded-xl bg-background border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-sm text-foreground">
                          Réf. Hypothèque : {registeredHypotheque.codeHypotheque}
                        </div>
                        <div className="text-muted-foreground">
                          Créancier : <strong>{registeredHypotheque.banqueNom}</strong>
                        </div>
                        <div className="text-muted-foreground">
                          Débiteur / Constituant : <strong>{registeredHypotheque.demandeurNom}</strong> (NPI: {registeredHypotheque.demandeurNpi})
                        </div>
                        <div className="text-muted-foreground">
                          Montant de la créance garantie : <strong className="font-mono text-foreground">{formatFcfa(registeredHypotheque.montantCreditFcfa)}</strong>
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground truncate max-w-sm mt-1">
                          Hash SHA-256 : {registeredHypotheque.hashSha256}
                        </div>
                        <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 truncate max-w-sm">
                          Preuve OTS : {registeredHypotheque.otsProof}
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl shadow-md border border-border flex flex-col items-center shrink-0">
                        <QRCodeSVG
                          value={`https://beninland.gouv.bj/verification/${registeredHypotheque.codeHypotheque}`}
                          size={100}
                          level="M"
                        />
                        <span className="text-[9px] text-slate-800 font-mono mt-1 font-bold">SCEAU BANCAIRE</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonne droite (5 cols) : Cadre Prudentiel BCEAO / OHADA */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border shadow-xl bg-card">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <Scale className="w-4 h-4" />
                    <span>Cadre Réglementaire &amp; Prudentiel</span>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Normes BCEAO &amp; Acte Uniforme OHADA
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <div className="p-4 rounded-xl bg-background border border-border space-y-2">
                    <span className="text-[11px] font-bold text-foreground block">
                      Quotité Hypothécaire Autorisée (LTV : 70%)
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span>Capacité maximale finançable :</span>
                      <strong className="text-foreground text-sm font-mono">
                        {formatFcfa(verificationData.prudence.capaciteHypothecaireMaxFcfa)}
                      </strong>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Calculée sur la base de la valeur homologuée de{" "}
                      {formatFcfa(verificationData.prudence.valeurHomologueeFcfa)} issue du Certificat Municipal.
                    </div>
                  </div>

                  <p>
                    Conformément aux instructions de la Commission Bancaire de l&apos;UMOA et de l&apos;Acte uniforme portant
                    organisation des sûretés :
                  </p>

                  <div className="p-3.5 rounded-xl bg-background border border-border space-y-2 text-[11px]">
                    <div className="font-semibold text-foreground">Contrôles d&apos;Éligibilité Obligatoires :</div>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Titularité avérée au Cadastre National avec concordance NPI</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Fixation du prix et acquittement des taxes communales (TrésorPay)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Absence d&apos;inscription concurrente de Rang 1</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Absence d&apos;instance contentieuse CSAF et de verrou de mutation</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* État Initial Vide (Aucune simulation pré-remplie) */
          <div className="p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-border bg-card/50 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
              <Landmark className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-base font-bold text-foreground">
                Aucune parcelle interrogée pour le moment
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Veuillez renseigner le demandeur du crédit puis rechercher une parcelle par son identifiant unique (ex: <code>OUI-0421</code>, <code>OUI-0104</code>), téléverser le document PDF de la Mairie, ou scanner le QR-Code.
              </p>
            </div>
          </div>
        )}

        {/* Modal de Scan Optique / QR-Code */}
        {isScannerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-bold text-sm text-foreground">
                    Scanner le QR-Code du Certificat Municipal
                  </h3>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsScannerModalOpen(false);
                    stopCamera();
                  }}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {cameraActive ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-cyan-500/50">
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-2 border-dashed border-cyan-400/70 m-8 rounded-lg pointer-events-none animate-pulse" />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-muted text-center space-y-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {cameraError || "Flux vidéo inactif. Utilisez l'upload PDF ou la saisie directe."}
                  </p>
                  <div className="flex gap-2 justify-center pt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={startCamera}
                      className="text-xs h-7 gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Activer la caméra
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setIsScannerModalOpen(false);
                        stopCamera();
                        fileInputRef.current?.click();
                      }}
                      className="text-xs h-7 gap-1 bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Téléverser PDF Mairie
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-muted-foreground block">
                  Ou saisissez le code QR / Certificat décodé :
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={manualScanInput}
                    onChange={(e) => setManualScanInput(e.target.value.toUpperCase())}
                    placeholder="CERTIF-COMMUNE-OUI-0421-2026 ou OUI-0421"
                    className="h-9 text-xs font-mono uppercase bg-background"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (manualScanInput.trim()) {
                        setCodeQuery(manualScanInput.trim());
                        setIsScannerModalOpen(false);
                        stopCamera();
                        runVerification(manualScanInput.trim());
                      }
                    }}
                    className="h-9 px-4 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer shrink-0"
                  >
                    Valider
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>

      {/* ============================================================ */}
      {/* MODE IMPRESSION (BORDEREAU OFFICIEL D'INSCRIPTION A4)        */}
      {/* ============================================================ */}
      {registeredHypotheque && (
        <div className="hidden print:block print:bg-white print:text-black print:min-h-screen p-8 text-sm max-w-4xl mx-auto font-sans leading-relaxed">
          {/* En-tête officiel de la République du Bénin et du Guichet des Sûretés */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider">RÉPUBLIQUE DU BÉNIN</h1>
            <p className="text-xs uppercase font-medium">Fraternité - Justice - Travail</p>
            <div className="h-0.5 bg-black w-24 mx-auto my-2" />
            <h2 className="text-base font-bold uppercase">
              MINISTÈRE DE L&apos;ÉCONOMIE ET DES FINANCES &bull; ANDF
            </h2>
            <h3 className="text-sm font-semibold">
              CONSERVATION DE LA PROPRIÉTÉ FONCIÈRE &bull; GUICHET UNIQUE DES SÛRETÉS RÉELLES
            </h3>
            <div className="mt-4 p-2 bg-slate-100 border border-black inline-block">
              <span className="text-base font-black uppercase tracking-wide">
                BORDEREAU OFFICIEL D&apos;INSCRIPTION D&apos;HYPOTHÈQUE DE RANG 1
              </span>
            </div>
            <p className="font-mono text-xs mt-2 font-bold">
              Réf. Inscription : {registeredHypotheque.codeHypotheque}
            </p>
          </div>

          {/* Corps du Bordereau */}
          <div className="space-y-4 mb-6 text-xs">
            <p>
              Le Conservateur de la Propriété Foncière certifie que l&apos;affectation hypothécaire
              ci-après désignée a été régulièrement inscrite au Livre Foncier électronique conformément
              aux dispositions de l&apos;<strong>Acte uniforme OHADA portant organisation des sûretés</strong>,
              du <strong>Code Foncier et Domanial</strong> (Loi n° 2013-01 modifiée) et des directives prudentielles
              de la <strong>Commission Bancaire de l&apos;UMOA / BCEAO</strong> :
            </p>

            {/* 1. Créancier */}
            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">
                1. Établissement de Crédit Bénéficiaire (Créancier Nanti)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>Dénomination :</strong> {registeredHypotheque.banqueNom}
                </p>
                <p>
                  <strong>NPI Agent Analyste :</strong> {registeredHypotheque.banqueNpiAgent}
                </p>
                <p>
                  <strong>Date d&apos;Inscription :</strong>{" "}
                  {new Date(registeredHypotheque.dateInscription).toLocaleString("fr-FR")}
                </p>
                <p>
                  <strong>Rang de la Sûreté :</strong>{" "}
                  <span className="font-bold underline">RANG 1 (Privilège Exclusif Incontestable)</span>
                </p>
              </div>
            </div>

            {/* 2. Débiteur */}
            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">
                2. Débiteur / Constituant de la Garantie
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>Nom &amp; Prénoms :</strong> {registeredHypotheque.demandeurNom}
                </p>
                <p>
                  <strong>NPI (Identifiant National) :</strong> {registeredHypotheque.demandeurNpi}
                </p>
                <p>
                  <strong>Qualité :</strong> Propriétaire Titré Immatriculé au Cadastre National
                </p>
                <p>
                  <strong>Contrôle de Titularité :</strong> Certifié conforme sans réserve
                </p>
              </div>
            </div>

            {/* 3. Immeuble Grevé */}
            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">
                3. Désignation Cadastrale de l&apos;Immeuble Affecté
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>Identifiant Unique (IUF) :</strong> {registeredHypotheque.parcelleCode}
                </p>
                <p>
                  <strong>Certificat Municipal Mairie :</strong>{" "}
                  {registeredHypotheque.certificatMairieRef || "Homologué par la Mairie"}
                </p>
                <p>
                  <strong>Régime Juridique :</strong> Immatriculé au Livre Foncier ANDF
                </p>
                <p>
                  <strong>Statut Contentieux :</strong> Libre de tout recours et de toute contestation CSAF
                </p>
              </div>
            </div>

            {/* 4. Créance et Valeurs */}
            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">
                4. Créance Garantie et Quotité Prudentielle
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>MONTANT DE LA CRÉANCE GARANTIE :</strong>{" "}
                  <span className="text-sm font-black underline">
                    {formatFcfa(registeredHypotheque.montantCreditFcfa)}
                  </span>
                </p>
                <p>
                  <strong>Valeur Vénale Homologuée :</strong>{" "}
                  {formatFcfa(registeredHypotheque.valeurVenaleRetenue || registeredHypotheque.valeurGarantieFcfa)}
                </p>
                <p>
                  <strong>Quotité Hypothécaire (LTV) :</strong> Conforme au plafond prudentiel 70% UMOA
                </p>
                <p>
                  <strong>Statut au Livre Foncier :</strong> INSCRITE &bull; OPPOSABLE AUX TIERS
                </p>
              </div>
            </div>
          </div>

          {/* Sceau cryptographique et blockchain */}
          <div className="border border-black p-3 mb-6 bg-slate-50 text-[10px] font-mono space-y-1">
            <div className="font-bold text-xs uppercase font-sans">
              Preuve Cryptographique d&apos;Opposabilité (BéninChain &amp; OpenTimestamps)
            </div>
            <p className="truncate">Hash SHA-256 Sceau Sûreté : {registeredHypotheque.hashSha256}</p>
            <p className="truncate">Ancrage Bitcoin OTS : {registeredHypotheque.otsProof}</p>
            <p className="truncate">Tx ID BéninChain : {registeredHypotheque.txBlockchainId}</p>
          </div>

          {/* Mentions Légales OHADA */}
          <div className="p-3 border border-black mb-6 bg-slate-50 text-[11px] leading-tight">
            <strong>OPPOSABILITÉ LÉGALE &amp; EFFETS DE L&apos;INSCRIPTION (OHADA / BCEAO) :</strong>
            <p className="mt-1">
              La présente inscription confère au créancier le droit de préférence et le droit de suite
              sur l&apos;immeuble grevé, au Rang 1 exclusif. Toute mutation ultérieure ou inscription subséquente
              est subordonnée à la mainlevée formelle de l&apos;établissement créancier.
              <strong> Le QR-Code scellé ci-dessous fait foi devant les tribunaux et le régulateur bancaire.</strong>
            </p>
          </div>

          {/* Signatures et QR Code */}
          <div className="flex justify-between items-start border-t-2 border-black pt-4 mb-6">
            <div className="text-center w-1/3">
              <p className="font-bold mb-1">Pour l&apos;Établissement Bancaire</p>
              <p className="text-[10px] italic">L&apos;Analyste Engagements Sûretés</p>
              <p className="text-xs font-semibold mt-1">{registeredHypotheque.banqueNom}</p>
              <p className="text-[10px] font-mono">{registeredHypotheque.banqueNpiAgent}</p>
            </div>

            <div className="flex flex-col items-center w-1/3">
              <div className="p-2 border border-black bg-white inline-block">
                <QRCodeSVG
                  value={`https://beninland.gouv.bj/verification/${registeredHypotheque.codeHypotheque}`}
                  size={90}
                />
              </div>
              <span className="text-[8px] font-mono mt-1 font-bold">VÉRIFICATION PUBLIQUE</span>
            </div>

            <div className="text-center w-1/3">
              <p className="font-bold mb-1">Pour le Conservateur Foncier</p>
              <p className="text-[10px] italic">Agence Nationale du Domaine et du Foncier</p>
              <p className="text-xs font-semibold mt-1">Conservation Foncière ANDF</p>
              <p className="text-[10px] italic mt-4">Cachet et Sceau Officiel de l&apos;ANDF</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
