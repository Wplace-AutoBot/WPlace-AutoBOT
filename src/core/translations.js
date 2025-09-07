// Translation System for WPlace Auto-Image Bot
// Extracted from Auto-Image.js for better modularity

import { EMBEDDED_LANGUAGES } from 'embedded-assets';

// Translation cache and state
const translationCache = new Map();
let loadedTranslations = {};
let currentLanguage = 'en';

// Available languages
export const AVAILABLE_LANGUAGES = [
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
        initMessage: "Click 'Upload Image' to begin",
    },
};

// Simple user notification function for critical issues
const showTranslationWarning = message => {
    try {
        // Create a simple temporary notification banner
        const warning = document.createElement('div');
        warning.className = 'wplace-warning-banner';
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

/**
 * Load translations for a specific language from embedded assets.
 * @param {string} language - The language code to load (e.g., 'en', 'ru', 'pt')
 * @param {number} [retryCount=0] - Current retry attempt count
 * @returns {Promise<Object|null>} The loaded translations object or null if failed
 */
export const loadTranslations = async (language, retryCount = 0) => {
    if (loadedTranslations[language]) {
        return loadedTranslations[language];
    }

    // Load translations from embedded assets
    if (EMBEDDED_LANGUAGES[language]) {
        const translations = EMBEDDED_LANGUAGES[language];

        // Validate that translations is an object with keys
        if (
            typeof translations === 'object' &&
            translations !== null &&
            Object.keys(translations).length > 0
        ) {
            loadedTranslations[language] = translations;
            console.log(
                `📚 Loaded ${language} translations successfully from embedded assets (${
                    Object.keys(translations).length
                } keys)`
            );
            return translations;
        } else {
            console.warn(`❌ Invalid translation format for ${language}`);
        }
    } else {
        console.warn(`❌ Language ${language} not found in embedded assets`);
    }

    return null;
};

/**
 * Load and set the user's language preference.
 * Checks saved preference, browser locale, and falls back to English.
 * @param {Object} state - The global state object containing language property
 * @returns {Promise<string>} The selected language code
 */
export const loadLanguagePreference = async state => {
    const savedLanguage = localStorage.getItem('wplace_language');
    const browserLocale = navigator.language;
    const browserLanguage = browserLocale.split('-')[0];

    let selectedLanguage = 'en'; // Default fallback

    try {
        // Check if we have the saved language available
        if (savedLanguage && AVAILABLE_LANGUAGES.includes(savedLanguage)) {
            selectedLanguage = savedLanguage;
            console.log(
                `🔄 Using saved language preference: ${selectedLanguage}`
            );
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
            console.log(
                `🔄 No matching language found, using English fallback`
            );
        }

        // Set the language in state and current language
        state.language = selectedLanguage;
        currentLanguage = selectedLanguage;

        // Only load translations if not already loaded and not English (which should already be loaded)
        if (
            selectedLanguage !== 'en' &&
            !loadedTranslations[selectedLanguage]
        ) {
            const loaded = await loadTranslations(selectedLanguage);
            if (!loaded) {
                console.warn(
                    `⚠️ Failed to load ${selectedLanguage} translations, falling back to English`
                );
                state.language = 'en';
                currentLanguage = 'en';
                localStorage.setItem('wplace_language', 'en');
            }
        }
    } catch (error) {
        console.error(`❌ Error in loadLanguagePreference:`, error);
        state.language = 'en'; // Always ensure we have a valid language
        currentLanguage = 'en';
    }

    return selectedLanguage;
};

/**
 * Initialize the translation system by loading English fallback and user preference.
 * @param {Object} state - The global state object containing language property
 * @returns {Promise<void>}
 */
export const initializeTranslations = async state => {
    try {
        console.log('🌐 Initializing translation system...');

        // Always ensure English is loaded as fallback first
        if (!loadedTranslations['en']) {
            const englishLoaded = await loadTranslations('en');
            if (!englishLoaded) {
                console.warn(
                    '⚠️ Failed to load English translations from CDN, using fallback'
                );
                showTranslationWarning(
                    '⚠️ Translation loading failed, using basic fallbacks'
                );
            }
        }

        // Then load user's language preference
        await loadLanguagePreference(state);

        console.log(
            `✅ Translation system initialized. Active language: ${state.language}`
        );
    } catch (error) {
        console.error('❌ Translation initialization failed:', error);
        // Ensure state has a valid language even if loading fails
        if (!state.language) {
            state.language = 'en';
            currentLanguage = 'en';
        }
        console.warn(
            '⚠️ Using fallback translations due to initialization failure'
        );
        showTranslationWarning(
            '⚠️ Translation system error, using basic English'
        );
    }
};

/**
 * Get translated text for a given key with fallback support.
 * Falls back through: current language → English → hardcoded fallback → key itself.
 * @param {string} key - The translation key to look up
 * @param {Object} [replacements={}] - Object with placeholder replacements like {count: 5}
 * @param {Object} state - The global state object containing language property
 * @returns {string} The translated text or the key if no translation found
 */
export const getText = (key, replacements = {}, state) => {
    const currentLang = state?.language || currentLanguage;

    // Try current language first
    let text = loadedTranslations[currentLang]?.[key];

    // Fallback to English translations
    if (!text && currentLang !== 'en') {
        text = loadedTranslations['en']?.[key];
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
    return Object.entries(replacements).reduce(
        (result, [placeholder, value]) => {
            return result.replace(
                new RegExp(`\\{${placeholder}\\}`, 'g'),
                value
            );
        },
        text
    );
};

/**
 * Fast cached translation function for UI rendering.
 * @param {string} key - The translation key to look up
 * @param {Object} [params={}] - Object with placeholder replacements like {count: 5}
 * @param {Object} state - The global state object containing language property
 * @returns {string} The translated text
 */
export const t = (key, params = {}, state) => {
    const currentLang = state?.language || currentLanguage;

    // Try to get from cache first
    const cacheKey = `${currentLang}_${key}`;
    if (translationCache.has(cacheKey)) {
        let text = translationCache.get(cacheKey);
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    // Try dynamically loaded translations (already loaded)
    if (loadedTranslations[currentLang]?.[key]) {
        let text = loadedTranslations[currentLang][key];
        // Cache for future use
        translationCache.set(cacheKey, text);
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    // Fallback to English if current language failed
    if (currentLang !== 'en' && loadedTranslations['en']?.[key]) {
        let text = loadedTranslations['en'][key];
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    // Final fallback to emergency fallback or key
    let text =
        FALLBACK_TEXT[currentLang]?.[key] || FALLBACK_TEXT.en?.[key] || key;
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    // Log missing translations for debugging
    if (text === key && key !== 'undefined') {
        console.warn(
            `⚠️ Missing translation for key: ${key} (language: ${currentLang})`
        );
    }

    return text;
};

/**
 * Get the current language code.
 * @returns {string} The current language code
 */
export const getCurrentLanguage = () => currentLanguage;

/**
 * Set the current language and update localStorage.
 * @param {string} language - The language code to set
 * @param {Object} state - The global state object containing language property
 * @returns {Promise<boolean>} True if language was set successfully
 */
export const setLanguage = async (language, state) => {
    if (AVAILABLE_LANGUAGES.includes(language)) {
        currentLanguage = language;
        if (state) {
            state.language = language;
        }
        localStorage.setItem('wplace_language', language);

        // Load translations if needed
        if (language !== 'en' && !loadedTranslations[language]) {
            await loadTranslations(language);
        }

        // Clear cache when language changes
        translationCache.clear();

        return true;
    }
    return false;
};
