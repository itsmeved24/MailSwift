chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAIResponse") {
        console.log("📩 Received email text for AI response:", message.emailText);

        fetch("http://localhost:5000/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailText: message.emailText })
        })
            .then(response => {
                if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                console.log("✅ AI Response:", data);
                sendResponse(data);
            })
            .catch(error => {
                console.error("❌ API Error:", error);
                sendResponse({ formal: "Error generating response", casual: "Error generating response" });
            });

        return true; //Keeps the message port open for async response hence the response from the AI can be sent back as a response
    }
});
