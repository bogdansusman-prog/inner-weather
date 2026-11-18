import { useEffect, useState } from 'react';
import { getMe } from '../../api/auth';
import { getCheckIns, startOfToday, type CheckIn, type Weather } from '../../api/checkins';
import { ApiError } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import Stars from '../../sky/Stars';
import CheckInPage from '../checkin/CheckInPage';
import ThankYou from '../checkin/ThankYou';
import HomePage from '../home/HomePage';
import Comet from './Comet';
import TopBar from './TopBar';
import { PAGE_MS, usePageNav } from './usePageNav';
import './shell.css';

// paginile aplicatiei, in ordinea in care apar la scroll
const PAGES: { id: string; label: TextKey }[] = [
  { id: 'checkin', label: 'nav.checkin' },
  { id: 'home', label: 'nav.home' },
  { id: 'history', label: 'nav.history' },
  { id: 'games', label: 'nav.games' },
];
const CHECKIN = 0;
const HOME = 1;

// dupa check-in-ul zilnic, cat asteptam inainte sa mergem pe Home
const AFTER_SAVE_MS = 1400;
// cat sta multumirea pe ecran; ramane si cat trecem pe Home
const THANKS_MS = 3000;

// cate milisecunde mai sunt pana la miezul noptii
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

type Props = {
  onLogout: () => void;
};

export default function Shell({ onLogout }: Props) {
  const [name, setName] = useState<string | null>(null);
  // check-in-ul zilnic: undefined = inca intrebam serverul, null = nu s-a facut azi
  const [today, setToday] = useState<CheckIn | null | undefined>(undefined);
  // creste la fiecare miez de noapte, ca sa intrebam din nou serverul
  const [day, setDay] = useState(0);

  // numele pentru avatar si meniu; daca token-ul a expirat, iesim din cont
  useEffect(() => {
    getMe()
      .then((me) => setName(me.name))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) onLogout();
      });
  }, [onLogout]);

  // s-a facut azi check-in? Intrebam serverul, deci ramane valabil si dupa logout
  // sau de pe alt dispozitiv. Primul check-in de azi e cel zilnic.
  useEffect(() => {
    let cancelled = false;
    getCheckIns(startOfToday())
      .then((list) => {
        if (!cancelled) setToday(list[0] ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) onLogout();
        else setToday(null); // serverul nu raspunde: lasam check-in-ul deschis
      });
    return () => {
      cancelled = true;
    };
  }, [day, onLogout]);

  // la miezul noptii incepe o zi noua
  useEffect(() => {
    const timer = setTimeout(() => setDay((d) => d + 1), msUntilMidnight() + 1000);
    return () => clearTimeout(timer);
  }, [day]);

  // pana aflam raspunsul, aratam doar cerul si bara de sus
  if (today === undefined) {
    return (
      <div className="shell" data-page="home">
        <div className="shell__sky" aria-hidden="true" />
        <TopBar name={name} onLogout={onLogout} />
      </div>
    );
  }

  return <ShellPages name={name} today={today} onCheckedIn={setToday} onLogout={onLogout} />;
}

type PagesProps = {
  name: string | null;
  today: CheckIn | null;
  onCheckedIn: (checkIn: CheckIn) => void;
  onLogout: () => void;
};

// Paginile propriu-zise. Pornim pe Check-in doar daca nu s-a facut azi.
function ShellPages({ name, today, onCheckedIn, onLogout }: PagesProps) {
  const { t } = useLanguage();
  const { index, goTo, handlers } = usePageNav(PAGES.length, today ? HOME : CHECKIN);
  // vremea check-in-ului zilnic abia salvat: cat timp e setata, aratam multumirea
  const [thanks, setThanks] = useState<Weather | null>(null);

  // dupa check-in-ul zilnic: multumirea apare, iar dupa cateva clipe mergem singuri pe Home
  function handleSaved(checkIn: CheckIn) {
    setThanks(checkIn.weather);
    window.setTimeout(() => setThanks(null), THANKS_MS);
    window.setTimeout(() => {
      onCheckedIn(checkIn);
      goTo(HOME);
    }, AFTER_SAVE_MS);
  }

  // un check-in adaugat din Home: daca e primul de azi, el e cel zilnic
  function handleAdded(checkIn: CheckIn) {
    if (!today) onCheckedIn(checkIn);
  }

  return (
    <div className="shell" data-page={PAGES[index].id} {...handlers}>
      {/* cerul se schimba de la o pagina la alta, ca o zi intreaga */}
      <div className="shell__sky" aria-hidden="true">
        <div className="shell__stars">
          <Stars />
        </div>
      </div>
      <Comet page={index} />

      <TopBar name={name} onLogout={onLogout} />

      <ul className="shell__chapters">
        {PAGES.map((page, i) => (
          <li key={page.id}>
            <button
              type="button"
              className="shell__chapter"
              aria-current={i === index}
              onClick={() => goTo(i)}
            >
              {t(page.label)}
            </button>
          </li>
        ))}
      </ul>

      {/* banda cu toate paginile; o mutam in sus cu cate un ecran */}
      <div
        className="shell__track"
        style={{ translate: `0 ${-index * 100}dvh`, transitionDuration: `${PAGE_MS}ms` }}
      >
        {PAGES.map((page, i) => (
          // inert: paginile care nu se vad nu pot primi focus sau click
          <section key={page.id} id={page.id} className="shell__page" inert={i !== index}>
            {page.id === 'checkin' ? (
              // key: o zi noua (sau un check-in nou) porneste pagina de la zero
              <CheckInPage key={today?.id ?? 'open'} today={today} onSaved={handleSaved} />
            ) : page.id === 'home' ? (
              // key: dupa check-in-ul zilnic, Home se reincarca cu el
              <HomePage key={today?.id ?? 'open'} name={name} onAdded={handleAdded} />
            ) : (
              <h2 className="shell__placeholder">{t(page.label)}</h2>
            )}
          </section>
        ))}
      </div>

      {thanks && <ThankYou weather={thanks} durationMs={THANKS_MS} />}
    </div>
  );
}
