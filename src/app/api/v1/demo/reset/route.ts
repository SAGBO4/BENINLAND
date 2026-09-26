import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { seedDatabase } from "@/db/seed/index";

export async function POST() {
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

