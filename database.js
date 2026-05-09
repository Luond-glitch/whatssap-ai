const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DatabaseService {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'reminders.db'));
        this.initTables();
    }
    
    initTables() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                datetime TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL,
                message TEXT NOT NULL,
                intent TEXT,
                processed_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        this.db.run(`
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                data TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }
    
    addReminder(task, datetime) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO reminders (task, datetime) VALUES (?, ?)',
                [task, datetime],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }
    
    getPendingReminders() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM reminders 
                 WHERE status = 'pending' 
                 AND datetime <= datetime('now')`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
    
    markReminderComplete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE reminders SET status = "completed" WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
    
    saveMessage(sender, message, intent) {
        this.db.run(
            'INSERT INTO messages (sender, message, intent) VALUES (?, ?, ?)',
            [sender, message, intent]
        );
    }
    
    close() {
        this.db.close();
    }
}

module.exports = new DatabaseService();