const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3501;
const HOST = process.env.HOST || '0.0.0.0';

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Log incoming requests
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // Decode URL and remove query parameters
  let filePath = decodeURIComponent(req.url.split('?')[0]);

  // Default to index.html for root path
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Build full file path (serve from current directory)
  const fullPath = path.join(__dirname, filePath);

  // Security check: prevent directory traversal
  if (!fullPath.startsWith(__dirname)) {
    console.error(`[${timestamp}] ⚠️  Security: Attempt to access outside directory: ${filePath}`);
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Read and serve the file
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.error(`[${timestamp}] ❌ 404: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>404 Not Found</title>
            <style>
              body { font-family: monospace; padding: 50px; background: #1a1a2e; color: #16f4d0; }
              h1 { color: #ff006e; }
            </style>
          </head>
          <body>
            <h1>404 - Not Found</h1>
            <p>The requested file <code>${filePath}</code> was not found.</p>
            <p><a href="/" style="color: #16f4d0;">Go to homepage</a></p>
          </body>
          </html>
        `);
      } else {
        // Other server error
        console.error(`[${timestamp}] ❌ 500: ${err.message}`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
      return;
    }

    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Serve the file
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    console.log(`[${timestamp}] ✓ 200: ${filePath} (${contentType})`);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log('\n┌─────────────────────────────────────────────────┐');
  console.log('│   🚀 Development Server Running                 │');
  console.log('└─────────────────────────────────────────────────┘\n');
  console.log(`  Local:            http://localhost:${PORT}`);
  console.log(`  Network:          http://127.0.0.1:${PORT}`);
  console.log(`  Listening on:     ${HOST}:${PORT} (all interfaces)\n`);
  console.log('  ✓ Accessible via SSH tunnel\n');
  console.log('  Press Ctrl+C to stop the server\n');
  console.log('─────────────────────────────────────────────────\n');
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use.`);
    console.error(`   Try setting a different port: PORT=3501 node server.js\n`);
  } else {
    console.error(`\n❌ Server error: ${err.message}\n`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed\n');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed\n');
    process.exit(0);
  });
});
