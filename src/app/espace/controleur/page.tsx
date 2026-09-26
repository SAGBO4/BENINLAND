"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  Building2,
  FileCheck2,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  Briefcase,
  MapPin,
  RefreshCw,
  BadgeAlert,
  Landmark,
  Scale,
  Ban,
  FileSignature,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { UserRole, UserSession, AccountStatus } from "@/lib/auth-session";

export default function ControleurPage() {
  const {
    user,
    getRegisteredAccounts,
    validateAccount,
    rejectAccount,
    suspendAccount,
    controllerMandate,
  } = useAuth();

  const [accounts, setAccounts] = useState<UserSession[]>([]);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [rejectModalNpi, setRejectModalNpi] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const refreshAccounts = () => {
    const list = getRegisteredAccounts();
    setAccounts(list);
  };

  useEffect(() => {
    refreshAccounts();
  }, []);

  const handleValidate = (npi: string, name: string) => {
    validateAccount(npi, `${controllerMandate.prenom} ${controllerMandate.nom} (Contrôleur National)`);
    refreshAccounts();
    setActionFeedback(`Habilitation officielle certifiée pour ${name} (${npi}). Le compte est désormais opérationnel.`);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const handleOpenReject = (npi: string) => {
    setRejectModalNpi(npi);
    setRejectReason("NPI non concordant avec le registre corporatif national ou justificatifs d'exercice incomplets.");
  };

  const handleConfirmReject = () => {
    if (!rejectModalNpi) return;
    rejectAccount(rejectModalNpi, rejectReason);
    setRejectModalNpi(null);
    refreshAccounts();
    setActionFeedback(`La demande (${rejectModalNpi}) a été rejetée pour motif déontologique.`);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const handleSuspend = (npi: string, name: string) => {
    suspendAccount(npi, "Mesure conservatoire ordonnée dans l'attente de vérification complémentaire.");
    refreshAccounts();
    setActionFeedback(`Le compte de ${name} a été suspendu par mesure conservatoire.`);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  // Filtrage
  const filteredAccounts = accounts.filter((acc) => {
    const matchRole = filterRole === "ALL" || acc.role === filterRole;
    const matchStatus = filterStatus === "ALL" || acc.statutValidation === filterStatus;
    const matchQuery =
      searchQuery === "" ||
      `${acc.nom} ${acc.prenom} ${acc.npi} ${acc.etablissementNom} ${acc.commune}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchRole && matchStatus && matchQuery;
  });

  const pendingCount = accounts.filter((a) => a.statutValidation === "EN_ATTENTE_VALIDATION").length;
  const validCount = accounts.filter((a) => a.statutValidation === "VALIDE").length;
  const rejectedCount = accounts.filter((a) => a.statutValidation === "REJETE").length;
  const suspendedCount = accounts.filter((a) => a.statutValidation === "SUSPENDU").length;

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* BANNIÈRE RÉGALIENNE DU CONTRÔLEUR & TUTELLE MINISTÉRIELLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0a3764]/10 border border-[#0a3764]/20 flex items-center justify-center text-[#0a3764] shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  Inspection Générale des Affaires Foncières (IGAF)
                </h1>
                <Badge
                  variant={controllerMandate.active ? "default" : "destructive"}
                  className="text-[10px] uppercase font-bold tracking-wider"
                >
                  {controllerMandate.active ? "Mandat Actif • Habilité par le Ministère" : "Mandat Suspendu par le Ministère"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-3xl leading-relaxed">
                Contrôle déontologique d&apos;attribution des rôles, instruction des demandes d&apos;habilitation et délivrance des prérogatives républicaines.
                <span className="block mt-0.5 font-medium text-slate-700 dark:text-slate-300">
                  Titulaire en charge : <strong>{controllerMandate.prenom} {controllerMandate.nom}</strong> ({controllerMandate.npi}) • {controllerMandate.supervisePar}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshAccounts}
              className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser le Registre</span>
            </Button>
          </div>
        </div>

        {/* FEEDBACK ACTION */}
        {actionFeedback && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold leading-relaxed">{actionFeedback}</span>
          </div>
        )}

        {/* KPI STATISTIQUES DES HABILITATIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Card className="p-5 border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Demandes en Attente</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
              {pendingCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Nécessitent une validation réglementaire</p>
          </Card>

          <Card className="p-5 border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Habilitations Certifiées</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {validCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Acteurs autorisés sur le cadastre national</p>
          </Card>

          <Card className="p-5 border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Dossiers Non-Conformes / Rejetés</span>
              <UserX className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 font-mono">
              {rejectedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Refusés pour non concordance NPI/qualité</p>
          </Card>

          <Card className="p-5 border-border bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Mesures Conservatoires</span>
              <Ban className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-2 font-mono">
              {suspendedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Comptes suspendus temporairement</p>
          </Card>
        </div>

        {/* CADRE RÉGLEMENTAIRE ET RÈGLE D'OR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Principe Républicain de Hiérarchie des Prérogatives</div>
            <p className="text-xs leading-relaxed text-amber-800/90 dark:text-amber-300/90">
              Selon le Code Foncier et Domanial et les directives du Ministère du Cadre de Vie, aucun individu ne peut s&apos;attribuer de son propre chef la qualité de <strong>Notaire</strong>, d&apos;<strong>Agent Cadastral</strong>, de <strong>Maire/Agent Communal</strong>, d&apos;<strong>Analyste Bancaire</strong>, de <strong>Juge CSAF</strong> ou de membre de l&apos;<strong>ANDF</strong> sans certification préalable de son NPI auprès de l&apos;Inspection Générale des Affaires Foncières (IGAF).
            </p>
          </div>
        </div>

        {/* REGISTRE D'INSTRUCTION ET GESTION DES COMPTES */}
        <Card className="border-border bg-card shadow-lg">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base sm:text-lg font-bold">
                  Registre National des Demandes d&apos;Habilitation &amp; Statuts
                </CardTitle>
                <CardDescription className="text-xs">
                  Validez ou refusez les demandes d&apos;accès conformément à la grille d&apos;habilitation de l&apos;État.
                </CardDescription>
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value="EN_ATTENTE_VALIDATION">En attente uniquement ({pendingCount})</option>
                  <option value="VALIDE">Validés ({validCount})</option>
                  <option value="REJETE">Rejetés ({rejectedCount})</option>
                  <option value="SUSPENDU">Suspendus ({suspendedCount})</option>
                </select>

                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="ALL">Tous les corps de métier</option>
                  <option value="NOTAIRE">Notaires</option>
                  <option value="AGENT">Agents Cadastraux / Géomètres</option>
                  <option value="COMMUNE">Mairies / Communes</option>
                  <option value="BANQUE">Banques</option>
                  <option value="CSAF">Cour CSAF</option>
                  <option value="ANDF">ANDF</option>
                  <option value="CITOYEN">Citoyens</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche par nom, NPI, commune..."
                    className="rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none w-48 sm:w-60"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">
                Aucun compte ne correspond aux critères de filtre sélectionnés.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Acteur &amp; NPI ANIP</th>
                      <th className="py-3.5 px-4">Qualité &amp; Rôle Sollicité</th>
                      <th className="py-3.5 px-4">Structure &amp; Commune</th>
                      <th className="py-3.5 px-4">Date de Demande</th>
                      <th className="py-3.5 px-4">Statut Habilitation</th>
                      <th className="py-3.5 px-4 text-right">Décision du Contrôleur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAccounts.map((acc) => {
                      const isPending = acc.statutValidation === "EN_ATTENTE_VALIDATION";
                      const isValid = acc.statutValidation === "VALIDE";
                      const isRejected = acc.statutValidation === "REJETE";
                      const isSuspended = acc.statutValidation === "SUSPENDU";

                      return (
                        <tr key={acc.npi} className="hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-bold text-foreground text-sm">
                              {acc.prenom} {acc.nom}
                            </div>
                            <div className="font-mono text-[11px] text-primary flex items-center gap-1 mt-0.5">
                              <span>NPI : {acc.npi}</span>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <Badge variant="outline" className="font-bold text-[11px]">
                              {acc.role}
                            </Badge>
                            <div className="text-[11px] text-muted-foreground mt-1 truncate max-w-[200px]">
                              {acc.titre || acc.roleLabel}
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-medium text-foreground truncate max-w-[200px]">
                              {acc.etablissementNom || "Non spécifié"}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                              <MapPin className="w-3 h-3 text-muted-foreground/70" />
                              <span>{acc.commune} ({acc.departement})</span>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-muted-foreground">
                            <div>{acc.dateDemande || "Dossier Initial"}</div>
                            {acc.dateValidation && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                                Validé le {acc.dateValidation}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                                <Clock className="w-3 h-3 animate-pulse" />
                                <span>En attente de validation</span>
                              </span>
                            )}
                            {isValid && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Habilité &amp; Conforme</span>
                              </span>
                            )}
                            {isRejected && (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                                  <UserX className="w-3 h-3" />
                                  <span>Demande Rejetée</span>
                                </span>
                                {acc.motifRefus && (
                                  <p className="text-[10px] text-rose-600/90 italic truncate max-w-[180px]">
                                    {acc.motifRefus}
                                  </p>
                                )}
                              </div>
                            )}
                            {isSuspended && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20">
                                <Ban className="w-3 h-3" />
                                <span>Suspendu</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isPending && (
                                <>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleValidate(acc.npi, `${acc.prenom} ${acc.nom}`)}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 h-8 cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Valider</span>
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleOpenReject(acc.npi)}
                                    className="font-bold text-xs flex items-center gap-1 h-8 cursor-pointer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Rejeter</span>
                                  </Button>
                                </>
                              )}

                              {isValid && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuspend(acc.npi, `${acc.prenom} ${acc.nom}`)}
                                  className="text-orange-700 dark:text-orange-400 border-orange-300 font-bold text-xs flex items-center gap-1 h-8 cursor-pointer hover:bg-orange-50"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Suspendre</span>
                                </Button>
                              )}

                              {(isRejected || isSuspended) && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleValidate(acc.npi, `${acc.prenom} ${acc.nom}`)}
                                  className="text-emerald-700 border-emerald-300 font-bold text-xs flex items-center gap-1 h-8 cursor-pointer hover:bg-emerald-50"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Réhabiliter</span>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* MODAL DE REJET AVEC MOTIF DÉONTOLOGIQUE */}
        {rejectModalNpi && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-rise">
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-base font-bold text-foreground">
                  Motivation Réglementaire du Rejet
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Veuillez consigner le motif de non-conformité déontologique pour le NPI <strong>{rejectModalNpi}</strong>. Ce motif sera notifié à l&apos;usager et archivé au journal d&apos;audit sous supervision ministérielle.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Indiquez la raison du rejet..."
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectModalNpi(null)}
                  className="text-xs cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmReject}
                  className="text-xs font-bold cursor-pointer"
                >
                  Confirmer le Rejet Déontologique
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
