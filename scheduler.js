const cron = require('node-cron');
const database = require('./database');

class Scheduler {
    constructor(client) {
        this.client = client;
        this.start();
    }
    
    start() {
        // Check reminders every minute
        cron.schedule('* * * * *', async () => {
            const pendingReminders = await database.getPendingReminders();
            
            for (const reminder of pendingReminders) {
                if (this.client && reminder.from) {
                    await this.client.sendMessage(
                        reminder.from,
                        `⏰ REMINDER: ${reminder.task}`
                    );
                    await database.markReminderComplete(reminder.id);
                }
            }
        });
        
        console.log('✅ Scheduler started - checking reminders every minute');
    }
}

module.exports = Scheduler;