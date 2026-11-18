import { useEffect, useRef } from 'react';
import { CometPath, drawHead, drawTail, fitCanvas } from '../../sky/cometDraw';
import { PAGE_MS } from './usePageNav';

type Point = { x: number; y: number };

// "Casa" cometei pe fiecare pagina, ca fractiune din ecran (0..1).
// In jurul ei danseaza; la schimbarea paginii zboara spre casa noua.
const HOMES: Point[] = [
  { x: 0.18, y: 0.24 }, // Check-in: sus, in stanga
  { x: 0.82, y: 0.22 }, // Home: sus, in dreapta
  { x: 0.2, y: 0.76 },  // History: jos, in stanga
  { x: 0.8, y: 0.74 },  // Games: jos, in dreapta
];

const HEAD = 26; // raza aurei capului, in px

// porneste lin si se opreste lin (ca trecerea dintre pagini)
function ease(u: number) {
  return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
}

// Cometa de pe fundal: danseaza in jurul "casei" paginii,
// iar la schimbarea paginii zboara pe un arc spre pagina noua.
export default function Comet({ page }: { page: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageRef = useRef(page);
  const posRef = useRef<Point | null>(null);
  const flightRef = useRef<{ from: Point; start: number; side: 1 | -1 } | null>(null);

  // pagina noua: zborul porneste de unde e cometa acum
  useEffect(() => {
    if (pageRef.current === page) return;
    pageRef.current = page;
    if (posRef.current) {
      flightRef.current = {
        from: { ...posRef.current },
        start: performance.now(),
        side: Math.random() < 0.5 ? 1 : -1, // arcul o ia cand intr-o parte, cand in alta
      };
    }
  }, [page]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = new CometPath();
    let box = fitCanvas(canvas, ctx);
    let frame = 0;

    const resize = () => {
      box = fitCanvas(canvas, ctx);
    };

    // dansul: sume de sinusuri cu frecvente diferite, deci o miscare care nu se repeta
    const dance = (now: number, home: Point): Point => {
      const r = Math.min(box.width, box.height) * 0.13;
      const s = now / 1000;
      return {
        x: home.x * box.width + (r * (Math.sin(s * 0.71) + 0.5 * Math.sin(s * 1.63 + 1.7))) / 1.5,
        y: home.y * box.height + (r * (Math.cos(s * 0.57 + 0.6) + 0.5 * Math.sin(s * 1.37))) / 1.5,
      };
    };

    const draw = (now: number) => {
      const home = HOMES[pageRef.current] ?? HOMES[0];
      const target = calm ? { x: home.x * box.width, y: home.y * box.height } : dance(now, home);
      let pos = target;

      // in zbor: o curba (Bezier) arcuita de la pozitia veche spre cea noua
      const flight = flightRef.current;
      if (flight && !calm) {
        const u = Math.min(1, (now - flight.start) / PAGE_MS);
        const e = ease(u);
        const mx = (flight.from.x + target.x) / 2;
        const my = (flight.from.y + target.y) / 2;
        const cx = mx - (target.y - flight.from.y) * 0.35 * flight.side;
        const cy = my + (target.x - flight.from.x) * 0.35 * flight.side;
        pos = {
          x: (1 - e) ** 2 * flight.from.x + 2 * (1 - e) * e * cx + e * e * target.x,
          y: (1 - e) ** 2 * flight.from.y + 2 * (1 - e) * e * cy + e * e * target.y,
        };
        if (u >= 1) flightRef.current = null;
      } else {
        flightRef.current = null;
      }
      posRef.current = pos;
      path.add(pos.x, pos.y, now);

      ctx.clearRect(0, 0, box.width, box.height);
      drawTail(ctx, path);
      drawHead(ctx, pos.x, pos.y, HEAD);

      frame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="shell__comet" aria-hidden="true" />;
}
