import { NextResponse } from "next/server";
import { db } from "@/db";
import { utilisateurs } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { verifyPassword } from "@/lib/hash";
import { DEMO_USERS, UserRole, UserSession, ROLE_DASHBOARDS } from "@/lib/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, role } = body;

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error: "Veuillez renseigner votre identifiant ou NPI ANIP.",
        },
        { status: 400 }
      );
    }

    const cleanInput = String(identifier).trim();
    const cleanPass = typeof password === "string" ? password.trim() : "";

    // 1. Recherche dans la base de données PostgreSQL
    let dbUser: any = null;
    try {
      const results = await db
        .select()
        .from(utilisateurs)
        .where(
          or(
            eq(utilisateurs.npi, cleanInput),
            eq(utilisateurs.email, cleanInput.toLowerCase()),
            eq(utilisateurs.nom, cleanInput.toUpperCase())
          )
        )
        .limit(1);

      if (results.length > 0) {
        dbUser = results[0];
      }
    } catch (dbErr) {
      console.warn("Base PostgreSQL non disponible, vérification locale:", dbErr);
    }

    // 2. Si l'utilisateur est trouvé dans PostgreSQL
    if (dbUser) {
      // Contrôle du statut réglementaire
      if (dbUser.statutValidation === "EN_ATTENTE_VALIDATION") {
        return NextResponse.json(
          {
            success: false,
            error: `Votre compte (${dbUser.prenom} ${dbUser.nom} - NPI: ${dbUser.npi}) est en attente d'approbation par le Contrôleur National des Habilitations (IGAF). Veuillez patienter que votre statut soit certifié.`,
          },
          { status: 403 }
        );
      }

      if (dbUser.statutValidation === "REJETE") {
        return NextResponse.json(
          {
            success: false,
            error: `Demande d'habilitation refusée par le Contrôleur National. Motif : ${dbUser.motifRefus || "Dossier ou pièces non conformes."}`,
          },
          { status: 403 }
        );
      }

      if (dbUser.statutValidation === "SUSPENDU") {
        return NextResponse.json(
          {
            success: false,
            error: "Ce compte a été suspendu par mesure conservatoire de déontologie foncière.",
          },
          { status: 403 }
        );
      }

      // Vérification du mot de passe
      const isPasswordValid = verifyPassword(cleanPass, dbUser.passwordHash, dbUser.passwordSalt);

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: "Mot de passe incorrect. Veuillez vérifier votre saisie.",
          },
          { status: 401 }
        );
      }

      const userSession: UserSession = {
        npi: dbUser.npi,
        nom: dbUser.nom,
        prenom: dbUser.prenom,
        role: dbUser.role as UserRole,
        roleLabel: dbUser.roleLabel,
        titre: dbUser.titre,
        etablissementNom: dbUser.etablissementNom,
        commune: dbUser.commune,
        departement: dbUser.departement,
        badge: dbUser.badge,
        statutValidation: dbUser.statutValidation,
      };

      const redirectUrl = ROLE_DASHBOARDS[userSession.role] || "/espace/citoyen";

      return NextResponse.json({
        success: true,
        user: userSession,
        redirectUrl,
      });
    }

    // 3. Comptes officiels pré-configurés (Bénin 2026)
    const demoEntries = Object.entries(DEMO_USERS) as [UserRole, UserSession][];
    const foundDemo = demoEntries.find(
      ([rKey, u]) =>
        u.npi.toLowerCase() === cleanInput.toLowerCase() ||
        rKey.toLowerCase() === cleanInput.toLowerCase() ||
        u.nom.toLowerCase() === cleanInput.toLowerCase()
    );

    if (foundDemo) {
      const demoUser = foundDemo[1];
      const expectedPass = demoUser.password || "benin2026";

      if (cleanPass && cleanPass !== expectedPass && cleanPass !== "benin2026") {
        return NextResponse.json(
          {
            success: false,
            error: "Mot de passe incorrect pour cet identifiant officiel.",
          },
          { status: 401 }
        );
      }

      const redirectUrl = ROLE_DASHBOARDS[demoUser.role] || "/espace/citoyen";

      return NextResponse.json({
        success: true,
        user: demoUser,
        redirectUrl,
      });
    }

    // 4. Si rôle spécifié explicitement pour ouverture de session rapide
    if (role && DEMO_USERS[role as UserRole]) {
      const template = DEMO_USERS[role as UserRole];
      const sessionUser: UserSession = {
        ...template,
        npi: cleanInput,
        statutValidation: "VALIDE",
      };

      return NextResponse.json({
        success: true,
        user: sessionUser,
        redirectUrl: ROLE_DASHBOARDS[sessionUser.role],
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Aucun compte trouvé pour l'identifiant "${cleanInput}". Veuillez vérifier votre NPI ou créer un compte.`,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Erreur API connexion:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur interne lors de la connexion.",
      },
      { status: 500 }
    );
  }
}
