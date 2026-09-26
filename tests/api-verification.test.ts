import { describe, it, expect, beforeEach } from "vitest";
import { GET as getVerification } from "@/app/api/v1/verification/[code]/route";
import { anyigbaRepo } from "@/repositories/index";

describe("API /api/v1/verification/[code]", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  it("doit retourner 200 OK et les détails certifiés pour la parcelle OUI-0421", async () => {
    const request = new Request("http://localhost:3000/api/v1/verification/OUI-0421");
    const params = Promise.resolve({ code: "OUI-0421" });

    const response = await getVerification(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.codeUnique).toBe("OUI-0421");
    expect(json.data.commune).toBe("Ouidah");
    expect(json.data.arrondissement).toBe("Pahou");
    expect(json.data.superficieM2).toBe(1250);
    expect(json.data.enLitige).toBe(false);
    expect(json.data.enVerrouMutation).toBe(false);
    expect(json.data.eligibleAchat).toBe(true);
    expect(json.data.messageVocalFon).toContain("Anyigba elɔ ɖó Titre Foncier");
    // L'identité du propriétaire doit être masquée (protection des données)
    expect(json.data.proprietaireMasque).toBe("Germain D****u (******e D*****)");
    expect(json.data.proprietaireMasque).toContain("*");
  });

  it("doit identifier une parcelle sous gel conservatoire CSAF (LIT-ALL-005)", async () => {
    const request = new Request("http://localhost:3000/api/v1/verification/LIT-ALL-005");
    const params = Promise.resolve({ code: "LIT-ALL-005" });

    const response = await getVerification(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.codeUnique).toBe("LIT-ALL-005");
    expect(json.data.enLitige).toBe(true);
    expect(json.data.eligibleAchat).toBe(false);
    expect(json.data.messageVocalFon).toContain("Hwɛndo ! Anyigba elɔ ɖó hwɛ ɖò kɔ́jí CSAF");
  });

  it("doit identifier une parcelle sous verrou notarial (CAL-0089)", async () => {
    const request = new Request("http://localhost:3000/api/v1/verification/CAL-0089");
    const params = Promise.resolve({ code: "CAL-0089" });

    const response = await getVerification(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.codeUnique).toBe("CAL-0089");
    expect(json.data.enVerrouMutation).toBe(true);
    expect(json.data.eligibleAchat).toBe(false);
    expect(json.data.messageVocalFon).toContain("Nǔmɔmɔ : È ɖò anyigba elɔ sà wɛ dìn ɖò Notaire gɔ́n");
  });

  it("doit être insensible à la casse du code parcelle (oui-0421)", async () => {
    const request = new Request("http://localhost:3000/api/v1/verification/oui-0421");
    const params = Promise.resolve({ code: "oui-0421" });

    const response = await getVerification(request, { params });
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.codeUnique).toBe("OUI-0421");
  });

  it("doit retourner 404 Not Found pour une référence inexistante", async () => {
    const request = new Request("http://localhost:3000/api/v1/verification/INEXISTANT-999");
    const params = Promise.resolve({ code: "INEXISTANT-999" });

    const response = await getVerification(request, { params });
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("Aucune parcelle n'a été trouvée pour la référence INEXISTANT-999");
  });
});
