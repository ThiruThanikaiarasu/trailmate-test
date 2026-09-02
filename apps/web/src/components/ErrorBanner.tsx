import { useLocale } from '../i18n/LocaleProvider';

export function ErrorBanner({ error }: { error: unknown }) {
  const { t } = useLocale();
  const message = error instanceof Error && error.message ? error.message : t('error.generic');
  return (
    <div role="alert" className="error-banner">
      {message}
    </div>
  );
}
