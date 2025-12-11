# Three Main Reasons Why Kuroshiro Cannot Generate Furigana for Every Part

Based on the current implementation in `app/api/furigana/route.ts`, here are the three fundamental limitations:

## 1. **Kuroshiro Only Marks Kanji (Not All Text)**

**Problem**: Kuroshiro's morphological analyzer only generates furigana for kanji characters that require readings. It does NOT generate furigana for:

- Hiragana characters (already phonetic)
- Katakana characters (already phonetic)
- Roman letters and numbers
- Punctuation marks

**Why**: Japanese hiragana and katakana are already phonetic alphabets, so they don't need furigana. Only kanji requires reading marks because kanji characters can be read multiple ways.

**Example**:

```
Input: "私は学校に行きました。"
         (watashi wa gakkō ni ikimashita)
         I went to school.

Kuroshiro Output:
私 (わたし) - kanji, gets furigana
は - hiragana particle, NO furigana
学 (がく) - kanji, gets furigana
校 (こう) - kanji, gets furigana
に - hiragana particle, NO furigana
行 (い) - kanji, gets furigana
き - hiragana suffix, NO furigana
ました - hiragana ending, NO furigana
。 - punctuation, NO furigana
```

**Why This Happens**:

- Hiragana is phonetic by nature (it represents syllables)
- No conversion needed - the character itself is the reading
- Adding furigana to hiragana would be redundant

---

## 2. **Kuroshiro's Morphological Analysis Isn't 100% Accurate**

**Problem**: The kuromoji analyzer (Japanese morphological analyzer) sometimes:

- Fails to identify certain words correctly
- Misclassifies word boundaries
- Doesn't recognize all compound words
- May have gaps in its dictionary for newer words or slang

**Why**: Kuroshiro relies on a finite dictionary. Words not in the dictionary are handled by fallback rules that may not be perfect.

**Examples of Potential Issues**:

```
新しい (atarashii) - might be split as:
  新 (atara) + しい (shii) - INCORRECT

Some compound words might be missed:
  お客さん (okyakusan) - "customer"
  Could be read as お + 客 + さん instead of treating it as a single unit
```

**Solution in Current Code**:
The `readingOverrides` object in `route.ts` has 100+ common words to fix this:

```typescript
const readingOverrides: Record<string, string> = {
  日本: "にほん", // Japan (not にっぽん)
  学校: "がっこう", // School
  明日: "あした", // Tomorrow
  // ... and 100+ more
};
```

However, this is a **manual workaround** - it doesn't scale to all possible words or new words.

---

## 3. **Single Kanji Characters Without Context Have Multiple Readings**

**Problem**: In Japanese, many single kanji can be read in multiple ways (called "on'yomi" and "kun'yomi" readings). Kuroshiro must guess the correct reading based on context, but sometimes gets it wrong.

**Why**: This is a fundamental feature of the Japanese writing system. A single kanji can have:

- **On'yomi** (音読み) - Sino-Japanese reading (often used in compounds)
- **Kun'yomi** (訓読み) - Native Japanese reading (often used standalone)

**Examples**:

```
生 (kanji):
  - In 学生 (gakusei) = student: read as "sei"
  - In 生活 (seikatsu) = life: read as "sei"
  - Standalone 生 (nama) = raw/fresh
  - In 生まれる (umareru) = to be born: read as "u"

読 (kanji):
  - In 読書 (dokusho) = reading: read as "doku"
  - Standalone 読む (yomu) = to read
  - Different context = different reading

天気 (weather):
  - 天 = "てん" (on'yomi)
  - 気 = "き" (on'yomi)
  - Result: "てんき" (tenki)

But if 気 appears elsewhere:
  - 元気 (genki) = "げん" + "き" = energy/vitality
  - 気持ち (kimochi) = "き" + "も" + "ち" = feeling
```

**Current Limitation**:
Even with `readingOverrides`, this doesn't solve single kanji in new contexts.

---

## Summary Table

| Reason                   | Affects                            | Solution                                | Scalability                            |
| ------------------------ | ---------------------------------- | --------------------------------------- | -------------------------------------- |
| **1. Hiragana/Katakana** | Phonetic characters (~40% of text) | Skip them - they're already readable    | Perfect - no solution needed           |
| **2. Dictionary Gaps**   | Uncommon/new words (~5-10%)        | Manual overrides (100+ words hardcoded) | Poor - doesn't scale to all words      |
| **3. Context-Dependent** | Single kanji readings (~10-15%)    | Use morphological context analysis      | Better with Kuroshiro, but not perfect |

---

## Improvement Opportunities

### Current Implementation (route.ts)

✅ Uses 100+ reading overrides for common compounds
✅ Applies Kuroshiro's morphological analysis for context
✅ Parses HTML ruby tags correctly
⚠️ Still cannot handle all edge cases

### Potential Improvements

1. **Expand reading overrides** - Add more common words to the dictionary
2. **User-submitted corrections** - Allow users to report wrong readings
3. **Contextual analysis** - Use surrounding words to improve accuracy
4. **Machine learning** - Train a model on native speakers' furigana choices
5. **Hybrid approach** - Fall back to multiple possible readings when uncertain

---

## Technical Implementation Details

The three limitations manifest in this code flow:

```
Input Text
    ↓
[Kuroshiro Morphological Analysis]
    ├─ Identifies word boundaries
    ├─ Classifies parts of speech
    └─ Assigns readings based on dictionary (NOT 100% accurate)
    ↓
[Limitation #1] Hiragana/Katakana skipped automatically
[Limitation #2] Unknown words might get wrong readings
[Limitation #3] Context-dependent kanji might be misread
    ↓
[Override Application] readingOverrides applied to fix known issues
    ↓
Output with Furigana (NOT perfect, but good)
```

The `parseRubyHTML()` function successfully extracts furigana that Kuroshiro produces, but what Kuroshiro produces is limited by these three factors.
