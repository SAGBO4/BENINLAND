"use client";

import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Smartphone, CheckCircle2, ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

interface MobileMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  montantDefault?: number;
  motifDefault?: string;
  parcelleCode?: string;
  onSuccess?: (txData: {
    transactionId: string;
    operateur: string;
    montant: number;
    reference: string;
  }) => void;
}

export function MobileMoneyModal({
  isOpen,
  onClose,
  montantDefault = 4500000,
  motifDefault = "Séquestre notarié — Cession foncière",
  parcelleCode = "OUI-0421",
  onSuccess,
}: MobileMoneyModalProps) {
  const [operateur, setOperateur] = useState<"MTN_MOMO" | "MOOV_MONEY" | "CELTIIS">("MTN_MOMO");
  const [telephone, setTelephone] = useState("+229 97 00 12 34");
  const [montant, setMontant] = useState(montantDefault);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<{
    id: string;
    date: string;
    montant: number;
    operateur: string;
  } | null>(null);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const tx = {
        id: `MOMO-BEN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        montant,
        operateur,
      };
      setIsProcessing(false);
      setCompletedTx(tx);
      if (onSuccess) {
        onSuccess({
          transactionId: tx.id,
          operateur,
          montant,
          reference: parcelleCode,
        });
      }
    }, 900);
  };

  const handleReset = () => {
    setCompletedTx(null);
    setIsProcessing(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        handleReset();
        onClose();
      }}
      title="Consignation sous Séquestre Mobile Money"
      description="Paiement réglementé garanti par le Trésor Public (DGTCP / TrésorPay)"
    >
      <div className="space-y-5 text-xs text-slate-300">
        {completedTx ? (
          <div className="space-y-4 text-center py-2 animate-rise">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">Fonds Consignés sous Séquestre avec Succès</h4>
              <p className="text-xs text-slate-400">
                Les fonds sont bloqués sur le Compte Unique du Trésor et ne seront libérés au vendeur qu&apos;après le visa définitif de l&apos;ANDF.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Réf. Transaction :</span>
                <span className="font-bold text-amber-400">{completedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Parcelle cible :</span>
                <span className="font-bold text-white">{parcelleCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Montant consigné :</span>
                <span className="font-bold text-emerald-400">{formatFcfa(completedTx.montant)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Opérateur :</span>
                <span className="text-slate-300">{completedTx.operateur}</span>
              </div>
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              onClick={() => {
                handleReset();
                onClose();
              }}
            >
              Fermer la passerelle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Choix de l'opérateur */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Opérateur de Mobile Money Agréé :</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOperateur("MTN_MOMO")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    operateur === "MTN_MOMO"
                      ? "border-amber-400 bg-amber-950/30 text-amber-300 font-bold"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-xs font-black">MTN MoMo</span>
                  <span className="text-[10px] text-slate-400">*880#</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperateur("MOOV_MONEY")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    operateur === "MOOV_MONEY"
                      ? "border-blue-400 bg-blue-950/30 text-blue-300 font-bold"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-xs font-black">Moov Money</span>
                  <span className="text-[10px] text-slate-400">*155#</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperateur("CELTIIS")}
                  className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                    operateur === "CELTIIS"
                      ? "border-emerald-400 bg-emerald-950/30 text-emerald-300 font-bold"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <span className="text-xs font-black">Celtiis Cash</span>
                  <span className="text-[10px] text-slate-400">*889#</span>
                </button>
              </div>
            </div>

            {/* Téléphone & Montant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Numéro de téléphone :</label>
                <Input
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+229 97 00 12 34"
                  className="bg-slate-950 border-slate-800 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Montant du séquestre (FCFA) :</label>
                <Input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(Number(e.target.value))}
                  className="bg-slate-950 border-slate-800 text-xs font-mono font-bold text-amber-400"
                />
              </div>
            </div>

            {/* Récapitulatif légal */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Garantie de Séquestre Républicain</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ce versement est consigné sur le sous-compte séquestre officiel de l&apos;Étude Notariale ouvert au Trésor Public.
                Il est irrévocablement bloqué jusqu&apos;à l&apos;obtention de la signature de l&apos;ANDF.
              </p>
            </div>

            <Button
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs shadow-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validation de la transaction en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Valider la Consignation de {formatFcfa(montant)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  );
}
