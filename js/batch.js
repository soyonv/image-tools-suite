/* ============ Batch processing (resize / compress / convert) ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var fileList = document.getElementById("fileList");
  var opRow = document.getElementById("opRow");
  var opResize = document.getElementById("opResize");
  var opCompress = document.getElementById("opCompress");
  var opConvert = document.getElementById("opConvert");
  var batchWidth = document.getElementById("batchWidth");
  var batchQuality = document.getElementById("batchQuality");
  var batchFormatRow = document.getElementById("batchFormatRow");
  var batchResults = document.getElementById("batchResults");
  var statusEl = document.getElementById("status");
  var runBtn = document.getElementById("runBtn");
  var zipBtn = document.getElementById("zipBtn");
  var resetBtn = document.getElementById("resetBtn");

  var files = [];
  var op = "resize";
  var targetFormat = "image/jpeg";
  var results = []; // {name, bytes, blob}

  PT.initMultiUploader(dropzone, fileInput, function (list) {
    files = files.concat(list);
    controls.hidden = false;
    renderFileList();
  });

  function renderFileList() {
    fileList.innerHTML = "";
    files.forEach(function (f) {
      var chip = document.createElement("span");
      chip.className = "chip active";
      chip.textContent = f.name + " · " + PT.formatBytes(f.size);
      fileList.appendChild(chip);
    });
    statusEl.textContent = PT.pick(files.length + " file(s) selected — choose an action and run.", files.length + "টি ফাইল বাছাই হয়েছে — কাজ বাছে চালান।");
  }

  opRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    op = chip.dataset.op;
    opRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    opResize.hidden = op !== "resize";
    opCompress.hidden = op !== "compress";
    opConvert.hidden = op !== "convert";
  });

  batchFormatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    targetFormat = chip.dataset.format;
    batchFormatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
  });

  batchQuality.addEventListener("input", function () {
    var label = document.getElementById("batchQualityVal");
    if (label) label.textContent = batchQuality.value;
  });

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { PT.loadImage(reader.result).then(resolve).catch(reject); };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function process(file) {
    return loadImage(file).then(function (img) {
      var canvas = document.createElement("canvas");
      var mime = file.type;
      var quality = 0.9;
      var name = PT.baseName(file.name);

      if (op === "resize") {
        var targetW = Math.min(8000, Math.max(16, Number(batchWidth.value) || 1200));
        var scale = targetW / img.naturalWidth;
        canvas.width = targetW;
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      } else {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        if (op === "compress") {
          quality = Number(batchQuality.value) / 100;
          mime = file.type === "image/png" ? "image/jpeg" : file.type;
          if (mime === "image/jpeg" || mime === "image/webp") name = name + "-compressed";
        } else {
          mime = targetFormat;
          name = name + "-converted";
        }
      }

      var ctx = canvas.getContext("2d");
      if (mime !== "image/png") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      return PT.canvasToBlob(canvas, mime, mime === "image/png" ? undefined : quality)
        .then(function (blob) {
          var ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
          return blob.arrayBuffer().then(function (buf) {
            return {
              name: name + "." + ext,
              blob: blob,
              bytes: new Uint8Array(buf)
            };
          });
        });
    });
  }

  function renderResults() {
    batchResults.innerHTML = "";
    var totalBefore = 0;
    var totalAfter = 0;
    results.forEach(function (r, i) {
      totalAfter += r.blob.size;
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = "↓ " + r.name + " · " + PT.formatBytes(r.blob.size);
      chip.addEventListener("click", function () { PT.downloadBlob(r.blob, r.name); });
      batchResults.appendChild(chip);
    });
    files.forEach(function (f) { totalBefore += f.size; });
    if (results.length) {
      var saved = totalBefore ? Math.round(((totalBefore - totalAfter) / totalBefore) * 100) : 0;
      statusEl.textContent = PT.pick(results.length + " done · " + saved + "% smaller in total · download any file or the ZIP.", results.length + "টি সম্পন্ন · মোট " + saved + "% ছোট হয়েছে · আলাদা ফাইল বা ZIP নিন।");
    }
  }

  runBtn.addEventListener("click", function () {
    if (!files.length) return;
    results = [];
    runBtn.disabled = true;
    var chain = Promise.resolve();

    files.forEach(function (file, i) {
      chain = chain.then(function () {
        statusEl.textContent = PT.pick("Processing ", "প্রসেস হচ্ছে ") + (i + 1) + " / " + files.length + "…";
        return process(file).then(function (r) { results.push(r); });
      });
    });

    chain.then(function () {
      renderResults();
    }).catch(function () {
      statusEl.textContent = PT.pick("Some files could not be processed.", "কিছু ফাইল প্রসেস করা যায়নি।");
    }).finally(function () {
      runBtn.disabled = false;
    });
  });

  zipBtn.addEventListener("click", function () {
    if (!results.length) {
      statusEl.textContent = PT.pick("Run the processing first.", "আগে প্রসেসিং চালান।");
      return;
    }
    var blob = window.MiniZip.createZip(results);
    PT.downloadBlob(blob, "photo-tools-batch.zip");
  });

  resetBtn.addEventListener("click", function () {
    files = [];
    results = [];
    renderFileList();
    batchResults.innerHTML = "";
  });
})();