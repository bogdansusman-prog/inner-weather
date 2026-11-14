import { useLanguage } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import { PAGE_MS, usePageNav } from './usePageNav';
import './shell.css';

// paginile aplicatiei, in ordinea in care apar la scroll
const PAGES: { id: string; label: TextKey }[] = [
  { id: 'checkin', label: 'nav.checkin' },
  { id: 'home', label: 'nav.home' },
  { id: 'history', label: 'nav.history' },
  { id: 'games', label: 'nav.games' },
];

export default function Shell() {
  const { t } = useLanguage();

  // index = pagina pe care esti; goTo(i) te duce la pagina i
  const { index, goTo, handlers } = usePageNav(PAGES.length);

  return (
    <div className="shell" {...handlers}>
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
            <h2 className="shell__placeholder">{t(page.label)}</h2>
          </section>
        ))}
      </div>
    </div>
  );
}
