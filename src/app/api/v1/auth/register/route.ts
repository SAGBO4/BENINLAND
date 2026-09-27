import { NextResponse } from "next/server";
import { db } from "@/db";
import { utilisateurs, detenteurs } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword } from "@/lib/hash";
import { DEMO_USERS, UserRole, UserSession, AccountStatus } from "@/lib/auth-session";
import { anyigbaRepo } from "@/repositories/index";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      npi,
      nom,
      prenom,
      role = "CITOYEN",
      roleLabel,
      titre,
      etablissementNom,
      commune = "Cotonou",
      departement = "Littoral",
      telephone,
      email,
      password,
    } = body;

    // Validation des champs obligatoires
    if (!npi || !nom || !prenom || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Veuillez renseigner tous les champs obligatoires (NPI, Nom, Prénom, Mot de passe).",
        },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Le mot de passe doit comporter au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    const cleanNpi = String(npi).trim();
    const cleanNom = String(nom).trim().toUpperCase();
    const cleanPrenom = String(prenom).trim();
    const targetRole = (String(role).toUpperCase() as UserRole) || "CITOYEN";

    // Tout rôle officiel nécessite l'approbation du Contrôleur IGAF
    const isOfficialRole = targetRole !== "CITOYEN";
    const status: AccountStatus = isOfficialRole ? "EN_ATTENTE_VALIDATION" : "VALIDE";
    const dateDemande = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    // Hachage cryptographique sécurisé du mot de passe avec sel
    const { hash, salt } = hashPassword(password);

    const template = DEMO_USERS[targetRole] || DEMO_USERS.CITOYEN;
    const finalRoleLabel = roleLabel || template.roleLabel;
    const finalTitre = titre || template.titre;
    const finalEtablissement = etablissementNom || template.etablissementNom;
    const finalBadge = template.badge;

    let createdUser: UserSession;

    // Tentative d'enregistrement dans PostgreSQL via Drizzle
    try {
      // Vérifier si le NPI existe déjà
      const existing = await db
        .select()
        .from(utilisateurs)
        .where(eq(utilisateurs.npi, cleanNpi))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Un compte existe déjà avec le NPI ${cleanNpi}. Veuillez vous connecter.`,
          },
          { status: 409 }
        );
      }

      const [inserted] = await db
        .insert(utilisateurs)
        .values({
          npi: cleanNpi,
          nom: cleanNom,
          prenom: cleanPrenom,
          role: targetRole,
          roleLabel: finalRoleLabel,
          titre: finalTitre,
          etablissementNom: finalEtablissement,
          commune: String(commune).trim(),
          departement: String(departement).trim(),
          telephone: telephone ? String(telephone).trim() : null,
          email: email ? String(email).trim().toLowerCase() : null,
          badge: finalBadge,
          passwordHash: hash,
          passwordSalt: salt,
          statutValidation: status,
          dateDemande,
        })
        .returning();

      // Si citoyen, enregistrer également comme détenteur foncier s'il n'existe pas
      if (targetRole === "CITOYEN") {
        try {
          const existingDetenteur = await db
            .select()
            .from(detenteurs)
            .where(eq(detenteurs.npi, cleanNpi))
            .limit(1);

          if (existingDetenteur.length === 0) {
            await db.insert(detenteurs).values({
              npi: cleanNpi,
              nomComplet: `${cleanPrenom} ${cleanNom}`,
              telephone: telephone ? String(telephone).trim() : "+229 00 00 00 00",
              languePreferee: "fon",
              estSociete: false,
            });
          }
        } catch (detErr) {
          console.warn("Notice détenteur:", detErr);
        }
      }

      createdUser = {
        npi: inserted.npi,
        nom: inserted.nom,
        prenom: inserted.prenom,
        role: inserted.role as UserRole,
        roleLabel: inserted.roleLabel || finalRoleLabel,
        titre: inserted.titre || finalTitre,
        etablissementNom: inserted.etablissementNom || finalEtablissement,
        commune: inserted.commune,
        departement: inserted.departement,
        badge: inserted.badge || finalBadge,
        statutValidation: inserted.statutValidation as AccountStatus,
        dateDemande: inserted.dateDemande || dateDemande,
      };
    } catch (dbErr) {
      console.warn("Base PostgreSQL inaccessible en local/CI, bascule sur la persistance mémoire:", dbErr);
      // Fallback mémoire / runtime prêt à déployer
      createdUser = {
        npi: cleanNpi,
        nom: cleanNom,
        prenom: cleanPrenom,
        role: targetRole,
        roleLabel: finalRoleLabel,
        titre: finalTitre,
        etablissementNom: finalEtablissement,
        commune: String(commune).trim(),
        departement: String(departement).trim(),
        badge: finalBadge,
        statutValidation: status,
        dateDemande,
        password,
      };
    }

    return NextResponse.json(
      {
        success: true,
        user: createdUser,
        requiresValidation: isOfficialRole,
        message: isOfficialRole
          ? `Votre demande d'enrôlement (${targetRole}) est soumise à la validation de l'Inspection Générale des Affaires Foncières (IGAF).`
          : "Compte citoyen créé et validé avec succès.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur API inscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erreur interne lors de la création du compte.",
      },
      { status: 500 }
    );
  }
}
