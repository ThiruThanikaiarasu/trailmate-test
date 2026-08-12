import type { Db } from '../db/database';

export interface GearItemRow {
  id: number;
  trip_id: number;
  name: string;
  category: string;
  weight_grams: number | null;
  quantity: number;
  packed: number;
}

export interface GearCounts {
  total: number;
  packed: number;
}

export class GearRepository {
  constructor(private readonly db: Db) {}

  listByTrip(tripId: number): GearItemRow[] {
    return this.db
      .prepare('SELECT * FROM gear_items WHERE trip_id = ? ORDER BY category, name COLLATE NOCASE, id')
      .all(tripId) as GearItemRow[];
  }

  findById(id: number): GearItemRow | undefined {
    return this.db.prepare('SELECT * FROM gear_items WHERE id = ?').get(id) as GearItemRow | undefined;
  }

  counts(tripId: number): GearCounts {
    return this.db
      .prepare('SELECT COUNT(*) AS total, COALESCE(SUM(packed), 0) AS packed FROM gear_items WHERE trip_id = ?')
      .get(tripId) as GearCounts;
  }

  insert(row: Omit<GearItemRow, 'id' | 'packed'>): GearItemRow {
    const result = this.db
      .prepare(
        `INSERT INTO gear_items (trip_id, name, category, weight_grams, quantity)
         VALUES (@trip_id, @name, @category, @weight_grams, @quantity)`,
      )
      .run(row);
    return this.findById(Number(result.lastInsertRowid)) as GearItemRow;
  }

  update(id: number, patch: Partial<Pick<GearItemRow, 'name' | 'quantity' | 'packed'>>): GearItemRow | undefined {
    const current = this.findById(id);
    if (!current) return undefined;
    const next = { ...current, ...patch };
    this.db
      .prepare('UPDATE gear_items SET name = ?, quantity = ?, packed = ? WHERE id = ?')
      .run(next.name, next.quantity, next.packed, id);
    return this.findById(id);
  }

  delete(id: number): boolean {
    return this.db.prepare('DELETE FROM gear_items WHERE id = ?').run(id).changes > 0;
  }
}
