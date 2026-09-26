"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { SeedParcelle } from "@/db/seed/data";
import { formatFcfa } from "@/lib/utils";

export interface ParcelleStyleRule {
  fillColor: string;
  fillOpacity: number;
  color: string;
  weight: number;
  dashArray?: string;
}

export function getParcelleStyle(parcelle: SeedParcelle, isSelected: boolean): ParcelleStyleRule {
  if (parcelle.enLitige) {
    return {
      fillColor: "#B83214", // Rouge Terre Cuite CSAF
      fillOpacity: isSelected ? 0.70 : 0.38,
      color: "#9E2A0E",
      weight: isSelected ? 3.5 : 1.8,
      dashArray: "4, 4",
    };
  }
  if (parcelle.enVerrouMutation) {
    return {
      fillColor: "#D99B00", // Or Ambré Notarial
      fillOpacity: isSelected ? 0.70 : 0.42,
      color: "#B47D00",
      weight: isSelected ? 3.5 : 1.8,
    };
  }
  if (parcelle.statutJuridique === "TITRE_FONCIER") {
    return {
      fillColor: "#0A5C36", // Vert Forêt Foncier ANDF
      fillOpacity: isSelected ? 0.65 : 0.32,
      color: "#074428",
      weight: isSelected ? 3 : 1.5,
    };
  }
  if (parcelle.statutJuridique === "CPF") {
    return {
      fillColor: "#1D4ED8", // Bleu Institutionnel CPF
      fillOpacity: isSelected ? 0.65 : 0.32,
      color: "#1E40AF",
      weight: isSelected ? 3 : 1.5,
    };
  }
  return {
    fillColor: "#64748B", // Ardoise coutumier
    fillOpacity: isSelected ? 0.55 : 0.28,
    color: "#475569",
    weight: isSelected ? 2.5 : 1.2,
  };
}

interface CadastreLeafletCoreProps {
  parcelles: SeedParcelle[];
  selectedParcelle: SeedParcelle | null;
  onSelectParcelle: (parcelle: SeedParcelle) => void;
  tileType: "carto" | "satellite";
}

export default function CadastreLeafletCore({
  parcelles,
  selectedParcelle,
  onSelectParcelle,
  tileType,
}: CadastreLeafletCoreProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayersRef = useRef<Map<number, L.Polygon>>(new Map());

  // Initialisation du canevas cartographique Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Définition de l'instance Leaflet
    const map = L.map(mapContainerRef.current, {
      center: [6.40, 2.22],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Gestion du fond de carte (Tuiles Carto Positron ou Satellite Esri)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let url = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    let attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap';

    if (tileType === "satellite") {
      url = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = "&copy; Esri &mdash; Orthophotographie Satellite Souveraine";
    }

    const newLayer = L.tileLayer(url, {
      maxZoom: 19,
      attribution,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [tileType]);

  // Rendu géométrique vectoriel des parcelles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Nettoyage des anciennes couches vectorielles
    polygonLayersRef.current.forEach((layer) => {
      map.removeLayer(layer);
    });
    polygonLayersRef.current.clear();

    const bounds = L.latLngBounds([]);

    parcelles.forEach((parcelle) => {
      // Conversion GeoJSON [lng, lat] -> Leaflet [lat, lng]
      const rawCoords = parcelle.polygoneGeojson.coordinates[0];
      const latLngs: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

      const isSelected = selectedParcelle?.id === parcelle.id;
      const style = getParcelleStyle(parcelle, isSelected);

      const polygon = L.polygon(latLngs, {
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        color: style.color,
        weight: style.weight,
        dashArray: style.dashArray,
      }).addTo(map);

      // Infobulle permanente d'identification cadastrale
      const tooltipContent = `
        <div style="font-family: inherit; font-size: 11px; padding: 2px 4px;">
          <div style="font-weight: 800; font-family: monospace;">${parcelle.codeUnique}</div>
          <div style="color: #64748b; font-size: 10px;">${parcelle.commune} &bull; ${formatFcfa(parcelle.superficieM2).replace("FCFA", "")} m²</div>
        </div>
      `;

      polygon.bindTooltip(tooltipContent, {
        permanent: true,
        direction: "center",
        className: "cadastre-polygon-tooltip",
      });

      // Événements interactifs
      polygon.on("mouseover", () => {
        polygon.setStyle({
          weight: style.weight + 1.5,
          fillOpacity: Math.min(1, style.fillOpacity + 0.15),
        });
      });

      polygon.on("mouseout", () => {
        const curSelected = selectedParcelle?.id === parcelle.id;
        const baseStyle = getParcelleStyle(parcelle, curSelected);
        polygon.setStyle({
          weight: baseStyle.weight,
          fillOpacity: baseStyle.fillOpacity,
        });
      });

      polygon.on("click", () => {
        onSelectParcelle(parcelle);
        map.fitBounds(polygon.getBounds(), {
          maxZoom: 16,
          padding: [50, 50],
          animate: true,
        });
      });

      polygonLayersRef.current.set(parcelle.id, polygon);
      latLngs.forEach((coord) => bounds.extend(coord));
    });

    // Ajustement de la vue si des parcelles existent
    if (parcelles.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [parcelles, onSelectParcelle]);

  // Actualisation des styles quand la parcelle sélectionnée change
  useEffect(() => {
    polygonLayersRef.current.forEach((polygon, id) => {
      const p = parcelles.find((item) => item.id === id);
      if (!p) return;
      const isSelected = selectedParcelle?.id === id;
      const style = getParcelleStyle(p, isSelected);
      polygon.setStyle({
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        color: style.color,
        weight: style.weight,
        dashArray: style.dashArray,
      });
    });
  }, [selectedParcelle, parcelles]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <style jsx global>{`
        .cadastre-polygon-tooltip {
          background-color: rgba(19, 27, 42, 0.92) !important;
          border: 1px solid #1e293b !important;
          color: #f8fafc !important;
          border-radius: 6px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          padding: 3px 6px !important;
          pointer-events: none !important;
        }
        .cadastre-polygon-tooltip::before {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
