/* ============ Compress Image tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var previewWrap = document.getElementById("previewWrap");
  var previewImg = document.getElementById("previewImg");
  var controls = document.getElementById("controls");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var deltaEl = document.getElementById("delta");
  var statusEl = document.getElementById("status");

  var formatSel = document.getElementById("formatSel");
  var qualityRange = document.getElementById("qualityRange");
  var qualityVal = document.getElementById("qualityVal");
  var targetCheck = document.getElementById("targetCheck");
  var targetWrap = document.getElementById("targetWrap");
  var targetInput = document.getElementById("targetInput");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var outputBlob = null;
  var outputName = "image-compressed.jpg";
  var baseCanvas = null;
  var debounceTimer = null;
  var renderSeq = 0;

  /* ---------- File loading ---------- */
  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) {
      return PT.loadImage(url);
    }).then(function (img) {
      PT.setImage(file, img);
      previewImg.src = img.src;
      previewWrap.classList.add("visible");
      controls.hidden = false;

      sizeBefore.textContent = PT.formatBytes(file.size);
      dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px";

      // Sensible default output format
      if (file.type === "image/png") formatSel.value = "image/png";
      else if (file.type === "image/webp") formatSel.value = "image/webp";
      else if (file.type === "image/gif") formatSel.value = "image/png";
      else formatSel.value = "image/jpeg";

      baseCanvas = null;
      scheduleRender(0);
      statusEl.textContent = PT.getLang() === "en"
        ? "Photo loaded — set the quality below."
        : "ছবি লোড হয়েছে — নিচে কোয়ালিটি ঠিক করুন।";
    }).catch(function () {
      alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
    });
  });

  /* ---------- Controls ---------- */
  qualityRange.addEventListener("input", function () {
    qualityVal.textContent = qualityRange.value;
    scheduleRender();
  });
  formatSel.addEventListener("change", function () {
    baseCanvas = null; // rebuild so JPG gets its white background if needed
    scheduleRender(0);
  });
  targetCheck.addEventListener("change", function () {
    targetWrap.hidden = !targetCheck.checked;
    scheduleRender(targetCheck.checked ? 0 : null);
  });
  targetInput.addEventListener("input", function () { scheduleRender(); });

  function scheduleRender(delay) {
    clearTimeout(debounceTimer);
    var d = typeof delay === "number" ? delay : 220;
    debounceTimer = setTimeout(render, d);
  }

  /* ---------- Helpers ---------- */
  function resolvedMime() {
    var v = formatSel.value;
    if (v !== "same") return v;
    var t = PT.state.file && PT.state.file.type;
    if (t === "image/png" || t === "image/webp") return t;
    if (t === "image/gif") return "image/png";
    return "image/jpeg";
  }

  function extFor(mime) {
    return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  }

  function ensureBaseCanvas() {
    if (baseCanvas) return baseCanvas;
    var img = PT.state.image;
    baseCanvas = document.createElement("canvas");
    baseCanvas.width = img.naturalWidth;
    baseCanvas.height = img.naturalHeight;
    var ctx = baseCanvas.getContext("2d");
    var mime = resolvedMime();
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
    }
    ctx.drawImage(img, 0, 0);
    return baseCanvas;
  }

  /* ---------- Binary search to hit target size ---------- */
  function searchTargetSize(canvas, mime, targetBytes) {
    var low = 0.05, high = 0.98, best = null, bestDiff = Infinity;
    var iterations = 12;
    var chain = Promise.resolve();

    for (var i = 0; i < iterations; i++) {
      (function (q) {
        chain = chain.then(function () {
          return PT.canvasToBlob(canvas, mime, q);
        }).then(function (blob) {
          var diff = Math.abs(blob.size - targetBytes);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = blob;
          }
          if (blob.size > targetBytes) high = q;
          else low = q;
        });
      })((low + high) / 2);
    }

    return chain.then(function () { return best; });
  }

  /* ---------- Render ---------- */
  function render() {
    if (!PT.state.image) return;
    var seq = ++renderSeq;
    var canvas = ensureBaseCanvas();
    var mime = resolvedMime();
    var isLossy = mime !== "image/png";
    var q = parseInt(qualityRange.value, 10) / 100;
    var targetMode = targetCheck.checked;
    var targetKB = Math.max(10, parseInt(targetInput.value, 10) || 200);

    statusEl.textContent = PT.getLang() === "en" ? "Working…" : "কাজ হচ্ছে…";

    var pending;
    if (targetMode && isLossy) {
      pending = searchTargetSize(canvas, mime, targetKB * 1024);
    } else if (targetMode && !isLossy) {
      statusEl.textContent = PT.getLang() === "en"
        ? "PNG cannot be size-targeted — choose JPG or WebP for target size."
        : "PNG-এ টার্গেট সাইজ কাজ করে না — JPG বা WebP বাছুন।";
      pending = PT.canvasToBlob(canvas, mime);
    } else {
      pending = PT.canvasToBlob(canvas, mime, isLossy ? q : undefined);
    }

    pending.then(function (blob) {
      if (seq !== renderSeq) return; // superseded by a newer render
      outputBlob = blob;
      outputName = PT.baseName(PT.state.file.name) + "-compressed." + extFor(mime);

      sizeAfter.textContent = PT.formatBytes(blob.size);
      var saved = PT.state.file.size - blob.size;
      var pct = PT.state.file.size ? Math.round((saved / PT.state.file.size) * 100) : 0;
      deltaEl.textContent = saved > 0
        ? (PT.getLang() === "en" ? "Saved " + pct + "% (" + PT.formatBytes(saved) + ")" : PT.formatBytes(saved) + " কমেছে (" + pct + "%)")
        : (PT.getLang() === "en" ? "No size reduction at this setting" : "এই সেটিংসে সাইজ কমেনি");

      if (targetMode && isLossy) {
        statusEl.textContent = (PT.getLang() === "en"
          ? "Target " + targetKB + " KB → got "
          : "লক্ষ্য " + targetKB + " KB → পাওয়া গেছে ") + PT.formatBytes(blob.size) + ".";
      } else if (!isLossy) {
        statusEl.textContent = PT.getLang() === "en"
          ? "PNG is lossless — use JPG/WebP for smaller files."
          : "PNG লসলেস — ছোট ফাইলের জন্য JPG/WebP ব্যবহার করুন।";
      } else {
        statusEl.textContent = (PT.getLang() === "en" ? "Ready at " : "প্রস্তুত ") + Math.round(q * 100) + "% quality.";
      }
    }).catch(function () {
      if (seq !== renderSeq) return;
      statusEl.textContent = PT.getLang() === "en" ? "Export failed — try another format." : "এক্সপোর্ট ব্যর্থ — অন্য ফরম্যাট চেষ্টা করুন।";
    });
  }

  /* ---------- Download / reset ---------- */
  downloadBtn.addEventListener("click", function () {
    if (!outputBlob) return;
    PT.downloadBlob(outputBlob, outputName);
  });

  resetBtn.addEventListener("click", function () {
    fileInput.click();
  });
})();
