import { expect, test, describe } from 'vitest';
import {
    absoluteToRegionCoords,
    regionToAbsoluteCoords,
    getTileKey,
    parseTileKey,
    isValidPixelCoord,
    clampPixelCoords,
    calculateDistance,
    calculateManhattanDistance,
    coordinatesEqual,
    getNeighboringPixels,
    getAllNeighboringPixels,
} from '../src/lib/coordinates.js';

describe('Coordinate Conversion Utilities', () => {
    describe('absoluteToRegionCoords', () => {
        test('converts coordinates correctly for positive values', () => {
            const result = absoluteToRegionCoords(1500, 2750);
            expect(result).toEqual({
                regionX: 1,
                regionY: 2,
                pixelX: 500,
                pixelY: 750,
            });
        });

        test('handles coordinates at region boundaries', () => {
            expect(absoluteToRegionCoords(1000, 1000)).toEqual({
                regionX: 1,
                regionY: 1,
                pixelX: 0,
                pixelY: 0,
            });

            expect(absoluteToRegionCoords(999, 999)).toEqual({
                regionX: 0,
                regionY: 0,
                pixelX: 999,
                pixelY: 999,
            });
        });

        test('handles zero coordinates', () => {
            expect(absoluteToRegionCoords(0, 0)).toEqual({
                regionX: 0,
                regionY: 0,
                pixelX: 0,
                pixelY: 0,
            });
        });

        test('handles negative coordinates', () => {
            expect(absoluteToRegionCoords(-500, -750)).toEqual({
                regionX: -1,
                regionY: -1,
                pixelX: 500,
                pixelY: 250,
            });
        });

        test('handles large coordinates', () => {
            expect(absoluteToRegionCoords(10500, 25999)).toEqual({
                regionX: 10,
                regionY: 25,
                pixelX: 500,
                pixelY: 999,
            });
        });
    });

    describe('regionToAbsoluteCoords', () => {
        test('converts region coordinates correctly', () => {
            const result = regionToAbsoluteCoords(2, 3, 400, 600);
            expect(result).toEqual({
                absX: 2400,
                absY: 3600,
            });
        });

        test('handles zero region coordinates', () => {
            expect(regionToAbsoluteCoords(0, 0, 500, 750)).toEqual({
                absX: 500,
                absY: 750,
            });
        });

        test('handles negative region coordinates', () => {
            expect(regionToAbsoluteCoords(-1, -2, 200, 300)).toEqual({
                absX: -800,
                absY: -1700,
            });
        });

        test('is inverse of absoluteToRegionCoords', () => {
            const originalAbs = { absX: 1234, absY: 5678 };
            const region = absoluteToRegionCoords(
                originalAbs.absX,
                originalAbs.absY
            );
            const backToAbs = regionToAbsoluteCoords(
                region.regionX,
                region.regionY,
                region.pixelX,
                region.pixelY
            );

            expect(backToAbs).toEqual(originalAbs);
        });
    });

    describe('getTileKey', () => {
        test('generates correct tile key', () => {
            expect(getTileKey(5, 10)).toBe('5,10');
            expect(getTileKey(-2, 3)).toBe('-2,3');
            expect(getTileKey(0, 0)).toBe('0,0');
        });
    });

    describe('parseTileKey', () => {
        test('parses valid tile keys correctly', () => {
            expect(parseTileKey('5,10')).toEqual({ regionX: 5, regionY: 10 });
            expect(parseTileKey('-2,3')).toEqual({ regionX: -2, regionY: 3 });
            expect(parseTileKey('0,0')).toEqual({ regionX: 0, regionY: 0 });
        });

        test('returns null for invalid tile keys', () => {
            expect(parseTileKey('invalid')).toBeNull();
            expect(parseTileKey('5')).toBeNull();
            expect(parseTileKey('5,10,15')).toBeNull();
            expect(parseTileKey('a,b')).toBeNull();
            expect(parseTileKey('')).toBeNull();
            expect(parseTileKey(null)).toBeNull();
            expect(parseTileKey(undefined)).toBeNull();
        });

        test('is inverse of getTileKey', () => {
            const coords = { regionX: 7, regionY: -3 };
            const tileKey = getTileKey(coords.regionX, coords.regionY);
            const parsed = parseTileKey(tileKey);

            expect(parsed).toEqual(coords);
        });
    });

    describe('isValidPixelCoord', () => {
        test('validates correct pixel coordinates', () => {
            expect(isValidPixelCoord(0, 0)).toBe(true);
            expect(isValidPixelCoord(500, 750)).toBe(true);
            expect(isValidPixelCoord(999, 999)).toBe(true);
        });

        test('rejects invalid pixel coordinates', () => {
            expect(isValidPixelCoord(-1, 0)).toBe(false);
            expect(isValidPixelCoord(0, -1)).toBe(false);
            expect(isValidPixelCoord(1000, 500)).toBe(false);
            expect(isValidPixelCoord(500, 1000)).toBe(false);
            expect(isValidPixelCoord(1001, 1001)).toBe(false);
        });
    });

    describe('clampPixelCoords', () => {
        test('clamps coordinates to valid range', () => {
            expect(clampPixelCoords(-10, -5)).toEqual({ pixelX: 0, pixelY: 0 });
            expect(clampPixelCoords(1010, 1005)).toEqual({
                pixelX: 999,
                pixelY: 999,
            });
            expect(clampPixelCoords(500, 1500)).toEqual({
                pixelX: 500,
                pixelY: 999,
            });
        });

        test('leaves valid coordinates unchanged', () => {
            expect(clampPixelCoords(500, 750)).toEqual({
                pixelX: 500,
                pixelY: 750,
            });
            expect(clampPixelCoords(0, 0)).toEqual({ pixelX: 0, pixelY: 0 });
            expect(clampPixelCoords(999, 999)).toEqual({
                pixelX: 999,
                pixelY: 999,
            });
        });
    });

    describe('calculateDistance', () => {
        test('calculates Euclidean distance correctly', () => {
            expect(calculateDistance(0, 0, 3, 4)).toBeCloseTo(5, 5);
            expect(calculateDistance(0, 0, 0, 0)).toBe(0);
            expect(calculateDistance(-2, -3, 1, 1)).toBeCloseTo(5, 5);
        });

        test('handles horizontal and vertical distances', () => {
            expect(calculateDistance(0, 0, 5, 0)).toBe(5);
            expect(calculateDistance(0, 0, 0, 5)).toBe(5);
        });
    });

    describe('calculateManhattanDistance', () => {
        test('calculates Manhattan distance correctly', () => {
            expect(calculateManhattanDistance(0, 0, 3, 4)).toBe(7);
            expect(calculateManhattanDistance(0, 0, 0, 0)).toBe(0);
            expect(calculateManhattanDistance(-2, -3, 1, 1)).toBe(7);
        });

        test('handles horizontal and vertical distances', () => {
            expect(calculateManhattanDistance(0, 0, 5, 0)).toBe(5);
            expect(calculateManhattanDistance(0, 0, 0, 5)).toBe(5);
        });
    });

    describe('coordinatesEqual', () => {
        test('identifies equal coordinates', () => {
            expect(coordinatesEqual(5, 10, 5, 10)).toBe(true);
            expect(coordinatesEqual(0, 0, 0, 0)).toBe(true);
            expect(coordinatesEqual(-1, -2, -1, -2)).toBe(true);
        });

        test('identifies unequal coordinates', () => {
            expect(coordinatesEqual(5, 10, 5, 11)).toBe(false);
            expect(coordinatesEqual(5, 10, 6, 10)).toBe(false);
            expect(coordinatesEqual(5, 10, 6, 11)).toBe(false);
        });
    });

    describe('getNeighboringPixels', () => {
        test('returns 4-directional neighbors correctly', () => {
            const neighbors = getNeighboringPixels(100, 200);

            expect(neighbors).toHaveLength(4);
            expect(neighbors).toContainEqual({
                absX: 100,
                absY: 199,
                direction: 'up',
            });
            expect(neighbors).toContainEqual({
                absX: 101,
                absY: 200,
                direction: 'right',
            });
            expect(neighbors).toContainEqual({
                absX: 100,
                absY: 201,
                direction: 'down',
            });
            expect(neighbors).toContainEqual({
                absX: 99,
                absY: 200,
                direction: 'left',
            });
        });

        test('handles zero coordinates', () => {
            const neighbors = getNeighboringPixels(0, 0);

            expect(neighbors).toContainEqual({
                absX: 0,
                absY: -1,
                direction: 'up',
            });
            expect(neighbors).toContainEqual({
                absX: 1,
                absY: 0,
                direction: 'right',
            });
            expect(neighbors).toContainEqual({
                absX: 0,
                absY: 1,
                direction: 'down',
            });
            expect(neighbors).toContainEqual({
                absX: -1,
                absY: 0,
                direction: 'left',
            });
        });
    });

    describe('getAllNeighboringPixels', () => {
        test('returns 8-directional neighbors correctly', () => {
            const neighbors = getAllNeighboringPixels(100, 200);

            expect(neighbors).toHaveLength(8);
            expect(neighbors).toContainEqual({
                absX: 99,
                absY: 199,
                direction: 'up-left',
            });
            expect(neighbors).toContainEqual({
                absX: 100,
                absY: 199,
                direction: 'up',
            });
            expect(neighbors).toContainEqual({
                absX: 101,
                absY: 199,
                direction: 'up-right',
            });
            expect(neighbors).toContainEqual({
                absX: 101,
                absY: 200,
                direction: 'right',
            });
            expect(neighbors).toContainEqual({
                absX: 101,
                absY: 201,
                direction: 'down-right',
            });
            expect(neighbors).toContainEqual({
                absX: 100,
                absY: 201,
                direction: 'down',
            });
            expect(neighbors).toContainEqual({
                absX: 99,
                absY: 201,
                direction: 'down-left',
            });
            expect(neighbors).toContainEqual({
                absX: 99,
                absY: 200,
                direction: 'left',
            });
        });

        test('includes all cardinal and diagonal directions', () => {
            const neighbors = getAllNeighboringPixels(0, 0);
            const directions = neighbors.map(n => n.direction);

            expect(directions).toContain('up');
            expect(directions).toContain('up-right');
            expect(directions).toContain('right');
            expect(directions).toContain('down-right');
            expect(directions).toContain('down');
            expect(directions).toContain('down-left');
            expect(directions).toContain('left');
            expect(directions).toContain('up-left');
        });
    });
});
