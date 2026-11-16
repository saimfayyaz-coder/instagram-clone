import type { TFunction } from 'i18next';
import { TRANSLATION_KEYS } from '../i18n/translationKeys';

export const TIME_UNITS = {
  NOW: 'now',
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
} as const;

export type TimeUnit = (typeof TIME_UNITS)[keyof typeof TIME_UNITS];

export interface RelativeTime {
  unit: TimeUnit;
  value: number;
}

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

// Largest whole unit since the date, e.g. 3 hours; the caller translates it
export const getRelativeTime = (date: string | Date, now: number = Date.now()): RelativeTime => {
  const elapsed = Math.max(0, now - new Date(date).getTime());

  if (elapsed >= WEEK_MS) {
    return { unit: TIME_UNITS.WEEKS, value: Math.floor(elapsed / WEEK_MS) };
  }
  if (elapsed >= DAY_MS) {
    return { unit: TIME_UNITS.DAYS, value: Math.floor(elapsed / DAY_MS) };
  }
  if (elapsed >= HOUR_MS) {
    return { unit: TIME_UNITS.HOURS, value: Math.floor(elapsed / HOUR_MS) };
  }
  if (elapsed >= MINUTE_MS) {
    return { unit: TIME_UNITS.MINUTES, value: Math.floor(elapsed / MINUTE_MS) };
  }
  return { unit: TIME_UNITS.NOW, value: 0 };
};

const TIME_UNIT_KEYS: Record<TimeUnit, TRANSLATION_KEYS> = {
  [TIME_UNITS.NOW]: TRANSLATION_KEYS.TIME_JUST_NOW,
  [TIME_UNITS.MINUTES]: TRANSLATION_KEYS.TIME_MINUTES,
  [TIME_UNITS.HOURS]: TRANSLATION_KEYS.TIME_HOURS,
  [TIME_UNITS.DAYS]: TRANSLATION_KEYS.TIME_DAYS,
  [TIME_UNITS.WEEKS]: TRANSLATION_KEYS.TIME_WEEKS,
};

// Short label such as "3h" or "Just now", in the current language
export const formatRelativeTime = (t: TFunction, date: string | Date, now?: number): string => {
  const { unit, value } = getRelativeTime(date, now);
  return t(TIME_UNIT_KEYS[unit], { value });
};
