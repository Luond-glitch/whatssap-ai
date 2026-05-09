# 🤖 WhatsApp AI Agent

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Integration-25D366.svg)](https://web.whatsapp.com/)

A powerful, intelligent WhatsApp bot with AI-powered conversations, context memory, and smart reminders. Perfect for personal assistance and automated customer support.

##  Features

-  **Conversation Memory** - Remembers previous messages and maintains context
-  **Multi-Language Support** - Detects and responds in English, Swahili, or Sheng
-  **Natural Conversations** - Human-like, polite, and contextual responses
-  **Smart Reminders** - Set and receive reminders at specific times
-  **Intent Detection** - Automatically identifies user intent (question, reminder, conversation)
-  **Persistent Storage** - SQLite database for conversations and reminders
-  **24/7 Operation** - Runs continuously with PM2 process manager
-  **Session Persistence** - Stays logged in across restarts
-  **Direct Message Only** - Ignores group messages and broadcasts

##  Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **WhatsApp account** (free)
- **Groq API Key** (free tier available)
- **Windows/Linux/Mac** operating system

##  Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Luond-glitch/whatssap-ai.git
cd whatssap-ai
2. Install Dependencies
bash
npm install
3. Get a Groq API Key (Free)
Go to console.groq.com

Sign up with your Google account

Navigate to API Keys

Click Create API Key

Name your key (e.g., "WhatsApp Bot")

Copy the key immediately

4. Configure Environment Variables
Create a .env file in the project root:

bash
echo GROQ_API_KEY=your_groq_api_key_here > .env
Replace your_groq_api_key_here with the key you copied.

5. Start the Bot
bash
npm start
6. Connect WhatsApp
A QR code will appear in your terminal

Open WhatsApp on your phone

Go to Settings → Linked Devices → Link a Device

Scan the QR code with your phone

The bot will confirm:  WhatsApp AI Agent is ready!

Using the Bot
Basic Commands
Command	Description
help	Show available commands
clear history	Reset conversation memory
remind me to [task] at [HH:MM]	Set a reminder
Examples
text
Hello!                          → Bot responds naturally in your language
Habari yako                     → Nzuri, asante! Na wewe je?
May I use your cup?             → Of course, go ahead!
remind me to call mom at 15:30  →  Reminder set: "call mom" at 15:30
What did I just ask?            → References previous conversation
 Advanced Setup
Run with PM2 (24/7 Operation)
bash
# Install PM2 globally
npm install -g pm2

# Start the bot with PM2
pm2 start index.js --name whatsapp-bot

# Save PM2 configuration
pm2 save

# View logs
pm2 logs whatsapp-bot

# Restart bot
pm2 restart whatsapp-bot

# Stop bot
pm2 stop whatsapp-bot
Run on Windows Startup
Create a scheduled task:

powershell
schtasks /create /tn "WhatsApp Bot" /tr "C:\Users\Administrator\AppData\Roaming\npm\pm2.cmd start whatsapp-bot" /sc onstart /delay 0001:00 /ru "SYSTEM" /f
Run on Linux/Mac Startup
Add to crontab:

bash
@reboot /usr/bin/pm2 resurrect
 Project Structure
text
whatssap-ai/
├── index.js                 # Main WhatsApp bot
├── ai-service.js            # Groq AI integration
├── conversation-memory.js   # Conversation context storage
├── database.js              # Reminder database
├── scheduler.js             # Cron job scheduler
├── package.json             # Dependencies
├── .env                     # API keys (not in git)
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── reminders.db             # SQLite reminders (auto-created)
├── conversations.db         # SQLite conversations (auto-created)
└── whatsapp-session/        # Session storage (auto-created)
 Troubleshooting
QR Code Not Appearing
bash
# Delete session and restart
rm -rf whatsapp-session
npm start
Bot Not Responding
bash
# Check if bot is running
pm2 status

# View error logs
pm2 logs whatsapp-bot --lines 50

# Restart bot
pm2 restart whatsapp-bot
API Key Errors
bash
# Verify .env file exists
ls -la .env

# Check content
cat .env

# Should show: GROQ_API_KEY=your_key_here
Model Errors
If you see model_decommissioned, update the model in ai-service.js:

javascript
this.model = "llama-3.3-70b-versatile";  // Most current
// Alternatives: "llama-3.1-70b-versatile", "mixtral-8x7b-32768"
Port Conflicts
WhatsApp Web uses random ports. If you see errors:

bash
# Kill any hanging Chrome processes
taskkill /f /im chrome.exe
 Configuration Options
Change Response Model
Edit ai-service.js:

javascript
this.model = "llama-3.3-70b-versatile";  // Most capable
// this.model = "mixtral-8x7b-32768";   // Faster
// this.model = "llama-3.1-8b-instant"; // Quick responses
Change Language Sensitivity
Edit conversation-memory.js language detection:

javascript
const languageIndicators = {
    swahili: /(habari|sasa|poa|mambo|nzuri)/i,
    sheng: /(vipi|fit|ganji|mash|kubest)/i,
    english: /(hello|hi|hey|good|thank)/i
};
Adjust Reminder Check Frequency
Edit scheduler.js cron expression:

javascript
// Every minute (default)
cron.schedule('* * * * *', async () => {
    // Check reminders
});

// Every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    // Check reminders
});
 Security Best Practices
Never commit .env - Already in .gitignore

Rotate API keys regularly - Generate new keys every 90 days

Use environment variables - Avoid hardcoding secrets

Keep Node.js updated - Regular security patches

Monitor logs - Check for unusual activity

 API Rate Limits
Provider	Free Tier	Limit
Groq	7,500 requests/day	30 requests/minute
Llama 3.3	Unlimited	Based on Groq limits
 Known Issues & Solutions
Issue	Solution
Model decommissioned	Update model version in ai-service.js
Session expired	Delete whatsapp-session folder and relink
Duplicate responses	Check for multiple bot instances running
Slow responses	Switch to a smaller model (e.g., llama-3.1-8b-instant)
 Performance Optimization
Use PM2 cluster mode for multiple sessions:

bash
pm2 start index.js -i max --name whatsapp-bot
Limit conversation history in index.js:

javascript
const history = await conversationMemory.getConversationHistory(sender, 3); // Reduced from 5
Use faster AI models for high volume:

javascript
this.model = "llama-3.1-8b-instant";
 Contributing
Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m 'Add feature'

Push: git push origin feature-name

Open a Pull Request

 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Groq - For fast, free AI inference

whatsapp-web.js - WhatsApp Web API

Puppeteer - Headless Chrome automation

📞 Support
WhatsApp: +254707029633

🎯 Roadmap
Voice message transcription

Image recognition support

Calendar integration

Multiple language models

Web dashboard for logs

Export conversations as JSON

Custom command creation

Made with ❤️ by Sylvester | Report Bug | Request Feature

text

