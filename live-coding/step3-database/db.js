// db.js — SQLite database setup using better-sqlite3
// Called once at startup; creates the table if it doesn't exist

const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'notes.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL DEFAULT '',
    created_at DATETIME DEFAULT (datetime('now'))
  )
`);

module.exports = db;
