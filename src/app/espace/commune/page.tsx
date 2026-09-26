"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Building2, Calculator, Coins, TrendingUp, CheckCircle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CommunePage() {
  const [prixAchat, setPrixAchat] = useState(2000000);
  const [prixVente, setPrixVente] = useState(4500000);
  const [travaux, setTravaux] = useState(500000);
  const tauxCommunal = 0.05; // 5% de taxe de plus-value communale

  const plusValueBrute = Math.max(0, prixVente - prixAchat - travaux);
  const taxeCalculee = Math.round(plusValueBrute * tauxCommunal);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Commune */}
        <Card className="border-emerald-500/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">Mairie &amp; Direction de l&apos;Urbanisme</CardTitle>
                    <Badge variant="success" className="text-[10px] uppercase font-bold">
                      Commune de Ouidah
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Cadastre communal, fiscalité foncière locale et perception de la taxe sur la plus-value immobilière.
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                Recettes Collectées : <strong className="text-secondary font-mono">14 250 000 FCFA</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Calculateur de plus-value communale */}
          <Card className="lg:col-span-6 border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Calculator className="w-4 h-4" />
                <span>Simulateur Fiscal de Taxe sur la Plus-Value</span>
              </div>
              <CardDescription className="text-xs">
                Calcul conforme au Code Général des Impôts de la République du Bénin.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground text-xs font-medium">Prix d&apos;Acquisition Initial (FCFA) :</label>
                  <Input
                    type="number"
                    value={prixAchat}
                    onChange={(e) => setPrixAchat(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground text-xs font-medium">Prix de Cession Actuel (FCFA) :</label>
                  <Input
                    type="number"
                    value={prixVente}
                    onChange={(e) => setPrixVente(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-muted-foreground text-xs font-medium">Frais de Travaux et Aménagements Justifiés (FCFA) :</label>
                  <Input
                    type="number"
                    value={travaux}
                    onChange={(e) => setTravaux(Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/80 border border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plus-Value Nette Réalisée :</span>
                  <strong className="text-foreground text-sm font-mono">{formatFcfa(plusValueBrute)}</strong>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/80">
                  <span className="font-bold text-primary">Taxe Communale Due (5%) :</span>
                  <strong className="text-secondary text-base font-bold font-mono">{formatFcfa(taxeCalculee)}</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bâtis et zonage d'urbanisme */}
          <Card className="lg:col-span-6 border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold">Inventaire des Bâtis et Recouvrements</CardTitle>
              <CardDescription className="text-xs">
                Suivi fiscal et conformité d&apos;urbanisme sur le périmètre de Ouidah.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">OUI-0104 (Fort Français)</span>
                  <Badge variant="success" className="text-[10px]">
                    À JOUR
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Immeuble commercial R+1 • Emprise : 480 m² • Valeur cadastrale : 45 000 000 FCFA
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground">OUI-0421 (Pahou)</span>
                  <Badge variant="warning" className="text-[10px]">
                    MUTATION EN COURS
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Parcelle nue • Emprise : 0 m² • Retenue de taxe de plus-value programmée
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
