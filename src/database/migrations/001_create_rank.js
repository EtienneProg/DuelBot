module.exports = (db) => {
    db.exec(`
    BEGIN;

    CREATE TABLE IF NOT EXISTS ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      min_elo INTEGER NOT NULL,
      max_elo INTEGER
    );

    INSERT OR IGNORE INTO ranks (name, min_elo, max_elo) VALUES
      ('Bronze', 0, 1199),
      ('Argent', 1200, 1399),
      ('Or', 1400, 1699),
      ('Diamant', 1700, 1999),
      ('Platine', 2000, 2299),
      ('Elite', 2300, 2599),
      ('Champion', 2600, 2999),
      ('Legende', 3000, NULL);

    COMMIT;
  `);
};
