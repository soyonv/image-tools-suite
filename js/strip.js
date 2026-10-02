/* ============ Strip EXIF / metadata ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var previewImg = document.getElementById("previewImg");
  var formatRow = document.getElementById("formatRow");
  var quality = document.getElementById("quality");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "image-clean.jpg";
  var timer = null;
  var renderSeq = 0;

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        previewImg.src = img.src;
        controls.hidden = false;
        dropzone.style.display = "none";
        sizeBefore.textContent = PT.formatBytes(file.size);
        dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px";
        render();
      })
      .catch(function () {
        alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
      });
  });

  quality.addEventListener("input", function () {
    var label = document.getElementById("qualityVal");
    if (label) label.textContent = quality.value;
    clearTimeout(timer);
    timer = setTimeout(render, 180);
  });

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });

  function render() {
    if (!PT.state.image) return;
    var seq = ++renderSeq;
    var img = PT.state.image;
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    // Flattening through a canvas is what strips every metadata block.
    if (outputFormat !== "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    var q = Number(quality.value) / 100;
    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : q)
      .then(function (blob) {
        if (seq !== renderSeq) return;
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-clean." +
          (outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg");
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = canvas.width + " × " + canvas.height + " px · metadata removed";
        statusEl.textContent = PT.pick("Clean copy ready — EXIF, GPS and camera info are gone.", "পরিষ্কার ছবি প্রস্তুত — EXIF, GPS ও ক্যামেরা তথ্য মুছে ফেলা হয়েছে।");
      })
      .catch(function () { /* ignore */ });
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();