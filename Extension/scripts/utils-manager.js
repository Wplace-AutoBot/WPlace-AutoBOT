/**
 * WPlace AutoBOT - Utils Manager
 * Centralized utility functions for the WPlace automation systemds
 */

class WPlaceUtilsManager {
  constructor() {
    this.translationCache = new Map();
    this._labCache = new Map();
    
    // Available languages
    this.AVAILABLE_LANGUAGES = [
      'en', 'ru', 'pt', 'vi', 'fr', 'id', 'tr', 
      'zh-CN', 'zh-TW', 'ja', 'ko', 'uk'
    ];
  }

  // Basic utility functions
  sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async dynamicSleep(tickAndGetRemainingMs) {
    let remaining = Math.max(0, await tickAndGetRemainingMs());
    while (remaining > 0) {
      const interval = remaining > 5000 ? 2000 : remaining > 1000 ? 500 : 100;
      await this.sleep(Math.min(interval, remaining));
      remaining = Math.max(0, await tickAndGetRemainingMs());
    }
  }

  async waitForSelector(selector, interval = 200, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await this.sleep(interval);
    }
    return null;
  }

  msToTimeText(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  // Debounced scroll-to-adjust handler for sliders
  createScrollToAdjust(element, updateCallback, min, max, step = 1) {
    let debounceTimer = null;

    const handleWheel = (e) => {
      if (e.target !== element) return;

      e.preventDefault();
      e.stopPropagation();

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        const currentValue = parseInt(element.value) || 0;
        const delta = e.deltaY > 0 ? -step : step;
        const newValue = Math.max(min, Math.min(max, currentValue + delta));

        if (newValue !== currentValue) {
          element.value = newValue;
          updateCallback(newValue);
        }
      }, 50);
    };

    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      element.removeEventListener('wheel', handleWheel);
    };
  }

  // Tile range calculation delegation
  calculateTileRange(startRegionX, startRegionY, startPixelX, startPixelY, width, height, tileSize = 1000) {
    return window.globalOverlayManager.calculateTileRange(
      startRegionX, startRegionY, startPixelX, startPixelY, width, height, tileSize
    );
  }

  // Token management delegation
  loadTurnstile() { return window.globalTokenManager.loadTurnstile(); }
  ensureTurnstileContainer() { return window.globalTokenManager.ensureTurnstileContainer(); }
  ensureTurnstileOverlayContainer() { return window.globalTokenManager.ensureTurnstileOverlayContainer(); }
  executeTurnstile(sitekey, action) { return window.globalTokenManager.executeTurnstile(sitekey, action); }
  createTurnstileWidget(sitekey, action) { return window.globalTokenManager.createTurnstileWidget(sitekey, action); }
  createTurnstileWidgetInteractive(sitekey, action) { return window.globalTokenManager.createTurnstileWidgetInteractive(sitekey, action); }
  cleanupTurnstile() { return window.globalTokenManager.cleanupTurnstile(); }
  obtainSitekeyAndToken(fallback) { return window.globalTokenManager.obtainSitekeyAndToken(fallback); }

  // DOM utilities
  createElement(tag, props = {}, children = []) {
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
      children.forEach((child) => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      });
    }

    return element;
  }

  createButton(id, text, icon, onClick, style = window.CONFIG.CSS_CLASSES.BUTTON_PRIMARY) {
    const button = this.createElement('button', {
      id: id,
      style: style,
      innerHTML: `${icon ? `<i class="${icon}"></i>` : ''}<span>${text}</span>`,
    });
    if (onClick) button.addEventListener('click', onClick);
    return button;
  }

  // Translation function
  t(key, params = {}) {
    const state = window.state;
    const translationCache = this.translationCache;
    const loadedTranslations = window.loadedTranslations || {};
    
    // Safety check: ensure state and language exist
    if (!state || !state.language) {
      // Fallback: try to get translation directly or return key
      if (loadedTranslations[key]) {
        let text = loadedTranslations[key];
        Object.keys(params).forEach((param) => {
          text = text.replace(`{${param}}`, params[param]);
        });
        return text;
      }
      return key; // Return the key as fallback
    }
    
    const cacheKey = `${state.language}_${key}`;
    if (translationCache.has(cacheKey)) {
      let text = translationCache.get(cacheKey);
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
      return text;
    }

    if (loadedTranslations[state.language]?.[key]) {
      let text = loadedTranslations[state.language][key];
      translationCache.set(cacheKey, text);
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
      return text;
    }

    // Try English fallback if available and not using English
    if (state.language && state.language !== 'en' && loadedTranslations['en']?.[key]) {
      let text = loadedTranslations['en'][key];
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
      return text;
    }

    // Final fallback to FALLBACK_TEXT or key
    const language = state.language || 'en';
    let text = window.FALLBACK_TEXT?.[language]?.[key] || window.FALLBACK_TEXT?.en?.[key] || key;
    Object.keys(params).forEach((param) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    if (text === key && key !== 'undefined') {
      console.warn(`⚠️ Missing translation for key: ${key} (language: ${language})`);
    }

    return text;
  }

  showAlert(message, type = 'info') {
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
  }

  // Color utilities
  colorDistance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
  }

  _rgbToLab(r, g, b) {
    const srgbToLinear = (v) => {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
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
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fX = f(X), fY = f(Y), fZ = f(Z);
    const L = 116 * fY - 16;
    const a = 500 * (fX - fY);
    const b2 = 200 * (fY - fZ);
    return [L, a, b2];
  }

  _lab(r, g, b) {
    const key = (r << 16) | (g << 8) | b;
    let v = this._labCache.get(key);
    if (!v) {
      v = this._rgbToLab(r, g, b);
      this._labCache.set(key, v);
    }
    return v;
  }

  findClosestPaletteColor(r, g, b, palette) {
    // Use provided palette or derive from COLOR_MAP
    if (!palette || palette.length === 0) {
      palette = Object.values(window.CONFIG.COLOR_MAP)
        .filter((c) => c.rgb)
        .map((c) => [c.rgb.r, c.rgb.g, c.rgb.b]);
    }
    
    // Use modular ImageProcessor for color matching if available
    if (window.globalImageProcessor) {
      return window.globalImageProcessor.findClosestPaletteColor(
        r, g, b, palette, 
        window.state.colorMatchingAlgorithm || 'lab',
        {
          enableChromaPenalty: window.state.enableChromaPenalty || false,
          chromaPenaltyWeight: window.state.chromaPenaltyWeight || 0.15
        }
      );
    }
    
    // Fallback: simple color distance matching
    let closestColor = null;
    let minDistance = Infinity;
    
    for (const color of palette) {
      const distance = this.colorDistance([r, g, b], color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    
    return closestColor || [r, g, b];
  }

  isWhitePixel(r, g, b) {
    const wt = window.state.customWhiteThreshold || window.CONFIG.WHITE_THRESHOLD;
    if (window.globalImageProcessor) {
      return window.globalImageProcessor.isWhitePixel(r, g, b, wt);
    }
    // Fallback calculation if image processor not available
    return r >= wt && g >= wt && b >= wt;
  }

  resolveColor(targetRgb, availableColors, exactMatch = false) {
    if (window.globalImageProcessor) {
      return window.globalImageProcessor.resolveColor(targetRgb, availableColors, {
        exactMatch,
        algorithm: window.state.colorMatchingAlgorithm || 'lab',
        enableChromaPenalty: window.state.enableChromaPenalty || false,
        chromaPenaltyWeight: window.state.chromaPenaltyWeight || 0.15,
        whiteThreshold: window.state.customWhiteThreshold || window.CONFIG.WHITE_THRESHOLD
      });
    }
    
    // Fallback: simple distance-based matching
    if (!availableColors || availableColors.length === 0) return null;
    
    let closestColor = null;
    let minDistance = Infinity;
    
    for (const color of availableColors) {
      const distance = this.colorDistance(targetRgb, color.rgb || [color.rgb.r, color.rgb.g, color.rgb.b]);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }
    
    return closestColor;
  }

  createImageUploader() { 
    if (window.globalImageProcessor) {
      return window.globalImageProcessor.createImageUploader();
    }
    
    // Fallback implementation if image processor not available
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('File reading error'));
          reader.readAsDataURL(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click();
    });
  }

  // File utilities
  createFileDownloader(data, filename) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  createFileUploader() {
    return new Promise((resolve, reject) => {
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
    });
  }

  extractAvailableColors() {
    if (window.globalImageProcessor) {
      return window.globalImageProcessor.extractAvailableColors(window.CONFIG.COLOR_MAP);
    }
    
    // Fallback: extract colors directly from CONFIG if image processor not available
    if (window.CONFIG && window.CONFIG.COLOR_MAP) {
      return Object.values(window.CONFIG.COLOR_MAP)
        .filter(color => color.rgb !== null)
        .map(color => ({
          id: color.id,
          name: color.name,
          rgb: [color.rgb.r, color.rgb.g, color.rgb.b]
        }));
    }
    
    return [];
  }

  formatTime(ms) {
    // Handle invalid or infinite values
    if (!Number.isFinite(ms) || ms < 0) {
      return '--:--:--';
    }
    
    // Handle very large values (more than 999 days)
    if (ms > 999 * 24 * 60 * 60 * 1000) {
      return '999d+';
    }
    
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
  }

  calculateEstimatedTime(remainingPixels, charges, cooldown) {
    // Safety checks for input parameters
    if (!Number.isFinite(remainingPixels) || remainingPixels <= 0) return 0;
    if (!Number.isFinite(charges) || charges <= 0) charges = 1;
    if (!Number.isFinite(cooldown) || cooldown <= 0) cooldown = 30000; // Default 30s
    
    const paintingSpeed = window.state?.paintingSpeed || 5;
    if (!Number.isFinite(paintingSpeed) || paintingSpeed <= 0) {
      // Fallback calculation without painting speed
      const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1));
      const timeFromCharges = cyclesNeeded * cooldown;
      return Math.min(timeFromCharges, 999 * 24 * 60 * 60 * 1000); // Cap at 999 days
    }

    const paintingSpeedDelay = 1000 / paintingSpeed;
    const timeFromSpeed = remainingPixels * paintingSpeedDelay;

    const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1));
    const timeFromCharges = cyclesNeeded * cooldown;

    const totalTime = timeFromSpeed + timeFromCharges;
    
    // Safety check to prevent infinity and cap at reasonable maximum
    if (!Number.isFinite(totalTime) || totalTime < 0) {
      return 0;
    }
    
    // Cap at 999 days to prevent display issues
    return Math.min(totalTime, 999 * 24 * 60 * 60 * 1000);
  }

  // Painted pixel tracking helpers
  initializePaintedMap(width, height) {
    if (!window.state.paintedMap || window.state.paintedMap.length !== height) {
      window.state.paintedMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false));
    }
  }

  markPixelPainted(x, y, regionX = 0, regionY = 0) {
    const actualX = x + regionX;
    const actualY = y + regionY;

    if (
      window.state.paintedMap &&
      window.state.paintedMap[actualY] &&
      actualX >= 0 &&
      actualX < window.state.paintedMap[actualY].length
    ) {
      window.state.paintedMap[actualY][actualX] = true;
    }
  }

  isPixelPainted(x, y, regionX = 0, regionY = 0) {
    const actualX = x + regionX;
    const actualY = y + regionY;

    if (
      window.state.paintedMap &&
      window.state.paintedMap[actualY] &&
      actualX >= 0 &&
      actualX < window.state.paintedMap[actualY].length
    ) {
      return window.state.paintedMap[actualY][actualX];
    }
    return false;
  }

  // Alias for isPixelPainted - used in pre-filtering logic
  isPixelMarkedPainted(x, y, regionX = 0, regionY = 0) {
    return this.isPixelPainted(x, y, regionX, regionY);
  }

  // Smart save
  shouldAutoSave() {
    const now = Date.now();
    const pixelsSinceLastSave = window.state.paintedPixels - window.state._lastSavePixelCount;
    const timeSinceLastSave = now - window.state._lastSaveTime;

    return !window.state._saveInProgress && pixelsSinceLastSave >= 25 && timeSinceLastSave >= 30000;
  }

  performSmartSave() {
    if (!this.shouldAutoSave()) return false;

    window.state._saveInProgress = true;
    const success = this.saveProgress();

    if (success) {
      window.state._lastSavePixelCount = window.state.paintedPixels;
      window.state._lastSaveTime = Date.now();
    }

    window.state._saveInProgress = false;
    return success;
  }

  // Data compression helpers
  packPaintedMapToBase64(paintedMap, width, height) {
    if (!paintedMap || !width || !height) return null;
    const totalBits = width * height;
    const byteLen = Math.ceil(totalBits / 8);
    const bytes = new Uint8Array(byteLen);
    let bitIndex = 0;
    for (let y = 0; y < height; y++) {
      const row = paintedMap[y];
      for (let x = 0; x < width; x++) {
        const bit = row && row[x] ? 1 : 0;
        const b = bitIndex >> 3;
        const o = bitIndex & 7;
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
  }

  unpackPaintedMapFromBase64(base64, width, height) {
    if (!base64 || !width || !height) return null;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
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
  }

  // Migration helpers
  migrateProgressToV2(saved) {
    if (!saved) return saved;
    const isV1 = !saved.version || saved.version === '1' || saved.version === '1.0' || saved.version === '1.1';
    if (!isV1) return saved;

    try {
      const migrated = { ...saved };
      const width = migrated.imageData?.width;
      const height = migrated.imageData?.height;
      if (migrated.paintedMap && width && height) {
        const data = this.packPaintedMapToBase64(migrated.paintedMap, width, height);
        migrated.paintedMapPacked = { width, height, data };
      }
      delete migrated.paintedMap;
      migrated.version = '2';
      return migrated;
    } catch (e) {
      console.warn('Migration to v2 failed, using original data:', e);
      return saved;
    }
  }

  migrateProgressToV21(saved) {
    if (!saved) return saved;
    if (saved.version === '2.1') return saved;
    const isV2 = saved.version === '2' || saved.version === '2.0';
    const isV1 = !saved.version || saved.version === '1' || saved.version === '1.0' || saved.version === '1.1';
    if (!isV2 && !isV1) return saved;
    try {
      const migrated = { ...saved };
      if (isV1) {
        const width = migrated.imageData?.width;
        const height = migrated.imageData?.height;
        if (migrated.paintedMap && width && height) {
          const data = this.packPaintedMapToBase64(migrated.paintedMap, width, height);
          migrated.paintedMapPacked = { width, height, data };
        }
        delete migrated.paintedMap;
      }
      migrated.version = '2.1';
      return migrated;
    } catch (e) {
      console.warn('Migration to v2.1 failed, using original data:', e);
      return saved;
    }
  }

  migrateProgressToV22(data) {
    try {
      const migrated = { ...data };
      migrated.version = '2.2';

      if (!migrated.state.coordinateMode) {
        migrated.state.coordinateMode = window.CONFIG.COORDINATE_MODE;
      }
      if (!migrated.state.coordinateDirection) {
        migrated.state.coordinateDirection = window.CONFIG.COORDINATE_DIRECTION;
      }
      if (!migrated.state.coordinateSnake) {
        migrated.state.coordinateSnake = window.CONFIG.COORDINATE_SNAKE;
      }
      if (!migrated.state.blockWidth) {
        migrated.state.blockWidth = window.CONFIG.COORDINATE_BLOCK_WIDTH;
      }
      if (!migrated.state.blockHeight) {
        migrated.state.blockHeight = window.CONFIG.COORDINATE_BLOCK_HEIGHT;
      }

      return migrated;
    } catch (e) {
      console.warn('Migration to v2.2 failed, using original data:', e);
      return data;
    }
  }

  buildPaintedMapPacked() {
    if (window.state.paintedMap && window.state.imageData) {
      const data = this.packPaintedMapToBase64(
        window.state.paintedMap,
        window.state.imageData.width,
        window.state.imageData.height
      );
      if (data) {
        return {
          width: window.state.imageData.width,
          height: window.state.imageData.height,
          data: data,
        };
      }
    }
    return null;
  }

  buildProgressData() {
    const result = {
      timestamp: Date.now(),
      version: '2.2',
      state: {
        totalPixels: window.state.totalPixels,
        paintedPixels: window.state.paintedPixels,
        lastPosition: window.state.lastPosition,
        startPosition: window.state.startPosition,
        region: window.state.region,
        imageLoaded: window.state.imageLoaded,
        colorsChecked: window.state.colorsChecked,
        coordinateMode: window.state.coordinateMode,
        coordinateDirection: window.state.coordinateDirection,
        coordinateSnake: window.state.coordinateSnake,
        blockWidth: window.state.blockWidth,
        blockHeight: window.state.blockHeight,
        availableColors: window.state.availableColors,
      },
      imageData: null,
      paintedMapPacked: null,
    };

    // Decide how to store image pixels
    if (window.state.imageData) {
      const img = window.state.imageData;
      const width = img.width;
      const height = img.height;
      const totalPixels = img.totalPixels;
      const pixels = img.pixels;

      const USE_IDB_THRESHOLD = 500000; // ~0.5 MB raw RGBA (before JSON expansion)

      if (pixels && pixels.length) {
        const bytes = pixels.length; // Uint8ClampedArray length equals byte size
        if (bytes > USE_IDB_THRESHOLD) {
          // Store pixels in IndexedDB and keep only the reference in save payload
          const ref = this.generatePixelsRef(width, height);
          try {
            // Fire-and-forget async persist
            this.storePixelsInIndexedDB(ref, { width, height, totalPixels, pixels });
          } catch (e) {
            console.warn('Failed to schedule IDB pixel store:', e);
          }
          result.imageData = { width, height, totalPixels, pixelsRef: ref, pixelsBackend: 'idb' };
        } else {
          result.imageData = { width, height, pixels: Array.from(pixels), totalPixels };
        }
      } else {
        result.imageData = { width, height, totalPixels, pixels: null };
      }
    }

    result.paintedMapPacked = this.buildPaintedMapPacked();
    return result;
  }

  migrateProgress(saved) {
    if (!saved) return null;

    let data = saved;
    const ver = data.version;

    if (!ver || ver === '1' || ver === '1.0' || ver === '1.1') {
      data = this.migrateProgressToV2(data);
    }

    if (data.version === '2' || data.version === '2.0') {
      data = this.migrateProgressToV21(data);
    }

    if (data.version === '2.1') {
      data = this.migrateProgressToV22(data);
    }

    return data;
  }

  saveProgress() {
    try {
      const progressData = this.buildProgressData();
      try {
        localStorage.setItem('wplace-bot-progress', JSON.stringify(progressData));
        return true;
      } catch (e) {
        // Strip heavy pixel data and retry if quota exceeded
        if (progressData && progressData.imageData && progressData.imageData.pixels) {
          const slim = {
            ...progressData,
            imageData: {
              width: progressData.imageData.width,
              height: progressData.imageData.height,
              totalPixels: progressData.imageData.totalPixels,
              pixelsStripped: true,
            }
          };
          try {
            localStorage.setItem('wplace-bot-progress', JSON.stringify(slim));
            console.warn('Saved progress without raw pixel data due to storage quota limits.');
            return true;
          } catch (e2) {
            try {
              sessionStorage.setItem('wplace-bot-progress', JSON.stringify(slim));
              console.warn('Saved progress to sessionStorage without pixel data due to storage quota limits.');
              return true;
            } catch (e3) {
              throw e2;
            }
          }
        }
        throw e;
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('wplace-bot-progress');
      if (!saved) return null;
      let data = JSON.parse(saved);
      const migrated = this.migrateProgress(data);

      if (migrated && migrated !== data) {
        try {
          localStorage.setItem('wplace-bot-progress', JSON.stringify(migrated));
        } catch { }
      }
      return migrated;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  clearProgress() {
    try {
      localStorage.removeItem('wplace-bot-progress');
      window.state.paintedMap = null;
      window.state._lastSavePixelCount = 0;
      window.state._lastSaveTime = 0;
      window.state.coordinateMode = window.CONFIG.COORDINATE_MODE;
      window.state.coordinateDirection = window.CONFIG.COORDINATE_DIRECTION;
      window.state.coordinateSnake = window.CONFIG.COORDINATE_SNAKE;
      window.state.blockWidth = window.CONFIG.COORDINATE_BLOCK_WIDTH;
      window.state.blockHeight = window.CONFIG.COORDINATE_BLOCK_HEIGHT;
      return true;
    } catch (error) {
      console.error('Error clearing progress:', error);
      return false;
    }
  }

  restoreProgress(savedData) {
    try {
      Object.assign(window.state, savedData.state);

      // Restore coordinate generation settings
      if (savedData.state.coordinateMode) {
        window.state.coordinateMode = savedData.state.coordinateMode;
      }
      if (savedData.state.coordinateDirection) {
        window.state.coordinateDirection = savedData.state.coordinateDirection;
      }
      if (savedData.state.coordinateSnake !== undefined) {
        window.state.coordinateSnake = savedData.state.coordinateSnake;
      }
      if (savedData.state.blockWidth) {
        window.state.blockWidth = savedData.state.blockWidth;
      }
      if (savedData.state.blockHeight) {
        window.state.blockHeight = savedData.state.blockHeight;
      }

      // Restore available colors from old save files (backward compatibility)
      if (savedData.state.availableColors && Array.isArray(savedData.state.availableColors)) {
        window.state.availableColors = savedData.state.availableColors;
        window.state.colorsChecked = true; // Mark colors as checked
      }

      if (savedData.imageData && Array.isArray(savedData.imageData.pixels)) {
        window.state.imageData = {
          width: savedData.imageData.width,
          height: savedData.imageData.height,
          pixels: savedData.imageData.pixels, // Keep as Array - will convert in ImageData constructor
          totalPixels: savedData.imageData.totalPixels,
        };

        try {
          const canvas = document.createElement('canvas');
          canvas.width = window.state.imageData.width;
          canvas.height = window.state.imageData.height;
          const ctx = canvas.getContext('2d');
          const imageData = new ImageData(
            window.state.imageData.pixels,
            window.state.imageData.width,
            window.state.imageData.height
          );
          ctx.putImageData(imageData, 0, 0);
          
          // Create ImageProcessor directly like the original - no delegation
          if (window.ImageProcessor) {
            const proc = new window.ImageProcessor('');
            proc.img = canvas;
            proc.canvas = canvas;
            proc.ctx = ctx;
            window.state.imageData.processor = proc;
          } else if (window.WPlaceImageProcessor) {
            const proc = new window.WPlaceImageProcessor('');
            proc.img = canvas;
            proc.canvas = canvas;
            proc.ctx = ctx;
            window.state.imageData.processor = proc;
          }
        } catch (e) {
          console.warn('Could not rebuild processor from saved image data:', e);
        }
      } else if (savedData.imageData && savedData.imageData.pixelsRef) {
        // Asynchronously load large pixel data from IndexedDB using the stored reference
        console.log('🔄 Loading large image pixels from IndexedDB via ref:', savedData.imageData.pixelsRef);
        window.state.imageData = {
          width: savedData.imageData.width,
          height: savedData.imageData.height,
          totalPixels: savedData.imageData.totalPixels,
          pixels: null,
        };
        window.state.imageLoaded = false;

        this.loadPixelsFromIndexedDB(savedData.imageData.pixelsRef)
          .then((payload) => {
            if (!payload || !payload.pixels) {
              console.warn('⚠️ No pixel payload found in IndexedDB for ref:', savedData.imageData.pixelsRef);
              this.showAlert?.('⚠️ Saved image pixels not found in local database. Please reload the image file.', 'warning');
              return;
            }
            try {
              window.state.imageData.pixels = new Uint8ClampedArray(payload.pixels);
              window.state.imageLoaded = true;

              // Rebuild processor and notify modules/UI
              this._syncModulesAfterStateRestore();
              this.showAlert?.('✅ Large image restored from local database.', 'success');

              // Attempt overlay restoration if available
              if (typeof this.restoreOverlayFromData === 'function') {
                this.restoreOverlayFromData().catch(() => {});
              }
            } catch (err) {
              console.warn('Failed to apply pixels from IndexedDB:', err);
            }
          })
          .catch((err) => {
            console.warn('Failed to load pixels from IndexedDB:', err);
          });
      } else if (savedData.imageData && savedData.imageData.pixelsStripped) {
        console.warn('⚠️ Saved progress did not include raw pixel data due to quota limits. Please reload the image to resume.');
        window.state.imageData = {
          width: savedData.imageData.width,
          height: savedData.imageData.height,
          totalPixels: savedData.imageData.totalPixels,
          pixels: null,
        };
        window.state.imageLoaded = false;
      }

      // Prefer packed form if available; fallback to legacy paintedMap array for backward compatibility
      if (savedData.paintedMapPacked && savedData.paintedMapPacked.data) {
        const { width, height, data } = savedData.paintedMapPacked;
        window.state.paintedMap = this.unpackPaintedMapFromBase64(data, width, height);
      } else if (savedData.paintedMap) {
        window.state.paintedMap = savedData.paintedMap.map((row) => Array.from(row));
      }

      // CRITICAL FIX: Notify all modules that state has been restored
      this._syncModulesAfterStateRestore();

      return true;
    } catch (error) {
      console.error('Error restoring progress:', error);
      return false;
    }
  }

  /**
   * Synchronize all modules after state restore to prevent timing issues
   * This ensures modules reflect the updated state properly
   * @private
   */
  _syncModulesAfterStateRestore() {
    try {
      console.log('🔄 Synchronizing modules after state restore...');

      // Sync image processor if available
      if (window.globalImageProcessor && window.state.imageData) {
        // Force refresh image processor state
        if (typeof window.globalImageProcessor.updateState === 'function') {
          window.globalImageProcessor.updateState(window.state);
        }
      }

      // Sync overlay manager if available
      if (window.globalOverlayManager) {
        // Force refresh overlay state - this ensures overlay knows about the new state
        if (typeof window.globalOverlayManager.updateState === 'function') {
          window.globalOverlayManager.updateState(window.state);
        }
      }

      // Extract available colors if not already set (required for color palette functionality)
      if (!window.state.availableColors || window.state.availableColors.length === 0) {
        console.log('🎨 Extracting available colors for save file...');
        try {
          const availableColors = this.extractAvailableColors();
          if (availableColors && availableColors.length > 0) {
            window.state.availableColors = availableColors;
            window.state.colorsChecked = true;
            console.log(`✅ Extracted ${availableColors.length} available colors`);
          } else {
            console.warn('⚠️ No colors available - this might cause issues with overlay display');
          }
        } catch (error) {
          console.warn('⚠️ Failed to extract colors:', error);
        }
      }

      // Force window.state reference update for any stale references
      window.state = window.state; // Trigger any watchers

      console.log('✅ Module synchronization complete');
    } catch (error) {
      console.warn('⚠️ Module synchronization failed:', error);
    }
  }

  /**
   * Force navigation to saved position to display overlay immediately
   * @param {Object} region - The region coordinates
   * @param {Object} position - The pixel position within region
   * @private
   */
  async _forceNavigateToSavedPosition(region, position) {
    try {
      console.log(`🧭 Forcing navigation to region (${region.x}, ${region.y}) pixel (${position.x}, ${position.y})...`);
      
      // Calculate world coordinates (region * 1000 + pixel position)
      const worldX = region.x * 1000 + position.x;
      const worldY = region.y * 1000 + position.y;
      
      console.log(`🌍 World coordinates: (${worldX}, ${worldY})`);
      
      // Method 1: Try to find WPlace's camera/viewport controls
      const attemptCameraControl = () => {
        // Look for WPlace's camera control functions in global scope
        const possibleControls = [
          'camera', 'viewport', 'map', 'game', 'wplace', 'app'
        ];
        
        for (const control of possibleControls) {
          if (window[control]) {
            console.log(`🎯 Found potential control: ${control}`, window[control]);
            
            // Try common navigation method names
            const methods = ['setPosition', 'moveTo', 'panTo', 'setView', 'goTo', 'navigate'];
            for (const method of methods) {
              if (typeof window[control][method] === 'function') {
                console.log(`📍 Attempting ${control}.${method}(${worldX}, ${worldY})`);
                try {
                  window[control][method](worldX, worldY);
                  return true;
                } catch (e) {
                  console.warn(`❌ ${control}.${method} failed:`, e);
                }
              }
            }
          }
        }
        return false;
      };
      
      // Method 2: Try updating URL hash (common for canvas-based apps)
      const attemptUrlNavigation = () => {
        try {
          const newHash = `#${worldX},${worldY}`;
          console.log(`🔗 Attempting URL navigation: ${newHash}`);
          window.location.hash = newHash;
          
          // Also try alternative formats
          setTimeout(() => {
            const altHash = `#x=${worldX}&y=${worldY}`;
            console.log(`🔗 Attempting alternative URL: ${altHash}`);
            window.location.hash = altHash;
          }, 100);
          
          return true;
        } catch (e) {
          console.warn('❌ URL navigation failed:', e);
          return false;
        }
      };
      
      // Method 3: Try triggering scroll/wheel events to force tile loading
      const attemptScrollTrigger = () => {
        try {
          console.log('🖱️ Attempting scroll trigger to force tile loading...');
          
          // Find canvas or main container
          const canvas = document.querySelector('canvas') || document.body;
          
          // Simulate mouse events at target coordinates
          ['mousedown', 'mousemove', 'mouseup', 'wheel'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
              bubbles: true,
              clientX: worldX % window.innerWidth,
              clientY: worldY % window.innerHeight,
              deltaY: eventType === 'wheel' ? 1 : 0
            });
            canvas.dispatchEvent(event);
          });
          
          return true;
        } catch (e) {
          console.warn('❌ Scroll trigger failed:', e);
          return false;
        }
      };
      
      // Try all methods
      const success = attemptCameraControl() || attemptUrlNavigation() || attemptScrollTrigger();
      
      if (success) {
        console.log('✅ Navigation triggered - overlay should display in a moment');
        
        // Wait a bit for tiles to load, then show success message
        setTimeout(() => {
          if (typeof this.showAlert === 'function') {
            this.showAlert('✅ Overlay loaded and positioned automatically!', 'success');
          }
        }, 1000);
      } else {
        console.warn('⚠️ Automatic navigation failed - showing manual instruction');
        if (typeof this.showAlert === 'function') {
          this.showAlert(`📍 Navigate to region (${region.x}, ${region.y}) to see your restored overlay`, 'info');
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to force navigation:', error);
      if (typeof this.showAlert === 'function') {
        this.showAlert(`📍 Navigate to region (${region.x}, ${region.y}) to see your overlay`, 'info');
      }
    }
  }

  saveProgressToFile() {
    try {
      const progressData = this.buildProgressData();
      const filename = `wplace-bot-progress-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, '-')}.json`;
      this.createFileDownloader(JSON.stringify(progressData, null, 2), filename);
      return true;
    } catch (error) {
      console.error('Error saving to file:', error);
      return false;
    }
  }

  async loadProgressFromFile() {
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
  }

  async restoreOverlayFromData() {
    if (!window.state.imageLoaded || !window.state.imageData || !window.state.startPosition || !window.state.region) {
      console.warn('❌ Missing required data for overlay restoration');
      return false;
    }

    try {
      console.log('🔄 Restoring overlay from saved data...');
      
      // Recreate ImageBitmap from loaded pixel data (match old version exactly)
      const imageData = new ImageData(
        window.state.imageData.pixels,
        window.state.imageData.width,
        window.state.imageData.height
      );

      const canvas = new OffscreenCanvas(window.state.imageData.width, window.state.imageData.height);
      const ctx = canvas.getContext('2d');
      ctx.putImageData(imageData, 0, 0);
      const imageBitmap = await canvas.transferToImageBitmap();

      // Set up overlay with restored data (use the Auto-Image.js overlayManager instance)
      if (window.autoImageOverlayManager) {
        console.log('📋 Setting image bitmap...');
        await window.autoImageOverlayManager.setImage(imageBitmap);
        
        console.log('📍 Setting position and region...');
        await window.autoImageOverlayManager.setPosition(window.state.startPosition, window.state.region);

        console.log('� Enabling overlay...');
        window.autoImageOverlayManager.enable();

        // Update overlay button state
        const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
        if (toggleOverlayBtn) {
          toggleOverlayBtn.disabled = false;
          toggleOverlayBtn.classList.add('active');
        }

        console.log('✅ Overlay restored from data');
        return true;
      } else {
        console.error('❌ autoImageOverlayManager not available');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to restore overlay from data:', error);
      return false;
    }
  }

  updateCoordinateUI({ mode, directionControls, snakeControls, blockControls }) {
    const isLinear = mode === 'rows' || mode === 'columns';
    const isBlock = mode === 'blocks' || mode === 'shuffle-blocks';

    if (directionControls) directionControls.style.display = isLinear ? 'block' : 'none';
    if (snakeControls) snakeControls.style.display = isLinear ? 'block' : 'none';
    if (blockControls) blockControls.style.display = isBlock ? 'block' : 'none';
  }

  /**
   * Force navigation to saved position to display overlay immediately
   * @param {Object} region - The region coordinates
   * @param {Object} position - The pixel position within region
   * @private
   */
  async _forceNavigateToSavedPosition(region, position) {
    try {
      console.log(`🧭 Forcing navigation to region (${region.x}, ${region.y}) pixel (${position.x}, ${position.y})...`);
      
      // Calculate world coordinates (region * 1000 + pixel position)
      const worldX = region.x * 1000 + position.x;
      const worldY = region.y * 1000 + position.y;
      
      console.log(`🌍 World coordinates: (${worldX}, ${worldY})`);
      
      // Method 1: Try to find WPlace's camera/viewport controls
      const attemptCameraControl = () => {
        // Look for WPlace's camera control functions in global scope
        const possibleControls = [
          'camera', 'viewport', 'map', 'game', 'wplace', 'app'
        ];
        
        for (const control of possibleControls) {
          if (window[control]) {
            console.log(`🎯 Found potential control: ${control}`, window[control]);
            
            // Try common navigation method names
            const methods = ['setPosition', 'moveTo', 'panTo', 'setView', 'goTo', 'navigate'];
            for (const method of methods) {
              if (typeof window[control][method] === 'function') {
                console.log(`📍 Attempting ${control}.${method}(${worldX}, ${worldY})`);
                try {
                  window[control][method](worldX, worldY);
                  return true;
                } catch (e) {
                  console.warn(`❌ ${control}.${method} failed:`, e);
                }
              }
            }
          }
        }
        return false;
      };
      
      // Method 2: Try updating URL hash (common for canvas-based apps)
      const attemptUrlNavigation = () => {
        try {
          const newHash = `#${worldX},${worldY}`;
          console.log(`🔗 Attempting URL navigation: ${newHash}`);
          window.location.hash = newHash;
          
          // Also try alternative formats
          setTimeout(() => {
            const altHash = `#x=${worldX}&y=${worldY}`;
            console.log(`🔗 Attempting alternative URL: ${altHash}`);
            window.location.hash = altHash;
          }, 100);
          
          return true;
        } catch (e) {
          console.warn('❌ URL navigation failed:', e);
          return false;
        }
      };
      
      // Method 3: Try triggering scroll/wheel events to force tile loading
      const attemptScrollTrigger = () => {
        try {
          console.log('🖱️ Attempting scroll trigger to force tile loading...');
          
          // Find canvas or main container
          const canvas = document.querySelector('canvas') || document.body;
          
          // Simulate mouse events at target coordinates
          ['mousedown', 'mousemove', 'mouseup', 'wheel'].forEach(eventType => {
            const event = new MouseEvent(eventType, {
              bubbles: true,
              clientX: worldX % window.innerWidth,
              clientY: worldY % window.innerHeight,
              deltaY: eventType === 'wheel' ? 1 : 0
            });
            canvas.dispatchEvent(event);
          });
          
          return true;
        } catch (e) {
          console.warn('❌ Scroll trigger failed:', e);
          return false;
        }
      };
      
      // Try all methods
      const success = attemptCameraControl() || attemptUrlNavigation() || attemptScrollTrigger();
      
      if (success) {
        console.log('✅ Navigation triggered - overlay should display in a moment');
        
        // Wait a bit for tiles to load, then show success message
        setTimeout(() => {
          if (typeof this.showAlert === 'function') {
            this.showAlert('✅ Overlay loaded and positioned automatically!', 'success');
          }
        }, 1000);
      } else {
        console.warn('⚠️ Automatic navigation failed - showing manual instruction');
        if (typeof this.showAlert === 'function') {
          this.showAlert(`📍 Navigate to region (${region.x}, ${region.y}) to see your restored overlay`, 'info');
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to force navigation:', error);
      if (typeof this.showAlert === 'function') {
        this.showAlert(`📍 Navigate to region (${region.x}, ${region.y}) to see your overlay`, 'info');
      }
    }
  }
}

// Global instance with safety checks
try {
  window.globalUtilsManager = new WPlaceUtilsManager();
  console.log('✅ WPlaceUtilsManager initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize WPlaceUtilsManager:', error);
}

// Additional safety: ensure the instance is available for other scripts
if (!window.globalUtilsManager) {
  console.warn('⚠️ globalUtilsManager not available, attempting to reinitialize...');
  setTimeout(() => {
    try {
      window.globalUtilsManager = new WPlaceUtilsManager();
      console.log('✅ WPlaceUtilsManager reinitialized successfully');
    } catch (error) {
      console.error('❌ Failed to reinitialize WPlaceUtilsManager:', error);
    }
  }, 100);
}

// === IndexedDB helpers for large pixel storage ===
WPlaceUtilsManager.prototype._openPixelDB = function() {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open('wplace-bot-db', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('pixels')) {
          const store = db.createObjectStore('pixels', { keyPath: 'ref' });
          try { store.createIndex('createdAt', 'createdAt', { unique: false }); } catch {}
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } catch (e) {
      reject(e);
    }
  });
};

WPlaceUtilsManager.prototype.generatePixelsRef = function(width, height) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `img_${width}x${height}_${Date.now().toString(36)}_${rand}`;
};

WPlaceUtilsManager.prototype.storePixelsInIndexedDB = async function(ref, payload) {
  try {
    const db = await this._openPixelDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('pixels', 'readwrite');
      const store = tx.objectStore('pixels');
      const data = {
        ref,
        width: payload.width,
        height: payload.height,
        totalPixels: payload.totalPixels,
        pixels: new Uint8Array(payload.pixels),
        createdAt: Date.now(),
      };
      const req = store.put(data);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IDB storePixels failed:', e);
    return false;
  }
};

WPlaceUtilsManager.prototype.loadPixelsFromIndexedDB = async function(ref) {
  try {
    const db = await this._openPixelDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('pixels', 'readonly');
      const store = tx.objectStore('pixels');
      const req = store.get(ref);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('IDB loadPixels failed:', e);
    return null;
  }
};
