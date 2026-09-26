"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, MapPin, Mic, Camera, Coins, CheckCircle2, ShieldCheck, Play, ArrowRight, Smartphone } from "lucide-react";
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

  const handleCreateConvention = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCreatedConv(null);

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
            { temoinNom: "Paul Hounkpatin", qualite: "Voisin Est", langue: "Fongbe", dureeSecondes: 24 },
            { temoinNom: "Dah Sèhou", qualite: "Chef de Village", langue: "Fongbe", dureeSecondes: 45 },
          ],
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCreatedConv(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-rise">
        {/* En-tête Espace Agent Foncier */}
        <Card className="border-amber-500/30 shadow-xl backdrop-blur-xl bg-card/95">
          <CardHeader className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg sm:text-xl font-bold">Espace Agent Foncier Communautaire</CardTitle>
                    <Badge variant="warning" className="text-[10px] uppercase font-bold">
                      Terminal Terrain PWA
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    Formalisation assistée des conventions de vente au village • Contrôle GPS, voix et séquestre MoMo.
                  </CardDescription>
                </div>
              </div>

              <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border shrink-0">
                Agent Assermenté : <strong className="text-foreground">Mamadou Bio</strong>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Confirmation de convention scellée */}
        {createdConv && (
          <Card className="border-emerald-500/40 bg-emerald-500/10 shadow-xl animate-rise">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Convention de Vente Assistée Scellée avec Succès !</span>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background/80 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Numéro Dossier</span>
                  <strong className="font-mono text-primary text-sm">{createdConv.codeConvention}</strong>
                </div>
                <div className="p-3 rounded-xl bg-background/80 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Empreinte Cryptographique</span>
                  <span className="font-mono text-[10px] truncate block text-foreground">
                    {createdConv.dossierHashSha256}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-background/80 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Séquestre Mobile Money</span>
                  <strong className="text-secondary">{formatFcfa(createdConv.prixFcfa)} sous séquestre</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire de Convention de Vente Assistée */}
        <Card className="border-border shadow-xl">
          <CardHeader className="p-5 pb-3 space-y-1">
            <CardTitle className="text-base sm:text-lg font-bold">
              Formulaire de Convention Assistée de Vente au Village
            </CardTitle>
            <CardDescription className="text-xs">
              Tous les témoignages et photos sont horodatés et condensés en une preuve d&apos;intégrité unique.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <form onSubmit={handleCreateConvention} className="space-y-5 text-xs">
              {/* Section 1 : Localisation */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> 1. Localisation &amp; Superficie
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-muted-foreground text-xs">Commune :</label>
                    <Input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground text-xs">Village / Quartier :</label>
                    <Input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground text-xs">Superficie Déclarée (m²) :</label>
                    <Input
                      type="number"
                      value={surfaceM2}
                      onChange={(e) => setSurfaceM2(e.target.value)}
                      required
                      className="h-9 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-muted-foreground text-xs">Prix Convenu (FCFA) :</label>
                    <Input
                      type="number"
                      value={prixFcfa}
                      onChange={(e) => setPrixFcfa(e.target.value)}
                      required
                      className="h-9 text-xs font-bold text-secondary"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 : Parties */}
              <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 2. Identification des Parties (NPI)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 rounded-xl bg-card border border-border/80">
                    <span className="font-semibold text-foreground block text-xs">Vendeur Cédant</span>
                    <Input
                      type="text"
                      value={vendeurNom}
                      onChange={(e) => setVendeurNom(e.target.value)}
                      className="h-8 text-xs mb-1"
                    />
                    <Input
                      type="text"
                      value={vendeurNpi}
                      onChange={(e) => setVendeurNpi(e.target.value)}
                      className="h-7 text-[10px] font-mono"
                    />
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-card border border-border/80">
                    <span className="font-semibold text-foreground block text-xs">Acheteur Acquéreur</span>
                    <Input
                      type="text"
                      value={acheteurNom}
                      onChange={(e) => setAcheteurNom(e.target.value)}
                      className="h-8 text-xs mb-1"
                    />
                    <Input
                      type="text"
                      value={acheteurNpi}
                      onChange={(e) => setAcheteurNpi(e.target.value)}
                      className="h-7 text-[10px] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 : Bornes Photos & Témoignages Vocaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-3">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> 3. Bornage Physique
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    4 bornes en béton géolocalisées et photographiées par l&apos;agent.
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="font-bold">
                      ✓ {photosCount} Bornes Capturées
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">GPS : ± 1.2 m précision</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-background/60 border border-border/80 space-y-3">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="w-4 h-4" /> 4. Témoignages Vocaux en Fongbe
                  </span>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/80">
                      <span>Voisin Est (Paul Hounkpatin)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Play className="w-3 h-3 text-primary" /> Audio 24s (Fongbe)
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/80">
                      <span>Chef de Village (Dah Sèhou)</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Play className="w-3 h-3 text-primary" /> Audio 45s (Fongbe)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Séquestre Mobile Money */}
              <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <div className="font-bold text-foreground text-xs sm:text-sm">Séquestre Mobile Money (MTN MoMo / Moov)</div>
                    <div className="text-[11px] text-muted-foreground">
                      Le montant de {formatFcfa(Number(prixFcfa) || 0)} sera gelé sous séquestre d&apos;État dès la signature.
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-bold text-[10px] self-start sm:self-auto">
                  Escrow Activé
                </Badge>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full font-bold text-sm gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sceller la Convention Assistée &amp; Générer la Preuve</span>
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
