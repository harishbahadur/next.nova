import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let instance: any = null;
let initPromise: Promise<any> | null = null;
let initFailed = false;

async function init() {
  if (instance) return instance;
  if (initFailed) return null;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log("[Furigana] Starting initialization...");
      const Kuroshiro = await import("kuroshiro");
      const KuromojiAnalyzer = await import("kuroshiro-analyzer-kuromoji");

      console.log("[Furigana] Creating Kuroshiro instance...");
      const k = new (Kuroshiro as any).default();

      console.log("[Furigana] Initializing analyzer...");
      await k.init(new (KuromojiAnalyzer as any).default());

      instance = k;
      console.log("[Furigana] ✓ Initialization successful");
      return k;
    } catch (error: any) {
      console.error(
        "[Furigana] ✗ Initialization failed:",
        error?.message || String(error)
      );
      initFailed = true;
      initPromise = null;
      return null;
    }
  })();

  return initPromise;
}

interface Part {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

function parse(html: string): Part[] {
  const result: Part[] = [];
  if (!html) return result;

  const regex =
    /<ruby>([^<]+)<(?:rp>\(<\/rp>)?<rt>([^<]+)<\/rt>(?:<rp>\)<\/rp>)?<\/ruby>/g;
  let last = 0;
  let m;

  while ((m = regex.exec(html)) !== null) {
    if (m.index > last) {
      const text = html
        .substring(last, m.index)
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) result.push({ type: "text", value: text });
    }
    const kanji = m[1].trim();
    const reading = m[2].trim();
    if (kanji && reading) result.push({ type: "kanji", value: kanji, reading });
    last = m.index + m[0].length;
  }

  if (last < html.length) {
    const text = html
      .substring(last)
      .replace(/<[^>]+>/g, "")
      .trim();
    if (text) result.push({ type: "text", value: text });
  }

  return result;
}

// Fallback: return text as-is when Kuroshiro unavailable
function fallbackParse(text: string): Part[] {
  return [{ type: "text", value: text }];
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Invalid input", furigana: [] },
        { status: 400 }
      );
    }

    console.log("[Furigana] Processing:", text);

    let k = await init();

    if (!k) {
      console.warn("[Furigana] Kuroshiro unavailable, returning text as-is");
      return NextResponse.json({
        furigana: fallbackParse(text),
        warning: "Furigana service temporarily unavailable",
      });
    }

    let html;
    try {
      html = await k.convert(text, { to: "hiragana", mode: "furigana" });
      console.log("[Furigana] Conversion successful");
    } catch (error: any) {
      console.error("[Furigana] Conversion error:", error?.message || error);
      return NextResponse.json({
        furigana: fallbackParse(text),
        warning: "Could not process text",
      });
    }

    const data = parse(html);
    return NextResponse.json({ furigana: data });
  } catch (error: any) {
    console.error("[Furigana] Request error:", error?.message || error);
    return NextResponse.json({
      furigana: [],
      error: "Internal server error",
    });
  }
}
