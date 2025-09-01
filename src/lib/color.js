/**
 * Color utility functions for WPlace AutoBot
 * Pure functions extracted for testing purposes
 */

/**
 * Convert RGB color to CIE LAB color space for perceptual color matching.
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {Array<number>} LAB color as [L, a, b] where L is lightness, a and b are color-opponent dimensions
 */
export function rgbToLab(r, g, b) {
    // sRGB -> linear
    const srgbToLinear = v => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);
    let X = rl * 0.4124 + gl * 0.3576 + bl * 0.1805;
    let Y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
    let Z = rl * 0.0193 + gl * 0.1192 + bl * 0.9505;
    X /= 0.95047;
    Y /= 1.0;
    Z /= 1.08883;
    const f = t => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fX = f(X),
        fY = f(Y),
        fZ = f(Z);
    const L = 116 * fY - 16;
    const a = 500 * (fX - fY);
    const b2 = 200 * (fY - fZ);
    return [L, a, b2];
}

/**
 * Calculate the Euclidean distance between two LAB color values
 * @param {Array<number>} lab1 - First LAB color as [L, a, b]
 * @param {Array<number>} lab2 - Second LAB color as [L, a, b]
 * @returns {number} Distance between the colors
 */
export function labDistance(lab1, lab2) {
    return Math.sqrt(
        Math.pow(lab1[0] - lab2[0], 2) +
            Math.pow(lab1[1] - lab2[1], 2) +
            Math.pow(lab1[2] - lab2[2], 2)
    );
}

/**
 * Find the closest color from available palette using LAB color space distance
 * @param {Array<number>} targetRgb - Target RGB color as [r, g, b]
 * @param {Array<{id: number, rgb: {r: number, g: number, b: number}}>} availableColors - Available color palette
 * @returns {number} The ID of the closest available color
 */
export function findClosestColor(targetRgb, availableColors) {
    if (!availableColors || availableColors.length === 0) return 1;

    const targetLab = rgbToLab(targetRgb[0], targetRgb[1], targetRgb[2]);
    let minDistance = Infinity;
    let closestColorId = 1;

    for (const color of availableColors) {
        const colorRgb = [color.rgb.r, color.rgb.g, color.rgb.b];
        const colorLab = rgbToLab(colorRgb[0], colorRgb[1], colorRgb[2]);
        const distance = labDistance(targetLab, colorLab);

        if (distance < minDistance) {
            minDistance = distance;
            closestColorId = color.id;
        }
    }

    return closestColorId;
}
