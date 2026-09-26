"use client";

import React, { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, Lock, AlertTriangle, ArrowRight, CheckCircle2, FileSearch } from "lucide-react";
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
        setError(json.error || "Parcelle introuvable au registre cadastral.");
      }
    } catch (e) {
      setError("Erreur de liaison avec le serveur du cadastre national.");
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
      {/* Barre de recherche officielle */}
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
            placeholder="Saisir IUF : OUI-0421, CAL-0089, LIT-ALL-005..."
            className="pl-10 pr-4 h-12 text-sm font-semibold tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal bg-card border-border"
          />
          <Search className="w-5 h-5 text-primary absolute left-3 top-3.5" />
        </div>
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="h-12 px-6 font-bold shrink-0 text-sm shadow-md cursor-pointer"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FileSearch className="w-4 h-4" />
              <span>Consulter le Registre Cadastral</span>
            </>
          )}
        </Button>
      </form>

      {/* Raccourcis de consultation déterministes */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] text-muted-foreground font-semibold">
          Parcelles témoins :
        </span>
        <button
          type="button"
          onClick={() => handleChipClick("OUI-0421")}
          className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-bold text-[11px] transition cursor-pointer"
        >
          OUI-0421 (Pahou — Famille Dossou)
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("CAL-0089")}
          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <Lock className="w-3 h-3" />
          <span>CAL-0089 (Verrou Notarié)</span>
        </button>
        <button
          type="button"
          onClick={() => handleChipClick("LIT-ALL-005")}
          className="px-2.5 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>LIT-ALL-005 (Litige CSAF)</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Fiche officielle de résultat de vérification */}
      {result && (
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 animate-rise">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-foreground">{result.codeUnique}</span>
                <span className="text-xs text-muted-foreground">
                  Commune de {result.commune} &bull; Arr. {result.arrondissement} ({result.village})
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Superficie légale : <strong className="text-foreground font-mono">{formatFcfa(result.superficieM2).replace("FCFA", "")} m²</strong> (calcul Shoelace certifié)
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
                  VERROU NOTARIAL ACTIF
                </Badge>
              ) : (
                <Badge variant="success" className="py-1 px-3 text-xs gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  PARCELLE DISPONIBLE À LA MUTATION
                </Badge>
              )}
            </div>
          </div>

          {/* Grille des caractéristiques juridiques */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Régime Foncier</span>
              <span className="font-bold text-foreground truncate block mt-0.5">
                {result.statutJuridique === "TITRE_FONCIER"
                  ? "Titre Foncier (TF)"
                  : result.statutJuridique === "CPF"
                  ? "Certificat (CPF)"
                  : "Droit Coutumier"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Titulaire (Données ANIP)</span>
              <span className="font-bold text-foreground truncate block mt-0.5">{result.proprietaireMasque}</span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Empreinte BéninChain</span>
              <span className="font-mono text-[10px] text-primary truncate block font-bold mt-0.5">
                {result.tokenBeninChainId || "TKN-PROV-2026"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-background/80 border border-border">
              <span className="text-[10px] text-muted-foreground block font-medium">Éligibilité Transactionnelle</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {result.eligibleAchat ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="font-bold text-success">Éligible à la vente</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="font-bold text-destructive">Cession bloquée</span>
                  </>
                )}
              </div>
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
