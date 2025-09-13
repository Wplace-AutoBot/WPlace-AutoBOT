// Background service worker for WPlace AutoBOT Extension

// Test resource loading on extension start
chrome.runtime.onStartup.addListener(async () => {
    console.log('🚀 WPlace AutoBOT Extension started');
    const resources = await loadExtensionResources();
    console.log('📦 Initial resource test:', resources);
});

chrome.runtime.onInstalled.addListener(async () => {
    console.log('🔧 WPlace AutoBOT Extension installed');
    const resources = await loadExtensionResources();
    console.log('📦 Installation resource test:', resources);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'executeScript') {
        // Get tabId from sender or request
        const tabId = request.tabId || sender.tab?.id;

        if (!tabId) {
            sendResponse({ success: false, error: 'Could not determine target tab' });
            return;
        }

        // Use IIFE for async handling
        (async () => {
            try {
                await executeLocalScript(request.scriptName, tabId);
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();

        return true; // Important: indicates async response
    }
});

async function executeLocalScript(scriptName, tabId) {
    try {
        console.log(`Loading script: ${scriptName}`);

        // Determine script path - Script-manager files are in root, others in scripts/
        let scriptUrl;
        if (scriptName === 'Script-manager.js' || scriptName === 'Script-manager-fixed.js') {
            scriptUrl = chrome.runtime.getURL(scriptName);
        } else {
            scriptUrl = chrome.runtime.getURL(`scripts/${scriptName}`);
        }
        
        const response = await fetch(scriptUrl);

        if (!response.ok) {
            throw new Error(`Failed to load script: ${response.status} ${response.statusText}`);
        }

        const scriptCode = await response.text();
        console.log(`Script loaded: ${scriptCode.length} characters`);

        // Load theme and language resources
        const resources = await loadExtensionResources();

        // Execute in MAIN world context (bypasses CSP)
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            world: "MAIN", // Key: executes in page context, not extension context
            func: (code, name, themeCSS, languages) => {
                console.log(`%c🚀 Executing ${name}...`, 'color: #4ade80; font-weight: bold; font-size: 14px;');
                
                // Create detailed resource report
                console.group(`%c📊 WPlace AutoBOT Resource Report for ${name}`, 'color: #3b82f6; font-weight: bold; font-size: 16px;');
                
                // Debug: Log what resources we received
                console.log(`%c📦 Raw Resources Received:`, 'color: #8b5cf6; font-weight: bold;');
                console.log(`  - Themes object:`, themeCSS);
                console.log(`  - Languages object:`, languages);
                console.log(`  - Theme count: ${Object.keys(themeCSS || {}).length}`);
                console.log(`  - Language count: ${Object.keys(languages || {}).length}`);
                
                // Inject CSS themes if available
                if (themeCSS && Object.keys(themeCSS).length > 0) {
                    console.group(`%c🎨 Theme Processing`, 'color: #8b5cf6; font-weight: bold;');
                    console.log(`%c📁 Loading ${Object.keys(themeCSS).length} theme files from extension local storage...`, 'color: #8b5cf6;');
                    
                    // Create a global themes object
                    window.AUTOBOT_THEMES = themeCSS;
                    
                    // Log detailed theme information
                    Object.entries(themeCSS).forEach(([filename, content]) => {
                        console.log(`%c📄 Theme File: ${filename}`, 'color: #8b5cf6; font-weight: bold;');
                        console.log(`  📏 Size: ${content.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file (chrome-extension://)`);
                        console.log(`  🔗 Full path: themes/${filename}`);
                        
                        // Show first few lines as preview
                        const preview = content.substring(0, 200).split('\\n').slice(0, 3).join('\\n');
                        console.log(`  👀 Preview: ${preview}${content.length > 200 ? '...' : ''}`);
                        console.log(`  ✅ Status: Loaded successfully`);
                    });
                    
                    // Inject auto-image-styles.css if available
                    if (themeCSS['auto-image-styles.css']) {
                        const autoImageContent = themeCSS['auto-image-styles.css'];
                        const styleElement = document.createElement('style');
                        styleElement.id = 'autobot-auto-image-styles';
                        styleElement.textContent = autoImageContent;
                        document.head.appendChild(styleElement);
                        
                        console.log(`%c✨ AUTO-INJECTED: auto-image-styles.css`, 'color: #10b981; font-weight: bold;');
                        console.log(`  📏 Injected size: ${autoImageContent.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  🎯 Target: <head> as <style> element`);
                        console.log(`  🆔 Element ID: autobot-auto-image-styles`);
                    } else {
                        console.warn(`%c⚠️ auto-image-styles.css not found in loaded themes`, 'color: #f59e0b; font-weight: bold;');
                    }
                    console.groupEnd();
                } else {
                    console.warn(`%c⚠️ No themes received from extension`, 'color: #f59e0b; font-weight: bold;');
                    console.log(`  📁 Expected source: Extension local files`);
                    console.log(`  📋 Expected files: auto-image-styles.css, acrylic.css, classic.css, etc.`);
                    window.AUTOBOT_THEMES = {};
                }
                
                // Inject language data if available
                if (languages && Object.keys(languages).length > 0) {
                    console.group(`%c🌍 Language Processing`, 'color: #06b6d4; font-weight: bold;');
                    console.log(`%c📁 Loading ${Object.keys(languages).length} language files from extension local storage...`, 'color: #06b6d4;');
                    
                    window.AUTOBOT_LANGUAGES = languages;
                    
                    // Log detailed language information
                    Object.entries(languages).forEach(([filename, content]) => {
                        console.log(`%c📄 Language File: ${filename}`, 'color: #06b6d4; font-weight: bold;');
                        console.log(`  🌐 Language: ${filename.replace('.json', '').toUpperCase()}`);
                        console.log(`  📏 Keys count: ${Object.keys(content).length.toLocaleString()}`);
                        console.log(`  📍 Source: Extension local file (chrome-extension://)`);
                        console.log(`  🔗 Full path: lang/${filename}`);
                        
                        // Show some sample keys
                        const sampleKeys = Object.keys(content).slice(0, 5);
                        console.log(`  🔑 Sample keys: ${sampleKeys.join(', ')}${Object.keys(content).length > 5 ? '...' : ''}`);
                        console.log(`  ✅ Status: Loaded successfully`);
                    });
                    
                    // Helper function to get language data with detailed logging
                    window.getLanguage = function(lang = 'en') {
                        const langFile = lang + '.json';
                        const result = window.AUTOBOT_LANGUAGES[langFile] || window.AUTOBOT_LANGUAGES['en.json'] || {};
                        
                        console.group(`%c🔤 Language Access: ${lang.toUpperCase()}`, 'color: #06b6d4; font-weight: bold;');
                        console.log(`  📋 Requested: ${lang}`);
                        console.log(`  📄 File: ${langFile}`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  📏 Keys returned: ${Object.keys(result).length}`);
                        console.log(`  ✅ Success: ${window.AUTOBOT_LANGUAGES[langFile] ? 'Found exact match' : 'Fallback to English'}`);
                        console.log(`  📝 Data preview:`, result);
                        console.groupEnd();
                        
                        return result;
                    };
                    
                    console.log(`%c🔤 Available languages: ${Object.keys(languages).map(f => f.replace('.json', '')).join(', ')}`, 'color: #06b6d4;');
                    console.groupEnd();
                } else {
                    console.warn(`%c⚠️ No languages received from extension`, 'color: #f59e0b; font-weight: bold;');
                    console.log(`  📁 Expected source: Extension local files`);
                    console.log(`  📋 Expected files: en.json, de.json, fr.json, etc.`);
                    window.AUTOBOT_LANGUAGES = {};
                    window.getLanguage = function() { 
                        console.warn(`%c⚠️ getLanguage() called but no languages available`, 'color: #f59e0b;');
                        return {}; 
                    };
                }
                
                // Helper function to apply theme with detailed logging
                window.applyTheme = function(themeName) {
                    console.group(`%c🎨 Theme Application: ${themeName}`, 'color: #8b5cf6; font-weight: bold;');
                    
                    if (!window.AUTOBOT_THEMES || Object.keys(window.AUTOBOT_THEMES).length === 0) {
                        console.error(`%c❌ No themes available in extension`, 'color: #ef4444; font-weight: bold;');
                        console.log(`  📁 Expected source: Extension local files`);
                        console.log(`  📋 Expected location: window.AUTOBOT_THEMES`);
                        console.groupEnd();
                        return false;
                    }
                    
                    const themeFile = themeName + '.css';
                    console.log(`  📋 Requested theme: ${themeName}`);
                    console.log(`  📄 Looking for file: ${themeFile}`);
                    console.log(`  📁 Available themes: ${Object.keys(window.AUTOBOT_THEMES).join(', ')}`);
                    
                    if (window.AUTOBOT_THEMES[themeFile]) {
                        const themeContent = window.AUTOBOT_THEMES[themeFile];
                        
                        // Remove existing theme
                        const existing = document.getElementById('autobot-theme');
                        if (existing) {
                            console.log(`  🗑️ Removing previous theme element`);
                            existing.remove();
                        }
                        
                        // Apply new theme
                        const styleElement = document.createElement('style');
                        styleElement.id = 'autobot-theme';
                        styleElement.textContent = themeContent;
                        document.head.appendChild(styleElement);
                        
                        console.log(`%c✅ Theme applied successfully: ${themeName}`, 'color: #10b981; font-weight: bold;');
                        console.log(`  📏 Content size: ${themeContent.length.toLocaleString()} characters`);
                        console.log(`  📍 Source: Extension local file`);
                        console.log(`  🎯 Target: <head> as <style> element`);
                        console.log(`  🆔 Element ID: autobot-theme`);
                        
                        // Show preview of applied CSS
                        const preview = themeContent.substring(0, 150).split('\\n').slice(0, 2).join('\\n');
                        console.log(`  👀 CSS Preview: ${preview}...`);
                        
                        console.groupEnd();
                        return true;
                    } else {
                        console.error(`%c❌ Theme not found: ${themeName}`, 'color: #ef4444; font-weight: bold;');
                        console.log(`  📄 Requested file: ${themeFile}`);
                        console.log(`  📁 Available themes: ${Object.keys(window.AUTOBOT_THEMES).join(', ')}`);
                        console.groupEnd();
                        return false;
                    }
                };
                
                // Final resource summary
                console.group(`%c📋 Resource Summary`, 'color: #10b981; font-weight: bold;');
                console.log(`%c🎨 Themes loaded: ${Object.keys(window.AUTOBOT_THEMES || {}).length}`, 'color: #8b5cf6;');
                console.log(`%c🌍 Languages loaded: ${Object.keys(window.AUTOBOT_LANGUAGES || {}).length}`, 'color: #06b6d4;');
                console.log(`%c🛠️ Helper functions available:`, 'color: #10b981;');
                console.log(`  - applyTheme(themeName) - Apply CSS theme`);
                console.log(`  - getLanguage(lang) - Get language translations`);
                console.log(`%c📍 All resources loaded from: Extension local files`, 'color: #10b981;');
                console.groupEnd();
                
                console.groupEnd(); // End main resource report
                
                // Create script element to execute the code
                const script = document.createElement('script');
                script.textContent = code;
                document.head.appendChild(script);
                script.remove(); // Clean up after execution
                
                console.log(`%c✅ ${name} executed successfully with full resource access`, 'color: #4ade80; font-weight: bold;');
            },
            args: [scriptCode, scriptName, resources.themes, resources.languages]
        });

        console.log('Script executed successfully in MAIN context');

    } catch (error) {
        console.error('Error executing script:', error);
        throw error;
    }
}

async function loadExtensionResources() {
    console.group('%c🔧 WPlace AutoBOT Resource Loading System', 'color: #3b82f6; font-weight: bold; font-size: 16px;');
    const startTime = performance.now();
    
    const resources = {
        themes: {},
        languages: {}
    };

    try {
        console.log('%c� Starting resource loading from extension directory...', 'color: #3b82f6; font-weight: bold;');
        
        // Load theme files
        console.group('%c🎨 Theme Files Loading', 'color: #8b5cf6; font-weight: bold;');
        const themeFiles = [
            'auto-image-styles.css',
            'themes/acrylic.css',
            'themes/classic-light.css', 
            'themes/classic.css',
            'themes/neon.css',
            'themes/neon-cyan.css',
            'themes/neon-light.css'
        ];

        for (const themeFile of themeFiles) {
            try {
                console.log(`%c� Loading theme: ${themeFile}`, 'color: #8b5cf6;');
                console.log(`  📍 Source path: ${themeFile}`);
                console.log(`  🔗 Full URL: chrome-extension://${chrome.runtime.id}/${themeFile}`);
                
                const themeUrl = chrome.runtime.getURL(themeFile);
                console.log(`  🌐 Resolved URL: ${themeUrl}`);
                
                const response = await fetch(themeUrl);
                console.log(`  📡 Fetch response status: ${response.status} ${response.statusText}`);
                console.log(`  📋 Response headers:`, Object.fromEntries(response.headers.entries()));
                
                if (response.ok) {
                    const content = await response.text();
                    const fileName = themeFile.split('/').pop();
                    resources.themes[fileName] = content;
                    
                    console.log(`%c✅ ${fileName} loaded successfully`, 'color: #10b981; font-weight: bold;');
                    console.log(`  📏 File size: ${content.length.toLocaleString()} characters`);
                    console.log(`  📊 File size: ${(content.length / 1024).toFixed(2)} KB`);
                    console.log(`  🔍 Content type: CSS stylesheet`);
                    
                    // Show content preview
                    const firstLine = content.split('\n')[0];
                    const lastLine = content.split('\n').slice(-1)[0];
                    console.log(`  👀 First line: ${firstLine.substring(0, 100)}${firstLine.length > 100 ? '...' : ''}`);
                    console.log(`  👀 Last line: ${lastLine.substring(0, 100)}${lastLine.length > 100 ? '...' : ''}`);
                    
                    // Count CSS rules
                    const ruleCount = (content.match(/\{[^}]*\}/g) || []).length;
                    console.log(`  📝 Estimated CSS rules: ${ruleCount.toLocaleString()}`);
                    
                } else {
                    console.error(`%c❌ Failed to load ${themeFile}`, 'color: #ef4444; font-weight: bold;');
                    console.error(`  📡 Status: ${response.status} ${response.statusText}`);
                    console.error(`  🌐 URL: ${themeUrl}`);
                }
            } catch (error) {
                console.error(`%c💥 Exception loading theme ${themeFile}:`, 'color: #ef4444; font-weight: bold;', error);
                console.error(`  🔍 Error type: ${error.constructor.name}`);
                console.error(`  📝 Error message: ${error.message}`);
                console.error(`  📍 Error stack: ${error.stack}`);
            }
        }
        console.groupEnd();

        // Load language files
        console.group('%c🌍 Language Files Loading', 'color: #06b6d4; font-weight: bold;');
        const languageFiles = [
            'lang/de.json',
            'lang/en.json',
            'lang/fr.json',
            'lang/id.json',
            'lang/ja.json',
            'lang/ko.json',
            'lang/pt.json',
            'lang/ru.json',
            'lang/tr.json',
            'lang/uk.json',
            'lang/vi.json',
            'lang/zh-CN.json',
            'lang/zh-TW.json'
        ];

        // Check if nested lang folder exists
        try {
            console.log('%c📂 Checking for nested language folder...', 'color: #06b6d4;');
            const esUrl = chrome.runtime.getURL('lang/lang/es-MX.json');
            const esResponse = await fetch(esUrl);
            if (esResponse.ok) {
                languageFiles.push('lang/lang/es-MX.json');
                console.log(`%c✅ Found nested language file: es-MX.json`, 'color: #10b981;');
            } else {
                console.log(`%c📝 No nested language folder found`, 'color: #06b6d4;');
            }
        } catch (e) {
            console.log(`%c📝 No nested language folder available`, 'color: #06b6d4;');
        }

        for (const langFile of languageFiles) {
            try {
                console.log(`%c� Loading language: ${langFile}`, 'color: #06b6d4;');
                console.log(`  🌐 Language: ${langFile.replace('lang/', '').replace('.json', '').toUpperCase()}`);
                console.log(`  📍 Source path: ${langFile}`);
                console.log(`  🔗 Full URL: chrome-extension://${chrome.runtime.id}/${langFile}`);
                
                const langUrl = chrome.runtime.getURL(langFile);
                console.log(`  🌐 Resolved URL: ${langUrl}`);
                
                const response = await fetch(langUrl);
                console.log(`  📡 Fetch response status: ${response.status} ${response.statusText}`);
                
                if (response.ok) {
                    const text = await response.text();
                    console.log(`  📏 Raw text size: ${text.length.toLocaleString()} characters`);
                    
                    const parsed = JSON.parse(text);
                    const fileName = langFile.split('/').pop();
                    resources.languages[fileName] = parsed;
                    
                    console.log(`%c✅ ${fileName} loaded successfully`, 'color: #10b981; font-weight: bold;');
                    console.log(`  📏 JSON size: ${text.length.toLocaleString()} characters`);
                    console.log(`  📊 File size: ${(text.length / 1024).toFixed(2)} KB`);
                    console.log(`  🔑 Translation keys: ${Object.keys(parsed).length.toLocaleString()}`);
                    console.log(`  🔍 Content type: JSON translation data`);
                    
                    // Show some sample keys
                    const sampleKeys = Object.keys(parsed).slice(0, 5);
                    console.log(`  🎯 Sample keys: ${sampleKeys.join(', ')}${Object.keys(parsed).length > 5 ? '...' : ''}`);
                    
                    // Show sample translations
                    const samples = sampleKeys.map(key => `${key}: "${parsed[key]}"`).slice(0, 3);
                    console.log(`  📝 Sample translations: ${samples.join(', ')}`);
                    
                } else {
                    console.error(`%c❌ Failed to load ${langFile}`, 'color: #ef4444; font-weight: bold;');
                    console.error(`  📡 Status: ${response.status} ${response.statusText}`);
                    console.error(`  🌐 URL: ${langUrl}`);
                }
            } catch (error) {
                console.error(`%c💥 Exception loading language ${langFile}:`, 'color: #ef4444; font-weight: bold;', error);
                console.error(`  🔍 Error type: ${error.constructor.name}`);
                console.error(`  📝 Error message: ${error.message}`);
                if (error instanceof SyntaxError) {
                    console.error(`  🔍 JSON Parse Error - file may be corrupted or invalid`);
                }
            }
        }
        console.groupEnd();

        const loadTime = performance.now() - startTime;
        
        // Final summary with detailed statistics
        console.group('%c� Resource Loading Summary', 'color: #10b981; font-weight: bold;');
        console.log(`%c⏱️ Total loading time: ${loadTime.toFixed(2)}ms`, 'color: #10b981; font-weight: bold;');
        console.log(`%c🎨 Themes loaded: ${Object.keys(resources.themes).length}/${themeFiles.length}`, 'color: #8b5cf6; font-weight: bold;');
        console.log(`%c🌍 Languages loaded: ${Object.keys(resources.languages).length}/${languageFiles.length}`, 'color: #06b6d4; font-weight: bold;');
        
        // Calculate total size
        const themeSize = Object.values(resources.themes).reduce((sum, content) => sum + content.length, 0);
        const langSize = Object.values(resources.languages).reduce((sum, content) => sum + JSON.stringify(content).length, 0);
        const totalSize = themeSize + langSize;
        
        console.log(`%c📊 Total data loaded: ${(totalSize / 1024).toFixed(2)} KB`, 'color: #10b981; font-weight: bold;');
        console.log(`  🎨 Themes: ${(themeSize / 1024).toFixed(2)} KB`);
        console.log(`  🌍 Languages: ${(langSize / 1024).toFixed(2)} KB`);
        
        console.log(`%c📁 Resource sources:`, 'color: #10b981; font-weight: bold;');
        console.log(`  📍 Extension ID: ${chrome.runtime.id}`);
        console.log(`  🔗 Base URL: chrome-extension://${chrome.runtime.id}/`);
        console.log(`  📂 Themes folder: chrome-extension://${chrome.runtime.id}/themes/`);
        console.log(`  📂 Languages folder: chrome-extension://${chrome.runtime.id}/lang/`);
        
        // List successful loads
        if (Object.keys(resources.themes).length > 0) {
            console.log(`%c✅ Loaded themes: ${Object.keys(resources.themes).join(', ')}`, 'color: #8b5cf6;');
        }
        if (Object.keys(resources.languages).length > 0) {
            const langs = Object.keys(resources.languages).map(f => f.replace('.json', '')).join(', ');
            console.log(`%c✅ Loaded languages: ${langs}`, 'color: #06b6d4;');
        }
        
        console.log(`%c🚀 Resources ready for injection into scripts`, 'color: #10b981; font-weight: bold;');
        console.groupEnd();
        console.groupEnd();

    } catch (error) {
        const loadTime = performance.now() - startTime;
        console.error('%c💥 Critical error in resource loading system:', 'color: #ef4444; font-weight: bold; font-size: 14px;', error);
        console.error(`  ⏱️ Failed after: ${loadTime.toFixed(2)}ms`);
        console.error(`  🔍 Error type: ${error.constructor.name}`);
        console.error(`  📝 Error message: ${error.message}`);
        console.error(`  📍 Error stack: ${error.stack}`);
        console.groupEnd();
    }

    return resources;
}


