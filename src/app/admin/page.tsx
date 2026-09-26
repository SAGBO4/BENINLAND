"use client";

import React, { useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { Settings, RotateCcw, ShieldCheck, Check, Activity, Database, Lock, Terminal, Server } from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetMsg(null);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/v1/demo/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetMsg("Base de données restaurée au jeu de données certifié (Seed 2026). L'intégrité initiale est rétablie.");
      } else {
        setErrorMsg(data.error || "Échec de la réinitialisation de la base.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Erreur réseau ou serveur lors de la réinitialisation.");
    } finally {
      setResetting(false);
    }
  };

  const mutations = anyigbaRepo.getAllMutations();
  const parcelles = anyigbaRepo.getAllParcelles();

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8 animate-rise">
        {/* En-tête Administration & Audit Trail */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 border border-slate-500/30 flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Console d&apos;Administration &amp; Journal d&apos;Audit National
                </h1>
                <Badge variant="outline" className="text-[10px] font-mono uppercase text-primary border-primary/30">
                  Supervision Système
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Surveillance de l&apos;intégrité cryptographique, des nœuds BéninChain et de l&apos;état des services régaliens.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>Réinitialiser Données Témoins (Seed 2026)</span>
          </Button>
        </div>

        {resetMsg && (
          <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-xs flex items-center gap-2 animate-rise">
            <Check className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed">{resetMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2 animate-rise">
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span className="leading-relaxed font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* État des services régaliens */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <Card className="p-5 border-border space-y-2.5 bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Moteur Spatial PostGIS 3.4</span>
              <Database className="w-4 h-4 text-success" />
            </div>
            <div className="text-lg font-bold text-foreground font-mono">Opérationnel (v16.3.4)</div>
            <p className="text-[10px] text-muted-foreground">Extensions topologiques ST_Intersects &amp; ST_Area actives</p>
          </Card>

          <Card className="p-5 border-border space-y-2.5 bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Nœud Miroir BéninChain</span>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-foreground font-mono">Synchronisé (Bloc #421898)</div>
            <p className="text-[10px] text-muted-foreground">Smart Contract RegistreFoncier.sol déployé</p>
          </Card>

          <Card className="p-5 border-border space-y-2.5 bg-card">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground">Horodatage OpenTimestamps</span>
              <Lock className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-lg font-bold text-foreground font-mono">Scellement Bitcoin Actif</div>
            <p className="text-[10px] text-muted-foreground">Attestations d&apos;intégrité ASIN inaltérables</p>
          </Card>
        </div>

        {/* Journal d'audit cryptographique */}
        <Card className="border-border shadow-xl bg-card">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <CardTitle className="text-base font-bold">Journal d&apos;Audit Cryptographique (Audit Trail)</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                Horodatage Référentiel UTC
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Traçabilité inaltérable de tous les événements de mutation, pose de verrous et ordonnances CSAF.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0">
            <div className="p-4 rounded-xl bg-background/90 border border-border font-mono text-xs space-y-2 max-h-96 overflow-y-auto leading-relaxed">
              <div className="text-muted-foreground">
                [2026-09-26 08:45:10 UTC] SYSTEM: Initialisation du moteur Anyigba v1.0.0. 7 parcelles chargées avec géométries PostGIS.
              </div>
              <div className="text-primary font-medium">
                [2026-09-26 08:48:22 UTC] MUTATION: Dossier MUT-2026-0089 sur CAL-0089 verrouillé par Me Christian Agbossou.
              </div>
              <div className="text-amber-400 font-medium">
                [2026-09-26 08:50:01 UTC] VERROU_OPPOSABILITE: Tentative de seconde vente concurrente rejetée avec statut 409 Conflict.
              </div>
              <div className="text-emerald-400 font-medium">
                [2026-09-26 08:52:14 UTC] CRYPTO_SEAL: Empreinte Merkle scellée sur le registre public d&apos;État (tx 0xbc421890).
              </div>
              <div className="text-blue-400 font-medium">
                [2026-09-26 09:12:05 UTC] TELECOM_GATEWAY: Requête SMS "VERIF OUI-0421" reçue du +229 97 00 12 34 et acquittée.
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
