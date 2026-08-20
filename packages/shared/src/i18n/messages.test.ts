import { describe, expect, it } from 'vitest';
import { translate } from './messages';

describe('translate', () => {
  it('fills placeholders', () => {
    expect(translate('en', 'gear.packed', { packed: 2, total: 5 })).toBe('2 of 5 packed');
    expect(translate('de', 'gear.packed', { packed: 2, total: 5 })).toBe('2 von 5 gepackt');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(translate('en', 'day.label')).toBe('Day {number}');
  });
});
