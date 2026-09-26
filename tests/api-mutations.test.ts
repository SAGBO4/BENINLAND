import { describe, it, expect, beforeEach } from "vitest";
import { GET as getMutations, POST as postMutation } from "@/app/api/v1/mutations/route";
import { POST as finalizeMutation } from "@/app/api/v1/mutations/[id]/finaliser/route";
import { anyigbaRepo } from "@/repositories/index";

describe("API /api/v1/mutations & finalisation", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("GET /api/v1/mutations", () => {
    it("doit retourner la liste des mutations existantes", async () => {
      const response = await getMutations();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.count).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.some((m: any) => m.codeMutation === "MUT-2026-0089")).toBe(true);
    });
  });

  describe("POST /api/v1/mutations — Initiation et Verrou Légal", () => {
    it("doit initier une mutation valide avec pose immédiate du verrou d'opposabilité", async () => {
      const payload = {
        parcelleCode: "OUI-0421",
        cedantNpi: "FICTIF-BEN-2026-0041",
        cedantNom: "Germain Dossou",
        cessionnaireNpi: "FICTIF-BEN-2026-0003",
        cessionnaireNom: "Koffi Mensah",
        notaireId: "Me Christian Agbossou",
        prixFcfa: 4500000,
      };

      const request = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await postMutation(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.parcelleCode).toBe("OUI-0421");
      expect(json.data.statut).toBe("INITIEE_VERROUILLEE");
      expect(json.data.statutSequestre).toBe("FONDS_BLOQUES_SEQUESTRE");
      expect(json.data.hashPreuve).toBeDefined();

      // Vérifie que la parcelle est effectivement verrouillée
      const parcelle = anyigbaRepo.getParcelleByCode("OUI-0421");
      expect(parcelle?.enVerrouMutation).toBe(true);
    });

    it("doit bloquer formellement avec 409 Conflict toute tentative de double vente concurrente", async () => {
      // 1. Première mutation légitime
      const payload1 = {
        parcelleCode: "OUI-0421",
        cedantNpi: "FICTIF-BEN-2026-0041",
        cedantNom: "Germain Dossou",
        cessionnaireNpi: "FICTIF-BEN-2026-0003",
        cessionnaireNom: "Koffi Mensah",
        notaireId: "Me Christian Agbossou",
        prixFcfa: 4500000,
      };
      const req1 = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload1),
      });
      const res1 = await postMutation(req1);
      expect(res1.status).toBe(201);

      // 2. Deuxième tentative frauduleuse ou concurrente
      const payload2 = {
        parcelleCode: "OUI-0421",
        cedantNpi: "FICTIF-BEN-2026-0041",
        cedantNom: "Germain Dossou",
        cessionnaireNpi: "FICTIF-BEN-2026-9999",
        cessionnaireNom: "Second Acheteur Fictif",
        notaireId: "Me Inconnu",
        prixFcfa: 5500000,
      };
      const req2 = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload2),
      });
      const res2 = await postMutation(req2);

      expect(res2.status).toBe(409);
      const json2 = await res2.json();
      expect(json2.success).toBe(false);
      expect(json2.error).toContain("PARCELLE_VERROUILLEE");
    });

    it("doit rejeter avec 409 Conflict une mutation sur une parcelle sous gel CSAF (LIT-ALL-005)", async () => {
      const payload = {
        parcelleCode: "LIT-ALL-005",
        cedantNpi: "FICTIF-BEN-2026-0777",
        cedantNom: "Gbénou",
        cessionnaireNpi: "FICTIF-BEN-2026-0003",
        cessionnaireNom: "Koffi Mensah",
        notaireId: "Me Christian Agbossou",
        prixFcfa: 3000000,
      };

      const request = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await postMutation(request);
      expect(response.status).toBe(409);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("PARCELLE_EN_LITIGE");
    });

    it("doit renvoyer 400 Bad Request en cas de données de formulaire invalides", async () => {
      const invalidPayload = {
        parcelleCode: "OU", // Trop court (min 3)
        cedantNpi: "",
        prixFcfa: -500, // Doit être positif
      };

      const request = new Request("http://localhost:3000/api/v1/mutations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPayload),
      });

      const response = await postMutation(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Champs invalides");
      expect(json.details).toBeDefined();
    });
  });

  describe("POST /api/v1/mutations/[id]/finaliser — Visa ANDF", () => {
    it("doit finaliser une mutation valide, transférer la propriété et délivrer le titre", async () => {
      const request = new Request("http://localhost:3000/api/v1/mutations/MUT-2026-0089/finaliser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerName: "Mme Reine Houndété (Directrice ANDF)" }),
      });
      const params = Promise.resolve({ id: "MUT-2026-0089" });

      const response = await finalizeMutation(request, { params });
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.message).toContain("Mutation validée par l'ANDF");

      // Vérifie les effets de bord dans le cadastre
      const parcelle = anyigbaRepo.getParcelleByCode("CAL-0089");
      expect(parcelle?.enVerrouMutation).toBe(false);
      expect(parcelle?.proprietaireNom).toBe("Aimé Houndégbé");
      expect(parcelle?.statutJuridique).toBe("CPF");

      // Vérifie que le titre CPF est scellé dans le coffre-fort des actes
      const actes = anyigbaRepo.getAllActes();
      expect(actes.some((a) => a.parcelleCode === "CAL-0089" && a.typeActe === "CERTIFICAT_PROPRIETE_FONCIERE")).toBe(true);
    });

    it("doit renvoyer 400 Bad Request si le code de mutation n'existe pas", async () => {
      const request = new Request("http://localhost:3000/api/v1/mutations/MUT-INCONNUE-9999/finaliser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const params = Promise.resolve({ id: "MUT-INCONNUE-9999" });

      const response = await finalizeMutation(request, { params });
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("MUTATION_INTROUVABLE");
    });
  });
});
