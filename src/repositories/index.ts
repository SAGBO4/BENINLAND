import { INITIAL_PARCELLES, SeedParcelle } from "@/db/seed/data";
import { calculateDocumentHash, generateBlockchainProof } from "@/lib/hash";
import { sendSimulatedSms } from "@/lib/channels";

export interface MutationRecord {
  id: string;
  codeMutation: string;
  parcelleCode: string;
  cedantNpi: string;
  cedantNom: string;
  cessionnaireNpi: string;
  cessionnaireNom: string;
  notaireId: string;
  prixFcfa: number;
  statut: "INITIEE_VERROUILLEE" | "PAIEMENT_SEQUESTRE" | "VALIDEE_ANDF" | "REJETEE";
  statutSequestre: "EN_ATTENTE" | "FONDS_BLOQUES_SEQUESTRE" | "LIBERE_VENDEUR" | "REMBOURSE_ACHETEUR";
  valideAndfLe?: string;
  hashPreuve: string;
  dateCreation: string;
}

export interface ConventionRecord {
  id: string;
  codeConvention: string;
  parcelleCode?: string;
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

// État mémoire persistant (Règle d'or : La démo ne plante jamais)
class AnyigbaRepository {
  private parcelles: SeedParcelle[] = JSON.parse(JSON.stringify(INITIAL_PARCELLES));
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
      hashPreuve: "0xa89f3320c74d8129e9f1a09374026da4e7710bcf",
      dateCreation: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  private conventions: ConventionRecord[] = [];
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
  ];

  public getAllParcelles(): SeedParcelle[] {
    return [...this.parcelles];
  }

  public getParcelleByCode(code: string): SeedParcelle | undefined {
    return this.parcelles.find((p) => p.codeUnique.toUpperCase() === code.trim().toUpperCase());
  }

  public getAllMutations(): MutationRecord[] {
    return [...this.mutations];
  }

  public getAllConventions(): ConventionRecord[] {
    return [...this.conventions];
  }

  public getAllActes(): ActeRecord[] {
    return [...this.actes];
  }

  /**
   * Tente d'initier une mutation avec pose de verrou anti-double-vente.
   * Lève une erreur explicite si la parcelle est déjà verrouillée ou en litige.
   */
  public initiateMutation(params: {
    parcelleCode: string;
    cedantNpi: string;
    cedantNom: string;
    cessionnaireNpi: string;
    cessionnaireNom: string;
    notaireId: string;
    prixFcfa: number;
  }): { success: boolean; mutation?: MutationRecord; error?: string } {
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

    // Pose du verrou
    parcelle.enVerrouMutation = true;

    const { hash } = calculateDocumentHash({
      parcelleCode: params.parcelleCode,
      cedant: params.cedantNpi,
      cessionnaire: params.cessionnaireNpi,
      prix: params.prixFcfa,
      date: new Date().toISOString(),
    });

    const mutation: MutationRecord = {
      id: `MUT-${Date.now().toString().slice(-4)}`,
      codeMutation: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      parcelleCode: params.parcelleCode,
      cedantNpi: params.cedantNpi,
      cedantNom: params.cedantNom,
      cessionnaireNpi: params.cessionnaireNpi,
      cessionnaireNom: params.cessionnaireNom,
      notaireId: params.notaireId,
      prixFcfa: params.prixFcfa,
      statut: "INITIEE_VERROUILLEE",
      statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
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
    temoignagesVocaux?: Array<{
      temoinNom: string;
      qualite: string;
      langue: string;
      dureeSecondes: number;
    }>;
  }): ConventionRecord {
    const { hash } = calculateDocumentHash(params);
    const conv: ConventionRecord = {
      id: `CONV-${Date.now().toString().slice(-4)}`,
      codeConvention: `CONV-VIL-2026-${Math.floor(100 + Math.random() * 900)}`,
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
        hashPreuve: "0xa89f3320c74d8129e9f1a09374026da4e7710bcf",
        dateCreation: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    this.conventions = [];
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
    ];
  }
}

// Singleton d'accès aux données
export const anyigbaRepo = new AnyigbaRepository();
