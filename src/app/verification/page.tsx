import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VerificationSearch } from "@/components/verification/VerificationSearch";
import {
  ShieldCheck,
  Smartphone,
  CheckCircle,
  FileSearch,
  Scale,
  Lock,
  Coins,
  AlertTriangle,
  Info,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function VerificationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-8 animate-rise">
        {/* En-tête de section institutionnelle */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/30 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Service Public Ouvert — Code Foncier et Domanial</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Consultation Publique &amp; Vérification Foncière Préalable
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Conformément à la Loi n° 2013-01 modifiée par la Loi n° 2017-15, vérifiez l&apos;état juridique complet
            d&apos;une parcelle avant tout engagement contractuel ou versement de fonds : statut du titre, détenteur légitime,
            opposabilité des droits et absence d&apos;instance contentieuse CSAF.
          </p>
        </div>

        {/* Grille en Split-View (65% Diagnostic / 35% Guide de Vigilance Légale) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLONNE GAUCHE (7 colonnes sur 12) : Formulaire de vérification & Résultats */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 sm:p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg font-bold">Réquisition Cadastrale Numérique</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    Accès Public Libre
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Entrez l&apos;Identifiant Unique Foncier (IUF) ou le code cadastral de la parcelle pour interroger le registre national en temps réel.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 pt-0">
                <VerificationSearch />
              </CardContent>
            </Card>

            {/* Modules d'Inclusion Télécoms & Accessibilité */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Card className="p-4 border-border space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Vérification par SMS (Numéro Court 132)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Sur tout téléphone standard sans connexion internet, envoyez{" "}
                  <strong className="text-foreground font-mono">VERIF &lt;IUF&gt;</strong> (ex :{" "}
                  <span className="font-mono text-primary">VERIF OUI-0421</span>) au <strong className="text-foreground">132</strong>.
                  Vous recevrez en retour l&apos;état certifié de la parcelle par SMS officiel.
                </p>
              </Card>

              <Card className="p-4 border-border space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span>Attestation Vocale Multilingue</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Pour garantir l&apos;inclusion des citoyens non-lecteurs, le statut de chaque parcelle peut être écouté
                  en langues nationales (<strong className="text-foreground">Fongbe</strong>,{" "}
                  <strong className="text-foreground">Yoruba</strong>) ainsi qu&apos;en <strong className="text-foreground">Français</strong>.
                </p>
              </Card>
            </div>
          </div>

          {/* COLONNE DROITE (5 colonnes sur 12) : Guide de Vigilance Légale de l'Acquéreur */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-secondary" />
                  <span>Code Foncier et Domanial</span>
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Les 5 Règles de Vigilance Avant Tout Achat
                </CardTitle>
                <CardDescription className="text-xs">
                  Recommandations formelles du Ministère du Cadre de Vie et de l&apos;Ordre des Géomètres-Experts.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3.5 text-xs">
                <div className="flex gap-3 p-3 rounded-xl bg-background/80 border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                    1
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">Réquisition Cadastrale Préalable</strong>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      Vérifier l&apos;inscription effective de la parcelle au cadastre national de l&apos;ANDF et la concordance du nom du vendeur.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-background/80 border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                    2
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">Constat de Bornage Contradictoire</strong>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      Exiger le procès-verbal de bornage contradictoire dressé par un géomètre-expert inscrit à l&apos;Ordre, avec relevé des 4 bornes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-background/80 border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                    3
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">Absence d&apos;Instance Contentieuse CSAF</strong>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      S&apos;assurer qu&apos;aucune ordonnance de gel conservatoire n&apos;a été émise par la Cour Spéciale des Affaires Foncières (Loi n° 2022-16).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-background/80 border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                    4
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">Acte Authentique Devant Notaire</strong>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      Toute cession immobilière requiert l&apos;intervention d&apos;un officier ministériel (notaire) posant le verrou d&apos;opposabilité immédiat.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-background/80 border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                    5
                  </span>
                  <div className="space-y-0.5">
                    <strong className="text-foreground block">Consignation sous Séquestre Financier</strong>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      Ne jamais remettre de fonds en espèces. Les fonds doivent être déposés sur un compte séquestre auprès du Trésor Public (TrésorPay) ou d&apos;opérateurs agréés.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-secondary font-bold">
                <Info className="w-4 h-4" />
                <span>Assistance Cadastrale Citoyenne</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                En cas de doute sur une parcelle ou de pression indue pour un paiement comptant sans acte notarié, signalez immédiatement la situation
                aux services communaux de l&apos;urbanisme ou au greffe de la CSAF.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
