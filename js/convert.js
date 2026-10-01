/* ============ PNG ↔ JPG ↔ WebP converter ============ */
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

  var formatRow = document.getElementById("formatRow");
  var qualityField = document.getElementById("qualityField");
  var qualityRange = document.getElementById("qualityRange");
  var qualityVal = document.getElementById("qualityVal");
  var resultFrame = document.getElementById("resultFrame");
  var resultImg = document.getElementById("resultImg");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "image.jpg";
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
      dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px · " +
        (file.type.split("/")[1] || "?").toUpperCase();

      // Smart default target format
      var t = file.type;
      if (t === "image/png") setFormat("image/jpeg");
      else if (t === "image/jpeg" || t === "image/jpg") setFormat("image/png");
      else if (t === "image/webp") setFormat("image/jpeg");
      else setFormat("image/jpeg");

      render();
      statusEl.textContent = PT.getLang() === "en"
        ? "Photo loaded — choose an output format."
        : "ছবি লোড হয়েছে — আউটপুট ফরম্যাট বাছুন।";
    }).catch(function () {
      alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
    });
  });

  /* ---------- Format chips ---------- */
  function setFormat(mime) {
    outputFormat = mime;
    formatRow.querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c.dataset.format === mime);
    });
    qualityField.hidden = mime === "image/png";
    render();
  }

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (chip) setFormat(chip.dataset.format);
  });

  qualityRange.addEventListener("input", function () {
    qualityVal.textContent = qualityRange.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 180);
  });

  /* ---------- Render ---------- */
  function extFor(mime) {
    return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
  }

  function render() {
    if (!PT.state.image) return;
    var seq = ++renderSeq;
    var img = PT.state.image;
    var mime = outputFormat;
    var isLossy = mime !== "image/png";
    var q = parseInt(qualityRange.value, 10) / 100;

    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");

    if (mime === "image/jpeg") {
      ctx.fillStyle = "#ffffff"; // flatten transparency for JPG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    PT.canvasToBlob(canvas, mime, isLossy ? q : undefined).then(function (blob) {
      if (seq !== renderSeq) return;
      outputBlob = blob;
      outputName = PT.baseName(PT.state.file.name) + "." + extFor(mime);

      sizeAfter.textContent = PT.formatBytes(blob.size);
      var diff = blob.size - PT.state.file.size;
      var pct = PT.state.file.size ? Math.round((Math.abs(diff) / PT.state.file.size) * 100) : 0;
      deltaEl.textContent = diff < 0
        ? (PT.getLang() === "en" ? pct + "% smaller" : pct + "% ছোট")
        : diff > 0
          ? (PT.getLang() === "en" ? pct + "% larger" : pct + "% বড়")
          : (PT.getLang() === "en" ? "same size" : "একই সাইজ");

      resultFrame.hidden = false;
      resultImg.src = canvas.toDataURL(mime === "image/png" ? "image/png" : mime, 0.9);

      statusEl.textContent = (PT.getLang() === "en" ? "Converted to " : "কনভার্ট হয়েছে ") +
        extFor(mime).toUpperCase() + ".";
    }).catch(function () {
      if (seq !== renderSeq) return;
      statusEl.textContent = PT.getLang() === "en" ? "Conversion failed — try another format." : "কনভার্ট ব্যর্থ — অন্য ফরম্যাট চেষ্টা করুন।";
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
