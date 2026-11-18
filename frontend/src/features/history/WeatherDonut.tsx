import type { Weather } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from '../checkin/weatherText';
import './donut.css';

// ordinea feliilor in cerc, incepand de sus, in sensul acelor de ceas
const ORDER: Weather[] = ['SUNNY', 'CALM', 'FOGGY', 'STORMY'];
const RADIUS = 48;
const CIRCLE = 2 * Math.PI * RADIUS; // lungimea cercului
const GAP = 3; // un mic spatiu intre felii
const SLICE_MS = 260; // felia urmatoare porneste la un sfert de secunda dupa cea dinainte

type Props = {
  counts: Record<Weather, number>; // cate check-in-uri are fiecare vreme
  main: Weather | null;            // vremea care a fost cel mai des
};

// Cercul vremii: cate o felie pentru fiecare vreme, care se deseneaza pe rand.
// Ca sa porneasca animatia din nou, parintele ii da un `key` nou.
export default function WeatherDonut({ counts, main }: Props) {
  const { t } = useLanguage();
  const total = ORDER.reduce((sum, w) => sum + counts[w], 0);

  // pentru fiecare vreme: lungimea feliei si unde incepe pe cerc
  const slices = ORDER.filter((w) => counts[w] > 0).map((w, i, used) => {
    const before = used.slice(0, i).reduce((sum, u) => sum + counts[u], 0);
    const length = (counts[w] / total) * CIRCLE;
    return { weather: w, start: (before / total) * CIRCLE, length: used.length > 1 ? length - GAP : length, delay: i * SLICE_MS };
  });

  const percent = (w: Weather) => Math.round((counts[w] / total) * 100);

  return (
    <figure className="donut">
      <div className="donut__ring">
        <svg viewBox="0 0 120 120" className="donut__svg" aria-hidden="true">
          <circle className="donut__track" cx="60" cy="60" r={RADIUS} />
          {slices.map((s) => (
            <circle
              key={s.weather}
              className="donut__slice"
              data-weather={s.weather}
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={`${s.length} ${CIRCLE}`}
              strokeDashoffset={-s.start}
              style={{ animationDelay: `${s.delay}ms` }}
            />
          ))}
        </svg>
        {/* in mijloc: vremea cea mai deasa */}
        {main && (
          <div className="donut__center">
            <span className="donut__percent">{percent(main)}%</span>
            <span className="donut__label">{t(WEATHER_TEXT[main])}</span>
          </div>
        )}
      </div>

      {/* legenda, cu procente; e si textul pentru cititoarele de ecran */}
      <figcaption>
        <ul className="donut__legend">
          {ORDER.map((w) => (
            <li key={w} data-weather={w} data-empty={counts[w] === 0}>
              <span className="donut__dot" aria-hidden="true" />
              <span>{t(WEATHER_TEXT[w])}</span>
              <span className="donut__value">{total ? percent(w) : 0}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
