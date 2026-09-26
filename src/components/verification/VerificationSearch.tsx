"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, Lock, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { formatFcfa } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
    <div className="w-full space-y-3.5">
      {/* Barre de recherche responsive */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row gap-2"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex : OUI-0421, CAL-0089, LIT-ALL-005..."
            className="pl-10 pr-4 h-12 text-sm font-semibold tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal bg-card/90 border-primary/30"
          />
          <Search className="w-5 h-5 text-primary absolute left-3 top-3.5" />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="h-12 px-6 font-bold shrink-0 text-sm shadow-md shadow-primary/20"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Vérifier en 30s</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Boutons d'exemples rapides (Mobile Friendly) */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-secondary" /> Tester :
        </span>
        <button
          type="button"
          onClick={() => handleChipClick("OUI-0421")}
          className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-[11px] transition cursor-pointer active:scale-95"
        >
          OUI-0421 (Famille Dossou)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("CAL-0089")}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition cursor-pointer active:scale-95"
        >
          CAL-0089 (🔒 Verrouillée)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("LIT-ALL-005")}
          className="px-2.5 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive font-bold text-[11px] transition cursor-pointer active:scale-95"
        >
          LIT-ALL-005 (🔴 Litige CSAF)
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
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/90 shadow-xl space-y-4 animate-rise backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base sm:text-lg font-black text-foreground">{result.codeUnique}</span>
                <span className="text-xs text-muted-foreground">
                  {result.commune} ({result.arrondissement} — {result.village})
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Superficie : <strong className="text-foreground">{formatFcfa(result.superficieM2).replace("FCFA", "")} m²</strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {result.enLitige ? (
                <Badge variant="destructive" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  GEL CONSERVATOIRE CSAF
                </Badge>
              ) : result.enVerrouMutation ? (
                <Badge variant="warning" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <Lock className="w-4 h-4" />
                  VERROU MUTATION ACTIF
                </Badge>
              ) : (
                <Badge variant="success" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  PARCELLE CERTIFIÉE DISPONIBLE
                </Badge>
              )}
            </div>
          </div>

          {/* Grille d'attributs clairs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-background/60 border border-border/70">
              <span className="text-[10px] text-muted-foreground block font-medium">Régime Foncier</span>
              <span className="font-bold text-foreground truncate block">{result.statutJuridique}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/60 border border-border/70">
              <span className="text-[10px] text-muted-foreground block font-medium">Détenteur (APDP)</span>
              <span className="font-bold text-foreground truncate block">{result.proprietaireMasque}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/60 border border-border/70">
              <span className="text-[10px] text-muted-foreground block font-medium">Token BéninChain</span>
              <span className="font-mono text-[10px] text-primary truncate block font-bold">
                {result.tokenBeninChainId || "TKN-PROV-2026"}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/60 border border-border/70">
              <span className="text-[10px] text-muted-foreground block font-medium">Éligibilité Cession</span>
              <span className={`font-bold block ${result.eligibleAchat ? "text-emerald-400" : "text-destructive"}`}>
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
