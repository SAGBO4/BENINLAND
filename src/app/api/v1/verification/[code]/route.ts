import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { maskIdentity } from "@/lib/utils";
import { getAudioTranslation } from "@/lib/audio";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const parcelle = anyigbaRepo.getParcelleByCode(code);

  if (!parcelle) {
    return NextResponse.json(
      {
        success: false,
        error: `Aucune parcelle n'a été trouvée pour la référence ${code}.`,
      },
      { status: 404 }
    );
  }

  // Identité masquée conforme protection des données personnelles
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
