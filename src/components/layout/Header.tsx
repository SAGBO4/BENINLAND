"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Search,
  FileText,
  Smartphone,
  RotateCcw,
  Check,
  Landmark,
  Sparkles,
  Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenMoMo?: () => void;
}

export function Header({ activeTab = "vitrine", onTabChange, onOpenMoMo }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const tabs = [
    { id: "vitrine", label: "Présentation Nationale", icon: Sparkles, tag: "Souverain" },
    { id: "dashboard", label: "Tableau de Bord & Trésor", icon: Landmark, tag: "DGTCP" },
    { id: "carte", label: "Carte Cadastrale SIG", icon: MapPin, tag: "Leaflet" },
    { id: "scenario", label: "Démo Dossou à Pahou", icon: FileText, tag: "Pilote" },
    { id: "verification", label: "Vérification & Actes", icon: Search, tag: "SHA-256" },
    { id: "simulators", label: "Simulateurs Télécom", icon: Smartphone, tag: "USSD/SMS" },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      router.push(`/?tab=${tabId}`);
    }
  };

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/v1/demo/reset", { method: "POST" });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
          window.location.reload();
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Ruban tricolore républicain officiel du Bénin */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#0A5C36]" />
        <div className="w-1/3 bg-[#D99B00]" />
        <div className="w-1/3 bg-[#B83214]" />
      </div>

      {/* Bandeau supérieur républicain institutionnel */}
      <div className="border-b border-slate-900 bg-slate-950/95 py-1.5 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1536px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">
              RÉPUBLIQUE DU BÉNIN &bull; Agence Nationale du Domaine et du Foncier (ANDF)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">Ministère du Cadre de Vie &bull; Trésor Public (DGTCP)</span>
            <span className="text-slate-700">|</span>
            <span className="text-emerald-400 font-semibold">Zéro Double Vente</span>
            <span className="text-slate-700">|</span>
            <span className="text-amber-400 font-semibold">Code Foncier et Domanial</span>
          </div>
        </div>
      </div>

      {/* Barre Principale de Navigation */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Logo & Emblème Républicain */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  ANYIGBA
                </span>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Bénin Foncier
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Système National Intégré de Sécurisation Foncière &amp; Cadastre
              </p>
            </div>
          </Link>

          {/* Navigation par Onglets Principaux */}
          <nav className="flex items-center flex-wrap gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && pathname === "/";

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded-md ${isActive ? "bg-emerald-700 text-white" : "bg-slate-800 text-slate-400"}`}>
                    {tab.tag}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Actions : Réinitialisation Démo & Séquestre Mobile Money */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenMoMo && (
              <Button
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 text-xs font-bold gap-1"
                onClick={onOpenMoMo}
                title="Ouvrir la passerelle de consignation Mobile Money"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Séquestre MoMo</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={resetting || resetSuccess}
              onClick={handleResetDemo}
              className={`border text-xs font-semibold gap-1.5 transition ${
                resetSuccess
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                  : "border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Restaurer l'état déterministe certifié de la base foncière (Seed 2026)"
            >
              {resetSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Réinitialisé !</span>
                </>
              ) : (
                <>
                  <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-emerald-400" : ""}`} />
                  <span className="hidden sm:inline">Reset Démo</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
