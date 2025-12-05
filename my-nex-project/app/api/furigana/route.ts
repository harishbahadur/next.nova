import { NextResponse } from "next/server";

// Accurate kanji dictionary with correct kun'yomi readings (NO DUPLICATES)
const KANJI_DICT: Record<string, string> = {
  // Numbers
  一: "いち",
  二: "に",
  三: "さん",
  四: "し",
  五: "ご",
  六: "ろく",
  七: "しち",
  八: "はち",
  九: "きゅう",
  十: "じゅう",
  百: "ひゃく",
  千: "せん",
  万: "まん",
  // Time/Calendar
  日: "ひ",
  月: "つき",
  年: "とし",
  時: "とき",
  週: "しゅう",
  分: "ぶん",
  秒: "びょう",
  間: "あいだ",
  朝: "あさ",
  昼: "ひる",
  晩: "ばん",
  今: "いま",
  春: "はる",
  夏: "なつ",
  秋: "あき",
  冬: "ふゆ",
  // Directions
  東: "ひがし",
  西: "にし",
  南: "みなみ",
  北: "きた",
  // Nature/Geography
  山: "やま",
  川: "かわ",
  海: "うみ",
  島: "しま",
  木: "き",
  火: "ひ",
  水: "みず",
  土: "つち",
  // Places/Locations
  京: "きょう",
  都: "と",
  県: "けん",
  市: "し",
  町: "まち",
  村: "むら",
  駅: "えき",
  線: "せん",
  道: "みち",
  // Body Parts
  人: "ひと",
  男: "おとこ",
  女: "おんな",
  子: "こ",
  手: "て",
  足: "あし",
  目: "め",
  口: "くち",
  心: "こころ",
  頭: "あたま",
  顔: "かお",
  耳: "みみ",
  鼻: "はな",
  歯: "は",
  舌: "した",
  体: "からだ",
  腕: "うで",
  背: "せ",
  腹: "はら",
  胸: "むね",
  肉: "にく",
  血: "ち",
  骨: "ほね",
  皮: "かわ",
  髪: "かみ",
  爪: "つめ",
  喉: "のど",
  // Family Relations
  父: "ちち",
  母: "はは",
  兄: "あに",
  姉: "あね",
  弟: "おとうと",
  妹: "いもうと",
  夫: "おっと",
  妻: "つま",
  親: "おや",
  // Colors
  青: "あお",
  赤: "あか",
  白: "しろ",
  黒: "くろ",
  黄: "き",
  色: "いろ",
  // Size/Measurement
  大: "おおきい",
  小: "ちいさい",
  中: "なか",
  長: "ながい",
  短: "みじかい",
  高: "たかい",
  低: "ひくい",
  厚: "あつい",
  薄: "うすい",
  広: "ひろい",
  狭: "せまい",
  深: "ふかい",
  浅: "あさい",
  重: "おもい",
  軽: "かるい",
  // Adjectives/Quality
  新: "あたらしい",
  古: "ふるい",
  良: "よい",
  悪: "わるい",
  美: "うつくしい",
  醜: "みにくい",
  強: "つよい",
  弱: "よわい",
  速: "はやい",
  遅: "おそい",
  早: "はやい",
  多: "おおい",
  少: "すくない",
  甘: "あまい",
  辛: "からい",
  苦: "にがい",
  酸: "すっぱい",
  塩: "しお",
  清: "きよい",
  濁: "にごる",
  硬: "かたい",
  柔: "やわらかい",
  // Actions/Verbs
  読: "よむ",
  書: "かく",
  話: "はなす",
  聞: "きく",
  見: "みる",
  食: "たべる",
  飲: "のむ",
  走: "はしる",
  歩: "あるく",
  来: "くる",
  行: "いく",
  作: "つくる",
  開: "ひらく",
  閉: "とじる",
  入: "はいる",
  出: "でる",
  持: "もつ",
  置: "おく",
  取: "とる",
  送: "おくる",
  返: "かえす",
  売: "うる",
  買: "かう",
  止: "とまる",
  続: "つづく",
  始: "はじまる",
  終: "おわる",
  変: "かわる",
  増: "ふえる",
  減: "へる",
  立: "たつ",
  倒: "たおれる",
  転: "ころぶ",
  落: "おちる",
  向: "むかう",
  // Emotions/Feelings
  好: "すき",
  嫌: "きらい",
  楽: "たのしい",
  悲: "かなしい",
  怒: "おこる",
  喜: "よろこぶ",
  愛: "あい",
  恐: "こわい",
  恥: "はじらう",
  // Education/Learning
  学: "がく",
  校: "こう",
  生: "せい",
  先: "さき",
  教: "おしえ",
  室: "しつ",
  所: "ところ",
  科: "か",
  習: "なら",
  成: "なる",
  // Common Objects/Things
  家: "いえ",
  部: "ぶ",
  屋: "や",
  机: "つくえ",
  椅: "いす",
  床: "ゆか",
  壁: "かべ",
  門: "もん",
  橋: "はし",
  車: "くるま",
  電: "でん",
  病: "やまい",
  薬: "くすり",
  医: "い",
  健: "けん",
  康: "こう",
  事: "こと",
  物: "もの",
  回: "かい",
  次: "つぎ",
  番: "ばん",
  值: "あたい",
  本: "もと",
  地: "ち",
  絵: "え",
  図: "ず",
  記: "き",
  代: "かわり",
  価: "あたい",
  面: "つら",
  前: "まえ",
  後: "うしろ",
  内: "うち",
  外: "そと",
  近: "ちかい",
  遠: "とおい",
  路: "ろ",
  往: "ゆく",
  復: "もどる",
  横: "よこ",
  縦: "たて",
  // Animals
  犬: "いぬ",
  猫: "ねこ",
  馬: "うま",
  牛: "うし",
  羊: "ひつじ",
  豚: "ぶた",
  鶏: "にわとり",
  鴨: "かも",
  鶴: "つる",
  鷲: "わし",
  鷹: "たか",
  鳩: "はと",
  雀: "すずめ",
  蝶: "ちょうちょ",
  蜂: "はち",
  蟻: "あり",
  蛇: "へび",
  蛙: "かえる",
  鯨: "くじら",
  鼠: "ねずみ",
  魚: "さかな",
  虫: "むし",
  鳥: "とり",
  卵: "たまご",
  // Food/Drink
  酒: "さけ",
  油: "あぶら",
  酢: "す",
  味: "あじ",
  米: "こめ",
  麦: "むぎ",
  粉: "こな",
  糖: "さとう",
  金: "かね",
  銀: "ぎん",
  銅: "どう",
  玉: "たま",
  珠: "しゅ",
  宝: "たから",
  富: "とみ",
  貧: "ひん",
  天: "てん",
  気: "き",
  風: "かぜ",
  雨: "あめ",
  雪: "ゆき",
  雲: "くも",
  雷: "かみなり",
  雹: "ひょう",
  霧: "きり",
  露: "つゆ",
  霜: "しも",
  虹: "にじ",
  星: "ほし",
  陽: "ひ",
  光: "ひかり",
  影: "かげ",
  暗: "くらい",
  毎: "まい",
};

type FuriganaType = "text" | "kanji";

interface FuriganaPart {
  type: FuriganaType;
  value: string;
  reading?: string;
}

// Cache for API lookups to prevent rate limiting
const readingCache = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Missing text parameter" },
        { status: 400 }
      );
    }

    const result = await processTextWithFullLookup(text);
    return NextResponse.json({ furigana: result });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Main function: process every character and look up all kanji
async function processTextWithFullLookup(
  text: string
): Promise<FuriganaPart[]> {
  const parts: FuriganaPart[] = [];
  let i = 0;
  let currentText = "";

  while (i < text.length) {
    const char = text[i];
    const isKanji = /[\u4e00-\u9faf\u3400-\u4dbf]/.test(char);

    if (isKanji) {
      if (currentText) {
        parts.push({ type: "text", value: currentText });
        currentText = "";
      }

      let reading = KANJI_DICT[char];

      if (!reading) {
        reading = await getKanjiReadingFromAPI(char);
      }

      parts.push({
        type: "kanji",
        value: char,
        reading: reading || "",
      });
    } else {
      currentText += char;
    }

    i++;
  }

  if (currentText) {
    parts.push({ type: "text", value: currentText });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

// Get reading from multiple API sources with proper fallbacks
async function getKanjiReadingFromAPI(kanji: string): Promise<string> {
  if (readingCache.has(kanji)) {
    return readingCache.get(kanji) || "";
  }

  // Try Jisho API first
  try {
    const res = await fetch(
      `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(
        kanji
      )}`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (res.ok) {
      const data = await res.json();
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const entry = data.data[0];
        if (entry.japanese && Array.isArray(entry.japanese)) {
          // Look for hiragana reading
          for (const ja of entry.japanese) {
            if (ja.reading) {
              readingCache.set(kanji, ja.reading);
              return ja.reading;
            }
          }
        }
      }
    }
  } catch (e) {
    // Continue to next method
  }

  // Try JLPT API as fallback
  try {
    const res = await fetch("https://jlpt.jpjp.net/api/furigana", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: kanji }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result && Array.isArray(data.result) && data.result.length > 0) {
        const reading = data.result[0].reading || data.result[0].surface || "";
        if (reading && reading !== kanji) {
          readingCache.set(kanji, reading);
          return reading;
        }
      }
    }
  } catch (e) {
    // Continue
  }

  readingCache.set(kanji, "");
  return "";
}
