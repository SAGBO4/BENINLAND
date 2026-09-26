"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldAlert, CheckCircle2, AlertOctagon, FileText } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace CSAF */}
        <Card className="border-destructive/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0">
                  <Scale className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      Cour Spéciale des Affaires Foncières (CSAF)
                    </CardTitle>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold">
                      Juridiction Spécialisée
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Gestion des contentieux fonciers, ordonnances de gel conservatoire et publication des jugements.
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                Magistrat : <strong className="text-foreground">Juge Sossa (Chambre Foncière)</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {gelSuccess && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>
              Ordonnance de Gel Conservatoire publiée pour la parcelle {parcelleCode}. Toute transaction et mutation est
              immédiatement bloquée dans tout le système national.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          {/* Formulaire de gel judiciaire */}
          <Card className="border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Ordonner un Gel Conservatoire Immédiat</span>
              </div>
              <CardDescription className="text-xs">
                Bloque toute tentative de cession sur le cadastre national dès signature.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              <form onSubmit={handleGel} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">Code Parcelle Litigieuse :</label>
                  <Input
                    type="text"
                    value={parcelleCode}
                    onChange={(e) => setParcelleCode(e.target.value)}
                    required
                    className="font-mono uppercase h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">Partie Demanderesse / Requérant :</label>
                  <Input
                    type="text"
                    value={demandeur}
                    onChange={(e) => setDemandeur(e.target.value)}
                    required
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground text-xs font-medium">Motif Juridique du Contentieux :</label>
                  <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-background/80 border border-input text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  />
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full h-10 font-bold text-xs"
                >
                  Signer l&apos;Ordonnance &amp; Geler la Parcelle 🔴
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contentieux actifs */}
          <Card className="border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">Contentieux Actifs Référencés</CardTitle>
                <Badge variant="destructive" className="text-[10px]">
                  1 Gel Actif
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Registres des saisines et ordonnances en vigueur.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="p-4 rounded-xl bg-background/80 border border-destructive/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-foreground text-sm">LIT-ALL-005</span>
                  <Badge variant="destructive" className="text-[10px]">
                    GEL ACTIF 🔴
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Allada Attogon • Succession Gbénou c/ Hounkpatin • Revendication de succession coutumière
                </p>
                <div className="text-[10px] text-muted-foreground pt-1 flex items-center gap-1 border-t border-border/50">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Ordonnance CSAF N° 2026/0412-CSAF
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
