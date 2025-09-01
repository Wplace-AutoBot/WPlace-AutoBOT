import { expect, test, describe } from 'vitest';
import { rgbToLab, labDistance, findClosestColor } from '../src/lib/color.js';

describe('Color Utility Functions', () => {
    describe('rgbToLab', () => {
        test('converts pure black to LAB', () => {
            const [L, a, b] = rgbToLab(0, 0, 0);
            expect(L).toBeCloseTo(0, 1);
            expect(a).toBeCloseTo(0, 1);
            expect(b).toBeCloseTo(0, 1);
        });

        test('converts pure white to LAB', () => {
            const [L, a, b] = rgbToLab(255, 255, 255);
            expect(L).toBeCloseTo(100, 1);
            expect(a).toBeCloseTo(0, 1);
            expect(b).toBeCloseTo(0, 1);
        });

        test('converts pure red to LAB', () => {
            const [L, a, b] = rgbToLab(255, 0, 0);
            expect(L).toBeCloseTo(53.2, 1);
            expect(a).toBeCloseTo(80.1, 1);
            expect(b).toBeCloseTo(67.2, 1);
        });

        test('returns array with three values', () => {
            const result = rgbToLab(128, 128, 128);
            expect(result).toHaveLength(3);
            expect(result[0]).toBeTypeOf('number');
            expect(result[1]).toBeTypeOf('number');
            expect(result[2]).toBeTypeOf('number');
        });

        test('handles edge cases', () => {
            expect(() => rgbToLab(0, 0, 0)).not.toThrow();
            expect(() => rgbToLab(255, 255, 255)).not.toThrow();
            expect(() => rgbToLab(128, 64, 192)).not.toThrow();
        });
    });

    describe('labDistance', () => {
        test('identical colors have zero distance', () => {
            const lab1 = [50, 0, 0];
            const lab2 = [50, 0, 0];
            expect(labDistance(lab1, lab2)).toBe(0);
        });

        test('calculates distance between different colors', () => {
            const lab1 = [50, 0, 0];
            const lab2 = [60, 10, 5];
            const distance = labDistance(lab1, lab2);
            expect(distance).toBeCloseTo(15.0, 1);
        });

        test('distance is symmetric', () => {
            const lab1 = [30, -10, 20];
            const lab2 = [70, 15, -5];
            const distance1 = labDistance(lab1, lab2);
            const distance2 = labDistance(lab2, lab1);
            expect(distance1).toEqual(distance2);
        });

        test('returns positive distance', () => {
            const lab1 = [20, -30, 40];
            const lab2 = [80, 10, -20];
            const distance = labDistance(lab1, lab2);
            expect(distance).toBeGreaterThan(0);
        });
    });

    describe('findClosestColor', () => {
        const mockPalette = [
            { id: 1, rgb: { r: 0, g: 0, b: 0 } }, // Black
            { id: 2, rgb: { r: 255, g: 255, b: 255 } }, // White
            { id: 3, rgb: { r: 255, g: 0, b: 0 } }, // Red
            { id: 4, rgb: { r: 0, g: 255, b: 0 } }, // Green
            { id: 5, rgb: { r: 0, g: 0, b: 255 } }, // Blue
        ];

        test('finds exact color match', () => {
            const targetRgb = [255, 0, 0]; // Red
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(3); // Red has id 3
        });

        test('finds closest color for approximate match', () => {
            const targetRgb = [250, 10, 5]; // Close to red
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(3); // Should match red
        });

        test('finds closest color for gray', () => {
            const targetRgb = [128, 128, 128]; // Gray
            const result = findClosestColor(targetRgb, mockPalette);
            // Should be either black or white, likely white since 128 is closer to 255 than 0
            expect([1, 2]).toContain(result);
        });

        test('handles empty palette', () => {
            const targetRgb = [128, 128, 128];
            const result = findClosestColor(targetRgb, []);
            expect(result).toBe(1); // Default return
        });

        test('handles null/undefined palette', () => {
            const targetRgb = [128, 128, 128];
            expect(findClosestColor(targetRgb, null)).toBe(1);
            expect(findClosestColor(targetRgb, undefined)).toBe(1);
        });

        test('returns valid color id', () => {
            const targetRgb = [100, 150, 200];
            const result = findClosestColor(targetRgb, mockPalette);
            const validIds = mockPalette.map(color => color.id);
            expect(validIds).toContain(result);
        });

        test('handles very dark colors correctly', () => {
            const targetRgb = [10, 5, 8]; // Very dark
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(1); // Should match black
        });

        test('handles very light colors correctly', () => {
            const targetRgb = [250, 245, 248]; // Very light
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(2); // Should match white
        });

        test('finds closest primary color', () => {
            // Test with a color that's clearly closest to green
            const targetRgb = [0, 200, 50]; // Greenish
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(4); // Should match green
        });

        test('handles purple-ish colors', () => {
            const targetRgb = [128, 64, 192]; // Purple-ish
            const result = findClosestColor(targetRgb, mockPalette);
            expect(result).toBe(5); // Should match blue (closest primary)
        });

        test('is consistent with same inputs', () => {
            const targetRgb = [100, 150, 75];
            const result1 = findClosestColor(targetRgb, mockPalette);
            const result2 = findClosestColor(targetRgb, mockPalette);
            expect(result1).toBe(result2);
        });
    });
});
