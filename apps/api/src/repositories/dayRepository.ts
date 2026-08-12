import type { Db } from '../db/database';

export interface DayRow {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  notes: string | null;
}

export interface WaypointRow {
  id: number;
  day_id: number;
  seq: number;
  name: string;
  lat: number;
  lon: number;
  elevation_m: number | null;
}

export class DayRepository {
  constructor(private readonly db: Db) {}

  listByTrip(tripId: number): DayRow[] {
    return this.db.prepare('SELECT * FROM days WHERE trip_id = ? ORDER BY day_number').all(tripId) as DayRow[];
  }

  findById(id: number): DayRow | undefined {
    return this.db.prepare('SELECT * FROM days WHERE id = ?').get(id) as DayRow | undefined;
  }

  insert(tripId: number, title: string, notes: string | null): DayRow {
    const next = this.db
      .prepare('SELECT COALESCE(MAX(day_number), 0) + 1 AS n FROM days WHERE trip_id = ?')
      .get(tripId) as { n: number };
    const result = this.db
      .prepare('INSERT INTO days (trip_id, day_number, title, notes) VALUES (?, ?, ?, ?)')
      .run(tripId, next.n, title, notes);
    return this.findById(Number(result.lastInsertRowid)) as DayRow;
  }

  update(id: number, patch: Partial<Pick<DayRow, 'title' | 'notes'>>): DayRow | undefined {
    const current = this.findById(id);
    if (!current) return undefined;
    this.db
      .prepare('UPDATE days SET title = ?, notes = ? WHERE id = ?')
      .run(patch.title ?? current.title, patch.notes === undefined ? current.notes : patch.notes, id);
    return this.findById(id);
  }

  /** Deletes a day and closes the gap so day numbers stay 1..n. */
  delete(id: number): boolean {
    const day = this.findById(id);
    if (!day) return false;
    this.db.transaction(() => {
      this.db.prepare('DELETE FROM days WHERE id = ?').run(id);
      // Shift via a negative range first so the UNIQUE(trip_id, day_number) constraint never collides.
      this.db
        .prepare('UPDATE days SET day_number = -(day_number - 1) WHERE trip_id = ? AND day_number > ?')
        .run(day.trip_id, day.day_number);
      this.db.prepare('UPDATE days SET day_number = -day_number WHERE trip_id = ? AND day_number < 0').run(day.trip_id);
    })();
    return true;
  }

  listWaypoints(dayIds: readonly number[]): WaypointRow[] {
    if (dayIds.length === 0) return [];
    const placeholders = dayIds.map(() => '?').join(', ');
    return this.db
      .prepare(`SELECT * FROM waypoints WHERE day_id IN (${placeholders}) ORDER BY day_id, seq`)
      .all(...dayIds) as WaypointRow[];
  }

  insertWaypoint(dayId: number, waypoint: Omit<WaypointRow, 'id' | 'day_id' | 'seq'>): WaypointRow {
    const next = this.db
      .prepare('SELECT COALESCE(MAX(seq), 0) + 1 AS n FROM waypoints WHERE day_id = ?')
      .get(dayId) as { n: number };
    const result = this.db
      .prepare('INSERT INTO waypoints (day_id, seq, name, lat, lon, elevation_m) VALUES (?, ?, ?, ?, ?, ?)')
      .run(dayId, next.n, waypoint.name, waypoint.lat, waypoint.lon, waypoint.elevation_m);
    return this.db.prepare('SELECT * FROM waypoints WHERE id = ?').get(Number(result.lastInsertRowid)) as WaypointRow;
  }

  deleteWaypoint(dayId: number, waypointId: number): boolean {
    return this.db.prepare('DELETE FROM waypoints WHERE id = ? AND day_id = ?').run(waypointId, dayId).changes > 0;
  }
}
