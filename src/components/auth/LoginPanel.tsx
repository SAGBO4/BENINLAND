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
  KeyRound,
  ShieldCheck,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface DemoRole {
  id: string;
  label: string;
  roleCode: string;
  category: "etat" | "terrain" | "finance";
  email: string;
  npi: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  badgeVariant: "default" | "secondary" | "destructive" | "info" | "warning" | "success" | "outline";
  targetUrl: string;
  flowDescription: string;
}

export const DEMO_ROLES: DemoRole[] = [
  {
    id: "ministere",
    label: "Ministère",
    roleCode: "ministere",
    category: "etat",
    email: "ministere@demo.bj",
    npi: "FICTIF-BEN-2026-0000",
    name: "Direction Générale & Régulation (MCVDD / MEF)",
    icon: Landmark,
    badge: "Régulation & Trésor (CUT)",
    badgeVariant: "secondary",
    targetUrl: "/espace/ministere",
    flowDescription: "Supervision des 12 départements, suivi des recettes du Trésor Public (CUT) et audit régalien des acteurs fonciers.",
  },
  {
    id: "notaire",
    label: "Notaire",
    roleCode: "notaire",
    category: "etat",
    email: "notaire@demo.bj",
    npi: "FICTIF-BEN-2026-0088",
    name: "Me Christian Agbossou",
    icon: FileSpreadsheet,
    badge: "Mutation & Verrou Légal",
    badgeVariant: "default",
    targetUrl: "/espace/notaire",
    flowDescription: "Ouverture d'acte de mutation, verrou d'opposabilité immédiate et consignation sous séquestre réglementaire.",
  },
  {
    id: "andf",
    label: "ANDF",
    roleCode: "andf",
    category: "etat",
    email: "andf@demo.bj",
    npi: "FICTIF-BEN-2026-0012",
    name: "Mme Reine Houndété (Directrice)",
    icon: ShieldCheck,
    badge: "Délivrance Titre CPF",
    badgeVariant: "info",
    targetUrl: "/espace/andf",
    flowDescription: "Instruction républicaine, contrôle cadastral et délivrance du Certificat de Propriété Foncière.",
  },
  {
    id: "csaf",
    label: "Juge CSAF",
    roleCode: "juge_csaf",
    category: "etat",
    email: "csaf@demo.bj",
    npi: "FICTIF-BEN-2026-0099",
    name: "Juge Sossa (Cour Spéciale)",
    icon: Scale,
    badge: "Gel Conservatoire",
    badgeVariant: "destructive",
    targetUrl: "/espace/csaf",
    flowDescription: "Saisine pour litige foncier, ordonnance de blocage d'urgence et gel immédiat au cadastre.",
  },
  {
    id: "agent",
    label: "Agent Foncier",
    roleCode: "agent_foncier",
    category: "terrain",
    email: "agent@demo.bj",
    npi: "FICTIF-BEN-2026-0045",
    name: "Mamadou Bio (Agent de Zone)",
    icon: Users,
    badge: "Bornage Contradictoire",
    badgeVariant: "warning",
    targetUrl: "/espace/agent",
    flowDescription: "Relevé GPS des 4 bornes, recueil des accords vocaux en Fongbe/Yoruba et procès-verbal d'usage.",
  },
  {
    id: "commune",
    label: "Mairie / Commune",
    roleCode: "commune",
    category: "terrain",
    email: "commune@demo.bj",
    npi: "FICTIF-BEN-2026-0033",
    name: "Urbanisme Ouidah",
    icon: Building2,
    badge: "Urbanisme & Taxes",
    badgeVariant: "success",
    targetUrl: "/espace/commune",
    flowDescription: "Constat des limites, calcul de la taxe communale sur la plus-value et adressage parcellaire.",
  },
  {
    id: "citoyen",
    label: "Citoyen / Famille",
    roleCode: "citoyen",
    category: "finance",
    email: "citoyen@demo.bj",
    npi: "FICTIF-BEN-2026-0041",
    name: "Germain Dossou (Vendeur)",
    icon: UserCheck,
    badge: "Patrimoine Familial",
    badgeVariant: "secondary",
    targetUrl: "/espace/citoyen",
    flowDescription: "Carnet de famille foncier, suivi de la vente OUI-0421 et notification de virement du Trésor.",
  },
  {
    id: "banque",
    label: "Banque / Crédit",
    roleCode: "banque",
    category: "finance",
    email: "banque@demo.bj",
    npi: "FICTIF-BEN-2026-0700",
    name: "Banque Nationale du Bénin",
    icon: Landmark,
    badge: "Garanties & Hypothèque",
    badgeVariant: "info",
    targetUrl: "/espace/banque",
    flowDescription: "Contrôle d'authenticité du titre foncier et inscription électronique de la sûreté réelle.",
  },
  {
    id: "admin",
    label: "Super Admin",
    roleCode: "admin",
    category: "finance",
    email: "admin@demo.bj",
    npi: "FICTIF-BEN-2026-0001",
    name: "Superviseur National",
    icon: Settings,
    badge: "Audit & Nœuds Chaîne",
    badgeVariant: "outline",
    targetUrl: "/admin",
    flowDescription: "Supervision des flux de mutation, journal d'audit cryptographique et santé du réseau.",
  },
];

export function LoginPanel() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<"all" | "etat" | "terrain" | "finance">("all");
  const [selectedRole, setSelectedRole] = useState<DemoRole>(DEMO_ROLES[0]);
  const [email, setEmail] = useState(DEMO_ROLES[0].email);
  const [password, setPassword] = useState("demo2026");
  const [loading, setLoading] = useState(false);

  const filteredRoles =
    activeCategory === "all"
      ? DEMO_ROLES
      : DEMO_ROLES.filter((r) => r.category === activeCategory);

  const handleSelectRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(role.email);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("anyigba_user_role", selectedRole.roleCode);
      localStorage.setItem("anyigba_user_name", selectedRole.name);
      localStorage.setItem("anyigba_user_email", selectedRole.email);
      localStorage.setItem("anyigba_user_npi", selectedRole.npi);
    }

    setTimeout(() => {
      router.push(selectedRole.targetUrl);
    }, 350);
  };

  const Icon = selectedRole.icon;

  return (
    <Card className="border-border shadow-2xl relative overflow-hidden bg-card">
      <CardHeader className="p-5 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
            <KeyRound className="w-4 h-4 text-secondary" />
            <span>Portail des Acteurs Foncier</span>
          </div>
          <Badge variant="outline" className="text-[11px] px-2 py-0.5 font-medium">
            9 Profils Métiers
          </Badge>
        </div>

        <div>
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
            Accès Professionnel &amp; Démonstration
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sélectionnez un acteur ci-dessous pour tester son interface et son rôle légal dans le foncier béninois.
          </CardDescription>
        </div>

        {/* Filtres de catégories d'acteurs */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous (9)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("etat")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
              activeCategory === "etat"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>État &amp; Notaires</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("terrain")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
              activeCategory === "terrain"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span>Mairies &amp; Agents</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("finance")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
              activeCategory === "finance"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>Citoyens &amp; Banques</span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Grille des profils professionnels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredRoles.map((r) => {
            const isSelected = selectedRole.id === r.id;
            const RoleIcon = r.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectRole(r)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                    : "bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <RoleIcon className={`w-4 h-4 mb-1 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-bold leading-tight truncate max-w-full">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Fiche descriptive du rôle sélectionné */}
        <div className="p-3.5 rounded-xl bg-background/90 border border-border space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="truncate">
                <div className="font-bold text-xs sm:text-sm text-foreground truncate">
                  {selectedRole.name}
                </div>
                <div className="text-[10px] text-muted-foreground font-mono truncate">
                  NPI : {selectedRole.npi}
                </div>
              </div>
            </div>
            <Badge variant={selectedRole.badgeVariant} className="text-[10px] shrink-0 font-semibold">
              {selectedRole.badge}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
            <span className="font-semibold text-foreground">Mission légale : </span>
            {selectedRole.flowDescription}
          </div>
        </div>

        {/* Formulaire & Déclencheurs de session */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Identifiant officiel :</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Code d&apos;accès :</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-8 text-xs pr-7 font-mono bg-background"
                />
                <Lock className="w-3 h-3 text-muted-foreground absolute right-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-sm font-bold flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Accéder à l&apos;Espace {selectedRole.label}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => handleLogin()}
            disabled={loading}
            className="w-full h-9 text-xs cursor-pointer font-semibold"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connexion Démo Immédiate (1-Clic)</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
