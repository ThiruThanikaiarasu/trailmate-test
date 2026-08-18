import type { Db } from '../db/database';

export interface ShareLinkRow {
  id: number;
  trip_id: number;
  token: string;
  expires_at: number;
  created_at: number;
}

export class ShareLinkRepository {
  constructor(private readonly db: Db) {}

  insert(row: Omit<ShareLinkRow, 'id'>): ShareLinkRow {
    this.db
      .prepare(
        'INSERT INTO share_links (trip_id, token, expires_at, created_at) VALUES (@trip_id, @token, @expires_at, @created_at)',
      )
      .run(row);
    return this.findByToken(row.token) as ShareLinkRow;
  }

  findByToken(token: string): ShareLinkRow | undefined {
    return this.db.prepare('SELECT * FROM share_links WHERE token = ?').get(token) as ShareLinkRow | undefined;
  }
}
