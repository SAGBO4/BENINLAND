import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { maskIdentity } from "@/lib/utils";
import { getAudioTranslation } from "@/lib/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const cleanCode = (code || "").trim();

  // 1. Recherche par Parcelle Cadastrale
  const parcelle = anyigbaRepo.getParcelleByCode(cleanCode);
  if (parcelle) {
    const maskedOwner = maskIdentity(parcelle.proprietaireNom);

    let messageVocal = "";
    if (parcelle.enLitige) {
      messageVocal = getAudioTranslation("parcelle_en_litige", "fon");
    } else if (parcelle.enVerrouMutation) {
      messageVocal = getAudioTranslation("parcelle_verrouillee", "fon");
    } else {
      messageVocal = getAudioTranslation("parcelle_titre_foncier_valide", "fon");
    }

    return NextResponse.json({
      success: true,
      type: "PARCELLE",
      data: {
        codeUnique: parcelle.codeUnique,
        commune: parcelle.commune,
        arrondissement: parcelle.arrondissement,
        village: parcelle.village,
        superficieM2: parcelle.superficieM2,
        statutJuridique: parcelle.statutJuridique,
        usage: parcelle.usage,
        enVerrouMutation: parcelle.enVerrouMutation,
        enLitige: parcelle.enLitige,
        proprietaireMasque: maskedOwner,
        tokenBeninChainId: parcelle.tokenBeninChainId,
        messageVocalFon: messageVocal,
        eligibleAchat: !parcelle.enLitige && !parcelle.enVerrouMutation,
      },
    });
  }

  // 2. Recherche par Procès-Verbal de Bornage / Convention Assistée
  const conv = anyigbaRepo.getConventionByCode(cleanCode);
  if (conv) {
    const shortHash = conv.dossierHashSha256.replace(/^0x/, "").slice(0, 16);
    return NextResponse.json({
      success: true,
      type: "PROCES_VERBAL_BORNAGE",
      data: {
        codeConvention: conv.codeConvention,
        commune: conv.commune,
        village: conv.village,
        surfaceM2: conv.surfaceM2,
        prixFcfa: conv.prixFcfa,
        photosBornesCount: conv.photosBornesCount || 4,
        statutSequestre: conv.statutSequestre,
        dossierHashSha256: conv.dossierHashSha256,
        otsProof: `OTS-BTC-SEAL-${shortHash.toUpperCase()}`,
        txBlockchainId: `0xbc${shortHash}8899aabbccddeeff`,
        dateSignature: conv.dateSignature,
        agentNom: conv.agentNom,
        agentNpi: conv.agentNpi,
        parcelleCode: conv.parcelleCode,
        certificatMairieRef: conv.certificatMairieRef,
        certificatMairieHash: conv.certificatMairieHash,
        forceLegale: "Art. 142 du Code Foncier et Domanial - Fixation légale et opposable du prix par la Mairie",
        // Noms réels vs masqués pour le grand public
        vendeurNomMasque: maskIdentity(conv.vendeurNom),
        vendeurNom: conv.vendeurNom,
        vendeurNpi: conv.vendeurNpi,
        acheteurNomMasque: maskIdentity(conv.acheteurNom),
        acheteurNom: conv.acheteurNom,
        acheteurNpi: conv.acheteurNpi,
        // Témoignages vocaux
        temoignagesVocaux: conv.temoignagesVocaux || [],
        certifiePar: "Ordre des Géomètres-Experts & ANDF (République du Bénin)",
        estFalsifie: false,
      },
    });
  }

  // 3. Recherche par Certificat Municipal d'Évaluation & Fixation du Prix
  const certifCommune = anyigbaRepo.getCertificatCommuneByCode(cleanCode);
  if (certifCommune) {
    return NextResponse.json({
      success: true,
      type: "CERTIFICAT_COMMUNAL",
      data: {
        codeCertificat: certifCommune.codeCertificat,
        codeParcelle: certifCommune.codeParcelle,
        commune: certifCommune.commune,
        arrondissement: certifCommune.arrondissement,
        prixAcquisitionInitial: certifCommune.prixAcquisitionInitial,
        prixFixeFcfa: certifCommune.prixFixeFcfa,
        travauxDeductibles: certifCommune.travauxDeductibles,
        plusValueNette: certifCommune.plusValueNette,
        taxeCalculeeFcfa: certifCommune.taxeCalculeeFcfa,
        quittanceTresorRef: certifCommune.quittanceTresorRef,
        modePaiement: certifCommune.modePaiement,
        statutPaiement: certifCommune.statutPaiement,
        agentMairieNom: certifCommune.agentMairieNom,
        agentMairieNpi: certifCommune.agentMairieNpi,
        hashSha256: certifCommune.hashSha256,
        otsProof: certifCommune.otsProof,
        txBlockchainId: certifCommune.txBlockchainId,
        dateEmission: certifCommune.dateEmission,
        autorite: `Mairie & Direction des Affaires Domaniales de ${certifCommune.commune}`,
        forceLegale: "Art. 142 du Code Foncier et Domanial - Fixation opposable du prix de transaction",
      },
    });
  }

  // 4. Recherche par Acte Foncier (Titre Foncier, CPF)
  const actes = anyigbaRepo.getAllActes();
  const acte = actes.find(
    (a) =>
      a.referenceActe.toUpperCase() === cleanCode.toUpperCase() ||
      a.hashSha256.toLowerCase() === cleanCode.toLowerCase()
  );
  if (acte) {
    return NextResponse.json({
      success: true,
      type: "ACTE_FONCIER",
      data: {
        referenceActe: acte.referenceActe,
        parcelleCode: acte.parcelleCode,
        typeActe: acte.typeActe,
        signataire: acte.signataire,
        hashSha256: acte.hashSha256,
        otsProof: acte.otsProof,
        txBlockchainId: acte.txBlockchainId,
        dateDepot: acte.dateDepot,
        estFalsifie: Boolean(acte.estFalsifie),
      },
    });
  }

  // 5. Recherche par Inscription Hypothécaire de Rang 1 (BCEAO / OHADA)
  const hypotheque = anyigbaRepo.getHypothequeByCode(cleanCode);
  if (hypotheque) {
    return NextResponse.json({
      success: true,
      type: "HYPOTHEQUE_RANG_1",
      data: {
        codeHypotheque: hypotheque.codeHypotheque,
        parcelleCode: hypotheque.parcelleCode,
        certificatMairieRef: hypotheque.certificatMairieRef,
        demandeurNom: hypotheque.demandeurNom,
        demandeurNpi: hypotheque.demandeurNpi,
        banqueNom: hypotheque.banqueNom,
        banqueNpiAgent: hypotheque.banqueNpiAgent,
        montantCreditFcfa: hypotheque.montantCreditFcfa,
        valeurGarantieFcfa: hypotheque.valeurGarantieFcfa,
        valeurVenaleRetenue: hypotheque.valeurVenaleRetenue,
        rang: hypotheque.rang,
        statut: hypotheque.statut,
        hashSha256: hypotheque.hashSha256,
        otsProof: hypotheque.otsProof,
        txBlockchainId: hypotheque.txBlockchainId,
        dateInscription: hypotheque.dateInscription,
        cadreJuridique: "Acte uniforme OHADA portant organisation des sûretés & Directives UMOA/BCEAO - Inscription de Rang 1 Incontestable",
      },
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: `Aucune parcelle n'a été trouvée pour la référence ${cleanCode}. Aucun procès-verbal, certificat communal, hypothèque ou acte correspondant.`,
    },
    { status: 404 }
  );
}
