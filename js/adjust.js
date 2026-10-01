/* ============ Adjust / Filters tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var formatRow = document.getElementById("formatRow");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var KEYS = ["brightness", "contrast", "saturation", "blur", "grayscale", "sepia", "invert"];
  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "image-edited.jpg";
  var renderSeq = 0;
  var timer = null;

  var sliders = {};
  KEYS.forEach(function (k) {
    var el = document.getElementById(k);
    var val = document.getElementById(k + "Val");
    if (el) {
      sliders[k] = el;
      el.addEventListener("input", function () {
        if (val) val.textContent = el.value;
        schedule();
      });
    }
  });

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        controls.hidden = false;
        dropzone.style.display = "none";
        sizeBefore.textContent = PT.formatBytes(file.size);
        dimBefore.textContent = canvas.width + " × " + canvas.height + " px";
        render();
      })
      .catch(function () {
        alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
      });
  });

  function filterString() {
    var b = Number(sliders.brightness ? sliders.brightness.value : 100);
    var c = Number(sliders.contrast ? sliders.contrast.value : 100);
    var s = Number(sliders.saturation ? sliders.saturation.value : 100);
    var bl = Number(sliders.blur ? sliders.blur.value : 0);
    var g = Number(sliders.grayscale ? sliders.grayscale.value : 0);
    var se = Number(sliders.sepia ? sliders.sepia.value : 0);
    var inv = Number(sliders.invert ? sliders.invert.value : 0);
    var out = [];
    if (b !== 100) out.push("brightness(" + b + "%)");
    if (c !== 100) out.push("contrast(" + c + "%)");
    if (s !== 100) out.push("saturate(" + s + "%)");
    if (bl > 0) out.push("blur(" + bl + "px)");
    if (g > 0) out.push("grayscale(" + g + "%)");
    if (se > 0) out.push("sepia(" + se + "%)");
    if (inv > 0) out.push("invert(" + inv + "%)");
    return out.join(" ");
  }

  function setSliders(vals) {
    Object.keys(vals).forEach(function (k) {
      if (sliders[k]) {
        sliders[k].value = vals[k];
        var label = document.getElementById(k + "Val");
        if (label) label.textContent = vals[k];
      }
    });
    schedule();
  }

  var presets = {
    presetBW: { brightness: 100, contrast: 115, saturation: 0, blur: 0, grayscale: 100, sepia: 0, invert: 0 },
    presetWarm: { brightness: 106, contrast: 104, saturation: 120, blur: 0, grayscale: 0, sepia: 35, invert: 0 },
    presetCool: { brightness: 102, contrast: 106, saturation: 92, blur: 0, grayscale: 0, sepia: 0, invert: 0 },
    presetVivid: { brightness: 104, contrast: 122, saturation: 150, blur: 0, grayscale: 0, sepia: 0, invert: 0 }
  };
  Object.keys(presets).forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", function () { setSliders(presets[id]); });
  });
  var resetFilters = document.getElementById("resetFilters");
  if (resetFilters) {
    resetFilters.addEventListener("click", function () {
      setSliders({ brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, invert: 0 });
    });
  }

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 160);
  }

  function render() {
    if (!PT.state.image) return;
    var seq = ++renderSeq;
    var img = PT.state.image;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (outputFormat !== "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    var f = filterString();
    if (ctx.filter !== undefined) ctx.filter = f || "none";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
      .then(function (blob) {
        if (seq !== renderSeq) return;
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-edited." +
          (outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg");
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = canvas.width + " × " + canvas.height + " px";
        statusEl.textContent = f
          ? (PT.getLang() === "en" ? "Filters applied — live preview updated." : "ফিল্টার প্রয়োগ হয়েছে — প্রিভিউ আপডেট হয়েছে।")
          : (PT.getLang() === "en" ? "No filters yet — move a slider to start." : "এখনো কোনো ফিল্টার নেই — স্লাইডার নাড়ান।");
      })
      .catch(function () {
        statusEl.textContent = PT.getLang() === "en" ? "Export failed." : "এক্সপোর্ট ব্যর্থ।";
      });
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();