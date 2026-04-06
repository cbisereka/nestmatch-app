# 🚀 NestMatch — Deploy to Vercel in 15 Minutes
# Follow these steps exactly and your app will be live today

---

## ✅ What You're Deploying

A fully working NestMatch app with:
- 🛡️ Scam Shield™ alerts
- 🏠 Listings with verified badges, rent control filter, sq ft/person
- 🤝 Roommate matching with income + ID verification badges
- ⭐ Two-way blind review system
- 📱 PWA — installs like a real app on any phone

---

## 📋 STEP 1 — Install GitHub Desktop (5 mins)

GitHub is where your code lives. Vercel reads from GitHub to deploy.

1. Go to: **https://desktop.github.com**
2. Download and install GitHub Desktop (free)
3. Sign up for a free GitHub account if you don't have one
4. Open GitHub Desktop → sign in

---

## 📋 STEP 2 — Create Your Project on Your Computer (3 mins)

1. On your computer, create a new folder called **nestmatch**
2. Inside that folder, create these folders:
   - `src`
   - `public`
   - `public/icons`
   - `public/screenshots`

3. Download all files from this package and place them like this:

```
nestmatch/
├── package.json          ← copy this file here
├── vite.config.js        ← copy this file here
├── vercel.json           ← copy this file here
├── index.html            ← copy this file here
├── .gitignore            ← copy this file here
├── .env.example          ← copy this file here
├── src/
│   ├── main.jsx          ← copy this file here
│   └── App.jsx           ← copy this file here (your NestMatch app)
└── public/
    └── icons/
        └── icon.svg      ← copy this file here
```

---

## 📋 STEP 3 — Set Up Supabase (5 mins)

You need Supabase for your database. It's free.

1. Go to **https://supabase.com** → sign up free
2. Click "New Project" → name it **nestmatch** → choose **Canada (ca-central-1)**
3. Wait 2 minutes for it to set up
4. Go to **Settings → API** and copy:
   - Your **Project URL** (looks like: `https://abcdef.supabase.co`)
   - Your **anon public key** (long string starting with `eyJ...`)
5. In your nestmatch folder, copy `.env.example` and rename it to `.env.local`
6. Open `.env.local` and replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://YOUR_ACTUAL_URL.supabase.co
   VITE_SUPABASE_ANON_KEY=eyYOUR_ACTUAL_KEY_HERE
   ```

> 💡 Don't have the schema set up yet? The app will still work with mock data — you can add Supabase later.

---

## 📋 STEP 4 — Push to GitHub (3 mins)

1. Open **GitHub Desktop**
2. Click **"Add an Existing Repository from your Hard Drive"**
3. Select your nestmatch folder
4. It will ask to "Initialize this repository" → click **Initialize Repository**
5. In the bottom left, type a commit message: `Initial NestMatch launch 🚀`
6. Click **"Commit to main"**
7. Click **"Publish repository"** (top right)
   - Name: `nestmatch`
   - Keep it **Public** (required for free Vercel)
8. Click **Publish Repository**

Your code is now on GitHub ✅

---

## 📋 STEP 5 — Deploy on Vercel (2 mins — this is the magic part)

1. Go to **https://vercel.com** → click "Sign Up"
2. Choose **"Continue with GitHub"** → authorize Vercel
3. Click **"Add New Project"**
4. Find **nestmatch** in your list → click **"Import"**
5. Vercel auto-detects Vite ✅
6. Click **"Environment Variables"** → add:
   - Name: `VITE_SUPABASE_URL` → Value: your Supabase URL
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: your anon key
7. Click **"Deploy"**
8. Wait 60–90 seconds...
9. 🎉 **YOUR APP IS LIVE!**

Vercel gives you a free URL like: `https://nestmatch-abc123.vercel.app`

---

## 📋 STEP 6 — Add Your Custom Domain (Optional, ~15 mins)

To get **nestmatch.ca** instead of the random Vercel URL:

1. Buy **nestmatch.ca** at **https://www.namecheap.com** (~$15/yr)
2. In Vercel → your project → **Settings → Domains**
3. Type `nestmatch.ca` → click **Add**
4. Vercel shows you two DNS records to add
5. In Namecheap → your domain → **Advanced DNS**
6. Add the two records Vercel gave you
7. Wait 10–30 mins for DNS to propagate
8. Your app is live at **nestmatch.ca** 🇨🇦

---

## 📋 STEP 7 — Install on Your Phone as an App (2 mins)

Once deployed, share it like a real app!

**On iPhone:**
1. Open Safari → go to your Vercel URL
2. Tap the Share button (square with arrow) at the bottom
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**
5. NestMatch icon appears on your home screen! 🏠

**On Android:**
1. Open Chrome → go to your Vercel URL
2. Tap the three dots (⋮) menu
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"**

---

## 📋 STEP 8 — Share It Everywhere! 🚀

Now that it's live, share your link in:

**Facebook Groups:**
- Toronto Rentals
- Vancouver Rentals & Rooms
- Montreal Roommates
- r/toronto, r/vancouver on Reddit

**Sample post to copy:**
> "Tired of rental scams and unverified roommates on here? I just launched NestMatch 🏠 — a free Canadian platform with income screening, ID verification, Scam Shield alerts, and a two-way review system. No more fake listings or mystery roommates. Try it free: [your-url] 🇨🇦"

---

## 🔄 How to Update Your App Later

Every time you want to make a change:
1. Edit files on your computer
2. Open GitHub Desktop
3. Write a commit message → click "Commit to main"
4. Click "Push origin"
5. Vercel auto-deploys in 60 seconds ✅

You never need to manually deploy again.

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails on Vercel | Check you added environment variables in Vercel settings |
| White screen | Open browser console (F12) — usually a missing env variable |
| Domain not working | DNS takes up to 48hrs — be patient |
| "Module not found" error | Make sure all files are in the right folders |

---

## 💬 Next Steps After Launch

Come back to Claude and say:

> **"Connect NestMatch dashboard to Supabase live data"**
> **"Build the Capacitor config to submit to App Store"**
> **"Build the Stripe payment integration for NestMatch"**

Each one is the next piece of your production app. You're building this
one step at a time — and you're already 90% of the way there. 🏠🇨🇦
