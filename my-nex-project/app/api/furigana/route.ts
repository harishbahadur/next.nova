import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 10;

interface Part {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

// Kuroshiro singleton
let kuroshiroInstance: any = null;
let initPromise: Promise<any> | null = null;

// Reading overrides for common compounds and special cases
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

  // Time expressions
  今日: "きょう",
  明日: "あした",
  昨日: "きのう",
  今年: "ことし",
  去年: "きょねん",
  来年: "らいねん",
  毎日: "まいにち",
  毎週: "まいしゅう",

  // School/Education
  学校: "がっこう",
  先生: "せんせい",
  学生: "がくせい",
  大学: "だいがく",
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
  家族: "かぞく",
  友達: "ともだち",
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

  // Places
  郵便局: "ゆうびんきょく",
  病院: "びょういん",
  銀行: "ぎんこう",
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

  // Common words
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

// Find compound words in text
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

// Apply compound word overrides
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

  const result: Part[] = [];
  let textPosition = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const partStart = textPosition;
    const partEnd = textPosition + part.value.length;

    // Check if this part overlaps with any compound
    let matched = false;
    for (const compound of compounds) {
      if (partStart === compound.start) {
        // Calculate how many parts this compound spans
        let compoundLength = compound.word.length;
        let consumedLength = 0;
        let partsToSkip = 0;

        for (
          let j = i;
          j < parts.length && consumedLength < compoundLength;
          j++
        ) {
          consumedLength += parts[j].value.length;
          partsToSkip++;
        }

        result.push({
          type: "kanji",
          value: compound.word,
          reading: compound.reading,
        });

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

  // Kuroshiro emits <ruby><rb>漢字</rb><rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>
  // Handle optional <rb>/<rp> wrappers so readings are not skipped.
  const rubyRegex =
    /<ruby>(?:<rb>)?([^<]+?)(?:<\/rb>)?(?:<rp>[^<]*<\/rp>)?<rt>([^<]+)<\/rt>(?:<rp>[^<]*<\/rp>)?<\/ruby>/g;

  let lastIndex = 0;
  let match;

  while ((match = rubyRegex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = html.substring(lastIndex, match.index);
      const cleaned = textBefore
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ");
      if (cleaned) {
        result.push({ type: "text", value: cleaned });
      }
    }

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

  if (lastIndex < html.length) {
    const remaining = html
      .substring(lastIndex)
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ");
    if (remaining) {
      result.push({ type: "text", value: remaining });
    }
  }

  return result;
}

// Convert parts to ruby HTML
function partsToRubyHTML(parts: Part[]): string {
  return parts
    .map((part) => {
      if (part.type === "kanji" && part.reading) {
        return `<ruby><rb>${part.value}</rb><rt>${part.reading}</rt></ruby>`;
      }
      return part.value;
    })
    .join("");
}

// Fallback function using only reading overrides
function convertToFuriganafallback(text: string): Part[] {
  const compounds = findCompoundWords(text);
  const parts: Part[] = [];
  let lastIndex = 0;

  for (const compound of compounds) {
    if (compound.start > lastIndex) {
      parts.push({
        type: "text",
        value: text.substring(lastIndex, compound.start),
      });
    }
    parts.push({
      type: "kanji",
      value: compound.word,
      reading: compound.reading,
    });
    lastIndex = compound.end;
  }

  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.substring(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

// Convert text to furigana
async function convertToFurigana(text: string): Promise<Part[]> {
  try {
    console.log("[Furigana] Attempting Kuroshiro conversion...");
    const kuroshiro = await initKuroshiro();

    if (!kuroshiro) {
      console.log("[Furigana] Kuroshiro not available, using fallback");
      return convertToFuriganafallback(text);
    }

    // Find compound words
    const compounds = findCompoundWords(text);

    // Convert using Kuroshiro
    const html = await kuroshiro.convert(text, {
      to: "hiragana",
      mode: "furigana",
    });

    // Parse HTML
    let parts = parseRubyHTML(html);

    // Apply overrides
    if (compounds.length > 0) {
      parts = applyCompoundOverrides(parts, compounds, text);
    }

    console.log("[Furigana] Kuroshiro conversion successful");
    return parts;
  } catch (error) {
    console.error(
      "[Furigana] Kuroshiro conversion failed, using fallback:",
      error
    );
    return convertToFuriganafallback(text);
  }
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
    console.log(
      "[Furigana API] Processing text:",
      trimmedText.substring(0, 50)
    );

    const furigana = await convertToFurigana(trimmedText);
    const html = partsToRubyHTML(furigana);

    return NextResponse.json({
      furigana: furigana,
      html: html,
      source: furigana.some((p) => p.type === "kanji")
        ? "kuroshiro/fallback"
        : "fallback",
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
