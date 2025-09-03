// ==UserScript==
// @name         WPlace Auto-Image (Wrapper) — no-eval
// @namespace    https://wplace.live/
// @version      1.0.1
// @description  Carrega o Auto-Image sem usar eval/new Function (compatível com CSP que bloqueia unsafe-eval).
// @author       DarkModde + community (wrapper by Pedro)
// @match        https://wplace.live/*
// @match        https://www.wplace.live/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wplace.live
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const SOURCES = [
    'https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/Auto-Image.js'
  ];

  const log = (...a) => console.log('[WPlace Auto-Image Wrapper]', ...a);
  const err = (...a) => console.error('[WPlace Auto-Image Wrapper]', ...a);

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

  async function fetchText(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    return await res.text();
  }

  /**
   * Carrega o código via <script src="blob:..."> (CSP-friendly).
   * Sem eval/new Function.
   */
  async function loadAutoImage() {
    let lastError;
    for (const url of SOURCES) {
      try {
        log('Downloading Auto-Image from', url);
        const code = await fetchText(url);

        // Cria um blob JS e injeta como <script src="blob:...">
        const blob = new Blob([code], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);

        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = blobUrl;
          script.async = true;

          const timeout = setTimeout(() => {
            script.remove();
            URL.revokeObjectURL(blobUrl);
            reject(new Error('Loading Auto-Image timed out'));
          }, 15000);

          script.onload = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(blobUrl);
            resolve();
          };
          script.onerror = (e) => {
            clearTimeout(timeout);
            URL.revokeObjectURL(blobUrl);
            reject(new Error('Failed to load blob script'));
          };

          // Anexa cedo no <head> ou como fallback no <html>
          (document.head || document.documentElement).appendChild(script);
        });

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
      await whenReady(() =>
        document.querySelector('canvas, #root, [data-testid="map"], [id*="map"]')
      );
      await loadAutoImage();
    } catch (e) {
      err('Failed to initialize wrapper:', e);
      alert('WPlace Auto-Image (wrapper)\nNão foi possível carregar o script. Veja o console para detalhes.');
    }
  })();
})();
