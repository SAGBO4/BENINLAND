import { INITIAL_PARCELLES, SeedParcelle } from "@/db/seed/data";
import { calculateDocumentHash, generateBlockchainProof } from "@/lib/hash";
import { sendSimulatedSms } from "@/lib/channels";

export interface MutationRecord {
  id: string;
  codeMutation: string;
  parcelleCode: string;
  certificatMairieRef?: string;
  certificatMairieHash?: string;
  cedantNpi: string;
  cedantNom: string;
  cessionnaireNpi: string;
  cessionnaireNom: string;
  notaireId: string;
  prixFcfa: number;
  statut: "INITIEE_VERROUILLEE" | "PAIEMENT_SEQUESTRE" | "VALIDEE_ANDF" | "REJETEE";
  statutSequestre: "EN_ATTENTE" | "FONDS_BLOQUES_SEQUESTRE" | "LIBERE_VENDEUR" | "REMBOURSE_ACHETEUR";
  quittanceSequestreRef?: string;
  valideAndfLe?: string;
  hashPreuve: string;
  dateCreation: string;
}

export interface ConventionRecord {
  id: string;
  codeConvention: string;
  parcelleCode?: string;
  certificatMairieRef?: string;
  certificatMairieHash?: string;
  agentNpi: string;
  agentNom: string;
  vendeurNpi: string;
  vendeurNom: string;
  acheteurNpi: string;
  acheteurNom: string;
  commune: string;
  village: string;
  surfaceM2: number;
  prixFcfa: number;
  photosBornesCount: number;
  temoignagesVocaux: Array<{
    temoinNom: string;
    qualite: string;
    langue: string;
    dureeSecondes: number;
  }>;
  statutSequestre: string;
  dossierHashSha256: string;
  dateSignature: string;
}

export interface CertificatCommuneRecord {
  id: string;
  codeCertificat: string;
  codeParcelle: string;
  commune: string;
  arrondissement?: string;
  prixAcquisitionInitial: number;
  prixFixeFcfa: number;
  travauxDeductibles: number;
  plusValueNette: number;
  taxeCalculeeFcfa: number;
  quittanceTresorRef: string;
  modePaiement: "TRESORPAY" | "MTN_MOMO" | "MOOV_MONEY";
  statutPaiement: "PAYE_TRESOR_PUBLIC";
  agentMairieNpi: string;
  agentMairieNom: string;
  hashSha256: string;
  otsProof: string;
  txBlockchainId: string;
  dateEmission: string;
}

export interface ActeRecord {
  id: string;
  referenceActe: string;
  parcelleCode: string;
  typeActe: string;
  signataire: string;
  hashSha256: string;
  salt: string;
  otsProof: string;
  txBlockchainId: string;
  dateDepot: string;
  estFalsifie?: boolean;
}

export interface HypothequeRecord {
  id: string;
  codeHypotheque: string;
  parcelleCode: string;
  certificatMairieRef?: string;
  demandeurNom: string;
  demandeurNpi: string;
  banqueNom: string;
  banqueNpiAgent: string;
  montantCreditFcfa: number;
  valeurGarantieFcfa: number;
  valeurVenaleRetenue: number;
  rang: number;
  statut: "INSCRITE_RANG_1" | "RADIEE";
  hashSha256: string;
  otsProof: string;
  txBlockchainId: string;
  dateInscription: string;
}

export interface LitigeRecord {
  id: string;
  referenceOrdonnance: string;
  parcelleCode: string;
  parcelleId?: number;
  demandeurNom: string;
  demandeurNpi: string;
  motif: string;
  juridiction: string;
  statut: "GEL_CONSERVATOIRE" | "LEVE";
  magistratNom: string;
  dateOuverture: string;
  dateResolution?: string;
  hashSha256: string;
  certificatMairieRef?: string;
  quittanceTresorRef?: string;
}

// État mémoire persistant (Règle d'or : La démo ne plante jamais)
class AnyigbaRepository {
  private parcelles: SeedParcelle[] = JSON.parse(JSON.stringify(INITIAL_PARCELLES));
  private hypotheques: HypothequeRecord[] = [];
  private mutations: MutationRecord[] = [
    {
      id: "MUT-001",
      codeMutation: "MUT-2026-0089",
      parcelleCode: "CAL-0089",
      cedantNpi: "FICTIF-BEN-2026-0003",
      cedantNom: "Koffi Mensah",
      cessionnaireNpi: "FICTIF-BEN-2026-0050",
      cessionnaireNom: "Aimé Houndégbé",
      notaireId: "Me Christian Agbossou",
      prixFcfa: 4500000,
      statut: "INITIEE_VERROUILLEE",
      statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
      quittanceSequestreRef: "SEQUESTRE-DGTCP-2026-90412",
      hashPreuve: "0xa89f3320c74d8129e9f1a09374026da4e7710bcf",
      dateCreation: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  private conventions: ConventionRecord[] = [
    {
      id: "CONV-001",
      codeConvention: "CONV-VIL-2026-042",
      parcelleCode: "OUI-0421",
      certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
      certificatMairieHash: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
      agentNpi: "FICTIF-BEN-2026-0045",
      agentNom: "Mamadou Bio (Agent Foncier Assermenté)",
      vendeurNpi: "FICTIF-BEN-2026-0041",
      vendeurNom: "Germain Dossou",
      acheteurNpi: "FICTIF-BEN-2026-0003",
      acheteurNom: "Koffi Mensah",
      commune: "Ouidah",
      village: "Pahou",
      surfaceM2: 1250,
      prixFcfa: 4500000,
      photosBornesCount: 4,
      temoignagesVocaux: [
        { temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24 },
        { temoinNom: "Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45 },
      ],
      statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
      dossierHashSha256: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      dateSignature: "2026-02-10T14:30:00.000Z",
    },
  ];
  private actes: ActeRecord[] = [
    {
      id: "ACT-001",
      referenceActe: "TF-OUIDAH-2026-104",
      parcelleCode: "OUI-0104",
      typeActe: "TITRE_FONCIER",
      signataire: "Mme Reine Houndété (Directrice ANDF)",
      hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      salt: "a1b2c3d4e5f67890",
      otsProof: "OTS-BTC-SEAL-E3B0C442",
      txBlockchainId: "0xbc887766554433221100aabbccddeeff",
      dateDepot: "2026-01-15T10:00:00.000Z",
    },
    {
      id: "ACT-002",
      referenceActe: "ATT-REC-OUIDAH-PAHOU-2024-081",
      parcelleCode: "OUI-0421",
      typeActe: "ATTESTATION_DETENTION_COUTUMIERE",
      signataire: "M. Christian Houetchenou (Maire de Ouidah) & ANDF",
      hashSha256: "0x89a4cf31e792b04f98124efb189a246813579bdf0246813579bdf0246813579b",
      salt: "b2c3d4e5f6a17890",
      otsProof: "OTS-BTC-ADC-OUIDAH-PAHOU-89A4CF31",
      txBlockchainId: "0xbc89a4cf31e792b04f98124efb189a246813579b",
      dateDepot: "2024-06-18T09:30:00.000Z",
    },
    {
      id: "ACT-003",
      referenceActe: "PV-BORNAGE-GPS-2026-0421",
      parcelleCode: "OUI-0421",
      typeActe: "PROCES_VERBAL_BORNAGE",
      signataire: "Mamadou Bio (Agent Foncier Assermenté NPI: FICTIF-BEN-2026-0045)",
      hashSha256: "0x4b7c1e9a3f2d80517e69ac24810bf23d8491a6204859c3a172e9058471b6329a",
      salt: "c3d4e5f6a1b28901",
      otsProof: "OTS-BTC-BORNAGE-OUI-0421-4B7C1E9A",
      txBlockchainId: "0xbc4b7c1e9a3f2d80517e69ac24810bf23d8491a",
      dateDepot: "2026-01-22T11:15:00.000Z",
    },
    {
      id: "ACT-004",
      referenceActe: "CARNET-FAMILLE-OUI-0421",
      parcelleCode: "OUI-0421",
      typeActe: "CARNET_FAMILLE_FONCIER",
      signataire: "Collectivité Familiale Germain Dossou & Notaire Instrumentaire",
      hashSha256: "0x12a9c3e4b78901f45678cd981234ef56789012ab34cd56ef78901234567890ab",
      salt: "d4e5f6a1b2c39012",
      otsProof: "OTS-BTC-CARNET-OUI-0421-12A9C3E4",
      txBlockchainId: "0xbc12a9c3e4b78901f45678cd981234ef56789012",
      dateDepot: "2026-02-01T15:00:00.000Z",
    },
  ];
  private certificatsCommune: CertificatCommuneRecord[] = [
    {
      id: "CERTIF-001",
      codeCertificat: "CERTIF-COMMUNE-OUI-0421-2026",
      codeParcelle: "OUI-0421",
      commune: "Ouidah",
      arrondissement: "Pahou",
      prixAcquisitionInitial: 2000000,
      prixFixeFcfa: 4500000,
      travauxDeductibles: 500000,
      plusValueNette: 2000000,
      taxeCalculeeFcfa: 100000,
      quittanceTresorRef: "TRESOR-DGTCP-2026-88124",
      modePaiement: "TRESORPAY",
      statutPaiement: "PAYE_TRESOR_PUBLIC",
      agentMairieNpi: "FICTIF-BEN-2026-0033",
      agentMairieNom: "Sètondji Gbedji (Chef Service Foncier)",
      hashSha256: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
      otsProof: "OTS-BTC-MAIRIE-OUIDAH-3F5C9E2B",
      txBlockchainId: "0xbc3f5c9e2b1840ab3d90f234acfe7b11d94821a7",
      dateEmission: "2026-02-09T11:20:00.000Z",
    },
    {
      id: "CERTIF-002",
      codeCertificat: "CERTIF-COMMUNE-OUI-0104-2026",
      codeParcelle: "OUI-0104",
      commune: "Ouidah",
      arrondissement: "Ouidah I",
      prixAcquisitionInitial: 30000000,
      prixFixeFcfa: 48000000,
      travauxDeductibles: 3000000,
      plusValueNette: 15000000,
      taxeCalculeeFcfa: 750000,
      quittanceTresorRef: "TRESOR-DGTCP-2026-10492",
      modePaiement: "TRESORPAY",
      statutPaiement: "PAYE_TRESOR_PUBLIC",
      agentMairieNpi: "FICTIF-BEN-2026-0033",
      agentMairieNom: "Sètondji Gbedji (Chef Service Foncier)",
      hashSha256: "0x7a2d8e4c9b101112131415161718192021222324252627282930313233343536",
      otsProof: "OTS-BTC-MAIRIE-OUIDAH-7A2D8E4C",
      txBlockchainId: "0xbc7a2d8e4c9b1011121314151617181920212223",
      dateEmission: "2026-02-12T14:45:00.000Z",
    },
  ];
  private litiges: LitigeRecord[] = [
    {
      id: "LIT-001",
      referenceOrdonnance: "ORD-CSAF-2026/0412",
      parcelleCode: "LIT-ALL-005",
      demandeurNom: "Succession Gbénou c/ Hounkpatin",
      demandeurNpi: "FICTIF-BEN-2026-0777",
      motif: "Revendication successorale coutumière et contestation de limite parcellaire",
      juridiction: "Cour Spéciale des Affaires Foncières (CSAF - Cotonou)",
      statut: "GEL_CONSERVATOIRE",
      magistratNom: "Juge Antoine Sossa",
      dateOuverture: "2026-01-15T09:00:00.000Z",
      hashSha256: "0x8e21abf048d42398516e87bc1284a71994e6c382103f56",
    },
  ];

  public getAllLitiges(): LitigeRecord[] {
    return [...this.litiges];
  }

  public getLitigesByParcelle(code: string): LitigeRecord[] {
    const clean = code.trim().toUpperCase();
    return this.litiges.filter((l) => l.parcelleCode.toUpperCase() === clean);
  }

  public inscrireGelConservatoire(params: {
    parcelleCode: string;
    demandeurNom: string;
    demandeurNpi?: string;
    motif: string;
    magistratNom?: string;
    referenceOrdonnance?: string;
    certificatMairieRef?: string;
    quittanceTresorRef?: string;
  }): { success: boolean; litige?: LitigeRecord; error?: string } {
    const code = params.parcelleCode.trim().toUpperCase();
    const parcelle = this.getParcelleByCode(code);
    if (!parcelle) {
      return { success: false, error: `PARCELLE_INEXISTANTE: La parcelle '${code}' est introuvable au cadastre.` };
    }

    parcelle.enLitige = true;

    const { hash } = calculateDocumentHash({
      parcelleCode: code,
      demandeurNom: params.demandeurNom,
      motif: params.motif,
      date: new Date().toISOString(),
    });

    const newLitige: LitigeRecord = {
      id: `LIT-${Date.now().toString().slice(-4)}`,
      referenceOrdonnance: params.referenceOrdonnance || `ORD-CSAF-2026/${Math.floor(1000 + Math.random() * 9000)}`,
      parcelleCode: code,
      parcelleId: parcelle.id,
      demandeurNom: params.demandeurNom.trim(),
      demandeurNpi: params.demandeurNpi?.trim() || "NPI-NON-COMMUNIQUE",
      motif: params.motif.trim(),
      juridiction: "Cour Spéciale des Affaires Foncières (CSAF - Cotonou)",
      statut: "GEL_CONSERVATOIRE",
      magistratNom: params.magistratNom || "Juge Antoine Sossa",
      dateOuverture: new Date().toISOString(),
      hashSha256: hash,
      certificatMairieRef: params.certificatMairieRef,
      quittanceTresorRef: params.quittanceTresorRef,
    };

    this.litiges.unshift(newLitige);
    return { success: true, litige: newLitige };
  }

  public leverGelConservatoire(params: {
    parcelleCode: string;
    magistratNom?: string;
    motifMainlevee?: string;
  }): { success: boolean; error?: string } {
    const code = params.parcelleCode.trim().toUpperCase();
    const parcelle = this.getParcelleByCode(code);
    if (!parcelle) {
      return { success: false, error: `PARCELLE_INEXISTANTE: La parcelle '${code}' est introuvable au cadastre.` };
    }

    parcelle.enLitige = false;
    const activeLitiges = this.litiges.filter(
      (l) => l.parcelleCode.toUpperCase() === code && l.statut === "GEL_CONSERVATOIRE"
    );
    for (const lit of activeLitiges) {
      lit.statut = "LEVE";
      lit.dateResolution = new Date().toISOString();
    }

    return { success: true };
  }

  public getAllCertificatsCommune(): CertificatCommuneRecord[] {
    return [...this.certificatsCommune];
  }

  public getCertificatCommuneByCode(codeOrHash: string): CertificatCommuneRecord | undefined {
    const clean = codeOrHash.trim().toLowerCase();
    return this.certificatsCommune.find(
      (c) =>
        c.codeCertificat.toLowerCase() === clean ||
        c.hashSha256.toLowerCase() === clean ||
        c.quittanceTresorRef.toLowerCase() === clean
    );
  }

  public getCertificatCommuneByParcelle(parcelleCode: string): CertificatCommuneRecord | undefined {
    const clean = parcelleCode.trim().toUpperCase();
    return this.certificatsCommune.find((c) => c.codeParcelle.toUpperCase() === clean);
  }

  public createCertificatCommune(params: {
    codeCertificat?: string;
    quittanceTresorRef?: string;
    hashSha256?: string;
    otsProof?: string;
    txBlockchainId?: string;
    dateEmission?: string;
    codeParcelle: string;
    commune: string;
    arrondissement?: string;
    prixAcquisitionInitial: number;
    prixFixeFcfa: number;
    travauxDeductibles?: number;
    modePaiement?: "TRESORPAY" | "MTN_MOMO" | "MOOV_MONEY";
    agentMairieNpi?: string;
    agentMairieNom?: string;
  }): CertificatCommuneRecord {
    const travaux = params.travauxDeductibles || 0;
    const plusValueNette = Math.max(0, params.prixFixeFcfa - params.prixAcquisitionInitial - travaux);
    const taxeCalculee = Math.round(plusValueNette * 0.05);

    const safeParcelle = params.codeParcelle.trim().toUpperCase();
    const safeCommune = params.commune.trim();
    const cleanCommuneCode = safeCommune.slice(0, 3).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codeCertificat =
      params.codeCertificat ||
      `CERTIF-COMMUNE-${safeParcelle}-${new Date().getFullYear()}-${randomSuffix}`;
    const quittanceTresorRef =
      params.quittanceTresorRef ||
      `TRESOR-DGTCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const { hash } = calculateDocumentHash({
      codeCertificat,
      codeParcelle: safeParcelle,
      commune: safeCommune,
      prixFixeFcfa: params.prixFixeFcfa,
      taxeCalculeeFcfa: taxeCalculee,
      quittanceTresorRef,
      dateEmission: params.dateEmission || new Date().toISOString(),
    });

    const formattedHash = params.hashSha256 || (hash.startsWith("0x") ? hash : `0x${hash}`);
    const proof = generateBlockchainProof(formattedHash);

    const certificat: CertificatCommuneRecord = {
      id: `CERT-${Date.now().toString().slice(-4)}`,
      codeCertificat,
      codeParcelle: safeParcelle,
      commune: safeCommune,
      arrondissement: params.arrondissement || "Arrondissement Central",
      prixAcquisitionInitial: params.prixAcquisitionInitial,
      prixFixeFcfa: params.prixFixeFcfa,
      travauxDeductibles: travaux,
      plusValueNette,
      taxeCalculeeFcfa: taxeCalculee,
      quittanceTresorRef,
      modePaiement: params.modePaiement || "TRESORPAY",
      statutPaiement: "PAYE_TRESOR_PUBLIC",
      agentMairieNpi: params.agentMairieNpi || "FICTIF-BEN-2026-0033",
      agentMairieNom: params.agentMairieNom || "Direction des Affaires Domaniales",
      hashSha256: formattedHash,
      otsProof:
        params.otsProof ||
        `OTS-BTC-MAIRIE-${cleanCommuneCode}-${formattedHash.slice(2, 10).toUpperCase()}`,
      txBlockchainId: params.txBlockchainId || proof.txId,
      dateEmission: params.dateEmission || new Date().toISOString(),
    };

    this.certificatsCommune.unshift(certificat);
    return certificat;
  }

  public getAllHypotheques(): HypothequeRecord[] {
    return [...this.hypotheques];
  }

  public getHypothequeByCode(codeOrHash: string): HypothequeRecord | undefined {
    const clean = codeOrHash.trim().toLowerCase();
    return this.hypotheques.find(
      (h) =>
        h.codeHypotheque.toLowerCase() === clean ||
        h.hashSha256.toLowerCase() === clean
    );
  }

  public getHypothequesByParcelle(code: string): HypothequeRecord[] {
    const clean = code.trim().toUpperCase();
    return this.hypotheques.filter((h) => h.parcelleCode.toUpperCase() === clean);
  }

  public getActiveHypothequeRang1(code: string): HypothequeRecord | undefined {
    const clean = code.trim().toUpperCase();
    return this.hypotheques.find(
      (h) => h.parcelleCode.toUpperCase() === clean && h.rang === 1 && h.statut === "INSCRITE_RANG_1"
    );
  }

  public inscrireHypotheque(params: {
    parcelleCode: string;
    demandeurNom: string;
    demandeurNpi: string;
    banqueNom: string;
    banqueNpiAgent: string;
    montantCreditFcfa: number;
    valeurGarantieFcfa?: number;
    certificatMairieRef?: string;
  }): HypothequeRecord {
    const cleanCode = params.parcelleCode.trim().toUpperCase();
    const parcelle = this.getParcelleByCode(cleanCode);
    if (!parcelle) {
      throw new Error(`PARCELLE_INTROUVABLE: La parcelle ${cleanCode} n'existe pas dans le Cadastre National.`);
    }

    if (parcelle.enLitige) {
      throw new Error("LITIGE_ACTIF: Inscription impossible. La parcelle fait l'objet d'un gel conservatoire CSAF.");
    }

    if (parcelle.enVerrouMutation) {
      throw new Error("MUTATION_EN_COURS: Inscription impossible. Une transaction notariale avec verrou est en cours.");
    }

    // Contrôle strict de Titularité Foncier du Demandeur de Crédit
    const cleanDemandeurNpi = params.demandeurNpi.trim().toUpperCase();
    const cleanProprietaireNpi = (parcelle.proprietaireNpi || "").trim().toUpperCase();
    const cleanDemandeurNom = params.demandeurNom.trim().toLowerCase();
    const cleanProprietaireNom = (parcelle.proprietaireNom || "").trim().toLowerCase();

    const npiMatch = cleanDemandeurNpi && cleanProprietaireNpi === cleanDemandeurNpi;
    const nomMatch =
      cleanDemandeurNom &&
      (cleanProprietaireNom.includes(cleanDemandeurNom) || cleanDemandeurNom.includes(cleanProprietaireNom));

    if (!npiMatch && !nomMatch) {
      throw new Error(
        `DEFAUT_TITULARITE: Le demandeur (${params.demandeurNom}, NPI: ${params.demandeurNpi}) n'est pas le titulaire foncier légitime immatriculé au Cadastre National (${parcelle.proprietaireNom}).`
      );
    }

    const existingHyp = this.getActiveHypothequeRang1(cleanCode);
    if (existingHyp) {
      throw new Error(
        `HYPOTHEQUE_EXISTANTE: Une hypothèque de Rang 1 (${existingHyp.codeHypotheque}) est déjà inscrite par ${existingHyp.banqueNom}.`
      );
    }

    const certif = this.getCertificatCommuneByParcelle(cleanCode);
    const estTitre = parcelle.statutJuridique === "TITRE_FONCIER" || parcelle.statutJuridique === "CPF";
    const valeurVenaleRetenue = certif ? certif.prixFixeFcfa : ((parcelle.superficieM2 || 1000) * (estTitre ? 20000 : 8000));
    const valeurGarantie = params.valeurGarantieFcfa || params.montantCreditFcfa;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codeHypotheque = `HYP-R1-${cleanCode}-${new Date().getFullYear()}-${randomSuffix}`;

    const { hash } = calculateDocumentHash({
      codeHypotheque,
      parcelleCode: cleanCode,
      proprietaireCadastre: parcelle.proprietaireNom,
      proprietaireNpi: parcelle.proprietaireNpi,
      demandeurNom: params.demandeurNom,
      demandeurNpi: params.demandeurNpi,
      banqueNom: params.banqueNom,
      montantCreditFcfa: params.montantCreditFcfa,
      valeurGarantieFcfa: valeurGarantie,
      valeurVenaleRetenue,
      dateInscription: new Date().toISOString(),
    });

    const formattedHash = hash.startsWith("0x") ? hash : `0x${hash}`;
    const proof = generateBlockchainProof(formattedHash);

    const hypotheque: HypothequeRecord = {
      id: `HYP-${Date.now().toString().slice(-4)}`,
      codeHypotheque,
      parcelleCode: cleanCode,
      certificatMairieRef: params.certificatMairieRef || (certif ? certif.codeCertificat : undefined),
      demandeurNom: params.demandeurNom,
      demandeurNpi: params.demandeurNpi,
      banqueNom: params.banqueNom,
      banqueNpiAgent: params.banqueNpiAgent,
      montantCreditFcfa: params.montantCreditFcfa,
      valeurGarantieFcfa: valeurGarantie,
      valeurVenaleRetenue,
      rang: 1,
      statut: "INSCRITE_RANG_1",
      hashSha256: formattedHash,
      otsProof: `OTS-BTC-HYP-${cleanCode}-${formattedHash.slice(2, 10).toUpperCase()}`,
      txBlockchainId: proof.txId,
      dateInscription: new Date().toISOString(),
    };

    this.hypotheques.unshift(hypotheque);
    return hypotheque;
  }

  public getAllParcelles(): SeedParcelle[] {
    return [...this.parcelles];
  }

  public getParcelleByCode(code: string): SeedParcelle | undefined {
    return this.parcelles.find((p) => p.codeUnique.toUpperCase() === code.trim().toUpperCase());
  }

  public createParcelle(data: Omit<SeedParcelle, "id"> & { id?: number }): SeedParcelle {
    const newId = this.parcelles.length > 0 ? Math.max(...this.parcelles.map((p) => p.id)) + 1 : 1;
    const newParcelle: SeedParcelle = {
      ...data,
      id: data.id || newId,
      tokenBeninChainId: data.tokenBeninChainId || `TKN-${data.statutJuridique}-${data.codeUnique}`,
    };
    this.parcelles.unshift(newParcelle);
    return newParcelle;
  }

  public getAllMutations(): MutationRecord[] {
    return [...this.mutations];
  }

  public getMutationByCode(codeOrHash: string): MutationRecord | undefined {
    const clean = codeOrHash.trim().toLowerCase();
    return this.mutations.find(
      (m) =>
        m.codeMutation.toLowerCase() === clean ||
        m.id.toLowerCase() === clean ||
        m.hashPreuve.toLowerCase() === clean ||
        (m.quittanceSequestreRef && m.quittanceSequestreRef.toLowerCase() === clean) ||
        (m.parcelleCode && m.parcelleCode.toLowerCase() === clean)
    );
  }

  public getAllConventions(): ConventionRecord[] {
    return [...this.conventions];
  }

  public getConventionByCode(codeOrHash: string): ConventionRecord | undefined {
    const clean = codeOrHash.trim().toLowerCase();
    return this.conventions.find(
      (c) =>
        c.codeConvention.toLowerCase() === clean ||
        c.dossierHashSha256.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        (c.parcelleCode && c.parcelleCode.toLowerCase() === clean)
    );
  }

  public getAllActes(): ActeRecord[] {
    return [...this.actes];
  }

  public getActesByParcelle(code: string): ActeRecord[] {
    const clean = code.trim().toUpperCase();
    return this.actes.filter((a) => a.parcelleCode.toUpperCase() === clean);
  }

  public getConventionsByParcelle(code: string): ConventionRecord[] {
    const clean = code.trim().toUpperCase();
    return this.conventions.filter((c) => (c.parcelleCode || "").toUpperCase() === clean);
  }

  /**
   * Tente d'initier une mutation avec pose de verrou anti-double-vente.
   * Lève une erreur explicite si la parcelle est déjà verrouillée ou en litige.
   */
  public initiateMutation(params: {
    parcelleCode: string;
    certificatMairieRef?: string;
    certificatMairieHash?: string;
    cedantNpi: string;
    cedantNom: string;
    cessionnaireNpi: string;
    cessionnaireNom: string;
    notaireId: string;
    prixFcfa: number;
  }): { success: boolean; mutation?: MutationRecord; error?: string } {
    const cedantClean = (params.cedantNpi || "").trim();
    const cessionnaireClean = (params.cessionnaireNpi || "").trim();

    if (cedantClean === cessionnaireClean) {
      return {
        success: false,
        error: "AUTO_CESSION_INTERDITE: Le cédant et le cessionnaire ne peuvent pas être la même personne (NPI identique).",
      };
    }

    if (!Number.isFinite(params.prixFcfa) || params.prixFcfa <= 0 || params.prixFcfa > 1000000000000) {
      return {
        success: false,
        error: "PRIX_INVALIDE: Le montant en FCFA doit être un montant positif réaliste.",
      };
    }

    const parcelle = this.getParcelleByCode(params.parcelleCode);
    if (!parcelle) {
      return { success: false, error: "PARCELLE_INEXISTANTE: Cette parcelle n'est pas répertoriée au cadastre." };
    }

    if (parcelle.enLitige) {
      return {
        success: false,
        error: "PARCELLE_EN_LITIGE: Cette parcelle fait l'objet d'un gel conservatoire CSAF. Toute cession est strictement interdite.",
      };
    }

    if (parcelle.enVerrouMutation) {
      return {
        success: false,
        error: "PARCELLE_VERROUILLEE: Alerte anti-double-vente ! Une mutation est déjà en cours d'instruction sur cette parcelle. Aucune transaction concurrente n'est possible.",
      };
    }

    if (parcelle.proprietaireNpi.trim().toUpperCase() !== cedantClean.toUpperCase()) {
      return {
        success: false,
        error: "PROPRIETAIRE_NON_CONFORME: Le cédant spécifié n'est pas le titulaire légitime enregistré au cadastre pour cette parcelle.",
      };
    }

    // Récupération automatique du certificat municipal si existant
    const certif = this.getCertificatCommuneByParcelle(params.parcelleCode);
    const certRef = params.certificatMairieRef || (certif ? certif.codeCertificat : undefined);
    const certHash = params.certificatMairieHash || (certif ? certif.hashSha256 : undefined);

    // Sécurité et force légale Art. 142 : Le prix doit concorder avec le Certificat Municipal officiel
    if (certRef) {
      const activeCert = this.getCertificatCommuneByCode(certRef) || certif;
      if (activeCert && params.prixFcfa !== activeCert.prixFixeFcfa) {
        return {
          success: false,
          error: `PRIX_NON_CONFORME_MAIRIE: Le montant de la mutation (${params.prixFcfa} FCFA) ne correspond pas au prix officiel fixé par la Mairie (${activeCert.prixFixeFcfa} FCFA). Art. 142 CFD.`,
        };
      }
    }

    // Pose du verrou
    parcelle.enVerrouMutation = true;

    const { hash } = calculateDocumentHash({
      parcelleCode: params.parcelleCode,
      certificatMairieRef: certRef,
      cedant: cedantClean,
      cessionnaire: cessionnaireClean,
      prix: params.prixFcfa,
      date: new Date().toISOString(),
    });

    const mutation: MutationRecord = {
      id: `MUT-${Date.now().toString().slice(-4)}`,
      codeMutation: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      parcelleCode: params.parcelleCode,
      certificatMairieRef: certRef,
      certificatMairieHash: certHash,
      cedantNpi: params.cedantNpi,
      cedantNom: params.cedantNom,
      cessionnaireNpi: params.cessionnaireNpi,
      cessionnaireNom: params.cessionnaireNom,
      notaireId: params.notaireId,
      prixFcfa: params.prixFcfa,
      statut: "INITIEE_VERROUILLEE",
      statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
      quittanceSequestreRef: `SEQUESTRE-DGTCP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      hashPreuve: hash,
      dateCreation: new Date().toISOString(),
    };

    this.mutations.unshift(mutation);

    // Alerte SMS au cédant légitime
    sendSimulatedSms(
      parcelle.proprietaireTel,
      `ANYIGBA ALERTE: Une mutation (${mutation.codeMutation}) a ete initiee sur votre parcelle ${parcelle.codeUnique} par ${params.notaireId}. Verrou anti-double-vente active.`
    );

    return { success: true, mutation };
  }

  /**
   * Validation définitive d'une mutation par l'officier ANDF.
   */
  public finalizeMutationByAndf(mutationCode: string, officerName: string): { success: boolean; error?: string } {
    const mut = this.mutations.find((m) => m.codeMutation === mutationCode);
    if (!mut) return { success: false, error: "MUTATION_INTROUVABLE" };

    if (mut.statut === "VALIDEE_ANDF") {
      return { success: false, error: "MUTATION_DEJA_VALIDEE: Cette mutation a déjà été approuvée et le titre émis." };
    }

    if (mut.statut !== "INITIEE_VERROUILLEE") {
      return { success: false, error: `STATUT_INVALIDE: Impossible de finaliser une mutation au statut ${mut.statut}.` };
    }

    const parcelle = this.getParcelleByCode(mut.parcelleCode);
    if (!parcelle) return { success: false, error: "PARCELLE_INTROUVABLE" };

    // Transfert de propriété
    parcelle.proprietaireNom = mut.cessionnaireNom;
    parcelle.proprietaireNpi = mut.cessionnaireNpi;
    parcelle.enVerrouMutation = false;
    parcelle.statutJuridique = "CPF"; // Cession validée donne lieu au Certificat de Propriété

    mut.statut = "VALIDEE_ANDF";
    mut.statutSequestre = "LIBERE_VENDEUR";
    mut.valideAndfLe = new Date().toISOString();

    // Dépôt de l'acte notarié scellé
    const { hash, salt } = calculateDocumentHash(`ACTE-MUTATION-${mutationCode}-${parcelle.codeUnique}`);
    const proof = generateBlockchainProof(hash);

    this.actes.push({
      id: `ACT-${Date.now().toString().slice(-4)}`,
      referenceActe: `CPF-${parcelle.codeUnique}-2026`,
      parcelleCode: parcelle.codeUnique,
      typeActe: "CERTIFICAT_PROPRIETE_FONCIERE",
      signataire: `${officerName} (ANDF) & ${mut.notaireId}`,
      hashSha256: hash,
      salt,
      otsProof: proof.otsProof,
      txBlockchainId: proof.txId,
      dateDepot: new Date().toISOString(),
    });

    sendSimulatedSms(
      parcelle.proprietaireTel,
      `ANYIGBA SUCCES: La mutation ${mutationCode} a ete validee par l'ANDF. Le titre CPF-${parcelle.codeUnique}-2026 est officiellement delivre.`
    );

    return { success: true };
  }

  /**
   * Création d'une convention de vente assistée au village avec séquestre MoMo.
   */
  public createConventionAssistee(params: {
    agentNpi: string;
    agentNom: string;
    vendeurNpi: string;
    vendeurNom: string;
    acheteurNpi: string;
    acheteurNom: string;
    commune: string;
    village: string;
    surfaceM2: number;
    prixFcfa: number;
    parcelleCode?: string;
    certificatMairieRef?: string;
    certificatMairieHash?: string;
    temoignagesVocaux?: Array<{
      temoinNom: string;
      qualite: string;
      langue: string;
      dureeSecondes: number;
    }>;
  }): ConventionRecord {
    const vendeurClean = (params.vendeurNpi || "").trim().toUpperCase();
    const acheteurClean = (params.acheteurNpi || "").trim().toUpperCase();

    if (vendeurClean === acheteurClean) {
      throw new Error("AUTO_CESSION_INTERDITE: Le vendeur et l'acheteur ne peuvent pas avoir le même NPI.");
    }

    if (!Number.isFinite(params.surfaceM2) || params.surfaceM2 <= 0 || params.surfaceM2 > 114763000000) {
      throw new Error("SURFACE_ABERRANTE: La superficie est invalide ou dépasse le territoire national.");
    }

    if (!Number.isFinite(params.prixFcfa) || params.prixFcfa <= 0) {
      throw new Error("PRIX_INVALIDE: Le montant doit être un nombre strictement positif.");
    }

    // Sécurité et force légale Art. 142 : Le prix doit concorder rigoureusement avec le Certificat Municipal
    if (params.certificatMairieRef) {
      const certif = this.getCertificatCommuneByCode(params.certificatMairieRef);
      if (certif) {
        if (!params.certificatMairieHash) {
          params.certificatMairieHash = certif.hashSha256;
        }
        if (params.prixFcfa !== certif.prixFixeFcfa) {
          throw new Error(
            `PRIX_NON_CONFORME_MAIRIE: Le montant déclaré (${params.prixFcfa} FCFA) ne correspond pas au prix officiel scellé par la Mairie (${certif.prixFixeFcfa} FCFA).`
          );
        }
      }
    }

    const { hash } = calculateDocumentHash(params);
    const conv: ConventionRecord = {
      id: `CONV-${Date.now().toString().slice(-4)}`,
      codeConvention: `CONV-VIL-2026-${Math.floor(100 + Math.random() * 900)}`,
      parcelleCode: params.parcelleCode,
      certificatMairieRef: params.certificatMairieRef,
      certificatMairieHash: params.certificatMairieHash,
      agentNpi: params.agentNpi,
      agentNom: params.agentNom,
      vendeurNpi: params.vendeurNpi,
      vendeurNom: params.vendeurNom,
      acheteurNpi: params.acheteurNpi,
      acheteurNom: params.acheteurNom,
      commune: params.commune,
      village: params.village,
      surfaceM2: params.surfaceM2,
      prixFcfa: params.prixFcfa,
      photosBornesCount: 4,
      temoignagesVocaux: params.temoignagesVocaux || [
        { temoinNom: "Paul Hounkpatin", qualite: "Voisin Est", langue: "Fongbe", dureeSecondes: 24 },
        { temoinNom: "Chef de Village Sèhou", qualite: "Chef coutumier", langue: "Fongbe", dureeSecondes: 45 },
      ],
      statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
      dossierHashSha256: hash,
      dateSignature: new Date().toISOString(),
    };

    this.conventions.unshift(conv);
    return conv;
  }

  /**
   * Simulation interactive de falsification d'acte pour démontrer la détection.
   */
  public simulateDocumentTampering(referenceActe: string): {
    success: boolean;
    hashOriginal: string;
    hashFalsifie: string;
    otsStatus: string;
  } {
    const acte = this.actes.find((a) => a.referenceActe === referenceActe);
    if (!acte) {
      return {
        success: false,
        hashOriginal: "",
        hashFalsifie: "",
        otsStatus: "DOCUMENT_INTROUVABLE",
      };
    }

    const { hash: tamperedHash } = calculateDocumentHash(
      `FALSIFICATION_ATTEMPT_NOM_MODIFIE_SUR_${referenceActe}`,
      acte.salt
    );
    acte.estFalsifie = true;

    return {
      success: true,
      hashOriginal: acte.hashSha256,
      hashFalsifie: tamperedHash,
      otsStatus: "FRAUDE_DETECTEE_PREUVE_NON_CONFORME",
    };
  }

  /**
   * Réinitialise les données à l'état déterministe initial.
   */
  public resetToDeterministicSeed(): void {
    this.parcelles = JSON.parse(JSON.stringify(INITIAL_PARCELLES));
    this.mutations = [
      {
        id: "MUT-001",
        codeMutation: "MUT-2026-0089",
        parcelleCode: "CAL-0089",
        cedantNpi: "FICTIF-BEN-2026-0003",
        cedantNom: "Koffi Mensah",
        cessionnaireNpi: "FICTIF-BEN-2026-0050",
        cessionnaireNom: "Aimé Houndégbé",
        notaireId: "Me Christian Agbossou",
        prixFcfa: 4500000,
        statut: "INITIEE_VERROUILLEE",
        statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
        quittanceSequestreRef: "SEQUESTRE-DGTCP-2026-90412",
        hashPreuve: "0xa89f3320c74d8129e9f1a09374026da4e7710bcf",
        dateCreation: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    this.conventions = [
      {
        id: "CONV-001",
        codeConvention: "CONV-VIL-2026-042",
        parcelleCode: "OUI-0421",
        certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
        certificatMairieHash: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
        agentNpi: "FICTIF-BEN-2026-0045",
        agentNom: "Mamadou Bio (Agent Foncier Assermenté)",
        vendeurNpi: "FICTIF-BEN-2026-0041",
        vendeurNom: "Germain Dossou",
        acheteurNpi: "FICTIF-BEN-2026-0003",
        acheteurNom: "Koffi Mensah",
        commune: "Ouidah",
        village: "Pahou",
        surfaceM2: 1250,
        prixFcfa: 4500000,
        photosBornesCount: 4,
        temoignagesVocaux: [
          { temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24 },
          { temoinNom: "Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45 },
        ],
        statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
        dossierHashSha256: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        dateSignature: "2026-02-10T14:30:00.000Z",
      },
    ];
    this.actes = [
      {
        id: "ACT-001",
        referenceActe: "TF-OUIDAH-2026-104",
        parcelleCode: "OUI-0104",
        typeActe: "TITRE_FONCIER",
        signataire: "Mme Reine Houndété (Directrice ANDF)",
        hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        salt: "a1b2c3d4e5f67890",
        otsProof: "OTS-BTC-SEAL-E3B0C442",
        txBlockchainId: "0xbc887766554433221100aabbccddeeff",
        dateDepot: "2026-01-15T10:00:00.000Z",
      },
      {
        id: "ACT-002",
        referenceActe: "ATT-REC-OUIDAH-PAHOU-2024-081",
        parcelleCode: "OUI-0421",
        typeActe: "ATTESTATION_DETENTION_COUTUMIERE",
        signataire: "M. Christian Houetchenou (Maire de Ouidah) & ANDF",
        hashSha256: "0x89a4cf31e792b04f98124efb189a246813579bdf0246813579bdf0246813579b",
        salt: "b2c3d4e5f6a17890",
        otsProof: "OTS-BTC-ADC-OUIDAH-PAHOU-89A4CF31",
        txBlockchainId: "0xbc89a4cf31e792b04f98124efb189a246813579b",
        dateDepot: "2024-06-18T09:30:00.000Z",
      },
      {
        id: "ACT-003",
        referenceActe: "PV-BORNAGE-GPS-2026-0421",
        parcelleCode: "OUI-0421",
        typeActe: "PROCES_VERBAL_BORNAGE",
        signataire: "Mamadou Bio (Agent Foncier Assermenté NPI: FICTIF-BEN-2026-0045)",
        hashSha256: "0x4b7c1e9a3f2d80517e69ac24810bf23d8491a6204859c3a172e9058471b6329a",
        salt: "c3d4e5f6a1b28901",
        otsProof: "OTS-BTC-BORNAGE-OUI-0421-4B7C1E9A",
        txBlockchainId: "0xbc4b7c1e9a3f2d80517e69ac24810bf23d8491a",
        dateDepot: "2026-01-22T11:15:00.000Z",
      },
      {
        id: "ACT-004",
        referenceActe: "CARNET-FAMILLE-OUI-0421",
        parcelleCode: "OUI-0421",
        typeActe: "CARNET_FAMILLE_FONCIER",
        signataire: "Collectivité Familiale Germain Dossou & Notaire Instrumentaire",
        hashSha256: "0x12a9c3e4b78901f45678cd981234ef56789012ab34cd56ef78901234567890ab",
        salt: "d4e5f6a1b2c39012",
        otsProof: "OTS-BTC-CARNET-OUI-0421-12A9C3E4",
        txBlockchainId: "0xbc12a9c3e4b78901f45678cd981234ef56789012",
        dateDepot: "2026-02-01T15:00:00.000Z",
      },
    ];
    this.hypotheques = [];
    this.certificatsCommune = [
      {
        id: "CERTIF-001",
        codeCertificat: "CERTIF-COMMUNE-OUI-0421-2026",
        codeParcelle: "OUI-0421",
        commune: "Ouidah",
        arrondissement: "Pahou",
        prixAcquisitionInitial: 2000000,
        prixFixeFcfa: 4500000,
        travauxDeductibles: 500000,
        plusValueNette: 2000000,
        taxeCalculeeFcfa: 100000,
        quittanceTresorRef: "TRESOR-DGTCP-2026-88124",
        modePaiement: "TRESORPAY",
        statutPaiement: "PAYE_TRESOR_PUBLIC",
        agentMairieNpi: "FICTIF-BEN-2026-0033",
        agentMairieNom: "Sètondji Gbedji (Chef Service Foncier)",
        hashSha256: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
        otsProof: "OTS-BTC-MAIRIE-OUIDAH-3F5C9E2B",
        txBlockchainId: "0xbc3f5c9e2b1840ab3d90f234acfe7b11d94821a7",
        dateEmission: "2026-02-09T11:20:00.000Z",
      },
      {
        id: "CERTIF-002",
        codeCertificat: "CERTIF-COMMUNE-OUI-0104-2026",
        codeParcelle: "OUI-0104",
        commune: "Ouidah",
        arrondissement: "Ouidah I",
        prixAcquisitionInitial: 30000000,
        prixFixeFcfa: 48000000,
        travauxDeductibles: 3000000,
        plusValueNette: 15000000,
        taxeCalculeeFcfa: 750000,
        quittanceTresorRef: "TRESOR-DGTCP-2026-10492",
        modePaiement: "TRESORPAY",
        statutPaiement: "PAYE_TRESOR_PUBLIC",
        agentMairieNpi: "FICTIF-BEN-2026-0033",
        agentMairieNom: "Sètondji Gbedji (Chef Service Foncier)",
        hashSha256: "0x7a2d8e4c9b101112131415161718192021222324252627282930313233343536",
        otsProof: "OTS-BTC-MAIRIE-OUIDAH-7A2D8E4C",
        txBlockchainId: "0xbc7a2d8e4c9b1011121314151617181920212223",
        dateEmission: "2026-02-12T14:45:00.000Z",
      },
    ];
    this.litiges = [
      {
        id: "LIT-001",
        referenceOrdonnance: "ORD-CSAF-2026/0412",
        parcelleCode: "LIT-ALL-005",
        demandeurNom: "Succession Gbénou c/ Hounkpatin",
        demandeurNpi: "FICTIF-BEN-2026-0777",
        motif: "Revendication successorale coutumière et contestation de limite parcellaire",
        juridiction: "Cour Spéciale des Affaires Foncières (CSAF - Cotonou)",
        statut: "GEL_CONSERVATOIRE",
        magistratNom: "Juge Antoine Sossa",
        dateOuverture: "2026-01-15T09:00:00.000Z",
        hashSha256: "0x8e21abf048d42398516e87bc1284a71994e6c382103f56",
      },
    ];
  }
}

// Singleton d'accès aux données
export const anyigbaRepo = new AnyigbaRepository();
