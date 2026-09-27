import React from "react";
import Link from "next/link";
import { PhoneCall, ShieldCheck, Lock, MapPin, Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1b232d] text-white py-12 sm:py-16 px-4 sm:px-8 lg:px-12 border-t border-slate-800">
      <div className="max-w-[1536px] mx-auto flex flex-col gap-8 sm:gap-10">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start justify-between gap-8 pb-8 sm:pb-10 border-b border-white/10">
          {/* Colonne Gauche : Services Fonciers Nationaux & Numéro Vert */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Cadastre &amp; Sécurisation Foncière
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plateforme républicaine opérée sous l&apos;égide conjointe du Ministère du Cadre de Vie et des Transports (MCVDD), de l&apos;Agence Nationale du Domaine et du Foncier (ANDF) et de la Direction Générale du Trésor et de la Comptabilité Publique (DGTCP).
            </p>
            <div className="mt-2 flex items-center gap-2">
              <a
                href="tel:132"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#008751] hover:bg-[#007345] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                <span>Ligne Verte Foncier 132 (Gratuit 24/7)</span>
              </a>
            </div>
          </div>

          {/* Centre : Identité Républicaine */}
          <div className="flex flex-col items-start md:items-center text-left md:text-center">
            <span className="text-sm font-bold text-white tracking-wide">
              BENINLAND • ANYIGBA
            </span>
            <span className="text-xs text-slate-300 mt-1">
              République du Bénin • Présidence de la République
            </span>
            <div className="mt-3 flex h-[4px] w-32 rounded-full overflow-hidden">
              <div className="w-1/3 bg-[#008751]" />
              <div className="w-1/3 bg-[#ffbe00]" />
              <div className="w-1/3 bg-[#eb0000]" />
            </div>
            <span className="text-[11px] text-slate-400 mt-2">
              Fraternité • Justice • Travail
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">
              Inaltérabilité SHA-256 &bull; Ancrage BéninChain
            </span>
          </div>

          {/* Colonne Droite : Liens Rapides & Support */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Guichets Ouverts &amp; Saisine
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/verification"
                className="min-h-[40px] inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-slate-200 transition-colors font-medium"
              >
                Vérification Parcelle
              </Link>
              <Link
                href="/carte"
                className="min-h-[40px] inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-slate-200 transition-colors font-medium"
              >
                SIG 77 Communes
              </Link>
              <Link
                href="/espace/csaf"
                className="min-h-[40px] inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs text-slate-200 transition-colors font-medium"
              >
                Cour Spéciale (CSAF)
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 text-left md:text-right">
              Assistance domaniale et cadastrale : support.foncier@cadastre.bj
            </p>
          </div>
        </div>

        {/* Ligne inférieure */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © 2026 Système National Intégré de Sécurisation Foncière — ANDF &amp; République du Bénin. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Link href="/verification" className="hover:text-white transition-colors">
              Code Foncier (Loi n° 2013-01)
            </Link>
            <span>•</span>
            <Link href="/espace/csaf" className="hover:text-white transition-colors">
              Cour Spéciale (Loi n° 2022-16)
            </Link>
            <span>•</span>
            <Link href="/verification/actes" className="hover:text-white transition-colors">
              Audit Cryptographique
            </Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">
              Espace Professionnel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
