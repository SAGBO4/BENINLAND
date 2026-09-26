"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Banque */}
        <Card className="border-cyan-500/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">Portail Bancaire &amp; Crédit Foncier</CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold">
                      Garanties Réelles
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Vérification d&apos;authenticité des Titres Fonciers, inscription d&apos;hypothèques et sécurisation des prêts.
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                Banque Partenaire : <strong className="text-foreground">Banque Nationale de Développement</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-border shadow-xl text-xs max-w-2xl mx-auto">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold">Évaluation Immédiate de Garantie Hypothécaire</CardTitle>
            <CardDescription className="text-xs">
              Vérifiez en temps réel l&apos;immatriculation foncière et l&apos;absence d&apos;hypothèque antérieure.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                value={codeQuery}
                onChange={(e) => setCodeQuery(e.target.value)}
                className="font-mono uppercase h-10 text-xs flex-1"
                placeholder="Ex : OUI-0104"
              />
              <Button
                type="button"
                onClick={handleVerify}
                className="h-10 px-4 font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 gap-1.5 shadow-md shadow-cyan-600/20"
              >
                <Search className="w-4 h-4" />
                <span>Vérifier Solvabilité</span>
              </Button>
            </div>

            {result && (
              <div className="p-4 rounded-xl bg-background/80 border border-cyan-500/30 space-y-3 animate-rise">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <span className="font-mono font-bold text-sm text-foreground">{result.code}</span>
                  <Badge variant="success" className="text-[10px]">
                    {result.statut}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Valeur Cadastrale Estimée :</span>
                    <strong className="text-foreground text-sm font-mono">{formatFcfa(result.valeurEstimee)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Hypothèques Enregistrées :</span>
                    <strong className="text-emerald-400 text-sm">0 (Rang 1 libre)</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ce titre foncier est éligible pour constitution d&apos;hypothèque notariée de 1er rang.</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
