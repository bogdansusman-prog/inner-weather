import { useId } from 'react';

// Ax, mascota din Ax Tracker (aplicatia mea de buget), ca avatar.
// Aceeasi desenare ca acolo, dar fara animatii si fara expresiile de schimb: doar zambetul.
export default function AxArt() {
  // id-uri unice pentru gradiente: pot fi mai multe avatare Ax pe aceeasi pagina
  const id = useId();
  const skin = `${id}-skin`;
  const gill = `${id}-gill`;
  const lens = `${id}-lens`;

  return (
    <svg viewBox="4 34 212 180" className="avatar__art" aria-hidden="true">
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc3d8" />
          <stop offset="1" stopColor="#f497b8" />
        </linearGradient>
        <linearGradient id={gill} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e2558a" />
          <stop offset="1" stopColor="#f27aa7" />
        </linearGradient>
        <linearGradient id={lens} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".05" />
        </linearGradient>
      </defs>

      {/* coada si picioarele */}
      <path d="M146 176 C 172 178, 192 166, 200 148 C 186 160, 166 164, 148 160 Z" fill={`url(#${gill})`} />
      <ellipse cx="88" cy="198" rx="12" ry="6" fill="#f08ab0" />
      <ellipse cx="132" cy="198" rx="12" ry="6" fill="#f08ab0" />

      {/* corpul si bratele */}
      <ellipse cx="110" cy="166" rx="46" ry="36" fill={`url(#${skin})`} />
      <ellipse cx="110" cy="174" rx="28" ry="22" fill="#ffe1ec" />
      <ellipse cx="68" cy="166" rx="9" ry="15" fill="#f497b8" transform="rotate(20 68 166)" />
      <ellipse cx="152" cy="166" rx="9" ry="15" fill="#f497b8" transform="rotate(-20 152 166)" />

      {/* branhiile */}
      <g fill={`url(#${gill})`}>
        <path d="M58 70 C 44 52, 26 46, 20 52 C 18 60, 34 70, 56 78 Z" />
        <path d="M54 90 C 36 84, 16 86, 12 94 C 14 102, 34 100, 54 98 Z" />
        <path d="M58 108 C 42 114, 26 126, 26 134 C 32 138, 46 126, 62 116 Z" />
        <path d="M162 70 C 176 52, 194 46, 200 52 C 202 60, 186 70, 164 78 Z" />
        <path d="M166 90 C 184 84, 204 86, 208 94 C 206 102, 186 100, 166 98 Z" />
        <path d="M162 108 C 178 114, 194 126, 194 134 C 188 138, 174 126, 158 116 Z" />
      </g>
      <g fill="#ff9cc1">
        <circle cx="24" cy="54" r="5" />
        <circle cx="15" cy="94" r="5" />
        <circle cx="28" cy="132" r="5" />
        <circle cx="196" cy="54" r="5" />
        <circle cx="205" cy="94" r="5" />
        <circle cx="192" cy="132" r="5" />
      </g>

      {/* capul */}
      <ellipse cx="110" cy="92" rx="58" ry="46" fill={`url(#${skin})`} />
      <ellipse cx="96" cy="66" rx="20" ry="8" fill="#fff" opacity=".25" />
      <ellipse cx="72" cy="110" rx="9" ry="5.5" fill="#ff6f9f" opacity=".45" />
      <ellipse cx="148" cy="110" rx="9" ry="5.5" fill="#ff6f9f" opacity=".45" />

      {/* ochii */}
      <circle cx="88" cy="92" r="8" fill="#2a1b2e" />
      <circle cx="132" cy="92" r="8" fill="#2a1b2e" />
      <circle cx="91" cy="89" r="2.8" fill="#fff" />
      <circle cx="135" cy="89" r="2.8" fill="#fff" />

      {/* ochelarii rotunzi */}
      <g stroke="#c9a227" fill="none" strokeLinecap="round">
        <circle cx="88" cy="92" r="17" fill={`url(#${lens})`} strokeWidth="3.2" />
        <circle cx="132" cy="92" r="17" fill={`url(#${lens})`} strokeWidth="3.2" />
        <path d="M105 90 Q 110 85 115 90" strokeWidth="3" />
        <path d="M71 89 L 58 84" strokeWidth="2.6" />
        <path d="M149 89 L 162 84" strokeWidth="2.6" />
      </g>

      {/* zambetul */}
      <path d="M100 116 Q 110 124 120 116" stroke="#8c2f5c" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* papionul */}
      <g transform="translate(0 13)">
        <path d="M110 135 L 92 126 Q 88 135 92 144 Z" fill="#2b3a6b" />
        <path d="M110 135 L 128 126 Q 132 135 128 144 Z" fill="#2b3a6b" />
        <rect x="105" y="130" width="10" height="10" rx="3" fill="#c9a227" />
      </g>
    </svg>
  );
}
