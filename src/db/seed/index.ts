import { db, pool } from "../index";
import { parcelles, detenteurs, droits, mutations, coffreFortActes, litiges, utilisateurs } from "../schema";
import { INITIAL_PARCELLES } from "./data";
import { DEMO_USERS, UserRole } from "@/lib/auth-session";
import { hashPassword } from "@/lib/hash";

export async function seedDatabase() {
  console.log("🌱 Début du peuplement (seed) de la base Neon PostgreSQL...");

  // Nettoyage préalable ordonné
  await db.delete(litiges);
  await db.delete(mutations);
  await db.delete(droits);
  await db.delete(coffreFortActes);
  await db.delete(parcelles);
  await db.delete(detenteurs);
  await db.delete(utilisateurs);

  console.log("🧹 Tables vidées.");

  // 0. Insertion des comptes utilisateurs républicains dans la DB
  for (const [roleKey, u] of Object.entries(DEMO_USERS)) {
    const { hash, salt } = hashPassword(u.password || "benin2026");
    await db.insert(utilisateurs).values({
      npi: u.npi,
      nom: u.nom,
      prenom: u.prenom,
      role: u.role,
      roleLabel: u.roleLabel,
      titre: u.titre,
      etablissementNom: u.etablissementNom,
      commune: u.commune,
      departement: u.departement,
      badge: u.badge,
      passwordHash: hash,
      passwordSalt: salt,
      statutValidation: "VALIDE",
    });
  }
  console.log("✅ 9 comptes utilisateurs initiaux insérés dans la table utilisateurs.");

  // 1. Insertion des détenteurs
  const detenteursMap = new Map<string, number>();

  for (const p of INITIAL_PARCELLES) {
    if (!detenteursMap.has(p.proprietaireNpi)) {
      const [inserted] = await db
        .insert(detenteurs)
        .values({
          npi: p.proprietaireNpi,
          nomComplet: p.proprietaireNom,
          telephone: p.proprietaireTel,
          languePreferee: "fon",
        })
        .returning({ id: detenteurs.id });
      detenteursMap.set(p.proprietaireNpi, inserted.id);
    }
  }

  console.log(`✅ ${detenteursMap.size} détenteurs insérés.`);

  // 2. Insertion des parcelles
  for (const p of INITIAL_PARCELLES) {
    const [insertedParcelle] = await db
      .insert(parcelles)
      .values({
        codeUnique: p.codeUnique,
        commune: p.commune,
        arrondissement: p.arrondissement,
        village: p.village,
        superficieM2: p.superficieM2,
        statutJuridique: p.statutJuridique,
        usage: p.usage,
        enVerrouMutation: p.enVerrouMutation,
        enLitige: p.enLitige,
        polygoneGeojson: p.polygoneGeojson,
        tokenBeninChainId: p.tokenBeninChainId,
      })
      .returning({ id: parcelles.id });

    // Droit associé
    const detenteurId = detenteursMap.get(p.proprietaireNpi);
    if (detenteurId) {
      await db.insert(droits).values({
        parcelleId: insertedParcelle.id,
        detenteurId: detenteurId,
        typeDroit: p.statutJuridique === "TITRE_FONCIER" ? "PLEINE_PROPRIETE" : "DROIT_COUTUMIER",
        quotePart: 1.0,
      });
    }

    // Si la parcelle est en litige, on ajoute le dossier CSAF
    if (p.enLitige) {
      await db.insert(litiges).values({
        parcelleId: insertedParcelle.id,
        demandeurNom: "Succession Gbénou",
        demandeurNpi: "FICTIF-BEN-2026-0777",
        motif: "Revendication d'héritage coutumier et contestation de limite",
        juridiction: "CSAF_COTONOU",
        statut: "GEL_CONSERVATOIRE",
      });
    }

    // Si la parcelle est verrouillée (ex: CAL-0089), on ajoute la mutation en cours
    if (p.enVerrouMutation) {
      const acheteurNpi = "FICTIF-BEN-2026-0050";
      if (!detenteursMap.has(acheteurNpi)) {
        const [insertedAcheteur] = await db
          .insert(detenteurs)
          .values({
            npi: acheteurNpi,
            nomComplet: "Aimé Houndégbé",
            telephone: "+229 97 00 11 22",
            languePreferee: "fon",
          })
          .returning({ id: detenteurs.id });
        detenteursMap.set(acheteurNpi, insertedAcheteur.id);
      }

      await db.insert(mutations).values({
        codeMutation: "MUT-2026-0089",
        parcelleId: insertedParcelle.id,
        cedantId: detenteurId!,
        cessionnaireId: detenteursMap.get(acheteurNpi)!,
        notaireId: "Me Christian Agbossou",
        prixCessionFcfa: 4500000,
        statut: "INITIEE_VERROUILLEE",
        statutSequestre: "FONDS_BLOQUES_SEQUESTRE",
        hashPreuve: "0xa89f3320c74d8129e9f1a09374026da4e7710bcf",
      });
    }

    // Si Titre Foncier certifié (ex: OUI-0104), on ajoute le certificat dans le coffre-fort
    if (p.codeUnique === "OUI-0104") {
      await db.insert(coffreFortActes).values({
        parcelleId: insertedParcelle.id,
        typeActe: "TITRE_FONCIER",
        referenceActe: "TF-OUIDAH-2026-104",
        notaireOuSignataire: "Mme Reine Houndété (Directrice ANDF)",
        hashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        selCryptographique: "a1b2c3d4e5f67890",
        otsProof: "OTS-BTC-SEAL-E3B0C442",
        txBlockchainId: "0xbc887766554433221100aabbccddeeff",
      });
    }
  }

  console.log(`✅ ${INITIAL_PARCELLES.length} parcelles cadastrées avec leurs droits, litiges et verrous.`);
}

// Exécution directe si appelé par CLI
if (require.main === module || process.argv[1]?.includes("seed")) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seed Neon terminé avec succès !");
      return pool.end();
    })
    .catch((err) => {
      console.error("❌ Erreur pendant le seed :", err);
      process.exit(1);
    });
}
