# DEVELOPMENT.md

WPlace-AutoBOT Development Guide

This document describes how to set up, build, and iterate on the project.
It reflects the current repository state as of the latest commits.

If you run into anything unclear or outdated, please open an issue or a PR
to improve this guide.

## Table of contents

- Quick start
- Build targets and outputs
- Development workflows
- Serving and tunneling
- Project structure
- Environment and prerequisites
- Code quality and formatting
- Documentation generation
- CI/CD overview
- Testing and Quality Assurance
- Testing recipes
- Troubleshooting
- FAQ

## Quick start

1) Install dependencies

```bash
npm ci
```

2) Generate all builds once

```bash
npm run build
```

3) Start a development workflow (pick one)

- **Script Manager (Recommended for users):**
  - Install the userscript manager: [WPlace Bot Manager](https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/src/wplace-bot-manager.user.js)
  - Visit https://wplace.live and press **Ctrl+Shift+M**
  - Add your development scripts with custom URLs for easy testing

- Userscript (Tampermonkey/Violentmonkey):

  ```bash
  npm run dev:userscript
  ```

- Standalone (console-injected/bookmarklet):

  ```bash
  npm run dev:standalone
  ```

4) Serve the dist folder locally on http://localhost:5173

```bash
npm run serve:dist
```

5) Optional: expose your local server via Cloudflare Tunnel

- Quick (random URL, no .env required):

  ```bash
  npm run tunnel:quick
  ```

- Authenticated (stable tunnel via token in .env; recommended):

 - Put your token in a local .env (see "Environment" below)
 - Start the tunnel:

   ```bash
   npm run tunnel:start
   ```

6) Develop, iterate, and test on wplace.live using one of the "Testing recipes" further below.

Tip: To run all dev pieces at once (watch + serve + tokenized tunnel), use:

```bash
npm run dev:tunnel
```

This runs:
- dev:standalone
- serve:dist
- tunnel:start

## Build targets and outputs

The build system is based on esbuild with custom plugins that embed assets
directly into the bundle. No external URLs are used in the final artifacts.

Targets are defined in build/esbuild.config.js and produced in dist/:

- Standalone
 - File: dist/auto-image.standalone.js
 - Format: IIFE executed in page context
 - Use cases: console injection, bookmarklet wrapper

- Userscript
 - File: dist/auto-image.userscript.js
 - Contains Tampermonkey/Violentmonkey header
 - Match: https://wplace.live/*
 - Use case: install/update via a local or tunneled URL

- Bookmarklet
 - File: dist/auto-image.bookmarklet.js
 - Wrapper: dist/auto-image.bookmarklet.txt (ready-to-paste javascript:... URL)
 - Use case: create a browser bookmark for one-click injection

Available build scripts:

```bash
# Build everything (default)
npm run build

# Build a specific target
npm run build:userscript
npm run build:standalone
npm run build:bookmarklet

# Build all targets (explicit)
npm run build:all
```

Notes:
- The CI validates that outputs exist and the "standalone" bundle contains
  no http/https references.
- After building the bookmarklet target, a .txt wrapper is generated to
  make creating a bookmark easy.

## Development workflows

Pick the workflow that matches your testing style.

1) Userscript-based development

- Start a watcher:

  ```bash
  npm run dev:userscript
  ```

- Serve dist files:

  ```bash
  npm run serve:dist
  ```

- In Tampermonkey/Violentmonkey, install from URL:
  http://localhost:5173/auto-image.userscript.js or, when tunneling,
  https://your-tunnel-url/auto-image.userscript.js

- Reload wplace.live to pick up updates.

2) Standalone/bookmarklet development

- Start a watcher:

  ```bash
  npm run dev:standalone
  ```

- Serve dist files:

  ```bash
  npm run serve:dist
  ```

- Inject into wplace.live via:
 - DevTools Console (see "Testing recipes")
 - Bookmarklet:
  - Build bookmarklet or use watcher, then open dist/auto-image.bookmarklet.txt
  - Copy its content (starts with javascript:(function(){…})();)
  - Create a new bookmark with that content as the URL
  - Click it on https://wplace.live

3) One command tunnel workflow (recommended for remote devices)

- Put your Cloudflare tunnel token in .env (see next section)
- Run:

  ```bash
  npm run dev:tunnel
  ```

This will:
- watch standalone changes
- serve dist on http://localhost:5173 with CORS
- start tunnel (https public URL)

Then use the tunnel URL in your testing recipes.

## Serving and tunneling

Local static server:

```bash
npm run serve:dist
```

- Serves the dist folder on http://localhost:5173
- CORS is enabled for easy injection across origins

Cloudflare Tunnel options:

- Quick tunnel (ephemeral, random URL; no setup required):

  ```bash
  npm run tunnel:quick
  ```

- Tokenized tunnel (stable URL tied to your account; requires .env):

 1) Install Cloudflared (https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)
 2) In the Cloudflare Zero Trust dashboard:
  - Networks -> Tunnels -> Create a tunnel -> "Cloudflared"
  - After creation, copy the connector "Install and run" token
 3) Create .env in repo root:

  ```bash
  CLOUDFLARED_TOKEN=your_tunnel_token_here
  ```

 4) Start the tunnel:

  ```bash
  npm run tunnel:start
  ```

- All-in-one dev loop:

  ```bash
  npm run dev:tunnel
  ```

Security note: Your tunnel token is a secret. Keep it in .env (already
.gitignore'd). Never commit or share it.

## Project structure

```
WPlace-AutoBOT/
├── src/        # Source code (runtime)
│ ├── Auto-Image.js   # Main script
│ ├── wplace-bot-manager.user.js  # Userscript manager for easy script switching
│ ├── auto-image-styles.css
│ ├── lang/     # Embedded translations (JSON)
│ └── themes/     # Embedded themes (CSS)
├── build/
│ └── esbuild.config.js # Builds all targets, embeds assets
├── scripts/
│ └── tunnel.js     # Cloudflared tunnel runner (token mode)
├── dist/       # Build outputs
├── docs/
│ └── api/README.md   # Generated from JSDoc
├── AccountSwapper/   # Account Swapper extention
├── package.json
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .gitignore
├── .env.example
└── LICENSE
```

Embedded assets:

- CSS: src/auto-image-styles.css and src/themes/*.css are loaded at build
  time and injected as template strings. The script imports them via the
  virtual module embedded-assets.
- Translations: src/lang/*.json are embedded as JS objects. The script
  loads language data from the embedded bundle; no network fetches.

## Environment and prerequisites

System requirements:
- Node.js 18+
- Git
- Modern browser with devtools (Chrome/Firefox/Safari)
- Cloudflared (optional, for tunnel testing)

Install cloudflared:

- macOS (Homebrew): `brew install cloudflare/cloudflare/cloudflared`
- Windows: see Cloudflare docs
- Linux (Deb-based): `sudo apt-get install cloudflared` (or download from
  Cloudflare)

Environment variables:

- .env (local only, not committed):

  ```bash
  CLOUDFLARED_TOKEN=your_tunnel_token_here
  ```

- Use `.env.example` as a reference.

## Code quality and formatting

Scripts:

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

ESLint (eslint.config.js):
- Based on @eslint/js recommended + eslint-config-prettier
- ES2022, ESM
- Rules tuned for low-noise iteration (e.g. allow unused args prefixed
  with _)
- Ignores: dist/, node_modules/, AccountSwapper/

Prettier (.prettierrc):
- printWidth 80, singleQuote true, etc.
- .prettierignore excludes dist/** and other artifacts

Cleaning:

```bash
npm run clean
```

## Documentation generation

Generate API docs (JSDoc -> Markdown):

```bash
npm run docs:api
```

- Source: src/Auto-Image.js
- Output: docs/api/README.md

Author high-value JSDoc for exported functions/classes to keep docs useful.

## Testing and Quality Assurance

The project includes a comprehensive testing infrastructure with unit tests, bundle analysis, and performance monitoring.

### Unit Tests (Vitest)

Fast, reliable unit tests for extracted utility functions:

```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test:unit

# Run tests in watch mode for development
npm run test:watch
```

**Test Coverage:**
- **108 total tests** across 5 test suites
- **97%+ coverage** on utility functions
- **Color processing**: RGB↔LAB conversion, color distance, palette matching
- **Image processing**: Pixel manipulation, transparency, effects, resizing
- **Coordinate system**: Region/absolute mapping, boundary validation
- **Configuration**: Validation, sanitization, error handling
- **Integration**: Cross-module workflows and real-world scenarios

**Test Structure:**
```
tests/
├── color.test.js        # Color conversion and matching utilities
├── image.test.js        # Image processing and pixel manipulation
├── coordinates.test.js  # Coordinate conversion and validation
├── config.test.js       # Configuration validation and sanitization
└── integration.test.js  # Cross-module integration tests

src/lib/                 # Extracted pure functions (testable utilities)
├── color.js            # Color space conversion and matching
├── image.js            # Image processing and pixel utilities
├── coordinates.js      # Coordinate conversion and region mapping
└── config.js           # Configuration validation and defaults
```


### Bundle Analysis

Monitor bundle size and composition to prevent regressions:

```bash
# Build project first to generate metafile
npm run build

# Analyze bundle composition
npm run analyze
```

**Analysis Features:**
- **Bundle size tracking**: Monitors file sizes across builds
- **Dependency analysis**: Shows largest contributors to bundle size
- **Performance metrics**: Build time and size history in `dist/build-stats.json`
- **Regression detection**: Compare sizes between builds

### Performance Monitoring

Automatic build performance tracking:

**Metrics Collected:**
- **Build times**: Milliseconds per target (userscript, standalone, bookmarklet)
- **Bundle sizes**: Final file sizes for each target
- **Historical data**: `dist/build-stats.json` tracks metrics over time
- **Size analysis**: Top contributors to bundle size

**Example Build Output:**
```bash
📦 Building standalone...
✨ Built standalone in 104ms
📊 Bundle size: 492.90 KB
```

**Current Bundle Sizes:**
- **Standalone**: 492.90 KB (IIFE format for console injection)
- **Userscript**: 351.86 KB (with Tampermonkey/Violentmonkey headers)
- **Bookmarklet**: 351.41 KB (wrapped for bookmark usage)

### Testing Best Practices

**During Development:**
1. Run `npm run test:watch` for immediate feedback
2. Maintain test coverage when adding new utilities
3. Use integration tests for complex workflows
4. Test edge cases and error conditions

**Before Commits:**
1. Run full test suite: `npm run test:unit`
2. Check bundle size: `npm run analyze`
3. Verify formatting: `npm run format:check`
4. Fix linting issues: `npm run lint:fix`

**For New Features:**
1. Extract pure functions to `src/lib/` for testability
2. Write comprehensive unit tests for new utilities
3. Add integration tests for complex interactions
4. Document functions with JSDoc for auto-generated docs

### Continuous Integration

The CI pipeline automatically:
- **Runs all unit tests** with coverage reporting
- **Validates build outputs** for all targets
- **Checks bundle integrity** (no external URLs in standalone)
- **Enforces code quality** with ESLint and Prettier
- **Tracks performance metrics** across builds

## Testing recipes

Choose any method below to load your local/tunneled build into wplace.live.

0) **Script Manager (Recommended)**

- Install the [WPlace Bot Manager](https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/src/wplace-bot-manager.user.js) userscript
- Visit https://wplace.live and press **Ctrl+Shift+M**
- Add your development script URLs (tunnel or local URLs) to the manager
- Use hotkeys 1-9 to quickly run different scripts during development

1) Console injection (standalone)

- With tunnel:

  ```js
  fetch('https://YOUR_TUNNEL_HOST/auto-image.standalone.js')
  .then(r => r.text())
  .then(code => eval(code));
  ```

2) Bookmarklet

- Build or watch the bookmarklet target
- Open dist/auto-image.bookmarklet.txt
- Copy the entire javascript:(function(){…})(); text
- Create a new bookmark whose URL is that content
- Open https://wplace.live and click the bookmark

3) Userscript (Tampermonkey/Violentmonkey)

- Install from URL:
 - Local: http://localhost:5173/auto-image.userscript.js <!-- TODO: Test -->
 - Tunnel: https://YOUR_TUNNEL_HOST/auto-image.userscript.js
- Reload the site to apply updates

4) One-command dev with tunnel

```bash
npm run dev:tunnel
```

- Then use recipe (0), (1) or (3) against the tunnel URL

Debug tips:

- Turn on verbose overlay pixel checks:

  ```js
  window._overlayDebug = true;
  ```

- Hard-reload the page to clear caches if behavior seems stale
- Open DevTools "Network" -> Disable cache (while DevTools is open)

## Troubleshooting

Cloudflared not found

- Ensure it's installed and on PATH: `cloudflared --version`
- If using token mode, verify CLOUDFLARED_TOKEN is set in .env

CLOUDFLARED_TOKEN missing

- npm run tunnel:start will fail fast with a clear message
- Use npm run tunnel:quick if you just need a temporary URL

403 Forbidden from backend.wplace.live

- Cloudflare Turnstile token invalid or expired
- The script auto-regenerates tokens; wait a moment and retry
- If persisted, reload the page and re-inject
- Make sure you're testing on the actual site origin (https)

Userscript doesn't run

- Confirm match pattern includes https://wplace.live/*
- Make sure the script is enabled

Build fails with "Unknown target" or watch error

- Watch mode requires a specific target:

  ```bash
  # OK
  node build/esbuild.config.js --target=userscript --watch

  # Not allowed
  node build/esbuild.config.js --watch
  ```

CORS / mixed content

- Always use the tunnel URL (https) when injecting into https sites
- The local server enables CORS but won't upgrade http to https

CAPTCHA/Turnstile issues in browser

- Try a fresh profile and ensure normal browsing works
- If you get frequent challenges, consider waiting or switching profile

## FAQ

Why port 5173?

- It's a convenient default that avoids collisions. Update scripts if you
  need a different port.

Where do themes and translations come from at runtime?

- They are embedded at build time (see the embedded-assets virtual module).
  The runtime script never fetches them over the network.

How do I quickly reset the build outputs?

```bash
npm run clean && npm run build
```

Can I contribute an additional theme or locale?

- Yes. Add a CSS file under src/themes or a JSON file under src/lang.
  The build will auto-embed new assets. Keep names consistent and avoid
  breaking existing keys/classes.

## Available scripts (npm run ...)

Development
- dev:userscript Watch userscript development
- dev:standalone Watch standalone development
- dev:tunnel Watch + serve + tokenized tunnel (recommended for remote testing)

Build
- build Build all targets (userscript, standalone, bookmarklet)
- build:userscript Build userscript only
- build:standalone Build standalone only
- build:bookmarklet Build bookmarklet only
- build:all Explicit build of all targets

Serve & tunnel
- serve:dist Serve dist on localhost:5173 with CORS enabled
- tunnel:quick Start quick tunnel (random URL, no .env needed)
- tunnel:start Start tunnel using CLOUDFLARED_TOKEN from .env

Code quality & maintenance
- lint Run ESLint to check code quality
- lint:fix ESLint with automatic fixes
- format Format with Prettier
- format:check Check formatting without changing files
- clean Remove dist/*

Docs
- docs:api  Generate API docs from JSDoc to docs/api/README.md

## License

MIT see LICENSE for details.