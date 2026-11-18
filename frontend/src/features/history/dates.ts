import type { CheckIn } from '../../api/checkins';

// Calcule cu zile, saptamani si luni, dupa ceasul calculatorului.

export type Period = 'day' | 'week' | 'month';

// ziua respectiva, la 00:00
export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// saptamana incepe luni
export function startOfWeek(date: Date) {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() + 6) % 7));
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// inceputul perioadei care contine ziua `date`
export function periodStart(period: Period, date: Date) {
  if (period === 'day') return startOfDay(date);
  if (period === 'week') return startOfWeek(date);
  return startOfMonth(date);
}

// inceputul perioadei de dupa (step = 1) sau de dinainte (step = -1)
export function shiftPeriod(period: Period, start: Date, step: number) {
  if (period === 'day') return addDays(start, step);
  if (period === 'week') return addDays(start, 7 * step);
  return new Date(start.getFullYear(), start.getMonth() + step, 1);
}

// "2026-11-18": cheia unei zile
export function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// check-in-urile grupate pe zile, dupa cheia zilei
export function groupByDay(list: CheckIn[]) {
  const byDay = new Map<string, CheckIn[]>();
  for (const c of list) {
    const key = dayKey(new Date(c.checkedInAt));
    byDay.set(key, [...(byDay.get(key) ?? []), c]);
  }
  return byDay;
}

// media "cat de placut" a unei liste (lista nu e goala)
export function averagePleasantness(list: CheckIn[]) {
  return list.reduce((sum, c) => sum + c.pleasantness, 0) / list.length;
}
