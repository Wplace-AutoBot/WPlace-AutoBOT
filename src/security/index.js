// WPlace Auto-Image Bot - Security Module Index
// Exports for fingerprinting, protection, and pawtect utilities ported from remote script

export {
    FingerprintManager,
    fingerprintManager,
    getCurrentFingerprint,
    isCryptoRandomSupported,
} from './FingerprintManager.js';

export {
    ProtectionManager,
    protectionManager,
    addProtectionDelay,
    trackProtectedRequest,
} from './ProtectionManager.js';

export {
    PawtectManager,
    pawtectManager,
    createPawtectToken,
} from './PawtectManager.js';

import { fingerprintManager } from './FingerprintManager.js';
import { protectionManager } from './ProtectionManager.js';
import { pawtectManager } from './PawtectManager.js';

// Convenience function to initialize all security modules
export async function initializeSecurity() {
    const fpManager = fingerprintManager;
    const protManager = protectionManager;
    const pawtManager = pawtectManager;

    protManager.initialize();
    await pawtManager.initialize(); // Pawtect initialization is async

    console.log('🔒 Security modules initialized:');
    console.log('  - Fingerprint Manager:', fpManager.getMetadata());
    console.log('  - Protection Manager:', protManager.getStats());
    console.log('  - Pawtect Manager:', pawtManager.getStatus());

    return {
        fingerprint: fpManager,
        protection: protManager,
        pawtect: pawtManager,
    };
}

// Convenience function to get initialized security modules
export function getSecurity() {
    return {
        fingerprint: fingerprintManager,
        protection: protectionManager,
        pawtect: pawtectManager,
    };
}
