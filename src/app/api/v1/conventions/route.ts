import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { z } from "zod";

const ConventionSchema = z.object({
  agentNpi: z.string().min(5),
  agentNom: z.string().min(2),
  vendeurNpi: z.string().min(5),
  vendeurNom: z.string().min(2),
  acheteurNpi: z.string().min(5),
  acheteurNom: z.string().min(2),
  commune: z.string().min(2),
  village: z.string().min(2),
  surfaceM2: z.number().positive(),
  prixFcfa: z.number().positive(),
  temoignagesVocaux: z.array(z.any()).optional(),
});

export async function GET() {
  const conventions = anyigbaRepo.getAllConventions();
  return NextResponse.json({ success: true, count: conventions.length, data: conventions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ConventionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données de convention invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const convention = anyigbaRepo.createConventionAssistee(parsed.data);
    return NextResponse.json({ success: true, data: convention }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur", details: String(error) },
      { status: 500 }
    );
  }
}
