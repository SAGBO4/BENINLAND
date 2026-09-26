"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Landmark,
  ShieldCheck,
  Scale,
  Building,
  TrendingUp,
  AlertTriangle,
  Lock,
  FileCheck,
  Users,
  Search,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { CountUp } from "@/components/reactbits/CountUp";
import { formatFcfa } from "@/lib/utils";

export default function MinisterePage() {
  const [selectedDepartement, setSelectedDepartement] = useState("Atlantique");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectionMsg, setInspectionMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statsTresor = {
    recettesFiscalesCut: 1245800000, // 1.245 milliard FCFA versé au Trésor Public
    droitsMutationCut: 489200000,
    taxesPlusValueCommunes: 142500000,
    fondsTransactionsSurveillees: 384000000,
    parcellesTitrees: 18420,
    doublesVentesEcartees: 312,
  };

  const departements = [
    { nom: "Atlantique", parcelles: 6840, litiges: 3, conformite: "99.4%" },
    { nom: "Littoral", parcelles: 5120, litiges: 1, conformite: "99.8%" },
    { nom: "Ouémé", parcelles: 2450, litiges: 4, conformite: "98.9%" },
    { nom: "Borgou", parcelles: 1680, litiges: 2, conformite: "99.1%" },
    { nom: "Zou", parcelles: 1140, litiges: 2, conformite: "98.7%" },
    { nom: "Mono", parcelles: 620, litiges: 1, conformite: "99.0%" },
    { nom: "Couffo", parcelles: 570, litiges: 0, conformite: "100%" },
  ];

  const corpsMetiers = [
    {
      titre: "Chambre des Notaires",
      actif: 42,
      dossiersTraites: 184,
      delaiMoyen: "48h",
      statut: "Conforme",
      statutVariant: "success" as const,
    },
    {
      titre: "Inspecteurs ANDF",
      actif: 28,
      dossiersTraites: 156,
      delaiMoyen: "24h",
      statut: "Cadence Optimale",
      statutVariant: "success" as const,
    },
    {
      titre: "Géomètres-Experts Ordre",
      actif: 64,
      dossiersTraites: 312,
      delaiMoyen: "72h",
      statut: "GPS PostGIS Certifié",
      statutVariant: "info" as const,
    },
    {
      titre: "Agents Fonciers de Terrain",
      actif: 120,
      dossiersTraites: 420,
      delaiMoyen: "Voix & 4 Bornes",
      statut: "Surveillance Active",
      statutVariant: "warning" as const,
    },
  ];

  const handleTriggerInspection = () => {
    setLoading(true);
    setInspectionMsg(null);
    setTimeout(() => {
      setLoading(false);
      setInspectionMsg(
        "Ordonnance ministérielle d'audit transmise avec succès à l'Inspection Générale des Affaires Foncières (IGAF). Contrôle inopiné programmé sous 24h avec réquisition des registres cryptographiques."
      );
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* BANNIÈRE RÉGALIENNE : MINISTÈRE DU CADRE DE VIE & DES FINANCES */}
        <Card className="border-secondary/40 shadow-2xl backdrop-blur-xl bg-card/95 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="p-5 sm:p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0 shadow-lg shadow-secondary/10">
                  <Landmark className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-black tracking-tight">
                      Tour de Contrôle Ministérielle &amp; Régulation d&apos;État
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold gap-1 px-2.5">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      <ShinyText text="Haute Tutelle Souveraine" speed={3} />
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Ministère du Cadre de Vie, des Transports et du Foncier • Ministère de l&apos;Économie et des Finances
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="px-3 py-2 rounded-xl bg-background/80 border border-border text-xs">
                  <span className="text-[10px] text-muted-foreground block">Autorité Connectée</span>
                  <strong className="text-foreground">Cabinet du Ministre • Inspection Générale</strong>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* SECTION TRÉSOR PUBLIC DU BÉNIN : FLUX FINANCIERS RÉGALIENS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span>Souveraineté Financière : Trésor Public du Bénin (DGTCP / TrésorPay)</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Compte Unique du Trésor (CUT) Actif
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SpotlightCard
              spotlightColor="rgba(242, 184, 34, 0.25)"
              className="p-5 space-y-2 border-secondary/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Recettes Fiscales Versées au Trésor</span>
                <Landmark className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-2xl font-black text-secondary font-mono">
                <CountUp to={1245.8} decimals={1} duration={2} suffix=" M" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                FCFA encaissés via le guichet national <strong className="text-foreground">TrésorPay</strong>
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(10, 92, 54, 0.25)"
              className="p-5 space-y-2 border-primary/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Droits de Mutation &amp; Enregistrement</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                <CountUp to={489.2} decimals={1} duration={1.8} suffix=" M" />
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold">
                +18.4% de recouvrement fiscal vs 2025
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(59, 130, 246, 0.25)"
              className="p-5 space-y-2 border-blue-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Taxes Plus-Values (77 Mairies)</span>
                <Building className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-blue-400 font-mono">
                <CountUp to={142.5} decimals={1} duration={1.8} suffix=" M" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Reversés directement aux budgets communaux
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.25)"
              className="p-5 space-y-2 border-purple-500/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Transactions Privées Sous Tutelle</span>
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400 font-mono">
                <CountUp to={384} duration={1.5} suffix=" M" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                FCFA séquestrés (libération conditionnée au visa)
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* GRILLE CENTRALE : PANORAMA DES DÉPARTEMENTS & AUDIT DES ACTEURS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* PANORAMA DES 12 DÉPARTEMENTS (7 colonnes) */}
          <Card className="lg:col-span-7 border-border shadow-xl">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-bold">Observatoire Territorial des 12 Départements</CardTitle>
                  <CardDescription className="text-xs">
                    Suivi en direct de l&apos;immatriculation, de la conformité légale et des litiges CSAF.
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-[10px]">
                  77 Communes Numérisées
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 text-[11px] text-muted-foreground">
                      <th className="py-2 px-3 font-semibold">Département</th>
                      <th className="py-2 px-3 font-semibold">Parcelles Enregistrées</th>
                      <th className="py-2 px-3 font-semibold">Litiges CSAF</th>
                      <th className="py-2 px-3 font-semibold">Taux de Sécurité</th>
                      <th className="py-2 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-xs">
                    {departements.map((dep) => (
                      <tr
                        key={dep.nom}
                        className={`hover:bg-muted/40 transition cursor-pointer ${
                          selectedDepartement === dep.nom ? "bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedDepartement(dep.nom)}
                      >
                        <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span>{dep.nom}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">
                          {dep.parcelles.toLocaleString("fr-FR")}
                        </td>
                        <td className="py-2.5 px-3">
                          {dep.litiges > 0 ? (
                            <Badge variant="destructive" className="text-[9px] py-0">
                              {dep.litiges} gel(s)
                            </Badge>
                          ) : (
                            <span className="text-emerald-400 font-bold">0 litige</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold font-mono">
                          {dep.conformite}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            className="text-[11px] text-primary hover:underline font-semibold"
                          >
                            Inspecter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-primary/20 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Département sélectionné : <strong className="text-foreground">{selectedDepartement}</strong>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registre foncier synchronisé avec BéninChain
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AUDIT & CORPS DE MÉTIERS (5 colonnes) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Audit des Acteurs Agréés</CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    Contrôle Déontologique
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Surveillance continue de la célérité et de la probité des officiers ministériels.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                {corpsMetiers.map((cm) => (
                  <div key={cm.titre} className="p-3 rounded-xl bg-background/80 border border-border/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{cm.titre}</span>
                      <Badge variant={cm.statutVariant} className="text-[9px]">
                        {cm.statut}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{cm.actif} officiers actifs</span>
                      <span>Délai moyen : <strong className="text-foreground">{cm.delaiMoyen}</strong></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ACTION RÉGALIENNE : POUVOIR DE CONTRÔLE D'URGENCE */}
            <Card className="border-destructive/30 bg-destructive/5 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pouvoir Républicain d&apos;Évocation &amp; d&apos;Audit</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  En cas d&apos;alerte foncière, le Ministre peut déclencher une inspection générale immédiate.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                {inspectionMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-rise">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{inspectionMsg}</span>
                  </div>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleTriggerInspection}
                  disabled={loading}
                  className="w-full h-10 font-bold text-xs gap-1.5"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Déclencher Audit Inopiné IGAF</span>
                </Button>
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Notifie l&apos;Inspection Générale et gèle les mutations suspectes sous 24h.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
