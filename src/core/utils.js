import { TurnstileManager } from '../auth/index.js';
import { t } from './translations.js';

export function createAutoImageUtils(state, CONFIG, colorCache, isTokenValid, turnstileToken, setTurnstileToken, overlayManager) {
    const Utils = {
        overlayManager: overlayManager, // Will be set after creation
        sleep: ms => new Promise(r => setTimeout(r, ms)),

        dynamicSleep: async function (tickAndGetRemainingMs) {
            let remaining = Math.max(0, await tickAndGetRemainingMs());
            while (remaining > 0) {
                const interval =
                    remaining > 5000 ? 2000 : remaining > 1000 ? 500 : 100;
                await this.sleep(Math.min(interval, remaining));
                remaining = Math.max(0, await tickAndGetRemainingMs());
            }
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

        msToTimeText(ms) {
            const totalSeconds = Math.ceil(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
            if (minutes > 0) return `${minutes}m ${seconds}s`;
            return `${seconds}s`;
        },

        /**
         * Calculate the range of tile coordinates (in region space) that cover a given image area.
         * @param {number} startRegionX - Base region X
         * @param {number} startRegionY - Base region Y
         * @param {number} startPixelX - Starting pixel X within the region grid
         * @param {number} startPixelY - Starting pixel Y within the region grid
         * @param {number} width - Image width in pixels
         * @param {number} height - Image height in pixels
         * @param {number} tileSize - Size of a tile (default 1000)
         * @returns {{ startTileX: number, startTileY: number, endTileX: number, endTileY: number }}
         */
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

        turnstileManager: new TurnstileManager({
            theme: 'light',
            size: 'normal',
            retryInterval: 5000,
        }),

        async obtainSitekeyAndToken(fallback = '0x4AAAAAABpqJe8FO0N84q0F') {
            try {
                // If we have a valid cached token, return it
                if (isTokenValid() && turnstileToken) {
                    console.log('🔍 Using valid cached token');
                    return { sitekey: fallback, token: turnstileToken };
                }

                // Try to detect sitekey from page or use fallback
                let sitekey = fallback;
                try {
                    // Try to find sitekey on the page
                    const sitekeySel = document.querySelector('[data-sitekey]');
                    if (sitekeySel) {
                        sitekey = sitekeySel.getAttribute('data-sitekey');
                        console.log('🔍 Found sitekey in DOM:', sitekey);
                    } else {
                        const turnstileEl =
                            document.querySelector('.cf-turnstile');
                        if (turnstileEl?.dataset?.sitekey) {
                            sitekey = turnstileEl.dataset.sitekey;
                            console.log(
                                '🔍 Found sitekey in Turnstile element:',
                                sitekey
                            );
                        }
                    }
                } catch (e) {
                    console.warn(
                        '⚠️ Error detecting sitekey, using fallback:',
                        e.message
                    );
                }

                console.log('🔐 Generating new token with TurnstileManager...');
                console.log('🔍 Using sitekey:', sitekey);

                // Initialize TurnstileManager (it handles its own UI)
                console.log('⚡ Initializing TurnstileManager...');
                await this.turnstileManager.initialize(sitekey);
                console.log('✅ TurnstileManager initialized successfully');

                console.log('🎲 Solving Turnstile challenge...');
                const token = await this.turnstileManager.solve();
                console.log(
                    '🎯 Turnstile solve completed, token length:',
                    token ? token.length : 'null'
                );

                if (token && token.length >= 20) {
                    console.log('✅ Valid token generated');
                    setTurnstileToken(token);
                    return { sitekey, token };
                } else {
                    console.log('❌ Failed to generate token');
                    return { sitekey, token: null };
                }
            } catch (error) {
                console.error('❌ Error in obtainSitekeyAndToken:', error);
                return { sitekey: fallback, token: null };
            }
        },

        createElement: (tag, props = {}, children = []) => {
            const element = document.createElement(tag);

            Object.entries(props).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });

            if (typeof children === 'string') {
                element.textContent = children;
            } else if (Array.isArray(children)) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                });
            }

            return element;
        },

        createButton: (
            id,
            text,
            icon,
            onClick,
            className = 'wplace-btn-primary'
        ) => {
            const Utils = this;
            const button = Utils.createElement('button', {
                id: id,
                className: className,
                innerHTML: `${icon ? `<i class="${icon}"></i>` : ''}<span>${text}</span>`,
            });
            if (onClick) button.addEventListener('click', onClick);
            return button;
        },

        // Add hold-to-repeat functionality to buttons (for +/- buttons)
        addHoldToRepeatListener: (
            button,
            callback,
            initialDelay = 500,
            initialInterval = 150
        ) => {
            let timeout, interval;
            let currentInterval = initialInterval;
            const minInterval = 25; // Fastest repeat rate
            const acceleration = 0.9; // Speed multiplier each cycle

            const startRepeating = () => {
                callback(); // Execute immediately
                currentInterval = initialInterval; // Reset to initial speed

                timeout = setTimeout(() => {
                    const acceleratingRepeat = () => {
                        callback();
                        currentInterval = Math.max(
                            minInterval,
                            currentInterval * acceleration
                        );
                        interval = setTimeout(
                            acceleratingRepeat,
                            currentInterval
                        );
                    };
                    acceleratingRepeat();
                }, initialDelay);
            };

            const stopRepeating = () => {
                clearTimeout(timeout);
                clearTimeout(interval);
                currentInterval = initialInterval; // Reset for next time
            };

            // Handle both mouse and touch events
            button.addEventListener('mousedown', startRepeating);
            button.addEventListener('mouseup', stopRepeating);
            button.addEventListener('mouseleave', stopRepeating);
            button.addEventListener('touchstart', startRepeating);
            button.addEventListener('touchend', stopRepeating);

            // Prevent context menu on long press
            button.addEventListener('contextmenu', e => e.preventDefault());
        },

        // Translation function wrapper
        t: (key, params = {}) => {
            return t(key, params, state);
        },

        showAlert: (message, type = 'info') => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `wplace-alert-base wplace-alert-${type}`;

            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                alertDiv.style.animation = 'slide-down 0.3s ease-out reverse';
                setTimeout(() => {
                    document.body.removeChild(alertDiv);
                }, 300);
            }, 4000);
        },

        colorDistance: (a, b) =>
            Math.sqrt(
                Math.pow(a[0] - b[0], 2) +
                    Math.pow(a[1] - b[1], 2) +
                    Math.pow(a[2] - b[2], 2)
            ),
        _labCache: new Map(), // key: (r<<16)|(g<<8)|b  value: [L,a,b]
        _rgbToLab: (r, g, b) => {
            // sRGB -> linear
            const srgbToLinear = v => {
                v /= 255;
                return v <= 0.04045
                    ? v / 12.92
                    : Math.pow((v + 0.055) / 1.055, 2.4);
            };
            const rl = srgbToLinear(r);
            const gl = srgbToLinear(g);
            const bl = srgbToLinear(b);
            let X = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
            let Y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
            let Z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
            X /= 0.95047;
            Y /= 1.0;
            Z /= 1.08883;
            const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
            const fX = f(X),
                fY = f(Y),
                fZ = f(Z);
            const L = 116 * fY - 16;
            const a = 500 * (fX - fY);
            const b2 = 200 * (fY - fZ);
            return [L, a, b2];
        },
        _lab: function(r, g, b) {
            const key = (r << 16) | (g << 8) | b;
            let v = this._labCache.get(key);
            if (!v) {
                v = this._rgbToLab(r, g, b);
                this._labCache.set(key, v);
            }
            return v;
        },
        findClosestPaletteColor: function(r, g, b, palette) {
            // Use provided palette or derive from COLOR_MAP
            if (!palette || palette.length === 0) {
                palette = Object.values(CONFIG.COLOR_MAP)
                    .filter(c => c.rgb)
                    .map(c => [c.rgb.r, c.rgb.g, c.rgb.b]);
            }
            if (state.colorMatchingAlgorithm === 'legacy') {
                let menorDist = Infinity;
                let cor = [0, 0, 0];
                for (let i = 0; i < palette.length; i++) {
                    const [pr, pg, pb] = palette[i];
                    const rmean = (pr + r) / 2;
                    const rdiff = pr - r;
                    const gdiff = pg - g;
                    const bdiff = pb - b;
                    const dist = Math.sqrt(
                        (((512 + rmean) * rdiff * rdiff) >> 8) +
                            4 * gdiff * gdiff +
                            (((767 - rmean) * bdiff * bdiff) >> 8)
                    );
                    if (dist < menorDist) {
                        menorDist = dist;
                        cor = [pr, pg, pb];
                    }
                }
                return cor;
            }
            // LAB algorithm
            const [Lt, at, bt] = this._lab(r, g, b);
            const targetChroma = Math.sqrt(at * at + bt * bt);
            let best = null;
            let bestDist = Infinity;
            for (let i = 0; i < palette.length; i++) {
                const [pr, pg, pb] = palette[i];
                const [Lp, ap, bp] = this._lab(pr, pg, pb);
                const dL = Lt - Lp;
                const da = at - ap;
                const db = bt - bp;
                let dist = dL * dL + da * da + db * db;
                if (state.enableChromaPenalty && targetChroma > 20) {
                    const candChroma = Math.sqrt(ap * ap + bp * bp);
                    if (candChroma < targetChroma) {
                        const chromaDiff = targetChroma - candChroma;
                        dist +=
                            chromaDiff * chromaDiff * state.chromaPenaltyWeight;
                    }
                }
                if (dist < bestDist) {
                    bestDist = dist;
                    best = palette[i];
                    if (bestDist === 0) break;
                }
            }
            return best || [0, 0, 0];
        },

        isWhitePixel: (r, g, b) => {
            const wt = state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
            return r >= wt && g >= wt && b >= wt;
        },

        resolveColor: function(targetRgb, availableColors, exactMatch = false) {
            if (!availableColors || availableColors.length === 0) {
                return {
                    id: null,
                    rgb: targetRgb,
                };
            }

            const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}|${state.colorMatchingAlgorithm}|${
                state.enableChromaPenalty ? 'c' : 'nc'
            }|${state.chromaPenaltyWeight}|${exactMatch ? 'exact' : 'closest'}`;

            if (colorCache.has(cacheKey)) return colorCache.get(cacheKey);

            // Check for an exact color match in availableColors.
            // If found, return the matched color with its ID.
            // If not found, return the target color with null ID.
            // Cache the result for future lookups.
            if (exactMatch) {
                const match = availableColors.find(
                    c =>
                        c.rgb[0] === targetRgb[0] &&
                        c.rgb[1] === targetRgb[1] &&
                        c.rgb[2] === targetRgb[2]
                );
                const result = match
                    ? { id: match.id, rgb: [...match.rgb] }
                    : { id: null, rgb: targetRgb };
                colorCache.set(cacheKey, result);
                return result;
            }

            // check for white using threshold
            const whiteThreshold =
                state.customWhiteThreshold || CONFIG.WHITE_THRESHOLD;
            if (
                targetRgb[0] >= whiteThreshold &&
                targetRgb[1] >= whiteThreshold &&
                targetRgb[2] >= whiteThreshold
            ) {
                const whiteEntry = availableColors.find(
                    c =>
                        c.rgb[0] >= whiteThreshold &&
                        c.rgb[1] >= whiteThreshold &&
                        c.rgb[2] >= whiteThreshold
                );
                if (whiteEntry) {
                    const result = {
                        id: whiteEntry.id,
                        rgb: [...whiteEntry.rgb],
                    };
                    colorCache.set(cacheKey, result);
                    return result;
                }
            }

            // find nearest color
            let bestId = availableColors[0].id;
            let bestRgb = [...availableColors[0].rgb];
            let bestScore = Infinity;

            if (state.colorMatchingAlgorithm === 'legacy') {
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
            } else {
                const [Lt, at, bt] = this._lab(
                    targetRgb[0],
                    targetRgb[1],
                    targetRgb[2]
                );
                const targetChroma = Math.sqrt(at * at + bt * bt);
                const penaltyWeight = state.enableChromaPenalty
                    ? state.chromaPenaltyWeight || 0.15
                    : 0;

                for (let i = 0; i < availableColors.length; i++) {
                    const c = availableColors[i];
                    const [r, g, b] = c.rgb;
                    const [L2, a2, b2] = this._lab(r, g, b);
                    const dL = Lt - L2,
                        da = at - a2,
                        db = bt - b2;
                    let dist = dL * dL + da * da + db * db;

                    if (penaltyWeight > 0 && targetChroma > 20) {
                        const candChroma = Math.sqrt(a2 * a2 + b2 * b2);
                        if (candChroma < targetChroma) {
                            const cd = targetChroma - candChroma;
                            dist += cd * cd * penaltyWeight;
                        }
                    }

                    if (dist < bestScore) {
                        bestScore = dist;
                        bestId = c.id;
                        bestRgb = [...c.rgb];
                        if (dist === 0) break;
                    }
                }
            }

            const result = { id: bestId, rgb: bestRgb };
            colorCache.set(cacheKey, result);

            // limit the size of the cache
            if (colorCache.size > 15000) {
                const firstKey = colorCache.keys().next().value;
                colorCache.delete(firstKey);
            }

            return result;
        },

        createImageUploader: () =>
            new Promise(resolve => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/png,image/jpeg';
                input.onchange = () => {
                    const fr = new FileReader();
                    fr.onload = () => resolve(fr.result);
                    fr.readAsDataURL(input.files[0]);
                };
                input.click();
            }),

        createFileDownloader: (data, filename) => {
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        createFileUploader: () =>
            new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = e => {
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
                        reader.onerror = () =>
                            reject(new Error('File reading error'));
                        reader.readAsText(file);
                    } else {
                        reject(new Error('No file selected'));
                    }
                };
                input.click();
            }),

        extractAvailableColors: function() {
            const colorElements = document.querySelectorAll(
                '.tooltip button[id^="color-"]'
            );
            if (colorElements.length === 0) {
                console.log('❌ No color elements found on page');
                return null;
            }
            // Separate available and unavailable colors
            const availableColors = [];
            const unavailableColors = [];

            Array.from(colorElements).forEach(el => {
                const id = Number.parseInt(el.id.replace('color-', ''));
                if (id === 0) return; // Skip transparent color

                const rgbStr = el.style.backgroundColor.match(/\d+/g);
                if (!rgbStr || rgbStr.length < 3) {
                    console.warn(
                        `Skipping color element ${el.id} — cannot parse RGB`
                    );
                    return;
                }
                const rgb = rgbStr.map(Number);

                // Find color name from COLOR_MAP
                const colorInfo = Object.values(CONFIG.COLOR_MAP).find(
                    color => color.id === id
                );
                const name = colorInfo ? colorInfo.name : `Unknown Color ${id}`;

                const colorData = { id, name, rgb };

                // Check if color is available (no SVG overlay means available)
                if (!el.querySelector('svg')) {
                    availableColors.push(colorData);
                } else {
                    unavailableColors.push(colorData);
                }
            });

            // Console log detailed color information
            console.log('=== CAPTURED COLORS STATUS ===');
            console.log(`Total available colors: ${availableColors.length}`);
            console.log(
                `Total unavailable colors: ${unavailableColors.length}`
            );
            console.log(
                `Total colors scanned: ${availableColors.length + unavailableColors.length}`
            );

            if (availableColors.length > 0) {
                console.log('\n--- AVAILABLE COLORS ---');
                availableColors.forEach((color, index) => {
                    console.log(
                        `${
                            index + 1
                        }. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`
                    );
                });
            }

            if (unavailableColors.length > 0) {
                console.log('\n--- UNAVAILABLE COLORS ---');
                unavailableColors.forEach((color, index) => {
                    console.log(
                        `${
                            index + 1
                        }. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}) [LOCKED]`
                    );
                });
            }

            console.log('=== END COLOR STATUS ===');

            return availableColors;
        },

        formatTime: ms => {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
            const days = Math.floor(ms / (1000 * 60 * 60 * 24));

            let result = '';
            if (days > 0) result += `${days}d `;
            if (hours > 0 || days > 0) result += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
            result += `${seconds}s`;

            return result;
        },

        calculateEstimatedTime: (remainingPixels, charges, cooldown) => {
            if (remainingPixels <= 0) return 0;

            const paintingSpeedDelay =
                state.paintingSpeed > 0 ? 1000 / state.paintingSpeed : 1000;
            const timeFromSpeed = remainingPixels * paintingSpeedDelay;

            const cyclesNeeded = Math.ceil(
                remainingPixels / Math.max(charges, 1)
            );
            const timeFromCharges = cyclesNeeded * cooldown;

            return timeFromSpeed + timeFromCharges; // combine instead of taking max
        },

        // --- Painted pixel tracking helpers ---
        initializePaintedMap: (width, height) => {
            if (!state.paintedMap || state.paintedMap.length !== height) {
                state.paintedMap = Array(height)
                    .fill()
                    .map(() => Array(width).fill(false));
                console.log(`📋 Initialized painted map: ${width}x${height}`);
            }
        },

        markPixelPainted: (x, y, regionX = 0, regionY = 0) => {
            const actualX = x + regionX;
            const actualY = y + regionY;

            if (
                state.paintedMap &&
                state.paintedMap[actualY] &&
                actualX >= 0 &&
                actualX < state.paintedMap[actualY].length
            ) {
                state.paintedMap[actualY][actualX] = true;
            }
        },

        isPixelPainted: (x, y, regionX = 0, regionY = 0) => {
            const actualX = x + regionX;
            const actualY = y + regionY;

            if (
                state.paintedMap &&
                state.paintedMap[actualY] &&
                actualX >= 0 &&
                actualX < state.paintedMap[actualY].length
            ) {
                return state.paintedMap[actualY][actualX];
            }
            return false;
        },

        // Smart save - only save if significant changes
        shouldAutoSave: function() {
            const now = Date.now();
            const pixelsSinceLastSave =
                state.paintedPixels - state._lastSavePixelCount;
            const timeSinceLastSave = now - state._lastSaveTime;

            // Save conditions:
            // 1. Every 25 pixels (reduced from 50 for more frequent saves)
            // 2. At least 30 seconds since last save (prevent spam)
            // 3. Not already saving
            return (
                !state._saveInProgress &&
                pixelsSinceLastSave >= 25 &&
                timeSinceLastSave >= 30000
            );
        },

        performSmartSave: function() {
            if (!this.shouldAutoSave()) return false;

            state._saveInProgress = true;
            const success = this.saveProgress();

            if (success) {
                state._lastSavePixelCount = state.paintedPixels;
                state._lastSaveTime = Date.now();
                console.log(`💾 Auto-saved at ${state.paintedPixels} pixels`);
            }

            state._saveInProgress = false;
            return success;
        },

        // --- Data management helpers ---

        // Base64 compression helpers for efficient storage
        packPaintedMapToBase64: function(paintedMap, width, height) {
            if (!paintedMap || !width || !height) return null;
            const totalBits = width * height;
            const byteLen = Math.ceil(totalBits / 8);
            const bytes = new Uint8Array(byteLen);
            let bitIndex = 0;
            for (let y = 0; y < height; y++) {
                const row = paintedMap[y];
                for (let x = 0; x < width; x++) {
                    const bit = row && row[x] ? 1 : 0;
                    const b = bitIndex >> 3; // byte index
                    const o = bitIndex & 7; // bit offset
                    if (bit) bytes[b] |= 1 << o;
                    bitIndex++;
                }
            }
            let binary = '';
            const chunk = 0x8000;
            for (let i = 0; i < bytes.length; i += chunk) {
                binary += String.fromCharCode.apply(
                    null,
                    bytes.subarray(i, Math.min(i + chunk, bytes.length))
                );
            }
            return btoa(binary);
        },

        unpackPaintedMapFromBase64: function(base64, width, height) {
            if (!base64 || !width || !height) return null;
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++)
                bytes[i] = binary.charCodeAt(i);
            const map = Array(height)
                .fill()
                .map(() => Array(width).fill(false));
            let bitIndex = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const b = bitIndex >> 3;
                    const o = bitIndex & 7;
                    map[y][x] = ((bytes[b] >> o) & 1) === 1;
                    bitIndex++;
                }
            }
            return map;
        },

        // Migration helpers for backward compatibility
        migrateProgressToV2: function(saved) {
            if (!saved) return saved;
            const isV1 =
                !saved.version ||
                saved.version === '1' ||
                saved.version === '1.0' ||
                saved.version === '1.1';
            if (!isV1) return saved;

            try {
                const migrated = { ...saved };
                const width = migrated.imageData?.width;
                const height = migrated.imageData?.height;
                if (migrated.paintedMap && width && height) {
                    const data = this.packPaintedMapToBase64(
                        migrated.paintedMap,
                        width,
                        height
                    );
                    migrated.paintedMapPacked = { width, height, data };
                }
                delete migrated.paintedMap;
                migrated.version = '2';
                return migrated;
            } catch (e) {
                console.warn('Migration to v2 failed, using original data:', e);
                return saved;
            }
        },

        migrateProgressToV21: function(saved) {
            if (!saved) return saved;
            if (saved.version === '2.1') return saved;
            const isV2 = saved.version === '2' || saved.version === '2.0';
            const isV1 =
                !saved.version ||
                saved.version === '1' ||
                saved.version === '1.0' ||
                saved.version === '1.1';
            if (!isV2 && !isV1) return saved; // save this for future
            try {
                const migrated = { ...saved };
                // First migrate to v2 if needed
                if (isV1) {
                    const width = migrated.imageData?.width;
                    const height = migrated.imageData?.height;
                    if (migrated.paintedMap && width && height) {
                        const data = this.packPaintedMapToBase64(
                            migrated.paintedMap,
                            width,
                            height
                        );
                        migrated.paintedMapPacked = { width, height, data };
                    }
                    delete migrated.paintedMap;
                }
                migrated.version = '2.1';
                return migrated;
            } catch (e) {
                console.warn(
                    'Migration to v2.1 failed, using original data:',
                    e
                );
                return saved;
            }
        },

        migrateProgressToV22: data => {
            try {
                const migrated = { ...data };
                migrated.version = '2.2';

                // Add new fields with default values
                if (!migrated.state.coordinateMode) {
                    migrated.state.coordinateMode = CONFIG.COORDINATE_MODE;
                }
                if (!migrated.state.coordinateDirection) {
                    migrated.state.coordinateDirection =
                        CONFIG.COORDINATE_DIRECTION;
                }
                if (!migrated.state.coordinateSnake) {
                    migrated.state.coordinateSnake = CONFIG.COORDINATE_SNAKE;
                }
                if (!migrated.state.blockWidth) {
                    migrated.state.blockWidth = CONFIG.COORDINATE_BLOCK_WIDTH;
                }
                if (!migrated.state.blockHeight) {
                    migrated.state.blockHeight = CONFIG.COORDINATE_BLOCK_HEIGHT;
                }

                return migrated;
            } catch (e) {
                console.warn(
                    'Migration to v2.2 failed, using original data:',
                    e
                );
                return data;
            }
        },

        buildPaintedMapPacked: function() {
            if (state.paintedMap && state.imageData) {
                const data = this.packPaintedMapToBase64(
                    state.paintedMap,
                    state.imageData.width,
                    state.imageData.height
                );
                if (data) {
                    return {
                        width: state.imageData.width,
                        height: state.imageData.height,
                        data: data,
                    };
                }
            }
            return null;
        },

        buildProgressData: function() {
            return {
                timestamp: Date.now(),
                version: '2.2',
                state: {
                    totalPixels: state.totalPixels,
                    paintedPixels: state.paintedPixels,
                    lastPosition: state.lastPosition,
                    startPosition: state.startPosition,
                    region: state.region,
                    imageLoaded: state.imageLoaded,
                    colorsChecked: state.colorsChecked,
                    coordinateMode: state.coordinateMode,
                    coordinateDirection: state.coordinateDirection,
                    coordinateSnake: state.coordinateSnake,
                    blockWidth: state.blockWidth,
                    blockHeight: state.blockHeight,
                    availableColors: state.availableColors,
                },
                imageData: state.imageData
                    ? {
                          width: state.imageData.width,
                          height: state.imageData.height,
                          pixels: Array.from(state.imageData.pixels),
                          totalPixels: state.imageData.totalPixels,
                      }
                    : null,
                paintedMapPacked: this.buildPaintedMapPacked(),
            };
        },

        migrateProgress: function(saved) {
            if (!saved) return null;

            let data = saved;
            const ver = data.version;

            // If version is missing or ≤ 1.x → first migrate to v2
            if (!ver || ver === '1' || ver === '1.0' || ver === '1.1') {
                data = this.migrateProgressToV2(data);
            }

            // If still older than v2.1 → migrate to 2.1
            if (data.version === '2' || data.version === '2.0') {
                data = this.migrateProgressToV21(data);
            }

            // If still older than v2.2 → migrate to 2.2
            if (data.version === '2.1') {
                data = this.migrateProgressToV22(data);
            }

            // Now data is guaranteed to be the latest version
            return data;
        },

        saveProgress: function() {
            try {
                const progressData = this.buildProgressData(state);

                localStorage.setItem(
                    'wplace-bot-progress',
                    JSON.stringify(progressData)
                );
                return true;
            } catch (error) {
                console.error('Error saving progress:', error);
                return false;
            }
        },

        loadProgress: function() {
            try {
                const saved = localStorage.getItem('wplace-bot-progress');
                if (!saved) return null;
                let data = JSON.parse(saved);
                const migrated = this.migrateProgress(data);

                if (migrated && migrated !== data) {
                    try {
                        localStorage.setItem(
                            'wplace-bot-progress',
                            JSON.stringify(migrated)
                        );
                    } catch {}
                }
                return migrated;
            } catch (error) {
                console.error('Error loading progress:', error);
                return null;
            }
        },

        clearProgress: function() {
            try {
                localStorage.removeItem('wplace-bot-progress');
                // Also clear painted map from memory
                state.paintedMap = null;
                state._lastSavePixelCount = 0;
                state._lastSaveTime = 0;
                // Reset coordinate generation settings to their default values
                state.coordinateMode = CONFIG.COORDINATE_MODE;
                state.coordinateDirection = CONFIG.COORDINATE_DIRECTION;
                state.coordinateSnake = CONFIG.COORDINATE_SNAKE;
                state.blockWidth = CONFIG.COORDINATE_BLOCK_WIDTH;
                state.blockHeight = CONFIG.COORDINATE_BLOCK_HEIGHT;
                console.log('📋 Progress and painted map cleared');
                return true;
            } catch (error) {
                console.error('Error clearing progress:', error);
                return false;
            }
        },

        restoreProgress: function(savedData) {
            try {
                Object.assign(state, savedData.state);

                // Restore coordinate generation settings
                if (savedData.state.coordinateMode) {
                    state.coordinateMode = savedData.state.coordinateMode;
                }
                if (savedData.state.coordinateDirection) {
                    state.coordinateDirection =
                        savedData.state.coordinateDirection;
                }
                if (savedData.state.coordinateSnake !== undefined) {
                    state.coordinateSnake = savedData.state.coordinateSnake;
                }
                if (savedData.state.blockWidth) {
                    state.blockWidth = savedData.state.blockWidth;
                }
                if (savedData.state.blockHeight) {
                    state.blockHeight = savedData.state.blockHeight;
                }

                if (savedData.imageData) {
                    state.imageData = {
                        ...savedData.imageData,
                        pixels: new Uint8ClampedArray(
                            savedData.imageData.pixels
                        ),
                    };

                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = state.imageData.width;
                        canvas.height = state.imageData.height;
                        const ctx = canvas.getContext('2d');
                        const imageData = new ImageData(
                            state.imageData.pixels,
                            state.imageData.width,
                            state.imageData.height
                        );
                        ctx.putImageData(imageData, 0, 0);
                        const proc = new ImageProcessor('');
                        proc.img = canvas;
                        proc.canvas = canvas;
                        proc.ctx = ctx;
                        state.imageData.processor = proc;
                    } catch (e) {
                        console.warn(
                            'Could not rebuild processor from saved image data:',
                            e
                        );
                    }
                }

                // Prefer packed form if available; fallback to legacy paintedMap array for backward compatibility
                if (
                    savedData.paintedMapPacked &&
                    savedData.paintedMapPacked.data
                ) {
                    const { width, height, data } = savedData.paintedMapPacked;
                    state.paintedMap = this.unpackPaintedMapFromBase64(
                        data,
                        width,
                        height
                    );
                } else if (savedData.paintedMap) {
                    state.paintedMap = savedData.paintedMap.map(row =>
                        Array.from(row)
                    );
                }

                return true;
            } catch (error) {
                console.error('Error restoring progress:', error);
                return false;
            }
        },

        saveProgressToFile: function() {
            try {
                const progressData = this.buildProgressData();
                const filename = `wplace-bot-progress-${new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace(/:/g, '-')}.json`;
                this.createFileDownloader(
                    JSON.stringify(progressData, null, 2),
                    filename
                );
                return true;
            } catch (error) {
                console.error('Error saving to file:', error);
                return false;
            }
        },

        loadProgressFromFile: async function() {
            try {
                const data = await this.createFileUploader();
                if (!data || !data.state) {
                    throw new Error('Invalid file format');
                }
                const migrated = this.migrateProgress(data);

                const success = this.restoreProgress(migrated);
                return success;
            } catch (error) {
                console.error('Error loading from file:', error);
                throw error;
            }
        },

        // Helper function to restore overlay from loaded data
        restoreOverlayFromData: async function() {
            if (
                !state.imageLoaded ||
                !state.imageData ||
                !state.startPosition ||
                !state.region
            ) {
                return false;
            }

            try {
                // Recreate ImageBitmap from loaded pixel data
                const imageData = new ImageData(
                    state.imageData.pixels,
                    state.imageData.width,
                    state.imageData.height
                );

                const canvas = new OffscreenCanvas(
                    state.imageData.width,
                    state.imageData.height
                );
                const ctx = canvas.getContext('2d');
                ctx.putImageData(imageData, 0, 0);
                const imageBitmap = await canvas.transferToImageBitmap();

                // Set up overlay with restored data
                await this.overlayManager.setImage(imageBitmap);
                await this.overlayManager.setPosition(
                    state.startPosition,
                    state.region
                );
                this.overlayManager.enable();

                // Update overlay button state
                const toggleOverlayBtn =
                    document.getElementById('toggleOverlayBtn');
                if (toggleOverlayBtn) {
                    toggleOverlayBtn.disabled = false;
                    toggleOverlayBtn.classList.add('active');
                }

                console.log('Overlay restored from data');
                return true;
            } catch (error) {
                console.error('Failed to restore overlay from data:', error);
                return false;
            }
        },

        updateCoordinateUI: function({
            mode,
            directionControls,
            snakeControls,
            blockControls,
        }) {
            const isLinear = mode === 'rows' || mode === 'columns';
            const isBlock = mode === 'blocks' || mode === 'shuffle-blocks';

            if (directionControls)
                directionControls.style.display = isLinear ? 'block' : 'none';
            if (snakeControls)
                snakeControls.style.display = isLinear ? 'block' : 'none';
            if (blockControls)
                blockControls.style.display = isBlock ? 'block' : 'none';
        },
    };
    
    return Utils;
}