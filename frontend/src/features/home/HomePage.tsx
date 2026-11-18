import { useEffect, useState } from 'react';
import { averageWeather, getCheckIns, startOfDayAgo, type CheckIn } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from '../checkin/weatherText';
import AddCheckInDialog from './AddCheckInDialog';
import './home-page.css';

// cat de mare trebuie sa fie diferenta ca sa spunem "mai senin" / "mai innorat"
const TREND = 0.15;

type Props = {
  name: string | null;
  onAdded: (checkIn: CheckIn) => void; // anuntam Shell-ul (poate e primul de azi)
};

// "2026-11-18": cheia unei zile, dupa ceasul calculatorului
function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// cate zile au trecut de luni (luni = 0, duminica = 6)
function daysSinceMonday() {
  return (new Date().getDay() + 6) % 7;
}

function average(values: number[]) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export default function HomePage({ name, onAdded }: Props) {
  const { t, lang } = useLanguage();
  const locale = lang === 'ro' ? 'ro-RO' : 'en-GB';
  const [checkIns, setCheckIns] = useState<CheckIn[] | null>(null); // null = se incarca
  const [loadError, setLoadError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // check-in-urile de luni saptamana trecuta pana acum (saptamana asta + cea dinainte)
  useEffect(() => {
    getCheckIns(startOfDayAgo(daysSinceMonday() + 7))
      .then(setCheckIns)
      .catch(() => setLoadError(true));
  }, []);

  function handleSaved(checkIn: CheckIn) {
    setCheckIns((list) => [...(list ?? []), checkIn]);
    onAdded(checkIn);
  }

  // salutul, dupa ora
  const hour = new Date().getHours();
  const greeting = t(hour < 12 ? 'home.morning' : hour < 18 ? 'home.afternoon' : 'home.evening');

  // check-in-urile grupate pe zile
  const byDay = new Map<string, CheckIn[]>();
  for (const c of checkIns ?? []) {
    const key = dayKey(new Date(c.checkedInAt));
    byDay.set(key, [...(byDay.get(key) ?? []), c]);
  }

  // azi
  const today = byDay.get(dayKey(new Date())) ?? [];
  const todayWeather = averageWeather(today);

  // saptamana asta, mereu de luni pana duminica
  const sinceMonday = daysSinceMonday();
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDayAgo(sinceMonday - i); // i = 0 e luni; zilele de dupa azi ies in viitor
    const list = byDay.get(dayKey(date)) ?? [];
    return { date, weather: averageWeather(list), isToday: i === sinceMonday, isFuture: i > sinceMonday };
  });

  // saptamana asta (de luni) fata de cea trecuta: doar cat de placut, fara verdicte
  const cutoff = startOfDayAgo(sinceMonday).getTime();
  const thisWeek = (checkIns ?? []).filter((c) => new Date(c.checkedInAt).getTime() >= cutoff);
  const lastWeek = (checkIns ?? []).filter((c) => new Date(c.checkedInAt).getTime() < cutoff);
  let trend: string | null = null;
  if (thisWeek.length > 0 && lastWeek.length > 0) {
    const diff = average(thisWeek.map((c) => c.pleasantness)) - average(lastWeek.map((c) => c.pleasantness));
    trend = t(diff > TREND ? 'home.brighter' : diff < -TREND ? 'home.cloudier' : 'home.same');
  }

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="home-page">
      <h2 className="home-page__greeting">
        {greeting}
        {name ? `, ${name}` : ''}
      </h2>

      {/* azi */}
      <section className="home-page__today" data-weather={todayWeather ?? 'NONE'} aria-labelledby="home-today">
        <h3 className="home-page__label" id="home-today">{t('home.today')}</h3>
        {loadError ? (
          <p className="home-page__muted">{t('home.loadError')}</p>
        ) : todayWeather ? (
          <>
            <p className="home-page__weather">{t(WEATHER_TEXT[todayWeather])}</p>
            <p className="home-page__muted">
              {today.length === 1 ? t('home.countOne') : t('home.countMany').replace('{n}', String(today.length))}
            </p>
            <ul className="home-page__times">
              {today.map((c) => (
                <li key={c.id} className="home-page__time" data-weather={c.weather}>
                  <span className="home-page__chip" aria-hidden="true" />
                  {formatTime(c.checkedInAt)} · {t(WEATHER_TEXT[c.weather])}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="home-page__muted">{checkIns ? t('home.empty') : ' '}</p>
        )}

        <button type="button" className="home-page__add" onClick={() => setDialogOpen(true)}>
          {t('home.add')}
        </button>
      </section>

      {/* ultimele 7 zile */}
      <section className="home-page__week" aria-labelledby="home-week">
        <h3 className="home-page__label" id="home-week">{t('home.week')}</h3>
        <ol className="home-page__days">
          {week.map(({ date, weather, isToday, isFuture }) => (
            <li
              key={dayKey(date)}
              className="home-page__day"
              data-weather={weather ?? 'NONE'}
              data-today={isToday}
              data-future={isFuture}
            >
              <span className="home-page__dot" aria-hidden="true">
                {/* bifa: in ziua asta ai facut check-in */}
                {weather && (
                  <svg viewBox="0 0 16 16" className="home-page__check">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                )}
              </span>
              <span className="home-page__dayname">{date.toLocaleDateString(locale, { weekday: 'short' })}</span>
              {!isFuture && <span className="sr-only">{weather ? t(WEATHER_TEXT[weather]) : t('home.noDay')}</span>}
            </li>
          ))}
        </ol>
        {trend && <p className="home-page__trend">{trend}</p>}
      </section>

      <AddCheckInDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={handleSaved} />
    </div>
  );
}
