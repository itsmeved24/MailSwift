document.addEventListener("click", async () => {
    setTimeout(() => {
        const emailElement = document.querySelector("div[role='main']");
        if (emailElement) {
            const emailText = emailElement.innerText;
            chrome.runtime.sendMessage({ action: "generateReply", emailText });
        }
    }, 2000);  // Delay is added here so that both the prompts (Formal and Casual) are loaded together
});
