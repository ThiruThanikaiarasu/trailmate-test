import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { jsonResponse, renderWithProviders } from '../../test/render';
import { TripListPage } from '../TripListPage';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TripListPage', () => {
  it('lists trips from the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          id: 1,
          name: 'Karwendel Hut-to-Hut',
          region: 'Tirol',
          startDate: '2026-07-03',
          endDate: '2026-07-06',
          notes: null,
          createdAt: '2026-06-01T09:00:00.000Z',
        },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderWithProviders(<TripListPage />);

    expect(await screen.findByRole('button', { name: 'Karwendel Hut-to-Hut' })).toBeInTheDocument();
    expect(screen.getByText(/Jul 3, 2026 – Jul 6, 2026/)).toHaveTextContent('4 days');
    expect(fetchMock).toHaveBeenCalledWith('/api/trips', expect.objectContaining({ method: 'GET' }));
  });

  it('says when there are no trips', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse([])));
    renderWithProviders(<TripListPage />);
    expect(await screen.findByText('No trips planned yet.')).toBeInTheDocument();
  });
});
