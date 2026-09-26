# 🏛️ Cahier des Charges & Source de Vérité Absolue — ANYIGBA (BENINLAND)
> **Projet** : Anyigba — Plateforme Nationale de Gestion et de Sécurisation du Foncier au Bénin  
> **Référence Dépôt** : `git@github.com:SAGBO4/BENINLAND.git`  
> **Statut** : Document de Référence et Source de Vérité Unique pour l'ensemble des Agents et Développeurs  
> **Version** : 1.0.0  
> **Date** : 26 Septembre 2026  

---

## 1. Vision, Alignement Stratégique et Règle d'Or

### 1.1. Contexte Foncier Béninois
Au Bénin, la terre (« Anyigba » en Fongbe) constitue à la fois un patrimoine culturel, familial et le premier levier économique. Cependant, la prédominance des conventions de vente manuscrites sur papier libre, l'absence de délimitation géorégulée et le manque de transparence entre intervenants (vendeurs, collectivités, notaires, ANDF) engendrent :
1. **La double voire triple vente** d'un même terrain à des acheteurs distincts.
2. **Des contestations violentes de limites** et des conflits successoraux paralysants.
3. **L'encombrement massif des juridictions**, ayant nécessité la création par l'État de la **Cour Spéciale des Affaires Foncières (CSAF)**.
4. **La lenteur de délivrance** des Titres Fonciers (TF) et Certificats de Propriété Foncière (CPF).

### 1.2. La Mission d'Anyigba
Anyigba rend l'information foncière béninoise **visible, vérifiable et infalsifiable** :
- **Principe Fondamental** : *« On ne met pas la terre sur la blockchain, on y met la preuve. Et on rend la double vente techniquement impossible. »*
- Le registre souverain officiel réside dans **PostgreSQL + PostGIS** ; la blockchain (**BéninChain** et ancrage **Bitcoin / OpenTimestamps**) conserve les empreintes cryptographiques SHA-256 scellées des états validés.

### 1.3. 🛑 Règle N°1 Absolue : « La Démo ne doit jamais planter »
- L'application est destinée à des présentations de haut niveau (gouvernement, ANDF, collectivités, partenaires techniques et financiers, citoyens).
- **Zéro rupture de service** : tous les parcours critiques doivent fonctionner de bout en bout de manière déterministe.
- Les services tiers (SMS, USSD, paiements Mobile Money MTN/Moov, ancrage blockchain) opèrent en mode **simulation réaliste avec persistance effective en base de données**. Chaque action (envoi de SMS, composition de code USSD, validation de séquestre, ancrage de bloc) produit un enregistrement réel, traçable et réversible.
- Un bouton d'administration permet de **réinitialiser la base à son état initial parfait (seed déterministe)** en un clic.

---

## 2. Charte Graphique et Exigences UI / UX de Haut Niveau

L'exigence esthétique et ergonomique du projet est **maximale**. L'interface doit refléter à la fois la solennité républicaine, l'ancrage territorial béninois et la modernité technologique.

### 2.1. Palette de Couleurs Républicaines Béninoises Sublimées
- **Vert Forêt Foncier (Primaire)** : `#0A5C36` (dominant, sécurité, légitimité, terre béninoise).
- **Vert Forêt Clair / Accent** : `#15803D` / `#22C55E` (badges de validation, statut TF valide).
- **Or Solaire Béninois (Secondaire)** : `#F2B822` / `#D97706` (chaleur républicaine, authenticité, droits coutumiers).
- **Rouge Terre Cuite (Alerte / Litige)** : `#C73E1D` / `#DC2626` (parcelle en litige, tentative de fraude bloquée).
- **Bleu Outremer Institutionnel (CPF / Notaires)** : `#1D4ED8` / `#2563EB` (certificats, actes officiels).
- **Fond & Typographie** :
  - Mode Clair Institutionnel : Fond blanc soyeux `#F8FAFC`, cartes de contenu blanches `#FFFFFF` avec bordures subtiles `#E2E8F0` et ombrages délicats.
  - Mode Sombre / Panneau Ardoise : Ardoise profonde `#0F172A` / `#1E293B` pour la solennité des terminaux d'administration et des simulateurs USSD.

### 2.2. Typographie et Accessibilité
- Polices système : `Inter`, `Plus Jakarta Sans` ou `Outfit`, offrant une lisibilité parfaite des chiffres et coordonnées cadastrales.
- Conformité stricte **WCAG 2.1 AA** : contrastes vérifiés (≥ 4.5:1), navigation clavier intégrale.
- **Double encodage des statuts** : chaque état combine obligatoirement une couleur distinctive, une icône SVG univoque et un label textuel clair (vert 🟢 TF, bleu 🔵 CPF, jaune 🟡 Coutumier, rouge 🔴 Litige, cadenas 🔒 Verrouillé).
- **Multilinguisme et audio-accessibilité** : synthèse vocale et attestations audio disponibles en Français et dans les langues nationales majeures (**Fongbe, Yoruba, Goun, Baatombu/Bariba, Dendi**).

### 2.3. Architecture Spécifique de la Landing Page
Conformément aux directives, la page d'accueil d'Anyigba adopte une **structure asymétrique à fort impact visuel** :
- **À Gauche (Vitrine & Action Publique)** :
  - **Bannière Officielle** : Armoiries républicaines, devise « Fraternité - Justice - Travail », certification souveraine ANDF.
  - **Titre d'Autorité** : « Cadastre National Numérique & Sécurisation Foncier Souverain du Bénin ».
  - **Moteur de Vérification Publique Express** : Champ de recherche proéminent permettant de vérifier instantanément une parcelle par son code (ex: `OUI-0421`, `ABC-0012`) avec retour d'intégrité en direct.
  - **Statistiques Clés en Direct (KPIs)** : Parcelles immatriculées, tentatives de double vente déjouées, conventions assistées sécurisées, litiges résolus.
  - **Aperçu Cartographique Flottant** : Mini-carte interactive dynamique illustrant les statuts cadastraux.
- **À Droite (Module de Connexion Multi-Rôles Interactif)** :
  - Carte de connexion élégante et surélevée.
  - **Sélecteur de Rôle Instantané (Profils de Démo)** avec badges distinctifs :
    1. 🏛️ **Notaire** (`notaire@demo.bj`)
    2. 📜 **ANDF** (`andf@demo.bj`)
    3. 📍 **Agent Foncier de Village** (`agent@demo.bj`)
    4. ⚖️ **Magistrat CSAF** (`csaf@demo.bj`)
    5. 🏢 **Commune / Mairie** (`commune@demo.bj`)
    6. 👤 **Citoyen / Propriétaire** (`citoyen@demo.bj`)
    7. 🏦 **Banque / Prêteur** (`banque@demo.bj`)
    8. ⚙️ **Administrateur** (`admin@demo.bj`)
  - **Flux de redirection immédiat** : En sélectionnant un rôle ou en se connectant, l'utilisateur est instantanément redirigé vers l'espace de travail correspondant (`/espace/notaire`, `/espace/andf`, `/espace/agent`, etc.) avec une session active et des données contextualisées.

---

## 3. Matrice des Rôles et Espaces Applicatifs

| Rôle Métier | Code Rôle | Espace Dédié | Actions Autorisées |
|---|---|---|---|
| **Citoyen / Acheteur** | `citoyen` | `/espace/citoyen` | Consultation de ses biens, vérification publique, signalement d'usurpation |
| **Agent Foncier** | `agent_foncier` | `/espace/agent` | Saisie de convention assistée au village, levé GPS, photos des bornes, recueil des voix |
| **Géomètre Expert** | `geometre` | `/espace/geometre` | Dépôt des plans de bornage, calculs de contenance, délimitation parcellaire |
| **Notaire** | `notaire` | `/espace/notaire` | Ouverture d'intention de vente, pose du verrou anti-double-vente, actes authentiques |
| **ANDF** | `andf` | `/espace/andf` | Instruction technique, validation définitive des mutations, délivrance des TF et CPF |
| **Commune / Mairie** | `commune` | `/espace/commune` | Cadastre communal, permis de construire, calcul de la taxe de plus-value foncière |
| **Juge CSAF** | `juge_csaf` | `/espace/csaf` | Ouverture de litige, gel conservatoire immédiat de la parcelle, ordonnances |
| **Banque / Prêteur** | `banque` | `/espace/banque` | Consultation de solvabilité foncière, inscription et levée d'hypothèques |
| **Administrateur** | `admin` | `/admin` | Supervision globale, santé des nœuds blockchain, audit trail, réinitialisation démo |

---

## 4. Spécifications Fonctionnelles Détaillées des Modules

### Module 1 : Carte Foncière Interactive PostGIS (`/carte`)
- Carte vectorielle Leaflet enrichie (OpenStreetMap + vue hybride satellite).
- Polygones cadastraux réels et réalistes calqués sur des communes béninoises modèles :
  - **Ouidah** (centre historique, zone côtière, Pahou, Djègbadji).
  - **Abomey-Calavi** (Togoudo, Akassato, Zoundja).
  - **Allada** et **Kpomassè** (terres agricoles et domaines coutumiers).
- Code couleur strict des polygones :
  - 🟢 **Vert** : Titre Foncier (TF) immatriculé et garanti.
  - 🔵 **Bleu** : Certificat de Propriété Foncière (CPF).
  - 🟡 **Jaune** : Droit coutumier déclaré au registre villageois.
  - 🔴 **Rouge** : Parcelle frappée d'un litige ou d'un gel judiciaire.
  - 🔒 **Violet / Hachuré** : Parcelle verrouillée (mutation ou cession en cours).
  - ⚪ **Gris** : Domaine public ou parcelle non encore répertoriée.
- Filtres multi-critères : Par commune, statut juridique, superficie, usage (agricole, bâti, commercial).
- Clic sur polygone : Fiche synthétique avec code parcelle, dimensions, statut juridique, et bouton de vérification complète.

### Module 2 : Moteur de Vérification Publique & Canaux Multiples (`/verification`, `/demo/telephone`)
- **Web** : Recherche par numéro de parcelle (ex: `OUI-0421`).
  - Restitution du statut certifié : type de droit, présence ou non de litige, présence d'un verrou actif.
  - Masquage conforme APDP de l'identité du détenteur (ex: `M. Koffi D*** S***`).
  - Bouton d'écoute audio du statut en Fongbe, Yoruba, Français.
- **Simulateur Téléphone Feature Phone (USSD & SMS)** :
  - Composant graphique reproduisant un téléphone portable populaire.
  - **Canal SMS** : Saisie de `VERIF OUI-0421` au numéro court `132` → Réponse SMS instantanée formatée.
  - **Canal USSD** : Composition de `*123*7#` → Menu interactif à étapes :
    1. Vérifier un terrain
    2. Alerte cession
    3. Contacter l'agent communal

### Module 3 : Verrou Anti-Double-Vente & Workflow de Mutation Sécurisée (`/espace/notaire`, `/espace/andf`)
- **Problème résolu** : Un vendeur cède le même matin son terrain à deux personnes différentes chez deux officiers différents, ou perçoit les fonds sans céder la propriété.
- **Protocole de Vente Sécurisée & Verrouillage Cryptographique** :
  1. **Intention de Cession & Pose du Verrou** : Dès qu'une vente est initiée (par le notaire ou par l'agent foncier), le statut de la parcelle bascule instantanément en `en_verrou_mutation = true` (état 🔒).
  2. **Notification Propriétaire Automatique** : Le titulaire légitime reçoit immédiatement un SMS certifié (« *Alerte Anyigba : Une transaction de cession a été initiée sur votre parcelle OUI-0421. Si vous n'en êtes pas à l'origine, tapez 2 pour geler immédiatement.* »).
  3. **Blocage Concurrence Strict (Anti-Double-Vente)** : Toute tentative simultanée ou ultérieure sur cette parcelle par un tiers (autre notaire, acheteur ou agent) est rejetée avec une interdiction système :  
     `409 CONFLICT: PARCELLE_VERROUILLEE - Mutation en cours sous le dossier #MUT-2026-X. Aucune transaction concurrente n'est recevable.`
  4. **Paiement Sécurisé sous Séquestre (Escrow Foncier)** :
     - L'acheteur effectue le paiement du prix convenu via un compte séquestre étatique / notarial (supporté par **Mobile Money MTN MoMo, Moov Money** ou virement bancaire).
     - Les fonds sont garantis et cantonnés sous séquestre (`statut_sequestre = "FONDS_BLOQUES_SEQUESTRE"`).
     - Ni le vendeur ni l'acheteur ne peuvent détourner les fonds tant que la procédure n'a pas abouti.
     - Une quittance numérique horodatée avec preuve SHA-256 est générée pour l'acheteur.
  5. **Validation ANDF & Levée du Séquestre** :
     - Après contrôle de conformité par l'officier ANDF, la mutation est validée (`valide_andf_le`).
     - Les fonds sous séquestre sont automatiquement débloqués et versés au vendeur (déduction faite des taxes communales de plus-value).
     - Le verrou est levé et le nouveau droit de propriété est émis au nom de l'acheteur avec son token miroir mis à jour.
     - En cas de rejet motivé (fraude, contestation légitime), les fonds séquestrés sont **intégralement et immédiatement recrédités à l'acheteur**.

### Module 4 : Convention de Vente Assistée au Village & Paiement Sécurisé Terrain (`/espace/agent`)
- Conçue pour les zones rurales et périurbaines où les notaires sont peu présents.
- L'agent foncier assermenté formalise sur place une vente en toute sécurité :
  - **Tracé GPS & Bornage** : Saisie des 4 bornes géographiques avec calcul de surface en temps réel.
  - **Contrôle Topologique Automatique (Zéro Chevauchement)** : L'API PostGIS vérifie géométriquement (`ST_Intersects` / `ST_Overlaps`) que la parcelle n'empiète ni sur une propriété voisine, ni sur un domaine public classé.
  - **Photos Numériques des Bornes** : 4 photographies géolocalisées des bornes en béton enregistrées et scellées.
  - **Authentification NPI des Parties** : Contrôle du NPI du vendeur, de l'acheteur, des témoins et du chef de village.
  - **Recueil des Témoignages Vocaux en Langues Nationales** : Déclarations audio enregistrées des riverains (Nord, Sud, Est, Ouest) et du chef de village en Fongbe, Yoruba, Goun, etc., attestant des limites et de la propriété coutumière.
  - **Séquestre Mobile Money Villageois** : L'acheteur dépose le paiement sur le compte de séquestre Mobile Money via un parcours USSD/MoMo simulé réaliste. Les fonds sont bloqués jusqu'à la délivrance de l'attestation communale.
  - **Chaîne de Preuve & Traçabilité Complète** : L'ensemble du dossier (coordonnées GPS, photos, audio, NPI, quittance MoMo) est compilé en un condensé cryptographique **SHA-256**, ancré sur **BéninChain** et vérifiable à tout moment.

### Module 5 : Coffre-Fort Numérique des Actes & Preuve d'Intégrité Blockchain (`/espace/notaire`, `/verification/actes`)
- Chaque document foncier (titre de propriété, plan cadastral de géomètre, acte notarié de vente, procès-verbal de bornage) est stocké avec :
  - Son empreinte cryptographique **SHA-256**.
  - Un sel cryptographique unique combiné au `HASH_PEPPER` système.
  - Son identifiant de transaction miroir sur le smart contract **BéninChain RegistreFoncier**.
  - Son attestation d'ancrage calendaire **OpenTimestamps**.
- **Démonstrateur de Détection de Fraude** :
  - L'interface intègre un bouton interactif de simulation : *« Tenter de falsifier le document »* (altère un pixel ou une lettre du document fictif).
  - Le système recalcule le hash à la volée, le compare à la preuve ancrée et affiche en rouge vif :  
    ❌ **ALERTE FALSIFICATION DÉTECTÉE : L'empreinte du document présenté ne correspond pas à la preuve souveraine enregistrée le 14/03/2026.**

### Module 6 : Gestion des Litiges Foncier & Chambre Spéciale (CSAF) (`/espace/csaf`)
- Enregistrement des litiges : oppositions de limites, revendications d'héritiers non signataires, contestations de droit coutumier.
- Déclenchement du **Gel Conservatoire** : La parcelle passe au rouge `EN_LITIGE`. Toute vente, mutation ou inscription d'hypothèque est automatiquement bloquée par le moteur de règles.
- Journal de conciliation : Recueil des avis de médiation du chef de village et des sages.
- Publication des jugements : Dépôt de la décision de justice numérisée avec levée de gel ou attribution ordonnée par la cour.

### Module 7 : Successions & Carnet de Famille Foncier (`/espace/citoyen`, `/espace/notaire`)
- Prévention des déchirements familiaux lors des héritages.
- Déclaration de son vivant par le patriarche / chef de famille de la répartition de ses parcelles dans un **Carnet Familial Numérique**.
- Consentement anticipé des héritiers authentifié par leurs NPI respectifs.
- En cas de décès, le notaire charge le carnet familial : les quote-parts en indivision sont automatiquement formalisées, évitant la vente clandestine du bien par un héritier isolé.

### Module 8 : Bâtis, Urbanisme & Calcul de la Plus-Value Communale (`/espace/commune`)
- Déclaration et inventaire des bâtis (villas, magasins, entrepôts, clôtures).
- Calculateur automatique de la **Taxe sur la Plus-Value Foncière** lors d'une mutation (prix d'acquisition antérieur vs prix de cession actuel, déduction des travaux et coefficient communal).
- Tableau de bord des recettes fiscales générées pour la commune.

### Module 9 : Observatoire Foncier & Statistiques Nationales (`/admin`, `/espace/banque`)
- Carte de chaleur (Heatmap) des prix moyens du m² par arrondissement et commune (Ouidah, Calavi, Cotonou, etc.).
- Indicateurs de délais moyens de traitement d'un dossier foncier (réduction de 18 mois à 14 jours).
- Graphique des tentatives de double vente déjouées grâce au verrou cryptographique.

---

## 5. Architecture Technique et Modèle de Données

### 5.1. Stack Technique Souveraine
- **Framework Front/Back** : Next.js 16 (App Router), React 19, TypeScript strict.
- **Style & Composants** : Tailwind CSS v4, shadcn/ui, Lucide Icons, Leaflet / React-Leaflet.
- **Base de Données** : PostgreSQL 16 avec extension spatiale **PostGIS 3.4** (compatibilité Neon / Supabase / Docker local).
- **ORM & Migrations** : Drizzle ORM, Drizzle Kit.
- **Couche Hors-Ligne** : Service Worker PWA (Serwist / Workbox) + IndexedDB pour les agents ruraux.
- **Sécurité** : Validation systématique Zod en amont des Route Handlers, protection IDOR stricte basée sur les sessions serveur, masquage des données sensibles.
- **Conteneurisation** : Dockerfile multi-stage optimisé (Next.js standalone) et docker-compose avec service PostgreSQL/PostGIS et seed automatisé.

### 5.2. Structure des Dossiers dans le Dépôt
```
/home/dev-team/BENINLAND/
├── docs/
│   ├── CDC_SOURCE_DE_VERITE.md          <- Ce document de référence
│   └── ROADMAP_IMPLEMENTATION.md        <- Feuille de route d'implémentation
├── src/
│   ├── app/
│   │   ├── (public)/                    <- Accueil, vitrine, vérificateur, carte publique
│   │   ├── (espace)/                    <- Espaces réservés selon les rôles
│   │   │   ├── notaire/                 <- Espace Notaire & Mutations
│   │   │   ├── andf/                    <- Espace ANDF & Titres
│   │   │   ├── agent/                   <- Espace Agent Foncier & Conventions
│   │   │   ├── commune/                 <- Espace Commune, Bâtis & Plus-Value
│   │   │   ├── csaf/                    <- Espace Magistrat CSAF & Litiges
│   │   │   ├── citoyen/                 <- Espace Propriétaire & Carnet Familial
│   │   │   └── banque/                  <- Espace Établissements de Crédit
│   │   ├── demo/
│   │   │   └── telephone/               <- Faux téléphone simulateur SMS & USSD
│   │   ├── admin/                       <- Console d'administration & reset démo
│   │   └── api/v1/                      <- API REST sécurisée (parcelles, mutations, etc.)
│   ├── components/
│   │   ├── ui/                          <- Composants shadcn/ui (boutons, cartes, modales, etc.)
│   │   ├── layout/                      <- Header républicain, Footer, Navigations
│   │   ├── auth/                        <- Panneau de connexion multi-rôles & quick switch
│   │   ├── carte/                       <- Composants cartographiques Leaflet PostGIS
│   │   ├── verification/                <- Fiches de vérification & lecteur audio multilingue
│   │   ├── mutations/                   <- Gestion du verrou et approbations
│   │   └── conventions/                 <- Formulaire terrain, GPS, recueil audio
│   ├── domains/                         <- Logique métier pure découplée
│   │   ├── parcelles/                   <- Règles spatiales et juridiques
│   │   ├── mutations/                   <- Règles de verrouillage et transferts
│   │   ├── conventions/                 <- Règles des conventions assistées
│   │   ├── litiges/                     <- Règles de gel et arbitrage
│   │   ├── blockchain/                  <- Hachage SHA-256 salé et smart contract miroir
│   │   └── audio/                       <- Synthèses et dictionnaires audio Fongbe/Yoruba
│   ├── repositories/                    <- Accès exclusif aux données Drizzle
│   ├── lib/                             <- Utilitaires (auth, hash, geo, seed, simulated-channels)
│   └── types/                           <- Déclarations TypeScript
├── db/
│   ├── schema/                          <- Schémas de tables Drizzle
│   ├── migrations/                      <- Migrations SQL versionnées
│   └── seed/                            <- Jeu de données déterministe (seed 2026)
├── contracts/                           <- Smart contract Solidity RegistreFoncier.sol
├── docker/
│   ├── Dockerfile
│   └── init.sql                         <- Extension PostGIS
├── docker-compose.yml
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 6. Schéma de Données Drizzle (Extrait Normatif)

Le modèle de données d'Anyigba structure l'ensemble des entités foncières :

```typescript
// db/schema/foncier.ts

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
  polygoneGeojson: jsonb("polygone_geojson").notNull(), // Coordonnées géoréférencées
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
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  cedantId: integer("cedant_id").references(() => detenteurs.id).notNull(),
  cessionnaireId: integer("cessionnaire_id").references(() => detenteurs.id).notNull(),
  notaireId: text("notaire_id").notNull(),
  prixCessionFcfa: integer("prix_cession_fcfa").notNull(),
  statut: text("statut").notNull(), // "INITIEE_VERROUILLEE" | "ACTE_NOTARIE_SIGNE" | "VALIDEE_ANDF" | "REJETEE"
  valideAndfLe: timestamp("valide_andf_le"),
  hashPreuve: text("hash_preuve").notNull(),
  creeLe: timestamp("cree_le").defaultNow().notNull(),
});

export const conventionsAssistees = pgTable("conventions_assistees", {
  id: serial("id").primaryKey(),
  codeConvention: text("code_convention").notNull().unique(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id),
  agentNpi: text("agent_npi").notNull(),
  vendeurNpi: text("vendeur_npi").notNull(),
  acheteurNpi: text("acheteur_npi").notNull(),
  commune: text("commune").notNull(),
  village: text("village").notNull(),
  surfaceM2: doublePrecision("surface_m2").notNull(),
  prixFcfa: integer("prix_fcfa").notNull(),
  photosBornes: jsonb("photos_bornes").notNull(),
  temoignagesVocaux: jsonb("temoignages_vocaux").notNull(),
  consentementChefVillage: boolean("consentement_chef_village").default(true).notNull(),
  statutSequestre: text("statut_sequestre").default("EN_SEQUESTRE").notNull(),
  dossierHashSha256: text("dossier_hash_sha256").notNull(),
  dateSignature: timestamp("date_signature").defaultNow().notNull(),
});

export const litiges = pgTable("litiges", {
  id: serial("id").primaryKey(),
  parcelleId: integer("parcelle_id").references(() => parcelles.id).notNull(),
  demandeurNom: text("demandeur_nom").notNull(),
  motif: text("motif").notNull(),
  juridiction: text("juridiction").default("CSAF_COTONOU").notNull(),
  statut: text("statut").default("GEL_CONSERVATOIRE").notNull(), // "GEL_CONSERVATOIRE" | "AUDIENCE" | "CONCILIE" | "JUGE"
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
```

---

## 7. Jeu de Données de Référence (Personas Démo 2026)

Le scénario de référence pour les démonstrations met en scène :
- **La Famille Dossou (Ouidah)** :
  - Propriétaire de la parcelle `OUI-0421` (surface : 1 250 m², située à Ouidah Pahou).
  - Statut de départ : Droit coutumier déclaré sans litige, non verrouillé.
- **L'Acheteur** : `M. Koffi Mensah`, NPI `FICTIF-BEN-2026-0003`.
- **L'Agent Foncier** : `Mamadou Bio`, affecté à la commune de Ouidah.
- **Le Notaire Instrumentant** : `Me Christian Agbossou`, Notaire à Cotonou/Ouidah.
- **L'Officier ANDF** : `Mme Reine Houndété`, Directrice du Cadastre.
- **Le Magistrat CSAF** : `Juge Sossa`, Cour Spéciale des Affaires Foncières.

Ce scénario permet de dérouler l'intégralité du cycle de vie :
`Vérification publique` ➔ `Convention assistée avec voix Fongbe` ➔ `Pose du verrou` ➔ `Tentative de double vente bloquée` ➔ `Validation ANDF` ➔ `Vérification d'intégrité du document`.

---

## 8. Critères d'Acceptance & Validations Techniques
1. **Compilation & Build** : Next.js 16 compile sans avertissement ni erreur TypeScript (`pnpm build`).
2. **Qualité de Code** : Aucune fonction factice (stub), pas de faux `console.log` d'enregistrement, toutes les mutations sont réellement persistées.
3. **Tests Automatisés** : Tests unitaires Vitest couvrant le calcul des empreintes, la détection de chevauchement géométrique, la pose et le rejet du verrou.
4. **Indépendance Hors Ligne** : Les formulaires agents fonciers fonctionnent localement avec sauvegarde IndexedDB et réconciliation dès retour du réseau.
5. **Fidélité Visuelle** : Respect absolu de la charte républicaine, de l'élégance de la Landing Page avec son module de connexion multi-rôles à droite, et des retours sonores multilingues.
