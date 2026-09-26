import { describe, it, expect } from "vitest";
import { calculateDocumentHash, verifyDocumentIntegrity, generateBlockchainProof } from "@/lib/hash";
import { VOCAL_PHRASES, getAudioTranslation } from "@/lib/audio";
import { maskIdentity, maskTelephone, formatFcfa } from "@/lib/utils";

describe("Sécurité Cryptographique, Audio Multilingue & Protection des Données", () => {
  describe("Module Cryptographique SHA-256 & Ancrage Blockchain (hash.ts)", () => {
    it("doit produire une empreinte SHA-256 déterministe avec le même sel", () => {
      const data = "TITRE_FONCIER_NUMERO_104_ANDF_BENIN";
      const fixedSalt = "0123456789abcdef";

      const res1 = calculateDocumentHash(data, fixedSalt);
      const res2 = calculateDocumentHash(data, fixedSalt);

      expect(res1.hash).toBe(res2.hash);
      expect(res1.salt).toBe(fixedSalt);
      expect(res1.hash).toHaveLength(64); // SHA-256 hex = 64 caractères
    });

    it("doit générer un sel aléatoire distinct par défaut", () => {
      const data = "MEME_CONTENU_DE_BASE";
      const res1 = calculateDocumentHash(data);
      const res2 = calculateDocumentHash(data);

      expect(res1.salt).not.toBe(res2.salt);
      expect(res1.hash).not.toBe(res2.hash);
    });

    it("doit valider l'intégrité du document authentique et rejeter toute falsification même minime", () => {
      const originalData = { parcelle: "OUI-0421", proprietaire: "Germain Dossou", montant: 4500000 };
      const { hash, salt } = calculateDocumentHash(originalData);

      // Intégrité vérifiée
      expect(verifyDocumentIntegrity(originalData, hash, salt)).toBe(true);

      // Tentative de falsification d'un centime ou d'un caractère
      const falsifiedData = { parcelle: "OUI-0421", proprietaire: "Germain Dossou", montant: 4500001 };
      expect(verifyDocumentIntegrity(falsifiedData, hash, salt)).toBe(false);

      const falsifiedOwner = { parcelle: "OUI-0421", proprietaire: "Usurpateur Fraudeur", montant: 4500000 };
      expect(verifyDocumentIntegrity(falsifiedOwner, hash, salt)).toBe(false);
    });

    it("doit générer une preuve d'ancrage BéninChain et OpenTimestamps valide", () => {
      const fakeHash = "a1b2c3d4e5f678901234567890abcdefa1b2c3d4e5f678901234567890abcdef";
      const proof = generateBlockchainProof(fakeHash);

      expect(proof.txId).toMatch(/^0xbc[0-9a-f]{16}8899aabbccddeeff$/);
      expect(proof.blockNumber).toBeGreaterThanOrEqual(421890);
      expect(proof.otsProof).toContain("OTS-BTC-SEAL-A1B2C3D4E5F67890");
      expect(proof.timestamp).toBeDefined();
    });
  });

  describe("Accessibilité Vocale Multilingue — Fongbe, Yoruba & Français (audio.ts)", () => {
    const requiredKeys = [
      "parcelle_titre_foncier_valide",
      "parcelle_en_litige",
      "parcelle_verrouillee",
      "convention_assistee_validee",
    ];

    it("doit disposer de traductions non vides dans les trois langues officielles/nationales pour toutes les phrases", () => {
      for (const key of requiredKeys) {
        const phrase = VOCAL_PHRASES[key];
        expect(phrase, `Phrase ${key} manquante dans VOCAL_PHRASES`).toBeDefined();
        expect(phrase.fr.length, `Français manquant pour ${key}`).toBeGreaterThan(5);
        expect(phrase.fon.length, `Fongbe manquant pour ${key}`).toBeGreaterThan(5);
        expect(phrase.yo.length, `Yoruba manquant pour ${key}`).toBeGreaterThan(5);
      }
    });

    it("doit fournir les bons textes par getAudioTranslation", () => {
      const fonText = getAudioTranslation("parcelle_en_litige", "fon");
      expect(fonText).toContain("CSAF");

      const yoText = getAudioTranslation("parcelle_titre_foncier_valide", "yo");
      expect(yoText).toContain("ANDF");

      const frText = getAudioTranslation("convention_assistee_validee", "fr");
      expect(frText).toContain("Chef de Village");
    });

    it("doit se rabattre sur le français si la langue demandée est inconnue", () => {
      // @ts-expect-error test de résilience
      const fallback = getAudioTranslation("parcelle_verrouillee", "inconnu");
      expect(fallback).toContain("notariée");
    });

    it("doit retourner une chaîne vide si la clé n'existe pas", () => {
      expect(getAudioTranslation("cle_inexistante_999", "fon")).toBe("");
    });
  });

  describe("Protection de la Vie Privée & Utilitaires (utils.ts)", () => {
    it("doit masquer l'identité du propriétaire conformément aux exigences ANIP", () => {
      // Nom composé
      const masked1 = maskIdentity("Germain Dossou");
      expect(masked1).toBe("Germain D****u");

      // Nom complexe avec famille
      const masked2 = maskIdentity("Germain Dossou (Famille Dossou)");
      expect(masked2).toBe("Germain D****u (******e D*****)");

      // Nom court (<= 2 caractères)
      const maskedShort = maskIdentity("Ali Ba");
      expect(maskedShort).toBe("Ali B*");

      // Cas limite vide
      expect(maskIdentity("")).toBe("");
    });

    it("doit masquer les numéros de téléphone pour préserver l'anonymat citoyen", () => {
      const masked = maskTelephone("+229 97 00 12 34");
      expect(masked).toBe("+229 ••••34");
      expect(masked.length).toBeLessThan("+229 97 00 12 34".length);

      // Numéro trop court non altéré
      expect(maskTelephone("12345")).toBe("12345");
    });

    it("doit formater les montants en FCFA selon la typographie ouest-africaine", () => {
      const formatted = formatFcfa(4500000);
      expect(formatted).toContain("FCFA");
      expect(formatted).toMatch(/4[\s\u202F]500[\s\u202F]000/);
    });
  });
});
