import { anyigbaRepo, ActeRecord, CertificatCommuneRecord, ConventionRecord, HypothequeRecord, LitigeRecord } from "@/repositories/index";
import { SeedParcelle } from "@/db/seed/data";

export interface CitoyenDocument {
  id: string;
  referenceOfficielle: string;
  titre: string;
  type: "CERTIFICAT_COMMUNAL" | "TITRE_CADASTRAL" | "QUITTANCE_TRESOR" | "PV_BORNAGE" | "CONVENTION" | "CARNET_FONCIER";
  typeLabel: string;
  parcelleCode: string;
  dateEmission: string;
  autoriteEmettrice: string;
  signataireNom: string;
  signataireQualite: string;
  montantFcfa?: number;
  quittanceTresorRef?: string;
  hashSha256: string;
  otsProof: string;
  txBlockchainId: string;
  baseLegale: string;
  description: string;
  details?: Record<string, any>;
}

export interface SituationParcelleDiagnostic {
  parcelle: SeedParcelle;
  statutFoncier: {
    statut: "COUTUMIER" | "TITRE_FONCIER" | "CPF" | "DOMAINE_PUBLIC";
    label: string;
    titulaire: string;
    titulaireNpi: string;
    iuf: string;
    tokenBeninChainId: string;
    conforme: boolean;
  };
  situationCsaf: {
    enLitige: boolean;
    statutLabel: string;
    nombreLitiges: number;
    litiges: LitigeRecord[];
    absenceLitigeGarantie: boolean;
  };
  situationHypothecaire: {
    hypotheques: HypothequeRecord[];
    aHypotheque: boolean;
    statutLabel: string;
    montantTotalGarantieFcfa: number;
    bienLibreEtDisponible: boolean;
  };
  situationFiscale: {
    certificat?: CertificatCommuneRecord;
    taxePayee: boolean;
    quittanceRef: string;
    montantTaxeFcfa: number;
    modePaiement: string;
    statutLabel: string;
  };
  situationTechnique: {
    bornesCount: number;
    bornesGPS: Array<{ id: string; nom: string; lat: number; lng: number }>;
    superficieCertifieeM2: number;
    geometreNom: string;
    pvBornageRef: string;
    georeferencementValide: boolean;
  };
  verrouMutation: {
    actif: boolean;
    statutLabel: string;
  };
}

/**
 * Extrait le diagnostic en direct pour une parcelle donnée à partir du repository
 */
export function getSituationDetailleeParcelle(parcelleCode: string): SituationParcelleDiagnostic | null {
  const parcelle = anyigbaRepo.getParcelleByCode(parcelleCode);
  if (!parcelle) return null;

  const litiges = anyigbaRepo.getLitigesByParcelle(parcelleCode);
  const activeLitiges = litiges.filter((l) => l.statut === "GEL_CONSERVATOIRE");
  const enLitige = parcelle.enLitige || activeLitiges.length > 0;

  const hypotheques = anyigbaRepo.getHypothequesByParcelle(parcelleCode);
  const activeHyp = hypotheques.filter((h) => h.statut === "INSCRITE_RANG_1");
  const montantGarantie = activeHyp.reduce((sum, h) => sum + (h.montantCreditFcfa || 0), 0);

  const certif = anyigbaRepo.getCertificatCommuneByParcelle(parcelleCode);

  // Bornes GPS issues du polygone GeoJSON
  const coords = parcelle.polygoneGeojson?.coordinates?.[0] || [];
  const bornesGPS = coords.slice(0, 4).map((pt, idx) => ({
    id: `B${idx + 1}`,
    nom: `Borne B${idx + 1} normalisée scellée`,
    lat: pt[1],
    lng: pt[0],
  }));

  const statutLabelMap: Record<string, string> = {
    COUTUMIER: "Droit Coutumier Reconnu (Attestation Cadastrale)",
    TITRE_FONCIER: "Titre Foncier Immatriculé (Livre Foncier Définitif)",
    CPF: "Certificat de Propriété Foncière (CPF ANDF)",
    DOMAINE_PUBLIC: "Domaine Public de l'État",
  };

  return {
    parcelle,
    statutFoncier: {
      statut: parcelle.statutJuridique,
      label: statutLabelMap[parcelle.statutJuridique] || parcelle.statutJuridique,
      titulaire: parcelle.proprietaireNom,
      titulaireNpi: parcelle.proprietaireNpi,
      iuf: parcelle.codeUnique,
      tokenBeninChainId: parcelle.tokenBeninChainId || `TKN-${parcelle.codeUnique}`,
      conforme: true,
    },
    situationCsaf: {
      enLitige,
      statutLabel: enLitige
        ? "Instance contentieuse CSAF ouverte (Gel Conservatoire actif)"
        : "Libre de tout litige foncier (Attestation d'absence d'instance CSAF garantie)",
      nombreLitiges: activeLitiges.length,
      litiges: activeLitiges,
      absenceLitigeGarantie: !enLitige,
    },
    situationHypothecaire: {
      hypotheques: activeHyp,
      aHypotheque: activeHyp.length > 0,
      statutLabel:
        activeHyp.length > 0
          ? `Hypothèque inscrite de Rang 1 (${activeHyp[0].banqueNom})`
          : "Aucune hypothèque ni gage inscrit (Bien entièrement libre et disponible)",
      montantTotalGarantieFcfa: montantGarantie,
      bienLibreEtDisponible: activeHyp.length === 0,
    },
    situationFiscale: {
      certificat: certif,
      taxePayee: Boolean(certif && certif.statutPaiement === "PAYE_TRESOR_PUBLIC"),
      quittanceRef: certif?.quittanceTresorRef || "TRESOR-DGTCP-2026-88124",
      montantTaxeFcfa: certif?.taxeCalculeeFcfa || 100000,
      modePaiement: certif?.modePaiement || "TRESORPAY",
      statutLabel: "Taxe sur plus-value communale acquittée à 100% sur TrésorPay DGTCP",
    },
    situationTechnique: {
      bornesCount: bornesGPS.length || 4,
      bornesGPS: bornesGPS.length > 0 ? bornesGPS : [
        { id: "B1", nom: "Borne B1 Nord-Ouest", lat: 6.365, lng: 2.0815 },
        { id: "B2", nom: "Borne B2 Nord-Est", lat: 6.365, lng: 2.083 },
        { id: "B3", nom: "Borne B3 Sud-Est", lat: 6.3665, lng: 2.083 },
        { id: "B4", nom: "Borne B4 Sud-Ouest", lat: 6.3665, lng: 2.0815 },
      ],
      superficieCertifieeM2: parcelle.superficieM2,
      geometreNom: "Mamadou Bio (Agent Foncier Assermenté & Géomètre Cadastre)",
      pvBornageRef: `PV-BORNAGE-GPS-2026-${parcelle.codeUnique.replace(/[^a-zA-Z0-9]/g, "")}`,
      georeferencementValide: true,
    },
    verrouMutation: {
      actif: Boolean(parcelle.enVerrouMutation),
      statutLabel: parcelle.enVerrouMutation
        ? "Verrou notarial actif (Procédure de mutation en cours - Alerte anti-double-vente)"
        : "Verrou levé : Bien libre de toute transaction concurrente",
    },
  };
}

/**
 * Retourne l'ensemble des documents officiels rattachés aux parcelles du citoyen
 */
export function getDocumentsOfficielsCitoyen(userNpi: string, parcelleCodes: string[]): CitoyenDocument[] {
  const documents: CitoyenDocument[] = [];
  const targetCodes = new Set(parcelleCodes.map((c) => c.toUpperCase()));
  if (targetCodes.size === 0) {
    targetCodes.add("OUI-0421");
  }

  // 1. Certificats municipaux d'évaluation
  const allCertifs = anyigbaRepo.getAllCertificatsCommune();
  for (const cert of allCertifs) {
    if (targetCodes.has(cert.codeParcelle.toUpperCase())) {
      // Certificat communal
      documents.push({
        id: cert.id,
        referenceOfficielle: cert.codeCertificat,
        titre: "Certificat Municipal d'Évaluation et de Fixation Légale du Prix Foncier",
        type: "CERTIFICAT_COMMUNAL",
        typeLabel: "Certificat d'Évaluation Communale",
        parcelleCode: cert.codeParcelle,
        dateEmission: cert.dateEmission,
        autoriteEmettrice: `Mairie de la Commune de ${cert.commune} • Direction des Affaires Domaniales`,
        signataireNom: cert.agentMairieNom,
        signataireQualite: "Chef Service Urbanisme, Domanialité et Fiscalité",
        montantFcfa: cert.prixFixeFcfa,
        quittanceTresorRef: cert.quittanceTresorRef,
        hashSha256: cert.hashSha256,
        otsProof: cert.otsProof,
        txBlockchainId: cert.txBlockchainId,
        baseLegale: "Loi n° 2013-01 modifiée par la Loi n° 2017-15 portant Code Foncier et Domanial (Articles 142 & 143)",
        description: `Certificat d'évaluation légale et de fixation du prix opposable à ${cert.prixFixeFcfa.toLocaleString()} FCFA pour la parcelle ${cert.codeParcelle}. Taxe sur plus-value de ${cert.taxeCalculeeFcfa.toLocaleString()} FCFA acquittée.`,
        details: {
          prixAcquisitionInitial: cert.prixAcquisitionInitial,
          prixFixeFcfa: cert.prixFixeFcfa,
          travauxDeductibles: cert.travauxDeductibles,
          plusValueNette: cert.plusValueNette,
          taxeCalculeeFcfa: cert.taxeCalculeeFcfa,
          quittanceTresorRef: cert.quittanceTresorRef,
          modePaiement: cert.modePaiement,
        },
      });

      // 2. Quittance TrésorPay DGTCP rattachée
      documents.push({
        id: `QUIT-${cert.quittanceTresorRef}`,
        referenceOfficielle: cert.quittanceTresorRef,
        titre: "Quittance Officielle de Règlement Sécurisé — Trésor Public (DGTCP)",
        type: "QUITTANCE_TRESOR",
        typeLabel: "Quittance TrésorPay DGTCP",
        parcelleCode: cert.codeParcelle,
        dateEmission: cert.dateEmission,
        autoriteEmettrice: "Direction Générale du Trésor et de la Comptabilité Publique (DGTCP / MEF)",
        signataireNom: "Receveur Municipal de la Commune de Ouidah",
        signataireQualite: "Comptable Public Principal du Trésor",
        montantFcfa: cert.taxeCalculeeFcfa,
        quittanceTresorRef: cert.quittanceTresorRef,
        hashSha256: "0x5b8101a938c4b281f661a384029ce3f5c9e2b1840ab3d90f234acfe7b11d9482",
        otsProof: `OTS-BTC-DGTCP-${cert.quittanceTresorRef.replace(/[^a-zA-Z0-9]/g, "")}`,
        txBlockchainId: "0xbc5b8101a938c4b281f661a384029ce3f5c9e2b1",
        baseLegale: "Loi de Finances, Code Général des Impôts & Décret n° 2020-041 portant Compte Unique du Trésor (CUT)",
        description: `Quittance libératoire attestant du versement intégral de la somme de ${cert.taxeCalculeeFcfa.toLocaleString()} FCFA au Trésor Public pour l'opération foncière sur la parcelle ${cert.codeParcelle}.`,
        details: {
          quittanceNumero: cert.quittanceTresorRef,
          montantVerseFcfa: cert.taxeCalculeeFcfa,
          guichet: "Plateforme TrésorPay Bénin (DGTCP)",
          compteTresor: "Compte Unique du Trésor Béninois (BCEAO - CUT)",
          statut: "ACQUITTÉ ET ENCAISSÉ",
        },
      });
    }
  }

  // 3. Actes officiels (Attestations coutumières, PV de bornage, Carnet familial)
  const allActes = anyigbaRepo.getAllActes();
  for (const acte of allActes) {
    if (targetCodes.has(acte.parcelleCode.toUpperCase())) {
      if (acte.typeActe === "ATTESTATION_DETENTION_COUTUMIERE") {
        documents.push({
          id: acte.id,
          referenceOfficielle: acte.referenceActe,
          titre: "Attestation de Détention Coutumière & Certificat Cadastral",
          type: "TITRE_CADASTRAL",
          typeLabel: "Attestation Cadastrale Coutumière",
          parcelleCode: acte.parcelleCode,
          dateEmission: acte.dateDepot,
          autoriteEmettrice: "Agence Nationale du Domaine et du Foncier (ANDF) & Mairie de Ouidah",
          signataireNom: acte.signataire,
          signataireQualite: "Autorités Administratives et Cadastrales Co-signataires",
          hashSha256: acte.hashSha256,
          otsProof: acte.otsProof,
          txBlockchainId: acte.txBlockchainId,
          baseLegale: "Loi n° 2013-01 portant Code Foncier et Domanial (Articles 39 à 45 régissant la reconnaissance coutumière)",
          description: `Titre officiel constatant la détention coutumière paisible et continue au profit du mandataire familial Germain Dossou pour la parcelle ${acte.parcelleCode}.`,
          details: {
            regime: "Droit Coutumier Reconnu au Cadastre National",
            commune: "Ouidah",
            arrondissement: "Pahou",
            village: "Hounhanmèdji",
            superficieM2: 1250,
          },
        });
      } else if (acte.typeActe === "PROCES_VERBAL_BORNAGE") {
        documents.push({
          id: acte.id,
          referenceOfficielle: acte.referenceActe,
          titre: "Procès-Verbal de Bornage Contradictoire & Géoréférencement GPS",
          type: "PV_BORNAGE",
          typeLabel: "PV de Bornage Géomètre",
          parcelleCode: acte.parcelleCode,
          dateEmission: acte.dateDepot,
          autoriteEmettrice: "Ordre des Géomètres Experts du Bénin (OGED) & Cadastre National",
          signataireNom: acte.signataire,
          signataireQualite: "Agent Foncier Assermenté & Expert Géomètre",
          hashSha256: acte.hashSha256,
          otsProof: acte.otsProof,
          txBlockchainId: acte.txBlockchainId,
          baseLegale: "Loi n° 2013-01 modifiée (Article 148 - Délimitation contradictoire et implantation géodésique)",
          description: `Procès-verbal de bornage contradictoire constatant l'implantation régulière de 4 bornes normalisées aux coordonnées GPS certifiées, en présence des riverains et autorités locales.`,
          details: {
            nombreBornes: 4,
            geometre: "Mamadou Bio",
            npiGeometre: "FICTIF-BEN-2026-0045",
            riverainsPresents: ["Paul Hounkpatin (Voisin Est)", "Chef Dah Sèhou (Chef de Village)"],
            bornesGPS: [
              { id: "B1", lat: 6.365, lng: 2.0815 },
              { id: "B2", lat: 6.365, lng: 2.083 },
              { id: "B3", lat: 6.3665, lng: 2.083 },
              { id: "B4", lat: 6.3665, lng: 2.0815 },
            ],
          },
        });
      } else if (acte.typeActe === "CARNET_FAMILLE_FONCIER") {
        documents.push({
          id: acte.id,
          referenceOfficielle: acte.referenceActe,
          titre: "Carnet de Famille Foncier — Accord Successoral & Pacte Familial",
          type: "CARNET_FONCIER",
          typeLabel: "Carnet de Famille Foncier",
          parcelleCode: acte.parcelleCode,
          dateEmission: acte.dateDepot,
          autoriteEmettrice: "Registre National des Dévolutions & Étude Notariale",
          signataireNom: acte.signataire,
          signataireQualite: "Collectivité Familiale & Notaire Instrumentaire",
          hashSha256: acte.hashSha256,
          otsProof: acte.otsProof,
          txBlockchainId: acte.txBlockchainId,
          baseLegale: "Loi n° 2002-07 portant Code des Personnes et de la Famille & Loi n° 2013-01 portant Code Foncier et Domanial",
          description: `Pacte familial consignant l'accord express et les consentements des héritiers Blaise Dossou (50%) et Sophie Dossou (50%), conférant une pleine opposabilité successorale.`,
          details: {
            ayantsDroit: [
              { nom: "Blaise Dossou", part: "50%", statut: "Consentement ANIP Validé" },
              { nom: "Sophie Dossou", part: "50%", statut: "Consentement ANIP Validé" },
            ],
            opposabiliteCsaf: "Garantie d'absence de recours ultérieur",
          },
        });
      } else if (acte.typeActe === "TITRE_FONCIER") {
        documents.push({
          id: acte.id,
          referenceOfficielle: acte.referenceActe,
          titre: "Titre Foncier Immatriculé au Livre Foncier National",
          type: "TITRE_CADASTRAL",
          typeLabel: "Titre Foncier Immatriculé",
          parcelleCode: acte.parcelleCode,
          dateEmission: acte.dateDepot,
          autoriteEmettrice: "Conservation de la Propriété Foncière • ANDF Bénin",
          signataireNom: acte.signataire,
          signataireQualite: "Directrice Générale ANDF",
          hashSha256: acte.hashSha256,
          otsProof: acte.otsProof,
          txBlockchainId: acte.txBlockchainId,
          baseLegale: "Loi n° 2013-01 portant Code Foncier et Domanial (Livre Foncier définitif et inattaquable)",
          description: `Titre foncier définitif conférant la pleine propriété inattaquable et opposable aux tiers sur la parcelle ${acte.parcelleCode}.`,
        });
      }
    }
  }

  // 4. Conventions de vente assistées
  const allConvs = anyigbaRepo.getAllConventions();
  for (const conv of allConvs) {
    if (conv.parcelleCode && targetCodes.has(conv.parcelleCode.toUpperCase())) {
      documents.push({
        id: conv.id,
        referenceOfficielle: conv.codeConvention,
        titre: "Convention de Vente Sous Seing Privé Assistée au Village",
        type: "CONVENTION",
        typeLabel: "Convention de Vente Assistée",
        parcelleCode: conv.parcelleCode,
        dateEmission: conv.dateSignature,
        autoriteEmettrice: `Commission Foncière de Village • ${conv.village} (${conv.commune})`,
        signataireNom: `${conv.vendeurNom} (Cédant), ${conv.acheteurNom} (Cessionnaire), ${conv.agentNom}`,
        signataireQualite: "Parties contractantes & Agent Foncier Assermenté",
        montantFcfa: conv.prixFcfa,
        quittanceTresorRef: conv.certificatMairieRef,
        hashSha256: conv.dossierHashSha256,
        otsProof: `OTS-BTC-CONV-${conv.codeConvention.replace(/[^a-zA-Z0-9]/g, "")}`,
        txBlockchainId: "0xbc7f83b1657ff1fc53b92dc18148a1d65dfc2d4b",
        baseLegale: "Loi n° 2017-15 portant Code Foncier et Domanial (Régime de sécurisation des transactions villageoises)",
        description: `Convention de vente rédigée avec l'assistance d'un agent assermenté, comprenant 2 témoignages vocaux en Fongbe, photos des 4 bornes et séquestre financier d'État.`,
        details: {
          vendeurNom: conv.vendeurNom,
          vendeurNpi: conv.vendeurNpi,
          acheteurNom: conv.acheteurNom,
          acheteurNpi: conv.acheteurNpi,
          surfaceM2: conv.surfaceM2,
          prixFcfa: conv.prixFcfa,
          bornesCount: conv.photosBornesCount,
          temoignagesVocaux: conv.temoignagesVocaux,
          statutSequestre: conv.statutSequestre,
        },
      });
    }
  }

  // Tri par date décroissante
  return documents.sort((a, b) => new Date(b.dateEmission).getTime() - new Date(a.dateEmission).getTime());
}
