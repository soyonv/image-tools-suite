/* ============ Add border tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var borderWidth = document.getElementById("borderWidth");
  var padding = document.getElementById("padding");
  var radius = document.getElementById("radius");
  var borderColor = document.getElementById("borderColor");
  var bgColor = document.getElementById("bgColor");
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
  var outputName = "image-bordered.jpg";
  var timer = null;

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
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

  [borderWidth, padding, radius].forEach(function (el) {
    el.addEventListener("input", function () {
      var label = document.getElementById(el.id + "Val");
      if (label) label.textContent = el.value;
      clearTimeout(timer);
      timer = setTimeout(render, 160);
    });
  });
  [borderColor, bgColor].forEach(function (el) {
    el.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(render, 160);
    });
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
    var img = PT.state.image;
    var bw = Number(borderWidth.value);
    var pd = Number(padding.value);
    var rad = Number(radius.value);
    var outer = bw * 2 + pd * 2;

    canvas.width = img.naturalWidth + outer;
    canvas.height = img.naturalHeight + outer;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer background
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border colour area
    ctx.fillStyle = borderColor.value;
    roundRect(ctx, 0, 0, canvas.width, canvas.height, rad);
    ctx.fill();

    // Photo (rounded if requested)
    ctx.save();
    if (rad > 0) {
      roundRect(ctx, pd, pd, img.naturalWidth, img.naturalHeight, Math.max(0, rad - bw));
      ctx.clip();
    }
    ctx.drawImage(img, pd, pd);
    ctx.restore();

    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
      .then(function (blob) {
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-bordered." +
          (outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg");
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = canvas.width + " × " + canvas.height + " px";
        statusEl.textContent = PT.pick("Border applied — adjust the sliders until it looks right.", "বর্ডার প্রয়োগ হয়েছে — স্লাইডার দিয়ে ঠিক করুন।");
      })
      .catch(function () { /* ignore */ });
  }

  function roundRect(c, x, y, w, h, r) {
    var radius = Math.min(r, w / 2, h / 2);
    c.beginPath();
    if (c.roundRect) {
      c.roundRect(x, y, w, h, radius);
      return;
    }
    c.moveTo(x + radius, y);
    c.arcTo(x + w, y, x + w, y + h, radius);
    c.arcTo(x + w, y + h, x, y + h, radius);
    c.arcTo(x, y + h, x, y, radius);
    c.arcTo(x, y, x + w, y, radius);
    c.closePath();
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();