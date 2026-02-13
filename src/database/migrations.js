const fs = require('fs');
const path = require('path');

module.exports = function runMigrations(db) {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const migrationsDir = path.join(__dirname, 'migrations');

        const files = fs
            .readdirSync(migrationsDir)
            .filter((f) => f.endsWith('.js'))
            .sort();

        function runNext(index) {
            if (index >= files.length) {
                console.log('✅ Toutes les migrations sont OK');
                return;
            }

            const file = files[index];

            db.get(`SELECT 1 FROM migrations WHERE name = ?`, [file], (err, row) => {
                if (err) throw err;

                if (row) {
                    console.log(`⏭️ ${file} déjà exécutée`);
                    return runNext(index + 1);
                }

                console.log(`🚀 Exécution migration ${file}`);
                const migration = require(path.join(migrationsDir, file));

                // ⚠️ exécution sync garantie
                migration(db);

                db.run(`INSERT INTO migrations (name) VALUES (?)`, [file], (err) => {
                    if (err) throw err;
                    runNext(index + 1);
                });
            });
        }

        runNext(0);
    });
};
