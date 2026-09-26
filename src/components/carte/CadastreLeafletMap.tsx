"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { anyigbaRepo } from "@/repositories/index";
import { SeedParcelle } from "@/db/seed/data";
import { CadastreInspectorPanel } from "@/components/carte/CadastreInspectorPanel";
import {
  POLES_BENIN,
  getPoleForCommune,
  getCommunesForPole,
  PoleTerritorial,
} from "@/lib/poles-benin";
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
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Chargement dynamique avec désactivation SSR (Leaflet nécessite l'objet window)
const CadastreLeafletCore = dynamic(() => import("./CadastreLeafletCore"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-card/60 text-muted-foreground gap-3">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono">Chargement du moteur cartographique OpenStreetMap &amp; SIG...</span>
    </div>
  ),
});

export function CadastreLeafletMap() {
  const [parcelles] = useState<SeedParcelle[]>(anyigbaRepo.getAllParcelles());
  const [selectedParcelle, setSelectedParcelle] = useState<SeedParcelle | null>(parcelles[0] || null);
  const [poleFilter, setPoleFilter] = useState<string>("TOUS");
  const [communeFilter, setCommuneFilter] = useState<string>("TOUS");
  const [statusFilter, setStatusFilter] = useState<string>("TOUS");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tileType, setTileType] = useState<"osm" | "satellite" | "carto">("osm");
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);
  const [focusCoords, setFocusCoords] = useState<[number, number] | undefined>(undefined);
  const [focusZoom, setFocusZoom] = useState<number | undefined>(undefined);

  // Communes disponibles selon le pôle sélectionné
  const availableCommunes = useMemo(() => {
    if (poleFilter === "TOUS") {
      const all = Array.from(new Set(parcelles.map((p) => p.commune)));
      return all.sort((a, b) => a.localeCompare(b));
    }
    const pole = POLES_BENIN.find((p) => p.id === poleFilter);
    return pole ? [...pole.communes].sort((a, b) => a.localeCompare(b)) : [];
  }, [poleFilter, parcelles]);

  // Filtrage multi-critères (Pôle, Commune, Statut, Recherche)
  const filteredParcelles = useMemo(() => {
    return parcelles.filter((p) => {
      // Filtre Pôle
      if (poleFilter !== "TOUS") {
        const pole = getPoleForCommune(p.commune);
        if (pole.id !== poleFilter) return false;
      }

      // Filtre Commune
      if (communeFilter !== "TOUS" && p.commune !== communeFilter) return false;

      // Filtre Régime Juridique
      if (statusFilter === "TF" && p.statutJuridique !== "TITRE_FONCIER") return false;
      if (statusFilter === "CPF" && p.statutJuridique !== "CPF") return false;
      if (statusFilter === "COUTUMIER" && p.statutJuridique !== "COUTUMIER") return false;
      if (statusFilter === "LITIGE" && !p.enLitige) return false;
      if (statusFilter === "VERROU" && !p.enVerrouMutation) return false;

      // Recherche textuelle
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = p.codeUnique.toLowerCase().includes(q);
        const matchesName = p.proprietaireNom.toLowerCase().includes(q);
        const matchesNpi = p.proprietaireNpi.toLowerCase().includes(q);
        const matchesCommune = p.commune.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesNpi && !matchesCommune) return false;
      }

      return true;
    });
  }, [parcelles, poleFilter, communeFilter, statusFilter, searchQuery]);

  const handleSelectPole = (poleId: string) => {
    setPoleFilter(poleId);
    setCommuneFilter("TOUS");
    if (poleId === "TOUS") {
      setFocusCoords([7.50, 2.30]);
      setFocusZoom(8);
    } else {
      const pole = POLES_BENIN.find((p) => p.id === poleId);
      if (pole) {
        setFocusCoords(pole.centre);
        setFocusZoom(pole.zoomDefaut);
      }
    }
  };

  const handleSelectParcelle = (p: SeedParcelle) => {
    setSelectedParcelle(p);
    setIsPanelOpen(true);
  };

  const handleResetFilters = () => {
    setPoleFilter("TOUS");
    setCommuneFilter("TOUS");
    setStatusFilter("TOUS");
    setSearchQuery("");
    setFocusCoords([7.50, 2.30]);
    setFocusZoom(8);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background">
      {/* Barre d'outils et filtres SIG souverains */}
      <div className="p-3 sm:px-6 border-b border-border bg-card/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-foreground pr-2 border-r border-border/80">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">SIG Cadastral National</span>
          </div>

          {/* Filtre 06 Pôles Territoriaux */}
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-primary shrink-0 hidden md:inline" />
            <select
              value={poleFilter}
              onChange={(e) => handleSelectPole(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-background border border-primary/40 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Sélectionner un pôle territorial"
            >
              <option value="TOUS">Bénin National (06 Pôles)</option>
              {POLES_BENIN.map((pole) => (
                <option key={pole.id} value={pole.id}>
                  {pole.nom} ({pole.communes.length} communes)
                </option>
              ))}
            </select>
          </div>

          {/* Filtre Commune (cascadé selon le pôle) */}
          <select
            value={communeFilter}
            onChange={(e) => setCommuneFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary max-w-[160px]"
            aria-label="Sélectionner une commune"
          >
            <option value="TOUS">
              {poleFilter === "TOUS" ? "Toutes les Communes" : "Toutes les communes du pôle"}
            </option>
            {availableCommunes.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>

          {/* Filtre Régime Juridique */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary hidden xl:block"
            aria-label="Sélectionner un régime juridique"
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
              placeholder="Rechercher parcelle, nom, pôle..."
              className="pl-7 pr-3 py-1.5 rounded-lg bg-background border border-border text-xs w-36 sm:w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2 top-2" />
          </div>

          {(poleFilter !== "TOUS" || communeFilter !== "TOUS" || statusFilter !== "TOUS" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2 py-1.5 rounded-lg text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 transition cursor-pointer"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>

        {/* Contrôles droits : Bascule tuiles (OSM / Satellite / Plan) & Volet */}
        <div className="flex items-center gap-2">
          {/* Bascule Vue OpenStreetMap / Satellite / Plan */}
          <div className="flex rounded-lg bg-background border border-border p-0.5">
            <button
              type="button"
              onClick={() => setTileType("osm")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                tileType === "osm"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Fond OpenStreetMap officiel"
            >
              <span>OSM</span>
            </button>
            <button
              type="button"
              onClick={() => setTileType("satellite")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                tileType === "satellite"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Orthophotographie Satellite Esri"
            >
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setTileType("carto")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                tileType === "carto"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Plan Foncier Neutre"
            >
              <span>Plan</span>
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

      {/* Barre de navigation rapide des 06 Pôles Territoriaux */}
      <div className="px-3 sm:px-6 py-2 bg-muted/40 border-b border-border/70 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1">
          <Compass className="w-3 h-3 text-secondary" />
          <span>06 Pôles :</span>
        </span>

        <button
          type="button"
          onClick={() => handleSelectPole("TOUS")}
          className={`px-2.5 py-1 rounded-full font-semibold shrink-0 transition text-[11px] cursor-pointer ${
            poleFilter === "TOUS"
              ? "bg-foreground text-background font-bold shadow-sm"
              : "bg-background/80 hover:bg-background border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Tous ({parcelles.length})
        </button>

        {POLES_BENIN.map((pole) => {
          const isSelected = poleFilter === pole.id;
          const poleCount = parcelles.filter((p) => getPoleForCommune(p.commune).id === pole.id).length;
          return (
            <button
              key={pole.id}
              type="button"
              onClick={() => handleSelectPole(isSelected ? "TOUS" : pole.id)}
              className={`px-2.5 py-1 rounded-full font-semibold shrink-0 transition text-[11px] flex items-center gap-1.5 cursor-pointer border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
              title={`${pole.nom} : ${pole.description}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: pole.couleurHex }}
              />
              <span>{pole.nomCourt}</span>
              <span className={`text-[10px] px-1 rounded ${isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {poleCount}
              </span>
            </button>
          );
        })}
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
          Moteur OpenStreetMap &bull; Système EPSG:3857 &bull; IGN Bénin
        </span>
      </div>

      {/* Espace de travail SIG principal : Canevas Leaflet OpenStreetMap + Volet d'inspection */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 h-full w-full relative">
          <CadastreLeafletCore
            parcelles={filteredParcelles}
            selectedParcelle={selectedParcelle}
            onSelectParcelle={handleSelectParcelle}
            tileType={tileType}
            focusCoords={focusCoords}
            focusZoom={focusZoom}
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
