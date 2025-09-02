// ==UserScript==
// @name         WPlace Auto-Image (Wrapper)
// @namespace    https://wplace.live/
// @version      1.0.0
// @description  Loads and runs WPlace Auto-Image as a Tampermonkey userscript (with source fallback). Open wplace.live and the bot menu should appear as usual.
// @author       DarkModde + community (wrapper by Pedro)
// @match        https://wplace.live/*
// @match        https://www.wplace.live/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant        none
// ==/UserScript==

/**
 * WPlace Auto-Image — Wrapper
 * ----------------------------------------
 * What this does
 *  - Waits for the WPlace page to be ready (canvas/UI mounted).
 *  - Fetches the upstream Auto-Image script from a known source (GitHub Raw).
 *  - Executes it in an isolated Function scope to avoid leaking globals.
 *  - Falls back to the next source if the current one fails (array is extensible).
 *
 * How to use
 *  1) Install Tampermonkey (or compatible) in your browser.
 *  2) Create a new userscript and paste this file.
 *  3) Visit https://wplace.live/ (or www subdomain). The bot menu should load.
 *
 * Notes & caveats
 *  - Caching is disabled (cache: 'no-store') to always get the latest upstream code.
 *  - Execution uses `new Function` (safer than raw eval, still executes upstream JS).
 *    Review the upstream source you are loading; you trust that code.
 *  - If loading fails, you’ll see an alert and details in the dev console.
 *
 * Extending sources (fallback)
 *  - Add more URLs to `SOURCES` (CDN mirrors, version-pinned files, etc.).
 *  - The loader will try them in order until one succeeds.
 *
 * Minimal readiness heuristic
 *  - The wrapper waits for typical WPlace containers (canvas, #root, map data-testid).
 *  - Adjust `whenReady` predicate if the site changes its structure.
 */

(function () {
  'use strict';

  /** Candidate upstream sources (tried in order) */
  const SOURCES = [
    'https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/Auto-Image.js'
  ];

  /** Prefixed loggers to make console output searchable */
  const log = (...args) => console.log('[WPlace Auto-Image Wrapper]', ...args);
  const err = (...args) => console.error('[WPlace Auto-Image Wrapper]', ...args);

  /**
   * Waits for the page to be "ready enough" (canvas/UI mounted).
   * @param {() => boolean} predicate - returns true when the DOM is ready for injection.
   * @param {{interval?: number, timeout?: number}} [opts]
   * @returns {Promise<void>}
   */
  function whenReady(predicate, { interval = 500, timeout = 30000 } = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (predicate()) {
          clearInterval(timer);
          resolve();
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject(new Error('Timeout while waiting for WPlace page/DOM'));
        }
      }, interval);
    });
  }

  /**
   * Fetches text content from a URL with caching disabled.
   * @param {string} url
   * @returns {Promise<string>}
   */
  async function fetchText(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    return await res.text();
  }

  /**
   * Tries to load and execute the upstream Auto-Image script from SOURCES.
   * Execution is wrapped in an IIFE inside a `Function` to limit global leakage.
   * @returns {Promise<boolean>} true if loaded successfully
   */
  async function loadAutoImage() {
    let lastError;
    for (const url of SOURCES) {
      try {
        log('Downloading Auto-Image from', url);
        const code = await fetchText(url);

        // Execute in a separate Function scope (avoid polluting globals; better than raw eval)
        const runner = new Function(`(async () => {\n${code}\n})();`);
        runner();

        log('Auto-Image loaded successfully');
        return true;
      } catch (e) {
        lastError = e;
        err('Source failed, trying next…', e);
      }
    }
    throw lastError || new Error('Could not load Auto-Image from any source');
  }

  (async () => {
    try {
      // Simple heuristic: wait for the app’s main container(s)
      await whenReady(() =>
        document.querySelector('canvas, #root, [data-testid="map"], [id*="map"]')
      );
      await loadAutoImage();
    } catch (e) {
      err('Failed to initialize wrapper:', e);
      alert('WPlace Auto-Image (wrapper)\nCould not load the script. Check the console for details.');
    }
  })();
})();
