import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Comprehensive kanji to reading mapping (hiragana)
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
};

interface Part {
  type: "kanji" | "text";
  value: string;
  reading?: string;
}

function parseToFurigana(text: string): Part[] {
  const result: Part[] = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    // Check if character is kanji
    if (/[\u4E00-\u9FFF]/.test(char) && kanjiMap[char]) {
      const reading = kanjiMap[char];
      result.push({
        type: "kanji",
        value: char,
        reading: reading,
      });
      i++;
    } else {
      // Collect consecutive non-kanji characters
      let textPart = "";
      while (i < text.length && !/[\u4E00-\u9FFF]/.test(text[i])) {
        textPart += text[i];
        i++;
      }
      if (textPart.trim()) {
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
  const startTime = Date.now();

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Invalid input", furigana: [] },
        { status: 400 }
      );
    }

    console.log("[Furigana] Processing:", text.substring(0, 50));

    // Convert text to furigana format
    const furigana = parseToFurigana(text);

    const elapsed = Date.now() - startTime;
    console.log(`[Furigana] Success in ${elapsed}ms, parts:`, furigana.length);

    return NextResponse.json({
      furigana: furigana,
      debug: {
        elapsed: `${elapsed}ms`,
        parts: furigana.length,
        environment: process.env.VERCEL ? "Vercel" : "Local",
      },
    });
  } catch (error: any) {
    const elapsed = Date.now() - startTime;
    console.error("[Furigana] Error:", error?.message || error);
    return NextResponse.json({
      furigana: [],
      error: "Internal server error",
      debug: { elapsed: `${elapsed}ms`, error: error?.message },
    });
  }
}
