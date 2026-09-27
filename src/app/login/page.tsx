"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { DEMO_USERS, UserRole } from "@/lib/auth-session";
import {
  Shield,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  UserPlus,
  LogIn,
  Sparkles,
  HelpCircle,
  Scale,
  Compass,
  Building2,
  Landmark,
} from "lucide-react";
import Link from "next/link";

const BENIN_DEPARTEMENTS = [
  "Littoral",
  "Atlantique",
  "Ouémé",
  "Plateau",
  "Zou",
  "Collines",
  "Mono",
  "Couffo",
  "Borgou",
  "Alibori",
  "Atacora",
  "Donga",
];

const ROLES_OPTIONS: { role: UserRole; label: string; desc: string; category: string }[] = [
  { role: "MINISTERE", label: "Ministère du Cadre de Vie & Trésor (DGTCP)", desc: "Supervision cadastrale & CUT", category: "Gouvernance & Régulation" },
  { role: "ANDF", label: "Agence Nationale du Domaine et du Foncier (ANDF)", desc: "Conservation foncière & délivrance CPF", category: "Gouvernance & Régulation" },
  { role: "CSAF", label: "Cour Spéciale des Affaires Foncières (CSAF)", desc: "Contentieux domanial & ordonnances", category: "Gouvernance & Régulation" },
  { role: "NOTAIRE", label: "Étude Notariale Instrumentaire", desc: "Actes authentiques & verrou notarial", category: "Officiers Publics & Mutation" },
  { role: "AGENT", label: "Agent Cadastral / Géomètre de Zone", desc: "Bornage GPS & procès-verbaux", category: "Opérations de Terrain" },
  { role: "COMMUNE", label: "Mairie / Direction de l'Urbanisme", desc: "Conformité PDU & taxes locales", category: "Opérations de Terrain" },
  { role: "CITOYEN", label: "Espace Citoyen, Famille & Usagers", desc: "Patrimoine foncier & carnet de famille", category: "Citoyens & Finances" },
  { role: "BANQUE", label: "Établissement Bancaire & Prêteur", desc: "Hypothèques & sûretés réelles", category: "Citoyens & Finances" },
  { role: "CONTROLEUR", label: "Contrôleur National des Habilitations (IGAF)", desc: "Instruction & déontologie", category: "Gouvernance & Régulation" },
];

export default function LoginPage(): ReactNode {
  const { loginWithCredentials, registerAccount, lastLoginError, clearLoginError } = useAuth();

  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">("connexion");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Formulaire Connexion
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "AUTO">("AUTO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Formulaire Inscription
  const [regRole, setRegRole] = useState<UserRole>("CITOYEN");
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regNpi, setRegNpi] = useState("");
  const [regTelephone, setRegTelephone] = useState("");
  const [regDepartement, setRegDepartement] = useState("Atlantique");
  const [regCommune, setRegCommune] = useState("Ouidah");
  const [regEtablissement, setRegEtablissement] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [regIsSubmitting, setRegIsSubmitting] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);
  const [regErrorMsg, setRegErrorMsg] = useState<string | null>(null);

  // Pré-remplissage via URL ?role=... ou ?tab=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "inscription") {
        setActiveTab("inscription");
      }
      const roleParam = params.get("role")?.toUpperCase() as UserRole | null;
      if (roleParam && DEMO_USERS[roleParam]) {
        setSelectedRole(roleParam);
        setIdentifier(DEMO_USERS[roleParam].npi);
        setPassword(DEMO_USERS[roleParam].password || "benin2026");
      }
    }
  }, []);

  // Détection / Remplissage rapide de test
  const handleQuickFill = (role: UserRole) => {
    clearLoginError();
    const demo = DEMO_USERS[role];
    if (demo) {
      setSelectedRole(role);
      setIdentifier(demo.npi);
      setPassword(demo.password || "benin2026");
    }
  };

  // Soumission Connexion
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginError();
    setIsSubmitting(true);

    try {
      const roleToUse = selectedRole === "AUTO" ? undefined : selectedRole;
      await loginWithCredentials(identifier.trim(), roleToUse, password.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission Inscription
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearLoginError();
    setRegErrorMsg(null);
    setRegSuccessMsg(null);

    if (regPassword !== regConfirmPassword) {
      setRegErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (regPassword.length < 6) {
      setRegErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (!acceptTerms) {
      setRegErrorMsg("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setRegIsSubmitting(true);

    try {
      const template = DEMO_USERS[regRole] || DEMO_USERS.CITOYEN;
      const cleanNpi =
        regNpi.trim() || `BEN-${regDepartement.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const newSession = {
        npi: cleanNpi,
        nom: regNom.trim().toUpperCase(),
        prenom: regPrenom.trim(),
        role: regRole,
        roleLabel: template.roleLabel,
        titre: regEtablissement.trim() || template.titre,
        etablissementNom: regEtablissement.trim() || `${template.etablissementNom} (${regCommune})`,
        commune: regCommune.trim() || "Cotonou",
        departement: regDepartement.trim() || "Littoral",
        telephone: regTelephone.trim() || undefined,
        badge: template.badge,
        password: regPassword.trim(),
      };

      const res = await registerAccount(newSession);

      if (res.requiresValidation) {
        setRegSuccessMsg(
          `Votre demande d'inscription sous le NPI ${cleanNpi} a été enregistrée avec succès dans la base foncière. En tant qu'officier ou acteur institutionnel (${regRole}), votre accès est soumis à l'habilitation régalienne de l'Inspection Générale des Affaires Foncières (IGAF).`
        );
      }
    } catch (err: any) {
      setRegErrorMsg(err.message || "Erreur lors de la création du compte.");
    } finally {
      setRegIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Navigation retour ergonomique alignée avec le formulaire */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0a3764] transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/70 w-fit group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Retour à l&apos;accueil Anyigba</span>
          </Link>
        </div>

        {/* Header institutionnel épuré */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Connexion à votre Espace Foncier
          </h1>
          <p className="text-xs text-slate-500 mt-1.5">
            ANYIGBA • Système National de Sécurisation Foncière &bull; République du Bénin
          </p>
        </div>

        {/* Boîte Principale d'Authentification Normale */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-slate-200/90">
          {/* Onglets Normaux : Connexion / Inscription */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("connexion");
                clearLoginError();
              }}
              className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "connexion"
                  ? "border-[#0a3764] text-[#0a3764]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Connexion</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("inscription");
                clearLoginError();
                setRegSuccessMsg(null);
                setRegErrorMsg(null);
              }}
              className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "inscription"
                  ? "border-[#0a3764] text-[#0a3764]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>Inscription</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* ONGLET 1 : CONNEXION NORMALE                                */}
          {/* ============================================================ */}
          {activeTab === "connexion" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Message d'erreur de connexion */}
              {lastLoginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{lastLoginError}</div>
                </div>
              )}

              {/* Champ Identifiant ou NPI */}
              <div>
                <label htmlFor="login-identifier" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Identifiant ou NPI ANIP
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="login-identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (lastLoginError) clearLoginError();
                    }}
                    placeholder="Ex: FICTIF-BEN-2026-0088 ou votre NPI"
                    className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-xs font-medium text-[#0a3764] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Aide connexion</span>
                    <HelpCircle className="h-3 w-3" />
                  </button>
                </div>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (lastLoginError) clearLoginError();
                    }}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Options : Se souvenir de moi */}
              <div className="flex items-center justify-between pt-1">
                <label htmlFor="login-remember-me" className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="login-remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0a3764] focus:ring-[#0a3764]"
                  />
                  <span className="text-xs text-slate-600">Se souvenir de moi</span>
                </label>
              </div>

              {/* Bouton Principal de Connexion */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0a3764] hover:bg-[#082a4d] text-white text-sm font-bold shadow-md shadow-[#0a3764]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                <span>{isSubmitting ? "Connexion en cours..." : "Se connecter"}</span>
              </button>

              {/* Sélecteur Rapide Discret de Comptes de Test */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Remplissage rapide (démonstration) :</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("CITOYEN")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3 h-3 text-slate-600" />
                    <span>Citoyen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("NOTAIRE")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-3 h-3 text-slate-600" />
                    <span>Notaire</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("AGENT")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-3 h-3 text-slate-600" />
                    <span>Géomètre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("COMMUNE")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3 h-3 text-slate-600" />
                    <span>Mairie</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("ANDF")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <Shield className="w-3 h-3 text-slate-600" />
                    <span>ANDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill("BANQUE")}
                    className="px-2 py-1.5 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center truncate flex items-center justify-center gap-1.5"
                  >
                    <Landmark className="w-3 h-3 text-slate-600" />
                    <span>Banque</span>
                  </button>
                </div>
              </div>

              {/* Lien vers Inscription */}
              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Vous n&apos;avez pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("inscription");
                      clearLoginError();
                    }}
                    className="font-bold text-[#0a3764] hover:underline cursor-pointer"
                  >
                    S&apos;inscrire
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* ONGLET 2 : INSCRIPTION NORMALE                              */}
          {/* ============================================================ */}
          {activeTab === "inscription" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Message de succès d'inscription */}
              {regSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-sm mb-1 text-emerald-800">
                      Demande enregistrée avec succès
                    </strong>
                    <p className="leading-relaxed">{regSuccessMsg}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("connexion");
                        setRegSuccessMsg(null);
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-lg bg-[#0a3764] text-white text-xs font-bold hover:bg-[#082a4d] cursor-pointer"
                    >
                      Aller à la connexion
                    </button>
                  </div>
                </div>
              )}

              {/* Message d'erreur d'inscription */}
              {regErrorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{regErrorMsg}</span>
                </div>
              )}

              {/* Type de compte / Rôle */}
              <div>
                <label htmlFor="reg-role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Type de compte *
                </label>
                <select
                  id="reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="block w-full px-3 py-2.5 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900 bg-white"
                  required
                >
                  <optgroup label="Citoyens & Finances">
                    {ROLES_OPTIONS.filter((o) => o.category === "Citoyens & Finances").map((opt) => (
                      <option key={opt.role} value={opt.role}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Officiers Publics & Mutation">
                    {ROLES_OPTIONS.filter((o) => o.category === "Officiers Publics & Mutation").map((opt) => (
                      <option key={opt.role} value={opt.role}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Opérations de Terrain">
                    {ROLES_OPTIONS.filter((o) => o.category === "Opérations de Terrain").map((opt) => (
                      <option key={opt.role} value={opt.role}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Gouvernance & Régulation">
                    {ROLES_OPTIONS.filter((o) => o.category === "Gouvernance & Régulation").map((opt) => (
                      <option key={opt.role} value={opt.role}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {regRole === "CITOYEN"
                    ? "Accès immédiat après création de votre compte."
                    : "Habilitation d'officier soumise à validation du Contrôleur IGAF."}
                </span>
              </div>

              {/* Nom & Prénom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-nom" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nom *
                  </label>
                  <input
                    id="reg-nom"
                    type="text"
                    required
                    value={regNom}
                    onChange={(e) => setRegNom(e.target.value)}
                    placeholder="Ex: HOUNDÉGNON"
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="reg-prenom" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Prénom(s) *
                  </label>
                  <input
                    id="reg-prenom"
                    type="text"
                    required
                    value={regPrenom}
                    onChange={(e) => setRegPrenom(e.target.value)}
                    placeholder="Ex: Christian"
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                  />
                </div>
              </div>

              {/* NPI ANIP & Téléphone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-npi" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    NPI ANIP *
                  </label>
                  <input
                    id="reg-npi"
                    type="text"
                    required
                    value={regNpi}
                    onChange={(e) => setRegNpi(e.target.value)}
                    placeholder="Ex: ANIP-2026-..."
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="reg-telephone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Téléphone (MoMo)
                  </label>
                  <div className="relative">
                    <input
                      id="reg-telephone"
                      type="tel"
                      value={regTelephone}
                      onChange={(e) => setRegTelephone(e.target.value)}
                      placeholder="+229 97 00 00 00"
                      className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Département & Commune */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-departement" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Département *
                  </label>
                  <select
                    id="reg-departement"
                    value={regDepartement}
                    onChange={(e) => setRegDepartement(e.target.value)}
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900 bg-white"
                  >
                    {BENIN_DEPARTEMENTS.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-commune" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Commune *
                  </label>
                  <input
                    id="reg-commune"
                    type="text"
                    required
                    value={regCommune}
                    onChange={(e) => setRegCommune(e.target.value)}
                    placeholder="Ex: Ouidah, Cotonou..."
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                  />
                </div>
              </div>

              {/* Structure / Établissement (si rôle professionnel) */}
              {regRole !== "CITOYEN" && (
                <div>
                  <label htmlFor="reg-etablissement" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Structure / Établissement / Charge
                  </label>
                  <input
                    id="reg-etablissement"
                    type="text"
                    value={regEtablissement}
                    onChange={(e) => setRegEtablissement(e.target.value)}
                    placeholder="Ex: Étude Notariale Agbossou, Mairie de Ouidah, Cabinet..."
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                  />
                </div>
              )}

              {/* Mot de passe & Confirmation */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 caractères"
                      className="block w-full px-3 py-2 pr-8 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirmer *
                  </label>
                  <input
                    id="reg-confirm-password"
                    type={showRegPassword ? "text" : "password"}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Répétez"
                    className="block w-full px-3 py-2 sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0a3764] focus:border-[#0a3764] text-slate-900"
                  />
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="pt-1">
                <label htmlFor="reg-accept-terms" className="flex items-start gap-2 cursor-pointer">
                  <input
                    id="reg-accept-terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#0a3764] focus:ring-[#0a3764] mt-0.5"
                  />
                  <span className="text-[11px] text-slate-600 leading-tight">
                    J&apos;atteste l&apos;exactitude des informations fournies conformément à la Loi n° 2013-01 portant Code Foncier et Domanial.
                  </span>
                </label>
              </div>

              {/* Bouton Créer le Compte */}
              <button
                type="submit"
                disabled={regIsSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                <span>{regIsSubmitting ? "Création du compte..." : "Créer mon compte"}</span>
              </button>

              {/* Déjà un compte ? */}
              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Vous avez déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("connexion");
                      clearLoginError();
                    }}
                    className="font-bold text-[#0a3764] hover:underline cursor-pointer"
                  >
                    Se connecter
                  </button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal d'aide / FAQ de connexion */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#0a3764]" />
              <span>Aide à la Connexion Anyigba</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              La plateforme utilise le Numéro Personnel d&apos;Identification (NPI) délivré par l&apos;ANIP ou votre identifiant de fonction.
            </p>
            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 mb-4">
              <div>
                <strong>Compte citoyen :</strong> NPI <code className="font-mono text-[#0a3764]">FICTIF-BEN-2026-0041</code>
              </div>
              <div>
                <strong>Compte notaire :</strong> NPI <code className="font-mono text-[#0a3764]">FICTIF-BEN-2026-0088</code>
              </div>
              <div>
                <strong>Mot de passe universel démo :</strong> <code className="font-mono text-amber-700">benin2026</code>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0a3764] text-white text-xs font-bold hover:bg-[#082a4d] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer institutionnel épuré */}
      <div className="text-center mt-8 text-xs text-slate-500">
        <p>République du Bénin • Ministère du Cadre de Vie et des Transports &bull; ANDF</p>
      </div>
    </div>
  );
}
