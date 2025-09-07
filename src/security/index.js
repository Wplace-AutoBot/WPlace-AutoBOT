// WPlace Auto-Image Bot - Security Module Index
// Exports for fingerprinting and protection utilities ported from remote script

export {
    FingerprintManager,
    fingerprintManager,
    getCurrentFingerprint,
    isCryptoRandomSupported
} from './FingerprintManager.js';

export {
    ProtectionManager,
    protectionManager,
    addProtectionDelay,
    trackProtectedRequest
} from './ProtectionManager.js';

// Convenience function to initialize all security modules
export function initializeSecurity() {
    const fpManager = fingerprintManager;
    const protManager = protectionManager;
    
    protManager.initialize();
    
    console.log('🔒 Security modules initialized:');
    console.log('  - Fingerprint Manager:', fpManager.getMetadata());
    console.log('  - Protection Manager:', protManager.getStats());
    
    return {
        fingerprint: fpManager,
        protection: protManager
    };
}