import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import SettingsDialog from '../settings/SettingsDialog';
import './topbar.css';

type Props = {
  name: string | null;    // null cat timp nu stim inca cine e logat
  email: string | null;
  onLogout: () => void;
};

export default function TopBar({ name, email, onLogout }: Props) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // meniul se inchide la Escape sau la click oriunde in afara lui
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (!profileRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [menuOpen]);

  // prima litera din nume, pentru avatar
  const initial = name ? name.trim().charAt(0).toUpperCase() : '';

  return (
    <header className="topbar">
      {/* TODO: pop-up-ul "I need to talk" vine la pasul urmator */}
      <button type="button" className="topbar__talk">
        {t('bar.talk')}
      </button>

      <div className="topbar__profile" ref={profileRef}>
        <button
          type="button"
          className="topbar__avatar"
          aria-label={t('menu.open')}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {initial}
        </button>

        {menuOpen && (
          <div className="topbar__menu" role="menu">
            {name && (
              <div className="topbar__name">
                {t('menu.signedIn')}
                <strong>{name}</strong>
              </div>
            )}
            <button
              type="button"
              className="topbar__item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
            >
              {t('menu.settings')}
            </button>
            <button type="button" className="topbar__item" role="menuitem">
              {t('menu.about')}
            </button>
            <button
              type="button"
              className="topbar__item topbar__item--danger"
              role="menuitem"
              onClick={onLogout}
            >
              {t('menu.logout')}
            </button>
          </div>
        )}
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} name={name} email={email} />
    </header>
  );
}