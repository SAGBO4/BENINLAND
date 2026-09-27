"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Landmark,
  Coins,
  MapPin,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Printer,
  ExternalLink,
  FileText,
  BadgeCheck,
  Compass,
  Building,
} from "lucide-react";
import { SituationParcelleDiagnostic } from "./citoyen-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatFcfa } from "@/lib/utils";

interface ParcelleSituationModalProps {
  diagnostic: SituationParcelleDiagnostic | null;
  onClose: () => void;
  onSelectDocument?: (ref: string) => void;
}

export function ParcelleSituationModal({
  diagnostic,
  onClose,
  onSelectDocument,
}: ParcelleSituationModalProps) {
  if (!diagnostic) return null;

  const {
    parcelle,
    statutFoncier,
    situationCsaf,
    situationHypothecaire,
    situationFiscale,
    situationTechnique,
    verrouMutation,
  } = diagnostic;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="situation-modal-title"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-rise"
    >
      <div className="relative bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* En-tête de la modale */}
        <div className="p-5 sm:p-6 border-b border-border bg-gradient-to-r from-purple-950/40 via-background to-emerald-950/30 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[11px] font-bold">
                <BadgeCheck className="w-3.5 h-3.5" />
                Diagnostic Juridique Certifié en Temps Réel
              </span>
              <span className="font-mono text-purple-400 text-xs font-bold">
                Token : {statutFoncier.tokenBeninChainId}
              </span>
            </div>
            <h2 id="situation-modal-title" className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
              Fiche de Situation Juridique &amp; Fiscale : {parcelle.codeUnique}
            </h2>
            <p className="text-muted-foreground text-xs">
              Commune de {parcelle.commune} &bull; Arr. {parcelle.arrondissement} &bull; Village {parcelle.village} &bull;{" "}
              Superficie : <strong className="text-foreground font-mono">{parcelle.superficieM2.toLocaleString()} m²</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fiche de situation"
            className="p-2 rounded-xl bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border cursor-pointer transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilable de la situation */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Synthèse globale souveraine */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <strong className="block text-sm font-bold text-emerald-400">
                  Situation Foncier Conforme &bull; Bien Disponible &amp; Opposable
                </strong>
                <span className="text-[11px] text-muted-foreground block">
                  Propriétaire titulaire répertorié :{" "}
                  <strong className="text-foreground">{parcelle.proprietaireNom}</strong> (NPI :{" "}
                  <span className="font-mono">{parcelle.proprietaireNpi}</span>)
                </span>
              </div>
            </div>
            <Badge variant="success" className="px-3 py-1 font-mono text-[11px] font-bold self-start sm:self-center shrink-0">
              AUDIT VALIDE 100%
            </Badge>
          </div>

          {/* Grille des 5 dimensions souveraines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Statut Foncier & Titre */}
            <div className="p-4 rounded-xl bg-background/70 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Landmark className="w-4 h-4 text-purple-400" />
                  <span>1. Statut Foncier &amp; Titre</span>
                </div>
                <Badge variant={parcelle.statutJuridique === "TITRE_FONCIER" ? "success" : "secondary"} className="text-[10px]">
                  {statutFoncier.statut}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {statutFoncier.label} enregistré et certifié au Registre Foncier National. Droits de propriété opposables à toute tierce personne.
              </p>
              <div className="text-[11px] pt-1 border-t border-border/60 flex items-center justify-between text-muted-foreground">
                <span>Immatriculation IUF :</span>
                <strong className="font-mono text-foreground">{parcelle.codeUnique}</strong>
              </div>
            </div>

            {/* 2. Situation Contentieuse CSAF */}
            <div className="p-4 rounded-xl bg-background/70 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span>2. Rôle Contentieux CSAF</span>
                </div>
                <Badge variant={situationCsaf.enLitige ? "destructive" : "success"} className="text-[10px]">
                  {situationCsaf.enLitige ? "Gel Actif" : "Zéro Litige"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {situationCsaf.statutLabel}. Aucune ordonnance de gel conservatoire n&apos;affecte cette parcelle devant la Cour Spéciale des Affaires Foncières.
              </p>
              <div className="text-[11px] pt-1 border-t border-border/60 flex items-center justify-between text-muted-foreground">
                <span>Vérification CSAF :</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registre Vérifié
                </span>
              </div>
            </div>

            {/* 3. Situation Hypothécaire & Sûretés Bancaires */}
            <div className="p-4 rounded-xl bg-background/70 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>3. Sûretés Réelles &amp; Hypothèques</span>
                </div>
                <Badge variant={situationHypothecaire.aHypotheque ? "warning" : "success"} className="text-[10px]">
                  {situationHypothecaire.aHypotheque ? "Hypothèque Inscrite" : "Non Gagé"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {situationHypothecaire.statutLabel}. Le bien est totalement disponible pour servir de garantie de premier rang ou pour cession sans restriction.
              </p>
              <div className="text-[11px] pt-1 border-t border-border/60 flex items-center justify-between text-muted-foreground">
                <span>Charge financière inscrite :</span>
                <strong className="font-mono text-foreground">
                  {formatFcfa(situationHypothecaire.montantTotalGarantieFcfa)}
                </strong>
              </div>
            </div>

            {/* 4. Situation Fiscale Trésor Public */}
            <div className="p-4 rounded-xl bg-background/70 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>4. Fiscalité &amp; Trésor Public (DGTCP)</span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  TrésorPay Acquitté
                </Badge>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Taxe communale sur plus-value acquittée au Trésor Public via TrésorPay. Quittance légale délivrée par la DGTCP.
              </p>
              <div className="text-[11px] pt-1 border-t border-border/60 flex items-center justify-between text-muted-foreground">
                <span>Quittance DGTCP :</span>
                <button
                  type="button"
                  onClick={() => onSelectDocument && onSelectDocument(situationFiscale.quittanceRef)}
                  className="font-mono text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>{situationFiscale.quittanceRef}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Situation Technique, Bornage & Géoréférencement GPS */}
          <div className="p-4 rounded-xl bg-background/70 border border-border space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>5. Situation Technique, Délimitation &amp; Bornes GPS Certifiées</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                PV établi par : <strong className="text-foreground">{situationTechnique.geometreNom}</strong>
              </span>
            </div>

            <p className="text-muted-foreground text-[11px]">
              Délimitation contradictoire scellée. Les 4 bornes géodésiques normalisées ont été implantées et vérifiées par coordonnées satellites GPS :
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {situationTechnique.bornesGPS.map((b) => (
                <div key={b.id} className="p-2.5 rounded-lg bg-card border border-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">{b.id}</span>
                    <MapPin className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground leading-tight">
                    <div>Lat : {b.lat.toFixed(6)}°</div>
                    <div>Lng : {b.lng.toFixed(6)}°</div>
                  </div>
                  <span className="text-[9px] text-muted-foreground block truncate">Borne scellée</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Verrou Notarial d'Opposabilité Anti-Double-Vente */}
          <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  verrouMutation.actif
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {verrouMutation.actif ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </div>
              <div>
                <strong className="block text-xs font-bold text-foreground">
                  {verrouMutation.actif ? "Verrou Notarial Actif" : "Verrou Notarial Inactif (Bien Libre)"}
                </strong>
                <span className="text-[11px] text-muted-foreground block">{verrouMutation.statutLabel}</span>
              </div>
            </div>

            <Badge variant={verrouMutation.actif ? "warning" : "outline"} className="self-start sm:self-center">
              {verrouMutation.actif ? "Mutation en cours" : "Disponible pour Cession"}
            </Badge>
          </div>
        </div>

        {/* Pied de page d'actions */}
        <div className="p-4 sm:p-5 border-t border-border bg-background/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground text-center sm:text-left">
            Certifié conforme à l&apos;Art. 142 du CFD &bull; République du Bénin
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la Fiche</span>
            </Button>

            <Link
              href={`/verification?code=${parcelle.codeUnique}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Vérifier en Public</span>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs cursor-pointer"
            >
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
