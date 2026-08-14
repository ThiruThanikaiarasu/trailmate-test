import { createTestContext, createTrip, type TestContext } from './helpers/testApp';

describe('gear API', () => {
  let ctx: TestContext;
  let tripId: number;

  beforeEach(async () => {
    ctx = createTestContext();
    tripId = await createTrip(ctx);
  });

  afterEach(() => ctx.db.close());

  it('adds an item with defaults', async () => {
    const res = await ctx.api.post(`/api/trips/${tripId}/gear`).send({ name: 'Tent', category: 'shelter' }).expect(201);
    expect(res.body).toEqual({
      id: 1,
      tripId,
      name: 'Tent',
      category: 'shelter',
      weightGrams: null,
      quantity: 1,
      packed: false,
    });
  });

  it('rejects an unknown category', async () => {
    const res = await ctx.api.post(`/api/trips/${tripId}/gear`).send({ name: 'Kite', category: 'toys' }).expect(400);
    expect(res.body.error.details[0].path).toBe('category');
  });

  it('marks an item as packed and counts it on the trip', async () => {
    const item = await ctx.api.post(`/api/trips/${tripId}/gear`).send({ name: 'Stove', category: 'cooking' });
    await ctx.api.patch(`/api/gear/${item.body.id}`).send({ packed: true }).expect(200);
    const trip = await ctx.api.get(`/api/trips/${tripId}`).expect(200);
    expect(trip.body).toMatchObject({ gearCount: 1, packedCount: 1 });
  });

  it('deletes an item', async () => {
    const item = await ctx.api.post(`/api/trips/${tripId}/gear`).send({ name: 'Mug', category: 'cooking' });
    await ctx.api.delete(`/api/gear/${item.body.id}`).expect(204);
    await ctx.api.delete(`/api/gear/${item.body.id}`).expect(404);
  });
});
