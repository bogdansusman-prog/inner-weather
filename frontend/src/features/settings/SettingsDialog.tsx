import { useEffect, useRef } from 'react';
import { useLanguage, type Lang } from '../../i18n/LanguageContext';
import type { TextKey } from '../../i18n/en';
import type { Avatar } from '../profile/avatars';
import AvatarPicker from '../profile/AvatarPicker';
import { useTheme, type Theme } from '../../theme/ThemeContext';
import './settings.css';

// limbile se scriu in limba lor, ca sa le gaseasca oricine
const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ro', label: 'Română' },
];

const THEMES: { id: Theme; label: TextKey }[] = [
  { id: 'light', label: 'settings.themeLight' },
  { id: 'midnight', label: 'settings.themeMidnight' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  name: string | null;
  email: string | null;
  avatar: Avatar | null;
  onAvatarChange: (avatar: Avatar | null) => void;
};

// Fereastra de setari: limba, tema, profilul si contul.
// Limba si tema se schimba pe loc, fara buton de salvare.
export default function SettingsDialog({ open, onClose, name, email, avatar, onAvatarChange }: Props) {
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // deschidem / inchidem fereastra adevarata cand se schimba `open`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      titleRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="settings"
      aria-labelledby="settings-title"
      onClose={onClose}
      // click pe fundal (in afara cardului) inchide fereastra
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      // cat e deschisa, rotita si degetul nu schimba pagina din spate
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="settings__card">
        <h2 className="settings__title" id="settings-title" ref={titleRef} tabIndex={-1}>
          {t('settings.title')}
        </h2>

        {/* limba */}
        <section className="settings__section" aria-labelledby="settings-lang">
          <h3 className="settings__label" id="settings-lang">{t('settings.language')}</h3>
          <div className="settings__options">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="settings__option"
                aria-pressed={lang === l.id}
                onClick={() => setLang(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        {/* tema: fiecare optiune are o mica previzualizare a cerului */}
        <section className="settings__section" aria-labelledby="settings-theme">
          <h3 className="settings__label" id="settings-theme">{t('settings.theme')}</h3>
          <div className="settings__options">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                className="settings__option settings__theme"
                data-preview={th.id}
                aria-pressed={theme === th.id}
                onClick={() => setTheme(th.id)}
              >
                <span className="settings__preview" aria-hidden="true">
                  <span />
                  <span />
                </span>
                {t(th.label)}
              </button>
            ))}
          </div>
        </section>

        {/* profilul: deocamdata doar il aratam */}
        <section className="settings__section" aria-labelledby="settings-profile">
          <h3 className="settings__label" id="settings-profile">{t('settings.profile')}</h3>
          <AvatarPicker avatar={avatar} initial={name ? name.trim().charAt(0).toUpperCase() : ''} onChange={onAvatarChange} />
          <dl className="settings__profile">
            <div>
              <dt>{t('settings.name')}</dt>
              <dd>{name ?? '–'}</dd>
            </div>
            <div>
              <dt>{t('settings.email')}</dt>
              <dd>{email ?? '–'}</dd>
            </div>
          </dl>
        </section>

        {/* contul: stergerea vine cand backend-ul are DELETE /api/me */}
        <section className="settings__section" aria-labelledby="settings-account">
          <h3 className="settings__label" id="settings-account">{t('settings.account')}</h3>
          <button type="button" className="settings__delete" disabled aria-describedby="settings-soon">
            {t('settings.delete')}
          </button>
          <p className="settings__hint" id="settings-soon">{t('settings.deleteSoon')}</p>
        </section>

        <button type="button" className="settings__done" onClick={onClose}>
          {t('settings.done')}
        </button>
      </div>
    </dialog>
  );
}
