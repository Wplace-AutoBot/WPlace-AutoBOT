;(async () => {
  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    THEMES: {  
      "Classic Autobot": {
        primary: "#000000",
        secondary: "#111111",
        accent: "#222222",
        text: "#ffffff",
        highlight: "#775ce3",
        success: "#00ff00",
        error: "#ff0000",
        warning: "#ffaa00",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: "12px",
        borderStyle: "solid",
        borderWidth: "1px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        animations: {
          glow: false,
          scanline: false,
          pixelBlink: false,
        },
      },
      "Neon Retro": {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        text: "#00ff41",
        highlight: "#ff6b35",
        success: "#39ff14",
        error: "#ff073a",
        warning: "#ffff00",
        neon: "#00ffff",
        purple: "#bf00ff",
        pink: "#ff1493",
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: "0",
        borderStyle: "solid",
        borderWidth: "3px",
        boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)",
        backdropFilter: "none",
        animations: {
          glow: true,
          scanline: true,
          pixelBlink: true,
        },
      },
    },
    currentTheme: "Classic Autobot",
  }

  const getCurrentTheme = () => CONFIG.THEMES[CONFIG.currentTheme]

  const switchTheme = (themeName) => {
    if (CONFIG.THEMES[themeName]) {
      CONFIG.currentTheme = themeName
      saveThemePreference()

      // Remove existing theme styles
      const existingStyle = document.querySelector('style[data-wplace-theme="true"]')
      if (existingStyle) {
        existingStyle.remove()
      }

      // Recreate UI with new theme
      const existingContainer = document.getElementById("wplace-image-bot-container")
      const existingStats = document.getElementById("wplace-stats-container")
      if (existingContainer) existingContainer.remove()
      if (existingStats) existingStats.remove()

      createUI()
    }
  }

  const saveThemePreference = () => {
    try {
      localStorage.setItem("wplace-theme", CONFIG.currentTheme)
    } catch (e) {
      console.warn("Could not save theme preference:", e)
    }
  }

  const loadThemePreference = () => {
    try {
      const saved = localStorage.getItem("wplace-theme")
      if (saved && CONFIG.THEMES[saved]) {
        CONFIG.currentTheme = saved
      }
    } catch (e) {
      console.warn("Could not load theme preference:", e)
    }
  }

  // BILINGUAL TEXT STRINGS
  const TEXT = {
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
    selectPositionAlert: "Paint the first pixel at the location where you want the art to start!",
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
    captchaNeeded: "❗ CAPTCHA token needed. Paint one pixel manually to continue.",
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
    selectPositionAlert: "Pinte o primeiro pixel na localização onde deseja que a arte comece!",
    waitingPosition: "👆 Aguardando você pintar o pixel de referência...",
    positionSet: "✅ Posição definida com sucesso!",
    positionTimeout: "❌ Tempo esgotado para selecionar posição",
    startPaintingMsg: "🎨 Iniciando pintura...",
    paintingProgress: "🧱 Progresso: {painted}/{total} pixels...",
    noCharges: "⌛ Sem cargas. Aguardando {time}...",
    paintingStopped: "⏹️ Pintura interrompida pelo usuário",
    paintingComplete: "✅ Pintura concluída! {count} pixels pintados.",
    paintingError: "❌ Erro durante a pintura",
    missingRequirements: "❌ Carregue uma imagem e selecione uma posição primeiro",
    progress: "Progresso",
    pixels: "Pixels",
    charges: "Cargas",
    estimatedTime: "Tempo estimado",
    initMessage: "Clique em 'Iniciar Auto-BOT' para começar",
    waitingInit: "Aguardando inicialização...",
    resizeSuccess: "✅ Imagem redimensionada para {width}x{height}",
    paintingPaused: "⏸️ Pintura pausada na posição X: {x}, Y: {y}",
    captchaNeeded: "❗ Token CAPTCHA necessário. Pinte um pixel manualmente para continuar.",
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
  }

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
    autoRefresh: true,
    pausedForManual: false,
  }

  // Global variable to store the captured CAPTCHA token.
  let capturedCaptchaToken = null

  // Intercept the original window.fetch function to "listen" for network requests.
  const originalFetch = window.fetch
  window.fetch = async (url, options = {}) => {
    if (typeof url === "string" && url.includes("/s0/pixel/")) {
      try {
        const payload = JSON.parse(options.body || '{}')
        if (payload.t) {
          console.log("✅ CAPTCHA Token Captured:", payload.t)
          capturedCaptchaToken = payload.t
          if (state.pausedForManual) {
            state.pausedForManual = false
            state.running = true
            updateUI("paintingProgress", "success", { painted: state.paintedPixels, total: state.totalPixels })
            Utils.showAlert("🚀 Painting resumed!", "success")
            startPainting()
          }
          if (document.querySelector("#statusText")?.textContent.includes("CAPTCHA")) {
            Utils.showAlert("Token captured successfully! You can start the bot now.", "success")
            updateUI("colorsFound", "success", { count: state.availableColors.length })
          }
        }
      } catch {}
    }
    return originalFetch(url, options)
  }

  // LANGUAGE DETECTION
  async function detectLanguage() {
    try {
      const response = await fetch("https://backend.wplace.live/me", {
        credentials: "include",
      })
      const data = await response.json()
      state.language = data.language === "pt" ? "pt" : "en"
    } catch {
      state.language = navigator.language.startsWith("pt") ? "pt" : "en"
    }
  }

  // UTILITY FUNCTIONS
  const Utils = {
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

    t: (key, params = {}) => {
      let text = TEXT[state.language]?.[key] || TEXT.en[key] || key
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param])
      })
      return text
    },

    showAlert: (message, type = "info") => {
      const alertDiv = document.createElement("div")
      alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10001;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease-out;
        font-family: 'Segoe UI', sans-serif;
      `

      const colors = {
        info: "background: linear-gradient(135deg, #3498db, #2980b9);",
        success: "background: linear-gradient(135deg, #27ae60, #229954);",
        warning: "background: linear-gradient(135deg, #f39c12, #e67e22);",
        error: "background: linear-gradient(135deg, #e74c3c, #c0392b);",
      }

      alertDiv.style.cssText += colors[type] || colors.info

      const style = document.createElement("style")
      style.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `
      document.head.appendChild(style)

      alertDiv.textContent = message
      document.body.appendChild(alertDiv)

      setTimeout(() => {
        alertDiv.style.animation = "slideDown 0.3s ease-out reverse"
        setTimeout(() => {
          document.body.removeChild(alertDiv)
          document.head.removeChild(style)
        }, 300)
      }, 4000)
    },

    colorDistance: (a, b) => Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)),

    isWhitePixel: (r, g, b) =>
      r >= CONFIG.WHITE_THRESHOLD && g >= CONFIG.WHITE_THRESHOLD && b >= CONFIG.WHITE_THRESHOLD,

    createImageUploader: () =>
      new Promise((resolve) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/png,image/jpeg"
        input.onchange = () => {
          const fr = new FileReader()
          fr.onload = () => resolve(fr.result)
          fr.readAsDataURL(input.files[0])
        }
        input.click()
      }),

    createFileDownloader: (data, filename) => {
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },

    createFileUploader: () =>
      new Promise((resolve, reject) => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"
        input.onchange = (e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const data = JSON.parse(reader.result)
                resolve(data)
              } catch (error) {
                reject(new Error("Invalid JSON file"))
              }
            }
            reader.onerror = () => reject(new Error("File reading error"))
            reader.readAsText(file)
          } else {
            reject(new Error("No file selected"))
          }
        }
        input.click()
      }),

    extractAvailableColors: () => {
      const colorElements = document.querySelectorAll('[id^="color-"]')
      return Array.from(colorElements)
        .filter((el) => !el.querySelector("svg"))
        .filter((el) => {
          const id = Number.parseInt(el.id.replace("color-", ""))
          return id !== 0 && id !== 5
        })
        .map((el) => {
          const id = Number.parseInt(el.id.replace("color-", ""))
          const rgbStr = el.style.backgroundColor.match(/\d+/g)
          const rgb = rgbStr ? rgbStr.map(Number) : [0, 0, 0]
          return { id, rgb }
        })
    },

    formatTime: (ms) => {
      const seconds = Math.floor((ms / 1000) % 60)
      const minutes = Math.floor((ms / (1000 * 60)) % 60)
      const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
      const days = Math.floor(ms / (1000 * 60 * 60 * 24))

      let result = ""
      if (days > 0) result += `${days}d `
      if (hours > 0 || days > 0) result += `${hours}h `
      if (minutes > 0 || hours > 0 || days > 0) result += `${minutes}m `
      result += `${seconds}s`

      return result
    },

    calculateEstimatedTime: (remainingPixels, charges, cooldown) => {
      if (remainingPixels <= 0) return 0
      const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1))
      return cyclesNeeded * cooldown
    },

    // Save/Load Progress Functions
    saveProgress: () => {
      try {
        const progressData = {
          timestamp: Date.now(),
          state: {
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            imageLoaded: state.imageLoaded,
            colorsChecked: state.colorsChecked,
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
          paintedMap: state.paintedMap ? state.paintedMap.map((row) => Array.from(row)) : null,
        }

        localStorage.setItem("wplace-bot-progress", JSON.stringify(progressData))
        return true
      } catch (error) {
        console.error("Error saving progress:", error)
        return false
      }
    },

    loadProgress: () => {
      try {
        const saved = localStorage.getItem("wplace-bot-progress")
        return saved ? JSON.parse(saved) : null
      } catch (error) {
        console.error("Error loading progress:", error)
        return null
      }
    },

    clearProgress: () => {
      try {
        localStorage.removeItem("wplace-bot-progress")
        return true
      } catch (error) {
        console.error("Error clearing progress:", error)
        return false
      }
    },

    restoreProgress: (savedData) => {
      try {
        // Restore state
        Object.assign(state, savedData.state)

        // Restore image data
        if (savedData.imageData) {
          state.imageData = {
            ...savedData.imageData,
            pixels: new Uint8ClampedArray(savedData.imageData.pixels),
          }
        }

        // Restore painted map
        if (savedData.paintedMap) {
          state.paintedMap = savedData.paintedMap.map((row) => Array.from(row))
        }

        return true
      } catch (error) {
        console.error("Error restoring progress:", error)
        return false
      }
    },

    saveProgressToFile: () => {
      try {
        const progressData = {
          timestamp: Date.now(),
          version: "1.0",
          state: {
            totalPixels: state.totalPixels,
            paintedPixels: state.paintedPixels,
            lastPosition: state.lastPosition,
            startPosition: state.startPosition,
            region: state.region,
            imageLoaded: state.imageLoaded,
            colorsChecked: state.colorsChecked,
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
          paintedMap: state.paintedMap ? state.paintedMap.map((row) => Array.from(row)) : null,
        }

        const filename = `wplace-bot-progress-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
        Utils.createFileDownloader(JSON.stringify(progressData, null, 2), filename)
        return true
      } catch (error) {
        console.error("Error saving to file:", error)
        return false
      }
    },

    loadProgressFromFile: async () => {
      try {
        const data = await Utils.createFileUploader()

        if (!data.version || !data.state) {
          throw new Error("Invalid file format")
        }

        const success = Utils.restoreProgress(data)
        return success
      } catch (error) {
        console.error("Error loading from file:", error)
        throw error
      }
    },
  }

  // IMAGE PROCESSOR CLASS
  class ImageProcessor {
    constructor(imageSrc) {
      this.imageSrc = imageSrc
      this.img = null
      this.canvas = null
      this.ctx = null
    }

    async load() {
      return new Promise((resolve, reject) => {
        this.img = new Image()
        this.img.crossOrigin = "anonymous"
        this.img.onload = () => {
          this.canvas = document.createElement("canvas")
          this.ctx = this.canvas.getContext("2d")
          this.canvas.width = this.img.width
          this.canvas.height = this.img.height
          this.ctx.drawImage(this.img, 0, 0)
          resolve()
        }
        this.img.onerror = reject
        this.img.src = this.imageSrc
      })
    }

    getDimensions() {
      return {
        width: this.canvas.width,
        height: this.canvas.height,
      }
    }

    getPixelData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
    }

    resize(newWidth, newHeight) {
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")

      tempCanvas.width = newWidth
      tempCanvas.height = newHeight

      tempCtx.imageSmoothingEnabled = false
      tempCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight)

      this.canvas.width = newWidth
      this.canvas.height = newHeight
      this.ctx.imageSmoothingEnabled = false
      this.ctx.drawImage(tempCanvas, 0, 0)

      return this.ctx.getImageData(0, 0, newWidth, newHeight).data
    }

    generatePreview(width, height) {
      const previewCanvas = document.createElement("canvas")
      const previewCtx = previewCanvas.getContext("2d")

      previewCanvas.width = width
      previewCanvas.height = height

      previewCtx.imageSmoothingEnabled = false
      previewCtx.drawImage(this.img, 0, 0, width, height)

      return previewCanvas.toDataURL()
    }
  }

  // WPLACE API SERVICE
  const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
      try {
        // Construct the payload including the captured 't' token.
        const payload = {
          coords: [pixelX, pixelY],
          colors: [color],
          t: capturedCaptchaToken,
        }
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify(payload),
        })

        // If we get a 403 Forbidden error, our token is likely expired.
        if (res.status === 403) {
          console.error("❌ 403 Forbidden. CAPTCHA token might be invalid or expired.")
          capturedCaptchaToken = null // Invalidate our stored token.
          return "token_error" // Return a special status to stop the bot.
        }

        const data = await res.json()
        return data?.painted === 1
      } catch (e) {
        console.error("Paint request failed:", e)
        return false
      }
    },

    async getCharges() {
      try {
        const res = await fetch("https://backend.wplace.live/me", {
          credentials: "include",
        })
        const data = await res.json()
        return {
          charges: data.charges?.count || 0,
          cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
        }
      } catch (e) {
        console.error("Failed to get charges:", e)
        return {
          charges: 0,
          cooldown: CONFIG.COOLDOWN_DEFAULT,
        }
      }
    },
  }

  // COLOR MATCHING FUNCTION
  function findClosestColor(targetRgb, availableColors) {
    let minDistance = Number.POSITIVE_INFINITY
    let closestColorId = availableColors[0]?.id || 1

    for (const color of availableColors) {
      const distance = Utils.colorDistance(targetRgb, color.rgb)
      if (distance < minDistance) {
        minDistance = distance
        closestColorId = color.id
      }
    }

    return closestColorId
  }

  // UI UPDATE FUNCTIONS (declared early to avoid reference errors)
  let updateUI = () => {}
  let updateStats = () => {}
  let updateDataButtons = () => {}

  const createThemePopup = () => {
    // Remove existing popup if it exists
    const existingPopup = document.getElementById("theme-popup")
    if (existingPopup) {
      existingPopup.remove()
      return
    }

    const popup = document.createElement("div")
    popup.id = "theme-popup"
    popup.style.cssText = `
      position: fixed;
      top: 60px;
      right: 20px;
      background: ${getCurrentTheme().secondary};
      border: ${getCurrentTheme().borderWidth} ${getCurrentTheme().borderStyle} ${getCurrentTheme().accent};
      border-radius: ${getCurrentTheme().borderRadius};
      box-shadow: ${getCurrentTheme().boxShadow};
      backdrop-filter: ${getCurrentTheme().backdropFilter};
      z-index: 10001;
      min-width: 200px;
      padding: 10px 0;
      font-family: ${getCurrentTheme().fontFamily};
    `

    Object.keys(CONFIG.THEMES).forEach((themeName) => {
      const themeOption = document.createElement("div")
      themeOption.style.cssText = `
        padding: 10px 20px;
        color: ${themeName === CONFIG.currentTheme ? getCurrentTheme().highlight : getCurrentTheme().text};
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s ease;
        background: ${themeName === CONFIG.currentTheme ? getCurrentTheme().accent : "transparent"};
      `
      themeOption.textContent = themeName

      themeOption.addEventListener("mouseenter", () => {
        if (themeName !== CONFIG.currentTheme) {
          themeOption.style.background = getCurrentTheme().accent
          themeOption.style.color = getCurrentTheme().highlight
        }
      })

      themeOption.addEventListener("mouseleave", () => {
        if (themeName !== CONFIG.currentTheme) {
          themeOption.style.background = "transparent"
          themeOption.style.color = getCurrentTheme().text
        }
      })

      themeOption.addEventListener("click", () => {
        switchTheme(themeName)
        popup.remove()
      })

      popup.appendChild(themeOption)
    })

    document.body.appendChild(popup)

    // Close popup when clicking outside
    const closePopup = (e) => {
      if (!popup.contains(e.target) && !e.target.closest("#themeBtn")) {
        popup.remove()
        document.removeEventListener("click", closePopup)
      }
    }

    setTimeout(() => {
      document.addEventListener("click", closePopup)
    }, 100)
  }

  async function createUI() {
    await detectLanguage()

    loadThemePreference()

    const theme = getCurrentTheme()

    const fontAwesome = document.createElement("link")
    fontAwesome.rel = "stylesheet"
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    document.head.appendChild(fontAwesome)

    if (theme.fontFamily.includes("Press Start 2P")) {
      const googleFonts = document.createElement("link")
      googleFonts.rel = "stylesheet"
      googleFonts.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
      document.head.appendChild(googleFonts)
    }

    const style = document.createElement("style")
    style.setAttribute("data-wplace-theme", "true")

    style.textContent = `
      ${
        theme.animations.glow
          ? `
      @keyframes neonGlow {
        0%, 100% { 
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
        }
        50% { 
          text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor;
        }
      }`
          : ""
      }
      
      ${
        theme.animations.pixelBlink
          ? `
      @keyframes pixelBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.7; }
      }`
          : ""
      }
      
      ${
        theme.animations.scanline
          ? `
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400px); }
      }`
          : ""
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
      }
      @keyframes slideIn {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      #wplace-image-bot-container {
        position: fixed;
        top: 20px;
        right: 20px;
        width: ${CONFIG.currentTheme === "Neon Retro" ? "320px" : "280px"};
        max-height: calc(100vh - 40px);
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)`
            : theme.primary
        };
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius};
        padding: 0;
        box-shadow: ${theme.boxShadow};
        z-index: 9998;
        font-family: ${theme.fontFamily};
        color: ${theme.text};
        animation: slideIn 0.4s ease-out;
        overflow: hidden;
        ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      
      ${
        theme.animations.scanline
          ? `
      #wplace-image-bot-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, ${theme.neon}, transparent);
        animation: scanline 3s linear infinite;
        z-index: 1;
        pointer-events: none;
      }`
          : ""
      }
      
      ${
        CONFIG.currentTheme === "Neon Retro"
          ? `
      #wplace-image-bot-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.03) 2px,
            rgba(0, 255, 65, 0.03) 4px
          );
        pointer-events: none;
        z-index: 1;
      }`
          : ""
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
      
      /* Stats Container */
      #wplace-stats-container {
        position: fixed;
        top: 20px;
        left: 20px;
        width: ${CONFIG.currentTheme === "Neon Retro" ? "320px" : "280px"};
        max-height: calc(100vh - 40px);
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)`
            : theme.primary
        };
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius};
        padding: 0;
        box-shadow: ${theme.boxShadow};
        z-index: 9997;
        font-family: ${theme.fontFamily};
        color: ${theme.text};
        animation: slideIn 0.4s ease-out;
        overflow: hidden;
        ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      
      .wplace-header {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px 15px" : "8px 12px"};
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.secondary} 0%, #2a2a2a 100%)`
            : theme.secondary
        };
        color: ${theme.highlight};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "10px" : "13px"};
        font-weight: ${CONFIG.currentTheme === "Neon Retro" ? "normal" : "700"};
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
        border-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "2px" : "1px"} solid ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.text};
        ${CONFIG.currentTheme === "Classic Autobot" ? "text-shadow: 0 1px 2px rgba(0,0,0,0.5);" : "text-transform: uppercase; letter-spacing: 1px;"}
        transition: background 0.2s ease;
        position: relative;
        z-index: 2;
        ${theme.animations.glow ? "animation: neonGlow 2s ease-in-out infinite alternate;" : ""}
      }
      
      .wplace-header-title {
        display: flex;
        align-items: center;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "6px"};
      }
      
      .wplace-header-controls {
        display: flex;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "10px" : "6px"};
      }
      
      .wplace-header-btn {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.accent};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "none"};
        color: ${theme.text};
        cursor: pointer;
        border-radius: ${CONFIG.currentTheme === "Classic Autobot" ? "4px" : "0"};
        width: ${CONFIG.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        height: ${CONFIG.currentTheme === "Classic Autobot" ? "18px" : "auto"};
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "4px 6px" : "0"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "10px"};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-family: ${theme.fontFamily};
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      .wplace-header-btn:hover {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.text : theme.primary};
        transform: ${CONFIG.currentTheme === "Classic Autobot" ? "scale(1.1)" : "none"};
        ${CONFIG.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${theme.text};` : ""}
      }
      
      .wplace-content {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "15px" : "12px"};
        display: block;
        position: relative;
        z-index: 2;
      }
      .wplace-content.wplace-hidden {
        display: none;
      }
      
      .wplace-status-section {
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(255,255,255,0.03);
        border-radius: ${theme.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .wplace-section {
        margin-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "15px" : "12px"};
        padding: 12px;
        background: rgba(255,255,255,0.03);
        border-radius: ${theme.borderRadius};
        border: 1px solid rgba(255,255,255,0.1);
      }
      
      .wplace-section-title {
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${theme.highlight};
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
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px 8px" : "8px 12px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? "2px solid" : "none"};
        border-radius: ${theme.borderRadius};
        font-weight: ${CONFIG.currentTheme === "Neon Retro" ? "normal" : "500"};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "6px"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-family: ${theme.fontFamily};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px; image-rendering: pixelated;" : ""}
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.accent} 0%, #4a4a4a 100%)`
            : theme.accent
        };
        ${CONFIG.currentTheme === "Classic Autobot" ? "border: 1px solid rgba(255,255,255,0.1);" : ""}
      }
      
      ${
        CONFIG.currentTheme === "Classic Autobot"
          ? `
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
      }`
          : `
      .wplace-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      .wplace-btn:hover::before {
        left: 100%;
      }`
      }
      
      .wplace-btn:hover:not(:disabled) {
        transform: ${CONFIG.currentTheme === "Classic Autobot" ? "translateY(-1px)" : "none"};
        box-shadow: ${
          CONFIG.currentTheme === "Classic Autobot" ? "0 4px 12px rgba(0,0,0,0.4)" : "0 0 15px currentColor"
        };
        ${theme.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .wplace-btn:active:not(:disabled) {
        transform: translateY(0);
      }
      
      .wplace-btn-primary {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.accent} 0%, #6a5acd 100%)`
            : theme.accent
        };
        color: ${theme.text};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.text};` : ""}
      }
      .wplace-btn-upload {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.secondary} 0%, #4a4a4a 100%)`
            : theme.purple
        };
        color: ${theme.text};
        ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `border: 1px dashed ${theme.highlight};`
            : `border-color: ${theme.text}; border-style: dashed;`
        }
      }
      .wplace-btn-start {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.success} 0%, #228b22 100%)`
            : theme.success
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.success};` : ""}
      }
      .wplace-btn-stop {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.error} 0%, #dc143c 100%)`
            : theme.error
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.text};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.error};` : ""}
      }
      .wplace-btn-select {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%)`
            : theme.highlight
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.highlight};` : ""}
      }
      .wplace-btn-file {
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? "linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%)"
            : theme.warning
        };
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "white" : theme.primary};
        ${CONFIG.currentTheme === "Neon Retro" ? `border-color: ${theme.warning};` : ""}
      }
      .wplace-btn:disabled {
        opacity: ${CONFIG.currentTheme === "Classic Autobot" ? "0.5" : "0.3"};
        cursor: not-allowed;
        transform: none !important;
        ${theme.animations.pixelBlink ? "animation: none !important;" : ""}
        box-shadow: none !important;
      }
      .wplace-btn:disabled::before {
        display: none;
      }
      
      .wplace-stats {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.03)" : theme.secondary};
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "8px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${theme.borderRadius};
        margin-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "15px" : "8px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.1);" : ""}
      }
      
      .wplace-stat-item {
        display: flex;
        justify-content: space-between;
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "6px 0" : "4px 0"};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        border-bottom: 1px solid rgba(255,255,255,0.05);
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
      }
      .wplace-stat-item:last-child {
        border-bottom: none;
      }
      .wplace-stat-label {
        display: flex;
        align-items: center;
        gap: 6px;
        opacity: 0.9;
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "10px"};
      }
      .wplace-stat-value {
        font-weight: 600;
        color: ${theme.highlight};
      }
      
      .wplace-progress {
        width: 100%;
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(0,0,0,0.3)" : theme.secondary};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "1px solid rgba(255,255,255,0.1)"};
        border-radius: ${theme.borderRadius};
        margin: ${CONFIG.currentTheme === "Neon Retro" ? "10px 0" : "8px 0"};
        overflow: hidden;
        height: ${CONFIG.currentTheme === "Neon Retro" ? "16px" : "6px"};
        position: relative;
      }
      
      ${
        CONFIG.currentTheme === "Neon Retro"
          ? `
      .wplace-progress::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 65, 0.1) 2px,
            rgba(0, 255, 65, 0.1) 4px
          );
        pointer-events: none;
      }`
          : ""
      }
      
      .wplace-progress-bar {
        height: ${CONFIG.currentTheme === "Neon Retro" ? "100%" : "6px"};
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%)`
            : `linear-gradient(90deg, ${theme.success}, ${theme.neon})`
        };
        transition: width ${CONFIG.currentTheme === "Neon Retro" ? "0.3s" : "0.5s"} ease;
        position: relative;
        ${CONFIG.currentTheme === "Neon Retro" ? `box-shadow: 0 0 10px ${theme.success};` : ""}
      }
      
      ${
        CONFIG.currentTheme === "Classic Autobot"
          ? `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }`
          : `
      .wplace-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        background: ${theme.text};
        animation: pixelBlink 1s infinite;
      }`
      }
      
      .wplace-status {
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "10px" : "6px"};
        border: ${CONFIG.currentTheme === "Neon Retro" ? "2px solid" : "1px solid"};
        border-radius: ${theme.borderRadius};
        text-align: center;
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "11px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        position: relative;
        overflow: hidden;
      }
      
      .status-default {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.accent};
        border-color: ${theme.text};
        color: ${theme.text};
      }
      .status-success {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(0, 255, 0, 0.1)" : theme.success};
        border-color: ${theme.success};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.success : theme.primary};
        box-shadow: 0 0 15px ${theme.success};
      }
      .status-error {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255, 0, 0, 0.1)" : theme.error};
        border-color: ${theme.error};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? theme.error : theme.text};
        box-shadow: 0 0 15px ${theme.error};
        ${theme.animations.pixelBlink ? "animation: pixelBlink 0.5s infinite;" : ""}
      }
      .status-warning {
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255, 165, 0, 0.1)" : theme.warning};
        border-color: ${theme.warning};
        color: ${CONFIG.currentTheme === "Classic Autobot" ? "orange" : theme.primary};
        box-shadow: 0 0 15px ${theme.warning};
      }
      
      .resize-container {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${theme.primary};
        padding: 20px;
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.text};
        border-radius: ${theme.borderRadius};
        z-index: 10000;
        box-shadow: ${
          CONFIG.currentTheme === "Classic Autobot" ? "0 0 20px rgba(0,0,0,0.5)" : "0 0 30px rgba(0, 255, 65, 0.5)"
        };
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        font-family: ${theme.fontFamily};
      }
      
      .resize-preview {
        max-width: 100%;
        max-height: 300px;
        margin: 10px 0;
        border: ${
          CONFIG.currentTheme === "Classic Autobot" ? `1px solid ${theme.accent}` : `2px solid ${theme.accent}`
        };
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      
      .resize-controls {
        display: flex;
        flex-direction: column;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "15px" : "10px"};
        margin-top: 15px;
      }
      
      .resize-controls label {
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "12px"};
        ${CONFIG.currentTheme === "Neon Retro" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        color: ${theme.text};
      }
      
      .resize-slider {
        width: 100%;
        height: ${CONFIG.currentTheme === "Neon Retro" ? "8px" : "4px"};
        background: ${CONFIG.currentTheme === "Classic Autobot" ? "#ccc" : theme.secondary};
        border: ${CONFIG.currentTheme === "Neon Retro" ? `2px solid ${theme.text}` : "none"};
        border-radius: ${theme.borderRadius};
        outline: none;
        -webkit-appearance: none;
      }
      
      ${
        CONFIG.currentTheme === "Neon Retro"
          ? `
      .resize-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        background: ${theme.highlight};
        border: 2px solid ${theme.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${theme.highlight};
      }
      
      .resize-slider::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: ${theme.highlight};
        border: 2px solid ${theme.text};
        border-radius: 0;
        cursor: pointer;
        box-shadow: 0 0 5px ${theme.highlight};
      }`
          : ""
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
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: none;
      }
      
      ${
        CONFIG.currentTheme === "Neon Retro"
          ? `
      /* Retro checkbox styling */
      input[type="checkbox"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border: 2px solid ${theme.text};
        background: ${theme.secondary};
        margin-right: 8px;
        position: relative;
        cursor: pointer;
      }
      
      input[type="checkbox"]:checked {
        background: ${theme.success};
      }
      
      input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 1px;
        color: ${theme.primary};
        font-size: 12px;
        font-weight: bold;
      }
      
      /* Icon styling for retro feel */
      .fas, .fa {
        filter: drop-shadow(0 0 3px currentColor);
      }`
          : ""
      }
    `
    document.head.appendChild(style)

    const container = document.createElement("div")
    container.id = "wplace-image-bot-container"
    container.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t("title")}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="themeBtn" class="wplace-header-btn" title="Switch Theme">
            <i class="fas fa-palette"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="Show Stats">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="Compact Mode">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t("minimize")}">
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
    `

    // Stats Window - Separate UI
    const statsContainer = document.createElement("div")
    statsContainer.id = "wplace-stats-container"
    statsContainer.style.display = "none"
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
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t("initMessage")}</div>
            </div>
          </div>
        </div>
      </div>
    `

    const resizeContainer = document.createElement("div")
    resizeContainer.className = "resize-container"
    resizeContainer.innerHTML = `
      <h3 style="margin-top: 0; color: ${theme.text}">${Utils.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label style="color: ${theme.text}">
          ${Utils.t("width")}: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="color: ${theme.text}">
          ${Utils.t("height")}: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="color: ${theme.text}">
          <input type="checkbox" id="keepAspect" checked>
          ${Utils.t("keepAspect")}
        </label>
        <img id="resizePreview" class="resize-preview" src="/placeholder.svg">
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
    `

    const resizeOverlay = document.createElement("div")
    resizeOverlay.className = "resize-overlay"

    document.body.appendChild(container)
    document.body.appendChild(resizeOverlay)
    document.body.appendChild(resizeContainer)
    document.body.appendChild(statsContainer)

    // Query all UI elements after appending to DOM
    const initBotBtn = container.querySelector("#initBotBtn")
    const uploadBtn = container.querySelector("#uploadBtn")
    const resizeBtn = container.querySelector("#resizeBtn")
    const selectPosBtn = container.querySelector("#selectPosBtn")
    const startBtn = container.querySelector("#startBtn")
    const stopBtn = container.querySelector("#stopBtn")
    const saveBtn = container.querySelector("#saveBtn")
    const loadBtn = container.querySelector("#loadBtn")
    const saveToFileBtn = container.querySelector("#saveToFileBtn")
    const loadFromFileBtn = container.querySelector("#loadFromFileBtn")
    const minimizeBtn = container.querySelector("#minimizeBtn")
    const compactBtn = container.querySelector("#compactBtn")
    const statsBtn = container.querySelector("#statsBtn")
    const statusText = container.querySelector("#statusText")
    const progressBar = container.querySelector("#progressBar")
    const statsArea = statsContainer.querySelector("#statsArea")
    const content = container.querySelector(".wplace-content")
    const closeStatsBtn = statsContainer.querySelector("#closeStatsBtn")

    // Check if all elements are found
    if (!initBotBtn || !uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
      console.error("Some UI elements not found:", {
        initBotBtn: !!initBotBtn,
        uploadBtn: !!uploadBtn,
        selectPosBtn: !!selectPosBtn,
        startBtn: !!startBtn,
        stopBtn: !!stopBtn,
      })
    }

    if (!statsContainer || !statsArea || !closeStatsBtn) {
      console.error("Stats UI elements not found:", {
        statsContainer: !!statsContainer,
        statsArea: !!statsArea,
        closeStatsBtn: !!closeStatsBtn,
      })
    }

    const header = container.querySelector(".wplace-header")
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0

    header.onmousedown = dragMouseDown

    function dragMouseDown(e) {
      if (e.target.closest(".wplace-header-btn")) return

      e.preventDefault()
      pos3 = e.clientX
      pos4 = e.clientY
      container.classList.add("wplace-dragging")
      document.onmouseup = closeDragElement
      document.onmousemove = elementDrag

      // Prevent text selection during drag
      document.body.style.userSelect = "none"
    }

    function elementDrag(e) {
      e.preventDefault()
      pos1 = pos3 - e.clientX
      pos2 = pos4 - e.clientY
      pos3 = e.clientX
      pos4 = e.clientY

      let newTop = container.offsetTop - pos2
      let newLeft = container.offsetLeft - pos1

      // Boundary checking to keep UI within viewport
      const rect = container.getBoundingClientRect()
      const maxTop = window.innerHeight - rect.height
      const maxLeft = window.innerWidth - rect.width

      newTop = Math.max(0, Math.min(newTop, maxTop))
      newLeft = Math.max(0, Math.min(newLeft, maxLeft))

      container.style.top = newTop + "px"
      container.style.left = newLeft + "px"
    }

    function closeDragElement() {
      container.classList.remove("wplace-dragging")
      document.onmouseup = null
      document.onmousemove = null
      document.body.style.userSelect = ""
    }

    function makeDraggable(element) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0
      const header = element.querySelector(".wplace-header")
      header.onmousedown = dragMouseDown

      function dragMouseDown(e) {
        if (e.target.closest(".wplace-header-btn")) return

        e.preventDefault()
        pos3 = e.clientX
        pos4 = e.clientY
        element.classList.add("wplace-dragging")
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag

        // Prevent text selection during drag
        document.body.style.userSelect = "none"
      }

      function elementDrag(e) {
        e.preventDefault()
        pos1 = pos3 - e.clientX
        pos2 = pos4 - e.clientY
        pos3 = e.clientX
        pos4 = e.clientY

        let newTop = element.offsetTop - pos2
        let newLeft = element.offsetLeft - pos1

        // Boundary checking to keep UI within viewport
        const rect = element.getBoundingClientRect()
        const maxTop = window.innerHeight - rect.height
        const maxLeft = window.innerWidth - rect.width

        newTop = Math.max(0, Math.min(newTop, maxTop))
        newLeft = Math.max(0, Math.min(newLeft, maxLeft))

        element.style.top = newTop + "px"
        element.style.left = newLeft + "px"
      }

      function closeDragElement() {
        element.classList.remove("wplace-dragging")
        document.onmouseup = null
        document.onmousemove = null
        document.body.style.userSelect = ""
      }
    }

    // Make stats container draggable
    makeDraggable(statsContainer)

    // Make main container draggable
    makeDraggable(container)

    // Stats window functionality
    if (statsBtn && closeStatsBtn) {
      statsBtn.addEventListener("click", () => {
        const isVisible = statsContainer.style.display !== "none"
        if (isVisible) {
          statsContainer.style.display = "none"
          statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>'
          statsBtn.title = "Show Stats"
        } else {
          statsContainer.style.display = "block"
          statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>'
          statsBtn.title = "Hide Stats"
        }
      })

      closeStatsBtn.addEventListener("click", () => {
        statsContainer.style.display = "none"
        statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>'
        statsBtn.title = "Show Stats"
      })
    }

    const widthSlider = resizeContainer.querySelector("#widthSlider")
    const heightSlider = resizeContainer.querySelector("#heightSlider")
    const widthValue = resizeContainer.querySelector("#widthValue")
    const heightValue = resizeContainer.querySelector("#heightValue")
    const keepAspect = resizeContainer.querySelector("#keepAspect")
    const resizePreview = resizeContainer.querySelector("#resizePreview")
    const confirmResize = resizeContainer.querySelector("#confirmResize")
    const cancelResize = resizeContainer.querySelector("#cancelResize")

    // Compact mode functionality
    if (compactBtn) {
      compactBtn.addEventListener("click", () => {
        container.classList.toggle("wplace-compact")
        const isCompact = container.classList.contains("wplace-compact")

        if (isCompact) {
          compactBtn.innerHTML = '<i class="fas fa-expand"></i>'
          compactBtn.title = "Expand Mode"
        } else {
          compactBtn.innerHTML = '<i class="fas fa-compress"></i>'
          compactBtn.title = "Compact Mode"
        }
      })
    }

    // Minimize functionality
    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => {
        state.minimized = !state.minimized
        if (state.minimized) {
          container.classList.add("wplace-minimized")
          content.classList.add("wplace-hidden")
          minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>'
          minimizeBtn.title = "Restore"
        } else {
          container.classList.remove("wplace-minimized")
          content.classList.remove("wplace-hidden")
          minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>'
          minimizeBtn.title = "Minimize"
        }
      })
    }

    // Save progress functionality
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        if (!state.imageLoaded) {
          Utils.showAlert(Utils.t("missingRequirements"), "error")
          return
        }

        const success = Utils.saveProgress()
        if (success) {
          updateUI("autoSaved", "success")
          Utils.showAlert(Utils.t("autoSaved"), "success")
        } else {
          Utils.showAlert("❌ Erro ao salvar progresso", "error")
        }
      })
    }

    // Load progress functionality
    if (loadBtn) {
      loadBtn.addEventListener("click", () => {
        const savedData = Utils.loadProgress()
        if (!savedData) {
          updateUI("noSavedData", "warning")
          Utils.showAlert(Utils.t("noSavedData"), "warning")
          return
        }

        // Show confirmation dialog
        const confirmLoad = confirm(
          `${Utils.t("savedDataFound")}\n\n` +
            `Saved: ${new Date(savedData.timestamp).toLocaleString()}\n` +
            `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`,
        )

        if (confirmLoad) {
          const success = Utils.restoreProgress(savedData)
          if (success) {
            updateUI("dataLoaded", "success")
            Utils.showAlert(Utils.t("dataLoaded"), "success")
            updateDataButtons()

            if (!state.colorsChecked) {
              initBotBtn.style.display = "block"
            }

            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              startBtn.disabled = false
            }
          } else {
            Utils.showAlert("❌ Erro ao carregar progresso", "error")
          }
        }
      })
    }

    // Save to file functionality
    if (saveToFileBtn) {
      saveToFileBtn.addEventListener("click", () => {
        const success = Utils.saveProgressToFile()
        if (success) {
          updateUI("fileSaved", "success")
          Utils.showAlert(Utils.t("fileSaved"), "success")
        } else {
          Utils.showAlert(Utils.t("fileError"), "error")
        }
      })
    }

    // Load from file functionality
    if (loadFromFileBtn) {
      loadFromFileBtn.addEventListener("click", async () => {
        try {
          const success = await Utils.loadProgressFromFile()
          if (success) {
            updateUI("fileLoaded", "success")
            Utils.showAlert(Utils.t("fileLoaded"), "success")
            updateDataButtons()

            // Auto-enable buttons after loading from file
            if (state.colorsChecked) {
              uploadBtn.disabled = false
              selectPosBtn.disabled = false
              resizeBtn.disabled = false
              initBotBtn.style.display = "none"
            } else {
              initBotBtn.style.display = "block"
            }

            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              startBtn.disabled = false
            }
          }
        } catch (error) {
          if (error.message === "Invalid JSON file") {
            Utils.showAlert(Utils.t("invalidFileFormat"), "error")
          } else {
            Utils.showAlert(Utils.t("fileError"), "error")
          }
        }
      })
    }

    updateUI = (messageKey, type = "default", params = {}) => {
      const message = Utils.t(messageKey, params)
      statusText.textContent = message
      statusText.className = `wplace-status status-${type}`
      statusText.style.animation = "none"
      void statusText.offsetWidth
      statusText.style.animation = "slideIn 0.3s ease-out"
    }

    updateStats = async () => {
      if (!state.colorsChecked || !state.imageLoaded) return

      const { charges, cooldown } = await WPlaceService.getCharges()
      state.currentCharges = Math.floor(charges)
      state.cooldown = cooldown

      const progress = state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0
      const remainingPixels = state.totalPixels - state.paintedPixels

      state.estimatedTime = Utils.calculateEstimatedTime(remainingPixels, state.currentCharges, state.cooldown)

      progressBar.style.width = `${progress}%`

      statsArea.innerHTML = `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t("progress")}</div>
          <div class="wplace-stat-value">${progress}%</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t("pixels")}</div>
          <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${Utils.t("charges")}</div>
          <div class="wplace-stat-value">${Math.floor(state.currentCharges)}</div>
        </div>
        ${
          state.imageLoaded
            ? `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t("estimatedTime")}</div>
          <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
        </div>
        `
            : ""
        }
      `
    }

    // Helper function to update data management buttons
    updateDataButtons = () => {
      const hasImageData = state.imageLoaded && state.imageData
      saveBtn.disabled = !hasImageData
      saveToFileBtn.disabled = !hasImageData
    }

    // Initialize data buttons state
    updateDataButtons()

    function showResizeDialog(processor) {
      const { width, height } = processor.getDimensions()
      const aspectRatio = width / height

      widthSlider.value = width
      heightSlider.value = height
      widthValue.textContent = width
      heightValue.textContent = height
      resizePreview.src = processor.img.src

      resizeOverlay.style.display = "block"
      resizeContainer.style.display = "block"

      const updatePreview = () => {
        const newWidth = Number.parseInt(widthSlider.value)
        const newHeight = Number.parseInt(heightSlider.value)

        widthValue.textContent = newWidth
        heightValue.textContent = newHeight

        resizePreview.src = processor.generatePreview(newWidth, newHeight)
      }

      widthSlider.addEventListener("input", () => {
        if (keepAspect.checked) {
          const newWidth = Number.parseInt(widthSlider.value)
          const newHeight = Math.round(newWidth / aspectRatio)
          heightSlider.value = newHeight
        }
        updatePreview()
      })

      heightSlider.addEventListener("input", () => {
        if (keepAspect.checked) {
          const newHeight = Number.parseInt(heightSlider.value)
          const newWidth = Math.round(newHeight * aspectRatio)
          widthSlider.value = newWidth
        }
        updatePreview()
      })

      confirmResize.onclick = () => {
        const newWidth = Number.parseInt(widthSlider.value)
        const newHeight = Number.parseInt(heightSlider.value)

        const newPixels = processor.resize(newWidth, newHeight)

        let totalValidPixels = 0
        for (let y = 0; y < newHeight; y++) {
          for (let x = 0; x < newWidth; x++) {
            const idx = (y * newWidth + x) * 4
            const r = newPixels[idx]
            const g = newPixels[idx + 1]
            const b = newPixels[idx + 2]
            const alpha = newPixels[idx + 3]

            if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue
            if (Utils.isWhitePixel(r, g, b)) continue

            totalValidPixels++
          }
        }

        state.imageData.pixels = newPixels
        state.imageData.width = newWidth
        state.imageData.height = newHeight
        state.imageData.totalPixels = totalValidPixels
        state.totalPixels = totalValidPixels
        state.paintedPixels = 0

        updateStats()
        updateUI("resizeSuccess", "success", {
          width: newWidth,
          height: newHeight,
        })

        closeResizeDialog()
      }

      cancelResize.onclick = closeResizeDialog
    }

    function closeResizeDialog() {
      resizeOverlay.style.display = "none"
      resizeContainer.style.display = "none"
    }

    if (initBotBtn) {
      initBotBtn.addEventListener("click", async () => {
        try {
          updateUI("checkingColors", "default")

          state.availableColors = Utils.extractAvailableColors()

          if (state.availableColors.length === 0) {
            Utils.showAlert(Utils.t("noColorsFound"), "error")
            updateUI("noColorsFound", "error")
            return
          }

          state.colorsChecked = true
          uploadBtn.disabled = false
          selectPosBtn.disabled = false
          initBotBtn.style.display = "none"

          updateUI("colorsFound", "success", {
            count: state.availableColors.length,
          })
          updateStats()
        } catch {
          updateUI("imageError", "error")
        }
      })
    }

    if (uploadBtn) {
      uploadBtn.addEventListener("click", async () => {
        try {
          updateUI("loadingImage", "default")
          const imageSrc = await Utils.createImageUploader()

          const processor = new ImageProcessor(imageSrc)
          await processor.load()

          const { width, height } = processor.getDimensions()
          const pixels = processor.getPixelData()

          let totalValidPixels = 0
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4
              const r = pixels[idx]
              const g = pixels[idx + 1]
              const b = pixels[idx + 2]
              const alpha = pixels[idx + 3]

              if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue
              if (Utils.isWhitePixel(r, g, b)) continue

              totalValidPixels++
            }
          }

          state.imageData = {
            width,
            height,
            pixels,
            totalPixels: totalValidPixels,
            processor,
          }

          state.totalPixels = totalValidPixels
          state.paintedPixels = 0
          state.imageLoaded = true
          state.lastPosition = { x: 0, y: 0 }

          resizeBtn.disabled = false
          saveBtn.disabled = false

          if (state.startPosition) {
            startBtn.disabled = false
          }

          updateStats()
          updateDataButtons()
          updateUI("imageLoaded", "success", { count: totalValidPixels })
        } catch {
          updateUI("imageError", "error")
        }
      })
    }

    if (resizeBtn) {
      resizeBtn.addEventListener("click", () => {
        if (state.imageLoaded && state.imageData.processor) {
          showResizeDialog(state.imageData.processor)
        }
      })
    }

    if (selectPosBtn) {
      selectPosBtn.addEventListener("click", async () => {
        if (state.selectingPosition) return

        state.selectingPosition = true
        state.startPosition = null
        state.region = null
        startBtn.disabled = true

        Utils.showAlert(Utils.t("selectPositionAlert"), "info")
        updateUI("waitingPosition", "default")

        const originalFetch = window.fetch

        window.fetch = async (url, options) => {
          if (
            typeof url === "string" &&
            url.includes("https://backend.wplace.live/s0/pixel/") &&
            options?.method?.toUpperCase() === "POST"
          ) {
            try {
              const response = await originalFetch(url, options)
              const clonedResponse = response.clone()
              const data = await clonedResponse.json()

              if (data?.painted === 1) {
                const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/)
                if (regionMatch && regionMatch.length >= 3) {
                  state.region = {
                    x: Number.parseInt(regionMatch[1]),
                    y: Number.parseInt(regionMatch[2]),
                  }
                }

                const payload = JSON.parse(options.body)
                if (payload?.coords && Array.isArray(payload.coords)) {
                  state.startPosition = {
                    x: payload.coords[0],
                    y: payload.coords[1],
                  }
                  state.lastPosition = { x: 0, y: 0 }

                  if (state.imageLoaded) {
                    startBtn.disabled = false
                  }

                  window.fetch = originalFetch
                  state.selectingPosition = false
                  updateUI("positionSet", "success")
                }
              }

              return response
            } catch {
              return originalFetch(url, options)
            }
          }
          return originalFetch(url, options)
        }

        setTimeout(() => {
          if (state.selectingPosition) {
            window.fetch = originalFetch
            state.selectingPosition = false
            updateUI("positionTimeout", "error")
            Utils.showAlert(Utils.t("positionTimeout"), "error")
          }
        }, 120000)
      })
    }

    // Function to start painting (can be called programmatically)
    async function startPainting() {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI("missingRequirements", "error")
        return false
      }
      if (!capturedCaptchaToken) {
        updateUI("captchaNeeded", "error")
        Utils.showAlert(Utils.t("captchaNeeded"), "error")
        return false
      }

      state.running = true
      state.stopFlag = false
      startBtn.disabled = true
      stopBtn.disabled = false
      uploadBtn.disabled = true
      selectPosBtn.disabled = true
      resizeBtn.disabled = true
      saveBtn.disabled = true

      updateUI("startPaintingMsg", "success")

      try {
        await processImage()
        return true
      } catch {
        updateUI("paintingError", "error")
        return false
      } finally {
        state.running = false
        stopBtn.disabled = true
        saveBtn.disabled = false

        if (!state.stopFlag) {
          startBtn.disabled = true
          uploadBtn.disabled = false
          selectPosBtn.disabled = false
          resizeBtn.disabled = false
        } else {
          startBtn.disabled = false
        }
      }
    }

    if (startBtn) {
      startBtn.addEventListener("click", startPainting)
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        state.stopFlag = true
        state.running = false
        stopBtn.disabled = true
        updateUI("paintingStopped", "warning")

        // Auto save when stopping
        if (state.imageLoaded && state.paintedPixels > 0) {
          Utils.saveProgress()
          Utils.showAlert(Utils.t("autoSaved"), "success")
        }
      })
    }

    // Check for saved progress on startup
    const checkSavedProgress = () => {
      const savedData = Utils.loadProgress()
      if (savedData && savedData.state.paintedPixels > 0) {
        const savedDate = new Date(savedData.timestamp).toLocaleString()
        const progress = Math.round((savedData.state.paintedPixels / savedData.state.totalPixels) * 100)

        Utils.showAlert(
          `${Utils.t("savedDataFound")}\n\n` +
            `Saved: ${savedDate}\n` +
            `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
            `${Utils.t("clickLoadToContinue")}`,
          "info",
        )
      }
    }

    // Check for saved progress after a short delay to let UI settle
    setTimeout(checkSavedProgress, 1000)

    const themeBtn = container.querySelector("#themeBtn")
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        createThemePopup()
      })
    }
  }

  async function processImage() {
    const { width, height, pixels } = state.imageData
    const { x: startX, y: startY } = state.startPosition
    const { x: regionX, y: regionY } = state.region

    const startRow = state.lastPosition.y || 0
    const startCol = state.lastPosition.x || 0

    if (!state.paintedMap) {
      state.paintedMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false))
    }

    let pixelBatch = []

    try {
      outerLoop: for (let y = startRow; y < height; y++) {
        for (let x = y === startRow ? startCol : 0; x < width; x++) {
          if (state.stopFlag) {
            if (pixelBatch.length > 0) {
              await sendPixelBatch(pixelBatch, regionX, regionY)
            }
            state.lastPosition = { x, y }
            updateUI("paintingPaused", "warning", { x, y })
            break outerLoop
          }

          if (state.paintedMap[y][x]) continue

          const idx = (y * width + x) * 4
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]
          const alpha = pixels[idx + 3]

          if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue
          if (Utils.isWhitePixel(r, g, b)) continue

          const rgb = [r, g, b]
          const colorId = findClosestColor(rgb, state.availableColors)
          const pixelX = startX + x
          const pixelY = startY + y

          pixelBatch.push({
            x: pixelX,
            y: pixelY,
            color: colorId,
            localX: x,
            localY: y,
          })

          if (pixelBatch.length >= Math.floor(state.currentCharges)) {
            const success = await sendPixelBatch(pixelBatch, regionX, regionY)

            if (success === "token_error") {
              if (state.autoRefresh) {
                // Auto-refresh CAPTCHA and retry batch
                await autoRefresh()
                const retry = await sendPixelBatch(pixelBatch, regionX, regionY)
                if (retry !== true) {
                  state.stopFlag = true
                  updateUI("captchaNeeded", "error")
                  Utils.showAlert(Utils.t("captchaNeeded"), "error")
                  break outerLoop
                }
                success = retry
                } else {
                  // Pause for manual CAPTCHA
                  state.stopFlag = true
                  state.pausedForManual = true
                  updateUI("captchaNeeded", "error")
                  Utils.showAlert(Utils.t("captchaNeeded"), "error")
                  break outerLoop
              }
            }

            if (success) {
              pixelBatch.forEach((pixel) => {
                state.paintedMap[pixel.localY][pixel.localX] = true
                state.paintedPixels++
              })

              state.currentCharges -= pixelBatch.length
              updateStats()
              updateUI("paintingProgress", "default", {
                painted: state.paintedPixels,
                total: state.totalPixels,
              })

              // Auto-save progress every 50 pixels
              if (state.paintedPixels % 50 === 0) {
                Utils.saveProgress()
              }
            }

            pixelBatch = []

            if (state.currentCharges < 1) {
              updateUI("noCharges", "warning", {
                time: Utils.formatTime(state.cooldown),
              })
              await Utils.sleep(state.cooldown)

              const chargeUpdate = await WPlaceService.getCharges()
              state.currentCharges = chargeUpdate.charges
              state.cooldown = chargeUpdate.cooldown
            }
          }
        }
      }
      // Utility to wait for DOM selector
      async function waitForSelector(selector, timeout = 10000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
          const el = document.querySelector(selector);
          if (el) return el;
          await Utils.sleep(500);
        }
        return null;
      }
      // Auto-refresh CAPTCHA workflow
      async function autoRefresh() {
        // 1) Ensure at least 2 charges before proceeding
        let chargeData = await WPlaceService.getCharges();
        if (chargeData.charges < 2) {
          updateUI('Waiting for at least 2 charges for auto-refresh...', 'status');
          while ((chargeData = await WPlaceService.getCharges()).charges < 2) {
            await Utils.sleep(60000);
            updateStats();
          }
        }
        state.currentCharges = Math.floor(chargeData.charges);
        state.cooldown = chargeData.cooldown;
        // 2) Click the Paint button
        updateUI('🍳 Auto-refreshing CAPTCHA…', 'status');
        (await waitForSelector('button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl'))?.click();
        await Utils.sleep(500);
        // 3) Select transparent
        updateUI('Selecting transparent…', 'status');
        (await waitForSelector('button#color-0'))?.click();
        await Utils.sleep(500);
        // 4) Click center of canvas via spacebar
        const canvas = await waitForSelector('canvas');
        if (canvas) {
          canvas.setAttribute('tabindex','0'); canvas.focus();
          const { left, top, width, height } = canvas.getBoundingClientRect();
          const x = Math.round(left + width/2), y = Math.round(top + height/2);
          canvas.dispatchEvent(new MouseEvent('mousemove',{ clientX:x, clientY:y, bubbles:true }));
          canvas.dispatchEvent(new KeyboardEvent('keydown',{ key:' ', code:'Space', bubbles:true }));
          canvas.dispatchEvent(new KeyboardEvent('keyup',{ key:' ', code:'Space', bubbles:true }));
        }
        await Utils.sleep(500);
        // 5) Confirm paint
        updateUI('Confirming paint…', 'status');
        let btn = await waitForSelector('button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl');
        if (!btn) {
          const all = [...document.querySelectorAll('button.btn-primary')]; btn = all.pop();
        }
        btn?.click();
      }

      if (pixelBatch.length > 0 && !state.stopFlag) {
        const success = await sendPixelBatch(pixelBatch, regionX, regionY)
        if (success) {
          pixelBatch.forEach((pixel) => {
            state.paintedMap[pixel.localY][pixel.localX] = true
            state.paintedPixels++
          })
          state.currentCharges -= pixelBatch.length
        }
      }
    } finally {
      if (window._chargesInterval) clearInterval(window._chargesInterval)
      window._chargesInterval = null
    }

    if (state.stopFlag) {
      updateUI("paintingStopped", "warning")
      // Save progress when stopped
      Utils.saveProgress()
    } else {
      updateUI("paintingComplete", "success", { count: state.paintedPixels })
      state.lastPosition = { x: 0, y: 0 }
      state.paintedMap = null
      // Clear saved data when completed
      Utils.clearProgress()
    }

    updateStats()
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
    if (!capturedCaptchaToken) {
      return "token_error"
    }

    const coords = []
    const colors = []

    pixelBatch.forEach((pixel) => {
      coords.push(pixel.x, pixel.y)
      colors.push(pixel.color)
    })

    try {
      const payload = {
        coords: coords,
        colors: colors,
        t: capturedCaptchaToken,
      }

      const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.status === 403) {
        console.error("❌ 403 Forbidden. CAPTCHA token might be invalid or expired.")
        capturedCaptchaToken = null
        return "token_error"
      }

      const data = await res.json()
      return data?.painted === pixelBatch.length
    } catch (e) {
      console.error("Batch paint request failed:", e)
      return false
    }
  }

  createUI()
})()
