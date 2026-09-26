"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Send,
  RotateCcw,
  MessageSquare,
  PhoneCall,
  Activity,
  Server,
  Wifi,
  Signal,
  Battery,
  ShieldCheck,
  Radio,
  FileText,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Trash2,
  Coins,
} from "lucide-react";
import { processInboundSms, getSimulatedSmsJournal, SimulatedSmsRecord } from "@/lib/channels";
import { AudioPhrasePlayer } from "@/components/audio/AudioPhrasePlayer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileMoneyModal } from "@/components/simulators/MobileMoneyModal";

interface TelecomLog {
  id: string;
  timestamp: string;
  protocol: "SMPP v3.4" | "SS7 MAP" | "DGTCP Gateway";
  operator: "MTN Bénin" | "Moov Africa Bénin" | "Celtiis Bénin";
  msisdn: string;
  direction: "INBOUND" | "OUTBOUND";
  status: "DELIVRD" | "ROUTED" | "ACK_200";
  latencyMs: number;
  payload: string;
}

export function TelecomSimulatorsView() {
  const [activeTab, setActiveTab] = useState<"SMS" | "USSD">("SMS");
  const [selectedOperator, setSelectedOperator] = useState<"MTN Bénin" | "Moov Africa Bénin" | "Celtiis Bénin">("MTN Bénin");
  const [momoOpen, setMomoOpen] = useState(false);

  // Mode SMS
  const [smsInput, setSmsInput] = useState("VERIF OUI-0421");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "system"; text: string; time: string }>>([
    {
      sender: "system",
      text: "ANYIGBA: Bienvenue sur le Registre Foncier National. Envoyez VERIF <CodeParcelle> au 132.",
      time: "10:14",
    },
  ]);

  // Mode USSD
  const [ussdInput, setUssdInput] = useState("*123*7#");
  const [ussdScreen, setUssdScreen] = useState<string[]>([]);
  const [ussdActive, setUssdActive] = useState(false);

  // Journal télémétrique réseau
  const [telecomLogs, setTelecomLogs] = useState<TelecomLog[]>([
    {
      id: "TL-0912",
      timestamp: "10:14:02.140",
      protocol: "SMPP v3.4",
      operator: "MTN Bénin",
      msisdn: "+229 97 00 12 34",
      direction: "OUTBOUND",
      status: "DELIVRD",
      latencyMs: 142,
      payload: "SUBMIT_SM: Service National Anyigba initialisé sur le numéro court 132",
    },
  ]);

  const addLog = (
    protocol: "SMPP v3.4" | "SS7 MAP" | "DGTCP Gateway",
    direction: "INBOUND" | "OUTBOUND",
    payload: string,
    status: "DELIVRD" | "ROUTED" | "ACK_200" = "DELIVRD"
  ) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;

    const newLog: TelecomLog = {
      id: `TL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timeStr,
      protocol,
      operator: selectedOperator,
      msisdn: "+229 97 00 12 34",
      direction,
      status,
      latencyMs: Math.floor(180 + Math.random() * 120),
      payload,
    };

    setTelecomLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const handleSendSms = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!smsInput.trim()) return;

    const userMsg = smsInput.trim();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text: userMsg, time }]);
    setSmsInput("");

    addLog("SMPP v3.4", "INBOUND", `DELIVER_SM shortcode:132 text:"${userMsg}"`);

    setTimeout(() => {
      const resp = processInboundSms("+229 97 00 12 34", userMsg);
      const respTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [...prev, { sender: "system", text: resp, time: respTime }]);
      addLog("SMPP v3.4", "OUTBOUND", `SUBMIT_SM resp:"${resp.slice(0, 50)}..."`);
    }, 400);
  };

  const handleCallUssd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = ussdInput.trim();
    if (!input) return;

    addLog("SS7 MAP", "INBOUND", `MAP_PROCESS_UNSTRUCTURED_SS_REQ payload:"${input}"`);

    if (input === "*123*7#") {
      setUssdActive(true);
      setUssdScreen([
        "--- CADASTRE DU BÉNIN ---",
        "1. Vérifier un terrain",
        "2. Alerte cession de parcelle",
        "3. Contacter l'agent communal",
        "0. Quitter",
      ]);
      addLog("SS7 MAP", "OUTBOUND", `MAP_UNSTRUCTURED_SS_NOTIF menu:"CADASTRE DU BÉNIN"`);
    } else if (input === "1") {
      setUssdScreen([
        "Vérification de Terrain :",
        "Entrez le code cadastral :",
        "(Exemple : OUI-0421)",
      ]);
      addLog("SS7 MAP", "OUTBOUND", `MAP_UNSTRUCTURED_SS_NOTIF prompt:"Code cadastral"`);
    } else if (input.toUpperCase() === "OUI-0421") {
      setUssdScreen([
        "OUI-0421 (Pahou Ouidah):",
        "1250 m2 - Coutumier déclaré",
        "Titulaire: Germain DOSSOU",
        "Zéro litige - Disponible",
      ]);
      addLog("SS7 MAP", "OUTBOUND", `MAP_UNSTRUCTURED_SS_RESP status:"OUI-0421 VALID"`);
    } else {
      setUssdScreen(["Code non reconnu.", "1. Réessayer", "0. Quitter"]);
      addLog("SS7 MAP", "OUTBOUND", `MAP_UNSTRUCTURED_SS_RESP error:"UNKNOWN_CODE"`);
    }
    setUssdInput("");
  };

  const handleKeypadPress = (val: string) => {
    if (activeTab === "SMS") {
      setSmsInput((prev) => prev + val);
    } else {
      setUssdInput((prev) => prev + val);
    }
  };

  const handleKeypadClear = () => {
    if (activeTab === "SMS") {
      setSmsInput((prev) => prev.slice(0, -1));
    } else {
      setUssdInput((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise py-2">
      {/* En-tête Institutionnel d'Inclusion Télécoms */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/30 uppercase tracking-wide">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Inclusion Numérique Souveraine — Couverture Universelle</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
            Studio d&apos;Inclusion Télécoms : Feature Phone, Passerelle USSD &amp; SMS
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Testez en conditions réelles comment un citoyen sans smartphone ni connexion Internet 4G interroge le cadastre
            national via le numéro court 132 ou le portail USSD *123*7#.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs">
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold gap-1.5 shadow-md cursor-pointer"
            onClick={() => setMomoOpen(true)}
          >
            <Coins className="w-4 h-4" />
            <span>Tester Séquestre MoMo</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Opérateur émulé :</span>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-background border border-border font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="MTN Bénin">MTN Bénin (67 / 97)</option>
              <option value="Moov Africa Bénin">Moov Africa (94 / 95)</option>
              <option value="Celtiis Bénin">Celtiis Bénin (40 / 41)</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRILLE 3 COLONNES GÉANTE : ÉMULATEUR MOBILE | CONSOLE TÉLÉCOMMUNICATIONS | DOCUMENTATION & AUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLONNE GAUCHE (4 colonnes) : Émulateur Physique Feature Phone */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-[340px] p-5 rounded-[40px] bg-[#131b2a] border-4 border-[#24334a] shadow-2xl space-y-4">
            {/* Écouteur & Capteurs */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-slate-600" />
              <div className="w-2 h-2 rounded-full bg-slate-700" />
            </div>

            {/* Barre d'état LCD du Téléphone */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
              <span className="flex items-center gap-1 font-bold text-slate-300">
                <Signal className="w-3 h-3 text-emerald-400" />
                <span>{selectedOperator.split(" ")[0]}</span>
              </span>
              <span>10:14</span>
              <span className="flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" />
              </span>
            </div>

            {/* Sélecteur de mode SMS / USSD sur le combiné */}
            <div className="flex rounded-xl bg-slate-900 p-1 text-xs font-bold border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("SMS")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "SMS"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SMS (132)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("USSD")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === "USSD"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>USSD (*123#)</span>
              </button>
            </div>

            {/* Écran LCD Rétroéclairé */}
            <div className="h-64 rounded-2xl bg-[#090d14] border-2 border-slate-800 p-3 overflow-y-auto space-y-2 text-xs font-mono shadow-inner">
              {activeTab === "SMS" ? (
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-500 text-center pb-1 border-b border-slate-800/80">
                    Destinataire : 132 (Cadastre National)
                  </div>
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl text-[11px] leading-relaxed max-w-[88%] space-y-0.5 ${
                        m.sender === "user"
                          ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                          : "mr-auto bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700"
                      }`}
                    >
                      <div className="break-words">{m.text}</div>
                      <div className="text-[9px] text-right opacity-70">{m.time}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 text-emerald-400">
                  <div className="text-[10px] text-slate-500 text-center pb-1 border-b border-slate-800/80">
                    Session USSD (*123*7#)
                  </div>
                  {ussdActive ? (
                    <div className="space-y-1 text-xs">
                      {ussdScreen.map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-14 text-slate-500 text-xs">
                      Composez *123*7# puis appuyez sur Appeler.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Zone d'entrée de commande */}
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
                  className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition cursor-pointer shrink-0"
                  title="Envoyer SMS au 132"
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
                  placeholder="Ex : *123*7# ou 1"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Appel</span>
                </button>
              </form>
            )}

            {/* Clavier physique du Feature Phone (Touches 0-9, *, #) */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-3 gap-1.5">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 active:bg-slate-700 border border-slate-700/60 text-slate-200 font-mono font-bold text-sm shadow transition cursor-pointer"
                  >
                    {key}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleKeypadClear}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "SMS") setSmsInput("VERIF OUI-0421");
                    else setUssdInput("*123*7#");
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-primary/20 text-[11px] font-semibold text-primary hover:bg-primary/30 transition cursor-pointer"
                >
                  Pré-remplir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE CENTRALE (5 colonnes) : Console Télémétrique Réseau & Trames SS7 / SMPP */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-border shadow-xl bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-secondary" />
                  <CardTitle className="text-base font-bold text-foreground">
                    Console Télémétrique Réseau (SMPP / SS7)
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTelecomLogs([])}
                  className="h-7 text-[11px] gap-1 px-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </Button>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Surveillance en temps réel des paquets de signalisation télécoms et des transactions DGTCP.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 pt-0">
              <div className="h-80 rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-y-auto font-mono text-[11px] space-y-2">
                {telecomLogs.length === 0 ? (
                  <div className="text-center py-20 text-slate-500">
                    Aucune trame réseau. Envoyez un SMS ou lancez une requête USSD depuis le téléphone.
                  </div>
                ) : (
                  telecomLogs.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-bold">{log.timestamp}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              log.direction === "INBOUND"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-emerald-500/20 text-emerald-400"
                            }`}
                          >
                            {log.direction}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px]">
                            {log.protocol}
                          </span>
                          <span className="text-amber-400 font-semibold">{log.latencyMs}ms</span>
                        </div>
                      </div>
                      <div className="text-slate-200 text-xs break-all">{log.payload}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-800/50">
                        <span>Route : {log.operator} &rarr; DGTCP Gateway</span>
                        <span className="text-emerald-400 font-semibold">{log.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE (3 colonnes) : Audio Multilingue & Architecture */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-border shadow-xl bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Synthèse Vocale en Langues Nationales
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Inclusion des usagers en milieu rural pour la compréhension des actes fonciers.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
              <AudioPhrasePlayer phraseKey="parcelle_titre_foncier_valide" />
            </CardContent>
          </Card>

          <Card className="border-border bg-card p-4 space-y-2 text-xs">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantie de Souveraineté</span>
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Les échanges USSD et SMS transitent par des liens cryptés directs avec l&apos;ASIN et les trois opérateurs
              nationaux, garantissant le secret des réquisitions foncières et la conformité au Code Foncier et Domanial.
            </p>
          </Card>
        </div>
      </div>

      {/* Modal Mobile Money */}
      <MobileMoneyModal
        isOpen={momoOpen}
        onClose={() => setMomoOpen(false)}
        montantDefault={4500000}
        motifDefault="Séquestre réglementé parcelle OUI-0421"
        parcelleCode="OUI-0421"
      />
    </div>
  );
}
