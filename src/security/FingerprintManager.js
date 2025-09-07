// WPlace Auto-Image Bot - Fingerprint Manager
// Ported from remote script fixes for improved fingerprinting and security

/**
 * Enhanced fingerprint generation using cryptographically secure random when available
 * This is a fix from the remote script that improves upon basic fingerprinting
 */
export class FingerprintManager {
    constructor() {
        this.fingerprint = null;
        this.initialize();
    }

    /**
     * Generate a random string with enhanced security
     * Uses crypto.getRandomValues when available for cryptographic security
     * Falls back to Math.random() for compatibility
     *
     * @param {number} len - Length of the random string to generate
     * @param {string} chars - Character set to use for generation
     * @returns {string} Generated random string
     */
    static generateSecureRandomString(
        len,
        chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    ) {
        return [...Array(len)]
            .map(
                () =>
                    chars[
                        crypto?.getRandomValues?.(new Uint32Array(1))[0] %
                            chars.length ||
                            Math.floor(Math.random() * chars.length)
                    ]
            )
            .join('');
    }

    /**
     * Initialize the fingerprint manager and generate a unique fingerprint
     * This creates a 32-character fingerprint that remains consistent for the session
     */
    initialize() {
        // Generate a 32-character fingerprint using secure randomization
        this.fingerprint = FingerprintManager.generateSecureRandomString(32);
        console.log(
            `🔐 Fingerprint initialized: ${this.fingerprint.substring(0, 8)}...`
        );
    }

    /**
     * Get the current fingerprint for use in requests
     * @returns {string} The current fingerprint
     */
    getFingerprint() {
        return this.fingerprint;
    }

    /**
     * Regenerate the fingerprint (use sparingly to avoid detection)
     * @returns {string} The new fingerprint
     */
    regenerateFingerprint() {
        console.log('🔄 Regenerating fingerprint for enhanced security');
        this.fingerprint = FingerprintManager.generateSecureRandomString(32);
        console.log(
            `🔐 New fingerprint: ${this.fingerprint.substring(0, 8)}...`
        );
        return this.fingerprint;
    }

    /**
     * Validate that the fingerprint meets security requirements
     * @returns {boolean} True if fingerprint is valid
     */
    isValid() {
        return (
            this.fingerprint &&
            typeof this.fingerprint === 'string' &&
            this.fingerprint.length === 32 &&
            /^[a-z0-9]+$/.test(this.fingerprint)
        );
    }

    /**
     * Get fingerprint metadata for debugging
     * @returns {Object} Fingerprint metadata
     */
    getMetadata() {
        return {
            length: this.fingerprint?.length || 0,
            valid: this.isValid(),
            preview: this.fingerprint
                ? `${this.fingerprint.substring(0, 8)}...`
                : 'none',
            cryptoSupported: typeof crypto?.getRandomValues === 'function',
            timestamp: Date.now(),
        };
    }
}

/**
 * Create and export a global fingerprint manager instance
 * This ensures consistent fingerprinting across the application
 */
export const fingerprintManager = new FingerprintManager();

/**
 * Utility function to get the current fingerprint
 * @returns {string} Current fingerprint
 */
export function getCurrentFingerprint() {
    return fingerprintManager.getFingerprint();
}

/**
 * Utility function to check if crypto random is available
 * @returns {boolean} True if crypto.getRandomValues is supported
 */
export function isCryptoRandomSupported() {
    return typeof crypto?.getRandomValues === 'function';
}
