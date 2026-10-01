/* ============ Minimal ZIP writer (store mode, no dependencies) ============ */
(function (global) {
  "use strict";

  var CRC_TABLE = (function () {
    var table = new Int32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
    return table;
  })();

  function crc32(bytes) {
    var c = -1;
    for (var i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ -1) >>> 0;
  }

  function toBytes(input) {
    if (input instanceof Uint8Array) return input;
    if (input instanceof ArrayBuffer) return new Uint8Array(input);
    if (typeof Blob !== "undefined" && input instanceof Blob) {
      throw new Error("Convert Blob to ArrayBuffer first");
    }
    return null;
  }

  function dosTime(date) {
    var time = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | ((date.getSeconds() / 2) & 31);
    var day = (((date.getFullYear() - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
    return { time: time, date: day };
  }

  /**
   * @param {Array<{name:string, bytes:Uint8Array}>} entries
   * @returns {Blob}
   */
  function createZip(entries) {
    var chunks = [];
    var central = [];
    var offset = 0;
    var now = dosTime(new Date());

    entries.forEach(function (entry) {
      var nameBytes = [];
      for (var i = 0; i < entry.name.length; i++) nameBytes.push(entry.name.charCodeAt(i) & 0xff);
      var nameLen = nameBytes.length;
      var crc = crc32(entry.bytes);

      var local = new Uint8Array(30 + nameLen + entry.bytes.length);
      var lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034b50, true);
      lv.setUint16(4, 20, true);          // version needed
      lv.setUint16(6, 0, true);           // flags
      lv.setUint16(8, 0, true);           // method: store
      lv.setUint16(10, now.time, true);
      lv.setUint16(12, now.date, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, entry.bytes.length, true);
      lv.setUint32(22, entry.bytes.length, true);
      lv.setUint16(26, nameLen, true);
      lv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      local.set(entry.bytes, 30 + nameLen);

      var cd = new Uint8Array(46 + nameLen);
      var cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);          // version made by
      cv.setUint16(6, 20, true);          // version needed
      cv.setUint16(8, 0, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, now.time, true);
      cv.setUint16(14, now.date, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, entry.bytes.length, true);
      cv.setUint32(24, entry.bytes.length, true);
      cv.setUint16(28, nameLen, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      cd.set(nameBytes, 46);

      chunks.push(local);
      central.push(cd);
      offset += local.length;
    });

    var centralSize = central.reduce(function (sum, c) { return sum + c.length; }, 0);
    var end = new Uint8Array(22);
    var ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);

    return new Blob(chunks.concat(central, [end]), { type: "application/zip" });
  }

  global.MiniZip = { createZip: createZip, crc32: crc32 };
})(window);