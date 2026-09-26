"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

export default function BanquePage() {
  const [codeQuery, setCodeQuery] = useState("OUI-0104");
  const [result, setResult] = useState<any>(null);

  const handleVerify = () => {
    if (codeQuery === "OUI-0104") {
      setResult({
        code: "OUI-0104",
        statut: "TITRE_FONCIER_IMMATRICULE",
        proprietaire: "Famille Houessou",
        valeurEstimee: 45000000,
        hypothequesExistantes: 0,
        solvabilite: "EXCELLENTE_GARANTIE_REELLE",
      });
    } else {
      setResult({
        code: codeQuery,
        statut: "COUTUMIER_NON_IMMATRICULE",
        proprietaire: "Propriétaire déclaré",
        valeurEstimee: 12000000,
        hypothequesExistantes: 0,
        solvabilite: "GARANTIE_CONDITIONNELLE_A_TITRER",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-cyan-500/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Portail Bancaire &amp; Établissements de Crédit</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold border border-cyan-500/30 uppercase">
                  Garanties Réelles
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vérification d&apos;authenticité des Titres Fonciers, inscription d&apos;hypothèques et sécurisation des prêts
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            Banque Partenaire : <strong className="text-foreground">Banque Nationale de Développement</strong>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-5 text-xs max-w-2xl mx-auto">
          <h2 className="text-base font-bold text-foreground">Évaluation Immédiate de Garantie Hypothécaire</h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-background border border-border font-mono uppercase"
              placeholder="Ex : OUI-0104"
            />
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Vérifier la Solvabilité</span>
            </button>
          </div>

          {result && (
            <div className="p-4 rounded-xl bg-background/80 border border-cyan-500/30 space-y-3 animate-rise">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-mono font-bold text-sm text-foreground">{result.code}</span>
                <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">
                  {result.statut}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Valeur Cadastrale Estimée :</span>
                  <strong className="text-foreground text-sm font-mono">{formatFcfa(result.valeurEstimee)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Hypothèques Enregistrées :</span>
                  <strong className="text-success text-sm">0 (Rang 1 libre)</strong>
                </div>
              </div>

              <div className="p-2.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Ce titre foncier est éligible pour constitution d&apos;hypothèque notariée de 1er rang.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
