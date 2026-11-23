import { useLanguage } from '../../i18n/LanguageContext';
import Avatar from './Avatar';
import AvatarIcon from './AvatarIcon';
import { AVATAR_COLORS, AVATAR_ICONS, COLOR_LABEL, ICON_LABEL, type Avatar as AvatarValue } from './avatars';

type Props = {
  avatar: AvatarValue | null;
  initial: string;
  onChange: (avatar: AvatarValue | null) => void; // null = inapoi la initiala
};

// Alegerea avatarului, in setari: un simbol si o culoare. Se schimba pe loc.
export default function AvatarPicker({ avatar, initial, onChange }: Props) {
  const { t } = useLanguage();
  // daca inca n-a ales nimic, pornim de la soare pe violet
  const current = avatar ?? { icon: 'sun', color: 'violet' };

  return (
    <div className="picker">
      <div className="picker__preview">
        <Avatar avatar={avatar} initial={initial} />
      </div>

      <div className="picker__choices">
        <div className="picker__row" role="group" aria-label={t('settings.avatarIcon')}>
          {AVATAR_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className="picker__option"
              aria-pressed={avatar?.icon === icon}
              aria-label={t(ICON_LABEL[icon])}
              onClick={() => onChange({ ...current, icon })}
            >
              <AvatarIcon icon={icon} />
            </button>
          ))}
        </div>

        {/* bufnita are fundalul ei, asa ca la ea nu alegem culoare */}
        {current.icon !== 'owl' && (
          <div className="picker__row" role="group" aria-label={t('settings.avatarColor')}>
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="picker__option picker__color"
                data-color={color}
                aria-pressed={avatar?.color === color}
                aria-label={t(COLOR_LABEL[color])}
                onClick={() => onChange({ ...current, color })}
              />
            ))}
          </div>
        )}

        {avatar && (
          <button type="button" className="picker__reset" onClick={() => onChange(null)}>
            {t('settings.avatarInitial')}
          </button>
        )}
      </div>
    </div>
  );
}
