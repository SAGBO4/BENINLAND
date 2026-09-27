"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  ExternalLink,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { CitoyenDocument } from "./citoyen-data";
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
  const [zoomLevel, setZoomLevel] = useState<"normal" | "fit">("normal");

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
    emetteur: "REPUBLIQUE_DU_BENIN_ADMINISTRATION_FONCIERE",
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
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col p-0 sm:p-4 overflow-hidden animate-rise"
    >
      {/* ========================================================================= */}
      {/* BARRE D'OUTILS SUPÉRIEURE (STYLE LECTEUR PDF ADMINISTRATIF PRO)           */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-3 flex items-center justify-between gap-3 shrink-0 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/armoiries-benin.png" alt="Armoiries du Bénin" className="h-5 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                Document Officiel de la République du Bénin
              </span>
              <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
                Format A4 Réglementaire
              </span>
            </div>
            <strong className="text-white font-mono text-xs sm:text-sm truncate block">
              {document.referenceOfficielle} &bull; {document.titre}
            </strong>
          </div>
        </div>

        {/* Commandes d'action */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(zoomLevel === "normal" ? "fit" : "normal")}
            className="h-8 text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hidden md:flex items-center gap-1.5 cursor-pointer"
            title="Ajuster la vue"
          >
            {zoomLevel === "normal" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{zoomLevel === "normal" ? "Pleine Largeur" : "Vue Page"}</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer / Télécharger (PDF)</span>
          </Button>

          <Link
            href={`/verification?code=${document.parcelleCode}`}
            target="_blank"
            className="h-8 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold hidden lg:flex items-center gap-1.5 cursor-pointer transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Contrôle au Registre</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le visualiseur"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE DE LECTURE : BUREAU D'AFFICHAGE DU DOCUMENT FORMAT PAPIER A4         */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto bg-slate-700/60 p-3 sm:p-8 flex justify-center items-start">
        {/* FEUILLE OFFICIELLE FORMAT A4 */}
        <div
          className={`bg-white text-black shadow-2xl transition-all duration-200 w-full relative font-serif text-[11px] sm:text-xs leading-relaxed print:p-0 print:border-none print:shadow-none print:max-w-none print:m-0 print:min-h-0 ${
            zoomLevel === "normal" ? "max-w-[820px] min-h-[1140px] p-6 sm:p-10" : "max-w-4xl p-6 sm:p-12"
          }`}
          style={{ boxSizing: "border-box" }}
        >
          {/* Cadre institutionnel double filet réglementaire */}
          <div className="border-2 border-black p-5 sm:p-8 relative min-h-[1050px] flex flex-col justify-between">
            {/* Liseré fin intérieur */}
            <div className="border border-black p-4 sm:p-6 flex-1 flex flex-col justify-between relative bg-[#fdfdfc]">
              
              {/* Filigrane d'authenticité discret */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035] overflow-hidden">
                <div className="text-center transform -rotate-45">
                  <p className="text-6xl font-black uppercase tracking-widest font-sans">RÉPUBLIQUE DU BÉNIN</p>
                  <p className="text-3xl font-bold uppercase mt-2">LIVRE FONCIER NATIONAL &bull; ACTE SCELLÉ</p>
                </div>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* 1. EN-TÊTE OFFICIEL DE LA RÉPUBLIQUE DU BÉNIN                      */}
              {/* ------------------------------------------------------------------ */}
              <div>
                <div className="text-center space-y-1 pb-3 border-b-2 border-black">
                  {/* Armoiries Officielles */}
                  <div className="flex justify-center mb-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/armoiries-benin.png"
                      alt="Armoiries Officielles de la République du Bénin"
                      className="h-14 w-auto object-contain mx-auto"
                    />
                  </div>

                  <h1 className="text-base sm:text-lg font-black uppercase tracking-widest text-black font-sans">
                    RÉPUBLIQUE DU BÉNIN
                  </h1>
                  <p className="text-[10px] sm:text-[11px] uppercase italic font-medium tracking-wider text-slate-800">
                    Fraternité &bull; Justice &bull; Travail
                  </p>
                  <div className="h-0.5 bg-black w-24 mx-auto my-1.5" />

                  {/* Ministères & Directions compétents selon le type d'acte */}
                  {document.type === "CERTIFICAT_COMMUNAL" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        DÉPARTEMENT DE L&apos;ATLANTIQUE &bull; COMMUNE DE OUIDAH
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        DIRECTION DES AFFAIRES DOMANIALES, DE L&apos;URBANISME ET DU CADASTRE
                      </h3>
                    </>
                  )}

                  {document.type === "QUITTANCE_TRESOR" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        MINISTÈRE DE L&apos;ÉCONOMIE ET DES FINANCES (MEF)
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        DIRECTION GÉNÉRALE DU TRÉSOR ET DE LA COMPTABILITÉ PUBLIQUE (DGTCP)
                      </h3>
                      <p className="text-[10px] font-mono font-bold text-slate-700">
                        AGENCE COMPTABLE CENTRALE DU TRÉSOR &bull; COMPTE UNIQUE DU TRÉSOR (CUT)
                      </p>
                    </>
                  )}

                  {document.type === "PV_BORNAGE" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS (MCVDD)
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        DIRECTION DE LA CARTOGRAPHIE ET DU CADASTRE &bull; ORDRE DES GÉOMÈTRES-EXPERTS
                      </h3>
                      <p className="text-[10px] font-bold text-slate-700">
                        BUREAU TERRITORIAL DU CADASTRE DE L&apos;ATLANTIQUE (CIRCONSCRIPTION DE OUIDAH)
                      </p>
                    </>
                  )}

                  {document.type === "TITRE_CADASTRAL" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS &bull; PRÉFECTURE DE L&apos;ATLANTIQUE
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        AGENCE NATIONALE DU DOMAINE ET DU FONCIER (ANDF) &bull; COMMUNE DE OUIDAH
                      </h3>
                    </>
                  )}

                  {document.type === "CONVENTION" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        MINISTÈRE DU CADRE DE actuation ET DES TRANSPORTS (MCVDD)
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        REGISTRE OFFICIEL DES ACTES SOUS SEING PRIVÉ &bull; CONVENTIONS VILLAGEOISES
                      </h3>
                    </>
                  )}

                  {document.type === "CARNET_FONCIER" && (
                    <>
                      <h2 className="text-xs font-bold uppercase text-black font-sans">
                        MINISTÈRE DE LA JUSTICE ET DE LA LÉGISLATION
                      </h2>
                      <h3 className="text-[11px] font-semibold text-slate-800 font-sans">
                        COUR SPÉCIALE DES AFFAIRES FONCIÈRES (CSAF) &bull; LIVRE FONCIER NATIONAL
                      </h3>
                      <p className="text-[10px] font-bold text-slate-700">
                        EXTRAIT DU REGISTRE DES DÉVOLUTIONS ET DES PACTES SUCCESSORAUX
                      </p>
                    </>
                  )}

                  {/* CARTOUCHE DU TITRE OFFICIEL DU DOCUMENT */}
                  <div className="mt-3 p-2 bg-slate-100 border-2 border-black inline-block max-w-xl text-center shadow-xs">
                    <span
                      id="doc-viewer-modal-title"
                      className="text-xs sm:text-sm font-black uppercase tracking-wider text-black font-sans block"
                    >
                      {document.titre}
                    </span>
                  </div>

                  <p className="font-mono text-[10px] sm:text-[11px] font-bold text-slate-900 mt-1">
                    N° D&apos;ENREGISTREMENT OFFICIEL : <span className="underline">{document.referenceOfficielle}</span>
                  </p>
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* 2. FORMULE SOLENNELLE D'INSTRUCTION ET BASE LÉGALE                 */}
                {/* ------------------------------------------------------------------ */}
                <div className="my-3 space-y-2 text-justify">
                  <p>
                    L&apos;Autorité compétente soussignée, agissant en vertu des prérogatives qui lui sont conférées par la{" "}
                    <strong>Loi n° 2013-01 du 14 août 2013 portant Code Foncier et Domanial</strong> en République du Bénin,
                    modifiée et complétée par la <strong>Loi n° 2017-15 du 10 août 2017</strong>, et les textes subséquents :
                  </p>
                  <p className="italic font-medium">
                    Certifie et atteste publiquement l&apos;exactitude des énonciations et constatations administratives
                    ci-après consignées au Registre Foncier National :
                  </p>
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* 3. DÉSIGNATION DE L'IMMEUBLE (SECTION COMMUNE FORMELLE)           */}
                {/* ------------------------------------------------------------------ */}
                <div className="border border-black p-3 my-3 space-y-1.5 bg-slate-50/50">
                  <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                    1. Désignation Cadastrale de l&apos;Immeuble &amp; Titulaire
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <p>
                      <strong>Identifiant Unique (IUF) :</strong>{" "}
                      <span className="font-mono font-bold">{document.parcelleCode}</span>
                    </p>
                    <p>
                      <strong>Localisation :</strong> Commune de Ouidah, Arr. Pahou
                    </p>
                    <p>
                      <strong>Village / Quartier :</strong> Hounhanmèdji
                    </p>
                    <p>
                      <strong>Superficie Certifiée :</strong> <span className="font-mono font-bold">1 250 m²</span>
                    </p>
                    <p>
                      <strong>Titulaire Déclaré :</strong> Germain DOSSOU (Famille Dossou)
                    </p>
                    <p>
                      <strong>NPI ANIP Titulaire :</strong>{" "}
                      <span className="font-mono font-bold">FICTIF-BEN-2026-0041</span>
                    </p>
                  </div>
                </div>

                {/* ------------------------------------------------------------------ */}
                {/* 4. CORPS SPÉCIFIQUE DU DOCUMENT SELON SA NATURE OFFICIELLE        */}
                {/* ------------------------------------------------------------------ */}

                {/* CAS A : CERTIFICAT MUNICIPAL D'ÉVALUATION ET PRIX (Art. 142) */}
                {document.type === "CERTIFICAT_COMMUNAL" && document.details && (
                  <div className="space-y-3">
                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Évaluation et Fixation Légale du Prix Foncier
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p>
                          <strong>Prix d&apos;Acquisition Initial :</strong>{" "}
                          <span className="font-mono">{formatFcfa(document.details.prixAcquisitionInitial)}</span>
                        </p>
                        <p>
                          <strong>PRIX OFFICIEL FIXÉ :</strong>{" "}
                          <span className="font-mono font-bold underline text-black">
                            {formatFcfa(document.details.prixFixeFcfa)}
                          </span>
                        </p>
                        <p>
                          <strong>Aménagements Déductibles :</strong>{" "}
                          <span className="font-mono">{formatFcfa(document.details.travauxDeductibles)}</span>
                        </p>
                        <p>
                          <strong>Plus-Value Nette Imposable :</strong>{" "}
                          <span className="font-mono font-bold">{formatFcfa(document.details.plusValueNette)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        3. Liquidation et Quittance de Paiement
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p>
                          <strong>Taxe Communale sur Plus-Value (5%) :</strong>{" "}
                          <span className="font-mono font-bold">{formatFcfa(document.details.taxeCalculeeFcfa)}</span>
                        </p>
                        <p>
                          <strong>Statut du Règlement :</strong> ACQUITTÉ &amp; ENCAISSÉ
                        </p>
                        <p>
                          <strong>Quittance TrésorPay DGTCP :</strong>{" "}
                          <span className="font-mono font-bold">{document.details.quittanceTresorRef}</span>
                        </p>
                        <p>
                          <strong>Canal de Perception :</strong> TrésorPay (Compte Unique du Trésor)
                        </p>
                      </div>
                    </div>

                    <div className="p-2 border border-black bg-slate-100 text-[10px] leading-tight">
                      <strong>MENTION LÉGALE D&apos;OPPOSABILITÉ (Art. 142 du Code Foncier et Domanial) :</strong>
                      <p className="mt-0.5">
                        Le présent certificat constitue la base d&apos;évaluation exclusive et opposable pour la rédaction
                        de tout procès-verbal de bornage contradictoire par l&apos;Agent Foncier ou de tout acte notarié de mutation.
                        Le QR-Code scellé ci-dessous fait foi devant toute autorité administrative ou judiciaire.
                      </p>
                    </div>
                  </div>
                )}

                {/* CAS B : QUITTANCE OFFICIELLE DE PAIEMENT DU TRÉSOR PUBLIC */}
                {document.type === "QUITTANCE_TRESOR" && document.details && (
                  <div className="space-y-3">
                    <div className="border-2 border-black p-3 space-y-2 bg-emerald-50/30">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Constatation d&apos;Encaissement par le Trésor Public (DGTCP)
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <p>
                          <strong>N° Quittance TrésorPay :</strong>{" "}
                          <span className="font-mono font-bold">{document.referenceOfficielle}</span>
                        </p>
                        <p>
                          <strong>Compte de Destination :</strong> COMPTE UNIQUE DU TRÉSOR (CUT)
                        </p>
                        <p>
                          <strong>Montant Versé en Chiffres :</strong>{" "}
                          <span className="font-mono font-black text-sm">{formatFcfa(document.montantFcfa || 100000)}</span>
                        </p>
                        <p>
                          <strong>Montant en Toutes Lettres :</strong>{" "}
                          <span className="font-bold uppercase">Cent Mille Francs CFA</span>
                        </p>
                        <p>
                          <strong>Nature de la Recette :</strong> Taxe Domaniale sur Plus-Value (Art. 142)
                        </p>
                        <p>
                          <strong>Mode de Règlement :</strong> Télé-paiement Sécurisé TrésorPay
                        </p>
                      </div>
                    </div>

                    <div className="p-2 border border-black bg-slate-50 text-[10px]">
                      <strong>EFFET LIBÉRATOIRE :</strong> Le présent paiement éteint la dette fiscale domaniale afférente à
                      l&apos;opération pour l&apos;exercice budgétaire en cours.
                    </div>
                  </div>
                )}

                {/* CAS C : PROCÈS-VERBAL DE BORNAGE CONTRADICTOIRE & GPS */}
                {document.type === "PV_BORNAGE" && (
                  <div className="space-y-3">
                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Tableau des Coordonnées Géodésiques des Bornes (Système WGS-84 / UTM 31N)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-black text-[10px] text-center">
                          <thead>
                            <tr className="bg-slate-200">
                              <th className="border border-black p-1">Borne</th>
                              <th className="border border-black p-1">Désignation</th>
                              <th className="border border-black p-1">Latitude (°N)</th>
                              <th className="border border-black p-1">Longitude (°E)</th>
                              <th className="border border-black p-1">Nature de la Borne</th>
                              <th className="border border-black p-1">Constat Contradictoire</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-1 font-mono font-bold">B1</td>
                              <td className="border border-black p-1">Angle Nord-Ouest</td>
                              <td className="border border-black p-1 font-mono">6.365000</td>
                              <td className="border border-black p-1 font-mono">2.081500</td>
                              <td className="border border-black p-1">Béton normalisé ANDF</td>
                              <td className="border border-black p-1 text-emerald-800 font-bold">Conforme</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1 font-mono font-bold">B2</td>
                              <td className="border border-black p-1">Angle Nord-Est</td>
                              <td className="border border-black p-1 font-mono">6.365000</td>
                              <td className="border border-black p-1 font-mono">2.083000</td>
                              <td className="border border-black p-1">Béton normalisé ANDF</td>
                              <td className="border border-black p-1 text-emerald-800 font-bold">Conforme</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1 font-mono font-bold">B3</td>
                              <td className="border border-black p-1">Angle Sud-Est</td>
                              <td className="border border-black p-1 font-mono">6.366500</td>
                              <td className="border border-black p-1 font-mono">2.083000</td>
                              <td className="border border-black p-1">Béton normalisé ANDF</td>
                              <td className="border border-black p-1 text-emerald-800 font-bold">Conforme</td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1 font-mono font-bold">B4</td>
                              <td className="border border-black p-1">Angle Sud-Ouest</td>
                              <td className="border border-black p-1 font-mono">6.366500</td>
                              <td className="border border-black p-1 font-mono">2.081500</td>
                              <td className="border border-black p-1">Béton normalisé ANDF</td>
                              <td className="border border-black p-1 text-emerald-800 font-bold">Conforme</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[10px] italic text-slate-700 mt-1">
                        Les 4 bornes ont été implantées contradictoirement en présence des riverains dûment convoqués.
                        Aucun empiètement n&apos;a été constaté sur les parcelles contiguës.
                      </p>
                    </div>
                  </div>
                )}

                {/* CAS D : ATTESTATION DE DÉTENTION COUTUMIÈRE / RECASEMENT */}
                {document.type === "TITRE_CADASTRAL" && (
                  <div className="space-y-3">
                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Reconnaissance des Droits Coutumiers &amp; Constat de Recasement
                      </h4>
                      <p>
                        Le Service Domanial atteste que la parcelle <strong>OUI-0421</strong> est issue des opérations
                        de lotissement et recasement de l&apos;arrondissement de Pahou, et se trouve détenue de façon paisible,
                        publique et continue par la <strong>Collectivité Familiale DOSSOU</strong> sous l&apos;autorité du mandataire désigné.
                      </p>
                      <p className="mt-1">
                        Cette attestation confère au détenteur la pleine jouissance coutumière et ouvre droit à l&apos;immatriculation
                        au Livre Foncier national pour l&apos;obtention du Certificat de Propriété Foncière (CPF).
                      </p>
                    </div>
                  </div>
                )}

                {/* CAS E : CONVENTION DE VENTE SOUS SEING PRIVÉ */}
                {document.type === "CONVENTION" && (
                  <div className="space-y-3">
                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Stipulations de la Cession &amp; Séquestre Financier
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p>
                          <strong>Cédant :</strong> Germain DOSSOU (FICTIF-BEN-2026-0041)
                        </p>
                        <p>
                          <strong>Cessionnaire :</strong> Koffi MENSAH (FICTIF-BEN-2026-0003)
                        </p>
                        <p>
                          <strong>Prix Convenu :</strong>{" "}
                          <span className="font-mono font-bold">{formatFcfa(document.montantFcfa || 4500000)}</span>
                        </p>
                        <p>
                          <strong>Séquestre Trésor :</strong>{" "}
                          <span className="font-bold text-emerald-800">FONDS BLOQUÉS SÉQUESTRE DGTCP</span>
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-700 italic border-t border-slate-300 pt-1">
                        Témoignages oraux en langue nationale <strong>Fongbe</strong> enregistrés et scellés avec
                        l&apos;acte conformément à la législation foncière béninoise.
                      </p>
                    </div>
                  </div>
                )}

                {/* CAS F : CARNET DE FAMILLE FONCIER & SUCCESSION */}
                {document.type === "CARNET_FONCIER" && document.details && (
                  <div className="space-y-3">
                    <div className="border border-black p-3 space-y-1.5">
                      <h4 className="font-bold border-b border-black pb-0.5 uppercase text-black font-sans text-[11px]">
                        2. Dévolutions Héréditaires &amp; Pacte de Prévention Successorale
                      </h4>
                      <div className="space-y-1">
                        {document.details.ayantsDroit?.map((ad: any, i: number) => (
                          <div key={i} className="flex justify-between border-b border-slate-200 py-0.5">
                            <span>
                              &bull; <strong>{ad.nom}</strong> ({ad.part})
                            </span>
                            <span className="font-bold text-emerald-800">{ad.statut}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] italic text-slate-700 mt-1">
                        Le pacte de famille d&apos;anticipation successorale scellé ci-dessus est opposable aux tiers et
                        prévient tout contentieux domanial ultérieur devant la Cour Spéciale (CSAF).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* 5. MENTION DU LIEU, DATE, SIGNATURES & AUTHENTIQUE CACHET ROND     */}
              {/* ------------------------------------------------------------------ */}
              <div className="pt-4 border-t-2 border-black mt-4">
                <div className="text-right text-[11px] italic mb-3">
                  Fait à Ouidah, le{" "}
                  <strong>
                    {new Date(document.dateEmission).toLocaleDateString("fr-BJ", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-8 items-start relative">
                  {/* Colonne Gauche : Le Déclarant / Titulaire */}
                  <div className="text-center space-y-1">
                    <p className="font-bold uppercase text-black font-sans text-[11px]">
                      Le Déclarant / Titulaire
                    </p>
                    <p className="text-[10px] text-slate-700 italic">Germain DOSSOU</p>
                    <div className="h-14 flex items-center justify-center font-serif italic text-slate-700 text-xs">
                      [Signature numérique certifiée ANIP]
                    </div>
                    <p className="text-[9px] font-mono text-slate-500">NPI: FICTIF-BEN-2026-0041</p>
                  </div>

                  {/* Colonne Droite : L'Autorité Compétente avec Cachet Rond */}
                  <div className="text-center space-y-1 relative">
                    <p className="font-bold uppercase text-black font-sans text-[11px]">
                      Pour l&apos;Administration / L&apos;Autorité Foncier
                    </p>
                    <p className="text-xs font-bold text-black font-sans">{document.signataireNom}</p>
                    <p className="text-[10px] text-slate-700">{document.signataireQualite}</p>

                    <div className="h-16 flex items-center justify-center relative my-1">
                      {/* Signature stylisée */}
                      <span className="font-serif italic text-base text-slate-800 transform -rotate-6 select-none">
                        {document.signataireNom.split(" ")[0] || "Signé"}
                      </span>

                      {/* AUTHENTIQUE CACHET ROND ADMINISTRATIF BÉNINOIS (ENCRE BLEUE RÉPUBLICAINE) */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#1e3a8a] text-[#1e3a8a] p-1 flex flex-col items-center justify-center text-center transform -rotate-12 bg-[#1e3a8a]/5 shadow-xs select-none">
                          <div className="w-full h-full rounded-full border border-solid border-[#1e3a8a] flex flex-col items-center justify-center p-1">
                            <span className="text-[6px] font-black uppercase tracking-wider leading-tight">
                              RÉPUBLIQUE DU BÉNIN
                            </span>
                            <span className="text-[5px] font-bold uppercase my-0.5 leading-tight">
                              ★ ADMINISTRATION FONCIÈRE ★
                            </span>
                            <span className="text-[6px] font-black uppercase tracking-widest text-[#1e3a8a]">
                              SCEAU OFFICIEL
                            </span>
                            <span className="text-[5px] font-mono leading-tight">OUIDAH</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[9px] font-bold uppercase text-[#1e3a8a]">
                      Cachet Officiel Régalien &bull; République du Bénin
                    </p>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------------ */}
              {/* 6. CARTOUCHE DE SÉCURITÉ & SCELLEMENT BLOCKCHAIN                   */}
              {/* ------------------------------------------------------------------ */}
              <div className="border-t border-black pt-3 mt-4 flex items-center justify-between gap-4 bg-slate-100/80 p-2.5">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 font-sans font-bold text-xs text-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Scellement Cryptographique &bull; Inviolabilité BéninChain</span>
                  </div>
                  <p className="text-[9px] text-slate-600 leading-tight">
                    Acte inscrit de façon inaltérable au Livre Foncier National. Toute altération physique ou numérique
                    rompt immédiatement la concordance cryptographique et rend l&apos;acte nul.
                  </p>
                  <p className="text-[9px] font-mono text-slate-700">
                    <strong>Empreinte SHA-256 :</strong>{" "}
                    <span className="break-all font-bold text-slate-900">{document.hashSha256}</span>
                  </p>
                  <p className="text-[9px] font-mono text-slate-600">
                    Preuve OpenTimestamps : <span className="font-bold">{document.otsProof}</span>
                  </p>
                </div>

                {/* QR Code officiel d'authentification */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="p-1.5 bg-white border border-black shadow-xs">
                    <QRCodeSVG value={qrPayload} size={82} level="H" />
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase text-slate-700 mt-0.5">
                    Flash Vérification
                  </span>
                </div>
              </div>

              {/* Mention de bas de page réglementaire */}
              <div className="text-center pt-2 text-[8px] text-slate-500 font-sans uppercase tracking-wider">
                Document délivré conformément aux dispositions du Code Foncier et Domanial et du Code du Numérique de la République du Bénin
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
