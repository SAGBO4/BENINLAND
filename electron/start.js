const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

function isServerRunning(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 500);
      })
      .on("error", () => {
        resolve(false);
      });
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const running = await isServerRunning(url);
    if (running) return true;
    await new Promise((r) => setTimeout(r, 800));
  }
  return false;
}

async function start() {
  let nextProcess = null;
  const running = await isServerRunning(URL);

  if (!running) {
    console.log(`[Desktop] Démarrage du serveur Next.js sur ${URL}...`);
    nextProcess = spawn("pnpm", ["dev"], {
      cwd: path.resolve(__dirname, ".."),
      stdio: "inherit",
      shell: true,
    });

    const ready = await waitForServer(URL, 45000);
    if (!ready) {
      console.error("[Desktop] Erreur : Délai dépassé pour le démarrage de Next.js.");
      if (nextProcess) nextProcess.kill();
      process.exit(1);
    }
  } else {
    console.log(`[Desktop] Serveur local déjà actif sur ${URL}.`);
  }

  console.log("[Desktop] Lancement de l'application Electron BENINLAND...");
  const electronPath = require("electron");
  const electronProcess = spawn(electronPath, [path.resolve(__dirname, "main.js")], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
    env: { ...process.env, APP_URL: URL },
  });

  electronProcess.on("close", (code) => {
    console.log(`[Desktop] Fenêtre fermée avec le code ${code}.`);
    if (nextProcess) {
      console.log("[Desktop] Arrêt du processus Next.js associé...");
      nextProcess.kill();
    }
    process.exit(code || 0);
  });
}

start().catch((err) => {
  console.error("[Desktop] Erreur fatale :", err);
  process.exit(1);
});
