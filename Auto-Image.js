// WPlace Auto-Image Bot - Backwards Compatibility Loader
// This file automatically loads the latest version from the src/ directory
// for backwards compatibility with existing bookmarklet installations

(async () => {
    // Configuration
    const BASE_URL =
        'https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main';
    const SCRIPT_PATH = '/src/Auto-Image.js';

    try {
        console.log(
            '🔄 Loading WPlace Auto-Image Bot from updated location...'
        );

        // Fetch the latest version from the src directory
        const response = await fetch(`${BASE_URL}${SCRIPT_PATH}`, {
            cache: 'no-cache',
            headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch: ${response.status} ${response.statusText}`
            );
        }

        const code = await response.text();

        console.log('✅ Successfully loaded WPlace Auto-Image Bot code');
        console.log('📦 Executing latest version from src/Auto-Image.js...');

        // Evaluate the fetched code
        eval(code);
    } catch (error) {
        console.error(
            '❌ Failed to load WPlace Auto-Image Bot from remote source:',
            error
        );
        console.log('⚠️  Please update your userscript/bookmarklet to use:');
        console.log(`📍 ${BASE_URL}${SCRIPT_PATH}`);

        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: white; padding: 16px 20px; border-radius: 12px;
      font-family: 'Segoe UI', sans-serif; font-size: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      max-width: 400px; border: 1px solid rgba(255,255,255,0.2);
    `;
        errorDiv.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">⚠️ Auto-Image Bot Update Required</div>
      <div style="margin-bottom: 12px;">Failed to load the latest version. Please update your installation:</div>
      <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all;">
        ${BASE_URL}${SCRIPT_PATH}
      </div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 10px; padding: 6px 12px; background: rgba(255,255,255,0.2);
        border: none; border-radius: 4px; color: white; cursor: pointer;
      ">Dismiss</button>
    `;
        document.body.appendChild(errorDiv);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 15000);
    }
})();
