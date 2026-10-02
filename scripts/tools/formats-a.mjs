/** Tool configs: strip metadata, favicon generator, ICO converter */
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const dropzone = (iconPaths, titleBn, titleEn, hintBn, hintEn) => `        <div class="dropzone" id="dropzone" tabindex="0" role="button">
          ${icon(iconPaths).replace('<svg', '<svg class="dz-icon"')}
          <div class="dz-title" data-bn="${titleBn}" data-en="${titleEn}">${titleBn}</div>
          <div class="dz-hint" data-bn="${hintBn}" data-en="${hintEn}">${hintBn}</div>
          <input type="file" id="fileInput" accept="image/*">
        </div>`;

const compareBoxes = (aBn, aEn, bBn, bEn) => `          <div class="compare">
            <div class="compare-box">
              <span class="label" data-bn="${aBn}" data-en="${aEn}">${aBn}</span>
              <div class="value" id="sizeBefore">—</div>
              <div class="delta" id="dimBefore">—</div>
            </div>
            <div class="compare-box after">
              <span class="label" data-bn="${bBn}" data-en="${bEn}">${bBn}</span>
              <div class="value" id="sizeAfter">—</div>
              <div class="delta" id="dimAfter">—</div>
            </div>
          </div>`;

const actionBar = (bn, en) => `          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadBtn" data-bn="${bn}" data-en="${en}">${bn}</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি ছবি বাছুন" data-en="Choose another photo">আরেকটি ছবি বাছুন</button>
          </div>`;

const slider = (id, bn, en, min, max, value, unit) => `          <div class="field">
            <div class="slider-head">
              <span class="field-label" data-bn="${bn}" data-en="${en}">${bn}</span>
              <span class="slider-value"><span id="${id}Val">${value}</span>${unit || ""}</span>
            </div>
            <input type="range" id="${id}" min="${min}" max="${max}" value="${value}">
          </div>`;

const formatChips = (active) => `          <div>
            <span class="field-label" data-bn="আউটপুট ফরম্যাট" data-en="Output format">আউটপুট ফরম্যাট</span>
            <div class="chip-row" id="formatRow">
              <button type="button" class="chip${active === "jpeg" ? " active" : ""}" data-format="image/jpeg">JPG</button>
              <button type="button" class="chip${active === "png" ? " active" : ""}" data-format="image/png">PNG</button>
              <button type="button" class="chip${active === "webp" ? " active" : ""}" data-format="image/webp">WebP</button>
            </div>
          </div>`;

const PNG_PATH = '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z"/>';
const ICO_PATH = '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M17 13v8M13 17h8"/>';
const STRIP_PATH = '<path d="M3 6h18M3 12h12M3 18h15"/><path d="m16 16 5 5M21 16l-5 5"/>';

export default [
  {
    slug: "strip-metadata.html",
    title: "ছবির মেটাডেটা মুছুন | Remove EXIF & Metadata from Image Online",
    desc: "ছবির EXIF ডেটা (GPS লোকেশন, ক্যামেরা মডেল, তারিখ) মুছে ফেলে প্রাইভেটি রাখুন — ফ্রি অনলাইন। Remove EXIF, GPS location and camera metadata from photos — free, browser-based, no upload.",
    descEn: "Strip EXIF, GPS location, camera model and timestamps from your photos before sharing. Free online metadata remover — nothing is uploaded.",
    keywords: "remove exif data, strip metadata image, GPS location remover, ছবির মেটাডেটা মুছুন, remove photo location",
    h1bn: "ছবির মেটাডেটা ও EXIF মুছুন (Strip Metadata)",
    h1en: "Remove EXIF & Photo Metadata",
    subbn: "ছবি শেয়ার করার আগে GPS লোকেশন, ক্যামেরা তথ্য ও সময়-মুদ্রা সরিয়ে নিন — এক ক্লিকেই।",
    suben: "Remove GPS location, camera model and timestamps from a photo before you share it online.",
    shortBn: "মেটাডেটা মুছুন",
    shortEn: "Strip metadata",
    shortDescBn: "GPS ও ক্যামেরা তথ্য সরিয়ে প্রাইভেটি রাখুন।",
    shortDescEn: "Remove GPS and camera info to stay private.",
    icon: icon(STRIP_PATH),
    scripts: ["js/strip.js"],
    panel: `      <section class="tool-panel" aria-label="Metadata remover">
${dropzone(STRIP_PATH, "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><img id="previewImg" alt="Photo preview"></div>
          <div class="notice" data-bn="ছবি Canvas দিয়ে আবার এনকোড করলে সব EXIF, GPS ও ক্যামেরা তথ্য স্বয়ংক্রিয়ভাবে মুছে যায়।" data-en="Re-encoding through the Canvas automatically removes every EXIF, GPS and camera field.">ছবি Canvas দিয়ে আবার এনকোড করলে সব EXIF, GPS ও ক্যামেরা তথ্য স্বয়ংক্রিয়ভাবে মুছে যায়।</div>
${formatChips("jpeg")}
${slider("quality", "কোয়ালিটি", "Quality", 40, 100, 92, "%")}
${compareBoxes("আগের সাইজ", "Original size", "পরিষ্কার সাইজ", "Cleaned size")}
          <div class="status-line" id="status"></div>
${actionBar("পরিষ্কার ছবি ডাউনলোড করুন", "Download clean copy")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "যে ছবিটি পরিষ্কার করতে চান সেটি বাছুন।", sen: "Choose the photo to clean." },
      { bn: "২. ফরম্যাট ও কোয়ালিটি বাছুন", en: "2. Pick format and quality", sbn: "JPG বা PNG বেছে নিয়ে কোয়ালিটি ঠিক করুন।", sen: "Choose JPG or PNG and set the quality." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "মেটাডেটাবিহীন ছবিটি সেভ করুন।", sen: "Save the metadata-free copy." }
    ],
    faq: [
      { qbn: "EXIF ডেটায় কী কী থাকে?", qen: "What does EXIF data contain?", abn: "ফোনের মডেল, টেক্সন শটের সময়, জিপিএস লোকেশন, ক্যামেরা সেটিংস এবং কখনো কখনো মানুষের নাম।", aen: "Phone model, capture date and time, GPS location, camera settings and sometimes names.", },
      { qbn: "GPS লোকেশন সরালে কি ছবির মান কমবে?", qen: "Does removing GPS reduce quality?", abn: "না। শুধু তথ্যবলী ফাইলটি পুনরায় এনকোড হয় — ছবির পিক্সেল অপরিবর্তিত থাকে।", aen: "No. Only the info block is rebuilt — the actual pixels stay the same.", },
      { qbn: "ফোনের Gallery থেকে নেওয়া ছবিতে কি GPS থাকে?", qen: "Do photos from a phone gallery have GPS data?", abn: "প্রায়ই থাকে। এই টুল ব্যবহার করে শেয়ারের আগে অবস্থান তথ্য সরিয়ে নিন।", aen: "Often, yes. Run your photo through this tool before sharing it publicly.", },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the photo uploaded anywhere?", abn: "না, পুরো প্রক্রিয়া আপনার ব্রাউজারেই ঘটে।", aen: "No — the whole process runs in your browser.", },
      { qbn: "মেটাডেটা মুছলে কি ফাইল আরও ছোট হয়?", qen: "Does removing metadata make the file smaller?", abn: "সামান্য — এক্সিফ ব্লক কয়েক কিলোবাইটের হয়। ফাইলের বড় অংশ থাকে আপনার ছবির পিক্সেল ও কম্প্রেস তথ্যে।", aen: "Only slightly — the EXIF block is a few kilobytes. Most of the file is still your image data.", },
      { qbn: "কোন তথ্য মুছে ফেলা হয় না?", qen: "What is NOT removed?", abn: "ছবির দৃশ্যমান অংশ কখনোই বদলায় না। মুছে যায় শুধু সেই অদৃশ্য তথ্যবলী — EXIF, GPS ও ক্যামেরা তথ্য।", aen: "The visible image is never altered. Only the invisible information block is dropped — EXIF, GPS and camera data.", },

    ]
  },

  {
    slug: "favicon-generator.html",
    title: "ফেভিকন তৈরি করুন | Favicon Generator — Multi-size PNG & ICO Free",
    desc: "এক ছবি থেকে সব সাইজের ফেভিকন বানান — 16, 32, 48, 64, 180, 192 ও 512 px PNG এবং .ico ফাইল, ফ্রি। Generate favicons in every size from one image: 16–512 px PNGs plus a multi-size ICO file — free, no upload.",
    descEn: "Generate a complete favicon set from one image: 16, 32, 48, 64, 180, 192 and 512 px PNGs plus a downloadable multi-size .ico file. Free and browser-based.",
    keywords: "favicon generator, create ico file, website icon maker, ফেভিকন তৈরি, png favicon sizes",
    h1bn: "ফেভিকন জেনারেটর (Favicon Generator)",
    h1en: "Favicon Generator",
    subbn: "একটি ছবি থেকে ওয়েবসাইটের সব সাইজের আইকন বানান — PNG ফাইল ও একসাথে .ico ডাউনলোড করুন।",
    suben: "Turn one image into every icon size your website needs — download individual PNGs or a single multi-size ICO.",
    shortBn: "ফেভিকন জেনারেটর",
    shortEn: "Favicon maker",
    shortDescBn: "এক ছবি থেকে সব সাইজের আইকন ও .ico ফাইল।",
    shortDescEn: "All icon sizes and an ICO file from one image.",
    icon: icon(PNG_PATH),
    scripts: ["js/ico-writer.js", "js/favicon.js"],
    panel: `      <section class="tool-panel" aria-label="Favicon generator">
${dropzone(PNG_PATH, "লোগো বা ছবি দিন", "Drop your logo here", "সাফার্ক অ্যাপের মতো বর্গাকার ছবি সবচেয়ে ভালো ফল দেয়", "A square image works best — a flat logo gives the crispest result")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><img id="previewImg" alt="Source logo preview"></div>
          <div>
            <span class="field-label" data-bn="কোন সাইজগুলো চান?" data-en="Which sizes do you need?">কোন সাইজগুলো চান?</span>
            <div class="chip-row" id="sizeRow">
              <button type="button" class="chip active" data-size="16">16</button>
              <button type="button" class="chip active" data-size="32">32</button>
              <button type="button" class="chip active" data-size="48">48</button>
              <button type="button" class="chip" data-size="64">64</button>
              <button type="button" class="chip active" data-size="180">180</button>
              <button type="button" class="chip active" data-size="192">192</button>
              <button type="button" class="chip" data-size="512">512</button>
            </div>
          </div>
          <div class="trust-strip" id="previewGrid"></div>
          <div class="field">
            <label for="htmlSnippet" data-bn="HTML কোড (কপি করে &lt;head&gt; এ বসান)" data-en="HTML code (paste inside your &lt;head&gt;)">HTML কোড</label>
            <textarea id="htmlSnippet" rows="5" readonly style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.85rem;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm)"></textarea>
          </div>
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadAllBtn" data-bn="সব PNG একসাথে (.zip নয়, ব্রাউজারে)" data-en="Download all PNGs">সব PNG ডাউনলোড</button>
            <button type="button" class="btn btn-accent" id="downloadIcoBtn" data-bn="একসাথে .ico ফাইল নিন" data-en="Download single .ico">একসাথে .ico ফাইল নিন</button>
            <button type="button" class="btn btn-ghost" id="copyCodeBtn" data-bn="কোড কপি করুন" data-en="Copy code">কোড কপি করুন</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি লোগো বাছুন" data-en="Choose another image">আরেকটি লোগো বাছুন</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. লোগো দিন", en: "1. Add your logo", sbn: "বর্গাকার একটি ছবি বা লোগো দিন।", sen: "Upload a square logo or image." },
      { bn: "২. সাইজ বাছুন", en: "2. Choose sizes", sbn: "প্রয়োজনমতো সাইজগুলো সিলেক্ট করে প্রিভিউ দেখুন।", sen: "Tick the sizes you need and check the previews." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "আলাদা PNG নিন বা একটি .ico ফাইল, তারপর কোড বসান।", sen: "Grab the PNGs or one ICO file, then paste the code." }
    ],
    faq: [
      { qbn: "ফেভিকন কি কত সাইজের দরকার?", qen: "How many favicon sizes do I need?", abn: "কমপক্ষে 16, 32 ও 180 (Apple) দরকার। 192 ও 512 পিএন্টা অ্যান্ড্রয়েড ও Windows-এ ভালো ফল দেয়।", aen: "At least 16, 32 and 180 (Apple). Sizes 192 and 512 look best on Android and Windows tiles.", },
      { qbn: ".ico ফাইল কি এখনও দরকার?", qen: "Is an ICO file still needed?", abn: "হ্যাঁ, পুরোনো ব্রাউজার ও Windows ট্যাবে favicon.ico খোঁজে। এই টুল সেটিও একসাথে বানিয়ে দেয়।", aen: "Yes — older browsers and Windows tabs look for favicon.ico, and this tool builds that too.", },
      { qbn: "কীভাবে ব্যবহার করব?", qen: "How do I use them?", abn: "ডাউনলোড করা ফাইলগুলো ওয়েবসাইটের রুট ফোল্ডারে রাখুন, তারপর দেওয়া HTML কোডটি &lt;head&gt; এ বসান।", aen: "Put the downloaded files in your website root folder, then paste the generated HTML code inside your <head>.", },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the logo uploaded?", abn: "না, সব আইকন আপনার ব্রাউজারেই তৈরি হয়।", aen: "No — every icon is generated in your browser.", },
      { qbn: "সব সাইজের ফেভিকন কি আবশ্যক?", qen: "Do I need every favicon size?", abn: "না। অন্তত ১৬, ৩২ ও ১৮০ px লাগলেই বেশিরভাগ সাইটের জন্য যথেষ্ট। বাকিগুলো চাইলে টিক দিয়ে নিন।", aen: "No. For most sites 16, 32 and 180 px are enough. Tick the rest only if you want the extra sizes.", },
      { qbn: "আইকনের ব্যাকগ্রাউন্ড কি বদলানো যায়?", qen: "Can I change the icon background?", abn: "PNG আউটপুটে লোগোর স্বচ্ছ অংশ স্বচ্ছই থাকে, তাই আপনার সাইটের রঙ সাময়িকভাবেও দেখা যায়। নির্দিষ্ট রঙ চাইলে লোগোর পেছনে সেই রং বসিয়ে দিন।", aen: "With PNG output the transparent parts of your logo stay transparent, so your site background shows through. For a solid colour, place it behind the logo first.", },

    ]
  },

  {
    slug: "ico-converter.html",
    title: "ICO কনভার্টার | Convert PNG & JPG to ICO Online Free",
    desc: "PNG বা JPG ছবিকে .ico ফাইলে রূপান্তর করুন — 16, 32, 48, 64, 128 ও 256 px একসাথে। Convert PNG or JPG to ICO with multiple sizes in one file — free, no upload.",
    descEn: "Convert any PNG or JPG into a multi-size .ico file (16–256 px) in one click. Free browser-based ICO converter — nothing is uploaded.",
    keywords: "png to ico, jpg to ico, ico converter, আইকন কনভার্টর, convert image to ico",
    h1bn: "ICO কনভার্টার (Convert to ICO)",
    h1en: "Convert Image to ICO",
    subbn: "যেকোনো ছবি থেকে Windows ও পুরোনো ব্রাউজারের জন্য .ico ফাইল বানান — একাধিক সাইজ একসাথে।",
    suben: "Build a Windows-ready .ico file with several pixel sizes baked into a single file.",
    shortBn: "ICO কনভার্টার",
    shortEn: "ICO converter",
    shortDescBn: "PNG/JPG থেকে বহু-সাইজের .ico ফাইল তৈরি করুন।",
    shortDescEn: "Create a multi-size .ico from any image.",
    icon: icon(ICO_PATH),
    scripts: ["js/ico-writer.js", "js/ico.js"],
    panel: `      <section class="tool-panel" aria-label="ICO converter">
${dropzone(ICO_PATH, "ছবি এখানে ড্র্যাগ করুন", "Drop an image here", "PNG বা JPG — বর্গাকার ছবি সবচেয়ে ভালো", "PNG or JPG — a square image works best")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><img id="previewImg" alt="Source image preview"></div>
          <div>
            <span class="field-label" data-bn="ICO ফাইলে কোন সাইজগুলো থাকবে?" data-en="Which sizes inside the ICO?">ICO ফাইলে কোন সাইজগুলো থাকবে?</span>
            <div class="chip-row" id="sizeRow">
              <button type="button" class="chip active" data-size="16">16 px</button>
              <button type="button" class="chip active" data-size="32">32 px</button>
              <button type="button" class="chip active" data-size="48">48 px</button>
              <button type="button" class="chip" data-size="64">64 px</button>
              <button type="button" class="chip" data-size="128">128 px</button>
              <button type="button" class="chip" data-size="256">256 px</button>
            </div>
          </div>
          <div class="notice" data-bn="ICO ফাইলটি PNG ডেটা ব্যবহার করে তৈরি হয়, যা আধুনিক ব্রাউজার ও Windows-এ সমর্থিত।" data-en="The ICO is built with embedded PNG data, which all modern browsers and Windows support.">ICO ফাইলটি PNG ডেটা ব্যবহার করে তৈরি হয়, যা আধুনিক ব্রাউজার ও Windows-এ সমর্থিত।</div>
${compareBoxes("আগের সাইজ", "Original size", "ICO ফাইলের সাইজ", "ICO file size")}
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadBtn" data-bn=".ico ডাউনলোড করুন" data-en="Download .ico">.ico ডাউনলোড করুন</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি ছবি বাছুন" data-en="Choose another image">আরেকটি ছবি বাছুন</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add an image", sbn: "PNG বা JPG ছবি দিন।", sen: "Upload a PNG or JPG." },
      { bn: "২. সাইজ বাছুন", en: "2. Choose sizes", sbn: "ফাইলে কোন সাইজগুলো রাখবেন সেটি সিলেক্ট করুন।", sen: "Select the pixel sizes to embed in the file." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "তৈরি .ico ফাইলটি ডাউনলোড করে favicon হিসেবে ব্যবহার করুন।", sen: "Download the ICO and use it as your favicon." }
    ],
    faq: [
      { qbn: "ICO ফাইল কোথায় ব্যবহার হয়?", qen: "Where is an ICO file used?", abn: "ওয়েবসাইটের favicon.ico, Windows ফোল্ডারের আইকন এবং ডেস্কটপ অ্যাপের আইকনে।", aen: "Website favicons (favicon.ico), Windows folder icons and desktop app icons.", },
      { qbn: "এক ফাইলে কি একাধিক সাইজ থাকে?", qen: "Can one file hold several sizes?", abn: "হ্যাঁ — একটি ICO ফাইলে 16 থেকে 256 px পর্যন্ত একাধিক সাইজ একসাথে থাকতে পারে; ব্রাউজার প্রয়োজনমতো বেছে নেয়।", aen: "Yes — a single ICO can embed sizes from 16 to 256 px, and each browser picks what it needs.", },
      { qbn: "PNG বা JPG কোনটা দিব?", qen: "Should I use PNG or JPG source?", abn: "PNG সবচেয়ে ভালো, কারণ স্বচ্ছতা ও স্পষ্টতা ঠিক থাকে।", aen: "PNG is best — it preserves transparency and crisp edges." },
      { qbn: "কনভার্ট কি আপলোড ছাড়াই হয়?", qen: "Does conversion happen without upload?", abn: "হ্যাঁ, পুরোটাই ব্রাউজারে হয়।", aen: "Yes, entirely in your browser.", },
      { qbn: "তৈরি ICO ফাইল কতটা বড় হয়?", qen: "How big is the resulting ICO file?", abn: "প্রায় কয়েক কিলোবাইট থেকে কয়েক ডজন কিলোবাইট — মোট সাইজের উপর নির্ভর করে। আইকন ফাইল সবসময় ছোটই থাকে।", aen: "Usually a few kilobytes to a few dozen, depending on the sizes you pick. Icon files stay small either way.", },
      { qbn: "অ্যানিমেটেড GIF বা ভিডিও নেওয়া যাবে?", qen: "Does it accept animated GIFs or video?", abn: "সাধারণ ছবি (JPG, PNG, WebP) নেওয়া যায়। অ্যানিমেশন থাকলে শুধু প্রথম ফ্রেমটি আইকনে বসবে।", aen: "Regular images (JPG, PNG, WebP) work. If the file is animated, only its first frame becomes the icon.", },

    ]
  }
];