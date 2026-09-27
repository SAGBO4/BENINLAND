import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { z } from "zod";

const MutationSchema = z.object({
  parcelleCode: z.string().min(3),
  certificatMairieRef: z.string().optional(),
  certificatMairieHash: z.string().optional(),
  cedantNpi: z.string().min(5),
  cedantNom: z.string().min(2),
  cessionnaireNpi: z.string().min(5),
  cessionnaireNom: z.string().min(2),
  notaireId: z.string().min(2),
  prixFcfa: z.number().positive(),
});

export async function GET() {
  const mutations = anyigbaRepo.getAllMutations();
  return NextResponse.json({ success: true, count: mutations.length, data: mutations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Payload JSON invalide" }, { status: 400 });
    }

    const parsed = MutationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Champs invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    if (parsed.data.cedantNpi.trim() === parsed.data.cessionnaireNpi.trim()) {
      return NextResponse.json(
        { success: false, error: "AUTO_CESSION_INTERDITE: Le cédant et le cessionnaire ne peuvent pas avoir le même NPI." },
        { status: 400 }
      );
    }

    const result = anyigbaRepo.initiateMutation(parsed.data);

    if (!result.success) {
      let status = 409;
      if (result.error?.includes("PROPRIETAIRE_NON_CONFORME")) status = 403;
      if (result.error?.includes("PARCELLE_INEXISTANTE")) status = 404;
      if (result.error?.includes("AUTO_CESSION_INTERDITE") || result.error?.includes("PRIX_INVALIDE") || result.error?.includes("PRIX_NON_CONFORME_MAIRIE")) status = 400;

      return NextResponse.json(
        { success: false, error: result.error },
        { status }
      );
    }

    return NextResponse.json({ success: true, data: result.mutation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur interne", details: String(error) },
      { status: 500 }
    );
  }
}
