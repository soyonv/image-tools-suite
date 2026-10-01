# ছবির সহায়ক — Photo Sahayak 📷

A free, bilingual (**বাংলা + English**) **browser-based photo tools suite** for Bangladesh.
সম্পূর্ণ ফ্রি, বাংলা ও ইংরেজিতে — কোনো অ্যাপ ইনস্টল ছাড়াই ব্রাউজারে ছবি এডিট।

**All processing happens 100% in the browser (HTML5 Canvas). No uploads, no server, no paid services, no AI chat.**
**সব কাজ ব্রাউজারেই হয় (HTML5 Canvas দিয়ে)। কোনো আপলোড বা সার্ভার নেই।**

---

## 📁 ফাইল তালিকা / Files

| File | Purpose / কাজ |
|---|---|
| `index.html` | Homepage — hero + tool grid / হোম পেজ |
| `resize-image.html` | Resize by pixels / % + social presets / সাইজ পরিবর্তন |
| `compress-image.html` | Quality slider + target size (KB) / সাইজ কমান |
| `png-to-jpg.html` | PNG ↔ JPG ↔ WebP converter / ফরম্যাট কনভার্ট |
| `crop-image.html` | Crop, rotate, flip / ক্রপ, রোটেট, ফ্লিপ |
| `passport-photo.html` | Passport-size photo maker (35×45 mm etc.) / পাসপোর্ট ছবি |
| `404.html` | Not-found page / ভুল পেজ |
| `css/style.css` | All styles / সব স্টাইল |
| `js/common.js` | Shared helpers (language toggle, uploader) |
| `js/resize.js`, `js/compress.js`, `js/convert.js`, `js/crop.js`, `js/passport.js` | One script per tool / প্রতিটি টুলের স্ক্রিপ্ট |
| `favicon.svg` | Site icon / ফেভিকন |
| `robots.txt` | For search engines + sitemap link |
| `sitemap.xml` | List of all pages for Google |

> ⚠️ **Placeholder domain:** every file uses `https://example.com`. Replace it with your real domain after you buy/set one (find & replace `example.com`).

---

## ১) GitHub-এ ফাইল আপলোড করুন / Upload the files to GitHub

### Option A — GitHub website (easiest / সবচেয়ে সহজ)

1. Go to **https://github.com** and create a free account (or sign in).
   গিয়ে ফ্রি অ্যাকাউন্ট খুলুন বা সাইন ইন করুন।
2. Click the **+** icon (top-right) → **New repository**.
   ডান উপরের **+** আইকনে → **New repository**।
3. Repository name: e.g. `photo-tools`. Keep it **Public** → click **Create repository**.
   নাম দিন (যেমন `photo-tools`), **Public** রাখুন → **Create repository**।
4. On the empty repo page, click **uploading an existing file**.
   খালি পেজে **uploading an existing file** ক্লিক করুন।
5. Drag & drop **all the project files** (HTML, CSS, JS, robots.txt, sitemap.xml, favicon.svg, README.md) into the page.
   সব ফাইল ড্র্যাগ করে ছেড়ে দিন।
6. Click **Commit changes**. Done — the code is on GitHub.
   **Commit changes** ক্লিক করুন। শেষ! ✅

### Option B — Git command line / কমান্ড লাইন থেকে

```bash
git init
git add .
git commit -m "Initial commit: photo tools suite"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/photo-tools.git
git push -u origin main
```

(Create the empty repo on GitHub first, then replace `YOUR-USERNAME`.)

---

## ২) Netlify-তে ফ্রি ডিপ্লয় / Deploy free on Netlify

**No API keys, no `NETLIFY_AUTH_TOKEN`, no `NETLIFY_SITE_ID` needed** — everything happens in the browser.
**কোনো API key লাগবে না** — সবকিছু ব্রাউজারেই হবে।

1. Open **https://app.netlify.com/signup** and sign up with your **GitHub** account.
   **GitHub** দিয়ে সাইন আপ করুন।
2. After signup, click **Add new site** → **Import an existing project** → **GitHub**.
   **Add new site** → **Import an existing project** → **GitHub** চাপুন।
3. Select your repository (e.g. `photo-tools`) → **Install & Authorize** if asked.
   আপনার রিপো বাছুন।
4. Build settings:
   - **Build command:** leave empty / খালি রাখুন
   - **Publish directory:** `.` (files are in the root / ফাইল রুটেই আছে)
5. Click **Deploy**. Wait ~30 seconds — your site goes live at `https://your-site-name.netlify.app`.
   **Deploy** চাপুন। ৩০ সেকেন্ডে সাইট লাইভ হবে। 🎉
6. **Custom domain (optional):** Site configuration → **Domain management** → **Add domain** and follow the DNS instructions from your registrar.
   নিজের ডোমেইন যোগ করতে: **Domain management** → **Add domain**।
7. **404 page:** Netlify automatically uses the `404.html` in your repo — nothing to configure.
   `404.html` নিজে থেকেই ব্যবহার হবে।

---

## ৩) Google Search Console-এ sitemap জমা দিন / Submit the sitemap

1. Go to **https://search.google.com/search-console** and sign in with your Google account.
   **Search Console** খুলে Google অ্যাকাউন্টে সাইন ইন করুন।
2. Click **+ Add property** → choose **URL prefix** → enter your site URL (e.g. `https://your-site-name.netlify.app` or `https://example.com`) → **Continue**.
   **+ Add property** → **URL prefix** → আপনার সাইটের URL দিন।
3. **Verify ownership** — easiest is **HTML tag**: copy the `<meta>` code, add it inside the `<head>` of `index.html`, redeploy on Netlify, then click **Verify**.
   **HTML tag** পদ্ধতিতে ভেরিফাই করুন: মেটা ট্যাগটি `index.html`-এর `<head>`-এ বসিয়ে আবার ডিপ্লয় করুন।
4. In the left menu, open **Sitemaps** (under *Indexing → Sitemaps*).
   বাঁ পাশে **Sitemaps** খুলুন।
5. In "Add a new sitemap", type `sitemap.xml` → click **Submit**.
   `sitemap.xml` লিখে **Submit** চাপুন। ✅
6. Within a few days, **Pages** report will show which pages Google indexed.
   কয়েক দিনের মধ্যে কোন পেজ ইনডেক্স হয়েছে দেখা যাবে।

---

## 🛠️ লোকালি দেখা / Preview locally

This is a plain static site — no build step. Just open `index.html` in a browser, or run any static server:

```bash
npx serve .
```

---

## 🔒 Privacy / গোপনীয়তা

No analytics, no uploads, no cookies beyond the language preference (`localStorage`).
কোনো অ্যানালিটিক্স বা আপলোড নেই — শুধু ভাষার পছন্দ `localStorage`-এ সেভ থাকে।
