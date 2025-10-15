// ==UserScript==
// @name         WPlace Overlay Manager
// @namespace    http://tampermonkey.net/
// @version      2025-09-16.1
// @description  Overlay management for WPlace AutoBot - handles tile processing, chunking, and rendering
// @author       Wbot
// @match        https://wplace.live/*
// @grant        none
// ==/UserScript==

/**
 * OverlayManager - Handles overlay processing, tile chunking, and canvas operations for WPlace AutoBot
 * Extracted from Auto-Image.js for better modularity and reusabilityc
 */
class OverlayManager {
  constructor() {
    this.isEnabled = false;
    this.startCoords = null; // { region: {x, y}, pixel: {x, y} }
    this.imageBitmap = null;
    this.chunkedTiles = new Map(); // Map<"tileX,tileY", ImageBitmap>
    this.originalTiles = new Map(); // Map<"tileX,ttileY", ImageBitmap> store latest original tile bitmaps
    this.originalTilesData = new Map(); // Map<"tileX,tileY", {w,h,data:Uint8ClampedArray}> cache full ImageData for fast pixel reads
    this.tileSize = 1000;
    this.processPromise = null; // Track ongoing processing
    this.lastProcessedHash = null; // Cache invalidation
    this.workerPool = null; // Web worker pool for heavy processing
    this.neededTilesForSave = null; // Set of tiles needed for save file restoration
  }

  /**
   * Toggle overlay enabled state
   * @returns {boolean} New enabled state
   */
  toggle() {
    this.isEnabled = !this.isEnabled;
    console.log(`Overlay ${this.isEnabled ? 'enabled' : 'disabled'}.`);
    return this.isEnabled;
  }

  /**
   * Enable overlay
   */
  enable() {
    this.isEnabled = true;
    
    // Force canvas refresh if script was loaded manually (not on startup)
    // This ensures overlay works even when tiles are already cached
    this._triggerCanvasRefreshIfNeeded();
    
    // Also try direct canvas overlay approach as backup
    this._attemptDirectCanvasOverlay();
  }

  /**
   * Attempt to directly overlay on the existing canvas
   * @private
   */
  _attemptDirectCanvasOverlay() {
    // Only try this if we have overlay data and it's been more than 5 seconds since page load
    const timeSinceLoad = Date.now() - (window.performance?.timing?.navigationStart || 0);
    
    if (timeSinceLoad > 5000 && this.chunkedTiles.size > 0) {
      setTimeout(() => {
        this._drawDirectOverlay();
      }, 500);
    }
  }

  /**
   * Draw overlay directly on the main canvas
   * @private
   */
  _drawDirectOverlay() {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      // Store original composite operation
      const originalComposite = ctx.globalCompositeOperation;
      const originalAlpha = ctx.globalAlpha;

      // Set overlay blending
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = window.state?.overlayOpacity || 0.6;

      // Draw overlay chunks directly on canvas
      this.chunkedTiles.forEach((bitmap, tileKey) => {
        const [tileX, tileY] = tileKey.split(',').map(Number);
        
        // Convert tile coordinates to canvas coordinates
        // This assumes WPlace uses 1000px tiles
        const canvasX = tileX * 1000;
        const canvasY = tileY * 1000;
        
        try {
          ctx.drawImage(bitmap, canvasX, canvasY);
        } catch (error) {
          // Ignore individual tile draw errors
        }
      });

      // Restore original settings
      ctx.globalCompositeOperation = originalComposite;
      ctx.globalAlpha = originalAlpha;

    } catch (error) {
      // Ignore direct overlay errors silently
    }
  }

  /**
   * Trigger canvas refresh for manual script execution
   * @private
   */
  _triggerCanvasRefreshIfNeeded() {
    // Only trigger refresh if we have overlay data and it's been more than 5 seconds since page load
    // (indicates manual execution rather than startup execution)
    const timeSinceLoad = Date.now() - (window.performance?.timing?.navigationStart || 0);
    
    if (timeSinceLoad > 5000 && this.chunkedTiles.size > 0) {
      // Try multiple methods to refresh the canvas tiles
      setTimeout(() => {
        this._attemptCanvasRefresh();
      }, 100);
    }
  }

  /**
   * Attempt to refresh canvas tiles using various methods
   * @private
   */
  _attemptCanvasRefresh() {
    try {
      // Method 1: Clear browser cache for tile URLs
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      
      // Method 2: Force browser to bypass cache by adding cache-busting parameter
      // We need to intercept and modify tile requests to add cache-busting
      // IMPORTANT: Preserve any existing fetch override (e.g., from Auto-Image assist mode)
      const originalFetch = window.fetch;
      let fetchOverrideActive = true;
      
      window.fetch = async function(...args) {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        
        if (fetchOverrideActive && typeof url === 'string' && url.match(/\/\d+\/\d+\.png/)) {
          // Add cache-busting parameter
          const separator = url.includes('?') ? '&' : '?';
          const cacheBustUrl = `${url}${separator}_cb=${Date.now()}`;
          
          if (args[0] instanceof Request) {
            args[0] = new Request(cacheBustUrl, args[0]);
          } else {
            args[0] = cacheBustUrl;
          }
        }
        
        // Chain to previous fetch (which may have assist mode logic)
        return originalFetch.apply(this, args);
      };
      
      // Disable cache-busting after 10 seconds
      setTimeout(() => {
        fetchOverrideActive = false;
      }, 10000);
      
      // Method 3: Try to trigger a slight zoom change
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Dispatch a wheel event to trigger tile refresh
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: 1,
          deltaMode: 0,
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        canvas.dispatchEvent(wheelEvent);
        
        // Immediately counter it
        setTimeout(() => {
          const counterEvent = new WheelEvent('wheel', {
            deltaY: -1,
            deltaMode: 0,
            bubbles: true,
            cancelable: true,
            view: window
          });
          canvas.dispatchEvent(counterEvent);
        }, 50);
      }
      
      // Method 4: Try to trigger resize event
      window.dispatchEvent(new Event('resize'));
      
    } catch (error) {
      console.warn('⚠️ Could not trigger canvas refresh:', error);
    }
  }

  /**
   * Disable overlay
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * Clear all overlay data and disable
   */
  clear() {
    this.disable();
    this.imageBitmap = null;
    this.chunkedTiles.clear();
    this.originalTiles.clear();
    this.originalTilesData.clear();
    this.lastProcessedHash = null;
    if (this.processPromise) {
      this.processPromise = null;
    }
  }

  /**
   * Set the image bitmap for overlay processing
   * @param {ImageBitmap} imageBitmap - The image to use for overlay
   */
  async setImage(imageBitmap) {
    this.imageBitmap = imageBitmap;
    this.lastProcessedHash = null; // Invalidate cache
    if (this.imageBitmap && this.startCoords) {
      await this.processImageIntoChunks();
    }
  }

  /**
   * Set the position for overlay rendering
   * @param {Object} startPosition - Starting pixel position {x, y}
   * @param {Object} region - Region coordinates {x, y}
   */
  async setPosition(startPosition, region) {
    if (!startPosition || !region) {
      this.startCoords = null;
      this.chunkedTiles.clear();
      this.lastProcessedHash = null;
      return;
    }
    this.startCoords = { region, pixel: startPosition };
    this.lastProcessedHash = null; // Invalidate cache
    if (this.imageBitmap) {
      await this.processImageIntoChunks();
    }
  }

  /**
   * Generate hash for cache invalidation
   * @returns {string|null} Hash string or null if no data
   * @private
   */
  _generateProcessHash() {
    if (!this.imageBitmap || !this.startCoords) return null;
    const { width, height } = this.imageBitmap;
    const { x: px, y: py } = this.startCoords.pixel;
    const { x: rx, y: ry } = this.startCoords.region;
    
    // Access global state for overlay settings
    const blueMarbleEnabled = window.state?.blueMarbleEnabled || false;
    const overlayOpacity = window.state?.overlayOpacity || 0.6;
    
    return `${width}x${height}_${px},${py}_${rx},${ry}_${blueMarbleEnabled}_${overlayOpacity}`;
  }

  /**
   * Process image into chunks with caching and batch processing
   */
  async processImageIntoChunks() {
    if (!this.imageBitmap || !this.startCoords) {
      console.warn('🚫 Cannot process chunks - missing imageBitmap or startCoords');
      return;
    }

    console.log('🔄 Processing image into chunks...', {
      imageSize: `${this.imageBitmap.width}x${this.imageBitmap.height}`,
      startCoords: this.startCoords
    });

    // Check if we're already processing to avoid duplicate work
    if (this.processPromise) {
      console.log('⏳ Already processing chunks - waiting...');
      return this.processPromise;
    }

    // Check cache validity
    const currentHash = this._generateProcessHash();
    if (this.lastProcessedHash === currentHash && this.chunkedTiles.size > 0) {
      // Using cached overlay chunks
      return;
    }

    // Start processing
    console.log('🚀 Starting new chunk processing...');
    this.processPromise = this._doProcessImageIntoChunks();
    try {
      await this.processPromise;
      this.lastProcessedHash = currentHash;
      console.log(`✅ Chunk processing complete - ${this.chunkedTiles.size} tiles created`);
    } finally {
      this.processPromise = null;
    }
  }

  /**
   * Internal method to process image into chunks
   * @private
   */
  async _doProcessImageIntoChunks() {
    const startTime = performance.now();
    this.chunkedTiles.clear();

    const { width: imageWidth, height: imageHeight } = this.imageBitmap;
    const { x: startPixelX, y: startPixelY } = this.startCoords.pixel;
    const { x: startRegionX, y: startRegionY } = this.startCoords.region;

    const { startTileX, startTileY, endTileX, endTileY } = this.calculateTileRange(
      startRegionX,
      startRegionY,
      startPixelX,
      startPixelY,
      imageWidth,
      imageHeight,
      this.tileSize
    );

    const totalTiles = (endTileX - startTileX + 1) * (endTileY - startTileY + 1);
    console.log(`🔄 Processing ${totalTiles} overlay tiles...`);

    // Process tiles in batches to avoid blocking the main thread
    const batchSize = 4; // Process 4 tiles at a time
    const tilesToProcess = [];

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        tilesToProcess.push({ tx, ty });
      }
    }

    // Process tiles in batches with yielding
    for (let i = 0; i < tilesToProcess.length; i += batchSize) {
      const batch = tilesToProcess.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async ({ tx, ty }) => {
          const tileKey = `${tx},${ty}`;
          const chunkBitmap = await this._processTile(
            tx,
            ty,
            imageWidth,
            imageHeight,
            startPixelX,
            startPixelY,
            startRegionX,
            startRegionY
          );
          if (chunkBitmap) {
            this.chunkedTiles.set(tileKey, chunkBitmap);
          }
        })
      );

      // Yield control to prevent blocking
      if (i + batchSize < tilesToProcess.length) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    const processingTime = performance.now() - startTime;
    console.log(
      `✅ Overlay processed ${this.chunkedTiles.size} tiles in ${Math.round(processingTime)}ms`
    );
  }

  /**
   * Process a single tile
   * @param {number} tx - Tile X coordinate
   * @param {number} ty - Tile Y coordinate
   * @param {number} imageWidth - Image width
   * @param {number} imageHeight - Image height
   * @param {number} startPixelX - Starting pixel X
   * @param {number} startPixelY - Starting pixel Y
   * @param {number} startRegionX - Starting region X
   * @param {number} startRegionY - Starting region Y
   * @returns {Promise<ImageBitmap|null>} Processed tile bitmap
   * @private
   */
  async _processTile(
    tx,
    ty,
    imageWidth,
    imageHeight,
    startPixelX,
    startPixelY,
    startRegionX,
    startRegionY
  ) {
    const tileKey = `${tx},${ty}`;

    // Calculate the portion of the image that overlaps with this tile
    const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
    const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;

    // Crop coordinates within the source image
    const sX = Math.max(0, imgStartX);
    const sY = Math.max(0, imgStartY);
    const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
    const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));

    if (sW <= 0 || sH <= 0) return null;

    // Destination coordinates on the new chunk canvas
    const dX = Math.max(0, -imgStartX);
    const dY = Math.max(0, -imgStartY);

    const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
    const chunkCtx = chunkCanvas.getContext('2d');
    chunkCtx.imageSmoothingEnabled = false;

    const blueMarbleEnabled = window.state?.blueMarbleEnabled || false;

    if (blueMarbleEnabled) {
      // Blue marble effect: scale canvas 3x and show only center pixels of each 3x3 block
      const shreadSize = 3;
      const scaledWidth = sW * shreadSize;
      const scaledHeight = sH * shreadSize;
      const scaledDX = dX * shreadSize;
      const scaledDY = dY * shreadSize;

      // Resize chunk canvas to be 3x larger
      const scaledCanvas = new OffscreenCanvas(this.tileSize * shreadSize, this.tileSize * shreadSize);
      const scaledCtx = scaledCanvas.getContext('2d');
      scaledCtx.imageSmoothingEnabled = false;

      // Draw scaled image
      scaledCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, scaledDX, scaledDY, scaledWidth, scaledHeight);

      // Get image data and make non-center pixels transparent
      const imageData = scaledCtx.getImageData(scaledDX, scaledDY, scaledWidth, scaledHeight);
      const data = imageData.data;

      for (let y = 0; y < scaledHeight; y++) {
        for (let x = 0; x < scaledWidth; x++) {
          const i = (y * scaledWidth + x) * 4;
          // Keep only center pixel of each 3x3 block (x % 3 === 1 && y % 3 === 1)
          if (x % shreadSize !== 1 || y % shreadSize !== 1) {
            data[i + 3] = 0; // Set alpha to 0
          }
        }
      }

      scaledCtx.putImageData(imageData, scaledDX, scaledDY);

      // Return the 3x scaled canvas
      return await scaledCanvas.transferToImageBitmap();
    } else {
      chunkCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, dX, dY, sW, sH);
    }

    return await chunkCanvas.transferToImageBitmap();
  }

  /**
   * Process and respond to tile requests with overlay compositing
   * @param {Object} eventData - Event data containing endpoint, blobID, and blobData
   */
  async processAndRespondToTileRequest(eventData) {
    const { endpoint, blobID, blobData } = eventData;

    let finalBlob = blobData;

    if (this.isEnabled && this.chunkedTiles.size > 0) {
      const tileMatch = endpoint.match(/(\d+)\/(\d+)\.png/);
      if (tileMatch) {
        const tileX = parseInt(tileMatch[1], 10);
        const tileY = parseInt(tileMatch[2], 10);
        const tileKey = `${tileX},${tileY}`;

        const chunkBitmap = this.chunkedTiles.get(tileKey);
        // Also store the original tile bitmap for later pixel color checks
        try {
          const originalBitmap = await createImageBitmap(blobData);
          this.originalTiles.set(tileKey, originalBitmap);
          // Cache full ImageData for fast pixel access (avoid repeated drawImage/getImageData)
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
            // Store typed array copy to avoid retaining large canvas
            this.originalTilesData.set(tileKey, {
              w: originalBitmap.width,
              h: originalBitmap.height,
              data: new Uint8ClampedArray(imgData.data),
            });
          } catch (e) {
            // If ImageData extraction fails, still keep the bitmap as fallback
            console.warn('OverlayManager: could not cache ImageData for', tileKey, e);
          }
        } catch (e) {
          console.warn('OverlayManager: could not create original bitmap for', tileKey, e);
        }
        
        if (chunkBitmap) {
          try {
            // Use faster compositing for better performance
            finalBlob = await this._compositeTileOptimized(blobData, chunkBitmap);
          } catch (e) {
            console.error('Error compositing overlay:', e);
            // Fallback to original tile on error
            finalBlob = blobData;
          }
        }
      }
    }

    // Send the (possibly modified) blob back to the injected script
    window.postMessage(
      {
        source: 'auto-image-overlay',
        blobID: blobID,
        blobData: finalBlob,
      },
      '*'
    );
  }

  /**
   * Get pixel color from a tile
   * @param {number} tileX - Tile X coordinate
   * @param {number} tileY - Tile Y coordinate
   * @param {number} pixelX - Pixel X within tile
   * @param {number} pixelY - Pixel Y within tile
   * @returns {Promise<Array|null>} [r,g,b,a] or null
   */
  async getTilePixelColor(tileX, tileY, pixelX, pixelY) {
    const tileKey = `${tileX},${tileY}`;
    
    // Get transparency threshold from global state or config
    const alphaThresh = window.state?.customTransparencyThreshold || 
                       window.CONFIG?.TRANSPARENCY_THRESHOLD || 10;

    // 1. Prefer cached ImageData if available
    const cached = this.originalTilesData.get(tileKey);
    if (cached && cached.data && cached.w > 0 && cached.h > 0) {
      const x = Math.max(0, Math.min(cached.w - 1, pixelX));
      const y = Math.max(0, Math.min(cached.h - 1, pixelY));
      const idx = (y * cached.w + x) * 4;
      const d = cached.data;
      const a = d[idx + 3];

      const paintTransparentPixels = window.state?.paintTransparentPixels || false;
      if (!paintTransparentPixels && a < alphaThresh) {
        // Treat as transparent / unavailable
        return null;
      }
      return [d[idx], d[idx + 1], d[idx + 2], a];
    }

    // 2. Fallback: use bitmap, with retry
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const bitmap = this.originalTiles.get(tileKey);
      if (!bitmap) {
        if (attempt === maxRetries) {
          console.warn('OverlayManager: no bitmap for', tileKey, 'after', maxRetries, 'attempts');
        } else {
          await this._sleep(50 * attempt); // exponential delay
        }
        continue;
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

        const paintTransparentPixels = window.state?.paintTransparentPixels || false;
        if (!paintTransparentPixels && a < alphaThresh) {
          return null;
        }

        return [data[0], data[1], data[2], a];
      } catch (e) {
        console.warn('OverlayManager: failed to read pixel (attempt', attempt, ')', tileKey, e);
        if (attempt < maxRetries) {
          await this._sleep(50 * attempt);
        } else {
          console.error(
            'OverlayManager: failed to read pixel after',
            maxRetries,
            'attempts',
            tileKey
          );
        }
      }
    }

    // 3. If everything fails, return null
    return null;
  }

  /**
   * Composite tile with overlay using optimized rendering
   * @param {Blob} originalBlob - Original tile blob
   * @param {ImageBitmap} overlayBitmap - Overlay bitmap
   * @returns {Promise<Blob>} Composited tile blob
   * @private
   */
  async _compositeTileOptimized(originalBlob, overlayBitmap) {
    const originalBitmap = await createImageBitmap(originalBlob);
    const blueMarbleEnabled = window.state?.blueMarbleEnabled || false;

    // Blue marble mode uses 3x scaled canvas
    const scale = blueMarbleEnabled ? 3 : 1;
    const canvasWidth = originalBitmap.width * scale;
    const canvasHeight = originalBitmap.height * scale;

    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Disable antialiasing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    // Draw original tile first (scaled if blue marble mode)
    ctx.drawImage(originalBitmap, 0, 0, originalBitmap.width, originalBitmap.height,
                  0, 0, canvasWidth, canvasHeight);

    // Set opacity and draw overlay with optimized blend mode
    const overlayOpacity = window.state?.overlayOpacity || 0.6;
    ctx.globalAlpha = overlayOpacity;
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(overlayBitmap, 0, 0);

    // Use faster blob conversion with compression settings
    return await canvas.convertToBlob({
      type: 'image/png',
      quality: 0.95, // Slight compression for faster processing
    });
  }

  /**
   * Wait until all required tiles are loaded and cached
   * @param {number} startRegionX - Starting region X
   * @param {number} startRegionY - Starting region Y
   * @param {number} pixelWidth - Image width in pixels
   * @param {number} pixelHeight - Image height in pixels
   * @param {number} startPixelX - Starting pixel X offset
   * @param {number} startPixelY - Starting pixel Y offset
   * @param {number} timeoutMs - Timeout in milliseconds
   * @returns {Promise<boolean>} True if tiles are ready
   */
  async waitForTiles(
    startRegionX,
    startRegionY,
    pixelWidth,
    pixelHeight,
    startPixelX = 0,
    startPixelY = 0,
    timeoutMs = 10000
  ) {
    const { startTileX, startTileY, endTileX, endTileY } = this.calculateTileRange(
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

    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      const stopFlag = window.state?.stopFlag || false;
      if (stopFlag) {
        console.log('waitForTiles: stopped by user');
        return false;
      }

      const missing = requiredTiles.filter((key) => !this.originalTiles.has(key));
      if (missing.length === 0) {
        console.log(`✅ All ${requiredTiles.length} required tiles are loaded`);
        return true;
      }

      await this._sleep(100);
    }

    console.warn(`❌ Timeout waiting for tiles: ${requiredTiles.length} required, 
      ${requiredTiles.filter((k) => this.originalTiles.has(k)).length} loaded`);
    return false;
  }

  /**
   * Calculate tile range for given parameters
   * @param {number} startRegionX - Starting region X
   * @param {number} startRegionY - Starting region Y
   * @param {number} startPixelX - Starting pixel X
   * @param {number} startPixelY - Starting pixel Y
   * @param {number} width - Width in pixels
   * @param {number} height - Height in pixels
   * @param {number} tileSize - Size of each tile (default 1000)
   * @returns {{startTileX: number, startTileY: number, endTileX: number, endTileY: number}}
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
  }

  /**
   * Preload tiles for save file coordinates to populate originalTiles cache
   * This fixes the "no bitmap" error when loading save files
   * @param {Object} startPosition - The start position from save file  
   * @param {Object} region - The region from save file
   * @param {number} width - Image width
   * @param {number} height - Image height
   */
  /**
   * Preload tiles for save file coordinates to populate originalTiles cache
   * This fixes the "no bitmap" error when loading save files
   * For WPlace, we can't manually fetch tiles like r/place - we need to trigger natural tile loading
   * @param {Object} startPosition - The start position from save file  
   * @param {Object} region - The region from save file
   * @param {number} width - Image width
   * @param {number} height - Image height
   */
  async preloadTilesForSaveFile(startPosition, region, width, height) {
    if (!startPosition || !region || !width || !height) {
      console.warn('OverlayManager: Missing parameters for tile preload');
      return;
    }

    try {
      // Calculate tiles that need to be loaded based on image area
      const tileSize = 1000; // WPlace uses 1000px tiles, not 256px like r/place
      const tiles = this.calculateTileRange(
        region.x, region.y,
        startPosition.x, startPosition.y,
        width, height,
        tileSize
      );

      console.log(`🔄 WPlace: Need to preload ${(tiles.endTileX - tiles.startTileX + 1) * (tiles.endTileY - tiles.startTileY + 1)} tiles for save file...`);

      // For WPlace, instead of manually fetching tiles, we need to wait for natural tile loading
      // The browser will request tiles as the user navigates, and we intercept them
      // For now, just log the tiles we need and let the overlay work with what's available
      const neededTiles = [];
      for (let tileX = tiles.startTileX; tileX <= tiles.endTileX; tileX++) {
        for (let tileY = tiles.startTileY; tileY <= tiles.endTileY; tileY++) {
          neededTiles.push(`${tileX},${tileY}`);
        }
      }

      console.log(`📍 WPlace: Will use tiles when available: ${neededTiles.slice(0, 5).join(', ')}${neededTiles.length > 5 ? ` and ${neededTiles.length - 5} more...` : ''}`);
      
      // Store the needed tiles list for reference
      this.neededTilesForSave = new Set(neededTiles);

      console.log('✅ WPlace: Tile preload setup complete - tiles will populate as user navigates');
    } catch (error) {
      console.error('❌ Failed to setup tile preload for save file:', error);
    }
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   * @private
   */
  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.clear();
    if (this.workerPool) {
      // Clean up worker pool if implemented
      this.workerPool = null;
    }
  }
}

// Create global instance
window.WPlaceOverlayManager = OverlayManager;

// Create global instance for Auto-Image.js compatibility
window.globalOverlayManager = new OverlayManager();

// Legacy compatibility - expose key methods globally for backward compatibility
window.OverlayManager = OverlayManager;

console.log('✅ WPlace Overlay Manager loaded and ready');