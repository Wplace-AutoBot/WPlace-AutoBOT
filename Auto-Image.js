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
    PAINTING_SPEED_ENABLED: false,
    AUTO_CAPTCHA_ENABLED: false, // Disabled by default
    COOLDOWN_CHARGE_THRESHOLD: 1, // Default wait threshold
    OVERLAY: {
      OPACITY_DEFAULT: 0.6,
      BLUE_MARBLE_DEFAULT: false,
    },
    // --- START: Color data from colour-converter.js ---
    // New color structure with proper ID mapping
    COLOR_MAP: {
      0: {id: 1, name: 'Black', rgb: {r: 0, g: 0, b: 0}},
      1: {id: 2, name: 'Dark Gray', rgb: {r: 60, g: 60, b: 60}},
      2: {id: 3, name: 'Gray', rgb: {r: 120, g: 120, b: 120}},
      3: {id: 4, name: 'Light Gray', rgb: {r: 210, g: 210, b: 210}},
      4: {id: 5, name: 'White', rgb: {r: 255, g: 255, b: 255}},
      5: {id: 6, name: 'Deep Red', rgb: {r: 96, g: 0, b: 24}},
      6: {id: 7, name: 'Red', rgb: {r: 237, g: 28, b: 36}},
      7: {id: 8, name: 'Orange', rgb: {r: 255, g: 127, b: 39}},
      8: {id: 9, name: 'Gold', rgb: {r: 246, g: 170, b: 9}},
      9: {id: 10, name: 'Yellow', rgb: {r: 249, g: 221, b: 59}},
      10: {id: 11, name: 'Light Yellow', rgb: {r: 255, g: 250, b: 188}},
      11: {id: 12, name: 'Dark Green', rgb: {r: 14, g: 185, b: 104}},
      12: {id: 13, name: 'Green', rgb: {r: 19, g: 230, b: 123}},
      13: {id: 14, name: 'Light Green', rgb: {r: 135, g: 255, b: 94}},
      14: {id: 15, name: 'Dark Teal', rgb: {r: 12, g: 129, b: 110}},
      15: {id: 16, name: 'Teal', rgb: {r: 16, g: 174, b: 166}},
      16: {id: 17, name: 'Light Teal', rgb: {r: 19, g: 225, b: 190}},
      17: {id: 20, name: 'Cyan', rgb: {r: 96, g: 247, b: 242}},
      18: {id: 44, name: 'Light Cyan', rgb: {r: 187, g: 250, b: 242}},
      19: {id: 18, name: 'Dark Blue', rgb: {r: 40, g: 80, b: 158}},
      20: {id: 19, name: 'Blue', rgb: {r: 64, g: 147, b: 228}},
      21: {id: 21, name: 'Indigo', rgb: {r: 107, g: 80, b: 246}},
      22: {id: 22, name: 'Light Indigo', rgb: {r: 153, g: 177, b: 251}},
      23: {id: 23, name: 'Dark Purple', rgb: {r: 120, g: 12, b: 153}},
      24: {id: 24, name: 'Purple', rgb: {r: 170, g: 56, b: 185}},
      25: {id: 25, name: 'Light Purple', rgb: {r: 224, g: 159, b: 249}},
      26: {id: 26, name: 'Dark Pink', rgb: {r: 203, g: 0, b: 122}},
      27: {id: 27, name: 'Pink', rgb: {r: 236, g: 31, b: 128}},
      28: {id: 28, name: 'Light Pink', rgb: {r: 243, g: 141, b: 169}},
      29: {id: 29, name: 'Dark Brown', rgb: {r: 104, g: 70, b: 52}},
      30: {id: 30, name: 'Brown', rgb: {r: 149, g: 104, b: 42}},
      31: {id: 31, name: 'Beige', rgb: {r: 248, g: 178, b: 119}},
      32: {id: 52, name: 'Light Beige', rgb: {r: 255, g: 197, b: 165}},
      33: {id: 32, name: 'Medium Gray', rgb: {r: 170, g: 170, b: 170}},
      34: {id: 33, name: 'Dark Red', rgb: {r: 165, g: 14, b: 30}},
      35: {id: 34, name: 'Light Red', rgb: {r: 250, g: 128, b: 114}},
      36: {id: 35, name: 'Dark Orange', rgb: {r: 228, g: 92, b: 26}},
      37: {id: 37, name: 'Dark Goldenrod', rgb: {r: 156, g: 132, b: 49}},
      38: {id: 38, name: 'Goldenrod', rgb: {r: 197, g: 173, b: 49}},
      39: {id: 39, name: 'Light Goldenrod', rgb: {r: 232, g: 212, b: 95}},
      40: {id: 40, name: 'Dark Olive', rgb: {r: 74, g: 107, b: 58}},
      41: {id: 41, name: 'Olive', rgb: {r: 90, g: 148, b: 74}},
      42: {id: 42, name: 'Light Olive', rgb: {r: 132, g: 197, b: 115}},
      43: {id: 43, name: 'Dark Cyan', rgb: {r: 15, g: 121, b: 159}},
      44: {id: 45, name: 'Light Blue', rgb: {r: 125, g: 199, b: 255}},
      45: {id: 46, name: 'Dark Indigo', rgb: {r: 77, g: 49, b: 184}},
      46: {id: 47, name: 'Dark Slate Blue', rgb: {r: 74, g: 66, b: 132}},
      47: {id: 48, name: 'Slate Blue', rgb: {r: 122, g: 113, b: 196}},
      48: {id: 49, name: 'Light Slate Blue', rgb: {r: 181, g: 174, b: 241}},
      49: {id: 53, name: 'Dark Peach', rgb: {r: 155, g: 82, b: 73}},
      50: {id: 54, name: 'Peach', rgb: {r: 209, g: 128, b: 120}},
      51: {id: 55, name: 'Light Peach', rgb: {r: 250, g: 182, b: 164}},
      52: {id: 50, name: 'Light Brown', rgb: {r: 219, g: 164, b: 99}},
      53: {id: 56, name: 'Dark Tan', rgb: {r: 123, g: 99, b: 82}},
      54: {id: 57, name: 'Tan', rgb: {r: 156, g: 132, b: 107}},
      55: {id: 36, name: 'Light Tan', rgb: {r: 214, g: 181, b: 148}},
      56: {id: 51, name: 'Dark Beige', rgb: {r: 209, g: 128, b: 81}},
      57: {id: 61, name: 'Dark Stone', rgb: {r: 109, g: 100, b: 63}},
      58: {id: 62, name: 'Stone', rgb: {r: 148, g: 140, b: 107}},
      59: {id: 63, name: 'Light Stone', rgb: {r: 205, g: 197, b: 158}},
      60: {id: 58, name: 'Dark Slate', rgb: {r: 51, g: 57, b: 65}},
      61: {id: 59, name: 'Slate', rgb: {r: 109, g: 117, b: 141}},
      62: {id: 60, name: 'Light Slate', rgb: {r: 179, g: 185, b: 209}},
      63: {id: 0, name: 'Transparent', rgb: null}
    },
    // --- END: Color data ---
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

  // BILINGUAL TEXT STRINGS
  const TEXT = {
    en: {
    title: "WPlace Auto-Image",
    toggleOverlay: "Toggle Overlay",
    scanColors: "Scan Colors",
    uploadImage: "Upload Image",
    resizeImage: "Resize Image",
    selectPosition: "Select Position",
    startPainting: "Start Painting",
    stopPainting: "Stop Painting",
    checkingColors: "🔍 Checking available colors...",
    noColorsFound: "❌ Open the color palette on the site and try again!",
    colorsFound: "✅ {count} available colors found. Ready to upload.",
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
    initMessage: "Click 'Upload Image' to begin",
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
    paintingSpeed: "Painting Speed",
    pixelsPerSecond: "pixels/second",
    speedSetting: "Speed: {speed} pixels/sec",
    settings: "Settings",
    botSettings: "Bot Settings",
    close: "Close",
    language: "Language",
    themeSettings: "Theme Settings",
    themeSettingsDesc: "Choose your preferred color theme for the interface.",
    languageSelectDesc: "Select your preferred language. Changes will take effect immediately.",
    autoCaptcha: "Auto-CAPTCHA Solver",
    autoCaptchaDesc: "Automatically attempts to solve the CAPTCHA by simulating a manual pixel placement when the token expires.",
    applySettings: "Apply Settings",
    settingsSaved: "✅ Settings saved successfully!",
    cooldownSettings: "Cooldown Settings",
    waitCharges: "Wait until charges reach",
    captchaSolving: "🤖 Attempting to solve CAPTCHA...",
    captchaFailed: "❌ Auto-CAPTCHA failed. Paint a pixel manually.",
    automation: "Automation",
    noChargesThreshold: "⌛ Waiting for charges to reach {threshold}. Currently {current}. Next in {time}...",
  },
  ru: {
    title: "WPlace Авто-Изображение",
    scanColors: "Сканировать цвета",
    uploadImage: "Загрузить изображение",
    resizeImage: "Изменить размер изображения",
    selectPosition: "Выбрать позицию",
    startPainting: "Начать рисование",
    stopPainting: "Остановить рисование",
    checkingColors: "🔍 Проверка доступных цветов...",
    noColorsFound: "❌ Откройте палитру цветов на сайте и попробуйте снова!",
    colorsFound: "✅ Найдено доступных цветов: {count}. Готово к загрузке.",
    loadingImage: "🖼️ Загрузка изображения...",
    imageLoaded: "✅ Изображение загружено, валидных пикселей: {count}",
    imageError: "❌ Ошибка при загрузке изображения",
    selectPositionAlert: "Нарисуйте первый пиксель в месте, откуда начнётся рисунок!",
    waitingPosition: "👆 Ожидание, пока вы нарисуете опорный пиксель...",
    positionSet: "✅ Позиция успешно установлена!",
    positionTimeout: "❌ Время ожидания выбора позиции истекло",
    startPaintingMsg: "🎨 Начинаем рисование...",
    paintingProgress: "🧱 Прогресс: {painted}/{total} пикселей...",
    noCharges: "⌛ Нет зарядов. Ожидание {time}...",
    paintingStopped: "⏹️ Рисование остановлено пользователем",
    paintingComplete: "✅ Рисование завершено! Нарисовано пикселей: {count}.",
    paintingError: "❌ Ошибка во время рисования",
    missingRequirements: "❌ Сначала загрузите изображение и выберите позицию",
    progress: "Прогресс",
    pixels: "Пиксели",
    charges: "Заряды",
    estimatedTime: "Примерное время",
    initMessage: "Нажмите 'Загрузить изображение', чтобы начать",
    waitingInit: "Ожидание инициализации...",
    resizeSuccess: "✅ Изображение изменено до {width}x{height}",
    paintingPaused: "⏸️ Рисование приостановлено на позиции X: {x}, Y: {y}",
    captchaNeeded: "❗ Требуется токен CAPTCHA. Нарисуйте один пиксель вручную, чтобы продолжить.",
    saveData: "Сохранить прогресс",
    loadData: "Загрузить прогресс",
    saveToFile: "Сохранить в файл",
    loadFromFile: "Загрузить из файла",
    dataManager: "Менеджер данных",
    autoSaved: "✅ Прогресс сохранён автоматически",
    dataLoaded: "✅ Прогресс успешно загружен",
    fileSaved: "✅ Прогресс успешно сохранён в файл",
    fileLoaded: "✅ Прогресс успешно загружен из файла",
    noSavedData: "❌ Сохранённый прогресс не найден",
    savedDataFound: "✅ Найден сохранённый прогресс! Загрузить, чтобы продолжить?",
    savedDate: "Сохранено: {date}",
    clickLoadToContinue: "Нажмите 'Загрузить прогресс', чтобы продолжить.",
    fileError: "❌ Ошибка при обработке файла",
    invalidFileFormat: "❌ Неверный формат файла",
    paintingSpeed: "Скорость рисования",
    pixelsPerSecond: "пикселей/сек",
    speedSetting: "Скорость: {speed} пикс./сек",
    settings: "Настройки",
    botSettings: "Настройки бота",
    close: "Закрыть",
    language: "Язык",
    themeSettings: "Настройки темы",
    themeSettingsDesc: "Выберите предпочтительную цветовую тему интерфейса.",
    languageSelectDesc: "Выберите предпочтительный язык. Изменения вступят в силу немедленно.",
    autoCaptcha: "Авто-решение CAPTCHA",
    autoCaptchaDesc: "Автоматически пытается решить CAPTCHA, симулируя ручное размещение пикселя, когда токен истекает.",
    applySettings: "Применить настройки",
    settingsSaved: "✅ Настройки успешно сохранены!",
    cooldownSettings: "Настройки перезарядки",
    waitCharges: "Ждать до накопления зарядов",
    captchaSolving: "🤖 Пытаюсь решить CAPTCHA...",
    captchaFailed: "❌ Не удалось решить CAPTCHA. Нарисуйте пиксель вручную.",
    automation: "Автоматизация",
    noChargesThreshold: "⌛ Ожидание зарядов до {threshold}. Сейчас {current}. Следующий через {time}...",
},
  pt: {
    title: "WPlace Auto-Image",
    scanColors: "Escanear Cores",
    uploadImage: "Upload da Imagem",
    resizeImage: "Redimensionar Imagem",
    selectPosition: "Selecionar Posição",
    startPainting: "Iniciar Pintura",
    stopPainting: "Parar Pintura",
    checkingColors: "🔍 Verificando cores disponíveis...",
    noColorsFound: "❌ Abra a paleta de cores no site e tente novamente!",
    colorsFound: "✅ {count} cores encontradas. Pronto para upload.",
    loadingImage: "🖼️ Carregando imagem...",
    imageLoaded: "✅ Imagem carregada com {count} pixels válidos",
    imageError: "❌ Erro ao carregar imagem",
    selectPositionAlert: "Pinte o primeiro pixel на localização onde deseja que a arte comece!",
    waitingPosition: "👆 Aguardando você pintar o pixel de referência...",
    positionSet: "✅ Posição definida com sucesso!",
    positionTimeout: "❌ Tempo esgotado para selecionar posição",
    startPaintingMsg: "🎨 Iniciando pintura...",
    paintingProgress: "🧱 Progresso: {painted}/{total} pixels...",
    noCharges: "⌛ Sem cargas. Aguardando {time}...",
    paintingStopped: "⏹️ Pintura interromпида pelo usuário",
    paintingComplete: "✅ Pintura concluída! {count} pixels pintados.",
    paintingError: "❌ Erro durante a pintura",
    missingRequirements: "❌ Carregue uma imagem e selecione uma posição primeiro",
    progress: "Progresso",
    pixels: "Pixels",
    charges: "Cargas",
    estimatedTime: "Tempo estimado",
    initMessage: "Clique em 'Upload da Imagem' para começar",
    waitingInit: "Aguardando inicialização...",
    resizeSuccess: "✅ Imagem redimensionada для {width}x{height}",
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
    pixelsPerSecond: "pixels/segundo",
    speedSetting: "Velocidade: {speed} pixels/seg",
    settings: "Configurações",
    botSettings: "Configurações do Bot",
    close: "Fechar",
    language: "Idioma",
    themeSettings: "Configurações de Tema",
    themeSettingsDesc: "Escolha seu tema de cores preferido para a interface.",
    languageSelectDesc: "Selecione seu idioma preferido. As alterações terão efeito imediatamente.",
    autoCaptcha: "Resolvedor de CAPTCHA Automático",
    autoCaptchaDesc: "Tenta resolver o CAPTCHA automaticamente simulando a colocação manual de um pixel quando o token expira.",
    applySettings: "Aplicar Configurações",
    settingsSaved: "✅ Configurações salvas com sucesso!",
    cooldownSettings: "Configurações de Cooldown",
    waitCharges: "Aguardar até as cargas atingirem",
    captchaSolving: "🤖 Tentando resolver o CAPTCHA...",
    captchaFailed: "❌ Falha ao resolver CAPTCHA. Pinte um pixel manualmente.",
    automation: "Automação",
    noChargesThreshold: "⌛ Aguardando cargas atingirem {threshold}. Atual: {current}. Próxima em {time}...",
  },
  vi: {
    title: "WPlace Auto-Image",
    scanColors: "Quét màu",
    uploadImage: "Tải lên hình ảnh",
    resizeImage: "Thay đổi kích thước",
    selectPosition: "Chọn vị trí",
    startPainting: "Bắt đầu vẽ",
    stopPainting: "Dừng vẽ",
    checkingColors: "🔍 Đang kiểm tra màu sắc có sẵn...",
    noColorsFound: "❌ Hãy mở bảng màu trên trang web và thử lại!",
    colorsFound: "✅ Tìm thấy {count} màu. Sẵn sàng để tải lên.",
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
    charges: "Điện tích",
    estimatedTime: "Thời gian ước tính",
    initMessage: "Nhấp 'Tải lên hình ảnh' để bắt đầu",
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
    pixelsPerSecond: "pixel/giây",
    speedSetting: "Tốc độ: {speed} pixel/giây",
    settings: "Cài đặt",
    botSettings: "Cài đặt Bot",
    close: "Đóng",
    language: "Ngôn ngữ",
    themeSettings: "Cài đặt Giao diện",
    themeSettingsDesc: "Chọn chủ đề màu sắc yêu thích cho giao diện.",
    languageSelectDesc: "Chọn ngôn ngữ ưa thích. Thay đổi sẽ có hiệu lực ngay lập tức.",
    autoCaptcha: "Tự động giải CAPTCHA",
    autoCaptchaDesc: "Tự động cố gắng giải CAPTCHA bằng cách mô phỏng việc đặt pixel thủ công khi token hết hạn.",
    applySettings: "Áp dụng cài đặt",
    settingsSaved: "✅ Đã lưu cài đặt thành công!",
    cooldownSettings: "Cài đặt thời gian chờ",
    waitCharges: "Chờ cho đến khi số lần sạc đạt",
    captchaSolving: "🤖 Đang cố gắng giải CAPTCHA...",
    captchaFailed: "❌ Giải CAPTCHA tự động thất bại. Vui lòng vẽ một pixel thủ công.",
    automation: "Tự động hóa",
    noChargesThreshold: "⌛ Đang chờ số lần sạc đạt {threshold}. Hiện tại {current}. Lần tiếp theo trong {time}...",
    },
  fr: {
    title: "WPlace Auto-Image",
    scanColors: "Scanner les couleurs",
    uploadImage: "Télécharger l'image",
    resizeImage: "Redimensionner l'image",
    selectPosition: "Sélectionner la position",
    startPainting: "Commencer à peindre",
    stopPainting: "Arrêter de peindre",
    checkingColors: "🔍 Vérification des couleurs disponibles...",
    noColorsFound: "❌ Ouvrez la palette de couleurs sur le site et réessayez!",
    colorsFound: "✅ {count} couleurs trouvées. Prêt à télécharger.",
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
    charges: "Charges",
    estimatedTime: "Temps estimé",
    initMessage: "Cliquez sur 'Télécharger l'image' pour commencer",
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
    pixelsPerSecond: "pixels/seconde",
    speedSetting: "Vitesse: {speed} pixels/sec",
    settings: "Paramètres",
    botSettings: "Paramètres du Bot",
    close: "Fermer",
    language: "Langue",
    themeSettings: "Paramètres de Thème",
    themeSettingsDesc: "Choisissez votre thème de couleurs préféré pour l'interface.",
    languageSelectDesc: "Sélectionnez votre langue préférée. Les changements prendront effet immédiatement.",
    autoCaptcha: "Résolveur de CAPTCHA automatique",
    autoCaptchaDesc: "Tente automatiquement de résoudre le CAPTCHA en simulant un placement manuel de pixel lorsque le jeton expire.",
    applySettings: "Appliquer les paramètres",
    settingsSaved: "✅ Paramètres enregistrés avec succès !",
    cooldownSettings: "Paramètres de recharge",
    waitCharges: "Attendre que les charges atteignent",
    captchaSolving: "🤖 Tentative de résolution du CAPTCHA...",
    captchaFailed: "❌ Échec de l'Auto-CAPTCHA. Peignez un pixel manuellement.",
    automation: "Automatisation",
    noChargesThreshold: "⌛ En attente que les charges atteignent {threshold}. Actuel: {current}. Prochaine dans {time}...",
    },
  id: {
    title: "WPlace Auto-Image",
    scanColors: "Pindai Warna",
    uploadImage: "Unggah Gambar",
    resizeImage: "Ubah Ukuran Gambar",
    selectPosition: "Pilih Posisi",
    startPainting: "Mulai Melukis",
    stopPainting: "Berhenti Melukis",
    checkingColors: "🔍 Memeriksa warna yang tersedia...",
    noColorsFound: "❌ Buka palet warna di situs dan coba lagi!",
    colorsFound: "✅ {count} warna ditemukan. Siap untuk diunggah.",
    loadingImage: "🖼️ Memuat gambar...",
    imageLoaded: "✅ Gambar dimuat dengan {count} piksel valid",
    imageError: "❌ Kesalahan saat memuat gambar",
    selectPositionAlert: "Lukis piksel pertama di lokasi tempat karya seni akan dimulai!",
    waitingPosition: "👆 Menunggu Anda melukis piksel referensi...",
    positionSet: "✅ Posisi berhasil diatur!",
    positionTimeout: "❌ Waktu habis untuk memilih posisi",
    startPaintingMsg: "🎨 Mulai melukis...",
    paintingProgress: "🧱 Progres: {painted}/{total} piksel...",
    noCharges: "⌛ Tidak ada muatan. Menunggu {time}...",
    paintingStopped: "⏹️ Melukis dihentikan oleh pengguna",
    paintingComplete: "✅ Melukis selesai! {count} piksel telah dilukis.",
    paintingError: "❌ Kesalahan selama melukis",
    missingRequirements: "❌ Unggah gambar dan pilih posisi terlebih dahulu",
    progress: "Progres",
    pixels: "Piksel",
    charges: "Muatan",
    estimatedTime: "Perkiraan waktu",
    initMessage: "Klik 'Unggah Gambar' untuk memulai",
    waitingInit: "Menunggu inisialisasi...",
    resizeSuccess: "✅ Gambar berhasil diubah ukurannya menjadi {width}x{height}",
    paintingPaused: "⏸️ Melukis dijeda di posisi X: {x}, Y: {y}",
    captchaNeeded: "❗ Token CAPTCHA diperlukan. Lukis satu piksel secara manual untuk melanjutkan.",
    saveData: "Simpan Progres",
    loadData: "Muat Progres",
    saveToFile: "Simpan ke File",
    loadFromFile: "Muat dari File",
    dataManager: "Data",
    autoSaved: "✅ Progres disimpan secara otomatis",
    dataLoaded: "✅ Progres berhasil dimuat",
    fileSaved: "✅ Berhasil disimpan ke file",
    fileLoaded: "✅ Berhasil dimuat dari file",
    noSavedData: "❌ Tidak ditemukan progres yang disimpan",
    savedDataFound: "✅ Progres yang disimpan ditemukan! Muat untuk melanjutkan?",
    savedDate: "Disimpan pada: {date}",
    clickLoadToContinue: "Klik 'Muat Progres' untuk melanjutkan.",
    fileError: "❌ Kesalahan saat memproses file",
    invalidFileFormat: "❌ Format file tidak valid",
    paintingSpeed: "Kecepatan Melukis",
    pixelsPerSecond: "piksel/detik",
    speedSetting: "Kecepatan: {speed} piksel/detik",
    settings: "Pengaturan",
    botSettings: "Pengaturan Bot",
    close: "Tutup",
    language: "Bahasa",
    themeSettings: "Pengaturan Tema",
    themeSettingsDesc: "Pilih tema warna favorit Anda untuk antarmuka.",
    languageSelectDesc: "Pilih bahasa yang Anda inginkan. Perubahan akan berlaku segera.",
    autoCaptcha: "Penyelesai CAPTCHA Otomatis",
    autoCaptchaDesc: "Mencoba menyelesaikan CAPTCHA secara otomatis dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
    applySettings: "Terapkan Pengaturan",
    settingsSaved: "✅ Pengaturan berhasil disimpan!",
    cooldownSettings: "Pengaturan Cooldown",
    waitCharges: "Tunggu hingga muatan mencapai",
    captchaSolving: "🤖 Mencoba menyelesaikan CAPTCHA...",
    captchaFailed: "❌ Gagal menyelesaikan CAPTCHA. Lukis satu piksel secara manual.",
    automation: "Automasi",
    noChargesThreshold: "⌛ Menunggu muatan mencapai {threshold}. Saat ini: {current}. Berikutnya dalam {time}...",
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
    activeColorPalette: [], // User-selected colors for conversion
    paintWhitePixels: true, // Default to ON
    currentCharges: 0,
    maxCharges: 1, // Default max charges
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
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    overlayOpacity: CONFIG.OVERLAY.OPACITY_DEFAULT,
    blueMarbleEnabled: CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT,
  }

  // Placeholder for the resize preview update function
  let _updateResizePreview = () => {};

  // --- OVERLAY UPDATE: New OverlayManager class to handle all overlay logic ---
  class OverlayManager {
    constructor() {
        this.isEnabled = false;
        this.startCoords = null; // { region: {x, y}, pixel: {x, y} }
        this.imageBitmap = null;
        this.chunkedTiles = new Map(); // Map<"tileX,tileY", ImageBitmap>
        this.tileSize = 1000;
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        console.log(`Overlay ${this.isEnabled ? 'enabled' : 'disabled'}.`);
        return this.isEnabled;
    }

    enable() { this.isEnabled = true; }
    disable() { this.isEnabled = false; }
    clear() {
        this.disable();
        this.imageBitmap = null;
        this.chunkedTiles.clear();
    }

    async setImage(imageBitmap) {
        this.imageBitmap = imageBitmap;
        if (this.imageBitmap && this.startCoords) {
            await this.processImageIntoChunks();
        }
    }

    async setPosition(startPosition, region) {
        if (!startPosition || !region) {
            this.startCoords = null;
            this.chunkedTiles.clear();
            return;
        }
        this.startCoords = { region, pixel: startPosition };
        if (this.imageBitmap) {
            await this.processImageIntoChunks();
        }
    }

    // --- OVERLAY UPDATE: Simplified chunking logic for solid, semi-transparent overlay ---
    async processImageIntoChunks() {
        if (!this.imageBitmap || !this.startCoords) return;

        this.chunkedTiles.clear();
        const { width: imageWidth, height: imageHeight } = this.imageBitmap;
        const { x: startPixelX, y: startPixelY } = this.startCoords.pixel;
        const { x: startRegionX, y: startRegionY } = this.startCoords.region;

        const endPixelX = startPixelX + imageWidth;
        const endPixelY = startPixelY + imageHeight;

        const startTileX = startRegionX + Math.floor(startPixelX / this.tileSize);
        const startTileY = startRegionY + Math.floor(startPixelY / this.tileSize);
        const endTileX = startRegionX + Math.floor(endPixelX / this.tileSize);
        const endTileY = startRegionY + Math.floor(endPixelY / this.tileSize);
        
        for (let ty = startTileY; ty <= endTileY; ty++) {
            for (let tx = startTileX; tx <= endTileX; tx++) {
                const tileKey = `${tx},${ty}`;

                // Calculate the portion of the image that overlaps with this tile
                const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
                const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;

                // Crop coordinates within the source image
                const sX = Math.max(0, imgStartX);
                const sY = Math.max(0, imgStartY);
                const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
                const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));
                
                if (sW <= 0 || sH <= 0) continue;

                // Destination coordinates on the new chunk canvas
                const dX = Math.max(0, -imgStartX);
                const dY = Math.max(0, -imgStartY);

                const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
                const chunkCtx = chunkCanvas.getContext('2d');
                chunkCtx.imageSmoothingEnabled = false;

                chunkCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, dX, dY, sW, sH);
                
                // --- NEW: BLUE MARBLE EFFECT ---
                if (state.blueMarbleEnabled) {
                    const imageData = chunkCtx.getImageData(0, 0, this.tileSize, this.tileSize);
                    const data = imageData.data;
                    for (let pixelY = 0; pixelY < this.tileSize; pixelY++) {
                        for (let pixelX = 0; pixelX < this.tileSize; pixelX++) {
                            const canvasX = pixelX;
                            const canvasY = pixelY;
                            const imageX = canvasX - dX;
                            const imageY = canvasY - dY;

                            if ((imageX + imageY) % 2 === 0) {
                                const index = (canvasY * this.tileSize + canvasX) * 4;
                                if (data[index + 3] > 0) {
                                    data[index + 3] = 0;
                                }
                            }
                        }
                    }
                    chunkCtx.putImageData(imageData, 0, 0);
                }

                const chunkBitmap = await chunkCanvas.transferToImageBitmap();
                this.chunkedTiles.set(tileKey, chunkBitmap);
            }
        }
        
        console.log(`Overlay processed into ${this.chunkedTiles.size} chunks.`);
    }

    // --- OVERLAY UPDATE: Simplified compositing logic for solid, semi-transparent overlay ---
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
                if (chunkBitmap) {
                    try {
                        const originalTileBitmap = await createImageBitmap(blobData);
                        const canvas = new OffscreenCanvas(originalTileBitmap.width, originalTileBitmap.height);
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = false;

                        // Draw original tile first
                        ctx.drawImage(originalTileBitmap, 0, 0);
                        
                        // Set opacity and draw our solid overlay chunk on top
                        ctx.globalAlpha = state.overlayOpacity;
                        ctx.drawImage(chunkBitmap, 0, 0);

                        finalBlob = await canvas.convertToBlob({ type: 'image/png' });
                    } catch (e) {
                        console.error("Error compositing overlay:", e);
                    }
                }
            }
        }

        // Send the (possibly modified) blob back to the injected script
        window.postMessage({
            source: 'auto-image-overlay',
            blobID: blobID,
            blobData: finalBlob
        }, '*');
    }
}

const overlayManager = new OverlayManager();

// Turnstile token handling (promise-based) inspired by external logic
let turnstileToken = null
let _resolveToken = null
let tokenPromise = new Promise((resolve) => { _resolveToken = resolve })

function setTurnstileToken(t) {
  if (_resolveToken) {
    _resolveToken(t)
    _resolveToken = null
  }
  turnstileToken = t
}

async function ensureToken() {
  if (!turnstileToken) {
    updateUI("captchaNeeded", "error")
    Utils.showAlert(Utils.t("captchaNeeded"), "error")
    try { await tokenPromise } catch (_) {}
  }
  return turnstileToken
}

function inject(callback) {
    const script = document.createElement('script');
    script.textContent = `(${callback})();`;
    document.documentElement?.appendChild(script);
    script.remove();
}

inject(() => {
    const fetchedBlobQueue = new Map();

    window.addEventListener('message', (event) => {
        const { source, blobID, blobData } = event.data;
        if (source === 'auto-image-overlay' && blobID && blobData) {
            const callback = fetchedBlobQueue.get(blobID);
            if (typeof callback === 'function') {
                callback(blobData);
            }
            fetchedBlobQueue.delete(blobID);
        }
    });

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = (args[0] instanceof Request) ? args[0].url : args[0];

        if (typeof url === "string") {
            if (url.includes("https://backend.wplace.live/s0/pixel/")) {
                try {
                    const payload = JSON.parse(args[1].body);
                    if (payload.t) {
                        console.log("✅ Turnstile Token Captured:", payload.t);
                         window.postMessage({ source: 'turnstile-capture', token: payload.t }, '*');
                    }
                } catch (_) { /* ignore */ }
            }
            
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('image/png') && url.includes('.png')) {
                 const cloned = response.clone();
                 return new Promise(async (resolve) => {
                     const blobUUID = crypto.randomUUID();
                     const originalBlob = await cloned.blob();
                     
                     fetchedBlobQueue.set(blobUUID, (processedBlob) => {
                         resolve(new Response(processedBlob, {
                             headers: cloned.headers,
                             status: cloned.status,
                             statusText: cloned.statusText
                         }));
                     });

                     window.postMessage({
                         source: 'auto-image-tile',
                         endpoint: url,
                         blobID: blobUUID,
                         blobData: originalBlob,
                     }, '*');
                 });
            }
        }
        
        return response;
    };
});

window.addEventListener('message', (event) => {
    const { source, endpoint, blobID, blobData, token } = event.data;

    if (source === 'auto-image-tile' && endpoint && blobID && blobData) {
        overlayManager.processAndRespondToTileRequest(event.data);
    }

    if (source === 'turnstile-capture' && token) {
        setTurnstileToken(token);
        if (document.querySelector("#statusText")?.textContent.includes("CAPTCHA")) {
            Utils.showAlert("Token captured successfully! You can start the bot now.", "success");
            updateUI("colorsFound", "success", { count: state.availableColors.length });
        }
    }
});

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

    waitForSelector: async (selector, interval = 200, timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const el = document.querySelector(selector);
            if (el) return el;
            await Utils.sleep(interval);
        }
        return null;
    },

    createElement: (tag, props = {}, children = []) => {
      const element = document.createElement(tag)

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

    findClosestPaletteColor: (r, g, b, palette) => {
        let menorDist = Infinity;
        let cor = [0, 0, 0];
        if (!palette || palette.length === 0) {
            // If no palette provided, use all available colors from COLOR_MAP
            const availableColors = Object.values(CONFIG.COLOR_MAP)
                .filter(color => color.rgb !== null)
                .map(color => [color.rgb.r, color.rgb.g, color.rgb.b]);
            palette = availableColors;
        }

        for (let i = 0; i < palette.length; i++) {
            const [pr, pg, pb] = palette[i];
            const rmean = (pr + r) / 2;
            const rdiff = pr - r;
            const gdiff = pg - g;
            const bdiff = pb - b;
            const dist = Math.sqrt(((512 + rmean) * rdiff * rdiff >> 8) + 4 * gdiff * gdiff + ((767 - rmean) * bdiff * bdiff >> 8));
            if (dist < menorDist) {
                menorDist = dist;
                cor = [pr, pg, pb];
            }
        }
        return cor;
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
      
      // Separate available and unavailable colors
      const availableColors = []
      const unavailableColors = []
      
      Array.from(colorElements).forEach((el) => {
        const id = Number.parseInt(el.id.replace("color-", ""))
        if (id === 0) return // Skip transparent color
        
        const rgbStr = el.style.backgroundColor.match(/\d+/g)
        const rgb = rgbStr ? rgbStr.map(Number) : [0, 0, 0]
        
        // Find color name from COLOR_MAP
        const colorInfo = Object.values(CONFIG.COLOR_MAP).find(color => color.id === id)
        const name = colorInfo ? colorInfo.name : `Unknown Color ${id}`
        
        const colorData = { id, name, rgb }
        
        // Check if color is available (no SVG overlay means available)
        if (!el.querySelector("svg")) {
          availableColors.push(colorData)
        } else {
          unavailableColors.push(colorData)
        }
      })
      
      // Console log detailed color information
      console.log("=== CAPTURED COLORS STATUS ===")
      console.log(`Total available colors: ${availableColors.length}`)
      console.log(`Total unavailable colors: ${unavailableColors.length}`)
      console.log(`Total colors scanned: ${availableColors.length + unavailableColors.length}`)
      
      if (availableColors.length > 0) {
        console.log("\n--- AVAILABLE COLORS ---")
        availableColors.forEach((color, index) => {
          console.log(`${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`)
        })
      }
      
      if (unavailableColors.length > 0) {
        console.log("\n--- UNAVAILABLE COLORS ---")
        unavailableColors.forEach((color, index) => {
          console.log(`${index + 1}. ID: ${color.id}, Name: "${color.name}", RGB: (${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}) [LOCKED]`)
        })
      }
      
      console.log("=== END COLOR STATUS ===")
      
      return availableColors
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

      const paintingSpeedDelay = state.paintingSpeed > 0 ? (1000 / state.paintingSpeed) : 1000
      const timeFromSpeed = remainingPixels * paintingSpeedDelay

      const cyclesNeeded = Math.ceil(remainingPixels / Math.max(charges, 1))
      const timeFromCharges = cyclesNeeded * cooldown

      return Math.max(timeFromSpeed, timeFromCharges)
    },

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
        Object.assign(state, savedData.state)

        if (savedData.imageData) {
          state.imageData = {
            ...savedData.imageData,
            pixels: new Uint8ClampedArray(savedData.imageData.pixels),
          }
        }

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
        await ensureToken()
        if (!turnstileToken) return "token_error"
        const payload = { coords: [pixelX, pixelY], colors: [color], t: turnstileToken }
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
        if (res.status === 403) {
          console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired.")
          turnstileToken = null
          tokenPromise = new Promise((resolve) => { _resolveToken = resolve })
          return "token_error"
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
          max: data.charges?.max || 1,
          cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
        }
      } catch (e) {
        console.error("Failed to get charges:", e)
        return {
          charges: 0,
          max: 1,
          cooldown: CONFIG.COOLDOWN_DEFAULT,
        }
      }
    },
  }

  // COLOR MATCHING FUNCTION - Optimized with caching
  const colorCache = new Map()

  function findClosestColor(targetRgb, availableColors) {
    const cacheKey = `${targetRgb[0]},${targetRgb[1]},${targetRgb[2]}`

    if (colorCache.has(cacheKey)) {
      return colorCache.get(cacheKey)
    }

    const isNearWhite = targetRgb[0] >= 250 && targetRgb[1] >= 250 && targetRgb[2] >= 250
    if (isNearWhite) {
      const whiteEntry = availableColors.find(c => c.rgb[0] >= 250 && c.rgb[1] >= 250 && c.rgb[2] >= 250)
      if (whiteEntry) {
        colorCache.set(cacheKey, whiteEntry.id)
        return whiteEntry.id
      }
    }

    let minDistance = Number.POSITIVE_INFINITY
    let closestColorId = availableColors[0]?.id || 1

    for (let i = 0; i < availableColors.length; i++) {
      const color = availableColors[i]
      const distance = Utils.colorDistance(targetRgb, color.rgb)
      if (distance < minDistance) {
        minDistance = distance
        closestColorId = color.id
        if (distance === 0) break
      }
    }

    colorCache.set(cacheKey, closestColorId)

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

  function updateActiveColorPalette() {
      state.activeColorPalette = [];
      const activeSwatches = document.querySelectorAll('.wplace-color-swatch.active');
      if (activeSwatches) {
          activeSwatches.forEach(swatch => {
              const rgbStr = swatch.getAttribute('data-rgb');
              if (rgbStr) {
                  const rgb = rgbStr.split(',').map(Number);
                  state.activeColorPalette.push(rgb);
              }
          });
      }
      if (document.querySelector('.resize-container')?.style.display === 'block') {
          _updateResizePreview();
      }
  }

  function toggleAllColors(select, showingUnavailable = false) {
      const swatches = document.querySelectorAll('.wplace-color-swatch');
      if (swatches) {
          swatches.forEach(swatch => {
              // Only toggle colors that are available or if we're showing unavailable colors
              const isUnavailable = swatch.classList.contains('unavailable');
              if (!isUnavailable || showingUnavailable) {
                  // Don't try to select unavailable colors
                  if (!isUnavailable) {
                      swatch.classList.toggle('active', select);
                  }
              }
          });
      }
      updateActiveColorPalette();
  }

  function initializeColorPalette(container) {
      const colorsContainer = container.querySelector('#colors-container');
      const showAllToggle = container.querySelector('#showAllColorsToggle');
      if (!colorsContainer) return;

      // Use already captured colors from state (captured during upload)
      // Don't re-fetch colors here, use what was captured when user clicked upload
      if (!state.availableColors || state.availableColors.length === 0) {
          // If no colors have been captured yet, show message
          colorsContainer.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">Upload an image first to capture available colors</div>';
          return;
      }

      function populateColors(showUnavailable = false) {
          colorsContainer.innerHTML = '';
          let availableCount = 0;
          let totalCount = 0;

          // Convert COLOR_MAP to array and filter out transparent
          const allColors = Object.values(CONFIG.COLOR_MAP).filter(color => color.rgb !== null);

          allColors.forEach(colorData => {
              const { id, name, rgb } = colorData;
              const rgbKey = `${rgb.r},${rgb.g},${rgb.b}`;
              totalCount++;
              
              // Check if this color is available in the captured colors
              const isAvailable = state.availableColors.some(c => 
                  c.rgb[0] === rgb.r && c.rgb[1] === rgb.g && c.rgb[2] === rgb.b
              );

              // If not showing all colors and this color is not available, skip it
              if (!showUnavailable && !isAvailable) {
                  return;
              }

              if (isAvailable) availableCount++;

              const colorItem = Utils.createElement('div', { className: 'wplace-color-item' });
              const swatch = Utils.createElement('button', {
                  className: `wplace-color-swatch ${!isAvailable ? 'unavailable' : ''}`,
                  title: `${name} (ID: ${id})${!isAvailable ? ' (Unavailable)' : ''}`,
                  'data-rgb': rgbKey,
                  'data-color-id': id,
              });
              swatch.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

              // Make unavailable colors visually distinct
              if (!isAvailable) {
                  swatch.style.opacity = '0.4';
                  swatch.style.filter = 'grayscale(50%)';
                  swatch.disabled = true;
              } else {
                  // Select available colors by default
                  swatch.classList.add('active');
              }

              const nameLabel = Utils.createElement('span', { 
                  className: 'wplace-color-item-name',
                  style: !isAvailable ? 'color: #888; font-style: italic;' : ''
              }, name + (!isAvailable ? ' (N/A)' : ''));

              // Only add click listener for available colors
              if (isAvailable) {
                  swatch.addEventListener('click', () => {
                      swatch.classList.toggle('active');
                      updateActiveColorPalette();
                  });
              }

              colorItem.appendChild(swatch);
              colorItem.appendChild(nameLabel);
              colorsContainer.appendChild(colorItem);
          });

          updateActiveColorPalette();
      }

      // Initialize with only available colors
      populateColors(false);

      // Add toggle functionality
      if (showAllToggle) {
          showAllToggle.addEventListener('change', (e) => {
              populateColors(e.target.checked);
          });
      }

      container.querySelector('#selectAllBtn')?.addEventListener('click', () => toggleAllColors(true, showAllToggle?.checked));
      container.querySelector('#unselectAllBtn')?.addEventListener('click', () => toggleAllColors(false, showAllToggle?.checked));
  }
    async function handleCaptcha() {
        return new Promise(async (resolve, reject) => {
            if (!CONFIG.AUTO_CAPTCHA_ENABLED) {
                return reject(new Error("Auto-CAPTCHA is disabled."));
            }

            try {
                const timeoutPromise = Utils.sleep(20000).then(() => reject(new Error("Auto-CAPTCHA timed out.")));

                const solvePromise = (async () => {
                    const mainPaintBtn = await Utils.waitForSelector('button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl', 200, 10000);
                    if (!mainPaintBtn) throw new Error("Could not find the main paint button.");
                    mainPaintBtn.click();
                    await Utils.sleep(500);

                    const transBtn = await Utils.waitForSelector('button#color-0', 200, 5000);
                    if (!transBtn) throw new Error("Could not find the transparent color button.");
                    transBtn.click();
                    await Utils.sleep(500);

                    const canvas = await Utils.waitForSelector('canvas', 200, 5000);
                    if (!canvas) throw new Error("Could not find the canvas element.");

                    canvas.setAttribute('tabindex', '0');
                    canvas.focus();
                    const rect = canvas.getBoundingClientRect();
                    const centerX = Math.round(rect.left + rect.width / 2);
                    const centerY = Math.round(rect.top + rect.height / 2);

                    canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: centerX, clientY: centerY, bubbles: true }));
                    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
                    await Utils.sleep(50);
                    canvas.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', code: 'Space', bubbles: true }));
                    await Utils.sleep(500);

                    let confirmBtn = await Utils.waitForSelector('button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl');
                    if (!confirmBtn) {
                        const allPrimary = Array.from(document.querySelectorAll('button.btn-primary'));
                        confirmBtn = allPrimary.length ? allPrimary[allPrimary.length - 1] : null;
                    }
                    if (!confirmBtn) throw new Error("Could not find the confirmation button.");
                    confirmBtn.click();

                    await tokenPromise;
                    resolve();
                })();

                await Promise.race([solvePromise, timeoutPromise]);

            } catch (error) {
                console.error("Auto-CAPTCHA process failed:", error);
                reject(error);
            }
        });
    }


  async function createUI() {
    await detectLanguage()

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
        overflow-y: auto; /* Allow scrolling for main panel */
        overflow-x: hidden;
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
        overflow: hidden;
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
        overflow-y: auto; /* Make stats panel scrollable */
        ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease;
        user-select: none;
        ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }

      /* FIX: Disable transition during drag to prevent lag */
      #wplace-stats-container.wplace-dragging {
        transition: none;
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
      
      .wplace-btn-overlay.active {
        background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%);
        box-shadow: 0 0 15px #8e2de2;
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

      .wplace-colors-section {
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(255,255,255,0.05);
      }

      .wplace-stat-colors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(16px, 1fr));
        gap: 4px;
        margin-top: 8px;
        padding: 4px;
        background: rgba(0,0,0,0.2);
        border-radius: 4px;
        max-height: 80px; /* Limit height and allow scrolling */
        overflow-y: auto;
      }
      
      .wplace-stat-color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid rgba(255,255,255,0.1);
        box-shadow: inset 0 0 2px rgba(0,0,0,0.5);
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
        width: 90%;
        max-width: 700px;
        max-height: 90%;
        overflow: auto;
        font-family: ${theme.fontFamily};
      }

      .resize-preview-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid ${theme.accent};
        background: rgba(0,0,0,0.2);
        margin: 15px 0;
        height: 300px;
        overflow: auto;
      }

      .resize-preview {
        max-width: none;
        transition: transform 0.1s ease;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }

      .resize-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        align-items: center;
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
      
      .resize-zoom-controls {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 15px;
      }

      .resize-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
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
      .wplace-color-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
        padding-top: 8px;
        max-height: 300px;
        overflow-y: auto;
      }
      .wplace-color-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }
      .wplace-color-item-name {
        font-size: 9px;
        color: #ccc;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .wplace-color-swatch {
        width: 22px;
        height: 22px;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.1s ease, box-shadow 0.2s ease;
        position: relative;
        margin: 0 auto;
      }
      .wplace-color-swatch.unavailable {
        border-color: #666;
        border-style: dashed;
        cursor: not-allowed;
      }
      .wplace-color-swatch:hover {
        transform: scale(1.1);
        z-index: 1;
      }
      .wplace-color-swatch:not(.active) {
        opacity: 0.3;
        filter: grayscale(80%);
      }
      .wplace-color-swatch.unavailable:not(.active) {
        opacity: 0.2;
        filter: grayscale(90%);
      }
      .wplace-color-swatch.active::after {
        content: '✔';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-shadow: 0 0 3px black;
      }
      .wplace-color-divider {
        border: none;
        height: 1px;
        background: rgba(255,255,255,0.1);
        margin: 8px 0;
      }

        .wplace-cooldown-control {
            margin-top: 8px;
        }
        .wplace-cooldown-control label {
            font-size: 11px;
            margin-bottom: 4px;
            display: block;
        }
        .wplace-slider-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .wplace-slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: #444;
            border-radius: 2px;
            outline: none;
        }
        .wplace-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: ${theme.highlight};
            border-radius: 50%;
            cursor: pointer;
        }


      ${
        CONFIG.currentTheme === "Neon Retro"
          ? `
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

      .fas, .fa {
        filter: drop-shadow(0 0 3px currentColor);
      }

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
            ${Utils.t("initMessage")}
          </div>
          <div class="wplace-progress">
            <div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <!-- Image Section -->
        <div class="wplace-section">
          <div class="wplace-section-title">🖼️ Image Management</div>
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload">
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
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${Utils.t("toggleOverlay")}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">⏱️ ${Utils.t("cooldownSettings")}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${Utils.t("waitCharges")}:</label>
                <div class="wplace-slider-container">
                    <input type="range" id="cooldownSlider" class="wplace-slider" min="1" max="1" value="${state.cooldownChargeThreshold}">
                    <span id="cooldownValue" style="font-weight:bold; min-width: 20px; text-align: center;">${state.cooldownChargeThreshold}</span>
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
      min-width: 420px;
      max-width: 480px;
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

      <div style="padding: 25px; max-height: 70vh; overflow-y: auto;">
        
        <!-- Automation Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-robot" style="color: #4facfe; font-size: 16px;"></i>
            ${Utils.t("automation")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
              <label for="enableAutoCaptchaToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div>
                      <span style="font-weight: 500;">${Utils.t("autoCaptcha")}</span>
                      <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">${Utils.t("autoCaptchaDesc")}</p>
                  </div>
                  <input type="checkbox" id="enableAutoCaptchaToggle" ${CONFIG.AUTO_CAPTCHA_ENABLED ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
          </div>
        </div>

        <!-- Overlay Settings Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-eye" style="color: #48dbfb; font-size: 16px;"></i>
            Overlay Settings
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
              <!-- Opacity Slider -->
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                   <span style="font-weight: 500; font-size: 13px;">Overlay Opacity</span>
                   <div id="overlayOpacityValue" style="min-width: 40px; text-align: center; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 6px; font-size: 12px;">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${state.overlayOpacity}" style="width: 100%; -webkit-appearance: none; height: 8px; background: linear-gradient(to right, #48dbfb 0%, #d3a4ff 100%); border-radius: 4px; outline: none; cursor: pointer;">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div>
                      <span style="font-weight: 500;">Blue Marble Effect</span>
                      <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${state.blueMarbleEnabled ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-tachometer-alt" style="color: #4facfe; font-size: 16px;"></i>
            ${Utils.t("paintingSpeed")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}"
                style="
                  flex: 1;
                  height: 8px;
                  background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
                  border-radius: 4px;
                  outline: none;
                  -webkit-appearance: none;
                  cursor: pointer;
                ">
              <div id="speedValue" style="
                min-width: 70px;
                text-align: center;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                padding: 8px 12px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                font-size: 13px;
                box-shadow: 0 3px 10px rgba(79, 172, 254, 0.3);
                border: 1px solid rgba(255,255,255,0.2);
              ">${CONFIG.PAINTING_SPEED.DEFAULT} px/s</div>
            </div>
            <div style="display: flex; justify-content: space-between; color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 8px;">
              <span><i class="fas fa-turtle"></i> ${CONFIG.PAINTING_SPEED.MIN}</span>
              <span><i class="fas fa-rabbit"></i> ${CONFIG.PAINTING_SPEED.MAX}</span>
            </div>
          </div>
           <label style="display: flex; align-items: center; gap: 8px; color: white; margin-top: 10px;">
            <input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''} style="cursor: pointer;"/>
            <span>Enable painting speed limit</span>
          </label>
        </div>

        <!-- Theme Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-palette" style="color: #f093fb; font-size: 16px;"></i>
            ${Utils.t("themeSettings")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="themeSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              ${Object.keys(CONFIG.THEMES).map(themeName =>
                `<option value="${themeName}" ${CONFIG.currentTheme === themeName ? 'selected' : ''} style="background: #2d3748; color: white; padding: 10px;">${themeName}</option>`
              ).join('')}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-globe" style="color: #ffeaa7; font-size: 16px;"></i>
            ${Utils.t("language")}
          </label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; border: 1px solid rgba(255,255,255,0.1);">
            <select id="languageSelect" style="
              width: 100%;
              padding: 12px 16px;
              background: rgba(255,255,255,0.15);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-size: 14px;
              outline: none;
              cursor: pointer;
              transition: all 0.3s ease;
              font-family: inherit;
              box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            ">
              <option value="vi" ${state.language === 'vi' ? 'selected' : ''} style="background: #2d3748; color: white;">🇻🇳 Tiếng Việt</option>
              <option value="id" ${state.language === 'id' ? 'selected' : ''} style="background: #2d3748; color: white;">🇮🇩 Bahasa Indonesia</option>
              <option value="ru" ${state.language === 'ru' ? 'selected' : ''} style="background: #2d3748; color: white;">🇷🇺 Русский</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''} style="background: #2d3748; color: white;">🇺🇸 English</option>
              <option value="pt" ${state.language === 'pt' ? 'selected' : ''} style="background: #2d3748; color: white;">🇧🇷 Português</option>
              <option value="fr" ${state.language === 'fr' ? 'selected' : ''} style="background: #2d3748; color: white;">🇫🇷 Français</option>
            </select>
          </div>
        </div>

        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px;">
             <button id="applySettingsBtn" style="
                width: 100%;
                ${CONFIG.CSS_CLASSES.BUTTON_PRIMARY}
             ">
                 <i class="fas fa-check"></i> ${Utils.t("applySettings")}
             </button>
        </div>

      </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

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

        #speedSlider::-webkit-slider-thumb, #overlayOpacitySlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #speedSlider::-webkit-slider-thumb:hover, #overlayOpacitySlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
        }

        #speedSlider::-moz-range-thumb, #overlayOpacitySlider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }

        #themeSelect:hover, #languageSelect:hover {
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.2);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        #themeSelect:focus, #languageSelect:focus {
          border-color: #4facfe;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.3);
        }

        #themeSelect option, #languageSelect option {
          background: #2d3748;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }

        #themeSelect option:hover, #languageSelect option:hover {
          background: #4a5568;
        }

        .wplace-dragging {
          opacity: 0.9;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2);
          transition: none;
        }

        .wplace-settings-header:hover {
          background: rgba(255,255,255,0.15) !important;
        }

        .wplace-settings-header:active {
          background: rgba(255,255,255,0.2) !important;
        }
      </style>
    `

    const resizeContainer = document.createElement("div")
    resizeContainer.className = "resize-container"
    resizeContainer.innerHTML = `
      <h3 style="margin-top: 0; color: ${theme.text}">${Utils.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label>
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label>
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label style="display: flex; align-items: center;">
          <input type="checkbox" id="keepAspect" checked>
          Keep Aspect Ratio
        </label>
        <label style="display: flex; align-items: center;">
            <input type="checkbox" id="paintWhiteToggle" checked>
            Paint White Pixels
        </label>
        <div class="resize-zoom-controls">
          <i class="fas fa-search-minus"></i>
          <input type="range" id="zoomSlider" class="resize-slider" min="1" max="10" value="1" step="0.1">
          <i class="fas fa-search-plus"></i>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <img id="resizePreview" class="resize-preview" src="" alt="Resized image preview will appear here.">
      </div>

      <div class="wplace-section" id="color-palette-section" style="margin-top: 15px;">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <input type="checkbox" id="showAllColorsToggle" style="cursor: pointer;">
                      <span>Show All Colors (including unavailable)</span>
                  </label>
              </div>
              <div class="wplace-row">
                  <button id="selectAllBtn" class="wplace-btn">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn">Unselect All</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>Download Preview</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>Apply</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>
    `

    const resizeOverlay = document.createElement("div")
    resizeOverlay.className = "resize-overlay"

    document.body.appendChild(container)
    document.body.appendChild(resizeOverlay)
    document.body.appendChild(resizeContainer)
    document.body.appendChild(statsContainer)
    document.body.appendChild(settingsContainer)

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
    const toggleOverlayBtn = container.querySelector("#toggleOverlayBtn");
    const statusText = container.querySelector("#statusText")
    const progressBar = container.querySelector("#progressBar")
    const statsArea = statsContainer.querySelector("#statsArea")
    const content = container.querySelector(".wplace-content")
    const closeStatsBtn = statsContainer.querySelector("#closeStatsBtn")
    const refreshChargesBtn = statsContainer.querySelector("#refreshChargesBtn")
    const cooldownSlider = container.querySelector("#cooldownSlider");
    const cooldownValue = container.querySelector("#cooldownValue");

    if (!uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
      console.error("Some UI elements not found:", {
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

    makeDraggable(container)

    function makeDraggable(element) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0
      let isDragging = false
      const header = element.querySelector(".wplace-header") || element.querySelector(".wplace-settings-header")

      if (!header) {
        console.warn("No draggable header found for element:", element)
        return
      }

      header.onmousedown = dragMouseDown

      function dragMouseDown(e) {
        if (e.target.closest(".wplace-header-btn") || e.target.closest("button")) return

        e.preventDefault()
        isDragging = true

        const rect = element.getBoundingClientRect()

        element.style.transform = "none"
        element.style.top = rect.top + "px"
        element.style.left = rect.left + "px"

        pos3 = e.clientX
        pos4 = e.clientY
        element.classList.add("wplace-dragging")
        document.onmouseup = closeDragElement
        document.onmousemove = elementDrag

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

    makeDraggable(statsContainer)
    makeDraggable(container)

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

    const settingsBtn = container.querySelector("#settingsBtn")
    const closeSettingsBtn = settingsContainer.querySelector("#closeSettingsBtn")
    const applySettingsBtn = settingsContainer.querySelector("#applySettingsBtn");


    if (settingsBtn && closeSettingsBtn && applySettingsBtn) {
      settingsBtn.addEventListener("click", () => {
        const isVisible = settingsContainer.style.display !== "none"
        if (isVisible) {
          settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
          setTimeout(() => {
            settingsContainer.style.display = "none"
            settingsContainer.style.animation = ""
          }, 300)
        } else {
          settingsContainer.style.top = "50%"
          settingsContainer.style.left = "50%"
          settingsContainer.style.transform = "translate(-50%, -50%)"
          settingsContainer.style.display = "block"
          settingsContainer.style.animation = "settingsSlideIn 0.4s ease-out"
        }
      })

      closeSettingsBtn.addEventListener("click", () => {
        settingsContainer.style.animation = "settingsFadeOut 0.3s ease-out forwards"
        setTimeout(() => {
          settingsContainer.style.display = "none"
          settingsContainer.style.animation = ""
          settingsContainer.style.top = "50%"
          settingsContainer.style.left = "50%"
          settingsContainer.style.transform = "translate(-50%, -50%)"
        }, 300)
      })

      applySettingsBtn.addEventListener("click", () => {
        saveBotSettings();
        Utils.showAlert(Utils.t("settingsSaved"), "success");
        closeSettingsBtn.click();
      });

      makeDraggable(settingsContainer)

      const languageSelect = settingsContainer.querySelector("#languageSelect")
      if (languageSelect) {
        languageSelect.addEventListener("change", (e) => {
          const newLanguage = e.target.value
          state.language = newLanguage
          localStorage.setItem('wplace_language', newLanguage)

          setTimeout(() => {
            settingsContainer.style.display = "none"
            createUI()
          }, 100)
        })
      }

      const themeSelect = settingsContainer.querySelector("#themeSelect")
      if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
          const newTheme = e.target.value
          switchTheme(newTheme)
        })
      }

    const overlayOpacitySlider = settingsContainer.querySelector("#overlayOpacitySlider");
    const overlayOpacityValue = settingsContainer.querySelector("#overlayOpacityValue");
    const enableBlueMarbleToggle = settingsContainer.querySelector("#enableBlueMarbleToggle");

    if (overlayOpacitySlider && overlayOpacityValue) {
        overlayOpacitySlider.addEventListener('input', (e) => {
            const opacity = parseFloat(e.target.value);
            state.overlayOpacity = opacity;
            overlayOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
        });
    }

    if (enableBlueMarbleToggle) {
        enableBlueMarbleToggle.addEventListener('click', async () => {
            state.blueMarbleEnabled = enableBlueMarbleToggle.checked;
            if (state.imageLoaded && overlayManager.imageBitmap) {
                Utils.showAlert("Re-processing overlay...", "info");
                await overlayManager.processImageIntoChunks();
                Utils.showAlert("Overlay updated!", "success");
            }
        });
    }

    }

    const widthSlider = resizeContainer.querySelector("#widthSlider")
    const heightSlider = resizeContainer.querySelector("#heightSlider")
    const widthValue = resizeContainer.querySelector("#widthValue")
    const heightValue = resizeContainer.querySelector("#heightValue")
    const keepAspect = resizeContainer.querySelector("#keepAspect")
    const paintWhiteToggle = resizeContainer.querySelector("#paintWhiteToggle");
    const zoomSlider = resizeContainer.querySelector("#zoomSlider");
    const resizePreview = resizeContainer.querySelector("#resizePreview")
    const confirmResize = resizeContainer.querySelector("#confirmResize")
    const cancelResize = resizeContainer.querySelector("#cancelResize")
    const downloadPreviewBtn = resizeContainer.querySelector("#downloadPreviewBtn");

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
        saveBotSettings()
      })
    }
    
    if (toggleOverlayBtn) {
        toggleOverlayBtn.addEventListener('click', () => {
            const isEnabled = overlayManager.toggle();
            toggleOverlayBtn.classList.toggle('active', isEnabled);
            Utils.showAlert(`Overlay ${isEnabled ? 'enabled' : 'disabled'}.`, 'info');
        });
    }

    if (state.minimized) {
      container.classList.add("wplace-minimized")
      content.classList.add("wplace-hidden")
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>'
        minimizeBtn.title = "Restore"
      }
    } else {
      container.classList.remove("wplace-minimized")
      content.classList.remove("wplace-hidden")
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>'
        minimizeBtn.title = "Minimize"
      }
    }

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

    if (loadBtn) {
      loadBtn.addEventListener("click", () => {
        const savedData = Utils.loadProgress()
        if (!savedData) {
          updateUI("noSavedData", "warning")
          Utils.showAlert(Utils.t("noSavedData"), "warning")
          return
        }

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

            updateStats()

            if (!state.colorsChecked) {
                uploadBtn.disabled = false;
            } else {
                uploadBtn.disabled = false;
                selectPosBtn.disabled = false;
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

    if (loadFromFileBtn) {
      loadFromFileBtn.addEventListener("click", async () => {
        try {
          const success = await Utils.loadProgressFromFile()
          if (success) {
            updateUI("fileLoaded", "success")
            Utils.showAlert(Utils.t("fileLoaded"), "success")
            updateDataButtons()

            await updateStats()

            if (state.colorsChecked) {
              uploadBtn.disabled = false
              selectPosBtn.disabled = false
              resizeBtn.disabled = false
            } else {
                uploadBtn.disabled = false;
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
        const { charges, cooldown, max } = await WPlaceService.getCharges();
        state.currentCharges = Math.floor(charges);
        state.cooldown = cooldown;
        state.maxCharges = Math.floor(max) > 1 ? Math.floor(max) : state.maxCharges;

        if (cooldownSlider.max != state.maxCharges) {
            cooldownSlider.max = state.maxCharges;
        }

        let imageStatsHTML = '';
        if (state.imageLoaded) {
            const progress = state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
            const remainingPixels = state.totalPixels - state.paintedPixels;
            state.estimatedTime = Utils.calculateEstimatedTime(remainingPixels, state.currentCharges, state.cooldown);
            progressBar.style.width = `${progress}%`;

            imageStatsHTML = `
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t("progress")}</div>
                <div class="wplace-stat-value">${progress}%</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t("pixels")}</div>
                <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
                </div>
                <div class="wplace-stat-item">
                <div class="wplace-stat-label"><i class="fas fa-clock"></i> ${Utils.t("estimatedTime")}</div>
                <div class="wplace-stat-value">${Utils.formatTime(state.estimatedTime)}</div>
                </div>
            `;
        }

        let colorSwatchesHTML = '';
        if (state.colorsChecked) {
            colorSwatchesHTML = state.availableColors.map(color => {
                const rgbString = `rgb(${color.rgb.join(',')})`;
                return `<div class="wplace-stat-color-swatch" style="background-color: ${rgbString};" title="ID: ${color.id}\nRGB: ${color.rgb.join(', ')}"></div>`;
            }).join('');
        }

        statsArea.innerHTML = `
            ${imageStatsHTML}
            <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-bolt"></i> ${Utils.t("charges")}</div>
            <div class="wplace-stat-value">${Math.floor(state.currentCharges)} / ${state.maxCharges}</div>
            </div>
            ${state.colorsChecked ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> Available Colors (${state.availableColors.length})</div>
                <div class="wplace-stat-colors-grid">
                    ${colorSwatchesHTML}
                </div>
            </div>
            ` : ''}
        `;
    }

    updateDataButtons = () => {
      const hasImageData = state.imageLoaded && state.imageData
      saveBtn.disabled = !hasImageData
      saveToFileBtn.disabled = !hasImageData
    }

    updateDataButtons()

    function showResizeDialog(processor) {
        const { width, height } = processor.getDimensions();
        const aspectRatio = width / height;

        widthSlider.value = width;
        heightSlider.value = height;
        widthSlider.max = width * 2;
        heightSlider.max = height * 2;
        widthValue.textContent = width;
        heightValue.textContent = height;
        zoomSlider.value = 1;
        paintWhiteToggle.checked = state.paintWhitePixels;

        _updateResizePreview = async () => {
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);
            const zoomLevel = parseFloat(zoomSlider.value);

            widthValue.textContent = newWidth;
            heightValue.textContent = newHeight;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(processor.img, 0, 0, newWidth, newHeight);

            const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

                if (a < CONFIG.TRANSPARENCY_THRESHOLD || (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))) {
                    data[i + 3] = 0;
                    continue;
                }

                const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
                data[i] = nr;
                data[i + 1] = ng;
                data[i + 2] = nb;
                data[i + 3] = 255;
            }
            tempCtx.putImageData(imgData, 0, 0);
            resizePreview.src = tempCanvas.toDataURL();
            resizePreview.style.transform = `scale(${zoomLevel})`;
        };

        const onWidthInput = () => {
            if (keepAspect.checked) {
                heightSlider.value = Math.round(parseInt(widthSlider.value, 10) / aspectRatio);
            }
            _updateResizePreview();
        };

        const onHeightInput = () => {
            if (keepAspect.checked) {
                widthSlider.value = Math.round(parseInt(heightSlider.value, 10) * aspectRatio);
            }
            _updateResizePreview();
        };

        paintWhiteToggle.onchange = (e) => {
            state.paintWhitePixels = e.target.checked;
            _updateResizePreview();
        };

        zoomSlider.addEventListener('input', _updateResizePreview);
        widthSlider.addEventListener("input", onWidthInput);
        heightSlider.addEventListener("input", onHeightInput);

        confirmResize.onclick = async () => {
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);
            
            // Generate the final paletted image data
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(processor.img, 0, 0, newWidth, newHeight);
            const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;
            let totalValidPixels = 0;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                const isTransparent = a < CONFIG.TRANSPARENCY_THRESHOLD;
                const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);

                if (isTransparent || isWhiteAndSkipped) {
                    data[i+3] = 0; // Make it fully transparent for the overlay
                    continue;
                }
                
                totalValidPixels++;
                const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
                data[i] = nr;
                data[i + 1] = ng;
                data[i + 2] = nb;
                data[i + 3] = 255;
            }
            tempCtx.putImageData(imgData, 0, 0);

            // Save the final pixel data for painting
            const finalPixelsForPainting = processor.resize(newWidth, newHeight);
            state.imageData.pixels = finalPixelsForPainting;
            state.imageData.width = newWidth;
            state.imageData.height = newHeight;
            state.imageData.totalPixels = totalValidPixels;
            state.totalPixels = totalValidPixels;
            state.paintedPixels = 0;

            // Use the paletted canvas for the overlay
            const finalImageBitmap = await createImageBitmap(tempCanvas);
            await overlayManager.setImage(finalImageBitmap);
            overlayManager.enable();
            toggleOverlayBtn.classList.add('active');

            updateStats();
            updateUI("resizeSuccess", "success", { width: newWidth, height: newHeight });
            closeResizeDialog();
        };

        downloadPreviewBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'wplace-preview.png';
            link.href = resizePreview.src;
            link.click();
        };

        cancelResize.onclick = closeResizeDialog;

        resizeOverlay.style.display = "block";
        resizeContainer.style.display = "block";
        
        // Reinitialize color palette with current available colors
        initializeColorPalette(resizeContainer);
        
        _updateResizePreview();
    }

    function closeResizeDialog() {
        resizeOverlay.style.display = "none";
        resizeContainer.style.display = "none";
        _updateResizePreview = () => {};
    }

    if (uploadBtn) {
      uploadBtn.addEventListener("click", async () => {
        const availableColors = Utils.extractAvailableColors();
        if (availableColors.length < 10) {
            updateUI("noColorsFound", "error");
            Utils.showAlert(Utils.t("noColorsFound"), "error");
            return;
        }

        if (!state.colorsChecked) {
            state.availableColors = availableColors;
            state.colorsChecked = true;
            updateUI("colorsFound", "success", { count: availableColors.length });
            updateStats();
            selectPosBtn.disabled = false;
            // Only enable resize button if image is also loaded
            if (state.imageLoaded) {
                resizeBtn.disabled = false;
            }
        }

        try {
          updateUI("loadingImage", "default")
          const imageSrc = await Utils.createImageUploader()
          if (!imageSrc) { 
              updateUI("colorsFound", "success", { count: state.availableColors.length });
              return;
          }

          const processor = new ImageProcessor(imageSrc)
          await processor.load()

          const { width, height } = processor.getDimensions()
          const pixels = processor.getPixelData()

          let totalValidPixels = 0;
          for (let i = 0; i < pixels.length; i += 4) {
              const isTransparent = pixels[i + 3] < CONFIG.TRANSPARENCY_THRESHOLD;
              const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(pixels[i], pixels[i+1], pixels[i+2]);
              if (!isTransparent && !isWhiteAndSkipped) {
                  totalValidPixels++;
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

          // Use the original image for the overlay initially
          const imageBitmap = await createImageBitmap(processor.img);
          await overlayManager.setImage(imageBitmap);
          overlayManager.enable();
          toggleOverlayBtn.disabled = false;
          toggleOverlayBtn.classList.add('active');

          // Only enable resize button if colors have also been captured
          if (state.colorsChecked) {
              resizeBtn.disabled = false;
          }
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
        if (state.imageLoaded && state.imageData.processor && state.colorsChecked) {
          showResizeDialog(state.imageData.processor)
        } else if (!state.colorsChecked) {
          Utils.showAlert("Please upload an image first to capture available colors", "warning")
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

        const tempFetch = async (url, options) => {
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

                  await overlayManager.setPosition(state.startPosition, state.region);

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

        const originalFetch = window.fetch;
        window.fetch = tempFetch;

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

    async function startPainting() {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI("missingRequirements", "error")
        return false
      }
      await ensureToken()
      if (!turnstileToken) return false

      state.running = true
      state.stopFlag = false
      startBtn.disabled = true
      stopBtn.disabled = false
      uploadBtn.disabled = true
      selectPosBtn.disabled = true
      resizeBtn.disabled = true
      saveBtn.disabled = true
      toggleOverlayBtn.disabled = true;

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
        toggleOverlayBtn.disabled = false;
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

        if (state.imageLoaded && state.paintedPixels > 0) {
          Utils.saveProgress()
          Utils.showAlert(Utils.t("autoSaved"), "success")
        }
      })
    }

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

    setTimeout(checkSavedProgress, 1000)

    if (cooldownSlider && cooldownValue) {
        cooldownSlider.addEventListener("input", (e) => {
            const threshold = parseInt(e.target.value);
            state.cooldownChargeThreshold = threshold;
            cooldownValue.textContent = threshold;
            saveBotSettings();
        });
    }

    loadBotSettings();
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

          if (alpha < CONFIG.TRANSPARENCY_THRESHOLD || (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))) {
              continue;
          }

      let targetRgb;
      if (Utils.isWhitePixel(r, g, b)) {
        targetRgb = [255, 255, 255];
      } else {
        targetRgb = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
      }

          const colorId = findClosestColor([r, g, b], state.availableColors);

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
            let success = await sendPixelBatch(pixelBatch, regionX, regionY)

            if (success === "token_error") {
                if (CONFIG.AUTO_CAPTCHA_ENABLED) {
                    updateUI("captchaSolving", "warning");
                    try {
                        await handleCaptcha();
                        success = await sendPixelBatch(pixelBatch, regionX, regionY);
                        if (success === "token_error") {
                           updateUI("captchaFailed", "error");
                           state.stopFlag = true;
                           break outerLoop;
                        }
                    } catch (e) {
                        updateUI("captchaFailed", "error");
                        state.stopFlag = true;
                        break outerLoop;
                    }
                } else {
                    updateUI("captchaNeeded", "error");
                    Utils.showAlert(Utils.t("captchaNeeded"), "error");
                    state.stopFlag = true;
                    break outerLoop;
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

              if (state.paintedPixels % 50 === 0) {
                Utils.saveProgress()
              }

              if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.length > 0) {
                const delayPerPixel = 1000 / state.paintingSpeed
                const totalDelay = Math.max(100, delayPerPixel * pixelBatch.length)
                await Utils.sleep(totalDelay)
              }
            }

            pixelBatch = []
          }

            while (state.currentCharges < state.cooldownChargeThreshold && !state.stopFlag) {
                const { charges, cooldown } = await WPlaceService.getCharges();
                state.currentCharges = Math.floor(charges);
                state.cooldown = cooldown;

                if (state.currentCharges >= state.cooldownChargeThreshold) {
                    updateStats();
                    break;
                }

                updateUI("noChargesThreshold", "warning", {
                    time: Utils.formatTime(state.cooldown),
                    threshold: state.cooldownChargeThreshold,
                    current: state.currentCharges
                });
                await updateStats();
                await Utils.sleep(state.cooldown);
            }
            if (state.stopFlag) break outerLoop;

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
          if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && pixelBatch.length > 0) {
            const delayPerPixel = 1000 / state.paintingSpeed
            const totalDelay = Math.max(100, delayPerPixel * pixelBatch.length)
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
      Utils.saveProgress()
    } else {
      updateUI("paintingComplete", "success", { count: state.paintedPixels })
      state.lastPosition = { x: 0, y: 0 }
      state.paintedMap = null
      Utils.clearProgress()
      overlayManager.clear();
      const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
      if (toggleOverlayBtn) {
          toggleOverlayBtn.classList.remove('active');
          toggleOverlayBtn.disabled = true;
      }
    }

    updateStats()
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
  if (!turnstileToken) {
    tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
    return "token_error"
  }

    const coords = new Array(pixelBatch.length * 2)
    const colors = new Array(pixelBatch.length)
    for (let i = 0; i < pixelBatch.length; i++) {
      const pixel = pixelBatch[i]
      coords[i * 2] = pixel.x
      coords[i * 2 + 1] = pixel.y
      colors[i] = pixel.color
    }

    try {
  const payload = { coords, colors, t: turnstileToken }

      const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (res.status === 403) {
        let data = null
        try { data = await res.json() } catch (_) {}
        console.error("❌ 403 Forbidden. Turnstile token might be invalid or expired.")
        turnstileToken = null
        tokenPromise = new Promise((resolve) => { _resolveToken = resolve })
        return "token_error"
      }
      const data = await res.json()
      return data?.painted === pixelBatch.length
    } catch (e) {
      console.error("Batch paint request failed:", e)
      return false
    }
  }

    function saveBotSettings() {
        try {
            const settings = {
                paintingSpeed: state.paintingSpeed,
                paintingSpeedEnabled: document.getElementById('enableSpeedToggle')?.checked,
                autoCaptchaEnabled: document.getElementById('enableAutoCaptchaToggle')?.checked,
                cooldownChargeThreshold: state.cooldownChargeThreshold,
                minimized: state.minimized,
                overlayOpacity: state.overlayOpacity,
                blueMarbleEnabled: document.getElementById('enableBlueMarbleToggle')?.checked,
            };
            CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled;
            CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled;

            localStorage.setItem("wplace-bot-settings", JSON.stringify(settings));
        } catch (e) {
            console.warn("Could not save bot settings:", e);
        }
    }

    function loadBotSettings() {
        try {
            const saved = localStorage.getItem("wplace-bot-settings");
            if (!saved) return;
            const settings = JSON.parse(saved);

            state.paintingSpeed = settings.paintingSpeed || CONFIG.PAINTING_SPEED.DEFAULT;
            state.cooldownChargeThreshold = settings.cooldownChargeThreshold || CONFIG.COOLDOWN_CHARGE_THRESHOLD;
            state.minimized = settings.minimized ?? false;
            CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled ?? false;
            CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled ?? false;
            state.overlayOpacity = settings.overlayOpacity ?? CONFIG.OVERLAY.OPACITY_DEFAULT;
            state.blueMarbleEnabled = settings.blueMarbleEnabled ?? CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;

            const speedSlider = document.getElementById('speedSlider');
            if (speedSlider) speedSlider.value = state.paintingSpeed;
            const speedValue = document.getElementById('speedValue');
            if (speedValue) speedValue.textContent = `${state.paintingSpeed} px/s`;

            const enableSpeedToggle = document.getElementById('enableSpeedToggle');
            if (enableSpeedToggle) enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED;
            
            const enableAutoCaptchaToggle = document.getElementById('enableAutoCaptchaToggle');
            if (enableAutoCaptchaToggle) enableAutoCaptchaToggle.checked = CONFIG.AUTO_CAPTCHA_ENABLED;
            
            const cooldownSlider = document.getElementById('cooldownSlider');
            if (cooldownSlider) cooldownSlider.value = state.cooldownChargeThreshold;
            const cooldownValue = document.getElementById('cooldownValue');
            if (cooldownValue) cooldownValue.textContent = state.cooldownChargeThreshold;
            
            const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
            if (overlayOpacitySlider) overlayOpacitySlider.value = state.overlayOpacity;
            const overlayOpacityValue = document.getElementById('overlayOpacityValue');
            if (overlayOpacityValue) overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
            const enableBlueMarbleToggle = document.getElementById('enableBlueMarbleToggle');
            if (enableBlueMarbleToggle) enableBlueMarbleToggle.checked = state.blueMarbleEnabled;

        } catch (e) {
            console.warn("Could not load bot settings:", e);
        }
    }

  createUI()
})()
