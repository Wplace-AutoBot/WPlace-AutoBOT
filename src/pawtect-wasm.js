/**
 * Pawtect WASM Token Generation Module
 * Advanced protection system with WebAssembly integration
 * Maintains V1 modular structure while adding sophisticated protection
 */

// WASM Token Generation System
export class PawtectWASM {
    constructor() {
        this.wasmModule = null;
        this.isInitialized = false;
        this.cachedModuleUrl = null;
        this.userIdSet = false;
    }

    /**
     * Initialize the Pawtect WASM system
     */
    async initialize() {
        if (this.isInitialized) return true;

        try {
            console.log('🚀 Initializing Pawtect WASM system...');
            
            // Discover WASM module location
            const moduleUrl = await this.discoverWasmModule();
            if (!moduleUrl) {
                console.error('❌ Failed to locate Pawtect WASM module');
                return false;
            }

            // Load and initialize WASM module
            const success = await this.loadWasmModule(moduleUrl);
            if (success) {
                this.isInitialized = true;
                console.log('✅ Pawtect WASM system initialized successfully');
                
                // Set user ID if available
                await this.setUserIdFromAPI();
                
                return true;
            }

            return false;
        } catch (error) {
            console.error('❌ Pawtect WASM initialization failed:', error);
            return false;
        }
    }

    /**
     * Discover WASM module location from page HTML
     */
    async discoverWasmModule(forceUpdate = false) {
        const cacheKey = 'pawtect-wasm-location';
        
        // Use cached location if available and not forcing update
        if (!forceUpdate && this.cachedModuleUrl) {
            console.log('✅ Using cached Pawtect WASM module location');
            return this.cachedModuleUrl;
        }

        if (!forceUpdate) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                this.cachedModuleUrl = cached;
                console.log('✅ Found cached Pawtect WASM module location');
                return cached;
            }
        }

        try {
            console.log('🔍 Discovering Pawtect WASM module location...');
            
            // Fetch page HTML and scan for WASM module
            const pageHtml = await fetch(window.location.href).then(r => r.text());
            const lines = pageHtml.split('\n');

            for (const line of lines) {
                if (line.includes('<link rel="modulepreload" href="./_app/immutable/chunks/')) {
                    const urlMatch = line.match(/href="([^"]+)"/);
                    if (urlMatch) {
                        const moduleUrl = urlMatch[1];
                        
                        // Check if this module contains the Pawtect WASM
                        try {
                            const moduleContent = await fetch(window.location.href + moduleUrl).then(r => r.text());
                            
                            if (moduleContent.includes('pawtect_wasm_bg.wasm')) {
                                console.log(`✅ Found Pawtect WASM module at: ${moduleUrl}`);
                                localStorage.setItem(cacheKey, moduleUrl);
                                this.cachedModuleUrl = moduleUrl;
                                return moduleUrl;
                            }
                        } catch (error) {
                            console.warn(`⚠️ Failed to check module ${moduleUrl}:`, error);
                            continue;
                        }
                    }
                }
            }

            console.warn('⚠️ Pawtect WASM module not found in page HTML');
            return null;
        } catch (error) {
            console.error('❌ Failed to discover WASM module:', error);
            return null;
        }
    }

    /**
     * Load and initialize the WASM module
     */
    async loadWasmModule(moduleUrl) {
        try {
            console.log('📦 Loading Pawtect WASM module...');
            
            // Dynamic import of the WASM module
            const module = await import(moduleUrl);
            
            // Initialize WASM
            const wasm = await module._();
            
            console.log('✅ WASM module loaded and initialized');
            this.wasmModule = { module, wasm };
            
            return true;
        } catch (error) {
            console.error('❌ Failed to load WASM module:', error);
            
            // Try to refresh module location and retry once
            if (this.cachedModuleUrl) {
                console.log('🔄 Refreshing module location and retrying...');
                const freshUrl = await this.discoverWasmModule(true);
                if (freshUrl && freshUrl !== moduleUrl) {
                    return await this.loadWasmModule(freshUrl);
                }
            }
            
            return false;
        }
    }

    /**
     * Set user ID from WPlace API
     */
    async setUserIdFromAPI() {
        if (!this.wasmModule || this.userIdSet) return;

        try {
            const response = await fetch('https://backend.wplace.live/me', { 
                credentials: 'include' 
            });
            
            if (response.ok) {
                const userData = await response.json();
                if (userData?.id) {
                    this.wasmModule.module.i(userData.id);
                    this.userIdSet = true;
                    console.log('✅ User ID set in WASM module:', userData.id);
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to set user ID in WASM:', error);
        }
    }

    /**
     * Generate Pawtect token for API request
     */
    async generateToken(regionX, regionY, payload) {
        if (!this.isInitialized || !this.wasmModule) {
            console.warn('⚠️ Pawtect WASM not initialized, cannot generate token');
            return null;
        }

        try {
            console.log('🔐 Generating Pawtect token...');
            
            const { module, wasm } = this.wasmModule;
            
            // Set request URL in WASM
            const requestUrl = `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`;
            if (module.r) {
                module.r(requestUrl);
                console.log('✅ Request URL set in WASM:', requestUrl);
            }

            // Prepare payload for WASM processing
            const payloadStr = JSON.stringify(payload);
            const encoder = new TextEncoder();
            const decoder = new TextDecoder();
            const payloadBytes = encoder.encode(payloadStr);
            
            console.log('📝 Payload prepared:', payloadStr);
            console.log('📏 Payload size:', payloadBytes.length, 'bytes');

            // Allocate WASM memory
            let inputPtr;
            try {
                if (!wasm.__wbindgen_malloc) {
                    throw new Error('__wbindgen_malloc function not available');
                }

                inputPtr = wasm.__wbindgen_malloc(payloadBytes.length, 1);
                console.log('✅ WASM memory allocated, pointer:', inputPtr);

                // Copy payload data to WASM memory
                const wasmBuffer = new Uint8Array(wasm.memory.buffer, inputPtr, payloadBytes.length);
                wasmBuffer.set(payloadBytes);
                console.log('✅ Payload copied to WASM memory');
            } catch (memError) {
                console.error('❌ Memory allocation failed:', memError);
                return null;
            }

            // Call WASM function to generate token
            let outputPtr, outputLen, token;
            try {
                console.log('🚀 Calling WASM get_pawtected_endpoint_payload...');
                
                const result = wasm.get_pawtected_endpoint_payload(inputPtr, payloadBytes.length);
                console.log('✅ WASM function called, result:', typeof result, result);

                if (Array.isArray(result) && result.length === 2) {
                    [outputPtr, outputLen] = result;
                    console.log('✅ Token generated, pointer:', outputPtr, 'length:', outputLen);

                    // Decode the token from WASM memory
                    const outputBuffer = new Uint8Array(wasm.memory.buffer, outputPtr, outputLen);
                    token = decoder.decode(outputBuffer);
                    console.log('✅ Token decoded successfully');
                } else {
                    console.error('❌ Unexpected WASM function result format:', result);
                    return null;
                }
            } catch (funcError) {
                console.error('❌ WASM function call failed:', funcError);
                return null;
            }

            // Cleanup WASM memory
            try {
                if (wasm.__wbindgen_free) {
                    if (outputPtr && outputLen) {
                        wasm.__wbindgen_free(outputPtr, outputLen, 1);
                        console.log('✅ Output memory freed');
                    }
                    if (inputPtr) {
                        wasm.__wbindgen_free(inputPtr, payloadBytes.length, 1);
                        console.log('✅ Input memory freed');
                    }
                }
            } catch (cleanupError) {
                console.warn('⚠️ Memory cleanup warning:', cleanupError);
            }

            // Log results
            console.log('🎉 Pawtect token generated successfully!');
            console.log('📊 Token length:', token?.length || 0);
            console.log('🔑 Token preview:', token?.substring(0, 50) + '...');

            return token;
        } catch (error) {
            console.error('❌ Failed to generate Pawtect token:', error);
            return null;
        }
    }

    /**
     * Get status of Pawtect WASM system
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            hasModule: !!this.wasmModule,
            userIdSet: this.userIdSet,
            cachedModuleUrl: this.cachedModuleUrl
        };
    }
}

// Fingerprint generation utilities
export class FingerprintGenerator {
    /**
     * Generate random fingerprint string
     */
    static generateRandom(length = 10) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Generate browser-based fingerprint (more sophisticated)
     */
    static generateBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        const fingerprint = canvas.toDataURL().slice(-50);
        return btoa(fingerprint + navigator.userAgent.slice(-20) + screen.width + screen.height)
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 10);
    }

    /**
     * Get current fingerprint (random each time for better protection)
     */
    static getCurrent() {
        return this.generateRandom(10);
    }
}

// Enhanced WPlace API Service with Pawtect protection
export class EnhancedWPlaceAPI {
    constructor() {
        this.pawtectWasm = new PawtectWASM();
        this.isInitialized = false;
    }

    /**
     * Initialize the enhanced API service
     */
    async initialize() {
        if (this.isInitialized) return true;

        console.log('🚀 Initializing Enhanced WPlace API...');
        
        const success = await this.pawtectWasm.initialize();
        this.isInitialized = success;
        
        if (success) {
            console.log('✅ Enhanced WPlace API initialized with Pawtect protection');
        } else {
            console.warn('⚠️ Enhanced WPlace API initialized without Pawtect protection (fallback mode)');
        }

        return success;
    }

    /**
     * Paint pixels with advanced protection
     */
    async paintPixelInRegion(regionX, regionY, pixelX, pixelY, color, turnstileToken) {
        try {
            if (!turnstileToken) {
                console.error('❌ No Turnstile token available');
                return 'token_error';
            }

            // Prepare payload with fingerprint
            const payload = {
                coords: [pixelX, pixelY],
                colors: [color],
                t: turnstileToken,
                fp: FingerprintGenerator.getCurrent()
            };

            console.log('🎯 Painting pixel with enhanced protection');
            console.log('📍 Region:', regionX, regionY);
            console.log('📍 Pixel:', pixelX, pixelY);
            console.log('🎨 Color:', color);

            // Generate Pawtect token if WASM is available
            let pawtectToken = null;
            if (this.pawtectWasm.isInitialized) {
                pawtectToken = await this.pawtectWasm.generateToken(regionX, regionY, payload);
                if (pawtectToken) {
                    console.log('🔐 Using Pawtect protection');
                } else {
                    console.warn('⚠️ Pawtect token generation failed, using basic protection');
                }
            }

            // Prepare headers
            const headers = {
                'Content-Type': 'text/plain;charset=UTF-8'
            };

            // Add Pawtect token if available
            if (pawtectToken) {
                headers['x-pawtect-token'] = pawtectToken;
            }

            // Make API request
            const response = await fetch(
                `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`,
                {
                    method: 'POST',
                    headers,
                    credentials: 'include',
                    body: JSON.stringify(payload)
                }
            );

            console.log('📡 API Response:', response.status, response.statusText);

            // Handle 403 Forbidden
            if (response.status === 403) {
                console.error('❌ 403 Forbidden - Token might be invalid or expired');
                return 'token_error';
            }

            // Parse response
            const data = await response.json();
            const success = data?.painted === 1;
            
            if (success) {
                console.log('✅ Pixel painted successfully');
            } else {
                console.warn('⚠️ Pixel painting failed:', data);
            }

            return success;
        } catch (error) {
            console.error('❌ Paint request failed:', error);
            return false;
        }
    }

    /**
     * Get user charges and info
     */
    async getCharges() {
        const defaultResult = {
            id: null,
            charges: 0,
            max: 1,
            cooldown: 31000,
            droplets: 0
        };

        try {
            const response = await fetch('https://backend.wplace.live/me', {
                credentials: 'include'
            });

            if (!response.ok) {
                console.warn('⚠️ Failed to get user info:', response.status);
                return defaultResult;
            }

            const data = await response.json();
            
            return {
                id: data.id || null,
                charges: data.charges?.count || 0,
                max: data.charges?.max || 1,
                cooldown: data.charges?.next || 31000,
                droplets: data.droplets || 0
            };
        } catch (error) {
            console.error('❌ Failed to get charges:', error);
            return defaultResult;
        }
    }

    /**
     * Get API service status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            pawtectStatus: this.pawtectWasm.getStatus()
        };
    }
}

// Export singleton instance for easy use
export const enhancedAPI = new EnhancedWPlaceAPI();

// Utility functions
export const utils = {
    FingerprintGenerator,
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
};
