import { formatDateRange, formatDistance, type TripDetail } from '@trailmate/shared';
import { useLocale } from '../i18n/LocaleProvider';

export function TripHeader({ trip }: { trip: TripDetail }) {
  const { locale, t } = useLocale();
  return (
    <header className="trip-header">
      <h1>{trip.name}</h1>
      <p className="muted">
        {trip.region && `${trip.region} · `}
        <time>{formatDateRange(trip.startDate, trip.endDate, locale)}</time>
      </p>
      <dl className="stats">
        <dt>{t('trip.distance')}</dt>
        <dd>{formatDistance(trip.totalDistanceMeters, locale)}</dd>
        <dt>{t('trip.participants')}</dt>
        <dd>{trip.participantCount}</dd>
      </dl>
    </header>
  );
}
