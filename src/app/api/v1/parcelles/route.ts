import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { maskIdentity, maskTelephone } from "@/lib/utils";

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
    const sanitized = {
      ...parcelle,
      proprietaireNom: maskIdentity(parcelle.proprietaireNom),
      proprietaireTel: maskTelephone(parcelle.proprietaireTel),
    };
    return NextResponse.json({ success: true, data: sanitized });
  }

  const parcelles = anyigbaRepo.getAllParcelles();
  const sanitized = parcelles.map((p) => ({
    ...p,
    proprietaireNom: maskIdentity(p.proprietaireNom),
    proprietaireTel: maskTelephone(p.proprietaireTel),
  }));

  return NextResponse.json({ success: true, count: sanitized.length, data: sanitized });
}
