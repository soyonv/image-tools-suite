/* ============ Crop / Rotate / Flip tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("cropCanvas");
  var ctx = canvas.getContext("2d");

  var rotateBtn = document.getElementById("rotateBtn");
  var flipHBtn = document.getElementById("flipHBtn");
  var flipVBtn = document.getElementById("flipVBtn");
  var formatRow = document.getElementById("formatRow");

  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var work = null;          // offscreen canvas holding current (rotated/flipped) image
  var dispScale = 1;        // display canvas scale vs full-res work canvas
  var crop = { x: 0, y: 0, w: 0, h: 0 };
  var outputFormat = "image/png";
  var outputBlob = null;
  var outputName = "image-cropped.png";
  var drag = null;          // { mode: 'move'|'resize'|'new', corner, startX, startY, orig }
  var renderTimer = null;
  var renderSeq = 0;

  var MIN_SIZE = 32;

  /* ---------- Load ---------- */
  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) {
      return PT.loadImage(url);
    }).then(function (img) {
      PT.setImage(file, img);
      work = document.createElement("canvas");
      work.width = img.naturalWidth;
      work.height = img.naturalHeight;
      work.getContext("2d").drawImage(img, 0, 0);

      controls.hidden = false;
      dropzone.style.display = "none";

      sizeBefore.textContent = PT.formatBytes(file.size);
      dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px";

      resetCrop();
      setupDisplay();
      draw();
      scheduleOutput(0);
      statusEl.textContent = PT.pick("Drag on the photo to select the area to crop.", "ছবির উপর ড্র্যাগ করে কাটার এলাকা বাছুন।");
    }).catch(function () {
      alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
    });
  });

  function resetCrop() {
    crop = { x: 0, y: 0, w: work.width, h: work.height };
  }

  function setupDisplay() {
    dispScale = Math.min(1, 1600 / work.width, 1600 / work.height);
    canvas.width = Math.max(1, Math.round(work.width * dispScale));
    canvas.height = Math.max(1, Math.round(work.height * dispScale));
  }

  /* ---------- Drawing ---------- */
  function draw() {
    if (!work) return;
    ctx.setTransform(dispScale, 0, 0, dispScale, 0, 0);
    ctx.clearRect(0, 0, work.width, work.height);
    ctx.drawImage(work, 0, 0);

    // Dim outside crop
    ctx.fillStyle = "rgba(10, 20, 18, 0.55)";
    var x = crop.x, y = crop.y, w = crop.w, h = crop.h;
    ctx.fillRect(0, 0, work.width, y);                                  // top
    ctx.fillRect(0, y + h, work.width, work.height - (y + h));          // bottom
    ctx.fillRect(0, y, x, h);                                           // left
    ctx.fillRect(x + w, y, work.width - (x + w), h);                    // right

    // Crop border
    var lw = 2 / dispScale;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = lw;
    ctx.strokeRect(x, y, w, h);
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = lw * 0.6;
    ctx.strokeRect(x, y, w, h);

    // Corner handles
    var hs = 10 / dispScale;
    ctx.fillStyle = "#0f766e";
    [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(function (p) {
      ctx.fillRect(p[0] - hs / 2, p[1] - hs / 2, hs, hs);
    });

    // Dimension label
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    var fontPx = Math.max(12, Math.round(13 * (canvas.width / Math.max(work.width, 1))));
    ctx.font = "600 " + fontPx + "px sans-serif";
    var label = Math.round(w) + " × " + Math.round(h);
    var pad = 6;
    var tw = ctx.measureText(label).width;
    var lx = Math.max(4, crop.x * dispScale + 6);
    var ly = Math.max(fontPx + 8, crop.y * dispScale - 6);
    ctx.fillStyle = "rgba(15, 118, 110, 0.92)";
    ctx.fillRect(lx - pad / 2, ly - fontPx - 3, tw + pad, fontPx + 8);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, lx, ly);
  }

  /* ---------- Pointer interaction ---------- */
  function toImage(e) {
    var rect = canvas.getBoundingClientRect();
    var px = (e.clientX - rect.left) * (canvas.width / rect.width);
    var py = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x: px / dispScale, y: py / dispScale };
  }

  function hitCorner(pt) {
    var tol = 16 / dispScale;
    var corners = [
      { c: "nw", x: crop.x, y: crop.y },
      { c: "ne", x: crop.x + crop.w, y: crop.y },
      { c: "sw", x: crop.x, y: crop.y + crop.h },
      { c: "se", x: crop.x + crop.w, y: crop.y + crop.h }
    ];
    for (var i = 0; i < corners.length; i++) {
      if (Math.abs(pt.x - corners[i].x) <= tol && Math.abs(pt.y - corners[i].y) <= tol) {
        return corners[i].c;
      }
    }
    return null;
  }

  function inside(pt) {
    return pt.x >= crop.x && pt.x <= crop.x + crop.w && pt.y >= crop.y && pt.y <= crop.y + crop.h;
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (!work) return;
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    var pt = toImage(e);
    var corner = hitCorner(pt);
    if (corner) {
      drag = { mode: "resize", corner: corner, start: pt, orig: Object.assign({}, crop) };
    } else if (inside(pt)) {
      drag = { mode: "move", start: pt, orig: Object.assign({}, crop) };
    } else {
      drag = { mode: "new", start: pt, orig: Object.assign({}, crop) };
      crop = { x: clamp(pt.x, 0, work.width), y: clamp(pt.y, 0, work.height), w: 0, h: 0 };
    }
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!work || !drag) return;
    e.preventDefault();
    var pt = toImage(e);

    if (drag.mode === "move") {
      var dx = pt.x - drag.start.x;
      var dy = pt.y - drag.start.y;
      crop.x = clamp(drag.orig.x + dx, 0, work.width - crop.w);
      crop.y = clamp(drag.orig.y + dy, 0, work.height - crop.h);
    } else if (drag.mode === "new") {
      crop.x = clamp(Math.min(drag.start.x, pt.x), 0, work.width);
      crop.y = clamp(Math.min(drag.start.y, pt.y), 0, work.height);
      crop.w = clamp(Math.abs(pt.x - drag.start.x), 0, work.width - crop.x);
      crop.h = clamp(Math.abs(pt.y - drag.start.y), 0, work.height - crop.y);
    } else if (drag.mode === "resize") {
      var o = drag.orig;
      var right = o.x + o.w, bottom = o.y + o.h;
      var nx = o.x, ny = o.y, nr = right, nb = bottom;
      if (drag.corner.indexOf("n") !== -1) ny = clamp(pt.y, 0, bottom - MIN_SIZE);
      if (drag.corner.indexOf("s") !== -1) nb = clamp(pt.y, ny + MIN_SIZE, work.height);
      if (drag.corner.indexOf("w") !== -1) nx = clamp(pt.x, 0, right - MIN_SIZE);
      if (drag.corner.indexOf("e") !== -1) nr = clamp(pt.x, nx + MIN_SIZE, work.width);
      crop = { x: nx, y: ny, w: nr - nx, h: nb - ny };
    }
    draw();
  });

  ["pointerup", "pointercancel"].forEach(function (evt) {
    canvas.addEventListener(evt, function (e) {
      if (!drag) return;
      drag = null;
      if (crop.w < MIN_SIZE || crop.h < MIN_SIZE) resetCrop();
      draw();
      scheduleOutput(60);
    });
  });

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  /* ---------- Rotate / flip ---------- */
  function transformCanvas(kind) {
    if (!work) return;
    var rotated = kind === "rot";
    var nw = rotated ? work.height : work.width;
    var nh = rotated ? work.width : work.height;
    var next = document.createElement("canvas");
    next.width = nw;
    next.height = nh;
    var c = next.getContext("2d");

    if (kind === "rot") {
      c.translate(nw, 0);
      c.rotate(Math.PI / 2);
    } else if (kind === "flipH") {
      c.translate(nw, 0);
      c.scale(-1, 1);
    } else if (kind === "flipV") {
      c.translate(0, nh);
      c.scale(1, -1);
    }
    c.drawImage(work, 0, 0);
    work = next;
    resetCrop();
    setupDisplay();
    draw();
    scheduleOutput(0);
    statusEl.textContent = PT.pick("Transform applied.", "পরিবর্তন প্রয়োগ হয়েছে।");
  }

  rotateBtn.addEventListener("click", function () { transformCanvas("rot"); });
  flipHBtn.addEventListener("click", function () { transformCanvas("flipH"); });
  flipVBtn.addEventListener("click", function () { transformCanvas("flipV"); });

  /* ---------- Output format ---------- */
  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("active", c === chip);
    });
    scheduleOutput(0);
  });

  /* ---------- Export cropped result ---------- */
  function scheduleOutput(delay) {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(renderOutput, typeof delay === "number" ? delay : 180);
  }

  function renderOutput() {
    if (!work) return;
    var seq = ++renderSeq;
    var sx = Math.max(0, Math.round(crop.x));
    var sy = Math.max(0, Math.round(crop.y));
    var sw = Math.max(1, Math.min(work.width - sx, Math.round(crop.w)));
    var sh = Math.max(1, Math.min(work.height - sy, Math.round(crop.h)));

    var out = document.createElement("canvas");
    out.width = sw;
    out.height = sh;
    var octx = out.getContext("2d");
    if (outputFormat === "image/jpeg") {
      octx.fillStyle = "#ffffff";
      octx.fillRect(0, 0, sw, sh);
    }
    octx.drawImage(work, sx, sy, sw, sh, 0, 0, sw, sh);

    PT.canvasToBlob(out, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
        .then(function (blob) {
          if (seq !== renderSeq) return;
          outputBlob = blob;
          outputName = PT.baseName(PT.state.file.name) + "-cropped." +
            (outputFormat === "image/png" ? "png" : "jpg");
          sizeAfter.textContent = PT.formatBytes(blob.size);
          dimAfter.textContent = sw + " × " + sh + " px";
          statusEl.textContent = PT.pick("Crop ready — " + sw + " × " + sh + " px.", "ক্রপ প্রস্তুত — " + sw + " × " + sh + " px।");
        })
        .catch(function () {
          if (seq !== renderSeq) return;
          statusEl.textContent = PT.pick("Export failed.", "এক্সপোর্ট ব্যর্থ।");
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
