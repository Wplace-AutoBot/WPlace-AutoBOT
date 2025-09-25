// ==UserScript==
// @name         WPlaceBot
// @namespace    http://tampermonkey.net/
// @version      2025-08-08.3
// @description  Bot
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
    if (window.loadedTranslations && window.loadedTranslations[key]) {
      let text = window.loadedTranslations[key];
      if (params) {
        Object.keys(params).forEach(paramKey => {
          text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
        });
      }
      return text;
    }

    // Try with state.language if available
    if (window.state && window.state.language && window.loadedTranslations && window.loadedTranslations[window.state.language] && window.loadedTranslations[window.state.language][key]) {
      let text = window.loadedTranslations[window.state.language][key];
      if (params) {
        Object.keys(params).forEach(paramKey => {
          text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
        });
      }
      return text;
    }
  } catch (error) {
    console.warn('Error in getText fallback:', error);
  }

  return key; // Fallback to key if no translation found
}

; (async () => {
  // Prevent multiple instances of this script from running
  if (window.WPLACE_AUTO_IMAGE_LOADED) {
    console.log('%c⚠️ Auto-Image script already loaded, skipping duplicate execution', 'color: #ff9800; font-weight: bold;');
    return;
  }
  window.WPLACE_AUTO_IMAGE_LOADED = true;

  console.log('%c🚀 WPlace AutoBot Auto-Image Starting...', 'color: #00ff41; font-weight: bold; font-size: 16px;');

  const buyTypes = [
    'none',
    'max_charges',
    'paint_charges'
  ];

  // CONFIGURATION CONSTANTS
  const CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
      MIN: 1, // Minimum 1 pixel batch size
      MAX: 1000, // Maximum 1000 pixels batch size
      DEFAULT: 5, // Default 5 pixels batch size
    },
    BATCH_MODE: 'normal', // "normal" or "random" - default to normal
    RANDOM_BATCH_RANGE: {
      MIN: 3, // Random range minimum
      MAX: 20, // Random range maximum
    },
    PAINTING_SPEED_ENABLED: false, // Off by default
    AUTO_CAPTCHA_ENABLED: true, // Turnstile generator enabled by default
    TOKEN_SOURCE: 'generator', // "generator", "manual", or "hybrid" - default to generator
    COOLDOWN_CHARGE_THRESHOLD: 1, // Default wait threshold
    // Desktop Notifications (defaults)
    NOTIFICATIONS: {
      ENABLED: false,
      ON_CHARGES_REACHED: true,
      ONLY_WHEN_UNFOCUSED: true,
      REPEAT_MINUTES: 5, // repeat reminder while threshold condition holds
    },
    OVERLAY: {
      OPACITY_DEFAULT: 0.6,
      BLUE_MARBLE_DEFAULT: false,
      ditheringEnabled: false,
    }, // --- START: Color data from colour-converter.js ---
    // New color structure with proper ID mapping
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
    }, // --- END: Color data ---
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
      `,
    },
    THEMES: {
      'Classic Autobot': {
        primary: '#000000',
        secondary: '#111111',
        accent: '#222222',
        text: '#ffffff',
        highlight: '#775ce3',
        success: '#00ff00',
        error: '#ff0000',
        warning: '#ffaa00',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: '12px',
        borderStyle: 'solid',
        borderWidth: '1px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        animations: {
          glow: false,
          scanline: false,
          'pixel-blink': false,
        },
      },
      'Classic Light': {
        primary: '#E0E0E1',
        secondary: '#FBFBFB',
        accent: '#F3F3F3',
        text: '#203C5D',
        highlight: '#203C5D',
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: '12px',
        borderStyle: 'solid',
        borderWidth: '1px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(10px)',
        animations: {
          glow: false,
          scanline: false,
          'pixel-blink': false,
        },
      },
      'Classic Teal': {
        primary: '#2BCAB0',
        secondary: '#41726D',
        accent: '#046A79',
        text: '#0B483C',
        highlight: '#0B483C',
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        borderRadius: '12px',
        borderStyle: 'solid',
        borderWidth: '1px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
        backdropFilter: 'none',
        animations: {
          glow: false,
          scanline: false,
          'pixel-blink': false,
        },
      },
      'Neon Retro': {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#0f3460',
        text: '#00ff41',
        highlight: '#ff6b35',
        success: '#39ff14',
        error: '#ff073a',
        warning: '#ffff00',
        neon: '#00ffff',
        purple: '#bf00ff',
        pink: '#ff1493',
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '3px',
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)',
        backdropFilter: 'none',
        animations: {
          glow: true,
          scanline: true,
          'pixel-blink': true,
        },
      },
      'Neon Retro Cyan': {
        primary: '#1959A1',
        secondary: '#3C74AF',
        accent: '#538CC0',
        text: '#81DCF7',
        highlight: '#EA9C00',
        success: '#39ff14',
        error: '#ff073a',
        warning: '#ffff00',
        neon: '00ffff',
        purple: '#bf00ff',
        pink: '#ff1493',
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '3px',
        boxShadow: '0 0 20px rgba(234 156 0, 0.3), inset 0 0 20px rgba(234 156 0, 0.1)',
        backdropFilter: 'none',
        animations: {
          glow: true,
          scanline: true,
          'pixel-blink': true,
        },
      },
      'Neon Retro Light': {
        primary: '#E0E0E1',
        secondary: '#FBFBFB',
        accent: '#F3F3F3',
        text: '#203C5D',
        highlight: '#203C5D',
        success: '#39ff14',
        error: '#ff073a',
        warning: '#ffff00',
        neon: '#203C5D',
        purple: '#bf00ff',
        pink: '#ff1493',
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '3px',
        boxShadow: '0 0 20px rgba(234 156 0, 0.3), inset 0 0 20px rgba(234 156 0, 0.1)',
        backdropFilter: 'none',
        animations: {
          glow: true,
          scanline: true,
          'pixel-blink': true,
        },
      },
      'Neon Retro Purple': {
        primary: '#1A172A',
        secondary: '#34315E',
        accent: '#1A172A',
        text: '#F8A9FD',
        highlight: '#F8A9FD',
        success: '#39ff14',
        error: '#ff073a',
        warning: '#ffff00',
        neon: '#F8A9FD',
        purple: '#bf00ff',
        pink: '#ff1493',
        fontFamily: "'Press Start 2P', monospace",
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '3px',
        boxShadow: '0 0 20px rgba(234 156 0, 0.3), inset 0 0 20px rgba(234 156 0, 0.1)',
        backdropFilter: 'none',
        animations: {
          glow: true,
          scanline: true,
          'pixel-blink': true,
        },
      },
      'Acrylic': {
        primary: '#00000080',
        secondary: '#00000040',
        accent: 'rgba(0,0,0,0.75)',
        text: '#ffffff',
        highlight: '#ffffff',
        success: '#00e500',
        error: '#e50000',
        warning: '#e5e500',
        fontFamily: "'Inter', 'Apple Color Emoji'",
        borderRadius: '10px',
        borderStyle: 'solid',
        borderWidth: '0px',
        boxShadow: 'none',
        backdropFilter: 'blur(20px)',
        animations: {
          glow: false,
          scanline: false,
          'pixel-blink': false,
        },
      },
    },
    currentTheme: 'Classic Autobot',
    PAINT_UNAVAILABLE: true,
    COORDINATE_MODE: 'rows',
    COORDINATE_DIRECTION: 'top-left',
    COORDINATE_SNAKE: true,
    COORDINATE_BLOCK_WIDTH: 6,
    COORDINATE_BLOCK_HEIGHT: 2,
    autoSwap: true,
    autoBuy: buyTypes[2],
    autoBuyToggle: false,
    maxChargesStopEnable: false,
    maxChargesBeforeStop: 1500,
  };

  // Expose CONFIG globally for the utils manager and other modules
  window.CONFIG = CONFIG;

  const getCurrentTheme = () => CONFIG.THEMES[CONFIG.currentTheme];

  const switchTheme = (themeName) => {
    if (CONFIG.THEMES[themeName]) {
      CONFIG.currentTheme = themeName;
      saveThemePreference();

      // APPLY THEME VARS/CLASS (new)
      applyTheme();

      // Recreate UI (kept for now)
      createUI();
    }
  };

  // Add this helper (place it after getCurrentTheme/switchTheme definitions)
  function applyTheme() {
    const theme = getCurrentTheme();
    console.group('%c🎨 Applying Theme in Auto-Image Script', 'color: #8b5cf6; font-weight: bold;');
    console.log(`%c🎯 Target theme: ${CONFIG.currentTheme}`, 'color: #8b5cf6;');

    // Toggle theme class on documentElement so CSS vars cascade to our UI
    document.documentElement.classList.remove(
      'wplace-theme-classic',
      'wplace-theme-classic-light',
      'wplace-theme-classic-teal',
      'wplace-theme-acrylic',
      'wplace-theme-neon',
      'wplace-theme-neon-cyan',
      'wplace-theme-neon-light',
      'wplace-theme-neon-purple'
    );

    let themeClass = 'wplace-theme-classic'; // default
    let themeFileName = 'classic'; // corresponding file name

    if (CONFIG.currentTheme === 'Neon Retro') {
      themeClass = 'wplace-theme-neon';
      themeFileName = 'neon';
    } else if (CONFIG.currentTheme === 'Classic Light') {
      themeClass = 'wplace-theme-classic-light';
      themeFileName = 'classic-light';
    } else if (CONFIG.currentTheme === 'Classic Teal') {
      themeClass = 'wplace-theme-classic-teal';
      themeFileName = 'classic-teal';
    } else if (CONFIG.currentTheme === 'Neon Retro Cyan') {
      themeClass = 'wplace-theme-neon-cyan';
      themeFileName = 'neon-cyan';
    } else if (CONFIG.currentTheme === 'Neon Retro Light') {
      themeClass = 'wplace-theme-neon-light';
      themeFileName = 'neon-light';
    } else if (CONFIG.currentTheme === 'Neon Retro Purple') {
      themeClass = 'wplace-theme-neon-purple';
      themeFileName = 'neon-purple';
    } else if (CONFIG.currentTheme === 'Acrylic') {
      themeClass = 'wplace-theme-acrylic';
      themeFileName = 'acrylic';
    }

    document.documentElement.classList.add(themeClass);
    console.log(`%c✅ Applied theme class: ${themeClass}`, 'color: #8b5cf6;');

    // Use extension's applyTheme helper if available (loads from local extension resources)
    if (typeof window.applyTheme === 'function') {
      console.log(`%c🔧 Using extension's applyTheme() helper for: ${themeFileName}`, 'color: #10b981; font-weight: bold;');
      const success = window.applyTheme(themeFileName);
      if (success) {
        console.log(`%c✅ Theme CSS loaded from extension local resources`, 'color: #10b981; font-weight: bold;');
        console.log(`  📍 Source: Extension local file (themes/${themeFileName}.css)`);
        console.log(`  🚀 Performance: Instant load (no network request)`);
      } else {
        console.warn(`%c⚠️ Extension theme loading failed, fallback to CSS classes only`, 'color: #f59e0b;');
        console.log(`  🎨 Using CSS class: ${themeClass}`);
        console.log(`  📝 Note: Theme variables may be limited without CSS file`);
      }
    } else {
      console.log(`%c📝 Extension applyTheme() not available, using CSS class only`, 'color: #f59e0b;');
      console.log(`  🎨 Using CSS class: ${themeClass}`);
      console.log(`  ⚠️ Note: Full theme styling requires extension helper function`);
    }

    // Also set CSS variables explicitly in case you want runtime overrides
    const root = document.documentElement;
    const setVar = (k, v) => {
      try {
        root.style.setProperty(k, v);
      } catch { }
    };

    setVar('--wplace-primary', theme.primary);
    setVar('--wplace-secondary', theme.secondary);
    setVar('--wplace-accent', theme.accent);
    setVar('--wplace-text', theme.text);
    setVar('--wplace-highlight', theme.highlight);
    setVar('--wplace-success', theme.success);
    setVar('--wplace-error', theme.error);
    setVar('--wplace-warning', theme.warning);

    // Typography + look
    setVar('--wplace-font', theme.fontFamily || "'Segoe UI', Roboto, sans-serif");
    setVar('--wplace-radius', '' + (theme.borderRadius || '12px'));
    setVar('--wplace-border-style', '' + (theme.borderStyle || 'solid'));
    setVar('--wplace-border-width', '' + (theme.borderWidth || '1px'));
    setVar('--wplace-backdrop', '' + (theme.backdropFilter || 'blur(10px)'));
    setVar('--wplace-border-color', 'rgba(255,255,255,0.1)');

    console.log(`%c🎨 Theme application complete`, 'color: #8b5cf6; font-weight: bold;');
    console.groupEnd();
  }

  const saveThemePreference = () => {
    try {
      localStorage.setItem('wplace-theme', CONFIG.currentTheme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  };

  const loadThemePreference = () => {
    try {
      const saved = localStorage.getItem('wplace-theme');
      if (saved && CONFIG.THEMES[saved]) {
        CONFIG.currentTheme = saved;
      }
    } catch (e) {
      console.warn('Could not load theme preference:', e);
    }
  };

  // Dynamically loaded translations
  window.loadedTranslations = {};

  // Available languages
  const AVAILABLE_LANGUAGES = [
    'en',
    'ru',
    'pt',
    'vi',
    'fr',
    'id',
    'tr',
    'zh-CN',
    'zh-TW',
    'ja',
    'ko',
    'uk',
  ];

  // Function to load translations from JSON file with retry mechanism
  const loadTranslations = async (language, retryCount = 0) => {
    if (window.loadedTranslations[language]) {
      return window.loadedTranslations[language];
    }

    console.group(`%c🌍 Loading ${language.toUpperCase()} translations`, 'color: #06b6d4; font-weight: bold;');

    // First try: Check if extension has loaded local resources
    if (window.AUTOBOT_LANGUAGES && Object.keys(window.AUTOBOT_LANGUAGES).length > 0) {
      console.log(`%c🔍 Checking extension local resources...`, 'color: #06b6d4;');

      const langFile = language + '.json';
      if (window.AUTOBOT_LANGUAGES[langFile]) {
        const translations = window.AUTOBOT_LANGUAGES[langFile];

        // Validate that translations is an object with keys
        if (
          typeof translations === 'object' &&
          translations !== null &&
          Object.keys(translations).length > 0
        ) {
          window.loadedTranslations[language] = translations;
          console.log(`%c✅ Loaded ${language} translations from EXTENSION LOCAL FILES`, 'color: #10b981; font-weight: bold;');
          console.log(`  📍 Source: Extension local storage (chrome-extension://)`);
          console.log(`  📏 Keys count: ${Object.keys(translations).length}`);
          console.log(`  🚀 Performance: Instant load (no network request)`);
          console.groupEnd();
          return translations;
        }
      } else {
        console.log(`%c📝 ${langFile} not found in extension resources`, 'color: #f59e0b;');
        console.log(`  📋 Available in extension: ${Object.keys(window.AUTOBOT_LANGUAGES).join(', ')}`);
      }
    } else {
      console.log(`%c📝 No extension local resources available`, 'color: #f59e0b;');
      console.log(`  🔍 window.AUTOBOT_LANGUAGES: ${typeof window.AUTOBOT_LANGUAGES}`);
    }

    // Second try: Use helper function if available
    if (typeof window.getLanguage === 'function') {
      console.log(`%c🔧 Trying extension getLanguage() helper...`, 'color: #06b6d4;');
      try {
        const translations = window.getLanguage(language);
        if (
          typeof translations === 'object' &&
          translations !== null &&
          Object.keys(translations).length > 0
        ) {
          window.loadedTranslations[language] = translations;
          console.log(`%c✅ Loaded ${language} translations via extension helper`, 'color: #10b981; font-weight: bold;');
          console.log(`  📍 Source: Extension getLanguage() function`);
          console.log(`  📏 Keys count: ${Object.keys(translations).length}`);
          console.groupEnd();
          return translations;
        }
      } catch (error) {
        console.warn(`%c⚠️ Extension helper failed:`, 'color: #f59e0b;', error);
      }
    }

    // Fallback: Load from CDN (original behavior)
    console.log(`%c🌐 Falling back to CDN loading...`, 'color: #8b5cf6;');
    const url = `https://wplace-autobot.github.io/WPlace-AutoBOT/main/lang/${language}.json`;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    try {
      if (retryCount === 0) {
        console.log(`🔄 Loading ${language} translations from CDN...`);
      } else {
        console.log(
          `🔄 Retrying ${language} translations (attempt ${retryCount + 1}/${maxRetries + 1})...`
        );
      }

      const response = await fetch(url);
      if (response.ok) {
        const translations = await response.json();

        // Validate that translations is an object with keys
        if (
          typeof translations === 'object' &&
          translations !== null &&
          Object.keys(translations).length > 0
        ) {
          window.loadedTranslations[language] = translations;
          console.log(
            `%c📚 Loaded ${language} translations from CDN (${Object.keys(translations).length} keys)`, 'color: #f59e0b; font-weight: bold;'
          );
          console.log(`  📍 Source: CDN (wplace-autobot.github.io)`);
          console.log(`  🌐 URL: ${url}`);
          console.log(`  ⚠️ Performance: Network request required`);
          console.groupEnd();
          return translations;
        } else {
          console.warn(`❌ Invalid translation format for ${language}`);
          throw new Error('Invalid translation format');
        }
      } else {
        console.warn(
          `❌ CDN returned HTTP ${response.status}: ${response.statusText} for ${language} translations`
        );
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(
        `❌ Failed to load ${language} translations from CDN (attempt ${retryCount + 1}):`,
        error
      );

      // Retry with exponential backoff
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.groupEnd();
        return loadTranslations(language, retryCount + 1);
      }
    }

    console.error(`%c💥 All translation loading methods failed for ${language}`, 'color: #ef4444; font-weight: bold;');
    console.groupEnd();
    return null;
  };

  const loadLanguagePreference = async () => {
    const savedLanguage = localStorage.getItem('wplace_language');
    const browserLocale = navigator.language;
    const browserLanguage = browserLocale.split('-')[0];

    let selectedLanguage = 'en'; // Default fallback

    try {
      // Check if we have the saved language available
      if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)) {
        selectedLanguage = savedLanguage;
        console.log(`🔄 Using saved language preference: ${selectedLanguage}`);
      }
      // Try full locale match (e.g. "zh-CN", "zh-TW" etc)
      else if (AVAILABLE_LANGUAGES.includes(browserLocale)) {
        selectedLanguage = browserLocale;
        localStorage.setItem('wplace_language', browserLocale);
        console.log(`🔄 Using browser locale: ${selectedLanguage}`);
      }
      // Try base language match (e.g. "en" for "en-US" or "en-GB" etc)
      else if (AVAILABLE_LANGUAGES.includes(browserLanguage)) {
        selectedLanguage = browserLanguage;
        localStorage.setItem('wplace_language', browserLanguage);
        console.log(`🔄 Using browser language: ${selectedLanguage}`);
      }
      // Use English as fallback
      else {
        console.log(`🔄 No matching language found, using English fallback`);
      }

      // Set the language in state first
      state.language = selectedLanguage;

      // Only load translations if not already loaded and not English (which should already be loaded)
      if (selectedLanguage !== 'en' && !window.loadedTranslations[selectedLanguage]) {
        const loaded = await loadTranslations(selectedLanguage);
        if (!loaded) {
          console.warn(
            `⚠️ Failed to load ${selectedLanguage} translations, falling back to English`
          );
          state.language = 'en';
          localStorage.setItem('wplace_language', 'en');
        }
      }
    } catch (error) {
      console.error(`❌ Error in loadLanguagePreference:`, error);
      state.language = 'en'; // Always ensure we have a valid language
    }
  };

  // Simple user notification function for critical issues
  const showTranslationWarning = (message) => {
    try {
      // Create a simple temporary notification banner
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 10001;
        background: rgba(255, 193, 7, 0.95); color: #212529; padding: 12px 16px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255, 193, 7, 0.8);
        max-width: 300px; word-wrap: break-word;
      `;
      warning.textContent = message;
      document.body.appendChild(warning);

      // Auto-remove after 8 seconds
      setTimeout(() => {
        if (warning.parentNode) {
          warning.remove();
        }
      }, 8000);
    } catch (e) {
      // If DOM manipulation fails, just log
      console.warn('Failed to show translation warning UI:', e);
    }
  };

  // Initialize translations function
  const initializeTranslations = async () => {
    try {
      console.log('🌐 Initializing translation system...');

      // Always ensure English is loaded as fallback first
      if (!window.loadedTranslations['en']) {
        const englishLoaded = await loadTranslations('en');
        if (!englishLoaded) {
          console.warn('⚠️ Failed to load English translations from CDN, using fallback');
          showTranslationWarning('⚠️ Translation loading failed, using basic fallbacks');
        }
      }

      // Then load user's language preference
      await loadLanguagePreference();

      console.log(`✅ Translation system initialized. Active language: ${state.language}`);
    } catch (error) {
      console.error('❌ Translation initialization failed:', error);
      // Ensure state has a valid language even if loading fails
      if (!state.language) {
        state.language = 'en';
      }
      console.warn('⚠️ Using fallback translations due to initialization failure');
      showTranslationWarning('⚠️ Translation system error, using basic English');
    }
  };

  // Emergency fallback TEXT (minimal)
  const FALLBACK_TEXT = {
    en: {
      title: 'WPlace Auto-Image',
      toggleOverlay: 'Toggle Overlay',
      scanColors: 'Scan Colors',
      uploadImage: 'Upload Image',
      resizeImage: 'Resize Image',
      selectPosition: 'Select Position',
      startPainting: 'Start Painting',
      stopPainting: 'Stop Painting',
      progress: 'Progress',
      pixels: 'Pixels',
      charges: 'Charges',
      batchSize: 'Batch Size',
      cooldownSettings: 'Cooldown Settings',
      waitCharges: 'Wait for Charges',
      settings: 'Settings',
      showStats: 'Show Statistics',
      compactMode: 'Compact Mode',
      minimize: 'Minimize',
      tokenCapturedSuccess: 'Token captured successfully',
      turnstileInstructions: 'Complete the verification',
      hideTurnstileBtn: 'Hide',
      notificationsNotSupported: 'Notifications not supported',
      chargesReadyMessage: 'Charges are ready',
      chargesReadyNotification: 'WPlace AutoBot',
      initMessage: "Click 'Upload Image' to begin",
    },
  };

  // Safe translation function with multiple fallback levels
  const getText = (key, replacements = {}) => {
    // Try current language first
    let text = window.loadedTranslations[state.language]?.[key];

    // Fallback to English translations
    if (!text && state.language !== 'en') {
      text = window.loadedTranslations['en']?.[key];
    }

    // Fallback to hardcoded English
    if (!text) {
      text = FALLBACK_TEXT['en']?.[key];
    }

    // Last resort - return the key itself
    if (!text) {
      console.warn(`⚠️ Missing translation for key: ${key}`);
      return key;
    }

    // Handle string replacements like {count}, {time}, etc.
    return Object.entries(replacements).reduce((result, [placeholder, value]) => {
      return result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    }, text);
  };

  // UNIFIED ACCOUNT MANAGER
  class AccountManager {
    constructor() {
      this.accounts = [];
      this.currentIndex = 0;
    }

    // Load accounts from storage
    async loadAccounts() {
      try {
        // Get tokens from localStorage
        const tokens = JSON.parse(localStorage.getItem("accounts")) || [];

        // Get account info from storage
        const infoAccountsResult = await new Promise((resolve) => {
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get('infoAccounts', (result) => {
              resolve(result.infoAccounts || []);
            });
          } else {
            // Fallback for when chrome storage isn't available
            resolve([]);
          }
        });

        console.log(`📥 [ACCOUNT MANAGER] Loading ${tokens.length} accounts`);

        this.accounts = tokens.map((token, index) => {
          const info = infoAccountsResult.find(acc => acc.token === token);
          return {
            token,
            displayName: info?.displayName || info?.name || `Account ${index + 1}`,
            ID: info?.ID || null,
            Charges: info?.Charges || 0,
            Max: info?.Max || 0,
            Droplets: info?.Droplets || 0,
            isCurrent: info?.isCurrent || false,
            lastUsed: info?.lastUsed || null,
            lastImported: info?.lastImported || null
          };
        });

        // Find current account index
        this.currentIndex = this.accounts.findIndex(acc => acc.isCurrent);
        if (this.currentIndex === -1) this.currentIndex = 0;

        console.log(`✅ [ACCOUNT MANAGER] Loaded ${this.accounts.length} accounts, current index: ${this.currentIndex}`);
        console.log(`🎯 [ACCOUNT MANAGER] Current account: ${this.getCurrentAccount()?.displayName || 'None'}`);

        // Auto-refresh account statuses after loading
        if (this.accounts.length > 0) {
          console.log('🔄 [ACCOUNT MANAGER] Auto-refreshing account statuses...');
          // Use setTimeout to avoid blocking the load operation
          setTimeout(async () => {
            try {
              await fetchAllAccountDetails();
              console.log('✅ [ACCOUNT MANAGER] Auto-refresh completed');
            } catch (error) {
              console.warn('⚠️ [ACCOUNT MANAGER] Auto-refresh failed:', error);
            }
          }, 100);
        }

        return this.accounts;
      } catch (error) {
        console.error('❌ [ACCOUNT MANAGER] Error loading accounts:', error);
        this.accounts = [];
        this.currentIndex = 0;
        return [];
      }
    }

    // Simple linear switching
    switchToNext() {
      if (this.accounts.length === 0) return null;

      const previousIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex + 1) % this.accounts.length;

      console.log(`🔄 [ACCOUNT MANAGER] Switching: ${previousIndex} → ${this.currentIndex}`);
      console.log(`🎯 [ACCOUNT MANAGER] Target: ${this.accounts[this.currentIndex].displayName}`);

      // Update current flags
      this.accounts.forEach((acc, idx) => {
        acc.isCurrent = idx === this.currentIndex;
      });

      return this.accounts[this.currentIndex];
    }

    getCurrentAccount() {
      return this.accounts[this.currentIndex] || null;
    }

    getAccountByIndex(index) {
      return this.accounts[index] || null;
    }

    updateAccountData(tokenOrData, dataObject = null) {
      let accountData;
      let targetAccount;

      if (dataObject !== null) {
        // Called with (token, dataObject) format
        const token = tokenOrData;
        accountData = dataObject;
        targetAccount = this.accounts.find(acc => acc.token === token);
        if (!targetAccount) {
          console.warn(`⚠️ [ACCOUNT MANAGER] Account with token not found for update`);
          return;
        }
      } else {
        // Called with (dataObject) format - update current account
        accountData = tokenOrData;
        targetAccount = this.getCurrentAccount();
      }

      if (targetAccount && accountData) {
        // Update all provided properties
        if (accountData.charges !== undefined || accountData.Charges !== undefined) {
          targetAccount.Charges = Math.floor(accountData.charges || accountData.Charges || 0);
        }
        if (accountData.max !== undefined || accountData.Max !== undefined) {
          targetAccount.Max = Math.floor(accountData.max || accountData.Max || 0);
        }
        if (accountData.droplets !== undefined || accountData.Droplets !== undefined) {
          targetAccount.Droplets = Math.floor(accountData.droplets || accountData.Droplets || 0);
        }
        if (accountData.id !== undefined || accountData.ID !== undefined) {
          targetAccount.ID = accountData.id || accountData.ID || targetAccount.ID;
        }
        if (accountData.displayName !== undefined) {
          targetAccount.displayName = accountData.displayName;
        }
        if (accountData.isCurrent !== undefined) {
          // Clear isCurrent from all accounts first, then set for target
          this.accounts.forEach(acc => acc.isCurrent = false);
          targetAccount.isCurrent = accountData.isCurrent;
        }
        if (accountData.cooldown !== undefined) {
          targetAccount.cooldown = accountData.cooldown;
        }

        console.log(`📊 [ACCOUNT MANAGER] Updated ${targetAccount.displayName}: ⚡${targetAccount.Charges}/${targetAccount.Max} 💧${targetAccount.Droplets}${targetAccount.isCurrent ? ' (CURRENT)' : ''}`);
      }
    }

    getAccountCount() {
      return this.accounts.length;
    }

    getAllAccounts() {
      return [...this.accounts]; // Return copy to prevent direct mutation
    }

    setCurrentIndex(index) {
      if (index >= 0 && index < this.accounts.length) {
        this.currentIndex = index;
        console.log(`🔄 [ACCOUNT MANAGER] Current index set to: ${index}`);
      } else {
        console.warn(`⚠️ [ACCOUNT MANAGER] Invalid index ${index}, keeping current: ${this.currentIndex}`);
      }
    }

    getNextAccount() {
      if (this.accounts.length === 0) return null;
      const nextIndex = (this.currentIndex + 1) % this.accounts.length;
      return this.accounts[nextIndex];
    }
  }

  // Create global account manager instance
  const accountManager = new AccountManager();

  // GLOBAL STATE
  const state = {
    running: false,
    imageLoaded: false,
    processing: false,
    totalPixels: 0,
    paintedPixels: 0,
    preFilteringDone: false, // Track if pre-filtering detection has been done this session
    progressResetDone: false, // Track if progress reset has been done this save file session
    availableColors: [],
    activeColorPalette: [], // User-selected colors for conversion
    paintWhitePixels: true, // Default to ON
    fullChargeData: null,
    fullChargeInterval: null,
    paintTransparentPixels: false, // Default to OFF
    displayCharges: 0,
    preciseCurrentCharges: 0,
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
    lastPaintedPosition: { x: 0, y: 0 }, // Track last successfully painted coordinate
    estimatedTime: 0,
    language: 'en',
    paintingSpeed: CONFIG.PAINTING_SPEED.DEFAULT, // pixels batch size
    batchMode: CONFIG.BATCH_MODE, // "normal" or "random"
    randomBatchMin: CONFIG.RANDOM_BATCH_RANGE.MIN, // Random range minimum
    randomBatchMax: CONFIG.RANDOM_BATCH_RANGE.MAX, // Random range maximum
    cooldownChargeThreshold: CONFIG.COOLDOWN_CHARGE_THRESHOLD,
    chargesThresholdInterval: null,
    tokenSource: CONFIG.TOKEN_SOURCE, // "generator" or "manual"
    initialSetupComplete: false, // Track if initial startup setup is complete (only happens once)
    overlayOpacity: CONFIG.OVERLAY.OPACITY_DEFAULT,
    blueMarbleEnabled: CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT,
    ditheringEnabled: true,
	  invertColorEnabled: false,
    ditheringEnabled: true,
    // Advanced color matching settings
    colorMatchingAlgorithm: 'lab',
    enableChromaPenalty: true,
    chromaPenaltyWeight: 0.15,
    customTransparencyThreshold: CONFIG.TRANSPARENCY_THRESHOLD,
    customWhiteThreshold: CONFIG.WHITE_THRESHOLD,
    resizeSettings: null,
    originalImage: null,
    resizeIgnoreMask: null,
    paintUnavailablePixels: CONFIG.PAINT_UNAVAILABLE,
    // Coordinate generation settings
    coordinateMode: CONFIG.COORDINATE_MODE,
    coordinateDirection: CONFIG.COORDINATE_DIRECTION,
    coordinateSnake: CONFIG.COORDINATE_SNAKE,
    blockWidth: CONFIG.COORDINATE_BLOCK_WIDTH,
    blockHeight: CONFIG.COORDINATE_BLOCK_HEIGHT,
    notificationsEnabled: CONFIG.NOTIFICATIONS.ENABLED,
    notifyOnChargesReached: CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED,
    notifyOnlyWhenUnfocused: CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED,
    notificationIntervalMinutes: CONFIG.NOTIFICATIONS.REPEAT_MINUTES,
    _lastChargesNotifyAt: 0,
    _lastChargesBelow: true,
    // Smart save tracking
    _lastSavePixelCount: 0,
    _lastSaveTime: 0,
    _saveInProgress: false,
    paintedMap: null,
    accountIndex: 0, // Keep for backward compatibility with existing logic
    // Legacy state removed - now using accountManager instead
    isFetchingAllAccounts: false,
  };

  // Expose state globally for the utils manager and other modules
  window.state = state;

  let _updateResizePreview = () => { };
  let _resizeDialogCleanup = null;

  // --- OVERLAY UPDATE: Optimized OverlayManager class with performance improvements ---
  // OverlayManager class extracted to overlay-manager.js module

  // Overlay management is now handled by the OverlayManager module
  // Check for overlay manager availability
  if (!window.WPlaceOverlayManager) {
    console.error('❌ WPlaceOverlayManager not available - please ensure overlay-manager.js is loaded first');
    throw new Error('OverlayManager dependency not found');
  }

  // Ensure we only have ONE overlay manager instance globally
  let overlayManager;
  if (!window.autoImageOverlayManager) {
    overlayManager = new window.WPlaceOverlayManager();
    window.autoImageOverlayManager = overlayManager;
    console.log('🎯 Created NEW overlay manager instance');
  } else {
    overlayManager = window.autoImageOverlayManager;
    console.log('🎯 Using EXISTING overlay manager instance');
  }

  // Token management is now handled by the TokenManager module
  // Global references for backward compatibility
  if (!window.WPlaceTokenManager) {
    console.error('❌ WPlaceTokenManager not available - please ensure token-manager.js is loaded first');
    throw new Error('TokenManager dependency not found');
  }

  const tokenManager = window.WPlaceTokenManager;
  const setTurnstileToken = (token) => tokenManager.setTurnstileToken(token);
  const isTokenValid = () => tokenManager.isTokenValid();
  const invalidateToken = () => tokenManager.invalidateToken();
  const ensureToken = (forceRefresh = false) => tokenManager.ensureToken(forceRefresh);

  // Getter for the current token value
  const getTurnstileToken = () => tokenManager.turnstileToken;

  // Token promise management
  const createTokenPromise = () => {
    tokenManager.tokenPromise = new Promise((resolve) => {
      tokenManager._resolveToken = resolve;
    });
  };

  // Create global image processor instance for utility functions
  if (!window.WPlaceImageProcessor) {
    console.error('❌ WPlaceImageProcessor not available - please ensure image-processor.js is loaded first');
    throw new Error('ImageProcessor dependency not found');
  }

  const globalImageProcessor = new window.WPlaceImageProcessor();

  // Keep these constants for compatibility with other parts of the script
  let retryCount = 0;
  const MAX_RETRIES = 10;
  const MAX_BATCH_RETRIES = 10; // Maximum attempts for batch sending

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
    // Setup fetch interceptions

    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, args);
      const url = args[0] instanceof Request ? args[0].url : args[0];

      // TILE REQUEST logging removed to reduce console spam

      if (typeof url === 'string') {
        if (url.includes('https://backend.wplace.live/s0/pixel/')) {
          try {
            const payload = JSON.parse(args[1].body);
            if (payload.t) {
              console.log(
                `🔍✅ Turnstile Token Captured - Type: ${typeof payload.t}, Value: ${payload.t
                  ? typeof payload.t === 'string'
                    ? payload.t.length > 50
                      ? payload.t.substring(0, 50) + '...'
                      : payload.t
                    : JSON.stringify(payload.t)
                  : 'null/undefined'
                }, Length: ${payload.t?.length || 0}`
              );
              window.postMessage({ source: 'turnstile-capture', token: payload.t }, '*');
            }
          } catch (_) {
            /* ignore */
          }
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('image/png') && url.includes('.png')) {
          const cloned = response.clone();
          return new Promise(async (resolve) => {
            const blobUUID = crypto.randomUUID();
            const originalBlob = await cloned.blob();

            fetchedBlobQueue.set(blobUUID, (processedBlob) => {
              resolve(
                new Response(processedBlob, {
                  headers: cloned.headers,
                  status: cloned.status,
                  statusText: cloned.statusText,
                })
              );
            });

            window.postMessage(
              {
                source: 'auto-image-tile',
                endpoint: url,
                blobID: blobUUID,
                blobData: originalBlob,
              },
              '*'
            );
          });
        }
      }

      return response;
    };
  });

  window.addEventListener('message', (event) => {
    const { source, endpoint, blobID, blobData } = event.data;

    if (source === 'auto-image-tile' && endpoint && blobID && blobData) {
      overlayManager.processAndRespondToTileRequest(event.data);
    }

    // Token capture is now handled by TokenManager module
    // No need to handle 'turnstile-capture' events here
  });

  async function detectLanguage() {
    try {
      const response = await fetch('https://backend.wplace.live/me', {
        credentials: 'include',
      });
      const data = await response.json();
      state.language = data.language === 'pt' ? 'pt' : 'en';
    } catch {
      state.language = navigator.language.startsWith('pt') ? 'pt' : 'en';
    }
  }

  // UTILITY FUNCTIONS WRAPPER - Uses WPlaceUtilsManager for modular functionality
  const Utils = {
    // Basic utilities
    sleep: (ms) => window.globalUtilsManager ? window.globalUtilsManager.sleep(ms) : new Promise(r => setTimeout(r, ms)),
    dynamicSleep: (tickAndGetRemainingMs) => window.globalUtilsManager ? window.globalUtilsManager.dynamicSleep(tickAndGetRemainingMs) : Promise.resolve(),
    waitForSelector: (selector, interval, timeout) => window.globalUtilsManager ? window.globalUtilsManager.waitForSelector(selector, interval, timeout) : Promise.resolve(null),
    msToTimeText: (ms) => window.globalUtilsManager ? window.globalUtilsManager.msToTimeText(ms) : `${Math.ceil(ms / 1000)}s`,
    createScrollToAdjust: (element, updateCallback, min, max, step) => window.globalUtilsManager ? window.globalUtilsManager.createScrollToAdjust(element, updateCallback, min, max, step) : () => { },

    // Tile calculation
    calculateTileRange: (startRegionX, startRegionY, startPixelX, startPixelY, width, height, tileSize) =>
      window.globalUtilsManager ? window.globalUtilsManager.calculateTileRange(startRegionX, startRegionY, startPixelX, startPixelY, width, height, tileSize) : {},

    // Token management
    loadTurnstile: () => window.globalUtilsManager ? window.globalUtilsManager.loadTurnstile() : Promise.resolve(),
    ensureTurnstileContainer: () => window.globalUtilsManager ? window.globalUtilsManager.ensureTurnstileContainer() : Promise.resolve(),
    ensureTurnstileOverlayContainer: () => window.globalUtilsManager ? window.globalUtilsManager.ensureTurnstileOverlayContainer() : Promise.resolve(),
    executeTurnstile: (sitekey, action) => window.globalUtilsManager ? window.globalUtilsManager.executeTurnstile(sitekey, action) : Promise.resolve(null),
    createTurnstileWidget: (sitekey, action) => window.globalUtilsManager ? window.globalUtilsManager.createTurnstileWidget(sitekey, action) : Promise.resolve(),
    createTurnstileWidgetInteractive: (sitekey, action) => window.globalUtilsManager ? window.globalUtilsManager.createTurnstileWidgetInteractive(sitekey, action) : Promise.resolve(),
    cleanupTurnstile: () => window.globalUtilsManager ? window.globalUtilsManager.cleanupTurnstile() : Promise.resolve(),
    obtainSitekeyAndToken: (fallback) => window.globalUtilsManager ? window.globalUtilsManager.obtainSitekeyAndToken(fallback) : Promise.resolve(fallback),

    // DOM utilities
    createElement: (tag, props, children) => window.globalUtilsManager ? window.globalUtilsManager.createElement(tag, props, children) : document.createElement(tag),
    createButton: (id, text, icon, onClick, style) => {
      if (window.globalUtilsManager) {
        return window.globalUtilsManager.createButton(id, text, icon, onClick, style);
      }
      const btn = document.createElement('button');
      btn.id = id;
      btn.innerHTML = `${icon ? `<i class="${icon}"></i>` : ''}<span>${text}</span>`;
      if (onClick) btn.addEventListener('click', onClick);
      return btn;
    },

    // Translation with fallback
    t: (key, params) => {
      if (window.globalUtilsManager) {
        return window.globalUtilsManager.t(key, params);
      }
      return getText(key, params);
    },
    showAlert: (message, type) => {
      if (window.globalUtilsManager) {
        window.globalUtilsManager.showAlert(message, type);
      } else {
        console.log(`Alert [${type}]: ${message}`);
      }
    },

    hideAlert: () => {
      // Remove existing alerts immediately with safety checks
      const alerts = document.querySelectorAll('.wplace-alert-base');
      alerts.forEach(alert => {
        try {
          if (alert && alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        } catch (error) {
          // Ignore removeChild errors if element was already removed
          console.debug('Alert already removed:', error);
        }
      });
    },

    // Color utilities
    colorDistance: (a, b) => window.globalUtilsManager ? window.globalUtilsManager.colorDistance(a, b) : Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)),
    findClosestPaletteColor: (r, g, b, palette) => window.globalUtilsManager ? window.globalUtilsManager.findClosestPaletteColor(r, g, b, palette) : [r, g, b],
    isWhitePixel: (r, g, b) => window.globalUtilsManager ? window.globalUtilsManager.isWhitePixel(r, g, b) : (r > 240 && g > 240 && b > 240),
    resolveColor: (targetRgb, availableColors, exactMatch) => window.globalUtilsManager ? window.globalUtilsManager.resolveColor(targetRgb, availableColors, exactMatch) : targetRgb,

    // CRITICAL FUNCTIONS - Direct implementations to ensure they work
    createImageUploader: () => {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsDataURL(file);
          } else {
            reject(new Error('No file selected'));
          }
        };
        input.click();
      });
    },

    createFileUploader: () => {
      return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
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
      });
    },

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

    loadProgress: () => {
      try {
        const saved = localStorage.getItem('wplace-bot-progress');
        if (!saved) return null;
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading progress:', error);
        return null;
      }
    },

    saveProgress: () => {
      try {
        // Use utils manager to build proper save structure like old version
        const data = window.globalUtilsManager ?
          window.globalUtilsManager.buildProgressData() :
          {
            timestamp: Date.now(),
            version: '2.2',
            state: {
              totalPixels: window.state.totalPixels,
              paintedPixels: window.state.paintedPixels,
              lastPosition: window.state.lastPosition,
              startPosition: window.state.startPosition,
              region: window.state.region,
              imageLoaded: window.state.imageLoaded,
              colorsChecked: window.state.colorsChecked,
              coordinateMode: window.state.coordinateMode,
              coordinateDirection: window.state.coordinateDirection,
              coordinateSnake: window.state.coordinateSnake,
              blockWidth: window.state.blockWidth,
              blockHeight: window.state.blockHeight,
              availableColors: window.state.availableColors,
            },
            imageData: window.state.imageData ? {
              width: window.state.imageData.width,
              height: window.state.imageData.height,
              pixels: Array.from(window.state.imageData.pixels),
              totalPixels: window.state.imageData.totalPixels,
            } : null,
            paintedMapPacked: window.globalUtilsManager ?
              window.globalUtilsManager.buildPaintedMapPacked() : null
          };

        localStorage.setItem('wplace-bot-progress', JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Error saving progress:', error);
        return false;
      }
    },

    clearProgress: () => {
      try {
        localStorage.removeItem('wplace-bot-progress');
        if (window.state) {
          window.state.paintedMap = null;
          window.state._lastSavePixelCount = 0;
          window.state._lastSaveTime = 0;
        }
        return true;
      } catch (error) {
        console.error('Error clearing progress:', error);
        return false;
      }
    },

    restoreProgress: (savedData) => {
      try {
        console.log('🔍 [DEBUG] RestoreProgress: Starting restoration...');
        console.log('🔍 [DEBUG] SavedData exists:', !!savedData);
        console.log('🔍 [DEBUG] SavedData.state exists:', !!savedData?.state);

        if (!savedData || !savedData.state) {
          console.error('❌ [DEBUG] RestoreProgress: Invalid savedData or missing state');
          return false;
        }

        console.log('🔍 [DEBUG] Current window.state keys before restore:', Object.keys(window.state || {}));
        console.log('🔍 [DEBUG] SavedData.state keys:', Object.keys(savedData.state));

        console.log('🔍 [DEBUG] Performing Object.assign...');
        Object.assign(window.state, savedData.state);

        // Reset session-specific flags when loading a new save file
        window.state.preFilteringDone = false;
        window.state.progressResetDone = false;
        console.log('🔄 Reset session flags for new save file load');

        console.log('✅ [DEBUG] Object.assign completed successfully');

        // Restore available colors from old save files (backward compatibility)
        if (savedData.state.availableColors && Array.isArray(savedData.state.availableColors)) {
          console.log('🔍 [DEBUG] Restoring availableColors, count:', savedData.state.availableColors.length);
          window.state.availableColors = savedData.state.availableColors;
          window.state.colorsChecked = true; // Mark colors as checked
          console.log('✅ [DEBUG] AvailableColors restored successfully');
        } else {
          console.log('⚠️ [DEBUG] No availableColors found in savedData or not an array');
        }

        if (savedData.imageData) {
          console.log('🔍 [DEBUG] Restoring imageData...');
          console.log('🔍 [DEBUG] ImageData type check - pixels is array:', Array.isArray(savedData.imageData.pixels));
          console.log('🔍 [DEBUG] ImageData pixels length:', savedData.imageData.pixels?.length);

          window.state.imageData = {
            ...savedData.imageData,
            pixels: new Uint8ClampedArray(savedData.imageData.pixels),
          };
          console.log('✅ [DEBUG] ImageData restored successfully');
          console.log('🔍 [DEBUG] Converted pixels to Uint8ClampedArray, length:', window.state.imageData.pixels.length);
        } else {
          console.log('⚠️ [DEBUG] No imageData found in savedData');
        }

        if (savedData.paintedMap) {
          console.log('🔍 [DEBUG] Restoring paintedMap...');
          window.state.paintedMap = savedData.paintedMap.map((row) => Array.from(row));
          console.log('✅ [DEBUG] PaintedMap restored successfully');
        } else {
          console.log('🔍 [DEBUG] No paintedMap found in savedData (this is normal for extracted data)');
        }

        console.log('✅ [DEBUG] RestoreProgress completed successfully');
        console.log('🔍 [DEBUG] Final window.state.imageLoaded:', window.state.imageLoaded);
        console.log('🔍 [DEBUG] Final window.state.totalPixels:', window.state.totalPixels);

        return true;
      } catch (error) {
        console.error('❌ [DEBUG] Error in restoreProgress:', error);
        console.error('❌ [DEBUG] Error stack:', error.stack);
        console.error('❌ [DEBUG] SavedData structure at error:', JSON.stringify(savedData, null, 2));
        return false;
      }
    },

    saveProgressToFile: () => {
      try {
        // Use utils manager to build proper save structure like old version
        const progressData = window.globalUtilsManager ?
          window.globalUtilsManager.buildProgressData() :
          {
            timestamp: Date.now(),
            version: '2.2',
            state: {
              totalPixels: window.state.totalPixels,
              paintedPixels: window.state.paintedPixels,
              lastPosition: window.state.lastPosition,
              startPosition: window.state.startPosition,
              region: window.state.region,
              imageLoaded: window.state.imageLoaded,
              colorsChecked: window.state.colorsChecked,
              coordinateMode: window.state.coordinateMode,
              coordinateDirection: window.state.coordinateDirection,
              coordinateSnake: window.state.coordinateSnake,
              blockWidth: window.state.blockWidth,
              blockHeight: window.state.blockHeight,
              availableColors: window.state.availableColors,
            },
            imageData: window.state.imageData ? {
              width: window.state.imageData.width,
              height: window.state.imageData.height,
              pixels: Array.from(window.state.imageData.pixels),
              totalPixels: window.state.imageData.totalPixels,
            } : null,
            paintedMapPacked: window.globalUtilsManager ?
              window.globalUtilsManager.buildPaintedMapPacked() : null
          };

        const filename = `wplace-bot-progress-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/:/g, '-')}.json`;
        Utils.createFileDownloader(JSON.stringify(progressData, null, 2), filename);
        return true;
      } catch (error) {
        console.error('Error saving to file:', error);
        return false;
      }
    },

    loadProgressFromFile: async () => {
      try {
        console.log('🔍 [DEBUG] Starting file upload process...');
        const data = await Utils.createFileUploader();

        console.log('🔍 [DEBUG] File upload completed. Data type:', typeof data);
        console.log('🔍 [DEBUG] Data exists:', !!data);

        if (!data) {
          console.error('❌ [DEBUG] No data received from file uploader');
          throw new Error('No data received from file');
        }

        console.log('🔍 [DEBUG] Data keys:', Object.keys(data));
        console.log('🔍 [DEBUG] Data.state exists:', !!data.state);
        console.log('🔍 [DEBUG] Data.imageData exists:', !!data.imageData);
        console.log('🔍 [DEBUG] Data.version:', data.version);
        console.log('🔍 [DEBUG] Data.timestamp:', data.timestamp);

        if (!data.state) {
          console.error('❌ [DEBUG] Missing state object in loaded data');
          console.log('🔍 [DEBUG] Available top-level keys:', Object.keys(data));
          throw new Error('Invalid file format - missing state object');
        }

        console.log('🔍 [DEBUG] State object keys:', Object.keys(data.state));
        console.log('🔍 [DEBUG] State.imageLoaded:', data.state.imageLoaded);
        console.log('🔍 [DEBUG] State.totalPixels:', data.state.totalPixels);
        console.log('🔍 [DEBUG] State.startPosition:', data.state.startPosition);
        console.log('🔍 [DEBUG] State.region:', data.state.region);

        if (data.imageData) {
          console.log('🔍 [DEBUG] ImageData width:', data.imageData.width);
          console.log('🔍 [DEBUG] ImageData height:', data.imageData.height);
          console.log('🔍 [DEBUG] ImageData pixels length:', data.imageData.pixels?.length);
          console.log('🔍 [DEBUG] ImageData totalPixels:', data.imageData.totalPixels);
        }

        console.log('🔍 [DEBUG] Calling restoreProgress...');
        const success = Utils.restoreProgress(data);
        console.log('🔍 [DEBUG] RestoreProgress result:', success);

        return success;
      } catch (error) {
        console.error('❌ [DEBUG] Error in loadProgressFromFile:', error);
        console.error('❌ [DEBUG] Error stack:', error.stack);
        return false;
      }
    },

    loadExtractedFileData: async () => {
      try {
        console.log('🔍 [DEBUG] Starting Art-Extractor file upload process...');
        const data = await Utils.createFileUploader();

        console.log('🔍 [DEBUG] File upload completed. Data type:', typeof data);
        console.log('🔍 [DEBUG] Data exists:', !!data);
        console.log('📖 Raw loaded data:', data);

        if (!data) {
          console.error('❌ [DEBUG] No data received from file uploader');
          return null;
        }

        console.log('🔍 [DEBUG] Data keys:', Object.keys(data));
        console.log('🔍 [DEBUG] Data.state exists:', !!data.state);
        console.log('🔍 [DEBUG] Data.imageData exists:', !!data.imageData);
        console.log('🔍 [DEBUG] Data.version:', data.version);
        console.log('🔍 [DEBUG] Data.timestamp:', data.timestamp);

        console.log('🔍 [DEBUG] Returning raw data object for Load Extracted feature');
        return data;
      } catch (error) {
        console.error('❌ [DEBUG] Error in loadExtractedFileData:', error);
        return null;
      }
    },

    // Other utilities - delegate to globalUtilsManager or provide simple fallbacks
    extractAvailableColors: () => {
      if (window.globalUtilsManager) {
        return window.globalUtilsManager.extractAvailableColors();
      } else if (window.globalImageProcessor) {
        return window.globalImageProcessor.extractAvailableColors(window.CONFIG.COLOR_MAP);
      } else {
        return [];
      }
    },
    formatTime: (ms) => window.globalUtilsManager ? window.globalUtilsManager.formatTime(ms) : `${Math.floor(ms / 1000)}s`,
    calculateEstimatedTime: (remainingPixels, charges, cooldown) => window.globalUtilsManager ? window.globalUtilsManager.calculateEstimatedTime(remainingPixels, charges, cooldown) : 0,
    initializePaintedMap: (width, height) => window.globalUtilsManager ? window.globalUtilsManager.initializePaintedMap(width, height) : console.log('Painted map not available'),
    markPixelPainted: (x, y, regionX, regionY) => window.globalUtilsManager ? window.globalUtilsManager.markPixelPainted(x, y, regionX, regionY) : false,
    isPixelPainted: (x, y, regionX, regionY) => window.globalUtilsManager ? window.globalUtilsManager.isPixelPainted(x, y, regionX, regionY) : false,
    shouldAutoSave: () => window.globalUtilsManager ? window.globalUtilsManager.shouldAutoSave() : false,
    performSmartSave: () => window.globalUtilsManager ? window.globalUtilsManager.performSmartSave() : false,
    packPaintedMapToBase64: (paintedMap, width, height) => window.globalUtilsManager ? window.globalUtilsManager.packPaintedMapToBase64(paintedMap, width, height) : null,
    unpackPaintedMapFromBase64: (base64, width, height) => window.globalUtilsManager ? window.globalUtilsManager.unpackPaintedMapFromBase64(base64, width, height) : null,
    migrateProgressToV2: (saved) => window.globalUtilsManager ? window.globalUtilsManager.migrateProgressToV2(saved) : saved,
    migrateProgressToV21: (saved) => window.globalUtilsManager ? window.globalUtilsManager.migrateProgressToV21(saved) : saved,
    migrateProgressToV22: (data) => window.globalUtilsManager ? window.globalUtilsManager.migrateProgressToV22(data) : data,
    buildPaintedMapPacked: () => window.globalUtilsManager ? window.globalUtilsManager.buildPaintedMapPacked() : null,
    buildProgressData: () => window.globalUtilsManager ? window.globalUtilsManager.buildProgressData() : {},
    migrateProgress: (saved) => window.globalUtilsManager ? window.globalUtilsManager.migrateProgress(saved) : saved,
    restoreOverlayFromData: () => window.globalUtilsManager ? window.globalUtilsManager.restoreOverlayFromData() : Promise.resolve(false),
    updateCoordinateUI: (config) => window.globalUtilsManager ? window.globalUtilsManager.updateCoordinateUI(config) : console.log('Coordinate UI update not available'),
  };

  // IMAGE PROCESSOR WRAPPER - Uses WPlaceImageProcessor for modular functionality
  class ImageProcessor {
    constructor(imageSrc) {
      // Create instance of the modular ImageProcessor
      this._processor = new window.WPlaceImageProcessor(imageSrc);

      // Legacy compatibility properties
      this.imageSrc = imageSrc;
      this.img = null;
      this.canvas = null;
      this.ctx = null;
    }

    async load() {
      await this._processor.load();

      // Update legacy properties for compatibility
      this.img = this._processor.img;
      this.canvas = this._processor.canvas;
      this.ctx = this._processor.ctx;
    }

    getDimensions() {
      return this._processor.getDimensions();
    }

    getPixelData() {
      return this._processor.getPixelData();
    }

    resize(newWidth, newHeight) {
      const result = this._processor.resize(newWidth, newHeight);

      // Update legacy properties
      this.img = this._processor.img;
      this.canvas = this._processor.canvas;
      this.ctx = this._processor.ctx;

      return result;
    }

    generatePreview(width, height) {
      return this._processor.generatePreview(width, height);
    }

    // Cleanup method
    cleanup() {
      if (this._processor) {
        this._processor.cleanup();
      }
    }
  }

  // WPLACE API SERVICE
  const WPlaceService = {
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color) {
      try {
        await ensureToken();
        if (!getTurnstileToken()) return 'token_error';
        const payload = {
          coords: [pixelX, pixelY],
          colors: [color],
          t: getTurnstileToken(),
          fp: fpStr32,
        };
        var token = await createWasmToken(regionX, regionY, payload);
        const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8', "x-pawtect-token": token },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (res.status === 403) {
          console.error('❌ 403 Forbidden. Turnstile token might be invalid or expired.');
          setTurnstileToken(null);
          createTokenPromise();
          return 'token_error';
        }
        const data = await res.json();
        return data?.painted === 1;
      } catch (e) {
        console.error('Paint request failed:', e);
        return false;
      }
    },

    async getCharges() {
      try {
        const res = await fetch("https://backend.wplace.live/me", {
          credentials: "include",
        })
        const data = await res.json()
        return {
          id: data.id,
          charges: data.charges?.count || 0,
          max: data.charges?.max || 1,
          cooldown: data.charges?.next || CONFIG.COOLDOWN_DEFAULT,
          droplets: data.droplets || 0,
        }
      } catch (e) {
        console.error("Failed to get charges:", e)
        return {
          id: null,
          charges: 0,
          max: 1,
          cooldown: CONFIG.COOLDOWN_DEFAULT,
          droplets: 0,
        }
      }
    },

    async fetchCheck() {
      try {
        const res = await fetch("https://backend.wplace.live/me", {
          credentials: "include",
        })
        const data = await res.json()
        return {
          ID: data.id,
          Username: data.username || data.name || null,
          Charges: data.charges.count,
          Max: data.charges.max,
          Droplets: data.droplets
        }
      } catch (e) {
        console.error("Failed to get ID:", e)
        return {

        }
      }
    }
  };

  // Desktop Notification Manager
  const NotificationManager = {
    pollTimer: null,
    pollIntervalMs: 60_000,
    icon() {
      const link = document.querySelector("link[rel~='icon']");
      return link?.href || location.origin + '/favicon.ico';
    },
    async requestPermission() {
      if (!('Notification' in window)) {
        Utils.showAlert(Utils.t('notificationsNotSupported'), 'warning');
        return 'denied';
      }
      if (Notification.permission === 'granted') return 'granted';
      try {
        const perm = await Notification.requestPermission();
        return perm;
      } catch {
        return Notification.permission;
      }
    },
    canNotify() {
      return (
        state.notificationsEnabled &&
        typeof Notification !== 'undefined' &&
        Notification.permission === 'granted'
      );
    },
    notify(title, body, tag = 'wplace-charges', force = false) {
      if (!this.canNotify()) return false;
      if (!force && state.notifyOnlyWhenUnfocused && document.hasFocus()) return false;
      try {
        new Notification(title, {
          body,
          tag,
          renotify: true,
          icon: this.icon(),
          badge: this.icon(),
          silent: false,
        });
        return true;
      } catch {
        // Graceful fallback
        Utils.showAlert(body, 'info');
        return false;
      }
    },
    resetEdgeTracking() {
      state._lastChargesBelow = state.displayCharges < state.cooldownChargeThreshold;
      state._lastChargesNotifyAt = 0;
    },
    maybeNotifyChargesReached(force = false) {
      if (!state.notificationsEnabled || !state.notifyOnChargesReached) return;
      const reached = state.displayCharges >= state.cooldownChargeThreshold;
      const now = Date.now();
      const repeatMs = Math.max(1, Number(state.notificationIntervalMinutes || 5)) * 60_000;
      if (reached) {
        const shouldEdge = state._lastChargesBelow || force;
        const shouldRepeat = now - (state._lastChargesNotifyAt || 0) >= repeatMs;
        if (shouldEdge || shouldRepeat) {
          const msg = Utils.t('chargesReadyMessage', {
            current: state.displayCharges,
            max: state.maxCharges,
            threshold: state.cooldownChargeThreshold,
          });
          this.notify(Utils.t('chargesReadyNotification'), msg, 'wplace-notify-charges');
          state._lastChargesNotifyAt = now;
        }
        state._lastChargesBelow = false;
      } else {
        state._lastChargesBelow = true;
      }
    },
    startPolling() {
      this.stopPolling();
      if (!state.notificationsEnabled || !state.notifyOnChargesReached) return;
      // lightweight background polling
      this.pollTimer = setInterval(async () => {
        try {
          const { charges, cooldown, max } = await WPlaceService.getCharges();
          state.displayCharges = Math.floor(charges);
          state.cooldown = cooldown;
          state.maxCharges = Math.max(1, Math.floor(max));
          this.maybeNotifyChargesReached();
        } catch {
          /* ignore */
        }
      }, this.pollIntervalMs);
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    syncFromState() {
      this.resetEdgeTracking();
      if (state.notificationsEnabled && state.notifyOnChargesReached) this.startPolling();
      else this.stopPolling();
    },
  };

  // COLOR MATCHING FUNCTION - Optimized with caching
  const colorCache = new Map();

  // UI UPDATE FUNCTIONS (declared early to avoid reference errors)
  let updateUI = () => { };
  let updateStats = async () => { };
  let updateDataButtons = () => { };

  function updateActiveColorPalette() {
    state.activeColorPalette = [];
    const activeSwatches = document.querySelectorAll('.wplace-color-swatch.active');
    if (activeSwatches) {
      activeSwatches.forEach((swatch) => {
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
      swatches.forEach((swatch) => {
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

  function unselectAllPaidColors() {
    const swatches = document.querySelectorAll('.wplace-color-swatch');
    if (swatches) {
      swatches.forEach((swatch) => {
        const colorId = parseInt(swatch.getAttribute('data-color-id'), 10);
        if (!isNaN(colorId) && colorId >= 32) {
          swatch.classList.toggle('active', false);
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
      colorsContainer.innerHTML = `<div class="wplace-colors-placeholder">${Utils.t(
        'uploadImageFirst'
      )}</div>`;
      return;
    }

    function populateColors(showUnavailable = false) {
      colorsContainer.innerHTML = '';
      let availableCount = 0;
      let totalCount = 0;

      // Convert COLOR_MAP to array and filter out transparent
      const allColors = Object.values(CONFIG.COLOR_MAP).filter((color) => color.rgb !== null);

      allColors.forEach((colorData) => {
        const { id, name, rgb } = colorData;
        const rgbKey = `${rgb.r},${rgb.g},${rgb.b}`;
        totalCount++;

        // Check if this color is available in the captured colors
        const isAvailable = state.availableColors.some(
          (c) => c.rgb[0] === rgb.r && c.rgb[1] === rgb.g && c.rgb[2] === rgb.b
        );

        // If not showing all colors and this color is not available, skip it
        if (!showUnavailable && !isAvailable) {
          return;
        }

        if (isAvailable) availableCount++;

        const colorItem = Utils.createElement('div', {
          className: 'wplace-color-item',
        });
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

        const nameLabel = Utils.createElement(
          'span',
          {
            className: 'wplace-color-item-name',
            style: !isAvailable ? 'color: #888; font-style: italic;' : '',
          },
          name + (!isAvailable ? ' (N/A)' : '')
        );

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

    container
      .querySelector('#selectAllBtn')
      ?.addEventListener('click', () => toggleAllColors(true, showAllToggle?.checked));
    container
      .querySelector('#unselectAllBtn')
      ?.addEventListener('click', () => toggleAllColors(false, showAllToggle?.checked));
    container
      .querySelector('#unselectPaidBtn')
      ?.addEventListener('click', () => unselectAllPaidColors());
  }

  async function handleCaptcha(allowGeneration = true) {
    const startTime = performance.now();

    // Check user's token source preference
    if (state.tokenSource === 'manual') {
      console.log('🎯 Manual token source selected - using pixel placement automation');
      if (!allowGeneration) {
        console.log('❌ Token generation disabled during processing');
        return null;
      }
      return await tokenManager.handleCaptchaFallback();
    }

    // Generator mode (pure) or Hybrid mode - try generator first
    try {
      // Use optimized token generation with automatic sitekey detection
      const { sitekey, token: preGeneratedToken } = await Utils.obtainSitekeyAndToken();

      if (!sitekey) {
        throw new Error('No valid sitekey found');
      }

      console.log('🔑 Generating Turnstile token for sitekey:', sitekey);
      console.log(
        '🧭 UA:',
        navigator.userAgent.substring(0, 50) + '...',
        'Platform:',
        navigator.platform
      );

      // Add additional checks before token generation
      if (!window.turnstile) {
        await Utils.loadTurnstile();
      }

      let token = null;

      // ✅ Reuse pre-generated token if available and valid
      if (
        preGeneratedToken &&
        typeof preGeneratedToken === 'string' &&
        preGeneratedToken.length > 20
      ) {
        console.log('♻️ Reusing pre-generated token from sitekey detection phase');
        token = preGeneratedToken;
      }
      // ✅ Or use globally cached token if still valid
      else if (isTokenValid()) {
        console.log('♻️ Using existing cached token (from previous operation)');
        token = getTurnstileToken();
      }
      // ✅ Otherwise generate a new one (only if allowed)
      else {
        if (!allowGeneration) {
          console.log('❌ Token expired/missing but generation disabled during processing');
          return null;
        }
        console.log('🔐 No valid pre-generated or cached token, creating new one...');
        token = await Utils.executeTurnstile(sitekey, 'paint');
        if (token) {
          setTurnstileToken(token);
        }
      }

      console.log(
        `🔍 Token received - Type: ${typeof token}, Value: ${token
          ? typeof token === 'string'
            ? token.length > 50
              ? token.substring(0, 50) + '...'
              : token
            : JSON.stringify(token)
          : 'null/undefined'
        }, Length: ${token?.length || 0}`
      );

      // ✅ Final validation
      if (typeof token === 'string' && token.length > 20) {
        const duration = Math.round(performance.now() - startTime);
        console.log(`✅ Turnstile token generated successfully in ${duration}ms`);
        return token;
      } else {
        throw new Error(
          `Invalid or empty token received - Type: ${typeof token}, Value: ${JSON.stringify(
            token
          )}, Length: ${token?.length || 0}`
        );
      }
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      console.error(`❌ Turnstile token generation failed after ${duration}ms:`, error);

      // Fallback to manual pixel placement for hybrid mode
      if (state.tokenSource === 'hybrid') {
        console.log(
          '🔄 Hybrid mode: Generator failed, automatically switching to manual pixel placement...'
        );
        const fbToken = await tokenManager.handleCaptchaFallback();
        return fbToken;
      } else {
        // Pure generator mode - don't fallback, just fail
        throw error;
      }
    }
  }

  async function createUI() {
    await detectLanguage();

    const existingContainer = document.getElementById('wplace-image-bot-container');
    const existingStats = document.getElementById('wplace-stats-container');
    const existingSettings = document.getElementById('wplace-settings-container');
    const existingResizeContainer = document.querySelector('.resize-container');
    const existingResizeOverlay = document.querySelector('.resize-overlay');

    if (existingContainer) existingContainer.remove();
    if (existingStats) existingStats.remove();
    if (existingSettings) existingSettings.remove();
    if (existingResizeContainer) existingResizeContainer.remove();
    if (existingResizeOverlay) existingResizeOverlay.remove();

    loadThemePreference();
    await initializeTranslations();

    const theme = getCurrentTheme();
    applyTheme(); // <- new: set CSS vars and theme class before building UI

    function appendLinkOnce(href, attributes = {}) {
      // Check if a link with the same href already exists in the document head
      const exists = Array.from(document.head.querySelectorAll('link')).some(
        (link) => link.href === href
      );
      if (exists) return;

      // Create a new link element
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;

      // Add any additional attributes (e.g., data-* attributes)
      for (const [key, value] of Object.entries(attributes)) {
        link.setAttribute(key, value);
      }

      // Append the link element to the document head
      document.head.appendChild(link);
    }

    appendLinkOnce('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

    if (theme.fontFamily.includes('Press Start 2P')) {
      appendLinkOnce('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    }

    // Load auto-image-styles.css - prioritize extension local resources
    console.group('%c🎨 Loading Auto-Image Styles', 'color: #8b5cf6; font-weight: bold;');

    let stylesLoaded = false;

    // First try: Check if extension has loaded local CSS resources
    if (window.AUTOBOT_THEMES && window.AUTOBOT_THEMES['auto-image-styles.css']) {
      console.log('%c🔍 Found auto-image-styles.css in extension local resources!', 'color: #10b981; font-weight: bold;');

      // Check if it's already injected by the extension
      const existingStyle = document.getElementById('autobot-auto-image-styles');
      if (existingStyle) {
        console.log('%c✅ Styles already injected by extension - using local version', 'color: #10b981; font-weight: bold;');
        console.log('  📍 Source: Extension local file (already in DOM)');
        console.log('  🆔 Element ID: autobot-auto-image-styles');
        stylesLoaded = true;
      } else {
        // Inject it ourselves
        const styleElement = document.createElement('style');
        styleElement.id = 'autobot-auto-image-styles-script';
        styleElement.setAttribute('data-wplace-theme', 'true');
        styleElement.textContent = window.AUTOBOT_THEMES['auto-image-styles.css'];
        document.head.appendChild(styleElement);

        console.log('%c✅ Injected auto-image-styles.css from extension local resources', 'color: #10b981; font-weight: bold;');
        console.log('  📍 Source: Extension local file');
        console.log('  📏 Size: ' + window.AUTOBOT_THEMES['auto-image-styles.css'].length + ' characters');
        console.log('  🆔 Element ID: autobot-auto-image-styles-script');
        stylesLoaded = true;
      }
    } else {
      console.log('%c📝 auto-image-styles.css not found in extension resources', 'color: #f59e0b;');
      console.log('  🔍 window.AUTOBOT_THEMES:', typeof window.AUTOBOT_THEMES);
      if (window.AUTOBOT_THEMES) {
        console.log('  📋 Available themes:', Object.keys(window.AUTOBOT_THEMES));
      }
    }

    // Fallback: Load from CDN if local resources not available
    if (!stylesLoaded) {
      console.log('%c🌐 Falling back to CDN loading...', 'color: #8b5cf6;');
      appendLinkOnce(
        'https://wplace-autobot.github.io/WPlace-AutoBOT/main/auto-image-styles.css',
        { 'data-wplace-theme': 'true' }
      );
      console.log('%c📚 Loaded auto-image-styles.css from CDN (fallback)', 'color: #f59e0b; font-weight: bold;');
      console.log('  📍 Source: CDN (wplace-autobot.github.io)');
      console.log('  🌐 URL: https://wplace-autobot.github.io/WPlace-AutoBOT/main/auto-image-styles.css');
      console.log('  ⚠️ Performance: Network request required');
    }

    console.groupEnd();

    // Ensure default theme is loaded from extension resources
    if (window.applyTheme && typeof window.applyTheme === 'function') {
      console.group('%c🎨 Loading Default Theme from Extension', 'color: #8b5cf6; font-weight: bold;');

      // Determine the current theme file name
      let defaultTheme = 'classic'; // fallback
      if (CONFIG.currentTheme === 'Neon Retro') {
        defaultTheme = 'neon';
      } else if (CONFIG.currentTheme === 'Acrylic') {
        defaultTheme = 'acrylic';
      } else if (CONFIG.currentTheme === 'Classic Light') {
        defaultTheme = 'classic-light';
      } else if (CONFIG.currentTheme === 'Classic Teal') {
        defaultTheme = 'classic-teal';
      } else if (CONFIG.currentTheme === 'Neon Retro Cyan') {
        defaultTheme = 'neon-cyan';
      } else if (CONFIG.currentTheme === 'Neon Retro Light') {
        defaultTheme = 'neon-light';
      } else if (CONFIG.currentTheme === 'Neon Retro Purple') {
        defaultTheme = 'neon-purple';
      }

      console.log(`%c🎯 Loading theme: ${defaultTheme} (${CONFIG.currentTheme})`, 'color: #8b5cf6;');
      const success = window.applyTheme(defaultTheme);

      if (success) {
        console.log(`%c✅ Default theme loaded from extension local resources`, 'color: #10b981; font-weight: bold;');
        console.log(`  📍 Source: Extension local file (themes/${defaultTheme}.css)`);
        console.log(`  🚀 Performance: Instant load (no CDN request)`);
        console.log(`  🎨 Theme: ${CONFIG.currentTheme}`);
      } else {
        console.warn(`%c⚠️ Failed to load theme ${defaultTheme} from extension`, 'color: #f59e0b;');
        console.log(`  📝 Note: Theme CSS classes will still work`);
      }

      console.groupEnd();
    } else {
      console.warn(`%c⚠️ Extension applyTheme() function not available`, 'color: #f59e0b; font-weight: bold;');
      console.log(`  📝 Themes will be limited to CSS classes only`);
    }

    const container = document.createElement('div');
    container.id = 'wplace-image-bot-container';
    container.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-image"></i>
          <span>${Utils.t('title')}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="settingsBtn" class="wplace-header-btn" title="${Utils.t('settings')}">
            <i class="fas fa-cog"></i>
          </button>
          <button id="statsBtn" class="wplace-header-btn" title="${Utils.t('showStats')}">
            <i class="fas fa-chart-bar"></i>
          </button>
          <button id="compactBtn" class="wplace-header-btn" title="${Utils.t('compactMode')}">
            <i class="fas fa-compress"></i>
          </button>
          <button id="minimizeBtn" class="wplace-header-btn" title="${Utils.t('minimize')}">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <!-- Status Section - Always visible -->
        <div class="wplace-status-section">
          <div id="statusText" class="wplace-status status-default">
            ${Utils.t('initMessage')}
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
              <button id="uploadBtn" class="wplace-btn wplace-btn-upload" disabled title="${Utils.t(
      'waitingSetupComplete'
    )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t('uploadImage')}</span>
              </button>
              <button id="loadExtractedBtn" class="wplace-btn wplace-btn-secondary" disabled title="Load artwork extracted from Art-Extractor">
                <i class="fas fa-file-import"></i>
                <span>Load Extracted</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="resizeBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-expand"></i>
                <span>${Utils.t('resizeImage')}</span>
              </button>
              <button id="moveArtworkBtn" class="wplace-btn wplace-btn-primary" disabled>
                <i class="fas fa-arrows-alt"></i>
                <span>Move Artwork</span>
              </button>
            </div>
            <div class="wplace-row single">
              <button id="selectPosBtn" class="wplace-btn wplace-btn-select" disabled>
                <i class="fas fa-crosshairs"></i>
                <span>${Utils.t('selectPosition')}</span>
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
                <span>${Utils.t('startPainting')}</span>
              </button>
              <button id="stopBtn" class="wplace-btn wplace-btn-stop" disabled>
                <i class="fas fa-stop"></i>
                <span>${Utils.t('stopPainting')}</span>
              </button>
            </div>
            <div class="wplace-row single">
                <button id="toggleOverlayBtn" class="wplace-btn wplace-btn-overlay" disabled>
                    <i class="fas fa-eye"></i>
                    <span>${Utils.t('toggleOverlay')}</span>
                </button>
            </div>
          </div>
        </div>

        <!-- Cooldown Section -->
        <div class="wplace-section">
            <div class="wplace-section-title">⏱️ ${Utils.t('cooldownSettings')}</div>
            <div class="wplace-cooldown-control">
                <label id="cooldownLabel">${Utils.t('waitCharges')}:</label>
                <div class="wplace-dual-control-compact">
                    <div class="wplace-slider-container-compact">
                        <input type="range" id="cooldownSlider" class="wplace-overlay-opacity-slider" min="1" max="1" value="${state.cooldownChargeThreshold}">
                    </div>
                    <div class="wplace-input-group-compact">
                        <button id="cooldownDecrease" class="wplace-input-btn-compact" type="button">-</button>
                        <input type="number" id="cooldownInput" class="wplace-number-input-compact" min="1" max="999" value="${state.cooldownChargeThreshold}">
                        <button id="cooldownIncrease" class="wplace-input-btn-compact" type="button">+</button>
                        <span id="cooldownValue" class="wplace-input-label-compact">${Utils.t('charges')}</span>
                        <button id="skipCooldownBtn" class="wplace-btn wplace-btn-warning" style="margin-left: 8px; font-size: 11px; padding: 4px 8px;" disabled title="Skip current cooldown (only available during cooldown)">
                            <i class="fas fa-fast-forward"></i> Skip
                        </button>
                    </div>
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
                <span>${Utils.t('saveData')}</span>
              </button>
              <button id="loadBtn" class="wplace-btn wplace-btn-primary" disabled title="${Utils.t(
      'waitingTokenGenerator'
    )}">
                <i class="fas fa-folder-open"></i>
                <span>${Utils.t('loadData')}</span>
              </button>
            </div>
            <div class="wplace-row">
              <button id="saveToFileBtn" class="wplace-btn wplace-btn-file" disabled>
                <i class="fas fa-download"></i>
                <span>${Utils.t('saveToFile')}</span>
              </button>
              <button id="loadFromFileBtn" class="wplace-btn wplace-btn-file" disabled title="${Utils.t(
      'waitingTokenGenerator'
    )}">
                <i class="fas fa-upload"></i>
                <span>${Utils.t('loadFromFile')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Stats Window - Separate UI
    const statsContainer = document.createElement('div');
    statsContainer.id = 'wplace-stats-container';
    statsContainer.style.display = 'none';
    statsContainer.innerHTML = `
      <div class="wplace-header">
        <div class="wplace-header-title">
          <i class="fas fa-chart-bar"></i>
          <span>${Utils.t('paintingStats')}</span>
        </div>
        <div class="wplace-header-controls">
          <button id="refreshChargesBtn" class="wplace-header-btn" title="${Utils.t(
      'refreshCharges'
    )}">
            <i class="fas fa-sync"></i>
          </button>
          <button id="closeStatsBtn" class="wplace-header-btn" title="${Utils.t('closeStats')}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="wplace-content">
        <div class="wplace-stats">
          <div id="statsArea">
            <div class="wplace-stat-item">
              <div class="wplace-stat-label"><i class="fas fa-info-circle"></i> ${Utils.t(
      'initMessage'
    )}</div>
            </div>
          </div>
        </div>
        
        <div class="wplace-section" id="account-swapper-section">
          <div class="wplace-section-title" style="justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-sync-alt"></i>
              <span>Account Swapper</span>
            </div>
            <label class="wplace-switch">
              <input type="checkbox" id="autoSwapToggle">
              <span class="wplace-slider-round"></span>
            </label>
          </div>
        </div>

        <div class="wplace-section" id="autobuy-section">
          <div class="wplace-section-title" style="justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <i class="fas fa-shopping-cart"></i>
              <span>Auto Buy Charges</span>
            </div>
            <label class="wplace-switch">
              <input type="checkbox" id="autoBuyToggle" disabled>
              <span class="wplace-slider-round"></span>
            </label>
          </div>
        </div>

        <div class="wplace-section" id="all-accounts-section">
          <div class="wplace-section-title">
            <i class="fas fa-users"></i>
            <span>All Accounts</span>
            <button id="refreshAllAccountsBtn" class="wplace-header-btn" title="Refresh all accounts">
              <i class="fas fa-users-cog"></i>
            </button>
          </div>
          <div id="accountsListArea" class="accounts-list-container">
            <div class="wplace-stat-item" style="opacity: 0.5;">Click the <i class="fas fa-users-cog"></i> icon to load accounts.</div>
          </div>
        </div>
      </div>
    `;

    // Modern Settings Container with Theme Support
    // Use the theme variable already declared at the top of createUI function
    const settingsContainer = document.createElement('div');
    settingsContainer.id = 'wplace-settings-container';

    // Apply theme-based styling
    const themeBackground = theme.primary
      ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary || theme.primary} 100%)`
      : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`;

    settingsContainer.className = 'wplace-settings-container-base';
    // Apply theme-specific background
    settingsContainer.style.background = themeBackground;
    settingsContainer.style.cssText += `
      min-width: 420px;
      max-width: 480px;
      z-index: 99999;
      color: ${theme.text || 'white'};
      font-family: ${theme.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"};
      box-shadow: ${theme.boxShadow || '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)'
      };
      backdrop-filter: ${theme.backdropFilter || 'blur(10px)'};
      overflow: hidden;
      animation: settings-slide-in 0.4s ease-out;
      ${theme.animations?.glow
        ? `
        box-shadow: ${theme.boxShadow || '0 20px 40px rgba(0,0,0,0.3)'}, 
                   0 0 30px ${theme.highlight || theme.neon || '#00ffff'};
      `
        : ''
      }
    `;

    // noinspection CssInvalidFunction
    settingsContainer.innerHTML = `
      <div class="wplace-settings-header">
        <div class="wplace-settings-title-wrapper">
          <h3 class="wplace-settings-title">
            <i class="fas fa-cog wplace-settings-icon"></i>
            ${Utils.t('settings')}
          </h3>
          <button id="closeSettingsBtn" class="wplace-settings-close-btn">✕</button>
        </div>
      </div>

      <div class="wplace-settings-content">
        
        <!-- Token Source Selection -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-key wplace-icon-key"></i>
            Token Source
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="tokenSourceSelect" class="wplace-settings-select">
              <option value="generator" ${state.tokenSource === 'generator' ? 'selected' : ''
      } class="wplace-settings-option">🤖 Automatic Token Generator (Recommended)</option>
              <option value="hybrid" ${state.tokenSource === 'hybrid' ? 'selected' : ''
      } class="wplace-settings-option">🔄 Generator + Auto Fallback</option>
              <option value="manual" ${state.tokenSource === 'manual' ? 'selected' : ''
      } class="wplace-settings-option">🎯 Manual Pixel Placement</option>
            </select>
            <p class="wplace-settings-description">
              Generator mode creates tokens automatically. Hybrid mode falls back to manual when generator fails. Manual mode only uses pixel placement.
            </p>
          </div>
        </div>

        <!-- Automation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-robot wplace-icon-robot"></i>
            ${Utils.t('automation')}
          </label>
          <!-- Token generator is always enabled - settings moved to Token Source above -->
        </div>

        <!-- Overlay Settings Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label" style="color: ${theme.text || 'white'};">
            <i class="fas fa-eye wplace-icon-eye" style="color: ${theme.highlight || '#48dbfb'
      };"></i>
            Overlay Settings
          </label>
          <div class="wplace-settings-section-wrapper wplace-overlay-wrapper" style="
            background: ${theme.accent ? `${theme.accent}20` : 'rgba(255,255,255,0.1)'}; 
            border-radius: ${theme.borderRadius || '12px'}; 
            padding: 18px; 
            border: 1px solid ${theme.accent || 'rgba(255,255,255,0.1)'};
            ${theme.animations?.glow
        ? `
              box-shadow: 0 0 15px ${theme.accent || 'rgba(255,255,255,0.1)'}33;
            `
        : ''
      }
          ">
              <!-- Opacity Slider -->
              <div class="wplace-overlay-opacity-control">
                <div class="wplace-overlay-opacity-header">
                   <span class="wplace-overlay-opacity-label" style="color: ${theme.text || 'white'
      };">Overlay Opacity</span>
                   <div id="overlayOpacityValue" class="wplace-overlay-opacity-value" style="
                     background: ${theme.secondary || 'rgba(0,0,0,0.2)'}; 
                     color: ${theme.text || 'white'};
                     padding: 4px 8px; 
                     border-radius: ${theme.borderRadius === '0' ? '0' : '6px'}; 
                     font-size: 12px;
                     border: 1px solid ${theme.accent || 'transparent'};
                   ">${Math.round(state.overlayOpacity * 100)}%</div>
                </div>
                <input type="range" id="overlayOpacitySlider" min="0.1" max="1" step="0.05" value="${state.overlayOpacity}" class="wplace-overlay-opacity-slider" style="
                  background: linear-gradient(to right, ${theme.highlight || '#48dbfb'
      } 0%, ${theme.purple || theme.neon || '#d3a4ff'} 100%); 
                  border-radius: ${theme.borderRadius === '0' ? '0' : '4px'}; 
                ">
              </div>
              <!-- Blue Marble Toggle -->
              <label for="enableBlueMarbleToggle" class="wplace-settings-toggle">
                  <div>
                      <span class="wplace-settings-toggle-title" style="color: ${theme.text || 'white'
      };">Blue Marble Effect</span>
                      <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
      };">Renders a dithered "shredded" overlay.</p>
                  </div>
                  <input type="checkbox" id="enableBlueMarbleToggle" ${state.blueMarbleEnabled ? 'checked' : ''
      } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
              </label>
          </div>
        </div>

        <!-- Paint Options Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-paint-brush wplace-icon-paint"></i>
            ${Utils.t('paintOptions')}
          </label>
          <!-- Pixel Filter Toggles -->
          <div id="pixelFilterControls" class="wplace-settings-section-wrapper wplace-pixel-filter-controls">
            <!-- Paint White Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || 'white'};">
                  ${Utils.t('paintWhitePixels')}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
      };">
                  ${Utils.t('paintWhitePixelsDescription')}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintWhiteToggle" ${state.paintWhitePixels ? 'checked' : ''} 
                class="wplace-settings-checkbox"
                style="accent-color: ${theme.highlight || '#48dbfb'};"/>
            </label>
            
            <!-- Paint Transparent Pixels -->
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || 'white'};">
                  ${Utils.t('paintTransparentPixels')}
                </span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
      };">
                  ${Utils.t('paintTransparentPixelsDescription')}
                </p>
              </div>
              <input type="checkbox" id="settingsPaintTransparentToggle" ${state.paintTransparentPixels ? 'checked' : ''} 
                class="wplace-settings-checkbox"
                style="accent-color: ${theme.highlight || '#48dbfb'};"/>
            </label>
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || 'white'
      };">${Utils.t('paintUnavailablePixels')}</span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
      };">${Utils.t('paintUnavailablePixelsDescription')}</p>
              </div>
              <input type="checkbox" id="paintUnavailablePixelsToggle" ${state.paintUnavailablePixels ? 'checked' : ''
      } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
            </label>
          </div>
        </div>

        <!-- Speed Control Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-tachometer-alt wplace-icon-speed"></i>
            ${Utils.t('paintingSpeed')}
          </label>
          
          <!-- Batch Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-dice wplace-icon-dice"></i>
              Batch Mode
            </label>
            <select id="batchModeSelect" class="wplace-settings-select">
              <option value="normal" class="wplace-settings-option">📦 Normal (Fixed Size)</option>
              <option value="random" class="wplace-settings-option">🎲 Random (Range)</option>
            </select>
          </div>
          
          <!-- Normal Mode: Fixed Size Controls -->
          <div id="normalBatchControls" class="wplace-batch-controls wplace-normal-batch-controls">
            <div class="wplace-batch-size-header">
              <span class="wplace-batch-size-label">${Utils.t('batchSize')}</span>
            </div>
            <div class="wplace-dual-control-compact">
                <div class="wplace-speed-slider-container-compact">
                  <input type="range" id="speedSlider" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${state.paintingSpeed}" class="wplace-overlay-opacity-slider">
                </div>
                <div class="wplace-speed-input-container-compact">
                  <div class="wplace-input-group-compact">
                    <button id="speedDecrease" class="wplace-input-btn-compact" type="button">-</button>
                    <input type="number" id="speedInput" class="wplace-number-input-compact" min="${CONFIG.PAINTING_SPEED.MIN}" max="${CONFIG.PAINTING_SPEED.MAX}" value="${state.paintingSpeed}">
                    <button id="speedIncrease" class="wplace-input-btn-compact" type="button">+</button>
                    <span id="speedValue" class="wplace-input-label-compact">pixels</span>
                  </div>
                </div>
            </div>
            <div class="wplace-speed-labels">
              <span class="wplace-speed-min"><i class="fas fa-turtle"></i> ${CONFIG.PAINTING_SPEED.MIN}</span>
              <span class="wplace-speed-max"><i class="fas fa-rabbit"></i> ${CONFIG.PAINTING_SPEED.MAX}</span>
            </div>
          </div>
          
          <!-- Random Mode: Range Controls -->
          <div id="randomBatchControls" class="wplace-batch-controls wplace-random-batch-controls">
            <div class="wplace-random-batch-grid">
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-down wplace-icon-min"></i>
                  Minimum Batch Size
                </label>
                <input type="number" id="randomBatchMin" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MIN}" class="wplace-settings-number-input">
              </div>
              <div>
                <label class="wplace-random-batch-label">
                  <i class="fas fa-arrow-up wplace-icon-max"></i>
                  Maximum Batch Size
                </label>
                <input type="number" id="randomBatchMax" min="1" max="1000" value="${CONFIG.RANDOM_BATCH_RANGE.MAX}" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-random-batch-description">
              🎲 Random batch size between min and max values
            </p>
          </div>
          
          <!-- Speed Control Toggle -->
          <label class="wplace-speed-control-toggle">
            <input type="checkbox" id="enableSpeedToggle" ${CONFIG.PAINTING_SPEED_ENABLED ? 'checked' : ''
      } class="wplace-speed-checkbox"/>
            <span>${Utils.t('enablePaintingSpeedLimit')}</span>
            <div class="wplace-speed-toggle-description">When disabled, bot uses all available charges immediately for maximum speed</div>
          </label>
        </div>
        
        <!-- Coordinate Generation Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-route wplace-icon-route"></i>
            Coordinate Generation
          </label>
          
          <!-- Mode Selection -->
          <div class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-th wplace-icon-table"></i>
              Generation Mode
            </label>
            <select id="coordinateModeSelect" class="wplace-settings-select">
              <option value="rows" class="wplace-settings-option">📏 Rows (Horizontal Lines)</option>
              <option value="columns" class="wplace-settings-option">📐 Columns (Vertical Lines)</option>
              <option value="circle-out" class="wplace-settings-option">⭕ Circle Out (Center → Edges)</option>
              <option value="circle-in" class="wplace-settings-option">⭕ Circle In (Edges → Center)</option>
              <option value="blocks" class="wplace-settings-option">🟫 Blocks (Ordered)</option>
              <option value="shuffle-blocks" class="wplace-settings-option">🎲 Shuffle Blocks (Random)</option>
            </select>
          </div>
          
          <!-- Direction Selection (only for rows/columns) -->
          <div id="directionControls" class="wplace-mode-selection">
            <label class="wplace-mode-label">
              <i class="fas fa-compass wplace-icon-compass"></i>
              Starting Direction
            </label>
            <select id="coordinateDirectionSelect" class="wplace-settings-select">
              <option value="top-left" class="wplace-settings-option">↖️ Top-Left</option>
              <option value="top-right" class="wplace-settings-option">↗️ Top-Right</option>
              <option value="bottom-left" class="wplace-settings-option">↙️ Bottom-Left</option>
              <option value="bottom-right" class="wplace-settings-option">↘️ Bottom-Right</option>
            </select>
          </div>
          
          <!-- Snake Pattern Toggle (only for rows/columns) -->
          <div id="snakeControls" class="wplace-snake-pattern-controls wplace-settings-section-wrapper">
            <label class="wplace-settings-toggle">
              <div>
                <span class="wplace-settings-toggle-title" style="color: ${theme.text || 'white'
      };">Snake Pattern</span>
                <p class="wplace-settings-toggle-description" style="color: ${theme.text ? `${theme.text}BB` : 'rgba(255,255,255,0.7)'
      };">Alternate direction for each row/column (zigzag pattern)</p>
              </div>
              <input type="checkbox" id="coordinateSnakeToggle" ${state.coordinateSnake ? 'checked' : ''
      } class="wplace-settings-checkbox" style="
                    accent-color: ${theme.highlight || '#48dbfb'};
                  "/>
            </label>
          </div>
          
          <!-- Block Size Controls (only for blocks/shuffle-blocks) -->
          <div id="blockControls" class="wplace-block-size-controls wplace-settings-section-wrapper wplace-shuffle-block-size-controls">
            <div class="wplace-block-size-grid">
              <div>
                <label class="wplace-block-size-label">
                  <i class="fas fa-arrows-alt-h wplace-icon-width"></i>
                  Block Width
                </label>
                <input type="number" id="blockWidthInput" min="1" max="50" value="6" class="wplace-settings-number-input">
              </div>
              <div>
                <label style="display: block; color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 8px;">
                  <i class="fas fa-arrows-alt-v wplace-icon-height"></i>
                  Block Height
                </label>
                <input type="number" id="blockHeightInput" min="1" max="50" value="2" class="wplace-settings-number-input">
              </div>
            </div>
            <p class="wplace-block-size-description">
              🧱 Block dimensions for block-based generation modes
            </p>
          </div>
        </div>
        
        <!-- Notifications Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-bell wplace-icon-bell"></i>
            Desktop Notifications
          </label>
          <div class="wplace-settings-section-wrapper wplace-notifications-wrapper">
            <label class="wplace-notification-toggle">
              <span>${Utils.t('enableNotifications')}</span>
              <input type="checkbox" id="notifEnabledToggle" ${state.notificationsEnabled ? 'checked' : ''
      } class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t('notifyOnChargesThreshold')}</span>
              <input type="checkbox" id="notifOnChargesToggle" ${state.notifyOnChargesReached ? 'checked' : ''
      } class="wplace-notification-checkbox" />
            </label>
            <label class="wplace-notification-toggle">
              <span>${Utils.t('onlyWhenNotFocused')}</span>
              <input type="checkbox" id="notifOnlyUnfocusedToggle" ${state.notifyOnlyWhenUnfocused ? 'checked' : ''
      } class="wplace-notification-checkbox" />
            </label>
            <div class="wplace-notification-interval">
              <span>${Utils.t('repeatEvery')}</span>
              <input type="number" id="notifIntervalInput" min="1" max="60" value="${state.notificationIntervalMinutes}" class="wplace-notification-interval-input" />
              <span>${Utils.t('minutesPl')}</span>
            </div>
            <div class="wplace-notification-buttons">
              <button id="notifRequestPermBtn" class="wplace-btn wplace-btn-secondary wplace-notification-perm-btn"><i class="fas fa-unlock"></i><span>${Utils.t(
        'grantPermission'
      )}</span></button>
              <button id="notifTestBtn" class="wplace-btn wplace-notification-test-btn"><i class="fas fa-bell"></i><span>${Utils.t(
        'test'
      )}</span></button>
            </div>
          </div>
        </div>

        <!-- Theme Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-palette wplace-icon-palette"></i>
            ${Utils.t('themeSettings')}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="themeSelect" class="wplace-settings-select">
              ${Object.keys(CONFIG.THEMES)
        .map(
          (themeName) =>
            `<option value="${themeName}" ${CONFIG.currentTheme === themeName ? 'selected' : ''
            } class="wplace-settings-option">${themeName}</option>`
        )
        .join('')}
            </select>
          </div>
        </div>

        <!-- Language Selection Section -->
        <div class="wplace-settings-section">
          <label class="wplace-settings-section-label">
            <i class="fas fa-globe wplace-icon-globe"></i>
            ${Utils.t('language')}
          </label>
          <div class="wplace-settings-section-wrapper">
            <select id="languageSelect" class="wplace-settings-select">
              <option value="vi" ${state.language === 'vi' ? 'selected' : ''} class="wplace-settings-option">🇻🇳 Tiếng Việt</option>
              <option value="id" ${state.language === 'id' ? 'selected' : ''} class="wplace-settings-option">🇮🇩 Bahasa Indonesia</option>
              <option value="ru" ${state.language === 'ru' ? 'selected' : ''} class="wplace-settings-option">🇷🇺 Русский</option>
              <option value="uk" ${state.language === 'uk' ? 'selected' : ''} class="wplace-settings-option">🇺🇦 Українська</option>
              <option value="en" ${state.language === 'en' ? 'selected' : ''} class="wplace-settings-option">🇺🇸 English</option>
              <option value="pt" ${state.language === 'pt' ? 'selected' : ''} class="wplace-settings-option">🇧🇷 Português</option>
              <option value="fr" ${state.language === 'fr' ? 'selected' : ''} class="wplace-settings-option">🇫🇷 Français</option>
              <option value="tr" ${state.language === 'tr' ? 'selected' : ''} class="wplace-settings-option">🇹🇷 Türkçe</option>
              <option value="zh-CN" ${state.language === 'zh-CN' ? 'selected' : ''} class="wplace-settings-option">🇨🇳 简体中文</option>
              <option value="zh-TW" ${state.language === 'zh-TW' ? 'selected' : ''} class="wplace-settings-option">🇹🇼 繁體中文</option>
              <option value="ja" ${state.language === 'ja' ? 'selected' : ''} class="wplace-settings-option">🇯🇵 日本語</option>
              <option value="ko" ${state.language === 'ko' ? 'selected' : ''} class="wplace-settings-option">🇰🇷 한국어</option>
              </select>
          </div>
        </div>
      </div>

        <div class="wplace-settings-footer">
             <button id="applySettingsBtn" class="wplace-settings-apply-btn">
                 <i class="fas fa-check"></i> ${Utils.t('applySettings')}
          </button>
        </div>

      <style>
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes settings-slide-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes settings-fade-out {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }

        #speedSlider::-webkit-slider-thumb, #cooldownSlider::-webkit-slider-thumb, #overlayOpacitySlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.3), 0 0 0 2px #4facfe;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        #speedSlider::-webkit-slider-thumb:hover, #cooldownSlider::-webkit-slider-thumb:hover, #overlayOpacitySlider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 0 3px #4facfe;
        }

        #speedSlider::-moz-range-thumb, #cooldownSlider::-moz-range-thumb, #overlayOpacitySlider::-moz-range-thumb {
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

        /* Custom Scrollbar for Content Area */
        .wplace-content::-webkit-scrollbar {
          width: 6px;
        }

        .wplace-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .wplace-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }

        .wplace-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
      </style>
    `;

    const resizeContainer = document.createElement('div');
    resizeContainer.className = 'resize-container';
    resizeContainer.innerHTML = `
      <h3 class="resize-dialog-title" style="color: ${theme.text}">${Utils.t('resizeImage')}</h3>
      <div class="resize-controls">
        <label class="resize-control-label">
          Width: <span id="widthValue">0</span>px
          <input type="range" id="widthSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        <label class="resize-control-label">
          Height: <span id="heightValue">0</span>px
          <input type="range" id="heightSlider" class="resize-slider" min="10" max="500" value="100">
        </label>
        
        <!-- Edit button moved here after height slider -->
        <div class="edit-button-container" style="margin: 15px 0; text-align: center;">
          <button id="editImageBtn" class="wplace-btn wplace-btn-select">
            <i class="fas fa-paint-brush"></i>
            <span>Edit</span>
          </button>
        </div>
        
        <label class="resize-checkbox-label">
          <input type="checkbox" id="keepAspect" checked>
          ${Utils.t('keepAspectRatio')}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintWhiteToggle" checked>
            ${Utils.t('paintWhitePixels')}
        </label>
        <label class="resize-checkbox-label">
            <input type="checkbox" id="paintTransparentToggle" checked>
            ${Utils.t('paintTransparentPixels')}
        </label>
        <div class="resize-zoom-controls">
          <button id="zoomOutBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
      'zoomOut'
    )}"><i class="fas fa-search-minus"></i></button>
          <input type="range" id="zoomSlider" class="resize-slider resize-zoom-slider" min="0.1" max="20" value="1" step="0.05">
          <button id="zoomInBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
      'zoomIn'
    )}"><i class="fas fa-search-plus"></i></button>
          <button id="zoomFitBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
      'fitToView'
    )}">${Utils.t('fit')}</button>
          <button id="zoomActualBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t(
      'actualSize'
    )}">${Utils.t('hundred')}</button>
          <button id="panModeBtn" class="wplace-btn resize-zoom-btn" title="${Utils.t('panMode')}">
            <i class="fas fa-hand-paper"></i>
          </button>
          <span id="zoomValue" class="resize-zoom-value">100%</span>
          <div id="cameraHelp" class="resize-camera-help">
            Drag to pan • Pinch to zoom • Double‑tap to zoom
          </div>
        </div>
      </div>

      <div class="resize-preview-wrapper">
          <div id="resizePanStage" class="resize-pan-stage">
            <div id="resizeCanvasStack" class="resize-canvas-stack resize-canvas-positioned">
              <canvas id="resizeCanvas" class="resize-base-canvas"></canvas>
              <canvas id="maskCanvas" class="resize-mask-canvas"></canvas>
            </div>
          </div>
      </div>
      <div class="resize-tools">
        <div class="resize-tools-container">
          <div class="resize-brush-controls">
              <div class="resize-brush-control">
                <label class="resize-tool-label">Brush</label>
                <div class="resize-tool-input-group">
                  <input id="maskBrushSize" type="range" min="1" max="255" step="1" value="1" class="resize-tool-slider">
                  <span id="maskBrushSizeValue" class="resize-tool-value">1</span>
                </div>
              </div>
            <div class="resize-brush-control">
              <label class="resize-tool-label">Row/col size</label>
              <div class="resize-tool-input-group">
                <input id="rowColSize" type="range" min="1" max="255" step="1" value="1" class="resize-tool-slider">
                <span id="rowColSizeValue" class="resize-tool-value">1</span>
              </div>
            </div>
          </div>
          <div class="resize-mode-controls">
            <label class="resize-tool-label">Mode</label>
            <div class="mask-mode-group resize-mode-group">
              <button id="maskModeIgnore" class="wplace-btn resize-mode-btn">Ignore</button>
              <button id="maskModeUnignore" class="wplace-btn resize-mode-btn">Unignore</button>
              <button id="maskModeToggle" class="wplace-btn wplace-btn-primary resize-mode-btn">Toggle</button>
            </div>
          </div>
          <button id="clearIgnoredBtn" class="wplace-btn resize-clear-btn" title="Clear all ignored pixels">Clear</button>
          <button id="invertMaskBtn" class="wplace-btn resize-invert-btn" title="Invert mask">Invert</button>
          <span class="resize-shortcut-help">Shift = Row • Alt = Column</span>
        </div>
      </div>

      <div class="wplace-section resize-color-palette-section" id="color-palette-section">
          <div class="wplace-section-title">
              <i class="fas fa-palette"></i>&nbsp;Color Palette
          </div>
          <div class="wplace-controls">
              <div class="wplace-row single">
                  <label class="resize-color-toggle-label">
                      <input type="checkbox" id="showAllColorsToggle" class="resize-color-checkbox">
                      <span>${Utils.t('showAllColorsIncluding')}</span>
                  </label>
              </div>
              <div class="wplace-row" style="display: flex;">
                  <button id="selectAllBtn" class="wplace-btn" style="flex: 1;">Select All</button>
                  <button id="unselectAllBtn" class="wplace-btn" style="flex: 1;">Unselect All</button>
                  <button id="unselectPaidBtn" class="wplace-btn">Unselect Paid</button>
              </div>
              <div id="colors-container" class="wplace-color-grid"></div>
          </div>
      </div>

      <div class="wplace-section resize-advanced-color-section" id="advanced-color-section">
        <div class="wplace-section-title">
          <i class="fas fa-flask"></i>&nbsp;Advanced Color Matching
        </div>
        <div class="resize-advanced-controls">
          <label class="resize-advanced-label">
            <span class="resize-advanced-label-text">Algorithm</span>
            <select id="colorAlgorithmSelect" class="resize-advanced-select">
              <option value="lab" ${state.colorMatchingAlgorithm === 'lab' ? 'selected' : ''
      }>Perceptual (Lab)</option>
            <option value="legacy" ${state.colorMatchingAlgorithm === 'legacy' ? 'selected' : ''
      }>Legacy (RGB)</option>
            <option value="hsv" ${state.colorMatchingAlgorithm === 'hsv' ? 'selected' : ''
      }>HSV (Hue-Saturation-Value)</option>
            <option value="hsl" ${state.colorMatchingAlgorithm === 'hsl' ? 'selected' : ''
      }>HSL (Hue-Saturation-Lightness)</option>
            <option value="xyz" ${state.colorMatchingAlgorithm === 'xyz' ? 'selected' : ''
      }>XYZ (CIE Color Space)</option>
            <option value="luv" ${state.colorMatchingAlgorithm === 'luv' ? 'selected' : ''
      }>LUV (CIE L*u*v*)</option>
            <option value="yuv" ${state.colorMatchingAlgorithm === 'yuv' ? 'selected' : ''
      }>YUV (Luma-Chroma)</option>
            <option value="oklab" ${state.colorMatchingAlgorithm === 'oklab' ? 'selected' : ''
      }>Oklab (Perceptual Uniform)</option>
            <option value="lch" ${state.colorMatchingAlgorithm === 'lch' ? 'selected' : ''
      }>LCH (Lightness-Chroma-Hue)</option>
            </select>
          </label>
          <label class="resize-advanced-toggle">
            <div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Chroma Penalty</span>
              <div class="resize-advanced-description">Preserve vivid colors (Lab only)</div>
            </div>
            <input type="checkbox" id="enableChromaPenaltyToggle" ${state.enableChromaPenalty ? 'checked' : ''
      } class="resize-advanced-checkbox" />
          </label>
          <div class="resize-chroma-weight-control">
            <div class="resize-chroma-weight-header">
              <span>${Utils.t('chromaWeight')}</span>
              <span id="chromaWeightValue" class="resize-chroma-weight-value">${state.chromaPenaltyWeight}</span>
            </div>
            <input type="range" id="chromaPenaltyWeightSlider" min="-2" max="2" step="0.1" value="${state.chromaPenaltyWeight}" class="resize-chroma-weight-slider" />
          </div>
		  </label>
		   <div class="resize-advanced-toggle-content">
		     <span class="resize-advanced-label-text">Invert Colors</span>
             <div class="resize-advanced-description">(not working)The result is the corresponding "negative" image</div>
		   </div>
		   <input type="checkbox" id="invertColorToggle" ${state.invertColorEnabled ? 'checked' : ''
		} <label class="resize-advanced-toggle">
			<div class="resize-advanced-toggle-content">
              <span class="resize-advanced-label-text">Enable Dithering</span>
              <div class="resize-advanced-description">Floyd–Steinberg error diffusion in preview, applied output</div>
            </div>
			<input type="checkbox" id="enableDitheringToggle" ${state.ditheringEnabled ? 'checked' : ''	
      } class="resize-advanced-checkbox" />
          <label class="resize-advanced-toggle">
          <div class="resize-threshold-controls">
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">Transparency</span>
              <input type="number" id="transparencyThresholdInput" min="0" max="255" value="${state.customTransparencyThreshold}" class="resize-threshold-input" />
            </label>
            <label class="resize-threshold-label">
              <span class="resize-advanced-label-text">White Thresh</span>
              <input type="number" id="whiteThresholdInput" min="200" max="255" value="${state.customWhiteThreshold}" class="resize-threshold-input" />
            </label>
          </div>
          <button id="resetAdvancedColorBtn" class="wplace-btn resize-reset-advanced-btn">Reset Advanced</button>
        </div>
      </div>

      <div class="resize-buttons">
        <button id="downloadPreviewBtn" class="wplace-btn wplace-btn-primary">
          <i class="fas fa-download"></i>
          <span>${Utils.t('downloadPreview')}</span>
        </button>
        <button id="confirmResize" class="wplace-btn wplace-btn-start">
          <i class="fas fa-check"></i>
          <span>${Utils.t('apply')}</span>
        </button>
        <button id="cancelResize" class="wplace-btn wplace-btn-stop">
          <i class="fas fa-times"></i>
          <span>${Utils.t('cancel')}</span>
        </button>
      </div>
    `;

    const resizeOverlay = document.createElement('div');
    resizeOverlay.className = 'resize-overlay';

    document.body.appendChild(container);
    document.body.appendChild(resizeOverlay);
    document.body.appendChild(resizeContainer);
    document.body.appendChild(statsContainer);
    document.body.appendChild(settingsContainer);

    // Show the main container after all elements are appended
    container.style.display = 'block';

    const uploadBtn = container.querySelector('#uploadBtn');
    const resizeBtn = container.querySelector('#resizeBtn');
    const selectPosBtn = container.querySelector('#selectPosBtn');
    const startBtn = container.querySelector('#startBtn');
    const stopBtn = container.querySelector('#stopBtn');
    const saveBtn = container.querySelector('#saveBtn');
    const loadBtn = container.querySelector('#loadBtn');
    const saveToFileBtn = container.querySelector('#saveToFileBtn');
    const loadFromFileBtn = container.querySelector('#loadFromFileBtn');

    container.querySelectorAll('.wplace-section-title').forEach((title) => {
      // Add a right-side arrow if it doesn't exist
      if (!title.querySelector('i.arrow')) {
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-chevron-down arrow'; // FontAwesome down arrow
        title.appendChild(arrow);
      }

      // Click event to toggle collapse/expand of the section
      title.addEventListener('click', () => {
        const section = title.parentElement;
        section.classList.toggle('collapsed');
      });
    });

    // Disable load/upload buttons until initial setup is complete (startup only)
    if (loadBtn) {
      loadBtn.disabled = !state.initialSetupComplete;
      loadBtn.title = state.initialSetupComplete
        ? ''
        : '🔄 Waiting for initial setup to complete...';
    }
    if (loadFromFileBtn) {
      loadFromFileBtn.disabled = !state.initialSetupComplete;
      loadFromFileBtn.title = state.initialSetupComplete
        ? ''
        : '🔄 Waiting for initial setup to complete...';
    }
    if (uploadBtn) {
      uploadBtn.disabled = !state.initialSetupComplete;
      uploadBtn.title = state.initialSetupComplete
        ? ''
        : '🔄 Waiting for initial setup to complete...';
    }

    const minimizeBtn = container.querySelector('#minimizeBtn');
    const compactBtn = container.querySelector('#compactBtn');
    const statsBtn = container.querySelector('#statsBtn');
    const toggleOverlayBtn = container.querySelector('#toggleOverlayBtn');
    const statusText = container.querySelector('#statusText');
    const progressBar = container.querySelector('#progressBar');
    const statsArea = statsContainer.querySelector('#statsArea');
    const content = container.querySelector('.wplace-content');
    const closeStatsBtn = statsContainer.querySelector('#closeStatsBtn');
    const refreshChargesBtn = statsContainer.querySelector('#refreshChargesBtn');
    const cooldownSlider = container.querySelector('#cooldownSlider');
    const cooldownInput = container.querySelector('#cooldownInput');
    const cooldownDecrease = container.querySelector('#cooldownDecrease');
    const cooldownIncrease = container.querySelector('#cooldownIncrease');
    const cooldownValue = container.querySelector('#cooldownValue');

    if (!uploadBtn || !selectPosBtn || !startBtn || !stopBtn) {
      console.error('Some UI elements not found:', {
        uploadBtn: !!uploadBtn,
        selectPosBtn: !!selectPosBtn,
        startBtn: !!startBtn,
        stopBtn: !!stopBtn,
      });
    }

    if (!statsContainer || !statsArea || !closeStatsBtn) {
      // Note: base CSS now aligns with this layout: main panel at left:20px (width 280), stats at left:330px.
    }

    const header = container.querySelector('.wplace-header');

    makeDraggable(container);

    function makeDraggable(element) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      let isDragging = false;
      const header =
        element.querySelector('.wplace-header') || element.querySelector('.wplace-settings-header');

      if (!header) {
        console.warn('No draggable header found for element:', element);
        return;
      }

      header.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        if (e.target.closest('.wplace-header-btn') || e.target.closest('button')) return;

        e.preventDefault();
        isDragging = true;

        const rect = element.getBoundingClientRect();

        element.style.transform = 'none';
        element.style.top = rect.top + 'px';
        element.style.left = rect.left + 'px';

        pos3 = e.clientX;
        pos4 = e.clientY;
        element.classList.add('wplace-dragging');
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        document.body.style.userSelect = 'none';
      }

      function elementDrag(e) {
        if (!isDragging) return;

        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        const rect = element.getBoundingClientRect();
        const maxTop = window.innerHeight - rect.height;
        const maxLeft = window.innerWidth - rect.width;

        newTop = Math.max(0, Math.min(newTop, maxTop));
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));

        element.style.top = newTop + 'px';
        element.style.left = newLeft + 'px';
      }

      function closeDragElement() {
        isDragging = false;
        element.classList.remove('wplace-dragging');
        document.onmouseup = null;
        document.onmousemove = null;
        document.body.style.userSelect = '';
      }
    }

    makeDraggable(statsContainer);
    makeDraggable(container);

    if (statsBtn && closeStatsBtn) {
      statsBtn.addEventListener('click', () => {
        const isVisible = statsContainer.style.display !== 'none';
        if (isVisible) {
          statsContainer.style.display = 'none';
          statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
          statsBtn.title = Utils.t('showStats');
        } else {
          statsContainer.style.display = 'block';
          statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
          statsBtn.title = Utils.t('hideStats');
        }
      });

      closeStatsBtn.addEventListener('click', () => {
        statsContainer.style.display = 'none';
        statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i>';
        statsBtn.title = Utils.t('showStats');
      });

      if (refreshChargesBtn) {
        refreshChargesBtn.addEventListener('click', async () => {
          refreshChargesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          refreshChargesBtn.disabled = true;

          try {
            await updateStats();
            await updateCurrentAccountInList();
          } catch (error) {
            console.error('Error refreshing charges:', error);
          } finally {
            refreshChargesBtn.innerHTML = '<i class="fas fa-sync"></i>';
            refreshChargesBtn.disabled = false;
          }
        });
      }

      // Account-related event handlers
      const autoSwapToggle = statsContainer.querySelector('#autoSwapToggle');
      const refreshAllAccountsBtn = statsContainer.querySelector('#refreshAllAccountsBtn');

      if (autoSwapToggle) {
        autoSwapToggle.checked = CONFIG.autoSwap;
        autoSwapToggle.addEventListener('change', (e) => {
          CONFIG.autoSwap = e.target.checked;
          console.log(`🔄 Auto-swap ${CONFIG.autoSwap ? 'enabled' : 'disabled'}`);
          
          // Handle autoBuy toggle dependency
          const autoBuyToggle = statsContainer.querySelector('#autoBuyToggle');
          if (autoBuyToggle) {
            if (!CONFIG.autoSwap) {
              // If autoSwap is disabled, disable and uncheck autoBuy
              autoBuyToggle.disabled = true;
              autoBuyToggle.checked = false;
              CONFIG.autoBuyToggle = false;
              console.log(`💰 Auto-buy disabled (requires auto-swap)`);
            } else {
              // If autoSwap is enabled, enable autoBuy toggle
              autoBuyToggle.disabled = false;
            }
          }
        });
      }

      // Auto Buy toggle logic
      const autoBuyToggle = statsContainer.querySelector('#autoBuyToggle');
      if (autoBuyToggle) {
        autoBuyToggle.checked = CONFIG.autoBuyToggle;
        autoBuyToggle.disabled = !CONFIG.autoSwap; // Disable if autoSwap is off
        
        autoBuyToggle.addEventListener('change', (e) => {
          CONFIG.autoBuyToggle = e.target.checked;
          console.log(`💰 Auto-buy ${CONFIG.autoBuyToggle ? 'enabled' : 'disabled'}`);
        });
      }

      if (refreshAllAccountsBtn) {
        refreshAllAccountsBtn.addEventListener('click', fetchAllAccountDetails);
      }
    }
    if (statsContainer && statsBtn) {
      // Stats container starts visible by default - user clicks button to hide
      statsContainer.style.display = 'block';
      statsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
      statsBtn.title = Utils.t('hideStats');
    }

    const settingsBtn = container.querySelector('#settingsBtn');
    const closeSettingsBtn = settingsContainer.querySelector('#closeSettingsBtn');
    const applySettingsBtn = settingsContainer.querySelector('#applySettingsBtn');

    if (settingsBtn && closeSettingsBtn && applySettingsBtn) {
      settingsBtn.addEventListener('click', () => {
        const isVisible = settingsContainer.classList.contains('show');
        if (isVisible) {
          settingsContainer.style.animation = 'settings-fade-out 0.3s ease-out forwards';
          settingsContainer.classList.remove('show');
          setTimeout(() => {
            settingsContainer.style.animation = '';
          }, 300);
        } else {
          settingsContainer.style.top = '50%';
          settingsContainer.style.left = '50%';
          settingsContainer.style.transform = 'translate(-50%, -50%)';
          settingsContainer.classList.add('show');
          settingsContainer.style.animation = 'settings-slide-in 0.4s ease-out';
        }
      });

      closeSettingsBtn.addEventListener('click', () => {
        settingsContainer.style.animation = 'settings-fade-out 0.3s ease-out forwards';
        settingsContainer.classList.remove('show');
        setTimeout(() => {
          settingsContainer.style.animation = '';
          settingsContainer.style.top = '50%';
          settingsContainer.style.left = '50%';
          settingsContainer.style.transform = 'translate(-50%, -50%)';
        }, 300);
      });

      applySettingsBtn.addEventListener('click', () => {
        // Sync advanced settings before save
        const colorAlgorithmSelect = document.getElementById('colorAlgorithmSelect');
        if (colorAlgorithmSelect) state.colorMatchingAlgorithm = colorAlgorithmSelect.value;
	    const invertColorToggle = document.getElementById('invertColorToggle');
        if (invertColorToggle)
          state.enableInvertColor = invertColorToggle.checked;
        const enableChromaPenaltyToggle = document.getElementById('enableChromaPenaltyToggle');
        if (enableChromaPenaltyToggle)
          state.enableChromaPenalty = enableChromaPenaltyToggle.checked;
        const chromaPenaltyWeightSlider = document.getElementById('chromaPenaltyWeightSlider');
        if (chromaPenaltyWeightSlider)
          state.chromaPenaltyWeight = parseFloat(chromaPenaltyWeightSlider.value) || 0.15;
        const transparencyThresholdInput = document.getElementById('transparencyThresholdInput');
        if (transparencyThresholdInput) {
          const v = parseInt(transparencyThresholdInput.value, 10);
          if (!isNaN(v) && v >= 0 && v <= 255) state.customTransparencyThreshold = v;
        }
        const whiteThresholdInput = document.getElementById('whiteThresholdInput');
        if (whiteThresholdInput) {
          const v = parseInt(whiteThresholdInput.value, 10);
          if (!isNaN(v) && v >= 200 && v <= 255) state.customWhiteThreshold = v;
        }
        // Update functional thresholds
        CONFIG.TRANSPARENCY_THRESHOLD = state.customTransparencyThreshold;
        CONFIG.WHITE_THRESHOLD = state.customWhiteThreshold;
        // Notifications
        const notifEnabledToggle = document.getElementById('notifEnabledToggle');
        const notifOnChargesToggle = document.getElementById('notifOnChargesToggle');
        const notifOnlyUnfocusedToggle = document.getElementById('notifOnlyUnfocusedToggle');
        const notifIntervalInput = document.getElementById('notifIntervalInput');
        if (notifEnabledToggle) state.notificationsEnabled = !!notifEnabledToggle.checked;
        if (notifOnChargesToggle) state.notifyOnChargesReached = !!notifOnChargesToggle.checked;
        if (notifOnlyUnfocusedToggle)
          state.notifyOnlyWhenUnfocused = !!notifOnlyUnfocusedToggle.checked;
        if (notifIntervalInput) {
          const v = parseInt(notifIntervalInput.value, 10);
          if (!isNaN(v) && v >= 1 && v <= 60) state.notificationIntervalMinutes = v;
        }
        saveBotSettings();
        Utils.showAlert(Utils.t('settingsSaved'), 'success');
        closeSettingsBtn.click();
        NotificationManager.syncFromState();
      });

      makeDraggable(settingsContainer);

      const tokenSourceSelect = settingsContainer.querySelector('#tokenSourceSelect');
      if (tokenSourceSelect) {
        tokenSourceSelect.addEventListener('change', (e) => {
          state.tokenSource = e.target.value;
          saveBotSettings();
          console.log(`🔑 Token source changed to: ${state.tokenSource}`);
          const sourceNames = {
            generator: 'Automatic Generator',
            hybrid: 'Generator + Auto Fallback',
            manual: 'Manual Pixel Placement',
          };
          Utils.showAlert(
            Utils.t('tokenSourceSet', { source: sourceNames[state.tokenSource] }),
            'success'
          );
        });
      }

      // Batch mode controls
      const batchModeSelect = settingsContainer.querySelector('#batchModeSelect');
      const normalBatchControls = settingsContainer.querySelector('#normalBatchControls');
      const randomBatchControls = settingsContainer.querySelector('#randomBatchControls');
      const randomBatchMin = settingsContainer.querySelector('#randomBatchMin');
      const randomBatchMax = settingsContainer.querySelector('#randomBatchMax');

      if (batchModeSelect) {
        batchModeSelect.addEventListener('change', (e) => {
          state.batchMode = e.target.value;

          // Switch between normal and random controls
          if (normalBatchControls && randomBatchControls) {
            if (e.target.value === 'random') {
              normalBatchControls.style.display = 'none';
              randomBatchControls.style.display = 'block';
            } else {
              normalBatchControls.style.display = 'block';
              randomBatchControls.style.display = 'none';
            }
          }

          saveBotSettings();
          console.log(`📦 Batch mode changed to: ${state.batchMode}`);
          Utils.showAlert(
            Utils.t('batchModeSet', {
              mode:
                state.batchMode === 'random' ? Utils.t('randomRange') : Utils.t('normalFixedSize'),
            }),
            'success'
          );
        });
      }

      if (randomBatchMin) {
        randomBatchMin.addEventListener('input', (e) => {
          const min = parseInt(e.target.value);
          if (min >= 1 && min <= 1000) {
            state.randomBatchMin = min;
            // Ensure min doesn't exceed max
            if (randomBatchMax && min > state.randomBatchMax) {
              state.randomBatchMax = min;
              randomBatchMax.value = min;
            }
            saveBotSettings();
          }
        });
      }

      if (randomBatchMax) {
        randomBatchMax.addEventListener('input', (e) => {
          const max = parseInt(e.target.value);
          if (max >= 1 && max <= 1000) {
            state.randomBatchMax = max;
            // Ensure max doesn't go below min
            if (randomBatchMin && max < state.randomBatchMin) {
              state.randomBatchMin = max;
              randomBatchMin.value = max;
            }
            saveBotSettings();
          }
        });
      }

      const languageSelect = settingsContainer.querySelector('#languageSelect');
      if (languageSelect) {
        languageSelect.addEventListener('change', async (e) => {
          const newLanguage = e.target.value;
          state.language = newLanguage;
          localStorage.setItem('wplace_language', newLanguage);

          // Load the new language translations
          await loadTranslations(newLanguage);

          setTimeout(() => {
            settingsContainer.style.display = 'none';
            createUI();
          }, 100);
        });
      }

      const themeSelect = settingsContainer.querySelector('#themeSelect');
      if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
          const newTheme = e.target.value;
          switchTheme(newTheme);
        });
      }

      const overlayOpacitySlider = settingsContainer.querySelector('#overlayOpacitySlider');
      const overlayOpacityValue = settingsContainer.querySelector('#overlayOpacityValue');
      const enableBlueMarbleToggle = settingsContainer.querySelector('#enableBlueMarbleToggle');
      const settingsPaintWhiteToggle = settingsContainer.querySelector('#settingsPaintWhiteToggle');
      const settingsPaintTransparentToggle = settingsContainer.querySelector(
        '#settingsPaintTransparentToggle'
      );

      if (overlayOpacitySlider && overlayOpacityValue) {
        const updateOpacity = (newValue) => {
          const opacity = parseFloat(newValue);
          state.overlayOpacity = opacity;
          overlayOpacitySlider.value = opacity;
          overlayOpacityValue.textContent = `${Math.round(opacity * 100)}%`;
        };

        overlayOpacitySlider.addEventListener('input', (e) => {
          updateOpacity(e.target.value);
        });

        // Add scroll-to-adjust for overlay opacity slider
        Utils.createScrollToAdjust(overlayOpacitySlider, updateOpacity, 0, 1, 0.05);
      }

      if (settingsPaintWhiteToggle) {
        settingsPaintWhiteToggle.checked = state.paintWhitePixels;
        settingsPaintWhiteToggle.addEventListener('change', (e) => {
          state.paintWhitePixels = e.target.checked;
          saveBotSettings();
          console.log(`🎨 Paint white pixels: ${state.paintWhitePixels ? 'ON' : 'OFF'}`);
          const statusText = state.paintWhitePixels
            ? 'White pixels in the template will be painted'
            : 'White pixels will be skipped';
          Utils.showAlert(statusText, 'success');
        });
      }

      if (settingsPaintTransparentToggle) {
        settingsPaintTransparentToggle.checked = state.paintTransparentPixels;
        settingsPaintTransparentToggle.addEventListener('change', (e) => {
          state.paintTransparentPixels = e.target.checked;
          saveBotSettings();
          console.log(
            `🎨 Paint transparent pixels: ${state.paintTransparentPixels ? 'ON' : 'OFF'}`
          );
          const statusText = state.paintTransparentPixels
            ? 'Transparent pixels in the template will be painted with the closest available color'
            : 'Transparent pixels will be skipped';
          Utils.showAlert(statusText, 'success');
        });
      }

      // Speed controls - both slider and input
      const speedSlider = settingsContainer.querySelector('#speedSlider');
      const speedInput = settingsContainer.querySelector('#speedInput');
      const speedDecrease = settingsContainer.querySelector('#speedDecrease');
      const speedIncrease = settingsContainer.querySelector('#speedIncrease');
      const speedValue = settingsContainer.querySelector('#speedValue');

      if (speedSlider && speedInput && speedValue && speedDecrease && speedIncrease) {
        const updateSpeed = (newValue) => {
          const speed = Math.max(CONFIG.PAINTING_SPEED.MIN, Math.min(CONFIG.PAINTING_SPEED.MAX, parseInt(newValue)));
          state.paintingSpeed = speed;

          // Update both controls (value shows in input, label shows unit only)
          speedSlider.value = speed;
          speedInput.value = speed;
          speedValue.textContent = `pixels`;

          saveBotSettings();
        };

        // Slider event listener
        speedSlider.addEventListener('input', (e) => {
          updateSpeed(e.target.value);
        });

        // Number input event listener
        speedInput.addEventListener('input', (e) => {
          updateSpeed(e.target.value);
        });

        // Decrease button
        speedDecrease.addEventListener('click', () => {
          updateSpeed(parseInt(speedInput.value) - 1);
        });

        // Increase button
        speedIncrease.addEventListener('click', () => {
          updateSpeed(parseInt(speedInput.value) + 1);
        });

        // Add scroll-to-adjust for speed slider
        Utils.createScrollToAdjust(speedSlider, updateSpeed, CONFIG.PAINTING_SPEED.MIN, CONFIG.PAINTING_SPEED.MAX, 1);
      }

      if (enableBlueMarbleToggle) {
        enableBlueMarbleToggle.addEventListener('click', async () => {
          state.blueMarbleEnabled = enableBlueMarbleToggle.checked;
          if (state.imageLoaded && overlayManager.imageBitmap) {
            Utils.showAlert(Utils.t('reprocessingOverlay'), 'info');
            await overlayManager.processImageIntoChunks();
            Utils.showAlert(Utils.t('overlayUpdated'), 'success');
          }
        });
      }

      // Speed control toggle
      const enableSpeedToggle = settingsContainer.querySelector('#enableSpeedToggle');
      if (enableSpeedToggle) {
        enableSpeedToggle.addEventListener('change', (e) => {
          CONFIG.PAINTING_SPEED_ENABLED = e.target.checked;
          saveBotSettings();
          console.log(`⚡ Batch speed control: ${CONFIG.PAINTING_SPEED_ENABLED ? 'ON' : 'OFF'}`);
          const statusText = CONFIG.PAINTING_SPEED_ENABLED
            ? 'Batch speed control enabled - will use configured batch size'
            : 'Batch speed control disabled - will use all available charges immediately';
          Utils.showAlert(statusText, 'success');
        });
      }

      // (Advanced color listeners moved outside to work with resize dialog)
      // (Advanced color listeners moved outside to work with resize dialog)
      // Notifications listeners
      const notifPermBtn = settingsContainer.querySelector('#notifRequestPermBtn');
      const notifTestBtn = settingsContainer.querySelector('#notifTestBtn');
      if (notifPermBtn) {
        notifPermBtn.addEventListener('click', async () => {
          const perm = await NotificationManager.requestPermission();
          if (perm === 'granted') Utils.showAlert(Utils.t('notificationsEnabled'), 'success');
          else Utils.showAlert(Utils.t('notificationsPermissionDenied'), 'warning');
        });
      }
      if (notifTestBtn) {
        notifTestBtn.addEventListener('click', () => {
          NotificationManager.notify(
            Utils.t('testNotificationTitle'),
            Utils.t('testNotificationMessage'),
            'wplace-notify-test',
            true
          );
        });
      }
    }

    const widthSlider = resizeContainer.querySelector('#widthSlider');
    const heightSlider = resizeContainer.querySelector('#heightSlider');
    const widthValue = resizeContainer.querySelector('#widthValue');
    const heightValue = resizeContainer.querySelector('#heightValue');
    const keepAspect = resizeContainer.querySelector('#keepAspect');
    const paintWhiteToggle = resizeContainer.querySelector('#paintWhiteToggle');
    const paintTransparentToggle = resizeContainer.querySelector('#paintTransparentToggle');
    const zoomSlider = resizeContainer.querySelector('#zoomSlider');
    const zoomValue = resizeContainer.querySelector('#zoomValue');
    const zoomInBtn = resizeContainer.querySelector('#zoomInBtn');
    const zoomOutBtn = resizeContainer.querySelector('#zoomOutBtn');
    const zoomFitBtn = resizeContainer.querySelector('#zoomFitBtn');
    const zoomActualBtn = resizeContainer.querySelector('#zoomActualBtn');
    const panModeBtn = resizeContainer.querySelector('#panModeBtn');
    const panStage = resizeContainer.querySelector('#resizePanStage');
    const canvasStack = resizeContainer.querySelector('#resizeCanvasStack');
    const baseCanvas = resizeContainer.querySelector('#resizeCanvas');
    const maskCanvas = resizeContainer.querySelector('#maskCanvas');
    const baseCtx = baseCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    const confirmResize = resizeContainer.querySelector('#confirmResize');
    const cancelResize = resizeContainer.querySelector('#cancelResize');
    const editImageBtn = resizeContainer.querySelector('#editImageBtn');
    const downloadPreviewBtn = resizeContainer.querySelector('#downloadPreviewBtn');
    const clearIgnoredBtn = resizeContainer.querySelector('#clearIgnoredBtn');

    // Coordinate generation controls with smart visibility
    const coordinateModeSelect = settingsContainer.querySelector('#coordinateModeSelect');
    const coordinateDirectionSelect = settingsContainer.querySelector('#coordinateDirectionSelect');
    const coordinateSnakeToggle = settingsContainer.querySelector('#coordinateSnakeToggle');
    const directionControls = settingsContainer.querySelector('#directionControls');
    const snakeControls = settingsContainer.querySelector('#snakeControls');
    const blockControls = settingsContainer.querySelector('#blockControls');
    const blockWidthInput = settingsContainer.querySelector('#blockWidthInput');
    const blockHeightInput = settingsContainer.querySelector('#blockHeightInput');
    const paintUnavailablePixelsToggle = settingsContainer.querySelector(
      '#paintUnavailablePixelsToggle'
    );

    if (paintUnavailablePixelsToggle) {
      paintUnavailablePixelsToggle.checked = state.paintUnavailablePixels;
      paintUnavailablePixelsToggle.addEventListener('change', (e) => {
        state.paintUnavailablePixels = e.target.checked;
        saveBotSettings();
        console.log(`🎨 Paint unavailable colors: ${state.paintUnavailablePixels ? 'ON' : 'OFF'}`);
        const statusText = state.paintUnavailablePixels
          ? 'Unavailable template colors will be painted with the closest available color'
          : 'Unavailable template colors will be skipped';
        Utils.showAlert(statusText, 'success');
      });
    }
    if (coordinateModeSelect) {
      coordinateModeSelect.value = state.coordinateMode;
      coordinateModeSelect.addEventListener('change', (e) => {
        state.coordinateMode = e.target.value;
        Utils.updateCoordinateUI({
          mode: state.coordinateMode,
          directionControls,
          snakeControls,
          blockControls,
        });
        saveBotSettings();
        console.log(`🔄 Coordinate mode changed to: ${state.coordinateMode}`);
        Utils.showAlert(`Coordinate mode set to: ${state.coordinateMode}`, 'success');
      });
    }

    if (coordinateDirectionSelect) {
      coordinateDirectionSelect.value = state.coordinateDirection;
      coordinateDirectionSelect.addEventListener('change', (e) => {
        state.coordinateDirection = e.target.value;
        saveBotSettings();
        console.log(`🧭 Coordinate direction changed to: ${state.coordinateDirection}`);
        Utils.showAlert(`Coordinate direction set to: ${state.coordinateDirection}`, 'success');
      });
    }

    if (coordinateSnakeToggle) {
      coordinateSnakeToggle.checked = state.coordinateSnake;
      coordinateSnakeToggle.addEventListener('change', (e) => {
        state.coordinateSnake = e.target.checked;
        saveBotSettings();
        console.log(`🐍 Snake pattern ${state.coordinateSnake ? 'enabled' : 'disabled'}`);
        Utils.showAlert(
          `Snake pattern ${state.coordinateSnake ? 'enabled' : 'disabled'}`,
          'success'
        );
      });
    }

    if (blockWidthInput) {
      blockWidthInput.value = state.blockWidth;
      blockWidthInput.addEventListener('input', (e) => {
        const width = parseInt(e.target.value);
        if (width >= 1 && width <= 50) {
          state.blockWidth = width;
          saveBotSettings();
        }
      });
    }

    if (blockHeightInput) {
      blockHeightInput.value = state.blockHeight;
      blockHeightInput.addEventListener('change', (e) => {
        const height = parseInt(e.target.value);
        if (height >= 1 && height <= 50) {
          state.blockHeight = height;
          saveBotSettings();
        }
      });
    }

    if (compactBtn) {
      compactBtn.addEventListener('click', () => {
        container.classList.toggle('wplace-compact');
        const isCompact = container.classList.contains('wplace-compact');

        if (isCompact) {
          compactBtn.innerHTML = '<i class="fas fa-expand"></i>';
          compactBtn.title = Utils.t('expandMode');
        } else {
          compactBtn.innerHTML = '<i class="fas fa-compress"></i>';
          compactBtn.title = Utils.t('compactMode');
        }
      });
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        state.minimized = !state.minimized;
        if (state.minimized) {
          container.classList.add('wplace-minimized');
          content.classList.add('wplace-hidden');
          minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
          minimizeBtn.title = Utils.t('restore');
        } else {
          container.classList.remove('wplace-minimized');
          content.classList.remove('wplace-hidden');
          minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
          minimizeBtn.title = Utils.t('minimize');
        }
        saveBotSettings();
      });
    }

    if (toggleOverlayBtn) {
      toggleOverlayBtn.addEventListener('click', () => {
        const isEnabled = overlayManager.toggle();
        toggleOverlayBtn.classList.toggle('active', isEnabled);
        toggleOverlayBtn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
        Utils.showAlert(isEnabled ? Utils.t('overlayEnabled') : Utils.t('overlayDisabled'), 'info');
      });
    }

    if (state.minimized) {
      container.classList.add('wplace-minimized');
      content.classList.add('wplace-hidden');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        minimizeBtn.title = Utils.t('restore');
      }
    } else {
      container.classList.remove('wplace-minimized');
      content.classList.remove('wplace-hidden');
      if (minimizeBtn) {
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        minimizeBtn.title = Utils.t('minimize');
      }
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        if (!state.imageLoaded) {
          Utils.showAlert(Utils.t('missingRequirements'), 'error');
          return;
        }

        const success = Utils.saveProgress();
        if (success) {
          updateUI('autoSaved', 'success');
          Utils.showAlert(Utils.t('autoSaved'), 'success');
        } else {
          Utils.showAlert(Utils.t('errorSavingProgress'), 'error');
        }
      });
    }

    if (loadBtn) {
      loadBtn.addEventListener('click', async () => {
        const savedData = Utils.loadProgress();
        if (!savedData) {
          updateUI('noSavedData', 'warning');
          Utils.showAlert(Utils.t('noSavedData'), 'warning');
          return;
        }

        // CRITICAL FIX: If save file contains complete data, bypass initial setup check
        // This matches old version behavior where save files could be loaded immediately
        const hasCompleteData = savedData.state && savedData.imageData &&
          savedData.state.availableColors &&
          savedData.state.availableColors.length > 0;

        if (!state.initialSetupComplete && !hasCompleteData) {
          Utils.showAlert(Utils.t('pleaseWaitInitialSetup'), 'warning');
          return;
        }

        const confirmLoad = confirm(
          `${Utils.t('savedDataFound')}\n\n` +
          `Saved: ${new Date(savedData.timestamp).toLocaleString()}\n` +
          `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels`
        );

        if (confirmLoad) {
          const success = Utils.restoreProgress(savedData);
          if (success) {
            // CRITICAL FIX: Set initial setup complete if save had complete data
            if (hasCompleteData) {
              state.initialSetupComplete = true;
            }

            updateUI('dataLoaded', 'success');
            Utils.showAlert(Utils.t('dataLoaded'), 'success');
            updateDataButtons();

            // CRITICAL FIX: Force immediate stats update after save loading
            await updateStats();

            // Force stats display refresh by updating the stats container
            const statsContainer = document.getElementById('wplace-stats-container');
            if (statsContainer && typeof updateStats === 'function') {
              // Trigger a forced visual refresh of the stats
              setTimeout(async () => {
                await updateStats();
              }, 100);
            }

            // Restore overlay if image data was loaded from localStorage
            Utils.restoreOverlayFromData().catch((error) => {
              console.error('Failed to restore overlay from localStorage:', error);
            });

            if (!state.colorsChecked) {
              uploadBtn.disabled = false;
              const loadExtractedBtn = document.getElementById('loadExtractedBtn');
              if (loadExtractedBtn) loadExtractedBtn.disabled = false;
            } else {
              uploadBtn.disabled = false;
              const loadExtractedBtn = document.getElementById('loadExtractedBtn');
              if (loadExtractedBtn) loadExtractedBtn.disabled = false;
              selectPosBtn.disabled = false;
            }

            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              startBtn.disabled = false;
            }
          } else {
            Utils.showAlert(Utils.t('errorLoadingProgress'), 'error');
          }
        }
      });
    }

    if (saveToFileBtn) {
      saveToFileBtn.addEventListener('click', () => {
        const success = Utils.saveProgressToFile();
        if (success) {
          updateUI('fileSaved', 'success');
          Utils.showAlert(Utils.t('fileSaved'), 'success');
        } else {
          Utils.showAlert(Utils.t('fileError'), 'error');
        }
      });
    }

    if (loadFromFileBtn) {
      loadFromFileBtn.addEventListener('click', async () => {
        console.log('🔍 [DEBUG] Load from file button clicked');
        console.log('🔍 [DEBUG] Initial setup complete:', state.initialSetupComplete);

        try {
          // First check if we can load the file - this will tell us if it has complete data
          console.log('🔍 [DEBUG] Starting file upload...');
          const fileData = await Utils.createFileUploader();

          console.log('🔍 [DEBUG] File data received:', !!fileData);
          console.log('🔍 [DEBUG] File data keys:', fileData ? Object.keys(fileData) : 'N/A');

          if (!fileData || !fileData.state) {
            console.error('❌ [DEBUG] Invalid file data or missing state');
            console.log('🔍 [DEBUG] FileData:', fileData);
            Utils.showAlert(Utils.t('invalidFileFormat'), 'error');
            return;
          }

          // CRITICAL FIX: If file contains complete data, bypass initial setup check
          const hasCompleteData = fileData.state && fileData.imageData &&
            fileData.state.availableColors &&
            fileData.state.availableColors.length > 0;

          console.log('🔍 [DEBUG] Has complete data check:');
          console.log('  - fileData.state:', !!fileData.state);
          console.log('  - fileData.imageData:', !!fileData.imageData);
          console.log('  - fileData.state.availableColors:', !!fileData.state.availableColors);
          console.log('  - availableColors length:', fileData.state.availableColors?.length);
          console.log('  - hasCompleteData result:', hasCompleteData);

          if (!state.initialSetupComplete && !hasCompleteData) {
            console.log('⚠️ [DEBUG] Setup not complete and no complete data, showing warning');
            Utils.showAlert(Utils.t('pleaseWaitFileSetup'), 'warning');
            return;
          }

          console.log('🔍 [DEBUG] Calling restoreProgress...');
          const success = Utils.restoreProgress(fileData);
          console.log('🔍 [DEBUG] RestoreProgress result:', success);

          if (success) {
            console.log('✅ [DEBUG] File loaded successfully');

            // CRITICAL FIX: Set initial setup complete if file had complete data
            if (hasCompleteData) {
              console.log('🔍 [DEBUG] Setting initialSetupComplete to true due to complete data');
              state.initialSetupComplete = true;
            }

            updateUI('fileLoaded', 'success');
            Utils.showAlert(Utils.t('fileLoaded'), 'success');
            updateDataButtons();

            console.log('🔍 [DEBUG] Updating stats...');
            await updateStats();

            // Restore overlay if image data was loaded from file
            console.log('🔍 [DEBUG] Attempting to restore overlay...');
            await Utils.restoreOverlayFromData().catch((error) => {
              console.error('❌ [DEBUG] Failed to restore overlay from file:', error);
            });

            console.log('🔍 [DEBUG] Updating button states after load...');
            console.log('  - state.colorsChecked:', state.colorsChecked);
            console.log('  - state.imageLoaded:', state.imageLoaded);
            console.log('  - state.startPosition:', !!state.startPosition);
            console.log('  - state.region:', !!state.region);

            if (state.colorsChecked) {
              console.log('🔍 [DEBUG] Enabling buttons due to colorsChecked');
              uploadBtn.disabled = false;
              selectPosBtn.disabled = false;
              resizeBtn.disabled = false;
            } else {
              console.log('🔍 [DEBUG] Only enabling upload button');
              uploadBtn.disabled = false;
            }

            if (state.imageLoaded && state.startPosition && state.region && state.colorsChecked) {
              console.log('🔍 [DEBUG] All conditions met, enabling start button');
              startBtn.disabled = false;
            } else {
              console.log('⚠️ [DEBUG] Start button requirements not met');
            }
          } else {
            console.error('❌ [DEBUG] RestoreProgress failed');
            Utils.showAlert('File loading failed - check console for details', 'error');
          }
        } catch (error) {
          console.error('❌ [DEBUG] Error in file load process:', error);
          console.error('❌ [DEBUG] Error stack:', error.stack);

          if (error.message === 'Invalid JSON file') {
            console.error('❌ [DEBUG] Invalid JSON file detected');
            Utils.showAlert(Utils.t('invalidFileFormat'), 'error');
          } else {
            console.error('❌ [DEBUG] General file error:', error.message);
            Utils.showAlert(`File error: ${error.message}`, 'error');
          }
        }
      });
    }

    updateUI = (messageKey, type = 'default', params = {}, silent = false) => {
      const message = Utils.t(messageKey, params);
      statusText.textContent = message;
      statusText.className = `wplace-status status-${type}`;

      if (!silent) {
        // Trigger animation only when silent = false
        statusText.style.animation = 'none';
        void statusText.offsetWidth; // trick to restart the animation
        statusText.style.animation = 'slide-in 0.3s ease-out';
      }
    };

    function updateChargeStatsDisplay(intervalMs) {
      const currentChargesEl = document.getElementById('wplace-stat-charges-value');
      const fullChargeEl = document.getElementById('wplace-stat-fullcharge-value');
      if (!fullChargeEl && !currentChargesEl) return;
      if (!state.fullChargeData) {
        fullChargeEl.textContent = '--:--:--';
        return;
      }

      const { current, max, cooldownMs, startTime, spentSinceShot } = state.fullChargeData;
      const elapsed = Date.now() - startTime;

      // total charges including elapsed time and spent during painting since snapshot
      const chargesGained = elapsed / cooldownMs;
      const rawCharges = current + chargesGained - spentSinceShot;
      const cappedCharges = Math.min(rawCharges, max);

      // rounding with 0.95 threshold
      let displayCharges;
      const fraction = cappedCharges - Math.floor(cappedCharges);
      if (fraction >= 0.95) {
        displayCharges = Math.ceil(cappedCharges);
      } else {
        displayCharges = Math.floor(cappedCharges);
      }

      state.displayCharges = Math.max(0, displayCharges);
      state.preciseCurrentCharges = cappedCharges;

      const remainingMs = getMsToTargetCharges(cappedCharges, max, state.cooldown, intervalMs);
      const timeText = Utils.msToTimeText(remainingMs);

      if (currentChargesEl) {
        currentChargesEl.innerHTML = `${state.displayCharges} / ${state.maxCharges}`;
      }

      if (
        state.displayCharges < state.cooldownChargeThreshold &&
        !state.stopFlag &&
        state.running
      ) {
        updateChargesThresholdUI(intervalMs);
      }

      if (fullChargeEl) {
        if (state.displayCharges >= max) {
          fullChargeEl.innerHTML = `<span style="color:#10b981;">FULL</span>`;
        } else {
          fullChargeEl.innerHTML = `
            <span style="color:#f59e0b;">${timeText}</span>
          `;
        }
      }
    }

    updateStats = async (isManualRefresh = false) => {
      const isFirstCheck = !state.fullChargeData?.startTime;

      const minUpdateInterval = 60_000;
      const maxUpdateInterval = 90_000;
      const randomUpdateThreshold =
        minUpdateInterval + Math.random() * (maxUpdateInterval - minUpdateInterval);
      const timeSinceLastUpdate = Date.now() - (state.fullChargeData?.startTime || 0);
      const isTimeToUpdate = timeSinceLastUpdate >= randomUpdateThreshold;

      const shouldCallApi = isFirstCheck || isTimeToUpdate;

      const { charges, max, cooldown } = await WPlaceService.getCharges();
      state.displayCharges = Math.floor(charges);
      state.preciseCurrentCharges = charges;
      state.cooldown = cooldown;
      state.maxCharges = Math.floor(max) > 1 ? Math.floor(max) : state.maxCharges;

      state.fullChargeData = {
        current: charges,
        max: max,
        cooldownMs: cooldown,
        startTime: Date.now(),
        spentSinceShot: 0,
      };
      // Evaluate notifications every time we refresh server-side charges
      NotificationManager.maybeNotifyChargesReached();

      if (state.fullChargeInterval) {
        clearInterval(state.fullChargeInterval);
        state.fullChargeInterval = null;
      }
      const intervalMs = 1000;
      state.fullChargeInterval = setInterval(
        () => updateChargeStatsDisplay(intervalMs),
        intervalMs
      );

      if (cooldownSlider && cooldownSlider.max !== state.maxCharges) {
        cooldownSlider.max = state.maxCharges;
      }
      if (cooldownInput && cooldownInput.max !== state.maxCharges) {
        cooldownInput.max = state.maxCharges;
      }

      // // Update current account charges in the account list
      // await updateCurrentAccountInList();

      let imageStatsHTML = '';
      if (state.imageLoaded) {
        const progress =
          state.totalPixels > 0 ? Math.round((state.paintedPixels / state.totalPixels) * 100) : 0;
        const remainingPixels = state.totalPixels - state.paintedPixels;

        // Updated estimation calculation for new cooldown logic
        // Now we wait for cooldownChargeThreshold before processing pixels

        // Calculate batch size (with fallback if function not yet defined)
        let batchSize;
        try {
          batchSize = typeof calculateBatchSize === 'function' ? calculateBatchSize() : state.paintingSpeed || 5;
        } catch (e) {
          batchSize = state.paintingSpeed || 5;
        }

        // Ensure batchSize is valid and not zero
        batchSize = Math.max(1, Math.min(batchSize, remainingPixels));
        const batchesNeeded = Math.ceil(remainingPixels / batchSize);

        // Calculate time accounting for cooldown threshold behavior with safety checks
        let estimatedMs = 0;
        if (remainingPixels > 0 && Number.isFinite(state.cooldown) && state.cooldown > 0) {
          // Current charges available check
          const currentCharges = Math.max(0, state.displayCharges);
          const thresholdCharges = Math.max(1, state.cooldownChargeThreshold || 1);

          if (currentCharges < thresholdCharges) {
            // Need to wait for charges to reach threshold first
            const chargesNeeded = thresholdCharges - currentCharges;
            estimatedMs += chargesNeeded * state.cooldown;
          }

          // Calculate painting time more accurately
          // Each batch uses thresholdCharges, so calculate how many cycles we need
          const pixelsPerCycle = Math.min(batchSize, thresholdCharges);
          const cyclesNeeded = Math.ceil(remainingPixels / pixelsPerCycle);

          // Time between cycles (waiting for charges to regenerate)
          if (cyclesNeeded > 1) {
            const regenerationTime = (cyclesNeeded - 1) * thresholdCharges * state.cooldown;
            estimatedMs += regenerationTime;
          }

          // Add painting speed delay if enabled
          if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0) {
            const paintingDelay = remainingPixels * (1000 / state.paintingSpeed);
            estimatedMs += paintingDelay;
          }
        }

        // Safety check to prevent infinity or invalid values
        if (!Number.isFinite(estimatedMs) || estimatedMs < 0) {
          estimatedMs = 0;
        }

        state.estimatedTime = estimatedMs;
        progressBar.style.width = `${progress}%`;

        imageStatsHTML = `
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-image"></i> ${Utils.t('progress')}</div>
            <div class="wplace-stat-value">${progress}%</div>
          </div>
          <div class="wplace-stat-item">
            <div class="wplace-stat-label"><i class="fas fa-paint-brush"></i> ${Utils.t(
          'pixels'
        )}</div>
            <div class="wplace-stat-value">${state.paintedPixels}/${state.totalPixels}</div>
          </div>
        `;
      }

      let colorSwatchesHTML = '';
      state.availableColors = state.availableColors.filter(
        (c) => c.name !== 'Unknown CoIor NaN' && c.id !== null
      );

      const availableColors = Utils.extractAvailableColors();
      const newCount = Array.isArray(availableColors) ? availableColors.length : 0;

      if (newCount === 0 && isManualRefresh) {
        Utils.showAlert(Utils.t('noColorsFound'), 'warning');
      } else if (newCount > 0 && state.availableColors.length < newCount) {
        const oldCount = state.availableColors.length;

        Utils.showAlert(
          Utils.t('colorsUpdated', {
            oldCount,
            newCount: newCount,
            diffCount: newCount - oldCount,
          }),
          'success'
        );
        state.availableColors = availableColors;
      }
      if (state.colorsChecked) {
        colorSwatchesHTML = state.availableColors
          .map((color) => {
            const rgbString = `rgb(${color.rgb.join(',')})`;
            return `<div class="wplace-stat-color-swatch" style="background-color: ${rgbString};" title="${Utils.t(
              'colorTooltip',
              { id: color.id, rgb: color.rgb.join(', ') }
            )}"></div>`;
          })
          .join('');
      }

      // Calculate multi-account statistics
      let totalAllCharges = 0;
      let totalMaxCharges = 0;
      const accounts = accountManager.getAllAccounts();
      if (accounts.length > 0) {
        // Use real-time charges for current account, stored data for others
        const currentAccount = accountManager.getCurrentAccount();
        totalAllCharges = accounts.reduce((sum, acc) => {
          if (currentAccount && acc.token === currentAccount.token) {
            // Use real-time data for current account
            return sum + Math.floor(state.displayCharges || state.preciseCurrentCharges || 0);
          } else {
            // Use stored data for other accounts
            return sum + Math.floor(acc.Charges || 0);
          }
        }, 0);
        totalMaxCharges = accounts.reduce((sum, acc) => {
          if (currentAccount && acc.token === currentAccount.token) {
            // Use real-time max charges for current account
            return sum + Math.floor(state.maxCharges || acc.Max || 0);
          } else {
            // Use stored data for other accounts
            return sum + Math.floor(acc.Max || 0);
          }
        }, 0);
      }

      statsArea.innerHTML = `
            ${imageStatsHTML}
            ${accounts.length > 0 ? `
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-coins"></i> Total All Accounts Charges
              </div>
              <div class="wplace-stat-value">
                ${totalAllCharges}/${totalMaxCharges}
              </div>
            </div>
            ` : ''}
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-bolt"></i> ${Utils.t('charges')}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-charges-value">
                ${state.displayCharges} / ${state.maxCharges}
              </div>
            </div>
            <div class="wplace-stat-item">
              <div class="wplace-stat-label">
                <i class="fas fa-battery-half"></i> ${Utils.t('fullChargeIn')}
              </div>
              <div class="wplace-stat-value" id="wplace-stat-fullcharge-value">--:--:--</div>
            </div>
            ${state.colorsChecked
          ? `
            <div class="wplace-colors-section">
                <div class="wplace-stat-label"><i class="fas fa-palette"></i> ${Utils.t(
            'availableColors',
            { count: state.availableColors.length }
          )}</div>
                <div class="wplace-stat-colors-grid">
                    ${colorSwatchesHTML}
                </div>
            </div>
            `
          : ''
        }
        `;

      // should be after statsArea.innerHTML = '...'. todo make full stats ui update partial
      updateChargeStatsDisplay(intervalMs);
    };

    updateDataButtons = () => {
      const hasImageData = state.imageLoaded && state.imageData;
      saveBtn.disabled = !hasImageData;
      saveToFileBtn.disabled = !hasImageData;
    };

    updateDataButtons();

    function showMoveArtworkPanel() {
      // Create move artwork control panel like status panels
      const movePanel = document.createElement('div');
      movePanel.id = 'moveArtworkPanel';
      movePanel.className = 'wplace-move-panel';

      movePanel.innerHTML = `
        <div class="wplace-header">
          <div class="wplace-header-title">
            <i class="fas fa-arrows-alt"></i>
            Move Artwork
          </div>
          <div class="wplace-header-controls">
            <button id="closeMovePanel" class="wplace-header-btn" title="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="wplace-move-controls">
          <div></div>
          <button id="moveUp" class="wplace-move-btn" data-direction="up">▲</button>
          <div></div>
          <button id="moveLeft" class="wplace-move-btn" data-direction="left">◄</button>
          <div class="wplace-move-center">1px</div>
          <button id="moveRight" class="wplace-move-btn" data-direction="right">►</button>
          <div></div>
          <button id="moveDown" class="wplace-move-btn" data-direction="down">▼</button>
          <div></div>
        </div>
      `;

      // No overlay - append directly to body like other panels
      document.body.appendChild(movePanel);

      // Make the panel draggable
      makeDraggable(movePanel);

      // Add event listeners for movement
      let currentMessageTimeout = null;

      function moveArtwork(deltaX, deltaY) {
        if (state.startPosition && state.region) {
          const newX = state.startPosition.x + deltaX;
          const newY = state.startPosition.y + deltaY;

          console.log(`🔄 Moving artwork from (${state.startPosition.x}, ${state.startPosition.y}) to (${newX}, ${newY})`);

          state.startPosition.x = newX;
          state.startPosition.y = newY;

          // Clear any existing message timeout and alerts immediately
          if (currentMessageTimeout) {
            clearTimeout(currentMessageTimeout);
            currentMessageTimeout = null;
          }
          Utils.hideAlert(); // Hide current alert immediately

          // Update overlay position if available
          if (overlayManager) {
            overlayManager.setPosition(state.startPosition, state.region)
              .then(() => {
                console.log('✅ Overlay position updated');
                Utils.showAlert(`Moved to position (${newX}, ${newY})`, 'success');
                // Set new timeout for this message
                currentMessageTimeout = setTimeout(() => {
                  Utils.hideAlert();
                  currentMessageTimeout = null;
                }, 1500); // Message disappears after 1.5 seconds
              })
              .catch(err => {
                console.error('❌ Failed to update overlay:', err);
                Utils.showAlert('Failed to update overlay position', 'error');
              });
          } else {
            Utils.showAlert(`Position updated to (${newX}, ${newY})`, 'success');
            // Set new timeout for this message
            currentMessageTimeout = setTimeout(() => {
              Utils.hideAlert();
              currentMessageTimeout = null;
            }, 1500);
          }
        } else {
          Utils.showAlert('Please select a position first before moving artwork', 'warning');
        }
      }

      document.getElementById('moveUp').addEventListener('click', () => moveArtwork(0, -1));
      document.getElementById('moveDown').addEventListener('click', () => moveArtwork(0, 1));
      document.getElementById('moveLeft').addEventListener('click', () => moveArtwork(-1, 0));
      document.getElementById('moveRight').addEventListener('click', () => moveArtwork(1, 0));

      // Close panel
      function closeMovePanel() {
        if (currentMessageTimeout) {
          clearTimeout(currentMessageTimeout);
          currentMessageTimeout = null;
        }
        Utils.hideAlert();
        document.body.removeChild(movePanel);
      }

      document.getElementById('closeMovePanel').addEventListener('click', closeMovePanel);
    }

    function showResizeDialog(processor) {
      let baseProcessor = processor;
      let width, height;
      if (state.originalImage?.dataUrl) {
        baseProcessor = new ImageProcessor(state.originalImage.dataUrl);
        width = state.originalImage.width;
        height = state.originalImage.height;
      } else {
        const dims = processor.getDimensions();
        width = dims.width;
        height = dims.height;
      }
      const aspectRatio = width / height;

      const rs = state.resizeSettings;
      widthSlider.max = width * 2;
      heightSlider.max = height * 2;
      let initialW = width;
      let initialH = height;
      if (
        rs &&
        Number.isFinite(rs.width) &&
        Number.isFinite(rs.height) &&
        rs.width > 0 &&
        rs.height > 0
      ) {
        initialW = rs.width;
        initialH = rs.height;
      }
      // Clamp to slider ranges
      initialW = Math.max(
        parseInt(widthSlider.min, 10) || 10,
        Math.min(initialW, parseInt(widthSlider.max, 10))
      );
      initialH = Math.max(
        parseInt(heightSlider.min, 10) || 10,
        Math.min(initialH, parseInt(heightSlider.max, 10))
      );
      widthSlider.value = initialW;
      heightSlider.value = initialH;
      widthValue.textContent = initialW;
      heightValue.textContent = initialH;
      zoomSlider.value = 1;
      if (zoomValue) zoomValue.textContent = '100%';
      paintWhiteToggle.checked = state.paintWhitePixels;
      paintTransparentToggle.checked = state.paintTransparentPixels;

      let _previewTimer = null;
      let _previewJobId = 0;
      let _isDraggingSize = false;
      let _zoomLevel = 1;
      let _ditherWorkBuf = null;
      let _ditherEligibleBuf = null;
      const ensureDitherBuffers = (n) => {
        if (!_ditherWorkBuf || _ditherWorkBuf.length !== n * 3)
          _ditherWorkBuf = new Float32Array(n * 3);
        if (!_ditherEligibleBuf || _ditherEligibleBuf.length !== n)
          _ditherEligibleBuf = new Uint8Array(n);
        return { work: _ditherWorkBuf, eligible: _ditherEligibleBuf };
      };
      let _maskImageData = null;
      let _maskData = null;
      let _dirty = null;
      const _resetDirty = () => {
        _dirty = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 };
      };
      const _markDirty = (x, y) => {
        if (!_dirty) _resetDirty();
        if (x < _dirty.minX) _dirty.minX = x;
        if (y < _dirty.minY) _dirty.minY = y;
        if (x > _dirty.maxX) _dirty.maxX = x;
        if (y > _dirty.maxY) _dirty.maxY = y;
      };
      const _flushDirty = () => {
        if (!_dirty || _dirty.maxX < _dirty.minX || _dirty.maxY < _dirty.minY) return;
        const x = Math.max(0, _dirty.minX);
        const y = Math.max(0, _dirty.minY);
        const w = Math.min(maskCanvas.width - x, _dirty.maxX - x + 1);
        const h = Math.min(maskCanvas.height - y, _dirty.maxY - y + 1);
        if (w > 0 && h > 0) maskCtx.putImageData(_maskImageData, 0, 0, x, y, w, h);
        _resetDirty();
      };
      const _ensureMaskOverlayBuffers = (w, h, rebuildFromMask = false) => {
        if (!_maskImageData || _maskImageData.width !== w || _maskImageData.height !== h) {
          _maskImageData = maskCtx.createImageData(w, h);
          _maskData = _maskImageData.data;
          rebuildFromMask = true;
        }
        if (rebuildFromMask) {
          const m = state.resizeIgnoreMask;
          const md = _maskData;
          md.fill(0);
          if (m) {
            for (let i = 0; i < m.length; i++)
              if (m[i]) {
                const p = i * 4;
                md[p] = 255;
                md[p + 1] = 0;
                md[p + 2] = 0;
                md[p + 3] = 150;
              }
          }
          maskCtx.putImageData(_maskImageData, 0, 0);
          _resetDirty();
        }
      };
      const ensureMaskSize = (w, h) => {
        if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
          state.resizeIgnoreMask = new Uint8Array(w * h);
        }
        baseCanvas.width = w;
        baseCanvas.height = h;
        maskCanvas.width = w;
        maskCanvas.height = h;
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        // Ensure overlay buffers exist and rebuild from mask when dimensions change
        _ensureMaskOverlayBuffers(w, h, true);
      };
      _updateResizePreview = async () => {
        const jobId = ++_previewJobId;
        const newWidth = parseInt(widthSlider.value, 10);
        const newHeight = parseInt(heightSlider.value, 10);
        _zoomLevel = parseFloat(zoomSlider.value);

        widthValue.textContent = newWidth;
        heightValue.textContent = newHeight;

        ensureMaskSize(newWidth, newHeight);
        canvasStack.style.width = newWidth + 'px';
        canvasStack.style.height = newHeight + 'px';
        baseCtx.imageSmoothingEnabled = false;
        
        if (!state.availableColors || state.availableColors.length === 0) {
          if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
            await baseProcessor.load();
          }
          baseCtx.clearRect(0, 0, newWidth, newHeight);
          baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
          // Draw existing mask overlay buffer
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          if (_maskImageData) maskCtx.putImageData(_maskImageData, 0, 0);
          updateZoomLayout();
          return;
        }
        
        if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
          await baseProcessor.load();
        }
        baseCtx.clearRect(0, 0, newWidth, newHeight);
        baseCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
        const imgData = baseCtx.getImageData(0, 0, newWidth, newHeight);
        const data = imgData.data;

        const tThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;

        const applyFSDither = () => {
          const w = newWidth,
            h = newHeight;
          const n = w * h;
          const { work, eligible } = ensureDitherBuffers(n);
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              const i4 = idx * 4;
              const r = data[i4],
                g = data[i4 + 1],
                b = data[i4 + 2],
                a = data[i4 + 3];
              const isEligible =
                (state.paintTransparentPixels || a >= tThresh) &&
                (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
              eligible[idx] = isEligible ? 1 : 0;
              work[idx * 3] = r;
              work[idx * 3 + 1] = g;
              work[idx * 3 + 2] = b;
              if (!isEligible) {
                data[i4 + 3] = 0; // transparent in preview overlay
              }
            }
          }

          const diffuse = (nx, ny, er, eg, eb, factor) => {
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
            const nidx = ny * w + nx;
            if (!eligible[nidx]) return;
            const base = nidx * 3;
            work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
            work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
            work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
          };

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              if (!eligible[idx]) continue;
              const base = idx * 3;
              const r0 = work[base],
                g0 = work[base + 1],
                b0 = work[base + 2];
              const [nr, ng, nb] = Utils.findClosestPaletteColor(
                r0,
                g0,
                b0,
                state.activeColorPalette
              );
              const i4 = idx * 4;
              data[i4] = nr;
              data[i4 + 1] = ng;
              data[i4 + 2] = nb;
              data[i4 + 3] = 255;

              const er = r0 - nr;
              const eg = g0 - ng;
              const eb = b0 - nb;

              diffuse(x + 1, y, er, eg, eb, 7 / 16);
              diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
              diffuse(x, y + 1, er, eg, eb, 5 / 16);
              diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
            }
          }
        };

        // Skip expensive dithering while user is dragging sliders
        if (state.ditheringEnabled && !_isDraggingSize) {
          applyFSDither();
        } else {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i],
              g = data[i + 1],
              b = data[i + 2],
              a = data[i + 3];
            if (
              (!state.paintTransparentPixels && a < tThresh) ||
              (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))
            ) {
              data[i + 3] = 0;
              continue;
            }
            const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
            data[i] = nr;
            data[i + 1] = ng;
            data[i + 2] = nb;
            data[i + 3] = 255;
          }
        }

        if (jobId !== _previewJobId) return;
        baseCtx.putImageData(imgData, 0, 0);
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        if (_maskImageData) maskCtx.putImageData(_maskImageData, 0, 0);
        updateZoomLayout();
      };

      const onWidthInput = () => {
        if (keepAspect.checked) {
          heightSlider.value = Math.round(parseInt(widthSlider.value, 10) / aspectRatio);
        }
        _updateResizePreview();
        const curW = parseInt(widthSlider.value, 10);
        const curH = parseInt(heightSlider.value, 10);
        state.resizeSettings = {
          baseWidth: width,
          baseHeight: height,
          width: curW,
          height: curH,
        };
        saveBotSettings();
        // Auto-fit after size changes
        const fit = typeof computeFitZoom === 'function' ? computeFitZoom() : 1;
        if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
      };

      const onHeightInput = () => {
        if (keepAspect.checked) {
          widthSlider.value = Math.round(parseInt(heightSlider.value, 10) * aspectRatio);
        }
        _updateResizePreview();
        const curW = parseInt(widthSlider.value, 10);
        const curH = parseInt(heightSlider.value, 10);
        state.resizeSettings = {
          baseWidth: width,
          baseHeight: height,
          width: curW,
          height: curH,
        };
        saveBotSettings();
        // Auto-fit after size changes
        const fit = typeof computeFitZoom === 'function' ? computeFitZoom() : 1;
        if (!isNaN(fit) && isFinite(fit)) applyZoom(fit);
      };

      paintWhiteToggle.onchange = (e) => {
        state.paintWhitePixels = e.target.checked;
        _updateResizePreview();
        saveBotSettings();
      };

      paintTransparentToggle.onchange = (e) => {
        state.paintTransparentPixels = e.target.checked;
        _updateResizePreview();
        saveBotSettings();
      };

      let panX = 0,
        panY = 0;
      const clampPan = () => {
        const wrapRect = panStage?.getBoundingClientRect() || {
          width: 0,
          height: 0,
        };
        const w = (baseCanvas.width || 1) * _zoomLevel;
        const h = (baseCanvas.height || 1) * _zoomLevel;
        if (w <= wrapRect.width) {
          panX = Math.floor((wrapRect.width - w) / 2);
        } else {
          const minX = wrapRect.width - w;
          panX = Math.min(0, Math.max(minX, panX));
        }
        if (h <= wrapRect.height) {
          panY = Math.floor((wrapRect.height - h) / 2);
        } else {
          const minY = wrapRect.height - h;
          panY = Math.min(0, Math.max(minY, panY));
        }
      };
      let _panRaf = 0;
      const applyPan = () => {
        if (_panRaf) return;
        _panRaf = requestAnimationFrame(() => {
          clampPan();
          canvasStack.style.transform = `translate3d(${Math.round(
            panX
          )}px, ${Math.round(panY)}px, 0) scale(${_zoomLevel})`;
          _panRaf = 0;
        });
      };

      const updateZoomLayout = () => {
        const w = baseCanvas.width || 1,
          h = baseCanvas.height || 1;
        baseCanvas.style.width = w + 'px';
        baseCanvas.style.height = h + 'px';
        maskCanvas.style.width = w + 'px';
        maskCanvas.style.height = h + 'px';
        canvasStack.style.width = w + 'px';
        canvasStack.style.height = h + 'px';
        applyPan();
      };
      const applyZoom = (z) => {
        _zoomLevel = Math.max(0.05, Math.min(20, z || 1));
        zoomSlider.value = _zoomLevel;
        updateZoomLayout();
        if (zoomValue) zoomValue.textContent = `${Math.round(_zoomLevel * 100)}%`;
      };
      zoomSlider.addEventListener('input', () => {
        applyZoom(parseFloat(zoomSlider.value));
      });
      if (zoomInBtn)
        zoomInBtn.addEventListener('click', () => applyZoom(parseFloat(zoomSlider.value) + 0.1));
      if (zoomOutBtn)
        zoomOutBtn.addEventListener('click', () => applyZoom(parseFloat(zoomSlider.value) - 0.1));
      const computeFitZoom = () => {
        const wrapRect = panStage?.getBoundingClientRect();
        if (!wrapRect) return 1;
        const w = baseCanvas.width || 1;
        const h = baseCanvas.height || 1;
        const margin = 10;
        const scaleX = (wrapRect.width - margin) / w;
        const scaleY = (wrapRect.height - margin) / h;
        return Math.max(0.05, Math.min(20, Math.min(scaleX, scaleY)));
      };
      if (zoomFitBtn)
        zoomFitBtn.addEventListener('click', () => {
          applyZoom(computeFitZoom());
          centerInView();
        });
      if (zoomActualBtn)
        zoomActualBtn.addEventListener('click', () => {
          applyZoom(1);
          centerInView();
        });

      const centerInView = () => {
        if (!panStage) return;
        const rect = panStage.getBoundingClientRect();
        const w = (baseCanvas.width || 1) * _zoomLevel;
        const h = (baseCanvas.height || 1) * _zoomLevel;
        panX = Math.floor((rect.width - w) / 2);
        panY = Math.floor((rect.height - h) / 2);
        applyPan();
      };

      let isPanning = false;
      let startX = 0,
        startY = 0,
        startPanX = 0,
        startPanY = 0;
      let allowPan = false; // Space key
      let panMode = false; // Explicit pan mode toggle for touch/one-button mice
      const isPanMouseButton = (e) => e.button === 1 || e.button === 2;
      const setCursor = (val) => {
        if (panStage) panStage.style.cursor = val;
      };
      const isPanActive = (e) => panMode || allowPan || isPanMouseButton(e);
      const updatePanModeBtn = () => {
        if (!panModeBtn) return;
        panModeBtn.classList.toggle('active', panMode);
        panModeBtn.setAttribute('aria-pressed', panMode ? 'true' : 'false');
      };
      if (panModeBtn) {
        updatePanModeBtn();
        panModeBtn.addEventListener('click', () => {
          panMode = !panMode;
          updatePanModeBtn();
          setCursor(panMode ? 'grab' : '');
        });
      }
      if (panStage) {
        panStage.addEventListener('contextmenu', (e) => {
          if (allowPan) e.preventDefault();
        });
        window.addEventListener('keydown', (e) => {
          if (e.code === 'Space') {
            allowPan = true;
            setCursor('grab');
          }
        });
        window.addEventListener('keyup', (e) => {
          if (e.code === 'Space') {
            allowPan = false;
            if (!isPanning) setCursor('');
          }
        });
        panStage.addEventListener('mousedown', (e) => {
          if (!isPanActive(e)) return;
          e.preventDefault();
          isPanning = true;
          startX = e.clientX;
          startY = e.clientY;
          startPanX = panX;
          startPanY = panY;
          setCursor('grabbing');
        });
        window.addEventListener('mousemove', (e) => {
          if (!isPanning) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          panX = startPanX + dx;
          panY = startPanY + dy;
          applyPan();
        });
        window.addEventListener('mouseup', () => {
          if (isPanning) {
            isPanning = false;
            setCursor(allowPan ? 'grab' : '');
          }
        });
        panStage.addEventListener(
          'wheel',
          (e) => {
            if (!e.ctrlKey && !e.metaKey) return;
            e.preventDefault();
            const rect = panStage.getBoundingClientRect();
            const cx = e.clientX - rect.left - panX;
            const cy = e.clientY - rect.top - panY;
            const before = _zoomLevel;
            const step = Math.max(0.05, Math.min(0.5, Math.abs(e.deltaY) > 20 ? 0.2 : 0.1));
            const next = Math.max(0.05, Math.min(20, before + (e.deltaY > 0 ? -step : step)));
            if (next === before) return;
            const scale = next / before;
            panX = panX - cx * (scale - 1);
            panY = panY - cy * (scale - 1);
            applyZoom(next);
          },
          { passive: false }
        );
        let lastTouchDist = null;
        let touchStartTime = 0;
        let doubleTapTimer = null;
        panStage.addEventListener(
          'touchstart',
          (e) => {
            if (e.touches.length === 1) {
              const t = e.touches[0];
              isPanning = true;
              startX = t.clientX;
              startY = t.clientY;
              startPanX = panX;
              startPanY = panY;
              setCursor('grabbing');
              const now = Date.now();
              if (now - touchStartTime < 300) {
                // double tap -> toggle 100%/fit
                const z = Math.abs(_zoomLevel - 1) < 0.01 ? computeFitZoom() : 1;
                applyZoom(z);
                centerInView();
                if (doubleTapTimer) clearTimeout(doubleTapTimer);
              } else {
                touchStartTime = now;
                doubleTapTimer = setTimeout(() => {
                  doubleTapTimer = null;
                }, 320);
              }
            } else if (e.touches.length === 2) {
              // Pinch start
              const [a, b] = e.touches;
              lastTouchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
            }
          },
          { passive: true }
        );
        panStage.addEventListener(
          'touchmove',
          (e) => {
            if (e.touches.length === 1 && isPanning) {
              const t = e.touches[0];
              const dx = t.clientX - startX;
              const dy = t.clientY - startY;
              panX = startPanX + dx;
              panY = startPanY + dy;
              applyPan();
            } else if (e.touches.length === 2 && lastTouchDist != null) {
              e.preventDefault();
              const [a, b] = e.touches;
              const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
              const rect = panStage.getBoundingClientRect();
              const centerX = (a.clientX + b.clientX) / 2 - rect.left - panX;
              const centerY = (a.clientY + b.clientY) / 2 - rect.top - panY;
              const before = _zoomLevel;
              const scale = dist / (lastTouchDist || dist);
              const next = Math.max(0.05, Math.min(20, before * scale));
              if (next !== before) {
                panX = panX - centerX * (next / before - 1);
                panY = panY - centerY * (next / before - 1);
                applyZoom(next);
              }
              lastTouchDist = dist;
            }
          },
          { passive: false }
        );
        panStage.addEventListener('touchend', () => {
          isPanning = false;
          lastTouchDist = null;
          setCursor(panMode || allowPan ? 'grab' : '');
        });
      }
      const schedulePreview = () => {
        if (_previewTimer) clearTimeout(_previewTimer);
        const run = () => {
          _previewTimer = null;
          _updateResizePreview();
        };
        if (window.requestIdleCallback) {
          _previewTimer = setTimeout(() => requestIdleCallback(run, { timeout: 150 }), 50);
        } else {
          _previewTimer = setTimeout(() => requestAnimationFrame(run), 50);
        }
      };
      // Track dragging to reduce work and skip dithering during drag
      const markDragStart = () => {
        _isDraggingSize = true;
      };
      const markDragEnd = () => {
        _isDraggingSize = false;
        schedulePreview();
      };
      widthSlider.addEventListener('pointerdown', markDragStart);
      heightSlider.addEventListener('pointerdown', markDragStart);
      widthSlider.addEventListener('pointerup', markDragEnd);
      heightSlider.addEventListener('pointerup', markDragEnd);
      widthSlider.addEventListener('input', () => {
        onWidthInput();
        schedulePreview();
      });
      heightSlider.addEventListener('input', () => {
        onHeightInput();
        schedulePreview();
      });

      // Mask painting UX: brush size, modes, row/column fills, and precise coords
      let draggingMask = false;
      let lastPaintX = -1,
        lastPaintY = -1;
      let brushSize = 1;
      let rowColSize = 1;
      let maskMode = 'ignore'; // 'ignore' | 'unignore' | 'toggle'
      const brushEl = resizeContainer.querySelector('#maskBrushSize');
      const brushValEl = resizeContainer.querySelector('#maskBrushSizeValue');
      const btnIgnore = resizeContainer.querySelector('#maskModeIgnore');
      const btnUnignore = resizeContainer.querySelector('#maskModeUnignore');
      const btnToggle = resizeContainer.querySelector('#maskModeToggle');
      const clearIgnoredBtnEl = resizeContainer.querySelector('#clearIgnoredBtn');
      const invertMaskBtn = resizeContainer.querySelector('#invertMaskBtn');
      const rowColSizeEl = resizeContainer.querySelector('#rowColSize');
      const rowColSizeValEl = resizeContainer.querySelector('#rowColSizeValue');

      const updateModeButtons = () => {
        const map = [
          [btnIgnore, 'ignore'],
          [btnUnignore, 'unignore'],
          [btnToggle, 'toggle'],
        ];
        for (const [el, m] of map) {
          if (!el) continue;
          const active = maskMode === m;
          el.classList.toggle('active', active);
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
        }
      };
      const setMode = (mode) => {
        maskMode = mode;
        updateModeButtons();
      };
      if (brushEl && brushValEl) {
        brushEl.addEventListener('input', () => {
          brushSize = parseInt(brushEl.value, 10) || 1;
          brushValEl.textContent = brushSize;
        });
        brushValEl.textContent = brushEl.value;
        brushSize = parseInt(brushEl.value, 10) || 1;
      }
      if (rowColSizeEl && rowColSizeValEl) {
        rowColSizeEl.addEventListener('input', () => {
          rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
          rowColSizeValEl.textContent = rowColSize;
        });
        rowColSizeValEl.textContent = rowColSizeEl.value;
        rowColSize = parseInt(rowColSizeEl.value, 10) || 1;
      }
      if (btnIgnore) btnIgnore.addEventListener('click', () => setMode('ignore'));
      if (btnUnignore) btnUnignore.addEventListener('click', () => setMode('unignore'));
      if (btnToggle) btnToggle.addEventListener('click', () => setMode('toggle'));
      // Initialize button state (default to toggle mode)
      updateModeButtons();

      const mapClientToPixel = (clientX, clientY) => {
        // Compute without rounding until final step to avoid drift at higher zoom
        const rect = baseCanvas.getBoundingClientRect();
        const scaleX = rect.width / baseCanvas.width;
        const scaleY = rect.height / baseCanvas.height;
        const dx = (clientX - rect.left) / scaleX;
        const dy = (clientY - rect.top) / scaleY;
        const x = Math.floor(dx);
        const y = Math.floor(dy);
        return { x, y };
      };

      const ensureMask = (w, h) => {
        if (!state.resizeIgnoreMask || state.resizeIgnoreMask.length !== w * h) {
          state.resizeIgnoreMask = new Uint8Array(w * h);
        }
      };

      const paintCircle = (cx, cy, radius, value) => {
        const w = baseCanvas.width,
          h = baseCanvas.height;
        ensureMask(w, h);
        const r2 = radius * radius;
        for (let yy = cy - radius; yy <= cy + radius; yy++) {
          if (yy < 0 || yy >= h) continue;
          for (let xx = cx - radius; xx <= cx + radius; xx++) {
            if (xx < 0 || xx >= w) continue;
            const dx = xx - cx,
              dy = yy - cy;
            if (dx * dx + dy * dy <= r2) {
              const idx = yy * w + xx;
              let val = state.resizeIgnoreMask[idx];
              if (maskMode === 'toggle') {
                val = val ? 0 : 1;
              } else if (maskMode === 'ignore') {
                val = 1;
              } else {
                val = 0;
              }
              state.resizeIgnoreMask[idx] = val;
              if (_maskData) {
                const p = idx * 4;
                if (val) {
                  _maskData[p] = 255;
                  _maskData[p + 1] = 0;
                  _maskData[p + 2] = 0;
                  _maskData[p + 3] = 150;
                } else {
                  _maskData[p] = 0;
                  _maskData[p + 1] = 0;
                  _maskData[p + 2] = 0;
                  _maskData[p + 3] = 0;
                }
                _markDirty(xx, yy);
              }
            }
          }
        }
      };

      const paintRow = (y, value) => {
        const w = baseCanvas.width,
          h = baseCanvas.height;
        ensureMask(w, h);
        if (y < 0 || y >= h) return;

        // Paint multiple rows based on rowColSize
        const halfSize = Math.floor(rowColSize / 2);
        const startY = Math.max(0, y - halfSize);
        const endY = Math.min(h - 1, y + halfSize);

        for (let rowY = startY; rowY <= endY; rowY++) {
          for (let x = 0; x < w; x++) {
            const idx = rowY * w + x;
            let val = state.resizeIgnoreMask[idx];
            if (maskMode === 'toggle') {
              val = val ? 0 : 1;
            } else if (maskMode === 'ignore') {
              val = 1;
            } else {
              val = 0;
            }
            state.resizeIgnoreMask[idx] = val;
            if (_maskData) {
              const p = idx * 4;
              if (val) {
                _maskData[p] = 255;
                _maskData[p + 1] = 0;
                _maskData[p + 2] = 0;
                _maskData[p + 3] = 150;
              } else {
                _maskData[p] = 0;
                _maskData[p + 1] = 0;
                _maskData[p + 2] = 0;
                _maskData[p + 3] = 0;
              }
            }
          }
          if (_maskData) {
            _markDirty(0, rowY);
            _markDirty(w - 1, rowY);
          }
        }
      };

      const paintColumn = (x, value) => {
        const w = baseCanvas.width,
          h = baseCanvas.height;
        ensureMask(w, h);
        if (x < 0 || x >= w) return;

        // Paint multiple columns based on rowColSize
        const halfSize = Math.floor(rowColSize / 2);
        const startX = Math.max(0, x - halfSize);
        const endX = Math.min(w - 1, x + halfSize);

        for (let colX = startX; colX <= endX; colX++) {
          for (let y = 0; y < h; y++) {
            const idx = y * w + colX;
            let val = state.resizeIgnoreMask[idx];
            if (maskMode === 'toggle') {
              val = val ? 0 : 1;
            } else if (maskMode === 'ignore') {
              val = 1;
            } else {
              val = 0;
            }
            state.resizeIgnoreMask[idx] = val;
            if (_maskData) {
              const p = idx * 4;
              if (val) {
                _maskData[p] = 255;
                _maskData[p + 1] = 0;
                _maskData[p + 2] = 0;
                _maskData[p + 3] = 150;
              } else {
                _maskData[p] = 0;
                _maskData[p + 1] = 0;
                _maskData[p + 2] = 0;
                _maskData[p + 3] = 0;
              }
            }
          }
          if (_maskData) {
            _markDirty(colX, 0);
            _markDirty(colX, h - 1);
          }
        }
      };

      const redrawMaskOverlay = () => {
        // Only flush the dirty region; full rebuild happens on size change
        _flushDirty();
      };

      const handlePaint = (e) => {
        // Suppress painting while panning
        if ((e.buttons & 4) === 4 || (e.buttons & 2) === 2 || allowPan) return;
        const { x, y } = mapClientToPixel(e.clientX, e.clientY);
        const w = baseCanvas.width,
          h = baseCanvas.height;
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const radius = Math.max(1, Math.floor(brushSize / 2));
        if (e.shiftKey) {
          paintRow(y);
        } else if (e.altKey) {
          paintColumn(x);
        } else {
          paintCircle(x, y, radius);
        }
        lastPaintX = x;
        lastPaintY = y;
        redrawMaskOverlay();
      };

      maskCanvas.addEventListener('mousedown', (e) => {
        if (e.button === 1 || e.button === 2 || allowPan) return; // let pan handler manage
        draggingMask = true;
        handlePaint(e);
      });
      // Avoid hijacking touch gestures for panning/zooming
      maskCanvas.addEventListener(
        'touchstart',
        (e) => {
          /* let panStage handle */
        },
        { passive: true }
      );
      maskCanvas.addEventListener(
        'touchmove',
        (e) => {
          /* let panStage handle */
        },
        { passive: true }
      );
      maskCanvas.addEventListener(
        'touchend',
        (e) => {
          /* let panStage handle */
        },
        { passive: true }
      );
      window.addEventListener('mousemove', (e) => {
        if (draggingMask) handlePaint(e);
      });
      window.addEventListener('mouseup', () => {
        if (draggingMask) {
          draggingMask = false;
          saveBotSettings();
        }
      });

      if (clearIgnoredBtnEl)
        clearIgnoredBtnEl.addEventListener('click', () => {
          const w = baseCanvas.width,
            h = baseCanvas.height;
          if (state.resizeIgnoreMask) state.resizeIgnoreMask.fill(0);
          _ensureMaskOverlayBuffers(w, h, true);
          _updateResizePreview();
          saveBotSettings();
        });

      if (invertMaskBtn)
        invertMaskBtn.addEventListener('click', () => {
          if (!state.resizeIgnoreMask) return;
          for (let i = 0; i < state.resizeIgnoreMask.length; i++)
            state.resizeIgnoreMask[i] = state.resizeIgnoreMask[i] ? 0 : 1;
          const w = baseCanvas.width,
            h = baseCanvas.height;
          _ensureMaskOverlayBuffers(w, h, true);
          _updateResizePreview();
          saveBotSettings();
        });

      confirmResize.onclick = async () => {
        const newWidth = parseInt(widthSlider.value, 10);
        const newHeight = parseInt(heightSlider.value, 10);

        // Generate the final paletted image data
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        tempCtx.imageSmoothingEnabled = false;
        if (baseProcessor !== processor && (!baseProcessor.img || !baseProcessor.canvas)) {
          await baseProcessor.load();
        }
        tempCtx.drawImage(baseProcessor.img, 0, 0, newWidth, newHeight);
        const imgData = tempCtx.getImageData(0, 0, newWidth, newHeight);
        const data = imgData.data;
        const tThresh2 = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
        let totalValidPixels = 0;
        const mask =
          state.resizeIgnoreMask && state.resizeIgnoreMask.length === newWidth * newHeight
            ? state.resizeIgnoreMask
            : null;

        const applyFSDitherFinal = async () => {
          const w = newWidth,
            h = newHeight;
          const n = w * h;
          const { work, eligible } = ensureDitherBuffers(n);
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              const i4 = idx * 4;
              const r = data[i4],
                g = data[i4 + 1],
                b = data[i4 + 2],
                a = data[i4 + 3];
              const masked = mask && mask[idx];
              const isEligible =
                !masked &&
                (state.paintTransparentPixels || a >= tThresh2) &&
                (state.paintWhitePixels || !Utils.isWhitePixel(r, g, b));
              eligible[idx] = isEligible ? 1 : 0;
              work[idx * 3] = r;
              work[idx * 3 + 1] = g;
              work[idx * 3 + 2] = b;
              if (!isEligible) {
                data[i4 + 3] = 0;
              }
            }
            // Yield to keep UI responsive
            if ((y & 15) === 0) await Promise.resolve();
          }

          const diffuse = (nx, ny, er, eg, eb, factor) => {
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) return;
            const nidx = ny * w + nx;
            if (!eligible[nidx]) return;
            const base = nidx * 3;
            work[base] = Math.min(255, Math.max(0, work[base] + er * factor));
            work[base + 1] = Math.min(255, Math.max(0, work[base + 1] + eg * factor));
            work[base + 2] = Math.min(255, Math.max(0, work[base + 2] + eb * factor));
          };

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const idx = y * w + x;
              if (!eligible[idx]) continue;
              const base = idx * 3;
              const r0 = work[base],
                g0 = work[base + 1],
                b0 = work[base + 2];
              const [nr, ng, nb] = Utils.findClosestPaletteColor(
                r0,
                g0,
                b0,
                state.activeColorPalette
              );
              const i4 = idx * 4;
              data[i4] = nr;
              data[i4 + 1] = ng;
              data[i4 + 2] = nb;
              data[i4 + 3] = 255;
              totalValidPixels++;

              const er = r0 - nr;
              const eg = g0 - ng;
              const eb = b0 - nb;

              diffuse(x + 1, y, er, eg, eb, 7 / 16);
              diffuse(x - 1, y + 1, er, eg, eb, 3 / 16);
              diffuse(x, y + 1, er, eg, eb, 5 / 16);
              diffuse(x + 1, y + 1, er, eg, eb, 1 / 16);
            }
            // Yield every row to reduce jank
            await Promise.resolve();
          }
        };

        if (state.ditheringEnabled) {
          await applyFSDitherFinal();
        } else {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i],
              g = data[i + 1],
              b = data[i + 2],
              a = data[i + 3];
            const masked = mask && mask[i >> 2];
            const isTransparent = (!state.paintTransparentPixels && a < tThresh2) || masked;
            const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);
            if (isTransparent || isWhiteAndSkipped) {
              data[i + 3] = 0; // overlay transparency
              continue;
            }
            totalValidPixels++;
            const [nr, ng, nb] = Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);
            data[i] = nr;
            data[i + 1] = ng;
            data[i + 2] = nb;
            data[i + 3] = 255;
          }
        }
        tempCtx.putImageData(imgData, 0, 0);

        // Save the final pixel data for painting
        // Persist the paletted (and possibly dithered) pixels so painting uses the same output seen in overlay
        const palettedPixels = new Uint8ClampedArray(imgData.data);
        state.imageData.pixels = palettedPixels;
        state.imageData.width = newWidth;
        state.imageData.height = newHeight;
        state.imageData.totalPixels = totalValidPixels;
        state.totalPixels = totalValidPixels;
        state.paintedPixels = 0;

        state.resizeSettings = {
          baseWidth: width,
          baseHeight: height,
          width: newWidth,
          height: newHeight,
        };
        saveBotSettings();

        const finalImageBitmap = await createImageBitmap(tempCanvas);
        await overlayManager.setImage(finalImageBitmap);
        overlayManager.enable();
        toggleOverlayBtn.classList.add('active');
        toggleOverlayBtn.setAttribute('aria-pressed', 'true');

        // Keep state.imageData.processor as the original-based source; painting uses paletted pixels already stored

        await updateStats();
        updateUI('resizeSuccess', 'success', {
          width: newWidth,
          height: newHeight,
        });
        closeResizeDialog();
      };

      downloadPreviewBtn.onclick = () => {
        try {
          const w = baseCanvas.width,
            h = baseCanvas.height;
          const out = document.createElement('canvas');
          out.width = w;
          out.height = h;
          const octx = out.getContext('2d');
          octx.imageSmoothingEnabled = false;
          octx.drawImage(baseCanvas, 0, 0);
          octx.drawImage(maskCanvas, 0, 0);
          const link = document.createElement('a');
          link.download = 'wplace-preview.png';
          link.href = out.toDataURL();
          link.click();
        } catch (e) {
          console.warn('Failed to download preview:', e);
        }
      };

      cancelResize.onclick = closeResizeDialog;

      editImageBtn.onclick = () => {
        showEditPanel();
      };

      resizeOverlay.style.display = 'block';
      resizeContainer.style.display = 'block';

      // Reinitialize color palette with current available colors
      initializeColorPalette(resizeContainer);

      _updateResizePreview();
      _resizeDialogCleanup = () => {
        try {
          zoomSlider.replaceWith(zoomSlider.cloneNode(true));
        } catch { }
        try {
          if (zoomInBtn) zoomInBtn.replaceWith(zoomInBtn.cloneNode(true));
        } catch { }
        try {
          if (zoomOutBtn) zoomOutBtn.replaceWith(zoomOutBtn.cloneNode(true));
        } catch { }
      };
      setTimeout(() => {
        if (typeof computeFitZoom === 'function') {
          const z = computeFitZoom();
          if (!isNaN(z) && isFinite(z)) {
            applyZoom(z);
            centerInView();
          }
        } else {
          centerInView();
        }
      }, 0);
    }

    function closeResizeDialog() {
      try {
        if (typeof _resizeDialogCleanup === 'function') {
          _resizeDialogCleanup();
        }
      } catch { }
      resizeOverlay.style.display = 'none';
      resizeContainer.style.display = 'none';
      _updateResizePreview = () => { };
      try {
        if (typeof cancelAnimationFrame === 'function' && _panRaf) {
          cancelAnimationFrame(_panRaf);
        }
      } catch { }
      try {
        if (_previewTimer) {
          clearTimeout(_previewTimer);
          _previewTimer = null;
        }
      } catch { }
      _maskImageData = null;
      _maskData = null;
      _dirty = null;
      _ditherWorkBuf = null;
      _ditherEligibleBuf = null;
      _resizeDialogCleanup = null;
    }

    function showEditPanel() {
      try {
        // Validate that we have a valid base canvas
        if (!baseCanvas || !baseCanvas.width || !baseCanvas.height) {
          Utils.showAlert('No image available for editing. Please upload an image first.', 'error');
          return;
        }
        
        // Hide resize panel
        resizeContainer.style.display = 'none';
        
        // Create edit panel if it doesn't exist
        let editOverlay = document.getElementById('editOverlay');
        if (!editOverlay) {
          createEditPanel();
          editOverlay = document.getElementById('editOverlay');
        }
        
        // Get current image data from baseCanvas
        const imageData = baseCanvas.toDataURL();
        
        // Initialize edit panel with current image
        initializeEditPanel(imageData);
        
        // Show edit panel
        editOverlay.style.display = 'block';
        
        console.log('✨ Pixel Art Editor opened successfully');
      } catch (error) {
        console.error('Error opening pixel art editor:', error);
        Utils.showAlert('Failed to open pixel art editor. Please try again.', 'error');
      }
    }

    function createEditPanel() {
      const editOverlay = document.createElement('div');
      editOverlay.id = 'editOverlay';
      editOverlay.className = 'edit-overlay';
      
      editOverlay.innerHTML = `
        <div class="edit-container">
          <div class="edit-header">
            <div class="edit-header-left">
              <h3>Manual Pixel Art Editor</h3>
              <div class="edit-instructions">
                <small>🖱️ Left click: Draw | Right click/Ctrl+drag: Pan | Mouse wheel: Zoom</small>
              </div>
            </div>
            <div class="edit-nav-controls">
              <div class="zoom-controls">
                <button id="editZoomOut" class="zoom-btn" title="Zoom Out (Ctrl + -)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                </button>
                <select id="zoomSelect" class="zoom-select" title="Zoom Level">
                  <option value="0.1">10%</option>
                  <option value="0.25">25%</option>
                  <option value="0.5">50%</option>
                  <option value="0.75">75%</option>
                  <option value="1" selected>100%</option>
                  <option value="1.5">150%</option>
                  <option value="2">200%</option>
                  <option value="3">300%</option>
                  <option value="4">400%</option>
                  <option value="6">600%</option>
                  <option value="8">800%</option>
                  <option value="12">1200%</option>
                  <option value="16">1600%</option>
                  <option value="24">2400%</option>
                  <option value="32">3200%</option>
                </select>
                <button id="editZoomIn" class="zoom-btn" title="Zoom In (Ctrl + +)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
                <button id="zoomFit" class="zoom-btn" title="Fit to Window (Ctrl + 0)">📰</button>
                <button id="zoom100" class="zoom-btn" title="Actual Size (Ctrl + 1)">1:1</button>
              </div>
              <div class="edit-controls">
                <button id="editBackBtn" class="wplace-btn wplace-btn-secondary">← Back</button>
                <button id="editApplyBtn" class="wplace-btn wplace-btn-confirm">Apply Changes</button>
              </div>
            </div>
          </div>
          
          <div class="edit-content">
            <div class="edit-main-area">
              <div class="edit-toolbar">
                <div class="edit-tool-group">
                  <label>Tools:</label>
                  <button id="paintBrush" class="edit-tool active" data-tool="paint" title="Brush (B)">🖌</button>
                  <button id="eraseTool" class="edit-tool" data-tool="erase" title="Eraser (E)">🗑</button>
                  <button id="eyedropperTool" class="edit-tool" data-tool="eyedropper" title="Eyedropper (I)">💉</button>
                  <button id="fillTool" class="edit-tool" data-tool="fill" title="Fill (F)">🪣</button>
                </div>
                
                <div class="edit-tool-group">
                  <label>Brush Size:</label>
                  <input type="range" id="brushSize" min="1" max="20" value="1" class="edit-slider" title="Use [ ] keys">
                  <span id="brushSizeValue">1</span>
                  <button id="showGrid" class="edit-toggle" title="Toggle Grid (G)">⊞</button>
                </div>
                
                <div class="edit-tool-group">
                  <button id="undoBtn" class="wplace-btn wplace-btn-secondary" title="Undo (Ctrl+Z)">↶</button>
                  <button id="redoBtn" class="wplace-btn wplace-btn-secondary" title="Redo (Ctrl+Shift+Z)">↷</button>
                  <button id="resetViewBtn" class="wplace-btn wplace-btn-secondary" title="Reset View">🔄</button>
                </div>
              </div>
              
              <div class="edit-canvas-area">
                <div class="edit-canvas-container" id="editCanvasContainer">
                  <div class="edit-canvas-wrapper" id="editCanvasWrapper">
                    <canvas id="editCanvas" class="edit-canvas"></canvas>
                  </div>
                  <div class="minimap-container" id="minimapContainer">
                    <div class="minimap-header">Navigator</div>
                    <div class="minimap-content">
                      <canvas id="minimapCanvas" class="minimap-canvas"></canvas>
                      <div id="minimapViewport" class="minimap-viewport"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="edit-bottom-bar">
              <div class="edit-info-section">
                <span id="editStatusBar">Position: (0, 0) | Color: #000000 | Zoom: 100%</span>
              </div>
              <div class="edit-current-color">
                <label>Current:</label>
                <div id="currentColorDisplay" class="color-display"></div>
              </div>
              <div class="edit-available-colors">
                <label>Available Colors (<span id="editColorCount">0</span>):</label>
                <div id="editColorGrid" class="edit-color-grid">
                  <!-- Colors will be populated here -->
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(editOverlay);
      
      // Set up event handlers
      setupEditPanelEvents();
    }

    function setupEditPanelEvents() {
      const editBackBtn = document.getElementById('editBackBtn');
      const editApplyBtn = document.getElementById('editApplyBtn');
      const paintBrush = document.getElementById('paintBrush');
      const eraseTool = document.getElementById('eraseTool');
      const eyedropperTool = document.getElementById('eyedropperTool');
      const fillTool = document.getElementById('fillTool');
      const brushSize = document.getElementById('brushSize');
      const brushSizeValue = document.getElementById('brushSizeValue');
      const showGrid = document.getElementById('showGrid');
      const undoBtn = document.getElementById('undoBtn');
      const redoBtn = document.getElementById('redoBtn');
      const resetViewBtn = document.getElementById('resetViewBtn');
      const editZoomIn = document.getElementById('editZoomIn');
      const editZoomOut = document.getElementById('editZoomOut');
      const zoomSelect = document.getElementById('zoomSelect');
      const zoomFit = document.getElementById('zoomFit');
      const zoom100 = document.getElementById('zoom100');
      const minimapCanvas = document.getElementById('minimapCanvas');
      
      // Back to resize panel
      editBackBtn.onclick = () => {
        document.getElementById('editOverlay').style.display = 'none';
        resizeContainer.style.display = 'block';
      };
      
      // Apply changes
      editApplyBtn.onclick = () => {
        applyEditChanges();
        document.getElementById('editOverlay').style.display = 'none';
        resizeContainer.style.display = 'block';
      };
      
      // Tool selection
      paintBrush.onclick = () => {
        selectTool('paint');
      };
      
      eraseTool.onclick = () => {
        selectTool('erase');
      };
      
      eyedropperTool.onclick = () => {
        selectTool('eyedropper');
      };
      
      fillTool.onclick = () => {
        selectTool('fill');
      };
      
      // Grid toggle
      showGrid.onclick = () => {
        editState.showGrid = !editState.showGrid;
        showGrid.classList.toggle('active', editState.showGrid);
        redrawCanvas();
      };
      
      // Brush size
      brushSize.oninput = () => {
        brushSizeValue.textContent = brushSize.value;
        updateBrushSize(parseInt(brushSize.value));
      };
      
      // Undo/Redo
      undoBtn.onclick = () => undoEdit();
      redoBtn.onclick = () => redoEdit();
      
      // Reset view
      resetViewBtn.onclick = () => resetEditView();
      
      // Enhanced zoom controls
      editZoomIn.onclick = () => zoomIn();
      editZoomOut.onclick = () => zoomOut();
      
      zoomSelect.onchange = () => {
        const newZoom = parseFloat(zoomSelect.value);
        setZoom(newZoom);
      };
      
      zoomFit.onclick = () => fitToWindow();
      zoom100.onclick = () => setZoom(1);
      
      // Minimap navigation
      if (minimapCanvas) {
        minimapCanvas.onclick = (e) => navigateToMinimapPosition(e);
      }
    }

    const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32];

    let editState = {
      currentTool: 'paint',
      currentColor: '#000000',
      currentColorId: null,
      brushSize: 1,
      zoom: 1,
      panX: 0,
      panY: 0,
      undoStack: [],
      redoStack: [],
      isDrawing: false,
      isPanning: false,
      showGrid: false,

      mouseX: 0,
      mouseY: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      updatePending: false,
      lastPaintPos: null,
      touchStart: null,
      lastTouchDistance: 0,
      lastTouchCenter: { x: 0, y: 0 }
    };

    function calculateOptimalPanelSize(imageWidth, imageHeight) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Reserve minimal space for UI elements for almost fullscreen experience
      const uiReserved = {
        header: 80,
        toolbar: 60, 
        bottomBar: 120,
        padding: 40
      };
      
      const maxCanvasWidth = viewportWidth - uiReserved.padding;
      const maxCanvasHeight = viewportHeight - uiReserved.header - uiReserved.toolbar - uiReserved.bottomBar - uiReserved.padding;
      
      // Calculate optimal initial zoom to fit image
      const scaleX = maxCanvasWidth / imageWidth;
      const scaleY = maxCanvasHeight / imageHeight;
      const initialZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in initially
      
      return {
        panelWidth: Math.min(viewportWidth * 0.95, imageWidth * initialZoom + uiReserved.colorPanel + uiReserved.padding),
        panelHeight: Math.min(viewportHeight * 0.95, imageHeight * initialZoom + uiReserved.toolbar + uiReserved.statusBar + uiReserved.canvasToolbar + uiReserved.padding),
        canvasWidth: Math.min(maxCanvasWidth, imageWidth * initialZoom),
        canvasHeight: Math.min(maxCanvasHeight, imageHeight * initialZoom),
        initialZoom: Math.max(0.1, initialZoom)
      };
    }

    function initializeEditPanel(imageData) {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      // Reset edit state
      editState.zoom = 1;
      editState.panX = 0;
      editState.panY = 0;
      editState.undoStack = [];
      editState.redoStack = [];
      editState.currentTool = 'paint';
      editState.brushSize = 1;
      editState.showGrid = false;
      editState.isPanning = false;
      editState.isDrawing = false;
      editState.lastPaintPos = null;
      
      // Set canvas size to match baseCanvas
      editCanvas.width = baseCanvas.width;
      editCanvas.height = baseCanvas.height;
      editState.canvasWidth = editCanvas.width;
      editState.canvasHeight = editCanvas.height;
      
      // Configure canvas context for pixel art
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      
      // Calculate optimal panel size
      const panelSize = calculateOptimalPanelSize(editCanvas.width, editCanvas.height);
      const editContainer = document.querySelector('.edit-container');
      if (editContainer) {
        editContainer.style.width = panelSize.panelWidth + 'px';
        editContainer.style.height = panelSize.panelHeight + 'px';
      }
      
      // Setup canvas container
      setupCanvasContainer();
      
      // Load image onto canvas
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
        ctx.drawImage(img, 0, 0);
        
  // Always fit artwork to the visible area on start and center
  fitToWindow();
  centerCanvas();
        
        // Setup minimap
        setupMinimap();
        
        // Save initial state for undo
        saveEditState();
        
        // Set up canvas drawing events
        setupCanvasDrawing();
        
        // Initialize color palette
        initializeEditColorPalette();
        
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        
        // Setup touch support
        setupTouchSupport();
        
        // Set initial tool
        selectTool('paint');
        
        // Update status bar
        updateStatusBar(0, 0);
        
        // Center canvas initially
        centerCanvas();
      };
      img.src = imageData;
    }

    // mapClientToCanvas function for coordinate mapping
    function mapClientToCanvas(clientX, clientY) {
      const canvas = document.getElementById('editCanvas');
      const wrapper = document.getElementById('editCanvasWrapper');
      const container = document.getElementById('editCanvasContainer');
      
      if (!canvas || !wrapper || !container) return null;
      
      // Get the actual canvas element bounds (after CSS transform)
      const canvasRect = canvas.getBoundingClientRect();
      
      // Calculate relative position within the actual canvas bounds
      const relativeX = (clientX - canvasRect.left) / canvasRect.width * canvas.width;
      const relativeY = (clientY - canvasRect.top) / canvasRect.height * canvas.height;
      
      // Convert to canvas coordinates
      const canvasX = Math.floor(relativeX);
      const canvasY = Math.floor(relativeY);
      
      // Bounds checking
      if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) {
        return null;
      }
      
      return { x: canvasX, y: canvasY };
    }

    function setupCanvasDrawing() {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      let isDrawing = false;
      let isPanning = false;
      let lastX = 0;
      let lastY = 0;
      let panStartX = 0;
      let panStartY = 0;
      
      const getMousePos = (e) => {
        return mapClientToCanvas(e.clientX, e.clientY);
      };
      
      editCanvas.onmousedown = (e) => {
        if (e.button === 2 || e.ctrlKey) { // Right click or Ctrl+click for panning
          editState.isPanning = true;
          panStartX = e.clientX - editState.panX;
          panStartY = e.clientY - editState.panY;
          editCanvas.style.cursor = 'move';
          e.preventDefault();
          return;
        }
        
        const pos = getMousePos(e);
        if (!pos) return;
        
        if (editState.currentTool === 'eyedropper') {
          handleEyedropper(pos.x, pos.y);
          return;
        }
        
        if (editState.currentTool === 'fill') {
          floodFill(pos.x, pos.y, editState.currentColor);
          saveEditState();
          return;
        }
        
        editState.isDrawing = true;
        editState.lastPaintPos = { x: pos.x, y: pos.y };
        lastX = pos.x;
        lastY = pos.y;
        
        paintAtPosition(pos.x, pos.y, true);
      };
      
      editCanvas.onmousemove = (e) => {
        const pos = getMousePos(e);
        
        if (pos) {
          editState.mouseX = pos.x;
          editState.mouseY = pos.y;
          updateStatusBar(pos.x, pos.y);
        }
        
        if (editState.isPanning) {
          editState.panX = e.clientX - panStartX;
          editState.panY = e.clientY - panStartY;
          constrainPan();
          updateCanvasTransform();
          updateMinimap();
          return;
        }
        
        if (!editState.isDrawing) {
          return;
        }
        
        if (pos && editState.lastPaintPos) {
          paintAtPosition(pos.x, pos.y, true);
          editState.lastPaintPos = { x: pos.x, y: pos.y };
        }
      };
      
      editCanvas.onmouseup = (e) => {
        if (editState.isPanning) {
          editState.isPanning = false;
          selectTool(editState.currentTool); // Restore cursor
          return;
        }
        
        if (editState.isDrawing) {
          editState.isDrawing = false;
          editState.lastPaintPos = null;
          saveEditState();
        }
      };
      
      editCanvas.onmouseleave = () => {
        if (editState.isPanning) {
          editState.isPanning = false;
          selectTool(editState.currentTool); // Restore cursor
        }
        
        if (editState.isDrawing) {
          editState.isDrawing = false;
          editState.lastPaintPos = null;
          saveEditState();
        }
      };
      
      // Prevent context menu on right click
      editCanvas.oncontextmenu = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Enhanced zoom with mouse wheel (zoom to cursor)
      editCanvas.onwheel = (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.2 : 1/1.2;
        zoomToPoint(editState.zoom * zoomFactor, e.clientX, e.clientY);
      };
    }

    function paintAtPosition(x, y, isMouseDown = true) {
      if (!isMouseDown || !editState.currentColor) return;
      
      const canvas = document.getElementById('editCanvas');
      const ctx = canvas.getContext('2d');
      
      if (editState.lastPaintPos && editState.currentTool === 'paint') {
        // Draw line from last position to current position
        drawLine(ctx, editState.lastPaintPos.x, editState.lastPaintPos.y, x, y, editState.currentTool);
      } else {
        // Single brush stroke
        drawBrush(ctx, x, y, editState.currentTool);
      }
      
      editState.lastPaintPos = { x, y };
      
      // Update minimap thumbnail
      if (!editState.updatePending) {
        editState.updatePending = true;
        requestAnimationFrame(() => {
          setupMinimap();
          editState.updatePending = false;
        });
      }
    }

    function drawBrush(ctx, x, y, tool) {
      const size = editState.brushSize;
      const halfSize = Math.floor(size / 2);
      
      if (tool === 'paint') {
        ctx.fillStyle = editState.currentColor;
        for (let dx = 0; dx < size; dx++) {
          for (let dy = 0; dy < size; dy++) {
            // Center the brush at the cursor position
            const px = x - halfSize + dx;
            const py = y - halfSize + dy;
            
            if (px >= 0 && px < ctx.canvas.width && py >= 0 && py < ctx.canvas.height) {
              ctx.fillRect(px, py, 1, 1);
            }
          }
        }
      } else if (tool === 'erase') {
        for (let dx = 0; dx < size; dx++) {
          for (let dy = 0; dy < size; dy++) {
            // Center the brush at the cursor position
            const px = x - halfSize + dx;
            const py = y - halfSize + dy;
            
            if (px >= 0 && px < ctx.canvas.width && py >= 0 && py < ctx.canvas.height) {
              ctx.clearRect(px, py, 1, 1);
            }
          }
        }
      }
    }

    function drawPixel(x, y) {
      drawBrush(document.getElementById('editCanvas').getContext('2d'), x, y, 'paint');
    }

    function erasePixel(x, y) {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      const size = editState.brushSize;
      const halfSize = Math.floor(size / 2);
      
      for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
          // Center the brush at the cursor position (consistent with drawBrush)
          const px = x - halfSize + dx;
          const py = y - halfSize + dy;
          
          if (px >= 0 && px < editCanvas.width && py >= 0 && py < editCanvas.height) {
            ctx.clearRect(px, py, 1, 1);
          }
        }
      }
    }

    function drawLine(ctx, x1, y1, x2, y2, tool) {
      // Bresenham's line algorithm with tool support
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = x1 < x2 ? 1 : -1;
      const sy = y1 < y2 ? 1 : -1;
      let err = dx - dy;
      
      let x = x1;
      let y = y1;
      
      while (true) {
        drawBrush(ctx, x, y, tool);
        
        if (x === x2 && y === y2) break;
        
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    }

    function eraseLine(x1, y1, x2, y2) {
      // Same as drawLine but with erase
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const sx = x1 < x2 ? 1 : -1;
      const sy = y1 < y2 ? 1 : -1;
      let err = dx - dy;
      
      let x = x1;
      let y = y1;
      
      while (true) {
        erasePixel(x, y);
        
        if (x === x2 && y === y2) break;
        
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }
        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }
    }

    function selectTool(tool) {
      editState.currentTool = tool;
      
      document.querySelectorAll('.edit-tool').forEach(btn => {
        btn.classList.remove('active');
      });
      
      const editCanvas = document.getElementById('editCanvas');
      
      switch(tool) {
        case 'paint':
          document.getElementById('paintBrush').classList.add('active');
          editCanvas.style.cursor = 'crosshair';
          break;
        case 'erase':
          document.getElementById('eraseTool').classList.add('active');
          editCanvas.style.cursor = 'not-allowed';
          break;
        case 'eyedropper':
          document.getElementById('eyedropperTool').classList.add('active');
          editCanvas.style.cursor = 'copy';
          break;
        case 'fill':
          document.getElementById('fillTool').classList.add('active');
          editCanvas.style.cursor = 'pointer';
          break;
      }
    }

    function updateBrushSize(size) {
      editState.brushSize = size;
    }

    function initializeEditColorPalette() {
      const colorGrid = document.getElementById('editColorGrid');
      const currentColorDisplay = document.getElementById('currentColorDisplay');
      
      colorGrid.innerHTML = '';
      
      let availableColors = [];
      
      // Try to get colors from state first
      if (state && state.availableColors && state.availableColors.length > 0) {
        availableColors = state.availableColors.map(color => ({
          id: color.id,
          name: color.name,
          rgb: color.rgb,
          hex: `#${color.rgb[0].toString(16).padStart(2,'0')}${color.rgb[1].toString(16).padStart(2,'0')}${color.rgb[2].toString(16).padStart(2,'0')}`
        }));
      } else {
        // Fallback to CONFIG.COLOR_MAP
        availableColors = Object.values(CONFIG.COLOR_MAP)
          .filter(color => color.rgb !== null)
          .map(color => ({
            id: color.id,
            name: color.name,
            rgb: [color.rgb.r, color.rgb.g, color.rgb.b],
            hex: `#${color.rgb.r.toString(16).padStart(2,'0')}${color.rgb.g.toString(16).padStart(2,'0')}${color.rgb.b.toString(16).padStart(2,'0')}`
          }));
      }
      
      // Fallback to basic colors if nothing available
      if (availableColors.length === 0) {
        availableColors = [
          {id: 0, name: 'Black', rgb: [0,0,0], hex: '#000000'},
          {id: 1, name: 'White', rgb: [255,255,255], hex: '#ffffff'},
          {id: 2, name: 'Red', rgb: [255,0,0], hex: '#ff0000'},
          {id: 3, name: 'Green', rgb: [0,255,0], hex: '#00ff00'},
          {id: 4, name: 'Blue', rgb: [0,0,255], hex: '#0000ff'}
        ];
      }
      
      // Update color count
      const colorCount = document.getElementById('editColorCount');
      if (colorCount) {
        colorCount.textContent = availableColors.length;
      }
      
      availableColors.forEach(color => {
        const colorBtn = document.createElement('button');
        colorBtn.className = 'color-btn';
        colorBtn.style.backgroundColor = color.hex;
        colorBtn.title = `${color.name} (${color.hex})`;
        colorBtn.dataset.colorId = color.id;
        colorBtn.dataset.colorHex = color.hex;
        
        colorBtn.onclick = () => {
          editState.currentColor = color.hex;
          editState.currentColorId = color.id;
          currentColorDisplay.style.backgroundColor = color.hex;
          
          // Update active color
          document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('selected');
          });
          colorBtn.classList.add('selected');
          
          updateStatusBar(editState.mouseX, editState.mouseY);
        };
        
        colorGrid.appendChild(colorBtn);
      });
      
      // Set first color as default
      if (availableColors.length > 0) {
        editState.currentColor = availableColors[0].hex;
        editState.currentColorId = availableColors[0].id;
        currentColorDisplay.style.backgroundColor = availableColors[0].hex;
        colorGrid.firstChild.classList.add('selected');
      }
    }

    function saveEditState() {
      const editCanvas = document.getElementById('editCanvas');
      const imageData = editCanvas.toDataURL();
      
      editState.undoStack.push(imageData);
      
      // Limit undo stack size
      if (editState.undoStack.length > 50) {
        editState.undoStack.shift();
      }
      
      // Clear redo stack when new action is performed
      editState.redoStack = [];
      
      updateUndoRedoButtons();
    }

    function undoEdit() {
      if (editState.undoStack.length <= 1) return;
      
      const currentState = editState.undoStack.pop();
      editState.redoStack.push(currentState);
      
      const previousState = editState.undoStack[editState.undoStack.length - 1];
      loadEditState(previousState);
      
      updateUndoRedoButtons();
    }

    function redoEdit() {
      if (editState.redoStack.length === 0) return;
      
      const nextState = editState.redoStack.pop();
      editState.undoStack.push(nextState);
      
      loadEditState(nextState);
      
      updateUndoRedoButtons();
    }

    function loadEditState(imageData) {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageData;
    }

    function updateUndoRedoButtons() {
      const undoBtn = document.getElementById('undoBtn');
      const redoBtn = document.getElementById('redoBtn');
      
      if (undoBtn) {
        undoBtn.disabled = editState.undoStack.length <= 1;
      }
      
      if (redoBtn) {
        redoBtn.disabled = editState.redoStack.length === 0;
      }
    }

    function updateCanvasTransform() {
      const wrapper = document.getElementById('editCanvasWrapper');
      if (wrapper) {
        wrapper.style.transform = `translate(${editState.panX}px, ${editState.panY}px) scale(${editState.zoom})`;
      }
      
      // Update zoom select
      const zoomSelect = document.getElementById('zoomSelect');
      if (zoomSelect) {
        // If exact value exists, use it, otherwise show nearest but update displayed text
        const exact = ZOOM_LEVELS.find(z => z === editState.zoom);
        zoomSelect.value = exact != null ? exact : ZOOM_LEVELS.reduce((prev, curr) => Math.abs(curr - editState.zoom) < Math.abs(prev - editState.zoom) ? curr : prev);
        // Also update status bar zoom text
        updateStatusBar(editState.mouseX || 0, editState.mouseY || 0);
      }
    }

    function setupCanvasContainer() {
      const canvasContainer = document.getElementById('editCanvasContainer');
      const editCanvas = document.getElementById('editCanvas');
      const wrapper = document.getElementById('editCanvasWrapper');
      
      if (!canvasContainer || !wrapper) return;
      
      // Setup container styles
      canvasContainer.style.cssText = `
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
          linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
          linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        background-color: #ddd;
      `;
      
      // Setup wrapper styles
      wrapper.style.cssText = `
        position: relative;
        transform-origin: center center;
        display: inline-block;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border: 2px solid #333;
        background: white;
      `;
    }

    function zoomToPoint(newZoom, clientX, clientY) {
      const container = document.getElementById('editCanvasContainer');
      const wrapper = document.getElementById('editCanvasWrapper');
      
      if (!container || !wrapper) return;
      
      newZoom = Math.max(0.1, Math.min(32, newZoom));
      
      if (clientX !== undefined && clientY !== undefined) {
        // Get current transform values
        const oldZoom = editState.zoom;
        const rect = container.getBoundingClientRect();
        
        // Calculate zoom center point relative to container
        const containerCenterX = rect.left + rect.width / 2;
        const containerCenterY = rect.top + rect.height / 2;
        
        // Calculate offset to keep zoom point centered
        const offsetX = (clientX - containerCenterX) * (1 - newZoom / oldZoom);
        const offsetY = (clientY - containerCenterY) * (1 - newZoom / oldZoom);
        
        editState.panX += offsetX;
        editState.panY += offsetY;
      }
      
      editState.zoom = newZoom;
      constrainPan();
      updateCanvasTransform();
      updateMinimap();
      updateStatusBar(editState.mouseX || 0, editState.mouseY || 0);
    }

    function constrainPan() {
      const container = document.getElementById('editCanvasContainer');
      const canvas = document.getElementById('editCanvas');
      
      if (!container || !canvas) return;
      
      const containerRect = container.getBoundingClientRect();
      const scaledWidth = canvas.width * editState.zoom;
      const scaledHeight = canvas.height * editState.zoom;
      
  // Small padding around edges to avoid snapping against borders
  const padding = 10;
      
      // Calculate limits to keep canvas somewhat visible
      const maxPanX = Math.max(0, (scaledWidth - containerRect.width) / 2 + padding);
      const maxPanY = Math.max(0, (scaledHeight - containerRect.height) / 2 + padding);
      
      editState.panX = Math.max(-maxPanX, Math.min(maxPanX, editState.panX));
      editState.panY = Math.max(-maxPanY, Math.min(maxPanY, editState.panY));
    }

    function setZoom(zoom) {
      zoomToPoint(zoom);
    }

    function zoomIn() {
      const currentIndex = ZOOM_LEVELS.findIndex(z => z >= editState.zoom);
      const nextIndex = Math.min(currentIndex + 1, ZOOM_LEVELS.length - 1);
      setZoom(ZOOM_LEVELS[nextIndex]);
    }

    function zoomOut() {
      const currentIndex = ZOOM_LEVELS.findIndex(z => z >= editState.zoom);
      const prevIndex = Math.max(currentIndex - 1, 0);
      setZoom(ZOOM_LEVELS[prevIndex]);
    }

    function fitToWindow() {
      const container = document.getElementById('editCanvasContainer');
      const canvas = document.getElementById('editCanvas');
      
      if (!container || !canvas) return;
      
      const containerRect = container.getBoundingClientRect();
      const padding = 40;
      
      const scaleX = (containerRect.width - padding) / canvas.width;
      const scaleY = (containerRect.height - padding) / canvas.height;
      const fitZoom = Math.max(0.1, Math.min(scaleX, scaleY));
      
      // Center the canvas
      editState.zoom = fitZoom;
      editState.panX = 0;
      editState.panY = 0;
      updateCanvasTransform();
      updateMinimap();
      updateStatusBar(editState.mouseX || 0, editState.mouseY || 0);
    }

    function centerCanvas() {
      editState.panX = 0;
      editState.panY = 0;
      updateCanvasTransform();
      updateMinimap();
    }

    function resetEditView() {
      editState.zoom = 1;
      editState.panX = 0;
      editState.panY = 0;
      
      updateCanvasTransform();
      updateMinimap();
    }

    function setupMinimap() {
      const minimapCanvas = document.getElementById('minimapCanvas');
      const editCanvas = document.getElementById('editCanvas');
      const minimapContainer = document.getElementById('minimapContainer');
      
      if (!minimapCanvas || !editCanvas) return;
      
      // Show minimap only for larger images
      if (editCanvas.width < 100 || editCanvas.height < 100) {
        if (minimapContainer) minimapContainer.style.display = 'none';
        return;
      }
      
      // Calculate minimap size
      const maxSize = 150;
      const scale = Math.min(maxSize / editCanvas.width, maxSize / editCanvas.height);
      
      minimapCanvas.width = editCanvas.width * scale;
      minimapCanvas.height = editCanvas.height * scale;
      
      // Draw thumbnail
      const minimapCtx = minimapCanvas.getContext('2d');
      minimapCtx.imageSmoothingEnabled = false;
      minimapCtx.drawImage(editCanvas, 0, 0, minimapCanvas.width, minimapCanvas.height);
      
      // Update viewport indicator
      updateMinimap();
    }

    function updateMinimap() {
      const viewport = document.getElementById('minimapViewport');
      const minimapCanvas = document.getElementById('minimapCanvas');
      const container = document.getElementById('editCanvasContainer');
      const editCanvas = document.getElementById('editCanvas');
      
      if (!viewport || !minimapCanvas || !container || !editCanvas) return;
      
      const containerRect = container.getBoundingClientRect();
      const scale = minimapCanvas.width / editCanvas.width;
      
      // Calculate visible area in minimap coordinates
      const visibleWidth = Math.min(containerRect.width / editState.zoom * scale, minimapCanvas.width);
      const visibleHeight = Math.min(containerRect.height / editState.zoom * scale, minimapCanvas.height);
      
      const viewportX = (minimapCanvas.width / 2) - (editState.panX / editState.zoom * scale) - (visibleWidth / 2);
      const viewportY = (minimapCanvas.height / 2) - (editState.panY / editState.zoom * scale) - (visibleHeight / 2);
      
      viewport.style.width = `${visibleWidth}px`;
      viewport.style.height = `${visibleHeight}px`;
      viewport.style.left = `${Math.max(0, Math.min(minimapCanvas.width - visibleWidth, viewportX))}px`;
      viewport.style.top = `${Math.max(0, Math.min(minimapCanvas.height - visibleHeight, viewportY))}px`;
    }

    function navigateToMinimapPosition(e) {
      const minimapCanvas = document.getElementById('minimapCanvas');
      const editCanvas = document.getElementById('editCanvas');
      
      if (!minimapCanvas || !editCanvas) return;
      
      const rect = minimapCanvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / minimapCanvas.width;
      const y = (e.clientY - rect.top) / minimapCanvas.height;
      
      // Convert to canvas coordinates and center
      const targetX = (x - 0.5) * editCanvas.width * editState.zoom;
      const targetY = (y - 0.5) * editCanvas.height * editState.zoom;
      
      editState.panX = -targetX;
      editState.panY = -targetY;
      
      constrainPan();
      updateCanvasTransform();
      updateMinimap();
    }

    function updateStatusBar(x, y) {
      const statusBar = document.getElementById('editStatusBar');
      if (statusBar) {
        const zoomPercent = Math.round(editState.zoom * 100);
        statusBar.textContent = `Position: (${x}, ${y}) | Color: ${editState.currentColor || '#000000'} | Zoom: ${zoomPercent}%`;
      }
    }

    function handleEyedropper(x, y) {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      if (x >= 0 && x < editCanvas.width && y >= 0 && y < editCanvas.height) {
        const imageData = ctx.getImageData(x, y, 1, 1);
        const [r, g, b] = imageData.data;
        const pickedColor = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        
        editState.currentColor = pickedColor;
        const currentColorDisplay = document.getElementById('currentColorDisplay');
        if (currentColorDisplay) {
          currentColorDisplay.style.backgroundColor = pickedColor;
        }
        
        // Try to find matching color in palette
        document.querySelectorAll('.edit-color-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.colorHex === pickedColor) {
            btn.classList.add('active');
            editState.currentColorId = parseInt(btn.dataset.colorId);
          }
        });
        
        updateStatusBar(x, y);
      }
    }

    function floodFill(startX, startY, fillColor) {
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, editCanvas.width, editCanvas.height);
      const data = imageData.data;
      
      if (startX < 0 || startX >= editCanvas.width || startY < 0 || startY >= editCanvas.height) return;
      
      const startIndex = (startY * editCanvas.width + startX) * 4;
      const startR = data[startIndex];
      const startG = data[startIndex + 1];
      const startB = data[startIndex + 2];
      const startA = data[startIndex + 3];
      
      // Convert fill color to RGB
      const fillR = parseInt(fillColor.slice(1, 3), 16);
      const fillG = parseInt(fillColor.slice(3, 5), 16);
      const fillB = parseInt(fillColor.slice(5, 7), 16);
      
      // Don't fill if the color is already the same
      if (startR === fillR && startG === fillG && startB === fillB) return;
      
      const pixelsToCheck = [{x: startX, y: startY}];
      const checkedPixels = new Set();
      
      while (pixelsToCheck.length > 0) {
        const {x, y} = pixelsToCheck.pop();
        const key = `${x},${y}`;
        
        if (checkedPixels.has(key)) continue;
        checkedPixels.add(key);
        
        if (x < 0 || x >= editCanvas.width || y < 0 || y >= editCanvas.height) continue;
        
        const index = (y * editCanvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        if (r === startR && g === startG && b === startB && a === startA) {
          data[index] = fillR;
          data[index + 1] = fillG;
          data[index + 2] = fillB;
          data[index + 3] = 255;
          
          pixelsToCheck.push({x: x + 1, y});
          pixelsToCheck.push({x: x - 1, y});
          pixelsToCheck.push({x, y: y + 1});
          pixelsToCheck.push({x, y: y - 1});
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    // Brush preview removed per user request
    function hideBrushPreview() {
      // No-op - brush preview disabled
    }

    function drawGrid(ctx, width, height) {
      if (!editState.showGrid || editState.zoom < 4) return;
      
      ctx.save();
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
      ctx.lineWidth = 1 / editState.zoom;
      
      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      ctx.restore();
    }

    function redrawCanvas() {
      if (editState.undoStack.length === 0) return;
      
      const currentState = editState.undoStack[editState.undoStack.length - 1];
      const editCanvas = document.getElementById('editCanvas');
      const ctx = editCanvas.getContext('2d');
      
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
        ctx.drawImage(img, 0, 0);
        drawGrid(ctx, editCanvas.width, editCanvas.height);
      };
      img.src = currentState;
    }

    function setupTouchSupport() {
      const canvas = document.getElementById('editCanvas');
      if (!canvas) return;
      
      let touchStartTime = 0;
      
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      function handleTouchStart(e) {
        e.preventDefault();
        touchStartTime = Date.now();
        
        if (e.touches.length === 1) {
          // Single touch - start painting
          const touch = e.touches[0];
          const coords = mapClientToCanvas(touch.clientX, touch.clientY);
          if (coords) {
            editState.isDrawing = true;
            editState.lastPaintPos = { x: coords.x, y: coords.y };
            paintAtPosition(coords.x, coords.y, true);
          }
        } else if (e.touches.length === 2) {
          // Two finger - prepare for zoom/pan
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          
          editState.lastTouchDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          
          editState.lastTouchCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
          };
        }
      }
      
      function handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1 && editState.isDrawing) {
          // Continue painting
          const touch = e.touches[0];
          const coords = mapClientToCanvas(touch.clientX, touch.clientY);
          if (coords) {
            paintAtPosition(coords.x, coords.y, true);
          }
        } else if (e.touches.length === 2) {
          // Pinch zoom and pan
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          
          const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
          
          const currentCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
          };
          
          // Zoom based on distance change
          if (editState.lastTouchDistance > 0) {
            const zoomFactor = currentDistance / editState.lastTouchDistance;
            const newZoom = Math.max(0.1, Math.min(32, editState.zoom * zoomFactor));
            zoomToPoint(newZoom, currentCenter.x, currentCenter.y);
          }
          
          // Pan based on center movement
          editState.panX += currentCenter.x - editState.lastTouchCenter.x;
          editState.panY += currentCenter.y - editState.lastTouchCenter.y;
          
          editState.lastTouchDistance = currentDistance;
          editState.lastTouchCenter = currentCenter;
          
          constrainPan();
          updateCanvasTransform();
          updateMinimap();
        }
      }
      
      function handleTouchEnd(e) {
        e.preventDefault();
        
        if (editState.isDrawing) {
          editState.isDrawing = false;
          editState.lastPaintPos = null;
          saveEditState();
        }
        
        if (e.touches.length === 0) {
          editState.lastTouchDistance = 0;
        }
      }
    }

    function setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Only handle shortcuts when edit panel is visible
        const editOverlay = document.getElementById('editOverlay');
        if (!editOverlay || editOverlay.style.display === 'none') return;
        
        // Prevent default for handled keys
        const handledKeys = ['b', 'e', 'i', 'f', 'g', 'z', '[', ']'];
        if (handledKeys.includes(e.key.toLowerCase()) || (e.ctrlKey && e.key.toLowerCase() === 'z')) {
          e.preventDefault();
        }
        
        switch(e.key.toLowerCase()) {
          case 'b': // Brush
            selectTool('paint');
            break;
          case 'e': // Erase
            selectTool('erase');
            break;
          case 'i': // Eyedropper
            selectTool('eyedropper');
            break;
          case 'f': // Fill
            selectTool('fill');
            break;
          case 'g': // Grid
            const showGrid = document.getElementById('showGrid');
            if (showGrid) showGrid.click();
            break;
          case 'z':
            if (e.ctrlKey || e.metaKey) {
              if (e.shiftKey) {
                redoEdit();
              } else {
                undoEdit();
              }
            }
            break;
          case '=':
          case '+':
            if (e.ctrlKey || e.metaKey) {
              zoomIn();
            }
            break;
          case '-':
            if (e.ctrlKey || e.metaKey) {
              zoomOut();
            }
            break;
          case '0':
            if (e.ctrlKey || e.metaKey) {
              fitToWindow();
            }
            break;
          case '1':
            if (e.ctrlKey || e.metaKey) {
              setZoom(1);
            }
            break;
          case '[': // Decrease brush size
            const brushSize = document.getElementById('brushSize');
            const currentSize = parseInt(brushSize.value);
            if (currentSize > 1) {
              brushSize.value = currentSize - 1;
              document.getElementById('brushSizeValue').textContent = currentSize - 1;
              updateBrushSize(currentSize - 1);
            }
            break;
          case ']': // Increase brush size
            const brushSize2 = document.getElementById('brushSize');
            const currentSize2 = parseInt(brushSize2.value);
            if (currentSize2 < 20) {
              brushSize2.value = currentSize2 + 1;
              document.getElementById('brushSizeValue').textContent = currentSize2 + 1;
              updateBrushSize(currentSize2 + 1);
            }
            break;
        }
      });
    }

    function applyEditChanges() {
      try {
        const editCanvas = document.getElementById('editCanvas');
        if (!editCanvas) {
          throw new Error('Edit canvas not found');
        }
        
        // Find the resize canvas in the resize panel
        const resizeCanvas = document.getElementById('resizeCanvas');
        if (!resizeCanvas) {
          throw new Error('Resize canvas not found');
        }
        
        const baseCtx = resizeCanvas.getContext('2d');
        if (!baseCtx) {
          throw new Error('Resize canvas context not available');
        }
        
        // Make sure the resize canvas has the same dimensions as the edit canvas
        if (resizeCanvas.width !== editCanvas.width || resizeCanvas.height !== editCanvas.height) {
          resizeCanvas.width = editCanvas.width;
          resizeCanvas.height = editCanvas.height;
        }
        
        // Clear resize canvas
        baseCtx.clearRect(0, 0, resizeCanvas.width, resizeCanvas.height);
        
        // Copy edited image to resize canvas
        baseCtx.imageSmoothingEnabled = false;
        baseCtx.drawImage(editCanvas, 0, 0);
        
        // CRITICAL: Completely replace the template system with edited artwork
        const editedImageData = editCanvas.toDataURL();
        
        // Create new processor with edited image as the template
        if (window.WPlaceImageProcessor) {
          const newProcessor = new window.WPlaceImageProcessor(editedImageData);
          newProcessor.load().then(() => {
            // Get the processed pixel data from the edited canvas
            const editCtx = editCanvas.getContext('2d');
            const editImageData = editCtx.getImageData(0, 0, editCanvas.width, editCanvas.height);
            const pixels = editImageData.data;
            
            // Count valid pixels in the edited image
            let totalValidPixels = 0;
            for (let i = 0; i < pixels.length; i += 4) {
              const a = pixels[i + 3];
              const r = pixels[i];
              const g = pixels[i + 1];
              const b = pixels[i + 2];
              
              const isTransparent = !state.paintTransparentPixels && a < state.customTransparencyThreshold;
              const isWhiteAndSkipped = !state.paintWhitePixels && Utils.isWhitePixel(r, g, b);
              
              if (!isTransparent && !isWhiteAndSkipped) {
                totalValidPixels++;
              }
            }
            
            // COMPLETELY REBUILD state.imageData with the edited artwork
            state.imageData = {
              width: editCanvas.width,
              height: editCanvas.height, 
              pixels: pixels,
              totalPixels: totalValidPixels,
              processor: newProcessor,
            };
            
            // CRITICAL: Update state.originalImage so resize panel uses edited artwork as base template
            state.originalImage = {
              dataUrl: editedImageData,
              width: editCanvas.width,
              height: editCanvas.height
            };
            
            // Update state with new totals
            state.totalPixels = totalValidPixels;
            state.paintedPixels = 0; // Reset progress since this is a new template
            state.imageLoaded = true;
            
            // Update local processors
            if (typeof processor !== 'undefined') {
              processor = newProcessor;
              console.log('🔄 Updated local processor with edited artwork');
            }
            if (typeof baseProcessor !== 'undefined') {
              baseProcessor = newProcessor;
              console.log('🔄 Updated baseProcessor with edited artwork');  
            }
            
            // Force regeneration of overlays by clearing cached mask data
            if (typeof window._maskImageData !== 'undefined') {
              delete window._maskImageData;
            }
            
            // Update UI to reflect the new template
            if (typeof updateUI === 'function') {
              updateUI();
            }
            
            // Show loading and properly reload resize panel with new template
            Utils.showAlert('Updating template... Please wait.', 'info');
            
            // Give more time for template to fully update and force resize panel reload
            setTimeout(() => {
              // Hide edit overlay first
              document.getElementById('editOverlay').style.display = 'none';
              
              // Completely reload resize dialog with updated processor
              setTimeout(() => {
                // Clean up existing dialog
                if (typeof _resizeDialogCleanup === 'function') {
                  _resizeDialogCleanup();
                }
                
                // Force complete reload of resize dialog with new processor
                setTimeout(() => {
                  showResizeDialog(newProcessor);
                  
                  console.log('✅ Template COMPLETELY replaced with edited artwork');
                  console.log(`📊 New template stats: ${editCanvas.width}x${editCanvas.height}, ${totalValidPixels} pixels`);
                  Utils.showAlert('Template successfully replaced with your edited artwork!', 'success');
                }, 100);
              }, 300);
            }, 100);
          }).catch((error) => {
            console.error('Failed to load new processor:', error);
            Utils.showAlert('Failed to update template. Please try again.', 'error');
          });
        } else {
          console.error('WPlaceImageProcessor not available');
          Utils.showAlert('Image processor not available. Please reload the page.', 'error');
        }
        
        console.log('✅ Edit changes applied - template replacement in progress');
      } catch (error) {
        console.error('Error applying edit changes:', error);
        Utils.showAlert('Failed to apply changes. Please try again.', 'error');
      }
    }

    if (uploadBtn) {
      uploadBtn.addEventListener('click', async () => {
        const availableColors = Utils.extractAvailableColors();
        if (availableColors === null || availableColors.length < 10) {
          updateUI('noColorsFound', 'error');
          Utils.showAlert(Utils.t('noColorsFound'), 'error');
          return;
        }

        if (!state.colorsChecked) {
          state.availableColors = availableColors;
          state.colorsChecked = true;
          updateUI('colorsFound', 'success', { count: availableColors.length });
          await updateStats();
          selectPosBtn.disabled = false;
          // Only enable resize button if image is also loaded
          if (state.imageLoaded) {
            resizeBtn.disabled = false;
          }
        }

        try {
          updateUI('loadingImage', 'default');
          const imageSrc = await Utils.createImageUploader();
          if (!imageSrc) {
            updateUI('colorsFound', 'success', {
              count: state.availableColors.length,
            });
            return;
          }

          const processor = new ImageProcessor(imageSrc);
          await processor.load();

          const { width, height } = processor.getDimensions();
          const pixels = processor.getPixelData();

          let totalValidPixels = 0;
          for (let i = 0; i < pixels.length; i += 4) {
            const isTransparent =
              !state.paintTransparentPixels &&
              pixels[i + 3] < (state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD);
            const isWhiteAndSkipped =
              !state.paintWhitePixels &&
              Utils.isWhitePixel(pixels[i], pixels[i + 1], pixels[i + 2]);
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
          };

          state.totalPixels = totalValidPixels;
          state.paintedPixels = 0;
          state.imageLoaded = true;

          // Reset session-specific flags when a new image is loaded
          state.preFilteringDone = false;
          state.progressResetDone = false;
          console.log('🔄 Reset session flags for new image load');

          // Keep existing lastPosition to continue from where we left off
          // state.lastPosition = { x: 0, y: 0 }; // REMOVED: Don't reset position

          // Initialize painted map for tracking
          Utils.initializePaintedMap(width, height);

          // New image: clear previous resize settings
          state.resizeSettings = null;
          // Also clear any previous ignore mask
          state.resizeIgnoreMask = null;
          // Save original image for this browser (dataUrl + dims)
          state.originalImage = { dataUrl: imageSrc, width, height };
          saveBotSettings();

          // Use the original image for the overlay initially
          const imageBitmap = await createImageBitmap(processor.img);
          await overlayManager.setImage(imageBitmap);
          overlayManager.enable();
          toggleOverlayBtn.disabled = false;
          toggleOverlayBtn.classList.add('active');
          toggleOverlayBtn.setAttribute('aria-pressed', 'true');

          // Only enable resize button if colors have also been captured
          if (state.colorsChecked) {
            resizeBtn.disabled = false;
          }
          saveBtn.disabled = false;

          if (state.startPosition) {
            startBtn.disabled = false;
          }

          await updateStats();
          updateDataButtons();
          updateUI('imageLoaded', 'success', { count: totalValidPixels });
        } catch {
          updateUI('imageError', 'error');
        }
      });
    }

    // Load Extracted button event listener - for loading Art-Extractor JSON files
    const loadExtractedBtn = document.getElementById('loadExtractedBtn');
    if (loadExtractedBtn) {
      loadExtractedBtn.addEventListener('click', async () => {
        try {
          updateUI('loadingImage', 'default');
          const fileData = await Utils.loadExtractedFileData();

          if (!fileData) {
            updateUI('ready', 'default');
            return;
          }

          console.log('📁 Loading extracted artwork from Art-Extractor...');
          console.log('🔍 [DEBUG] Loaded file data structure:', {
            hasState: !!fileData.state,
            hasImageData: !!fileData.imageData,
            topLevelKeys: Object.keys(fileData),
            stateKeys: fileData.state ? Object.keys(fileData.state) : 'N/A',
            imageDataKeys: fileData.imageData ? Object.keys(fileData.imageData) : 'N/A',
            fileDataType: typeof fileData,
            stateType: typeof fileData.state,
            imageDataType: typeof fileData.imageData
          });

          // Validate the data structure before restoring
          if (!fileData || typeof fileData !== 'object') {
            throw new Error('Invalid file format: File data is not a valid object');
          }

          if (!fileData.state || typeof fileData.state !== 'object') {
            console.error('❌ State validation failed. FileData:', fileData);
            throw new Error('Invalid file format: Missing or invalid state object. Please ensure you exported from Art-Extractor correctly.');
          }

          if (!fileData.imageData || typeof fileData.imageData !== 'object') {
            console.error('❌ ImageData validation failed. FileData:', fileData);
            throw new Error('Invalid file format: Missing or invalid imageData object. Please ensure you completed the area scan in Art-Extractor.');
          }

          if (!fileData.imageData.pixels || !Array.isArray(fileData.imageData.pixels) || fileData.imageData.pixels.length === 0) {
            console.error('❌ Pixel data validation failed. ImageData:', fileData.imageData);
            throw new Error('Invalid file format: No pixel data found. Please scan an area in Art-Extractor before exporting.');
          }

          // Ensure critical fields are present for Art-Extractor compatibility
          if (!fileData.state.availableColors) {
            console.warn('⚠️ No availableColors in file, using defaults');
            fileData.state.availableColors = [];
          }

          // Use the existing restoreProgress function but with special handling
          const restoreSuccess = await Utils.restoreProgress(fileData);

          if (!restoreSuccess) {
            throw new Error('Failed to restore progress data');
          }

          // After loading, we need to enter position selection mode like when uploading images
          if (state.imageLoaded) {
            console.log('🎯 Extracted artwork loaded, entering position selection mode...');

            // Clear position data since Art-Extractor exports may have null positions for manual placement
            state.startPosition = null;
            state.region = null;
            state.selectingPosition = true;

            // For extracted files, force enable all necessary flags for full functionality
            state.colorsChecked = true;
            state.imageLoaded = true;

            // Ensure image processor is available for extracted files
            if (state.imageData && !state.imageData.processor) {
              try {
                // Create a temporary canvas to generate a data URL for the processor
                const canvas = document.createElement('canvas');
                canvas.width = state.imageData.width;
                canvas.height = state.imageData.height;
                const ctx = canvas.getContext('2d');

                // Create image data from pixels
                const imageData = new ImageData(
                  new Uint8ClampedArray(state.imageData.pixels),
                  state.imageData.width,
                  state.imageData.height
                );
                ctx.putImageData(imageData, 0, 0);

                // Create processor with canvas data URL using the correct class
                const dataUrl = canvas.toDataURL();
                state.imageData.processor = new window.WPlaceImageProcessor(dataUrl);

                // CRITICAL: Load the processor before using it
                await state.imageData.processor.load();
                console.log('🔧 Created and loaded WPlaceImageProcessor for extracted artwork');
              } catch (error) {
                console.error('❌ Failed to create image processor for extracted artwork:', error);
                // Fallback: use global processor if available
                if (window.globalImageProcessor) {
                  console.log('🔄 Using global image processor as fallback');
                  state.imageData.processor = window.globalImageProcessor;
                }
              }
            }

            console.log('🎨 Force-enabled all flags for extracted JSON to access resize panel');

            // For extracted images, ensure overlay is enabled but don't set position yet
            try {
              if (overlayManager && state.imageData) {
                // Create image bitmap from the restored image data
                const canvas = new OffscreenCanvas(state.imageData.width, state.imageData.height);
                const ctx = canvas.getContext('2d');
                const imageData = new ImageData(
                  new Uint8ClampedArray(state.imageData.pixels),
                  state.imageData.width,
                  state.imageData.height
                );
                ctx.putImageData(imageData, 0, 0);
                const imageBitmap = await canvas.transferToImageBitmap();

                await overlayManager.setImage(imageBitmap);
                overlayManager.enable();
                console.log('✅ Overlay enabled for extracted artwork');
              }
            } catch (overlayError) {
              console.warn('⚠️ Could not set overlay for extracted artwork:', overlayError);
            }

            // For extracted images, don't try to set overlay position until user selects one
            // The overlay should already be enabled from the restoreProgress function

            // Update UI with custom message for extracted artwork
            Utils.showAlert('🎨 Extracted artwork loaded! Please click on the canvas to select where to place it.', 'info');
            updateUI('ready', 'default'); // Use 'ready' instead of 'waitingPosition' to avoid translation issues

            // Enable relevant buttons
            selectPosBtn.disabled = false;
            // Always enable resize button for extracted files since they have image processor
            resizeBtn.disabled = false;
            console.log('🔧 Resize button enabled for extracted artwork');

            // Enable move artwork button (will be fully enabled after position is set)
            const moveArtworkBtn = document.getElementById('moveArtworkBtn');
            if (moveArtworkBtn) {
              moveArtworkBtn.disabled = false;
            }

            // Set up position selection like the regular selectPosBtn
            const tempFetch = async (url, options) => {
              if (
                typeof url === 'string' &&
                url.includes('/s0/pixel/') &&
                options &&
                options.method === 'POST'
              ) {
                let coords;
                try {
                  const body = JSON.parse(options.body);
                  coords = body.coords;
                } catch (e) {
                  return window.originalFetch(url, options);
                }

                const tileMatches = url.match(/\/s0\/pixel\/(\-?\d+)\/(\-?\d+)/);
                if (tileMatches && coords && coords.length >= 2) {
                  const tileX = parseInt(tileMatches[1]);
                  const tileY = parseInt(tileMatches[2]);
                  const pixelX = coords[0];
                  const pixelY = coords[1];

                  state.startPosition = { x: pixelX, y: pixelY };
                  state.region = { x: tileX, y: tileY };
                  state.selectingPosition = false;

                  console.log('🎯 Position selected for extracted artwork:', {
                    startPosition: state.startPosition,
                    region: state.region
                  });

                  // Restore original fetch
                  window.fetch = window.originalFetch;

                  // Update overlay position with validation
                  try {
                    if (state.startPosition && state.region && overlayManager) {
                      await overlayManager.setPosition(state.startPosition, state.region);
                      console.log('✅ Overlay position updated successfully');
                    } else {
                      console.warn('⚠️ Cannot set overlay position: missing startPosition or region');
                    }
                  } catch (positionError) {
                    console.error('❌ Failed to set overlay position:', positionError);
                  }

                  startBtn.disabled = false;
                  selectPosBtn.textContent = Utils.t('selectPosition');

                  // Enable Move Artwork button when position is set
                  const moveArtworkBtn = document.getElementById('moveArtworkBtn');
                  if (moveArtworkBtn) {
                    moveArtworkBtn.disabled = false;
                  }

                  updateUI('ready', 'success');
                  Utils.showAlert('Position selected! Ready to start painting.', 'success');
                }
              }
              return window.originalFetch(url, options);
            };

            // Store original fetch and replace with position capture
            if (!window.originalFetch) {
              window.originalFetch = window.fetch;
            }
            window.fetch = tempFetch;
          }

        } catch (error) {
          console.error('❌ Failed to load extracted artwork:', error);
          Utils.showAlert(`Failed to load extracted artwork: ${error.message}`, 'error');
          updateUI('ready', 'default');
        }
      });
    }

    if (resizeBtn) {
      resizeBtn.addEventListener('click', () => {
        console.log('🔍 [DEBUG] Resize button clicked. State check:', {
          imageLoaded: state.imageLoaded,
          hasProcessor: !!(state.imageData && state.imageData.processor),
          colorsChecked: state.colorsChecked,
          hasAvailableColors: !!(state.availableColors && state.availableColors.length > 0)
        });

        if (state.imageLoaded && state.imageData && state.imageData.processor) {
          showResizeDialog(state.imageData.processor);
        } else {
          let message = 'Please upload an image and check colors first.';
          if (!state.imageLoaded) message = 'Please upload an image first.';
          else if (!state.imageData || !state.imageData.processor) message = 'Image processor not available. Please reload the image.';
          Utils.showAlert(message, 'warning');
        }
      });
    }

    // Move Artwork button event listener
    const moveArtworkBtn = document.getElementById('moveArtworkBtn');
    if (moveArtworkBtn) {
      moveArtworkBtn.addEventListener('click', () => {
        if (state.imageLoaded && (state.startPosition || state.selectingPosition)) {
          showMoveArtworkPanel();
        } else if (!state.imageLoaded) {
          Utils.showAlert('Please upload or load an image first', 'warning');
        } else {
          Utils.showAlert('Please select a position for the artwork first', 'warning');
        }
      });
    }

    if (selectPosBtn) {
      selectPosBtn.addEventListener('click', async () => {
        if (state.selectingPosition) return;

        state.selectingPosition = true;
        state.startPosition = null;
        state.region = null;
        startBtn.disabled = true;

        // Disable Move Artwork button when selecting new position
        const moveArtworkBtn = document.getElementById('moveArtworkBtn');
        if (moveArtworkBtn) {
          moveArtworkBtn.disabled = true;
        }

        Utils.showAlert(Utils.t('selectPositionAlert'), 'info');
        updateUI('waitingPosition', 'default');

        const tempFetch = async (url, options) => {
          if (
            typeof url === 'string' &&
            url.includes('https://backend.wplace.live/s0/pixel/') &&
            options?.method?.toUpperCase() === 'POST'
          ) {
            try {
              const response = await originalFetch(url, options);
              const clonedResponse = response.clone();
              const data = await clonedResponse.json();

              if (data?.painted === 1) {
                const regionMatch = url.match(/\/pixel\/(\d+)\/(\d+)/);
                if (regionMatch && regionMatch.length >= 3) {
                  state.region = {
                    x: Number.parseInt(regionMatch[1]),
                    y: Number.parseInt(regionMatch[2]),
                  };
                }

                const payload = JSON.parse(options.body);
                if (payload?.coords && Array.isArray(payload.coords)) {
                  state.startPosition = {
                    x: payload.coords[0],
                    y: payload.coords[1],
                  };
                  // Keep existing lastPosition to continue from where we left off
                  // state.lastPosition = { x: 0, y: 0 }; // REMOVED: Don't reset position

                  // Update overlay position with validation
                  try {
                    if (state.startPosition && state.region && overlayManager) {
                      await overlayManager.setPosition(state.startPosition, state.region);
                      console.log('✅ Regular overlay position updated successfully');
                    } else {
                      console.warn('⚠️ Cannot set regular overlay position: missing startPosition or region');
                    }
                  } catch (positionError) {
                    console.error('❌ Failed to set regular overlay position:', positionError);
                  }

                  if (state.imageLoaded) {
                    startBtn.disabled = false;

                    // Enable Move Artwork button when position is set
                    const moveArtworkBtn = document.getElementById('moveArtworkBtn');
                    if (moveArtworkBtn) {
                      moveArtworkBtn.disabled = false;
                    }
                  }

                  window.fetch = originalFetch;
                  state.selectingPosition = false;
                  updateUI('positionSet', 'success');
                }
              }

              return response;
            } catch {
              return originalFetch(url, options);
            }
          }
          return originalFetch(url, options);
        };

        const originalFetch = window.fetch;
        window.fetch = tempFetch;

        setTimeout(() => {
          if (state.selectingPosition) {
            window.fetch = originalFetch;
            state.selectingPosition = false;
            updateUI('positionTimeout', 'error');
            Utils.showAlert(Utils.t('positionTimeout'), 'error');
          }
        }, 120000);
      });
    }

    async function startPainting() {
      if (!state.imageLoaded || !state.startPosition || !state.region) {
        updateUI('missingRequirements', 'error');
        return;
      }
      await ensureToken();
      if (!getTurnstileToken()) return;

      // Only reset progress once per save file load session
      if (!state.progressResetDone) {
        const savedPaintedPixels = state.paintedPixels; // Store original value
        state.paintedPixels = 0;
        state.progressResetDone = true;
        console.log(`🔄 Reset pixel progress for new save file session (was: ${savedPaintedPixels})`);
        await updateStats(); // Update UI to show 0 progress
      }

      // Only reset painted pixels on first start of session (when pre-filtering hasn't been done)
      if (!state.preFilteringDone) {

        // Perform progressive pixel detection from top-left to bottom-right
        console.log('🔍 Starting progressive pixel detection from top-left to bottom-right...');
        await performProgressivePixelDetection();
      } else {
        console.log('🔄 Continuing session - pre-filtering already done, but progress reset');
      }

      state.running = true;
      state.stopFlag = false;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      uploadBtn.disabled = true;
      selectPosBtn.disabled = true;
      resizeBtn.disabled = true;
      saveBtn.disabled = true;
      toggleOverlayBtn.disabled = true;

      updateUI('startPaintingMsg', 'success');

      try {
        await getAccounts();
        await processImage();
      } catch (e) {
        console.error('Unexpected error:', e);
        updateUI('paintingError', 'error');
      } finally {
        state.running = false;
        stopBtn.disabled = true;
        saveBtn.disabled = false;

        if (state.stopFlag) {
          startBtn.disabled = false;
        } else {
          startBtn.disabled = true;
          uploadBtn.disabled = false;
          const loadExtractedBtn = document.getElementById('loadExtractedBtn');
          if (loadExtractedBtn) loadExtractedBtn.disabled = false;
          selectPosBtn.disabled = false;
          resizeBtn.disabled = false;
        }
        toggleOverlayBtn.disabled = false;
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', startPainting);
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        state.stopFlag = true;
        state.running = false;
        stopBtn.disabled = true;
        updateUI('paintingStoppedByUser', 'warning');

        if (state.imageLoaded && state.paintedPixels > 0) {
          Utils.saveProgress();
          Utils.showAlert(Utils.t('autoSaved'), 'success');
        }
      });
    }

    const checkSavedProgress = () => {
      const savedData = Utils.loadProgress();
      if (savedData && savedData.state.paintedPixels > 0) {
        const savedDate = new Date(savedData.timestamp).toLocaleString();
        const progress = Math.round(
          (savedData.state.paintedPixels / savedData.state.totalPixels) * 100
        );

        Utils.showAlert(
          `${Utils.t('savedDataFound')}\n\n` +
          `Saved: ${savedDate}\n` +
          `Progress: ${savedData.state.paintedPixels}/${savedData.state.totalPixels} pixels (${progress}%)\n` +
          `${Utils.t('clickLoadToContinue')}`,
          'info'
        );
      }
    };

    setTimeout(checkSavedProgress, 1000);

    if (cooldownSlider && cooldownInput && cooldownValue && cooldownDecrease && cooldownIncrease) {
      const updateCooldown = (newValue) => {
        const threshold = Math.max(1, Math.min(state.maxCharges || 999, parseInt(newValue)));
        state.cooldownChargeThreshold = threshold;

        // Update both controls (value shows in input, label shows unit only)
        cooldownSlider.value = threshold;
        cooldownInput.value = threshold;
        cooldownValue.textContent = `${Utils.t('charges')}`;

        saveBotSettings();
        NotificationManager.resetEdgeTracking(); // prevent spurious notify after threshold change
      };

      // Slider event listener
      cooldownSlider.addEventListener('input', (e) => {
        updateCooldown(e.target.value);
      });

      // Number input event listener
      cooldownInput.addEventListener('input', (e) => {
        updateCooldown(e.target.value);
      });

      // Decrease button
      cooldownDecrease.addEventListener('click', () => {
        updateCooldown(parseInt(cooldownInput.value) - 1);
      });

      // Increase button
      cooldownIncrease.addEventListener('click', () => {
        updateCooldown(parseInt(cooldownInput.value) + 1);
      });

      // Add scroll-to-adjust for cooldown slider
      Utils.createScrollToAdjust(cooldownSlider, updateCooldown, 1, state.maxCharges, 1);

      // Skip cooldown button event handler
      const skipCooldownBtn = document.getElementById('skipCooldownBtn');
      if (skipCooldownBtn) {
        skipCooldownBtn.addEventListener('click', () => {
          if (state.preciseCurrentCharges < state.cooldownChargeThreshold) {
            console.log(`[Auto-Image] Skip cooldown requested - resetting to account index 0`);

            // Reset to account index 0 (start new cycle)
            state.currentActiveIndex = 0;
            console.log(`🔄 Reset currentActiveIndex to 0 for new cycle`);

            // Reset charges to threshold to bypass cooldown
            state.preciseCurrentCharges = state.cooldownChargeThreshold;
            console.log(`[Auto-Image] Cooldown skipped! Charges set to threshold: ${state.cooldownChargeThreshold}`);

            // Switch to first account if we have multiple accounts
            if (accountManager.getAccountCount() > 1) {
              const firstAccountInfo = accountManager.getAccountByIndex(0);
              if (firstAccountInfo && firstAccountInfo.token) {
                console.log(`🔄 Switching to first account: index 0 (${firstAccountInfo.displayName})`);
                // Get accounts array for the switch
                const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
                if (accounts.length > 0) {
                  switchToSpecificAccount(firstAccountInfo.token, firstAccountInfo.displayName).then(() => {
                    console.log(`✅ Successfully switched to account index 0 after cooldown skip`);
                    // Update UI immediately
                    updateChargesThresholdUI(0);
                    // Trigger immediate check for painting
                    if (state.isEnabled && !state.stopFlag) {
                      setTimeout(() => {
                        checkAndPaint();
                      }, 100);
                    }
                  }).catch(err => {
                    console.error(`❌ Failed to switch to account index 0:`, err);
                  });
                } else {
                  console.warn(`⚠️ No accounts available for switching`);
                }
              } else {
                console.warn(`⚠️ First account info not found or missing token`);
              }
            } else {
              console.log(`📝 Single account mode - no switching needed`);
              // Update UI immediately
              updateChargesThresholdUI(0);
              // Trigger immediate check for painting
              if (state.isEnabled && !state.stopFlag) {
                setTimeout(() => {
                  checkAndPaint();
                }, 100);
              }
            }
          }
        });
      }
    }

    loadBotSettings();
    // Ensure notification poller reflects current settings
    NotificationManager.syncFromState();
  }

  function getMsToTargetCharges(current, target, cooldown, intervalMs = 0) {
    const remainingCharges = target - current;
    return Math.max(0, remainingCharges * cooldown - intervalMs);
  }

  function updateChargesThresholdUI(intervalMs) {
    if (state.stopFlag) return;

    const threshold = state.cooldownChargeThreshold;
    const remainingMs = getMsToTargetCharges(
      state.preciseCurrentCharges,
      threshold,
      state.cooldown,
      intervalMs
    );
    const timeText = Utils.msToTimeText(remainingMs);

    updateUI(
      'noChargesThreshold',
      'warning',
      {
        threshold,
        current: state.displayCharges,
        time: timeText,
      },
      true
    );

    // Update skip cooldown button state
    const skipCooldownBtn = document.getElementById('skipCooldownBtn');
    if (skipCooldownBtn) {
      const isInCooldown = state.preciseCurrentCharges < threshold && remainingMs > 0;
      skipCooldownBtn.disabled = !isInCooldown;
      skipCooldownBtn.title = isInCooldown
        ? `Skip cooldown (${timeText} remaining)`
        : 'Skip cooldown (only available during cooldown)';
    }
  }

  // Fast tile-based pixel detection from top-left to bottom-right
  async function performProgressivePixelDetection() {
    if (!state.imageLoaded || !state.imageData) {
      console.log('⚠️ No image loaded, skipping pixel detection');
      return;
    }

    const startTime = performance.now();
    const { width, height } = state.imageData;
    const startX = state.startPosition.x;
    const startY = state.startPosition.y;
    const regionX = state.region.x;
    const regionY = state.region.y;

    let detectedPixels = 0;
    let totalChecked = 0;

    console.log(`🚀 Fast scanning ${width}x${height} image from top-left (0,0) to bottom-right (${width - 1},${height - 1})...`);

    updateUI('pixelDetection', 'info', { message: 'Fast detecting already painted pixels...' });

    // Calculate affected tiles
    const worldX1 = startX;
    const worldY1 = startY;
    const worldX2 = startX + width - 1;
    const worldY2 = startY + height - 1;

    const startTileX = Math.floor(worldX1 / 1000);
    const startTileY = Math.floor(worldY1 / 1000);
    const endTileX = Math.floor(worldX2 / 1000);
    const endTileY = Math.floor(worldY2 / 1000);

    console.log(`📄 Processing tiles from (${startTileX},${startTileY}) to (${endTileX},${endTileY})`);

    // Cache for downloaded tile data
    const tileDataCache = new Map();

    // Download and cache all required tiles in parallel
    const tilePromises = [];
    for (let tileY = startTileY; tileY <= endTileY; tileY++) {
      for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        const absoluteTileX = regionX + tileX;
        const absoluteTileY = regionY + tileY;
        const tileKey = `${absoluteTileX},${absoluteTileY}`;

        tilePromises.push(
          downloadTileImageData(absoluteTileX, absoluteTileY).then(imageData => {
            if (imageData) {
              tileDataCache.set(tileKey, imageData);
            }
          }).catch(e => {
            console.warn(`⚠️ Failed to download tile ${absoluteTileX},${absoluteTileY}:`, e.message);
          })
        );
      }
    }

    // Wait for all tiles to download
    await Promise.all(tilePromises);
    console.log(`📦 Downloaded ${tileDataCache.size} tiles for fast pixel checking`);

    // Fast pixel detection using cached tile data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        totalChecked++;

        // Check if pixel is eligible for painting
        const targetPixelInfo = checkPixelEligibility(x, y);
        if (!targetPixelInfo.eligible) {
          continue; // Skip non-eligible pixels
        }

        // Calculate absolute world coordinates
        const absX = startX + x;
        const absY = startY + y;
        const adderX = Math.floor(absX / 1000);
        const adderY = Math.floor(absY / 1000);
        const pixelX = absX % 1000;
        const pixelY = absY % 1000;
        const absoluteTileX = regionX + adderX;
        const absoluteTileY = regionY + adderY;

        // Check if already marked as painted in local map
        if (Utils.isPixelPainted(x, y, absoluteTileX, absoluteTileY)) {
          detectedPixels++;
          continue;
        }

        // Fast pixel color check using cached tile data
        const tileKey = `${absoluteTileX},${absoluteTileY}`;
        const tileImageData = tileDataCache.get(tileKey);

        if (tileImageData) {
          try {
            // Direct array access - much faster than canvas operations
            const tileWidth = tileImageData.width;
            const tileHeight = tileImageData.height;
            const data = tileImageData.data;

            // Ensure pixel coordinates are within tile bounds
            if (pixelX >= 0 && pixelX < tileWidth && pixelY >= 0 && pixelY < tileHeight) {
              const pixelIndex = (pixelY * tileWidth + pixelX) * 4;
              const r = data[pixelIndex];
              const g = data[pixelIndex + 1];
              const b = data[pixelIndex + 2];
              const a = data[pixelIndex + 3];

              // Check alpha threshold
              const alphaThresh = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;
              if (a >= alphaThresh) {
                const existingMappedColor = Utils.resolveColor(
                  [r, g, b],
                  state.availableColors,
                  !state.paintUnavailablePixels
                );
                const isAlreadyPainted = existingMappedColor.id === targetPixelInfo.mappedColorId;

                if (isAlreadyPainted) {
                  // Check if pixel is already marked as painted to avoid double counting
                  if (!Utils.isPixelPainted(x, y, absoluteTileX, absoluteTileY)) {
                    // Mark as painted in the map but DO NOT increment progress counter
                    // Progress counter should only reflect actual painting sequence position
                    Utils.markPixelPainted(x, y, absoluteTileX, absoluteTileY);
                    detectedPixels++;
                  } else {
                    // Pixel already tracked, just count it for detection stats
                    detectedPixels++;
                  }
                }
              }
            }
          } catch (e) {
            // Skip pixels we can't check
            console.warn(`⚠️ Could not check pixel (${x}, ${y}):`, e.message);
          }
        }

        // Update progress periodically
        if (totalChecked % 2500 === 0) {
          const progress = Math.round((totalChecked / (width * height)) * 100);
          updateUI('pixelDetection', 'info', {
            message: `Fast detecting... ${progress}% (Found: ${detectedPixels})`
          });
          // Yield control briefly to prevent UI blocking
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }

    const processingTime = Math.round(performance.now() - startTime);
    console.log(`🏁 Fast pixel detection complete in ${processingTime}ms:`);
    console.log(`  - Total pixels checked: ${totalChecked}`);
    console.log(`  - Already painted pixels found: ${detectedPixels}`);
    console.log(`  - Updated progress: ${state.paintedPixels}/${state.totalPixels}`);
    console.log(`  - Performance: ${Math.round(totalChecked / (processingTime / 1000))} pixels/second`);

    // Update progress display
    await updateStats();
    updateUI('pixelDetectionComplete', 'success', {
      message: `Found ${detectedPixels} already painted pixels in ${processingTime}ms`
    });
  }

  // Fast tile download and ImageData extraction (similar to Art-Extractor approach)
  async function downloadTileImageData(tileX, tileY) {
    try {
      const tileUrl = `https://backend.wplace.live/files/s0/tiles/${tileX}/${tileY}.png`;
      const response = await fetch(tileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      return await processTileBlob(blob);
    } catch (error) {
      console.warn(`Failed to download tile ${tileX},${tileY}:`, error.message);
      return null;
    }
  }

  // Process tile blob into ImageData (adapted from Art-Extractor)
  async function processTileBlob(blob) {
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      return new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(blob);
      });
    } catch (error) {
      console.error('Error processing tile blob:', error);
      return null;
    }
  }

  function generateCoordinates(width, height, mode, direction, snake, blockWidth, blockHeight, startFromX = 0, startFromY = 0) {
    const coords = [];
    console.log(
      'Generating coordinates with \n  mode:',
      mode,
      '\n  direction:',
      direction,
      '\n  snake:',
      snake,
      '\n  blockWidth:',
      blockWidth,
      '\n  blockHeight:',
      blockHeight,
      '\n  startFromX:',
      startFromX,
      '\n  startFromY:',
      startFromY
    );
    // --------- Standard 4 corners traversal ----------
    let xStart, xEnd, xStep;
    let yStart, yEnd, yStep;
    switch (direction) {
      case 'top-left':
        xStart = 0;
        xEnd = width;
        xStep = 1;
        yStart = 0;
        yEnd = height;
        yStep = 1;
        break;
      case 'top-right':
        xStart = width - 1;
        xEnd = -1;
        xStep = -1;
        yStart = 0;
        yEnd = height;
        yStep = 1;
        break;
      case 'bottom-left':
        xStart = 0;
        xEnd = width;
        xStep = 1;
        yStart = height - 1;
        yEnd = -1;
        yStep = -1;
        break;
      case 'bottom-right':
        xStart = width - 1;
        xEnd = -1;
        xStep = -1;
        yStart = height - 1;
        yEnd = -1;
        yStep = -1;
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }

    // --------- Traversal modes ----------
    if (mode === 'rows') {
      for (let y = yStart; y !== yEnd; y += yStep) {
        if (snake && (y - yStart) % 2 !== 0) {
          for (let x = xEnd - xStep; x !== xStart - xStep; x -= xStep) {
            coords.push([x, y]);
          }
        } else {
          for (let x = xStart; x !== xEnd; x += xStep) {
            coords.push([x, y]);
          }
        }
      }
    } else if (mode === 'columns') {
      for (let x = xStart; x !== xEnd; x += xStep) {
        if (snake && (x - xStart) % 2 !== 0) {
          for (let y = yEnd - yStep; y !== yStart - yStep; y -= yStep) {
            coords.push([x, y]);
          }
        } else {
          for (let y = yStart; y !== yEnd; y += yStep) {
            coords.push([x, y]);
          }
        }
      }
    } else if (mode === 'circle-out') {
      const cx = Math.floor(width / 2);
      const cy = Math.floor(height / 2);
      const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));

      for (let r = 0; r <= maxRadius; r++) {
        for (let y = cy - r; y <= cy + r; y++) {
          for (let x = cx - r; x <= cx + r; x++) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
              const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
              if (dist === r) coords.push([x, y]);
            }
          }
        }
      }
    } else if (mode === 'circle-in') {
      const cx = Math.floor(width / 2);
      const cy = Math.floor(height / 2);
      const maxRadius = Math.ceil(Math.sqrt(cx * cx + cy * cy));

      for (let r = maxRadius; r >= 0; r--) {
        for (let y = cy - r; y <= cy + r; y++) {
          for (let x = cx - r; x <= cx + r; x++) {
            if (x >= 0 && x < width && y >= 0 && y < height) {
              const dist = Math.max(Math.abs(x - cx), Math.abs(y - cy));
              if (dist === r) coords.push([x, y]);
            }
          }
        }
      }
    } else if (mode === 'blocks' || mode === 'shuffle-blocks') {
      const blocks = [];
      for (let by = 0; by < height; by += blockHeight) {
        for (let bx = 0; bx < width; bx += blockWidth) {
          const block = [];
          for (let y = by; y < Math.min(by + blockHeight, height); y++) {
            for (let x = bx; x < Math.min(bx + blockWidth, width); x++) {
              block.push([x, y]);
            }
          }
          blocks.push(block);
        }
      }

      if (mode === 'shuffle-blocks') {
        // Simple Fisher-Yates shuffle
        for (let i = blocks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        }
      }

      // Concatenate all blocks
      for (const block of blocks) {
        coords.push(...block);
      }
    } else {
      throw new Error(`Unknown mode: ${mode}`);
    }

    // Filter coordinates to start from the specified position
    if (startFromX > 0 || startFromY > 0) {
      console.log(`🔄 Filtering coordinates to resume from position (${startFromX}, ${startFromY})`);
      let startIndex = -1;

      // Find the starting position in the coordinate list
      for (let i = 0; i < coords.length; i++) {
        const [x, y] = coords[i];
        if (x === startFromX && y === startFromY) {
          startIndex = i;
          break;
        }
      }

      if (startIndex >= 0) {
        // Resume from the found position (skip all previous coordinates)
        const filteredCoords = coords.slice(startIndex);
        console.log(`✂️ Resuming: skipped ${startIndex} coordinates, continuing with ${filteredCoords.length} remaining`);
        return filteredCoords;
      } else {
        console.warn(`⚠️ Resume position (${startFromX}, ${startFromY}) not found in coordinate list, starting from beginning`);
      }
    }

    return coords;
  }

  async function flushPixelBatch(pixelBatch) {
    if (!pixelBatch || pixelBatch.pixels.length === 0) return true;

    const batchSize = pixelBatch.pixels.length;
    console.log(
      `📦 Sending batch with ${batchSize} pixels (region: ${pixelBatch.regionX},${pixelBatch.regionY})`
    );
    const success = await sendBatchWithRetry(
      pixelBatch.pixels,
      pixelBatch.regionX,
      pixelBatch.regionY
    );
    if (success) {
      // Only increment progress for actually painted pixels to prevent multiplication
      const actuallyPaintedCount = pixelBatch.pixels.length;
      state.paintedPixels += actuallyPaintedCount;
      console.log(`📊 Added ${actuallyPaintedCount} painted pixels to progress (total: ${state.paintedPixels})`);

      pixelBatch.pixels.forEach((p) => {
        Utils.markPixelPainted(p.x, p.y, pixelBatch.regionX, pixelBatch.regionY);
      });

      // Update last painted position to the last pixel in the successful batch
      if (pixelBatch.pixels.length > 0) {
        const lastPixel = pixelBatch.pixels[pixelBatch.pixels.length - 1];
        state.lastPaintedPosition = { x: lastPixel.x, y: lastPixel.y };
      }

      // IMPORTANT: Decrement charges locally to match Acc-Switch.js behavior
      state.displayCharges = Math.max(0, state.displayCharges - batchSize);
      state.preciseCurrentCharges = Math.max(0, state.preciseCurrentCharges - batchSize);

      state.fullChargeData = {
        ...state.fullChargeData,
        spentSinceShot: state.fullChargeData.spentSinceShot + batchSize,
      };
      await updateStats();
      // Update account list with new charges
      await updateCurrentAccountInList();
      // Progress tracking removed from UI to reduce visual clutter
      Utils.performSmartSave();

      if (CONFIG.PAINTING_SPEED_ENABLED && state.paintingSpeed > 0 && batchSize > 0) {
        const delayPerPixel = 1000 / state.paintingSpeed;
        const totalDelay = Math.max(100, delayPerPixel * batchSize);
        await Utils.sleep(totalDelay);
      }
    } else {
      console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
      state.stopFlag = true;
      updateUI('paintingBatchFailed', 'error');
    }

    pixelBatch.pixels = [];
    return success;
  }

  async function processImage() {
    console.log('🚀 Starting auto-swap enabled painting workflow');

    try {
      // Main painting cycle - repeats until image complete or stopped
      while (!state.stopFlag) {
        console.log('📋 Phase 1: Starting painting session');
        const paintingResult = await executePaintingSession();

        if (paintingResult === 'completed') {
          console.log('🎉 Image painting completed!');
          break;
        }

        if (paintingResult === 'stopped') {
          console.log('⏹️ Painting stopped by user');
          break;
        }

        if (paintingResult === 'charges_depleted') {
          if (CONFIG.autoBuyToggle && CONFIG.autoBuy != buyTypes[0]) {
            console.log('Trying to buy more charges before stopping');
            const purchaseResult = await purchase(CONFIG.autoBuy);
            if (purchaseResult == 2) {
              console.log('✅ Purchase successful, continuing painting');
              await updateStats();
              await updateCurrentAccountInList();
              continue;
            }
            else if (purchaseResult == 1) {
              console.log('😭 Not enough droplets to buy more charges, swapping account.');
            }
            else {
              console.log('🤔 Purchase failed.');
            }
          }
          else console.log('🤫 Auto buy is disabled, wait for cooldown or swapping account.');
          if (!CONFIG.autoSwap) {
            // Original workflow: cooldown period
            console.log('⏱️ Phase 2: Entering cooldown period (auto-swap disabled)');
            const cooldownResult = await executeCooldownPeriod();

            if (cooldownResult === 'stopped') {
              console.log('⏹️ Cooldown stopped by user');
              break;
            }

            // Phase 3: Regenerate token for next painting session
            console.log('🔑 Phase 3: Regenerating token for next session');
            const tokenResult = await regenerateTokenForNewSession();

            if (!tokenResult) {
              console.log('❌ Failed to regenerate token, stopping');
              state.stopFlag = true;
              break;
            }
          } else {
            // Auto-swap workflow: simplified logic
            console.log('🔄 Auto-swap enabled: checking account switching options');

            // Retrieve fresh accounts list each time to avoid stale data
            const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
            console.log(`📊 Retrieved ${accounts.length} accounts from localStorage`);

            if (accounts.length <= 1) {
              console.log('📋 Only one account available, using standard cooldown');
              const cooldownResult = await executeCooldownPeriod();
              if (cooldownResult === 'stopped') break;

              const tokenResult = await regenerateTokenForNewSession();
              if (!tokenResult) {
                state.stopFlag = true;
                break;
              }
            } else {
              // Debug current state
              const totalAccounts = accountManager.getAccountCount();
              console.log(`📊 Account Status - Current index: ${accountManager.currentIndex}, Total accounts: ${totalAccounts}`);

              // Check if we're at the last account in the sequence
              const isLastAccount = accountManager.currentIndex >= totalAccounts - 1;
              console.log(`🔍 Is last account? ${isLastAccount} (index ${accountManager.currentIndex} of ${totalAccounts})`);

              if (!isLastAccount && totalAccounts > 1) {
                // Update current account status before switching
                console.log('📊 Updating current account status before switch...');
                await updateCurrentAccountInList();
                
                // Switch to next account immediately (no cooldown) - only if we have multiple accounts
                const nextAccount = accountManager.getNextAccount();
                console.log(`🔄 Switching to next account: ${nextAccount?.displayName} (${accountManager.currentIndex + 2}/${totalAccounts})`);
                const switchResult = await switchToNextAccount(accounts);
                if (!switchResult) {
                  console.log('❌ Account switch failed, stopping');
                  state.stopFlag = true;
                  break;
                }
                // Continue painting with new account immediately
                continue;
              } else if (totalAccounts === 1) {
                // Only one account available - use cooldown and continue with same account
                console.log('ℹ️ Only one account available, entering cooldown period');
                const cooldownResult = await executeCooldownPeriod();
                if (cooldownResult === 'stopped') break;
                console.log('✅ Cooldown complete, continuing with same account');
                continue;
              } else {
                // Last account reached - use cooldown then switch to first account
                console.log('⏱️ Last account reached, entering cooldown period');
                console.log(`📊 Current account: index ${accountManager.currentIndex}, Last account: index ${totalAccounts - 1}`);

                const cooldownResult = await executeCooldownPeriod();
                if (cooldownResult === 'stopped') break;

                // After cooldown, switch to first account
                console.log('🔁 Cooldown complete, switching to first account');
                console.log(`🔄 Before switch - Current index: ${accountManager.currentIndex}, Target: index 0`);

                const firstAccountInfo = accountManager.getAccountByIndex(0);
                const firstAccountToken = firstAccountInfo?.token;

                if (!firstAccountToken) {
                  console.log('❌ First account token not found, stopping');
                  state.stopFlag = true;
                  break;
                }

                // Reset to first position
                accountManager.setCurrentIndex(0);

                const switchResult = await switchToSpecificAccount(firstAccountToken, firstAccountInfo.displayName);
                if (!switchResult) {
                  console.log('❌ Switch to ID 1 failed, stopping');
                  state.stopFlag = true;
                  break;
                }

                console.log(`✅ Successfully switched to ID 1 (${firstAccountInfo.displayName}). Cycle restarted.`);
                // Continue painting with first account
                continue;
              }
            }
          }
        }

        console.log('🔄 Cycle complete, starting next painting session');
      }
    } finally {
      await finalizePaintingProcess();
    }
  }

  // Phase 1: Execute a complete painting session using all available charges
  async function executePaintingSession() {
    console.log('🎨 Starting painting session - using all charges until 0');
    const { width, height, pixels } = state.imageData;
    const { x: startX, y: startY } = state.startPosition;
    const { x: regionX, y: regionY } = state.region;

    // Check if we're working with restored data by looking for existing availableColors
    const isRestoredData = state.availableColors && state.availableColors.length > 0 && state.colorsChecked;

    if (!isRestoredData) {
      // Wait for original tiles to load if needed
      const tilesReady = await overlayManager.waitForTiles(
        regionX,
        regionY,
        width,
        height,
        startX,
        startY,
        10000 // timeout 10s
      );

      if (!tilesReady) {
        updateUI('overlayTilesNotLoaded', 'error');
        state.stopFlag = true;
        return 'stopped';
      }
    }

    let pixelBatch = null;
    let skippedPixels = {
      transparent: 0,
      white: 0,
      alreadyPainted: 0,
      colorUnavailable: 0,
    };

    // IMPORTANT: Check charges once at start, then paint until depleted
    console.log('🔋 Checking initial charges for painting session');
    const initialChargeCheck = await WPlaceService.getCharges();
    state.displayCharges = Math.floor(initialChargeCheck.charges);
    state.preciseCurrentCharges = initialChargeCheck.charges;
    state.cooldown = initialChargeCheck.cooldown;
    await updateStats();
    if (state.displayCharges <= 0) {
      console.log('⚡ No charges available, skipping painting session');
      return 'charges_depleted';
    }

    console.log(`🔋 Starting with ${state.displayCharges} charges - painting until depleted`);

    // Paint pixels until we run out of charges or complete the image
    try {
      // First generate coordinates without filtering to count skipped ones
      const allCoords = generateCoordinates(
        width,
        height,
        state.coordinateMode,
        state.coordinateDirection,
        state.coordinateSnake,
        state.blockWidth,
        state.blockHeight,
        0, // Don't filter here
        0  // Don't filter here
      );

      // Find how many coordinates are skipped and set progress accordingly
      let skippedCoordinates = 0;
      if (state.lastPosition.x > 0 || state.lastPosition.y > 0) {
        const startingCoordIndex = allCoords.findIndex(([x, y]) => x === state.lastPosition.x && y === state.lastPosition.y);
        skippedCoordinates = startingCoordIndex >= 0 ? startingCoordIndex : 0;

        if (skippedCoordinates > 0) {
          // Set progress to exactly match skipped coordinates
          state.paintedPixels = skippedCoordinates;
          console.log(`📈 Progress set to match skipped coordinates: ${skippedCoordinates} pixels`);
          console.log(`🔄 Resuming painting from position (${state.lastPosition.x}, ${state.lastPosition.y})`);
          console.log(`📊 Current progress: ${state.paintedPixels} pixels painted`);
          await updateStats(); // Update UI to show correct progress
        }
      }

      // Now generate the actual filtered coordinates for painting
      const coords = generateCoordinates(
        width,
        height,
        state.coordinateMode,
        state.coordinateDirection,
        state.coordinateSnake,
        state.blockWidth,
        state.blockHeight,
        state.lastPosition.x,
        state.lastPosition.y
      );

      // OPTIMIZATION: Pre-filter already painted pixels (happens only once per session)
      let eligibleCoords = [];
      let alreadyPaintedCount = 0;

      if (!state.preFilteringDone) {
        console.log('🔍 Pre-filtering already painted pixels (one-time detection for this session)...');

        for (const [x, y] of coords) {
          const targetPixelInfo = checkPixelEligibility(x, y);

          if (!targetPixelInfo.eligible) {
            if (targetPixelInfo.reason !== 'alreadyPainted') {
              skippedPixels[targetPixelInfo.reason]++;

            }
            continue;
          }

          // Check if already painted (only once per session)
          let absX = startX + x;
          let absY = startY + y;
          let adderX = Math.floor(absX / 1000);
          let adderY = Math.floor(absY / 1000);
          let pixelX = absX % 1000;
          let pixelY = absY % 1000;

          try {
            const tilePixelRGBA = await overlayManager.getTilePixelColor(
              regionX + adderX,
              regionY + adderY,
              pixelX,
              pixelY
            );

            if (tilePixelRGBA && Array.isArray(tilePixelRGBA)) {
              const mappedCanvasColor = Utils.resolveColor(
                tilePixelRGBA.slice(0, 3),
                state.availableColors,
                !state.paintUnavailablePixels  // Use same parameter as target pixel
              );
              const isMatch = mappedCanvasColor.id === targetPixelInfo.mappedColorId;
              if (isMatch) {
                alreadyPaintedCount++;
                // Mark as painted in map but DO NOT increment progress counter
                // Progress should only reflect actual painting sequence position
                Utils.markPixelPainted(x, y, regionX + adderX, regionY + adderY);
                continue; // Skip already painted pixels
              }
            }
          } catch (e) {
            // If we can't check, include the pixel (better to attempt than skip)
          }

          // Add eligible unpainted pixel to list
          eligibleCoords.push([x, y, targetPixelInfo]);
        }

        // Mark pre-filtering as done for this session
        state.preFilteringDone = true;

        // Log pre-filtering results
        if (alreadyPaintedCount > 0) {
          console.log(`✓ Pre-filter complete: ${alreadyPaintedCount} already painted pixels detected (not added to progress counter)`);
          console.log('ℹ️ This detection will not happen again until a new image/save is loaded');
          console.log('📊 Progress counter only reflects actual painting sequence position');
          // No need to update stats since progress wasn't changed
        }
        skippedPixels.alreadyPainted = alreadyPaintedCount;
      } else {
        // Pre-filtering already done this session, just filter for basic eligibility
        console.log('🔍 Using existing pre-filter results (already done this session)');
        for (const [x, y] of coords) {
          const targetPixelInfo = checkPixelEligibility(x, y);

          if (!targetPixelInfo.eligible) {
            if (targetPixelInfo.reason !== 'alreadyPainted') {
              skippedPixels[targetPixelInfo.reason]++;
            }
            continue;
          }

          // Only include pixels that haven't been marked as painted yet
          let absX = startX + x;
          let absY = startY + y;
          let adderX = Math.floor(absX / 1000);
          let adderY = Math.floor(absY / 1000);

          if (!Utils.isPixelPainted(x, y, regionX + adderX, regionY + adderY)) {
            eligibleCoords.push([x, y, targetPixelInfo]);
          }
        }
      }

      // Paint eligible pixels (already pre-filtered, no duplicate checks)
      outerLoop: for (const [x, y, targetPixelInfo] of eligibleCoords) {
        if (state.stopFlag) {
          if (pixelBatch && pixelBatch.pixels.length > 0) {
            console.log(`🎯 Sending last batch before stop with ${pixelBatch.pixels.length} pixels`);
            await flushPixelBatch(pixelBatch);
          }
          state.lastPosition = { x, y };
          // Show paused coordinates in UI with proper translation template
          // Use last painted position if available, otherwise use current position
          const pausedX = state.lastPaintedPosition.x || x;
          const pausedY = state.lastPaintedPosition.y || y;
          updateUI('paintingPaused', 'warning', { x: pausedX, y: pausedY });
          console.log(`⏸️ Painting paused after last painted coordinates (${pausedX}, ${pausedY})`);
          return 'stopped';
        }

        // Check if we have charges left (local count, no API call)
        if (state.displayCharges <= 0) {
          // console.log("Try to buy paint charges");
          // await purchase("paint_charges");
          await updateStats();
          if (state.displayCharges <= 0) {
            console.log('⚡ No charges left (local count), ending painting session');
            if (pixelBatch && pixelBatch.pixels.length > 0) {
              console.log(`🎯 Sending final batch with ${pixelBatch.pixels.length} pixels`);
              await flushPixelBatch(pixelBatch);
            }
            state.lastPosition = { x, y };
            return 'charges_depleted';
          }
          // else {
          //   console.log(`🔋 Charges after purchase: ${state.displayCharges}, continuing painting`);
          // }
        }

        let absX = startX + x;
        let absY = startY + y;

        let adderX = Math.floor(absX / 1000);
        let adderY = Math.floor(absY / 1000);
        let pixelX = absX % 1000;
        let pixelY = absY % 1000;

        // CRITICAL FIX: Always check if pixel is already painted (both locally and on canvas)
        if (Utils.isPixelPainted(x, y, regionX + adderX, regionY + adderY)) {
          console.log(`⏭️ Skipping already painted pixel at (${x}, ${y}) - marked in local map`);
          continue; // Skip already painted pixels
        }

        // REAL-TIME CANVAS CHECK: Verify against actual canvas state to prevent overpainting
        try {
          const existingColorRGBA = await overlayManager.getTilePixelColor(
            regionX + adderX,
            regionY + adderY,
            pixelX,
            pixelY
          ).catch(() => null);

          if (existingColorRGBA && Array.isArray(existingColorRGBA)) {
            const [er, eg, eb] = existingColorRGBA;
            const existingMappedColor = Utils.resolveColor(
              [er, eg, eb],
              state.availableColors,
              !state.paintUnavailablePixels
            );
            const isAlreadyCorrect = existingMappedColor.id === targetPixelInfo.mappedColorId;

            if (isAlreadyCorrect) {
              console.log(`✅ Pixel at (${x}, ${y}) already has correct color (${existingMappedColor.id}) - marking as painted`);
              // Mark it as painted in local map but DO NOT increment progress counter
              // Progress should only reflect actual painting sequence position
              Utils.markPixelPainted(x, y, regionX + adderX, regionY + adderY);
              continue; // Skip painting this pixel
            }
          }
        } catch (e) {
          // If we can't check the canvas, proceed with painting (better to attempt than skip)
          console.warn(`⚠️ Could not verify canvas state for pixel (${x}, ${y}), proceeding with paint:`, e.message);
        }

        const targetMappedColorId = targetPixelInfo.mappedColorId;

        // Set up pixel batch for new region if needed
        if (
          !pixelBatch ||
          pixelBatch.regionX !== regionX + adderX ||
          pixelBatch.regionY !== regionY + adderY
        ) {
          if (pixelBatch && pixelBatch.pixels.length > 0) {
            console.log(`🌍 Sending region-change batch with ${pixelBatch.pixels.length} pixels`);
            const success = await flushPixelBatch(pixelBatch);
            if (!success) {
              console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
              state.stopFlag = true;
              return 'stopped';
            }
            await updateStats();
          }

          pixelBatch = {
            regionX: regionX + adderX,
            regionY: regionY + adderY,
            pixels: [],
          };
        }

        // Add pixel to batch (no need to check again - already pre-filtered)
        pixelBatch.pixels.push({
          x: pixelX,
          y: pixelY,
          color: targetMappedColorId,
          localX: x,
          localY: y,
        });

        // Send batch if it's full
        const maxBatchSize = calculateBatchSize();
        if (pixelBatch.pixels.length >= maxBatchSize) {
          console.log(`📦 Sending batch with ${pixelBatch.pixels.length} pixels`);
          const success = await flushPixelBatch(pixelBatch);
          if (!success) {
            console.error(`❌ Batch failed permanently after retries. Stopping painting.`);
            state.stopFlag = true;
            return 'stopped';
          }
          pixelBatch.pixels = [];
          await updateStats();
        }
      }

      // Send final batch if any pixels remain
      if (pixelBatch && pixelBatch.pixels.length > 0 && !state.stopFlag) {
        console.log(`🏁 Sending final batch with ${pixelBatch.pixels.length} pixels`);
        const success = await flushPixelBatch(pixelBatch);
        if (!success) {
          console.warn(`⚠️ Final batch failed with ${pixelBatch.pixels.length} pixels`);
        }
      }

      // If we completed the entire coordinate loop, image is complete
      return state.stopFlag ? 'stopped' : 'completed';

    } finally {
      // Log skip statistics for this session
      console.log(`📊 Session Statistics:`);
      console.log(`   New pixels painted: ${state.paintedPixels - (skippedPixels.alreadyPainted || 0)}`);
      console.log(`   Already painted detected: ${skippedPixels.alreadyPainted}`);
      console.log(`   Total progress: ${state.paintedPixels}`);
      console.log(`   Pre-filtered - Transparent: ${skippedPixels.transparent}`);
      console.log(`   Pre-filtered - White: ${skippedPixels.white}`);
      console.log(`   Pre-filtered - Color Unavailable: ${skippedPixels.colorUnavailable}`);
    }
  }

  // Phase 2: Execute cooldown period - wait for target charges (NO token regeneration)
  async function executeCooldownPeriod() {
    console.log('⏱️ Entering cooldown period - waiting for target charges');
    console.log('🚫 NO token regeneration during cooldown (even if expired/invalid)');

    // Check initial charges to calculate wait time
    let chargeCheckCount = 0;
    // const maxChargeChecks = 10; // REMOVED: No limit on API calls during cooldown

    while (!state.stopFlag) {
      chargeCheckCount++;

      const { charges, cooldown } = await WPlaceService.getCharges();
      state.displayCharges = Math.floor(charges);
      state.preciseCurrentCharges = charges;
      state.cooldown = cooldown;

      if (state.displayCharges >= state.cooldownChargeThreshold) {
        console.log(`✅ Cooldown target reached: ${state.displayCharges}/${state.cooldownChargeThreshold}`);
        NotificationManager.maybeNotifyChargesReached(true);
        await updateStats();
        return 'target_reached';
      }

      updateUI('noChargesThreshold', 'warning', {
        time: Utils.msToTimeText(state.cooldown),
        threshold: state.cooldownChargeThreshold,
        current: state.displayCharges,
      });
      await updateStats();

      // Smart delay calculation to reduce API calls
      const chargesNeeded = state.cooldownChargeThreshold - state.displayCharges;
      const estimatedWaitTime = chargesNeeded * state.cooldown;

      // Use longer delays during cooldown to prevent rate limiting
      let delayTime;
      if (chargeCheckCount < 3) {
        // First few checks - shorter delay
        delayTime = Math.max(3000, state.cooldown); // 3 seconds minimum
      } else if (estimatedWaitTime > 60000) {
        // Long wait expected - check every 15 seconds
        delayTime = 10000;
      } else if (estimatedWaitTime > 30000) {
        // Medium wait - check every 15 seconds
        delayTime = 15000;
      } else {
        // Close to target - check every 5 seconds
        delayTime = 5000;
      }

      console.log(`⏱️ Cooldown check ${chargeCheckCount}: ${state.displayCharges}/${state.cooldownChargeThreshold} charges, waiting 10s before next check`);
      await Utils.sleep(10000);

      // REMOVED: No limit on charge checks - bot will wait infinitely until charges are available
      // if (chargeCheckCount >= maxChargeChecks) {
      //   console.warn('⚠️ Max charge checks reached during cooldown, continuing anyway');
      //   break;
      // }
    }

    return 'stopped';
  }

  // Phase 3: Regenerate token for new painting session
  async function regenerateTokenForNewSession() {
    console.log('🔑 Regenerating token for new painting session');

    try {
      // Force regenerate token for new session
      await ensureToken(true); // forceRefresh = true

      if (!getTurnstileToken()) {
        console.error('❌ Failed to generate token for new session');
        return false;
      }

      console.log('✅ Token regenerated successfully for new session');
      return true;
    } catch (error) {
      console.error('❌ Token regeneration failed:', error);
      return false;
    }
  }

  // Finalize painting process cleanup
  async function finalizePaintingProcess() {
    console.log('🧹 Finalizing painting process');

    if (window._chargesInterval) {
      clearInterval(window._chargesInterval);
      window._chargesInterval = null;
    }

    if (state.stopFlag) {
      // Save progress when stopped to preserve painted map
      Utils.saveProgress();
    } else {
      updateUI('paintingComplete', 'success', { count: state.paintedPixels });
      state.lastPosition = { x: 0, y: 0 }; // Only reset when truly complete
      Utils.saveProgress(); // Save final complete state
      overlayManager.clear();
      const toggleOverlayBtn = document.getElementById('toggleOverlayBtn');
      if (toggleOverlayBtn) {
        toggleOverlayBtn.classList.remove('active');
        toggleOverlayBtn.disabled = true;
      }
    }
  }

  // Helper function to check pixel eligibility (shared by painting functions)
  function checkPixelEligibility(x, y) {
    const { width, height, pixels } = state.imageData;
    const transparencyThreshold = state.customTransparencyThreshold || CONFIG.TRANSPARENCY_THRESHOLD;

    // CRITICAL FIX: Check module availability before processing
    if (!Utils || typeof Utils.isWhitePixel !== 'function') {
      console.error('❌ Utils module not available for pixel eligibility check');
      return {
        eligible: false,
        reason: 'moduleUnavailable',
      };
    }

    const idx = (y * width + x) * 4;
    const r = pixels[idx],
      g = pixels[idx + 1],
      b = pixels[idx + 2],
      a = pixels[idx + 3];

    if (!state.paintTransparentPixels && a < transparencyThreshold)
      return {
        eligible: false,
        reason: 'transparent',
      };
    if (!state.paintWhitePixels && Utils.isWhitePixel(r, g, b))
      return {
        eligible: false,
        reason: 'white',
      };

    let targetRgb = Utils.isWhitePixel(r, g, b)
      ? [255, 255, 255]
      : Utils.findClosestPaletteColor(r, g, b, state.activeColorPalette);

    const mappedTargetColorId = Utils.resolveColor(
      targetRgb,
      state.availableColors,
      !state.paintUnavailablePixels
    );

    if (!state.paintUnavailablePixels && !mappedTargetColorId.id) {
      return {
        eligible: false,
        reason: 'colorUnavailable',
        r,
        g,
        b,
        a,
        mappedColorId: mappedTargetColorId.id,
      };
    }
    return { eligible: true, r, g, b, a, mappedColorId: mappedTargetColorId.id };
  }

  // Helper function to skip pixel and log the reason (minimized logging)
  function skipPixel(reason, id, rgb, x, y, skippedPixels) {
    // Minimize logging to prevent console flooding - only log non-routine skips
    if (reason !== 'transparent' && reason !== 'alreadyPainted') {
      console.log(`Skipped pixel for ${reason} (id: ${id}, (${rgb.join(', ')})) at (${x}, ${y})`);
    }
    skippedPixels[reason]++;
  }
  function calculateBatchSize() {
    let targetBatchSize;

    // If speed control is disabled, use all available charges
    if (!CONFIG.PAINTING_SPEED_ENABLED) {
      targetBatchSize = state.displayCharges;
      console.log(`🚀 Speed control disabled: using all ${targetBatchSize} available charges`);
      return Math.max(1, targetBatchSize);
    }

    if (state.batchMode === 'random') {
      // Generate random batch size within the specified range
      const min = Math.max(1, state.randomBatchMin);
      const max = Math.max(min, state.randomBatchMax);
      targetBatchSize = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(`🎲 Random batch size generated: ${targetBatchSize} (range: ${min}-${max})`);
    } else {
      // Normal mode - use the fixed paintingSpeed value
      targetBatchSize = state.paintingSpeed;
    }

    // Always limit by available charges
    const maxAllowed = state.displayCharges;
    const finalBatchSize = Math.min(targetBatchSize, maxAllowed);

    return finalBatchSize;
  }

  // Helper function to retry batch until success with exponential backoff
  async function sendBatchWithRetry(pixels, regionX, regionY, maxRetries = MAX_BATCH_RETRIES) {
    let attempt = 0;
    while (attempt < maxRetries && !state.stopFlag) {
      attempt++;
      console.log(
        `🔄 Attempting to send batch (attempt ${attempt}/${maxRetries}) for region ${regionX},${regionY} with ${pixels.length} pixels`
      );

      const result = await sendPixelBatch(pixels, regionX, regionY);

      if (result === true) {
        console.log(`✅ Batch succeeded on attempt ${attempt}`);
        return true;
      } else if (result === 'token_error') {
        console.log(`🔑 Token error on attempt ${attempt} - no token available during processing`);
        console.log(`❌ Stopping batch processing - tokens must be generated at startup/start button only`);
        updateUI('captchaFailed', 'error');
        return false; // Stop processing entirely - don't regenerate during processing
      } else if (result === 'token_regenerated') {
        console.log(`🔄 Token regenerated on attempt ${attempt} after 403 error - retrying batch`);
        updateUI('paintingPaused', 'warning', { message: 'Token refreshed, resuming...' });
        // Don't count token regeneration as a failed attempt, retry immediately
        attempt--;
        await Utils.sleep(500); // Brief pause before retry
        continue;
      } else if (result === 'token_regeneration_failed') {
        console.log(`❌ Token regeneration failed on attempt ${attempt} after 403 error`);
        updateUI('captchaFailed', 'error');
        return false; // Stop processing if we can't get a valid token
      } else if (result === 'invalid_token_error') {
        console.log(`🔑 Invalid token detected on attempt ${attempt}, regenerating...`);
        updateUI('captchaSolving', 'warning');
        try {
          await handleCaptcha(true); // Allow generation for invalid token cases
          // Don't count token regeneration as a failed attempt
          attempt--;
          continue;
        } catch (e) {
          console.error(`❌ Token regeneration failed after invalid token on attempt ${attempt}:`, e);
          updateUI('captchaFailed', 'error');
          // Wait longer before retrying after token failure
          await Utils.sleep(5000);
        }
      } else {
        console.warn(`⚠️ Batch failed on attempt ${attempt}, retrying...`);
        // Exponential backoff with jitter
        const baseDelay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30s
        const jitter = Math.random() * 1000; // Add up to 1s random delay
        await Utils.sleep(baseDelay + jitter);
      }
    }

    if (attempt >= maxRetries) {
      console.error(
        `❌ Batch failed after ${maxRetries} attempts (MAX_BATCH_RETRIES=${MAX_BATCH_RETRIES}). This will stop painting to prevent infinite loops.`
      );
      updateUI('paintingError', 'error');
      return false;
    }

    return false;
  }

  async function sendPixelBatch(pixelBatch, regionX, regionY) {
    let token = getTurnstileToken();

    // Don't auto-generate tokens during processing - return error if no token available
    if (!token) {
      console.warn('⚠️ No token available and auto-generation disabled during processing');
      return 'token_error';
    }

    const coords = new Array(pixelBatch.length * 2);
    const colors = new Array(pixelBatch.length);
    for (let i = 0; i < pixelBatch.length; i++) {
      const pixel = pixelBatch[i];
      coords[i * 2] = pixel.x;
      coords[i * 2 + 1] = pixel.y;
      colors[i] = pixel.color;
    }

    try {
      const payload = { coords, colors, t: token, fp: fpStr32 };
      var wasmtoken = await createWasmToken(regionX, regionY, payload);
      const res = await fetch(`https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8', "x-pawtect-token": wasmtoken },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.status === 403) {
        let data = null;
        try {
          data = await res.json();
        } catch (_) { }
        console.error('❌ 403 Forbidden. Token invalid during painting - regeneration allowed.');

        // 403 errors during painting allow token regeneration per workflow requirements
        console.log('� Token invalid (403) during painting - regenerating token as allowed by workflow');
        setTurnstileToken(null);
        createTokenPromise();

        // Attempt to regenerate token immediately
        const newToken = await ensureToken(true);
        if (newToken) {
          console.log('✅ Token regenerated after 403 error, returning regenerate signal');
          return 'token_regenerated';
        } else {
          console.error('❌ Failed to regenerate token after 403 error');
          return 'token_regeneration_failed';
        }
      }

      const data = await res.json();
      return data?.painted === pixelBatch.length;
    } catch (e) {
      console.error('Batch paint request failed:', e);
      return false;
    }
  }

  function saveBotSettings() {
    try {
      const settings = {
        paintingSpeed: state.paintingSpeed,
        paintingSpeedEnabled: document.getElementById('enableSpeedToggle')?.checked,
        batchMode: state.batchMode, // "normal" or "random"
        randomBatchMin: state.randomBatchMin,
        randomBatchMax: state.randomBatchMax,
        cooldownChargeThreshold: state.cooldownChargeThreshold,
        tokenSource: state.tokenSource, // "generator", "hybrid", or "manual"
        minimized: state.minimized,
        overlayOpacity: state.overlayOpacity,
        blueMarbleEnabled: document.getElementById('enableBlueMarbleToggle')?.checked,
        ditheringEnabled: state.ditheringEnabled,
        colorMatchingAlgorithm: state.colorMatchingAlgorithm,
		invertColorEnabled: state.invertColorEnabled,
        enableChromaPenalty: state.enableChromaPenalty,
        chromaPenaltyWeight: state.chromaPenaltyWeight,
        customTransparencyThreshold: state.customTransparencyThreshold,
        customWhiteThreshold: state.customWhiteThreshold,
        paintWhitePixels: state.paintWhitePixels,
        paintTransparentPixels: state.paintTransparentPixels,
        resizeSettings: state.resizeSettings,
        paintUnavailablePixels: state.paintUnavailablePixels,
        coordinateMode: state.coordinateMode,
        coordinateDirection: state.coordinateDirection,
        coordinateSnake: state.coordinateSnake,
        blockWidth: state.blockWidth,
        blockHeight: state.blockHeight, // Save ignore mask (as base64) with its dimensions
        resizeIgnoreMask:
          state.resizeIgnoreMask &&
            state.resizeSettings &&
            state.resizeSettings.width * state.resizeSettings.height === state.resizeIgnoreMask.length
            ? {
              w: state.resizeSettings.width,
              h: state.resizeSettings.height,
              data: btoa(String.fromCharCode(...state.resizeIgnoreMask)),
            }
            : null, // Notifications
        notificationsEnabled: state.notificationsEnabled,
        notifyOnChargesReached: state.notifyOnChargesReached,
        notifyOnlyWhenUnfocused: state.notifyOnlyWhenUnfocused,
        notificationIntervalMinutes: state.notificationIntervalMinutes,
        originalImage: state.originalImage,
      };
      CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled;
      // AUTO_CAPTCHA_ENABLED is always true - no need to save/load

      localStorage.setItem('wplace-bot-settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save bot settings:', e);
    }
  }

  function loadBotSettings() {
    try {
      const saved = localStorage.getItem('wplace-bot-settings');
      if (!saved) return;
      const settings = JSON.parse(saved);

      state.paintingSpeed = settings.paintingSpeed || CONFIG.PAINTING_SPEED.DEFAULT;
      state.batchMode = settings.batchMode || CONFIG.BATCH_MODE; // Default to "normal"
      state.randomBatchMin = settings.randomBatchMin || CONFIG.RANDOM_BATCH_RANGE.MIN;
      state.randomBatchMax = settings.randomBatchMax || CONFIG.RANDOM_BATCH_RANGE.MAX;
      state.cooldownChargeThreshold =
        settings.cooldownChargeThreshold || CONFIG.COOLDOWN_CHARGE_THRESHOLD;
      state.tokenSource = settings.tokenSource || CONFIG.TOKEN_SOURCE; // Default to "generator"
      state.minimized = settings.minimized ?? false;
      CONFIG.PAINTING_SPEED_ENABLED = settings.paintingSpeedEnabled ?? false;
      CONFIG.AUTO_CAPTCHA_ENABLED = settings.autoCaptchaEnabled ?? false;
      state.overlayOpacity = settings.overlayOpacity ?? CONFIG.OVERLAY.OPACITY_DEFAULT;
      state.blueMarbleEnabled = settings.blueMarbleEnabled ?? CONFIG.OVERLAY.BLUE_MARBLE_DEFAULT;
      state.ditheringEnabled = settings.ditheringEnabled ?? false;
      state.colorMatchingAlgorithm = settings.colorMatchingAlgorithm || 'lab';
	  state.invertColorEnabled = setting.invertColorEnabled ?? false;
      state.enableChromaPenalty = settings.enableChromaPenalty ?? true;
      state.chromaPenaltyWeight = settings.chromaPenaltyWeight ?? 0.15;
      state.customTransparencyThreshold =
        settings.customTransparencyThreshold ?? CONFIG.TRANSPARENCY_THRESHOLD;
      state.customWhiteThreshold = settings.customWhiteThreshold ?? CONFIG.WHITE_THRESHOLD;
      state.paintWhitePixels = settings.paintWhitePixels ?? true;
      state.paintTransparentPixels = settings.paintTransparentPixels ?? false;
      state.resizeSettings = settings.resizeSettings ?? null;
      state.originalImage = settings.originalImage ?? null;
      state.paintUnavailablePixels = settings.paintUnavailablePixels ?? CONFIG.PAINT_UNAVAILABLE;
      state.coordinateMode = settings.coordinateMode ?? CONFIG.COORDINATE_MODE;
      state.coordinateDirection = settings.coordinateDirection ?? CONFIG.COORDINATE_DIRECTION;
      state.coordinateSnake = settings.coordinateSnake ?? CONFIG.COORDINATE_SNAKE;
      state.blockWidth = settings.blockWidth ?? CONFIG.COORDINATE_BLOCK_WIDTH;
      state.blockHeight = settings.blockHeight ?? CONFIG.COORDINATE_BLOCK_HEIGHT;
      // Notifications
      state.notificationsEnabled = settings.notificationsEnabled ?? CONFIG.NOTIFICATIONS.ENABLED;
      state.notifyOnChargesReached =
        settings.notifyOnChargesReached ?? CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED;
      state.notifyOnlyWhenUnfocused =
        settings.notifyOnlyWhenUnfocused ?? CONFIG.NOTIFICATIONS.ONLY_WHEN_UNFOCUSED;
      state.notificationIntervalMinutes =
        settings.notificationIntervalMinutes ?? CONFIG.NOTIFICATIONS.REPEAT_MINUTES;
      // Restore ignore mask if dims match current resizeSettings
      if (
        settings.resizeIgnoreMask &&
        settings.resizeIgnoreMask.data &&
        state.resizeSettings &&
        settings.resizeIgnoreMask.w === state.resizeSettings.width &&
        settings.resizeIgnoreMask.h === state.resizeSettings.height
      ) {
        try {
          const bin = atob(settings.resizeIgnoreMask.data);
          const arr = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          state.resizeIgnoreMask = arr;
        } catch {
          state.resizeIgnoreMask = null;
        }
      } else {
        state.resizeIgnoreMask = null;
      }
      // Initialize coordinate generation UI
      const coordinateModeSelect = document.getElementById('coordinateModeSelect');
      if (coordinateModeSelect) coordinateModeSelect.value = state.coordinateMode;

      const coordinateDirectionSelect = document.getElementById('coordinateDirectionSelect');
      if (coordinateDirectionSelect) coordinateDirectionSelect.value = state.coordinateDirection;

      const coordinateSnakeToggle = document.getElementById('coordinateSnakeToggle');
      if (coordinateSnakeToggle) coordinateSnakeToggle.checked = state.coordinateSnake;

      const settingsContainer = document.getElementById('wplace-settings-container');
      const directionControls = settingsContainer.querySelector('#directionControls');
      const snakeControls = settingsContainer.querySelector('#snakeControls');
      const blockControls = settingsContainer.querySelector('#blockControls');
      Utils.updateCoordinateUI({
        mode: state.coordinateMode,
        directionControls,
        snakeControls,
        blockControls,
      });

      const paintUnavailablePixelsToggle = document.getElementById('paintUnavailablePixelsToggle');
      if (paintUnavailablePixelsToggle) {
        paintUnavailablePixelsToggle.checked = state.paintUnavailablePixels;
      }

      const settingsPaintWhiteToggle = settingsContainer.querySelector('#settingsPaintWhiteToggle');
      if (settingsPaintWhiteToggle) {
        settingsPaintWhiteToggle.checked = state.paintWhitePixels;
      }

      const settingsPaintTransparentToggle = settingsContainer.querySelector(
        '#settingsPaintTransparentToggle'
      );
      if (settingsPaintTransparentToggle) {
        settingsPaintTransparentToggle.checked = state.paintTransparentPixels;
      }

      const speedSlider = document.getElementById('speedSlider');
      const speedInput = document.getElementById('speedInput');
      const speedValue = document.getElementById('speedValue');
      if (speedSlider) speedSlider.value = state.paintingSpeed;
      if (speedInput) speedInput.value = state.paintingSpeed;
      if (speedValue) speedValue.textContent = `pixels`;

      const enableSpeedToggle = document.getElementById('enableSpeedToggle');
      if (enableSpeedToggle) enableSpeedToggle.checked = CONFIG.PAINTING_SPEED_ENABLED;

      // Batch mode UI initialization
      const batchModeSelect = document.getElementById('batchModeSelect');
      if (batchModeSelect) batchModeSelect.value = state.batchMode;

      const normalBatchControls = document.getElementById('normalBatchControls');
      const randomBatchControls = document.getElementById('randomBatchControls');

      // Show/hide appropriate controls based on batch mode
      if (normalBatchControls && randomBatchControls) {
        if (state.batchMode === 'random') {
          normalBatchControls.style.display = 'none';
          randomBatchControls.style.display = 'block';
        } else {
          normalBatchControls.style.display = 'block';
          randomBatchControls.style.display = 'none';
        }
      }

      const randomBatchMin = document.getElementById('randomBatchMin');
      if (randomBatchMin) randomBatchMin.value = state.randomBatchMin;

      const randomBatchMax = document.getElementById('randomBatchMax');
      if (randomBatchMax) randomBatchMax.value = state.randomBatchMax;

      // AUTO_CAPTCHA_ENABLED is always true - no toggle to set

      const cooldownSlider = document.getElementById('cooldownSlider');
      const cooldownInput = document.getElementById('cooldownInput');
      const cooldownValue = document.getElementById('cooldownValue');
      if (cooldownSlider) cooldownSlider.value = state.cooldownChargeThreshold;
      if (cooldownInput) cooldownInput.value = state.cooldownChargeThreshold;
      if (cooldownValue) cooldownValue.textContent = `${Utils.t('charges')}`;

      const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
      if (overlayOpacitySlider) overlayOpacitySlider.value = state.overlayOpacity;
      const overlayOpacityValue = document.getElementById('overlayOpacityValue');
      if (overlayOpacityValue)
        overlayOpacityValue.textContent = `${Math.round(state.overlayOpacity * 100)}%`;
      const enableBlueMarbleToggle = document.getElementById('enableBlueMarbleToggle');
      if (enableBlueMarbleToggle) enableBlueMarbleToggle.checked = state.blueMarbleEnabled;

      const tokenSourceSelect = document.getElementById('tokenSourceSelect');
      if (tokenSourceSelect) tokenSourceSelect.value = state.tokenSource;

      const colorAlgorithmSelect = document.getElementById('colorAlgorithmSelect');
      if (colorAlgorithmSelect) colorAlgorithmSelect.value = state.colorMatchingAlgorithm;
      const enableChromaPenaltyToggle = document.getElementById('enableChromaPenaltyToggle');
      if (enableChromaPenaltyToggle) enableChromaPenaltyToggle.checked = state.enableChromaPenalty;
      const chromaPenaltyWeightSlider = document.getElementById('chromaPenaltyWeightSlider');
      if (chromaPenaltyWeightSlider) chromaPenaltyWeightSlider.value = state.chromaPenaltyWeight;
      const chromaWeightValue = document.getElementById('chromaWeightValue');
      if (chromaWeightValue) chromaWeightValue.textContent = state.chromaPenaltyWeight;
      const transparencyThresholdInput = document.getElementById('transparencyThresholdInput');
      if (transparencyThresholdInput)
        transparencyThresholdInput.value = state.customTransparencyThreshold;
      const whiteThresholdInput = document.getElementById('whiteThresholdInput');
      if (whiteThresholdInput) whiteThresholdInput.value = state.customWhiteThreshold;
      // Notifications UI
      const notifEnabledToggle = document.getElementById('notifEnabledToggle');
      if (notifEnabledToggle) notifEnabledToggle.checked = state.notificationsEnabled;
      const notifOnChargesToggle = document.getElementById('notifOnChargesToggle');
      if (notifOnChargesToggle) notifOnChargesToggle.checked = state.notifyOnChargesReached;
      const notifOnlyUnfocusedToggle = document.getElementById('notifOnlyUnfocusedToggle');
      if (notifOnlyUnfocusedToggle)
        notifOnlyUnfocusedToggle.checked = state.notifyOnlyWhenUnfocused;
      const notifIntervalInput = document.getElementById('notifIntervalInput');
      if (notifIntervalInput) notifIntervalInput.value = state.notificationIntervalMinutes;
      NotificationManager.resetEdgeTracking();
    } catch (e) {
      console.warn('Could not load bot settings:', e);
    }
  }

  // Initialize Turnstile generator integration
  console.log('🚀 WPlace Auto-Image with Turnstile Token Generator loaded');
  console.log('🔑 Turnstile token generator: ALWAYS ENABLED (Background mode)');
  console.log('🎯 Manual pixel captcha solving: Available as fallback/alternative');
  console.log('📱 Turnstile widgets: DISABLED - pure background token generation only!');

  // Generate fingerprint string for requests
  if (!window.WPlaceTokenManager) {
    console.error('❌ WPlaceTokenManager not available - dependency loading issue');
    return;
  }
  const fpStr32 = tokenManager._randStr(32);
  console.log('🔑 Generated fingerprint string for API requests');

  // Function to enable file operations after initial startup setup is complete
  function enableFileOperations() {
    state.initialSetupComplete = true;

    const loadBtn = document.querySelector('#loadBtn');
    const loadFromFileBtn = document.querySelector('#loadFromFileBtn');
    const uploadBtn = document.querySelector('#uploadBtn');

    if (loadBtn) {
      loadBtn.disabled = false;
      loadBtn.title = '';
      // Add a subtle animation to indicate the button is now available
      loadBtn.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (loadBtn) loadBtn.style.animation = '';
      }, 600);
      console.log('✅ Load Progress button enabled after initial setup');
    }

    if (loadFromFileBtn) {
      loadFromFileBtn.disabled = false;
      loadFromFileBtn.title = '';
      // Add a subtle animation to indicate the button is now available
      loadFromFileBtn.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (loadFromFileBtn) loadFromFileBtn.style.animation = '';
      }, 600);
      console.log('✅ Load from File button enabled after initial setup');
    }

    if (uploadBtn) {
      uploadBtn.disabled = false;
      uploadBtn.title = '';
      // Add a subtle animation to indicate the button is now available
      uploadBtn.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        if (uploadBtn) uploadBtn.style.animation = '';
      }, 600);
      console.log('✅ Upload Image button enabled after initial setup');
    }

    // Enable Load Extracted button at the same time as Upload button
    const loadExtractedBtn = document.getElementById('loadExtractedBtn');
    if (loadExtractedBtn) {
      loadExtractedBtn.disabled = false;
      loadExtractedBtn.title = '';
      console.log('✅ Load Extracted button enabled after initial setup');
    }

    // Show a notification that file operations are now available
    Utils.showAlert(Utils.t('fileOperationsAvailable'), 'success');
  }

  // Optimized token initialization with better timing and error handling
  async function initializeTokenGenerator() {
    // Skip if already have valid token
    if (isTokenValid()) {
      console.log('✅ Valid token already available, skipping initialization');
      updateUI('tokenReady', 'success');
      enableFileOperations(); // Enable file operations since initial setup is complete
      return;
    }

    try {
      console.log('🔧 Initializing Turnstile token generator...');
      updateUI('initializingToken', 'default');

      console.log('Attempting to load Turnstile script...');
      await Utils.loadTurnstile();
      console.log('Turnstile script loaded. Attempting to generate token...');

      // Use TokenManager's handleCaptchaWithRetry method instead
      const token = await tokenManager.handleCaptchaWithRetry();
      if (token) {
        setTurnstileToken(token);
        console.log('✅ Startup token generated successfully');
        updateUI('tokenReady', 'success');
        Utils.showAlert(Utils.t('tokenGeneratorReady'), 'success');
        enableFileOperations(); // Enable file operations since initial setup is complete
      } else {
        console.warn(
          '⚠️ Startup token generation failed (no token received), will retry when needed'
        );
        updateUI('tokenRetryLater', 'warning');
        // Still enable file operations even if initial token generation fails
        // Users can load progress and use manual/hybrid modes
        enableFileOperations();
      }
    } catch (error) {
      console.error('❌ Critical error during Turnstile initialization:', error); // More specific error
      updateUI('tokenRetryLater', 'warning');
      // Still enable file operations even if initial setup fails
      // Users can load progress and use manual/hybrid modes
      enableFileOperations();
      // Don't show error alert for initialization failures, just log them
    }
  }

  // Load theme preference immediately on startup before creating UI
  loadThemePreference();
  applyTheme();

  var pawtect_chunk = null;

  //find module if pawtect_chunk is null
  pawtect_chunk ??= await findTokenModule("pawtect_wasm_bg.wasm");

  async function createWasmToken(regionX, regionY, payload) {
    try {
      // Load the Pawtect module and WASM
      const mod = await import(new URL('/_app/immutable/chunks/' + pawtect_chunk, location.origin).href);
      let wasm;
      try {
        wasm = await mod._();
        console.log('✅ WASM initialized successfully');
      } catch (wasmError) {
        console.error('❌ WASM initialization failed:', wasmError);
        return null;
      }
      try {
        try {
          const me = await fetch(`https://backend.wplace.live/me`, { credentials: 'include' }).then(r => r.ok ? r.json() : null);
          if (me?.id) {
            mod.i(me.id);
            console.log('✅ user ID set:', me.id);
          }
        } catch { }
      } catch (userIdError) {
        console.log('⚠️ Error setting user ID:', userIdError.message);
      }
      try {
        const testUrl = `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`;
        if (mod.r) {
          mod.r(testUrl);
          console.log('✅ Request URL set:', testUrl);
        } else {
          console.log('⚠️ request_url function (mod.r) not available');
        }
      } catch (urlError) {
        console.log('⚠️ Error setting request URL:', urlError.message);
      }

      // Create test payload

      console.log('📝 payload:', payload);

      // Encode payload
      const enc = new TextEncoder();
      const dec = new TextDecoder();
      const bodyStr = JSON.stringify(payload);
      const bytes = enc.encode(bodyStr);
      console.log('📏 Payload size:', bytes.length, 'bytes');
      console.log('📄 Payload string:', bodyStr);

      // Allocate WASM memory with validation
      let inPtr;
      try {
        if (!wasm.__wbindgen_malloc) {
          console.error('❌ __wbindgen_malloc function not found');
          return null;
        }

        inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
        console.log('✅ WASM memory allocated, pointer:', inPtr);

        // Copy data to WASM memory
        const wasmBuffer = new Uint8Array(wasm.memory.buffer, inPtr, bytes.length);
        wasmBuffer.set(bytes);
        console.log('✅ Data copied to WASM memory');
      } catch (memError) {
        console.error('❌ Memory allocation error:', memError);
        return null;
      }

      // Call the WASM function
      console.log('🚀 Calling get_pawtected_endpoint_payload...');
      let outPtr, outLen, token;
      try {
        const result = wasm.get_pawtected_endpoint_payload(inPtr, bytes.length);
        console.log('✅ Function called, result type:', typeof result, result);

        if (Array.isArray(result) && result.length === 2) {
          [outPtr, outLen] = result;
          console.log('✅ Got output pointer:', outPtr, 'length:', outLen);

          // Decode the result
          const outputBuffer = new Uint8Array(wasm.memory.buffer, outPtr, outLen);
          token = dec.decode(outputBuffer);
          console.log('✅ Token decoded successfully');
        } else {
          console.error('❌ Unexpected function result format:', result);
          return null;
        }
      } catch (funcError) {
        console.error('❌ Function call error:', funcError);
        console.error('Stack trace:', funcError.stack);
        return null;
      }

      // Cleanup memory
      try {
        if (wasm.__wbindgen_free && outPtr && outLen) {
          wasm.__wbindgen_free(outPtr, outLen, 1);
          console.log('✅ Output memory freed');
        }
        if (wasm.__wbindgen_free && inPtr) {
          wasm.__wbindgen_free(inPtr, bytes.length, 1);
          console.log('✅ Input memory freed');
        }
      } catch (cleanupError) {
        console.log('⚠️ Cleanup warning:', cleanupError.message);
      }

      // Display results
      console.log('');
      console.log('🎉 SUCCESS!');
      console.log('🔑 Full token:');
      console.log(token);
      return token;
    } catch (error) {
      console.error('❌ Failed to generate fp parameter:', error);
      return null;
    }
  }

  async function findTokenModule(str) {
    console.log('🔎 Searching for wasm Module...');
    const links = Array.from(document.querySelectorAll('link[rel="modulepreload"][href$=".js"]'));

    for (const link of links) {
      try {
        const url = new URL(link.getAttribute("href"), location.origin).href;
        const code = await fetch(url).then(r => r.text());
        if (code.includes(str)) {
          console.log('✅ Found wasm Module...');
          return url.split('/').pop();
        }
      } catch { }
    }
    console.error(`❌ Could not find Pawtect chunk: `, error);
  }

  async function purchase(type) {
    // loadThemePreference()
    let id;
    let chargeMultiplier;
    if (type === "max_charges") {
      id = 70;
      chargeMultiplier = 5;
    } else if (type === "paint_charges") {
      id = 80;
      chargeMultiplier = 30;
    } else {
      console.error("Error: Invalid purchase type provided.");
      return;
    }
    const { droplets } = await WPlaceService.getCharges();
    console.log("There are currently : ", droplets, "droplets.");
    try {
      const amounts = Math.floor(droplets / 500);
      if (amounts < 1) {
        console.log("Not enough droplets to purchase.");
        return;
      }
      const payload = {
        "product": {
          "id": id,
          "amount": amounts
        }
      };
      const res = fetch("https://backend.wplace.live/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });
      // POST request completed
      const { droplets: newDroplets } = await WPlaceService.getCharges();
      if (droplets != newDroplets) {
        console.log("Successfully bought", amounts * chargeMultiplier, type.replace('_', ' '), ".");
        return 2;
      } else {
        console.log("Failed to buy charges");
        return 1;
      }
    } catch (e) {
      console.error("An error occurred during the purchase:", e);
      return 0;
    }
  }
  async function swapAccountTrigger(token) {
    // STRICT GUARD: Only allow account switching during active painting sessions OR controlled refresh
    if (!state.running && !state.isFetchingAllAccounts) {
      console.warn('🔒 Account switching blocked - only allowed during active painting or controlled refresh');
      console.warn('🔒 Current state.running:', state.running, 'state.isFetchingAllAccounts:', state.isFetchingAllAccounts);
      return false;
    }

    localStorage.removeItem("lp");
    if (!token) {
      console.error('❌ Cannot swap account: token is null or undefined');
      return false;
    }

    console.log(`🔄 Triggering account swap with token: ${token.substring(0, 20)}...`);
    console.log('📤 Sending setCookie message to extension...');

    try {
      window.postMessage({
        source: 'my-userscript',
        type: 'setCookie',
        value: token
      }, '*');

      console.log('✅ setCookie message sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send setCookie message:', error);
      return false;
    }
  }
  async function getAccounts() {
    return new Promise((resolve, reject) => {
      console.log("Requesting accounts from extension...");

      // Set timeout for extension response
      const timeout = setTimeout(() => {
        window.removeEventListener("message", handler);
        reject(new Error("Extension response timeout"));
      }, 15000); // 15 second timeout (increased from 5 seconds)

      // Ask extension for accounts
      window.postMessage({
        source: "my-userscript",
        type: "getAccounts"
      }, "*");

      function handler(event) {
        if (event.source !== window) return;
        if (event.data.source !== "extension") return;
        if (event.data.type === "accountsData") {
          // Clear timeout and remove listener when we get the response
          clearTimeout(timeout);
          window.removeEventListener("message", handler);
          
          try {
            localStorage.setItem("accounts", JSON.stringify(event.data.accounts));
            console.log("✅ Accounts saved to localStorage:", event.data.accounts);
          } catch (e) {
            console.error("❌ Failed to save accounts:", e);
          }
          resolve(event.data.accounts);
        }
      }
      window.addEventListener("message", handler);
    });
  }

  async function fetchAccount() {
    const { ID, Charges, Max, Droplets } = await WPlaceService.fetchCheck();
    console.log("User's ID :", ID);
    console.log("User's Charges :", Charges, "/", Max);
    console.log("User's Droplets :", Droplets);
  }

  async function fetchAllAccountDetails() {
    if (state.isFetchingAllAccounts) {
      Utils.showAlert("Already fetching account details.", "warning");
      return;
    }

    state.isFetchingAllAccounts = true;

    const refreshBtn = document.getElementById('refreshAllAccountsBtn');
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      refreshBtn.disabled = true;
    }

    const accountsListArea = document.getElementById('accountsListArea');
    if (accountsListArea) {
      accountsListArea.innerHTML = `<div class="wplace-stat-item" style="opacity: 0.5;">Loading accounts...</div>`;
    }

    try {
      // First, get accounts from the extension
      console.log(`🔄 [FETCH] Requesting accounts from extension...`);
      try {
        await getAccounts();
        console.log(`✅ [FETCH] Successfully retrieved accounts from extension`);
      } catch (error) {
        console.warn(`⚠️ [FETCH] Failed to get accounts from extension:`, error);
        // Continue anyway in case we have cached accounts
      }

      // Load accounts using the new AccountManager
      await accountManager.loadAccounts();

      console.log(`✅ [FETCH] Loaded ${accountManager.getAccountCount()} accounts from storage`);

      // Debug: Check if we actually have accounts
      if (accountManager.getAccountCount() === 0) {
        console.warn(`⚠️ [FETCH] No accounts found in storage. Check localStorage 'accounts' and chrome.storage 'infoAccounts'`);

        // Check localStorage for accounts
        const localStorageAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
        console.log(`📋 [DEBUG] localStorage accounts:`, localStorageAccounts);

        // Render empty state and return early
        renderAccountsList();
        return;
      }

      // Now fetch fresh data for each account
      const accounts = accountManager.getAllAccounts();
      if (accounts.length > 0) {
        console.log(`🔄 [FETCH] Fetching fresh data for ${accounts.length} accounts...`);

        // Remember the current account so we can switch back
        const originalCurrentAccount = accounts.find(acc => acc.isCurrent);

        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i];
          console.log(`📊 [FETCH] Fetching data for account ${i + 1}: ${account.displayName}`);

          try {
            // Switch to this account temporarily to fetch its data
            console.log(`🔄 [FETCH] Switching to ${account.displayName} to fetch fresh data...`);
            await switchToSpecificAccount(account.token, account.displayName);
            await Utils.sleep(500); // Small delay to ensure switch takes effect

            // Fetch fresh account details
            const accountData = await WPlaceService.getCharges();
            const accountInfo = await WPlaceService.fetchCheck();

            // Update account with fresh data
            accountManager.updateAccountData(account.token, {
              ID: accountData.id || accountInfo.ID,
              Charges: Math.floor(accountData.charges || 0),
              Max: Math.floor(accountData.max || 0),
              Droplets: Math.floor(accountData.droplets || 0),
              displayName: accountInfo.Username || accountInfo.name || account.displayName
            });

            console.log(`✅ [FETCH] Updated ${account.displayName}: ⚡${Math.floor(accountData.charges)}/${Math.floor(accountData.max)} 💧${Math.floor(accountData.droplets)}`);

          } catch (error) {
            console.warn(`⚠️ [FETCH] Failed to fetch data for ${account.displayName}:`, error);
          }
        }

        // Switch back to the original current account if there was one
        if (originalCurrentAccount) {
          console.log(`🔙 [FETCH] Switching back to original current account: ${originalCurrentAccount.displayName}`);
          try {
            await switchToSpecificAccount(originalCurrentAccount.token, originalCurrentAccount.displayName);
            await Utils.sleep(300);

            // Mark it as current again
            accountManager.updateAccountData(originalCurrentAccount.token, {
              isCurrent: true
            });
          } catch (error) {
            console.warn(`⚠️ [FETCH] Failed to switch back to original account:`, error);
          }
        }

        console.log(`🎯 [FETCH] Completed fetching fresh data for all accounts`);
      }

      // Render the accounts list with fresh data
      renderAccountsList();

    } catch (error) {
      console.error('❌ [FETCH] Error fetching account details:', error);
      if (accountsListArea) {
        accountsListArea.innerHTML = `<div class="wplace-stat-item" style="color: red;">Error loading accounts.</div>`;
      }
    } finally {
      state.isFetchingAllAccounts = false;
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-users-cog"></i>';
        refreshBtn.disabled = false;
      }
    }
  }

  // Function to update current account charges in the account list
  async function updateCurrentAccountInList() {
    if (accountManager.getAccountCount() === 0) return;

    // Find current account in the list and update its charges
    const currentAccount = accountManager.getCurrentAccount();
    if (currentAccount) {
      const { charges, cooldown, droplets } = await WPlaceService.getCharges();
      state.displayCharges = Math.floor(charges);
      state.preciseCurrentCharges = charges;
      await updateStats();

      // Update the current account data in AccountManager
      accountManager.updateAccountData(currentAccount.token, {
        Charges: Math.floor(state.displayCharges || state.preciseCurrentCharges || 0),
        Max: state.maxCharges,
        Droplets: Math.floor(droplets)
      });

      // Re-render the account list to show updated charges
      renderAccountsList();
    }
  }

  // Function to update current account spotlight when switching during painting
  async function updateCurrentAccountSpotlight() {
    if (accountManager.getAccountCount() === 0) return;
    await Utils.sleep(500); // Wait a bit for the switch to take effect
    try {
      const currentAccountData = await WPlaceService.getCharges();
      console.log("Current account after switch:", currentAccountData);
      console.log(`🔍 Switched to account with ID: ${currentAccountData.id}`);

      // Find the current account in AccountManager and update it
      const accounts = accountManager.getAllAccounts();
      const currentAccount = accounts.find(acc => acc.ID === currentAccountData.id);

      if (currentAccount) {
        const currentAccountInfo = await WPlaceService.fetchCheck();

        // Update account data in AccountManager
        accountManager.updateAccountData(currentAccount.token, {
          isCurrent: true,
          Charges: Math.floor(currentAccountData.charges),
          Max: Math.floor(currentAccountData.max),
          Droplets: Math.floor(currentAccountData.droplets),
          displayName: currentAccountInfo.Username || currentAccountInfo.name || currentAccount.displayName
        });

        console.log(`🎯 Updated current account spotlight: ${currentAccount.displayName}`);

        // Check for autobuy after account is loaded
        if (CONFIG.autoBuyToggle && Math.floor(currentAccountData.droplets) > 500) {
          console.log(`💰 Account has ${Math.floor(currentAccountData.droplets)} droplets (>500), triggering autobuy...`);
          try {
            const purchaseResult = await purchase(CONFIG.autoBuy);
            if (purchaseResult == 2) {
              console.log('✅ Autobuy successful after account switch');
              // Update charges after purchase
              const updatedCharges = await WPlaceService.getCharges();
              accountManager.updateAccountData(currentAccount.token, {
                Charges: Math.floor(updatedCharges.charges),
                Droplets: Math.floor(updatedCharges.droplets)
              });
              // Re-render account list to show updated status after purchase
              renderAccountsList();
            } else {
              console.log('❌ Autobuy failed after account switch');
            }
          } catch (error) {
            console.error('❌ Error during autobuy after account switch:', error);
          }
        } else if (CONFIG.autoBuyToggle) {
          console.log(`💰 Account has ${Math.floor(currentAccountData.droplets)} droplets (≤500), skipping autobuy`);
        }

        // Re-render the account list to show new current account
        renderAccountsList();

        console.log(`🔒 PRESERVING currentActiveIndex: ${state.currentActiveIndex} (do not recalculate from isCurrent flag)`);
        console.log(`� Account at currentActiveIndex ${state.currentActiveIndex}: ${state.originalAccountOrder[state.currentActiveIndex]?.displayName} (ID ${state.originalAccountOrder[state.currentActiveIndex]?.orderId})`);

        // Update accountIndex to match original array position
        const originalArrayIndex = state.allAccountsInfo.findIndex(acc => acc.isCurrent);
        if (originalArrayIndex !== -1) {
          state.accountIndex = originalArrayIndex;
        }

        console.log(`📊 Final state: activeIndex=${state.currentActiveIndex}, accountIndex=${state.accountIndex}, orderId=${newCurrentAccount.orderId}`);

        console.warn(`⚠️ Could not find account ID ${newCurrentAccount.orderId} in switching order`);

        console.warn(`⚠️ Could not find switched account with ID ${currentAccountData.id} in account list`);
      }

      // Re-render the account list to show new current account
      renderAccountsList();

    } catch (error) {
      console.warn('⚠️ Failed to update account spotlight:', error);
    }
  }

  function renderAccountsList() {
    const accountsListArea = document.getElementById('accountsListArea');
    if (!accountsListArea) return;

    accountsListArea.innerHTML = '';

    const accounts = accountManager.getAllAccounts();
    console.log(`🔍 [RENDER] Rendering ${accounts.length} accounts`);

    // Debug: Log account data to see what we're working with
    accounts.forEach((account, index) => {
      console.log(`📊 [RENDER] Account ${index + 1}: ${account.displayName} - ⚡${account.Charges}/${account.Max} 💧${account.Droplets} ${account.isCurrent ? '(CURRENT)' : ''}`);
    });

    if (accounts.length === 0) {
      // Don't show any placeholder - just leave empty
      console.log(`📝 [RENDER] No accounts to display`);
      return;
    }

    accounts.forEach((account, index) => {
      const item = createAccountItem(account, index);
      accountsListArea.appendChild(item);
    });

    console.log(`✅ [RENDER] Successfully rendered ${accounts.length} accounts`);
  }

  function createAccountItem(account, index) {
    const item = document.createElement('div');

    // Determine if this is the current account
    const isCurrentAccount = account.isCurrent;
    const isNextInSequence = accountManager.currentIndex !== -1 &&
      ((accountManager.currentIndex + 1) % accountManager.getAccountCount()) === index;

    let itemClasses = 'wplace-account-item';
    if (isCurrentAccount) {
      itemClasses += ' current';
    } else if (isNextInSequence) {
      itemClasses += ' next-in-sequence';
    }

    item.className = itemClasses;

    // Create ordering number element with 1-based index for user display
    const orderNumber = document.createElement('div');
    orderNumber.className = 'wplace-account-number';
    orderNumber.textContent = index + 1; // Show 1-based index for user-friendly display

    // Add visual indicator for current position in sequence
    if (isCurrentAccount) {
      orderNumber.style.background = '#2ecc71'; // Green color
      orderNumber.style.color = 'white';
      orderNumber.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.8)';
    } else if (isNextInSequence) {
      orderNumber.style.background = '#f39c12'; // Orange color for next
      orderNumber.style.color = 'white';
      orderNumber.style.boxShadow = '0 0 8px rgba(243, 156, 18, 0.6)';
    }

    // Create account details
    const details = document.createElement('div');
    details.className = 'wplace-account-details';

    const accountName = document.createElement('div');
    accountName.className = 'wplace-account-name';
    const displayName = account.displayName || account.name || `Account ${index + 1}`;
    accountName.textContent = displayName;
    accountName.title = displayName;

    const accountStats = document.createElement('div');
    accountStats.className = 'wplace-account-stats';

    // Safely handle undefined values
    const charges = account.Charges !== undefined ? Math.floor(account.Charges) : 0;
    const max = account.Max !== undefined ? Math.floor(account.Max) : 0;
    const droplets = account.Droplets !== undefined ? Math.floor(account.Droplets) : 0;

    accountStats.innerHTML = `
      <span><i class="fas fa-bolt"></i> ${charges}/${max}</span>
      <span><i class="fas fa-tint"></i> ${droplets}</span>
    `;

    details.appendChild(accountName);
    details.appendChild(accountStats);

    // Add status indicators
    const status = document.createElement('div');
    status.className = 'wplace-account-status';
    if (isCurrentAccount) {
      status.innerHTML = '<i class="fas fa-play-circle" style="color: #2ecc71;" title="Current Account"></i>';
    } else if (isNextInSequence) {
      status.innerHTML = '<i class="fas fa-arrow-right" style="color: #f39c12;" title="Next Account"></i>';
    }

    item.appendChild(orderNumber);
    item.appendChild(details);
    item.appendChild(status);

    return item;
  }

  // SIMPLIFIED ACCOUNT SWITCHING
  async function switchToNextAccount(accounts) {
    console.log(`🔄 [SWITCH] Starting account switch`);

    // Validate we have accounts
    if (accountManager.getAccountCount() === 0) {
      console.error('❌ No accounts available for switching');
      return false;
    }

    // Get next account using simplified manager
    const nextAccount = accountManager.switchToNext();
    if (!nextAccount) {
      console.error('❌ Failed to get next account');
      return false;
    }

    console.log(`🎯 [SWITCH] Switching to: ${nextAccount.displayName} (index ${accountManager.currentIndex})`);

    // Ensure token exists
    if (!nextAccount.token) {
      console.error(`❌ Missing token for account: ${nextAccount.displayName}`);
      return false;
    }

    console.log(`� [SWITCH] Using token: ${nextAccount.token.substring(0, 20)}...`);

    // Perform the account switch
    try {
      await swapAccountTrigger(nextAccount.token);

      // Update account index for backward compatibility
      state.accountIndex = accountManager.currentIndex;

      console.log(`✅ [SWITCH] Successfully switched to ${nextAccount.displayName}`);

      // Wait a moment for the switch to fully complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the account status and UI after successful switch
      await updateCurrentAccountSpotlight();

      return true;
    } catch (error) {
      console.error('❌ [SWITCH] Account switch failed:', error);
      return false;
    }
  }

  // SIMPLIFIED helper function for specific account switching
  async function switchToSpecificAccount(token, accountName) {
    console.log(`🔄 [SPECIFIC SWITCH] Attempting to switch to account: ${accountName}`);
    console.log(`🔑 [SPECIFIC SWITCH] Using token: ${token.substring(0, 20)}...`);

    await swapAccountTrigger(token);

    let maxRetries = 20;
    let retryCount = 0;
    let swapSuccess = false;

    while (!swapSuccess && retryCount < maxRetries) {
      console.log(`⏳ [SPECIFIC SWITCH] Waiting for account swap... (Attempt ${retryCount + 1}/${maxRetries})`);
      //await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        await fetchAccount();
        console.log('✅ [SPECIFIC SWITCH] Account swap confirmed.');
        swapSuccess = true;
      } catch (error) {
        console.warn('❌ [SPECIFIC SWITCH] Account swap not yet successful. Retrying...', error);
        retryCount++;

        if (retryCount % 5 === 0) {
          console.log('🔄 [SPECIFIC SWITCH] Re-triggering account swap...');
          await swapAccountTrigger(token);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    if (swapSuccess) {
      const { charges, cooldown } = await WPlaceService.getCharges();
      state.displayCharges = Math.floor(charges);
      state.preciseCurrentCharges = charges;
      state.cooldown = cooldown;
      Utils.performSmartSave();
      await updateStats();

      // Update account data in manager
      accountManager.updateAccountData({ charges, cooldown });

      // Update the account status and UI after successful switch
      await updateCurrentAccountSpotlight();

      console.log(`✅ [SPECIFIC SWITCH] Successfully switched to ${accountName} with ${Math.floor(charges)} charges`);
      return true;
    } else {
      console.error(`❌ [SPECIFIC SWITCH] Failed to swap to ${accountName} after multiple retries.`);
      return false;
    }
  }

  // Wait for dependencies before initializing UI
  async function waitForDependenciesAndInitialize() {
    // Wait for all global managers to be available
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    while (attempts < maxAttempts) {
      const managers = {
        utilsManager: window.globalUtilsManager,
        imageProcessor: window.globalImageProcessor,
        overlayManager: window.globalOverlayManager,
        tokenManager: window.globalTokenManager
      };

      const missingManagers = Object.entries(managers)
        .filter(([name, manager]) => !manager)
        .map(([name]) => name);

      if (missingManagers.length === 0) {
        console.log('✅ All global managers are available, initializing UI...');
        break;
      }

      console.log(`⏳ Waiting for managers: ${missingManagers.join(', ')} (attempt ${attempts + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.warn('⚠️ Some global managers not available after waiting, proceeding anyway...');
      console.log('Available managers:', {
        utilsManager: !!window.globalUtilsManager,
        imageProcessor: !!window.globalImageProcessor,
        overlayManager: !!window.globalOverlayManager,
        tokenManager: !!window.globalTokenManager
      });
    }

    return createUI();
  }

  waitForDependenciesAndInitialize().then(() => {
    // Generate token automatically after UI is ready
    setTimeout(initializeTokenGenerator, 1000);

    // Quick initial account load from cache
    setTimeout(async () => {
      console.log('🔄 Initial account load from cache...');
      try {
        await accountManager.loadAccounts();
        if (accountManager.getAccountCount() > 0) {
          console.log(`✅ Loaded ${accountManager.getAccountCount()} cached accounts`);
          renderAccountsList();
        } else {
          console.log('📭 No cached accounts found');
        }
      } catch (error) {
        console.warn('⚠️ Initial account load failed:', error);
      }
    }, 500);

    // Auto-refresh account list on startup (with extension communication)
    setTimeout(() => {
      console.log('🔄 Auto-refreshing account list on startup...');
      fetchAllAccountDetails();
    }, 2000);

    // Attach advanced color matching listeners (resize dialog)
    const advancedInit = () => {
      const chromaSlider = document.getElementById('chromaPenaltyWeightSlider');
      const chromaValue = document.getElementById('chromaWeightValue');
      const resetBtn = document.getElementById('resetAdvancedColorBtn');
      const algoSelect = document.getElementById('colorAlgorithmSelect');
      const chromaToggle = document.getElementById('enableChromaPenaltyToggle');
      const transInput = document.getElementById('transparencyThresholdInput');
      const whiteInput = document.getElementById('whiteThresholdInput');
      const ditherToggle = document.getElementById('enableDitheringToggle');
	  const invertColorBtn = document.getElementById('enableInvertColor');
      if (algoSelect)
        algoSelect.addEventListener('change', (e) => {
          state.colorMatchingAlgorithm = e.target.value;
          saveBotSettings();
          _updateResizePreview();
        });
      if (chromaToggle)
        chromaToggle.addEventListener('change', (e) => {
          state.enableChromaPenalty = e.target.checked;
          saveBotSettings();
          _updateResizePreview();
        });
      if (chromaSlider && chromaValue)
        chromaSlider.addEventListener('input', (e) => {
          state.chromaPenaltyWeight = parseFloat(e.target.value) || 0.15;
          chromaValue.textContent = state.chromaPenaltyWeight.toFixed(2);
          saveBotSettings();
          _updateResizePreview();
        });
      if (transInput)
        transInput.addEventListener('change', (e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= 0 && v <= 255) {
            state.customTransparencyThreshold = v;
            CONFIG.TRANSPARENCY_THRESHOLD = v;
            saveBotSettings();
            _updateResizePreview();
          }
        });
      if (whiteInput)
        whiteInput.addEventListener('change', (e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v >= 200 && v <= 255) {
            state.customWhiteThreshold = v;
            CONFIG.WHITE_THRESHOLD = v;
            saveBotSettings();
            _updateResizePreview();
          }
        });
      if (ditherToggle)
        ditherToggle.addEventListener('change', (e) => {
          state.ditheringEnabled = e.target.checked;
          saveBotSettings();
          _updateResizePreview();
        });
      if (invertColorBtn)
		invertColorBtn.addEventListener('click', () => {
          state.invertColorEnabled = e.target.checked;
		  state.enableChromaPenalty = true;
	    });
      if (resetBtn)
        resetBtn.addEventListener('click', () => {
          state.colorMatchingAlgorithm = 'lab';
          state.enableChromaPenalty = true;
          state.chromaPenaltyWeight = 0.15;
          state.customTransparencyThreshold = CONFIG.TRANSPARENCY_THRESHOLD = 100;
          state.customWhiteThreshold = CONFIG.WHITE_THRESHOLD = 250;
          saveBotSettings();
          const a = document.getElementById('colorAlgorithmSelect');
          if (a) a.value = 'lab';
          const ct = document.getElementById('enableChromaPenaltyToggle');
          if (ct) ct.checked = true;
          if (chromaSlider) chromaSlider.value = 0.15;
          if (chromaValue) chromaValue.textContent = '0.15';
          if (transInput) transInput.value = 100;
          if (whiteInput) whiteInput.value = 250;
          _updateResizePreview();
          Utils.showAlert(Utils.t('advancedColorSettingsReset'), 'success');
		});
    };
    // Delay to ensure resize UI built
    setTimeout(advancedInit, 500);

    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
      Utils.cleanupTurnstile();
    });
  });
})();