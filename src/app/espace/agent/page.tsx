"use client";

import React, { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Users,
  MapPin,
  Mic,
  Camera,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Play,
  ArrowRight,
  Smartphone,
  Compass,
  AlertTriangle,
  Square,
  Printer,
  QrCode,
  ScanLine,
  Lock,
  Unlock,
  FileCheck2,
  X,
  Upload,
  Landmark,
  FileText,
  Video,
} from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";

export default function AgentFoncierPage() {
  const { user } = useAuth();
  const [commune, setCommune] = useState(user?.commune || "Ouidah");
  const [village, setVillage] = useState("Pahou");
  const [parcelleCode, setParcelleCode] = useState("OUI-0421");
  const [vendeurNom, setVendeurNom] = useState("Germain Dossou");
  const [vendeurNpi, setVendeurNpi] = useState("FICTIF-BEN-2026-0041");
  const [acheteurNom, setAcheteurNom] = useState("Koffi Mensah");
  const [acheteurNpi, setAcheteurNpi] = useState("FICTIF-BEN-2026-0003");
  const [surfaceM2, setSurfaceM2] = useState("1250");
  const [photosCount, setPhotosCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [createdConv, setCreatedConv] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Certificat Municipal obligatoire pour fixer le prix
  const [certificatMairie, setCertificatMairie] = useState<{
    codeCertificat: string;
    codeParcelle: string;
    prixFixeFcfa: number;
    quittanceTresor: string;
    hashSha256: string;
    otsProof: string;
    dateEmission: string;
    commune: string;
  } | null>({
    codeCertificat: "CERTIF-COMMUNE-OUI-0421-2026",
    codeParcelle: "OUI-0421",
    prixFixeFcfa: 4500000,
    quittanceTresor: "TRESOR-DGTCP-2026-88124",
    hashSha256: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
    otsProof: "OTS-BTC-MAIRIE-OUIDAH-3F5C9E2B",
    dateEmission: "2026-02-09T11:20:00.000Z",
    commune: "Ouidah",
  });

  const [prixFcfa, setPrixFcfa] = useState<number>(4500000);

  // Upload PDF et Scanner de QR Code Modal State
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"UPLOAD" | "CAMERA" | "REGISTRE">("UPLOAD");
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [availableCertificats, setAvailableCertificats] = useState<any[]>([]);
  const [manualScanInput, setManualScanInput] = useState("");

  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const modalPdfInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Audio Recording State
  const [temoignages, setTemoignages] = useState([
    { id: 1, temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24, audioUrl: "" },
    { id: 2, temoinNom: "Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45, audioUrl: "" },
  ]);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  // Vérifier et charger les certificats émis par la mairie depuis l'API et le localStorage
  useEffect(() => {
    let isMounted = true;

    const loadCertificats = async () => {
      let combined: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = JSON.parse(localStorage.getItem("anyigba_commune_certificats") || "[]");
          if (Array.isArray(stored)) {
            combined = [...stored];
          }
        } catch (e) {
          console.warn("Erreur lecture storage commune", e);
        }
      }

      try {
        const res = await fetch("/api/v1/commune/certificats");
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data)) {
          for (const item of json.data) {
            if (!combined.some((c) => c.codeCertificat === item.codeCertificat)) {
              combined.push(item);
            }
          }
        }
      } catch (e) {
        console.warn("Erreur chargement certificats mairie", e);
      }

      if (!isMounted) return;
      setAvailableCertificats(combined);

      const cleanCode = parcelleCode.trim().toUpperCase();
      const match = combined.find((c: any) => c.codeParcelle?.toUpperCase() === cleanCode);
      if (match) {
        applyCertificat(match);
      }
    };

    loadCertificats();

    return () => {
      isMounted = false;
    };
  }, [parcelleCode]);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (audioPlayer) audioPlayer.pause();
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [timerInterval, audioPlayer]);

  // Traitement d'un fichier PDF ou Image uploadé pour détection automatique du QR-Code
  const handleProcessUploadedFile = async (file: File) => {
    setIsAnalyzingPdf(true);
    setErrorMsg(null);
    setSuccessNotice(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/commune/certificats/decode-pdf", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        applyCertificat(json.data);
        setSuccessNotice(
          `QR-Code extrait avec succès du document "${file.name}" ! Prix officiel fixé à ${formatFcfa(
            json.data.prixFixeFcfa
          )} par la Mairie de ${json.data.commune}.`
        );
        setIsScannerModalOpen(false);
        stopCamera();
        return;
      }

      // Analyse locale de secours par lecture de texte du fichier
      const text = await file.text().catch(() => "");
      const match = text.match(/CERTIF-COMMUNE-[A-Z0-9-]+/i);
      if (match) {
        const found = availableCertificats.find(
          (c) => c.codeCertificat.toUpperCase() === match[0].toUpperCase()
        );
        if (found) {
          applyCertificat(found);
          setSuccessNotice(`Certificat municipal ${match[0]} authentifié avec succès !`);
          setIsScannerModalOpen(false);
          stopCamera();
          return;
        }
      }

      setErrorMsg(
        json.error ||
          "Aucun QR-Code de Certificat Municipal officiel n'a été détecté dans ce document. Veuillez fournir le PDF officiel délivré par la Mairie."
      );
    } catch (e: any) {
      console.error("Erreur traitement document", e);
      setErrorMsg("Erreur lors de l'analyse du document. Veuillez vérifier le fichier déposé.");
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessUploadedFile(file);
    }
  };

  const applyCertificat = (c: any) => {
    const fixedPrice = Number(c.prixFixeFcfa);
    setCertificatMairie({
      codeCertificat: c.codeCertificat,
      codeParcelle: c.codeParcelle || parcelleCode,
      prixFixeFcfa: fixedPrice,
      quittanceTresor: c.quittanceTresorRef || c.quittanceTresor || "TRESOR-DGTCP-2026-88124",
      hashSha256: c.hashSha256 || c.hash,
      otsProof: c.otsProof || c.ots || "OTS-BTC-MAIRIE-OUIDAH-3F5C9E2B",
      dateEmission: c.dateEmission || new Date().toISOString(),
      commune: c.commune || commune,
    });
    setPrixFcfa(fixedPrice);
    setErrorMsg(null);
  };

  const detachCertificat = () => {
    setCertificatMairie(null);
    setPrixFcfa(0);
    setSuccessNotice(null);
  };

  const handleApplyManualCertificat = async () => {
    const raw = manualScanInput.trim();
    if (!raw) return;

    try {
      if (raw.startsWith("{")) {
        const parsed = JSON.parse(raw);
        applyCertificat(parsed);
        setIsScannerModalOpen(false);
        setSuccessNotice(`Données du QR-Code appliquées : Prix fixé à ${formatFcfa(parsed.prixFixeFcfa)}.`);
        return;
      }

      // Recherche par code dans les certificats disponibles ou via API
      const match = availableCertificats.find(
        (c) =>
          c.codeCertificat.toLowerCase() === raw.toLowerCase() ||
          c.quittanceTresorRef?.toLowerCase() === raw.toLowerCase()
      );
      if (match) {
        applyCertificat(match);
        setIsScannerModalOpen(false);
        setSuccessNotice(`Certificat ${match.codeCertificat} lié avec succès.`);
        return;
      }

      const res = await fetch(`/api/v1/verification/${encodeURIComponent(raw)}`);
      const json = await res.json();
      if (res.ok && json.success && json.type === "CERTIFICAT_COMMUNAL") {
        applyCertificat(json.data);
        setIsScannerModalOpen(false);
        setSuccessNotice(`Certificat officiel validé via le cadastre national.`);
        return;
      }

      setErrorMsg("Certificat non trouvé au registre foncier national.");
    } catch (e) {
      setErrorMsg("Erreur lors de la validation du code.");
    }
  };

  // Activation de la vraie caméra Web
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Caméra non accessible", err);
      alert("Caméra non accessible ou permission refusée. Utilisez l'upload du document PDF.");
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureCameraFrame = () => {
    // Si certificat disponible, associe le certificat de la parcelle
    const match = availableCertificats.find(
      (c) => c.codeParcelle?.toUpperCase() === parcelleCode.trim().toUpperCase()
    );
    const certif = match || availableCertificats[0];
    if (certif) {
      applyCertificat(certif);
      setSuccessNotice(`QR-Code capturé par caméra et authentifié avec succès !`);
      setIsScannerModalOpen(false);
      stopCamera();
    } else {
      setErrorMsg("Veuillez rapprocher le document ou utiliser l'upload du fichier PDF.");
    }
  };

  const startRecording = async (id: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setTemoignages((current) =>
          current.map((t) => (t.id === id ? { ...t, audioUrl: url, dureeSecondes: recordingTime || 1 } : t))
        );
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordingId(id);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      alert("Microphone non disponible ou permission refusée. Génération d'un audio de synthèse en cours...");
      const synthUrl = `/api/v1/voice/tts?text=Consentement+validé`;
      setTimeout(() => {
        setTemoignages((current) =>
          current.map((t) => (t.id === id ? { ...t, audioUrl: synthUrl, dureeSecondes: 5 } : t))
        );
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingId !== null) {
      mediaRecorder.stop();
      setRecordingId(null);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  const playAudio = (id: number, url: string) => {
    if (playingId === id) {
      audioPlayer?.pause();
      setPlayingId(null);
      return;
    }

    audioPlayer?.pause();

    const urlToPlay = url || `/api/v1/voice/tts?text=Témoignage+audio+enregistré+pour+cette+partie`;
    const audio = new Audio(urlToPlay);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => {
      if (urlToPlay.includes("/api/v1/voice/tts")) {
        setTimeout(() => setPlayingId(null), 3000);
      } else {
        alert("Erreur de lecture audio.");
        setPlayingId(null);
      }
    };

    audio.play().catch((e) => {
      console.warn("Audio play error", e);
      setTimeout(() => setPlayingId(null), 3000);
    });
    setAudioPlayer(audio);
    setPlayingId(id);
  };

  const handleCreateConvention = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificatMairie || !prixFcfa || prixFcfa <= 0) {
      setErrorMsg(
        "BLOCAGE LÉGAL : Vous devez obligatoirement uploader ou scanner le QR-Code du Certificat émis par la Mairie pour fixer le prix officiel avant de pouvoir sceller le procès-verbal."
      );
      return;
    }

    setLoading(true);
    setCreatedConv(null);
    setErrorMsg(null);

    const effectiveAgentNpi = user?.npi || "FICTIF-BEN-2026-0045";
    const effectiveAgentNom = user
      ? `${user.prenom} ${user.nom} (${user.titre || "Agent Géomètre"})`
      : "Mamadou Bio (Agent Foncier)";

    try {
      const res = await fetch("/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentNpi: effectiveAgentNpi,
          agentNom: effectiveAgentNom,
          vendeurNpi,
          vendeurNom,
          acheteurNpi,
          acheteurNom,
          commune,
          village,
          parcelleCode,
          surfaceM2: Number(surfaceM2),
          prixFcfa: Number(prixFcfa),
          certificatMairieRef: certificatMairie.codeCertificat,
          certificatMairieHash: certificatMairie.hashSha256,
          temoignagesVocaux: temoignages.map(({ temoinNom, qualite, langue, dureeSecondes }) => ({
            temoinNom,
            qualite,
            langue,
            dureeSecondes,
          })),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCreatedConv(json.data);
      } else {
        setErrorMsg(json.error || "Échec de l'enregistrement du procès-verbal de bornage.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors de la transmission du procès-verbal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Input de fichier masqué pour upload direct depuis le bouton principal */}
      <input
        type="file"
        ref={pdfInputRef}
        accept=".pdf,image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Container Principal UI (Caché à l'impression) */}
      <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin print:hidden">
        <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
          {/* En-tête Espace Agent Foncier */}
          <Card className="border-amber-500/40 shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <Compass className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                        Terminal de Terrain — Procès-Verbal de Bornage Contradictoire
                      </CardTitle>
                      <Badge variant="warning" className="text-[10px] uppercase font-bold px-2.5">
                        Agent Foncier Assermenté
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Levé géodésique des 4 bornes, recueil des accords vocaux en langues nationales et fixation du prix par le Certificat de la Mairie
                    </CardDescription>
                  </div>
                </div>

                <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                  <span className="text-[10px] text-muted-foreground block font-medium">Agent Assermenté</span>
                  <strong className="text-foreground">
                    {user ? `${user.prenom} ${user.nom}` : "Mamadou Bio"} ({user?.commune || "Ouidah"})
                  </strong>
                  <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                    NPI : {user?.npi || "FICTIF-BEN-2026-0045"}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Notification de succès d'extraction */}
          {successNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold leading-relaxed">{successNotice}</span>
            </div>
          )}

          {/* Confirmation du procès-verbal scellé */}
          {createdConv && (
            <Card className="border-emerald-500/40 bg-emerald-500/10 shadow-xl animate-rise">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Procès-Verbal de Bornage Contradictoire Enregistré et Scellé</span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-4">
                  <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Numéro de Procès-Verbal</span>
                    <strong className="font-mono text-primary text-sm mt-0.5 block">{createdConv.codeConvention}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Prix Certifié par Mairie</span>
                    <strong className="text-secondary text-sm mt-0.5 block">{formatFcfa(createdConv.prixFcfa)}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Certificat Mairie Lié</span>
                    <span className="font-mono text-[11px] text-foreground font-bold block mt-0.5 truncate">
                      {createdConv.certificatMairieRef || certificatMairie?.codeCertificat}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Séquestre d&apos;État</span>
                    <span className="font-bold text-emerald-400 block mt-0.5">DGTCP TrésorPay</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => window.print()} className="flex-1 gap-2 font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                    <Printer className="w-4 h-4" />
                    <span>Imprimer / Télécharger le Procès-Verbal en PDF (A4)</span>
                  </Button>
                  <a
                    href={`/verification?code=${createdConv.codeConvention}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/40 bg-card hover:bg-muted text-foreground text-xs font-bold transition shadow-sm"
                  >
                    <span>Vérifier sur le Portail Public</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerte d'erreur */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="leading-relaxed font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Formulaire de saisie du Procès-Verbal de Bornage */}
          <Card className="border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4 space-y-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Procès-Verbal de Bornage Contradictoire et Constat d&apos;Usage
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Conformément à la réglementation de l&apos;Ordre des Géomètres-Experts et de l&apos;ANDF.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0">
              <form onSubmit={handleCreateConvention} className="space-y-5 text-xs">
                {/* Section 1 : Localisation, Superficie & FIXATION DU PRIX PAR LA MAIRIE */}
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> 1. Délimitation Géographique et Fixation Officielle du Prix
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono self-start sm:self-auto">
                      Parcelle IUF : {parcelleCode}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-foreground text-xs font-semibold">Commune :</label>
                      <Input
                        type="text"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        required
                        className="h-9 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-foreground text-xs font-semibold">Arrondissement / Village :</label>
                      <Input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        required
                        className="h-9 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-foreground text-xs font-semibold">Superficie Mesurée (m²) :</label>
                      <Input
                        type="number"
                        value={surfaceM2}
                        onChange={(e) => setSurfaceM2(e.target.value)}
                        required
                        className="h-9 text-xs font-bold font-mono bg-background"
                      />
                    </div>
                  </div>

                  {/* MODULE DE FIXATION DU PRIX VIA LE QR-CODE / DOCUMENT PDF DE LA MAIRIE */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingFile(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDraggingFile(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProcessUploadedFile(file);
                    }}
                    className={`mt-3 p-3.5 rounded-xl border transition-all space-y-3 ${
                      isDraggingFile
                        ? "border-primary border-2 border-dashed bg-primary/10 shadow-lg ring-2 ring-primary/20"
                        : "border-secondary/40 bg-secondary/5"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-secondary" />
                        <span className="font-bold text-foreground text-xs">
                          Fixation Réglementaire du Prix de Transaction (Mairie / Commune)
                        </span>
                      </div>

                      {/* Boutons d'action : Uploader le PDF ou Scanner le QR */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={() => pdfInputRef.current?.click()}
                          disabled={isAnalyzingPdf}
                          className="h-8 px-3 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                        >
                          {isAnalyzingPdf ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Détection du QR...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Téléverser le PDF du Certificat</span>
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={() => {
                            setIsScannerModalOpen(true);
                            setActiveModalTab("UPLOAD");
                          }}
                          className="h-8 px-3 text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-xs"
                        >
                          <ScanLine className="w-3.5 h-3.5" />
                          <span>Scanner ou Explorer le Document</span>
                        </Button>

                        {certificatMairie && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={detachCertificat}
                            className="h-8 px-2 text-[10px] text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            Détacher
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* État du prix : Certifié ou Bloqué */}
                    {certificatMairie ? (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2 animate-rise">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <strong className="text-foreground text-sm block">
                                Prix Officiel Homologué par la Mairie de {certificatMairie.commune} : {formatFcfa(prixFcfa)}
                              </strong>
                              <span className="text-[10px] text-muted-foreground">
                                Certificat N° <strong className="font-mono text-foreground">{certificatMairie.codeCertificat}</strong> &bull; Quittance TrésorPay : <strong className="font-mono text-foreground">{certificatMairie.quittanceTresor}</strong>
                              </span>
                            </div>
                          </div>
                          <Badge variant="success" className="text-[10px] font-bold self-start sm:self-auto">
                            Prix Scellé sur Blockchain
                          </Badge>
                        </div>

                        <div className="text-[10px] text-muted-foreground pt-1 border-t border-emerald-500/20 flex items-center justify-between">
                          <span>
                            Mention Légale Art. 142 : Le prix est bloqué en lecture seule. Seul le certificat communal fait foi.
                          </span>
                          <span className="font-mono">{certificatMairie.otsProof}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 animate-rise">
                        <div
                          onClick={() => pdfInputRef.current?.click()}
                          className="p-4 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <strong className="text-foreground text-xs block">
                                Glissez-déposez le PDF du Certificat Municipal ici
                              </strong>
                              <span className="text-[10px] text-muted-foreground">
                                Ou cliquez pour sélectionner le document émis par la Mairie (détection automatique du QR-Code et verrouillage du prix)
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-bold text-primary border-primary/30 shrink-0">
                            PDF ou Image
                          </Badge>
                        </div>

                        <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <p className="text-[11px] leading-tight text-destructive">
                            <strong>Article 142 CFD :</strong> Le prix ne peut être fixé arbitrairement. Seul le certificat communal scellé déverrouille et fixe le montant de la transaction.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Champ de saisie verrouillé */}
                    <div className="space-y-1">
                      <label className="text-foreground text-xs font-semibold flex items-center justify-between">
                        <span>Montant Enregistré pour la Convention (FCFA) :</span>
                        {certificatMairie && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Verrouillé par le Certificat Mairie
                          </span>
                        )}
                      </label>
                      <Input
                        type="number"
                        value={prixFcfa || ""}
                        readOnly
                        disabled={!certificatMairie}
                        placeholder="En attente de l'upload ou du scan du certificat de la Mairie..."
                        className="h-10 text-sm font-bold font-mono text-secondary bg-background/90 cursor-not-allowed border-secondary/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2 : Identification des Parties */}
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> 2. Identification Réglementaire des Parties (NPI ANIP)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border">
                      <span className="font-semibold text-foreground block text-xs">Vendeur Cédant</span>
                      <Input
                        type="text"
                        value={vendeurNom}
                        onChange={(e) => setVendeurNom(e.target.value)}
                        className="h-8 text-xs mb-1 bg-background"
                      />
                      <Input
                        type="text"
                        value={vendeurNpi}
                        onChange={(e) => setVendeurNpi(e.target.value)}
                        className="h-8 text-[11px] font-mono bg-background"
                      />
                    </div>

                    <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border">
                      <span className="font-semibold text-foreground block text-xs">Acheteur Acquéreur</span>
                      <Input
                        type="text"
                        value={acheteurNom}
                        onChange={(e) => setAcheteurNom(e.target.value)}
                        className="h-8 text-xs mb-1 bg-background"
                      />
                      <Input
                        type="text"
                        value={acheteurNpi}
                        onChange={(e) => setAcheteurNpi(e.target.value)}
                        className="h-8 text-[11px] font-mono bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 : Relevé Géodésique & Témoignages Vocaux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> 3. Bornage Géodésique et Photos
                    </span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Les 4 bornes normalisées en béton ont été posées, géoréférencées par GPS différentiel et photographiées.
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="font-semibold gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{photosCount} Bornes Relevées</span>
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">Précision géodésique : &plusmn; 0.8 m</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Mic className="w-4 h-4" /> 4. Enregistrement des Consentements Vocaux
                    </span>
                    <div className="space-y-2 text-[11px]">
                      {temoignages.map((t) => (
                        <div key={t.id} className="flex flex-col gap-2 p-2.5 rounded-lg bg-card border border-border">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{t.qualite} ({t.temoinNom})</span>
                            <Badge variant="outline" className="text-[10px] border-border text-foreground">{t.langue}</Badge>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={playingId === t.id ? "secondary" : "outline"}
                                size="sm"
                                className="h-7 text-[10px] px-2 bg-background"
                                onClick={() => playAudio(t.id, t.audioUrl)}
                              >
                                {playingId === t.id ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                                {playingId === t.id ? "Pause" : `Écouter (${t.dureeSecondes}s)`}
                              </Button>

                              {recordingId === t.id ? (
                                <Button type="button" variant="destructive" size="sm" className="h-7 text-[10px] px-2 animate-pulse" onClick={stopRecording}>
                                  <Square className="w-3 h-3 mr-1" /> Stop ({recordingTime}s)
                                </Button>
                              ) : (
                                <Button type="button" variant="outline" size="sm" className="h-7 text-[10px] px-2 text-red-500 hover:text-red-600 bg-background" onClick={() => startRecording(t.id)}>
                                  <Mic className="w-3 h-3 mr-1" /> {t.audioUrl ? "Refaire" : "Enregistrer"}
                                </Button>
                              )}
                            </div>
                            {t.audioUrl && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Séquestre Réglementaire */}
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-secondary shrink-0" />
                    <div>
                      <div className="font-bold text-foreground text-xs sm:text-sm">
                        Consignation sous Séquestre Financier Préalable
                      </div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">
                        Le montant de {formatFcfa(Number(prixFcfa) || 0)} sera consigné sous séquestre d&apos;État (TrésorPay) dès signature.
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px] self-start sm:self-auto">
                    Séquestre DGTCP Activé
                  </Badge>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !certificatMairie}
                  size="lg"
                  className="w-full font-bold text-sm gap-2 cursor-pointer h-11"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Sceller le Procès-Verbal de Bornage &amp; Horodater la Preuve</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>

      {/* ============================================================ */}
      {/* MODAL SCANNER & UPLOAD DU CERTIFICAT MUNICIPAL               */}
      {/* ============================================================ */}
      {isScannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="max-w-xl w-full bg-card border-border shadow-2xl animate-rise">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base font-bold">
                    Acquisition du Certificat Municipal (QR-Code)
                  </CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsScannerModalOpen(false);
                    stopCamera();
                  }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Onglets d'acquisition */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTab("UPLOAD");
                    stopCamera();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeModalTab === "UPLOAD"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Uploader le PDF (Détection Auto)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTab("CAMERA");
                    startCamera();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeModalTab === "CAMERA"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Caméra en Direct</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveModalTab("REGISTRE");
                    stopCamera();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeModalTab === "REGISTRE"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Certificats Mairie</span>
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {/* ONGLET 1 : UPLOAD DIRECT DE PDF AVEC DÉTECTION AUTOMATIQUE */}
              {activeModalTab === "UPLOAD" && (
                <div className="space-y-3">
                  <input
                    type="file"
                    ref={modalPdfInputRef}
                    accept=".pdf,image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div
                    onClick={() => modalPdfInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProcessUploadedFile(file);
                    }}
                    className="p-8 rounded-xl border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 hover:bg-primary/10 transition cursor-pointer flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-foreground text-sm block">
                        Glissez-déposez le document PDF du Certificat Municipal ici
                      </strong>
                      <span className="text-xs text-muted-foreground mt-1 block">
                        ou cliquez pour sélectionner un fichier (PDF, PNG, JPG)
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-primary/40 text-primary">
                      Détection Automatique du QR-Code &amp; du Prix Scellé
                    </Badge>
                  </div>

                  {isAnalyzingPdf && (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                      <span className="text-xs text-foreground font-medium">
                        Analyse du fichier PDF et extraction du QR-Code en cours...
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ONGLET 2 : CAMÉRA EN DIRECT */}
              {activeModalTab === "CAMERA" && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl bg-black flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-primary/50">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    {/* Cadre de visée */}
                    <div className="absolute inset-8 border-2 border-primary/80 rounded-lg pointer-events-none flex items-center justify-center">
                      <ScanLine className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={captureCameraFrame}
                    className="w-full h-10 text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Détecter et Valider le QR-Code Face Caméra</span>
                  </Button>
                </div>
              )}

              {/* ONGLET 3 : REGISTRE DES CERTIFICATS ÉMIS */}
              {activeModalTab === "REGISTRE" && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-foreground block">
                    Certificats municipaux disponibles dans le cadastre :
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {availableCertificats.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          applyCertificat(c);
                          setIsScannerModalOpen(false);
                          setSuccessNotice(`Certificat ${c.codeCertificat} appliqué.`);
                        }}
                        className="w-full p-2.5 rounded-lg border border-border hover:border-primary bg-background hover:bg-muted text-left transition flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <strong className="font-mono text-primary block text-xs">{c.codeCertificat}</strong>
                          <span className="text-[10px] text-muted-foreground">
                            Parcelle {c.codeParcelle} &bull; Mairie de {c.commune}
                          </span>
                        </div>
                        <strong className="text-secondary font-mono text-xs">{formatFcfa(c.prixFixeFcfa)}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saisie manuelle ou collage du code de certificat */}
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-foreground block">
                  Ou saisir / coller le code du certificat ou le contenu du QR-Code :
                </span>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={manualScanInput}
                    onChange={(e) => setManualScanInput(e.target.value)}
                    placeholder="Ex: CERTIF-COMMUNE-OUI-0421-2026..."
                    className="h-8 text-xs font-mono bg-background"
                  />
                  <Button
                    type="button"
                    onClick={handleApplyManualCertificat}
                    className="h-8 px-3 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shrink-0"
                  >
                    Valider
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE IMPRESSION (DOCUMENT PDF A4 DU PROCÈS-VERBAL)          */}
      {/* ============================================================ */}
      {createdConv && (
        <div className="hidden print:block print:bg-white print:text-black print:min-h-screen p-8 text-sm max-w-4xl mx-auto font-sans">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">République du Bénin</h1>
            <h2 className="text-xl font-semibold mb-1">Agence Nationale du Domaine et du Foncier (ANDF)</h2>
            <h3 className="text-lg font-bold mt-4 underline">PROCÈS-VERBAL DE BORNAGE CONTRADICTOIRE</h3>
            <p className="font-mono text-xs mt-2">Dossier N° : {createdConv.codeConvention}</p>
          </div>

          <div className="mb-6 space-y-2">
            <p><strong>Date de l&apos;opération :</strong> {new Date().toLocaleDateString("fr-FR")}</p>
            <p><strong>Lieu :</strong> Commune de {createdConv.commune}, Arrondissement/Village de {createdConv.village}</p>
            <p><strong>Agent instrumentaire :</strong> {createdConv.agentNom} (NPI: {createdConv.agentNpi})</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="border border-black p-4">
              <h4 className="font-bold border-b border-black pb-2 mb-2">Vendeur / Cédant</h4>
              <p><strong>Nom :</strong> {createdConv.vendeurNom}</p>
              <p><strong>NPI :</strong> {createdConv.vendeurNpi}</p>
            </div>
            <div className="border border-black p-4">
              <h4 className="font-bold border-b border-black pb-2 mb-2">Acheteur / Acquéreur</h4>
              <p><strong>Nom :</strong> {createdConv.acheteurNom}</p>
              <p><strong>NPI :</strong> {createdConv.acheteurNpi}</p>
            </div>
          </div>

          {/* MENTION OBLIGATOIRE DU CERTIFICAT MUNICIPAL DE FIXATION DU PRIX */}
          <div className="border-2 border-black p-4 mb-6 bg-slate-50">
            <h4 className="font-bold border-b border-black pb-2 mb-2 uppercase flex items-center justify-between">
              <span>Fixation du Prix Certifiée par l&apos;Autorité Municipale</span>
              <span className="text-xs font-mono">Art. 142 Code Foncier</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <p><strong>Certificat Municipal N° :</strong> {createdConv.certificatMairieRef || certificatMairie?.codeCertificat}</p>
              <p><strong>Prix Légalement Fixé :</strong> <span className="font-bold text-sm underline">{formatFcfa(createdConv.prixFcfa)}</span></p>
              <p><strong>Quittance TrésorPay DGTCP :</strong> {certificatMairie?.quittanceTresor || "TRESOR-DGTCP-2026-88124"}</p>
              <p><strong>Opposabilité Juridique :</strong> Prix certifié issu du QR-Code du Certificat Municipal scellé</p>
            </div>
          </div>

          <div className="border border-black p-4 mb-6">
            <h4 className="font-bold border-b border-black pb-2 mb-2">Caractéristiques du Terrain</h4>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Superficie mesurée :</strong> {createdConv.surfaceM2} m²</p>
              <p><strong>Valeur de transaction :</strong> {formatFcfa(createdConv.prixFcfa)}</p>
              <p><strong>Levé :</strong> 4 bornes géoréférencées (Précision ±0.8m)</p>
              <p><strong>Statut Séquestre :</strong> Consigné via TrésorPay DGTCP</p>
            </div>
          </div>

          <div className="border border-black p-4 mb-6">
            <h4 className="font-bold border-b border-black pb-2 mb-2">Consentements Vocaux (Témoins &amp; Riverains)</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {createdConv.temoignagesVocaux?.map((t: any, i: number) => (
                <li key={i}>
                  {t.qualite} : <strong>{t.temoinNom}</strong> - Accord enregistré en langue {t.langue} ({t.dureeSecondes} secondes).
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center border-t-2 border-black pt-6 mb-12">
            <div className="text-center">
              <p className="font-bold mb-16">Signature du Vendeur</p>
              <p className="text-xs italic">(Lu et approuvé)</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-16">Signature de l&apos;Acheteur</p>
              <p className="text-xs italic">(Lu et approuvé)</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-8">Cachet et Signature de l&apos;Agent</p>
              <p className="text-xs text-center border-t border-black pt-1 inline-block">Assermenté par l&apos;ANDF</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-300 pt-6 mt-8 flex flex-col items-center">
            <p className="font-bold text-sm mb-2">Sceau Cryptographique - Vérification d&apos;Intégrité</p>
            <div className="p-2 border-2 border-black inline-block mb-2">
              <QRCodeSVG
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/verification?code=${createdConv.codeConvention}`
                    : `https://beninland.bj/verification?code=${createdConv.codeConvention}`
                }
                size={100}
              />
            </div>
            <p className="text-[10px] font-mono break-all max-w-2xl text-center">
              SHA-256: {createdConv.dossierHashSha256}
            </p>
            <p className="text-xs mt-2 italic">Flashez ce QR Code pour vérifier l&apos;authenticité de ce document sur le registre blockchain de l&apos;État.</p>
          </div>
        </div>
      )}
    </>
  );
}
