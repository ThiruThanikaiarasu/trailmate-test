import { describe, expect, it } from 'vitest';
import { parseRoute } from './router';

describe('parseRoute', () => {
  it.each([
    ['/', { name: 'trips' }],
    ['/trips/12', { name: 'trip', id: 12 }],
    ['/trips/12/', { name: 'trip', id: 12 }],
    ['/shared/AbC_-9', { name: 'shared', token: 'AbC_-9' }],
    ['/trips/abc', { name: 'notFound' }],
    ['/elsewhere', { name: 'notFound' }],
  ])('maps %s', (path, route) => {
    expect(parseRoute(path)).toEqual(route);
  });
});
