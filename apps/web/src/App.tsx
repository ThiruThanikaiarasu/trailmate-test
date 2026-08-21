import { LocaleSwitcher } from './components/LocaleSwitcher';
import { useLocale } from './i18n/LocaleProvider';
import { TripListPage } from './pages/TripListPage';
import { navigate, useRoute } from './router';

export function App() {
  const route = useRoute();
  const { t } = useLocale();

  return (
    <>
      <nav className="top-bar">
        <button type="button" className="brand" onClick={() => navigate('/')}>
          {t('app.title')}
        </button>
        <LocaleSwitcher />
      </nav>
      {route.name === 'trips' && <TripListPage />}
      {route.name === 'notFound' && <p>{t('trip.notFound')}</p>}
    </>
  );
}
