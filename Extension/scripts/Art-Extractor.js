// ==UserScript==
// @name         WPlace Art Extractor
// @namespace    http://tampermonkey.net/
// @version      2025-09-20.1
// @description  Extract artwork areas to JSON for Auto-Repair.js
// @author       Wbot
// @match        https://wplace.live/*
// @grant        none
// @icon
// ==/UserScript==

localStorage.removeItem("lp");

// Fallback translation function for when utils manager isn't loaded
function getText(key, params) {
  // Try to get translation from loadedTranslations
  try {
    if (window.loadedTranslations && window.loadedTranslations[window.state?.language || 'en']) {
      const translation = window.loadedTranslations[window.state?.language || 'en'][key];
      if (translation && typeof translation === 'string') {
        if (params && typeof params === 'object') {
          return translation.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match);
        }
        return translation;
      }
    }
  } catch (error) {
    console.warn('Translation lookup error:', error);
  }

  return key; // Fallback to key if no translation found
}

;(async () => {
  // Prevent multiple instances of this script from running
  if (window.WPLACE_ART_EXTRACTOR_LOADED) {
    console.log('Art Extractor already loaded, skipping...');
    return;
  }
  window.WPLACE_ART_EXTRACTOR_LOADED = true;

  console.log('%c🎨 WPlace Art Extractor Starting...', 'color: #ff6b35; font-weight: bold; font-size: 16px;');
  console.log('%c✨ Interactive pixel capture for area extraction!', 'color: #26de81; font-weight: bold;');
  
  // Immediate visual confirmation that script is running
  try {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; background: #ff6b35; color: white; padding: 8px 12px; 
                  border-radius: 5px; z-index: 10000; font-family: Arial; font-size: 12px;">
        🎨 Art Extractor Loading...
      </div>
    `;
    document.body.appendChild(testDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
      }
    }, 3000);
  } catch (e) {
    console.log('Could not create test notification:', e);
  }

  // CONFIGURATION CONSTANTS  
  const CONFIG = {
    OVERLAY_OPACITY: 0.7,
    SELECTION_COLOR: { r: 50, g: 200, b: 50, a: 180 }, // Green extraction overlay
    CORNER_MARKER_COLOR: { r: 255, g: 255, b: 0, a: 255 }, // Yellow corner markers
    CORNER_MARKER_SIZE: 12, // Corner marker size
    MIN_AREA_SIZE: 1,
    MAX_AREA_SIZE: 2500,
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
    }
  };

  // Expose CONFIG globally for the utils manager and other modules
  window.ART_EXTRACTOR_CONFIG = CONFIG;

  // GLOBAL STATE
  const state = {
    // Pixel capture state
    isCapturing: false,
    capturedPixels: [], // Array of painted pixels with their world coordinates
    requiredPixels: 2,   // Need 2 corner pixels
    
    // Selection area
    selectionArea: null, // { x, y, width, height, regionX, regionY }
    
    // UI state
    ui: null,
    overlayManager: null, // Will use global overlay manager like Auto-Image
    
    // Scanning state
    isScanning: false,
    scannedPixels: [],
    totalPixels: 0,
    
    // Auto-Image integration state
    imageData: null,
    startPosition: null,
    region: null,
    
    // Canvas monitoring
    paintEventListener: null,
    lastPaintEvent: null,
    
    language: 'en',
  };

  // Expose state globally
  window.ART_EXTRACTOR_STATE = state;

  // Use Auto-Image's overlay system - no custom overlay manager needed
  // We'll integrate with the global overlay manager that Auto-Image uses

  // Monitor WPlace paint events to capture pixel coordinates using fetch interception
  let originalFetch = null;
  let fetchInterceptionActive = false;
  
  function setupPixelCapture() {
    console.log('🎯 Setting up pixel paint monitoring...');
    
    try {
      // Store original fetch if not already stored
      if (!originalFetch) {
        originalFetch = window.fetch;
      }
      
      // Install fetch interceptor for pixel capture
      if (!fetchInterceptionActive) {
        window.fetch = async (url, options) => {
          // Check if this is a pixel painting request
          if (state.isCapturing && 
              typeof url === 'string' && 
              url.includes('/s0/pixel/') && 
              options && 
              options.method === 'POST') {
            
            try {
              console.log('🎯 Intercepting pixel paint request:', url);
              
              // Call original fetch first
              const response = await originalFetch(url, options);
              
              // If request was successful and we have body data, extract coordinates
              if (response.ok && options.body) {
                let requestBody;
                try {
                  requestBody = JSON.parse(options.body);
                } catch (parseError) {
                  console.warn('Could not parse request body:', parseError);
                  return response;
                }
                
                // Extract coordinates from request
                if (requestBody.coords && Array.isArray(requestBody.coords) && requestBody.coords.length >= 2) {
                  const localX = requestBody.coords[0]; // 0-999 within tile
                  const localY = requestBody.coords[1]; // 0-999 within tile
                  
                  // Extract tile coordinates from URL: /s0/pixel/{tileX}/{tileY}
                  const tileMatch = url.match(/\/s0\/pixel\/(\-?\d+)\/(\-?\d+)/);
                  if (tileMatch) {
                    const tileX = parseInt(tileMatch[1]);
                    const tileY = parseInt(tileMatch[2]);
                    
                    // Convert to global canvas coordinates
                    const globalX = tileX * 1000 + localX;
                    const globalY = tileY * 1000 + localY;
                    
                    console.log(`🎯 Captured painted pixel: (${globalX}, ${globalY}) from tile (${tileX}, ${tileY}) local (${localX}, ${localY})`);
                    
                    // Add the captured pixel
                    setTimeout(() => {
                      addCapturedPixel(globalX, globalY);
                    }, 100);
                  }
                }
              }
              
              return response;
            } catch (error) {
              console.error('❌ Error intercepting pixel paint:', error);
              // Fallback to original fetch
              return originalFetch(url, options);
            }
          }
          
          // For all other requests, use original fetch
          return originalFetch(url, options);
        };
        
        fetchInterceptionActive = true;
        console.log('✅ Fetch interception enabled');
      }
      
      return true;
      
    } catch (error) {
      console.warn('⚠️ Could not set up paint monitoring:', error);
      return false;
    }
  }
  
  // Restore original fetch function
  function restoreFetch() {
    if (originalFetch && fetchInterceptionActive) {
      window.fetch = originalFetch;
      fetchInterceptionActive = false;
      console.log('🔄 Original fetch restored');
    }
  }
  
  // Handle canvas clicks during capture mode (fallback method)
  function handleCanvasClick(event) {
    if (!state.isCapturing) return;
    
    // Only handle clicks on canvas elements
    const canvas = event.target.closest('canvas');
    if (!canvas) return;
    
    console.log('� Canvas click detected during capture mode');
    
    // For now, we'll use manual coordinate input as the primary method
    // since intercepting the actual paint events is complex
    setTimeout(() => {
      if (state.isCapturing && state.capturedPixels.length < state.requiredPixels) {
        promptForCoordinates();
      }
    }, 100);
  }
  
  // Handle detected paint events (for future implementation)
  function handlePaintEvent(event) {
    if (!state.isCapturing) return;
    
    console.log('🎯 Processing paint event:', event);
    
    // Extract coordinates from paint event
    let worldX, worldY;
    
    if (event.x !== undefined && event.y !== undefined) {
      worldX = event.x;
      worldY = event.y;
    } else if (event.position) {
      worldX = event.position.x;
      worldY = event.position.y;
    } else if (event.coords) {
      worldX = event.coords[0];
      worldY = event.coords[1];
    } else {
      console.warn('⚠️ Could not extract coordinates from paint event');
      return;
    }
    
    // Add the painted pixel to our capture list
    addCapturedPixel(worldX, worldY);
  }
  
  // Manual coordinate input (fallback method when auto-capture doesn't work)
  function promptForCoordinates() {
    if (!state.isCapturing) {
      showAlert('Not in capture mode', 'warning');
      return;
    }
    
    const pixelNum = state.capturedPixels.length + 1;
    const cornerType = pixelNum === 1 ? 'UPPER-LEFT' : 'LOWER-RIGHT';
    
    const coordStr = prompt(
      `📍 Enter coordinates for ${cornerType} corner (${pixelNum}/${state.requiredPixels})\n\n` +
      `Format: x,y (e.g., 1000,500)\n\n` +
      `To find coordinates:\n` +
      `1. Navigate to the ${cornerType} corner of your area\n` +
      `2. Hover over the exact pixel position\n` +
      `3. Check coordinates in bottom-left corner of WPlace\n` +
      `4. Enter them here:\n\n` +
      `Tip: You can also just paint a pixel there and it will be captured automatically!`
    );
    
    if (coordStr && coordStr.trim()) {
      const coords = coordStr.trim().split(',').map(n => parseInt(n.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        addCapturedPixel(coords[0], coords[1]);
      } else {
        showAlert('Invalid coordinates format. Use: x,y (e.g., 1000,500)', 'error');
        // Try again
        setTimeout(() => promptForCoordinates(), 500);
      }
    } else if (coordStr !== null) {
      // User entered empty string, try again
      showAlert('Please enter coordinates', 'warning');
      setTimeout(() => promptForCoordinates(), 500);
    }
    // If user clicked cancel (coordStr === null), do nothing
  }
  
  // Add a captured pixel with enhanced validation
  function addCapturedPixel(worldX, worldY) {
    if (!state.isCapturing) {
      console.log('Not in capture mode, ignoring pixel');
      return;
    }
    
    if (state.capturedPixels.length >= state.requiredPixels) {
      showAlert('Already have enough pixels', 'warning');
      return;
    }
    
    // Validate coordinates
    if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) {
      showAlert('Invalid pixel coordinates', 'error');
      return;
    }
    
    // Calculate region and local coordinates
    const regionX = Math.floor(worldX / 1000);
    const regionY = Math.floor(worldY / 1000);
    const pixelX = worldX % 1000;
    const pixelY = worldY % 1000;
    
    const pixel = {
      worldX,
      worldY,
      regionX,
      regionY,
      pixelX,
      pixelY,
      timestamp: Date.now(),
      cornerType: state.capturedPixels.length === 0 ? 'upperLeft' : 'lowerRight'
    };
    
    state.capturedPixels.push(pixel);
    console.log(`🎯 Captured ${pixel.cornerType} pixel ${state.capturedPixels.length}/${state.requiredPixels}:`, pixel);
    
    updateUI();
    
    // Progress messages
    if (state.capturedPixels.length === 1) {
      showAlert(`✅ Upper-left corner captured: (${worldX}, ${worldY})`, 'success');
      setTimeout(() => {
        showAlert('🎯 Now paint a pixel at the LOWER-RIGHT corner of the area', 'info');
      }, 1500);
    } else if (state.capturedPixels.length >= state.requiredPixels) {
      showAlert(`✅ Lower-right corner captured: (${worldX}, ${worldY})`, 'success');
      // Small delay before auto-scanning to show the success message
      setTimeout(() => {
        completeAreaCapture();
        // Auto-trigger scan after area capture is complete
        setTimeout(() => {
          scanSelectedArea();
        }, 500);
      }, 1000);
    }
  }

  // Complete area capture when we have 2 pixels with validation
  function completeAreaCapture() {
    state.isCapturing = false;
    restoreFetch(); // Restore original fetch function
    
    if (state.capturedPixels.length < 2) {
      showAlert('Need at least 2 pixels to define area', 'error');
      return;
    }
    
    // Calculate bounding box from captured pixels
    const pixels = state.capturedPixels;
    const minX = Math.min(...pixels.map(p => p.worldX));
    const minY = Math.min(...pixels.map(p => p.worldY));
    const maxX = Math.max(...pixels.map(p => p.worldX));
    const maxY = Math.max(...pixels.map(p => p.worldY));
    
    // Validation: ensure upper-left is actually upper-left
    if (minX >= maxX || minY >= maxY) {
      showAlert('❌ Invalid area: upper-left corner must be less than lower-right corner', 'error');
      // Reset capture to try again
      state.capturedPixels = [];
      startPixelCapture();
      return;
    }
    
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    
    // Size validation
    if (width < CONFIG.MIN_AREA_SIZE || height < CONFIG.MIN_AREA_SIZE) {
      showAlert(`❌ Area too small: ${width}×${height} pixels (minimum: ${CONFIG.MIN_AREA_SIZE}×${CONFIG.MIN_AREA_SIZE})`, 'error');
      return;
    }
    
    if (width > CONFIG.MAX_AREA_SIZE || height > CONFIG.MAX_AREA_SIZE) {
      showAlert(`❌ Area too large: ${width}×${height} pixels (maximum: ${CONFIG.MAX_AREA_SIZE}×${CONFIG.MAX_AREA_SIZE})`, 'error');
      return;
    }
    
    state.selectionArea = {
      x1: minX,    // Coordinate naming
      y1: minY,
      x2: maxX,
      y2: maxY,
      x: minX,     // Keep compatibility
      y: minY,
      width: width,
      height: height,
      regionX: Math.floor(minX / 1000),
      regionY: Math.floor(minY / 1000)
    };
    
    console.log('📐 Area capture complete:', state.selectionArea);
    showAlert(`✅ Area captured: ${width}×${height} pixels from (${minX},${minY}) to (${maxX},${maxY})`, 'success');
    
    // Set up overlay using Auto-Image's system
    setTimeout(() => {
      setupAutoImageOverlay();
    }, 500);
    
    updateUI();
  }
  
  // Set up visual overlay for selected extraction area (simplified approach)
  async function setupAutoImageOverlay() {
    if (!state.selectionArea) return;
    
    console.log('🎨 Setting up extraction area overlay...');
    
    try {
      const { x1, y1, x2, y2, width, height, regionX, regionY } = state.selectionArea;
      
      // Try to use Auto-Image's overlay if available, otherwise create simple visual feedback
      if (window.autoImageOverlayManager) {
        console.log('📊 Using Auto-Image overlay manager for area visualization');
        
        const overlayMgr = window.autoImageOverlayManager;
        
        // Create overlay canvas showing the selected area
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Fill with extraction area overlay
        ctx.fillStyle = `rgba(${CONFIG.SELECTION_COLOR.r}, ${CONFIG.SELECTION_COLOR.g}, ${CONFIG.SELECTION_COLOR.b}, 0.3)`;
        ctx.fillRect(0, 0, width, height);
        
        // Add extraction border
        ctx.strokeStyle = `rgba(${CONFIG.SELECTION_COLOR.r}, ${CONFIG.SELECTION_COLOR.g}, ${CONFIG.SELECTION_COLOR.b}, 0.8)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        // Add corner markers
        const cornerSize = CONFIG.CORNER_MARKER_SIZE;
        ctx.fillStyle = `rgba(${CONFIG.CORNER_MARKER_COLOR.r}, ${CONFIG.CORNER_MARKER_COLOR.g}, ${CONFIG.CORNER_MARKER_COLOR.b}, 1)`;
        
        // Top-left corner
        ctx.fillRect(0, 0, cornerSize, cornerSize);
        // Top-right corner  
        ctx.fillRect(width - cornerSize, 0, cornerSize, cornerSize);
        // Bottom-left corner
        ctx.fillRect(0, height - cornerSize, cornerSize, cornerSize);
        // Bottom-right corner
        ctx.fillRect(width - cornerSize, height - cornerSize, cornerSize, cornerSize);
        
        try {
          // Create image bitmap
          const overlayBitmap = await canvas.transferToImageBitmap();
          
          // Set the overlay using Auto-Image's API
          await overlayMgr.setImage(overlayBitmap);
          await overlayMgr.setPosition(
            { x: x1 % 1000, y: y1 % 1000 },
            { x: regionX, y: regionY }
          );
          
          // Enable the overlay
          overlayMgr.enable();
          
          // Store references for cleanup
          state.overlayManager = overlayMgr;
          state.imageData = overlayBitmap;
          state.startPosition = { x: x1 % 1000, y: y1 % 1000 };
          state.region = { x: regionX, y: regionY };
          
          console.log('✅ Extraction area overlay enabled');
        } catch (overlayError) {
          console.warn('⚠️ Could not set overlay, continuing without visual feedback:', overlayError);
        }
        
      } else {
        console.log('📋 Auto-Image overlay not available, using console feedback only');
      }
      
    } catch (error) {
      console.error('❌ Failed to setup extraction area overlay:', error);
      // Continue without overlay - not critical for extraction functionality
    }
  }
  // Tile-based pixel scanning for area extraction
  async function scanSelectedArea() {
    if (!state.selectionArea) {
      showAlert('No area selected', 'error');
      return;
    }

    console.log('🔍 Starting area scan...');
    state.isScanning = true;
    state.scannedPixels = [];
    updateUI();

    try {
      const { x1, y1, x2, y2 } = state.selectionArea;
      const areaWidth = x2 - x1 + 1;
      const areaHeight = y2 - y1 + 1;
      
      console.log(`🔍 Analyzing area ${areaWidth}x${areaHeight} from (${x1},${y1}) to (${x2},${y2})`);
      
      // Tile calculation
      const startTileX = Math.floor(x1 / 1000);
      const startTileY = Math.floor(y1 / 1000);
      const endTileX = Math.floor(x2 / 1000);
      const endTileY = Math.floor(y2 / 1000);
      
      state.totalPixels = areaWidth * areaHeight;
      let processedPixels = 0;
      
      // Process each tile that intersects with our area
      for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
          try {
            console.log(`📄 Processing tile (${tileX}, ${tileY})...`);
            
            // Download tile data
            const tileBlob = await getTileImage(tileX, tileY);
            if (!tileBlob) {
              console.warn(`⚠️ Could not download tile ${tileX},${tileY}, skipping...`);
              continue;
            }
            
            // Process tile data
            const tileImageData = await processTileBlob(tileBlob);
            if (!tileImageData) {
              console.warn(`⚠️ Could not process tile ${tileX},${tileY}, skipping...`);
              continue;
            }
            
            // Calculate intersection between area and current tile
            const tileStartX = tileX * 1000;
            const tileStartY = tileY * 1000;
            const tileEndX = tileStartX + 1000;
            const tileEndY = tileStartY + 1000;
            
            const intersectStartX = Math.max(x1, tileStartX);
            const intersectStartY = Math.max(y1, tileStartY);
            const intersectEndX = Math.min(x2 + 1, tileEndX);
            const intersectEndY = Math.min(y2 + 1, tileEndY);
            
            // Extract pixels from intersection area
            for (let globalY = intersectStartY; globalY < intersectEndY; globalY++) {
              for (let globalX = intersectStartX; globalX < intersectEndX; globalX++) {
                // Convert to tile-local coordinates
                const localX = globalX - tileStartX;
                const localY = globalY - tileStartY;
                
                // Normalize coordinates
                const normalizedX = (localX % 1000 + 1000) % 1000;
                const normalizedY = (localY % 1000 + 1000) % 1000;
                
                if (normalizedX >= 0 && normalizedX < 1000 && 
                    normalizedY >= 0 && normalizedY < 1000 &&
                    normalizedX < tileImageData.width && 
                    normalizedY < tileImageData.height) {
                  
                  // Extract RGBA values
                  const pixelIndex = (normalizedY * tileImageData.width + normalizedX) * 4;
                  const r = tileImageData.data[pixelIndex];
                  const g = tileImageData.data[pixelIndex + 1];
                  const b = tileImageData.data[pixelIndex + 2];
                  const a = tileImageData.data[pixelIndex + 3];
                  
                  if (a > 0) { // Skip transparent pixels
                    // Find closest color in WPlace palette
                    const closestColor = findClosestColor(r, g, b);
                    
                    if (closestColor) {
                      // Convert to area-relative coordinates
                      const areaX = globalX - x1;
                      const areaY = globalY - y1;
                      
                      state.scannedPixels.push({
                        x: areaX,
                        y: areaY,
                        worldX: globalX,
                        worldY: globalY,
                        color: closestColor,
                        rgb: { r, g, b, a }
                      });
                    }
                  }
                }
                
                processedPixels++;
              }
            }
            
            // Update progress every tile
            updateUI();
            await new Promise(resolve => setTimeout(resolve, 1));
            
          } catch (error) {
            console.error(`❌ Error processing tile ${tileX},${tileY}:`, error);
          }
        }
      }
      
      console.log(`✅ Scan complete: ${state.scannedPixels.length} pixels extracted`);
      showAlert(`✅ Extracted ${state.scannedPixels.length} pixels from area`, 'success');
      
    } catch (error) {
      console.error('❌ Area extraction failed:', error);
      showAlert(`❌ Extraction failed: ${error.message}`, 'error');
    } finally {
      state.isScanning = false;
      updateUI();
    }
  }
  
  // Download tile images
  async function getTileImage(tileX, tileY) {
    try {
      const tileUrl = `https://backend.wplace.live/files/s0/tiles/${tileX}/${tileY}.png`;
      const response = await fetch(tileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.warn(`Error downloading tile ${tileX},${tileY}:`, error);
      return null;
    }
  }
  
  // Process tile blob into ImageData
  async function processTileBlob(blob) {
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Error processing tile blob:', error);
      return null;
    }
  }

  // Color matching using LAB color space for better accuracy
  function findClosestColor(r, g, b) {
    if (!CONFIG.COLOR_MAP) return null;
    
    let closestColor = null;
    let minDistance = Infinity;
    
    // Convert input RGB to LAB color space
    const inputLab = rgbToLab(r, g, b);
    
    for (const [index, colorInfo] of Object.entries(CONFIG.COLOR_MAP)) {
      if (!colorInfo.rgb) continue; // Skip transparent
      
      const { r: cr, g: cg, b: cb } = colorInfo.rgb;
      
      // Convert palette color to LAB
      const paletteLab = rgbToLab(cr, cg, cb);
      
      // Calculate Delta-E distance
      const deltaE = calculateDeltaE(inputLab, paletteLab);
      
      if (deltaE < minDistance) {
        minDistance = deltaE;
        closestColor = colorInfo;
      }
    }
    
    return closestColor;
  }
  
  // RGB to LAB color space conversion
  function rgbToLab(r, g, b) {
    // Normalize RGB values
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    // Convert to XYZ
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    
    // Convert XYZ to LAB
    const xn = x / 0.95047;
    const yn = y / 1.00000;
    const zn = z / 1.08883;
    
    const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
    const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
    const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);
    
    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bLab = 200 * (fy - fz);
    
    return { l, a, b: bLab };
  }
  
  // Delta-E color difference calculation
  function calculateDeltaE(lab1, lab2) {
    const deltaL = lab1.l - lab2.l;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  // Export to JSON (Auto-Image compatible format for Auto-Repair)
  function exportToJSON(exportType = 'autofix') {
    if (!state.selectionArea || state.scannedPixels.length === 0) {
      showAlert('No data to export. Please select an area and scan it first.', 'error');
      return;
    }

    console.log(`📤 Exporting ${state.scannedPixels.length} pixels in ${exportType} format...`);
    console.log('🔍 [DEBUG] Selection area:', state.selectionArea);
    console.log('🔍 [DEBUG] Scanned pixels count:', state.scannedPixels.length);

    try {
      // Get filename from input
      const filenameInput = state.ui?.querySelector('#filename-input');
      const userFilename = filenameInput?.value?.trim() || '.json';
      let filename;
      
      if (userFilename === '.json' || userFilename === '') {
        // Use default filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        filename = `wplace-extracted-${exportType}-${timestamp}.json`;
      } else {
        // Ensure filename ends with .json
        filename = userFilename.endsWith('.json') ? userFilename : userFilename + '.json';
      }

      // Build Auto-Image compatible data structure
      const { x1, y1, x2, y2 } = state.selectionArea;
      const width = x2 - x1 + 1;
      const height = y2 - y1 + 1;
      
      // Convert scanned pixels to Auto-Image pixel format (Uint8ClampedArray)
      const imagePixels = new Uint8ClampedArray(width * height * 4);
      imagePixels.fill(0); // Initialize with transparent pixels
      
      // Fill pixel data from scanned pixels
      for (const pixel of state.scannedPixels) {
        const pixelIndex = (pixel.y * width + pixel.x) * 4;
        if (pixelIndex >= 0 && pixelIndex < imagePixels.length - 3) {
          const rgb = pixel.color?.rgb || pixel.rgb;
          imagePixels[pixelIndex] = rgb.r;
          imagePixels[pixelIndex + 1] = rgb.g;
          imagePixels[pixelIndex + 2] = rgb.b;
          imagePixels[pixelIndex + 3] = rgb.a || 255;
        }
      }
      
      // Create different formats based on export type
      let saveData;
      
      if (exportType === 'autofix') {
        // Auto-Fix format: Include exact position and region for restoration
        saveData = {
          timestamp: Date.now(),
          version: '2.2',
          state: {
            totalPixels: width * height,
            paintedPixels: 0,
            lastPosition: { x: 0, y: 0 },
            startPosition: { x: x1 % 1000, y: y1 % 1000 },
            region: { x: Math.floor(x1 / 1000), y: Math.floor(y1 / 1000) },
            imageLoaded: true,
            colorsChecked: true,
            coordinateMode: 'rows',
            coordinateDirection: 'top-left',
            coordinateSnake: false,
            blockWidth: 1,
            blockHeight: 1,
            availableColors: Object.values(CONFIG.COLOR_MAP).filter(c => c.rgb).map(color => ({
              ...color,
              rgb: [color.rgb.r, color.rgb.g, color.rgb.b] // Convert RGB object to array for Auto-Image compatibility
            })),
            // Additional Auto-Image required fields for compatibility
            paintWhitePixels: true,
            paintTransparentPixels: false,
            displayCharges: 0,
            preciseCurrentCharges: 0,
            maxCharges: 1,
            cooldown: 30000,
            stopFlag: false,
            selectingPosition: false,
            minimized: false,
            estimatedTime: 0,
            language: 'en',
            paintingSpeed: 5,
            batchMode: 'normal',
            randomBatchMin: 1,
            randomBatchMax: 5,
            cooldownChargeThreshold: 10,
            overlayOpacity: 0.7,
            blueMarbleEnabled: false,
            ditheringEnabled: true,
            colorMatchingAlgorithm: 'lab',
            enableChromaPenalty: true,
            chromaPenaltyWeight: 0.15,
            customTransparencyThreshold: 128,
            customWhiteThreshold: 230,
            paintUnavailablePixels: true,
            // Critical missing fields that Auto-Image expects
            fullChargeData: null,
            fullChargeInterval: null,
            tokenSource: 'generator',
            initialSetupComplete: true,
            resizeSettings: null,
            originalImage: null,
            resizeIgnoreMask: null
          },
          imageData: {
            width: width,
            height: height,
            pixels: Array.from(imagePixels),
            totalPixels: width * height
          },
          paintedMapPacked: null
        };
      } else {
        // Auto-Image format: Empty position and region for manual placement
        saveData = {
          timestamp: Date.now(),
          version: '2.2',
          state: {
            totalPixels: width * height,
            paintedPixels: 0,
            lastPosition: { x: 0, y: 0 },
            startPosition: null, // Empty for manual placement
            region: null, // Empty for manual placement
            imageLoaded: true,
            colorsChecked: true,
            coordinateMode: 'rows',
            coordinateDirection: 'top-left',
            coordinateSnake: false,
            blockWidth: 1,
            blockHeight: 1,
            availableColors: Object.values(CONFIG.COLOR_MAP).filter(c => c.rgb).map(color => ({
              ...color,
              rgb: [color.rgb.r, color.rgb.g, color.rgb.b] // Convert RGB object to array for Auto-Image compatibility
            })),
            // Additional Auto-Image required fields for compatibility
            paintWhitePixels: true,
            paintTransparentPixels: false,
            displayCharges: 0,
            preciseCurrentCharges: 0,
            maxCharges: 1,
            cooldown: 30000,
            stopFlag: false,
            selectingPosition: false,
            minimized: false,
            estimatedTime: 0,
            language: 'en',
            paintingSpeed: 5,
            batchMode: 'normal',
            randomBatchMin: 1,
            randomBatchMax: 5,
            cooldownChargeThreshold: 10,
            overlayOpacity: 0.7,
            blueMarbleEnabled: false,
            ditheringEnabled: true,
            colorMatchingAlgorithm: 'lab',
            enableChromaPenalty: true,
            chromaPenaltyWeight: 0.15,
            customTransparencyThreshold: 128,
            customWhiteThreshold: 230,
            paintUnavailablePixels: true,
            // Critical missing fields that Auto-Image expects
            fullChargeData: null,
            fullChargeInterval: null,
            tokenSource: 'generator',
            initialSetupComplete: true,
            resizeSettings: null,
            originalImage: null,
            resizeIgnoreMask: null
          },
          imageData: {
            width: width,
            height: height,
            pixels: Array.from(imagePixels),
            totalPixels: width * height
          },
          paintedMapPacked: null
        };
      }
      
      // Debug: Log the export data structure before saving
      console.log('🔍 [DEBUG] Export data structure:', {
        hasState: !!saveData.state,
        hasImageData: !!saveData.imageData,
        topLevelKeys: Object.keys(saveData),
        stateKeys: saveData.state ? Object.keys(saveData.state) : 'N/A',
        imageDataKeys: saveData.imageData ? Object.keys(saveData.imageData) : 'N/A',
        version: saveData.version,
        exportType: exportType,
        imageDataPixelsLength: saveData.imageData?.pixels?.length || 0,
        imageWidth: saveData.imageData?.width || 0,
        imageHeight: saveData.imageData?.height || 0
      });
      
      // Validate export data before saving
      if (!saveData.state || !saveData.imageData) {
        throw new Error('Export validation failed: Missing state or imageData');
      }
      
      if (!saveData.imageData.pixels || saveData.imageData.pixels.length === 0) {
        throw new Error('Export validation failed: No pixel data to export');
      }
      
      // Download the file using Auto-Image's method
      const dataStr = JSON.stringify(saveData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`✅ ${exportType} export complete: ${filename}`);
      console.log(`📍 Area: ${width}x${height} from (${x1},${y1}) to (${x2},${y2})`);
      
      if (exportType === 'autofix') {
        console.log(`🔗 Compatible with Auto-Repair for restoration`);
        showAlert(`✅ Exported ${state.scannedPixels.length} pixels for Auto-Fix to ${filename}`, 'success');
      } else {
        console.log(`🎨 Ready for manual placement in Auto-Image`);
        showAlert(`✅ Exported ${state.scannedPixels.length} pixels for Auto-Image to ${filename}`, 'success');
      }
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      showAlert(`❌ Export failed: ${error.message}`, 'error');
    }
  }

  // Filename input handlers
  function handleFilenameInput(event) {
    const input = event.target;
    let value = input.value;
    
    // Always ensure it ends with .json
    if (!value.endsWith('.json')) {
      if (value.length > 0 && !value.includes('.json')) {
        input.value = value + '.json';
      } else if (value === '') {
        input.value = '.json';
      }
    }
    
    // Position cursor before .json
    if (input.value.endsWith('.json') && event.inputType !== 'deleteContentBackward') {
      const nameLength = input.value.length - 5; // -5 for '.json'
      input.setSelectionRange(nameLength, nameLength);
    }
  }

  function preventJsonDeletion(event) {
    const input = event.target;
    const cursorPos = input.selectionStart;
    const value = input.value;
    
    // Prevent deletion of .json extension
    if ((event.key === 'Backspace' || event.key === 'Delete') && 
        cursorPos > value.length - 5) {
      event.preventDefault();
      return false;
    }
    
    // Position cursor before .json on certain keys
    if (event.key === 'End' || event.key === 'ArrowRight') {
      const nameLength = value.length - 5;
      if (cursorPos >= nameLength) {
        event.preventDefault();
        input.setSelectionRange(nameLength, nameLength);
        return false;
      }
    }
  }

  // Utility functions
  function showAlert(message, type = 'info') {
    console.log(`${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'} ${message}`);
    
    // Create visual alert
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      ${type === 'error' ? 'background: linear-gradient(135deg, #ff4757, #ff3742);' :
        type === 'warning' ? 'background: linear-gradient(135deg, #ffa502, #ff6348);' :
        type === 'success' ? 'background: linear-gradient(135deg, #26de81, #20bf6b);' :
        'background: linear-gradient(135deg, #3742fa, #2f3542);'}
    `;
    alert.textContent = message;
    
    // Add animation styles
    if (!document.getElementById('alert-styles')) {
      const style = document.createElement('style');
      style.id = 'alert-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      alert.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }, 3000);
  }

  // UI Creation and Management
  async function createUI() {
    console.log('🎨 Creating Art Extractor UI...');

    try {
      // Remove existing UI
      const existing = document.getElementById('art-extractor-ui');
      if (existing) {
        console.log('🗑️ Removing existing UI');
        existing.remove();
      }

      // Check if document body exists
      if (!document.body) {
        throw new Error('Document body not available');
      }

      console.log('🔨 Building UI container...');

    // Create main container
    const container = document.createElement('div');
    container.id = 'art-extractor-ui';
    container.className = 'wplace-theme-neon-cyan';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      width: 320px;
      background: #1959A1;
      border: 2px solid #81DCF7;
      border-radius: 0;
      padding: 20px;
      font-family: 'Press Start 2P', monospace;
      color: #81DCF7;
      z-index: 9999;
      box-shadow: 0 0 30px rgba(129, 220, 247, 0.6), inset 0 0 30px rgba(234, 156, 0, 0.1);
      user-select: none;
    `;

    container.innerHTML = `
      <!-- Scanline effect -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #81DCF7, transparent);
        z-index: 1;
        pointer-events: none;
        animation: scanline 3s linear infinite;
        opacity: 0.7;
      "></div>
      
      <!-- Header -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #81DCF7;
        padding-bottom: 10px;
      ">
        <h2 style="margin: 0; color: #81DCF7; font-size: 12px; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 10px #81DCF7; text-transform: uppercase;">🎨 ART EXTRACTOR</h2>
        <button id="art-extractor-close" style="
          background: #1959A1;
          border: 2px solid #81DCF7;
          border-radius: 0;
          color: #81DCF7;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 5px #81DCF7;
          font-size: 12px;
        ">×</button>
      </div>

      <!-- Status -->
      <div style="
        background: rgba(234, 156, 0, 0.1);
        border: 2px solid #81DCF7;
        border-radius: 0;
        padding: 12px;
        margin-bottom: 15px;
        box-shadow: 0 0 20px rgba(129, 220, 247, 0.3);
      ">
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Status: <span id="current-status">CAPTURING</span></div>
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Area: <span id="area-info">NONE</span></div>
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Pixels: <span id="pixel-count">0</span></div>
      </div>
      
      <!-- Control Buttons -->
      <div style="margin: 10px 0; display: flex; gap: 8px;">
        <button id="start-selecting" style="
          flex: 1;
          background: #3C74AF;
          border: 2px solid #81DCF7;
          border-radius: 0;
          color: #81DCF7;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          text-transform: uppercase;
          padding: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          text-shadow: 0 0 3px #81DCF7;
          box-shadow: 
            0 0 5px rgba(129, 220, 247, 0.3),
            inset 0 0 5px rgba(129, 220, 247, 0.1);
        ">🎯 START SELECTING</button>
        
        <button id="clear-selection" style="
          flex: 1;
          background: #3C74AF;
          border: 2px solid #FF6B6B;
          border-radius: 0;
          color: #FF6B6B;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          text-transform: uppercase;
          padding: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          text-shadow: 0 0 3px #FF6B6B;
          box-shadow: 
            0 0 5px rgba(255, 107, 107, 0.3),
            inset 0 0 5px rgba(255, 107, 107, 0.1);
        ">🧹 CLEAR SELECTION</button>
      </div>

      <!-- Export Section -->
      <div style="margin-bottom: 15px;">
          <!-- Filename Input -->
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 4px; font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-transform: uppercase; text-shadow: 0 0 5px #81DCF7;">Filename:</label>
            <input id="filename-input" type="text" value=".json" style="
              width: 100%;
              background: #3C74AF;
              border: 2px solid #81DCF7;
              border-radius: 0;
              color: #81DCF7;
              padding: 8px;
              font-size: 10px;
              box-sizing: border-box;
              font-family: 'Press Start 2P', monospace;
              text-shadow: 0 0 5px #81DCF7;
            " placeholder="ENTER FILENAME">
          </div>
          
          <!-- Export Buttons -->
          <button id="export-autofix" style="
            width: 100%;
            background: #3C74AF;
            border: 2px solid #39ff14;
            border-radius: 0;
            color: #39ff14;
            padding: 10px;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            text-transform: uppercase;
            text-shadow: 0 0 8px #39ff14;
            margin-bottom: 8px;
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
          " disabled>🔧 SAVE FOR AUTO-FIX</button>
          
          <button id="export-autoimage" style="
            width: 100%;
            background: #3C74AF;
            border: 2px solid #EA9C00;
            border-radius: 0;
            color: #EA9C00;
            padding: 10px;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            text-transform: uppercase;
            text-shadow: 0 0 8px #EA9C00;
            box-shadow: 0 0 15px rgba(234, 156, 0, 0.3);
          " disabled>🎨 SAVE FOR AUTO-IMAGE</button>
        </div>

        <!-- Simple instruction -->
        <div style="
          background: rgba(234, 156, 0, 0.05);
          border: 1px solid rgba(129, 220, 247, 0.3);
          border-radius: 0;
          padding: 8px;
          font-size: 8px;
          color: #81DCF7;
          line-height: 1.3;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 5px #81DCF7;
          text-transform: uppercase;
          text-align: center;
        ">
          PAINT UPPER-LEFT & LOWER-RIGHT PIXELS
        </div>
        
        <!-- Scanline animation styles -->
        <style>
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(320px); }
          }
          
          .wplace-theme-neon-cyan button:hover:not(:disabled) {
            box-shadow: 0 0 25px currentColor !important;
            animation: pixel-blink 0.5s infinite !important;
          }
          
          @keyframes pixel-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
          }
        </style>
      </div>
    `;

    // Add event listeners
    container.querySelector('#art-extractor-close').addEventListener('click', closeArtExtractor);
    // Add event listeners
    container.querySelector('#art-extractor-close').addEventListener('click', closeArtExtractor);
    container.querySelector('#export-autofix').addEventListener('click', () => exportToJSON('autofix'));
    container.querySelector('#export-autoimage').addEventListener('click', () => exportToJSON('autoimage'));
    container.querySelector('#start-selecting').addEventListener('click', startPixelCapture);
    container.querySelector('#clear-selection').addEventListener('click', clearSelection);
    
    // Set up filename input with .json enforcement
    const filenameInput = container.querySelector('#filename-input');
    if (filenameInput) {
      // Initialize with default value
      filenameInput.value = '.json';
      
      // Add event listeners for .json enforcement
      filenameInput.addEventListener('input', handleFilenameInput);
      filenameInput.addEventListener('keydown', preventJsonDeletion);
      filenameInput.addEventListener('focus', function() {
        // Position cursor before .json on focus
        const nameLength = this.value.length - 5;
        if (nameLength >= 0) {
          this.setSelectionRange(nameLength, nameLength);
        }
      });
      
      // Set initial cursor position
      setTimeout(() => {
        filenameInput.setSelectionRange(0, 0);
      }, 100);
    }

    // Add to page
    document.body.appendChild(container);
    state.ui = container;

    console.log('✅ Art Extractor UI created');
    
    // Auto-start pixel capture immediately
    console.log('🎯 Auto-starting pixel capture...');
    setTimeout(() => {
      startPixelCapture();
    }, 500);
    updateUI();
    
    } catch (error) {
      console.error('❌ Failed to create UI:', error);
      throw error;
    }
  }

  // UI update function
  function updateUI() {
    if (!state.ui) return;

    const statusElement = state.ui.querySelector('#current-status');
    const areaElement = state.ui.querySelector('#area-info');
    const pixelElement = state.ui.querySelector('#pixel-count');
    const exportAutofixBtn = state.ui.querySelector('#export-autofix');
    const exportAutoimageBtn = state.ui.querySelector('#export-autoimage');

    // Update status with Neon Cyan styling
    if (state.isCapturing) {
      statusElement.textContent = `CAPTURING (${state.capturedPixels.length}/${state.requiredPixels})`;
      statusElement.style.color = '#EA9C00';
      statusElement.style.textShadow = '0 0 8px #EA9C00';
    } else if (state.isScanning) {
      statusElement.textContent = 'SCANNING...';
      statusElement.style.color = '#39ff14';
      statusElement.style.textShadow = '0 0 8px #39ff14';
    } else if (state.selectionArea) {
      statusElement.textContent = 'READY TO EXPORT';
      statusElement.style.color = '#39ff14';
      statusElement.style.textShadow = '0 0 8px #39ff14';
    } else {
      statusElement.textContent = 'READY';
      statusElement.style.color = '#81DCF7';
      statusElement.style.textShadow = '0 0 5px #81DCF7';
    }

    // Update area info with uppercase styling
    if (state.selectionArea) {
      areaElement.textContent = `${state.selectionArea.width}×${state.selectionArea.height} PX`;
    } else if (state.capturedPixels.length > 0) {
      areaElement.textContent = `${state.capturedPixels.length}/${state.requiredPixels} CAPTURED`;
    } else {
      areaElement.textContent = 'NONE';
    }

    // Update pixel count with progress info
    if (state.isScanning && state.totalPixels > 0) {
      const progress = Math.round((state.scannedPixels.length / state.totalPixels) * 100);
      pixelElement.textContent = `${state.scannedPixels.length}/${state.totalPixels} (${progress}%)`;
    } else {
      pixelElement.textContent = state.scannedPixels.length.toString();
    }

    // Update export button states
    const hasScannedData = state.scannedPixels && state.scannedPixels.length > 0;
    
    if (exportAutofixBtn) {
      exportAutofixBtn.disabled = !hasScannedData;
      if (!exportAutofixBtn.disabled) {
        exportAutofixBtn.style.opacity = '1';
        exportAutofixBtn.style.cursor = 'pointer';
      } else {
        exportAutofixBtn.style.opacity = '0.5';
        exportAutofixBtn.style.cursor = 'not-allowed';
      }
    }
    
    if (exportAutoimageBtn) {
      exportAutoimageBtn.disabled = !hasScannedData;
      if (!exportAutoimageBtn.disabled) {
        exportAutoimageBtn.style.opacity = '1';
        exportAutoimageBtn.style.cursor = 'pointer';
      } else {
        exportAutoimageBtn.style.opacity = '0.5';
        exportAutoimageBtn.style.cursor = 'not-allowed';
      }
    }
  }

  // Control functions
  function startPixelCapture() {
    console.log('🎯 Starting pixel capture mode...');
    
    state.isCapturing = true;
    state.capturedPixels = [];
    state.selectionArea = null;
    state.scannedPixels = [];
    
    // Clear any existing overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }
    
    // Set up pixel paint monitoring with fetch interception
    const setupSuccess = setupPixelCapture();
    
    if (setupSuccess) {
      updateUI();
      showAlert('🎯 Paint a pixel at the UPPER-LEFT corner of the area you want to extract', 'info');
      
      // Set timeout for capture process
      setTimeout(() => {
        if (state.isCapturing && state.capturedPixels.length === 0) {
          showAlert('⏰ No pixels captured yet. Try painting a pixel or use "Enter Coordinates Manually"', 'warning');
        }
      }, 15000);
    } else {
      showAlert('⚠️ Could not set up automatic capture. Use "Enter Coordinates Manually"', 'warning');
      updateUI();
    }
  }

  function clearSelection() {
    console.log('🧹 Clearing pixel capture...');
    
    state.isCapturing = false;
    state.capturedPixels = [];
    state.selectionArea = null;
    state.scannedPixels = [];

    // Restore original fetch function
    restoreFetch();

    // Disable overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }

    updateUI();
    showAlert('Pixel capture cleared', 'info');
  }

  function closeArtExtractor() {
    console.log('👋 Closing Art Extractor...');
    
    // Stop capturing
    state.isCapturing = false;

    // Restore original fetch function
    restoreFetch();

    // Clean up overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }

    // Remove UI
    if (state.ui) {
      state.ui.remove();
    }

    // Reset state
    Object.assign(state, {
      isCapturing: false,
      capturedPixels: [],
      selectionArea: null,
      ui: null,
      overlayManager: null,
      isScanning: false,
      scannedPixels: [],
      paintEventListener: null,
      lastPaintEvent: null
    });

    console.log('✅ Art Extractor closed');
  }

  // Main initialization
  async function initialize() {
    console.log('🚀 Initializing Art Extractor...');

    try {
      // Create UI immediately - don't wait for dependencies
      console.log('🎨 Creating UI first...');
      await createUI();
      
      // Then try to set up dependencies in background
      setTimeout(async () => {
        try {
          // Wait for Auto-Image overlay manager with timeout
          if (!window.autoImageOverlayManager) {
            console.log('⏳ Waiting for Auto-Image overlay manager...');
            await new Promise((resolve, reject) => {
              let attempts = 0;
              const maxAttempts = 50; // 5 seconds timeout
              const check = () => {
                attempts++;
                if (window.autoImageOverlayManager) {
                  console.log('✅ Auto-Image overlay manager found');
                  resolve();
                } else if (attempts >= maxAttempts) {
                  console.warn('⚠️ Auto-Image overlay manager not found, proceeding without it');
                  resolve(); // Continue anyway
                } else {
                  setTimeout(check, 100);
                }
              };
              check();
            });
          }

          // Set up pixel capture monitoring
          try {
            const captureReady = setupPixelCapture();
            if (captureReady) {
              console.log('✅ Pixel capture monitoring ready');
            } else {
              console.warn('⚠️ Pixel capture monitoring setup failed');
            }
          } catch (error) {
            console.warn('⚠️ Pixel capture error:', error);
          }

        } catch (error) {
          console.warn('⚠️ Background initialization error:', error);
        }
      }, 1000);

      console.log('✅ Art Extractor initialized successfully');
      showAlert('Art Extractor ready! UI loaded - dependencies loading in background.', 'success');

    } catch (error) {
      console.error('❌ Failed to initialize Art Extractor:', error);
      
      // Try to create UI anyway as fallback
      try {
        await createUI();
        showAlert(`Art Extractor loaded with limited functionality: ${error.message}`, 'warning');
      } catch (uiError) {
        console.error('❌ Failed to create UI:', uiError);
        showAlert(`Critical initialization failure: ${error.message}`, 'error');
      }
    }
  }

  // Start initialization with additional error handling
  try {
    await initialize();
  } catch (error) {
    console.error('❌ Critical error during Art Extractor initialization:', error);
    
    // Final fallback - try to show minimal UI
    try {
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="position: fixed; top: 20px; left: 20px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 10000;">
          ❌ Art Extractor failed to load: ${error.message}
          <button onclick="this.parentElement.remove()" style="margin-left: 10px;">✕</button>
        </div>
      `;
      document.body.appendChild(container);
    } catch (e) {
      console.error('❌ Even fallback UI failed:', e);
    }
  }

  // Expose globally for extension integration
  window.WPlaceArtExtractor = {
    state,
    initialize,
    closeArtExtractor,
    exportToJSON,
    scanSelectedArea
  };

  console.log('🎨 WPlace Art Extractor loaded successfully!');
})();
=======
// ==UserScript==
// @name         WPlace Art Extractor
// @namespace    http://tampermonkey.net/
// @version      2025-09-20.1
// @description  Extract artwork areas to JSON for Auto-Repair.js
// @author       Wbot
// @match        https://wplace.live/*
// @grant        none
// @icon
// ==/UserScript==

localStorage.removeItem("lp");

// Fallback translation function for when utils manager isn't loaded
function getText(key, params) {
  // Try to get translation from loadedTranslations
  try {
    if (window.loadedTranslations && window.loadedTranslations[window.state?.language || 'en']) {
      const translation = window.loadedTranslations[window.state?.language || 'en'][key];
      if (translation && typeof translation === 'string') {
        if (params && typeof params === 'object') {
          return translation.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match);
        }
        return translation;
      }
    }
  } catch (error) {
    console.warn('Translation lookup error:', error);
  }

  return key; // Fallback to key if no translation found
}

;(async () => {
  // Prevent multiple instances of this script from running
  if (window.WPLACE_ART_EXTRACTOR_LOADED) {
    console.log('Art Extractor already loaded, skipping...');
    return;
  }
  window.WPLACE_ART_EXTRACTOR_LOADED = true;

  console.log('%c🎨 WPlace Art Extractor Starting...', 'color: #ff6b35; font-weight: bold; font-size: 16px;');
  console.log('%c✨ Interactive pixel capture for area extraction!', 'color: #26de81; font-weight: bold;');
  
  // Immediate visual confirmation that script is running
  try {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; background: #ff6b35; color: white; padding: 8px 12px; 
                  border-radius: 5px; z-index: 10000; font-family: Arial; font-size: 12px;">
        🎨 Art Extractor Loading...
      </div>
    `;
    document.body.appendChild(testDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
      }
    }, 3000);
  } catch (e) {
    console.log('Could not create test notification:', e);
  }

  // CONFIGURATION CONSTANTS  
  const CONFIG = {
    OVERLAY_OPACITY: 0.7,
    SELECTION_COLOR: { r: 50, g: 200, b: 50, a: 180 }, // Green extraction overlay
    CORNER_MARKER_COLOR: { r: 255, g: 255, b: 0, a: 255 }, // Yellow corner markers
    CORNER_MARKER_SIZE: 12, // Corner marker size
    MIN_AREA_SIZE: 1,
    MAX_AREA_SIZE: 2500,
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
    }
  };

  // Expose CONFIG globally for the utils manager and other modules
  window.ART_EXTRACTOR_CONFIG = CONFIG;

  // GLOBAL STATE
  const state = {
    // Pixel capture state
    isCapturing: false,
    capturedPixels: [], // Array of painted pixels with their world coordinates
    requiredPixels: 2,   // Need 2 corner pixels
    
    // Selection area
    selectionArea: null, // { x, y, width, height, regionX, regionY }
    
    // UI state
    ui: null,
    overlayManager: null, // Will use global overlay manager like Auto-Image
    
    // Scanning state
    isScanning: false,
    scannedPixels: [],
    totalPixels: 0,
    
    // Auto-Image integration state
    imageData: null,
    startPosition: null,
    region: null,
    
    // Canvas monitoring
    paintEventListener: null,
    lastPaintEvent: null,
    
    language: 'en',
  };

  // Expose state globally
  window.ART_EXTRACTOR_STATE = state;

  // Use Auto-Image's overlay system - no custom overlay manager needed
  // We'll integrate with the global overlay manager that Auto-Image uses

  // Monitor WPlace paint events to capture pixel coordinates using fetch interception
  let originalFetch = null;
  let fetchInterceptionActive = false;
  
  function setupPixelCapture() {
    console.log('🎯 Setting up pixel paint monitoring...');
    
    try {
      // Store original fetch if not already stored
      if (!originalFetch) {
        originalFetch = window.fetch;
      }
      
      // Install fetch interceptor for pixel capture
      if (!fetchInterceptionActive) {
        window.fetch = async (url, options) => {
          // Check if this is a pixel painting request
          if (state.isCapturing && 
              typeof url === 'string' && 
              url.includes('/s0/pixel/') && 
              options && 
              options.method === 'POST') {
            
            try {
              console.log('🎯 Intercepting pixel paint request:', url);
              
              // Call original fetch first
              const response = await originalFetch(url, options);
              
              // If request was successful and we have body data, extract coordinates
              if (response.ok && options.body) {
                let requestBody;
                try {
                  requestBody = JSON.parse(options.body);
                } catch (parseError) {
                  console.warn('Could not parse request body:', parseError);
                  return response;
                }
                
                // Extract coordinates from request
                if (requestBody.coords && Array.isArray(requestBody.coords) && requestBody.coords.length >= 2) {
                  const localX = requestBody.coords[0]; // 0-999 within tile
                  const localY = requestBody.coords[1]; // 0-999 within tile
                  
                  // Extract tile coordinates from URL: /s0/pixel/{tileX}/{tileY}
                  const tileMatch = url.match(/\/s0\/pixel\/(\-?\d+)\/(\-?\d+)/);
                  if (tileMatch) {
                    const tileX = parseInt(tileMatch[1]);
                    const tileY = parseInt(tileMatch[2]);
                    
                    // Convert to global canvas coordinates
                    const globalX = tileX * 1000 + localX;
                    const globalY = tileY * 1000 + localY;
                    
                    console.log(`🎯 Captured painted pixel: (${globalX}, ${globalY}) from tile (${tileX}, ${tileY}) local (${localX}, ${localY})`);
                    
                    // Add the captured pixel
                    setTimeout(() => {
                      addCapturedPixel(globalX, globalY);
                    }, 100);
                  }
                }
              }
              
              return response;
            } catch (error) {
              console.error('❌ Error intercepting pixel paint:', error);
              // Fallback to original fetch
              return originalFetch(url, options);
            }
          }
          
          // For all other requests, use original fetch
          return originalFetch(url, options);
        };
        
        fetchInterceptionActive = true;
        console.log('✅ Fetch interception enabled');
      }
      
      return true;
      
    } catch (error) {
      console.warn('⚠️ Could not set up paint monitoring:', error);
      return false;
    }
  }
  
  // Restore original fetch function
  function restoreFetch() {
    if (originalFetch && fetchInterceptionActive) {
      window.fetch = originalFetch;
      fetchInterceptionActive = false;
      console.log('🔄 Original fetch restored');
    }
  }
  
  // Handle canvas clicks during capture mode (fallback method)
  function handleCanvasClick(event) {
    if (!state.isCapturing) return;
    
    // Only handle clicks on canvas elements
    const canvas = event.target.closest('canvas');
    if (!canvas) return;
    
    console.log('� Canvas click detected during capture mode');
    
    // For now, we'll use manual coordinate input as the primary method
    // since intercepting the actual paint events is complex
    setTimeout(() => {
      if (state.isCapturing && state.capturedPixels.length < state.requiredPixels) {
        promptForCoordinates();
      }
    }, 100);
  }
  
  // Handle detected paint events (for future implementation)
  function handlePaintEvent(event) {
    if (!state.isCapturing) return;
    
    console.log('🎯 Processing paint event:', event);
    
    // Extract coordinates from paint event
    let worldX, worldY;
    
    if (event.x !== undefined && event.y !== undefined) {
      worldX = event.x;
      worldY = event.y;
    } else if (event.position) {
      worldX = event.position.x;
      worldY = event.position.y;
    } else if (event.coords) {
      worldX = event.coords[0];
      worldY = event.coords[1];
    } else {
      console.warn('⚠️ Could not extract coordinates from paint event');
      return;
    }
    
    // Add the painted pixel to our capture list
    addCapturedPixel(worldX, worldY);
  }
  
  // Manual coordinate input (fallback method when auto-capture doesn't work)
  function promptForCoordinates() {
    if (!state.isCapturing) {
      showAlert('Not in capture mode', 'warning');
      return;
    }
    
    const pixelNum = state.capturedPixels.length + 1;
    const cornerType = pixelNum === 1 ? 'UPPER-LEFT' : 'LOWER-RIGHT';
    
    const coordStr = prompt(
      `📍 Enter coordinates for ${cornerType} corner (${pixelNum}/${state.requiredPixels})\n\n` +
      `Format: x,y (e.g., 1000,500)\n\n` +
      `To find coordinates:\n` +
      `1. Navigate to the ${cornerType} corner of your area\n` +
      `2. Hover over the exact pixel position\n` +
      `3. Check coordinates in bottom-left corner of WPlace\n` +
      `4. Enter them here:\n\n` +
      `Tip: You can also just paint a pixel there and it will be captured automatically!`
    );
    
    if (coordStr && coordStr.trim()) {
      const coords = coordStr.trim().split(',').map(n => parseInt(n.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        addCapturedPixel(coords[0], coords[1]);
      } else {
        showAlert('Invalid coordinates format. Use: x,y (e.g., 1000,500)', 'error');
        // Try again
        setTimeout(() => promptForCoordinates(), 500);
      }
    } else if (coordStr !== null) {
      // User entered empty string, try again
      showAlert('Please enter coordinates', 'warning');
      setTimeout(() => promptForCoordinates(), 500);
    }
    // If user clicked cancel (coordStr === null), do nothing
  }
  
  // Add a captured pixel with enhanced validation
  function addCapturedPixel(worldX, worldY) {
    if (!state.isCapturing) {
      console.log('Not in capture mode, ignoring pixel');
      return;
    }
    
    if (state.capturedPixels.length >= state.requiredPixels) {
      showAlert('Already have enough pixels', 'warning');
      return;
    }
    
    // Validate coordinates
    if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) {
      showAlert('Invalid pixel coordinates', 'error');
      return;
    }
    
    // Calculate region and local coordinates
    const regionX = Math.floor(worldX / 1000);
    const regionY = Math.floor(worldY / 1000);
    const pixelX = worldX % 1000;
    const pixelY = worldY % 1000;
    
    const pixel = {
      worldX,
      worldY,
      regionX,
      regionY,
      pixelX,
      pixelY,
      timestamp: Date.now(),
      cornerType: state.capturedPixels.length === 0 ? 'upperLeft' : 'lowerRight'
    };
    
    state.capturedPixels.push(pixel);
    console.log(`🎯 Captured ${pixel.cornerType} pixel ${state.capturedPixels.length}/${state.requiredPixels}:`, pixel);
    
    updateUI();
    
    // Progress messages
    if (state.capturedPixels.length === 1) {
      showAlert(`✅ Upper-left corner captured: (${worldX}, ${worldY})`, 'success');
      setTimeout(() => {
        showAlert('🎯 Now paint a pixel at the LOWER-RIGHT corner of the area', 'info');
      }, 1500);
    } else if (state.capturedPixels.length >= state.requiredPixels) {
      showAlert(`✅ Lower-right corner captured: (${worldX}, ${worldY})`, 'success');
      // Small delay before auto-scanning to show the success message
      setTimeout(() => {
        completeAreaCapture();
        // Auto-trigger scan after area capture is complete
        setTimeout(() => {
          scanSelectedArea();
        }, 500);
      }, 1000);
    }
  }

  // Complete area capture when we have 2 pixels with validation
  function completeAreaCapture() {
    state.isCapturing = false;
    restoreFetch(); // Restore original fetch function
    
    if (state.capturedPixels.length < 2) {
      showAlert('Need at least 2 pixels to define area', 'error');
      return;
    }
    
    // Calculate bounding box from captured pixels
    const pixels = state.capturedPixels;
    const minX = Math.min(...pixels.map(p => p.worldX));
    const minY = Math.min(...pixels.map(p => p.worldY));
    const maxX = Math.max(...pixels.map(p => p.worldX));
    const maxY = Math.max(...pixels.map(p => p.worldY));
    
    // Validation: ensure upper-left is actually upper-left
    if (minX >= maxX || minY >= maxY) {
      showAlert('❌ Invalid area: upper-left corner must be less than lower-right corner', 'error');
      // Reset capture to try again
      state.capturedPixels = [];
      startPixelCapture();
      return;
    }
    
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    
    // Size validation
    if (width < CONFIG.MIN_AREA_SIZE || height < CONFIG.MIN_AREA_SIZE) {
      showAlert(`❌ Area too small: ${width}×${height} pixels (minimum: ${CONFIG.MIN_AREA_SIZE}×${CONFIG.MIN_AREA_SIZE})`, 'error');
      return;
    }
    
    if (width > CONFIG.MAX_AREA_SIZE || height > CONFIG.MAX_AREA_SIZE) {
      showAlert(`❌ Area too large: ${width}×${height} pixels (maximum: ${CONFIG.MAX_AREA_SIZE}×${CONFIG.MAX_AREA_SIZE})`, 'error');
      return;
    }
    
    state.selectionArea = {
      x1: minX,    // Coordinate naming
      y1: minY,
      x2: maxX,
      y2: maxY,
      x: minX,     // Keep compatibility
      y: minY,
      width: width,
      height: height,
      regionX: Math.floor(minX / 1000),
      regionY: Math.floor(minY / 1000)
    };
    
    console.log('📐 Area capture complete:', state.selectionArea);
    showAlert(`✅ Area captured: ${width}×${height} pixels from (${minX},${minY}) to (${maxX},${maxY})`, 'success');
    
    // Set up overlay using Auto-Image's system
    setTimeout(() => {
      setupAutoImageOverlay();
    }, 500);
    
    updateUI();
  }
  
  // Set up visual overlay for selected extraction area (simplified approach)
  async function setupAutoImageOverlay() {
    if (!state.selectionArea) return;
    
    console.log('🎨 Setting up extraction area overlay...');
    
    try {
      const { x1, y1, x2, y2, width, height, regionX, regionY } = state.selectionArea;
      
      // Try to use Auto-Image's overlay if available, otherwise create simple visual feedback
      if (window.autoImageOverlayManager) {
        console.log('📊 Using Auto-Image overlay manager for area visualization');
        
        const overlayMgr = window.autoImageOverlayManager;
        
        // Create overlay canvas showing the selected area
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Fill with extraction area overlay
        ctx.fillStyle = `rgba(${CONFIG.SELECTION_COLOR.r}, ${CONFIG.SELECTION_COLOR.g}, ${CONFIG.SELECTION_COLOR.b}, 0.3)`;
        ctx.fillRect(0, 0, width, height);
        
        // Add extraction border
        ctx.strokeStyle = `rgba(${CONFIG.SELECTION_COLOR.r}, ${CONFIG.SELECTION_COLOR.g}, ${CONFIG.SELECTION_COLOR.b}, 0.8)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        // Add corner markers
        const cornerSize = CONFIG.CORNER_MARKER_SIZE;
        ctx.fillStyle = `rgba(${CONFIG.CORNER_MARKER_COLOR.r}, ${CONFIG.CORNER_MARKER_COLOR.g}, ${CONFIG.CORNER_MARKER_COLOR.b}, 1)`;
        
        // Top-left corner
        ctx.fillRect(0, 0, cornerSize, cornerSize);
        // Top-right corner  
        ctx.fillRect(width - cornerSize, 0, cornerSize, cornerSize);
        // Bottom-left corner
        ctx.fillRect(0, height - cornerSize, cornerSize, cornerSize);
        // Bottom-right corner
        ctx.fillRect(width - cornerSize, height - cornerSize, cornerSize, cornerSize);
        
        try {
          // Create image bitmap
          const overlayBitmap = await canvas.transferToImageBitmap();
          
          // Set the overlay using Auto-Image's API
          await overlayMgr.setImage(overlayBitmap);
          await overlayMgr.setPosition(
            { x: x1 % 1000, y: y1 % 1000 },
            { x: regionX, y: regionY }
          );
          
          // Enable the overlay
          overlayMgr.enable();
          
          // Store references for cleanup
          state.overlayManager = overlayMgr;
          state.imageData = overlayBitmap;
          state.startPosition = { x: x1 % 1000, y: y1 % 1000 };
          state.region = { x: regionX, y: regionY };
          
          console.log('✅ Extraction area overlay enabled');
        } catch (overlayError) {
          console.warn('⚠️ Could not set overlay, continuing without visual feedback:', overlayError);
        }
        
      } else {
        console.log('📋 Auto-Image overlay not available, using console feedback only');
      }
      
    } catch (error) {
      console.error('❌ Failed to setup extraction area overlay:', error);
      // Continue without overlay - not critical for extraction functionality
    }
  }
  // Tile-based pixel scanning for area extraction
  async function scanSelectedArea() {
    if (!state.selectionArea) {
      showAlert('No area selected', 'error');
      return;
    }

    console.log('🔍 Starting area scan...');
    state.isScanning = true;
    state.scannedPixels = [];
    updateUI();

    try {
      const { x1, y1, x2, y2 } = state.selectionArea;
      const areaWidth = x2 - x1 + 1;
      const areaHeight = y2 - y1 + 1;
      
      console.log(`🔍 Analyzing area ${areaWidth}x${areaHeight} from (${x1},${y1}) to (${x2},${y2})`);
      
      // Tile calculation
      const startTileX = Math.floor(x1 / 1000);
      const startTileY = Math.floor(y1 / 1000);
      const endTileX = Math.floor(x2 / 1000);
      const endTileY = Math.floor(y2 / 1000);
      
      state.totalPixels = areaWidth * areaHeight;
      let processedPixels = 0;
      
      // Process each tile that intersects with our area
      for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
          try {
            console.log(`📄 Processing tile (${tileX}, ${tileY})...`);
            
            // Download tile data
            const tileBlob = await getTileImage(tileX, tileY);
            if (!tileBlob) {
              console.warn(`⚠️ Could not download tile ${tileX},${tileY}, skipping...`);
              continue;
            }
            
            // Process tile data
            const tileImageData = await processTileBlob(tileBlob);
            if (!tileImageData) {
              console.warn(`⚠️ Could not process tile ${tileX},${tileY}, skipping...`);
              continue;
            }
            
            // Calculate intersection between area and current tile
            const tileStartX = tileX * 1000;
            const tileStartY = tileY * 1000;
            const tileEndX = tileStartX + 1000;
            const tileEndY = tileStartY + 1000;
            
            const intersectStartX = Math.max(x1, tileStartX);
            const intersectStartY = Math.max(y1, tileStartY);
            const intersectEndX = Math.min(x2 + 1, tileEndX);
            const intersectEndY = Math.min(y2 + 1, tileEndY);
            
            // Extract pixels from intersection area
            for (let globalY = intersectStartY; globalY < intersectEndY; globalY++) {
              for (let globalX = intersectStartX; globalX < intersectEndX; globalX++) {
                // Convert to tile-local coordinates
                const localX = globalX - tileStartX;
                const localY = globalY - tileStartY;
                
                // Normalize coordinates
                const normalizedX = (localX % 1000 + 1000) % 1000;
                const normalizedY = (localY % 1000 + 1000) % 1000;
                
                if (normalizedX >= 0 && normalizedX < 1000 && 
                    normalizedY >= 0 && normalizedY < 1000 &&
                    normalizedX < tileImageData.width && 
                    normalizedY < tileImageData.height) {
                  
                  // Extract RGBA values
                  const pixelIndex = (normalizedY * tileImageData.width + normalizedX) * 4;
                  const r = tileImageData.data[pixelIndex];
                  const g = tileImageData.data[pixelIndex + 1];
                  const b = tileImageData.data[pixelIndex + 2];
                  const a = tileImageData.data[pixelIndex + 3];
                  
                  if (a > 0) { // Skip transparent pixels
                    // Find closest color in WPlace palette
                    const closestColor = findClosestColor(r, g, b);
                    
                    if (closestColor) {
                      // Convert to area-relative coordinates
                      const areaX = globalX - x1;
                      const areaY = globalY - y1;
                      
                      state.scannedPixels.push({
                        x: areaX,
                        y: areaY,
                        worldX: globalX,
                        worldY: globalY,
                        color: closestColor,
                        rgb: { r, g, b, a }
                      });
                    }
                  }
                }
                
                processedPixels++;
              }
            }
            
            // Update progress every tile
            updateUI();
            await new Promise(resolve => setTimeout(resolve, 1));
            
          } catch (error) {
            console.error(`❌ Error processing tile ${tileX},${tileY}:`, error);
          }
        }
      }
      
      console.log(`✅ Scan complete: ${state.scannedPixels.length} pixels extracted`);
      showAlert(`✅ Extracted ${state.scannedPixels.length} pixels from area`, 'success');
      
    } catch (error) {
      console.error('❌ Area extraction failed:', error);
      showAlert(`❌ Extraction failed: ${error.message}`, 'error');
    } finally {
      state.isScanning = false;
      updateUI();
    }
  }
  
  // Download tile images
  async function getTileImage(tileX, tileY) {
    try {
      const tileUrl = `https://backend.wplace.live/files/s0/tiles/${tileX}/${tileY}.png`;
      const response = await fetch(tileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.blob();
    } catch (error) {
      console.warn(`Error downloading tile ${tileX},${tileY}:`, error);
      return null;
    }
  }
  
  // Process tile blob into ImageData
  async function processTileBlob(blob) {
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Error processing tile blob:', error);
      return null;
    }
  }

  // Color matching using LAB color space for better accuracy
  function findClosestColor(r, g, b) {
    if (!CONFIG.COLOR_MAP) return null;
    
    let closestColor = null;
    let minDistance = Infinity;
    
    // Convert input RGB to LAB color space
    const inputLab = rgbToLab(r, g, b);
    
    for (const [index, colorInfo] of Object.entries(CONFIG.COLOR_MAP)) {
      if (!colorInfo.rgb) continue; // Skip transparent
      
      const { r: cr, g: cg, b: cb } = colorInfo.rgb;
      
      // Convert palette color to LAB
      const paletteLab = rgbToLab(cr, cg, cb);
      
      // Calculate Delta-E distance
      const deltaE = calculateDeltaE(inputLab, paletteLab);
      
      if (deltaE < minDistance) {
        minDistance = deltaE;
        closestColor = colorInfo;
      }
    }
    
    return closestColor;
  }
  
  // RGB to LAB color space conversion
  function rgbToLab(r, g, b) {
    // Normalize RGB values
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    // Convert to XYZ
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
    
    // Convert XYZ to LAB
    const xn = x / 0.95047;
    const yn = y / 1.00000;
    const zn = z / 1.08883;
    
    const fx = xn > 0.008856 ? Math.pow(xn, 1/3) : (7.787 * xn + 16/116);
    const fy = yn > 0.008856 ? Math.pow(yn, 1/3) : (7.787 * yn + 16/116);
    const fz = zn > 0.008856 ? Math.pow(zn, 1/3) : (7.787 * zn + 16/116);
    
    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const bLab = 200 * (fy - fz);
    
    return { l, a, b: bLab };
  }
  
  // Delta-E color difference calculation
  function calculateDeltaE(lab1, lab2) {
    const deltaL = lab1.l - lab2.l;
    const deltaA = lab1.a - lab2.a;
    const deltaB = lab1.b - lab2.b;
    
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  // Export to JSON (Auto-Image compatible format for Auto-Repair)
  function exportToJSON(exportType = 'autofix') {
    if (!state.selectionArea || state.scannedPixels.length === 0) {
      showAlert('No data to export. Please select an area and scan it first.', 'error');
      return;
    }

    console.log(`📤 Exporting ${state.scannedPixels.length} pixels in ${exportType} format...`);
    console.log('🔍 [DEBUG] Selection area:', state.selectionArea);
    console.log('🔍 [DEBUG] Scanned pixels count:', state.scannedPixels.length);

    try {
      // Get filename from input
      const filenameInput = state.ui?.querySelector('#filename-input');
      const userFilename = filenameInput?.value?.trim() || '.json';
      let filename;
      
      if (userFilename === '.json' || userFilename === '') {
        // Use default filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        filename = `wplace-extracted-${exportType}-${timestamp}.json`;
      } else {
        // Ensure filename ends with .json
        filename = userFilename.endsWith('.json') ? userFilename : userFilename + '.json';
      }

      // Build Auto-Image compatible data structure
      const { x1, y1, x2, y2 } = state.selectionArea;
      const width = x2 - x1 + 1;
      const height = y2 - y1 + 1;
      
      // Convert scanned pixels to Auto-Image pixel format (Uint8ClampedArray)
      const imagePixels = new Uint8ClampedArray(width * height * 4);
      imagePixels.fill(0); // Initialize with transparent pixels
      
      // Fill pixel data from scanned pixels
      for (const pixel of state.scannedPixels) {
        const pixelIndex = (pixel.y * width + pixel.x) * 4;
        if (pixelIndex >= 0 && pixelIndex < imagePixels.length - 3) {
          const rgb = pixel.color?.rgb || pixel.rgb;
          imagePixels[pixelIndex] = rgb.r;
          imagePixels[pixelIndex + 1] = rgb.g;
          imagePixels[pixelIndex + 2] = rgb.b;
          imagePixels[pixelIndex + 3] = rgb.a || 255;
        }
      }
      
      // Create different formats based on export type
      let saveData;
      
      if (exportType === 'autofix') {
        // Auto-Fix format: Include exact position and region for restoration
        saveData = {
          timestamp: Date.now(),
          version: '2.2',
          state: {
            totalPixels: width * height,
            paintedPixels: 0,
            lastPosition: { x: 0, y: 0 },
            startPosition: { x: x1 % 1000, y: y1 % 1000 },
            region: { x: Math.floor(x1 / 1000), y: Math.floor(y1 / 1000) },
            imageLoaded: true,
            colorsChecked: true,
            coordinateMode: 'rows',
            coordinateDirection: 'top-left',
            coordinateSnake: false,
            blockWidth: 1,
            blockHeight: 1,
            availableColors: Object.values(CONFIG.COLOR_MAP).filter(c => c.rgb).map(color => ({
              ...color,
              rgb: [color.rgb.r, color.rgb.g, color.rgb.b] // Convert RGB object to array for Auto-Image compatibility
            })),
            // Additional Auto-Image required fields for compatibility
            paintWhitePixels: true,
            paintTransparentPixels: false,
            displayCharges: 0,
            preciseCurrentCharges: 0,
            maxCharges: 1,
            cooldown: 30000,
            stopFlag: false,
            selectingPosition: false,
            minimized: false,
            estimatedTime: 0,
            language: 'en',
            paintingSpeed: 5,
            batchMode: 'normal',
            randomBatchMin: 1,
            randomBatchMax: 5,
            cooldownChargeThreshold: 10,
            overlayOpacity: 0.7,
            blueMarbleEnabled: false,
            ditheringEnabled: true,
            colorMatchingAlgorithm: 'lab',
            enableChromaPenalty: true,
            chromaPenaltyWeight: 0.15,
            customTransparencyThreshold: 128,
            customWhiteThreshold: 230,
            paintUnavailablePixels: true,
            // Critical missing fields that Auto-Image expects
            fullChargeData: null,
            fullChargeInterval: null,
            tokenSource: 'generator',
            initialSetupComplete: true,
            resizeSettings: null,
            originalImage: null,
            resizeIgnoreMask: null
          },
          imageData: {
            width: width,
            height: height,
            pixels: Array.from(imagePixels),
            totalPixels: width * height
          },
          paintedMapPacked: null
        };
      } else {
        // Auto-Image format: Empty position and region for manual placement
        saveData = {
          timestamp: Date.now(),
          version: '2.2',
          state: {
            totalPixels: width * height,
            paintedPixels: 0,
            lastPosition: { x: 0, y: 0 },
            startPosition: null, // Empty for manual placement
            region: null, // Empty for manual placement
            imageLoaded: true,
            colorsChecked: true,
            coordinateMode: 'rows',
            coordinateDirection: 'top-left',
            coordinateSnake: false,
            blockWidth: 1,
            blockHeight: 1,
            availableColors: Object.values(CONFIG.COLOR_MAP).filter(c => c.rgb).map(color => ({
              ...color,
              rgb: [color.rgb.r, color.rgb.g, color.rgb.b] // Convert RGB object to array for Auto-Image compatibility
            })),
            // Additional Auto-Image required fields for compatibility
            paintWhitePixels: true,
            paintTransparentPixels: false,
            displayCharges: 0,
            preciseCurrentCharges: 0,
            maxCharges: 1,
            cooldown: 30000,
            stopFlag: false,
            selectingPosition: false,
            minimized: false,
            estimatedTime: 0,
            language: 'en',
            paintingSpeed: 5,
            batchMode: 'normal',
            randomBatchMin: 1,
            randomBatchMax: 5,
            cooldownChargeThreshold: 10,
            overlayOpacity: 0.7,
            blueMarbleEnabled: false,
            ditheringEnabled: true,
            colorMatchingAlgorithm: 'lab',
            enableChromaPenalty: true,
            chromaPenaltyWeight: 0.15,
            customTransparencyThreshold: 128,
            customWhiteThreshold: 230,
            paintUnavailablePixels: true,
            // Critical missing fields that Auto-Image expects
            fullChargeData: null,
            fullChargeInterval: null,
            tokenSource: 'generator',
            initialSetupComplete: true,
            resizeSettings: null,
            originalImage: null,
            resizeIgnoreMask: null
          },
          imageData: {
            width: width,
            height: height,
            pixels: Array.from(imagePixels),
            totalPixels: width * height
          },
          paintedMapPacked: null
        };
      }
      
      // Debug: Log the export data structure before saving
      console.log('🔍 [DEBUG] Export data structure:', {
        hasState: !!saveData.state,
        hasImageData: !!saveData.imageData,
        topLevelKeys: Object.keys(saveData),
        stateKeys: saveData.state ? Object.keys(saveData.state) : 'N/A',
        imageDataKeys: saveData.imageData ? Object.keys(saveData.imageData) : 'N/A',
        version: saveData.version,
        exportType: exportType,
        imageDataPixelsLength: saveData.imageData?.pixels?.length || 0,
        imageWidth: saveData.imageData?.width || 0,
        imageHeight: saveData.imageData?.height || 0
      });
      
      // Validate export data before saving
      if (!saveData.state || !saveData.imageData) {
        throw new Error('Export validation failed: Missing state or imageData');
      }
      
      if (!saveData.imageData.pixels || saveData.imageData.pixels.length === 0) {
        throw new Error('Export validation failed: No pixel data to export');
      }
      
      // Download the file using Auto-Image's method
      const dataStr = JSON.stringify(saveData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log(`✅ ${exportType} export complete: ${filename}`);
      console.log(`📍 Area: ${width}x${height} from (${x1},${y1}) to (${x2},${y2})`);
      
      if (exportType === 'autofix') {
        console.log(`🔗 Compatible with Auto-Repair for restoration`);
        showAlert(`✅ Exported ${state.scannedPixels.length} pixels for Auto-Fix to ${filename}`, 'success');
      } else {
        console.log(`🎨 Ready for manual placement in Auto-Image`);
        showAlert(`✅ Exported ${state.scannedPixels.length} pixels for Auto-Image to ${filename}`, 'success');
      }
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      showAlert(`❌ Export failed: ${error.message}`, 'error');
    }
  }

  // Filename input handlers
  function handleFilenameInput(event) {
    const input = event.target;
    let value = input.value;
    
    // Always ensure it ends with .json
    if (!value.endsWith('.json')) {
      if (value.length > 0 && !value.includes('.json')) {
        input.value = value + '.json';
      } else if (value === '') {
        input.value = '.json';
      }
    }
    
    // Position cursor before .json
    if (input.value.endsWith('.json') && event.inputType !== 'deleteContentBackward') {
      const nameLength = input.value.length - 5; // -5 for '.json'
      input.setSelectionRange(nameLength, nameLength);
    }
  }

  function preventJsonDeletion(event) {
    const input = event.target;
    const cursorPos = input.selectionStart;
    const value = input.value;
    
    // Prevent deletion of .json extension
    if ((event.key === 'Backspace' || event.key === 'Delete') && 
        cursorPos > value.length - 5) {
      event.preventDefault();
      return false;
    }
    
    // Position cursor before .json on certain keys
    if (event.key === 'End' || event.key === 'ArrowRight') {
      const nameLength = value.length - 5;
      if (cursorPos >= nameLength) {
        event.preventDefault();
        input.setSelectionRange(nameLength, nameLength);
        return false;
      }
    }
  }

  // Utility functions
  function showAlert(message, type = 'info') {
    console.log(`${type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'} ${message}`);
    
    // Create visual alert
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      ${type === 'error' ? 'background: linear-gradient(135deg, #ff4757, #ff3742);' :
        type === 'warning' ? 'background: linear-gradient(135deg, #ffa502, #ff6348);' :
        type === 'success' ? 'background: linear-gradient(135deg, #26de81, #20bf6b);' :
        'background: linear-gradient(135deg, #3742fa, #2f3542);'}
    `;
    alert.textContent = message;
    
    // Add animation styles
    if (!document.getElementById('alert-styles')) {
      const style = document.createElement('style');
      style.id = 'alert-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      alert.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }, 3000);
  }

  // UI Creation and Management
  async function createUI() {
    console.log('🎨 Creating Art Extractor UI...');

    try {
      // Remove existing UI
      const existing = document.getElementById('art-extractor-ui');
      if (existing) {
        console.log('🗑️ Removing existing UI');
        existing.remove();
      }

      // Check if document body exists
      if (!document.body) {
        throw new Error('Document body not available');
      }

      console.log('🔨 Building UI container...');

    // Create main container
    const container = document.createElement('div');
    container.id = 'art-extractor-ui';
    container.className = 'wplace-theme-neon-cyan';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      width: 320px;
      background: #1959A1;
      border: 2px solid #81DCF7;
      border-radius: 0;
      padding: 20px;
      font-family: 'Press Start 2P', monospace;
      color: #81DCF7;
      z-index: 9999;
      box-shadow: 0 0 30px rgba(129, 220, 247, 0.6), inset 0 0 30px rgba(234, 156, 0, 0.1);
      user-select: none;
    `;

    container.innerHTML = `
      <!-- Scanline effect -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #81DCF7, transparent);
        z-index: 1;
        pointer-events: none;
        animation: scanline 3s linear infinite;
        opacity: 0.7;
      "></div>
      
      <!-- Header -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #81DCF7;
        padding-bottom: 10px;
      ">
        <h2 style="margin: 0; color: #81DCF7; font-size: 12px; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 10px #81DCF7; text-transform: uppercase;">🎨 ART EXTRACTOR</h2>
        <button id="art-extractor-close" style="
          background: #1959A1;
          border: 2px solid #81DCF7;
          border-radius: 0;
          color: #81DCF7;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 5px #81DCF7;
          font-size: 12px;
        ">×</button>
      </div>

      <!-- Status -->
      <div style="
        background: rgba(234, 156, 0, 0.1);
        border: 2px solid #81DCF7;
        border-radius: 0;
        padding: 12px;
        margin-bottom: 15px;
        box-shadow: 0 0 20px rgba(129, 220, 247, 0.3);
      ">
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Status: <span id="current-status">CAPTURING</span></div>
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Area: <span id="area-info">NONE</span></div>
        <div style="font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-shadow: 0 0 5px #81DCF7; text-transform: uppercase;">Pixels: <span id="pixel-count">0</span></div>
      </div>
      
      <!-- Control Buttons -->
      <div style="margin: 10px 0; display: flex; gap: 8px;">
        <button id="start-selecting" style="
          flex: 1;
          background: #3C74AF;
          border: 2px solid #81DCF7;
          border-radius: 0;
          color: #81DCF7;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          text-transform: uppercase;
          padding: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          text-shadow: 0 0 3px #81DCF7;
          box-shadow: 
            0 0 5px rgba(129, 220, 247, 0.3),
            inset 0 0 5px rgba(129, 220, 247, 0.1);
        ">🎯 START SELECTING</button>
        
        <button id="clear-selection" style="
          flex: 1;
          background: #3C74AF;
          border: 2px solid #FF6B6B;
          border-radius: 0;
          color: #FF6B6B;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px;
          text-transform: uppercase;
          padding: 8px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          text-shadow: 0 0 3px #FF6B6B;
          box-shadow: 
            0 0 5px rgba(255, 107, 107, 0.3),
            inset 0 0 5px rgba(255, 107, 107, 0.1);
        ">🧹 CLEAR SELECTION</button>
      </div>

      <!-- Export Section -->
      <div style="margin-bottom: 15px;">
          <!-- Filename Input -->
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 4px; font-size: 9px; color: #81DCF7; font-family: 'Press Start 2P', monospace; text-transform: uppercase; text-shadow: 0 0 5px #81DCF7;">Filename:</label>
            <input id="filename-input" type="text" value=".json" style="
              width: 100%;
              background: #3C74AF;
              border: 2px solid #81DCF7;
              border-radius: 0;
              color: #81DCF7;
              padding: 8px;
              font-size: 10px;
              box-sizing: border-box;
              font-family: 'Press Start 2P', monospace;
              text-shadow: 0 0 5px #81DCF7;
            " placeholder="ENTER FILENAME">
          </div>
          
          <!-- Export Buttons -->
          <button id="export-autofix" style="
            width: 100%;
            background: #3C74AF;
            border: 2px solid #39ff14;
            border-radius: 0;
            color: #39ff14;
            padding: 10px;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            text-transform: uppercase;
            text-shadow: 0 0 8px #39ff14;
            margin-bottom: 8px;
            box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
          " disabled>🔧 SAVE FOR AUTO-FIX</button>
          
          <button id="export-autoimage" style="
            width: 100%;
            background: #3C74AF;
            border: 2px solid #EA9C00;
            border-radius: 0;
            color: #EA9C00;
            padding: 10px;
            cursor: pointer;
            font-family: 'Press Start 2P', monospace;
            font-size: 8px;
            text-transform: uppercase;
            text-shadow: 0 0 8px #EA9C00;
            box-shadow: 0 0 15px rgba(234, 156, 0, 0.3);
          " disabled>🎨 SAVE FOR AUTO-IMAGE</button>
        </div>

        <!-- Simple instruction -->
        <div style="
          background: rgba(234, 156, 0, 0.05);
          border: 1px solid rgba(129, 220, 247, 0.3);
          border-radius: 0;
          padding: 8px;
          font-size: 8px;
          color: #81DCF7;
          line-height: 1.3;
          font-family: 'Press Start 2P', monospace;
          text-shadow: 0 0 5px #81DCF7;
          text-transform: uppercase;
          text-align: center;
        ">
          PAINT UPPER-LEFT & LOWER-RIGHT PIXELS
        </div>
        
        <!-- Scanline animation styles -->
        <style>
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(320px); }
          }
          
          .wplace-theme-neon-cyan button:hover:not(:disabled) {
            box-shadow: 0 0 25px currentColor !important;
            animation: pixel-blink 0.5s infinite !important;
          }
          
          @keyframes pixel-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
          }
        </style>
      </div>
    `;

    // Add event listeners
    container.querySelector('#art-extractor-close').addEventListener('click', closeArtExtractor);
    // Add event listeners
    container.querySelector('#art-extractor-close').addEventListener('click', closeArtExtractor);
    container.querySelector('#export-autofix').addEventListener('click', () => exportToJSON('autofix'));
    container.querySelector('#export-autoimage').addEventListener('click', () => exportToJSON('autoimage'));
    container.querySelector('#start-selecting').addEventListener('click', startPixelCapture);
    container.querySelector('#clear-selection').addEventListener('click', clearSelection);
    
    // Set up filename input with .json enforcement
    const filenameInput = container.querySelector('#filename-input');
    if (filenameInput) {
      // Initialize with default value
      filenameInput.value = '.json';
      
      // Add event listeners for .json enforcement
      filenameInput.addEventListener('input', handleFilenameInput);
      filenameInput.addEventListener('keydown', preventJsonDeletion);
      filenameInput.addEventListener('focus', function() {
        // Position cursor before .json on focus
        const nameLength = this.value.length - 5;
        if (nameLength >= 0) {
          this.setSelectionRange(nameLength, nameLength);
        }
      });
      
      // Set initial cursor position
      setTimeout(() => {
        filenameInput.setSelectionRange(0, 0);
      }, 100);
    }

    // Add to page
    document.body.appendChild(container);
    state.ui = container;

    console.log('✅ Art Extractor UI created');
    
    // Auto-start pixel capture immediately
    console.log('🎯 Auto-starting pixel capture...');
    setTimeout(() => {
      startPixelCapture();
    }, 500);
    updateUI();
    
    } catch (error) {
      console.error('❌ Failed to create UI:', error);
      throw error;
    }
  }

  // UI update function
  function updateUI() {
    if (!state.ui) return;

    const statusElement = state.ui.querySelector('#current-status');
    const areaElement = state.ui.querySelector('#area-info');
    const pixelElement = state.ui.querySelector('#pixel-count');
    const exportAutofixBtn = state.ui.querySelector('#export-autofix');
    const exportAutoimageBtn = state.ui.querySelector('#export-autoimage');

    // Update status with Neon Cyan styling
    if (state.isCapturing) {
      statusElement.textContent = `CAPTURING (${state.capturedPixels.length}/${state.requiredPixels})`;
      statusElement.style.color = '#EA9C00';
      statusElement.style.textShadow = '0 0 8px #EA9C00';
    } else if (state.isScanning) {
      statusElement.textContent = 'SCANNING...';
      statusElement.style.color = '#39ff14';
      statusElement.style.textShadow = '0 0 8px #39ff14';
    } else if (state.selectionArea) {
      statusElement.textContent = 'READY TO EXPORT';
      statusElement.style.color = '#39ff14';
      statusElement.style.textShadow = '0 0 8px #39ff14';
    } else {
      statusElement.textContent = 'READY';
      statusElement.style.color = '#81DCF7';
      statusElement.style.textShadow = '0 0 5px #81DCF7';
    }

    // Update area info with uppercase styling
    if (state.selectionArea) {
      areaElement.textContent = `${state.selectionArea.width}×${state.selectionArea.height} PX`;
    } else if (state.capturedPixels.length > 0) {
      areaElement.textContent = `${state.capturedPixels.length}/${state.requiredPixels} CAPTURED`;
    } else {
      areaElement.textContent = 'NONE';
    }

    // Update pixel count with progress info
    if (state.isScanning && state.totalPixels > 0) {
      const progress = Math.round((state.scannedPixels.length / state.totalPixels) * 100);
      pixelElement.textContent = `${state.scannedPixels.length}/${state.totalPixels} (${progress}%)`;
    } else {
      pixelElement.textContent = state.scannedPixels.length.toString();
    }

    // Update export button states
    const hasScannedData = state.scannedPixels && state.scannedPixels.length > 0;
    
    if (exportAutofixBtn) {
      exportAutofixBtn.disabled = !hasScannedData;
      if (!exportAutofixBtn.disabled) {
        exportAutofixBtn.style.opacity = '1';
        exportAutofixBtn.style.cursor = 'pointer';
      } else {
        exportAutofixBtn.style.opacity = '0.5';
        exportAutofixBtn.style.cursor = 'not-allowed';
      }
    }
    
    if (exportAutoimageBtn) {
      exportAutoimageBtn.disabled = !hasScannedData;
      if (!exportAutoimageBtn.disabled) {
        exportAutoimageBtn.style.opacity = '1';
        exportAutoimageBtn.style.cursor = 'pointer';
      } else {
        exportAutoimageBtn.style.opacity = '0.5';
        exportAutoimageBtn.style.cursor = 'not-allowed';
      }
    }
  }

  // Control functions
  function startPixelCapture() {
    console.log('🎯 Starting pixel capture mode...');
    
    state.isCapturing = true;
    state.capturedPixels = [];
    state.selectionArea = null;
    state.scannedPixels = [];
    
    // Clear any existing overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }
    
    // Set up pixel paint monitoring with fetch interception
    const setupSuccess = setupPixelCapture();
    
    if (setupSuccess) {
      updateUI();
      showAlert('🎯 Paint a pixel at the UPPER-LEFT corner of the area you want to extract', 'info');
      
      // Set timeout for capture process
      setTimeout(() => {
        if (state.isCapturing && state.capturedPixels.length === 0) {
          showAlert('⏰ No pixels captured yet. Try painting a pixel or use "Enter Coordinates Manually"', 'warning');
        }
      }, 15000);
    } else {
      showAlert('⚠️ Could not set up automatic capture. Use "Enter Coordinates Manually"', 'warning');
      updateUI();
    }
  }

  function clearSelection() {
    console.log('🧹 Clearing pixel capture...');
    
    state.isCapturing = false;
    state.capturedPixels = [];
    state.selectionArea = null;
    state.scannedPixels = [];

    // Restore original fetch function
    restoreFetch();

    // Disable overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }

    updateUI();
    showAlert('Pixel capture cleared', 'info');
  }

  function closeArtExtractor() {
    console.log('👋 Closing Art Extractor...');
    
    // Stop capturing
    state.isCapturing = false;

    // Restore original fetch function
    restoreFetch();

    // Clean up overlay
    if (state.overlayManager) {
      state.overlayManager.disable();
    }

    // Remove UI
    if (state.ui) {
      state.ui.remove();
    }

    // Reset state
    Object.assign(state, {
      isCapturing: false,
      capturedPixels: [],
      selectionArea: null,
      ui: null,
      overlayManager: null,
      isScanning: false,
      scannedPixels: [],
      paintEventListener: null,
      lastPaintEvent: null
    });

    console.log('✅ Art Extractor closed');
  }

  // Main initialization
  async function initialize() {
    console.log('🚀 Initializing Art Extractor...');

    try {
      // Create UI immediately - don't wait for dependencies
      console.log('🎨 Creating UI first...');
      await createUI();
      
      // Then try to set up dependencies in background
      setTimeout(async () => {
        try {
          // Wait for Auto-Image overlay manager with timeout
          if (!window.autoImageOverlayManager) {
            console.log('⏳ Waiting for Auto-Image overlay manager...');
            await new Promise((resolve, reject) => {
              let attempts = 0;
              const maxAttempts = 50; // 5 seconds timeout
              const check = () => {
                attempts++;
                if (window.autoImageOverlayManager) {
                  console.log('✅ Auto-Image overlay manager found');
                  resolve();
                } else if (attempts >= maxAttempts) {
                  console.warn('⚠️ Auto-Image overlay manager not found, proceeding without it');
                  resolve(); // Continue anyway
                } else {
                  setTimeout(check, 100);
                }
              };
              check();
            });
          }

          // Set up pixel capture monitoring
          try {
            const captureReady = setupPixelCapture();
            if (captureReady) {
              console.log('✅ Pixel capture monitoring ready');
            } else {
              console.warn('⚠️ Pixel capture monitoring setup failed');
            }
          } catch (error) {
            console.warn('⚠️ Pixel capture error:', error);
          }

        } catch (error) {
          console.warn('⚠️ Background initialization error:', error);
        }
      }, 1000);

      console.log('✅ Art Extractor initialized successfully');
      showAlert('Art Extractor ready! UI loaded - dependencies loading in background.', 'success');

    } catch (error) {
      console.error('❌ Failed to initialize Art Extractor:', error);
      
      // Try to create UI anyway as fallback
      try {
        await createUI();
        showAlert(`Art Extractor loaded with limited functionality: ${error.message}`, 'warning');
      } catch (uiError) {
        console.error('❌ Failed to create UI:', uiError);
        showAlert(`Critical initialization failure: ${error.message}`, 'error');
      }
    }
  }

  // Start initialization with additional error handling
  try {
    await initialize();
  } catch (error) {
    console.error('❌ Critical error during Art Extractor initialization:', error);
    
    // Final fallback - try to show minimal UI
    try {
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="position: fixed; top: 20px; left: 20px; background: red; color: white; padding: 10px; border-radius: 5px; z-index: 10000;">
          ❌ Art Extractor failed to load: ${error.message}
          <button onclick="this.parentElement.remove()" style="margin-left: 10px;">✕</button>
        </div>
      `;
      document.body.appendChild(container);
    } catch (e) {
      console.error('❌ Even fallback UI failed:', e);
    }
  }

  // Expose globally for extension integration
  window.WPlaceArtExtractor = {
    state,
    initialize,
    closeArtExtractor,
    exportToJSON,
    scanSelectedArea
  };

  console.log('🎨 WPlace Art Extractor loaded successfully!');
})();