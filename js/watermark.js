/* ============ Watermark tool (text or logo) ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var modeRow = document.getElementById("modeRow");
  var textControls = document.getElementById("textControls");
  var imageControls = document.getElementById("imageControls");
  var logoInput = document.getElementById("logoInput");
  var wmText = document.getElementById("wmText");
  var wmColor = document.getElementById("wmColor");
  var wmSize = document.getElementById("wmSize");
  var wmOpacity = document.getElementById("wmOpacity");
  var wmPos = document.getElementById("wmPos");
  var formatRow = document.getElementById("formatRow");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var mode = "text";
  var logoImage = null;
  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "image-watermarked.jpg";
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
        alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
      });
  });

  modeRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    mode = chip.dataset.mode;
    modeRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    textControls.hidden = mode !== "text";
    imageControls.hidden = mode !== "image";
    render();
  });

  logoInput.addEventListener("change", function () {
    var file = logoInput.files && logoInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      PT.loadImage(reader.result).then(function (img) {
        logoImage = img;
        render();
      });
    };
    reader.readAsDataURL(file);
  });

  [wmText, wmColor, wmSize, wmOpacity, wmPos].forEach(function (el) {
    if (!el) return;
    el.addEventListener(el.tagName === "INPUT" && el.type === "range" ? "input" : "input", function () {
      var v = document.getElementById(el.id + "Val");
      if (v) v.textContent = el.value;
      clearTimeout(timer);
      timer = setTimeout(render, 180);
    });
  });

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });

  function positionOf(pad) {
    var pos = wmPos.value;
    return {
      tl: [pad, pad], tr: [canvas.width - pad, pad],
      bl: [pad, canvas.height - pad], br: [canvas.width - pad, canvas.height - pad],
      center: [canvas.width / 2, canvas.height / 2]
    }[pos] || [canvas.width - pad, canvas.height - pad];
  }

  function drawTextWatermark() {
    var text = (wmText.value || "").trim();
    if (!text) return;
    var pct = Number(wmSize.value) / 100;
    var fontPx = Math.max(12, Math.round(canvas.height * 0.12 * pct * 2.2));
    var pos = wmPos.value;

    ctx.font = "600 " + fontPx + 'px "Noto Sans Bengali", system-ui, sans-serif';
    ctx.fillStyle = wmColor.value;
    ctx.globalAlpha = Number(wmOpacity.value) / 100;
    ctx.textBaseline = pos === "tl" || pos === "tr" ? "top" : pos === "center" ? "middle" : "bottom";
    ctx.textAlign = pos === "tl" || pos === "bl" ? "left" : pos === "tr" || pos === "br" ? "right" : "center";

    if (pos === "tile") {
      var stepX = ctx.measureText(text).width + fontPx * 2;
      var stepY = fontPx * 3;
      var savedAlpha = ctx.globalAlpha;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((-20 * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var cols = Math.ceil(canvas.width / stepX) + 2;
      var rows = Math.ceil(canvas.height / stepY) + 2;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          ctx.fillText(text, (c - cols / 2) * stepX, (r - rows / 2) * stepY);
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = savedAlpha;
      return;
    }

    var margin = Math.round(fontPx * 0.5);
    var p = positionOf(margin);
    ctx.fillText(text, p[0], p[1]);
  }

  function drawLogoWatermark() {
    if (!logoImage) return;
    var pct = Number(wmSize.value) / 100;
    var targetW = Math.round(canvas.width * 0.3 * pct);
    var ratio = logoImage.height / logoImage.width;
    var targetH = Math.round(targetW * ratio);
    var pos = wmPos.value;
    var margin = Math.round(Math.min(canvas.width, canvas.height) * 0.03);

    ctx.globalAlpha = Number(wmOpacity.value) / 100;

    if (pos === "tile") {
      var stepX = targetW * 1.8;
      var stepY = targetH * 2.2;
      for (var y = -stepY; y < canvas.height + stepY; y += stepY) {
        for (var x = -stepX; x < canvas.width + stepX; x += stepX) {
          ctx.drawImage(logoImage, x, y, targetW, targetH);
        }
      }
      ctx.globalAlpha = 1;
      return;
    }

    var x = pos === "tr" || pos === "br" ? canvas.width - targetW - margin : pos === "center" ? (canvas.width - targetW) / 2 : margin;
    var y = pos === "bl" || pos === "br" ? canvas.height - targetH - margin : pos === "center" ? (canvas.height - targetH) / 2 : margin;
    ctx.drawImage(logoImage, x, y, targetW, targetH);
    ctx.globalAlpha = 1;
  }

  function render() {
    if (!PT.state.image) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (outputFormat !== "image/png") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(PT.state.image, 0, 0);

    if (mode === "text") drawTextWatermark(); else drawLogoWatermark();
    ctx.globalAlpha = 1;

    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
      .then(function (blob) {
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-watermarked." +
          (outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg");
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = canvas.width + " × " + canvas.height + " px";
        statusEl.textContent = mode === "image" && !logoImage
          ? (PT.getLang() === "en" ? "Choose a logo image to continue." : "একটি লোগো ছবি বেছে নিন।")
          : (PT.getLang() === "en" ? "Watermark applied — live preview updated." : "ওয়াটারমার্ক বসানো হয়েছে।");
      })
      .catch(function () { /* ignore */ });
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();