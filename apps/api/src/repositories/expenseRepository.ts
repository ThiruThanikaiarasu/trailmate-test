import type { Db } from '../db/database';

export interface ExpenseRow {
  id: number;
  trip_id: number;
  description: string;
  amount_cents: number;
  paid_by: number;
  created_at: string;
}

export class ExpenseRepository {
  constructor(private readonly db: Db) {}

  listByTrip(tripId: number): ExpenseRow[] {
    return this.db.prepare('SELECT * FROM expenses WHERE trip_id = ? ORDER BY created_at, id').all(tripId) as ExpenseRow[];
  }

  countPaidBy(participantId: number): number {
    const row = this.db.prepare('SELECT COUNT(*) AS n FROM expenses WHERE paid_by = ?').get(participantId) as {
      n: number;
    };
    return row.n;
  }

  insert(row: Omit<ExpenseRow, 'id'>): ExpenseRow {
    const result = this.db
      .prepare(
        `INSERT INTO expenses (trip_id, description, amount_cents, paid_by, created_at)
         VALUES (@trip_id, @description, @amount_cents, @paid_by, @created_at)`,
      )
      .run(row);
    return this.db.prepare('SELECT * FROM expenses WHERE id = ?').get(Number(result.lastInsertRowid)) as ExpenseRow;
  }

  delete(id: number, tripId: number): boolean {
    return this.db.prepare('DELETE FROM expenses WHERE id = ? AND trip_id = ?').run(id, tripId).changes > 0;
  }
}
