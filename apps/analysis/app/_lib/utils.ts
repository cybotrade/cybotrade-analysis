import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Interval } from '@cybotrade/core';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortByTimestamp = <T extends { time: Date | string }>(
  items?: T[],
  sortOrder: 'asc' | 'desc' = 'asc',
): T[] => {
  if (!items || items.length < 1) {
    return [];
  }

  const multiplier = sortOrder === 'desc' ? -1 : 1;

  return items.sort((a, b) => {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return multiplier * (dateA.getTime() - dateB.getTime());
  });
};

export const intervalToDays = (interval: Interval) => {
  switch (interval) {
    case Interval.OneMinute:
      return 1 / (24 * 60);
    case Interval.ThreeMinute:
      return 3 / (24 * 60);
    case Interval.FiveMinute:
      return 5 / (24 * 60);
    case Interval.FifteenMinute:
      return 15 / (24 * 60);
    case Interval.ThirtyMinute:
      return 30 / (24 * 60);
    case Interval.OneHour:
      return 1 / 24;
    case Interval.TwoHour:
      return 2 / 24;
    case Interval.FourHour:
      return 4 / 24;
    case Interval.SixHour:
      return 6 / 24;
    case Interval.TwelveHour:
      return 12 / 24;
    case Interval.OneDay:
      return 1;
    case Interval.ThreeDay:
      return 3;
    case Interval.OneWeek:
      return 7;
    case Interval.OneMonth:
      return 30;
    default:
      return 1; // Default to one day if the interval is not recognized
  }
};
