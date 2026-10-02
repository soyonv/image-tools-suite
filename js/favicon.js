/* ============ Favicon generator ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var previewImg = document.getElementById("previewImg");
  var sizeRow = document.getElementById("sizeRow");
  var previewGrid = document.getElementById("previewGrid");
  var snippet = document.getElementById("htmlSnippet");
  var statusEl = document.getElementById("status");
  var downloadAllBtn = document.getElementById("downloadAllBtn");
  var downloadIcoBtn = document.getElementById("downloadIcoBtn");
  var copyCodeBtn = document.getElementById("copyCodeBtn");
  var resetBtn = document.getElementById("resetBtn");

  var rendered = {}; // size -> {blob, bytes, dataUrl}

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        previewImg.src = img.src;
        controls.hidden = false;
        dropzone.style.display = "none";
        build();
      })
      .catch(function () {
        alert(PT.pick("Could not read this image.", "এই ছবিটি পড়া যায়নি।"));
      });
  });

  sizeRow.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    chip.classList.toggle("active");
    build();
  });

  function selectedSizes() {
    return Array.prototype.slice
      .call(sizeRow.querySelectorAll(".chip.active"))
      .map(function (c) { return Number(c.dataset.size); })
      .sort(function (a, b) { return a - b; });
  }

  function renderPreviews() {
    previewGrid.innerHTML = "";
    selectedSizes().forEach(function (size) {
      var item = document.createElement("div");
      item.className = "trust-item";
      item.style.textAlign = "center";

      var img = document.createElement("img");
      img.src = rendered[size].dataUrl;
      img.alt = size + "px favicon preview";
      img.style.width = "56px";
      img.style.height = "56px";
      img.style.margin = "0 auto 8px";
      img.style.imageRendering = "pixelated";

      var label = document.createElement("div");
      label.textContent = size + " × " + size + " px";

      var meta = document.createElement("div");
      meta.className = "delta";
      meta.textContent = PT.formatBytes(rendered[size].blob.size);

      item.appendChild(img);
      item.appendChild(label);
      item.appendChild(meta);
      previewGrid.appendChild(item);
    });
  }

  function snippetHtml(sizes) {
    var lines = [
      '<link rel="icon" href="/favicon.ico" sizes="any">'
    ];
    if (sizes.indexOf(32) !== -1) lines.push('<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">');
    if (sizes.indexOf(16) !== -1) lines.push('<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">');
    if (sizes.indexOf(180) !== -1) lines.push('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
    if (sizes.indexOf(192) !== -1) lines.push('<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">');
    if (sizes.indexOf(512) !== -1) lines.push('<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">');
    lines.push('<meta name="theme-color" content="#0f766e">');
    return lines.join("\n");
  }

  function build() {
    if (!PT.state.image) return;
    var sizes = selectedSizes();
    if (!sizes.length) {
      previewGrid.innerHTML = "";
      statusEl.textContent = PT.pick("Pick at least one size.", "অন্তত একটি সাইজ বাছুন।");
      return;
    }
    statusEl.textContent = PT.pick("Rendering icons…", "আইকন তৈরি হচ্ছে…");

    var chain = Promise.resolve();
    sizes.forEach(function (size) {
      chain = chain.then(function () {
        return window.IcoWriter.sizeToPngBytes(PT.state.image, size).then(function (bytes) {
          rendered[size] = { bytes: bytes, blob: new Blob([bytes], { type: "image/png" }) };
          return new Promise(function (resolve) {
            var fr = new FileReader();
            fr.onload = function () { rendered[size].dataUrl = fr.result; resolve(); };
            fr.readAsDataURL(rendered[size].blob);
          });
        });
      });
    });

    chain.then(function () {
      renderPreviews();
      snippet.value = snippetHtml(sizes);
      statusEl.textContent = PT.pick(sizes.length + " icon(s) ready — download the PNGs or one ICO file.", sizes.length + "টি আইকন প্রস্তুত — PNG বা একসাথে .ico নিন।");
    });
  }

  downloadAllBtn.addEventListener("click", function () {
    var sizes = selectedSizes();
    sizes.forEach(function (size, i) {
      setTimeout(function () {
        var name = size === 180 ? "apple-touch-icon.png"
          : size === 192 ? "android-chrome-192x192.png"
          : size === 512 ? "android-chrome-512x512.png"
          : "favicon-" + size + "x" + size + ".png";
        PT.downloadBlob(rendered[size].blob, name);
      }, i * 350);
    });
  });

  downloadIcoBtn.addEventListener("click", function () {
    var entries = selectedSizes().map(function (size) {
      return { size: size, bytes: rendered[size].bytes };
    });
    try {
      var blob = window.IcoWriter.buildIco(entries);
      PT.downloadBlob(blob, "favicon.ico");
      statusEl.textContent = PT.pick("favicon.ico downloaded — drop it in your site root.", "favicon.ico ডাউনলোড হয়েছে — সাইটের রুটে রাখুন।");
    } catch (e) {
      statusEl.textContent = PT.pick("Could not build the ICO file.", "ICO ফাইল তৈরি করা যায়নি।");
    }
  });

  copyCodeBtn.addEventListener("click", function () {
    if (!snippet.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(snippet.value).then(function () {
        statusEl.textContent = PT.pick("HTML copied to clipboard.", "কোড কপি হয়েছে।");
      }).catch(function () { snippet.select(); });
    } else {
      snippet.select();
    }
  });

  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();