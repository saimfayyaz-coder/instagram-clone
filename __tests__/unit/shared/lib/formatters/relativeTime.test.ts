import {
  TIME_UNITS,
  formatRelativeTime,
  getRelativeTime,
} from '@/shared/lib/formatters/relativeTime';
import { TRANSLATION_KEYS } from '@/shared/lib/i18n/translationKeys';

const NOW = Date.UTC(2026, 10, 13, 12, 0, 0);
const MINUTE_MS = 60_000;
const ago = (minutes: number) => new Date(NOW - minutes * MINUTE_MS);

describe('getRelativeTime', () => {
  it.each([
    [0, TIME_UNITS.NOW, 0],
    [5, TIME_UNITS.MINUTES, 5],
    [59, TIME_UNITS.MINUTES, 59],
    [60, TIME_UNITS.HOURS, 1],
    [23 * 60 + 59, TIME_UNITS.HOURS, 23],
    [24 * 60, TIME_UNITS.DAYS, 1],
    [6 * 24 * 60, TIME_UNITS.DAYS, 6],
    [15 * 24 * 60, TIME_UNITS.WEEKS, 2],
  ])('%i minutes ago is %s %i', (minutes, unit, value) => {
    expect(getRelativeTime(ago(minutes), NOW)).toEqual({ unit, value });
  });

  it('treats a future date as now', () => {
    expect(getRelativeTime(ago(-10), NOW)).toEqual({ unit: TIME_UNITS.NOW, value: 0 });
  });

  it('accepts an ISO string', () => {
    expect(getRelativeTime(ago(120).toISOString(), NOW)).toEqual({
      unit: TIME_UNITS.HOURS,
      value: 2,
    });
  });
});

describe('formatRelativeTime', () => {
  it('translates the unit with its value', () => {
    const t = jest.fn((key: string, options?: { value: number }) => `${key}:${options?.value}`);
    expect(formatRelativeTime(t as never, ago(180), NOW)).toBe(`${TRANSLATION_KEYS.TIME_HOURS}:3`);
  });
});
