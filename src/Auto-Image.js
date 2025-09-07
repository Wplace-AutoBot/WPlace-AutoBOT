import { EMBEDDED_CSS } from 'embedded-assets';
import { CONFIG } from './core/config.js';
import {
    getCurrentTheme,
    switchTheme,
    applyTheme,
    loadThemePreference,
} from './core/theme.js';
import { initializeTranslations, t, setLanguage } from './core/translations.js';
import { TurnstileManager, TurnstileError } from './auth/index.js';
import { createState } from './core/state.js';
import { OverlayManager } from './core/OverlayManager.js';
import { createAutoImageUtils } from './core/utils.js';
import { ImageProcessor } from './core/ImageProcessor.js';
import { TokenManager } from './auth/TokenManager.js';

(async () => {
    // Initialize centralized state manager for Auto-Image
    const stateManager = createState();
    const { state, update, get } = stateManager;

    // Set initial config values
    state.cooldown = CONFIG.COOLDOWN_DEFAULT;
    state.paintingSpeed = CONFIG.PAINTING_SPEED.DEFAULT;
    state.batchMode = CONFIG.BATCH_MODE;
    state.randomBatchMin = CONFIG.RANDOM_BATCH_RANGE.MIN;
    state.randomBatchMax = CONFIG.RANDOM_BATCH_RANGE.MAX;
    state.cooldownChargeThreshold = CONFIG.COOLDOWN_CHARGE_THRESHOLD;
    state.tokenSource = CONFIG.TOKEN_SOURCE;
    state.overlayOpacity = CONFIG.OVERLAY.OPACITY_DEFAULT;
    state.blueMarbleEnabled = CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;
    state.customTransparencyThreshold = CONFIG.TRANSPARENCY_THRESHOLD;
    state.customWhiteThreshold = CONFIG.WHITE_THRESHOLD;
    state.paintUnavailablePixels = CONFIG.PAINT_UNAVAILABLE;
    state.coordinateMode = CONFIG.COORDINATE_MODE;
    state.coordinateDirection = CONFIG.COORDINATE_DIRECTION;
    state.coordinateSnake = CONFIG.COORDINATE_SNAKE;
    state.blockWidth = CONFIG.COORDINATE_BLOCK_WIDTH;
    state.blockHeight = CONFIG.COORDINATE_BLOCK_HEIGHT;
    state.notificationsEnabled = CONFIG.NOTIFICATIONS.ENABLED;
    state.notifyOnChargesReached = CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED;
    state.notifyOnlyWhenUnfocused = CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED;
    state.notificationIntervalMinutes = CONFIG.NOTIFICATIONS.REPEAT_MINUTES;

    let _updateResizePreview = () => {};
    let _resizeDialogCleanup = null;

    // OverlayManager will be instantiated after Utils is defined

    // Initialize Token Manager
    let tokenManager; // Will be initialized after Utils is created

    // Batch processing constants
    const MAX_BATCH_RETRIES = 10; // Maximum attempts for batch sending

    /**
     * Inject and execute a JavaScript function in the page context.
     * @param {Function} callback - The function to inject and execute
     */
    function inject(callback) {
        const script = document.createElement('script');
        script.textContent = `(${callback})();`;
        document.documentElement?.appendChild(script);
        script.remove();
    }

    inject(() => {
        const fetchedBlobQueue = new Map();

        window.addEventListener('message', event => {
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
                                `🔍✅ Turnstile Token Captured - Type: ${typeof payload.t}, Value: ${
                                    payload.t
                                        ? typeof payload.t === 'string'
                                            ? payload.t.length > 50
                                                ? payload.t.substring(0, 50) +
                                                  '...'
                                                : payload.t
                                            : JSON.stringify(payload.t)
                                        : 'null/undefined'
                                }, Length: ${payload.t?.length || 0}`
                            );
                            window.postMessage(
                                {
                                    source: 'turnstile-capture',
                                    token: payload.t,
                                },
                                '*'
                            );
                        }
                    } catch (_) {
                        /* ignore */
                    }
                }

                const contentType = response.headers.get('content-type') || '';
                if (contentType.includes('image/png') && url.includes('.png')) {
                    const cloned = response.clone();
                    return new Promise(async resolve => {
                        const blobUUID = crypto.randomUUID();
                        const originalBlob = await cloned.blob();

                        fetchedBlobQueue.set(blobUUID, processedBlob => {
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

    window.addEventListener('message', event => {
        const { source, endpoint, blobID, blobData, token } = event.data;

        if (source === 'auto-image-tile' && endpoint && blobID && blobData) {
            overlayManager.processAndRespondToTileRequest(event.data);
        }

        if (source === 'turnstile-capture' && token) {
            setTurnstileToken(token);
            if (
                document
                    .querySelector('#statusText')
                    ?.textContent.includes('CAPTCHA')
            ) {
                Utils.showAlert(Utils.t('tokenCapturedSuccess'), 'success');
                updateUI('colorsFound', 'success', {
                    count: state.availableColors.length,
                });
            }
        }
    });

    /**
     * Detect the user's language from the backend API or browser settings.
     * @returns {Promise<void>}
     */
    async function detectLanguage() {
        try {
            const response = await fetch('https://backend.wplace.live/me', {
                credentials: 'include',
            });
            const data = await response.json();
            state.language = data.language === 'pt' ? 'pt' : 'en';
        } catch {
            state.language = navigator.language.startsWith('pt') ? 'pt' : 'en';
        }
    }

    // Initialize color cache
    const colorCache = new Map();

    // Create Utils object with all dependencies
    const Utils = createAutoImageUtils(
        state,
        CONFIG,
        colorCache,
        () => tokenManager?.isTokenValid() || false,
        () => tokenManager?.getToken() || null,
        token => tokenManager?.setTurnstileToken(token),
        null
    );

    // Initialize TokenManager after Utils is defined
    tokenManager = new TokenManager(Utils);

    // Initialize OverlayManager after Utils is defined
    const overlayManager = new OverlayManager(state, CONFIG, Utils);

    // Set overlayManager reference in Utils
    Utils.overlayManager = overlayManager;

    // IMAGE PROCESSOR CLASS

    // WPLACE API SERVICE
    const WPlaceService = {
        async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
            try {
                await tokenManager.ensureToken();
                const token = tokenManager.getToken();
                if (!token) return 'token_error';
                const payload = {
                    coords: [pixelX, pixelY],
                    colors: [color],
                    t: token,
                };
                const res = await fetch(
                    `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                        credentials: 'include',
                        body: JSON.stringify(payload),
                    }
                );
                if (res.status === 403) {
                    console.error(
                        '❌ 403 Forbidden. Turnstile token might be invalid or expired.'
                    );
                    tokenManager.invalidateToken();
                    return 'token_error';
                }
                const data = await res.json();
                return data?.painted === 1;
            } catch (e) {
                console.error('Paint request failed:', e);
                return false;
            }
        },

        async getCharges() {
            const defaultResult = {
                charges: 0,
                max: 1,
                cooldown: CONFIG.COOLDOWN_DEFAULT,
            };

            try {
                const res = await fetch('https://backend.wplace.live/me', {
                    credentials: 'include',
                });

                if (!res.ok) {
                    console.error(`Failed to get charges: HTTP ${res.status}`);
                    return defaultResult;
                }

                const data = await res.json();

                return {
                    charges: data.charges?.count ?? 0,
                    max: data.charges?.max ?? 1,
                    cooldown:
                        data.charges?.cooldownMs ?? CONFIG.COOLDOWN_DEFAULT,
                };
            } catch (e) {
                console.error('Failed to get charges:', e);
                return defaultResult;
            }
        },
    };

    // Desktop Notification Manager
    const NotificationManager = {
        pollTimer: null,
        pollIntervalMs: 60_000,
        icon() {
            const link = document.querySelector("link[rel~='icon']");
            return link?.href || location.origin + '/favicon.ico';
        },
        async requestPermission() {
            if (!('Notification' in window)) {
                Utils.showAlert(
                    Utils.t('notificationsNotSupported'),
                    'warning'
                );
                return 'denied';
            }
            if (Notification.permission === 'granted') return 'granted';
            try {
                const perm = await Notification.requestPermission();
                return perm;
            } catch {
                return Notification.permission;
            }
        },
        canNotify() {
            return (
                state.notificationsEnabled &&
                typeof Notification !== 'undefined' &&
                Notification.permission === 'granted'
            );
        },
        notify(title, body, tag = 'wplace-charges', force = false) {
            if (!this.canNotify()) return false;
            if (!force && state.notifyOnlyWhenUnfocused && document.hasFocus())
                return false;
            try {
                new Notification(title, {
                    body,
                    tag,
                    renotify: true,
                    icon: this.icon(),
                    badge: this.icon(),
                    silent: false,
                });
                return true;
            } catch {
                // Graceful fallback
                Utils.showAlert(body, 'info');
                return false;
            }
        },
        resetEdgeTracking() {
            state._lastChargesBelow =
                state.displayCharges < state.cooldownChargeThreshold;
            state._lastChargesNotifyAt = 0;
        },
        maybeNotifyChargesReached(force = false) {
            if (!state.notificationsEnabled || !state.notifyOnChargesReached)
                return;
            const reached =
                state.displayCharges >= state.cooldownChargeThreshold;
            const now = Date.now();
            const repeatMs =
                Math.max(1, Number(state.notificationIntervalMinutes || 5)) *
                60_000;
            if (reached) {
                const shouldEdge = state._lastChargesBelow || force;
                const shouldRepeat =
                    now - (state._lastChargesNotifyAt || 0) >= repeatMs;
                if (shouldEdge || shouldRepeat) {
                    const msg = Utils.t('chargesReadyMessage', {
                        current: state.displayCharges,
                        max: state.maxCharges,
                        threshold: state.cooldownChargeThreshold,
                    });
                    this.notify(
                        Utils.t('chargesReadyNotification'),
                        msg,
                        'wplace-notify-charges'
                    );
                    state._lastChargesNotifyAt = now;
                }
                state._lastChargesBelow = false;
            } else {
                state._lastChargesBelow = true;
            }
        },
        startPolling() {
            this.stopPolling();
            if (!state.notificationsEnabled || !state.notifyOnChargesReached)
                return;
            // lightweight background polling
            this.pollTimer = setInterval(async () => {
                try {
                    const { charges, cooldown, max } =
                        await WPlaceService.getCharges();
                    state.displayCharges = Math.floor(charges);
                    state.cooldown = cooldown;
                    state.maxCharges = Math.max(1, Math.floor(max));
                    this.maybeNotifyChargesReached();
                } catch {
                    /* ignore */
                }
            }, this.pollIntervalMs);
        },
        stopPolling() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer);
                this.pollTimer = null;
            }
        },
        syncFromState() {
            this.resetEdgeTracking();
            if (state.notificationsEnabled && state.notifyOnChargesReached)
                this.startPolling();
            else this.stopPolling();
        },
    };

    // COLOR MATCHING FUNCTION - Optimized with caching
    // (colorCache already initialized above)

    // UI UPDATE FUNCTIONS (declared early to avoid reference errors)
    let updateUI = () => {};
    let updateStats = isManualRefresh => {};
    let updateDataButtons = () => {};

    /**
     * Update the active color palette based on user selections.
     * Filters available colors to only include selected ones.
     */
    function updateActiveColorPalette() {
        state.activeColorPalette = [];
        const activeSwatches = document.querySelectorAll(
            '.wplace-color-swatch.active'
        );
        if (activeSwatches) {
            activeSwatches.forEach(swatch => {
                const rgbStr = swatch.getAttribute('data-rgb');
                if (rgbStr) {
                    const rgb = rgbStr.split(',').map(Number);
                    state.activeColorPalette.push(rgb);
                }
            });
        }
        if (
            document.querySelector('.resize-container')?.style.display ===
            'block'
        ) {
            _updateResizePreview();
        }
    }

    /**
     * Toggle selection of all colors in the palette.
     * @param {boolean} select - Whether to select (true) or deselect (false) all colors
     * @param {boolean} [showingUnavailable=false] - Whether unavailable colors are currently shown
     */
    function toggleAllColors(select, showingUnavailable = false) {
        const swatches = document.querySelectorAll('.wplace-color-swatch');
        if (swatches) {
            swatches.forEach(swatch => {
                // Only toggle colors that are available or if we're showing unavailable colors
                const isUnavailable = swatch.classList.contains('unavailable');
                if (!isUnavailable || showingUnavailable) {
                    // Don't try to select unavailable colors
                    if (!isUnavailable) {
                        swatch.classList.toggle('active', select);
                    }
                }
            });
        }
        updateActiveColorPalette();
    }

    /**
     * Deselect all paid colors from the active palette.
     * Keeps only free colors selected.
     */
    function unselectAllPaidColors() {
        const swatches = document.querySelectorAll('.wplace-color-swatch');
        if (swatches) {
            swatches.forEach(swatch => {
                const colorId = parseInt(
                    swatch.getAttribute('data-color-id'),
                    10
                );
                if (!isNaN(colorId) && colorId >= 32) {
                    swatch.classList.toggle('active', false);
                }
            });
        }
        updateActiveColorPalette();
    }

    /**
     * Initialize the color palette UI within a container element.
     * @param {HTMLElement} container - The container element to populate with color options
     */
    function initializeColorPalette(container) {
        const colorsContainer = container.querySelector('#colors-container');
        const showAllToggle = container.querySelector('#showAllColorsToggle');
        if (!colorsContainer) return;

        // Use already captured colors from state (captured during upload)
        // Don't re-fetch colors here, use what was captured when user clicked upload
        if (!state.availableColors || state.availableColors.length === 0) {
            // If no colors have been captured yet, show message
            colorsContainer.innerHTML = `<div class="wplace-colors-placeholder">${Utils.t(
                'uploadImageFirst'
            )}</div>`;
            return;
        }

        function populateColors(showUnavailable = false) {
            colorsContainer.innerHTML = '';
            let availableCount = 0;
            let totalCount = 0;

            // Convert COLOR_MAP to array and filter out transparent
            const allColors = Object.values(CONFIG.COLOR_MAP).filter(
                color => color.rgb !== null
            );

            allColors.forEach(colorData => {
                const { id, name, rgb } = colorData;
                const rgbKey = `${rgb.r},${rgb.g},${rgb.b}`;
                totalCount++;

                // Check if this color is available in the captured colors
                const isAvailable = state.availableColors.some(
                    c =>
                        c.rgb[0] === rgb.r &&
                        c.rgb[1] === rgb.g &&
                        c.rgb[2] === rgb.b
                );

                // If not showing all colors and this color is not available, skip it
                if (!showUnavailable && !isAvailable) {
                    return;
                }

                if (isAvailable) availableCount++;

                const colorItem = Utils.createElement('div', {
                    className: 'wplace-color-item',
                });
                const swatch = Utils.createElement('button', {
                    className: `wplace-color-swatch ${!isAvailable ? 'unavailable' : ''}`,
                    title: `${name} (ID: ${id})${!isAvailable ? ' (Unavailable)' : ''}`,
                    'data-rgb': rgbKey,
                    'data-color-id': id,
                });
                swatch.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

                // Make unavailable colors visually distinct
                if (!isAvailable) {
                    swatch.style.opacity = '0.4';
                    swatch.style.filter = 'grayscale(50%)';
                    swatch.disabled = true;
                } else {
                    // Select available colors by default
                    swatch.classList.add('active');
                }

                const nameLabel = Utils.createElement(
                    'span',
                    {
                        className: 'wplace-color-item-name',
                        style: !isAvailable
                            ? 'color: #888; font-style: italic;'
                            : '',
                    },
                    name + (!isAvailable ? ' (N/A)' : '')
                );

                // Only add click listener for available colors
                if (isAvailable) {
                    swatch.addEventListener('click', () => {
                        swatch.classList.toggle('active');
                        updateActiveColorPalette();
                    });
                }

                colorItem.appendChild(swatch);
                colorItem.appendChild(nameLabel);
                colorsContainer.appendChild(colorItem);
            });

            updateActiveColorPalette();
        }

        // Initialize with only available colors
        populateColors(false);

        // Add toggle functionality
        if (showAllToggle) {
            showAllToggle.addEventListener('change', e => {
                populateColors(e.target.checked);
            });
        }

        container
            .querySelector('#selectAllBtn')
            ?.addEventListener('click', () =>
                toggleAllColors(true, showAllToggle?.checked)
            );
        container
            .querySelector('#unselectAllBtn')
            ?.addEventListener('click', () =>
                toggleAllColors(false, showAllToggle?.checked)
            );
        container
            .querySelector('#unselectPaidBtn')
            ?.addEventListener('click', () => unselectAllPaidColors());
    }

    /**
     * Handle CAPTCHA generation and validation process.
     * @returns {Promise<void>}
     */
    // Token management functions moved to TokenManager class

    /**
     * Create and initialize the main user interface.
     * Sets up the control panel, overlays, event handlers, and theme application.
     * @returns {Promise<void>}
     */
    async function createUI() {
        await detectLanguage();

        const existingContainer = document.getElementById(
            'wplace-image-bot-container'
        );
        const existingStats = document.getElementById('wplace-stats-container');
        const existingSettings = document.getElementById(
            'wplace-settings-container'
        );
        const existingResizeContainer =
            document.querySelector('.resize-container');
        const existingResizeOverlay = document.querySelector('.resize-overlay');

        if (existingContainer) existingContainer.remove();
        if (existingStats) existingStats.remove();
        if (existingSettings) existingSettings.remove();
        if (existingResizeContainer) existingResizeContainer.remove();
        if (existingResizeOverlay) existingResizeOverlay.remove();

        loadThemePreference();
        await initializeTranslations(state);

        const theme = getCurrentTheme();
        applyTheme(); // <- new: set CSS vars and theme class before building UI

        function appendLinkOnce(href, attributes = {}) {
            // Check if a link with the same href already exists in the document head
            const exists = Array.from(
                document.head.querySelectorAll('link')
            ).some(link => link.href === href);
            if (exists) return;

            // Create a new link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            // Add any additional attributes (e.g., data-* attributes)
            for (const [key, value] of Object.entries(attributes)) {
                link.setAttribute(key, value);
            }

            // Append the link element to the document head
            document.head.appendChild(link);
        }

        appendLinkOnce(
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        );

        if (theme.fontFamily.includes('Press Start 2P')) {
            appendLinkOnce(
                'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
            );
        }

        // Inject embedded CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = EMBEDDED_CSS;
        styleElement.setAttribute('data-wplace-theme', 'true');
        document.head.appendChild(styleElement);

        // Check for development mode
        const isDevMode = localStorage.getItem('dev-mode') === 'true';

        // Generate dev info header if in development mode
        const devInfoHeader = isDevMode
            ? `
      <div class="wplace-dev-info" style="
        font-size: 11px; 
        color: #888; 
        padding: 2px 8px; 
        background: rgba(0,0,0,0.1); 
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-family: 'Courier New', monospace;
      ">
        Build: __BUILD_DATE__ | Target: __BUILD_TARGET__ <br />
        Commit: __COMMIT_HASH__ | Branch: __BRANCH_NAME__ <br />
        Git: <span style="color: __GIT_STATUS_COLOR__;">__GIT_STATUS__</span> | Env: <span style="color: __ENVIRONMENT_COLOR__;">__ENVIRONMENT__</span> <br />
        Last: __LAST_COMMIT_MESSAGE__ <br />
        Node: __NODE_VERSION__
      </div>
    `
            : '';

        const container = document.createElement('div');
        container.id = 'wplace-image-bot-container';
        container.innerHTML = `
      ${devInfoHeader}
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t('title')}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t('settings')}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="${Utils.t('showStats')}">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="${Utils.t('compactMode')}">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t('minimize')}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${Utils.t('initMessage')}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🖼️ Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled title="${Utils.t(
                  'waitingSetupComplete'
              )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t('uploadImage')}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${Utils.t('resizeImage')}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${Utils.t('selectPosition')}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Control Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🎮 Painting Control</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="startBtn" class="wplace-btn wplace-btn-start" disabled>
                <i class="fas fa-play"></i>
                <span>${Utils.t('startPainting')}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${Utils.t('stopPainting')}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${Utils.t('toggleOverlay')}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">⏱️ ${Utils.t('cooldownSettings')}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${Utils.t('waitCharges')}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${state.cooldownChargeThreshold}">
                    <div class="wplace-cooldown-controls">
                        <div class="wplace-cooldown-input-group">
                            <button id="cooldownDecrease" class="wplace-input-btn wplace-input-btn-small" type="button">-</button>
                            <input type="number" id="cooldownInput" class="wplace-cooldown-input" min="1" max="999" value="${state.cooldownChargeThreshold}">
                            <button id="cooldownIncrease" class="wplace-input-btn wplace-input-btn-small" type="button">+</button>
                        </div>
                        <span class="wplace-cooldown-unit">Charges</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">💾 Data Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="saveBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-save"></i>
                <span>${Utils.t('saveData')}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary" disabled title="${Utils.t(
                  'waitingTokenGenerator'
              )}">
                <i class="fas fa-folder-open"></i>
                <span>${Utils.t('loadData')}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${Utils.t('saveToFile')}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file" disabled title="${Utils.t(
                  'waitingTokenGenerator'
              )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t('loadFromFile')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Stats Window - Separate UI
        const statsContainer = document.createElement('div');
        statsContainer.id = 'wplace-stats-container';
        statsContainer.style.display = 'none';
        statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>${Utils.t('paintingStats')}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="${Utils.t(
              'refreshCharges'
          )}">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="${Utils.t('closeStats')}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t(
                  'initMessage'
              )}</div>
            </div>
          </div>
        </div>
      </div>
    `;

        // Modern Settings Container with Theme Support
        // Use the theme variable already declared at the top of createUI function
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'wplace-settings-container';

        // Apply theme-based styling
        const themeBackground = theme.primary
            ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary || theme.primary} 100%)`
            : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;

        settingsContainer.className =
            'wplace-settings-container-base wplace-settings-container-themed';

        // Apply theme-specific background and CSS custom properties
        settingsContainer.style.background = themeBackground;
        settingsContainer.style.setProperty(
            '--theme-text',
            theme.text || 'white'
        );
        settingsContainer.style.setProperty(
            '--theme-font-family',
            theme.fontFamily ||
                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        );
        settingsContainer.style.setProperty(
            '--theme-box-shadow',
            theme.boxShadow ||
                '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
        );
        settingsContainer.style.setProperty(
            '--theme-backdrop-filter',
            theme.backdropFilter || 'blur(10px)'
        );
        settingsContainer.style.setProperty(
            '--theme-highlight',
            theme.highlight || '#48dbfb'
        );

        // Add glow effect class if theme supports it
        if (theme.animations?.glow) {
            settingsContainer.classList.add('glow-effect');
            settingsContainer.style.setProperty(
                '--theme-glow-color',
                theme.highlight || theme.neon || '#00ffff'
            );
        }

        // noinspection CssInvalidFunction
        settingsContainer.innerHTML = `
      <div class="wplace-settings-header">
        <div class="wplace-settings-title-wrapper">
          <h3 class="wplace-settings-title">
            <i class="fas fa-cog wplace-settings-icon"></i>
            ${Utils.t('settings')}
          </h3>
          <button id="closeSettingsBtn" class="wplace-settings-close-btn">✕</button>
        </div>
      </div>

      <div class="wplace-settings-content">
        
        <!-- Token Source Selection -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-key wplace-icon-key"></i>
            Token Source
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="tokenSourceSelect" class="wplace-settings-select">
              <option value="generator" ${
                  state.tokenSource === 'generator' ? 'selected' : ''
              } class="wplace-settings-option">🤖 Automatic Token Generator (Recommended)</option>
              <option value="hybrid" ${
                  state.tokenSource === 'hybrid' ? 'selected' : ''
              } class="wplace-settings-option">🔄 Generator + Auto Fallback</option>
              <option value="manual" ${
                  state.tokenSource === 'manual' ? 'selected' : ''
              } class="wplace-settings-option">🎯 Manual Pixel Placement</option>
            </select>
            <p class="wplace-settings-description">
              Generator mode creates tokens automatically. Hybrid mode falls back to manual when generator fails. Manual mode only uses pixel placement.
            </p>
          </div>
        </div>

        <!-- Automation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-robot wplace-icon-robot"></i>
            ${Utils.t('automation')}
          </label>
          <!-- Token generator is always enabled - settings moved to Token Source above -->
        </div>

        <!-- Overlay Settings Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-eye wplace-icon-eye"></i>
            Overlay Settings
          </label>
          <div class="wplace-settings-section-wrapper wplace-overlay-wrapper" style="
            background: ${theme.accent ? `${theme.accent}20` : 'rgba(255,255,255,0.1)'}; 
            border-radius: ${theme.borderRadius || '12px'}; 
            padding: 18px; 
            border: 1px solid ${theme.accent || 'rgba(255,255,255,0.1)'};
            ${
                theme.animations?.glow
                    ? `
              box-shadow: 0 0 15px ${theme.accent || 'rgba(255,255,255,0.1)'}33;
            `
                    : ''
            }
          ">
              <!-- Opacity Slider -->
              <div class="wplace-overlay-opacity-control">
                <div class="wplace-overlay-opacity-header">
                   <span class="wplace-overlay-opacity-label" style="color: ${
                       theme.text || 'white'
                   };">Overlay Opacity</span>
                   <div id="overlayOpacityValue" class="wplace-overlay-opacity-value" style="
                     background: ${theme.secondary || 'rgba(0,0,0,0.2)'}; 
                     color: ${theme.text || 'white'};
                     padding: 4px 8px; 
                     border-radius: ${theme.borderRadius === '0' ? '0' : '6px'}; 
                     font-size: 12px;
                     border: 1px solid ${theme.accent || 'transparent'};
                   ">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${state.overlayOpacity}" class="wplace-overlay-opacity-slider" style="
                  background: linear-gradient(to right, ${
                      theme.highlight || '#48dbfb'
                  } 0%, ${theme.purple || theme.neon || '#d3a4ff'} 100%); 
                  border-radius: ${theme.borderRadius === '0' ? '0' : '4px'}; 
                ">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" class="wplace-settings-toggle">
                  <div>
                      <span class="wplace-settings-toggle-title" style="color: ${
                          theme.text || 'white'
                      };">Blue Marble Effect</span>
                      <p class="wplace-settings-toggle-description" style="color: ${
                          theme.text
                              ? `${theme.text}BB`
                              : 'rgba(255,255,255,0.7)'
                      };">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${
                      state.blueMarbleEnabled ? 'checked' : ''
                  } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
              </label>
          </div>
        </div>

        <!-- Paint Options Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-paint-brush wplace-icon-paint"></i>
            ${Utils.t('paintOptions')}
          </label>
          <!-- Pixel Filter Toggles -->
          <div id="pixelFilterControls" class="wplace-settings-section-wrapper wplace-pixel-filter-controls">
            <!-- Paint White Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" >
                  ${Utils.t('paintWhitePixels')}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${
                    theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
                };">
                  ${Utils.t('paintWhitePixelsDescription')}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintWhiteToggle" ${state.paintWhitePixels ? 'checked' : ''} 
                class="wplace-settings-checkbox"
                />
            </label>
            
            <!-- Paint Transparent Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" >
                  ${Utils.t('paintTransparentPixels')}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${
                    theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
                };">
                  ${Utils.t('paintTransparentPixelsDescription')}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintTransparentToggle" ${state.paintTransparentPixels ? 'checked' : ''} 
                class="wplace-settings-checkbox"
                />
            </label>
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${
                    theme.text || 'white'
                };">${Utils.t('paintUnavailablePixels')}</span>
                <p class="wplace-settings-toggle-description" style="color: ${
                    theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
                };">${Utils.t('paintUnavailablePixelsDescription')}</p>
              </div>
              <input type="checkbox" id="paintUnavailablePixelsToggle" ${
                  state.paintUnavailablePixels ? 'checked' : ''
              } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
            </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-tachometer-alt wplace-icon-speed"></i>
            ${Utils.t('paintingSpeed')}
          </label>
          
          <!-- Batch Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-dice wplace-icon-dice"></i>
              Batch Mode
            </label>
            <select id="batchModeSelect" class="wplace-settings-select">
              <option value="normal" class="wplace-settings-option">📦 Normal (Fixed Size)</option>
              <option value="random" class="wplace-settings-option">🎲 Random (Range)</option>
            </select>
          </div>
          
          <!-- Normal Mode: Fixed Size Slider -->
          <div id="normalBatchControls" class="wplace-batch-controls wplace-normal-batch-controls">
            <div class="wplace-speed-slider-container">
              <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}" class="wplace-speed-slider">
              <div class="wplace-speed-labels">
                <span class="wplace-speed-min">🐢 ${CONFIG.PAINTING_SPEED.MIN}</span>
                <span class="wplace-speed-max">${CONFIG.PAINTING_SPEED.MAX} 🐇</span>
              </div>
              <div class="wplace-speed-controls">
                <div class="wplace-speed-input-group">
                  <button id="speedDecrease" class="wplace-input-btn wplace-input-btn-small" type="button">-</button>
                  <input type="number" id="speedInput" class="wplace-speed-input" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}">
                  <button id="speedIncrease" class="wplace-input-btn wplace-input-btn-small" type="button">+</button>
                </div>
                <span class="wplace-speed-unit">pixels</span>
              </div>
            </div>
          </div>
          
          <!-- Random Mode: Range Controls -->
          <div id="randomBatchControls" class="wplace-batch-controls wplace-random-batch-controls">
            <div class="wplace-random-batch-grid">
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-down wplace-icon-min"></i>
                  Minimum Batch Size
                </label>
                <input type="number" id="randomBatchMin" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MIN}" class="wplace-settings-number-input">
              </div>
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-up wplace-icon-max"></i>
                  Maximum Batch Size
                </label>
                <input type="number" id="randomBatchMax" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MAX}" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-random-batch-description">
              🎲 Random batch size between min and max values
            </p>
          </div>
          
          <!-- Speed Control Toggle -->
          <label class="wplace-speed-control-toggle">
            <input type="checkbox" id="enableSpeedToggle" ${
                CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''
            } class="wplace-speed-checkbox"/>
            <span>${Utils.t('enablePaintingSpeedLimit')}</span>
          </label>
        </div>
        
        <!-- Coordinate Generation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-route wplace-icon-route"></i>
            Coordinate Generation
          </label>
          
          <!-- Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-th wplace-icon-table"></i>
              Generation Mode
            </label>
            <select id="coordinateModeSelect" class="wplace-settings-select">
              <option value="rows" class="wplace-settings-option">📏 Rows (Horizontal Lines)</option>
              <option value="columns" class="wplace-settings-option">📐 Columns (Vertical Lines)</option>
              <option value="circle-out" class="wplace-settings-option">⭕ Circle Out (Center → Edges)</option>
              <option value="circle-in" class="wplace-settings-option">⭕ Circle In (Edges → Center)</option>
              <option value="blocks" class="wplace-settings-option">🟫 Blocks (Ordered)</option>
              <option value="shuffle-blocks" class="wplace-settings-option">🎲 Shuffle Blocks (Random)</option>
            </select>
          </div>
          
          <!-- Direction Selection (only for rows/columns) -->
          <div id="directionControls" class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-compass wplace-icon-compass"></i>
              Starting Direction
            </label>
            <select id="coordinateDirectionSelect" class="wplace-settings-select">
              <option value="top-left" class="wplace-settings-option">↖️ Top-Left</option>
              <option value="top-right" class="wplace-settings-option">↗️ Top-Right</option>
              <option value="bottom-left" class="wplace-settings-option">↙️ Bottom-Left</option>
              <option value="bottom-right" class="wplace-settings-option">↘️ Bottom-Right</option>
            </select>
          </div>
          
          <!-- Snake Pattern Toggle (only for rows/columns) -->
          <div id="snakeControls" class="wplace-snake-pattern-controls wplace-settings-section-wrapper">
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${
                    theme.text || 'white'
                };">Snake Pattern</span>
                <p class="wplace-settings-toggle-description" style="color: ${
                    theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
                };">Alternate direction for each row/column (zigzag pattern)</p>
              </div>
              <input type="checkbox" id="coordinateSnakeToggle" ${
                  state.coordinateSnake ? 'checked' : ''
              } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
            </label>
          </div>
          
          <!-- Block Size Controls (only for blocks/shuffle-blocks) -->
          <div id="blockControls" class="wplace-block-size-controls wplace-settings-section-wrapper wplace-shuffle-block-size-controls">
            <div class="wplace-block-size-grid">
              <div>
                <label class="wplace-block-size-label">
                  <i class="fas fa-arrows-alt-h wplace-icon-width"></i>
                  Block Width
                </label>
                <input type="number" id="blockWidthInput" min="1" max="50" value="6" class="wplace-settings-number-input">
              </div>
              <div>
                <label style="display: block; color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 8px;">
                  <i class="fas fa-arrows-alt-v wplace-icon-height"></i>
                  Block Height
                </label>
                <input type="number" id="blockHeightInput" min="1" max="50" value="2" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-block-size-description">
              🧱 Block dimensions for block-based generation modes
            </p>
          </div>
        </div>
        
        <!-- Notifications Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-bell wplace-icon-bell"></i>
            Desktop Notifications
          </label>
          <div class="wplace-settings-section-wrapper wplace-notifications-wrapper">
            <label class="wplace-notification-toggle">
              <span>${Utils.t('enableNotifications')}</span>
              <input type="checkbox" id="notifEnabledToggle" ${
                  state.notificationsEnabled ? 'checked' : ''
              } class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t('notifyOnChargesThreshold')}</span>
              <input type="checkbox" id="notifOnChargesToggle" ${
                  state.notifyOnChargesReached ? 'checked' : ''
              } class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t('onlyWhenNotFocused')}</span>
              <input type="checkbox" id="notifOnlyUnfocusedToggle" ${
                  state.notifyOnlyWhenUnfocused ? 'checked' : ''
              } class="wplace-notification-checkbox" />
            </label>
            <div class="wplace-notification-interval">
              <span>${Utils.t('repeatEvery')}</span>
              <input type="number" id="notifIntervalInput" min="1" max="60" value="${state.notificationIntervalMinutes}" class="wplace-notification-interval-input" />
              <span>${Utils.t('minutesPl')}</span>
            </div>
            <div class="wplace-notification-buttons">
              <button id="notifRequestPermBtn" class="wplace-btn wplace-btn-secondary wplace-notification-perm-btn"><i class="fas fa-unlock"></i><span>${Utils.t(
                  'grantPermission'
              )}</span></button>
              <button id="notifTestBtn" class="wplace-btn wplace-notification-test-btn"><i class="fas fa-bell"></i><span>${Utils.t(
                  'test'
              )}</span></button>
            </div>
          </div>
        </div>

        <!-- Theme Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-palette wplace-icon-palette"></i>
            ${Utils.t('themeSettings')}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="themeSelect" class="wplace-settings-select">
              ${Object.keys(CONFIG.THEMES)
                  .map(
                      themeName =>
                          `<option value="${themeName}" ${
                              CONFIG.currentTheme === themeName
                                  ? 'selected'
                                  : ''
                          } class="wplace-settings-option">${themeName}</option>`
                  )
                  .join('')}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-globe wplace-icon-globe"></i>
            ${Utils.t('language')}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="languageSelect" class="wplace-settings-select">
              <option value="vi" ${state.language === 'vi' ? 'selected' : ''} class="wplace-settings-option">🇻🇳 Tiếng Việt</option>
              <option value="id" ${state.language === 'id' ? 'selected' : ''} class="wplace-settings-option">🇮🇩 Bahasa Indonesia</option>
              <option value="ru" ${state.language === 'ru' ? 'selected' : ''} class="wplace-settings-option">🇷🇺 Русский</option>
              <option value="uk" ${state.language === 'uk' ? 'selected' : ''} class="wplace-settings-option">🇺🇦 Українська</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''} class="wplace-settings-option">🇺🇸 English</option>
              <option value="pt" ${state.language === 'pt' ? 'selected' : ''} class="wplace-settings-option">🇧🇷 Português</option>
              <option value="fr" ${state.language === 'fr' ? 'selected' : ''} class="wplace-settings-option">🇫🇷 Français</option>
              <option value="tr" ${state.language === 'tr' ? 'selected' : ''} class="wplace-settings-option">🇹🇷 Türkçe</option>
              <option value="zh-CN" ${state.language === 'zh-CN' ? 'selected' : ''} class="wplace-settings-option">🇨🇳 简体中文</option>
              <option value="zh-TW" ${state.language === 'zh-TW' ? 'selected' : ''} class="wplace-settings-option">🇹🇼 繁體中文</option>
              <option value="ja" ${state.language === 'ja' ? 'selected' : ''} class="wplace-settings-option">🇯🇵 日本語</option>
              <option value="ko" ${state.language === 'ko' ? 'selected' : ''} class="wplace-settings-option">🇰🇷 한국어</option>
              </select>
          </div>
        </div>
      </div>

        <div class="wplace-settings-footer">
             <button id="applySettingsBtn" class="wplace-settings-apply-btn">
                 <i class="fas fa-check"></i> ${Utils.t('applySettings')}
          </button>
        </div>
    `;

        const resizeContainer = document.createElement('div');
        resizeContainer.className = 'resize-container';
        resizeContainer.innerHTML = `
      <h3 class="resize-dialog-title">${Utils.t('resizeImage')}</h3>
      <div class="resize-controls">
        <label class="resize-control-label">
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label class="resize-control-label">
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label class="resize-checkbox-label">
          <input type="checkbox" id="keepAspect" checked>
          ${Utils.t('keepAspectRatio')}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintWhiteToggle" checked>
            ${Utils.t('paintWhitePixels')}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintTransparentToggle" checked>
            ${Utils.t('paintTransparentPixels')}
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
              'zoomOut'
          )}"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider resize-zoom-slider" min="0.1" max="20" value="1" step="0.05">
          <button id="zoomInBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
              'zoomIn'
          )}"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
              'fitToView'
          )}">${Utils.t('fit')}</button>
          <button id="zoomActualBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
              'actualSize'
          )}">${Utils.t('hundred')}</button>
          <button id="panModeBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t('panMode')}">
            <i class="fas fa-hand-paper"></i>
          </button>
          <span id="zoomValue" class="resize-zoom-value">100%</span>
          <div id="cameraHelp" class="resize-camera-help">
            Drag to pan • Pinch to zoom • Double‑tap to zoom
          </div>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <div id="resizePanStage" class="resize-pan-stage">
            <div id="resizeCanvasStack" class="resize-canvas-stack resize-canvas-positioned">
              <canvas id="resizeCanvas" class="resize-base-canvas"></canvas>
              <canvas id="maskCanvas" class="resize-mask-canvas"></canvas>
            </div>
          </div>
      </div>
      <div class="resize-tools">
        <div class="resize-tools-container">
          <div class="resize-brush-controls">
              <div class="resize-brush-control">
                <label class="resize-tool-label">Brush</label>
                <div class="resize-tool-input-group">
                  <input id="maskBrushSize" type="range" min="1" max="7" step="1" value="1" class="resize-tool-slider">
                  <span id="maskBrushSizeValue" class="resize-tool-value">1</span>
                </div>
              </div>
            <div class="resize-brush-control">
              <label class="resize-tool-label">Row/col size</label>
              <div class="resize-tool-input-group">
                <input id="rowColSize" type="range" min="1" max="7" step="1" value="1" class="resize-tool-slider">
                <span id="rowColSizeValue" class="resize-tool-value">1</span>
              </div>
            </div>
          </div>
          <div class="resize-mode-controls">
            <label class="resize-tool-label">Mode</label>
            <div class="mask-mode-group resize-mode-group">
              <button id="maskModeIgnore" class="wplace-btn resize-mode-btn">Ignore</button>
              <button id="maskModeUnignore" class="wplace-btn resize-mode-btn">Unignore</button>
              <button id="maskModeToggle" class="wplace-btn wplace-btn-primary resize-mode-btn">Toggle</button>
            </div>
          </div>
          <button id="clearIgnoredBtn" class="wplace-btn resize-clear-btn" title="Clear all ignored pixels">Clear</button>
          <button id="invertMaskBtn" class="wplace-btn resize-invert-btn" title="Invert mask">Invert</button>
          <span class="resize-shortcut-help">Shift = Row • Alt = Column</span>
        </div>
      </div>

      <div class="wplace-section resize-color-palette-section" id="color-palette-section">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label class="resize-color-toggle-label">
                      <input type="checkbox" id="showAllColorsToggle" class="resize-color-checkbox">
                      <span>${Utils.t('showAllColorsIncluding')}</span>
                  </label>
              </div>
              <div class="wplace-row" style="display: flex;">
                  <button id="selectAllBtn" class="wplace-btn" style="flex: 1;">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn" style="flex: 1;">Unselect All</button>
                  <button id="unselectPaidBtn" class="wplace-btn">Unselect Paid</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="wplace-section resize-advanced-color-section" id="advanced-color-section">
        <div class="wplace-section-title">
          <i class="fas fa-flask"></i>&nbsp;Advanced Color Matching
        </div>
        <div class="resize-advanced-controls">
          <label class="resize-advanced-label">
            <span class="resize-advanced-label-text">Algorithm</span>
            <select id="colorAlgorithmSelect" class="resize-advanced-select">
              <option value="lab" ${
                  state.colorMatchingAlgorithm === 'lab' ? 'selected' : ''
              }>Perceptual (Lab)</option>
            <option value="legacy" ${
                state.colorMatchingAlgorithm === 'legacy' ? 'selected' : ''
            }>Legacy (RGB)</option>
            </select>
          </label>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Chroma Penalty</span>
              <div class="resize-advanced-description">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${
                state.enableChromaPenalty ? 'checked' : ''
            } class="resize-advanced-checkbox" />
          </label>
          <div class="resize-chroma-weight-control">
            <div class="resize-chroma-weight-header">
              <span>${Utils.t('chromaWeight')}</span>
              <span id="chromaWeightValue" class="resize-chroma-weight-value">${state.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="0" max="0.5" step="0.01" value="${state.chromaPenaltyWeight}" class="resize-chroma-weight-slider" />
          </div>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Enable Dithering</span>
              <div class="resize-advanced-description">Floyd–Steinberg error diffusion in preview and applied output</div>
            </div>
            <input type="checkbox" id="enableDitheringToggle" ${
                state.ditheringEnabled ? 'checked' : ''
            } class="resize-advanced-checkbox" />
          </label>
          <div class="resize-threshold-controls">
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${state.customTransparencyThreshold}" class="resize-threshold-input" />
            </label>
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${state.customWhiteThreshold}" class="resize-threshold-input" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn resize-reset-advanced-btn">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>${Utils.t('downloadPreview')}</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>${Utils.t('apply')}</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>${Utils.t('cancel')}</span>
        </button>
      </div>
    `;

        const resizeOverlay = document.createElement('div');
        resizeOverlay.className = 'resize-overlay';

        document.body.appendChild(container);
        document.body.appendChild(resizeOverlay);
        document.body.appendChild(resizeContainer);
        document.body.appendChild(statsContainer);
        document.body.appendChild(settingsContainer);

        // Show the main container after all elements are appended
        container.style.display = 'block';

        const uploadBtn = container.querySelector('#uploadBtn');
        const resizeBtn = container.querySelector('#resizeBtn');
        const selectPosBtn = container.querySelector('#selectPosBtn');
        const startBtn = container.querySelector('#startBtn');
        const stopBtn = container.querySelector('#stopBtn');
        const saveBtn = container.querySelector('#saveBtn');
        const loadBtn = container.querySelector('#loadBtn');
        const saveToFileBtn = container.querySelector('#saveToFileBtn');
        const loadFromFileBtn = container.querySelector('#loadFromFileBtn');

        container.querySelectorAll('.wplace-section-title').forEach(title => {
            // Add a right-side arrow if it doesn't exist
            if (!title.querySelector('i.arrow')) {
                const arrow = document.createElement('i');
                arrow.className = 'fas fa-chevron-down arrow'; // FontAwesome down arrow
                title.appendChild(arrow);
            }

            // Click event to toggle collapse/expand of the section
            title.addEventListener('click', () => {
                const section = title.parentElement;
                section.classList.toggle('collapsed');
            });
        });

        // Disable load/upload buttons until initial setup is complete (startup only)
        if (loadBtn) {
            loadBtn.disabled = !state.initialSetupComplete;
            loadBtn.title = state.initialSetupComplete
                ? ''
                : '🔄 Waiting for initial setup to complete...';
        }
        if (loadFromFileBtn) {
            loadFromFileBtn.disabled = !state.initialSetupComplete;
            loadFromFileBtn.title = state.initialSetupComplete
                ? ''
                : '🔄 Waiting for initial setup to complete...';
        }
        if (uploadBtn) {
            uploadBtn.disabled = !state.initialSetupComplete;
            uploadBtn.title = state.initialSetupComplete
                ? ''
                : '🔄 Waiting for initial setup to complete...';
        }

        const minimizeBtn = container.querySelector('#minimizeBtn');
        const compactBtn = container.querySelector('#compactBtn');
        const statsBtn = container.querySelector('#statsBtn');
        const toggleOverlayBtn = container.querySelector('#toggleOverlayBtn');
        const statusText = container.querySelector('#statusText');
        const progressBar = container.querySelector('#progressBar');
        const statsArea = statsContainer.querySelector('#statsArea');
        const content = container.querySelector('.wplace-content');
        const closeStatsBtn = statsContainer.querySelector('#closeStatsBtn');
        const refreshChargesBtn =
            statsContainer.querySelector('#refreshChargesBtn');
        const cooldownSlider = container.querySelector('#cooldownSlider');
        const cooldownInput = container.querySelector('#cooldownInput');
        const cooldownDecrease = container.querySelector('#cooldownDecrease');
        const cooldownIncrease = container.querySelector('#cooldownIncrease');
        const cooldownValue = container.querySelector('#cooldownValue');

        if (!uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
            console.error('Some UI elements not found:', {
                uploadBtn: !!uploadBtn,
                selectPosBtn: !!selectPosBtn,
                startBtn: !!startBtn,
                stopBtn: !!stopBtn,
            });
        }

        if (!statsContainer || !statsArea || !closeStatsBtn) {
            // Note: base CSS now aligns with this layout: main panel at left:20px (width 280), stats at left:330px.
        }

        const header = container.querySelector('.wplace-header');

        makeDraggable(container);

        function makeDraggable(element) {
            let pos1 = 0,
                pos2 = 0,
                pos3 = 0,
                pos4 = 0;
            let isDragging = false;
            const header =
                element.querySelector('.wplace-header') ||
                element.querySelector('.wplace-settings-header');

            if (!header) {
                console.warn('No draggable header found for element:', element);
                return;
            }

            header.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                if (
                    e.target.closest('.wplace-header-btn') ||
                    e.target.closest('button')
                )
                    return;

                e.preventDefault();
                isDragging = true;

                const rect = element.getBoundingClientRect();

                element.style.transform = 'none';
                element.style.top = rect.top + 'px';
                element.style.left = rect.left + 'px';

                pos3 = e.clientX;
                pos4 = e.clientY;
                element.classList.add('wplace-dragging');
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;

                document.body.style.userSelect = 'none';
            }

            function elementDrag(e) {
                if (!isDragging) return;

                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                let newTop = element.offsetTop - pos2;
                let newLeft = element.offsetLeft - pos1;

                const rect = element.getBoundingClientRect();
                const maxTop = window.innerHeight - rect.height;
                const maxLeft = window.innerWidth - rect.width;

                newTop = Math.max(0, Math.min(newTop, maxTop));
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));

                element.style.top = newTop + 'px';
                element.style.left = newLeft + 'px';
            }

            function closeDragElement() {
                isDragging = false;
                element.classList.remove('wplace-dragging');
                document.onmouseup = null;
                document.onmousemove = null;
                document.body.style.userSelect = '';
            }
        }

        makeDraggable(statsContainer);
        makeDraggable(container);

        if (statsBtn && closeStatsBtn) {
            statsBtn.addEventListener('click', () => {
                const isVisible = statsContainer.style.display !== 'none';
                if (isVisible) {
                    statsContainer.style.display = 'none';
                    statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
                    statsBtn.title = Utils.t('showStats');
                } else {
                    statsContainer.style.display = 'block';
                    statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
                    statsBtn.title = Utils.t('hideStats');
                }
            });

            closeStatsBtn.addEventListener('click', () => {
                statsContainer.style.display = 'none';
                statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
                statsBtn.title = Utils.t('showStats');
            });

            if (refreshChargesBtn) {
                refreshChargesBtn.addEventListener('click', async () => {
                    refreshChargesBtn.innerHTML =
                        '<i class="fas fa-spinner fa-spin"></i>';
                    refreshChargesBtn.disabled = true;

                    try {
                        await updateStats(true);
                    } catch (error) {
                        console.error('Error refreshing charges:', error);
                    } finally {
                        refreshChargesBtn.innerHTML =
                            '<i class="fas fa-sync"></i>';
                        refreshChargesBtn.disabled = false;
                    }
                });
            }
        }
        if (statsContainer && statsBtn) {
            // Stats container starts hidden - user clicks button to show
            statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
            statsBtn.title = Utils.t('showStats');
        }

        const settingsBtn = container.querySelector('#settingsBtn');
        const closeSettingsBtn =
            settingsContainer.querySelector('#closeSettingsBtn');
        const applySettingsBtn =
            settingsContainer.querySelector('#applySettingsBtn');

        if (settingsBtn && closeSettingsBtn && applySettingsBtn) {
            settingsBtn.addEventListener('click', () => {
                const isVisible = settingsContainer.classList.contains('show');
                if (isVisible) {
                    settingsContainer.style.animation =
                        'settings-fade-out 0.3s ease-out forwards';
                    settingsContainer.classList.remove('show');
                    setTimeout(() => {
                        settingsContainer.style.animation = '';
                    }, 300);
                } else {
                    settingsContainer.style.top = '50%';
                    settingsContainer.style.left = '50%';
                    settingsContainer.style.transform = 'translate(-50%, -50%)';
                    settingsContainer.classList.add('show');
                    settingsContainer.style.animation =
                        'settings-slide-in 0.4s ease-out';
                }
            });

            closeSettingsBtn.addEventListener('click', () => {
                settingsContainer.style.animation =
                    'settings-fade-out 0.3s ease-out forwards';
                settingsContainer.classList.remove('show');
                setTimeout(() => {
                    settingsContainer.style.animation = '';
                    settingsContainer.style.top = '50%';
                    settingsContainer.style.left = '50%';
                    settingsContainer.style.transform = 'translate(-50%, -50%)';
                }, 300);
            });

            applySettingsBtn.addEventListener('click', () => {
                // Sync advanced settings before save
                const colorAlgorithmSelect = document.getElementById(
                    'colorAlgorithmSelect'
                );
                if (colorAlgorithmSelect)
                    state.colorMatchingAlgorithm = colorAlgorithmSelect.value;
                const enableChromaPenaltyToggle = document.getElementById(
                    'enableChromaPenaltyToggle'
                );
                if (enableChromaPenaltyToggle)
                    state.enableChromaPenalty =
                        enableChromaPenaltyToggle.checked;
                const chromaPenaltyWeightSlider = document.getElementById(
                    'chromaPenaltyWeightSlider'
                );
                if (chromaPenaltyWeightSlider)
                    state.chromaPenaltyWeight =
                        parseFloat(chromaPenaltyWeightSlider.value) || 0.15;
                const transparencyThresholdInput = document.getElementById(
                    'transparencyThresholdInput'
                );
                if (transparencyThresholdInput) {
                    const v = parseInt(transparencyThresholdInput.value, 10);
                    if (!isNaN(v) && v >= 0 && v <= 255)
                        state.customTransparencyThreshold = v;
                }
                const whiteThresholdInput = document.getElementById(
                    'whiteThresholdInput'
                );
                if (whiteThresholdInput) {
                    const v = parseInt(whiteThresholdInput.value, 10);
                    if (!isNaN(v) && v >= 200 && v <= 255)
                        state.customWhiteThreshold = v;
                }
                // Update functional thresholds
                CONFIG.TRANSPARENCY_THRESHOLD =
                    state.customTransparencyThreshold;
                CONFIG.WHITE_THRESHOLD = state.customWhiteThreshold;
                // Notifications
                const notifEnabledToggle =
                    document.getElementById('notifEnabledToggle');
                const notifOnChargesToggle = document.getElementById(
                    'notifOnChargesToggle'
                );
                const notifOnlyUnfocusedToggle = document.getElementById(
                    'notifOnlyUnfocusedToggle'
                );
                const notifIntervalInput =
                    document.getElementById('notifIntervalInput');
                if (notifEnabledToggle)
                    state.notificationsEnabled = !!notifEnabledToggle.checked;
                if (notifOnChargesToggle)
                    state.notifyOnChargesReached =
                        !!notifOnChargesToggle.checked;
                if (notifOnlyUnfocusedToggle)
                    state.notifyOnlyWhenUnfocused =
                        !!notifOnlyUnfocusedToggle.checked;
                if (notifIntervalInput) {
                    const v = parseInt(notifIntervalInput.value, 10);
                    if (!isNaN(v) && v >= 1 && v <= 60)
                        state.notificationIntervalMinutes = v;
                }
                saveBotSettings();
                Utils.showAlert(Utils.t('settingsSaved'), 'success');
                closeSettingsBtn.click();
                NotificationManager.syncFromState();
            });

            makeDraggable(settingsContainer);

            const tokenSourceSelect =
                settingsContainer.querySelector('#tokenSourceSelect');
            if (tokenSourceSelect) {
                tokenSourceSelect.addEventListener('change', e => {
                    state.tokenSource = e.target.value;
                    saveBotSettings();
                    console.log(
                        `🔑 Token source changed to: ${state.tokenSource}`
                    );
                    const sourceNames = {
                        generator: 'Automatic Generator',
                        hybrid: 'Generator + Auto Fallback',
                        manual: 'Manual Pixel Placement',
                    };
                    Utils.showAlert(
                        Utils.t('tokenSourceSet', {
                            source: sourceNames[state.tokenSource],
                        }),
                        'success'
                    );
                });
            }

            // Batch mode controls
            const batchModeSelect =
                settingsContainer.querySelector('#batchModeSelect');
            const normalBatchControls = settingsContainer.querySelector(
                '#normalBatchControls'
            );
            const randomBatchControls = settingsContainer.querySelector(
                '#randomBatchControls'
            );
            const randomBatchMin =
                settingsContainer.querySelector('#randomBatchMin');
            const randomBatchMax =
                settingsContainer.querySelector('#randomBatchMax');

            if (batchModeSelect) {
                batchModeSelect.addEventListener('change', e => {
                    state.batchMode = e.target.value;

                    // Switch between normal and random controls
                    if (normalBatchControls && randomBatchControls) {
                        if (e.target.value === 'random') {
                            normalBatchControls.style.display = 'none';
                            randomBatchControls.style.display = 'block';
                        } else {
                            normalBatchControls.style.display = 'block';
                            randomBatchControls.style.display = 'none';
                        }
                    }

                    saveBotSettings();
                    console.log(`📦 Batch mode changed to: ${state.batchMode}`);
                    Utils.showAlert(
                        Utils.t('batchModeSet', {
                            mode:
                                state.batchMode === 'random'
                                    ? Utils.t('randomRange')
                                    : Utils.t('normalFixedSize'),
                        }),
                        'success'
                    );
                });
            }

            if (randomBatchMin) {
                randomBatchMin.addEventListener('input', e => {
                    const min = parseInt(e.target.value);
                    if (min >= 1 && min <= 1000) {
                        state.randomBatchMin = min;
                        // Ensure min doesn't exceed max
                        if (randomBatchMax && min > state.randomBatchMax) {
                            state.randomBatchMax = min;
                            randomBatchMax.value = min;
                        }
                        saveBotSettings();
                    }
                });
            }

            if (randomBatchMax) {
                randomBatchMax.addEventListener('input', e => {
                    const max = parseInt(e.target.value);
                    if (max >= 1 && max <= 1000) {
                        state.randomBatchMax = max;
                        // Ensure max doesn't go below min
                        if (randomBatchMin && max < state.randomBatchMin) {
                            state.randomBatchMin = max;
                            randomBatchMin.value = max;
                        }
                        saveBotSettings();
                    }
                });
            }

            const languageSelect =
                settingsContainer.querySelector('#languageSelect');
            if (languageSelect) {
                languageSelect.addEventListener('change', async e => {
                    const newLanguage = e.target.value;

                    await setLanguage(newLanguage, state);

                    setTimeout(() => {
                        settingsContainer.style.display = 'none';
                        createUI();
                    }, 100);
                });
            }

            const themeSelect = settingsContainer.querySelector('#themeSelect');
            if (themeSelect) {
                themeSelect.addEventListener('change', e => {
                    const newTheme = e.target.value;
                    switchTheme(newTheme);
                    // Recreate UI after theme switch
                    createUI();
                });
            }

            const overlayOpacitySlider = settingsContainer.querySelector(
                '#overlayOpacitySlider'
            );
            const overlayOpacityValue = settingsContainer.querySelector(
                '#overlayOpacityValue'
            );
            const enableBlueMarbleToggle = settingsContainer.querySelector(
                '#enableBlueMarbleToggle'
            );
            const settingsPaintWhiteToggle = settingsContainer.querySelector(
                '#settingsPaintWhiteToggle'
            );
            const settingsPaintTransparentToggle =
                settingsContainer.querySelector(
                    '#settingsPaintTransparentToggle'
                );

            if (overlayOpacitySlider && overlayOpacityValue) {
                overlayOpacitySlider.addEventListener('input', e => {
                    const opacity = parseFloat(e.target.value);
                    state.overlayOpacity = opacity;
                    overlayOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
                });
            }

            if (settingsPaintWhiteToggle) {
                settingsPaintWhiteToggle.checked = state.paintWhitePixels;
                settingsPaintWhiteToggle.addEventListener('change', e => {
                    state.paintWhitePixels = e.target.checked;
                    saveBotSettings();
                    console.log(
                        `🎨 Paint white pixels: ${state.paintWhitePixels ? 'ON' : 'OFF'}`
                    );
                    const statusText = state.paintWhitePixels
                        ? 'White pixels in the template will be painted'
                        : 'White pixels will be skipped';
                    Utils.showAlert(statusText, 'success');
                });
            }

            if (settingsPaintTransparentToggle) {
                settingsPaintTransparentToggle.checked =
                    state.paintTransparentPixels;
                settingsPaintTransparentToggle.addEventListener('change', e => {
                    state.paintTransparentPixels = e.target.checked;
                    saveBotSettings();
                    console.log(
                        `🎨 Paint transparent pixels: ${state.paintTransparentPixels ? 'ON' : 'OFF'}`
                    );
                    const statusText = state.paintTransparentPixels
                        ? 'Transparent pixels in the template will be painted with the closest available color'
                        : 'Transparent pixels will be skipped';
                    Utils.showAlert(statusText, 'success');
                });
            }

            // Speed slider + input + buttons event listeners
            const speedSlider = settingsContainer.querySelector('#speedSlider');
            const speedInput = settingsContainer.querySelector('#speedInput');
            const speedDecrease =
                settingsContainer.querySelector('#speedDecrease');
            const speedIncrease =
                settingsContainer.querySelector('#speedIncrease');
            if (speedSlider && speedInput) {
                const updateSpeed = (newValue, source) => {
                    const speed = Math.max(
                        CONFIG.PAINTING_SPEED.MIN,
                        Math.min(CONFIG.PAINTING_SPEED.MAX, parseInt(newValue))
                    );
                    state.paintingSpeed = speed;

                    if (source !== 'slider') speedSlider.value = speed;
                    if (source !== 'input') speedInput.value = speed;

                    saveBotSettings();
                };

                speedSlider.addEventListener('input', e => {
                    updateSpeed(e.target.value, 'slider');
                });

                speedInput.addEventListener('input', e => {
                    updateSpeed(e.target.value, 'input');
                });

                if (speedDecrease) {
                    Utils.addHoldToRepeatListener(speedDecrease, () => {
                        updateSpeed(parseInt(speedInput.value) - 1, 'button');
                    });
                }

                if (speedIncrease) {
                    Utils.addHoldToRepeatListener(speedIncrease, () => {
                        updateSpeed(parseInt(speedInput.value) + 1, 'button');
                    });
                }
            }

            if (enableBlueMarbleToggle) {
                enableBlueMarbleToggle.addEventListener('click', async () => {
                    state.blueMarbleEnabled = enableBlueMarbleToggle.checked;
                    if (state.imageLoaded && overlayManager.imageBitmap) {
                        Utils.showAlert(Utils.t('reprocessingOverlay'), 'info');
                        await overlayManager.processImageIntoChunks();
                        Utils.showAlert(Utils.t('overlayUpdated'), 'success');
                    }
                });
            }

            // (Advanced color listeners moved outside to work with resize dialog)
            // (Advanced color listeners moved outside to work with resize dialog)
            // Notifications listeners
            const notifPermBtn = settingsContainer.querySelector(
                '#notifRequestPermBtn'
            );
            const notifTestBtn =
                settingsContainer.querySelector('#notifTestBtn');
            if (notifPermBtn) {
                notifPermBtn.addEventListener('click', async () => {
                    const perm = await NotificationManager.requestPermission();
                    if (perm === 'granted')
                        Utils.showAlert(
                            Utils.t('notificationsEnabled'),
                            'success'
                        );
                    else
                        Utils.showAlert(
                            Utils.t('notificationsPermissionDenied'),
                            'warning'
                        );
                });
            }
            if (notifTestBtn) {
                notifTestBtn.addEventListener('click', () => {
                    NotificationManager.notify(
                        Utils.t('testNotificationTitle'),
                        Utils.t('testNotificationMessage'),
                        'wplace-notify-test',
                        true
                    );
                });
            }
        }

        const widthSlider = resizeContainer.querySelector('#widthSlider');
        const heightSlider = resizeContainer.querySelector('#heightSlider');
        const widthValue = resizeContainer.querySelector('#widthValue');
        const heightValue = resizeContainer.querySelector('#heightValue');
        const keepAspect = resizeContainer.querySelector('#keepAspect');
        const paintWhiteToggle =
            resizeContainer.querySelector('#paintWhiteToggle');
        const paintTransparentToggle = resizeContainer.querySelector(
            '#paintTransparentToggle'
        );
        const zoomSlider = resizeContainer.querySelector('#zoomSlider');
        const zoomValue = resizeContainer.querySelector('#zoomValue');
        const zoomInBtn = resizeContainer.querySelector('#zoomInBtn');
        const zoomOutBtn = resizeContainer.querySelector('#zoomOutBtn');
        const zoomFitBtn = resizeContainer.querySelector('#zoomFitBtn');
        const zoomActualBtn = resizeContainer.querySelector('#zoomActualBtn');
        const panModeBtn = resizeContainer.querySelector('#panModeBtn');
        const panStage = resizeContainer.querySelector('#resizePanStage');
        const canvasStack = resizeContainer.querySelector('#resizeCanvasStack');
        const baseCanvas = resizeContainer.querySelector('#resizeCanvas');
        const maskCanvas = resizeContainer.querySelector('#maskCanvas');
        const baseCtx = baseCanvas.getContext('2d');
        const maskCtx = maskCanvas.getContext('2d');
        const confirmResize = resizeContainer.querySelector('#confirmResize');
        const cancelResize = resizeContainer.querySelector('#cancelResize');
        const downloadPreviewBtn = resizeContainer.querySelector(
            '#downloadPreviewBtn'
        );
        const clearIgnoredBtn =
            resizeContainer.querySelector('#clearIgnoredBtn');

        // Coordinate generation controls with smart visibility
        const coordinateModeSelect = settingsContainer.querySelector(
            '#coordinateModeSelect'
        );
        const coordinateDirectionSelect = settingsContainer.querySelector(
            '#coordinateDirectionSelect'
        );
        const coordinateSnakeToggle = settingsContainer.querySelector(
            '#coordinateSnakeToggle'
        );
        const directionControls =
            settingsContainer.querySelector('#directionControls');
        const snakeControls = settingsContainer.querySelector('#snakeControls');
        const blockControls = settingsContainer.querySelector('#blockControls');
        const blockWidthInput =
            settingsContainer.querySelector('#blockWidthInput');
        const blockHeightInput =
            settingsContainer.querySelector('#blockHeightInput');
        const paintUnavailablePixelsToggle = settingsContainer.querySelector(
            '#paintUnavailablePixelsToggle'
        );

        if (paintUnavailablePixelsToggle) {
            paintUnavailablePixelsToggle.checked = state.paintUnavailablePixels;
            paintUnavailablePixelsToggle.addEventListener('change', e => {
                state.paintUnavailablePixels = e.target.checked;
                saveBotSettings();
                console.log(
                    `🎨 Paint unavailable colors: ${state.paintUnavailablePixels ? 'ON' : 'OFF'}`
                );
                const statusText = state.paintUnavailablePixels
                    ? 'Unavailable template colors will be painted with the closest available color'
                    : 'Unavailable template colors will be skipped';
                Utils.showAlert(statusText, 'success');
            });
        }
        if (coordinateModeSelect) {
            coordinateModeSelect.value = state.coordinateMode;
            coordinateModeSelect.addEventListener('change', e => {
                state.coordinateMode = e.target.value;
                Utils.updateCoordinateUI({
                    mode: state.coordinateMode,
                    directionControls,
                    snakeControls,
                    blockControls,
                });
                saveBotSettings();
                console.log(
                    `🔄 Coordinate mode changed to: ${state.coordinateMode}`
                );
                Utils.showAlert(
                    `Coordinate mode set to: ${state.coordinateMode}`,
                    'success'
                );
            });
        }

        if (coordinateDirectionSelect) {
            coordinateDirectionSelect.value = state.coordinateDirection;
            coordinateDirectionSelect.addEventListener('change', e => {
                state.coordinateDirection = e.target.value;
                saveBotSettings();
                console.log(
                    `🧭 Coordinate direction changed to: ${state.coordinateDirection}`
                );
                Utils.showAlert(
                    `Coordinate direction set to: ${state.coordinateDirection}`,
                    'success'
                );
            });
        }

        if (coordinateSnakeToggle) {
            coordinateSnakeToggle.checked = state.coordinateSnake;
            coordinateSnakeToggle.addEventListener('change', e => {
                state.coordinateSnake = e.target.checked;
                saveBotSettings();
                console.log(
                    `🐍 Snake pattern ${state.coordinateSnake ? 'enabled' : 'disabled'}`
                );
                Utils.showAlert(
                    `Snake pattern ${state.coordinateSnake ? 'enabled' : 'disabled'}`,
                    'success'
                );
            });
        }

        if (blockWidthInput) {
            blockWidthInput.value = state.blockWidth;
            blockWidthInput.addEventListener('input', e => {
                const width = parseInt(e.target.value);
                if (width >= 1 && width <= 50) {
                    state.blockWidth = width;
                    saveBotSettings();
                }
            });
        }

        if (blockHeightInput) {
            blockHeightInput.value = state.blockHeight;
            blockHeightInput.addEventListener('change', e => {
                const height = parseInt(e.target.value);
                if (height >= 1 && height <= 50) {
                    state.blockHeight = height;
                    saveBotSettings();
                }
            });
        }

        if (compactBtn) {
            compactBtn.addEventListener('click', () => {
                container.classList.toggle('wplace-compact');
                const isCompact =
                    container.classList.contains('wplace-compact');

                if (isCompact) {
                    compactBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    compactBtn.title = Utils.t('expandMode');
                } else {
                    compactBtn.innerHTML = '<i class="fas fa-compress"></i>';
                    compactBtn.title = Utils.t('compactMode');
                }
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                state.minimized = !state.minimized;
                if (state.minimized) {
                    container.classList.add('wplace-minimized');
                    content.classList.add('wplace-hidden');
                    minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    minimizeBtn.title = Utils.t('restore');
                } else {
                    container.classList.remove('wplace-minimized');
                    content.classList.remove('wplace-hidden');
                    minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
                    minimizeBtn.title = Utils.t('minimize');
                }
                saveBotSettings();
            });
        }

        if (toggleOverlayBtn) {
            toggleOverlayBtn.addEventListener('click', () => {
                const isEnabled = overlayManager.toggle();
                toggleOverlayBtn.classList.toggle('active', isEnabled);
                toggleOverlayBtn.setAttribute(
                    'aria-pressed',
                    isEnabled ? 'true' : 'false'
                );
                Utils.showAlert(
                    isEnabled
                        ? Utils.t('overlayEnabled')
                        : Utils.t('overlayDisabled'),
                    'info'
                );
            });
        }

        if (state.minimized) {
            container.classList.add('wplace-minimized');
            content.classList.add('wplace-hidden');
            if (minimizeBtn) {
                minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
                minimizeBtn.title = Utils.t('restore');
            }
        } else {
            container.classList.remove('wplace-minimized');
            content.classList.remove('wplace-hidden');
            if (minimizeBtn) {
                minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
                minimizeBtn.title = Utils.t('minimize');
            }
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (!state.imageLoaded) {
                    Utils.showAlert(Utils.t('missingRequirements'), 'error');
                    return;
                }

                const success = Utils.saveProgress();
                if (success) {
                    updateUI('autoSaved', 'success');
                    Utils.showAlert(Utils.t('autoSaved'), 'success');
                } else {
                    Utils.showAlert(Utils.t('errorSavingProgress'), 'error');
                }
            });
        }

        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                // Check if initial setup is complete
                if (!state.initialSetupComplete) {
                    Utils.showAlert(
                        Utils.t('pleaseWaitInitialSetup'),
                        'warning'
                    );
                    return;
                }

                const savedData = Utils.loadProgress();
                if (!savedData) {
                    updateUI('noSavedData', 'warning');
                    Utils.showAlert(Utils.t('noSavedData'), 'warning');
                    return;
                }

                const confirmLoad = confirm(
                    `${Utils.t('savedDataFound')}\n\n` +
                        `Saved: ${new Date(savedData.timestamp).toLocaleString()}\n` +
                        `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`
                );

                if (confirmLoad) {
                    const success = Utils.restoreProgress(savedData);
                    if (success) {
                        updateUI('dataLoaded', 'success');
                        Utils.showAlert(Utils.t('dataLoaded'), 'success');
                        updateDataButtons();

                        updateStats();

                        // Restore overlay if image data was loaded from localStorage
                        Utils.restoreOverlayFromData().catch(error => {
                            console.error(
                                'Failed to restore overlay from localStorage:',
                                error
                            );
                        });

                        if (!state.colorsChecked) {
                            uploadBtn.disabled = false;
                        } else {
                            uploadBtn.disabled = false;
                            selectPosBtn.disabled = false;
                        }

                        if (
                            state.imageLoaded &&
                            state.startPosition &&
                            state.region &&
                            state.colorsChecked
                        ) {
                            startBtn.disabled = false;
                        }
                    } else {
                        Utils.showAlert(
                            Utils.t('errorLoadingProgress'),
                            'error'
                        );
                    }
                }
            });
        }

        if (saveToFileBtn) {
            saveToFileBtn.addEventListener('click', () => {
                const success = Utils.saveProgressToFile();
                if (success) {
                    updateUI('fileSaved', 'success');
                    Utils.showAlert(Utils.t('fileSaved'), 'success');
                } else {
                    Utils.showAlert(Utils.t('fileError'), 'error');
                }
            });
        }

        if (loadFromFileBtn) {
            loadFromFileBtn.addEventListener('click', async () => {
                // Check if initial setup is complete
                if (!state.initialSetupComplete) {
                    Utils.showAlert(Utils.t('pleaseWaitFileSetup'), 'warning');
                    return;
                }

                try {
                    const success = await Utils.loadProgressFromFile();
                    if (success) {
                        updateUI('fileLoaded', 'success');
                        Utils.showAlert(Utils.t('fileLoaded'), 'success');
                        updateDataButtons();

                        await updateStats();

                        // Restore overlay if image data was loaded from file
                        await Utils.restoreOverlayFromData().catch(error => {
                            console.error(
                                'Failed to restore overlay from file:',
                                error
                            );
                        });

                        if (state.colorsChecked) {
                            uploadBtn.disabled = false;
                            selectPosBtn.disabled = false;
                            resizeBtn.disabled = false;
                        } else {
                            uploadBtn.disabled = false;
                        }

                        if (
                            state.imageLoaded &&
                            state.startPosition &&
                            state.region &&
                            state.colorsChecked
                        ) {
                            startBtn.disabled = false;
                        }
                    }
                } catch (error) {
                    if (error.message === 'Invalid JSON file') {
                        Utils.showAlert(Utils.t('invalidFileFormat'), 'error');
                    } else {
                        Utils.showAlert(Utils.t('fileError'), 'error');
                    }
                }
            });
        }

        updateUI = (
            messageKey,
            type = 'default',
            params = {},
            silent = false
        ) => {
            const message = Utils.t(messageKey, params);
            statusText.textContent = message;
            statusText.className = `wplace-status status-${type}`;

            if (!silent) {
                // Trigger animation only when silent = false
                statusText.style.animation = 'none';
                void statusText.offsetWidth; // trick to restart the animation
                statusText.style.animation = 'slide-in 0.3s ease-out';
            }
        };

        function updateChargeStatsDisplay(intervalMs) {
            const currentChargesEl = document.getElementById(
                'wplace-stat-charges-value'
            );
            const fullChargeEl = document.getElementById(
                'wplace-stat-fullcharge-value'
            );
            if (!fullChargeEl && !currentChargesEl) return;
            if (!state.fullChargeData) {
                fullChargeEl.textContent = '--:--:--';
                return;
            }

            const { current, max, cooldownMs, startTime, spentSinceShot } =
                state.fullChargeData;
            const elapsed = Date.now() - startTime;

            // total charges including elapsed time and spent during painting since snapshot
            const chargesGained = elapsed / cooldownMs;
            const rawCharges = current + chargesGained - spentSinceShot;
            const cappedCharges = Math.min(rawCharges, max);

            // rounding with 0.95 threshold
            let displayCharges;
            const fraction = cappedCharges - Math.floor(cappedCharges);
            if (fraction >= 0.95) {
                displayCharges = Math.ceil(cappedCharges);
            } else {
                displayCharges = Math.floor(cappedCharges);
            }

            state.displayCharges = Math.max(0, displayCharges);
            state.preciseCurrentCharges = cappedCharges;

            const remainingMs = getMsToTargetCharges(
                cappedCharges,
                max,
                state.cooldown,
                intervalMs
            );
            const timeText = Utils.msToTimeText(remainingMs);

            if (currentChargesEl) {
                currentChargesEl.innerHTML = `${state.displayCharges} / ${state.maxCharges}`;
            }

            if (
                state.displayCharges < state.cooldownChargeThreshold &&
                !state.stopFlag &&
                state.running
            ) {
                updateChargesThresholdUI(intervalMs);
            }

            if (fullChargeEl) {
                if (state.displayCharges >= max) {
                    fullChargeEl.innerHTML = `<span style="color:#10b981;">FULL</span>`;
                } else {
                    fullChargeEl.innerHTML = `
            <span style="color:#f59e0b;">${timeText}</span>
          `;
                }
            }
        }

        updateStats = async (isManualRefresh = false) => {
            const isForcedRefresh = isManualRefresh;
            const isFirstCheck = !state.fullChargeData?.startTime;

            const minUpdateInterval = 60_000;
            const maxUpdateInterval = 90_000;
            const randomUpdateThreshold =
                minUpdateInterval +
                Math.random() * (maxUpdateInterval - minUpdateInterval);
            const timeSinceLastUpdate =
                Date.now() - (state.fullChargeData?.startTime || 0);
            const isTimeToUpdate = timeSinceLastUpdate >= randomUpdateThreshold;

            const shouldCallApi =
                isForcedRefresh || isFirstCheck || isTimeToUpdate;

            if (shouldCallApi) {
                const { charges, max, cooldown } =
                    await WPlaceService.getCharges();
                state.displayCharges = Math.floor(charges);
                state.preciseCurrentCharges = charges;
                state.cooldown = cooldown;
                state.maxCharges =
                    Math.floor(max) > 1 ? Math.floor(max) : state.maxCharges;

                state.fullChargeData = {
                    current: charges,
                    max: max,
                    cooldownMs: cooldown,
                    startTime: Date.now(),
                    spentSinceShot: 0,
                };
                // Evaluate notifications every time we refresh server-side charges
                NotificationManager.maybeNotifyChargesReached();
            }

            if (state.fullChargeInterval) {
                clearInterval(state.fullChargeInterval);
                state.fullChargeInterval = null;
            }
            const intervalMs = 1000;
            state.fullChargeInterval = setInterval(
                () => updateChargeStatsDisplay(intervalMs),
                intervalMs
            );

            if (cooldownSlider && cooldownSlider.max !== state.maxCharges) {
                cooldownSlider.max = state.maxCharges;
            }
            if (cooldownInput && cooldownInput.max !== state.maxCharges) {
                cooldownInput.max = state.maxCharges;
            }

            let imageStatsHTML = '';
            if (state.imageLoaded) {
                const progress =
                    state.totalPixels > 0
                        ? Math.round(
                              (state.paintedPixels / state.totalPixels) * 100
                          )
                        : 0;
                const remainingPixels = state.totalPixels - state.paintedPixels;
                state.estimatedTime = Utils.calculateEstimatedTime(
                    remainingPixels,
                    state.displayCharges,
                    state.cooldown
                );
                progressBar.style.width = `${progress}%`;

                imageStatsHTML = `
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t('progress')}</div>
            <div class="wplace-stat-value">${progress}%</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t(
                'pixels'
            )}</div>
            <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t(
                'estimatedTime'
            )}</div>
            <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
          </div>
        `;
            }

            let colorSwatchesHTML = '';
            state.availableColors = state.availableColors.filter(
                c => c.name !== 'Unknown CoIor NaN' && c.id !== null
            );

            const availableColors = Utils.extractAvailableColors();
            const newCount = Array.isArray(availableColors)
                ? availableColors.length
                : 0;

            if (newCount === 0 && isManualRefresh) {
                Utils.showAlert(Utils.t('noColorsFound'), 'warning');
            } else if (
                newCount > 0 &&
                state.availableColors.length < newCount
            ) {
                const oldCount = state.availableColors.length;

                Utils.showAlert(
                    Utils.t('colorsUpdated', {
                        oldCount,
                        newCount: newCount,
                        diffCount: newCount - oldCount,
                    }),
                    'success'
                );
                state.availableColors = availableColors;
            }
            if (state.colorsChecked) {
                colorSwatchesHTML = state.availableColors
                    .map(color => {
                        const rgbString = `rgb(${color.rgb.join(',')})`;
                        return `<div class="wplace-stat-color-swatch" style="background-color: ${rgbString};" title="${Utils.t(
                            'colorTooltip',
                            { id: color.id, rgb: color.rgb.join(', ') }
                        )}"></div>`;
                    })
                    .join('');
            }

            statsArea.innerHTML = `
            ${imageStatsHTML}
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-bolt"></i> ${Utils.t('charges')}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-charges-value">
                ${state.displayCharges} / ${state.maxCharges}
              </div>
            </div>
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-battery-half"></i> ${Utils.t('fullChargeIn')}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-fullcharge-value">--:--:--</div>
            </div>
            ${
                state.colorsChecked
                    ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${Utils.t(
                    'availableColors',
                    { count: state.availableColors.length }
                )}</div>
                <div class="wplace-stat-colors-grid">
                    ${colorSwatchesHTML}
                </div>
            </div>
            `
                    : ''
            }
        `;

            // should be after statsArea.innerHTML = '...'. todo make full stats ui update partial
            updateChargeStatsDisplay(intervalMs);
        };

        updateDataButtons = () => {
            const hasImageData = state.imageLoaded && state.imageData;
            saveBtn.disabled = !hasImageData;
            saveToFileBtn.disabled = !hasImageData;
        };

        updateDataButtons();

        function showResizeDialog(processor) {
            let baseProcessor = processor;
            let width, height;
            if (state.originalImage?.dataUrl) {
                baseProcessor = new ImageProcessor(state.originalImage.dataUrl);
                width = state.originalImage.width;
                height = state.originalImage.height;
            } else {
                const dims = processor.getDimensions();
                width = dims.width;
                height = dims.height;
            }
            const aspectRatio = width / height;

            const rs = state.resizeSettings;
            widthSlider.max = width * 2;
            heightSlider.max = height * 2;
            let initialW = width;
            let initialH = height;
            if (
                rs &&
                Number.isFinite(rs.width) &&
                Number.isFinite(rs.height) &&
                rs.width > 0 &&
                rs.height > 0
            ) {
                initialW = rs.width;
                initialH = rs.height;
            }
            // Clamp to slider ranges
            initialW = Math.max(
                parseInt(widthSlider.min, 10) || 10,
                Math.min(initialW, parseInt(widthSlider.max, 10))
            );
            initialH = Math.max(
                parseInt(heightSlider.min, 10) || 10,
                Math.min(initialH, parseInt(heightSlider.max, 10))
            );
            widthSlider.value = initialW;
            heightSlider.value = initialH;
            widthValue.textContent = initialW;
            heightValue.textContent = initialH;
            zoomSlider.value = 1;
            if (zoomValue) zoomValue.textContent = '100%';
            paintWhiteToggle.checked = state.paintWhitePixels;
            paintTransparentToggle.checked = state.paintTransparentPixels;

            let _previewTimer = null;
            let _previewJobId = 0;
            let _isDraggingSize = false;
            let _zoomLevel = 1;
            let _ditherWorkBuf = null;
            let _ditherEligibleBuf = null;
            const ensureDitherBuffers = n => {
                if (!_ditherWorkBuf || _ditherWorkBuf.length !== n * 3)
                    _ditherWorkBuf = new Float32Array(n * 3);
                if (!_ditherEligibleBuf || _ditherEligibleBuf.length !== n)
                    _ditherEligibleBuf = new Uint8Array(n);
                return { work: _ditherWorkBuf, eligible: _ditherEligibleBuf };
            };
            let _maskImageData = null;
            let _maskData = null;
            let _dirty = null;
            const _resetDirty = () => {
                _dirty = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 };
            };
            const _markDirty = (x, y) => {
                if (!_dirty) _resetDirty();
                if (x < _dirty.minX) _dirty.minX = x;
                if (y < _dirty.minY) _dirty.minY = y;
                if (x > _dirty.maxX) _dirty.maxX = x;
                if (y > _dirty.maxY) _dirty.maxY = y;
            };
            const _flushDirty = () => {
                if (
                    !_dirty ||
                    _dirty.maxX < _dirty.minX ||
                    _dirty.maxY < _dirty.minY
                )
                    return;
                const x = Math.max(0, _dirty.minX);
                const y = Math.max(0, _dirty.minY);
                const w = Math.min(maskCanvas.width - x, _dirty.maxX - x + 1);
                const h = Math.min(maskCanvas.height - y, _dirty.maxY - y + 1);
                if (w > 0 && h > 0)
                    maskCtx.putImageData(_maskImageData, 0, 0, x, y, w, h);
                _resetDirty();
            };
            const _ensureMaskOverlayBuffers = (
                w,
                h,
                rebuildFromMask = false
            ) => {
                if (
                    !_maskImageData ||
                    _maskImageData.width !== w ||
                    _maskImageData.height !== h
                ) {
                    _maskImageData = maskCtx.createImageData(w, h);
                    _maskData = _maskImageData.data;
                    rebuildFromMask = true;
                }
                if (rebuildFromMask) {
                    const m = state.resizeIgnoreMask;
                    const md = _maskData;
                    md.fill(0);
                    if (m) {
                        for (let i = 0; i < m.length; i++)
                            if (m[i]) {
                                const p = i * 4;
                                md[p] = 255;
                                md[p + 1] = 0;
                                md[p + 2] = 0;
                                md[p + 3] = 150;
                            }
                    }
                    maskCtx.putImageData(_maskImageData, 0, 0);
                    _resetDirty();
                }
            };
            const ensureMaskSize = (w, h) => {
                if (
                    !state.resizeIgnoreMask ||
                    state.resizeIgnoreMask.length !== w * h
                ) {
                    state.resizeIgnoreMask = new Uint8Array(w * h);
                }
                baseCanvas.width = w;
                baseCanvas.height = h;
                maskCanvas.width = w;
                maskCanvas.height = h;
                maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                // Ensure overlay buffers exist and rebuild from mask when dimensions change
                _ensureMaskOverlayBuffers(w, h, true);
            };
            _updateResizePreview = async () => {
                const jobId = ++_previewJobId;
                const newWidth = parseInt(widthSlider.value, 10);
                const newHeight = parseInt(heightSlider.value, 10);
                _zoomLevel = parseFloat(zoomSlider.value);

                widthValue.textContent = newWidth;
                heightValue.textContent = newHeight;

                ensureMaskSize(newWidth, newHeight);
                canvasStack.style.width = newWidth + 'px';
                canvasStack.style.height = newHeight + 'px';
                baseCtx.imageSmoothingEnabled = false;
                if (
                    !state.availableColors ||
                    state.availableColors.length === 0
                ) {
                    if (
                        baseProcessor !== processor &&
                        (!baseProcessor.img || !baseProcessor.canvas)
                    ) {
                        await baseProcessor.load();
                    }
                    baseCtx.clearRect(0, 0, newWidth, newHeight);
                    baseCtx.drawImage(
                        baseProcessor.img,
                        0,
                        0,
                        newWidth,
                        newHeight
                    );
                    // Draw existing mask overlay buffer
                    maskCtx.clearRect(
                        0,
                        0,
                        maskCanvas.width,
                        maskCanvas.height
                    );
                    if (_maskImageData)
                        maskCtx.putImageData(_maskImageData, 0, 0);
                    updateZoomLayout();
                    return;
                }
                if (
                    baseProcessor !== processor &&
                    (!baseProcessor.img || !baseProcessor.canvas)
                ) {
                    await baseProcessor.load();
                }
                baseCtx.clearRect(0, 0, newWidth, newHeight);
                baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
                const imgData = baseCtx.getImageData(0, 0, newWidth, newHeight);
                const data = imgData.data;

                const tThresh =
                    state.customTransparencyThreshold ||
                    CONFIG.TRANSPARENCY_THRESHOLD;

                const applyFSDither = () => {
                    const w = newWidth,
                        h = newHeight;
                    const n = w * h;
                    const { work, eligible } = ensureDitherBuffers(n);
                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const idx = y * w + x;
                            const i4 = idx * 4;
                            const r = data[i4],
                                g = data[i4 + 1],
                                b = data[i4 + 2],
                                a = data[i4 + 3];
                            const isEligible =
                                (state.paintTransparentPixels ||
                                    a >= tThresh) &&
                                (state.paintWhitePixels ||
                                    !Utils.isWhitePixel(r, g, b));
                            eligible[idx] = isEligible ? 1 : 0;
                            work[idx * 3] = r;
                            work[idx * 3 + 1] = g;
                            work[idx * 3 + 2] = b;
                            if (!isEligible) {
                                data[i4 + 3] = 0; // transparent in preview overlay
                            }
                        }
                    }

                    const diffuse = (nx, ny, er, eg, eb, factor) => {
                        if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
                        const nidx = ny * w + nx;
                        if (!eligible[nidx]) return;
                        const base = nidx * 3;
                        work[base] = Math.min(
                            255,
                            Math.max(0, work[base] + er * factor)
                        );
                        work[base + 1] = Math.min(
                            255,
                            Math.max(0, work[base + 1] + eg * factor)
                        );
                        work[base + 2] = Math.min(
                            255,
                            Math.max(0, work[base + 2] + eb * factor)
                        );
                    };

                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const idx = y * w + x;
                            if (!eligible[idx]) continue;
                            const base = idx * 3;
                            const r0 = work[base],
                                g0 = work[base + 1],
                                b0 = work[base + 2];
                            const [nr, ng, nb] = Utils.findClosestPaletteColor(
                                r0,
                                g0,
                                b0,
                                state.activeColorPalette
                            );
                            const i4 = idx * 4;
                            data[i4] = nr;
                            data[i4 + 1] = ng;
                            data[i4 + 2] = nb;
                            data[i4 + 3] = 255;

                            const er = r0 - nr;
                            const eg = g0 - ng;
                            const eb = b0 - nb;

                            diffuse(x + 1, y, er, eg, eb, 7 / 16);
                            diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                            diffuse(x, y + 1, er, eg, eb, 5 / 16);
                            diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
                        }
                    }
                };

                // Skip expensive dithering while user is dragging sliders
                if (state.ditheringEnabled && !_isDraggingSize) {
                    applyFSDither();
                } else {
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i],
                            g = data[i + 1],
                            b = data[i + 2],
                            a = data[i + 3];
                        if (
                            (!state.paintTransparentPixels && a < tThresh) ||
                            (!state.paintWhitePixels &&
                                Utils.isWhitePixel(r, g, b))
                        ) {
                            data[i + 3] = 0;
                            continue;
                        }
                        const [nr, ng, nb] = Utils.findClosestPaletteColor(
                            r,
                            g,
                            b,
                            state.activeColorPalette
                        );
                        data[i] = nr;
                        data[i + 1] = ng;
                        data[i + 2] = nb;
                        data[i + 3] = 255;
                    }
                }

                if (jobId !== _previewJobId) return;
                baseCtx.putImageData(imgData, 0, 0);
                maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
                if (_maskImageData) maskCtx.putImageData(_maskImageData, 0, 0);
                updateZoomLayout();
            };

            const onWidthInput = () => {
                if (keepAspect.checked) {
                    heightSlider.value = Math.round(
                        parseInt(widthSlider.value, 10) / aspectRatio
                    );
                }
                _updateResizePreview();
                const curW = parseInt(widthSlider.value, 10);
                const curH = parseInt(heightSlider.value, 10);
                state.resizeSettings = {
                    baseWidth: width,
                    baseHeight: height,
                    width: curW,
                    height: curH,
                };
                saveBotSettings();
                // Auto-fit after size changes
                const fit =
                    typeof computeFitZoom === 'function' ? computeFitZoom() : 1;
                if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
            };

            const onHeightInput = () => {
                if (keepAspect.checked) {
                    widthSlider.value = Math.round(
                        parseInt(heightSlider.value, 10) * aspectRatio
                    );
                }
                _updateResizePreview();
                const curW = parseInt(widthSlider.value, 10);
                const curH = parseInt(heightSlider.value, 10);
                state.resizeSettings = {
                    baseWidth: width,
                    baseHeight: height,
                    width: curW,
                    height: curH,
                };
                saveBotSettings();
                // Auto-fit after size changes
                const fit =
                    typeof computeFitZoom === 'function' ? computeFitZoom() : 1;
                if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
            };

            paintWhiteToggle.onchange = e => {
                state.paintWhitePixels = e.target.checked;
                _updateResizePreview();
                saveBotSettings();
            };

            paintTransparentToggle.onchange = e => {
                state.paintTransparentPixels = e.target.checked;
                _updateResizePreview();
                saveBotSettings();
            };

            let panX = 0,
                panY = 0;
            const clampPan = () => {
                const wrapRect = panStage?.getBoundingClientRect() || {
                    width: 0,
                    height: 0,
                };
                const w = (baseCanvas.width || 1) * _zoomLevel;
                const h = (baseCanvas.height || 1) * _zoomLevel;
                if (w <= wrapRect.width) {
                    panX = Math.floor((wrapRect.width - w) / 2);
                } else {
                    const minX = wrapRect.width - w;
                    panX = Math.min(0, Math.max(minX, panX));
                }
                if (h <= wrapRect.height) {
                    panY = Math.floor((wrapRect.height - h) / 2);
                } else {
                    const minY = wrapRect.height - h;
                    panY = Math.min(0, Math.max(minY, panY));
                }
            };
            let _panRaf = 0;
            const applyPan = () => {
                if (_panRaf) return;
                _panRaf = requestAnimationFrame(() => {
                    clampPan();
                    canvasStack.style.transform = `translate3d(${Math.round(
                        panX
                    )}px, ${Math.round(panY)}px, 0) scale(${_zoomLevel})`;
                    _panRaf = 0;
                });
            };

            const updateZoomLayout = () => {
                const w = baseCanvas.width || 1,
                    h = baseCanvas.height || 1;
                baseCanvas.style.width = w + 'px';
                baseCanvas.style.height = h + 'px';
                maskCanvas.style.width = w + 'px';
                maskCanvas.style.height = h + 'px';
                canvasStack.style.width = w + 'px';
                canvasStack.style.height = h + 'px';
                applyPan();
            };
            const applyZoom = z => {
                _zoomLevel = Math.max(0.05, Math.min(20, z || 1));
                zoomSlider.value = _zoomLevel;
                updateZoomLayout();
                if (zoomValue)
                    zoomValue.textContent = `${Math.round(_zoomLevel * 100)}%`;
            };
            zoomSlider.addEventListener('input', () => {
                applyZoom(parseFloat(zoomSlider.value));
            });
            if (zoomInBtn)
                zoomInBtn.addEventListener('click', () =>
                    applyZoom(parseFloat(zoomSlider.value) + 0.1)
                );
            if (zoomOutBtn)
                zoomOutBtn.addEventListener('click', () =>
                    applyZoom(parseFloat(zoomSlider.value) - 0.1)
                );
            const computeFitZoom = () => {
                const wrapRect = panStage?.getBoundingClientRect();
                if (!wrapRect) return 1;
                const w = baseCanvas.width || 1;
                const h = baseCanvas.height || 1;
                const margin = 10;
                const scaleX = (wrapRect.width - margin) / w;
                const scaleY = (wrapRect.height - margin) / h;
                return Math.max(0.05, Math.min(20, Math.min(scaleX, scaleY)));
            };
            if (zoomFitBtn)
                zoomFitBtn.addEventListener('click', () => {
                    applyZoom(computeFitZoom());
                    centerInView();
                });
            if (zoomActualBtn)
                zoomActualBtn.addEventListener('click', () => {
                    applyZoom(1);
                    centerInView();
                });

            const centerInView = () => {
                if (!panStage) return;
                const rect = panStage.getBoundingClientRect();
                const w = (baseCanvas.width || 1) * _zoomLevel;
                const h = (baseCanvas.height || 1) * _zoomLevel;
                panX = Math.floor((rect.width - w) / 2);
                panY = Math.floor((rect.height - h) / 2);
                applyPan();
            };

            let isPanning = false;
            let startX = 0,
                startY = 0,
                startPanX = 0,
                startPanY = 0;
            let allowPan = false; // Space key
            let panMode = false; // Explicit pan mode toggle for touch/one-button mice
            const isPanMouseButton = e => e.button === 1 || e.button === 2;
            const setCursor = val => {
                if (panStage) panStage.style.cursor = val;
            };
            const isPanActive = e => panMode || allowPan || isPanMouseButton(e);
            const updatePanModeBtn = () => {
                if (!panModeBtn) return;
                panModeBtn.classList.toggle('active', panMode);
                panModeBtn.setAttribute(
                    'aria-pressed',
                    panMode ? 'true' : 'false'
                );
            };
            if (panModeBtn) {
                updatePanModeBtn();
                panModeBtn.addEventListener('click', () => {
                    panMode = !panMode;
                    updatePanModeBtn();
                    setCursor(panMode ? 'grab' : '');
                });
            }
            if (panStage) {
                panStage.addEventListener('contextmenu', e => {
                    if (allowPan) e.preventDefault();
                });
                window.addEventListener('keydown', e => {
                    if (e.code === 'Space') {
                        allowPan = true;
                        setCursor('grab');
                    }
                });
                window.addEventListener('keyup', e => {
                    if (e.code === 'Space') {
                        allowPan = false;
                        if (!isPanning) setCursor('');
                    }
                });
                panStage.addEventListener('mousedown', e => {
                    if (!isPanActive(e)) return;
                    e.preventDefault();
                    isPanning = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startPanX = panX;
                    startPanY = panY;
                    setCursor('grabbing');
                });
                window.addEventListener('mousemove', e => {
                    if (!isPanning) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    panX = startPanX + dx;
                    panY = startPanY + dy;
                    applyPan();
                });
                window.addEventListener('mouseup', () => {
                    if (isPanning) {
                        isPanning = false;
                        setCursor(allowPan ? 'grab' : '');
                    }
                });
                panStage.addEventListener(
                    'wheel',
                    e => {
                        if (!e.ctrlKey && !e.metaKey) return;
                        e.preventDefault();
                        const rect = panStage.getBoundingClientRect();
                        const cx = e.clientX - rect.left - panX;
                        const cy = e.clientY - rect.top - panY;
                        const before = _zoomLevel;
                        const step = Math.max(
                            0.05,
                            Math.min(0.5, Math.abs(e.deltaY) > 20 ? 0.2 : 0.1)
                        );
                        const next = Math.max(
                            0.05,
                            Math.min(20, before + (e.deltaY > 0 ? -step : step))
                        );
                        if (next === before) return;
                        const scale = next / before;
                        panX = panX - cx * (scale - 1);
                        panY = panY - cy * (scale - 1);
                        applyZoom(next);
                    },
                    { passive: false }
                );
                let lastTouchDist = null;
                let touchStartTime = 0;
                let doubleTapTimer = null;
                panStage.addEventListener(
                    'touchstart',
                    e => {
                        if (e.touches.length === 1) {
                            const t = e.touches[0];
                            isPanning = true;
                            startX = t.clientX;
                            startY = t.clientY;
                            startPanX = panX;
                            startPanY = panY;
                            setCursor('grabbing');
                            const now = Date.now();
                            if (now - touchStartTime < 300) {
                                // double tap -> toggle 100%/fit
                                const z =
                                    Math.abs(_zoomLevel - 1) < 0.01
                                        ? computeFitZoom()
                                        : 1;
                                applyZoom(z);
                                centerInView();
                                if (doubleTapTimer)
                                    clearTimeout(doubleTapTimer);
                            } else {
                                touchStartTime = now;
                                doubleTapTimer = setTimeout(() => {
                                    doubleTapTimer = null;
                                }, 320);
                            }
                        } else if (e.touches.length === 2) {
                            // Pinch start
                            const [a, b] = e.touches;
                            lastTouchDist = Math.hypot(
                                b.clientX - a.clientX,
                                b.clientY - a.clientY
                            );
                        }
                    },
                    { passive: true }
                );
                panStage.addEventListener(
                    'touchmove',
                    e => {
                        if (e.touches.length === 1 && isPanning) {
                            const t = e.touches[0];
                            const dx = t.clientX - startX;
                            const dy = t.clientY - startY;
                            panX = startPanX + dx;
                            panY = startPanY + dy;
                            applyPan();
                        } else if (
                            e.touches.length === 2 &&
                            lastTouchDist != null
                        ) {
                            e.preventDefault();
                            const [a, b] = e.touches;
                            const dist = Math.hypot(
                                b.clientX - a.clientX,
                                b.clientY - a.clientY
                            );
                            const rect = panStage.getBoundingClientRect();
                            const centerX =
                                (a.clientX + b.clientX) / 2 - rect.left - panX;
                            const centerY =
                                (a.clientY + b.clientY) / 2 - rect.top - panY;
                            const before = _zoomLevel;
                            const scale = dist / (lastTouchDist || dist);
                            const next = Math.max(
                                0.05,
                                Math.min(20, before * scale)
                            );
                            if (next !== before) {
                                panX = panX - centerX * (next / before - 1);
                                panY = panY - centerY * (next / before - 1);
                                applyZoom(next);
                            }
                            lastTouchDist = dist;
                        }
                    },
                    { passive: false }
                );
                panStage.addEventListener('touchend', () => {
                    isPanning = false;
                    lastTouchDist = null;
                    setCursor(panMode || allowPan ? 'grab' : '');
                });
            }
            const schedulePreview = () => {
                if (_previewTimer) clearTimeout(_previewTimer);
                const run = () => {
                    _previewTimer = null;
                    _updateResizePreview();
                };
                if (window.requestIdleCallback) {
                    _previewTimer = setTimeout(
                        () => requestIdleCallback(run, { timeout: 150 }),
                        50
                    );
                } else {
                    _previewTimer = setTimeout(
                        () => requestAnimationFrame(run),
                        50
                    );
                }
            };
            // Track dragging to reduce work and skip dithering during drag
            const markDragStart = () => {
                _isDraggingSize = true;
            };
            const markDragEnd = () => {
                _isDraggingSize = false;
                schedulePreview();
            };
            widthSlider.addEventListener('pointerdown', markDragStart);
            heightSlider.addEventListener('pointerdown', markDragStart);
            widthSlider.addEventListener('pointerup', markDragEnd);
            heightSlider.addEventListener('pointerup', markDragEnd);
            widthSlider.addEventListener('input', () => {
                onWidthInput();
                schedulePreview();
            });
            heightSlider.addEventListener('input', () => {
                onHeightInput();
                schedulePreview();
            });

            // Mask painting UX: brush size, modes, row/column fills, and precise coords
            let draggingMask = false;
            let lastPaintX = -1,
                lastPaintY = -1;
            let brushSize = 1;
            let rowColSize = 1;
            let maskMode = 'ignore'; // 'ignore' | 'unignore' | 'toggle'
            const brushEl = resizeContainer.querySelector('#maskBrushSize');
            const brushValEl = resizeContainer.querySelector(
                '#maskBrushSizeValue'
            );
            const btnIgnore = resizeContainer.querySelector('#maskModeIgnore');
            const btnUnignore =
                resizeContainer.querySelector('#maskModeUnignore');
            const btnToggle = resizeContainer.querySelector('#maskModeToggle');
            const clearIgnoredBtnEl =
                resizeContainer.querySelector('#clearIgnoredBtn');
            const invertMaskBtn =
                resizeContainer.querySelector('#invertMaskBtn');
            const rowColSizeEl = resizeContainer.querySelector('#rowColSize');
            const rowColSizeValEl =
                resizeContainer.querySelector('#rowColSizeValue');

            const updateModeButtons = () => {
                const map = [
                    [btnIgnore, 'ignore'],
                    [btnUnignore, 'unignore'],
                    [btnToggle, 'toggle'],
                ];
                for (const [el, m] of map) {
                    if (!el) continue;
                    const active = maskMode === m;
                    el.classList.toggle('active', active);
                    el.setAttribute('aria-pressed', active ? 'true' : 'false');
                }
            };
            const setMode = mode => {
                maskMode = mode;
                updateModeButtons();
            };
            if (brushEl && brushValEl) {
                brushEl.addEventListener('input', () => {
                    brushSize = parseInt(brushEl.value, 10) || 1;
                    brushValEl.textContent = brushSize;
                });
                brushValEl.textContent = brushEl.value;
                brushSize = parseInt(brushEl.value, 10) || 1;
            }
            if (rowColSizeEl && rowColSizeValEl) {
                rowColSizeEl.addEventListener('input', () => {
                    rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
                    rowColSizeValEl.textContent = rowColSize;
                });
                rowColSizeValEl.textContent = rowColSizeEl.value;
                rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
            }
            if (btnIgnore)
                btnIgnore.addEventListener('click', () => setMode('ignore'));
            if (btnUnignore)
                btnUnignore.addEventListener('click', () =>
                    setMode('unignore')
                );
            if (btnToggle)
                btnToggle.addEventListener('click', () => setMode('toggle'));
            // Initialize button state (default to toggle mode)
            updateModeButtons();

            const mapClientToPixel = (clientX, clientY) => {
                // Compute without rounding until final step to avoid drift at higher zoom
                const rect = baseCanvas.getBoundingClientRect();
                const scaleX = rect.width / baseCanvas.width;
                const scaleY = rect.height / baseCanvas.height;
                const dx = (clientX - rect.left) / scaleX;
                const dy = (clientY - rect.top) / scaleY;
                const x = Math.floor(dx);
                const y = Math.floor(dy);
                return { x, y };
            };

            const ensureMask = (w, h) => {
                if (
                    !state.resizeIgnoreMask ||
                    state.resizeIgnoreMask.length !== w * h
                ) {
                    state.resizeIgnoreMask = new Uint8Array(w * h);
                }
            };

            const paintCircle = (cx, cy, radius, value) => {
                const w = baseCanvas.width,
                    h = baseCanvas.height;
                ensureMask(w, h);
                const r2 = radius * radius;
                for (let yy = cy - radius; yy <= cy + radius; yy++) {
                    if (yy < 0 || yy >= h) continue;
                    for (let xx = cx - radius; xx <= cx + radius; xx++) {
                        if (xx < 0 || xx >= w) continue;
                        const dx = xx - cx,
                            dy = yy - cy;
                        if (dx * dx + dy * dy <= r2) {
                            const idx = yy * w + xx;
                            let val = state.resizeIgnoreMask[idx];
                            if (maskMode === 'toggle') {
                                val = val ? 0 : 1;
                            } else if (maskMode === 'ignore') {
                                val = 1;
                            } else {
                                val = 0;
                            }
                            state.resizeIgnoreMask[idx] = val;
                            if (_maskData) {
                                const p = idx * 4;
                                if (val) {
                                    _maskData[p] = 255;
                                    _maskData[p + 1] = 0;
                                    _maskData[p + 2] = 0;
                                    _maskData[p + 3] = 150;
                                } else {
                                    _maskData[p] = 0;
                                    _maskData[p + 1] = 0;
                                    _maskData[p + 2] = 0;
                                    _maskData[p + 3] = 0;
                                }
                                _markDirty(xx, yy);
                            }
                        }
                    }
                }
            };

            const paintRow = (y, value) => {
                const w = baseCanvas.width,
                    h = baseCanvas.height;
                ensureMask(w, h);
                if (y < 0 || y >= h) return;

                // Paint multiple rows based on rowColSize
                const halfSize = Math.floor(rowColSize / 2);
                const startY = Math.max(0, y - halfSize);
                const endY = Math.min(h - 1, y + halfSize);

                for (let rowY = startY; rowY <= endY; rowY++) {
                    for (let x = 0; x < w; x++) {
                        const idx = rowY * w + x;
                        let val = state.resizeIgnoreMask[idx];
                        if (maskMode === 'toggle') {
                            val = val ? 0 : 1;
                        } else if (maskMode === 'ignore') {
                            val = 1;
                        } else {
                            val = 0;
                        }
                        state.resizeIgnoreMask[idx] = val;
                        if (_maskData) {
                            const p = idx * 4;
                            if (val) {
                                _maskData[p] = 255;
                                _maskData[p + 1] = 0;
                                _maskData[p + 2] = 0;
                                _maskData[p + 3] = 150;
                            } else {
                                _maskData[p] = 0;
                                _maskData[p + 1] = 0;
                                _maskData[p + 2] = 0;
                                _maskData[p + 3] = 0;
                            }
                        }
                    }
                    if (_maskData) {
                        _markDirty(0, rowY);
                        _markDirty(w - 1, rowY);
                    }
                }
            };

            const paintColumn = (x, value) => {
                const w = baseCanvas.width,
                    h = baseCanvas.height;
                ensureMask(w, h);
                if (x < 0 || x >= w) return;

                // Paint multiple columns based on rowColSize
                const halfSize = Math.floor(rowColSize / 2);
                const startX = Math.max(0, x - halfSize);
                const endX = Math.min(w - 1, x + halfSize);

                for (let colX = startX; colX <= endX; colX++) {
                    for (let y = 0; y < h; y++) {
                        const idx = y * w + colX;
                        let val = state.resizeIgnoreMask[idx];
                        if (maskMode === 'toggle') {
                            val = val ? 0 : 1;
                        } else if (maskMode === 'ignore') {
                            val = 1;
                        } else {
                            val = 0;
                        }
                        state.resizeIgnoreMask[idx] = val;
                        if (_maskData) {
                            const p = idx * 4;
                            if (val) {
                                _maskData[p] = 255;
                                _maskData[p + 1] = 0;
                                _maskData[p + 2] = 0;
                                _maskData[p + 3] = 150;
                            } else {
                                _maskData[p] = 0;
                                _maskData[p + 1] = 0;
                                _maskData[p + 2] = 0;
                                _maskData[p + 3] = 0;
                            }
                        }
                    }
                    if (_maskData) {
                        _markDirty(colX, 0);
                        _markDirty(colX, h - 1);
                    }
                }
            };

            const redrawMaskOverlay = () => {
                // Only flush the dirty region; full rebuild happens on size change
                _flushDirty();
            };

            const handlePaint = e => {
                // Suppress painting while panning
                if ((e.buttons & 4) === 4 || (e.buttons & 2) === 2 || allowPan)
                    return;
                const { x, y } = mapClientToPixel(e.clientX, e.clientY);
                const w = baseCanvas.width,
                    h = baseCanvas.height;
                if (x < 0 || y < 0 || x >= w || y >= h) return;
                const radius = Math.max(1, Math.floor(brushSize / 2));
                if (e.shiftKey) {
                    paintRow(y);
                } else if (e.altKey) {
                    paintColumn(x);
                } else {
                    paintCircle(x, y, radius);
                }
                lastPaintX = x;
                lastPaintY = y;
                redrawMaskOverlay();
            };

            maskCanvas.addEventListener('mousedown', e => {
                if (e.button === 1 || e.button === 2 || allowPan) return; // let pan handler manage
                draggingMask = true;
                handlePaint(e);
            });
            // Avoid hijacking touch gestures for panning/zooming
            maskCanvas.addEventListener(
                'touchstart',
                e => {
                    /* let panStage handle */
                },
                { passive: true }
            );
            maskCanvas.addEventListener(
                'touchmove',
                e => {
                    /* let panStage handle */
                },
                { passive: true }
            );
            maskCanvas.addEventListener(
                'touchend',
                e => {
                    /* let panStage handle */
                },
                { passive: true }
            );
            window.addEventListener('mousemove', e => {
                if (draggingMask) handlePaint(e);
            });
            window.addEventListener('mouseup', () => {
                if (draggingMask) {
                    draggingMask = false;
                    saveBotSettings();
                }
            });

            if (clearIgnoredBtnEl)
                clearIgnoredBtnEl.addEventListener('click', () => {
                    const w = baseCanvas.width,
                        h = baseCanvas.height;
                    if (state.resizeIgnoreMask) state.resizeIgnoreMask.fill(0);
                    _ensureMaskOverlayBuffers(w, h, true);
                    _updateResizePreview();
                    saveBotSettings();
                });

            if (invertMaskBtn)
                invertMaskBtn.addEventListener('click', () => {
                    if (!state.resizeIgnoreMask) return;
                    for (let i = 0; i < state.resizeIgnoreMask.length; i++)
                        state.resizeIgnoreMask[i] = state.resizeIgnoreMask[i]
                            ? 0
                            : 1;
                    const w = baseCanvas.width,
                        h = baseCanvas.height;
                    _ensureMaskOverlayBuffers(w, h, true);
                    _updateResizePreview();
                    saveBotSettings();
                });

            confirmResize.onclick = async () => {
                const newWidth = parseInt(widthSlider.value, 10);
                const newHeight = parseInt(heightSlider.value, 10);

                // Generate the final paletted image data
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = newWidth;
                tempCanvas.height = newHeight;
                tempCtx.imageSmoothingEnabled = false;
                if (
                    baseProcessor !== processor &&
                    (!baseProcessor.img || !baseProcessor.canvas)
                ) {
                    await baseProcessor.load();
                }
                tempCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
                const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
                const data = imgData.data;
                const tThresh2 =
                    state.customTransparencyThreshold ||
                    CONFIG.TRANSPARENCY_THRESHOLD;
                let totalValidPixels = 0;
                const mask =
                    state.resizeIgnoreMask &&
                    state.resizeIgnoreMask.length === newWidth * newHeight
                        ? state.resizeIgnoreMask
                        : null;

                const applyFSDitherFinal = async () => {
                    const w = newWidth,
                        h = newHeight;
                    const n = w * h;
                    const { work, eligible } = ensureDitherBuffers(n);
                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const idx = y * w + x;
                            const i4 = idx * 4;
                            const r = data[i4],
                                g = data[i4 + 1],
                                b = data[i4 + 2],
                                a = data[i4 + 3];
                            const masked = mask && mask[idx];
                            const isEligible =
                                !masked &&
                                (state.paintTransparentPixels ||
                                    a >= tThresh2) &&
                                (state.paintWhitePixels ||
                                    !Utils.isWhitePixel(r, g, b));
                            eligible[idx] = isEligible ? 1 : 0;
                            work[idx * 3] = r;
                            work[idx * 3 + 1] = g;
                            work[idx * 3 + 2] = b;
                            if (!isEligible) {
                                data[i4 + 3] = 0;
                            }
                        }
                        // Yield to keep UI responsive
                        if ((y & 15) === 0) await Promise.resolve();
                    }

                    const diffuse = (nx, ny, er, eg, eb, factor) => {
                        if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
                        const nidx = ny * w + nx;
                        if (!eligible[nidx]) return;
                        const base = nidx * 3;
                        work[base] = Math.min(
                            255,
                            Math.max(0, work[base] + er * factor)
                        );
                        work[base + 1] = Math.min(
                            255,
                            Math.max(0, work[base + 1] + eg * factor)
                        );
                        work[base + 2] = Math.min(
                            255,
                            Math.max(0, work[base + 2] + eb * factor)
                        );
                    };

                    for (let y = 0; y < h; y++) {
                        for (let x = 0; x < w; x++) {
                            const idx = y * w + x;
                            if (!eligible[idx]) continue;
                            const base = idx * 3;
                            const r0 = work[base],
                                g0 = work[base + 1],
                                b0 = work[base + 2];
                            const [nr, ng, nb] = Utils.findClosestPaletteColor(
                                r0,
                                g0,
                                b0,
                                state.activeColorPalette
                            );
                            const i4 = idx * 4;
                            data[i4] = nr;
                            data[i4 + 1] = ng;
                            data[i4 + 2] = nb;
                            data[i4 + 3] = 255;
                            totalValidPixels++;

                            const er = r0 - nr;
                            const eg = g0 - ng;
                            const eb = b0 - nb;

                            diffuse(x + 1, y, er, eg, eb, 7 / 16);
                            diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
                            diffuse(x, y + 1, er, eg, eb, 5 / 16);
                            diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
                        }
                        // Yield every row to reduce jank
                        await Promise.resolve();
                    }
                };

                if (state.ditheringEnabled) {
                    await applyFSDitherFinal();
                } else {
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i],
                            g = data[i + 1],
                            b = data[i + 2],
                            a = data[i + 3];
                        const masked = mask && mask[i >> 2];
                        const isTransparent =
                            (!state.paintTransparentPixels && a < tThresh2) ||
                            masked;
                        const isWhiteAndSkipped =
                            !state.paintWhitePixels &&
                            Utils.isWhitePixel(r, g, b);
                        if (isTransparent || isWhiteAndSkipped) {
                            data[i + 3] = 0; // overlay transparency
                            continue;
                        }
                        totalValidPixels++;
                        const [nr, ng, nb] = Utils.findClosestPaletteColor(
                            r,
                            g,
                            b,
                            state.activeColorPalette
                        );
                        data[i] = nr;
                        data[i + 1] = ng;
                        data[i + 2] = nb;
                        data[i + 3] = 255;
                    }
                }
                tempCtx.putImageData(imgData, 0, 0);

                // Save the final pixel data for painting
                // Persist the paletted (and possibly dithered) pixels so painting uses the same output seen in overlay
                const palettedPixels = new Uint8ClampedArray(imgData.data);
                state.imageData.pixels = palettedPixels;
                state.imageData.width = newWidth;
                state.imageData.height = newHeight;
                state.imageData.totalPixels = totalValidPixels;
                state.totalPixels = totalValidPixels;
                state.paintedPixels = 0;

                state.resizeSettings = {
                    baseWidth: width,
                    baseHeight: height,
                    width: newWidth,
                    height: newHeight,
                };
                saveBotSettings();

                const finalImageBitmap = await createImageBitmap(tempCanvas);
                await overlayManager.setImage(finalImageBitmap);
                overlayManager.enable();
                toggleOverlayBtn.classList.add('active');
                toggleOverlayBtn.setAttribute('aria-pressed', 'true');

                // Keep state.imageData.processor as the original-based source; painting uses paletted pixels already stored

                updateStats();
                updateUI('resizeSuccess', 'success', {
                    width: newWidth,
                    height: newHeight,
                });
                closeResizeDialog();
            };

            downloadPreviewBtn.onclick = () => {
                try {
                    const w = baseCanvas.width,
                        h = baseCanvas.height;
                    const out = document.createElement('canvas');
                    out.width = w;
                    out.height = h;
                    const octx = out.getContext('2d');
                    octx.imageSmoothingEnabled = false;
                    octx.drawImage(baseCanvas, 0, 0);
                    octx.drawImage(maskCanvas, 0, 0);
                    const link = document.createElement('a');
                    link.download = 'wplace-preview.png';
                    link.href = out.toDataURL();
                    link.click();
                } catch (e) {
                    console.warn('Failed to download preview:', e);
                }
            };

            cancelResize.onclick = closeResizeDialog;

            resizeOverlay.style.display = 'block';
            resizeContainer.style.display = 'block';

            // Reinitialize color palette with current available colors
            initializeColorPalette(resizeContainer);

            _updateResizePreview();
            _resizeDialogCleanup = () => {
                try {
                    zoomSlider.replaceWith(zoomSlider.cloneNode(true));
                } catch {}
                try {
                    if (zoomInBtn)
                        zoomInBtn.replaceWith(zoomInBtn.cloneNode(true));
                } catch {}
                try {
                    if (zoomOutBtn)
                        zoomOutBtn.replaceWith(zoomOutBtn.cloneNode(true));
                } catch {}
            };
            setTimeout(() => {
                if (typeof computeFitZoom === 'function') {
                    const z = computeFitZoom();
                    if (!isNaN(z) && isFinite(z)) {
                        applyZoom(z);
                        centerInView();
                    }
                } else {
                    centerInView();
                }
            }, 0);
        }

        function closeResizeDialog() {
            try {
                if (typeof _resizeDialogCleanup === 'function') {
                    _resizeDialogCleanup();
                }
            } catch {}
            resizeOverlay.style.display = 'none';
            resizeContainer.style.display = 'none';
            _updateResizePreview = () => {};
            try {
                if (typeof cancelAnimationFrame === 'function' && _panRaf) {
                    cancelAnimationFrame(_panRaf);
                }
            } catch {}
            try {
                if (_previewTimer) {
                    clearTimeout(_previewTimer);
                    _previewTimer = null;
                }
            } catch {}
            _maskImageData = null;
            _maskData = null;
            _dirty = null;
            _ditherWorkBuf = null;
            _ditherEligibleBuf = null;
            _resizeDialogCleanup = null;
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', async () => {
                const availableColors = Utils.extractAvailableColors();
                if (availableColors === null || availableColors.length < 10) {
                    updateUI('noColorsFound', 'error');
                    Utils.showAlert(Utils.t('noColorsFound'), 'error');
                    return;
                }

                if (!state.colorsChecked) {
                    state.availableColors = availableColors;
                    state.colorsChecked = true;
                    updateUI('colorsFound', 'success', {
                        count: availableColors.length,
                    });
                    updateStats();
                    selectPosBtn.disabled = false;
                    // Only enable resize button if image is also loaded
                    if (state.imageLoaded) {
                        resizeBtn.disabled = false;
                    }
                }

                try {
                    updateUI('loadingImage', 'default');
                    const imageSrc = await Utils.createImageUploader();
                    if (!imageSrc) {
                        updateUI('colorsFound', 'success', {
                            count: state.availableColors.length,
                        });
                        return;
                    }

                    const processor = new ImageProcessor(imageSrc);
                    await processor.load();

                    const { width, height } = processor.getDimensions();
                    const pixels = processor.getPixelData();

                    let totalValidPixels = 0;
                    for (let i = 0; i < pixels.length; i += 4) {
                        const isTransparent =
                            !state.paintTransparentPixels &&
                            pixels[i + 3] <
                                (state.customTransparencyThreshold ||
                                    CONFIG.TRANSPARENCY_THRESHOLD);
                        const isWhiteAndSkipped =
                            !state.paintWhitePixels &&
                            Utils.isWhitePixel(
                                pixels[i],
                                pixels[i + 1],
                                pixels[i + 2]
                            );
                        if (!isTransparent && !isWhiteAndSkipped) {
                            totalValidPixels++;
                        }
                    }

                    state.imageData = {
                        width,
                        height,
                        pixels,
                        totalPixels: totalValidPixels,
                        processor,
                    };

                    state.totalPixels = totalValidPixels;
                    state.paintedPixels = 0;
                    state.imageLoaded = true;
                    state.lastPosition = { x: 0, y: 0 };

                    // Initialize painted map for tracking
                    Utils.initializePaintedMap(width, height);

                    // New image: clear previous resize settings
                    state.resizeSettings = null;
                    // Also clear any previous ignore mask
                    state.resizeIgnoreMask = null;
                    // Save original image for this browser (dataUrl + dims)
                    state.originalImage = { dataUrl: imageSrc, width, height };
                    saveBotSettings();

                    // Use the original image for the overlay initially
                    const imageBitmap = await createImageBitmap(processor.img);
                    await overlayManager.setImage(imageBitmap);
                    overlayManager.enable();
                    toggleOverlayBtn.disabled = false;
                    toggleOverlayBtn.classList.add('active');
                    toggleOverlayBtn.setAttribute('aria-pressed', 'true');

                    // Only enable resize button if colors have also been captured
                    if (state.colorsChecked) {
                        resizeBtn.disabled = false;
                    }
                    saveBtn.disabled = false;

                    if (state.startPosition) {
                        startBtn.disabled = false;
                    }

                    updateStats();
                    updateDataButtons();
                    updateUI('imageLoaded', 'success', {
                        count: totalValidPixels,
                    });
                } catch {
                    updateUI('imageError', 'error');
                }
            });
        }

        if (resizeBtn) {
            resizeBtn.addEventListener('click', () => {
                if (
                    state.imageLoaded &&
                    state.imageData.processor &&
                    state.colorsChecked
                ) {
                    showResizeDialog(state.imageData.processor);
                } else if (!state.colorsChecked) {
                    Utils.showAlert(
                        Utils.t('uploadImageFirstColors'),
                        'warning'
                    );
                }
            });
        }

        if (selectPosBtn) {
            selectPosBtn.addEventListener('click', async () => {
                if (state.selectingPosition) return;

                state.selectingPosition = true;
                state.startPosition = null;
                state.region = null;
                startBtn.disabled = true;

                Utils.showAlert(Utils.t('selectPositionAlert'), 'info');
                updateUI('waitingPosition', 'default');

                const tempFetch = async (url, options) => {
                    if (
                        typeof url === 'string' &&
                        url.includes('https://backend.wplace.live/s0/pixel/') &&
                        options?.method?.toUpperCase() === 'POST'
                    ) {
                        try {
                            const response = await originalFetch(url, options);
                            const clonedResponse = response.clone();
                            const data = await clonedResponse.json();

                            if (data?.painted === 1) {
                                const regionMatch = url.match(
                                    /\/pixel\/(\d+)\/(\d+)/
                                );
                                if (regionMatch && regionMatch.length >= 3) {
                                    state.region = {
                                        x: Number.parseInt(regionMatch[1]),
                                        y: Number.parseInt(regionMatch[2]),
                                    };
                                }

                                const payload = JSON.parse(options.body);
                                if (
                                    payload?.coords &&
                                    Array.isArray(payload.coords)
                                ) {
                                    state.startPosition = {
                                        x: payload.coords[0],
                                        y: payload.coords[1],
                                    };
                                    state.lastPosition = { x: 0, y: 0 };

                                    await overlayManager.setPosition(
                                        state.startPosition,
                                        state.region
                                    );

                                    if (state.imageLoaded) {
                                        startBtn.disabled = false;
                                    }

                                    window.fetch = originalFetch;
                                    state.selectingPosition = false;
                                    updateUI('positionSet', 'success');
                                }
                            }

                            return response;
                        } catch {
                            return originalFetch(url, options);
                        }
                    }
                    return originalFetch(url, options);
                };

                const originalFetch = window.fetch;
                window.fetch = tempFetch;

                setTimeout(() => {
                    if (state.selectingPosition) {
                        window.fetch = originalFetch;
                        state.selectingPosition = false;
                        updateUI('positionTimeout', 'error');
                        Utils.showAlert(Utils.t('positionTimeout'), 'error');
                    }
                }, 120000);
            });
        }

        async function startPainting() {
            if (!state.imageLoaded || !state.startPosition || !state.region) {
                updateUI('missingRequirements', 'error');
                return;
            }
            await tokenManager.ensureToken();
            if (!tokenManager.getToken()) return;

            state.running = true;
            state.stopFlag = false;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            uploadBtn.disabled = true;
            selectPosBtn.disabled = true;
            resizeBtn.disabled = true;
            saveBtn.disabled = true;
            toggleOverlayBtn.disabled = true;

            updateUI('startPaintingMsg', 'success');

            try {
                await processImage();
            } catch (e) {
                console.error('Unexpected error:', e);
                updateUI('paintingError', 'error');
            } finally {
                state.running = false;
                stopBtn.disabled = true;
                saveBtn.disabled = false;

                if (state.stopFlag) {
                    startBtn.disabled = false;
                } else {
                    startBtn.disabled = true;
                    uploadBtn.disabled = false;
                    selectPosBtn.disabled = false;
                    resizeBtn.disabled = false;
                }
                toggleOverlayBtn.disabled = false;
            }
        }

        if (startBtn) {
            startBtn.addEventListener('click', startPainting);
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                state.stopFlag = true;
                state.running = false;
                stopBtn.disabled = true;
                updateUI('paintingStoppedByUser', 'warning');

                if (state.imageLoaded && state.paintedPixels > 0) {
                    Utils.saveProgress();
                    Utils.showAlert(Utils.t('autoSaved'), 'success');
                }
            });
        }

        const checkSavedProgress = () => {
            const savedData = Utils.loadProgress();
            if (savedData && savedData.state.paintedPixels > 0) {
                const savedDate = new Date(
                    savedData.timestamp
                ).toLocaleString();
                const progress = Math.round(
                    (savedData.state.paintedPixels /
                        savedData.state.totalPixels) *
                        100
                );

                Utils.showAlert(
                    `${Utils.t('savedDataFound')}\n\n` +
                        `Saved: ${savedDate}\n` +
                        `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
                        `${Utils.t('clickLoadToContinue')}`,
                    'info'
                );
            }
        };

        setTimeout(checkSavedProgress, 1000);

        if (cooldownSlider && cooldownInput) {
            const updateCooldown = (newValue, source) => {
                const threshold = Math.max(
                    1,
                    Math.min(state.maxCharges || 999, parseInt(newValue))
                );
                state.cooldownChargeThreshold = threshold;

                if (source !== 'slider') cooldownSlider.value = threshold;
                if (source !== 'input') cooldownInput.value = threshold;

                saveBotSettings();
                NotificationManager.resetEdgeTracking(); // prevent spurious notify after threshold change
            };

            cooldownSlider.addEventListener('input', e => {
                updateCooldown(e.target.value, 'slider');
            });

            cooldownInput.addEventListener('input', e => {
                updateCooldown(e.target.value, 'input');
            });

            if (cooldownDecrease) {
                Utils.addHoldToRepeatListener(cooldownDecrease, () => {
                    updateCooldown(parseInt(cooldownInput.value) - 1, 'button');
                });
            }

            if (cooldownIncrease) {
                Utils.addHoldToRepeatListener(cooldownIncrease, () => {
                    updateCooldown(parseInt(cooldownInput.value) + 1, 'button');
                });
            }
        }

        loadBotSettings();
        // Ensure notification poller reflects current settings
        NotificationManager.syncFromState();
    }

    /**
     * Calculate milliseconds needed to reach target charges from current level.
     * @param {number} current - Current number of charges
     * @param {number} target - Target number of charges to reach
     * @param {number} cooldown - Cooldown time per charge in milliseconds
     * @param {number} [intervalMs=0] - Additional interval time
     * @returns {number} Time in milliseconds to reach target
     */
    function getMsToTargetCharges(current, target, cooldown, intervalMs = 0) {
        const remainingCharges = target - current;
        return Math.max(0, remainingCharges * cooldown - intervalMs);
    }

    /**
     * Update the charges threshold UI with current interval information.
     * @param {number} intervalMs - The interval time in milliseconds
     */
    function updateChargesThresholdUI(intervalMs) {
        if (state.stopFlag) return;

        const threshold = state.cooldownChargeThreshold;
        const remainingMs = getMsToTargetCharges(
            state.preciseCurrentCharges,
            threshold,
            state.cooldown,
            intervalMs
        );
        const timeText = Utils.msToTimeText(remainingMs);

        updateUI(
            'noChargesThreshold',
            'warning',
            {
                threshold,
                current: state.displayCharges,
                time: timeText,
            },
            true
        );
    }

    /**
     * Generate coordinate array for painting pixels in the specified order.
     * @param {number} width - Image width in pixels
     * @param {number} height - Image height in pixels
     * @param {string} mode - Coordinate generation mode ('rows', 'columns', 'blocks')
     * @param {string} direction - Starting direction ('top-left', 'bottom-left', etc.)
     * @param {boolean} snake - Whether to use snake pattern (reverse alternate rows/columns)
     * @param {number} blockWidth - Width of blocks (for block mode)
     * @param {number} blockHeight - Height of blocks (for block mode)
     * @returns {Array<{x: number, y: number}>} Array of coordinate objects
     */
    function generateCoordinates(
        width,
        height,
        mode,
        direction,
        snake,
        blockWidth,
        blockHeight
    ) {
        const coords = [];
        console.log(
            'Generating coordinates with \n  mode:',
            mode,
            '\n  direction:',
            direction,
            '\n  snake:',
            snake,
            '\n  blockWidth:',
            blockWidth,
            '\n  blockHeight:',
            blockHeight
        );
        // --------- Standard 4 corners traversal ----------
        let xStart, xEnd, xStep;
        let yStart, yEnd, yStep;
        switch (direction) {
            case 'top-left':
                xStart = 0;
                xEnd = width;
                xStep = 1;
                yStart = 0;
                yEnd = height;
                yStep = 1;
                break;
            case 'top-right':
                xStart = width - 1;
                xEnd = -1;
                xStep = -1;
                yStart = 0;
                yEnd = height;
                yStep = 1;
                break;
            case 'bottom-left':
                xStart = 0;
                xEnd = width;
                xStep = 1;
                yStart = height - 1;
                yEnd = -1;
                yStep = -1;
                break;
            case 'bottom-right':
                xStart = width - 1;
                xEnd = -1;
                xStep = -1;
                yStart = height - 1;
                yEnd = -1;
                yStep = -1;
                break;
            default:
                throw new Error(`Unknown direction: ${direction}`);
        }

        // --------- Traversal modes ----------
        if (mode === 'rows') {
            for (let y = yStart; y !== yEnd; y += yStep) {
                if (snake && (y - yStart) % 2 !== 0) {
                    for (
                        let x = xEnd - xStep;
                        x !== xStart - xStep;
                        x -= xStep
                    ) {
                        coords.push([x, y]);
                    }
                } else {
                    for (let x = xStart; x !== xEnd; x += xStep) {
                        coords.push([x, y]);
                    }
                }
            }
        } else if (mode === 'columns') {
            for (let x = xStart; x !== xEnd; x += xStep) {
                if (snake && (x - xStart) % 2 !== 0) {
                    for (
                        let y = yEnd - yStep;
                        y !== yStart - yStep;
                        y -= yStep
                    ) {
                        coords.push([x, y]);
                    }
                } else {
                    for (let y = yStart; y !== yEnd; y += yStep) {
                        coords.push([x, y]);
                    }
                }
            }
        } else if (mode === 'circle-out') {
            const cx = Math.floor(width / 2);
            const cy = Math.floor(height / 2);
            const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));

            for (let r = 0; r <= maxRadius; r++) {
                for (let y = cy - r; y <= cy + r; y++) {
                    for (let x = cx - r; x <= cx + r; x++) {
                        if (x >= 0 && x < width && y >= 0 && y < height) {
                            const dist = Math.max(
                                Math.abs(x - cx),
                                Math.abs(y - cy)
                            );
                            if (dist === r) coords.push([x, y]);
                        }
                    }
                }
            }
        } else if (mode === 'circle-in') {
            const cx = Math.floor(width / 2);
            const cy = Math.floor(height / 2);
            const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));

            for (let r = maxRadius; r >= 0; r--) {
                for (let y = cy - r; y <= cy + r; y++) {
                    for (let x = cx - r; x <= cx + r; x++) {
                        if (x >= 0 && x < width && y >= 0 && y < height) {
                            const dist = Math.max(
                                Math.abs(x - cx),
                                Math.abs(y - cy)
                            );
                            if (dist === r) coords.push([x, y]);
                        }
                    }
                }
            }
        } else if (mode === 'blocks' || mode === 'shuffle-blocks') {
            const blocks = [];
            for (let by = 0; by < height; by += blockHeight) {
                for (let bx = 0; bx < width; bx += blockWidth) {
                    const block = [];
                    for (
                        let y = by;
                        y < Math.min(by + blockHeight, height);
                        y++
                    ) {
                        for (
                            let x = bx;
                            x < Math.min(bx + blockWidth, width);
                            x++
                        ) {
                            block.push([x, y]);
                        }
                    }
                    blocks.push(block);
                }
            }

            if (mode === 'shuffle-blocks') {
                // Simple Fisher-Yates shuffle
                for (let i = blocks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
                }
            }

            // Concatenate all blocks
            for (const block of blocks) {
                coords.push(...block);
            }
        } else {
            throw new Error(`Unknown mode: ${mode}`);
        }

        return coords;
    }

    /**
     * Flush a batch of pixels by sending them to the backend.
     * @param {Array} pixelBatch - Array of pixel objects to send
     * @returns {Promise<void>}
     */
    async function flushPixelBatch(pixelBatch) {
        if (!pixelBatch || pixelBatch.pixels.length === 0) return true;

        const batchSize = pixelBatch.pixels.length;
        console.log(
            `📦 Sending batch with ${batchSize} pixels (region: ${pixelBatch.regionX},${pixelBatch.regionY})`
        );
        const success = await sendBatchWithRetry(
            pixelBatch.pixels,
            pixelBatch.regionX,
            pixelBatch.regionY
        );
        if (success) {
            pixelBatch.pixels.forEach(p => {
                state.paintedPixels++;
                Utils.markPixelPainted(
                    p.x,
                    p.y,
                    pixelBatch.regionX,
                    pixelBatch.regionY
                );
            });
            state.fullChargeData = {
                ...state.fullChargeData,
                spentSinceShot: state.fullChargeData.spentSinceShot + batchSize,
            };
            updateStats();
            updateUI('paintingProgress', 'default', {
                painted: state.paintedPixels,
                total: state.totalPixels,
            });
            Utils.performSmartSave();

            if (
                CONFIG.PAINTING_SPEED_ENABLED &&
                state.paintingSpeed > 0 &&
                batchSize > 0
            ) {
                const delayPerPixel = 1000 / state.paintingSpeed;
                const totalDelay = Math.max(100, delayPerPixel * batchSize);
                await Utils.sleep(totalDelay);
            }
        } else {
            console.error(
                `❌ Batch failed permanently after retries. Stopping painting.`
            );
            state.stopFlag = true;
            updateUI('paintingBatchFailed', 'error');
        }

        pixelBatch.pixels = [];
        return success;
    }

    /**
     * Main image processing function that handles the painting workflow.
     * Converts image pixels to canvas coordinates, matches colors, and sends batches.
     * @returns {Promise<void>}
     */
    async function processImage() {
        const { width, height, pixels } = state.imageData;
        const { x: startX, y: startY } = state.startPosition;
        const { x: regionX, y: regionY } = state.region;

        // todo force load tiles
        const tilesReady = await overlayManager.waitForTiles(
            regionX,
            regionY,
            width,
            height,
            startX,
            startY,
            10000 // timeout 10s
        );

        if (!tilesReady) {
            updateUI('overlayTilesNotLoaded', 'error');
            state.stopFlag = true;
            return;
        }

        let pixelBatch = null;
        let skippedPixels = {
            transparent: 0,
            white: 0,
            alreadyPainted: 0,
            colorUnavailable: 0,
        };

        const transparencyThreshold =
            state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;

        function checkPixelEligibility(x, y) {
            const idx = (y * width + x) * 4;
            const r = pixels[idx],
                g = pixels[idx + 1],
                b = pixels[idx + 2],
                a = pixels[idx + 3];

            if (!state.paintTransparentPixels && a < transparencyThreshold)
                return {
                    eligible: false,
                    reason: 'transparent',
                };
            if (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))
                return {
                    eligible: false,
                    reason: 'white',
                };

            let targetRgb = Utils.isWhitePixel(r, g, b)
                ? [255, 255, 255]
                : Utils.findClosestPaletteColor(
                      r,
                      g,
                      b,
                      state.activeColorPalette
                  );

            // Template color ID, normalized/mapped to the nearest available color in our palette.
            // Example: template requires "Slate", but we only have "Dark Gray" available
            // → mappedTargetColorId = ID of Dark Gray.
            //
            // If `state.paintUnavailablePixels` is enabled, the painting would stop earlier
            // because "Slate" was not found (null returned).
            //
            // Else, the template "Slate" is mapped to the closest available color (e.g., "Dark Gray"),
            // and we proceed with painting using that mapped color.
            //
            // In this case, if the canvas pixel is already Slate (mapped to available Dark Gray),
            // we skip painting, since template and canvas both resolve to the same available color (Dark Gray).
            const mappedTargetColorId = Utils.resolveColor(
                targetRgb,
                state.availableColors,
                !state.paintUnavailablePixels
            );

            // Technically, checking only `!mappedTargetColorId.id` would be enough,
            // but combined with `state.paintUnavailablePixels` it makes the logic explicit:
            // we only skip when the template color cannot be mapped AND strict mode is on.
            if (!state.paintUnavailablePixels && !mappedTargetColorId.id) {
                return {
                    eligible: false,
                    reason: 'colorUnavailable',
                    r,
                    g,
                    b,
                    a,
                    mappedColorId: mappedTargetColorId.id,
                };
            }
            return {
                eligible: true,
                r,
                g,
                b,
                a,
                mappedColorId: mappedTargetColorId.id,
            };
        }

        function skipPixel(reason, id, rgb, x, y) {
            if (reason !== 'transparent') {
                console.log(
                    `Skipped pixel for ${reason} (id: ${id}, (${rgb.join(', ')})) at (${x}, ${y})`
                );
            }
            skippedPixels[reason]++;
        }

        try {
            const coords = generateCoordinates(
                width,
                height,
                state.coordinateMode,
                state.coordinateDirection,
                state.coordinateSnake,
                state.blockWidth,
                state.blockHeight
            );

            outerLoop: for (const [x, y] of coords) {
                if (state.stopFlag) {
                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        console.log(
                            `🎯 Sending last batch before stop with ${pixelBatch.pixels.length} pixels`
                        );
                        await flushPixelBatch(pixelBatch);
                    }
                    state.lastPosition = { x, y };
                    updateUI('paintingPaused', 'warning', { x, y });
                    // noinspection UnnecessaryLabelOnBreakStatementJS
                    break outerLoop;
                }

                const targetPixelInfo = checkPixelEligibility(x, y);
                let absX = startX + x;
                let absY = startY + y;

                let adderX = Math.floor(absX / 1000);
                let adderY = Math.floor(absY / 1000);
                let pixelX = absX % 1000;
                let pixelY = absY % 1000;

                // Template color ID, normalized/mapped to the nearest available color in our palette.
                // Example: template requires "Slate", but we only have "Dark Gray" available
                // → mappedTargetColorId = ID of Dark Gray.
                //
                // If `state.paintUnavailablePixels` is enabled, the painting would stop earlier
                // because "Slate" was not found (null returned).
                //
                // Else, the template "Slate" is mapped to the closest available color (e.g., "Dark Gray"),
                // and we proceed with painting using that mapped color.
                //
                // In this case, if the canvas pixel is already Slate (mapped to available Dark Gray),
                // we skip painting, since template and canvas both resolve to the same available color (Dark Gray).
                const targetMappedColorId = targetPixelInfo.mappedColorId;

                if (!targetPixelInfo.eligible) {
                    skipPixel(
                        targetPixelInfo.reason,
                        targetMappedColorId,
                        [
                            targetPixelInfo.r,
                            targetPixelInfo.g,
                            targetPixelInfo.b,
                        ],
                        pixelX,
                        pixelY
                    );
                    continue;
                }

                // console.log(`[DEBUG] Pixel at (${pixelX}, ${pixelY}) eligible: RGB=${targetPixelInfo.r}, ${targetPixelInfo.g}, ${targetPixelInfo.b},
                //  alpha=${targetPixelInfo.a}, mappedColorId=${targetMappedColorId}`);

                if (
                    !pixelBatch ||
                    pixelBatch.regionX !== regionX + adderX ||
                    pixelBatch.regionY !== regionY + adderY
                ) {
                    if (pixelBatch && pixelBatch.pixels.length > 0) {
                        console.log(
                            `🌍 Sending region-change batch with ${pixelBatch.pixels.length} pixels (switching to region ${
                                regionX + adderX
                            },${regionY + adderY})`
                        );
                        const success = await flushPixelBatch(pixelBatch);

                        if (success) {
                            if (
                                CONFIG.PAINTING_SPEED_ENABLED &&
                                state.paintingSpeed > 0 &&
                                pixelBatch.pixels.length > 0
                            ) {
                                const batchDelayFactor = Math.max(
                                    1,
                                    100 / state.paintingSpeed
                                );
                                const totalDelay = Math.max(
                                    100,
                                    batchDelayFactor * pixelBatch.pixels.length
                                );
                                await Utils.sleep(totalDelay);
                            }
                            updateStats();
                        } else {
                            console.error(
                                `❌ Batch failed permanently after retries. Stopping painting.`
                            );
                            state.stopFlag = true;
                            updateUI('paintingBatchFailed', 'error');
                            // noinspection UnnecessaryLabelOnBreakStatementJS
                            break outerLoop;
                        }
                    }

                    pixelBatch = {
                        regionX: regionX + adderX,
                        regionY: regionY + adderY,
                        pixels: [],
                    };
                }

                try {
                    const tileKeyParts = [
                        pixelBatch.regionX,
                        pixelBatch.regionY,
                    ];

                    const tilePixelRGBA =
                        await overlayManager.getTilePixelColor(
                            tileKeyParts[0],
                            tileKeyParts[1],
                            pixelX,
                            pixelY
                        );

                    if (tilePixelRGBA && Array.isArray(tilePixelRGBA)) {
                        // Resolve the actual canvas pixel color to the closest available color.
                        // (The raw canvas RGB [er, eg, eb] is mapped into state.availableColors)
                        // so that comparison is consistent with targetMappedColorId.
                        const mappedCanvasColor = Utils.resolveColor(
                            tilePixelRGBA.slice(0, 3),
                            state.availableColors
                        );
                        const isMatch =
                            mappedCanvasColor.id === targetMappedColorId;
                        if (isMatch) {
                            skipPixel(
                                'alreadyPainted',
                                targetMappedColorId,
                                [
                                    targetPixelInfo.r,
                                    targetPixelInfo.g,
                                    targetPixelInfo.b,
                                ],
                                pixelX,
                                pixelY
                            );
                            continue;
                        }
                        console.debug(
                            `[COMPARE] Pixel at 📍 (${pixelX}, ${pixelY}) in region (${
                                regionX + adderX
                            }, ${regionY + adderY})\n` +
                                `  ├── Current color: rgb(${tilePixelRGBA.slice(0, 3).join(', ')}) (id: ${mappedCanvasColor.id})\n` +
                                `  ├── Target color:  rgb(${targetPixelInfo.r}, ${targetPixelInfo.g}, ${targetPixelInfo.b}) (id: ${targetMappedColorId})\n` +
                                `  └── Status: ${
                                    isMatch
                                        ? '✅ Already painted → SKIP'
                                        : '🔴 Needs paint → PAINT'
                                }\n`
                        );
                    }
                } catch (e) {
                    console.error(
                        `[DEBUG] Error checking existing pixel at (${pixelX}, ${pixelY}):`,
                        e
                    );
                    updateUI('paintingPixelCheckFailed', 'error', {
                        x: pixelX,
                        y: pixelY,
                    });
                    state.stopFlag = true;
                    // noinspection UnnecessaryLabelOnBreakStatementJS
                    break outerLoop;
                }

                pixelBatch.pixels.push({
                    x: pixelX,
                    y: pixelY,
                    color: targetMappedColorId,
                    localX: x,
                    localY: y,
                });

                const maxBatchSize = calculateBatchSize();
                if (pixelBatch.pixels.length >= maxBatchSize) {
                    const modeText =
                        state.batchMode === 'random'
                            ? `random (${state.randomBatchMin}-${state.randomBatchMax})`
                            : 'normal';
                    console.log(
                        `📦 Sending batch with ${pixelBatch.pixels.length} pixels (mode: ${modeText}, target: ${maxBatchSize})`
                    );
                    const success = await flushPixelBatch(pixelBatch);
                    if (!success) {
                        console.error(
                            `❌ Batch failed permanently after retries. Stopping painting.`
                        );
                        state.stopFlag = true;
                        updateUI('paintingBatchFailed', 'error');
                        // noinspection UnnecessaryLabelOnBreakStatementJS
                        break outerLoop;
                    }

                    pixelBatch.pixels = [];
                }

                if (
                    state.displayCharges < state.cooldownChargeThreshold &&
                    !state.stopFlag
                ) {
                    await Utils.dynamicSleep(() => {
                        if (
                            state.displayCharges >=
                            state.cooldownChargeThreshold
                        ) {
                            NotificationManager.maybeNotifyChargesReached(true);
                            return 0;
                        }
                        if (state.stopFlag) return 0;
                        return getMsToTargetCharges(
                            state.preciseCurrentCharges,
                            state.cooldownChargeThreshold,
                            state.cooldown
                        );
                    });
                }

                if (state.stopFlag) {
                    // noinspection UnnecessaryLabelOnBreakStatementJS
                    break outerLoop;
                }
            }

            if (pixelBatch && pixelBatch.pixels.length > 0 && !state.stopFlag) {
                console.log(
                    `🏁 Sending final batch with ${pixelBatch.pixels.length} pixels`
                );
                const success = await flushPixelBatch(pixelBatch);
                if (!success) {
                    console.warn(
                        `⚠️ Final batch failed with ${pixelBatch.pixels.length} pixels after all retries.`
                    );
                }
            }
        } finally {
            if (window._chargesInterval) clearInterval(window._chargesInterval);
            window._chargesInterval = null;
        }

        if (state.stopFlag) {
            // Save progress when stopped to preserve painted map
            Utils.saveProgress();
        } else {
            updateUI('paintingComplete', 'success', {
                count: state.paintedPixels,
            });
            state.lastPosition = { x: 0, y: 0 };
            // Keep painted map until user starts new project
            // state.paintedMap = null  // Commented out to preserve data
            Utils.saveProgress(); // Save final complete state
            overlayManager.clear();
            const toggleOverlayBtn =
                document.getElementById('toggleOverlayBtn');
            if (toggleOverlayBtn) {
                toggleOverlayBtn.classList.remove('active');
                toggleOverlayBtn.disabled = true;
            }
        }

        // Log skip statistics
        console.log(`📊 Pixel Statistics:`);
        console.log(`   Painted: ${state.paintedPixels}`);
        console.log(`   Skipped - Transparent: ${skippedPixels.transparent}`);
        console.log(`   Skipped - White (disabled): ${skippedPixels.white}`);
        console.log(
            `   Skipped - Already painted: ${skippedPixels.alreadyPainted}`
        );
        console.log(
            `   Skipped - Color Unavailable: ${skippedPixels.colorUnavailable}`
        );
        console.log(
            `   Total processed: ${
                state.paintedPixels +
                skippedPixels.transparent +
                skippedPixels.white +
                skippedPixels.alreadyPainted +
                skippedPixels.colorUnavailable
            }`
        );

        updateStats();
    }

    // Helper function to calculate batch size based on mode
    /**
     * Calculate the optimal batch size for pixel painting based on current settings.
     * @returns {number} The calculated batch size
     */
    function calculateBatchSize() {
        let targetBatchSize;

        if (state.batchMode === 'random') {
            // Generate random batch size within the specified range
            const min = Math.max(1, state.randomBatchMin);
            const max = Math.max(min, state.randomBatchMax);
            targetBatchSize = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log(
                `🎲 Random batch size generated: ${targetBatchSize} (range: ${min}-${max})`
            );
        } else {
            // Normal mode - use the fixed paintingSpeed value
            targetBatchSize = state.paintingSpeed;
        }

        // Always limit by available charges
        const maxAllowed = state.displayCharges;
        const finalBatchSize = Math.min(targetBatchSize, maxAllowed);

        return finalBatchSize;
    }

    // Helper function to retry batch until success with exponential backoff
    /**
     * Send a pixel batch with automatic retry logic.
     * @param {Array} pixelBatch - Array of pixel objects to send
     * @param {number} regionX - Region X coordinate
     * @param {number} regionY - Region Y coordinate
     * @param {number} [maxRetries=MAX_BATCH_RETRIES] - Maximum retry attempts
     * @returns {Promise<boolean>} True if successful, false if all retries failed
     */
    async function sendBatchWithRetry(
        pixels,
        regionX,
        regionY,
        maxRetries = MAX_BATCH_RETRIES
    ) {
        let attempt = 0;
        while (attempt < maxRetries && !state.stopFlag) {
            attempt++;
            console.log(
                `🔄 Attempting to send batch (attempt ${attempt}/${maxRetries}) for region ${regionX},${regionY} with ${pixels.length} pixels`
            );

            const result = await sendPixelBatch(pixels, regionX, regionY);

            if (result === true) {
                console.log(`✅ Batch succeeded on attempt ${attempt}`);
                return true;
            } else if (result === 'token_error') {
                console.log(
                    `🔑 Token error on attempt ${attempt}, regenerating...`
                );
                updateUI('captchaSolving', 'warning');
                try {
                    await tokenManager.handleCaptcha(state);
                    // Don't count token regeneration as a failed attempt
                    attempt--;
                    continue;
                } catch (e) {
                    console.error(
                        `❌ Token regeneration failed on attempt ${attempt}:`,
                        e
                    );
                    updateUI('captchaFailed', 'error');
                    // Wait longer before retrying after token failure
                    await Utils.sleep(5000);
                }
            } else {
                console.warn(
                    `⚠️ Batch failed on attempt ${attempt}, retrying...`
                );
                // Exponential backoff with jitter
                const baseDelay = Math.min(
                    1000 * Math.pow(2, attempt - 1),
                    30000
                ); // Max 30s
                const jitter = Math.random() * 1000; // Add up to 1s random delay
                await Utils.sleep(baseDelay + jitter);
            }
        }

        if (attempt >= maxRetries) {
            console.error(
                `❌ Batch failed after ${maxRetries} attempts (MAX_BATCH_RETRIES=${MAX_BATCH_RETRIES}). This will stop painting to prevent infinite loops.`
            );
            updateUI('paintingError', 'error');
            return false;
        }

        return false;
    }

    /**
     * Send a batch of pixels to the backend API.
     * @param {Array} pixelBatch - Array of pixel objects with x, y, and color data
     * @param {number} regionX - Region X coordinate
     * @param {number} regionY - Region Y coordinate
     * @returns {Promise<boolean>} True if request was successful
     */
    async function sendPixelBatch(pixelBatch, regionX, regionY) {
        let token = tokenManager.getToken();

        // Generate new token if we don't have one
        if (!token) {
            try {
                console.log('🔑 Generating Turnstile token for pixel batch...');
                token = await tokenManager.handleCaptcha(state);
            } catch (error) {
                console.error('❌ Failed to generate Turnstile token:', error);
                return 'token_error';
            }
        }

        const coords = new Array(pixelBatch.length * 2);
        const colors = new Array(pixelBatch.length);
        for (let i = 0; i < pixelBatch.length; i++) {
            const pixel = pixelBatch[i];
            coords[i * 2] = pixel.x;
            coords[i * 2 + 1] = pixel.y;
            colors[i] = pixel.color;
        }

        try {
            const payload = { coords, colors, t: token };

            const res = await fetch(
                `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                }
            );

            if (res.status === 403) {
                let data = null;
                try {
                    data = await res.json();
                } catch (_) {}
                console.error(
                    '❌ 403 Forbidden. Turnstile token might be invalid or expired.'
                );

                // Try to generate a new token and retry once
                try {
                    console.log('🔄 Regenerating Turnstile token after 403...');
                    token = await tokenManager.handleCaptcha(state);

                    // Retry the request with new token
                    const retryPayload = { coords, colors, t: token };
                    const retryRes = await fetch(
                        `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain;charset=UTF-8',
                            },
                            credentials: 'include',
                            body: JSON.stringify(retryPayload),
                        }
                    );

                    if (retryRes.status === 403) {
                        tokenManager.invalidateToken();
                        return 'token_error';
                    }

                    const retryData = await retryRes.json();
                    return retryData?.painted === pixelBatch.length;
                } catch (retryError) {
                    console.error('❌ Token regeneration failed:', retryError);
                    tokenManager.invalidateToken();
                    return 'token_error';
                }
            }

            const data = await res.json();
            return data?.painted === pixelBatch.length;
        } catch (e) {
            console.error('Batch paint request failed:', e);
            return false;
        }
    }

    /**
     * Save current bot settings to localStorage for persistence.
     */
    function saveBotSettings() {
        try {
            const settings = {
                paintingSpeed: state.paintingSpeed,
                paintingSpeedEnabled:
                    document.getElementById('enableSpeedToggle')?.checked,
                batchMode: state.batchMode, // "normal" or "random"
                randomBatchMin: state.randomBatchMin,
                randomBatchMax: state.randomBatchMax,
                cooldownChargeThreshold: state.cooldownChargeThreshold,
                tokenSource: state.tokenSource, // "generator", "hybrid", or "manual"
                minimized: state.minimized,
                overlayOpacity: state.overlayOpacity,
                blueMarbleEnabled: document.getElementById(
                    'enableBlueMarbleToggle'
                )?.checked,
                ditheringEnabled: state.ditheringEnabled,
                colorMatchingAlgorithm: state.colorMatchingAlgorithm,
                enableChromaPenalty: state.enableChromaPenalty,
                chromaPenaltyWeight: state.chromaPenaltyWeight,
                customTransparencyThreshold: state.customTransparencyThreshold,
                customWhiteThreshold: state.customWhiteThreshold,
                paintWhitePixels: state.paintWhitePixels,
                paintTransparentPixels: state.paintTransparentPixels,
                resizeSettings: state.resizeSettings,
                paintUnavailablePixels: state.paintUnavailablePixels,
                coordinateMode: state.coordinateMode,
                coordinateDirection: state.coordinateDirection,
                coordinateSnake: state.coordinateSnake,
                blockWidth: state.blockWidth,
                blockHeight: state.blockHeight, // Save ignore mask (as base64) with its dimensions
                resizeIgnoreMask:
                    state.resizeIgnoreMask &&
                    state.resizeSettings &&
                    state.resizeSettings.width * state.resizeSettings.height ===
                        state.resizeIgnoreMask.length
                        ? {
                              w: state.resizeSettings.width,
                              h: state.resizeSettings.height,
                              data: btoa(
                                  String.fromCharCode(...state.resizeIgnoreMask)
                              ),
                          }
                        : null, // Notifications
                notificationsEnabled: state.notificationsEnabled,
                notifyOnChargesReached: state.notifyOnChargesReached,
                notifyOnlyWhenUnfocused: state.notifyOnlyWhenUnfocused,
                notificationIntervalMinutes: state.notificationIntervalMinutes,
                originalImage: state.originalImage,
            };
            CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled;
            // AUTO_CAPTCHA_ENABLED is always true - no need to save/load

            localStorage.setItem(
                'wplace-bot-settings',
                JSON.stringify(settings)
            );
        } catch (e) {
            console.warn('Could not save bot settings:', e);
        }
    }

    /**
     * Load bot settings from localStorage and apply them to current state.
     */
    function loadBotSettings() {
        try {
            const saved = localStorage.getItem('wplace-bot-settings');
            if (!saved) return;
            const settings = JSON.parse(saved);

            state.paintingSpeed =
                settings.paintingSpeed || CONFIG.PAINTING_SPEED.DEFAULT;
            state.batchMode = settings.batchMode || CONFIG.BATCH_MODE; // Default to "normal"
            state.randomBatchMin =
                settings.randomBatchMin || CONFIG.RANDOM_BATCH_RANGE.MIN;
            state.randomBatchMax =
                settings.randomBatchMax || CONFIG.RANDOM_BATCH_RANGE.MAX;
            state.cooldownChargeThreshold =
                settings.cooldownChargeThreshold ||
                CONFIG.COOLDOWN_CHARGE_THRESHOLD;
            state.tokenSource = settings.tokenSource || CONFIG.TOKEN_SOURCE; // Default to "generator"
            state.minimized = settings.minimized ?? false;
            CONFIG.PAINTING_SPEED_ENABLED =
                settings.paintingSpeedEnabled ?? false;
            CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled ?? false;
            state.overlayOpacity =
                settings.overlayOpacity ?? CONFIG.OVERLAY.OPACITY_DEFAULT;
            state.blueMarbleEnabled =
                settings.blueMarbleEnabled ??
                CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;
            state.ditheringEnabled = settings.ditheringEnabled ?? false;
            state.colorMatchingAlgorithm =
                settings.colorMatchingAlgorithm || 'lab';
            state.enableChromaPenalty = settings.enableChromaPenalty ?? true;
            state.chromaPenaltyWeight = settings.chromaPenaltyWeight ?? 0.15;
            state.customTransparencyThreshold =
                settings.customTransparencyThreshold ??
                CONFIG.TRANSPARENCY_THRESHOLD;
            state.customWhiteThreshold =
                settings.customWhiteThreshold ?? CONFIG.WHITE_THRESHOLD;
            state.paintWhitePixels = settings.paintWhitePixels ?? true;
            state.paintTransparentPixels =
                settings.paintTransparentPixels ?? false;
            state.resizeSettings = settings.resizeSettings ?? null;
            state.originalImage = settings.originalImage ?? null;
            state.paintUnavailablePixels =
                settings.paintUnavailablePixels ?? CONFIG.PAINT_UNAVAILABLE;
            state.coordinateMode =
                settings.coordinateMode ?? CONFIG.COORDINATE_MODE;
            state.coordinateDirection =
                settings.coordinateDirection ?? CONFIG.COORDINATE_DIRECTION;
            state.coordinateSnake =
                settings.coordinateSnake ?? CONFIG.COORDINATE_SNAKE;
            state.blockWidth =
                settings.blockWidth ?? CONFIG.COORDINATE_BLOCK_WIDTH;
            state.blockHeight =
                settings.blockHeight ?? CONFIG.COORDINATE_BLOCK_HEIGHT;
            // Notifications
            state.notificationsEnabled =
                settings.notificationsEnabled ?? CONFIG.NOTIFICATIONS.ENABLED;
            state.notifyOnChargesReached =
                settings.notifyOnChargesReached ??
                CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED;
            state.notifyOnlyWhenUnfocused =
                settings.notifyOnlyWhenUnfocused ??
                CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED;
            state.notificationIntervalMinutes =
                settings.notificationIntervalMinutes ??
                CONFIG.NOTIFICATIONS.REPEAT_MINUTES;
            // Restore ignore mask if dims match current resizeSettings
            if (
                settings.resizeIgnoreMask &&
                settings.resizeIgnoreMask.data &&
                state.resizeSettings &&
                settings.resizeIgnoreMask.w === state.resizeSettings.width &&
                settings.resizeIgnoreMask.h === state.resizeSettings.height
            ) {
                try {
                    const bin = atob(settings.resizeIgnoreMask.data);
                    const arr = new Uint8Array(bin.length);
                    for (let i = 0; i < bin.length; i++)
                        arr[i] = bin.charCodeAt(i);
                    state.resizeIgnoreMask = arr;
                } catch {
                    state.resizeIgnoreMask = null;
                }
            } else {
                state.resizeIgnoreMask = null;
            }
            // Initialize coordinate generation UI
            const coordinateModeSelect = document.getElementById(
                'coordinateModeSelect'
            );
            if (coordinateModeSelect)
                coordinateModeSelect.value = state.coordinateMode;

            const coordinateDirectionSelect = document.getElementById(
                'coordinateDirectionSelect'
            );
            if (coordinateDirectionSelect)
                coordinateDirectionSelect.value = state.coordinateDirection;

            const coordinateSnakeToggle = document.getElementById(
                'coordinateSnakeToggle'
            );
            if (coordinateSnakeToggle)
                coordinateSnakeToggle.checked = state.coordinateSnake;

            const settingsContainer = document.getElementById(
                'wplace-settings-container'
            );
            const directionControls =
                settingsContainer.querySelector('#directionControls');
            const snakeControls =
                settingsContainer.querySelector('#snakeControls');
            const blockControls =
                settingsContainer.querySelector('#blockControls');
            Utils.updateCoordinateUI({
                mode: state.coordinateMode,
                directionControls,
                snakeControls,
                blockControls,
            });

            const paintUnavailablePixelsToggle = document.getElementById(
                'paintUnavailablePixelsToggle'
            );
            if (paintUnavailablePixelsToggle) {
                paintUnavailablePixelsToggle.checked =
                    state.paintUnavailablePixels;
            }

            const settingsPaintWhiteToggle = settingsContainer.querySelector(
                '#settingsPaintWhiteToggle'
            );
            if (settingsPaintWhiteToggle) {
                settingsPaintWhiteToggle.checked = state.paintWhitePixels;
            }

            const settingsPaintTransparentToggle =
                settingsContainer.querySelector(
                    '#settingsPaintTransparentToggle'
                );
            if (settingsPaintTransparentToggle) {
                settingsPaintTransparentToggle.checked =
                    state.paintTransparentPixels;
            }

            const speedSlider = document.getElementById('speedSlider');
            const speedInput = document.getElementById('speedInput');
            if (speedSlider) speedSlider.value = state.paintingSpeed;
            if (speedInput) speedInput.value = state.paintingSpeed;

            const enableSpeedToggle =
                document.getElementById('enableSpeedToggle');
            if (enableSpeedToggle)
                enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED;

            // Batch mode UI initialization
            const batchModeSelect = document.getElementById('batchModeSelect');
            if (batchModeSelect) batchModeSelect.value = state.batchMode;

            const normalBatchControls = document.getElementById(
                'normalBatchControls'
            );
            const randomBatchControls = document.getElementById(
                'randomBatchControls'
            );

            // Show/hide appropriate controls based on batch mode
            if (normalBatchControls && randomBatchControls) {
                if (state.batchMode === 'random') {
                    normalBatchControls.style.display = 'none';
                    randomBatchControls.style.display = 'block';
                } else {
                    normalBatchControls.style.display = 'block';
                    randomBatchControls.style.display = 'none';
                }
            }

            const randomBatchMin = document.getElementById('randomBatchMin');
            if (randomBatchMin) randomBatchMin.value = state.randomBatchMin;

            const randomBatchMax = document.getElementById('randomBatchMax');
            if (randomBatchMax) randomBatchMax.value = state.randomBatchMax;

            // AUTO_CAPTCHA_ENABLED is always true - no toggle to set

            const cooldownSlider = document.getElementById('cooldownSlider');
            const cooldownInput = document.getElementById('cooldownInput');
            if (cooldownSlider)
                cooldownSlider.value = state.cooldownChargeThreshold;
            if (cooldownInput)
                cooldownInput.value = state.cooldownChargeThreshold;

            const overlayOpacitySlider = document.getElementById(
                'overlayOpacitySlider'
            );
            if (overlayOpacitySlider)
                overlayOpacitySlider.value = state.overlayOpacity;
            const overlayOpacityValue = document.getElementById(
                'overlayOpacityValue'
            );
            if (overlayOpacityValue)
                overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
            const enableBlueMarbleToggle = document.getElementById(
                'enableBlueMarbleToggle'
            );
            if (enableBlueMarbleToggle)
                enableBlueMarbleToggle.checked = state.blueMarbleEnabled;

            const tokenSourceSelect =
                document.getElementById('tokenSourceSelect');
            if (tokenSourceSelect) tokenSourceSelect.value = state.tokenSource;

            const colorAlgorithmSelect = document.getElementById(
                'colorAlgorithmSelect'
            );
            if (colorAlgorithmSelect)
                colorAlgorithmSelect.value = state.colorMatchingAlgorithm;
            const enableChromaPenaltyToggle = document.getElementById(
                'enableChromaPenaltyToggle'
            );
            if (enableChromaPenaltyToggle)
                enableChromaPenaltyToggle.checked = state.enableChromaPenalty;
            const chromaPenaltyWeightSlider = document.getElementById(
                'chromaPenaltyWeightSlider'
            );
            if (chromaPenaltyWeightSlider)
                chromaPenaltyWeightSlider.value = state.chromaPenaltyWeight;
            const chromaWeightValue =
                document.getElementById('chromaWeightValue');
            if (chromaWeightValue)
                chromaWeightValue.textContent = state.chromaPenaltyWeight;
            const transparencyThresholdInput = document.getElementById(
                'transparencyThresholdInput'
            );
            if (transparencyThresholdInput)
                transparencyThresholdInput.value =
                    state.customTransparencyThreshold;
            const whiteThresholdInput = document.getElementById(
                'whiteThresholdInput'
            );
            if (whiteThresholdInput)
                whiteThresholdInput.value = state.customWhiteThreshold;
            // Notifications UI
            const notifEnabledToggle =
                document.getElementById('notifEnabledToggle');
            if (notifEnabledToggle)
                notifEnabledToggle.checked = state.notificationsEnabled;
            const notifOnChargesToggle = document.getElementById(
                'notifOnChargesToggle'
            );
            if (notifOnChargesToggle)
                notifOnChargesToggle.checked = state.notifyOnChargesReached;
            const notifOnlyUnfocusedToggle = document.getElementById(
                'notifOnlyUnfocusedToggle'
            );
            if (notifOnlyUnfocusedToggle)
                notifOnlyUnfocusedToggle.checked =
                    state.notifyOnlyWhenUnfocused;
            const notifIntervalInput =
                document.getElementById('notifIntervalInput');
            if (notifIntervalInput)
                notifIntervalInput.value = state.notificationIntervalMinutes;
            NotificationManager.resetEdgeTracking();
        } catch (e) {
            console.warn('Could not load bot settings:', e);
        }
    }

    // Initialize Turnstile generator integration
    console.log('🚀 WPlace Auto-Image with Turnstile Token Generator loaded');
    console.log(
        '🔑 Turnstile token generator: ALWAYS ENABLED (Background mode)'
    );
    console.log(
        '🎯 Manual pixel captcha solving: Available as fallback/alternative'
    );
    console.log(
        '📱 Turnstile widgets: DISABLED - pure background token generation only!'
    );

    // Function to enable file operations after initial startup setup is complete
    function enableFileOperations() {
        state.initialSetupComplete = true;

        const loadBtn = document.querySelector('#loadBtn');
        const loadFromFileBtn = document.querySelector('#loadFromFileBtn');
        const uploadBtn = document.querySelector('#uploadBtn');

        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.title = '';
            // Add a subtle animation to indicate the button is now available
            loadBtn.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                if (loadBtn) loadBtn.style.animation = '';
            }, 600);
            console.log('✅ Load Progress button enabled after initial setup');
        }

        if (loadFromFileBtn) {
            loadFromFileBtn.disabled = false;
            loadFromFileBtn.title = '';
            // Add a subtle animation to indicate the button is now available
            loadFromFileBtn.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                if (loadFromFileBtn) loadFromFileBtn.style.animation = '';
            }, 600);
            console.log('✅ Load from File button enabled after initial setup');
        }

        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.title = '';
            // Add a subtle animation to indicate the button is now available
            uploadBtn.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                if (uploadBtn) uploadBtn.style.animation = '';
            }, 600);
            console.log('✅ Upload Image button enabled after initial setup');
        }

        // Show a notification that file operations are now available
        Utils.showAlert(Utils.t('fileOperationsAvailable'), 'success');
    }

    // Optimized token initialization with better timing and error handling
    async function initializeTokenGenerator() {
        // Skip if already have valid token
        if (tokenManager.isTokenValid()) {
            console.log(
                '✅ Valid token already available, skipping initialization'
            );
            updateUI('tokenReady', 'success');
            enableFileOperations(); // Enable file operations since initial setup is complete
            return;
        }

        try {
            console.log('🔧 Initializing Turnstile token generator...');
            updateUI('initializingToken', 'default');

            console.log('Attempting to load Turnstile script...');
            // TurnstileManager will be initialized when needed
            console.log(
                'Turnstile script loaded. Attempting to generate token...'
            );

            const token = await tokenManager.handleCaptchaWithRetry();
            if (token) {
                tokenManager.setTurnstileToken(token);
                console.log('✅ Startup token generated successfully');
                updateUI('tokenReady', 'success');
                Utils.showAlert(Utils.t('tokenGeneratorReady'), 'success');
                enableFileOperations(); // Enable file operations since initial setup is complete
            } else {
                console.warn(
                    '⚠️ Startup token generation failed (no token received), will retry when needed'
                );
                updateUI('tokenRetryLater', 'warning');
                // Still enable file operations even if initial token generation fails
                // Users can load progress and use manual/hybrid modes
                enableFileOperations();
            }
        } catch (error) {
            console.error(
                '❌ Critical error during Turnstile initialization:',
                error
            ); // More specific error
            updateUI('tokenRetryLater', 'warning');
            // Still enable file operations even if initial setup fails
            // Users can load progress and use manual/hybrid modes
            enableFileOperations();
            // Don't show error alert for initialization failures, just log them
        }
    }

    // Load theme preference immediately on startup before creating UI
    loadThemePreference();
    applyTheme();

    createUI().then(() => {
        // Generate token automatically after UI is ready
        setTimeout(initializeTokenGenerator, 1000);

        // Attach advanced color matching listeners (resize dialog)
        const advancedInit = () => {
            const chromaSlider = document.getElementById(
                'chromaPenaltyWeightSlider'
            );
            const chromaValue = document.getElementById('chromaWeightValue');
            const resetBtn = document.getElementById('resetAdvancedColorBtn');
            const algoSelect = document.getElementById('colorAlgorithmSelect');
            const chromaToggle = document.getElementById(
                'enableChromaPenaltyToggle'
            );
            const transInput = document.getElementById(
                'transparencyThresholdInput'
            );
            const whiteInput = document.getElementById('whiteThresholdInput');
            const ditherToggle = document.getElementById(
                'enableDitheringToggle'
            );
            if (algoSelect)
                algoSelect.addEventListener('change', e => {
                    state.colorMatchingAlgorithm = e.target.value;
                    saveBotSettings();
                    _updateResizePreview();
                });
            if (chromaToggle)
                chromaToggle.addEventListener('change', e => {
                    state.enableChromaPenalty = e.target.checked;
                    saveBotSettings();
                    _updateResizePreview();
                });
            if (chromaSlider && chromaValue)
                chromaSlider.addEventListener('input', e => {
                    state.chromaPenaltyWeight =
                        parseFloat(e.target.value) || 0.15;
                    chromaValue.textContent =
                        state.chromaPenaltyWeight.toFixed(2);
                    saveBotSettings();
                    _updateResizePreview();
                });
            if (transInput)
                transInput.addEventListener('change', e => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0 && v <= 255) {
                        state.customTransparencyThreshold = v;
                        CONFIG.TRANSPARENCY_THRESHOLD = v;
                        saveBotSettings();
                        _updateResizePreview();
                    }
                });
            if (whiteInput)
                whiteInput.addEventListener('change', e => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 200 && v <= 255) {
                        state.customWhiteThreshold = v;
                        CONFIG.WHITE_THRESHOLD = v;
                        saveBotSettings();
                        _updateResizePreview();
                    }
                });
            if (ditherToggle)
                ditherToggle.addEventListener('change', e => {
                    state.ditheringEnabled = e.target.checked;
                    saveBotSettings();
                    _updateResizePreview();
                });
            if (resetBtn)
                resetBtn.addEventListener('click', () => {
                    state.colorMatchingAlgorithm = 'lab';
                    state.enableChromaPenalty = true;
                    state.chromaPenaltyWeight = 0.15;
                    state.customTransparencyThreshold =
                        CONFIG.TRANSPARENCY_THRESHOLD = 100;
                    state.customWhiteThreshold = CONFIG.WHITE_THRESHOLD = 250;
                    saveBotSettings();
                    const a = document.getElementById('colorAlgorithmSelect');
                    if (a) a.value = 'lab';
                    const ct = document.getElementById(
                        'enableChromaPenaltyToggle'
                    );
                    if (ct) ct.checked = true;
                    if (chromaSlider) chromaSlider.value = 0.15;
                    if (chromaValue) chromaValue.textContent = '0.15';
                    if (transInput) transInput.value = 100;
                    if (whiteInput) whiteInput.value = 250;
                    _updateResizePreview();
                    Utils.showAlert(
                        Utils.t('advancedColorSettingsReset'),
                        'success'
                    );
                });
        };
        // Delay to ensure resize UI built
        setTimeout(advancedInit, 500);

        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            Utils.turnstileManager.destroy();
        });
    });
})();
