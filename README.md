## **Project Structure**  

```
automail/
│── server/
│   ├── node_modules/       # Installed dependencies (ignored in Git)
│   ├── .env                # Environment variables (ignored in Git)
│   ├── package.json        # Project dependencies and metadata
│   ├── package-lock.json   # Dependency lock file
│   ├── server.js           # Backend logic for handling requests
│   ├── background.js       # Background script for persistent tasks
│   ├── content.js          # Content script for interacting with Gmail UI
│   ├── icon.png            # Extension icon
│   ├── manifest.json       # Chrome extension manifest
│   ├── popup.html          # Popup UI for the extension
│   ├── popup.js            # Logic for the popup UI
```  

## **Installation & Setup**  

1. Clone the repository:  
   ```sh
   git clone https://github.com/yourusername/automail.git
   cd automail
   ```
2. Install dependencies:  
   ```sh
   cd server
   npm install
   ```
3. Load the extension in Chrome:  
   - Go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select the `server` directory

## **Features**  

-  **Detects opened Gmail emails**  
-  **Generates AI-based replies using Gemini**  
-  **Provides both Formal & Casual response options**  
-  **Copy button for quick use**  

## **Configuration**  

- Set your environment variables in `.env` (ignored in Git)  
- Ensure `manifest.json` is properly configured with permissions  

## **Development**  

For changes in the extension, reload it from `chrome://extensions/` after modifications.  

To start the backend server, run:  
```sh
node server.js
```

## **Contributing**  

Feel free to fork, improve, and submit pull requests. 

---

Made With ❤️ by Vedank!
