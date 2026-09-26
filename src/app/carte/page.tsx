import React from "react";
import { CadastreLeafletMap } from "@/components/carte/CadastreLeafletMap";

export default function CartePage() {
  return (
    <div className="flex-1 w-full h-[calc(100vh-80px)] min-h-[500px] flex flex-col bg-background text-foreground overflow-hidden">
      <main id="main-content" className="flex-1 w-full h-full overflow-hidden">
        <CadastreLeafletMap />
      </main>
    </div>
  );
}
