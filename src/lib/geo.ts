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
  if (!Array.isArray(coordinates) || coordinates.length < 3) return 0;

  const R = 6378137; // Rayon de la Terre en mètres
  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const pt1 = coordinates[i];
    const pt2 = coordinates[j];
    if (!Array.isArray(pt1) || !Array.isArray(pt2)) return 0;

    const [lng1, lat1] = pt1;
    const [lng2, lat2] = pt2;

    if (!Number.isFinite(lng1) || !Number.isFinite(lat1) || !Number.isFinite(lng2) || !Number.isFinite(lat2)) {
      return 0;
    }

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
 * Conçu de manière itérative sans déballage de pile (...spread) pour éviter les stack overflows.
 */
export function checkBoundingBoxOverlap(
  poly1: [number, number][],
  poly2: [number, number][]
): boolean {
  if (!Array.isArray(poly1) || !Array.isArray(poly2) || !poly1.length || !poly2.length) return false;

  let minLng1 = Infinity, maxLng1 = -Infinity, minLat1 = Infinity, maxLat1 = -Infinity;
  for (let i = 0; i < poly1.length; i++) {
    const [lng, lat] = poly1[i];
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      if (lng < minLng1) minLng1 = lng;
      if (lng > maxLng1) maxLng1 = lng;
      if (lat < minLat1) minLat1 = lat;
      if (lat > maxLat1) maxLat1 = lat;
    }
  }

  let minLng2 = Infinity, maxLng2 = -Infinity, minLat2 = Infinity, maxLat2 = -Infinity;
  for (let i = 0; i < poly2.length; i++) {
    const [lng, lat] = poly2[i];
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      if (lng < minLng2) minLng2 = lng;
      if (lng > maxLng2) maxLng2 = lng;
      if (lat < minLat2) minLat2 = lat;
      if (lat > maxLat2) maxLat2 = lat;
    }
  }

  if (!Number.isFinite(minLng1) || !Number.isFinite(minLng2)) return false;

  return (
    minLng1 < maxLng2 &&
    maxLng1 > minLng2 &&
    minLat1 < maxLat2 &&
    maxLat1 > minLat2
  );
}

/**
 * Calcule le centre (centroïde) d'un polygone avec filtrage des points aberrants / NaN.
 */
export function getPolygonCentroid(coordinates: [number, number][]): [number, number] {
  const defaultCenter: [number, number] = [2.0833, 6.3667]; // Bénin / Ouidah
  if (!Array.isArray(coordinates) || !coordinates.length) return defaultCenter;

  let totalLng = 0;
  let totalLat = 0;
  let validCount = 0;

  for (const pt of coordinates) {
    if (Array.isArray(pt)) {
      const [lng, lat] = pt;
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        totalLng += lng;
        totalLat += lat;
        validCount++;
      }
    }
  }

  if (validCount === 0) return defaultCenter;
  return [totalLng / validCount, totalLat / validCount];
}
