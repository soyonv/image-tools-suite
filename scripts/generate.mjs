/**
 * Static page generator — ছবির সহায়ক | Photo Sahayak
 * -------------------------------------------------------------------------
 * Writes each tool page from a small config (scripts/tools/*.mjs) plus the
 * all-tools index (tools.html) and sitemap.xml.
 *
 * Output is committed to the repo, so deployment still needs NO build step.
 * Run after editing any tool config:   node scripts/generate.mjs
 */
import { writeFileSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteConfig = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
/* Single source of truth: site.config.json, overridable per build with
 * SITE_DOMAIN. Trailing slashes are stripped here so every template can
 * safely write `${DOMAIN}/page.html` without producing a double slash. */
const DOMAIN = String(process.env.SITE_DOMAIN || siteConfig.domain).replace(/\/+$/, "");
const LASTMOD = "2026-10-01";

/* ---------- Google Search Console verification ----------
 * The site lives on a netlify.app subdomain, whose DNS we do not control,
 * so the TXT-record method is unavailable. Ownership is proven the other
 * two ways Google accepts instead:
 *
 *   1. <meta name="google-site-verification"> in every <head>. Emitted from
 *      config so a rebuild can never silently drop it, and asserted at the
 *      end of this script so a hand-edited page fails the build instead of
 *      the Search Console check.
 *   2. google<token>.html at the site root, written below for the
 *      file-based method.
 *
 * The config value may carry the 'google-site-verification=' prefix or not;
 * both forms normalise to the bare token used by the meta tag. */
const GOOGLE_SITE_VERIFICATION = String(siteConfig.verification?.google || "")
  .trim()
  .replace(/^google-site-verification=/, "")
  .trim();

/* Empty string when unverified, so templates render byte-identical to a
 * build with no token configured. */
const VERIFY_META = GOOGLE_SITE_VERIFICATION
  ? `\n  <meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}">`
  : "";
const VERIFY_FILE = GOOGLE_SITE_VERIFICATION ? `google${GOOGLE_SITE_VERIFICATION}.html` : "";

/* ---------- Canonical URLs ----------
 * Every page has exactly one canonical address, and it is the clean one:
 * `/compress-image`, never `/compress-image.html`. Netlify serves both forms
 * with a 200, so without a decision the site would have two live URLs per page
 * and would split its own link equity between them.
 *
 * The `.html` form stays the filename on disk and stays the href in the
 * markup, because it is the only form that works on every static host —
 * GitHub Pages and a plain `file://` open both have no clean-URL support.
 * The clean form is what the canonical, the sitemap, the feed and every
 * schema URL declare, and `/_redirects` 301s the `.html` form onto it. */
const cleanPath = (slug) =>
  slug === "index.html" || slug === "index.htm" ? "/" : `/${slug.replace(/\.html?$/, "")}`;
const pageUrl = (slug) => `${DOMAIN}${cleanPath(slug)}`;

/* ---------- Load configs ---------- */
const toolsDir = join(ROOT, "scripts", "tools");
const files = readdirSync(toolsDir).filter((f) => f.endsWith(".mjs")).sort();
let TOOLS = [];
for (const f of files) {
  const mod = await import(join(toolsDir, f));
  TOOLS = TOOLS.concat(mod.default);
}

/* Blog posts (long-form articles that target specific search intents) */
const POSTS = (await import(join(ROOT, "scripts", "posts.mjs"))).default;

/* Internal link graph. RELATED and GUIDES replace the old "next three
   tools in the config" picking, which produced links that existed but
   meant nothing. See scripts/relations.mjs. */
const REL = await import(join(ROOT, "scripts", "relations.mjs"));
const { relatedFor, guidesFor, post: postBySlug, assertValid } = REL;
const { allTools, toolCard, guideCard, GENERIC_ICON } = await import(join(ROOT, "scripts", "cards.mjs"));
const { LEGACY } = await import(join(ROOT, "scripts", "legacy.mjs"));

/* ---------- Meta description ----------
 * Google truncates the description at roughly 160 characters, so a naive
 * Bengali + English concatenation overflows and pushes the useful half
 * (which carries the keywords) off the end. Each config supplies a short
 * English `descEn`; we pair it with the leading Bengali clause only, then
 * hard-cap the result so nothing is silently cut mid-word by Google. */
const DESC_MAX = 158;

function clip(text, max) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:\-—|।]+$/, "") + "…";
}

/** Builds a search-ready description: English keywords first, then Bangla. */
function metaDesc(descEn, descBn) {
  const en = clip(descEn, DESC_MAX - 2);
  if (!descBn) return en;
  const room = DESC_MAX - en.length - 3;
  if (room < 30) return en;
  return `${en} — ${clip(descBn, room)}`;
}

/* ---------- Meta title ----------
 * Configs store titles as "বাংলা | English". Google's result title is about
 * 60 characters, so anything past that is cut in the SERP anyway — and if the
 * Bangla half sits first, the cut happens before the English keywords appear.
 * We therefore lead with English, and only keep the Bangla half when the whole
 * thing still fits. */
const TITLE_MAX = 60;

function metaTitle(title) {
  const parts = String(title).split("|").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return clip(title, TITLE_MAX);
  const en = parts[parts.length - 1];
  const bn = parts.slice(0, -1).join(" ");
  const combined = `${en} | ${bn}`;
  if (combined.length <= TITLE_MAX) return combined;
  return clip(en, TITLE_MAX);
}

/* Flattened paragraphs, used for the article schema and llms.txt */
function postText(post) {
  return post.sections
    .map((s) => s.h2en + " " + s.pen.join(" "))
    .concat(post.faq.map((f) => f.qen + " " + f.aen))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Pages that already exist and are hand-written (kept out of the generator).
   The list itself lives in scripts/legacy.mjs so the generator and the
   link-graph updater agree on which pages are hand-maintained. */

const NAV = [
  { href: "index.html", bn: "হোম", en: "Home" },
  { href: "resize-image.html", bn: "সাইজ পরিবর্তন", en: "Resize" },
  { href: "compress-image.html", bn: "ছবি কমান", en: "Compress" },
  { href: "png-to-jpg.html", bn: "ফরম্যাট", en: "Convert" },
  { href: "crop-image.html", bn: "ক্রপ", en: "Crop" },
  { href: "passport-photo.html", bn: "পাসপোর্ট", en: "Passport" },
  { href: "tools.html", bn: "সব টুল", en: "All tools" },
  { href: "blog.html", bn: "ব্লগ", en: "Blog" }
];

const SITE = {
  bn: "ছবির সহায়ক",
  en: "Photo Sahayak",
  tagBn: "ফ্রি অনলাইন ফটো টুলস",
  tagEn: "Free online photo tools"
};

const logoMark = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2.2"/><path d="m3 17 5-4.5 4 3.5 3.5-3 5.5 5"/></svg>`;

const header = () => `  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">
        <span class="logo-mark" aria-hidden="true">${logoMark}</span>
        <span>
          <span data-bn="${SITE.bn}" data-en="${SITE.en}">${SITE.bn}</span>
          <small data-bn="${SITE.tagBn}" data-en="${SITE.tagEn}">${SITE.tagBn}</small>
        </span>
      </a>
      <div class="header-actions">
        <button class="lang-toggle" id="langToggle" type="button">EN</button>
        <button class="nav-toggle" id="navToggle" type="button" aria-expanded="false" aria-controls="siteNav" data-bn-aria="মেনু খুলুন" data-en-aria="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <nav class="site-nav" id="siteNav" aria-label="Main navigation">
          <ul>
${NAV.map((n) => `            <li><a href="${n.href}" data-bn="${n.bn}" data-en="${n.en}">${n.bn}</a></li>`).join("\n")}
          </ul>
        </nav>
      </div>
    </div>
  </header>`;

const footer = () => {
  const half = Math.ceil(TOOLS.length / 2);
  const list = (arr) => arr.map((t) => `            <li><a href="${t.slug}" data-bn="${t.shortBn}" data-en="${t.shortEn}">${t.shortBn}</a></li>`).join("\n");
  return `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h4 data-bn="${SITE.bn}" data-en="${SITE.en}">${SITE.bn}</h4>
          <p data-bn="বাংলা ও ইংরেজি ভাষাভারীদের জন্য ফ্রি অনলাইন ফটো টুলস। সব প্রসেসিং আপনার ব্রাউজারেই হয় — ছবি কখনো আপলোড হয় না।" data-en="Free online photo tools for Bengali and English speakers. All processing happens in your browser — photos are never uploaded.">বাংলা ও ইংরেজি ভাষাভারীদের জন্য ফ্রি অনলাইন ফটো টুলস। সব প্রসেসিং আপনার ব্রাউজারেই হয় — ছবি কখনো আপলোড হয় না।</p>
          <p style="margin-top:10px"><a href="tools.html" data-bn="সব টুল দেখুন →" data-en="See all tools →">সব টুল দেখুন →</a></p>
        </div>
        <div>
          <h4 data-bn="টুলসমূহ" data-en="Tools">টুলসমূহ</h4>
          <ul>
${list(TOOLS.slice(0, half))}
          </ul>
        </div>
        <div>
          <h4 data-bn="আরও টুল" data-en="More tools">আরও টুল</h4>
          <ul>
${list(TOOLS.slice(half))}
            <li><a href="index.html#faq" data-bn="সাধারণ জিজ্ঞাসা" data-en="FAQ">সাধারণ জিজ্ঞাসা</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="year">2026</span> <span data-bn="${SITE.bn}" data-en="${SITE.en}">${SITE.bn}</span> | <span data-bn="সর্বস্বত্ব সংরক্ষিত" data-en="All rights reserved">সর্বস্বত্ব সংরক্ষিত</span></span>
        <span data-bn="ভালোবাসা দিয়ে তৈরি — বাংলাদেশের জন্য 🇧🇩" data-en="Made with love — for everyone 🌍">ভালোবাসা দিয়ে তৈরি — বাংলাদেশের জন্য 🇧🇩</span>
      </div>
    </div>
  </footer>`;
};

/* Every page on the site, so a link can be resolved by slug from any
   template. Includes the hand-written tools, which the generator never
   writes but must still be able to point at. */
/* Every page on the site, keyed by slug — including the five hand-written
   tool pages this generator never writes but must still be able to link to.
   Card markup is shared with scripts/linkgraph.mjs so the generated pages
   and the hand-written ones can never render differently. */
const ALL_TOOLS = allTools(TOOLS);

/* A typo in relations.mjs would emit a link to a page that does not exist,
   so the graph is checked against the real page list before a single file
   is written. */
assertValid([...ALL_TOOLS.keys()]);

/* Related tools, chosen by subject rather than by position in the config. */
const relatedBlock = (tool) => {
  const picks = relatedFor(tool.slug).map((s) => ALL_TOOLS.get(s)).filter(Boolean);
  if (!picks.length) return "";
  const cardHtml = picks.map((t) => toolCard(t, "          ")).join("\n");
  return `      <section class="section">
        <div class="section-head">
          <h2 data-bn="এই টুলের সঙ্গে আরও" data-en="Related tools">এই টুলের সঙ্গে আরও</h2>
          <p data-bn="এই টুলটি যাদের সাথে ভালো মানায়।" data-en="More free tools that pair well with this one.">এই টুলটি যাদের সাথে ভালো মানায়।</p>
        </div>
        <div class="tool-grid">
${cardHtml}
        </div>
        <p style="margin-top:16px"><a href="tools.html" data-bn="সব টুল দেখুন →" data-en="See all tools →">সব টুল দেখুন →</a></p>
      </section>`;
};

/* The guides that actually cover this tool. These are the links that
   were missing entirely: every guide used to be reachable only from
   blog.html, so a visitor who landed on a tool page had no route into
   the articles. */
const guidesBlock = (tool) => {
  const picks = guidesFor(tool.slug).map(postBySlug).filter(Boolean);
  if (!picks.length) return "";
  const cardHtml = picks.map((p) => guideCard(p, "          ")).join("\n");
  return `      <section class="section alt">
        <div class="container">
          <div class="section-head">
            <h2 data-bn="এই টুল নিয়ে গাইড" data-en="Guides about this task">এই টুল নিয়ে গাইড</h2>
            <p data-bn="একই কাজ নিয়ে বিস্তারিত ব্যাখ্যা ও সঠিক সাইজের নিয়ম।" data-en="Step-by-step explanations and the size rules that actually matter.">একই কাজ নিয়ে বিস্তারিত ব্যাখ্যা ও সঠিক সাইজের নিয়ম।</p>
          </div>
          <div class="tool-grid">
${cardHtml}
          </div>
          <p style="margin-top:16px"><a href="blog.html" data-bn="সব গাইড দেখুন →" data-en="See all guides →">সব গাইড দেখুন →</a></p>
        </div>
      </section>`;
};

const faqBlock = (tool) => `      <section class="section alt">
        <div class="container">
          <div class="section-head">
            <h2 data-bn="সাধারণ জিজ্ঞাসা (FAQ)" data-en="Frequently asked questions">সাধারণ জিজ্ঞাসা (FAQ)</h2>
          </div>
          <div class="faq">
${tool.faq.map((f) => `            <details>
              <summary data-bn="${f.qbn}" data-en="${f.qen}">${f.qbn}</summary>
              <p data-bn="${f.abn}" data-en="${f.aen}">${f.abn}</p>
            </details>`).join("\n")}
          </div>
        </div>
      </section>`;

const stepsBlock = (tool) => `      <section class="section" id="how-to">
        <div class="section-head">
          <h2 data-bn="কীভাবে ব্যবহার করবেন?" data-en="How to use">কীভাবে ব্যবহার করবেন?</h2>
        </div>
        <ol class="steps">
${tool.steps.map((s) => `          <li>
            <strong data-bn="${s.bn}" data-en="${s.en}">${s.bn}</strong>
            <span data-bn="${s.sbn}" data-en="${s.sen}">${s.sbn}</span>
          </li>`).join("\n")}
        </ol>
      </section>`;

function page(tool) {
  const url = pageUrl(tool.slug);
  const scripts = ["js/i18n.js", "js/common.js", ...(tool.scripts || [])]
    .map((s) => `  <script src="${s}"></script>`)
    .join("\n");

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#webapp`,
    name: `${tool.h1bn} — ${tool.h1en}`,
    url,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Image editing",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript and HTML5 Canvas",
    inLanguage: ["bn", "en"],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: tool.steps.map((s) => s.en),
    screenshot: `${DOMAIN}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: `${SITE.bn} (${SITE.en})`,
      url: `${DOMAIN}/`
    },
    description: tool.descEn
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "All tools", item: pageUrl("tools.html") },
      { "@type": "ListItem", position: 3, name: tool.h1en, item: url }
    ]
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use the ${tool.h1en} tool`,
    description: tool.descEn,
    inLanguage: ["bn", "en"],
    totalTime: "PT1M",
    step: tool.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.en,
      text: s.sen,
      url: `${url}#how-to`
    }))
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ["bn", "en"],
    mainEntity: tool.faq.map((f) => ({
      "@type": "Question",
      name: `${f.qbn} / ${f.qen}`,
      acceptedAnswer: { "@type": "Answer", text: `${f.abn} ${f.aen}` }
    }))
  };

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${VERIFY_META}
  <title>${metaTitle(tool.title)}</title>
  <meta name="description" content="${metaDesc(tool.descEn, tool.desc)}">
  <meta name="keywords" content="${tool.keywords}">
  <meta name="author" content="${SITE.bn} | ${SITE.en}">
  <meta name="theme-color" content="#0f766e">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.bn} | ${SITE.en}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="${tool.title}">
  <meta property="og:description" content="${tool.desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${DOMAIN}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${tool.h1en} — free online photo tool by ${SITE.en}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tool.title}">
  <meta name="twitter:description" content="${tool.desc}">
  <meta name="twitter:image" content="${DOMAIN}/og-image.png">
  <meta name="twitter:image:alt" content="${tool.h1en} — free online photo tool">

  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">

  <script type="application/ld+json">
${JSON.stringify(webApp, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(howToLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
  </script>
</head>
<body>

${header()}

  <main>
    <div class="container page-head">
      <h1 data-bn="${tool.h1bn}" data-en="${tool.h1en}">${tool.h1bn}</h1>
      <p class="subtitle" data-bn="${tool.subbn}" data-en="${tool.suben}">${tool.subbn}</p>

${tool.panel}
${stepsBlock(tool)}
${faqBlock(tool)}
${relatedBlock(tool)}
${guidesBlock(tool)}
    </div>
  </main>

${footer()}

${scripts}
</body>
</html>
`;
}

/* ---------- All-tools index ---------- */
function toolsIndex() {
  const cards = TOOLS.map(
    (t) => `          <a class="tool-card" href="${t.slug}">
            <span class="icon" aria-hidden="true">${t.icon}</span>
            <h3 data-bn="${t.h1bn}" data-en="${t.h1en}">${t.h1bn}</h3>
            <p data-bn="${t.shortDescBn}" data-en="${t.shortDescEn}">${t.shortDescBn}</p>
            <span class="go" data-bn="টুল খুলুন →" data-en="Open tool →">টুল খুলুন →</span>
          </a>`
  ).join("\n");

  const legacyCards = LEGACY.filter((l) => l.slug !== "index.html")
    .map(
      (l) => `          <a class="tool-card" href="${l.slug}">
            <span class="icon" aria-hidden="true">${logoMark}</span>
            <h3 data-bn="${l.bn}" data-en="${l.en}">${l.bn}</h3>
            <p data-bn="ব্রাউজারেই কাজ হয় — কোনো আপলোড নেই।" data-en="Runs in your browser — nothing is uploaded.">ব্রাউজারেই কাজ হয় — কোনো আপলোড নেই।</p>
            <span class="go" data-bn="টুল খুলুন →" data-en="Open tool →">টুল খুলুন →</span>
          </a>`
    )
    .join("\n");

  const legacyForList = LEGACY.filter((l) => l.slug !== "index.html");
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "সব ফটো টুল — All Photo Tools",
    url: pageUrl("tools.html"),
    inLanguage: ["bn", "en"],
    description: "Complete list of free browser-based image tools.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: TOOLS.length + legacyForList.length,
      itemListElement: [
        ...TOOLS.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.h1en,
          url: pageUrl(t.slug)
        })),
        ...legacyForList.map((l, i) => ({
          "@type": "ListItem",
          position: TOOLS.length + i + 1,
          name: l.en,
          url: pageUrl(l.slug)
        }))
      ]
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "All tools", item: pageUrl("tools.html") }
    ]
  };

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${VERIFY_META}
  <title>${metaTitle(`সব ফটো টুল | All Free Online Image Tools — ${SITE.bn}`)}</title>
  <meta name="description" content="All free browser-based image tools in one place: resize, compress, convert, crop, watermark, PDF, ICO. কোনো আপলোড নেই।">
  <meta name="keywords" content="all image tools, free photo tools list, সব ফটো টুল, online image editor tools, browser image tools">
  <meta name="author" content="${SITE.bn} | ${SITE.en}">
  <meta name="theme-color" content="#0f766e">
  <link rel="canonical" href="${pageUrl("tools.html")}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.bn} | ${SITE.en}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="সব ফটো টুল | All Free Online Image Tools">
  <meta property="og:description" content="সব ফ্রি অনলাইন ইমেজ টুল — ব্রাউজারেই কাজ হয়, কোনো আপলোড নেই।">
  <meta property="og:url" content="${pageUrl("tools.html")}">
  <meta property="og:image" content="${DOMAIN}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="সব ফটো টুল — ${SITE.en} free online photo tools">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="সব ফটো টুল | All Free Online Image Tools">
  <meta name="twitter:description" content="সব ফ্রি অনলাইন ইমেজ টুল — ব্রাউজারেই কাজ হয়, কোনো আপলোড নেই।">
  <meta name="twitter:image" content="${DOMAIN}/og-image.png">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 2)}
  </script>
</head>
<body>

${header()}

  <main>
    <section class="hero">
      <div class="container hero-inner">
        <span class="eyebrow" data-bn="🔒 সব টুল আপলোড ছাড়াই, ব্রাউজারেই" data-en="🔒 No uploads — every tool runs in your browser">🔒 সব টুল আপলোড ছাড়াই, ব্রাউজারেই</span>
        <h1>
          <span data-bn="সব ফটো টুল এক জায়গায় — " data-en="Every photo tool in one place — ">সব ফটো টুল এক জায়গায় — </span><span class="accent" data-bn="১০০% ফ্রি" data-en="100% free">১০০% ফ্রি</span>
        </h1>
        <p class="lead" data-bn="রিসাইজ থেকে পাসপোর্ট, ওয়াটারমার্ক থেকে PDF — সবগুলোই আপনার ব্রাউজারে, কোনো অ্যাপ বা অ্যাকাউন্ট ছাড়াই।" data-en="From resizing to passport photos, from watermarks to PDF — all of it runs in your browser, with no app and no account.">রিসাইজ থেকে পাসপোর্ট, ওয়াটারমার্ক থেকে PDF — সবগুলোই আপনার ব্রাউজারে, কোনো অ্যাপ বা অ্যাকাউন্ট ছাড়াই।</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#tools" data-bn="টুল ব্রাউজ করুন" data-en="Browse the tools">টুল ব্রাউজ করুন</a>
        </div>
      </div>
    </section>

    <section class="section" id="tools">
      <div class="container">
        <div class="section-head">
          <h2 data-bn="সব টুল" data-en="All tools">সব টুল</h2>
          <p data-bn="${TOOLS.length + LEGACY.length - 1}টি ফ্রি টুল — প্রতিটিই এক ক্লিক দূরে।" data-en="${TOOLS.length + LEGACY.length - 1} free tools — every one is a click away.">${TOOLS.length + LEGACY.length - 1}টি ফ্রি টুল — প্রতিটিই এক ক্লিক দূরে।</p>
        </div>
        <div class="tool-grid">
${cards}
${legacyCards}
        </div>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <div class="section-head">
          <h2 data-bn="টুল আগে পড়ুন" data-en="Read the guide first">টুল আগে পড়ুন</h2>
          <p data-bn="সঠিক সাইজ আর ফরম্যাট নিয়ে বিস্তারিত — কোন টুলটি আপনার জন্য সঠিক, সেটা আগে জেনে নিন।" data-en="Short, practical guides on sizes and formats, so you can pick the right tool before you start.">সঠিক সাইজ আর ফরম্যাট নিয়ে বিস্তারিত — কোন টুলটি আপনার জন্য সঠিক, সেটা আগে জেনে নিন।</p>
        </div>
        <div class="tool-grid">
${POSTS.slice(0, 6).map((p) => guideCard(p, "          ")).join("\n")}
        </div>
        <p style="margin-top:16px"><a href="blog.html" data-bn="সব গাইড দেখুন →" data-en="See all guides →">সব গাইড দেখুন →</a></p>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <div class="trust-strip">
          <div class="trust-item">
            <strong data-bn="🔒 ১০০% প্রাইভেট" data-en="🔒 100% private">🔒 ১০০% প্রাইভেট</strong>
            <span data-bn="ছবি আপনার ডিভাইস ছাড়ে না — প্রসেসিং হয় ব্রাউজারের Canvas-এ।" data-en="Photos never leave your device — processing happens in the browser's Canvas.">ছবি আপনার ডিভাইস ছাড়ে না — প্রসেসিং হয় ব্রাউজারের Canvas-এ।</span>
          </div>
          <div class="trust-item">
            <strong data-bn="🌍 বাংলা ও ইংরেজি" data-en="🌍 Bengali & English">🌍 বাংলা ও ইংরেজি</strong>
            <span data-bn="আপনার ব্রাউজারের ভাষা অনুযায়ী UI নিজে থেকেই বদলে যায়।" data-en="The interface switches automatically based on your browser language.">আপনার ব্রাউজারের ভাষা অনুযায়ী UI নিজে থেকেই বদলে যায়।</span>
          </div>
          <div class="trust-item">
            <strong data-bn="🆓 সম্পূর্ণ ফ্রি" data-en="🆓 Completely free">🆓 সম্পূর্ণ ফ্রি</strong>
            <span data-bn="কোনো রেজিস্ট্রেশন, ওয়াটারমার্ক বা সীমাবদ্ধতা নেই।" data-en="No registration, no watermark, no limits.">কোনো রেজিস্ট্রেশন, ওয়াটারমার্ক বা সীমাবদ্ধতা নেই।</span>
          </div>
        </div>
      </div>
    </section>
  </main>

${footer()}

  <script src="js/i18n.js"></script>
  <script src="js/common.js"></script>
</body>
</html>
`;
}

/* ---------- Blog ----------
   Paragraphs are rendered as plain text (markdown `**` is stripped) because
   applyLang() swaps textContent on [data-bn][data-en] nodes — any markup
   nested inside them would be destroyed on language change. Lists are
   emitted as individual <li data-bn data-en> items instead. */
const plain = (s) => s.replace(/\*\*/g, "");

const sectionBody = (sec) => {
  const isList = sec.pen.every((p) => p.trim().startsWith("- "));
  const bn = sec.pbn.map(plain);
  const en = sec.pen.map(plain);
  if (isList) {
    return `          <ul class="post-list">
${bn
  .map(
    (p, i) =>
      `            <li data-bn="${p.trim().slice(2).trim()}" data-en="${en[i].trim().slice(2).trim()}">${p.trim().slice(2).trim()}</li>`
  )
  .join("\n")}
          </ul>`;
  }
  return `          <div class="post-body" data-bn="${bn.join(" ")}" data-en="${en.join(" ")}">${bn.join(" ")}</div>`;
};

function blogPost(post) {
  const url = pageUrl(post.slug);
  const words = postText(post).split(" ").filter(Boolean).length;
  const readingMinutesEn = Math.max(1, Math.round(words / 200));
  const readingMinutesBn = Math.max(1, Math.round(words / 180));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.h1en,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    description: post.descEn,
    inLanguage: ["bn", "en"],
    keywords: post.keywords,
    datePublished: post.date,
    dateModified: post.date,
    wordCount: words,
    isAccessibleForFree: true,
    image: `${DOMAIN}/og-image.png`,
    author: { "@type": "Organization", name: `${SITE.bn} (${SITE.en})`, url: `${DOMAIN}/` },
    publisher: {
      "@type": "Organization",
      name: `${SITE.bn} (${SITE.en})`,
      url: `${DOMAIN}/`,
      logo: { "@type": "ImageObject", url: `${DOMAIN}/favicon.svg` }
    },
    articleSection: "Image editing guides",
    articleBody: postText(post)
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl("blog.html") },
      { "@type": "ListItem", position: 3, name: post.h1en, item: url }
    ]
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ["bn", "en"],
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: `${f.qbn} / ${f.qen}`,
      acceptedAnswer: { "@type": "Answer", text: `${f.abn} ${f.aen}` }
    }))
  };

  // Cards for the tools this post recommends, so every article feeds the tools.
  const toolCards = post.tools
    .map((slug) => {
      const t = [...TOOLS, ...LEGACY].find((x) => x.slug === slug);
      if (!t) return "";
      const h3bn = t.bn || t.h1bn || t.h1en;
      const h3en = t.en || t.h1en || t.h1bn;
      const dBn = t.shortDescBn || t.subbn || "";
      const dEn = t.shortDescEn || t.suben || "";
      return `          <a class="tool-card" href="${slug}">
            <span class="icon" aria-hidden="true">${logoMark}</span>
            <h3 data-bn="${h3bn}" data-en="${h3en}">${h3bn}</h3>
            <p data-bn="${dBn}" data-en="${dEn}">${dBn}</p>
            <span class="go" data-bn="টুল খুলুন →" data-en="Open tool →">টুল খুলুন →</span>
          </a>`;
    })
    .filter(Boolean)
    .join("\n");

  const others = POSTS.filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map(
      (p) => `          <a class="tool-card" href="${p.slug}">
            <span class="icon" aria-hidden="true">${p.icon}</span>
            <h3 data-bn="${p.h1bn}" data-en="${p.h1en}">${p.h1bn}</h3>
            <p data-bn="${p.subbn}" data-en="${p.suben}">${p.subbn}</p>
            <span class="go" data-bn="পড়ুন →" data-en="Read →">পড়ুন →</span>
          </a>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${VERIFY_META}
  <title>${metaTitle(post.title)}</title>
  <meta name="description" content="${metaDesc(post.descEn, post.desc)}">
  <meta name="keywords" content="${post.keywords}">
  <meta name="author" content="${SITE.bn} | ${SITE.en}">
  <meta name="theme-color" content="#0f766e">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${SITE.bn} | ${SITE.en}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${DOMAIN}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${post.h1en}">
  <meta property="article:published_time" content="${post.date}">
  <meta property="article:section" content="Image editing guides">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.desc}">
  <meta name="twitter:image" content="${DOMAIN}/og-image.png">

  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">

  <script type="application/ld+json">
${JSON.stringify(articleLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(faqLd, null, 2)}
  </script>
</head>
<body>

${header()}

  <main>
    <article class="container page-head post">
      <p class="post-meta">
        <span class="post-icon" aria-hidden="true">${post.icon}</span>
        <time datetime="${post.date}">${post.date}</time>
        <span data-bn="${post.readingBn}" data-en="${post.readingEn}">${post.readingBn}</span>
      </p>
      <h1 data-bn="${post.h1bn}" data-en="${post.h1en}">${post.h1bn}</h1>
      <p class="subtitle" data-bn="${post.subbn}" data-en="${post.suben}">${post.subbn}</p>

${post.sections
  .map(
    (s) => `      <section class="post-section">
        <h2 data-bn="${s.h2bn}" data-en="${s.h2en}">${s.h2bn}</h2>
${sectionBody(s)}
      </section>`
  )
  .join("\n\n")}

      <section class="tool-panel">
        <h2 data-bn="এই গাইডের জন্য প্রয়োজনীয় টুল" data-en="Tools for this guide">এই গাইডের জন্য প্রয়োজনীয় টুল</h2>
        <p data-bn="সব ফ্রি, আর কোনো আপলোড ছাড়াই — সরাসরি ব্রাউজারে কাজ করে।" data-en="All free and upload-free — they run straight in your browser.">সব ফ্রি, আর কোনো আপলোড ছাড়াই — সরাসরি ব্রাউজারে কাজ করে।</p>
        <div class="tool-grid">
${toolCards}
        </div>
      </section>

${faqBlock({ faq: post.faq })}

      <section class="section">
        <div class="section-head">
          <h2 data-bn="আরও গাইড" data-en="More guides">আরও গাইড</h2>
        </div>
        <div class="tool-grid">
${others}
        </div>
        <p style="margin-top:16px"><a href="blog.html" data-bn="সব গাইড দেখুন →" data-en="See all guides →">সব গাইড দেখুন →</a></p>
      </section>
    </article>
  </main>

${footer()}

  <script src="js/i18n.js"></script>
  <script src="js/common.js"></script>
</body>
</html>
`;
}

/* ---------- Blog index ---------- */
function blogIndex() {
  const cards = POSTS.map(
    (p) => `          <a class="tool-card" href="${p.slug}">
            <span class="icon" aria-hidden="true">${p.icon}</span>
            <h3 data-bn="${p.h1bn}" data-en="${p.h1en}">${p.h1bn}</h3>
            <p data-bn="${p.subbn}" data-en="${p.suben}">${p.subbn}</p>
            <span class="go" data-bn="পড়ুন →" data-en="Read →">পড়ুন →</span>
          </a>`
  ).join("\n");

  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${pageUrl("blog.html")}#blog`,
    name: "ছবি ফটো গাইড — Photo Guides",
    url: pageUrl("blog.html"),
    inLanguage: ["bn", "en"],
    description: "Practical, bilingual guides to resizing, compressing and preparing photos online.",
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.h1en,
      url: pageUrl(p.slug),
      datePublished: p.date,
      description: p.descEn
    }))
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${DOMAIN}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl("blog.html") }
    ]
  };

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${VERIFY_META}
  <title>${metaTitle(`ছবি ফটো গাইড | Free Photo Editing Guides — ${SITE.en}`)}</title>
  <meta name="description" content="Practical guides to compressing photos, passport photo sizes, image formats and photo privacy. বাংলা ও English গাইড।">
  <meta name="keywords" content="photo editing guide, image tips, ছবি গাইড, photo size guide, image format tutorial">
  <meta name="author" content="${SITE.bn} | ${SITE.en}">
  <meta name="theme-color" content="#0f766e">
  <link rel="canonical" href="${pageUrl("blog.html")}">
  <link rel="alternate" type="application/rss+xml" title="${SITE.en} — Photo Guides" href="${DOMAIN}/feed.xml">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.bn} | ${SITE.en}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="ছবি ফটো গাইড | Photo Editing Guides & Tutorials">
  <meta property="og:description" content="ছবি ছোট করা, পাসপোর্ট সাইজ ও ফরম্যাট — সহজ বাংলা ও ইংরেজি গাইড।">
  <meta property="og:url" content="${pageUrl("blog.html")}">
  <meta property="og:image" content="${DOMAIN}/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Free photo editing guides from ${SITE.en}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ছবি ফটো গাইড | Photo Editing Guides">
  <meta name="twitter:description" content="ছবি ছোট করা, পাসপোর্ট সাইজ ও ফরম্যাট — সহজ গাইড।">
  <meta name="twitter:image" content="${DOMAIN}/og-image.png">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 2)}
  </script>
</head>
<body>

${header()}

  <main>
    <section class="hero">
      <div class="container hero-inner">
        <span class="eyebrow" data-bn="📖 সহজ গাইড, কোনো জটিলতা নয়" data-en="📖 Plain-language guides">📖 সহজ গাইড, কোনো জটিলতা নয়</span>
        <h1>
          <span data-bn="ছবি নিয়ে কাজের গাইড — " data-en="Practical photo guides — ">ছবি নিয়ে কাজের গাইড — </span><span class="accent" data-bn="বাংলা ও ইংরেজি" data-en="Bangla & English">বাংলা ও ইংরেজি</span>
        </h1>
        <p class="lead" data-bn="ছবি ছোট করা, পাসপোর্ট ছবির সাইজ, কোন ফরম্যাট ভালো — সবকিছুর উত্তর সহজ ভাষায়।" data-en="How to shrink a photo, what passport size to use, and which format to pick — answered simply.">ছবি ছোট করা, পাসপোর্ট ছবির সাইজ, কোন ফরম্যাট ভালো — সবকিছুর উত্তর সহজ ভাষায়।</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#guides" data-bn="গাইড দেখুন" data-en="Browse the guides">গাইড দেখুন</a>
          <a class="btn btn-ghost" href="tools.html" data-bn="সব টুল দেখুন" data-en="See all tools">সব টুল দেখুন</a>
        </div>
      </div>
    </section>

    <section class="section" id="guides">
      <div class="container">
        <div class="section-head">
          <h2 data-bn="সব গাইড" data-en="All guides">সব গাইড</h2>
          <p data-bn="${POSTS.length}টি গাইড — প্রতিটিই ব্রাউজারেই ফ্রি।" data-en="${POSTS.length} guides — every one is free and browser-based.">${POSTS.length}টি গাইড — প্রতিটিই ব্রাউজারেই ফ্রি।</p>
          <p><a href="feed.xml" data-bn="নতুন গাইডের RSS ফিড চান? →" data-en="Subscribe via RSS feed →">নতুন গাইডের RSS ফিড চান? →</a></p>
        </div>
        <div class="tool-grid">
${cards}
        </div>
      </div>
    </section>
  </main>

${footer()}

  <script src="js/i18n.js"></script>
  <script src="js/common.js"></script>
</body>
</html>
`;
}

/* ---------- llms.txt ----------
   A plain-text summary so AI assistants can understand and cite the site. */
function llmsTxt() {
  const toolLines = [...TOOLS, ...LEGACY.filter((l) => l.slug !== "index.html")]
    .map((t) => {
      const name = t.en || t.h1en || t.title.split("|")[0].trim();
      const desc = t.descEn || t.shortDescEn || t.title.split("|")[1] || "";
      return `- [${name}](${pageUrl(t.slug)}): ${desc}`;
    })
    .join("\n");

  const postLines = POSTS.map(
    (p) => `- [${p.h1en}](${pageUrl(p.slug)}): ${p.descEn}`
  ).join("\n");

  return `# ${SITE.en} (${SITE.bn})

> Free, bilingual (Bangla + English) online photo tools that run entirely in
> the user's browser using HTML5 Canvas. Photos are never uploaded to a server.
> No account, no watermark, no paid tier. ${TOOLS.length + LEGACY.length - 1} tools
> and ${POSTS.length} written guides. Site UI auto-detects the visitor's
> language and supports Bangla, English, Hindi, Urdu, Arabic, Spanish, French,
> Indonesian, Portuguese, Russian, Turkish and Chinese.

Home: ${DOMAIN}/
All tools: ${pageUrl("tools.html")}
Guides: ${pageUrl("blog.html")}

## Tools
${toolLines}

## Guides
${postLines}

## Key facts
- All processing is client-side; no image is ever uploaded.
- Every tool is free with no sign-up and no watermark on output.
- Bengali and English content is authored in the HTML; other languages are
  translated at runtime.
- Passport photos are generated at 300 DPI (35x45 mm = 413x531 px).
- WhatsApp caps photos at 16 MB; the compress tool targets a specific KB.
`;
}

/* ---------- Sitemap ---------- */
function sitemap() {
  const urls = [
    ...LEGACY.map((l) => ({ loc: cleanPath(l.slug), priority: l.slug === "index.html" ? "1.0" : "0.9" })),
    { loc: cleanPath("tools.html"), priority: "0.9" },
    ...TOOLS.map((t) => ({ loc: cleanPath(t.slug), priority: "0.8" })),
    { loc: cleanPath("blog.html"), priority: "0.8" },
    ...POSTS.map((p) => ({ loc: cleanPath(p.slug), priority: "0.7" }))
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${DOMAIN}${u.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/* ---------- RSS ----------
 * A feed gives search engines a simple, always-fresh list of the guides and
 * makes the blog subscribable, which helps both indexing and returning
 * visitors. */
function rss() {
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const items = POSTS.map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${pageUrl(p.slug)}</link>
      <guid isPermaLink="true">${pageUrl(p.slug)}</guid>
      <pubDate>${new Date(p.date + "T09:00:00Z").toUTCString()}</pubDate>
      <description>${esc(p.descEn)}</description>
      <category>Photo tips</category>
    </item>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${SITE.bn} | ${SITE.en}`)} — Photo Guides</title>
    <link>${pageUrl("blog.html")}</link>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc("Practical bilingual guides on photo size, formats and privacy.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date(LASTMOD + "T09:00:00Z").toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

/* ---------- _redirects ---------- */
/* A page has one canonical address, the clean one, but Netlify serves both
   /compress-image and /compress-image.html with a 200. These rules send the
   .html form onto the canonical so the site stops presenting two live URLs
   for every page.

   Three things about Netlify's redirect engine shape this file, all of them
   found the hard way on production:

   1. The `!` on every status code is a FORCE. Netlify serves an exact-match
      static file before it consults any redirect rule, so a plain 301 next
      to a real compress-image.html is silently ignored — the page keeps
      answering 200. `301!` applies the rule even though the file exists.
   2. This is one rule per page, not one wildcard. Netlify does not allow an
      asterisk in the middle of a path, so there is no valid `/*.html`.
   3. The order of the files decides who wins, which is why 404.html and the
      Search Console token file are left out entirely rather than excepted.

   They are generated from the same page list as the sitemap: a hand-written
   list of thirty redirects rots silently as pages are added.

   404.html is deliberately absent — /404 is not a route, so redirecting it
   would just turn a missing page into a different missing page. So is
   google<token>.html: Search Console fetches that exact filename, and a
   forced redirect would break verification. */
function redirects() {
  const slugs = [
    ...LEGACY.map((l) => l.slug),
    "tools.html",
    ...TOOLS.map((t) => t.slug),
    "blog.html",
    ...POSTS.map((p) => p.slug)
  ];
  const pages = slugs
    .filter((s) => s !== "404.html" && !/^google[A-Za-z0-9]+\.html$/.test(s))
    .sort();

  const rules = pages.map((s) => `/${s}  ${cleanPath(s)}  301!`);

  return `# Generated by scripts/generate.mjs — edit the generator, not this file.
#
# One canonical URL per page. /compress-image is canonical and
# /compress-image.html 301s onto it, because Netlify would otherwise answer
# both with a 200 and split the page's signals across two addresses.
#
# The ! forces the rule to apply even though the .html file exists.
# The list is one rule per page because Netlify has no mid-path wildcard.

${rules.join("\n")}

# The other common spelling of the homepage file.
/index.htm  /  301!
`;
}

/* ---------- Write ---------- */
let count = 0;
for (const tool of TOOLS) {
  writeFileSync(join(ROOT, tool.slug), page(tool), "utf8");
  count++;
}
writeFileSync(join(ROOT, "tools.html"), toolsIndex(), "utf8");
for (const post of POSTS) {
  writeFileSync(join(ROOT, post.slug), blogPost(post), "utf8");
  count++;
}
writeFileSync(join(ROOT, "blog.html"), blogIndex(), "utf8");
writeFileSync(join(ROOT, "llms.txt"), llmsTxt(), "utf8");
writeFileSync(join(ROOT, "sitemap.xml"), sitemap(), "utf8");
writeFileSync(join(ROOT, "feed.xml"), rss(), "utf8");
writeFileSync(join(ROOT, "_redirects"), redirects(), "utf8");

/* Search Console's file-based verification: google<token>.html at the root,
 * containing the full 'google-site-verification=<token>' string. Written at
 * the root so scripts/stage.mjs sweeps it into dist/ with every other page. */
if (VERIFY_FILE) {
  writeFileSync(join(ROOT, VERIFY_FILE), `google-site-verification=${GOOGLE_SITE_VERIFICATION}`, "utf8");
}

/* ---------- Guard ----------
 * Google reads the tag off any page it fetches, and a duplicated tag reads
 * as malformed markup. The generated pages get it from the templates above,
 * but seven pages are maintained by hand — if one of those loses the tag in
 * a later edit, fail the build here rather than at the Search Console
 * "Verify" button. */
if (GOOGLE_SITE_VERIFICATION) {
  const TAG_RE = /<meta name="google-site-verification" content="[^"]+">/g;
  const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html") && f !== VERIFY_FILE);
  const bad = pages.filter(
    (f) => (readFileSync(join(ROOT, f), "utf8").match(TAG_RE) || []).length !== 1
  );
  if (bad.length) {
    console.error(
      `verification tag missing or duplicated on ${bad.length} page(s):\n  - ${bad.join("\n  - ")}`
    );
    process.exit(1);
  }
  console.log(
    `verification tag on all ${pages.length} pages, + ${VERIFY_FILE}`
  );
}

console.log(`Generated ${count} pages + tools.html + blog.html + llms.txt + sitemap.xml + feed.xml + _redirects`);