import { useEffect, useState } from 'react';
import { getCheckIns, type CheckIn, type Weather } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import { WEATHER_TEXT } from '../checkin/weatherText';
import CalendarView from './CalendarView';
import DayView from './DayView';
import { countWeathers, mainWeather } from './tips';
import WeatherDonut from './WeatherDonut';
import { addDays, averagePleasantness, periodStart, shiftPeriod, startOfDay, type Period } from './dates';
import './history.css';

// cat de mare trebuie sa fie diferenta ca sa spunem "mai senin" / "mai innorat" (ca in Home)
const TREND = 0.15;

const PERIODS: { id: Period; label: TextKey }[] = [
  { id: 'day', label: 'history.day' },
  { id: 'week', label: 'history.week' },
  { id: 'month', label: 'history.month' },
];

// comparatia cu perioada dinainte: doar o constatare, niciodata un verdict
const TREND_TEXT = {
  week: { brighter: 'history.weekBrighter', cloudier: 'history.weekCloudier', same: 'history.weekSame' },
  month: { brighter: 'history.monthBrighter', cloudier: 'history.monthCloudier', same: 'history.monthSame' },
} as const satisfies Record<string, Record<string, TextKey>>;

const LEGEND: Weather[] = ['SUNNY', 'CALM', 'FOGGY', 'STORMY'];

type Props = {
  active: boolean; // pagina se vede acum; atunci reincarcam datele
};

// Istoricul: o zi, o saptamana sau o luna, cu sageti inainte / inapoi.
export default function HistoryPage({ active }: Props) {
  const { t, lang } = useLanguage();
  const locale = lang === 'ro' ? 'ro-RO' : 'en-GB';
  const [period, setPeriod] = useState<Period>('week');
  // ziua aleasa; aratam perioada care o contine
  const [date, setDate] = useState(() => startOfDay(new Date()));
  // ce a raspuns serverul si de la ce data am cerut
  const [result, setResult] = useState<{ from: number; list: CheckIn[] } | null>(null);
  const [loadError, setLoadError] = useState(false);

  const start = periodStart(period, date);
  const end = shiftPeriod(period, start, 1);
  // cerem si perioada dinainte, ca sa putem compara
  const from = shiftPeriod(period, start, -1).getTime();

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    getCheckIns(new Date(from))
      .then((list) => {
        if (cancelled) return;
        setResult({ from, list });
        setLoadError(false);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [active, from]);

  // null cat timp se incarca perioada noua
  const list = result?.from === from ? result.list : null;
  const inPeriod = (list ?? []).filter((c) => {
    const time = new Date(c.checkedInAt).getTime();
    return time >= start.getTime() && time < end.getTime();
  });
  const before = (list ?? []).filter((c) => new Date(c.checkedInAt).getTime() < start.getTime());

  // perioada de acum (contine ziua de azi): nu exista "inainte" spre viitor
  const today = startOfDay(new Date());
  const isCurrent = end > today;

  function go(step: number) {
    const next = shiftPeriod(period, start, step);
    // daca ajungem inapoi la perioada de azi, ziua aleasa redevine azi
    setDate(today >= next && today < shiftPeriod(period, next, 1) ? today : next);
  }

  function pickDay(day: Date) {
    setDate(day);
    setPeriod('day');
  }

  // titlul perioadei
  let title: string;
  if (period === 'day') {
    title = start.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  } else if (period === 'week') {
    const short = { day: 'numeric', month: 'short' } as const;
    title = `${start.toLocaleDateString(locale, short)} – ${addDays(start, 6).toLocaleDateString(locale, short)}`;
  } else {
    title = start.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }

  // cercul vremii si ideea pentru perioada aleasa
  const counts = countWeathers(inPeriod);
  const main = mainWeather(counts);

  // propozitia de jos: fata de saptamana / luna dinainte
  let trend: string | null = null;
  if (period !== 'day' && inPeriod.length > 0 && before.length > 0) {
    const diff = averagePleasantness(inPeriod) - averagePleasantness(before);
    const texts = TREND_TEXT[period];
    trend = t(diff > TREND ? texts.brighter : diff < -TREND ? texts.cloudier : texts.same);
  }

  return (
    <div className="history">
      <h2 className="history__title">{t('history.title')}</h2>

      <div className="history__periods" role="group" aria-label={t('history.periods')}>
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="history__period"
            aria-pressed={p.id === period}
            onClick={() => setPeriod(p.id)}
          >
            {t(p.label)}
          </button>
        ))}
      </div>

      <div className="history__grid">
        <section className="history__card" aria-labelledby="history-range">
          <div className="history__nav">
            <button type="button" className="history__arrow" aria-label={t('history.prev')} onClick={() => go(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <h3 className="history__range" id="history-range" aria-live="polite">{title}</h3>
            <button
              type="button"
              className="history__arrow"
              aria-label={t('history.next')}
              disabled={isCurrent}
              onClick={() => go(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {loadError ? (
            <p className="history__empty">{t('home.loadError')}</p>
          ) : !list ? (
            <p className="history__empty" aria-hidden="true">&nbsp;</p>
          ) : period === 'day' ? (
            <DayView list={inPeriod} locale={locale} />
          ) : (
            <>
              <CalendarView
                period={period}
                start={start}
                end={end}
                list={inPeriod}
                locale={locale}
                onPickDay={pickDay}
              />
              {inPeriod.length === 0 && <p className="history__muted history__center">{t('history.empty')}</p>}
            </>
          )}

          {trend && <p className="history__trend">{trend}</p>}

          {/* legenda, doar cand nu se vede cercul (el are legenda lui) */}
          {period !== 'day' && !main && (
            <ul className="history__legend" aria-label={t('history.legend')}>
              {LEGEND.map((w) => (
                <li key={w} data-weather={w}>
                  <span className="history__dot" aria-hidden="true" />
                  {t(WEATHER_TEXT[w])}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* cercul vremii + o idee; key nou = animatia porneste din nou la fiecare perioada */}
        {list && main && (
          <section className="history__card history__insight" aria-labelledby="history-mix" key={`${period}-${start.getTime()}`}>
            <h3 className="history__label" id="history-mix">{t('history.mix')}</h3>
            <WeatherDonut counts={counts} main={main} />
            <div className="history__tip" data-weather={main}>
              <span className="history__orb history__tip-orb" aria-hidden="true" />
              <div>
                <p className="history__label">{t('history.idea')}</p>
                <p className="history__tip-text">{t(`tips.${period}.${main}`)}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
