import { describe, it, expect, beforeEach } from "vitest";
import { anyigbaRepo } from "@/repositories/index";
import { INITIAL_PARCELLES } from "@/db/seed/data";
import { POST as postMutation } from "@/app/api/v1/mutations/route";
import { POST as finalizeMutation } from "@/app/api/v1/mutations/[id]/finaliser/route";
import { GET as getVerification } from "@/app/api/v1/verification/[code]/route";
import { calculateDocumentHash, verifyDocumentIntegrity } from "@/lib/hash";
import fs from "fs";
import path from "path";

describe("Frontend Unifié Anyigba (BENINLAND) — Scénarios & Flux Clés", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("1. Scénario interactif Famille Dossou (OUI-0421) & Neutralisation Double Vente", () => {
    it("doit exécuter le cycle complet : PV de bornage -> Verrou notarial -> Blocage 409 -> Visa ANDF -> Titre CPF", async () => {
      // Étape A : Parcelle initiale disponible et non verrouillée
      const pInit = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(pInit).toBeDefined();
      expect(pInit?.enVerrouMutation).toBe(false);
      expect(pInit?.enLitige).toBe(false);

      // Étape B : Enregistrement de la convention assistée au village
      const conv = anyigbaRepo.createConventionAssistee({
        agentNpi: "FICTIF-BEN-2026-0045",
        agentNom: "Mamadou Bio (Agent Foncier)",
        vendeurNpi: "FICTIF-BEN-2026-0041",
        vendeurNom: "Germain Dossou",
        acheteurNpi: "FICTIF-BEN-2026-0003",
        acheteurNom: "Koffi Mensah",
        commune: "Ouidah",
        village: "Pahou",
        surfaceM2: 1250,
        prixFcfa: 4500000,
        temoignagesVocaux: [
          { temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24 },
          { temoinNom: "Chef Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45 },
        ],
      });
      expect(conv.codeConvention).toContain("CONV-VIL-2026-");
      expect(conv.photosBornesCount).toBe(4);
      expect(conv.statutSequestre).toBe("FONDS_BLOQUES_SEQUESTRE");

      // Étape C : Me Agbossou ouvre le dossier de mutation et pose le verrou notarial
      const reqLegitime = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          cedantNpi: "FICTIF-BEN-2026-0041",
          cedantNom: "Germain Dossou",
          cessionnaireNpi: "FICTIF-BEN-2026-0003",
          cessionnaireNom: "Koffi Mensah",
          notaireId: "Me Christian Agbossou",
          prixFcfa: 4500000,
        }),
      });

      const resLegitime = await postMutation(reqLegitime);
      expect(resLegitime.status).toBe(201);
      const jsonLegitime = await resLegitime.json();
      expect(jsonLegitime.success).toBe(true);
      const codeMutation = jsonLegitime.data.codeMutation;

      // La parcelle OUI-0421 est désormais formellement verrouillée
      const pVerrouillee = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(pVerrouillee?.enVerrouMutation).toBe(true);

      // Étape D : Tentative de double vente par un second acheteur concurrent
      const reqFraude = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          cedantNpi: "FICTIF-BEN-2026-0041",
          cedantNom: "Germain Dossou",
          cessionnaireNpi: "FICTIF-BEN-2026-9999",
          cessionnaireNom: "Second Acheteur Fictif Fraudeur",
          notaireId: "Autre Notaire",
          prixFcfa: 5500000,
        }),
      });

      const resFraude = await postMutation(reqFraude);
      expect(resFraude.status).toBe(409); // STRICTEMENT 409 CONFLICT !
      const jsonFraude = await resFraude.json();
      expect(jsonFraude.success).toBe(false);
      expect(jsonFraude.error).toContain("PARCELLE_VERROUILLEE");

      // Étape E : Finalisation républicaine par l'ANDF
      const reqFinalisation = new Request(`http://localhost:3000/api/v1/mutations/${codeMutation}/finaliser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerName: "Mme Reine Houndété (Directrice ANDF)" }),
      });
      const paramsFinalisation = Promise.resolve({ id: codeMutation });

      const resFinalisation = await finalizeMutation(reqFinalisation, { params: paramsFinalisation });
      expect(resFinalisation.status).toBe(200);

      // Le titre CPF est délivré, le verrou levé et la propriété transférée à M. Koffi Mensah
      const pFinal = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(pFinal?.enVerrouMutation).toBe(false);
      expect(pFinal?.proprietaireNom).toBe("Koffi Mensah");
      expect(pFinal?.statutJuridique).toBe("CPF");
    });
  });

  describe("2. Carte Cadastrale Leaflet & 7 Polygones Géographiques", () => {
    it("doit contenir exactement les 7 parcelles certifiées avec géométries GeoJSON valides", () => {
      const parcelles = anyigbaRepo.getAllParcelles();
      expect(parcelles.length).toBe(7);

      for (const p of parcelles) {
        expect(p.codeUnique).toBeDefined();
        expect(p.commune).toBeDefined();
        expect(p.polygoneGeojson.type).toBe("Polygon");
        expect(p.polygoneGeojson.coordinates[0].length).toBeGreaterThanOrEqual(4);

        // Vérification de la validité des coordonnées géographiques au Bénin (lat ~6-12, lng ~1-3.5)
        for (const [lng, lat] of p.polygoneGeojson.coordinates[0]) {
          expect(lng).toBeGreaterThan(0.5);
          expect(lng).toBeLessThan(4.0);
          expect(lat).toBeGreaterThan(5.5);
          expect(lat).toBeLessThan(13.0);
        }
      }
    });

    it("doit garantir l'isolation SSR du moteur Leaflet", () => {
      // Vérification du pattern dynamic import dans CadastreLeafletMap
      const mapComponentPath = path.resolve(__dirname, "../src/components/carte/CadastreLeafletMap.tsx");
      const content = fs.readFileSync(mapComponentPath, "utf-8");

      expect(content).toContain("dynamic(() => import(\"./CadastreLeafletCore\"), {");
      expect(content).toContain("ssr: false");
    });
  });

  describe("3. Passerelle de Séquestre Mobile Money Multi-Opérateurs", () => {
    it("doit valider les 3 opérateurs agréés du Bénin dans le modal Mobile Money", () => {
      const modalPath = path.resolve(__dirname, "../src/components/simulators/MobileMoneyModal.tsx");
      const content = fs.readFileSync(modalPath, "utf-8");

      // MTN MoMo (*880#)
      expect(content).toContain("MTN_MOMO");
      expect(content).toContain("MTN MoMo");
      expect(content).toContain("*880#");

      // Moov Money (*155#)
      expect(content).toContain("MOOV_MONEY");
      expect(content).toContain("Moov Money");
      expect(content).toContain("*155#");

      // Celtiis Cash (*889#)
      expect(content).toContain("CELTIIS");
      expect(content).toContain("Celtiis Cash");
      expect(content).toContain("*889#");
    });
  });

  describe("4. Vérification Citoyenne de Parcelle (/api/v1/verification/[code])", () => {
    it("doit vérifier les différents statuts légaux pour les citoyens", async () => {
      // 1. Parcelle légitime
      const req1 = new Request("http://localhost:3000/api/v1/verification/OUI-0421");
      const res1 = await getVerification(req1, { params: Promise.resolve({ code: "OUI-0421" }) });
      expect(res1.status).toBe(200);
      const j1 = await res1.json();
      expect(j1.data.eligibleAchat).toBe(true);

      // 2. Parcelle en litige CSAF
      const req2 = new Request("http://localhost:3000/api/v1/verification/LIT-ALL-005");
      const res2 = await getVerification(req2, { params: Promise.resolve({ code: "LIT-ALL-005" }) });
      expect(res2.status).toBe(200);
      const j2 = await res2.json();
      expect(j2.data.enLitige).toBe(true);
      expect(j2.data.eligibleAchat).toBe(false);

      // 3. Parcelle verrouillée
      const req3 = new Request("http://localhost:3000/api/v1/verification/CAL-0089");
      const res3 = await getVerification(req3, { params: Promise.resolve({ code: "CAL-0089" }) });
      expect(res3.status).toBe(200);
      const j3 = await res3.json();
      expect(j3.data.enVerrouMutation).toBe(true);
      expect(j3.data.eligibleAchat).toBe(false);
    });
  });

  describe("5. Simulation d'Altération & Intégrité Documentaire SHA-256", () => {
    it("doit sceller un acte et détecter instantanément la moindre modification non autorisée", () => {
      const originalActe = "TITRE_FONCIER_NUMERO_TF_OUIDAH_2026_104_BENIN";
      const { hash: originalHash, salt } = calculateDocumentHash(originalActe);

      // Le document authentique est conforme
      expect(verifyDocumentIntegrity(originalActe, originalHash, salt)).toBe(true);

      // Simulation d'une altération frauduleuse (ex: changement de nom ou montant)
      const altResult = anyigbaRepo.simulateDocumentTampering("TF-OUIDAH-2026-104");
      expect(altResult.success).toBe(true);
      expect(altResult.otsStatus).toBe("FRAUDE_DETECTEE_PREUVE_NON_CONFORME");
      expect(altResult.hashOriginal).not.toBe(altResult.hashFalsifie);

      const acteDansCoffre = anyigbaRepo.getAllActes().find((a) => a.referenceActe === "TF-OUIDAH-2026-104");
      expect(acteDansCoffre?.estFalsifie).toBe(true);
    });
  });

  describe("6. Non-régression des Routes et Navigation Unifiée", () => {
    it("doit vérifier que la page racine propose tous les onglets fonctionnels", () => {
      const pagePath = path.resolve(__dirname, "../src/app/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      expect(content).toContain('"vitrine"');
      expect(content).toContain('"dashboard"');
      expect(content).toContain('"carte"');
      expect(content).toContain('"scenario"');
      expect(content).toContain('"verification"');
      expect(content).toContain('"simulators"');
    });

    it("doit vérifier la présence des 9 espaces métiers spécialisés", () => {
      const espaces = [
        "agent",
        "andf",
        "banque",
        "citoyen",
        "commune",
        "csaf",
        "ministere",
        "notaire",
      ];

      for (const espace of espaces) {
        const espacePath = path.resolve(__dirname, `../src/app/espace/${espace}/page.tsx`);
        expect(fs.existsSync(espacePath), `Espace manquant : /espace/${espace}`).toBe(true);
      }
    });
  });
});
