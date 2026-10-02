/** Tool configs: rotate/flip, adjust (filters), compare */
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const dropzone = (iconPaths, titleBn, titleEn, hintBn, hintEn) => `        <div class="dropzone" id="dropzone" tabindex="0" role="button">
          ${icon(iconPaths).replace('<svg', '<svg class="dz-icon"')}
          <div class="dz-title" data-bn="${titleBn}" data-en="${titleEn}">${titleBn}</div>
          <div class="dz-hint" data-bn="${hintBn}" data-en="${hintEn}">${hintBn}</div>
          <input type="file" id="fileInput" accept="image/*">
        </div>`;

const compareBoxes = (beforeLabelBn, beforeLabelEn, afterLabelBn, afterLabelEn) => `          <div class="compare">
            <div class="compare-box">
              <span class="label" data-bn="${beforeLabelBn}" data-en="${beforeLabelEn}">${beforeLabelBn}</span>
              <div class="value" id="sizeBefore">—</div>
              <div class="delta" id="dimBefore">—</div>
            </div>
            <div class="compare-box after">
              <span class="label" data-bn="${afterLabelBn}" data-en="${afterLabelEn}">${afterLabelBn}</span>
              <div class="value" id="sizeAfter">—</div>
              <div class="delta" id="dimAfter">—</div>
            </div>
          </div>`;

const actionBar = (label) => `          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadBtn" data-bn="${label}" data-en="${label}">${label}</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি ছবি বাছুন" data-en="Choose another photo">আরেকটি ছবি বাছুন</button>
          </div>`;

const slider = (id, labelBn, labelEn, min, max, value, step) => `          <div class="field">
            <div class="slider-head">
              <span class="field-label" data-bn="${labelBn}" data-en="${labelEn}">${labelBn}</span>
              <span class="slider-value"><span id="${id}Val">${value}</span></span>
            </div>
            <input type="range" id="${id}" min="${min}" max="${max}" value="${value}"${step ? ` step="${step}"` : ""}>
          </div>`;

const dropAll = `      <section class="tool-panel" aria-label="tool">
${dropzone('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2.2"/><path d="m3 17 5-4.5 4 3.5 3.5-3 5.5 5"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
          <div id="extraControls"></div>
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`;

export default [
  {
    slug: "rotate-flip.html",
    title: "ছবি ঘোরান ও ফ্লিপ করুন | Rotate & Flip Image Online Free",
    desc: "ছবি 90/180/270 ডিগ্রি ঘোরান এবং অনুভূমিক বা উল্লম্ব ফ্লিপ করুন — ফ্রি, ব্রাউজারেই। Rotate image 90 degrees and flip horizontally or vertically online free — no upload.",
    descEn: "Free online rotate and flip tool: turn a photo 90, 180 or 270 degrees and mirror it horizontally or vertically. Runs in your browser — no upload.",
    keywords: "rotate image online, flip image, ছবি ঘোরান, ছবি ফ্লিপ, rotate 90 degrees free",
    h1bn: "ছবি ঘোরান ও ফ্লিপ করুন (Rotate & Flip Image)",
    h1en: "Rotate & Flip Image Online",
    subbn: "৯০°, ১৮০° বা ২৭০° ঘোরান, দর্পণের মতো উল্টান — সব লাইভ প্রিভিউতে। ছবি ব্রাউজারেই থাকে, কোথাও আপলোড হয় না।",
    suben: "Turn your photo 90°, 180° or 270°, mirror it, and see every change live. Your image never leaves the browser.",
    shortBn: "ঘোরান ও ফ্লিপ",
    shortEn: "Rotate & flip",
    shortDescBn: "যেকোনো কোণায় ঘোরান, দর্পণের মতো ফ্লিপ করুন — লাইভ প্রিভিউ সহ।",
    shortDescEn: "Turn any angle and mirror your photo, with live preview.",
    icon: icon('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>'),
    scripts: ["js/rotate.js"],
    panel: `      <section class="tool-panel" aria-label="Rotate and flip tool">
${dropzone('<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
          <div class="chip-row">
            <button type="button" class="chip" id="rotL" data-bn="↺ ৯০° বামে" data-en="↺ Rotate 90° left">↺ ৯০° বামে</button>
            <button type="button" class="chip" id="rotR" data-bn="↻ ৯০° ডানে" data-en="↻ Rotate 90° right">↻ ৯০° ডানে</button>
            <button type="button" class="chip" id="rot180" data-bn="↻ ১৮০°" data-en="↻ Rotate 180°">↻ ১৮০°</button>
            <button type="button" class="chip" id="flipH" data-bn="↔ ফ্লিপ অনুভূমিক" data-en="↔ Flip horizontal">↔ ফ্লিপ অনুভূমিক</button>
            <button type="button" class="chip" id="flipV" data-bn="↕ ফ্লিপ উল্লম্ব" data-en="↕ Flip vertical">↕ ফ্লিপ উল্লম্ব</button>
            <button type="button" class="chip" id="resetAll" data-bn="⟲ সব রিসেট" data-en="⟲ Reset all">⟲ সব রিসেট</button>
          </div>
          <div>
            <span class="field-label" data-bn="আউটপুট ফরম্যাট" data-en="Output format">আউটপুট ফরম্যাট</span>
            <div class="chip-row" id="formatRow">
              <button type="button" class="chip active" data-format="image/jpeg">JPG</button>
              <button type="button" class="chip" data-format="image/png">PNG</button>
              <button type="button" class="chip" data-format="image/webp">WebP</button>
            </div>
          </div>
          <label class="check-field">
            <input type="checkbox" id="bgWhite" checked>
            <span data-bn="সাদা ব্যাকগ্রাউন্ড (JPG/WebP-র জন্য)" data-en="White background (for JPG/WebP)">সাদা ব্যাকগ্রাউন্ড (JPG/WebP-র জন্য)</span>
          </label>
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "ড্র্যাগ করে বা ক্লিক করে আপনার ছবিটি দিন।", sen: "Drag in your photo, or click to choose it." },
      { bn: "২. ঘোরান বা ফ্লিপ করুন", en: "2. Rotate or flip", sbn: "বাটনে চাপ দিন — প্রতিটি পরিবর্তন সঙ্গে সঙ্গে দেখা যাবে।", sen: "Hit a button — every change shows instantly in the preview." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "ফরম্যাট বেছে নিয়ে ছবিটি সেভ করুন।", sen: "Pick a format and save the result." }
    ],
    faq: [
      { qbn: "ছবি ঘোরানোর সবচেয়ে ভালো উপায় কী?", qen: "What is the best way to rotate a photo?", abn: "এই টুলেই ৯০°, ১৮০° বা ২৭০° ঘোরান — ফাইলের মধ্যেই orientation ঠিক হয়ে যায়, তাই ফোনের গ্যালারিতেও ঠিকমতো দেখাবে।", aen: "Rotate 90°, 180° or 270° right here — the pixels are physically rotated, so the photo also displays correctly in your phone gallery.", },
      { qbn: "ফ্লিপ আর ঘোরানের পার্থক্য কী?", qen: "What is the difference between flip and rotate?", abn: "ঘোরান মানে ছবি একটা নির্দিষ্ট কোণে ঘুরে যায়; ফ্লিপ মানে দর্পণের মতো উল্টে যাওয়া (অনুভূমিক বা উল্লম্ব)।", aen: "Rotating turns the image by an angle; flipping mirrors it like a reflection, horizontally or vertically.", },
      { qbn: "ঘোরানোর পর কি ছবির কোয়ালিটি কমবে?", qen: "Does rotating reduce quality?", abn: "না। ঘোরান ও ফ্লিপ শুধু পিক্সেল সাজিয়ে নেয় — কোনো পুনরায় কম্প্রেস বা কোয়ালিটি হারায় না।", aen: "No. Rotating and flipping only rearrange pixels — nothing is recompressed, so quality is untouched.", },
      { qbn: "একাধিক ছবি একসাথে ঘোরানো যাবে?", qen: "Can I rotate several photos at once?", abn: "একবারে একটি ছবি কাজ হয়, তবে ব্যাচ টুল দিয়ে একসাথে অনেক ছবি রিসাইজ বা কনভার্ট করা যায়।", aen: "One photo at a time here — for many files at once, use the batch tool to resize or convert in bulk.", },
      { qbn: "৯০ ডিগ্রি ছাড়া অন্য কোণে ঘোরানো যাবে?", qen: "Can I rotate by an angle other than 90 degrees?", abn: "এই টুলে ৯০°, ১৮০° ও ২৭০° দেওয়া আছে, যা বাস্তবে প্রায় সবসময় যথেষ্ট। খুব অস্বাভাবিক কোণ দরকার হলে এডিটর ব্যবহার করুন।", aen: "This tool offers 90°, 180° and 270°, which covers almost every real case. For unusual angles, use a full editor.", },
      { qbn: "ঘোরানোর পর ফাইলের নাম কি বদলায়?", qen: "Does rotating rename the file?", abn: "হ্যাঁ, আপনার মূল নামের শেষে `-rotated` যুক্ত হয়, তাই আগের ছবির সঙ্গে নতুন ছবি গুলিয়ে যায় না।", aen: "Yes — `-rotated` is added to your original filename so it never overwrites the source image.", },
    ]
  },

  {
    slug: "adjust-image.html",
    title: "ছবি সম্পাদনা — ব্রাইটনেস, কনট্রাস্ট, গ্রেস্কেল | Edit Image Filters Online",
    desc: "ছবির ব্রাইটনেস, কনট্রাস্ট, স্যাচারেশন, ব্লার, গ্রেস্কেল, সেপিয়া ও ইনভার্ট — ফ্রি অনলাইন ফিল্টার। Adjust brightness, contrast, saturation, blur, grayscale — free browser image editor, no upload.",
    descEn: "Free online image editor: adjust brightness, contrast, saturation, blur, grayscale, sepia and invert with a live preview. Everything runs in your browser — no upload.",
    keywords: "edit image online, image filters, brightness contrast, গ্রেস্কেল ছবি, ব্লার ইমেজ, ব্রাইটনেস অ্যাডজাস্ট",
    h1bn: "ছবি সম্পাদনা ও ফিল্টার (Edit Image)",
    h1en: "Edit Image — Filters & Adjustments",
    subbn: "ব্রাইটনেস, কনট্রাস্ট, স্যাচারেশন, ব্লার, গ্রেস্কেল, সেপিয়া — স্লাইডার নাড়ালেই লাইভ প্রিভিউ বদলাবে।",
    suben: "Brightness, contrast, saturation, blur, grayscale and sepia — move a slider and watch the live preview change.",
    shortBn: "ফিল্টার ও অ্যাডজাস্ট",
    shortEn: "Filters & adjust",
    shortDescBn: "ব্রাইটনেস, কনট্রাস্ট, ব্লার, গ্রেস্কেল — স্লাইডারে লাইভ প্রিভিউ।",
    shortDescEn: "Brightness, contrast, blur, grayscale — all with live sliders.",
    icon: icon('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
    scripts: ["js/adjust.js"],
    panel: `      <section class="tool-panel" aria-label="Image adjustment tool">
${dropzone('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
${slider("brightness", "ব্রাইটনেস", "Brightness", 0, 200, 100)}
${slider("contrast", "কনট্রাস্ট", "Contrast", 0, 200, 100)}
${slider("saturation", "স্যাচারেশন", "Saturation", 0, 200, 100)}
${slider("blur", "ব্লার", "Blur", 0, 30, 0)}
${slider("grayscale", "গ্রেস্কেল", "Grayscale", 0, 100, 0)}
${slider("sepia", "সেপিয়া", "Sepia", 0, 100, 0)}
${slider("invert", "ইনভার্ট", "Invert", 0, 100, 0)}
          <div class="chip-row">
            <button type="button" class="chip" id="presetBW" data-bn="⌁ ব্ল্যাক অ্যান্ড হোয়াইট" data-en="⌁ Black & white">⌁ ব্ল্যাক অ্যান্ড হোয়াইট</button>
            <button type="button" class="chip" id="presetWarm" data-bn="☀ ওয়ার্ম টোন" data-en="☀ Warm tone">☀ ওয়ার্ম টোন</button>
            <button type="button" class="chip" id="presetCool" data-bn="❄ কুল টোন" data-en="❄ Cool tone">❄ কুল টোন</button>
            <button type="button" class="chip" id="presetVivid" data-bn="✦ ভাইভিড" data-en="✦ Vivid">✦ ভাইভিড</button>
            <button type="button" class="chip" id="resetFilters" data-bn="⟲ রিসেট" data-en="⟲ Reset">⟲ রিসেট</button>
          </div>
          <div>
            <span class="field-label" data-bn="আউটপুট ফরম্যাট" data-en="Output format">আউটপুট ফরম্যাট</span>
            <div class="chip-row" id="formatRow">
              <button type="button" class="chip active" data-format="image/jpeg">JPG</button>
              <button type="button" class="chip" data-format="image/png">PNG</button>
              <button type="button" class="chip" data-format="image/webp">WebP</button>
            </div>
          </div>
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "যেকোনো JPG, PNG বা WebP ছবি বাছুন।", sen: "Pick any JPG, PNG or WebP photo." },
      { bn: "২. ফিল্টার ঠিক করুন", en: "2. Tune the filters", sbn: "স্লাইডার নাড়ান বা প্রস্তুত ফিল্টার বাটনে চাপ দিন।", sen: "Move the sliders or tap a one-tap filter preset." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "পছন্দ হলে ফরম্যাট বেছে ছবিটি সেভ করুন।", sen: "Pick a format and save the edited photo." }
    ],
    faq: [
      { qbn: "এই ফিল্টার কি আমার ছবির কোয়ালিটি নষ্ট করে?", qen: "Do these filters ruin photo quality?", abn: "না। ফিল্টারগুলো ব্রাউজারের Canvas-এ পিক্সেল-লেভেলে কাজ করে। ডাউনলোডের সময় মাত্র আপনার বেছে নেওনা JPG/WebP কোয়ালিটি প্রয়োগ হয়।", aen: "No. Filters run pixel-by-pixel on the browser Canvas, and only the JPG/WebP quality you choose is applied on export.", },
      { qbn: "ব্লার কি একদম ফ্রি ও অফলাইন?", qen: "Is blur free and offline?", abn: "হ্যাঁ, পুরো প্রসেসিং আপনার ডিভাইসেই হয়, তাই ইন্টারনেট ছাড়াও কাজ করে এবং কোনো কিছু আপলোড হয় না।", aen: "Yes — everything happens on your device, so it works offline and nothing is ever uploaded.", },
      { qbn: "একাধিক ছবিতে একই ফিল্টার লাগবে?", qen: "Can I apply the same filter to many photos?", abn: "বর্তমানে একটি ছবিতে কাজ হয়। ব্যাচ টুল দিয়ে একসাথে অনেক ছবি রিসাইজ/কনভার্ট করা যায়।", aen: "One photo at a time for now. Use the batch tool to resize or convert many files at once.", },
      { qbn: "ফিল্টার করার পর ছবি আপলোড হয় কি?", qen: "Is my photo uploaded after editing?", abn: "কখনোই না। ফিল্টার ও ডাউনলোড দুটোই আপনার ব্রাউজারে সম্পন্ন হয়।", aen: "Never. Both editing and downloading happen entirely in your browser.", },
      { qbn: "আসল ছবিতে ফিরে যাওয়া যাবে?", qen: "Can I undo back to the original photo?", abn: "হ্যাঁ — “রিসেট” বোতামে চাপ দিলে সব স্লাইডার শূন্যে ফিরে গিয়ে আসল ছবি দেখায়।", aen: "Yes — press Reset to return every slider to zero and show the untouched original.", },
      { qbn: "ফিল্টার করা ছবি কি ছাপলে ভালো দেখায়?", qen: "Will a filtered photo still print well?", abn: "হ্যাঁ, ফিল্টার কেবল প্রদর্শনের জন্য; ফাইলটি সাধারণ JPG/PNG হিসেবে সেভ হয়, তাই ছাপলেও ফল ঠিক থাকে।", aen: "Yes. Filters only change how the preview looks; the file saves as a normal JPG/PNG, so prints stay true.", },

    ]
  },

  {
    slug: "compare-image.html",
    title: "আগের ও পরের ছবি তুলনা | Before & After Image Comparison Tool",
    desc: "স্লাইডার দিয়ে আগের ও পরের ছবি পাশাপাশি তুলনা করুন — ব্রাইটনেস, কনট্রাস্ট ও ব্লার প্রিভিউ। Compare before and after with a drag slider — free, browser-based, no upload.",
    descEn: "Compare before and after versions of your photo with a drag slider. Adjust brightness, contrast and blur to preview edits — free and fully browser-based.",
    keywords: "before and after image, image comparison slider, আগের পরের ছবি তুলনা, photo compare online",
    h1bn: "আগের ও পরের ছবি তুলনা (Before & After)",
    h1en: "Before & After Image Comparison",
    subbn: "স্লাইডারটি টেনে দেখুন কোন অংশে কী পরিবর্তন হচ্ছে — ফিল্টার প্রিভিউ ও ফলাফল একসাথে।",
    suben: "Drag the divider to reveal the difference — preview filters and see the result side by side in one view.",
    shortBn: "তুলনা স্লাইডার",
    shortEn: "Compare slider",
    shortDescBn: "ড্র্যাগ স্লাইডারে আগের ও পরের ছবি তুলনা করুন।",
    shortDescEn: "Drag the slider to compare before and after.",
    icon: icon('<rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><path d="M12 2v20"/>'),
    scripts: ["js/compare.js"],
    panel: `      <section class="tool-panel" aria-label="Comparison tool">
${dropzone('<rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><path d="M12 2v20"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame">
            <canvas id="canvas" style="touch-action:none;cursor:ew-resize"></canvas>
          </div>
          <div class="field">
            <div class="slider-head">
              <span class="field-label" data-bn="তুলনার অবস্থান" data-en="Divider position">তুলনার অবস্থান</span>
              <span class="slider-value"><span id="splitVal">50</span>%</span>
            </div>
            <input type="range" id="split" min="0" max="100" value="50">
          </div>
${slider("brightness", "ব্রাইটনেস", "Brightness", 0, 200, 100)}
${slider("contrast", "কনট্রাস্ট", "Contrast", 0, 200, 100)}
${slider("blur", "ব্লার", "Blur", 0, 30, 0)}
${slider("grayscale", "গ্রেস্কেল", "Grayscale", 0, 100, 0)}
          <div class="status-line" id="status"></div>
${actionBar("ফিল্টার করা ছবি ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "তুলনা করতে চাওয়া ছবিটি দিন।", sen: "Add the photo you want to compare." },
      { bn: "২. স্লাইডার সরান", en: "2. Move the slider", sbn: "স্লাইডার টেনে আগের ও পরের অংশ দেখুন।", sen: "Drag the slider back and forth to see both sides." },
      { bn: "৩. ফলাফল সেভ করুন", en: "3. Save the result", sbn: "পছন্দ হলে ফিল্টার করা সংস্করণটি ডাউনলোড করুন।", sen: "If you like it, download the edited version." }
    ],
    faq: [
      { qbn: "এই টুল কীভাবে কাজ করে?", qen: "How does this tool work?", abn: "ছবিটি দুই ভাগে দেখানো হয় — বাঁ পাশে আসল ছবি, ডান পাশে ফিল্টার করা সংস্করণ। মাঝের স্লাইডার টেনে বদলে দেখুন।", aen: "The photo is shown in two halves: the original on the left and the filtered version on the right. Drag the middle slider to reveal each side.", },
      { qbn: "তুলনার ছবিটি কি আপলোড হয়?", qen: "Is the photo uploaded for comparison?", abn: "না, সব কিছুই Canvas-এ রেন্ডার হয় — কোনো সার্ভারে কিছু যায় না।", aen: "No. Everything is rendered on the Canvas — nothing reaches a server.", },
      { qbn: "এখানে কি ক্রপ বা রিসাইজও করা যায়?", qen: "Can I crop or resize here too?", abn: "এই টুলটি মূলত ফিল্টার তুলনার জন্য। ক্রপ ও রিসাইজের জন্য আলাদা টুলগুলো ব্যবহার করুন।", aen: "This tool focuses on filter comparison. Use the dedicated crop and resize tools for those jobs.", },
      { qbn: "মোবাইলে স্লাইডার কি ঠিকভাবে চলে?", qen: "Does the slider work on mobile?", abn: "হ্যাঁ, আঙুল দিয়েও স্লাইডার টানা যায় এবং স্লাইডার ইনপুটও কাজ করে।", aen: "Yes — you can drag with your finger, and the range input works as well.", },
      { qbn: "তুলনার জন্য দুটি ছবি কীভাবে দেব?", qen: "How do I load two different photos?", abn: "আগের ছবি হিসেবে একটি, পরের ছবি হিসেবে আরেকটি ড্রপ করুন। ফাইল বেছে নেওয়ার পর “পরিবর্তন” বোতামও আছে।", aen: "Drop one image as the before photo and another as the after photo. There is also a button to swap them.", },
      { qbn: "এই টুল কি নিজে থেকে কোনো ফিল্টার দেয়?", qen: "Does this tool apply any filter?", abn: "না — এটি শুধু দুটি ছবির পার্থক্য দেখায়, ছবিতে কোনো পরিবর্তন করে না। ফিল্টার করতে অ্যাডজাস্ট ইমেজ টুল ব্যবহার করুন।", aen: "No — it only shows the difference between two photos and changes nothing. Use the Adjust Image tool to apply filters.", },

    ]
  }
];

// keep an unused helper referenced for future tools
void dropAll;