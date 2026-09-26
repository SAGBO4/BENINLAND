/**
 * Simulateur des canaux non-smartphone (SMS et USSD) pour Anyigba.
 * Enregistre et trace chaque échange pour démonstration déterministe.
 */

export interface SimulatedSmsRecord {
  id: string;
  telephone: string;
  direction: "INBOUND" | "OUTBOUND";
  message: string;
  date: string;
}

export interface SimulatedUssdSession {
  sessionId: string;
  telephone: string;
  currentStep: string;
  lastInput?: string;
  history: string[];
}

// Mémoire locale de session pour le simulateur
const smsJournal: SimulatedSmsRecord[] = [
  {
    id: "SMS-001",
    telephone: "+229 97 00 12 34",
    direction: "OUTBOUND",
    message: "ANYIGBA: Bienvenue. Envoyez VERIF <CodeParcelle> au 132 pour verifier le statut officiel d'un terrain.",
    date: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function sendSimulatedSms(telephone: string, message: string): SimulatedSmsRecord {
  const record: SimulatedSmsRecord = {
    id: `SMS-${Date.now().toString().slice(-4)}`,
    telephone,
    direction: "OUTBOUND",
    message,
    date: new Date().toISOString(),
  };
  smsJournal.push(record);
  return record;
}

export function getSimulatedSmsJournal(): SimulatedSmsRecord[] {
  return [...smsJournal];
}

/**
 * Traite une commande SMS entrante (ex: "VERIF OUI-0421").
 */
export function processInboundSms(telephone: string, text: string): string {
  const parts = text.trim().split(/\s+/);
  const command = parts[0]?.toUpperCase();
  const arg = parts[1]?.toUpperCase();

  smsJournal.push({
    id: `SMS-${Date.now().toString().slice(-4)}`,
    telephone,
    direction: "INBOUND",
    message: text,
    date: new Date().toISOString(),
  });

  if (command === "VERIF") {
    if (!arg) {
      const resp = "ANYIGBA: Veuillez preciser le code parcelle. Exemple: VERIF OUI-0421 au 132.";
      sendSimulatedSms(telephone, resp);
      return resp;
    }

    if (arg === "OUI-0421") {
      const resp = "ANYIGBA [OUI-0421]: Ouidah Pahou (1250 m2). Droit coutumier declare. Zéro litige. Zéro mutation en cours. Proprietaire: Famille DOSSOU. Statut: ELIGIBLE A L'ACHAT.";
      sendSimulatedSms(telephone, resp);
      return resp;
    }

    if (arg.startsWith("LIT")) {
      const resp = `ANYIGBA [${arg}]: ATTENTION ! Parcelle en litige actif devant la CSAF. Vente rigoureusement interdite par ordonnance judiciaire.`;
      sendSimulatedSms(telephone, resp);
      return resp;
    }

    const resp = `ANYIGBA [${arg}]: Parcelle immatriculee ANDF (Titre Foncier valide). Pas de litige ni de verrou actif. Contactez la mairie pour consultation.`;
    sendSimulatedSms(telephone, resp);
    return resp;
  }

  const defaultResp = "ANYIGBA: Commande non reconnue. Envoyez VERIF <Code> pour verifier un terrain ou composez *123*7#.";
  sendSimulatedSms(telephone, defaultResp);
  return defaultResp;
}
