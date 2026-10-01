/* ============ Resize Image tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var previewWrap = document.getElementById("previewWrap");
  var previewImg = document.getElementById("previewImg");
  var controls = document.getElementById("controls");
  var resultFrame = document.getElementById("resultFrame");
  var resultImg = document.getElementById("resultImg");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");

  var modePxBtn = document.getElementById("modePx");
  var modePctBtn = document.getElementById("modePct");
  var dimWrap = document.getElementById("dimWrap");
  var pctWrap = document.getElementById("pctWrap");
  var widthInput = document.getElementById("widthInput");
  var heightInput = document.getElementById("heightInput");
  var lockAspect = document.getElementById("lockAspect");
  var pctInput = document.getElementById("pctInput");
  var presetRow = document.getElementById("presetRow");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var mode = "px";
  var origW = 0, origH = 0, aspect = 1;
  var outputBlob = null;
  var outputName = "image-resized.jpg";
  var debounceTimer = null;

  /* ---------- File loading ---------- */
  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) {
      return PT.loadImage(url);
    }).then(function (img) {
      PT.setImage(file, img);
      origW = img.naturalWidth;
      origH = img.naturalHeight;
      aspect = origW / origH;

      previewImg.src = img.src;
      previewWrap.classList.add("visible");
      controls.hidden = false;

      widthInput.value = origW;
      heightInput.value = origH;
      pctInput.value = 100;

      sizeBefore.textContent = PT.formatBytes(file.size);
      dimBefore.textContent = origW + " × " + origH + " px";

      clearPresetActive();
      scheduleRender();
      statusEl.textContent = PT.getLang() === "en"
        ? "Photo loaded — adjust the size below."
        : "ছবি লোড হয়েছে — নিচে সাইজ ঠিক করুন।";
    }).catch(function () {
      alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
    });
  });

  /* ---------- Modes ---------- */
  function setMode(next) {
    mode = next;
    var isPx = mode === "px";
    modePxBtn.classList.toggle("active", isPx);
    modePctBtn.classList.toggle("active", !isPx);
    dimWrap.hidden = !isPx;
    pctWrap.hidden = isPx;
    clearPresetActive();
    if (!isPx) syncFromPixels();
    scheduleRender();
  }
  modePxBtn.addEventListener("click", function () { setMode("px"); });
  modePctBtn.addEventListener("click", function () { setMode("pct"); });

  function syncFromPixels() {
    if (origW) pctInput.value = Math.max(1, Math.round((parseInt(widthInput.value, 10) || origW) / origW * 100));
  }

  /* ---------- Presets ---------- */
  function clearPresetActive() {
    presetRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
  }
  presetRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    setMode("px");
    widthInput.value = chip.dataset.w;
    heightInput.value = chip.dataset.h;
    lockAspect.checked = false;
    clearPresetActive();
    chip.classList.add("active");
    render();
  });

  /* ---------- Inputs ---------- */
  widthInput.addEventListener("input", function () {
    clearPresetActive();
    if (lockAspect.checked && origW) {
      var w = parseInt(widthInput.value, 10) || 0;
      if (w > 0) heightInput.value = Math.max(1, Math.round(w / aspect));
    }
    scheduleRender();
  });
  heightInput.addEventListener("input", function () {
    clearPresetActive();
    if (lockAspect.checked && origH) {
      var h = parseInt(heightInput.value, 10) || 0;
      if (h > 0) widthInput.value = Math.max(1, Math.round(h * aspect));
    }
    scheduleRender();
  });
  pctInput.addEventListener("input", scheduleRender);

  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 180);
  }

  /* ---------- Render output ---------- */
  function targetSize() {
    var w, h;
    if (mode === "pct") {
      var pct = Math.min(500, Math.max(1, parseInt(pctInput.value, 10) || 100)) / 100;
      w = Math.max(1, Math.round(origW * pct));
      h = Math.max(1, Math.round(origH * pct));
    } else {
      w = Math.min(12000, Math.max(1, parseInt(widthInput.value, 10) || origW));
      h = Math.min(12000, Math.max(1, parseInt(heightInput.value, 10) || origH));
    }
    return { w: w, h: h };
  }

  function outputMime() {
    var t = PT.state.file && PT.state.file.type;
    if (t === "image/png") return "image/png";
    if (t === "image/webp") return "image/webp";
    if (t === "image/gif") return "image/png";
    return "image/jpeg";
  }

  function extFor(mime) {
    return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  }

  function render() {
    if (!PT.state.image) return;
    var size = targetSize();
    var canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    var ctx = canvas.getContext("2d");

    var mime = outputMime();
    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size.w, size.h);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(PT.state.image, 0, 0, size.w, size.h);

    var quality = mime === "image/png" ? undefined : 0.92;
    PT.canvasToBlob(canvas, mime, quality).then(function (blob) {
      outputBlob = blob;
      outputName = PT.baseName(PT.state.file.name) + "-resized." + extFor(mime);

      sizeAfter.textContent = PT.formatBytes(blob.size);
      dimAfter.textContent = size.w + " × " + size.h + " px";

      resultFrame.hidden = false;
      resultImg.src = canvas.toDataURL(mime === "image/png" ? "image/png" : mime, 0.9);

      var delta = PT.state.file.size - blob.size;
      var pct = PT.state.file.size ? Math.round((delta / PT.state.file.size) * 100) : 0;
      statusEl.textContent = (PT.getLang() === "en"
        ? "Ready. "
        : "প্রস্তুত। ") + (delta > 0
          ? (PT.getLang() === "en" ? "File is " + pct + "% smaller." : "ফাইল " + pct + "% ছোট হয়েছে।")
          : (PT.getLang() === "en" ? "New dimensions applied." : "নতুন মাপ প্রয়োগ হয়েছে।"));
    }).catch(function () {
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
