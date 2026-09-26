import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ExternalLink, ShieldAlert, Landmark, Scale, FileText, Smartphone, Settings } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 mt-16 text-xs text-muted-foreground">
      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 : Identité Institutionnelle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span className="font-extrabold text-foreground tracking-tight text-sm">ANYIGBA • BÉNINLAND</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Plateforme Nationale de Sécurisation et de Gestion du Foncier. Système souverain d&apos;immatriculation,
              de verrou d&apos;opposabilité immédiate et d&apos;assainissement des transactions foncières.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-primary font-medium">
              <Lock className="w-3 h-3 text-primary" />
              <span>Certificat d&apos;Horodatage et d&apos;Intégrité Cryptographique SHA-256 (ASIN)</span>
            </div>
          </div>

          {/* Col 2 : Institutions & Cadre Légal */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Cadre Légal &amp; Tutelle</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Ministère du Cadre de Vie et des Transports (MCVDD)</li>
              <li>Direction Générale du Trésor et de la Comptabilité Publique (DGTCP)</li>
              <li>Agence Nationale du Domaine et du Foncier (ANDF)</li>
              <li>Cour Spéciale des Affaires Foncières (Loi n° 2022-16)</li>
              <li>Chambre Nationale des Notaires du Bénin</li>
              <li>Code Foncier et Domanial (Loi n° 2013-01 / 2017-15)</li>
            </ul>
          </div>

          {/* Col 3 : Accès rapides aux Espaces */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Services Régaliens</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/espace/ministere" className="hover:text-foreground transition text-secondary font-semibold flex items-center gap-1.5">
                  <Landmark className="w-3 h-3 text-secondary" />
                  <span>Régulation Ministérielle &amp; Trésor (CUT)</span>
                </Link>
              </li>
              <li>
                <Link href="/carte" className="hover:text-foreground transition flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  <span>Carte Cadastrale Nationale Interactive</span>
                </Link>
              </li>
              <li>
                <Link href="/verification" className="hover:text-foreground transition flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Consultation Publique Libre (Vérification Parcelle)</span>
                </Link>
              </li>
              <li>
                <Link href="/verification/actes" className="hover:text-foreground transition flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Vérification d&apos;Intégrité Documentaire SHA-256</span>
                </Link>
              </li>
              <li>
                <Link href="/demo/telephone" className="hover:text-foreground transition flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3" />
                  <span>Inclusion Numérique Télécoms (USSD &amp; SMS 132)</span>
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-foreground transition flex items-center gap-1.5">
                  <Settings className="w-3 h-3" />
                  <span>Console d&apos;Administration &amp; Audit Trail</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : Règle démo & Conformité APDP */}
          <div className="space-y-2">
            <h4 className="text-foreground font-semibold text-xs uppercase tracking-wider">Conformité Démonstration</h4>
            <div className="bg-background/80 p-3.5 rounded-xl border border-border space-y-2 text-[10px]">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <ShieldAlert className="w-3.5 h-3.5 text-secondary" />
                <span>Environnement Témoin Déterministe (2026)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Toutes les identités (NPI FICTIF), numéros de téléphone et coordonnées sont configurés pour la démonstration
                institutionnelle. Conforme aux directives de l&apos;Autorité de Protection des Données Personnelles (APDP).
              </p>
              <div className="pt-1 flex items-center gap-1 text-secondary font-medium">
                <span>Code du Numérique de la République du Bénin</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© 2026 République du Bénin — Présidence de la République &amp; ANDF. Tous droits réservés.</p>
          <p className="text-muted-foreground font-mono">Anyigba Engine v1.0.0 • PostGIS 3.4 • OpenTimestamps Standard</p>
        </div>
      </div>
    </footer>
  );
}
