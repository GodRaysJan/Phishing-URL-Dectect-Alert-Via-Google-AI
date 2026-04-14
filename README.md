🛡️ AI Webpage Link Scanner
An AI-powered Chrome Extension designed to identify and neutralize phishing threats in real-time. By leveraging the Google Gemini AI model, this tool scans hyperlinks within your browser—specifically optimized for Gmail and Outlook—to classify them as safe or malicious before you click.
✨ Features
    Real-Time Email Protection: Automatically monitors Gmail and Outlook for incoming links using a MutationObserver.
    Heuristic AI Analysis: Uses Gemini  to analyze URL structures and identify "zero-day" phishing attempts that traditional blacklists might miss.
    Visual Security Cues: Aggressively highlights malicious links with red borders and yellow backgrounds directly within the email interface.
    Trusted Domain Allowlist: Skip scans for known-safe domains (e.g., Google, Microsoft, GitHub) to optimize performance and reduce API latency.
    Persistent Results: View a history of your latest scans even after closing the popup, powered by chrome.storage.

🏗️ How It Works
The system operates in three layers:
    The Frontend (Chrome Extension): Extracts URLs from the webpage and handles the UI.
    The Middleware (Background Script): Acts as a bridge to send URLs to the backend, bypassing browser security restrictions.
    The Backend (Python/Flask): Interfaces with the Gemini AI model to retrieve a security classification.

🚀 Getting Started
1. Prerequisites
    Google Chrome Browser (Version 88 or higher).
    Python 3.9+ installed. (And some of its Libaries)
    Gemini API Key: Get one for free or Paid at Google AI Studio.
    *(OR Build your Own Ai Locally Aviod 3rd Party Ai Tokens)

3. Backend Setup
   1.Clone this repository or download the source code.
     Navigate to the project directory and install dependencies:
   2. Bash  (pip install flask flask-cors google-generativeai)
   3. Open app.py and replace "Gemeni api key here paste" with your actual API key.
   4. Run the server: Bash  (python app.py)
   5.The server will start on http://localhost:5000.

4. Extension Installation
    Open Chrome and navigate to chrome://extensions/.
    Enable Developer Mode using the toggle in the top-right corner.
    Click Load unpacked.
    Select the folder containing your extension files (where manifest.json is located).

🛠️ Step-by-Step Usage
Manual Scanning
    Navigate to any webpage.
    Click the AI Webpage Link Scanner icon in your extension bar.
    Click Scan Current Page Now.
    The table will populate with the first 10 unique links found, showing their AI-determined status (Safe/Malicious).

Automated Email Protection (Recommended)
    Open the extension popup.
    Toggle the "Auto-Scan Emails" checkbox to ON.
    Navigate to your Gmail or Outlook inbox.
    The extension will now automatically scan links as you open emails. If a threat is detected, the link will turn red and an alert will pop up.

⚠️ Troubleshooting
"Extension context invalidated" Error:
If you see this error in your console, it usually means the extension was updated or reloaded while the webpage was already open. 
Simply refresh your Gmail/Outlook tab to reconnect the content script to the extension.

🛠️ Tech Stack
    Frontend: JavaScript (ES6), HTML5, CSS3.
    Backend: Python, Flask, Flask-CORS.
    AI: Google Generative AI (Gemini 1.5 Flash).
    API: Chrome Extension API (v3).
