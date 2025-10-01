// ==UserScript==
// @name         WPlace Auto-Farm Enhanced
// @namespace    http://tampermonkey.net/
// @version      2025-01-10
// @description  Enhanced Auto-Farm with cooldown system and canvas interaction
// @author       Wbot
// @match        https://wplace.live/*
// @grant        none
// @icon         🌾
// ==/UserScript==

; (async () => {
  // Prevent multiple instances
  if (window.WPLACE_AUTO_FARM_ENHANCED_LOADED) {
    console.warn('⚠️ Auto-Farm Enhanced already loaded');
    return;
  }
  window.WPLACE_AUTO_FARM_ENHANCED_LOADED = true;

  console.log('%c🌾 WPlace Auto-Farm Enhanced Starting...', 'color: #00ff41; font-weight: bold; font-size: 16px;');

  // CONFIGURATION
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    COOLDOWN_CHARGE_THRESHOLD: 10, // Wait until charges reach this amount
    DELAY_BETWEEN_PIXELS: 50, // ms delay between placing pixels
    DELAY_AFTER_BATCH: 2000, // ms delay after confirming batch (reopen delay)
    CANVAS_SIZE: 1000, // Canvas tile size
    THEME: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#222222',
      text: '#ffffff',
      highlight: '#775ce3',
      success: '#00ff00',
      error: '#ff0000',
      warning: '#ffaa00',
    },
  };

  // STATE
  const state = {
    running: false,
    paintedCount: 0,
    sessionPixels: 0,
    charges: { count: 0, max: 80, cooldownMs: 30000 },
    userInfo: null,
    minimized: false,
    language: 'en',
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    lastBatchTime: 0,
    totalBatches: 0,
  };

  // UTILITIES
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const waitForSelector = async (selector, interval = 200, timeout = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const el = document.querySelector(selector);
      if (el) return el;
      await sleep(interval);
    }
    return null;
  };

  const msToTimeText = (ms) => {
    const totalSec = Math.ceil(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  // API FUNCTIONS
  const fetchAPI = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        credentials: 'include',
        ...options,
      });
      return await res.json();
    } catch (e) {
      console.error('API fetch error:', e);
      return null;
    }
  };

  const getCharges = async () => {
    const data = await fetchAPI('https://backend.wplace.live/me');
    if (data) {
      state.userInfo = data;
      state.charges = {
        count: Math.floor(data.charges.count),
        max: Math.floor(data.charges.max),
        cooldownMs: data.charges.cooldownMs,
      };
      if (state.userInfo.level) {
        state.userInfo.level = Math.floor(state.userInfo.level);
      }
    }
    return state.charges;
  };

  const detectLanguage = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country === 'BR') {
        state.language = 'pt';
      } else {
        state.language = 'en';
      }
    } catch {
      state.language = 'en';
    }
  };

  // CANVAS INTERACTION FUNCTIONS
  const getRandomCanvasPosition = () => {
    // Generate random position within canvas bounds
    const canvas = document.querySelector('canvas');
    if (!canvas) return { x: 500, y: 500 };
    
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(Math.random() * rect.width),
      y: Math.floor(Math.random() * rect.height),
    };
  };

  const clickColorPaletteButton = async () => {
    updateUI(
      state.language === 'pt' ? '🎨 Abrindo paleta de cores...' : '🎨 Opening color palette...',
      'status'
    );

    // Find the "Paint" Button
    const allButtons = Array.from(document.querySelectorAll('button'));
    const paletteBtn = allButtons.find(b => /(Pintar|Paint)/i.test(b.textContent.trim()));

    if (paletteBtn) {
      console.log('✅ Found palette button:', paletteBtn.textContent);
      paletteBtn.click();
      await sleep(500);
      return true;
    }

    console.warn('⚠️ Paint button not found');
    return false;
  };

  const selectTransparentColor = async () => {
    updateUI(
      state.language === 'pt' ? '🔍 Selecionando cor transparente...' : '🔍 Selecting transparent color...',
      'status'
    );

    // Wait for color palette to appear
    await sleep(300);

    // Try to find transparent color button (ID 0)
    const transBtn = await waitForSelector('button#color-0', 100, 2000);
    if (transBtn) {
      console.log('✅ Found transparent color button');
      transBtn.click();
      await sleep(300);
      return true;
    }

    console.warn('⚠️ Transparent color button not found');
    return false;
  };

  const placePixelOnCanvas = async (x, y) => {
    const canvas = await waitForSelector('canvas', 100, 2000);
    if (!canvas) {
      console.warn('⚠️ Canvas not found');
      return false;
    }

    // Get canvas position
    const rect = canvas.getBoundingClientRect();
    const clientX = Math.round(rect.left + x);
    const clientY = Math.round(rect.top + y);

    // Simulate mouse/pointer events 
    const commonPointer = {
      clientX: clientX,
      clientY: clientY,
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      buttons: 1,
    };
    
    const commonMouse = {
      clientX: clientX,
      clientY: clientY,
      bubbles: true,
      cancelable: true,
      button: 0,
      buttons: 1,
    };

  
    canvas.dispatchEvent(new PointerEvent('pointerdown', commonPointer));
    canvas.dispatchEvent(new MouseEvent('mousedown', commonMouse));
    canvas.dispatchEvent(new PointerEvent('pointerup', commonPointer));
    canvas.dispatchEvent(new MouseEvent('mouseup', commonMouse));
    canvas.dispatchEvent(new MouseEvent('click', commonMouse));

    return true;
  };

  const confirmPaintBatch = async () => {
    updateUI(
      state.language === 'pt' ? '✅ Confirmando lote...' : '✅ Confirming batch...',
      'status'
    );

    await sleep(500);

    // Find the "Paint" or "Pintar" button
    const allButtons = Array.from(document.querySelectorAll('button'));
    const confirmBtn = allButtons.find(b => /(Pintar|Paint)/i.test(b.textContent.trim()));

    if (confirmBtn) {
      console.log('✅ Found confirm button:', confirmBtn.textContent);
      confirmBtn.click();
      await sleep(CONFIG.DELAY_AFTER_BATCH); // Wait for reopen
      return true;
    }

    console.warn('⚠️ Confirm button not found');
    return false;
  };

  // MAIN FARMING LOOP
  const farmingLoop = async () => {
    while (state.running) {
      try {
        await getCharges();
        updateStats();

        const { count, cooldownMs } = state.charges;

        // Check if we have enough charges
        if (count < state.cooldownChargeThreshold) {
          const waitTime = cooldownMs || CONFIG.COOLDOWN_DEFAULT;
          updateUI(
            state.language === 'pt'
              ? `⌛ Aguardando cargas (${count}/${state.cooldownChargeThreshold}). Próximo em ${msToTimeText(waitTime)}`
              : `⌛ Waiting for charges (${count}/${state.cooldownChargeThreshold}). Next in ${msToTimeText(waitTime)}`,
            'status'
          );

          // Wait and recheck periodically
          await sleep(Math.min(waitTime, 10000));
          continue;
        }

        // We have enough charges, start farming
        updateUI(
          state.language === 'pt'
            ? `🚀 Iniciando farming com ${count} cargas disponíveis`
            : `🚀 Starting farming with ${count} charges available`,
          'success'
        );

        // Step 1: Click color palette button
        const paletteOpened = await clickColorPaletteButton();
        if (!paletteOpened) {
          updateUI(
            state.language === 'pt'
              ? '❌ Falha ao abrir paleta. Tentando novamente...'
              : '❌ Failed to open palette. Retrying...',
            'error'
          );
          await sleep(2000);
          continue;
        }

        // Step 2: Select transparent color
        const colorSelected = await selectTransparentColor();
        if (!colorSelected) {
          updateUI(
            state.language === 'pt'
              ? '❌ Falha ao selecionar cor. Tentando novamente...'
              : '❌ Failed to select color. Retrying...',
            'error'
          );
          await sleep(2000);
          continue;
        }

        // Step 3: Place ALL available pixels randomly on canvas FIRST 
        const pixelsToPlace = count; // Use ALL available charges
        updateUI(
          state.language === 'pt'
            ? `🎨 Colocando ${pixelsToPlace} pixels...`
            : `🎨 Placing ${pixelsToPlace} pixels...`,
          'status'
        );

        let placedCount = 0;
        for (let i = 0; i < pixelsToPlace; i++) {
          if (!state.running) break;

          const pos = getRandomCanvasPosition();
          const placed = await placePixelOnCanvas(pos.x, pos.y);

          if (placed) {
            placedCount++;

            // Update UI every 5 pixels
            if (placedCount % 5 === 0) {
              updateUI(
                state.language === 'pt'
                  ? `🎨 Colocado ${placedCount}/${pixelsToPlace} pixels...`
                  : `🎨 Placed ${placedCount}/${pixelsToPlace} pixels...`,
                'status'
              );
            }
          }

          await sleep(CONFIG.DELAY_BETWEEN_PIXELS);
        }

        // Step 4: NOW confirm the ENTIRE batch at once (clicks Paint button to submit ALL pixels)
        updateUI(
          state.language === 'pt'
            ? `✅ Confirmando ${placedCount} pixels...`
            : `✅ Confirming ${placedCount} pixels...`,
          'status'
        );

        const confirmed = await confirmPaintBatch();
        if (confirmed) {
          state.totalBatches++;
          state.paintedCount += placedCount;
          state.sessionPixels += placedCount;
          state.lastBatchTime = Date.now();

          updateUI(
            state.language === 'pt'
              ? `✅ Lote confirmado! ${placedCount} pixels pintados`
              : `✅ Batch confirmed! ${placedCount} pixels painted`,
            'success'
          );

          // Visual feedback
          const effect = document.getElementById('paintEffect');
          if (effect) {
            effect.style.animation = 'pulse 0.5s';
            setTimeout(() => {
              effect.style.animation = '';
            }, 500);
          }
        } else {
          updateUI(
            state.language === 'pt'
              ? '❌ Falha ao confirmar lote'
              : '❌ Failed to confirm batch',
            'error'
          );
        }

        // Update charges after batch
        await getCharges();
        updateStats();

      } catch (error) {
        console.error('❌ Error in farming loop:', error);
        updateUI(
          state.language === 'pt'
            ? `❌ Erro: ${error.message}`
            : `❌ Error: ${error.message}`,
          'error'
        );
        await sleep(5000);
      }
    }
  };

  // UI FUNCTIONS
  const createUI = () => {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
      }
      @keyframes slide-in {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .wplace-farm-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 280px;
        background: ${CONFIG.THEME.primary};
        border: 1px solid ${CONFIG.THEME.accent};
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        z-index: 9999;
        font-family: 'Segoe UI', Roboto, sans-serif;
        color: ${CONFIG.THEME.text};
        animation: slide-in 0.4s ease-out;
        overflow: hidden;
      }
      .wplace-farm-header {
        padding: 15px;
        background: ${CONFIG.THEME.secondary};
        color: ${CONFIG.THEME.highlight};
        font-size: 16px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
      }
      .wplace-farm-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wplace-farm-controls {
        display: flex;
        gap: 10px;
      }
      .wplace-header-btn {
        background: none;
        border: none;
        color: ${CONFIG.THEME.text};
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        font-size: 14px;
      }
      .wplace-header-btn:hover {
        opacity: 1;
      }
      .wplace-farm-content {
        padding: 15px;
        display: ${state.minimized ? 'none' : 'block'};
      }
      .wplace-farm-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
        margin-bottom: 12px;
      }
      .wplace-farm-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .wplace-farm-btn-start {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
      }
      .wplace-farm-btn-stop {
        background: ${CONFIG.THEME.error};
        color: white;
      }
      .wplace-farm-setting {
        background: ${CONFIG.THEME.secondary};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      .wplace-farm-setting-label {
        font-size: 13px;
        opacity: 0.8;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .wplace-farm-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: ${CONFIG.THEME.accent};
        outline: none;
        -webkit-appearance: none;
      }
      .wplace-farm-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${CONFIG.THEME.highlight};
        cursor: pointer;
      }
      .wplace-farm-slider-value {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-top: 4px;
      }
      .wplace-farm-stats {
        background: ${CONFIG.THEME.secondary};
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
      }
      .wplace-stat-item {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 14px;
      }
      .wplace-stat-label {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.8;
      }
      .wplace-stat-value {
        font-weight: 600;
      }
      .wplace-farm-status {
        padding: 10px;
        border-radius: 6px;
        text-align: center;
        font-size: 13px;
        line-height: 1.4;
      }
      .status-default {
        background: rgba(255,255,255,0.1);
      }
      .status-success {
        background: rgba(0, 255, 0, 0.1);
        color: ${CONFIG.THEME.success};
      }
      .status-error {
        background: rgba(255, 0, 0, 0.1);
        color: ${CONFIG.THEME.error};
      }
      .status-status {
        background: rgba(119, 92, 227, 0.1);
        color: ${CONFIG.THEME.highlight};
      }
      #paintEffect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: 12px;
      }
    `;
    document.head.appendChild(style);

    const translations = {
      pt: {
        title: 'WPlace Auto-Farm 🌾',
        start: 'Iniciar Farm',
        stop: 'Parar Farm',
        ready: 'Pronto para iniciar',
        user: 'Usuário',
        sessionPixels: 'Pixels (Sessão)',
        totalPixels: 'Total Pintado',
        charges: 'Cargas',
        batches: 'Lotes',
        threshold: 'Limite de Cargas',
        thresholdDesc: 'Aguardar até ter esta quantidade de cargas',
      },
      en: {
        title: 'WPlace Auto-Farm 🌾',
        start: 'Start Farm',
        stop: 'Stop Farm',
        ready: 'Ready to start',
        user: 'User',
        sessionPixels: 'Pixels (Session)',
        totalPixels: 'Total Painted',
        charges: 'Charges',
        batches: 'Batches',
        threshold: 'Charge Threshold',
        thresholdDesc: 'Wait until charges reach this amount',
      },
    };

    const t = translations[state.language] || translations.en;

    const panel = document.createElement('div');
    panel.className = 'wplace-farm-panel';
    panel.innerHTML = `
      <div id="paintEffect"></div>
      <div class="wplace-farm-header">
        <div class="wplace-farm-title">
          <i class="fas fa-seedling"></i>
          <span>${t.title}</span>
        </div>
        <div class="wplace-farm-controls">
          <button id="minimizeBtn" class="wplace-header-btn" title="${state.language === 'pt' ? 'Minimizar' : 'Minimize'}">
            <i class="fas fa-${state.minimized ? 'expand' : 'minus'}"></i>
          </button>
        </div>
      </div>
      <div class="wplace-farm-content">
        <button id="toggleBtn" class="wplace-farm-btn wplace-farm-btn-start">
          <i class="fas fa-play"></i>
          <span>${t.start}</span>
        </button>
        
        <div class="wplace-farm-setting">
          <div class="wplace-farm-setting-label">
            <i class="fas fa-bolt"></i>
            ${t.threshold}
          </div>
          <input type="range" id="thresholdSlider" class="wplace-farm-slider" 
                 min="1" max="50" value="${state.cooldownChargeThreshold}" step="1">
          <div class="wplace-farm-slider-value">
            <span>${t.thresholdDesc}</span>
            <span id="thresholdValue">${state.cooldownChargeThreshold}</span>
          </div>
        </div>
        
        <div class="wplace-farm-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-spinner fa-spin"></i> ${state.language === 'pt' ? 'Carregando...' : 'Loading...'}</div>
            </div>
          </div>
        </div>
        
        <div id="statusText" class="wplace-farm-status status-default">
          ${t.ready}
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Make panel draggable
    const header = panel.querySelector('.wplace-farm-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.closest('.wplace-header-btn')) return;
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      panel.style.top = panel.offsetTop - pos2 + 'px';
      panel.style.left = panel.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    // Event listeners
    const toggleBtn = panel.querySelector('#toggleBtn');
    const minimizeBtn = panel.querySelector('#minimizeBtn');
    const content = panel.querySelector('.wplace-farm-content');
    const thresholdSlider = panel.querySelector('#thresholdSlider');
    const thresholdValue = panel.querySelector('#thresholdValue');

    toggleBtn.addEventListener('click', () => {
      state.running = !state.running;

      if (state.running) {
        toggleBtn.innerHTML = `<i class="fas fa-stop"></i> <span>${t.stop}</span>`;
        toggleBtn.classList.remove('wplace-farm-btn-start');
        toggleBtn.classList.add('wplace-farm-btn-stop');
        updateUI(
          state.language === 'pt' ? '🚀 Farm iniciado!' : '🚀 Farm started!',
          'success'
        );
        farmingLoop();
      } else {
        toggleBtn.innerHTML = `<i class="fas fa-play"></i> <span>${t.start}</span>`;
        toggleBtn.classList.add('wplace-farm-btn-start');
        toggleBtn.classList.remove('wplace-farm-btn-stop');
        updateUI(state.language === 'pt' ? '⏹️ Parado' : '⏹️ Stopped', 'default');
      }
    });

    minimizeBtn.addEventListener('click', () => {
      state.minimized = !state.minimized;
      content.style.display = state.minimized ? 'none' : 'block';
      minimizeBtn.innerHTML = `<i class="fas fa-${state.minimized ? 'expand' : 'minus'}"></i>`;
    });

    thresholdSlider.addEventListener('input', (e) => {
      state.cooldownChargeThreshold = parseInt(e.target.value);
      thresholdValue.textContent = state.cooldownChargeThreshold;
    });
  };

  const updateUI = (message, type = 'default') => {
    const statusText = document.querySelector('#statusText');
    if (statusText) {
      statusText.textContent = message;
      statusText.className = `wplace-farm-status status-${type}`;
    }
  };

  const updateStats = async () => {
    const statsArea = document.querySelector('#statsArea');
    if (!statsArea) return;

    const t = {
      pt: {
        user: 'Usuário',
        sessionPixels: 'Pixels (Sessão)',
        totalPixels: 'Total Pintado',
        charges: 'Cargas',
        batches: 'Lotes',
      },
      en: {
        user: 'User',
        sessionPixels: 'Pixels (Session)',
        totalPixels: 'Total Painted',
        charges: 'Charges',
        batches: 'Batches',
      },
    }[state.language] || {
      user: 'User',
      sessionPixels: 'Pixels (Session)',
      totalPixels: 'Total Painted',
      charges: 'Charges',
      batches: 'Batches',
    };

    statsArea.innerHTML = `
      <div class="wplace-stat-item">
        <div class="wplace-stat-label"><i class="fas fa-user"></i> ${t.user}</div>
        <div class="wplace-stat-value">${state.userInfo?.name || '---'}</div>
      </div>
      <div class="wplace-stat-item">
        <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${t.sessionPixels}</div>
        <div class="wplace-stat-value">${state.sessionPixels}</div>
      </div>
      <div class="wplace-stat-item">
        <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${t.totalPixels}</div>
        <div class="wplace-stat-value">${state.paintedCount}</div>
      </div>
      <div class="wplace-stat-item">
        <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${t.charges}</div>
        <div class="wplace-stat-value">${Math.floor(state.charges.count)}/${Math.floor(state.charges.max)}</div>
      </div>
      <div class="wplace-stat-item">
        <div class="wplace-stat-label"><i class="fas fa-layer-group"></i> ${t.batches}</div>
        <div class="wplace-stat-value">${state.totalBatches}</div>
      </div>
    `;
  };

  // INITIALIZE
  await detectLanguage();
  createUI();
  await getCharges();
  updateStats();

  console.log('✅ Auto-Farm Enhanced ready!');
})();
