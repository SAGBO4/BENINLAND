"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Landmark, ShieldCheck, CheckCircle2, Search, ArrowRight, FileCheck, Coins, Scale, AlertTriangle, Lock } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";

export default function BanquePage() {
  const { user } = useAuth();
  const [codeQuery, setCodeQuery] = useState("OUI-0104");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState("25000000");

  const [result, setResult] = useState<any>({
    code: "OUI-0104",
    statut: "TITRE_FONCIER",
    proprietaire: "Famille Houessou",
    proprietaireNpi: "FICTIF-BEN-2026-0004",
    commune: "Ouidah",
    surfaceM2: 2400,
    valeurEstimee: 48000000,
    enVerrouMutation: false,
    enLitige: false,
    hypothequeInscrite: false,
  });

  const handleVerify = async () => {
    const code = codeQuery.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/v1/verification/${encodeURIComponent(code)}`);
      const json = await res.json();
      if (res.ok && json.success) {
        const p = json.data;
        const estTitre = p.statutJuridique === "TITRE_FONCIER" || p.statutJuridique === "CPF";
        const estimatedVal = (p.superficieM2 || 1000) * (estTitre ? 20000 : 8000);

        setResult({
          code: p.codeUnique,
          statut: p.statutJuridique,
          proprietaire: p.proprietaireNom,
          proprietaireNpi: p.proprietaireNpi,
          commune: p.commune,
          surfaceM2: p.superficieM2,
          valeurEstimee: estimatedVal,
          enVerrouMutation: p.enVerrouMutation,
          enLitige: p.enLitige,
          hypothequeInscrite: false,
        });
      } else {
        setErrorMsg(json.error || "Parcelle introuvable dans le cadastre national.");
      }
    } catch (e) {
      setErrorMsg("Erreur réseau lors de l'interrogation du registre foncier.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMortgage = () => {
    if (!result) return;
    if (result.enLitige || result.enVerrouMutation) {
      setErrorMsg("Inscription refusée : La parcelle fait l'objet d'un verrou légal ou d'une instance CSAF.");
      return;
    }

    setResult((prev: any) => ({ ...prev, hypothequeInscrite: true, montantCredit: Number(creditAmount) }));
    setSuccessMsg(
      `Sûreté réelle de Rang 1 inscrite avec succès sur la parcelle ${result.code} pour un montant garanti de ${formatFcfa(Number(creditAmount))}. Mention transmise au Livre Foncier de l'ANDF.`
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Banque dynamique */}
        <Card className="border-cyan-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                  <Landmark className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Portail Bancaire &amp; Guichet des Sûretés Réelles
                    </CardTitle>
                    <Badge variant="info" className="text-[10px] uppercase font-bold px-2.5">
                      Garanties Hypothécaires
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Vérification d&apos;authenticité des Titres Fonciers, inscription électronique de sûretés et sécurisation du crédit
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Établissement Agréé</span>
                <strong className="text-foreground">
                  {user?.etablissementNom || "Banque Nationale du Bénin (BNB)"} &bull; {user?.prenom} {user?.nom}
                </strong>
                <span className="block text-[10px] font-mono text-muted-foreground mt-0.5">
                  NPI Analyste : {user?.npi || "FICTIF-BEN-2026-0700"}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-rise">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="leading-relaxed font-semibold">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs">
          {/* Formulaire d'instruction de garantie (7 colonnes sur 12) */}
          <Card className="lg:col-span-7 border-border shadow-xl bg-card">
            <CardHeader className="p-5 sm:p-6 pb-4">
              <CardTitle className="text-base font-bold text-foreground">
                Évaluation Immédiate de Disponibilité Hypothécaire
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Interrogez en temps réel le Livre Foncier national pour certifier l&apos;immatriculation et vérifier l&apos;absence de privilège concurrent.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  value={codeQuery}
                  onChange={(e) => setCodeQuery(e.target.value)}
                  className="font-mono uppercase h-10 text-xs flex-1 bg-background"
                  placeholder="Ex : OUI-0104, OUI-0421, CAL-0089..."
                />
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={loading}
                  className="h-10 px-5 font-bold text-xs bg-cyan-600 hover:bg-cyan-700 text-white shrink-0 gap-1.5 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? "Interrogation..." : "Vérifier la Disponibilité"}</span>
                </Button>
              </div>

              {result && (
                <div className="p-5 rounded-xl bg-background/90 border border-cyan-500/30 space-y-4 animate-rise">
                  <div className="flex items-center justify-between pb-3 border-b border-border/80">
                    <div>
                      <span className="font-mono font-bold text-base text-foreground">{result.code}</span>
                      <span className="text-xs text-muted-foreground ml-2">Titulaire : {result.proprietaire}</span>
                    </div>
                    <Badge
                      variant={result.statut === "TITRE_FONCIER" || result.statut === "CPF" ? "success" : "outline"}
                      className="text-[10px] font-semibold"
                    >
                      {result.statut === "TITRE_FONCIER" || result.statut === "CPF"
                        ? "Titre Foncier Immatriculé"
                        : "Certificat Coutumier Déclaré"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Valeur Homologuée</span>
                      <strong className="text-foreground text-sm font-mono mt-0.5 block">{formatFcfa(result.valeurEstimee)}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Statut Sûreté</span>
                      <strong className="text-emerald-500 text-sm mt-0.5 block">
                        {result.hypothequeInscrite ? "Hypothèque Active" : "Libre de Privilege"}
                      </strong>
                    </div>
                    <div className="p-3 rounded-lg bg-card border border-border">
                      <span className="text-[10px] text-muted-foreground block font-medium">Localisation</span>
                      <strong className="text-foreground text-sm mt-0.5 block">{result.commune} ({result.surfaceM2} m²)</strong>
                    </div>
                  </div>

                  {result.enLitige && (
                    <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Attention : Parcelle sous gel conservatoire CSAF pour instance contentieuse.</span>
                    </div>
                  )}

                  {result.enVerrouMutation && (
                    <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>Attention : Procédure de mutation notariale déjà en cours sur cette parcelle.</span>
                    </div>
                  )}

                  {!result.enLitige && !result.enVerrouMutation && (
                    <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs font-semibold whitespace-nowrap">Montant Crédit :</label>
                        <Input
                          type="number"
                          value={creditAmount}
                          onChange={(e) => setCreditAmount(e.target.value)}
                          className="h-8 font-mono text-xs w-36 bg-card"
                        />
                        <span className="text-xs text-muted-foreground">FCFA</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleRegisterMortgage}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer w-full sm:w-auto"
                      >
                        <FileCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Inscrire l&apos;Hypothèque Rang 1</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Règles prudentielles et conformité (5 colonnes sur 12) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border shadow-xl bg-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Scale className="w-4 h-4" />
                  <span>Cadre Réglementaire Bancaire</span>
                </div>
                <CardTitle className="text-base font-bold text-foreground">
                  Garanties Réelles Immobilières (BCEAO / OHADA)
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <p>
                  En conformité avec les directives prudentielles de la Commission Bancaire de l&apos;UMOA et l&apos;Acte uniforme OHADA,
                  seuls les titres immatriculés au Livre Foncier (Titre Foncier définitif et CPF) sont admissibles en pondération
                  d&apos;actifs de classe 1.
                </p>

                <div className="p-3 rounded-xl bg-background/80 border border-border space-y-2 text-[11px]">
                  <div className="font-semibold text-foreground">Conditions d&apos;Inscription Immédiate :</div>
                  <ul className="space-y-1">
                    <li>&bull; Attestation de non-recours délivrée par la CSAF</li>
                    <li>&bull; Acte notarié d&apos;affectation hypothécaire scellé</li>
                    <li>&bull; Enregistrement télématique sous 24h à l&apos;ANDF</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
