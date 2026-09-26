"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, Bell, Users, HeartHandshake, CheckCircle2, UserCheck, MapPin, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CitoyenPage() {
  const [carnetSuccess, setCarnetSuccess] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Citoyen */}
        <Card className="border-purple-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Espace Citoyen &amp; Patrimoine Foncier
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2.5">
                      Germain Dossou
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Consultation des parcelles enregistrées au cadastre national, alertes SMS contre la spoliation et carnet de famille foncier
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">NPI Citoyen (ANIP)</span>
                  <strong className="font-mono text-foreground">BEN-***-0041</strong>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Parcelles détenues (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">Mes Parcelles Répertoriées</CardTitle>
                <Badge variant="default" className="text-[10px] font-semibold">
                  1 Terrain Déclaré
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Parcelles foncières rattachées à votre Numéro Personnel d&apos;Identification (NPI) certifié par l&apos;ANIP.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <div className="p-4 rounded-xl bg-background/80 border border-primary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-sm sm:text-base">OUI-0421</span>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    Certificat Coutumier Déclaré
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Commune de Ouidah &bull; Arr. Pahou &bull; Village Hounhanmèdji &bull; Superficie certifiée :{" "}
                  <strong className="text-foreground font-mono">1 250 m²</strong>
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] border-t border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <Bell className="w-3.5 h-3.5 text-secondary" /> Alerte SMS anti-spoliation active
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Titre familial régularisé
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carnet de famille foncier (6 colonnes sur 12) */}
          <Card className="lg:col-span-6 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <HeartHandshake className="w-4 h-4" />
                  <span>Carnet de Famille Foncier</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  Anticipation Successorale
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Consignez de votre vivant l&apos;accord de vos héritiers légitimes pour prévenir tout contentieux successoral devant la CSAF.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              {carnetSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 animate-rise">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Carnet de famille actualisé et scellé au registre national avec l&apos;accord des 2 ayants-droit.</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3.5">
                  <div className="font-semibold text-foreground text-xs">Ayants-droit Reconnus (Consentements ANIP vérifiés) :</div>
                  <ul className="space-y-2 text-[11px] text-muted-foreground">
                    <li className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between">
                      <span>Blaise Dossou (Héritier 1 - Quote-part 50%)</span>
                      <span className="text-emerald-400 font-semibold text-[10px]">Consentement Validé</span>
                    </li>
                    <li className="p-2 rounded-lg bg-card border border-border/60 flex items-center justify-between">
                      <span>Sophie Dossou (Héritière 2 - Quote-part 50%)</span>
                      <span className="text-emerald-400 font-semibold text-[10px]">Consentement Validé</span>
                    </li>
                  </ul>
                  <Button
                    type="button"
                    onClick={() => setCarnetSuccess(true)}
                    className="w-full h-10 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                  >
                    Sceller le Carnet Familial Numérique au Livre Foncier
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
