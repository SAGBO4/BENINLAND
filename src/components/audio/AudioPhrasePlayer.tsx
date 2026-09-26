"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Check, Loader2, Sparkles } from "lucide-react";
import { VOCAL_PHRASES, VoicePhrase } from "@/lib/audio";

interface AudioPhrasePlayerProps {
  phraseKey: string;
  defaultLang?: "fon" | "yo" | "ha" | "fr";
}

export function AudioPhrasePlayer({ phraseKey, defaultLang = "fon" }: AudioPhrasePlayerProps) {
  const [lang, setLang] = useState<"fon" | "yo" | "ha" | "fr">(defaultLang);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const phrase: VoicePhrase | undefined = VOCAL_PHRASES[phraseKey];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!phrase) return null;

  const currentText = (phrase as any)[lang] || phrase.fr;

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handlePlay = async () => {
    if (isPlaying || isLoading) {
      stopCurrentAudio();
      return;
    }

    // Français : synthèse vocale native Web Speech
    if (lang === "fr") {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = "fr-FR";
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    // Langues nationales béninoises (Fongbe, Yoruba, Hausa) : appel API 229 Langues
    try {
      setIsLoading(true);

      const targetLang = lang === "yo" ? "yoruba" : lang === "ha" ? "hausa" : "fon";

      const res = await fetch("/api/v1/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText,
          language: targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur TTS (${res.status})`);
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      console.warn("Échec TTS distant, tentative de secours :", err);
      setIsLoading(false);

      // Secours phonétique si disponible
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = "fr-FR";
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const getLangLabel = () => {
    switch (lang) {
      case "fon":
        return "Fongbe";
      case "yo":
        return "Yoruba";
      case "ha":
        return "Hausa";
      default:
        return "Français";
    }
  };

  return (
    <div className="bg-white border-2 border-[#0a3764]/20 rounded-xl p-3.5 text-xs space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[#0a3764] font-bold">
          <Volume2 className="w-4 h-4 text-[#008751] animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider">Attestation Vocale Multilingue</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => {
              stopCurrentAudio();
              setLang("fon");
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "fon" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fongbe
          </button>
          <button
            type="button"
            onClick={() => {
              stopCurrentAudio();
              setLang("yo");
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "yo" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Yoruba
          </button>
          <button
            type="button"
            onClick={() => {
              stopCurrentAudio();
              setLang("ha");
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
              lang === "ha" ? "bg-[#0a3764] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hausa
          </button>
          <button
            type="button"
            onClick={() => {
              stopCurrentAudio();
              setLang("fr");
            }}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
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

      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Synthèse IA • 229 Langues Bénin</span>
        </span>
        <button
          type="button"
          onClick={handlePlay}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-70 ${
            isPlaying
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : isLoading
              ? "bg-amber-600 text-white"
              : "bg-[#0a3764] hover:bg-[#072545] text-white"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Génération audio...</span>
            </>
          ) : isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Arrêter</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Écouter en {getLangLabel()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

