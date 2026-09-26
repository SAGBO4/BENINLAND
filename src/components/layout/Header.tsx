"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, MapPin, Search, FileText, Smartphone, RotateCcw, Check, Sparkles } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemo = async () => {
    setResetting(true);
    try {
      const res = await fetch("/api/v1/demo/reset", { method: "POST" });
      if (res.ok) {
        setResetSuccess(true);
        setTimeout(() => {
          setResetSuccess(false);
          window.location.reload();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResetting(false);
    }
  };

  const navItems = [
    { label: "Accueil", href: "/", icon: ShieldCheck },
    { label: "Carte Foncière", href: "/carte", icon: MapPin },
    { label: "Vérification", href: "/verification", icon: Search },
    { label: "Coffre-Fort & Preuve", href: "/verification/actes", icon: FileText },
    { label: "Simulateur USSD/SMS", href: "/demo/telephone", icon: Smartphone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      {/* Ruban tricolore républicain du Bénin */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#0A5C36]" />
        <div className="w-1/3 bg-[#F2B822]" />
        <div className="w-1/3 bg-[#C73E1D]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Emblème */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#063b22] border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary-foreground bg-clip-text">
                ANYIGBA
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 uppercase">
                Bénin Foncier
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              Cadastre National & Sécurisation Foncier Souverain
            </p>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions : Réinitialisation Démo & Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDemo}
            disabled={resetting || resetSuccess}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              resetSuccess
                ? "bg-success/20 border-success text-success"
                : "bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Remet la base de données dans son état de départ déterministe (Seed 2026)"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="hidden sm:inline">Base réinitialisée !</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-primary" : ""}`} />
                <span className="hidden sm:inline">Reset Démo</span>
              </>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>Démo Ouidah 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}
