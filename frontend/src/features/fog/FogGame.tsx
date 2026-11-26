import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import ZmeutArt from '../zmeut/ZmeutArt';
import './fog.css';

// Pensula: cat de lata e si cat sterge la o trecere, cand mergi incet
const BRUSH_PX = 46;
const STRENGTH = 0.32;
// peste viteza asta (px pe milisecunda) aproape ca nu mai sterge: incet merge mai bine
const FAST = 1.6;
// cat de repede revine ceata singura (din opacitate, pe secunda)
const REGROW_PER_SECOND = 0.05;
// cat de des verificam daca s-a vazut Zmeut si cat de des vibreaza telefonul
const CHECK_MS = 400;
const BUZZ_EVERY_MS = 140;
// "Sterge-o tu": cat dureaza sa se risipeasca singura
const AUTO_CLEAR_MS = 5000;

// locurile unde se poate ascunde Zmeut (in procente din scena)
const SPOTS = [
  { left: 8, top: 34 },
  { left: 46, top: 30 },
  { left: 36, top: 52 },
];

type Props = {
  onBack: () => void;
  onRestart: () => void; // ceata din nou peste tot, Zmeut in alt loc
};

// "Clear the fog": stergi incet ceata cu degetul si apare un cer linistit.
// Nu se castiga nimic. Ceata revine incet daca te opresti, ca sa poti continua cat ai nevoie.
export default function FogGame({ onBack, onRestart }: Props) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zmeutRef = useRef<HTMLDivElement>(null);
  const last = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastBuzz = useRef(0);
  const autoClear = useRef<number | null>(null); // momentul in care a inceput "sterge-o tu"
  const [spot] = useState(() => SPOTS[Math.floor(Math.random() * SPOTS.length)]);
  const [found, setFound] = useState(false);

  // ceata: desenata o data pe o panza ascunsa, apoi pusa peste scena
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    const texture = document.createElement('canvas');

    function paintTexture() {
      const w = canvas!.width;
      const h = canvas!.height;
      texture.width = w;
      texture.height = h;
      const tctx = texture.getContext('2d')!;
      const base = tctx.createLinearGradient(0, 0, 0, h);
      base.addColorStop(0, '#e7e8f0');
      base.addColorStop(1, '#cfd3e2');
      tctx.fillStyle = base;
      tctx.fillRect(0, 0, w, h);
      // pete moi, ca ceata sa nu fie plata
      for (let i = 0; i < 26; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = (60 + Math.random() * 120) * scale;
        const blob = tctx.createRadialGradient(x, y, 0, x, y, r);
        blob.addColorStop(0, Math.random() < 0.5 ? 'rgba(255,255,255,0.55)' : 'rgba(190,196,216,0.45)');
        blob.addColorStop(1, 'rgba(255,255,255,0)');
        tctx.fillStyle = blob;
        tctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }

    function resize() {
      canvas!.width = Math.round(canvas!.clientWidth * scale);
      canvas!.height = Math.round(canvas!.clientHeight * scale);
      paintTexture();
      ctx!.globalCompositeOperation = 'source-over';
      ctx!.globalAlpha = 1;
      ctx!.drawImage(texture, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let prev = performance.now();
    let lastCheck = 0;

    function tick(now: number) {
      const dt = (now - prev) / 1000;
      prev = now;

      if (autoClear.current !== null) {
        // "sterge-o tu": ceata se risipeste uniform, incet
        ctx!.globalCompositeOperation = 'destination-out';
        ctx!.globalAlpha = Math.min(1, dt / (AUTO_CLEAR_MS / 1000) * 2);
        ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
        if (now - autoClear.current > AUTO_CLEAR_MS) autoClear.current = null;
      } else {
        // ceata revine incet peste tot
        ctx!.globalCompositeOperation = 'source-over';
        ctx!.globalAlpha = Math.min(1, REGROW_PER_SECOND * dt);
        ctx!.drawImage(texture, 0, 0);
      }

      // s-a vazut Zmeut? ne uitam cat de transparenta e ceata peste el
      if (now - lastCheck > CHECK_MS && zmeutRef.current) {
        lastCheck = now;
        const box = zmeutRef.current.getBoundingClientRect();
        const area = canvas!.getBoundingClientRect();
        const x = Math.max(0, Math.round((box.left - area.left) * scale));
        const y = Math.max(0, Math.round((box.top - area.top) * scale));
        const w = Math.min(canvas!.width - x, Math.round(box.width * scale));
        const h = Math.min(canvas!.height - y, Math.round(box.height * scale));
        if (w > 0 && h > 0) {
          const data = ctx!.getImageData(x, y, w, h).data;
          let fog = 0;
          for (let i = 3; i < data.length; i += 16) fog += data[i];
          if (fog / (data.length / 16) < 255 * 0.45) setFound(true);
        }
      }

      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // o "stampila" de stergere; cu cat mergi mai incet, cu atat sterge mai mult
  function wipe(x: number, y: number, speed: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const scale = canvas.width / canvas.clientWidth;
    const strength = STRENGTH * Math.max(0.08, 1 - speed / FAST);
    const r = BRUSH_PX * scale;
    const brush = ctx.createRadialGradient(x * scale, y * scale, 0, x * scale, y * scale, r);
    brush.addColorStop(0, `rgba(0,0,0,${strength})`);
    brush.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 1;
    ctx.fillStyle = brush;
    ctx.fillRect(x * scale - r, y * scale - r, r * 2, r * 2);
  }

  function handleMove(e: PointerEvent<HTMLCanvasElement>) {
    // cu mouse-ul stergem doar cu butonul apasat; cu degetul, mereu
    if (e.pointerType === 'mouse' && e.buttons !== 1) {
      last.current = null;
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = e.timeStamp;
    const prev = last.current;

    if (!prev) {
      wipe(x, y, 0);
    } else {
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const speed = dist / Math.max(1, now - prev.time);
      // stampile dese de-a lungul drumului, ca linia sa fie continua
      const steps = Math.max(1, Math.ceil(dist / 8));
      for (let i = 1; i <= steps; i++) {
        wipe(prev.x + ((x - prev.x) * i) / steps, prev.y + ((y - prev.y) * i) / steps, speed);
      }
    }
    last.current = { x, y, time: now };

    // o vibratie fina cat stergi (doar pe telefoanele care o au)
    if (now - lastBuzz.current > BUZZ_EVERY_MS && 'vibrate' in navigator) {
      navigator.vibrate(6);
      lastBuzz.current = now;
    }
  }

  return (
    <div
      className="fog"
      // pe ecranul de joc, degetul sterge ceata, nu schimba pagina
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <h2 className="fog__title">{t('fog.title')}</h2>
      <p className="fog__hint" id="fog-hint">{t('fog.hint')}</p>

      <div className="fog__stage">
        {/* scena de sub ceata: un cer linistit */}
        <div className="fog__scene" aria-hidden="true">
          <span className="fog__sun" />
          <div className="fog__zmeut" ref={zmeutRef} data-found={found} style={{ left: `${spot.left}%`, top: `${spot.top}%` }}>
            <ZmeutArt className="fog__zmeut-art" />
            {/* norul in spatele caruia sta ascuns */}
            <svg className="fog__cloud" viewBox="0 0 200 100">
              <ellipse cx="100" cy="60" rx="60" ry="34" />
              <ellipse cx="52" cy="72" rx="44" ry="26" />
              <ellipse cx="152" cy="72" rx="48" ry="28" />
              <ellipse cx="110" cy="36" rx="40" ry="34" />
              <rect x="10" y="70" width="190" height="30" rx="15" />
            </svg>
          </div>
          <span className="fog__hill fog__hill--back" />
          <span className="fog__hill fog__hill--front" />
        </div>

        <canvas
          ref={canvasRef}
          className="fog__canvas"
          aria-label={t('fog.canvasLabel')}
          aria-describedby="fog-hint"
          onPointerDown={(e) => {
            last.current = null;
            handleMove(e);
          }}
          onPointerMove={handleMove}
          onPointerUp={() => (last.current = null)}
          onPointerLeave={() => (last.current = null)}
        />
      </div>

      <p className="fog__found" aria-live="polite">{found ? t('fog.found') : ''}</p>

      <div className="fog__actions">
        <button type="button" className="breath__button" onClick={() => (autoClear.current = performance.now())}>
          {t('fog.clearForMe')}
        </button>
        <button type="button" className="breath__button" onClick={onRestart}>
          {t('fog.again')}
        </button>
        <button type="button" className="breath__link" onClick={onBack}>
          {t('breathe.back')}
        </button>
      </div>
    </div>
  );
}
