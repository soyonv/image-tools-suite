/* ============ Passport-size photo maker ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var presetRow = document.getElementById("presetRow");
  var modeRow = document.getElementById("modeRow");
  var canvas = document.getElementById("passportCanvas");
  var ctx = canvas.getContext("2d");

  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var DPI = 300;
  var preset = { w: 35, h: 45, unit: "mm", label: "35x45mm" };
  var mode = "cover"; // cover | contain
  var outputBlob = null;
  var outputName = "passport-35x45mm.jpg";
  var renderTimer = null;
  var renderSeq = 0;

  /* ---------- Preset math ---------- */
  function toPixels(value, unit) {
    if (unit === "in") return Math.round(value * DPI);
    return Math.round((value / 25.4) * DPI);
  }

  function chipLabel(chip) {
    var lang = PT.getLang();
    return (lang === "en" ? chip.getAttribute("data-en") : chip.getAttribute("data-bn")) || chip.textContent;
  }

  /* ---------- Load ---------- */
  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) {
      return PT.loadImage(url);
    }).then(function (img) {
      PT.setImage(file, img);
      controls.hidden = false;
      dropzone.style.display = "none";

      sizeBefore.textContent = PT.formatBytes(file.size);
      dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px";

      scheduleRender(0);
      statusEl.textContent = PT.pick("Photo loaded — choose a size preset.", "ছবি লোড হয়েছে — সাইজ প্রিসেট বাছুন।");
    }).catch(function () {
      alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
    });
  });

  /* ---------- Presets ---------- */
  presetRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    presetRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    preset = {
      w: parseFloat(chip.dataset.w),
      h: parseFloat(chip.dataset.h),
      unit: chip.dataset.unit,
      label: chipLabel(chip)
    };
    scheduleRender(0);
  });

  modeRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    modeRow.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    mode = chip.dataset.mode;
    scheduleRender(0);
  });

  /* ---------- Render ---------- */
  function scheduleRender(delay) {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, typeof delay === "number" ? delay : 160);
  }

  function render() {
    if (!PT.state.image) return;
    var seq = ++renderSeq;
    var img = PT.state.image;
    var fw = toPixels(preset.w, preset.unit);
    var fh = toPixels(preset.h, preset.unit);

    canvas.width = fw;
    canvas.height = fh;

    // White base (passport photos require a clean light background)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, fw, fh);

    var scale;
    if (mode === "contain") {
      scale = Math.min(fw / img.naturalWidth, fh / img.naturalHeight);
    } else {
      scale = Math.max(fw / img.naturalWidth, fh / img.naturalHeight);
    }
    var dw = img.naturalWidth * scale;
    var dh = img.naturalHeight * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (fw - dw) / 2, (fh - dh) / 2, dw, dh);

    PT.canvasToBlob(canvas, "image/jpeg", 0.92).then(function (blob) {
      if (seq !== renderSeq) return;
      outputBlob = blob;
      var unitLabel = preset.unit === "in" ? "in" : "mm";
      outputName = "passport-" + preset.w + "x" + preset.h + unitLabel + "-300dpi.jpg";

      sizeAfter.textContent = PT.formatBytes(blob.size);
      dimAfter.textContent = fw + " × " + fh + " px @ " + DPI + " DPI · " +
        preset.w + "×" + preset.h + " " + unitLabel;
      statusEl.textContent = PT.pick("Ready: ", "প্রস্তুত: ") +
        preset.label + " @ " + DPI + " DPI.";
    }).catch(function () {
      if (seq !== renderSeq) return;
      statusEl.textContent = PT.pick("Export failed.", "এক্সপোর্ট ব্যর্থ।");
    });
  }

  /* ---------- Re-render labels on language change ---------- */
  document.addEventListener("langchange", function () {
    if (!PT.state.image) return;
    var active = presetRow.querySelector(".chip.active");
    if (active) {
      preset = {
        w: parseFloat(active.dataset.w),
        h: parseFloat(active.dataset.h),
        unit: active.dataset.unit,
        label: chipLabel(active)
      };
    }
    scheduleRender(0);
  });

  /* ---------- Download / reset ---------- */
  downloadBtn.addEventListener("click", function () {
    if (!outputBlob) return;
    PT.downloadBlob(outputBlob, outputName);
  });

  resetBtn.addEventListener("click", function () {
    fileInput.click();
  });
})();
