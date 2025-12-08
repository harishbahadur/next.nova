# Next Nova - Japanese Student Support Platform

A Next.js 14 application helping international students navigate studying in Japan with multilingual support (EN/NP/JP), translation tools, and student life guidance.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harishbahadur/next.nova)

**IMPORTANT:** Set root directory to `my-nex-project` during import!

### Manual Deployment Steps:

1. Go to https://vercel.com
2. Import repository: `harishbahadur/next.nova`
3. **Set Root Directory:** `my-nex-project`
4. Click Deploy

See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## ✨ Features

- 🌐 **Translation API** - Japanese ↔ English with multi-provider fallback
- 📖 **Furigana Generator** - Professional Japanese reading annotations using Kuroshiro NLP
- 🏫 **School Directory** - 47 prefectures with school information
- 🏠 **Student Life Guides** - Housing, part-time work, cultural information
- 🌍 **Multilingual Support** - English, Nepali, Japanese
- 📱 **Mobile-First Design** - Responsive CSS modules
- 🔊 **Text-to-Speech** - Built-in speech synthesis

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** React 18 with CSS Modules
- **NLP:** Kuroshiro + Kuromoji (Japanese morphological analysis)
- **Deployment:** Vercel

## 📁 Project Structure

```
next.nova/
├── my-nex-project/          ← Main Next.js app (SET AS ROOT IN VERCEL!)
│   ├── app/
│   │   ├── api/             ← API routes (translate, furigana, support)
│   │   ├── page.tsx         ← Homepage
│   │   ├── translate/       ← Translation UI
│   │   ├── school/          ← School directory
│   │   └── ...
│   ├── public/              ← Static assets
│   ├── next.config.mjs      ← Kuroshiro webpack config
│   └── package.json         ← Dependencies
├── vercel.json              ← Vercel configuration
├── VERCEL_DEPLOYMENT.md     ← Detailed deployment guide
└── README.md                ← This file
```

## 🔧 Local Development

```bash
cd my-nex-project
npm install
npm run dev
# Open http://localhost:3000
```

## 📦 Production Build

```bash
cd my-nex-project
npm run build
npm start
```

## 🌐 Environment Variables (Optional)

Only needed if using a private LibreTranslate instance:

- `LT_API_URL` - Your LibreTranslate server URL
- `LT_API_KEY` - Your API key

Public APIs work perfectly without these!

## 📝 License

Private project for educational purposes.

## 🤝 Contributing

This is a personal project for Japanese student support.

---

**Ready to deploy?** Follow [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for step-by-step instructions!
