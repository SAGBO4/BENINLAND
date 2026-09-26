export interface SeedParcelle {
  id: number;
  codeUnique: string;
  commune: string;
  poleTerritorial?: string;
  arrondissement: string;
  village: string;
  superficieM2: number;
  statutJuridique: "TITRE_FONCIER" | "CPF" | "COUTUMIER" | "DOMAINE_PUBLIC";
  usage: "AGRICOLE" | "HABITATION" | "COMMERCIAL";
  enVerrouMutation: boolean;
  enLitige: boolean;
  proprietaireNom: string;
  proprietaireNpi: string;
  proprietaireTel: string;
  polygoneGeojson: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  tokenBeninChainId?: string;
}

export const INITIAL_PARCELLES: SeedParcelle[] = [
  {
    id: 1,
    codeUnique: "OUI-0421",
    commune: "Ouidah",
    arrondissement: "Pahou",
    village: "Hounhanmèdji",
    superficieM2: 1250,
    statutJuridique: "COUTUMIER",
    usage: "HABITATION",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Germain Dossou (Famille Dossou)",
    proprietaireNpi: "FICTIF-BEN-2026-0041",
    proprietaireTel: "+229 97 45 21 00",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.0815, 6.365],
          [2.083, 6.365],
          [2.083, 6.3665],
          [2.0815, 6.3665],
          [2.0815, 6.365],
        ],
      ],
    },
    tokenBeninChainId: "TKN-COUTUMIER-OUI-0421",
  },
  {
    id: 2,
    codeUnique: "OUI-0104",
    commune: "Ouidah",
    arrondissement: "Ouidah I",
    village: "Fort Français",
    superficieM2: 2400,
    statutJuridique: "TITRE_FONCIER",
    usage: "COMMERCIAL",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Famille Houessou",
    proprietaireNpi: "FICTIF-BEN-2026-0004",
    proprietaireTel: "+229 96 11 22 33",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.086, 6.362],
          [2.0885, 6.362],
          [2.0885, 6.364],
          [2.086, 6.364],
          [2.086, 6.362],
        ],
      ],
    },
    tokenBeninChainId: "TKN-FONCIER-OUI-104",
  },
  {
    id: 3,
    codeUnique: "CAL-0089",
    commune: "Abomey-Calavi",
    arrondissement: "Togoudo",
    village: "Agori",
    superficieM2: 500,
    statutJuridique: "CPF",
    usage: "HABITATION",
    enVerrouMutation: true, // Verrouillé pour mutation en cours !
    enLitige: false,
    proprietaireNom: "Koffi Mensah",
    proprietaireNpi: "FICTIF-BEN-2026-0003",
    proprietaireTel: "+229 95 88 77 66",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.355, 6.448],
          [2.357, 6.448],
          [2.357, 6.4495],
          [2.355, 6.4495],
          [2.355, 6.448],
        ],
      ],
    },
    tokenBeninChainId: "TKN-CPF-CAL-089",
  },
  {
    id: 4,
    codeUnique: "CAL-0312",
    commune: "Abomey-Calavi",
    arrondissement: "Akassato",
    village: "Glo-Djigbé",
    superficieM2: 850,
    statutJuridique: "TITRE_FONCIER",
    usage: "COMMERCIAL",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Société Immobilière du Golfe",
    proprietaireNpi: "FICTIF-BEN-2026-0999",
    proprietaireTel: "+229 21 30 40 50",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.342, 6.465],
          [2.345, 6.465],
          [2.345, 6.467],
          [2.342, 6.467],
          [2.342, 6.465],
        ],
      ],
    },
    tokenBeninChainId: "TKN-FONCIER-CAL-312",
  },
  {
    id: 5,
    codeUnique: "LIT-ALL-005",
    commune: "Allada",
    arrondissement: "Attogon",
    village: "Sekou",
    superficieM2: 3200,
    statutJuridique: "COUTUMIER",
    usage: "AGRICOLE",
    enVerrouMutation: false,
    enLitige: true, // En litige CSAF !
    proprietaireNom: "Succession Gbénou c/ Hounkpatin",
    proprietaireNpi: "FICTIF-BEN-2026-0777",
    proprietaireTel: "+229 97 12 34 56",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.15, 6.645],
          [2.155, 6.645],
          [2.155, 6.65],
          [2.15, 6.65],
          [2.15, 6.645],
        ],
      ],
    },
    tokenBeninChainId: "TKN-LITIGE-ALL-005",
  },
  {
    id: 6,
    codeUnique: "COT-0015",
    commune: "Cotonou",
    arrondissement: "12ème Arrondissement",
    village: "Cadjèhoun",
    superficieM2: 650,
    statutJuridique: "TITRE_FONCIER",
    usage: "HABITATION",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Mme Reine Houndété",
    proprietaireNpi: "FICTIF-BEN-2026-0012",
    proprietaireTel: "+229 97 88 99 00",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.405, 6.356],
          [2.4075, 6.356],
          [2.4075, 6.358],
          [2.405, 6.358],
          [2.405, 6.356],
        ],
      ],
    },
    tokenBeninChainId: "TKN-FONCIER-COT-015",
  },
  {
    id: 7,
    codeUnique: "KPO-0077",
    commune: "Kpomassè",
    arrondissement: "Agbanto",
    village: "Sègbèya",
    superficieM2: 5000,
    statutJuridique: "COUTUMIER",
    usage: "AGRICOLE",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Coopérative Maraîchère d'Agbanto",
    proprietaireNpi: "FICTIF-BEN-2026-0555",
    proprietaireTel: "+229 96 44 33 22",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.045, 6.485],
          [2.052, 6.485],
          [2.052, 6.492],
          [2.045, 6.492],
          [2.045, 6.485],
        ],
      ],
    },
    tokenBeninChainId: "TKN-COUTUMIER-KPO-077",
  },
  {
    id: 8,
    codeUnique: "POB-0112",
    commune: "Pobè",
    poleTerritorial: "Pôle Sud-Est",
    arrondissement: "Pobè Centre",
    village: "Igana",
    superficieM2: 7800,
    statutJuridique: "TITRE_FONCIER",
    usage: "AGRICOLE",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Plantations Palmeraie d'Igana",
    proprietaireNpi: "FICTIF-BEN-2026-0612",
    proprietaireTel: "+229 97 22 44 88",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.662, 6.975],
          [2.671, 6.975],
          [2.671, 6.984],
          [2.662, 6.984],
          [2.662, 6.975],
        ],
      ],
    },
    tokenBeninChainId: "TKN-FONCIER-POB-112",
  },
  {
    id: 9,
    codeUnique: "BOH-0450",
    commune: "Bohicon",
    poleTerritorial: "Pôle Centre",
    arrondissement: "Bohicon II",
    village: "Kpocon",
    superficieM2: 1800,
    statutJuridique: "CPF",
    usage: "COMMERCIAL",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Entrepôts Logistiques du Zou",
    proprietaireNpi: "FICTIF-BEN-2026-0344",
    proprietaireTel: "+229 95 33 22 11",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.058, 7.172],
          [2.064, 7.172],
          [2.064, 7.178],
          [2.058, 7.178],
          [2.058, 7.172],
        ],
      ],
    },
    tokenBeninChainId: "TKN-CPF-BOH-450",
  },
  {
    id: 10,
    codeUnique: "NAT-0088",
    commune: "Natitingou",
    poleTerritorial: "Pôle Nord-Ouest",
    arrondissement: "Natitingou III",
    village: "Kotapoungou",
    superficieM2: 3500,
    statutJuridique: "COUTUMIER",
    usage: "HABITATION",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Collectivité N'Dah & Frères",
    proprietaireNpi: "FICTIF-BEN-2026-0810",
    proprietaireTel: "+229 96 77 88 99",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [1.372, 10.302],
          [1.379, 10.302],
          [1.379, 10.308],
          [1.372, 10.308],
          [1.372, 10.302],
        ],
      ],
    },
    tokenBeninChainId: "TKN-COUTUMIER-NAT-088",
  },
  {
    id: 11,
    codeUnique: "PAR-0920",
    commune: "Parakou",
    poleTerritorial: "Pôle Nord-Est",
    arrondissement: "1er Arrondissement",
    village: "Titirou",
    superficieM2: 4200,
    statutJuridique: "TITRE_FONCIER",
    usage: "COMMERCIAL",
    enVerrouMutation: false,
    enLitige: false,
    proprietaireNom: "Comptoir Cotonnier du Septentrion",
    proprietaireNpi: "FICTIF-BEN-2026-0920",
    proprietaireTel: "+229 23 61 00 22",
    polygoneGeojson: {
      type: "Polygon",
      coordinates: [
        [
          [2.605, 9.335],
          [2.614, 9.335],
          [2.614, 9.344],
          [2.605, 9.344],
          [2.605, 9.335],
        ],
      ],
    },
    tokenBeninChainId: "TKN-FONCIER-PAR-920",
  },
];
