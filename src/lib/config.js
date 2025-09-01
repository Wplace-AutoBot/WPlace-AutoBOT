/**
 * Configuration validation utilities for WPlace AutoBot
 * Pure functions extracted for testing purposes
 */

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
    COOLDOWN_DEFAULT: 31000,
    TRANSPARENCY_THRESHOLD: 100,
    WHITE_THRESHOLD: 250,
    LOG_INTERVAL: 10,
    PAINTING_SPEED: {
        MIN: 1,
        MAX: 1000,
        DEFAULT: 5,
    },
    PAINTING_SPEED_ENABLED: false,
    AUTO_CAPTCHA_ENABLED: true,
    TOKEN_SOURCE: 'generator',
    COOLDOWN_CHARGE_THRESHOLD: 1,
    NOTIFICATIONS: {
        ENABLED: true,
        ON_CHARGES_REACHED: true,
        ONLY_WHEN_UNFOCUSED: true,
        REPEAT_MINUTES: 5,
    },
    OVERLAY: {
        OPACITY_DEFAULT: 0.6,
        BLUE_MARBLE_DEFAULT: false,
        ditheringEnabled: false,
    },
};

/**
 * Validate cooldown value
 * @param {number} cooldown - Cooldown in milliseconds
 * @returns {boolean} True if valid cooldown
 */
export function isValidCooldown(cooldown) {
    return typeof cooldown === 'number' && cooldown >= 0 && cooldown <= 300000; // Max 5 minutes
}

/**
 * Validate threshold value (0-255)
 * @param {number} threshold - Threshold value
 * @returns {boolean} True if valid threshold
 */
export function isValidThreshold(threshold) {
    return typeof threshold === 'number' && threshold >= 0 && threshold <= 255;
}

/**
 * Validate painting speed
 * @param {number} speed - Painting speed (pixels per batch)
 * @returns {boolean} True if valid speed
 */
export function isValidPaintingSpeed(speed) {
    return (
        typeof speed === 'number' &&
        speed >= DEFAULT_CONFIG.PAINTING_SPEED.MIN &&
        speed <= DEFAULT_CONFIG.PAINTING_SPEED.MAX
    );
}

/**
 * Validate opacity value
 * @param {number} opacity - Opacity value
 * @returns {boolean} True if valid opacity (0.0 - 1.0)
 */
export function isValidOpacity(opacity) {
    return typeof opacity === 'number' && opacity >= 0 && opacity <= 1;
}

/**
 * Validate token source
 * @param {string} source - Token source type
 * @returns {boolean} True if valid token source
 */
export function isValidTokenSource(source) {
    const validSources = ['generator', 'manual', 'hybrid'];
    return typeof source === 'string' && validSources.includes(source);
}

/**
 * Validate notification repeat minutes
 * @param {number} minutes - Repeat interval in minutes
 * @returns {boolean} True if valid repeat interval
 */
export function isValidRepeatMinutes(minutes) {
    return typeof minutes === 'number' && minutes >= 1 && minutes <= 60;
}

/**
 * Validate entire notification configuration
 * @param {Object} notifications - Notification config object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateNotificationConfig(notifications) {
    const errors = [];

    if (!notifications || typeof notifications !== 'object') {
        return {
            isValid: false,
            errors: ['Notifications config must be an object'],
        };
    }

    if (
        'ENABLED' in notifications &&
        typeof notifications.ENABLED !== 'boolean'
    ) {
        errors.push('ENABLED must be a boolean');
    }

    if (
        'ON_CHARGES_REACHED' in notifications &&
        typeof notifications.ON_CHARGES_REACHED !== 'boolean'
    ) {
        errors.push('ON_CHARGES_REACHED must be a boolean');
    }

    if (
        'ONLY_WHEN_UNFOCUSED' in notifications &&
        typeof notifications.ONLY_WHEN_UNFOCUSED !== 'boolean'
    ) {
        errors.push('ONLY_WHEN_UNFOCUSED must be a boolean');
    }

    if (
        'REPEAT_MINUTES' in notifications &&
        !isValidRepeatMinutes(notifications.REPEAT_MINUTES)
    ) {
        errors.push('REPEAT_MINUTES must be a number between 1 and 60');
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Validate overlay configuration
 * @param {Object} overlay - Overlay config object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateOverlayConfig(overlay) {
    const errors = [];

    if (!overlay || typeof overlay !== 'object') {
        return { isValid: false, errors: ['Overlay config must be an object'] };
    }

    if (
        'OPACITY_DEFAULT' in overlay &&
        !isValidOpacity(overlay.OPACITY_DEFAULT)
    ) {
        errors.push('OPACITY_DEFAULT must be a number between 0 and 1');
    }

    if (
        'BLUE_MARBLE_DEFAULT' in overlay &&
        typeof overlay.BLUE_MARBLE_DEFAULT !== 'boolean'
    ) {
        errors.push('BLUE_MARBLE_DEFAULT must be a boolean');
    }

    if (
        'ditheringEnabled' in overlay &&
        typeof overlay.ditheringEnabled !== 'boolean'
    ) {
        errors.push('ditheringEnabled must be a boolean');
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Validate painting speed configuration
 * @param {Object} paintingSpeed - Painting speed config object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validatePaintingSpeedConfig(paintingSpeed) {
    const errors = [];

    if (!paintingSpeed || typeof paintingSpeed !== 'object') {
        return {
            isValid: false,
            errors: ['Painting speed config must be an object'],
        };
    }

    if (
        'MIN' in paintingSpeed &&
        (!isValidPaintingSpeed(paintingSpeed.MIN) || paintingSpeed.MIN < 1)
    ) {
        errors.push('MIN must be a positive integer >= 1');
    }

    if ('MAX' in paintingSpeed && !isValidPaintingSpeed(paintingSpeed.MAX)) {
        errors.push('MAX must be a number <= 1000');
    }

    if (
        'DEFAULT' in paintingSpeed &&
        !isValidPaintingSpeed(paintingSpeed.DEFAULT)
    ) {
        errors.push('DEFAULT must be a number between MIN and MAX');
    }

    if (
        paintingSpeed.MIN &&
        paintingSpeed.MAX &&
        paintingSpeed.MIN > paintingSpeed.MAX
    ) {
        errors.push('MIN must be less than or equal to MAX');
    }

    if (
        paintingSpeed.DEFAULT &&
        paintingSpeed.MIN &&
        paintingSpeed.DEFAULT < paintingSpeed.MIN
    ) {
        errors.push('DEFAULT must be greater than or equal to MIN');
    }

    if (
        paintingSpeed.DEFAULT &&
        paintingSpeed.MAX &&
        paintingSpeed.DEFAULT > paintingSpeed.MAX
    ) {
        errors.push('DEFAULT must be less than or equal to MAX');
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Sanitize and normalize a configuration object
 * @param {Object} config - Configuration object to sanitize
 * @returns {Object} Sanitized configuration object
 */
export function sanitizeConfig(config) {
    if (!config || typeof config !== 'object') {
        return { ...DEFAULT_CONFIG };
    }

    const sanitized = { ...DEFAULT_CONFIG };

    // Sanitize cooldown
    if (
        'COOLDOWN_DEFAULT' in config &&
        isValidCooldown(config.COOLDOWN_DEFAULT)
    ) {
        sanitized.COOLDOWN_DEFAULT = config.COOLDOWN_DEFAULT;
    }

    // Sanitize thresholds
    if (
        'TRANSPARENCY_THRESHOLD' in config &&
        isValidThreshold(config.TRANSPARENCY_THRESHOLD)
    ) {
        sanitized.TRANSPARENCY_THRESHOLD = config.TRANSPARENCY_THRESHOLD;
    }

    if (
        'WHITE_THRESHOLD' in config &&
        isValidThreshold(config.WHITE_THRESHOLD)
    ) {
        sanitized.WHITE_THRESHOLD = config.WHITE_THRESHOLD;
    }

    // Sanitize painting speed
    if ('PAINTING_SPEED' in config) {
        const speedValidation = validatePaintingSpeedConfig(
            config.PAINTING_SPEED
        );
        if (speedValidation.isValid) {
            sanitized.PAINTING_SPEED = {
                ...sanitized.PAINTING_SPEED,
                ...config.PAINTING_SPEED,
            };
        }
    }

    // Sanitize boolean flags
    if (
        'PAINTING_SPEED_ENABLED' in config &&
        typeof config.PAINTING_SPEED_ENABLED === 'boolean'
    ) {
        sanitized.PAINTING_SPEED_ENABLED = config.PAINTING_SPEED_ENABLED;
    }

    if (
        'AUTO_CAPTCHA_ENABLED' in config &&
        typeof config.AUTO_CAPTCHA_ENABLED === 'boolean'
    ) {
        sanitized.AUTO_CAPTCHA_ENABLED = config.AUTO_CAPTCHA_ENABLED;
    }

    // Sanitize token source
    if ('TOKEN_SOURCE' in config && isValidTokenSource(config.TOKEN_SOURCE)) {
        sanitized.TOKEN_SOURCE = config.TOKEN_SOURCE;
    }

    // Sanitize nested objects
    if ('NOTIFICATIONS' in config) {
        const notificationValidation = validateNotificationConfig(
            config.NOTIFICATIONS
        );
        if (notificationValidation.isValid) {
            sanitized.NOTIFICATIONS = {
                ...sanitized.NOTIFICATIONS,
                ...config.NOTIFICATIONS,
            };
        }
    }

    if ('OVERLAY' in config) {
        const overlayValidation = validateOverlayConfig(config.OVERLAY);
        if (overlayValidation.isValid) {
            sanitized.OVERLAY = { ...sanitized.OVERLAY, ...config.OVERLAY };
        }
    }

    return sanitized;
}
