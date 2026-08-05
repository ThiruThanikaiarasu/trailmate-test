import { describe, expect, it } from 'vitest';
import {
  dateOfTripDay,
  formatDate,
  formatDateRange,
  formatDayHeading,
  parseIsoDate,
  tripLengthDays,
} from '../format';

describe('parseIsoDate', () => {
  it('parses calendar dates as UTC midnight', () => {
    expect(parseIsoDate('2026-07-03')?.toISOString()).toBe('2026-07-03T00:00:00.000Z');
  });

  it('returns null for missing or malformed values', () => {
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate('not a date')).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats English dates with a short month name', () => {
    expect(formatDate('2026-07-03', 'en')).toBe('Jul 3, 2026');
  });

  it('reports invalid input instead of throwing', () => {
    expect(formatDate(undefined, 'en')).toBe('Invalid date');
    expect(formatDate('soon', 'de')).toBe('Ungültiges Datum');
  });
});

describe('formatDateRange', () => {
  it('joins start and end with an en dash', () => {
    expect(formatDateRange('2026-07-03', '2026-07-09', 'en')).toBe('Jul 3, 2026 – Jul 9, 2026');
  });

  it('collapses a single-day trip to one date', () => {
    expect(formatDateRange('2026-07-03', '2026-07-03', 'en')).toBe('Jul 3, 2026');
  });
});

describe('formatDayHeading', () => {
  it('includes the weekday', () => {
    expect(formatDayHeading('2026-07-03', 'en')).toBe('Fri, Jul 3');
  });
});

describe('trip day arithmetic', () => {
  it('counts both the first and the last day', () => {
    expect(tripLengthDays('2026-07-03', '2026-07-09')).toBe(7);
  });

  it('finds the date of a given trip day across a month boundary', () => {
    expect(dateOfTripDay('2026-07-30', 4)).toBe('2026-08-02');
  });
});
