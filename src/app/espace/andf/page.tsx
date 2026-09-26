"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle2, FileCheck, Landmark, AlertCircle, Lock, ArrowRight, Stamp } from "lucide-react";
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
        setSuccessMsg(
          `Mutation ${mutationCode} instruite et validée par l'ANDF. Le Certificat de Propriété Foncière (CPF) est scellé au Livre Foncier et les fonds sous séquestre sont débloqués.`
        );
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

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace ANDF */}
        <Card className="border-blue-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Agence Nationale du Domaine et du Foncier (ANDF)
                    </CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold px-2.5">
                      Conservation Foncière
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Direction du Cadastre &bull; Instruction républicaine, tenue du Livre Foncier et délivrance des Titres Fonciers (TF) et CPF
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Conservateur Général</span>
                <strong className="text-foreground">Mme Reine Houndété (Directrice ANDF)</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Tableau spacieux des mutations en attente d'instruction et visa */}
        <Card className="border-border shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  File d&apos;Instruction Cadastrale &amp; Visa Républicain
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Contrôle de conformité des actes notariés, levée du verrou conservatoire et émission du titre officiel scellé.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-bold">
                {mutations.filter((m) => m.statut === "INITIEE_VERROUILLEE").length} dossier(s) en attente
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
            {mutations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-10 text-center">Aucune mutation enregistrée dans le registre.</p>
            ) : (
              mutations.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-xl bg-background/80 border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition hover:border-primary/40"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-foreground">{m.codeMutation}</span>
                      <Badge
                        variant={m.statut === "VALIDEE_ANDF" ? "success" : "warning"}
                        className="text-[10px] gap-1 font-semibold"
                      >
                        {m.statut === "VALIDEE_ANDF" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Titre Délivré &amp; Scellé au Livre Foncier</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>Verrou Posé &bull; Fonds Consignés sous Séquestre</span>
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground text-xs leading-relaxed">
                      Parcelle (IUF) : <strong className="text-foreground font-mono">{m.parcelleCode}</strong> &bull; Étude Notariale :{" "}
                      <span className="text-foreground font-semibold">{m.notaireId}</span> &bull; Prix de cession :{" "}
                      <strong className="text-foreground font-mono">{formatFcfa(m.prixFcfa)}</strong>
                    </div>

                    <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/40">
                      <span>Cédant : <strong className="text-foreground">{m.cedantNom}</strong></span>
                      <span>&rarr;</span>
                      <span>Acquéreur : <strong className="text-foreground">{m.cessionnaireNom}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    {m.statut === "VALIDEE_ANDF" ? (
                      <div className="px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Sceau d&apos;État Apposé</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleValidate(m.codeMutation)}
                        disabled={loading}
                        size="sm"
                        className="w-full md:w-auto font-bold text-xs gap-1.5 cursor-pointer h-10 px-4"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Valider &amp; Délivrer CPF Scellé</span>
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
