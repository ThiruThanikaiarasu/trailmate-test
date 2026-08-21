import { ErrorBanner } from '../components/ErrorBanner';
import { NewTripForm } from '../components/NewTripForm';
import { TripCard } from '../components/TripCard';
import { useTrips } from '../hooks/useTrips';
import { useLocale } from '../i18n/LocaleProvider';
import { navigate } from '../router';

export function TripListPage() {
  const { t } = useLocale();
  const trips = useTrips();
  const open = (id: number) => navigate(`/trips/${id}`);

  return (
    <main>
      <h1>{t('trips.heading')}</h1>
      {trips.isError && <ErrorBanner error={trips.error} />}
      {trips.data?.length === 0 && <p>{t('trips.empty')}</p>}
      <ul className="trip-list">
        {trips.data?.map((trip) => (
          <TripCard key={trip.id} trip={trip} onOpen={open} />
        ))}
      </ul>
      <NewTripForm onCreated={open} />
    </main>
  );
}
