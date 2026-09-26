"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  FileCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  FileText,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import { anyigbaRepo } from "@/repositories/index";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function VerifierActesPage() {
  const [actes, setActes] = useState<any[]>(anyigbaRepo.getAllActes());
  const [tamperResult, setTamperResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulateTamper = (refActe: string) => {
    setLoading(true);
    setTimeout(() => {
      const res = anyigbaRepo.simulateDocumentTampering(refActe);
      setTamperResult(res);
      setActes(anyigbaRepo.getAllActes());
      setLoading(false);
    }, 350);
  };

  const handleReset = () => {
    anyigbaRepo.resetToDeterministicSeed();
    setActes(anyigbaRepo.getAllActes());
    setTamperResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground bg-grid-benin">
      <Header />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-8 animate-rise">
        {/* En-tête officiel du Registre Cryptographique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  Registre Public des Actes et Empreintes Cryptographiques
                </h1>
                <Badge variant="outline" className="text-[10px] font-mono uppercase text-primary border-primary/30">
                  Horodatage SHA-256 &bull; ASIN
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vérification mathématique de l&apos;intégrité documentaire des Titres Fonciers, procès-verbaux de bornage et actes de mutation notariés.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Rétablir l&apos;État Certifié</span>
          </Button>
        </div>

        {/* Panneau de notification lors d'une altération simulée */}
        {tamperResult && (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/30 text-foreground space-y-3 animate-rise">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Rupture d&apos;Intégrité Documentaire Constatée (Défaut de Concordance Cryptographique)</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Une modification non autorisée de l&apos;acte a été détectée. Le recalcul de l&apos;empreinte SHA-256 diverge de
              l&apos;empreinte originale scellée au registre public national. Le document est immédiatement rejeté comme non authentique.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="p-3.5 rounded-xl bg-background border border-success/40 space-y-1">
                <span className="text-[10px] text-success block font-bold">Empreinte Légitime Enregistrée au Livre Foncier :</span>
                <span className="text-[11px] text-success font-bold break-all block">{tamperResult.hashOriginal}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-background border border-destructive/40 space-y-1">
                <span className="text-[10px] text-destructive block font-bold">Empreinte Altérée Constatée au Recalcul :</span>
                <span className="text-[11px] text-destructive font-bold break-all block">{tamperResult.hashFalsifie}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des actes et titres scellés */}
        <Card className="border-border shadow-xl">
          <CardHeader className="p-5 sm:p-6 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Titres Fonciers et Actes Authentiques Enregistrés
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Liste des actes officiels disposant d&apos;un certificat d&apos;ancrage et d&apos;horodatage conforme.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-[11px]">
                {actes.length} {actes.length > 1 ? "actes scellés" : "acte scellé"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
            {actes.map((acte) => (
              <div
                key={acte.id}
                className={`p-5 rounded-xl border transition space-y-3.5 text-xs ${
                  acte.estFalsifie
                    ? "bg-destructive/10 border-destructive/50"
                    : "bg-background/80 border-border hover:border-primary/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border/80">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-foreground">{acte.referenceActe}</span>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Parcelle : {acte.parcelleCode}
                    </Badge>
                  </div>

                  <div>
                    {acte.estFalsifie ? (
                      <Badge variant="destructive" className="gap-1.5 py-1 px-3 text-[11px] font-bold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Défaut d&apos;Intégrité Détecté</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1.5 py-1 px-3 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Empreinte Conforme &amp; Scellée</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground block font-medium">Officier / Signataire Autorisé</span>
                    <strong className="text-foreground text-xs mt-0.5 block">{acte.signataire}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border font-mono">
                    <span className="text-[10px] text-muted-foreground block font-medium">Ancrage OpenTimestamps</span>
                    <span className="text-secondary truncate block text-xs mt-0.5">{acte.otsProof}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-card border border-border font-mono">
                    <span className="text-[10px] text-muted-foreground block font-medium">Identifiant de Transaction</span>
                    <span className="text-primary truncate block text-xs mt-0.5">{acte.txBlockchainId}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
                  <div className="text-[11px] text-muted-foreground font-mono truncate max-w-xl">
                    <span className="text-foreground font-semibold">Empreinte SHA-256 : </span>
                    <span className="text-muted-foreground">{acte.hashSha256}</span>
                  </div>

                  {!acte.estFalsifie && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSimulateTamper(acte.referenceActe)}
                      disabled={loading}
                      className="text-xs font-semibold gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Tester l&apos;Inaltérabilité (Simulation d&apos;Altération)</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
