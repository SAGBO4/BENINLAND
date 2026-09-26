"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Building2, Calculator, Coins, TrendingUp, CheckCircle2, MapPin, Landmark } from "lucide-react";
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
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Commune */}
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
                      Mairie &amp; Direction des Affaires Domaniales et Environnementales
                    </CardTitle>
                    <Badge variant="success" className="text-[10px] uppercase font-bold px-2.5">
                      Commune de Ouidah
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Cadastre communal, fiscalité foncière locale et perception de la taxe sur la plus-value immobilière
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Recettes Communales Collectées</span>
                <strong className="text-secondary font-mono text-sm">14 250 000 FCFA</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Calculateur de plus-value communale (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Calculator className="w-4 h-4" />
                <span>Simulateur Fiscal de Taxe Communale sur la Plus-Value</span>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Calcul conforme au Code Général des Impôts et aux délibérations du Conseil Communal de Ouidah.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Prix d&apos;Acquisition Initial (FCFA) :</label>
                  <Input
                    type="number"
                    value={prixAchat}
                    onChange={(e) => setPrixAchat(Number(e.target.value))}
                    className="h-10 text-xs font-mono bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Prix de Cession Actuel (FCFA) :</label>
                  <Input
                    type="number"
                    value={prixVente}
                    onChange={(e) => setPrixVente(Number(e.target.value))}
                    className="h-10 text-xs font-mono bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Travaux et Aménagements Justifiés (FCFA) :</label>
                  <Input
                    type="number"
                    value={travaux}
                    onChange={(e) => setTravaux(Number(e.target.value))}
                    className="h-10 text-xs font-mono bg-background"
                  />
                </div>
              </div>

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

          {/* Registre des parcelles et conformité communale (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">
                  Inventaire Foncier &amp; Bâtis Communaux
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Arr. Pahou &bull; Ouidah I
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Suivi fiscal et conformité aux règles d&apos;urbanisme sur le territoire de Ouidah.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-3.5">
              <div className="p-4 rounded-xl bg-background/80 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-sm">OUI-0104 (Fort Français)</span>
                  <Badge variant="success" className="text-[10px] font-semibold">
                    Situation Fiscale Conforme
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Immeuble commercial R+1 &bull; Emprise au sol : 480 m² &bull; Valeur cadastrale certifiée : 45 000 000 FCFA
                </p>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1 border-t border-border/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quittance annuelle de taxe foncière délivrée</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/80 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-sm">OUI-0421 (Pahou)</span>
                  <Badge variant="warning" className="text-[10px] font-semibold">
                    Mutation en Instance Notariale
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Terrain à bâtir non aménagé &bull; Superficie : 1 250 m² &bull; Retenue communale sur plus-value programmée
                </p>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1 border-t border-border/50">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Village Hounhanmèdji &bull; Attestation de recasement communale n° 2018-09</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
