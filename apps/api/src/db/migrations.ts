import type Database from 'better-sqlite3';

/** Ordered schema migrations. The index + 1 is stored in SQLite's user_version. Never edit a released entry. */
const MIGRATIONS: readonly string[] = [
  `CREATE TABLE trips (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     region TEXT NOT NULL DEFAULT '',
     start_date TEXT NOT NULL,
     end_date TEXT NOT NULL,
     notes TEXT,
     created_at TEXT NOT NULL
   );
   CREATE TABLE participants (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     email TEXT,
     is_owner INTEGER NOT NULL DEFAULT 0
   );
   CREATE INDEX participants_trip ON participants(trip_id);`,

  `CREATE TABLE days (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
     day_number INTEGER NOT NULL,
     title TEXT NOT NULL,
     notes TEXT,
     UNIQUE (trip_id, day_number)
   );
   CREATE TABLE waypoints (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     day_id INTEGER NOT NULL REFERENCES days(id) ON DELETE CASCADE,
     seq INTEGER NOT NULL,
     name TEXT NOT NULL,
     lat REAL NOT NULL,
     lon REAL NOT NULL,
     elevation_m REAL
   );
   CREATE INDEX waypoints_day ON waypoints(day_id, seq);`,

  `CREATE TABLE gear_items (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     category TEXT NOT NULL,
     weight_grams INTEGER,
     quantity INTEGER NOT NULL DEFAULT 1,
     packed INTEGER NOT NULL DEFAULT 0
   );
   CREATE INDEX gear_items_trip ON gear_items(trip_id);`,

  `CREATE TABLE expenses (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
     description TEXT NOT NULL,
     amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
     paid_by INTEGER NOT NULL REFERENCES participants(id),
     created_at TEXT NOT NULL
   );
   CREATE INDEX expenses_trip ON expenses(trip_id);`,
];

export function migrate(db: Database.Database): void {
  const current = db.pragma('user_version', { simple: true }) as number;
  for (let version = current; version < MIGRATIONS.length; version += 1) {
    db.transaction(() => {
      db.exec(MIGRATIONS[version]);
      db.pragma(`user_version = ${version + 1}`);
    })();
  }
}
