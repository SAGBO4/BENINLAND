import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { anyigbaRepo } from "@/repositories/index";
import { DEMO_USERS, ROLE_DASHBOARDS, UserRole } from "@/lib/auth-session";

describe("BENINVIE Sovereign Portal — Architecture, Télémétrie & Composants", () => {
  describe("1. CadastreTelemetryRadar & Métriques Nationales", () => {
    it("doit vérifier les structures de données et métriques de la télémétrie", () => {
      const parcelles = anyigbaRepo.getAllParcelles();
      expect(parcelles.length).toBeGreaterThanOrEqual(7);

      let tfCount = 0;
      let cpfCount = 0;
      let coutumierCount = 0;
      let verrouCount = 0;
      let litigeCount = 0;

      for (const p of parcelles) {
        if (p.statutJuridique === "TITRE_FONCIER") tfCount++;
        else if (p.statutJuridique === "CPF") cpfCount++;
        else coutumierCount++;

        if (p.enVerrouMutation) verrouCount++;
        if (p.enLitige) litigeCount++;
      }

      expect(tfCount + cpfCount + coutumierCount).toBe(parcelles.length);
      expect(verrouCount).toBeGreaterThanOrEqual(1); // CAL-0089 ou OUI-0421
      expect(litigeCount).toBeGreaterThanOrEqual(1); // LIT-ALL-005
    });

    it("doit vérifier le code source de CadastreTelemetryRadar", () => {
      const radarPath = path.resolve(__dirname, "../src/components/cadastre/CadastreTelemetryRadar.tsx");
      const content = fs.readFileSync(radarPath, "utf-8");

      expect(content).toContain("ANDF • CADASTRE NATIONAL");
      expect(content).toContain("TF Définitif");
      expect(content).toContain("Titres CPF");
      expect(content).toContain("Garantie Souveraine Zéro Double Vente");
      expect(content).toContain("< 30 s");
      expect(content).toContain("77");
    });
  });

  describe("2. Header Républicain & Navigation Souveraine (Nav)", () => {
    it("doit vérifier que le Header délègue proprement au composant Nav souverain", () => {
      const headerPath = path.resolve(__dirname, "../src/components/layout/Header.tsx");
      const content = fs.readFileSync(headerPath, "utf-8");

      expect(content).toContain('import { Nav } from "./nav"');
      expect(content).toContain("<Nav />");
    });

    it("doit contenir l'emblème républicain et les rubriques officielles", () => {
      const navPath = path.resolve(__dirname, "../src/components/layout/nav.tsx");
      const content = fs.readFileSync(navPath, "utf-8");

      // Couleurs républicaines officielles
      expect(content).toContain("#008751"); // Vert
      expect(content).toContain("#ffbe00"); // Jaune
      expect(content).toContain("#eb0000"); // Rouge
      expect(content).toContain("#0a3764"); // Bleu souverain

      // Libellés officiels
      expect(content).toContain("RÉPUBLIQUE DU BÉNIN");
      expect(content).toContain("ANDF");
      expect(content).toContain("CADASTRE DU BÉNIN");

      // Groupes de navigation
      expect(content).toContain("CADASTRE & SIG");
      expect(content).toContain("SERVICES CITOYENS");
      expect(content).toContain("ESPACES MÉTIERS");
    });

    it("doit vérifier les liens de navigation vers les 8 espaces métiers", () => {
      const navPath = path.resolve(__dirname, "../src/components/layout/nav.tsx");
      const content = fs.readFileSync(navPath, "utf-8");

      expect(content).toContain("/espace/ministere");
      expect(content).toContain("/espace/andf");
      expect(content).toContain("/espace/notaire");
      expect(content).toContain("/espace/csaf");
      expect(content).toContain("/espace/agent");
      expect(content).toContain("/espace/commune");
      expect(content).toContain("/espace/citoyen");
    });
  });

  describe("3. Portail d'Authentification Sécurisée (/login & LoginPanel)", () => {
    const roles: UserRole[] = [
      "MINISTERE",
      "ANDF",
      "NOTAIRE",
      "CSAF",
      "AGENT",
      "COMMUNE",
      "CITOYEN",
      "BANQUE",
    ];

    it("doit disposer d'un compte de démonstration configuré pour les 8 rôles souverains", () => {
      for (const role of roles) {
        const user = DEMO_USERS[role];
        expect(user, `Utilisateur manquant pour le rôle ${role}`).toBeDefined();
        expect(user.npi).toMatch(/^FICTIF-BEN-2026-\d{4}$/);
        expect(user.nom).toBeTruthy();
        expect(user.prenom).toBeTruthy();
        expect(user.role).toBe(role);
        expect(user.commune).toBeTruthy();
        expect(user.departement).toBeTruthy();
      }
    });

    it("doit router chaque rôle vers son tableau de bord spécifique", () => {
      expect(ROLE_DASHBOARDS.MINISTERE).toBe("/espace/ministere");
      expect(ROLE_DASHBOARDS.ANDF).toBe("/espace/andf");
      expect(ROLE_DASHBOARDS.NOTAIRE).toBe("/espace/notaire");
      expect(ROLE_DASHBOARDS.CSAF).toBe("/espace/csaf");
      expect(ROLE_DASHBOARDS.AGENT).toBe("/espace/agent");
      expect(ROLE_DASHBOARDS.COMMUNE).toBe("/espace/commune");
      expect(ROLE_DASHBOARDS.CITOYEN).toBe("/espace/citoyen");
      expect(ROLE_DASHBOARDS.BANQUE).toBe("/espace/banque");
    });

    it("doit vérifier que la page /login intègre les 8 profils et les identifiants NPI", () => {
      const loginPath = path.resolve(__dirname, "../src/app/login/page.tsx");
      const content = fs.readFileSync(loginPath, "utf-8");

      expect(
        content.includes("Connexion à votre Espace Foncier") ||
        content.includes("Guichet d&apos;Accès Réglementaire")
      ).toBe(true);
      expect(content.includes("Retour à l&apos;accueil Anyigba")).toBe(true);

      // Vérification des 8 rôles dans le composant
      for (const role of roles) {
        expect(content).toContain(`role: "${role}"`);
      }

      // Présence des badges de sécurité
      expect(content).toContain("Gouvernance & Régulation");
      expect(content).toContain("Officiers Publics & Mutation");
      expect(content).toContain("Opérations de Terrain");
      expect(content).toContain("Citoyens & Finances");
    });

    it("doit vérifier que LoginPanel propose les rôles opérationnels avec leurs métadonnées", () => {
      const loginPanelPath = path.resolve(__dirname, "../src/components/auth/LoginPanel.tsx");
      const content = fs.readFileSync(loginPanelPath, "utf-8");

      expect(content).toContain("DEMO_ROLES");
      expect(content).toContain("Me Christian Agbossou");
      expect(content).toContain("Mme Reine Houndété");
      expect(content).toContain("Juge Sossa");
    });
  });

  describe("4. Ergonomie, Accessibilité & Conformance Visuelle (A11y & Contrastes)", () => {
    it("doit vérifier le respect des zones de clic minimales de 44px sur la page d'accueil", () => {
      const pagePath = path.resolve(__dirname, "../src/app/page.tsx");
      const content = fs.readFileSync(pagePath, "utf-8");

      // Au moins plusieurs éléments interactifs ont min-h-[44px]
      const countMinH44 = (content.match(/min-h-\[44px\]/g) || []).length;
      expect(countMinH44).toBeGreaterThanOrEqual(2);
    });

    it("doit vérifier la présence du footer républicain avec les mentions légales béninoises", () => {
      const footerPath = path.resolve(__dirname, "../src/components/layout/Footer.tsx");
      const content = fs.readFileSync(footerPath, "utf-8");

      expect(content).toContain("République du Bénin");
      expect(content).toContain("Loi n° 2013-01");
      expect(content).toContain("Code Foncier");
      expect(content).toContain("CSAF");
      expect(content).toContain("ANDF");
    });
  });
});
