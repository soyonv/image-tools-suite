/* ============================================================
   ছবির সহায়ক — Photo Sahayak | Shared helpers
   No libraries. Everything runs client-side.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Language ----------
     Resolution order:
       1. A manual choice the visitor made (persisted) — always wins.
       2. Their browser language, so a visitor from Spain sees Spanish.
       3. English, which is always complete.

     Bengali and English are authored inline in the HTML as data-bn/data-en.
     Every other language is translated at runtime from English via
     I18N.t(), falling back to English when a string has no translation yet. */

  // js/i18n.js is loaded before this file. Capture it once, but keep guarding
  // every use so the site still works in English if that script ever fails.
  var I18N = window.I18N;
  function getLang() {
    if (I18N) {
      var saved = I18N.getStored();
      if (saved) return saved;
      return I18N.detect();
    }
    try {
      var legacy = localStorage.getItem("ps_lang");
      if (legacy === "en" || legacy === "bn") return legacy;
    } catch (e) { /* ignore */ }
    var nav = (navigator.language || (navigator.languages && navigator.languages[0]) || "en").toLowerCase();
    return nav.indexOf("bn") === 0 ? "bn" : "en";
  }

  /* Resolve one English source string into the active language. */
  function translate(lang, enText) {
    if (lang === "en") return enText;
    if (lang === "bn") return null; // handled by the caller (data-bn)
    return I18N ? I18N.t(lang, enText) : enText;
  }

  function applyLang(lang) {
    var root = document.documentElement;

    // Bengali and English come straight from the authored attributes.
    if (lang === "bn" || lang === "en") {
      root.lang = lang;
      document.querySelectorAll("[data-bn][data-en]").forEach(function (el) {
        el.textContent = el.getAttribute("data-" + lang);
      });
      document.querySelectorAll("[data-bn-ph][data-en-ph]").forEach(function (el) {
        el.setAttribute("placeholder", el.getAttribute("data-" + lang + "-ph"));
      });
      document.querySelectorAll("[data-bn-aria][data-en-aria]").forEach(function (el) {
        el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria"));
      });
    } else {
      // Any other language: translate from the English source string.
      root.lang = lang;
      document.querySelectorAll("[data-en]").forEach(function (el) {
        var out = translate(lang, el.getAttribute("data-en"));
        if (out) el.textContent = out;
      });
      document.querySelectorAll("[data-en-ph]").forEach(function (el) {
        var out = translate(lang, el.getAttribute("data-en-ph"));
        if (out) el.setAttribute("placeholder", out);
      });
      document.querySelectorAll("[data-en-aria]").forEach(function (el) {
        var out = translate(lang, el.getAttribute("data-en-aria"));
        if (out) el.setAttribute("aria-label", out);
      });
    }

    // Right-to-left scripts (Arabic, Urdu) mirror the whole layout.
    var rtl = I18N ? I18N.isRTL(lang) : false;
    root.setAttribute("dir", rtl ? "rtl" : "ltr");
    document.body.classList.toggle("rtl", rtl);

    var sel = document.getElementById("langSelect");
    if (sel) {
      sel.value = lang;
      var meta = I18N ? I18N.meta(lang) : { name: lang.toUpperCase() };
      sel.setAttribute("aria-label", "Language: " + meta.en);
    }
  }

  function setLang(lang, remember) {
    if (!I18N || !I18N.isSupported(lang)) return;
    // Only persist an explicit choice; auto-detection stays unstored so the
    // site follows the visitor's locale on every new visit.
    if (remember) I18N.store(lang);
    else I18N.store(null);
    applyLang(lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("siteNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Language picker ----------
     The header ships a small #langToggle button on every page. We upgrade
     it in place into a full <select> listing every supported language in
     its own script, so one change covers all pages without editing markup. */
  function initLangPicker() {
    if (!I18N) return;
    var btn = document.getElementById("langToggle");
    var host = btn && btn.parentNode;
    if (!btn || !host) return;
    if (document.getElementById("langSelect")) return; // already upgraded

    var sel = document.createElement("select");
    sel.id = "langSelect";
    sel.className = "lang-select";

    I18N.LANGS.forEach(function (l) {
      var opt = document.createElement("option");
      opt.value = l.code;
      // Native name, with the English name for anyone who can't read it.
      opt.textContent = l.name + (l.code === "en" ? "" : " (" + l.en + ")");
      opt.setAttribute("lang", l.code);
      sel.appendChild(opt);
    });

    sel.value = getLang();
    sel.addEventListener("change", function () {
      setLang(sel.value, true);
    });

    host.replaceChild(sel, btn);
  }

  /* Pick a message for the active language (English source, Bangla fallback). */
  function pick(en, bn) {
    var lang = getLang();
    if (lang === "en") return en;
    if (lang === "bn") return bn;
    var out = I18N ? I18N.t(lang, en) : en;
    return out || en;
  }

  /* ---------- Formatting ---------- */
  function formatBytes(bytes) {
    if (bytes == null || isNaN(bytes)) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function baseName(name) {
    return (name || "image").replace(/\.[^.]+$/, "");
  }

  /* ---------- Image loading ---------- */
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error("Image load failed")); };
      img.src = src;
    });
  }

  function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error("File read failed")); };
      reader.readAsDataURL(file);
    });
  }

  function isImageFile(file) {
    return file && file.type && file.type.indexOf("image/") === 0;
  }

  /* ---------- Canvas to Blob (promise) ---------- */
  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve, reject) {
      if (!canvas.toBlob) {
        // Fallback for very old browsers
        try {
          var dataUrl = canvas.toDataURL(type, quality);
          var bin = atob(dataUrl.split(",")[1]);
          var arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          resolve(new Blob([arr], { type: type }));
        } catch (e) {
          reject(e);
        }
        return;
      }
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, type, quality);
    });
  }

  /* ---------- Download helper ---------- */
  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  /* ---------- White background flatten (for JPG) ---------- */
  function flattenToCanvas(img, drawW, drawH) {
    var c = document.createElement("canvas");
    c.width = drawW;
    c.height = drawH;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, drawW, drawH);
    ctx.drawImage(img, 0, 0, drawW, drawH);
    return c;
  }

  /* ---------- Uploader (drag & drop + file picker) ----------
     Usage: PhotoTools.initUploader(zoneEl, inputEl, onFile)
     ---------------------------------------------------------- */
  function initUploader(zone, input, onFile) {
    if (!zone || !input) return;

    function handle(file) {
      if (!isImageFile(file)) {
        alert(
          pick(
            "Please choose an image file (JPG, PNG, WebP, GIF).",
            "অনুগ্রহ করে একটি ছবির ফাইল বাছুন (JPG, PNG, WebP, GIF)।"
          )
        );
        return;
      }
      onFile(file);
    }

    zone.addEventListener("click", function () { input.click(); });
    zone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });

    input.addEventListener("change", function () {
      if (input.files && input.files[0]) handle(input.files[0]);
      input.value = ""; // allow re-selecting the same file
    });

    ["dragenter", "dragover"].forEach(function (evt) {
      zone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      zone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove("dragover");
      });
    });
    zone.addEventListener("drop", function (e) {
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) handle(dt.files[0]);
    });
  }

  /* ---------- Uploader (multiple files) ----------
     Usage: PhotoTools.initMultiUploader(zoneEl, inputEl, onFiles)
     ---------------------------------------------------------- */
  function initMultiUploader(zone, input, onFiles) {
    if (!zone || !input) return;

    function handle(fileList) {
      var files = Array.prototype.slice.call(fileList || []).filter(isImageFile);
      if (!files.length) {
        alert(
          pick(
            "Please choose image files (JPG, PNG, WebP, GIF).",
            "অনুগ্রহ করে ছবির ফাইল বাছুন (JPG, PNG, WebP, GIF)।"
          )
        );
        return;
      }
      onFiles(files);
    }

    zone.addEventListener("click", function () { input.click(); });
    zone.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
    input.addEventListener("change", function () {
      handle(input.files);
      input.value = "";
    });
    ["dragenter", "dragover"].forEach(function (evt) {
      zone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      zone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove("dragover");
      });
    });
    zone.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) handle(e.dataTransfer.files);
    });
  }

  /* ---------- State container shared by tool pages ---------- */
  var state = {
    file: null,
    image: null,      // HTMLImageElement (original)
    objectUrl: null,
    outputBlob: null,
    outputName: "output"
  };

  function setImage(file, image) {
    state.file = file;
    state.image = image;
    state.outputBlob = null;
  }

  /* ---------- Mark current page in nav ---------- */
  function markCurrentPage() {
    var here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target === here || (here === "" && target === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initLangPicker();
    applyLang(getLang());
    initNav();
    markCurrentPage();
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.PhotoTools = {
    getLang: getLang,
    setLang: setLang,
    t: function (en) { return pick(en, en); },
    pick: pick,
    formatBytes: formatBytes,
    baseName: baseName,
    loadImage: loadImage,
    readFileAsDataURL: readFileAsDataURL,
    isImageFile: isImageFile,
    canvasToBlob: canvasToBlob,
    downloadBlob: downloadBlob,
    flattenToCanvas: flattenToCanvas,
    initUploader: initUploader,
    initMultiUploader: initMultiUploader,
    state: state,
    setImage: setImage
  };
})();
