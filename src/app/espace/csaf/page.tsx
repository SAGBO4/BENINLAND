"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldAlert, CheckCircle2, AlertOctagon, FileText } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";

export default function CsafPage() {
  const [parcelleCode, setParcelleCode] = useState("LIT-ALL-005");
  const [demandeur, setDemandeur] = useState("Succession Gbénou");
  const [motif, setMotif] = useState("Revendication d'héritage coutumier et contestation de limite");
  const [gelSuccess, setGelSuccess] = useState(false);

  const handleGel = (e: React.FormEvent) => {
    e.preventDefault();
    const p = anyigbaRepo.getParcelleByCode(parcelleCode);
    if (p) {
      p.enLitige = true;
      setGelSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-destructive/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center">
              <Scale className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Cour Spéciale des Affaires Foncières (CSAF)</h1>
                <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold border border-destructive/30 uppercase">
                  Juridiction Spécialisée
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Gestion des contentieux fonciers, ordonnances de gel conservatoire et publication des jugements
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            Magistrat : <strong className="text-foreground">Juge Sossa (Chambre Foncière)</strong>
          </div>
        </div>

        {gelSuccess && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>
              Ordonnance de Gel Conservatoire publiée pour la parcelle {parcelleCode}. Toute transaction et mutation est
              immédiatement bloquée dans tout le système national.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
          {/* Formulaire de gel judiciaire */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>Ordonner un Gel Conservatoire Immédiat</span>
            </div>
            <form onSubmit={handleGel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-muted-foreground">Code Parcelle Litigieuse :</label>
                <input
                  type="text"
                  value={parcelleCode}
                  onChange={(e) => setParcelleCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Partie Demanderesse / Requérant :</label>
                <input
                  type="text"
                  value={demandeur}
                  onChange={(e) => setDemandeur(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Motif Juridique du Contentieux :</label>
                <textarea
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-xl shadow transition cursor-pointer"
              >
                Signer l&apos;Ordonnance &amp; Geler la Parcelle 🔴
              </button>
            </form>
          </div>

          {/* Dossiers actifs de la CSAF */}
          <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-sm text-foreground">Contentieux Actifs Référencés</h3>
            <div className="p-4 rounded-xl bg-background/80 border border-destructive/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground">LIT-ALL-005</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/20 text-destructive border border-destructive/30">
                  GEL ACTIF 🔴
                </span>
              </div>
              <p className="text-muted-foreground">
                Allada Attogon • Succession Gbénou c/ Hounkpatin • Revendication de succession coutumière
              </p>
              <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-primary" /> Ordonnance CSAF N° 2026/0412-CSAF
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
