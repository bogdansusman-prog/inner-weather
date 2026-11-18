import { useEffect, useRef, type RefObject } from 'react';
import { CometPath, drawTail, fitCanvas } from './cometDraw';

type Props = {
  target: RefObject<HTMLElement | null>; // elementul care e "capul" cometei
  className?: string;
};

// Coada de cometa care urmareste un element (in intro: punctul).
// Cand elementul sta pe loc, coada se strange singura.
export default function CometTail({ target, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const path = new CometPath();
    let box = fitCanvas(canvas, ctx);
    let frame = 0;

    const resize = () => {
      box = fitCanvas(canvas, ctx);
      path.clear();
    };

    const draw = (now: number) => {
      const el = target.current;
      ctx.clearRect(0, 0, box.width, box.height);

      if (el) {
        // centrul elementului, fata de canvas
        const r = el.getBoundingClientRect();
        const c = canvas.getBoundingClientRect();
        const visible = r.width > 0 && getComputedStyle(el).opacity !== '0';
        if (visible) {
          path.add(r.left + r.width / 2 - c.left, r.top + r.height / 2 - c.top, now);
          drawTail(ctx, path);
        } else {
          path.clear();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [target]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
