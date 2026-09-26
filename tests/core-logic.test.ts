import { describe, it, expect, beforeEach } from "vitest";
import { anyigbaRepo } from "../src/repositories/index";
import { calculateDocumentHash, verifyDocumentIntegrity } from "../src/lib/hash";
import { getAudioTranslation } from "../src/lib/audio";
import { processInboundSms } from "../src/lib/channels";

describe("Anyigba — Règles Métier & Sécurité Foncier", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  it("doit trouver la parcelle fil conducteur OUI-0421 de la Famille Dossou", () => {
    const parcelle = anyigbaRepo.getParcelleByCode("OUI-0421");
    expect(parcelle).toBeDefined();
    expect(parcelle?.commune).toBe("Ouidah");
    expect(parcelle?.statutJuridique).toBe("COUTUMIER");
    expect(parcelle?.enVerrouMutation).toBe(false);
    expect(parcelle?.enLitige).toBe(false);
  });

  it("doit poser le verrou de mutation et bloquer formellement toute tentative de double vente concurrente", () => {
    // 1ère tentative légitime par Me Agbossou
    const res1 = anyigbaRepo.initiateMutation({
      parcelleCode: "OUI-0421",
      cedantNpi: "FICTIF-BEN-2026-0041",
      cedantNom: "Germain Dossou",
      cessionnaireNpi: "FICTIF-BEN-2026-0003",
      cessionnaireNom: "Koffi Mensah",
      notaireId: "Me Christian Agbossou",
      prixFcfa: 4500000,
    });

    expect(res1.success).toBe(true);
    expect(res1.mutation).toBeDefined();
    expect(res1.mutation?.statut).toBe("INITIEE_VERROUILLEE");
    expect(res1.mutation?.statutSequestre).toBe("FONDS_BLOQUES_SEQUESTRE");

    // La parcelle est maintenant verrouillée
    const parcelleLocked = anyigbaRepo.getParcelleByCode("OUI-0421");
    expect(parcelleLocked?.enVerrouMutation).toBe(true);

    // 2ème tentative concurrente frauduleuse par un autre acheteur/notaire
    const res2 = anyigbaRepo.initiateMutation({
      parcelleCode: "OUI-0421",
      cedantNpi: "FICTIF-BEN-2026-0041",
      cedantNom: "Germain Dossou",
      cessionnaireNpi: "FICTIF-BEN-2026-9999",
      cessionnaireNom: "Acheteur Frauduleux Concurrent",
      notaireId: "Me Inconnu",
      prixFcfa: 6000000,
    });

    // Échec obligatoire et blocage strict !
    expect(res2.success).toBe(false);
    expect(res2.error).toContain("PARCELLE_VERROUILLEE");
  });

  it("doit refuser toute mutation sur une parcelle sous gel conservatoire CSAF", () => {
    const res = anyigbaRepo.initiateMutation({
      parcelleCode: "LIT-ALL-005",
      cedantNpi: "FICTIF-BEN-2026-0777",
      cedantNom: "Gbénou",
      cessionnaireNpi: "FICTIF-BEN-2026-0003",
      cessionnaireNom: "Koffi Mensah",
      notaireId: "Me Agbossou",
      prixFcfa: 5000000,
    });

    expect(res.success).toBe(false);
    expect(res.error).toContain("PARCELLE_EN_LITIGE");
  });

  it("doit finaliser la mutation par l'ANDF, lever le verrou et débloquer les fonds du séquestre", () => {
    // Mutation existante CAL-0089
    const res = anyigbaRepo.finalizeMutationByAndf("MUT-2026-0089", "Mme Reine Houndété");
    expect(res.success).toBe(true);

    const parcelle = anyigbaRepo.getParcelleByCode("CAL-0089");
    expect(parcelle?.enVerrouMutation).toBe(false);
    expect(parcelle?.proprietaireNom).toBe("Aimé Houndégbé");

    const mut = anyigbaRepo.getAllMutations().find((m) => m.codeMutation === "MUT-2026-0089");
    expect(mut?.statut).toBe("VALIDEE_ANDF");
    expect(mut?.statutSequestre).toBe("LIBERE_VENDEUR");
  });

  it("doit calculer une empreinte SHA-256 et détecter instantanément toute falsification", () => {
    const data = "TITRE_FONCIER_OFFICIEL_ANDF_PARCELLE_104";
    const { hash, salt } = calculateDocumentHash(data);

    // Document authentique
    expect(verifyDocumentIntegrity(data, hash, salt)).toBe(true);

    // Document falsifié (ex: un nom changé)
    expect(verifyDocumentIntegrity(data + "_MODIFIE", hash, salt)).toBe(false);
  });

  it("doit fournir les traductions audio en Fongbe et Yoruba pour l'accessibilité", () => {
    const fonText = getAudioTranslation("parcelle_titre_foncier_valide", "fon");
    expect(fonText).toContain("Anyigba elɔ ɖó Titre Foncier");

    const yoText = getAudioTranslation("parcelle_en_litige", "yo");
    expect(yoText).toContain("Ilẹ̀ yìí wà nínú ẹjọ́");
  });

  it("doit répondre à la commande SMS VERIF avec traçabilité", () => {
    const response = processInboundSms("+229 97 00 00 00", "VERIF OUI-0421");
    expect(response).toContain("OUI-0421");
    expect(response).toContain("DOSSOU");
    expect(response).toContain("ELIGIBLE A L'ACHAT");
  });
});
