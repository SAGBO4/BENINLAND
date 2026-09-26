"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Building2,
  Scale,
  Landmark,
  Settings,
  Sparkles,
  KeyRound,
} from "lucide-react";

export interface DemoRole {
  id: string;
  label: string;
  roleCode: string;
  email: string;
  npi: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  targetUrl: string;
  flowDescription: string;
}

export const DEMO_ROLES: DemoRole[] = [
  {
    id: "notaire",
    label: "Notaire",
    roleCode: "notaire",
    email: "notaire@demo.bj",
    npi: "FICTIF-BEN-2026-0088",
    name: "Me Christian Agbossou",
    icon: FileSpreadsheet,
    badge: "Mutation & Verrou",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    targetUrl: "/espace/notaire",
    flowDescription: "Ouverture d'acte, pose du verrou anti-double-vente, contrôle des parties.",
  },
  {
    id: "andf",
    label: "ANDF",
    roleCode: "andf",
    email: "andf@demo.bj",
    npi: "FICTIF-BEN-2026-0012",
    name: "Mme Reine Houndété (Directrice)",
    icon: ShieldAlert,
    badge: "Validation Souveraine",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    targetUrl: "/espace/andf",
    flowDescription: "Instruction technique, validation de mutation, émission de Titre Foncier (TF/CPF).",
  },
  {
    id: "agent",
    label: "Agent Foncier",
    roleCode: "agent_foncier",
    email: "agent@demo.bj",
    npi: "FICTIF-BEN-2026-0045",
    name: "Mamadou Bio (Agent Terrain)",
    icon: Users,
    badge: "Convention Village",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    targetUrl: "/espace/agent",
    flowDescription: "Levé GPS des bornes, recueil des voix en Fongbe/Yoruba, séquestre Mobile Money.",
  },
  {
    id: "csaf",
    label: "Juge CSAF",
    roleCode: "juge_csaf",
    email: "csaf@demo.bj",
    npi: "FICTIF-BEN-2026-0099",
    name: "Juge Sossa (Cour Spéciale)",
    icon: Scale,
    badge: "Gel Conservatoire",
    badgeColor: "bg-destructive/20 text-destructive border-destructive/30",
    targetUrl: "/espace/csaf",
    flowDescription: "Enregistrement des litiges fonciers, ordonnance de gel immédiat de parcelle.",
  },
  {
    id: "commune",
    label: "Mairie / Commune",
    roleCode: "commune",
    email: "commune@demo.bj",
    npi: "FICTIF-BEN-2026-0033",
    name: "Direction de l'Urbanisme (Ouidah)",
    icon: Building2,
    badge: "Fiscalité & Bâtis",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    targetUrl: "/espace/commune",
    flowDescription: "Constat des constructions, calcul automatique de la plus-value communale.",
  },
  {
    id: "citoyen",
    label: "Citoyen / Famille",
    roleCode: "citoyen",
    email: "citoyen@demo.bj",
    npi: "FICTIF-BEN-2026-0041",
    name: "Germain Dossou (Famille Dossou)",
    icon: Landmark,
    badge: "Patrimoine & Famille",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    targetUrl: "/espace/citoyen",
    flowDescription: "Consultation de ses parcelles, carnet de famille foncier et alertes SMS.",
  },
  {
    id: "banque",
    label: "Banque / Prêteur",
    roleCode: "banque",
    email: "banque@demo.bj",
    npi: "FICTIF-BEN-2026-0700",
    name: "Banque Nationale de Crédit",
    icon: Landmark,
    badge: "Hypothèque & Garantie",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    targetUrl: "/espace/banque",
    flowDescription: "Vérification d'authenticité de titre pour prêt et inscription d'hypothèque.",
  },
  {
    id: "admin",
    label: "Super Admin",
    roleCode: "admin",
    email: "admin@demo.bj",
    npi: "FICTIF-BEN-2026-0001",
    name: "Administrateur National",
    icon: Settings,
    badge: "Supervision & Reset",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    targetUrl: "/admin",
    flowDescription: "Santé des nœuds blockchain, journal d'audit inaltérable, réinitialisation démo.",
  },
];

export function LoginPanel() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<DemoRole>(DEMO_ROLES[0]);
  const [email, setEmail] = useState(DEMO_ROLES[0].email);
  const [password, setPassword] = useState("demo2026");
  const [loading, setLoading] = useState(false);

  const handleSelectRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(role.email);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    // Mémorisation de la session de rôle dans localStorage / cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("anyigba_user_role", selectedRole.roleCode);
      localStorage.setItem("anyigba_user_name", selectedRole.name);
      localStorage.setItem("anyigba_user_email", selectedRole.email);
      localStorage.setItem("anyigba_user_npi", selectedRole.npi);
    }

    setTimeout(() => {
      router.push(selectedRole.targetUrl);
    }, 400);
  };

  const Icon = selectedRole.icon;

  return (
    <div className="w-full bg-card/95 border border-primary/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6">
      {/* Effet visuel d'angle or */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* En-tête du module */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
            <KeyRound className="w-4 h-4 text-secondary" />
            <span>Portail d&apos;Accès Multi-Rôles</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> 8 Profils Métier
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground tracking-tight">
          Connectez-vous à votre Espace
        </h3>
        <p className="text-xs text-muted-foreground">
          Sélectionnez un rôle type ci-dessous pour déclencher instantanément le flux métier associé.
        </p>
      </div>

      {/* Sélecteur de Rôles Démo (Grille de boutons 4x2) */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
          Choisissez votre rôle de démonstration :
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEMO_ROLES.map((r) => {
            const isSelected = selectedRole.id === r.id;
            const RoleIcon = r.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-background/60 hover:bg-background border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <RoleIcon className={`w-4 h-4 mb-1.5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-bold leading-tight">{r.label}</span>
                <span
                  className={`text-[9px] mt-1 px-1 rounded truncate max-w-full font-medium ${
                    isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {r.id === "notaire"
                    ? "Verrou"
                    : r.id === "andf"
                    ? "Titres"
                    : r.id === "agent"
                    ? "Village"
                    : r.id === "csaf"
                    ? "Litiges"
                    : r.id === "commune"
                    ? "Mairie"
                    : r.id === "citoyen"
                    ? "Famille"
                    : r.id === "banque"
                    ? "Crédit"
                    : "Admin"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carte descriptive du profil sélectionné */}
      <div className="p-3.5 rounded-xl bg-background/80 border border-border space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-bold text-foreground">{selectedRole.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">NPI : {selectedRole.npi}</div>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedRole.badgeColor}`}>
            {selectedRole.badge}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground italic leading-relaxed pt-1 border-t border-border/50">
          « {selectedRole.flowDescription} »
        </p>
      </div>

      {/* Formulaire identifiants */}
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Identifiant ou Email officiel :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <label className="font-medium">Mot de passe de démo :</label>
            <span className="text-[10px] text-primary font-mono">demo2026</span>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
            <Lock className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Bouton de connexion directe au flux */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-[#064227] hover:from-primary/90 hover:to-[#085230] text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 flex items-center justify-center gap-2 group transition cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Accéder à l&apos;Espace {selectedRole.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleLogin()}
          disabled={loading}
          className="w-full py-2 px-3 rounded-lg bg-secondary/15 hover:bg-secondary/25 border border-secondary/40 text-secondary font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Connexion Instantanée 1-Clic Démo</span>
        </button>
      </form>
    </div>
  );
}
