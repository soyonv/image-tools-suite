/* ============================================================
   Internal link graph — the relations between pages
   ------------------------------------------------------------
   Before this file, "related tools" was picked by array position
   (the next three tools in the config), which meant crop-image
   claimed passport-photo, tools.html and blog.html were related to
   it. Those links existed, but they meant nothing, so they passed
   crawlability while carrying no topical signal.

   Two relations are defined here:

     RELATED  tool -> tools that genuinely pair with it
     GUIDES    tool -> the guides that actually cover it

   GUIDES is not hand-written. Every guide already lists the tools it
   teaches in posts.mjs (`tools: [...]`), so we invert that map. The
   two files therefore cannot drift apart, and a new guide becomes
   linked from its tools automatically the moment it is added.

   Anything a guide does not cover is filled in by FALLBACK_GUIDES,
   chosen by subject rather than at random, so no tool page is ever
   left without a way into the blog.
   ============================================================ */

import POSTS from "./posts.mjs";

/* ---------- Tool -> tool, grouped by what a visitor is actually doing ---------- */
export const RELATED = {
  "resize-image.html": ["compress-image.html", "batch-image.html", "crop-image.html"],
  "compress-image.html": ["resize-image.html", "png-to-jpg.html", "batch-image.html"],
  "png-to-jpg.html": ["compress-image.html", "image-to-pdf.html", "ico-converter.html"],
  "crop-image.html": ["circle-crop.html", "rotate-flip.html", "passport-photo.html"],
  "passport-photo.html": ["crop-image.html", "add-border.html", "circle-crop.html"],
  "add-border.html": ["passport-photo.html", "circle-crop.html", "rotate-flip.html"],
  "circle-crop.html": ["crop-image.html", "add-border.html", "passport-photo.html"],
  "meme-generator.html": ["png-to-jpg.html", "watermark-image.html", "compress-image.html"],
  "image-to-pdf.html": ["png-to-jpg.html", "batch-image.html", "compress-image.html"],
  "batch-image.html": ["resize-image.html", "compress-image.html", "png-to-jpg.html"],
  "rotate-flip.html": ["crop-image.html", "add-border.html", "adjust-image.html"],
  "adjust-image.html": ["compare-image.html", "watermark-image.html", "rotate-flip.html"],
  "compare-image.html": ["adjust-image.html", "rotate-flip.html", "compress-image.html"],
  "strip-metadata.html": ["compress-image.html", "png-to-jpg.html", "base64-encoder.html"],
  "favicon-generator.html": ["ico-converter.html", "resize-image.html", "base64-encoder.html"],
  "ico-converter.html": ["favicon-generator.html", "png-to-jpg.html", "resize-image.html"],
  "base64-encoder.html": ["strip-metadata.html", "favicon-generator.html", "png-to-jpg.html"],
  "color-picker.html": ["adjust-image.html", "circle-crop.html", "add-border.html"],
  "watermark-image.html": ["adjust-image.html", "meme-generator.html", "compress-image.html"]
};

/* ---------- Guides for tools no guide currently covers ----------
   Nine tools have no guide pointing at them yet. Rather than leave
   those pages as dead ends into the blog, each is matched to a guide
   a reader of that tool would plausibly want next. */
const FALLBACK_GUIDES = {
  "meme-generator.html": ["instagram-photo-size.html", "jpeg-vs-png-quality.html"],
  "image-to-pdf.html": ["passport-photo-size-guide.html", "how-to-compress-image-for-online-form.html"],
  "batch-image.html": ["how-to-compress-image-for-online-form.html", "instagram-photo-size.html"],
  "rotate-flip.html": ["passport-photo-size-guide.html"],
  "favicon-generator.html": ["webp-vs-jpg-vs-png.html"],
  "ico-converter.html": ["webp-vs-jpg-vs-png.html"],
  "base64-encoder.html": ["webp-vs-jpg-vs-png.html"],
  "color-picker.html": ["remove-photo-background-online.html", "instagram-photo-size.html"],
  "watermark-image.html": ["remove-photo-location-before-posting.html", "instagram-photo-size.html"]
};

/* How many guide cards a tool page shows. Three keeps the section
   scannable; the rest of the mapping still points at the guides. */
export const GUIDES_PER_TOOL = 3;

/* ---------- Invert posts.mjs: tool -> guides ---------- */
const byTool = new Map();
for (const post of POSTS) {
  for (const tool of post.tools || []) {
    if (!byTool.has(tool)) byTool.set(tool, []);
    byTool.get(tool).push(post.slug);
  }
}

export const GUIDES = {};
for (const [tool, slugs] of byTool) GUIDES[tool] = slugs;
for (const [tool, slugs] of Object.entries(FALLBACK_GUIDES)) {
  GUIDES[tool] = [...(GUIDES[tool] || []), ...slugs];
}

/* ---------- Lookups the page templates use ---------- */

const POST_BY_SLUG = new Map(POSTS.map((p) => [p.slug, p]));

export const post = (slug) => POST_BY_SLUG.get(slug) || null;

export const guidesFor = (toolSlug) => (GUIDES[toolSlug] || []).slice(0, GUIDES_PER_TOOL);

export const relatedFor = (toolSlug) => RELATED[toolSlug] || [];

/* Guides that should reach a particular tool, used to give a guide
   page a "other tools" rail without repeating its own tools array. */
export function guidesMentioning(toolSlug) {
  return POSTS.filter((p) => (p.tools || []).includes(toolSlug)).map((p) => p.slug);
}

/* ---------- Fail loudly on a typo ----------
   A misspelled slug here would produce a link to a page that does not
   exist. Catching it at build time is far cheaper than finding it in
   a crawl report weeks later. */
export function assertValid(toolSlugs) {
  const tools = new Set(toolSlugs);
  const guides = new Set(POSTS.map((p) => p.slug));
  const problems = [];

  for (const [tool, list] of Object.entries(RELATED)) {
    if (!tools.has(tool)) problems.push(`RELATED key "${tool}" is not a known tool`);
    for (const t of list) if (!tools.has(t)) problems.push(`RELATED["${tool}"] -> "${t}" is not a known tool`);
  }
  for (const [tool, list] of Object.entries(GUIDES)) {
    if (!tools.has(tool)) problems.push(`GUIDES key "${tool}" is not a known tool`);
    for (const g of list) if (!guides.has(g)) problems.push(`GUIDES["${tool}"] -> "${g}" is not a known guide`);
  }

  const orphans = toolSlugs.filter((t) => !GUIDES[t]);
  if (orphans.length) problems.push(`tools with no guide link at all: ${orphans.join(", ")}`);

  if (problems.length) {
    throw new Error(`relations.mjs is out of date:\n  - ${problems.join("\n  - ")}`);
  }
}
