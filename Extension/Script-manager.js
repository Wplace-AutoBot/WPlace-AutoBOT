// ==UserScript==
// @name         WPlace AutoBOT Script Manager
// @namespace    http://tampermonkey.net/
// @version      2025-09-08.1
// @description  Script manager and launcher for WPlace AutoBOT
// @author       TH3C0D3R
// @match        https://wplace.live/*
// @grant        none
// @icon
// ==/UserScript==

; (async () => {
  console.log('%c🚀 WPlace AutoBOT Script Manager Loading...', 'color: var(--wplace-text, #4facfe); font-weight: bold; font-size: 16px;');

  
  const AVAILABLE_SCRIPTS = [
    { 
      name: 'Auto-Farm.js', 
      displayName: '🌾 Auto Farm', 
      description: 'Automated farming and pixel painting',
      icon: '🌾',
      category: 'automation'
    },
    { 
      name: 'Auto-Image.js', 
      displayName: '🖼️ Auto Image', 
      description: 'Automated image processing and placement',
      icon: '🖼️',
      category: 'automation'
    },
    { 
      name: 'Auto-Repair.js', 
      displayName: '🔧 Auto Repair', 
      description: 'Automated repair and maintenance tasks',
      icon: '🔧',
      category: 'utility'
    }
  ];

  
  const NEON_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    :root, .wplace-theme-neon, .wplace-theme-classic, .wplace-theme-classic-light, .wplace-theme-acrylic {
      --sm-primary: var(--wplace-primary, #1a1a2e);
      --sm-secondary: var(--wplace-secondary, #16213e);
      --sm-accent: var(--wplace-accent, #0f3460);
      --sm-text: var(--wplace-text, #00ff41);
      --sm-highlight: var(--wplace-highlight, #ff6b35);
      --sm-success: var(--wplace-success, #39ff14);
      --sm-error: var(--wplace-error, #ff073a);
      --sm-warning: var(--wplace-warning, #ff0);
      --sm-font: var(--wplace-font, 'Press Start 2P', monospace, 'Courier New');
      --sm-border-color: var(--wplace-text, #00ff41);
      --sm-border-width: 3px;
      --sm-shadow-glow-a: 0 0 30px rgb(0 255 65 / 50%);
      --sm-shadow-glow-b: inset 0 0 30px rgb(0 255 65 / 10%);
      --sm-shadow-outline: 0 0 0 1px var(--sm-border-color);
    }
    
    .script-manager-container {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: var(--sm-primary);
      border: var(--sm-border-width) solid var(--sm-border-color);
      border-radius: 0;
      box-shadow: 
        var(--sm-shadow-glow-a), 
        var(--sm-shadow-glow-b),
        var(--sm-shadow-outline);
      font-family: var(--sm-font);
      z-index: 10001 !important;
      min-width: 600px;
      max-width: 800px;
      max-height: 80vh;
      overflow: hidden;
      color: var(--sm-text);
      animation: neon-pulse 2s ease-in-out infinite alternate;
    }
    
    .script-manager-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
  background: linear-gradient(90deg, transparent, var(--sm-text), transparent);
      z-index: 1;
      pointer-events: none;
      animation: scanline 3s linear infinite;
      opacity: 0.7;
    }
    
    .script-manager-header {
      background: var(--sm-secondary);
      border-bottom: 2px solid var(--sm-border-color);
      padding: 15px 20px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .header-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.4);
      transition: all 0.3s ease;
      animation: pixel-blink 3s infinite;
    }
    
    .header-icon:hover {
      transform: scale(1.1);
      box-shadow: 0 0 25px rgba(0, 255, 65, 0.6);
    }
    
    .script-manager-title {
      color: var(--sm-text);
      font-size: 14px;
      text-shadow: 0 0 15px var(--sm-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-glow 2s ease-in-out infinite alternate;
    }
    
    .script-manager-close {
      background: var(--sm-secondary);
      border: 2px solid var(--sm-error);
      border-radius: 0;
      color: var(--sm-error);
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
  text-shadow: 0 0 10px var(--sm-error);
    }
    
    .script-manager-close:hover {
      background: var(--sm-error);
      color: var(--sm-primary);
      box-shadow: 0 0 20px var(--sm-error);
      animation: pixel-blink 0.5s infinite;
    }
    
    .script-manager-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
      background: linear-gradient(45deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.15) 100%);
    }
    
    .script-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .script-card {
      background: var(--sm-secondary);
      border: 2px solid var(--sm-border-color);
      border-radius: 0;
      padding: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .script-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(0,255,65,0.1), transparent);
      transform: rotate(45deg);
      transition: all 0.5s ease;
      opacity: 0;
    }
    
    .script-card:hover::before {
      animation: neon-sweep 1s ease-in-out;
    }
    
    .script-card:hover {
      background: rgba(255,255,255,0.08);
      box-shadow: 
        0 0 25px var(--sm-text),
        inset 0 0 25px rgb(255 255 255 / 10%);
      transform: translateY(-3px);
      animation: card-glow 0.5s ease-in-out infinite alternate;
    }
    
    .script-card-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .script-icon {
      font-size: 24px;
      margin-right: 10px;
      filter: drop-shadow(0 0 10px var(--sm-text));
    }
    
    .script-title {
      color: var(--sm-text);
      font-size: 11px;
      text-shadow: 0 0 10px var(--sm-text);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    
    .script-description {
      color: var(--sm-text);
      font-size: 8px;
      line-height: 1.4;
      text-shadow: 0 0 5px var(--sm-text);
      margin-bottom: 15px;
    }
    
    .script-category {
      background: rgba(255, 107, 53, 0.2);
      border: 1px solid var(--sm-highlight);
      color: var(--sm-highlight);
      padding: 3px 8px;
      font-size: 7px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 0 5px var(--sm-highlight);
      display: inline-block;
    }
    
    .script-manager-footer {
      background: var(--sm-secondary);
      border-top: 2px solid var(--sm-border-color);
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-text {
      color: var(--sm-text);
      font-size: 8px;
      text-shadow: 0 0 5px var(--sm-text);
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    
    .neon-btn {
      background: var(--sm-secondary);
      border: 2px solid var(--sm-border-color);
      border-radius: 0;
      color: var(--sm-text);
      padding: 8px 15px;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      text-shadow: 0 0 8px var(--sm-text);
      letter-spacing: 1px;
    }
    
    .neon-btn:hover {
      background: rgba(255,255,255,0.1);
      box-shadow: 0 0 20px var(--sm-text);
      animation: pixel-blink 0.5s infinite;
    }
    
    .neon-btn.secondary {
      border-color: var(--sm-highlight);
      color: var(--sm-highlight);
      text-shadow: 0 0 8px var(--sm-highlight);
    }
    
    .neon-btn.secondary:hover {
      background: rgba(255, 107, 53, 0.1);
      box-shadow: 0 0 20px var(--sm-highlight);
    }

    /* Theme select styling */
    #autobot-theme-select.neon-select {
      appearance: none;
      -webkit-appearance: none;
      background: var(--sm-secondary);
      color: var(--sm-text);
      border: 2px solid var(--sm-border-color);
      text-shadow: 0 0 6px color-mix(in srgb, var(--sm-text) 40%, transparent);
      padding: 6px 28px 6px 10px !important;
      position: relative;
      cursor: pointer;
      line-height: 1.2;
      letter-spacing: 0.5px;
      font-size: 10px;
      background-image: linear-gradient(45deg, transparent 50%, var(--sm-text) 50%), linear-gradient(135deg, var(--sm-text) 50%, transparent 50%);
      background-position: right 10px top 55%, right 4px top 55%;
      background-size: 8px 8px, 8px 8px;
      background-repeat: no-repeat;
    }

    #autobot-theme-select.neon-select:hover {
      box-shadow: 0 0 14px color-mix(in srgb, var(--sm-text) 55%, transparent);
    }

    #autobot-theme-select.neon-select:focus {
      outline: 2px solid var(--sm-highlight);
      outline-offset: 1px;
      box-shadow: 0 0 0 2px var(--sm-highlight), 0 0 18px color-mix(in srgb, var(--sm-highlight) 60%, transparent);
    }

    #autobot-theme-select.neon-select option {
      background: var(--sm-primary);
      color: var(--sm-text);
    }
    
    .script-manager-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000 !important;
      backdrop-filter: blur(5px);
      animation: backdrop-fade-in 0.3s ease-out;
    }
    
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #16213e;
  border-top: 3px solid var(--sm-border-color);
      border-radius: 0;
      animation: neon-spin 1s linear infinite;
      margin-bottom: 15px;
      box-shadow: 0 0 20px rgb(0 255 65 / 50%);
    }
    
    .loading-text {
  color: var(--sm-text);
      font-size: 8px;
  text-shadow: 0 0 10px var(--sm-text);
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-pulse 1.5s ease-in-out infinite;
    }
    
    
    .script-manager-content::-webkit-scrollbar {
      width: 12px;
    }
    
    .script-manager-content::-webkit-scrollbar-track {
      background: #16213e;
  border: 1px solid var(--sm-border-color);
    }
    
    .script-manager-content::-webkit-scrollbar-thumb {
  background: var(--sm-text);
      border-radius: 0;
  box-shadow: 0 0 10px var(--sm-text);
    }
    
    .script-manager-content::-webkit-scrollbar-thumb:hover {
  background: var(--sm-success);
  box-shadow: 0 0 15px var(--sm-success);
    }
    
    
    @keyframes neon-pulse {
  0% { box-shadow: var(--sm-shadow-glow-a), var(--sm-shadow-glow-b), var(--sm-shadow-outline); }
  100% { box-shadow: 0 0 40px color-mix(in srgb, var(--sm-text) 70%, transparent), inset 0 0 40px color-mix(in srgb, var(--sm-text) 15%, transparent), var(--sm-shadow-outline); }
    }
    
    @keyframes text-glow {
  0% { text-shadow: 0 0 15px var(--sm-text); }
  100% { text-shadow: 0 0 25px var(--sm-text), 0 0 35px var(--sm-text); }
    }
    
    @keyframes pixel-blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.7; }
    }
    
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(400px); }
    }
    
    @keyframes neon-sweep {
      0% { opacity: 0; transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      50% { opacity: 1; }
      100% { opacity: 0; transform: translateX(100%) translateY(100%) rotate(45deg); }
    }
    
    @keyframes card-glow {
      0% { box-shadow: 0 0 25px rgb(0 255 65 / 60%), inset 0 0 25px rgb(0 255 65 / 15%); }
      100% { box-shadow: 0 0 35px rgb(0 255 65 / 80%), inset 0 0 35px rgb(0 255 65 / 20%); }
    }
    
    @keyframes neon-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes text-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    
    @keyframes backdrop-fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    
    @media (max-width: 768px) {
      .script-manager-container {
        min-width: 90vw;
        max-width: 95vw;
      }
      
      .script-grid {
        grid-template-columns: 1fr;
      }
      
      .script-manager-title {
        font-size: 10px;
      }
    }
  `;

  
  function toTitleLabel(base) {
    // Special cases
    if (base === 'ph') return 'PH';
    if (base === 'classic-light') return 'Classic Light';
    // Convert kebab / snake to Title Case
    return base.replace(/[-_]+/g, ' ') 
               .replace(/\b\w/g, c => c.toUpperCase());
  }

  function discoverThemes() {
    // Prefer manager-specific themes if provided
    const managerObj = (window.AUTOBOT_MANAGER_THEMES || {});
    const baseObj = (window.AUTOBOT_THEMES || {});

    // Build a unified map giving precedence to manager variants
    const combined = { ...baseObj };
    // Manager themes override (or add new) by filename
    Object.keys(managerObj).forEach(fn => { combined[fn] = managerObj[fn]; });

    const files = Object.keys(combined)
      .filter(f => f.endsWith('.css'))
      .filter(f => f !== 'auto-image-styles.css');

    const list = files.map(f => {
      const base = f.replace(/\.css$/, '');
      return {
        value: base,
        label: toTitleLabel(base),
        className: 'wplace-theme-' + base
      };
    }).sort((a,b)=> a.label.localeCompare(b.label));

    if (list.length === 0) {
      return [ { value: 'neon', label: 'Neon Retro', className: 'wplace-theme-neon' } ];
    }
    return list;
  }

  let AVAILABLE_THEMES = discoverThemes();

  
  if (!AVAILABLE_THEMES || AVAILABLE_THEMES.length <= 1) {
    setTimeout(() => { AVAILABLE_THEMES = discoverThemes(); }, 500);
  }

  const THEME_STORAGE_KEY = 'autobot-selected-theme';
  let currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'neon';

  function logTheme(msg, color = '#8b5cf6') {
    console.log(`%c🎨 ThemeSwitcher: ${msg}`,'color:'+color+';font-weight:bold;');
  }

  // Inject (or update) the manager-specific theme CSS layer so it overrides the base theme
  function applyManagerThemeLayer(themeValue) {
    try {
      const mgr = (window.AUTOBOT_MANAGER_THEMES || {});
      const fileName = themeValue + '.css';
      const css = mgr[fileName];
      const STYLE_ID = 'autobot-manager-theme';
      // Always remove previous layer first so we don't accumulate
      const prev = document.getElementById(STYLE_ID);
      if (prev) prev.remove();
      if (!css) {
        logTheme(`No manager theme layer for '${themeValue}' (file ${fileName})`, '#ef4444');
        return false;
      }
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = css;
      document.head.appendChild(el);
      logTheme(`Manager layer injected: ${fileName}`, '#10b981');
      return true;
    } catch (e) {
      console.warn('Manager theme layer injection failed', e);
      return false;
    }
  }

  function applyAutobotTheme(themeValue) {
    const found = AVAILABLE_THEMES.find(t => t.value === themeValue) || AVAILABLE_THEMES[0];
    currentTheme = found.value;
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);

    
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('wplace-theme-')) {
        document.documentElement.classList.remove(cls);
      }
    });

    
    if (typeof window.applyTheme === 'function') {
      const success = window.applyTheme(found.value);
      if (!success) {
        document.documentElement.classList.add(found.className);
        logTheme(`Fallback class applied: ${found.className}`, '#f59e0b');
      } else {
        // Ensure matching class for variable-based selectors (some themes depend on it)
        document.documentElement.classList.add(found.className);
        logTheme(`Applied via window.applyTheme('${found.value}')`, '#10b981');
      }
    } else {
      document.documentElement.classList.add(found.className);
      logTheme(`applyTheme helper missing; class applied: ${found.className}`, '#f59e0b');
    }

    
    const layered = applyManagerThemeLayer(found.value);
    if (!layered) {
      // If no manager CSS, we still rely on base theme + class selectors
      logTheme(`Using base theme only for '${found.value}'`, '#3b82f6');
    }
  }

  // Pre-apply the stored theme early
  try { applyAutobotTheme(currentTheme); } catch(e){ console.warn('Theme pre-apply failed', e);}  

  // Execute script function - Fixed to work like extension popup
  async function executeScript(scriptName) {
    console.group(`%c🚀 Executing ${scriptName}`, 'color: #00ff41; font-weight: bold;');
    
    try {
      // Show loading in the UI
      showLoading(`Launching ${scriptName}...`);
      
      // The Script Manager runs in MAIN world context and doesn't have direct Chrome API access
      // Instead, we need to communicate back to the content script which can use Chrome APIs
      console.log('%c🔄 Script Manager context - delegating to content script', 'color: #ff6b35;');
      
      // Create a custom event to communicate with the content script
      const executeEvent = new CustomEvent('autobot-execute-script', {
        detail: { scriptName: scriptName }
      });
      
      // Dispatch the event to the content script
      window.dispatchEvent(executeEvent);
      
      // Show success immediately since we're delegating
      console.log(`%c✅ ${scriptName} execution delegated to content script`, 'color: #39ff14; font-weight: bold;');
      showSuccess(`${scriptName} execution started!`);
      
      // Auto-close after success
      setTimeout(() => {
        closeScriptManager();
      }, 1500);
      
    } catch (error) {
      console.error(`%c❌ Failed to execute ${scriptName}:`, 'color: #ff073a; font-weight: bold;', error);
      showError(`Failed to launch ${scriptName}: ${error.message}`);
    } finally {
      console.groupEnd();
    }
  }

  // UI Management functions
  function showLoading(message) {
    const container = document.getElementById('script-manager-content');
    if (!container) return;
    
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
  }

  function showSuccess(message) {
    const statusText = document.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = `✅ ${message}`;
      statusText.style.color = '#39ff14';
      statusText.style.textShadow = '0 0 10px #39ff14';
    }
  }

  function showError(message) {
    const statusText = document.querySelector('.status-text');
    if (statusText) {
      statusText.textContent = `❌ ${message}`;
      statusText.style.color = '#ff073a';
      statusText.style.textShadow = '0 0 10px #ff073a';
    }
    
    // Reset the content to show scripts again
    setTimeout(() => {
      renderScripts();
    }, 3000);
  }

  function renderScripts() {
    const container = document.getElementById('script-manager-content');
    if (!container) return;
    
    const scriptGrid = AVAILABLE_SCRIPTS.map(script => `
      <div class="script-card" onclick="executeScript('${script.name}')">
        <div class="script-card-header">
          <div class="script-icon">${script.icon}</div>
          <h3 class="script-title">${script.displayName}</h3>
        </div>
        <p class="script-description">${script.description}</p>
        <span class="script-category">${script.category}</span>
      </div>
    `).join('');
    
    container.innerHTML = `
      <div class="script-grid">
        ${scriptGrid}
      </div>
    `;
  }

  // Close script manager
  function closeScriptManager() {
    const container = document.getElementById('script-manager-container');
    const backdrop = document.getElementById('script-manager-backdrop');
    
    if (container) {
      container.style.animation = 'neon-fade-out 0.3s ease-in forwards';
      setTimeout(() => {
        container.remove();
      }, 300);
    }
    
    if (backdrop) {
      backdrop.style.animation = 'backdrop-fade-out 0.3s ease-in forwards';
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    }
    
    // Remove ESC key listener
    document.removeEventListener('keydown', handleEscKey);
    
    console.log('%c👋 Script Manager closed', 'color: #ff6b35;');
  }

  // ESC key handler
  function handleEscKey(event) {
    if (event.key === 'Escape') {
      closeScriptManager();
    }
  }

  // Main function to show script manager
  function showScriptManager() {
    // Remove any existing manager
    const existing = document.getElementById('script-manager-container');
    if (existing) existing.remove();
    
    const existingBackdrop = document.getElementById('script-manager-backdrop');
    if (existingBackdrop) existingBackdrop.remove();
    
    console.log('%c🎮 Opening Script Manager with Neon Theme', 'color: #00ff41; font-weight: bold;');
    
    // Get icon URL for display
    let iconUrl = '';
    try {
      if (chrome && chrome.runtime && chrome.runtime.getURL) {
        iconUrl = chrome.runtime.getURL('icons/icon32.png');
        console.log('📷 Icon URL:', iconUrl);
      }
    } catch (e) {
      console.log('Extension context not available for icon');
    }
    
    // Inject styles
    if (!document.getElementById('script-manager-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'script-manager-styles';
      styleElement.textContent = NEON_STYLES;
      document.head.appendChild(styleElement);
    }
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'script-manager-backdrop';
    backdrop.className = 'script-manager-backdrop';
    backdrop.addEventListener('click', closeScriptManager);
    
    // Create container
    const container = document.createElement('div');
    container.id = 'script-manager-container';
    container.className = 'script-manager-container';
    
    container.innerHTML = `
      <div class="script-manager-header">
        <div class="header-content">
          ${iconUrl ? `<img src="${iconUrl}" alt="AutoBOT" class="header-icon" onerror="this.style.display='none'">` : ''}
          <h2 class="script-manager-title">⚡ WPlace AutoBOT Script Manager ⚡</h2>
        </div>
        <button class="script-manager-close" onclick="closeScriptManager()">×</button>
      </div>
      <div id="script-manager-content" class="script-manager-content">
        <!-- Scripts will be rendered here -->
      </div>
      <div class="script-manager-footer">
        <div style="display:flex;align-items:center;gap:12px;width:100%;justify-content:space-between;">
          <div class="status-text">Ready • Theme:</div>
          <div class="theme-select-wrapper" style="display:flex;align-items:center;gap:6px;">
            <select id="autobot-theme-select" class="neon-btn neon-select" style="padding:4px 8px;min-width:160px;">
              ${AVAILABLE_THEMES.map(t => `<option value="${t.value}" ${t.value===currentTheme?'selected':''}>${t.label}</option>`).join('')}
            </select>
          </div>
          <div class="action-buttons">
            <button class="neon-btn secondary" onclick="closeScriptManager()">Cancel</button>
            <button class="neon-btn" onclick="window.location.reload()">Refresh</button>
          </div>
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(backdrop);
    document.body.appendChild(container);
    
    // Debug: Check positioning
    console.log('%c🔍 Script Manager Positioning Debug:', 'color: #ff6b35; font-weight: bold;');
    console.log(`  - Container position: ${getComputedStyle(container).position}`);
    console.log(`  - Container top: ${getComputedStyle(container).top}`);
    console.log(`  - Container left: ${getComputedStyle(container).left}`);
    console.log(`  - Container transform: ${getComputedStyle(container).transform}`);
    console.log(`  - Container z-index: ${getComputedStyle(container).zIndex}`);
    console.log(`  - Backdrop z-index: ${getComputedStyle(backdrop).zIndex}`);
    
    // Render scripts
    renderScripts();
    
    // Add ESC key listener
    document.addEventListener('keydown', handleEscKey);
    
    // Focus container for accessibility
    container.focus();
    
    console.log('%c✅ Script Manager opened successfully', 'color: #39ff14; font-weight: bold;');

    // Theme select listener (after render)
    const themeSelect = container.querySelector('#autobot-theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        const v = e.target.value;
        applyAutobotTheme(v);
      });
    }
  }

  // Make functions globally available
  window.executeScript = executeScript;
  window.closeScriptManager = closeScriptManager;
  window.showScriptManager = showScriptManager;

  // Auto-start the script manager
  console.log('%c🎯 Auto-launching Script Manager...', 'color: #00ff41; font-weight: bold;');
  showScriptManager();

  console.log('%c🚀 WPlace AutoBOT Script Manager Ready!', 'color: #39ff14; font-weight: bold; font-size: 16px;');
})();
