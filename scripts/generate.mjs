/**
 * Static page generator — ছবির সহায়ক | Photo Sahayak
 * -------------------------------------------------------------------------
 * Writes each tool page from a small config (scripts/tools/*.mjs) plus the
 * all-tools index (tools.html) and sitemap.xml.
 *
 * Output is committed to the repo, so deployment still needs NO build step.
 * Run after editing any tool config:   node scripts/generate.mjs
 */
import { writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOMAIN = "https://example.com";
const LASTMOD = "2026-10-01";

/* ---------- Load configs ---------- */
const toolsDir = join(ROOT, "scripts", "tools");
const files = readdirSync(toolsDir).filter((f) => f.endsWith(".mjs")).sort();
let TOOLS = [];
for (const f of files) {
  const mod = await import(join(toolsDir, f));
  TOOLS = TOOLS.concat(mod.default);
}

/* Pages that already exist and are hand-written (kept out of the generator) */
const LEGACY = [
  { slug: "index.html", title: "ছবির সহায়ক — অনলাইন ফটো টুলস | Resize, Compress, Convert Image Free" },
  { slug: "resize-image.html", title: "ছবির সাইজ পরিবর্তন | Resize Image Online Free" },
  { slug: "compress-image.html", title: "ছবির সাইজ কমান | Compress Image Online Free" },
  { slug: "png-to-jpg.html", title: "PNG to JPG কনভার্টার | Convert Image PNG ↔ JPG ↔ WebP Free" },
  { slug: "crop-image.html", title: "ছবি কাটুন | Crop Image Online Free" },
  { slug: "passport-photo.html", title: "পাসপোর্ট সাইজ ছবি তৈরি | Passport Size Photo Maker Free" }
];

const NAV = [
  { href: "index.html", bn: "হোম", en: "Home" },
  { href: "resize-image.html", bn: "সাইজ পরিবর্তন", en: "Resize" },
  { href: "compress-image.html", bn: "ছবি কমান", en: "Compress" },
  { href: "png-to-jpg.html", bn: "ফরম্যাট", en: "Convert" },
  { href: "crop-image.html", bn: "ক্রপ", en: "Crop" },
  { href: "passport-photo.html", bn: "পাসপোর্ট", en: "Passport" },
  { href: "tools.html", bn: "সব টুল", en: "All tools" }
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
        <span>© <span id="year">2026</span> ছবির সহায়ক | <span data-bn="সর্বস্বত্ব সংরক্ষিত" data-en="All rights reserved">সর্বস্বত্ব সংরক্ষিত</span></span>
        <span data-bn="ভালোবাসা দিয়ে তৈরি — বাংলাদেশের জন্য 🇧🇩" data-en="Made with love — for everyone 🌍">ভালোবাসা দিয়ে তৈরি — বাংলাদেশের জন্য 🇧🇩</span>
      </div>
    </div>
  </footer>`;
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

const stepsBlock = (tool) => `      <section class="section">
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
  const url = `${DOMAIN}/${tool.slug}`;
  const scripts = ["js/common.js", ...(tool.scripts || [])]
    .map((s) => `  <script src="${s}"></script>`)
    .join("\n");

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.h1bn} — ${tool.h1en}`,
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript and HTML5 Canvas",
    inLanguage: ["bn", "en"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.descEn
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tool.title}</title>
  <meta name="description" content="${tool.desc}">
  <meta name="keywords" content="${tool.keywords}">
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.bn}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="${tool.title}">
  <meta property="og:description" content="${tool.desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${DOMAIN}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tool.title}">
  <meta name="twitter:description" content="${tool.desc}">

  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">

  <script type="application/ld+json">
${JSON.stringify(webApp, null, 2)}
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
            <h3>${l.title.split("|")[0].trim()}</h3>
            <p data-bn="ব্রাউজারেই কাজ হয় — কোনো আপলোড নেই।" data-en="Runs in your browser — nothing is uploaded.">ব্রাউজারেই কাজ হয় — কোনো আপলোড নেই।</p>
            <span class="go" data-bn="টুল খুলুন →" data-en="Open tool →">টুল খুলুন →</span>
          </a>`
    )
    .join("\n");

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "সব ফটো টুল — All Photo Tools",
    url: `${DOMAIN}/tools.html`,
    inLanguage: ["bn", "en"],
    description: "Complete list of free browser-based image tools."
  };

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>সব ফটো টুল | All Free Online Image Tools — ছবির সহায়ক</title>
  <meta name="description" content="রিসাইজ, কম্প্রেস, কনভার্ট, ক্রপ, ওয়াটারমার্ক, ফিল্টার, পাসপোর্ট, PDF, ICO, কালার পিকার — সব ফ্রি অনলাইন ইমেজ টুল। All free browser-based image tools in one place — no upload.">
  <link rel="canonical" href="${DOMAIN}/tools.html">
  <meta name="robots" content="index, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE.bn}">
  <meta property="og:locale" content="bn_BD">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:title" content="সব ফটো টুল | All Free Online Image Tools">
  <meta property="og:description" content="সব ফ্রি অনলাইন ইমেজ টুল — ব্রাউজারেই কাজ হয়, কোনো আপলোড নেই।">
  <meta property="og:url" content="${DOMAIN}/tools.html">
  <meta property="og:image" content="${DOMAIN}/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
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

  <script src="js/common.js"></script>
</body>
</html>
`;
}

/* ---------- Sitemap ---------- */
function sitemap() {
  const urls = [
    ...LEGACY.map((l) => ({ loc: l.slug, priority: l.slug === "index.html" ? "1.0" : "0.9" })),
    { loc: "tools.html", priority: "0.9" },
    ...TOOLS.map((t) => ({ loc: t.slug, priority: "0.8" }))
  ];
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${DOMAIN}/${u.loc}</loc>
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

/* ---------- Write ---------- */
let count = 0;
for (const tool of TOOLS) {
  writeFileSync(join(ROOT, tool.slug), page(tool), "utf8");
  count++;
}
writeFileSync(join(ROOT, "tools.html"), toolsIndex(), "utf8");
writeFileSync(join(ROOT, "sitemap.xml"), sitemap(), "utf8");
console.log(`Generated ${count} tool pages + tools.html + sitemap.xml`);