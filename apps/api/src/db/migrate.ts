import fs from 'fs';
import path from 'path';
import { db } from '../config/database';
import { logger } from '../utils/logger';

function migrate() {
  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const applied = db.prepare('SELECT name FROM migrations ORDER BY id').all() as { name: string }[];
  const appliedNames = new Set(applied.map(r => r.name));

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    if (appliedNames.has(file)) {
      logger.info(`Skipping ${file} (already applied)`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

    const runMigration = db.transaction(() => {
      db.exec(sql);
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
    });

    try {
      runMigration();
      logger.info(`Applied migration: ${file}`);
    } catch (err) {
      logger.error({ err }, `Failed to apply migration: ${file}`);
      throw err;
    }
  }

  logger.info('All migrations applied');
}

try {
  migrate();
} catch (err) {
  logger.error({ err }, 'Migration failed');
  process.exit(1);
}
