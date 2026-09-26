"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, MapPin, Search, FileText, Smartphone, RotateCcw, Check, Landmark, Map } from "lucide-react";

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
    { label: "Carte Cadastrale SIG", href: "/carte", icon: MapPin },
    { label: "Vérification Foncier", href: "/verification", icon: Search },
    { label: "Coffre-Fort & Actes", href: "/verification/actes", icon: FileText },
    { label: "Simulateur Réseau & USSD", href: "/demo/telephone", icon: Smartphone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Ruban tricolore républicain du Bénin */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#0A5C36]" />
        <div className="w-1/3 bg-[#D99B00]" />
        <div className="w-1/3 bg-[#B83214]" />
      </div>

      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo & Emblème Républicain */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-foreground">
                ANYIGBA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 uppercase tracking-wider">
                Cadastre National
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              République du Bénin • Système National d&apos;Immatriculation Foncière
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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

        {/* Actions : Réinitialisation Démo & Passerelle Ministérielle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDemo}
            disabled={resetting || resetSuccess}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              resetSuccess
                ? "bg-success/20 border-success text-success"
                : "bg-muted/40 hover:bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Restaure les parcelles et mutations au jeu de données certifié (Seed 2026)"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="hidden sm:inline">Données réinitialisées</span>
              </>
            ) : (
              <>
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-primary" : ""}`} />
                <span className="hidden sm:inline">Réinitialiser Démo</span>
              </>
            )}
          </button>

          <Link
            href="/espace/ministere"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/30 text-xs font-semibold transition"
            title="Accès à la Direction Générale et à la Régulation Ministérielle (DGTCP & CUT)"
          >
            <Landmark className="w-3.5 h-3.5 text-secondary" />
            <span>Régulation Ministérielle</span>
          </Link>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/30 text-muted-foreground border border-border text-[11px] font-medium">
            <Map className="w-3 h-3 text-primary" />
            <span>Pilote Pahou / Ouidah</span>
          </div>
        </div>
      </div>
    </header>
  );
}
