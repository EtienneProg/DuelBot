const sqlite3 = require("sqlite3").verbose();
const DB_PATH = process.env.DB_PATH || "/data/scores.db";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Erreur SQLite", err);
  } else {
    console.log("📦 Base SQLite connectée");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  username TEXT,
  avatar TEXT,
  score INTEGER DEFAULT 1000,
  last_match TEXT,
  last_match_win INTEGER DEFAULT 0,   -- 1 = gagné, 0 = perdu
  nb_win INTEGER DEFAULT 0,
  nb_lose INTEGER DEFAULT 0
)`);

db.run(`
CREATE TABLE IF NOT EXISTS duels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    team1_ids TEXT NOT NULL,   -- JSON array: ["id1","id2"]
team2_ids TEXT NOT NULL,   -- JSON array: ["id3","id4"]

winner_team INTEGER,       -- 1 ou 2, NULL si pas terminé
is_finished INTEGER DEFAULT 0
)`);

db.run(`
    CREATE TABLE IF NOT EXISTS inscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    idMessage TEXT NOT NULL,        -- STRING (snowflake)
    users_ids TEXT NOT NULL,        -- JSON array
    status TEXT NOT NULL DEFAULT 'EN_COURS',           -- EN_COURS | TERMINE | ANNULE
    is_active INTEGER DEFAULT 0 
    );
`);

module.exports = db;
