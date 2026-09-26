"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, MapPin, Mic, Camera, Coins, CheckCircle2, ShieldCheck, Play, ArrowRight, Smartphone, Compass, AlertTriangle } from "lucide-react";
import { formatFcfa } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgentFoncierPage() {
  const [commune, setCommune] = useState("Ouidah");
  const [village, setVillage] = useState("Pahou");
  const [vendeurNom, setVendeurNom] = useState("Germain Dossou");
  const [vendeurNpi, setVendeurNpi] = useState("FICTIF-BEN-2026-0041");
  const [acheteurNom, setAcheteurNom] = useState("Koffi Mensah");
  const [acheteurNpi, setAcheteurNpi] = useState("FICTIF-BEN-2026-0003");
  const [surfaceM2, setSurfaceM2] = useState("1250");
  const [prixFcfa, setPrixFcfa] = useState("4500000");
  const [photosCount, setPhotosCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [createdConv, setCreatedConv] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateConvention = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCreatedConv(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/conventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentNpi: "FICTIF-BEN-2026-0045",
          agentNom: "Mamadou Bio (Agent Foncier)",
          vendeurNpi,
          vendeurNom,
          acheteurNpi,
          acheteurNom,
          commune,
          village,
          surfaceM2: Number(surfaceM2),
          prixFcfa: Number(prixFcfa),
          temoignagesVocaux: [
            { temoinNom: "Paul Hounkpatin", qualite: "Riverain Est", langue: "Fongbe", dureeSecondes: 24 },
            { temoinNom: "Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45 },
          ],
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCreatedConv(json.data);
      } else {
        setErrorMsg(json.error || "Échec de l'enregistrement du procès-verbal de bornage.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau lors de la transmission du procès-verbal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Agent Foncier */}
        <Card className="border-amber-500/40 shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Compass className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                      Terminal de Terrain — Procès-Verbal de Bornage Contradictoire
                    </CardTitle>
                    <Badge variant="warning" className="text-[10px] uppercase font-bold px-2.5">
                      Agent Foncier Assermenté
                    </Badge>
                  </div>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Levé géodésique des 4 bornes, recueil des accords vocaux en langues nationales et constat contradictoire d&apos;usage
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-3 rounded-xl border border-border shrink-0">
                <span className="text-[10px] text-muted-foreground block font-medium">Agent Assermenté</span>
                <strong className="text-foreground">Mamadou Bio (Arrondissement de Pahou)</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Confirmation du procès-verbal scellé */}
        {createdConv && (
          <Card className="border-emerald-500/40 bg-emerald-500/10 shadow-xl animate-rise">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Procès-Verbal de Bornage Contradictoire Enregistré et Scellé</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-medium">Numéro de Procès-Verbal</span>
                  <strong className="font-mono text-primary text-sm mt-0.5 block">{createdConv.codeConvention}</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-medium">Horodatage Cryptographique</span>
                  <span className="font-mono text-[10px] truncate block text-foreground mt-0.5">
                    {createdConv.dossierHashSha256}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-background/90 border border-border">
                  <span className="text-[10px] text-muted-foreground block font-medium">Consignation Financière</span>
                  <strong className="text-secondary mt-0.5 block">{formatFcfa(createdConv.prixFcfa)} sous séquestre DGTCP</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerte d'erreur */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Formulaire de saisie du Procès-Verbal de Bornage */}
        <Card className="border-border shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6 pb-4 space-y-1">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground">
              Procès-Verbal de Bornage Contradictoire et Constat d&apos;Usage
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Conformément à la réglementation de l&apos;Ordre des Géomètres-Experts et de l&apos;ANDF.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            <form onSubmit={handleCreateConvention} className="space-y-5 text-xs">
              {/* Section 1 : Localisation et Superficie */}
              <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> 1. Délimitation Géographique et Superficie
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-semibold">Commune :</label>
                    <Input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      required
                      className="h-9 text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-semibold">Arrondissement / Village :</label>
                    <Input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                      className="h-9 text-xs bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-semibold">Superficie Mesurée (m²) :</label>
                    <Input
                      type="number"
                      value={surfaceM2}
                      onChange={(e) => setSurfaceM2(e.target.value)}
                      required
                      className="h-9 text-xs font-bold font-mono bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-foreground text-xs font-semibold">Prix de Transaction (FCFA) :</label>
                    <Input
                      type="number"
                      value={prixFcfa}
                      onChange={(e) => setPrixFcfa(e.target.value)}
                      required
                      className="h-9 text-xs font-bold font-mono text-secondary bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 : Identification des Parties */}
              <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 2. Identification Réglementaire des Parties (NPI ANIP)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border">
                    <span className="font-semibold text-foreground block text-xs">Vendeur Cédant</span>
                    <Input
                      type="text"
                      value={vendeurNom}
                      onChange={(e) => setVendeurNom(e.target.value)}
                      className="h-8 text-xs mb-1 bg-background"
                    />
                    <Input
                      type="text"
                      value={vendeurNpi}
                      onChange={(e) => setVendeurNpi(e.target.value)}
                      className="h-8 text-[11px] font-mono bg-background"
                    />
                  </div>

                  <div className="space-y-2 p-3.5 rounded-xl bg-card border border-border">
                    <span className="font-semibold text-foreground block text-xs">Acheteur Acquéreur</span>
                    <Input
                      type="text"
                      value={acheteurNom}
                      onChange={(e) => setAcheteurNom(e.target.value)}
                      className="h-8 text-xs mb-1 bg-background"
                    />
                    <Input
                      type="text"
                      value={acheteurNpi}
                      onChange={(e) => setAcheteurNpi(e.target.value)}
                      className="h-8 text-[11px] font-mono bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 : Relevé Géodésique & Témoignages Vocaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> 3. Bornage Géodésique et Photos
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Les 4 bornes normalisées en béton ont été posées, géoréférencées par GPS différentiel et photographiées.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="font-semibold gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{photosCount} Bornes Relevées</span>
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">Précision géodésique : &plusmn; 0.8 m</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/80 border border-border space-y-3">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-4 h-4" /> 4. Enregistrement des Consentements Vocaux
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                      <span className="font-medium">Riverain Est (Paul Hounkpatin)</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Play className="w-3 h-3 text-primary" /> Audio 24s (Fongbe)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border">
                      <span className="font-medium">Chef de Village (Dah Sèhou)</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Play className="w-3 h-3 text-primary" /> Audio 45s (Fongbe)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Séquestre Réglementaire */}
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <div className="font-bold text-foreground text-xs sm:text-sm">
                      Consignation sous Séquestre Financier Préalable
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      Le montant de {formatFcfa(Number(prixFcfa) || 0)} sera consigné sous séquestre d&apos;État (TrésorPay) dès signature.
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold text-[10px] self-start sm:self-auto">
                  Séquestre DGTCP Activé
                </Badge>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full font-bold text-sm gap-2 cursor-pointer h-11"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sceller le Procès-Verbal de Bornage &amp; Horodater la Preuve</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
