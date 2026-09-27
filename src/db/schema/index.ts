import { pgTable, serial, text, doublePrecision, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const parcelles = pgTable("parcelles", {
  id: serial("id").primaryKey(),
  codeUnique: text("code_unique").notNull().unique(), // ex: "OUI-0421"
  commune: text("commune").notNull(),
  arrondissement: text("arrondissement").notNull(),
  village: text("village").notNull(),
  superficieM2: doublePrecision("superficie_m2").notNull(),
  statutJuridique: text("statut_juridique").notNull(), // "TITRE_FONCIER" | "CPF" | "COUTUMIER" | "DOMAINE_PUBLIC"
  usage: text("usage").notNull(), // "AGRICOLE" | "HABITATION" | "COMMERCIAL"
  enVerrouMutation: boolean("en_verrou_mutation").default(false).notNull(),
  enLitige: boolean("en_litige").default(false).notNull(),
  polygoneGeojson: jsonb("polygone_geojson").notNull(),
  tokenBeninChainId: text("token_beninchain_id"),
  creeLe: timestamp("cree_le").defaultNow().notNull(),
  misAJourLe: timestamp("mis_a_jour_le").defaultNow().notNull(),
});

export const detenteurs = pgTable("detenteurs", {
  id: serial("id").primaryKey(),
  npi: text("npi").notNull().unique(), // ex: "FICTIF-BEN-2026-0041"
  nomComplet: text("nom_complet").notNull(),
  telephone: text("telephone").notNull(),
  languePreferee: text("langue_preferee").default("fon").notNull(),
  estSociete: boolean("est_societe").default(false).notNull(),
  creeLe: timestamp("cree_le").defaultNow().notNull(),
});

export const droits = pgTable("droits", {
  id: serial("id").primaryKey(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  detenteurId: integer("detenteur_id").references(() => detenteurs.id).notNull(),
  typeDroit: text("type_droit").notNull(), // "PLEINE_PROPRIETE" | "INDIVISION" | "BAIL" | "DROIT_COUTUMIER"
  quotePart: doublePrecision("quote_part").default(1.0).notNull(),
  dateDebut: timestamp("date_debut").defaultNow().notNull(),
  dateFin: timestamp("date_fin"),
});

export const mutations = pgTable("mutations", {
  id: serial("id").primaryKey(),
  codeMutation: text("code_mutation").notNull().unique(), // ex: "MUT-2026-0089"
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  cedantId: integer("cedant_id").references(() => detenteurs.id).notNull(),
  cessionnaireId: integer("cessionnaire_id").references(() => detenteurs.id).notNull(),
  notaireId: text("notaire_id").notNull(),
  prixCessionFcfa: integer("prix_cession_fcfa").notNull(),
  statut: text("statut").notNull(), // "INITIEE_VERROUILLEE" | "PAIEMENT_SEQUESTRE" | "ACTE_SIGNE" | "VALIDEE_ANDF" | "REJETEE"
  statutSequestre: text("statut_sequestre").default("FONDS_BLOQUES_SEQUESTRE").notNull(),
  valideAndfLe: timestamp("valide_andf_le"),
  hashPreuve: text("hash_preuve").notNull(),
  creeLe: timestamp("cree_le").defaultNow().notNull(),
});

export const conventionsAssistees = pgTable("conventions_assistees", {
  id: serial("id").primaryKey(),
  codeConvention: text("code_convention").notNull().unique(), // ex: "CONV-VIL-2026-042"
  parcelleId: integer("parcelle_id").references(() => parcelles.id),
  agentNpi: text("agent_npi").notNull(),
  agentNom: text("agent_nom").notNull(),
  vendeurNpi: text("vendeur_npi").notNull(),
  vendeurNom: text("vendeur_nom").notNull(),
  acheteurNpi: text("acheteur_npi").notNull(),
  acheteurNom: text("acheteur_nom").notNull(),
  commune: text("commune").notNull(),
  village: text("village").notNull(),
  surfaceM2: doublePrecision("surface_m2").notNull(),
  prixFcfa: integer("prix_fcfa").notNull(),
  photosBornes: jsonb("photos_bornes").notNull(),
  temoignagesVocaux: jsonb("temoignages_vocaux").notNull(),
  consentementChefVillage: boolean("consentement_chef_village").default(true).notNull(),
  statutSequestre: text("statut_sequestre").default("FONDS_BLOQUES_SEQUESTRE").notNull(),
  dossierHashSha256: text("dossier_hash_sha256").notNull(),
  dateSignature: timestamp("date_signature").defaultNow().notNull(),
});

export const litiges = pgTable("litiges", {
  id: serial("id").primaryKey(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  demandeurNom: text("demandeur_nom").notNull(),
  demandeurNpi: text("demandeur_npi").notNull(),
  motif: text("motif").notNull(),
  juridiction: text("juridiction").default("CSAF_COTONOU").notNull(),
  statut: text("statut").default("GEL_CONSERVATOIRE").notNull(),
  ordonnanceUrl: text("ordonnance_url"),
  dateOuverture: timestamp("date_ouverture").defaultNow().notNull(),
  dateResolution: timestamp("date_resolution"),
});

export const coffreFortActes = pgTable("coffre_fort_actes", {
  id: serial("id").primaryKey(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  typeActe: text("type_acte").notNull(), // "TITRE_FONCIER" | "PLAN_GEOMETRE" | "CONVENTION_NOTARIEE"
  referenceActe: text("reference_acte").notNull().unique(),
  notaireOuSignataire: text("notaire_ou_signataire").notNull(),
  hashSha256: text("hash_sha256").notNull(),
  selCryptographique: text("sel_cryptographique").notNull(),
  otsProof: text("ots_proof"),
  txBlockchainId: text("tx_blockchain_id"),
  dateEnregistrement: timestamp("date_enregistrement").defaultNow().notNull(),
});

export const batis = pgTable("batis", {
  id: serial("id").primaryKey(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  usageBati: text("usage_bati").notNull(), // "VILLA_RESIDENTIELLE" | "IMMEUBLE_R1" | "HANGAR_COMMERCIAL"
  superficieEmpriseM2: doublePrecision("superficie_emprise_m2").notNull(),
  dateConstat: timestamp("date_constat").defaultNow().notNull(),
  valeurEstimeeFcfa: integer("valeur_estimee_fcfa").notNull(),
  plusValueCalculeeFcfa: integer("plus_value_calculee_fcfa").default(0).notNull(),
});

export const utilisateurs = pgTable("utilisateurs", {
  id: serial("id").primaryKey(),
  npi: text("npi").notNull().unique(), // ex: "FICTIF-BEN-2026-0041" ou "ANIP-..."
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  email: text("email"),
  telephone: text("telephone"),
  role: text("role").notNull(), // "CITOYEN" | "NOTAIRE" | "AGENT" | "COMMUNE" | "BANQUE" | "ANDF" | "CSAF" | "MINISTERE" | "CONTROLEUR"
  roleLabel: text("role_label"),
  titre: text("titre"),
  etablissementNom: text("etablissement_nom"),
  commune: text("commune").notNull(),
  departement: text("departement").notNull(),
  badge: text("badge"),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  statutValidation: text("statut_validation").default("VALIDE").notNull(), // "VALIDE" | "EN_ATTENTE_VALIDATION" | "REJETE" | "SUSPENDU"
  dateDemande: text("date_demande"),
  dateValidation: text("date_validation"),
  validePar: text("valide_par"),
  motifRefus: text("motif_refus"),
  creeLe: timestamp("cree_le").defaultNow().notNull(),
  misAJourLe: timestamp("mis_a_jour_le").defaultNow().notNull(),
});

