// WPlace AutoBOT Popup Script with Account Management

// Available scripts configuration - Script Manager as primary launcher
const AVAILABLE_SCRIPTS = [
    {
        name: 'Script-manager-fixed.js',
        displayName: '⚡ Script Manager (Fixed)',
        description: 'Neon-themed script launcher with proper communication bridge',
        filename: 'Script-manager-fixed.js',
        isPrimary: true
    },
    {
        name: 'Auto-Farm.js',
        displayName: '🌾 Auto Farm',
        description: 'Automated farming and pixel painting',
        filename: 'Auto-Farm.js'
    },
    {
        name: 'Auto-Image.js',
        displayName: '🖼️ Auto Image',
        description: 'Automated image processing and placement with account switching',
        filename: 'Auto-Image.js'
    },
    {
        name: 'Auto-Repair.js',
        displayName: '🔧 Auto Repair',
        description: 'Automated repair and maintenance tasks',
        filename: 'Auto-Repair.js'
    },
    {
        name: 'Art-Extractor.js',
        displayName: '🎨 Art Extractor',
        description: 'Extract artwork areas from canvas and save as JSON files',
        filename: 'Art-Extractor.js'
    }
];

// DOM elements
let statusDot, statusText, scriptsList, accountsContainer, accountPlaceholder;
let addAccountModal, accountNameInput, accountTokenInput;
let refreshAccountBtn, addAccountBtn, saveAccountBtn, cancelAccountBtn, closeModalBtn;
let exportAccountsBtn, importAccountsBtn;

// Global state
let accounts = [];
let currentAccountIndex = -1;
let isLoading = false;

document.addEventListener('DOMContentLoaded', async () => {
    initializeElements();
    await loadScripts();
    await loadAccounts();
    setupEventListeners();
    checkCurrentTab();
    console.log('🚀 Account Manager initialized');
});

function initializeElements() {
    // Existing elements
    statusDot = document.getElementById('statusDot');
    statusText = document.getElementById('statusText');
    scriptsList = document.getElementById('scriptsList');

    // Account management elements
    accountsContainer = document.getElementById('accountsContainer');
    accountPlaceholder = document.getElementById('accountPlaceholder');

    // Modal elements
    addAccountModal = document.getElementById('addAccountModal');
    accountNameInput = document.getElementById('accountName');
    accountTokenInput = document.getElementById('accountToken');

    // Button elements
    refreshAccountBtn = document.getElementById('refreshAccountBtn');
    addAccountBtn = document.getElementById('addAccountBtn');
    saveAccountBtn = document.getElementById('saveAccountBtn');
    cancelAccountBtn = document.getElementById('cancelAccountBtn');
    closeModalBtn = document.getElementById('closeModalBtn');
    exportAccountsBtn = document.getElementById('exportAccountsBtn');
    importAccountsBtn = document.getElementById('importAccountsBtn');
}

async function loadScripts() {
    scriptsList.innerHTML = '';

    AVAILABLE_SCRIPTS.forEach(script => {
        const scriptElement = createScriptElement(script);
        scriptsList.appendChild(scriptElement);
    });
}

function createScriptElement(script) {
    const div = document.createElement('div');
    div.className = 'script-item';

    // Add special styling for primary script
    if (script.isPrimary) {
        div.style.background = 'rgba(0,255,65,0.1)';
        div.style.boxShadow = '0 0 15px rgb(0 255 65 / 30%)';
    }

    div.innerHTML = `
        <div class="script-info-left">
            <div class="script-name">${script.displayName}</div>
            <div class="script-description">${script.description}</div>
        </div>
        <button class="btn ${script.isPrimary ? 'btn-primary' : 'btn-primary'} launch-btn" data-script="${script.filename}">
            <span class="icon">${script.isPrimary ? '⚡' : '▶'}</span>
            ${script.isPrimary ? 'Open' : 'Launch'}
        </button>
    `;

    return div;
}

function setupEventListeners() {
    // Launch script buttons
    scriptsList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('launch-btn') || e.target.closest('.launch-btn')) {
            const btn = e.target.closest('.launch-btn') || e.target;
            const scriptName = btn.dataset.script;
            await launchScript(scriptName, btn);
        }
    });

    // Account management buttons
    refreshAccountBtn.addEventListener('click', handleRefreshAccount);
    addAccountBtn.addEventListener('click', openAddAccountModal);
    saveAccountBtn.addEventListener('click', handleSaveAccount);
    cancelAccountBtn.addEventListener('click', closeAddAccountModal);
    closeModalBtn.addEventListener('click', closeAddAccountModal);
    exportAccountsBtn.addEventListener('click', handleExportAccounts);
    importAccountsBtn.addEventListener('click', handleImportAccounts);

    // Modal close on overlay click
    addAccountModal.addEventListener('click', (e) => {
        if (e.target === addAccountModal) {
            closeAddAccountModal();
        }
    });

    // Account container click handling
    accountsContainer.addEventListener('click', handleAccountClick);

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('settingsModal').style.display = 'flex';
        loadStartupScript(); // Load current startup script selection
        populateStartupScriptSelect(); // Populate script options
    });

    // Settings modal close buttons
    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });

    document.getElementById('closeSettingsModalBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });

    // Settings modal close on overlay click
    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('settingsModal')) {
            document.getElementById('settingsModal').style.display = 'none';
        }
    });

    // Startup script selection
    document.getElementById('startupScriptSelect').addEventListener('change', async (e) => {
        const scriptName = e.target.value;
        await chrome.storage.local.set({ startupScript: scriptName });
        showNotification(scriptName ? 
            `Startup script set to ${AVAILABLE_SCRIPTS.find(s => s.filename === scriptName).displayName}` : 
            'Startup script disabled', 
            'success'
        );
    });
}

async function loadAccounts() {
    try {
        setLoading(true);

        const response = await chrome.runtime.sendMessage({ type: 'getAccounts' });
        const storedAccounts = response?.accounts || [];
        const result = await chrome.storage.local.get('infoAccounts');
        const infoAccounts = result.infoAccounts || [];

        accounts = storedAccounts.map((token, index) => {
            const info = infoAccounts.find(acc => acc.token === token);
            console.log(`Account ${index + 1} info:`, info);
            return {
                index,
                token,
                name: info?.name,
                id: info?.ID,
                Charges: info?.Charges,
                Max: info?.Max,
                Droplets: info?.Droplets,
                maxPixels: info?.Max,
                droplets: info?.Droplets,
                allianceName: info?.allianceName,
                allianceRole: info?.allianceRole,
                totalPixelsPainted: info?.totalPixelsPainted,
                level: info?.level,
            };
        });

        renderAccounts();
        console.log('📂 Loaded accounts with enhanced status:', accounts);

    } catch (error) {
        console.error('❌ Error loading accounts:', error);
        showNotification('Failed to load accounts', 'error');
    } finally {
        setLoading(false);
    }
}

function renderAccounts() {
    if (accounts.length === 0) {
        accountPlaceholder.style.display = 'flex';
        accountsContainer.innerHTML = '';
        accountsContainer.appendChild(accountPlaceholder);
        return;
    }

    accountPlaceholder.style.display = 'none';
    accountsContainer.innerHTML = '';

    accounts.forEach((account, index) => {
        const accountElement = createAccountElement(account, index);
        accountsContainer.appendChild(accountElement);
    });
}

function createAccountElement(account, index) {
    const div = document.createElement('div');
    div.className = `account-item ${account.isActive ? 'active' : ''}`;
    div.dataset.index = index;

    // Format like the old version: Name, Charges/Max, and Droplets
    const charges = Math.floor(account.Charges);
    const max = Math.floor(account.Max);
    const droplets = Math.floor(account.Droplets);

    div.innerHTML = `
        <div class="account-info">
            <div class="account-name">${escapeHtml(account.name)}</div>
            <div class="account-stats">
                <span>⚡ ${charges}/${max}</span>
                <span>💧 ${droplets}</span>
            </div>
        </div>
        <div class="account-actions">
            <button class="btn btn-primary btn-icon switch-btn" title="Switch to this account" data-action="switch" data-index="${index}">
                <span class="icon">🔄</span>
            </button>
            <button class="btn btn-danger btn-icon delete-btn" title="Delete account" data-action="delete" data-index="${index}">
                <span class="icon">🗑️</span>
            </button>
        </div>
    `;

    return div;
}

async function handleAccountClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const action = e.target.dataset.action || e.target.closest('[data-action]')?.dataset.action;
    const index = parseInt(e.target.dataset.index || e.target.closest('[data-index]')?.dataset.index);

    if (isNaN(index) || index < 0 || index >= accounts.length) return;

    switch (action) {
        case 'switch':
            await switchToAccount(index);
            break;
        case 'delete':
            await deleteAccount(index);
            break;
        default:
            // Click on account item itself - switch account
            await switchToAccount(index);
            break;
    }
}

async function switchToAccount(index) {
    try {
        if (isLoading) return;

        setLoading(true);
        showNotification('Switching account...', 'info');

        const account = accounts[index];
        console.log('🔄 Switching to account:', account);

        // Send switch message to background
        const response = await chrome.runtime.sendMessage({
            type: 'setCookie',
            value: account.token
        });

        if (response?.status === 'ok') {
            // Update active state
            accounts.forEach((acc, i) => acc.isActive = i === index);
            currentAccountIndex = index;

            renderAccounts();
            showNotification(`Switched to ${account.name}`, 'success');

            console.log('✅ Account switched successfully');

            // Auto-refresh the page after account switch
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url.includes('wplace.live')) {
                console.log('🔄 Auto-refreshing page after account switch');
                await chrome.tabs.reload(tab.id);
                
                // Close popup after a short delay
                setTimeout(() => {
                    window.close();
                }, 500);
            }

        } else {
            throw new Error(response?.error || 'Failed to switch account');
        }

    } catch (error) {
        console.error('❌ Error switching account:', error);
        showNotification('Failed to switch account', 'error');
    } finally {
        setLoading(false);
    }
}

async function deleteAccount(index) {
    try {
        if (isLoading) return;

        const account = accounts[index];

        // Confirm deletion
        if (!confirm(`Delete account "${account.name}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        setLoading(true);
        showNotification('Deleting account...', 'info');

        console.log('🗑️ Deleting account:', account);

        // Send delete message to background
        const response = await chrome.runtime.sendMessage({
            type: 'deleteAccount',
            index: account.index
        });

        if (response?.status === 'ok') {
            // Remove from local array
            accounts.splice(index, 1);

            // Update indices
            accounts.forEach((acc, i) => acc.index = i);

            // Clear active state if deleted account was active
            if (currentAccountIndex === index) {
                currentAccountIndex = -1;
            } else if (currentAccountIndex > index) {
                currentAccountIndex--;
            }

            renderAccounts();
            showNotification(`Deleted ${account.name}`, 'success');

            console.log('✅ Account deleted successfully');

        } else {
            throw new Error('Failed to delete account');
        }

    } catch (error) {
        console.error('❌ Error deleting account:', error);
        showNotification('Failed to delete account', 'error');
    } finally {
        setLoading(false);
    }
}

async function handleRefreshAccount() {
    try {
        if (isLoading) return;

        setLoading(true);
        showNotification('Fetching current account...', 'info');

        console.log('🔄 Refreshing account from current session');

        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('wplace.live')) {
            throw new Error('Please navigate to wplace.live first');
        }

        // Trigger account preservation which will add current account
        await chrome.runtime.sendMessage({ type: 'refreshCurrentAccount' });

        // Wait a bit for the account to be processed
        setTimeout(async () => {
            await loadAccounts();
            showNotification('Account refreshed successfully', 'success');
        }, 2000);

    } catch (error) {
        console.error('❌ Error refreshing account:', error);
        showNotification(error.message || 'Failed to refresh account', 'error');
        setLoading(false);
    }
}

function openAddAccountModal() {
    addAccountModal.style.display = 'flex';
    accountNameInput.value = '';
    accountTokenInput.value = '';
    accountNameInput.focus();
}

function closeAddAccountModal() {
    addAccountModal.style.display = 'none';
    accountNameInput.value = '';
    accountTokenInput.value = '';
}

async function handleSaveAccount() {
    try {
        const name = accountNameInput.value.trim();
        const token = accountTokenInput.value.trim();

        if (!name) {
            showNotification('Please enter an account name', 'error');
            accountNameInput.focus();
            return;
        }

        if (!token) {
            showNotification('Please enter a token', 'error');
            accountTokenInput.focus();
            return;
        }

        // Basic token validation
        if (token.length < 10) {
            showNotification('Token appears to be too short', 'error');
            accountTokenInput.focus();
            return;
        }

        setLoading(true);
        showNotification('Validating and saving account...', 'info');

        console.log('💾 Saving manual account:', { name, token: token.substring(0, 20) + '...' });

        // Validate token format (basic check)
        const validation = await validateAccountToken(token);
        if (!validation.valid) {
            showNotification(validation.error || 'Invalid token format', 'error');
            return;
        }

        const result = await chrome.storage.local.get('infoAccounts');
        let infoAccounts = result.infoAccounts || [];

        // Check if account already exists by token
        const existingIndex = infoAccounts.findIndex(acc => acc.token === token);

        const accountInfo = {
            ID: 'manual_' + Date.now(), // Placeholder ID for manual accounts
            name: name,
            token: token,
            Charges: 0,
            Max: 100,
            Droplets: 0,
            currentPixels: 0,
            maxPixels: 100,
            droplets: 0,
            alliance: 'Unknown',
            allianceName: 'Unknown',
            allianceRole: 'Member',
            totalPixelsPainted: 0,
            level: 1,
        };

        if (existingIndex > -1) {
            // Update existing account
            infoAccounts[existingIndex] = accountInfo;
            showNotification('Account updated successfully', 'success');
        } else {
            // Add new account
            infoAccounts.push(accountInfo);
            showNotification('Account added successfully', 'success');
        }

        // Save to storage
        await chrome.storage.local.set({ infoAccounts });

        // Update accounts list in background
        const accounts = infoAccounts.map(info => info.token);
        await chrome.storage.local.set({ accounts });

        closeAddAccountModal();
        await loadAccounts();

        console.log('✅ Manual account saved successfully');

    } catch (error) {
        console.error('❌ Error saving account:', error);
        showNotification('Failed to save account', 'error');
    } finally {
        setLoading(false);
    }
}

async function launchScript(scriptName, button) {
    try {
        showNotification('Launching ' + scriptName + '...', 'info');

        // Update button state
        button.disabled = true;
        const originalContent = button.innerHTML;
        button.innerHTML = '<span class="icon">⏳</span> Launching...';

        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('wplace.live')) {
            throw new Error('Please navigate to wplace.live first');
        }

        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'executeScript',
            scriptName: scriptName,
            tabId: tab.id
        });

        if (response && response.success) {
            button.innerHTML = '<span class="icon">✅</span> Launched';
            button.style.background = '#4CAF50';
            showNotification(scriptName + ' executed successfully', 'success');

            // Close popup after success
            setTimeout(() => {
                window.close();
            }, 1500);
        } else {
            throw new Error(response?.error || 'Failed to execute script');
        }

    } catch (error) {
        console.error('Error launching script:', error);
        showNotification('Failed to launch ' + scriptName + ': ' + error.message, 'error');

        // Reset button
        button.disabled = false;
        button.innerHTML = originalContent;
        button.style.background = '';
    }
}

async function checkCurrentTab() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url.includes('wplace.live')) {
            statusDot.className = 'status-dot';
            statusText.textContent = 'Ready';
            showNotification('Ready to launch scripts on wplace.live', 'success');
        } else {
            statusDot.className = 'status-dot error';
            statusText.textContent = 'Not on WPlace';
            showNotification('Please navigate to wplace.live to use scripts', 'warning');

            // Disable all launch buttons
            document.querySelectorAll('.launch-btn').forEach(btn => {
                btn.disabled = true;
            });
        }
    } catch (error) {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Error';
        showNotification('Error checking current tab: ' + error.message, 'error');
    }
}

function setLoading(loading) {
    isLoading = loading;
    document.body.classList.toggle('loading', loading);

    // Disable buttons during loading
    refreshAccountBtn.disabled = loading;
    addAccountBtn.disabled = loading;
    saveAccountBtn.disabled = loading;
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to body
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);

    // Update status indicator
    if (type === 'error') {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Error';
    } else if (type === 'success') {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Success';
    } else if (type === 'warning') {
        statusDot.className = 'status-dot running';
        statusText.textContent = 'Warning';
    } else {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Info';
    }

    // Only reset status if it's not the initial "Ready to launch" message
    if (message !== 'Ready to launch scripts on wplace.live') {
        setTimeout(() => {
            checkCurrentTab();
        }, 3000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Populate startup script select options
function populateStartupScriptSelect() {
    const select = document.getElementById('startupScriptSelect');
    select.innerHTML = '<option value="">None</option>';
    
    AVAILABLE_SCRIPTS.forEach(script => {
        const option = document.createElement('option');
        option.value = script.filename;
        option.textContent = script.displayName;
        select.appendChild(option);
    });
}

// Load startup script selection from storage
async function loadStartupScript() {
    const result = await chrome.storage.local.get('startupScript');
    const select = document.getElementById('startupScriptSelect');
    if (select) {
        select.value = result.startupScript || '';
    }
}

async function handleExportAccounts() {
    try {
        if (isLoading) return;
        
        setLoading(true);
        showNotification('Exporting accounts...', 'info');
        
        console.log('📤 Starting account export process');
        
        // Get accounts from storage
        const result = await chrome.storage.local.get('infoAccounts');
        const accounts = result.infoAccounts || [];
        
        if (accounts.length === 0) {
            showNotification('No accounts to export', 'warning');
            return;
        }
        
        // Create export data structure
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            accountCount: accounts.length,
            accounts: accounts.map(account => ({
                name: account.name,
                token: account.token,
                ID: account.ID,
                // Include static metadata only (exclude dynamic status like Charges, Max, Droplets)
                ...(account.lastActive && { lastActive: account.lastActive }),
                ...(account.level && { level: account.level }),
                ...(account.totalPixelsPainted && { totalPixelsPainted: account.totalPixelsPainted }),
                ...(account.allianceName && { allianceName: account.allianceName }),
                ...(account.allianceRole && { allianceRole: account.allianceRole })
            }))
        };
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `wplace-accounts-${timestamp}.json`;
        
        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Exported ${accounts.length} accounts to ${filename}`);
        showNotification(`Exported ${accounts.length} accounts successfully`, 'success');
        
    } catch (error) {
        console.error('❌ Error exporting accounts:', error);
        showNotification('Failed to export accounts', 'error');
    } finally {
        setLoading(false);
    }
}

async function handleImportAccounts() {
    try {
        if (isLoading) return;
        
        setLoading(true);
        showNotification('Importing accounts...', 'info');
        
        console.log('📥 Starting account import process');
        
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) {
                setLoading(false);
                return;
            }
            
            try {
                const text = await file.text();
                const importData = JSON.parse(text);
                
                // Validate import data structure
                if (!importData.accounts || !Array.isArray(importData.accounts)) {
                    throw new Error('Invalid file format: missing accounts array');
                }
                
                // Validate each account has required fields
                for (const account of importData.accounts) {
                    if (!account.name || !account.token) {
                        throw new Error('Invalid account data: missing name or token');
                    }
                }
                
                // Get existing accounts
                const result = await chrome.storage.local.get('infoAccounts');
                let existingAccounts = result.infoAccounts || [];
                
                let addedCount = 0;
                let updatedCount = 0;
                let skippedCount = 0;
                
                // Process each imported account
                for (const importAccount of importData.accounts) {
                    // Check if account already exists (by token or ID)
                    const existingIndex = existingAccounts.findIndex(existing => 
                        existing.token === importAccount.token || 
                        (existing.ID && importAccount.ID && existing.ID === importAccount.ID)
                    );
                    
                    if (existingIndex > -1) {
                        // Account exists - ask user what to do
                        const shouldUpdate = confirm(
                            `Account "${importAccount.name}" already exists. Update it?\n\n` +
                            `Click OK to update, Cancel to skip.`
                        );
                        
                        if (shouldUpdate) {
                            // Update existing account
                            existingAccounts[existingIndex] = {
                                ...existingAccounts[existingIndex],
                                ...importAccount,
                                lastImported: new Date().toISOString()
                            };
                            updatedCount++;
                            console.log(`🔄 Updated account: ${importAccount.name}`);
                        } else {
                            skippedCount++;
                            console.log(`⏭️ Skipped account: ${importAccount.name}`);
                        }
                    } else {
                        // New account - add it
                        existingAccounts.push({
                            ...importAccount,
                            lastImported: new Date().toISOString(),
                            // Set default values for missing fields
                            Charges: importAccount.Charges || 0,
                            Max: importAccount.Max || 100,
                            Droplets: importAccount.Droplets || 0
                        });
                        addedCount++;
                        console.log(`➕ Added new account: ${importAccount.name}`);
                    }
                }
                
                // Save updated accounts
                await chrome.storage.local.set({ infoAccounts: existingAccounts });
                
                // Update the accounts array for compatibility
                const accountTokens = existingAccounts.map(account => account.token);
                await chrome.storage.local.set({ accounts: accountTokens });
                
                // Reload the accounts display
                await loadAccounts();
                
                // Show summary
                const summary = [
                    `Import completed:`,
                    addedCount > 0 ? `${addedCount} added` : '',
                    updatedCount > 0 ? `${updatedCount} updated` : '',
                    skippedCount > 0 ? `${skippedCount} skipped` : ''
                ].filter(Boolean).join(', ');
                
                console.log(`✅ Import summary: ${summary}`);
                showNotification(summary, 'success');
                
            } catch (error) {
                console.error('❌ Error importing accounts:', error);
                showNotification(`Import failed: ${error.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        
        input.click();
        
    } catch (error) {
        console.error('❌ Error starting import:', error);
        showNotification('Failed to start import', 'error');
        setLoading(false);
    }
}

// Enhanced account validation
async function validateAccountToken(token) {
    try {
        // This would typically make a request to validate the token
        // For now, we'll do basic validation
        if (!token || typeof token !== 'string' || token.length < 10) {
            return { valid: false, error: 'Token appears to be invalid' };
        }

        // You could add actual API validation here
        return { valid: true };

    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modal
    if (e.key === 'Escape' && addAccountModal.style.display === 'flex') {
        closeAddAccountModal();
    }

    // Ctrl+R or F5 refreshes accounts
    if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        handleRefreshAccount();
    }

    // Ctrl+N adds new account
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openAddAccountModal();
    }
});
