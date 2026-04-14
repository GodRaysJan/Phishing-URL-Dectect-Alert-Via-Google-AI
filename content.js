let scannedUrls = new Set();
let scanningTimeout;

// List of trusted domains to skip (matching your popup logic)
const trustedDomains = ["google.com", "gmail.com", "microsoft.com", "outlook.com", "github.com"];

function isTrusted(url) {
    try {
        const hostname = new URL(url).hostname.toLowerCase();
        return trustedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    } catch (e) { return false; }
}

function extractAndScanLinks() {
    // Check if extension context is valid to avoid the "invalidated" error
    if (!chrome.runtime?.id) return;

    chrome.storage.local.get(['emailMode'], (res) => {
        if (chrome.runtime.lastError || !res.emailMode) return;

        const links = Array.from(document.querySelectorAll('a'));
        let newUrls = [];

        links.forEach(a => {
            const url = a.href;
            if (url.startsWith('http') && !scannedUrls.has(url)) {
                scannedUrls.add(url);
                // ONLY add to scan list if NOT in the trusted list
                if (!isTrusted(url)) {
                    newUrls.push(url);
                }
            }
        });

        if (newUrls.length > 0) {
            chrome.runtime.sendMessage({ action: "scanLinksBackground", urls: newUrls });
        }
    });
}

const observer = new MutationObserver(() => {
    clearTimeout(scanningTimeout);
    scanningTimeout = setTimeout(extractAndScanLinks, 1000);
});
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "maliciousFound") {
        const maliciousLinks = document.querySelectorAll(`a[href="${request.url}"]`);
        maliciousLinks.forEach(link => {
            link.style.border = "3px solid red";
            link.style.backgroundColor = "#ffe6e6";
            link.style.color = "red";
            link.style.fontWeight = "bold";
            link.title = "⚠️ AI Warning: Potential Malicious Link";
        });
        alert(`🚨 SECURITY WARNING:\n\nMalicious link detected: ${request.url}`);
    }
});