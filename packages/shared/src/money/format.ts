import type { Locale } from '../types';

export type Currency = 'EUR' | 'USD' | 'CHF';

export function formatMoney(cents: number, locale: Locale, currency: Currency = 'EUR'): string {
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency }).format(
    cents / 100,
  );
}

/** Parses user input such as "12.50" or "12,50" into integer cents. Returns null if it is not an amount. */
export function parseAmountToCents(input: string): number | null {
  const normalized = input.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
