"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileSpreadsheet, Lock, ShieldAlert, CheckCircle2, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* En-tête Espace Notaire */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Espace Notarial Sécurisé</h1>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold border border-primary/30 uppercase">
                  Officier Public
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Étude notariale de Me Christian Agbossou • Chambre Nationale des Notaires du Bénin
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            <UserCheck className="w-4 h-4 text-success" />
            <span>NPI Vérifié : <strong className="font-mono">FICTIF-BEN-2026-0088</strong></span>
          </div>
        </div>

        {/* Grille : Formulaire d'acte à gauche, Démonstration Anti-Double-Vente à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FORMULAIRE DE MUTATION (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Lock className="w-4 h-4" />
                <span>Initier une Mutation avec Verrou Anti-Double-Vente</span>
              </div>
              <h2 className="text-lg font-bold text-foreground">Dossier de Cession Immobilière</h2>
              <p className="text-xs text-muted-foreground">
                La validation du dossier pose automatiquement le verrou d&apos;État 🔒 sur la parcelle et notifie le
                propriétaire par SMS.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-xs flex items-start gap-2 animate-rise">
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
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Code Parcelle à céder :</label>
                  <input
                    type="text"
                    value={parcelleCode}
                    onChange={(e) => setParcelleCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border font-mono text-xs uppercase"
                  />
                  <span className="text-[10px] text-muted-foreground">Ex : OUI-0421 (Famille Dossou)</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Prix de Cession Convenu (FCFA) :</label>
                  <input
                    type="number"
                    value={prixFcfa}
                    onChange={(e) => setPrixFcfa(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs font-bold"
                  />
                  <span className="text-[10px] text-muted-foreground">Montant mis sous séquestre</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-background/60 border border-border space-y-2">
                <span className="text-[11px] font-bold text-foreground block">Parties à l&apos;Acte :</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Vendeur Cédant (Légitime) :</span>
                    <strong className="text-foreground">Germain Dossou</strong>
                    <div className="text-[10px] text-muted-foreground font-mono">FICTIF-BEN-2026-0041</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Acheteur Cessionnaire :</span>
                    <input
                      type="text"
                      value={cessionnaireNom}
                      onChange={(e) => setCessionnaireNom(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-card border border-border text-xs mb-1"
                    />
                    <input
                      type="text"
                      value={cessionnaireNpi}
                      onChange={(e) => setCessionnaireNpi(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-card border border-border text-[10px] font-mono"
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Acter la Vente &amp; Poser le Verrou</span>
                </button>
              </div>
            </form>
          </div>

          {/* DÉMONSTRATEUR TEST : TENTATIVE DE DOUBLE VENTE BLOQUÉE (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-4">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Test : Simuler une Double Vente Frauduleuse</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cliquez sur le bouton ci-dessous pour tester ce qui se passe si un second notaire ou acheteur tente de
                vendre la même parcelle pendant qu&apos;elle est sous verrou.
              </p>
              <button
                type="button"
                onClick={() => handleCreateMutation(true)}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs shadow flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>⚠️ Déclencher Seconde Vente Concurrente</span>
              </button>
              <p className="text-[10px] text-muted-foreground italic text-center">
                Vérifie que l&apos;API bloque immédiatement la requête avec l&apos;erreur 409 Conflict.
              </p>
            </div>

            {/* Historique des dossiers en cours */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 text-xs">
              <h3 className="font-bold text-sm text-foreground">Dossiers Notariés en Cours</h3>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {mutationsList.length === 0 ? (
                  <p className="text-muted-foreground italic">Aucun dossier en cours.</p>
                ) : (
                  mutationsList.map((m) => (
                    <div key={m.id} className="p-3 rounded-xl bg-background/80 border border-border space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-foreground">{m.codeMutation}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            m.statut === "VALIDEE_ANDF"
                              ? "bg-success/20 text-success border border-success/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {m.statut === "VALIDEE_ANDF" ? "VALIDÉE ANDF" : "VERROU ACTIF 🔒"}
                        </span>
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
