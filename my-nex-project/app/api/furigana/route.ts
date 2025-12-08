import { NextResponse } from "next/server";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// Initialize Kuroshiro instance (singleton pattern)
let kuroshiroInstance: Kuroshiro | null = null;

async function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroInstance) {
    kuroshiroInstance = new Kuroshiro();
    await kuroshiroInstance.init(new KuromojiAnalyzer());
  }
  return kuroshiroInstance;
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

    // Initialize Kuroshiro
    const kuroshiro = await getKuroshiro();

    // Convert text with furigana using Kuroshiro
    const htmlResult = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "furigana",
    });

    // Parse the HTML result to extract furigana data
    const furiganaData = parseKuroshiroHTML(htmlResult);

    return NextResponse.json({ furigana: furiganaData });
  } catch (err) {
    console.error("Furigana error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
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
