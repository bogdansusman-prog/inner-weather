import type { CheckIn, Weather } from '../../api/checkins';

// cele patru vremi, in aceeasi ordine peste tot
export const WEATHERS: Weather[] = ['SUNNY', 'CALM', 'FOGGY', 'STORMY'];

// cate check-in-uri are fiecare vreme, ex. { SUNNY: 3, CALM: 1, FOGGY: 0, STORMY: 2 }
export function countWeathers(list: CheckIn[]): Record<Weather, number> {
  const counts: Record<Weather, number> = { SUNNY: 0, CALM: 0, FOGGY: 0, STORMY: 0 };
  
  // datele vin de la server: ignoram o vreme pe care nu o cunoastem
  for (const item of list) {
    if (item.weather && counts[item.weather] !== undefined) {
      counts[item.weather]++;
    }
  }
  
  return counts;
}

// vremea cu cele mai multe check-in-uri; null daca toate sunt 0
export function mainWeather(counts: Record<Weather, number>): Weather | null {
  let maxCount = 0;
  let dominantWeather: Weather | null = null;

  for (const weather of WEATHERS) {
    if (counts[weather] > maxCount) {
      maxCount = counts[weather];
      dominantWeather = weather;
    }
  }

  return dominantWeather;
}