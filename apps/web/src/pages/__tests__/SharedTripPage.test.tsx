import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, renderWithProviders } from '../../test/render';
import { SharedTripPage } from '../SharedTripPage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SharedTripPage', () => {
  it('shows the shared itinerary', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({ name: 'Lavena Coastal Walk', region: 'Taveuni, Fiji', startDate: '2026-08-10', endDate: '2026-08-10', days: [] }),
      ),
    );
    renderWithProviders(<SharedTripPage token="abc" />);
    expect(await screen.findByRole('heading', { name: 'Lavena Coastal Walk' })).toBeInTheDocument();
    expect(screen.getByText('Taveuni, Fiji · Aug 10, 2026')).toBeInTheDocument();
  });

  it('explains when the link has expired', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: { code: 'SHARE_LINK_EXPIRED', message: 'expired' } }, 410)),
    );
    renderWithProviders(<SharedTripPage token="old" />);
    expect(await screen.findByRole('alert')).toHaveTextContent('This link has expired.');
  });
});
