chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanLinksBackground") {
        // Check if the user has Email Mode enabled
        chrome.storage.local.get(['emailMode'], async (res) => {
            if (res.emailMode) {
                for (const url of request.urls) {
                    try {
                        const response = await fetch("http://localhost:5000/predict", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: url })
                        });
                        const data = await response.json();
                        
                        if (data.classification === "malicious") {
                            // Tell the email page to show a warning
                            chrome.tabs.sendMessage(sender.tab.id, {
                                action: "maliciousFound",
                                url: url
                            });
                        }
                    } catch (error) {
                        console.error("Backend error:", error);
                    }
                }
            }
        });
    }
});
const trustedDomains = ["google.com", "gmail.com", "microsoft.com", "outlook.com"];

function isTrusted(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');
        return trustedDomains.some(trusted => domain === trusted || domain.endsWith('.' + trusted));
    } catch (e) { return false; }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanLinksBackground") {
        chrome.storage.local.get(['emailMode'], async (res) => {
            if (res.emailMode) {
                for (const url of request.urls) {
                    // SKIP TRUSTED URLS
                    if (isTrusted(url)) continue; 

                    try {
                        const response = await fetch("http://localhost:5000/predict", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: url })
                        });
                        const data = await response.json();
                        if (data.classification === "malicious") {
                            chrome.tabs.sendMessage(sender.tab.id, { action: "maliciousFound", url: url });
                        }
                    } catch (error) { console.error(error); }
                }
            }
        });
    }
});