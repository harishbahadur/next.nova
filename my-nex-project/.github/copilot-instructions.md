# Next Nova - AI Coding Agent Instructions

## Project Overview

Next Nova is a **Japanese student support platform** built with Next.js 14 (App Router), TypeScript, and React 18. The app helps international students (primarily Nepali) navigate studying in Japan with multilingual support (EN/NP/JP), translation tools, school directories, and student life guidance.

**Target Deployment**: Vercel (see `VERCEL_DEPLOYMENT.md` for setup)

## Architecture & Key Components

### App Router Structure (`app/`)

- **`page.tsx`** (root): Homepage with search, multilingual navigation, and help form
- **`layout.tsx`**: Root layout with metadata and viewport config
- **`api/` routes**: RESTful API endpoints for translation, furigana, and support forms
- **Page routes**: `about-japan/`, `school/`, `student-life/`, `translate/`, etc.

### API Endpoints (`app/api/`)

All APIs use Next.js Route Handlers (`route.ts`):

1. **`/api/translate`**: Multi-provider translation chain

   - Provider fallback: MyMemory → Private LibreTranslate → Public LibreTranslate
   - Supports text chunking for long inputs (450 char chunks respecting sentence boundaries)
   - In-memory cache with 1-hour expiry
   - Language pairs: `ja-en`, `en-ja`
   - Environment vars: `LT_API_URL`, `LT_API_KEY` (optional for private LibreTranslate)

2. **`/api/furigana`**: Japanese kanji reading annotations using **Kuroshiro**

   **Uses professional-grade Japanese NLP library for accurate furigana:**

   - **Library**: `kuroshiro` with `kuroshiro-analyzer-kuromoji`
   - **Morphological Analysis**: Automatically segments text and identifies correct readings
   - **Zero Configuration**: Works perfectly out-of-the-box for any Japanese text

   **Automatic Handling:**

   - ✅ Correct kun'yomi vs on'yomi selection based on grammatical context
   - ✅ Compound words recognized automatically: `勉強（べんきょう）`, `気持ち（きもち）`, `時間（じかん）`
   - ✅ Verb conjugations: `行（い）きたくない`, `食（た）べている`, `寝（ね）ている`
   - ✅ Particles (を、が、に、は) automatically skipped (no furigana)
   - ✅ Context-aware: `生（い）きる` vs `学生（がくせい）`, `強（つよ）い` vs `勉強（べんきょう）`

   **How It Works:**

   1. API receives Japanese text
   2. Kuroshiro analyzes with Kuromoji morphological analyzer
   3. Returns structured JSON: `[{type: "kanji"|"text", value: "本", reading: "ほん"}]`
   4. Frontend displays furigana centered above kanji groups

   **Advantages over dictionary-based systems:**

   - ✅ No manual dictionary maintenance
   - ✅ Handles unknown/new words automatically
   - ✅ Never splits compound words incorrectly
   - ✅ Professional Japanese language processing
   - ✅ No kun'yomi/on'yomi confusion

3. **`/api/support`**: Student help form submission
   - Logs to console (no database/email integration yet)
   - Validates required fields: `fullName`, `email`, `helpTypes[]`, `message`

## Development Conventions

### Client Components

- All pages use `"use client"` directive (heavy interactivity, state management)
- Translation state managed via `useMemo` for i18n dictionaries (see `app/page.tsx:27-200`)
- Language switcher pattern: `setLanguage("en"|"np"|"jp")` with dropdown in top-right

### Styling Approach

- **CSS Modules** for all pages (e.g., `page.module.css`)
- Mobile-first responsive design with `@media (max-width: 767px)` breakpoints
- Inline gradient backgrounds: `linear-gradient(135deg, #87CEEB 0%, #E0F6FF 100%)`
- No Tailwind or CSS-in-JS—use vanilla CSS with scoped modules

### TypeScript Patterns

- Strict mode enabled (`tsconfig.json`)
- Path alias: `@/*` maps to root (though not heavily used)
- Type safety for i18n: `Record<string, Record<string, string>>` for translations
- Union types for language/mode toggles: `"ja-en" | "en-ja"`, `"translate" | "furigana"`

### Data Management

- **No database**: All school data in `SCHOOLS` object in `app/school/page.tsx`
- Prefecture lists: `ALL_PREFECTURES` (47 prefectures), `DISPLAYED_PREFECTURES` (9 main ones)
- URL state: Uses `useSearchParams()` for deep-linkable prefecture selection (`?prefecture=Tokyo`)

## Key Workflows

### Development Server

```powershell
npm run dev  # Starts on localhost:3000
```

### Building for Production

```powershell
npm run build  # Creates .next/ optimized bundle
npm start      # Runs production server
```

### Adding New Pages

1. Create `app/new-page/page.tsx` with `"use client"` directive
2. Add corresponding `page.module.css` in same directory
3. Link from navigation: `<Link href="/new-page">New Page</Link>`
4. Add to search results in `app/page.tsx` if relevant

### Extending Translation API

- Add provider to `app/api/translate/route.ts` fallback chain
- Maintain chunk size at ~450 chars to avoid API limits
- Cache keys: `${source}:${target}:${text}`

### Furigana System - NO MAINTENANCE NEEDED ✅

**The furigana system now uses Kuroshiro** - a professional Japanese NLP library that automatically handles:

- ✅ All compound words: `勉強（べんきょう）`, `気持ち（きもち）`, `時間（じかん）`
- ✅ Correct kun'yomi vs on'yomi: `強（つよ）い` vs `勉強（べんきょう）`, `生（い）きる` vs `学生（がくせい）`
- ✅ Verb conjugations: `行（い）きたくない`, `食（た）べている`, `勉強（べんきょう）したい`
- ✅ Particles automatically skipped: を、が、に、は get no furigana
- ✅ Unknown words handled automatically

**NO DICTIONARY MAINTENANCE NEEDED!** Kuroshiro handles everything through morphological analysis.

**Example:**

```
Input:  毎日朝ごはん食べて寝ていくと勉強したくない気持ちになるから今も寝る時間だ
Output: Perfect furigana for every word automatically!
```

## Important Files

- **`app/page.tsx`** (762 lines): Homepage with all core UI logic and i18n
- **`app/api/furigana/route.ts`** (806 lines): Extensive kanji dictionary
- **`app/school/page.tsx`** (392 lines): Prefecture/school data structure
- **`VERCEL_DEPLOYMENT.md`**: Deployment checklist and environment variable setup

## Critical Details

- **No server actions**: All API calls use `fetch()` from client components
- **Speech synthesis**: Uses Web Speech API for text-to-speech in `app/translate/page.tsx`
- **Search UX**: Keyboard nav with arrow keys and Enter on homepage search (see `activeResult` state)
- **Mobile optimization**: All button/input elements have mobile-specific styles in CSS modules
- **Vercel root**: Set root directory to `./my-nex-project` (not repo root)

## Common Patterns

- **API error handling**: Always return `NextResponse.json({error: "msg"}, {status: 400})`
- **Loading states**: Use `loading` boolean + disable buttons during async operations
- **Translation dictionary access**: `t[language].keyName` with fallback to English
- **Link styling**: `className={styles.backLink}` for back navigation, `className={styles.navLink}` for nav items

## When Adding Features

1. Check if client-side or API endpoint needed (prefer client for simple UI)
2. Use CSS Modules—no global styles outside `globals.css`
3. Add translations for EN/NP/JP if user-facing text
4. Test mobile responsiveness (most users are mobile)
5. Update `metadata` in `layout.tsx` if adding major sections

---

## Quick Reference: Furigana System

**When you see wrong furigana readings, follow this checklist:**

1. **Is it a compound word (2+ kanji)?** → Add to `WORD_DICT` first (lines 5-300)
2. **Is it a verb/adjective phrase?** → Add complete form to `WORD_DICT` (e.g., `行きたくない`)
3. **Is it a single kanji with wrong reading?** → Check if in `contextReadings` (lines 1010-1150)
4. **Is the kanji completely missing?** → Add to `KANJI_DICT` (lines 320-650)

**File Location:** `app/api/furigana/route.ts`

**Execution Order:**

```
1. WORD_DICT check (5→4→3→2 char words)
2. Context-aware reading (single kanji only)
3. KANJI_DICT fallback
```

**Most Common Fixes:**

- Compound splitting → Add to WORD_DICT: `勉強: "べんきょう"`
- Wrong verb reading → Add stem to KANJI_DICT: `起: "お"` + Add to contextReadings
- Conjugation issues → Add full form to WORD_DICT: `勉強したくない: "べんきょうしたくない"`
