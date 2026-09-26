"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { formatFcfa } from "@/lib/utils";

export function VerificationSearch() {
  const [query, setQuery] = useState("OUI-0421");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (codeToSearch?: string) => {
    const code = (codeToSearch || query).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/v1/verification/${encodeURIComponent(code)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setResult(json.data);
      } else {
        setError(json.error || "Parcelle introuvable au cadastre.");
      }
    } catch (e) {
      setError("Erreur de connexion au service cadastral.");
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (code: string) => {
    setQuery(code);
    handleSearch(code);
  };

  return (
    <div className="w-full space-y-4">
      {/* Barre de recherche */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : OUI-0421, CAL-0089, LIT-ALL-005..."
            className="w-full pl-10 pr-4 py-3 bg-card/90 border border-primary/30 rounded-xl text-sm font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase tracking-wider placeholder:text-muted-foreground placeholder:normal-case shadow-inner transition"
          />
          <Search className="w-5 h-5 text-primary absolute left-3.5 top-3" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Diagnostiquer</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Suggestions de codes démo cliquables */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        <span className="text-[11px] text-muted-foreground font-medium">Exemples à tester :</span>
        <button
          type="button"
          onClick={() => handleChipClick("OUI-0421")}
          className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-[11px] transition cursor-pointer"
        >
          OUI-0421 (Famille Dossou • Coutumier)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("CAL-0089")}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition cursor-pointer"
        >
          CAL-0089 (🔒 Verrouillée en mutation)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("LIT-ALL-005")}
          className="px-2.5 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive font-bold text-[11px] transition cursor-pointer"
        >
          LIT-ALL-005 (🔴 En Litige CSAF)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("OUI-0104")}
          className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-[11px] transition cursor-pointer"
        >
          OUI-0104 (🟢 Titre Foncier ANDF)
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Résultat d'intégrité en direct */}
      {result && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xl space-y-4 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-foreground">{result.codeUnique}</span>
                <span className="text-xs text-muted-foreground">
                  {result.commune} ({result.arrondissement} — {result.village})
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Superficie déclarée : <strong className="text-foreground">{formatFcfa(result.superficieM2).replace("FCFA", "")} m²</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {result.enLitige ? (
                <span className="px-3 py-1 rounded-full bg-destructive/20 border border-destructive/40 text-destructive font-bold text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  GEL CONSERVATOIRE CSAF
                </span>
              ) : result.enVerrouMutation ? (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  VERROU MUTATION ACTIF
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-success/20 border border-success/40 text-success font-bold text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  PARCELLE DISPONIBLE &amp; CERTIFIÉE
                </span>
              )}
            </div>
          </div>

          {/* Grille d'attributs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block">Régime Foncier</span>
              <span className="font-bold text-foreground">{result.statutJuridique}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block">Détenteur (APDP)</span>
              <span className="font-bold text-foreground">{result.proprietaireMasque}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block">Token BéninChain</span>
              <span className="font-mono text-[10px] text-primary truncate block font-bold">
                {result.tokenBeninChainId || "TKN-PROV-2026"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-background/60 border border-border">
              <span className="text-[10px] text-muted-foreground block">Éligibilité Cession</span>
              <span className={`font-bold ${result.eligibleAchat ? "text-success" : "text-destructive"}`}>
                {result.eligibleAchat ? "✅ Achetable" : "❌ Achat Bloqué"}
              </span>
            </div>
          </div>

          {/* Attestation vocale multilingue */}
          <AudioPhrasePlayer
            phraseKey={
              result.enLitige
                ? "parcelle_en_litige"
                : result.enVerrouMutation
                ? "parcelle_verrouillee"
                : "parcelle_titre_foncier_valide"
            }
          />
        </div>
      )}
    </div>
  );
}
