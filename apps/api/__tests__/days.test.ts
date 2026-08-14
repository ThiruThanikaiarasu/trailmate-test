import { createTestContext, createTrip, type TestContext } from './helpers/testApp';

describe('itinerary API', () => {
  let ctx: TestContext;
  let tripId: number;

  beforeEach(async () => {
    ctx = createTestContext();
    tripId = await createTrip(ctx);
  });

  afterEach(() => ctx.db.close());

  async function addDay(title: string): Promise<number> {
    const res = await ctx.api.post(`/api/trips/${tripId}/days`).send({ title }).expect(201);
    return res.body.id as number;
  }

  it('numbers days and derives their dates from the trip start', async () => {
    await addDay('Approach');
    await addDay('Summit');
    const res = await ctx.api.get(`/api/trips/${tripId}/days`).expect(200);
    expect(res.body.map((d: { dayNumber: number; date: string }) => [d.dayNumber, d.date])).toEqual([
      [1, '2026-07-03'],
      [2, '2026-07-04'],
    ]);
  });

  it('computes distance and elevation from waypoints', async () => {
    const dayId = await addDay('Scharnitz to Karwendelhaus');
    await ctx.api
      .post(`/api/days/${dayId}/waypoints`)
      .send({ name: 'Scharnitz', lat: 47.3886, lon: 11.2645, elevationM: 964 })
      .expect(201);
    const res = await ctx.api
      .post(`/api/days/${dayId}/waypoints`)
      .send({ name: 'Karwendelhaus', lat: 47.4237, lon: 11.4062, elevationM: 1771 })
      .expect(201);
    expect(res.body.waypoints).toHaveLength(2);
    expect(res.body.distanceMeters).toBeGreaterThan(11_000);
    expect(res.body.distanceMeters).toBeLessThan(12_000);
    expect(res.body.gainM).toBe(807);
    expect(res.body.lossM).toBe(0);
  });

  it('adds the day distances up on the trip', async () => {
    const dayId = await addDay('Ridge');
    await ctx.api.post(`/api/days/${dayId}/waypoints`).send({ name: 'A', lat: 0, lon: 10 }).expect(201);
    await ctx.api.post(`/api/days/${dayId}/waypoints`).send({ name: 'B', lat: 0.1, lon: 10 }).expect(201);
    const trip = await ctx.api.get(`/api/trips/${tripId}`).expect(200);
    expect(trip.body.totalDistanceMeters).toBe(11_120);
  });

  it('renumbers the remaining days when one is deleted', async () => {
    await addDay('One');
    const two = await addDay('Two');
    await addDay('Three');
    await ctx.api.delete(`/api/days/${two}`).expect(204);
    const res = await ctx.api.get(`/api/trips/${tripId}/days`).expect(200);
    expect(res.body.map((d: { dayNumber: number; title: string }) => `${d.dayNumber}:${d.title}`)).toEqual([
      '1:One',
      '2:Three',
    ]);
  });

  it('removes a waypoint', async () => {
    const dayId = await addDay('Loop');
    const added = await ctx.api.post(`/api/days/${dayId}/waypoints`).send({ name: 'A', lat: 1, lon: 1 }).expect(201);
    const waypointId = added.body.waypoints[0].id;
    const res = await ctx.api.delete(`/api/days/${dayId}/waypoints/${waypointId}`).expect(200);
    expect(res.body.waypoints).toEqual([]);
  });

  it('validates coordinates', async () => {
    const dayId = await addDay('Nowhere');
    const res = await ctx.api.post(`/api/days/${dayId}/waypoints`).send({ name: 'X', lat: 91, lon: 0 }).expect(400);
    expect(res.body.error.details[0].path).toBe('lat');
  });

  it('updates a day title', async () => {
    const dayId = await addDay('Draft');
    const res = await ctx.api.patch(`/api/days/${dayId}`).send({ title: 'Final' }).expect(200);
    expect(res.body.title).toBe('Final');
  });
});
