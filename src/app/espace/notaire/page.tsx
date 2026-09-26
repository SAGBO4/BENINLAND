"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileSpreadsheet, Lock, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";
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
          `Mutation ${data.data.codeMutation} initiée avec succès ! La parcelle ${parcelleCode} est maintenant verrouillée 🔒 et les fonds de ${formatFcfa(Number(prixFcfa))} sont séquestrés.`
        );
        fetchMutations();
      } else {
        setErrorMsg(data.error || "Échec de l'opération.");
      }
    } catch (e) {
      setErrorMsg("Erreur réseau ou serveur.");
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Notaire */}
        <Card className="border-primary/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">Espace Notarial Sécurisé</CardTitle>
                    <Badge variant="default" className="text-[10px] uppercase font-bold">
                      Officier Public
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Étude notariale de Me Christian Agbossou • Chambre Nationale des Notaires du Bénin
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>NPI Vérifié : <strong className="font-mono text-foreground">FICTIF-BEN-2026-0088</strong></span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Grille : Formulaire d'acte à gauche, Démonstration Anti-Double-Vente à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FORMULAIRE DE MUTATION (7 cols) */}
          <Card className="lg:col-span-7 border-border shadow-xl">
            <CardHeader className="p-5 pb-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Lock className="w-4 h-4" />
                <span>Initier une Mutation avec Verrou Anti-Double-Vente</span>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold">Dossier de Cession Immobilière</CardTitle>
              <CardDescription className="text-xs">
                La validation du dossier pose automatiquement le verrou d&apos;État 🔒 sur la parcelle et notifie le
                propriétaire par SMS.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-4">
              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-rise">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-start gap-2 animate-rise">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
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
                    <label className="font-semibold text-muted-foreground text-xs">Code Parcelle à céder :</label>
                    <Input
                      type="text"
                      value={parcelleCode}
                      onChange={(e) => setParcelleCode(e.target.value)}
                      required
                      className="font-mono text-xs uppercase h-10"
                    />
                    <span className="text-[10px] text-muted-foreground">Ex : OUI-0421 (Famille Dossou)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground text-xs">Prix de Cession (FCFA) :</label>
                    <Input
                      type="number"
                      value={prixFcfa}
                      onChange={(e) => setPrixFcfa(e.target.value)}
                      required
                      className="text-xs font-bold h-10"
                    />
                    <span className="text-[10px] text-muted-foreground">Montant mis sous séquestre MoMo</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background/60 border border-border/80 space-y-2">
                  <span className="text-[11px] font-bold text-foreground block">Parties à l&apos;Acte :</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Vendeur Cédant (Légitime) :</span>
                      <strong className="text-foreground text-xs">Germain Dossou</strong>
                      <div className="text-[10px] text-muted-foreground font-mono">FICTIF-BEN-2026-0041</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Acheteur Cessionnaire :</span>
                      <Input
                        type="text"
                        value={cessionnaireNom}
                        onChange={(e) => setCessionnaireNom(e.target.value)}
                        className="h-8 text-xs mb-1"
                      />
                      <Input
                        type="text"
                        value={cessionnaireNpi}
                        onChange={(e) => setCessionnaireNpi(e.target.value)}
                        className="h-7 text-[10px] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/30 text-xs space-y-1">
                  <div className="font-bold text-secondary flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Séquestre Financier Mobile Money Activé</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Les fonds resteront bloqués sous séquestre d&apos;État jusqu&apos;à l&apos;approbation définitive par
                    l&apos;ANDF.
                  </p>
                </div>

                <div className="pt-1">
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full font-bold text-xs gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Acter la Vente &amp; Poser le Verrou d&apos;État</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* DÉMONSTRATEUR TEST : TENTATIVE DE DOUBLE VENTE BLOQUÉE (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-destructive/30 bg-destructive/10 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Test : Simuler une Double Vente Frauduleuse</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Cliquez ci-dessous pour tester ce qui se passe si un second notaire ou acheteur tente de
                  vendre la même parcelle pendant qu&apos;elle est sous verrou.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleCreateMutation(true)}
                  disabled={loading}
                  className="w-full h-11 font-bold text-xs gap-1.5"
                >
                  <span>⚠️ Déclencher Seconde Vente Concurrente</span>
                </Button>
                <p className="text-[10px] text-muted-foreground italic text-center">
                  Vérifie que l&apos;API bloque immédiatement la requête avec l&apos;erreur 409 Conflict.
                </p>
              </CardContent>
            </Card>

            {/* Historique des dossiers en cours */}
            <Card className="border-border shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Dossiers Notariés en Cours</CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    {mutationsList.length} dossier(s)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs">
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                  {mutationsList.length === 0 ? (
                    <p className="text-muted-foreground italic">Aucun dossier en cours.</p>
                  ) : (
                    mutationsList.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl bg-background/80 border border-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-foreground">{m.codeMutation}</span>
                          <Badge
                            variant={m.statut === "VALIDEE_ANDF" ? "success" : "warning"}
                            className="text-[9px]"
                          >
                            {m.statut === "VALIDEE_ANDF" ? "VALIDÉE ANDF" : "VERROU ACTIF 🔒"}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Parcelle : <strong className="text-foreground">{m.parcelleCode}</strong> | Prix :{" "}
                          <strong className="text-foreground">{formatFcfa(m.prixFcfa)}</strong>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {m.cedantNom} ➔ {m.cessionnaireNom}
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
