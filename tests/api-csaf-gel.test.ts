import { describe, it, expect, beforeEach } from "vitest";
import { anyigbaRepo } from "@/repositories/index";
import { GET as getCsaf, POST as postCsaf } from "@/app/api/v1/csaf/route";
import { POST as postMutation } from "@/app/api/v1/mutations/route";

describe("Module CSAF (Cour Spéciale des Affaires Foncières) & Gel Conservatoire", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  it("doit retourner la liste des contentieux fonciers actifs au greffe", async () => {
    const res = await getCsaf();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(1);

    const litigeInitial = json.data.find((l: any) => l.parcelleCode === "LIT-ALL-005");
    expect(litigeInitial).toBeDefined();
    expect(litigeInitial.statut).toBe("GEL_CONSERVATOIRE");
  });

  it("doit bloquer immédiatement toute tentative de mutation notariée sur une parcelle sous gel CSAF", async () => {
    // LIT-ALL-005 est sous gel conservatoire CSAF
    const reqMutation = new Request("http://localhost:3000/api/v1/mutations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parcelleCode: "LIT-ALL-005",
        cedantNpi: "FICTIF-BEN-2026-0777",
        cedantNom: "Succession Gbénou c/ Hounkpatin",
        cessionnaireNpi: "FICTIF-BEN-2026-0003",
        cessionnaireNom: "Acheteur Tiers",
        notaireId: "Me Christian Agbossou",
        prixFcfa: 15000000,
      }),
    });

    const res = await postMutation(reqMutation);
    const json = await res.json();

    expect(res.status).toBe(409);
    expect(json.success).toBe(false);
    expect(json.error).toContain("PARCELLE_EN_LITIGE");
    expect(json.error).toContain("gel conservatoire CSAF");
  });

  it("doit permettre à un magistrat de signer un gel conservatoire sur une parcelle libre et bloquer toute vente", async () => {
    // OUI-0421 est libre au départ
    const parcelle = anyigbaRepo.getParcelleByCode("OUI-0421");
    expect(parcelle?.enLitige).toBe(false);

    // 1. Signature du gel conservatoire par le magistrat CSAF
    const reqGel = new Request("http://localhost:3000/api/v1/csaf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "GEL",
        parcelleCode: "OUI-0421",
        demandeurNom: "Collectivité Hounsou c/ Famille Dossou",
        demandeurNpi: "FICTIF-BEN-2026-0999",
        motif: "Contestation d'attribution coutumière et empiètement de limites",
        magistratNom: "Juge Antoine Sossa",
      }),
    });

    const resGel = await postCsaf(reqGel);
    const jsonGel = await resGel.json();

    expect(resGel.status).toBe(201);
    expect(jsonGel.success).toBe(true);
    expect(jsonGel.data.referenceOrdonnance).toMatch(/^ORD-CSAF-2026\/\d+$/);

    // 2. Vérification au cadastre : la parcelle est passée en litige
    const parcelleApresGel = anyigbaRepo.getParcelleByCode("OUI-0421");
    expect(parcelleApresGel?.enLitige).toBe(true);

    // 3. Tentative de vente notariée sur OUI-0421 -> DOIT ÉCHOUER avec 409
    const reqMutation = new Request("http://localhost:3000/api/v1/mutations", {
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

    const resMutation = await postMutation(reqMutation);
    const jsonMutation = await resMutation.json();

    expect(resMutation.status).toBe(409);
    expect(jsonMutation.success).toBe(false);
    expect(jsonMutation.error).toContain("PARCELLE_EN_LITIGE");
  });

  it("doit permettre la mainlevée judiciaire du gel par la CSAF et libérer la parcelle", async () => {
    // 1. Activer le gel
    await postCsaf(
      new Request("http://localhost:3000/api/v1/csaf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "GEL",
          parcelleCode: "OUI-0421",
          demandeurNom: "Plaignant",
          motif: "Litige temporaire",
        }),
      })
    );

    expect(anyigbaRepo.getParcelleByCode("OUI-0421")?.enLitige).toBe(true);

    // 2. Jugement de mainlevée
    const reqMainlevee = new Request("http://localhost:3000/api/v1/csaf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "MAINLEVEE",
        parcelleCode: "OUI-0421",
        magistratNom: "Juge Antoine Sossa",
      }),
    });

    const resMainlevee = await postCsaf(reqMainlevee);
    expect(resMainlevee.status).toBe(200);

    // 3. Vérification au cadastre : la parcelle est libérée
    expect(anyigbaRepo.getParcelleByCode("OUI-0421")?.enLitige).toBe(false);
  });

  it("doit enregistrer une ordonnance de gel en attachant les références du certificat municipal et de la quittance TrésorPay", async () => {
    const req = new Request("http://localhost:3000/api/v1/csaf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "GEL",
        parcelleCode: "OUI-0421",
        demandeurNom: "Collectivité Hounsou",
        motif: "Contestation d'évaluation municipale et de dévolution successorale",
        certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026-9315",
        quittanceTresorRef: "TRESOR-DGTCP-2026-56395",
      }),
    });

    const res = await postCsaf(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.certificatMairieRef).toBe("CERTIF-COMMUNE-OUI-0421-2026-9315");
    expect(json.data.quittanceTresorRef).toBe("TRESOR-DGTCP-2026-56395");

    // Vérifier dans le registre du greffe
    const listRes = await getCsaf();
    const listJson = await listRes.json();
    const litige = listJson.data.find((l: any) => l.parcelleCode === "OUI-0421");
    expect(litige).toBeDefined();
    expect(litige.certificatMairieRef).toBe("CERTIF-COMMUNE-OUI-0421-2026-9315");
    expect(litige.quittanceTresorRef).toBe("TRESOR-DGTCP-2026-56395");
  });
});

