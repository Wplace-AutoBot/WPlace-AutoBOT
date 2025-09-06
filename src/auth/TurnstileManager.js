import { TurnstileError } from './errors.js';

export class TurnstileManager {
    constructor(config = {}) {
        this.siteKey = config.siteKey;
        this.theme = config.theme || 'light';
        this.size = config.size || 'normal';
        this.retryInterval = config.retryInterval || 5000;

        this.widget = null;
        this.container = null;
        this.isLoaded = false;
        this.currentToken = null;
    }

    async initialize(siteKey, container) {
        this.siteKey = siteKey || this.siteKey;
        this.container = container;

        if (!this.siteKey) {
            throw new TurnstileError('Turnstile site key is required');
        }

        if (!this.container) {
            throw new TurnstileError('Container element is required');
        }

        return new Promise((resolve, reject) => {
            if (typeof window.turnstile !== 'undefined') {
                this._renderWidget(resolve, reject);
                return;
            }

            const script = document.createElement('script');
            script.src =
                'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.onload = () => {
                this._renderWidget(resolve, reject);
            };
            script.onerror = () => {
                reject(new TurnstileError('Failed to load Turnstile script'));
            };

            document.head.appendChild(script);
        });
    }

    _renderWidget(resolve, reject) {
        try {
            this.widget = window.turnstile.render(this.container, {
                sitekey: this.siteKey,
                theme: this.theme,
                size: this.size,
                callback: token => {
                    this.currentToken = token;
                    this._dispatchEvent('turnstile:solved', { token });
                },
                'error-callback': error => {
                    this._dispatchEvent('turnstile:error', { error });
                },
                'expired-callback': () => {
                    this.currentToken = null;
                    this._dispatchEvent('turnstile:expired');
                },
            });

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

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new TurnstileError('Turnstile solve timeout'));
            }, 30000);

            const handleSolved = event => {
                clearTimeout(timeout);
                document.removeEventListener('turnstile:solved', handleSolved);
                if (callback) callback(event.detail.token);
                resolve(event.detail.token);
            };

            const handleError = event => {
                clearTimeout(timeout);
                document.removeEventListener('turnstile:error', handleError);
                reject(
                    new TurnstileError(`Turnstile error: ${event.detail.error}`)
                );
            };

            document.addEventListener('turnstile:solved', handleSolved);
            document.addEventListener('turnstile:error', handleError);

            if (this.currentToken) {
                clearTimeout(timeout);
                if (callback) callback(this.currentToken);
                resolve(this.currentToken);
            }
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
