import { describe, it, expect, beforeEach } from "vitest";
import { GET as getConventions, POST as postConvention } from "@/app/api/v1/conventions/route";
import { GET as getParcelles } from "@/app/api/v1/parcelles/route";
import { GET as verifyDocument } from "@/app/api/v1/documents/[id]/verifier/route";
import { GET as getSmsJournal, POST as postSms } from "@/app/api/v1/sms/route";
import { anyigbaRepo } from "@/repositories/index";

describe("API Routes Complémentaires", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("API /api/v1/conventions", () => {
    it("doit lister les conventions de vente assistée", async () => {
      const response = await getConventions();
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });

    it("doit enregistrer une convention assistée avec bornage GPS et témoignages vocaux", async () => {
      const payload = {
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
          { temoinNom: "Chef Dah Sèhou", qualite: "Chef coutumier", langue: "Fongbe", dureeSecondes: 45 },
        ],
      };

      const request = new Request("http://localhost:3000/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await postConvention(request);
      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.codeConvention).toContain("CONV-VIL-2026-");
      expect(json.data.photosBornesCount).toBe(4);
      expect(json.data.statutSequestre).toBe("FONDS_BLOQUES_SEQUESTRE");
      expect(json.data.dossierHashSha256).toBeDefined();
    });

    it("doit renvoyer 400 Bad Request si les données de convention sont invalides", async () => {
      const request = new Request("http://localhost:3000/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surfaceM2: -10 }),
      });

      const response = await postConvention(request);
      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe("Données de convention invalides");
    });
  });

  describe("API /api/v1/parcelles", () => {
    it("doit retourner l'ensemble des 7 parcelles du cadastre béninois", async () => {
      const request = new Request("http://localhost:3000/api/v1/parcelles");
      const response = await getParcelles(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.count).toBe(7);
      expect(json.data.length).toBe(7);
    });

    it("doit filtrer par code parcelle exact via query param ?code=OUI-0421", async () => {
      const request = new Request("http://localhost:3000/api/v1/parcelles?code=OUI-0421");
      const response = await getParcelles(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.codeUnique).toBe("OUI-0421");
      expect(json.data.commune).toBe("Ouidah");
    });

    it("doit renvoyer 404 si le code demandé n'existe pas", async () => {
      const request = new Request("http://localhost:3000/api/v1/parcelles?code=INEXISTANT-000");
      const response = await getParcelles(request);
      expect(response.status).toBe(404);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("non trouvée");
    });
  });

  describe("API /api/v1/documents/[id]/verifier — Coffre-fort des Actes", () => {
    it("doit certifier un acte authentique valide avec preuve d'intégrité souveraine", async () => {
      const request = new Request("http://localhost:3000/api/v1/documents/TF-OUIDAH-2026-104/verifier");
      const params = Promise.resolve({ id: "TF-OUIDAH-2026-104" });

      const response = await verifyDocument(request, { params });
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.referenceActe).toBe("TF-OUIDAH-2026-104");
      expect(json.data.statutPreuve).toBe("INTEGRITE_SOUVERAINE_GARANTIE");
      expect(json.data.estFalsifie).toBe(false);
      expect(json.data.otsProof).toContain("OTS-BTC-SEAL");
    });

    it("doit détecter et signaler immédiatement une tentative de falsification documentaire", async () => {
      anyigbaRepo.simulateDocumentTampering("TF-OUIDAH-2026-104");

      const request = new Request("http://localhost:3000/api/v1/documents/TF-OUIDAH-2026-104/verifier");
      const params = Promise.resolve({ id: "TF-OUIDAH-2026-104" });

      const response = await verifyDocument(request, { params });
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.data.estFalsifie).toBe(true);
      expect(json.data.statutPreuve).toBe("ALERTE_FRAUDE_HASH_ALTERE");
    });

    it("doit renvoyer 404 pour un document inconnu", async () => {
      const request = new Request("http://localhost:3000/api/v1/documents/DOC-INCONNU-999/verifier");
      const params = Promise.resolve({ id: "DOC-INCONNU-999" });

      const response = await verifyDocument(request, { params });
      expect(response.status).toBe(404);

      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toContain("non trouvé dans le coffre-fort");
    });
  });

  describe("API /api/v1/sms — Canal Inclusif Télécom", () => {
    it("doit récupérer le journal des échanges SMS simulés", async () => {
      const response = await getSmsJournal();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.count).toBeGreaterThanOrEqual(1);
    });

    it("doit traiter une requête SMS VERIF OUI-0421 et délivrer le statut officiel", async () => {
      const request = new Request("http://localhost:3000/api/v1/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telephone: "+229 97 00 12 34", message: "VERIF OUI-0421" }),
      });

      const response = await postSms(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.response).toContain("OUI-0421");
      expect(json.response).toContain("DOSSOU");
      expect(json.response).toContain("ELIGIBLE A L'ACHAT");
    });

    it("doit alerter par SMS en cas de vérification sur une parcelle en litige CSAF", async () => {
      const request = new Request("http://localhost:3000/api/v1/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telephone: "+229 97 00 12 34", message: "VERIF LIT-ALL-005" }),
      });

      const response = await postSms(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.response).toContain("ATTENTION ! Parcelle en litige actif");
      expect(json.response).toContain("CSAF");
    });

    it("doit renvoyer un guide d'utilisation si la commande SMS est inconnue", async () => {
      const request = new Request("http://localhost:3000/api/v1/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telephone: "+229 97 00 12 34", message: "BONJOUR" }),
      });

      const response = await postSms(request);
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.response).toContain("Commande non reconnue");
      expect(json.response).toContain("VERIF <Code>");
    });
  });
});
