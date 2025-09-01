import { expect, test, describe } from 'vitest';
import {
    DEFAULT_CONFIG,
    isValidCooldown,
    isValidThreshold,
    isValidPaintingSpeed,
    isValidOpacity,
    isValidTokenSource,
    isValidRepeatMinutes,
    validateNotificationConfig,
    validateOverlayConfig,
    validatePaintingSpeedConfig,
    sanitizeConfig,
} from '../src/lib/config.js';

describe('Configuration Validation Utilities', () => {
    describe('DEFAULT_CONFIG', () => {
        test('has all required properties', () => {
            expect(DEFAULT_CONFIG).toHaveProperty('COOLDOWN_DEFAULT');
            expect(DEFAULT_CONFIG).toHaveProperty('TRANSPARENCY_THRESHOLD');
            expect(DEFAULT_CONFIG).toHaveProperty('WHITE_THRESHOLD');
            expect(DEFAULT_CONFIG).toHaveProperty('PAINTING_SPEED');
            expect(DEFAULT_CONFIG).toHaveProperty('NOTIFICATIONS');
            expect(DEFAULT_CONFIG).toHaveProperty('OVERLAY');
        });

        test('has valid default values', () => {
            expect(isValidCooldown(DEFAULT_CONFIG.COOLDOWN_DEFAULT)).toBe(true);
            expect(
                isValidThreshold(DEFAULT_CONFIG.TRANSPARENCY_THRESHOLD)
            ).toBe(true);
            expect(isValidThreshold(DEFAULT_CONFIG.WHITE_THRESHOLD)).toBe(true);
            expect(isValidTokenSource(DEFAULT_CONFIG.TOKEN_SOURCE)).toBe(true);
        });
    });

    describe('isValidCooldown', () => {
        test('accepts valid cooldown values', () => {
            expect(isValidCooldown(0)).toBe(true);
            expect(isValidCooldown(30000)).toBe(true);
            expect(isValidCooldown(300000)).toBe(true);
        });

        test('rejects invalid cooldown values', () => {
            expect(isValidCooldown(-1)).toBe(false);
            expect(isValidCooldown(300001)).toBe(false);
            expect(isValidCooldown('30000')).toBe(false);
            expect(isValidCooldown(null)).toBe(false);
            expect(isValidCooldown(undefined)).toBe(false);
        });
    });

    describe('isValidThreshold', () => {
        test('accepts valid threshold values', () => {
            expect(isValidThreshold(0)).toBe(true);
            expect(isValidThreshold(100)).toBe(true);
            expect(isValidThreshold(255)).toBe(true);
        });

        test('rejects invalid threshold values', () => {
            expect(isValidThreshold(-1)).toBe(false);
            expect(isValidThreshold(256)).toBe(false);
            expect(isValidThreshold('100')).toBe(false);
            expect(isValidThreshold(null)).toBe(false);
        });
    });

    describe('isValidPaintingSpeed', () => {
        test('accepts valid painting speeds', () => {
            expect(isValidPaintingSpeed(1)).toBe(true);
            expect(isValidPaintingSpeed(5)).toBe(true);
            expect(isValidPaintingSpeed(1000)).toBe(true);
        });

        test('rejects invalid painting speeds', () => {
            expect(isValidPaintingSpeed(0)).toBe(false);
            expect(isValidPaintingSpeed(1001)).toBe(false);
            expect(isValidPaintingSpeed(-1)).toBe(false);
            expect(isValidPaintingSpeed('5')).toBe(false);
        });
    });

    describe('isValidOpacity', () => {
        test('accepts valid opacity values', () => {
            expect(isValidOpacity(0)).toBe(true);
            expect(isValidOpacity(0.5)).toBe(true);
            expect(isValidOpacity(1)).toBe(true);
        });

        test('rejects invalid opacity values', () => {
            expect(isValidOpacity(-0.1)).toBe(false);
            expect(isValidOpacity(1.1)).toBe(false);
            expect(isValidOpacity('0.5')).toBe(false);
        });
    });

    describe('isValidTokenSource', () => {
        test('accepts valid token sources', () => {
            expect(isValidTokenSource('generator')).toBe(true);
            expect(isValidTokenSource('manual')).toBe(true);
            expect(isValidTokenSource('hybrid')).toBe(true);
        });

        test('rejects invalid token sources', () => {
            expect(isValidTokenSource('invalid')).toBe(false);
            expect(isValidTokenSource('')).toBe(false);
            expect(isValidTokenSource(null)).toBe(false);
            expect(isValidTokenSource(123)).toBe(false);
        });
    });

    describe('isValidRepeatMinutes', () => {
        test('accepts valid repeat minutes', () => {
            expect(isValidRepeatMinutes(1)).toBe(true);
            expect(isValidRepeatMinutes(30)).toBe(true);
            expect(isValidRepeatMinutes(60)).toBe(true);
        });

        test('rejects invalid repeat minutes', () => {
            expect(isValidRepeatMinutes(0)).toBe(false);
            expect(isValidRepeatMinutes(61)).toBe(false);
            expect(isValidRepeatMinutes('5')).toBe(false);
        });
    });

    describe('validateNotificationConfig', () => {
        test('validates correct notification config', () => {
            const config = {
                ENABLED: true,
                ON_CHARGES_REACHED: false,
                ONLY_WHEN_UNFOCUSED: true,
                REPEAT_MINUTES: 10,
            };
            const result = validateNotificationConfig(config);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('rejects invalid notification config', () => {
            const config = {
                ENABLED: 'true',
                REPEAT_MINUTES: 0,
            };
            const result = validateNotificationConfig(config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('ENABLED must be a boolean');
            expect(result.errors).toContain(
                'REPEAT_MINUTES must be a number between 1 and 60'
            );
        });

        test('rejects non-object input', () => {
            const result = validateNotificationConfig(null);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain(
                'Notifications config must be an object'
            );
        });
    });

    describe('validateOverlayConfig', () => {
        test('validates correct overlay config', () => {
            const config = {
                OPACITY_DEFAULT: 0.7,
                BLUE_MARBLE_DEFAULT: true,
                ditheringEnabled: false,
            };
            const result = validateOverlayConfig(config);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('rejects invalid overlay config', () => {
            const config = {
                OPACITY_DEFAULT: 1.5,
                BLUE_MARBLE_DEFAULT: 'yes',
            };
            const result = validateOverlayConfig(config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain(
                'OPACITY_DEFAULT must be a number between 0 and 1'
            );
            expect(result.errors).toContain(
                'BLUE_MARBLE_DEFAULT must be a boolean'
            );
        });
    });

    describe('validatePaintingSpeedConfig', () => {
        test('validates correct painting speed config', () => {
            const config = {
                MIN: 1,
                MAX: 500,
                DEFAULT: 10,
            };
            const result = validatePaintingSpeedConfig(config);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('rejects invalid painting speed config', () => {
            const config = {
                MIN: 0,
                MAX: 2000,
                DEFAULT: 5000,
            };
            const result = validatePaintingSpeedConfig(config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain(
                'MIN must be a positive integer >= 1'
            );
            expect(result.errors).toContain('MAX must be a number <= 1000');
        });

        test('validates MIN/MAX/DEFAULT relationships', () => {
            const config = {
                MIN: 10,
                MAX: 5,
                DEFAULT: 15,
            };
            const result = validatePaintingSpeedConfig(config);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain(
                'MIN must be less than or equal to MAX'
            );
        });
    });

    describe('sanitizeConfig', () => {
        test('returns default config for null input', () => {
            const result = sanitizeConfig(null);
            expect(result).toEqual(DEFAULT_CONFIG);
        });

        test('sanitizes valid partial config', () => {
            const input = {
                COOLDOWN_DEFAULT: 25000,
                TRANSPARENCY_THRESHOLD: 150,
                PAINTING_SPEED_ENABLED: true,
                TOKEN_SOURCE: 'manual',
            };
            const result = sanitizeConfig(input);

            expect(result.COOLDOWN_DEFAULT).toBe(25000);
            expect(result.TRANSPARENCY_THRESHOLD).toBe(150);
            expect(result.PAINTING_SPEED_ENABLED).toBe(true);
            expect(result.TOKEN_SOURCE).toBe('manual');
            // Should keep defaults for unspecified values
            expect(result.WHITE_THRESHOLD).toBe(DEFAULT_CONFIG.WHITE_THRESHOLD);
        });

        test('rejects invalid values and uses defaults', () => {
            const input = {
                COOLDOWN_DEFAULT: -1000,
                TRANSPARENCY_THRESHOLD: 300,
                TOKEN_SOURCE: 'invalid',
                PAINTING_SPEED_ENABLED: 'yes',
            };
            const result = sanitizeConfig(input);

            // Invalid values should be replaced with defaults
            expect(result.COOLDOWN_DEFAULT).toBe(
                DEFAULT_CONFIG.COOLDOWN_DEFAULT
            );
            expect(result.TRANSPARENCY_THRESHOLD).toBe(
                DEFAULT_CONFIG.TRANSPARENCY_THRESHOLD
            );
            expect(result.TOKEN_SOURCE).toBe(DEFAULT_CONFIG.TOKEN_SOURCE);
            expect(result.PAINTING_SPEED_ENABLED).toBe(
                DEFAULT_CONFIG.PAINTING_SPEED_ENABLED
            );
        });

        test('sanitizes nested config objects', () => {
            const input = {
                NOTIFICATIONS: {
                    ENABLED: false,
                    REPEAT_MINUTES: 15,
                },
                OVERLAY: {
                    OPACITY_DEFAULT: 0.8,
                },
            };
            const result = sanitizeConfig(input);

            expect(result.NOTIFICATIONS.ENABLED).toBe(false);
            expect(result.NOTIFICATIONS.REPEAT_MINUTES).toBe(15);
            expect(result.OVERLAY.OPACITY_DEFAULT).toBe(0.8);
            // Should keep defaults for unspecified nested values
            expect(result.NOTIFICATIONS.ON_CHARGES_REACHED).toBe(
                DEFAULT_CONFIG.NOTIFICATIONS.ON_CHARGES_REACHED
            );
        });

        test('handles complex painting speed config', () => {
            const input = {
                PAINTING_SPEED: {
                    MIN: 2,
                    MAX: 800,
                    DEFAULT: 25,
                },
            };
            const result = sanitizeConfig(input);

            expect(result.PAINTING_SPEED.MIN).toBe(2);
            expect(result.PAINTING_SPEED.MAX).toBe(800);
            expect(result.PAINTING_SPEED.DEFAULT).toBe(25);
        });
    });
});
