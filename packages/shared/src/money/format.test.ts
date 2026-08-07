import { describe, expect, it } from 'vitest';
import { formatMoney, parseAmountToCents } from './format';

describe('formatMoney', () => {
  it('formats euros per locale', () => {
    expect(formatMoney(123456, 'en')).toBe('€1,234.56');
    expect(formatMoney(123456, 'de')).toBe('1.234,56 €');
  });
});

describe('parseAmountToCents', () => {
  it.each([
    ['12', 1200],
    ['12.5', 1250],
    ['12,50', 1250],
    [' 0.07 ', 7],
  ])('parses %j', (input, cents) => {
    expect(parseAmountToCents(input)).toBe(cents);
  });

  it.each(['', 'abc', '1.234', '-3', '12.345'])('rejects %j', (input) => {
    expect(parseAmountToCents(input)).toBeNull();
  });
});
