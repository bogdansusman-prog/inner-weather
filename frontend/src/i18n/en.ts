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
  'menu.open': 'Open profile menu',
  'menu.signedIn': 'Signed in as',
    'checkin.question': "How's your weather?",
  'checkin.hint': 'Tap the spot that matches how you feel right now.',
  'checkin.mapLabel': 'Mood map. Use the arrow keys to move your point.',
  'checkin.save': 'Save',
  'checkin.saving': 'Saving…',
  'checkin.saved': 'Saved. Thanks for checking in.',
  'checkin.error': "We couldn't save your check-in. Please try again.",
  'checkin.offline': "The server isn't responding. Please try again later.",
  'axis.energy': 'Energy',
  'axis.pleasant': 'Pleasant',
  'weather.sunny': 'Sunny',
  'weather.stormy': 'Stormy',
  'weather.calm': 'Calm',
  'weather.foggy': 'Foggy',
} as const;

// toate cheile posibile: 'nav.checkin' | 'nav.home' | ...
export type TextKey = keyof typeof en;