import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { seedDatabase } from "@/db/seed/index";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_RESET !== "true") {
    return NextResponse.json(
      { success: false, error: "ACTION_INTERDITE: La réinitialisation de base est désactivée en environnement de production." },
      { status: 403 }
    );
  }

  anyigbaRepo.resetToDeterministicSeed();

  try {
    await seedDatabase();
  } catch (err) {
    console.warn("Avertissement seed Neon lors du reset :", err);
  }

  return NextResponse.json({
    success: true,
    message: "Base réinitialisée avec succès au seed déterministe 2026. État de départ restauré sur Neon PostgreSQL.",
  });
}

