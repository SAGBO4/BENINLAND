import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/layout/providers";
import { Nav } from "@/components/layout/nav";
import { SkipToContent } from "@/components/layout/skip-to-content";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "BENINLAND (Anyigba) — Cadastre Numérique & Sécurisation Foncière du Bénin",
  description:
    "Plateforme nationale régalienne de gestion et de sécurisation du foncier en République du Bénin. Consultation cadastrale des 77 communes, verrou anti-double-vente et actes authentiques scellés.",
  keywords: [
    "Foncier Bénin",
    "Cadastre Bénin",
    "ANDF",
    "Titre Foncier",
    "CPF",
    "Sécurisation Foncière",
    "Cour Spéciale CSAF",
    "BéninChain",
  ],
  authors: [{ name: "République du Bénin — Ministère du Cadre de Vie & ANDF" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a3764",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return (
    <html
      lang="fr"
      className="light overflow-x-hidden max-w-full"
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-[#0a3764]/10 selection:text-[#0a3764] overflow-x-hidden w-full max-w-full relative">
        <Providers>
          <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden">
            <SkipToContent />
            <Nav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
