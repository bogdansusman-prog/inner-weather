// Desenul cometei, folosit si pe fundalul aplicatiei (Comet.tsx),
// si in intro (CometTail.tsx), ca sa arate la fel peste tot.

export type CometSample = { x: number; y: number; t: number };

export const HISTORY_MS = 3000; // cat tinem minte din drumul cometei
export const TAIL_PX = 120;     // lungimea cozii cand cometa merge incet, in px

// Tine minte drumul cometei si cat de repede merge.
export class CometPath {
  samples: CometSample[] = [];
  speed = 0; // px/s, netezita: cometa grabita are coada mai lunga

  add(x: number, y: number, now: number) {
    const last = this.samples[this.samples.length - 1];
    if (last) {
      const dt = Math.max(1, now - last.t) / 1000;
      const v = Math.hypot(x - last.x, y - last.y) / dt;
      this.speed += (v - this.speed) * 0.08;
    }
    this.samples.push({ x, y, t: now });
    while (this.samples.length > 0 && now - this.samples[0].t > HISTORY_MS) this.samples.shift();
  }

  clear() {
    this.samples = [];
    this.speed = 0;
  }
}

// Coada: mergem inapoi pe drum pana adunam lungimea ei;
// segmentele sunt tot mai groase si mai luminoase spre cap.
// maxAgeMs: bucatile mai vechi de atat dispar, ca sa nu ramana coada "inghetata"
// cand cometa se opreste brusc (ex. picatura din intro, cand atinge apa).
export function drawTail(ctx: CanvasRenderingContext2D, path: CometPath, maxAgeMs = Infinity) {
  const trail = path.samples;
  const now = trail[trail.length - 1]?.t ?? 0;
  const tailLength = TAIL_PX + Math.min(320, path.speed * 0.4);
  ctx.lineCap = 'round';
  let walked = 0;
  for (let i = trail.length - 1; i > 0 && walked < tailLength; i--) {
    const a = trail[i - 1];
    const b = trail[i];
    const age = 1 - (now - b.t) / maxAgeMs; // 1 = proaspat, 0 = prea vechi
    if (age <= 0) break;
    const k = (1 - walked / tailLength) * Math.min(1, age); // 1 la cap, 0 la capatul cozii
    walked += Math.hypot(b.x - a.x, b.y - a.y);

    ctx.strokeStyle = `rgba(124, 108, 240, ${0.55 * k * k})`;
    ctx.lineWidth = 1 + 10 * k * k;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    // o dara alba, subtire, in mijlocul cozii
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * k * k * k})`;
    ctx.lineWidth = 0.5 + 3 * k * k;
    ctx.stroke();
  }
}

// Capul: miez alb cu aura violet.
export function drawHead(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  glow.addColorStop(0.16, 'rgba(232, 228, 255, 0.95)');
  glow.addColorStop(0.42, 'rgba(140, 124, 245, 0.35)');
  glow.addColorStop(1, 'rgba(124, 108, 240, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

// Potriveste canvas-ul cu marimea lui pe ecran (clar si pe ecrane retina).
export function fitCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}
