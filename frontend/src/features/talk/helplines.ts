import type { TextKey } from '../../i18n/en';

export type Helpline = {
  name: string;
  number: string; // cum il citim: "0800 801 200"
  tel: string;    // pentru link-ul tel:, fara spatii
  about: TextKey; // pentru cine e linia
};

// Liniile de sprijin din Romania, verificate pe findahelpline.com la 23 noiembrie 2026.
// ATENTIE: inainte de prezentare / lansare, verificati din nou ca numerele sunt active.
export const HELPLINES: Helpline[] = [
  { name: 'DepreHUB', number: '0374 456 420', tel: '0374456420', about: 'talk.line.deprehub' },
  { name: 'TelVerde Antisuicid', number: '0800 801 200', tel: '0800801200', about: 'talk.line.antisuicid' },
  { name: 'Telefonul Copilului', number: '116 111', tel: '116111', about: 'talk.line.child' },
];

// pentru cine nu e din Romania: un director international de linii verificate
export const HELPLINE_DIRECTORY = 'https://findahelpline.com';
