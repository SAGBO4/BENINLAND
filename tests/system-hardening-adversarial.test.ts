import { describe, it, expect, beforeEach } from "vitest";
import { calculateDocumentHash, verifyDocumentIntegrity, generateBlockchainProof } from "@/lib/hash";
import { maskIdentity, maskTelephone, formatFcfa } from "@/lib/utils";
import { calculatePolygonAreaM2, checkBoundingBoxOverlap, getPolygonCentroid } from "@/lib/geo";
import { processInboundSms } from "@/lib/channels";
import { anyigbaRepo } from "@/repositories/index";
import { POST as postMutation } from "@/app/api/v1/mutations/route";
import { POST as finalizeMutation } from "@/app/api/v1/mutations/[id]/finaliser/route";
import { POST as postConvention } from "@/app/api/v1/conventions/route";
import { GET as getTts } from "@/app/api/v1/voice/tts/route";
import { NextRequest } from "next/server";

describe("SUITE HOSTILE ADVERSARIALE & EDGE-CASES (SKEPTICAL SENIOR QA)", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("1. VULNÉRABILITÉS CRYPTO & SÉRIALISATION (src/lib/hash.ts)", () => {
    it("doit gérer les références circulaires sans lever de RangeError (Call stack overflow)", () => {
      const circularObj: any = { code: "PARCELLE-CIRCULAIRE", val: 123 };
      circularObj.self = circularObj;

      expect(() => {
        const res = calculateDocumentHash(circularObj);
        expect(res.hash).toHaveLength(64);
      }).not.toThrow();
    });

    it("doit gérer les valeurs null, undefined et types primitifs inattendus dans l'objet", () => {
      const badObj = {
        npi: "FICTIF-BEN-001",
        emptyVal: null,
        undefVal: undefined,
        func: () => "malicious",
        sym: Symbol("test"),
      };

      expect(() => {
        const res = calculateDocumentHash(badObj as any);
        expect(res.hash).toHaveLength(64);
        expect(res.salt).toBeDefined();
      }).not.toThrow();
    });

    it("verifyDocumentIntegrity doit retourner false et JAMAIS crasher si expectedHash ou salt est null/undefined", () => {
      const doc = { test: 123 };
      // Tests de robustesse sur expectedHash corrompu ou manquant
      expect(verifyDocumentIntegrity(doc, null as any, "sel")).toBe(false);
      expect(verifyDocumentIntegrity(doc, undefined as any, "sel")).toBe(false);
      expect(verifyDocumentIntegrity(doc, "", "sel")).toBe(false);
      expect(verifyDocumentIntegrity(doc, "non-hex-hash", "sel")).toBe(false);

      // Tests sur sel null/undefined/vide
      expect(verifyDocumentIntegrity(doc, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", null as any)).toBe(false);
      expect(verifyDocumentIntegrity(doc, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "")).toBe(false);
    });

    it("generateBlockchainProof ne doit pas planter sur hash vide ou non-string", () => {
      expect(() => generateBlockchainProof("")).not.toThrow();
      expect(() => generateBlockchainProof(null as any)).not.toThrow();
      const proof = generateBlockchainProof("abc");
      expect(proof.txId).toBeDefined();
      expect(proof.otsProof).toBeDefined();
    });
  });

  describe("2. VULNÉRABILITÉS LOGIQUE & MASQUAGE RGPD / APDP (src/lib/utils.ts)", () => {
    it("maskIdentity ne doit pas crasher ni afficher 'undefined*' sur des espaces consécutifs ou noms courts", () => {
      // Cas espaces multiples / espaces en bordure
      expect(maskIdentity("Koffi   Mensah")).not.toContain("undefined");
      expect(maskIdentity("  Aimé  Houndégbé  ")).not.toContain("undefined");

      // Cas nom très court
      expect(maskIdentity("A B")).toBe("A B*");
      expect(maskIdentity("Al")).toBe("Al");

      // Cas entrées non-string / nulles
      expect(maskIdentity("")).toBe("");
      expect(maskIdentity(null as any)).toBe("");
      expect(maskIdentity(undefined as any)).toBe("");
      expect(maskIdentity(12345 as any)).toBe("");
    });

    it("maskTelephone ne doit jamais crasher sur des types erronés (nombres, objets)", () => {
      expect(maskTelephone("+229 97 00 12 34")).toBe("+229 ••••34");
      expect(maskTelephone(97001234 as any)).toBe("");
      expect(maskTelephone(null as any)).toBe("");
      expect(maskTelephone(undefined as any)).toBe("");
      expect(maskTelephone("123")).toBe("123");
    });

    it("formatFcfa doit gérer NaN, Infinity et valeurs négatives de manière défensive", () => {
      expect(formatFcfa(NaN)).toBe("0 FCFA");
      expect(formatFcfa(Infinity)).toBe("0 FCFA");
      expect(formatFcfa(-Infinity)).toBe("0 FCFA");
      expect(formatFcfa(-5000)).toBe("0 FCFA");
      expect(formatFcfa(5000000)).toBe("5 000 000 FCFA");
    });
  });

  describe("3. VULNÉRABILITÉS GÉOMÉTRIQUES & BUFFER / STACK OVERFLOW (src/lib/geo.ts)", () => {
    it("checkBoundingBoxOverlap ne doit pas provoquer de Maximum Call Stack Size Exceeded sur de grands tableaux", () => {
      // 150 000 points déclenchent normalement un crash avec Math.min(...points)
      const largePoly1: [number, number][] = Array.from({ length: 100000 }, (_, i) => [
        2.0 + (i * 0.00001),
        6.3 + (i * 0.00001),
      ]);
      const largePoly2: [number, number][] = [
        [2.05, 6.35],
        [2.06, 6.35],
        [2.06, 6.36],
        [2.05, 6.36],
      ];

      expect(() => {
        const overlap = checkBoundingBoxOverlap(largePoly1, largePoly2);
        expect(typeof overlap).toBe("boolean");
      }).not.toThrow();
    });

    it("getPolygonCentroid et calculatePolygonAreaM2 doivent être résilients aux NaN et coordonnées corrompues", () => {
      expect(calculatePolygonAreaM2([] as any)).toBe(0);
      expect(calculatePolygonAreaM2(null as any)).toBe(0);
      expect(calculatePolygonAreaM2([[NaN, 6.3], [2.1, 6.4], [2.1, 6.3]])).toBe(0);

      const centroid = getPolygonCentroid([[NaN, 6.3], [2.1, 6.4]]);
      expect(Number.isNaN(centroid[0])).toBe(false);
      expect(Number.isNaN(centroid[1])).toBe(false);
    });
  });

  describe("4. RÉSILIENCE SMS & ATTAQUES DE CONTENU (src/lib/channels.ts)", () => {
    it("processInboundSms ne doit pas planter sur payloads non-string ou malveillants", () => {
      expect(() => processInboundSms("+22997000000", null as any)).not.toThrow();
      expect(() => processInboundSms("+22997000000", 12345 as any)).not.toThrow();
      expect(() => processInboundSms(null as any, "VERIF OUI-0421")).not.toThrow();
    });
  });

  describe("5. REPO & API MUTATION : ATTAQUES MÉTIER, AUTO-VENTE & INVARIANTS", () => {
    it("doit refuser l'auto-cession (cedant === cessionnaire) pour empêcher le blocage malveillant de parcelle", async () => {
      const parcelle = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(parcelle?.proprietaireNpi).toBe("FICTIF-BEN-2026-0041");

      const req = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          cedantNpi: "FICTIF-BEN-2026-0041",
          cedantNom: "Germain Dossou",
          cessionnaireNpi: "FICTIF-BEN-2026-0041", // Tentative d'auto-vente frauduleuse
          cessionnaireNom: "Germain Dossou",
          notaireId: "Me Agbossou",
          prixFcfa: 3000000,
        }),
      });

      const res = await postMutation(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain("AUTO_CESSION_INTERDITE");

      // La parcelle ne doit SURTOUT PAS avoir été verrouillée
      const parcelleVerif = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(parcelleVerif?.enVerrouMutation).toBe(false);
    });

    it("doit rejeter les montants aberrants : négatifs, zéro ou Infinity", async () => {
      const req = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          cedantNpi: "FICTIF-BEN-2026-0041",
          cedantNom: "Germain Dossou",
          cessionnaireNpi: "FICTIF-BEN-2026-0050",
          cessionnaireNom: "Aimé",
          notaireId: "Me Agbossou",
          prixFcfa: -50000,
        }),
      });

      const res = await postMutation(req);
      expect(res.status).toBe(400);
    });

    it("doit rejeter avec 400 Bad Request quand on tente de finaliser une mutation inexistante", async () => {
      const req = new Request("http://localhost:3000/api/v1/mutations/MUT-INEXISTANTE-999/finaliser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerName: "Directrice ANDF" }),
      });

      const res = await finalizeMutation(req, { params: Promise.resolve({ id: "MUT-INEXISTANTE-999" }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("MUTATION_INTROUVABLE");
    });
  });

  describe("6. ATTAQUES DE CONTRE-MESURES SUR LES CONVENTIONS & SURFACES", () => {
    it("doit refuser une convention où le vendeur et l'acheteur sont identiques", async () => {
      const req = new Request("http://localhost:3000/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentNpi: "BEN-AGENT-001",
          agentNom: "Fiacre",
          vendeurNpi: "NPI-IDENTIQUE-777",
          vendeurNom: "Jean",
          acheteurNpi: "NPI-IDENTIQUE-777", // Fraude
          acheteurNom: "Jean",
          commune: "Ouidah",
          village: "Pahou",
          surfaceM2: 500,
          prixFcfa: 1000000,
        }),
      });

      const res = await postConvention(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("AUTO_CESSION_INTERDITE");
    });

    it("doit refuser une surface supérieure au territoire national du Bénin ou aberrante", async () => {
      const req = new Request("http://localhost:3000/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentNpi: "BEN-AGENT-001",
          agentNom: "Fiacre",
          vendeurNpi: "NPI-VENDEUR-111",
          vendeurNom: "Jean",
          acheteurNpi: "NPI-ACHETEUR-222",
          acheteurNom: "Paul",
          commune: "Ouidah",
          village: "Pahou",
          surfaceM2: 999999999999, // Plus grand que le Bénin entier
          prixFcfa: 1000000,
        }),
      });

      const res = await postConvention(req);
      expect(res.status).toBe(400);
    });
  });

  describe("7. CONTOURNEMENT DOS SUR LA SYNTHÈSE VOCALE (GET)", () => {
    it("doit rejeter les requêtes GET TTS dont le texte dépasse 500 caractères avec 400 Bad Request", async () => {
      const longText = "B".repeat(501);
      const req = new NextRequest(`http://localhost:3000/api/v1/voice/tts?text=${encodeURIComponent(longText)}&lang=fon`);

      const res = await getTts(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("500 caractères");
    });
  });
});
