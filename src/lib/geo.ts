/**
 * Utilitaires géographiques pour le cadastre d'Anyigba.
 */

export interface LatLngPoint {
  lat: number;
  lng: number;
}

/**
 * Calcule la superficie approchée d'un polygone de coordonnées en m² (formule du lacet / Shoelace).
 */
export function calculatePolygonAreaM2(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;

  const R = 6378137; // Rayon de la Terre en mètres
  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[j];

    const x1 = (lng1 * Math.PI) / 180;
    const y1 = (lat1 * Math.PI) / 180;
    const x2 = (lng2 * Math.PI) / 180;
    const y2 = (lat2 * Math.PI) / 180;

    area += (x2 - x1) * (2 + Math.sin(y1) + Math.sin(y2));
  }

  area = Math.abs((area * R * R) / 4);
  return Math.round(area * 100) / 100;
}

/**
 * Vérifie si deux boîtes englobantes ou polygones simples se chevauchent.
 */
export function checkBoundingBoxOverlap(
  poly1: [number, number][],
  poly2: [number, number][]
): boolean {
  if (!poly1.length || !poly2.length) return false;

  const minLng1 = Math.min(...poly1.map((p) => p[0]));
  const maxLng1 = Math.max(...poly1.map((p) => p[0]));
  const minLat1 = Math.min(...poly1.map((p) => p[1]));
  const maxLat1 = Math.max(...poly1.map((p) => p[1]));

  const minLng2 = Math.min(...poly2.map((p) => p[0]));
  const maxLng2 = Math.max(...poly2.map((p) => p[0]));
  const minLat2 = Math.min(...poly2.map((p) => p[1]));
  const maxLat2 = Math.max(...poly2.map((p) => p[1]));

  return (
    minLng1 < maxLng2 &&
    maxLng1 > minLng2 &&
    minLat1 < maxLat2 &&
    maxLat1 > minLat2
  );
}

/**
 * Calcule le centre (centroïde) d'un polygone.
 */
export function getPolygonCentroid(coordinates: [number, number][]): [number, number] {
  if (!coordinates.length) return [2.0833, 6.3667]; // Défaut Bénin / Ouidah
  let totalLng = 0;
  let totalLat = 0;

  for (const [lng, lat] of coordinates) {
    totalLng += lng;
    totalLat += lat;
  }

  return [totalLng / coordinates.length, totalLat / coordinates.length];
}
