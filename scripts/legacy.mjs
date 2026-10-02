/* ============================================================
   The five tool pages that are maintained by hand
   ------------------------------------------------------------
   resize, compress, png-to-jpg, crop and passport-photo were
   written before the generator existed, so they are listed here
   rather than produced from a config. The generator never writes
   their HTML — it only needs their titles and descriptions so it
   can link to them by slug like any other tool.

   index.html also appears in the generator's own list, but it is
   the homepage, not a tool, and is filtered out where it matters.
   ============================================================ */

export const LEGACY = [
  {
    slug: "index.html",
    title: "ছবির সহায়ক — অনলাইন ফটো টুলস | Resize, Compress, Convert Image Free"
  },
  {
    slug: "resize-image.html",
    title: "ছবির সাইজ পরিবর্তন | Resize Image Online Free",
    bn: "ছবির সাইজ পরিবর্তন",
    en: "Resize Image",
    shortDescBn: "পিক্সেল বা শতাংশে ছবির সাইজ বদলান।",
    shortDescEn: "Change photo size by pixels or percentage."
  },
  {
    slug: "compress-image.html",
    title: "ছবির সাইজ কমান | Compress Image Online Free",
    bn: "ছবির সাইজ কমান",
    en: "Compress Image",
    shortDescBn: "কোয়ালিটি স্লাইডার বা লক্ষ্য KB দিয়ে ফাইল ছোট করুন।",
    shortDescEn: "Shrink file size with a quality slider or a target KB."
  },
  {
    slug: "png-to-jpg.html",
    title: "PNG to JPG কনভার্টার | Convert Image PNG ↔ JPG ↔ WebP Free",
    bn: "PNG to JPG কনভার্টার",
    en: "Convert Format",
    shortDescBn: "PNG ↔ JPG ↔ WebP এক ক্লিকে রূপান্তর করুন।",
    shortDescEn: "Convert PNG ↔ JPG ↔ WebP in one click."
  },
  {
    slug: "crop-image.html",
    title: "ছবি কাটুন | Crop Image Online Free",
    bn: "ছবি কাটুন",
    en: "Crop Image",
    shortDescBn: "ড্র্যাগ করে ক্রপ, ঘোরান ও ফ্লিপ করুন।",
    shortDescEn: "Crop, rotate and flip your photo."
  },
  {
    slug: "passport-photo.html",
    title: "পাসপোর্ট সাইজ ছবি তৈরি | Passport Size Photo Maker Free",
    bn: "পাসপোর্ট সাইজ ছবি তৈরি",
    en: "Passport Size Photo",
    shortDescBn: "৩৫×৪৫ মিমি সহ প্রিসেট, ৩০০ DPI প্রিন্ট-রেডি।",
    shortDescEn: "35×45 mm presets at print-ready 300 DPI."
  }
];

/* The tool pages that exist only as hand-written files. */
export const LEGACY_TOOLS = LEGACY.filter((l) => l.bn);
