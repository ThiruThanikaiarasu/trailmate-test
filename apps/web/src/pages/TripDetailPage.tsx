import { CostSplitTable } from '../components/CostSplitTable';
import { DayCard } from '../components/DayCard';
import { ErrorBanner } from '../components/ErrorBanner';
import { GearChecklist } from '../components/GearChecklist';
import { ShareLinkPanel } from '../components/ShareLinkPanel';
import { TripHeader } from '../components/TripHeader';
import { useGear } from '../hooks/useGear';
import { useCostSplit, useDays, useTrip } from '../hooks/useTrips';
import { useLocale } from '../i18n/LocaleProvider';

export function TripDetailPage({ tripId }: { tripId: number }) {
  const { t } = useLocale();
  const trip = useTrip(tripId);
  const days = useDays(tripId);
  const gear = useGear(tripId);
  const costSplit = useCostSplit(tripId);

  if (trip.isPending) return <p>{t('trip.loading')}</p>;
  if (trip.isError) return <ErrorBanner error={trip.error} />;

  return (
    <main>
      <TripHeader trip={trip.data} />
      <section aria-labelledby="itinerary-heading">
        <h2 id="itinerary-heading">{t('trip.itinerary')}</h2>
        {days.data?.map((day) => (
          <DayCard key={day.id} day={day} />
        ))}
      </section>
      {gear.query.data && (
        <GearChecklist
          items={gear.query.data}
          onToggle={(id, packed) => gear.toggle.mutate({ id, packed })}
          onRemove={(id) => gear.remove.mutate(id)}
          onAdd={(item) => gear.add.mutate(item)}
        />
      )}
      <section aria-labelledby="costs-heading">
        <h2 id="costs-heading">{t('costs.heading')}</h2>
        {costSplit.data && <CostSplitTable split={costSplit.data} />}
      </section>
      <ShareLinkPanel tripId={tripId} />
    </main>
  );
}
