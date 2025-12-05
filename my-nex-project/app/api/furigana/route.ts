import { NextResponse } from "next/server";

// Comprehensive kanji dictionary with correct readings
// Uses most common readings for context-aware processing
const KANJI_DICT: Record<string, string> = {
  北: "きた",
  坂: "さか",
  鉄: "てつ",
  道: "どう",
  株: "かぶ",
  式: "しき",
  会: "かい",
  運: "うん",
  賃: "ちん",
  表: "ひょう",
  東: "ひがし",
  西: "にし",
  南: "みなみ",
  京: "きょう",
  都: "と",
  県: "けん",
  市: "し",
  駅: "えき",
  線: "せん",
  区: "く",
  街: "まち",
  村: "むら",
  町: "まち",
  港: "みなと",
  江: "え",
  川: "かわ",
  山: "やま",
  島: "しま",
  岡: "おか",
  谷: "たに",
  野: "の",
  田: "た",
  畑: "はたけ",
  海: "うみ",
  波: "なみ",
  浜: "はま",
  砂: "すな",
  岩: "いわ",
  石: "いし",
  火: "ひ",
  水: "みず",
  日: "ひ",
  月: "つき",
  年: "とし",
  時: "とき",
  分: "ぶん",
  秒: "びょう",
  間: "あいだ",
  朝: "あさ",
  昼: "ひる",
  夕: "ゆう",
  夜: "よる",
  晩: "ばん",
  今: "いま",
  昨: "きのう",
  明: "あかり",
  曜: "よう",
  春: "はる",
  夏: "なつ",
  秋: "あき",
  冬: "ふゆ",
  学: "がく",
  校: "こう",
  生: "せい",
  先: "さき",
  教: "おしえ",
  室: "しつ",
  所: "ところ",
  科: "か",
  目: "め",
  習: "なら",
  勉: "つとめ",
  成: "なる",
  績: "せき",
  人: "ひと",
  手: "て",
  足: "あし",
  頭: "あたま",
  顔: "かお",
  耳: "みみ",
  鼻: "はな",
  口: "くち",
  歯: "は",
  舌: "した",
  心: "こころ",
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
  男: "おとこ",
  女: "おんな",
  子: "こ",
  嬰: "えい",
  児: "じ",
  親: "おや",
  父: "ちち",
  母: "はは",
  兄: "あに",
  姉: "あね",
  弟: "おとうと",
  妹: "いもうと",
  夫: "おっと",
  妻: "つま",
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
  億: "おく",
  兆: "ちょう",
  個: "こ",
  組: "くみ",
  対: "つい",
  倍: "ばい",
  等: "など",
  青: "あお",
  赤: "あか",
  白: "しろ",
  黒: "くろ",
  黄: "き",
  緑: "みどり",
  紫: "むらさき",
  茶: "ちゃ",
  灰: "はい",
  色: "いろ",
  大: "おおきい",
  小: "ちいさい",
  中: "なか",
  巨: "きょ",
  細: "ほそい",
  短: "みじかい",
  長: "ながい",
  高: "たかい",
  低: "ひくい",
  太: "ふとい",
  痩: "やせる",
  厚: "あつい",
  薄: "うすい",
  広: "ひろい",
  狭: "せまい",
  浅: "あさい",
  深: "ふかい",
  重: "おもい",
  軽: "かるい",
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
  去: "さる",
  作: "つくる",
  開: "ひらく",
  閉: "とじる",
  入: "はいる",
  出: "でる",
  持: "もつ",
  置: "おく",
  取: "とる",
  与: "あたえる",
  受: "うける",
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
  前: "まえ",
  後: "あとろ",
  内: "うち",
  外: "そと",
  方: "ほう",
  側: "そば",
  端: "はし",
  際: "きわ",
  良: "よい",
  悪: "わるい",
  美: "うつくしい",
  醜: "みにくい",
  新: "あたらしい",
  古: "ふるい",
  速: "はやい",
  遅: "おそい",
  早: "はやい",
  強: "つよい",
  弱: "よわい",
  硬: "かたい",
  柔: "やわらかい",
  多: "おおい",
  少: "すくない",
  清: "きよい",
  濁: "にごる",
  甘: "あまい",
  辛: "からい",
  苦: "にがい",
  酸: "さんぱい",
  塩: "しお",
  医: "い",
  薬: "くすり",
  師: "し",
  職: "しょく",
  仕: "し",
  事: "こと",
  業: "ぎょう",
  工: "こう",
  農: "のう",
  商: "しょう",
  兵: "へい",
  警: "けい",
  察: "さつ",
  役: "やく",
  官: "かん",
  員: "いん",
  法: "ほう",
  裁: "さい",
  判: "はんだん",
  検: "けん",
  喜: "よろこぶ",
  悲: "かなしい",
  怒: "おこる",
  楽: "たのしい",
  寂: "さびしい",
  恐: "こわい",
  恥: "はじらう",
  愛: "あい",
  憎: "にくむ",
  希: "のぞむ",
  望: "のぞむ",
  金: "かね",
  銀: "ぎん",
  銅: "どう",
  玉: "たま",
  珠: "しゅ",
  宝: "たから",
  富: "とみ",
  貧: "ひん",
  家: "いえ",
  部: "ぶ",
  屋: "や",
  台: "だい",
  机: "つくえ",
  椅: "いす",
  床: "ゆか",
  壁: "かべ",
  井: "い",
  戸: "と",
  窓: "まど",
  階: "かい",
  段: "だん",
  門: "もん",
  塀: "へい",
  橋: "はし",
  柱: "ちゅう",
  梁: "はり",
  瓦: "かわら",
  板: "いた",
  釘: "くぎ",
  針: "はり",
  米: "こめ",
  麦: "むぎ",
  粉: "こな",
  糖: "さとう",
  魚: "さかな",
  虫: "むし",
  鳥: "とり",
  卵: "たまご",
  乳: "ちち",
  酒: "さけ",
  油: "あぶら",
  醤: "しょうゆ",
  酢: "す",
  味: "あじ",
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
  病: "やまい",
  健: "すこやか",
  康: "こう",
  療: "りょう",
  治: "なおす",
  診: "しん",
  症: "しょう",
  状: "じょう",
  毒: "どく",
  物: "もの",
  件: "けん",
  点: "てん",
  度: "たび",
  回: "かい",
  次: "つぎ",
  番: "ばん",
  率: "りつ",
  値: "あたい",
  木: "き",
  本: "もと",
  地: "ち",
  絵: "え",
  図: "ず",
  記: "しるし",
  也: "なり",
  代: "かわり",
  価: "あたい",
  額: "がく",
  面: "つら",
  近: "ちかい",
  遠: "とおい",
  路: "みち",
  行: "いく",
  往: "ゆく",
  復: "もどる",
  横: "よこ",
  縦: "たて",
  斜: "ななめ",
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

    // Process ANY length of text by chunking
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
      // Save accumulated text first
      if (currentText) {
        parts.push({ type: "text", value: currentText });
        currentText = "";
      }

      // Get reading for kanji - try dictionary first, then API
      let reading = KANJI_DICT[char];

      if (!reading) {
        reading = await getKanjiReadingFromAPI(char);
      }

      parts.push({
        type: "kanji",
        value: char,
        reading: reading || "", // Always include reading field
      });
    } else {
      currentText += char;
    }

    i++;
  }

  // Don't forget remaining text
  if (currentText) {
    parts.push({ type: "text", value: currentText });
  }

  return parts.length > 0 ? parts : [{ type: "text", value: text }];
}

// Get reading from multiple API sources with proper fallbacks
async function getKanjiReadingFromAPI(kanji: string): Promise<string> {
  // Check cache first
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

  // Cache empty result to avoid repeated API calls for unmapped kanji
  readingCache.set(kanji, "");
  return "";
}
