"use client";

import React from "react";
import { Footer } from "@/components/layout/Footer";
import { TelecomSimulatorsView } from "@/components/simulators/TelecomSimulatorsView";

export default function TelephoneDemoPage() {
  return (
    <div className="flex-1 flex flex-col bg-background text-foreground bg-grid-benin">
      <main id="main-content" className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <TelecomSimulatorsView />
      </main>
      <Footer />
    </div>
  );
}
