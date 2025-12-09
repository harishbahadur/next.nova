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
    console.log("Kuroshiro HTML output:", htmlResult);
    const furiganaData = parseKuroshiroHTML(htmlResult);
    console.log("Parsed furigana data:", furiganaData);

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

  // Handle different ruby tag formats that Kuroshiro might produce
  // Format 1: <ruby>漢<rp>(<\/rp><rt>かん<\/rt><rp>)<\/rp><\/ruby>
  // Format 2: <ruby>漢<rt>かん<\/rt><\/ruby>
  // Format 3: Plain text without ruby tags

  if (!html || html.trim() === "") {
    return parts;
  }

  // Try multiple regex patterns for different ruby formats
  const rubyPatterns = [
    // Pattern 1: Full format with parentheses
    /<ruby>(.*?)<rp>\(<\/rp><rt>(.*?)<\/rt><rp>\)<\/rp><\/ruby>/g,
    // Pattern 2: Simpler format without parentheses
    /<ruby>(.*?)<rt>(.*?)<\/rt><\/ruby>/g,
  ];

  let lastIndex = 0;
  let match;
  let patternFound = false;

  for (const rubyRegex of rubyPatterns) {
    rubyRegex.lastIndex = 0; // Reset regex state

    while ((match = rubyRegex.exec(html)) !== null) {
      patternFound = true;

      // Add any text before this ruby tag
      if (match.index > lastIndex) {
        const textBefore = html.substring(lastIndex, match.index);
        if (textBefore) {
          const cleanText = textBefore.replace(/<[^>]*>/g, "").trim();
          if (cleanText) {
            parts.push({ type: "text", value: cleanText });
          }
        }
      }

      // Add the ruby-tagged kanji with reading
      const kanji = match[1]?.trim() || "";
      const reading = match[2]?.trim() || "";

      if (kanji && reading) {
        parts.push({
          type: "kanji",
          value: kanji,
          reading: reading,
        });
      }

      lastIndex = rubyRegex.lastIndex;
    }

    if (patternFound) {
      break; // Found matching pattern, don't try others
    }
  }

  // If no ruby tags were found, return the plain text
  if (!patternFound) {
    const cleanText = html.replace(/<[^>]*>/g, "").trim();
    if (cleanText) {
      parts.push({ type: "text", value: cleanText });
    }
    return parts;
  }

  // Add any remaining text after the last ruby tag
  if (lastIndex < html.length) {
    const textAfter = html.substring(lastIndex);
    const cleanText = textAfter.replace(/<[^>]*>/g, "").trim();
    if (cleanText) {
      parts.push({ type: "text", value: cleanText });
    }
  }

  return parts;
}
