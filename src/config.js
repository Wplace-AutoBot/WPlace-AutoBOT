// CONFIGURATION CONSTANTS
export const CONFIG = {
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
    PAINTING_SPEED_ENABLED: false, // On by default
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
        OPACITY_DEFAULT: 0.2,
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
        10: {
            id: 11,
            name: 'Light Yellow',
            rgb: { r: 255, g: 250, b: 188 },
        },
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
        22: {
            id: 22,
            name: 'Light Indigo',
            rgb: { r: 153, g: 177, b: 251 },
        },
        23: { id: 23, name: 'Dark Purple', rgb: { r: 120, g: 12, b: 153 } },
        24: { id: 24, name: 'Purple', rgb: { r: 170, g: 56, b: 185 } },
        25: {
            id: 25,
            name: 'Light Purple',
            rgb: { r: 224, g: 159, b: 249 },
        },
        26: { id: 26, name: 'Dark Pink', rgb: { r: 203, g: 0, b: 122 } },
        27: { id: 27, name: 'Pink', rgb: { r: 236, g: 31, b: 128 } },
        28: { id: 28, name: 'Light Pink', rgb: { r: 243, g: 141, b: 169 } },
        29: { id: 29, name: 'Dark Brown', rgb: { r: 104, g: 70, b: 52 } },
        30: { id: 30, name: 'Brown', rgb: { r: 149, g: 104, b: 42 } },
        31: { id: 31, name: 'Beige', rgb: { r: 248, g: 178, b: 119 } },
        32: {
            id: 52,
            name: 'Light Beige',
            rgb: { r: 255, g: 197, b: 165 },
        },
        33: {
            id: 32,
            name: 'Medium Gray',
            rgb: { r: 170, g: 170, b: 170 },
        },
        34: { id: 33, name: 'Dark Red', rgb: { r: 165, g: 14, b: 30 } },
        35: { id: 34, name: 'Light Red', rgb: { r: 250, g: 128, b: 114 } },
        36: { id: 35, name: 'Dark Orange', rgb: { r: 228, g: 92, b: 26 } },
        37: {
            id: 37,
            name: 'Dark Goldenrod',
            rgb: { r: 156, g: 132, b: 49 },
        },
        38: { id: 38, name: 'Goldenrod', rgb: { r: 197, g: 173, b: 49 } },
        39: {
            id: 39,
            name: 'Light Goldenrod',
            rgb: { r: 232, g: 212, b: 95 },
        },
        40: { id: 40, name: 'Dark Olive', rgb: { r: 74, g: 107, b: 58 } },
        41: { id: 41, name: 'Olive', rgb: { r: 90, g: 148, b: 74 } },
        42: {
            id: 42,
            name: 'Light Olive',
            rgb: { r: 132, g: 197, b: 115 },
        },
        43: { id: 43, name: 'Dark Cyan', rgb: { r: 15, g: 121, b: 159 } },
        44: { id: 45, name: 'Light Blue', rgb: { r: 125, g: 199, b: 255 } },
        45: { id: 46, name: 'Dark Indigo', rgb: { r: 77, g: 49, b: 184 } },
        46: {
            id: 47,
            name: 'Dark Slate Blue',
            rgb: { r: 74, g: 66, b: 132 },
        },
        47: { id: 48, name: 'Slate Blue', rgb: { r: 122, g: 113, b: 196 } },
        48: {
            id: 49,
            name: 'Light Slate Blue',
            rgb: { r: 181, g: 174, b: 241 },
        },
        49: { id: 53, name: 'Dark Peach', rgb: { r: 155, g: 82, b: 73 } },
        50: { id: 54, name: 'Peach', rgb: { r: 209, g: 128, b: 120 } },
        51: {
            id: 55,
            name: 'Light Peach',
            rgb: { r: 250, g: 182, b: 164 },
        },
        52: { id: 50, name: 'Light Brown', rgb: { r: 219, g: 164, b: 99 } },
        53: { id: 56, name: 'Dark Tan', rgb: { r: 123, g: 99, b: 82 } },
        54: { id: 57, name: 'Tan', rgb: { r: 156, g: 132, b: 107 } },
        55: { id: 36, name: 'Light Tan', rgb: { r: 214, g: 181, b: 148 } },
        56: { id: 51, name: 'Dark Beige', rgb: { r: 209, g: 128, b: 81 } },
        57: { id: 61, name: 'Dark Stone', rgb: { r: 109, g: 100, b: 63 } },
        58: { id: 62, name: 'Stone', rgb: { r: 148, g: 140, b: 107 } },
        59: {
            id: 63,
            name: 'Light Stone',
            rgb: { r: 205, g: 197, b: 158 },
        },
        60: { id: 58, name: 'Dark Slate', rgb: { r: 51, g: 57, b: 65 } },
        61: { id: 59, name: 'Slate', rgb: { r: 109, g: 117, b: 141 } },
        62: {
            id: 60,
            name: 'Light Slate',
            rgb: { r: 179, g: 185, b: 209 },
        },
        63: { id: 0, name: 'Transparent', rgb: null },
    }, // --- END: Color data ---
    // CSS Classes moved to src/auto-image-styles.css
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
            boxShadow:
                '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            animations: {
                glow: false,
                scanline: false,
                'pixel-blink': false,
            },
        },
        'Classic Light': {
            primary: '#ffffff',
            secondary: '#f8f9fa',
            accent: '#e9ecef',
            text: '#212529',
            highlight: '#6f42c1',
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            borderRadius: '12px',
            borderStyle: 'solid',
            borderWidth: '1px',
            boxShadow:
                '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(10px)',
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
            boxShadow:
                '0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1)',
            backdropFilter: 'none',
            animations: {
                glow: true,
                scanline: true,
                'pixel-blink': true,
            },
        },
    },
    currentTheme: 'Classic Autobot',
    PAINT_UNAVAILABLE: true,
    COORDINATE_MODE: 'rows',
    COORDINATE_DIRECTION: 'bottom-left',
    COORDINATE_SNAKE: true,
    COORDINATE_BLOCK_WIDTH: 6,
    COORDINATE_BLOCK_HEIGHT: 2,
};

/**
 * Get the current active theme name.
 * @returns {string} Current theme name
 */
export const getCurrentTheme = () => CONFIG.THEMES[CONFIG.currentTheme];