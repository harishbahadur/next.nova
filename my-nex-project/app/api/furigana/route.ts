import { NextResponse } from "next/server";

let instance: any = null;
let initPromise: Promise<any> | null = null;

async function init() {
  if (instance) return instance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const Kuroshiro = require("kuroshiro");
    const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
    const k = new Kuroshiro.default();
    await k.init(new KuromojiAnalyzer.default());
    instance = k;
    return k;
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

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let k;
    try {
      k = await init();
    } catch (initError: any) {
      console.error("[Furigana] Init failed:", initError?.message || initError);
      return NextResponse.json(
        { error: "Service initialization failed" },
        { status: 503 }
      );
    }

    let html;
    try {
      html = await k.convert(text, { to: "hiragana", mode: "furigana" });
    } catch (convertError: any) {
      console.error(
        "[Furigana] Convert failed:",
        convertError?.message || convertError
      );
      return NextResponse.json(
        { error: "Text conversion failed" },
        { status: 400 }
      );
    }

    const data = parse(html);
    return NextResponse.json({ furigana: data });
  } catch (error: any) {
    console.error("[Furigana] Error:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
