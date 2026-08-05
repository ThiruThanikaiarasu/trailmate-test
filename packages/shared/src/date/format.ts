import type { Locale } from '../types';

const MONTHS: Record<Locale, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'],
};

const WEEKDAYS: Record<Locale, readonly string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  de: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
};

const INVALID_DATE: Record<Locale, string> = {
  en: 'Invalid date',
  de: 'Ungültiges Datum',
};

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Parses an ISO calendar date (`2026-07-03`) or timestamp as a UTC date.
 * Returns null for anything that is not a valid date.
 */
export function parseIsoDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value !== 'string' || value.length === 0) return null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats a date with a small subset of Unicode tokens: yyyy, MMM, MM, M, dd, d, EEE. */
export function formatPattern(date: Date, pattern: string, locale: Locale): string {
  return pattern.replace(/yyyy|MMM|MM|M|dd|d|EEE/g, (token) => {
    switch (token) {
      case 'yyyy':
        return String(date.getUTCFullYear());
      case 'MMM':
        return MONTHS[locale][date.getUTCMonth()];
      case 'MM':
        return pad(date.getUTCMonth() + 1);
      case 'M':
        return String(date.getUTCMonth() + 1);
      case 'dd':
        return pad(date.getUTCDate());
      case 'd':
        return String(date.getUTCDate());
      default:
        return WEEKDAYS[locale][date.getUTCDay()];
    }
  });
}

export function formatDate(value: string | Date | null | undefined, locale: Locale): string {
  const date = parseIsoDate(value);
  if (!date) return INVALID_DATE[locale];
  return formatPattern(date, locale === 'de' ? 'dd.MM.yyyy' : 'MMM d, yyyy', locale);
}

export function formatDayHeading(value: string | Date, locale: Locale): string {
  const date = parseIsoDate(value);
  if (!date) return INVALID_DATE[locale];
  return formatPattern(date, locale === 'de' ? 'EEE, dd.MM.' : 'EEE, MMM d', locale);
}

export function formatDateRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
  locale: Locale,
): string {
  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  if (!from || !to) return INVALID_DATE[locale];
  if (from.getTime() === to.getTime()) return formatDate(from, locale);
  return `${formatDate(from, locale)} – ${formatDate(to, locale)}`;
}

/** Number of calendar days a trip spans, counting both the first and the last day. */
export function tripLengthDays(start: string, end: string): number {
  const from = parseIsoDate(start);
  const to = parseIsoDate(end);
  if (!from || !to) return 0;
  return Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
}

/** ISO calendar date of the n-th day (1-based) of a trip. */
export function dateOfTripDay(start: string, dayNumber: number): string {
  const from = parseIsoDate(start);
  if (!from) throw new RangeError(`Invalid trip start date: ${start}`);
  const day = new Date(from.getTime() + (dayNumber - 1) * 86_400_000);
  return `${day.getUTCFullYear()}-${pad(day.getUTCMonth() + 1)}-${pad(day.getUTCDate())}`;
}
