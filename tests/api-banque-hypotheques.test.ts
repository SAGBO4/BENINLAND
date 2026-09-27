import { describe, it, expect, beforeEach } from "vitest";
import { GET as getVerifierGarantie, POST as postVerifierGarantie } from "@/app/api/v1/banque/verifier-garantie/route";
import { GET as getHypotheques, POST as postHypotheque } from "@/app/api/v1/banque/hypotheques/route";
import { anyigbaRepo } from "@/repositories/index";

describe("Portail Bancaire & Guichet des Sûretés Réelles (/api/v1/banque)", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("Vérification de Disponibilité & Titularité (/api/v1/banque/verifier-garantie)", () => {
    it("doit refuser une requête sans paramètre de recherche", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/verifier-garantie?query=");
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain("Veuillez renseigner un code");
    });

    it("doit renvoyer 404 pour une parcelle inexistante dans le cadastre", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/verifier-garantie?query=PARCELLE-INCONNUE-999");
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.success).toBe(false);
      expect(json.error).toContain("introuvable");
    });

    it("doit vérifier une parcelle avec Certificat Municipal validé et taxes TrésorPay payées (OUI-0421)", async () => {
      const req = new Request(
        "http://localhost:3000/api/v1/banque/verifier-garantie?query=OUI-0421&demandeurNpi=FICTIF-BEN-2026-0041&demandeurNom=Germain%20Dossou"
      );
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.parcelle.codeUnique).toBe("OUI-0421");
      expect(json.data.certificatMunicipal).toBeDefined();
      expect(json.data.certificatMunicipal.statutPaiement).toBe("PAYE_TRESOR_PUBLIC");
      expect(json.data.certificatMunicipal.quittanceTresorRef).toContain("TRESOR-DGTCP");
      expect(json.data.certificatMunicipal.prixFixeFcfa).toBe(4500000);
      expect(json.data.certificatMunicipal.otsProof).toContain("OTS-BTC-MAIRIE");

      // Titularité conforme
      expect(json.data.titularite.conforme).toBe(true);
      expect(json.data.titularite.message).toContain("Titularité certifiée conforme");

      // Ratios prudentiels BCEAO
      expect(json.data.prudence.valeurHomologueeFcfa).toBe(4500000);
      expect(json.data.prudence.ratioLtvMax).toBe(0.70);
      expect(json.data.prudence.capaciteHypothecaireMaxFcfa).toBe(3150000); // 70% de 4.5M
      expect(json.data.prudence.eligibleCredit).toBe(true);
    });

    it("doit détecter et bloquer une non-conformité de titularité si le demandeur n'est pas le titulaire", async () => {
      const req = new Request(
        "http://localhost:3000/api/v1/banque/verifier-garantie?query=OUI-0421&demandeurNpi=FICTIF-BEN-2026-0003&demandeurNom=Koffi%20Mensah"
      );
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.titularite.conforme).toBe(false);
      expect(json.data.titularite.message).toContain("Non-conformité de titularité foncière");
      expect(json.data.prudence.eligibleCredit).toBe(false);
      expect(json.data.prudence.blocageMotif).toContain("Défaut de titularité");
    });

    it("doit identifier directement par le code de Certificat Municipal (CERTIF-COMMUNE-OUI-0421-2026)", async () => {
      const req = new Request(
        "http://localhost:3000/api/v1/banque/verifier-garantie?query=CERTIF-COMMUNE-OUI-0421-2026"
      );
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.parcelle.codeUnique).toBe("OUI-0421");
      expect(json.data.certificatMunicipal.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026");
    });

    it("doit bloquer l'éligibilité pour une parcelle sous verrou de mutation (CAL-0089)", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/verifier-garantie?query=CAL-0089");
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.parcelle.enVerrouMutation).toBe(true);
      expect(json.data.prudence.eligibleCredit).toBe(false);
      expect(json.data.prudence.blocageMotif).toContain("Mutation notariale en cours");
    });
  });

  describe("Inscription d'Hypothèque de Rang 1 (/api/v1/banque/hypotheques)", () => {
    it("doit inscrire avec succès une hypothèque de Rang 1 scellée sur blockchain", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/hypotheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          demandeurNom: "Germain Dossou",
          demandeurNpi: "FICTIF-BEN-2026-0041",
          banqueNom: "Banque Nationale du Bénin (BNB)",
          banqueNpiAgent: "FICTIF-BEN-2026-0700",
          montantCreditFcfa: 2500000,
          valeurGarantieFcfa: 3150000,
          certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
        }),
      });

      const res = await postHypotheque(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.codeHypotheque).toContain("HYP-R1-OUI-0421");
      expect(json.data.rang).toBe(1);
      expect(json.data.statut).toBe("INSCRITE_RANG_1");
      expect(json.data.hashSha256).toMatch(/^0x[a-f0-9]{40,64}$/);
      expect(json.data.otsProof).toContain("OTS-BTC-HYP-OUI-0421");

      // Vérification de la persistance via GET
      const getReq = new Request("http://localhost:3000/api/v1/banque/hypotheques?parcelle=OUI-0421");
      const getRes = await getHypotheques(getReq);
      const getJson = await getRes.json();

      expect(getRes.status).toBe(200);
      expect(getJson.count).toBe(1);
      expect(getJson.data[0].codeHypotheque).toBe(json.data.codeHypotheque);
    });

    it("doit interdire une seconde hypothèque de Rang 1 sur une même parcelle déjà grevée", async () => {
      // Inscription première hypothèque
      await anyigbaRepo.inscrireHypotheque({
        parcelleCode: "OUI-0421",
        demandeurNom: "Germain Dossou",
        demandeurNpi: "FICTIF-BEN-2026-0041",
        banqueNom: "Banque Nationale du Bénin (BNB)",
        banqueNpiAgent: "FICTIF-BEN-2026-0700",
        montantCreditFcfa: 2000000,
      });

      // Tentative de 2ème inscription
      const req = new Request("http://localhost:3000/api/v1/banque/hypotheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          demandeurNom: "Germain Dossou",
          demandeurNpi: "FICTIF-BEN-2026-0041",
          banqueNom: "Société Générale Bénin",
          banqueNpiAgent: "FICTIF-BEN-2026-0888",
          montantCreditFcfa: 1500000,
        }),
      });

      const res = await postHypotheque(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.success).toBe(false);
      expect(json.error).toContain("HYPOTHEQUE_EXISTANTE");
    });

    it("doit refuser l'inscription sur une parcelle verrouillée pour mutation", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/hypotheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "CAL-0089",
          demandeurNom: "Koffi Mensah",
          demandeurNpi: "FICTIF-BEN-2026-0003",
          banqueNom: "Banque Nationale du Bénin (BNB)",
          banqueNpiAgent: "FICTIF-BEN-2026-0700",
          montantCreditFcfa: 3000000,
        }),
      });

      const res = await postHypotheque(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.success).toBe(false);
      expect(json.error).toContain("MUTATION_EN_COURS");
    });

    it("doit refuser l'inscription directe par API si le demandeur n'est pas le titulaire légitime (DEFAUT_TITULARITE)", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/hypotheques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelleCode: "OUI-0421",
          demandeurNom: "Koffi Mensah",
          demandeurNpi: "FICTIF-BEN-2026-0003",
          banqueNom: "Banque Nationale du Bénin (BNB)",
          banqueNpiAgent: "FICTIF-BEN-2026-0700",
          montantCreditFcfa: 2500000,
        }),
      });

      const res = await postHypotheque(req);
      const json = await res.json();

      expect(res.status).toBe(422);
      expect(json.success).toBe(false);
      expect(json.error).toContain("DEFAUT_TITULARITE");
    });

    it("doit vérifier OUI-0104 avec son Certificat Municipal Mairie et taxes acquittées (Famille Houessou)", async () => {
      const req = new Request(
        "http://localhost:3000/api/v1/banque/verifier-garantie?query=OUI-0104&demandeurNpi=FICTIF-BEN-2026-0004&demandeurNom=Famille%20Houessou"
      );
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.parcelle.codeUnique).toBe("OUI-0104");
      expect(json.data.certificatMunicipal).toBeDefined();
      expect(json.data.certificatMunicipal.statutPaiement).toBe("PAYE_TRESOR_PUBLIC");
      expect(json.data.certificatMunicipal.quittanceTresorRef).toContain("TRESOR-DGTCP");
      expect(json.data.certificatMunicipal.prixFixeFcfa).toBe(48000000);
      expect(json.data.titularite.conforme).toBe(true);
      expect(json.data.prudence.eligibleCredit).toBe(true);
      expect(json.data.prudence.capaciteHypothecaireMaxFcfa).toBe(33600000); // 70% de 48M
    });

    it("doit bloquer l'éligibilité au crédit si aucun demandeur n'est renseigné", async () => {
      const req = new Request("http://localhost:3000/api/v1/banque/verifier-garantie?query=OUI-0421");
      const res = await getVerifierGarantie(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.titularite.conforme).toBe(false);
      expect(json.data.prudence.eligibleCredit).toBe(false);
      expect(json.data.prudence.blocageMotif).toContain("Demandeur de crédit non renseigné");
    });

    it("doit permettre la vérification publique de l'hypothèque inscrite via /api/v1/verification/[code]", async () => {
      const { GET: getVerification } = await import("@/app/api/v1/verification/[code]/route");

      const hyp = anyigbaRepo.inscrireHypotheque({
        parcelleCode: "OUI-0421",
        demandeurNom: "Germain Dossou",
        demandeurNpi: "FICTIF-BEN-2026-0041",
        banqueNom: "Banque Nationale du Bénin (BNB)",
        banqueNpiAgent: "FICTIF-BEN-2026-0700",
        montantCreditFcfa: 2500000,
      });

      const verifReq = new Request(`http://localhost:3000/api/v1/verification/${hyp.codeHypotheque}`);
      const verifRes = await getVerification(verifReq, {
        params: Promise.resolve({ code: hyp.codeHypotheque }),
      });
      const verifJson = await verifRes.json();

      expect(verifRes.status).toBe(200);
      expect(verifJson.success).toBe(true);
      expect(verifJson.type).toBe("HYPOTHEQUE_RANG_1");
      expect(verifJson.data.codeHypotheque).toBe(hyp.codeHypotheque);
      expect(verifJson.data.parcelleCode).toBe("OUI-0421");
      expect(verifJson.data.montantCreditFcfa).toBe(2500000);
      expect(verifJson.data.otsProof).toContain("OTS-BTC-HYP");
    });
  });
});
