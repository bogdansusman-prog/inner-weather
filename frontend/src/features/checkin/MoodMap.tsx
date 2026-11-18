import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { weatherOf, type Weather } from '../../api/checkins';
import { useLanguage } from '../../i18n/LanguageContext';
import { WEATHER_TEXT } from './weatherText';
import './moodmap.css';

// o pozitie pe harta: ambele valori intre -1 si 1
export type MoodPoint = { energy: number; pleasantness: number };

// cat muta o apasare de sageata punctul
const STEP = 0.1;

// tine valoarea intre -1 si 1, cu doua zecimale
function clamp(value: number) {
  return Math.max(-1, Math.min(1, Math.round(value * 100) / 100));
}

// din coordonatele punctului, pozitia lui pe ecran (in procente)
function toStyle(p: MoodPoint) {
  return { left: `${(p.pleasantness + 1) * 50}%`, top: `${(1 - p.energy) * 50}%` };
}

type Props = {
  value: MoodPoint | null;
  onChange?: (next: MoodPoint) => void; // fara onChange, harta e doar de privit
  label: string;                        // ce aude un cititor de ecran
  describedBy?: string;                 // id-ul textului cu instructiuni
};

// Harta starilor, direct pe cer: Energy in sus, Pleasant spre dreapta.
export default function MoodMap({ value, onChange, label, describedBy }: Props) {
  const { t } = useLanguage();
  const [ghost, setGhost] = useState<MoodPoint | null>(null); // punctul "fantoma" de sub mouse
  const interactive = onChange !== undefined;

  const weather = value ? weatherOf(value.energy, value.pleasantness) : null;

  // din pozitia mouse-ului sau a degetului, in valori intre -1 si 1
  function pointFromEvent(e: PointerEvent<HTMLDivElement>): MoodPoint {
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;  // 0 = stanga, 1 = dreapta
    const y = (e.clientY - box.top) / box.height;  // 0 = sus, 1 = jos
    return {
      pleasantness: clamp(x * 2 - 1), // stanga -1, dreapta +1
      energy: clamp(1 - y * 2),       // sus +1, jos -1
    };
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!onChange) return;
    // "capturam" pointerul ca punctul sa urmeze degetul si cand iese putin din harta
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(pointFromEvent(e));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!onChange) return;
    const p = pointFromEvent(e);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) onChange(p);
    else if (e.pointerType === 'mouse') setGhost(p);
  }

  // cu tastatura: sagetile muta punctul (pornesc din centru)
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!onChange) return;
    const p = value ?? { energy: 0, pleasantness: 0 };
    let next: MoodPoint | null = null;
    if (e.key === 'ArrowUp') next = { ...p, energy: clamp(p.energy + STEP) };
    if (e.key === 'ArrowDown') next = { ...p, energy: clamp(p.energy - STEP) };
    if (e.key === 'ArrowLeft') next = { ...p, pleasantness: clamp(p.pleasantness - STEP) };
    if (e.key === 'ArrowRight') next = { ...p, pleasantness: clamp(p.pleasantness + STEP) };
    if (!next) return;

    // sagetile misca punctul, nu schimba pagina
    e.preventDefault();
    e.stopPropagation();
    onChange(next);
  }

  const words: { weather: Weather; place: string }[] = [
    { weather: 'STORMY', place: 'stormy' },
    { weather: 'SUNNY', place: 'sunny' },
    { weather: 'FOGGY', place: 'foggy' },
    { weather: 'CALM', place: 'calm' },
  ];

  return (
    <div
      className="mood-map"
      data-interactive={interactive}
      role={interactive ? 'application' : 'img'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={label}
      aria-describedby={describedBy}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setGhost(null)}
      onKeyDown={handleKeyDown}
      // pe telefon: tragerea pe harta nu are voie sa schimbe pagina
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <span className="mood-map__axis mood-map__axis--x" />
      <span className="mood-map__axis mood-map__axis--y" />
      <span className="mood-map__label mood-map__label--energy">{t('axis.energy')}</span>
      <span className="mood-map__label mood-map__label--pleasant">{t('axis.pleasant')}</span>

      {words.map((w) => (
        <span
          key={w.weather}
          className={`mood-map__word mood-map__word--${w.place}`}
          data-active={weather === w.weather}
        >
          {t(WEATHER_TEXT[w.weather])}
        </span>
      ))}

      {interactive && ghost && <span className="mood-map__dot mood-map__dot--ghost" style={toStyle(ghost)} />}
      {value && <span className="mood-map__dot" style={toStyle(value)} />}
    </div>
  );
}
