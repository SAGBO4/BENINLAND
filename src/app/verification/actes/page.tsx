"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileCheck, ShieldAlert, CheckCircle2, AlertTriangle, Lock, RefreshCw, Sparkles } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";

export default function VerifierActesPage() {
  const [actes, setActes] = useState<any[]>(anyigbaRepo.getAllActes());
  const [tamperResult, setTamperResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulateTamper = (refActe: string) => {
    setLoading(true);
    setTimeout(() => {
      const res = anyigbaRepo.simulateDocumentTampering(refActe);
      setTamperResult(res);
      setActes(anyigbaRepo.getAllActes());
      setLoading(false);
    }, 400);
  };

  const handleReset = () => {
    anyigbaRepo.resetToDeterministicSeed();
    setActes(anyigbaRepo.getAllActes());
    setTamperResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Coffre-Fort Numérique des Actes Foncier</h1>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30 uppercase">
                  SHA-256 &amp; BéninChain
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vérification mathématique de l&apos;intégrité des Titres Fonciers, plans de géomètre et actes notariés
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-background border border-border hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser les Preuves</span>
          </button>
        </div>

        {/* Démonstrateur de falsification */}
        {tamperResult && (
          <div className="p-6 rounded-2xl bg-destructive/15 border border-destructive/40 text-foreground space-y-3 animate-rise">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>❌ ALERTE FALSIFICATION DÉTECTÉE PAR LE GRAND LIVRE SOUVERAIN</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Une modification non autorisée a été simulée sur le document. Le système a recalculé l&apos;empreinte SHA-256
              et constaté qu&apos;elle ne concorde plus avec la preuve ancrée dans la blockchain.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-background border border-success/40">
                <span className="text-[10px] text-success block">Empreinte Légitime Enregistrée :</span>
                <span className="text-[11px] text-success font-bold truncate block">{tamperResult.hashOriginal}</span>
              </div>
              <div className="p-3 rounded-lg bg-background border border-destructive/40">
                <span className="text-[10px] text-destructive block">Empreinte Altérée Constatée :</span>
                <span className="text-[11px] text-destructive font-bold truncate block">{tamperResult.hashFalsifie}</span>
              </div>
            </div>
          </div>
        )}

        {/* Liste des actes du coffre-fort */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 text-xs">
          <h2 className="text-base font-bold text-foreground">Titres et Actes Officiellement Scellés</h2>

          <div className="space-y-4">
            {actes.map((acte) => (
              <div
                key={acte.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  acte.estFalsifie
                    ? "bg-destructive/10 border-destructive/50"
                    : "bg-background/80 border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                  <div>
                    <span className="font-mono font-bold text-sm text-foreground">{acte.referenceActe}</span>
                    <span className="text-muted-foreground ml-2">Parcelle : {acte.parcelleCode}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      acte.estFalsifie
                        ? "bg-destructive/20 text-destructive border-destructive/30"
                        : "bg-success/20 text-success border border-success/30"
                    }`}
                  >
                    {acte.estFalsifie ? "FALSIFICATION DÉTECTÉE ❌" : "PREUVE BLOCKCHAIN CONFORME ✓"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block">Signataire Autorisé</span>
                    <strong className="text-foreground">{acte.signataire}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-border font-mono">
                    <span className="text-[10px] text-muted-foreground block">Ancrage Bitcoin (OpenTimestamps)</span>
                    <span className="text-secondary truncate block">{acte.otsProof}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card border border-border font-mono">
                    <span className="text-[10px] text-muted-foreground block">Tx BéninChain</span>
                    <span className="text-primary truncate block">{acte.txBlockchainId}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <div className="text-[10px] text-muted-foreground font-mono truncate max-w-md">
                    Hash SHA-256 : {acte.hashSha256}
                  </div>

                  {!acte.estFalsifie && (
                    <button
                      type="button"
                      onClick={() => handleSimulateTamper(acte.referenceActe)}
                      disabled={loading}
                      className="px-3 py-1.5 rounded-lg bg-destructive/15 hover:bg-destructive/25 text-destructive font-bold text-[11px] border border-destructive/30 transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Simuler une Falsification de cet Acte</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
