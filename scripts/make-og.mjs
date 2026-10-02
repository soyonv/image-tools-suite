/* ============================================================
   Social share card — 1200x630 PNG, written with zero dependencies.
   ------------------------------------------------------------
   Why this exists: the previous og:image was an SVG. Facebook,
   WhatsApp, X/Twitter, LinkedIn and every chat preview renderer
   refuse SVG, so every shared link rendered with no picture at
   all. This writes a real raster PNG instead.

   Node ships zlib, so a valid PNG is: signature + IHDR + IDAT
   (zlib-deflated scanlines) + IEND, each chunk length-prefixed and
   CRC32-suffixed. No canvas, no native module, no install step.

   The artwork is drawn with signed distance fields and 2x
   supersampling, which gives clean antialiased edges without any
   graphics library.
   ============================================================ */

import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "og-image.png");

const W = 1200;
const H = 630;
const SS = 2; // supersample factor

/* ---------- PNG encoding ---------- */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgb) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour RGB
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  // Prefix every scanline with filter type 0 (None).
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

/* ---------- signed distance helpers ---------- */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function sdRoundRect(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r;
  const qy = Math.abs(py - cy) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function sdCircle(px, py, cx, cy, r) {
  return Math.hypot(px - cx, py - cy) - r;
}

function sdSegment(px, py, ax, ay, bx, by) {
  const pax = px - ax;
  const pay = py - ay;
  const bax = bx - ax;
  const bay = by - ay;
  const h = clamp((pax * bax + pay * bay) / (bax * bax + bay * bay), 0, 1);
  return Math.hypot(pax - bax * h, pay - bay * h);
}

/* ---------- geometric wordmark ----------
   Eight glyphs drawn as capsules and rings, on a cap-height-100 grid
   with the baseline at y=100. This is a stencil-style geometric sans:
   legible at share-card size and completely font-file free. */

const GLYPHS = {
  P: { w: 62, s: [[0, 0, 0, 100], [0, 0, 40, 0], [40, 0, 40, 45], [40, 45, 0, 45]] },
  H: { w: 68, s: [[0, 0, 0, 100], [68, 0, 68, 100], [0, 50, 68, 50]] },
  O: { w: 74, ring: [37, 50, 37] },
  T: { w: 66, s: [[0, 0, 66, 0], [33, 0, 33, 100]] },
  S: {
    w: 64,
    s: [[64, 0, 0, 0], [0, 0, 0, 50], [0, 50, 64, 50], [64, 50, 64, 100], [64, 100, 0, 100]]
  },
  A: { w: 72, s: [[0, 100, 36, 0], [36, 0, 72, 100], [16, 68, 56, 68]] },
  Y: { w: 70, s: [[0, 0, 35, 46], [70, 0, 35, 46], [35, 46, 35, 100]] },
  K: { w: 68, s: [[0, 0, 0, 100], [0, 52, 68, 0], [0, 52, 68, 100]] },
  " ": { w: 34, s: [] }
};

const WORD = "PHOTO SAHAYAK";
const CAP = 62; // cap height in final pixels
const TRACK = 9; // letter spacing in cap-height units (out of 100)

function layout(word) {
  const k = CAP / 100;
  const track = TRACK * k;
  let total = 0;
  for (const ch of word) total += (GLYPHS[ch]?.w ?? 0) * k + track;
  total -= track;
  return { k, track, total };
}

function drawWord(px, py, word, cx, baselineY, color, alphaScale) {
  const { k, track, total } = layout(word);
  const stroke = 11 * (CAP / 100) + 3;
  let x = cx - total / 2;
  const out = [];
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (g) {
      for (const [ax, ay, bx, by] of g.s || []) {
        out.push({ kind: "seg", ax: x + ax * k, ay: baselineY - (100 - ay) * k, bx: x + bx * k, by: baselineY - (100 - by) * k, r: stroke / 2 });
      }
      if (g.ring) {
        const [rx, ry, rr] = g.ring;
        out.push({ kind: "ring", cx: x + rx * k, cy: baselineY - (100 - ry) * k, r: rr * k, t: stroke / 2 });
      }
    }
    x += (g?.w ?? 0) * k + track;
  }
  return { shapes: out, alphaScale };
}

/* ---------- composite ---------- */

const TEAL_DEEP = [8, 46, 44];
const TEAL = [15, 84, 80];
const TEAL_LIGHT = [22, 122, 114];
const GOLD = [240, 180, 41];
const WHITE = [255, 255, 255];

const CW = W * SS;
const CH = H * SS;
const buf = Buffer.alloc(CW * CH * 3);

// Mark geometry (supersampled units)
const markCx = CW / 2;
const markCy = CH * 0.415;
const frameHalf = 150 * SS;
const frameR = 46 * SS;
const frameStroke = 17 * SS;

const word = drawWord(0, 0, WORD, markCx, CH * 0.795, WHITE, 1);
const goldRule = {
  kind: "seg",
  ax: markCx - 70 * SS,
  ay: CH * 0.875,
  bx: markCx + 70 * SS,
  by: CH * 0.875,
  r: 4 * SS
};

for (let y = 0; y < CH; y++) {
  const fy = y / CH;
  for (let x = 0; x < CW; x++) {
    const i = (y * CW + x) * 3;

    // Diagonal teal gradient with a soft radial lift behind the mark.
    const t = clamp((x / CW) * 0.45 + fy * 0.55, 0, 1);
    let r = TEAL_DEEP[0] + (TEAL[0] - TEAL_DEEP[0]) * t;
    let g = TEAL_DEEP[1] + (TEAL[1] - TEAL_DEEP[1]) * t;
    let b = TEAL_DEEP[2] + (TEAL[2] - TEAL_DEEP[2]) * t;

    const glow = clamp(1 - Math.hypot(x - markCx, y - markCy) / (CW * 0.46), 0, 1);
    const gi = glow * glow * 0.5;
    r += (TEAL_LIGHT[0] - r) * gi;
    g += (TEAL_LIGHT[1] - g) * gi;
    b += (TEAL_LIGHT[2] - b) * gi;

    const mix = (col, cov) => {
      if (cov <= 0) return;
      const a = Math.min(1, cov);
      r += (col[0] - r) * a;
      g += (col[1] - g) * a;
      b += (col[2] - b) * a;
    };

    // App frame: rounded square outline.
    mix(
      WHITE,
      clamp(0.5 - (sdRoundRect(x, y, markCx, markCy, frameHalf, frameHalf, frameR) - frameStroke / 2), 0, 1)
    );

    // Sun / lens.
    mix(GOLD, clamp(0.5 - sdCircle(x, y, markCx - 58 * SS, markCy - 52 * SS, 27 * SS), 0, 1));

    // Mountain ridge.
    const ridge = Math.min(
      sdSegment(x, y, markCx - 112 * SS, markCy + 88 * SS, markCx - 26 * SS, markCy - 18 * SS),
      sdSegment(x, y, markCx - 26 * SS, markCy - 18 * SS, markCx + 34 * SS, markCy + 26 * SS),
      sdSegment(x, y, markCx + 34 * SS, markCy + 26 * SS, markCx + 112 * SS, markCy - 40 * SS)
    );
    mix(WHITE, clamp(0.5 - (ridge - 8.5 * SS), 0, 1));

    // Wordmark.
    for (const s of word.shapes) {
      const d =
        s.kind === "seg"
          ? sdSegment(x, y, s.ax, s.ay, s.bx, s.by) - s.r
          : Math.abs(sdCircle(x, y, s.cx, s.cy, s.r)) - s.t;
      mix(WHITE, clamp(0.5 - d, 0, 1));
    }

    // Gold accent rule.
    mix(GOLD, clamp(0.5 - (sdSegment(x, y, goldRule.ax, goldRule.ay, goldRule.bx, goldRule.by) - goldRule.r), 0, 1));

    buf[i] = clamp(Math.round(r), 0, 255);
    buf[i + 1] = clamp(Math.round(g), 0, 255);
    buf[i + 2] = clamp(Math.round(b), 0, 255);
  }
}

// Box-downsample the supersampled buffer.
const out = Buffer.alloc(W * H * 3);
const n = SS * SS;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let r = 0, g = 0, b = 0;
    for (let dy = 0; dy < SS; dy++) {
      for (let dx = 0; dx < SS; dx++) {
        const i = ((y * SS + dy) * CW + (x * SS + dx)) * 3;
        r += buf[i];
        g += buf[i + 1];
        b += buf[i + 2];
      }
    }
    const o = (y * W + x) * 3;
    out[o] = Math.round(r / n);
    out[o + 1] = Math.round(g / n);
    out[o + 2] = Math.round(b / n);
  }
}

const png = encodePNG(W, H, out);
writeFileSync(OUT, png);
console.log(`og-image.png written — ${W}x${H}, ${(png.length / 1024).toFixed(1)} KB`);
