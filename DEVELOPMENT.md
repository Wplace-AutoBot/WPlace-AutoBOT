# Development Setup Guide

## Quick Start

```bash
# Start development with watch mode
npm run dev:userscript

# Start development with tunnel (for testing on wplace.live)
npm run dev:tunnel
```

## Cloudflare Tunnel Setup (One-time)

The tunnel allows you to test your local development code on the live wplace.live site via HTTPS.

### Method 1: Zero Trust Dashboard (Recommended)

1. **Access Zero Trust Dashboard**
   - Visit https://one.dash.cloudflare.com/
   - Go to **Networks > Tunnels**

2. **Create New Tunnel**
   - Click **"Create a tunnel"**
   - Select **"Cloudflared"** as connector type
   - Name: `wplace-bot-dev`
   - Click **"Save tunnel"**

3. **Install Cloudflared Connector**
   - The dashboard will show install commands for your OS
   - Copy and run the appropriate command:
   ```bash
   # macOS
   brew install cloudflare/cloudflare/cloudflared
   
   # Linux 
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```

4. **Authenticate Tunnel**
   - Copy the token command from dashboard (looks like):
   ```bash
   cloudflared service install eyJhbGciOiJFUzI1NiJ9...
   ```
   - Run this command to authenticate your tunnel

5. **Configure Public Hostname**
   - Click **"Public Hostnames"** tab in your tunnel
   - Click **"Add a public hostname"**
   - **Subdomain**: `wplace-bot-dev` for example
   - **Domain**: Select your domain from dropdown  
   - **Service Type**: `HTTP`
   - **URL**: `localhost:5173`
   - Click **"Save hostname"**

6. **Start Development Server**
   - Ensure your local server is running: `npm run serve:dist`
   - Your tunnel URL will be: `https://wplace-bot-dev.yourdomain.com`

### Method 2: Quick Tunnel (For Testing)
```bash
# Start quick tunnel (no dashboard setup needed)
cloudflared tunnel --url http://localhost:5173
# Generates random URL like: https://seasonal-deck-organisms-sf.trycloudflare.com
```

## Development Workflow

### Option 1: Local Development Only
```bash
npm run dev:userscript
# Files rebuild automatically on changes
# Install the built userscript in Tampermonkey
```

### Option 2: Live Testing with Tunnel
```bash
# Terminal 1: Start development server
npm run serve:dist

# Terminal 2: Start tunnel
npm run tunnel:start

# Use the bookmarklet on wplace.live:
javascript:(()=>{fetch('https://YOUR-TUNNEL-URL/auto-image.standalone.js').then(r=>r.text()).then(s=>eval(s))})()
```

### Option 3: Combined Development + Tunnel
```bash
npm run dev:tunnel
# Starts cloudflared, watch mode and serve mode (with CORS enabled)
```

## Available Scripts

### Development
- `npm run dev:userscript` - Watch mode for userscript
- `npm run dev:standalone` - Watch mode for standalone  
- `npm run dev:tunnel` - Combined development mode with tunnel support

### Building
- `npm run build` - Build all targets
- `npm run build:userscript` - Build userscript only
- `npm run build:standalone` - Build standalone only
- `npm run build:bookmarklet` - Build bookmarklet only
- `npm run build:all` - Build all targets (same as `npm run build`)

### Serving & Tunneling
- `npm run serve:dist` - Serve dist files on localhost:5173 with CORS enabled
- `npm run tunnel:quick` - Start quick tunnel (generates random URL)
- `npm run tunnel:start` - Start named tunnel (requires dashboard setup)

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Utilities
- `npm run clean` - Clean dist directory

## Bookmarklet for Testing

Create a bookmark with this URL to test on wplace.live (replace with your tunnel URL):
```javascript
javascript:(()=>{fetch('https://YOUR-TUNNEL-URL/auto-image.standalone.js').then(r=>r.text()).then(s=>eval(s))})()
```
