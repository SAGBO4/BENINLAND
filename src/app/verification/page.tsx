import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VerificationSearch } from "@/components/verification/VerificationSearch";
import { ShieldCheck, Smartphone, CheckCircle } from "lucide-react";

export default function VerificationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Service Public Ouvert à Tous les Citoyens</span>
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Vérification Immédiate d&apos;un Terrain Avant Achat
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Évitez les pièges de la double vente. En 30 secondes, vérifiez si un terrain existe, son statut juridique,
            l&apos;absence de litige CSAF et si une mutation n&apos;est pas déjà en cours.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl space-y-6">
          <VerificationSearch />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Vérification par SMS (Sans Smartphone)</span>
            </h3>
            <p className="text-muted-foreground">
              Envoyez <strong className="text-foreground font-mono">VERIF &lt;CodeParcelle&gt;</strong> (ex : VERIF
              OUI-0421) au numéro court <strong className="text-foreground">132</strong> pour recevoir le statut certifié
              par SMS instantané.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-2">
            <h3 className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Attestation Vocale Multilingue</span>
            </h3>
            <p className="text-muted-foreground">
              Pour les usagers non-lecteurs, le statut de la parcelle peut être écouté à haute voix en{" "}
              <strong className="text-foreground">Fongbe</strong>, <strong className="text-foreground">Yoruba</strong> et{" "}
              <strong className="text-foreground">Français</strong>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
