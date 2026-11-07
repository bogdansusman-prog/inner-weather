import { useEffect, useState } from 'react';
import Stars from '../../sky/Stars';
import Clouds from '../../sky/Clouds';
import './intro.css';

// Actele intro-ului, in ordine
type Phase = 'drop' | 'waiting' | 'storm' | 'journey' | 'login';
const ORDER: Phase[] = ['drop', 'waiting', 'storm', 'journey', 'login'];

// Cat sta fiecare act inainte sa treaca singur la urmatorul (ms).
// null = asteapta o actiune (click pe Begin / login)
const DURATION: Record<Phase, number | null> = {
  drop: 2500,
  waiting: null,
  storm: 2600,
  journey: 2400,
  login: null,
};

// Actele care au inca un cer simplu (restul sunt in "lume")
const SKY_LAYERS: Phase[] = ['drop', 'journey', 'login'];

// Numele actelor inca neconstruite, afisate pe ecran
const LABEL: Record<Phase, string> = {
  drop: 'Act 1 · Picatura',
  waiting: 'Act 1 · Asteapta click',
  storm: 'Act 2 · Furtuna',
  journey: 'Act 3 · Trecerea',
  login: 'Act 4 · Login',
};

export default function Intro() {
  const [phase, setPhase] = useState<Phase>('drop');
  const [autoPlay, setAutoPlay] = useState(true);

  // true in cele 0.6s dintre click pe Begin si inceputul furtunii
  const [leaving, setLeaving] = useState(false);

  // Dupa click: punctul se incarca, camera porneste, apoi intram in furtuna
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      setLeaving(false);
      setPhase('storm');
    }, 600);
    return () => clearTimeout(timer);
  }, [leaving]);

  // Cand se schimba actul, pornim un cronometru spre actul urmator
  useEffect(() => {
    const ms = DURATION[phase];
    if (ms === null || !autoPlay) return;

    const timer = setTimeout(() => {
      const next = ORDER[ORDER.indexOf(phase) + 1];
      if (next) setPhase(next);
    }, ms);

    return () => clearTimeout(timer);
  }, [phase, autoPlay]);

  // Cat timp suntem in "lume" (noapte -> nori -> furtuna)
  const inWorld = phase === 'drop' || phase === 'waiting' || phase === 'storm';
  // eticheta "Act X" ramane doar pentru actele inca neconstruite
  const showLabel = phase === 'journey' || phase === 'login';

  return (
    <div className="intro" data-phase={phase} data-leaving={leaving}>
      {SKY_LAYERS.map((p) => (
        <div key={p} className={`intro__sky intro__sky--${p}`} data-active={p === phase} />
      ))}

      {/* Lumea prin care urcam: furtuna sus, norii la mijloc, noaptea jos */}
      <div className="intro__world">
        <section className="intro__world-storm">
          <Clouds tone="storm" />
        </section>

        <section className="intro__world-bank">
          <Clouds tone="fog" />
        </section>

        <section className="intro__world-night">
          <Stars />

          {inWorld && (
            <div className="intro__brand">
              <h1>Inner Weather</h1>
              <p>Your mood isn't good or bad. It's weather.</p>
            </div>
          )}

          {phase === 'waiting' && (
            <button className="intro__begin" onClick={() => setLeaving(true)} disabled={leaving} autoFocus>
              Begin
            </button>
          )}
        </section>
      </div>

      {/* Undele apar doar in momentul impactului */}
      {phase === 'drop' && (
        <>
          <span className="intro__ripple intro__ripple--1" />
          <span className="intro__ripple intro__ripple--2" />
          <span className="intro__ripple intro__ripple--3" />
        </>
      )}

      {/* Punctul (tu) sta fix in mijlocul ecranului; lumea se misca in jurul lui */}
      {inWorld && <span className="intro__drop" />}

      {showLabel && <p className="intro__act">{LABEL[phase]}</p>}

      {phase !== 'login' && (
        <button className="intro__skip" onClick={() => setPhase('login')}>
          Skip
        </button>
      )}

      {/* Panou de test, doar in dezvoltare (npm run dev) */}
      {import.meta.env.DEV && (
        <div className="intro__dev">
          {ORDER.map((p) => (
            <button key={p} onClick={() => setPhase(p)} data-active={p === phase}>
              {p}
            </button>
          ))}
          <label>
            <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />
            auto
          </label>
        </div>
      )}
    </div>
  );
}