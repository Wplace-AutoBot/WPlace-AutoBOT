import { TurnstileError } from './errors.js';
import { getCurrentTheme, getCurrentThemeName } from '../core/theme.js';

export class TurnstileManager {
    constructor(config = {}) {
        this.siteKey = config.siteKey;
        this.size = config.size || 'normal';
        this.retryInterval = config.retryInterval || 5000;

        this.widget = null;
        this.container = null;
        this.isLoaded = false;
        this.currentToken = null;
    }

    _getTurnstileTheme() {
        const currentTheme = getCurrentThemeName();
        console.log('🎨 Current bot theme:', currentTheme);

        // Map bot themes to Turnstile themes
        if (currentTheme === 'Classic Light') {
            return 'light';
        } else if (
            currentTheme === 'Classic Autobot' ||
            currentTheme === 'Neon Retro'
        ) {
            return 'dark';
        }

        // Default to dark for unknown themes
        return 'dark';
    }

    async initialize(siteKey, container = null) {
        this.siteKey = siteKey || this.siteKey;

        if (!this.siteKey) {
            throw new TurnstileError('Turnstile site key is required');
        }

        // Create overlay container like main branch does
        this.container = this._ensureOverlayContainer();

        return new Promise((resolve, reject) => {
            if (typeof window.turnstile !== 'undefined') {
                this._renderWidget(resolve, reject);
                return;
            }

            const script = document.createElement('script');
            script.src =
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.onload = () => {
                this._renderWidget(resolve, reject);
            };
            script.onerror = () => {
                reject(new TurnstileError('Failed to load Turnstile script'));
            };

            document.head.appendChild(script);
        });
    }

    _ensureOverlayContainer() {
        if (this.overlay && document.body.contains(this.overlay)) {
            return this.overlay.querySelector('#turnstile-overlay-host');
        }

        // Get current theme colors
        const theme = getCurrentTheme();
        console.log(
            '🎨 Applying theme to Turnstile overlay:',
            getCurrentThemeName()
        );

        const overlay = document.createElement('div');
        overlay.id = 'turnstile-overlay-container';
        overlay.className = 'wplace-turnstile-overlay wplace-overlay-hidden';

        // Apply theme-specific styling
        overlay.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 99999 !important;
            padding: 20px !important;
            min-width: 300px !important;
            max-width: 400px !important;
            background: ${theme.primary} !important;
            border: ${theme.borderWidth} ${theme.borderStyle} ${theme.accent} !important;
            border-radius: ${theme.borderRadius} !important;
            color: ${theme.text} !important;
            box-shadow: ${theme.boxShadow} !important;
            backdrop-filter: ${theme.backdropFilter} !important;
            font-family: ${theme.fontFamily} !important;
        `;

        const title = document.createElement('div');
        title.textContent = 'Complete the verification';
        title.className = 'wplace-turnstile-title';
        title.style.cssText = `
            font: 600 12px/1.3 ${theme.fontFamily} !important;
            margin-bottom: 8px !important;
            opacity: 0.9 !important;
            color: ${theme.text} !important;
        `;

        const host = document.createElement('div');
        host.id = 'turnstile-overlay-host';
        host.className = 'wplace-turnstile-host';
        host.style.cssText = `
            width: 100% !important;
            min-height: 70px !important;
        `;

        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'Hide';
        hideBtn.className = 'wplace-turnstile-hide-btn';
        hideBtn.style.cssText = `
            position: absolute !important;
            top: 6px !important;
            right: 6px !important;
            font-size: 11px !important;
            background: transparent !important;
            padding: 2px 6px !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
            border: none !important;
            color: ${theme.text} !important;
            border-radius: 3px !important;
            font-family: ${theme.fontFamily} !important;
        `;
        hideBtn.addEventListener('click', () => overlay.remove());

        // Theme-specific hover effects
        const isLightTheme = getCurrentThemeName() === 'Classic Light';
        hideBtn.addEventListener('mouseenter', () => {
            hideBtn.style.background = isLightTheme
                ? 'rgba(0,0,0,0.1)'
                : 'rgba(255,255,255,0.1)';
        });
        hideBtn.addEventListener('mouseleave', () => {
            hideBtn.style.background = 'transparent';
        });

        overlay.appendChild(title);
        overlay.appendChild(host);
        overlay.appendChild(hideBtn);
        document.body.appendChild(overlay);

        this.overlay = overlay;
        return host;
    }

    _renderWidget(resolve, reject) {
        try {
            // Use normal interactive widget like main branch fallback
            const turnstileTheme = this._getTurnstileTheme();
            console.log('🎨 Using Turnstile theme:', turnstileTheme);

            const config = {
                sitekey: this.siteKey,
                size: 'normal',
                theme: turnstileTheme,
                callback: token => {
                    console.log(
                        '🎯 Turnstile widget callback triggered with token:',
                        token ? token.substring(0, 20) + '...' : 'null'
                    );
                    this.currentToken = token;

                    // Hide overlay when solved
                    const overlay =
                        document.getElementById('turnstile-overlay');
                    if (overlay) {
                        overlay.style.display = 'none';
                        console.log(
                            '✅ Turnstile overlay hidden after successful solve'
                        );
                    }

                    this._dispatchEvent('turnstile:solved', { token });
                },
                'error-callback': error => {
                    console.log('❌ Turnstile widget error:', error);
                    this._dispatchEvent('turnstile:error', { error });
                },
                'timeout-callback': () => {
                    console.log('⏰ Turnstile challenge timed out');
                    this._dispatchEvent('turnstile:timeout');
                },
            };

            console.log(
                '🎯 Rendering invisible Turnstile widget with config:',
                config
            );
            this.widget = window.turnstile.render(this.container, config);

            console.log('🎯 Widget rendered with ID:', this.widget);
            if (this.widget) {
                console.log(
                    '✅ Widget creation successful, widget ID:',
                    this.widget
                );
            } else {
                console.error(
                    '❌ Widget creation failed, got null/undefined widget ID'
                );
            }

            this.isLoaded = true;
            this._dispatchEvent('turnstile:loaded');
            resolve();
        } catch (error) {
            reject(
                new TurnstileError(
                    `Failed to render Turnstile widget: ${error.message}`
                )
            );
        }
    }

    async solve(callback) {
        if (!this.isLoaded) {
            throw new TurnstileError('Turnstile not initialized');
        }

        // Show overlay like main branch does
        if (this.overlay) {
            this.overlay.classList.remove('wplace-overlay-hidden');
            this.overlay.style.display = 'block';
            console.log(
                '📋 Turnstile overlay shown - user interaction required'
            );
        }

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                // Hide overlay on timeout
                if (this.overlay) {
                    this.overlay.classList.add('wplace-overlay-hidden');
                    this.overlay.style.display = 'none';
                }
                reject(new TurnstileError('Turnstile solve timeout'));
            }, 60000); // 60 seconds like main branch

            const handleSolved = event => {
                clearTimeout(timeout);
                document.removeEventListener('turnstile:solved', handleSolved);
                document.removeEventListener('turnstile:error', handleError);

                // Hide overlay on success
                if (this.overlay) {
                    this.overlay.classList.add('wplace-overlay-hidden');
                    this.overlay.style.display = 'none';
                }

                if (callback) callback(event.detail.token);
                resolve(event.detail.token);
            };

            const handleError = event => {
                clearTimeout(timeout);
                document.removeEventListener('turnstile:solved', handleSolved);
                document.removeEventListener('turnstile:error', handleError);

                // Hide overlay on error
                if (this.overlay) {
                    this.overlay.classList.add('wplace-overlay-hidden');
                    this.overlay.style.display = 'none';
                }

                reject(
                    new TurnstileError(`Turnstile error: ${event.detail.error}`)
                );
            };

            document.addEventListener('turnstile:solved', handleSolved);
            document.addEventListener('turnstile:error', handleError);

            // If we already have a current token, return it immediately
            if (this.currentToken) {
                clearTimeout(timeout);
                document.removeEventListener('turnstile:solved', handleSolved);
                document.removeEventListener('turnstile:error', handleError);

                // Hide overlay since we have token
                if (this.overlay) {
                    this.overlay.classList.add('wplace-overlay-hidden');
                    this.overlay.style.display = 'none';
                }

                console.log(
                    '🎯 Using existing current token:',
                    this.currentToken.substring(0, 20) + '...'
                );
                if (callback) callback(this.currentToken);
                resolve(this.currentToken);
                return;
            }

            console.log(
                '⏳ Waiting for interactive Turnstile widget (user may need to interact)...'
            );
        });
    }

    getToken() {
        return this.currentToken;
    }

    reset() {
        if (this.widget && window.turnstile) {
            window.turnstile.reset(this.widget);
            this.currentToken = null;
        }
    }

    isLoaded() {
        return this.isLoaded;
    }

    destroy() {
        if (this.widget && window.turnstile) {
            window.turnstile.remove(this.widget);
        }

        this.widget = null;
        this.container = null;
        this.isLoaded = false;
        this.currentToken = null;
    }

    _dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}
