"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Lock,
  Coins,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Mic,
  FileText,
  UserCheck,
  AlertTriangle,
  Play,
  Smartphone,
  Check,
} from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { MobileMoneyModal } from "@/components/simulators/MobileMoneyModal";

interface InteractiveScenarioProps {
  onRefreshData?: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

export function InteractiveScenario({ onRefreshData, onNavigateToTab }: InteractiveScenarioProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepLoading, setStepLoading] = useState(false);
  const [scenarioMessage, setScenarioMessage] = useState<string | null>(null);
  const [fraudMessage, setFraudMessage] = useState<string | null>(null);
  const [momoOpen, setMomoOpen] = useState(false);
  const [momoSuccess, setMomoSuccess] = useState(false);

  const steps = [
    {
      num: 1,
      titre: "Convention au Village & Voix",
      acteur: "Mamadou Bio (Agent Foncier)",
      lieu: "Pahou, Arrondissement de Ouidah",
      description: "Levé GPS des 4 bornes, contrôle d'absence de chevauchement PostGIS et recueil vocal des consentements en Fongbe.",
    },
    {
      num: 2,
      titre: "Verrou Notarial d'Opposabilité",
      acteur: "Me Christian Agbossou (Notaire)",
      lieu: "Étude Notariale de Ouidah",
      description: "Dépôt officiel du dossier de cession. Pose immédiate du verrou d'opposabilité bloquant toute mutation concurrente.",
    },
    {
      num: 3,
      titre: "Tentative de Double Vente Déjouée",
      acteur: "Acheteur Frauduleux Rejeté",
      lieu: "Registre National Centralisé",
      description: "Simulation d'une tentative concurrente d'achat sur la même parcelle. Rejet catégorique avec code HTTP 409 Conflict.",
    },
    {
      num: 4,
      titre: "Séquestre Financier Mobile Money",
      acteur: "Koffi Mensah (Acquéreur)",
      lieu: "Passerelle TrésorPay / CUT",
      description: "Consignation de 4 500 000 FCFA sous séquestre Mobile Money au Compte Unique du Trésor Public.",
    },
    {
      num: 5,
      titre: "Instruction & Visa Régalien ANDF",
      acteur: "Mme Reine Houndété (Directrice ANDF)",
      lieu: "Conservation Foncière Nationale",
      description: "Contrôle de conformité juridique et cadastrale, validation républicaine et signature électronique de l'acte.",
    },
    {
      num: 6,
      titre: "Titre Scellé & Déblocage des Fonds",
      acteur: "État Béninois & BéninChain",
      lieu: "Grand Livre Cryptographique",
      description: "Délivrance du CPF certifié à l'acquéreur, levée du verrou, libération des fonds au vendeur et empreinte SHA-256 ancrée.",
    },
  ];

  const handleNextStep = async () => {
    setStepLoading(true);
    setScenarioMessage(null);
    setFraudMessage(null);

    try {
      if (currentStep === 1) {
        // Enregistrer la convention villageoise
        await fetch("/api/v1/conventions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentNpi: "FICTIF-BEN-2026-0045",
            agentNom: "Mamadou Bio (Agent Foncier)",
            vendeurNpi: "FICTIF-BEN-2026-0041",
            vendeurNom: "Germain Dossou",
            acheteurNpi: "FICTIF-BEN-2026-0003",
            acheteurNom: "Koffi Mensah",
            commune: "Ouidah",
            village: "Pahou",
            surfaceM2: 1250,
            prixFcfa: 4500000,
            temoignagesVocaux: [
              { temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24 },
              { temoinNom: "Chef Dah Sèhou", qualite: "Chef coutumier", langue: "Fongbe", dureeSecondes: 45 },
            ],
          }),
        });

        setScenarioMessage(
          "Étape 1 validée : Procès-verbal de bornage contradictoire enregistré. Les 4 bornes GPS sont géoréférencées à Pahou sans chevauchement. Consentements oraux en Fongbe archivés."
        );
        setCurrentStep(2);
      } else if (currentStep === 2) {
        // Poser le verrou notarial
        const res = await fetch("/api/v1/mutations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parcelleCode: "OUI-0421",
            cedantNpi: "FICTIF-BEN-2026-0041",
            cedantNom: "Germain Dossou",
            cessionnaireNpi: "FICTIF-BEN-2026-0003",
            cessionnaireNom: "Koffi Mensah",
            notaireId: "Me Christian Agbossou",
            prixFcfa: 4500000,
          }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setScenarioMessage(
            "Étape 2 validée : Dossier de mutation ouvert à l'Étude de Me Agbossou. Verrou d'opposabilité immédiat posé sur OUI-0421. Toute autre tentative de vente est mathématiquement impossible."
          );
          setCurrentStep(3);
        }
      } else if (currentStep === 3) {
        // Simuler la tentative de fraude / double-vente
        const res = await fetch("/api/v1/mutations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parcelleCode: "OUI-0421",
            cedantNpi: "FICTIF-BEN-2026-0041",
            cedantNom: "Germain Dossou",
            cessionnaireNpi: "FICTIF-BEN-2026-9999",
            cessionnaireNom: "Second Acheteur Abusif",
            notaireId: "Autre Clerc de Notaire",
            prixFcfa: 5200000,
          }),
        });
        const data = await res.json();

        if (!res.ok && res.status === 409) {
          setFraudMessage(
            `REJET D'ÉTAT (HTTP 409 CONFLICT) : ${data.error}. Le verrou notarial posé par Me Agbossou a immédiatement neutralisé la double vente !`
          );
          setScenarioMessage(
            "Étape 3 validée : La tentative concurrente frauduleuse a été refoulée en temps réel. Aucune double vente n'a pu aboutir."
          );
          setCurrentStep(4);
        }
      } else if (currentStep === 4) {
        // Ouvrir la passerelle Mobile Money
        setMomoOpen(true);
      } else if (currentStep === 5) {
        // Visa ANDF
        const res = await fetch("/api/v1/mutations/MUT-2026-0089/finaliser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officerName: "Mme Reine Houndété (Directrice ANDF)" }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setScenarioMessage(
            "Étape 5 validée : Examen de conformité complété par l'ANDF. Visa républicain apposé. L'ordre d'émission du Certificat de Propriété Foncière (CPF) est scellé."
          );
          setCurrentStep(6);
        }
      } else if (currentStep === 6) {
        setScenarioMessage(
          "Félicitations ! Le cycle complet de sécurisation foncière Anyigba est achevé. M. Koffi Mensah détient son titre officiel scellé par empreinte SHA-256. La Famille Dossou a perçu l'intégralité des 4 500 000 FCFA débloqués du séquestre."
        );
      }

      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setStepLoading(false);
    }
  };

  const handleMomoSuccess = () => {
    setMomoSuccess(true);
    setScenarioMessage(
      "Étape 4 validée : Consignation de 4 500 000 FCFA sous séquestre Mobile Money réussie. Les fonds sont cantonnés sur le compte séquestre TrésorPay."
    );
    setCurrentStep(5);
    if (onRefreshData) onRefreshData();
  };

  const handleResetScenario = async () => {
    setStepLoading(true);
    try {
      await fetch("/api/v1/demo/reset", { method: "POST" });
      setCurrentStep(1);
      setScenarioMessage(null);
      setFraudMessage(null);
      setMomoSuccess(false);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setStepLoading(false);
    }
  };

  const progressPercent = Math.round((currentStep / 6) * 100);

  return (
    <div className="space-y-8 py-4">
      {/* 1. BANNIÈRE SCÉNARIO FIL CONDUCTEUR (CONTRASTE SOUVERAIN) */}
      <div className="rounded-2xl border-2 border-[#0a3764]/30 bg-[#06213d] text-white shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#008751]/20 text-emerald-300 border border-[#008751]/40">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Démonstration Régaliennne Complète</span>
              </span>
              <span className="text-xs text-slate-300 font-medium">&bull; Scénario Pilote Ouidah 2026</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Vente Foncier de la Famille Dossou à Pahou (Parcelle OUI-0421)
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              Suivez en direct le parcours intégral d&apos;une transaction foncière : du procès-verbal de bornage avec consentement
              vocal en Fongbe jusqu&apos;à l&apos;émission du titre scellé et la tentative de double vente déjouée.
            </p>
          </div>

          <button
            type="button"
            className="self-start md:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0"
            onClick={handleResetScenario}
            disabled={stepLoading}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Réinitialiser Scénario</span>
          </button>
        </div>

        {/* Barre de progression globale */}
        <div className="pt-6 mt-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Progression de la Procédure Foncier :</span>
            <span className="text-amber-400 font-mono text-sm">Étape {currentStep} sur 6 ({progressPercent}%)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#008751] to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages d'alerte et de confirmation d'étape */}
      {scenarioMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-rise">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="leading-relaxed font-semibold">{scenarioMessage}</span>
        </div>
      )}

      {fraudMessage && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-rise">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
          <span className="leading-relaxed font-bold">{fraudMessage}</span>
        </div>
      )}

      {/* 2. DÉROULEMENT SÉQUENTIEL DES 6 ÉTAPES (CONTRASTE ÉLEVÉ ET LISIBILITÉ SOUVERAINE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {steps.map((st) => {
          const isDone = currentStep > st.num;
          const isCurrent = currentStep === st.num;

          return (
            <div
              key={st.num}
              className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between gap-3 ${
                isCurrent
                  ? "border-2 border-[#008751] bg-white shadow-xl ring-4 ring-[#008751]/10"
                  : isDone
                  ? "border-emerald-300 bg-emerald-50/30 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isDone
                          ? "bg-[#008751] text-white shadow-xs"
                          : isCurrent
                          ? "bg-[#ffbe00] text-slate-950 font-black shadow-xs animate-pulse"
                          : "bg-slate-100 text-slate-700 font-bold border border-slate-200"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.num}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                      {st.titre}
                    </h4>
                  </div>

                  {isDone ? (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Validée
                    </span>
                  ) : isCurrent ? (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      En cours
                    </span>
                  ) : (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      En attente
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs pt-2.5 border-t border-slate-100">
                  <p className="text-slate-600">
                    <strong className="text-slate-900 font-semibold">Acteur :</strong>{" "}
                    <span className="text-slate-800 font-medium">{st.acteur}</span>
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-900 font-semibold">Territoire :</strong>{" "}
                    <span className="text-slate-800 font-medium">{st.lieu}</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-100/80">
                    {st.description}
                  </p>
                </div>
              </div>

              {/* Contenu spécifique par étape active */}
              {isCurrent && st.num === 1 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    Attestation vocale Fongbe enregistrée au village :
                  </span>
                  <AudioPhrasePlayer phraseKey="parcelle_titre_foncier_valide" />
                </div>
              )}

              {isCurrent && st.num === 4 && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                    <span className="text-amber-800 font-semibold block mb-0.5">Prix de cession convenu :</span>
                    <strong className="text-amber-950 text-base font-mono font-black">
                      {formatFcfa(4500000)}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. BARRE D'ACTION PRINCIPALE DU SCÉNARIO (CONTRASTE ÉLEVÉ) */}
      <div className="rounded-2xl border-2 border-[#0a3764]/20 bg-[#06213d] text-white shadow-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-xs space-y-1 w-full sm:w-auto">
            <span className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Action requise pour l&apos;Étape {currentStep} :
            </span>
            <p className="text-white text-sm font-medium leading-relaxed max-w-2xl">
              {currentStep === 1
                ? "Enregistrer le procès-verbal de bornage contradictoire et sceller les consentements oraux en Fongbe."
                : currentStep === 2
                ? "Déposer la promesse de cession à l'Étude notariale et activer le verrou d'opposabilité immédiat."
                : currentStep === 3
                ? "Simuler une tentative de double vente pour éprouver la résistance algorithmique du verrou foncier."
                : currentStep === 4
                ? "Effectuer la consignation de 4 500 000 FCFA sous séquestre Mobile Money au Compte Unique du Trésor."
                : currentStep === 5
                ? "Valider l'instruction régalienne par la Directrice de l'ANDF et délivrer le titre officiel."
                : "Procédure achevée avec succès. L'acte authentique est scellé et opposable à tous."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
            {currentStep <= 6 && (
              <button
                className="w-full sm:w-auto inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold px-6 py-3 text-xs sm:text-sm shadow-lg shadow-[#008751]/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                onClick={handleNextStep}
                disabled={stepLoading}
              >
                {stepLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Traitement en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>
                      {currentStep === 1
                        ? "Exécuter Étape 1 (Bornage & Voix)"
                        : currentStep === 2
                        ? "Poser le Verrou Notarial"
                        : currentStep === 3
                        ? "Tenter la Double Vente (Simulation Rejet)"
                        : currentStep === 4
                        ? "Consigner 4 500 000 FCFA (MoMo)"
                        : currentStep === 5
                        ? "Apposer le Visa ANDF"
                        : "Consulter l'Acte Scellé"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            )}

            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-slate-400 hover:text-white"
                onClick={handleResetScenario}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modale Mobile Money dédiée pour l'Étape 4 */}
      <MobileMoneyModal
        isOpen={momoOpen}
        onClose={() => setMomoOpen(false)}
        montantDefault={4500000}
        motifDefault="Séquestre Cession Parcelle OUI-0421 (Famille Dossou)"
        parcelleCode="OUI-0421"
        onSuccess={handleMomoSuccess}
      />
    </div>
  );
}
