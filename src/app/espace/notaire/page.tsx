"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileSpreadsheet, Lock, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, AlertTriangle, Coins } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotairePage() {
  const [parcelleCode, setParcelleCode] = useState("OUI-0421");
  const [prixFcfa, setPrixFcfa] = useState("4500000");
  const [cessionnaireNom, setCessionnaireNom] = useState("Koffi Mensah");
  const [cessionnaireNpi, setCessionnaireNpi] = useState("FICTIF-BEN-2026-0003");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mutationsList, setMutationsList] = useState<any[]>([]);

  const handleCreateMutation = async (isFraudAttempt = false) => {
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: parcelleCode.trim().toUpperCase(),
          cedantNpi: "FICTIF-BEN-2026-0041",
          cedantNom: "Germain Dossou",
          cessionnaireNpi: isFraudAttempt ? "FICTIF-BEN-2026-9999" : cessionnaireNpi,
          cessionnaireNom: isFraudAttempt ? "Acheteur Frauduleux Rejeté" : cessionnaireNom,
          notaireId: "Me Christian Agbossou (Étude Ouidah)",
          prixFcfa: Number(prixFcfa),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(
          `Mutation ${data.data.codeMutation} initiée avec succès. La parcelle ${parcelleCode} est placée sous verrou d'opposabilité immédiate et la consignation de ${formatFcfa(Number(prixFcfa))} est enregistrée.`
        );
        fetchMutations();
      } else {
        setErrorMsg(data.error || "Échec de l'enregistrement de la mutation.");
      }
    } catch (e) {
      setErrorMsg("Erreur réseau ou serveur lors de la transmission au cadastre.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMutations = async () => {
    try {
      const res = await fetch("/api/v1/mutations");
      const data = await res.json();
      if (data.success) {
        setMutationsList(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchMutations();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Notaire */}
        <Card className="border-primary/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Office Notarial &amp; Console de Mutation
                    </CardTitle>
                    <Badge variant="default" className="text-[10px] uppercase font-bold px-2.5">
                      Officier Ministériel Assermenté
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Étude notariale de Me Christian Agbossou &bull; Chambre Nationale des Notaires du Bénin (Ouidah)
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">NPI Notarial Vérifié</span>
                  <strong className="font-mono text-foreground">BEN-NOT-2026-0088</strong>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grille : Instrumentation à gauche, Sécurisation & Historique à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLONNE D'INSTRUMENTATION (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Lock className="w-4 h-4" />
                <span>Instrumentation &amp; Verrou d&apos;Opposabilité Immédiat</span>
              </div>
              <CardTitle className="text-lg font-bold text-foreground">Dossier de Mutation Immobilière</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                L&apos;enregistrement du dossier pose automatiquement le verrou d&apos;opposabilité immédiat sur la parcelle
                et notifie le propriétaire par SMS officiel.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-rise">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-rise">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateMutation(false);
                }}
                className="space-y-4 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground text-xs">Code Parcelle (IUF) :</label>
                    <Input
                      type="text"
                      value={parcelleCode}
                      onChange={(e) => setParcelleCode(e.target.value)}
                      required
                      className="font-mono text-xs uppercase h-10 bg-background"
                    />
                    <span className="text-[10px] text-muted-foreground">Exemple : OUI-0421 (Famille Dossou)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-foreground text-xs">Prix de Cession (FCFA) :</label>
                    <Input
                      type="number"
                      value={prixFcfa}
                      onChange={(e) => setPrixFcfa(e.target.value)}
                      required
                      className="text-xs font-bold h-10 bg-background"
                    />
                    <span className="text-[10px] text-muted-foreground">Montant consigné sous séquestre réglementaire</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <span className="text-[11px] font-bold text-foreground block uppercase tracking-wider">
                    Parties à l&apos;Acte de Mutation :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-card border border-border space-y-1">
                      <span className="text-[10px] text-muted-foreground block font-medium">Vendeur Cédant (Légitime) :</span>
                      <strong className="text-foreground text-xs block">Germain Dossou</strong>
                      <div className="text-[10px] text-muted-foreground font-mono">NPI : BEN-***-0041</div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground block font-medium">Acheteur Cessionnaire :</span>
                      <Input
                        type="text"
                        value={cessionnaireNom}
                        onChange={(e) => setCessionnaireNom(e.target.value)}
                        placeholder="Nom complet"
                        className="h-8 text-xs bg-background"
                      />
                      <Input
                        type="text"
                        value={cessionnaireNpi}
                        onChange={(e) => setCessionnaireNpi(e.target.value)}
                        placeholder="NPI Cessionnaire"
                        className="h-8 text-[11px] font-mono bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 text-xs space-y-1.5">
                  <div className="font-bold text-secondary flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>Consignation Préalable sous Séquestre Financier (DGTCP / TrésorPay)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Les fonds versés restent consignés sur le Compte Unique du Trésor jusqu&apos;à l&apos;approbation définitive
                    et l&apos;inscription de la mutation au Livre Foncier par l&apos;ANDF.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full font-bold text-xs gap-2 cursor-pointer h-11"
                >
                  <Lock className="w-4 h-4" />
                  <span>Acter la Cession &amp; Poser le Verrou d&apos;Opposabilité</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* COLONNE DE SÉCURISATION & AUDIT (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Démonstrateur Anti-Double-Vente */}
            <Card className="border-destructive/30 bg-destructive/5 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Épreuve Anti-Double-Vente (Test de Blocage)</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Simulez une tentative d&apos;ouverture concurrente par un autre acheteur pendant que la parcelle est sous verrou.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleCreateMutation(true)}
                  disabled={loading}
                  className="w-full h-11 font-bold text-xs gap-2 cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Déclencher Tentative de Vente Concurrente</span>
                </Button>
                <p className="text-[10px] text-muted-foreground italic text-center">
                  Vérifie le rejet immédiat avec le statut légal 409 Conflict et l&apos;inviolabilité du verrou.
                </p>
              </CardContent>
            </Card>

            {/* Registre des mutations en cours */}
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground">Dossiers Notariés en Instance</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {mutationsList.length} dossier(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs">
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {mutationsList.length === 0 ? (
                    <p className="text-muted-foreground italic text-center py-6">Aucun dossier en cours.</p>
                  ) : (
                    mutationsList.map((m) => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-background/80 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-foreground">{m.codeMutation}</span>
                          <Badge
                            variant={m.statut === "VALIDEE_ANDF" ? "success" : "warning"}
                            className="text-[10px] gap-1 font-semibold"
                          >
                            {m.statut === "VALIDEE_ANDF" ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Validé ANDF</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Verrou Notarié Actif</span>
                              </>
                            )}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Parcelle : <strong className="text-foreground font-mono">{m.parcelleCode}</strong> &bull; Prix :{" "}
                          <strong className="text-foreground">{formatFcfa(m.prixFcfa)}</strong>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate pt-1 border-t border-border/40">
                          {m.cedantNom} &rarr; {m.cessionnaireNom}
                        </div>
                      </div>
                    ))
                  )}
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
