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
  Sparkles,
} from "lucide-react";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { GradientText } from "@/components/reactbits/GradientText";
import { CountUp } from "@/components/reactbits/CountUp";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* HERO SECTION ASYMÉTRIQUE : CITOYEN & VÉRIFICATION À GAUCHE | CONNEXION & FLUX À DROITE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CÔTÉ GAUCHE (7 colonnes sur 12) : Priorité Mobile-First Citoyen */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-rise">
            {/* Badge de souveraineté officiel */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>République du Bénin</span>
              <span className="text-muted-foreground">•</span>
              <ShinyText text="Cadastre National Souverain" speed={3.5} />
            </div>

            {/* Titre & Proposition de valeur limpide */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                Sécurisation du Foncier,{" "}
                <GradientText
                  colors={["#0A5C36", "#10B981", "#F2B822", "#0A5C36"]}
                  animationSpeed={5}
                >
                  Zéro Double Vente
                </GradientText>{" "}
                au Bénin.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Anyigba rend l&apos;information foncière béninoise{" "}
                <strong className="text-foreground font-semibold">visible en 30 secondes</strong>,{" "}
                protège les transactions sous{" "}
                <strong className="text-foreground font-semibold">séquestre Mobile Money</strong> et garantit des{" "}
                titres <strong className="text-foreground font-semibold">infalsifiables par cryptographie</strong>.
              </p>
            </div>

            {/* Outil de diagnostic citoyen express (Priorité Mobile) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-card/90 border border-primary/30 shadow-xl backdrop-blur-md space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vérification Publique Instantanée</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  Sans Identifiants
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Citoyen ou acheteur ? Entrez le numéro de parcelle pour contrôler son détenteur officiel, l&apos;absence de litige et sa disponibilité.
              </p>

              <VerificationSearch />
            </div>

            {/* Grille de KPIs Nationaux avec animations CountUp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-card/70 border border-border/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Parcelles</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  <CountUp to={18420} duration={1.8} />
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +14% ce mois
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/70 border border-border/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Doubles Ventes</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  <CountUp to={100} duration={1.2} suffix="%" />
                </div>
                <div className="text-[10px] text-muted-foreground">Bloquées par verrou</div>
              </div>

              <div className="p-4 rounded-xl bg-card/70 border border-border/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Coins className="w-3.5 h-3.5 text-secondary" />
                  <span>Fonds Séquestrés</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-secondary">
                  <CountUp to={384} duration={2} suffix=" M" />
                </div>
                <div className="text-[10px] text-muted-foreground">FCFA protégés</div>
              </div>

              <div className="p-4 rounded-xl bg-card/70 border border-border/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>SMS / USSD</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-blue-400">
                  <CountUp to={92100} duration={2.2} suffix="+" />
                </div>
                <div className="text-[10px] text-muted-foreground">Feature phones</div>
              </div>
            </div>
          </div>

          {/* CÔTÉ DROIT (5 colonnes sur 12) : MODULE DE CONNEXION MULTI-RÔLES AVEC FLUX ASSOCIÉ */}
          <div className="lg:col-span-5 sticky top-20 animate-rise">
            <LoginPanel />
          </div>
        </section>

        {/* SECTION DES 4 VERROUS TECHNOLOGIQUES AVEC SPOTLIGHTCARD */}
        <section className="space-y-6 pt-4 border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs uppercase tracking-wider">
              Architecture &amp; Sécurité Nationale
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Les 4 Verrous Technologiques d&apos;Anyigba
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Une chaîne de confiance complète pour éliminer la fraude foncière au Bénin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard
              spotlightColor="rgba(10, 92, 54, 0.35)"
              className="space-y-3 hover:border-primary/60"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Verrou Cryptographique Anti-Double-Vente</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dès l&apos;ouverture d&apos;un acte chez le notaire, la parcelle est verrouillée instantanément. Toute
                tentative concurrente est rejetée avec un refus d&apos;État (409 Conflict).
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(242, 184, 34, 0.3)"
              className="space-y-3 hover:border-secondary/60"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Séquestre Mobile Money Garanti</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L&apos;acheteur dépose le paiement sous séquestre MTN MoMo / Moov Money. Les fonds ne sont libérés au
                vendeur qu&apos;après le visa ANDF et l&apos;émission du titre officiel.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.3)"
              className="space-y-3 hover:border-blue-500/60"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Convention Assistée au Village</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Levé GPS des bornes en direct, contrôle de zéro-chevauchement PostGIS et recueil vocal des consentements
                en langues nationales (Fongbe, Yoruba, Bariba).
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.3)"
              className="space-y-3 hover:border-purple-500/60"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Preuve Inaltérable BéninChain</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chaque titre possède son empreinte SHA-256 ancrée sur Bitcoin via OpenTimestamps :{" "}
                <DecryptedText
                  text="SHA-256 e3b0c44298fc1c14"
                  speed={35}
                  className="font-mono text-[10px] text-primary"
                />
                .
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* SECTION DU SCÉNARIO OFFICIEL DE DÉMONSTRATION (Ouidah - Famille Dossou) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-background border border-primary/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <Badge variant="secondary" className="gap-1 font-bold text-[10px] uppercase">
                <Sparkles className="w-3 h-3 text-secondary" />
                Scénario Démo Fil Conducteur
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1.5">
                La Famille Dossou à Ouidah (Parcelle OUI-0421)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Suivez la vente complète : de la convention villageoise à Pahou jusqu&apos;à la délivrance du titre certifié.
              </p>
            </div>
            <Button asChild size="default" className="font-bold text-xs gap-1.5">
              <Link href="/carte">
                <span>Voir sur la Carte</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-background/70 border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>Convention au Village &amp; Audio</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                L&apos;agent foncier se rend à Pahou, relève les 4 bornes et recueille les accords vocaux en Fongbe du
                chef de village et des voisins.
              </p>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Bornes GPS &amp; Voix validées
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/70 border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span>Verrou Notarial &amp; Séquestre</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Me Agbossou initie la cession pour M. Koffi Mensah. La parcelle passe en 🔒 sur la carte. Le second
                acheteur concurrent est immédiatement refoulé.
              </p>
              <div className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3 text-amber-400" /> Verrou anti-double-vente actif
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/70 border border-border/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span>Visa ANDF &amp; Titre CPF Scellé</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Mme Houndété valide l&apos;acte. Le nouveau propriétaire est inscrit, les fonds sont libérés au vendeur,
                et l&apos;acte est ancré sur BéninChain.
              </p>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Preuve cryptographique inaltérable
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
