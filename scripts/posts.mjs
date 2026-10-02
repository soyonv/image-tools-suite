/** Blog posts — ছবির সহায়ক
 * -------------------------------------------------------------------------
 * Long-form bilingual articles that target a specific search intent and
 * link into the matching tool. Each post gets its own title, meta
 * description, keywords, H1, FAQ and JSON-LD from the generator.
 */
const icon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export default [
  {
    slug: "whatsapp-photo-size.html",
    date: "2026-10-01",
    readingBn: "৪ মিনিটের পড়া",
    readingEn: "4 min read",
    title: "হোয়াটসঅ্যাপে ছবি পাঠানোর আগে সাইজ কমান — WhatsApp Photo Size Guide",
    desc: "হোয়াটসঅ্যাপে ছবি যোগ করা হচ্ছে না? ১৬ মেগাবাইটের লিমিটের মধ্যে ছবি ছোট করার সহজ উপায় ধাপে ধাপে দেখানো হলো। WhatsApp photo not sending? Here is how to reduce image size under the 16 MB limit, step by step.",
    descEn: "WhatsApp will not send your photo? A step-by-step guide to getting any image under WhatsApp's 16 MB limit, with the exact quality and size settings that keep it looking sharp.",
    keywords: "whatsapp photo size, reduce photo size for whatsapp, ছবি সাইজ কমান হোয়াটসঅ্যাপ, 16mb photo limit, compress image for whatsapp",
    h1bn: "হোয়াটসঅ্যাপে ছবি পাঠানোর সঠিক সাইজ",
    h1en: "WhatsApp Photo Size: How to Send Any Photo",
    subbn: "হোয়াটসঅ্যাপ প্রতি ছবিতে ১৬ মেগাবাইট সীমা রাখে। এই ছবিটি কীভাবে ছোট করবেন — না দেখেই বুঝে নিন।",
    suben: "WhatsApp caps each photo at 16 MB. Here is exactly how to get any image under that limit without it looking bad.",
    icon: icon('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.7 8.4 8.4 0 0 1 8.5-8.4 8.4 8.4 0 0 1 8.5 8.4z"/>'),
    tools: ["compress-image.html", "resize-image.html", "png-to-jpg.html"],
    sections: [
      {
        h2bn: "হোয়াটসঅ্যাপের সাইজ সীমা কত?",
        h2en: "What is WhatsApp's size limit?",
        pbn: [
          "হোয়াটসঅ্যাপে একটি ছবি পাঠানোর সর্বোচ্চ সাইজ **১৬ মেগাবাইট**। এর বেশি হলে ছবিটি আপলোড হয় না এবং আপনি একটি লাল ত্রুটির বার্তা দেখেন।",
          "একটি আধুনিক ফোনের ক্যামেরা সাধারণত ৩–৮ মেগাবাইটের ছবি তোলে, যা হোয়াটসঅ্যাপে সহজেই পাঠানো যায়। কিন্তু ভিডিও থেকে তোলা ফ্রেম, স্ক্রিনশট বা এডিট করা ছবি সহজেই ১৬ মেগাবাইট ছাড়িয়ে যায়।",
          "ভালো খবর হলো — ছবি ছোট করা মানে ছবি নষ্ট করা নয়। সঠিক উপায়ে কমালে সাধারণ ফোনের স্ক্রিনে পার্থক্য টের পাওয়া যায় না।"
        ],
        pen: [
          "WhatsApp allows a maximum of **16 MB per photo**. Go over that and the upload simply fails, usually with a red error and no explanation.",
          "A modern phone camera typically produces 3–8 MB photos, which send fine. But a screenshot, a frame grabbed from a video, or a heavily edited image can easily exceed 16 MB.",
          "The good news: shrinking a photo does not have to damage it. Done correctly, the difference is invisible on a normal phone screen."
        ]
      },
      {
        h2bn: "ধাপে ধাপে: ছবি ছোট করে পাঠান",
        h2en: "Step by step: shrink the photo and send it",
        pbn: [
          "১. আপনার ছবিটি এই পাতায় নিয়ে আসুন।",
          "২. **কোয়ালিটি স্লাইডারটি ৭০ থেকে ৮০%** এর মধ্যে রাখুন — এটিই সবচেয়ে ভালো দৃশ্য-স্থায়ী ফলাফল দেয়।",
          "৩. আউটপুট ফরম্যাট **JPG** রাখুন। PNG বড় আকারে আসে এবং সাধারণ ফটোর জন্য দরকার নেই।",
          "৪. নতুন সাইজ দেখে ফলাফল সন্তুষ্ট হলে ডাউনলোড করুন।",
          "৫. ফাইলটি হোয়াটসঅ্যাপে আট্যাচ করে পাঠিয়ে দিন — এবার কোনো ত্রুটি আসবে না।"
        ],
        pen: [
          "1. Bring your photo into the tool on this page.",
          "2. Set the **quality slider to 70–80%**. This is the sweet spot: visibly sharp, dramatically smaller.",
          "3. Keep the output format as **JPG**. PNG produces far larger files and adds nothing for an ordinary photo.",
          "4. Check the before/after sizes. If you are happy, download it.",
          "5. Attach the new file in WhatsApp — it will send normally this time."
        ]
      },
      {
        h2bn: "কেন JPG, আর PNG নয়?",
        h2en: "Why JPG and not PNG?",
        pbn: [
          "JPG একটি **লসি কম্প্রেশন** ফরম্যাট — অর্থাৎ সংরক্ষণের সময় কিছু তথ্য বাদ দেয়, যার ফলে ফাইল অনেক ছোট হয়। PNG **লসলেস**, তাই প্রতিটি পিক্সেল অপরিবর্তিত থাকে কিন্তু ফাইলের আকার প্রায় ৫–১০ গুণ বড় হয়।",
          "সাধারণ ছবি, স্ক্রিনশট বা হোয়াটসঅ্যাপের জন্য JPG-ই সঠিক পছন্দ। শুধু তখনই PNG ব্যবহার করুন, যখন ছবিতে **স্বচ্ছতা** দরকার — যেমন লোগো, আইকন বা গোল ছবির কাটা প্রান্ত।"
        ],
        pen: [
          "JPG uses **lossy compression** — it discards a little detail while saving, which is exactly why the file shrinks so much. PNG is **lossless**: every pixel survives, but the file can be 5–10 times larger.",
          "For ordinary photos, screenshots and anything heading to WhatsApp, JPG is the right choice. Reach for PNG only when you need **transparency** — a logo, an icon, or a circle-cropped image."
        ]
      },
      {
        h2bn: "খুব ছোট ফাইল দরকার হলে",
        h2en: "If you need an even smaller file",
        pbn: [
          "কোনো ফর্ম বা ওয়েবসাইটে আপলোডের সীমা ৫০০ কিলোবাইট বা তার কম হলে, কোয়ালিটির পাশাপাশি **ছবির প্রস্থ-দৈর্ঘ্যও** ছোট করে নিন। একটি ৪০০ পিক্সেল-চওড়া ছবি সাধারণ ফোনের স্ক্রিনে পরিষ্কার দেখায়, অথচ তার ফাইল আকার এক তৃতীয়াংশে নেমে আসে।",
          "ছবি ছোট করার পরেও যদি ফাইল বড় থাকে, তাহলে ধাপে ধাপে ছোট করার বদলে **টার্গেট সাইজ** বেছে নিন — টুলটি আপনার নির্দিষ্ট কিলোবাইট সীমার কাছাকাছি ফল দেবে।"
        ],
        pen: [
          "If a form or website caps uploads at 500 KB or less, shrink the **dimensions** as well as the quality. A 400-pixel-wide image looks perfectly sharp on a phone screen while weighing roughly a third as much.",
          "If the file is still too big after that, switch from the quality slider to a **target size** setting — the tool will search for the best quality that still fits your exact kilobyte budget."
        ]
      }
    ],
    faq: [
      { qbn: "হোয়াটসঅ্যাপে সর্বোচ্চ কত মেগাবাইট ছবি পাঠানো যায়?", qen: "What is the maximum photo size on WhatsApp?", abn: "প্রতি ছবিতে ১৬ মেগাবাইট। ভিডিও ফাইলে ১৬ মেগাবাইট, ডকুমেন্টে ১০০ মেগাবাইট পর্যন্ত যায়।", aen: "16 MB per photo. Videos also cap at 16 MB, while documents can go up to 100 MB." },
      { qbn: "ছবি ছোট করলে কি কোয়ালিটি নষ্ট হয়?", qen: "Does compressing reduce photo quality?", abn: "সঠিক কোয়ালিটিতে কমালে ফোনের স্ক্রিনে পার্থক্য প্রায় খুঁজে পাওয়া যায় না। ৭০–৮০% কোয়ালিটি এই কাজের জন্য সবচেয়ে ভালো।", aen: "At the right setting, the difference is nearly invisible on a phone screen. 70–80% quality is the sweet spot." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is my photo uploaded?", abn: "না। ছোট করার পুরো কাজ আপনার ব্রাউজারের Canvas-এ হয়, কোনো ফাইল সার্ভারে যায় না।", aen: "No. All processing happens in your browser's Canvas — no file ever leaves your device." },
      { qbn: "একাধিক ছবি একসাথে ছোট করা যাবে?", qen: "Can I compress several photos at once?", abn: "হ্যাঁ — ব্যাচ টুল দিয়ে একসাগে অনেক ছবি কমপ্রেস করে ZIP ফাইল হিসেবে নিতে পারবেন।", aen: "Yes — the batch tool compresses many photos at once and hands them back as a single ZIP." },
      { qbn: "হোয়াটসঅ্যাপে ছবি পাঠানোর সবচেয়ে ভালো মাপ কোনটি?", qen: "What is the best size for a WhatsApp photo?", abn: "১৬০০ × ১২০০ পিক্সেলের মধ্যে রাখলেই ফোনে পরিষ্কার দেখায়, অথচ ফাইল ১ মেগাবাইটের নিচে থাকে।", aen: "Stay under 1600 × 1200 pixels — it still looks sharp on a phone while staying below 1 MB." },
      { qbn: "ছবি ছোট করার পর ফাইলের নাম বদলাবে কি?", qen: "Does the file name change after compressing?", abn: "মূল নাম থাকে, শুধু আগে সাইজের বদলে নতুন KB ভর লেখা হয় — তাই আগের ছবি ও ভুলে যায় না।", aen: "The original name is kept; only the size suffix is replaced with the new KB value, so you never overwrite the old file." }
    ]
  },

  {
    slug: "passport-photo-size-guide.html",
    date: "2026-10-01",
    readingBn: "৫ মিনিটের পড়া",
    readingEn: "5 min read",
    title: "পাসপোর্ট সাইজ ছবি — বাংলাদেশ ও ভিসার নিয়ম | Passport Photo Size Guide",
    desc: "পাসপোর্ট সাইজ ছবির সঠিক মাপ কত? ৩৫×৪৫ মিমি, ৪০×৫০ মিমি ও ২×২ ইঞ্চি — DPI, মুখের অবস্থান ও সাদা ব্যাকগ্রাউন্ডসহ পূর্ণ গাইড। What is the correct passport photo size? A complete guide to 35×45 mm, 40×50 mm and 2×2 inch specs, DPI, head position and background rules.",
    descEn: "Everything about passport photo sizes: exact millimetre dimensions for Bangladesh and international applications, 300 DPI printing, correct head position, background colour and common rejection reasons.",
    keywords: "passport photo size, passport photo Bangladesh, 35x45 photo, পাসপোর্ট সাইজ ছবি, visa photo size, 2x2 inch photo",
    h1bn: "পাসপোর্ট সাইজ ছবি: সঠিক মাপ ও নিয়ম",
    h1en: "Passport Photo Size: The Complete Guide",
    subbn: "বাংলাদেশ ও আন্তর্জাতিক ভিসার ছবির সঠিক মাপ, ডিপিআই, মুখের অবস্থান ও ব্যাকগ্রাউন্ড — এক পাতায় সব।",
    suben: "Exact dimensions for Bangladesh and international applications, plus DPI, head position and the background rules that cause most rejections.",
    icon: icon('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.2"/><path d="m4 18 5-4 3 2.5"/>'),
    tools: ["passport-photo.html", "crop-image.html", "add-border.html"],
    sections: [
      {
        h2bn: "প্রচলিত পাসপোর্ট সাইজ",
        h2en: "The common passport photo sizes",
        pbn: [
          "বাংলাদেশে সাধারণত **৩৫ × ৪৫ মিমি** ব্যবহার করা হয়, যা ৩০ × ৪০ মিমি ছোট সাইজের পাশাপাশি থাকে। আমেরিকা, কানাডা ও অনেক দেশে **২ × ২ ইঞ্চি** (৫০ × ৫০ মিমি) প্রয়োজন হয়।",
          "ভিসা অনুযায়ী মাপ বদলায়, তাই আবেদনের আগে সংশ্লিষ্ট দূতাবহ সরকারি সাইট বা দূতাবহের নির্দেশনা দেখে নেওয়াই সবচেয়ে নিরাপদ। এই টুলে প্রচলিত কয়েকটি প্রিসেট একসাঙ্গে দেওয়া আছে।"
        ],
        pen: [
          "Bangladesh most commonly uses **35 × 45 mm**, often offered alongside the smaller 30 × 40 mm. The United States, Canada and many other countries ask for **2 × 2 inches** (50 × 50 mm).",
          "Visa requirements vary, so always confirm against the official consulate or immigration page before applying. This tool includes the most common presets side by side."
        ]
      },
      {
        h2bn: "প্রিন্টের জন্য সঠিক DPI",
        h2en: "Getting the DPI right for printing",
        pbn: [
          "ফটো প্রিন্টারে ছবি ছোট দেখাবে বা পিক্সেলে ভেঙে যাবে — এর কারণ হলো DPI। **৩০০ DPI** হলো ছবির প্রচলিত মান; এর নিচে ছবি ফাইল সঠিক মাপে ছাপলেও ঝাপসা দেখাবে।",
          "৩৫ × ৪৫ মিমি ছবি ৩০০ DPI-তে প্রায় **৪১৩ × ৫৩১ পিক্সেল** হয়। আমাদের পাসপোর্ট টুল ঠিক এই পিক্সেল মাপেই ছবি তৈরি করে, তাই কাগজে ছাপলেও পরিষ্কার ফল পাবেন।"
        ],
        pen: [
          "A photo can print at the right physical size and still look soft or pixelated if the resolution is low. **300 DPI** is the print standard; anything below it will look fuzzy on paper.",
          "A 35 × 45 mm photo at 300 DPI works out to roughly **413 × 531 pixels**. Our passport tool generates exactly this pixel size, so the printed result stays sharp."
        ]
      },
      {
        h2bn: "মুখের অবস্থান ও ব্যাকগ্রাউন্ড",
        h2en: "Head position and background",
        pbn: [
          "বেশিরভাগ দেশে নিয়ম হলো — মুখ ছবির **উপরের দিকে** অবস্থান করবে, চোখ ছবির উপরের এক-তৃতীয়াংশের রেখার কাছাকাছি থাকবে, এবং চারপাশে সমান ফাঁকা জায়গা থাকবে।",
          "ব্যাকগ্রাউন্ড অবশ্যই **সাদা বা হালকা ধূসর** হতে হবে, ছবির কোনো প্রান্তে পৌঁছে যাওয়া উচিত নয়। সবচেয়ে বেশি ছাপ প্রত্যাখ্যানের কারণ হলো ভুল ব্যাকগ্রাউন্ড আর ছায়া।",
          "টুলটিতে সাদা ব্যাকগ্রাউন্ড বসানোর অপশন আছে, যা ছবির চারপাশের অবাঞ্ছিত প্রান্তও পরিষ্কার করে দেয়।"
        ],
        pen: [
          "Most countries require the face to sit toward the **top** of the frame, the eyes near the upper-third line, and an even margin of empty space on every side.",
          "The background must be **plain white or light grey**, with nothing touching the edges of the photo. A wrong background and stray shadows are the two most common reasons for rejection.",
          "The tool includes a white-background option that also clears the unwanted edges around your photo."
        ]
      },
      {
        h2bn: "ছবি প্রত্যাখ্যাত হওয়ার সাধারণ কারণ",
        h2en: "Why photos get rejected",
        pbn: [
          "- স্পষ্ট নয়, ঝাপসা বা পুরোনো ছবি",
          "- ভুল মাপ বা ভুল DPI",
          "- মুখ ছবির মাঝখানে নয়, খুব উপরে বা নিচে",
          "- মাথা বা কাঁধ ছবির প্রান্ত ছাঁটিয়ে গেছে",
          "- রঙিন, দাগযুক্ত বা শব্দযুক্ত ব্যাকগ্রাউন্ড",
          "- সানগlasses, টুপি, অথবা মুখ ঢেকে রাখা কিছু"
        ],
        pen: [
          "- Blurry, over-filtered or badly lit photos",
          "- Wrong physical size or resolution",
          "- The face centred vertically instead of sitting high in the frame",
          "- Head or shoulders cropped by the frame edge",
          "- A coloured, patterned or busy background",
          "- Sunglasses, hats, or anything covering the face"
        ]
      }
    ],
    faq: [
      { qbn: "পাসপোর্ট ছবির সঠিক সাইজ কত?", qen: "What is the correct passport photo size?", abn: "বাংলাদেশে সাধারণত ৩৫ × ৪৫ মিমি, আমেরিকা ও কানাডায় ২ × ২ ইঞ্চি (৫০ × ৫০ মিমি)।", aen: "Bangladesh usually asks for 35 × 45 mm; the US and Canada use 2 × 2 inches (50 × 50 mm)." },
      { qbn: "পাসপোর্ট ছবি কত DPI-তে হওয়া উচিত?", qen: "What DPI should a passport photo be?", abn: "৩০০ DPI। ৩৫ × ৪৫ মিমি ছবি এতে প্রায় ৪১৩ × ৫৩১ পিক্সেল হয়।", aen: "300 DPI. A 35 × 45 mm photo at that resolution is about 413 × 531 pixels." },
      { qbn: "ব্যাকগ্রাউন্ড কেমন হওয়া উচিত?", qen: "What should the background look like?", abn: "একদম সাদা বা হালকা ধূসর, কোনো দাগ বা নকশা ছাড়া, এবং ছবির কোনো প্রান্তে ছোঁয়া উচিত নয়।", aen: "Plain white or light grey, with no patterns or shadows, and nothing touching the edges of the frame." },
      { qbn: "কম্প্রেস করলে কি ছবির মান কমবে?", qen: "Will compression ruin my photo?", abn: "টুলটি উচ্চ কোয়ালিটিতে কাজ করে, তাই ছাপলেও পরিষ্কার থাকে। প্রয়োজন হলে PNG আউটপুট বেছে নিতে পারেন।", aen: "No — the tool exports at print quality. You can also choose PNG output if you prefer a lossless file." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is my photo uploaded anywhere?", abn: "না, সব প্রক্রিয়া আপনার ব্রাউজারেই ঘটে।", aen: "No — the entire process happens in your browser." }
    ]
  },

  {
    slug: "webp-vs-jpg-vs-png.html",
    date: "2026-10-01",
    readingBn: "৪ মিনিটের পড়া",
    readingEn: "4 min read",
    title: "WebP vs JPG vs PNG — কোন ফরম্যাট কখন ব্যবহার করবেন | Image Format Guide",
    desc: "JPG, PNG ও WebP-এর মধ্যে পার্থক্য কোথায়? ফাইল সাইজ, কোয়ালিটি, স্বচ্ছতা ও ব্রাউজার সাপোর্ট — সহজ ভাষায় বুঝে নিন কোন ছবির জন্য কোন ফরম্যাট সেরা। JPG vs PNG vs WebP explained: file size, quality, transparency and browser support — and when to use each.",
    descEn: "A plain-English comparison of JPG, PNG and WebP: how each compresses, which supports transparency, which browsers accept them, and which format to pick for photos, logos, screenshots and the web.",
    keywords: "webp vs jpg vs png, image format comparison, jpg png webp difference, ছবি ফরম্যাট তুলনা, which image format to use",
    h1bn: "WebP, JPG ও PNG: কোনটি কখন?",
    h1en: "WebP vs JPG vs PNG: When to Use Which",
    subbn: "তিনটি ফরম্যাটের পার্থক্য, সুবিধা-অসুবিধা এবং আপনার প্রয়োজন অনুযায়ী সঠিক ছবিটি বাছাইয়ের সহজ নির্দেশনা।",
    suben: "How the three formats differ, what each is good and bad at, and a simple rule for picking the right one.",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>'),
    tools: ["png-to-jpg.html", "compress-image.html", "strip-metadata.html"],
    sections: [
      {
        h2bn: "তিনটি ফরম্যাটের সংক্ষিপ্ত পার্থক্য",
        h2en: "The difference in one table",
        pbn: [
          "**JPG** — লসি কম্প্রেশন। সাধারণ ছবির জন্য সেরা, ফাইল ছোট। স্বচ্ছতা সাপোর্ট করে না।",
          "**PNG** — লসলেস কম্প্রেশন। স্বচ্ছতা সাপোর্ট করে, কিন্তু ফাইল অনেক বড়।",
          "**WebP** — আধুনিক ফরম্যাট। JPG-র মতো ছোট, আর PNG-র মতো স্বচ্ছতাও দেয়।"
        ],
        pen: [
          "**JPG** — lossy compression. Best for photographs, very small files. No transparency.",
          "**PNG** — lossless compression. Supports transparency, but files are much larger.",
          "**WebP** — the modern format. As small as JPG, and it handles transparency like PNG."
        ]
      },
      {
        h2bn: "স্বচ্ছতা মানে কী, এটা কেন দরকার?",
        h2en: "What is transparency, and when do you need it?",
        pbn: [
          "স্বচ্ছতা মানে ছবির কিছু অংশ সম্পূর্ণ দেখা যায় না — পেছনের জিনিস ভেসে ওঠে। **লোগো, আইকন, ওয়াটারমার্ক ও গোল করা প্রোফাইল ছবির** জন্য এটি অপরিহার্য।",
          "সাধারণ ছবির জন্য স্বচ্ছতা দরকার নেই, এবং PNG ব্যবহার করলে ফাইল অপ্রয়োজনীয়ভাবে বড় হয়ে যাবে — তাই সেখানে JPG-ই ভালো।"
        ],
        pen: [
          "Transparency means parts of an image are see-through, letting the background show through. It is essential for **logos, icons, watermarks and round profile pictures**.",
          "Ordinary photos do not need it, and forcing them into PNG will bloat the file for no benefit. Use JPG there."
        ]
      },
      {
        h2bn: "ওয়েবসাইটের জন্য কোনটি ভালো?",
        h2en: "Which format is best for the web?",
        pbn: [
          "ওয়েবসাইটের জন্য **WebP** সাধারণত সেরা। একই ছবি WebP-তে সাধারণত JPG-র চেয়ে **২৫–৩৫% ছোট**, কিন্তু দেখতে প্রায় একই।",
          "তবে পুরোনো ব্রাউজারের কথা মাথায় রেখে, সবচেয়ে নিরাপদ উপায় হলো WebP ব্যবহার করা এবং **JPG-কে ব্যাকআপ** হিসেবে রাখা। আমাদের কনভার্টার টুল দিয়ে আপনি দুই ফরম্যাটেই ফাইল তৈরি করে নিতে পারেন।"
        ],
        pen: [
          "For the web, **WebP** usually wins: the same image is typically **25–35% smaller** than the JPG while looking nearly identical.",
          "For maximum compatibility with older browsers, the safest approach is to serve WebP and keep a **JPG fallback**. Our converter produces either format in one click."
        ]
      }
    ],
    faq: [
      { qbn: "WebP কি JPG-র চেয়ে ভালো?", qen: "Is WebP better than JPG?", abn: "ওয়েবে WebP সাধারণত ভালো — একই মানে ফাইল ২৫–৩৫% ছোট হয়। তবে সবচেয়ে পুরোনো ব্রাউজারে সমর্থন নাও থাকতে পারে।", aen: "For the web, generally yes — usually 25–35% smaller at the same quality. Very old browsers may lack support." },
      { qbn: "PNG-তে স্বচ্ছতা থাকে কি?", qen: "Does PNG support transparency?", abn: "হ্যাঁ, PNG-তে স্বচ্ছ ব্যাকগ্রাউন্ড থাকে। WebP ও এটি সমর্থন করে।", aen: "Yes — PNG keeps transparent backgrounds, and WebP supports transparency too." },
      { qbn: "কোন ফরম্যাটে কোয়ালিটি সবচেয়ে ভালো থাকে?", qen: "Which format keeps the best quality?", abn: "PNG লসলেস হওয়ায় কোনো তথ্য হারায় না, তবে ফাইল সবচেয়ে বড়। সাধারণ ছবির জন্য JPG/WebP-ই যথেষ্ট।", aen: "PNG is lossless and loses nothing, but produces the biggest files. For ordinary photos JPG/WebP is plenty." },
      { qbn: "ফরম্যাট বদলালে কি ছবির মান কমে?", qen: "Does converting reduce quality?", abn: "JPG-এ রূপান্তরে কিছু তথ্য বাদ যায়, কিন্তু উপযুক্ত কোয়ালিটিতে চোখে টের পড়ে না। PNG-তে কোনো ক্ষতি হয় না।", aen: "Converting to JPG discards a little detail, but at a sensible quality it is invisible. Converting to PNG loses nothing." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the image uploaded?", abn: "না, কনভার্শন সম্পূর্ণভাবে ব্রাউজারে ঘটে।", aen: "No — conversion happens entirely in your browser." }
    ]
  },

  {
    slug: "remove-photo-location-before-posting.html",
    date: "2026-10-01",
    readingBn: "৩ মিনিটের পড়া",
    readingEn: "3 min read",
    title: "ছবি পোস্ট করার আগে লোকেশন মুছে ফেলুন | Remove EXIF & GPS Data from Photos",
    desc: "ফোনের ছবিতে GPS লোকেশন, ক্যামেরা মডেল ও সময় লুকানো থাকে। সোশ্যাল মিডিয়ায় ছবি দেওয়ার আগে EXIF ডেটা মুছে ফেলার সহজ উপায়। Your phone photos secretly record GPS location, camera model and timestamp. Here is how to strip that EXIF data before posting online.",
    descEn: "Every phone photo silently records where and when it was taken. Learn what EXIF data exposes, when it genuinely matters, and how to remove all of it in one click before sharing.",
    keywords: "remove exif data, remove gps from photo, photo metadata remover, ছবির লোকেশন মুছুন, strip metadata before posting",
    h1bn: "ছবি পোস্ট করার আগে লোকেশন মুছে ফেলুন",
    h1en: "Remove Photo Location Before You Post",
    subbn: "প্রতিটি ফোনের ছবিতে কোথায় ও কখন তোলা হয়েছে তার লুকানো তথ্য থাকে — এবং সেটি কীভাবে সরবেন।",
    suben: "Every photo from your phone quietly records where and when it was taken. Here is what that reveals and how to erase it.",
    icon: icon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
    tools: ["strip-metadata.html", "compress-image.html"],
    sections: [
      {
        h2bn: "ছবিতে কী কী তথ্য লুকানো থাকে?",
        h2en: "What is actually hidden inside a photo?",
        pbn: [
          "EXIF ডেটা হলো ছবির ভেতরে লুকানো একটি তথ্যবলী। এতে সাধারণত থাকে — **GPS লোকেশন**, ক্যামেরা ও ফোনের মডেল, ছবি তোলার সময় ও তারিখ, ক্যামেরা সেটিংস, এবং কখনো কখনো ডিভাইসের মালিকের নাম।",
          "সবসময় ফাইলের নামে দেখা যায় না, তাই বেশিরভাগ মানুষ জানেনই না যে তারা ছবি শেয়ার করার সময় নিজের অবস্থান প্রকাশ করে ফেলছেন।"
        ],
        pen: [
          "EXIF data is a hidden information block stored inside the photo file. It commonly holds your **GPS location**, the camera and phone model, the exact date and time, camera settings, and sometimes the device owner's name.",
          "It never appears in the filename, so most people do not realise they are publishing their exact whereabouts every time they share a picture."
        ]
      },
      {
        h2bn: "কখন লোকেশন মুছে ফেলা উচিত?",
        h2en: "When does removing it actually matter?",
        pbn: [
          "ঘরের ভেতরের ছবি, সন্তানের ছবি, বা বাসায় প্রবেশের সামনের ছবি শেয়ার করার আগে অবস্থান তথ্য সরিয়ে নেওয়া সবচেয়ে জরুরি। এতে অচেনা কেউ আপনার ঠিকানা বের করতে পারে না।",
          "স্যাম্পল বা স্টক ছবি, মজার মিম, এবং পুরোপুরি পরিবর্তিত ছবিতে ঝুঁকি কম — তবে মুছে ফেলা সবসময় নিরাপদ।"
        ],
        pen: [
          "The risk is highest for photos taken at home, photos of children, and pictures of the front of your house. Stripping location data stops strangers from tracing an address back to you.",
          "Stock shots, memes and heavily edited images carry far less risk — but removing the data never hurts."
        ]
      },
      {
        h2bn: "তিন ধাপে মুছে ফেলুন",
        h2en: "Remove it in three steps",
        pbn: [
          "১. যে ছবিটি শেয়ার করতে চান সেটি আপলোড করুন।",
          "২. **JPG বা PNG** আউটপুট বেছে নিন এবং হাই কোয়ালিটি রাখুন — মেটাডেটা মুছতে ছবির পিক্সেল পরিবর্তন হয় না।",
          "৩. নতুন ফাইলটি ডাউনলোড করে সেটিই শেয়ার করুন।"
        ],
        pen: [
          "1. Add the photo you plan to share.",
          "2. Choose **JPG or PNG** output and keep the quality high — stripping metadata never alters the actual pixels.",
          "3. Download the new file and share that one instead."
        ]
      },
      {
        h2bn: "এটি কি আপনার ছবি নষ্ট করে?",
        h2en: "Does this damage the photo?",
        pbn: [
          "না। টুলটি ছবিটিকে Canvas দিয়ে আবার এনকোড করে, ফলে EXIF ব্লকটি পুরোপুরি বাদ পড়ে যায়। ছবির **পিক্সেল অপরিবর্তিত থাকে** — শুধু ছবির সঙ্গে থাকা অদৃশ্য তথ্যবলীটি চলে যায়।",
          "তবে মনে রাখবেন, ছবি পুরোপুরি পুনরায়-সংরক্ষণ করা হয়, তাই একটি JPG ফাইলের ক্ষেত্রে সামান্য কম্প্রেসন পার্থক্য হতে পারে। আপনি চাইলে PNG বেছে নিয়ে তা এড়াতে পারেন।"
        ],
        pen: [
          "No. The tool re-encodes the image through the Canvas, which drops the entire EXIF block. The **actual pixels stay identical** — only the invisible information block is removed.",
          "Note that re-saving does mean a JPEG gets recompressed very slightly. If you want to avoid even that, choose PNG output."
        ]
      }
    ],
    faq: [
      { qbn: "ছবি থেকে GPS লোকেশন কীভাবে মুছব?", qen: "How do I remove GPS location from a photo?", abn: "ছবিটি আবার সেভ করলেই EXIF ব্লক সরে যায়। আমাদের মেটাডেটা টুলটি এটি এক ক্লিকে করে দেয়।", aen: "Simply saving the image again drops the EXIF block. Our metadata tool does it for you in one click." },
      { qbn: "মেটাডেটা মুছলে কি ছবির মান কমে?", qen: "Does removing metadata reduce quality?", abn: "পিক্সেল অপরিবর্তিত থাকে। শুধু তথ্যবলী বাদ যায়। JPG নির্বাচন করলে সামান্য পুনরায়-কম্প্রেস হতে পারে, PNG দিলে তা হয় না।", aen: "The pixels are untouched — only the information block goes. JPG output is very slightly recompressed; PNG avoids that entirely." },
      { qbn: "সব ছবিতেই কি GPS তথ্য থাকে?", qen: "Do all photos contain GPS data?", abn: "স্মার্টফোনের ক্যামেরা দিয়ে তোলা ছবিতে প্রায় সবসময় থাকে। স্ক্রিনশট বা অন্য অ্যাপের ছবিতে নাও থাকতে পারে।", aen: "Photos taken with a smartphone camera almost always do. Screenshots or images from other apps may not." },
      { qbn: "ছবি কি কোথাও আপলোড হয়?", qen: "Is the photo uploaded to a server?", abn: "কখনোই না — ফাইল পড়া থেকে মুছে ফেলা, সবই আপনার ব্রাউজারে ঘটে।", aen: "Never — reading and stripping the file happens entirely inside your browser." },
      { qbn: "মুছে ফেলার পর কি আবার লোকেশন চাই?", qen: "Do I lose location data I might want later?", abn: "একবার মুছলে সেই ফাইলে আর থাকে না, তাই প্রয়োজন হলে মূল ছবিটি আগে নিরাপদে রেখে দিন।", aen: "Once stripped it is gone from that file, so keep the untouched original somewhere safe first." },
      { qbn: "শুধু GPS ছাড়া বাকি তথ্য কি থাকে?", qen: "Can I remove GPS but keep the other EXIF data?", abn: "এই টুলটি সব EXIF তথ্য একসাঙ্গে মুছে দেয়, যা শেয়ার করার আগে সবচেয়ে নিরাপদ।", aen: "This tool strips the whole EXIF block at once, which is the safest option before sharing." }
    ]
  },

  {
    slug: "how-to-compress-image-for-online-form.html",
    date: "2026-10-01",
    readingBn: "৫ মিনিটের পড়া",
    readingEn: "5 min read",
    title: "অনলাইন ফর্মে ছবি আপলোড করার সঠিক সাইজ | Compress Image for Online Form 20-200KB",
    desc: "অনলাইন ফর্মে ছবি দিতে গিয়ে সাইজের ত্রুটি? ২০ KB থেকে ২০০ KB পর্যন্ত নির্দিষ্ট সাইজে ছবি কমানোর সঠিক নিয়ম ও প্রতিটি ধাপ বাংলায় ব্যাখ্যা করা হলো। Uploading a photo to an online form and hitting a file-size error? Learn exactly how to compress an image to 20KB, 50KB, 100KB or 200KB for government forms and job portals.",
    descEn: "Online forms rejecting your photo over file size? Learn how to compress an image to an exact 20KB, 50KB, 100KB or 200KB target for government forms, exam portals and job applications — with the pixel sizes that actually work.",
    keywords: "compress image for online form, reduce image size to 50kb, 100kb photo for form, government form photo size, ছবি সাইজ ফর্মে আপলোড, exam form photo size",
    h1bn: "অনলাইন ফর্মে ছবি দেওয়ার সঠিক সাইজ",
    h1en: "How to Compress an Image for an Online Form",
    subbn: "সরকারি ফর্ম, পরীক্ষা ও চাকরির আবেদনে সাধারণত ২০ থেকে ২০০ কিলোবাইটের মধ্যে ছবি লাগে। কীভাবে ঠিক সেই সাইজে নামবেন — ধাপে ধাপে দেখানো হলো।",
    suben: "Government forms, exam portals and job applications usually cap uploads at 20–200 KB. Here is how to hit that exact number without turning your photo into a blur.",
    icon: icon('<path d="M4 5h16v14H4z"/><path d="M8 11h8M8 15h5"/>'),
    tools: ["compress-image.html", "resize-image.html"],
    sections: [
      {
        h2bn: "কেন ফর্মে ছবি আপলোড হয় না?",
        h2en: "Why does the form reject my photo?",
        pbn: [
          "প্রায় সব সরকারি ফর্ম, পরীক্ষা ব্যবস্থাপনা ও চাকরির ওয়েবসাইটে ছবির সাইজে সীমা থাকে। সাধারণ সীমা **২০ কেবি, ৫০ কেবি, ১০০ কেবি বা ২০০ কেবি** — যেমন টাকার নোট, সাক্ষাৎকারের ফল, ভর্তি বা চাকরির আবেদন ফর্ম।",
          "একটি আধুনিক স্মার্টফোনের ছবি সাধারণত ২–৫ মেগাবাইট হয়, অর্থাৎ প্রয়োজনের চেয়ে প্রায় ২০–৫০ গুণ বড়। তাই ফাইল টাইপ করার আগে নিজেই কমিয়ে নিলে কোনো সমস্যা হয় না।",
          "তবে শুধু ফাইল ছোট করলেই হবে না। অনেক ফর্ম শুধু **ফাইলের সাইজ** দেখে না — ছবির **পিক্সেল মাপও** দেখে (যেমন ৩০০×৪০০ বা সর্বোচ্চ ৫০০×৬০০)। তাই দুটোই মাথায় রাখতে হবে।"
        ],
        pen: [
          "Almost every government form, exam portal and job site caps the photo size. The usual limits are **20 KB, 50 KB, 100 KB or 200 KB** — seen on bank forms, interview cards, admission and job applications.",
          "A modern phone photo typically runs 2–5 MB, which is **20–50 times** the limit. Shrinking the file before you start avoids the error entirely.",
          "Shrinking the file alone is not always enough. Many forms also check the **pixel dimensions** (for example 300×400, or a maximum of 500×600). You have to satisfy both conditions."
        ]
      },
      {
        h2bn: "ধাপে ধাপে: নির্দিষ্ট কিলোবাইটে ছবি নামান",
        h2en: "Step by step: hit your exact kilobyte target",
        pbn: [
          "১. ছবিটি দিয়ে **টার্গেট সাইজ** অপশন চালু করুন।",
          "২. ফর্মে যে কিলোবাইট লেখা আছে সেটি লিখুন — যেমন ৫০ বা ১০০।",
          "৩. আউটপুট ফরম্যাট **JPG** রাখুন।",
          "৪. নতুন সাইজ দেখে ডাউনলোড করুন — ফাইলটি ঠিক আপনার লক্ষ্যের কাছাকাছি হবে।"
        ],
        pen: [
          "1. Turn on the **target size** option.",
          "2. Type the number the form asks for — say 50 or 100.",
          "3. Keep the output format as **JPG**.",
          "4. Check the resulting size and download — it will land very close to your exact target."
        ]
      },
      {
        h2bn: "ছবির সাইজ কত রাখলে ভালো দেখাবে?",
        h2en: "What pixel size still looks sharp?",
        pbn: [
          "ছবি খুব ছোট করে দিলে সেটি আসল ছবির চেয়ে **পিক্সেলে** প্রসারিত হয়ে যায় এবং ফোনে খাটটা দেখায়। ফর্মের চেয়ে ছোট সীমা পেলে প্রায় সবসময় এই পিক্সেল মাপগুলোই নিরাপদ:",
          "- **১৫০ × ২০০ পিক্সেল** — সিগনেচার স্পেস বা ছোট ফর্ম",
          "- **৩০০ × ৪০০ পিক্সেল** — সাধারণ পরীক্ষা ও চাকরির ফর্ম",
          "- **৫০০ × ৬০০ পিক্সেল** — ফর্মে সর্বোচ্চ সাধারণ মাপ",
          "এই মাপগুলোতে ২০–২০০ কেবির মধ্যে ছবি থাকলে মুখের বিস্তারিত পরিষ্কার থাকে এবং ফর্মের শর্তও মেলে।"
        ],
        pen: [
          "Shrink a photo too far and it gets **stretched** relative to the original, so faces look soft on a phone. When the form allows very little, these pixel sizes are reliably sharp:",
          "- **150 × 200 px** — signature slots and very small forms",
          "- **300 × 400 px** — the most common exam and job portal size",
          "- **500 × 600 px** — the most common maximum on forms",
          "Within these dimensions, a 20–200 KB file keeps facial detail clear while still meeting the form's limit."
        ]
      },
      {
        h2bn: "ছবি ঝাপসা দেখাচ্ছে? না হলে",
        h2en: "What if the photo looks blurry?",
        pbn: [
          "ছবি ছোট সাইজে ফলে ঝাপসা দেখালে তার মানে কোয়ালিটি নয়, বরং **পিক্সেল সংখ্যা** কমে গেছে। সমাধান হলো ছবির প্রস্থ-দৈর্ঘ্য একটু বড় করে নিয়ে তারপর কমানো — তবে এত বেশি নয় যে ফাইল আবার বড় হয়ে যায়।",
          "অনেক সময় সবচেয়ে ভালো ফলাফল দেয় **কোয়ালিটি স্লাইডার ব্যবহার করা**, কারণ তাতে ছবির প্রাকৃতিক পিক্সেল মাপ অক্ষুণ্ণ থাকে এবং শুধু কম্প্রেসন লেভেল বদলায়।"
        ],
        pen: [
          "If the photo looks soft at a very small file size, the cause is not quality — it is that the **pixel count** dropped. The fix is to resize to slightly larger dimensions first, then compress, without letting the file balloon again.",
          "Often the best result is simply to use the **quality slider** instead, because it keeps the photo's natural pixel dimensions and only changes the compression level."
        ]
      }
    ],
    faq: [
      { qbn: "ফর্মে কত কিলোবাইটের ছবি দিতে হয়?", qen: "How small does the photo need to be?", abn: "সাধারণত ২০, ৫০, ১০০ বা ২০০ কিলোবাইট। সঠিক সীমা ফর্মে লেখা থাকে, সেটি লিখে দিয়ে টার্গেট সাইজ ব্যবহার করুন।", aen: "Usually 20, 50, 100 or 200 KB. The exact limit is printed on the form — set it as your target size." },
      { qbn: "কোয়ালিটি নষ্ট ছাড়া কি ছবি ছোট করা যায়?", qen: "Can I make the file smaller without visible quality loss?", abn: "হ্যাঁ। JPG-এ ৭০–৮০% কোয়ালিটিতে কমালে ফর্মে দেখানো ছবিতে পার্থক্য প্রায় খুঁজে পাওয়া যায় না।", aen: "Yes. At 70–80% JPG quality the difference is essentially invisible at the small size a form displays." },
      { qbn: "ছবির পিক্সেল মাপ কি ফর্ম মেনে চায়?", qen: "Does the form check pixel dimensions too?", abn: "অনেক ফর্ম করে। ৩০০×৪০০ বা ৫০০×৬০০ পিক্সেল সাধারণত নিরাপদ। রিসাইজ টুল দিয়ে মাপ ঠিক করে নিন।", aen: "Many do. 300×400 or 500×600 px are the safest common sizes — set them with the resize tool before compressing." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is my photo uploaded anywhere?", abn: "না। ছবি কমানো ও সাইজ বদলানো — দুটোই আপনার ব্রাউজারে ঘটে।", aen: "No. Both the compression and the resize happen entirely inside your browser." },
      { qbn: "JPG না PNG — কোনটি ফর্মের জন্য ভালো?", qen: "JPG or PNG for an online form?", abn: "JPG। PNG লসলেস হওয়ায় ফাইল অনেক বড় হয় এবং ফর্মের সাইজ সীমা ছাড়িয়ে যাওয়ার ঝুঁকি বাড়ে।", aen: "JPG. PNG is lossless, so files are far larger and are more likely to blow past the size limit." },
      { qbn: "ছবি আবার বড় হয়ে গেলে কী করব?", qen: "The file came out larger than the original — what now?", abn: "টার্গেট সাইজ ব্যবহার করলে এটি হয় না। আপনার লক্ষ্য ছোট হলে কোয়ালিটি কিছুটা কমিয়ে নিন।", aen: "That does not happen with target size. If your target is very small, turn the quality down a little." }
    ]
  },

  {
    slug: "remove-photo-background-online.html",
    date: "2026-10-01",
    readingBn: "৪ মিনিটের পড়া",
    readingEn: "4 min read",
    title: "ছবির ব্যাকগ্রাউন্ড সাদা করার সহজ উপায় | Change Photo Background Color",
    desc: "বিজ্ঞাপন, পাসপোর্ট ছবি বা অনলাইন ফর্মের জন্য ছবির ব্যাকগ্রাউন্ড সাদা বা নির্দিষ্ট রঙ করতে চান? ব্রাউজারেই ছবির আকার না বদলে শুধু পেছনের অংশের রঙ বদলানোর সহজ কৌশল। Want a white background for a passport photo, an ad or a form upload? Change only the colour behind your subject — without resizing the image and without installing anything.",
    descEn: "Need a plain white or coloured background for a passport photo, a product listing or a form upload? Change the colour behind your subject in your browser — no resize, no install, no upload.",
    keywords: "change photo background color, white background photo, passport photo background, ব্যাকগ্রাউন্ড সাদা করা, photo background editor",
    h1bn: "ছবির ব্যাকগ্রাউন্ডের রঙ বদলানো",
    h1en: "How to Change a Photo Background Colour",
    subbn: "পাসপোর্ট ছবি, বিজ্ঞাপন বা ফর্ম আপলোডের জন্য পেছনের অংশ পরিষ্কার রঙে আনার সহজ উপায় — ছবির সাইজ না বদলে।",
    suben: "For passport photos, listings and form uploads: how to give the background a clean colour without resizing the photo or installing anything.",
    icon: icon('<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z"/><circle cx="16.5" cy="16.5" r="3.5"/>'),
    tools: ["add-border.html", "passport-photo.html", "circle-crop.html"],
    sections: [
      {
        h2bn: "ব্যাকগ্রাউন্ড বদলাতে হলে কী জানা দরকার?",
        h2en: "What do you actually need?",
        pbn: [
          "অনেক ক্ষেত্রে ছবির পেছনের অংশ **পুরোপুরি সরিয়ে ফেলার** দরকার পড়ে না — শুধু সেটিকে একটি পরিষ্কার রঙ বানালেই চলে। পাসপোর্ট ছবি, পণ্যের তালিকা এবং বিভিন্ন অনলাইন ফর্মে এটিই বেশি প্রয়োজন।",
          "সবচেয়ে সহজ ও দ্রুত উপায় হলো ছবিকে একটি রঙের কার্ডের ওপর রেখে সেই কার্ডের অংশটিকে বাদ দেওয়া। এতে মূল বিষয়ের (মানুষ বা পণ্য) আকার অপরিবর্তিত থাকে।"
        ],
        pen: [
          "In many cases you do not need to remove the background entirely — you only need it to become one clean colour. That covers passport photos, product listings and most online forms.",
          "The simplest reliable method is to place the photo on a sheet of that colour and cut away the surrounding area. Your subject keeps its original size and shape."
        ]
      },
      {
        h2bn: "ধাপে ধাপে পেছনের রঙ বদলান",
        h2en: "Step by step: put a new colour behind your photo",
        pbn: [
          "১. ছবিটি এই পাতায় নিয়ে আসুন।",
          "২. **বর্ডার যোগ** টুল খুলুন — এতে ছবির পেছনে আপনি নির্বাচিত রঙ বসাতে পারবেন।",
          "৩. `ছবির পেছনের রং` বেছে নিয়ে প্রয়োজনমতো সাদা বা অন্য কোনো রঙ দিন।",
          "৪. প্যাডিং সামান্য বাড়ালে চারপাশে পরিষ্কার কিনারা তৈরি হবে, যা ফর্মে দরকার হয়।",
          "৫. আউটপুট ফরম্যাট **PNG** রাখলে ফাইলে স্বচ্ছতা থাকবে, অন্য ব্যক্তিগত কাজে খুব কাজে লাগবে।"
        ],
        pen: [
          "1. Bring your photo into the tool on this page.",
          "2. Open the **add border** tool — it lets you place a colour behind the image.",
          "3. Pick the `background behind photo` option and choose white or any other colour.",
          "4. A little extra padding gives you a clean even border, which is exactly what forms ask for.",
          "5. Keep the output as **PNG** if you also want transparency for other work."
        ]
      },
      {
        h2bn: "পাসপোর্ট ছবির জন্য আলাদা সহজ পথ",
        h2en: "A built-in path for passport photos",
        pbn: [
          "পাসপোর্ট বা ভিসার ছবির ক্ষেত্রে আলাদা একটি টুল আছে, যেটিতে `সাদা ব্যাকগ্রাউন্ড` মোড বেছে নিলেই **পুরো ছবি সাদা ক্যানভাসে** বসে যায় — মুখের আশপাশের দাগও পরিষ্কার হয়ে যায়।",
          "সেখানে সঠিক মাপ (৩৫×৪৫ মিমি বা ২×২ ইঞ্চি) ও প্রিন্ট-রেডি মাপ একসাঙ্গে মেলানো হয়, তাই আলাদা করে কিছু ঠিক করার দরকার হয় না।"
        ],
        pen: [
          "For passport and visa photos there is a dedicated tool: choose the **white background** mode and the whole photo is placed on a white canvas — including the area around the head.",
          "It also applies the correct physical size (35×45 mm or 2×2 inch) at print resolution, so nothing else needs adjusting."
        ]
      }
    ],
    faq: [
      { qbn: "ব্যাকগ্রাউন্ড সাদা করতে কি ফটো এডিটর লাগে?", qen: "Do I need photo editing software?", abn: "না, ব্রাউজারেই হয়। কোনো ইনস্টল বা অ্যাকাউন্ট লাগে না।", aen: "No. It works in the browser — nothing to install and no account needed." },
      { qbn: "ছবির সাইজ বা আকৃতি বদলাবে কি?", qen: "Does my photo get resized or distorted?", abn: "না। ছবির মূল পিক্সেল অপরিবর্তিত থাকে, শুধু পেছনের অংশে রঙ যোগ হয়।", aen: "No. The original pixels are untouched — colour is only added behind the photo." },
      { qbn: "পাসপোর্টের মতো পুরো ব্যাকগ্রাউন্ড মুছবেন?", qen: "Can you erase the background entirely, like a passport photo?", abn: "পাসপোর্ট টুলের সাদা ব্যাকগ্রাউন্ড মোডে মুখের চারপাশ সহ সব অংশ পরিষ্কার সাদা হয়ে যায়।", aen: "The passport tool's white background mode turns the whole frame, including the area around the head, into clean white." },
      { qbn: "কোন ফরম্যাটে ডাউনলোড করব?", qen: "Which format should I download?", abn: "ফর্মে দেখানোর জন্য JPG-ই যথেষ্ট। স্বচ্ছতা দরকার হলে PNG নিন।", aen: "JPG is enough for forms. Choose PNG if you need a transparent background." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Are my photos uploaded to a server?", abn: "কখনোই না, সবকিছু আপনার ব্রাউজারেই ঘটে।", aen: "Never — everything happens inside your own browser." }
    ]
  },

  {
    slug: "photo-look-better-in-photo-editor.html",
    date: "2026-10-01",
    readingBn: "৫ মিনিটের পড়া",
    readingEn: "5 min read",
    title: "অ্যান্ড্রয়েডে ছবি এডিট করার সহজ উপায় | How to Edit Photos on Android Without an App",
    desc: "ফোনের গ্যালারিতে থাকা ছবি সরাসরি ব্রাউজারেই ফিল্টার, ব্রাইটনেস, কনট্রাস্ট ও কালো-সাদা করা যায় — কোনো অ্যাপ ইনস্টল না করে। Edit photos straight from your Android gallery in the browser — brightness, contrast, saturation, blur and black-and-white — without installing a single app.",
    descEn: "Edit photos straight from your Android gallery in the browser — brightness, contrast, saturation, blur, sepia and black-and-white — without installing a single app or giving up your photos to an uploader.",
    keywords: "edit photo on android without app, photo editor online mobile, adjust brightness contrast online, grayscale photo online, অ্যান্ড্রয়েডে ছবি এডিট",
    h1bn: "ফোনেই ছবি এডিট করার সহজ উপায়",
    h1en: "How to Edit Photos on Your Phone Without an App",
    subbn: "কোনো অ্যাপ ডাউনলোড না করে, কোনো ছবি আপলোড না করে ব্রাউজারেই ছবি সরাসরি বদলানো যায়।",
    suben: "No app to install, no photo uploaded — edit straight from your gallery in the browser.",
    icon: icon('<path d="M12 3v18M3 12h18"/><rect x="3" y="3" width="18" height="18" rx="2"/>'),
    tools: ["adjust-image.html", "compare-image.html", "resize-image.html"],
    sections: [
      {
        h2bn: "কেন ব্রাউজারেই ছবি এডিট করাই ভালো?",
        h2en: "Why edit in the browser at all?",
        pbn: [
          "অনলাইন ছবি এডিটরের বড় সমস্যা হলো অনেকেই ছবি **সার্ভারে আপলোড** করে ফেলে। পাসপোর্টের ছবি, ব্যক্তিগত ছবি বা কাস্টমারের ছবি — এসবের জন্য সেটি ঝুঁকিপূর্ণ।",
          "ব্রাউজারেই চললে ছবি কখনো আপনার ডিভাইসের বাইরে যায় না। প্রসেসিং শেষে ফাইল সরাসরি আপনার ফোনের গ্যালেরিতে সেভ হয় — কোনো অ্যাকাউন্ট, কোনো ওয়াটারমার্ক, কোনো সীমা নেই।",
          "দ্বিতীয় সুবিধা — অ্যাপ না থাকলেও কাজ হয়। Chrome বা Samsung Internet যেকোনো ব্রাউজারেই ছবিটি খুলে টুলে ছেড়ে দিন।"
        ],
        pen: [
          "The biggest problem with most online photo editors is that they **upload your photo to a server**. That is a poor trade for a passport photo, a personal picture or a customer's photo.",
          "Working in the browser means the image never leaves your device. Processing finishes and the file saves straight to your gallery — no account, no watermark, no limits.",
          "The second benefit is that no app is required. Open the image in Chrome or any browser and drop it into the tool."
        ]
      },
      {
        h2bn: "কোন কোন পরিবর্তন করা যায়?",
        h2en: "What can you actually change?",
        pbn: [
          "ফিল্টার ও অ্যাডজাস্ট টুলে লাইভ প্রিভিউ দেখতে পাঠেন স্লাইডার টেনে — ফাইল ডাউনলোড না করেই ফল বুঝে যাবেন।",
          "- **ব্রাইটনেস** — ছবি খুব অন্ধকার বা উজ্জ্বল হলে",
          "- **কনট্রাস্ট** — ছবি ম্লান হলে একটু ঝালসাল করে তুলতে",
          "- **স্যাচারেশন** — রং বেশি বা কম জোড়া লাগলে",
          "- **ব্লার** — পেছনের লেখা বা মুখ নষ্ট না করে ব্যক্তির পেছনের অংশ ঝাপসা করতে",
          "- **গ্রেস্কেল ও সেপিয়া** — কালো-সাদা বা পুরোনো ছবির ভাব",
          "- **ইনভার্ট** — ছবির রং উল্টে দেখতে"
        ],
        pen: [
          "The filters tool shows a live preview as you drag the sliders, so you can judge the result before downloading anything.",
          "- **Brightness** — when a photo is too dark or blown out",
          "- **Contrast** — to give a flat photo a bit of punch",
          "- **Saturation** — when colours look too strong or too dull",
          "- **Blur** — to soften what is behind a person without touching their face",
          "- **Grayscale and sepia** — for a black-and-white or vintage look",
          "- **Invert** — to flip the colours of the whole image"
        ]
      },
      {
        h2bn: "আগে ও পরের তুলনা করে নিন",
        h2en: "Compare before and after",
        pbn: [
          "ছবি এডিট করার সবচেয়ে বড় সমস্যা হলো ছোট পরিবর্তন চোখে ধরা না পড়া। ফলে ছবি নষ্ট হয়ে যায় বলে ভাবি।",
          "তুলনা স্লাইডার টুলে একই ছবির আগের ও পরের অবস্থা পাশাপাশি দেখা যায়। স্লাইডারটি টেনে বদলানোর অংশটি দেখুন — সবচেয়ে স্বাভাবিক মাত্রার সেটিই সাধারণত সেরা।"
        ],
        pen: [
          "The trickiest part of editing is that small changes are invisible to the eye, so people over-edit and ruin a photo.",
          "The comparison slider shows the same photo before and after, side by side. Drag the divider and inspect the edited half — the most restrained version is usually the best one."
        ]
      }
    ],
    faq: [
      { qbn: "কোনো অ্যাপ ছাড়াই ছবি এডিট করা যাবে?", qen: "Can I really edit without installing an app?", abn: "হ্যাঁ — শুধু একটি ব্রাউজার দরকার, যেটা প্রায় সব অ্যান্ড্রয়েড ফোনেই আছে।", aen: "Yes — you only need a browser, which every Android phone already has." },
      { qbn: "আমার ছবি কি কোথাও আপলোড হয়?", qen: "Are my photos uploaded anywhere?", abn: "কখনোই না। প্রতিটি স্লাইডার আপনার ব্রাউজারের Canvas-এ কাজ করে।", aen: "Never. Every slider runs on your browser's Canvas." },
      { qbn: "পেছনের লেখা ঝাপসা করা যাবে?", qen: "Can I blur the background behind a person?", abn: "ব্লার স্লাইডার দিয়ে সম্ভব, তবে পুরো ছবির ব্লার হবে — শুধু পেছনে বলে বাছাই করতে হলে বর্ডার ও ক্রপ মিলিয়ে কাজ করতে হবে।", aen: "The blur slider blurs the whole image. To isolate only the background, combine it with the border and crop tools." },
      { qbn: "ছবি ডাউনলোড করলে কি আগের ছবি নষ্ট হয়?", qen: "Will downloading ruin my original photo?", abn: "না। নতুন ফাইলটি আলাদা নামে সেভ হয়, আগের ছবি অপরিবর্তিত থাকে।", aen: "No. The result saves as a separate file and your original stays untouched." },
      { qbn: "ফিল্টার ও কনভার্ট একসাঙ্গে করা যায়?", qen: "Can I convert the format at the same time?", abn: "ফিল্টার প্রয়োগ করে ডাউনলোড করার পর ফরম্যাট কনভার্ট টুলে নিয়ে যান, অথবা ব্যাচ টুলে একসাঙ্গে করুন।", aen: "Apply filters and download, then run the file through the converter — or do both at once with the batch tool." },
      { qbn: "কোন ফরম্যাটে ডাউনলোড হবে?", qen: "Which format does it download?", abn: "JPG, PNG ও WebP — আউটপুট ফরম্যাট চিপ বেছে নিতে পারবেন।", aen: "JPG, PNG or WebP — pick from the output format chips." }
    ]
  },

  {
    slug: "instagram-photo-size.html",
    date: "2026-10-01",
    readingBn: "৪ মিনিটের পড়া",
    readingEn: "4 min read",
    title: "ইনস্টাগ্রাম ছবির সাইজ — পোস্ট, স্টোরি ও প্রোফাইল | Instagram Photo Size Guide",
    desc: "ইনস্টাগ্রামে ছবি আপলোড করলে কোথায় কাটা যাচ্ছে? পোস্ট ১০৮০×১৩৫০, স্টোরি ১০৮০×১৯২০ ও প্রোফাইল ছবির সঠিক সাইজ বাংলায় দেওয়া হলো। Instagram cropping your photos? Here are the exact pixel sizes for feed posts, stories, reels covers and profile pictures — plus why portrait 4:5 gets the most screen space.",
    descEn: "Instagram cropping your photo? Here are the exact pixel sizes for a feed post (1080×1350), a story (1080×1920), a reel cover and a profile picture, and how to resize without losing quality.",
    keywords: "instagram photo size, instagram story size, instagram post dimensions in pixels, profile picture size, ইনস্টাগ্রাম ছবির সাইজ",
    h1bn: "ইনস্টাগ্রামে ছবির সঠিক সাইজ",
    h1en: "Instagram Photo Size: The Exact Pixel Dimensions",
    subbn: "স্ক্রিনের প্রান্তে ছবি কাটা পড়ছে? পোস্ট, স্টোরি ও প্রোফাইল ছবির পিক্সেল মাপ এক জায়গায় দেওয়া আছে।",
    suben: "Getting your photo cropped at the edges? Every Instagram image size, in pixels, in one place.",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/>'),
    tools: ["resize-image.html", "circle-crop.html", "compress-image.html"],
    sections: [
      {
        h2bn: "ইনস্টাগ্রামের ছবির সাইজ কত?",
        h2en: "What size should an Instagram photo be?",
        pbn: [
          "ইনস্টাগ্রাম একাধিক জায়গায় ছবি দেখায়, আর প্রতিটি জায়গার নিজস্ব অনুপাত (aspect ratio) আছে। একই ছবি পোস্টে আর স্টোরিতে দিলে দুটো আলাদা করে কাটা পড়ে।",
          "সবচেয়ে জনপ্রিয় **পোর্ট্রেট ৪:৫** অনুপাত (১০৮০×১৩৫০), কারণ এতে ফিডে সবচেয়ে বেশি জায়গা নেয়। স্কয়ার ১:১ ছবি ফিডে ছোট দেখায়, আর ওয়াইড ১৬:৯ ফিডে উপরে-নিচে কেটে যায়।"
        ],
        pen: [
          "Instagram shows images in several places, and each has its own aspect ratio. The same photo posted as a feed post and as a story gets cropped differently.",
          "The most popular is the **portrait 4:5** ratio (1080×1350) because it takes the most room in the feed. A square 1:1 image looks smaller, while 16:9 gets cut off top and bottom."
        ]
      },
      {
        h2bn: "কোন জায়গায় কত পিক্সেল?",
        h2en: "The pixel size for each placement",
        pbn: [
          "- **ফিড পোস্ট (৪:৫)** — ১০৮০ × ১৩৫০ পিক্সেল, ফিডে সর্বোচ্চ জায়গা নেয়",
          "- **ফিড পোস্ট (১:১ বর্গাকার)** — ১০৮০ × ১০৮০ পিক্সেল",
          "- **স্টোরি ও রিল** — ১০৮০ × ১৯২০ পিক্সেল (৯:১৬ লম্বালম্বি)",
          "- **প্রোফাইল ছবি** — ৪০০ × ৪০০ পিক্সেল (গোল প্রদর্শিত হয়)",
          "- **হাইলাইট কভার** — ১০৮০ × ১৯২০ পিক্সেল",
          "ছবি নির্দিষ্ট মাপে আনার পর ফাইল বড় হয়ে গেলে কম্প্রেস টুল দিয়ে হালকা করে নিন — ইনস্টাগ্রাম ৮ মেগাবাইট পর্যন্ত নেয়।"
        ],
        pen: [
          "- **Feed post (4:5)** — 1080 × 1350 px, the largest area in the feed",
          "- **Feed post (1:1 square)** — 1080 × 1080 px",
          "- **Story and Reel** — 1080 × 1920 px (9:16 vertical)",
          "- **Profile picture** — 400 × 400 px (displayed as a circle)",
          "- **Highlight cover** — 1080 × 1920 px",
          "After resizing, if the file is heavy, run it through the compress tool — Instagram accepts up to about 8 MB."
        ]
      },
      {
        h2bn: "ছবি নষ্ট না করে সাইজ বদলাবেন যেভাবে?",
        h2en: "How to resize without ruining the photo",
        pbn: [
          "সবচেয়ে বড় ভুল হলো **ছবির প্রস্থ বা উচ্চতা আলাদা করে বাড়ানো** — তাতে ছবি টানা হয়ে যায়। সঠিক নিয়ম হলো অনুপাত (aspect ratio) ঠিক রেখে দুটো দিক একসাঙ্গে ছোট করা।",
          "রিসাইজ টুলে পিক্সেলে সাইজ লিখলেই টুলটি অনুপাত ধরে রেখে ছোট করে দেয়। তাই ১০৮০×১৩৫০ লিখলে ছবির আকৃতি অক্ষুণ্ণ থাকবে।",
          "ছবি ছোট করলে সাধারণত মান কমে না, বরং বাড়ে — কারণ একই তথ্যে কম পিক্সেলে ঢোকানো হয়।"
        ],
        pen: [
          "The biggest mistake is stretching **only the width or only the height**, which distorts the photo. The correct rule is to scale both dimensions together, keeping the aspect ratio intact.",
          "Just type the pixel size into the resize tool and it preserves the ratio for you, so 1080×1350 keeps the shape untouched.",
          "Making a photo smaller usually *improves* how it looks, because the same detail is packed into fewer pixels."
        ]
      },
      {
        h2bn: "প্রোফাইল ছবি গোল দেখাবে",
        h2en: "Profile pictures are shown as circles",
        pbn: [
          "ইনস্টাগ্রাম প্রোফাইল ছবি **গোল** অংশে কেটে দেখায়, তাই চার কোনায় ছবি থাকলে সেগুলো কেলে যায়। মুখ যত মাঝখানে রাখবেন তত ভালো দেখাবে।",
          "চাইলে গোল কাটার টুল দিয়ে ছবিটি এক ক্লিকে গোল করে নিতে পারেন — তবে তারপর **PNG** ফরম্যাটে ডাউনলোড করবেন, কারণ JPG স্বচ্ছতা রাখে না।"
        ],
        pen: [
          "Instagram crops your profile picture into a **circle**, so anything in the four corners is lost. Keeping the face centred gives the best result.",
          "You can use the circle crop tool to do this in one click — just make sure to download as **PNG**, because JPG cannot store transparency."
        ]
      }
    ],
    faq: [
      { qbn: "ইনস্টাগ্রাম পোস্টের সঠিক সাইজ কত?", qen: "What is the best size for an Instagram post?", abn: "১০৮০ × ১৩৫০ পিক্সেল (৪:৫)। এটি ফিডে সবচেয়ে বেশি জায়গা নেয়।", aen: "1080 × 1350 px (4:5). This occupies the largest area in the feed." },
      { qbn: "স্টোরির সাইজ কত হওয়া উচিত?", qen: "What size should a story be?", abn: "১০৮০ × ১৯২০ পিক্সেল (৯:১৬)। এটি ফুল-স্ক্রিন লম্বালম্বি অনুপাত।", aen: "1080 × 1920 px (9:16), the full-screen vertical ratio." },
      { qbn: "ছবি ছোট করলে কি মান কমে?", qen: "Does a smaller photo look worse?", abn: "উল্টে ছোট করলে দেখতে বেশি পরিষ্কার লাগে, কারণ একই বিবর্ত কম পিক্সেলে বসে। আপলোডের আগে ১০৮০ পিক্সেলে নামিয়ে নিলেই ভালো।", aen: "It usually looks better — the same detail is packed into fewer pixels. Resizing down to about 1080 px before uploading is ideal." },
      { qbn: "ফাইল কত বড় হলে আপলোড হবে না?", qen: "What is the maximum upload file size?", abn: "JPG হিসেবে প্রায় ৮ মেগাবাইট পর্যন্ত নেয়। বড় ফাইল হলে কম্প্রেস টুল ব্যবহার করুন।", aen: "Around 8 MB for a JPG. Use the compress tool if your file is larger." },
      { qbn: "প্রোফাইল ছবির সাইজ কত?", qen: "What size should a profile picture be?", abn: "৪০০ × ৪০০ পিক্সেল। ছবিটি গোলে দেখায়, তাই মুখ মাঝখানে রাখুন।", aen: "400 × 400 px. It is displayed as a circle, so keep the face centred." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Are my photos uploaded to a server?", abn: "না, সব ছবি আপনার ডিভাইসেই থাকে এবং সাইজ বদলানো ব্রাউজারেই হয়।", aen: "No. Your photos never leave your device; the resizing happens in the browser." }
    ]
  },

  {
    slug: "jpeg-vs-png-quality.html",
    date: "2026-10-01",
    readingBn: "৪ মিনিটের পড়া",
    readingEn: "4 min read",
    title: "JPG কোয়ালিটি ৮০ মানে কী? কীভাবে কম ফাইলে ভালো ছবি পাবেন",
    desc: "JPG কোয়ালিটি স্লাইডারে ৮০ বা ৯০ দিলে আসলে কী হয়? কোয়ালিটি সংখ্যার অর্থ, পিক্সেলের পার্থক্য এবং একই ছবি ছোট করার সঠিক কৌশল বাংলায় বোঝানো হলো। What does JPG quality 80 actually mean? Here is how the quality number works, how much you can tell the difference by eye, and the smart trick to shrink a photo without a visible drop in quality.",
    descEn: "What does JPG quality 80 really mean? Learn how the quality number maps to visible quality, where the eye stops noticing, and how to pick the lowest setting that still looks perfect — which is how you cut file size in half.",
    keywords: "jpeg quality, jpg quality 80, image compression quality setting, ছবি কোয়ালিটি, photo quality vs file size",
    h1bn: "JPG কোয়ালিটি সংখ্যার আসল অর্থ",
    h1en: "What JPG Quality Numbers Actually Mean",
    subbn: "কোয়ালিটি স্লাইডারে ৮০ দিলে কি সত্যিই মান ৮০% থাকে? উত্তরটি জেনে নিন, ফাইল অনেক ছোট করা যাবে।",
    suben: "If you set the slider to 80, is 80% of the quality really kept? Here is the honest answer — and how to get a much smaller file as a result.",
    icon: icon('<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/>'),
    tools: ["compress-image.html", "png-to-jpg.html"],
    sections: [
      {
        h2bn: "কোয়ালিটি সংখ্যা আসলে কী মাপে?",
        h2en: "What does the quality number measure?",
        pbn: [
          "JPG ফরম্যাটে **কোয়ালিটি সংখ্যা** সরাসরি কোনো পিক্সেলের সংখ্যা নয়। এটি একটি **কম্প্রেসন অ্যালগরিদমের সেটিং** — কম সংখ্যা মানে কম তথ্য রেখে ফাইল ছোট করা, বেশি সংখ্যা মানে বেশি তথ্য রাখা।",
          "তাই ৮০ মানে **৮০% মান বাকি আছে** এমন নয়। বরং এটি মানে ফাইলের আকার প্রায় ২০–৪০% কম হবে, তবে দেখতে প্রায় একই থাকবে। এই কারণেই একই ছবি কোয়ালিটি বাড়ালে ফাইল দ্রুত বড় হয়, কিন্তু দেখতে পার্থক্য কমে।"
        ],
        pen: [
          "In JPG, the **quality number is not a percentage of pixels kept**. It is a setting for the compression algorithm: a lower number discards more information to make the file smaller.",
          "So 80 does not mean 80% of the quality survives. It means the file is roughly 20–40% smaller while looking almost identical — which is why raising the number grows the file quickly but changes very little on screen."
        ]
      },
      {
        h2bn: "কোন সংখ্যায় চোখে পার্থক্য আর থাকে না?",
        h2en: "At what number does the eye stop noticing?",
        pbn: [
          "বাস্তব অভিজ্ঞতা থেকে বলা যায়, **৭০ থেকে ৮০** এর মধ্যে কোয়ালিটি রাখলে সাধারণ পর্দায় ছবি খুব পরিষ্কার দেখায়, অথচ ফাইল আগের তুলনায় অনেক ছোট হয়।",
          "- **৯০–১০০** — প্রায় লসলেস, প্রিন্ট বা পুরো আকারে দেখানোর জন্য",
          "- **৮০–৯০** — স্ক্রিনে দেখানোর জন্য সবচেয়ে ভালো ভারসাম্য",
          "- **৬০–৭০** — ফাইল অনেক ছোট, হালকা ব্যবহারের জন্য",
          "- **৬০-এর নিচে** — ছবিতে ভাঙা দেখাবে, তাই এড়িয়ে চলুন",
          "ছবিতে আকাশ বা পাতার মতো মসৃণ জায়গা থাকলে কম কোয়ালিটিতে বেশি ফারাক পড়ে, কারণ সেখানে কোমল রঙের পার্থক্য ধরা পড়ে।"
        ],
        pen: [
          "From real-world experience, a quality setting of **70 to 80** looks perfectly clean on a normal screen while making the file dramatically smaller.",
          "- **90–100** — near lossless, for printing or viewing at full size",
          "- **80–90** — the best balance for on-screen viewing",
          "- **60–70** — very small files for heavy use",
          "- **below 60** — visible artefacts; better to avoid",
          "Photos containing smooth areas such as sky or foliage show the difference sooner, because subtle colour shifts are easy to spot there."
        ]
      },
      {
        h2bn: "আসলে ফাইল ছোট করার স্মার্ট কৌশল",
        h2en: "The smart trick to a much smaller file",
        pbn: [
          "মান স্লাইডার দিয়ে ১০০ থেকে ৮০-এ নামালে ফাইল কমে, কিন্তু ছবি ছোট হয় না। ফলে বড় ফাইলের একটি ছবি এখনো বড়ই থাকে।",
          "সবচেয়ে ভালো ফলাফল পেতে **দুটো ধাপ একসাঙ্গে** করুন: প্রথমে ছবির প্রস্থ-দৈর্ঘ্য প্রয়োজনমতো ছোট করুন (যেমন দীর্ঘ প্রান্ত ১৬০০ পিক্সেল), তারপর কোয়ালিটি ৭৫–৮০-এ কমান। এতে ছবি ফোনে পরিষ্কার দেখায়, অথচ ফাইল প্রায় ৮০% ছোট হয়।"
        ],
        pen: [
          "Dropping the slider from 100 to 80 shrinks the file but does not shrink the photo, so a large image stays large.",
          "For the best result do **both steps together**: first resize the longest side to what you actually need (around 1600 px is plenty), then set quality to 75–80. The image stays sharp on a phone while the file typically drops by around 80%."
        ]
      }
    ],
    faq: [
      { qbn: "JPG কোয়ালিটি ৮০ মানে কী?", qen: "What does JPG quality 80 mean?", abn: "ফাইলের আকার প্রায় ২০–৪০% কম হয়, কিন্তু দেখতে প্রায় আগের মতোই থাকে। এটি মান নয়, কম্প্রেসনের সেটিং।", aen: "The file becomes roughly 20–40% smaller while looking almost the same. It is a compression setting, not a quality percentage." },
      { qbn: "কোন কোয়ালিটিতে সবচেয়ে ভালো দেখায়?", qen: "Which quality looks best for screen viewing?", abn: "৮০ থেকে ৮৫ সাধারণত সবচেয়ে ভালো ভারসাম্য দেয় — ফাইল ছোট, ছবি পরিষ্কার।", aen: "Around 80–85 is usually the sweet spot: small file, clean-looking image." },
      { qbn: "৬০ কোয়ালিটি কি খুব খারাপ?", qen: "Is quality 60 bad?", abn: "খুব খারাপ নয়, তবে আকাশ বা মসৃণ জায়গায় ফারাক চোখে পড়তে পারে। ৭০-এর নিচে না নামলে ভালো।", aen: "Not terrible, but differences show in smooth areas like sky. Staying above 70 is safer." },
      { qbn: "কোয়ালিটি কমানো কি ছবি নষ্ট করে?", qen: "Does lowering quality damage the photo?", abn: "JPG লসি কম্প্রেসন, তাই সামান্য তথ্য বাদ পড়ে। মানুষ চোখে সাধারণত বুঝতে পারে না।", aen: "JPG is lossy, so a little detail is discarded — but the difference is normally invisible to the eye." },
      { qbn: "ফাইল সবচেয়ে ছোট করতে কী করব?", qen: "How do I get the smallest possible file?", abn: "প্রথমে ছবির পিক্সেল মাপ ছোট করুন, তারপর কোয়ালিটি ৭৫–৮০-এ কমান — দুটো একসাঙ্গে করলে সবচেয়ে বড় সাশ্রয় হয়।", aen: "Resize the pixel dimensions first, then set quality around 75–80. Doing both together gives the biggest saving." },
      { qbn: "ছবি কি আপলোড হয়?", qen: "Is the image uploaded?", abn: "না, কম্প্রেস করার পুরো কাজ আপনার ব্রাউজারেই হয়।", aen: "No — compression happens entirely in your browser." }
    ]
  }
];
