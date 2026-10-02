/* ============================================================
   Stage the static site into dist/
   ------------------------------------------------------------
   The site has no framework, so nothing here is "compiled" — but
   static hosts (and the Freebuff hosting builder) expect a build to
   leave servable output somewhere predictable. This copies exactly
   the files a browser needs into dist/, so a deploy never depends
   on the host guessing that the repository root is the site.

   Deliberately excluded: node_modules, .git, .vly-run, scripts/,
   server.js and package.json. dist/ is a pure static artifact.
   ============================================================ */

import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const FILES = [
  "favicon.svg",
  "og-image.svg",
  "og-image.png",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "llms.txt",
  "_headers",
  "_redirects",
  "vercel.json"
];

const DIRS = ["css", "js"];

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

let count = 0;

// Every page in the site root, hand-written and generated alike.
for (const f of readdirSync(ROOT).filter((f) => f.endsWith(".html"))) {
  cpSync(join(ROOT, f), join(DIST, f));
  count++;
}

for (const f of FILES) {
  const src = join(ROOT, f);
  if (existsSync(src)) {
    cpSync(src, join(DIST, f));
    count++;
  } else {
    console.warn(`  ! missing, skipped: ${f}`);
  }
}

for (const d of DIRS) {
  const src = join(ROOT, d);
  if (!existsSync(src)) {
    console.warn(`  ! missing directory, skipped: ${d}/`);
    continue;
  }
  cpSync(src, join(DIST, d), { recursive: true });
  count += readdirSync(src).filter((f) => statSync(join(src, f)).isFile()).length;
}

const html = readdirSync(DIST).filter((f) => f.endsWith(".html")).length;
console.log(`staged ${count} files into dist/ — ${html} HTML pages, ${DIRS.length} asset directories`);
