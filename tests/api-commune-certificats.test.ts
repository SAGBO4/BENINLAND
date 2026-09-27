import { describe, it, expect, beforeEach } from "vitest";
import { POST as createCertificat, GET as getCertificats } from "@/app/api/v1/commune/certificats/route";
import { GET as verifyCode } from "@/app/api/v1/verification/[code]/route";
import { POST as createConvention } from "@/app/api/v1/conventions/route";
import { POST as postMutation } from "@/app/api/v1/mutations/route";
import { anyigbaRepo } from "@/repositories/index";

describe("Module Mairie : Certificats d'Évaluation, Fixation du Prix & Quittance TrésorPay", () => {
  beforeEach(() => {
    anyigbaRepo.resetToDeterministicSeed();
  });

  it("doit récupérer la liste des certificats communaux incluant le seed initial", async () => {
    const req = new Request("http://localhost:3000/api/v1/commune/certificats");
    const res = await getCertificats(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.count).toBeGreaterThanOrEqual(1);
    expect(json.data.some((c: any) => c.codeCertificat === "CERTIF-COMMUNE-OUI-0421-2026")).toBe(true);
  });

  it("doit émettre un Certificat Municipal officiel après validation de paiement TrésorPay", async () => {
    const payload = {
      codeParcelle: "OUI-0421",
      commune: "Ouidah",
      arrondissement: "Pahou",
      prixAcquisitionInitial: 2000000,
      prixFixeFcfa: 4500000,
      travauxDeductibles: 500000,
      modePaiement: "TRESORPAY",
      agentMairieNpi: "FICTIF-BEN-2026-0033",
      agentMairieNom: "Sètondji Gbedji (Chef Service Foncier)",
    };

    const req = new Request("http://localhost:3000/api/v1/commune/certificats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await createCertificat(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.codeCertificat).toContain("CERTIF-COMMUNE-OUI-0421");
    expect(json.data.prixFixeFcfa).toBe(4500000);
    expect(json.data.plusValueNette).toBe(2000000); // 4500000 - 2000000 - 500000
    expect(json.data.taxeCalculeeFcfa).toBe(100000); // 5% de 2000000
    expect(json.data.quittanceTresorRef).toContain("TRESOR-DGTCP-");
    expect(json.data.hashSha256).toMatch(/^0x[a-f0-9]{40,64}$/i);
    expect(json.data.otsProof).toContain("OTS-BTC-MAIRIE-OUI-");
  });

  it("doit permettre la vérification publique du Certificat Municipal via /api/v1/verification/[code]", async () => {
    const req = new Request("http://localhost:3000/api/v1/verification/CERTIF-COMMUNE-OUI-0421-2026");
    const res = await verifyCode(req, {
      params: Promise.resolve({ code: "CERTIF-COMMUNE-OUI-0421-2026" }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.type).toBe("CERTIFICAT_COMMUNAL");
    expect(json.data.prixFixeFcfa).toBe(4500000);
    expect(json.data.taxeCalculeeFcfa).toBe(100000);
    expect(json.data.forceLegale).toContain("Art. 142 du Code Foncier et Domanial");
  });

  it("doit lier le Certificat Municipal lors de l'enregistrement de la convention de l'Agent Foncier", async () => {
    const convPayload = {
      agentNpi: "FICTIF-BEN-2026-0045",
      agentNom: "Mamadou Bio (Agent Foncier)",
      vendeurNpi: "FICTIF-BEN-2026-0041",
      vendeurNom: "Germain Dossou",
      acheteurNpi: "FICTIF-BEN-2026-0003",
      acheteurNom: "Koffi Mensah",
      commune: "Ouidah",
      village: "Pahou",
      surfaceM2: 1250,
      prixFcfa: 4500000,
      parcelleCode: "OUI-0421",
      certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
      certificatMairieHash: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
    };

    const req = new Request("http://localhost:3000/api/v1/conventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(convPayload),
    });

    const res = await createConvention(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.prixFcfa).toBe(4500000);
    expect(json.data.certificatMairieRef).toBe("CERTIF-COMMUNE-OUI-0421-2026");
    expect(json.data.dossierHashSha256).toBeDefined();
  });

  it("doit refuser avec 400 toute convention avec un prix divergent du certificat communal scellé", async () => {
    const frauduleuxPayload = {
      agentNpi: "FICTIF-BEN-2026-0045",
      agentNom: "Mamadou Bio (Agent Foncier)",
      vendeurNpi: "FICTIF-BEN-2026-0041",
      vendeurNom: "Germain Dossou",
      acheteurNpi: "FICTIF-BEN-2026-0003",
      acheteurNom: "Koffi Mensah",
      commune: "Ouidah",
      village: "Pahou",
      surfaceM2: 1250,
      prixFcfa: 7000000, // Tentative de surévaluation ou sous-évaluation par rapport au certificat (4 500 000)
      parcelleCode: "OUI-0421",
      certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
    };

    const req = new Request("http://localhost:3000/api/v1/conventions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(frauduleuxPayload),
    });

    const res = await createConvention(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("PRIX_NON_CONFORME_MAIRIE");
  });

  it("doit vérifier que le procès-verbal initial CONV-VIL-2026-042 contient la référence au certificat communal", async () => {
    const req = new Request("http://localhost:3000/api/v1/verification/CONV-VIL-2026-042");
    const res = await verifyCode(req, {
      params: Promise.resolve({ code: "CONV-VIL-2026-042" }),
    });

    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.type).toBe("PROCES_VERBAL_BORNAGE");
    expect(json.data.certificatMairieRef).toBe("CERTIF-COMMUNE-OUI-0421-2026");
    expect(json.data.forceLegale).toContain("Art. 142");
  });

  it("doit rejeter un payload de création de certificat invalide avec 400 Bad Request", async () => {
    const badPayload = {
      codeParcelle: "X", // trop court (<3)
      commune: "O", // trop court (<2)
      prixAcquisitionInitial: -100, // négatif
      prixFixeFcfa: 0, // non strictement positif
    };

    const req = new Request("http://localhost:3000/api/v1/commune/certificats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(badPayload),
    });

    const res = await createCertificat(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Données de certificat invalides");
  });

  it("doit extraire automatiquement le QR-Code et le prix certifié depuis un fichier PDF uploadé", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");

    // Simulation d'un fichier PDF officiel émis contenant le certificat et le QR JSON
    const simulatedPdfContent = `
      %PDF-1.4
      1 0 obj << /Title (Certificat Municipal) >> endobj
      RÉPUBLIQUE DU BÉNIN - DIRECTION DES AFFAIRES DOMANIALES DE OUIDAH
      CERTIFICAT MUNICIPAL D'ÉVALUATION ET DE FIXATION DU PRIX FONCIER
      Référence : CERTIF-COMMUNE-OUI-0421-2026
      {"type":"CERTIFICAT_COMMUNE_PRIX","codeCertificat":"CERTIF-COMMUNE-OUI-0421-2026","codeParcelle":"OUI-0421","commune":"Ouidah","prixFixeFcfa":4500000,"quittanceTresor":"TRESOR-DGTCP-2026-88124"}
      %%EOF
    `;

    const blob = new Blob([simulatedPdfContent], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", blob, "certificat_officiel_ouidah_0421.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026");
    expect(json.data.prixFixeFcfa).toBe(4500000);
    expect(json.data.codeParcelle).toBe("OUI-0421");
  });

  it("doit renvoyer 422 si le fichier uploadé ne contient aucun certificat ou QR-Code valide", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");

    const invalidContent = "Fichier texte quelconque sans rapport avec le foncier ni la mairie.";
    const blob = new Blob([invalidContent], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", blob, "document_invalide.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(422);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Aucun QR-Code ou Certificat Municipal");
  });

  it("doit renvoyer 400 si aucun fichier n'est fourni à decode-pdf", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");
    const formData = new FormData();
    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Aucun fichier fourni");
  });

  it("doit extraire le certificat via la référence textuelle officielle CERTIF-COMMUNE-OUI-0421-2026", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");
    const pdfText = `
      MAIRIE DE OUIDAH
      Certificat délivré sous la référence CERTIF-COMMUNE-OUI-0421-2026
      Montant homologué : 4 500 000 FCFA
    `;
    const blob = new Blob([pdfText], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", blob, "certificat_ref.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026");
    expect(json.data.prixFixeFcfa).toBe(4500000);
  });

  it("doit décoder parfaitement le vrai fichier PDF téléchargé par l'utilisateur", async () => {
    const fs = await import("fs");
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");

    const realPath = "/home/lesaint/Downloads/BENINLAND (Anyigba) — Cadastre Numérique & Sécurisation Foncière du Bénin.pdf";
    expect(fs.existsSync(realPath)).toBe(true);

    const buffer = fs.readFileSync(realPath);
    const blob = new Blob([buffer], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", blob, "BENINLAND_Certificat_User.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.source).toBe("EXTRACTION_PDF_AUTHENTIFIEE");
    expect(json.data.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026-9315");
    expect(json.data.prixFixeFcfa).toBe(4500000);
    expect(json.data.codeParcelle).toBe("OUI-0421");
    expect(json.data.quittanceTresorRef).toMatch(/^TRESOR-DGTCP-2026-\d+$/);
    expect(json.data.hashSha256).toMatch(/^0x[a-f0-9]{64}$/);
    expect(json.data.otsProof).toMatch(/^OTS-BTC-MAIRIE-/);

    // Vérification que le certificat extrait est opposable sur le portail public de vérification
    const verifyReq = new Request("http://localhost:3000/api/v1/verification/CERTIF-COMMUNE-OUI-0421-2026-9315");
    const verifyRes = await verifyCode(verifyReq, {
      params: Promise.resolve({ code: "CERTIF-COMMUNE-OUI-0421-2026-9315" }),
    });
    const verifyJson = await verifyRes.json();

    expect(verifyRes.status).toBe(200);
    expect(verifyJson.success).toBe(true);
    expect(verifyJson.type).toBe("CERTIFICAT_COMMUNAL");
    expect(verifyJson.data.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026-9315");
    expect(verifyJson.data.prixFixeFcfa).toBe(4500000);
    expect(verifyJson.data.quittanceTresorRef).toMatch(/^TRESOR-DGTCP-2026-\d+$/);
    expect(verifyJson.data.forceLegale).toContain("Art. 142");
  });

  it("doit renvoyer 400 Bad Request si un fichier vide (0 octet) est transmis à decode-pdf", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");
    const emptyBlob = new Blob([], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", emptyBlob, "vide_zero_octet.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/vide/i);
  });

  it("doit extraire parfaitement le QR-Code avec quittance TrésorPay, empreinte SHA-256 et horodatage OTS", async () => {
    const { POST: decodePdf } = await import("@/app/api/v1/commune/certificats/decode-pdf/route");

    // Simulation du QR-Code exact généré par la page de la Mairie (/espace/commune)
    const qrData = {
      type: "CERTIFICAT_COMMUNE_PRIX",
      codeCertificat: "CERTIF-COMMUNE-OUI-0421-2026-7788",
      codeParcelle: "OUI-0421",
      commune: "Ouidah",
      prixFixeFcfa: 4500000,
      taxePayeeFcfa: 100000,
      quittanceTresor: "TRESOR-DGTCP-2026-88124",
      dateEmission: "2026-09-27T12:00:00.000Z",
      hash: "0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce",
      ots: "OTS-BTC-MAIRIE-OUI-3F5C9E2B",
    };

    const simulatedPdf = `%PDF-1.4\n${JSON.stringify(qrData)}\n%%EOF`;
    const blob = new Blob([simulatedPdf], { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", blob, "certificat_qr_officiel.pdf");

    const req = new Request("http://localhost:3000/api/v1/commune/certificats/decode-pdf", {
      method: "POST",
      body: formData,
    });

    const res = await decodePdf(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.codeCertificat).toBe("CERTIF-COMMUNE-OUI-0421-2026-7788");
    expect(json.data.prixFixeFcfa).toBe(4500000);
    expect(json.data.quittanceTresorRef).toBe("TRESOR-DGTCP-2026-88124");
    expect(json.data.hashSha256).toBe("0x3f5c9e2b1840ab3d90f234acfe7b11d94821a71120938c4b281f661a384029ce");
    expect(json.data.otsProof).toBe("OTS-BTC-MAIRIE-OUI-3F5C9E2B");
  });

  it("doit refuser avec 400 toute mutation notariée dont le prix diffère du certificat communal scellé (Art. 142 CFD)", async () => {
    const payloadInvalide = {
      parcelleCode: "OUI-0421",
      certificatMairieRef: "CERTIF-COMMUNE-OUI-0421-2026",
      cedantNpi: "FICTIF-BEN-2026-0041",
      cedantNom: "Germain Dossou",
      cessionnaireNpi: "FICTIF-BEN-2026-0003",
      cessionnaireNom: "Koffi Mensah",
      notaireId: "Me Christian Agbossou",
      prixFcfa: 9000000, // Diffère du prix homologué par la Mairie (4 500 000 FCFA)
    };

    const req = new Request("http://localhost:3000/api/v1/mutations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadInvalide),
    });

    const res = await postMutation(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("PRIX_NON_CONFORME_MAIRIE");
  });
});
