import { describe, expect, it } from 'vitest';
import { advanceTime, createTimeState, isRainy, seasonForDay, weatherForDay } from './time';

describe('time and weather systems', () => {
  it('advances time and starts a fresh day at night', () => {
    const start = createTimeState(4, 22 * 60 + 50);
    const result = advanceTime(start, 20);

    expect(result.newDay).toBe(true);
    expect(result.time.day).toBe(5);
    expect(result.time.hour).toBe(6);
    expect(result.time.minute).toBe(0);
  });

  it('maps days to seasons in 28-day arcs', () => {
    expect(seasonForDay(1)).toBe('Spring');
    expect(seasonForDay(29)).toBe('Summer');
    expect(seasonForDay(57)).toBe('Autumn');
    expect(seasonForDay(85)).toBe('Winter');
  });

  it('uses deterministic weather with special firefly showers', () => {
    expect(weatherForDay(13)).toBe('Firefly Shower');
    expect(weatherForDay(13)).toBe(weatherForDay(13));
    expect(isRainy('Drizzle')).toBe(true);
    expect(isRainy('Breezy')).toBe(false);
  });
});
