"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, CheckCircle2, Search, ArrowRight, FileCheck, Coins, Scale } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BanquePage() {
  const [codeQuery, setCodeQuery] = useState("OUI-0104");
  const [result, setResult] = useState<any>({
    code: "OUI-0104",
    statut: "TITRE_FONCIER_IMMATRICULE",
    proprietaire: "Famille Houessou",
    valeurEstimee: 45000000,
    hypothequesExistantes: 0,
    solvabilite: "EXCELLENTE_GARANTIE_REELLE",
  });

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

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Banque */}
        <Card className="border-cyan-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Portail Bancaire &amp; Guichet des Sûretés Réelles
                    </CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold px-2.5">
                      Garanties Hypothécaires
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Vérification d&apos;authenticité des Titres Fonciers, inscription électronique de sûretés et sécurisation du crédit
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Établissement Agréé</span>
                <strong className="text-foreground">Banque Nationale du Bénin &bull; Crédit Immobilier</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Formulaire d'instruction de garantie (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <CardTitle className="text-base font-bold text-foreground">
                Évaluation Immédiate de Disponibilité Hypothécaire
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Vérifiez en temps réel l&apos;immatriculation au Livre Foncier et l&apos;absence d&apos;inscription antérieure de privilège.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  className="font-mono uppercase h-10 text-xs flex-1 bg-background"
                  placeholder="Ex : OUI-0104"
                />
                <Button
                  type="button"
                  onClick={handleVerify}
                  className="h-10 px-5 font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Vérifier la Liberté d&apos;Hypothèque</span>
                </Button>
              </div>

              {result && (
                <div className="p-5 rounded-xl bg-background/90 border border-cyan-500/30 space-y-4 animate-rise">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div>
                      <span className="font-mono font-bold text-base text-foreground">{result.code}</span>
                      <span className="text-xs text-muted-foreground ml-2">Titulaire : {result.proprietaire}</span>
                    </div>
                    <Badge variant={result.statut === "TITRE_FONCIER_IMMATRICULE" ? "success" : "outline"} className="text-[10px] font-semibold">
                      {result.statut === "TITRE_FONCIER_IMMATRICULE" ? "Titre Foncier Immatriculé" : "Certificat Coutumier"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Valeur Cadastrale Homologuée</span>
                      <strong className="text-foreground text-sm font-mono mt-0.5 block">{formatFcfa(result.valeurEstimee)}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Rang d&apos;Hypothèque Disponible</span>
                      <strong className="text-emerald-400 text-sm mt-0.5 block">Rang 1 Disponible (Aucun privilège)</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Ce titre foncier est libre de toute inscription de gage ou d&apos;hypothèque notariée.</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Règles prudentielles et conformité (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Cadre Réglementaire Bancaire</span>
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Garanties Réelles Immobilières (BCEAO)
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  En conformité avec les directives prudentielles de la Commission Bancaire de l&apos;UMOA et l&apos;Acte uniforme OHADA,
                  seuls les titres immatriculés au Livre Foncier (Titre Foncier définitif et CPF) sont admissibles en pondération
                  d&apos;actifs de classe 1.
                </p>

                <div className="p-3 rounded-xl bg-background/80 border border-border space-y-2 text-[11px]">
                  <div className="font-semibold text-foreground">Conditions d&apos;Inscription Immédiate :</div>
                  <ul className="space-y-1">
                    <li>&bull; Attestation de non-recours délivrée par la CSAF</li>
                    <li>&bull; Acte notarié d&apos;affectation hypothécaire scellé</li>
                    <li>&bull; Enregistrement télématique sous 24h à l&apos;ANDF</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
