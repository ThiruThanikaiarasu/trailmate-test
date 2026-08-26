import { formatDateRange } from '@trailmate/shared';
import { ApiError } from '../api/client';
import { DayCard } from '../components/DayCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { useSharedTrip } from '../hooks/useShareLink';
import { useLocale } from '../i18n/LocaleProvider';

export function SharedTripPage({ token }: { token: string }) {
  const { locale, t } = useLocale();
  const shared = useSharedTrip(token);

  if (shared.isPending) return <p>{t('trip.loading')}</p>;
  if (shared.isError) {
    if (shared.error instanceof ApiError && shared.error.status === 410) return <p role="alert">{t('share.expired')}</p>;
    return <ErrorBanner error={shared.error} />;
  }

  const trip = shared.data;
  return (
    <main>
      <h1>{trip.name}</h1>
      <p className="muted">
        {trip.region && `${trip.region} · `}
        {formatDateRange(trip.startDate, trip.endDate, locale)}
      </p>
      {trip.days.map((day) => (
        <DayCard key={day.id} day={day} />
      ))}
    </main>
  );
}
