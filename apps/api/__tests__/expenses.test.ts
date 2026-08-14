import { createTestContext, createTrip, type TestContext } from './helpers/testApp';

describe('expenses API', () => {
  let ctx: TestContext;
  let tripId: number;
  let benId: number;

  beforeEach(async () => {
    ctx = createTestContext();
    tripId = await createTrip(ctx);
    const ben = await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'Ben' }).expect(201);
    benId = ben.body.id;
  });

  afterEach(() => ctx.db.close());

  it('records an expense', async () => {
    const res = await ctx.api
      .post(`/api/trips/${tripId}/expenses`)
      .send({ description: 'Hut dinner', amountCents: 4800, paidBy: benId })
      .expect(201);
    expect(res.body).toEqual({
      id: 1,
      tripId,
      description: 'Hut dinner',
      amountCents: 4800,
      paidBy: benId,
      createdAt: '2026-06-01T09:00:00.000Z',
    });
  });

  it('rejects a payer from another trip', async () => {
    const otherTrip = await createTrip(ctx, { name: 'Other' });
    const res = await ctx.api
      .post(`/api/trips/${otherTrip}/expenses`)
      .send({ description: 'Taxi', amountCents: 2000, paidBy: benId })
      .expect(400);
    expect(res.body.error.message).toBe('paidBy must be a participant of this trip');
  });

  it('splits costs and reports who owes what', async () => {
    await ctx.api.post(`/api/trips/${tripId}/expenses`).send({ description: 'Train', amountCents: 6000, paidBy: benId });
    const res = await ctx.api.get(`/api/trips/${tripId}/cost-split`).expect(200);
    expect(res.body).toEqual({
      totalCents: 6000,
      currency: 'EUR',
      shares: [
        { participantId: benId, name: 'Ben', owedCents: 3000, paidCents: 6000, balanceCents: 3000 },
        { participantId: 1, name: 'Maya', owedCents: 3000, paidCents: 0, balanceCents: -3000 },
      ],
    });
  });

  it('removes an expense', async () => {
    const expense = await ctx.api
      .post(`/api/trips/${tripId}/expenses`)
      .send({ description: 'Snacks', amountCents: 900, paidBy: benId });
    await ctx.api.delete(`/api/trips/${tripId}/expenses/${expense.body.id}`).expect(204);
    const res = await ctx.api.get(`/api/trips/${tripId}/expenses`).expect(200);
    expect(res.body).toEqual([]);
  });
});
