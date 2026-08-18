import { createTestContext, createTrip, type TestContext } from './helpers/testApp';

describe('share links API', () => {
  let ctx: TestContext;
  let tripId: number;

  beforeEach(async () => {
    ctx = createTestContext();
    tripId = await createTrip(ctx);
  });

  afterEach(() => ctx.db.close());

  it('creates a link with the default lifetime', async () => {
    const res = await ctx.api.post(`/api/trips/${tripId}/share`).send({}).expect(201);
    expect(res.body).toEqual({
      token: 'token-1',
      url: 'https://trailmate.test/shared/token-1',
      expiresAt: '2026-06-04T09:00:00.000Z',
    });
  });

  it('shows the itinerary but not the people', async () => {
    await ctx.api.post(`/api/trips/${tripId}/days`).send({ title: 'Approach' });
    const link = await ctx.api.post(`/api/trips/${tripId}/share`).send({ ttlHours: 24 });
    const res = await ctx.api.get(`/api/share/${link.body.token}`).expect(200);
    expect(Object.keys(res.body).sort()).toEqual(['days', 'endDate', 'name', 'region', 'startDate']);
    expect(res.body.days[0].title).toBe('Approach');
  });

  it('works until shortly before it expires', async () => {
    const link = await ctx.api.post(`/api/trips/${tripId}/share`).send({ ttlHours: 24 });
    ctx.clock.advanceHours(23);
    await ctx.api.get(`/api/share/${link.body.token}`).expect(200);
  });

  it('returns 404 for an unknown token', async () => {
    const res = await ctx.api.get('/api/share/nope').expect(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('limits the lifetime to 30 days', async () => {
    await ctx.api.post(`/api/trips/${tripId}/share`).send({ ttlHours: 24 * 31 }).expect(400);
  });
});
