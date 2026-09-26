"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Users, MapPin, Mic, Camera, Coins, CheckCircle2, ShieldCheck, Play, ArrowRight } from "lucide-react";
import { formatFcfa } from "@/lib/utils";

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* En-tête Espace Agent Foncier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-primary/30 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Espace Agent Foncier Communautaire</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 uppercase">
                  Terminal Terrain PWA
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Formalisation assistée des conventions de vente au village • Contrôle GPS, voix et séquestre MoMo
              </p>
            </div>
          </div>

          <div className="text-xs bg-background/80 p-2.5 rounded-xl border border-border">
            Agent Assermenté : <strong className="text-foreground">Mamadou Bio</strong>
          </div>
        </div>

        {/* Confirmation de convention scellée */}
        {createdConv && (
          <div className="p-6 rounded-2xl bg-success/15 border border-success/40 text-foreground space-y-3 animate-rise">
            <div className="flex items-center gap-2 text-success font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Convention de Vente Assistée Scellée avec Succès !</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-background/80 border border-border">
                <span className="text-[10px] text-muted-foreground block">Numéro Dossier</span>
                <strong className="font-mono text-primary">{createdConv.codeConvention}</strong>
              </div>
              <div className="p-3 rounded-lg bg-background/80 border border-border">
                <span className="text-[10px] text-muted-foreground block">Empreinte Cryptographique</span>
                <span className="font-mono text-[10px] truncate block text-foreground">
                  {createdConv.dossierHashSha256}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-background/80 border border-border">
                <span className="text-[10px] text-muted-foreground block">Séquestre Mobile Money</span>
                <strong className="text-secondary">{formatFcfa(createdConv.prixFcfa)} sous séquestre</strong>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire de Convention de Vente Assistée */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Formulaire de Convention Assistée de Vente au Village
            </h2>
            <p className="text-xs text-muted-foreground">
              Tous les témoignages et photos sont horodatés et condensés en une preuve d&apos;intégrité unique.
            </p>
          </div>

          <form onSubmit={handleCreateConvention} className="space-y-6 text-xs">
            {/* Section 1 : Localisation */}
            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-3">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 1. Localisation &amp; Superficie
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-muted-foreground">Commune :</label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Village / Quartier :</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Superficie Déclarée (m²) :</label>
                  <input
                    type="number"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted-foreground">Prix Convenu (FCFA) :</label>
                  <input
                    type="number"
                    value={prixFcfa}
                    onChange={(e) => setPrixFcfa(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border font-bold text-secondary"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 : Parties */}
            <div className="p-4 rounded-xl bg-background/60 border border-border space-y-3">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4" /> 2. Identification des Parties (NPI)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 p-3 rounded-lg bg-card border border-border">
                  <span className="font-semibold text-foreground block">Vendeur Cédant</span>
                  <input
                    type="text"
                    value={vendeurNom}
                    onChange={(e) => setVendeurNom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-background border border-border text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={vendeurNpi}
                    onChange={(e) => setVendeurNpi(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-background border border-border text-[11px] font-mono"
                  />
                </div>

                <div className="space-y-2 p-3 rounded-lg bg-card border border-border">
                  <span className="font-semibold text-foreground block">Acheteur Acquéreur</span>
                  <input
                    type="text"
                    value={acheteurNom}
                    onChange={(e) => setAcheteurNom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-background border border-border text-xs mb-1"
                  />
                  <input
                    type="text"
                    value={acheteurNpi}
                    onChange={(e) => setAcheteurNpi(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-background border border-border text-[11px] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3 : Bornes Photos & Témoignages Vocaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background/60 border border-border space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-4 h-4" /> 3. Bornage Physique
                </span>
                <p className="text-muted-foreground text-[11px]">
                  4 bornes en béton géolocalisées et photographiées par l&apos;agent.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-success/20 text-success border border-success/30 font-bold">
                    ✓ {photosCount} Bornes Capturées
                  </span>
                  <span className="text-[10px] text-muted-foreground">GPS : ± 1.2 m précision</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-background/60 border border-border space-y-3">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-4 h-4" /> 4. Témoignages Vocaux en Fongbe
                </span>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-card border border-border">
                    <span>Voisin Est (Paul Hounkpatin)</span>
                    <span className="text-success font-bold flex items-center gap-1">
                      <Play className="w-3 h-3 text-primary" /> Audio 24s (Fongbe)
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-card border border-border">
                    <span>Chef de Village (Dah Sèhou)</span>
                    <span className="text-success font-bold flex items-center gap-1">
                      <Play className="w-3 h-3 text-primary" /> Audio 45s (Fongbe)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Séquestre Mobile Money */}
            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Coins className="w-6 h-6 text-secondary shrink-0" />
                <div>
                  <div className="font-bold text-foreground">Séquestre Mobile Money (MTN MoMo / Moov)</div>
                  <div className="text-[11px] text-muted-foreground">
                    Le montant de {formatFcfa(Number(prixFcfa) || 0)} sera gelé sous séquestre d&apos;État dès la signature.
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/40 font-bold text-[11px]">
                Escrow Activé
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sceller la Convention Assistée &amp; Générer la Preuve</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
