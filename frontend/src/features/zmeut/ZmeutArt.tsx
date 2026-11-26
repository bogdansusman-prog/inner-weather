import { useId } from 'react';

// Zmeut, puiul de zmeu din Inner Weather.
// Desenul e generat din dragon.svg; culorile si formele se schimba acolo.
export default function ZmeutArt({ className }: { className?: string }) {
  // id-uri unice pentru gradiente: pot fi mai multi Zmeut pe aceeasi pagina
  const uid = useId();

  return (
    <svg viewBox="0 -30 440 510" className={className} aria-hidden="true">
  <defs>
    <radialGradient id={`${uid}-skin`} cx="45%" cy="35%" r="70%">
      <stop offset="0" stopColor="#78c06f"/>
      <stop offset="0.6" stopColor="#4f9c5a"/>
      <stop offset="1" stopColor="#3a7d47"/>
    </radialGradient>
    <linearGradient id={`${uid}-horn`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6fb46a"/>
      <stop offset="1" stopColor="#3a7d47"/>
    </linearGradient>
    <linearGradient id={`${uid}-belly`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c9ec97"/>
      <stop offset="1" stopColor="#9fd67a"/>
    </linearGradient>
    <linearGradient id={`${uid}-muzzle`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7cc46f"/>
      <stop offset="1" stopColor="#a6e07c"/>
    </linearGradient>
    <linearGradient id={`${uid}-wing`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#a8dd8c"/>
      <stop offset="1" stopColor="#6fb46a"/>
    </linearGradient>
    <radialGradient id={`${uid}-cloud`} cx="40%" cy="35%" r="70%">
      <stop offset="0" stopColor="#ffffff"/>
      <stop offset="1" stopColor="#dfe8f5"/>
    </radialGradient>
    <radialGradient id={`${uid}-blush`}>
      <stop offset="0" stopColor="#ffb3bd" stopOpacity=".55"/>
      <stop offset="1" stopColor="#ffb3bd" stopOpacity="0"/>
    </radialGradient>
  </defs>

  

  {/* coada: se onduleaza spre dreapta si se termina cu un norisor */}
  <path d="M285 420 C 340 430, 378 400, 372 360 C 368 330, 338 322, 330 344 C 324 362, 350 370, 356 352"
        fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="30" strokeLinecap="round"/>
  <path d="M285 420 C 340 430, 378 400, 372 360" fill="none" stroke="#a6e07c" strokeWidth="8" strokeLinecap="round" opacity=".55"/>
  <g fill="#3a7d47">
    <path d="M330 412 l8 -18 l6 20 z"/>
    <path d="M360 392 l14 -10 l-2 20 z"/>
  </g>
  <g fill={`url(#${uid}-cloud)`} stroke="#c6d3e8" strokeWidth="2">
    <circle cx="352" cy="344" r="13"/>
    <circle cx="368" cy="338" r="16"/>
    <circle cx="384" cy="346" r="12"/>
    <rect x="344" y="344" width="48" height="14" rx="7"/>
  </g>

  {/* aripioarele, in spate */}
  <path d="M150 300 C 110 260, 70 262, 58 290 C 78 286, 86 300, 76 318 C 96 308, 108 322, 104 340 C 122 326, 140 330, 150 340 Z" fill={`url(#${uid}-wing)`} stroke="#3a7d47" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M290 300 C 330 260, 370 262, 382 290 C 362 286, 354 300, 364 318 C 344 308, 332 322, 336 340 C 318 326, 300 330, 290 340 Z" fill={`url(#${uid}-wing)`} stroke="#3a7d47" strokeWidth="3" strokeLinejoin="round"/>
  <path d="M150 300 L 70 292 M150 318 L 92 318 M150 334 L 110 338" stroke="#3a7d47" strokeWidth="2" opacity=".5"/>
  <path d="M290 300 L 370 292 M290 318 L 348 318 M290 334 L 330 338" stroke="#3a7d47" strokeWidth="2" opacity=".5"/>

  {/* corpul */}
  <ellipse cx="220" cy="372" rx="92" ry="92" fill={`url(#${uid}-skin)`} stroke="#2f6b3b" strokeWidth="2.5"/>
  <ellipse cx="220" cy="388" rx="58" ry="70" fill={`url(#${uid}-belly)`}/>
  <g stroke="#7fbf62" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".8">
    <path d="M176 360 Q 220 372 264 360"/>
    <path d="M168 386 Q 220 400 272 386"/>
    <path d="M172 412 Q 220 426 268 412"/>
    <path d="M184 436 Q 220 448 256 436"/>
  </g>

  {/* picioarele */}
  <g>
    <ellipse cx="172" cy="458" rx="34" ry="20" fill="#4f9c5a" stroke="#2f6b3b" strokeWidth="2.5"/>
    <ellipse cx="268" cy="458" rx="34" ry="20" fill="#4f9c5a" stroke="#2f6b3b" strokeWidth="2.5"/>
    <g fill="#f4f0d8">
      <ellipse cx="152" cy="468" rx="6" ry="5"/><ellipse cx="168" cy="472" rx="6" ry="5"/><ellipse cx="184" cy="470" rx="6" ry="5"/>
      <ellipse cx="256" cy="470" rx="6" ry="5"/><ellipse cx="272" cy="472" rx="6" ry="5"/><ellipse cx="288" cy="468" rx="6" ry="5"/>
    </g>
  </g>

  {/* bratele, care tin un norisor la piept */}
  <g fill="none" strokeLinecap="round">
    <path d="M146 352 C 150 384, 176 398, 196 392" stroke="#2f6b3b" strokeWidth="31"/>
    <path d="M294 352 C 290 384, 264 398, 244 392" stroke="#2f6b3b" strokeWidth="31"/>
    <path d="M146 352 C 150 384, 176 398, 196 392" stroke="#62ad64" strokeWidth="26"/>
    <path d="M294 352 C 290 384, 264 398, 244 392" stroke="#62ad64" strokeWidth="26"/>
  </g>
  <g fill={`url(#${uid}-cloud)`} stroke="#c6d3e8" strokeWidth="2.5">
    <circle cx="204" cy="382" r="17"/>
    <circle cx="226" cy="372" r="22"/>
    <circle cx="246" cy="384" r="16"/>
    <rect x="190" y="382" width="70" height="20" rx="10"/>
  </g>
  <g fill="#f4f0d8">
    <circle cx="194" cy="398" r="5"/><circle cx="202" cy="402" r="5"/>
    <circle cx="246" cy="402" r="5"/><circle cx="254" cy="398" r="5"/>
  </g>

  {/* coarnele ramificate, mari, groase si lucioase, cu varful rasucit */}
  <g transform="translate(176 112) scale(1.4) translate(-176 -112)">
    <g fill={`url(#${uid}-horn)`} stroke="#2f6b3b" strokeWidth="2" strokeLinejoin="round">
    <path d="M150 116 C 138 86, 136 58, 150 40 C 162 26, 184 30, 180 48 C 168 46, 160 56, 164 72 C 168 88, 178 100, 190 106 Z"/>
    <path d="M160 80 C 172 62, 196 58, 206 72 C 200 78, 196 86, 196 96 C 188 88, 176 86, 166 92 Z"/>
    </g>
    <g fill="#ffffff" opacity=".45">
    <ellipse cx="152" cy="58" rx="4" ry="12" transform="rotate(-10 152 58)"/>
    <ellipse cx="186" cy="68" rx="7" ry="3" transform="rotate(-20 186 68)"/>
    </g>
  </g>
  <g transform="translate(264 112) scale(1.4) translate(-264 -112)">
    <g fill={`url(#${uid}-horn)`} stroke="#2f6b3b" strokeWidth="2" strokeLinejoin="round">
    <path d="M290 116 C 302 86, 304 58, 290 40 C 278 26, 256 30, 260 48 C 272 46, 280 56, 276 72 C 272 88, 262 100, 250 106 Z"/>
    <path d="M280 80 C 268 62, 244 58, 234 72 C 240 78, 244 86, 244 96 C 252 88, 264 86, 274 92 Z"/>
    </g>
    <g fill="#ffffff" opacity=".45">
    <ellipse cx="288" cy="58" rx="4" ry="12" transform="rotate(10 288 58)"/>
    <ellipse cx="254" cy="68" rx="7" ry="3" transform="rotate(20 254 68)"/>
    </g>
  </g>

  {/* urechile-aripioara */}
  <path d="M118 160 C 92 146, 74 130, 64 108 C 60 140, 74 172, 104 192 Z" fill={`url(#${uid}-horn)`} stroke="#2f6b3b" strokeWidth="2.5" strokeLinejoin="round"/>
  <path d="M322 160 C 348 146, 366 130, 376 108 C 380 140, 366 172, 336 192 Z" fill={`url(#${uid}-horn)`} stroke="#2f6b3b" strokeWidth="2.5" strokeLinejoin="round"/>

  {/* tepii de pe obraji */}
  <g fill="#4f9c5a" stroke="#2f6b3b" strokeWidth="2">
    <ellipse cx="96" cy="208" rx="16" ry="12"/><ellipse cx="92" cy="236" rx="16" ry="12"/><ellipse cx="100" cy="262" rx="14" ry="11"/>
    <ellipse cx="344" cy="208" rx="16" ry="12"/><ellipse cx="348" cy="236" rx="16" ry="12"/><ellipse cx="340" cy="262" rx="14" ry="11"/>
  </g>

  {/* capul */}
  <circle cx="220" cy="200" r="118" fill={`url(#${uid}-skin)`} stroke="#2f6b3b" strokeWidth="2.5"/>
  <ellipse cx="170" cy="128" rx="34" ry="16" fill="#ffffff" opacity=".3" transform="rotate(-18 170 128)"/>

  {/* tepii de pe frunte */}
  <g fill="#4f9c5a" stroke="#2f6b3b" strokeWidth="2">
    <path d="M220 74 C 210 80, 208 96, 220 100 C 232 96, 230 80, 220 74 Z"/>
    <path d="M220 110 C 213 114, 212 126, 220 128 C 228 126, 227 114, 220 110 Z"/>
  </g>
  <g fill="#5aa863" opacity=".9">
    <circle cx="252" cy="116" r="6"/><circle cx="266" cy="122" r="5"/><circle cx="256" cy="132" r="5"/>
  </g>

  {/* sprancenele */}
  <path d="M146 160 C 160 148, 184 152, 202 170" fill="none" stroke="#2f6b3b" strokeWidth="13" strokeLinecap="round"/>
  <path d="M294 160 C 280 148, 256 152, 238 170" fill="none" stroke="#2f6b3b" strokeWidth="13" strokeLinecap="round"/>

  {/* ochii */}
  <g>
    <ellipse cx="175" cy="208" rx="26" ry="23" fill="#ffffff"/>
    <ellipse cx="265" cy="208" rx="26" ry="23" fill="#ffffff"/>
    <circle cx="178" cy="210" r="18" fill="#1f3b27"/>
    <circle cx="262" cy="210" r="18" fill="#1f3b27"/>
    <circle cx="178" cy="212" r="10" fill="#2f5a3a"/>
    <circle cx="262" cy="212" r="10" fill="#2f5a3a"/>
    <circle cx="184" cy="203" r="6" fill="#ffffff"/>
    <circle cx="268" cy="203" r="6" fill="#ffffff"/>
  </g>

  {/* pleoapele de sus: privire mai sigura pe ea */}
  <g fill="none" stroke="#2f6b3b" strokeWidth="5" strokeLinecap="round">
    <path d="M149 202 C 158 186, 192 184, 201 198"/>
    <path d="M291 202 C 282 186, 248 184, 239 198"/>
  </g>

  {/* obrajii imbujorati */}
  <ellipse cx="138" cy="248" rx="28" ry="18" fill={`url(#${uid}-blush)`}/>
  <ellipse cx="302" cy="248" rx="28" ry="18" fill={`url(#${uid}-blush)`}/>

  {/* botul */}
  <path d="M220 216 C 212 222, 212 234, 220 236 C 228 234, 228 222, 220 216 Z" fill="#5aa863"/>
  <path d="M220 220 L 220 232" stroke="#3a7d47" strokeWidth="2"/>
  <path d="M152 280 C 156 312, 186 330, 220 330 C 254 330, 284 312, 288 280 C 270 266, 170 266, 152 280 Z" fill={`url(#${uid}-muzzle)`}/>
  <ellipse cx="220" cy="252" rx="34" ry="22" fill="#6fb46a" stroke="#3a7d47" strokeWidth="2"/>
  <ellipse cx="208" cy="258" rx="6" ry="5" fill="#2a4f33"/>
  <ellipse cx="232" cy="258" rx="6" ry="5" fill="#2a4f33"/>
  <ellipse cx="212" cy="244" rx="10" ry="5" fill="#ffffff" opacity=".35"/>

  {/* mustatile lungi, ca la dragonii ploii */}
  <g fill="none" stroke="#b9dc8e" strokeWidth="7" strokeLinecap="round">
    <path d="M190 262 C 150 262, 120 276, 104 300 C 96 314, 108 322, 116 312"/>
    <path d="M250 262 C 290 262, 320 276, 336 300 C 344 314, 332 322, 324 312"/>
  </g>

  {/* zambetul, cu un coltisor */}
  <path d="M186 280 C 198 296, 212 292, 220 286 C 228 292, 242 296, 254 280" fill="none" stroke="#1f3b27" strokeWidth="4" strokeLinecap="round"/>
  <path d="M243 289 L 247 300 L 251 287 Z" fill="#ffffff" stroke="#1f3b27" strokeWidth="1.5" strokeLinejoin="round"/>
  <path d="M210 304 Q 220 310 230 304" fill="none" stroke="#7fbf62" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}
