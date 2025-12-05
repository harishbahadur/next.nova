# Vercel Deployment Guide

## ✅ Git Setup Complete!

Your project is now committed to Git with all changes.

## 🚀 Deploy to Vercel (3 Easy Steps)

### Step 1: Push to GitHub

```powershell
# If you haven't added remote yet, add it:
# git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### Step 2: Go to Vercel

1. Visit: **https://vercel.com**
2. Sign up/Login with GitHub
3. Click "Add New..." → "Project"
4. Select your GitHub repository
5. Click "Import"

### Step 3: Configure & Deploy

1. **Framework**: Next.js (auto-detected)
2. **Root Directory**: `./my-nex-project`
3. **Environment Variables** (optional):
   - `LT_API_URL`: Your LibreTranslate API endpoint (if using private instance)
   - `LT_API_KEY`: Your LibreTranslate API key (if using private instance)
4. Click **"Deploy"** button

---

## 📝 What's Deployed

✅ Translation API (ja-en, en-ja)
✅ Furigana API (kanji readings)  
✅ Mobile-responsive UI
✅ Text-to-speech feature
✅ i18n support (EN, NP, JP)
✅ Full homepage with search

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
