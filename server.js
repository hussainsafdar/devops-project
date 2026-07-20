const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // Resolve safely. Files under /src are served from the project's src dir
  // so the browser can load the shared math engine.
  let baseDir = ROOT;
  if (urlPath.startsWith("/src/")) {
    baseDir = __dirname;
    urlPath = urlPath.slice(1); // drop leading slash so path.join works
  }

  // Resolve safely inside the chosen root (prevent path traversal).
  const filePath = path.join(baseDir, path.normalize(urlPath));
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Calculator running at ${url}`);
  openBrowser(url);
});

function openBrowser(url) {
  const platform = process.platform;
  let command;
  if (platform === "darwin") command = `open "${url}"`;
  else if (platform === "win32") command = `cmd /c start "" "${url}"`;
  else command = `xdg-open "${url}"`;
  exec(command, (err) => {
    if (err) console.log("Open this URL manually in your browser:", url);
  });
}
