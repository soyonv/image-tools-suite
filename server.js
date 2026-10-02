#!/usr/bin/env node
/* Minimal zero-dependency static file server for local preview.
   Serves the site root, maps directories to index.html, and falls
   back to 404.html for missing paths. Binds 0.0.0.0 with $PORT. */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT || "3000", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".zip": "application/zip",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2"
};

function send(res, status, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("500 Internal Server Error");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(status, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache"
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch (e) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  // Normalize and prevent directory traversal
  let filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    fs.stat(filePath, (err2) => {
      if (!err2) {
        send(res, 200, filePath);
      } else {
        const notFound = path.join(ROOT, "404.html");
        fs.stat(notFound, (err3) => {
          if (!err3) send(res, 404, notFound);
          else {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
          }
        });
      }
    });
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Photo Sahayak static server running on http://0.0.0.0:" + PORT);
});
