/** Tool configs: image to PDF, batch processing */
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const multiDropzone = (iconPaths, titleBn, titleEn, hintBn, hintEn) => `        <div class="dropzone" id="dropzone" tabindex="0" role="button">
          ${icon(iconPaths).replace('<svg', '<svg class="dz-icon"')}
          <div class="dz-title" data-bn="${titleBn}" data-en="${titleEn}">${titleBn}</div>
          <div class="dz-hint" data-bn="${hintBn}" data-en="${hintEn}">${hintBn}</div>
          <input type="file" id="fileInput" accept="image/*" multiple>
        </div>`;

const PDF_PATH = '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>';
const BATCH_PATH = '<path d="M4 6h16M4 12h16M4 18h10"/><path d="m18 16 3 2-3 2"/>';

const slider = (id, bn, en, min, max, value, unit) => `            <div class="field">
              <div class="slider-head">
                <span class="field-label" data-bn="${bn}" data-en="${en}">${bn}</span>
                <span class="slider-value"><span id="${id}Val">${value}</span>${unit || ""}</span>
              </div>
              <input type="range" id="${id}" min="${min}" max="${max}" value="${value}">
            </div>`;

export default [
  {
    slug: "image-to-pdf.html",
    title: "ছবি থেকে PDF | Image to PDF Converter — Free, No Upload",
    desc: "একাধিক ছবি একটি PDF ফাইলে জোড়া লাগান — A4, Letter বা ছবির মাপে, মার্জিন ঠিক করে। Combine images into one PDF in A4, Letter or image-fit pages — free and 100% in your browser.",
    descEn: "Combine multiple images into a single PDF with A4, Letter or image-fit page sizes and custom margins. Free browser tool — images never leave your device.",
    keywords: "image to pdf, jpg to pdf, convert images to pdf, ছবি থেকে pdf, photo to pdf free",
    h1bn: "ছবি থেকে PDF তৈরি করুন (Image to PDF)",
    h1en: "Image to PDF Converter",
    subbn: "এক বা একাধিক ছবি বেছে নিয়ে একটি PDF ফাইলে রূপান্তর করুন — কোনো আপলোড বা সাইন-আপ ছাড়াই।",
    suben: "Pick one or many photos and merge them into a single PDF — no upload, no sign-up, no watermark.",
    shortBn: "ছবি থেকে PDF",
    shortEn: "Image to PDF",
    shortDescBn: "একাধিক ছবি একটি PDF-তে জোড়া লাগান।",
    shortDescEn: "Merge many photos into one PDF file.",
    icon: icon(PDF_PATH),
    scripts: ["js/pdf.js"],
    panel: `      <section class="tool-panel" aria-label="Image to PDF tool">
${multiDropzone(PDF_PATH, "এক বা একাধিক ছবি দিন", "Drop one or many images", "JPG, PNG, WebP — একসাথে একাধিক ছবি বেছে নিতে পারেন", "JPG, PNG, WebP — you can select several files at once")}
        <div class="controls" id="controls" hidden>
          <div id="fileList" class="chip-row"></div>
          <div>
            <span class="field-label" data-bn="পেজের সাইজ" data-en="Page size">পেজের সাইজ</span>
            <div class="chip-row" id="pageSizeRow">
              <button type="button" class="chip active" data-size="a4">A4</button>
              <button type="button" class="chip" data-size="letter">Letter</button>
              <button type="button" class="chip" data-size="fit" data-bn="ছবির মাপে" data-en="Fit to image">ছবির মাপে</button>
            </div>
          </div>
          <div>
            <span class="field-label" data-bn="ওরিয়েন্টেশন" data-en="Orientation">ওরিয়েন্টেশন</span>
            <div class="chip-row" id="orientRow">
              <button type="button" class="chip active" data-orient="portrait" data-bn="পোর্ট্রেট" data-en="Portrait">পোর্ট্রেট</button>
              <button type="button" class="chip" data-orient="landscape" data-bn="ল্যান্ডস্কেপ" data-en="Landscape">ল্যান্ডস্কেপ</button>
            </div>
          </div>
${slider("margin", "মার্জিন", "Margin", 0, 30, 10, "mm")}
${slider("pdfQuality", "কোয়ালিটি", "Quality", 50, 100, 92, "%")}
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="downloadBtn" data-bn="PDF ডাউনলোড করুন" data-en="Download PDF">PDF ডাউনলোড করুন</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আবার শুরু" data-en="Start over">আবার শুরু</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি বাছুন", en: "1. Choose images", sbn: "একাধিক ছবি একসাথে বেছে নিন (ক্রট+ক্লিক বা টাচ-অ্যান্ড-হোল্ড)।", sen: "Select several images at once (Ctrl+click or touch-and-hold)." },
      { bn: "২. পেজ সেট করুন", en: "2. Set the page", sbn: "A4/Letter, ওরিয়েন্টেশন ও মার্জিন ঠিক করুন।", sen: "Pick A4 or Letter, the orientation and the margin." },
      { bn: "৩. PDF নিন", en: "3. Get the PDF", sbn: "এক ক্লিকে PDF ডাউনলোড করুন।", sen: "Download the finished PDF in one click." }
    ],
    faq: [
      { qbn: "ছবি কি PDF বানাতে আপলোড হয়?", qen: "Are the images uploaded to build the PDF?", abn: "না। পুরো PDF ফাইলটি আপনার ব্রাউজারেই তৈরি হয়, কোনো ছবি সার্ভারে যায় না।", aen: "No. The PDF is assembled entirely inside your browser — no image is sent to any server.", },
      { qbn: "একসাথে কয়টি ছবি যোগ করা যায়?", qen: "How many images can I combine?", abn: "যত খুশি। তবে ফোনে বড় সংখ্যা ছবি হলে ব্রাউজারের মেমরির কথা মাথায় রাখুন।", aen: "As many as you like — though very large batches on a phone can hit browser memory limits.", },
      { qbn: "PDF-এ কি কোয়ালিটি কমবে?", qen: "Does quality drop in the PDF?", abn: "ছবি JPEG হিসেবে বসে, তাই কোয়ালিটি স্লাইডারে নিয়ন্ত্রণ করা যায় এবং প্রায় কোনো দৃশ্যমান ক্ষতি হয় না।", aen: "Images are embedded as JPEG, so the quality slider controls the tradeoff with almost no visible loss." },
      { qbn: "ফাইলের নাম কী হবে?", qen: "What will the file be called?", abn: "আপনার প্রথম ছবির নাম থেকে তৈরি, যেমন `photo.pdf`।", aen: "It is named after your first image, for example `photo.pdf`." },
      { qbn: "PDF ফাইলের সাইজ কতটা বড় হবে?", qen: "How large will the PDF be?", abn: "প্রায় ছবিগুলোর মোট ফাইল সাইজের কাছাকাছি। খুব ছোট PDF চাইলে আগে ছবিগুলো কমপ্রেস করে নিন।", aen: "Roughly the combined size of the images. If you need a small PDF, compress the images first.", },
      { qbn: "PDF-তে ছবির ক্রম কি বদলানো যায়?", qen: "Can I reorder the images in the PDF?", abn: "হ্যাঁ — ছবি তালিকায় টেনে নতুন ছবির উপরে বা নিচে সরান। ক্রম অনুযায়ী PDF-তে পেজ বসবে।", aen: "Yes — drag the thumbnails to change the order, and the pages follow that sequence." },

    ]
  },

  {
    slug: "batch-image.html",
    title: "ব্যাচ ছবি প্রসেসিং | Bulk Resize, Compress & Convert Images Online",
    desc: "একসাথে অনেক ছবি রিসাইজ, কম্প্রেস বা কনভার্ট করুন এবং ZIP ডাউনলোড করুন — ফ্রি, আপলোড ছাড়াই। Bulk process many images at once: resize, compress or convert them, then download everything as a ZIP — free, no upload.",
    descEn: "Bulk resize, compress or convert dozens of images in one run and download the results as a single ZIP. Free browser-based batch tool — nothing is uploaded.",
    keywords: "bulk image resize, batch compress images, convert multiple images, একাধিক ছবি রিসাইজ, batch image converter",
    h1bn: "ব্যাচ ছবি প্রসেসিং (Bulk Image Editor)",
    h1en: "Bulk Image Processing",
    subbn: "অনেক ছবি একসাথে রিসাইজ, কম্প্রেস বা কনভার্ট করুন — সব ফল একসাথে ZIP হিসেবে নিন।",
    suben: "Resize, compress or convert many photos in one run, then grab every result as a single ZIP file.",
    shortBn: "ব্যাচ প্রসেসিং",
    shortEn: "Batch tools",
    shortDescBn: "অনেক ছবি একসাথে রিসাইজ/কম্প্রেস/কনভার্ট করুন।",
    shortDescEn: "Resize, compress or convert many images at once.",
    icon: icon(BATCH_PATH),
    scripts: ["js/zip.js", "js/batch.js"],
    panel: `      <section class="tool-panel" aria-label="Batch processing">
${multiDropzone(BATCH_PATH, "একাধিক ছবি দিন", "Drop many images here", "যত খুশি ছবি একসঙ্গে বেছে নিন", "Select as many images as you like")}
        <div class="controls" id="controls" hidden>
          <div id="fileList" class="chip-row"></div>
          <div>
            <span class="field-label" data-bn="কী করতে চান?" data-en="What should we do?">কী করতে চান?</span>
            <div class="chip-row" id="opRow">
              <button type="button" class="chip active" data-op="resize" data-bn="সাইজ পরিবর্তন" data-en="Resize">সাইজ পরিবর্তন</button>
              <button type="button" class="chip" data-op="compress" data-bn="সাইজ কমান" data-en="Compress">সাইজ কমান</button>
              <button type="button" class="chip" data-op="convert" data-bn="ফরম্যাট কনভার্ট" data-en="Convert">ফরম্যাট কনভার্ট</button>
            </div>
          </div>
          <div id="opResize">
            <div class="field" style="max-width:260px">
              <label for="batchWidth" data-bn="প্রস্থ (px)" data-en="Width (px)">প্রস্থ (px)</label>
              <input type="number" id="batchWidth" min="16" max="8000" value="1200">
              <div class="hint" data-bn="উচ্চতা অনুপাত অনুযায়ী নিজে থেকেই ঠিক হবে।" data-en="Height is calculated automatically to keep the aspect ratio.">উচ্চতা অনুপাত অনুযায়ী নিজে থেকেই ঠিক হবে।</div>
            </div>
          </div>
          <div id="opCompress" hidden>
${slider("batchQuality", "কোয়ালিটি", "Quality", 20, 95, 70, "%")}
          </div>
          <div id="opConvert" hidden>
            <span class="field-label" data-bn="টার্গেট ফরম্যাট" data-en="Target format">টার্গেট ফরম্যাট</span>
            <div class="chip-row" id="batchFormatRow">
              <button type="button" class="chip active" data-format="image/jpeg">JPG</button>
              <button type="button" class="chip" data-format="image/webp">WebP</button>
              <button type="button" class="chip" data-format="image/png">PNG</button>
            </div>
          </div>
          <div id="batchResults" class="chip-row"></div>
          <div class="status-line" id="status"></div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" id="runBtn" data-bn="সব ছবি প্রসেস করুন" data-en="Process all images">সব ছবি প্রসেস করুন</button>
            <button type="button" class="btn btn-accent" id="zipBtn" data-bn="সব ফলাফল ZIP-এ নিন" data-en="Download results as ZIP">সব ফলাফল ZIP-এ নিন</button>
            <button type="button" class="btn btn-ghost" id="resetBtn" data-bn="আবার শুরু" data-en="Start over">আবার শুরু</button>
          </div>
        </div>
      </section>`,
    steps: [
      { bn: "১. ছবি বাছুন", en: "1. Choose images", sbn: "ফোল্ডার থেকে একসাথে অনেক ছবি সিলেক্ট করুন।", sen: "Select many images from your folder at once." },
      { bn: "২. কাজ বাছুন", en: "2. Choose an action", sbn: "রিসাইজ, কম্প্রেস বা কনভার্ট — সাথে সেটিং।", sen: "Resize, compress or convert, then set the options." },
      { bn: "৩. ফল নিন", en: "3. Get the results", sbn: "আলাদা আলাদা ডাউনলোড নিন বা সব একসাথে ZIP হিসেবে।", sen: "Download files one by one or grab everything as a ZIP." }
    ],
    faq: [
      { qbn: "একসাথে কত ছবি নেওয়া যায়?", qen: "How many images can I process at once?", abn: "ব্রাউজারের ওপর নির্ভর করে — সাধারণত ২০–৫০টি ছবি একসাঙ্গে সামলানো যায়। খুব বড় ব্যাচ ভাগ করে নিন।", aen: "It depends on the browser — 20–50 images at once is comfortable. Split very large batches." },
      { qbn: "ZIP ফাইলে কি কিছু কমানো হয়?", qen: "Is the ZIP compressed?", abn: "ZIP-টি দ্রুততার জন্য store মোডে তৈরি হয়; ছবি ইতিমধ্যেই কম্প্রেসড ফাইল, তাই আলাদা কম্প্রেশনের দরকার হয় না।", aen: "The ZIP is created in store mode for speed — images are already compressed, so extra compression is unnecessary." },
      { qbn: "ছবিগুলো কি একে অপরের উপর প্রভাব ফেলে?", qen: "Do the images affect each other?", abn: "না, প্রতিটি ছবি আলাদাভাবে প্রসেস হয় এবং আলাদা নামে ডাউনলোড হয়।", aen: "No. Each image is processed independently and downloaded separately." },
      { qbn: "ব্যাচ প্রসেসিং কি আপলোড ছাড়াই?", qen: "Is batch processing upload-free?", abn: "হ্যাঁ, সব ছবি আপনার ডিভাইসেই প্রসেস হয় এবং ZIP ও সেই ডিভাইসেই তৈরি হয়।", aen: "Yes — every image and the resulting ZIP are created on your device." },
      { qbn: "একসাঙ্গে সর্বোচ্চ কতটি ছবি নেওয়া যায়?", qen: "How many images can I process at once?", abn: "কোনো কঠিন সীমা নেই, তবে ফোনের মেমোরি ও ব্রাউজারের সাপোর্টের উপর নির্ভর করে। ২০–৫০টি ছবি সাধারণত নির্বিঘ্নে চলে।", aen: "No hard limit, though it depends on your phone's memory and the browser. 20–50 images usually run smoothly." },
      { qbn: "ব্যাচ প্রসেসিং ধীর হলে কী করব?", qen: "What if batch processing feels slow?", abn: "প্রতিটি ছবি Canvas-এ আলাদাভাবে প্রসেস হয়, তাই অনেক ছবিতে সময় লাগে। ফল একসাঙ্গে না দেখে ধাপে ধাপে চালালে দ্রুত হয়।", aen: "Each image is processed separately on the Canvas, which takes time in bulk. Processing in smaller batches feels faster." },

    ]
  }
];