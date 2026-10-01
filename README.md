# ছবির সহায়ক — Photo Sahayak 📷

A free, **bilingual (বাংলা + English)** suite of browser-based photo tools, built for a global audience
and especially tuned for Bangladesh.

**All processing happens 100% in the browser (HTML5 Canvas). No uploads, no server, no paid services, no AI chat.**
**সব কাজ ব্রাউজারেই হয় (HTML5 Canvas দিয়ে)। কোনো আপলোড বা সার্ভার নেই।**

- Pure HTML / CSS / vanilla JavaScript — **no build step, no framework, no dependencies**
- Language auto-detects from the browser (বাংলা users see বাংলা, everyone else sees English) with a manual toggle
- Deploys unchanged to Netlify, Vercel, Cloudflare Pages, GitHub Pages or any static host

---

## 🧰 টুলসমূহ / Tools (20)

| Tool page | What it does |
|---|---|
| `index.html` | Homepage — hero + featured tools |
| `tools.html` | All-tools index (every tool in one grid) |
| `resize-image.html` | Resize by pixels / % + social media presets |
| `compress-image.html` | Quality slider + target size (KB) |
| `png-to-jpg.html` | PNG ↔ JPG ↔ WebP converter |
| `crop-image.html` | Crop, rotate, flip |
| `passport-photo.html` | Passport photo maker (35×45 mm etc., 300 DPI) |
| `rotate-flip.html` | Rotate 90/180/270° + flip H/V |
| `adjust-image.html` | Brightness, contrast, saturation, blur, grayscale, sepia, invert |
| `compare-image.html` | Before/after comparison slider |
| `watermark-image.html` | Text or logo watermark (position, opacity, tiled) |
| `add-border.html` | Coloured border, padding, rounded corners |
| `meme-generator.html` | Top/bottom captions meme maker |
| `circle-crop.html` | Circle / rounded-square avatar & profile crop |
| `strip-metadata.html` | Remove EXIF, GPS and camera data |
| `favicon-generator.html` | All favicon sizes as PNG + one `.ico` |
| `ico-converter.html` | PNG/JPG → multi-size `.ico` |
| `base64-encoder.html` | Image → Base64 data URI + CSS/HTML snippets |
| `color-picker.html` | Pick a colour, extract the palette (HEX) |
| `image-to-pdf.html` | Images → one PDF (A4 / Letter, margins) |
| `batch-image.html` | Bulk resize / compress / convert + ZIP download |
| `404.html` | Not-found page |

### ফাইল কাঠামো / File layout

```
index.html, tools.html, 404.html, <20 tool pages>.html
css/style.css
js/common.js          shared helpers (language toggle, uploader, canvas utils)
js/<tool>.js          one script per tool
scripts/generate.mjs  static page generator (boilerplate + SEO)
scripts/tools/*.mjs   per-tool content config used by the generator
favicon.svg, og-image.svg
_headers              Netlify / Cloudflare Pages headers
vercel.json           Vercel headers
robots.txt, sitemap.xml
server.js, package.json   local preview server (zero dependencies)
```

### নতুন টুল যোগ করা / Adding a tool

Tool pages are generated so navigation, SEO and JSON-LD stay consistent:

1. Create a config file in `scripts/tools/` (copy an existing one).
2. Add your tool's markup (`panel`), copy (`title`, `desc`, `faq`, `steps`) and its script to `scripts/`.
3. Run `node scripts/generate.mjs` — it writes the page, `tools.html` and `sitemap.xml`.

The generated HTML is committed, so deployment still needs **no build step**.
---

## ১) GitHub-এ ফাইল আপলোড / Upload to GitHub

### Option A — GitHub website (easiest)

1. Go to **https://github.com** and sign in.
2. **+** (top-right) → **New repository** → name it (e.g. `photo-sahayak`) → **Public** → **Create repository**.
3. Click **uploading an existing file**, then drag in **all** project files (HTML, `css/`, `js/`, `scripts/`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `og-image.svg`, `_headers`, `vercel.json`, `README.md`).
4. Click **Commit changes**. ✅

### Option B — Command line

```bash
git init
git add .
git commit -m "Initial commit: Photo Sahayak photo tools suite"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/photo-sahayak.git
git push -u origin main
```

---

## ২) ফ্রি ডিপ্লয় / Deploy free

### A. Netlify (primary)

1. **https://app.netlify.com/signup** → sign up with **GitHub**.
2. **Add new site** → **Import an existing project** → **GitHub** → pick the repository.
3. Build settings: **Build command** empty · **Publish directory** `.`
4. **Deploy** → live at `https://<name>.netlify.app` in seconds.
5. Custom domain: **Site configuration → Domain management → Add domain**.
6. `_headers` is picked up automatically (caching + security headers). `404.html` is served automatically.

### B. Vercel (alternative)

1. **https://vercel.com/import** → import the GitHub repository.
2. Framework preset: **Other** · Build command: empty · Output directory: `.`
3. **Deploy**, then **Settings → Domains** for a custom domain. `vercel.json` applies the headers.

> Neither flow needs an API key. `NETLIFY_AUTH_TOKEN` / `NETLIFY_SITE_ID` are only for CLI deployments.

### C. Anywhere else

Cloudflare Pages, GitHub Pages, Firebase Hosting, S3 + CloudFront — all work as-is (no build, no dependencies).
On GitHub Pages use `/` as the publish directory and remember URLs are served from the `main` branch root.

---

## ৩) Google Search Console-এ sitemap / Submit the sitemap

1. **https://search.google.com/search-console** → sign in with Google.
2. **+ Add property** → **URL prefix** → enter `https://<name>.netlify.app` (or your domain) → **Continue**.
3. **Verify ownership** — easiest is **HTML tag**: copy the `<meta>` snippet into the `<head>` of `index.html`, redeploy, then **Verify**. (DNS TXT works too.)
4. Left menu → **Sitemaps** → type `sitemap.xml` → **Submit**. ✅
5. **Pages** report shows which URLs Google indexed; use **URL Inspection** to request indexing of a specific page.

`sitemap.xml` lists every page (homepage, tools index and all tool pages) and is regenerated by `node scripts/generate.mjs`.

---

## 🛠️ লোকালি দেখা / Run locally

Static site — open `index.html` directly, or use the bundled zero-dependency server:

```bash
npm start        # serves the folder on 0.0.0.0:$PORT
```

Useful checks:

```bash
node scripts/generate.mjs          # regenerate tool pages + sitemap
for f in js/*.js; do node --check "$f"; done   # syntax check every script
```

> ⚠️ **Placeholder domain:** files use `https://example.com` — replace it with your real domain (find & replace).