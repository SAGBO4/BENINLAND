import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anyigba — Cadastre Numérique & Sécurisation Foncière du Bénin",
  description: "Plateforme nationale de gestion et de sécurisation du foncier au Bénin. Vérification instantanée, verrou anti-double-vente et actes inaltérables scellés sur BéninChain.",
  keywords: ["Foncier Bénin", "Cadastre Bénin", "Titre Foncier", "ANDF", "CSAF", "Sécurisation Foncier", "BéninChain"],
  authors: [{ name: "République du Bénin — ANDF & Cadastre National" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A5C36",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { BottomNav } from "@/components/layout/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground font-sans pb-16 md:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

