/**
 * Image processing utilities for WPlace AutoBot
 * Pure functions extracted for testing purposes
 */

/**
 * Get RGBA pixel data from ImageData at specific coordinates
 * @param {ImageData} imageData - Canvas ImageData object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Array<number>|null} RGBA values [r, g, b, a] or null if out of bounds
 */
export function getPixelFromImageData(imageData, x, y) {
    if (
        !imageData ||
        x < 0 ||
        y < 0 ||
        x >= imageData.width ||
        y >= imageData.height
    ) {
        return null;
    }

    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;

    return [
        data[index], // R
        data[index + 1], // G
        data[index + 2], // B
        data[index + 3], // A
    ];
}

/**
 * Set RGBA pixel data in ImageData at specific coordinates
 * @param {ImageData} imageData - Canvas ImageData object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Array<number>} rgba - RGBA values [r, g, b, a]
 * @returns {boolean} True if pixel was set, false if out of bounds
 */
export function setPixelInImageData(imageData, x, y, rgba) {
    if (
        !imageData ||
        x < 0 ||
        y < 0 ||
        x >= imageData.width ||
        y >= imageData.height
    ) {
        return false;
    }

    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;

    data[index] = rgba[0]; // R
    data[index + 1] = rgba[1]; // G
    data[index + 2] = rgba[2]; // B
    data[index + 3] = rgba[3]; // A

    return true;
}

/**
 * Check if a pixel is transparent based on alpha threshold
 * @param {Array<number>} rgba - RGBA values [r, g, b, a]
 * @param {number} threshold - Alpha threshold (0-255)
 * @returns {boolean} True if pixel is transparent
 */
export function isPixelTransparent(rgba, threshold = 100) {
    if (!rgba || !Array.isArray(rgba) || rgba.length < 4) {
        return false;
    }
    return rgba[3] < threshold;
}

/**
 * Check if a pixel is close to white based on RGB threshold
 * @param {Array<number>} rgb - RGB values [r, g, b]
 * @param {number} threshold - White threshold (0-255)
 * @returns {boolean} True if pixel is close to white
 */
export function isPixelWhite(rgb, threshold = 250) {
    if (!rgb || !Array.isArray(rgb) || rgb.length < 3) {
        return false;
    }
    return rgb[0] >= threshold && rgb[1] >= threshold && rgb[2] >= threshold;
}

/**
 * Calculate the index for a pixel in a flat RGBA array
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Image width
 * @returns {number} Array index for the pixel's red component
 */
export function getPixelIndex(x, y, width) {
    return (y * width + x) * 4;
}

/**
 * Apply blue marble effect to pixel data
 * @param {Uint8ClampedArray} data - RGBA pixel data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} intensity - Effect intensity (0-1)
 * @returns {Uint8ClampedArray} Modified pixel data
 */
export function applyBlueMarbleEffect(data, width, height, intensity = 0.5) {
    const result = new Uint8ClampedArray(data);

    for (let i = 0; i < result.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);

        // Simple marble pattern based on coordinates
        const marblePattern = Math.sin(x * 0.1) * Math.cos(y * 0.1) * intensity;

        // Apply blue tint with marble pattern
        result[i] = Math.max(0, Math.min(255, result[i] - marblePattern * 50)); // R
        result[i + 1] = Math.max(
            0,
            Math.min(255, result[i + 1] - marblePattern * 30)
        ); // G
        result[i + 2] = Math.max(
            0,
            Math.min(255, result[i + 2] + marblePattern * 80)
        ); // B
        // Alpha unchanged
    }

    return result;
}

/**
 * Resize image data using nearest neighbor scaling
 * @param {Uint8ClampedArray} sourceData - Source RGBA pixel data
 * @param {number} sourceWidth - Source width
 * @param {number} sourceHeight - Source height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {Uint8ClampedArray} Resized pixel data
 */
export function resizeImageData(
    sourceData,
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight
) {
    const result = new Uint8ClampedArray(targetWidth * targetHeight * 4);

    const scaleX = sourceWidth / targetWidth;
    const scaleY = sourceHeight / targetHeight;

    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
            const sourceX = Math.floor(x * scaleX);
            const sourceY = Math.floor(y * scaleY);

            const sourceIndex = getPixelIndex(sourceX, sourceY, sourceWidth);
            const targetIndex = getPixelIndex(x, y, targetWidth);

            result[targetIndex] = sourceData[sourceIndex]; // R
            result[targetIndex + 1] = sourceData[sourceIndex + 1]; // G
            result[targetIndex + 2] = sourceData[sourceIndex + 2]; // B
            result[targetIndex + 3] = sourceData[sourceIndex + 3]; // A
        }
    }

    return result;
}
