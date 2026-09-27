import { describe, it, expect } from "vitest";
import { POST as registerRoute } from "@/app/api/v1/auth/register/route";
import { POST as loginRoute } from "@/app/api/v1/auth/login/route";

describe("Authentification Déployable : Base de Données & APIs (/api/v1/auth)", () => {
  it("doit refuser l'inscription si les champs obligatoires manquent", async () => {
    const req = new Request("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        npi: "ANIP-TEST-0001",
        // nom manquant
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("doit refuser un mot de passe trop court (< 6 caractères)", async () => {
    const req = new Request("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        npi: "ANIP-TEST-SHORT",
        nom: "DOSSOU",
        prenom: "Alain",
        password: "123",
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("au moins 6 caractères");
  });

  it("doit inscrire un citoyen et valider immédiatement son compte", async () => {
    const testNpi = `ANIP-CITOYEN-${Date.now()}`;
    const req = new Request("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        npi: testNpi,
        nom: "HOUNDE",
        prenom: "Pascal",
        role: "CITOYEN",
        commune: "Ouidah",
        departement: "Atlantique",
        password: "monSuperMotDePasse2026",
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.requiresValidation).toBe(false);
    expect(data.user.role).toBe("CITOYEN");
    expect(data.user.statutValidation).toBe("VALIDE");
  });

  it("doit soumettre un compte notaire à l'instruction de l'IGAF", async () => {
    const testNpi = `ANIP-NOTAIRE-${Date.now()}`;
    const req = new Request("http://localhost/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        npi: testNpi,
        nom: "ADJANOHOUN",
        prenom: "Me Euloge",
        role: "NOTAIRE",
        etablissementNom: "Étude Notariale Adjanohoun (Porto-Novo)",
        commune: "Porto-Novo",
        departement: "Ouémé",
        password: "notaireSecure2026",
      }),
    });

    const res = await registerRoute(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.requiresValidation).toBe(true);
    expect(data.user.statutValidation).toBe("EN_ATTENTE_VALIDATION");
  });

  it("doit authentifier un compte officiel avec son NPI", async () => {
    const req = new Request("http://localhost/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: "FICTIF-BEN-2026-0041", // Germain Dossou (Citoyen)
        password: "cit2026",
      }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("CITOYEN");
    expect(data.redirectUrl).toBe("/espace/citoyen");
  });

  it("doit refuser la connexion avec un mauvais mot de passe", async () => {
    const req = new Request("http://localhost/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier: "FICTIF-BEN-2026-0088", // Notaire Agbossou
        password: "mauvais_mot_de_passe",
      }),
    });

    const res = await loginRoute(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Mot de passe incorrect");
  });
});
