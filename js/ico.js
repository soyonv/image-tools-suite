/* ============ Convert image to .ico ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var previewImg = document.getElementById("previewImg");
  var sizeRow = document.getElementById("sizeRow");
  var sizeBefore = document.getElementById("sizeBefore");
  var dimBefore = document.getElementById("dimBefore");
  var sizeAfter = document.getElementById("sizeAfter");
  var dimAfter = document.getElementById("dimAfter");
  var statusEl = document.getElementById("status");
  var downloadBtn = document.getElementById("downloadBtn");
  var resetBtn = document.getElementById("resetBtn");

  var icoBlob = null;
  var timer = null;

  PT.initUploader(dropzone, fileInput, function (file) {
    PT.readFileAsDataURL(file).then(function (url) { return PT.loadImage(url); })
      .then(function (img) {
        PT.setImage(file, img);
        previewImg.src = img.src;
        controls.hidden = false;
        dropzone.style.display = "none";
        sizeBefore.textContent = PT.formatBytes(file.size);
        dimBefore.textContent = img.naturalWidth + " × " + img.naturalHeight + " px";
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
    clearTimeout(timer);
    timer = setTimeout(build, 120);
  });

  function selectedSizes() {
    return Array.prototype.slice
      .call(sizeRow.querySelectorAll(".chip.active"))
      .map(function (c) { return Number(c.dataset.size); })
      .sort(function (a, b) { return a - b; });
  }

  function build() {
    if (!PT.state.image) return;
    var sizes = selectedSizes();
    if (!sizes.length) {
      statusEl.textContent = PT.pick("Pick at least one size.", "অন্তত একটি সাইজ বাছুন।");
      return;
    }
    statusEl.textContent = PT.pick("Building ICO…", "ICO ফাইল তৈরি হচ্ছে…");

    var chain = Promise.resolve();
    var entries = [];
    sizes.forEach(function (size) {
      chain = chain.then(function () {
        return window.IcoWriter.sizeToPngBytes(PT.state.image, size).then(function (bytes) {
          entries.push({ size: size, bytes: bytes });
        });
      });
    });

    chain.then(function () {
      icoBlob = window.IcoWriter.buildIco(entries);
      sizeAfter.textContent = PT.formatBytes(icoBlob.size);
      dimAfter.textContent = sizes.join(", ") + " px";
      statusEl.textContent = PT.pick("ICO ready with " + sizes.length + " size(s).", sizes.length + "টি সাইজসহ ICO প্রস্তুত।");
    }).catch(function () {
      statusEl.textContent = PT.pick("Could not build the ICO file.", "ICO ফাইল তৈরি করা যায়নি।");
    });
  }

  downloadBtn.addEventListener("click", function () {
    if (icoBlob) PT.downloadBlob(icoBlob, PT.baseName(PT.state.file.name) + ".ico");
  });
  resetBtn.addEventListener("click", function () { fileInput.click(); });
})();