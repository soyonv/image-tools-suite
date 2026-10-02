/* ============ Image colour picker & palette ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var pickedSwatch = document.getElementById("pickedSwatch");
  var pickedHex = document.getElementById("pickedHex");
  var paletteRow = document.getElementById("paletteRow");
  var statusEl = document.getElementById("status");
  var copyPickedBtn = document.getElementById("copyPickedBtn");
  var copyPaletteBtn = document.getElementById("copyPaletteBtn");
  var resetBtn = document.getElementById("resetBtn");

  var palette = [];

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        var maxW = 900;
        var scale = Math.min(1, maxW / img.naturalWidth);
        canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        controls.hidden = false;
        dropzone.style.display = "none";
        extractPalette();
      })
      .catch(function () {
        alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
      });
  });

  function hex(r, g, b) {
    return "#" + [r, g, b].map(function (v) {
      return ("0" + Math.max(0, Math.min(255, v)).toString(16)).slice(-2);
    }).join("");
  }

  function extractPalette() {
    // Sample a smaller grid, then group similar colours into buckets.
    var w = 80;
    var h = Math.max(1, Math.round((canvas.height / canvas.width) * w));
    var tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    var tctx = tmp.getContext("2d");
    tctx.drawImage(canvas, 0, 0, w, h);

    var data;
    try {
      data = tctx.getImageData(0, 0, w, h).data;
    } catch (e) {
      statusEl.textContent = PT.pick("This image cannot be sampled in the browser.", "ছবিটি ব্রাউজারে স্যাম্পল করা যায়নি।");
      return;
    }

    var buckets = {};
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      var r = data[i], g = data[i + 1], b = data[i + 2];
      var key = [Math.round(r / 24), Math.round(g / 24), Math.round(b / 24)].join(",");
      if (!buckets[key]) buckets[key] = { r: 0, g: 0, b: 0, n: 0 };
      buckets[key].r += r;
      buckets[key].g += g;
      buckets[key].b += b;
      buckets[key].n++;
    }

    palette = Object.keys(buckets)
      .map(function (k) {
        var bk = buckets[k];
        return { hex: hex(bk.r / bk.n, bk.g / bk.n, bk.b / bk.n), n: bk.n };
      })
      .sort(function (a, b) { return b.n - a.n; })
      .slice(0, 8);

    renderPalette();
    if (palette.length) setPicked(palette[0].hex);
  }

  function renderPalette() {
    paletteRow.innerHTML = "";
    palette.forEach(function (c) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.style.background = c.hex;
      chip.style.color = contrast(c.hex);
      chip.textContent = c.hex;
      chip.addEventListener("click", function () { setPicked(c.hex); });
      paletteRow.appendChild(chip);
    });
    statusEl.textContent = PT.pick(palette.length + " dominant colours found.", palette.length + "টি প্রধান রং পাওয়া গেছে।");
  }

  function contrast(hexColor) {
    var c = hexColor.replace("#", "");
    var r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#16211f" : "#ffffff";
  }

  function setPicked(value) {
    pickedHex.value = value;
    pickedSwatch.style.background = value;
  }

  canvas.addEventListener("pointerdown", function (e) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor(((e.clientX - rect.left) / rect.width) * canvas.width);
    var y = Math.floor(((e.clientY - rect.top) / rect.height) * canvas.height);
    try {
      var d = ctx.getImageData(x, y, 1, 1).data;
      setPicked(hex(d[0], d[1], d[2]));
    } catch (err) { /* ignore */ }
  });

  function copy(text, msgBn, msgEn) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        statusEl.textContent = PT.pick(msgEn, msgBn);
      }).catch(function () { /* ignore */ });
    }
  }

  copyPickedBtn.addEventListener("click", function () {
    copy(pickedHex.value, "রঙের কোড কপি হয়েছে।", "Colour code copied.");
  });
  copyPaletteBtn.addEventListener("click", function () {
    copy(palette.map(function (c) { return c.hex; }).join(", "), "পুরো প্যালেট কপি হয়েছে।", "Whole palette copied.");
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();