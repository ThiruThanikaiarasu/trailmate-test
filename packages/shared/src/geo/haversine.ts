import type { GeoPoint } from '../types';

/** Mean Earth radius (IUGG), in meters. */
export const EARTH_RADIUS_METERS = 6_371_008.8;

export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Great-circle distance between two points, in meters. */
export function haversineMeters(from: GeoPoint, to: GeoPoint): number {
  const phi1 = toRadians(from.lat);
  const phi2 = toRadians(to.lat);
  const dPhi = phi2 - phi1;
  const dLambda = toRadians(to.lon - from.lon);

  const h = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Total length of a route through the given points, in meters. */
export function routeDistanceMeters(points: readonly GeoPoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += haversineMeters(points[i - 1], points[i]);
  }
  return total;
}
