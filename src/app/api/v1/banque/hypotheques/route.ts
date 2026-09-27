import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parcelle = searchParams.get("parcelle");

  if (parcelle) {
    const list = anyigbaRepo.getHypothequesByParcelle(parcelle);
    return NextResponse.json({ success: true, count: list.length, data: list });
  }

  const all = anyigbaRepo.getAllHypotheques();
  return NextResponse.json({ success: true, count: all.length, data: all });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      parcelleCode,
      demandeurNom,
      demandeurNpi,
      banqueNom,
      banqueNpiAgent,
      montantCreditFcfa,
      valeurGarantieFcfa,
      certificatMairieRef,
    } = body;

    if (!parcelleCode) {
      return NextResponse.json(
        { success: false, error: "Le code de la parcelle est obligatoire." },
        { status: 400 }
      );
    }

    if (!demandeurNom || !demandeurNpi) {
      return NextResponse.json(
        { success: false, error: "L'identité complète (Nom et NPI) du demandeur de crédit est requise." },
        { status: 400 }
      );
    }

    if (!montantCreditFcfa || Number(montantCreditFcfa) <= 0) {
      return NextResponse.json(
        { success: false, error: "Le montant du crédit doit être un nombre strictement positif." },
        { status: 400 }
      );
    }

    const hypotheque = anyigbaRepo.inscrireHypotheque({
      parcelleCode,
      demandeurNom,
      demandeurNpi,
      banqueNom: banqueNom || "Banque Nationale du Bénin (BNB)",
      banqueNpiAgent: banqueNpiAgent || "FICTIF-BEN-2026-0700",
      montantCreditFcfa: Number(montantCreditFcfa),
      valeurGarantieFcfa: valeurGarantieFcfa ? Number(valeurGarantieFcfa) : Number(montantCreditFcfa),
      certificatMairieRef,
    });

    return NextResponse.json({
      success: true,
      message: `Hypothèque de Rang 1 (${hypotheque.codeHypotheque}) inscrite avec succès sur la parcelle ${hypotheque.parcelleCode}. Preuve scellée sur BéninChain / OpenTimestamps.`,
      data: hypotheque,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erreur lors de l'inscription de l'hypothèque." },
      { status: 422 }
    );
  }
}
