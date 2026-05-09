require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const aiService = require('./ai-service');
const database = require('./database');
const Scheduler = require('./scheduler');

// Your WhatsApp number (for filtering)
const MY_NUMBER = '254707029633';

// Initialize WhatsApp client with session persistence
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let scheduler = null;

// Generate QR code for WhatsApp Web
client.on('qr', (qr) => {
    console.log('📱 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp AI Agent is ready!');
    console.log(`📞 Connected for number: +${MY_NUMBER}`);
    console.log('🤖 Bot is now listening for messages...');
    
    // Start reminder scheduler
    scheduler = new Scheduler(client);
});

client.on('message', async (message) => {
    try {
        const sender = message.from;
        const messageText = message.body;
        
        console.log(`📩 Message from ${sender}: ${messageText}`);
        
        // Check for reminder commands
        const reminderMatch = messageText.match(/remind me to (.+?) (?:at|on|for) (.+)/i);
        
        if (reminderMatch) {
            const task = reminderMatch[1];
            const timeText = reminderMatch[2];
            
            let reminderDateTime = null;
            
            if (timeText.match(/\d{1,2}:\d{2}/)) {
                const today = new Date();
                const [hours, minutes] = timeText.match(/\d{1,2}:\d{2}/)[0].split(':');
                today.setHours(parseInt(hours), parseInt(minutes), 0);
                reminderDateTime = today.toISOString();
            }
            
            if (reminderDateTime) {
                await database.addReminder(task, reminderDateTime);
                await message.reply(`✅ Reminder set: "${task}" at ${timeText}`);
            } else {
                await message.reply(`📝 I'll try to remember: "${task}". For precise reminders, use format: "remind me to [task] at [HH:MM]"`);
            }
            return;
        }
        
        // AI-powered response for other messages
        const analysis = await aiService.analyzeMessage(messageText);
        
        if (analysis && analysis.reply) {
            database.saveMessage(sender, messageText, analysis.intent || 'general');
            await message.reply(analysis.reply);
            
            if (analysis.has_deadline && analysis.extracted_date) {
                await message.reply(`⏰ I noticed a deadline! Would you like me to set a reminder for ${analysis.extracted_date}? Just reply with "yes" or "remind me"`);
            }
        } else {
            await message.reply(`🤖 I received: "${messageText}". I'm learning to be more helpful! Try saying "remind me to [task] at [time]"`);
        }
        
    } catch (error) {
        console.error('Error processing message:', error);
        await message.reply('⚠️ Sorry, I encountered an error processing your request.');
    }
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ Client was logged out:', reason);
    process.exit(1);
});

console.log('🚀 Starting WhatsApp AI Agent...');
client.initialize();

process.on('SIGINT', async () => {
    console.log('\n📴 Shutting down...');
    database.close();
    await client.destroy();
    process.exit(0);
});