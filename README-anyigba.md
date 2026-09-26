# 🌍 Anyigba — Plateforme de gestion et de sécurisation du foncier au Bénin

> **Anyigba** (« la terre ») rend l'information foncière **visible, vérifiable et infalsifiable** : qui détient quelle parcelle, avec quel droit, quels litiges, quelles transactions.
> Objectif : mettre fin aux ventes multiples d'un même terrain, accélérer la délivrance des titres et sécuriser les successions.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green) ![PostGIS](https://img.shields.io/badge/PostGIS-3.4-blue) ![Docker](https://img.shields.io/badge/Docker-ready-2496ED) ![Vercel](https://img.shields.io/badge/deploy-Vercel-black)

---

## 🛑 Règle n°1 : la démo ne doit jamais planter

Phase actuelle = **présentation**. L'application tourne sur **Vercel**, branchée à **PostgreSQL + PostGIS sur Neon**, avec des **données fictives uniquement**. Les services externes (SMS, USSD, Mobile Money, blockchain) sont **simulés par défaut** mais leurs effets sont **réellement enregistrés en base**. Aucune donnée réelle de propriétaire ou de parcelle ne transite par cette version.

---

## Sommaire

1. [Le problème](#1-le-problème)
2. [La solution](#2-la-solution)
3. [Acteurs et rôles](#3-acteurs-et-rôles)
4. [Fonctionnalités](#4-fonctionnalités)
5. [Scénario de démo](#5-scénario-de-démo)
6. [La couche blockchain](#6-la-couche-blockchain)
7. [Stack technique](#7-stack-technique)
8. [Structure du projet](#8-structure-du-projet)
9. [Démarrage rapide (Docker)](#9-démarrage-rapide-docker)
10. [Base de données Neon, migrations et seed](#10-base-de-données-neon-migrations-et-seed)
11. [Variables d'environnement](#11-variables-denvironnement)
12. [API](#12-api)
13. [Déploiement Vercel](#13-déploiement-vercel)
14. [Accessibilité et inclusion](#14-accessibilité-et-inclusion)
15. [Sécurité](#15-sécurité)
16. [Feuille de route](#16-feuille-de-route)
17. [Contribuer](#17-contribuer)

---

## 1. Le problème

- La plupart des ventes en zone rurale et périurbaine se font par une simple **convention de vente sur papier**, souvent sans plan, sans bornes, sans témoins fiables.
- Résultat : **même terrain vendu à plusieurs acheteurs**, limites contestées, faux documents, conflits familiaux sur les héritages.
- Coexistence de plusieurs statuts difficiles à vérifier : **titre foncier**, **certificat de propriété foncière (CPF)**, **droits coutumiers**, simples conventions, et beaucoup de terres sans aucun document.
- Délais longs pour obtenir un titre, et impossibilité pour un acheteur de vérifier rapidement une parcelle avant de payer.

## 2. La solution

Une plateforme qui répond à tous les usages du foncier :
- **Visualiser** : une carte des parcelles avec leur statut.
- **Vérifier** : en 30 secondes, par le web ou par SMS, savoir si une parcelle existe, sous quel droit, et si elle est en litige ou en cours de vente.
- **Fiabiliser** : enregistrement terrain avec validation des voisins, verrou anti-double-vente, actes scellés par empreinte numérique ancrée sur blockchain.
- **Gérer** : cessions, délivrance des titres, successions, identification des bâtis, cartographie des zones agricoles.

**Principe clé** : *on ne met pas la terre sur la blockchain, on met la preuve.* Et on rend la double vente techniquement impossible.

## 3. Acteurs et rôles

| Rôle | Ce qu'il fait dans Anyigba |
|---|---|
| `citoyen` | Consulte ses parcelles, vérifie un terrain avant achat, reçoit une alerte si quelqu'un tente de vendre sa parcelle |
| `acheteur` | Vérifie le statut d'une parcelle (web, SMS « VERIF ») |
| `agent_foncier` | Convention de vente assistée sur le terrain, levés GPS, recueil des témoignages |
| `geometre` | Levés, bornage, dépôt des plans |
| `notaire` | Actes de vente, successions, validation des mutations |
| `andf` | Instruction, validation, délivrance des titres et certificats |
| `commune` | Lotissements, bâtis, fiscalité foncière, plus-value |
| `juge_csaf` | Litiges, gel de parcelles, publication des décisions |
| `chef_village` | Confirmation des droits coutumiers, médiation |
| `banque` | Vérification d'un titre, enregistrement d'une garantie |
| `admin` | Référentiels, utilisateurs, paramétrage |

## 4. Fonctionnalités

### Cœur (minimum démontrable de bout en bout)
| Module | Description |
|---|---|
| **Carte foncière** | Parcelles PostGIS colorées par statut : 🟢 titre foncier · 🔵 CPF · 🟡 coutumier déclaré · 🔴 en litige · 🔒 mutation en cours · ⚪ non renseigné. Couches : zones agricoles, bâtis, domaine public |
| **Vérification publique** | Par code parcelle, clic sur la carte, ou SMS/USSD simulé `VERIF <code>` → statut, type de droit, litige, mutation en cours (identité du détenteur partiellement masquée) |
| **Registre des droits** | Détenteurs, type de droit, quote-parts (indivision), baux, hypothèques, historique complet des mutations |
| **Mutation avec verrou anti-double-vente** | Intention de vente → parcelle 🔒 → détenteur alerté → notaire → ANDF → nouveau détenteur. Toute seconde tentative de vente est bloquée |
| **Coffre-fort des actes** | Titres, plans, actes notariés stockés avec leur empreinte SHA-256 : toute modification est détectée |
| **Gestion de contenu** | Parcelles, propriétaires, documents, types de droits, zones |

### Modules avancés
| Module | Description |
|---|---|
| **Enregistrement et validation communautaire** | Tracé GPS en marchant sur les limites, photos des bornes, **validation des voisins** par appel vocal simulé (« 1 = je confirme la limite, 2 = je conteste ») |
| **⭐ Convention de vente assistée au village** | L'agent foncier formalise sur place une vente : tracé, bornes, NPI des parties, **témoignages vocaux** des témoins et du chef de village, consentement familial, paiement en séquestre Mobile Money. Contrôle automatique de chevauchement avant validation |
| **Cartographie par drone communal** | Import d'orthophotos, tracé des limites sur l'image, validation par les voisins |
| **Carnet de famille foncier** | La famille déclare de son vivant la transmission de ses terres ; les héritiers consentent par NPI ; versions scellées |
| **Successions** | Décès → identification des successibles → carnet familial → accord ou médiation → partage |
| **Litiges** | Ouverture, gel de la parcelle, médiation traditionnelle, CSAF, publication de la décision |
| **Bâtis, urbanisme, fiscalité** | Identification des constructions, taxe foncière, calcul de la **plus-value** reversée à la commune |
| **Observatoire des prix** | Prix des transactions (fictifs) par zone, pour acheteurs, banques et communes |
| **Tableau de bord** | Délais de traitement, litiges par zone, conventions assistées, tentatives de double vente bloquées |

## 5. Scénario de démo

> Persona : **la famille Dossou, Ouidah**, propriétaire d'une parcelle coutumière familiale.

1. **Vérification** : un acheteur envoie `VERIF OUI-0421` dans le faux téléphone → « Parcelle coutumière déclarée, pas de litige, pas de vente en cours ».
2. **Convention assistée** : l'agent foncier ouvre la parcelle, enregistre les bornes, les témoignages vocaux et le consentement des deux frères.
3. **Verrou** : la vente démarre, la parcelle passe en 🔒 sur la carte, le propriétaire actuel reçoit un SMS simulé.
4. **Tentative de double vente** : un second acheteur tente la même parcelle → ❌ **« Parcelle verrouillée, mutation en cours »**.
5. **Falsification** : on modifie un acte dans le coffre-fort → ❌ **« Empreinte différente de la preuve enregistrée »**.
6. **Finalisation** : notaire puis ANDF valident, le nouveau détenteur apparaît, l'historique est conservé, la plus-value communale est calculée.

Bouton **« Réinitialiser la démo »** dans l'admin : remet la base dans son état de départ (voir section 10).

## 6. La couche blockchain

**Principe** : le registre officiel reste dans PostgreSQL. La blockchain garde la **preuve** de chaque état validé.

```
Registre PostgreSQL (données complètes)
      │  empreinte SHA-256 salée de chaque parcelle / acte / mutation validés
      ▼
Contrat « RegistreFoncier » (BéninChain) : 1 parcelle validée = 1 token « titre miroir »
      │  racine de Merkle périodique
      ▼
Bitcoin via OpenTimestamps : preuve publique vérifiable par tous
```

- **Aucune donnée personnelle** sur la chaîne, seulement des empreintes.
- Le token n'est **pas librement transférable** : seule une mutation validée par `notaire` + `andf` le déplace.
- Fonctions du contrat : `mint` (ANDF), `demarrerMutation` (verrou), `finaliserMutation` (double signature), `ouvrirLitige`, `geler` (CSAF), `succession` (quote-parts).
- Phase présentation : **empreintes calculées pour de vrai et stockées en base**, inscription sur la chaîne simulée par défaut. Ancrage réel activable (`CHAIN_MODE=testnet`, `OTS_MODE=live`).
- Limite assumée : la blockchain garantit que la donnée **n'a pas été modifiée**, pas qu'elle est **vraie** ; d'où les validations humaines (géomètre, voisins, ANDF) avant inscription.

## 7. Stack technique

| Couche | Technologies |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| UI | Tailwind CSS v4, shadcn/ui, Leaflet + OpenStreetMap |
| État client | Zustand, TanStack Query |
| API | Route Handlers `/api/v1/`, validation Zod, contrôle des rôles côté serveur (protection IDOR) |
| Base de données | PostgreSQL + **PostGIS** sur **Neon** |
| ORM / migrations | Drizzle ORM, drizzle-kit |
| Hors ligne | PWA (Serwist + IndexedDB) pour les agents terrain |
| Blockchain | Solidity + OpenZeppelin (Foundry), viem, javascript-opentimestamps |
| Tests | Vitest (unitaires, intégration), Playwright (parcours de démo) |
| Qualité | ESLint, Prettier, Husky, lint-staged |
| Conteneurs | Docker, Docker Compose |
| Hébergement | Vercel (app) + Neon (base) |

## 8. Structure du projet

```
anyigba/
├── src/
│   ├── app/
│   │   ├── (public)/               carte, vérification, accueil
│   │   ├── (espace)/               espaces par rôle : notaire, andf, agent, commune, csaf
│   │   ├── demo/telephone/         faux téléphone USSD / SMS
│   │   └── api/v1/                 parcelles, verification, mutations, conventions,
│   │                               litiges, successions, documents, ussd, sms
│   ├── domains/                    logique métier découplée
│   │   ├── parcelles/  mutations/  conventions/  litiges/
│   │   ├── successions/  documents/  plus-value/  blockchain/
│   ├── repositories/               seul point d'accès aux données
│   ├── components/                 par domaine (carte, parcelle, admin, verify…)
│   └── lib/                        auth, zod, geo, hash, channels (sms, ussd, voix simulés)
├── db/
│   ├── schema/                     schémas Drizzle
│   ├── migrations/                 migrations SQL versionnées
│   └── seed/                       données fictives (référentiels + personas)
├── contracts/                      RegistreFoncier.sol + tests Foundry
├── docker/
│   ├── Dockerfile                  image multi-étapes, Next.js standalone
│   └── init.sql                    création de la base + extension PostGIS
├── docker-compose.yml
├── drizzle.config.ts
├── .env.example
└── README.md
```

## 9. Démarrage rapide (Docker)

**Prérequis** : Docker et Docker Compose. Rien d'autre.

```bash
git clone <url-du-depot> anyigba && cd anyigba
cp .env.example .env
docker compose up --build
```

Ce qui se passe :
1. PostgreSQL 16 + PostGIS démarre (`db`).
2. Les migrations s'appliquent et les données fictives sont injectées (`migrate-seed`).
3. L'application démarre sur **http://localhost:3000**.

Comptes de démo créés par le seed (mot de passe commun : `demo2026`) :
`notaire@demo.bj` · `andf@demo.bj` · `agent@demo.bj` · `commune@demo.bj` · `csaf@demo.bj` · `admin@demo.bj`

**Sans Docker** (Node 22 + pnpm + un PostgreSQL avec PostGIS) :
```bash
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev
```

<details>
<summary>docker-compose.yml</summary>

```yaml
services:
  db:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: anyigba
    ports: ["5432:5432"]
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "dev"]
      interval: 5s
      retries: 10

  migrate-seed:
    build: { context: ., dockerfile: docker/Dockerfile, target: deps }
    command: sh -c "pnpm db:migrate && pnpm db:seed"
    environment:
      DB_DRIVER: pg
      DATABASE_URL_UNPOOLED: postgres://dev:dev@db:5432/anyigba
      DATABASE_URL: postgres://dev:dev@db:5432/anyigba
    depends_on:
      db: { condition: service_healthy }

  app:
    build: { context: ., dockerfile: docker/Dockerfile }
    env_file: .env
    environment:
      DB_DRIVER: pg
      DATABASE_URL: postgres://dev:dev@db:5432/anyigba
    ports: ["3000:3000"]
    depends_on:
      migrate-seed: { condition: service_completed_successfully }

volumes:
  pgdata: {}
```
</details>

<details>
<summary>docker/Dockerfile</summary>

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

FROM deps AS build
RUN pnpm build            # next.config: output: "standalone"

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
```
</details>

## 10. Base de données Neon, migrations et seed

### Créer la base sur Neon
1. Console Neon → **New project** `anyigba`, région la plus proche de la région Vercel utilisée.
2. Récupérer les deux chaînes de connexion :
   - `DATABASE_URL` → **poolée** (utilisée par l'application sur Vercel) ;
   - `DATABASE_URL_UNPOOLED` → **directe** (migrations uniquement).
3. La première migration active PostGIS : `CREATE EXTENSION IF NOT EXISTS postgis;`
4. Relier Neon au projet Vercel via l'intégration officielle.

### Branches Neon
| Branche | Rôle |
|---|---|
| `seed` | État de référence (schéma + données fictives). Jamais modifiée pendant une démo |
| `main` | Base de la démo en production, créée depuis `seed` |
| `preview/*` | Une branche par *preview deployment* Vercel |

**Réinitialiser la démo** = remettre `main` à l'état de `seed` (*Reset from parent* dans la console Neon, ou via l'API Neon depuis le bouton admin).

### Commandes
| Commande | Effet |
|---|---|
| `pnpm db:generate` | Génère une migration SQL depuis les schémas Drizzle |
| `pnpm db:migrate` | Applique les migrations (connexion directe) |
| `pnpm db:seed` | Vide puis remplit la base avec les données fictives (idempotent) |
| `pnpm db:reset` | Migrate + seed depuis zéro (local) |
| `pnpm db:studio` | Explorateur de données Drizzle Studio |

### Règles
- **Migrations en CI uniquement** (GitHub Actions), jamais pendant le build Vercel, jamais de modification manuelle du schéma dans la console.
- **Seed déterministe** (`faker.seed(2026)`) : mêmes données à chaque exécution.
- **Tout est marqué fictif** : NPI `FICTIF-…`, numéros de téléphone réservés, codes parcelles de démo.
- **Données** : vraies communes (Ouidah, Abomey-Calavi, Allada, Kpomassè…), parcelles dessinées sur la vraie carte, quelques milliers de parcelles, des mutations, des litiges et des conventions pour rendre les tableaux de bord crédibles.

### Modèle de données (principal)
```
parcelle(id, code_unique, geom POLYGON, superficie, commune, usage, statut_juridique, statut_litige, verrou)
detenteur(id, npi, nom, telephone, langue)
droit(id, parcelle_id, detenteur_id, type[TF|CPF|coutumier|bail|hypotheque], quote_part, debut, fin)
mutation(id, parcelle_id, cedant_id, cessionnaire_id, statut, notaire_id, valide_andf_le, prix)
convention_assistee(id, parcelle_id, agent_id, temoignages_audio[], consentements[], sequestre_statut)
document(id, parcelle_id, type, url, sha256, sel, date_depot)
validation_voisin(parcelle_id, voisin_id, reponse, date)
litige(id, parcelle_id, parties[], statut, juridiction, decision_url)
succession(id, defunt_npi, parcelles[], successibles[], statut)
carnet_familial(id, famille_ref, version, repartition jsonb, consentements[])
bati(id, parcelle_id, geom, usage, date_constat)
preuve_chain(id, objet_type, objet_id, hash, tx_ref, ots_proof, statut)
```

## 11. Variables d'environnement

| Variable | Exemple | Rôle |
|---|---|---|
| `DATABASE_URL` | `postgres://…-pooler…neon.tech/anyigba` | Connexion poolée (app) |
| `DATABASE_URL_UNPOOLED` | `postgres://…neon.tech/anyigba` | Connexion directe (migrations) |
| `DB_DRIVER` | `neon` \| `pg` | `neon` sur Vercel, `pg` en local Docker |
| `AUTH_SECRET` | chaîne aléatoire | Sessions |
| `DEMO_MODE` | `true` | Active le faux téléphone et le bouton de réinitialisation |
| `SMS_MODE` / `USSD_MODE` / `PAYMENT_MODE` | `simulate` | `simulate` ou `live` |
| `CHAIN_MODE` | `simulate` | `simulate` \| `testnet` |
| `OTS_MODE` | `simulate` | `simulate` \| `live` (OpenTimestamps) |
| `NEON_API_KEY` / `NEON_PROJECT_ID` | — | Réinitialisation de la branche de démo |
| `HASH_PEPPER` | chaîne aléatoire | Secret additionnel des empreintes |

## 12. API

Toutes les routes sont versionnées sous `/api/v1/`, validées par Zod, et vérifient le rôle côté serveur.

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| `GET` | `/parcelles?bbox=…` | public | Parcelles dans une zone (GeoJSON) |
| `GET` | `/verification/:code` | public | Statut public d'une parcelle |
| `POST` | `/parcelles` | agent_foncier, geometre | Enregistrement d'une parcelle |
| `POST` | `/parcelles/:id/validations-voisins` | agent_foncier | Lance la validation par les voisins |
| `POST` | `/mutations` | notaire | Démarre une mutation (pose le verrou) |
| `POST` | `/mutations/:id/finaliser` | notaire + andf | Finalise la mutation |
| `POST` | `/conventions` | agent_foncier | Convention de vente assistée |
| `POST` | `/litiges` | juge_csaf, andf | Ouvre un litige et gèle la parcelle |
| `POST` | `/successions` | notaire | Ouvre une succession |
| `POST` | `/documents` | notaire, andf | Dépôt d'un acte (calcul d'empreinte) |
| `GET` | `/documents/:id/verifier` | public | Compare l'empreinte à la preuve |
| `POST` | `/ussd` · `/sms` | opérateur / simulateur | Menus USSD et commande `VERIF` |
| `POST` | `/demo/reset` | admin | Réinitialise la branche de démo |

## 13. Déploiement Vercel

1. Importer le dépôt dans Vercel (framework détecté : Next.js).
2. Installer l'intégration **Neon** : variables `DATABASE_URL` / `DATABASE_URL_UNPOOLED` injectées, branche Neon créée pour chaque preview.
3. Ajouter les autres variables (section 11) en `Production` et `Preview`.
4. Migrations exécutées par GitHub Actions **avant** le déploiement :
   ```yaml
   - run: pnpm db:migrate
     env: { DATABASE_URL_UNPOOLED: ${{ secrets.NEON_MAIN_UNPOOLED }} }
   ```
5. La démo tourne sur la **production figée** (version notée) ; le travail en cours reste sur les previews. Rollback en un clic si besoin.
6. Pour une présentation à un client ou une institution : **plan Vercel Pro** (le plan Hobby est non commercial).

### Checklist avant chaque démo
- [ ] Base réinitialisée depuis `seed`
- [ ] Parcours de démo joué une fois en entier
- [ ] Testé sur téléphone moyen en 3G
- [ ] PWA agent testée réseau coupé
- [ ] Vidéo de secours prête

## 14. Accessibilité et inclusion

- Conformité visée **WCAG 2.1 AA** : navigation clavier, lecteurs d'écran, contrastes ≥ 4.5:1, taille de texte réglable.
- **Lecture audio** de chaque statut de parcelle et de chaque acte, en français et en langues nationales (fon, yoruba, goun, adja, bariba, dendi).
- **Aucune information uniquement sonore** : sous-titres, alertes visuelles.
- **Statuts doublés** : couleur + icône + texte (daltonisme).
- **Canaux sans smartphone** : SMS `VERIF`, menus USSD, validation des voisins par appel vocal.
- **Mode assisté** : l'agent foncier agit pour le compte d'une personne, avec son consentement tracé.

## 15. Sécurité

- Contrôle d'accès par rôle vérifié **côté serveur** sur chaque route ; aucune confiance dans l'identifiant envoyé par le client.
- Identité des détenteurs **partiellement masquée** sur la vérification publique.
- Empreintes **salées** (sel stocké hors chaîne) + `HASH_PEPPER`.
- Journal d'audit de toutes les actions sensibles (verrou, mutation, gel, dépôt d'acte).
- Limitation du nombre de requêtes sur les routes publiques (`/verification`, `/sms`, `/ussd`).
- Aucune donnée réelle en phase de présentation.

## 16. Feuille de route

| Étape | Contenu |
|---|---|
| ✅ Présentation | Carte, vérification, verrou, coffre-fort, convention assistée, données fictives, Vercel + Neon + Docker |
| Pilote | Une commune urbaine + une commune rurale, agents fonciers formés, ancrage OpenTimestamps réel |
| Institutionnel | Intégration ANDF, notaires, CSAF ; nœud BéninChain chez l'ANDF ; SMS/USSD opérateurs réels |
| National | Toutes les communes, drone communal, carnet familial, reconnaissance juridique de la preuve blockchain, hébergement au Bénin (mêmes images Docker) |

## 17. Contribuer

```bash
git checkout -b feat/ma-fonctionnalite
pnpm lint && pnpm test && pnpm test:e2e
```
- Une migration par changement de schéma (`pnpm db:generate`), commitée avec le code.
- Toute nouvelle donnée fictive passe par le seed, jamais par la console.
- Commits conventionnels (`feat:`, `fix:`, `chore:`…).
- Toute modification du contrat Solidity s'accompagne de ses tests Foundry.

---

*Inspirations : cadastre et publicité foncière (France), chaîne des titres (États-Unis), ancrage des titres sur Bitcoin (Géorgie), régularisation foncière massive (Rwanda), prise en compte des droits coutumiers (FAO).*
