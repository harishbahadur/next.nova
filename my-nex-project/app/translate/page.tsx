"use client";
import { useState } from "react";
import Link from "next/link";

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [pair, setPair] = useState<"ja-en" | "en-ja">("ja-en");
  const [mode, setMode] = useState<"translate" | "furigana">("translate");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [furiganaData, setFuriganaData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const textToSpeak =
      result || furiganaData.map((part) => part.value).join("");

    if (!textToSpeak) {
      return;
    }

    // Determine language based on mode
    const lang =
      mode === "furigana" ? "ja-JP" : pair === "ja-en" ? "en-US" : "ja-JP";

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleTranslate = async () => {
    setError(null);
    setResult("");
    setFuriganaData([]);
    if (!text.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    setLoading(true);

    try {
      if (mode === "furigana") {
        // Furigana mode: show Japanese with readings
        const res = await fetch("/api/furigana", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();

        // Always use the furigana data if available, even if there's a warning
        if (data.furigana) {
          setFuriganaData(data.furigana);
          if (data.warning) {
            console.warn("Furigana warning:", data.warning);
          }
        } else if (!res.ok) {
          throw new Error(data.error || "Furigana generation failed");
        }
      } else {
        // Translation mode
        const [source, target] = pair === "ja-en" ? ["ja", "en"] : ["en", "ja"];
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, source, target }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Translation failed");
        setResult(data.translatedText || "");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .translate-container {
            padding: 12px !important;
          }
          .translate-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .translate-grid {
            grid-template-columns: 1fr !important;
          }
          .translate-textarea {
            height: 180px !important;
          }
          .translate-output-box {
            height: 180px !important;
            max-height: 180px !important;
          }
          .translate-box {
            padding: 12px !important;
          }
          .translate-header-text {
            font-size: 20px !important;
          }
        }
      `}</style>
      <div
        className="translate-container"
        style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}
      >
        <div
          className="translate-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h1
            className="translate-header-text"
            style={{ fontSize: 28, fontWeight: 800, color: "#0c4a6e" }}
          >
            Text Translate Option
          </h1>
          <Link
            href="/"
            className="translate-back-link"
            style={{
              color: "#0c4a6e",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <div
          className="translate-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          <div
            className="translate-box"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #0ea5e9",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 20px rgba(6, 182, 212, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 700, color: "#0284c7" }}>
                Input Area
              </span>
              <span style={{ color: "#6b7280", fontSize: 12 }}>
                For long Japanese/English text
              </span>
            </div>
            <textarea
              className="translate-textarea"
              placeholder={
                pair === "ja-en"
                  ? "Type or paste Japanese text here..."
                  : "Type or paste English text here..."
              }
              style={{
                width: "100%",
                height: 320,
                padding: 16,
                borderRadius: 12,
                border: "1px solid #d1d5db",
                outline: "none",
                resize: "vertical",
              }}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#6b7280",
              }}
            >
              {text.length} characters
            </div>
          </div>

          <div
            className="translate-box"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "2px solid #0ea5e9",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 8px 20px rgba(6, 182, 212, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 700, color: "#0284c7" }}>
                Output Area
              </span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: "#806b72ff", fontSize: 12 }}>
                  Translation appears here
                </span>
                {(result || furiganaData.length > 0) && (
                  <button
                    onClick={isSpeaking ? handleStopSpeak : handleSpeak}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "1px solid #0284c7",
                      background: isSpeaking ? "#dc2626" : "#0ea5e9",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSpeaking) {
                        e.currentTarget.style.background = "#0284c7";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSpeaking) {
                        e.currentTarget.style.background = "#0ea5e9";
                      }
                    }}
                  >
                    {isSpeaking ? "🔊 Stop" : "🔊 Listen"}
                  </button>
                )}
              </div>
            </div>
            <div
              className="translate-output-box"
              style={{
                height: 320,
                maxHeight: 320,
                border: "1px solid #d1d5db",
                borderRadius: 12,
                padding: 16,
                background: "white",
                whiteSpace: "pre-wrap",
                color:
                  result || furiganaData.length > 0 ? "#0c4a6e" : "#64748b",
                fontSize: result || furiganaData.length > 0 ? 16 : 14,
                lineHeight: 1.8,
                fontWeight: 500,
                overflowY: "auto",
              }}
            >
              {mode === "furigana" && furiganaData.length > 0 ? (
                <div
                  style={{
                    fontSize: 18,
                    lineHeight: 2.2,
                    paddingTop: 20,
                    paddingBottom: 10,
                    letterSpacing: 0.5,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {furiganaData.map((part, i) => {
                    if (part.type === "kanji") {
                      return (
                        <ruby key={i}>
                          {part.value}
                          <rt>{part.reading || ""}</rt>
                        </ruby>
                      );
                    } else {
                      return (
                        <span key={i}>
                          {part.value}
                        </span>
                      );
                    }
                  })}
                </div>
              ) : (
                result || "Your translation will appear here."
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ color: "#b91c1c", marginTop: 12 }}>{error}</div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            style={{
              flex: "0 0 200px",
              border: "2px solid #d1d5db",
              borderRadius: 12,
              padding: 12,
              background: "white",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              color: "#1f2937",
            }}
          >
            <option value="translate">🌐 Translate</option>
            <option value="furigana">📖 Furigana (Reading)</option>
          </select>

          {mode === "translate" && (
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value as any)}
              style={{
                flex: "0 0 220px",
                border: "2px solid #d1d5db",
                borderRadius: 12,
                padding: 12,
                background: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                color: "#1f2937",
              }}
            >
              <option value="ja-en">Japanese → English</option>
              <option value="en-ja">English → Japanese</option>
            </select>
          )}

          <button
            onClick={handleTranslate}
            disabled={loading}
            style={{
              flex: "1 1 auto",
              background: mode === "furigana" ? "#22c55e" : "#3b82f6",
              color: "white",
              fontWeight: 800,
              padding: 14,
              fontSize: 15,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              minWidth: 160,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {loading
              ? mode === "furigana"
                ? "Generating..."
                : "Translating..."
              : mode === "furigana"
              ? "Add Furigana"
              : "Translate"}
          </button>
        </div>

        <div style={{ marginTop: 8, color: "#6b7280", fontSize: 12 }}>
          {mode === "furigana"
            ? "Tip: Paste Japanese text on the left, then click 'Add Furigana' to see readings above kanji."
            : "Tip: Choose language pair, paste text on the left, then Translate."}
        </div>
      </div>
    </div>
  );
}
