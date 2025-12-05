import { NextResponse } from "next/server";

// Simple in-memory cache to speed up repeated translations
const translationCache = new Map<string, { text: string; expiry: number }>();

function getCacheKey(text: string, source: string, target: string): string {
  return `${source}:${target}:${text}`;
}

function getFromCache(key: string): string | null {
  const cached = translationCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.text;
  }
  translationCache.delete(key);
  return null;
}

function setInCache(key: string, text: string): void {
  // Cache for 1 hour
  translationCache.set(key, { text, expiry: Date.now() + 3600000 });
}

// Split text into chunks for translation (respects sentence boundaries)
function chunkText(text: string, maxChunkSize: number = 450): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentences to maintain context
  const sentences = text.match(/[^。！？\n]+[。！？\n]?/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxChunkSize) {
      currentChunk += sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export async function POST(req: Request) {
  try {
    const { text, source, target } = await req.json();
    if (!text || !source || !target) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // No hard limit - process any length by chunking
    // Provider chain: 1) Fast MyMemory 2) Private LibreTranslate 3) Public LibreTranslate
    const envUrl = (process.env.LT_API_URL || "").trim();
    const envKey = (process.env.LT_API_KEY || "").trim();

    const tryLibre = async (
      endpoint: string,
      textToTranslate: string,
      apiKey?: string
    ) => {
      const payload: Record<string, any> = {
        q: textToTranslate,
        source,
        target,
        format: "text",
      };
      if (apiKey) payload.api_key = apiKey;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.translatedText ?? data.translated_text ?? "";
    };

    const tryMyMemory = async (textToTranslate: string) => {
      const q = encodeURIComponent(textToTranslate);
      const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${encodeURIComponent(
        source
      )}|${encodeURIComponent(target)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data?.responseData?.translatedText || "";
    };

    const tryGoogleTranslate = async (textToTranslate: string) => {
      // Use Google Translate via translate.googleapis.com endpoint
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(
        textToTranslate
      )}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // Google returns array of arrays: [[[translated, original]]]
      return data?.[0]?.map((item: any) => item[0])?.join("") || "";
    };

    const tryLingvaTranslate = async (textToTranslate: string) => {
      // Alternative: Lingva Translate (Google Translate proxy)
      const url = `https://lingva.ml/api/v1/${source}/${target}/${encodeURIComponent(
        textToTranslate
      )}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data?.translation || "";
    };

    // Check cache for full text first
    const cacheKey = getCacheKey(text, source, target);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json({ translatedText: cached });
    }

    // Split text into chunks (max 450 chars to stay under API limits)
    const chunks = chunkText(text, 450);

    // Try to translate all chunks with provider chain (with retries)
    let translatedChunks: string[] = [];
    const errors: string[] = [];

    // Provider order: Google > Lingva > MyMemory > LibreTranslate
    const providers = [
      { name: "Google Translate", fn: tryGoogleTranslate },
      { name: "Lingva Translate", fn: tryLingvaTranslate },
      { name: "MyMemory", fn: tryMyMemory },
    ];

    // Try each provider in sequence
    for (const provider of providers) {
      if (translatedChunks.length > 0) break;

      try {
        // Add delay between chunks to avoid rate limiting
        const results: string[] = [];
        for (let i = 0; i < chunks.length; i++) {
          try {
            const result = await provider.fn(chunks[i]);
            if (result && result.length > 0) {
              results.push(result);
              // Small delay between chunks
              if (i < chunks.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 200));
              }
            } else {
              throw new Error("Empty result");
            }
          } catch (chunkError) {
            // Retry once per chunk on failure
            try {
              await new Promise((resolve) => setTimeout(resolve, 500));
              const retryResult = await provider.fn(chunks[i]);
              if (retryResult && retryResult.length > 0) {
                results.push(retryResult);
              } else {
                throw new Error("Empty retry result");
              }
            } catch (retryError) {
              throw chunkError; // Use original error
            }
          }
        }

        if (results.length === chunks.length) {
          translatedChunks = results;
          console.log(`✓ Translation succeeded with ${provider.name}`);
        }
      } catch (e: any) {
        errors.push(`${provider.name}: ${e.message}`);
        console.log(`✗ ${provider.name} failed:`, e.message);
      }
    }

    // Try private LibreTranslate if configured
    if (translatedChunks.length === 0 && envUrl) {
      try {
        const results: string[] = [];
        for (const chunk of chunks) {
          const result = await tryLibre(envUrl, chunk, envKey || undefined);
          if (result && result.length > 0) {
            results.push(result);
          }
        }
        if (results.length === chunks.length) {
          translatedChunks = results;
          console.log("✓ Translation succeeded with Private LibreTranslate");
        }
      } catch (e: any) {
        errors.push(`Private LibreTranslate: ${e.message}`);
      }
    }

    // Try public LibreTranslate as last resort
    if (translatedChunks.length === 0) {
      try {
        const results: string[] = [];
        for (const chunk of chunks) {
          const result = await tryLibre(
            "https://libretranslate.com/translate",
            chunk
          );
          if (result && result.length > 0) {
            results.push(result);
          }
        }
        if (results.length === chunks.length) {
          translatedChunks = results;
          console.log("✓ Translation succeeded with Public LibreTranslate");
        }
      } catch (e: any) {
        errors.push(`Public LibreTranslate: ${e.message}`);
      }
    }

    if (translatedChunks.length === 0) {
      return NextResponse.json(
        {
          error: "All translation providers failed. Please try again later.",
          details: errors.join(" | "),
        },
        { status: 502 }
      );
    }

    // Combine translated chunks
    const translated = translatedChunks.join("");
    setInCache(cacheKey, translated);
    return NextResponse.json({ translatedText: translated });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
