export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type Weather = 'Sunny' | 'Drizzle' | 'Breezy' | 'Firefly Shower';

export interface TimeState {
  day: number;
  hour: number;
  minute: number;
  totalMinutes: number;
}

const DAY_START = 6 * 60;
const DAY_END = 23 * 60;

export function createTimeState(day = 1, totalMinutes = DAY_START): TimeState {
  return {
    day,
    totalMinutes,
    hour: Math.floor(totalMinutes / 60) % 24,
    minute: totalMinutes % 60,
  };
}

export function advanceTime(time: TimeState, minutes: number): { time: TimeState; newDay: boolean } {
  const nextTotal = time.totalMinutes + minutes;
  if (nextTotal >= DAY_END) {
    return { time: createTimeState(time.day + 1, DAY_START), newDay: true };
  }
  return { time: createTimeState(time.day, nextTotal), newDay: false };
}

export function seasonForDay(day: number): Season {
  const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
  return seasons[Math.floor(((day - 1) % 112) / 28)];
}

export function weatherForDay(day: number): Weather {
  const roll = (day * 9301 + 49297) % 233280;
  const normalized = roll / 233280;
  if (day % 13 === 0) return 'Firefly Shower';
  if (normalized < 0.24) return 'Drizzle';
  if (normalized < 0.48) return 'Breezy';
  return 'Sunny';
}

export function isRainy(weather: Weather): boolean {
  return weather === 'Drizzle' || weather === 'Firefly Shower';
}
