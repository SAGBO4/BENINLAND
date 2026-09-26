import { seedDatabase } from "./seed/index";
import { pool } from "./index";

seedDatabase()
  .then(() => {
    console.log("🔄 Réinitialisation déterministe Neon terminée.");
    return pool.end();
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
