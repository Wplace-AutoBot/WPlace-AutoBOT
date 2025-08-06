(async () => {
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    LOG_INTERVAL: 10,
    THEME: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#222222',
      text: '#ffffff',
      highlight: '#775ce3',
      success: '#00ff00',
      error: '#ff0000',
      warning: '#ffaa00'
    }
  };

  const state = {
    running: false,
    imageLoaded: false,
    processing: false,
    totalPixels: 0,
    paintedPixels: 0,
    availableColors: [],
    currentCharges: 0,
    cooldown: CONFIG.COOLDOWN_DEFAULT,
    imageData: null,
    stopFlag: false,
    colorsChecked: false,
    startPosition: null,
    selectingPosition: false,
    region: null,
    minimized: false,
    lastPosition: { x: 0, y: 0 },
    language: 'en'
  };

  const Utils = {
    sleep: ms => new Promise(r => setTimeout(r, ms)),
    
    colorDistance: (a, b) => Math.sqrt(
      Math.pow(a[0] - b[0], 2) + 
      Math.pow(a[1] - b[1], 2) + 
      Math.pow(a[2] - b[2], 2)
    ),
    
    createImageUploader: () => new Promise(resolve => {
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
    
    extractAvailableColors: () => {
      const colorElements = document.querySelectorAll('[id^="color-"]');
      const availableColors = [];
      
      colorElements.forEach(el => {
        if (!el.querySelector('svg')) {
          const id = parseInt(el.id.replace('color-', ''));
          const rgbStr = el.style.backgroundColor.match(/\d+/g);
          const rgb = rgbStr ? rgbStr.map(Number) : [0, 0, 0];
          availableColors.push({ id, rgb });
        }
      });
      
      return availableColors;
    },
    
    formatTime: ms => {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      return `${minutes}m ${seconds}s`;
    },
    
    showAlert: (message, type = 'info') => {
      const alert = document.createElement('div');
      alert.style.position = 'fixed';
      alert.style.top = '20px';
      alert.style.left = '50%';
      alert.style.transform = 'translateX(-50%)';
      alert.style.padding = '15px 20px';
      alert.style.background = type === 'error' ? CONFIG.THEME.error : 
                             type === 'success' ? CONFIG.THEME.success : 
                             type === 'warning' ? CONFIG.THEME.warning : CONFIG.THEME.accent;
      alert.style.color = CONFIG.THEME.text;
      alert.style.borderRadius = '5px';
      alert.style.zIndex = '10000';
      alert.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
      alert.style.display = 'flex';
      alert.style.alignItems = 'center';
      alert.style.gap = '10px';
      alert.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 
                         type === 'success' ? 'check-circle' : 
                         type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
      `;
      
      document.body.appendChild(alert);
      
      setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transition = 'opacity 0.5s';
        setTimeout(() => alert.remove(), 500);
      }, 3000);
    }
  };

  const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
      try {
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          credentials: 'include',
          body: JSON.stringify({ coords: [pixelX, pixelY], colors: [color] })
        });
        const data = await res.json();
        return data?.painted === 1;
      } catch (error) {
        return false;
      }
    },
    
    async getCharges() {
      try {
        const res = await fetch('https://backend.wplace.live/me', { 
          credentials: 'include' 
        });
        const data = await res.json();
        return { 
          charges: data.charges?.count || 0, 
          cooldown: data.charges?.cooldownMs || CONFIG.COOLDOWN_DEFAULT 
        };
      } catch (error) {
        return { charges: 0, cooldown: CONFIG.COOLDOWN_DEFAULT };
      }
    }
  };

  class ImageProcessor {
    constructor(imageSrc) {
      this.imageSrc = imageSrc;
      this.img = new Image();
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
    }
    
    async load() {
      return new Promise(resolve => {
        this.img.onload = () => {
          this.canvas.width = this.img.width;
          this.canvas.height = this.img.height;
          this.ctx.drawImage(this.img, 0, 0);
          resolve();
        };
        this.img.src = this.imageSrc;
      });
    }
    
    getPixelData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }
    
    getDimensions() {
      return { width: this.canvas.width, height: this.canvas.height };
    }
  }

  function findClosestColor(rgb, palette) {
    let closestColor = palette[0];
    let minDistance = Utils.colorDistance(rgb, palette[0].rgb);
    
    for (let i = 1; i < palette.length; i++) {
      const distance = Utils.colorDistance(rgb, palette[i].rgb);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = palette[i];
      }
    }
    
    return closestColor.id;
  }

  async function detectUserLanguage() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country === 'BR') {
        state.language = 'pt';
      } else if (data.country === 'US') {
        state.language = 'en';
      } else {
        state.language = 'en';
      }
    } catch {
      state.language = 'en';
    }
  }

  function createUI() {
    const translations = {
      pt: {
        title: "WPlace Auto-Image",
        initBot: "Iniciar Auto-BOT",
        uploadImage: "Upload da Imagem",
        selectPos: "Selecionar Posição",
        startPaint: "Iniciar Pintura",
        stopPaint: "Parar Pintura",
        noPosition: "Nenhuma posição selecionada",
        waiting: "Aguardando inicialização...",
        checkingColors: "Verificando cores disponíveis...",
        noColors: "Nenhuma cor disponível encontrada",
        colorsFound: "cores disponíveis encontradas",
        loadingImage: "Carregando imagem...",
        imageLoaded: "Imagem carregada com sucesso!",
        selectPosition: "Aguardando você pintar o pixel de referência...",
        positionSet: "Posição definida com sucesso!",
        startPainting: "Iniciando pintura na região",
        paintingStopped: "Pintura interrompida pelo usuário",
        paintingComplete: "Pintura concluída!",
        progress: "Progresso",
        pixels: "Pixels",
        charges: "Cargas",
        remaining: "Restantes"
      },
      en: {
        title: "WPlace Auto-Image",
        initBot: "Start Auto-BOT",
        uploadImage: "Upload Image",
        selectPos: "Select Position",
        startPaint: "Start Painting",
        stopPaint: "Stop Painting",
        noPosition: "No position selected",
        waiting: "Waiting for initialization...",
        checkingColors: "Checking available colors...",
        noColors: "No available colors found",
        colorsFound: "available colors found",
        loadingImage: "Loading image...",
        imageLoaded: "Image loaded successfully!",
        selectPosition: "Waiting for you to paint the reference pixel...",
        positionSet: "Position set successfully!",
        startPainting: "Starting painting in region",
        paintingStopped: "Painting stopped by user",
        paintingComplete: "Painting completed!",
        progress: "Progress",
        pixels: "Pixels",
        charges: "Charges",
        remaining: "Remaining"
      }
    };

    const t = translations[state.language] || translations.en;

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
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      #wplace-image-bot-container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: ${CONFIG.THEME.primary};
        border: 1px solid ${CONFIG.THEME.accent};
        border-radius: 8px;
        padding: 0;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        z-index: 9998;
        font-family: 'Segoe UI', Roboto, sans-serif;
        color: ${CONFIG.THEME.text};
        animation: slideIn 0.4s ease-out;
        overflow: hidden;
      }
      .wplace-header {
        padding: 12px 15px;
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
      .wplace-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wplace-header-controls {
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
      }
      .wplace-header-btn:hover {
        opacity: 1;
      }
      .wplace-content {
        padding: 15px;
        display: block;
      }
      .wplace-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 15px;
      }
      .wplace-btn {
        padding: 10px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
      }
      .wplace-btn:hover {
        transform: translateY(-2px);
      }
      .wplace-btn-primary {
        background: ${CONFIG.THEME.accent};
        color: white;
      }
      .wplace-btn-upload {
        background: ${CONFIG.THEME.secondary};
        color: white;
        border: 1px dashed ${CONFIG.THEME.text};
      }
      .wplace-btn-start {
        background: ${CONFIG.THEME.success};
        color: white;
      }
      .wplace-btn-stop {
        background: ${CONFIG.THEME.error};
        color: white;
      }
      .wplace-btn-select {
        background: ${CONFIG.THEME.highlight};
        color: black;
      }
      .wplace-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }
      .wplace-stats {
        background: ${CONFIG.THEME.secondary};
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 15px;
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
      .wplace-progress {
        width: 100%;
        background: ${CONFIG.THEME.secondary};
        border-radius: 4px;
        margin: 10px 0;
        overflow: hidden;
      }
      .wplace-progress-bar {
        height: 10px;
        background: ${CONFIG.THEME.highlight};
        transition: width 0.3s;
      }
      .wplace-status {
        padding: 8px;
        border-radius: 4px;
        text-align: center;
        font-size: 13px;
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
      .status-warning {
        background: rgba(255, 165, 0, 0.1);
        color: orange;
      }
      #paintEffect {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: 8px;
      }
      .position-info {
        font-size: 13px;
        margin-top: 5px;
        padding: 5px;
        background: ${CONFIG.THEME.secondary};
        border-radius: 4px;
        text-align: center;
      }
      .wplace-minimized .wplace-content {
        display: none;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'wplace-image-bot-container';
    container.innerHTML = `
      <div id="paintEffect"></div>
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${t.title}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="minimizeBtn" class="wplace-header-btn" title="${state.language === 'pt' ? 'Minimizar' : 'Minimize'}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-controls">
          <button id="initBotBtn" class="wplace-btn wplace-btn-primary">
            <i class="fas fa-robot"></i>
            <span>${t.initBot}</span>
          </button>
          <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled>
            <i class="fas fa-upload"></i>
            <span>${t.uploadImage}</span>
          </button>
          <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
            <i class="fas fa-crosshairs"></i>
            <span>${t.selectPos}</span>
          </button>
          <button id="startBtn" class="wplace-btn wplace-btn-start" disabled>
            <i class="fas fa-play"></i>
            <span>${t.startPaint}</span>
          </button>
          <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
            <i class="fas fa-stop"></i>
            <span>${t.stopPaint}</span>
          </button>
          <div id="positionInfo" class="position-info" style="display: none;">
            <i class="fas fa-map-marker-alt"></i>
            <span>${t.noPosition}</span>
          </div>
        </div>
        
        <div class="wplace-progress">
          <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
        </div>
        
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${t.waiting}</div>
            </div>
          </div>
        </div>
        
        <div id="statusText" class="wplace-status status-default">
          ${t.waiting}
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
    
    const header = container.querySelector('.wplace-header');
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
      container.style.top = (container.offsetTop - pos2) + "px";
      container.style.left = (container.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    const initBotBtn = container.querySelector('#initBotBtn');
    const uploadBtn = container.querySelector('#uploadBtn');
    const selectPosBtn = container.querySelector('#selectPosBtn');
    const startBtn = container.querySelector('#startBtn');
    const stopBtn = container.querySelector('#stopBtn');
    const minimizeBtn = container.querySelector('#minimizeBtn');
    const statusText = container.querySelector('#statusText');
    const progressBar = container.querySelector('#progressBar');
    const statsArea = container.querySelector('#statsArea');
    const positionInfo = container.querySelector('#positionInfo');
    const content = container.querySelector('.wplace-content');
    
    minimizeBtn.addEventListener('click', () => {
      state.minimized = !state.minimized;
      if (state.minimized) {
        container.classList.add('wplace-minimized');
        minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        container.classList.remove('wplace-minimized');
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
      }
    });
    
    window.updateUI = (message, type = 'default') => {
      statusText.textContent = message;
      statusText.className = `wplace-status status-${type}`;
      statusText.style.animation = 'none';
      void statusText.offsetWidth;
      statusText.style.animation = 'slideIn 0.3s ease-out';
    };
    
    window.updateStats = async () => {
      if (!state.colorsChecked) return;
      
      const { charges, cooldown } = await WPlaceService.getCharges();
      state.currentCharges = Math.floor(charges);
      state.cooldown = cooldown;
      
      const progress = state.totalPixels > 0 ? 
        Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
      const remainingPixels = state.totalPixels - state.paintedPixels;
      
      progressBar.style.width = `${progress}%`;
      
      statsArea.innerHTML = `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-image"></i> ${t.progress}</div>
          <div>${progress}%</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${t.pixels}</div>
          <div>${state.paintedPixels}/${state.totalPixels}</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${t.charges}</div>
          <div>${Math.floor(state.currentCharges)}</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${t.remaining}</div>
          <div>${remainingPixels} ${t.pixels.toLowerCase()}</div>
        </div>
      `;
    };
    
    function updatePositionInfo() {
      if (state.startPosition && state.region) {
        positionInfo.style.display = 'block';
        positionInfo.innerHTML = `
          <i class="fas fa-map-marker-alt"></i>
          <span>${state.language === 'pt' ? 'Posição' : 'Position'}: (${state.startPosition.x}, ${state.startPosition.y}) | ${state.language === 'pt' ? 'Região' : 'Region'}: ${state.region.x}/${state.region.y}</span>
        `;
      } else {
        positionInfo.style.display = 'none';
      }
    }
    
    initBotBtn.addEventListener('click', async () => {
      try {
        updateUI(`🔍 ${t.checkingColors}`, 'default');
        
        state.availableColors = Utils.extractAvailableColors();
        
        if (state.availableColors.length === 0) {
          Utils.showAlert(state.language === 'pt' ? 'Abra a paleta de cores no site e tente novamente!' : 'Open the color palette on the site and try again!', 'error');
          updateUI(`❌ ${t.noColors}`, 'error');
          return;
        }
        
        state.colorsChecked = true;
        uploadBtn.disabled = false;
        selectPosBtn.disabled = false;
        initBotBtn.style.display = 'none';
        
        updateUI(`✅ ${state.availableColors.length} ${t.colorsFound}`, 'success');
        updateStats();
        
      } catch (error) {
        updateUI('❌ ' + (state.language === 'pt' ? 'Erro ao verificar cores' : 'Error checking colors'), 'error');
      }
    });
    
    uploadBtn.addEventListener('click', async () => {
      try {
        updateUI(`🖼️ ${t.loadingImage}`, 'default');
        const imageSrc = await Utils.createImageUploader();
        
        const processor = new ImageProcessor(imageSrc);
        await processor.load();
        
        const { width, height } = processor.getDimensions();
        const pixels = processor.getPixelData();
        
        state.imageData = {
          width,
          height,
          pixels,
          totalPixels: width * height
        };
        
        state.totalPixels = state.imageData.totalPixels;
        state.paintedPixels = 0;
        state.imageLoaded = true;
        state.lastPosition = { x: 0, y: 0 };
        
        if (state.startPosition) {
          startBtn.disabled = false;
        }
        
        updateStats();
        updateUI(`✅ ${t.imageLoaded}`, 'success');
      } catch (error) {
        updateUI('❌ ' + (state.language === 'pt' ? 'Erro ao carregar imagem' : 'Error loading image'), 'error');
      }
    });
    
    selectPosBtn.addEventListener('click', async () => {
      if (state.selectingPosition) return;
      
      state.selectingPosition = true;
      state.startPosition = null;
      state.region = null;
      startBtn.disabled = true;
      updatePositionInfo();
      
      Utils.showAlert(state.language === 'pt' ? 'Pinte o primeiro pixel na localização onde deseja que a arte comece!' : 'Paint the first pixel at the location where you want the art to start!', 'info');
      updateUI(`👆 ${t.selectPosition}`, 'default');
      
      const originalFetch = window.fetch;
      
      window.fetch = async (url, options) => {
        if (typeof url === 'string' && 
            url.includes('https://backend.wplace.live/s0/pixel/') && 
            options?.method?.toUpperCase() === 'POST') {
          
          try {
            const response = await originalFetch(url, options);
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            
            if (data?.painted === 1) {
              const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/);
              if (regionMatch && regionMatch.length >= 3) {
                state.region = {
                  x: parseInt(regionMatch[1]),
                  y: parseInt(regionMatch[2])
                };
              }
              
              const payload = JSON.parse(options.body);
              if (payload?.coords && Array.isArray(payload.coords)) {
                state.startPosition = {
                  x: payload.coords[0],
                  y: payload.coords[1]
                };
                state.lastPosition = { x: 0, y: 0 };
                
                updatePositionInfo();
                updateUI(`✅ ${t.positionSet}`, 'success');
                Utils.showAlert(state.language === 'pt' ? 
                  `Posição capturada na região ${state.region.x}/${state.region.y}!` : 
                  `Position captured in region ${state.region.x}/${state.region.y}!`, 'success');
                
                if (state.imageLoaded) {
                  startBtn.disabled = false;
                }
                
                window.fetch = originalFetch;
                state.selectingPosition = false;
              }
            }
            
            return response;
          } catch (error) {
            return originalFetch(url, options);
          }
        }
        return originalFetch(url, options);
      };
      
      setTimeout(() => {
        if (state.selectingPosition) {
          window.fetch = originalFetch;
          state.selectingPosition = false;
          updateUI('❌ ' + (state.language === 'pt' ? 'Tempo esgotado para selecionar posição' : 'Time expired to select position'), 'error');
          Utils.showAlert(state.language === 'pt' ? 'Tempo esgotado! Clique em "Selecionar Posição" novamente.' : 'Time expired! Click "Select Position" again.', 'error');
        }
      }, 120000);
    });
    
    startBtn.addEventListener('click', async () => {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI('❌ ' + (state.language === 'pt' ? 'Carregue uma imagem e selecione uma posição primeiro' : 'Load an image and select a position first'), 'error');
        return;
      }
      
      state.running = true;
      state.stopFlag = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      uploadBtn.disabled = true;
      selectPosBtn.disabled = true;
      
      updateUI(`🎨 ${t.startPainting} ${state.region.x}/${state.region.y}...`, 'success');
      
      try {
        await processImage();
      } catch (error) {
        updateUI('❌ ' + (state.language === 'pt' ? 'Erro durante a pintura' : 'Error during painting'), 'error');
      } finally {
        state.running = false;
        stopBtn.disabled = true;
        
        if (!state.stopFlag) {
          startBtn.disabled = true;
          uploadBtn.disabled = false;
          selectPosBtn.disabled = false;
        } else {
          startBtn.disabled = false;
        }
      }
    });
    
    stopBtn.addEventListener('click', () => {
      state.stopFlag = true;
      state.running = false;
      stopBtn.disabled = true;
      updateUI(`⏹️ ${t.paintingStopped}`, 'warning');
    });
  }

  async function processImage() {
    const { width, height, pixels } = state.imageData;
    const { x: startX, y: startY } = state.startPosition;
    const { x: regionX, y: regionY } = state.region;
    
    let startRow = state.lastPosition.y || 0;
    let startCol = state.lastPosition.x || 0;
    
    outerLoop:
    for (let y = startRow; y < height; y++) {
      for (let x = (y === startRow ? startCol : 0); x < width; x++) {
        if (state.stopFlag) {
          state.lastPosition = { x, y };
          break outerLoop;
        }
        
        const idx = (y * width + x) * 4;
        const rgb = [pixels[idx], pixels[idx + 1], pixels[idx + 2]];
        const alpha = pixels[idx + 3];
        
        if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue;
        
        const colorId = findClosestColor(rgb, state.availableColors);
        
        if (state.currentCharges < 1) {
          updateUI(`⌛ ${state.language === 'pt' ? 'Sem cargas. Aguardando' : 'No charges. Waiting'} ${Utils.formatTime(state.cooldown)}...`, 'warning');
          await Utils.sleep(state.cooldown);
          
          const chargeUpdate = await WPlaceService.getCharges();
          state.currentCharges = chargeUpdate.charges;
          state.cooldown = chargeUpdate.cooldown;
        }
        
        const pixelX = startX + x;
        const pixelY = startY + y;
        
        const success = await WPlaceService.paintPixelInRegion(
          regionX,
          regionY,
          pixelX,
          pixelY,
          colorId
        );
        
        if (success) {
          state.paintedPixels++;
          state.currentCharges--;
          
          if (state.paintedPixels % CONFIG.LOG_INTERVAL === 0) {
            updateStats();
            updateUI(`🧱 ${state.language === 'pt' ? 'Progresso' : 'Progress'}: ${state.paintedPixels}/${state.totalPixels} ${state.language === 'pt' ? 'pixels...' : 'pixels...'}`, 'default');
          }
        }
      }
    }
    
    if (state.stopFlag) {
      updateUI(`⏹️ ${t.paintingStopped}`, 'warning');
    } else {
      updateUI(`✅ ${t.paintingComplete} ${state.paintedPixels} ${state.language === 'pt' ? 'pixels pintados.' : 'pixels painted.'}`, 'success');
      state.lastPosition = { x: 0, y: 0 };
    }
    
    updateStats();
  }

  await detectUserLanguage();
  createUI();
})();
