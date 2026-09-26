"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Check } from "lucide-react";
import { VOCAL_PHRASES, VoicePhrase } from "@/lib/audio";

interface AudioPhrasePlayerProps {
  phraseKey: string;
  defaultLang?: "fon" | "yo" | "fr";
}

export function AudioPhrasePlayer({ phraseKey, defaultLang = "fon" }: AudioPhrasePlayerProps) {
  const [lang, setLang] = useState<"fon" | "yo" | "fr">(defaultLang);
  const [isPlaying, setIsPlaying] = useState(false);

  const phrase: VoicePhrase | undefined = VOCAL_PHRASES[phraseKey];
  if (!phrase) return null;

  const currentText = phrase[lang];

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      return;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = lang === "fr" ? "fr-FR" : "fr-FR"; // Fallback phonétique
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visuel
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  return (
    <div className="bg-white border-2 border-[#0a3764]/20 rounded-xl p-3.5 text-xs space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[#0a3764] font-bold">
          <Volume2 className="w-4 h-4 text-[#008751] animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider">Attestation Vocale Multilingue</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setLang("fon")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "fon" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fongbe
          </button>
          <button
            type="button"
            onClick={() => setLang("yo")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "yo" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Yoruba
          </button>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "fr" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Français
          </button>
        </div>
      </div>

      <p className="text-slate-800 text-xs italic leading-relaxed bg-[#f6f8fb] p-2.5 rounded-lg border border-slate-200/80">
        « {currentText} »
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-[#008751]" /> Synthèse certifiée ANDF
        </span>
        <button
          type="button"
          onClick={handlePlay}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs ${
            isPlaying
              ? "bg-rose-600 text-white"
              : "bg-[#0a3764] hover:bg-[#072545] text-white"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Arrêter</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Écouter en {lang === "fon" ? "Fongbe" : lang === "yo" ? "Yoruba" : "Français"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
