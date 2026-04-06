# 🏠 NestMatch — Deploy to Vercel in 10 Minutes
# Complete step-by-step guide. No coding knowledge needed.

---

## ✅ What You Have in This Folder

```
nestmatch/
├── src/
│   ├── main.jsx          ← React entry point + PWA setup
│   └── App.jsx           ← Your complete NestMatch app
├── public/
│   ├── manifest.json     ← PWA config (makes it installable)
│   ├── sw.js             ← Service worker (offline support)
│   └── favicon.svg       ← App icon
├── index.html            ← HTML shell
├── package.json          ← Dependencies
├── vite.config.js        ← Build config
├── vercel.json           ← Vercel deployment settings
├── .env.example          ← Environment variables template
└── .gitignore            ← Files to exclude from GitHub
```

---

## 🚀 OPTION A — Deploy via GitHub (Recommended — Auto-deploys on every change)

### Step 1 — Install Git & Node.js (5 mins, one time only)
1. Download Node.js from: **https://nodejs.org** → click "LTS" → install
2. Download Git from: **https://git-scm.com** → install with default settings
3. Restart your computer after installing both

### Step 2 — Create a GitHub account (2 mins)
1. Go to **https://github.com** → Sign up (free)
2. Verify your email

### Step 3 — Upload your project to GitHub (3 mins)
Open Terminal (Mac) or Command Prompt (Windows) and run these commands ONE BY ONE:

```bash
# Navigate to your nestmatch folder (adjust path as needed)
cd /path/to/nestmatch

# Install dependencies
npm install

# Initialize git
git init
git add .
git commit -m "Initial NestMatch launch 🏠"

# Create GitHub repo and push
# (GitHub will give you these commands after you create a new repo)
git remote add origin https://github.com/YOUR_USERNAME/nestmatch.git
git branch -M main
git push -u origin main
```

**To create the GitHub repo:**
1. Go to github.com → click the "+" button → "New repository"
2. Name it: `nestmatch`
3. Keep it Private ✅
4. Click "Create repository"
5. GitHub shows you the exact commands — copy and paste them

### Step 4 — Deploy to Vercel (2 mins)
1. Go to **https://vercel.com** → Sign up with your GitHub account
2. Click **"Add New Project"**
3. Click **"Import"** next to your `nestmatch` repo
4. Vercel auto-detects Vite ✅ — don't change any settings
5. Click **"Deploy"**
6. Wait ~60 seconds ⏳
7. 🎉 **Your app is LIVE** at `nestmatch.vercel.app`

---

## 🚀 OPTION B — Deploy via Drag & Drop (Fastest — no GitHub needed)

### Step 1 — Build the app
Open Terminal in your nestmatch folder:
```bash
npm install
npm run build
```
This creates a `dist/` folder with your built app.

### Step 2 — Drag & Drop to Vercel
1. Go to **https://vercel.com** → Sign up (free)
2. On the dashboard, scroll down to **"Or deploy a new project"**
3. Drag your entire **`dist/` folder** onto the Vercel page
4. Wait ~30 seconds
5. 🎉 **Your app is LIVE!**

---

## 🔑 Step 5 — Add Your Supabase Keys to Vercel

After deploying, add your environment variables:

1. In Vercel Dashboard → click your project
2. Go to **Settings** → **Environment Variables**
3. Add these two variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...your key...` |

4. Click **Save**
5. Go to **Deployments** → click **"Redeploy"**

---

## 🌐 Step 6 — Connect Your nestmatch.ca Domain (Optional)

1. Buy **nestmatch.ca** at namecheap.com (~$15/yr)
2. In Vercel → your project → **Settings** → **Domains**
3. Type: `nestmatch.ca` → click **Add**
4. Vercel gives you DNS records to add
5. In Namecheap → your domain → **Advanced DNS** → add those records
6. Wait 10–30 minutes for DNS to propagate
7. ✅ Your app is live at **nestmatch.ca**

---

## 📱 Step 7 — Test PWA Install on Your Phone

Once live, visit your Vercel URL on your phone:

**On iPhone (Safari):**
1. Open Safari → go to your app URL
2. Tap the Share button (box with arrow) at the bottom
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **"Add"**
5. ✅ NestMatch icon appears on your home screen!

**On Android (Chrome):**
1. Open Chrome → go to your app URL
2. A banner appears: "Add NestMatch to Home Screen"
3. Tap **"Install"**
4. ✅ NestMatch icon appears on your home screen!

---

## 🆘 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `npm install` fails | Make sure Node.js is installed: `node --version` |
| White screen after deploy | Check browser console for errors. Usually a missing env variable. |
| "Build failed" in Vercel | Go to Vercel → Deployments → click the failed deploy → read the error |
| Domain not working | DNS takes up to 48hrs. Check Vercel's domain settings. |
| PWA not installing | Must be on HTTPS. Vercel provides this automatically. |

---

## ✅ Your Launch Checklist

- [ ] App deployed to Vercel
- [ ] URL working in browser
- [ ] PWA installs on your phone
- [ ] Supabase env variables added
- [ ] Custom domain connected (nestmatch.ca)
- [ ] Share link in Toronto/Vancouver rental Facebook groups
- [ ] Post in r/toronto and r/vancouver

---

## 💬 After You Launch — Tell Claude:

> "The app is live. Now build me the Capacitor config to submit to the Apple App Store and Google Play Store."

That's your next step! 🚀
