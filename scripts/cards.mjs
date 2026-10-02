/* ============================================================
   Card markup, shared by the page generator and the link-graph
   updater that maintains the hand-written pages.
   ------------------------------------------------------------
   Both places render the same "related tools" and "guides" cards.
   Keeping the markup here means the two can never drift, and a
   change to card structure lands on all 32 pages at once.

   These elements carry data-bn / data-en attributes and are filled
   with textContent by js/i18n.js, so they must not contain nested
   markup inside those attributes. Any quote inside a translation
   string has to be a typographic one (" "), never a straight ".
   ============================================================ */

import { LEGACY_TOOLS } from "./legacy.mjs";

export const GENERIC_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2.2"/><path d="m3 17 5-4.5 4 3.5 3.5-3 5.5 5"/></svg>`;

/* Every tool on the site, keyed by slug, so any template can resolve a
   link target — including the five pages the generator never writes. */
export function allTools(TOOLS) {
  const map = new Map();
  for (const t of TOOLS) map.set(t.slug, t);
  for (const l of LEGACY_TOOLS) {
    map.set(l.slug, {
      slug: l.slug,
      h1bn: l.bn,
      h1en: l.en,
      shortDescBn: l.shortDescBn,
      shortDescEn: l.shortDescEn
    });
  }
  return map;
}

export const toolCard = (t, indent = "          ") =>
  `${indent}<a class="tool-card" href="${t.slug}">
${indent}  <span class="icon" aria-hidden="true">${t.icon || GENERIC_ICON}</span>
${indent}  <h3 data-bn="${t.h1bn}" data-en="${t.h1en}">${t.h1bn}</h3>
${indent}  <p data-bn="${t.shortDescBn}" data-en="${t.shortDescEn}">${t.shortDescBn}</p>
${indent}  <span class="go" data-bn="টুল খুলুন →" data-en="Open tool →">টুল খুলুন →</span>
${indent}</a>`;

export const guideCard = (p, indent = "          ") =>
  `${indent}<a class="tool-card guide-card" href="${p.slug}">
${indent}  <span class="icon" aria-hidden="true">${p.icon || GENERIC_ICON}</span>
${indent}  <h3 data-bn="${p.h1bn}" data-en="${p.h1en}">${p.h1bn}</h3>
${indent}  <p data-bn="${p.subbn}" data-en="${p.suben}">${p.subbn}</p>
${indent}  <span class="go" data-bn="গাইড পড়ুন →" data-en="Read the guide →">গাইড পড়ুন →</span>
${indent}</a>`;

export const cards = (list, render, indent) => list.map((x) => render(x, indent)).join("\n");
