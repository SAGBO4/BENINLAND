import { describe, it, expect, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { anyigbaRepo } from "@/repositories/index";
import {
  getSituationDetailleeParcelle,
  getDocumentsOfficielsCitoyen,
} from "@/components/citoyen/citoyen-data";

describe("Espace Citoyen — Situation Détaillée & Coffre-fort Numérique des Actes", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  describe("1. Diagnostic et Situation Détaillée en Direct de la Parcelle OUI-0421", () => {
    it("doit fournir la situation foncière complète et certifiée de la parcelle de Germain Dossou", () => {
      const diag = getSituationDetailleeParcelle("OUI-0421");
      expect(diag).not.toBeNull();
      if (!diag) return;

      // 1. Statut Foncier
      expect(diag.parcelle.codeUnique).toBe("OUI-0421");
      expect(diag.parcelle.commune).toBe("Ouidah");
      expect(diag.parcelle.arrondissement).toBe("Pahou");
      expect(diag.parcelle.village).toBe("Hounhanmèdji");
      expect(diag.parcelle.superficieM2).toBe(1250);
      expect(diag.statutFoncier.statut).toBe("COUTUMIER");
      expect(diag.statutFoncier.titulaire).toContain("Germain Dossou");
      expect(diag.statutFoncier.titulaireNpi).toBe("FICTIF-BEN-2026-0041");
      expect(diag.statutFoncier.conforme).toBe(true);

      // 2. Situation Contentieuse CSAF
      expect(diag.situationCsaf.enLitige).toBe(false);
      expect(diag.situationCsaf.absenceLitigeGarantie).toBe(true);
      expect(diag.situationCsaf.nombreLitiges).toBe(0);
      expect(diag.situationCsaf.statutLabel).toContain("Libre de tout litige foncier");

      // 3. Situation Hypothécaire & Sûretés Bancaires
      expect(diag.situationHypothecaire.aHypotheque).toBe(false);
      expect(diag.situationHypothecaire.bienLibreEtDisponible).toBe(true);
      expect(diag.situationHypothecaire.montantTotalGarantieFcfa).toBe(0);
      expect(diag.situationHypothecaire.statutLabel).toContain("Aucune hypothèque");

      // 4. Situation Fiscale Trésor Public (DGTCP)
      expect(diag.situationFiscale.taxePayee).toBe(true);
      expect(diag.situationFiscale.quittanceRef).toBe("TRESOR-DGTCP-2026-88124");
      expect(diag.situationFiscale.montantTaxeFcfa).toBe(100000);
      expect(diag.situationFiscale.modePaiement).toBe("TRESORPAY");
      expect(diag.situationFiscale.statutLabel).toContain("TrésorPay DGTCP");

      // 5. Situation Technique & Bornage GPS
      expect(diag.situationTechnique.bornesCount).toBe(4);
      expect(diag.situationTechnique.georeferencementValide).toBe(true);
      expect(diag.situationTechnique.bornesGPS.length).toBe(4);
      expect(diag.situationTechnique.bornesGPS[0].lat).toBeCloseTo(6.365);
      expect(diag.situationTechnique.bornesGPS[0].lng).toBeCloseTo(2.0815);
      expect(diag.situationTechnique.geometreNom).toContain("Mamadou Bio");

      // 6. Verrou Notarial d'Opposabilité
      expect(diag.verrouMutation.actif).toBe(false);
      expect(diag.verrouMutation.statutLabel).toContain("libre de toute transaction");
    });

    it("doit refléter immédiatement un gel conservatoire CSAF si la parcelle est mise en litige", () => {
      // Inscription d'un gel CSAF
      anyigbaRepo.inscrireGelConservatoire({
        parcelleCode: "OUI-0421",
        demandeurNom: "Tiers Contestataire",
        demandeurNpi: "FICTIF-BEN-2026-9999",
        motif: "Revendication successorale",
      });

      const diag = getSituationDetailleeParcelle("OUI-0421");
      expect(diag?.situationCsaf.enLitige).toBe(true);
      expect(diag?.situationCsaf.absenceLitigeGarantie).toBe(false);
      expect(diag?.situationCsaf.nombreLitiges).toBe(1);
      expect(diag?.situationCsaf.statutLabel).toContain("Gel Conservatoire actif");
    });

    it("doit refléter immédiatement une hypothèque bancaire de Rang 1 si elle est inscrite", () => {
      anyigbaRepo.inscrireHypotheque({
        parcelleCode: "OUI-0421",
        demandeurNom: "Germain Dossou",
        demandeurNpi: "FICTIF-BEN-2026-0041",
        banqueNom: "BOA Bénin",
        banqueNpiAgent: "FICTIF-BEN-2026-0700",
        montantCreditFcfa: 2500000,
      });

      const diag = getSituationDetailleeParcelle("OUI-0421");
      expect(diag?.situationHypothecaire.aHypotheque).toBe(true);
      expect(diag?.situationHypothecaire.bienLibreEtDisponible).toBe(false);
      expect(diag?.situationHypothecaire.montantTotalGarantieFcfa).toBe(2500000);
      expect(diag?.situationHypothecaire.statutLabel).toContain("BOA Bénin");
    });
  });

  describe("2. Coffre-fort Numérique des Actes Officiels de Germain Dossou", () => {
    it("doit retourner l'ensemble des 6 documents fonciers officiels rattachés à OUI-0421", () => {
      const docs = getDocumentsOfficielsCitoyen("FICTIF-BEN-2026-0041", ["OUI-0421"]);
      expect(docs.length).toBeGreaterThanOrEqual(6);

      const references = docs.map((d) => d.referenceOfficielle);

      // 1. Certificat d'Évaluation Communale
      expect(references).toContain("CERTIF-COMMUNE-OUI-0421-2026");
      const certif = docs.find((d) => d.referenceOfficielle === "CERTIF-COMMUNE-OUI-0421-2026");
      expect(certif?.type).toBe("CERTIFICAT_COMMUNAL");
      expect(certif?.quittanceTresorRef).toBe("TRESOR-DGTCP-2026-88124");
      expect(certif?.montantFcfa).toBe(4500000);
      expect(certif?.autoriteEmettrice).toContain("Ouidah");

      // 2. Quittance TrésorPay DGTCP
      expect(references).toContain("TRESOR-DGTCP-2026-88124");
      const quittance = docs.find((d) => d.referenceOfficielle === "TRESOR-DGTCP-2026-88124");
      expect(quittance?.type).toBe("QUITTANCE_TRESOR");
      expect(quittance?.montantFcfa).toBe(100000);
      expect(quittance?.autoriteEmettrice).toContain("DGTCP");

      // 3. Attestation de détention coutumière
      expect(references).toContain("ATT-REC-OUIDAH-PAHOU-2024-081");
      const att = docs.find((d) => d.referenceOfficielle === "ATT-REC-OUIDAH-PAHOU-2024-081");
      expect(att?.type).toBe("TITRE_CADASTRAL");
      expect(att?.signataireNom).toContain("Maire de Ouidah");

      // 4. Procès-Verbal de bornage contradictoire
      expect(references).toContain("PV-BORNAGE-GPS-2026-0421");
      const pv = docs.find((d) => d.referenceOfficielle === "PV-BORNAGE-GPS-2026-0421");
      expect(pv?.type).toBe("PV_BORNAGE");
      expect(pv?.signataireNom).toContain("Mamadou Bio");

      // 5. Convention sous seing privé assistée
      expect(references).toContain("CONV-VIL-2026-042");
      const conv = docs.find((d) => d.referenceOfficielle === "CONV-VIL-2026-042");
      expect(conv?.type).toBe("CONVENTION");
      expect(conv?.montantFcfa).toBe(4500000);
      expect(conv?.signataireNom).toContain("Germain Dossou");

      // 6. Carnet de Famille Foncier scellé
      expect(references).toContain("CARNET-FAMILLE-OUI-0421");
      const carnet = docs.find((d) => d.referenceOfficielle === "CARNET-FAMILLE-OUI-0421");
      expect(carnet?.type).toBe("CARNET_FONCIER");
      expect(carnet?.signataireNom).toContain("Germain Dossou");
    });

    it("doit vérifier que chaque document possède une empreinte cryptographique SHA-256 valide et une preuve OTS", () => {
      const docs = getDocumentsOfficielsCitoyen("FICTIF-BEN-2026-0041", ["OUI-0421"]);

      for (const doc of docs) {
        expect(doc.hashSha256).toBeDefined();
        expect(doc.hashSha256.length).toBeGreaterThanOrEqual(16);
        expect(doc.otsProof).toBeDefined();
        expect(doc.otsProof.startsWith("OTS-BTC-")).toBe(true);
        expect(doc.txBlockchainId).toBeDefined();
        expect(doc.baseLegale).toMatch(/Loi|Code/);
        expect(doc.parcelleCode).toBe("OUI-0421");
      }
    });
  });

  describe("3. Conformité Réglementaire et Graphique du Visualiseur d'Actes Officiels (DocumentViewerModal)", () => {
    const modalPath = path.resolve(__dirname, "../src/components/citoyen/DocumentViewerModal.tsx");
    const content = fs.readFileSync(modalPath, "utf-8");

    it("doit respecter le format feuille A4 réglementaire avec double filet et filigrane officiel", () => {
      // Format A4 et cadre double filet
      expect(content).toContain("max-w-[820px]");
      expect(content).toContain("border-2 border-black");
      expect(content).toContain("border border-black");
      expect(content).toContain("RÉPUBLIQUE DU BÉNIN");
      expect(content).toContain("LIVRE FONCIER NATIONAL &bull; ACTE SCELLÉ");
      expect(content).toContain("print:p-0 print:border-none print:shadow-none");
      expect(content).toContain("print:hidden");
    });

    it("doit intégrer les Armoiries officielles et la devise républicaine", () => {
      expect(content).toContain('src="/armoiries-benin.png"');
      expect(content).toContain("Armoiries Officielles de la République du Bénin");
      expect(content).toContain("Fraternité &bull; Justice &bull; Travail");
    });

    it("doit afficher les en-têtes ministériels compétents selon le type d'acte officiel", () => {
      // Certificat communal (Ouidah)
      expect(content).toContain("DÉPARTEMENT DE L&apos;ATLANTIQUE &bull; COMMUNE DE OUIDAH");
      expect(content).toContain("DIRECTION DES AFFAIRES DOMANIALES, DE L&apos;URBANISME ET DU CADASTRE");

      // Quittance Trésor (DGTCP / CUT)
      expect(content).toContain("MINISTÈRE DE L&apos;ÉCONOMIE ET DES FINANCES (MEF)");
      expect(content).toContain("DIRECTION GÉNÉRALE DU TRÉSOR ET DE LA COMPTABILITÉ PUBLIQUE (DGTCP)");
      expect(content).toContain("COMPTE UNIQUE DU TRÉSOR (CUT)");

      // PV de bornage
      expect(content).toContain("MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS (MCVDD)");
      expect(content).toContain("DIRECTION DE LA CARTOGRAPHIE ET DU CADASTRE &bull; ORDRE DES GÉOMÈTRES-EXPERTS");

      // Titre cadastral ANDF
      expect(content).toContain("AGENCE NATIONALE DU DOMAINE ET DU FONCIER (ANDF)");

      // Carnet foncier CSAF
      expect(content).toContain("COUR SPÉCIALE DES AFFAIRES FONCIÈRES (CSAF) &bull; LIVRE FONCIER NATIONAL");
    });

    it("doit intégrer le cachet circulaire régalien officiel à l'encre bleue républicaine", () => {
      expect(content).toContain("#1e3a8a");
      expect(content).toContain("SCEAU OFFICIEL");
      expect(content).toContain("ADMINISTRATION FONCIÈRE");
      expect(content).toContain("Cachet Officiel Régalien &bull; République du Bénin");
    });

    it("doit intégrer le cartouche de scellement cryptographique avec QRCodeSVG et OpenTimestamps", () => {
      expect(content).toContain("Scellement Cryptographique &bull; Inviolabilité BéninChain");
      expect(content).toContain("QRCodeSVG");
      expect(content).toContain("level=\"H\"");
      expect(content).toContain("Empreinte SHA-256");
      expect(content).toContain("Preuve OpenTimestamps");
      expect(content).toContain("Flash Vérification");
    });
  });
});
