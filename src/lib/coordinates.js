/**
 * Coordinate and pixel conversion utilities for WPlace AutoBot
 * Pure functions extracted for testing purposes
 */

/**
 * Convert absolute coordinates to region and pixel coordinates
 * WPlace uses a tiling system where each region is 1000x1000 pixels
 * @param {number} absX - Absolute X coordinate
 * @param {number} absY - Absolute Y coordinate
 * @returns {Object} Object with regionX, regionY, pixelX, pixelY
 */
export function absoluteToRegionCoords(absX, absY) {
    const regionX = Math.floor(absX / 1000);
    const regionY = Math.floor(absY / 1000);

    // Handle negative coordinates properly for pixel calculation
    let pixelX = absX % 1000;
    let pixelY = absY % 1000;

    // JavaScript modulo with negative numbers needs adjustment
    if (pixelX < 0) pixelX += 1000;
    if (pixelY < 0) pixelY += 1000;

    return { regionX, regionY, pixelX, pixelY };
}

/**
 * Convert region and pixel coordinates to absolute coordinates
 * @param {number} regionX - Region X coordinate
 * @param {number} regionY - Region Y coordinate
 * @param {number} pixelX - Pixel X coordinate within region (0-999)
 * @param {number} pixelY - Pixel Y coordinate within region (0-999)
 * @returns {Object} Object with absX, absY
 */
export function regionToAbsoluteCoords(regionX, regionY, pixelX, pixelY) {
    const absX = regionX * 1000 + pixelX;
    const absY = regionY * 1000 + pixelY;

    return { absX, absY };
}

/**
 * Calculate tile key for a given region coordinate
 * @param {number} regionX - Region X coordinate
 * @param {number} regionY - Region Y coordinate
 * @returns {string} Tile key in format "regionX,regionY"
 */
export function getTileKey(regionX, regionY) {
    return `${regionX},${regionY}`;
}

/**
 * Parse tile key back to region coordinates
 * @param {string} tileKey - Tile key in format "regionX,regionY"
 * @returns {Object|null} Object with regionX, regionY or null if invalid
 */
export function parseTileKey(tileKey) {
    if (!tileKey || typeof tileKey !== 'string') {
        return null;
    }

    const parts = tileKey.split(',');
    if (parts.length !== 2) {
        return null;
    }

    const regionX = parseInt(parts[0], 10);
    const regionY = parseInt(parts[1], 10);

    if (isNaN(regionX) || isNaN(regionY)) {
        return null;
    }

    return { regionX, regionY };
}

/**
 * Check if pixel coordinates are within valid region bounds
 * @param {number} pixelX - Pixel X coordinate
 * @param {number} pixelY - Pixel Y coordinate
 * @returns {boolean} True if coordinates are valid (0-999)
 */
export function isValidPixelCoord(pixelX, pixelY) {
    return pixelX >= 0 && pixelX < 1000 && pixelY >= 0 && pixelY < 1000;
}

/**
 * Clamp pixel coordinates to valid region bounds
 * @param {number} pixelX - Pixel X coordinate
 * @param {number} pixelY - Pixel Y coordinate
 * @returns {Object} Object with clamped pixelX, pixelY
 */
export function clampPixelCoords(pixelX, pixelY) {
    return {
        pixelX: Math.max(0, Math.min(999, pixelX)),
        pixelY: Math.max(0, Math.min(999, pixelY)),
    };
}

/**
 * Calculate distance between two absolute coordinates
 * @param {number} x1 - First point X coordinate
 * @param {number} y1 - First point Y coordinate
 * @param {number} x2 - Second point X coordinate
 * @param {number} y2 - Second point Y coordinate
 * @returns {number} Euclidean distance between the points
 */
export function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate Manhattan distance between two absolute coordinates
 * @param {number} x1 - First point X coordinate
 * @param {number} y1 - First point Y coordinate
 * @param {number} x2 - Second point X coordinate
 * @param {number} y2 - Second point Y coordinate
 * @returns {number} Manhattan distance between the points
 */
export function calculateManhattanDistance(x1, y1, x2, y2) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}

/**
 * Check if two coordinate pairs represent the same position
 * @param {number} x1 - First point X coordinate
 * @param {number} y1 - First point Y coordinate
 * @param {number} x2 - Second point X coordinate
 * @param {number} y2 - Second point Y coordinate
 * @returns {boolean} True if coordinates are the same
 */
export function coordinatesEqual(x1, y1, x2, y2) {
    return x1 === x2 && y1 === y2;
}

/**
 * Get neighboring pixel coordinates (4-directional)
 * @param {number} absX - Absolute X coordinate
 * @param {number} absY - Absolute Y coordinate
 * @returns {Array<Object>} Array of neighboring coordinates with direction labels
 */
export function getNeighboringPixels(absX, absY) {
    return [
        { absX: absX, absY: absY - 1, direction: 'up' },
        { absX: absX + 1, absY: absY, direction: 'right' },
        { absX: absX, absY: absY + 1, direction: 'down' },
        { absX: absX - 1, absY: absY, direction: 'left' },
    ];
}

/**
 * Get neighboring pixel coordinates (8-directional, including diagonals)
 * @param {number} absX - Absolute X coordinate
 * @param {number} absY - Absolute Y coordinate
 * @returns {Array<Object>} Array of all neighboring coordinates with direction labels
 */
export function getAllNeighboringPixels(absX, absY) {
    return [
        { absX: absX - 1, absY: absY - 1, direction: 'up-left' },
        { absX: absX, absY: absY - 1, direction: 'up' },
        { absX: absX + 1, absY: absY - 1, direction: 'up-right' },
        { absX: absX + 1, absY: absY, direction: 'right' },
        { absX: absX + 1, absY: absY + 1, direction: 'down-right' },
        { absX: absX, absY: absY + 1, direction: 'down' },
        { absX: absX - 1, absY: absY + 1, direction: 'down-left' },
        { absX: absX - 1, absY: absY, direction: 'left' },
    ];
}
