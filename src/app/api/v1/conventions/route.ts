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
  surfaceM2: z.number().positive().max(114763000000),
  prixFcfa: z.number().positive().max(1000000000000),
  parcelleCode: z.string().optional(),
  certificatMairieRef: z.string().optional(),
  certificatMairieHash: z.string().optional(),
  temoignagesVocaux: z.array(z.any()).optional(),
}).refine((data) => data.vendeurNpi.trim().toUpperCase() !== data.acheteurNpi.trim().toUpperCase(), {
  message: "AUTO_CESSION_INTERDITE: Le vendeur et l'acheteur ne peuvent pas avoir le même NPI.",
  path: ["acheteurNpi"],
});

export async function GET() {
  const conventions = anyigbaRepo.getAllConventions();
  return NextResponse.json({ success: true, count: conventions.length, data: conventions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Payload JSON invalide" }, { status: 400 });
    }

    const parsed = ConventionSchema.safeParse(body);

    if (!parsed.success) {
      const hasAutoCession = parsed.error.issues.some((i) => i.message.includes("AUTO_CESSION_INTERDITE"));
      const errorMessage = hasAutoCession
        ? "AUTO_CESSION_INTERDITE: Le vendeur et l'acheteur ne peuvent pas avoir le même NPI."
        : "Données de convention invalides";
      return NextResponse.json(
        { success: false, error: errorMessage, details: parsed.error.format() },
        { status: 400 }
      );
    }

    const convention = anyigbaRepo.createConventionAssistee(parsed.data);
    return NextResponse.json({ success: true, data: convention }, { status: 201 });
  } catch (error: any) {
    const message = error?.message || "Erreur serveur";
    const status =
      message.includes("AUTO_CESSION_INTERDITE") ||
      message.includes("SURFACE_ABERRANTE") ||
      message.includes("PRIX_INVALIDE") ||
      message.includes("PRIX_NON_CONFORME_MAIRIE")
        ? 400
        : 500;
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
