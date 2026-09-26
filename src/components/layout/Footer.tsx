import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-16 text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 : Identité */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-foreground tracking-tight">ANYIGBA • BÉNINLAND</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Plateforme Nationale de Sécurisation et de Gestion du Foncier. Système souverain d'authentification des
              droits fonciers et de blocage mathématique de la double vente.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-primary">
              <Lock className="w-3 h-3" />
              <span>Ancrage cryptographique SHA-256 + BéninChain</span>
            </div>
          </div>

          {/* Col 2 : Institutions */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Partenaires d&apos;État</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Ministère du Cadre de Vie &amp; Trésor Public (DGTCP)</li>
              <li>Agence Nationale du Domaine et du Foncier (ANDF)</li>
              <li>Cour Spéciale des Affaires Foncières (CSAF)</li>
              <li>Chambre Nationale des Notaires du Bénin</li>
              <li>Ordre des Géomètres Experts du Bénin</li>
              <li>Mairies et Communes des 77 départements</li>
            </ul>
          </div>

          {/* Col 3 : Accès rapides */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Services Publics</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/espace/ministere" className="hover:text-foreground transition text-secondary font-semibold">
                  🏛️ Tour de Contrôle Ministérielle (Trésor CUT)
                </Link>
              </li>
              <li>
                <Link href="/carte" className="hover:text-foreground transition">
                  Carte interactive du cadastre
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-foreground transition">
                  Vérifier une parcelle (Code Cadastral)
                </Link>
              </li>
              <li>
                <Link href="/verification/actes" className="hover:text-foreground transition">
                  Vérifier l&apos;empreinte d&apos;un Titre ou Acte
                </Link>
              </li>
              <li>
                <Link href="/demo/telephone" className="hover:text-foreground transition">
                  Simulateur USSD (*123*7#) &amp; SMS (132)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-foreground transition">
                  Console d&apos;Administration &amp; Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : Règle démo & Conformité */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Cadre de Démonstration</h4>
            <div className="bg-background/80 p-3 rounded-lg border border-border space-y-1.5 text-[10px]">
              <p className="font-semibold text-foreground">🛑 Données Déterministes Fictives (2026)</p>
              <p className="text-muted-foreground">
                Toutes les identités (NPI FICTIF), numéros de téléphone et coordonnées sont générés pour la démonstration
                institutionnelle. Aucune donnée privée réelle ne transite.
              </p>
              <div className="pt-1 flex items-center gap-1 text-secondary">
                <span>Code du Numérique du Bénin • APDP</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
          <p>© 2026 République du Bénin — Présidence de la République &amp; ANDF. Tous droits réservés.</p>
          <p className="text-muted-foreground">Anyigba Engine v1.0.0 • Next.js 16 • PostGIS 3.4</p>
        </div>
      </div>
    </footer>
  );
}
