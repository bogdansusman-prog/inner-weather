import { averageWeather, type CheckIn } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from '../checkin/weatherText';

type Props = {
  list: CheckIn[]; // check-in-urile zilei, cele mai vechi primele
  locale: string;
};

// O zi: vremea medie si fiecare check-in, pe ore.
export default function DayView({ list, locale }: Props) {
  const { t } = useLanguage();
  const weather = averageWeather(list);

  if (!weather) return <p className="history__empty">{t('history.empty')}</p>;

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="history-day">
      <div className="history-day__summary" data-weather={weather}>
        <span className="history__orb" aria-hidden="true" />
        <div>
          <p className="history-day__weather">{t('history.average').replace('{w}', t(WEATHER_TEXT[weather]))}</p>
          <p className="history__muted">
            {list.length === 1 ? t('home.countOne') : t('home.countMany').replace('{n}', String(list.length))}
          </p>
        </div>
      </div>

      {/* linia zilei: cate un punct pentru fiecare check-in */}
      <ol className="history-day__times">
        {list.map((c) => (
          <li key={c.id} className="history-day__time" data-weather={c.weather}>
            <span className="history__dot" aria-hidden="true" />
            <span className="history-day__hour">{formatTime(c.checkedInAt)}</span>
            <span>{t(WEATHER_TEXT[c.weather])}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
