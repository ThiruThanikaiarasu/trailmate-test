import { formatDate } from '@trailmate/shared';
import { useCreateShareLink } from '../hooks/useShareLink';
import { useLocale } from '../i18n/LocaleProvider';
import { ErrorBanner } from './ErrorBanner';

export function ShareLinkPanel({ tripId }: { tripId: number }) {
  const { locale, t } = useLocale();
  const createLink = useCreateShareLink(tripId);
  const link = createLink.data;

  return (
    <section aria-labelledby="share-heading">
      <h2 id="share-heading">{t('share.heading')}</h2>
      {createLink.isError && <ErrorBanner error={createLink.error} />}
      {link ? (
        <div>
          <input readOnly aria-label={t('share.heading')} value={link.url} />
          <button type="button" onClick={() => void navigator.clipboard?.writeText(link.url)}>
            {t('share.copy')}
          </button>
          <p className="muted">{t('share.expires', { date: formatDate(link.expiresAt, locale) })}</p>
        </div>
      ) : (
        <button type="button" disabled={createLink.isPending} onClick={() => createLink.mutate()}>
          {t('share.create')}
        </button>
      )}
    </section>
  );
}
