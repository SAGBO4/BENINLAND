"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle2, FileCheck, Landmark, AlertCircle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AndfPage() {
  const [mutations, setMutations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMutations = async () => {
    try {
      const res = await fetch("/api/v1/mutations");
      const json = await res.json();
      if (json.success) {
        setMutations(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMutations();
  }, []);

  const handleValidate = async (mutationCode: string) => {
    setLoading(true);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/v1/mutations/${encodeURIComponent(mutationCode)}/finaliser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerName: "Mme Reine Houndété (Directrice ANDF)" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Mutation ${mutationCode} validée avec succès par l'ANDF ! Le nouveau titre CPF a été scellé.`);
        fetchMutations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace ANDF */}
        <Card className="border-blue-500/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      Agence Nationale du Domaine et du Foncier (ANDF)
                    </CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold">
                      Visa Régalien
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Direction du Cadastre • Délivrance officielle des Titres Fonciers (TF) et Certificats de Propriété (CPF)
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                Officier en charge : <strong className="text-foreground">Mme Reine Houndété</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tableau des mutations en attente d'instruction et visa */}
        <Card className="border-border shadow-xl">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Mutations Foncières en Attente de Visa d&apos;État</CardTitle>
                <CardDescription className="text-xs">
                  Vérifiez la conformité des pièces notariées et libérez les fonds séquestrés en apposant votre signature.
                </CardDescription>
              </div>
              <Badge variant="default" className="text-xs font-mono font-bold">
                {mutations.filter((m) => m.statut === "INITIEE_VERROUILLEE").length} En Attente
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0 space-y-3">
            {mutations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">Aucune mutation enregistrée.</p>
            ) : (
              mutations.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-background/80 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">{m.codeMutation}</span>
                      <Badge
                        variant={m.statut === "VALIDEE_ANDF" ? "success" : "warning"}
                        className="text-[9px]"
                      >
                        {m.statut === "VALIDEE_ANDF" ? "TITRE DÉLIVRÉ & SCELLÉ" : "VERROU ACTIF • FONDS SÉQUESTRÉS"}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground text-xs">
                      Parcelle : <strong className="text-foreground">{m.parcelleCode}</strong> | Notaire :{" "}
                      <span className="text-foreground">{m.notaireId}</span> | Prix :{" "}
                      <strong className="text-foreground">{formatFcfa(m.prixFcfa)}</strong>
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Cédant : <span className="font-semibold">{m.cedantNom}</span> ➔ Acquéreur :{" "}
                      <span className="font-semibold text-foreground">{m.cessionnaireNom}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {m.statut === "VALIDEE_ANDF" ? (
                      <Badge variant="success" className="py-1.5 px-3 text-xs gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Visa Apposé</span>
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleValidate(m.codeMutation)}
                        disabled={loading}
                        size="sm"
                        className="w-full sm:w-auto font-bold text-xs gap-1.5"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Valider &amp; Délivrer CPF</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
