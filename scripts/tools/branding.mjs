/** Tool configs: watermark, border, meme generator, circle/avatar crop */
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

const actionBar = (labelBn, labelEn = "Download") => `          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadBtn" data-bn="${labelBn}" data-en="${labelEn}">${labelBn}</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আরেকটি ছবি বাছুন" data-en="Choose another photo">আরেকটি ছবি বাছুন</button>
          </div>`;

const slider = (id, labelBn, labelEn, min, max, value, unit) => `          <div class="field">
            <div class="slider-head">
              <span class="field-label" data-bn="${labelBn}" data-en="${labelEn}">${labelBn}</span>
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

export default [
  {
    slug: "watermark-image.html",
    title: "ছবিতে ওয়াটারমার্ক যোগ করুন | Add Watermark to Image Online Free",
    desc: "ছবিতে টেক্সট বা লোগো ওয়াটারমার্ক বসান — অবস্থান, স্বচ্ছতা ও সাইজ নিয়ন্ত্রণ সহ, ফ্রি। Add text or logo watermark to your photo online — free, no upload.",
    descEn: "Add a text or logo watermark to your photos: position, opacity and size are all adjustable. Free and fully browser-based — no upload.",
    keywords: "watermark image online, add text watermark, ছবিতে ওয়াটারমার্ক, logo watermark free",
    h1bn: "ছবিতে ওয়াটারমার্ক যোগ করুন (Add Watermark)",
    h1en: "Add Watermark to Image",
    subbn: "নিজের টেক্সট বা লোগো বসিয়ে ছবির ডপ্লিকেট থেকে সুরক্ষা করুন — অবস্থান ও স্বচ্ছতা নিজে ঠিক করুন।",
    suben: "Stamp your own text or logo onto a photo to stop unauthorised reuse — position and opacity are yours to control.",
    shortBn: "ওয়াটারমার্ক",
    shortEn: "Watermark",
    shortDescBn: "টেক্সট বা লোগো বসিয়ে ছবির ডপ্লিকেট ঠেকান।",
    shortDescEn: "Stamp text or a logo to protect your photos.",
    icon: icon('<path d="M12 2.7 6.5 8.2a7.7 7.7 0 1 0 11 0z"/><path d="M9 14h6M12 11v6"/>'),
    scripts: ["js/watermark.js"],
    panel: `      <section class="tool-panel" aria-label="Watermark tool">
${dropzone('<path d="M12 2.7 6.5 8.2a7.7 7.7 0 1 0 11 0z"/><path d="M9 14h6M12 11v6"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
          <div>
            <span class="field-label" data-bn="ওয়াটারমার্কের ধরন" data-en="Watermark type">ওয়াটারমার্কের ধরন</span>
            <div class="chip-row" id="modeRow">
              <button type="button" class="chip active" data-mode="text" data-bn="টেক্সট" data-en="Text">টেক্সট</button>
              <button type="button" class="chip" data-mode="image" data-bn="লোগো / ছবি" data-en="Logo / image">লোগো / ছবি</button>
            </div>
          </div>
          <div id="textControls">
            <div class="field">
              <label for="wmText" data-bn="টেক্সট" data-en="Text">টেক্সট</label>
              <input type="text" id="wmText" value="© My Studio" data-bn-ph="যেমন: © আপনার নাম" data-en-ph="e.g. © Your Name">
            </div>
            <div class="field">
              <label for="wmColor" data-bn="টেক্সটের রং ও ব্যাকগ্রাউন্ড" data-en="Text colour">টেক্সটের রং</label>
              <input type="color" id="wmColor" value="#ffffff" style="height:44px;padding:4px">
            </div>
          </div>
          <div id="imageControls" hidden>
            <div class="field">
              <label class="check-field">
                <input type="file" id="logoInput" accept="image/*">
                <span data-bn="লোগো ছবি বেছে নিন (PNG সেরা)" data-en="Choose a logo image (PNG works best)">লোগো ছবি বেছে নিন (PNG সেরা)</span>
              </label>
            </div>
          </div>
${slider("wmSize", "সাইজ", "Size", 5, 80, 25, "%")}
${slider("wmOpacity", "স্বচ্ছতা", "Opacity", 10, 100, 60, "%")}
          <div class="field">
            <label for="wmPos" data-bn="অবস্থান" data-en="Position">অবস্থান</label>
            <select id="wmPos">
              <option value="br" data-bn="ডান-নিচে" data-en="Bottom right">ডান-নিচে</option>
              <option value="bl" data-bn="বাম-নিচে" data-en="Bottom left">বাম-নিচে</option>
              <option value="tr" data-bn="ডান-উপরে" data-en="Top right">ডান-উপরে</option>
              <option value="tl" data-bn="বাম-উপরে" data-en="Top left">বাম-উপরে</option>
              <option value="center" data-bn="মাঝখানে" data-en="Center">মাঝখানে</option>
              <option value="tile" data-bn="পুরো ছবিতে ছড়ানো" data-en="Tiled across">পুরো ছবিতে ছড়ানো</option>
            </select>
          </div>
${formatChips("jpeg")}
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "যে ছবিতে ওয়াটারমার্ক দিতে চান সেটি বাছুন।", sen: "Choose the photo you want to protect." },
      { bn: "২. ওয়াটারমার্ক ঠিক করুন", en: "2. Set the watermark", sbn: "টেক্সট বা লোগো বেছে নিয়ে সাইজ, স্বচ্ছতা ও অবস্থান ঠিক করুন।", sen: "Pick text or logo and set size, opacity and position." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "লাইভ প্রিভিউ দেখে ফাইলটি সেভ করুন।", sen: "Check the live preview, then save the file." }
    ],
    faq: [
      { qbn: "ওয়াটারমার্ক কি ছবির কোয়ালিটি নষ্ট করে?", qen: "Does a watermark reduce photo quality?", abn: "না, ওয়াটারমার্ক আলাদা স্তরে আঁকা হয়। ডাউনলোডের সময় আপনি নিজে JPG কোয়ালিটি বেছে নিতে পারেন।", aen: "No — the watermark is drawn as a separate layer, and you choose the JPG quality on export.", },
      { qbn: "লোগো দেওয়ার জন্য কোন ফরম্যাট ভালো?", qen: "Which format is best for a logo?", abn: "PNG সবচেয়ে ভালো, কারণ স্বচ্ছ ব্যাকগ্রাউন্ড থাকে এবং ছবির সঙ্গে মিশে যায়।", aen: "PNG — it keeps transparency, so the logo blends into the photo.", },
      { qbn: "পুরো ছবিতে ছড়ানো ওয়াটারমার্ক কি সম্ভব?", qen: "Can I tile a watermark across the image?", abn: "হ্যাঁ — অবস্থান ড্রপডাউন থেকে “পুরো ছবিতে ছড়ানো” বেছে নিলে বারবার প্যাটার্ন হিসেবে বসবে।", aen: "Yes — pick “Tiled across” in the position dropdown to repeat the watermark in a pattern.", },
      { qbn: "ছবি কি সার্ভারে আপলোড হয়?", qen: "Is the photo uploaded to a server?", abn: "না। পুরো ওয়াটারমার্কিং প্রক্রিয়া আপনার ব্রাউজারের Canvas-এ ঘটে।", aen: "No. The whole watermark process happens on your browser's Canvas.", },
      { qbn: "ওয়াটারমার্ক বসানোর পর ফাইলের সাইজ কতটা বাড়ে?", qen: "How much does the watermark add to the file size?", abn: "সাধারণত খুব সামান্য — ১–৩%। ছবির বেশিরভাগ পিক্সেল অপরিবর্তিত থাকে, তাই ফাইল প্রায় একই আকারে থাকে।", aen: "Very little — around 1–3%. Almost every pixel is unchanged, so the file stays roughly the same size.", },
      { qbn: "মোবাইলে ওয়াটারমার্ক ব্যবহার করা যাবে?", qen: "Can I add a watermark on mobile?", abn: "হ্যাঁ। টুলটি মোবাইল-ফার্স্ট — ফোনের গ্যালারি থেকে ছবি বেছে টেক্সট বা লোগো বসিয়ে ডাউনলোড করা যায়।", aen: "Yes. The tool is mobile-first — pick a photo from your gallery, stamp it, and download.", },
      { qbn: "একই ছবিতে একাধিক ওয়াটারমার্ক বসানো যাবে?", qen: "Can I place more than one watermark?", abn: "হ্যাঁ। অবস্থান ড্রপডাউন থেকে “পুরো ছবিতে ছড়ানো” বেছে নিলে ওয়াটারমার্ক প্যাটার্ন হিসেবে বারবার আঁকা হয়, যা দুর্জন্য সাধারণত মুছে ফেলা কঠিন করে।", aen: "Yes — the “Tiled across” option repeats the watermark as a pattern, which is much harder for others to crop out.", }
    ]
  },

  {
    slug: "add-border.html",
    title: "ছবিতে বর্ডার যোগ করুন | Add Border to Image Online Free",
    desc: "ছবির চারপাশে রঙিন বর্ডার ও প্যাডিং যোগ করুন — কোণা গোল করা সহ, ফ্রি ও ব্রাউজারেই। Add a coloured border and padding around your photo, with rounded corners — free, no upload.",
    descEn: "Add a coloured border, padding and rounded corners to any photo in seconds. Free browser-based tool — nothing is uploaded.",
    keywords: "add border to image, photo border online, ছবিতে বর্ডার, image padding rounded corners",
    h1bn: "ছবিতে বর্ডার যোগ করুন (Add Border)",
    h1en: "Add Border to Image",
    subbn: "ফটোরেওর মতো সাদা বর্ডার, কালো ফ্রেম বা গোল কোণ — প্যাডিং ও রঙ ইচ্ছেমতো।",
    suben: "Give a photo a clean white border, a black frame or rounded corners — padding and colour are fully up to you.",
    shortBn: "বর্ডার যোগ",
    shortEn: "Add border",
    shortDescBn: "রঙিন বর্ডার, প্যাডিং ও গোল কোন যোগ করুন।",
    shortDescEn: "Add coloured borders, padding and rounded corners.",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/>'),
    scripts: ["js/border.js"],
    panel: `      <section class="tool-panel" aria-label="Border tool">
${dropzone('<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
${slider("borderWidth", "বর্ডার পুরুত্ব", "Border width", 0, 60, 16, "px")}
${slider("padding", "প্যাডিং", "Padding", 0, 80, 20, "px")}
${slider("radius", "গোল কোণ", "Corner radius", 0, 100, 0, "px")}
          <div class="field">
            <label for="borderColor" data-bn="বর্ডারের রং" data-en="Border colour">বর্ডারের রং</label>
            <input type="color" id="borderColor" value="#ffffff" style="height:44px;padding:4px">
          </div>
          <div class="field">
            <label for="bgColor" data-bn="ছবির পেছনের রং" data-en="Background behind photo">ছবির পেছনের রং</label>
            <input type="color" id="bgColor" value="#ffffff" style="height:44px;padding:4px">
          </div>
${formatChips("jpeg")}
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "যে ছবিতে বর্ডার দিতে চান সেটি বাছুন।", sen: "Choose the photo to frame." },
      { bn: "২. বর্ডার ঠিক করুন", en: "2. Style the border", sbn: "পুরুত্ব, প্যাডিং, রঙ ও গোল কোণ স্লাইডারে বাছুন।", sen: "Use the sliders for width, padding, colour and corner radius." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "প্রিভিউ পছন্দ হলে ছবিটি সেভ করুন।", sen: "Like the preview? Save it." }
    ],
    faq: [
      { qbn: "পাসপোর্ট ছবির জন্য বর্ডার কি অনুমোদিত?", qen: "Are borders allowed on passport photos?", abn: "বেশিরভাগ দেশে ছবির চারপাশে সাদা বর্ডার দেওয়া হয়, তবে ফ্রেম কতটা পড়বে তা অফিসিয়াল নিয়ম দেখে নেওয়া ভালো। পাসপোর্ট টুলে সাদা ব্যাকগ্রাউন্ড অপশন আছে।", aen: "Most countries allow a plain white border, but check the official rules for how wide it may be. The passport tool includes a white background option.", },
      { qbn: "গোল কোনের বর্ডার কি বানানো যায়?", qen: "Can I get rounded corners?", abn: "হ্যাঁ — “গোল কোণ” স্লাইডারটি সরাসরি কনোর রেডিয়াস নিয়ন্ত্রণ করে।", aen: "Yes — the “Corner radius” slider controls the radius directly.", },
      { qbn: "বর্ডার যোগ করলে ছবির কোয়ালিটি বদলায়?", qen: "Does adding a border change quality?", abn: "ছবির পিক্সেল অপরিবর্তিত থাকে — শুধু চারপাশে নতুন ক্যানভাসের জায়গা যোগ হয়।", aen: "The photo pixels stay untouched — only extra canvas is added around them.", },
      { qbn: "কি ট্রান্সপারেন্ট বর্ডার বা ছবি বানানো যায়?", qen: "Can I keep transparency?", abn: "PNG আউটপুটে ছবির বাইরের অংশ স্বচ্ছ থাকে।", aen: "With PNG output the area outside the photo stays transparent.", },
      { qbn: "কতটা প্যাডিং দিলে ছবি সবচেয়ে ভালো দেখায়?", qen: "How much padding looks best?", abn: "ছবির প্রস্থের ৪–৮% প্যাডিং সাধারণত সবচেয়ে স্বাভাবিক দেখায়। কোনো কঠিন নিয়ম নেই — স্লাইডার দিয়ে বারবার দেখে ঠিক করুন।", aen: "Around 4–8% of the image width usually looks most natural. There is no hard rule — adjust the slider until it looks right.", },
      { qbn: "JPG আউটপুটে বর্ডারের বাইরের অংশে কী থাকে?", qen: "What fills the area around the border in JPG output?", abn: "JPG স্বচ্ছতা রাখতে পারে না, তাই বর্ডারের বাইরের অংশে আপনি বেছে নেওয়া “ছবির পেছনের রং” বসবে।", aen: "JPG cannot store transparency, so the area around the border is filled with the background colour you pick.", },
      { qbn: "ছবির আসল অনুপাত কি অক্ষত থাকে?", qen: "Is the photo itself left untouched?", abn: "হ্যাঁ। বর্ডার যোগ করলে ছবির কোনো পিক্সেল বদলায় না — ক্যানভাসের আকার বড় হয়ে চারপাশে ফাঁকা জায়গা যোগ হয়।", aen: "Yes. No pixel of the photo changes — the canvas simply grows and empty space is added around it." },
    ]
  },

  {
    slug: "meme-generator.html",
    title: "মিম জেনারেটর অনলাইন | Meme Generator with Text — Free Image Editor",
    desc: "ছবির উপরে উপরে-নিচে টেক্সট বসিয়ে মিম তৈরি করুন — ফন্ট সাইজ, রঙ ও আউটলাইন ঠিক করা যায়। Create memes online with top and bottom captions — free, browser-based, no upload.",
    descEn: "Create memes online: add top and bottom captions with adjustable font size, colour and outline. Free browser meme maker — no upload, no watermark.",
    keywords: "meme generator, make meme online, মিম তৈরি, meme maker with text free",
    h1bn: "মিম জেনারেটর (Meme Generator)",
    h1en: "Meme Generator",
    subbn: "ছবির উপরে উপরে-নিচে মজার লেখা বসান — ফন্ট সাইজ, রঙ, আউটলাইন সব নিয়ন্ত্রণযোগ্য।",
    suben: "Add punchy captions above and below your photo — control font size, colour and outline for a classic meme look.",
    shortBn: "মিম জেনারেটর",
    shortEn: "Meme maker",
    shortDescBn: "ছবির উপরে-নিচে টেক্সট বসিয়ে মিম তৈরি করুন।",
    shortDescEn: "Add top and bottom captions to make memes.",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8M8 16h5"/>'),
    scripts: ["js/meme.js"],
    panel: `      <section class="tool-panel" aria-label="Meme generator">
${dropzone('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8M8 16h5"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
          <div class="field">
            <label for="topText" data-bn="উপরের লেখা" data-en="Top text">উপরের লেখা</label>
            <input type="text" id="topText" data-bn-ph="যেমন: যখন বলিস..." data-en-ph="e.g. WHEN YOU SAY...">
          </div>
          <div class="field">
            <label for="bottomText" data-bn="নিচের লেখা" data-en="Bottom text">নিচের লেখা</label>
            <input type="text" id="bottomText" data-bn-ph="যেমন: ...আবার ফোন হারিয়ে ফেলেছ" data-en-ph="e.g. ...AND LOSE YOUR PHONE AGAIN">
          </div>
${slider("fontSize", "ফন্ট সাইজ", "Font size", 10, 90, 45, "%")}
${slider("strokeWidth", "আউটলাইন", "Outline", 0, 20, 6, "px")}
          <div class="field">
            <label for="textColor" data-bn="টেক্সটের রং" data-en="Text colour">টেক্সটের রং</label>
            <input type="color" id="textColor" value="#ffffff" style="height:44px;padding:4px">
          </div>
          <div class="field">
            <label for="strokeColor" data-bn="আউটলাইনের রং" data-en="Outline colour">আউটলাইনের রং</label>
            <input type="color" id="strokeColor" value="#000000" style="height:44px;padding:4px">
          </div>
          <label class="check-field">
            <input type="checkbox" id="uppercase" checked>
            <span data-bn="সব বড় হাতের অক্ষরে" data-en="Force UPPERCASE">সব বড় হাতের অক্ষরে</span>
          </label>
${formatChips("jpeg")}
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "মিমে ব্যবহার করতে চাওয়া ছবিটি বাছুন।", sen: "Pick the photo for your meme." },
      { bn: "২. লেখা লিখুন", en: "2. Write the caption", sbn: "উপরে ও নিচে মজার লেখা লিখুন।", sen: "Write a funny line for the top and bottom." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "মিমটি ডাউনলোড করে বন্ধুদের পাঠান।", sen: "Download the meme and share it." }
    ],
    faq: [
      { qbn: "এই মিম জেনারেটর কি ফ্রি?", qen: "Is this meme generator free?", abn: "হ্যাঁ, সম্পূর্ণ ফ্রি — কোনো ওয়াটারমার্ক বা সাইন-আপ ছাড়াই।", aen: "Yes, completely free — no watermark and no sign-up.", },
      { qbn: "মিম কি অন্যরা ব্যবহার করতে পারবে?", qen: "Can I use memes I make here elsewhere?", abn: "হ্যাঁ, ডাউনলোড করা ছবি আপনার নিজের, কোনো অতিরিক্ত লাইসেন্স শর্ত নেই।", aen: "Yes — the image you download is yours, with no extra licence restrictions.", },
      { qbn: "বাংলা টেক্সট লিখতে পারব?", qen: "Can I write in Bengali?", abn: "হ্যাঁ, বাংলা ও ইংরেজি — দুই ভাষাতেই লেখা যায়। বাংলার জন্য Noto Sans Bengali ব্যবহার করা হয়।", aen: "Yes — both Bengali and English work; Bengali uses the Noto Sans Bengali font.", },
      { qbn: "ছবিটি কি আপলোড হয়?", qen: "Is the photo uploaded?", abn: "না, টেক্সট আঁকা ও ফাইল তৈরি সবই ব্রাউজারেই হয়।", aen: "No — the caption is drawn and the file is created entirely in your browser.", },
      { qbn: "মিমে বাংলা লেখা যাবে?", qen: "Can I write Bengali on a meme?", abn: "হ্যাঁ — বাংলা ও ইংরেজি দুই ভাষাতেই লেখা যায়। বাংলার জন্য Noto Sans Bengali ফন্ট ব্যবহার করা হয়, তাই যুক্তাক্ষর ঠিকভাবে দেখায়।", aen: "Yes — Bengali works alongside English. Bengali text uses the Noto Sans Bengali font, so joined letters render correctly.", },
      { qbn: "লেখা ছবির বাইরে চলে গেলে কী করব?", qen: "What if the caption is too long to fit?", abn: "“ফিট টু ইমেজ” বাটনটি লেখার আকার ছবির প্রস্থের সঙ্গে মেলাবে, তাই লম্বা লেখাও ফ্রেমের ভেতরেই থাকবে।", aen: "The “Fit to image” button scales the caption to the photo width, so even a long line stays inside the frame." },

    ]
  },

  {
    slug: "circle-crop.html",
    title: "গোলাকার ছবি কাটুন | Circle Crop — Round Avatar Maker Free",
    desc: "ছবি গোল বা বর্গাকার করে কেটে প্রোফাইল ফটো, অ্যাভাটার ও লগো তৈরি করুন — ট্রান্সপারেন্ট PNG সহ ফ্রি। Crop images into a circle or rounded square for avatars, profile photos and logos — free, no upload.",
    descEn: "Crop a photo into a circle or rounded square for avatars, profile pictures and logos, with transparent PNG output. Free browser tool — no upload.",
    keywords: "circle crop photo, round profile picture, avatar maker, গোল ছবি কাটুন, profile photo circle free",
    h1bn: "গোলাকার ছবি কাটুন (Circle Crop)",
    h1en: "Circle Crop — Round Avatar Maker",
    subbn: "প্রোফাইল ফটো, ফেসবুক কভার বা অ্যাভাটারের জন্য ছবি গোল করে কেটে নিন — জুম ও অবস্থান স্লাইডারে ঠিক করুন।",
    suben: "Turn any photo into a circular avatar or rounded square — adjust zoom and position with sliders and export a transparent PNG.",
    shortBn: "গোল ছবি (অ্যাভাটার)",
    shortEn: "Circle crop",
    shortDescBn: "ছবি গোল করে অ্যাভাটার ও প্রোফাইল ফটো তৈরি করুন।",
    shortDescEn: "Crop photos into circles for avatars and profile pictures.",
    icon: icon('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M7.5 19c1.2-2 2.8-3 4.5-3s3.3 1 4.5 3"/>'),
    scripts: ["js/circle.js"],
    panel: `      <section class="tool-panel" aria-label="Circle crop tool">
${dropzone('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M7.5 19c1.2-2 2.8-3 4.5-3s3.3 1 4.5 3"/>', "ছবি এখানে ড্র্যাগ করুন", "Drag your photo here", "অথবা ক্লিক করে ফাইল বাছুন — JPG, PNG, WebP", "Or click to choose a file — JPG, PNG, WebP")}
        <div class="controls" id="controls" hidden>
          <div class="preview-frame"><canvas id="canvas"></canvas></div>
          <div>
            <span class="field-label" data-bn="আকৃতি" data-en="Shape">আকৃতি</span>
            <div class="chip-row" id="shapeRow">
              <button type="button" class="chip active" data-shape="circle" data-bn="গোল" data-en="Circle">গোল</button>
              <button type="button" class="chip" data-shape="rounded" data-bn="গোলাকার বর্গ" data-en="Rounded square">গোলাকার বর্গ</button>
            </div>
          </div>
${slider("zoom", "জুম", "Zoom", 100, 300, 100, "%")}
${slider("posX", "সামনে-পেছনে", "Horizontal", -100, 100, 0)}
${slider("posY", "উপরে-নিচে", "Vertical", -100, 100, 0)}
          <div class="field">
            <label for="outSize" data-bn="আউটপুট সাইজ" data-en="Output size">আউটপুট সাইজ</label>
            <select id="outSize" style="max-width:240px">
              <option value="512">512 × 512 px</option>
              <option value="1024">1024 × 1024 px</option>
              <option value="256">256 × 256 px</option>
            </select>
          </div>
          <div class="field">
            <label for="shapeColor" data-bn="ব্যাকগ্রাউন্ড রং" data-en="Background colour">ব্যাকগ্রাউন্ড রং</label>
            <input type="color" id="shapeColor" value="#ffffff" style="height:44px;padding:4px">
            <div class="hint" data-bn="PNG আউটপুটে “#ffffff” হলে স্বচ্ছ হয় না — স্বচ্ছ রাখতে ফাইলটি PNG নিন।" data-en="For a transparent result export as PNG (the colour fills only the shape area).">PNG আউটপুটে "#ffffff" হলে স্বচ্ছ হয় না — স্বচ্ছ রাখতে ফাইলটি PNG নিন।</div>
          </div>
${compareBoxes("আগের সাইজ", "Original size", "নতুন সাইজ", "New size")}
          <div class="status-line" id="status"></div>
${actionBar("ডাউনলোড করুন (PNG)")}
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি দিন", en: "1. Add a photo", sbn: "যে ছবিটি গোল করতে চান সেটি বাছুন।", sen: "Choose the photo to make round." },
      { bn: "২. ফ্রেম ঠিক করুন", en: "2. Frame it", sbn: "জুম ও অবস্থান স্লাইডারে ঠিক করে মুখ ভালোভাবে রাখুন।", sen: "Use zoom and position sliders so the face sits perfectly." },
      { bn: "৩. ডাউনলোড করুন", en: "3. Download", sbn: "PNG ফাইলটি সেভ করে প্রোফাইলে ব্যবহার করুন।", sen: "Save the PNG and use it as your profile picture." }
    ],
    faq: [
      { qbn: "আউটপুট ছবির পেছনে স্বচ্ছ থাকবে?", qen: "Is the output transparent outside the circle?", abn: "হ্যাঁ — PNG আউটপুটে গোলের বাইরের অংশ স্বচ্ছ থাকে, যা প্রোফাইল ফটোর জন্য দরকার।", aen: "Yes — with PNG output everything outside the circle is transparent, which is what profile pictures need.", },
      { qbn: "ছবি ছোট হলে জুম কি লাগবে?", qen: "What if my photo is small?", abn: "জুম স্লাইডারে ২০০% পর্যন্ত বাড়িয়ে ফ্রেম পূরণ করতে পারেন, তবে অতিরিক্ত জুম ছবিকে ঝাপসা করে।", aen: "Raise zoom up to 200% to fill the frame, though very high zoom can soften the photo.", },
      { qbn: "গোল ছবি কি ফেসবুক প্রোফাইলে কাজ করবে?", qen: "Will a round photo work as a Facebook profile picture?", abn: "হ্যাঁ, ফেসবুক প্রোফাইল ছবি বৃত্তাকার হওয়ায় গোল ফ্রেম খুবই মানানসই।", aen: "Yes — Facebook crops profile pictures to a circle, so a round image fits perfectly.", },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the photo uploaded?", abn: "না, কাটাকাঁচা সম্পূর্ণ আপনার ব্রাউজারে হয়।", aen: "No — all cropping happens in your browser.", },
      { qbn: "ছবিটি বর্গাকার না হলে কী হবে?", qen: "What if my photo is not square?", abn: "কোনো সমস্যা নেই। টুলটি ছবির কেন্দ্র ধরে ফ্রেমের সবচেয়ে ছোট দিক মেনে কাটে, তাই ছবির কোনো অংশ নষ্ট হয় না।", aen: "No problem. The tool crops from the centre along the shortest side, so none of your photo is stretched or squashed.", },
      { qbn: "কত পিক্সেলের ছবি দিলে ভালো ফল পাব?", qen: "What resolution should I upload?", abn: "ফ্রেমের দ্বিগুণ চওড়ার ছবি দিলে সবচেয়ে পরিষ্কার ফল পাবেন। ১০০০ পিক্সেল চওড়া ছবি সাধারণত যথেষ্ট।", aen: "Use an image twice as wide as the frame for the sharpest result. A 1000-pixel-wide photo is usually plenty." },

    ]
  }
];