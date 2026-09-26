import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as postReset } from "@/app/api/v1/demo/reset/route";
import { anyigbaRepo } from "@/repositories/index";

// Mock du seed Neon pour éviter les appels réseau distants dans les tests unitaires/intégration
vi.mock("@/db/seed/index", () => ({
  seedDatabase: vi.fn().mockResolvedValue(undefined),
}));

describe("API /api/v1/demo/reset — Réinitialisation Déterministe", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  it("doit réinitialiser l'état complet du cadastre après des mutations et altérations", async () => {
    // 1. Altération de l'état : verrouiller OUI-0421
    anyigbaRepo.initiateMutation({
      parcelleCode: "OUI-0421",
      cedantNpi: "FICTIF-BEN-2026-0041",
      cedantNom: "Germain Dossou",
      cessionnaireNpi: "FICTIF-BEN-2026-0003",
      cessionnaireNom: "Koffi Mensah",
      notaireId: "Me Agbossou",
      prixFcfa: 4500000,
    });
    expect(anyigbaRepo.getParcelleByCode("OUI-0421")?.enVerrouMutation).toBe(true);

    // 2. Altération d'un acte dans le coffre-fort
    anyigbaRepo.simulateDocumentTampering("TF-OUIDAH-2026-104");
    const acteAlter = anyigbaRepo.getAllActes().find((a) => a.referenceActe === "TF-OUIDAH-2026-104");
    expect(acteAlter?.estFalsifie).toBe(true);

    // 3. Appel de la route API de reset
    const response = await postReset();
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.message).toContain("Base réinitialisée avec succès au seed déterministe 2026");

    // 4. Vérification du retour à l'état déterministe d'origine
    const parcelleReset = anyigbaRepo.getParcelleByCode("OUI-0421");
    expect(parcelleReset?.enVerrouMutation).toBe(false);
    expect(parcelleReset?.enLitige).toBe(false);

    const acteReset = anyigbaRepo.getAllActes().find((a) => a.referenceActe === "TF-OUIDAH-2026-104");
    expect(acteReset?.estFalsifie).toBeFalsy();

    // La liste des mutations doit être restaurée au seed unique initial
    const mutations = anyigbaRepo.getAllMutations();
    expect(mutations.length).toBe(1);
    expect(mutations[0].codeMutation).toBe("MUT-2026-0089");
  });
});
