const cookieDomain = ".backend.wplace.live";

async function preserveAndResetJ() {
    let savedValue = null;

    try {
        const oldJ = await chrome.cookies.get({
            url: "https://backend.wplace.live/",
            name: "j"
        });

        if (oldJ && oldJ.value) {
            savedValue = oldJ.value;
            console.log("[bg] Saved j cookie:", savedValue);
        } else {
            console.warn("[bg] No 'j' cookie found → will only nuke cf_clearance");
        }

        setTimeout(async () => {
            await new Promise((resolve) => {
                chrome.browsingData.remove(
                    { origins: ["https://wplace.live"] },
                    { cookies: true },
                    () => {
                        console.log("[bg] Nuke done (delayed)");
                        resolve();
                    }
                );
            });

            if (savedValue) {
                setCookie(savedValue);
            } else {
                console.log("[bg] No j to restore, leaving nuked");
            }
        }, 2000);

    } catch (err) {
        console.error("[bg] Error in preserveAndResetJ:", err);
    }
}

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes("wplace.live")) {
        console.log("[bg] Page load detected → nuking cookies with double pass");
        preserveAndResetJ();
    }
}, { url: [{ hostContains: "wplace.live" }] });

function setCookie(value) {
    const cleaned = value.trim();
    console.log("[bg] setCookie CALLED with:", cleaned);

    chrome.cookies.set({
        url: "https://backend.wplace.live/",
        name: "j",
        value: cleaned,
        domain: cookieDomain,
        path: "/"
    }, (cookie) => {
        if (chrome.runtime.lastError) {
            console.error("[bg] cookie set error:", chrome.runtime.lastError.message);
        } else {
            console.log("[bg] cookie set result:", cookie);

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "cookieSet",
                        value: cleaned
                    });
                }
            });
        }
    });
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "setCookie" && msg.value) {
        await setCookie(msg.value);
        sendResponse({ status: "ok" });
    }
    return true;
});
