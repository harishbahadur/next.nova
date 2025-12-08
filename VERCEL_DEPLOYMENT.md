# Vercel Deployment Guide

## ✅ Ready to Deploy!

Your project is fully configured for Vercel deployment with:

- ✅ Clean Kuroshiro implementation (101 lines, 0 errors)
- ✅ Production build tested successfully
- ✅ Vercel configuration files added
- ✅ All changes pushed to GitHub

## 🚀 Deploy to Vercel (Simple Steps)

### **IMPORTANT: Your GitHub repo is already set up!**

Repository: `https://github.com/harishbahadur/next.nova.git`

### Step 1: Go to Vercel

1. Visit: **https://vercel.com**
2. Click **"Continue with GitHub"** (sign up/login)
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find repository: **`harishbahadur/next.nova`**
3. Click **"Import"**

### Step 3: Configure Build Settings

**CRITICAL:** On the configuration page, set these exactly:

**Framework Preset:** `Next.js` (auto-detected ✓)

**Root Directory:** Click **"Edit"** → Enter:

```
my-nex-project
```

**Build Command:** (auto-detected, no change needed)

```
npm run build
```

**Install Command:** (auto-detected, no change needed)

```
npm install
```

**Output Directory:** (auto-detected, no change needed)

```
.next
```

### Step 4: Environment Variables (Optional)

Only add these if you have a **private LibreTranslate instance**:

| Key          | Value                     | Description                |
| ------------ | ------------------------- | -------------------------- |
| `LT_API_URL` | `https://your-server.com` | Your LibreTranslate server |
| `LT_API_KEY` | `your-api-key`            | Your API key               |

**Skip this step if using public APIs** (the app works perfectly without these!)

### Step 5: Deploy!

1. Click the big blue **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see: ✓ Build successful
4. You'll get a live URL like: `https://next-nova-xyz.vercel.app`

---

## 🎯 What Gets Deployed

✅ **Translation API** (ja-en, en-ja) with 3-provider fallback  
✅ **Furigana API** - Professional Kuroshiro NLP (101 lines, 0 errors!)  
✅ **Mobile-responsive UI** with CSS modules  
✅ **Text-to-speech** feature (Web Speech API)  
✅ **i18n support** (EN, NP, JP)  
✅ **Full homepage** with search functionality  
✅ **School directory** with 47 prefectures  
✅ **Student life guides** for housing, work, culture

**Total Build Size:** ~98 KB (highly optimized!)  
**API Routes:** 3 serverless functions (translate, furigana, support)

---

## ✅ Deployment Verification

After deployment completes, test these URLs:

**Homepage:**

```
https://your-app.vercel.app/
```

**Translation Page:**

```
https://your-app.vercel.app/translate
```

**Furigana API Test:**

```
curl -X POST https://your-app.vercel.app/api/furigana \
  -H "Content-Type: application/json" \
  -d '{"text":"日本の学校で勉強する"}'
```

**Expected Response:**

```json
{
  "furigana": [
    {"type":"kanji","value":"日本","reading":"にほん"},
    {"type":"text","value":"の"},
    {"type":"kanji","value":"学校","reading":"がっこう"},
    ...
  ]
}
```

---

## 🔧 Troubleshooting

### If build fails with "Module not found: kuroshiro"

- **Cause:** Dependencies not installed
- **Fix:** Already configured in `vercel.json` - Vercel will auto-install

### If furigana API returns errors

- **Cause:** Kuroshiro analyzer not loading
- **Fix:** Already configured in `next.config.mjs` with webpack fallbacks

### If "Root directory not found"

- **Cause:** Wrong root directory setting
- **Fix:** Make sure you set root to `my-nex-project` (not root folder!)

### If build succeeds but pages show 404

- **Cause:** Incorrect root directory
- **Fix:** Delete deployment, re-import with correct root: `my-nex-project`

---

## 🔄 Auto-Deployments

After initial deployment, **every push to `main` branch triggers auto-deploy:**

1. Make code changes locally
2. Commit: `git commit -am "your message"`
3. Push: `git push origin main`
4. Vercel automatically rebuilds and deploys (2-3 minutes)
5. Live at your production URL instantly!

---

## 🔗 API Endpoints (Once Live)

- `POST https://your-domain.vercel.app/api/translate`
- `POST https://your-domain.vercel.app/api/furigana`

---

## 💡 Alternative: Deploy from CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
cd my-nex-project
vercel

# Follow the prompts to link your GitHub account and deploy
```

---

## ✨ That's it!

Your Next.js app will be live in seconds with automatic deployments on every GitHub push.
