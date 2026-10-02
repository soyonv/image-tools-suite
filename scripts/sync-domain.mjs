/* ============================================================
   Sync the configured domain into the hand-written files
   ------------------------------------------------------------
   scripts/generate.mjs rewrites the 25 generated pages, the tools
   index, the blog index, the guides, sitemap.xml, feed.xml and
   llms.txt from site.config.json. But six pages and robots.txt are
   maintained by hand and are never rewritten by the generator:

     index.html  resize-image.html  compress-image.html
     png-to-jpg.html  crop-image.html  passport-photo.html
     robots.txt

   Their canonicals, og:url, og:image and JSON-LD @id values are
   literal text in the file. Without this step, changing the domain
   would silently leave those seven files pointing at the old
   address — the worst kind of SEO bug, because it looks done but is
   only half applied.

   It also normalises the URL *form*: on this site the canonical address
   of a page is the clean one (/compress-image), so a canonical written as
   /compress-image.html is corrected here rather than being left to
   rot next to a domain that is already right.

   How it decides what is "ours": any absolute http(s) URL whose host
   is NOT in the external allow-list below. That means it can move
   the site off ANY previous domain, not just the placeholder — so a
   typo in site.config.json is always recoverable with one more build
   instead of a manual find-and-replace. Every host it touches is
   logged so the rewrite is auditable.

   Idempotent: re-running with the domain already applied is a no-op.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const config = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
const DOMAIN = String(process.env.SITE_DOMAIN || config.domain).replace(/\/+$/, "");
const HOST = new URL(DOMAIN).host;

/* Hosts that belong to other people. Never rewritten. */
const EXTERNAL = new Set([
  "schema.org",
  "www.w3.org",
  "w3.org",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "openapi.vercel.sh",
  "vercel.com",
  "github.com",
  "sitemaps.org",
  "google.com",
  "gstatic.com"
]);

/* Work out which pages the generator owns, so anything else is treated
   as hand-written. Mirrors how generate.mjs builds its list, so adding
   a tool or a post needs no change here. */
const toolFiles = readdirSync(join(ROOT, "scripts", "tools")).filter((f) => f.endsWith(".mjs"));
const toolSource = toolFiles.map((f) => readFileSync(join(ROOT, "scripts", "tools", f), "utf8")).join("\n");
const postSource = readFileSync(join(ROOT, "scripts", "posts.mjs"), "utf8");

/* Tool configs store `slug: "add-border.html"` and guide configs store
   `slug: "whatsapp-photo-size.html"` — both already carry the extension.
   The optional group keeps this working if a slug is ever written bare. */
const generated = new Set([
  "tools.html",
  "blog.html",
  ...[...toolSource.matchAll(/slug:\s*"([a-z0-9-]+)(?:\.html)?"/g)].map((m) => `${m[1]}.html`),
  ...[...postSource.matchAll(/slug:\s*"([a-z0-9-]+)(?:\.html)?"/g)].map((m) => `${m[1]}.html`)
]);

if (generated.size < 5) {
  console.warn("  ! warning: could not classify generated pages — falling back to checking every page");
}

const targets = [
  ...readdirSync(ROOT).filter((f) => f.endsWith(".html") && !generated.has(f)),
  "robots.txt"
].filter((f) => existsSync(join(ROOT, f)));

const URL_RE = /(https?:\/\/)([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)(\/[^\s"'<>]*)?/g;

/* Canonical addresses on this site are clean: /compress-image, never
   /compress-image.html. The generated pages get that from
   scripts/generate.mjs; these hand-written pages carry literal URLs, so the
   same normalisation happens here. It runs even when the host is already
   correct, because changing the domain must not be what decides the URL
   form. Only a page path ends in .html, so og-image.png, sitemap.xml and
   feed.xml are left alone. */
const cleanPath = (path) => {
  if (!path) return "";
  if (path === "/index.html" || path === "/index.htm") return "/";
  return path.replace(/\.html$/, "");
};

const touchedHosts = new Map();
let changed = 0;
let hits = 0;

for (const file of targets) {
  const path = join(ROOT, file);
  const before = readFileSync(path, "utf8");

  const after = before.replace(URL_RE, (match, scheme, host, rest) => {
    if (EXTERNAL.has(host)) return match;
    if (host !== HOST) {
      touchedHosts.set(host, (touchedHosts.get(host) || 0) + 1);
      hits++;
    }
    return `${scheme}${HOST}${cleanPath(rest || "")}`;
  });

  if (after !== before) {
    writeFileSync(path, after);
    changed++;
    console.log(`  updated ${file}`);
  }
}

const summary =
  touchedHosts.size === 0
    ? "nothing to change"
    : `replaced ${[...touchedHosts].map(([h, n]) => `${h} (x${n})`).join(", ")}`;

console.log(`domain "${DOMAIN}" — ${summary}; ${changed} file${changed === 1 ? "" : "s"} updated of ${targets.length} checked`);
