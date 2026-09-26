"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, Bell, Users, HeartHandshake, CheckCircle2 } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

export default function CitoyenPage() {
  const [carnetSuccess, setCarnetSuccess] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-purple-500/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Espace Citoyen &amp; Propriétaire</h1>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/30 uppercase">
                  Germain Dossou
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Consultation de vos titres, alertes de spoliation et carnet de famille foncier pour les successions
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            NPI Citoyen : <strong className="font-mono text-foreground">FICTIF-BEN-2026-0041</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          {/* Parcelles détenues */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
            <h2 className="text-base font-bold text-foreground">Mes Parcelles Répertoriées</h2>

            <div className="p-4 rounded-xl bg-background/80 border border-primary/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground text-sm">OUI-0421</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                  COUTUMIER DÉCLARÉ
                </span>
              </div>
              <p className="text-muted-foreground">
                Ouidah (Pahou • Hounhanmèdji) • Superficie : <strong>1 250 m²</strong>
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] border-t border-border">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Bell className="w-3 h-3 text-secondary" /> Alerte SMS cession active
                </span>
                <span className="text-primary font-semibold">Titre familial vérifié</span>
              </div>
            </div>
          </div>

          {/* Carnet de famille foncier */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>Carnet de Famille Foncier (Anticipation Successorale)</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Consignez de votre vivant l&apos;accord de vos héritiers pour éviter tout conflit ou vente clandestine après
              votre décès.
            </p>

            {carnetSuccess ? (
              <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Carnet de famille actualisé et scellé sur BéninChain avec l&apos;accord des 2 héritiers.</span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                <div className="font-semibold text-foreground">Héritiers Reconnus (Consentement NPI) :</div>
                <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                  <li>• Blaise Dossou (Héritier 1 - Quote-part 50%) — NPI : FICTIF-BEN-2026-0042 [Consentement OK]</li>
                  <li>• Sophie Dossou (Héritier 2 - Quote-part 50%) — NPI : FICTIF-BEN-2026-0043 [Consentement OK]</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setCarnetSuccess(true)}
                  className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Sceller le Carnet Familial Numérique
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
