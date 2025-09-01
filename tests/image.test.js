import { expect, test, describe } from 'vitest';
import {
    getPixelFromImageData,
    setPixelInImageData,
    isPixelTransparent,
    isPixelWhite,
    getPixelIndex,
    applyBlueMarbleEffect,
    resizeImageData,
} from '../src/lib/image.js';

describe('Image Processing Utilities', () => {
    describe('getPixelFromImageData', () => {
        const createMockImageData = (
            width,
            height,
            fillValue = [255, 0, 0, 255]
        ) => {
            const data = new Uint8ClampedArray(width * height * 4);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = fillValue[0]; // R
                data[i + 1] = fillValue[1]; // G
                data[i + 2] = fillValue[2]; // B
                data[i + 3] = fillValue[3]; // A
            }
            return { data, width, height };
        };

        test('returns correct pixel data for valid coordinates', () => {
            const imageData = createMockImageData(3, 3, [100, 150, 200, 255]);
            const pixel = getPixelFromImageData(imageData, 1, 1);
            expect(pixel).toEqual([100, 150, 200, 255]);
        });

        test('returns null for out-of-bounds coordinates', () => {
            const imageData = createMockImageData(3, 3);
            expect(getPixelFromImageData(imageData, -1, 0)).toBeNull();
            expect(getPixelFromImageData(imageData, 0, -1)).toBeNull();
            expect(getPixelFromImageData(imageData, 3, 0)).toBeNull();
            expect(getPixelFromImageData(imageData, 0, 3)).toBeNull();
        });

        test('returns null for invalid imageData', () => {
            expect(getPixelFromImageData(null, 0, 0)).toBeNull();
            expect(getPixelFromImageData(undefined, 0, 0)).toBeNull();
        });

        test('handles edge coordinates correctly', () => {
            const imageData = createMockImageData(2, 2, [50, 100, 150, 200]);
            expect(getPixelFromImageData(imageData, 0, 0)).toEqual([
                50, 100, 150, 200,
            ]);
            expect(getPixelFromImageData(imageData, 1, 1)).toEqual([
                50, 100, 150, 200,
            ]);
        });
    });

    describe('setPixelInImageData', () => {
        const createMockImageData = (width, height) => {
            const data = new Uint8ClampedArray(width * height * 4);
            return { data, width, height };
        };

        test('sets pixel data correctly for valid coordinates', () => {
            const imageData = createMockImageData(3, 3);
            const result = setPixelInImageData(
                imageData,
                1,
                1,
                [100, 150, 200, 255]
            );
            expect(result).toBe(true);

            const index = (1 * 3 + 1) * 4;
            expect(imageData.data[index]).toBe(100); // R
            expect(imageData.data[index + 1]).toBe(150); // G
            expect(imageData.data[index + 2]).toBe(200); // B
            expect(imageData.data[index + 3]).toBe(255); // A
        });

        test('returns false for out-of-bounds coordinates', () => {
            const imageData = createMockImageData(3, 3);
            expect(
                setPixelInImageData(imageData, -1, 0, [255, 0, 0, 255])
            ).toBe(false);
            expect(setPixelInImageData(imageData, 3, 0, [255, 0, 0, 255])).toBe(
                false
            );
        });

        test('returns false for invalid imageData', () => {
            expect(setPixelInImageData(null, 0, 0, [255, 0, 0, 255])).toBe(
                false
            );
            expect(setPixelInImageData(undefined, 0, 0, [255, 0, 0, 255])).toBe(
                false
            );
        });
    });

    describe('isPixelTransparent', () => {
        test('identifies transparent pixels correctly', () => {
            expect(isPixelTransparent([255, 0, 0, 50], 100)).toBe(true);
            expect(isPixelTransparent([255, 0, 0, 255], 100)).toBe(false);
            expect(isPixelTransparent([0, 0, 0, 0], 100)).toBe(true);
        });

        test('uses default threshold when not provided', () => {
            expect(isPixelTransparent([255, 0, 0, 50])).toBe(true);
            expect(isPixelTransparent([255, 0, 0, 150])).toBe(false);
        });

        test('handles edge cases', () => {
            expect(isPixelTransparent([255, 0, 0, 100], 100)).toBe(false); // Equal to threshold
            expect(isPixelTransparent([255, 0, 0, 99], 100)).toBe(true); // Just below threshold
        });

        test('handles null input', () => {
            expect(isPixelTransparent(null)).toBe(false);
            expect(isPixelTransparent(undefined)).toBe(false);
        });
    });

    describe('isPixelWhite', () => {
        test('identifies white pixels correctly', () => {
            expect(isPixelWhite([255, 255, 255], 250)).toBe(true);
            expect(isPixelWhite([250, 250, 250], 250)).toBe(true);
            expect(isPixelWhite([249, 255, 255], 250)).toBe(false);
            expect(isPixelWhite([100, 100, 100], 250)).toBe(false);
        });

        test('uses default threshold when not provided', () => {
            expect(isPixelWhite([255, 255, 255])).toBe(true);
            expect(isPixelWhite([240, 240, 240])).toBe(false);
        });

        test('handles edge cases', () => {
            expect(isPixelWhite([250, 250, 250], 250)).toBe(true); // Equal to threshold
            expect(isPixelWhite([249, 249, 249], 250)).toBe(false); // Just below threshold
        });

        test('handles null input', () => {
            expect(isPixelWhite(null)).toBe(false);
            expect(isPixelWhite(undefined)).toBe(false);
        });
    });

    describe('getPixelIndex', () => {
        test('calculates pixel index correctly', () => {
            expect(getPixelIndex(0, 0, 10)).toBe(0);
            expect(getPixelIndex(5, 0, 10)).toBe(20); // 5 * 4
            expect(getPixelIndex(0, 1, 10)).toBe(40); // 10 * 4
            expect(getPixelIndex(2, 3, 10)).toBe(128); // (3 * 10 + 2) * 4
        });

        test('handles edge coordinates', () => {
            const width = 5;
            expect(getPixelIndex(0, 0, width)).toBe(0);
            expect(getPixelIndex(width - 1, 0, width)).toBe((width - 1) * 4);
        });
    });

    describe('applyBlueMarbleEffect', () => {
        test('returns modified pixel data with same length', () => {
            const data = new Uint8ClampedArray([
                255, 128, 64, 255, 0, 255, 128, 200,
            ]);
            const result = applyBlueMarbleEffect(data, 2, 1, 0.5);

            expect(result).toBeInstanceOf(Uint8ClampedArray);
            expect(result.length).toBe(data.length);
            expect(result).not.toEqual(data); // Should be modified
        });

        test('preserves alpha channel', () => {
            const data = new Uint8ClampedArray([
                255, 128, 64, 200, 100, 50, 25, 150,
            ]);
            const result = applyBlueMarbleEffect(data, 2, 1, 0.5);

            expect(result[3]).toBe(200); // First pixel alpha preserved
            expect(result[7]).toBe(150); // Second pixel alpha preserved
        });

        test('handles zero intensity', () => {
            const data = new Uint8ClampedArray([255, 128, 64, 255]);
            const result = applyBlueMarbleEffect(data, 1, 1, 0);

            // With zero intensity, changes should be minimal
            expect(Math.abs(result[0] - data[0])).toBeLessThan(5);
            expect(Math.abs(result[1] - data[1])).toBeLessThan(5);
            expect(Math.abs(result[2] - data[2])).toBeLessThan(5);
        });

        test('clamps values to valid range', () => {
            const data = new Uint8ClampedArray([0, 0, 255, 255]); // Edge case values
            const result = applyBlueMarbleEffect(data, 1, 1, 1);

            expect(result[0]).toBeGreaterThanOrEqual(0);
            expect(result[0]).toBeLessThanOrEqual(255);
            expect(result[1]).toBeGreaterThanOrEqual(0);
            expect(result[1]).toBeLessThanOrEqual(255);
            expect(result[2]).toBeGreaterThanOrEqual(0);
            expect(result[2]).toBeLessThanOrEqual(255);
        });
    });

    describe('resizeImageData', () => {
        test('resizes image data correctly', () => {
            // 2x2 source image
            const sourceData = new Uint8ClampedArray([
                255,
                0,
                0,
                255, // Red pixel (0,0)
                0,
                255,
                0,
                255, // Green pixel (1,0)
                0,
                0,
                255,
                255, // Blue pixel (0,1)
                255,
                255,
                0,
                255, // Yellow pixel (1,1)
            ]);

            const result = resizeImageData(sourceData, 2, 2, 4, 4);

            expect(result).toBeInstanceOf(Uint8ClampedArray);
            expect(result.length).toBe(4 * 4 * 4); // 4x4 RGBA
        });

        test('handles upscaling', () => {
            const sourceData = new Uint8ClampedArray([255, 0, 0, 255]); // Single red pixel
            const result = resizeImageData(sourceData, 1, 1, 2, 2);

            expect(result.length).toBe(2 * 2 * 4);
            // All pixels should be red due to nearest neighbor
            for (let i = 0; i < result.length; i += 4) {
                expect(result[i]).toBe(255); // R
                expect(result[i + 1]).toBe(0); // G
                expect(result[i + 2]).toBe(0); // B
                expect(result[i + 3]).toBe(255); // A
            }
        });

        test('handles downscaling', () => {
            const sourceData = new Uint8ClampedArray([
                255,
                0,
                0,
                255, // Red
                0,
                255,
                0,
                255, // Green
                0,
                0,
                255,
                255, // Blue
                255,
                255,
                0,
                255, // Yellow
            ]);

            const result = resizeImageData(sourceData, 2, 2, 1, 1);

            expect(result.length).toBe(1 * 1 * 4);
            expect(result[0]).toBe(255); // Should pick the top-left pixel (red)
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
            expect(result[3]).toBe(255);
        });

        test('preserves aspect ratio calculations', () => {
            const sourceData = new Uint8ClampedArray(3 * 2 * 4); // 3x2 image
            const result = resizeImageData(sourceData, 3, 2, 6, 4);

            expect(result.length).toBe(6 * 4 * 4); // Should be 6x4
        });
    });
});
