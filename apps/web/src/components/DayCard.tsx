import { formatDayHeading, formatDistance, formatElevation, routeDistanceMeters, type Day } from '@trailmate/shared';
import { useLocale } from '../i18n/LocaleProvider';

export function DayCard({ day }: { day: Day }) {
  const { locale, t } = useLocale();
  const distance = routeDistanceMeters(day.waypoints);
  return (
    <article className="day-card" aria-label={t('day.label', { number: day.dayNumber })}>
      <h3>
        {t('day.label', { number: day.dayNumber })} · {formatDayHeading(day.date, locale)}
      </h3>
      <p>{day.title}</p>
      <dl className="stats">
        <dt>{t('day.distance')}</dt>
        <dd>{formatDistance(distance, locale)}</dd>
        <dt>{t('day.gain')}</dt>
        <dd>{formatElevation(day.gainM, locale)}</dd>
        <dt>{t('day.loss')}</dt>
        <dd>{formatElevation(day.lossM, locale)}</dd>
      </dl>
      {day.waypoints.length > 0 && (
        <ol className="waypoints">
          {day.waypoints.map((waypoint) => (
            <li key={waypoint.id}>{waypoint.name}</li>
          ))}
        </ol>
      )}
    </article>
  );
}
