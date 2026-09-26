"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Coins,
  FileCheck2,
  MapPin,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Scale,
  Landmark,
  Building,
  UserCheck,
  Search,
} from "lucide-react";
import { INITIAL_PARCELLES, SeedParcelle } from "@/db/seed/data";
import { formatFcfa } from "@/lib/utils";

interface NationalShowcaseProps {
  onNavigateToTab: (tabId: string) => void;
  onSelectParcelleForMap?: (code: string) => void;
}

export function NationalShowcase({ onNavigateToTab, onSelectParcelleForMap }: NationalShowcaseProps) {
  const [selectedParcelleCode, setSelectedParcelleCode] = useState<string>("OUI-0421");
  const selectedParcelle = INITIAL_PARCELLES.find((p) => p.codeUnique === selectedParcelleCode) || INITIAL_PARCELLES[0];

  const departements = [
    { nom: "Atlantique", chefLieu: "Allada / Calavi", parcelles: 6840, litiges: 3, conformite: "99.4%" },
    { nom: "Littoral", chefLieu: "Cotonou", parcelles: 5120, litiges: 1, conformite: "99.8%" },
    { nom: "Ouémé", chefLieu: "Porto-Novo", parcelles: 2450, litiges: 4, conformite: "98.9%" },
    { nom: "Borgou", chefLieu: "Parakou", parcelles: 1680, litiges: 2, conformite: "99.1%" },
    { nom: "Zou", chefLieu: "Abomey", parcelles: 1140, litiges: 2, conformite: "98.7%" },
    { nom: "Mono", chefLieu: "Lokossa", parcelles: 620, litiges: 1, conformite: "99.0%" },
    { nom: "Couffo", chefLieu: "Aplahoué", parcelles: 570, litiges: 0, conformite: "100%" },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-4">
      {/* 1. SECTION HÉRO MAJEURE RÉPUBLICAINE */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-linear-to-b from-slate-900/90 via-slate-950 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Côté gauche : Textes d'autorité & Appel à l'action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Système National de Sécurisation Foncière & Cadastre • République du Bénin</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Le Cadastre National. <br />
              <span className="text-emerald-400">Chaque parcelle vérifiée.</span> <br />
              <span className="text-amber-400">Chaque droit garanti.</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>Anyigba</strong> fédère l&apos;Agence Nationale du Domaine et du Foncier (ANDF), les 77 communes,
              la Chambre des Notaires et la Cour Spéciale des Affaires Foncières (CSAF). Zéro double vente grâce au
              verrou d&apos;opposabilité immédiat, séquestre financier TrésorPay au Compte Unique du Trésor et actes fonciers
              scellés par cryptographie d&apos;État.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 shadow-lg shadow-emerald-950/60 text-xs"
                onClick={() => onNavigateToTab("dashboard")}
              >
                <span>Accéder au Tableau de Bord National</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-bold"
                onClick={() => onNavigateToTab("scenario")}
              >
                <span>Lancer le Scénario Dossou à Pahou</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40 text-xs font-bold"
                onClick={() => onNavigateToTab("carte")}
              >
                <MapPin className="mr-1.5 h-4 w-4 text-emerald-400" />
                <span>Carte SIG Plein Écran</span>
              </Button>
            </div>
          </div>

          {/* Côté droit : Carte interactive de prévisualisation parcellaire */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <CardTitle className="text-sm font-bold text-white">Registre Parcellaire National en Direct</CardTitle>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px]">
                    Certifié ANDF
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400">
                  Sélectionnez une des parcelles témoins du territoire béninois :
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Sélecteur des parcelles */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {INITIAL_PARCELLES.map((p) => {
                    const isSelected = p.codeUnique === selectedParcelleCode;
                    let badgeColor = "text-emerald-400 border-emerald-500/30 bg-emerald-950/30";
                    if (p.enLitige) badgeColor = "text-rose-400 border-rose-500/30 bg-rose-950/30";
                    else if (p.enVerrouMutation) badgeColor = "text-amber-400 border-amber-500/30 bg-amber-950/30";
                    else if (p.statutJuridique === "CPF") badgeColor = "text-blue-400 border-blue-500/30 bg-blue-950/30";

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedParcelleCode(p.codeUnique)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/40 text-white font-bold shadow-md shadow-emerald-950/50"
                            : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-xs font-black">{p.codeUnique}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${badgeColor}`}>
                            {p.commune}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 truncate">{p.proprietaireNom}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Fiche détaillée de la parcelle sélectionnée */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Identifiant Unique Foncier</span>
                      <strong className="text-base font-black text-white font-mono">{selectedParcelle.codeUnique}</strong>
                    </div>
                    {selectedParcelle.enLitige ? (
                      <Badge variant="destructive" className="gap-1 font-bold">
                        <Scale className="w-3 h-3" />
                        <span>Litige CSAF Actif</span>
                      </Badge>
                    ) : selectedParcelle.enVerrouMutation ? (
                      <Badge variant="warning" className="gap-1 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>Verrou Notarial Actif</span>
                      </Badge>
                    ) : selectedParcelle.statutJuridique === "TITRE_FONCIER" ? (
                      <Badge variant="success" className="gap-1 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Titre Foncier (TF)</span>
                      </Badge>
                    ) : selectedParcelle.statutJuridique === "CPF" ? (
                      <Badge variant="info" className="gap-1 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Certificat CPF</span>
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-slate-300">
                        <span>Coutumier Déclaré</span>
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400">Localisation :</span>
                      <p className="font-semibold text-slate-200">{selectedParcelle.commune} ({selectedParcelle.village})</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Superficie :</span>
                      <p className="font-semibold text-slate-200">{selectedParcelle.superficieM2} m²</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Titulaire :</span>
                      <p className="font-semibold text-slate-200 truncate">{selectedParcelle.proprietaireNom}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Disponibilité :</span>
                      <p className={`font-semibold ${selectedParcelle.enLitige || selectedParcelle.enVerrouMutation ? "text-amber-400" : "text-emerald-400"}`}>
                        {selectedParcelle.enLitige ? "Inaliénable (CSAF)" : selectedParcelle.enVerrouMutation ? "Cession en cours" : "Disponible à l'achat"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      size="sm"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                      onClick={() => onNavigateToTab("carte")}
                    >
                      <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      <span>Localiser sur la Carte SIG</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:text-white text-xs"
                      onClick={() => onNavigateToTab("verification")}
                    >
                      <Search className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. GRILLE DES CHIFFRES CLÉS NATIONAUX (METRICS CARDS BMM STYLE) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-500/30 bg-slate-900/80 shadow-lg">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Parcelles Immatriculées</CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white font-mono">18 420</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% ce trimestre
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-slate-900/80 shadow-lg">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Doubles Ventes Écartées</CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-400 font-mono">312 Actes</div>
            <p className="text-xs text-slate-400 mt-1">Rejetés instantanément (409 Conflict)</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-slate-900/80 shadow-lg">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Recouvrement Trésor Public</CardTitle>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Landmark className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-white font-mono">1 245 800 000 FCFA</div>
            <p className="text-xs text-blue-400 mt-1">Encaissés via TrésorPay (CUT)</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-slate-900/80 shadow-lg">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-slate-400">Consultations Citoyennes</CardTitle>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Smartphone className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-400 font-mono">92 100+</div>
            <p className="text-xs text-slate-400 mt-1">Requêtes SMS (132) & USSD (*123*7#)</p>
          </CardContent>
        </Card>
      </section>

      {/* 3. SECTION DES 4 VERROUS TECHNOLOGIQUES & LÉGAUX */}
      <section className="space-y-6 pt-2">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-xs uppercase tracking-wider px-3 py-1">
            Architecture Régaliennne & Sécurité Juridique
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Les 4 Verrous Technologiques d&apos;Anyigba
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Une chaîne de confiance complète pour éliminer définitivement la fraude foncière au Bénin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 transition">
            <CardHeader className="p-5 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold text-white">Verrou d&apos;Opposabilité Notariale</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-400 leading-relaxed">
              Dès l&apos;ouverture d&apos;un acte de cession chez le notaire, la parcelle est immédiatement verrouillée au registre national.
              Toute tentative concurrente d&apos;enregistrement est rejetée par une fin de non-recevoir d&apos;État (409 Conflict).
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 hover:border-amber-500/50 transition">
            <CardHeader className="p-5 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">
                <Coins className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold text-white">Séquestre Financier Réglementé</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-400 leading-relaxed">
              L&apos;acheteur consigne les fonds sous séquestre Mobile Money (MTN MoMo, Moov Money, Celtiis Cash) rattaché au Trésor Public.
              Les fonds ne sont libérés au vendeur qu&apos;après le visa de l&apos;ANDF et l&apos;émission du titre officiel.
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 hover:border-blue-500/50 transition">
            <CardHeader className="p-5 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-2">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold text-white">Bornage &amp; Consentement Vocal</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-400 leading-relaxed">
              Sur le terrain rural, l&apos;agent communal relève les coordonnées GPS des 4 bornes avec contrôle de zéro-chevauchement PostGIS
              et enregistre les témoignages vocaux en langues nationales (Fongbe, Yoruba, Bariba).
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 hover:border-purple-500/50 transition">
            <CardHeader className="p-5 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold text-white">Horodatage Cryptographique SHA-256</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-400 leading-relaxed">
              Chaque plan, acte notarié et arrêté de titre foncier est scellé par une empreinte SHA-256 ancrée sur BéninChain et OpenTimestamps.
              L&apos;intégrité mathématique peut être prouvée à tout moment par les banques et tribunaux.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. COUVERTURE DÉPARTEMENTALE NATIONALE (77 COMMUNES) */}
      <section className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Déploiement Territorial dans les Départements Pilotes</h3>
            <p className="text-xs text-slate-400">
              Interconnexion en temps réel des conservations foncières départementales et des tribunaux d&apos;instance.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 text-xs font-bold"
            onClick={() => onNavigateToTab("dashboard")}
          >
            <span>Consulter la Régulation Complète</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {departements.map((d) => (
            <div key={d.nom} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{d.nom}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {d.conformite}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Pôle administratif :</span>
                  <span className="text-slate-300 font-medium">{d.chefLieu}</span>
                </div>
                <div className="flex justify-between">
                  <span>Parcelles actives :</span>
                  <span className="text-slate-200 font-bold font-mono">{d.parcelles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Litiges CSAF :</span>
                  <span className={d.litiges > 0 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                    {d.litiges} dossier{d.litiges > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
