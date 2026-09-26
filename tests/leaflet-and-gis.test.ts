import { describe, it, expect } from "vitest";
import { getParcelleStyle } from "@/components/carte/cadastreStyles";
import { calculatePolygonAreaM2, getPolygonCentroid, checkBoundingBoxOverlap } from "@/lib/geo";
import { INITIAL_PARCELLES, SeedParcelle } from "@/db/seed/data";
import fs from "fs";
import path from "path";

describe("Leaflet Cartographie & Algorithmes SIG", () => {
  describe("Sécurité SSR Leaflet (Pas d'accès à l'objet window côté serveur)", () => {
    it("doit vérifier que CadastreLeafletMap utilise dynamic() avec ssr: false", () => {
      const filePath = path.resolve(__dirname, "../src/components/carte/CadastreLeafletMap.tsx");
      const content = fs.readFileSync(filePath, "utf-8");

      expect(content).toContain("dynamic(");
      expect(content).toContain("ssr: false");
      expect(content).toContain('import("./CadastreLeafletCore")');
    });

    it("doit vérifier que Leaflet CSS est bien importé globalement pour éviter les glitchs visuels", () => {
      const globalsCssPath = path.resolve(__dirname, "../src/app/globals.css");
      const content = fs.readFileSync(globalsCssPath, "utf-8");

      expect(content).toContain('leaflet/dist/leaflet.css');
    });
  });

  describe("Styles cartographiques selon le statut foncier légal", () => {
    const baseParcelle: SeedParcelle = { ...INITIAL_PARCELLES[0] };

    it("doit appliquer le rouge terre cuite et bordure pointillée pour un litige CSAF", () => {
      const litigeParcelle: SeedParcelle = {
        ...baseParcelle,
        enLitige: true,
        enVerrouMutation: false,
      };

      const style = getParcelleStyle(litigeParcelle, false);
      expect(style.fillColor).toBe("#B83214");
      expect(style.color).toBe("#9E2A0E");
      expect(style.dashArray).toBe("4, 4");
    });

    it("doit appliquer l'or ambré notarial pour un verrou de mutation actif", () => {
      const verrouParcelle: SeedParcelle = {
        ...baseParcelle,
        enLitige: false,
        enVerrouMutation: true,
      };

      const style = getParcelleStyle(verrouParcelle, false);
      expect(style.fillColor).toBe("#D99B00");
      expect(style.color).toBe("#B47D00");
      expect(style.dashArray).toBeUndefined();
    });

    it("doit appliquer le vert forêt régalien pour un Titre Foncier (TF)", () => {
      const tfParcelle: SeedParcelle = {
        ...baseParcelle,
        enLitige: false,
        enVerrouMutation: false,
        statutJuridique: "TITRE_FONCIER",
      };

      const style = getParcelleStyle(tfParcelle, false);
      expect(style.fillColor).toBe("#0A5C36");
      expect(style.color).toBe("#074428");
    });

    it("doit appliquer le bleu institutionnel pour un Certificat de Propriété (CPF)", () => {
      const cpfParcelle: SeedParcelle = {
        ...baseParcelle,
        enLitige: false,
        enVerrouMutation: false,
        statutJuridique: "CPF",
      };

      const style = getParcelleStyle(cpfParcelle, false);
      expect(style.fillColor).toBe("#1D4ED8");
      expect(style.color).toBe("#1E40AF");
    });

    it("doit appliquer l'ardoise neutre pour un droit coutumier", () => {
      const coutumierParcelle: SeedParcelle = {
        ...baseParcelle,
        enLitige: false,
        enVerrouMutation: false,
        statutJuridique: "COUTUMIER",
      };

      const style = getParcelleStyle(coutumierParcelle, false);
      expect(style.fillColor).toBe("#64748B");
      expect(style.color).toBe("#475569");
    });

    it("doit accentuer la surbrillance (épaisseur et opacité) lorsque la parcelle est sélectionnée", () => {
      const unselected = getParcelleStyle(baseParcelle, false);
      const selected = getParcelleStyle(baseParcelle, true);

      expect(selected.weight).toBeGreaterThan(unselected.weight);
      expect(selected.fillOpacity).toBeGreaterThan(unselected.fillOpacity);
    });
  });

  describe("Calculs géodésiques et topologiques PostGIS / Shoelace", () => {
    it("doit calculer la superficie approchée en m² avec la formule de Shoelace sphérique", () => {
      // Coordonnées d'un polygone carré autour de Pahou (Ouidah)
      const coords: [number, number][] = [
        [2.0830, 6.3660],
        [2.0840, 6.3660],
        [2.0840, 6.3670],
        [2.0830, 6.3670],
        [2.0830, 6.3660],
      ];

      const area = calculatePolygonAreaM2(coords);
      expect(area).toBeGreaterThan(1000);
      expect(typeof area).toBe("number");
    });

    it("doit renvoyer 0 si le polygone a moins de 3 points", () => {
      expect(calculatePolygonAreaM2([[2.0, 6.0], [2.1, 6.1]])).toBe(0);
    });

    it("doit calculer le centroïde moyen d'un polygone", () => {
      const coords: [number, number][] = [
        [2.0, 6.0],
        [4.0, 6.0],
        [4.0, 8.0],
        [2.0, 8.0],
      ];

      const centroid = getPolygonCentroid(coords);
      expect(centroid[0]).toBeCloseTo(3.0);
      expect(centroid[1]).toBeCloseTo(7.0);
    });

    it("doit détecter avec exactitude le chevauchement ou la disjonction de bounding boxes", () => {
      const poly1: [number, number][] = [[1, 1], [3, 3]];
      const polyOverlapping: [number, number][] = [[2, 2], [4, 4]];
      const polyDisjoint: [number, number][] = [[5, 5], [7, 7]];

      expect(checkBoundingBoxOverlap(poly1, polyOverlapping)).toBe(true);
      expect(checkBoundingBoxOverlap(poly1, polyDisjoint)).toBe(false);
    });
  });

  describe("06 Pôles de Développement Territorial & OpenStreetMap (OSM)", () => {
    it("doit contenir exactement les 06 pôles territoriaux officiels du Bénin", async () => {
      const { POLES_BENIN } = await import("@/lib/poles-benin");
      expect(POLES_BENIN.length).toBe(6);

      const poleIds = POLES_BENIN.map((p) => p.id);
      expect(poleIds).toContain("grand-nokoue");
      expect(poleIds).toContain("sud-ouest");
      expect(poleIds).toContain("sud-est");
      expect(poleIds).toContain("centre");
      expect(poleIds).toContain("nord-ouest");
      expect(poleIds).toContain("nord-est");
    });

    it("doit couvrir l'intégralité des 77 communes de la République du Bénin sans doublon", async () => {
      const { POLES_BENIN } = await import("@/lib/poles-benin");
      const allCommunes = POLES_BENIN.flatMap((p) => p.communes);
      expect(allCommunes.length).toBe(77);

      const uniqueCommunes = new Set(allCommunes.map((c) => c.toLowerCase()));
      expect(uniqueCommunes.size).toBe(77);
    });

    it("doit associer fidèlement chaque commune clé à son pôle territorial respectif", async () => {
      const { getPoleForCommune } = await import("@/lib/poles-benin");
      expect(getPoleForCommune("Cotonou").id).toBe("grand-nokoue");
      expect(getPoleForCommune("Abomey-Calavi").id).toBe("grand-nokoue");
      expect(getPoleForCommune("Lokossa").id).toBe("sud-ouest");
      expect(getPoleForCommune("Allada").id).toBe("sud-ouest");
      expect(getPoleForCommune("Pobè").id).toBe("sud-est");
      expect(getPoleForCommune("Bohicon").id).toBe("centre");
      expect(getPoleForCommune("Abomey").id).toBe("centre");
      expect(getPoleForCommune("Natitingou").id).toBe("nord-ouest");
      expect(getPoleForCommune("Parakou").id).toBe("nord-est");
    });

    it("doit vérifier que la couche OpenStreetMap officielle est configurée par défaut dans CadastreLeafletCore", () => {
      const corePath = path.resolve(__dirname, "../src/components/carte/CadastreLeafletCore.tsx");
      const content = fs.readFileSync(corePath, "utf-8");
      expect(content).toContain("tile.openstreetmap.org");
      expect(content).toContain("OpenStreetMap");
    });
  });
});

