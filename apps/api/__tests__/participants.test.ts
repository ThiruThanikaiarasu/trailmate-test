import { createTestContext, createTrip, type TestContext } from './helpers/testApp';

describe('participants API', () => {
  let ctx: TestContext;
  let tripId: number;

  beforeEach(async () => {
    ctx = createTestContext();
    tripId = await createTrip(ctx);
  });

  afterEach(() => ctx.db.close());

  it('lists participants alphabetically', async () => {
    await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'zoe' }).expect(201);
    await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'Ben', email: 'ben@example.com' }).expect(201);
    const res = await ctx.api.get(`/api/trips/${tripId}/participants`).expect(200);
    expect(res.body.map((p: { name: string }) => p.name)).toEqual(['Ben', 'Maya', 'zoe']);
  });

  it('refuses a duplicate name', async () => {
    const res = await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'maya' }).expect(409);
    expect(res.body.error.code).toBe('PARTICIPANT_EXISTS');
  });

  it('never removes the owner', async () => {
    const res = await ctx.api.delete('/api/participants/1').expect(409);
    expect(res.body.error.code).toBe('OWNER_CANNOT_LEAVE');
  });

  it('keeps participants who paid for something', async () => {
    const ben = await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'Ben' });
    await ctx.api
      .post(`/api/trips/${tripId}/expenses`)
      .send({ description: 'Fuel', amountCents: 1200, paidBy: ben.body.id })
      .expect(201);
    const res = await ctx.api.delete(`/api/participants/${ben.body.id}`).expect(409);
    expect(res.body.error.code).toBe('PARTICIPANT_HAS_EXPENSES');
  });

  it('removes a participant', async () => {
    const ben = await ctx.api.post(`/api/trips/${tripId}/participants`).send({ name: 'Ben' });
    await ctx.api.delete(`/api/participants/${ben.body.id}`).expect(204);
  });
});
