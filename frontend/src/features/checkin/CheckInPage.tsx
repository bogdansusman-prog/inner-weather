import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { saveCheckIn, weatherOf, type CheckIn, type Weather } from '../../api/checkins';
import { ApiError } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import './checkin.css';

// o pozitie pe harta: ambele valori intre -1 si 1
type Point = { energy: number; pleasantness: number };

// cat muta o apasare de sageata punctul
const STEP = 0.1;

// textul fiecarei vremi in dictionar
const WEATHER_TEXT: Record<Weather, TextKey> = {
  SUNNY: 'weather.sunny',
  STORMY: 'weather.stormy',
  CALM: 'weather.calm',
  FOGGY: 'weather.foggy',
};

// tine valoarea intre -1 si 1, cu doua zecimale
function clamp(value: number) {
  return Math.max(-1, Math.min(1, Math.round(value * 100) / 100));
}

export default function CheckInPage() {
  const { t } = useLanguage();
  const [point, setPoint] = useState<Point | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<CheckIn | null>(null);
  const [error, setError] = useState<string | null>(null);

  // vremea punctului ales (null cat timp nu s-a ales nimic)
  const weather = point ? weatherOf(point.energy, point.pleasantness) : null;

  // orice mutare a punctului inseamna un check-in nou, inca nesalvat
  function moveTo(next: Point) {
    setPoint(next);
    setSaved(null);
    setError(null);
  }

  // din pozitia mouse-ului sau a degetului, in valori intre -1 si 1
  function pointFromEvent(e: PointerEvent<HTMLDivElement>): Point {
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;  // 0 = stanga, 1 = dreapta
    const y = (e.clientY - box.top) / box.height;  // 0 = sus, 1 = jos
    return {
      pleasantness: clamp(x * 2 - 1), // stanga -1, dreapta +1
      energy: clamp(1 - y * 2),       // sus +1, jos -1
    };
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    // "capturam" pointerul ca punctul sa urmeze degetul si cand iese putin din harta
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(pointFromEvent(e));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(pointFromEvent(e));
  }

  // cu tastatura: sagetile muta punctul (pornesc din centru)
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const p = point ?? { energy: 0, pleasantness: 0 };
    let next: Point | null = null;
    if (e.key === 'ArrowUp') next = { ...p, energy: clamp(p.energy + STEP) };
    if (e.key === 'ArrowDown') next = { ...p, energy: clamp(p.energy - STEP) };
    if (e.key === 'ArrowLeft') next = { ...p, pleasantness: clamp(p.pleasantness - STEP) };
    if (e.key === 'ArrowRight') next = { ...p, pleasantness: clamp(p.pleasantness + STEP) };
    if (!next) return;

    // sagetile misca punctul, nu schimba pagina
    e.preventDefault();
    e.stopPropagation();
    moveTo(next);
  }

  async function handleSave() {
    if (!point) return;
    setSaving(true);
    setError(null);
    try {
      setSaved(await saveCheckIn(point.energy, point.pleasantness));
    } catch (err) {
      if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        setError(t('checkin.offline'));
      } else {
        setError(t('checkin.error'));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="checkin" data-weather={weather ?? 'NONE'}>
      <div className="checkin__sky" aria-hidden="true" />

      <h2 className="checkin__question">{t('checkin.question')}</h2>
      <p className="checkin__hint" id="checkin-hint">{t('checkin.hint')}</p>

      <div
        className="checkin__map"
        tabIndex={0}
        aria-label={t('checkin.mapLabel')}
        aria-describedby="checkin-hint"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        // pe telefon: tragerea pe harta nu are voie sa schimbe pagina
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <span className="checkin__axis checkin__axis--x" />
        <span className="checkin__axis checkin__axis--y" />
        <span className="checkin__label checkin__label--energy">{t('axis.energy')}</span>
        <span className="checkin__label checkin__label--pleasant">{t('axis.pleasant')}</span>

        <span className="checkin__word checkin__word--stormy" data-active={weather === 'STORMY'}>{t('weather.stormy')}</span>
        <span className="checkin__word checkin__word--sunny" data-active={weather === 'SUNNY'}>{t('weather.sunny')}</span>
        <span className="checkin__word checkin__word--foggy" data-active={weather === 'FOGGY'}>{t('weather.foggy')}</span>
        <span className="checkin__word checkin__word--calm" data-active={weather === 'CALM'}>{t('weather.calm')}</span>

        {point && (
          <span
            className="checkin__dot"
            style={{
              left: `${(point.pleasantness + 1) * 50}%`,
              top: `${(1 - point.energy) * 50}%`,
            }}
          />
        )}
      </div>

      <div className="checkin__footer" aria-live="polite">
        <p className="checkin__weather">{weather ? t(WEATHER_TEXT[weather]) : ''}</p>

        {saved ? (
          <p className="checkin__saved">{t('checkin.saved')}</p>
        ) : (
          <button type="button" className="checkin__save" disabled={!point || saving} onClick={handleSave}>
            {saving ? t('checkin.saving') : t('checkin.save')}
          </button>
        )}

        {error && <p className="checkin__error" role="alert">{error}</p>}
      </div>
    </div>
  );
}