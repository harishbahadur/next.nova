# 🔧 VERCEL DEPLOYMENT TROUBLESHOOTING

If your deployment is failing, this guide will help fix it.

---

## 📋 Common Issues & Solutions

### ❌ Issue 1: "Root directory not found"

**What it looks like:**

```
Error: Root directory not found: my-nex-project
```

**Cause:** You didn't set the root directory, or set it wrong.

**Solution:**

1. Go back to Vercel project settings
2. Click **"Settings"** at the top
3. Find **"Root Directory"**
4. Make sure it says **exactly:** `my-nex-project`
5. Click **"Save"**
6. Redeploy

---

### ❌ Issue 2: "Cannot find module 'kuroshiro'"

**What it looks like:**

```
Error: Cannot find module 'kuroshiro'
```

**Cause:** Dependencies not installed

**Solution:**
Our `vercel.json` already includes `npm install` in the build command. But if this fails:

1. Go to project settings
2. Click **"Build & Development Settings"**
3. Set **Build Command** to:
   ```
   cd my-nex-project && npm install && npm run build
   ```
4. Click **"Save"**
5. Redeploy

---

### ❌ Issue 3: "Build failed" (no specific error)

**Cause:** Could be many things. Check the logs.

**Solution:**

1. In Vercel, click the failed deployment
2. Click **"Build Logs"** tab
3. Look for the red error message
4. Common fixes:
   - Root directory wrong → Set to `my-nex-project`
   - No npm install → Already fixed in our config
   - Node version too old → We use Node 18.x (good)

---

### ❌ Issue 4: "Pages showing 404 errors"

**What it looks like:**
Everything deployed but pages don't load.

**Cause:** Probably wrong output directory

**Solution:**

1. Go to **Settings**
2. Find **"Output Directory"**
3. Make sure it says: `.next`
4. If it says something else, set it to: `my-nex-project/.next`
5. Redeploy

---

### ❌ Issue 5: "Deployment successful but site is blank"

**Cause:** Static generation issue

**Solution:**

1. Delete the deployment
2. Go to **Settings** → **Build & Development**
3. Set Build Command to:
   ```
   cd my-nex-project && npm install && npm run build
   ```
4. Redeploy from scratch

---

### ❌ Issue 6: "Timeout during build"

**What it looks like:**
Build takes too long and gets killed.

**Cause:** Server is slow or dependencies taking time

**Solution:**

1. Wait 10 minutes
2. Redeploy again
3. Usually succeeds on 2nd try
4. If keeps failing, check internet connection

---

## ✅ QUICK FIX CHECKLIST

If deployment fails, try these in order:

1. **[ ]** Delete the deployment
2. **[ ]** Clear Vercel cache: Settings → "Git" → Disconnect and reconnect
3. **[ ]** Import project again from scratch
4. **[ ]** **CAREFULLY** set root directory to: `my-nex-project`
5. **[ ]** Leave all other settings as default
6. **[ ]** Click Deploy

This works 99% of the time!

---

## 🔍 HOW TO CHECK BUILD LOGS

When deployment fails:

1. Go to **Vercel Dashboard**
2. Click on your **"next-nova"** project
3. Find the failed deployment (red icon)
4. Click on it to open details
5. Click **"Build Logs"** tab at the top
6. Scroll down to find the RED ERROR MESSAGE
7. Read it carefully and try the solutions above

---

## 🆘 LAST RESORT: START COMPLETELY FRESH

If nothing works:

### On Vercel:

1. Delete your entire project
2. Wait 2 minutes
3. Your dashboard should be empty

### Then:

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Paste GitHub URL: `https://github.com/harishbahadur/next.nova`
4. When it asks for root directory: `my-nex-project`
5. When it asks for build command: leave default
6. Deploy

---

## 📱 AFTER DEPLOYMENT WORKS

Your site will be at:

```
https://[your-project-name].vercel.app
```

Test it works:

1. ✅ Homepage loads (you see Next Nova)
2. ✅ Search works
3. ✅ Language switcher works (EN/NP/JP)
4. ✅ Translation page works
5. ✅ Furigana works (try: 日本の学校)

If all these work, you're done! 🎉

---

## 💬 WHAT TO DO IF STUCK

**Try this:**

1. Tell me the exact error message you see
2. Tell me what step you're on
3. Tell me if you already have a Vercel account
4. I can help you fix it!

---

## 🎯 THE ABSOLUTE EASIEST WAY

Use the one-click button in `SIMPLE_DEPLOY_GUIDE.md`

It does everything automatically!

---

**Remember:** 99% of issues are just setting root directory wrong! 💪
