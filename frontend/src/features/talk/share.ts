export type Channel = 'whatsapp' | 'sms' | 'email';

// Linkul care deschide aplicatia cu mesajul deja scris.
// Nu punem destinatarul: omul alege singur cui trimite.
export function shareLink(channel: Channel, message: string, subject: string): string {
  // mesajul are spatii, diacritice, "?" si "&": le transformam in forma sigura pentru link
  const text = encodeURIComponent(message);

  if (channel === 'whatsapp') return `https://wa.me/?text=${text}`;
  // "?&" merge si pe Android, si pe iPhone
  if (channel === 'sms') return `sms:?&body=${text}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${text}`;
}
