export type Locale = 'en' | 'de';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'de'];

export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface RoutePoint extends GeoPoint {
  elevationM?: number | null;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
