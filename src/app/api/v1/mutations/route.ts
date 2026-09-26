import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { z } from "zod";

const MutationSchema = z.object({
  parcelleCode: z.string().min(3),
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
    const body = await request.json();
    const parsed = MutationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Champs invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const result = anyigbaRepo.initiateMutation(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 409 } // 409 Conflict pour le verrou anti-double-vente !
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
