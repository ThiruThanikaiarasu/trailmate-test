import { createTestContext, createTrip, sampleTrip, type TestContext } from './helpers/testApp';

describe('trips API', () => {
  let ctx: TestContext;

  beforeEach(() => {
    ctx = createTestContext();
  });

  afterEach(() => ctx.db.close());

  it('reports health', async () => {
    const res = await ctx.api.get('/api/health').expect(200);
    expect(res.body).toEqual({ status: 'ok', time: '2026-06-01T09:00:00.000Z' });
  });

  it('creates a trip with camelCase fields', async () => {
    const res = await ctx.api.post('/api/trips').send(sampleTrip).expect(201);
    expect(res.body).toEqual({
      id: 1,
      name: 'Karwendel Hut-to-Hut',
      region: 'Tirol',
      startDate: '2026-07-03',
      endDate: '2026-07-06',
      notes: null,
      createdAt: '2026-06-01T09:00:00.000Z',
    });
  });

  it('adds the owner as the first participant', async () => {
    const id = await createTrip(ctx);
    const res = await ctx.api.get(`/api/trips/${id}/participants`).expect(200);
    expect(res.body).toEqual([{ id: 1, tripId: id, name: 'Maya', email: null, isOwner: true }]);
  });

  it('lists trips ordered by start date', async () => {
    await createTrip(ctx, { name: 'Later', startDate: '2026-09-01', endDate: '2026-09-02' });
    await createTrip(ctx, { name: 'Sooner', startDate: '2026-05-01', endDate: '2026-05-02' });
    const res = await ctx.api.get('/api/trips').expect(200);
    expect(res.body.map((t: { name: string }) => t.name)).toEqual(['Sooner', 'Later']);
  });

  it('returns trip details with counts', async () => {
    const id = await createTrip(ctx);
    await ctx.api.post(`/api/trips/${id}/gear`).send({ name: 'Tent', category: 'shelter' }).expect(201);
    const res = await ctx.api.get(`/api/trips/${id}`).expect(200);
    expect(res.body).toMatchObject({
      id,
      name: 'Karwendel Hut-to-Hut',
      dayCount: 0,
      participantCount: 1,
      gearCount: 1,
      packedCount: 0,
      totalDistanceMeters: 0,
    });
  });

  it('rejects an end date before the start date', async () => {
    const res = await ctx.api
      .post('/api/trips')
      .send({ ...sampleTrip, endDate: '2026-07-01' })
      .expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toEqual([{ path: 'endDate', message: 'endDate must not be before startDate' }]);
  });

  it('rejects a patch that would invert the dates', async () => {
    const id = await createTrip(ctx);
    const res = await ctx.api.patch(`/api/trips/${id}`).send({ startDate: '2026-08-01' }).expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('updates a trip', async () => {
    const id = await createTrip(ctx);
    const res = await ctx.api.patch(`/api/trips/${id}`).send({ name: 'Karwendel Traverse' }).expect(200);
    expect(res.body.name).toBe('Karwendel Traverse');
  });

  it('deletes a trip and everything in it', async () => {
    const id = await createTrip(ctx);
    await ctx.api.delete(`/api/trips/${id}`).expect(204);
    await ctx.api.get(`/api/trips/${id}`).expect(404);
    await ctx.api.get(`/api/trips/${id}/participants`).expect(404);
  });

  it('uses the error envelope for unknown ids and routes', async () => {
    const missing = await ctx.api.get('/api/trips/999').expect(404);
    expect(missing.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Trip not found' } });
    const invalid = await ctx.api.get('/api/trips/abc').expect(400);
    expect(invalid.body.error.code).toBe('INVALID_ID');
    const route = await ctx.api.get('/api/nope').expect(404);
    expect(route.body.error.code).toBe('ROUTE_NOT_FOUND');
  });

  it('rejects malformed JSON', async () => {
    const res = await ctx.api.post('/api/trips').set('Content-Type', 'application/json').send('{"name":').expect(400);
    expect(res.body.error.code).toBe('INVALID_JSON');
  });
});
