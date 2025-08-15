;(async () => {
  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
      MIN: 1,          // Minimum 1 pixel per second
      MAX: 1000,       // Maximum 1000 pixels per second
      DEFAULT: 5,      // Default 5 pixels per second
    },
    SKIP_CORRECT_PIXELS: true,  // Skip pixels that already have correct color
    // Optimized CSS Classes for reuse
    CSS_CLASSES: {
      BUTTON_PRIMARY: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white; border: none; border-radius: 8px; padding: 10px 16px;
        cursor: pointer; font-weight: 500; transition: all 0.3s ease;
        display: flex; align-items: center; gap: 8px;
      `,
      BUTTON_SECONDARY: `
        background: rgba(255,255,255,0.1); color: white; 
        border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; 
        padding: 8px 12px; cursor: pointer; transition: all 0.3s ease;
      `,
      MODERN_CARD: `
        background: rgba(255,255,255,0.1); border-radius: 12px; 
        padding: 18px; border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(5px);
      `,
      GRADIENT_TEXT: `
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text; font-weight: bold;
      `
    },
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

      // Recreate UI with new theme (cleanup is handled in createUI)
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

  const loadLanguagePreference = () => {
    try {
      const saved = localStorage.getItem("wplace_language")
      if (saved && TEXT[saved]) {
        state.language = saved
      }
    } catch (e) {
      console.warn("Could not load language preference:", e)
    }
  }

  const loadSkipPixelsPreference = () => {
    try {
      const saved = localStorage.getItem("wplace_skip_correct_pixels")
      if (saved !== null) {
        CONFIG.SKIP_CORRECT_PIXELS = saved === 'true'
      }
    } catch (e) {
      console.warn("Could not load skip correct pixels preference:", e)
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
    painted: "Painted",
    charges: "Charges",
    estimatedTime: "Estimated time",
    initMessage: "Click 'Start Auto-BOT' to begin",
    waitingInit: "Waiting for initialization...",
    resizeSuccess: "✅ Image resized to {width}x{height}",
    paintingPaused: "⏸️ Painting paused at position X: {x}, Y: {y}",
    captchaNeeded: "❗ CAPTCHA token needed. Paint one pixel manually to continue,Then Open color palette again before start painting!.",
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
    paintingSpeed: "Painting Speed",
    enableSpeedControl: "Enable Speed Control",
    pixelsPerSecond: "pixels/second",
    speedSetting: "Speed: {speed} pixels/sec",
    settings: "Settings",
    botSettings: "Bot Settings",
    close: "Close",
    language: "Language",
    themeSettings: "Theme Settings",
    themeSettingsDesc: "Choose your preferred color theme for the interface.",
    languageSelectDesc: "Select your preferred language. Changes will take effect immediately.",
    skipCorrectPixels: "Skip Correct Pixels",
    skipCorrectPixelsDesc: "Skip pixels that already have the correct color and count them as painted. Note: May not work due to canvas security restrictions.",
    pixelsSkipped: "Pixels skipped: {count}",
    speedSettingDesc: "Adjust the painting speed from {min} to {max} pixels per second. Higher speeds may result in longer update times on the WPlace server."
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
    painted: "Pintados",
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
    paintingSpeed: "Velocidade de Pintura",
    enableSpeedControl: "Ativar Controle de Velocidade",
    pixelsPerSecond: "pixels/segundo",
    speedSetting: "Velocidade: {speed} pixels/seg",
    settings: "Configurações",
    botSettings: "Configurações do Bot",
    close: "Fechar",
    language: "Idioma",
    themeSettings: "Configurações de Tema",
    themeSettingsDesc: "Escolha seu tema de cores preferido para a interface.",
    languageSelectDesc: "Selecione seu idioma preferido. As alterações terão efeito imediatamente.",
    skipCorrectPixels: "Pular Pixels Corretos",
    skipCorrectPixelsDesc: "Pular pixels que já têm a cor correta e contá-los como pintados. Nota: Pode não funcionar devido a restrições de segurança do canvas.",
    pixelsSkipped: "Pixels pulados: {count}",
    speedSettingDesc: "Ajuste a velocidade de pintura de {min} a {max} pixels por segundo. Velocidades mais altas podem resultar em tempos de atualização mais longos no servidor WPlace."
  },
  vi: {
    title: "WPlace Auto-Image",
    initBot: "Khởi động Auto-BOT",
    uploadImage: "Tải lên hình ảnh",
    resizeImage: "Thay đổi kích thước",
    selectPosition: "Chọn vị trí",
    startPainting: "Bắt đầu vẽ",
    stopPainting: "Dừng vẽ",
    checkingColors: "🔍 Đang kiểm tra màu sắc có sẵn...",
    noColorsFound: "❌ Hãy mở bảng màu trên trang web và thử lại!",
    colorsFound: "✅ Tìm thấy {count} màu sắc có sẵn",
    loadingImage: "🖼️ Đang tải hình ảnh...",
    imageLoaded: "✅ Đã tải hình ảnh với {count} pixel hợp lệ",
    imageError: "❌ Lỗi khi tải hình ảnh",
    selectPositionAlert: "Vẽ pixel đầu tiên tại vị trí bạn muốn tác phẩm nghệ thuật bắt đầu!",
    waitingPosition: "👆 Đang chờ bạn vẽ pixel tham chiếu...",
    positionSet: "✅ Đã đặt vị trí thành công!",
    positionTimeout: "❌ Hết thời gian chọn vị trí",
    startPaintingMsg: "🎨 Bắt đầu vẽ...",
    paintingProgress: "🧱 Tiến trình: {painted}/{total} pixel...",
    noCharges: "⌛ Không có điện tích. Đang chờ {time}...",
    paintingStopped: "⏹️ Người dùng đã dừng vẽ",
    paintingComplete: "✅ Hoàn thành vẽ! Đã vẽ {count} pixel.",
    paintingError: "❌ Lỗi trong quá trình vẽ",
    missingRequirements: "❌ Hãy tải lên hình ảnh và chọn vị trí trước",
    progress: "Tiến trình",
    pixels: "Pixel",
    painted: "Đã vẽ",
    charges: "Điện tích",
    estimatedTime: "Thời gian ước tính",
    initMessage: "Nhấp 'Khởi động Auto-BOT' để bắt đầu",
    waitingInit: "Đang chờ khởi tạo...",
    resizeSuccess: "✅ Đã thay đổi kích thước hình ảnh thành {width}x{height}",
    paintingPaused: "⏸️ Tạm dừng vẽ tại vị trí X: {x}, Y: {y}",
    captchaNeeded: "❗ Cần token CAPTCHA. Vẽ một pixel thủ công để tiếp tục.",
    saveData: "Lưu tiến trình",
    loadData: "Tải tiến trình",
    saveToFile: "Lưu vào tệp",
    loadFromFile: "Tải từ tệp",
    dataManager: "Dữ liệu",
    autoSaved: "✅ Đã tự động lưu tiến trình",
    dataLoaded: "✅ Đã tải tiến trình thành công",
    fileSaved: "✅ Đã lưu vào tệp thành công",
    fileLoaded: "✅ Đã tải từ tệp thành công",
    noSavedData: "❌ Không tìm thấy tiến trình đã lưu",
    savedDataFound: "✅ Tìm thấy tiến trình đã lưu! Tải để tiếp tục?",
    savedDate: "Đã lưu vào: {date}",
    clickLoadToContinue: "Nhấp 'Tải tiến trình' để tiếp tục.",
    fileError: "❌ Lỗi khi xử lý tệp",
    invalidFileFormat: "❌ Định dạng tệp không hợp lệ",
    paintingSpeed: "Tốc độ vẽ",
    enableSpeedControl: "Bật điều khiển tốc độ",
    pixelsPerSecond: "pixel/giây",
    speedSetting: "Tốc độ: {speed} pixel/giây",
    settings: "Cài đặt",
    botSettings: "Cài đặt Bot",
    close: "Đóng",
    language: "Ngôn ngữ",
    themeSettings: "Cài đặt Giao diện",
    themeSettingsDesc: "Chọn chủ đề màu sắc yêu thích cho giao diện.",
    languageSelectDesc: "Chọn ngôn ngữ ưa thích. Thay đổi sẽ có hiệu lực ngay lập tức.",
    skipCorrectPixels: "Bỏ qua Pixel đúng màu",
    skipCorrectPixelsDesc: "Bỏ qua các pixel đã có màu đúng và tính chúng là đã vẽ. Lưu ý: Có thể không hoạt động do hạn chế bảo mật canvas.",
    pixelsSkipped: "Pixel đã bỏ qua: {count}",
    speedSettingDesc: "Điều chỉnh tốc độ vẽ từ {min} đến {max} pixel mỗi giây. Tốc độ cao có thể làm trong wplace server update mất thời gian hơn."
    },
  fr: {
    title: "WPlace Auto-Image",
    initBot: "Démarrer Auto-BOT",
    uploadImage: "Télécharger l'image",
    resizeImage: "Redimensionner l'image",
    selectPosition: "Sélectionner la position",
    startPainting: "Commencer à peindre",
    stopPainting: "Arrêter de peindre",
    checkingColors: "🔍 Vérification des couleurs disponibles...",
    noColorsFound: "❌ Ouvrez la palette de couleurs sur le site et réessayez!",
    colorsFound: "✅ {count} couleurs disponibles trouvées",
    loadingImage: "🖼️ Chargement de l'image...",
    imageLoaded: "✅ Image chargée avec {count} pixels valides",
    imageError: "❌ Erreur lors du chargement de l'image",
    selectPositionAlert: "Peignez le premier pixel à l'endroit où vous voulez que l'art commence!",
    waitingPosition: "👆 En attente que vous peigniez le pixel de référence...",
    positionSet: "✅ Position définie avec succès!",
    positionTimeout: "❌ Délai d'attente pour la sélection de position",
    startPaintingMsg: "🎨 Début de la peinture...",
    paintingProgress: "🧱 Progrès: {painted}/{total} pixels...",
    noCharges: "⌛ Aucune charge. En attente {time}...",
    paintingStopped: "⏹️ Peinture arrêtée par l'utilisateur",
    paintingComplete: "✅ Peinture terminée! {count} pixels peints.",
    paintingError: "❌ Erreur pendant la peinture",
    missingRequirements: "❌ Veuillez charger une image et sélectionner une position d'abord",
    progress: "Progrès",
    pixels: "Pixels",
    painted: "Peints",
    charges: "Charges",
    estimatedTime: "Temps estimé",
    initMessage: "Cliquez sur 'Démarrer Auto-BOT' pour commencer",
    waitingInit: "En attente d'initialisation...",
    resizeSuccess: "✅ Image redimensionnée en {width}x{height}",
    paintingPaused: "⏸️ Peinture en pause à la position X: {x}, Y: {y}",
    captchaNeeded: "❗ Token CAPTCHA nécessaire. Peignez un pixel manuellement pour continuer.",
    saveData: "Sauvegarder le progrès",
    loadData: "Charger le progrès",
    saveToFile: "Sauvegarder dans un fichier",
    loadFromFile: "Charger depuis un fichier",
    dataManager: "Données",
    autoSaved: "✅ Progrès sauvegardé automatiquement",
    dataLoaded: "✅ Progrès chargé avec succès",
    fileSaved: "✅ Sauvegardé dans un fichier avec succès",
    fileLoaded: "✅ Chargé depuis un fichier avec succès",
    noSavedData: "❌ Aucun progrès sauvegardé trouvé",
    savedDataFound: "✅ Progrès sauvegardé trouvé! Charger pour continuer?",
    savedDate: "Sauvegardé le: {date}",
    clickLoadToContinue: "Cliquez sur 'Charger le progrès' pour continuer.",
    fileError: "❌ Erreur lors du traitement du fichier",
    invalidFileFormat: "❌ Format de fichier invalide",
    paintingSpeed: "Vitesse de peinture",
    enableSpeedControl: "Activer le contrôle de vitesse",
    pixelsPerSecond: "pixels/seconde",
    speedSetting: "Vitesse: {speed} pixels/sec",
    settings: "Paramètres",
    botSettings: "Paramètres du Bot",
    close: "Fermer",
    language: "Langue",
    themeSettings: "Paramètres de Thème",
    themeSettingsDesc: "Choisissez votre thème de couleurs préféré pour l'interface.",
    languageSelectDesc: "Sélectionnez votre langue préférée. Les changements prendront effet immédiatement.",
    skipCorrectPixels: "Ignorer les Pixels Corrects",
    skipCorrectPixelsDesc: "Ignorer les pixels qui ont déjà la bonne couleur et les compter comme peints. Note: Peut ne pas fonctionner en raison de restrictions de sécurité du canvas.",
    pixelsSkipped: "Pixels ignorés: {count}",
    speedSettingDesc: "Ajustez la vitesse de peinture de {min} à {max} pixels par seconde. Des vitesses plus élevées peuvent entraîner des temps de mise à jour plus longs sur le serveur WPlace."
    },
  }

  // GLOBAL STATE
  const state = {
    running: false,
    imageLoaded: false,
    processing: false,
    totalPixels: 0,
    paintedPixels: 0,
    skippedPixels: 0,  // Track skipped pixels
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
    paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT, // pixels per second
  }

  // Global variable to store the captured CAPTCHA token.
  let capturedCaptchaToken = null

  // Intercept the original window.fetch function to "listen" for network requests.
  const originalFetch = window.fetch
  window.fetch = async (url, options) => {
    // Check if the request is for painting a pixel on wplace.
    if (typeof url === "string" && url.includes("https://backend.wplace.live/s0/pixel/")) {
      try {
        const payload = JSON.parse(options.body)
        // If the request body contains the 't' field, it's our CAPTCHA token.
        if (payload.t) {
          console.log("✅ CAPTCHA Token Captured:", payload.t)
          // Store the token for our bot to use.
          capturedCaptchaToken = payload.t

          // Notify the user that the token is captured and they can start the bot.
          if (document.querySelector("#statusText")?.textContent.includes("CAPTCHA")) {
            Utils.showAlert("Token captured successfully! Make sure you open the COLOR PALETTE FIRST before start painting.", "success")
            updateUI("colorsFound", "success", {
              count: state.availableColors.length,
            })
          }
        }
      } catch (e) {
        /* Ignore errors if the request body isn't valid JSON */
      }
    }
    // Finally, execute the original request, whether we inspected it or not.
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

    // Optimized DOM creation helpers
    createElement: (tag, props = {}, children = []) => {
      const element = document.createElement(tag)
      
      // Set properties efficiently
      Object.entries(props).forEach(([key, value]) => {
        if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value)
        } else if (key === 'className') {
          element.className = value
        } else if (key === 'innerHTML') {
          element.innerHTML = value
        } else {
          element.setAttribute(key, value)
        }
      })
      
      // Append children efficiently
      if (typeof children === 'string') {
        element.textContent = children
      } else if (Array.isArray(children)) {
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child))
          } else {
            element.appendChild(child)
          }
        })
      }
      
      return element
    },

    // Create button with common styling
    createButton: (id, text, icon, onClick, style = CONFIG.CSS_CLASSES.BUTTON_PRIMARY) => {
      const button = Utils.createElement('button', {
        id: id,
        style: style,
        innerHTML: `${icon ? `<i class="${icon}"></i>` : ''}<span>${text}</span>`
      })
      if (onClick) button.addEventListener('click', onClick)
      return button
    },

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

    // Debug function to test canvas access
    testCanvasAccess: () => {
      console.log("=== Canvas Access Debug ===")
      
      const canvases = document.querySelectorAll('canvas')
      console.log(`Found ${canvases.length} canvas elements`)
      
      canvases.forEach((canvas, index) => {
        console.log(`Canvas ${index}:`, {
          width: canvas.width,
          height: canvas.height,
          id: canvas.id,
          className: canvas.className,
          style: canvas.style.cssText
        })
        
        try {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Try to read a pixel from center
            const x = Math.floor(canvas.width / 2)
            const y = Math.floor(canvas.height / 2)
            const imageData = ctx.getImageData(x, y, 1, 1)
            const data = imageData.data
            console.log(`  Pixel at (${x},${y}): RGB(${data[0]}, ${data[1]}, ${data[2]})`)
          }
        } catch (error) {
          console.log(`  Error reading canvas ${index}:`, error.message)
        }
      })
      
      console.log("=== End Debug ===")
    },

    // Simplified canvas pixel reading for WPlace
    getWPlacePixelColor: (x, y) => {
      try {
        console.log(`Attempting to read pixel at (${x},${y})...`)
        
        // Find the main WPlace canvas - try different approaches
        let canvas = null
        
        // Method 1: Look for canvas in main container
        const containers = ['#app', '[data-testid="canvas-container"]', '.canvas-container', 'main', 'body']
        for (const selector of containers) {
          const container = document.querySelector(selector)
          if (container) {
            const foundCanvas = container.querySelector('canvas')
            if (foundCanvas && foundCanvas.width > 100 && foundCanvas.height > 100) {
              canvas = foundCanvas
              console.log(`Found canvas via container ${selector}: ${canvas.width}x${canvas.height}`)
              break
            }
          }
        }
        
        // Method 2: Direct canvas selectors
        if (!canvas) {
          const selectors = [
            'canvas[width][height]',
            'canvas.pixelcanvas', 
            'canvas.canvas',
            'canvas[data-testid="canvas"]',
            'canvas'
          ]
          
          for (const selector of selectors) {
            const canvases = document.querySelectorAll(selector)
            for (const c of canvases) {
              // Check if canvas has reasonable dimensions and is visible
              if (c.width > 100 && c.height > 100 && 
                  c.offsetWidth > 0 && c.offsetHeight > 0) {
                canvas = c
                console.log(`Found canvas via selector ${selector}: ${canvas.width}x${canvas.height}`)
                break
              }
            }
            if (canvas) break
          }
        }
        
        // Method 3: Find the largest canvas
        if (!canvas) {
          const allCanvases = document.querySelectorAll('canvas')
          let largest = null
          let maxSize = 0
          
          for (const c of allCanvases) {
            const size = c.width * c.height
            if (size > maxSize && c.offsetWidth > 0 && c.offsetHeight > 0) {
              maxSize = size
              largest = c
            }
          }
          
          if (largest) {
            canvas = largest
            console.log(`Found largest canvas: ${canvas.width}x${canvas.height}`)
          }
        }
        
        if (!canvas) {
          console.warn("No suitable canvas found")
          return null
        }
        
        // Check if coordinates are within canvas bounds
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
          console.warn(`Coordinates (${x},${y}) outside canvas bounds ${canvas.width}x${canvas.height}`)
          return null
        }
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          console.warn("Could not get canvas context")
          return null
        }
        
        // Get pixel data
        const imageData = ctx.getImageData(x, y, 1, 1)
        const data = imageData.data
        
        const color = [data[0], data[1], data[2]]
        console.log(`Successfully read pixel at (${x},${y}): RGB(${color.join(',')})`)
        return color
        
      } catch (error) {
        console.warn(`Failed to read pixel at (${x},${y}):`, error.message)
        return null
      }
    },

    // Check if current pixel matches target color
    pixelMatches: (currentColor, targetColor, tolerance = 10) => {
      if (!currentColor || !targetColor) return false
      
      const [cr, cg, cb] = currentColor
      const [tr, tg, tb] = targetColor
      
      const distance = Math.sqrt(
        Math.pow(cr - tr, 2) + 
        Math.pow(cg - tg, 2) + 
        Math.pow(cb - tb, 2)
      )
      
      return distance <= tolerance
    },

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
      
      // Calculate time based on painting speed (pixels per second)
      const paintingSpeedDelay = state.paintingSpeed > 0 ? (1000 / state.paintingSpeed) : 1000
      const timeFromSpeed = remainingPixels * paintingSpeedDelay // ms
      
      // Calculate time based on charges and cooldown
      const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1))
      const timeFromCharges = cyclesNeeded * cooldown // ms
      
      // Return the maximum of both calculations (the limiting factor)
      return Math.max(timeFromSpeed, timeFromCharges)
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

  // COLOR MATCHING FUNCTION - Optimized with caching
  const colorCache = new Map()
  
  function findClosestColor(targetRgb, availableColors) {
    // Create cache key from RGB values
    const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}`
    
    // Check cache first
    if (colorCache.has(cacheKey)) {
      return colorCache.get(cacheKey)
    }

    let minDistance = Number.POSITIVE_INFINITY
    let closestColorId = availableColors[0]?.id || 1

    // Use optimized loop for better performance
    for (let i = 0; i < availableColors.length; i++) {
      const color = availableColors[i]
      const distance = Utils.colorDistance(targetRgb, color.rgb)
      if (distance < minDistance) {
        minDistance = distance
        closestColorId = color.id
        
        // If perfect match, break early
        if (distance === 0) break
      }
    }

    // Cache the result for future use
    colorCache.set(cacheKey, closestColorId)
    
    // Limit cache size to prevent memory leaks
    if (colorCache.size > 10000) {
      const firstKey = colorCache.keys().next().value
      colorCache.delete(firstKey)
    }

    return closestColorId
  }

  // UI UPDATE FUNCTIONS (declared early to avoid reference errors)
  let updateUI = () => {}
  let updateStats = () => {}
  let updateDataButtons = () => {}

  async function createUI() {
    await detectLanguage()

    // Clean up existing UI elements to prevent duplicates
    const existingContainer = document.getElementById("wplace-image-bot-container")
    const existingStats = document.getElementById("wplace-stats-container")
    const existingSettings = document.getElementById("wplace-settings-container")
    const existingResizeContainer = document.querySelector(".resize-container")
    const existingResizeOverlay = document.querySelector(".resize-overlay")
    
    if (existingContainer) existingContainer.remove()
    if (existingStats) existingStats.remove()
    if (existingSettings) existingSettings.remove()
    if (existingResizeContainer) existingResizeContainer.remove()
    if (existingResizeOverlay) existingResizeOverlay.remove()

    loadThemePreference()
    loadLanguagePreference()
    loadSkipPixelsPreference()

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
        width: ${CONFIG.currentTheme === "Neon Retro" ? "280px" : "280px"};
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
        display: flex;
        flex-direction: column;
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
      #wplace-stats-container.wplace-dragging {
        transition: none !important;
      }
      #wplace-settings-container.wplace-dragging {
        transition: none !important;
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
        width: ${CONFIG.currentTheme === "Neon Retro" ? "280px" : "280px"};
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
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "8px 12px" : "8px 12px"};
        background: ${
          CONFIG.currentTheme === "Classic Autobot"
            ? `linear-gradient(135deg, ${theme.secondary} 0%, #2a2a2a 100%)`
            : theme.secondary
        };
        color: ${theme.highlight};
        font-size: ${CONFIG.currentTheme === "Neon Retro" ? "11px" : "13px"};
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
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "6px" : "6px"};
      }
      
      .wplace-header-controls {
        display: flex;
        gap: ${CONFIG.currentTheme === "Neon Retro" ? "6px" : "6px"};
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
        padding: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "12px"};
        display: block;
        position: relative;
        z-index: 2;
        overflow-y: auto;
        flex-grow: 1;
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
        margin-bottom: ${CONFIG.currentTheme === "Neon Retro" ? "12px" : "12px"};
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
      }
      
      /* Speed Control Styles */
      .wplace-speed-control {
        margin-top: 12px;
        padding: 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        backdrop-filter: ${theme.backdropFilter};
      }
      
      .wplace-speed-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${theme.text};
        font-size: 13px;
        font-weight: 600;
      }
      
      .wplace-speed-label i {
        margin-right: 6px;
        color: ${theme.highlight};
      }
      
      .wplace-speed-slider-container {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .wplace-speed-slider {
        flex: 1;
        height: 6px;
        border-radius: 3px;
        background: ${theme.primary};
        outline: none;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      
      .wplace-speed-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${theme.highlight};
        cursor: pointer;
        border: 2px solid ${theme.text};
        box-shadow: ${theme.boxShadow};
      }
      
      .wplace-speed-slider::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${theme.highlight};
        cursor: pointer;
        border: 2px solid ${theme.text};
        box-shadow: ${theme.boxShadow};
      }
      
      .wplace-speed-display {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 90px;
        justify-content: flex-end;
      }
      
      #speedValue {
        color: ${theme.highlight};
        font-weight: 600;
        font-size: 14px;
      }
      
      .wplace-speed-unit {
        color: ${theme.text};
        font-size: 11px;
        opacity: 0.8;
      }
      
      /* Settings Window Styles */
      #wplace-settings-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10001;
        min-width: 400px;
        max-width: 500px;
        background: ${theme.primary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        box-shadow: ${theme.boxShadow};
        backdrop-filter: ${theme.backdropFilter};
      }
      
      .wplace-settings {
        padding: 16px;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .wplace-setting-section {
        margin-bottom: 20px;
        padding: 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
      }
      
      .wplace-setting-title {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        color: ${theme.text};
        font-size: 14px;
        font-weight: 600;
      }
      
      .wplace-setting-title i {
        margin-right: 8px;
        color: ${theme.highlight};
      }
      
      .wplace-setting-content {
        color: ${theme.text};
      }
      
      .wplace-section {
        margin-bottom: 20px;
        padding: 15px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
      }
      
      .wplace-section-title {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        color: ${theme.text};
        font-size: 14px;
        font-weight: 600;
      }
      
      .wplace-section-title i {
        margin-right: 8px;
        color: ${theme.highlight};
      }
      
      .wplace-speed-container {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
      }
      
      .wplace-slider {
        flex: 1;
        height: 6px;
        background: ${theme.accent};
        border-radius: 3px;
        outline: none;
        -webkit-appearance: none;
      }
      
      .wplace-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        background: ${theme.highlight};
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid ${theme.primary};
      }
      
      .wplace-speed-display {
        background: ${theme.accent};
        padding: 5px 10px;
        border-radius: 4px;
        color: ${theme.text};
        font-weight: 600;
        min-width: 80px;
        text-align: center;
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }
      
      .wplace-select {
        width: 100%;
        padding: 8px 12px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: ${theme.borderRadius};
        color: ${theme.text};
        font-size: 14px;
        margin-bottom: 10px;
      }
      
      .wplace-select:focus {
        outline: none;
        border-color: ${theme.highlight};
      }
      
      .wplace-description {
        color: ${theme.text};
        font-size: 12px;
        opacity: 0.8;
        line-height: 1.4;
      }
      
      .wplace-theme-custom {
        margin-top: 15px;
        padding: 15px;
        background: ${theme.accent};
        border-radius: ${theme.borderRadius};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }
      
      .wplace-custom-group {
        margin-bottom: 15px;
      }
      
      .wplace-custom-label {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        color: ${theme.text};
        font-size: 13px;
        font-weight: 600;
      }
      
      .wplace-custom-label i {
        margin-right: 8px;
        color: ${theme.highlight};
        width: 16px;
      }
      
      .wplace-color-input-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .wplace-color-input {
        width: 50px;
        height: 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: transparent;
      }
      
      .wplace-color-text {
        flex: 1;
        padding: 6px 10px;
        background: ${theme.secondary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent};
        border-radius: 4px;
        color: ${theme.text};
        font-size: 12px;
        font-family: monospace;
      }
      
      .wplace-animation-controls {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .wplace-checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${theme.text};
        font-size: 12px;
        cursor: pointer;
      }
      
      .wplace-checkbox-label input[type="checkbox"] {
        accent-color: ${theme.highlight};
      }
      
      .wplace-slider-container {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .wplace-slider-container .wplace-slider {
        flex: 1;
      }
      
      .wplace-slider-container span {
        color: ${theme.text};
        font-size: 12px;
        font-weight: 600;
        min-width: 40px;
      }
      
      .wplace-custom-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        border-top: 1px solid ${theme.accent};
        padding-top: 15px;
      }
      
      .wplace-btn-secondary {
        background: ${theme.accent};
        color: ${theme.text};
        border: ${theme.borderWidth} ${theme.borderStyle} ${theme.highlight};
      }
      
      .wplace-btn-secondary:hover {
        background: ${theme.secondary};
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
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t("settings")}">
            <i class="fas fa-cog"></i>
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
          <button id="refreshChargesBtn" class="wplace-header-btn" title="Refresh Charges">
            <i class="fas fa-sync"></i>
          </button>
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

    // Modern Settings Container
    const settingsContainer = document.createElement("div")
    settingsContainer.id = "wplace-settings-container"
    settingsContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 16px;
      padding: 0;
      z-index: 10002;
      display: none;
      width: 720px;
      max-width: 90vw;
      max-height: 85vh;
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      overflow: hidden;
      animation: settingsSlideIn 0.4s ease-out;
    `

    settingsContainer.innerHTML = `
      <div class="wplace-settings-header" style="background: rgba(255,255,255,0.1); padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 300; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-cog" style="font-size: 18px; animation: spin 2s linear infinite;"></i>
            ${Utils.t("settings")}
          </h3>
          <button id="closeSettingsBtn" style="
            background: rgba(255,255,255,0.1); 
            color: white; 
            border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 50%; 
            width: 32px; 
            height: 32px; 
            cursor: pointer; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 300;
          " onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'">✕</button>
        </div>
      </div>
      
      <div style="padding: 20px; overflow-y: auto; max-height: calc(85vh - 80px);">
        <!-- Grid Layout for Settings -->
        <div class="grid-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          
          <!-- Left Column -->
          <div>
            <!-- Speed Control Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-tachometer-alt" style="color: #4facfe; font-size: 14px;"></i>
                ${Utils.t("paintingSpeed")}
              </label>
              <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <!-- Enable/Disable Toggle -->
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                    <input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''} style="
                      width: 16px; 
                      height: 16px; 
                      accent-color: #4facfe;
                      cursor: pointer;
                    ">
                    <span style="color: white; font-size: 13px; font-weight: 500;">
                      ${Utils.t("enableSpeedControl")}
                    </span>
                  </label>
                </div>
                
                <!-- Speed Slider -->
                <div id="speedControls" style="opacity: ${CONFIG.PAINTING_SPEED_ENABLED ? '1' : '0.5'}; pointer-events: ${CONFIG.PAINTING_SPEED_ENABLED ? 'auto' : 'none'}; transition: all 0.3s ease;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}" 
                      style="flex: 1; height: 4px; background: rgba(255,255,255,0.2); outline: none; border-radius: 2px; accent-color: #4facfe;">
                    <span id="speedValue" style="color: #4facfe; font-weight: 600; min-width: 40px; text-align: right; font-size: 14px;">${CONFIG.PAINTING_SPEED.DEFAULT}</span>
                  </div>
                </div>
                
                <div style="color: rgba(255,255,255,0.7); font-size: 11px; line-height: 1.3;">
                  ${Utils.t("speedSettingDesc", {min: CONFIG.PAINTING_SPEED.MIN, max: CONFIG.PAINTING_SPEED.MAX})}
                </div>
              </div>
            </div>

            <!-- Language Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-globe" style="color: #00cec9; font-size: 14px;"></i>
                ${Utils.t("language")}
              </label>
              <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <select id="languageSelect" style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid rgba(255,255,255,0.2);
                  border-radius: 8px;
                  background: rgba(255,255,255,0.1);
                  color: white;
                  font-size: 13px;
                  font-family: inherit;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                  <option value="en" ${state.language === 'en' ? 'selected' : ''} style="background: #2d3748; color: white;">🇺🇸 English</option>
                  <option value="vi" ${state.language === 'vi' ? 'selected' : ''} style="background: #2d3748; color: white;">🇻🇳 Tiếng Việt</option>
                  <option value="pt" ${state.language === 'pt' ? 'selected' : ''} style="background: #2d3748; color: white;">🇧🇷 Português</option>
                  <option value="fr" ${state.language === 'fr' ? 'selected' : ''} style="background: #2d3748; color: white;">🇫🇷 Français</option>
                </select>
                <div style="color: rgba(255,255,255,0.7); font-size: 11px; line-height: 1.3; margin-top: 6px;">
                  ${Utils.t("languageSelectDesc")}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div>
            <!-- Theme Settings Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-palette" style="color: #a29bfe; font-size: 14px;"></i>
                ${Utils.t("themeSettings")}
              </label>
              <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <select id="themeSelect" style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 1px solid rgba(255,255,255,0.2);
                  border-radius: 8px;
                  background: rgba(255,255,255,0.1);
                  color: white;
                  font-size: 13px;
                  font-family: inherit;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                  ${Object.keys(CONFIG.THEMES).map(themeName => 
                    `<option value="${themeName}" ${CONFIG.currentTheme === themeName ? 'selected' : ''} style="background: #2d3748; color: white;">${themeName}</option>`
                  ).join('')}
                </select>
                <div style="color: rgba(255,255,255,0.7); font-size: 11px; line-height: 1.3; margin-top: 6px;">
                  ${Utils.t("themeSettingsDesc")}
                </div>
              </div>
            </div>

            <!-- Skip Correct Pixels Section -->
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-eye-slash" style="color: #fd79a8; font-size: 14px;"></i>
                ${Utils.t("skipCorrectPixels")}
              </label>
              <div style="background: rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; flex: 1;">
                    <input type="checkbox" id="skipCorrectPixelsToggle" ${CONFIG.SKIP_CORRECT_PIXELS ? 'checked' : ''} style="
                      width: 16px; 
                      height: 16px; 
                      accent-color: #fd79a8;
                      cursor: pointer;
                    ">
                    <span style="color: white; font-size: 13px; font-weight: 500;">
                      ${Utils.t("skipCorrectPixels")}
                    </span>
                  </label>
                  <button id="testCanvasBtn" style="
                    padding: 4px 8px;
                    background: linear-gradient(45deg, #fd79a8, #fdcb6e);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    font-size: 10px;
                    cursor: pointer;
                    font-weight: 500;
                  ">Test</button>
                </div>
                <div style="color: rgba(255,255,255,0.7); font-size: 11px; line-height: 1.3;">
                  ${Utils.t("skipCorrectPixelsDesc")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Add responsive CSS styles for settings
    const settingsStyles = document.createElement('style')
    settingsStyles.textContent = `
      @keyframes settingsSlideIn {
        from { 
          opacity: 0; 
          transform: translate(-50%, -50%) scale(0.9);
        }
        to { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1);
        }
      }
      
      @keyframes settingsFadeOut {
        from { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1);
        }
        to { 
          opacity: 0; 
          transform: translate(-50%, -50%) scale(0.9);
        }
      }

      /* Responsive settings */
      @media (max-width: 768px) {
        #wplace-settings-container {
          width: 95vw !important;
          max-width: none !important;
        }
        
        #wplace-settings-container .grid-container {
          grid-template-columns: 1fr !important;
          gap: 15px !important;
        }
      }

      /* Settings hover effects */
      #wplace-settings-container input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      #wplace-settings-container input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 3px 6px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
      }

      #wplace-settings-container select:hover {
        border-color: rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.2);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.15);
      }

      #wplace-settings-container select:focus {
        border-color: #4facfe;
        box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.3);
        outline: none;
      }

      .wplace-settings-header:hover {
        background: rgba(255,255,255,0.15) !important;
      }
    `
    document.head.appendChild(settingsStyles)

    // Resize Dialog Container
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
    document.body.appendChild(settingsContainer)

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
    const refreshChargesBtn = statsContainer.querySelector("#refreshChargesBtn")

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

    // Use the shared makeDraggable function for consistency
    makeDraggable(container)

    function makeDraggable(element) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0
      let isDragging = false
      const header = element.querySelector(".wplace-header") || element.querySelector(".wplace-settings-header")
      
      // Check if header exists to prevent null error
      if (!header) {
        console.warn("No draggable header found for element:", element)
        return
      }
      
      header.onmousedown = dragMouseDown

      function dragMouseDown(e) {
        if (e.target.closest(".wplace-header-btn") || e.target.closest("button")) return

        e.preventDefault()
        isDragging = true
        
        // Get current position
        const rect = element.getBoundingClientRect()
        
        // Remove transform and set absolute position
        element.style.transform = "none"
        element.style.top = rect.top + "px"
        element.style.left = rect.left + "px"
        
        pos3 = e.clientX
        pos4 = e.clientY
        element.classList.add("wplace-dragging")
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag

        // Prevent text selection during drag
        document.body.style.userSelect = "none"
      }

      function elementDrag(e) {
        if (!isDragging) return
        
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
        isDragging = false
        element.classList.remove("wplace-dragging")
        document.onmouseup = null
        document.onmousemove = null
        document.body.style.userSelect = ""
      }
    }

    

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
          if (!statsContainer.dataset.draggable) {
            makeDraggable(statsContainer)
            statsContainer.dataset.draggable = "true"
          }
          statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>'
          statsBtn.title = "Hide Stats"
        }
      })

      closeStatsBtn.addEventListener("click", () => {
        statsContainer.style.display = "none"
        statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>'
        statsBtn.title = "Show Stats"
      })

      // Refresh charges button
      if (refreshChargesBtn) {
        refreshChargesBtn.addEventListener("click", async () => {
          refreshChargesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
          refreshChargesBtn.disabled = true
          
          try {
            await updateStats()
          } catch (error) {
            console.error("Error refreshing charges:", error)
          } finally {
            refreshChargesBtn.innerHTML = '<i class="fas fa-sync"></i>'
            refreshChargesBtn.disabled = false
          }
        })
      }
    }

    // Settings window functionality
    const settingsBtn = container.querySelector("#settingsBtn")
    const closeSettingsBtn = settingsContainer.querySelector("#closeSettingsBtn")
    
    if (settingsBtn && closeSettingsBtn) {
      settingsBtn.addEventListener("click", () => {
        const isVisible = settingsContainer.style.display !== "none"
        if (isVisible) {
          // Add fade out animation
          settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
          setTimeout(() => {
            settingsContainer.style.display = "none"
            settingsContainer.style.animation = ""
          }, 300)
        } else {
          // Reset position to center before showing
          settingsContainer.style.top = "50%"
          settingsContainer.style.left = "50%"
          settingsContainer.style.transform = "translate(-50%, -50%)"
          settingsContainer.style.display = "block"
          settingsContainer.style.animation = "settingsSlideIn 0.4s ease-out"
        }
      })

      closeSettingsBtn.addEventListener("click", () => {
        // Add fade out animation
        settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
        setTimeout(() => {
          settingsContainer.style.display = "none"
          settingsContainer.style.animation = ""
          // Reset position for next time
          settingsContainer.style.top = "50%"
          settingsContainer.style.left = "50%"
          settingsContainer.style.transform = "translate(-50%, -50%)"
        }, 300)
      })
      
      // Make settings window draggable
      makeDraggable(settingsContainer)
      
      // Skip Correct Pixels toggle event listener
      const skipToggle = settingsContainer.querySelector("#skipCorrectPixelsToggle")
      if (skipToggle) {
        skipToggle.addEventListener("change", (e) => {
          CONFIG.SKIP_CORRECT_PIXELS = e.target.checked
          // Save preference to localStorage
          try {
            localStorage.setItem('wplace_skip_correct_pixels', CONFIG.SKIP_CORRECT_PIXELS.toString())
          } catch (error) {
            console.warn("Could not save skip correct pixels preference:", error)
          }
        })
      }
      
      // Test Canvas button event listener
      const testCanvasBtn = settingsContainer.querySelector("#testCanvasBtn")
      if (testCanvasBtn) {
        testCanvasBtn.addEventListener("click", () => {
          Utils.testCanvasAccess()
        })
      }
      
      // Language selector event listener
      const languageSelect = settingsContainer.querySelector("#languageSelect")
      if (languageSelect) {
        languageSelect.addEventListener("change", (e) => {
          const newLanguage = e.target.value
          state.language = newLanguage
          localStorage.setItem('wplace_language', newLanguage)
          
          // Refresh the UI to apply new language
          setTimeout(() => {
            // Hide settings first
            settingsContainer.style.display = "none"
            
            // Recreate UI with new language (cleanup is handled in createUI)
            createUI()
          }, 100)
        })
      }
      
      // Theme selector event listener
      const themeSelect = settingsContainer.querySelector("#themeSelect")
      if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
          const newTheme = e.target.value
          switchTheme(newTheme)
        })
      }
      
      // Theme customization event listeners
      const primaryColor = settingsContainer.querySelector("#primaryColor")
      const primaryColorText = settingsContainer.querySelector("#primaryColorText")
      const secondaryColor = settingsContainer.querySelector("#secondaryColor")
      const secondaryColorText = settingsContainer.querySelector("#secondaryColorText")
      const highlightColor = settingsContainer.querySelector("#highlightColor")
      const highlightColorText = settingsContainer.querySelector("#highlightColorText")
      const borderRadiusSlider = settingsContainer.querySelector("#borderRadiusSlider")
      const borderRadiusValue = settingsContainer.querySelector("#borderRadiusValue")
      const applyChangesBtn = settingsContainer.querySelector("#applyThemeChanges")
      const resetDefaultsBtn = settingsContainer.querySelector("#resetThemeDefaults")
      
      // Color input synchronization
      if (primaryColor && primaryColorText) {
        primaryColor.addEventListener("input", (e) => {
          primaryColorText.value = e.target.value
        })
        primaryColorText.addEventListener("input", (e) => {
          if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            primaryColor.value = e.target.value
          }
        })
      }
      
      if (secondaryColor && secondaryColorText) {
        secondaryColor.addEventListener("input", (e) => {
          secondaryColorText.value = e.target.value
        })
        secondaryColorText.addEventListener("input", (e) => {
          if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            secondaryColor.value = e.target.value
          }
        })
      }
      
      if (highlightColor && highlightColorText) {
        highlightColor.addEventListener("input", (e) => {
          highlightColorText.value = e.target.value
        })
        highlightColorText.addEventListener("input", (e) => {
          if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
            highlightColor.value = e.target.value
          }
        })
      }
      
      // Border radius slider
      if (borderRadiusSlider && borderRadiusValue) {
        borderRadiusSlider.addEventListener("input", (e) => {
          borderRadiusValue.textContent = e.target.value + "px"
        })
      }
      
      // Apply theme changes
      if (applyChangesBtn) {
        applyChangesBtn.addEventListener("click", () => {
          const currentTheme = getCurrentTheme()
          const currentThemeName = CONFIG.currentTheme
          
          // Get all values
          const newValues = {
            primary: primaryColorText?.value || currentTheme.primary,
            secondary: secondaryColorText?.value || currentTheme.secondary,
            highlight: highlightColorText?.value || currentTheme.highlight,
            borderRadius: (borderRadiusSlider?.value || 0) + "px",
            animations: {
              glow: settingsContainer.querySelector("#glowAnimation")?.checked || false,
              scanline: settingsContainer.querySelector("#scanlineAnimation")?.checked || false,
              pixelBlink: settingsContainer.querySelector("#pixelBlinkAnimation")?.checked || false
            }
          }
          
          // Update theme
          CONFIG.THEMES[currentThemeName] = {
            ...currentTheme,
            ...newValues
          }
          
          // Save and apply
          saveThemePreference()
          setTimeout(() => {
            settingsContainer.style.display = "none"
            createUI()
          }, 100)
        })
      }
      
      // Reset to defaults
      if (resetDefaultsBtn) {
        resetDefaultsBtn.addEventListener("click", () => {
          // Reset to original theme values (you'll need to store defaults)
          const confirmReset = confirm("Reset theme to default settings?")
          if (confirmReset) {
            // Reload original theme (this is a simplified approach)
            location.reload()
          }
        })
      }
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

            // Check charges immediately after loading auto-save
            updateStats()

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

            // Check charges immediately after loading file
            await updateStats()

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

      const progress = state.totalPixels > 0 ? Math.round(((state.paintedPixels + state.skippedPixels) / state.totalPixels) * 100) : 0
      const remainingPixels = state.totalPixels - state.paintedPixels - state.skippedPixels

      state.estimatedTime = Utils.calculateEstimatedTime(remainingPixels, state.currentCharges, state.cooldown)

      progressBar.style.width = `${progress}%`

      statsArea.innerHTML = `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t("progress")}</div>
          <div class="wplace-stat-value">${progress}%</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t("pixels")}</div>
          <div class="wplace-stat-value">${state.paintedPixels + state.skippedPixels}/${state.totalPixels}</div>
        </div>
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${Utils.t("painted")}</div>
          <div class="wplace-stat-value">${state.paintedPixels}</div>
        </div>
        ${state.skippedPixels > 0 ? `
        <div class="wplace-stat-item">
          <div class="wplace-stat-label"><i class="fas fa-eye-slash"></i> ${Utils.t("pixelsSkipped", {count: state.skippedPixels})}</div>
          <div class="wplace-stat-value">${state.skippedPixels}</div>
        </div>
        ` : ''}
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

    // Speed Slider Event Listener (in settings window)
    const speedSlider = settingsContainer.querySelector("#speedSlider")
    const speedValue = settingsContainer.querySelector("#speedValue")
    if (speedSlider && speedValue) {
      speedSlider.addEventListener("input", (e) => {
        const speed = parseInt(e.target.value) // Use integer instead of float
        state.paintingSpeed = speed
        speedValue.textContent = speed + " px/s" // Add px/s unit
        
        // Save speed preference to localStorage
        try {
          localStorage.setItem("wplace-painting-speed", speed.toString())
        } catch (error) {
          console.warn("Could not save painting speed preference:", error)
        }
      })
      
      // Load saved speed preference
      try {
        const savedSpeed = localStorage.getItem("wplace-painting-speed")
        if (savedSpeed) {
          const speed = parseInt(savedSpeed)
          if (speed >= CONFIG.PAINTING_SPEED.MIN && speed <= CONFIG.PAINTING_SPEED.MAX) {
            state.paintingSpeed = speed
            speedSlider.value = speed
            speedValue.textContent = speed.toString()
          }
        }
      } catch (error) {
        console.warn("Could not load painting speed preference:", error)
      }
    }

    // Painting speed toggle
    const enableSpeedToggle = settingsContainer.querySelector("#enableSpeedToggle")
    const speedControls = settingsContainer.querySelector("#speedControls")
    if (enableSpeedToggle) {
      // Initialize visual state
      enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED
      if (speedControls) {
        speedControls.style.opacity = CONFIG.PAINTING_SPEED_ENABLED ? '1' : '0.5'
        speedControls.style.pointerEvents = CONFIG.PAINTING_SPEED_ENABLED ? 'auto' : 'none'
      }
      
      enableSpeedToggle.addEventListener("change", (e) => {
        CONFIG.PAINTING_SPEED_ENABLED = e.target.checked
        
        // Update visual state
        if (speedControls) {
          speedControls.style.opacity = CONFIG.PAINTING_SPEED_ENABLED ? '1' : '0.5'
          speedControls.style.pointerEvents = CONFIG.PAINTING_SPEED_ENABLED ? 'auto' : 'none'
        }
        
        // Save preference to localStorage
        try {
          localStorage.setItem("wplace-painting-speed-enabled", CONFIG.PAINTING_SPEED_ENABLED.toString())
        } catch (error) {
          console.warn("Could not save painting speed enabled preference:", error)
        }
      })
      
      // Load saved preference
      try {
        const savedEnabled = localStorage.getItem("wplace-painting-speed-enabled")
        if (savedEnabled !== null) {
          CONFIG.PAINTING_SPEED_ENABLED = savedEnabled === "true"
          enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED
          if (speedControls) {
            speedControls.style.opacity = CONFIG.PAINTING_SPEED_ENABLED ? '1' : '0.5'
            speedControls.style.pointerEvents = CONFIG.PAINTING_SPEED_ENABLED ? 'auto' : 'none'
          }
        }
      } catch (error) {
        console.warn("Could not load painting speed enabled preference:", error)
      }
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

          // Skip pixel if it already has the correct color
          if (CONFIG.SKIP_CORRECT_PIXELS) {
            console.log(`Checking pixel at (${pixelX},${pixelY}) for skip possibility...`)
            
            // Get current pixel color from canvas
            const currentPixelColor = Utils.getWPlacePixelColor(pixelX, pixelY)
            
            if (currentPixelColor) {
              // Get target color RGB
              const targetColor = state.availableColors[colorId]
              if (targetColor) {
                const matches = Utils.pixelMatches(currentPixelColor, targetColor.rgb)
                console.log(`Pixel (${pixelX},${pixelY}): Current RGB(${currentPixelColor.join(',')}) vs Target RGB(${targetColor.rgb.join(',')}) - Matches: ${matches}`)
                
                if (matches) {
                  console.log(`✓ Skipping pixel at (${pixelX},${pixelY}) - already correct color`)
                  state.paintedMap[y][x] = true
                  state.skippedPixels++
                  continue
                } else {
                  console.log(`✗ Pixel (${pixelX},${pixelY}) needs painting`)
                }
              }
            } else {
              console.log(`⚠ Could not read pixel color at (${pixelX},${pixelY})`)
            }
          }

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
              state.stopFlag = true
              updateUI("captchaNeeded", "error")
              Utils.showAlert(Utils.t("captchaNeeded"), "error")
              break outerLoop
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

              // Apply painting speed delay if enabled
              if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.length > 0) {
                const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
                const totalDelay = Math.max(100, delayPerPixel * pixelBatch.length) // minimum 100ms
                await Utils.sleep(totalDelay)
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

      if (pixelBatch.length > 0 && !state.stopFlag) {
        const success = await sendPixelBatch(pixelBatch, regionX, regionY)
        if (success) {
          pixelBatch.forEach((pixel) => {
            state.paintedMap[pixel.localY][pixel.localX] = true
            state.paintedPixels++
          })
          state.currentCharges -= pixelBatch.length
          // Apply painting speed delay for remaining pixels if enabled
          if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.length > 0) {
            const delayPerPixel = 1000 / state.paintingSpeed // ms per pixel
            const totalDelay = Math.max(100, delayPerPixel * pixelBatch.length) // minimum 100ms
            await Utils.sleep(totalDelay)
          }
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

    // Pre-allocate arrays for performance
    const coords = new Array(pixelBatch.length * 2)
    const colors = new Array(pixelBatch.length)
    for (let i = 0; i < pixelBatch.length; i++) {
      const pixel = pixelBatch[i]
      coords[i * 2] = pixel.x
      coords[i * 2 + 1] = pixel.y
      colors[i] = pixel.color
    }

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
