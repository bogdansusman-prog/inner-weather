import { averageWeather, type CheckIn } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from '../checkin/weatherText';
import { addDays, dayKey, groupByDay, startOfDay, type Period } from './dates';

type Props = {
  period: Extract<Period, 'week' | 'month'>;
  start: Date; // luni (saptamana) sau 1 (luna)
  end: Date;   // inceputul perioadei urmatoare
  list: CheckIn[];
  locale: string;
  onPickDay: (date: Date) => void; // deschide ziua in vederea "Day"
};

// O saptamana (un rand) sau o luna (calendar). Fiecare zi e colorata dupa vremea ei medie.
export default function CalendarView({ period, start, end, list, locale, onPickDay }: Props) {
  const { t } = useLanguage();
  const byDay = groupByDay(list);
  const today = startOfDay(new Date());
  const todayKey = dayKey(today);

  // zilele perioadei, de la start pana inainte de end
  const days: Date[] = [];
  for (let d = start; d < end; d = addDays(d, 1)) days.push(d);

  // la luna: casute goale pana la ziua din saptamana in care cade 1 (luni = 0)
  const blanks = period === 'month' ? (start.getDay() + 6) % 7 : 0;

  // numele zilelor, de luni pana duminica (o saptamana oarecare care incepe luni)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    addDays(new Date(2024, 0, 1), i).toLocaleDateString(locale, { weekday: period === 'month' ? 'narrow' : 'short' }),
  );

  return (
    <div className="history-cal" data-period={period}>
      <div className="history-cal__weekdays" aria-hidden="true">
        {weekdays.map((name, i) => (
          <span key={i}>{name}</span>
        ))}
      </div>

      <ol className="history-cal__days">
        {Array.from({ length: blanks }, (_, i) => (
          <li key={`blank-${i}`} aria-hidden="true" />
        ))}
        {days.map((date) => {
          const key = dayKey(date);
          const dayList = byDay.get(key) ?? [];
          const weather = averageWeather(dayList);
          const future = date > today;
          const label = `${date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}: ${
            weather ? t(WEATHER_TEXT[weather]) : t('home.noDay')
          }`;
          return (
            <li key={key}>
              <button
                type="button"
                className="history-cal__day"
                data-weather={weather ?? 'NONE'}
                data-today={key === todayKey}
                disabled={future}
                aria-label={future ? undefined : label}
                onClick={() => onPickDay(date)}
              >
                <span className="history-cal__num" aria-hidden="true">{date.getDate()}</span>
                {period === 'week' && dayList.length > 0 && (
                  <span className="history-cal__count" aria-hidden="true">{dayList.length}</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
