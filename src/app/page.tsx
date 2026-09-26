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
  Users2,
  Building,
  Smartphone,
  CheckCircle,
  Coins,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* GRILLE HERO ASYMÉTRIQUE : GAUCHE = AUTORITÉ & RECHERCHE, DROITE = CONNEXION MULTI-RÔLES */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CÔTÉ GAUCHE (7 colonnes sur 12) : Vitrine Souveraine, KPIs & Diagnostic Express */}
          <div className="lg:col-span-7 space-y-8 animate-rise">
            {/* Badge de souveraineté */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>République du Bénin • Cadastre National Souverain</span>
            </div>

            {/* Titre & Proposition de valeur */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] text-foreground">
                Sécurisation du Foncier,{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-400 to-secondary bg-clip-text text-transparent">
                  Zéro Double Vente
                </span>{" "}
                au Bénin.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Anyigba rend l&apos;information foncière béninoise{" "}
                <strong className="text-foreground">visible, vérifiable en 30 secondes</strong> et{" "}
                <strong className="text-foreground">infalsifiable par ancrage cryptographique</strong>. Vente
                sécurisée sous séquestre Mobile Money, verrouillage instantané de parcelle et formalisation des droits
                coutumiers.
              </p>
            </div>

            {/* Moteur de vérification publique express */}
            <div className="p-6 rounded-2xl bg-card/90 border border-primary/25 shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Vérification Publique Immédiate de Parcelle</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Accès Citoyen Sans Identifiants</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Saisissez le code d&apos;une parcelle pour vérifier son détenteur officiel, l&apos;absence de litige et
                la disponibilité immédiate à la vente.
              </p>
              <VerificationSearch />
            </div>

            {/* Grille de KPIs Nationaux en Direct */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-card/60 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Parcelles Répertoriées</span>
                </div>
                <div className="text-2xl font-black text-foreground">18 420</div>
                <div className="text-[10px] text-success font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +14% ce mois
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card/60 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Doubles Ventes Bloquées</span>
                </div>
                <div className="text-2xl font-black text-amber-400">100%</div>
                <div className="text-[10px] text-muted-foreground">Par verrou d&apos;État</div>
              </div>

              <div className="p-4 rounded-xl bg-card/60 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Coins className="w-3.5 h-3.5 text-secondary" />
                  <span>Fonds Séquestrés MoMo</span>
                </div>
                <div className="text-2xl font-black text-secondary">384 M</div>
                <div className="text-[10px] text-muted-foreground">FCFA protégés</div>
              </div>

              <div className="p-4 rounded-xl bg-card/60 border border-border space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Requêtes SMS/USSD</span>
                </div>
                <div className="text-2xl font-black text-blue-400">92 100+</div>
                <div className="text-[10px] text-muted-foreground">Feature phones</div>
              </div>
            </div>
          </div>

          {/* CÔTÉ DROIT (5 colonnes sur 12) : LE MODULE DE CONNEXION MULTI-RÔLES AVEC FLUX ASSOCIÉ */}
          <div className="lg:col-span-5 sticky top-24 animate-rise">
            <LoginPanel />
          </div>
        </section>

        {/* SECTION DES 4 PILIERS DE SÉCURISATION NATIONALE */}
        <section className="space-y-6 pt-6 border-t border-border/80">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Les 4 Verrous Technologiques d&apos;Anyigba
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Comment la République du Bénin élimine techniquement la fraude et la spoliation foncière.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 hover:border-primary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Verrou Cryptographique Anti-Double-Vente</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dès l&apos;ouverture d&apos;une cession chez le notaire, la parcelle est verrouillée. Toute seconde vente
                est rejetée avec un refus d&apos;État (409 Conflict).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 hover:border-secondary/50 transition">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Séquestre Mobile Money Garanti</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L&apos;acheteur dépose le paiement sous séquestre. Les fonds ne sont libérés qu&apos;après le visa ANDF
                et la délivrance du titre officiel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 hover:border-blue-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Convention Assistée au Village</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tracé GPS en marchant sur les bornes, contrôle de zéro-chevauchement PostGIS et recueil vocal des
                témoignages en langues nationales.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-3 hover:border-purple-500/50 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Preuve Inaltérable BéninChain</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chaque titre et plan possède son empreinte SHA-256 scellée et ancrée sur Bitcoin via OpenTimestamps. Toute
                tentative de falsification est démasquée.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION FIL CONDUCTEUR DU SCÉNARIO DE DÉMO (Ouidah - Famille Dossou) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-background border border-primary/30 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 uppercase tracking-wider">
                Parcours Officiel de Démonstration
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">
                La Famille Dossou à Ouidah (Parcelle OUI-0421)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Découvrez le parcours complet : de la convention villageoise à la délivrance du titre certifié.
              </p>
            </div>
            <Link
              href="/carte"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <span>Localiser sur la Carte</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                  1
                </span>
                <span>Convention au Village &amp; Voix</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                L&apos;agent foncier se rend à Pahou, relève les 4 bornes et recueille les accords vocaux en Fongbe du
                chef de village et des voisins.
              </p>
              <div className="text-[10px] text-primary flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3 text-success" /> Borne GPS &amp; Audio validés
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                  2
                </span>
                <span>Verrou Notarial &amp; Séquestre</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Me Agbossou initie la vente pour M. Koffi Mensah. La parcelle passe en 🔒 sur la carte. Le second
                acheteur concurrent est immédiatement refoulé.
              </p>
              <div className="text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" /> Verrou anti-double-vente actif
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                  3
                </span>
                <span>Visa ANDF &amp; Titre CPF Scellé</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Mme Houndété valide l&apos;acte. Le nouveau propriétaire est inscrit, les fonds sont libérés au vendeur,
                et l&apos;acte est ancré sur BéninChain.
              </p>
              <div className="text-[10px] text-success flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3 h-3 text-success" /> Preuve mathématique inaltérable
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
