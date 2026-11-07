import { useEffect, useState } from 'react';
import './intro.css';

// Actele intro-ului, în ordine
type Phase = 'drop' | 'waiting' | 'storm' | 'journey' | 'login';
const ORDER: Phase[] = ['drop', 'waiting', 'storm', 'journey', 'login'];

// Cat sta fiecare act inainte sa treaca singur la urmatorul (in milisecunde).
// null = nu trece singur, asteapta o actiune (click pe Begin / login).
const DURATION: Record<Phase, number | null> = {
  drop: 2500,
  waiting: null,
  storm: 1800,
  journey: 2400,
  login: null,
};

// Numele afisate deocamdata pe ecran, ca sa vezi in ce act esti
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

  // Cand se schimba actul, porneste un cronometru spre actul urmator
  useEffect(() => {
    const ms = DURATION[phase];
    if (ms === null || !autoPlay) return;

    const timer = setTimeout(() => {
      const next = ORDER[ORDER.indexOf(phase) + 1];
      if (next) setPhase(next);
    }, ms);

    // Daca actul se schimba inainte sa expire, oprim cronometrul vechi
    return () => clearTimeout(timer);
  }, [phase, autoPlay]);

  return (
    <div className="intro">
      {/* Cate un strat de cer pentru fiecare act; doar cel activ e vizibil */}
      {ORDER.map((p) => (
        <div key={p} className={`intro__sky intro__sky--${p}`} data-active={p === phase} />
      ))}

      <div className="intro__stage">
        <p className="intro__act">{LABEL[phase]}</p>

        {phase === 'waiting' && (
          <button className="intro__begin" onClick={() => setPhase('storm')}>
            Begin
          </button>
        )}
      </div>

      {phase !== 'login' && (
        <button className="intro__skip" onClick={() => setPhase('login')}>
          Skip
        </button>
      )}

      {/* Panou de test, apare doar în dezvoltare (npm run dev), nu in aplicatia finala */}
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