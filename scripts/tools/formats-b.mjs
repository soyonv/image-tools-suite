/** Tool configs: base64 data URI, colour picker */
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const dropzone = (iconPaths, titleBn, titleEn, hintBn, hintEn) => `        <div class="dropzone" id="dropzone" tabindex="0" role="button">
          ${icon(iconPaths).replace('<svg', '<svg class="dz-icon"')}
          <div class="dz-title" data-bn="${titleBn}" data-en="${titleEn}">${titleBn}</div>
          <div class="dz-hint" data-bn="${hintBn}" data-en="${hintEn}">${hintBn}</div>
          <input type="file" id="fileInput" accept="image/*">
        </div>`;

const B64_PATH = '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>';
const PAL_PATH = '<path d="M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 21z"/><circle cx="7.5" cy="12" r="1.2"/><circle cx="9.5" cy="8" r="1.2"/><circle cx="14" cy="7.5" r="1.2"/><circle cx="17" cy="11" r="1.2"/>';

export default [
  {
    slug: "base64-encoder.html",
    title: "ছবি থেকে Base64 | Image to Base64 Data URI Converter Online Free",
    desc: "ছবিকে Base64 ডেটা URI-তে রূপান্তর করুন এবং কোড কপি করুন — CSS বা HTML-এ সরাসরি বসানোর জন্য। Convert an image to a Base64 data URI and copy the code for use in CSS or HTML — free, no upload.",
    descEn: "Convert any image into a Base64 data URI, copy the string, and embed it directly in HTML or CSS. Free browser-based tool — nothing is uploaded.",
    keywords: "image to base64, base64 data uri, ছবি থেকে base64, embed image in css",
    h1bn: "ছবি থেকে Base64 কোড (Image to Base64)",
    h1en: "Image to Base64 Data URI",
    subbn: "ছবি আপলোড না করেই তার Base64 ডেটা URI বানান — CSS ও HTML-এ সরাসরি বসানোর জন্য।",
    suben: "Generate the Base64 data URI of your image locally so you can paste it straight into CSS or HTML.",
    shortBn: "Base64 কোড",
    shortEn: "Base64",
    shortDescBn: "ছবির Base64 ডেটা URI বানিয়ে কোড কপি করুন।",
    shortDescEn: "Create and copy a Base64 data URI for any image.",
    icon: icon(B64_PATH),
    scripts: ["js/base64.js"],
    panel: `      <section class="tool-panel" aria-label="Base64 encoder">
${dropzone(B64_PATH, "ছবি এখানে ড্র্যাগ করুন", "Drag your image here", "অথবা ক্লিক করে ফাইল বাছুন", "Or click to choose a file")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><img id="previewImg" alt="Image preview"></div>
          <div class="field">
            <label for="dataUri" data-bn="ডেটা URI" data-en="Data URI">ডেটা URI</label>
            <textarea id="dataUri" rows="6" readonly style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.8rem;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm)"></textarea>
            <div class="hint" id="sizeHint"></div>
          </div>
          <div class="field">
            <label for="cssSnippet" data-bn="CSS" data-en="CSS">CSS</label>
            <textarea id="cssSnippet" rows="3" readonly style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.8rem;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm)"></textarea>
          </div>
          <div class="field">
            <label for="htmlSnippet" data-bn="HTML" data-en="HTML">HTML</label>
            <textarea id="htmlSnippet" rows="3" readonly style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.8rem;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm)"></textarea>
          </div>
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="copyUriBtn" data-bn="ডেটা URI কপি করুন" data-en="Copy data URI">ডেটা URI কপি করুন</button>
            <button type="button" class="btn btn-ghost" id="copyCssBtn" data-bn="CSS কপি করুন" data-en="Copy CSS">CSS কপি করুন</button>
            <button type="button" class="btn btn-ghost" id="copyHtmlBtn" data-bn="HTML কপি করুন" data-en="Copy HTML">HTML কপি করুন</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add an image", sbn: "যে ছবিটি রূপান্তর করতে চান সেটি বাছুন।", sen: "Choose the image to convert." },
      { bn: "২. কোড কপি করুন", en: "2. Copy the code", sbn: "ডেটা URI, CSS বা HTML কোড কপি বোতামে চাপ দিন।", sen: "Tap copy on the data URI, CSS or HTML box." },
      { bn: "৩. ব্যবহার করুন", en: "3. Use it", sbn: "কোডটি আপনার ওয়েবসাইট বা ইমেইলে বসিয়ে দিন।", sen: "Paste the code into your website or email template." }
    ],
    faq: [
      { qbn: "Base64 কি ছবির সাইজ কমায়?", qen: "Does Base64 make the image smaller?", abn: "না, উল্টে — ডেটা URI সাধারণত আসল ফাইলের ৩৩% বেশি জায়গা নেয়। তাই বড় ছবির জন্য ফাইল পাথাই ভালো।", aen: "No — a data URI is usually about 33% larger than the file itself, so keep file paths for big images.", },
      { qbn: "কখন Base64 ব্যবহার করব?", qen: "When should I use Base64?", abn: "ছোট আইকন, ইমেইল টেমপ্লেট বা CSS-এ ছোট ছবি বসানোর সময় — ফাইল আলাদা রাখতে হয় না।", aen: "For small icons, email templates, or embedding tiny images in CSS without extra file requests.", },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the image uploaded?", abn: "কখনোই না — পুরু ফাইল পড়া আপনার ব্রাউজারেই হয়।", aen: "Never — the file is read entirely inside your browser.", },
      { qbn: "বড় ছবির জন্য কী করব?", qen: "What about large images?", abn: "ছবির সাইজ কমাতে রিসাইজ বা কম্প্রেস টুল ব্যবহার করুন, তারপর Base64 করুন।", aen: "Resize or compress the image first, then convert it to Base64.", }
    ]
  },

  {
    slug: "color-picker.html",
    title: "ছবি থেকে রং বের করুন | Image Color Picker — Palette Extractor Free",
    desc: "ছবির প্রধান রং বের করে HEX কোড কপি করুন বা পুরো কালার প্যালেট দেখুন — ডিজাইন ও প্রিন্টের জন্য। Pick colours from any photo, copy HEX codes and view the full palette — free, browser-based.",
    descEn: "Pick colours from any photo, copy HEX codes, and view the dominant palette — useful for design and print. Free, no upload.",
    keywords: "color picker image, palette extractor, dominant color, ছবি থেকে রং, hex color code picker",
    h1bn: "ছবি থেকে রং বের করুন (Color Picker)",
    h1en: "Image Color Picker & Palette",
    subbn: "ছবিতে ক্লিক করে নির্দিষ্ট রং, অথবা পুরো ছবির কালার প্যালেট দেখুন — সব HEX কোড কপি করা যায়।",
    suben: "Click a photo to sample an exact colour, or extract the whole dominant palette — every HEX code is copyable.",
    shortBn: "রং পিকার",
    shortEn: "Color picker",
    shortDescBn: "ছবি থেকে HEX রং বের করে কপি করুন।",
    shortDescEn: "Sample HEX colours straight from a photo.",
    icon: icon(PAL_PATH),
    scripts: ["js/palette.js"],
    panel: `      <section class="tool-panel" aria-label="Color picker">
${dropzone(PAL_PATH, "ছবি এখানে ড্র্যাগ করুন", "Drop an image here", "অথবা ক্লিক করে ফাইল বাছুন", "Or click to choose a file")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame">
            <canvas id="canvas" style="cursor:crosshair;touch-action:none"></canvas>
          </div>
          <div class="field">
            <label for="pickedHex" data-bn="নির্বাচিত রং" data-en="Picked colour">নির্বাচিত রং</label>
            <div class="chip-row">
              <span id="pickedSwatch" style="width:44px;height:44px;border-radius:10px;border:1px solid var(--border);display:inline-block"></span>
              <input type="text" id="pickedHex" readonly value="#000000" style="max-width:140px;font-family:ui-monospace,Menlo,monospace">
              <button type="button" class="chip" id="copyPickedBtn" data-bn="কপি করুন" data-en="Copy">কপি করুন</button>
            </div>
            <div class="hint" data-bn="ছবির উপর ক্লিক বা আঙুল দিয়ে ট্যাপ করে যেকোনো বিন্দুর রং দেখুন।" data-en="Click or tap anywhere on the image to sample that pixel.">ছবির উপর ক্লিক বা আঙুল দিয়ে ট্যাপ করে যেকোনো বিন্দুর রং দেখুন।</div>
          </div>
          <div>
            <span class="field-label" data-bn="কালার প্যালেট" data-en="Colour palette">কালার প্যালেট</span>
            <div class="chip-row" id="paletteRow"></div>
          </div>
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="copyPaletteBtn" data-bn="সব HEX কোড কপি করুন" data-en="Copy all HEX codes">সব HEX কোড কপি করুন</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি ছবি বাছুন" data-en="Choose another image">আরেকটি ছবি বাছুন</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add an image", sbn: "যে ছবি থেকে রং নিতে চান সেটি বাছুন।", sen: "Choose the image to sample." },
      { bn: "২. রং বেছে নিন", en: "2. Pick a colour", sbn: "ছবিতে ক্লিক করলে সেই বিন্দুর HEX কোড দেখাবে।", sen: "Click a pixel to read its HEX value." },
      { bn: "৩. কপি করুন", en: "3. Copy it", sbn: "প্যালেটের রংগুলো থেকেও একসাথে সব কোড কপি করা যায়।", sen: "Or copy every code from the palette at once." }
    ],
    faq: [
      { qbn: "ছবির রং কীভাবে বের হয়?", qen: "How are the colours detected?", abn: "ছবিটি ছোট করে প্রতিটি পিক্সেলের RGB মান পড়া হয় এবং ক্লোজেস্ট রঙগুলো গোনা হয় — তাই প্রধান রঙগুলো একসাথে পাওয়া যায়।", aen: "The image is downscaled and every pixel's RGB value is counted, then the most frequent colours become the palette.", },
      { qbn: "কোন কোন ধরনের ছবিতে ভালো কাজ করে?", qen: "Which images work best?", abn: "প্রাকৃতিক ছবি ও পণ্যের ছবি ভালো ফল দেয়; আঁকা ও গ্রাডিয়েন্ট ছবিতে রং মিশে যেতে পারে।", aen: "Natural photos and product shots work best; gradients or line art may blend into fewer colours.", },
      { qbn: "HEX কোড কোথায় ব্যবহার হয়?", qen: "Where are HEX codes used?", abn: "ওয়েব ডিজাইন (CSS), গ্রাফিক ডিজাইন, প্রিন্টের জন্য রঙ নির্বাচন এবং ক্যানভাস-ভিত্তিক অ্যাপে।", aen: "Web design (CSS), graphic design, print colour matching and any canvas-based app.", },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the image uploaded?", abn: "না, সব পিক্সেল পড়া আপনার ব্রাউজারেই হয়।", aen: "No — pixels are read locally in your browser.", }
    ]
  }
];