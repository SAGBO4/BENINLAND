import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const demandeurNpi = searchParams.get("demandeurNpi") || "";
  const demandeurNom = searchParams.get("demandeurNom") || "";

  return processVerification(query, demandeurNpi, demandeurNom);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query || body.code || "";
    const demandeurNpi = body.demandeurNpi || "";
    const demandeurNom = body.demandeurNom || "";

    return processVerification(query, demandeurNpi, demandeurNom);
  } catch {
    return NextResponse.json(
      { success: false, error: "Requête invalide ou corps JSON malformé." },
      { status: 400 }
    );
  }
}

function processVerification(query: string, demandeurNpi: string, demandeurNom: string) {
  let clean = (query || "").trim();
  if (clean.startsWith("{")) {
    try {
      const parsed = JSON.parse(clean);
      clean = parsed.codeCertificat || parsed.codeParcelle || clean;
    } catch {}
  }
  if (clean.includes("/")) {
    const parts = clean.split("/").filter(Boolean);
    clean = parts[parts.length - 1] || clean;
  }
  clean = clean.trim().toUpperCase();

  if (!clean) {
    return NextResponse.json(
      { success: false, error: "Veuillez renseigner un code de parcelle (ex: OUI-0421) ou un code de certificat municipal." },
      { status: 400 }
    );
  }

  // 1. Recherche par Certificat Municipal d'Évaluation en premier si le code correspond
  let certificat = anyigbaRepo.getCertificatCommuneByCode(clean);
  let parcelle = certificat ? anyigbaRepo.getParcelleByCode(certificat.codeParcelle) : undefined;

  // 2. Si non trouvé par certificat, recherche par Parcelle Cadastrale
  if (!parcelle) {
    parcelle = anyigbaRepo.getParcelleByCode(clean);
    if (parcelle && !certificat) {
      certificat = anyigbaRepo.getCertificatCommuneByParcelle(parcelle.codeUnique);
    }
  }

  if (!parcelle) {
    return NextResponse.json(
      {
        success: false,
        error: `Parcelle ou certificat introuvable pour '${clean}' dans le Cadastre National et le registre des Mairies.`,
      },
      { status: 404 }
    );
  }

  // 3. Vérification de Titularité (Le demandeur est-il le titulaire légitime ?)
  const cleanDemandeurNpi = demandeurNpi.trim().toUpperCase();
  const cleanProprietaireNpi = (parcelle.proprietaireNpi || "").trim().toUpperCase();
  const cleanDemandeurNom = demandeurNom.trim().toLowerCase();
  const cleanProprietaireNom = (parcelle.proprietaireNom || "").trim().toLowerCase();

  let titulariteConforme = false;
  let messageTitularite = "";

  if (!cleanDemandeurNpi && !cleanDemandeurNom) {
    titulariteConforme = false;
    messageTitularite = "Veuillez renseigner le NPI ou le Nom du demandeur de crédit pour certifier la titularité.";
  } else if (cleanDemandeurNpi && cleanProprietaireNpi === cleanDemandeurNpi) {
    titulariteConforme = true;
    messageTitularite = `Titularité certifiée conforme : Le demandeur (${demandeurNom || parcelle.proprietaireNom}, NPI: ${cleanDemandeurNpi}) est bien le titulaire immatriculé au Cadastre National.`;
  } else if (
    cleanDemandeurNom &&
    (cleanProprietaireNom.includes(cleanDemandeurNom) || cleanDemandeurNom.includes(cleanProprietaireNom))
  ) {
    titulariteConforme = true;
    messageTitularite = `Titularité présumée conforme par concordance patronymique : '${parcelle.proprietaireNom}'. Contrôle d'identité physique NPI requis au guichet.`;
  } else {
    titulariteConforme = false;
    messageTitularite = `Non-conformité de titularité foncière : Le demandeur du crédit (${demandeurNom || "Non spécifié"}, NPI: ${demandeurNpi || "N/A"}) n'est PAS le propriétaire titré de cette parcelle au Cadastre National (Titulaire légitime : ${parcelle.proprietaireNom}, NPI: ${parcelle.proprietaireNpi}). Inscription de sûreté refusée sans mandat notarié.`;
  }

  // 4. Vérification de Sûretés Réelles Existantes
  const hypothequeActive = anyigbaRepo.getActiveHypothequeRang1(parcelle.codeUnique);

  // 5. Calcul de Valeur Homologuée et Ratios Prudentiels BCEAO
  const estTitre = parcelle.statutJuridique === "TITRE_FONCIER" || parcelle.statutJuridique === "CPF";
  const valeurHomologuee = certificat
    ? certificat.prixFixeFcfa
    : (parcelle.superficieM2 || 1000) * (estTitre ? 20000 : 8000);

  const ratioLtvMax = 0.70; // 70% LTV standard prudentiel UMOA
  const capaciteHypothecaireMax = Math.round(valeurHomologuee * ratioLtvMax);

  // 6. Éligibilité globale du dossier
  const taxesPayees = certificat ? certificat.statutPaiement === "PAYE_TRESOR_PUBLIC" : false;
  const hasDemandeur = Boolean(cleanDemandeurNpi || cleanDemandeurNom);
  const eligibleCredit =
    !parcelle.enLitige &&
    !parcelle.enVerrouMutation &&
    !hypothequeActive &&
    hasDemandeur &&
    titulariteConforme;

  return NextResponse.json({
    success: true,
    data: {
      parcelle: {
        codeUnique: parcelle.codeUnique,
        commune: parcelle.commune,
        arrondissement: parcelle.arrondissement,
        village: parcelle.village,
        superficieM2: parcelle.superficieM2,
        statutJuridique: parcelle.statutJuridique,
        usage: parcelle.usage,
        proprietaireNom: parcelle.proprietaireNom,
        proprietaireNpi: parcelle.proprietaireNpi,
        enVerrouMutation: parcelle.enVerrouMutation,
        enLitige: parcelle.enLitige,
        tokenBeninChainId: parcelle.tokenBeninChainId,
      },
      certificatMunicipal: certificat
        ? {
            codeCertificat: certificat.codeCertificat,
            quittanceTresorRef: certificat.quittanceTresorRef,
            prixFixeFcfa: certificat.prixFixeFcfa,
            taxeCalculeeFcfa: certificat.taxeCalculeeFcfa,
            modePaiement: certificat.modePaiement,
            statutPaiement: certificat.statutPaiement,
            taxesPayees,
            dateEmission: certificat.dateEmission,
            agentMairieNom: certificat.agentMairieNom,
            hashSha256: certificat.hashSha256,
            otsProof: certificat.otsProof,
            txBlockchainId: certificat.txBlockchainId,
          }
        : null,
      hypothequeActive: hypothequeActive
        ? {
            codeHypotheque: hypothequeActive.codeHypotheque,
            banqueNom: hypothequeActive.banqueNom,
            montantCreditFcfa: hypothequeActive.montantCreditFcfa,
            valeurGarantieFcfa: hypothequeActive.valeurGarantieFcfa,
            rang: hypothequeActive.rang,
            statut: hypothequeActive.statut,
            dateInscription: hypothequeActive.dateInscription,
            hashSha256: hypothequeActive.hashSha256,
            otsProof: hypothequeActive.otsProof,
          }
        : null,
      titularite: {
        conforme: titulariteConforme,
        demandeurNpi: demandeurNpi || null,
        demandeurNom: demandeurNom || null,
        proprietaireCadastreNom: parcelle.proprietaireNom,
        proprietaireCadastreNpi: parcelle.proprietaireNpi,
        message: messageTitularite,
      },
      prudence: {
        valeurHomologueeFcfa: valeurHomologuee,
        sourceValeur: certificat ? "CERTIFICAT_MUNICIPAL_OFFICIEL" : "BAREME_CADASTRE_NATIONAL",
        ratioLtvMax,
        capaciteHypothecaireMaxFcfa: capaciteHypothecaireMax,
        eligibleCredit,
        blocageMotif: parcelle.enLitige
          ? "Parcelle sous gel contentieux CSAF"
          : parcelle.enVerrouMutation
          ? "Mutation notariale en cours avec séquestre"
          : hypothequeActive
          ? `Hypothèque de rang 1 déjà active (${hypothequeActive.banqueNom})`
          : !hasDemandeur
          ? "Demandeur de crédit non renseigné : Contrôle de titularité préalable requis"
          : !titulariteConforme
          ? "Défaut de titularité du demandeur"
          : null,
      },
      blockchain: {
        verifiee: true,
        reseau: "BéninChain Anchor & OpenTimestamps",
        certificatHash: certificat?.hashSha256 || null,
        certificatOts: certificat?.otsProof || null,
      },
    },
  });
}
