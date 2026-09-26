"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { anyigbaRepo } from "@/repositories/index";
import { SeedParcelle } from "@/db/seed/data";
import { CadastreInspectorPanel } from "@/components/carte/CadastreInspectorPanel";
import {
  MapPin,
  Filter,
  Layers,
  Search,
  RotateCcw,
  ShieldCheck,
  Lock,
  ShieldAlert,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Chargement dynamique avec désactivation SSR (Leaflet nécessite l'objet window)
const CadastreLeafletCore = dynamic(() => import("./CadastreLeafletCore"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-card/60 text-muted-foreground gap-3">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono">Chargement du moteur cartographique SIG...</span>
    </div>
  ),
});

export function CadastreLeafletMap() {
  const [parcelles] = useState<SeedParcelle[]>(anyigbaRepo.getAllParcelles());
  const [selectedParcelle, setSelectedParcelle] = useState<SeedParcelle | null>(parcelles[0] || null);
  const [communeFilter, setCommuneFilter] = useState<string>("TOUS");
  const [statusFilter, setStatusFilter] = useState<string>("TOUS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tileType, setTileType] = useState<"carto" | "satellite">("carto");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Filtrage multi-critères
  const filteredParcelles = useMemo(() => {
    return parcelles.filter((p) => {
      if (communeFilter !== "TOUS" && p.commune !== communeFilter) return false;
      if (statusFilter === "TF" && p.statutJuridique !== "TITRE_FONCIER") return false;
      if (statusFilter === "CPF" && p.statutJuridique !== "CPF") return false;
      if (statusFilter === "COUTUMIER" && p.statutJuridique !== "COUTUMIER") return false;
      if (statusFilter === "LITIGE" && !p.enLitige) return false;
      if (statusFilter === "VERROU" && !p.enVerrouMutation) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = p.codeUnique.toLowerCase().includes(q);
        const matchesName = p.proprietaireNom.toLowerCase().includes(q);
        const matchesNpi = p.proprietaireNpi.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesNpi) return false;
      }

      return true;
    });
  }, [parcelles, communeFilter, statusFilter, searchQuery]);

  const handleSelectParcelle = (p: SeedParcelle) => {
    setSelectedParcelle(p);
    setIsPanelOpen(true);
  };

  const handleResetFilters = () => {
    setCommuneFilter("TOUS");
    setStatusFilter("TOUS");
    setSearchQuery("");
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background">
      {/* Barre d'outils et filtres SIG souverains */}
      <div className="p-3 sm:px-6 border-b border-border bg-card/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-foreground pr-2 border-r border-border/80">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">Système Cadastral SIG</span>
          </div>

          {/* Filtre Commune */}
          <select
            value={communeFilter}
            onChange={(e) => setCommuneFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="TOUS">Toutes les Communes</option>
            <option value="Ouidah">Ouidah (Atlantique)</option>
            <option value="Abomey-Calavi">Abomey-Calavi (Atlantique)</option>
            <option value="Allada">Allada (Atlantique)</option>
            <option value="Cotonou">Cotonou (Littoral)</option>
            <option value="Kpomassè">Kpomassè (Atlantique)</option>
          </select>

          {/* Filtre Régime Juridique */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="TOUS">Tous les Régimes Juridiques</option>
            <option value="TF">Titre Foncier Immatriculé (TF)</option>
            <option value="CPF">Certificat de Propriété (CPF)</option>
            <option value="COUTUMIER">Droit Coutumier Déclaré</option>
            <option value="VERROU">Mutation en Cours (Sous Verrou)</option>
            <option value="LITIGE">Litige CSAF (Gel Conservatoire)</option>
          </select>

          {/* Recherche rapide */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher code, nom..."
              className="pl-7 pr-3 py-1.5 rounded-lg bg-background border border-border text-xs w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2 top-2" />
          </div>

          {(communeFilter !== "TOUS" || statusFilter !== "TOUS" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 transition cursor-pointer"
              title="Réinitialiser les filtres"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>

        {/* Contrôles droits : Bascule tuiles & Volet */}
        <div className="flex items-center gap-2">
          {/* Bascule Vue Graphique / Satellite */}
          <div className="flex rounded-lg bg-background border border-border p-0.5">
            <button
              type="button"
              onClick={() => setTileType("carto")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                tileType === "carto"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Plan Cadastre
            </button>
            <button
              type="button"
              onClick={() => setTileType("satellite")}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                tileType === "satellite"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Satellite
            </button>
          </div>

          <Badge variant="outline" className="font-mono text-[11px]">
            {filteredParcelles.length} {filteredParcelles.length > 1 ? "parcelles" : "parcelle"}
          </Badge>

          <button
            type="button"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-1.5 rounded-lg bg-background border border-border text-muted-foreground hover:text-foreground transition cursor-pointer"
            title={isPanelOpen ? "Masquer le panneau d'inspection" : "Afficher le panneau d'inspection"}
          >
            {isPanelOpen ? (
              <PanelRightClose className="w-4 h-4 text-primary" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Légende horizontale sobre et républicaine */}
      <div className="px-4 sm:px-6 py-1.5 bg-card/60 border-b border-border/60 flex items-center justify-between text-[11px] text-muted-foreground overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#0A5C36] border border-[#074428] inline-block" />
            <span>Titre Foncier (TF)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#1D4ED8] border border-[#1E40AF] inline-block" />
            <span>Certificat CPF</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#64748B] border border-[#475569] inline-block" />
            <span>Coutumier Déclaré</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#D99B00] border border-[#B47D00] inline-block" />
            <span>Verrou Notarié</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded bg-[#B83214] border border-[#9E2A0E] border-dashed inline-block" />
            <span>Litige CSAF (Gel)</span>
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono hidden lg:inline">
          Projection EPSG:3857 &bull; Référentiel IGN Bénin
        </span>
      </div>

      {/* Espace de travail SIG principal : Canevas Leaflet + Volet d'inspection */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full w-full relative">
          <CadastreLeafletCore
            parcelles={filteredParcelles}
            selectedParcelle={selectedParcelle}
            onSelectParcelle={handleSelectParcelle}
            tileType={tileType}
          />
        </div>

        {/* Volet latéral d'inspection */}
        {isPanelOpen && (
          <CadastreInspectorPanel
            parcelle={selectedParcelle}
            onClose={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
