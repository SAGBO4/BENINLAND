"use client";

import React, { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Gavel,
  Loader2,
  FileUp,
  Camera,
  UploadCloud,
  X,
  FileCheck,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

interface LitigeItem {
  id: string;
  referenceOrdonnance: string;
  parcelleCode: string;
  demandeurNom: string;
  motif: string;
  juridiction: string;
  statut: "GEL_CONSERVATOIRE" | "LEVE";
  magistratNom: string;
  dateOuverture: string;
  certificatMairieRef?: string;
  quittanceTresorRef?: string;
}

export default function CsafPage() {
  const { user } = useAuth();
  const [parcelleCode, setParcelleCode] = useState("LIT-ALL-005");
  const [demandeur, setDemandeur] = useState("Succession Gbénou");
  const [motif, setMotif] = useState("Revendication de droits successoraux coutumiers et contestation de limite parcellaire");
  const [gelSuccess, setGelSuccess] = useState(false);
  const [leveGelSuccess, setLeveGelSuccess] = useState(false);
  const [successDetail, setSuccessDetail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [litigesList, setLitigesList] = useState<LitigeItem[]>([]);

  // Pièce jointe & analyse PDF / Image
  const [certificatMunicipal, setCertificatMunicipal] = useState<any | null>(null);
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualQrInput, setManualQrInput] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const fetchLitiges = async () => {
    try {
      const res = await fetch("/api/v1/csaf");
      const json = await res.json();
      if (res.ok && json.success && Array.isArray(json.data)) {
        setLitigesList(json.data);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des contentieux CSAF:", e);
    }
  };

  useEffect(() => {
    fetchLitiges();
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
      setCameraError(err.message || "Impossible d'accéder au capteur optique. Utilisez l'upload PDF.");
      setCameraActive(false);
    }
  };

  // Traitement d'un PDF ou Image téléversé émis par la Mairie
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
        setIsScannerModalOpen(false);
        stopCamera();

        setSuccessMsg(
          `Document officiel reconnu : ${cert.codeCertificat} ! Parcelle ${targetCode} ciblée (Quittance TrésorPay : ${cert.quittanceTresorRef || "DGTCP-VALIDEE"}).`
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
        setSuccessMsg(`Document reconnu : Référence ${codeTrouve} extraite.`);
        return;
      }

      setErrorMsg(
        json.error ||
          "Aucun Certificat Municipal ou QR-Code valide n'a été détecté dans ce document. Veuillez fournir l'attestation délivrée par la Mairie."
      );
    } catch (e: any) {
      console.error("Erreur analyse document CSAF", e);
      setErrorMsg("Erreur lors de l'analyse du document. Veuillez vérifier le fichier déposé.");
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  // Traitement du QR-Code scanné ou saisi
  const handleApplyQrCode = (rawCode: string) => {
    let cleanCode = (rawCode || "").trim();
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

    if (!cleanCode) return;

    setParcelleCode(cleanCode);
    setIsScannerModalOpen(false);
    stopCamera();
    setSuccessMsg(`QR-Code scanné avec succès : Référence ${cleanCode} chargée au greffe.`);
  };

  const handleGel = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setGelSuccess(false);
    setLeveGelSuccess(false);
    setLoading(true);

    const code = parcelleCode.trim().toUpperCase();
    const magistrat = user ? `${user.prenom} ${user.nom}` : "Juge Antoine Sossa";

    try {
      const res = await fetch("/api/v1/csaf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GEL",
          parcelleCode: code,
          demandeurNom: demandeur.trim(),
          demandeurNpi: user?.npi || "FICTIF-BEN-2026-0777",
          motif: motif.trim(),
          magistratNom: magistrat,
          certificatMairieRef: certificatMunicipal?.codeCertificat,
          quittanceTresorRef: certificatMunicipal?.quittanceTresorRef,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setGelSuccess(true);
        setSuccessDetail(json.data?.referenceOrdonnance || "Ordonnance signée");
        fetchLitiges();
      } else {
        setErrorMsg(json.error || `Impossible d'inscrire le gel conservatoire sur '${code}'.`);
      }
    } catch {
      setErrorMsg("Erreur réseau lors de la transmission de l'ordonnance CSAF.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeverGel = async () => {
    setErrorMsg(null);
    setGelSuccess(false);
    setLeveGelSuccess(false);
    setLoading(true);

    const code = parcelleCode.trim().toUpperCase();
    const magistrat = user ? `${user.prenom} ${user.nom}` : "Juge Antoine Sossa";

    try {
      const res = await fetch("/api/v1/csaf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MAINLEVEE",
          parcelleCode: code,
          magistratNom: magistrat,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setLeveGelSuccess(true);
        fetchLitiges();
      } else {
        setErrorMsg(json.error || `Impossible de lever le gel pour '${code}'.`);
      }
    } catch {
      setErrorMsg("Erreur réseau lors de la mainlevée CSAF.");
    } finally {
      setLoading(false);
    }
  };

  const activeLitiges = litigesList.filter((l) => l.statut === "GEL_CONSERVATOIRE");

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace CSAF */}
        <Card className="border-destructive/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center shrink-0">
                  <Scale className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Cour Spéciale des Affaires Foncières (CSAF)
                    </CardTitle>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold px-2.5">
                      Juridiction Spécialisée (Loi n° 2022-16)
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Greffe numérique des contentieux fonciers &bull; Enrôlement des assignations, ordonnances de gel conservatoire et publication des jugements
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Magistrat de Chambre</span>
                <strong className="text-foreground">
                  {user ? `${user.prenom} ${user.nom}` : "Juge Antoine Sossa"}
                </strong>
                <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                  NPI : {user?.npi || "FICTIF-BEN-2026-0099"}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {leveGelSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="leading-relaxed font-semibold">
              Jugement de mainlevée rendu. Le gel conservatoire sur la parcelle {parcelleCode} est levé au cadastre national.
            </span>
          </div>
        )}

        {gelSuccess && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">
              Ordonnance de gel conservatoire enregistrée ({successDetail || "En vigueur"}) pour la parcelle {parcelleCode}.
              Toute transaction, mutation ou aliénation est immédiatement bloquée dans tout le système d&apos;État.
            </span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="leading-relaxed font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Formulaire de gel judiciaire (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <Gavel className="w-4 h-4" />
                <span>Ordonnance Judiciaire de Gel Conservatoire</span>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Bloque instantanément toute tentative de cession sur le cadastre national dès signature du magistrat.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0">
              <form onSubmit={handleGel} className="space-y-4">
                {/* Ligne d'acquisition de la parcelle : Saisie IUF, Upload PDF Mairie et Scanner QR-Code */}
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">
                    Identifiant Unique Foncier (IUF) ou Réf. Pièce Litigieuse :
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="text"
                      value={parcelleCode}
                      onChange={(e) => setParcelleCode(e.target.value)}
                      required
                      placeholder="Ex: LIT-ALL-005, OUI-0421..."
                      className="font-mono uppercase h-10 text-xs bg-background flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzingPdf}
                      className="h-10 px-3 text-xs font-semibold gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                    >
                      {isAnalyzingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                      <span>{isAnalyzingPdf ? "Analyse..." : "Uploader Certificat (PDF)"}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsScannerModalOpen(true);
                        startCamera();
                      }}
                      className="h-10 px-3 text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 shrink-0 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Scanner QR</span>
                    </Button>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Vous pouvez saisir le code manuellement, téléverser le document PDF de la Mairie, ou scanner son QR-Code.
                  </span>
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

                {/* Zone de glisser-déposer de la pièce officielle de la Mairie */}
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
                  className="p-3 border-2 border-dashed border-destructive/30 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-4 h-4 text-destructive shrink-0" />
                    <span>
                      <strong>Glissez-déposez ici le Certificat de la Mairie ou Titre Foncier</strong> contesté pour extraire automatiquement l&apos;IUF au dossier.
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-destructive hover:bg-destructive/15 shrink-0"
                  >
                    Parcourir
                  </Button>
                </div>

                {/* Badge attestant la pièce jointe extraite */}
                {certificatMunicipal && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="font-bold text-foreground block">
                          Pièce Déposée : {certificatMunicipal.codeCertificat}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Quittance TrésorPay : {certificatMunicipal.quittanceTresorRef || "DGTCP-VALIDEE"} &bull; Commune de {certificatMunicipal.commune || "Bénin"}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                      Certifié Mairie
                    </Badge>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Partie Demanderesse / Requérant :</label>
                  <Input
                    type="text"
                    value={demandeur}
                    onChange={(e) => setDemandeur(e.target.value)}
                    required
                    className="h-10 text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Motif Juridique du Contentieux Foncier :</label>
                  <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="destructive"
                    className="flex-1 h-11 font-bold text-xs gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldAlert className="w-4 h-4" />
                    )}
                    <span>Signer l&apos;Ordonnance &amp; Activer le Gel Conservatoire</span>
                  </Button>
                  <Button
                    type="button"
                    disabled={loading}
                    variant="outline"
                    onClick={handleLeverGel}
                    className="h-11 font-bold text-xs gap-2 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Rendre Mainlevée du Gel</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Registre des contentieux en cours (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">Contentieux Actifs Inscrits au Greffe</CardTitle>
                  <Badge variant="destructive" className="text-[10px] font-semibold">
                    {activeLitiges.length} Instance{activeLitiges.length > 1 ? "s" : ""} Pendante{activeLitiges.length > 1 ? "s" : ""}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Registres des assignations et ordonnances d&apos;urgence en vigueur.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3 max-h-[460px] overflow-y-auto">
                {activeLitiges.length === 0 ? (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-center text-muted-foreground">
                    Aucun gel conservatoire actif en cours au greffe.
                  </div>
                ) : (
                  activeLitiges.map((litige) => (
                    <div key={litige.id} className="p-4 rounded-xl bg-background/80 border border-destructive/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground text-sm">{litige.parcelleCode}</span>
                        <Badge variant="destructive" className="text-[10px] gap-1 font-semibold">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Gel Conservatoire Actif</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {litige.demandeurNom} &bull; {litige.motif}
                      </p>
                      {litige.certificatMairieRef && (
                        <p className="text-[11px] text-primary font-mono font-semibold">
                          Pièce jointe : {litige.certificatMairieRef}
                        </p>
                      )}
                      <div className="text-[11px] text-muted-foreground pt-2 flex items-center justify-between border-t border-border/50">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span>{litige.referenceOrdonnance}</span>
                        </span>
                        <span className="text-[10px]">{litige.magistratNom}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground space-y-1.5">
              <span className="font-bold text-foreground block">Effet d&apos;Opposabilité de l&apos;Ordonnance :</span>
              <p className="leading-relaxed text-[11px]">
                En vertu de la Loi n° 2022-16, toute ordonnance de gel rendue par la CSAF suspend de plein droit les droits
                de mutation et emporte blocage immédiat de toute demande de réquisition au cadastre national ANDF.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Scanner QR-Code CSAF */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-rise">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-destructive" />
                <h3 className="font-bold text-foreground text-base">Scanner QR-Code de la Pièce du Litige</h3>
              </div>
              <button
                onClick={() => {
                  setIsScannerModalOpen(false);
                  stopCamera();
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-border">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-xs text-muted-foreground space-y-2">
                    <Camera className="w-8 h-8 mx-auto opacity-50 text-destructive" />
                    <p>{cameraError || "Activation du capteur optique en cours..."}</p>
                  </div>
                )}
                <div className="absolute inset-0 border-2 border-destructive/50 pointer-events-none m-8 rounded-lg flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-destructive/80 rounded" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Téléverser PDF Mairie</span>
                </Button>

                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyQrCode("CERTIF-COMMUNE-OUI-0421-2026-9315")}
                    className="text-[10px] font-mono"
                  >
                    Ex: OUI-0421
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyQrCode("LIT-ALL-005")}
                    className="text-[10px] font-mono text-destructive"
                  >
                    Ex: LIT-ALL-005
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Ou saisissez la charge utile du QR-Code :</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={manualQrInput}
                    onChange={(e) => setManualQrInput(e.target.value)}
                    placeholder="Coller le texte du QR-Code..."
                    className="text-xs h-9"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApplyQrCode(manualQrInput)}
                    className="h-9 px-4 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Valider
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
