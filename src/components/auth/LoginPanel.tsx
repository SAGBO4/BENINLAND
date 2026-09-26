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
  ShieldCheck,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShinyText } from "@/components/reactbits/ShinyText";

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
    id: "notaire",
    label: "Notaire",
    roleCode: "notaire",
    category: "etat",
    email: "notaire@demo.bj",
    npi: "FICTIF-BEN-2026-0088",
    name: "Me Christian Agbossou",
    icon: FileSpreadsheet,
    badge: "Mutation & Verrou 🔒",
    badgeVariant: "default",
    targetUrl: "/espace/notaire",
    flowDescription: "Ouverture d'acte de cession, pose du verrou anti-double-vente et séquestre MoMo.",
  },
  {
    id: "andf",
    label: "ANDF",
    roleCode: "andf",
    category: "etat",
    email: "andf@demo.bj",
    npi: "FICTIF-BEN-2026-0012",
    name: "Mme Reine Houndété",
    icon: ShieldAlert,
    badge: "Validation Titre CPF",
    badgeVariant: "info",
    targetUrl: "/espace/andf",
    flowDescription: "Instruction républicaine, contrôle cadastral et délivrance du Certificat de Propriété.",
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
    flowDescription: "Saisine pour litige foncier, ordonnance de blocage d'urgence et gel immédiat.",
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
    badge: "Convention Villageoise",
    badgeVariant: "warning",
    targetUrl: "/espace/agent",
    flowDescription: "Levé GPS des 4 bornes, recueil des accords vocaux en Fongbe/Yoruba et signature.",
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
    flowDescription: "Constat des constructions, calcul de la plus-value communale et adressage.",
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
    flowDescription: "Carnet de famille foncier, suivi de la vente OUI-0421 et réception des fonds MoMo.",
  },
  {
    id: "banque",
    label: "Banque / Crédit",
    roleCode: "banque",
    category: "finance",
    email: "banque@demo.bj",
    npi: "FICTIF-BEN-2026-0700",
    name: "Banque Nationale Bénin",
    icon: Landmark,
    badge: "Hypothèque & Sécurité",
    badgeVariant: "info",
    targetUrl: "/espace/banque",
    flowDescription: "Authentification du titre foncier et inscription de garantie hypothécaire.",
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
    <Card className="border-primary/30 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-card/95">
      {/* Halo or discret en arrière-plan */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="p-5 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
            <KeyRound className="w-4 h-4 text-secondary" />
            <span>Portail National Sécurisé</span>
          </div>
          <Badge variant="secondary" className="text-[11px] gap-1 px-2 py-0.5">
            <Sparkles className="w-3 h-3 text-secondary" />
            <ShinyText text="8 Profils Actifs" speed={3} />
          </Badge>
        </div>

        <div>
          <CardTitle className="text-lg sm:text-xl font-bold">
            Connexion &amp; Flux Associés
          </CardTitle>
          <CardDescription className="text-xs">
            Sélectionnez un acteur ci-dessous pour tester son interface et son rôle légal dans le foncier béninois.
          </CardDescription>
        </div>

        {/* Filtres de catégories rapides pour aérer l'interface */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            Tous (8)
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
            <span>Village &amp; Mairie</span>
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
        {/* Grille sélecteur de rôles avec taille responsive équilibrée */}
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
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25 scale-[1.02]"
                    : "bg-background/70 hover:bg-background border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <RoleIcon className={`w-4 h-4 mb-1 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                <span className="text-xs font-bold leading-tight truncate max-w-full">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Fiche de présentation du rôle et de son flux légal */}
        <div className="p-3.5 rounded-xl bg-background/80 border border-border/80 space-y-2">
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
            <Badge variant={selectedRole.badgeVariant} className="text-[10px] shrink-0">
              {selectedRole.badge}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            <span className="font-semibold text-foreground">Flux opérationnel : </span>
            {selectedRole.flowDescription}
          </div>
        </div>

        {/* Formulaire & boutons d'action rapide */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Email :</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Mot de passe :</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-8 text-xs pr-7 font-mono"
                />
                <Lock className="w-3 h-3 text-muted-foreground absolute right-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-sm font-bold flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Accéder au Flux {selectedRole.label}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => handleLogin()}
            disabled={loading}
            className="w-full h-9 text-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Connexion Démo 1-Clic</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
