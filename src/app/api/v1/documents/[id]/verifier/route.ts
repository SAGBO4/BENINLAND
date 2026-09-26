import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const actes = anyigbaRepo.getAllActes();
  const acte = actes.find((a) => a.referenceActe.toUpperCase() === id.toUpperCase() || a.id === id);

  if (!acte) {
    return NextResponse.json(
      { success: false, error: "Document non trouvé dans le coffre-fort des actes" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
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
      statutPreuve: acte.estFalsifie ? "ALERTE_FRAUDE_HASH_ALTERE" : "INTEGRITE_SOUVERAINE_GARANTIE",
    },
  });
}
