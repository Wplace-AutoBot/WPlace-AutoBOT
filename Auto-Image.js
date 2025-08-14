(async () => {
  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    THEME: {
      primary: "#000000",
      secondary: "#111111",
      accent: "#222222",
      text: "#ffffff",
      highlight: "#775ce3",
      success: "#00ff00",
      error: "#ff0000",
      warning: "#ffaa00",
    },
  };

  // BILINGUAL TEXT STRINGS
  const TEXTS = {
    pt: {
      title: "WPlace Auto-Image",
      initBot: "Iniciar Auto-BOT",
      uploadImage: "Upload da Imagem",
      resizeImage: "Redimensionar Imagem",
      selectPosition: "Selecionar Posição",
      startPainting: "Iniciar Pintura",
      stopPainting: "Parar Pintura",
      checkingColors: "🔍 Verificando cores disponíveis...",
      noColorsFound: "❌ Abra a paleta de cores no site e tente novamente!",
      colorsFound: "✅ {count} cores disponíveis encontradas",
      loadingImage: "🖼️ Carregando imagem...",
      imageLoaded: "✅ Imagem carregada com {count} pixels válidos",
      imageError: "❌ Erro ao carregar imagem",
      selectPositionAlert:
        "Pinte o primeiro pixel na localização onde deseja que a arte comece!",
      waitingPosition: "👆 Aguardando você pintar o pixel de referência...",
      positionSet: "✅ Posição definida com sucesso!",
      positionTimeout: "❌ Tempo esgotado para selecionar posição",
      startPaintingMsg: "🎨 Iniciando pintura...",
      paintingProgress: "🧱 Progresso: {painted}/{total} pixels...",
      noCharges: "⌛ Sem cargas. Aguardando {time}...",
      paintingStopped: "⏹️ Pintura interrompida pelo usuário",
      paintingComplete: "✅ Pintura concluída! {count} pixels pintados.",
      paintingError: "❌ Erro durante a pintura",
      missingRequirements:
        "❌ Carregue uma imagem e selecione uma posição primeiro",
      progress: "Progresso",
      pixels: "Pixels",
      charges: "Cargas",
      estimatedTime: "Tempo estimado",
      initMessage: "Clique em 'Iniciar Auto-BOT' para começar",
      waitingInit: "Aguardando inicialização...",
      resizeSuccess: "✅ Imagem redimensionada para {width}x{height}",
      paintingPaused: "⏸️ Pintura pausada na posição X: {x}, Y: {y}",
      captchaNeeded:
        "❗ Token CAPTCHA necessário. Pinte um pixel manualmente para continuar.",
      saveData: "Salvar Progresso",
      loadData: "Carregar Progresso",
      saveToFile: "Salvar em Arquivo",
      loadFromFile: "Carregar de Arquivo", 
      dataManager: "Dados",
      autoSaved: "✅ Progresso salvo automaticamente",
      dataLoaded: "✅ Progresso carregado com sucesso",
      fileSaved: "✅ Salvo em arquivo com sucesso",
      fileLoaded: "✅ Carregado de arquivo com sucesso",
      noSavedData: "❌ Nenhum progresso salvo encontrado",
      savedDataFound: "✅ Progresso salvo encontrado! Carregar para continuar?",
      savedDate: "Salvo em: {date}",
      clickLoadToContinue: "Clique em 'Carregar Progresso' para continuar.",
      fileError: "❌ Erro ao processar arquivo",
      invalidFileFormat: "❌ Formato de arquivo inválido",
    },
    en: {
      title: "WPlace Auto-Image",
      initBot: "Start Auto-BOT",
      uploadImage: "Upload Image",
      resizeImage: "Resize Image",
      selectPosition: "Select Position",
      startPainting: "Start Painting",
      stopPainting: "Stop Painting",
      checkingColors: "🔍 Checking available colors...",
      noColorsFound: "❌ Open the color palette on the site and try again!",
      colorsFound: "✅ {count} available colors found",
      loadingImage: "🖼️ Loading image...",
      imageLoaded: "✅ Image loaded with {count} valid pixels",
      imageError: "❌ Error loading image",
      selectPositionAlert:
        "Paint the first pixel at the location where you want the art to start!",
      waitingPosition: "👆 Waiting for you to paint the reference pixel...",
      positionSet: "✅ Position set successfully!",
      positionTimeout: "❌ Timeout for position selection",
      startPaintingMsg: "🎨 Starting painting...",
      paintingProgress: "🧱 Progress: {painted}/{total} pixels...",
      noCharges: "⌛ No charges. Waiting {time}...",
      paintingStopped: "⏹️ Painting stopped by user",
      paintingComplete: "✅ Painting complete! {count} pixels painted.",
      paintingError: "❌ Error during painting",
      missingRequirements: "❌ Load an image and select a position first",
      progress: "Progress",
      pixels: "Pixels",
      charges: "Charges",
      estimatedTime: "Estimated time",
      initMessage: "Click 'Start Auto-BOT' to begin",
      waitingInit: "Waiting for initialization...",
      resizeSuccess: "✅ Image resized to {width}x{height}",
      paintingPaused: "⏸️ Painting paused at position X: {x}, Y: {y}",
      captchaNeeded:
        "❗ CAPTCHA token needed. Paint one pixel manually to continue.",
      saveData: "Save Progress",
      loadData: "Load Progress",
      saveToFile: "Save to File",
      loadFromFile: "Load from File",
      dataManager: "Data Manager",
      autoSaved: "✅ Progress saved automatically", 
      dataLoaded: "✅ Progress loaded successfully",
      fileSaved: "✅ Progress saved to file successfully",
      fileLoaded: "✅ Progress loaded from file successfully",
      noSavedData: "❌ No saved progress found",
      savedDataFound: "✅ Saved progress found! Load to continue?",
      savedDate: "Saved on: {date}",
      clickLoadToContinue: "Click 'Load Progress' to continue.",
      fileError: "❌ Error processing file",
      invalidFileFormat: "❌ Invalid file format",
    },
  };

  // GLOBAL STATE
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
    estimatedTime: 0,
    language: "en",
  };

  // Global variable to store the captured CAPTCHA token.
  let capturedCaptchaToken = null;

  // Intercept the original window.fetch function to "listen" for network requests.
  const originalFetch = window.fetch;
  window.fetch = async (url, options) => {
    // Check if the request is for painting a pixel on wplace.
    if (
      typeof url === "string" &&
      url.includes("https://backend.wplace.live/s0/pixel/")
    ) {
      try {
        const payload = JSON.parse(options.body);
        // If the request body contains the 't' field, it's our CAPTCHA token.
        if (payload.t) {
          console.log("✅ CAPTCHA Token Captured:", payload.t);
          // Store the token for our bot to use.
          capturedCaptchaToken = payload.t;
          
          // Notify the user that the token is captured and they can start the bot.
          if (
            document
              .querySelector("#statusText")
              ?.textContent.includes("CAPTCHA")
          ) {
            Utils.showAlert(
              "Token captured successfully! You can start the bot now.",
              "success"
            );
            updateUI("colorsFound", "success", {
              count: state.availableColors.length,
            });
          }
        }
      } catch (e) {
        /* Ignore errors if the request body isn't valid JSON */
      }
    }
    // Finally, execute the original request, whether we inspected it or not.
    return originalFetch(url, options);
  };

  async function detectLanguage() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      state.language = data.country === "BR" ? "pt" : "en";
    } catch {
      state.language = "en";
    }
  }

  // UTILITY FUNCTIONS
  const Utils = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

    colorDistance: (a, b) =>
      Math.sqrt(
        Math.pow(a[0] - b[0], 2) +
          Math.pow(a[1] - b[1], 2) +
          Math.pow(a[2] - b[2], 2)
      ),

    createImageUploader: () =>
      new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpeg";
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
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
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

    extractAvailableColors: () => {
      const colorElements = document.querySelectorAll('[id^="color-"]');
      return Array.from(colorElements)
        .filter((el) => !el.querySelector("svg"))
        .filter((el) => {
          const id = parseInt(el.id.replace("color-", ""));
          return id !== 0 && id !== 5;
        })
        .map((el) => {
          const id = parseInt(el.id.replace("color-", ""));
          const rgbStr = el.style.backgroundColor.match(/\d+/g);
          const rgb = rgbStr ? rgbStr.map(Number) : [0, 0, 0];
          return { id, rgb };
        });
    },

    formatTime: (ms) => {
      const seconds = Math.floor((ms / 1000) % 60);
      const minutes = Math.floor((ms / (1000 * 60)) % 60);
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
      const days = Math.floor(ms / (1000 * 60 * 60 * 24));

      let result = "";
      if (days > 0) result += `${days}d `;
      if (hours > 0 || days > 0) result += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `;
      result += `${seconds}s`;

      return result;
    },

    // Save/Load Progress Functions
    saveProgress: () => {
      try {
        const progressData = {
          version: "1.0",
          timestamp: Date.now(),
          state: {
            imageLoaded: state.imageLoaded,
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            paintedMap: state.paintedMap,
            imageData: state.imageData,
            availableColors: state.availableColors,
            colorsChecked: state.colorsChecked,
            language: state.language
          }
        };
        
        localStorage.setItem('wplace-auto-image-progress', JSON.stringify(progressData));
        console.log('✅ Progress saved successfully');
        return true;
      } catch (error) {
        console.error('❌ Error saving progress:', error);
        return false;
      }
    },

    saveProgressToFile: () => {
      try {
        const progressData = {
          timestamp: Date.now(),
          version: "1.0",
          appName: "WPlace Auto-Image",
          state: {
            imageLoaded: state.imageLoaded,
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            paintedMap: state.paintedMap,
            imageData: state.imageData,
            availableColors: state.availableColors,
            language: state.language
          }
        };
        
        const filename = `wplace-progress-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        const dataString = JSON.stringify(progressData, null, 2);
        Utils.createFileDownloader(dataString, filename);
        
        console.log('✅ Progress saved to file');
        return true;
      } catch (error) {
        console.error('❌ Error saving progress to file:', error);
        return false;
      }
    },

    loadProgress: () => {
      try {
        const savedData = localStorage.getItem('wplace-auto-image-progress');
        if (!savedData) {
          return null;
        }
        
        const progressData = JSON.parse(savedData);
        
        // Validate data structure
        if (!progressData.version || !progressData.state) {
          return null;
        }
        
        return progressData;
      } catch (error) {
        console.error('❌ Error loading progress:', error);
        return null;
      }
    },

    restoreProgress: (progressData) => {
      try {
        const savedState = progressData.state;
        
        // Restore state
        state.imageLoaded = savedState.imageLoaded;
        state.totalPixels = savedState.totalPixels;
        state.paintedPixels = savedState.paintedPixels;
        state.lastPosition = savedState.lastPosition || { x: 0, y: 0 };
        state.startPosition = savedState.startPosition;
        state.region = savedState.region;
        state.paintedMap = savedState.paintedMap;
        state.imageData = savedState.imageData;
        state.availableColors = savedState.availableColors;
        state.language = savedState.language;
        state.colorsChecked = savedState.availableColors && savedState.availableColors.length > 0;
        
        // Update UI to reflect restored state
        if (state.imageLoaded) {
          const initBotBtn = document.querySelector("#initBotBtn");
          const uploadBtn = document.querySelector("#uploadBtn");
          const resizeBtn = document.querySelector("#resizeBtn");
          const selectPosBtn = document.querySelector("#selectPosBtn");
          const startBtn = document.querySelector("#startBtn");
          const saveBtn = document.querySelector("#saveBtn");
          const progressBar = document.querySelector("#progressBar");
          
          // Show/hide appropriate buttons based on state
          if (state.colorsChecked) {
            initBotBtn.style.display = "none";
            uploadBtn.disabled = false;
            selectPosBtn.disabled = false;
          } else {
            initBotBtn.style.display = "block";
            uploadBtn.disabled = true;
            selectPosBtn.disabled = true;
          }
          
          resizeBtn.disabled = false;
          saveBtn.disabled = false;
          
          if (state.startPosition && state.region) {
            selectPosBtn.disabled = false;
            startBtn.disabled = false;
          }
          
          // Update progress bar
          const progress = state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
          progressBar.style.width = `${progress}%`;
          
          // Update status message based on progress
          if (state.paintedPixels > 0) {
            if (state.lastPosition.x > 0 || state.lastPosition.y > 0) {
              updateUI("paintingPaused", "warning", { 
                x: state.lastPosition.x, 
                y: state.lastPosition.y 
              });
            } else {
              updateUI("paintingProgress", "default", {
                painted: state.paintedPixels,
                total: state.totalPixels,
              });
            }
          } else {
            updateUI("imageLoaded", "success", { count: state.totalPixels });
          }
        }
        
        // Update stats to show current progress
        updateStats();
        updateDataButtons();
        return true;
      } catch (error) {
        console.error('❌ Error restoring progress:', error);
        return false;
      }
    },

    clearProgress: () => {
      try {
        localStorage.removeItem('wplace-auto-image-progress');
        console.log('✅ Progress data cleared');
        return true;
      } catch (error) {
        console.error('❌ Error clearing progress:', error);
        return false;
      }
    },

    hasSavedProgress: () => {
      return localStorage.getItem('wplace-auto-image-progress') !== null;
    },

    saveProgressToFile: () => {
      try {
        updateUI("default", "default", {});
        
        const progressData = {
          timestamp: Date.now(),
          version: "1.0",
          appName: "WPlace Auto-Image",
          state: {
            imageLoaded: state.imageLoaded,
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            paintedMap: state.paintedMap,
            imageData: state.imageData,
            availableColors: state.availableColors,
            language: state.language
          }
        };
        
        const filename = `wplace-progress-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        const dataString = JSON.stringify(progressData, null, 2);
        Utils.createFileDownloader(dataString, filename);
        
        console.log('✅ Progress saved to file');
        return true;
      } catch (error) {
        console.error('❌ Error saving progress to file:', error);
        return false;
      }
    },

    loadProgressFromFile: async () => {
      try {
        updateUI("default", "default", {});
        
        const fileData = await Utils.createFileUploader();
        
        // Validate file format
        if (!fileData.state || !fileData.timestamp) {
          throw new Error('Invalid file format - missing required fields');
        }
        
        if (!fileData.appName || fileData.appName !== "WPlace Auto-Image") {
          throw new Error('Invalid file format - not a WPlace Auto-Image file');
        }
        
        const savedState = fileData.state;
        
        // Restore state
        state.imageLoaded = savedState.imageLoaded;
        state.totalPixels = savedState.totalPixels;
        state.paintedPixels = savedState.paintedPixels;
        state.lastPosition = savedState.lastPosition || { x: 0, y: 0 };
        state.startPosition = savedState.startPosition;
        state.region = savedState.region;
        state.paintedMap = savedState.paintedMap;
        state.imageData = savedState.imageData;
        state.availableColors = savedState.availableColors;
        state.language = savedState.language;
        state.colorsChecked = savedState.availableColors && savedState.availableColors.length > 0;
        
        // Update UI to reflect restored state
        if (state.imageLoaded) {
          const initBotBtn = document.querySelector("#initBotBtn");
          const uploadBtn = document.querySelector("#uploadBtn");
          const resizeBtn = document.querySelector("#resizeBtn");
          const selectPosBtn = document.querySelector("#selectPosBtn");
          const startBtn = document.querySelector("#startBtn");
          const saveBtn = document.querySelector("#saveBtn");
          const progressBar = document.querySelector("#progressBar");
          
          // Show/hide appropriate buttons based on state
          if (state.colorsChecked) {
            initBotBtn.style.display = "none";
            uploadBtn.disabled = false;
            selectPosBtn.disabled = false;
          } else {
            initBotBtn.style.display = "block";
            uploadBtn.disabled = true;
            selectPosBtn.disabled = true;
          }
          
          resizeBtn.disabled = false;
          saveBtn.disabled = false;
          
          if (state.startPosition && state.region) {
            selectPosBtn.disabled = false;
            startBtn.disabled = false;
          }
          
          // Update progress bar
          const progress = state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
          progressBar.style.width = `${progress}%`;
          
          // Update status message based on progress
          if (state.paintedPixels > 0) {
            if (state.lastPosition.x > 0 || state.lastPosition.y > 0) {
              updateUI("paintingPaused", "warning", { 
                x: state.lastPosition.x, 
                y: state.lastPosition.y 
              });
            } else {
              updateUI("paintingProgress", "default", {
                painted: state.paintedPixels,
                total: state.totalPixels,
              });
            }
          } else {
            updateUI("imageLoaded", "success", { count: state.totalPixels });
          }
        }
        
        // Update stats to show current progress
        updateStats();
        updateDataButtons();
        console.log('✅ Progress loaded from file');
        return true;
      } catch (error) {
        console.error('❌ Error loading progress from file:', error);
        return false;
      }
    },

    showAlert: (message, type = "info") => {
      const alert = document.createElement("div");
      alert.style.position = "fixed";
      alert.style.top = "20px";
      alert.style.left = "50%";
      alert.style.transform = "translateX(-50%)";
      alert.style.padding = "15px 20px";
      alert.style.background = CONFIG.THEME[type] || CONFIG.THEME.accent;
      alert.style.color = CONFIG.THEME.text;
      alert.style.borderRadius = "5px";
      alert.style.zIndex = "10000";
      alert.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";
      alert.style.display = "flex";
      alert.style.alignItems = "center";
      alert.style.gap = "10px";

      const icons = {
        error: "exclamation-circle",
        success: "check-circle",
        warning: "exclamation-triangle",
        info: "info-circle",
      };

      alert.innerHTML = `
        <i class="fas fa-${icons[type] || "info-circle"}"></i>
        <span>${message}</span>
      `;

      document.body.appendChild(alert);

      setTimeout(() => {
        alert.style.opacity = "0";
        alert.style.transition = "opacity 0.5s";
        setTimeout(() => alert.remove(), 500);
      }, 3000);
    },

    calculateEstimatedTime: (remainingPixels, currentCharges, cooldown) => {
      const pixelsPerCharge = currentCharges > 0 ? currentCharges : 0;
      const fullCycles = Math.ceil(
        (remainingPixels - pixelsPerCharge) / Math.max(currentCharges, 1)
      );
      return fullCycles * cooldown + (remainingPixels - 1) * 100;
    },

    isWhitePixel: (r, g, b) => {
      return (
        r >= CONFIG.WHITE_THRESHOLD &&
        g >= CONFIG.WHITE_THRESHOLD &&
        b >= CONFIG.WHITE_THRESHOLD
      );
    },

    t: (key, params = {}) => {
      let text = TEXTS[state.language][key] || TEXTS.en[key] || key;
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, v);
      }
      return text;
    },
  };

  // WPLACE API SERVICE
  const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
      try {
        // Construct the payload including the captured 't' token.
        const payload = {
          coords: [pixelX, pixelY],
          colors: [color],
          t: capturedCaptchaToken,
        };
        const res = await fetch(
          `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
          {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        // If we get a 403 Forbidden error, our token is likely expired.
        if (res.status === 403) {
          console.error(
            "❌ 403 Forbidden. CAPTCHA token might be invalid or expired."
          );
          capturedCaptchaToken = null; // Invalidate our stored token.
          return "token_error"; // Return a special status to stop the bot.
        }

        const data = await res.json();
        return data?.painted === 1;
      } catch (e) {
        console.error("Paint request failed:", e);
        return false;
      }
    },

    async getCharges() {
      try {
        const res = await fetch("https://backend.wplace.live/me", {
          credentials: "include",
        });
        const data = await res.json();
        return {
          charges: data.charges?.count || 0,
          cooldown: data.charges?.cooldownMs || CONFIG.COOLDOWN_DEFAULT,
        };
      } catch {
        return { charges: 0, cooldown: CONFIG.COOLDOWN_DEFAULT };
      }
    },
  };

  class ImageProcessor {
    constructor(imageSrc) {
      this.imageSrc = imageSrc;
      this.img = new Image();
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.previewCanvas = document.createElement("canvas");
      this.previewCtx = this.previewCanvas.getContext("2d");
    }

    async load() {
      return new Promise((resolve, reject) => {
        this.img.onload = () => {
          this.canvas.width = this.img.width;
          this.canvas.height = this.img.height;
          this.ctx.drawImage(this.img, 0, 0);
          resolve();
        };
        this.img.onerror = reject;
        this.img.src = this.imageSrc;
      });
    }

    getPixelData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        .data;
    }

    getDimensions() {
      return { width: this.canvas.width, height: this.canvas.height };
    }

    resize(newWidth, newHeight) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.drawImage(this.img, 0, 0, newWidth, newHeight);

      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.ctx.drawImage(tempCanvas, 0, 0);

      return this.getPixelData();
    }

    generatePreview(newWidth, newHeight) {
      this.previewCanvas.width = newWidth;
      this.previewCanvas.height = newHeight;
      this.previewCtx.imageSmoothingEnabled = false;
      this.previewCtx.drawImage(this.img, 0, 0, newWidth, newHeight);
      return this.previewCanvas.toDataURL();
    }
  }

  function findClosestColor(rgb, palette) {
    return palette.reduce(
      (closest, current) => {
        const currentDistance = Utils.colorDistance(rgb, current.rgb);
        return currentDistance < closest.distance
          ? { color: current, distance: currentDistance }
          : closest;
      },
      { color: palette[0], distance: Utils.colorDistance(rgb, palette[0].rgb) }
    ).color.id;
  }

  async function createUI() {
    await detectLanguage();

    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fontAwesome);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
      }
      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      #wplace-image-bot-container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 280px;
        max-height: calc(100vh - 40px);
        background: linear-gradient(135deg, ${CONFIG.THEME.primary} 0%, #1a1a1a 100%);
        border: 1px solid ${CONFIG.THEME.accent};
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
        z-index: 9998;
        font-family: 'Segoe UI', Roboto, sans-serif;
        color: ${CONFIG.THEME.text};
        animation: slideIn 0.4s ease-out;
        overflow: hidden;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        user-select: none;
      }
      #wplace-image-bot-container.wplace-dragging {
        transition: none;
        box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.2);
        transform: scale(1.02);
        z-index: 9999;
      }
      #wplace-image-bot-container.wplace-minimized {
        width: 200px;
        height: auto;
      }
      #wplace-image-bot-container.wplace-compact {
        width: 240px;
      }
      #wplace-image-bot-container.wplace-compact .wplace-content {
        padding: 12px;
      }
      #wplace-image-bot-container.wplace-compact .wplace-tab {
        padding: 8px 10px;
        font-size: 10px;
      }
      #wplace-image-bot-container.wplace-compact .wplace-btn {
        padding: 6px 12px;
        font-size: 11px;
        gap: 4px;
      }
      #wplace-image-bot-container.wplace-compact .wplace-stats {
        padding: 8px;
      }
      #wplace-image-bot-container.wplace-compact .wplace-stat-item {
        font-size: 11px;
        padding: 4px 0;
      }
      
      /* Stats Container */
      #wplace-stats-container {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 280px;
        max-height: calc(100vh - 40px);
        background: linear-gradient(135deg, ${CONFIG.THEME.primary} 0%, #1a1a1a 100%);
        border: 1px solid ${CONFIG.THEME.accent};
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
        z-index: 9997;
        font-family: 'Segoe UI', Roboto, sans-serif;
        color: ${CONFIG.THEME.text};
        animation: slideIn 0.4s ease-out;
        overflow: hidden;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        user-select: none;
      }
      #wplace-stats-container.wplace-dragging {
        transition: none;
        box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.2);
        transform: scale(1.02);
        z-index: 9999;
      }
      .wplace-header {
        padding: 8px 12px;
        background: linear-gradient(135deg, ${CONFIG.THEME.secondary} 0%, #2a2a2a 100%);
        color: ${CONFIG.THEME.highlight};
        font-size: 13px;
        font-weight: 700;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        transition: background 0.2s ease;
      }
      .wplace-header:hover {
        background: linear-gradient(135deg, ${CONFIG.THEME.secondary} 10%, #3a3a3a 100%);
      }
      .wplace-header:active {
        background: linear-gradient(135deg, ${CONFIG.THEME.secondary} 20%, #4a4a4a 100%);
        cursor: grabbing;
      }
      .wplace-header-title {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .wplace-header-controls {
        display: flex;
        gap: 6px;
      }
      .wplace-header-btn {
        background: rgba(255,255,255,0.1);
        border: none;
        color: ${CONFIG.THEME.text};
        cursor: pointer;
        border-radius: 4px;
        width: 18px;
        height: 18px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .wplace-header-btn:hover {
        background: ${CONFIG.THEME.accent};
        transform: scale(1.1);
      }
      .wplace-content {
        padding: 12px;
        display: block;
      }
      .wplace-content.wplace-hidden {
        display: none;
      }
      .wplace-status-section {
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(255,255,255,0.03);
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-section {
        margin-bottom: 12px;
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-section-title {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${CONFIG.THEME.highlight};
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .wplace-section {
        margin-bottom: 12px;
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-section-title {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${CONFIG.THEME.highlight};
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .wplace-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wplace-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .wplace-row.single {
        grid-template-columns: 1fr;
      }
      .wplace-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 11px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, ${CONFIG.THEME.accent} 0%, #4a4a4a 100%);
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.5s ease;
      }
      .wplace-btn:hover:not(:disabled)::before {
        left: 100%;
      }
      .wplace-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
      .wplace-btn:active:not(:disabled) {
        transform: translateY(0);
      }
      .wplace-btn-primary {
        background: linear-gradient(135deg, ${CONFIG.THEME.accent} 0%, #6a5acd 100%);
        color: white;
      }
      .wplace-btn-upload {
        background: linear-gradient(135deg, ${CONFIG.THEME.secondary} 0%, #4a4a4a 100%);
        color: white;
        border: 1px dashed ${CONFIG.THEME.highlight};
      }
      .wplace-btn-start {
        background: linear-gradient(135deg, ${CONFIG.THEME.success} 0%, #228b22 100%);
        color: white;
      }
      .wplace-btn-stop {
        background: linear-gradient(135deg, ${CONFIG.THEME.error} 0%, #dc143c 100%);
        color: white;
      }
      .wplace-btn-select {
        background: linear-gradient(135deg, ${CONFIG.THEME.highlight} 0%, #9370db 100%);
        color: white;
      }
      .wplace-btn-file {
        background: linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%);
        color: white;
      }
      .wplace-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
      }
      .wplace-btn:disabled::before {
        display: none;
      }
      .wplace-stats {
        background: rgba(255,255,255,0.03);
        padding: 8px;
        border-radius: 6px;
        margin-bottom: 8px;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-stat-item {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        font-size: 11px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .wplace-stat-item:last-child {
        border-bottom: none;
      }
      .wplace-stat-label {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.9;
        font-size: 10px;
      }
      .wplace-stat-value {
        font-weight: 600;
        color: ${CONFIG.THEME.highlight};
      }
      .wplace-progress {
        width: 100%;
        background: rgba(0,0,0,0.3);
        border-radius: 4px;
        margin: 8px 0;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
      }
      .wplace-progress-bar {
        height: 6px;
        background: linear-gradient(135deg, ${CONFIG.THEME.highlight} 0%, #9370db 100%);
        transition: width 0.5s ease;
        position: relative;
      }
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .wplace-status {
        padding: 6px;
        border-radius: 4px;
        text-align: center;
        font-size: 11px;
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
      .resize-container {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${CONFIG.THEME.primary};
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
      }
      .resize-preview {
        max-width: 100%;
        max-height: 300px;
        margin: 10px 0;
        border: 1px solid ${CONFIG.THEME.accent};
      }
      .resize-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
      }
      .resize-slider {
        width: 100%;
      }
      .resize-buttons {
        display: flex;
        gap: 10px;
      }
      .resize-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
        display: none;
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.id = "wplace-image-bot-container";
    container.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="statsBtn" class="wplace-header-btn" title="Show Stats">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="Compact Mode">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t(
            "minimize"
          )}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${Utils.t("waitingInit")}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Setup Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🤖 Bot Setup</div>
          <div class="wplace-controls">
            <button id="initBotBtn" class="wplace-btn wplace-btn-primary">
              <i class="fas fa-robot"></i>
              <span>${Utils.t("initBot")}</span>
            </button>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🖼️ Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled>
                <i class="fas fa-upload"></i>
                <span>${Utils.t("uploadImage")}</span>
              </button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${Utils.t("resizeImage")}</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${Utils.t("selectPosition")}</span>
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
                <span>${Utils.t("startPainting")}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${Utils.t("stopPainting")}</span>
              </button>
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
                <span>${Utils.t("saveData")}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary">
                <i class="fas fa-folder-open"></i>
                <span>${Utils.t("loadData")}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${Utils.t("saveToFile")}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file">
                <i class="fas fa-upload"></i>
                <span>${Utils.t("loadFromFile")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Stats Window - Separate UI
    const statsContainer = document.createElement("div");
    statsContainer.id = "wplace-stats-container";
    statsContainer.style.display = "none";
    statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>Painting Stats</span>
        </div>
        <div class="wplace-header-controls">
          <button id="closeStatsBtn" class="wplace-header-btn" title="Close Stats">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t(
                "initMessage"
              )}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const resizeContainer = document.createElement("div");
    resizeContainer.className = "resize-container";
    resizeContainer.innerHTML = `
      <h3 style="margin-top: 0; color: ${CONFIG.THEME.text}">${Utils.t(
      "resizeImage"
    )}</h3>
      <div class="resize-controls">
        <label style="color: ${CONFIG.THEME.text}">
          ${Utils.t("width")}: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="color: ${CONFIG.THEME.text}">
          ${Utils.t("height")}: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="color: ${CONFIG.THEME.text}">
          <input type="checkbox" id="keepAspect" checked>
          ${Utils.t("keepAspect")}
        </label>
        <img id="resizePreview" class="resize-preview" src="">
        <div class="resize-buttons">
          <button id="confirmResize" class="wplace-btn wplace-btn-primary">
            <i class="fas fa-check"></i>
            <span>${Utils.t("apply")}</span>
          </button>
          <button id="cancelResize" class="wplace-btn wplace-btn-stop">
            <i class="fas fa-times"></i>
            <span>${Utils.t("cancel")}</span>
          </button>
        </div>
      </div>
    `;

    const resizeOverlay = document.createElement("div");
    resizeOverlay.className = "resize-overlay";

    document.body.appendChild(container);
    document.body.appendChild(resizeOverlay);
    document.body.appendChild(resizeContainer);
    document.body.appendChild(statsContainer);

    // Query all UI elements after appending to DOM
    const initBotBtn = container.querySelector("#initBotBtn");
    const uploadBtn = container.querySelector("#uploadBtn");
    const resizeBtn = container.querySelector("#resizeBtn");
    const selectPosBtn = container.querySelector("#selectPosBtn");
    const startBtn = container.querySelector("#startBtn");
    const stopBtn = container.querySelector("#stopBtn");
    const saveBtn = container.querySelector("#saveBtn");
    const loadBtn = container.querySelector("#loadBtn");
    const saveToFileBtn = container.querySelector("#saveToFileBtn");
    const loadFromFileBtn = container.querySelector("#loadFromFileBtn");
    const minimizeBtn = container.querySelector("#minimizeBtn");
    const compactBtn = container.querySelector("#compactBtn");
    const statsBtn = container.querySelector("#statsBtn");
    const statusText = container.querySelector("#statusText");
    const progressBar = container.querySelector("#progressBar");
    const statsArea = statsContainer.querySelector("#statsArea");
    const content = container.querySelector(".wplace-content");
    const closeStatsBtn = statsContainer.querySelector("#closeStatsBtn");

    // Check if all elements are found
    if (!initBotBtn || !uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
      console.error("Some UI elements not found:", {
        initBotBtn: !!initBotBtn,
        uploadBtn: !!uploadBtn,
        selectPosBtn: !!selectPosBtn,
        startBtn: !!startBtn,
        stopBtn: !!stopBtn
      });
    }

    if (!statsContainer || !statsArea || !closeStatsBtn) {
      console.error("Stats UI elements not found:", {
        statsContainer: !!statsContainer,
        statsArea: !!statsArea,
        closeStatsBtn: !!closeStatsBtn
      });
    }

    const header = container.querySelector(".wplace-header");
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.closest(".wplace-header-btn")) return;

      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      container.classList.add("wplace-dragging");
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      
      // Prevent text selection during drag
      document.body.style.userSelect = "none";
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      let newTop = container.offsetTop - pos2;
      let newLeft = container.offsetLeft - pos1;
      
      // Boundary checking to keep UI within viewport
      const rect = container.getBoundingClientRect();
      const maxTop = window.innerHeight - rect.height;
      const maxLeft = window.innerWidth - rect.width;
      
      newTop = Math.max(0, Math.min(newTop, maxTop));
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      
      container.style.top = newTop + "px";
      container.style.left = newLeft + "px";
    }

    function closeDragElement() {
      container.classList.remove("wplace-dragging");
      document.onmouseup = null;
      document.onmousemove = null;
      document.body.style.userSelect = "";
    }

    function makeDraggable(element) {
      let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      const header = element.querySelector(".wplace-header");
      header.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        if (e.target.closest(".wplace-header-btn")) return;

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.classList.add("wplace-dragging");
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        
        // Prevent text selection during drag
        document.body.style.userSelect = "none";
      }

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;
        
        // Boundary checking to keep UI within viewport
        const rect = element.getBoundingClientRect();
        const maxTop = window.innerHeight - rect.height;
        const maxLeft = window.innerWidth - rect.width;
        
        newTop = Math.max(0, Math.min(newTop, maxTop));
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
      }

      function closeDragElement() {
        element.classList.remove("wplace-dragging");
        document.onmouseup = null;
        document.onmousemove = null;
        document.body.style.userSelect = "";
      }
    }

    // Make stats container draggable
    makeDraggable(statsContainer);
    
    // Make main container draggable
    makeDraggable(container);

    // Stats window functionality
    if (statsBtn && closeStatsBtn) {
      statsBtn.addEventListener("click", () => {
        const isVisible = statsContainer.style.display !== "none";
        if (isVisible) {
          statsContainer.style.display = "none";
          statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
          statsBtn.title = "Show Stats";
        } else {
          statsContainer.style.display = "block";
          statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
          statsBtn.title = "Hide Stats";
        }
      });

      closeStatsBtn.addEventListener("click", () => {
        statsContainer.style.display = "none";
        statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
        statsBtn.title = "Show Stats";
      });
    }

    const widthSlider = resizeContainer.querySelector("#widthSlider");
    const heightSlider = resizeContainer.querySelector("#heightSlider");
    const widthValue = resizeContainer.querySelector("#widthValue");
    const heightValue = resizeContainer.querySelector("#heightValue");
    const keepAspect = resizeContainer.querySelector("#keepAspect");
    const resizePreview = resizeContainer.querySelector("#resizePreview");
    const confirmResize = resizeContainer.querySelector("#confirmResize");
    const cancelResize = resizeContainer.querySelector("#cancelResize");

    // Compact mode functionality
    if (compactBtn) {
      compactBtn.addEventListener("click", () => {
        container.classList.toggle("wplace-compact");
        const isCompact = container.classList.contains("wplace-compact");
        
        if (isCompact) {
          compactBtn.innerHTML = '<i class="fas fa-expand"></i>';
          compactBtn.title = "Expand Mode";
        } else {
          compactBtn.innerHTML = '<i class="fas fa-compress"></i>';
          compactBtn.title = "Compact Mode";
        }
      });
    }

    // Minimize functionality
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        state.minimized = !state.minimized;
        if (state.minimized) {
          container.classList.add("wplace-minimized");
          content.classList.add("wplace-hidden");
          minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
          minimizeBtn.title = "Restore";
        } else {
          container.classList.remove("wplace-minimized");
          content.classList.remove("wplace-hidden");
          minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
          minimizeBtn.title = "Minimize";
        }
      });
    }

    // Save progress functionality
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        if (!state.imageLoaded) {
          Utils.showAlert(Utils.t("missingRequirements"), "error");
          return;
        }
        
        const success = Utils.saveProgress();
        if (success) {
          updateUI("autoSaved", "success");
          Utils.showAlert(Utils.t("autoSaved"), "success");
        } else {
          Utils.showAlert("❌ Erro ao salvar progresso", "error");
        }
      });
    }

    // Load progress functionality
    if (loadBtn) {
      loadBtn.addEventListener("click", () => {
        const savedData = Utils.loadProgress();
        if (!savedData) {
          updateUI("noSavedData", "warning");
          Utils.showAlert(Utils.t("noSavedData"), "warning");
          return;
        }
        
        // Show confirmation dialog
        const confirmLoad = confirm(
          `${Utils.t("savedDataFound")}\n\n` +
          `Saved: ${new Date(savedData.timestamp).toLocaleString()}\n` +
          `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`
        );
        
        if (confirmLoad) {
          const success = Utils.restoreProgress(savedData);
          if (success) {
            updateUI("dataLoaded", "success");
            Utils.showAlert(Utils.t("dataLoaded"), "success");
            updateDataButtons();
            
            if (!state.colorsChecked) {
              initBotBtn.style.display = "block";
            }
            
            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              startBtn.disabled = false;
            }
          } else {
            Utils.showAlert("❌ Erro ao carregar progresso", "error");
          }
        }
      });
    }

    // Save to file functionality
    if (saveToFileBtn) {
      saveToFileBtn.addEventListener("click", () => {
        const success = Utils.saveProgressToFile();
        if (success) {
          updateUI("fileSaved", "success");
          Utils.showAlert(Utils.t("fileSaved"), "success");
        } else {
          Utils.showAlert(Utils.t("fileError"), "error");
        }
      });
    }

    // Load from file functionality
    if (loadFromFileBtn) {
      loadFromFileBtn.addEventListener("click", async () => {
        try {
          const success = await Utils.loadProgressFromFile();
          if (success) {
            updateUI("fileLoaded", "success");
            Utils.showAlert(Utils.t("fileLoaded"), "success");
            updateDataButtons();
            
            // Auto-enable buttons after loading from file
            if (state.colorsChecked) {
              uploadBtn.disabled = false;
              selectPosBtn.disabled = false;
              resizeBtn.disabled = false;
              initBotBtn.style.display = "none";
            } else {
              initBotBtn.style.display = "block";
            }
            
            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              startBtn.disabled = false;
            }
          }
        } catch (error) {
          if (error.message === 'Invalid JSON file') {
            Utils.showAlert(Utils.t("invalidFileFormat"), "error");
          } else {
            Utils.showAlert(Utils.t("fileError"), "error");
          }
        }
      });
    }

    window.updateUI = (messageKey, type = "default", params = {}) => {
      const message = Utils.t(messageKey, params);
      statusText.textContent = message;
      statusText.className = `wplace-status status-${type}`;
      statusText.style.animation = "none";
      void statusText.offsetWidth;
      statusText.style.animation = "slideIn 0.3s ease-out";
    };

    window.updateStats = async () => {
      if (!state.colorsChecked || !state.imageLoaded) return;

      const { charges, cooldown } = await WPlaceService.getCharges();
      state.currentCharges = Math.floor(charges);
      state.cooldown = cooldown;

      const progress =
        state.totalPixels > 0
          ? Math.round((state.paintedPixels / state.totalPixels) * 100)
          : 0;
      const remainingPixels = state.totalPixels - state.paintedPixels;

      state.estimatedTime = Utils.calculateEstimatedTime(
        remainingPixels,
        state.currentCharges,
        state.cooldown
      );

      progressBar.style.width = `${progress}%`;

      statsArea.innerHTML = `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t(
            "progress"
          )}</div>
          <div class="wplace-stat-value">${progress}%</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t(
            "pixels"
          )}</div>
          <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${Utils.t(
            "charges"
          )}</div>
          <div class="wplace-stat-value">${Math.floor(state.currentCharges)}</div>
        </div>
        ${
          state.imageLoaded
            ? `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t(
            "estimatedTime"
          )}</div>
          <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
        </div>
        `
            : ""
        }
      `;
    };

    // Helper function to update data management buttons
    window.updateDataButtons = () => {
      const hasImageData = state.imageLoaded && state.imageData;
      saveBtn.disabled = !hasImageData;
      saveToFileBtn.disabled = !hasImageData;
    };

    // Initialize data buttons state
    updateDataButtons();

    function showResizeDialog(processor) {
      const { width, height } = processor.getDimensions();
      const aspectRatio = width / height;

      widthSlider.value = width;
      heightSlider.value = height;
      widthValue.textContent = width;
      heightValue.textContent = height;
      resizePreview.src = processor.img.src;

      resizeOverlay.style.display = "block";
      resizeContainer.style.display = "block";

      const updatePreview = () => {
        const newWidth = parseInt(widthSlider.value);
        const newHeight = parseInt(heightSlider.value);

        widthValue.textContent = newWidth;
        heightValue.textContent = newHeight;

        resizePreview.src = processor.generatePreview(newWidth, newHeight);
      };

      widthSlider.addEventListener("input", () => {
        if (keepAspect.checked) {
          const newWidth = parseInt(widthSlider.value);
          const newHeight = Math.round(newWidth / aspectRatio);
          heightSlider.value = newHeight;
        }
        updatePreview();
      });

      heightSlider.addEventListener("input", () => {
        if (keepAspect.checked) {
          const newHeight = parseInt(heightSlider.value);
          const newWidth = Math.round(newHeight * aspectRatio);
          widthSlider.value = newWidth;
        }
        updatePreview();
      });

      confirmResize.onclick = () => {
        const newWidth = parseInt(widthSlider.value);
        const newHeight = parseInt(heightSlider.value);

        const newPixels = processor.resize(newWidth, newHeight);

        let totalValidPixels = 0;
        for (let y = 0; y < newHeight; y++) {
          for (let x = 0; x < newWidth; x++) {
            const idx = (y * newWidth + x) * 4;
            const r = newPixels[idx];
            const g = newPixels[idx + 1];
            const b = newPixels[idx + 2];
            const alpha = newPixels[idx + 3];

            if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue;
            if (Utils.isWhitePixel(r, g, b)) continue;

            totalValidPixels++;
          }
        }

        state.imageData.pixels = newPixels;
        state.imageData.width = newWidth;
        state.imageData.height = newHeight;
        state.imageData.totalPixels = totalValidPixels;
        state.totalPixels = totalValidPixels;
        state.paintedPixels = 0;

        updateStats();
        updateUI("resizeSuccess", "success", {
          width: newWidth,
          height: newHeight,
        });

        closeResizeDialog();
      };

      cancelResize.onclick = closeResizeDialog;
    }

    function closeResizeDialog() {
      resizeOverlay.style.display = "none";
      resizeContainer.style.display = "none";
    }

    if (initBotBtn) {
      initBotBtn.addEventListener("click", async () => {
        try {
          updateUI("checkingColors", "default");

          state.availableColors = Utils.extractAvailableColors();

          if (state.availableColors.length === 0) {
            Utils.showAlert(Utils.t("noColorsFound"), "error");
            updateUI("noColorsFound", "error");
            return;
          }

          state.colorsChecked = true;
          uploadBtn.disabled = false;
          selectPosBtn.disabled = false;
          initBotBtn.style.display = "none";

          updateUI("colorsFound", "success", {
            count: state.availableColors.length,
          });
          updateStats();
        } catch {
          updateUI("imageError", "error");
        }
      });
    }

    if (uploadBtn) {
      uploadBtn.addEventListener("click", async () => {
        try {
          updateUI("loadingImage", "default");
          const imageSrc = await Utils.createImageUploader();

          const processor = new ImageProcessor(imageSrc);
          await processor.load();

          const { width, height } = processor.getDimensions();
          const pixels = processor.getPixelData();

        let totalValidPixels = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const alpha = pixels[idx + 3];

            if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue;
            if (Utils.isWhitePixel(r, g, b)) continue;

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

        resizeBtn.disabled = false;
        saveBtn.disabled = false;

        if (state.startPosition) {
          startBtn.disabled = false;
        }

          updateStats();
          updateDataButtons();
          updateUI("imageLoaded", "success", { count: totalValidPixels });
        } catch {
          updateUI("imageError", "error");
        }
      });
    }

    if (resizeBtn) {
      resizeBtn.addEventListener("click", () => {
        if (state.imageLoaded && state.imageData.processor) {
          showResizeDialog(state.imageData.processor);
        }
      });
    }

    if (selectPosBtn) {
      selectPosBtn.addEventListener("click", async () => {
        if (state.selectingPosition) return;

        state.selectingPosition = true;
        state.startPosition = null;
        state.region = null;
        startBtn.disabled = true;

        Utils.showAlert(Utils.t("selectPositionAlert"), "info");
        updateUI("waitingPosition", "default");

        const originalFetch = window.fetch;

        window.fetch = async (url, options) => {
          if (
            typeof url === "string" &&
            url.includes("https://backend.wplace.live/s0/pixel/") &&
            options?.method?.toUpperCase() === "POST"
          ) {
            try {
              const response = await originalFetch(url, options);
              const clonedResponse = response.clone();
              const data = await clonedResponse.json();

              if (data?.painted === 1) {
              const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/);
              if (regionMatch && regionMatch.length >= 3) {
                state.region = {
                  x: parseInt(regionMatch[1]),
                  y: parseInt(regionMatch[2]),
                };
              }

              const payload = JSON.parse(options.body);
              if (payload?.coords && Array.isArray(payload.coords)) {
                state.startPosition = {
                  x: payload.coords[0],
                  y: payload.coords[1],
                };
                state.lastPosition = { x: 0, y: 0 };

                if (state.imageLoaded) {
                  startBtn.disabled = false;
                }

                window.fetch = originalFetch;
                state.selectingPosition = false;
                updateUI("positionSet", "success");
              }
            }

            return response;
          } catch {
            return originalFetch(url, options);
          }
        }
        return originalFetch(url, options);
      };

        setTimeout(() => {
          if (state.selectingPosition) {
            window.fetch = originalFetch;
            state.selectingPosition = false;
            updateUI("positionTimeout", "error");
            Utils.showAlert(Utils.t("positionTimeout"), "error");
          }
        }, 120000);
      });
    }

    // Function to start painting (can be called programmatically)
    async function startPainting() {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI("missingRequirements", "error");
        return false;
      }
      if (!capturedCaptchaToken) {
        updateUI("captchaNeeded", "error");
        Utils.showAlert(Utils.t("captchaNeeded"), "error");
        return false;
      }

      state.running = true;
      state.stopFlag = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      uploadBtn.disabled = true;
      selectPosBtn.disabled = true;
      resizeBtn.disabled = true;
      saveBtn.disabled = true;

      updateUI("startPaintingMsg", "success");

      try {
        await processImage();
        return true;
      } catch {
        updateUI("paintingError", "error");
        return false;
      } finally {
        state.running = false;
        stopBtn.disabled = true;
        saveBtn.disabled = false;

        if (!state.stopFlag) {
          startBtn.disabled = true;
          uploadBtn.disabled = false;
          selectPosBtn.disabled = false;
          resizeBtn.disabled = false;
        } else {
          startBtn.disabled = false;
        }
      }
    }

    if (startBtn) {
      startBtn.addEventListener("click", startPainting);
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        state.stopFlag = true;
        state.running = false;
        stopBtn.disabled = true;
        updateUI("paintingStopped", "warning");
        
        // Auto save when stopping
        if (state.imageLoaded && state.paintedPixels > 0) {
          Utils.saveProgress();
          Utils.showAlert(Utils.t("autoSaved"), "success");
        }
      });
    }

    // Check for saved progress on startup
    const checkSavedProgress = () => {
      const savedData = Utils.loadProgress();
      if (savedData && savedData.state.paintedPixels > 0) {
        const savedDate = new Date(savedData.timestamp).toLocaleString();
        const progress = Math.round((savedData.state.paintedPixels / savedData.state.totalPixels) * 100);
        
        Utils.showAlert(
          `${Utils.t("savedDataFound")}\n\n` +
          `Saved: ${savedDate}\n` +
          `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
          `${Utils.t("clickLoadToContinue")}`,
          "info"
        );
      }
    };
    
    // Check for saved progress after a short delay to let UI settle
    setTimeout(checkSavedProgress, 1000);
  }

  async function processImage() {
    const { width, height, pixels } = state.imageData;
    const { x: startX, y: startY } = state.startPosition;
    const { x: regionX, y: regionY } = state.region;

    let startRow = state.lastPosition.y || 0;
    let startCol = state.lastPosition.x || 0;

    if (!state.paintedMap) {
      state.paintedMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false));
    }

    let pixelBatch = [];

    try {
      outerLoop: for (let y = startRow; y < height; y++) {
        for (let x = y === startRow ? startCol : 0; x < width; x++) {
          if (state.stopFlag) {
            if (pixelBatch.length > 0) {
              await sendPixelBatch(pixelBatch, regionX, regionY);
            }
            state.lastPosition = { x, y };
            updateUI("paintingPaused", "warning", { x, y });
            break outerLoop;
          }

          if (state.paintedMap[y][x]) continue;

          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const alpha = pixels[idx + 3];

          if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue;
          if (Utils.isWhitePixel(r, g, b)) continue;

          const rgb = [r, g, b];
          const colorId = findClosestColor(rgb, state.availableColors);
          const pixelX = startX + x;
          const pixelY = startY + y;

          pixelBatch.push({
            x: pixelX,
            y: pixelY,
            color: colorId,
            localX: x,
            localY: y,
          });

          if (pixelBatch.length >= Math.floor(state.currentCharges)) {
            const success = await sendPixelBatch(pixelBatch, regionX, regionY);

            if (success === "token_error") {
              state.stopFlag = true;
              updateUI("captchaNeeded", "error");
              Utils.showAlert(Utils.t("captchaNeeded"), "error");
              break outerLoop;
            }

            if (success) {
              pixelBatch.forEach((pixel) => {
                state.paintedMap[pixel.localY][pixel.localX] = true;
                state.paintedPixels++;
              });

              state.currentCharges -= pixelBatch.length;
              updateStats();
              updateUI("paintingProgress", "default", {
                painted: state.paintedPixels,
                total: state.totalPixels,
              });
              
              // Auto-save progress every 50 pixels
              if (state.paintedPixels % 50 === 0) {
                Utils.saveProgress();
              }
            }

            pixelBatch = [];

            if (state.currentCharges < 1) {
              updateUI("noCharges", "warning", {
                time: Utils.formatTime(state.cooldown),
              });
              await Utils.sleep(state.cooldown);

              const chargeUpdate = await WPlaceService.getCharges();
              state.currentCharges = chargeUpdate.charges;
              state.cooldown = chargeUpdate.cooldown;
            }
          }
        }
      }

      if (pixelBatch.length > 0 && !state.stopFlag) {
        const success = await sendPixelBatch(pixelBatch, regionX, regionY);
        if (success) {
          pixelBatch.forEach((pixel) => {
            state.paintedMap[pixel.localY][pixel.localX] = true;
            state.paintedPixels++;
          });
          state.currentCharges -= pixelBatch.length;
        }
      }
    } finally {
      if (window._chargesInterval) clearInterval(window._chargesInterval);
      window._chargesInterval = null;
    }

    if (state.stopFlag) {
      updateUI("paintingStopped", "warning");
      // Save progress when stopped
      Utils.saveProgress();
    } else {
      updateUI("paintingComplete", "success", { count: state.paintedPixels });
      state.lastPosition = { x: 0, y: 0 };
      state.paintedMap = null;
      // Clear saved data when completed
      Utils.clearProgress();
    }

    updateStats();
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
    if (!capturedCaptchaToken) {
      return "token_error";
    }

    const coords = [];
    const colors = [];

    pixelBatch.forEach((pixel) => {
      coords.push(pixel.x, pixel.y);
      colors.push(pixel.color);
    });

    try {
      const payload = {
        coords: coords,
        colors: colors,
        t: capturedCaptchaToken,
      };

      const res = await fetch(
        `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
        {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 403) {
        console.error(
          "❌ 403 Forbidden. CAPTCHA token might be invalid or expired."
        );
        capturedCaptchaToken = null;
        return "token_error";
      }

      const data = await res.json();
      return data?.painted === pixelBatch.length;
    } catch (e) {
      console.error("Batch paint request failed:", e);
      return false;
    }
  }

  createUI();
})();