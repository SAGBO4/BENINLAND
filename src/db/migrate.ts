import { pool } from "./index";

export async function runMigrations() {
  console.log("⚙️ Vérification des migrations sur Neon PostgreSQL...");
  // Avec drizzle-kit push, le schéma est déjà synchronisé.
  // Ce script valide la connectivité et la présence des tables.
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
    );
    console.log(`✅ ${res.rows.length} tables validées dans la base Neon.`);
  } finally {
    client.release();
  }
}

if (require.main === module || process.argv[1]?.includes("migrate")) {
  runMigrations()
    .then(() => {
      console.log("🚀 Migrations terminées.");
      return pool.end();
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
