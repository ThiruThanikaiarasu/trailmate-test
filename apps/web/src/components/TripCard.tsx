import { formatDateRange, tripLengthDays, type Trip } from '@trailmate/shared';
import { useLocale } from '../i18n/LocaleProvider';

export function TripCard({ trip, onOpen }: { trip: Trip; onOpen: (id: number) => void }) {
  const { locale, t } = useLocale();
  return (
    <li className="trip-card">
      <button type="button" className="link" onClick={() => onOpen(trip.id)}>
        {trip.name}
      </button>
      {trip.region && <span className="muted"> · {trip.region}</span>}
      <div>
        {formatDateRange(trip.startDate, trip.endDate, locale)} ·{' '}
        {t('trips.days', { count: tripLengthDays(trip.startDate, trip.endDate) })}
      </div>
    </li>
  );
}
