"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_DASHBOARDS, DEMO_USERS, UserRole } from "@/lib/auth-session";
import {
  LogIn,
  LogOut,
  LayoutDashboard,
  Shield,
  User,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Search,
  MapPin,
  FileText,
  Smartphone,
  PhoneCall,
  Menu,
  X,
  Lock,
  Scale,
  Building2,
  Landmark,
  FileCheck2,
  Sparkles,
  QrCode,
  Check,
} from "lucide-react";

type NavDropdownItem = {
  label: string;
  desc: string;
  href: string;
  icon: typeof Shield;
  badge?: string;
};

type NavGroup = {
  id: "cadastre" | "citoyens" | "metiers";
  label: string;
  items: NavDropdownItem[];
};

const CADASTRE_GROUP: NavGroup = {
  id: "cadastre",
  label: "CADASTRE & SIG",
  items: [
    {
      label: "Scénario Pilote Pahou",
      desc: "Traçabilité intégrale OUI-0421 : de l'accord verbal au séquestre DGTCP",
      href: "/?tab=scenario",
      icon: Sparkles,
      badge: "Démonstrateur",
    },
    {
      label: "Carte Cadastrale SIG 77 Communes",
      desc: "Cartographie interactive WGS84, bornes certifiées et statut des titres",
      href: "/carte",
      icon: MapPin,
      badge: "Leaflet SIG",
    },
    {
      label: "Supervision Ministère & Trésor (CUT)",
      desc: "Tableau de bord des 12 départements et recouvrement des recettes",
      href: "/espace/ministere",
      icon: Landmark,
      badge: "Régulation",
    },
    {
      label: "Inclusion Télécoms (SMS 132 / USSD)",
      desc: "Consultation hors-ligne par téléphone basique sans connexion internet",
      href: "/demo/telephone",
      icon: Smartphone,
      badge: "Numéro 132",
    },
  ],
};

const CITOYENS_GROUP: NavGroup = {
  id: "citoyens",
  label: "SERVICES CITOYENS",
  items: [
    {
      label: "Vérification Préalable de Parcelle",
      desc: "Contrôle public instantané avant achat : détenteur légitime et non-litige",
      href: "/verification",
      icon: Search,
      badge: "Accès Libre",
    },
    {
      label: "Carnet de Famille & Patrimoine",
      desc: "Espace personnel du citoyen adossé au Numéro Personnel d'Identification",
      href: "/espace/citoyen",
      icon: User,
      badge: "NPI ANIP",
    },
    {
      label: "Coffre-Fort Cryptographique & Actes",
      desc: "Contrôle d'intégrité mathématique SHA-256 et ancrage sur BéninChain",
      href: "/verification/actes",
      icon: FileCheck2,
      badge: "SHA-256",
    },
    {
      label: "Cour Spéciale des Affaires Foncières",
      desc: "Saisine d'urgence CSAF (Loi 2022-16) et gel conservatoire opposable",
      href: "/espace/csaf",
      icon: Scale,
      badge: "Loi 2022-16",
    },
  ],
};

const METIERS_GROUP: NavGroup = {
  id: "metiers",
  label: "ESPACES MÉTIERS",
  items: [
    {
      label: "Chambre des Notaires (Verrou Légal)",
      desc: "Pose immédiate du verrou d'opposabilité et séquestre réglementaire",
      href: "/espace/notaire",
      icon: Lock,
      badge: "Verrou Notarial",
    },
    {
      label: "Agence Nationale du Domaine (ANDF)",
      desc: "Instruction cadastrale, conservation foncière et délivrance du CPF",
      href: "/espace/andf",
      icon: ShieldCheck,
      badge: "Conservatoire",
    },
    {
      label: "Bornage de Terrain & Géomètres",
      desc: "Relevé GPS 4 bornes, accord vocal multilingue et PV contradictoire",
      href: "/espace/agent",
      icon: MapPin,
      badge: "GPS Centimétrique",
    },
    {
      label: "Mairies & Fiscalité Domaniale",
      desc: "Constat de mise en valeur, taxe sur plus-value et adressage",
      href: "/espace/commune",
      icon: Building2,
      badge: "77 Communes",
    },
    {
      label: "Banques & Sûretés Réelles",
      desc: "Consultation du registre des hypothèques et inscription de gages fonciers",
      href: "/espace/banque",
      icon: Landmark,
      badge: "Hypothèques",
    },
    {
      label: "Contrôle & Habilitations (IGAF)",
      desc: "Instruction des demandes d'habilitation, validation des officiers et déontologie",
      href: "/espace/controleur",
      icon: ShieldCheck,
      badge: "Tutelle MCVDD",
    },
  ],
};

const DEMO_ROLES: { role: UserRole; label: string; org: string }[] = [
  { role: "MINISTERE", label: "Dr. Marcel Dossou-Yovo", org: "Ministère / CUT" },
  { role: "ANDF", label: "Mme Reine Houndété", org: "Directrice ANDF" },
  { role: "NOTAIRE", label: "Me Christian Agbossou", org: "Notaire Ouidah" },
  { role: "CSAF", label: "Juge Antoine Sossa", org: "Cour Spéciale CSAF" },
  { role: "AGENT", label: "Mamadou Bio", org: "Géomètre Expert" },
  { role: "COMMUNE", label: "Sètondji Gbedji", org: "Mairie de Ouidah" },
  { role: "CITOYEN", label: "Germain Dossou", org: "Famille Propriétaire" },
  { role: "BANQUE", label: "Arnaud Kpatoukpa", org: "Banque Nationale" },
  { role: "CONTROLEUR", label: "Insp. Patrice Hounnou", org: "Contrôleur IGAF" },
];

export function Nav(): ReactNode {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loginAs } = useAuth();

  const [activeDropdown, setActiveDropdown] = useState<"cadastre" | "citoyens" | "metiers" | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Fermer les menus lors d'un clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Fermer au clavier sur la touche Échap
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fermer au changement de route
  useEffect(() => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (id: "cadastre" | "citoyens" | "metiers") => {
    setActiveDropdown((prev) => (prev === id ? null : id));
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => {
      if (!prev) {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
      return !prev;
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      if (!prev) {
        setUserDropdownOpen(false);
        setActiveDropdown(null);
      }
      return !prev;
    });
  };

  const handleRoleSelect = (role: UserRole) => {
    loginAs(role);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push(ROLE_DASHBOARDS[role]);
  };

  const dashboardUrl = user ? ROLE_DASHBOARDS[user.role] : "/login";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a3764] text-white shadow-md">
      {/* 1. Bandeau d'alerte supérieur officiel républicain */}
      <div className="w-full bg-[#06213d] border-b border-white/10 px-3 sm:px-6 py-1.5 text-[10px] sm:text-xs text-white/90 overflow-hidden">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 shrink-0">
              <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>Conformité APDP</span>
            </span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-white/80 text-[10px] sm:text-[11px] truncate hidden sm:inline">
              Loi n° 2013-01 / 2017-15 Code Foncier et Domanial • Loi 2022-16 CSAF
            </span>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <span className="text-white/60 text-[10px] hidden md:inline">
              Assistance Domaniale &amp; Cadastrale
            </span>
            <a
              href="tel:139"
              className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors py-0.5"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
              </span>
              <PhoneCall className="h-3 w-3 shrink-0" />
              <span className="hidden xs:inline">Numéro Vert Foncier 139 (Gratuit 24/7)</span>
              <span className="xs:hidden">139 Foncier</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Barre Principale de Navigation Souveraine */}
      <div
        ref={navRef}
        className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8"
      >
        {/* Marque Officielle avec Armoiries de la République du Bénin */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3.5 shrink min-w-0 group focus:outline-hidden"
          title="BENINLAND — Cadastre National & Sécurisation Foncière"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/armoiries-benin.png"
            alt="Armoiries de la République du Bénin"
            className="h-9 sm:h-12 w-auto object-contain shrink-0 drop-shadow-sm"
          />
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-2xl font-black tracking-wider text-white leading-none">
                BENINLAND
              </span>
              <span className="hidden md:inline-block h-3.5 w-px bg-white/30 mx-1" />
              <span className="hidden md:inline-block text-[10px] xl:text-[11px] font-bold text-white/90 uppercase tracking-wider">
                CADASTRE DU BÉNIN
              </span>
            </div>
            {/* Ligne Tricolore Nationale */}
            <div className="my-0.5 sm:my-1 flex h-[2px] sm:h-[2.5px] w-full rounded-full overflow-hidden shadow-xs">
              <div className="w-1/3 bg-[#008751]" />
              <div className="w-1/3 bg-[#ffbe00]" />
              <div className="w-1/3 bg-[#eb0000]" />
            </div>
            <span className="text-[7.5px] sm:text-[9.5px] font-semibold uppercase tracking-wider text-white/80 truncate">
              RÉPUBLIQUE DU BÉNIN • MINISTÈRE DU CADRE DE VIE / ANDF
            </span>
          </div>
        </Link>

        {/* Navigation Desktop Centrale */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {/* Accueil */}
          <Link
            href="/"
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg ${
              pathname === "/"
                ? "bg-white/15 text-white"
                : "text-white/90 hover:text-white hover:bg-white/10"
            }`}
          >
            Accueil
          </Link>

          {/* Dropdown 1 : Cadastre & SIG */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("cadastre")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg cursor-pointer ${
                activeDropdown === "cadastre" || pathname.startsWith("/carte") || pathname.startsWith("/demo")
                  ? "bg-white/15 text-white"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{CADASTRE_GROUP.label}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === "cadastre" ? "rotate-180 text-amber-300" : "text-white/70"
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "cadastre" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-slate-900"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Cartographie &amp; Outils Cadastraux
                    </span>
                  </div>

                  <div className="space-y-1">
                    {CADASTRE_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-[#eaf2f9] flex items-center justify-center text-[#0a3764] group-hover:bg-[#0a3764] group-hover:text-white transition-colors shrink-0 mt-0.5 shadow-xs">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0a3764] transition-colors">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0a3764] shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown 2 : Services Citoyens */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("citoyens")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg cursor-pointer ${
                activeDropdown === "citoyens" || pathname.startsWith("/verification")
                  ? "bg-white/15 text-white"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{CITOYENS_GROUP.label}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === "citoyens" ? "rotate-180 text-amber-300" : "text-white/70"
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "citoyens" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-slate-900"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Droits Fonciers &amp; Sécurisation Citoyenne
                    </span>
                  </div>

                  <div className="space-y-1">
                    {CITOYENS_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-[#eaf2f9] flex items-center justify-center text-[#0a3764] group-hover:bg-[#0a3764] group-hover:text-white transition-colors shrink-0 mt-0.5 shadow-xs">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0a3764] transition-colors">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008751] shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dropdown 3 : Espaces Métiers */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("metiers")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-lg cursor-pointer ${
                activeDropdown === "metiers" || pathname.startsWith("/espace")
                  ? "bg-white/15 text-white"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{METIERS_GROUP.label}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  activeDropdown === "metiers" ? "rotate-180 text-amber-300" : "text-white/70"
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "metiers" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 text-slate-900"
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Guichets Régaliens &amp; Acteurs Agréés
                    </span>
                  </div>

                  <div className="space-y-1">
                    {METIERS_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-[#eaf2f9] flex items-center justify-center text-[#0a3764] group-hover:bg-[#0a3764] group-hover:text-white transition-colors shrink-0 mt-0.5 shadow-xs">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0a3764] transition-colors">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Numéro Vert Foncier 139 Bouton */}
          <a
            href="tel:139"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#008751] hover:bg-[#007345] px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-xs ml-2"
            title="Ligne d'Assistance Domaniale & Numéro Vert 139"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <PhoneCall className="h-3 w-3" />
            <span>139 FONCIER</span>
          </a>
        </nav>

        {/* Espace Droite : Profil Connecté ou Accès Espace */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {user ? (
            <div className="relative">
              {/* Bouton Avatar Circulaire Haute Précision */}
              <button
                onClick={toggleUserDropdown}
                aria-expanded={userDropdownOpen}
                aria-haspopup="dialog"
                className="relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white/40 hover:border-white bg-[#3f6184] shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer overflow-hidden group focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a3764] shrink-0"
                aria-label={`Profil de ${user.prenom} ${user.nom} — Voir détails`}
                title={`${user.prenom} ${user.nom} (${user.role}) — Voir profil`}
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={`${user.prenom} ${user.nom}`}
                    className="h-full w-full object-cover rounded-full group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                      const fb = e.currentTarget.parentElement?.querySelector(".avatar-fallback");
                      if (fb) (fb as HTMLElement).style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`avatar-fallback h-full w-full rounded-full bg-gradient-to-tr from-[#0a3764] via-[#164e87] to-[#3f6184] text-white items-center justify-center font-bold text-sm tracking-wider uppercase ${
                    user.avatarUrl ? "hidden" : "flex"
                  }`}
                >
                  {user.prenom?.[0] || "U"}
                </div>
                {/* Pastille statut connectée verte républicaine */}
                <span
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#008751] border-2 border-[#0a3764] ring-1 ring-white/40 shadow-xs"
                  title="Session active & sécurisée"
                />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    {/* Backdrop assombrissant mobile pour fermer au clic */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setUserDropdownOpen(false)}
                      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
                      aria-hidden="true"
                    />

                    {/* Carte / Modal de Profil Connecté Responsive */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="fixed sm:absolute right-3 sm:right-0 top-18 sm:top-full sm:mt-2.5 w-[calc(100vw-24px)] max-w-[360px] sm:w-92 rounded-2xl border border-slate-200/90 bg-white shadow-2xl z-50 text-slate-900 overflow-hidden"
                      role="dialog"
                      aria-label="Profil utilisateur"
                    >
                      {/* Ruban Tricolore National */}
                      <div className="flex h-1 w-full shrink-0">
                        <div className="w-1/3 bg-[#008751]" />
                        <div className="w-1/3 bg-[#ffbe00]" />
                        <div className="w-1/3 bg-[#eb0000]" />
                      </div>

                      {/* En-tête de la carte avec fermeture */}
                      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Identité Cadastrale Habilitée</span>
                        </div>
                        <button
                          onClick={() => setUserDropdownOpen(false)}
                          className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                          aria-label="Fermer le profil"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Corps Profil Identité */}
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="relative h-13 w-13 rounded-full border-2 border-[#0a3764]/20 shadow-xs shrink-0 overflow-hidden bg-slate-100">
                            {user.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatarUrl}
                                alt={`${user.prenom} ${user.nom}`}
                                className="h-full w-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center font-bold text-[#0a3764] bg-[#eaf2f9] text-lg">
                                {user.prenom?.[0] || "U"}
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#008751] border-2 border-white" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {user.prenom} {user.nom}
                            </p>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[9px] font-bold uppercase tracking-wider">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>{user.role}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1 mt-1 font-medium">
                              {user.titre}
                            </p>
                            <p className="text-[11px] text-[#0a3764] font-semibold truncate mt-0.5">
                              {user.etablissementNom}
                            </p>
                          </div>
                        </div>

                        {/* NPI & Commune */}
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-slate-500 text-[10px]">NPI :</span>
                            <span className="font-mono font-bold text-slate-800 text-[10px] truncate">{user.npi}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium shrink-0 ml-1">
                            {user.commune} ({user.departement})
                          </span>
                        </div>
                      </div>

                      {/* Sélecteur de rôle instantané pour tests / démonstrateur */}
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                          Basculer vers un autre rôle (Démo) :
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {DEMO_ROLES.map((r) => {
                            const isCurrent = user.role === r.role;
                            return (
                              <button
                                key={r.role}
                                onClick={() => handleRoleSelect(r.role)}
                                className={`flex items-center justify-between p-1.5 rounded-lg text-left text-[11px] font-semibold transition-colors cursor-pointer ${
                                  isCurrent
                                    ? "bg-[#0a3764] text-white"
                                    : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                                }`}
                              >
                                <span className="truncate">{r.role}</span>
                                {isCurrent && <Check className="h-3 w-3 shrink-0 ml-1" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions rapides */}
                      <div className="p-3 pt-2 space-y-1">
                        <Link
                          href={dashboardUrl}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between w-full rounded-xl px-3.5 py-2.5 text-xs text-white bg-[#0a3764] hover:bg-[#082a4d] transition-colors font-bold shadow-xs group"
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="h-4 w-4 shrink-0 text-amber-300" />
                            <span>Mon Tableau de bord</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        <Link
                          href="/verification"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full rounded-xl px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium"
                        >
                          <Search className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Vérification publique de parcelle</span>
                        </Link>
                      </div>

                      {/* Déconnexion */}
                      <div className="p-3 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-bold text-left cursor-pointer"
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-[40px] sm:min-h-[44px] items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#3f6184] hover:bg-[#4a729c] px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-white border border-white/20 shadow-sm transition-all duration-200 active:scale-95 shrink-0"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">ACCÉDER À MON ESPACE</span>
              <span className="sm:hidden text-[11px]">CONNEXION</span>
            </Link>
          )}

          {/* Bouton Menu Mobile Ergonomique (44x44px accessible) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Ligne Tricolore Officielle sur Toute la Largeur */}
      <div className="flex h-1 w-full shadow-xs">
        <div className="w-1/3 bg-[#008751]" />
        <div className="w-1/3 bg-[#ffbe00]" />
        <div className="w-1/3 bg-[#eb0000]" />
      </div>

      {/* Menu Mobile Déroulant avec Volet Latéral Ergonomique (Slide Drawer) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop assombrissant fermant au toucher */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
              aria-hidden="true"
            />

            {/* Volet Latéral Ergonomique Slide-In */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-full max-w-[340px] sm:max-w-md bg-white shadow-2xl z-50 flex flex-col justify-between overflow-hidden text-slate-900 border-l border-slate-200"
            >
              {/* Entête du tiroir avec Armoiries et bouton fermer */}
              <div className="flex items-center justify-between p-4 bg-[#0a3764] text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/armoiries-benin.png"
                    alt="Armoiries du Bénin"
                    className="h-8 w-auto object-contain"
                  />
                  <div>
                    <span className="text-base font-black tracking-wider block leading-tight">
                      BENINLAND
                    </span>
                    <span className="text-[9px] text-white/80 uppercase font-semibold">
                      Cadastre &amp; Sécurisation Foncière
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Ligne Tricolore */}
              <div className="flex h-1 w-full shrink-0">
                <div className="w-1/3 bg-[#008751]" />
                <div className="w-1/3 bg-[#ffbe00]" />
                <div className="w-1/3 bg-[#eb0000]" />
              </div>

              {/* Carte profil utilisateur si connecté */}
              {user && (
                <div className="p-3 mx-4 mt-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-10 w-10 rounded-full border border-slate-200 overflow-hidden shrink-0 bg-white">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt={`${user.prenom} ${user.nom}`}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-bold text-[#0a3764] bg-[#eaf2f9] text-xs">
                          {user.prenom[0]}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#008751] border border-white" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {user.prenom} {user.nom}
                      </span>
                      <span className="text-[10px] text-[#0a3764] font-semibold uppercase tracking-wider block truncate">
                        {user.role} • {user.etablissementNom}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={dashboardUrl}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#0a3764] text-white text-[11px] font-bold shrink-0 hover:bg-[#072544] transition-colors flex items-center gap-1"
                  >
                    <span>Dossier</span>
                  </Link>
                </div>
              )}

              {/* Contenu Défilable du Tiroir */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
                {/* 1. Cadastre & SIG */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                    <MapPin className="h-3.5 w-3.5 text-[#0a3764]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {CADASTRE_GROUP.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {CADASTRE_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#0a3764] shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0a3764] shrink-0 ml-1">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Services Citoyens */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {CITOYENS_GROUP.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {CITOYENS_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0 ml-1">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Espaces Métiers */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b border-slate-100">
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {METIERS_GROUP.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {METIERS_GROUP.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-800 shrink-0">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-800 block truncate">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {item.desc}
                              </span>
                            </div>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 shrink-0 ml-1">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Sélecteur de rôle mobile rapide */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                    Changer de profil d&apos;exercice :
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {DEMO_ROLES.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => handleRoleSelect(r.role)}
                        className={`min-h-[40px] px-2 py-1.5 rounded-lg text-left text-[11px] font-semibold transition-colors cursor-pointer ${
                          user?.role === r.role
                            ? "bg-[#0a3764] text-white"
                            : "bg-white border border-slate-200 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <span className="block truncate">{r.role}</span>
                        <span className="block text-[9px] opacity-75 truncate">{r.org}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pied du volet mobile */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
                <a
                  href="tel:139"
                  className="min-h-[44px] flex items-center justify-center gap-2 w-full rounded-xl bg-[#008751] hover:bg-[#007345] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Numéro Vert Foncier 139 (Gratuit 24/7)</span>
                </a>

                {user ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="min-h-[44px] flex items-center justify-center gap-2 w-full rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion de session</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center justify-center gap-2 w-full rounded-xl bg-[#0a3764] text-white text-xs font-bold hover:bg-[#072545] transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Connexion à l&apos;Espace Sécurisé</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
