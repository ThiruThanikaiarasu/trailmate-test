import type { Db } from '../db/database';

export interface TripRow {
  id: number;
  name: string;
  region: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  created_at: string;
}

export interface NewTripRow {
  name: string;
  region: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  created_at: string;
}

export type TripRowPatch = Partial<Pick<TripRow, 'name' | 'region' | 'start_date' | 'end_date' | 'notes'>>;

export class TripRepository {
  constructor(private readonly db: Db) {}

  list(): TripRow[] {
    return this.db.prepare('SELECT * FROM trips ORDER BY start_date, id').all() as TripRow[];
  }

  findById(id: number): TripRow | undefined {
    return this.db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as TripRow | undefined;
  }

  insert(row: NewTripRow): TripRow {
    const result = this.db
      .prepare(
        `INSERT INTO trips (name, region, start_date, end_date, notes, created_at)
         VALUES (@name, @region, @start_date, @end_date, @notes, @created_at)`,
      )
      .run(row);
    return this.findById(Number(result.lastInsertRowid)) as TripRow;
  }

  update(id: number, patch: TripRowPatch): TripRow | undefined {
    const columns = Object.keys(patch) as (keyof TripRowPatch)[];
    if (columns.length > 0) {
      const assignments = columns.map((column) => `${column} = @${column}`).join(', ');
      this.db.prepare(`UPDATE trips SET ${assignments} WHERE id = @id`).run({ ...patch, id });
    }
    return this.findById(id);
  }

  delete(id: number): boolean {
    return this.db.prepare('DELETE FROM trips WHERE id = ?').run(id).changes > 0;
  }
}
