import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { z } from "zod";

const CreateCertificatSchema = z.object({
  codeParcelle: z.string().min(3),
  commune: z.string().min(2),
  arrondissement: z.string().optional(),
  prixAcquisitionInitial: z.number().nonnegative(),
  prixFixeFcfa: z.number().positive(),
  travauxDeductibles: z.number().nonnegative().optional(),
  modePaiement: z.enum(["TRESORPAY", "MTN_MOMO", "MOOV_MONEY"]).optional(),
  agentMairieNpi: z.string().optional(),
  agentMairieNom: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parcelle = searchParams.get("parcelle");

  if (parcelle) {
    const certif = anyigbaRepo.getCertificatCommuneByParcelle(parcelle);
    if (!certif) {
      return NextResponse.json({ success: false, error: "Certificat non trouvé pour cette parcelle" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: certif });
  }

  const certificats = anyigbaRepo.getAllCertificatsCommune();
  return NextResponse.json({ success: true, count: certificats.length, data: certificats });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Payload JSON invalide" }, { status: 400 });
    }

    const parsed = CreateCertificatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Données de certificat invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const certificat = anyigbaRepo.createCertificatCommune(parsed.data);
    return NextResponse.json({ success: true, data: certificat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
