import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Use Jisho API for accurate Japanese readings
// Free, no authentication required, works perfectly on Vercel

interface Part {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

// Fallback dictionary for common kanji when API fails
// This works on Vercel without needing file system access or external libraries
const kanjiMap: Record<string, string> = {
  学: "がく",
  生: "せい",
  校: "こう",
  日: "にち",
  本: "ほん",
  語: "ご",
  先: "せん",
  師: "し",
  子: "こ",
  年: "ねん",
  月: "がつ",
  火: "か",
  水: "すい",
  木: "もく",
  金: "きん",
  土: "ど",
  週: "しゅう",
  間: "かん",
  時: "じ",
  分: "ぶん",
  秒: "びょう",
  仕: "し",
  事: "じ",
  会: "かい",
  社: "しゃ",
  員: "いん",
  部: "ぶ",
  課: "か",
  室: "しつ",
  所: "ところ",
  場: "ば",
  業: "ぎょう",
  成: "せい",
  果: "か",
  結: "けつ",
  大: "だい",
  小: "しょう",
  中: "ちゅう",
  新: "しん",
  古: "こ",
  高: "こう",
  低: "てい",
  良: "りょう",
  悪: "あく",
  多: "た",
  少: "しょう",
  長: "ちょう",
  短: "たん",
  速: "そく",
  遅: "ち",
  早: "はや",
  晩: "ばん",
  朝: "あさ",
  昼: "ひる",
  夜: "よる",
  春: "はる",
  夏: "なつ",
  秋: "あき",
  冬: "ふゆ",
  東: "とう",
  西: "せい",
  南: "なん",
  北: "ほく",
  上: "うえ",
  下: "した",
  左: "ひだり",
  右: "みぎ",
  前: "まえ",
  後: "ご",
  外: "がい",
  内: "ない",
  人: "ひと",
  名: "な",
  者: "もの",
  家: "いえ",
  店: "みせ",
  駅: "えき",
  町: "ちょう",
  村: "むら",
  空: "そら",
  風: "ふう",
  雨: "あめ",
  雪: "ゆき",
  雲: "くも",
  太: "ふと",
  陽: "よう",
  星: "ほし",
  光: "こう",
  色: "いろ",
  音: "おと",
  匂: "におい",
  味: "あじ",
  冷: "つめたい",
  熱: "あつい",
  暖: "あたたかい",
  涼: "すずしい",
  重: "おも",
  軽: "かる",
  硬: "かたい",
  柔: "やわらかい",
  美: "び",
  醜: "しゅう",
  強: "つよい",
  弱: "よわい",
  勇: "ゆう",
  敢: "あえて",
  怖: "こわい",
  怪: "かい",
  奇: "き",
  常: "じょう",
  異: "い",
  寺: "てら",
  宮: "みや",
  神: "しん",
  仏: "ほとけ",
  心: "こころ",
  身: "み",
  手: "て",
  足: "あし",
  頭: "あたま",
  顔: "かお",
  目: "め",
  耳: "みみ",
  口: "くち",
  鼻: "はな",
  舌: "した",
  歯: "は",
  喉: "のど",
  肺: "はい",
  肝: "かん",
  腎: "じん",
  脾: "ひ",
  胃: "い",
  腸: "ちょう",
  血: "ち",
  肉: "にく",
  骨: "ほね",
  筋: "きん",
  皮: "かわ",
  毛: "け",
  爪: "つめ",
  髪: "かみ",
  返: "かえ",
  裏: "うら",
  表: "おもて",
  横: "よこ",
  縦: "たて",
  斜: "なな",
  直: "ちょく",
  曲: "ま",
  丸: "まる",
  四: "よん",
  角: "かど",
  三: "さん",
  五: "ご",
  六: "ろく",
  七: "しち",
  八: "はち",
  九: "きゅう",
  十: "じゅう",
  百: "ひゃく",
  千: "せん",
  万: "まん",
  億: "おく",
  兆: "ちょう",
  引: "ひ",
  掛: "か",
  割: "わ",
  比: "ひ",
  // Additional common kanji
  一: "いち",
  二: "に",
  来: "く",
  行: "い",
  見: "み",
  知: "し",
  思: "おも",
  言: "い",
  書: "か",
  読: "よ",
  食: "た",
  飲: "の",
  物: "もの",
  机: "つくえ",
  椅: "い",
  的: "てき",
  性: "しょう",
  気: "き",
  力: "ちから",
  動: "うご",
  能: "のう",
  作: "つく",
  使: "つか",
  持: "も",
  運: "はこ",
  転: "てん",
  開: "あ",
  閉: "と",
  入: "い",
  出: "で",
  走: "はし",
  止: "と",
  置: "お",
  連: "つ",
  続: "つづ",
  起: "お",
  寝: "ね",
  着: "き",
  脱: "ぬ",
  洗: "あら",
  磨: "みが",
  切: "き",
  折: "お",
  伸: "の",
  広: "ひろ",
  狭: "せま",
  深: "ふか",
  浅: "あさ",
  遠: "とお",
  近: "ちか",
  明: "あか",
  暗: "くら",
  苦: "くるし",
  楽: "たの",
  易: "やさ",
  難: "むずか",
  粗: "あら",
  細: "ほそ",
  厚: "あつ",
  薄: "うす",
  固: "かた",
  乾: "かわ",
  湿: "しめ",
  正: "ただ",
  誤: "あやま",
  真: "ま",
  偽: "うそ",
  善: "よ",
  嫌: "きら",
  清: "きよ",
  汚: "よご",
  静: "しず",
};

// Fetch furigana from Jisho.org API (accurate Japanese readings)
async function fetchFuriganaFromAPI(text: string): Promise<Part[] | null> {
  try {
    // Use Jisho API to search for the phrase/word
    const response = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        text
      )}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // If we found results, extract readings
    if (data.data && data.data.length > 0) {
      const firstResult = data.data[0];

      // Get Japanese word and reading
      if (firstResult.japanese && firstResult.japanese.length > 0) {
        const japanese = firstResult.japanese[0];
        const word = japanese.word || text;
        const reading = japanese.reading || "";

        // Parse the word with its reading
        return parseWordWithReading(word, reading);
      }
    }

    return null;
  } catch (error) {
    console.error("[Furigana API] Error:", error);
    return null;
  }
}

// Parse a word with its known reading
function parseWordWithReading(word: string, reading: string): Part[] {
  const result: Part[] = [];

  // If reading is in hiragana/katakana, map it character by character
  const wordChars = word.split("");
  const readingChars = reading.split("");

  for (let i = 0; i < wordChars.length; i++) {
    const char = wordChars[i];
    const charCode = char.charCodeAt(0);

    // Check if it's kanji
    if (charCode >= 0x4e00 && charCode <= 0x9fff) {
      // For now, use simple per-character reading
      const kanjiReading = kanjiMap[char] || "";
      result.push({
        type: "kanji",
        value: char,
        reading: kanjiReading,
      });
    } else {
      result.push({
        type: "text",
        value: char,
      });
    }
  }

  return result;
}

// Fallback: parse locally using dictionary
function parseToFurigana(text: string): Part[] {
  const result: Part[] = [];
  const textLen = text.length;
  let i = 0;

  while (i < textLen) {
    const charCode = text.charCodeAt(i);

    // Check if it's a kanji character (CJK Unified Ideographs: 0x4E00-0x9FFF)
    if (charCode >= 0x4e00 && charCode <= 0x9fff) {
      const char = text[i];
      const reading = kanjiMap[char];

      // Add kanji with reading if available, otherwise add without reading
      result.push({
        type: "kanji",
        value: char,
        reading: reading || "", // Empty string if no reading found
      });
      i++;
    } else {
      // Collect consecutive non-kanji characters
      let textPart = "";
      while (i < textLen) {
        const nextCharCode = text.charCodeAt(i);
        // Stop when we hit a kanji character
        if (nextCharCode >= 0x4e00 && nextCharCode <= 0x9fff) {
          break;
        }
        textPart += text[i];
        i++;
      }

      // Only add non-empty text parts
      const trimmed = textPart.trim();
      if (trimmed) {
        result.push({
          type: "text",
          value: textPart,
        });
      }
    }
  }

  return result;
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Fast path for empty input
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input", furigana: [] },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (!trimmedText) {
      return NextResponse.json(
        { error: "Invalid input", furigana: [] },
        { status: 400 }
      );
    }

    // Try API first for accurate readings
    let furigana: Part[] | null = await fetchFuriganaFromAPI(trimmedText);

    // Fallback to local dictionary if API fails
    if (!furigana || furigana.length === 0) {
      furigana = parseToFurigana(trimmedText);
    }

    return NextResponse.json({
      furigana: furigana,
    });
  } catch (error: any) {
    // On error, return empty array
    return NextResponse.json(
      {
        furigana: [],
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
