"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Scale, ShieldAlert, CheckCircle2, AlertOctagon, FileText, Gavel } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CsafPage() {
  const [parcelleCode, setParcelleCode] = useState("LIT-ALL-005");
  const [demandeur, setDemandeur] = useState("Succession Gbénou");
  const [motif, setMotif] = useState("Revendication de droits successoraux coutumiers et contestation de limite parcellaire");
  const [gelSuccess, setGelSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGel = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setGelSuccess(false);
    const code = parcelleCode.trim().toUpperCase();
    const p = anyigbaRepo.getParcelleByCode(code);
    if (p) {
      p.enLitige = true;
      setGelSuccess(true);
    } else {
      setErrorMsg(`La référence cadastrale "${code}" est introuvable. Impossible d'inscrire le gel conservatoire.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace CSAF */}
        <Card className="border-destructive/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-destructive/20 border border-destructive/40 flex items-center justify-center shrink-0">
                  <Scale className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Cour Spéciale des Affaires Foncières (CSAF)
                    </CardTitle>
                    <Badge variant="destructive" className="text-[10px] uppercase font-bold px-2.5">
                      Juridiction Spécialisée (Loi n° 2022-16)
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Greffe numérique des contentieux fonciers &bull; Enrôlement des assignations, ordonnances de gel conservatoire et publication des jugements
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Magistrat de Chambre</span>
                <strong className="text-foreground">Juge Sossa (Chambre Spéciale du Foncier)</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {gelSuccess && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">
              Ordonnance de gel conservatoire enregistrée au cadastre national pour la parcelle {parcelleCode}.
              Toute transaction, mutation ou aliénation est immédiatement bloquée dans tout le système d&apos;État.
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Formulaire de gel judiciaire (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <Gavel className="w-4 h-4" />
                <span>Ordonnance Judiciaire de Gel Conservatoire</span>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Bloque instantanément toute tentative de cession sur le cadastre national dès signature du magistrat.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0">
              <form onSubmit={handleGel} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Identifiant Unique Foncier (IUF) :</label>
                  <Input
                    type="text"
                    value={parcelleCode}
                    onChange={(e) => setParcelleCode(e.target.value)}
                    required
                    className="font-mono uppercase h-10 text-xs bg-background"
                  />
                  <span className="text-[10px] text-muted-foreground">Exemple : LIT-ALL-005 (Allada)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Partie Demanderesse / Requérant :</label>
                  <Input
                    type="text"
                    value={demandeur}
                    onChange={(e) => setDemandeur(e.target.value)}
                    required
                    className="h-10 text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-semibold">Motif Juridique du Contentieux Foncier :</label>
                  <textarea
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-input text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-destructive"
                  />
                </div>

                <Button
                  type="submit"
                  variant="destructive"
                  className="w-full h-11 font-bold text-xs gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Signer l&apos;Ordonnance &amp; Activer le Gel Conservatoire</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Registre des contentieux en cours (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">Contentieux Actifs Inscrits au Greffe</CardTitle>
                  <Badge variant="destructive" className="text-[10px] font-semibold">
                    1 Instance Pendante
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Registres des assignations et ordonnances d&apos;urgence en vigueur.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="p-4 rounded-xl bg-background/80 border border-destructive/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-foreground text-sm">LIT-ALL-005</span>
                    <Badge variant="destructive" className="text-[10px] gap-1 font-semibold">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Gel Conservatoire Actif</span>
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Commune d&apos;Allada &bull; Arr. Attogon &bull; Succession Gbénou c/ Hounkpatin &bull; Revendication successorale coutumière
                  </p>
                  <div className="text-[11px] text-muted-foreground pt-2 flex items-center gap-1.5 border-t border-border/50">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>Ordonnance de Référé n° 2026/0412-CSAF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground space-y-1.5">
              <span className="font-bold text-foreground block">Effet d&apos;Opposabilité de l&apos;Ordonnance :</span>
              <p className="leading-relaxed text-[11px]">
                En vertu de la Loi n° 2022-16, toute ordonnance de gel rendue par la CSAF suspend de plein droit les droits
                de mutation et emporte blocage immédiat de toute demande de réquisition au cadastre national ANDF.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
