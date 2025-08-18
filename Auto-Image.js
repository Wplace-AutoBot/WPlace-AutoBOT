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
    OVERLAY_OPACITY_DEFAULT: 0.6,
    OVERLAY_SHREAD_EFFECT_DEFAULT: false, // Default OFF as requested
    OVERLAY_FOLLOW_PALETTE_DEFAULT: true, // Default ON as requested
    PAINTING_SPEED_ENABLED: false,
    AUTO_CAPTCHA_ENABLED: false, // Disabled by default
    COOLDOWN_CHARGE_THRESHOLD: 1, // Default wait threshold
    // --- START: Color data from colour-converter.js ---
    COLOR_PALETTE: [
      [0,0,0],[60,60,60],[120,120,120],[170,170,170],[210,210,210],[255,255,255],
      [96,0,24],[165,14,30],[237,28,36],[250,128,114],[228,92,26],[255,127,39],[246,170,9],
      [249,221,59],[255,250,188],[156,132,49],[197,173,49],[232,212,95],[74,107,58],[90,148,74],[132,197,115],
      [14,185,104],[19,230,123],[135,255,94],[12,129,110],[16,174,166],[19,225,190],[15,121,159],[96,247,242],
      [187,250,242],[40,80,158],[64,147,228],[125,199,255],[77,49,184],[107,80,246],[153,177,251],
      [74,66,132],[122,113,196],[181,174,241],[170,56,185],[224,159,249],
      [203,0,122],[236,31,128],[243,141,169],[155,82,73],[209,128,120],[250,182,164],
      [104,70,52],[149,104,42],[219,164,99],[123,99,82],[156,132,107],[214,181,148],
      [209,128,81],[248,178,119],[255,197,165],[109,100,63],[148,140,107],[205,197,158],
      [51,57,65],[109,117,141],[179,185,209]
    ],
    COLOR_NAMES: {
      "0,0,0": "Black", "60,60,60": "Dark Gray", "120,120,120": "Gray", "210,210,210": "Light Gray", "255,255,255": "White",
      "96,0,24": "Deep Red", "237,28,36": "Red", "255,127,39": "Orange", "246,170,9": "Gold", "249,221,59": "Yellow",
      "255,250,188": "Light Yellow", "14,185,104": "Dark Green", "19,230,123": "Green", "135,255,94": "Light Green",
      "12,129,110": "Dark Teal", "16,174,166": "Teal", "19,225,190": "Light Teal", "96,247,242": "Cyan", "40,80,158": "Dark Blue",
      "64,147,228": "Blue", "107,80,246": "Indigo", "153,177,251": "Light Indigo", "120,12,153": "Dark Purple",
      "170,56,185": "Purple", "224,159,249": "Light Purple", "203,0,122": "Dark Pink", "236,31,128": "Pink",
      "243,141,169": "Light Pink", "104,70,52": "Dark Brown", "149,104,42": "Brown", "248,178,119": "Beige",
      "170,170,170": "Medium Gray", "165,14,30": "Dark Red", "250,128,114": "Light Red", "228,92,26": "Dark Orange",
      "156,132,49": "Dark Goldenrod", "197,173,49": "Goldenrod", "232,212,95": "Light Goldenrod", "74,107,58": "Dark Olive",
      "90,148,74": "Olive", "132,197,115": "Light Olive", "15,121,159": "Dark Cyan", "187,250,242": "Light Cyan",
      "125,199,255": "Light Blue", "77,49,184": "Dark Indigo", "74,66,132": "Dark Slate Blue", "122,113,196": "Slate Blue",
      "181,174,241": "Light Slate Blue", "155,82,73": "Dark Peach", "209,128,120": "Peach", "250,182,164": "Light Peach",
      "219,164,99": "Light Brown", "123,99,82": "Dark Tan", "156,132,107": "Tan", "214,181,148": "Light Tan",
      "209,128,81": "Dark Beige", "255,197,165": "Light Beige", "109,100,63": "Dark Stone", "148,140,107": "Stone",
      "205,197,158": "Light Stone", "51,57,65": "Dark Slate", "109,117,141": "Slate", "179,185,209": "Light Slate",
    },
    PAID_COLORS: new Set([
      "170,170,170", "165,14,30", "250,128,114", "228,92,26", "156,132,49", "197,173,49", "232,212,95", "74,107,58",
      "90,148,74", "132,197,115", "15,121,159", "187,250,242", "125,199,255", "77,49,184", "74,66,132", "122,113,196",
      "181,174,241", "155,82,73", "209,128,120", "250,182,164", "219,164,99", "123,99,82", "156,132,107", "214,181,148",
      "209,128,81", "255,197,165", "109,100,63", "148,140,107", "205,197,158", "51,57,65", "109,117,141", "179,185,209",
    ]),
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
      const existingStyle = document.querySelector('style[data-wplace-theme="true"]')
      if (existingStyle) {
        existingStyle.remove()
      }
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
    overlayConfiguration: "Overlay Configuration",
    shreadEffect: "Shread Effect (Blue Marble Style)",
    shreadEffectDesc: "Renders the overlay as a pixel grid for better alignment.",
    followPalette: "Follow Enabled Color Palette",
    followPaletteDesc: "Overlay will only show colors currently enabled in the resize dialog.",
    overlayOpacity: "Overlay Opacity",
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
    overlayConfiguration: "Настройки наложения",
    shreadEffect: "Эффект сетки (стиль Blue Marble)",
    shreadEffectDesc: "Отображает наложение в виде пиксельной сетки для лучшего выравнивания.",
    followPalette: "Следовать включенным цветам",
    followPaletteDesc: "Наложение будет показывать только цвета, включенные в диалоге изменения размера.",
    overlayOpacity: "Прозрачность наложения",
  },
  id: {
    title: "WPlace Auto-Gambar",
    toggleOverlay: "Toggl Hamparan",
    scanColors: "Pindai Warna",
    uploadImage: "Unggah Gambar",
    resizeImage: "Ubah Ukuran Gambar",
    selectPosition: "Pilih Posisi",
    startPainting: "Mulai Melukis",
    stopPainting: "Hentikan Lukisan",
    checkingColors: "🔍 Memeriksa warna yang tersedia...",
    noColorsFound: "❌ Buka palet warna di situs dan coba lagi!",
    colorsFound: "✅ {count} warna tersedia ditemukan. Siap untuk diunggah.",
    loadingImage: "🖼️ Memuat gambar...",
    imageLoaded: "✅ Gambar dimuat dengan {count} piksel yang valid",
    imageError: "❌ Kesalahan memuat gambar",
    selectPositionAlert: "Lukis piksel pertama di lokasi di mana Anda ingin karya seni dimulai!",
    waitingPosition: "👆 Menunggu Anda melukis piksel referensi...",
    positionSet: "✅ Posisi berhasil diatur!",
    positionTimeout: "❌ Batas waktu untuk pemilihan posisi",
    startPaintingMsg: "🎨 Mulai melukis...",
    paintingProgress: "🧱 Kemajuan: {painted}/{total} piksel...",
    noCharges: "⌛ Tidak ada biaya. Menunggu {time}...",
    paintingStopped: "⏹️ Lukisan dihentikan oleh pengguna",
    paintingComplete: "✅ Lukisan selesai! {count} piksel dilukis.",
    paintingError: "❌ Kesalahan selama melukis",
    missingRequirements: "❌ Muat gambar dan pilih posisi terlebih dahulu",
    progress: "Kemajuan",
    pixels: "Piksel",
    charges: "Biaya",
    estimatedTime: "Perkiraan waktu",
    initMessage: "Klik 'Unggah Gambar' untuk memulai",
    waitingInit: "Menunggu inisialisasi...",
    resizeSuccess: "✅ Ukuran gambar diubah menjadi {width}x{height}",
    paintingPaused: "⏸️ Lukisan dijeda pada posisi X: {x}, Y: {y}",
    captchaNeeded: "❗ Token CAPTCHA diperlukan. Lukis satu piksel secara manual untuk melanjutkan.",
    saveData: "Simpan Kemajuan",
    loadData: "Muat Kemajuan",
    saveToFile: "Simpan ke File",
    loadFromFile: "Muat dari File",
    dataManager: "Manajer Data",
    autoSaved: "✅ Kemajuan disimpan secara otomatis",
    dataLoaded: "✅ Kemajuan berhasil dimuat",
    fileSaved: "✅ Kemajuan berhasil disimpan ke file",
    fileLoaded: "✅ Kemajuan berhasil dimuat dari file",
    noSavedData: "❌ Tidak ada kemajuan yang disimpan",
    savedDataFound: "✅ Kemajuan yang disimpan ditemukan! Muat untuk melanjutkan?",
    savedDate: "Disimpan pada: {date}",
    clickLoadToContinue: "Klik 'Muat Kemajuan' untuk melanjutkan.",
    fileError: "❌ Kesalahan memproses file",
    invalidFileFormat: "❌ Format file tidak valid",
    paintingSpeed: "Kecepatan Melukis",
    pixelsPerSecond: "piksel/detik",
    speedSetting: "Kecepatan: {speed} piksel/detik",
    settings: "Pengaturan",
    botSettings: "Pengaturan Bot",
    close: "Tutup",
    language: "Bahasa",
    themeSettings: "Pengaturan Tema",
    themeSettingsDesc: "Pilih tema warna pilihan Anda untuk antarmuka.",
    languageSelectDesc: "Pilih bahasa pilihan Anda. Perubahan akan segera berlaku.",
    autoCaptcha: "Pemecah CAPTCHA Otomatis",
    autoCaptchaDesc: "Secara otomatis mencoba memecahkan CAPTCHA dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
    applySettings: "Terapkan Pengaturan",
    settingsSaved: "✅ Pengaturan berhasil disimpan!",
    cooldownSettings: "Pengaturan Cooldown",
    waitCharges: "Tunggu hingga biaya mencapai",
    captchaSolving: "🤖 Mencoba memecahkan CAPTCHA...",
    captchaFailed: "❌ CAPTCHA otomatis gagal. Lukis piksel secara manual.",
    automation: "Otomatisasi",
    noChargesThreshold: "⌛ Menunggu biaya mencapai {threshold}. Saat ini {current}. Berikutnya dalam {time}...",
    overlayConfiguration: "Konfigurasi Hamparan",
    shreadEffect: "Efek Grid (Gaya Blue Marble)",
    shreadEffectDesc: "Merender hamparan sebagai kisi piksel untuk penyelarasan yang lebih baik.",
    followPalette: "Ikuti Palet Warna yang Diaktifkan",
    followPaletteDesc: "Hamparan hanya akan menampilkan warna yang saat ini diaktifkan dalam dialog ubah ukuran.",
    overlayOpacity: "Opasitas Hamparan",
  },
  pt: { /* ... */ },
  vi: { /* ... */ },
  fr: { /* ... */ },
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
    imageData: null, // Holds the FINAL, color-corrected image data
    stopFlag: false,
    colorsChecked: false,
    startPosition: null,
    selectingPosition: false,
    region: null,
    minimized: false,
    lastPosition: { x: 0, y: 0 },
    estimatedTime: 0,
    language: "en",
    paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT,
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    overlayOpacity: CONFIG.OVERLAY_OPACITY_DEFAULT,
    overlayShreadEffect: CONFIG.OVERLAY_SHREAD_EFFECT_DEFAULT,
    overlayFollowPalette: CONFIG.OVERLAY_FOLLOW_PALETTE_DEFAULT,
  }

  let _updateResizePreview = () => {};

  class OverlayManager {
    constructor() {
        this.isEnabled = false;
        this.startCoords = null;
        this.imageBitmap = null; // This will hold the FINAL, color-corrected bitmap
        this.chunkedTiles = new Map();
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
        
        const activeColorSet = new Set(state.activeColorPalette.map(rgb => rgb.join(',')));

        for (let ty = startTileY; ty <= endTileY; ty++) {
            for (let tx = startTileX; tx <= endTileX; tx++) {
                const tileKey = `${tx},${ty}`;

                const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
                const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;

                const sX = Math.max(0, imgStartX);
                const sY = Math.max(0, imgStartY);
                const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
                const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));
                
                if (sW <= 0 || sH <= 0) continue;

                const dX = Math.max(0, -imgStartX);
                const dY = Math.max(0, -imgStartY);
                
                const tempCanvas = new OffscreenCanvas(sW, sH);
                const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
                tempCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, 0, 0, sW, sH);
                const imageData = tempCtx.getImageData(0, 0, sW, sH);
                const data = imageData.data;

                const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
                const chunkCtx = chunkCanvas.getContext('2d');

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < CONFIG.TRANSPARENCY_THRESHOLD) continue;
                    
                    if (state.overlayFollowPalette && !activeColorSet.has(`${r},${g},${b}`)) continue;
                    
                    const x = (i / 4) % sW;
                    const y = Math.floor((i / 4) / sW);

                    chunkCtx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;

                    if (state.overlayShreadEffect) {
                        chunkCtx.fillRect(dX + x, dY + y, 0.5, 0.5);
                    } else {
                        chunkCtx.fillRect(dX + x, dY + y, 1, 1);
                    }
                }
                const chunkBitmap = await chunkCanvas.transferToImageBitmap();
                this.chunkedTiles.set(tileKey, chunkBitmap);
            }
        }
        console.log(`Overlay processed into ${this.chunkedTiles.size} chunks.`);
    }

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

                        ctx.drawImage(originalTileBitmap, 0, 0);
                        ctx.globalAlpha = state.overlayOpacity;
                        ctx.drawImage(chunkBitmap, 0, 0);

                        finalBlob = await canvas.convertToBlob({ type: 'image/png' });
                    } catch (e) {
                        console.error("Error compositing overlay:", e);
                    }
                }
            }
        }

        window.postMessage({
            source: 'auto-image-overlay',
            blobID: blobID,
            blobData: finalBlob
        }, '*');
    }
}

const overlayManager = new OverlayManager();

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
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 20px;
        border-radius: 8px; color: white; font-weight: 600; z-index: 10001; max-width: 400px;
        text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideDown 0.3s ease-out;
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
        if (!palette || palette.length === 0) return cor;
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
      return Array.from(colorElements)
        .filter((el) => !el.querySelector("svg"))
        .filter((el) => Number.parseInt(el.id.replace("color-", "")) !== 0)
        .map((el) => {
          const id = Number.parseInt(el.id.replace("color-", ""))
          const rgbStr = el.style.backgroundColor.match(/\d+/g)
          return { id, rgb: rgbStr ? rgbStr.map(Number) : [0, 0, 0] }
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
        return Utils.restoreProgress(data)
      } catch (error) {
        console.error("Error loading from file:", error)
        throw error
      }
    },
  }

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
      return { width: this.canvas.width, height: this.canvas.height }
    }
  }

  const WPlaceService = {
    async getCharges() {
      try {
        const res = await fetch("https://backend.wplace.live/me", { credentials: "include" })
        const data = await res.json()
        return {
          charges: data.charges?.count || 0,
          max: data.charges?.max || 1,
          cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
        }
      } catch (e) {
        console.error("Failed to get charges:", e)
        return { charges: 0, max: 1, cooldown: CONFIG.COOLDOWN_DEFAULT }
      }
    },
  }

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

  let updateUI = () => {}
  let updateStats = () => {}
  let updateDataButtons = () => {}

  function updateActiveColorPalette() {
      state.activeColorPalette = [];
      const activeSwatches = document.querySelectorAll('.wplace-color-swatch.active');
      if (activeSwatches) {
          activeSwatches.forEach(swatch => {
              const rgb = swatch.getAttribute('data-rgb').split(',').map(Number);
              state.activeColorPalette.push(rgb);
          });
      }
      if (document.querySelector('.resize-container')?.style.display === 'block') {
          _updateResizePreview();
      }
  }

  function toggleAllColors(select, isPaid) {
      const selector = isPaid ? '.wplace-color-swatch.paid' : '.wplace-color-swatch:not(.paid)';
      const swatches = document.querySelectorAll(selector);
      if (swatches) {
          swatches.forEach(swatch => {
              swatch.classList.toggle('active', select);
          });
      }
      updateActiveColorPalette();
  }

  function initializeColorPalette(container) {
      const freeContainer = container.querySelector('#colors-free');
      const paidContainer = container.querySelector('#colors-paid');
      if (!freeContainer || !paidContainer) return;
      freeContainer.innerHTML = '';
      paidContainer.innerHTML = '';
      const uniqueColors = [...new Set(CONFIG.COLOR_PALETTE.map(JSON.stringify))].map(JSON.parse);
      uniqueColors.forEach(rgb => {
          const key = rgb.join(',');
          const name = CONFIG.COLOR_NAMES[key] || `rgb(${key})`;
          const isPaid = CONFIG.PAID_COLORS.has(key);
          const colorItem = Utils.createElement('div', { className: 'wplace-color-item' });
          const swatch = Utils.createElement('button', {
              className: `wplace-color-swatch ${isPaid ? 'paid' : ''}`,
              title: name,
              'data-rgb': key,
          });
          swatch.style.backgroundColor = `rgb(${key})`;
          const nameLabel = Utils.createElement('span', { className: 'wplace-color-item-name' }, name);
          if (!isPaid) {
              swatch.classList.add('active');
          }
          swatch.addEventListener('click', () => {
              swatch.classList.toggle('active');
              updateActiveColorPalette();
          });
          colorItem.appendChild(swatch);
          colorItem.appendChild(nameLabel);
          if (isPaid) {
              paidContainer.appendChild(colorItem);
          } else {
              freeContainer.appendChild(colorItem);
          }
      });
      container.querySelector('#selectAllFreeBtn')?.addEventListener('click', () => toggleAllColors(true, false));
      container.querySelector('#unselectAllFreeBtn')?.addEventListener('click', () => toggleAllColors(false, false));
      container.querySelector('#selectAllPaidBtn')?.addEventListener('click', () => toggleAllColors(true, true));
      container.querySelector('#unselectAllPaidBtn')?.addEventListener('click', () => toggleAllColors(false, true));
      updateActiveColorPalette();
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
      @keyframes neonGlow { 0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; } 50% { text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor; } }
      @keyframes pixelBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.7; } }
      @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400px); } }
      @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); } }
      @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      #wplace-image-bot-container {
        position: fixed; top: 20px; right: 20px; width: 280px; max-height: calc(100vh - 40px);
        background: ${CONFIG.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)` : theme.primary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius}; padding: 0; box-shadow: ${theme.boxShadow}; z-index: 9998;
        font-family: ${theme.fontFamily}; color: ${theme.text}; animation: slideIn 0.4s ease-out;
        overflow-y: auto; overflow-x: hidden; ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease; user-select: none; ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      #wplace-stats-container {
        position: fixed; top: 20px; left: 20px; width: 280px; max-height: calc(1;(async () => {
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
    OVERLAY_OPACITY_DEFAULT: 0.6,
    OVERLAY_SHREAD_EFFECT_DEFAULT: false, // Default OFF as requested
    OVERLAY_FOLLOW_PALETTE_DEFAULT: true, // Default ON as requested
    PAINTING_SPEED_ENABLED: false,
    AUTO_CAPTCHA_ENABLED: false, // Disabled by default
    COOLDOWN_CHARGE_THRESHOLD: 1, // Default wait threshold
    // --- START: Color data from colour-converter.js ---
    COLOR_PALETTE: [
      [0,0,0],[60,60,60],[120,120,120],[170,170,170],[210,210,210],[255,255,255],
      [96,0,24],[165,14,30],[237,28,36],[250,128,114],[228,92,26],[255,127,39],[246,170,9],
      [249,221,59],[255,250,188],[156,132,49],[197,173,49],[232,212,95],[74,107,58],[90,148,74],[132,197,115],
      [14,185,104],[19,230,123],[135,255,94],[12,129,110],[16,174,166],[19,225,190],[15,121,159],[96,247,242],
      [187,250,242],[40,80,158],[64,147,228],[125,199,255],[77,49,184],[107,80,246],[153,177,251],
      [74,66,132],[122,113,196],[181,174,241],[170,56,185],[224,159,249],
      [203,0,122],[236,31,128],[243,141,169],[155,82,73],[209,128,120],[250,182,164],
      [104,70,52],[149,104,42],[219,164,99],[123,99,82],[156,132,107],[214,181,148],
      [209,128,81],[248,178,119],[255,197,165],[109,100,63],[148,140,107],[205,197,158],
      [51,57,65],[109,117,141],[179,185,209]
    ],
    COLOR_NAMES: {
      "0,0,0": "Black", "60,60,60": "Dark Gray", "120,120,120": "Gray", "210,210,210": "Light Gray", "255,255,255": "White",
      "96,0,24": "Deep Red", "237,28,36": "Red", "255,127,39": "Orange", "246,170,9": "Gold", "249,221,59": "Yellow",
      "255,250,188": "Light Yellow", "14,185,104": "Dark Green", "19,230,123": "Green", "135,255,94": "Light Green",
      "12,129,110": "Dark Teal", "16,174,166": "Teal", "19,225,190": "Light Teal", "96,247,242": "Cyan", "40,80,158": "Dark Blue",
      "64,147,228": "Blue", "107,80,246": "Indigo", "153,177,251": "Light Indigo", "120,12,153": "Dark Purple",
      "170,56,185": "Purple", "224,159,249": "Light Purple", "203,0,122": "Dark Pink", "236,31,128": "Pink",
      "243,141,169": "Light Pink", "104,70,52": "Dark Brown", "149,104,42": "Brown", "248,178,119": "Beige",
      "170,170,170": "Medium Gray", "165,14,30": "Dark Red", "250,128,114": "Light Red", "228,92,26": "Dark Orange",
      "156,132,49": "Dark Goldenrod", "197,173,49": "Goldenrod", "232,212,95": "Light Goldenrod", "74,107,58": "Dark Olive",
      "90,148,74": "Olive", "132,197,115": "Light Olive", "15,121,159": "Dark Cyan", "187,250,242": "Light Cyan",
      "125,199,255": "Light Blue", "77,49,184": "Dark Indigo", "74,66,132": "Dark Slate Blue", "122,113,196": "Slate Blue",
      "181,174,241": "Light Slate Blue", "155,82,73": "Dark Peach", "209,128,120": "Peach", "250,182,164": "Light Peach",
      "219,164,99": "Light Brown", "123,99,82": "Dark Tan", "156,132,107": "Tan", "214,181,148": "Light Tan",
      "209,128,81": "Dark Beige", "255,197,165": "Light Beige", "109,100,63": "Dark Stone", "148,140,107": "Stone",
      "205,197,158": "Light Stone", "51,57,65": "Dark Slate", "109,117,141": "Slate", "179,185,209": "Light Slate",
    },
    PAID_COLORS: new Set([
      "170,170,170", "165,14,30", "250,128,114", "228,92,26", "156,132,49", "197,173,49", "232,212,95", "74,107,58",
      "90,148,74", "132,197,115", "15,121,159", "187,250,242", "125,199,255", "77,49,184", "74,66,132", "122,113,196",
      "181,174,241", "155,82,73", "209,128,120", "250,182,164", "219,164,99", "123,99,82", "156,132,107", "214,181,148",
      "209,128,81", "255,197,165", "109,100,63", "148,140,107", "205,197,158", "51,57,65", "109,117,141", "179,185,209",
    ]),
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
      const existingStyle = document.querySelector('style[data-wplace-theme="true"]')
      if (existingStyle) {
        existingStyle.remove()
      }
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
    overlayConfiguration: "Overlay Configuration",
    shreadEffect: "Shread Effect (Blue Marble Style)",
    shreadEffectDesc: "Renders the overlay as a pixel grid for better alignment.",
    followPalette: "Follow Enabled Color Palette",
    followPaletteDesc: "Overlay will only show colors currently enabled in the resize dialog.",
    overlayOpacity: "Overlay Opacity",
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
    overlayConfiguration: "Настройки наложения",
    shreadEffect: "Эффект сетки (стиль Blue Marble)",
    shreadEffectDesc: "Отображает наложение в виде пиксельной сетки для лучшего выравнивания.",
    followPalette: "Следовать включенным цветам",
    followPaletteDesc: "Наложение будет показывать только цвета, включенные в диалоге изменения размера.",
    overlayOpacity: "Прозрачность наложения",
  },
  id: {
    title: "WPlace Auto-Gambar",
    toggleOverlay: "Toggl Hamparan",
    scanColors: "Pindai Warna",
    uploadImage: "Unggah Gambar",
    resizeImage: "Ubah Ukuran Gambar",
    selectPosition: "Pilih Posisi",
    startPainting: "Mulai Melukis",
    stopPainting: "Hentikan Lukisan",
    checkingColors: "🔍 Memeriksa warna yang tersedia...",
    noColorsFound: "❌ Buka palet warna di situs dan coba lagi!",
    colorsFound: "✅ {count} warna tersedia ditemukan. Siap untuk diunggah.",
    loadingImage: "🖼️ Memuat gambar...",
    imageLoaded: "✅ Gambar dimuat dengan {count} piksel yang valid",
    imageError: "❌ Kesalahan memuat gambar",
    selectPositionAlert: "Lukis piksel pertama di lokasi di mana Anda ingin karya seni dimulai!",
    waitingPosition: "👆 Menunggu Anda melukis piksel referensi...",
    positionSet: "✅ Posisi berhasil diatur!",
    positionTimeout: "❌ Batas waktu untuk pemilihan posisi",
    startPaintingMsg: "🎨 Mulai melukis...",
    paintingProgress: "🧱 Kemajuan: {painted}/{total} piksel...",
    noCharges: "⌛ Tidak ada biaya. Menunggu {time}...",
    paintingStopped: "⏹️ Lukisan dihentikan oleh pengguna",
    paintingComplete: "✅ Lukisan selesai! {count} piksel dilukis.",
    paintingError: "❌ Kesalahan selama melukis",
    missingRequirements: "❌ Muat gambar dan pilih posisi terlebih dahulu",
    progress: "Kemajuan",
    pixels: "Piksel",
    charges: "Biaya",
    estimatedTime: "Perkiraan waktu",
    initMessage: "Klik 'Unggah Gambar' untuk memulai",
    waitingInit: "Menunggu inisialisasi...",
    resizeSuccess: "✅ Ukuran gambar diubah menjadi {width}x{height}",
    paintingPaused: "⏸️ Lukisan dijeda pada posisi X: {x}, Y: {y}",
    captchaNeeded: "❗ Token CAPTCHA diperlukan. Lukis satu piksel secara manual untuk melanjutkan.",
    saveData: "Simpan Kemajuan",
    loadData: "Muat Kemajuan",
    saveToFile: "Simpan ke File",
    loadFromFile: "Muat dari File",
    dataManager: "Manajer Data",
    autoSaved: "✅ Kemajuan disimpan secara otomatis",
    dataLoaded: "✅ Kemajuan berhasil dimuat",
    fileSaved: "✅ Kemajuan berhasil disimpan ke file",
    fileLoaded: "✅ Kemajuan berhasil dimuat dari file",
    noSavedData: "❌ Tidak ada kemajuan yang disimpan",
    savedDataFound: "✅ Kemajuan yang disimpan ditemukan! Muat untuk melanjutkan?",
    savedDate: "Disimpan pada: {date}",
    clickLoadToContinue: "Klik 'Muat Kemajuan' untuk melanjutkan.",
    fileError: "❌ Kesalahan memproses file",
    invalidFileFormat: "❌ Format file tidak valid",
    paintingSpeed: "Kecepatan Melukis",
    pixelsPerSecond: "piksel/detik",
    speedSetting: "Kecepatan: {speed} piksel/detik",
    settings: "Pengaturan",
    botSettings: "Pengaturan Bot",
    close: "Tutup",
    language: "Bahasa",
    themeSettings: "Pengaturan Tema",
    themeSettingsDesc: "Pilih tema warna pilihan Anda untuk antarmuka.",
    languageSelectDesc: "Pilih bahasa pilihan Anda. Perubahan akan segera berlaku.",
    autoCaptcha: "Pemecah CAPTCHA Otomatis",
    autoCaptchaDesc: "Secara otomatis mencoba memecahkan CAPTCHA dengan mensimulasikan penempatan piksel manual saat token kedaluwarsa.",
    applySettings: "Terapkan Pengaturan",
    settingsSaved: "✅ Pengaturan berhasil disimpan!",
    cooldownSettings: "Pengaturan Cooldown",
    waitCharges: "Tunggu hingga biaya mencapai",
    captchaSolving: "🤖 Mencoba memecahkan CAPTCHA...",
    captchaFailed: "❌ CAPTCHA otomatis gagal. Lukis piksel secara manual.",
    automation: "Otomatisasi",
    noChargesThreshold: "⌛ Menunggu biaya mencapai {threshold}. Saat ini {current}. Berikutnya dalam {time}...",
    overlayConfiguration: "Konfigurasi Hamparan",
    shreadEffect: "Efek Grid (Gaya Blue Marble)",
    shreadEffectDesc: "Merender hamparan sebagai kisi piksel untuk penyelarasan yang lebih baik.",
    followPalette: "Ikuti Palet Warna yang Diaktifkan",
    followPaletteDesc: "Hamparan hanya akan menampilkan warna yang saat ini diaktifkan dalam dialog ubah ukuran.",
    overlayOpacity: "Opasitas Hamparan",
  },
  pt: { /* ... */ },
  vi: { /* ... */ },
  fr: { /* ... */ },
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
    imageData: null, // Holds the FINAL, color-corrected image data
    stopFlag: false,
    colorsChecked: false,
    startPosition: null,
    selectingPosition: false,
    region: null,
    minimized: false,
    lastPosition: { x: 0, y: 0 },
    estimatedTime: 0,
    language: "en",
    paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT,
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    overlayOpacity: CONFIG.OVERLAY_OPACITY_DEFAULT,
    overlayShreadEffect: CONFIG.OVERLAY_SHREAD_EFFECT_DEFAULT,
    overlayFollowPalette: CONFIG.OVERLAY_FOLLOW_PALETTE_DEFAULT,
  }

  let _updateResizePreview = () => {};

  class OverlayManager {
    constructor() {
        this.isEnabled = false;
        this.startCoords = null;
        this.imageBitmap = null; // This will hold the FINAL, color-corrected bitmap
        this.chunkedTiles = new Map();
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
        
        const activeColorSet = new Set(state.activeColorPalette.map(rgb => rgb.join(',')));

        for (let ty = startTileY; ty <= endTileY; ty++) {
            for (let tx = startTileX; tx <= endTileX; tx++) {
                const tileKey = `${tx},${ty}`;

                const imgStartX = (tx - startRegionX) * this.tileSize - startPixelX;
                const imgStartY = (ty - startRegionY) * this.tileSize - startPixelY;

                const sX = Math.max(0, imgStartX);
                const sY = Math.max(0, imgStartY);
                const sW = Math.min(imageWidth - sX, this.tileSize - (sX - imgStartX));
                const sH = Math.min(imageHeight - sY, this.tileSize - (sY - imgStartY));
                
                if (sW <= 0 || sH <= 0) continue;

                const dX = Math.max(0, -imgStartX);
                const dY = Math.max(0, -imgStartY);
                
                const tempCanvas = new OffscreenCanvas(sW, sH);
                const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
                tempCtx.drawImage(this.imageBitmap, sX, sY, sW, sH, 0, 0, sW, sH);
                const imageData = tempCtx.getImageData(0, 0, sW, sH);
                const data = imageData.data;

                const chunkCanvas = new OffscreenCanvas(this.tileSize, this.tileSize);
                const chunkCtx = chunkCanvas.getContext('2d');
                chunkCtx.imageSmoothingEnabled = false;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                    if (a < CONFIG.TRANSPARENCY_THRESHOLD) continue;
                    
                    if (state.overlayFollowPalette && !activeColorSet.has(`${r},${g},${b}`)) continue;
                    
                    const x = (i / 4) % sW;
                    const y = Math.floor((i / 4) / sW);

                    chunkCtx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;

                    if (state.overlayShreadEffect) {
                        chunkCtx.fillRect(dX + x, dY + y, 0.5, 0.5);
                    } else {
                        chunkCtx.fillRect(dX + x, dY + y, 1, 1);
                    }
                }
                const chunkBitmap = await chunkCanvas.transferToImageBitmap();
                this.chunkedTiles.set(tileKey, chunkBitmap);
            }
        }
        console.log(`Overlay processed into ${this.chunkedTiles.size} chunks.`);
    }

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

                        ctx.drawImage(originalTileBitmap, 0, 0);
                        ctx.globalAlpha = state.overlayOpacity;
                        ctx.drawImage(chunkBitmap, 0, 0);

                        finalBlob = await canvas.convertToBlob({ type: 'image/png' });
                    } catch (e) {
                        console.error("Error compositing overlay:", e);
                    }
                }
            }
        }

        window.postMessage({
            source: 'auto-image-overlay',
            blobID: blobID,
            blobData: finalBlob
        }, '*');
    }
}

const overlayManager = new OverlayManager();

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
      const response = await fetch("https://backend.wplace.live/me", { credentials: "include" })
      const data = await response.json()
      state.language = data.language === "pt" ? "pt" : "en"
    } catch {
      state.language = navigator.language.startsWith("pt") ? "pt" : "en"
    }
  }

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
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 20px;
        border-radius: 8px; color: white; font-weight: 600; z-index: 10001; max-width: 400px;
        text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideDown 0.3s ease-out;
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
        if (!palette || palette.length === 0) return cor;
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
      return Array.from(colorElements)
        .filter((el) => !el.querySelector("svg"))
        .filter((el) => Number.parseInt(el.id.replace("color-", "")) !== 0)
        .map((el) => {
          const id = Number.parseInt(el.id.replace("color-", ""))
          const rgbStr = el.style.backgroundColor.match(/\d+/g)
          return { id, rgb: rgbStr ? rgbStr.map(Number) : [0, 0, 0] }
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
        return Utils.restoreProgress(data)
      } catch (error) {
        console.error("Error loading from file:", error)
        throw error
      }
    },
  }

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
      return { width: this.canvas.width, height: this.canvas.height }
    }
  }

  const WPlaceService = {
    async getCharges() {
      try {
        const res = await fetch("https://backend.wplace.live/me", { credentials: "include" })
        const data = await res.json()
        return {
          charges: data.charges?.count || 0,
          max: data.charges?.max || 1,
          cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
        }
      } catch (e) {
        console.error("Failed to get charges:", e)
        return { charges: 0, max: 1, cooldown: CONFIG.COOLDOWN_DEFAULT }
      }
    },
  }

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

  let updateUI = () => {}
  let updateStats = () => {}
  let updateDataButtons = () => {}

  function updateActiveColorPalette() {
      state.activeColorPalette = [];
      const activeSwatches = document.querySelectorAll('.wplace-color-swatch.active');
      if (activeSwatches) {
          activeSwatches.forEach(swatch => {
              const rgb = swatch.getAttribute('data-rgb').split(',').map(Number);
              state.activeColorPalette.push(rgb);
          });
      }
      if (document.querySelector('.resize-container')?.style.display === 'block') {
          _updateResizePreview();
      }
  }

  function toggleAllColors(select, isPaid) {
      const selector = isPaid ? '.wplace-color-swatch.paid' : '.wplace-color-swatch:not(.paid)';
      const swatches = document.querySelectorAll(selector);
      if (swatches) {
          swatches.forEach(swatch => {
              swatch.classList.toggle('active', select);
          });
      }
      updateActiveColorPalette();
  }

  function initializeColorPalette(container) {
      const freeContainer = container.querySelector('#colors-free');
      const paidContainer = container.querySelector('#colors-paid');
      if (!freeContainer || !paidContainer) return;
      freeContainer.innerHTML = '';
      paidContainer.innerHTML = '';
      const uniqueColors = [...new Set(CONFIG.COLOR_PALETTE.map(JSON.stringify))].map(JSON.parse);
      uniqueColors.forEach(rgb => {
          const key = rgb.join(',');
          const name = CONFIG.COLOR_NAMES[key] || `rgb(${key})`;
          const isPaid = CONFIG.PAID_COLORS.has(key);
          const colorItem = Utils.createElement('div', { className: 'wplace-color-item' });
          const swatch = Utils.createElement('button', {
              className: `wplace-color-swatch ${isPaid ? 'paid' : ''}`,
              title: name,
              'data-rgb': key,
          });
          swatch.style.backgroundColor = `rgb(${key})`;
          const nameLabel = Utils.createElement('span', { className: 'wplace-color-item-name' }, name);
          if (!isPaid) {
              swatch.classList.add('active');
          }
          swatch.addEventListener('click', () => {
              swatch.classList.toggle('active');
              updateActiveColorPalette();
          });
          colorItem.appendChild(swatch);
          colorItem.appendChild(nameLabel);
          if (isPaid) {
              paidContainer.appendChild(colorItem);
          } else {
              freeContainer.appendChild(colorItem);
          }
      });
      container.querySelector('#selectAllFreeBtn')?.addEventListener('click', () => toggleAllColors(true, false));
      container.querySelector('#unselectAllFreeBtn')?.addEventListener('click', () => toggleAllColors(false, false));
      container.querySelector('#selectAllPaidBtn')?.addEventListener('click', () => toggleAllColors(true, true));
      container.querySelector('#unselectAllPaidBtn')?.addEventListener('click', () => toggleAllColors(false, true));
      updateActiveColorPalette();
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
      @keyframes neonGlow { 0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor; } 50% { text-shadow: 0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor; } }
      @keyframes pixelBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.7; } }
      @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(400px); } }
      @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); } }
      @keyframes slideIn { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      #wplace-image-bot-container {
        position: fixed; top: 20px; right: 20px; width: 280px; max-height: calc(100vh - 40px);
        background: ${CONFIG.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)` : theme.primary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius}; padding: 0; box-shadow: ${theme.boxShadow}; z-index: 9998;
        font-family: ${theme.fontFamily}; color: ${theme.text}; animation: slideIn 0.4s ease-out;
        overflow-y: auto; overflow-x: hidden; ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease; user-select: none; ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      #wplace-stats-container {
        position: fixed; top: 20px; left: 20px; width: 280px; max-height: calc(100vh - 40px);
        background: ${CONFIG.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${theme.primary} 0%, #1a1a1a 100%)` : theme.primary};
        border: ${theme.borderWidth} ${theme.borderStyle} ${CONFIG.currentTheme === "Classic Autobot" ? theme.accent : theme.text};
        border-radius: ${theme.borderRadius}; padding: 0; box-shadow: ${theme.boxShadow}; z-index: 9997;
        font-family: ${theme.fontFamily}; color: ${theme.text}; animation: slideIn 0.4s ease-out;
        overflow-y: auto; ${theme.backdropFilter ? `backdrop-filter: ${theme.backdropFilter};` : ""}
        transition: all 0.3s ease; user-select: none; ${CONFIG.currentTheme === "Neon Retro" ? "image-rendering: pixelated;" : ""}
      }
      #wplace-image-bot-container.wplace-dragging, #wplace-stats-container.wplace-dragging { transition: none; }
      .wplace-header {
        padding: 8px 12px;
        background: ${CONFIG.currentTheme === "Classic Autobot" ? `linear-gradient(135deg, ${theme.secondary} 0%, #2a2a2a 100%)` : theme.secondary};
        color: ${theme.highlight}; font-size: 13px; font-weight: 700; display: flex;
        justify-content: space-between; align-items: center; cursor: move; user-select: none;
        border-bottom: 1px solid ${CONFIG.currentTheme === "Classic Autobot" ? "rgba(255,255,255,0.1)" : theme.text};
        text-shadow: 0 1px 2px rgba(0,0,0,0.5); transition: background 0.2s ease; position: relative; z-index: 2;
      }
      .wplace-header-controls { display: flex; gap: 6px; }
      .wplace-header-btn {
        background: rgba(255,255,255,0.1); border: none; color: ${theme.text}; cursor: pointer;
        border-radius: 4px; width: 18px; height: 18px; font-size: 10px;
        display: flex; align-items: center; justify-content: center; transition: all 0.2s;
      }
      .wplace-header-btn:hover { background: ${theme.accent}; color: ${theme.text}; transform: scale(1.1); }
      .wplace-content { padding: 12px; display: block; position: relative; z-index: 2; }
      .wplace-content.wplace-hidden { display: none; }
      .wplace-section { margin-bottom: 12px; }
      .wplace-controls { display: flex; flex-direction: column; gap: 8px; }
      .wplace-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .wplace-row.single { grid-template-columns: 1fr; }
      .wplace-btn {
        padding: 8px 12px; border: none; border-radius: ${theme.borderRadius}; font-weight: 500;
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
        font-size: 11px; transition: all 0.3s ease; position: relative; overflow: hidden;
        font-family: ${theme.fontFamily};
      }
      .wplace-btn::before {
        content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        transition: left 0.5s ease;
      }
      .wplace-btn:hover:not(:disabled)::before { left: 100%; }
      .wplace-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
      .wplace-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .wplace-btn-primary { background: linear-gradient(135deg, ${theme.accent} 0%, #6a5acd 100%); color: white; }
      .wplace-btn-upload { background: linear-gradient(135deg, ${theme.secondary} 0%, #4a4a4a 100%); color: white; border: 1px dashed ${theme.highlight}; }
      .wplace-btn-start { background: linear-gradient(135deg, ${theme.success} 0%, #228b22 100%); color: white; }
      .wplace-btn-stop { background: linear-gradient(135deg, ${theme.error} 0%, #dc143c 100%); color: white; }
      .wplace-btn-select { background: linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%); color: white; }
      .wplace-btn-file { background: linear-gradient(135deg, #ff8c00 0%, #ff7f50 100%); color: white; }
      .wplace-btn-overlay.active { background: linear-gradient(135deg, #29b6f6 0%, #8e2de2 100%); box-shadow: 0 0 15px #8e2de2; }
      .wplace-stats { background: rgba(255,255,255,0.03); padding: 8px; border: 1px solid rgba(255,255,255,0.1); border-radius: ${theme.borderRadius}; margin-bottom: 8px; }
      .wplace-stat-item { display: flex; justify-content: space-between; padding: 4px 0; font-size: 11px; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .wplace-stat-item:last-child { border-bottom: none; }
      .wplace-stat-label { display: flex; align-items: center; gap: 6px; opacity: 0.9; }
      .wplace-stat-value { font-weight: 600; color: ${theme.highlight}; }
      .wplace-progress { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: ${theme.borderRadius}; margin: 8px 0; overflow: hidden; height: 6px; }
      .wplace-progress-bar { height: 100%; background: linear-gradient(135deg, ${theme.highlight} 0%, #9370db 100%); transition: width 0.5s ease; }
      .wplace-status { padding: 6px; border: 1px solid; border-radius: ${theme.borderRadius}; text-align: center; font-size: 11px; }
      .status-default { background: rgba(255,255,255,0.1); border-color: ${theme.text}; }
      .status-success { background: rgba(0, 255, 0, 0.1); border-color: ${theme.success}; color: ${theme.success}; }
      .status-error { background: rgba(255, 0, 0, 0.1); border-color: ${theme.error}; color: ${theme.error}; }
      .status-warning { background: rgba(255, 165, 0, 0.1); border-color: orange; color: orange; }
      .resize-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; }
      .resize-container { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: ${theme.primary}; padding: 20px; border: 1px solid ${theme.text}; border-radius: ${theme.borderRadius}; z-index: 10000; box-shadow: 0 0 20px rgba(0,0,0,0.5); width: 90%; max-width: 700px; max-height: 90vh; overflow: auto; }
      .resize-preview-wrapper { display: flex; justify-content: center; align-items: center; border: 1px solid ${theme.accent}; background: rgba(0,0,0,0.2); margin: 15px 0; min-height: 200px; overflow: auto; }
      .resize-preview { image-rendering: pixelated; }
      .resize-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center; }
      .resize-slider { width: 100%; }
      .resize-buttons { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
      .wplace-color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 10px; padding-top: 8px; }
      .wplace-color-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .wplace-color-item-name { font-size: 9px; color: #ccc; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
      .wplace-color-swatch { width: 22px; height: 22px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; transition: transform 0.1s; position: relative; }
      .wplace-color-swatch.paid { border-color: gold; }
      .wplace-color-swatch:not(.active) { opacity: 0.3; filter: grayscale(80%); }
      .wplace-color-swatch.active::after { content: '✔'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 12px; text-shadow: 0 0 3px black; }
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
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t("settings")}"><i class="fas fa-cog"></i></button>
          <button id="statsBtn" class="wplace-header-btn" title="Show Stats"><i class="fas fa-chart-bar"></i></button>
          <button id="minimizeBtn" class="wplace-header-btn" title="Minimize"><i class="fas fa-minus"></i></button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">${Utils.t("initMessage")}</div>
          <div class="wplace-progress"><div id="progressBar" class="wplace-progress-bar" style="width: 0%"></div></div>
        </div>
        <div class="wplace-section">
          <div class="wplace-controls">
            <div class="wplace-row">
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload"><i class="fas fa-upload"></i><span>${Utils.t("uploadImage")}</span></button>
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled><i class="fas fa-expand"></i><span>${Utils.t("resizeImage")}</span></button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled><i class="fas fa-crosshairs"></i><span>${Utils.t("selectPosition")}</span></button>
            </div>
            <div class="wplace-row">
              <button id="startBtn" class="wplace-btn wplace-btn-start" disabled><i class="fas fa-play"></i><span>${Utils.t("startPainting")}</span></button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled><i class="fas fa-stop"></i><span>${Utils.t("stopPainting")}</span></button>
            </div>
             <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled><i class="fas fa-eye"></i><span>${Utils.t("toggleOverlay")}</span></button>
            </div>
          </div>
        </div>
        <div class="wplace-section">
          <div class="wplace-controls">
            <div class="wplace-row">
                <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled><i class="fas fa-download"></i><span>${Utils.t("saveToFile")}</span></button>
                <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file"><i class="fas fa-upload"></i><span>${Utils.t("loadFromFile")}</span></button>
            </div>
          </div>
        </div>
      </div>
    `

    const statsContainer = document.createElement("div")
    statsContainer.id = "wplace-stats-container"
    statsContainer.style.display = "none"
    statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title"><i class="fas fa-chart-bar"></i><span>Painting Stats</span></div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="Refresh Charges"><i class="fas fa-sync"></i></button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="Close Stats"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea"><div class="wplace-stat-item"><div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t("initMessage")}</div></div></div>
        </div>
      </div>
    `

    const settingsContainer = document.createElement("div")
    settingsContainer.id = "wplace-settings-container"
    settingsContainer.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 16px;
      padding: 0; z-index: 10002; display: none; min-width: 420px; max-width: 480px; color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
      backdrop-filter: blur(10px); overflow: hidden; animation: settingsSlideIn 0.4s ease-out;
    `

    settingsContainer.innerHTML = `
      <div class="wplace-settings-header" style="background: rgba(255,255,255,0.1); padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: move;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 300; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-cog" style="font-size: 18px; animation: spin 2s linear infinite;"></i>
            ${Utils.t("settings")}
          </h3>
          <button id="closeSettingsBtn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 14px;" onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'">✕</button>
        </div>
      </div>
      <div style="padding: 25px; max-height: 70vh; overflow-y: auto;">
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-layer-group" style="color: #43e97b;"></i>${Utils.t("overlayConfiguration")}</label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px;">
              <label for="overlayShreadEffectToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div><span style="font-weight: 500;">${Utils.t("shreadEffect")}</span><p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">${Utils.t("shreadEffectDesc")}</p></div>
                  <input type="checkbox" id="overlayShreadEffectToggle" ${state.overlayShreadEffect ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
              <hr style="border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;">
              <label for="overlayFollowPaletteToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                  <div><span style="font-weight: 500;">${Utils.t("followPalette")}</span><p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">${Utils.t("followPaletteDesc")}</p></div>
                  <input type="checkbox" id="overlayFollowPaletteToggle" ${state.overlayFollowPalette ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/>
              </label>
              <hr style="border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;">
              <div>
                <label for="overlayOpacitySlider" style="display: block; margin-bottom: 10px; font-weight: 500;">${Utils.t("overlayOpacity")}</label>
                <div style="display: flex; align-items: center; gap: 15px;">
                  <input type="range" id="overlayOpacitySlider" min="0" max="100" value="${state.overlayOpacity * 100}" style="flex: 1; height: 8px; background: linear-gradient(to right, #43e97b 0%, #38f9d7 100%); border-radius: 4px; outline: none; -webkit-appearance: none; cursor: pointer;">
                  <div id="overlayOpacityValue" style="min-width: 50px; text-align: center; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; color: white; font-weight: bold;">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
              </div>
          </div>
        </div>
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-robot" style="color: #4facfe;"></i>${Utils.t("automation")}</label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px;"><label for="enableAutoCaptchaToggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;"><div><span style="font-weight: 500;">${Utils.t("autoCaptcha")}</span><p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">${Utils.t("autoCaptchaDesc")}</p></div><input type="checkbox" id="enableAutoCaptchaToggle" ${CONFIG.AUTO_CAPTCHA_ENABLED ? 'checked' : ''} style="cursor: pointer; width: 20px; height: 20px;"/></label></div>
        </div>
        <div style="margin-bottom: 25px;">
            <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-tachometer-alt" style="color: #4facfe;"></i>${Utils.t("paintingSpeed")}</label>
            <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${CONFIG.PAINTING_SPEED.DEFAULT}" style="flex: 1; height: 8px; background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); border-radius: 4px; outline: none; -webkit-appearance: none; cursor: pointer;">
                    <div id="speedValue" style="min-width: 70px; text-align: center; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 8px 12px; border-radius: 8px; color: white; font-weight: bold;">${CONFIG.PAINTING_SPEED.DEFAULT} px/s</div>
                </div>
                <label style="display: flex; align-items: center; gap: 8px; color: white; margin-top: 10px;"><input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''} style="cursor: pointer;"/><span>Enable painting speed limit</span></label>
            </div>
        </div>
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 12px; color: white; font-weight: 500; font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fas fa-globe" style="color: #ffeaa7;"></i>${Utils.t("language")}</label>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 18px;">
            <select id="languageSelect" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; outline: none; cursor: pointer;">
              <option value="id" ${state.language === 'id' ? 'selected' : ''} style="background: #2d3748;">🇮🇩 Bahasa Indonesia</option>
              <option value="vi" ${state.language === 'vi' ? 'selected' : ''} style="background: #2d3748;">🇻🇳 Tiếng Việt</option>
              <option value="ru" ${state.language === 'ru' ? 'selected' : ''} style="background: #2d3748;">🇷🇺 Русский</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''} style="background: #2d3748;">🇺🇸 English</option>
              <option value="pt" ${state.language === 'pt' ? 'selected' : ''} style="background: #2d3748;">🇧🇷 Português</option>
              <option value="fr" ${state.language === 'fr' ? 'selected' : ''} style="background: #2d3748;">🇫🇷 Français</option>
            </select>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 10px;"><button id="applySettingsBtn" style="width: 100%; ${CONFIG.CSS_CLASSES.BUTTON_PRIMARY}"><i class="fas fa-check"></i> ${Utils.t("applySettings")}</button></div>
      </div>
    `

    const resizeContainer = document.createElement("div")
    resizeContainer.className = "resize-container"
    resizeContainer.innerHTML = `
      <h3 style="color: ${theme.text}">${Utils.t("resizeImage")}</h3>
      <div class="resize-controls">
        <label>Width: <span id="widthValue">0</span>px<input type="range" id="widthSlider" class="resize-slider"></label>
        <label>Height: <span id="heightValue">0</span>px<input type="range" id="heightSlider" class="resize-slider"></label>
        <label><input type="checkbox" id="keepAspect" checked> Keep Aspect Ratio</label>
        <label><input type="checkbox" id="paintWhiteToggle" checked> Paint White Pixels</label>
      </div>
      <div class="resize-preview-wrapper"><img id="resizePreview" class="resize-preview"></div>
      <div id="color-palette-section" style="margin-top: 15px;">
          <div class="wplace-row">
              <button id="selectAllFreeBtn" class="wplace-btn">All Free</button>
              <button id="unselectAllFreeBtn" class="wplace-btn">None Free</button>
          </div>
          <div id="colors-free" class="wplace-color-grid"></div>
          <hr style="border: none; height: 1px; background: rgba(255,255,255,0.1); margin: 8px 0;">
          <div class="wplace-row">
              <button id="selectAllPaidBtn" class="wplace-btn">All Paid</button>
              <button id="unselectAllPaidBtn" class="wplace-btn">None Paid</button>
          </div>
          <div id="colors-paid" class="wplace-color-grid"></div>
      </div>
      <div class="resize-buttons">
        <button id="confirmResize" class="wplace-btn wplace-btn-start"><i class="fas fa-check"></i><span>Apply</span></button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop"><i class="fas fa-times"></i><span>Cancel</span></button>
      </div>
    `

    document.body.appendChild(container)
    document.body.appendChild(statsContainer)
    document.body.appendChild(settingsContainer)
    document.body.appendChild(resizeContainer)
    const resizeOverlay = Utils.createElement('div', { className: 'resize-overlay' });
    document.body.appendChild(resizeOverlay);

    const uploadBtn = container.querySelector("#uploadBtn")
    const resizeBtn = container.querySelector("#resizeBtn")
    const selectPosBtn = container.querySelector("#selectPosBtn")
    const startBtn = container.querySelector("#startBtn")
    const stopBtn = container.querySelector("#stopBtn")
    const toggleOverlayBtn = container.querySelector("#toggleOverlayBtn");
    
    makeDraggable(container)
    makeDraggable(statsContainer)
    makeDraggable(settingsContainer)

    settingsContainer.querySelector("#settingsBtn")?.addEventListener("click", () => settingsContainer.style.display = 'block');
    settingsContainer.querySelector("#closeSettingsBtn").addEventListener("click", () => settingsContainer.style.display = 'none');
    settingsContainer.querySelector("#applySettingsBtn").addEventListener("click", () => {
        saveBotSettings();
        Utils.showAlert(Utils.t("settingsSaved"), "success");
        settingsContainer.style.display = 'none';
    });
    settingsContainer.querySelector("#languageSelect").addEventListener("change", (e) => {
        state.language = e.target.value;
        localStorage.setItem('wplace_language', state.language);
        createUI();
    });
    settingsContainer.querySelector("#overlayShreadEffectToggle").addEventListener('change', (e) => {
        state.overlayShreadEffect = e.target.checked;
        if (overlayManager.imageBitmap) overlayManager.processImageIntoChunks();
    });
    settingsContainer.querySelector("#overlayFollowPaletteToggle").addEventListener('change', (e) => {
        state.overlayFollowPalette = e.target.checked;
        if (overlayManager.imageBitmap) overlayManager.processImageIntoChunks();
    });
    const overlayOpacitySlider = settingsContainer.querySelector("#overlayOpacitySlider");
    const overlayOpacityValue = settingsContainer.querySelector("#overlayOpacityValue");
    overlayOpacitySlider.addEventListener('input', (e) => {
        const opacity = parseInt(e.target.value, 10);
        state.overlayOpacity = opacity / 100;
        overlayOpacityValue.textContent = `${opacity}%`;
    });
    
    statsContainer.querySelector("#statsBtn")?.addEventListener("click", () => statsContainer.style.display = statsContainer.style.display === 'none' ? 'block' : 'none');
    statsContainer.querySelector("#closeStatsBtn").addEventListener("click", () => statsContainer.style.display = 'none');
    statsContainer.querySelector("#refreshChargesBtn").addEventListener("click", updateStats);
    
    toggleOverlayBtn.addEventListener('click', () => {
        const isEnabled = overlayManager.toggle();
        toggleOverlayBtn.classList.toggle('active', isEnabled);
        Utils.showAlert(`Overlay ${isEnabled ? 'enabled' : 'disabled'}.`, 'info');
    });

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
        }
        try {
          updateUI("loadingImage", "default")
          const imageSrc = await Utils.createImageUploader()
          if (!imageSrc) { 
              updateUI("colorsFound", "success", { count: state.availableColors.length });
              return;
          }
          const processor = new ImageProcessor(imageSrc);
          await processor.load();
          state.imageData = { processor }; // Store processor for resizing
          state.imageLoaded = true;
          resizeBtn.disabled = false;
          toggleOverlayBtn.disabled = false;
          updateUI("imageLoaded", "success", { count: 0 }); // Count is unknown until resize
          showResizeDialog(processor);
        } catch {
          updateUI("imageError", "error")
        }
    });

    resizeBtn.addEventListener("click", () => {
        if (state.imageLoaded && state.imageData.processor) {
          showResizeDialog(state.imageData.processor)
        }
    });
    
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
          if (typeof url === "string" && url.includes("/pixel/") && options?.method === "POST") {
            const response = await originalFetch(url, options);
            const data = await response.clone().json();
            if (data?.painted === 1) {
              const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/);
              if (regionMatch) state.region = { x: +regionMatch[1], y: +regionMatch[2] };
              const payload = JSON.parse(options.body);
              state.startPosition = { x: payload.coords[0], y: payload.coords[1] };
              state.lastPosition = { x: 0, y: 0 };
              await overlayManager.setPosition(state.startPosition, state.region);
              if (state.imageLoaded) startBtn.disabled = false;
              window.fetch = originalFetch;
              state.selectingPosition = false;
              updateUI("positionSet", "success");
            }
            return response;
          }
          return originalFetch(url, options);
        };
        setTimeout(() => {
          if (state.selectingPosition) {
            window.fetch = originalFetch;
            state.selectingPosition = false;
            updateUI("positionTimeout", "error");
          }
        }, 120000);
    });
    
    startBtn.addEventListener("click", () => {
        // ... start painting logic
    });
    stopBtn.addEventListener("click", () => {
        // ... stop painting logic
    });

    function showResizeDialog(processor) {
        const { width, height } = processor.getDimensions();
        const aspectRatio = width / height;
        const widthSlider = resizeContainer.querySelector("#widthSlider");
        const heightSlider = resizeContainer.querySelector("#heightSlider");
        const widthValue = resizeContainer.querySelector("#widthValue");
        const heightValue = resizeContainer.querySelector("#heightValue");
        const keepAspect = resizeContainer.querySelector("#keepAspect");
        const paintWhiteToggle = resizeContainer.querySelector("#paintWhiteToggle");
        const resizePreview = resizeContainer.querySelector("#resizePreview");

        widthSlider.value = width;
        heightSlider.value = height;
        widthSlider.max = width * 2;
        heightSlider.max = height * 2;
        widthValue.textContent = width;
        heightValue.textContent = height;
        paintWhiteToggle.checked = state.paintWhitePixels;

        _updateResizePreview = () => {
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);
            widthValue.textContent = newWidth;
            heightValue.textContent = newHeight;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = newWidth;
            tempCanvas.height = newHeight;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(processor.img, 0, 0, newWidth, newHeight);
            const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                if (a < CONFIG.TRANSPARENCY_THRESHOLD || (!state.paintWhitePixels && Utils.isWhitePixel(r,g,b))) {
                    data[i + 3] = 0; continue;
                }
                const [nr, ng, nb] = Utils.findClosestPaletteColor(r,g,b, state.activeColorPalette);
                data[i] = nr; data[i+1] = ng; data[i+2] = nb;
            }
            tempCtx.putImageData(imgData, 0, 0);
            resizePreview.src = tempCanvas.toDataURL();
        };

        widthSlider.oninput = () => {
            if (keepAspect.checked) heightSlider.value = Math.round(widthSlider.value / aspectRatio);
            _updateResizePreview();
        };
        heightSlider.oninput = () => {
            if (keepAspect.checked) widthSlider.value = Math.round(heightSlider.value * aspectRatio);
            _updateResizePreview();
        };
        paintWhiteToggle.onchange = (e) => {
            state.paintWhitePixels = e.target.checked;
            _updateResizePreview();
        };

        resizeContainer.querySelector("#confirmResize").onclick = async () => {
            const newWidth = parseInt(widthSlider.value, 10);
            const newHeight = parseInt(heightSlider.value, 10);
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = newWidth;
            finalCanvas.height = newHeight;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.imageSmoothingEnabled = false;
            finalCtx.drawImage(processor.img, 0, 0, newWidth, newHeight);
            const imgData = finalCtx.getImageData(0, 0, newWidth, newHeight);
            const data = imgData.data;
            let totalValidPixels = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
                if (a < CONFIG.TRANSPARENCY_THRESHOLD || (!state.paintWhitePixels && Utils.isWhitePixel(r,g,b))) {
                    data[i + 3] = 0; continue;
                }
                const [nr, ng, nb] = Utils.findClosestPaletteColor(r,g,b, state.activeColorPalette);
                data[i] = nr; data[i+1] = ng; data[i+2] = nb;
                data[i+3] = 255;
                totalValidPixels++;
            }
            finalCtx.putImageData(imgData, 0, 0);

            state.imageData = {
                ...state.imageData,
                pixels: data,
                width: newWidth,
                height: newHeight,
                totalPixels: totalValidPixels
            };
            state.totalPixels = totalValidPixels;
            state.paintedPixels = 0;

            const finalImageBitmap = await createImageBitmap(finalCanvas);
            await overlayManager.setImage(finalImageBitmap);
            overlayManager.enable();
            toggleOverlayBtn.classList.add('active');
            updateStats();
            updateUI("resizeSuccess", "success", { width: newWidth, height: newHeight });
            closeResizeDialog();
        };

        resizeContainer.querySelector("#cancelResize").onclick = closeResizeDialog;

        resizeOverlay.style.display = "block";
        resizeContainer.style.display = "block";
        _updateResizePreview();
    }

    function closeResizeDialog() {
        document.querySelector(".resize-overlay").style.display = "none";
        document.querySelector(".resize-container").style.display = "none";
        _updateResizePreview = () => {};
    }

    loadBotSettings();
    initializeColorPalette(resizeContainer);
  }

  // ... (rest of the script logic like processImage, sendPixelBatch, etc.)

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

          if (alpha < CONFIG.TRANSPARENCY_THRESHOLD) continue;

          const colorId = findClosestColor([r,g,b], state.availableColors);

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
    } finally {
      // Cleanup
    }
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
      if (!turnstileToken) {
        tokenPromise = new Promise((resolve) => { _resolveToken = resolve });
        return "token_error"
      }
      const coords = pixelBatch.map(p => [p.x, p.y]).flat();
      const colors = pixelBatch.map(p => p.color);
      try {
        const payload = { coords, colors, t: turnstileToken }
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            credentials: "include",
            body: JSON.stringify(payload),
        });
        if (res.status === 403) {
            turnstileToken = null;
            return "token_error";
        }
        const data = await res.json();
        return data?.painted === pixelBatch.length;
      } catch (e) {
        console.error("Batch paint request failed:", e);
        return false;
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
                overlayShreadEffect: state.overlayShreadEffect,
                overlayFollowPalette: state.overlayFollowPalette,
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
            state.overlayOpacity = settings.overlayOpacity ?? CONFIG.OVERLAY_OPACITY_DEFAULT;
            state.overlayShreadEffect = settings.overlayShreadEffect ?? CONFIG.OVERLAY_SHREAD_EFFECT_DEFAULT;
            state.overlayFollowPalette = settings.overlayFollowPalette ?? CONFIG.OVERLAY_FOLLOW_PALETTE_DEFAULT;

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
            const overlayShreadEffectToggle = document.getElementById('overlayShreadEffectToggle');
            if (overlayShreadEffectToggle) overlayShreadEffectToggle.checked = state.overlayShreadEffect;
            const overlayFollowPaletteToggle = document.getElementById('overlayFollowPaletteToggle');
            if (overlayFollowPaletteToggle) overlayFollowPaletteToggle.checked = state.overlayFollowPalette;
            const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
            if (overlayOpacitySlider) overlayOpacitySlider.value = state.overlayOpacity * 100;
            const overlayOpacityValue = document.getElementById('overlayOpacityValue');
            if (overlayOpacityValue) overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
        } catch (e) {
            console.warn("Could not load bot settings:", e);
        }
    }

  createUI()
})()
