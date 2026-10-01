/* ============ ICO writer (PNG-embedded, no dependencies) ============ */
(function (global) {
  "use strict";

  /**
   * Build a multi-size .ico Blob from PNG-encoded entries.
   * @param {Array<{size:number, bytes:Uint8Array}>} entries
   * @returns {Blob}
   */
  function buildIco(entries) {
    if (!entries || !entries.length) throw new Error("No ICO entries");

    var count = entries.length;
    var headerSize = 6;
    var dirEntrySize = 16;
    var dataOffset = headerSize + dirEntrySize * count;

    var total = dataOffset;
    entries.forEach(function (e) { total += e.bytes.length; });

    var buf = new Uint8Array(total);
    var view = new DataView(buf.buffer);

    // ICONDIR
    view.setUint16(0, 0, true);      // reserved
    view.setUint16(2, 1, true);      // type: icon
    view.setUint16(4, count, true);  // image count

    var offset = dataOffset;
    entries.forEach(function (e, i) {
      var base = headerSize + dirEntrySize * i;
      var dim = e.size >= 256 ? 0 : e.size; // 0 means 256
      buf[base] = dim;
      buf[base + 1] = dim;
      buf[base + 2] = 0;              // palette size (0 = truecolour)
      buf[base + 3] = 0;              // reserved
      view.setUint16(base + 4, 1, true);   // colour planes
      view.setUint16(base + 6, 32, true);  // bits per pixel
      view.setUint32(base + 8, e.bytes.length, true);
      view.setUint32(base + 12, offset, true);
      buf.set(e.bytes, offset);
      offset += e.bytes.length;
    });

    return new Blob([buf], { type: "image/x-icon" });
  }

  /** Render an image to a square PNG of the requested size and return its bytes. */
  function sizeToPngBytes(image, size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    var scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
    var dw = image.naturalWidth * scale;
    var dh = image.naturalHeight * scale;
    ctx.drawImage(image, (size - dw) / 2, (size - dh) / 2, dw, dh);
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (!blob) return reject(new Error("PNG encode failed"));
        blob.arrayBuffer().then(function (buf) { resolve(new Uint8Array(buf)); });
      }, "image/png");
    });
  }

  global.IcoWriter = { buildIco: buildIco, sizeToPngBytes: sizeToPngBytes };
})(window);