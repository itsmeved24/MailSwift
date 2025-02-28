document.addEventListener("DOMContentLoaded", async function () {
    const formalReplyDiv = document.getElementById("formalReply");
    const casualReplyDiv = document.getElementById("casualReply");
    const copyFormalBtn = document.getElementById("copyFormal");
    const copyCasualBtn = document.getElementById("copyCasual");
    const themeToggle = document.getElementById("themeToggle");
    
    // Theme Handling - Stores the Theme selected locally
    initTheme();
    
    themeToggle.addEventListener("change", function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.checked = false;
        }
    }

    formalReplyDiv.innerHTML = "⏳ Generating...";
    casualReplyDiv.innerHTML = "⏳ Generating...";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getEmailContent,
        }, async (result) => {
            if (!result || !result[0] || !result[0].result) {
                formalReplyDiv.textContent = "Error: Unable to read email.";
                casualReplyDiv.textContent = "Error: Unable to read email.";
                return;
            }

            const emailText = result[0].result;
            console.log("📧 Extracted Email Text:", emailText);

            // Fetches the AI-generated replies from background.js
            chrome.runtime.sendMessage({ action: "getAIResponse", emailText }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("❌ Error sending message to background.js:", chrome.runtime.lastError.message);
                    formalReplyDiv.textContent = "Error connecting to AI.";
                    casualReplyDiv.textContent = "Error connecting to AI.";
                    return;
                }

                if (!response) {
                    formalReplyDiv.textContent = "API error: No response.";
                    casualReplyDiv.textContent = "API error: No response.";
                    return;
                }

                formalReplyDiv.textContent = response.formal;
                casualReplyDiv.textContent = response.casual;
            });
        });
    } catch (error) {
        console.error("❌ Error in popup.js:", error);
    }

    function handleCopy(button, text) {
        navigator.clipboard.writeText(text);
        button.focus();
        setTimeout(() => {
            button.blur();
        }, 1000);
    }

    copyFormalBtn.addEventListener("click", () => {
        handleCopy(copyFormalBtn, formalReplyDiv.textContent);
    });

    copyCasualBtn.addEventListener("click", () => {
        handleCopy(copyCasualBtn, casualReplyDiv.textContent);
    });
});

function getEmailContent() {
    const emailElement = document.querySelector("div[role='main']");
    return emailElement ? emailElement.innerText : "";
}