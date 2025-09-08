// WPlace Auto-Image Bot - Protection Manager
// Enhanced protection utilities derived from remote script analysis and best practices

/**
 * ProtectionManager provides anti-detection and request protection utilities
 * Based on patterns observed in the remote script and security best practices
 */
export class ProtectionManager {
    constructor() {
        this.requestTimings = [];
        this.lastRequestTime = 0;
        this.requestCounter = 0;
        this.initialized = false;
    }

    /**
     * Initialize protection mechanisms
     */
    initialize() {
        if (this.initialized) return;

        console.log('🛡️ Protection Manager initialized');
        this.initialized = true;

        // Clear old timings periodically to prevent memory leaks
        setInterval(() => this.cleanupTimings(), 60000); // Every minute
    }

    /**
     * Generate randomized delays to avoid detection patterns
     * @param {number} baseDelay - Base delay in milliseconds
     * @param {number} variance - Maximum variance as a percentage (0-1)
     * @returns {number} Randomized delay
     */
    generateRandomDelay(baseDelay = 1000, variance = 0.3) {
        const minDelay = baseDelay * (1 - variance);
        const maxDelay = baseDelay * (1 + variance);
        return Math.random() * (maxDelay - minDelay) + minDelay;
    }

    /**
     * Add jitter to requests to make them appear more human-like
     * @param {number} baseDelay - Base delay in milliseconds
     * @returns {Promise} Promise that resolves after the jittered delay
     */
    async addRequestJitter(baseDelay = 500) {
        const jitteredDelay = this.generateRandomDelay(baseDelay, 0.5);
        return new Promise(resolve => setTimeout(resolve, jitteredDelay));
    }

    /**
     * Track request timing for pattern analysis
     * @param {string} requestType - Type of request being made
     */
    trackRequest(requestType = 'generic') {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        this.requestTimings.push({
            timestamp: now,
            type: requestType,
            interval: timeSinceLastRequest,
            counter: ++this.requestCounter,
        });

        this.lastRequestTime = now;

        // Keep only last 100 requests to prevent memory bloat
        if (this.requestTimings.length > 100) {
            this.requestTimings.shift();
        }
    }

    /**
     * Check if current request pattern might be suspicious
     * @returns {boolean} True if pattern seems suspicious
     */
    isPatternSuspicious() {
        if (this.requestTimings.length < 5) return false;

        const recent = this.requestTimings.slice(-5);
        const intervals = recent.map(r => r.interval).filter(i => i > 0);

        if (intervals.length < 2) return false;

        // Check for too-regular patterns (same intervals)
        const avgInterval =
            intervals.reduce((a, b) => a + b) / intervals.length;
        const variance =
            intervals.reduce(
                (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
                0
            ) / intervals.length;

        // If variance is very low, requests are too regular
        const suspiciouslyRegular = variance < avgInterval * 0.1;

        // Check for requests that are too frequent
        const tooFrequent = avgInterval < 100; // Less than 100ms between requests

        return suspiciouslyRegular || tooFrequent;
    }

    /**
     * Get protection statistics for debugging
     * @returns {Object} Protection statistics
     */
    getStats() {
        const recent = this.requestTimings.slice(-10);
        const intervals = recent.map(r => r.interval).filter(i => i > 0);
        const avgInterval =
            intervals.length > 0
                ? intervals.reduce((a, b) => a + b) / intervals.length
                : 0;

        return {
            totalRequests: this.requestCounter,
            recentRequestCount: recent.length,
            averageInterval: Math.round(avgInterval),
            suspicious: this.isPatternSuspicious(),
            initialized: this.initialized,
            lastRequestAge: Date.now() - this.lastRequestTime,
        };
    }

    /**
     * Clean up old timing data to prevent memory leaks
     */
    cleanupTimings() {
        const cutoff = Date.now() - 5 * 60 * 1000; // 5 minutes ago
        this.requestTimings = this.requestTimings.filter(
            timing => timing.timestamp > cutoff
        );
    }

    /**
     * Generate a human-like mouse movement pattern
     * Useful for simulating natural interaction
     * @param {number} steps - Number of steps in the movement
     * @returns {Array} Array of {x, y} coordinates
     */
    generateHumanMousePath(startX, startY, endX, endY, steps = 10) {
        const path = [];
        const dx = endX - startX;
        const dy = endY - startY;

        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;

            // Add some curve and randomness to make it look natural
            const curve = Math.sin(progress * Math.PI) * 0.1;
            const randomX = (Math.random() - 0.5) * 2;
            const randomY = (Math.random() - 0.5) * 2;

            const x = startX + dx * progress + dy * curve + randomX;
            const y = startY + dy * progress - dx * curve + randomY;

            path.push({ x: Math.round(x), y: Math.round(y) });
        }

        return path;
    }

    /**
     * Simulate human-like typing patterns
     * @param {string} text - Text to type
     * @returns {Array} Array of {char, delay} objects
     */
    generateTypingPattern(text) {
        const pattern = [];
        const baseDelay = 150; // Base typing speed

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            let delay = this.generateRandomDelay(baseDelay, 0.4);

            // Longer delays for punctuation and spaces
            if (/[.,!?;:]/.test(char)) delay *= 1.5;
            if (char === ' ') delay *= 0.7;

            pattern.push({ char, delay: Math.round(delay) });
        }

        return pattern;
    }
}

/**
 * Create and export a global protection manager instance
 */
export const protectionManager = new ProtectionManager();

/**
 * Utility function to add protection delay
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves after protected delay
 */
export async function addProtectionDelay(baseDelay = 1000) {
    return protectionManager.addRequestJitter(baseDelay);
}

/**
 * Utility function to track a protected request
 * @param {string} requestType - Type of request
 */
export function trackProtectedRequest(requestType = 'generic') {
    protectionManager.trackRequest(requestType);
}
