# Cyberpunk Stacks

A cyberpunk-themed data visualization web application.

## Development Server

This project includes a lightweight Node.js development server for local preview.

### Quick Start

```bash
# Start the server (default port 3500)
npm start

# Or use the dev alias
npm run dev

# Or run directly
node server.js
```

The server will be available at: **http://localhost:3500**

### Configuration

You can customize the server using environment variables:

```bash
# Use a different port
PORT=8080 npm start

# Bind to a different host
HOST=0.0.0.0 PORT=3000 npm start
```

### Features

- **Static File Serving** - Serves HTML, CSS, JavaScript, images, and fonts
- **Default Routing** - Root path (`/`) automatically serves `index.html`
- **MIME Type Detection** - Correct content types for all common file formats
- **Error Handling** - Friendly 404 pages and proper error responses
- **Request Logging** - Console logs show all requests with timestamps and status codes
- **Security** - Directory traversal protection
- **Graceful Shutdown** - Clean exit on Ctrl+C

### Server Logs

The server provides clear console output:

```
┌─────────────────────────────────────────────────┐
│   🚀 Development Server Running                 │
└─────────────────────────────────────────────────┘

  Local:   http://localhost:3500
  Network: http://127.0.0.1:3500

  Press Ctrl+C to stop the server

─────────────────────────────────────────────────

[2026-01-22T04:09:45.299Z] GET /
[2026-01-22T04:09:45.299Z] ✓ 200: /index.html (text/html)
```

### Supported File Types

- **Web**: `.html`, `.css`, `.js`, `.json`
- **Images**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`
- **Fonts**: `.woff`, `.woff2`, `.ttf`, `.otf`
- **Text**: `.txt`

### Troubleshooting

**Port already in use?**
```bash
# Use a different port
PORT=3501 npm start
```

**Can't access the server?**
- Make sure you're using `http://` (not `https://`)
- Check that no firewall is blocking the port
- Verify the server is running (check console output)

## Development

To make changes to the website:
1. Edit `index.html`, `styles.css`, or add new files
2. Refresh your browser to see changes
3. Check the server console for request logs

## Testing

```bash
npm test
```

## License

ISC
