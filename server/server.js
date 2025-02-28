import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/generate", async (req, res) => {
    try {
        const { emailText } = req.body;
        console.log("📩 Received request:", emailText);


        // Sends the request to Gemini with specific prompt

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ 
                        text: `You are an AI email assistant. Generate ONLY the reply to this email, formatted for two separate response boxes:  
                        - Do NOT include the original email, subject, or sender's name.  
                        - Do NOT add "Here is the reply" or any unnecessary introduction.  
                        - **Format the responses clearly so they can be directly inserted into the UI boxes.**  
                        - Use these exact markers:  
                          FORMAL_REPLY_START  
                          (Write the formal reply here)  
                          FORMAL_REPLY_END  
                          CASUAL_REPLY_START  
                          (Write the casual reply here)  
                          CASUAL_REPLY_END  
                        Email content: """${emailText}"""`  
                    }] }]
                }),
            }
        );

        const data = await response.json();
        console.log("✅ API Response Data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(`API Error: ${data.error?.message || response.statusText}`);
        }

        // Extracts only the generated response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response available";

        // Extract formal and casual replies based on new markers
        const formalReplyMatch = textResponse.match(/FORMAL_REPLY_START(.*?)FORMAL_REPLY_END/s);
        const casualReplyMatch = textResponse.match(/CASUAL_REPLY_START(.*?)CASUAL_REPLY_END/s);

        res.json({
            formal: formalReplyMatch ? formalReplyMatch[1].trim() : "No formal reply",
            casual: casualReplyMatch ? casualReplyMatch[1].trim() : "No casual reply",
        });
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: error.message || "Failed to generate response" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
