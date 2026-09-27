"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Building2,
  Calculator,
  Coins,
  CheckCircle2,
  MapPin,
  Landmark,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Printer,
  ArrowRight,
  Fingerprint,
  QrCode,
  FileCheck2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { QRCodeSVG } from "qrcode.react";

export default function CommunePage() {
  const { user } = useAuth();
  const communeName = user?.commune || "Ouidah";

  // Formulaire d'évaluation cadastrale
  const [selectedParcelle, setSelectedParcelle] = useState("OUI-0421");
  const [arrondissement, setArrondissement] = useState("Pahou");
  const [prixAchat, setPrixAchat] = useState(2000000);
  const [prixVente, setPrixVente] = useState(4500000);
  const [travaux, setTravaux] = useState(500000);

  // Workflow de règlement et d'encaissement
  const [modePaiement, setModePaiement] = useState<"TRESORPAY" | "MTN_MOMO" | "MOOV_MONEY">("TRESORPAY");
  const [telephoneOuCompte, setTelephoneOuCompte] = useState("+229 97 00 11 22");
  const [paiementState, setPaiementState] = useState<"IDLE" | "PROCESSING" | "ACCEPTED">("IDLE");
  const [quittanceNumero, setQuittanceNumero] = useState<string | null>(null);

  // Certificat scellé émis
  const [certificatEmis, setCertificatEmis] = useState<any>(null);

  const tauxCommunal = 0.05; // 5% de taxe de plus-value communale
  const plusValueBrute = Math.max(0, prixVente - prixAchat - travaux);
  const taxeCalculee = Math.round(plusValueBrute * tauxCommunal);

  // Sélection rapide de parcelles communales pré-remplies
  const handleSelectPredefinedParcelle = (code: string) => {
    setSelectedParcelle(code);
    if (code === "OUI-0421") {
      setArrondissement("Pahou");
      setPrixAchat(2000000);
      setPrixVente(4500000);
      setTravaux(500000);
    } else if (code === "OUI-0104") {
      setArrondissement("Ouidah I");
      setPrixAchat(20000000);
      setPrixVente(45000000);
      setTravaux(5000000);
    }
  };

  // Traitement du règlement TrésorPay / Mobile Money
  const handleValiderPaiement = async () => {
    setPaiementState("PROCESSING");
    setCertificatEmis(null);

    // Traitement de l'encaissement TrésorPay / Mobile Money (1.2 seconde)
    setTimeout(async () => {
      const randomTresor = Math.floor(10000 + Math.random() * 90000);
      const quittanceRef = `TRESOR-DGTCP-2026-${randomTresor}`;
      setQuittanceNumero(quittanceRef);
      setPaiementState("ACCEPTED");

      try {
        const res = await fetch("/api/v1/commune/certificats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codeParcelle: selectedParcelle,
            commune: communeName,
            arrondissement,
            prixAcquisitionInitial: prixAchat,
            prixFixeFcfa: prixVente,
            travauxDeductibles: travaux,
            modePaiement,
            agentMairieNpi: user?.npi || "FICTIF-BEN-2026-0033",
            agentMairieNom: user ? `${user.prenom} ${user.nom}` : "Sètondji Gbedji (Chef Service Foncier)",
          }),
        });

        const json = await res.json();
        if (res.ok && json.success) {
          setCertificatEmis(json.data);
          setQuittanceNumero(json.data.quittanceTresorRef);
          // Persistance locale partagée pour le terminal de l'agent foncier
          if (typeof window !== "undefined") {
            const currentList = JSON.parse(localStorage.getItem("anyigba_commune_certificats") || "[]");
            currentList.unshift(json.data);
            localStorage.setItem("anyigba_commune_certificats", JSON.stringify(currentList));
          }
        }
      } catch (err) {
        console.error("Erreur émission certificat:", err);
      }
    }, 1200);
  };

  return (
    <>
      {/* Interface Utilisateur Principale (Cachée à l'impression) */}
      <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin print:hidden">
        <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
          {/* En-tête Espace Mairie / Commune */}
          <Card className="border-emerald-500/40 shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                        Mairie &amp; Direction des Affaires Domaniales
                      </CardTitle>
                      <Badge variant="success" className="text-[10px] uppercase font-bold px-2.5">
                        Commune de {communeName}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Fixation légale des prix fonciers de mutation, liquidation de la taxe sur la plus-value et émission du Certificat Municipal scellé sur la Blockchain
                    </CardDescription>
                  </div>
                </div>

                <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                  <span className="text-[10px] text-muted-foreground block font-medium">Chef Service Foncier Communal</span>
                  <strong className="text-foreground">
                    {user ? `${user.prenom} ${user.nom}` : "Sètondji Gbedji"}
                  </strong>
                  <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                    NPI : {user?.npi || "FICTIF-BEN-2026-0033"}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Règle légale fondamentale */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 text-xs flex items-start gap-3">
            <Landmark className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block text-sm">
                Compétence Légale Exclusive de la Mairie — Article 142 du Code Foncier et Domanial
              </strong>
              <p className="leading-relaxed text-muted-foreground mt-0.5">
                Seul le QR-Code du <strong>Certificat d&apos;Évaluation et de Fixation du Prix</strong> délivré par la Mairie
                après paiement effectif des droits communaux peut fixer le prix de transaction opposable chez l&apos;Agent Foncier et le Notaire.
                Tout acte instrumenté sans certificat municipal scellé est frappé de nullité relative.
              </p>
            </div>
          </div>

          {/* Résultat : Certificat Émis et Scellé sur Blockchain avec QR Code */}
          {certificatEmis && (
            <Card className="border-emerald-500/50 bg-emerald-500/10 shadow-2xl animate-rise">
              <CardHeader className="p-5 sm:p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                          Certificat Municipal d&apos;Évaluation et de Fixation du Prix Délivré !
                        </CardTitle>
                        <Badge variant="success" className="text-[10px] font-bold">
                          Scellé sur la Blockchain
                        </Badge>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground mt-0.5">
                        Quittance Trésor N° <strong>{certificatEmis.quittanceTresorRef}</strong> &bull; Référence : <strong className="font-mono text-primary">{certificatEmis.codeCertificat}</strong>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => window.print()}
                      className="gap-2 font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-10 px-4 text-xs"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer / Télécharger le Certificat en PDF (A4)</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* QR Code Scannable pour l'Agent Foncier */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm text-center space-y-2">
                    <QRCodeSVG
                      value={JSON.stringify({
                        type: "CERTIFICAT_COMMUNE_PRIX",
                        codeCertificat: certificatEmis.codeCertificat,
                        codeParcelle: certificatEmis.codeParcelle,
                        commune: certificatEmis.commune,
                        prixFixeFcfa: certificatEmis.prixFixeFcfa,
                        taxePayeeFcfa: certificatEmis.taxeCalculeeFcfa,
                        quittanceTresor: certificatEmis.quittanceTresorRef,
                        dateEmission: certificatEmis.dateEmission,
                        hash: certificatEmis.hashSha256,
                        ots: certificatEmis.otsProof,
                      })}
                      size={140}
                      level="H"
                    />
                    <div className="font-mono text-[11px] leading-tight">
                      <strong className="text-slate-950 block">QR-CODE DU PRIX OFFICIEL</strong>
                      <span className="text-slate-600 text-[10px]">
                        Ce QR-Code doit être scanné sur le terminal de l&apos;Agent Foncier
                      </span>
                    </div>
                  </div>

                  {/* Détails du certificat */}
                  <div className="md:col-span-8 space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-xl bg-background/90 border border-border">
                        <span className="text-[10px] text-muted-foreground block font-medium">Prix Fixé Officiel (Mairie)</span>
                        <strong className="text-secondary font-mono text-base block mt-0.5">
                          {formatFcfa(certificatEmis.prixFixeFcfa)}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-background/90 border border-border">
                        <span className="text-[10px] text-muted-foreground block font-medium">Taxe Communale Encaissée</span>
                        <strong className="text-foreground font-mono text-sm block mt-0.5">
                          {formatFcfa(certificatEmis.taxeCalculeeFcfa)} (5%)
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-background/90 border border-border">
                        <span className="text-[10px] text-muted-foreground block font-medium">Mode de Règlement</span>
                        <span className="font-bold text-emerald-400 block mt-0.5">
                          {certificatEmis.modePaiement} (Trésor Public)
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-background/90 border border-emerald-500/30 space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Empreinte Cryptographique SHA-256 :</span>
                        <Badge variant="outline" className="text-[9px] border-emerald-500/40 text-emerald-400">
                          {certificatEmis.otsProof}
                        </Badge>
                      </div>
                      <div className="truncate text-foreground font-bold">{certificatEmis.hashSha256}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1 border-t border-border/50">
                        <Fingerprint className="w-3.5 h-3.5 text-primary" />
                        <span>Preuve d&apos;ancrage blockchain Bitcoin scellée &bull; Opposable à tous tiers et structures</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <a
                        href={`/verification?code=${certificatEmis.codeCertificat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-muted border border-border text-foreground font-bold text-xs transition"
                      >
                        <span>Contrôler sur le Portail de Vérification Publique</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href="/espace/agent"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs transition shadow-sm hover:opacity-90"
                      >
                        <span>Ouvrir le Terminal de l&apos;Agent Foncier pour lier ce prix</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire d'instruction et de liquidation du prix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
            {/* Colonne Gauche : Évaluation & Liquidation (7 colonnes) */}
            <Card className="lg:col-span-7 border-border shadow-xl bg-card">
              <CardHeader className="p-5 sm:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Calculator className="w-4 h-4" />
                    <span>Module d&apos;Évaluation Fiscale Cadastrale &amp; Fixation du Prix</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Session Officielle Mairie
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Instruction cadastrale obligatoire pour fixer la valeur vénale officielle opposable de la parcelle.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                {/* Sélection de la parcelle */}
                <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-2">
                  <span className="text-[11px] font-bold text-foreground block">
                    1. Référence Cadastrale de la Parcelle concernée :
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleSelectPredefinedParcelle("OUI-0421")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        selectedParcelle === "OUI-0421"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>OUI-0421 (Pahou &bull; 1 250 m²)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPredefinedParcelle("OUI-0104")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        selectedParcelle === "OUI-0104"
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>OUI-0104 (Fort Français &bull; 480 m²)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="text-muted-foreground text-[10px]">Identifiant Parcelle (IUF) :</label>
                      <Input
                        type="text"
                        value={selectedParcelle}
                        onChange={(e) => setSelectedParcelle(e.target.value.toUpperCase())}
                        className="h-8 text-xs font-mono font-bold bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground text-[10px]">Arrondissement territorial :</label>
                      <Input
                        type="text"
                        value={arrondissement}
                        onChange={(e) => setArrondissement(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Saisie financière */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-foreground text-xs font-semibold">
                      Prix d&apos;Acquisition Initial Déclaré (FCFA) :
                    </label>
                    <Input
                      type="number"
                      value={prixAchat}
                      onChange={(e) => setPrixAchat(Number(e.target.value))}
                      className="h-9 text-xs font-mono bg-background"
                    />
                    <span className="text-[10px] text-muted-foreground">Valeur portée sur le titre ou acte d&apos;origine</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground text-xs font-semibold flex items-center justify-between">
                      <span>Prix de Cession Officiel Fixé par la Mairie (FCFA) :</span>
                      <span className="text-[10px] text-secondary font-bold">Valeur Légale Opposable</span>
                    </label>
                    <Input
                      type="number"
                      value={prixVente}
                      onChange={(e) => setPrixVente(Number(e.target.value))}
                      className="h-9 text-xs font-mono font-bold text-secondary bg-background border-secondary/50"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Ce montant exact sera scellé dans le QR-Code et verrouillera le prix dans le terminal de l&apos;agent
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-foreground text-xs font-semibold">
                      Travaux, Viabilisation et Aménagements Justifiés (FCFA) :
                    </label>
                    <Input
                      type="number"
                      value={travaux}
                      onChange={(e) => setTravaux(Number(e.target.value))}
                      className="h-9 text-xs font-mono bg-background"
                    />
                  </div>
                </div>

                {/* Décompte de liquidation */}
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Plus-Value Nette Imposable :</span>
                    <strong className="text-foreground text-sm font-mono">{formatFcfa(plusValueBrute)}</strong>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/80">
                    <span className="font-bold text-primary">Taxe Communale Reversée au Budget Local (5%) :</span>
                    <strong className="text-secondary text-base font-bold font-mono">{formatFcfa(taxeCalculee)}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colonne Droite : Règlement Électronique TrésorPay / MoMo (5 colonnes) */}
            <Card className="lg:col-span-5 border-border shadow-xl bg-card">
              <CardHeader className="p-5 sm:p-6 pb-4">
                <div className="flex items-center gap-2 text-secondary font-bold text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Paiement Électronique &amp; Émission du Certificat</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  TrésorPay / Mobile Money Bénin — Émission instantanée du certificat blockchain dès encaissement.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                {/* Sélection du canal de paiement */}
                <div className="space-y-2">
                  <label className="text-foreground text-xs font-semibold block">Canal de Règlement :</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setModePaiement("TRESORPAY")}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        modePaiement === "TRESORPAY"
                          ? "bg-primary/20 border-primary text-primary font-bold"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      <Landmark className="w-4 h-4" />
                      <span className="text-[10px]">TrésorPay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModePaiement("MTN_MOMO")}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        modePaiement === "MTN_MOMO"
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span className="text-[10px]">MTN MoMo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModePaiement("MOOV_MONEY")}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        modePaiement === "MOOV_MONEY"
                          ? "bg-blue-500/20 border-blue-500 text-blue-400 font-bold"
                          : "bg-background border-border text-muted-foreground"
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span className="text-[10px]">Moov Money</span>
                    </button>
                  </div>
                </div>

                {/* Saisie compte / téléphone */}
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">
                    Numéro de Téléphone / Compte Contribuable :
                  </label>
                  <Input
                    type="text"
                    value={telephoneOuCompte}
                    onChange={(e) => setTelephoneOuCompte(e.target.value)}
                    className="h-9 text-xs font-mono bg-background"
                  />
                  <span className="text-[10px] text-muted-foreground">Notification USSD sécurisée envoyée sur ce compte</span>
                </div>

                {/* Récapitulatif du débit */}
                <div className="p-3.5 rounded-xl bg-background/90 border border-border space-y-1.5">
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Bénéficiaire :</span>
                    <strong className="text-foreground">Recette Municipale de {communeName}</strong>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[11px]">
                    <span>Objet :</span>
                    <span className="text-foreground">Taxe Plus-Value Foncier &bull; {selectedParcelle}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[11px] pt-1 border-t border-border/60">
                    <span className="font-bold text-foreground">Montant à régler :</span>
                    <strong className="text-secondary font-mono text-sm">{formatFcfa(taxeCalculee)}</strong>
                  </div>
                </div>

                {/* Bouton d'action de paiement */}
                <Button
                  type="button"
                  onClick={handleValiderPaiement}
                  disabled={paiementState === "PROCESSING"}
                  className="w-full h-11 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  {paiementState === "PROCESSING" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Traitement de l&apos;encaissement TrésorPay...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Valider le Paiement &amp; Émettre le Certificat Blockchain</span>
                    </>
                  )}
                </Button>

                {/* Notification de confirmation */}
                {paiementState === "ACCEPTED" && quittanceNumero && (
                  <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-1 animate-rise">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Paiement Encaissé par le Trésor Public (DGTCP)</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Quittance N° <strong className="font-mono text-foreground">{quittanceNumero}</strong> émise. Le Certificat Municipal est prêt et scellé.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>

      {/* ============================================================ */}
      {/* MODE IMPRESSION (DOCUMENT OFFICIEL PDF A4 MUNICIPAL)         */}
      {/* ============================================================ */}
      {certificatEmis && (
        <div className="hidden print:block print:bg-white print:text-black print:min-h-screen p-8 text-sm max-w-4xl mx-auto font-sans leading-relaxed">
          {/* En-tête officiel de la République du Bénin et de la Mairie */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider">RÉPUBLIQUE DU BÉNIN</h1>
            <p className="text-xs uppercase font-medium">Fraternité - Justice - Travail</p>
            <div className="h-0.5 bg-black w-24 mx-auto my-2" />
            <h2 className="text-base font-bold uppercase">DÉPARTEMENT DE L&apos;ATLANTIQUE &bull; COMMUNE DE {communeName.toUpperCase()}</h2>
            <h3 className="text-sm font-semibold">DIRECTION DES AFFAIRES DOMANIALES ET DU CADASTRE</h3>
            <div className="mt-4 p-2 bg-slate-100 border border-black inline-block">
              <span className="text-base font-black uppercase tracking-wide">
                CERTIFICAT MUNICIPAL D&apos;ÉVALUATION ET DE FIXATION DU PRIX FONCIER
              </span>
            </div>
            <p className="font-mono text-xs mt-2">N° d&apos;Enregistrement : {certificatEmis.codeCertificat}</p>
          </div>

          {/* Corps de l'attestation */}
          <div className="space-y-4 mb-6 text-xs">
            <p>
              Le Chef de la Direction des Affaires Domaniales et du Cadastre de la Mairie de <strong>{communeName}</strong>,
              soussigné, certifie que la parcelle ci-après identifiée a fait l&apos;objet de l&apos;instruction cadastrale
              et de l&apos;évaluation fiscale réglementaire conformément aux dispositions du <strong>Code Foncier et Domanial</strong> (Loi n° 2013-01 modifiée)
              et du <strong>Code Général des Impôts</strong> de la République du Bénin :
            </p>

            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">1. Désignation Cadastrale de l&apos;Immeuble</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Identifiant Unique (IUF) :</strong> {certificatEmis.codeParcelle}</p>
                <p><strong>Arrondissement / Zone :</strong> {certificatEmis.arrondissement}</p>
                <p><strong>Commune de Rattachement :</strong> {communeName}</p>
                <p><strong>Destination :</strong> Terrain bâti / non aménagé</p>
              </div>
            </div>

            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">2. Évaluation et Fixation Légale du Prix</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Prix d&apos;Acquisition Initial :</strong> {formatFcfa(certificatEmis.prixAcquisitionInitial)}</p>
                <p>
                  <strong>PRIX DE TRANSACTION OFFICIEL FIXÉ :</strong>{" "}
                  <span className="text-sm font-black underline">{formatFcfa(certificatEmis.prixFixeFcfa)}</span>
                </p>
                <p><strong>Travaux et Aménagements Justifiés :</strong> {formatFcfa(certificatEmis.travauxDeductibles)}</p>
                <p><strong>Plus-Value Nette Imposable :</strong> {formatFcfa(certificatEmis.plusValueNette)}</p>
              </div>
            </div>

            <div className="border border-black p-4 space-y-2">
              <h4 className="font-bold border-b border-black pb-1 uppercase">3. Liquidation et Quittance de Paiement</h4>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Taxe Communale sur Plus-Value (5%) :</strong> {formatFcfa(certificatEmis.taxeCalculeeFcfa)}</p>
                <p><strong>Statut du Règlement :</strong> ACQUITTÉ &amp; ENCAISSÉ PAR LE TRÉSOR PUBLIC</p>
                <p><strong>Quittance TrésorPay DGTCP :</strong> <span className="font-mono font-bold">{certificatEmis.quittanceTresorRef}</span></p>
                <p><strong>Canal de Perception :</strong> {certificatEmis.modePaiement}</p>
              </div>
            </div>
          </div>

          {/* Règle légale d'opposabilité */}
          <div className="p-3 border border-black mb-6 bg-slate-50 text-[11px] leading-tight">
            <strong>MENTION LÉGALE D&apos;OPPOSABILITÉ (Art. 142 du Code Foncier et Domanial) :</strong>
            <p className="mt-1">
              Le présent certificat constitue la base d&apos;évaluation exclusive et opposable pour la rédaction de tout procès-verbal
              de bornage contradictoire par l&apos;Agent Foncier ou de tout acte notarié de mutation.
              <strong> Le QR-Code scellé ci-dessous fait foi devant toute autorité administrative ou judiciaire.</strong>
            </p>
          </div>

          {/* Signatures et Cachet */}
          <div className="flex justify-between items-start border-t-2 border-black pt-4 mb-6">
            <div className="text-center w-1/2">
              <p className="font-bold mb-1">Le Déclarant / Contribuable</p>
              <p className="text-[10px] italic">Reconnaît l&apos;évaluation et a acquitté les droits</p>
            </div>
            <div className="text-center w-1/2">
              <p className="font-bold mb-1">Pour le Maire &amp; P.O.</p>
              <p className="text-xs font-semibold">{certificatEmis.agentMairieNom}</p>
              <p className="text-[10px] italic mt-10">Cachet Officiel de la Mairie de {communeName}</p>
            </div>
          </div>

          {/* QR Code de scellement blockchain */}
          <div className="text-center border-t border-gray-400 pt-4 flex flex-col items-center">
            <p className="font-bold text-xs uppercase mb-1">Sceau Cryptographique et Ancrage Blockchain</p>
            <div className="p-2 border-2 border-black inline-block mb-1 bg-white">
              <QRCodeSVG
                value={JSON.stringify({
                  type: "CERTIFICAT_COMMUNE_PRIX",
                  codeCertificat: certificatEmis.codeCertificat,
                  codeParcelle: certificatEmis.codeParcelle,
                  commune: certificatEmis.commune,
                  prixFixeFcfa: certificatEmis.prixFixeFcfa,
                  taxePayeeFcfa: certificatEmis.taxeCalculeeFcfa,
                  quittanceTresor: certificatEmis.quittanceTresorRef,
                  dateEmission: certificatEmis.dateEmission,
                  hash: certificatEmis.hashSha256,
                  ots: certificatEmis.otsProof,
                })}
                size={95}
              />
            </div>
            <p className="text-[9px] font-mono break-all max-w-xl text-center">
              SHA-256 : {certificatEmis.hashSha256} &bull; Preuve OTS : {certificatEmis.otsProof}
            </p>
            <p className="text-[10px] italic mt-1">
              Flashez ce QR Code avec le terminal Agent Foncier pour importer et verrouiller le prix certifié de la parcelle.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
