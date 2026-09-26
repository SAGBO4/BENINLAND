import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { VerificationSearch } from "@/components/verification/VerificationSearch";
import {
  ShieldCheck,
  Lock,
  MapPin,
  FileCheck2,
  Coins,
  ArrowRight,
  TrendingUp,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Scale,
  Landmark,
  Building2,
  Users,
  Briefcase,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* HERO SECTION ASYMÉTRIQUE : CITOYEN & VÉRIFICATION À GAUCHE | CONNEXION & FLUX À DROITE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CÔTÉ GAUCHE (7 colonnes sur 12) : Diagnostic & Services Citoyens */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-rise">
            {/* Ruban Institutionnel Officiel */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>République du Bénin</span>
              <span className="text-muted-foreground">•</span>
              <span>Registre National du Foncier</span>
            </div>

            {/* Titre Institutionnel & Déclaration d'Autorité */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] text-foreground">
                Sécurisation des Mutations &amp; Verrou d&apos;Opposabilité Immédiat.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Plateforme souveraine d&apos;immatriculation et d&apos;assainissement foncier sous le timbre de l&apos;État béninois.
                Consultation publique instantanée, blocage légal de toute tentative de double vente et actes authentiques scellés.
              </p>
            </div>

            {/* Outil de diagnostic citoyen officiel */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Consultation Publique Libre</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground font-semibold">
                  Accès Citoyen Ouvert
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Tout citoyen ou acquéreur peut vérifier la régularité juridique d&apos;une parcelle avant tout versement d&apos;acompte :
                identité du détenteur légal, état d&apos;instruction ANDF et absence d&apos;ordonnance de gel CSAF.
              </p>

              <VerificationSearch />
            </div>

            {/* Indicateurs Clés Nationaux */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Parcelles Immatriculées</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                  18 420
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +14% ce mois
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>Mutations Sécurisées</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-secondary font-mono">
                  100 %
                </div>
                <div className="text-[10px] text-muted-foreground">Sous verrou légal</div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Coins className="w-3.5 h-3.5 text-primary" />
                  <span>Fonds Sous Séquestre</span>
                </div>
                <div className="text-lg sm:text-xl font-black text-foreground font-mono">
                  384 000 000
                </div>
                <div className="text-[10px] text-muted-foreground">FCFA protégés (CUT/DGTCP)</div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Requêtes Télécoms</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
                  92 100 +
                </div>
                <div className="text-[10px] text-muted-foreground">Canaux USSD &amp; SMS 132</div>
              </div>
            </div>
          </div>

          {/* CÔTÉ DROIT (5 colonnes sur 12) : Module de Connexion Multi-Profils */}
          <div className="lg:col-span-5 sticky top-20 animate-rise">
            <LoginPanel />
          </div>
        </section>

        {/* 4 PASSERELLES DÉDIÉES PAR PROFIL */}
        <section className="space-y-6 pt-4 border-t border-border/80">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              Portail Foncier Interopérable
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Passerelles Professionnelles et Citoyennes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Des interfaces adaptées aux compétences et missions régies par le Code Foncier et Domanial béninois.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-3 border-border hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Citoyen &amp; Famille</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consultation libre de parcelle, carnet foncier familial pour anticiper les successions, et attestation vocale multilingue.
              </p>
              <Link href="/espace/citoyen" className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline pt-1">
                <span>Espace Citoyen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            <Card className="p-5 space-y-3 border-border hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Professionnels du Droit</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chambre Nationale des Notaires et Géomètres-Experts : pose du verrou d&apos;opposabilité, rédaction d&apos;actes et bornage.
              </p>
              <Link href="/espace/notaire" className="inline-flex items-center gap-1 text-xs text-blue-400 font-semibold hover:underline pt-1">
                <span>Espace Notarial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            <Card className="p-5 space-y-3 border-border hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Administration Publique</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direction Générale, ANDF, Trésor Public (DGTCP), Cour Spéciale des Affaires Foncières (CSAF) et Mairies.
              </p>
              <Link href="/espace/ministere" className="inline-flex items-center gap-1 text-xs text-secondary font-semibold hover:underline pt-1">
                <span>Régulation Ministérielle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            <Card className="p-5 space-y-3 border-border hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Institutions Financières</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Banques commerciales et institutions de microfinance : vérification de la liberté d&apos;hypothèque et inscription de sûretés.
              </p>
              <Link href="/espace/banque" className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold hover:underline pt-1">
                <span>Portail Bancaire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>
        </section>

        {/* 4 VERROUS TECHNOLOGIQUES ET LÉGAUX */}
        <section className="space-y-6 pt-4 border-t border-border/80">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              Architecture &amp; Cadre Légal
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Les 4 Piliers de Sécurisation Foncière
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Une chaîne de confiance institutionnelle rigoureusement adossée au Code Foncier et Domanial.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <Card className="p-5 space-y-3 border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Verrou d&apos;Opposabilité Immédiate</h3>
              <p className="text-muted-foreground leading-relaxed">
                Dès l&apos;ouverture du dossier de mutation chez le notaire, la parcelle est verrouillée au registre national.
                Toute tentative concurrente est automatiquement rejetée par un refus d&apos;État (409 Conflict).
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Séquestre Financier Réglementaire</h3>
              <p className="text-muted-foreground leading-relaxed">
                L&apos;acquéreur consigne les fonds sur un compte séquestre auprès du Trésor Public (TrésorPay) ou d&apos;opérateurs agréés.
                La libération des fonds n&apos;intervient qu&apos;après le visa ANDF et l&apos;inscription définitive au Livre Foncier.
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-border">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Bornage Contradictoire &amp; Constat</h3>
              <p className="text-muted-foreground leading-relaxed">
                Levé GPS certifié des 4 bornes par géomètre assermenté, vérification de zéro-chevauchement topologique PostGIS
                et recueil des accords vocaux des témoins en langues nationales (Fongbe, Yoruba, Bariba).
              </p>
            </Card>

            <Card className="p-5 space-y-3 border-border">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Horodatage Cryptographique SHA-256</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chaque titre foncier, plan parcellaire et quittance fait l&apos;objet d&apos;une empreinte numérique SHA-256
                scellée publiquement (OpenTimestamps / ASIN) :
              </p>
              <div className="font-mono text-[10px] text-primary p-2 rounded bg-background/80 border border-border">
                SHA-256 : e3b0c44298fc1c14...
              </div>
            </Card>
          </div>
        </section>

        {/* SECTION DU SCÉNARIO OFFICIEL DE DÉMONSTRATION (Pahou / Ouidah - Famille Dossou) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="secondary" className="font-bold text-[10px] uppercase">
                Territoire Pilote de Démonstration
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1.5">
                La Famille Dossou à Ouidah (Parcelle OUI-0421)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Parcours complet d&apos;une transaction foncière : du procès-verbal de bornage à Pahou jusqu&apos;à la délivrance du titre certifié.
              </p>
            </div>
            <Button asChild size="default" className="font-bold text-xs gap-1.5 cursor-pointer">
              <Link href="/carte">
                <span>Consulter sur la Carte SIG</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-background/90 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>Procès-Verbal de Bornage Contradictoire</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                L&apos;agent foncier se rend à Pahou (Village Hounhanmèdji), relève les 4 bornes géodésiques et enregistre
                les consentements vocaux en Fongbe du chef de village et des riverains.
              </p>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Bornes PostGIS &amp; Consentements validés
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/90 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>Verrou Notarial &amp; Consignation Financière</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Me Christian Agbossou ouvre le contrat de mutation pour M. Koffi Mensah. La parcelle est placée sous
                verrou d&apos;opposabilité immédiat au cadastre national, écartant toute vente concurrente.
              </p>
              <div className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold pt-1">
                <Lock className="w-3 h-3 text-amber-400" /> Verrou d&apos;opposabilité immédiate actif
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/90 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>Visa ANDF &amp; Titre CPF Scellé</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                La directrice de l&apos;ANDF valide l&apos;acte au cadastre. Le nouveau propriétaire est inscrit au registre,
                les fonds consignés sont versés au vendeur et l&apos;acte est scellé par empreinte SHA-256.
              </p>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Certificat délivré &amp; Empreinte scellée
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
