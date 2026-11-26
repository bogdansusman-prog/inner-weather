import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import { phaseAt, type Pattern, type Phase } from './patterns';

// ritmul: "mai rar" lungeste fiecare faza, "mai repede" o scurteaza
type Pace = 'slower' | 'normal' | 'faster';
const PACE_FACTOR: Record<Pace, number> = { slower: 1.25, normal: 1, faster: 0.8 };

const PHASE_TEXT: Record<Phase, TextKey> = {
  in: 'breathe.in',
  out: 'breathe.out',
  hold: 'breathe.hold',
};

// cat de mic e cercul la capatul expiratiei (1 = plin)
const MIN_SCALE = 0.55;
// vibratia scurta la fiecare faza noua (doar pe telefoanele care o au)
const BUZZ_MS = 25;

type Props = {
  pattern: Pattern;
  onDone: () => void;
  onStop: () => void;
  onNotHelping: () => void;
};

// O sesiune de respiratie: cercul creste la inspir si se strange la expir.
export default function BreathSession({ pattern, onDone, onStop, onNotHelping }: Props) {
  const { t } = useLanguage();
  const [pace, setPace] = useState<Pace>('normal');
  // doua ceasuri: cel real (cat a trecut) si cel al respiratiei (incetinit sau grabit de ritm)
  const [clock, setClock] = useState({ real: 0, breath: 0 });

  // bucla vede mereu ritmul si onDone de acum, fara sa fie repornita
  const paceRef = useRef(pace);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    paceRef.current = pace;
    onDoneRef.current = onDone;
  });

  const total = pattern.minutes * 60;

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let real = 0;
    let breath = 0;
    let lastPhase: Phase | null = null;

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      real += dt;
      breath += dt / PACE_FACTOR[paceRef.current];

      // la fiecare faza noua: o vibratie scurta, ca sa poti tine ochii inchisi
      const phase = phaseAt(pattern, breath).phase;
      if (lastPhase !== null && phase !== lastPhase && 'vibrate' in navigator) navigator.vibrate(BUZZ_MS);
      lastPhase = phase;

      if (real >= total) {
        onDoneRef.current();
        return;
      }
      setClock({ real, breath });
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [pattern, total]);

  const { phase, progress, secondsLeft } = phaseAt(pattern, clock.breath);
  // marimea cercului: creste la inspir, sta la tinut, scade la expir
  const scale =
    phase === 'in'
      ? MIN_SCALE + (1 - MIN_SCALE) * progress
      : phase === 'out'
        ? 1 - (1 - MIN_SCALE) * progress
        : 1;

  const left = Math.max(0, Math.ceil(total - clock.real));
  const leftText = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;

  return (
    <div className="breath">
      <div className="breath__stage" data-phase={phase}>
        <span className="breath__ring" aria-hidden="true" />
        <span className="breath__circle" style={{ scale: String(scale) }} aria-hidden="true" />
        {/* textul se schimba doar la faza noua, ca cititoarele de ecran sa nu vorbeasca continuu */}
        <p className="breath__phase" aria-live="polite">
          {t(PHASE_TEXT[phase])}
        </p>
        <p className="breath__count" aria-hidden="true">
          {Math.ceil(secondsLeft * PACE_FACTOR[pace])}
        </p>
      </div>

      <p className="breath__left">{t('breathe.left').replace('{t}', leftText)}</p>

      <div className="breath__pace" role="group" aria-label={t('breathe.pace')}>
        {(['slower', 'normal', 'faster'] as const).map((p) => (
          <button key={p} type="button" className="breath__chip" aria-pressed={pace === p} onClick={() => setPace(p)}>
            {t(`breathe.${p}`)}
          </button>
        ))}
      </div>

      <p className="breath__dizzy">{t('breathe.dizzy')}</p>

      <div className="breath__actions">
        <button type="button" className="breath__button" onClick={onStop}>
          {t('breathe.stop')}
        </button>
        <button type="button" className="breath__link" onClick={onNotHelping}>
          {t('breathe.notHelping')}
        </button>
      </div>
    </div>
  );
}
