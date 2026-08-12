import type { Db } from '../db/database';

export interface ParticipantRow {
  id: number;
  trip_id: number;
  name: string;
  email: string | null;
  is_owner: number;
}

export class ParticipantRepository {
  constructor(private readonly db: Db) {}

  listByTrip(tripId: number): ParticipantRow[] {
    return this.db
      .prepare('SELECT * FROM participants WHERE trip_id = ? ORDER BY name COLLATE NOCASE, id')
      .all(tripId) as ParticipantRow[];
  }

  findById(id: number): ParticipantRow | undefined {
    return this.db.prepare('SELECT * FROM participants WHERE id = ?').get(id) as ParticipantRow | undefined;
  }

  countByTrip(tripId: number): number {
    const row = this.db.prepare('SELECT COUNT(*) AS n FROM participants WHERE trip_id = ?').get(tripId) as {
      n: number;
    };
    return row.n;
  }

  insert(tripId: number, name: string, email: string | null, isOwner: boolean): ParticipantRow {
    const result = this.db
      .prepare('INSERT INTO participants (trip_id, name, email, is_owner) VALUES (?, ?, ?, ?)')
      .run(tripId, name, email, isOwner ? 1 : 0);
    return this.findById(Number(result.lastInsertRowid)) as ParticipantRow;
  }

  delete(id: number): boolean {
    return this.db.prepare('DELETE FROM participants WHERE id = ?').run(id).changes > 0;
  }
}
