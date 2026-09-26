import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";

export async function POST() {
  anyigbaRepo.resetToDeterministicSeed();
  return NextResponse.json({
    success: true,
    message: "Base réinitialisée avec succès au seed déterministe 2026. État de départ restauré.",
  });
}
