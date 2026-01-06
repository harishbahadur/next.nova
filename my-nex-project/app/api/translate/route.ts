import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface TranslateRequestBody {
  text: string;
  source: string; // e.g., "ja" or "en"
  target: string; // e.g., "en" or "ja"
}

export async function POST(req: Request) {
  try {
    const { text, source, target } = (await req.json()) as TranslateRequestBody;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Invalid input: 'text' is required" },
        { status: 400 }
      );
    }

    if (!source || !target) {
      return NextResponse.json(
        { error: "Invalid input: 'source' and 'target' are required" },
        { status: 400 }
      );
    }

    // Helper: timeout wrapper for fetch
    const fetchWithTimeout = async (url: string, options: any, ms = 8000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
      } finally {
        clearTimeout(id);
      }
    };

    // Provider 1: LibreTranslate (Argos) — public endpoint
    const tryLibre = async () => {
      const res = await fetchWithTimeout(
        "https://translate.argosopentech.com/translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, source, target, format: "text" }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data && (data.error || data.message)) ||
            `LibreTranslate error ${res.status}`
        );
      }
      return data.translatedText || data.translated_text || "";
    };

    // Provider 2: MyMemory — free fallback, quality varies
    const tryMyMemory = async () => {
      const from = source.toLowerCase();
      const to = target.toLowerCase();
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${encodeURIComponent(from + "|" + to)}`;
      const res = await fetchWithTimeout(url, { method: "GET" }, 8000);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data && (data.responseDetails || data.message)) ||
            `MyMemory error ${res.status}`
        );
      }
      const translated = data?.responseData?.translatedText || "";
      return translated;
    };

    // Try primary provider, then fallback
    let translatedText = "";
    try {
      translatedText = await tryLibre();
    } catch (e1: any) {
      console.warn(
        "[Translate] LibreTranslate failed, trying fallback:",
        e1?.message || e1
      );
      try {
        translatedText = await tryMyMemory();
      } catch (e2: any) {
        const message = e2?.message || e1?.message || "Translation failed";
        return NextResponse.json({ error: message }, { status: 502 });
      }
    }

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error("[Translate API] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
