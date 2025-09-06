// WPlace Auto-Image Bot - Theme System Module
// Extracted from Auto-Image.js as part of Phase 2 code restructuring

import { EMBEDDED_THEMES } from 'embedded-assets';
import { CONFIG, getCurrentTheme } from './config.js';

/**
 * Get list of available theme names.
 * @returns {Array<string>} Array of theme names
 */
export const getAvailableThemes = () => Object.keys(EMBEDDED_THEMES);

/**
 * Get the current active theme object.
 * @returns {Object} Current theme object
 */
export { getCurrentTheme };

/**
 * Get the current active theme name.
 * @returns {string} Current theme name
 */
export const getCurrentThemeName = () => CONFIG.currentTheme;

/**
 * Switch to a different theme by name.
 * @param {string} themeName - The name of the theme to switch to
 */
export const switchTheme = themeName => {
    if (CONFIG.THEMES[themeName]) {
        CONFIG.currentTheme = themeName;
        saveThemePreference();

        // APPLY THEME VARS/CLASS (new)
        applyTheme();

        // Note: UI recreation is handled by the main application
        // The calling code should handle createUI() if needed
    }
};

/**
 * Apply the current theme to the document by setting CSS classes and variables.
 * Updates the document element classes and injects theme-specific CSS.
 */
export function applyTheme() {
    const theme = getCurrentTheme();
    // Toggle theme class on documentElement so CSS vars cascade to our UI
    document.documentElement.classList.remove(
        'wplace-theme-classic',
        'wplace-theme-classic-light',
        'wplace-theme-neon'
    );

    // Map CONFIG theme names to CSS class names
    const themeClassMapping = {
        'Classic Autobot': 'wplace-theme-classic',
        'Classic Light': 'wplace-theme-classic-light',
        'Neon Retro': 'wplace-theme-neon',
    };

    const themeClass =
        themeClassMapping[CONFIG.currentTheme] || 'wplace-theme-classic';

    document.documentElement.classList.add(themeClass);

    // Inject embedded theme CSS
    const existingThemeStyle = document.getElementById('wplace-theme-css');
    if (existingThemeStyle) {
        existingThemeStyle.remove();
    }

    // Inject new theme CSS from embedded themes
    const themeName = getCurrentThemeName();
    // Map CONFIG theme names to embedded theme file names
    const themeFileMapping = {
        'Classic Autobot': 'classic',
        'Classic Light': 'classic-light',
        'Neon Retro': 'neon',
    };

    const themeFileName = themeFileMapping[themeName] || 'classic';
    if (EMBEDDED_THEMES[themeFileName]) {
        const style = document.createElement('style');
        style.id = 'wplace-theme-css';
        style.textContent = EMBEDDED_THEMES[themeFileName];
        document.head.appendChild(style);
    }

    // Also set CSS variables explicitly in case you want runtime overrides
    const root = document.documentElement;
    const setVar = (k, v) => {
        try {
            root.style.setProperty(k, v);
        } catch {}
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
    setVar(
        '--wplace-font',
        theme.fontFamily || "'Segoe UI', Roboto, sans-serif"
    );
    setVar('--wplace-radius', '' + (theme.borderRadius || '12px'));
    setVar('--wplace-border-style', '' + (theme.borderStyle || 'solid'));
    setVar('--wplace-border-width', '' + (theme.borderWidth || '1px'));
    setVar(
        '--wplace-backdrop',
        '' + (theme.backdropFilter || 'blur(10px)')
    );
    setVar('--wplace-border-color', 'rgba(255,255,255,0.1)');
}

/**
 * Save the current theme preference to localStorage.
 */
export const saveThemePreference = () => {
    try {
        localStorage.setItem('wplace-theme', CONFIG.currentTheme);
    } catch (e) {
        console.warn('Could not save theme preference:', e);
    }
};

/**
 * Load the saved theme preference from localStorage.
 */
export const loadThemePreference = () => {
    try {
        const saved = localStorage.getItem('wplace-theme');
        if (saved && CONFIG.THEMES[saved]) {
            CONFIG.currentTheme = saved;
        }
    } catch (e) {
        console.warn('Could not load theme preference:', e);
    }
};