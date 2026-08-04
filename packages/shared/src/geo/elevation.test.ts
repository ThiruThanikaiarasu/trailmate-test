import { describe, expect, it } from 'vitest';
import { elevationProfile } from './elevation';

describe('elevationProfile', () => {
  it('returns nulls when no point has an elevation', () => {
    expect(elevationProfile([{ lat: 0, lon: 0 }])).toEqual({ gainM: 0, lossM: 0, highestM: null, lowestM: null });
  });

  it('adds up climbs and descents', () => {
    const profile = elevationProfile([
      { lat: 0, lon: 0, elevationM: 1000 },
      { lat: 0, lon: 0, elevationM: 1400 },
      { lat: 0, lon: 0, elevationM: 1200 },
      { lat: 0, lon: 0, elevationM: 1650 },
    ]);
    expect(profile).toEqual({ gainM: 850, lossM: 200, highestM: 1650, lowestM: 1000 });
  });

  it('ignores jitter below the noise threshold', () => {
    const profile = elevationProfile([
      { lat: 0, lon: 0, elevationM: 500 },
      { lat: 0, lon: 0, elevationM: 501 },
      { lat: 0, lon: 0, elevationM: 499 },
      { lat: 0, lon: 0, elevationM: 502 },
    ]);
    expect(profile.gainM).toBe(0);
    expect(profile.lossM).toBe(0);
  });
});
