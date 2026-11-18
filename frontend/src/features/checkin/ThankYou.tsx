import type { Weather } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from './weatherText';
import './thanks.css';

// cate raze sar din bulina cand apare
const RAYS = 8;

type Props = {
  weather: Weather;
  durationMs: number; // cat sta pe ecran, cu intrare si iesire cu tot
};

// Multumirea de dupa check-in-ul zilnic. Apare peste cer si pleaca singura.
// Nu blocheaza nimic, asa ca in spatele ei pagina poate trece pe Home.
export default function ThankYou({ weather, durationMs }: Props) {
  const { t } = useLanguage();

  return (
    <div className="thanks" data-weather={weather} role="status" style={{ animationDuration: `${durationMs}ms` }}>
      <div className="thanks__card">
        <span className="thanks__orb" aria-hidden="true">
          {Array.from({ length: RAYS }, (_, i) => (
            // fiecare raza e rotita in jurul bulinei, ca acele unui ceas
            <span key={i} className="thanks__ray" style={{ rotate: `${(360 / RAYS) * i}deg` }} />
          ))}
          <svg viewBox="0 0 24 24" className="thanks__check">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p className="thanks__title">{t('thanks.title')}</p>
        <p className="thanks__weather">{t('thanks.today').replace('{w}', t(WEATHER_TEXT[weather]))}</p>
      </div>
    </div>
  );
}
