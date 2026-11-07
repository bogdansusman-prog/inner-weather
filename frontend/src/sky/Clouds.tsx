import './clouds.css';

type Cloud = { x: number; y: number; size: number };
type Layer = 'far' | 'mid' | 'near';

// Pozitii fixe (in % din ecran), alese de mana ca norii sa arate compusi, nu aleatori.
// size = latimea norului, in multipli de 22vw
const LAYERS: Record<Layer, Cloud[]> = {
  far: [
    { x: 2, y: 10, size: 1 },
    { x: 34, y: 4, size: 1.2 },
    { x: 66, y: 14, size: 0.9 },
    { x: 86, y: 3, size: 1.1 },
  ],
  mid: [
    { x: -6, y: 28, size: 1.5 },
    { x: 42, y: 22, size: 1.7 },
    { x: 78, y: 34, size: 1.4 },
  ],
  near: [
    { x: -12, y: 55, size: 2.6 },
    { x: 52, y: 68, size: 3 },
  ],
};

type Props = {
  tone?: 'storm' | 'calm'; // culoarea norilor
};

export default function Clouds({ tone = 'storm' }: Props) {
  return (
    <div className={`clouds clouds--${tone}`} aria-hidden="true">
      {(Object.keys(LAYERS) as Layer[]).map((layer) => (
        <div key={layer} className={`clouds__layer clouds__layer--${layer}`}>
          {LAYERS[layer].map((c, i) => (
            <svg
              key={i}
              className="clouds__cloud"
              viewBox="0 0 200 100"
              fill="currentColor"
              style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.size * 22}vw` }}
            >
              {/* un nor = cateva elipse suprapuse peste o baza rotunjita */}
              <ellipse cx="100" cy="60" rx="60" ry="34" />
              <ellipse cx="52" cy="72" rx="44" ry="26" />
              <ellipse cx="152" cy="72" rx="48" ry="28" />
              <ellipse cx="110" cy="36" rx="40" ry="34" />
              <rect x="10" y="70" width="190" height="30" rx="15" />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}