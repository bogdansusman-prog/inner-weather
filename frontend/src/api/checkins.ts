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

// Aceeasi regula ca in backend, ca sa aratam vremea inainte de salvare
export function weatherOf(energy: number, pleasantness: number): Weather {
  if (energy >= 0) return pleasantness >= 0 ? 'SUNNY' : 'STORMY';
  return pleasantness >= 0 ? 'CALM' : 'FOGGY';
}