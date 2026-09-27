"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Landmark,
  FileCheck2,
  QrCode,
  Fingerprint,
  Calendar,
  UserCheck,
  Scale,
  Award,
} from "lucide-react";
import { CitoyenDocument } from "./citoyen-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { formatFcfa } from "@/lib/utils";

interface DocumentViewerModalProps {
  document: CitoyenDocument | null;
  onClose: () => void;
}

export function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!document) return null;

  const handleCopyHash = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(document.hashSha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verification?code=${document.parcelleCode}`
      : `https://beninland.bj/verification?code=${document.parcelleCode}`;

  const qrPayload = JSON.stringify({
    emetteur: "REPUBLIQUE_DU_BENIN_MCVDD_ANDF",
    ref: document.referenceOfficielle,
    parcelle: document.parcelleCode,
    type: document.type,
    hash: document.hashSha256,
    ots: document.otsProof,
    verifUrl: verificationUrl,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doc-viewer-modal-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto animate-rise"
    >
      <div className="relative bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-xs">
        {/* Barre d'outils supérieure */}
        <div className="p-4 border-b border-border bg-background/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
                Visualiseur d&apos;Acte Officiel Souverain
              </span>
              <strong className="text-foreground font-mono text-xs">{document.referenceOfficielle}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer l&apos;Acte</span>
            </Button>

            <Link
              href={`/verification?code=${document.parcelleCode}`}
              target="_blank"
              className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vérifier au Registre</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le visualiseur"
              className="p-1.5 rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CORPS DE L'ACTE OFFICIEL (FEUILLE A4 RÉPUBLICAINE HAUTE DÉFINITION)       */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900 space-y-6 font-sans">
          {/* Bande tricolore républicaine du Bénin */}
          <div className="flex h-1.5 w-full rounded-full overflow-hidden">
            <div className="bg-[#008751] w-1/3" />
            <div className="bg-[#FCD116] w-1/3" />
            <div className="bg-[#E8112D] w-1/3" />
          </div>

          {/* En-tête officiel de la République du Bénin */}
          <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <h1 className="text-base sm:text-xl font-black uppercase tracking-widest text-slate-900">
                RÉPUBLIQUE DU BÉNIN
              </h1>
              <Award className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-[11px] font-serif font-bold uppercase tracking-wider text-slate-600">
              Fraternité &bull; Justice &bull; Travail
            </p>
            <div className="h-0.5 bg-slate-900 w-28 mx-auto my-1" />
            <h2 className="text-xs font-bold uppercase text-slate-800">
              MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS, CHARGÉ DU DÉVELOPPEMENT DURABLE (MCVDD)
            </h2>
            <h3 className="text-xs font-semibold text-slate-700">{document.autoriteEmettrice}</h3>

            {/* Titre encadré de l'acte */}
            <div className="mt-4 p-3 bg-slate-100 border-2 border-slate-900 inline-block rounded-sm max-w-2xl">
              <span id="doc-viewer-modal-title" className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900">
                {document.titre}
              </span>
            </div>
            <p className="font-mono text-xs font-bold text-slate-700 mt-1">
              RÉFÉRENCE D&apos;ENREGISTREMENT OFFICIELLE : {document.referenceOfficielle}
            </p>
          </div>

          {/* Description & Base Légale */}
          <div className="space-y-2 text-xs leading-relaxed text-slate-800">
            <p>
              Le Conservateur de la Propriété Foncière et des Affaires Domaniales, soussigné, certifie que l&apos;acte désigné
              ci-après a été régulièrement instruit, vérifié et consigné au Registre Foncier National conformément aux
              dispositions de la{" "}
              <strong>Loi n° 2013-01 portant Code Foncier et Domanial</strong> en République du Bénin, modifiée par la{" "}
              <strong>Loi n° 2017-15</strong> :
            </p>
          </div>

          {/* Section 1 : Désignation de l'Immeuble & Titulaire */}
          <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs">
            <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900 flex items-center justify-between">
              <span>1. Désignation Cadastrale de l&apos;Immeuble</span>
              <span className="font-mono text-[10px] text-slate-600 font-normal">IUF : {document.parcelleCode}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div>
                <span className="text-slate-500 font-medium">Identifiant Unique Foncier : </span>
                <strong className="font-mono text-slate-900">{document.parcelleCode}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Localisation administrative : </span>
                <strong>Pahou, Commune de Ouidah (Atlantique)</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Titulaire légitime déclaré : </span>
                <strong>Germain DOSSOU (Famille Dossou)</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">NPI Titulaire (ANIP) : </span>
                <strong className="font-mono text-slate-900">FICTIF-BEN-2026-0041</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Superficie certifiée : </span>
                <strong className="font-mono text-slate-900">1 250 m²</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Date d&apos;enregistrement : </span>
                <strong>{new Date(document.dateEmission).toLocaleDateString("fr-BJ", { day: "2-digit", month: "long", year: "numeric" })}</strong>
              </div>
            </div>
          </div>

          {/* Section 2 : Spécificités selon la nature du document */}
          {document.type === "CERTIFICAT_COMMUNAL" && document.details && (
            <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs bg-slate-50">
              <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900">
                2. Évaluation Légale du Prix Foncier &amp; Liquidation Fiscale (Art. 142)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Prix d&apos;acquisition d&apos;origine : </span>
                  <strong className="font-mono">{formatFcfa(document.details.prixAcquisitionInitial)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">PRIX DE MUTATION OFFICIEL FIXÉ : </span>
                  <strong className="font-mono text-sm underline text-emerald-800">
                    {formatFcfa(document.details.prixFixeFcfa)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Travaux et aménagements déductibles : </span>
                  <strong className="font-mono">{formatFcfa(document.details.travauxDeductibles)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Plus-value nette imposable : </span>
                  <strong className="font-mono">{formatFcfa(document.details.plusValueNette)}</strong>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-slate-500">Taxe communale sur plus-value (5%) : </span>
                    <strong className="font-mono text-slate-900">{formatFcfa(document.details.taxeCalculeeFcfa)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Quittance TrésorPay DGTCP : </span>
                    <strong className="font-mono text-emerald-800">{document.details.quittanceTresorRef}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {document.type === "QUITTANCE_TRESOR" && document.details && (
            <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs bg-slate-50">
              <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900">
                2. Encaissement et Liquidation par le Trésor Public (DGTCP)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Quittance officielle TrésorPay : </span>
                  <strong className="font-mono text-emerald-800">{document.referenceOfficielle}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Montant net encaissé : </span>
                  <strong className="font-mono text-sm underline text-emerald-800">
                    {formatFcfa(document.details.montantVerseFcfa || 100000)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500">Guichet de perception : </span>
                  <strong>{document.details.guichet}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Compte récepteur : </span>
                  <strong>{document.details.compteTresor}</strong>
                </div>
                <div className="sm:col-span-2 text-emerald-800 font-bold flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statut : DROITS DE MUTATION ACQUITTÉS &bull; QUITTANCE LIBÉRATOIRE DÉFINITIVE</span>
                </div>
              </div>
            </div>
          )}

          {document.type === "PV_BORNAGE" && (
            <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs bg-slate-50">
              <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900">
                2. Opérations Techniques de Bornage &amp; Délimitation Contradictoire
              </h4>
              <p className="text-slate-600 text-[11px]">
                Bornes géodésiques normalisées scellées sur le terrain en présence du mandataire familial, de l&apos;agent assermenté et des riverains :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <strong>Borne B1 :</strong>
                  <div>Lat : 6.365000° N</div>
                  <div>Lng : 2.081500° E</div>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <strong>Borne B2 :</strong>
                  <div>Lat : 6.365000° N</div>
                  <div>Lng : 2.083000° E</div>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <strong>Borne B3 :</strong>
                  <div>Lat : 6.366500° N</div>
                  <div>Lng : 2.083000° E</div>
                </div>
                <div className="p-2 border border-slate-300 rounded bg-white">
                  <strong>Borne B4 :</strong>
                  <div>Lat : 6.366500° N</div>
                  <div>Lng : 2.081500° E</div>
                </div>
              </div>
              <p className="text-slate-700 text-[11px] pt-1">
                Riverains et témoins contradictoires signataires : <strong>Paul Hounkpatin (Voisin Est)</strong> &amp;{" "}
                <strong>Chef Dah Sèhou (Chef de Village)</strong>.
              </p>
            </div>
          )}

          {document.type === "CONVENTION" && document.details && (
            <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs bg-slate-50">
              <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900">
                2. Dispositions de la Convention Sous Seing Privé Assistée
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Cédant (Vendeur) : </span>
                  <strong>{document.details.vendeurNom} ({document.details.vendeurNpi})</strong>
                </div>
                <div>
                  <span className="text-slate-500">Cessionnaire (Acheteur) : </span>
                  <strong>{document.details.acheteurNom} ({document.details.acheteurNpi})</strong>
                </div>
                <div>
                  <span className="text-slate-500">Prix convenu sous séquestre : </span>
                  <strong className="font-mono">{formatFcfa(document.details.prixFcfa)}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Séquestre bancaire / Trésor : </span>
                  <strong className="text-emerald-800">FONDS BLOQUÉS SÉQUESTRE DGTCP</strong>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                Témoignages vocaux en langue nationale <strong>Fongbe</strong> archivés et scellés avec le procès-verbal.
              </p>
            </div>
          )}

          {document.type === "CARNET_FONCIER" && document.details && (
            <div className="border border-slate-900 p-4 rounded-sm space-y-2.5 text-xs bg-slate-50">
              <h4 className="font-black border-b border-slate-300 pb-1 uppercase text-slate-900">
                2. Dévolutions et Consentements des Ayants-Droit Vérifiés
              </h4>
              <ul className="space-y-1.5 text-slate-800">
                {document.details.ayantsDroit?.map((ad: any, i: number) => (
                  <li key={i} className="flex justify-between border-b border-slate-200 pb-1">
                    <span>
                      &bull; <strong>{ad.nom}</strong> ({ad.part})
                    </span>
                    <span className="text-emerald-700 font-bold text-[11px]">{ad.statut}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-emerald-800 font-medium pt-1">
                Accord formel scellé : inopposabilité garantie contre toute contestation successorale ultérieure devant la CSAF.
              </p>
            </div>
          )}

          {/* Section 3 : Base Légale et Opposabilité */}
          <div className="p-3 bg-slate-100 border border-slate-400 rounded-sm text-[11px] leading-relaxed text-slate-700">
            <strong>RÉFÉRENCE LÉGALE &amp; EFFETS JURIDIQUES : </strong>
            <span>{document.baseLegale}.</span>
            <p className="mt-1">
              Le présent acte fait foi jusqu&apos;à inscription de faux devant toute juridiction de la République du Bénin.
              Son intégrité cryptographique est garantie par ancrage sur la Blockchain souveraine BeninChain et le réseau OpenTimestamps.
            </p>
          </div>

          {/* Signatures et Cachet Officiel */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-slate-900 pt-4 text-xs">
            <div className="text-center space-y-1">
              <p className="font-bold text-slate-900 uppercase">Le Déclarant / Titulaire</p>
              <p className="text-[10px] text-slate-600 italic">Germain DOSSOU (Famille Dossou)</p>
              <div className="pt-6 font-serif italic text-slate-500 text-[11px]">Signé numériquement via ANIP</div>
            </div>

            <div className="text-center space-y-1">
              <p className="font-bold text-slate-900 uppercase">L&apos;Autorité Compétente</p>
              <p className="text-xs font-semibold text-slate-900">{document.signataireNom}</p>
              <p className="text-[10px] text-slate-600">{document.signataireQualite}</p>
              <div className="pt-4 text-[10px] font-bold uppercase text-emerald-800">
                Cachet Officiel &bull; République du Bénin
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCEAU OFFICIEL, QR CODE & ANCRAGE CRYPTOGRAPHIQUE                         */}
          {/* ========================================================================= */}
          <div className="border-t-2 border-slate-900 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 p-4 rounded-xl">
            {/* Blason / Sceau républicain stylisé */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center p-1 bg-white shrink-0 shadow-xs">
                <div className="w-full h-full rounded-full border border-dashed border-emerald-700 flex flex-col items-center justify-center text-center p-1">
                  <Scale className="w-4 h-4 text-emerald-800" />
                  <span className="text-[6px] font-black uppercase text-slate-800 leading-tight">BÉNIN &bull; SCEAU</span>
                  <span className="text-[5px] text-slate-600 leading-tight">OFFICIEL</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Sceau d&apos;Authenticité &amp; Ancrage Légal</span>
                </div>
                <p className="text-[10px] text-slate-600 max-w-sm leading-tight">
                  Scellé au Livre Foncier National. Toute altération physique ou numérique rompt instantanément l&apos;intégrité mathématique.
                </p>
                <div className="font-mono text-[9px] text-slate-700 flex items-center gap-1">
                  <span>Preuve OTS : </span>
                  <strong className="text-slate-900">{document.otsProof}</strong>
                </div>
              </div>
            </div>

            {/* QR Code officiel */}
            <div className="flex flex-col items-center text-center shrink-0">
              <div className="p-2 border-2 border-slate-900 rounded-lg bg-white shadow-sm">
                <QRCodeSVG value={qrPayload} size={84} level="H" />
              </div>
              <span className="text-[9px] font-mono text-slate-600 mt-1 uppercase font-semibold">
                Flash de vérification
              </span>
            </div>
          </div>

          {/* Empreinte SHA-256 intégrale */}
          <div className="p-3 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-2 overflow-hidden">
              <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-slate-400 block text-[9px] font-sans">Empreinte Cryptographique SHA-256 (64 caractères) :</span>
                <span className="font-bold text-emerald-300 break-all">{document.hashSha256}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyHash}
              className="h-7 text-[10px] bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 shrink-0 cursor-pointer flex items-center gap-1"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHash ? "Copié" : "Copier SHA-256"}</span>
            </Button>
          </div>
        </div>

        {/* Barre d'actions inférieure */}
        <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-muted-foreground hidden sm:block">
            Document officiel conforme aux dispositions du Code Foncier et Domanial béninois.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </Button>

            <Link
              href={`/verification?code=${document.parcelleCode}`}
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Page de Vérification</span>
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
