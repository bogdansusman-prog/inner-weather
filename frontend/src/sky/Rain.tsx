import { useEffect, useRef } from 'react';

type Props = {
  intensity?: number; // 0..1, cat de deasa e ploaia
  wind?: number;      // inclinarea ploii (px pe cadru, negativ = spre stanga)
  glass?: boolean;    // picaturi care se lipesc si se scurg pe "geamul" ecranului
  className?: string;
};

type Streak = { x: number; y: number; len: number; speed: number; alpha: number };
type GlassDrop = { x: number; y: number; r: number; speed: number; trail: number };

export default function Rain({ intensity = 1, wind = -2, glass = true, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // fara animatie pentru cine a oprit miscarea din sistem
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // claritate pe ecrane retina

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const newStreak = (anywhere: boolean): Streak => {
      return {
        x: Math.random() * (width + 200),
        y: anywhere ? Math.random() * height : -20 - Math.random() * 100,
        len: 10 + Math.random() * 20,
        speed: 12 + Math.random() * 10,
        alpha: 0.15 + Math.random() * 0.35,
      };
    }

    // mai putine picaturi pe telefon, ca sa ramana fluid
    const count = Math.round((width < 700 ? 120 : 260) * intensity);
    const streaks: Streak[] = Array.from({ length: count }, () => newStreak(true));
    const drops: GlassDrop[] = [];

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Ploaia: linii subtiri, oblice
      ctx.lineCap = 'round';
      ctx.lineWidth = 1;
      for (const s of streaks) {
        s.x += wind;
        s.y += s.speed;
        if (s.y > height + 20 || s.x < -50) Object.assign(s, newStreak(false));

        ctx.strokeStyle = `rgba(210, 205, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - wind * (s.len / s.speed), s.y - s.len); // coada, in directia din care vine
        ctx.stroke();
      }

      // 2. Picaturile de pe geam
      if (glass) {
        if (drops.length < 40 && Math.random() < 0.08 * intensity) {
          drops.push({ x: Math.random() * width, y: Math.random() * height * 0.7, r: 2 + Math.random() * 4, speed: 0, trail: 0 });
        }

        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i];

          // doar picaturile mari sunt destul de grele ca sa alunece
          if (d.r > 3.5) d.speed = Math.min(d.speed + 0.05, 3);
          d.y += d.speed;
          d.trail = Math.min(d.trail + d.speed, 60);

          if (d.y - d.trail > height) {
            drops.splice(i, 1);
            continue;
          }

          // dara lasata in urma
          if (d.trail > 0) {
            const g = ctx.createLinearGradient(d.x, d.y - d.trail, d.x, d.y);
            g.addColorStop(0, 'rgba(230, 228, 255, 0)');
            g.addColorStop(1, 'rgba(230, 228, 255, 0.25)');
            ctx.strokeStyle = g;
            ctx.lineWidth = d.r * 0.8;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y - d.trail);
            ctx.lineTo(d.x, d.y);
            ctx.stroke();
          }

          // picatura + reflexia de lumina din ea
          ctx.fillStyle = 'rgba(230, 228, 255, 0.35)';
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      frame = requestAnimationFrame(draw); // urmatorul cadru (~60 pe secunda)
    }

    frame = requestAnimationFrame(draw);

    // cand componenta dispare: oprim bucla si curatam
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, wind, glass]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}