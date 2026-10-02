/* ============================================================
   Link graph for the hand-written pages
   ------------------------------------------------------------
   Six pages are maintained by hand and are never rewritten by
   scripts/generate.mjs:

     index.html  resize-image.html  compress-image.html
     png-to-jpg.html  crop-image.html  passport-photo.html

   They are also the six most-linked pages on the site, which is
   exactly why it matters that they used to be a closed island:
   between them they linked only to each other and to tools.html,
   so the nine guides and the other thirteen tools were unreachable
   from the pages a visitor is most likely to land on.

   Rather than hand-writing those links and hoping they stay right,
   each file carries a marker pair:

     <!-- linkgraph:start -->  ...  <!-- linkgraph:end -->

   and this script rewrites everything between them from
   scripts/relations.mjs. The prose around the markers stays
   hand-written; the links stay generated. Add a guide to a tool in
   relations.mjs and the right card appears on the core page too.

   Rewriting between markers is idempotent, and a page that is
   missing its markers is reported rather than silently skipped.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { relatedFor, guidesFor, post as postBySlug, assertValid } from "./relations.mjs";
import { allTools, toolCard, guideCard, cards } from "./cards.mjs";
import POSTS from "./posts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const START = "<!-- linkgraph:start -->";
const END = "<!-- linkgraph:end -->";

/* Load the tool configs the same way the generator does. */
const toolsDir = join(ROOT, "scripts", "tools");
const { readdirSync } = await import("node:fs");
let TOOLS = [];
for (const f of readdirSync(toolsDir).filter((x) => x.endsWith(".mjs")).sort()) {
  const mod = await import(join(toolsDir, f));
  TOOLS = TOOLS.concat(mod.default);
}

const ALL = allTools(TOOLS);
assertValid([...ALL.keys()]);

/* ---------- Section builders ---------- */

const relatedSection = (toolSlug, indent) => {
  const picks = relatedFor(toolSlug).map((s) => ALL.get(s)).filter(Boolean);
  if (!picks.length) return "";
  return `${indent}<section class="section">
${indent}  <div class="section-head">
${indent}    <h2 data-bn="এই টুলের সঙ্গে আরও" data-en="Related tools">এই টুলের সঙ্গে আরও</h2>
${indent}    <p data-bn="এই টুলটি যাদের সাথে ভালো মানায়।" data-en="More free tools that pair well with this one.">এই টুলটি যাদের সাথে ভালো মানায়।</p>
${indent}  </div>
${indent}  <div class="tool-grid">
${cards(picks, toolCard, indent + "    ")}
${indent}  </div>
${indent}  <p style="margin-top:16px"><a href="tools.html" data-bn="সব টুল দেখুন →" data-en="See all tools →">সব টুল দেখুন →</a></p>
${indent}</section>`;
};

const guidesSection = (toolSlug, indent, slugs) => {
  const picks = (slugs || guidesFor(toolSlug)).map(postBySlug).filter(Boolean);
  if (!picks.length) return "";
  return `${indent}<section class="section alt">
${indent}  <div class="container">
${indent}    <div class="section-head">
${indent}      <h2 data-bn="এই টুল নিয়ে গাইড" data-en="Guides about this task">এই টুল নিয়ে গাইড</h2>
${indent}      <p data-bn="একই কাজ নিয়ে বিস্তারিত ব্যাখ্যা ও সঠিক সাইজের নিয়ম।" data-en="Step-by-step explanations and the size rules that actually matter.">একই কাজ নিয়ে বিস্তারিত ব্যাখ্যা ও সঠিক সাইজের নিয়ম।</p>
${indent}    </div>
${indent}    <div class="tool-grid">
${cards(picks, guideCard, indent + "      ")}
${indent}    </div>
${indent}    <p style="margin-top:16px"><a href="blog.html" data-bn="সব গাইড দেখুন →" data-en="See all guides →">সব গাইড দেখুন →</a></p>
${indent}  </div>
${indent}</section>`;
};

/* The homepage shows a second row of tools beyond the five it already
   features, then the guides. Without these the homepage could not
   reach thirteen of the nineteen tools or any of the articles. */
const HOME_MORE_TOOLS = [
  "add-border.html",
  "circle-crop.html",
  "batch-image.html",
  "meme-generator.html",
  "image-to-pdf.html",
  "watermark-image.html"
];

const homeBlock = (indent) => {
  const more = HOME_MORE_TOOLS.map((s) => ALL.get(s)).filter(Boolean);
  const allGuides = POSTS.map((p) => p.slug);
  return {
    more: `${indent}<section class="section">
${indent}  <div class="section-head">
${indent}    <h2 data-bn="আরও কিছু ফ্রি টুল" data-en="More free tools">আরও কিছু ফ্রি টুল</h2>
${indent}    <p data-bn="ছবি নিয়ে আরও যেসব কাজ করতে পারেন — সবই ব্রাউজারেই।" data-en="Everything else you can do to a photo, still entirely in your browser.">ছবি নিয়ে আরও যেসব কাজ করতে পারেন — সবই ব্রাউজারেই।</p>
${indent}  </div>
${indent}  <div class="tool-grid">
${cards(more, toolCard, indent + "    ")}
${indent}  </div>
${indent}  <p style="margin-top:16px"><a href="tools.html" data-bn="সব ${ALL.size}টি টুল দেখুন →" data-en="See all ${ALL.size} tools →">সব ${ALL.size}টি টুল দেখুন →</a></p>
${indent}</section>`,
    guides: guidesSection("compress-image", indent, allGuides)
  };
};

/* ---------- Inject ---------- */

const PAGES = [
  { file: "index.html", build: (i) => { const b = homeBlock(i); return [b.more, b.guides].filter(Boolean).join("\n"); } },
  { file: "resize-image.html", build: (i) => [relatedSection("resize-image.html", i), guidesSection("resize-image.html", i)].filter(Boolean).join("\n") },
  { file: "compress-image.html", build: (i) => [relatedSection("compress-image.html", i), guidesSection("compress-image.html", i)].filter(Boolean).join("\n") },
  { file: "png-to-jpg.html", build: (i) => [relatedSection("png-to-jpg.html", i), guidesSection("png-to-jpg.html", i)].filter(Boolean).join("\n") },
  { file: "crop-image.html", build: (i) => [relatedSection("crop-image.html", i), guidesSection("crop-image.html", i)].filter(Boolean).join("\n") },
  { file: "passport-photo.html", build: (i) => [relatedSection("passport-photo.html", i), guidesSection("passport-photo.html", i)].filter(Boolean).join("\n") }
];

const problems = [];
let updated = 0;

for (const { file, build } of PAGES) {
  const path = join(ROOT, file);
  const before = readFileSync(path, "utf8");

  const a = before.indexOf(START);
  const b = before.indexOf(END);
  if (a === -1 || b === -1) {
    problems.push(`${file} has no ${START} / ${END} marker pair`);
    continue;
  }
  if (b < a) {
    problems.push(`${file} has the markers in the wrong order`);
    continue;
  }

  /* Match the indentation of the line the marker sits on. */
  const lineStart = before.lastIndexOf("\n", a) + 1;
  const indent = before.slice(lineStart, a).match(/^\s*/)[0];

  const body = build(indent);
  const after =
    before.slice(0, a + START.length) + "\n" + body + "\n" + indent + before.slice(b);

  if (after !== before) {
    writeFileSync(path, after);
    updated++;
    console.log(`  updated ${file}`);
  }
}

if (problems.length) {
  console.error(`linkgraph: ${problems.length} page(s) could not be updated:\n  - ${problems.join("\n  - ")}`);
  process.exitCode = 1;
} else {
  console.log(`link graph — ${updated} of ${PAGES.length} hand-written pages rewritten`);
}
