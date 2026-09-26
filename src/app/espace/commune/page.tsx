"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Building2, Calculator, Coins, TrendingUp, CheckCircle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

export default function CommunePage() {
  const [prixAchat, setPrixAchat] = useState(2000000);
  const [prixVente, setPrixVente] = useState(4500000);
  const [travaux, setTravaux] = useState(500000);
  const tauxCommunal = 0.05; // 5% de taxe de plus-value communale

  const plusValueBrute = Math.max(0, prixVente - prixAchat - travaux);
  const taxeCalculee = Math.round(plusValueBrute * tauxCommunal);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-emerald-500/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Mairie &amp; Direction de l&apos;Urbanisme</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 uppercase">
                  Commune de Ouidah
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Cadastre communal, fiscalité foncière locale et perception de la taxe sur la plus-value immobilière
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            Recettes Foncières Collectées : <strong className="text-secondary font-mono">14 250 000 FCFA</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          {/* Calculateur de plus-value communale */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-5">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Calculator className="w-4 h-4" />
              <span>Simulateur Fiscal de Taxe sur la Plus-Value (Code des Impôts)</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-muted-foreground">Prix d&apos;Acquisition Initial (FCFA) :</label>
                <input
                  type="number"
                  value={prixAchat}
                  onChange={(e) => setPrixAchat(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Prix de Cession Actuel (FCFA) :</label>
                <input
                  type="number"
                  value={prixVente}
                  onChange={(e) => setPrixVente(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-muted-foreground">Frais de Travaux et Aménagements Justifiés (FCFA) :</label>
                <input
                  type="number"
                  value={travaux}
                  onChange={(e) => setTravaux(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/80 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plus-Value Nette Réalisée :</span>
                <strong className="text-foreground text-sm font-mono">{formatFcfa(plusValueBrute)}</strong>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-bold text-primary">Taxe Communale Due (5%) :</span>
                <strong className="text-secondary text-base font-bold font-mono">{formatFcfa(taxeCalculee)}</strong>
              </div>
            </div>
          </div>

          {/* Bâtis et zonage d'urbanisme */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-foreground">Inventaire des Bâtis et Recouvrements</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">OUI-0104 (Fort Français)</span>
                  <span className="text-[10px] text-success font-bold">À JOUR</span>
                </div>
                <p className="text-muted-foreground">Immeuble commercial R+1 • Emprise : 480 m² • Valeur : 45 000 000 FCFA</p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">OUI-0421 (Pahou)</span>
                  <span className="text-[10px] text-amber-400 font-bold">MUTATION EN COURS</span>
                </div>
                <p className="text-muted-foreground">Parcelle nue • Emprise : 0 m² • Taxe de plus-value en attente de retenue</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
