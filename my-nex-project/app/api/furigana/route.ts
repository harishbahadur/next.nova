import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Production-ready furigana with Kuroshiro + overrides
// Accurate kun-yomi, on-yomi, names, and compound handling

interface Part {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

// Kuroshiro singleton
let kuroshiroInstance: any = null;
let initPromise: Promise<any> | null = null;

// Reading overrides for common compounds and special cases
// These override Kuroshiro's morphological analysis for known correct readings
const readingOverrides: Record<string, string> = {
  // Country names and language
  日本: "にほん",
  日本語: "にほんご",
  日本人: "にほんじん",
  中国: "ちゅうごく",
  中国語: "ちゅうごくご",
  中国人: "ちゅうごくじん",
  韓国: "かんこく",
  韓国語: "かんこくご",
  韓国人: "かんこくじん",
  英語: "えいご",
  外国: "がいこく",
  外国語: "がいこくご",
  外国人: "がいこくじん",

  // Time expressions (critical for correct readings)
  今日: "きょう",
  明日: "あした",
  昨日: "きのう",
  一昨日: "おととい",
  明後日: "あさって",
  今年: "ことし",
  去年: "きょねん",
  来年: "らいねん",
  今月: "こんげつ",
  来月: "らいげつ",
  先月: "せんげつ",
  毎日: "まいにち",
  毎週: "まいしゅう",
  毎月: "まいつき",
  毎年: "まいとし",
  今週: "こんしゅう",
  来週: "らいしゅう",
  先週: "せんしゅう",
  週末: "しゅうまつ",
  平日: "へいじつ",

  // Counters and numbers
  一人: "ひとり",
  二人: "ふたり",
  三人: "さんにん",
  四人: "よにん",
  五人: "ごにん",
  六人: "ろくにん",
  七人: "しちにん",
  八人: "はちにん",
  九人: "きゅうにん",
  十人: "じゅうにん",
  何人: "なんにん",
  何時: "なんじ",
  何分: "なんぷん",
  一つ: "ひとつ",
  二つ: "ふたつ",
  三つ: "みっつ",
  四つ: "よっつ",
  五つ: "いつつ",
  六つ: "むっつ",
  七つ: "ななつ",
  八つ: "やっつ",
  九つ: "ここのつ",
  十: "とお",

  // Education
  学生: "がくせい",
  先生: "せんせい",
  学校: "がっこう",
  小学校: "しょうがっこう",
  中学校: "ちゅうがっこう",
  高校: "こうこう",
  高等学校: "こうとうがっこう",
  大学: "だいがく",
  大学生: "だいがくせい",
  小学生: "しょうがくせい",
  中学生: "ちゅうがくせい",
  高校生: "こうこうせい",
  留学生: "りゅうがくせい",
  留学: "りゅうがく",
  勉強: "べんきょう",
  宿題: "しゅくだい",
  授業: "じゅぎょう",
  試験: "しけん",
  教室: "きょうしつ",
  図書館: "としょかん",

  // Daily life
  食べ物: "たべもの",
  飲み物: "のみもの",
  買い物: "かいもの",
  仕事: "しごと",
  会社: "かいしゃ",
  会社員: "かいしゃいん",
  時間: "じかん",
  場所: "ばしょ",
  生活: "せいかつ",
  生活費: "せいかつひ",
  家族: "かぞく",
  友達: "ともだち",
  彼女: "かのじょ",
  彼氏: "かれし",
  家賃: "やちん",
  部屋: "へや",

  // Transportation
  電車: "でんしゃ",
  電話: "でんわ",
  新幹線: "しんかんせん",
  自転車: "じてんしゃ",
  地下鉄: "ちかてつ",
  飛行機: "ひこうき",
  空港: "くうこう",
  駅: "えき",
  出口: "でぐち",
  入口: "いりぐち",
  改札: "かいさつ",

  // Places
  郵便局: "ゆうびんきょく",
  病院: "びょういん",
  銀行: "ぎんこう",
  市役所: "しやくしょ",
  交番: "こうばん",
  薬局: "やっきょく",
  本屋: "ほんや",
  映画館: "えいがかん",
  美術館: "びじゅつかん",
  博物館: "はくぶつかん",
  動物園: "どうぶつえん",
  遊園地: "ゆうえんち",
  公園: "こうえん",

  // Cities
  東京: "とうきょう",
  京都: "きょうと",
  大阪: "おおさか",
  名古屋: "なごや",
  北海道: "ほっかいどう",
  九州: "きゅうしゅう",
  沖縄: "おきなわ",
  横浜: "よこはま",
  神戸: "こうべ",
  福岡: "ふくおか",
  札幌: "さっぽろ",
  仙台: "せんだい",

  // Common words prone to mistakes
  気: "き",
  天気: "てんき",
  元気: "げんき",
  電気: "でんき",
  人気: "にんき",
  上手: "じょうず",
  下手: "へた",
  大丈夫: "だいじょうぶ",
  大切: "たいせつ",
  大好き: "だいすき",
  大変: "たいへん",
  小さい: "ちいさい",
  大きい: "おおきい",
  新しい: "あたらしい",
  古い: "ふるい",
  若い: "わかい",
  楽しい: "たのしい",
  嬉しい: "うれしい",
  悲しい: "かなしい",
  難しい: "むずかしい",
  易しい: "やさしい",
  優しい: "やさしい",
};

// Initialize Kuroshiro (lazy loading)
async function initKuroshiro() {
  if (kuroshiroInstance) return kuroshiroInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const Kuroshiro = (await import("kuroshiro")).default;
      const KuromojiAnalyzer = (await import("kuroshiro-analyzer-kuromoji"))
        .default;

      const instance = new Kuroshiro();
      await instance.init(new KuromojiAnalyzer());

      kuroshiroInstance = instance;
      console.log("[Kuroshiro] Initialized successfully");
      return instance;
    } catch (error) {
      console.error("[Kuroshiro] Initialization failed:", error);
      initPromise = null;
      return null;
    }
  })();

  return initPromise;
}

// Find compound words in text and their positions
function findCompoundWords(
  text: string
): Array<{ word: string; start: number; end: number; reading: string }> {
  const compounds: Array<{
    word: string;
    start: number;
    end: number;
    reading: string;
  }> = [];

  // Sort by length descending to match longer compounds first
  const sortedKeys = Object.keys(readingOverrides).sort(
    (a, b) => b.length - a.length
  );

  for (const word of sortedKeys) {
    let index = 0;
    while ((index = text.indexOf(word, index)) !== -1) {
      // Check if this position is already covered by a longer compound
      const overlaps = compounds.some(
        (c) =>
          (index >= c.start && index < c.end) ||
          (index + word.length > c.start && index + word.length <= c.end)
      );

      if (!overlaps) {
        compounds.push({
          word: word,
          start: index,
          end: index + word.length,
          reading: readingOverrides[word],
        });
      }

      index += word.length;
    }
  }

  // Sort by position
  return compounds.sort((a, b) => a.start - b.start);
}

// Apply compound word overrides to parsed parts
function applyCompoundOverrides(
  parts: Part[],
  compounds: Array<{
    word: string;
    start: number;
    end: number;
    reading: string;
  }>,
  originalText: string
): Part[] {
  if (compounds.length === 0) return parts;

  // For each compound, find and replace matching parts
  const result: Part[] = [];
  let textPosition = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partStart = textPosition;
    const partEnd = textPosition + part.value.length;

    // Check if this part overlaps with any compound
    let matched = false;
    for (const compound of compounds) {
      // If this part is at the start of a compound
      if (partStart === compound.start) {
        // Calculate how many parts this compound spans
        let compoundLength = compound.word.length;
        let consumedLength = 0;
        let partsToSkip = 0;

        // Count parts that make up this compound
        for (
          let j = i;
          j < parts.length && consumedLength < compoundLength;
          j++
        ) {
          consumedLength += parts[j].value.length;
          partsToSkip++;
        }

        // Add the compound as a single part with override
        result.push({
          type: "kanji",
          value: compound.word,
          reading: compound.reading,
        });

        // Skip the parts we consumed
        i += partsToSkip - 1;
        textPosition += compound.word.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result.push(part);
      textPosition += part.value.length;
    }
  }

  return result;
}

// Parse HTML ruby tags from Kuroshiro output
function parseRubyHTML(html: string): Part[] {
  const result: Part[] = [];
  if (!html) return result;

  // Regex to match <ruby>kanji<rt>reading</rt></ruby>
  const rubyRegex = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g;
  let lastIndex = 0;
  let match;

  while ((match = rubyRegex.exec(html)) !== null) {
    // Add any text before this ruby tag
    if (match.index > lastIndex) {
      const textBefore = html.substring(lastIndex, match.index);
      const cleaned = textBefore.replace(/<[^>]+>/g, "").trim();
      if (cleaned) {
        result.push({ type: "text", value: cleaned });
      }
    }

    // Add the kanji with reading
    const kanji = match[1].trim();
    const reading = match[2].trim();

    if (kanji && reading) {
      result.push({
        type: "kanji",
        value: kanji,
        reading: reading,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < html.length) {
    const remaining = html
      .substring(lastIndex)
      .replace(/<[^>]+>/g, "")
      .trim();
    if (remaining) {
      result.push({ type: "text", value: remaining });
    }
  }

  return result;
}

// Convert parts array to HTML ruby tags
function partsToRubyHTML(parts: Part[]): string {
  return parts
    .map((part) => {
      if (part.type === "kanji" && part.reading) {
        return `<ruby>${part.value}<rt>${part.reading}</rt></ruby>`;
      }
      return part.value;
    })
    .join("");
}

// Convert text to furigana using Kuroshiro
async function convertToFurigana(text: string): Promise<Part[]> {
  try {
    const kuroshiro = await initKuroshiro();

    if (!kuroshiro) {
      throw new Error("Kuroshiro not initialized");
    }

    // Find compound words that need override
    const compounds = findCompoundWords(text);

    // Convert to furigana HTML using Kuroshiro
    const html = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "furigana",
    });

    // Parse the HTML to extract parts
    let parts = parseRubyHTML(html);

    // Apply compound word overrides
    if (compounds.length > 0) {
      parts = applyCompoundOverrides(parts, compounds, text);
    }

    return parts;
  } catch (error) {
    console.error("[Furigana] Conversion error:", error);
    throw error;
  }
}

// Apply manual overrides after Kuroshiro processing
function applyManualOverrides(parts: Part[], originalText: string): Part[] {
  const result: Part[] = [];

  for (const part of parts) {
    if (part.type === "kanji") {
      // Check if this kanji + next parts form an override word
      const word = part.value;
      if (readingOverrides[word]) {
        result.push({
          type: "kanji",
          value: word,
          reading: readingOverrides[word],
        });
      } else {
        result.push(part);
      }
    } else {
      // Handle text with override markers
      if (part.value.includes("〔") && part.value.includes("〕")) {
        const matches = part.value.match(/〔([^〕]+)〕/g);
        if (matches) {
          let remaining = part.value;
          for (const match of matches) {
            const word = match.replace(/〔|〕/g, "");
            const reading = readingOverrides[word];

            if (reading) {
              const parts = remaining.split(match);
              if (parts[0]) {
                result.push({ type: "text", value: parts[0] });
              }
              result.push({
                type: "kanji",
                value: word,
                reading: reading,
              });
              remaining = parts.slice(1).join(match);
            }
          }
          if (remaining) {
            result.push({ type: "text", value: remaining });
          }
        } else {
          result.push(part);
        }
      } else {
        result.push(part);
      }
    }
  }

  return result;
}

// POST handler
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Invalid input", furigana: [] },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // Convert using Kuroshiro
    const furigana = await convertToFurigana(trimmedText);

    // Convert to HTML ruby tags for display
    const html = partsToRubyHTML(furigana);

    return NextResponse.json({
      furigana: furigana,
      html: html,
      source: "kuroshiro",
    });
  } catch (error: any) {
    console.error("[Furigana API] Error:", error);

    return NextResponse.json(
      {
        furigana: [],
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
