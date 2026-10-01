/* ============ Rotate & Flip tool ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var formatRow = document.getElementById("formatRow");
  var bgWhite = document.getElementById("bgWhite");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var work = null;
  var outputFormat = "image/jpeg";
  var outputBlob = null;
  var outputName = "image-rotated.jpg";
  var renderSeq = 0;

  function ext(mime) { return mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg"; }

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        work = document.createElement("canvas");
        work.width = img.naturalWidth;
        work.height = img.naturalHeight;
        work.getContext("2d").drawImage(img, 0, 0);

        controls.hidden = false;
        dropzone.style.display = "none";
        sizeBefore.textContent = PT.formatBytes(file.size);
        dimBefore.textContent = work.width + " × " + work.height + " px";
        render();
      })
      .catch(function () {
        alert(PT.getLang() === "en" ? "Could not read this image." : "এই ছবিটি পড়া যায়নি।");
      });
  });

  function transform(kind) {
    if (!work) return;
    var next = document.createElement("canvas");
    if (kind === "rot180") {
      next.width = work.width; next.height = work.height;
      var c = next.getContext("2d");
      c.translate(next.width, next.height);
      c.rotate(Math.PI);
    } else if (kind === "rotL" || kind === "rotR") {
      next.width = work.height; next.height = work.width;
      var c2 = next.getContext("2d");
      if (kind === "rotR") { c2.translate(next.width, 0); c2.rotate(Math.PI / 2); }
      else { c2.translate(0, next.height); c2.rotate(-Math.PI / 2); }
    } else {
      next.width = work.width; next.height = work.height;
      var c3 = next.getContext("2d");
      if (kind === "flipH") { c3.translate(next.width, 0); c3.scale(-1, 1); }
      else { c3.translate(0, next.height); c3.scale(1, -1); }
    }
    next.getContext("2d").drawImage(work, 0, 0);
    work = next;
    render();
  }

  ["rotL", "rotR", "rot180", "flipH", "flipV"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", function () { transform(id); });
  });
  var resetAll = document.getElementById("resetAll");
  if (resetAll) {
    resetAll.addEventListener("click", function () {
      if (!PT.state.image) return;
      var img = PT.state.image;
      work = document.createElement("canvas");
      work.width = img.naturalWidth;
      work.height = img.naturalHeight;
      work.getContext("2d").drawImage(img, 0, 0);
      render();
    });
  }

  formatRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    outputFormat = chip.dataset.format;
    formatRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
    render();
  });
  bgWhite.addEventListener("change", render);

  function render() {
    if (!work) return;
    var seq = ++renderSeq;
    canvas.width = work.width;
    canvas.height = work.height;
    if (outputFormat !== "image/png" && bgWhite.checked) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(work, 0, 0);

    PT.canvasToBlob(canvas, outputFormat, outputFormat === "image/png" ? undefined : 0.92)
      .then(function (blob) {
        if (seq !== renderSeq) return;
        outputBlob = blob;
        outputName = PT.baseName(PT.state.file.name) + "-rotated." + ext(outputFormat);
        sizeAfter.textContent = PT.formatBytes(blob.size);
        dimAfter.textContent = work.width + " × " + work.height + " px";
        statusEl.textContent = PT.getLang() === "en"
          ? "Ready — download when you are happy with the result."
          : "প্রস্তুত — পছন্দ হলে ডাউনলোড করুন।";
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