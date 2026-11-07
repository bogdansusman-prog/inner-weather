import './stars.css';

type Star = { x: number; y: number; size: number; delay: number; duration: number };

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,        // pozitia pe orizontala, in %
    y: Math.random() * 100,        // pozitia pe verticala, in %
    size: 1 + Math.random() * 2,   // 1–3 px
    delay: Math.random() * 4,      // sa nu sclipeasca toate deodata
    duration: 2 + Math.random() * 3,
  }));
}

// Se genereaza o singura data, cand se incarca fisierul,
// ca stelele sa nu sara in alta pozitie la fiecare redesenare
const STARS = makeStars(90);

export default function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="stars__star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
