import { NextResponse } from "next/server";

// Initialize Kuroshiro instance (singleton pattern)
let kuroshiroInstance: any = null;
let initializationPromise: Promise<any> | null = null;

async function getKuroshiro() {
  // Return the cached instance if already initialized
  if (kuroshiroInstance) {
    return kuroshiroInstance;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      const Kuroshiro = (await import("kuroshiro")).default;
      const KuromojiAnalyzer = (await import("kuroshiro-analyzer-kuromoji"))
        .default;

      kuroshiroInstance = new Kuroshiro();
      await kuroshiroInstance.init(new KuromojiAnalyzer());
      return kuroshiroInstance;
    } catch (err) {
      console.error("Failed to initialize Kuroshiro:", err);
      initializationPromise = null; // Reset for retry
      throw err;
    }
  })();

  return initializationPromise;
}

interface FuriganaPart {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const jsonData = JSON.parse(body);
    const text = jsonData.text;

    if (!text || text.length === 0) {
      return NextResponse.json(
        { error: "Missing text parameter" },
        { status: 400 }
      );
    }

    // Initialize Kuroshiro with timeout
    let kuroshiro;
    try {
      kuroshiro = await Promise.race([
        getKuroshiro(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Kuroshiro initialization timeout")),
            30000
          )
        ),
      ]);
    } catch (initErr) {
      console.error("Kuroshiro initialization failed:", initErr);
      return NextResponse.json(
        { error: "Japanese text processing service unavailable" },
        { status: 503 }
      );
    }

    // Convert text with furigana using Kuroshiro
    let htmlResult;
    try {
      htmlResult = await kuroshiro.convert(text, {
        to: "hiragana",
        mode: "furigana",
      });
    } catch (convertErr) {
      console.error("Kuroshiro conversion error:", convertErr);
      return NextResponse.json(
        { error: "Failed to process Japanese text" },
        { status: 400 }
      );
    }

    // Parse the HTML result to extract furigana data
    const furiganaData = parseKuroshiroHTML(htmlResult);

    return NextResponse.json({ furigana: furiganaData });
  } catch (err) {
    console.error("Furigana error:", err);
    return NextResponse.json(
      { error: "Server error processing request" },
      { status: 500 }
    );
  }
}

// Parse Kuroshiro's HTML output to our data structure
function parseKuroshiroHTML(html: string): FuriganaPart[] {
  const parts: FuriganaPart[] = [];

  // Kuroshiro returns HTML with ruby tags for furigana
  // We need to parse this and extract kanji + readings

  const rubyRegex =
    /<ruby>(.*?)<rp>\(<\/rp><rt>(.*?)<\/rt><rp>\)<\/rp><\/ruby>/g;
  let lastIndex = 0;
  let match;

  while ((match = rubyRegex.exec(html)) !== null) {
    // Add any text before this ruby tag
    if (match.index > lastIndex) {
      const textBefore = html.substring(lastIndex, match.index);
      if (textBefore) {
        // Remove any remaining HTML tags
        const cleanText = textBefore.replace(/<[^>]*>/g, "");
        if (cleanText) {
          parts.push({ type: "text", value: cleanText });
        }
      }
    }

    // Add the ruby-tagged kanji with reading
    const kanji = match[1];
    const reading = match[2];
    parts.push({
      type: "kanji",
      value: kanji,
      reading: reading,
    });

    lastIndex = rubyRegex.lastIndex;
  }

  // Add any remaining text after the last ruby tag
  if (lastIndex < html.length) {
    const textAfter = html.substring(lastIndex);
    const cleanText = textAfter.replace(/<[^>]*>/g, "");
    if (cleanText) {
      parts.push({ type: "text", value: cleanText });
    }
  }

  return parts;
}
