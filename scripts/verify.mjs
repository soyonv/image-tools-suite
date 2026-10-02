/* ============================================================
   Verify the built site in dist/
   ------------------------------------------------------------
   `npm run build` already fails if a *source* page is missing the
   Google Search Console tag or carries it twice. This checks the
   artefact that actually ships: that dist/ holds every page, that
   each one is tagged exactly once inside <head>, and that the
   google<token>.html file Search Console can be pointed at is
   there with byte-exact content.

   Zero dependencies, so it is identical locally and in CI:

       npm run build && npm run verify

   Exits 1 on the first category of problem it finds, printing
   every offending file so one run tells you everything.
   ============================================================ */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const site = JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
/* Same normalisation the generator does, so the two never disagree. */
const TOKEN = String(site.verification?.google || "")
  .trim()
  .replace(/^google-site-verification=/, "")
  .trim();
const VERIFY_FILE = TOKEN ? `google${TOKEN}.html` : "";

const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(DIST)) {
  console.error("verify: dist/ does not exist — run `npm run build` first");
  process.exit(1);
}

/* Every source page must have been staged, byte for byte. */
const source = readdirSync(ROOT).filter((f) => f.endsWith(".html") && f !== VERIFY_FILE);
const missing = source.filter((f) => !existsSync(join(DIST, f)));
if (missing.length) fail(`${missing.length} page(s) never reached dist/: ${missing.join(", ")}`);

const drift = source.filter(
  (f) =>
    existsSync(join(DIST, f)) &&
    readFileSync(join(ROOT, f), "utf8") !== readFileSync(join(DIST, f), "utf8")
);
if (drift.length) fail(`${drift.length} page(s) differ between the root and dist/: ${drift.join(", ")}`);

/* The verification tag: present once per page, and inside <head>. */
if (TOKEN) {
  const TAG = `<meta name="google-site-verification" content="${TOKEN}">`;
  const untagged = [];
  const outside = [];

  for (const f of source) {
    if (!existsSync(join(DIST, f))) continue;
    const html = readFileSync(join(DIST, f), "utf8");
    const hits = html.split(TAG).length - 1;
    if (hits !== 1) {
      untagged.push(`${f} (${hits})`);
      continue;
    }
    const head = html.indexOf("<head>");
    const headEnd = html.indexOf("</head>");
    const at = html.indexOf(TAG);
    if (head === -1 || headEnd === -1 || at < head || at > headEnd) outside.push(f);
  }

  if (untagged.length) fail(`tag count != 1 on ${untagged.length} page(s): ${untagged.join(", ")}`);
  if (outside.length) fail(`tag outside <head> on: ${outside.join(", ")}`);

  /* Search Console's file-based proof. */
  const vf = join(DIST, VERIFY_FILE);
  if (!existsSync(vf)) {
    fail(`${VERIFY_FILE} is missing from dist/`);
  } else if (readFileSync(vf, "utf8") !== `google-site-verification=${TOKEN}`) {
    fail(`${VERIFY_FILE} does not contain the token exactly`);
  }
} else {
  console.log("verify: no verification.google in site.config.json — tag checks skipped");
}

const pages = source.length;

/* One canonical address per page, and it is the clean one. Netlify answers
   both /compress-image and /compress-image.html with a 200, so a canonical
   that keeps the .html form leaves two live URLs per page. */
const htmlish = source.filter((f) => f !== "404.html");
const notClean = [];
const duplicated = [];

for (const f of htmlish) {
  if (!existsSync(join(DIST, f))) continue;
  const html = readFileSync(join(DIST, f), "utf8");
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canonicals.length !== 1) {
    duplicated.push(`${f} (${canonicals.length})`);
    continue;
  }
  if (/\/index\.html?$/.test(canonicals[0]) || /\.html?$/.test(canonicals[0])) notClean.push(canonicals[0]);
}
if (duplicated.length) fail(`page(s) without exactly one canonical: ${duplicated.join(", ")}`);
if (notClean.length) fail(`canonical still points at a .html URL: ${notClean.join(", ")}`);

/* _redirects sends the .html form onto the canonical, but the Search Console
   token file must survive that wildcard — Google fetches that exact name. */
if (TOKEN && existsSync(join(DIST, "_redirects"))) {
  const redirects = readFileSync(join(DIST, "_redirects"), "utf8");
  if (!redirects.includes(VERIFY_FILE)) {
    fail(`_redirects has no pass-through for ${VERIFY_FILE}; the .html -> clean wildcard would redirect it away`);
  }
}

if (problems.length) {
  console.error(`verify: ${problems.length} problem(s)\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}

console.log(
  `verify: dist/ OK — ${pages} pages with one clean canonical each${
    TOKEN ? `, tagged for Search Console, ${VERIFY_FILE} present` : ""
  }`
);