"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/auth-context";
import { UserRole } from "@/lib/auth-session";
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  MapPin,
  CheckCircle,
  PhoneCall,
  Search,
  ChevronRight,
  Scale,
  Landmark,
  FileCheck2,
  Smartphone,
  Sparkles,
  ExternalLink,
  User,
  Radio,
  FileText,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { FadeIn, ScaleUnblur } from "@/components/ui/motion-primitives";
import { Footer } from "@/components/layout/Footer";

// Chargement dynamique de la carte et du scénario pour éviter tout blocage SSR
const CadastreLeafletMap = dynamic(
  () => import("@/components/carte/CadastreLeafletMap").then((m) => m.CadastreLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[580px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-3 border border-slate-200">
        <div className="h-9 w-9 rounded-full border-3 border-[#0a3764] border-t-transparent animate-spin" />
        <span className="text-xs font-mono font-medium text-slate-700">
          Chargement du Système d&apos;Information Géographique (SIG) National WGS84...
        </span>
      </div>
    ),
  }
);

const InteractiveScenario = dynamic(
  () => import("@/components/scenario/InteractiveScenario").then((m) => m.InteractiveScenario),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-80 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-500 gap-2 border border-slate-200">
        <div className="h-7 w-7 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        <span className="text-xs font-mono">Chargement du démonstrateur interactif de mutation...</span>
      </div>
    ),
  }
);

type ServiceItem = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  tarif: string;
  delai: string;
  link: string;
  icon: typeof ShieldCheck;
};

const SERVICES_EN_LIGNE: ServiceItem[] = [
  {
    id: "tf-cpf",
    category: "Conservation Foncière ANDF",
    title: "Délivrance de Titre Foncier / CPF",
    subtitle: "Immatriculation définitive et scellé régalien inattaquable au Livre Foncier national.",
    tarif: "Barème réglementé ANDF",
    delai: "Sous 30 à 60 jours",
    link: "/espace/andf",
    icon: ShieldCheck,
  },
  {
    id: "bornage-gps",
    category: "Opérations de Terrain & Géomètres",
    title: "Procès-Verbal de Bornage Contradictoire",
    subtitle: "Levé GPS centimétrique des 4 bornes, contrôle d'absence de chevauchement et accord vocal multilingue.",
    tarif: "Tarif conventionné géomètres",
    delai: "Constat contradictoire sur site",
    link: "/espace/agent",
    icon: MapPin,
  },
  {
    id: "verrou-opposable",
    category: "Sécurisation Juridique Immédiate",
    title: "Verrou Notarial d'Opposabilité",
    subtitle: "Blocage informatique instantané dès le compromis d'achat pour interdire toute double vente.",
    tarif: "0 FCFA d'avance (Inclus à l'acte)",
    delai: "Immédiat (< 30 secondes)",
    link: "/espace/notaire",
    icon: Lock,
  },
  {
    id: "attestation-csaf",
    category: "Contrôle Juridictionnel d'Urgence",
    title: "Attestation de Non-Litige CSAF",
    subtitle: "Contrôle formel d'absence d'instance contentieuse devant la Cour Spéciale des Affaires Foncières.",
    tarif: "Droit de greffe réglementé",
    delai: "Délivrance sous 24h",
    link: "/espace/csaf",
    icon: Scale,
  },
  {
    id: "sequestre-dgtcp",
    category: "Sécurisation Financière Publique",
    title: "Séquestre Trésor & Mutation CUT",
    subtitle: "Consignation des fonds d'acquisition au Compte Unique du Trésor et libération après enregistrement légal.",
    tarif: "Séquestre d'État TrésorPay",
    delai: "Horodatage temps réel",
    link: "/espace/ministere",
    icon: Landmark,
  },
  {
    id: "verification-libre",
    category: "Transparence Domaniale Publique",
    title: "Consultation Cadastrale Publique",
    subtitle: "Vérification gratuite de l'état légal d'une parcelle, détection de litige et identité du détenteur enregistré.",
    tarif: "Service Public Gratuit",
    delai: "Instantané 24h/24",
    link: "/verification",
    icon: Search,
  },
];

type FeatureCard = {
  id: string;
  badge: string;
  referenceLegale: string;
  title: string;
  description: string;
  facility: string;
  icon: typeof ShieldCheck;
  color: string;
  accent: string;
  link: string;
};

const PILIERS: FeatureCard[] = [
  {
    id: "code-foncier",
    badge: "Loi Fondatrice de la République",
    referenceLegale: "Loi n° 2013-01 modifiée par la Loi n° 2017-15",
    title: "Code Foncier et Domanial Rénové",
    description:
      "Unification du régime juridique de la propriété : suppression progressive de l'insécurité coutumière au profit du Certificat de Propriété Foncière (CPF) et du Titre Foncier inattaquable et définitif.",
    facility: "Applicable sur l'ensemble des 77 communes du Bénin",
    icon: ShieldCheck,
    color: "from-[#0a3764] to-blue-900",
    accent: "text-[#0a3764]",
    link: "/verification",
  },
  {
    id: "verrou-notarial",
    badge: "Règle d'Or Anti-Fraude",
    referenceLegale: "Décret d'application & Règlementation Notariale",
    title: "Verrou Notarial Opposable & Zéro Double Vente",
    description:
      "Dès la conclusion du compromis chez le notaire instrumentaire, la parcelle est instantanément verrouillée au registre national. Toute tentative de transaction concurrente sur la même assiette est rejetée en temps réel.",
    facility: "Interconnexion temps réel Chambre des Notaires & ANDF",
    icon: Lock,
    color: "from-amber-600 to-yellow-800",
    accent: "text-amber-700",
    link: "/espace/notaire",
  },
  {
    id: "csaf-juridiction",
    badge: "Justice Domaniale Spécialisée",
    referenceLegale: "Loi n° 2022-16 portant création de la Cour Spéciale",
    title: "Juridiction d'Exception & Gel Conservatoire (CSAF)",
    description:
      "Fin des lenteurs judiciaires et de l'incertitude : les litiges fonciers relèvent exclusivement de magistrats spécialisés. Dès la saisine, une ordonnance de blocage d'urgence neutralise la parcelle au cadastre pour protéger les justiciables.",
    facility: "Compétence exclusive sur les départements à forte pression foncière",
    icon: Scale,
    color: "from-red-600 to-rose-800",
    accent: "text-red-600",
    link: "/espace/csaf",
  },
  {
    id: "inclusion-telecom",
    badge: "Équité Territoriale & Citoyenne",
    referenceLegale: "Stratégie Nationale d'Inclusion Numérique du Foncier",
    title: "Inclusion Rurale, Multilingue & Télécoms (132)",
    description:
      "Le droit à la terre pour chaque Béninois, avec ou sans smartphone : consultation de l'état foncier par simple SMS au 132, menu interactif USSD *132# et attestation vocale en langues nationales (Fongbe, Yoruba, Bariba, Dendi).",
    facility: "Accessible sur tous les réseaux mobiles nationaux 24h/24",
    icon: Smartphone,
    color: "from-emerald-600 to-teal-800",
    accent: "text-[#008751]",
    link: "/demo/telephone",
  },
];

const ACTORS_SHORTCUTS = [
  {
    role: "MINISTERE" as UserRole,
    name: "Ministère",
    roleLabel: "Supervision & Trésor",
    subtext: "12 Dép. & Recettes CUT",
    icon: Landmark,
    color: "text-[#0a3764]",
    bg: "bg-blue-500/10",
  },
  {
    role: "ANDF" as UserRole,
    name: "ANDF",
    roleLabel: "Conservation Foncière",
    subtext: "Instruction & Titres CPF",
    icon: ShieldCheck,
    color: "text-blue-700",
    bg: "bg-blue-600/10",
  },
  {
    role: "NOTAIRE" as UserRole,
    name: "Notaire",
    roleLabel: "Mutation & Verrou",
    subtext: "Opposabilité & Séquestre",
    icon: Lock,
    color: "text-amber-700",
    bg: "bg-amber-500/10",
  },
  {
    role: "CSAF" as UserRole,
    name: "Cour Spéciale",
    roleLabel: "Contentieux Domanial",
    subtext: "Gel Conservatoire",
    icon: Scale,
    color: "text-red-700",
    bg: "bg-red-500/10",
  },
  {
    role: "AGENT" as UserRole,
    name: "Agent Foncier",
    roleLabel: "Bornage Contradictoire",
    subtext: "GPS 4 Bornes & Voix",
    icon: MapPin,
    color: "text-emerald-700",
    bg: "bg-emerald-500/10",
  },
  {
    role: "COMMUNE" as UserRole,
    name: "Mairie",
    roleLabel: "Urbanisme & Taxes",
    subtext: "Plus-value & Adressage",
    icon: Building2,
    color: "text-teal-700",
    bg: "bg-teal-500/10",
  },
  {
    role: "CITOYEN" as UserRole,
    name: "Citoyen",
    roleLabel: "Patrimoine Familial",
    subtext: "Parcelle OUI-0421",
    icon: User,
    color: "text-sky-700",
    bg: "bg-sky-500/10",
  },
  {
    role: "BANQUE" as UserRole,
    name: "Banque",
    roleLabel: "Crédit & Hypothèque",
    subtext: "Sûretés Inaliénables",
    icon: Landmark,
    color: "text-purple-700",
    bg: "bg-purple-500/10",
  },
];

export default function HomePage(): ReactNode {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/verification?q=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
    } else {
      router.push("/verification");
    }
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    loginAs(role);
  };

  return (
    <main id="main-content" className="flex flex-1 flex-col overflow-x-hidden w-full max-w-full bg-[#f6f8fb] text-slate-900">
      {/* 1. HERO SECTION GRANDIOSE AVEC IMAGE DE PARCELLES EN BACKGROUND */}
      <section className="relative w-full pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 lg:px-12 border-b border-slate-200/90 overflow-hidden">
        {/* Image de fond de parcelles réelles en République du Bénin */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/parcelles-benin-hero.jpg"
            alt="Vue aérienne des parcelles cadastrées en République du Bénin"
            className="h-full w-full object-cover object-center"
          />
          {/* Voile blanc allégé pour faire ressortir pleinement les couleurs réelles des parcelles */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/60" />
          <div className="absolute inset-0 bg-slate-900/10" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center flex flex-col items-center">
          <FadeIn className="flex flex-col items-center gap-5 sm:gap-6 w-full bg-white/75 backdrop-blur-md p-6 sm:p-12 rounded-3xl border border-white/80 shadow-2xl">
            {/* Badge République */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0a3764]/20 bg-white/90 backdrop-blur-xs px-4 py-1.5 text-[11px] sm:text-xs font-bold text-[#0a3764] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#008751] animate-pulse shrink-0" />
              <span className="uppercase tracking-wider">
                République du Bénin • Système National d&apos;Information Foncière
              </span>
            </div>

            {/* Titre Institutionnel Solennel */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.12] sm:leading-[1.1] tracking-tight text-slate-900 max-w-4xl">
              BENINLAND <br />
              <span className="text-[#0a3764]">
                Chaque parcelle vérifiée,
              </span>{" "}
              <br />
              <span className="text-slate-800 text-xl sm:text-3xl md:text-4xl font-bold">
                chaque droit républicain garanti.
              </span>
            </h1>

            {/* Description administrative humaine rigoureuse */}
            <p className="max-w-[65ch] text-xs sm:text-base md:text-lg leading-relaxed text-slate-700">
              La plateforme d&apos;État souveraine de sécurisation et de gouvernance foncière du Bénin. Opérée conjointement par l&apos;<strong>Agence Nationale du Domaine et du Foncier (ANDF)</strong>, la <strong>Chambre Nationale des Notaires</strong>, la <strong>Cour Spéciale (CSAF)</strong> et le <strong>Trésor Public (DGTCP)</strong>, elle garantit l&apos;éradication définitive des doubles ventes et des expropriations illégitimes.
            </p>

            {/* Formulaire de Recherche Rapide de Parcelle Intégré Spacieux */}
            <form
              onSubmit={handleHeroSearch}
              className="w-full max-w-2xl p-1.5 sm:p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#0a3764]/30 shadow-xl shadow-[#0a3764]/10 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#0a3764] focus-within:ring-2 focus-within:ring-[#0a3764]/20 mt-2"
            >
              <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full">
                <Search className="h-5 w-5 text-[#0a3764] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une parcelle (ex: OUI-0421, LIT-COT-001, NPI du propriétaire)..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0a3764] hover:bg-[#072545] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span>Vérifier au Cadastre</span>
              </button>
            </form>

            {/* Raccourcis de recherche de parcelles témoins */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-500 text-[11px]">Exemples de consultation directe :</span>
              <button
                type="button"
                onClick={() => router.push("/verification?q=OUI-0421")}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-[#0a3764] font-mono font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                OUI-0421 (Pahou)
              </button>
              <button
                type="button"
                onClick={() => router.push("/verification?q=LIT-COT-001")}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-[#0a3764] font-mono font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                LIT-COT-001 (Haie Vive)
              </button>
              <button
                type="button"
                onClick={() => router.push("/verification?q=CAL-2089")}
                className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-[#0a3764] font-mono font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                CAL-2089 (Abomey-Calavi)
              </button>
            </div>

            {/* CTA Clairs & Centrés */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-3 w-full">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0a3764] hover:bg-[#072545] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#0a3764]/25 transition-all active:scale-95 text-center"
              >
                <Lock className="h-4 w-4 shrink-0 text-amber-300" />
                <span>ACCÉDER À MON ESPACE &amp; DÉMO</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <Link
                href="/carte"
                className="w-full sm:w-auto inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/90 hover:bg-white px-6 py-3 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition-all hover:border-[#0a3764]/50 text-center"
              >
                <MapPin className="h-4 w-4 text-[#008751] shrink-0" />
                <span>Consulter le SIG 77 Communes</span>
              </Link>
            </div>

            {/* Références Réglementaires Officielles */}
            <div className="pt-6 border-t border-slate-200/80 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#008751] shrink-0" /> Loi 2013-01 Code Foncier
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ffbe00] shrink-0" /> Loi 2022-16 CSAF
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0a3764] shrink-0" /> Décret ANDF Conservatoire
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#eb0000] shrink-0" /> Numéro Vert 139
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Ligne Tricolore Républicaine */}
      <div className="flex h-1.5 w-full shadow-xs">
        <div className="w-1/3 bg-[#008751]" />
        <div className="w-1/3 bg-[#ffbe00]" />
        <div className="w-1/3 bg-[#eb0000]" />
      </div>

      {/* 2. SECTION GUICHET UNIQUE (E-SERVICES INSPIRÉS DE L'ARCHITECTURE ANIP) */}
      <section className="w-full py-14 sm:py-22 px-4 sm:px-8 lg:px-12 bg-[#f6f8fb]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0a3764]/10 px-4 py-1 text-xs font-bold text-[#0a3764] mb-3 border border-[#0a3764]/20">
              Guichet Unique du Foncier National
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0a3764] tracking-tight">
              Nos services en ligne
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
              Accédez directement aux réquisitions d&apos;immatriculation, à la vérification préalable de parcelle et aux garanties d&apos;opposabilité de l&apos;État béninois.
            </p>
          </FadeIn>

          {/* Grille de Cartes ANIP Élargie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {SERVICES_EN_LIGNE.map((srv) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={srv.id}
                  href={srv.link}
                  className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-[#0a3764]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="h-12 w-12 rounded-xl bg-[#eaf2f9] text-[#0a3764] flex items-center justify-center shrink-0 group-hover:bg-[#0a3764] group-hover:text-white transition-colors duration-200 shadow-xs">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[200px]">
                        {srv.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0a3764] transition-colors leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-normal mt-2.5 leading-relaxed">
                      {srv.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="block font-bold text-slate-900 font-mono text-[11px]">
                        {srv.tarif}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                        Délai : {srv.delai}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 font-bold text-[#0a3764] group-hover:translate-x-1 transition-transform">
                      <span>Accéder</span>
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bouton "Tout voir" (Style ANIP Ambré Authentique) */}
          <div className="mt-10 sm:mt-14 flex flex-col items-center justify-center gap-2 text-center">
            <Link
              href="/verification"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#f0a945] hover:bg-[#e09833] px-8 sm:px-10 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#f0a945]/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Consulter l&apos;ensemble des services</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <span className="text-[11px] text-slate-500 font-medium px-4">
              Recherchez une parcelle, téléchargez un bordereau analytique ou consultez les barèmes officiels
            </span>
          </div>
        </div>
      </section>

      {/* 3. TÉLÉMÉTRIE NATIONALE SPACIEUSE EN DIRECT */}
      <section className="w-full border-y border-slate-200 bg-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header de la télémétrie */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#008751]"></span>
              </span>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-800">
                Télémétrie Opérationnelle Nationale • Supervision Foncière en Temps Réel
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
              Source : ANDF • Chambre des Notaires • CSAF • DGTCP (Actualisé en continu)
            </span>
          </div>

          {/* 4 Métriques Clés Spacieuses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
            <div className="flex flex-col p-5 sm:p-6 rounded-2xl bg-[#f6f8fb] border border-slate-200/90 hover:border-[#0a3764]/30 transition-colors">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0a3764] tracking-tight font-mono">
                77
              </span>
              <span className="text-xs uppercase font-bold text-slate-900 mt-2.5">
                Communes Raccordées
              </span>
              <span className="text-xs text-slate-600 mt-1 leading-relaxed">
                12 départements interconnectés au référentiel cadastral national géoréférencé WGS84.
              </span>
            </div>

            <div className="flex flex-col p-5 sm:p-6 rounded-2xl bg-[#f6f8fb] border border-slate-200/90 hover:border-[#008751]/30 transition-colors">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#008751] tracking-tight font-mono">
                100%
              </span>
              <span className="text-xs uppercase font-bold text-slate-900 mt-2.5">
                Verrous Opposables
              </span>
              <span className="text-xs text-slate-600 mt-1 leading-relaxed">
                Blocage informatique immédiat dès l&apos;ouverture du dossier d&apos;acquisition chez le notaire.
              </span>
            </div>

            <div className="flex flex-col p-5 sm:p-6 rounded-2xl bg-[#f6f8fb] border border-slate-200/90 hover:border-[#eb0000]/30 transition-colors">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#eb0000] tracking-tight font-mono">
                0 FCFA
              </span>
              <span className="text-xs uppercase font-bold text-slate-900 mt-2.5">
                Frais Cachés au Séquestre
              </span>
              <span className="text-xs text-slate-600 mt-1 leading-relaxed">
                Consignation publique protégée au Compte Unique du Trésor Public (DGTCP).
              </span>
            </div>

            <div className="flex flex-col p-5 sm:p-6 rounded-2xl bg-[#f6f8fb] border border-slate-200/90 hover:border-[#f0a945]/30 transition-colors">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#f0a945] tracking-tight font-mono">
                &lt; 30 s
              </span>
              <span className="text-xs uppercase font-bold text-slate-900 mt-2.5">
                Détection Double Vente
              </span>
              <span className="text-xs text-slate-600 mt-1 leading-relaxed">
                Rejet algorithmique en temps réel si une parcelle fait déjà l&apos;objet d&apos;un compromis scellé.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODULE SIG CADASTRAL GRAND FORMAT PANORAMIQUE */}
      <section className="w-full py-14 sm:py-22 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#0a3764]/10 px-3.5 py-1 text-xs font-bold text-[#0a3764] mb-2 border border-[#0a3764]/20">
                <MapPin className="h-3.5 w-3.5" />
                <span>Système d&apos;Information Géographique (SIG) National</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Cartographie Cadastrale &amp; Bornes Réelles des 77 Communes
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl">
                Visualisez les polygones réels, les coordonnées GPS certifiées, les statuts juridiques (Titre Foncier, CPF, Domaine Public, Coutumier) et le panneau d&apos;inspection d&apos;opposabilité.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/carte"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:border-[#0a3764]/50 transition cursor-pointer"
              >
                <span>Ouvrir la Carte Plein Écran</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Intégration de la carte CadastreLeafletMap */}
          <div className="w-full h-[640px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white">
            <CadastreLeafletMap />
          </div>
        </div>
      </section>

      {/* 5. LES 4 PILIERS DE LA RÉFORME FONCIÈRE SOUVERAINE */}
      <section id="piliers" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <FadeIn className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0a3764]/10 px-4 py-1.5 text-xs font-bold text-[#0a3764] mb-3 border border-[#0a3764]/20">
            Cadre de Souveraineté Domaniale 2026-2030
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Les 4 Piliers de la Réforme Foncière Souveraine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Une architecture régalienne rigoureuse pour assainir durablement le secteur foncier béninois, protéger les acquéreurs et mettre fin aux conflits de limites.
          </p>
        </FadeIn>

        {/* Grille des 4 Piliers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {PILIERS.map((pil) => {
            const Icon = pil.icon;
            return (
              <div
                key={pil.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white hover:border-[#0a3764]/40 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-[#eaf2f9] border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
                      <Icon className={`h-6 w-6 ${pil.accent}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[170px]">
                      {pil.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {pil.referenceLegale}
                  </span>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0a3764] transition-colors leading-snug">
                    {pil.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {pil.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{pil.facility}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0a3764]">
                  <Link href={pil.link} className="inline-flex min-h-[44px] items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explorer le dispositif</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. DÉMONSTRATEUR INTERACTIF DE MUTATION (PARCELLE OUI-0421) */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <FadeIn className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1 text-xs font-bold text-amber-800 mb-3 border border-amber-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Démonstrateur Interactif de Mutation &bull; Cas Réel Pilote</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Mutation Foncière &amp; Détection de Double Vente (Parcelle OUI-0421)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
              Suivez pas à pas la vente de la parcelle familiale Dossou à Pahou (Ouidah) : constat de terrain, verrou notarial, rejet de la tentative de double vente et séquestre DGTCP.
            </p>
          </FadeIn>

          <InteractiveScenario />
        </div>
      </section>

      {/* 7. ACCÈS DIRECT AUX 8 ESPACES MÉTIERS */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#f6f8fb]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Espaces Métiers &amp; Guichet d&apos;Accès Souverain
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Sélectionnez votre espace d&apos;exercice pour ouvrir immédiatement votre session selon vos prérogatives légales.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {ACTORS_SHORTCUTS.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.role}
                  onClick={() => handleQuickRoleSelect(act.role)}
                  className="min-h-[44px] p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-[#0a3764]/50 hover:shadow-lg text-left transition-all duration-200 flex flex-col justify-between gap-3 group shadow-xs cursor-pointer overflow-hidden active:scale-95"
                >
                  <div className={`h-11 w-11 rounded-xl ${act.bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className={`h-5 w-5 ${act.color}`} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-[#0a3764] transition-colors leading-snug">
                      {act.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 block mt-1 truncate">
                      {act.roleLabel}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                      {act.subtext}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FOOTER OFFICIEL */}
      <Footer />
    </main>
  );
}
