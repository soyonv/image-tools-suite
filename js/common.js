/* ============================================================
   ছবির সহায়ক — Photo Sahayak | Shared helpers
   No libraries. Everything runs client-side.
   ============================================================ */
(function () {
  "use strict";

  var LANG_KEY = "ps_lang";

  /* ---------- Language (Bengali primary, English secondary) ---------- */
  function getLang() {
    try {
      return localStorage.getItem(LANG_KEY) === "en" ? "en" : "bn";
    } catch (e) {
      return "bn";
    }
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "bn";
    document.querySelectorAll("[data-bn][data-en]").forEach(function (el) {
      el.textContent = el.getAttribute("data-" + lang);
    });
    document.querySelectorAll("[data-bn-ph][data-en-ph]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-" + lang + "-ph"));
    });
    document.querySelectorAll("[data-bn-aria][data-en-aria]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria"));
    });
    var btn = document.getElementById("langToggle");
    if (btn) {
      btn.textContent = lang === "bn" ? "EN" : "বাংলা";
      btn.setAttribute(
        "aria-label",
        lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"
      );
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) { /* ignore */ }
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
          getLang() === "en"
            ? "Please choose an image file (JPG, PNG, WebP, GIF)."
            : "অনুগ্রহ করে একটি ছবির ফাইল বাছুন (JPG, PNG, WebP, GIF)।"
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
    applyLang(getLang());
    initNav();
    markCurrentPage();
    var btn = document.getElementById("langToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        setLang(getLang() === "bn" ? "en" : "bn");
      });
    }
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
    formatBytes: formatBytes,
    baseName: baseName,
    loadImage: loadImage,
    readFileAsDataURL: readFileAsDataURL,
    isImageFile: isImageFile,
    canvasToBlob: canvasToBlob,
    downloadBlob: downloadBlob,
    flattenToCanvas: flattenToCanvas,
    initUploader: initUploader,
    state: state,
    setImage: setImage
  };
})();
