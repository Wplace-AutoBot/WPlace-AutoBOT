// WPlace Auto-Image Bot - Token Management Module
// Extracted from Auto-Image.js as part of code restructuring

/**
 * TokenManager class for handling Turnstile token lifecycle and CAPTCHA operations.
 * Provides centralized token management with caching, validation, and retry logic.
 */
export class TokenManager {
    constructor(Utils) {
        this.Utils = Utils;
        this.turnstileToken = null;
        this.tokenExpiryTime = 0;
        this.tokenGenerationInProgress = false;
        this._resolveToken = null;
        this.tokenPromise = new Promise(resolve => {
            this._resolveToken = resolve;
        });
        this.retryCount = 0;
        this.MAX_RETRIES = 10;
        this.MAX_BATCH_RETRIES = 10; // Maximum attempts for batch sending
        this.TOKEN_LIFETIME = 240000; // 4 minutes (tokens typically last 5 min, use 4 for safety)
    }

    /**
     * Set a new Turnstile token and update expiry time.
     * @param {string} token - The Turnstile token to set
     */
    setTurnstileToken(token) {
        if (this._resolveToken) {
            this._resolveToken(token);
            this._resolveToken = null;
        }
        this.turnstileToken = token;
        this.tokenExpiryTime = Date.now() + this.TOKEN_LIFETIME;
        console.log('✅ Turnstile token set successfully');
    }

    /**
     * Check if the current Turnstile token is valid and not expired.
     * @returns {boolean} True if token exists and hasn't expired
     */
    isTokenValid() {
        return this.turnstileToken && Date.now() < this.tokenExpiryTime;
    }

    /**
     * Invalidate the current Turnstile token by clearing it and expiry time.
     */
    invalidateToken() {
        this.turnstileToken = null;
        this.tokenExpiryTime = 0;
        console.log('🗑️ Token invalidated, will force fresh generation');
    }

    /**
     * Get the current token if valid.
     * @returns {string|null} The current token or null if invalid
     */
    getToken() {
        return this.isTokenValid() ? this.turnstileToken : null;
    }

    /**
     * Ensure a valid Turnstile token is available, generating one if needed.
     * @param {boolean} [forceRefresh=false] - Force generation of a new token even if current is valid
     * @returns {Promise<string|null>} The valid token or null if generation failed
     */
    async ensureToken(forceRefresh = false) {
        // Return cached token if still valid and not forcing refresh
        if (this.isTokenValid() && !forceRefresh) {
            return this.turnstileToken;
        }

        // Invalidate token if forcing refresh
        if (forceRefresh) this.invalidateToken();

        // Avoid multiple simultaneous token generations
        if (this.tokenGenerationInProgress) {
            console.log('🔄 Token generation already in progress, waiting...');
            await this.Utils.sleep(2000);
            return this.isTokenValid() ? this.turnstileToken : null;
        }

        this.tokenGenerationInProgress = true;

        try {
            console.log('🔄 Token expired or missing, generating new one...');
            const token = await this.handleCaptchaWithRetry();
            if (token && token.length > 20) {
                this.setTurnstileToken(token);
                console.log('✅ Token captured and cached successfully');
                return token;
            }

            console.log(
                '⚠️ Invisible Turnstile failed, forcing browser automation...'
            );
            const fallbackToken = await this.handleCaptchaFallback();
            if (fallbackToken && fallbackToken.length > 20) {
                this.setTurnstileToken(fallbackToken);
                console.log('✅ Fallback token captured successfully');
                return fallbackToken;
            }

            console.log('❌ All token generation methods failed');
            return null;
        } finally {
            this.tokenGenerationInProgress = false;
        }
    }

    /**
     * Handle Turnstile CAPTCHA generation with retry logic.
     * Attempts to obtain sitekey and generate token using invisible method.
     * @returns {Promise<string|null>} The generated token or null if failed
     */
    async handleCaptchaWithRetry() {
        const startTime = performance.now();

        try {
            const { sitekey, token: preGeneratedToken } =
                await this.Utils.obtainSitekeyAndToken();

            if (!sitekey) {
                throw new Error('No valid sitekey found');
            }

            console.log('🔑 Using sitekey:', sitekey);

            if (typeof window !== 'undefined' && window.navigator) {
                console.log(
                    '🧭 UA:',
                    window.navigator.userAgent.substring(0, 50) + '...',
                    'Platform:',
                    window.navigator.platform
                );
            }

            let token = null;

            if (
                preGeneratedToken &&
                typeof preGeneratedToken === 'string' &&
                preGeneratedToken.length > 20
            ) {
                console.log('♻️ Reusing pre-generated Turnstile token');
                token = preGeneratedToken;
            } else {
                if (this.isTokenValid()) {
                    console.log(
                        '♻️ Using existing cached token (from previous session)'
                    );
                    token = this.turnstileToken;
                } else {
                    console.log(
                        '🔐 Generating new token with executeTurnstile...'
                    );
                    const result = await this.Utils.obtainSitekeyAndToken();
                    token = result.token;
                    if (token) this.setTurnstileToken(token);
                }
            }

            if (token && typeof token === 'string' && token.length > 20) {
                const elapsed = Math.round(performance.now() - startTime);
                console.log(
                    `✅ Turnstile token generated successfully in ${elapsed}ms`
                );
                return token;
            } else {
                throw new Error(
                    `Invalid or empty token received - Length: ${token?.length || 0}`
                );
            }
        } catch (error) {
            const elapsed = Math.round(performance.now() - startTime);
            console.error(
                `❌ Turnstile token generation failed after ${elapsed}ms:`,
                error
            );
            throw error;
        }
    }

    /**
     * Fallback method for CAPTCHA token generation when primary method fails.
     * @returns {Promise<string|null>} The fallback token or null if not implemented
     */
    async handleCaptchaFallback() {
        return new Promise(async (resolve, reject) => {
            try {
                // Ensure we have a fresh promise to await for a new token capture
                if (!this._resolveToken) {
                    this.tokenPromise = new Promise(res => {
                        this._resolveToken = res;
                    });
                }
                const timeoutPromise = this.Utils.sleep(20000).then(() =>
                    reject(new Error('Auto-CAPTCHA timed out.'))
                );

                const solvePromise = (async () => {
                    const mainPaintBtn = await this.Utils.waitForSelector(
                        'button.btn.btn-primary.btn-lg, button.btn-primary.sm\\:btn-xl',
                        200,
                        10000
                    );
                    if (!mainPaintBtn)
                        throw new Error(
                            'Could not find the main paint button.'
                        );
                    mainPaintBtn.click();
                    await this.Utils.sleep(500);

                    const transBtn = await this.Utils.waitForSelector(
                        'button#color-0',
                        200,
                        5000
                    );
                    if (!transBtn)
                        throw new Error(
                            'Could not find the transparent color button.'
                        );
                    transBtn.click();
                    await this.Utils.sleep(500);

                    const canvas = await this.Utils.waitForSelector(
                        'canvas',
                        200,
                        5000
                    );
                    if (!canvas)
                        throw new Error('Could not find the canvas element.');

                    canvas.setAttribute('tabindex', '0');
                    canvas.focus();
                    const rect = canvas.getBoundingClientRect();
                    const centerX = Math.round(rect.left + rect.width / 2);
                    const centerY = Math.round(rect.top + rect.height / 2);

                    canvas.dispatchEvent(
                        new MouseEvent('mousemove', {
                            clientX: centerX,
                            clientY: centerY,
                            bubbles: true,
                        })
                    );
                    canvas.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            key: ' ',
                            code: 'Space',
                            bubbles: true,
                        })
                    );
                    await this.Utils.sleep(50);
                    canvas.dispatchEvent(
                        new KeyboardEvent('keyup', {
                            key: ' ',
                            code: 'Space',
                            bubbles: true,
                        })
                    );
                    await this.Utils.sleep(500);

                    // 800ms delay before sending confirmation
                    await this.Utils.sleep(800);

                    // Keep confirming until token is captured
                    const confirmLoop = async () => {
                        while (!this.turnstileToken) {
                            let confirmBtn = await this.Utils.waitForSelector(
                                'button.btn.btn-primary.btn-lg, button.btn.btn-primary.sm\\:btn-xl'
                            );
                            if (!confirmBtn) {
                                const allPrimary = Array.from(
                                    document.querySelectorAll(
                                        'button.btn-primary'
                                    )
                                );
                                confirmBtn = allPrimary.length
                                    ? allPrimary[allPrimary.length - 1]
                                    : null;
                            }
                            if (confirmBtn) {
                                confirmBtn.click();
                            }
                            await this.Utils.sleep(500); // 500ms delay between confirmation attempts
                        }
                    };

                    // Start confirmation loop and wait for token
                    confirmLoop();
                    const token = await this.tokenPromise;
                    await this.Utils.sleep(300); // small delay after token is captured
                    resolve(token);
                })();

                await Promise.race([solvePromise, timeoutPromise]);
            } catch (error) {
                console.error('Auto-CAPTCHA process failed:', error);
                reject(error);
            }
        });
    }

    /**
     * Handle CAPTCHA token generation based on state preferences.
     * Supports generator, manual, and hybrid modes.
     * @param {Object} state - Application state object
     * @returns {Promise<string|null>} The generated token or null if failed
     */
    async handleCaptcha(state) {
        const startTime = performance.now();

        // Check user's token source preference
        if (state.tokenSource === 'manual') {
            console.log(
                '🎯 Manual token source selected - using pixel placement automation'
            );
            return await this.handleCaptchaFallback();
        }

        // Generator mode (pure) or Hybrid mode - try generator first
        try {
            // Use optimized token generation with automatic sitekey detection
            const { sitekey, token: preGeneratedToken } =
                await this.Utils.obtainSitekeyAndToken();

            if (!sitekey) {
                throw new Error('No valid sitekey found');
            }

            console.log('🔑 Generating Turnstile token for sitekey:', sitekey);
            console.log(
                '🧭 UA:',
                navigator.userAgent.substring(0, 50) + '...',
                'Platform:',
                navigator.platform
            );

            // Add additional checks before token generation
            if (!window.turnstile) {
                // TurnstileManager will be initialized when needed
            }

            let token = null;

            // ✅ Reuse pre-generated token if available and valid
            if (
                preGeneratedToken &&
                typeof preGeneratedToken === 'string' &&
                preGeneratedToken.length > 20
            ) {
                console.log(
                    '♻️ Reusing pre-generated token from sitekey detection phase'
                );
                token = preGeneratedToken;
            }
            // ✅ Or use globally cached token if still valid
            else if (this.isTokenValid()) {
                console.log(
                    '♻️ Using existing cached token (from previous operation)'
                );
                token = this.turnstileToken;
            }
            // ✅ Otherwise generate a new one
            else {
                console.log(
                    '🔐 No valid pre-generated or cached token, creating new one...'
                );
                token = await this.Utils.executeTurnstile(sitekey, 'paint');
                if (token) {
                    this.setTurnstileToken(token);
                }
            }

            // 📊 Debug log
            console.log(
                `🔍 Token received - Type: ${typeof token}, Value: ${
                    token
                        ? typeof token === 'string'
                            ? token.length > 50
                                ? token.substring(0, 50) + '...'
                                : token
                            : JSON.stringify(token)
                        : 'null/undefined'
                }, Length: ${token?.length || 0}`
            );

            // ✅ Final validation
            if (typeof token === 'string' && token.length > 20) {
                const duration = Math.round(performance.now() - startTime);
                console.log(
                    `✅ Turnstile token generated successfully in ${duration}ms`
                );
                return token;
            } else {
                throw new Error(
                    `Invalid or empty token received - Type: ${typeof token}, Value: ${JSON.stringify(
                        token
                    )}, Length: ${token?.length || 0}`
                );
            }
        } catch (error) {
            const duration = Math.round(performance.now() - startTime);
            console.error(
                `❌ Turnstile token generation failed after ${duration}ms:`,
                error
            );

            // Fallback to manual pixel placement for hybrid mode
            if (state.tokenSource === 'hybrid') {
                console.log(
                    '🔄 Hybrid mode: Generator failed, automatically switching to manual pixel placement...'
                );
                const fbToken = await this.handleCaptchaFallback();
                return fbToken;
            } else {
                // Pure generator mode - don't fallback, just fail
                throw error;
            }
        }
    }
}
