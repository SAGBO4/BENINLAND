import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Cache mémoire pour les requêtes audio récurrentes
const audioCache = new Map<string, { bytes: Uint8Array; contentType: string }>();

const DEFAULT_BASE_URL = "https://ronaldodev-api.hf.space";

function normalizeLanguage(lang: string): "fon" | "yoruba" | "hausa" {
  const l = (lang || "").toLowerCase().trim();
  if (l === "yo" || l === "yoruba") return "yoruba";
  if (l === "ha" || l === "hausa") return "hausa";
  return "fon"; // défaut Fon
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    const rawLang = typeof body?.language === "string" ? body.language : "fon";

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Le paramètre 'text' est requis." },
        { status: 400 }
      );
    }

    const language = normalizeLanguage(rawLang);
    const cacheKey = `${language}:${crypto.createHash("md5").update(text).digest("hex")}`;

    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(cached.bytes as any, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Audio-Cache": "HIT",
        },
      });
    }

    const baseUrl = process.env.API229_BASE_URL || DEFAULT_BASE_URL;
    const hfToken = process.env.API229_HF_TOKEN || "";
    const apiKey = process.env.API229_API_KEY || "";

    const ttsEndpoint = `${baseUrl.replace(/\/$/, "")}/api/v1/tts`;

    const response = await fetch(ttsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hfToken}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        text,
        language,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return NextResponse.json(
        {
          success: false,
          error: `Erreur API 229 Langues (${response.status}) : ${errorText || response.statusText}`,
        },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const contentType =
      response.headers.get("content-type") ||
      (language === "fon" ? "audio/wav" : "audio/mpeg");

    // Mise en cache mémoire
    audioCache.set(cacheKey, { bytes, contentType });

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Audio-Cache": "MISS",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne lors de la synthèse vocale : " + (err?.message || "inconnue"),
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  const rawLang = searchParams.get("language") || searchParams.get("lang") || "fon";

  if (!text.trim()) {
    return NextResponse.json(
      { success: false, error: "Le paramètre query 'text' est requis." },
      { status: 400 }
    );
  }

  const language = normalizeLanguage(rawLang);
  const cacheKey = `${language}:${crypto.createHash("md5").update(text.trim()).digest("hex")}`;

  if (audioCache.has(cacheKey)) {
    const cached = audioCache.get(cacheKey)!;
    return new NextResponse(cached.bytes as any, {
      status: 200,
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Audio-Cache": "HIT",
      },
    });
  }

  const baseUrl = process.env.API229_BASE_URL || DEFAULT_BASE_URL;
  const hfToken = process.env.API229_HF_TOKEN || "";
  const apiKey = process.env.API229_API_KEY || "";

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hfToken}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        text: text.trim(),
        language,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `Erreur API 229 (${response.status})` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const contentType =
      response.headers.get("content-type") ||
      (language === "fon" ? "audio/wav" : "audio/mpeg");

    audioCache.set(cacheKey, { bytes, contentType });

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "X-Audio-Cache": "MISS",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Erreur de connexion API" },
      { status: 500 }
    );
  }
}
