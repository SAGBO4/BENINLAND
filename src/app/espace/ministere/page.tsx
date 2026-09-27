"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  Landmark,
  ShieldCheck,
  Scale,
  Building2,
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
  Ban,
  ExternalLink,
  ChevronRight,
  FileText,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface DepartementStat {
  nom: string;
  chefLieu: string;
  parcelles: number;
  litiges: number;
  conformite: string;
  titresDelivres: number;
}

export default function MinisterePage() {
  const [selectedDepartement, setSelectedDepartement] = useState("Atlantique");
  const [deptSearch, setDeptSearch] = useState("");
  const [inspectionMsg, setInspectionMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statsTresor = {
    recettesFiscalesCut: "1 245 800 000 FCFA",
    droitsMutationCut: "489 200 000 FCFA",
    taxesPlusValueCommunes: "142 500 000 FCFA",
    fondsTransactionsSurveillees: "384 000 000 FCFA",
  };

  // Les 12 Départements de la République du Bénin
  const departements: DepartementStat[] = [
    { nom: "Atlantique", chefLieu: "Allada", parcelles: 6840, litiges: 3, conformite: "99.4%", titresDelivres: 5410 },
    { nom: "Littoral", chefLieu: "Cotonou", parcelles: 5120, litiges: 1, conformite: "99.8%", titresDelivres: 4980 },
    { nom: "Ouémé", chefLieu: "Porto-Novo", parcelles: 2450, litiges: 4, conformite: "98.9%", titresDelivres: 1920 },
    { nom: "Borgou", chefLieu: "Parakou", parcelles: 1680, litiges: 2, conformite: "99.1%", titresDelivres: 1250 },
    { nom: "Zou", chefLieu: "Abomey", parcelles: 1140, litiges: 2, conformite: "98.7%", titresDelivres: 890 },
    { nom: "Collines", chefLieu: "Dassa-Zoumè", parcelles: 1230, litiges: 3, conformite: "98.8%", titresDelivres: 940 },
    { nom: "Mono", chefLieu: "Lokossa", parcelles: 620, litiges: 1, conformite: "99.0%", titresDelivres: 480 },
    { nom: "Couffo", chefLieu: "Aplahoué", parcelles: 570, litiges: 0, conformite: "100%", titresDelivres: 460 },
    { nom: "Atacora", chefLieu: "Natitingou", parcelles: 890, litiges: 1, conformite: "99.2%", titresDelivres: 670 },
    { nom: "Donga", chefLieu: "Djougou", parcelles: 740, litiges: 0, conformite: "100%", titresDelivres: 580 },
    { nom: "Alibori", chefLieu: "Kandi", parcelles: 980, litiges: 2, conformite: "98.5%", titresDelivres: 720 },
    { nom: "Plateau", chefLieu: "Pobè", parcelles: 810, litiges: 1, conformite: "99.1%", titresDelivres: 610 },
  ];

  const corpsMetiers = [
    {
      titre: "Chambre Nationale des Notaires du Bénin",
      actif: 42,
      dossiersTraites: 184,
      delaiMoyen: "48h",
      statut: "Conforme",
      statutVariant: "success" as const,
    },
    {
      titre: "Conservations Foncières (ANDF)",
      actif: 28,
      dossiersTraites: 156,
      delaiMoyen: "24h",
      statut: "Cadence Optimale",
      statutVariant: "success" as const,
    },
    {
      titre: "Ordre des Géomètres-Experts (OGE)",
      actif: 64,
      dossiersTraites: 312,
      delaiMoyen: "72h",
      statut: "Bornes Certifiées PostGIS",
      statutVariant: "info" as const,
    },
    {
      titre: "Services Fonciers Communaux (77 Mairies)",
      actif: 120,
      dossiersTraites: 420,
      delaiMoyen: "Procès-Verbaux & Voix",
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
        "Ordonnance ministérielle d'audit transmise à l'Inspection Générale des Affaires Foncières (IGAF). Contrôle inopiné programmé sous 24h avec réquisition des registres cryptographiques."
      );
    }, 500);
  };

  const { controllerMandate, toggleControllerMandate, getRegisteredAccounts } = useAuth();
  const registeredAccounts = getRegisteredAccounts();
  const pendingAccountsCount = registeredAccounts.filter((a) => a.statutValidation === "EN_ATTENTE_VALIDATION").length;
  const validAccountsCount = registeredAccounts.filter((a) => a.statutValidation === "VALIDE").length;
  const rejectedAccountsCount = registeredAccounts.filter((a) => a.statutValidation === "REJETE").length;

  const filteredDepartements = departements.filter(
    (d) =>
      d.nom.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.chefLieu.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const selectedDeptData = departements.find((d) => d.nom === selectedDepartement) || departements[0];

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
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
                <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">Session Ministérielle Active</span>
                  <strong className="text-foreground">Cabinet du Ministre &bull; Inspection Générale</strong>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* SECTION HAUTE TUTELLE : SUPERVISION DIRECTE DU CONTRÔLEUR DES HABILITATIONS */}
        <Card className="border-primary/40 bg-card/95 shadow-lg overflow-hidden">
          <CardHeader className="p-5 sm:p-6 pb-3 border-b border-border bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base sm:text-lg font-bold">
                      Tutelle Ministérielle &amp; Contrôle des Habilitations (IGAF)
                    </CardTitle>
                    <Badge
                      variant={controllerMandate.active ? "default" : "destructive"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {controllerMandate.active ? "Mandat Délégué Actif" : "Mandat Suspendu"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    Le Ministère délègue et supervise l&apos;autorité d&apos;attribution des rôles réglementaires confiée au Contrôleur Général.
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={controllerMandate.active ? "destructive" : "default"}
                  onClick={() => toggleControllerMandate(!controllerMandate.active)}
                  className="text-xs font-bold h-8 cursor-pointer flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>
                    {controllerMandate.active ? "Suspendre le Contrôleur" : "Rétablir le Mandat"}
                  </span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  asChild
                  className="text-xs font-bold h-8 cursor-pointer"
                >
                  <Link href="/espace/controleur" className="flex items-center gap-1">
                    <span>Console Contrôleur</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  Contrôleur Nommé par Décret
                </span>
                <div className="text-sm font-bold text-foreground">
                  {controllerMandate.prenom} {controllerMandate.nom}
                </div>
                <div className="font-mono text-[11px] text-primary">{controllerMandate.npi}</div>
                <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border mt-1">
                  {controllerMandate.decretReference}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  Statistiques des Habilitations Contrôlées
                </span>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                      {pendingAccountsCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-semibold">En attente</div>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {validAccountsCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-semibold">Validés</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <div className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
                      {rejectedAccountsCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-semibold">Rejetés</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Pouvoir Républicain de Révocation &amp; d&apos;Audit
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    Le Ministre dispose d&apos;un droit de réformation immédiat sur toute attribution de qualité (notariat, géomètre, banque) prononcée par l&apos;IGAF.
                  </p>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Registre cryptographique synchronisé avec la présidence</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION TRÉSOR PUBLIC DU BÉNIN : FLUX FINANCIERS RÉGALIENS (DGTCP / CUT) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
              <DollarSign className="w-4 h-4 text-secondary" />
              <span>Souveraineté Financière : Trésor Public du Bénin (DGTCP / TrésorPay)</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Compte Unique du Trésor (CUT) Actif
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-2 border-secondary/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Recettes Fiscales au Trésor</span>
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
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                +18.4% de recouvrement fiscal vs exercice 2025
              </p>
            </Card>

            <Card className="p-5 space-y-2 border-blue-500/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Taxes Plus-Values (77 Mairies)</span>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {statsTresor.taxesPlusValueCommunes}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Reversés directement aux budgets communaux
              </p>
            </Card>

            <Card className="p-5 space-y-2 border-purple-500/40 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Transactions Privées Sous Séquestre</span>
                <Lock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {statsTresor.fondsTransactionsSurveillees}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Consignés jusqu&apos;à validation finale de l&apos;ANDF
              </p>
            </Card>
          </div>
        </section>

        {/* GRILLE CENTRALE : PANORAMA DES 12 DÉPARTEMENTS & AUDIT DÉONTOLOGIQUE */}
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
                    Suivi en temps réel des 12 départements, de l&apos;immatriculation foncière et des litiges CSAF.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-36 sm:w-44">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Filtrer..."
                      value={deptSearch}
                      onChange={(e) => setDeptSearch(e.target.value)}
                      className="h-8 pl-8 text-xs bg-background"
                    />
                  </div>
                  <Badge variant="default" className="text-[10px] shrink-0">
                    77 Communes
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Département</TableHead>
                      <TableHead>Chef-Lieu</TableHead>
                      <TableHead>Parcelles</TableHead>
                      <TableHead>Litiges CSAF</TableHead>
                      <TableHead>Sécurité</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartements.map((dep) => (
                      <TableRow
                        key={dep.nom}
                        className={`cursor-pointer transition-colors ${
                          selectedDepartement === dep.nom ? "bg-primary/10" : ""
                        }`}
                        onClick={() => setSelectedDepartement(dep.nom)}
                      >
                        <TableCell className="font-bold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span>{dep.nom}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">
                          {dep.chefLieu}
                        </TableCell>
                        <TableCell className="font-mono text-foreground">
                          {dep.parcelles.toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          {dep.litiges > 0 ? (
                            <Badge variant="destructive" className="text-[10px] py-0.5">
                              {dep.litiges} instance(s)
                            </Badge>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 litige</span>
                          )}
                        </TableCell>
                        <TableCell className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                          {dep.conformite}
                        </TableCell>
                        <TableCell className="text-right">
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-3.5 rounded-xl bg-background/80 border border-border flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="text-muted-foreground">
                  Département sélectionné : <strong className="text-foreground">{selectedDeptData.nom}</strong> ({selectedDeptData.chefLieu}) &bull;{" "}
                  <span className="font-mono text-primary font-bold">{selectedDeptData.titresDelivres}</span> titres CPF scellés
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
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
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-rise">
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
