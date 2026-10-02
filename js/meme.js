/* ============ Meme generator ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var topText = document.getElementById("topText");
  var bottomText = document.getElementById("bottomText");
  var fontSize = document.getElementById("fontSize");
  var strokeWidth = document.getElementById("strokeWidth");
  var textColor = document.getElementById("textColor");
  var strokeColor = document.getElementById("strokeColor");
  var uppercase = document.getElementById("uppercase");
  var formatRow = document.getElementById("formatRow");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "meme.jpg";
  var timer = null;

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
        alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
      });
  });

  [topText, bottomText, textColor, strokeColor].forEach(function (el) {
    el.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(render, 180);
    });
  });
  [fontSize, strokeWidth].forEach(function (el) {
    el.addEventListener("input", function () {
      var label = document.getElementById(el.id + "Val");
      if (label) label.textContent = el.value;
      clearTimeout(timer);
      timer = setTimeout(render, 180);
    });
  });
  uppercase.addEventListener("change", render);

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });

  function drawCaption(text, atTop) {
    if (!text) return;
    var value = uppercase.checked ? text.toUpperCase() : text;
    var fs = Math.max(14, Math.round(canvas.height * (Number(fontSize.value) / 100) * 0.6));
    var maxWidth = canvas.width * 0.92;

    ctx.font = "800 " + fs + 'px "Noto Sans Bengali", Impact, system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = atTop ? "top" : "bottom";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    var words = value.split(/\s+/);
    var lines = [];
    var line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);

    var sw = Math.max(2, Math.round((Number(strokeWidth.value) / 100) * fs * 0.8));
    var lineHeight = fs * 1.12;
    var startY = atTop ? Math.round(fs * 0.18) : canvas.height - Math.round(fs * 0.18) - (lines.length - 1) * lineHeight;

    lines.forEach(function (l, i) {
      var y = startY + i * lineHeight;
      ctx.lineWidth = sw;
      ctx.strokeStyle = strokeColor.value;
      ctx.strokeText(l, canvas.width / 2, y);
      ctx.fillStyle = textColor.value;
      ctx.fillText(l, canvas.width / 2, y);
    });
  }

  function render() {
    if (!PT.state.image) return;
    var img = PT.state.image;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (outputFormat !== "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    drawCaption((topText.value || "").trim(), true);
    drawCaption((bottomText.value || "").trim(), false);

    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
      .then(function (blob) {
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-meme." +
          (outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg");
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = canvas.width + " × " + canvas.height + " px";
        statusEl.textContent = PT.pick("Type your caption — the meme updates instantly.", "লেখা লিখুন — মিম সঙ্গে সঙ্গে আপডেট হবে।");
      })
      .catch(function () { /* ignore */ });
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();