"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Fingerprint,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Compass,
  Coins,
  ArrowRight,
  LogIn,
  Link as LinkIcon,
  Landmark,
} from "lucide-react";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { formatFcfa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export function VerificationSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState("OUI-0421");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Lecteur audio pour les structures de droit
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Structures de droit habilitées à écouter les vocaux et accéder au coffre-fort
  const isStructureDeDroit = Boolean(
    user &&
      [
        "ANDF",
        "NOTAIRE",
        "CSAF",
        "MINISTERE",
        "CONTROLEUR",
        "AGENT",
        "COMMUNE",
        "BANQUE",
      ].includes(user.role)
  );

  // Détection automatique de paramètre ?code=... dans l'URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get("code");
      if (urlCode) {
        setQuery(urlCode);
        handleSearch(urlCode);
      }
    }
  }, []);

  const handleSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || query).trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/v1/verification/${encodeURIComponent(code)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setResult(json);
      } else {
        setError(json.error || "Référence introuvable au registre foncier national.");
      }
    } catch (e) {
      setError("Erreur de liaison avec le serveur du cadastre national.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (code: string) => {
    setQuery(code);
    handleSearch(code);
  };

  const playWitnessAudio = (id: string, text: string, lang: string) => {
    if (playingId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingId(id);

    // Tentative TTS backend ou fallback Web Speech
    const targetLang = lang.toLowerCase().includes("fon") ? "fon" : "fr";
    const audioUrl = `/api/v1/voice/tts?text=${encodeURIComponent(text)}&language=${targetLang}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };

    audio.onerror = () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlayingId(null);
      }
    };

    audio.play().catch(() => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.onend = () => setPlayingId(null);
        utterance.onerror = () => setPlayingId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlayingId(null);
      }
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Barre de recherche officielle universelle */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Saisir IUF, N° Procès-Verbal ou Hash : CONV-VIL-2026-042, OUI-0421..."
            className="pl-10 pr-4 h-12 text-sm font-semibold tracking-wider placeholder:normal-case placeholder:tracking-normal bg-card border-border"
          />
          <Search className="w-5 h-5 text-primary absolute left-3 top-3.5" />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="h-12 px-6 font-bold shrink-0 text-sm shadow-md cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FileSearch className="w-4 h-4" />
              <span>Vérifier l&apos;Authenticité</span>
            </>
          )}
        </Button>
      </form>

      {/* Raccourcis de consultation */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] text-muted-foreground font-semibold">
          Exemples certifiés :
        </span>
        <button
          type="button"
          onClick={() => handleChipClick("CONV-VIL-2026-042")}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <Compass className="w-3 h-3 text-emerald-400" />
          <span>CONV-VIL-2026-042 (Procès-Verbal Pahou)</span>
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("CERTIF-COMMUNE-OUI-0421-2026")}
          className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <Coins className="w-3 h-3 text-blue-400" />
          <span>CERTIF-COMMUNE-OUI-0421 (Prix Mairie)</span>
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("OUI-0421")}
          className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-[11px] transition cursor-pointer"
        >
          OUI-0421 (Parcelle Titrée)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("CAL-0089")}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <Lock className="w-3 h-3" />
          <span>CAL-0089 (Verrou Notarié)</span>
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("LIT-ALL-005")}
          className="px-2.5 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>LIT-ALL-005 (Litige CSAF)</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* VUE 1 : RÉSULTAT POUR UN PROCÈS-VERBAL DE BORNAGE           */}
      {/* ============================================================ */}
      {result && result.type === "PROCES_VERBAL_BORNAGE" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-emerald-500/40 shadow-xl space-y-5 animate-rise">
          {/* En-tête du Procès-Verbal */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-lg font-black text-foreground">
                  {result.data.codeConvention}
                </span>
                <Badge variant="success" className="gap-1 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Procès-Verbal Authentique &amp; Scellé</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Commune de <strong>{result.data.commune}</strong> &bull; Arrondissement/Village :{" "}
                <strong>{result.data.village}</strong> &bull; Levé géodésique certifié par{" "}
                <span className="text-foreground font-semibold">{result.data.agentNom}</span>
              </p>
            </div>

            {/* QR Code Scannable */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
              <QRCodeSVG
                value={`https://beninland.bj/verification?code=${result.data.codeConvention}`}
                size={64}
              />
              <div className="text-[10px] text-slate-600 font-mono leading-tight">
                <span className="font-bold text-slate-900 block">QR Sceau Légal</span>
                <span>Scannable public</span>
              </div>
            </div>
          </div>

          {/* Grille des caractéristiques certifiées */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Superficie Mesurée</span>
              <strong className="text-foreground font-mono text-sm block mt-0.5">
                {result.data.surfaceM2} m²
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Séquestre DGTCP</span>
              <strong className="text-secondary font-mono text-xs block mt-0.5">
                {formatFcfa(result.data.prixFcfa)}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Bornage Géodésique</span>
              <span className="font-bold text-emerald-400 block mt-0.5">
                {result.data.photosBornesCount} Bornes Référencées (±0.8m)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Date d&apos;Ancrage</span>
              <span className="text-foreground text-[11px] block mt-0.5">
                {new Date(result.data.dateSignature).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          {/* Liaison réglementaire avec le Certificat Municipal de Fixation du Prix */}
          {result.data.certificatMairieRef && (
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Coins className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <span>Prix Légalement Fixé par l&apos;Autorité Municipale</span>
                    <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400">
                      Art. 142 Code Foncier
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Certificat Municipal N° <strong className="font-mono text-foreground">{result.data.certificatMairieRef}</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChipClick(result.data.certificatMairieRef)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0 shadow-sm"
              >
                <span>Consulter le Certificat Mairie</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Preuve Cryptographique OpenTimestamps & Traçabilité Blockchain */}
          <div className="p-4 rounded-xl bg-background/90 border border-primary/30 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                <Fingerprint className="w-4 h-4 text-primary" />
                <span>Ancrage Blockchain &amp; Preuve OpenTimestamps</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-primary/40 text-primary">
                {result.data.otsProof}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[10px]">Empreinte Merkle SHA-256 :</span>
                <span className="text-foreground font-bold truncate block">{result.data.dossierHashSha256}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[10px]">Identifiant Transaction Blockchain :</span>
                <span className="text-secondary font-bold truncate block">{result.data.txBlockchainId}</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Garantie d&apos;Immutabilité Souveraine :</strong> Tout changement apporté au procès-verbal
                modifie mathématiquement l&apos;empreinte SHA-256 et brise le sceau OpenTimestamps. L&apos;ensemble des structures de droit
                (ANDF, CSAF, Notaires) sont automatiquement informées de l&apos;altération et de l&apos;identité du signataire.
              </span>
            </div>
          </div>

          {/* SECTION RÉGLEMENTAIRE : COFFRE-FORT DES PREUVES VOCALES */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {isStructureDeDroit ? (
                  <Unlock className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-500" />
                )}
                <span className="font-bold text-sm text-foreground">
                  {isStructureDeDroit
                    ? "Coffre-fort Déverrouillé — Consentements Vocaux des Riverains"
                    : "Consentements Vocaux sous Séquestre Réglementaire"}
                </span>
              </div>

              {isStructureDeDroit ? (
                <Badge variant="success" className="text-[10px] gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Accès Officier Public Habilité ({user?.role})</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px] gap-1 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>Accès Restreint aux Structures de Droit</span>
                </Badge>
              )}
            </div>

            {/* CAS 1 : UTILISATEUR = STRUCTURE DE DROIT HABILITÉE */}
            {isStructureDeDroit ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-muted-foreground">
                  En tant qu&apos;officier ou structure de droit assermentée, vous avez accès aux consentements vocaux complets
                  recueillis sur le terrain et aux identifiants ANIP complets des parties :
                </p>

                {/* Identification complète */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-background/80 p-3 rounded-xl border border-border">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Cédant Vendeur :</span>
                    <strong className="text-foreground">{result.data.vendeurNom}</strong>
                    <span className="block font-mono text-[10px] text-muted-foreground">NPI : {result.data.vendeurNpi}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Acquéreur :</span>
                    <strong className="text-foreground">{result.data.acheteurNom}</strong>
                    <span className="block font-mono text-[10px] text-muted-foreground">NPI : {result.data.acheteurNpi}</span>
                  </div>
                </div>

                {/* Lecteur interactif des témoignages vocaux */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-foreground block">
                    Enregistrements Vocaux Scellés :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.data.temoignagesVocaux && result.data.temoignagesVocaux.length > 0 ? (
                      result.data.temoignagesVocaux.map((t: any, idx: number) => {
                        const isThisPlaying = playingId === `witness-${idx}`;
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-background border border-border flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div>
                              <strong className="text-xs text-foreground block">
                                {t.qualite} ({t.temoinNom})
                              </strong>
                              <span className="text-[10px] text-muted-foreground">
                                Accord verbal en {t.langue} &bull; {t.dureeSecondes}s
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant={isThisPlaying ? "destructive" : "default"}
                              size="sm"
                              onClick={() =>
                                playWitnessAudio(
                                  `witness-${idx}`,
                                  `Moi, ${t.temoinNom}, ${t.qualite}, atteste sur l'honneur la délimitation exacte et l'accord de vente.`,
                                  t.langue
                                )
                              }
                              className="text-xs font-bold gap-1.5 h-8 shrink-0 cursor-pointer"
                            >
                              {isThisPlaying ? (
                                <>
                                  <Square className="w-3.5 h-3.5" />
                                  <span>Arrêter</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  <span>Écouter</span>
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-muted-foreground italic col-span-2">
                        2 consentements vocaux légaux scellés dans le dossier.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* CAS 2 : GRAND PUBLIC / UTILISATEUR NON-HABILITÉ */
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs space-y-2.5">
                <p className="leading-relaxed text-foreground">
                  Conformément au <strong>Code Foncier et Domanial</strong> et au <strong>Code du Numérique</strong> régissant
                  la protection des données à caractère personnel, l&apos;écoute des enregistrements vocaux intégraux des témoins
                  et les coordonnées ANIP intégrales sont <strong>protégées sous séquestre d&apos;État</strong>.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-muted-foreground">
                    Parties déclarées : Cédant <strong className="text-foreground">{result.data.vendeurNomMasque}</strong> &bull; Acquéreur <strong className="text-foreground">{result.data.acheteurNomMasque}</strong>
                  </div>
                  <Link
                    href="/login?tab=connexion"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a3764] hover:bg-[#082a4d] text-white font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Connexion Structure de Droit</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VUE 1.5 : CERTIFICAT MUNICIPAL D'ÉVALUATION ET DE FIXATION DU PRIX */}
      {/* ============================================================ */}
      {result && result.type === "CERTIFICAT_COMMUNAL" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-blue-500/40 shadow-xl space-y-5 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-lg font-black text-foreground">
                  {result.data.codeCertificat}
                </span>
                <Badge variant="success" className="gap-1 font-bold text-[11px] bg-blue-600 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Certificat Municipal Authentique</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {result.data.autorite} &bull; Parcelle Cadastrale :{" "}
                <strong className="text-foreground font-mono">{result.data.codeParcelle}</strong> ({result.data.arrondissement})
              </p>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
              <QRCodeSVG
                value={JSON.stringify({
                  type: "CERTIFICAT_COMMUNE_PRIX",
                  codeCertificat: result.data.codeCertificat,
                  codeParcelle: result.data.codeParcelle,
                  commune: result.data.commune,
                  prixFixeFcfa: result.data.prixFixeFcfa,
                  taxePayeeFcfa: result.data.taxeCalculeeFcfa,
                  quittanceTresor: result.data.quittanceTresorRef,
                  hash: result.data.hashSha256,
                  ots: result.data.otsProof,
                })}
                size={70}
              />
              <div className="text-[10px] text-slate-600 font-mono leading-tight">
                <span className="font-bold text-slate-900 block">QR Prix Officiel</span>
                <span>Scannable Agent</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Prix Fixé par la Mairie</span>
              <strong className="text-secondary font-mono text-sm block mt-0.5">
                {formatFcfa(result.data.prixFixeFcfa)}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Taxe Communale (5%)</span>
              <strong className="text-foreground font-mono text-xs block mt-0.5">
                {formatFcfa(result.data.taxeCalculeeFcfa)}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Quittance TrésorPay</span>
              <span className="font-mono text-emerald-400 font-bold block mt-0.5 truncate">
                {result.data.quittanceTresorRef}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Statut Trésor</span>
              <span className="font-bold text-success text-[11px] block mt-0.5">
                Encaissé DGTCP (100%)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-background/90 border border-blue-500/30 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                <Fingerprint className="w-4 h-4 text-blue-400" />
                <span>Scellement Blockchain &amp; Preuve d&apos;Évaluation Municipale</span>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] border-blue-500/40 text-blue-400">
                {result.data.otsProof}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[10px]">Hash SHA-256 Acte Municipal :</span>
                <span className="text-foreground font-bold truncate block">{result.data.hashSha256}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[10px]">Identifiant Débit Trésor Public :</span>
                <span className="text-foreground font-bold truncate block">{result.data.txBlockchainId}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground italic pt-1 border-t border-border/60">
              {result.data.forceLegale}
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VUE 2 : RÉSULTAT POUR UNE PARCELLE CADASTRALE              */}
      {/* ============================================================ */}
      {result && result.type === "PARCELLE" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-foreground">{result.data.codeUnique}</span>
                <span className="text-xs text-muted-foreground">
                  Commune de {result.data.commune} &bull; Arr. {result.data.arrondissement} ({result.data.village})
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Superficie légale : <strong className="text-foreground font-mono">{formatFcfa(result.data.superficieM2).replace("FCFA", "")} m²</strong> (calcul Shoelace certifié)
              </div>
            </div>

            <div className="flex items-center gap-2">
              {result.data.enLitige ? (
                <Badge variant="destructive" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  GEL CONSERVATOIRE CSAF
                </Badge>
              ) : result.data.enVerrouMutation ? (
                <Badge variant="warning" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <Lock className="w-4 h-4" />
                  VERROU NOTARIAL ACTIF
                </Badge>
              ) : (
                <Badge variant="success" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  PARCELLE DISPONIBLE À LA MUTATION
                </Badge>
              )}
            </div>
          </div>

          {/* Grille des caractéristiques juridiques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Régime Foncier</span>
              <span className="font-bold text-foreground truncate block mt-0.5">
                {result.data.statutJuridique === "TITRE_FONCIER"
                  ? "Titre Foncier (TF)"
                  : result.data.statutJuridique === "CPF"
                  ? "Certificat (CPF)"
                  : "Droit Coutumier"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Titulaire (Données ANIP)</span>
              <span className="font-bold text-foreground truncate block mt-0.5">{result.data.proprietaireMasque}</span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Empreinte BéninChain</span>
              <span className="font-mono text-[10px] text-primary truncate block font-bold mt-0.5">
                {result.data.tokenBeninChainId || "TKN-PROV-2026"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Éligibilité Transactionnelle</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {result.data.eligibleAchat ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="font-bold text-success">Éligible à la vente</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="font-bold text-destructive">Cession bloquée</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Attestation vocale multilingue */}
          <AudioPhrasePlayer
            phraseKey={
              result.data.enLitige
                ? "parcelle_en_litige"
                : result.data.enVerrouMutation
                ? "parcelle_verrouillee"
                : "parcelle_titre_foncier_valide"
            }
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* VUE 4 : RÉSULTAT POUR UNE HYPOTHÈQUE DE RANG 1 (BCEAO/OHADA) */}
      {/* ============================================================ */}
      {result && result.type === "HYPOTHEQUE_RANG_1" && (
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-cyan-500/40 shadow-xl space-y-4 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-lg font-black text-foreground">
                  {result.data.codeHypotheque}
                </span>
                <Badge variant="info" className="gap-1 font-bold text-[11px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hypothèque Inscrite de Rang 1 (BCEAO / OHADA)</span>
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Créancier : <strong className="text-foreground">{result.data.banqueNom}</strong> &bull; Parcelle grevée :{" "}
                <strong className="text-cyan-600 dark:text-cyan-400 font-mono">{result.data.parcelleCode}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
              <QRCodeSVG
                value={`https://beninland.gouv.bj/verification/${result.data.codeHypotheque}`}
                size={64}
              />
              <div className="text-[10px] text-slate-600 font-mono leading-tight">
                <span className="font-bold text-slate-900 block">Sceau Sûreté</span>
                <span>BCEAO Rang 1</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Débiteur / Constituant</span>
              <strong className="text-foreground truncate block mt-0.5">{result.data.demandeurNom}</strong>
              <span className="text-[9px] font-mono text-muted-foreground">{result.data.demandeurNpi}</span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Créance Garantie</span>
              <strong className="text-cyan-600 dark:text-cyan-400 font-mono text-sm block mt-0.5">
                {formatFcfa(result.data.montantCreditFcfa)}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Valeur Retenue</span>
              <strong className="text-foreground font-mono text-xs block mt-0.5">
                {formatFcfa(result.data.valeurVenaleRetenue || result.data.valeurGarantieFcfa)}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Rang &amp; Statut</span>
              <span className="font-bold text-emerald-500 block mt-0.5">
                Rang 1 &bull; {result.data.statut}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
            <div className="font-semibold text-foreground text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              <span>Scellement Cryptographique &amp; Horodatage Blockchain</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[9px]">Hash SHA-256 Sûreté :</span>
                <span className="text-foreground font-bold truncate block">{result.data.hashSha256}</span>
              </div>
              <div className="p-2 rounded bg-card border border-border truncate">
                <span className="text-muted-foreground block text-[9px]">Ancrage Bitcoin OTS :</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate block">{result.data.otsProof}</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/60">
              {result.data.cadreJuridique}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
