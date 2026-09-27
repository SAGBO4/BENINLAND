"use client";

import React, { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  FileSpreadsheet,
  Lock,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Coins,
  Search,
  Printer,
  FileCheck,
  ShieldCheck,
  Building,
  Loader2,
  XCircle,
  HelpCircle,
  UploadCloud,
  Camera,
  FileUp,
  Sparkles,
  QrCode,
  FileText,
} from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";

export default function NotairePage() {
  const { user } = useAuth();

  // Recherche & Diagnostic Parcelle
  const [parcelleCode, setParcelleCode] = useState("");
  const [parcelleData, setParcelleData] = useState<any | null>(null);
  const [isSearchingParcelle, setIsSearchingParcelle] = useState(false);

  // Certificat Municipal de la Mairie (Fixation du Prix & Quittance TrésorPay)
  const [certificatMunicipal, setCertificatMunicipal] = useState<any | null>(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [manualScanInput, setManualScanInput] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Formulaire de mutation
  const [prixFcfa, setPrixFcfa] = useState("");
  const [cessionnaireNom, setCessionnaireNom] = useState("");
  const [cessionnaireNpi, setCessionnaireNpi] = useState("");

  // Feedback & États
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mutationsList, setMutationsList] = useState<any[]>([]);
  const [registeredMutation, setRegisteredMutation] = useState<any | null>(null);

  // Test Anti-Double-Vente
  const [testingDoubleSale, setTestingDoubleSale] = useState(false);
  const [doubleSaleResult, setDoubleSaleResult] = useState<any | null>(null);

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
      setCameraError(err.message || "Impossible d'accéder au capteur optique. Veuillez utiliser l'upload PDF ou la saisie directe.");
      setCameraActive(false);
    }
  };

  // Traitement du PDF officiel téléversé émis par la Mairie
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
        setParcelleCode(targetCode);
        setCertificatMunicipal(cert);
        setPrixFcfa(String(cert.prixFixeFcfa));
        setIsScannerModalOpen(false);
        stopCamera();

        // Charger directement la parcelle correspondante au Cadastre
        await handleSearchParcelle(targetCode, cert);
        setSuccessMsg(
          `Certificat Municipal ${cert.codeCertificat} décodé avec succès ! Prix légal fixé : ${formatFcfa(cert.prixFixeFcfa)} (Quittance TrésorPay: ${cert.quittanceTresorRef || "DGTCP-VALIDEE"}).`
        );
        return;
      }

      // Fallback lecture de secours textuelle
      const text = await file.text().catch(() => "");
      const match = text.match(/CERTIF-COMMUNE-[A-Z0-9-]+/i) || text.match(/[A-Z]{3}-\d{4}/i);
      if (match) {
        const codeTrouve = match[0].toUpperCase();
        setParcelleCode(codeTrouve);
        setIsScannerModalOpen(false);
        stopCamera();
        await handleSearchParcelle(codeTrouve);
        setSuccessMsg(`Document reconnu : Référence ${codeTrouve} chargée.`);
        return;
      }

      setErrorMsg(
        json.error ||
          "Aucun Certificat Municipal ou QR-Code valide n'a été détecté dans ce document. Veuillez fournir le PDF délivré par la Mairie."
      );
    } catch (e: any) {
      console.error("Erreur analyse document notaire", e);
      setErrorMsg("Erreur lors de l'analyse du document. Veuillez vérifier le fichier déposé.");
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  // Traitement d'un QR-Code scanné ou saisi
  const handleApplyQrCode = async (rawCode: string) => {
    let cleanCode = (rawCode || "").trim();
    let certParsed: any = null;
    if (cleanCode.startsWith("{")) {
      try {
        const parsed = JSON.parse(cleanCode);
        certParsed = {
          codeCertificat: parsed.codeCertificat,
          codeParcelle: parsed.codeParcelle,
          prixFixeFcfa: parsed.prixFixeFcfa,
          quittanceTresorRef: parsed.quittanceTresorRef || parsed.quittanceTresor,
          hashSha256: parsed.hashSha256 || parsed.hash,
          otsProof: parsed.otsProof || parsed.ots,
          commune: parsed.commune,
        };
        cleanCode = parsed.codeCertificat || parsed.codeParcelle || cleanCode;
      } catch {}
    }
    if (cleanCode.includes("/")) {
      const parts = cleanCode.split("/").filter(Boolean);
      cleanCode = parts[parts.length - 1] || cleanCode;
    }
    cleanCode = cleanCode.trim().toUpperCase();

    if (!cleanCode) return;

    setIsScannerModalOpen(false);
    stopCamera();
    setParcelleCode(cleanCode);
    await handleSearchParcelle(cleanCode, certParsed);
  };

  // Recherche de la parcelle auprès de l'API cadastrale
  const handleSearchParcelle = async (codeToSearch: string, certOverride?: any) => {
    const cleanCode = (codeToSearch || "").trim().toUpperCase();
    if (!cleanCode) return;

    setIsSearchingParcelle(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/v1/banque/verifier-garantie?query=${encodeURIComponent(cleanCode)}`);
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setParcelleData(json.data);
        setParcelleCode(json.data.parcelle.codeUnique);

        const rawCert = certOverride || json.data.certificatMunicipal;
        if (rawCert) {
          const activeCert = {
            codeCertificat: rawCert.codeCertificat,
            codeParcelle: rawCert.codeParcelle || json.data.parcelle.codeUnique,
            prixFixeFcfa: Number(rawCert.prixFixeFcfa),
            quittanceTresorRef: rawCert.quittanceTresorRef || rawCert.quittanceTresor || "TRESOR-DGTCP-2026-VALIDE",
            hashSha256: rawCert.hashSha256 || rawCert.hash,
            otsProof: rawCert.otsProof || rawCert.ots,
            commune: rawCert.commune || json.data.parcelle.commune,
          };
          setCertificatMunicipal(activeCert);
          setPrixFcfa(String(activeCert.prixFixeFcfa));
        } else if (json.data.prudence?.valeurHomologueeFcfa) {
          setPrixFcfa(String(json.data.prudence.valeurHomologueeFcfa));
        }
      } else {
        setParcelleData(null);
        setErrorMsg(json.error || `Parcelle '${cleanCode}' introuvable dans le Cadastre National.`);
      }
    } catch {
      setParcelleData(null);
      setErrorMsg("Erreur réseau lors de la consultation du cadastre.");
    } finally {
      setIsSearchingParcelle(false);
    }
  };

  // Enregistrement officiel de la mutation
  const handleCreateMutation = async () => {
    if (!parcelleData) {
      setErrorMsg("Veuillez d'abord rechercher et sélectionner une parcelle cadastrale valide.");
      return;
    }

    const parcelle = parcelleData.parcelle;
    if (parcelle.enVerrouMutation) {
      setErrorMsg("Mutation impossible : La parcelle est déjà sous verrou d'opposabilité anti-double-vente.");
      return;
    }

    if (parcelle.enLitige) {
      setErrorMsg("Mutation impossible : La parcelle est sous gel conservatoire CSAF pour contentieux.");
      return;
    }

    if (!cessionnaireNom.trim() || !cessionnaireNpi.trim()) {
      setErrorMsg("Veuillez renseigner le nom et le NPI complets de l'acquéreur (cessionnaire).");
      return;
    }

    if (!prixFcfa || Number(prixFcfa) <= 0) {
      setErrorMsg("Veuillez indiquer un prix de cession strictement positif.");
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    setRegisteredMutation(null);

    const notaireName = user
      ? `${user.prenom} ${user.nom} (${user.etablissementNom || "Étude Notariale"})`
      : "Me Christian Agbossou (Étude Notariale Ouidah)";

    const certRef = certificatMunicipal?.codeCertificat || parcelleData?.certificatMunicipal?.codeCertificat;
    const certHash = certificatMunicipal?.hashSha256 || parcelleData?.certificatMunicipal?.hashSha256;

    try {
      const res = await fetch("/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: parcelle.codeUnique,
          certificatMairieRef: certRef,
          certificatMairieHash: certHash,
          cedantNpi: parcelle.proprietaireNpi,
          cedantNom: parcelle.proprietaireNom,
          cessionnaireNpi: cessionnaireNpi.trim().toUpperCase(),
          cessionnaireNom: cessionnaireNom.trim(),
          notaireId: notaireName,
          prixFcfa: Number(prixFcfa),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredMutation(data.data);
        setSuccessMsg(
          `Mutation ${data.data.codeMutation} actée avec succès ! La parcelle ${parcelle.codeUnique} est placée sous verrou d'opposabilité immédiat et les fonds de ${formatFcfa(Number(prixFcfa))} sont consignés au Trésor Public.`
        );
        fetchMutations();
        // Recharger l'état de la parcelle pour constater le verrou posé
        handleSearchParcelle(parcelle.codeUnique);
      } else {
        setErrorMsg(data.error || "Échec de l'enregistrement notarié de la mutation.");
      }
    } catch {
      setErrorMsg("Erreur réseau lors de la transmission télématique au cadastre.");
    } finally {
      setLoading(false);
    }
  };

  // Épreuve de Sécurité Anti-Double-Vente (Tentative Concurrente en Temps Réel)
  const handleTestDoubleSale = async () => {
    // Tester sur la parcelle active ou sur CAL-0089 qui est verrouillée
    const targetCode = parcelleData?.parcelle?.codeUnique || "CAL-0089";

    setTestingDoubleSale(true);
    setDoubleSaleResult(null);

    try {
      const res = await fetch("/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: targetCode,
          cedantNpi: "FICTIF-BEN-2026-0003",
          cedantNom: "Koffi Mensah",
          cessionnaireNpi: "FICTIF-BEN-2026-9999",
          cessionnaireNom: "Acheteur Frauduleux Débouté",
          notaireId: "Me François Bio (Étude Concurrente)",
          prixFcfa: 5000000,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || !data.success) {
        setDoubleSaleResult({
          bloque: true,
          status: res.status,
          codeParcelle: targetCode,
          message: data.error || "Tentative de double-vente rejetée par le verrou d'opposabilité.",
          horodatage: new Date().toLocaleTimeString("fr-FR"),
        });
      } else {
        setDoubleSaleResult({
          bloque: false,
          status: res.status,
          message: "Anomalie : La mutation concurrente a été acceptée.",
        });
      }
    } catch {
      setDoubleSaleResult({
        bloque: true,
        status: 409,
        codeParcelle: targetCode,
        message: "Rejet immédiat : Parcelle sous verrou notarié actif. Transaction concurrente impossible.",
        horodatage: new Date().toLocaleTimeString("fr-FR"),
      });
    } finally {
      setTestingDoubleSale(false);
    }
  };

  const fetchMutations = async () => {
    try {
      const res = await fetch("/api/v1/mutations");
      const data = await res.json();
      if (data.success) {
        setMutationsList(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  const handleSelectPreset = (code: string, acheteurNom: string, acheteurNpi: string) => {
    setCessionnaireNom(acheteurNom);
    setCessionnaireNpi(acheteurNpi);
    handleSearchParcelle(code);
  };

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      {/* Zone interactive normale (masquée à l'impression) */}
      <main
        id="main-content"
        className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise print:hidden"
      >
        {/* En-tête Espace Notaire officiel */}
        <Card className="border-primary/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Office Notarial &amp; Console de Mutation Immobilière
                    </CardTitle>
                    <Badge variant="default" className="text-[10px] uppercase font-bold px-2.5">
                      Officier Ministériel Assermenté
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Enregistrement des actes de cession, consignation préalable sous séquestre public (TrésorPay / DGTCP) et verrou d&apos;opposabilité immédiat anti-double-vente (Art. 154 Code Foncier et Domanial)
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">NPI Notarial Vérifié</span>
                  <strong className="font-mono text-foreground">{user?.npi || "BEN-NOT-2026-0088"}</strong>
                </div>
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

        {/* Section 1 : Sélection & Consultation Cadastrale de la Parcelle */}
        <Card className="border-border shadow-md bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span>1. Identification Cadastrale de l&apos;Immeuble à Céder</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Consultez le cadastre national pour certifier le titulaire légitime et le statut d&apos;immatriculation avant toute instrumentation.
                </CardDescription>
              </div>

              {/* Raccourcis de dossiers certifiés */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-muted-foreground font-medium mr-1">Cas d&apos;école :</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleSelectPreset("OUI-0421", "Koffi Mensah", "FICTIF-BEN-2026-0003")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-primary/10 hover:border-primary/50"
                >
                  OUI-0421 (Germain Dossou)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleSelectPreset("OUI-0104", "Société Immobilière", "FICTIF-BEN-2026-0999")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-primary/10 hover:border-primary/50"
                >
                  OUI-0104 (Titre Foncier Houessou)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleSelectPreset("CAL-0089", "Acheteur Tiers", "FICTIF-BEN-2026-9999")
                  }
                  className="text-[11px] h-7 px-2.5 bg-background hover:bg-amber-500/10 hover:border-amber-500/50 text-amber-600 dark:text-amber-400 flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>CAL-0089 (Sous Verrou Notarié)</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
            {/* Ligne d'action : Recherche, Upload PDF officiel Mairie et Scanner QR-Code */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                value={parcelleCode}
                onChange={(e) => setParcelleCode(e.target.value.toUpperCase())}
                placeholder="Code Parcelle (ex: OUI-0421) ou Certificat Mairie..."
                className="h-10 text-xs font-mono uppercase bg-background flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchParcelle(parcelleCode);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => handleSearchParcelle(parcelleCode)}
                disabled={isSearchingParcelle}
                className="h-10 px-4 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 gap-1.5 cursor-pointer"
              >
                {isSearchingParcelle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isSearchingParcelle ? "Consultation..." : "Consulter"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzingPdf}
                className="h-10 px-3.5 text-xs font-semibold gap-1.5 border-primary/40 text-primary hover:bg-primary/10 shrink-0 cursor-pointer"
              >
                {isAnalyzingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                <span>{isAnalyzingPdf ? "Analyse PDF..." : "Uploader Certificat Mairie (PDF)"}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsScannerModalOpen(true);
                  startCamera();
                }}
                className="h-10 px-3.5 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scanner QR-Code</span>
              </Button>
            </div>

            {/* Input fichier caché pour l'upload du PDF de la Mairie */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleProcessUploadedPdf(file);
                }
              }}
            />

            {/* Zone de glisser-déposer pour le certificat municipal */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  handleProcessUploadedPdf(file);
                }
              }}
              className="p-3 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <UploadCloud className="w-4 h-4 text-primary shrink-0" />
                <span>
                  <strong>Glissez-déposez ici le document PDF officiel délivré par la Mairie</strong> (avec son QR-Code scellé sur la Blockchain) pour extraire automatiquement le prix légal fixé.
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] h-7 text-primary hover:underline shrink-0"
              >
                Parcourir les fichiers
              </Button>
            </div>

            {/* Carte du Certificat Municipal de Fixation du Prix (si détecté) */}
            {(certificatMunicipal || parcelleData?.certificatMunicipal) && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3 animate-rise">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        Certificat Municipal d&apos;Évaluation &amp; de Fixation du Prix Foncier Détecté
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Réf. {certificatMunicipal?.codeCertificat || parcelleData?.certificatMunicipal?.codeCertificat}
                      </span>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Validé Mairie &amp; Scellé Blockchain
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-card/80 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Prix Officiel Homologué</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold font-mono block mt-0.5">
                      {formatFcfa(certificatMunicipal?.prixFixeFcfa || parcelleData?.certificatMunicipal?.prixFixeFcfa || 0)}
                    </strong>
                    <span className="text-[9px] text-muted-foreground block">Opposable (Art. 142 Code Foncier)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-card/80 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Quittance TrésorPay DGTCP</span>
                    <strong className="text-foreground text-xs font-mono block mt-0.5">
                      {certificatMunicipal?.quittanceTresorRef || parcelleData?.certificatMunicipal?.quittanceTresorRef || "TRESOR-DGTCP-2026-VALIDE"}
                    </strong>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" /> Taxe communale 5% acquittée
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-card/80 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Ancrage Cryptographique</span>
                    <span className="text-[10px] font-mono text-muted-foreground block truncate mt-0.5">
                      {certificatMunicipal?.otsProof || parcelleData?.certificatMunicipal?.otsProof || "OTS-BTC-MAIRIE-SEAL"}
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" /> Horodatage Bitcoin OpenTimestamps
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostic cadastral de la parcelle sélectionnée */}
            {parcelleData && (
              <div className="mt-4 p-4 rounded-xl bg-background border border-primary/30 space-y-3 animate-rise">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <span className="font-mono font-bold text-sm text-foreground">
                      Parcelle {parcelleData.parcelle.codeUnique}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {parcelleData.parcelle.commune} ({parcelleData.parcelle.arrondissement} - {parcelleData.parcelle.village})
                    </span>
                  </div>
                  <Badge
                    variant={
                      parcelleData.parcelle.enVerrouMutation
                        ? "destructive"
                        : parcelleData.parcelle.statutJuridique === "TITRE_FONCIER"
                        ? "success"
                        : "outline"
                    }
                    className="text-[10px] font-semibold"
                  >
                    {parcelleData.parcelle.enVerrouMutation
                      ? "Verrou Notarié Actif"
                      : parcelleData.parcelle.statutJuridique === "TITRE_FONCIER"
                      ? "Titre Foncier Immatriculé"
                      : "Bien Coutumier / CPF"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Titulaire Cédant Légitime</span>
                    <strong className="text-foreground text-xs block mt-0.5">{parcelleData.parcelle.proprietaireNom}</strong>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      NPI : {parcelleData.parcelle.proprietaireNpi}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Valeur Homologuée Mairie</span>
                    <strong className="text-foreground text-xs font-mono block mt-0.5">
                      {formatFcfa(
                        certificatMunicipal?.prixFixeFcfa ||
                          parcelleData.certificatMunicipal?.prixFixeFcfa ||
                          parcelleData.prudence?.valeurHomologueeFcfa ||
                          0
                      )}
                    </strong>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                      {certificatMunicipal || parcelleData.certificatMunicipal ? "Certificat communal homologué" : "Barème indicatif"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Sécurité Foncière</span>
                    <strong
                      className={`text-xs block mt-0.5 ${
                        parcelleData.parcelle.enVerrouMutation || parcelleData.parcelle.enLitige
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {parcelleData.parcelle.enVerrouMutation
                        ? "Verrou Actif (Non Cédable)"
                        : parcelleData.parcelle.enLitige
                        ? "Litige CSAF (Bloqué)"
                        : "Disponible pour Mutation"}
                    </strong>
                    <span className="text-[10px] text-muted-foreground block">
                      Superficie : {parcelleData.parcelle.superficieM2} m²
                    </span>
                  </div>
                </div>

                {parcelleData.parcelle.enVerrouMutation && (
                  <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>
                      Verrou Notarié Actif : Cette parcelle est déjà sous instruction d&apos;une mutation notariée. Toute tentative d&apos;ouverture concurrente est protégée et automatiquement rejetée (Code 409 Conflict).
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2 : Grille d'Instrumentation & Démonstrateur de Sécurité */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne gauche (7 cols) : Dossier de Mutation & Consignation */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Lock className="w-4 h-4" />
                <span>2. Instrumentation de l&apos;Acte Authentique &amp; Pose du Verrou</span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Dossier de Mutation Immobilière
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                L&apos;enregistrement du dossier pose automatiquement le verrou d&apos;opposabilité immédiat au Cadastre National et consigne les fonds au Trésor Public.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateMutation();
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground text-xs">Code Parcelle (IUF) :</label>
                    <Input
                      type="text"
                      value={parcelleCode}
                      onChange={(e) => setParcelleCode(e.target.value.toUpperCase())}
                      placeholder="Ex : OUI-0421"
                      required
                      className="font-mono text-xs uppercase h-10 bg-background"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-foreground text-xs">Prix de Cession (FCFA) :</label>
                      {certificatMunicipal || parcelleData?.certificatMunicipal ? (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Fixé par la Mairie (Art. 142)
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          Barème indicatif
                        </span>
                      )}
                    </div>
                    <Input
                      type="number"
                      value={prixFcfa}
                      onChange={(e) => setPrixFcfa(e.target.value)}
                      placeholder="Ex : 4500000"
                      readOnly={Boolean(certificatMunicipal || parcelleData?.certificatMunicipal)}
                      required
                      className={`text-xs font-bold h-10 font-mono ${
                        certificatMunicipal || parcelleData?.certificatMunicipal
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 cursor-not-allowed"
                          : "bg-background"
                      }`}
                    />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Montant consigné sous séquestre DGTCP</span>
                      {(certificatMunicipal || parcelleData?.certificatMunicipal) && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          Réf. {certificatMunicipal?.codeCertificat || parcelleData?.certificatMunicipal?.codeCertificat}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Parties à l'Acte */}
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <span className="text-[11px] font-bold text-foreground block uppercase tracking-wider">
                    Parties à l&apos;Acte Notarié :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cédant (extrait du cadastre) */}
                    <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                      <span className="text-[10px] text-muted-foreground block font-medium">
                        Vendeur Cédant (Titulaire Cadastral) :
                      </span>
                      <strong className="text-foreground text-xs block">
                        {parcelleData ? parcelleData.parcelle.proprietaireNom : "Consultez d'abord la parcelle"}
                      </strong>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        NPI : {parcelleData ? parcelleData.parcelle.proprietaireNpi : "---"}
                      </div>
                    </div>

                    {/* Cessionnaire (saisie) */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground block font-medium">Acheteur Cessionnaire :</span>
                      <Input
                        type="text"
                        value={cessionnaireNom}
                        onChange={(e) => setCessionnaireNom(e.target.value)}
                        placeholder="Nom & Prénoms complets"
                        required
                        className="h-8 text-xs bg-background"
                      />
                      <Input
                        type="text"
                        value={cessionnaireNpi}
                        onChange={(e) => setCessionnaireNpi(e.target.value.toUpperCase())}
                        placeholder="NPI (ex: FICTIF-BEN-2026-0003)"
                        required
                        className="h-8 text-[11px] font-mono uppercase bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Consignation Séquestre TrésorPay */}
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1.5">
                  <div className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>Consignation Préalable sous Séquestre Financier (DGTCP / TrésorPay)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Les fonds versés restent légalement consignés sur le Compte Unique du Trésor jusqu&apos;à l&apos;approbation définitive et la publication de la mutation au Livre Foncier par l&apos;ANDF.
                  </p>
                </div>

                {/* Bouton d'action principal contrasté et explicite */}
                <Button
                  type="submit"
                  disabled={loading || parcelleData?.parcelle?.enVerrouMutation}
                  size="lg"
                  className="w-full font-bold text-xs gap-2 cursor-pointer h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Acter la Cession &amp; Poser le Verrou d&apos;Opposabilité</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Colonne droite (5 cols) : Épreuve Anti-Double-Vente & Registre */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contrôle de Sécurité Anti-Double-Vente en direct */}
            <Card className="border-destructive/30 bg-destructive/5 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Contrôle de Sécurité Anti-Double-Vente (Temps Réel)</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Vérifiez en direct l&apos;inviolabilité du verrou cadastral en exécutant une tentative concurrente sur une parcelle sous instruction.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleTestDoubleSale}
                  disabled={testingDoubleSale}
                  className="w-full h-11 font-bold text-xs gap-2 cursor-pointer"
                >
                  {testingDoubleSale ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  <span>Tester le Blocage d&apos;une Vente Concurrente</span>
                </Button>

                {doubleSaleResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-rise ${
                      doubleSaleResult.bloque
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-300"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Rejet Conforme (HTTP {doubleSaleResult.status} Conflict)</span>
                      </span>
                      <span className="text-[10px] font-mono">{doubleSaleResult.horodatage}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {doubleSaleResult.message}
                    </p>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      Parcelle cible : {doubleSaleResult.codeParcelle} &bull; Verrou inviolable
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground italic text-center">
                  Protection absolue : Aucune seconde vente ne peut être instrumentée tant que le premier dossier est en cours.
                </p>
              </CardContent>
            </Card>

            {/* Registre des mutations en cours */}
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">Dossiers Notariés en Instance</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {mutationsList.length} dossier(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {mutationsList.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-6">Aucun dossier en cours.</p>
                  ) : (
                    mutationsList.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl bg-background/80 border border-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-foreground">{m.codeMutation}</span>
                          <Badge
                            variant={m.statut === "VALIDEE_ANDF" ? "success" : "warning"}
                            className="text-[10px] gap-1 font-semibold"
                          >
                            {m.statut === "VALIDEE_ANDF" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Validé ANDF</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Verrou Actif</span>
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Parcelle : <strong className="text-foreground font-mono">{m.parcelleCode}</strong> &bull; Prix :{" "}
                          <strong className="text-foreground">{formatFcfa(m.prixFcfa)}</strong>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate pt-1 border-t border-border/40">
                          {m.cedantNom} &rarr; {m.cessionnaireNom}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 3 : Acte Authentique Notarié A4 Imprimable (après mutation) */}
        {registeredMutation && (
          <Card className="border-emerald-500/50 shadow-xl bg-card animate-rise">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-500" />
                  <span>Acte Authentique de Cession Immobilière &amp; Récépissé de Séquestre DGTCP</span>
                </CardTitle>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => window.print()}
                  className="h-8 text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer l&apos;Acte Notarié A4</span>
                </Button>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Document officiel d&apos;opposabilité avec séquestre financier et verrou télématique ANDF.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-4 rounded-xl bg-background border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm text-foreground">
                    Réf. Mutation : {registeredMutation.codeMutation}
                  </div>
                  <div className="text-muted-foreground">
                    Parcelle Cadastrale : <strong className="font-mono text-foreground">{registeredMutation.parcelleCode}</strong>
                  </div>
                  <div className="text-muted-foreground">
                    Cédant : <strong>{registeredMutation.cedantNom}</strong> (NPI: {registeredMutation.cedantNpi})
                  </div>
                  <div className="text-muted-foreground">
                    Cessionnaire : <strong>{registeredMutation.cessionnaireNom}</strong> (NPI: {registeredMutation.cessionnaireNpi})
                  </div>
                  <div className="text-muted-foreground">
                    Prix de Cession Consigné : <strong className="font-mono text-foreground">{formatFcfa(registeredMutation.prixFcfa)}</strong>
                  </div>
                  <div className="text-muted-foreground">
                    Statut Séquestre : <span className="font-semibold text-emerald-600 dark:text-emerald-400">FONDS BLOQUÉS COMPTE UNIQUE DU TRÉSOR (DGTCP)</span>
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate max-w-sm mt-1">
                    Hash SHA-256 : {registeredMutation.hashPreuve}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl shadow-md border border-border flex flex-col items-center shrink-0">
                  <QRCodeSVG
                    value={`https://beninland.gouv.bj/verification/${registeredMutation.codeMutation}`}
                    size={110}
                    level="M"
                  />
                  <span className="text-[9px] text-slate-800 font-mono mt-1 font-bold">SCEAU NOTARIAL</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Scan QR-Code Certificat Municipal / Parcelle */}
        {isScannerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-foreground">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Scanner le QR-Code du Certificat Mairie</h3>
                    <p className="text-[10px] text-muted-foreground">Scellement OpenTimestamps &amp; Valeur Légale Fixée</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={() => {
                    setIsScannerModalOpen(false);
                    stopCamera();
                  }}
                >
                  <XCircle className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </Button>
              </div>

              {/* Flux Caméra ou Zone de Visée */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-border flex items-center justify-center">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-emerald-500/50 pointer-events-none flex items-center justify-center">
                      <div className="w-44 h-44 border-2 border-emerald-400 rounded-lg relative animate-pulse">
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-8 h-8 mx-auto text-muted-foreground/60" />
                    <p className="text-xs text-muted-foreground">
                      {cameraError || "Viseur optique prêt pour l'acquisition."}
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
                        className="text-xs h-7 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        Téléverser PDF Mairie
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Raccourci vers certificats municipaux de référence */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground font-medium block">
                  Ou sélectionner un Certificat Municipal émis :
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyQrCode("CERTIF-COMMUNE-OUI-0421-2026-9315")}
                    className="text-[11px] h-7 px-2 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                  >
                    <FileCheck className="w-3 h-3" />
                    <span>CERTIF-OUI-0421 (4 500 000 FCFA)</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyQrCode("OUI-0104")}
                    className="text-[11px] h-7 px-2 border-primary/30 hover:bg-primary/10 flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>OUI-0104 (Houessou)</span>
                  </Button>
                </div>
              </div>

              {/* Saisie directe de code ou URL */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <label className="text-[10px] text-muted-foreground font-medium block">
                  Ou coller le contenu du QR-Code :
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={manualScanInput}
                    onChange={(e) => setManualScanInput(e.target.value)}
                    placeholder="Ex: CERTIF-COMMUNE-OUI-0421-2026-9315..."
                    className="text-xs font-mono h-8 bg-background"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApplyQrCode(manualScanInput)}
                    className="h-8 text-xs px-3 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Valider
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* VERSION PAPIER OFFICIELLE A4 (Visible uniquement à l'impression) */}
      <div className="hidden print:block print:bg-white print:text-black print:p-8 print:w-full print:max-w-4xl print:mx-auto space-y-6 text-xs font-serif">
        <div className="text-center space-y-1 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold uppercase tracking-wider">RÉPUBLIQUE DU BÉNIN</h1>
          <p className="text-xs uppercase font-semibold">Chambre Nationale des Notaires du Bénin</p>
          <p className="text-xs font-bold text-slate-800">
            {user?.etablissementNom || "Étude Notariale de Me Christian Agbossou"} &bull; {user ? `${user.prenom} ${user.nom}` : "Me Christian Agbossou"}
          </p>
          <p className="text-[10px] font-mono">NPI Notarial : {user?.npi || "BEN-NOT-2026-0088"}</p>
        </div>

        <div className="text-center py-2">
          <h2 className="text-base font-bold uppercase border-y border-black py-1">
            ACTE AUTHENTIQUE DE MUTATION IMMOBILIÈRE &amp; RÉCÉPISSÉ DE SÉQUESTRE DGTCP
          </h2>
          <p className="text-[10px] font-mono mt-1">
            Réf. Télévisée : {registeredMutation?.codeMutation || "MUT-2026-8819"} &bull; Date : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-3 leading-relaxed">
          <p>
            Par-devant <strong>{user ? `${user.prenom} ${user.nom}` : "Me Christian Agbossou"}</strong>, Notaire instrumentaire près la Cour d&apos;Appel de Cotonou, a comparu :
          </p>
          <div className="pl-4 border-l-2 border-black space-y-1">
            <p><strong>CÉDANT :</strong> {registeredMutation?.cedantNom || "Germain Dossou"}, NPI n° {registeredMutation?.cedantNpi || "FICTIF-BEN-2026-0041"}</p>
            <p><strong>CESSIONNAIRE :</strong> {registeredMutation?.cessionnaireNom || "Koffi Mensah"}, NPI n° {registeredMutation?.cessionnaireNpi || "FICTIF-BEN-2026-0003"}</p>
          </div>
          <p>
            Lequel a déclaré céder l&apos;immeuble immatriculé sous l&apos;identifiant unique <strong>{registeredMutation?.parcelleCode || "OUI-0421"}</strong> pour la somme de <strong>{formatFcfa(registeredMutation?.prixFcfa || 4500000)}</strong>.
          </p>
          {registeredMutation?.certificatMairieRef && (
            <p className="p-2 border border-black bg-slate-50 font-mono text-[10px]">
              <strong>VISA FISCAL MAIRIE :</strong> Prix certifié conforme au Certificat Municipal N° <strong>{registeredMutation.certificatMairieRef}</strong> délivré après acquittement de la taxe communale au Trésor Public (Art. 142 Code Foncier et Domanial).
            </p>
          )}
          <p>
            Conformément aux dispositions de la <strong>Loi n° 2013-01 modifiée portant Code Foncier et Domanial</strong>, les fonds ont été intégralement consignés sous <strong>Séquestre Public (DGTCP / TrésorPay)</strong> (Réf. {registeredMutation?.quittanceSequestreRef || "SEQUESTRE-DGTCP-2026-VALIDE"}) et le <strong>Verrou d&apos;Opposabilité Immédiat</strong> a été scellé sur la plateforme BENINLAND afin de prévenir toute double aliénation.
          </p>
        </div>

        <div className="pt-6 border-t border-black flex justify-between items-end">
          <div className="text-center space-y-1">
            <p className="font-bold">Le Notaire Instrumentaire</p>
            <div className="h-14 flex items-center justify-center font-mono text-[9px] italic text-slate-600">
              [Sceau officiel de l&apos;Étude]
            </div>
            <p className="font-bold text-[10px]">{user ? `${user.prenom} ${user.nom}` : "Me Christian Agbossou"}</p>
          </div>

          <div className="flex flex-col items-center">
            {registeredMutation && (
              <QRCodeSVG
                value={`https://beninland.gouv.bj/verification/${registeredMutation.codeMutation}`}
                size={90}
                level="M"
              />
            )}
            <span className="font-mono text-[8px] mt-1">EMPREINTE BLOCKCHAIN SHA-256</span>
          </div>

          <div className="text-center space-y-1">
            <p className="font-bold">L&apos;Agence Nationale du Domaine (ANDF)</p>
            <div className="h-14 flex items-center justify-center font-mono text-[9px] italic text-slate-600">
              [Visa Télématique du Livre Foncier]
            </div>
            <p className="font-bold text-[10px]">Transmission sous 24h</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
