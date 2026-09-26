"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, CheckCircle2, FileCheck, Landmark, AlertCircle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* En-tête Espace ANDF */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Agence Nationale du Domaine et du Foncier (ANDF)</h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30 uppercase">
                  Visa Régalien
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Direction du Cadastre • Délivrance officielle des Titres Fonciers (TF) et Certificats de Propriété (CPF)
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            Officier en charge : <strong className="text-foreground">Mme Reine Houndété</strong>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tableau des mutations en attente d'instruction et visa */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Mutations Foncières en Attente de Visa d&apos;État</h2>
              <p className="text-xs text-muted-foreground">
                Vérifiez la conformité des pièces notariées et libérez les fonds séquestrés en apposant votre signature.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/30 font-bold">
              {mutations.filter((m) => m.statut === "INITIEE_VERROUILLEE").length} En Attente
            </span>
          </div>

          <div className="space-y-3">
            {mutations.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">Aucune mutation enregistrée.</p>
            ) : (
              mutations.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-background/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-foreground">{m.codeMutation}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          m.statut === "VALIDEE_ANDF"
                            ? "bg-success/20 text-success border border-success/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {m.statut === "VALIDEE_ANDF" ? "TITRE DÉLIVRÉ & SCELLÉ" : "VERROU ACTIF • FONDS SÉQUESTRÉS"}
                      </span>
                    </div>

                    <div className="text-muted-foreground">
                      Parcelle : <strong className="text-foreground">{m.parcelleCode}</strong> | Notaire :{" "}
                      <span className="text-foreground">{m.notaireId}</span> | Prix :{" "}
                      <strong className="text-foreground">{formatFcfa(m.prixFcfa)}</strong>
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Cédant : <span className="font-semibold">{m.cedantNom}</span> ➔ Acquéreur :{" "}
                      <span className="font-semibold text-foreground">{m.cessionnaireNom}</span>
                    </div>
                  </div>

                  <div>
                    {m.statut === "VALIDEE_ANDF" ? (
                      <div className="flex items-center gap-1.5 text-success font-semibold text-xs bg-success/10 px-3 py-1.5 rounded-lg border border-success/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Visa Apposé</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleValidate(m.codeMutation)}
                        disabled={loading}
                        className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Valider &amp; Délivrer CPF</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
