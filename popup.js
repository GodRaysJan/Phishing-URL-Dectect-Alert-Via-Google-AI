const trustedDomains = ["google.com", "gmail.com", "microsoft.com", "outlook.com", "github.com"];

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("emailModeToggle");
    const resultsBody = document.getElementById("resultsBody");
    const tableWrapper = document.getElementById("tableWrapper");

    // Restore state and previous results
    chrome.storage.local.get(['emailMode', 'lastScanResults'], (result) => {
        if (toggle) toggle.checked = result.emailMode || false;
        if (result.lastScanResults) {
            tableWrapper.style.display = "block";
            renderTable(result.lastScanResults);
        }
    });

    toggle.addEventListener("change", (e) => {
        chrome.storage.local.set({ emailMode: e.target.checked });
    });
});

function renderTable(data) {
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="col-url" title="${item.url}">${item.url}</td>
            <td class="col-res ${item.status === 'safe' ? 'safe' : 'malicious'}">${item.status}</td>
        `;
        resultsBody.appendChild(row);
    });
}

document.getElementById("scanBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const resultsBody = document.getElementById("resultsBody");
    const tableWrapper = document.getElementById("tableWrapper");
    
    tableWrapper.style.display = "block";
    resultsBody.innerHTML = "";
    let currentResults = [];

    const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => Array.from(document.querySelectorAll('a')).map(a => a.href)
    });

    const urls = [...new Set(results[0].result)].filter(u => u.startsWith('http')).slice(0, 10);

    for (const url of urls) {
        const row = document.createElement("tr");
        const hostname = new URL(url).hostname.replace('www.', '');
        const isPreApproved = trustedDomains.some(d => hostname === d || hostname.endsWith('.' + d));

        if (isPreApproved) {
            const res = { url: url, status: 'safe' };
            currentResults.push(res);
            renderTable(currentResults);
            chrome.storage.local.set({ lastScanResults: currentResults });
            continue;
        }

        row.innerHTML = `<td class="col-url">${url}</td><td class="col-res">Scanning...</td>`;
        resultsBody.appendChild(row);

        try {
            const response = await fetch("http://localhost:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url })
            });
            const data = await response.json();
            currentResults.push({ url: url, status: data.classification });
            renderTable(currentResults);
            chrome.storage.local.set({ lastScanResults: currentResults });
        } catch (e) {
            console.error(e);
        }
    }
});