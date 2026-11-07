// Drumul punctului in Actul 3: o curba lina prin cele 4 vremi, fara opriri.
//
// Punctele prin care trece (relativ la centrul ecranului):
//   centru -> Stormy (stanga sus) -> Foggy (stanga jos) -> Calm (dreapta jos) -> Sunny (dreapta sus)
// Ajunge in fiecare vreme la 25%, 50%, 75% si 100% din durata actului.
// Aceleasi procente sunt folosite in intro.css pentru cer si pentru cuvinte.

type Point = [number, number];

// Pozitia unei vremi pe harta, in procente din ecran (folosita si in CSS: 24vw, 20vh)
export const MAP_X = 0.24;
export const MAP_Y = 0.2;

// Curba Catmull-Rom: trece exact prin puncte si le uneste cu arce line
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function journeyKeyframes(width: number, height: number): Keyframe[] {
  const x = width * MAP_X;
  const y = height * MAP_Y;

  const points: Point[] = [
    [0, 0],   // centru
    [-x, -y], // Stormy
    [-x, y],  // Foggy
    [x, y],   // Calm
    [x, -y],  // Sunny
  ];
  // capetele se dubleaza, ca si curba sa inceapa si sa se termine exact in ele
  const pts: Point[] = [points[0], ...points, points[points.length - 1]];

  const segments = points.length - 1; // 4
  const samples = 30;                 // cadre pe segment: destule ca miscarea sa fie lina
  const frames: Keyframe[] = [];

  for (let seg = 0; seg < segments; seg++) {
    const [p0, p1, p2, p3] = [pts[seg], pts[seg + 1], pts[seg + 2], pts[seg + 3]];

    for (let i = seg === 0 ? 0 : 1; i <= samples; i++) {
      const s = i / samples; // cat din segment am parcurs (0..1)

      // primul segment porneste lin, ultimul se opreste lin; restul au viteza constanta
      let tau = s;
      if (seg === 0) tau = Math.sqrt(s);
      if (seg === segments - 1) tau = 1 - Math.sqrt(1 - s);

      const px = catmullRom(p0[0], p1[0], p2[0], p3[0], s);
      const py = catmullRom(p0[1], p1[1], p2[1], p3[1], s);

      frames.push({
        translate: `${px.toFixed(1)}px ${py.toFixed(1)}px`,
        offset: (seg + tau) / segments,
      });
    }
  }

  return frames;
}
