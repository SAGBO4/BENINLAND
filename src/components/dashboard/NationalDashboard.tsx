"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MapPin,
  FileText,
  Filter,
} from "lucide-react";
import { INITIAL_PARCELLES, SeedParcelle } from "@/db/seed/data";
import { anyigbaRepo } from "@/repositories/index";
import { formatFcfa } from "@/lib/utils";

interface NationalDashboardProps {
  onNavigateToTab: (tabId: string) => void;
  onSelectParcelle?: (parcelle: SeedParcelle) => void;
}

export function NationalDashboard({ onNavigateToTab, onSelectParcelle }: NationalDashboardProps) {
  const [parcelles] = useState<SeedParcelle[]>(anyigbaRepo.getAllParcelles());
  const [mutations] = useState<any[]>(anyigbaRepo.getAllMutations());
  const [communeFilter, setCommuneFilter] = useState("TOUS");
  const [statutFilter, setStatutFilter] = useState("TOUS");
  const [searchTerm, setSearchTerm] = useState("");
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const statsTresor = {
    recettesFiscalesCut: 1245800000,
    droitsMutationCut: 489200000,
    taxesPlusValueCommunes: 142500000,
    fondsTransactionsSurveillees: 384000000,
  };

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

  const filteredParcelles = parcelles.filter((p) => {
    if (communeFilter !== "TOUS" && p.commune !== communeFilter) return false;
    if (statutFilter === "TF" && p.statutJuridique !== "TITRE_FONCIER") return false;
    if (statutFilter === "CPF" && p.statutJuridique !== "CPF") return false;
    if (statutFilter === "COUTUMIER" && p.statutJuridique !== "COUTUMIER") return false;
    if (statutFilter === "LITIGE" && !p.enLitige) return false;
    if (statutFilter === "VERROU" && !p.enVerrouMutation) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.codeUnique.toLowerCase().includes(term) ||
        p.proprietaireNom.toLowerCase().includes(term) ||
        p.commune.toLowerCase().includes(term) ||
        p.village.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleAuditRequest = () => {
    setLoadingAudit(true);
    setAuditMessage(null);
    setTimeout(() => {
      setLoadingAudit(false);
      setAuditMessage(
        "Ordre de mission ministériel transmis avec succès à l'Inspection Générale des Affaires Foncières (IGAF). Audit contradictoire programmé avec réquisition immédiate des registres cryptographiques."
      );
    }, 600);
  };

  return (
    <div className="space-y-8 py-4">
      {/* 1. EN-TÊTE RÉGALIEN DU MINISTÈRE & TRÉSOR PUBLIC */}
      <Card className="border-slate-800 bg-linear-to-r from-slate-900 via-slate-900/90 to-slate-950 shadow-xl">
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 shadow-lg shadow-amber-950/40">
                <Landmark className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-xl sm:text-2xl font-black text-white">
                    Tableau de Bord National &amp; Régulation Ministérielle
                  </CardTitle>
                  <Badge variant="outline" className="border-amber-500/30 bg-amber-950/40 text-amber-300 text-[10px] font-bold">
                    Haute Tutelle Souveraine
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Ministère du Cadre de Vie, des Transports et du Foncier &bull; Trésor Public (DGTCP / TrésorPay) &bull; ANDF
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold"
                onClick={handleAuditRequest}
                disabled={loadingAudit}
              >
                {loadingAudit ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    <span>Réquisitionner Audit IGAF</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerte audit */}
      {auditMessage && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-rise">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="leading-relaxed font-semibold">{auditMessage}</span>
        </div>
      )}

      {/* 2. FLUX FINANCIERS RÉGALIENS AU TRÉSOR PUBLIC */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <DollarSign className="w-4 h-4" />
            <span>Souveraineté Financière : Trésor Public du Bénin (Compte Unique du Trésor)</span>
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-950/20">
            Guichet National TrésorPay Actif
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-amber-500/30 bg-slate-900/80 shadow-lg">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-400">Recettes Fiscales du Foncier</span>
              <Landmark className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {formatFcfa(statsTresor.recettesFiscalesCut)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Encaissés au Compte Unique du Trésor</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/30 bg-slate-900/80 shadow-lg">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-400">Droits d&apos;Enregistrement &amp; Mutation</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatFcfa(statsTresor.droitsMutationCut)}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-semibold">+18.4% de recouvrement vs 2025</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-slate-900/80 shadow-lg">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-400">Taxes Plus-Values (77 Mairies)</span>
              <Building className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-blue-400 font-mono">
                {formatFcfa(statsTresor.taxesPlusValueCommunes)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Reversement aux budgets communaux</p>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-slate-900/80 shadow-lg">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-slate-400">Fonds Consignés sous Séquestre</span>
              <Lock className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-purple-400 font-mono">
                {formatFcfa(statsTresor.fondsTransactionsSurveillees)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Garantis jusqu&apos;à validation finale ANDF</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. TABLEAU NATIONAL DES PARCELLES AVEC FILTRES HAUTE DENSITÉ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Registre Parcellaire National des Titres et Droits</h3>
            <p className="text-xs text-slate-400">
              {filteredParcelles.length} parcelle{filteredParcelles.length > 1 ? "s" : ""} affichée{filteredParcelles.length > 1 ? "s" : ""} selon les critères réglementaires.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher code, nom..."
                className="pl-8 h-8 text-xs bg-slate-900 border-slate-800 w-44"
              />
            </div>

            <select
              value={communeFilter}
              onChange={(e) => setCommuneFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium"
            >
              <option value="TOUS">Toutes Communes</option>
              <option value="Ouidah">Ouidah</option>
              <option value="Abomey-Calavi">Abomey-Calavi</option>
              <option value="Allada">Allada</option>
              <option value="Cotonou">Cotonou</option>
              <option value="Kpomassè">Kpomassè</option>
            </select>

            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium"
            >
              <option value="TOUS">Tous Régimes</option>
              <option value="TF">Titre Foncier (TF)</option>
              <option value="CPF">Certificat CPF</option>
              <option value="COUTUMIER">Droit Coutumier</option>
              <option value="VERROU">Mutation Verrouillée</option>
              <option value="LITIGE">En Litige CSAF</option>
            </select>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-bold">
                <tr>
                  <th className="py-3 px-4">Code Unique</th>
                  <th className="py-3 px-4">Localisation</th>
                  <th className="py-3 px-4">Superficie</th>
                  <th className="py-3 px-4">Régime Juridique</th>
                  <th className="py-3 px-4">Titulaire Déclaré</th>
                  <th className="py-3 px-4">Statut d&apos;Opposabilité</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredParcelles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">{p.codeUnique}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-200">{p.commune}</span>
                      <span className="text-slate-400 block text-[11px]">{p.village} ({p.arrondissement})</span>
                    </td>
                    <td className="py-3 px-4 font-mono">{p.superficieM2.toLocaleString("fr-FR")} m²</td>
                    <td className="py-3 px-4">
                      {p.statutJuridique === "TITRE_FONCIER" ? (
                        <Badge variant="success" className="text-[10px] font-bold">Titre Foncier</Badge>
                      ) : p.statutJuridique === "CPF" ? (
                        <Badge variant="info" className="text-[10px] font-bold">Certificat CPF</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-slate-400">Droit Coutumier</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-200">{p.proprietaireNom}</span>
                      <span className="text-slate-400 font-mono block text-[10px]">{p.proprietaireNpi}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.enLitige ? (
                        <Badge variant="destructive" className="gap-1 text-[10px] font-bold">
                          <Scale className="w-3 h-3" />
                          <span>Gel CSAF Actif</span>
                        </Badge>
                      ) : p.enVerrouMutation ? (
                        <Badge variant="warning" className="gap-1 text-[10px] font-bold">
                          <Lock className="w-3 h-3" />
                          <span>Verrou Notarié</span>
                        </Badge>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Actif &amp; Régulier</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800"
                          onClick={() => {
                            if (onSelectParcelle) onSelectParcelle(p);
                            onNavigateToTab("carte");
                          }}
                        >
                          <MapPin className="w-3 h-3 mr-1 text-emerald-400" />
                          <span>SIG</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* 4. PERFORMANCE DES CORPS DE MÉTIERS RÉGALIENS */}
      <section className="space-y-4 pt-2">
        <h3 className="text-lg font-bold text-white">Cadence Opérationnelle des Acteurs Institutionnels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {corpsMetiers.map((corps) => (
            <Card key={corps.titre} className="border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{corps.titre}</span>
                <Badge variant={corps.statutVariant} className="text-[10px] font-bold">
                  {corps.statut}
                </Badge>
              </div>
              <div className="space-y-1.5 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Opérateurs actifs :</span>
                  <strong className="text-slate-200">{corps.actif} certifiés</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dossiers instruits :</span>
                  <strong className="text-white font-mono">{corps.dossiersTraites}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Délai moyen constaté :</span>
                  <strong className="text-emerald-400 font-bold">{corps.delaiMoyen}</strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
