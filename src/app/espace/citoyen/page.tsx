"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, Bell, Users, HeartHandshake, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShinyText } from "@/components/reactbits/ShinyText";

export default function CitoyenPage() {
  const [carnetSuccess, setCarnetSuccess] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Citoyen */}
        <Card className="border-purple-500/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">Espace Citoyen &amp; Propriétaire</CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      Germain Dossou
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Consultation de vos titres, alertes de spoliation et carnet de famille foncier pour les successions.
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>NPI Citoyen : <strong className="font-mono text-foreground">FICTIF-BEN-2026-0041</strong></span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* Parcelles détenues */}
          <Card className="lg:col-span-6 border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">Mes Parcelles Répertoriées</CardTitle>
                <Badge variant="default" className="text-[10px]">
                  1 Terrain Déclaré
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Parcelles rattachées à votre Numéro Personnel d&apos;Identification (NPI).
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="p-4 rounded-xl bg-background/80 border border-primary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-sm sm:text-base">OUI-0421</span>
                  <Badge variant="default" className="text-[10px]">
                    COUTUMIER DÉCLARÉ
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Ouidah (Pahou • Hounhanmèdji) • Superficie certifiée : <strong className="text-foreground">1 250 m²</strong>
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5 text-secondary" /> Alerte SMS cession active
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Titre familial vérifié
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carnet de famille foncier */}
          <Card className="lg:col-span-6 border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Carnet de Famille Foncier</span>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Anticipation Successorale
                </Badge>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Consignez de votre vivant l&apos;accord de vos héritiers pour éviter tout conflit ou vente clandestine après
                votre décès.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              {carnetSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 animate-rise">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Carnet de famille actualisé et scellé sur BéninChain avec l&apos;accord des 2 héritiers.</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-background/80 border border-border/80 space-y-3">
                  <div className="font-semibold text-foreground text-xs">Héritiers Reconnus (Consentement NPI) :</div>
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                    <li>• Blaise Dossou (Héritier 1 - Quote-part 50%) — NPI : FICTIF-BEN-2026-0042 [Consentement OK]</li>
                    <li>• Sophie Dossou (Héritier 2 - Quote-part 50%) — NPI : FICTIF-BEN-2026-0043 [Consentement OK]</li>
                  </ul>
                  <Button
                    type="button"
                    onClick={() => setCarnetSuccess(true)}
                    className="w-full h-10 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20"
                  >
                    Sceller le Carnet Familial Numérique
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
