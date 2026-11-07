import { useEffect, useRef, useState } from 'react';
import Stars from '../../sky/Stars';
import Clouds from '../../sky/Clouds';
import Rain from '../../sky/Rain';
import LoginCard from '../auth/LoginCard';
import { journeyKeyframes } from './journeyPath';
import './intro.css';

// Actele intro-ului, in ordine
type Phase = 'drop' | 'waiting' | 'storm' | 'journey' | 'login';
const ORDER: Phase[] = ['drop', 'waiting', 'storm', 'journey', 'login'];

// Cat sta fiecare act inainte sa treaca singur la urmatorul (ms).
// null = asteapta o actiune (click pe Begin / login)
// Durata Actului 3; trebuie sa fie aceeasi cu cea din intro.css (4s)
const JOURNEY_MS = 4000;

const DURATION: Record<Phase, number | null> = {
  drop: 2500,
  waiting: null,
  storm: 2800,
  journey: JOURNEY_MS,
  login: null,
};

// Culorile curcubeului, de la exterior spre interior
const RAINBOW = ['#f78fb3', '#ffb38a', '#ffc857', '#7ddcc0', '#7fd1f5', '#a29bfe'];

// Un arc de curcubeu: semicerc cu centrul jos, la mijloc
function rainbowArc(i: number) {
  const r = 420 - i * 24;
  return `M ${500 - r} 500 A ${r} ${r} 0 0 1 ${500 + r} 500`;
}

const SEEN_KEY = 'inner-weather:intro-seen';

// De unde incepe intro-ul: complet la prima vizita, direct la login dupa.
// In dezvoltare (npm run dev) il aratam mereu complet, ca sa-l putem testa.
function startPhase(): Phase {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'login';
    if (!import.meta.env.DEV && localStorage.getItem(SEEN_KEY)) return 'login';
  } catch {
    // fara localStorage (ex. fereastra privata): aratam intro-ul complet
  }
  return 'drop';
}

export default function Intro() {
  const [phase, setPhase] = useState<Phase>(startPhase);

  // true in cele 0.6s dintre click pe Begin si inceputul furtunii
  const [leaving, setLeaving] = useState(false);

  // Punctul: il miscam din cod in Actul 3, pe o curba lina
  const dotRef = useRef<HTMLSpanElement>(null);

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
    if (ms === null) return;

    const timer = setTimeout(() => {
      const next = ORDER[ORDER.indexOf(phase) + 1];
      if (next) setPhase(next);
    }, ms);

    return () => clearTimeout(timer);
  }, [phase]);

  // Actul 3: punctul aluneca pe harta fara opriri (Web Animations API).
  // CSS nu poate calcula o curba, asa ca generam cadrele in journeyPath.ts.
  useEffect(() => {
    if (phase !== 'journey') return;
    const dot = dotRef.current;
    if (!dot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const animation = dot.animate(journeyKeyframes(window.innerWidth, window.innerHeight), {
      duration: JOURNEY_MS,
      fill: 'forwards',
    });

    // la schimbarea actului oprim animatia, ca CSS-ul sa preia punctul de unde a ramas
    return () => animation.cancel();
  }, [phase]);

  // Am ajuns la login: data viitoare sarim direct aici
  useEffect(() => {
    if (phase !== 'login') return;
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      // nu e grav: intro-ul va rula din nou data viitoare
    }
  }, [phase]);

  // Noaptea -> norii -> furtuna
  const inWorld = phase === 'drop' || phase === 'waiting' || phase === 'storm';
  // Cerul care se insenineaza in trecere si ramane senin la login
  const inDay = phase === 'journey' || phase === 'login';

  return (
    <div className="intro" data-phase={phase} data-leaving={leaving}>
      {/* Fundalul negru de la inceput */}
      <div className="intro__sky intro__sky--drop" data-active={phase === 'drop'} />

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

      {/* Ziua: straturi de cer care apar unul peste altul pe masura ce punctul trece */}
      <div className="intro__day" data-active={inDay} aria-hidden="true">
        {/* un singur cer ale carui culori se transforma continuu */}
        <div className="intro__day-sky" />
        <div className="intro__haze" />
        <div className="intro__day-clouds">
          <Clouds tone="calm" />
        </div>
        <div className="intro__sun" />
        <svg className="intro__rainbow" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax meet">
          {RAINBOW.map((color, i) => (
            <path key={color} d={rainbowArc(i)} stroke={color} pathLength={1} style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </svg>
      </div>

      {/* Fulgerul: lumina pe tot cerul + trasnetul */}
      {phase === 'storm' && (
        <>
          <span className="intro__lightning" />
          <svg className="intro__bolt" viewBox="0 0 200 350" aria-hidden="true">
            <polyline points="120,0 95,90 130,95 85,210 120,215 70,350" />
          </svg>
        </>
      )}

      {/* Ploaia incepe in furtuna si se opreste in trecere */}
      {(phase === 'storm' || phase === 'journey') && <Rain className="intro__rain" />}

      {/* Harta starilor: doua axe si patru vremi, punctul trece prin toate */}
      {inDay && (
        <div className="intro__map" aria-hidden="true">
          <span className="intro__axis intro__axis--x" />
          <span className="intro__axis intro__axis--y" />
          <span className="intro__axis-label intro__axis-label--energy">Energy</span>
          <span className="intro__axis-label intro__axis-label--pleasant">Pleasant</span>
          <span className="intro__word intro__word--stormy">Stormy</span>
          <span className="intro__word intro__word--foggy">Foggy</span>
          <span className="intro__word intro__word--calm">Calm</span>
          <span className="intro__word intro__word--sunny">Sunny</span>
        </div>
      )}

      {/* Undele apar doar in momentul impactului */}
      {phase === 'drop' && (
        <>
          <span className="intro__ripple intro__ripple--1" />
          <span className="intro__ripple intro__ripple--2" />
          <span className="intro__ripple intro__ripple--3" />
        </>
      )}

      {/* Punctul (tu): cade, respira, urca, traverseaza harta si devine cardul de login */}
      <span className="intro__drop" ref={dotRef} />

      {/* Actul 4: cardul de login creste din punct */}
      {phase === 'login' && (
        <div className="intro__login">
          <p className="intro__slogan">Every storm passes.</p>
          <LoginCard />
        </div>
      )}

      {phase !== 'login' && (
        <button className="intro__skip" onClick={() => setPhase('login')}>
          Skip
        </button>
      )}

    </div>
  );
}
