// WPlace Auto-Image Bot - Pawtect Manager
// Ported from remote script - complete WASM token generation system

/**
 * PawtectManager handles WASM-based token generation for x-pawtect-token headers
 * This is the complete implementation ported from the remote script
 */
export class PawtectManager {
    constructor() {
        this.pawtectChunk = null;
        this.wasmModule = null;
        this.initialized = false;
    }

    /**
     * Initialize the Pawtect manager by finding and loading the WASM module
     */
    async initialize() {
        if (this.initialized) return true;

        try {
            // Find the pawtect WASM module if not already found (matches remote script pattern)
            this.pawtectChunk ??= await this.findTokenModule(
                'pawtect_wasm_bg.wasm'
            );

            if (!this.pawtectChunk) {
                console.error('❌ Could not find Pawtect WASM chunk');
                return false;
            }
            console.log('✅ Found Pawtect WASM chunk:', this.pawtectChunk);

            this.initialized = true;
            console.log('🛡️ Pawtect Manager initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Pawtect Manager initialization failed:', error);
            return false;
        }
    }

    /**
     * Find the token module by searching modulepreload links
     * @param {string} wasmFileName - Name of the WASM file to search for
     * @returns {Promise<string|null>} The chunk filename or null if not found
     */
    async findTokenModule(wasmFileName) {
        console.log('🔎 Searching for WASM Module...');
        const links = Array.from(
            document.querySelectorAll('link[rel="modulepreload"][href$=".js"]')
        );

        for (const link of links) {
            try {
                const url = new URL(link.getAttribute('href'), location.origin)
                    .href;
                const code = await fetch(url).then(r => r.text());
                if (code.includes(wasmFileName)) {
                    console.log('✅ Found WASM Module...');
                    return url.split('/').pop();
                }
            } catch (error) {
                // Silently continue searching
            }
        }

        console.error(`❌ Could not find Pawtect chunk for: ${wasmFileName}`);
        return null;
    }

    /**
     * Create a WASM token for the x-pawtect-token header
     * This is the main function ported from the remote script
     *
     * @param {number} regionX - X coordinate of the region
     * @param {number} regionY - Y coordinate of the region
     * @param {Object} payload - The payload object containing coords, colors, token, and fp
     * @returns {Promise<string|null>} The generated WASM token or null if failed
     */
    async createWasmToken(regionX, regionY, payload) {
        try {
            // Load the Pawtect module and WASM (matches remote script pattern)
            const mod = await import(
                new URL(
                    '/_app/immutable/chunks/' + this.pawtectChunk,
                    location.origin
                ).href
            );
            let wasm;

            try {
                wasm = await mod._();
                console.log('✅ WASM initialized successfully');
            } catch (wasmError) {
                console.error('❌ WASM initialization failed:', wasmError);
                return null;
            }

            // Set user ID (exactly matching remote script - simplified)
            try {
                try {
                    const me = await fetch(`https://backend.wplace.live/me`, {
                        credentials: 'include',
                    }).then(r => (r.ok ? r.json() : null));
                    if (me?.id) {
                        mod.i(me.id);
                        console.log('✅ user ID set:', me.id);
                    }
                } catch {}
            } catch (userIdError) {
                console.log('⚠️ Error setting user ID:', userIdError.message);
            }

            // Set request URL
            try {
                const testUrl = `https://backend.wplace.live/s0/pixel/${regionX}/${regionY}`;
                if (mod.r) {
                    mod.r(testUrl);
                    console.log('✅ Request URL set:', testUrl);
                } else {
                    console.log(
                        '⚠️ request_url function (mod.r) not available'
                    );
                }
            } catch (urlError) {
                console.log('⚠️ Error setting request URL:', urlError.message);
            }

            console.log('📝 Payload:', payload);

            // Encode payload
            const enc = new TextEncoder();
            const dec = new TextDecoder();
            const bodyStr = JSON.stringify(payload);
            const bytes = enc.encode(bodyStr);
            console.log('📏 Payload size:', bytes.length, 'bytes');
            console.log('📄 Payload string:', bodyStr);

            // Allocate WASM memory with validation
            let inPtr;
            try {
                if (!wasm.__wbindgen_malloc) {
                    console.error('❌ __wbindgen_malloc function not found');
                    return null;
                }

                inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
                console.log('✅ WASM memory allocated, pointer:', inPtr);

                // Copy data to WASM memory
                const wasmBuffer = new Uint8Array(
                    wasm.memory.buffer,
                    inPtr,
                    bytes.length
                );
                wasmBuffer.set(bytes);
                console.log('✅ Data copied to WASM memory');
            } catch (memError) {
                console.error('❌ Memory allocation error:', memError);
                return null;
            }

            // Call the WASM function
            console.log('🚀 Calling get_pawtected_endpoint_payload...');
            let outPtr, outLen, token;
            try {
                const result = wasm.get_pawtected_endpoint_payload(
                    inPtr,
                    bytes.length
                );
                console.log(
                    '✅ Function called, result type:',
                    typeof result,
                    result
                );

                if (Array.isArray(result) && result.length === 2) {
                    [outPtr, outLen] = result;
                    console.log(
                        '✅ Got output pointer:',
                        outPtr,
                        'length:',
                        outLen
                    );

                    // Decode the result
                    const outputBuffer = new Uint8Array(
                        wasm.memory.buffer,
                        outPtr,
                        outLen
                    );
                    token = dec.decode(outputBuffer);
                    console.log('✅ Token decoded successfully');
                } else {
                    console.error(
                        '❌ Unexpected function result format:',
                        result
                    );
                    return null;
                }
            } catch (funcError) {
                console.error('❌ Function call error:', funcError);
                console.error('Stack trace:', funcError.stack);
                return null;
            }

            // Cleanup memory
            try {
                if (wasm.__wbindgen_free && outPtr && outLen) {
                    wasm.__wbindgen_free(outPtr, outLen, 1);
                    console.log('✅ Output memory freed');
                }
                if (wasm.__wbindgen_free && inPtr) {
                    wasm.__wbindgen_free(inPtr, bytes.length, 1);
                    console.log('✅ Input memory freed');
                }
            } catch (cleanupError) {
                console.log('⚠️ Cleanup warning:', cleanupError.message);
            }

            // Display results
            console.log('');
            console.log('🎉 WASM TOKEN SUCCESS!');
            console.log('🔑 Full token:', token);
            return token;
        } catch (error) {
            console.error('❌ Failed to generate pawtect parameter:', error);
            return null;
        }
    }

    /**
     * Get the current pawtect chunk filename
     * @returns {string|null} The chunk filename or null if not found
     */
    getPawtectChunk() {
        return this.pawtectChunk;
    }

    /**
     * Check if the manager is initialized
     * @returns {boolean} True if initialized
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Reset the manager state (useful for testing or reinitialization)
     */
    reset() {
        this.pawtectChunk = null;
        this.wasmModule = null;
        this.initialized = false;
        console.log('🔄 Pawtect Manager reset');
    }

    /**
     * Reset user ID state when tokens are invalidated (no-op since remote script doesn't track this)
     */
    resetUserState() {
        console.log(
            '🔄 Pawtect user state reset - user ID will be refreshed on next token generation'
        );
    }

    /**
     * Get manager status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            hasPawtectChunk: !!this.pawtectChunk,
            pawtectChunk: this.pawtectChunk,
            hasWasmModule: !!this.wasmModule,
        };
    }
}

/**
 * Create and export a global pawtect manager instance
 */
export const pawtectManager = new PawtectManager();

/**
 * Utility function to create a WASM token
 * @param {number} regionX - X coordinate of the region
 * @param {number} regionY - Y coordinate of the region
 * @param {Object} payload - The payload object
 * @returns {Promise<string|null>} The generated WASM token
 */
export async function createPawtectToken(regionX, regionY, payload) {
    return pawtectManager.createWasmToken(regionX, regionY, payload);
}
