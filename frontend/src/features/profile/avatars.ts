import type { TextKey } from '../../i18n/en';

// Avatarele din aplicatie: un simbol din cer pe un cerc colorat.
// Se salveaza ca text scurt, ex. "sun:violet", ca sa poata merge usor si in backend.

// ultimele doua sunt personaje din aplicatiile mele: Ax (Ax Tracker) si bufnita (OwlBank)
export const AVATAR_ICONS = ['sun', 'cloud', 'moon', 'star', 'drop', 'rainbow', 'ax', 'owl'] as const;
export const AVATAR_COLORS = ['violet', 'lilac', 'rose', 'mint', 'gold', 'sky'] as const;

export type AvatarIcon = (typeof AVATAR_ICONS)[number];
export type AvatarColor = (typeof AVATAR_COLORS)[number];
export type Avatar = { icon: AvatarIcon; color: AvatarColor };

// numele pentru cititoarele de ecran
export const ICON_LABEL: Record<AvatarIcon, TextKey> = {
  sun: 'avatar.sun',
  cloud: 'avatar.cloud',
  moon: 'avatar.moon',
  star: 'avatar.star',
  drop: 'avatar.drop',
  rainbow: 'avatar.rainbow',
  ax: 'avatar.ax',
  owl: 'avatar.owl',
};
export const COLOR_LABEL: Record<AvatarColor, TextKey> = {
  violet: 'avatar.violet',
  lilac: 'avatar.lilac',
  rose: 'avatar.rose',
  mint: 'avatar.mint',
  gold: 'avatar.gold',
  sky: 'avatar.sky',
};

export function avatarToText(avatar: Avatar) {
  return `${avatar.icon}:${avatar.color}`;
}

// textul vine din afara (localStorage, mai tarziu serverul): il verificam, nu-l credem pe cuvant
export function avatarFromText(text: string | null | undefined): Avatar | null {
  if (!text) return null;
  const [icon, color] = text.split(':');
  const knownIcon = AVATAR_ICONS.find((i) => i === icon);
  const knownColor = AVATAR_COLORS.find((c) => c === color);
  return knownIcon && knownColor ? { icon: knownIcon, color: knownColor } : null;
}

// Pana cand backend-ul tine avatarul in profil, il pastram in browser,
// separat pentru fiecare cont (dupa email).
const STORAGE_KEY = 'inner-weather:avatars';

export function readSavedAvatars(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function writeSavedAvatars(all: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // fara localStorage: avatarul tine doar pana la refresh
  }
}
