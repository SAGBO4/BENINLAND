# 🌍 ANYIGBA (BENINLAND)
### Plateforme Nationale Souveraine de Gestion et de Sécurisation du Foncier en République du Bénin

<p align="center">
  <img src="public/armoiries-benin.png" alt="Armoiries de la République du Bénin" width="120" />
</p>

<p align="center">
  <strong>République du Bénin</strong><br>
  <em>Fraternité — Justice — Travail</em><br>
  <strong>Agence Nationale du Domaine et du Foncier (ANDF)</strong> &bull; <strong>Ministère du Cadre de Vie et des Transports</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react" alt="React" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/Drizzle_ORM-0.40.1-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM" /></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL_/_PostGIS-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" /></a>
  <a href="https://www.electronjs.org"><img src="https://img.shields.io/badge/Electron-44.4.5-47848F?style=for-the-badge&logo=electron" alt="Electron" /></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/Vitest-3.0.7-FCC72B?style=for-the-badge&logo=vitest" alt="Vitest" /></a>
  <a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
</p>

---

## 📌 Sommaire

1. [Vision & Problématique Nationale](#-1-vision--problématique-nationale)
2. [Principes Fondamentaux de Sécurité Foncire](#-2-principes-fondamentaux-de-sécurité-foncière)
3. [Fonctionnalités Clés & Piliers Métiers](#-3-fonctionnalités-clés--piliers-métiers)
4. [Matrice des Rôles & Espaces Applicatifs Dédiés](#-4-matrice-des-rôles--espaces-applicatifs-dédiés)
5. [Architecture Technique & Stack Technologique](#-5-architecture-technique--stack-technologique)
6. [Arborescence Détaillée du Projet](#-6-arborescence-détaillée-du-projet)
7. [Prérequis Système](#-7-prérequis-système)
8. [Installation & Guide de Démarrage Pas-à-Pas](#-8-installation--guide-de-démarrage-pas-à-pas)
9. [Scripts Disponibles & Commandes NPM](#-9-scripts-disponibles--commandes-npm)
10. [Application Desktop Souveraine (Electron)](#-10-application-desktop-souveraine-electron)
11. [Assurance Qualité, Tests & Audit Adversarial](#-11-assurance-qualité-tests--audit-adversarial)
12. [Déploiement & Conteneurisation](#-12-déploiement--conteneurisation)
13. [Conformité Légale & Protection des Données (APDP / Code Foncier)](#-13-conformité-légale--protection-des-données)
14. [Équipe, Gouvernance & Support](#-14-équipe-gouvernance--support)

---

## 🏛️ 1. Vision & Problématique Nationale

Au Bénin, la terre (**« Anyigba »** en langue Fongbe) est à la fois l'héritage sacré des ancêtres, le pilier de la paix sociale et le premier actif économique des ménages et des entreprises. 

Pendant des décennies, l'écosystème foncier traditionnel a souffert de failles structurelles majeures :
- **La double ou triple vente** d'une même parcelle par un vendeur indélicat ou des cohéritiers concurrents.
- **La prolifération des conventions manuscrites sous seing privé**, signées sur papier libre, sans coordonnées géoréférencées fiables, sans bornes cadastrales inaltérables ni vérification d'identité souveraine.
- **L'engorgement massif des juridictions civiles**, ayant conduit le Gouvernement du Bénin à instituer la **Cour Spéciale des Affaires Foncières (CSAF)** pour traiter le contentieux foncier d'urgence.
- **L'exclusion numérique des populations rurales et des aînés**, ne maîtrisant ni le français écrit ni les interfaces web complexes.

### La Mission d'Anyigba (BENINLAND)
**Anyigba** unifie l'ensemble des acteurs de la chaîne foncière béninoise (Citoyens, Notaires, Agents Fonciers de village, Géomètres, ANDF, Mairies, Banques, Magistrats CSAF) au sein d'une infrastructure numérique d'autorité :
- **Visible** : Cartographie cadastrale interactive haute précision PostGIS/Leaflet couvrant les 77 communes et les 6 Pôles Territoriaux.
- **Vérifiable en 30 secondes** : Par le web, par QR Code souverain, par SMS (numéro court `132`), par USSD feature phone (`*123*7#`) ou par synthèse vocale en langues nationales (**Fongbe, Yoruba, Hausa, Français**).
- **Infalsifiable & Inviolable** : Verrouillage cryptographique anti-double-vente, séquestre bancaire/Mobile Money (MTN MoMo & Moov Money), coffre-fort d'actes scellés par SHA-256 et ancrage sur registre immuable (**BéninChain** et **OpenTimestamps**).

> [!IMPORTANT]
> **Règle N°1 du Projet : « La Démo et le Registre Souverain ne doivent jamais faillir. »**  
> Tous les parcours critiques fonctionnent de bout en bout de façon déterministe. Les services tiers (télécoms, Mobile Money, blockchain) sont émulés avec une **persistance effective et traçable en base de données**, avec la possibilité d'une réinitialisation atomique en un clic vers un état de référence parfait.

---

## 🛡️ 2. Principes Fondamentaux de Sécurité Foncière

```mermaid
flowchart TD
    A["Vendeur & Acheteur"] -->|Initiation Cession| B["Espace Notaire / Agent Foncier"]
    B -->|Pose Immédiate| C{"VERROU ATOMIQUE<br/>en_verrou_mutation = true"}
    C -->|Parcelle 🔒| D["Tentative de double vente refusée<br/>Code 409 CONFLICT"]
    C -->|Notification SMS Propriétaire| E["Alerte temps réel NPI"]
    C -->|Séquestre Mobile Money / Virement| F["Fonds bloqués sous séquestre étatique"]
    F -->|Contrôle Réglementaire| G["Instruction & Validation ANDF"]
    G -->|Succès| H["Droit transféré + Fonds libérés + Acte scellé SHA-256"]
    G -->|Rejet / Litige CSAF| I["Fonds remboursés + Parcelle gelée ou libérée"]
```

### Le Crédo Architectural
> *« On ne met pas la terre sur la blockchain, on y met la preuve. Et on rend la double vente mathématiquement et logiquement impossible. »*

1. **Le registre souverain légal** réside dans la base relationnelle géospatiale **PostgreSQL + PostGIS**.
2. **Le verrouillage transactionnel atomique** garantit qu'aucune seconde convention ou intention de mutation ne peut être reçue pendant qu'un dossier est ouvert.
3. **Le séquestre financier intégré** protège l'acheteur contre la fuite du vendeur avant la validation du titre de propriété.
4. **La couche d'intégrité cryptographique** conserve les condensés numériques SHA-256 avec salage (`HASH_PEPPER`) et empreintes OpenTimestamps.

---

## ⚡ 3. Fonctionnalités Clés & Piliers Métiers

### 🔍 1. Moteur de Recherche & Vérification Publique Multi-Canal
Accessible sans prérequis technique ni compte obligatoire :
- **Recherche Instantanée** : Saisie du code cadastral unique (ex: `OUI-0421`, `CAL-1002`, `COT-0012`).
- **Restitution Certifiée** : Statut juridique clair (Titre Foncier 🟢, CPF 🔵, Coutumier Déclaré 🟡, Litige 🔴, Cession Verrouillée 🔒).
- **Conformité APDP** : Masquage automatique des données à caractère personnel du propriétaire (`M. Sossou A*** M***`).
- **QR Code Souverain** : Scannable directement sur les attestations d'affichage et certificats physiques.
- **Synthèse Vocale 229 (API TTS)** : Restitution audio fluide de la situation juridique du terrain en **Fongbe, Yoruba, Hausa et Français**, éliminant la barrière de l'analphabétisme.
- **Simulateur Téléphone Portable (Feature Phone)** :
  - **SMS (Numéro Court 132)** : Commande `VERIF <CODE_PARCELLE>` avec réponse instantanée officielle.
  - **USSD (`*123*7#`)** : Navigation interactive par menus numériques adaptée aux zones à couverture réseau 2G.

### 🗺️ 2. Cartographie Cadastrale Interactive PostGIS & Leaflet (`/carte`)
- Visualisation vectorielle interactive sur fonds de carte haute fidélité (OpenStreetMap, satellite hybride).
- **Intégration des 6 Pôles Territoriaux du Bénin** :
  - *Grand-Nokoué* (Cotonou, Abomey-Calavi, Ouidah, Sèmè-Kpodji, Porto-Novo)
  - *Sud-Ouest* (Mono-Couffo et plateau de l'Atlantique intérieur)
  - *Zou-Collines* (Plateau central, Abomey, Bohicon, Dassa)
  - *Borgou-Sud* (Parakou, bassin cotonnier et agro-pastoral)
  - *Atacora-Donga* (Chaîne de l'Atacora, Natitingou, Djougou)
  - *Alibori* (Grand Nord sahélien, Kandi, Malanville)
- **Filtres Avancés** : Par commune, pôle, statut juridique, superficie, usage (Agricole, Bâti, Commercial).
- **Radar Télémétrique & Inspecteur Foncier** : Analyse géométrique détaillée, périmètre, surface calculée, coordonnées WGS84 des bornes et historique des actes.

### 🔒 3. Verrou Anti-Double-Vente & Mutations Notariées (`/espace/notaire`, `/espace/andf`)
- Dès l'ouverture de l'acte par le notaire, la parcelle est instantanément verrouillée.
- Une tentative de vente simultanée chez un confrère ou un agent déclenche une **interdiction système 409 Conflict**.
- Intégration d'un module de **Paiement sous Séquestre Mobile Money (MTN / Moov)** garantissant la consignation des fonds jusqu'à la délivrance du titre définitif par l'ANDF.
- Déduction automatisée de la taxe communale sur la plus-value lors du déblocage final.

### 📍 4. Convention de Vente Assistée au Village (`/espace/agent`)
Conçue spécifiquement pour le milieu rural et les arrondissements périurbains :
- Saisie sur le terrain par l'Agent Foncier assermenté.
- Saisie des coordonnées GPS des 4 bornes avec **contrôle topologique automatique de non-chevauchement (zéro overlap PostGIS)**.
- Prise de vue géolocalisée et scellement numérique des **photos des bornes**.
- **Recueil des témoignages vocaux** en langues nationales des voisins de bornes (Nord, Sud, Est, Ouest) et du Chef de Village.
- Validation décentralisée avec émission d'un dossier complet scellé en SHA-256.

### 🛡️ 5. Coffre-Fort Numérique des Actes & Détecteur de Falsification (`/verification/actes`)
- Archivage sécurisé des Titres Fonciers, Plans de Bornage de Géomètres et Actes de Cession.
- **Générateur d'Empreinte SHA-256 Salée** avec identifiant de preuve **BéninChain** et ancrage **OpenTimestamps**.
- **Laboratoire Interactif de Pentest Foncier** : Possibilité de tester la falsification d'un acte en injectant un pixel ou un caractère modifié pour observer la détection instantanée de fraude par la machine cryptographique.

### ⚖️ 6. Chambre Spéciale des Affaires Foncières - CSAF (`/espace/csaf`)
- Dépôt de requête et instruction des litiges fonciers.
- **Gel Conservatoire Automatique** : Passage instantané au statut rouge bloquant toute transaction, division ou hypothèque sur la parcelle.
- Historique d'audiences, conciliation traditionnelle et publication des jugements et ordonnances.

### 👨‍👩‍👧‍👦 7. Carnet de Famille Foncier & Successions (`/espace/citoyen`)
- Déclaration anticipée du patrimoine foncier familial du vivant des parents.
- Recueil des consentements des ayants droit authentifiés par le Numéro Personnel d'Identification (**NPI**).
- Liquidation successorale transparente pilotée avec le Notaire, prévenant les ventes occultes par un héritier isolé.

### 🏢 8. Cadastre Communal & Taxe sur la Plus-Value (`/espace/commune`)
- Déclaration et inventaire des constructions et bâtis (villas, immeubles, hangars).
- Moteur de calcul automatisé de la **Taxe Communale sur la Plus-Value Immobilière** lors de chaque mutation.
- Suivi en temps réel des recettes fiscales et délivrance d'avis d'imposition foncière.

---

## 👥 4. Matrice des Rôles & Espaces Applicatifs Dédiés

Anyigba intègre un système d'authentification souveraine multi-rôles avec bascule instantanée en un clic pour les présentations officielles :

| Rôle Métier | Identifiant Démo | Accès Espace | Missions Principales |
|---|---|---|---|
| **🏛️ Notaire Instrumentaire** | `notaire@demo.bj` | `/espace/notaire` | Pose de verrou anti-double-vente, actes authentiques, gestion du séquestre |
| **📜 ANDF (Direction Générale)** | `andf@demo.bj` | `/espace/andf` | Instruction souveraine, validation définitive, émission des TF et CPF |
| **📍 Agent Foncier de Village** | `agent@demo.bj` | `/espace/agent` | Conventions assistées, bornage GPS, recueil audio des témoins riverains |
| **⚖️ Magistrat CSAF** | `csaf@demo.bj` | `/espace/csaf` | Contentieux foncier, gel conservatoire, ordonnances de conciliation |
| **🏢 Commune / Mairie** | `commune@demo.bj` | `/espace/commune` | Recensement des bâtis, calcul de taxe sur plus-value, permis d'aménager |
| **👤 Citoyen / Propriétaire** | `citoyen@demo.bj` | `/espace/citoyen` | Suivi de patrimoine, carnet de famille foncier, alertes d'usurpation SMS |
| **🏦 Banque / Établissement de Crédit** | `banque@demo.bj` | `/espace/banque` | Vérification de solvabilité foncière, prise et radiation d'hypothèques |
| **🔎 Contrôleur Foncier Cadastral** | `controleur@demo.bj` | `/espace/controleur` | Inspection topologique, audits de conformité de bornage, levés de réserves |
| **🏛️ Ministère du Cadre de Vie** | `ministere@demo.bj` | `/espace/ministere` | Observatoire national, thermomètre des prix au m², statistiques macro |
| **⚙️ Administrateur Système** | `admin@demo.bj` | `/admin` | Santé des nœuds, audit logs, réinitialisation atomique de la démo |

---

## 🛠️ 5. Architecture Technique & Stack Technologique

```
+-----------------------------------------------------------------------------------+
|                            APPLICATION FRONTEND & DESKTOP                         |
|  Next.js 15 (App Router)  |  React 19  |  Tailwind CSS v4  |  Framer Motion / UI  |
|  Leaflet (SIG / PostGIS)  |  QR Code   |  Electron v44 (Linux AppImage & Win EXE) |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             COUCHE LOGIQUE & API REST                             |
|  Next.js Route Handlers (/api/v1)  |  Validation Zod  |  Authentification Sessions |
|  Moteur Anti-Double-Vente  |  Séquestre Mobile Money  |  Synthèse Vocale TTS 229  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        COUCHE DE DONNÉES & CRYPTOGRAPHIE                          |
|  Drizzle ORM 0.40  |  PostgreSQL 16 + PostGIS 3.4 (Neon Cloud / Docker Local)     |
|  Hachage SHA-256 + PEPPER Souverain  |  Ancrage OpenTimestamps / BéninChain       |
+-----------------------------------------------------------------------------------+
```

- **Frontend** : Next.js 15.1.7 (App Router), React 19, TypeScript strict 5.8, Tailwind CSS v4, Lucide Icons, Leaflet 1.9, Framer Motion.
- **Backend / API** : Next.js API Routes (`src/app/api/v1/*`), Zod schemas pour la validation stricte de schéma, typage de bout en bout.
- **Base de Données & SIG** : PostgreSQL 16 avec extension spatiale PostGIS, Drizzle ORM, Drizzle Kit.
- **Client Desktop** : Electron 44.4.5, Electron Builder 26.15 (empaquetage AppImage x64, tar.gz, Windows portable et installateur).
- **Simulations Réalistes Déterministes** : Passerelle SMS simulée avec accusé de réception, menu USSD interactif, passerelle Mobile Money MTN/Moov, synthèse vocale des langues béninoises.
- **Assurance Qualité & Tests** : Vitest 3.0.7 avec 106 cas de tests automatisés.

---

## 📂 6. Arborescence Détaillée du Projet

```text
BENINLAND/
├── .env.example                     # Modèle officiel des variables d'environnement
├── .env.local                       # Configuration locale de développement
├── docker-compose.yml               # Déploiement multi-conteneurs local (App + PostgreSQL)
├── drizzle.config.ts                # Configuration Drizzle ORM & Drizzle Kit
├── electron-builder.json            # Configuration du packaging desktop (Linux & Windows)
├── next.config.js                   # Configuration Next.js (optimisations de compilation)
├── package.json                     # Dépendances, scripts de build et de test
├── tsconfig.json                    # Configuration TypeScript strict
├── vitest.config.ts                 # Configuration de la suite de tests Vitest
├── desktop/                         # Fichiers binaires exécutables packagés (AppImage, EXE, ZIP)
│   ├── BENINLAND-1.0.0.AppImage     # Binaire exécutable autonome Linux x64
│   ├── BENINLAND 1.0.0.exe          # Binaire exécutable portable Windows x64
│   └── BENINLAND-1.0.0-win.zip      # Archive portable Windows
├── docker/
│   ├── Dockerfile                   # Build multi-stage Node 22 Alpine optimisé
│   └── init.sql                     # Initialisation PostGIS automatisée
├── docs/
│   ├── CDC_SOURCE_DE_VERITE.md      # Cahier des charges exhaustif et règles d'or
│   ├── ROADMAP_IMPLEMENTATION.md    # Feuille de route et jalons de livraison
│   ├── presentation-anyigba.html    # Support interactif de présentation de haut niveau
│   └── ANYIGBA_DOSSIER_DE_PRESENTATION.pdf # Dossier exécutif officiel imprimable
├── electron/
│   ├── main.js                      # Processus principal Electron (menus, fenêtres, raccourcis)
│   ├── preload.js                   # Script de préchargement sécurisé
│   └── start.js                     # Script de démarrage avec détection de port et serveur
├── public/                          # Actifs statiques, armoiries républicaines, icônes
├── tests/                           # 11 suites de tests automatisés (106 tests)
│   ├── adversarial-pentest-qa.test.ts        # Tests de pénétration et résistance aux injections
│   ├── api-auxiliary.test.ts                 # Tests des routes SMS, TTS audio et passerelles
│   ├── api-demo-reset.test.ts                # Test de réinitialisation déterministe
│   ├── api-mutations.test.ts                 # Test du verrou anti-double-vente et séquestre
│   ├── api-verification.test.ts              # Test du moteur de vérification publique
│   ├── beninvie-portal-and-components.test.ts# Validation de l'UI républicaine
│   ├── core-logic.test.ts                    # Logique métier pure et calcul de plus-value
│   ├── frontend-unified.test.ts              # Rendu des composants et pages
│   ├── leaflet-and-gis.test.ts               # Contrôles géographiques et topologiques PostGIS
│   ├── security-crypto-audio.test.ts         # Intégrité SHA-256, sel cryptographique et audio
│   └── system-hardening-adversarial.test.ts  # Durcissement contre fraudes IDOR et usurpations
└── src/
    ├── app/                         # Pages et Routes App Router Next.js
    │   ├── admin/                   # Console d'administration et journal d'audit
    │   ├── api/v1/                  # API REST sécurisée (parcelles, mutations, vérification, etc.)
    │   ├── carte/                   # Cartographie plein écran Leaflet/PostGIS
    │   ├── demo/telephone/          # Simulateur téléphone feature phone USSD & SMS
    │   ├── espace/                  # Espaces de travail par métier
    │   │   ├── agent/               # Conventions assistées au village
    │   │   ├── andf/                # Validation souveraine et délivrance de titres
    │   │   ├── banque/              # Inscription des garanties et hypothèques
    │   │   ├── citoyen/             # Consultation des biens et carnet de famille
    │   │   ├── commune/             # Urbanisme, bâtis et taxes sur plus-value
    │   │   ├── controleur/          # Contrôle topologique et audit de bornage
    │   │   ├── csaf/                # Contentieux foncier et gel conservatoire
    │   │   ├── ministere/           # Observatoire national foncier
    │   │   └── notaire/             # Actes notariés et verrou anti-double-vente
    │   ├── login/                   # Portail d'authentification souveraine avec quick-switch
    │   ├── verification/            # Page de vérification publique de parcelle
    │   │   └── actes/               # Coffre-fort numérique des actes et détecteur de fraude
    │   ├── layout.tsx               # Disposition racine, polices et métadonnées
    │   └── page.tsx                 # Landing page républicaine asymétrique
    ├── components/                  # Composants React modulaires
    │   ├── audio/                   # Lecteur vocal multilingue Fongbe / Yoruba / Français
    │   ├── auth/                    # Panneau de connexion multi-rôles
    │   ├── cadastre/                # Radar télémétrique et télémétrie cadastrale
    │   ├── carte/                   # Cartes Leaflet, styles officiels, inspecteur de polygone
    │   ├── dashboard/               # Tableaux de bord et statistiques
    │   ├── layout/                  # En-tête républicain, pied de page, barres de navigation
    │   ├── marketing/               # Vitrine institutionnelle
    │   ├── reactbits/               # Micro-animations typographiques et visuelles
    │   ├── simulators/              # Simulateurs modaux Mobile Money et télécoms
    │   ├── ui/                      # Composants d'interface shadcn/ui
    │   └── verification/            # Composants de recherche et restitution cadastrale
    ├── db/                          # Gestion de la base de données
    │   ├── index.ts                 # Connexion Drizzle ORM (PostgreSQL local / Neon)
    │   ├── migrate.ts               # Runner de migrations Drizzle
    │   ├── reset.ts                 # Script de remise à zéro et ré-exécution du seed
    │   ├── schema/index.ts          # Schémas Drizzle des 8 tables maîtresses
    │   └── seed/                    # Données de référence réalistes béninoises
    ├── lib/                         # Utilitaires transversaux
    │   ├── audio.ts                 # Dictionnaires et traductions audio multilingues
    │   ├── auth-context.tsx         # Contexte React d'authentification utilisateur
    │   ├── auth-session.ts          # Gestion sécurisée des sessions de connexion
    │   ├── channels.ts              # Moteurs de simulation des flux SMS, USSD et MoMo
    │   ├── geo.ts                   # Calculs géodésiques, surfaces et détection d'overlap
    │   ├── hash.ts                  # Hachage SHA-256 salé, scellement et intégrité
    │   ├── poles-benin.ts           # Référentiel des 6 Pôles Territoriaux et 77 communes
    │   └── utils.ts                 # Utilitaires de classes CSS et formatage FCFA
    └── repositories/                # Couche d'accès aux données persistées
        └── index.ts                 # Opérations CRUD et abstraction du registre
```

---

## 💻 7. Prérequis Système

Pour exécuter et développer sur **Anyigba (BENINLAND)**, assurez-vous de disposer des éléments suivants :

| Prérequis | Version Recommandée | Utilité |
|---|---|---|
| **Node.js** | `>= 20.x` (idéalement Node 22 LTS) | Moteur d'exécution JavaScript serveur |
| **pnpm** | `>= 9.x` (ou npm / yarn) | Gestionnaire de paquets ultra-rapide |
| **PostgreSQL** | `>= 16.x` avec **PostGIS 3.4** | Base de données relationnelle et spatiale |
| **Docker & Compose** | `>= 24.x` | Conteneurisation locale complète |
| **Git** | `>= 2.30` | Gestionnaire de versions |

---

## 🚀 8. Installation & Guide de Démarrage Pas-à-Pas

### Étape 1 : Cloner le Répertoire

```bash
git clone git@github.com:SAGBO4/BENINLAND.git
cd BENINLAND
```

### Étape 2 : Installer les Dépendances

```bash
pnpm install
```

### Étape 3 : Configurer les Variables d'Environnement

Créez un fichier `.env.local` à la racine en vous basant sur `.env.example` :

```bash
cp .env.example .env.local
```

Exemple de configuration standard :
```env
PORT=3000
NODE_ENV=development

# Base de Données (PostgreSQL local ou Neon Serverless)
DB_DRIVER=pg
DATABASE_URL=postgres://dev:dev@localhost:5432/anyigba
DATABASE_URL_UNPOOLED=postgres://dev:dev@localhost:5432/anyigba

# Sécurité & Empreintes Cryptographiques
AUTH_SECRET=anyigba_sovereign_secret_key_benin_2026
HASH_PEPPER=benin_anyigba_pepper_secret_salting_hash_2026

# Modes de Démonstration & Simulateurs
DEMO_MODE=true
SMS_MODE=simulate
USSD_MODE=simulate
PAYMENT_MODE=simulate

# API 229 Langues Nationales (Fongbe, Yoruba, Hausa)
API229_BASE_URL=https://ronaldodev-api.hf.space
API229_HF_TOKEN=your_huggingface_token
API229_API_KEY=your_api229_api_key
```

### Étape 4 : Lancer la Base de Données PostgreSQL

#### Option A : Via Docker Compose (Recommandé en local)
```bash
# Démarre PostgreSQL 16 avec initialisation automatique de la base
docker compose up -d db
```

#### Option B : Base de Données Cloud (Neon / Supabase)
Indiquez simplement votre chaîne de connexion `DATABASE_URL` dans `.env.local`.

### Étape 5 : Migrations et Injection des Données Initiales (Seed)

Initialisez la structure des tables et peuplez le registre avec les parcelles et acteurs de référence :

```bash
# Exécution du seed souverain (parcelles d'Ouidah, Calavi, Allada, Cotonou)
pnpm db:seed
```

Pour réinitialiser complètement la base à tout moment :
```bash
pnpm db:reset
```

### Étape 6 : Lancer le Serveur Web de Développement

```bash
pnpm dev
```

L'application est immédiatement accessible à l'adresse : **[http://localhost:3000](http://localhost:3000)**.

---

## 📜 9. Scripts Disponibles & Commandes NPM

| Commande | Action & Rôle |
|---|---|
| `pnpm dev` | Démarre l'application Next.js en mode développement sur le port `3000` |
| `pnpm build` | Compile l'application pour la production avec optimisations Next.js |
| `pnpm start` | Lance le serveur de production compilé |
| `pnpm desktop` | Lance l'application Desktop Electron en démarrant le serveur si nécessaire |
| `pnpm desktop:open` | Ouvre Electron directement sur l'instance locale en cours |
| `pnpm desktop:package` | Génère les binaires Desktop pour **Linux** (.AppImage, .tar.gz) et **Windows** (.exe, .zip) |
| `pnpm desktop:package:linux` | Génère exclusivement les paquets Linux |
| `pnpm desktop:package:win` | Génère exclusivement les paquets Windows |
| `pnpm test` | Exécute les 11 suites de tests avec **Vitest** (106 tests unitaires, d'intégration et pentest) |
| `pnpm typecheck` | Vérifie la conformité de l'ensemble du code TypeScript sans émettre de fichier |
| `pnpm db:generate` | Génère les migrations SQL Drizzle à partir des schémas TypeScript |
| `pnpm db:migrate` | Applique les migrations SQL en base de données |
| `pnpm db:seed` | Peuple la base de données avec le jeu de données souverain officiel 2026 |
| `pnpm db:reset` | Remet à zéro la base de données et ré-exécute le seed initial parfait |

---

## 🖥️ 10. Application Desktop Souveraine (Electron)

Pour les agents fonciers en préfecture, les notaires ou les postes isolés en mairie, **BENINLAND** dispose d'un client lourd Desktop multi-plateforme autonome :

### Caractéristiques du Client Desktop
- **Détection Automatique de Connectivité** :
  - Sonde l'environnement local (`http://localhost:3000`).
  - Si aucun serveur local ne répond, bascule de manière transparente et sécurisée sur l'instance cloud souveraine (**`https://beninland.vercel.app`**).
- **Intégration OS & Raccourcis Clavier Métiers** :
  - `Ctrl+N` / `Cmd+N` : Ouvrir directement une nouvelle vérification de parcelle.
  - `Ctrl+M` / `Cmd+M` : Basculer en mode Carte Cadastrale plein écran.
  - Impression directe des attestations cadastrales certifiées via le spooler d'impression système.
  - Protection contre les redirections web externes non autorisées.

### Démarrage en Mode Développement Desktop
```bash
pnpm desktop
```

### Binaires Pré-Compilés Disponibles
Les binaires distribuables sont situés dans le dossier [`desktop/`](file:///home/lesaint/Rendue/BENINLAND/desktop) :
- **Linux** : `desktop/BENINLAND-1.0.0.AppImage` (Exécutable direct sans installation : `chmod +x` puis lancer)
- **Windows** : `desktop/BENINLAND 1.0.0.exe` (Exécutable portable autonome x64)
- **Windows Archive** : `desktop/BENINLAND-1.0.0-win.zip`

Pour régénérer les binaires à partir des sources :
```bash
pnpm desktop:package
```

---

## 🧪 11. Assurance Qualité, Tests & Audit Adversarial

Le projet met en œuvre une politique d'assurance qualité rigoureuse garantissant l'intégrité du cadastre face à des attaques malveillantes ou des défaillances réseau.

```bash
pnpm test
```

### Rapport de Validation des 11 Suites de Tests (106 tests réussis) :
```text
✓ tests/core-logic.test.ts (7 tests)
  - Calcul des superficies, taxe de plus-value communale, formats des codes NPI/NUP.
✓ tests/security-crypto-audio.test.ts (11 tests)
  - Scellement SHA-256 avec salage HASH_PEPPER, détection d'altération de documents, phonétique audio.
✓ tests/leaflet-and-gis.test.ts (16 tests)
  - Validation des coordonnées géographiques, calculs de distance, détection d'empiètement topologique.
✓ tests/beninvie-portal-and-components.test.ts (11 tests)
  - Composants UI républicains, formats de devises FCFA, accessibilité WCAG.
✓ tests/api-auxiliary.test.ts (16 tests)
  - Passerelle SMS, endpoints USSD, génération de voix de synthèse en langues nationales.
✓ tests/frontend-unified.test.ts (8 tests)
  - Navigation multi-rôles, redirection contextuelle par espace de travail.
✓ tests/system-hardening-adversarial.test.ts (16 tests)
  - Résistance aux attaques IDOR, isolation stricte des sessions notaires et magistrats.
✓ tests/api-verification.test.ts (5 tests)
  - Exactitude de l'API de vérification publique, masquage conforme APDP.
✓ tests/api-mutations.test.ts (7 tests)
  - Verrou anti-double-vente, rejet 409 sur tentative concurrente, déblocage séquestre.
✓ tests/api-demo-reset.test.ts (1 test)
  - Restauration déterministe atomique de la base.
✓ tests/adversarial-pentest-qa.test.ts (8 tests)
  - Protection contre les injections SQL, fausses coordonnées hors-frontières, bypass de séquestre.
```

---

## 🚢 12. Déploiement & Conteneurisation

### Déploiement via Docker Compose

Pour déployer l'intégralité de la pile (Next.js Standalone + PostgreSQL 16 PostGIS) sur un serveur souverain ou une machine virtuelle :

```bash
# Lancement de l'ensemble des conteneurs en tâche de fond
docker compose up -d --build

# Suivre les journaux d'exécution
docker compose logs -f app
```

Le service web est exposé sur le port `3000`, avec redémarrage automatique en cas d'incident et sonde de santé (`healthcheck`) sur la base PostgreSQL.

### Déploiement sur le Cloud Vercel

Le projet est nativement configuré pour un déploiement continu sur **Vercel** :
- Le fichier `vercel.json` est prêt pour la production.
- La base PostgreSQL distante peut être hébergée sur **Neon Serverless Postgres** (avec prise en charge du pooling de connexions).
- Ajoutez les variables d'environnement listées dans `.env.example` dans le tableau de bord Vercel.

---

## ⚖️ 13. Conformité Légale & Protection des Données

Anyigba est conçu en stricte conformité avec le cadre légal et institutionnel béninois :

1. **Loi N° 2013-01 portant Code Foncier et Domanial en République du Bénin** (modifiée et complétée par la loi N° 2017-15) :
   - Respect de la procédure d'immatriculation et de confirmation des droits fonciers.
   - Primauté du Titre Foncier (TF) inattaquable et opposable aux tiers.
   - Enregistrement des droits coutumiers et préservation des droits d'usage collectifs ruraux.
2. **Autorité de Protection des Données Personnelles (APDP)** :
   - Masquage systématique des noms et téléphones des propriétaires sur les flux de consultation publique.
   - Séparation stricte des données d'identité réelles et des identifiants cryptographiques publics.
3. **Chambre Spéciale des Affaires Foncières (CSAF)** :
   - Interface directe de gel conservatoire judiciaire permettant la protection instantanée d'une parcelle litigieuse dès la saisine du tribunal.

---

## 🤝 14. Équipe, Gouvernance & Support

- **Maîtrise d'Ouvrage Institutionnelle** : Agence Nationale du Domaine et du Foncier (ANDF) / Ministère du Cadre de Vie et des Transports.
- **Référence du Dépôt** : [`git@github.com:SAGBO4/BENINLAND.git`](https://github.com/SAGBO4/BENINLAND)
- **Documentation Complémentaire** :
  - [Cahier des Charges & Source de Vérité](docs/CDC_SOURCE_DE_VERITE.md)
  - [Feuille de Route d'Implémentation](docs/ROADMAP_IMPLEMENTATION.md)
  - [Présentation Interactive Multimédia](docs/presentation-anyigba.html)
  - [Dossier Exécutif Imprimable (PDF)](docs/ANYIGBA_DOSSIER_DE_PRESENTATION.pdf)

---

<p align="center">
  <em>ANYIGBA (BENINLAND) — « La Terre Sécurisée, la Nation Prospère. »</em><br>
  <strong>Fait avec rigueur républicaine &bull; République du Bénin &bull; 2026</strong>
</p>
