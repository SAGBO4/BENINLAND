"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Smartphone, Send, RotateCcw, MessageSquare, PhoneCall } from "lucide-react";
import { processInboundSms, getSimulatedSmsJournal } from "@/lib/channels";

export default function TelephoneDemoPage() {
  const [activeTab, setActiveTab] = useState<"SMS" | "USSD">("SMS");

  // Mode SMS
  const [smsInput, setSmsInput] = useState("VERIF OUI-0421");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "system"; text: string }>>([
    {
      sender: "system",
      text: "ANYIGBA: Bienvenue sur le service national de vérification foncière. Envoyez VERIF <Code> au 132.",
    },
  ]);

  // Mode USSD
  const [ussdInput, setUssdInput] = useState("*123*7#");
  const [ussdScreen, setUssdScreen] = useState<string[]>([]);
  const [ussdActive, setUssdActive] = useState(false);

  const handleSendSms = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smsInput.trim()) return;

    const userMsg = smsInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setSmsInput("");

    setTimeout(() => {
      const resp = processInboundSms("+229 97 00 12 34", userMsg);
      setMessages((prev) => [...prev, { sender: "system", text: resp }]);
    }, 400);
  };

  const handleCallUssd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (ussdInput === "*123*7#") {
      setUssdActive(true);
      setUssdScreen([
        "--- CADASTRE DU BÉNIN ---",
        "1. Vérifier un terrain",
        "2. Alerte cession de parcelle",
        "3. Contacter l'agent communal",
        "0. Quitter",
      ]);
    } else if (ussdInput === "1") {
      setUssdScreen([
        "Vérification de Terrain :",
        "Entrez le code cadastral :",
        "(Exemple : OUI-0421)",
      ]);
    } else if (ussdInput.toUpperCase() === "OUI-0421") {
      setUssdScreen([
        "OUI-0421 (Ouidah Pahou):",
        "1250 m2 - Coutumier déclaré",
        "Germain DOSSOU",
        "Zéro litige - Disponible",
      ]);
    } else {
      setUssdScreen(["Code non reconnu.", "1. Réessayer", "0. Quitter"]);
    }
    setUssdInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 uppercase">
            <Smartphone className="w-4 h-4" />
            <span>Inclusion Numérique &amp; Canaux Sans Smartphone</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            Simulateur Téléphone Feature Phone (USSD &amp; SMS)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Testez en direct comment un citoyen sans smartphone vérifie son terrain en envoyant un SMS ou en composant
            un code USSD.
          </p>
        </div>

        {/* Boîtier du Téléphone Portable Virtuel */}
        <div className="max-w-sm mx-auto p-6 rounded-[36px] bg-[#1a2233] border-4 border-slate-700 shadow-2xl space-y-4">
          {/* Haut-parleur & Micro */}
          <div className="flex justify-center">
            <div className="w-16 h-1.5 rounded-full bg-slate-600" />
          </div>

          {/* Onglets SMS / USSD sur le téléphone */}
          <div className="flex rounded-lg bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("SMS")}
              className={`flex-1 py-1 rounded flex items-center justify-center gap-1 transition ${
                activeTab === "SMS" ? "bg-primary text-primary-foreground shadow" : "text-slate-400"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS (132)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("USSD")}
              className={`flex-1 py-1 rounded flex items-center justify-center gap-1 transition ${
                activeTab === "USSD" ? "bg-primary text-primary-foreground shadow" : "text-slate-400"
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>USSD (*123#)</span>
            </button>
          </div>

          {/* Écran LCD du Téléphone */}
          <div className="h-72 rounded-2xl bg-[#0d141e] border-2 border-slate-800 p-3 overflow-y-auto space-y-2 text-xs font-mono">
            {activeTab === "SMS" ? (
              <div className="space-y-2">
                <div className="text-[10px] text-slate-500 text-center pb-1 border-b border-slate-800">
                  Numéro Court : 132 (Cadastre National)
                </div>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                      m.sender === "user"
                        ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                        : "mr-auto bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-emerald-400">
                <div className="text-[10px] text-slate-500 text-center pb-1 border-b border-slate-800">
                  Session USSD Active (*123*7#)
                </div>
                {ussdActive ? (
                  <div className="space-y-1 text-xs">
                    {ussdScreen.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    Composez *123*7# pour lancer le menu USSD foncier.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clavier et zone de saisie du téléphone */}
          {activeTab === "SMS" ? (
            <form onSubmit={handleSendSms} className="flex gap-1.5">
              <input
                type="text"
                value={smsInput}
                onChange={(e) => setSmsInput(e.target.value)}
                placeholder="Ex : VERIF OUI-0421"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none uppercase font-mono"
              />
              <button
                type="submit"
                className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCallUssd} className="flex gap-1.5">
              <input
                type="text"
                value={ussdInput}
                onChange={(e) => setUssdInput(e.target.value)}
                placeholder="Composez ex : *123*7# ou 1"
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Envoyer</span>
              </button>
            </form>
          )}

          {/* Raccourcis démo */}
          <div className="flex justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                if (activeTab === "SMS") setSmsInput("VERIF OUI-0421");
                else setUssdInput("*123*7#");
              }}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Pré-remplir l&apos;exemple standard
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
