/* ============ Circle / avatar crop ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var shapeRow = document.getElementById("shapeRow");
  var zoom = document.getElementById("zoom");
  var posX = document.getElementById("posX");
  var posY = document.getElementById("posY");
  var outSize = document.getElementById("outSize");
  var shapeColor = document.getElementById("shapeColor");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var shape = "circle";
  var outputBlob = null;
  var outputName = "avatar.png";
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
        alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
      });
  });

  shapeRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    shape = chip.dataset.shape;
    shapeRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });

  [zoom, posX, posY].forEach(function (el) {
    el.addEventListener("input", function () {
      var label = document.getElementById(el.id + "Val");
      if (label) label.textContent = el.value;
      clearTimeout(timer);
      timer = setTimeout(render, 160);
    });
  });
  [outSize, shapeColor].forEach(function (el) {
    el.addEventListener(el.tagName === "SELECT" ? "change" : "input", render);
  });

  function render() {
    if (!PT.state.image) return;
    var img = PT.state.image;
    var S = Number(outSize.value) || 512;
    canvas.width = S;
    canvas.height = S;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, S, S);

    // Background only inside the shape
    ctx.save();
    ctx.beginPath();
    if (shape === "circle") ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
    else {
      var r = S * 0.18;
      ctx.moveTo(r, 0);
      ctx.arcTo(S, 0, S, S, r);
      ctx.arcTo(S, S, 0, S, r);
      ctx.arcTo(0, S, 0, 0, r);
      ctx.arcTo(0, 0, S, 0, r);
      ctx.closePath();
    }
    ctx.fillStyle = shapeColor.value;
    ctx.fill();
    ctx.clip();

    // Cover-fit the photo with zoom + offsets
    var scale = Math.max(S / img.naturalWidth, S / img.naturalHeight) * (Number(zoom.value) / 100);
    var dw = img.naturalWidth * scale;
    var dh = img.naturalHeight * scale;
    var maxX = Math.max(0, (dw - S) / 2);
    var maxY = Math.max(0, (dh - S) / 2);
    var dx = -(dw - S) / 2 + (Number(posX.value) / 100) * maxX;
    var dy = -(dh - S) / 2 + (Number(posY.value) / 100) * maxY;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // Checker preview outside the shape for transparency context
    PT.canvasToBlob(canvas, "image/png").then(function (blob) {
      outputBlob = blob;
      outputName = PT.baseName(PT.state.file.name) + "-" + shape + "-" + S + ".png";
      sizeAfter.textContent = PT.formatBytes(blob.size);
      dimAfter.textContent = S + " × " + S + " px (PNG)";
      statusEl.textContent = PT.getLang() === "en"
        ? "Adjust zoom and position, then download the PNG."
        : "জুম ও অবস্থান ঠিক করে PNG ডাউনলোড করুন।";
    }).catch(function () { /* ignore */ });
  }

  downloadBtn.addEventListener("click", function () {
    if (outputBlob) PT.downloadBlob(outputBlob, outputName);
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();