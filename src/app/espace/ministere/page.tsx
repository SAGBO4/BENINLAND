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
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFcfa } from "@/lib/utils";

export default function MinisterePage() {
  const [selectedDepartement, setSelectedDepartement] = useState("Atlantique");
  const [inspectionMsg, setInspectionMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statsTresor = {
    recettesFiscalesCut: "1 245 800 000 FCFA",
    droitsMutationCut: "489 200 000 FCFA",
    taxesPlusValueCommunes: "142 500 000 FCFA",
    fondsTransactionsSurveillees: "384 000 000 FCFA",
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
      titre: "Chambre des Notaires du Bénin",
      actif: 42,
      dossiersTraites: 184,
      delaiMoyen: "48h",
      statut: "Conforme",
      statutVariant: "success" as const,
    },
    {
      titre: "Inspecteurs du Cadastre (ANDF)",
      actif: 28,
      dossiersTraites: 156,
      delaiMoyen: "24h",
      statut: "Cadence Optimale",
      statutVariant: "success" as const,
    },
    {
      titre: "Ordre des Géomètres-Experts",
      actif: 64,
      dossiersTraites: 312,
      delaiMoyen: "72h",
      statut: "Bornes Certifiées PostGIS",
      statutVariant: "info" as const,
    },
    {
      titre: "Agents Fonciers de Terrain (Communes)",
      actif: 120,
      dossiersTraites: 420,
      delaiMoyen: "PV de Bornage & Voix",
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

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* BANNIÈRE RÉGALIENNE : DIRECTION GÉNÉRALE & RÉGULATION MINISTÉRIELLE */}
        <Card className="border-secondary/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                      Direction Générale — Tableau de Bord et Régulation Ministérielle
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2.5">
                      Haute Tutelle Souveraine
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Ministère du Cadre de Vie, des Transports et du Développement Durable &bull; Ministère de l&apos;Économie et des Finances
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Session Ministérielle</span>
                  <strong className="text-foreground">Cabinet du Ministre &bull; Inspection Générale</strong>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* SECTION TRÉSOR PUBLIC DU BÉNIN : FLUX FINANCIERS RÉGALIENS (DGTCP / CUT) */}
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
            <Card className="p-5 space-y-2 border-secondary/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Recettes Fiscales Versées au Trésor</span>
                <Landmark className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-secondary font-mono">
                {statsTresor.recettesFiscalesCut}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Encaissés via le guichet national <strong className="text-foreground">TrésorPay</strong>
              </p>
            </Card>

            <Card className="p-5 space-y-2 border-primary/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Droits de Mutation &amp; Enregistrement</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground font-mono">
                {statsTresor.droitsMutationCut}
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold">
                +18.4% de recouvrement fiscal vs exercice 2025
              </p>
            </Card>

            <Card className="p-5 space-y-2 border-blue-500/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Taxes Plus-Values (77 Mairies)</span>
                <Building className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
                {statsTresor.taxesPlusValueCommunes}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Reversés directement aux budgets communaux
              </p>
            </Card>

            <Card className="p-5 space-y-2 border-purple-500/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Transactions Privées Sous Séquestre</span>
                <Lock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
                {statsTresor.fondsTransactionsSurveillees}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Consignés jusqu&apos;à validation finale de l&apos;ANDF
              </p>
            </Card>
          </div>
        </section>

        {/* GRILLE CENTRALE : PANORAMA DES DÉPARTEMENTS & AUDIT DÉONTOLOGIQUE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* PANORAMA DES 12 DÉPARTEMENTS (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-foreground">
                    Cartographie Départementale de Conformité Cadastrale
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Suivi en temps réel de l&apos;immatriculation, de la conformité légale et des litiges CSAF.
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
                      <th className="py-2.5 px-3 font-semibold">Département</th>
                      <th className="py-2.5 px-3 font-semibold">Parcelles Enregistrées</th>
                      <th className="py-2.5 px-3 font-semibold">Litiges CSAF</th>
                      <th className="py-2.5 px-3 font-semibold">Taux de Sécurité</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Statut</th>
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
                        <td className="py-3 px-3 font-bold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span>{dep.nom}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-muted-foreground">
                          {dep.parcelles.toLocaleString("fr-FR")}
                        </td>
                        <td className="py-3 px-3">
                          {dep.litiges > 0 ? (
                            <Badge variant="destructive" className="text-[10px] py-0.5">
                              {dep.litiges} instance(s)
                            </Badge>
                          ) : (
                            <span className="text-emerald-400 font-bold">0 litige</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-emerald-400 font-bold font-mono">
                          {dep.conformite}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Badge variant="outline" className="text-[10px]">
                            Surveillé
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Département actif : <strong className="text-foreground">{selectedDepartement}</strong>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-4 h-4" /> Registre foncier certifié conforme
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AUDIT DÉONTOLOGIQUE & CORPS DE MÉTIERS (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-foreground">
                    Contrôle Déontologique &amp; Audit des Acteurs
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    Ordres &amp; Chambres
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Surveillance continue de la célérité et de la probité des études notariales et géomètres.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                {corpsMetiers.map((cm) => (
                  <div key={cm.titre} className="p-3.5 rounded-xl bg-background/80 border border-border space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{cm.titre}</span>
                      <Badge variant={cm.statutVariant} className="text-[10px]">
                        {cm.statut}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                      <span>{cm.actif} professionnels agréés</span>
                      <span>Délai moyen : <strong className="text-foreground">{cm.delaiMoyen}</strong></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* ACTION RÉGALIENNE : POUVOIR D'ÉVOCATION ET D'INSPECTION INOPINÉE */}
            <Card className="border-destructive/30 bg-destructive/5 shadow-xl">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Pouvoir Régalien d&apos;Évocation et d&apos;Audit Inopiné</span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Réquisitionner l&apos;Inspection Générale des Affaires Foncières (IGAF) pour le contrôle immédiat d&apos;un dossier suspect.
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
                  className="w-full h-10 font-bold text-xs gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Réquisitionner Audit Inopiné IGAF</span>
                </Button>
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Déclenche l&apos;ouverture immédiate des scellés cryptographiques et le gel conservatoire des parcelles visées.
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
