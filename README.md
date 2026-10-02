# ছবির সহায়ক — Photo Sahayak 📷

> **Canonical domain:** `https://photosahayak.netlify.app` — set in `site.config.json`,
> the single source of truth for every canonical URL, sitemap entry, feed item
> and schema block on the site.

A free, browser-only suite of photo tools plus a small SEO guide blog.

- **100% static.** Plain HTML, CSS and vanilla JavaScript. No framework, no
  bundler, no runtime dependencies — `package.json` has zero `dependencies`.
- **Nothing is uploaded.** Every tool runs entirely in the browser on an HTML5
  `<canvas>`. Images never leave the device.
- **Free, with no account and no watermark.**
- **12 interface languages** — বাংলা, English, हिन्दी, اردو, العربية, Español,
  Français, Indonesia, Português, Русский, Türkçe, 中文.
- **SEO-ready** — 99 valid JSON-LD blocks, a generated sitemap, RSS feed and
  `llms.txt` for AI assistants.

---

## 🧰 টুলসমূহ / Tools (19)

All of these are listed on `tools.html`.

| Tool | Page | What it does |
| --- | --- | --- |
| Resize | `resize-image.html` | Change photo size by pixels or percentage |
| Compress | `compress-image.html` | Shrink file size by quality slider or target KB |
| Convert format | `png-to-jpg.html` | PNG ↔ JPG ↔ WebP in one click |
| Crop | `crop-image.html` | Crop, rotate and flip |
| Passport photo | `passport-photo.html` | 35×45 mm presets at print-ready 300 DPI |
| Add border | `add-border.html` | Padding, rounded corners, custom border |
| Meme generator | `meme-generator.html` | Add top/bottom text to a photo |
| Circle crop | `circle-crop.html` | Round avatar / profile picture |
| Image to PDF | `image-to-pdf.html` | Combine images into a PDF |
| Batch | `batch-image.html` | Resize, compress or convert many files at once |
| Rotate & flip | `rotate-flip.html` | 90° rotations and mirroring |
| Adjust | `adjust-image.html` | Brightness, contrast, saturation, blur, grayscale |
| Compare | `compare-image.html` | Before/after slider |
| Strip metadata | `strip-metadata.html` | Remove EXIF and GPS data |
| Favicon generator | `favicon-generator.html` | Multi-size PNG favicon set |
| ICO converter | `ico-converter.html` | PNG/JPG to `.ico` |
| Base64 encoder | `base64-encoder.html` | Image to Base64 data URI |
| Colour picker | `color-picker.html` | Extract a palette from a photo |
| Watermark | `watermark-image.html` | Text or logo watermark |

Every tool page carries `WebApplication`, `Offer`, `HowTo` and `FAQPage`
structured data, plus 6–7 visible FAQ entries that match its schema exactly.

## 📖 গাইড / Guides (9)

Published on `blog.html`, each with `BlogPosting` + `FAQPage` structured data.

| Guide | Page |
| --- | --- |
| WhatsApp photo size guide | `whatsapp-photo-size.html` |
| Passport photo size guide | `passport-photo-size-guide.html` |
| WebP vs JPG vs PNG | `webp-vs-jpg-vs-png.html` |
| Remove photo location before posting | `remove-photo-location-before-posting.html` |
| Compress image for an online form | `how-to-compress-image-for-online-form.html` |
| Change photo background colour | `remove-photo-background-online.html` |
| Edit photos on Android without an app | `photo-look-better-in-photo-editor.html` |
| Instagram photo size guide | `instagram-photo-size.html` |
| JPG quality 80 — what it means | `jpeg-vs-png-quality.html` |

### File layout

```
index.html            homepage (hand-written)
404.html              not-found page (hand-written)
tools.html            all tools index        (generated)
blog.html             guides index           (generated)
<tool>.html           19 tool pages          (5 hand-written, 14 generated)
<guide>.html          9 guides               (generated)

css/style.css
js/                   23 vanilla ES modules — i18n.js, common.js + one per tool
scripts/
  generate.mjs        writes the generated pages, sitemap.xml, feed.xml, llms.txt
  posts.mjs           the 9 guide configs
  tools/*.mjs         per-tool configs (5 files)
  relations.mjs       the link graph: which tools pair, and which guides cover which tool
  cards.mjs           shared card markup for tools and guides
  legacy.mjs          the five tool pages kept by hand
  make-og.mjs         draws og-image.png (1200x630, zero dependencies)
  sync-domain.mjs     repoints the hand-written pages and robots.txt
  linkgraph.mjs       rewrites the link sections inside the hand-written pages
  stage.mjs           copies the static site into dist/
  verify.mjs          post-build check of dist/ (clean canonicals, tag coverage, drift)
site.config.json      the site's domain + Search Console token — single source of truth
google<token>.html    Search Console verification file (generated)
server.js             zero-dependency static server for local preview
package.json          start / dev / generate / build / verify
.github/workflows/build.yml   CI: build, verify dist/, js syntax, reproducible-build check
robots.txt            hand-written; allows search + AI crawlers
sitemap.xml           generated, 31 URLs
feed.xml              generated RSS, 9 items
llms.txt              generated plain-text map for AI assistants
vercel.json           Vercel headers + /index.html -> / redirect
_headers              Netlify / Cloudflare Pages headers
_redirects            Netlify / Cloudflare Pages redirects
favicon.svg  og-image.svg  og-image.png
```

### 🤖 AI discoverability

`robots.txt` explicitly allows Googlebot, Bingbot, GPTBot, OAI-SearchBot,
ChatGPT-User, ClaudeBot, Claude-User, anthropic-ai, PerplexityBot,
Perplexity-User, Google-Extended, Applebot-Extended, CCBot,
meta-externalagent and Bytespider. `llms.txt` lists every tool and guide with
the key facts (the 16 MB WhatsApp cap, 300 DPI = 413×531 px, client-side-only
processing, 12 languages) so assistants can cite the site accurately.

### 🔗 একটাই ঠিকানা / One canonical URL per page

The canonical address of a page is the **clean** one — `/compress-image`, never
`/compress-image.html`. Netlify answers both forms with a `200`, so without a
decision every page would have two live URLs and would split its own link equity
between them.

- `<link rel="canonical">`, `og:url`, `sitemap.xml`, `feed.xml`, `llms.txt` and
  every schema `url` / `@id` are generated clean, via `pageUrl()` in
  `scripts/generate.mjs`.
- The seven hand-written pages carry literal URLs, so `scripts/sync-domain.mjs`
  normalises the path as well as the host — otherwise a correctly changed domain
  would leave a `.html` canonical behind, which is exactly the "looks done but is
  half applied" bug it exists to prevent.
- `/_redirects` and `vercel.json` 301 the `.html` form onto the canonical. The
  Search Console token file is passed through *before* that wildcard, because
  Google fetches that exact filename.
- `npm run verify` fails the build if any page keeps a `.html` canonical, has
  two of them, or if the token pass-through goes missing from `_redirects`.

The `.html` file on disk and the `.html` hrefs in the markup are deliberately
left alone: it is the only form that works on every static host, including
GitHub Pages and a plain `file://` open. `server.js` resolves clean URLs the way
Netlify does, so local preview matches production.

### 🕸️ লিংক গ্রাফ / Link graph

Every page links to pages that are actually about the same thing. The
relationships live in one file, `scripts/relations.mjs`:

- `RELATED` — tool → tools that pair with it (crop pairs with circle-crop and
  rotate, not with whatever happened to sit next to it in the config file)
- `GUIDES` — tool → the guides that cover it, **derived by inverting the
  `tools:` list each guide already declares** in `posts.mjs`

Because `GUIDES` is computed rather than typed twice, a new guide becomes
linked from its tools automatically. `assertValid()` runs before any file is
written and fails the build if a slug is misspelled or if a tool ends up with
no guide link at all.

The six hand-written pages carry a marker pair:

```html
<!-- linkgraph:start -->  …  <!-- linkgraph:end -->
```

`scripts/linkgraph.mjs` rewrites everything between the markers, so the prose
stays hand-written while the links stay generated. Add a tool to `RELATED` and
the card appears on the right pages at the next build. A page that loses its
markers is reported rather than silently skipped.

### 🔎 Search appearance

`metaTitle()` and `metaDesc()` in `scripts/generate.mjs` keep every title ≤60
characters and every description ≤160, leading with English keywords and
keeping Bangla only where it still fits — so the useful half is never the half
Google truncates away.

---

## 🚀 পাবলিশ করা / Publishing

`npm run build` does five things, in order:

| Step | Script | Output |
| --- | --- | --- |
| 1 | `scripts/generate.mjs` | 25 tool pages, `tools.html`, `blog.html`, 9 guides, `llms.txt`, `sitemap.xml`, `feed.xml` |
| 2 | `scripts/make-og.mjs` | `og-image.png` — 1200×630 share card |
| 3 | `scripts/sync-domain.mjs` | repoints the hand-written pages and `robots.txt` |
| 4 | `scripts/linkgraph.mjs` | fills the link sections inside the hand-written pages |
| 5 | `scripts/stage.mjs` | `dist/` — a pure static copy for hosting |

Hosting config is already in the repo for all three targets:

- `vercel.json` — headers + a permanent `/index.html` → `/` redirect
- `_headers` / `_redirects` — the same rules for Netlify and Cloudflare Pages
- `dist/` is what a builder should serve; the repo root also works as-is on
  GitHub Pages

### Changing the domain later

One line in `site.config.json` drives every canonical URL, `sitemap.xml`,
`feed.xml`, `llms.txt`, `robots.txt` and JSON-LD block on the site:

```json
{
  "domain": "https://photosahayak.netlify.app"
}
```

Set it and run `npm run build`. The whole site follows — all 32 pages, all
three XML/TXT feeds, and every schema block.

Why this needs a build step rather than a find-and-replace: 25 pages are
written by `scripts/generate.mjs`, but **six pages and `robots.txt` are
hand-written and the generator never touches them** —

```
index.html  resize-image.html  compress-image.html
png-to-jpg.html  crop-image.html  passport-photo.html  robots.txt
```

Their canonicals, `og:url`, `og:image` and JSON-LD `@id` values are literal
text in the file. `scripts/sync-domain.mjs` exists purely to catch those, so
the domain never lands half-applied. It rewrites any host that is not a known
third party (`schema.org`, Google Fonts), logs every host it replaced, and is
idempotent — so a mistyped domain is always recoverable with one more build.

To build against a different address without editing the file:

```bash
SITE_DOMAIN=https://staging.example.com npm run build
```

### Social previews

`og:image` must be a raster image — Facebook, WhatsApp, X and LinkedIn all
refuse SVG, which is why the share card is a generated PNG rather than an
`.svg`. Regenerate it any time with `node scripts/make-og.mjs`.

---

## 🛠️ লোকালি দেখা / Run locally

Static site — open `index.html` directly, or use the bundled zero-dependency
server:

```bash
npm install        # no dependencies, but keeps the lockfile honest
npm start          # serves the folder on 0.0.0.0:$PORT
```

Useful checks:

```bash
npm run build      # generate + social card + domain sync + link graph + stage dist/
npm run verify     # check dist/: every page tagged exactly once, token file intact
for f in js/*.js; do node --check "$f"; done   # syntax check every script
```

`npm run build` also **fails on purpose** if any page is missing the Search
Console verification tag or carries it twice — see step ৩ below. `npm run
verify` then checks the artefact that actually ships, not just the sources.

### নতুন টুল যোগ করা / Adding a tool

Add an entry to the matching file in `scripts/tools/*.mjs` (`slug`, `h1bn`,
`h1en`, `shortDescBn`, `shortDescEn`, `desc`, `descEn`, `keywords`, `icon`,
`steps`, `faq`), then run `node scripts/generate.mjs`.

> Use typographic quotes `“…”` inside any `data-bn` / `data-en` attribute. A
> straight `"` terminates the attribute early and breaks the language
> switcher.

### নতুন গাইড যোগ করা / Adding a guide

Add an entry to `scripts/posts.mjs` (`slug`, `date`, `title`, `desc`,
`descEn`, `keywords`, `h1bn`, `h1en`, `subbn`, `suben`, `icon`, `tools`,
`sections`, `faq`), then run `node scripts/generate.mjs`. The guide, the blog
index, the sitemap, the RSS feed and `llms.txt` all update together.

---

## ১) GitHub-এ ফাইল আপলোড / Upload to GitHub

Push the folder to a new repository, then point any of the hosts below at it.

### Option A — GitHub website (easiest)

Create a repository, then drag the project files in. Make sure `dist/` and
`node_modules/` stay out of it.

### Option B — Command line

```bash
git init
git add .
git commit -m "Photo Sahayak"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## ২) ফ্রি ডিপ্লয় / Deploy free

Any of these serve the site as-is, with no build server and no cost:

- **Vercel** — import the repo; `vercel.json` is already configured.
- **Netlify** — import the repo; `_headers` and `_redirects` are already there.
- **Cloudflare Pages** — same two files apply.
- **GitHub Pages** — serve from the repo root; `npm run build` is not required.

Whichever you pick, confirm the domain in `site.config.json` matches the
address you deployed to, then run `npm run build` again.

## ৩) Google Search Console / Verify + submit the sitemap

### 🔐 Ownership is already built in / ডোমেইন ভেরিফাই আগেই বসানো

There is nothing to paste. `site.config.json` holds the token:

```json
"verification": {
  "google": "google-site-verification=K8OpKzoXFUM-vUMqgWfSAmUMmkRy07k0pbBtiAIMuhM"
}
```

`scripts/generate.mjs` turns that one value into **two** proofs at once, and
re-emits both on every build:

| Method | What lands in `dist/` | Pick it when Google offers |
| --- | --- | --- |
| HTML tag | `<meta name="google-site-verification" content="K8Op…">` in all 32 pages | **HTML tag** (the default) |
| HTML file | `googleK8Op….html` containing `google-site-verification=K8Op…` | **HTML file** upload |

Both are generated, so a rebuild can never drop them. The generator then
**fails the build** if any page is missing the tag or carries it twice — which
covers the seven hand-written pages (`index`, `resize-image`, `compress-image`,
`crop-image`, `passport-photo`, `png-to-jpg`, `404`) that no template touches.

The DNS TXT method is not available here: `photosahayak.netlify.app` is a
`netlify.app` subdomain and Netlify owns that DNS. If you ever attach a domain
of your own, add `google-site-verification=K8Op…` as a TXT record on it and
drop `verification.google` from the config if you prefer.

### জমা দেওয়ার নিয়ম / Then submit

1. Add the site at <https://search.google.com/search-console>, choose the
   **HTML tag** method, and paste nothing — the tag is already on the homepage.
2. Under **Sitemaps**, submit `https://photosahayak.netlify.app/sitemap.xml`.
3. From **URL Inspection**, request indexing for `/` once to get the crawl
   started.
4. Repeat at <https://www.bing.com/webmasters> if you want Bing indexing.

To rotate or retire the token, edit `verification.google` in
`site.config.json` (set it to `""` to strip the tag everywhere) and run
`npm run build`.

### ✅ Checks that run on every push and pull request

`.github/workflows/build.yml` is the whole test suite, and it needs no secret,
database or service — the build *is* the test:

1. `npm run build` — fails on a broken link graph or a missing/duplicated tag.
2. `npm run verify` — `dist/` holds every page byte-identical to the root, each
   tagged exactly once inside `<head>`, and `google<token>.html` present with
   byte-exact content.
3. `node --check` on all 23 browser modules.
4. A reproducibility check — re-running every build step must change nothing,
   so the committed `dist/` can never drift from the deployed artefact.

`npm run verify` is deliberately not a rubber stamp: deleting the tag from a
page, deleting the token file, corrupting its content, hand-editing
`dist/index.html`, reintroducing a `.html` canonical, duplicating a canonical
tag, or removing the token pass-through from `_redirects` each make it exit 1 and
name the file.

---

> ✅ **Domain is configured:** `https://photosahayak.netlify.app`, set in
> `site.config.json`. If you later move the site, change that one value and
> run `npm run build` again.
