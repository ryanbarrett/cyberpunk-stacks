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

The server binds to `0.0.0.0` by default, making it accessible both locally and via SSH tunnels.

You can customize the server using environment variables:

```bash
# Use a different port
PORT=8080 npm start

# Bind to localhost only (restrict to local machine access only)
HOST=localhost PORT=3000 npm start

# Explicitly bind to all interfaces (default behavior)
HOST=0.0.0.0 PORT=3000 npm start
```

### Remote Access & SSH Tunneling

The server listens on all network interfaces (`0.0.0.0`) by default, allowing access via SSH port forwarding:

```bash
# On your local machine, tunnel the remote port
ssh -L 3500:localhost:3500 user@remote-server

# Then access the server at http://localhost:3500 in your browser
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

  Local:            http://localhost:3500
  Network:          http://127.0.0.1:3500
  Listening on:     0.0.0.0:3500 (all interfaces)

  ✓ Accessible via SSH tunnel

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

**Connection refused via SSH tunnel?**
- The server now binds to `0.0.0.0` by default (fixed)
- Verify the server shows "Listening on: 0.0.0.0:PORT (all interfaces)"
- Check your SSH tunnel command: `ssh -L 3500:localhost:3500 user@server`

**Can't access the server?**
- Make sure you're using `http://` (not `https://`)
- Check that no firewall is blocking the port
- Verify the server is running (check console output)
- For local-only access, use `HOST=localhost npm start`

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
