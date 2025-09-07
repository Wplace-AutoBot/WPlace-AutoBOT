// WPlace Auto-Image Bot - Image Processing Module
// Extracted from Auto-Image.js as part of code restructuring

/**
 * ImageProcessor class for handling image loading, resizing, and pixel data extraction.
 * Provides canvas-based image manipulation with support for pixel-perfect scaling.
 */
export class ImageProcessor {
    constructor(imageSrc) {
        this.imageSrc = imageSrc;
        this.img = null;
        this.canvas = null;
        this.ctx = null;
    }

    async load() {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.crossOrigin = 'anonymous';
            this.img.onload = () => {
                this.canvas = document.createElement('canvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = this.img.width;
                this.canvas.height = this.img.height;
                this.ctx.drawImage(this.img, 0, 0);
                resolve();
            };
            this.img.onerror = reject;
            this.img.src = this.imageSrc;
        });
    }

    getDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
        };
    }

    getPixelData() {
        return this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        ).data;
    }

    resize(newWidth, newHeight) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight);

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(tempCanvas, 0, 0);

        return this.ctx.getImageData(0, 0, newWidth, newHeight).data;
    }

    generatePreview(width, height) {
        const previewCanvas = document.createElement('canvas');
        const previewCtx = previewCanvas.getContext('2d');

        previewCanvas.width = width;
        previewCanvas.height = height;

        previewCtx.imageSmoothingEnabled = false;
        previewCtx.drawImage(this.img, 0, 0, width, height);

        return previewCanvas.toDataURL();
    }
}
