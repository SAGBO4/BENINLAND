import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") || searchParams.get("numero");

  if (code) {
    const parcelle = anyigbaRepo.getParcelleByCode(code);
    if (!parcelle) {
      return NextResponse.json(
        { success: false, error: "Parcelle non trouvée au cadastre" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: parcelle });
  }

  const parcelles = anyigbaRepo.getAllParcelles();
  return NextResponse.json({ success: true, count: parcelles.length, data: parcelles });
}
