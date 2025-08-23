window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.source !== 'my-userscript') return;

    const message = event.data;
    if (message.type === 'setCookie' && message.value) {
        chrome.runtime.sendMessage({
            type: "setCookie",
            value: message.value
        }, (response) => {
            if (response?.status === "ok") {
                console.log("✅ Forwarded token to background.");
            }
        });
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "cookieSet") {
        window.postMessage({
            source: "my-extension",
            type: "cookieSet",
            value: msg.value
        }, "*");
    }
});
