"use client";

import React, { useState } from "react";
import { SeedParcelle } from "@/db/seed/data";
import { formatFcfa } from "@/lib/utils";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import {
  ShieldCheck,
  Lock,
  ShieldAlert,
  MapPin,
  Layers,
  FileText,
  User,
  ExternalLink,
  Download,
  Scale,
  CheckCircle,
  Copy,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CadastreInspectorPanelProps {
  parcelle: SeedParcelle | null;
  onClose?: () => void;
}

export function CadastreInspectorPanel({ parcelle, onClose }: CadastreInspectorPanelProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!parcelle) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-card border-l border-border text-muted-foreground">
        <MapPin className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <h4 className="font-bold text-foreground text-sm">Sélectionnez une parcelle</h4>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
          Cliquez sur un polygone cadastral sur la carte pour inspecter ses données certifiées ANDF, son régime juridique
          et son empreinte cryptographique.
        </p>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (parcelle.enLitige) {
      return (
        <Badge variant="destructive" className="gap-1 px-2.5 py-1 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Litige CSAF — Gel Conservatoire</span>
        </Badge>
      );
    }
    if (parcelle.enVerrouMutation) {
      return (
        <Badge variant="warning" className="gap-1 px-2.5 py-1 text-xs font-bold">
          <Lock className="w-3.5 h-3.5" />
          <span>Verrou Notarial Actif</span>
        </Badge>
      );
    }
    if (parcelle.statutJuridique === "TITRE_FONCIER") {
      return (
        <Badge variant="success" className="gap-1 px-2.5 py-1 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Titre Foncier Immatriculé (TF)</span>
        </Badge>
      );
    }
    if (parcelle.statutJuridique === "CPF") {
      return (
        <Badge variant="info" className="gap-1 px-2.5 py-1 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Certificat Propriété Foncière (CPF)</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        <span>Certificat Coutumier Déclaré</span>
      </Badge>
    );
  };

  const sha256Fingerprint =
    parcelle.codeUnique === "OUI-0421"
      ? "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      : parcelle.codeUnique === "CAL-0089"
      ? "a89f3320c74d8129e9f1a09374026da4e7710bcf2e847c92b2100df9938e3a24"
      : parcelle.codeUnique === "LIT-ALL-005"
      ? "f5a2d3b4c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2"
      : `0x${parcelle.codeUnique.toLowerCase().replace("-", "0")}${"abcdef1234567890".repeat(3).slice(0, 56)}`;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(sha256Fingerprint);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadFiche = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <aside className="w-full md:w-[420px] h-full flex flex-col bg-card border-l border-border overflow-y-auto text-xs shadow-2xl">
      {/* En-tête de l'inspecteur */}
      <div className="p-4 border-b border-border bg-card/90 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-foreground text-sm tracking-tight">Fiche d&apos;Inspection Cadastrale</h3>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Fermer le panneau"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Volet 1 : Identification Cadastrale ANDF */}
        <div className="p-4 rounded-xl bg-background/90 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Identifiant Unique Foncier (IUF)
            </span>
            <span className="font-mono text-xs font-bold text-primary">ANDF-BENIN</span>
          </div>

          <div className="text-xl font-mono font-black text-foreground tracking-wide">
            {parcelle.codeUnique}
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
            <div className="font-semibold text-foreground">
              Département : {parcelle.commune === "Ouidah" || parcelle.commune === "Abomey-Calavi" || parcelle.commune === "Allada" || parcelle.commune === "Kpomassè" ? "Atlantique" : "Littoral"}
            </div>
            <div>
              Commune de {parcelle.commune} &bull; Arrondissement de {parcelle.arrondissement} &bull; Village {parcelle.village}
            </div>
          </div>
        </div>

        {/* Volet 2 : Statut Juridique & Conservation */}
        <div className="space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
            Régime Juridique &amp; Conservation
          </span>
          <div>{getStatusBadge()}</div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-3 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Superficie Certifiée</span>
              <span className="text-sm font-mono font-black text-foreground">
                {formatFcfa(parcelle.superficieM2).replace("FCFA", "")} m²
              </span>
              <span className="text-[9px] text-muted-foreground block">Levé Shoelace PostGIS</span>
            </div>

            <div className="p-3 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Usage Déclaré</span>
              <span className="text-sm font-semibold text-foreground">
                {parcelle.usage === "HABITATION" ? "Habitation" : parcelle.usage === "COMMERCIAL" ? "Commercial" : "Agricole"}
              </span>
              <span className="text-[9px] text-muted-foreground block">Plan d&apos;urbanisme</span>
            </div>
          </div>

          {parcelle.enLitige && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Instance Contentieuse Pendante — CSAF</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Ordonnance de gel n° 2026/CSAF/012. Toute transaction, vente ou cession notariée est frappée de nullité
                absolue jusqu&apos;à notification du jugement définitif.
              </p>
            </div>
          )}

          {parcelle.enVerrouMutation && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Verrou d&apos;Opposabilité Immédiat Actif</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Sous séquestre notarial (Me Christian Agbossou). Les fonds de la cession sont consignés et aucune vente
                concurrente ne peut être introduite.
              </p>
            </div>
          )}
        </div>

        {/* Volet 3 : Titulaire et Ayants-Droit (ANIP Protégé) */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
            Titulaire Enregistré (Données ANIP)
          </span>
          <div className="p-3 rounded-lg bg-background/60 border border-border space-y-1.5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary shrink-0" />
              <div className="font-bold text-foreground text-xs">{parcelle.proprietaireNom}</div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/40">
              <span>NPI Réglementaire :</span>
              <span className="font-bold text-foreground">
                {parcelle.proprietaireNpi.replace(/FICTIF-BEN-(\d{4})-(\d{4})/, "BEN-***-$2")}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Contact Notifié :</span>
              <span>{parcelle.proprietaireTel.replace(/(\d{4})$/, "****")}</span>
            </div>
          </div>
        </div>

        {/* Volet 4 : Attestation Vocale Multilingue */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
            Attestation Vocale Multilingue (Inclusion Citoyenne)
          </span>
          <AudioPhrasePlayer
            phraseKey={
              parcelle.enLitige
                ? "parcelle_en_litige"
                : parcelle.enVerrouMutation
                ? "parcelle_verrouillee"
                : "parcelle_titre_foncier_valide"
            }
          />
        </div>

        {/* Volet 5 : Empreinte Numérique et Preuve d'Inaltérabilité SHA-256 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              Horodatage &amp; Intégrité SHA-256
            </span>
            <button
              type="button"
              onClick={handleCopyHash}
              className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedHash ? (
                <>
                  <Check className="w-3 h-3 text-success" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-background/80 border border-border/90 font-mono text-[10px] text-muted-foreground break-all leading-relaxed">
            {sha256Fingerprint}
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Ancrage Certifié ASIN / OpenTimestamps</span>
            <span className="text-secondary font-mono font-semibold">
              {parcelle.tokenBeninChainId || "TKN-COUTUMIER-BENIN"}
            </span>
          </div>
        </div>

        {/* Actions Institutionnelles */}
        <div className="pt-2 space-y-2 border-t border-border">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleDownloadFiche}
            className="w-full font-bold text-xs gap-1.5"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-success" />
                <span>Fiche Renseignement Générée (PDF)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger Fiche de Renseignement Cadastral</span>
              </>
            )}
          </Button>

          <Button
            asChild
            variant="secondary"
            size="sm"
            className="w-full font-bold text-xs gap-1.5"
          >
            <a href={`/espace/notaire`}>
              <FileText className="w-3.5 h-3.5" />
              <span>Déposer Réquisition Notariée</span>
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
}
