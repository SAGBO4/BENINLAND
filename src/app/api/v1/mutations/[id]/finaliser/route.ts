import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const officerName = body.officerName || "Mme Reine Houndété (Directrice ANDF)";

    const result = anyigbaRepo.finalizeMutationByAndf(id, officerName);

    if (!result.success) {
      const status = (result.error?.includes("DEJA_VALIDEE") || result.error?.includes("STATUT_INVALIDE")) ? 409 : 400;
      return NextResponse.json({ success: false, error: result.error }, { status });
    }

    return NextResponse.json({
      success: true,
      message: "Mutation validée par l'ANDF. Le titre est mis à jour et les fonds du séquestre sont libérés.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}
