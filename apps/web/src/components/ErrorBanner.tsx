import { useLocale } from '../i18n/LocaleProvider';

export function ErrorBanner(_props: { error: unknown }) {
  const { t } = useLocale();
  return (
    <div role="alert" className="error-banner">
      {t('error.generic')}
    </div>
  );
}
