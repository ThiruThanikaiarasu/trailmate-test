import type { Day } from '@trailmate/shared';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../test/render';
import { DayCard } from './DayCard';

const day: Day = {
  id: 7,
  tripId: 1,
  dayNumber: 2,
  date: '2026-07-04',
  title: 'Karwendelhaus to Falkenhütte',
  notes: null,
  waypoints: [
    { id: 1, seq: 1, name: 'Karwendelhaus', lat: 47.4237, lon: 11.4062, elevationM: 1771 },
    { id: 2, seq: 2, name: 'Falkenhütte', lat: 47.4415, lon: 11.5172, elevationM: 1848 },
  ],
  distanceMeters: 8650,
  gainM: 77,
  lossM: 0,
};

describe('DayCard', () => {
  it('shows the day number, date and waypoints', () => {
    renderWithProviders(<DayCard day={day} />);
    expect(screen.getByRole('heading', { name: 'Day 2 · Sat, Jul 4' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Karwendelhaus', 'Falkenhütte']);
  });

  it('shows metric distance and ascent in German', () => {
    renderWithProviders(<DayCard day={day} />, { locale: 'de' });
    expect(screen.getByRole('heading', { name: 'Tag 2 · Sa., 04.07.' })).toBeInTheDocument();
    expect(screen.getByText('8,6 km')).toBeInTheDocument();
    expect(screen.getByText('77 m')).toBeInTheDocument();
  });
});
