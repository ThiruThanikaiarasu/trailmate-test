import { SUPPORTED_LOCALES, isLocale } from '@trailmate/shared';
import { useLocale } from '../i18n/LocaleProvider';

const LABELS = { en: 'English', de: 'Deutsch' } as const;

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  return (
    <select
      aria-label="Language"
      value={locale}
      onChange={(event) => {
        if (isLocale(event.target.value)) setLocale(event.target.value);
      }}
    >
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {LABELS[code]}
        </option>
      ))}
    </select>
  );
}
