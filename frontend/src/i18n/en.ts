// Textele aplicatiei in engleza. Cheile de aici sunt lista oficiala.
export const en = {
  'nav.checkin': 'Check-in',
  'nav.home': 'Home',
  'nav.history': 'History',
  'nav.games': 'Games',
  'bar.talk': 'I need to talk',
  'menu.settings': 'Settings',
  'menu.about': 'About us',
  'menu.logout': 'Log out',
} as const;

// toate cheile posibile: 'nav.checkin' | 'nav.home' | ...
export type TextKey = keyof typeof en;