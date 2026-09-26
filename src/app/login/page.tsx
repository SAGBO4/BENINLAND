"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEMO_USERS, UserRole } from "@/lib/auth-session";
import {
  Shield,
  Building2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Copy,
  Check,
  MapPin,
  FileCheck2,
  ChevronRight,
  Scale,
  Landmark,
  ShieldCheck,
  User,
  UserPlus,
  LogIn,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";

type ActorCard = {
  role: UserRole;
  title: string;
  category: "Gouvernance & Régulation" | "Officiers Publics & Mutation" | "Opérations de Terrain" | "Citoyens & Finances";
  description: string;
  facility: string;
  cadreReglementaire: string;
  icon: typeof Shield;
  color: string;
  badge: string;
};

const ACTOR_CARDS: ActorCard[] = [
  {
    role: "MINISTERE",
    title: "Ministère du Cadre de Vie & Trésor",
    category: "Gouvernance & Régulation",
    description: "Supervision cadastrale des 12 départements, régulation domaniale et suivi en direct des recettes du Trésor Public (CUT / DGTCP).",
    facility: "Direction Générale du Domaine Foncier • Cotonou (Littoral)",
    cadreReglementaire: "Arrêté Ministériel - Tutelle Cadastrale & Régulation",
    icon: Landmark,
    color: "from-[#0a3764] to-blue-950",
    badge: "Régulation & CUT",
  },
  {
    role: "ANDF",
    title: "Agence Nationale du Domaine et du Foncier",
    category: "Gouvernance & Régulation",
    description: "Instruction républicaine des réquisitions d'immatriculation, conservation foncière, tenue du livre foncier et délivrance du CPF.",
    facility: "Direction Nationale de la Conservation Foncière • Cotonou",
    cadreReglementaire: "Loi n° 2013-01 portant Code Foncier et Domanial",
    icon: ShieldCheck,
    color: "from-blue-700 to-indigo-900",
    badge: "Délivrance Titre CPF",
  },
  {
    role: "CSAF",
    title: "Cour Spéciale des Affaires Foncières (CSAF)",
    category: "Gouvernance & Régulation",
    description: "Juridiction spécialisée exclusive sur le contentieux domanial. Ordonnances de référé, gels conservatoires et jugements opposables.",
    facility: "Siège de la Juridiction Spécialisée • Cotonou",
    cadreReglementaire: "Loi n° 2022-16 créant la Cour Spéciale des Affaires Foncières",
    icon: Scale,
    color: "from-red-700 to-rose-900",
    badge: "Gel Conservatoire",
  },
  {
    role: "NOTAIRE",
    title: "Étude Notariale Instrumentaire",
    category: "Officiers Publics & Mutation",
    description: "Réception des actes authentiques de mutation, activation du verrou notarial d'opposabilité immédiate et gestion du compte séquestre DGTCP.",
    facility: "Chambre Nationale des Notaires du Bénin • Ouidah",
    cadreReglementaire: "Monopole Légal des Actes de Mutation Immobilière",
    icon: Lock,
    color: "from-amber-600 to-yellow-800",
    badge: "Verrou Notarial",
  },
  {
    role: "AGENT",
    title: "Agent Cadastral de Terrain & Géomètre",
    category: "Opérations de Terrain",
    description: "Bornage contradictoire, relevé GPS centimétrique des polygones parcellaires, recueil des accords vocaux en langues nationales et PV.",
    facility: "Bureau Territorial du Cadre de Vie • Ouidah",
    cadreReglementaire: "Ordre des Géomètres-Experts du Bénin",
    icon: MapPin,
    color: "from-emerald-600 to-teal-800",
    badge: "Bornage GPS & Audio",
  },
  {
    role: "COMMUNE",
    title: "Mairie / Direction de l'Urbanisme",
    category: "Opérations de Terrain",
    description: "Contrôle de conformité au Plan Directeur d'Urbanisme (PDU), avis d'adressage parcellaire et liquidation des taxes communales de plus-value.",
    facility: "Direction des Services Techniques • Mairie de Ouidah",
    cadreReglementaire: "Code de l'Administration Territoriale",
    icon: Building2,
    color: "from-teal-700 to-cyan-900",
    badge: "Urbanisme & Taxes",
  },
  {
    role: "CITOYEN",
    title: "Espace Citoyen, Famille & Usagers",
    category: "Citoyens & Finances",
    description: "Carnet foncier de famille, consultation de l'état des parcelles détenues, suivi de vente sous séquestre et notification Mobile Money.",
    facility: "Collectivité Familiale Dossou • Pahou (Ouidah)",
    cadreReglementaire: "Adossé au Numéro Personnel d'Identification (NPI ANIP)",
    icon: User,
    color: "from-sky-600 to-blue-800",
    badge: "Patrimoine Familial",
  },
  {
    role: "BANQUE",
    title: "Établissement Bancaire & Prêteur Hypothécaire",
    category: "Citoyens & Finances",
    description: "Vérification en temps réel de l'inaliénabilité, levée d'état hypothécaire et inscription électronique de sûretés réelles opposables.",
    facility: "Direction des Risques & Engagements • Cotonou",
    cadreReglementaire: "Acte Uniforme OHADA portant Sûretés",
    icon: Landmark,
    color: "from-purple-700 to-indigo-900",
    badge: "Garanties & Hypothèque",
  },
  {
    role: "CONTROLEUR",
    title: "Contrôleur National des Habilitations (IGAF)",
    category: "Gouvernance & Régulation",
    description: "Instruction déontologique des demandes d'accès, validation régalienne des officiers publics et contrôle de conformité sous tutelle ministérielle.",
    facility: "Inspection Générale des Affaires Foncières • MCVDD",
    cadreReglementaire: "Mandaté par Décret Ministériel MCVDD / MEF",
    icon: ShieldCheck,
    color: "from-blue-700 to-slate-900",
    badge: "Contrôle & Habilitations",
  },
];

export default function LoginPage(): ReactNode {
  const { loginWithCredentials, registerAccount, lastLoginError, clearLoginError } = useAuth();

  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">("connexion");
  const [step, setStep] = useState<"select" | "form">("select");
  const [selectedRole, setSelectedRole] = useState<UserRole>("NOTAIRE");
  const [npi, setNpi] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Formulaire d'inscription réelle
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regNpi, setRegNpi] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("CITOYEN");
  const [regTitre, setRegTitre] = useState("");
  const [regEtablissement, setRegEtablissement] = useState("");
  const [regCommune, setRegCommune] = useState("Cotonou");
  const [regDepartement, setRegDepartement] = useState("Littoral");
  const [regPassword, setRegPassword] = useState("");
  const [regIsSubmitting, setRegIsSubmitting] = useState(false);

  // Vérifier si un rôle est passé en paramètre URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role")?.toUpperCase() as UserRole | null;
      if (roleParam && DEMO_USERS[roleParam]) {
        handleSelectActor(roleParam);
      }
    }
  }, []);

  const handleSelectActor = (role: UserRole) => {
    clearLoginError();
    setRegSuccessMsg(null);
    const user = DEMO_USERS[role] || DEMO_USERS.NOTAIRE;
    setSelectedRole(role);
    setNpi(user.npi);
    setPassword(user.password || "benin2026");
    setStep("form");
  };

  const handleResetToOfficial = () => {
    clearLoginError();
    const user = DEMO_USERS[selectedRole] || DEMO_USERS.NOTAIRE;
    setNpi(user.npi);
    setPassword(user.password || "benin2026");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginError();
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithCredentials(
        npi || DEMO_USERS[selectedRole].npi,
        selectedRole,
        password || DEMO_USERS[selectedRole].password
      );
      setIsSubmitting(false);
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginError();
    setRegSuccessMsg(null);
    setRegIsSubmitting(true);
    setTimeout(() => {
      const template = DEMO_USERS[regRole];
      const newSession = {
        npi: regNpi.trim() || `ANIP-BEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        nom: regNom.trim() || "Utilisateur",
        prenom: regPrenom.trim() || "Nouveau",
        role: regRole,
        roleLabel: template.roleLabel,
        titre: regTitre.trim() || template.titre,
        etablissementNom: regEtablissement.trim() || template.etablissementNom,
        commune: regCommune.trim() || "Cotonou",
        departement: regDepartement.trim() || "Littoral",
        badge: template.badge,
        password: regPassword.trim() || "benin2026",
      };
      const res = registerAccount(newSession);
      setRegIsSubmitting(false);
      if (res.requiresValidation) {
        setRegSuccessMsg(
          `Demande d'enrôlement enregistrée avec succès sous le NPI ${newSession.npi}. Selon la hiérarchie du système étatique, votre accès en tant que "${newSession.role}" est actuellement soumis à l'instruction et à la validation du Contrôleur National des Habilitations (IGAF sous tutelle du Ministère).`
        );
      }
    }, 400);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeCard = ACTOR_CARDS.find((c) => c.role === selectedRole) || ACTOR_CARDS[0];
  const activeUser = DEMO_USERS[selectedRole] || DEMO_USERS.NOTAIRE;
  const ActiveIcon = activeCard.icon;

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900 pt-8 pb-20 px-4 sm:px-8 lg:px-12 flex flex-col justify-center">
      {/* Sélecteur d'onglet : Connexion vs Inscription Réelle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1.5 border border-slate-300 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab("connexion")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "connexion"
                ? "bg-white text-[#0a3764] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Guichet d&apos;Accès Réglementaire</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inscription")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "inscription"
                ? "bg-[#0a3764] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Créer un Nouveau Compte</span>
          </button>
        </div>
      </div>

      {/* VUE 1 : CRÉER UN NOUVEAU COMPTE RÉEL */}
      {activeTab === "inscription" && (
        <ScaleUnblur className="max-w-2xl mx-auto w-full">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Enrôlement Foncier National • Loi 2013-01 & 2017-20</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Créer un Nouveau Compte Foncier
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Renseignez vos identifiants réels ou professionnels pour ouvrir un compte certifié et accéder immédiatement à votre espace de travail.
              </p>
            </div>

            {regSuccessMsg && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 text-xs flex items-start gap-2.5 animate-rise">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm">Demande d&apos;Enrôlement Transmise à l&apos;IGAF</div>
                  <p className="mt-1 leading-relaxed text-slate-700">{regSuccessMsg}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("connexion");
                      setRegSuccessMsg(null);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0a3764] text-white font-bold text-xs hover:bg-[#082a4d] cursor-pointer"
                  >
                    <span>Consulter le guichet d&apos;accès</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
              {/* Choix du rôle réglementaire */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Corps Professionnel ou Statut Usager *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                  required
                >
                  <option value="CITOYEN">Citoyen / Propriétaire foncier (Espace Citoyen)</option>
                  <option value="NOTAIRE">Notaire Instrumentaire (Chambre Nationale des Notaires)</option>
                  <option value="AGENT">Agent Cadastral / Géomètre de Zone (Bornage GPS)</option>
                  <option value="COMMUNE">Mairie / Direction de l&apos;Urbanisme (Affaires Domaniales)</option>
                  <option value="BANQUE">Établissement Bancaire / Prêteur (Garanties &amp; Hypothèques)</option>
                  <option value="CSAF">Cour Spéciale des Affaires Foncières (Contentieux Domanial)</option>
                  <option value="ANDF">Agence Nationale du Domaine et du Foncier (ANDF)</option>
                  <option value="CONTROLEUR">Inspecteur Contrôleur National (IGAF &bull; Tutelle Ministérielle)</option>
                  <option value="MINISTERE">Ministère du Cadre de Vie &amp; des Finances (Régulation)</option>
                </select>
              </div>

              {/* Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    value={regNom}
                    onChange={(e) => setRegNom(e.target.value)}
                    placeholder="Ex: HOUNDÉGNON"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Prénom(s) *
                  </label>
                  <input
                    type="text"
                    value={regPrenom}
                    onChange={(e) => setRegPrenom(e.target.value)}
                    placeholder="Ex: Christian"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* NPI ANIP & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Numéro Personnel d&apos;Identification (NPI) *
                  </label>
                  <input
                    type="text"
                    value={regNpi}
                    onChange={(e) => setRegNpi(e.target.value)}
                    placeholder="Ex: 2026-NPI-0089 ou ANIP..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-mono text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Votre numéro ANIP certifié</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Commune &amp; Département *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={regCommune}
                      onChange={(e) => setRegCommune(e.target.value)}
                      placeholder="Commune"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={regDepartement}
                      onChange={(e) => setRegDepartement(e.target.value)}
                      placeholder="Département"
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Titre / Structure */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Structure / Établissement / Titre professionnel
                </label>
                <input
                  type="text"
                  value={regEtablissement}
                  onChange={(e) => setRegEtablissement(e.target.value)}
                  placeholder="Ex: Étude Notariale, Mandataire familial, Société..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Mot de passe de sécurité *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Définissez un mot de passe"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={regIsSubmitting}
                className="w-full mt-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserPlus className="h-4 w-4" />
                <span>
                  {regIsSubmitting
                    ? "Création et initialisation du compte..."
                    : "Créer mon compte et ouvrir ma session"}
                </span>
              </button>
            </form>
          </div>
        </ScaleUnblur>
      )}

      {/* VUE 2 : GUICHET D'ACCÈS RÉGLEMENTAIRE (CONNEXION RAPIDE OU PAR IDENTIFIANTS) */}
      {activeTab === "connexion" && step === "select" && (
        <FadeIn className="w-full max-w-7xl mx-auto flex flex-col items-center">
          {/* En-tête Institutionnel Spacieux */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0a3764]/20 bg-[#0a3764]/5 px-4 py-1.5 text-xs font-bold text-[#0a3764] mb-4">
              <CheckCircle2 className="h-4 w-4 text-[#008751]" />
              <span>Portail National d&apos;Authentification Habilitée • Cadastre Bénin</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
              Guichet d&apos;Accès Réglementaire
            </h1>

            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Sélectionnez votre corps professionnel ou votre statut d&apos;usager pour accéder à votre console de travail habilitée par l&apos;ANDF et le Ministère du Cadre de Vie.
            </p>
          </div>

          {lastLoginError && (
            <div className="w-full max-w-2xl mb-8 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-3 animate-rise">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-sm block">Contrôle d&apos;Accès &amp; Validation IGAF</strong>
                <p className="mt-1 leading-relaxed">{lastLoginError}</p>
              </div>
            </div>
          )}

          {/* Grille Spacieuse des 8 Rôles Réglementaires (Large max-w-7xl) */}
          <ScaleUnblur className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {ACTOR_CARDS.map((card) => {
              const Icon = card.icon;
              const u = DEMO_USERS[card.role] || DEMO_USERS.NOTAIRE;

              return (
                <div
                  key={card.role}
                  onClick={() => handleSelectActor(card.role)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white hover:border-[#0a3764]/50 p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0a3764] transition-colors leading-snug">
                      {card.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium text-[11px]">Titulaire :</span>
                        <span className="font-bold text-slate-900 truncate max-w-[140px]">
                          {u?.prenom ?? ""} {u?.nom ?? ""}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-slate-500 font-medium text-[11px] shrink-0">Structure :</span>
                        <span className="text-[11px] text-slate-600 text-right line-clamp-1">
                          {u?.etablissementNom ?? card.facility}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 flex items-center justify-between border-t border-slate-100 text-xs font-bold text-[#0a3764]">
                    <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Ouvrir la session</span>
                      <ChevronRight className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {u?.commune ?? "Bénin"}
                    </span>
                  </div>
                </div>
              );
            })}
          </ScaleUnblur>

          {/* Bouton pour afficher l'annuaire officiel des comptes de test */}
          <div className="mt-12 flex flex-col items-center">
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 shadow-xs transition-colors cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-[#0a3764]" />
              <span>
                {showDirectory
                  ? "Masquer le registre officiel des comptes d'évaluation"
                  : "Consulter le registre officiel des 8 comptes et identifiants pré-configurés"}
              </span>
            </button>

            {showDirectory && (
              <div className="mt-6 w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#008751]" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Registre des Comptes et Prérogatives Foncières
                    </h4>
                  </div>
                  <span className="text-xs text-slate-600">
                    Mot de passe universel d&apos;évaluation : <code className="font-bold text-[#0a3764]">benin2026</code>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {ACTOR_CARDS.map((card) => {
                    const u = DEMO_USERS[card.role] || DEMO_USERS.NOTAIRE;
                    const isCopiedNpi = copiedKey === `${card.role}-npi`;
                    const isCopiedPass = copiedKey === `${card.role}-pass`;

                    return (
                      <div
                        key={card.role}
                        className="rounded-xl border border-slate-200/90 bg-[#f6f8fb] p-4 flex flex-col justify-between gap-3 shadow-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 truncate">{card.badge}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-700 block truncate">
                            {u?.prenom ?? ""} {u?.nom ?? ""}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                            {u?.etablissementNom ?? card.facility}
                          </span>
                        </div>

                        <div className="font-mono text-[11px] space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-sans text-[10px]">NPI :</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#0a3764] font-bold truncate max-w-[130px]">{u?.npi ?? ""}</span>
                              <button
                                onClick={() => handleCopy(u?.npi ?? "", `${card.role}-npi`)}
                                className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title="Copier le NPI"
                              >
                                {isCopiedNpi ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 font-sans text-[10px]">Pass :</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-700 font-bold">{u?.password ?? "benin2026"}</span>
                              <button
                                onClick={() => handleCopy(u?.password || "benin2026", `${card.role}-pass`)}
                                className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title="Copier le mot de passe"
                              >
                                {isCopiedPass ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectActor(card.role)}
                          className="w-full text-center text-[11px] font-bold text-[#0a3764] hover:underline pt-1 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Accéder à ce profil</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* ÉTAPE 2 : FORMULAIRE DE CONNEXION AVEC IDENTIFIANTS DE L'ACTEUR CHOISI */}
      {activeTab === "connexion" && step === "form" && (
        <ScaleUnblur className="max-w-xl mx-auto w-full">
          {/* Bouton retour vers le choix de l'acteur */}
          <button
            onClick={() => setStep("select")}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0a3764] hover:text-[#082a4d] mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Retour à la sélection des profils institutionnels</span>
          </button>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-xl flex flex-col gap-6"
          >
            {lastLoginError && (
              <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs flex items-start gap-2.5 animate-rise">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-sm block">Accès Non Autorisé / Non Validé</strong>
                  <p className="mt-1 leading-relaxed">{lastLoginError}</p>
                </div>
              </div>
            )}

            {/* Bannière du Profil Choisi */}
            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200/90 bg-[#f6f8fb]">
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${activeCard.color} flex items-center justify-center text-white shadow-xs shrink-0 mt-0.5`}
              >
                <ActiveIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800">
                    {activeCard.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 truncate mt-1">
                  {activeUser.prenom} {activeUser.nom}
                </h3>
                <p className="text-xs text-slate-600 truncate">
                  {activeUser.titre}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{activeCard.facility}</span>
                </div>
              </div>
            </div>

            {/* Champ NPI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Numéro Personnel d&apos;Identification (NPI ANIP)
                </label>
                <button
                  type="button"
                  onClick={handleResetToOfficial}
                  className="text-[11px] font-bold text-[#0a3764] hover:underline cursor-pointer"
                >
                  Rétablir l&apos;officiel
                </button>
              </div>
              <input
                type="text"
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
                placeholder={activeUser.npi}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none transition-colors"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                NPI officiel certifié par l&apos;ANIP : <strong className="font-mono text-slate-800">{activeUser.npi}</strong>
              </span>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Clé de Session Sécurisée / Mot de passe
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeUser.password}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono text-slate-900 focus:border-[#0a3764] focus:ring-1 focus:ring-[#0a3764] focus:outline-none transition-colors"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                Mot de passe officiel : <strong className="font-mono text-amber-700">{activeUser.password}</strong> (ou <em>benin2026</em>)
              </span>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 rounded-xl bg-[#0a3764] hover:bg-[#082a4d] py-3.5 text-sm font-bold text-white shadow-md shadow-[#0a3764]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="h-4 w-4" />
              <span>{isSubmitting ? "Vérification des habilitations..." : `Ouvrir la session réglementaire ${activeCard.badge}`}</span>
            </button>

            <div className="border-t border-slate-100 pt-4 text-center">
              <span className="text-xs text-slate-500">
                Structure de rattachement : <strong className="text-slate-800">{activeUser.etablissementNom}</strong> ({activeUser.commune}, {activeUser.departement})
              </span>
            </div>
          </form>
        </ScaleUnblur>
      )}

      {/* Garantie Légale et Réglementaire */}
      <div className="text-center max-w-2xl mx-auto mt-12 text-xs text-slate-500 space-y-1">
        <p>
          Plateforme opérée sous l&apos;égide du Ministère du Cadre de Vie et des Transports et de l&apos;ANDF.
        </p>
        <p>
          Conformité stricte à la Loi n° 2013-01 portant Code Foncier et Domanial et à la Loi n° 2017-20 (Code du Numérique).
        </p>
      </div>
    </main>
  );
}
