"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { UserRole, UserSession, AccountStatus, DEMO_USERS, ROLE_DASHBOARDS } from "./auth-session";
import { useRouter } from "next/navigation";

export interface ControllerMandate {
  active: boolean;
  nom: string;
  prenom: string;
  npi: string;
  titre: string;
  decretReference: string;
  dateNomination: string;
  supervisePar: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  loginAs: (role: UserRole) => void;
  loginWithCredentials: (npi: string, role: UserRole, password?: string) => boolean;
  registerAccount: (newSession: UserSession) => { success: boolean; requiresValidation: boolean; status: AccountStatus };
  getRegisteredAccounts: () => UserSession[];
  validateAccount: (npi: string, validePar?: string) => void;
  rejectAccount: (npi: string, motif: string) => void;
  suspendAccount: (npi: string, motif: string) => void;
  controllerMandate: ControllerMandate;
  toggleControllerMandate: (active: boolean) => void;
  lastLoginError: string | null;
  clearLoginError: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "anyigba_auth_session_user";
const REGISTERED_ACCOUNTS_KEY = "anyigba_registered_accounts";
const CONTROLLER_MANDATE_KEY = "anyigba_controller_mandate";

const DEFAULT_MANDATE: ControllerMandate = {
  active: true,
  nom: "HOUNNOU",
  prenom: "Inspecteur Patrice",
  npi: "FICTIF-BEN-2026-0007",
  titre: "Contrôleur National des Habilitations & Déontologie Foncière",
  decretReference: "Décret N° 2026-MCVDD/IGAF-042 portant nomination et délégation de contrôle",
  dateNomination: "15 Janvier 2026",
  supervisePar: "Ministère du Cadre de Vie et des Transports (MCVDD)",
};

const INITIAL_REGISTERED_ACCOUNTS: UserSession[] = [
  {
    npi: "BEN-NPI-2026-9081",
    nom: "KOKOU",
    prenom: "Me Sossou",
    role: "NOTAIRE",
    roleLabel: "Notaire Instrumentaire",
    titre: "Notaire Titulaire de Charge • Étude Kokou",
    etablissementNom: "Étude Notariale Kokou & Associés (Porto-Novo)",
    commune: "Porto-Novo",
    departement: "Ouémé",
    badge: "Mutation & Verrou Légal",
    statutValidation: "EN_ATTENTE_VALIDATION",
    dateDemande: "26/09/2026 à 14:32",
    password: "notaire2026",
  },
  {
    npi: "BEN-NPI-2026-4422",
    nom: "TCHIBOZO",
    prenom: "Ing. Fiacre",
    role: "AGENT",
    roleLabel: "Agent Cadastral de Zone",
    titre: "Géomètre-Expert Stagiaire Habilité",
    etablissementNom: "Cabinet Topographie & Foncier Calavi",
    commune: "Abomey-Calavi",
    departement: "Atlantique",
    badge: "Bornage GPS & Audio",
    statutValidation: "EN_ATTENTE_VALIDATION",
    dateDemande: "26/09/2026 à 18:10",
    password: "agent2026",
  },
  {
    npi: "BEN-NPI-2026-7733",
    nom: "AÏZAN",
    prenom: "Mme Blandine",
    role: "COMMUNE",
    roleLabel: "Direction Urbanisme Communal",
    titre: "Adjointe au Chef Service Domanial",
    etablissementNom: "Mairie d'Allada",
    commune: "Allada",
    departement: "Atlantique",
    badge: "Urbanisme & Taxes",
    statutValidation: "EN_ATTENTE_VALIDATION",
    dateDemande: "27/09/2026 à 08:15",
    password: "com2026",
  },
  {
    npi: "BEN-NPI-2026-5511",
    nom: "ECOBANK BÉNIN",
    prenom: "Département Risques",
    role: "BANQUE",
    roleLabel: "Établissement Bancaire",
    titre: "Analyste Crédit & Prises de Garantie",
    etablissementNom: "Ecobank Bénin SA • Siège Cotonou",
    commune: "Cotonou",
    departement: "Littoral",
    badge: "Garanties & Hypothèque",
    statutValidation: "VALIDE",
    dateDemande: "24/09/2026 à 11:00",
    dateValidation: "25/09/2026 à 09:20",
    validePar: "Inspecteur Patrice HOUNNOU (Contrôleur National IGAF)",
    password: "banque2026",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserSession[]>([]);
  const [controllerMandate, setControllerMandate] = useState<ControllerMandate>(DEFAULT_MANDATE);
  const [lastLoginError, setLastLoginError] = useState<string | null>(null);
  const router = useRouter();

  // Initialisation au montage
  useEffect(() => {
    try {
      // 1. Session active
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }

      // 2. Mandat du contrôleur sous tutelle ministérielle
      const storedMandate = localStorage.getItem(CONTROLLER_MANDATE_KEY);
      if (storedMandate) {
        setControllerMandate(JSON.parse(storedMandate));
      } else {
        localStorage.setItem(CONTROLLER_MANDATE_KEY, JSON.stringify(DEFAULT_MANDATE));
      }

      // 3. Comptes enregistrés
      const storedAccounts = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      if (storedAccounts) {
        setRegisteredAccounts(JSON.parse(storedAccounts));
      } else {
        localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(INITIAL_REGISTERED_ACCOUNTS));
        setRegisteredAccounts(INITIAL_REGISTERED_ACCOUNTS);
      }
    } catch (e) {
      console.error("Erreur de récupération de session foncière:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginAs = (role: UserRole) => {
    setLastLoginError(null);
    const session = DEMO_USERS[role];
    if (session) {
      // Si on se connecte en tant que contrôleur, vérifier si son mandat est actif
      if (role === "CONTROLEUR" && !controllerMandate.active) {
        setLastLoginError("Le mandat du Contrôleur Général est actuellement suspendu par le Ministère.");
        return;
      }

      setUser(session);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        localStorage.setItem("anyigba_user_role", session.role.toLowerCase());
        localStorage.setItem("anyigba_user_name", `${session.prenom} ${session.nom}`);
        localStorage.setItem("anyigba_user_npi", session.npi);
      } catch (e) {
        console.error("Erreur écriture session foncière:", e);
      }
      const targetRoute = ROLE_DASHBOARDS[role];
      router.push(targetRoute);
    }
  };

  const loginWithCredentials = (npi: string, role: UserRole, password?: string): boolean => {
    setLastLoginError(null);

    // Vérifier si le rôle Contrôleur a son mandat actif auprès du Ministère
    if (role === "CONTROLEUR" && !controllerMandate.active) {
      setLastLoginError("Le mandat de l'Inspecteur Contrôleur est suspendu par décision du Ministère.");
      return false;
    }

    // Chercher dans les comptes enregistrés
    let matchedCustomUser: UserSession | null = null;
    try {
      const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const list: UserSession[] = existingRaw ? JSON.parse(existingRaw) : registeredAccounts;
      matchedCustomUser = list.find((u) => u.npi.trim().toLowerCase() === (npi || "").trim().toLowerCase()) || null;
    } catch (e) {
      console.error("Erreur lecture comptes enregistrés:", e);
    }

    // CONTRÔLE RÉGLEMENTAIRE DE LA VALIDATION DU COMPTE
    if (matchedCustomUser) {
      if (matchedCustomUser.statutValidation === "EN_ATTENTE_VALIDATION") {
        setLastLoginError(
          `Votre compte (${matchedCustomUser.prenom} ${matchedCustomUser.nom} - NPI: ${matchedCustomUser.npi}) est en attente d'approbation par le Contrôleur National des Habilitations (sous tutelle du Ministère). Veuillez patienter que votre qualité d'officier/acteur soit certifiée.`
        );
        return false;
      }

      if (matchedCustomUser.statutValidation === "REJETE") {
        setLastLoginError(
          `Demande d'habilitation refusée par le Contrôleur National. Motif : ${matchedCustomUser.motifRefus || "Justificatifs ou NPI non concordants avec l'annuaire national."}`
        );
        return false;
      }

      if (matchedCustomUser.statutValidation === "SUSPENDU") {
        setLastLoginError("Ce compte a été suspendu par mesure conservatoire de déontologie.");
        return false;
      }
    }

    const template = DEMO_USERS[role];
    const session: UserSession = matchedCustomUser
      ? { ...matchedCustomUser, role, statutValidation: "VALIDE" }
      : {
          ...template,
          npi: npi || template.npi,
          statutValidation: "VALIDE",
        };

    setUser(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem("anyigba_user_role", session.role.toLowerCase());
      localStorage.setItem("anyigba_user_name", `${session.prenom} ${session.nom}`);
      localStorage.setItem("anyigba_user_npi", session.npi);
    } catch (e) {
      console.error("Erreur écriture session foncière:", e);
    }
    const targetRoute = ROLE_DASHBOARDS[role];
    router.push(targetRoute);
    return true;
  };

  const registerAccount = (
    newSession: UserSession
  ): { success: boolean; requiresValidation: boolean; status: AccountStatus } => {
    setLastLoginError(null);
    // Tout rôle officiel / à responsabilité juridique nécessite la validation du Contrôleur
    const isOfficialRole = newSession.role !== "CITOYEN";
    const status: AccountStatus = isOfficialRole ? "EN_ATTENTE_VALIDATION" : "VALIDE";

    const sessionWithStatus: UserSession = {
      ...newSession,
      statutValidation: status,
      dateDemande: new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date()),
    };

    let updatedList: UserSession[] = [];
    try {
      const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const list: UserSession[] = existingRaw ? JSON.parse(existingRaw) : registeredAccounts;
      updatedList = [sessionWithStatus, ...list.filter((u) => u.npi !== sessionWithStatus.npi)];
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(updatedList));
      setRegisteredAccounts(updatedList);
    } catch (e) {
      console.error("Erreur enregistrement nouveau compte:", e);
    }

    // Si c'est un citoyen (auto-validé), on ouvre directement sa session
    if (!isOfficialRole) {
      setUser(sessionWithStatus);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionWithStatus));
        localStorage.setItem("anyigba_user_role", sessionWithStatus.role.toLowerCase());
        localStorage.setItem("anyigba_user_name", `${sessionWithStatus.prenom} ${sessionWithStatus.nom}`);
        localStorage.setItem("anyigba_user_npi", sessionWithStatus.npi);
      } catch (e) {
        console.error("Erreur écriture session:", e);
      }
      const targetRoute = ROLE_DASHBOARDS[sessionWithStatus.role];
      router.push(targetRoute);
      return { success: true, requiresValidation: false, status: "VALIDE" };
    }

    // Pour les rôles officiels, le compte reste bloqué jusqu'à validation par le Contrôleur
    return {
      success: true,
      requiresValidation: true,
      status: "EN_ATTENTE_VALIDATION",
    };
  };

  const getRegisteredAccounts = (): UserSession[] => {
    if (typeof window !== "undefined") {
      try {
        const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
        if (existingRaw) {
          return JSON.parse(existingRaw);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return registeredAccounts.length > 0 ? registeredAccounts : INITIAL_REGISTERED_ACCOUNTS;
  };

  const validateAccount = (npi: string, validePar = "Inspecteur Patrice HOUNNOU (Contrôleur National IGAF)") => {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const list: UserSession[] = existingRaw ? JSON.parse(existingRaw) : registeredAccounts;
      const updated = list.map((acc) => {
        if (acc.npi === npi) {
          return {
            ...acc,
            statutValidation: "VALIDE" as AccountStatus,
            dateValidation: new Intl.DateTimeFormat("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date()),
            validePar,
            motifRefus: undefined,
          };
        }
        return acc;
      });
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(updated));
      setRegisteredAccounts(updated);
    } catch (e) {
      console.error("Erreur validation compte:", e);
    }
  };

  const rejectAccount = (npi: string, motif: string) => {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const list: UserSession[] = existingRaw ? JSON.parse(existingRaw) : registeredAccounts;
      const updated = list.map((acc) => {
        if (acc.npi === npi) {
          return {
            ...acc,
            statutValidation: "REJETE" as AccountStatus,
            motifRefus: motif,
          };
        }
        return acc;
      });
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(updated));
      setRegisteredAccounts(updated);
    } catch (e) {
      console.error("Erreur rejet compte:", e);
    }
  };

  const suspendAccount = (npi: string, motif: string) => {
    try {
      const existingRaw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
      const list: UserSession[] = existingRaw ? JSON.parse(existingRaw) : registeredAccounts;
      const updated = list.map((acc) => {
        if (acc.npi === npi) {
          return {
            ...acc,
            statutValidation: "SUSPENDU" as AccountStatus,
            motifRefus: motif,
          };
        }
        return acc;
      });
      localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(updated));
      setRegisteredAccounts(updated);
    } catch (e) {
      console.error("Erreur suspension compte:", e);
    }
  };

  const toggleControllerMandate = (active: boolean) => {
    const updated = { ...controllerMandate, active };
    setControllerMandate(updated);
    try {
      localStorage.setItem(CONTROLLER_MANDATE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Erreur mise à jour mandat contrôleur:", e);
    }
  };

  const clearLoginError = () => {
    setLastLoginError(null);
  };

  const logout = () => {
    setUser(null);
    setLastLoginError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("anyigba_user_role");
      localStorage.removeItem("anyigba_user_name");
      localStorage.removeItem("anyigba_user_npi");
    } catch (e) {
      console.error("Erreur suppression session:", e);
    }
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginAs,
        loginWithCredentials,
        registerAccount,
        getRegisteredAccounts,
        validateAccount,
        rejectAccount,
        suspendAccount,
        controllerMandate,
        toggleControllerMandate,
        lastLoginError,
        clearLoginError,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return context;
}
