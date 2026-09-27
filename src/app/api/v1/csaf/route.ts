import { NextResponse } from "next/server";
import { anyigbaRepo } from "@/repositories/index";
import { db } from "@/db";
import { litiges, parcelles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const CsafRequestSchema = z.object({
  action: z.enum(["GEL", "MAINLEVEE"]).default("GEL"),
  parcelleCode: z.string().min(3),
  demandeurNom: z.string().optional(),
  demandeurNpi: z.string().optional(),
  motif: z.string().optional(),
  magistratNom: z.string().optional(),
  referenceOrdonnance: z.string().optional(),
  certificatMairieRef: z.string().optional(),
  quittanceTresorRef: z.string().optional(),
});

export async function GET() {
  const litigesList = anyigbaRepo.getAllLitiges();
  return NextResponse.json({
    success: true,
    count: litigesList.length,
    data: litigesList,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Payload JSON invalide" }, { status: 400 });
    }

    const parsed = CsafRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Paramètres de requête CSAF invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      action,
      parcelleCode,
      demandeurNom,
      demandeurNpi,
      motif,
      magistratNom,
      referenceOrdonnance,
      certificatMairieRef,
      quittanceTresorRef,
    } = parsed.data;
    const cleanCode = parcelleCode.trim().toUpperCase();

    if (action === "GEL") {
      if (!demandeurNom || !motif) {
        return NextResponse.json(
          { success: false, error: "Le nom du demandeur et le motif juridique sont obligatoires pour un gel conservatoire." },
          { status: 400 }
        );
      }

      const result = anyigbaRepo.inscrireGelConservatoire({
        parcelleCode: cleanCode,
        demandeurNom,
        demandeurNpi,
        motif,
        magistratNom,
        referenceOrdonnance,
        certificatMairieRef,
        quittanceTresorRef,
      });

      if (!result.success) {
        const status = result.error?.includes("PARCELLE_INEXISTANTE") ? 404 : 400;
        return NextResponse.json({ success: false, error: result.error }, { status });
      }

      // Persistance secondaire dans PostgreSQL si disponible
      try {
        const found = await db.select().from(parcelles).where(eq(parcelles.codeUnique, cleanCode)).limit(1);
        if (found.length > 0) {
          await db.update(parcelles).set({ enLitige: true }).where(eq(parcelles.codeUnique, cleanCode));
          await db.insert(litiges).values({
            parcelleId: found[0].id,
            demandeurNom,
            demandeurNpi: demandeurNpi || "NPI-NON-COMMUNIQUE",
            motif,
            juridiction: "CSAF_COTONOU",
            statut: "GEL_CONSERVATOIRE",
            ordonnanceUrl: result.litige?.referenceOrdonnance,
          });
        }
      } catch (dbErr) {
        console.warn("Base PostgreSQL indisponible pour le litige CSAF, conservé en mémoire:", dbErr);
      }

      return NextResponse.json(
        {
          success: true,
          message: `Ordonnance de gel conservatoire signée et opposable au cadastre pour la parcelle ${cleanCode}.`,
          data: result.litige,
        },
        { status: 201 }
      );
    }

    if (action === "MAINLEVEE") {
      const result = anyigbaRepo.leverGelConservatoire({
        parcelleCode: cleanCode,
        magistratNom,
      });

      if (!result.success) {
        const status = result.error?.includes("PARCELLE_INEXISTANTE") ? 404 : 400;
        return NextResponse.json({ success: false, error: result.error }, { status });
      }

      // Mainlevée dans PostgreSQL si disponible
      try {
        await db.update(parcelles).set({ enLitige: false }).where(eq(parcelles.codeUnique, cleanCode));
        const found = await db.select().from(parcelles).where(eq(parcelles.codeUnique, cleanCode)).limit(1);
        if (found.length > 0) {
          await db
            .update(litiges)
            .set({ statut: "LEVE", dateResolution: new Date() })
            .where(eq(litiges.parcelleId, found[0].id));
        }
      } catch (dbErr) {
        console.warn("Base PostgreSQL indisponible pour la mainlevée CSAF:", dbErr);
      }

      return NextResponse.json({
        success: true,
        message: `Jugement de mainlevée enregistré. Le gel conservatoire sur ${cleanCode} est levé au cadastre national.`,
      });
    }

    return NextResponse.json({ success: false, error: "Action CSAF non reconnue" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur interne lors du traitement CSAF", details: String(error) },
      { status: 500 }
    );
  }
}
