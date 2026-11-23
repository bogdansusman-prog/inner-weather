import owlUrl from '../../assets/avatars/owlbank-owl.webp';
import type { AvatarIcon as Icon } from './avatars';
import AxArt from './AxArt';

// Desenele simbolurilor, toate pe o grila de 24 x 24, cu linie (fara umplere).
// Personajele (Ax si bufnita) au desenul lor, colorat.
export default function AvatarIcon({ icon }: { icon: Icon }) {
  if (icon === 'ax') return <AxArt />;
  if (icon === 'owl') return <img className="avatar__img" src={owlUrl} alt="" />;

  return (
    <svg viewBox="0 0 24 24" className="avatar__icon" aria-hidden="true">
      {icon === 'sun' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </>
      )}
      {icon === 'cloud' && <path d="M7.5 18.5h9.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.3 11.2 3.7 3.7 0 0 0 7.5 18.5z" />}
      {icon === 'moon' && <path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z" />}
      {icon === 'star' && <path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.5l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" />}
      {icon === 'drop' && <path d="M12 3.2c3.4 4.1 5.8 7.3 5.8 10.3a5.8 5.8 0 0 1-11.6 0c0-3 2.4-6.2 5.8-10.3z" />}
      {icon === 'rainbow' && <path d="M3 17.5a9 9 0 0 1 18 0M6.5 17.5a5.5 5.5 0 0 1 11 0M10 17.5a2 2 0 0 1 4 0" />}
    </svg>
  );
}
