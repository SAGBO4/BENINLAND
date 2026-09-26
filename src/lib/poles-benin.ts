/**
 * Référentiel National des 06 Pôles de Développement Territorial de la République du Bénin
 * Source : Ministère du Cadre de Vie, des Transports et du Développement Durable / Décret d'organisation territoriale
 * Répartition officielle des 77 communes du Bénin.
 */

export interface PoleTerritorial {
  id: string;
  nom: string;
  nomCourt: string;
  code: string;
  description: string;
  couleurHex: string;
  badgeBg: string;
  badgeFg: string;
  centre: [number, number]; // [lat, lng] WGS84 pour centrage carte
  zoomDefaut: number;
  communes: string[];
}

export const POLES_BENIN: PoleTerritorial[] = [
  {
    id: "grand-nokoue",
    nom: "Pôle Grand-Nokoué",
    nomCourt: "Grand-Nokoué",
    code: "PGN",
    description: "Métropole économique, lagunaire et portuaire du Sud-Bénin.",
    couleurHex: "#008751", // Vert émeraude
    badgeBg: "bg-emerald-100",
    badgeFg: "text-emerald-900",
    centre: [6.37, 2.39],
    zoomDefaut: 11,
    communes: [
      "Abomey-Calavi",
      "Cotonou",
      "Ouidah",
      "Porto-Novo",
      "Sèmè-Kpodji",
    ],
  },
  {
    id: "sud-ouest",
    nom: "Pôle Sud-Ouest",
    nomCourt: "Sud-Ouest",
    code: "PSO",
    description: "Bassin du Mono-Couffo et plateau de l'Atlantique intérieur.",
    couleurHex: "#0a3764", // Bleu marine souverain
    badgeBg: "bg-blue-100",
    badgeFg: "text-blue-950",
    centre: [6.63, 1.95],
    zoomDefaut: 10,
    communes: [
      "Lokossa",
      "Allada",
      "Aplahoué",
      "Athiémé",
      "Bopa",
      "Comè",
      "Djakotomey",
      "Dogbo",
      "Grand-Popo",
      "Houéyogbé",
      "Klouékanmè",
      "Kpomassè",
      "Lalo",
      "Sô-Ava",
      "Toffo",
      "Tori-Bossito",
      "Toviklin",
      "Zè",
    ],
  },
  {
    id: "sud-est",
    nom: "Pôle Sud-Est",
    nomCourt: "Sud-Est",
    code: "PSE",
    description: "Bassin de l'Ouémé et du Plateau, zone agropastorale et frontalière.",
    couleurHex: "#2563eb", // Bleu royal
    badgeBg: "bg-indigo-100",
    badgeFg: "text-indigo-950",
    centre: [6.85, 2.65],
    zoomDefaut: 10,
    communes: [
      "Pobè",
      "Adja-Ouèrè",
      "Adjarra",
      "Adjohoun",
      "Les Aguégués",
      "Akpro-Missérété",
      "Avrankou",
      "Bonou",
      "Dangbo",
      "Ifangni",
      "Kétou",
      "Sakété",
    ],
  },
  {
    id: "centre",
    nom: "Pôle Centre",
    nomCourt: "Centre",
    code: "PCT",
    description: "Carrefour historique, agricole et géostratégique du Zou et des Collines.",
    couleurHex: "#0284c7", // Bleu ciel / océan
    badgeBg: "bg-sky-100",
    badgeFg: "text-sky-950",
    centre: [7.55, 2.15],
    zoomDefaut: 9,
    communes: [
      "Abomey",
      "Agbangnizoun",
      "Bantè",
      "Bohicon",
      "Covè",
      "Dassa-Zoumè",
      "Djidja",
      "Glazoué",
      "Ouèssè",
      "Ouinhi",
      "Savalou",
      "Savè",
      "Za-Kpota",
      "Zagnanado",
      "Zogbodomey",
    ],
  },
  {
    id: "nord-ouest",
    nom: "Pôle Nord-Ouest",
    nomCourt: "Nord-Ouest",
    code: "PNO",
    description: "Massif de l'Atacora et de la Donga, relief montagneux et patrimoine touristique.",
    couleurHex: "#06b6d4", // Cyan
    badgeBg: "bg-cyan-100",
    badgeFg: "text-cyan-950",
    centre: [10.3, 1.6],
    zoomDefaut: 9,
    communes: [
      "Natitingou",
      "Bassila",
      "Boukombé",
      "Cobly",
      "Copargo",
      "Djougou",
      "Kérou",
      "Kouandé",
      "Matéri",
      "Ouaké",
      "Péhunco",
      "Tanguiéta",
      "Toucountouna",
    ],
  },
  {
    id: "nord-est",
    nom: "Pôle Nord-Est",
    nomCourt: "Nord-Est",
    code: "PNE",
    description: "Bassin agro-industriel du Borgou et de l'Alibori, fleuve Niger et coton.",
    couleurHex: "#0f172a", // Bleu nuit profond
    badgeBg: "bg-slate-200",
    badgeFg: "text-slate-900",
    centre: [10.5, 2.9],
    zoomDefaut: 9,
    communes: [
      "Parakou",
      "Banikoara",
      "Bembèrèkè",
      "Gogounou",
      "Kalalé",
      "Kandi",
      "Karimama",
      "Malanville",
      "N'Dali",
      "Nikki",
      "Pèrèrè",
      "Ségbana",
      "Sinendé",
      "Tchaourou",
    ],
  },
];

/**
 * Retourne le pôle auquel est rattachée une commune donnée.
 */
export function getPoleForCommune(commune: string): PoleTerritorial {
  const cleanCommune = commune
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Alias courants
  if (cleanCommune === "boukoumbe") {
    const p = POLES_BENIN.find((x) => x.id === "nord-ouest");
    if (p) return p;
  }

  for (const pole of POLES_BENIN) {
    if (
      pole.communes.some(
        (c) =>
          c
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") === cleanCommune
      )
    ) {
      return pole;
    }
  }
  // Par défaut : Grand-Nokoué
  return POLES_BENIN[0];
}

/**
 * Retourne toutes les communes d'un pôle donné par son id.
 */
export function getCommunesForPole(poleId: string): string[] {
  if (poleId === "TOUS") {
    return POLES_BENIN.flatMap((p) => p.communes);
  }
  const pole = POLES_BENIN.find((p) => p.id === poleId);
  return pole ? pole.communes : [];
}
