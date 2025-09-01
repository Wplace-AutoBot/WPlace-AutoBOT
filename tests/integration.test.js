import { expect, test, describe } from 'vitest';
import { rgbToLab, labDistance, findClosestColor } from '../src/lib/color.js';
import {
    absoluteToRegionCoords,
    regionToAbsoluteCoords,
    getTileKey,
} from '../src/lib/coordinates.js';
import {
    getPixelFromImageData,
    setPixelInImageData,
    isPixelTransparent,
} from '../src/lib/image.js';
import { sanitizeConfig, DEFAULT_CONFIG } from '../src/lib/config.js';

describe('Integration Tests', () => {
    describe('Color Matching Pipeline', () => {
        const mockPalette = [
            { id: 1, rgb: { r: 0, g: 0, b: 0 } }, // Black
            { id: 2, rgb: { r: 255, g: 255, b: 255 } }, // White
            { id: 3, rgb: { r: 255, g: 0, b: 0 } }, // Red
            { id: 4, rgb: { r: 0, g: 255, b: 0 } }, // Green
            { id: 5, rgb: { r: 0, g: 0, b: 255 } }, // Blue
        ];

        test('complete color matching workflow', () => {
            // Test a color matching workflow from RGB input to closest palette color
            const inputColor = [200, 50, 100]; // Reddish color

            // Step 1: Convert to LAB color space
            const inputLab = rgbToLab(
                inputColor[0],
                inputColor[1],
                inputColor[2]
            );
            expect(inputLab).toHaveLength(3);
            expect(inputLab[0]).toBeGreaterThan(0); // Lightness should be positive

            // Step 2: Find closest color in palette
            const closestId = findClosestColor(inputColor, mockPalette);
            expect(closestId).toBe(3); // Should match red (id: 3)

            // Step 3: Verify the match is reasonable by checking LAB distance
            const redRgb = [255, 0, 0];
            const redLab = rgbToLab(redRgb[0], redRgb[1], redRgb[2]);
            const whiteRgb = [255, 255, 255];
            const whiteLab = rgbToLab(whiteRgb[0], whiteRgb[1], whiteRgb[2]);

            const distanceToRed = labDistance(inputLab, redLab);
            const distanceToWhite = labDistance(inputLab, whiteLab);

            expect(distanceToRed).toBeLessThan(distanceToWhite);
        });

        test('handles edge case colors correctly', () => {
            // Test very dark color
            const darkColor = [10, 5, 8];
            const darkResult = findClosestColor(darkColor, mockPalette);
            expect(darkResult).toBe(1); // Should match black

            // Test very light color
            const lightColor = [250, 245, 248];
            const lightResult = findClosestColor(lightColor, mockPalette);
            expect(lightResult).toBe(2); // Should match white
        });
    });

    describe('Coordinate System Integration', () => {
        test('coordinate conversion round-trip consistency', () => {
            const testCases = [
                { absX: 0, absY: 0 },
                { absX: 1500, absY: 2750 },
                { absX: -500, absY: -750 },
                { absX: 999, absY: 1999 },
            ];

            testCases.forEach(({ absX, absY }) => {
                // Convert absolute to region coordinates
                const region = absoluteToRegionCoords(absX, absY);
                expect(region).toHaveProperty('regionX');
                expect(region).toHaveProperty('regionY');
                expect(region).toHaveProperty('pixelX');
                expect(region).toHaveProperty('pixelY');

                // Convert back to absolute coordinates
                const backToAbs = regionToAbsoluteCoords(
                    region.regionX,
                    region.regionY,
                    region.pixelX,
                    region.pixelY
                );

                expect(backToAbs.absX).toBe(absX);
                expect(backToAbs.absY).toBe(absY);

                // Verify tile key generation
                const tileKey = getTileKey(region.regionX, region.regionY);
                expect(tileKey).toBe(`${region.regionX},${region.regionY}`);
            });
        });
    });

    describe('Image Processing Pipeline', () => {
        test('pixel manipulation workflow', () => {
            // Create mock image data
            const width = 3,
                height = 3;
            const data = new Uint8ClampedArray(width * height * 4);
            const imageData = { data, width, height };

            // Set a red pixel at (1, 1)
            const redPixel = [255, 0, 0, 255];
            const setResult = setPixelInImageData(imageData, 1, 1, redPixel);
            expect(setResult).toBe(true);

            // Retrieve the same pixel
            const retrievedPixel = getPixelFromImageData(imageData, 1, 1);
            expect(retrievedPixel).toEqual(redPixel);

            // Test transparency check
            const transparentPixel = [255, 0, 0, 50];
            setPixelInImageData(imageData, 0, 0, transparentPixel);
            const retrievedTransparent = getPixelFromImageData(imageData, 0, 0);
            expect(isPixelTransparent(retrievedTransparent, 100)).toBe(true);
        });

        test('handles boundary conditions correctly', () => {
            const imageData = {
                data: new Uint8ClampedArray(4 * 4),
                width: 2,
                height: 2,
            };

            // Test valid boundary pixels
            expect(setPixelInImageData(imageData, 0, 0, [255, 0, 0, 255])).toBe(
                true
            );
            expect(setPixelInImageData(imageData, 1, 1, [0, 255, 0, 255])).toBe(
                true
            );

            // Test invalid coordinates
            expect(
                setPixelInImageData(imageData, -1, 0, [0, 0, 255, 255])
            ).toBe(false);
            expect(setPixelInImageData(imageData, 2, 1, [0, 0, 255, 255])).toBe(
                false
            );
            expect(getPixelFromImageData(imageData, -1, 0)).toBeNull();
            expect(getPixelFromImageData(imageData, 2, 1)).toBeNull();
        });
    });

    describe('Configuration Integration', () => {
        test('configuration validation with real-world scenarios', () => {
            // Test realistic user configuration
            const userConfig = {
                COOLDOWN_DEFAULT: 45000,
                TRANSPARENCY_THRESHOLD: 120,
                PAINTING_SPEED_ENABLED: true,
                PAINTING_SPEED: {
                    MIN: 2,
                    MAX: 50,
                    DEFAULT: 10,
                },
                NOTIFICATIONS: {
                    ENABLED: false,
                    REPEAT_MINUTES: 10,
                },
                OVERLAY: {
                    OPACITY_DEFAULT: 0.75,
                    ditheringEnabled: true,
                },
            };

            const sanitized = sanitizeConfig(userConfig);

            // Verify all valid values are preserved
            expect(sanitized.COOLDOWN_DEFAULT).toBe(45000);
            expect(sanitized.TRANSPARENCY_THRESHOLD).toBe(120);
            expect(sanitized.PAINTING_SPEED_ENABLED).toBe(true);
            expect(sanitized.PAINTING_SPEED.DEFAULT).toBe(10);
            expect(sanitized.NOTIFICATIONS.ENABLED).toBe(false);
            expect(sanitized.OVERLAY.OPACITY_DEFAULT).toBe(0.75);

            // Verify defaults are used for unspecified values
            expect(sanitized.WHITE_THRESHOLD).toBe(
                DEFAULT_CONFIG.WHITE_THRESHOLD
            );
            expect(sanitized.TOKEN_SOURCE).toBe(DEFAULT_CONFIG.TOKEN_SOURCE);
        });

        test('handles malformed configuration gracefully', () => {
            const malformedConfig = {
                COOLDOWN_DEFAULT: 'invalid',
                TRANSPARENCY_THRESHOLD: -50,
                PAINTING_SPEED: {
                    MIN: 1000, // Invalid: greater than MAX
                    MAX: 100,
                    DEFAULT: 2000, // Invalid: greater than MAX
                },
                NOTIFICATIONS: 'not an object',
                OVERLAY: {
                    OPACITY_DEFAULT: 5, // Invalid: greater than 1
                },
            };

            const sanitized = sanitizeConfig(malformedConfig);

            // All invalid values should fallback to defaults
            expect(sanitized.COOLDOWN_DEFAULT).toBe(
                DEFAULT_CONFIG.COOLDOWN_DEFAULT
            );
            expect(sanitized.TRANSPARENCY_THRESHOLD).toBe(
                DEFAULT_CONFIG.TRANSPARENCY_THRESHOLD
            );
            expect(sanitized.PAINTING_SPEED).toEqual(
                DEFAULT_CONFIG.PAINTING_SPEED
            );
            expect(sanitized.NOTIFICATIONS).toEqual(
                DEFAULT_CONFIG.NOTIFICATIONS
            );
            expect(sanitized.OVERLAY.OPACITY_DEFAULT).toBe(
                DEFAULT_CONFIG.OVERLAY.OPACITY_DEFAULT
            );
        });
    });

    describe('Cross-Module Integration', () => {
        test('painting workflow simulation', () => {
            // Simulate a simplified painting workflow combining multiple modules
            const startX = 1250,
                startY = 750; // Absolute coordinates

            // Step 1: Convert to region coordinates
            const coords = absoluteToRegionCoords(startX, startY);
            expect(coords.regionX).toBe(1);
            expect(coords.regionY).toBe(0);
            expect(coords.pixelX).toBe(250);
            expect(coords.pixelY).toBe(750);

            // Step 2: Create mock image data for the region
            const regionData = {
                data: new Uint8ClampedArray(1000 * 1000 * 4),
                width: 1000,
                height: 1000,
            };

            // Step 3: Set a target color at the pixel location
            const targetColor = [128, 64, 192]; // Purple-ish
            const setSuccess = setPixelInImageData(
                regionData,
                coords.pixelX,
                coords.pixelY,
                [...targetColor, 255]
            );
            expect(setSuccess).toBe(true);

            // Step 4: Retrieve and verify the pixel
            const retrievedPixel = getPixelFromImageData(
                regionData,
                coords.pixelX,
                coords.pixelY
            );
            expect(retrievedPixel?.slice(0, 3)).toEqual(targetColor);

            // Step 5: Find closest palette color
            const mockPalette = [
                { id: 1, rgb: { r: 0, g: 0, b: 0 } },
                { id: 5, rgb: { r: 0, g: 0, b: 255 } }, // Blue
                { id: 6, rgb: { r: 128, g: 0, b: 128 } }, // Purple
            ];

            const closestColorId = findClosestColor(targetColor, mockPalette);
            expect([5, 6]).toContain(closestColorId); // Should be blue or purple

            // Step 6: Generate tile key for caching
            const tileKey = getTileKey(coords.regionX, coords.regionY);
            expect(tileKey).toBe('1,0');
        });

        test('configuration-driven color matching', () => {
            // Test how configuration affects color processing
            const config = sanitizeConfig({
                TRANSPARENCY_THRESHOLD: 150,
                WHITE_THRESHOLD: 200,
            });

            const testPixels = [
                [255, 255, 255, 100], // Semi-transparent white
                [210, 210, 210, 255], // Light gray (above white threshold)
                [180, 180, 180, 255], // Gray (below white threshold)
            ];

            testPixels.forEach((pixel, index) => {
                const isTransparent = isPixelTransparent(
                    pixel,
                    config.TRANSPARENCY_THRESHOLD
                );
                const isWhiteish =
                    pixel[0] >= config.WHITE_THRESHOLD &&
                    pixel[1] >= config.WHITE_THRESHOLD &&
                    pixel[2] >= config.WHITE_THRESHOLD;

                if (index === 0) {
                    expect(isTransparent).toBe(true); // Alpha < 150
                }
                if (index === 1) {
                    expect(isWhiteish).toBe(true); // All channels >= 200
                }
                if (index === 2) {
                    expect(isWhiteish).toBe(false); // All channels < 200
                }
            });
        });
    });
});
