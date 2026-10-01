/* ============ Image to Base64 data URI ============ */
(function () {
  "use strict";
  var PT = window.PhotoTools;

  var dropzone = document.getElementById("dropzone");
  var fileInput = document.getElementById("fileInput");
  var controls = document.getElementById("controls");
  var previewImg = document.getElementById("previewImg");
  var dataUri = document.getElementById("dataUri");
  var cssSnippet = document.getElementById("cssSnippet");
  var htmlSnippet = document.getElementById("htmlSnippet");
  var sizeHint = document.getElementById("sizeHint");
  var statusEl = document.getElementById("status");
  var copyUriBtn = document.getElementById("copyUriBtn");
  var copyCssBtn = document.getElementById("copyCssBtn");
  var copyHtmlBtn = document.getElementById("copyHtmlBtn");

  PT.initUploader(dropzone, fileInput, function (file) {
    var reader = new FileReader();
    reader.onload = function () {
      var uri = reader.result;
      var type = file.type || "image/png";
      dataUri.value = uri;
      cssSnippet.value = "background-image: url('" + uri + "');";
      htmlSnippet.value = '<img src="' + uri + '" alt="' + PT.baseName(file.name) + '">';
      previewImg.src = uri;
      controls.hidden = false;
      dropzone.style.display = "none";

      var ratio = Math.round((uri.length / file.size) * 100);
      sizeHint.textContent = PT.formatBytes(file.size) + " → " + PT.formatBytes(uri.length) +
        " (" + ratio + "% of the original size)";
      statusEl.textContent = PT.getLang() === "en"
        ? "Data URI ready — copy the code you need."
        : "ডেটা URI প্রস্তুত — প্রয়োজনমতো কোড কপি করুন।";
    };
    reader.onerror = function () {
      alert(PT.getLang() === "en" ? "Could not read this file." : "ফাইলটি পড়া যায়নি।");
    };
    reader.readAsDataURL(file);
  });

  function copy(text, msgBn, msgEn) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        statusEl.textContent = PT.getLang() === "en" ? msgEn : msgBn;
      }).catch(function () { /* ignore */ });
    } else {
      statusEl.textContent = PT.getLang() === "en"
        ? "Copy manually — select the text and press Ctrl+C."
        : "ম্যানুয়ালি কপি করুন — টেক্সট সিলেক্ট করে Ctrl+C চাপুন।";
    }
  }

  copyUriBtn.addEventListener("click", function () {
    copy(dataUri.value, "ডেটা URI কপি হয়েছে।", "Data URI copied.");
  });
  copyCssBtn.addEventListener("click", function () {
    copy(cssSnippet.value, "CSS কোড কপি হয়েছে।", "CSS copied.");
  });
  copyHtmlBtn.addEventListener("click", function () {
    copy(htmlSnippet.value, "HTML কোড কপি হয়েছে।", "HTML copied.");
  });
})();