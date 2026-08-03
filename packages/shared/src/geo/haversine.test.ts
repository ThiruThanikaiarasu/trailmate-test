import { describe, expect, it } from 'vitest';
import { haversineMeters, routeDistanceMeters } from './haversine';

describe('haversineMeters', () => {
  it('is zero for the same point', () => {
    expect(haversineMeters({ lat: 47.42, lon: 10.98 }, { lat: 47.42, lon: 10.98 })).toBe(0);
  });

  it('matches a known distance (Munich to Garmisch-Partenkirchen)', () => {
    const munich = { lat: 48.1374, lon: 11.5755 };
    const garmisch = { lat: 47.4917, lon: 11.0955 };
    expect(haversineMeters(munich, garmisch) / 1000).toBeCloseTo(80.4, 0);
  });

  it('is symmetric', () => {
    const a = { lat: 46.5584, lon: 7.8352 };
    const b = { lat: 46.6243, lon: 8.0414 };
    expect(haversineMeters(a, b)).toBeCloseTo(haversineMeters(b, a), 6);
  });

  it('measures one degree of latitude as about 111 km', () => {
    expect(haversineMeters({ lat: 0, lon: 0 }, { lat: 1, lon: 0 }) / 1000).toBeCloseTo(111.2, 1);
  });
});

describe('routeDistanceMeters', () => {
  it('returns 0 for fewer than two points', () => {
    expect(routeDistanceMeters([])).toBe(0);
    expect(routeDistanceMeters([{ lat: 1, lon: 1 }])).toBe(0);
  });

  it('sums every leg of the route', () => {
    const route = [
      { lat: 0, lon: 0 },
      { lat: 1, lon: 0 },
      { lat: 2, lon: 0 },
    ];
    expect(routeDistanceMeters(route) / 1000).toBeCloseTo(222.4, 1);
  });
});
