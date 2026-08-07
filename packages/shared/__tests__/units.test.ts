import { describe, expect, it } from 'vitest';
import { formatDistance, formatElevation, formatWeight, unitSystemFor } from '../src/units/units';

describe('unitSystemFor', () => {
  it('uses imperial units for English and metric for German', () => {
    expect(unitSystemFor('en')).toBe('imperial');
    expect(unitSystemFor('de')).toBe('metric');
  });
});

describe('formatDistance', () => {
  it('shows miles in English', () => {
    expect(formatDistance(16093.44, 'en')).toBe('10.0 mi');
  });

  it('shows kilometres with a decimal comma in German', () => {
    expect(formatDistance(12345, 'de')).toBe('12,3 km');
  });
});

describe('formatElevation', () => {
  it('shows feet in English', () => {
    expect(formatElevation(1000, 'en')).toBe('3,281 ft');
  });

  it('shows metres in German', () => {
    expect(formatElevation(1234, 'de')).toBe('1.234 m');
  });
});

describe('formatWeight', () => {
  it('switches to kilograms from 1000 g', () => {
    expect(formatWeight(850, 'en')).toBe('850 g');
    expect(formatWeight(1250, 'de')).toBe('1,25 kg');
  });
});
