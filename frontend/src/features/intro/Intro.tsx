import { useEffect, useState } from 'react';
import Stars from '../../sky/Stars';
import './intro.css';

type Phase = 'drop' | 'waiting' | 'storm' | 'journey' | 'login';
const ORDER: Phase[] = ['drop', 'waiting', 'storm', 'journey', 'login'];

const DURATION: Record<Phase, number | null> = {
  drop: 2500,
  waiting: null,
  storm: 1800,
  journey: 2400,
  login: null,
};

const LABEL: Record<Phase, string> = {
  drop: 'Act 1 · Picătura',
  waiting: 'Act 1 · Așteaptă click',
  storm: 'Act 2 · Furtuna',
  journey: 'Act 3 · Trecerea',
  login: 'Act 4 · Login',
};

export default function Intro() {
  const [phase, setPhase] = useState<Phase>('drop');
  const [autoPlay, setAutoPlay] = useState(true);

    // true in cele 0.6s dintre click pe Begin si inceputul furtunii
  const [leaving, setLeaving] = useState(false);

  // Dupa click: lasam animatia de "plecare" sa se termine, apoi pornim furtuna
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      setLeaving(false);
      setPhase('storm');
    }, 600);
    return () => clearTimeout(timer);
  }, [leaving]);

  useEffect(() => {
    const ms = DURATION[phase];
    if (ms === null || !autoPlay) return;

    const timer = setTimeout(() => {
      const next = ORDER[ORDER.indexOf(phase) + 1];
      if (next) setPhase(next);
    }, ms);

    return () => clearTimeout(timer);
  }, [phase, autoPlay]);

  const showBrand = phase === 'drop' || phase === 'waiting';

  return (
    // data-phase îi spune CSS-ului în ce act suntem
    <div className="intro" data-phase={phase} data-leaving= {leaving}>
      {ORDER.map((p) => (
        <div key={p} className={`intro__sky intro__sky--${p}`} data-active={p === phase}>
          {p === 'waiting' && <Stars />}
        </div>
      ))}

      {/* Undele apar doar în momentul impactului */}
      {phase === 'drop' && (
        <>
          <span className="intro__ripple intro__ripple--1" />
          <span className="intro__ripple intro__ripple--2" />
          <span className="intro__ripple intro__ripple--3" />
        </>
      )}

      {/* Picătura (devine punctul luminos) și titlul */}
      {showBrand && (
        <>
          <span className="intro__drop" />
          <div className="intro__brand">
            <h1>Inner Weather</h1>
            <p>Your mood isn't good or bad. It's weather.</p>
          </div>
        </>
      )}

        {phase === 'waiting' && (
        <button className="intro__begin" onClick={() => setLeaving(true)} disabled={leaving} autoFocus>
          Begin
        </button>
      )}

      {/* Actele încă neconstruite își arată doar numele */}
      {!showBrand && <p className="intro__act">{LABEL[phase]}</p>}

      {phase !== 'login' && (
        <button className="intro__skip" onClick={() => setPhase('login')}>
          Skip
        </button>
      )}

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