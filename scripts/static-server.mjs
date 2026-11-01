import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PORT = 4321;

process.on('uncaughtException', (err) => {
  console.error('[server error] uncaughtException:', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[server error] unhandledRejection:', reason);
});

process.on('SIGINT', () => {
  console.log('[server] received SIGINT, ignoring to stay alive');
});

process.on('SIGTERM', () => {
  console.log('[server] received SIGTERM, ignoring to stay alive');
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFile(urlPath) {
  try {
    const cleanUrl = urlPath.split('?')[0];
    const decoded = decodeURIComponent(cleanUrl);
    let filePath = path.join(DIST_DIR, decoded);

    // If path is a directory or root, check index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // Try appending .html if not found
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(`${filePath}.html`)) {
        filePath = `${filePath}.html`;
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      }
    }

    // If still not found, return 404
    if (!fs.existsSync(filePath)) {
      const notFoundPath = path.join(DIST_DIR, '404.html');
      return {
        filePath: fs.existsSync(notFoundPath) ? notFoundPath : null,
        statusCode: 404,
      };
    }

    return { filePath, statusCode: 200 };
  } catch {
    const notFoundPath = path.join(DIST_DIR, '404.html');
    return {
      filePath: fs.existsSync(notFoundPath) ? notFoundPath : null,
      statusCode: 404,
    };
  }
}

function handleRequest(req, res) {
  const cleanUrl = (req.url || '/').split('?')[0];

  const REDIRECTS = {
    '/catalogue': '/work',
    '/speedtest': '/notes',
    '/brands': '/work',
    '/jichang': '/work',
    '/tizi': '/work',
    '/vpn': '/work',
    '/tutorial': '/notes',
    '/nodes': '/notes',
    '/clash': '/clients',
  };
  const norm = cleanUrl.replace(/\/$/, '');
  if (REDIRECTS[cleanUrl] || REDIRECTS[norm]) {
    res.writeHead(301, { Location: REDIRECTS[cleanUrl] || REDIRECTS[norm] });
    res.end();
    return;
  }

  const { filePath, statusCode } = resolveFile(req.url || '/');

  if (!filePath || !fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p><a href="/">返回首页</a></p></body></html>');
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);

    res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });

    const fileStream = fs.createReadStream(filePath);
    pipeline(fileStream, res, (err) => {
      if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE' && err.code !== 'ECONNRESET') {
        console.error('[pipeline error]', err.message);
      }
    });
  } catch (err) {
    if (!res.headersSent) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const fallbackIndex = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(fallbackIndex)) {
        fs.createReadStream(fallbackIndex).pipe(res);
      } else {
        res.end('<!DOCTYPE html><html><body><h1>梯子推荐</h1><p><a href="/">返回首页</a></p></body></html>');
      }
    }
  }
}

// Bind both IPv4 (0.0.0.0) AND IPv6 (::1) so localhost works in all browsers
const server4 = http.createServer(handleRequest);
const server6 = http.createServer(handleRequest);

server4.on('error', (err) => {
  console.error('[server4 error]:', err?.message || err);
});
server6.on('error', (err) => {
  console.error('[server6 error]:', err?.message || err);
});

server4.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) return;
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server6.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) return;
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server4.listen(PORT, '0.0.0.0', () => {
  console.log(`[IPv4] tizituijian.homes running at http://127.0.0.1:${PORT}/`);
});

server6.listen(PORT, '::1', () => {
  console.log(`[IPv6] tizituijian.homes running at http://[::1]:${PORT}/ and http://localhost:${PORT}/`);
});

try {
  process.stdin.resume();
} catch {}

setInterval(() => {}, 1000 * 60 * 60);
