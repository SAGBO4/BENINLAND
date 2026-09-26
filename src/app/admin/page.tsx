"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Settings, RotateCcw, ShieldCheck, Check, Activity, Database, Lock, Terminal } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";

export default function AdminPage() {
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetMsg(null);
    try {
      const res = await fetch("/api/v1/demo/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResetMsg("Base réinitialisée avec succès au seed 2026. L'état initial est restauré.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const mutations = anyigbaRepo.getAllMutations();
  const parcelles = anyigbaRepo.getAllParcelles();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 border border-slate-500/30 flex items-center justify-center">
              <Settings className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Console d&apos;Administration &amp; Audit Trail</h1>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30 uppercase">
                  Supervision Système
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Surveillance de l&apos;intégrité cryptographique, nœuds BéninChain et réinitialisation de démonstration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>Réinitialiser la Démo (Seed 2026)</span>
          </button>
        </div>

        {resetMsg && (
          <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-rise">
            <Check className="w-4 h-4 shrink-0" />
            <span>{resetMsg}</span>
          </div>
        )}

        {/* État des services */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Registre PostgreSQL &amp; PostGIS</span>
              <Database className="w-4 h-4 text-success" />
            </div>
            <div className="text-lg font-bold text-foreground">Opérationnel (v16.3.4)</div>
            <p className="text-[10px] text-muted-foreground">Extensions spatiales ST_Intersects actives</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Nœud Miroir BéninChain</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-foreground">Synchronisé (Bloc #421898)</div>
            <p className="text-[10px] text-muted-foreground">Smart Contract RegistreFoncier.sol prêt</p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Ancrage OpenTimestamps</span>
              <Lock className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-lg font-bold text-foreground">Scellement Bitcoin Actif</div>
            <p className="text-[10px] text-muted-foreground">Attestations d&apos;intégrité inaltérables</p>
          </div>
        </div>

        {/* Journal d'audit */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <Terminal className="w-4 h-4 text-primary" />
              <span>Journal d&apos;Audit Cryptographique (Audit Trail)</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Traçabilité inaltérable NTP</span>
          </div>

          <div className="p-4 rounded-xl bg-background/90 border border-border font-mono text-[11px] space-y-2 max-h-80 overflow-y-auto">
            <div className="text-muted-foreground">
              [2026-09-26 08:45:10 UTC] SYSTEM: Démarrage moteur Anyigba v1.0.0. 7 parcelles chargées en mémoire.
            </div>
            <div className="text-primary">
              [2026-09-26 08:48:22 UTC] MUTATION: Dossier MUT-2026-0089 sur CAL-0089 verrouillé par Me Agbossou.
            </div>
            <div className="text-amber-400">
              [2026-09-26 08:50:01 UTC] VERROU_PROTECTION: Alerte double vente prévenue. Refus concurrence actif.
            </div>
            <div className="text-success">
              [2026-09-26 08:52:14 UTC] BLOCKCHAIN_PROOF: Merkle Root scellée sur BéninChain (tx 0xbc421890).
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
