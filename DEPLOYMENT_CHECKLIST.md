# ✅ VERCEL DEPLOYMENT CHECKLIST

Run through this checklist before deploying to ensure zero issues.

## 📋 Pre-Deployment Verification

### ✅ 1. Build Test

```bash
cd my-nex-project
npm run build
```

**Expected:** ✓ Compiled successfully (0 errors)

### ✅ 2. File Structure Check

```
next.nova/
├── vercel.json                    ✓ Present
├── .vercelignore                  ✓ Present
├── README.md                      ✓ Present
└── my-nex-project/                ✓ Main app folder
    ├── app/
    ├── public/
    ├── package.json               ✓ Present
    ├── next.config.mjs            ✓ Configured
    └── .next/                     ✓ Built successfully
```

### ✅ 3. Dependencies Check

- [x] kuroshiro: ^1.2.0
- [x] kuroshiro-analyzer-kuromoji: ^1.1.0
- [x] next: 14.1.4
- [x] react: ^18
- [x] react-dom: ^18

### ✅ 4. Configuration Files

**vercel.json:**

- [x] buildCommand points to my-nex-project
- [x] installCommand points to my-nex-project
- [x] framework: "nextjs"
- [x] outputDirectory: my-nex-project/.next

**next.config.mjs:**

- [x] webpack fallback for fs: false
- [x] asyncWebAssembly: true
- [x] serverComponentsExternalPackages includes kuroshiro

### ✅ 5. API Routes Check

- [x] /api/furigana - Kuroshiro implementation (101 lines)
- [x] /api/translate - Multi-provider fallback
- [x] /api/support - Form handler

### ✅ 6. Git Status

```bash
git status
```

**Expected:** "nothing to commit, working tree clean"

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Go to Vercel Dashboard

🔗 https://vercel.com/dashboard

### Step 2: Import Repository

1. Click **"Add New..."** → **"Project"**
2. Search for: **`harishbahadur/next.nova`**
3. Click **"Import"**

### Step 3: Configure Project

**⚠️ CRITICAL SETTINGS:**

| Setting          | Value            | Status            |
| ---------------- | ---------------- | ----------------- |
| Framework Preset | Next.js          | Auto-detected ✓   |
| Root Directory   | `my-nex-project` | ⚠️ MUST SET THIS! |
| Build Command    | `npm run build`  | Auto ✓            |
| Output Directory | `.next`          | Auto ✓            |
| Install Command  | `npm install`    | Auto ✓            |
| Node.js Version  | 18.x             | Auto ✓            |

**Environment Variables:** (Optional - only if using private LibreTranslate)

- `LT_API_URL` - Your server URL
- `LT_API_KEY` - Your API key

### Step 4: Deploy

Click **"Deploy"** button

**Expected Build Output:**

```
✓ Installing dependencies
✓ Building application
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (17/17)
✓ Finalizing page optimization
```

**Build Time:** ~2-3 minutes

---

## 🧪 POST-DEPLOYMENT TESTING

After deployment succeeds, verify these URLs work:

### 1. Homepage

```
https://your-app.vercel.app/
```

**Expected:** See Next Nova homepage with search

### 2. Translation Page

```
https://your-app.vercel.app/translate
```

**Expected:** See translation interface

### 3. Furigana API Test

```bash
curl -X POST https://your-app.vercel.app/api/furigana \
  -H "Content-Type: application/json" \
  -d '{"text":"日本の学校で勉強する"}'
```

**Expected Response:**

```json
{
  "furigana": [
    { "type": "kanji", "value": "日本", "reading": "にほん" },
    { "type": "text", "value": "の" },
    { "type": "kanji", "value": "学校", "reading": "がっこう" },
    { "type": "text", "value": "で" },
    { "type": "kanji", "value": "勉強", "reading": "べんきょう" },
    { "type": "text", "value": "する" }
  ]
}
```

### 4. Translation API Test

```bash
curl -X POST https://your-app.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","source":"en","target":"ja"}'
```

**Expected:** `{"translatedText":"こんにちは"}`

---

## 🔧 TROUBLESHOOTING

### Build Fails: "Cannot find module 'kuroshiro'"

**Cause:** Dependencies not installed
**Fix:** Already configured - Vercel auto-installs from package.json

### Build Fails: "Root directory not found"

**Cause:** Wrong root directory
**Fix:** Set Root Directory to `my-nex-project` (NOT root!)

### API Returns 500 Error

**Cause:** Kuroshiro initialization issue
**Fix:** Already configured in next.config.mjs with webpack settings

### Pages Show 404

**Cause:** Incorrect output directory
**Fix:** Verify root directory is `my-nex-project`

### Build Succeeds but Site is Blank

**Cause:** Static generation issue
**Fix:** Check Vercel logs → Functions tab for errors

---

## 📊 EXPECTED RESULTS

✅ **Build Status:** Success  
✅ **Build Time:** 2-3 minutes  
✅ **Total Size:** ~98 KB  
✅ **API Routes:** 3 serverless functions  
✅ **Static Pages:** 14 pages  
✅ **Dynamic Routes:** 3 API routes

---

## 🎯 FINAL VERIFICATION

After deployment, visit your live URL and test:

1. ✅ Homepage loads with search
2. ✅ Language switcher works (EN/NP/JP)
3. ✅ Translation page works
4. ✅ Furigana generation works
5. ✅ School directory loads
6. ✅ Mobile responsive (test on phone)
7. ✅ Text-to-speech works

---

## 🔄 AUTO-DEPLOYMENT

After initial deployment:

- Every push to `main` triggers auto-deploy
- No need to manually redeploy
- Changes go live in ~2 minutes

---

**Ready to deploy?** Follow the steps above carefully! ✨
