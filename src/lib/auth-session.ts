export type UserRole =
  | "MINISTERE"
  | "ANDF"
  | "NOTAIRE"
  | "CSAF"
  | "AGENT"
  | "COMMUNE"
  | "CITOYEN"
  | "BANQUE";

export interface UserSession {
  npi: string;
  nom: string;
  prenom: string;
  role: UserRole;
  roleLabel: string;
  titre: string;
  etablissementNom: string;
  commune: string;
  departement: string;
  avatarUrl?: string;
  badge?: string;
  password?: string;
}

export const DEMO_USERS: Record<UserRole, UserSession> = {
  MINISTERE: {
    npi: "FICTIF-BEN-2026-0000",
    nom: "DOSSOU-YOVO",
    prenom: "Dr. Marcel",
    role: "MINISTERE",
    roleLabel: "Régulation & Trésor (CUT)",
    titre: "Directeur Général de la Cartographie et du Domaine Foncier",
    etablissementNom: "Ministère du Cadre de Vie et des Transports (MCVDD / MEF)",
    commune: "Cotonou",
    departement: "Littoral",
    badge: "Supervision 12 Départements",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    password: "admin2026",
  },
  ANDF: {
    npi: "FICTIF-BEN-2026-0012",
    nom: "HOUNDÉTÉ",
    prenom: "Mme Reine",
    role: "ANDF",
    roleLabel: "Directrice Générale ANDF",
    titre: "Conservateur National de la Propriété Foncière",
    etablissementNom: "Agence Nationale du Domaine et du Foncier (ANDF)",
    commune: "Cotonou",
    departement: "Littoral",
    badge: "Délivrance Titre CPF",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    password: "andf2026",
  },
  NOTAIRE: {
    npi: "FICTIF-BEN-2026-0088",
    nom: "AGBOSSOU",
    prenom: "Me Christian",
    role: "NOTAIRE",
    roleLabel: "Notaire Instrumentaire",
    titre: "Membre de la Chambre Nationale des Notaires du Bénin",
    etablissementNom: "Étude Notariale Agbossou & Associés",
    commune: "Ouidah",
    departement: "Atlantique",
    badge: "Mutation & Verrou Légal",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    password: "not2026",
  },
  CSAF: {
    npi: "FICTIF-BEN-2026-0099",
    nom: "SOSSA",
    prenom: "Juge Antoine",
    role: "CSAF",
    roleLabel: "Juge Cour Spéciale CSAF",
    titre: "Président de Chambre — Contentieux Domanial (Loi 2022-16)",
    etablissementNom: "Cour Spéciale des Affaires Foncières",
    commune: "Cotonou",
    departement: "Littoral",
    badge: "Gel Conservatoire",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    password: "csaf2026",
  },
  AGENT: {
    npi: "FICTIF-BEN-2026-0045",
    nom: "BIO",
    prenom: "Mamadou",
    role: "AGENT",
    roleLabel: "Agent Cadastral de Zone",
    titre: "Géomètre-Expert Agréé • Relevés GPS Centimétriques",
    etablissementNom: "Bureau Territorial du Cadre de Vie de Ouidah",
    commune: "Ouidah",
    departement: "Atlantique",
    badge: "Bornage Contradictoire",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    password: "agent2026",
  },
  COMMUNE: {
    npi: "FICTIF-BEN-2026-0033",
    nom: "GBEDJI",
    prenom: "Sètondji",
    role: "COMMUNE",
    roleLabel: "Direction Urbanisme Communal",
    titre: "Chef Service Urbanisme, Domanialité et Fiscalité Locale",
    etablissementNom: "Mairie de la Commune de Ouidah",
    commune: "Ouidah",
    departement: "Atlantique",
    badge: "Urbanisme & Taxes",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    password: "com2026",
  },
  CITOYEN: {
    npi: "FICTIF-BEN-2026-0041",
    nom: "DOSSOU",
    prenom: "Germain",
    role: "CITOYEN",
    roleLabel: "Propriétaire Citoyen (Famille Dossou)",
    titre: "Mandataire de Succession Domaniale • Parcelle OUI-0421",
    etablissementNom: "Collectivité Familiale Dossou — Pahou",
    commune: "Ouidah",
    departement: "Atlantique",
    badge: "Patrimoine Familial",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    password: "cit2026",
  },
  BANQUE: {
    npi: "FICTIF-BEN-2026-0700",
    nom: "KPATOUKPA",
    prenom: "Arnaud",
    role: "BANQUE",
    roleLabel: "Analyste Crédit Immobilier",
    titre: "Direction des Engagements et Sûretés Réelles",
    etablissementNom: "Banque Nationale du Bénin (BNB)",
    commune: "Cotonou",
    departement: "Littoral",
    badge: "Garanties & Hypothèque",
    avatarUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150",
    password: "bnb2026",
  },
};

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  MINISTERE: "/espace/ministere",
  ANDF: "/espace/andf",
  NOTAIRE: "/espace/notaire",
  CSAF: "/espace/csaf",
  AGENT: "/espace/agent",
  COMMUNE: "/espace/commune",
  CITOYEN: "/espace/citoyen",
  BANQUE: "/espace/banque",
};
