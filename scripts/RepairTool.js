// eslint-disable-next-line prettier/prettier
; (async () => {
  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
      MIN: 1,
      MAX: 1000,
      DEFAULT: 5,
    },
    TOKEN_SOURCE: 'generator', // "generator", "manual", or "hybrid"
    AUTONOMOUS_MODE: true, // Enable autonomous operation
    AUTO_TOKEN_REFRESH: true, // Automatically refresh tokens
    TOKEN_PRELOAD_BUFFER: 60000, // Preload tokens 1 minute before expiry
    MAX_RETRIES: 10,
    RETRY_DELAY_BASE: 1000,
    COLOR_MAP: {
      0: { id: 1, name: 'Black', rgb: { r: 0, g: 0, b: 0 } },
      1: { id: 2, name: 'Dark Gray', rgb: { r: 60, g: 60, b: 60 } },
      2: { id: 3, name: 'Gray', rgb: { r: 120, g: 120, b: 120 } },
      3: { id: 4, name: 'Light Gray', rgb: { r: 210, g: 210, b: 210 } },
      4: { id: 5, name: 'White', rgb: { r: 255, g: 255, b: 255 } },
      5: { id: 6, name: 'Deep Red', rgb: { r: 96, g: 0, b: 24 } },
      6: { id: 7, name: 'Red', rgb: { r: 237, g: 28, b: 36 } },
      7: { id: 8, name: 'Orange', rgb: { r: 255, g: 127, b: 39 } },
      8: { id: 9, name: 'Gold', rgb: { r: 246, g: 170, b: 9 } },
      9: { id: 10, name: 'Yellow', rgb: { r: 249, g: 221, b: 59 } },
      10: { id: 11, name: 'Light Yellow', rgb: { r: 255, g: 250, b: 188 } },
      11: { id: 12, name: 'Dark Green', rgb: { r: 14, g: 185, b: 104 } },
      12: { id: 13, name: 'Green', rgb: { r: 19, g: 230, b: 123 } },
      13: { id: 14, name: 'Light Green', rgb: { r: 135, g: 255, b: 94 } },
      14: { id: 15, name: 'Dark Teal', rgb: { r: 12, g: 129, b: 110 } },
      15: { id: 16, name: 'Teal', rgb: { r: 16, g: 174, b: 166 } },
      16: { id: 17, name: 'Light Teal', rgb: { r: 19, g: 225, b: 190 } },
      17: { id: 20, name: 'Cyan', rgb: { r: 96, g: 247, b: 242 } },
      18: { id: 44, name: 'Light Cyan', rgb: { r: 187, g: 250, b: 242 } },
      19: { id: 18, name: 'Dark Blue', rgb: { r: 40, g: 80, b: 158 } },
      20: { id: 19, name: 'Blue', rgb: { r: 64, g: 147, b: 228 } },
      21: { id: 21, name: 'Indigo', rgb: { r: 107, g: 80, b: 246 } },
      22: { id: 22, name: 'Light Indigo', rgb: { r: 153, g: 177, b: 251 } },
      23: { id: 23, name: 'Dark Purple', rgb: { r: 120, g: 12, b: 153 } },
      24: { id: 24, name: 'Purple', rgb: { r: 170, g: 56, b: 185 } },
      25: { id: 25, name: 'Light Purple', rgb: { r: 224, g: 159, b: 249 } },
      26: { id: 26, name: 'Dark Pink', rgb: { r: 203, g: 0, b: 122 } },
      27: { id: 27, name: 'Pink', rgb: { r: 236, g: 31, b: 128 } },
      28: { id: 28, name: 'Light Pink', rgb: { r: 243, g: 141, b: 169 } },
      29: { id: 29, name: 'Dark Brown', rgb: { r: 104, g: 70, b: 52 } },
      30: { id: 30, name: 'Brown', rgb: { r: 149, g: 104, b: 42 } },
      31: { id: 31, name: 'Beige', rgb: { r: 248, g: 178, b: 119 } },
      32: { id: 52, name: 'Light Beige', rgb: { r: 255, g: 197, b: 165 } },
      33: { id: 32, name: 'Medium Gray', rgb: { r: 170, g: 170, b: 170 } },
      34: { id: 33, name: 'Dark Red', rgb: { r: 165, g: 14, b: 30 } },
      35: { id: 34, name: 'Light Red', rgb: { r: 250, g: 128, b: 114 } },
      36: { id: 35, name: 'Dark Orange', rgb: { r: 228, g: 92, b: 26 } },
      37: { id: 37, name: 'Dark Goldenrod', rgb: { r: 156, g: 132, b: 49 } },
      38: { id: 38, name: 'Goldenrod', rgb: { r: 197, g: 173, b: 49 } },
      39: { id: 39, name: 'Light Goldenrod', rgb: { r: 232, g: 212, b: 95 } },
      40: { id: 40, name: 'Dark Olive', rgb: { r: 74, g: 107, b: 58 } },
      41: { id: 41, name: 'Olive', rgb: { r: 90, g: 148, b: 74 } },
      42: { id: 42, name: 'Light Olive', rgb: { r: 132, g: 197, b: 115 } },
      43: { id: 43, name: 'Dark Cyan', rgb: { r: 15, g: 121, b: 159 } },
      44: { id: 45, name: 'Light Blue', rgb: { r: 125, g: 199, b: 255 } },
      45: { id: 46, name: 'Dark Indigo', rgb: { r: 77, g: 49, b: 184 } },
      46: { id: 47, name: 'Dark Slate Blue', rgb: { r: 74, g: 66, b: 132 } },
      47: { id: 48, name: 'Slate Blue', rgb: { r: 122, g: 113, b: 196 } },
      48: { id: 49, name: 'Light Slate Blue', rgb: { r: 181, g: 174, b: 241 } },
      49: { id: 53, name: 'Dark Peach', rgb: { r: 155, g: 82, b: 73 } },
      50: { id: 54, name: 'Peach', rgb: { r: 209, g: 128, b: 120 } },
      51: { id: 55, name: 'Light Peach', rgb: { r: 250, g: 182, b: 164 } },
      52: { id: 50, name: 'Light Brown', rgb: { r: 219, g: 164, b: 99 } },
      53: { id: 56, name: 'Dark Tan', rgb: { r: 123, g: 99, b: 82 } },
      54: { id: 57, name: 'Tan', rgb: { r: 156, g: 132, b: 107 } },
      55: { id: 36, name: 'Light Tan', rgb: { r: 214, g: 181, b: 148 } },
      56: { id: 51, name: 'Dark Beige', rgb: { r: 209, g: 128, b: 81 } },
      57: { id: 61, name: 'Dark Stone', rgb: { r: 109, g: 100, b: 63 } },
      58: { id: 62, name: 'Stone', rgb: { r: 148, g: 140, b: 107 } },
      59: { id: 63, name: 'Light Stone', rgb: { r: 205, g: 197, b: 158 } },
      60: { id: 58, name: 'Dark Slate', rgb: { r: 51, g: 57, b: 65 } },
      61: { id: 59, name: 'Slate', rgb: { r: 109, g: 117, b: 141 } },
      62: { id: 60, name: 'Light Slate', rgb: { r: 179, g: 185, b: 209 } },
      63: { id: 0, name: 'Transparent', rgb: null },
    },
  };

  // GLOBAL STATE
  const state = {
    running: false,
    imageLoaded: false,
    totalPixels: 0,
    paintedPixels: 0,
    availableColors: [],
    displayCharges: 0,
    maxCharges: 1,
    cooldown: CONFIG.COOLDOWN_DEFAULT,
    imageData: null,
    stopFlag: false,
    startPosition: null,
    region: null,
    paintWhitePixels: true,
    paintTransparentPixels: false,
    autoRepairEnabled: false,
    autoRepairInterval: 30,
    autoRepairTimer: null,
    debugLogs: [],
    customTransparencyThreshold: CONFIG.TRANSPARENCY_THRESHOLD,
    customWhiteThreshold: CONFIG.WHITE_THRESHOLD,
    tokenSource: CONFIG.TOKEN_SOURCE,
    autonomousMode: CONFIG.AUTONOMOUS_MODE,
    autoTokenRefresh: CONFIG.AUTO_TOKEN_REFRESH,
    tokenPreloadBuffer: CONFIG.TOKEN_PRELOAD_BUFFER,
    retryCount: 0,
    tokenRetryTimer: null,
    tokenPreloadTimer: null,
    windowMinimized: false,
    lastAttackState: null,
    initialSetupComplete: false,
  };

  // Random string generator
  const randStr = (len, chars = 'abcdefghijklmnopqrstuvwxyz0123456789') =>
    [...Array(len)].map(() => chars[(crypto?.getRandomValues?.(new Uint32Array(1))[0] % chars.length) || Math.floor(Math.random() * chars.length)]).join('');

  const fpStr32 = randStr(32);

  // Enhanced Turnstile token handling - Actualizado con la lógica de new.txt
  let turnstileToken = null;
  let tokenExpiryTime = 0;
  let tokenGenerationInProgress = false;
  let _resolveToken = null;
  let tokenPromise = new Promise((resolve) => {
    _resolveToken = resolve;
  });
  let retryCount = 0;
  const MAX_RETRIES = 10;
  const MAX_BATCH_RETRIES = 10;
  const TOKEN_LIFETIME = 240000; // 4 minutes (tokens typically last 5 min, use 4 for safety)

  function setTurnstileToken(token) {
    if (_resolveToken) {
      _resolveToken(token);
      _resolveToken = null;
    }
    turnstileToken = token;
    tokenExpiryTime = Date.now() + TOKEN_LIFETIME;
    console.log('✅ Turnstile token set successfully');
    Utils.addDebugLog('Token cached successfully', 'success');
  }

  function isTokenValid() {
    return turnstileToken && Date.now() < tokenExpiryTime;
  }

  function invalidateToken() {
    turnstileToken = null;
    tokenExpiryTime = 0;
    console.log('🗑️ Token invalidated, will force fresh generation');
    Utils.addDebugLog('Token invalidated, will force fresh generation', 'warning');
  }

  async function ensureToken(forceRefresh = false) {
    // Return cached token if still valid and not forcing refresh
    if (isTokenValid() && !forceRefresh) {
      return turnstileToken;
    }

    // Invalidate token if forcing refresh
    if (forceRefresh) invalidateToken();

    // Avoid multiple simultaneous token generations
    if (tokenGenerationInProgress) {
      console.log('🔄 Token generation already in progress, waiting...');
      await Utils.sleep(2000);
      return isTokenValid() ? turnstileToken : null;
    }

    tokenGenerationInProgress = true;

    try {
      console.log('🔄 Token expired or missing, generating new one...');
      const token = await handleCaptchaWithRetry();
      if (token && token.length > 20) {
        setTurnstileToken(token);
        console.log('✅ Token captured and cached successfully');
        return token;
      }

      console.log('⚠️ Invisible Turnstile failed, forcing browser automation...');
      const fallbackToken = await handleCaptchaFallback();
      if (fallbackToken && fallbackToken.length > 20) {
        setTurnstileToken(fallbackToken);
        console.log('✅ Fallback token captured successfully');
        return fallbackToken;
      }

      console.log('❌ All token generation methods failed');
      return null;
    } finally {
      tokenGenerationInProgress = false;
    }
  }

  async function handleCaptchaWithRetry() {
    const startTime = performance.now();

    try {
      const { sitekey, token: preGeneratedToken } = await Utils.obtainSitekeyAndToken();

      if (!sitekey) {
        throw new Error('No valid sitekey found');
      }

      console.log('🔑 Using sitekey:', sitekey);

      if (typeof window !== 'undefined' && window.navigator) {
        console.log(
          '🧭 UA:',
          window.navigator.userAgent.substring(0, 50) + '...',
          'Platform:',
          window.navigator.platform
        );
      }

      let token = null;

      if (
        preGeneratedToken &&
        typeof preGeneratedToken === 'string' &&
        preGeneratedToken.length > 20
      ) {
        console.log('♻️ Reusing pre-generated Turnstile token');
        token = preGeneratedToken;
      } else {
        if (isTokenValid()) {
          console.log('♻️ Using existing cached token (from previous session)');
          token = turnstileToken;
        } else {
          console.log('🔍 Generating new token with executeTurnstile...');
          token = await Utils.executeTurnstile(sitekey, 'paint');
          if (token) setTurnstileToken(token);
        }
      }

      if (token && typeof token === 'string' && token.length > 20) {
        const elapsed = Math.round(performance.now() - startTime);
        console.log(`✅ Turnstile token generated successfully in ${elapsed}ms`);
        return token;
      } else {
        throw new Error(`Invalid or empty token received - Length: ${token?.length || 0}`);
      }
    } catch (error) {
      const elapsed = Math.round(performance.now() - startTime);
      console.error(`❌ Turnstile token generation failed after ${elapsed}ms:`, error);
      throw error;
    }
  }

  async function handleCaptchaFallback() {
    return new Promise(async (resolve, reject) => {
      try {
        // Ensure we have a fresh promise to await for a new token capture
        if (!_resolveToken) {
          tokenPromise = new Promise((res) => {
            _resolveToken = res;
          });
        }
        const timeoutPromise = Utils.sleep(20000).then(() =>
          reject(new Error('Auto-CAPTCHA timed out.'))
        );

        const solvePromise = (async () => {
          const mainPaintBtn = await Utils.waitForSelector(
            'button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl',
            200,
            10000
          );
          if (!mainPaintBtn) throw new Error('Could not find the main paint button.');
          mainPaintBtn.click();
          await Utils.sleep(500);

          const transBtn = await Utils.waitForSelector('button#color-0', 200, 5000);
          if (!transBtn) throw new Error('Could not find the transparent color button.');
          transBtn.click();
          await Utils.sleep(500);

          const canvas = await Utils.waitForSelector('canvas', 200, 5000);
          if (!canvas) throw new Error('Could not find the canvas element.');

          canvas.setAttribute('tabindex', '0');
          canvas.focus();
          const rect = canvas.getBoundingClientRect();
          const centerX = Math.round(rect.left + rect.width / 2);
          const centerY = Math.round(rect.top + rect.height / 2);

          canvas.dispatchEvent(
            new MouseEvent('mousemove', {
              clientX: centerX,
              clientY: centerY,
              bubbles: true,
            })
          );
          canvas.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: ' ',
              code: 'Space',
              bubbles: true,
            })
          );
          await Utils.sleep(50);
          canvas.dispatchEvent(
            new KeyboardEvent('keyup', {
              key: ' ',
              code: 'Space',
              bubbles: true,
            })
          );
          await Utils.sleep(500);

          // 800ms delay before sending confirmation
          await Utils.sleep(800);

          // Keep confirming until token is captured
          const confirmLoop = async () => {
            while (!turnstileToken) {
              let confirmBtn = await Utils.waitForSelector(
                'button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl'
              );
              if (!confirmBtn) {
                const allPrimary = Array.from(document.querySelectorAll('button.btn-primary'));
                confirmBtn = allPrimary.length ? allPrimary[allPrimary.length - 1] : null;
              }
              if (confirmBtn) {
                confirmBtn.click();
              }
              await Utils.sleep(500); // 500ms delay between confirmation attempts
            }
          };

          // Start confirmation loop and wait for token
          confirmLoop();
          const token = await tokenPromise;
          await Utils.sleep(300); // small delay after token is captured
          resolve(token);
        })();

        await Promise.race([solvePromise, timeoutPromise]);
      } catch (error) {
        console.error('Auto-CAPTCHA process failed:', error);
        reject(error);
      }
    });
  }

  // NUEVA LÓGICA DE INYECCIÓN - ACTUALIZADA DESDE new.txt
  function inject(callback) {
    const script = document.createElement('script');
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
  }

  inject(() => {
    const fetchedBlobQueue = new Map();

    window.addEventListener('message', (event) => {
      const { source, blobID, blobData } = event.data;
      if (source === 'auto-image-overlay' && blobID && blobData) {
        const callback = fetchedBlobQueue.get(blobID);
        if (typeof callback === 'function') {
          callback(blobData);
        }
        fetchedBlobQueue.delete(blobID);
      }
    });

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);
      const url = args[0] instanceof Request ? args[0].url : args[0];

      if (typeof url === 'string') {
        if (url.includes('https://backend.wplace.live/s0/pixel/')) {
          try {
            const payload = JSON.parse(args[1].body);
            if (payload.t) {
              // 📊 Debug log
              console.log(
                `🔍✅ Turnstile Token Captured - Type: ${typeof payload.t}, Value: ${payload.t
                  ? typeof payload.t === 'string'
                    ? payload.t.length > 50
                      ? payload.t.substring(0, 50) + '...'
                      : payload.t
                    : JSON.stringify(payload.t)
                  : 'null/undefined'
                }, Length: ${payload.t?.length || 0}`
              );
              window.postMessage({ source: 'turnstile-capture', token: payload.t }, '*');
            }
          } catch (_) {
            /* ignore */
          }
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('image/png') && url.includes('.png')) {
          const cloned = response.clone();
          return new Promise(async (resolve) => {
            const blobUUID = crypto.randomUUID();
            const originalBlob = await cloned.blob();

            fetchedBlobQueue.set(blobUUID, (processedBlob) => {
              resolve(
                new Response(processedBlob, {
                  headers: cloned.headers,
                  status: cloned.status,
                  statusText: cloned.statusText,
                })
              );
            });

            window.postMessage(
              {
                source: 'auto-image-tile',
                endpoint: url,
                blobID: blobUUID,
                blobData: originalBlob,
              },
              '*'
            );
          });
        }
      }

      return response;
    };
  });

  window.addEventListener('message', (event) => {
    const { source, endpoint, blobID, blobData, token } = event.data;

    if (source === 'auto-image-tile' && endpoint && blobID && blobData) {
      overlayManager.processAndRespondToTileRequest(event.data);
    }

    if (source === 'turnstile-capture' && token) {
      setTurnstileToken(token);
      Utils.addDebugLog('Token captured from injection system', 'success');
      updateTokenStatus();
    }
  });

  // NUEVO SISTEMA WASM - ACTUALIZADO DESDE new.txt
  var pawtect_chunk = null;

  // Find module if pawtect_chunk is null
  pawtect_chunk ??= await findTokenModule("pawtect_wasm_bg.wasm");

  async function createWasmToken(regionX, regionY, payload) {
    try {
      // Load the Pawtect module and WASM
      const mod = await import(new URL('/_app/immutable/chunks/'+pawtect_chunk, location.origin).href);
      let wasm;
      try {
        wasm = await mod._();
        console.log('✅ WASM initialized successfully');
      } catch (wasmError) {
        console.error('❌ WASM initialization failed:', wasmError);
        return null;
      }
      try {
        try {
          const me = await fetch(`https://backend.wplace.live/me`, { credentials: 'include' }).then(r => r.ok ? r.json() : null);
          if (me?.id) {
            mod.i(me.id);
            console.log('✅ user ID set:', me.id);
          }
        } catch { }
      } catch (userIdError) {
        console.log('⚠️ Error setting user ID:', userIdError.message);
      }
      try {
        const testUrl = `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`;
        if (mod.r) {
          mod.r(testUrl);
          console.log('✅ Request URL set:', testUrl);
        } else {
          console.log('⚠️ request_url function (mod.r) not available');
        }
      } catch (urlError) {
        console.log('⚠️ Error setting request URL:', urlError.message);
      }

      console.log('🔍 payload:', payload);

      // Encode payload
      const enc = new TextEncoder();
      const dec = new TextDecoder();
      const bodyStr = JSON.stringify(payload);
      const bytes = enc.encode(bodyStr);
      console.log('🔍 Payload size:', bytes.length, 'bytes');
      console.log('🔄 Payload string:', bodyStr);

      // Allocate WASM memory with validation
      let inPtr;
      try {
        if (!wasm.__wbindgen_malloc) {
          console.error('❌ __wbindgen_malloc function not found');
          return null;
        }

        inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
        console.log('✅ WASM memory allocated, pointer:', inPtr);

        // Copy data to WASM memory
        const wasmBuffer = new Uint8Array(wasm.memory.buffer, inPtr, bytes.length);
        wasmBuffer.set(bytes);
        console.log('✅ Data copied to WASM memory');
      } catch (memError) {
        console.error('❌ Memory allocation error:', memError);
        return null;
      }

      // Call the WASM function
      console.log('🚀 Calling get_pawtected_endpoint_payload...');
      let outPtr, outLen, token;
      try {
        const result = wasm.get_pawtected_endpoint_payload(inPtr, bytes.length);
        console.log('✅ Function called, result type:', typeof result, result);

        if (Array.isArray(result) && result.length === 2) {
          [outPtr, outLen] = result;
          console.log('✅ Got output pointer:', outPtr, 'length:', outLen);

          // Decode the result
          const outputBuffer = new Uint8Array(wasm.memory.buffer, outPtr, outLen);
          token = dec.decode(outputBuffer);
          console.log('✅ Token decoded successfully');
        } else {
          console.error('❌ Unexpected function result format:', result);
          return null;
        }
      } catch (funcError) {
        console.error('❌ Function call error:', funcError);
        console.error('Stack trace:', funcError.stack);
        return null;
      }

      // Cleanup memory
      try {
        if (wasm.__wbindgen_free && outPtr && outLen) {
          wasm.__wbindgen_free(outPtr, outLen, 1);
          console.log('✅ Output memory freed');
        }
        if (wasm.__wbindgen_free && inPtr) {
          wasm.__wbindgen_free(inPtr, bytes.length, 1);
          console.log('✅ Input memory freed');
        }
      } catch (cleanupError) {
        console.log('⚠️ Cleanup warning:', cleanupError.message);
      }

      console.log('🎉 SUCCESS!');
      console.log('🔑 Full token:', token);
      return token;
    } catch (error) {
      console.error('❌ Failed to generate fp parameter:', error);
      return null;
    }
  }

  async function findTokenModule(str) {
    console.log('🔎 Searching for wasm Module...');
    const links = Array.from(document.querySelectorAll('link[rel="modulepreload"][href$=".js"]'));

    for (const link of links) {
      try {
        const url = new URL(link.getAttribute("href"), location.origin).href;
        const code = await fetch(url).then(r => r.text());
        if (code.includes(str)) {
          console.log('✅ Found wasm Module...');
          return url.split('/').pop();
        }
      } catch { }
    }
    console.error(`❌ Could not find Pawtect chunk: `, error);
  }

  // Audio notification system
  function playNotificationSound() {
    try {
      const audio = new Audio('https://cdn.pixabay.com/download/audio/2025/03/21/audio_9bec51b17f.mp3?filename=glass-break-316720.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        console.warn('Could not play notification sound');
      });
    } catch (error) {
      console.warn('Audio notification failed:', error);
    }
  }

  // Notification system for attacks and repairs
  function showAttackNotification(type, count = 0) {
    const existing = document.getElementById('attack-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'attack-notification';
    notification.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      z-index: 15000; background: rgba(0,0,0,0.9); color: white;
      border-radius: 15px; padding: 20px; text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      border: 2px solid ${type === 'attack' ? '#ff4444' : '#44ff44'};
      min-width: 350px; max-width: 450px;
    `;

    if (type === 'attack') {
      notification.innerHTML = `
        <div style="margin-bottom: 15px;">
          <img src="https://i.imgur.com/uJ2FRUM.png" 
               alt="Attack" 
               style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;">
        </div>
        <h2 style="color: #ff4444; margin: 10px 0; font-size: 18px; font-weight: bold;">
          PIXEL ART ATTACKED!
        </h2>
        <p style="margin: 5px 0; font-size: 14px;">
          Detected ${count} damaged pixels!
        </p>
      `;
    } else if (type === 'repaired') {
      notification.innerHTML = `
        <div style="margin-bottom: 15px;">
          <img src="https://i.imgur.com/WXVkpjo.png"
		  alt="Repaired" 
               style="width: 80px; height: 80px; border-radius: 10px; object-fit: cover;">
        </div>
        <h2 style="color: #44ff44; margin: 10px 0; font-size: 18px; font-weight: bold;">
          COMPLETELY REPAIRED!
        </h2>
        <p style="margin: 5px 0; font-size: 14px;">
          All pixels have been restored!
        </p>
      `;
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transition = 'opacity 0.5s ease';
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) notification.remove();
        }, 500);
      }
    }, 3000);
  }

  // Peaceful state display in main window
  function showPeacefulState() {
    const statusDiv = document.getElementById('status');
    if (statusDiv && !state.running) {
      statusDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="https://c.tenor.com/Bo5TLHiee7QAAAAd/tenor.gif" 
               alt="Peaceful" 
               style="width: 32px; height: 32px; border-radius: 6px;">
          <span style="color: #81c784; font-weight: 500;">No attacks detected - All secure</span>
        </div>
      `;
    }
  }

  // Typewriter effect for title
  function createTypewriterTitle() {
    const titleText = "WPlace Autonomous Repair Tool";
    let currentIndex = 0;
    const titleElement = document.getElementById('main-title');
    
    if (!titleElement) return;
    
    function typeNext() {
      if (currentIndex < titleText.length) {
        titleElement.textContent = titleText.substring(0, currentIndex + 1);
        currentIndex++;
        setTimeout(typeNext, 100);
      } else {
        setTimeout(() => {
          currentIndex = 0;
          titleElement.textContent = '';
          setTimeout(typeNext, 1000);
        }, 3000);
      }
    }
    
    typeNext();
  }

  // Fallback translations
  const TEXTS = {
    title: 'WPlace Autonomous Repair Tool',
    loadFromFile: 'Load Progress File',
    repairPixels: 'Repair Pixels',
    enableAutoRepair: 'Enable Auto Repair',
    repairInterval: 'Check Interval (seconds)',
    debug: 'Debug Console',
    clearDebug: 'Clear Debug',
    scanningForDamage: 'Scanning for damaged pixels...',
    damageDetected: 'Damage detected: {count} pixels',
    noDamageDetected: 'No damage found',
    repairingPixels: 'Repairing {count} damaged pixels...',
    repairComplete: 'Repair completed: {repaired} pixels fixed',
    autoRepairStarted: 'Auto repair started (every {interval}s)',
    autoRepairStopped: 'Auto repair stopped',
    fileLoaded: 'Progress file loaded successfully',
    invalidFile: 'Invalid file format',
    noImageData: 'No image data found in file',
    turnstileInstructions: 'Complete the verification',
    hideTurnstileBtn: 'Hide',
    tokenCapturedSuccess: 'Token captured successfully',
    autonomousModeActive: 'Autonomous mode active',
    tokenSystemReady: 'Advanced token system ready',
    fileOperationsAvailable: 'File operations available',
    initializingToken: 'Initializing token system...',
    tokenReady: 'Token system ready',
  };

  // UTILIDADES ACTUALIZADAS CON NUEVA IMPLEMENTACIÓN TURNSTILE
  const Utils = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

    t: (key, params = {}) => {
      let text = TEXTS[key] || key;
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
      return text;
    },

    showAlert: (message, type = 'info') => {
      const alertDiv = document.createElement('div');
      alertDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        padding: 12px 16px; border-radius: 8px; color: white; font-weight: 500;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px; word-wrap: break-word;
      `;
      alertDiv.textContent = message;
      document.body.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.3s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => {
          if (alertDiv.parentNode) alertDiv.remove();
        }, 300);
      }, 4000);
    },

    addDebugLog: (message, type = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      state.debugLogs.push({ timestamp, message, type });

      if (state.debugLogs.length > 150) {
        state.debugLogs = state.debugLogs.slice(-150);
      }

      updateDebugConsole();
      console.log(`[${timestamp}] ${message}`);
    },

    waitForSelector: async (selector, interval = 200, timeout = 5000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const el = document.querySelector(selector);
        if (el) return el;
        await Utils.sleep(interval);
      }
      return null;
    },

    createFileUploader: () =>
      new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const data = JSON.parse(reader.result);
                resolve(data);
              } catch (error) {
                reject(new Error('Invalid JSON file'));
              }
            };
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsText(file);
          } else {
            reject(new Error('No file selected'));
          }
        };
        input.click();
      }),

    isWhitePixel: (r, g, b) => {
      const wt = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
      return r >= wt && g >= wt && b >= wt;
    },

    resolveColor(targetRgb, availableColors) {
      if (!availableColors || availableColors.length === 0) {
        return { id: null, rgb: targetRgb };
      }

      let bestId = availableColors[0].id;
      let bestRgb = [...availableColors[0].rgb];
      let bestScore = Infinity;

      for (let i = 0; i < availableColors.length; i++) {
        const c = availableColors[i];
        const [r, g, b] = c.rgb;
        const rmean = (r + targetRgb[0]) / 2;
        const rdiff = r - targetRgb[0];
        const gdiff = g - targetRgb[1];
        const bdiff = b - targetRgb[2];
        const dist = Math.sqrt(
          (((512 + rmean) * rdiff * rdiff) >> 8) +
          4 * gdiff * gdiff +
          (((767 - rmean) * bdiff * bdiff) >> 8)
        );
        if (dist < bestScore) {
          bestScore = dist;
          bestId = c.id;
          bestRgb = [...c.rgb];
          if (dist === 0) break;
        }
      }

      return { id: bestId, rgb: bestRgb };
    },

    calculateTileRange(
      startRegionX,
      startRegionY,
      startPixelX,
      startPixelY,
      width,
      height,
      tileSize = 1000
    ) {
      const endPixelX = startPixelX + width;
      const endPixelY = startPixelY + height;

      return {
        startTileX: startRegionX + Math.floor(startPixelX / tileSize),
        startTileY: startRegionY + Math.floor(startPixelY / tileSize),
        endTileX: startRegionX + Math.floor((endPixelX - 1) / tileSize),
        endTileY: startRegionY + Math.floor((endPixelY - 1) / tileSize),
      };
    },

    dynamicSleep: async function (tickAndGetRemainingMs) {
      let remaining = Math.max(0, await tickAndGetRemainingMs());
      while (remaining > 0) {
        const interval = remaining > 5000 ? 2000 : remaining > 1000 ? 500 : 100;
        await this.sleep(Math.min(interval, remaining));
        remaining = Math.max(0, await tickAndGetRemainingMs());
      }
    },

    // NUEVA IMPLEMENTACIÓN TURNSTILE COMPLETA - ACTUALIZADA DESDE new.txt
    turnstileLoaded: false,
    _turnstileContainer: null,
    _turnstileOverlay: null,
    _turnstileWidgetId: null,
    _lastSitekey: null,
    _cachedSitekey: null,

    async loadTurnstile() {
      if (window.turnstile) {
        this.turnstileLoaded = true;
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        if (document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
          const checkReady = () => {
            if (window.turnstile) {
              this.turnstileLoaded = true;
              resolve();
            } else {
              setTimeout(checkReady, 100);
            }
          };
          return checkReady();
        }

        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.turnstileLoaded = true;
          Utils.addDebugLog('Turnstile script loaded successfully', 'success');
          resolve();
        };
        script.onerror = () => {
          Utils.addDebugLog('Failed to load Turnstile script', 'error');
          reject(new Error('Failed to load Turnstile'));
        };
        document.head.appendChild(script);
      });
    },

    ensureTurnstileContainer() {
      if (!this._turnstileContainer || !document.body.contains(this._turnstileContainer)) {
        if (this._turnstileContainer) {
          this._turnstileContainer.remove();
        }

        this._turnstileContainer = document.createElement('div');
        this._turnstileContainer.className = 'wplace-turnstile-hidden';
        this._turnstileContainer.setAttribute('aria-hidden', 'true');
        this._turnstileContainer.id = 'turnstile-widget-container';
        document.body.appendChild(this._turnstileContainer);
      }
      return this._turnstileContainer;
    },

    ensureTurnstileOverlayContainer() {
      if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
        return this._turnstileOverlay;
      }

      const overlay = document.createElement('div');
      overlay.id = 'turnstile-overlay-container';
      overlay.className = 'wplace-turnstile-overlay wplace-overlay-hidden';

      const title = document.createElement('div');
      title.textContent = Utils.t('turnstileInstructions');
      title.className = 'wplace-turnstile-title';

      const host = document.createElement('div');
      host.id = 'turnstile-overlay-host';
      host.className = 'wplace-turnstile-host';

      const hideBtn = document.createElement('button');
      hideBtn.textContent = Utils.t('hideTurnstileBtn');
      hideBtn.className = 'wplace-turnstile-hide-btn';
      hideBtn.addEventListener('click', () => overlay.remove());

      overlay.appendChild(title);
      overlay.appendChild(host);
      overlay.appendChild(hideBtn);
      document.body.appendChild(overlay);

      this._turnstileOverlay = overlay;
      return overlay;
    },

    async executeTurnstile(sitekey, action = 'paint') {
      await this.loadTurnstile();

      // Try reusing existing widget first if sitekey matches
      if (this._turnstileWidgetId && this._lastSitekey === sitekey && window.turnstile?.execute) {
        try {
          console.log('🔄 Reusing existing Turnstile widget...');
          const token = await Promise.race([
            window.turnstile.execute(this._turnstileWidgetId, { action }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Execute timeout')), 15000)
            ),
          ]);
          if (token && token.length > 20) {
            console.log('✅ Token generated via widget reuse');
            return token;
          }
        } catch (error) {
          console.log('  Widget reuse failed, will create a fresh widget:', error.message);
        }
      }

      // Try invisible widget first
      const invisibleToken = await this.createTurnstileWidget(sitekey, action);
      if (invisibleToken && invisibleToken.length > 20) {
        return invisibleToken;
      }

      console.log('  Falling back to interactive Turnstile (visible).');
      return await this.createTurnstileWidgetInteractive(sitekey, action);
    },

    async createTurnstileWidget(sitekey, action) {
      return new Promise((resolve) => {
        try {
          // Force cleanup of any existing widget
          if (this._turnstileWidgetId && window.turnstile?.remove) {
            try {
              window.turnstile.remove(this._turnstileWidgetId);
              console.log('🧹 Cleaned up existing Turnstile widget');
            } catch (e) {
              console.warn('⚠️ Widget cleanup warning:', e.message);
            }
          }

          const container = this.ensureTurnstileContainer();
          container.innerHTML = '';

          // Verify Turnstile is available
          if (!window.turnstile?.render) {
            console.error('❌ Turnstile not available for rendering');
            resolve(null);
            return;
          }

          console.log('🔧 Creating invisible Turnstile widget...');
          const widgetId = window.turnstile.render(container, {
            sitekey,
            action,
            size: 'invisible',
            retry: 'auto',
            'retry-interval': 8000,
            callback: (token) => {
              console.log('✅ Invisible Turnstile callback');
              resolve(token);
            },
            'error-callback': () => resolve(null),
            'timeout-callback': () => resolve(null),
          });

          this._turnstileWidgetId = widgetId;
          this._lastSitekey = sitekey;

          if (!widgetId) {
            return resolve(null);
          }

          // Execute the widget and race with timeout
          Promise.race([
            window.turnstile.execute(widgetId, { action }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Invisible execute timeout')), 12000)
            ),
          ])
            .then(resolve)
            .catch(() => resolve(null));
        } catch (e) {
          console.error('❌ Invisible Turnstile creation failed:', e);
          resolve(null);
        }
      });
    },

    async createTurnstileWidgetInteractive(sitekey, action) {
      // Create a visible widget that users can interact with if needed
      console.log('🔄 Creating interactive Turnstile widget (visible)');

      return new Promise((resolve) => {
        try {
          // Force cleanup of any existing widget
          if (this._turnstileWidgetId && window.turnstile?.remove) {
            try {
              window.turnstile.remove(this._turnstileWidgetId);
            } catch (e) {
              console.warn('⚠️ Widget cleanup warning:', e.message);
            }
          }

          const overlay = this.ensureTurnstileOverlayContainer();
          overlay.classList.remove('wplace-overlay-hidden');
          overlay.style.display = 'block';

          const host = overlay.querySelector('#turnstile-overlay-host');
          host.innerHTML = '';

          // Set a timeout for interactive mode
          const timeout = setTimeout(() => {
            console.warn('⏰ Interactive Turnstile widget timeout');
            overlay.classList.add('wplace-overlay-hidden');
            overlay.style.display = 'none';
            resolve(null);
          }, 60000); // 60 seconds for user interaction

          const widgetId = window.turnstile.render(host, {
            sitekey,
            action,
            size: 'normal',
            theme: 'light',
            callback: (token) => {
              clearTimeout(timeout);
              overlay.classList.add('wplace-overlay-hidden');
              overlay.style.display = 'none';
              console.log('✅ Interactive Turnstile completed successfully');

              if (typeof token === 'string' && token.length > 20) {
                resolve(token);
              } else {
                console.warn('❌ Invalid token from interactive widget');
                resolve(null);
              }
            },
            'error-callback': (error) => {
              clearTimeout(timeout);
              overlay.classList.add('wplace-overlay-hidden');
              overlay.style.display = 'none';
              console.warn('❌ Interactive Turnstile error:', error);
              resolve(null);
            },
          });

          this._turnstileWidgetId = widgetId;
          this._lastSitekey = sitekey;

          if (!widgetId) {
            clearTimeout(timeout);
            overlay.classList.add('wplace-overlay-hidden');
            overlay.style.display = 'none';
            console.warn('❌ Failed to create interactive Turnstile widget');
            resolve(null);
          } else {
            console.log('✅ Interactive Turnstile widget created, waiting for user interaction...');
          }
        } catch (e) {
          console.error('❌ Interactive Turnstile creation failed:', e);
          resolve(null);
        }
      });
    },

    cleanupTurnstile() {
      if (this._turnstileWidgetId && window.turnstile?.remove) {
        try {
          window.turnstile.remove(this._turnstileWidgetId);
        } catch (e) {
          console.warn('Failed to cleanup Turnstile widget:', e);
        }
      }

      if (this._turnstileContainer && document.body.contains(this._turnstileContainer)) {
        this._turnstileContainer.remove();
      }

      if (this._turnstileOverlay && document.body.contains(this._turnstileOverlay)) {
        this._turnstileOverlay.remove();
      }

      this._turnstileWidgetId = null;
      this._turnstileContainer = null;
      this._turnstileOverlay = null;
      this._lastSitekey = null;
    },

    // DETECCIÓN DE SITEKEY MEJORADA - ACTUALIZADA DESDE new.txt
    async obtainSitekeyAndToken(fallback = '0x4AAAAAABpqJe8FO0N84q0F') {
      // Cache sitekey to avoid repeated DOM queries
      if (this._cachedSitekey) {
        console.log('🔍 Using cached sitekey:', this._cachedSitekey);

        return isTokenValid()
          ? {
            sitekey: this._cachedSitekey,
            token: turnstileToken,
          }
          : { sitekey: this._cachedSitekey, token: null };
      }

      // List of potential sitekeys to try
      const potentialSitekeys = [
        '0x4AAAAAABpqJe8FO0N84q0F', // WPlace common sitekey
        '0x4AAAAAAAJ7xjKAp6Mt_7zw', // Alternative WPlace sitekey
        '0x4AAAAAADm5QWx6Ov2LNF2g', // Another common sitekey
      ];
      const trySitekey = async (sitekey, source) => {
        if (!sitekey || sitekey.length < 10) return null;

        console.log(`🔍 Testing sitekey from ${source}:`, sitekey);
        const token = await this.executeTurnstile(sitekey);

        if (token && token.length >= 20) {
          console.log(`✅ Valid token generated from ${source} sitekey`);
          setTurnstileToken(token);
          this._cachedSitekey = sitekey;
          return { sitekey, token };
        } else {
          console.log(`❌ Failed to get token from ${source} sitekey`);
          return null;
        }
      };

      try {
        // 1️⃣ data-sitekey attribute
        const sitekeySel = document.querySelector('[data-sitekey]');
        if (sitekeySel) {
          const sitekey = sitekeySel.getAttribute('data-sitekey');
          const result = await trySitekey(sitekey, 'data attribute');
          if (result) {
            return result;
          }
        }

        // 2️⃣ Turnstile element
        const turnstileEl = document.querySelector('.cf-turnstile');
        if (turnstileEl?.dataset?.sitekey) {
          const sitekey = turnstileEl.dataset.sitekey;
          const result = await trySitekey(sitekey, 'turnstile element');
          if (result) {
            return result;
          }
        }

        // 3️⃣ Meta tags
        const metaTags = document.querySelectorAll(
          'meta[name*="turnstile"], meta[property*="turnstile"]'
        );
        for (const meta of metaTags) {
          const content = meta.getAttribute('content');
          const result = await trySitekey(content, 'meta tag');
          if (result) {
            return result;
          }
        }

        // 4️⃣ Global variable
        if (window.__TURNSTILE_SITEKEY) {
          const result = await trySitekey(window.__TURNSTILE_SITEKEY, 'global variable');
          if (result) {
            return result;
          }
        }

        // 5️⃣ Script tags
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          const content = script.textContent || script.innerHTML;
          const match = content.match(
            /(?:sitekey|data-sitekey)['"\s\[\]:\=\(]*['"]?([0-9a-zA-Z_-]{20,})['"]?/i
          );
          if (match && match[1]) {
            const extracted = match[1].replace(/['"]/g, '');
            const result = await trySitekey(extracted, 'script content');
            if (result) {
              return result;
            }
          }
        }

        // 6️⃣ Known potential sitekeys
        console.log('🔍 Testing known potential sitekeys...');
        for (const testSitekey of potentialSitekeys) {
          const result = await trySitekey(testSitekey, 'known list');
          if (result) {
            return result;
          }
        }
      } catch (error) {
        console.warn('⚠️ Error during sitekey detection:', error);
      }

      // 7️⃣ Fallback
      console.log('🔧 Trying fallback sitekey:', fallback);
      const fallbackResult = await trySitekey(fallback, 'fallback');
      if (fallbackResult) {
        return fallbackResult;
      }

      console.error('❌ No working sitekey or token found.');
      return { sitekey: null, token: null };
    },
  };

  // Enhanced Overlay Manager for pixel detection with autonomous capabilities
  class OverlayManager {
    constructor() {
      this.originalTiles = new Map();
      this.originalTilesData = new Map();
      this.tileSize = 1000;
      this.loadingPromises = new Map();
      this.autonomousMode = state.autonomousMode;
    }

    async processAndRespondToTileRequest(eventData) {
      const { endpoint, blobID, blobData } = eventData;

      const tileMatch = endpoint.match(/(\d+)\/(\d+)\.png/);
      if (tileMatch) {
        const tileX = parseInt(tileMatch[1], 10);
        const tileY = parseInt(tileMatch[2], 10);
        const tileKey = `${tileX},${tileY}`;

        try {
          const originalBitmap = await createImageBitmap(blobData);
          this.originalTiles.set(tileKey, originalBitmap);

          try {
            let canvas, ctx;
            if (typeof OffscreenCanvas !== 'undefined') {
              canvas = new OffscreenCanvas(originalBitmap.width, originalBitmap.height);
              ctx = canvas.getContext('2d');
            } else {
              canvas = document.createElement('canvas');
              canvas.width = originalBitmap.width;
              canvas.height = originalBitmap.height;
              ctx = canvas.getContext('2d');
            }
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(originalBitmap, 0, 0);
            const imgData = ctx.getImageData(0, 0, originalBitmap.width, originalBitmap.height);

            this.originalTilesData.set(tileKey, {
              w: originalBitmap.width,
              h: originalBitmap.height,
              data: new Uint8ClampedArray(imgData.data),
            });

            if (this.autonomousMode) {
              Utils.addDebugLog(`Auto-cached tile: ${tileKey} (${originalBitmap.width}x${originalBitmap.height})`, 'info');
            }
          } catch (e) {
            Utils.addDebugLog(`Failed to cache tile ImageData: ${tileKey} - ${e.message}`, 'warning');
          }
        } catch (e) {
          Utils.addDebugLog(`Failed to create tile bitmap: ${tileKey} - ${e.message}`, 'error');
        }
      }

      window.postMessage(
        {
          source: 'auto-image-overlay',
          blobID: blobID,
          blobData: blobData,
        },
        '*'
      );
    }

    async getTilePixelColor(tileX, tileY, pixelX, pixelY) {
      const tileKey = `${tileX},${tileY}`;
      const alphaThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;

      const cached = this.originalTilesData.get(tileKey);
      if (cached && cached.data && cached.w > 0 && cached.h > 0) {
        const x = Math.max(0, Math.min(cached.w - 1, pixelX));
        const y = Math.max(0, Math.min(cached.h - 1, pixelY));
        const idx = (y * cached.w + x) * 4;
        const d = cached.data;
        const a = d[idx + 3];

        if (!state.paintTransparentPixels && a < alphaThresh) {
          return null;
        }
        return [d[idx], d[idx + 1], d[idx + 2], a];
      }

      const bitmap = this.originalTiles.get(tileKey);
      if (!bitmap) {
        if (this.autonomousMode) {
          Utils.addDebugLog(`Tile ${tileKey} not available, requesting load...`, 'warning');
        }
        return null;
      }

      try {
        let canvas, ctx;
        if (typeof OffscreenCanvas !== 'undefined') {
          canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
          ctx = canvas.getContext('2d');
        } else {
          canvas = document.createElement('canvas');
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          ctx = canvas.getContext('2d');
        }
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(bitmap, 0, 0);

        const x = Math.max(0, Math.min(bitmap.width - 1, pixelX));
        const y = Math.max(0, Math.min(bitmap.height - 1, pixelY));
        const data = ctx.getImageData(x, y, 1, 1).data;
        const a = data[3];

        if (!state.paintTransparentPixels && a < alphaThresh) {
          return null;
        }

        return [data[0], data[1], data[2], a];
      } catch (e) {
        Utils.addDebugLog(`Error reading pixel from tile ${tileKey}: ${e.message}`, 'error');
        return null;
      }
    }

    async waitForTiles(startRegionX, startRegionY, pixelWidth, pixelHeight, startPixelX = 0, startPixelY = 0, timeoutMs = 15000) {
      const { startTileX, startTileY, endTileX, endTileY } = Utils.calculateTileRange(
        startRegionX,
        startRegionY,
        startPixelX,
        startPixelY,
        pixelWidth,
        pixelHeight,
        this.tileSize
      );

      const requiredTiles = [];
      for (let ty = startTileY; ty <= endTileY; ty++) {
        for (let tx = startTileX; tx <= endTileX; tx++) {
          requiredTiles.push(`${tx},${ty}`);
        }
      }

      if (requiredTiles.length === 0) return true;

      Utils.addDebugLog(`Waiting for ${requiredTiles.length} tiles (autonomous: ${this.autonomousMode})...`, 'info');

      const startTime = Date.now();
      let lastProgress = 0;

      while (Date.now() - startTime < timeoutMs) {
        if (state.stopFlag) {
          Utils.addDebugLog('waitForTiles: stopped by user', 'warning');
          return false;
        }

        const loaded = requiredTiles.filter((k) => this.originalTiles.has(k)).length;
        const progress = Math.round((loaded / requiredTiles.length) * 100);

        if (progress !== lastProgress && progress % 20 === 0) {
          Utils.addDebugLog(`Tile loading progress: ${loaded}/${requiredTiles.length} (${progress}%)`, 'info');
          lastProgress = progress;
        }

        if (loaded === requiredTiles.length) {
          Utils.addDebugLog(`All ${requiredTiles.length} required tiles are loaded`, 'success');
          return true;
        }

        await Utils.sleep(this.autonomousMode ? 500 : 1000);
      }

      const loaded = requiredTiles.filter((k) => this.originalTiles.has(k)).length;
      Utils.addDebugLog(`Timeout waiting for tiles: ${loaded}/${requiredTiles.length} loaded`, 'warning');
      
      if (this.autonomousMode && loaded > requiredTiles.length * 0.8) {
        Utils.addDebugLog(`Autonomous mode: proceeding with ${loaded}/${requiredTiles.length} tiles (80%+ loaded)`, 'warning');
        return true;
      }

      return loaded > 0;
    }
  }

  const overlayManager = new OverlayManager();

  // Enhanced WPlace API Service with autonomous capabilities - ACTUALIZADO CON NUEVA LÓGICA
  const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color, retryCount = 0) {
      try {
        await ensureToken();
        if (!turnstileToken) {
          Utils.addDebugLog('No valid token available for paint request', 'error');
          return 'token_error';
        }

        const payload = {
          coords: [pixelX, pixelY],
          colors: [color],
          t: turnstileToken,
          fp: fpStr32,
        };

        const wasmToken = await createWasmToken(regionX, regionY, payload);
        if (!wasmToken) {
          Utils.addDebugLog('Failed to generate WASM token', 'error');
          return false;
        }

        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'text/plain;charset=UTF-8',
            'x-pawtect-token': wasmToken 
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        if (res.status === 403) {
          Utils.addDebugLog(`403 Forbidden for pixel (${pixelX},${pixelY}). Token invalid/expired.`, 'error');
          invalidateToken();
          
          if (retryCount < 2 && state.autonomousMode) {
            Utils.addDebugLog(`Autonomous retry ${retryCount + 1}/2 for pixel (${pixelX},${pixelY})`, 'warning');
            await Utils.sleep(1000);
            return await this.paintPixelInRegion(regionX, regionY, pixelX, pixelY, color, retryCount + 1);
          }
          
          return 'token_error';
        }

        if (!res.ok) {
          Utils.addDebugLog(`Paint request failed with status ${res.status}`, 'error');
          return false;
        }

        const data = await res.json();
        const success = data?.painted === 1;
        
        if (success) {
          Utils.addDebugLog(`Paint SUCCESS for (${pixelX},${pixelY}) with color ${color}`, 'success');
        } else {
          Utils.addDebugLog(`Paint FAILED for (${pixelX},${pixelY}) - server response: ${JSON.stringify(data)}`, 'error');
        }
        
        return success;
      } catch (e) {
        Utils.addDebugLog(`Paint request error for (${pixelX},${pixelY}): ${e.message}`, 'error');
        return false;
      }
    },

    async getCharges() {
      try {
        const res = await fetch('https://backend.wplace.live/me', {
          credentials: 'include',
        });
        if (!res.ok) return { charges: 0, max: 1, cooldown: CONFIG.COOLDOWN_DEFAULT };
        const data = await res.json();
        return {
          charges: data.charges?.count ?? 0,
          max: data.charges?.max ?? 1,
          cooldown: data.charges?.cooldownMs ?? CONFIG.COOLDOWN_DEFAULT,
        };
      } catch (e) {
        Utils.addDebugLog(`Error fetching charges: ${e.message}`, 'warning');
        return { charges: 0, max: 1, cooldown: CONFIG.COOLDOWN_DEFAULT };
      }
    },
  };

  // Anti-grief repair system with autonomous capabilities
  async function scanForDamage() {
    if (!state.imageData || !state.startPosition || !state.region) {
      Utils.addDebugLog('No image data or position for scanning', 'warning');
      return [];
    }

    Utils.addDebugLog('Starting autonomous damage scan...', 'info');
    updateStatus(Utils.t('scanningForDamage'));

    const damagedPixels = [];
    const { width, height, pixels } = state.imageData;

    const ready = await overlayManager.waitForTiles(
      state.region.x,
      state.region.y,
      width,
      height,
      state.startPosition.x,
      state.startPosition.y,
      state.autonomousMode ? 20000 : 15000
    );

    if (!ready) {
      Utils.addDebugLog('Failed to load required tiles for scanning', 'error');
      if (state.autonomousMode) {
        Utils.addDebugLog('Autonomous mode: will retry scan in 30 seconds', 'warning');
        setTimeout(() => {
          if (state.autoRepairEnabled && !state.stopFlag) {
            scanForDamage();
          }
        }, 30000);
      }
      return [];
    }

    Utils.addDebugLog(`Scanning ${width}x${height} image for damage (autonomous: ${state.autonomousMode})...`, 'info');

    let scannedPixels = 0;
    let lastProgressUpdate = Date.now();
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (state.stopFlag) break;

        const idx = (y * width + x) * 4;
        const originalR = pixels[idx];
        const originalG = pixels[idx + 1];
        const originalB = pixels[idx + 2];
        const originalA = pixels[idx + 3];

        if (!state.paintTransparentPixels && originalA < CONFIG.TRANSPARENCY_THRESHOLD) {
          continue;
        }

        if (!state.paintWhitePixels && Utils.isWhitePixel(originalR, originalG, originalB)) {
          continue;
        }

        scannedPixels++;

        const absX = state.startPosition.x + x;
        const absY = state.startPosition.y + y;
        const tileX = state.region.x + Math.floor(absX / 1000);
        const tileY = state.region.y + Math.floor(absY / 1000);
        const pixelX = absX % 1000;
        const pixelY = absY % 1000;

        try {
          const currentPixel = await overlayManager.getTilePixelColor(tileX, tileY, pixelX, pixelY);

          if (!currentPixel) {
            if (!state.autonomousMode) {
              Utils.addDebugLog(`No current pixel data for (${x},${y}) - tile ${tileX},${tileY}`, 'warning');
            }
            continue;
          }

          const targetColor = Utils.resolveColor([originalR, originalG, originalB], state.availableColors);
          const currentColor = Utils.resolveColor(currentPixel.slice(0, 3), state.availableColors);

          if (targetColor.id !== currentColor.id) {
            damagedPixels.push({
              x,
              y,
              originalColor: targetColor,
              currentColor: currentColor,
              originalRgb: [originalR, originalG, originalB],
              currentRgb: currentPixel.slice(0, 3)
            });

            if (!state.autonomousMode || damagedPixels.length <= 10) {
              Utils.addDebugLog(`Damage at (${x},${y}): expected color ${targetColor.id}, found color ${currentColor.id}`, 'warning');
            }
          }
        } catch (e) {
          if (!state.autonomousMode) {
            Utils.addDebugLog(`Error checking pixel (${x},${y}): ${e.message}`, 'error');
          }
        }
      }

      if (state.autonomousMode && Date.now() - lastProgressUpdate > 5000) {
        Utils.addDebugLog(`Scan progress: ${y}/${height} rows (${Math.round((y / height) * 100)}%), found ${damagedPixels.length} damaged`, 'info');
        lastProgressUpdate = Date.now();
      } else if (!state.autonomousMode && y % 10 === 0) {
        Utils.addDebugLog(`Scan progress: ${y}/${height} rows (${Math.round((y / height) * 100)}%)`, 'info');
      }
    }

    const logLevel = damagedPixels.length > 0 ? 'warning' : 'success';
    Utils.addDebugLog(`Scan complete. Checked ${scannedPixels} pixels, found ${damagedPixels.length} damaged`, logLevel);

    return damagedPixels;
  }

  async function repairDamagedPixels(damagedPixels) {
    if (damagedPixels.length === 0) {
      updateStatus(Utils.t('noDamageDetected'));
      return 0;
    }

    Utils.addDebugLog(`Starting autonomous repair of ${damagedPixels.length} pixels`, 'info');
    updateStatus(Utils.t('repairingPixels', { count: damagedPixels.length }));

    let repairedCount = 0;
    let consecutiveFailures = 0;
    const maxConsecutiveFailures = state.autonomousMode ? 5 : 3;

    for (let i = 0; i < damagedPixels.length; i++) {
      const pixel = damagedPixels[i];
      
      if (state.stopFlag) {
        Utils.addDebugLog('Repair stopped by user request', 'warning');
        break;
      }

      // Enhanced charge management for autonomous mode
      await updateCharges();
      let chargeWaitAttempts = 0;
      const maxChargeWaitAttempts = state.autonomousMode ? 20 : 10;
      
      while (state.displayCharges < 1 && !state.stopFlag && chargeWaitAttempts < maxChargeWaitAttempts) {
        chargeWaitAttempts++;
        const waitTime = state.autonomousMode ? Math.min(state.cooldown, 10000) : state.cooldown;
        
        if (chargeWaitAttempts === 1) {
          Utils.addDebugLog(`Waiting for charges... (${state.displayCharges}/${state.maxCharges})`, 'info');
        }
        
        await Utils.dynamicSleep(() => {
          if (state.displayCharges >= 1) return 0;
          if (state.stopFlag) return 0;
          return waitTime;
        });
        await updateCharges();
      }

      if (state.stopFlag) break;
      
      if (state.displayCharges < 1) {
        Utils.addDebugLog(`No charges available after waiting, skipping pixel (${pixel.x},${pixel.y})`, 'warning');
        continue;
      }

      const success = await repairSinglePixel(pixel);
      if (success) {
        repairedCount++;
        consecutiveFailures = 0;
        if (!state.autonomousMode || repairedCount <= 10 || repairedCount % 10 === 0) {
          Utils.addDebugLog(`Repaired pixel (${pixel.x},${pixel.y}) with color ${pixel.originalColor.id} [${repairedCount}/${damagedPixels.length}]`, 'success');
        }
      } else {
        consecutiveFailures++;
        Utils.addDebugLog(`Failed to repair pixel (${pixel.x},${pixel.y}) [${consecutiveFailures}/${maxConsecutiveFailures} consecutive failures]`, 'error');
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
          Utils.addDebugLog(`Too many consecutive failures (${consecutiveFailures}), pausing repair`, 'error');
          if (state.autonomousMode) {
            Utils.addDebugLog('Autonomous mode: will retry repair in 60 seconds', 'warning');
            setTimeout(() => {
              if (state.autoRepairEnabled && !state.stopFlag) {
                performRepairCheck();
              }
            }, 60000);
          }
          break;
        }
      }

      await updateCharges();
      
      // Dynamic delay based on mode and success rate
      const baseDelay = state.autonomousMode ? 100 : 200;
      const adaptiveDelay = consecutiveFailures > 0 ? baseDelay * (consecutiveFailures + 1) : baseDelay;
      await Utils.sleep(adaptiveDelay);
    }

    const message = Utils.t('repairComplete', { repaired: repairedCount });
    updateStatus(message);
    Utils.addDebugLog(`${message} (${damagedPixels.length - repairedCount} remaining)`, 'success');

    return repairedCount;
  }

  async function repairSinglePixel(pixel) {
    const { x, y, originalColor } = pixel;

    const absX = state.startPosition.x + x;
    const absY = state.startPosition.y + y;
    const regionX = state.region.x + Math.floor(absX / 1000);
    const regionY = state.region.y + Math.floor(absY / 1000);
    const pixelX = absX % 1000;
    const pixelY = absY % 1000;

    try {
      const result = await WPlaceService.paintPixelInRegion(
        regionX,
        regionY,
        pixelX,
        pixelY,
        originalColor.id
      );

      if (result === 'token_error') {
        Utils.addDebugLog('Token error during repair, refreshing token...', 'warning');
        await ensureToken(true);
        await Utils.sleep(state.autonomousMode ? 500 : 1000);
        
        // Retry once with new token
        const retryResult = await WPlaceService.paintPixelInRegion(regionX, regionY, pixelX, pixelY, originalColor.id);
        return retryResult === true;
      }

      return result === true;
    } catch (e) {
      Utils.addDebugLog(`Error repairing pixel (${x},${y}): ${e.message}`, 'error');
      return false;
    }
  }

  async function performRepairCheck() {
    if (state.running) {
      Utils.addDebugLog('Repair check skipped - manual repair in progress', 'info');
      return;
    }

    try {
      Utils.addDebugLog('Autonomous repair check triggered', 'info');
      
      // Ensure we have a valid token before starting
      if (!isTokenValid()) {
        Utils.addDebugLog('No valid token for autonomous repair, generating...', 'warning');
        await ensureToken(true);
        if (!isTokenValid()) {
          Utils.addDebugLog('Failed to generate token for autonomous repair, will retry next cycle', 'error');
          return;
        }
      }
      
      const damagedPixels = await scanForDamage();

      if (damagedPixels.length > 0) {
        Utils.addDebugLog(`Autonomous repair: Found ${damagedPixels.length} damaged pixels, starting repair`, 'warning');
        updateStatus(Utils.t('damageDetected', { count: damagedPixels.length }));
        
        // Show attack notification
        showAttackNotification('attack', damagedPixels.length);
        state.lastAttackState = 'attacked';
        
        const repairedCount = await repairDamagedPixels(damagedPixels);
        
        // Show repair complete notification if all pixels were repaired
        if (repairedCount === damagedPixels.length) {
          showAttackNotification('repaired');
          state.lastAttackState = 'repaired';
        }
      } else {
        updateStatus(Utils.t('noDamageDetected'));
        
        // Show peaceful state if we're not under attack
        if (state.lastAttackState !== 'peaceful') {
          showPeacefulState();
          state.lastAttackState = 'peaceful';
        }
        
        if (!state.autonomousMode) {
          Utils.addDebugLog('Autonomous repair: No damage detected', 'success');
        }
      }
    } catch (error) {
      Utils.addDebugLog(`Autonomous repair error: ${error.message}`, 'error');
      
      if (state.autonomousMode) {
        Utils.addDebugLog('Autonomous mode: will retry repair check in 120 seconds due to error', 'warning');
        setTimeout(() => {
          if (state.autoRepairEnabled && !state.stopFlag) {
            performRepairCheck();
          }
        }, 120000);
      }
    }
  }

  function startAutoRepair() {
    if (state.autoRepairTimer) {
      clearInterval(state.autoRepairTimer);
    }

    const intervalMs = state.autoRepairInterval * 1000;
    state.autoRepairTimer = setInterval(performRepairCheck, intervalMs);

    const message = Utils.t('autoRepairStarted', { interval: state.autoRepairInterval });
    Utils.addDebugLog(`${message} (autonomous: ${state.autonomousMode})`, 'info');
    Utils.showAlert(message, 'success');
    
    // Perform first check immediately
    setTimeout(performRepairCheck, 2000);
  }

  function stopAutoRepair() {
    if (state.autoRepairTimer) {
      clearInterval(state.autoRepairTimer);
      state.autoRepairTimer = null;
    }

    const message = Utils.t('autoRepairStopped');
    Utils.addDebugLog(`${message}`, 'info');
    Utils.showAlert(message, 'info');
  }

  // FUNCIONES DE UI MEJORADAS CON GESTIÓN DE CONFIGURACIÓN INICIAL
  function enableFileOperations() {
    state.initialSetupComplete = true;

    const loadBtn = document.querySelector('#loadFileBtn');
    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.title = '';
      loadBtn.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (loadBtn) loadBtn.style.animation = '';
      }, 600);
      Utils.addDebugLog('Load Progress button enabled after initial setup', 'success');
    }

    Utils.showAlert(Utils.t('fileOperationsAvailable'), 'success');
  }

  async function initializeTokenGenerator() {
    if (isTokenValid()) {
      Utils.addDebugLog('Valid token already available, skipping initialization', 'success');
      updateTokenStatus();
      enableFileOperations();
      return;
    }

    try {
      Utils.addDebugLog('Initializing Turnstile token generator...', 'info');
      updateStatus(Utils.t('initializingToken'));

      await Utils.loadTurnstile();
      Utils.addDebugLog('Turnstile script loaded successfully', 'success');

      if (state.autoTokenRefresh) {
        Utils.addDebugLog('Pre-generating token for autonomous operations...', 'info');
        await ensureToken();
      }

      state.initialSetupComplete = true;
      Utils.addDebugLog('Enhanced token generator initialization complete', 'success');
      updateStatus(Utils.t('tokenReady'));
      enableFileOperations();

    } catch (error) {
      Utils.addDebugLog('Token system initialization failed: ' + error.message, 'warning');
      Utils.addDebugLog('Manual token generation will be required', 'info');
      enableFileOperations();
    }
  }

  function updateStatus(message) {
    const statusEl = document.getElementById('status');
    if (statusEl) {
      if (typeof message === 'string') {
        statusEl.innerHTML = message;
      } else {
        statusEl.textContent = message;
      }
    }
  }

  function updateDebugConsole() {
    const debugConsole = document.getElementById('debugConsole');
    if (!debugConsole) return;

    const logsHtml = state.debugLogs.map(log => {
      const color = log.type === 'error' ? '#ff6b6b' :
        log.type === 'warning' ? '#ffa726' :
          log.type === 'success' ? '#66bb6a' : '#64b5f6';

      return `<div style="color: ${color}; margin: 2px 0; font-size: 11px;">
        <span style="opacity: 0.7;">[${log.timestamp}]</span> ${log.message}
      </div>`;
    }).join('');

    debugConsole.innerHTML = logsHtml;
    debugConsole.scrollTop = debugConsole.scrollHeight;
  }

  async function updateCharges() {
    try {
      const { charges, max, cooldown } = await WPlaceService.getCharges();
      state.displayCharges = Math.floor(charges);
      state.maxCharges = Math.max(1, Math.floor(max));
      state.cooldown = cooldown;

      updateChargesDisplay();
    } catch (error) {
      if (!state.autonomousMode) {
        Utils.addDebugLog(`Error updating charges: ${error.message}`, 'error');
      }
    }
  }

  function updateChargesDisplay() {
    const chargesEl = document.getElementById('chargesInfo');
    if (chargesEl) {
      chargesEl.textContent = `Charges: ${state.displayCharges}/${state.maxCharges} (cooldown: ${Math.round(state.cooldown / 1000)}s)`;
    }
  }

  function updateTokenStatus() {
    const tokenEl = document.getElementById('tokenInfo');
    if (tokenEl) {
      if (isTokenValid()) {
        const remaining = Math.round((tokenExpiryTime - Date.now()) / 1000);
        tokenEl.textContent = `Token: Valid (expires in ${remaining}s)`;
        tokenEl.style.color = '#81c784';
      } else {
        tokenEl.textContent = 'Token: Not generated or expired';
        tokenEl.style.color = '#ffab91';
      }
    }
  }

  function updateSystemStatus() {
    const systemEl = document.getElementById('systemInfo');
    if (systemEl) {
      const autonomousStatus = state.autonomousMode ? 'AUTONOMOUS' : 'MANUAL';
      const tokenMode = state.tokenSource.toUpperCase();
      systemEl.textContent = `System: ${autonomousStatus} | Token: ${tokenMode} | Auto-refresh: ${state.autoTokenRefresh ? 'ON' : 'OFF'}`;
    }
  }

  // Window dragging functionality
  function makeWindowDraggable() {
    const container = document.getElementById('wplace-repair-tool');
    const header = document.getElementById('window-header');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
      }
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;

      if (e.target === header || header.contains(e.target)) {
        isDragging = true;
        container.style.cursor = 'grabbing';
      }
    }

    function dragEnd() {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      container.style.cursor = 'default';
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        container.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    }

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
  }

  // Enhanced UI Creation with NEW IMPLEMENTATION
  function createUI() {
    const existing = document.getElementById('wplace-repair-tool');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'wplace-repair-tool';
    container.style.cssText = `
      position: fixed; top: 20px; left: 20px; z-index: 10000;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; min-width: 520px; max-width: 600px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      color: white; font-family: 'Segoe UI', Arial, sans-serif;
      backdrop-filter: blur(10px);
      resize: both; overflow: hidden;
    `;

    container.innerHTML = `
      <div id="window-header" style="
        background: rgba(255,255,255,0.1); padding: 12px 20px; 
        border-radius: 12px 12px 0 0; cursor: grab; user-select: none;
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      ">
        <h3 id="main-title" style="margin: 0; color: #fff; font-size: 18px; min-height: 22px;">
          WPlace Autonomous Repair Tool
        </h3>
        <div style="display: flex; gap: 8px;">
          <button id="minimizeBtn" style="
            background: #ffc107; border: none; width: 20px; height: 20px;
            border-radius: 50%; cursor: pointer; font-size: 12px; color: #000;
          ">−</button>
          <button id="closeBtn" style="
            background: #dc3545; border: none; width: 20px; height: 20px;
            border-radius: 50%; cursor: pointer; font-size: 12px; color: white;
          ">×</button>
        </div>
      </div>
      
      <div id="window-content" style="padding: 20px;">
        <div style="margin-bottom: 20px;">
          <div id="status" style="font-size: 14px; color: #b3d9ff; margin-bottom: 10px; min-height: 20px;">
            ${Utils.t('autonomousModeActive')}
          </div>
          <div id="chargesInfo" style="font-size: 12px; color: #90caf9;">
            Charges: 0/1 (cooldown: 31s)
          </div>
          <div id="tokenInfo" style="font-size: 11px; color: #81c784; margin-top: 5px;">
            Token: Initializing...
          </div>
          <div id="systemInfo" style="font-size: 10px; color: #ffcc80; margin-top: 3px;">
            System: AUTONOMOUS | Token: GENERATOR | Auto-refresh: ON
          </div>
        </div>

        <div style="margin-bottom: 15px;">
          <button id="loadFileBtn" style="
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white; border: none; border-radius: 8px; padding: 10px 16px;
            cursor: pointer; font-weight: 500; margin-right: 8px; margin-bottom: 8px; font-size: 12px;
          " disabled title="Waiting for initial setup to complete...">
            📁 ${Utils.t('loadFromFile')}
          </button>
          
          <button id="repairBtn" style="
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white; border: none; border-radius: 8px; padding: 10px 16px;
            cursor: pointer; font-weight: 500; margin-right: 8px; margin-bottom: 8px; font-size: 12px;
          " disabled>
            🔧 ${Utils.t('repairPixels')}
          </button>
          
          <button id="generateTokenBtn" style="
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white; border: none; border-radius: 8px; padding: 10px 16px;
            cursor: pointer; font-weight: 500; font-size: 12px; margin-bottom: 8px;
          ">
            🎯 Force Token
          </button>
        </div>

        <div style="margin-bottom: 15px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
          <div style="margin-bottom: 10px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input type="checkbox" id="autoRepairEnabled" style="margin-right: 8px;">
              <span>${Utils.t('enableAutoRepair')} (Enhanced)</span>
            </label>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <label style="font-size: 14px;">${Utils.t('repairInterval')}:</label>
            <input type="number" id="repairInterval" value="30" min="10" max="3600" 
                   style="width: 80px; padding: 5px; border-radius: 4px; border: 1px solid #ccc; color: #333;">
            <span style="font-size: 12px; color: #b3d9ff;">seconds</span>
          </div>
          
          <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; cursor: pointer; font-size: 12px;">
              <input type="checkbox" id="autoTokenRefresh" ${state.autoTokenRefresh ? 'checked' : ''} style="margin-right: 6px;">
              <span>Auto Token Refresh</span>
            </label>
            <select id="tokenSourceSelect" style="
              padding: 4px 8px; border-radius: 4px; font-size: 11px; 
              background: white; color: #333; border: 1px solid #ccc;
            ">
              <option value="generator" ${state.tokenSource === 'generator' ? 'selected' : ''}>Generator</option>
              <option value="hybrid" ${state.tokenSource === 'hybrid' ? 'selected' : ''}>Hybrid</option>
              <option value="manual" ${state.tokenSource === 'manual' ? 'selected' : ''}>Manual</option>
            </select>
          </div>
          
          <div style="margin-top: 10px; font-size: 12px; color: #e1f5fe;">
            <div>Image: <span id="imageInfo">Not loaded</span></div>
            <div>Position: <span id="positionInfo">Not set</span></div>
            <div>Colors: <span id="colorsInfo">0 available</span></div>
          </div>
        </div>

        <div style="margin-top: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h4 style="margin: 0; font-size: 14px; color: #fff;">📋 ${Utils.t('debug')} (Enhanced System)</h4>
            <button id="clearDebugBtn" style="
              background: rgba(255,255,255,0.2); color: white; border: none;
              border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;
            ">
              ${Utils.t('clearDebug')}
            </button>
          </div>
          
          <div id="debugConsole" style="
            background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px; padding: 10px; height: 300px; overflow-y: auto;
            font-family: 'Courier New', monospace; font-size: 11px;
            color: #e3f2fd; line-height: 1.3;
          ">
            <div style="color: #90caf9;">[Ready] WPlace Autonomous Repair Tool v3.0</div>
            <div style="color: #81c784;">[Info] NEW Turnstile implementation active</div>
            <div style="color: #ffcc80;">[Info] Enhanced token management with preloading</div>
            <div style="color: #c5e1a5;">[Info] ${Utils.t('tokenSystemReady')}</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    makeWindowDraggable();
    setupEventListeners();
    
    // Start typewriter effect
    setTimeout(() => {
      createTypewriterTitle();
    }, 1000);
    
    // Start autonomous systems
    initializeAutonomousSystems();
  }

  function initializeAutonomousSystems() {
    // Update charges periodically
    updateCharges();
    setInterval(updateCharges, 10000);
    
    // Update token status
    updateTokenStatus();
    setInterval(updateTokenStatus, 5000);
    
    // Update system status
    updateSystemStatus();
    setInterval(updateSystemStatus, 15000);
    
    // Initialize token generator
    initializeTokenGenerator();
  }

  function setupEventListeners() {
    // Window controls
    document.getElementById('minimizeBtn').addEventListener('click', () => {
      const content = document.getElementById('window-content');
      state.windowMinimized = !state.windowMinimized;
      
      if (state.windowMinimized) {
        content.style.display = 'none';
        document.getElementById('minimizeBtn').textContent = '+';
      } else {
        content.style.display = 'block';
        document.getElementById('minimizeBtn').textContent = '−';
      }
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
      const container = document.getElementById('wplace-repair-tool');
      if (container) {
        container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        container.style.opacity = '0';
        container.style.transform = 'scale(0.8)';
        setTimeout(() => {
          container.remove();
          cleanup();
        }, 300);
      }
    });

    // Load file
    document.getElementById('loadFileBtn').addEventListener('click', async () => {
      try {
        Utils.addDebugLog('Loading progress file...', 'info');
        const data = await Utils.createFileUploader();

        if (!data || !data.state || !data.imageData) {
          throw new Error(Utils.t('invalidFile'));
        }

        const migratedData = migrateProgressData(data);

        Object.assign(state, migratedData.state);
        state.imageData = {
          ...migratedData.imageData,
          pixels: new Uint8ClampedArray(migratedData.imageData.pixels),
        };

        state.imageLoaded = true;
        document.getElementById('repairBtn').disabled = false;

        // Update info displays
        document.getElementById('imageInfo').textContent = `${state.imageData.width}x${state.imageData.height}`;
        document.getElementById('positionInfo').textContent = state.startPosition ?
          `(${state.startPosition.x}, ${state.startPosition.y}) in region (${state.region.x}, ${state.region.y})` : 'Not set';
        document.getElementById('colorsInfo').textContent = `${state.availableColors?.length || 0} available`;

        updateStatus(Utils.t('fileLoaded'));
        Utils.addDebugLog(`Loaded image: ${state.imageData.width}x${state.imageData.height}`, 'success');
        Utils.addDebugLog(`Position: (${state.startPosition?.x}, ${state.startPosition?.y})`, 'info');
        Utils.addDebugLog(`Region: (${state.region?.x}, ${state.region?.y})`, 'info');
        Utils.addDebugLog(`Available colors: ${state.availableColors?.length || 0}`, 'info');

        if (migratedData.state.paintWhitePixels !== undefined) {
          state.paintWhitePixels = migratedData.state.paintWhitePixels;
          Utils.addDebugLog(`Paint white pixels: ${state.paintWhitePixels}`, 'info');
        }
        if (migratedData.state.paintTransparentPixels !== undefined) {
          state.paintTransparentPixels = migratedData.state.paintTransparentPixels;
          Utils.addDebugLog(`Paint transparent pixels: ${state.paintTransparentPixels}`, 'info');
        }

        Utils.showAlert(Utils.t('fileLoaded'), 'success');
        
        // If autonomous mode and auto repair is enabled, start it
        if (state.autonomousMode && document.getElementById('autoRepairEnabled').checked) {
          Utils.addDebugLog('Autonomous mode: starting auto repair after file load', 'info');
          setTimeout(() => {
            state.autoRepairEnabled = true;
            startAutoRepair();
          }, 5000);
        }
        
      } catch (error) {
        Utils.addDebugLog(`Load error: ${error.message}`, 'error');
        Utils.showAlert(error.message, 'error');
      }
    });

    // Generate Token button
    document.getElementById('generateTokenBtn').addEventListener('click', async () => {
      const btn = document.getElementById('generateTokenBtn');
      const originalText = btn.textContent;

      try {
        btn.disabled = true;
        btn.textContent = '🔄 Generating...';
        btn.style.background = 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)';

        Utils.addDebugLog('Manual token generation requested', 'info');

        const token = await ensureToken(true);

        if (token) {
          Utils.addDebugLog('Token generation succeeded!', 'success');
          Utils.showAlert('Token generated successfully!', 'success');
          updateTokenStatus();
        } else {
          throw new Error('Token generation failed');
        }
      } catch (error) {
        Utils.addDebugLog(`Token generation failed: ${error.message}`, 'error');
        Utils.showAlert('Token generation failed', 'error');
        playNotificationSound();
      } finally {
        btn.disabled = false;
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      }
    });

    // Manual repair
    let repairRunning = false;
    document.getElementById('repairBtn').addEventListener('click', async () => {
      if (!state.imageLoaded) {
        Utils.showAlert('Please load a progress file first', 'warning');
        return;
      }

      if (repairRunning) {
        state.stopFlag = true;
        Utils.addDebugLog('Manual repair stop requested', 'warning');
        return;
      }

      repairRunning = true;
      state.running = true;
      state.stopFlag = false;
      const repairBtn = document.getElementById('repairBtn');
      repairBtn.textContent = '⏸️ Stop Repair';
      repairBtn.style.background = 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)';

      try {
        Utils.addDebugLog('Starting manual repair with enhanced autonomous system...', 'info');

        if (!isTokenValid()) {
          Utils.addDebugLog('No valid token, generating...', 'info');
          await ensureToken(true);
        }

        const damagedPixels = await scanForDamage();

        if (damagedPixels.length > 0) {
          updateStatus(Utils.t('damageDetected', { count: damagedPixels.length }));
          showAttackNotification('attack', damagedPixels.length);
          
          const repairedCount = await repairDamagedPixels(damagedPixels);
          
          if (repairedCount === damagedPixels.length) {
            showAttackNotification('repaired');
          }
        } else {
          updateStatus(Utils.t('noDamageDetected'));
          showPeacefulState();
        }
      } catch (error) {
        Utils.addDebugLog(`Repair error: ${error.message}`, 'error');
        Utils.showAlert('Repair failed', 'error');
      } finally {
        repairRunning = false;
        state.running = false;
        state.stopFlag = false;
        repairBtn.textContent = '🔧 ' + Utils.t('repairPixels');
        repairBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      }
    });

    // Auto repair toggle
    document.getElementById('autoRepairEnabled').addEventListener('change', (e) => {
      state.autoRepairEnabled = e.target.checked;

      if (state.autoRepairEnabled) {
        if (!state.imageLoaded) {
          Utils.showAlert('Please load a progress file first', 'warning');
          e.target.checked = false;
          state.autoRepairEnabled = false;
          return;
        }
        startAutoRepair();
      } else {
        stopAutoRepair();
      }
    });

    // Repair interval change
    document.getElementById('repairInterval').addEventListener('change', (e) => {
      const value = parseInt(e.target.value) || 30;
      state.autoRepairInterval = Math.max(10, Math.min(3600, value));
      e.target.value = state.autoRepairInterval;

      Utils.addDebugLog(`Repair interval changed to ${state.autoRepairInterval} seconds`, 'info');

      if (state.autoRepairEnabled && state.imageLoaded) {
        Utils.addDebugLog('Restarting auto repair with new interval', 'info');
        startAutoRepair();
      }
    });

    // Auto token refresh toggle
    document.getElementById('autoTokenRefresh').addEventListener('change', (e) => {
      state.autoTokenRefresh = e.target.checked;
      Utils.addDebugLog(`Auto token refresh ${state.autoTokenRefresh ? 'enabled' : 'disabled'}`, 'info');
      updateSystemStatus();
      
      if (state.autoTokenRefresh && state.autonomousMode && !isTokenValid()) {
        ensureToken();
      }
    });

    // Token source selection
    document.getElementById('tokenSourceSelect').addEventListener('change', (e) => {
      state.tokenSource = e.target.value;
      Utils.addDebugLog(`Token source changed to: ${state.tokenSource}`, 'info');
      updateSystemStatus();
      
      // Invalidate current token to force new generation with new method
      if (isTokenValid()) {
        Utils.addDebugLog('Invalidating current token due to source change', 'info');
        invalidateToken();
      }
    });

    // Clear debug
    document.getElementById('clearDebugBtn').addEventListener('click', () => {
      state.debugLogs = [];
      updateDebugConsole();
      Utils.addDebugLog('Debug console cleared', 'info');
      Utils.addDebugLog('Enhanced WPlace Autonomous Repair Tool ready', 'info');
    });
  }

  // Enhanced data migration helper
  function migrateProgressData(data) {
    if (!data.version || data.version < '2.0') {
      Utils.addDebugLog('Migrating old progress data format...', 'info');
      
      if (!data.state) data.state = {};
      if (!data.imageData) data.imageData = {};
      
      data.state.paintWhitePixels = data.state.paintWhitePixels ?? true;
      data.state.paintTransparentPixels = data.state.paintTransparentPixels ?? false;
      
      data.version = '2.0';
    }

    // Additional migrations for autonomous features
    if (data.version === '2.0') {
      data.state.autonomousMode = data.state.autonomousMode ?? CONFIG.AUTONOMOUS_MODE;
      data.state.autoTokenRefresh = data.state.autoTokenRefresh ?? CONFIG.AUTO_TOKEN_REFRESH;
      data.state.tokenSource = data.state.tokenSource ?? CONFIG.TOKEN_SOURCE;
      data.version = '3.0';
      Utils.addDebugLog('Migrated to autonomous features v3.0', 'info');
    }
    
    return data;
  }

  // Main initialization function
  async function initialize() {
    Utils.addDebugLog('Starting WPlace Autonomous Repair Tool v3.0...', 'info');
    
    // Create UI first
    createUI();
    
    Utils.addDebugLog('NEW Enhanced Features Initialized:', 'info');
    Utils.addDebugLog('• NEW Turnstile implementation with widget reuse', 'info');
    Utils.addDebugLog('• Enhanced sitekey detection from multiple sources', 'info');
    Utils.addDebugLog('• Sophisticated token management with preloading', 'info');
    Utils.addDebugLog('• Autonomous operation with smart retry logic', 'info');
    Utils.addDebugLog('• Enhanced tile interception and caching', 'info');
    Utils.addDebugLog('• Adaptive repair algorithms with failure handling', 'info');
    Utils.addDebugLog('• Visual notifications and audio alerts', 'info');
    Utils.addDebugLog('• Draggable window with minimize/close controls', 'info');
    
    if (state.autonomousMode) {
      Utils.addDebugLog('AUTONOMOUS MODE ACTIVE - Tool will operate independently', 'success');
      Utils.addDebugLog('Instructions for autonomous operation:', 'info');
      Utils.addDebugLog('1. Wait for initial setup to complete', 'info');
      Utils.addDebugLog('2. Load a progress file using "Load Progress File"', 'info');
      Utils.addDebugLog('3. Enable "Auto Repair" to start autonomous monitoring', 'info');
      Utils.addDebugLog('4. Tool will automatically scan and repair damage', 'info');
      Utils.addDebugLog('5. Tokens will be generated and refreshed automatically', 'info');
      Utils.addDebugLog('6. Monitor debug console for autonomous operation logs', 'info');
    } else {
      Utils.addDebugLog('Manual mode active - use controls for manual operation', 'info');
    }
    
    // Show autonomous mode status
    updateStatus(state.autonomousMode ? Utils.t('autonomousModeActive') : 'Manual mode ready - Load file and enable auto repair to start');
    
    Utils.addDebugLog('WPlace Autonomous Repair Tool ready for operation', 'success');
  }

  // Enhanced cleanup function
  function cleanup() {
    Utils.addDebugLog('Cleaning up autonomous systems...', 'info');
    
    // Clear all timers
    if (state.autoRepairTimer) {
      clearInterval(state.autoRepairTimer);
      state.autoRepairTimer = null;
    }
    
    if (state.tokenRetryTimer) {
      clearTimeout(state.tokenRetryTimer);
      state.tokenRetryTimer = null;
    }
    
    if (state.tokenPreloadTimer) {
      clearTimeout(state.tokenPreloadTimer);
      state.tokenPreloadTimer = null;
    }
    
    // Cleanup Turnstile
    Utils.cleanupTurnstile();
    
    // Set stop flag
    state.stopFlag = true;
    
    Utils.addDebugLog('Cleanup completed', 'info');
  }

  // Add cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Handle page visibility changes for autonomous mode
  document.addEventListener('visibilitychange', () => {
    if (state.autonomousMode) {
      if (document.hidden) {
        Utils.addDebugLog('Page hidden - autonomous systems continue running', 'info');
      } else {
        Utils.addDebugLog('Page visible - autonomous systems active', 'info');
        // Refresh status when page becomes visible
        updateCharges();
        updateTokenStatus();
      }
    }
  });

  // Enhanced error handling for autonomous mode
  window.addEventListener('error', (event) => {
    if (state.autonomousMode) {
      Utils.addDebugLog(`Global error in autonomous mode: ${event.error?.message || 'Unknown error'}`, 'error');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (state.autonomousMode) {
      Utils.addDebugLog(`Unhandled promise rejection in autonomous mode: ${event.reason}`, 'error');
    }
  });

  // Start the enhanced autonomous application
  initialize().catch(error => {
    console.error('Failed to initialize autonomous repair tool:', error);
    Utils.addDebugLog(`Initialization failed: ${error.message}`, 'error');
  });

})();
