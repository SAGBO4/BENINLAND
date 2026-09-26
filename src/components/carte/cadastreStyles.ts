import { SeedParcelle } from "@/db/seed/data";

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
