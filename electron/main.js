const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require("electron");
const path = require("path");
const http = require("http");

const DEFAULT_PORT = process.env.PORT || 3000;
const PROD_URL = "https://beninland.vercel.app";
const LOCAL_URL = process.env.APP_URL || `http://localhost:${DEFAULT_PORT}`;

let mainWindow = null;
let currentAppUrl = LOCAL_URL;

function checkServerReady(url, maxRetries = 10, interval = 500) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve(true);
          } else {
            retry();
          }
        })
        .on("error", () => {
          retry();
        });
    };

    const retry = () => {
      retries++;
      if (retries >= maxRetries) {
        reject(new Error(`Impossible de joindre le serveur à ${url} après ${maxRetries} tentatives.`));
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
}

async function resolveTargetUrl() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }
  // Tester si le serveur local tourne
  try {
    const isLocal = await checkServerReady(LOCAL_URL, 2, 200);
    if (isLocal) return LOCAL_URL;
  } catch {}
  return app.isPackaged ? PROD_URL : LOCAL_URL;
}


function createApplicationMenu(window) {
  const isMac = process.platform === "darwin";

  const template = [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "Fichier",
      submenu: [
        {
          label: "Nouvelle vérification de parcelle",
          accelerator: "CmdOrCtrl+N",
          click: () => window.loadURL(`${currentAppUrl}/verification`),
        },
        {
          label: "Carte Cadastrale Plein Écran",
          accelerator: "CmdOrCtrl+M",
          click: () => window.loadURL(`${currentAppUrl}/carte`),
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit", label: "Quitter BENINLAND" },
      ],
    },
    {
      label: "Navigation Foncier",
      submenu: [
        {
          label: "🏛️ Accueil National",
          click: () => window.loadURL(currentAppUrl),
        },
        {
          label: "🗺️ Carte SIG • 06 Pôles Territoriaux",
          click: () => window.loadURL(`${currentAppUrl}/carte`),
        },
        {
          label: "🔍 Vérification Publique & Opposabilité",
          click: () => window.loadURL(`${currentAppUrl}/verification`),
        },
        {
          label: "📱 Simulateur Télécom (USSD / SMS / Audio)",
          click: () => window.loadURL(`${currentAppUrl}/demo/telephone`),
        },
        { type: "separator" },
        {
          label: "Espaces Métiers :",
          enabled: false,
        },
        {
          label: "👤 Espace Citoyen / Acquéreur",
          click: () => window.loadURL(`${currentAppUrl}/espace/citoyen`),
        },
        {
          label: "⚖️ Espace Notaire & Verrou",
          click: () => window.loadURL(`${currentAppUrl}/espace/notaire`),
        },
        {
          label: "📐 Espace Géomètre Expert (Bornage)",
          click: () => window.loadURL(`${currentAppUrl}/espace/agent`),
        },
        {
          label: "🛡️ Espace ANDF & Conservation",
          click: () => window.loadURL(`${currentAppUrl}/espace/andf`),
        },
        {
          label: "⚖️ Espace CSAF (Non-litige)",
          click: () => window.loadURL(`${currentAppUrl}/espace/csaf`),
        },
        {
          label: "🏛️ Ministère & CUT Trésor Public",
          click: () => window.loadURL(`${currentAppUrl}/espace/ministere`),
        },
      ],
    },
    {
      label: "Affichage",
      submenu: [
        { role: "reload", label: "Actualiser la page" },
        { role: "forceReload", label: "Forcer le rechargement" },
        { role: "toggleDevTools", label: "Outils de développement (SIG/Console)" },
        { type: "separator" },
        { role: "resetZoom", label: "Taille normale" },
        { role: "zoomIn", label: "Zoom avant" },
        { role: "zoomOut", label: "Zoom arrière" },
        { type: "separator" },
        { role: "togglefullscreen", label: "Plein écran" },
      ],
    },
    {
      label: "Aide & Souveraineté",
      submenu: [
        {
          label: "🌍 Référentiel des 06 Pôles Territoriaux",
          click: () => {
            dialog.showMessageBox(window, {
              type: "info",
              title: "Organisation Territoriale de la République du Bénin",
              message: "06 Pôles de Développement Territorial (77 Communes)",
              detail:
                "1. Pôle Grand-Nokoué (5 communes)\n" +
                "2. Pôle Sud-Ouest (18 communes)\n" +
                "3. Pôle Sud-Est (12 communes)\n" +
                "4. Pôle Centre (15 communes)\n" +
                "5. Pôle Nord-Ouest (13 communes)\n" +
                "6. Pôle Nord-Est (14 communes)\n\n" +
                "Cadre de Souveraineté Domaniale 2026-2030.",
              buttons: ["Fermer"],
            });
          },
        },
        {
          label: "🎙️ Synthèse Vocale 229 Langues (IA Bénin)",
          click: () => {
            dialog.showMessageBox(window, {
              type: "info",
              title: "Synthèse Vocale 229 Langues",
              message: "Accessibilité universelle en langues nationales",
              detail:
                "Moteur d'attestation vocale multilingue intégré :\n" +
                "• Fongbe (Fon)\n" +
                "• Yoruba\n" +
                "• Hausa\n" +
                "• Français\n\n" +
                "Propulsé par les modèles d'intelligence artificielle béninois.",
              buttons: ["D'accord"],
            });
          },
        },
        { type: "separator" },
        {
          label: "À propos de BENINLAND",
          click: () => {
            dialog.showMessageBox(window, {
              type: "info",
              title: "BENINLAND (Anyigba) Desktop v1.0.0",
              message: "Plateforme Nationale de Sécurisation et de Gestion du Foncier",
              detail:
                "République du Bénin\n" +
                "Version : 1.0.0 Souveraine\n" +
                "Moteur : Next.js 15, OpenStreetMap, Leaflet SIG, Electron\n" +
                "Architecture régalienne anti-double vente et conformité CSAF/ANDF.",
              buttons: ["OK"],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

async function createWindow() {
  const iconPath = path.join(__dirname, "../public/armoiries-benin.png");

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: "BENINLAND (Anyigba) — Cadastre & Foncier Souverain du Bénin",
    icon: iconPath,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  currentAppUrl = await resolveTargetUrl();
  createApplicationMenu(mainWindow);

  await mainWindow.loadURL(currentAppUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Gestion des requêtes IPC pour la fenêtre
ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on("window-close", () => mainWindow?.close());
ipcMain.on("open-external", (_event, url) => {
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    shell.openExternal(url);
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
