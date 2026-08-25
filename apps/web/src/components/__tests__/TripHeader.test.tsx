import type { TripDetail } from '@trailmate/shared';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { TripHeader } from '../TripHeader';

const trip: TripDetail = {
  id: 1,
  name: 'Karwendel Hut-to-Hut',
  region: 'Tirol',
  startDate: '2026-07-03',
  endDate: '2026-07-06',
  notes: null,
  createdAt: '2026-06-01T09:00:00.000Z',
  dayCount: 4,
  participantCount: 3,
  gearCount: 10,
  packedCount: 4,
  totalDistanceMeters: 48_280,
};

describe('TripHeader', () => {
  it('shows the name, region and dates', () => {
    renderWithProviders(<TripHeader trip={trip} />);
    expect(screen.getByRole('heading', { name: 'Karwendel Hut-to-Hut' })).toBeInTheDocument();
    expect(screen.getByText('Jul 3, 2026 – Jul 6, 2026')).toBeInTheDocument();
    expect(screen.getByText(/Tirol/)).toBeInTheDocument();
  });

  it('shows the total distance in miles for English', () => {
    renderWithProviders(<TripHeader trip={trip} />);
    expect(screen.getByText('30.0 mi')).toBeInTheDocument();
  });

  it('shows the total distance in kilometres for German', () => {
    renderWithProviders(<TripHeader trip={trip} />, { locale: 'de' });
    expect(screen.getByText('48,3 km')).toBeInTheDocument();
  });
});
