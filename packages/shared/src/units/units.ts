import type { Locale } from '../types';

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_FOOT = 0.3048;

const MILES_PER_METER = 1 / METERS_PER_MILE;
const FEET_PER_METER = METERS_PER_FOOT;

export type UnitSystem = 'metric' | 'imperial';

/** English-speaking users get miles and feet; everyone else gets kilometres and metres. */
export function unitSystemFor(locale: Locale): UnitSystem {
  return locale === 'en' ? 'imperial' : 'metric';
}

const formatters = new Map<string, Intl.NumberFormat>();

/** Intl.NumberFormat is expensive to construct, so keep one per locale and precision. */
function formatNumber(value: number, locale: Locale, fractionDigits: number): string {
  const key = `${locale}:${fractionDigits}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    formatters.set(key, formatter);
  }
  return formatter.format(value);
}

export function formatDistance(meters: number, locale: Locale): string {
  if (unitSystemFor(locale) === 'imperial') {
    return `${formatNumber(meters * MILES_PER_METER, locale, 1)} mi`;
  }
  return `${formatNumber(meters / 1000, locale, 1)} km`;
}

export function formatElevation(meters: number, locale: Locale): string {
  if (unitSystemFor(locale) === 'imperial') {
    return `${formatNumber(meters * FEET_PER_METER, locale, 0)} ft`;
  }
  return `${formatNumber(meters, locale, 0)} m`;
}

export function formatWeight(grams: number, locale: Locale): string {
  if (grams >= 1000) return `${formatNumber(grams / 1000, locale, 2)} kg`;
  return `${formatNumber(grams, locale, 0)} g`;
}
