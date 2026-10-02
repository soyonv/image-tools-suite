/* ============ Before / After comparison ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var splitRange = document.getElementById("split");
  var splitVal = document.getElementById("splitVal");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var KEYS = ["brightness", "contrast", "blur", "grayscale"];
  var sliders = {};
  var outputBlob = null;
  var outputName = "image-edited.jpg";
  var dragging = false;
  var timer = null;

  KEYS.forEach(function (k) {
    var el = document.getElementById(k);
    var val = document.getElementById(k + "Val");
    if (el) {
      sliders[k] = el;
      el.addEventListener("input", function () {
        if (val) val.textContent = el.value;
        draw();
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
        draw();
        exportFiltered();
      })
      .catch(function () {
        alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
      });
  });

  function filterString() {
    var b = Number(sliders.brightness ? sliders.brightness.value : 100);
    var c = Number(sliders.contrast ? sliders.contrast.value : 100);
    var bl = Number(sliders.blur ? sliders.blur.value : 0);
    var g = Number(sliders.grayscale ? sliders.grayscale.value : 0);
    var out = [];
    if (b !== 100) out.push("brightness(" + b + "%)");
    if (c !== 100) out.push("contrast(" + c + "%)");
    if (bl > 0) out.push("blur(" + bl + "px)");
    if (g > 0) out.push("grayscale(" + g + "%)");
    return out.join(" ");
  }

  function draw() {
    if (!PT.state.image) return;
    var img = PT.state.image;
    var pct = Number(splitRange ? splitRange.value : 50);
    if (splitVal) splitVal.textContent = pct;
    var splitX = (canvas.width * pct) / 100;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Left: original
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Right: edited (clipped)
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, 0, canvas.width - splitX, canvas.height);
    ctx.clip();
    var f = filterString();
    if (ctx.filter !== undefined) ctx.filter = f || "none";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Divider line + handle
    ctx.filter = "none";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2, canvas.width / 400);
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(splitX, canvas.height);
    ctx.stroke();
    ctx.fillStyle = "#0f766e";
    var r = Math.max(10, canvas.width / 60);
    ctx.beginPath();
    ctx.arc(splitX, canvas.height / 2, r, 0, Math.PI * 2);
    ctx.fill();

    scheduleExport();
  }

  function scheduleExport() {
    clearTimeout(timer);
    timer = setTimeout(exportFiltered, 400);
  }

  function exportFiltered() {
    if (!PT.state.image) return;
    var out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    var octx = out.getContext("2d");
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, out.width, out.height);
    var f = filterString();
    if (octx.filter !== undefined) octx.filter = f || "none";
    octx.drawImage(PT.state.image, 0, 0, out.width, out.height);

    PT.canvasToBlob(out, "image/jpeg", 0.92).then(function (blob) {
      outputBlob = blob;
      outputName = PT.baseName(PT.state.file.name) + "-edited.jpg";
      statusEl.textContent = PT.pick("Drag the slider to compare both versions.", "স্লাইডার টেনে দুই সংস্করণ তুলনা করুন।");
    }).catch(function () { /* ignore */ });
  }

  /* divider drag */
  function setSplitFromEvent(e) {
    if (!splitRange) return;
    var rect = canvas.getBoundingClientRect();
    var pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    splitRange.value = Math.max(0, Math.min(100, pct));
    draw();
  }
  canvas.addEventListener("pointerdown", function (e) {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    setSplitFromEvent(e);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (dragging) setSplitFromEvent(e);
  });
  ["pointerup", "pointercancel"].forEach(function (evt) {
    canvas.addEventListener(evt, function () { dragging = false; });
  });

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();