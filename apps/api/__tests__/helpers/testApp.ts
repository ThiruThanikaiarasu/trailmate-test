import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app';
import type { Clock } from '../../src/clock';
import { openDatabase, type Db } from '../../src/db/database';

export class ManualClock implements Clock {
  private current: number;

  constructor(start: string) {
    this.current = new Date(start).getTime();
  }

  now(): Date {
    return new Date(this.current);
  }

  advanceHours(hours: number): void {
    this.current += hours * 3_600_000;
  }
}

export interface TestContext {
  app: Express;
  db: Db;
  clock: ManualClock;
  api: ReturnType<typeof request>;
}

export function createTestContext(start = '2026-06-01T09:00:00.000Z'): TestContext {
  const db = openDatabase(':memory:');
  const clock = new ManualClock(start);
  let tokens = 0;
  const app = createApp({
    db,
    clock,
    newToken: () => `token-${++tokens}`,
    publicBaseUrl: 'https://trailmate.test',
    log: () => undefined,
  });
  return { app, db, clock, api: request(app) };
}

export const sampleTrip = {
  name: 'Karwendel Hut-to-Hut',
  region: 'Tirol',
  startDate: '2026-07-03',
  endDate: '2026-07-06',
  ownerName: 'Maya',
};

export async function createTrip(ctx: TestContext, overrides: Partial<typeof sampleTrip> = {}): Promise<number> {
  const res = await ctx.api.post('/api/trips').send({ ...sampleTrip, ...overrides }).expect(201);
  return res.body.id as number;
}
