"use client";

import React, { useState } from "react";
import { anyigbaRepo } from "@/repositories/index";
import { SeedParcelle } from "@/db/seed/data";
import { ShieldCheck, Lock, ShieldAlert, MapPin, Layers, Filter, CheckCircle2 } from "lucide-react";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { formatFcfa } from "@/lib/utils";

export function CadastreMap() {
  const [parcelles] = useState<SeedParcelle[]>(anyigbaRepo.getAllParcelles());
  const [selectedParcelle, setSelectedParcelle] = useState<SeedParcelle | null>(parcelles[0]);
  const [communeFilter, setCommuneFilter] = useState<string>("TOUS");
  const [statusFilter, setStatusFilter] = useState<string>("TOUS");

  const filtered = parcelles.filter((p) => {
    if (communeFilter !== "TOUS" && p.commune !== communeFilter) return false;
    if (statusFilter === "TF" && p.statutJuridique !== "TITRE_FONCIER") return false;
    if (statusFilter === "CPF" && p.statutJuridique !== "CPF") return false;
    if (statusFilter === "COUTUMIER" && p.statutJuridique !== "COUTUMIER") return false;
    if (statusFilter === "LITIGE" && !p.enLitige) return false;
    if (statusFilter === "VERROU" && !p.enVerrouMutation) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barre de filtres cadastre */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-bold text-foreground">Filtres du Cadastre :</span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <select
            value={communeFilter}
            onChange={(e) => setCommuneFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold"
          >
            <option value="TOUS">Toutes les Communes</option>
            <option value="Ouidah">Ouidah</option>
            <option value="Abomey-Calavi">Abomey-Calavi</option>
            <option value="Allada">Allada</option>
            <option value="Cotonou">Cotonou</option>
            <option value="Kpomassè">Kpomassè</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold"
          >
            <option value="TOUS">Tous les Régimes</option>
            <option value="TF">🟢 Titre Foncier (TF)</option>
            <option value="CPF">🔵 Certificat Propriété (CPF)</option>
            <option value="COUTUMIER">🟡 Droit Coutumier</option>
            <option value="VERROU">🔒 Mutation Verrouillée</option>
            <option value="LITIGE">🔴 En Litige CSAF</option>
          </select>
        </div>

        <span className="text-muted-foreground font-mono">
          {filtered.length} parcelles affichées
        </span>
      </div>

      {/* Grille principale : Carte vectorielle stylisée à gauche, Fiche détaillée à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CARTE VECTORIELLE CADASTRALE INTERACTIVE (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-card border border-border shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Visualiseur Cadastral PostGIS — Territoire National</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-success" /> TF (Vert)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> CPF (Bleu)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Coutumier (Jaune)
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Litige (Rouge)
              </span>
            </div>
          </div>

          {/* Grille visuelle des parcelles interactives */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {filtered.map((p) => {
              const isSelected = selectedParcelle?.id === p.id;
              let borderClass = "border-primary/40 bg-success/10 hover:border-success";
              let badgeText = "TITRE FONCIER 🟢";
              let badgeClass = "bg-success/20 text-success";

              if (p.enLitige) {
                borderClass = "border-destructive/60 bg-destructive/10 hover:border-destructive";
                badgeText = "EN LITIGE CSAF 🔴";
                badgeClass = "bg-destructive/20 text-destructive";
              } else if (p.enVerrouMutation) {
                borderClass = "border-amber-500/60 bg-amber-500/10 hover:border-amber-500";
                badgeText = "VERROU MUTATION 🔒";
                badgeClass = "bg-amber-500/20 text-amber-400";
              } else if (p.statutJuridique === "COUTUMIER") {
                borderClass = "border-amber-400/40 bg-amber-400/10 hover:border-amber-400";
                badgeText = "COUTUMIER DÉCLARÉ 🟡";
                badgeClass = "bg-amber-400/20 text-amber-300";
              } else if (p.statutJuridique === "CPF") {
                borderClass = "border-blue-500/40 bg-blue-500/10 hover:border-blue-500";
                badgeText = "CERTIFICAT CPF 🔵";
                badgeClass = "bg-blue-500/20 text-blue-400";
              }

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedParcelle(p)}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer space-y-2 ${borderClass} ${
                    isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "opacity-90"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-foreground">{p.codeUnique}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeClass}`}>
                      {badgeText}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>
                      {p.commune} ({p.arrondissement})
                    </div>
                    <div className="font-semibold text-foreground">{formatFcfa(p.superficieM2).replace("FCFA", "")} m²</div>
                  </div>

                  <div className="text-[10px] text-muted-foreground truncate pt-1 border-t border-border/40">
                    Titulaire : <span className="font-semibold text-foreground">{p.proprietaireNom}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* VOLET D'INSPECTION DE LA PARCELLE SÉLECTIONNÉE (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-card border border-border shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" />
            <span>Fiche d&apos;Inspection Cadastrale</span>
          </h3>

          {selectedParcelle ? (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground block">Code Parcelle Unique</span>
                <div className="text-lg font-mono font-black text-foreground">{selectedParcelle.codeUnique}</div>
                <div className="text-xs text-muted-foreground">
                  {selectedParcelle.commune} • Arrondissement {selectedParcelle.arrondissement} • Village {selectedParcelle.village}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-background/60 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Superficie</span>
                  <strong className="text-foreground text-sm font-mono">
                    {formatFcfa(selectedParcelle.superficieM2).replace("FCFA", "")} m²
                  </strong>
                </div>
                <div className="p-2.5 rounded-lg bg-background/60 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Régime Foncier</span>
                  <strong className="text-foreground">{selectedParcelle.statutJuridique}</strong>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground block">Détenteur Légal Enregistré</span>
                <div className="font-bold text-foreground">{selectedParcelle.proprietaireNom}</div>
                <div className="font-mono text-[10px] text-muted-foreground">{selectedParcelle.proprietaireNpi}</div>
              </div>

              <div className="p-3 rounded-lg bg-background/60 border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground block">Token d&apos;Ancrage BéninChain</span>
                <div className="font-mono text-[10px] text-primary truncate font-bold">
                  {selectedParcelle.tokenBeninChainId || "TKN-COUTUMIER-BENIN"}
                </div>
              </div>

              {/* Attestation vocale dans la langue locale de la parcelle */}
              <AudioPhrasePlayer
                phraseKey={
                  selectedParcelle.enLitige
                    ? "parcelle_en_litige"
                    : selectedParcelle.enVerrouMutation
                    ? "parcelle_verrouillee"
                    : "parcelle_titre_foncier_valide"
                }
              />
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">Sélectionnez une parcelle sur la carte.</p>
          )}
        </div>
      </div>
    </div>
  );
}
