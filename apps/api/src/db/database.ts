import Database from 'better-sqlite3';
import { migrate } from './migrations';

export type Db = Database.Database;

/** Opens (or creates) the SQLite database and brings its schema up to date. Pass ':memory:' for tests. */
export function openDatabase(file: string): Db {
  const db = new Database(file);
  if (file !== ':memory:') db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
}
