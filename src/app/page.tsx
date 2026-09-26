"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NationalShowcase } from "@/components/marketing/NationalShowcase";
import { NationalDashboard } from "@/components/dashboard/NationalDashboard";
import { CadastreMap } from "@/components/carte/CadastreMap";
import { InteractiveScenario } from "@/components/scenario/InteractiveScenario";
import { VerificationSearch } from "@/components/verification/VerificationSearch";
import { TelecomSimulatorsView } from "@/components/simulators/TelecomSimulatorsView";
import { MobileMoneyModal } from "@/components/simulators/MobileMoneyModal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  FileSearch,
  Scale,
  Lock,
  Coins,
  AlertTriangle,
  Info,
  MapPin,
  Fingerprint,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { anyigbaRepo } from "@/repositories/index";

export default function MasterPortalPage() {
  const [activeTab, setActiveTab] = useState("vitrine");
  const [momoOpen, setMomoOpen] = useState(false);

  // Synchronisation avec l'URL (?tab=carte, etc.) sans forcer de rechargement
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const validTabs = ["vitrine", "dashboard", "carte", "scenario", "verification", "simulators"];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", newTab);
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin selection:bg-emerald-600 selection:text-white">
      {/* En-tête Républicain avec navigation intégrée */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenMoMo={() => setMomoOpen(true)}
      />

      {/* Conteneur Principal Pleine Largeur Souveraine */}
      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* ONGLET 1 : VITRINE NATIONALE & PRÉSENTATION SOUVERAINE */}
        {activeTab === "vitrine" && (
          <NationalShowcase
            onNavigateToTab={handleTabChange}
          />
        )}

        {/* ONGLET 2 : TABLEAU DE BORD NATIONAL & TRÉSOR PUBLIC */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-rise">
            <NationalDashboard
              onNavigateToTab={handleTabChange}
            />
          </div>
        )}

        {/* ONGLET 3 : CARTE CADASTRALE SIG PLEIN ÉCRAN */}
        {activeTab === "carte" && (
          <div className="space-y-4 animate-rise">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-lg">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Système d&apos;Information Géographique (SIG) National</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  Cartographie Cadastrale &amp; Bornes Réelles des 77 Communes
                </h2>
                <p className="text-xs text-muted-foreground">
                  Visualisez les polygones réels, les statuts juridiques certifiés (TF, CPF, Coutumier) et le panneau d&apos;inspection foncière.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link href="/carte" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground transition">
                  <span>Plein Écran Dédié</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="w-full h-[760px] rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
              <CadastreMap />
            </div>
          </div>
        )}

        {/* ONGLET 4 : SCÉNARIO INTERACTIF PILOTE (FAMILLE DOSSOU À PAHOU) */}
        {activeTab === "scenario" && (
          <div className="animate-rise">
            <InteractiveScenario
              onNavigateToTab={handleTabChange}
            />
          </div>
        )}

        {/* ONGLET 5 : VÉRIFICATION PUBLIQUE & COFFRE-FORT D'ACTES */}
        {activeTab === "verification" && (
          <div className="space-y-8 animate-rise">
            {/* Titre & Guide */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/30 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                <span>Service Public Ouvert — Code Foncier et Domanial</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                Consultation Publique &amp; Vérification Foncière Préalable
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Conformément à la Loi n° 2013-01 modifiée par la Loi n° 2017-15, vérifiez l&apos;état juridique complet
                d&apos;une parcelle avant tout engagement contractuel ou versement de fonds : statut du titre, détenteur légitime,
                opposabilité des droits et absence d&apos;instance contentieuse CSAF.
              </p>
            </div>

            {/* Grille en Split-View (65% Diagnostic / 35% Sécurité Cryptographique & Vigilance) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Colonne gauche (7 col) : Recherche de Parcelle */}
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
                      Entrez l&apos;Identifiant Unique Foncier (IUF) ou le code cadastral de la parcelle pour interroger le registre national en direct.
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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

              {/* Colonne droite (5 col) : Coffre-Fort d'Actes & Empreintes Cryptographiques */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-border shadow-xl bg-card">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-5 h-5 text-secondary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Coffre-Fort &amp; Intégrité Cryptographique
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                        SHA-256
                      </Badge>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      Contrôle mathématique d&apos;infalsifiabilité des actes fonciers sous le timbre de l&apos;État béninois.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 pt-0 space-y-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white font-mono">TF-OUIDAH-2026-104</span>
                        <Badge variant="success" className="text-[9px]">Certifié ANDF</Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono break-all">
                        SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Ancrage BéninChain : 0xbc887766554433221100aabbccddeeff
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/verification/actes"
                        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition shadow"
                      >
                        <Fingerprint className="w-4 h-4" />
                        <span>Ouvrir le Registre Intégral des Actes</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Guide de vigilance légale */}
                <Card className="border-border shadow-xl bg-card">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-400" />
                      <CardTitle className="text-sm font-bold text-foreground">
                        Règles Fondamentales de Sécurité Foncière
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3 text-xs text-muted-foreground leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span><strong>Zéro acompte en espèces :</strong> Ne jamais verser de fonds avant la pose du verrou notarial au registre national.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span><strong>Séquestre obligatoire :</strong> Les fonds doivent transiter par le compte séquestre du Trésor Public (DGTCP).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span><strong>Vérification CSAF :</strong> Tout litige pendant devant la Cour Spéciale entraîne l&apos;inaliénabilité immédiate de la parcelle.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 6 : SIMULATEURS TÉLÉCOMS & INCLUSION NUMÉRIQUE */}
        {activeTab === "simulators" && (
          <div className="animate-rise">
            <TelecomSimulatorsView />
          </div>
        )}
      </main>

      {/* Modal Mobile Money Global */}
      <MobileMoneyModal
        isOpen={momoOpen}
        onClose={() => setMomoOpen(false)}
        montantDefault={4500000}
        motifDefault="Séquestre réglementé Cession Foncière (CUT / DGTCP)"
        parcelleCode="OUI-0421"
      />

      {/* Pied de Page Institutionnel Souverain */}
      <Footer />
    </div>
  );
}
