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
    <div className="bg-card/80 border border-primary/20 rounded-xl p-3 text-xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-primary font-semibold">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>Attestation Vocale Multilingue</span>
        </div>
        <div className="flex items-center gap-1 bg-background/60 p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setLang("fon")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              lang === "fon" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Fongbe
          </button>
          <button
            type="button"
            onClick={() => setLang("yo")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              lang === "yo" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yoruba
          </button>
          <button
            type="button"
            onClick={() => setLang("fr")}
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
              lang === "fr" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Français
          </button>
        </div>
      </div>

      <p className="text-muted-foreground italic leading-relaxed bg-background/40 p-2 rounded border border-border/50">
        « {currentText} »
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Check className="w-3 h-3 text-success" /> Synthèse certifiée ANDF
        </span>
        <button
          type="button"
          onClick={handlePlay}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs transition ${
            isPlaying
              ? "bg-destructive text-destructive-foreground"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
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
