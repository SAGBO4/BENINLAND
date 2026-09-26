import React from "react";
import { Header } from "@/components/layout/Header";
import { CadastreLeafletMap } from "@/components/carte/CadastreLeafletMap";

export default function CartePage() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <main className="flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden">
        <CadastreLeafletMap />
      </main>
    </div>
  );
}
