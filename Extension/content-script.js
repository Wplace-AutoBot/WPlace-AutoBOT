// Content script for WPlace AutoBOT - Creates in-page UI

// Check if we're on wplace.live
if (window.location.hostname === 'wplace.live') {

    // Control variables
    let autobotButton = null;
    let buttonRemoved = false;
    let buttonHiddenByModal = false;
    let currentScript = null;

    // Available scripts configuration - default script to execute
    const DEFAULT_SCRIPT = 'Script-manager.js'; // Script manager launcher

    // Check if any modal is open
    function isAnyModalOpen() {
        const modals = document.querySelectorAll('dialog.modal[open], dialog[open]');
        return modals.length > 0;
    }

    // Handle button visibility based on modals
    function handleButtonVisibility() {
        if (!autobotButton || buttonRemoved) return;

        if (isAnyModalOpen()) {
            if (!buttonHiddenByModal) {
                buttonHiddenByModal = true;
                autobotButton.style.transition = 'all 0.3s ease-out';
                autobotButton.style.opacity = '0';
                autobotButton.style.transform = 'scale(0.8)';
                autobotButton.style.pointerEvents = 'none';
            }
        } else {
            if (buttonHiddenByModal) {
                buttonHiddenByModal = false;
                autobotButton.style.transition = 'all 0.3s ease-in';
                autobotButton.style.opacity = '1';
                autobotButton.style.transform = 'scale(1)';
                autobotButton.style.pointerEvents = 'auto';
            }
        }
    }

    // Remove button with animation
    function removeButtonWithAnimation() {
        buttonRemoved = true;

        if (autobotButton && autobotButton.parentNode) {
            autobotButton.style.transition = 'all 0.5s ease-out';
            autobotButton.style.opacity = '0';
            autobotButton.style.transform = 'scale(0.5) translateY(-10px)';

            setTimeout(() => {
                if (autobotButton && autobotButton.parentNode) {
                    autobotButton.parentNode.removeChild(autobotButton);
                    autobotButton = null;
                }
            }, 500);
        }
    }

    // Execute script function
    async function executeScript(scriptName) {
        if (!autobotButton || currentScript) return;

        try {
            // Change button appearance to loading
            autobotButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 animate-spin">
                    <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
            `;
            autobotButton.style.opacity = '0.7';
            autobotButton.disabled = true;
            currentScript = scriptName;

            // Send message to background script
            const response = await chrome.runtime.sendMessage({
                action: 'executeScript',
                scriptName: scriptName
            });

            if (response && response.success) {
                // Show success
                autobotButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                    </svg>
                `;
                autobotButton.style.background = '#4CAF50';
                autobotButton.disabled = false;
                autobotButton.title = `${scriptName} executed successfully`;

                // Reset button after 2 seconds instead of removing it
                setTimeout(() => {
                    resetButton();
                }, 2000);
            } else {
                throw new Error(response?.error || 'Failed to execute script');
            }

        } catch (error) {
            console.error('Error executing script:', error);
            currentScript = null;

            // Show error feedback
            if (autobotButton) {
                autobotButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                    </svg>
                `;
                autobotButton.style.opacity = '1';
                autobotButton.style.background = '#f44336';
                autobotButton.title = `Error: ${error.message} - Click to retry`;

                setTimeout(() => {
                    resetButton();
                }, 3000);
            }
        }
    }

    // Listen for script execution events from Script Manager
    window.addEventListener('autobot-execute-script', async (event) => {
        const { scriptName } = event.detail;
        console.log(`%c📡 Content script received execution request for: ${scriptName}`, 'color: #00ff41; font-weight: bold;');

        // Execute the script using the content script's Chrome API access
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'executeScript',
                scriptName: scriptName
            });

            if (response && response.success) {
                console.log(`%c✅ ${scriptName} executed successfully via content script`, 'color: #39ff14; font-weight: bold;');
            } else {
                console.error(`%c❌ Script execution failed:`, 'color: #ff073a; font-weight: bold;', response?.error);
            }
        } catch (error) {
            console.error(`%c❌ Script execution error:`, 'color: #ff073a; font-weight: bold;', error);
        }
    });

    // Reset button to initial state
    function resetButton() {
        if (autobotButton) {
            autobotButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12A2,2 0 0,1 6,10M18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12A2,2 0 0,1 18,10M8,17.5H16V16H8V17.5Z"/>
                </svg>
            `;
            autobotButton.style.background = '';
            autobotButton.title = `AutoBot - Click to run ${DEFAULT_SCRIPT}`;
            autobotButton.disabled = false;
            currentScript = null;
        }
    }

    // Script menu functionality removed - button now directly executes the default script

    // Create the AutoBot button
    function createAutoButton() {
        if (buttonRemoved) return;

        const menuContainer = document.querySelector('.absolute.right-2.top-2.z-30 .flex.flex-col.gap-3.items-center');

        if (!menuContainer) {
            setTimeout(createAutoButton, 1000);
            return;
        }

        if (document.getElementById('wplace-autobot-btn')) {
            return;
        }

        autobotButton = document.createElement('button');
        autobotButton.id = 'wplace-autobot-btn';
        autobotButton.className = 'btn btn-square shadow-md';
        autobotButton.title = `AutoBot - Click to run ${DEFAULT_SCRIPT}`;
        autobotButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12A2,2 0 0,1 6,10M18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12A2,2 0 0,1 18,10M8,17.5H16V16H8V17.5Z"/>
            </svg>
        `;

        autobotButton.style.cssText = `
            transition: all 0.2s ease;
        `;

        // Direct execution instead of showing menu
        autobotButton.addEventListener('click', () => {
            executeScript(DEFAULT_SCRIPT);
        });

        // Insert button at the end of the container
        menuContainer.appendChild(autobotButton);

        setTimeout(() => handleButtonVisibility(), 100);

        console.log('AutoBot button added to menu');
    }

    // Setup modal observers
    function setupModalObservers() {
        const modalAttributeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
                    handleButtonVisibility();
                }
            });
        });

        const domObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches('dialog.modal, dialog')) {
                                modalAttributeObserver.observe(node, {
                                    attributes: true,
                                    attributeFilter: ['open']
                                });
                                handleButtonVisibility();
                            }

                            const nestedModals = node.querySelectorAll ?
                                node.querySelectorAll('dialog.modal, dialog') : [];
                            nestedModals.forEach((modal) => {
                                modalAttributeObserver.observe(modal, {
                                    attributes: true,
                                    attributeFilter: ['open']
                                });
                            });

                            if (nestedModals.length > 0) {
                                handleButtonVisibility();
                            }
                        }
                    });

                    if (mutation.removedNodes.length > 0) {
                        handleButtonVisibility();
                    }
                }
            });
        });

        const existingModals = document.querySelectorAll('dialog.modal, dialog');
        existingModals.forEach((modal) => {
            modalAttributeObserver.observe(modal, {
                attributes: true,
                attributeFilter: ['open']
            });
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Observer to recreate button if removed
    const buttonObserver = new MutationObserver((mutations) => {
        if (!buttonRemoved) {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    if (!document.getElementById('wplace-autobot-btn')) {
                        setTimeout(createAutoButton, 500);
                    }
                }
            });
        }
    });

    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        if (event.data.source !== "my-userscript") return;
        const message = event.data;
        if (message.type === "setCookie" && message.value) {
            chrome.runtime.sendMessage(
                { type: "setCookie", value: message.value },
                (response) => {
                    if (response.status === "ok") {
                        console.log("✅ Forwarded token to background.");
                    }
                }
            );
        }
    });

    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        const msg = event.data;
        if (msg && msg.source === "my-userscript") {
            if (msg.type === "getAccounts") {
                chrome.runtime.sendMessage({ type: "getAccounts" }, (response) => {
                    if (response && response.accounts) {
                        window.postMessage(
                            {
                                source: "extension",
                                type: "accountsData",
                                accounts: response.accounts,
                            },
                            "*"
                        );
                    }
                });
            }
        }
    });

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "cookieSet") {
            window.postMessage(
                {
                    source: "my-extension",
                    type: "cookieSet",
                    value: msg.value,
                },
                "*"
            );
        }
    });

    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        const msg = event.data;
        if (msg?.type === "deleteAccount" && typeof msg.index === "number") {
            chrome.runtime.sendMessage(
                { type: "deleteAccount", index: msg.index },
                (response) => {
                    window.postMessage(
                        {
                            type: "deleteAccountResult",
                            index: msg.index,
                            status: response?.status || "error",
                        },
                        "*"
                    );
                }
            );
        }
    });

    // Initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createAutoButton();
            setupModalObservers();
        });
    } else {
        createAutoButton();
        setupModalObservers();
    }

    setTimeout(() => {
        createAutoButton();
        setupModalObservers();
    }, 2000);

    buttonObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('WPlace AutoBOT content script loaded');
}


