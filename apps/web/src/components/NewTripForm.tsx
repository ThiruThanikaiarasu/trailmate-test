import { type FormEvent, useState } from 'react';
import { useCreateTrip } from '../hooks/useTrips';
import { useLocale } from '../i18n/LocaleProvider';
import { ErrorBanner } from './ErrorBanner';

export function NewTripForm({ onCreated }: { onCreated: (id: number) => void }) {
  const { t } = useLocale();
  const createTrip = useCreateTrip();
  const [form, setForm] = useState({ name: '', region: '', startDate: '', endDate: '', ownerName: '' });

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: event.target.value })),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createTrip.mutate(form, { onSuccess: (trip) => onCreated(trip.id) });
  };

  return (
    <form onSubmit={submit} className="new-trip">
      {createTrip.isError && <ErrorBanner error={createTrip.error} />}
      <input required placeholder="Trip name" aria-label="Trip name" {...field('name')} />
      <input placeholder="Region" aria-label="Region" {...field('region')} />
      <input required type="date" aria-label="Start date" {...field('startDate')} />
      <input required type="date" aria-label="End date" {...field('endDate')} />
      <input required placeholder="Your name" aria-label="Your name" {...field('ownerName')} />
      <button type="submit" disabled={createTrip.isPending}>
        {t('trips.new')}
      </button>
    </form>
  );
}
