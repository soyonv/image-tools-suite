/* ============ Images → PDF (client-side PDF writer) ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var fileList = document.getElementById("fileList");
  var pageSizeRow = document.getElementById("pageSizeRow");
  var orientRow = document.getElementById("orientRow");
  var margin = document.getElementById("margin");
  var pdfQuality = document.getElementById("pdfQuality");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var files = [];
  var pageSize = "a4";
  var orientation = "portrait";

  PT.initMultiUploader(dropzone, fileInput, function (list) {
    files = files.concat(list);
    controls.hidden = false;
    renderList();
  });

  function renderList() {
    fileList.innerHTML = "";
    files.forEach(function (f) {
      var chip = document.createElement("span");
      chip.className = "chip active";
      chip.textContent = f.name + " · " + PT.formatBytes(f.size);
      fileList.appendChild(chip);
    });
    statusEl.textContent = PT.getLang() === "en"
      ? files.length + " image(s) ready — set the page options and download."
      : files.length + "টি ছবি প্রস্তুত — পেজ সেট করে ডাউনলোড করুন।";
  }

  pageSizeRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    pageSize = chip.dataset.size;
    pageSizeRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
  });
  orientRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    orientation = chip.dataset.orient;
    orientRow.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === chip); });
  });
  [margin, pdfQuality].forEach(function (el) {
    el.addEventListener("input", function () {
      var label = document.getElementById(el.id + "Val");
      if (label) label.textContent = el.value;
    });
  });

  function pageDims() {
    var w = pageSize === "letter" ? 612 : 595.28;
    var h = pageSize === "letter" ? 792 : 841.89;
    if (orientation === "landscape") { var t = w; w = h; h = t; }
    return { w: w, h: h };
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        PT.loadImage(reader.result).then(resolve).catch(reject);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function canvasJpeg(canvas, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (!blob) return reject(new Error("encode failed"));
        blob.arrayBuffer().then(function (buf) { resolve(new Uint8Array(buf)); });
      }, "image/jpeg", quality);
    });
  }

  function encodeString(str) {
    var out = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) out[i] = str.charCodeAt(i) & 0xff;
    return out;
  }

  /* Minimal PDF: one page per image, JPEG (DCTDecode) embedded */
  function buildPdf(images, pageW, pageH, marginPt) {
    var objects = [];
    function add(str) { objects.push(typeof str === "string" ? encodeString(str) : str); }

    // Reserve 1 = catalog, 2 = pages
    objects.push(null);
    objects.push(null);

    var kids = [];
    images.forEach(function (img, i) {
      var pageObj = 3 + i * 3;
      var imgObj = pageObj + 1;
      var contentObj = pageObj + 2;
      kids.push(pageObj + " 0 R");

      // Fit the image inside the printable area, centred.
      var maxW = pageW - marginPt * 2;
      var maxH = pageH - marginPt * 2;
      var scale = Math.min(maxW / img.w, maxH / img.h);
      var dw = img.w * scale;
      var dh = img.h * scale;
      var dx = (pageW - dw) / 2;
      var dy = (pageH - dh) / 2;

      var page =
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + pageW.toFixed(2) + " " + pageH.toFixed(2) + "] " +
        "/Resources << /XObject << /Im0 " + imgObj + " 0 R >> >> /Contents " + contentObj + " 0 R >>";
      add(page);

      var imgHead = "<< /Type /XObject /Subtype /Image /Width " + img.w + " /Height " + img.h +
        " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + img.bytes.length + " >>\nstream\n";
      add(concat(encodeString(imgHead), img.bytes, encodeString("\nendstream")));

      var content = "q " + dw.toFixed(2) + " 0 0 " + dh.toFixed(2) + " " + dx.toFixed(2) + " " + dy.toFixed(2) + " cm /Im0 Do Q";
      add(concat(encodeString("<< /Length " + content.length + " >>\nstream\n"), encodeString(content), encodeString("\nendstream")));
    });

    objects[0] = encodeString("<< /Type /Catalog /Pages 2 0 R >>");
    objects[1] = encodeString("<< /Type /Pages /Kids [" + kids.join(" ") + "] /Count " + images.length + " >>");

    // Assemble file
    var chunks = [];
    var offsets = [];
    var position = 0;
    function push(bytes) { chunks.push(bytes); position += bytes.length; }

    push(encodeString("%PDF-1.4\n"));
    push(new Uint8Array([37, 226, 227, 207, 211, 10]));

    objects.forEach(function (body, i) {
      offsets[i] = position;
      push(encodeString((i + 1) + " 0 obj\n"));
      push(body);
      push(encodeString("\nendobj\n"));
    });

    var xrefPos = position;
    var xref = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
    for (var i = 0; i < objects.length; i++) {
      xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    xref += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefPos + "\n%%EOF\n";
    push(encodeString(xref));

    return concat.apply(null, chunks);
  }

  function concat() {
    var arrays = Array.prototype.slice.call(arguments);
    var total = arrays.reduce(function (sum, a) { return sum + a.length; }, 0);
    var out = new Uint8Array(total);
    var pos = 0;
    arrays.forEach(function (a) { out.set(a, pos); pos += a.length; });
    return out;
  }

  downloadBtn.addEventListener("click", function () {
    if (!files.length) return;
    statusEl.textContent = PT.getLang() === "en" ? "Building PDF…" : "PDF তৈরি হচ্ছে…";
    downloadBtn.disabled = true;

    var dims = pageDims();
    var marginPt = (Number(margin.value) * 72) / 25.4;
    var q = Number(pdfQuality.value) / 100;
    var pxScale = 2; // render at ~144 dpi for crisp print
    var chain = Promise.resolve();
    var images = [];

    files.forEach(function (file) {
      chain = chain.then(function () {
        return loadImage(file).then(function (img) {
          var boxW = dims.w - marginPt * 2;
          var boxH = dims.h - marginPt * 2;
          var scale = Math.min(boxW / img.naturalWidth, boxH / img.naturalHeight);
          var w = Math.max(1, Math.round(img.naturalWidth * scale * pxScale));
          var h = Math.max(1, Math.round(img.naturalHeight * scale * pxScale));
          var canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          return canvasJpeg(canvas, q).then(function (bytes) {
            images.push({ bytes: bytes, w: w, h: h });
          });
        });
      });
    });

    chain.then(function () {
      var pdf = buildPdf(images, dims.w, dims.h, marginPt);
      var blob = new Blob([pdf], { type: "application/pdf" });
      PT.downloadBlob(blob, PT.baseName(files[0].name) + ".pdf");
      statusEl.textContent = PT.getLang() === "en"
        ? "PDF downloaded — " + images.length + " page(s)."
        : "PDF ডাউনলোড হয়েছে — " + images.length + " পৃষ্ঠা।";
    }).catch(function () {
      statusEl.textContent = PT.getLang() === "en"
        ? "Could not build the PDF. Try fewer or smaller images."
        : "PDF তৈরি করা যায়নি। কম বা ছোট ছবি দিয়ে চেষ্টা করুন।";
    }).finally(function () {
      downloadBtn.disabled = false;
    });
  });

  resetBtn.addEventListener("click", function () {
    files = [];
    renderList();
  });
})();