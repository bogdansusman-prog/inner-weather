import { apiFetch } from './client';

// cele patru vremi, la fel ca in backend (Weather.java)
export type Weather = 'SUNNY' | 'STORMY' | 'CALM' | 'FOGGY';

// un check-in, asa cum il trimite backend-ul inapoi
export type CheckIn = {
  id: string;
  energy: number;       // intre -1 si 1
  pleasantness: number; // intre -1 si 1
  weather: Weather;
  note: string | null;
  checkedInAt: string;  // data si ora, in format ISO
};

// Salveaza starea de acum; intoarce check-in-ul salvat
export function saveCheckIn(energy: number, pleasantness: number) {
  return apiFetch<CheckIn>('/check-ins', {
    method: 'POST',
    body: JSON.stringify({ energy, pleasantness }),
  });
}

// Check-in-urile de la `from` pana acum, cele mai vechi primele
export function getCheckIns(from: Date) {
  return apiFetch<CheckIn[]>(`/check-ins?from=${encodeURIComponent(from.toISOString())}`);
}

// Azi, la 00:00, dupa ceasul calculatorului (ora Romaniei pentru noi)
export function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

// Aceeasi regula ca in backend, ca sa aratam vremea inainte de salvare
export function weatherOf(energy: number, pleasantness: number): Weather {
  if (energy >= 0) return pleasantness >= 0 ? 'SUNNY' : 'STORMY';
  return pleasantness >= 0 ? 'CALM' : 'FOGGY';
}
