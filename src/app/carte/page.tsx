import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CadastreMap } from "@/components/carte/CadastreMap";

export default function CartePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Carte Cadastrale Nationale Interactive
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Visualisation géoréférencée des parcelles foncières au Bénin. Cliquez sur une parcelle pour consulter son
            statut légal, son propriétaire et écouter l&apos;attestation vocale officielle.
          </p>
        </div>

        <CadastreMap />
      </main>

      <Footer />
    </div>
  );
}
