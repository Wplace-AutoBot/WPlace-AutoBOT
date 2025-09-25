// ==UserScript==
// @name         WPlace AutoBOT Script Manager
// @namespace    http://tampermonkey.net/
// @version      2025-09-08.1
// @description  Script manager and launcher for WPlace AutoBOT
// @author       TH3C0D3R
// @match        https://wplace.live/*
// @grant        none
// @icon
// ==/UserScript==l

; (async () => {
  console.log('%c🚀 WPlace AutoBOT Script Manager Loading...', 'color: #00ff41; font-weight: bold; font-size: 16px;');

  // Available scripts configuration
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
    },
    {
      name: 'Art-Extractor.js',
      displayName: '🎨 Art Extractor',
      description: 'Extract artwork areas to JSON for auto-repair',
      icon: '🎨',
      category: 'utility'
    }
  ];  // Neon theme styling
  const NEON_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    .script-manager-container {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #1a1a2e;
      border: 3px solid #00ff41;
      border-radius: 0;
      box-shadow: 
        0 0 30px rgb(0 255 65 / 50%), 
        inset 0 0 30px rgb(0 255 65 / 10%),
        0 0 0 1px #00ff41;
      font-family: 'Press Start 2P', monospace, 'Courier New';
      z-index: 10001 !important;
      min-width: 600px;
      max-width: 800px;
      max-height: 80vh;
      overflow: hidden;
      color: #00ff41;
      animation: neon-pulse 2s ease-in-out infinite alternate;
    }
    
    .script-manager-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00ff41, transparent);
      z-index: 1;
      pointer-events: none;
      animation: scanline 3s linear infinite;
      opacity: 0.7;
    }
    
    .script-manager-header {
      background: #16213e;
      border-bottom: 2px solid #00ff41;
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
      color: #00ff41;
      font-size: 14px;
      text-shadow: 0 0 15px #00ff41;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-glow 2s ease-in-out infinite alternate;
    }
    
    .script-manager-close {
      background: #16213e;
      border: 2px solid #ff073a;
      border-radius: 0;
      color: #ff073a;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      text-shadow: 0 0 10px #ff073a;
    }
    
    .script-manager-close:hover {
      background: #ff073a;
      color: #1a1a2e;
      box-shadow: 0 0 20px #ff073a;
      animation: pixel-blink 0.5s infinite;
    }
    
    .script-manager-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
      background: linear-gradient(45deg, rgba(0,255,65,0.03) 0%, rgba(22,33,62,0.05) 100%);
    }
    
    .script-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .script-card {
      background: #16213e;
      border: 2px solid #00ff41;
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
      background: rgba(0,255,65,0.1);
      box-shadow: 
        0 0 25px rgb(0 255 65 / 60%),
        inset 0 0 25px rgb(0 255 65 / 15%);
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
      filter: drop-shadow(0 0 10px #00ff41);
    }
    
    .script-title {
      color: #00ff41;
      font-size: 11px;
      text-shadow: 0 0 10px #00ff41;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    
    .script-description {
      color: #00ff41dd;
      font-size: 8px;
      line-height: 1.4;
      text-shadow: 0 0 5px #00ff41;
      margin-bottom: 15px;
    }
    
    .script-category {
      background: rgba(255, 107, 53, 0.2);
      border: 1px solid #ff6b35;
      color: #ff6b35;
      padding: 3px 8px;
      font-size: 7px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 0 5px #ff6b35;
      display: inline-block;
    }
    
    .script-manager-footer {
      background: #16213e;
      border-top: 2px solid #00ff41;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-text {
      color: #00ff41dd;
      font-size: 8px;
      text-shadow: 0 0 5px #00ff41;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    
    .neon-btn {
      background: #16213e;
      border: 2px solid #00ff41;
      border-radius: 0;
      color: #00ff41;
      padding: 8px 15px;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      text-shadow: 0 0 8px #00ff41;
      letter-spacing: 1px;
    }
    
    .neon-btn:hover {
      background: rgba(0,255,65,0.1);
      box-shadow: 0 0 20px rgb(0 255 65 / 60%);
      animation: pixel-blink 0.5s infinite;
    }
    
    .neon-btn.secondary {
      border-color: #ff6b35;
      color: #ff6b35;
      text-shadow: 0 0 8px #ff6b35;
    }
    
    .neon-btn.secondary:hover {
      background: rgba(255, 107, 53, 0.1);
      box-shadow: 0 0 20px rgb(255 107 53 / 60%);
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
    
    /* Loading animation */
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
      border-top: 3px solid #00ff41;
      border-radius: 0;
      animation: neon-spin 1s linear infinite;
      margin-bottom: 15px;
      box-shadow: 0 0 20px rgb(0 255 65 / 50%);
    }
    
    .loading-text {
      color: #00ff41;
      font-size: 8px;
      text-shadow: 0 0 10px #00ff41;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-pulse 1.5s ease-in-out infinite;
    }
    
    /* Custom scrollbar */
    .script-manager-content::-webkit-scrollbar {
      width: 12px;
    }
    
    .script-manager-content::-webkit-scrollbar-track {
      background: #16213e;
      border: 1px solid #00ff41;
    }
    
    .script-manager-content::-webkit-scrollbar-thumb {
      background: #00ff41;
      border-radius: 0;
      box-shadow: 0 0 10px #00ff41;
    }
    
    .script-manager-content::-webkit-scrollbar-thumb:hover {
      background: #39ff14;
      box-shadow: 0 0 15px #39ff14;
    }
    
    /* Animations */
    @keyframes neon-pulse {
      0% { box-shadow: 0 0 30px rgb(0 255 65 / 50%), inset 0 0 30px rgb(0 255 65 / 10%), 0 0 0 1px #00ff41; }
      100% { box-shadow: 0 0 40px rgb(0 255 65 / 70%), inset 0 0 40px rgb(0 255 65 / 15%), 0 0 0 1px #00ff41; }
    }
    
    @keyframes text-glow {
      0% { text-shadow: 0 0 15px #00ff41; }
      100% { text-shadow: 0 0 25px #00ff41, 0 0 35px #00ff41; }
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
    
    /* Responsive design */
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
        <div class="status-text">Ready to launch scripts</div>
        <div class="action-buttons">
          <button class="neon-btn secondary" onclick="closeScriptManager()">Cancel</button>
          <button class="neon-btn" onclick="window.location.reload()">Refresh Page</button>
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
=======
// ==UserScript==
// @name         WPlace AutoBOT Script Manager
// @namespace    http://tampermonkey.net/
// @version      2025-09-08.1
// @description  Script manager and launcher for WPlace AutoBOT
// @author       TH3C0D3R
// @match        https://wplace.live/*
// @grant        none
// @icon
// ==/UserScript==l

; (async () => {
  console.log('%c🚀 WPlace AutoBOT Script Manager Loading...', 'color: #00ff41; font-weight: bold; font-size: 16px;');

  // Available scripts configuration
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
    },
    {
      name: 'Art-Extractor.js',
      displayName: '🎨 Art Extractor',
      description: 'Extract artwork areas to JSON for auto-repair',
      icon: '🎨',
      category: 'utility'
    }
  ];  // Neon theme styling
  const NEON_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    .script-manager-container {
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #1a1a2e;
      border: 3px solid #00ff41;
      border-radius: 0;
      box-shadow: 
        0 0 30px rgb(0 255 65 / 50%), 
        inset 0 0 30px rgb(0 255 65 / 10%),
        0 0 0 1px #00ff41;
      font-family: 'Press Start 2P', monospace, 'Courier New';
      z-index: 10001 !important;
      min-width: 600px;
      max-width: 800px;
      max-height: 80vh;
      overflow: hidden;
      color: #00ff41;
      animation: neon-pulse 2s ease-in-out infinite alternate;
    }
    
    .script-manager-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00ff41, transparent);
      z-index: 1;
      pointer-events: none;
      animation: scanline 3s linear infinite;
      opacity: 0.7;
    }
    
    .script-manager-header {
      background: #16213e;
      border-bottom: 2px solid #00ff41;
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
      color: #00ff41;
      font-size: 14px;
      text-shadow: 0 0 15px #00ff41;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-glow 2s ease-in-out infinite alternate;
    }
    
    .script-manager-close {
      background: #16213e;
      border: 2px solid #ff073a;
      border-radius: 0;
      color: #ff073a;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      text-shadow: 0 0 10px #ff073a;
    }
    
    .script-manager-close:hover {
      background: #ff073a;
      color: #1a1a2e;
      box-shadow: 0 0 20px #ff073a;
      animation: pixel-blink 0.5s infinite;
    }
    
    .script-manager-content {
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
      background: linear-gradient(45deg, rgba(0,255,65,0.03) 0%, rgba(22,33,62,0.05) 100%);
    }
    
    .script-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .script-card {
      background: #16213e;
      border: 2px solid #00ff41;
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
      background: rgba(0,255,65,0.1);
      box-shadow: 
        0 0 25px rgb(0 255 65 / 60%),
        inset 0 0 25px rgb(0 255 65 / 15%);
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
      filter: drop-shadow(0 0 10px #00ff41);
    }
    
    .script-title {
      color: #00ff41;
      font-size: 11px;
      text-shadow: 0 0 10px #00ff41;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    
    .script-description {
      color: #00ff41dd;
      font-size: 8px;
      line-height: 1.4;
      text-shadow: 0 0 5px #00ff41;
      margin-bottom: 15px;
    }
    
    .script-category {
      background: rgba(255, 107, 53, 0.2);
      border: 1px solid #ff6b35;
      color: #ff6b35;
      padding: 3px 8px;
      font-size: 7px;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 0 5px #ff6b35;
      display: inline-block;
    }
    
    .script-manager-footer {
      background: #16213e;
      border-top: 2px solid #00ff41;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .status-text {
      color: #00ff41dd;
      font-size: 8px;
      text-shadow: 0 0 5px #00ff41;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    
    .neon-btn {
      background: #16213e;
      border: 2px solid #00ff41;
      border-radius: 0;
      color: #00ff41;
      padding: 8px 15px;
      font-family: 'Press Start 2P', monospace;
      font-size: 8px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      text-shadow: 0 0 8px #00ff41;
      letter-spacing: 1px;
    }
    
    .neon-btn:hover {
      background: rgba(0,255,65,0.1);
      box-shadow: 0 0 20px rgb(0 255 65 / 60%);
      animation: pixel-blink 0.5s infinite;
    }
    
    .neon-btn.secondary {
      border-color: #ff6b35;
      color: #ff6b35;
      text-shadow: 0 0 8px #ff6b35;
    }
    
    .neon-btn.secondary:hover {
      background: rgba(255, 107, 53, 0.1);
      box-shadow: 0 0 20px rgb(255 107 53 / 60%);
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
    
    /* Loading animation */
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
      border-top: 3px solid #00ff41;
      border-radius: 0;
      animation: neon-spin 1s linear infinite;
      margin-bottom: 15px;
      box-shadow: 0 0 20px rgb(0 255 65 / 50%);
    }
    
    .loading-text {
      color: #00ff41;
      font-size: 8px;
      text-shadow: 0 0 10px #00ff41;
      text-transform: uppercase;
      letter-spacing: 2px;
      animation: text-pulse 1.5s ease-in-out infinite;
    }
    
    /* Custom scrollbar */
    .script-manager-content::-webkit-scrollbar {
      width: 12px;
    }
    
    .script-manager-content::-webkit-scrollbar-track {
      background: #16213e;
      border: 1px solid #00ff41;
    }
    
    .script-manager-content::-webkit-scrollbar-thumb {
      background: #00ff41;
      border-radius: 0;
      box-shadow: 0 0 10px #00ff41;
    }
    
    .script-manager-content::-webkit-scrollbar-thumb:hover {
      background: #39ff14;
      box-shadow: 0 0 15px #39ff14;
    }
    
    /* Animations */
    @keyframes neon-pulse {
      0% { box-shadow: 0 0 30px rgb(0 255 65 / 50%), inset 0 0 30px rgb(0 255 65 / 10%), 0 0 0 1px #00ff41; }
      100% { box-shadow: 0 0 40px rgb(0 255 65 / 70%), inset 0 0 40px rgb(0 255 65 / 15%), 0 0 0 1px #00ff41; }
    }
    
    @keyframes text-glow {
      0% { text-shadow: 0 0 15px #00ff41; }
      100% { text-shadow: 0 0 25px #00ff41, 0 0 35px #00ff41; }
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
    
    /* Responsive design */
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
        <div class="status-text">Ready to launch scripts</div>
        <div class="action-buttons">
          <button class="neon-btn secondary" onclick="closeScriptManager()">Cancel</button>
          <button class="neon-btn" onclick="window.location.reload()">Refresh Page</button>
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