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

export const intervalToMilliseconds = (interval: Interval) => {
  switch (interval) {
    case Interval.OneMinute:
      return 1000 * 60;
    case Interval.ThreeMinute:
      return 1000 * 60 * 3;
    case Interval.FiveMinute:
      return 1000 * 60 * 5;
    case Interval.FifteenMinute:
      return 1000 * 60 * 15;
    case Interval.ThirtyMinute:
      return 1000 * 60 * 30;
    case Interval.OneHour:
      return 1000 * 60 * 60;
    case Interval.TwoHour:
      return 1000 * 60 * 60 * 2;
    case Interval.FourHour:
      return 1000 * 60 * 60 * 4;
    case Interval.SixHour:
      return 1000 * 60 * 60 * 6;
    case Interval.TwelveHour:
      return 1000 * 60 * 60 * 12;
    case Interval.OneDay:
      return 1000 * 60 * 60 * 24;
    case Interval.ThreeDay:
      return 1000 * 60 * 60 * 24 * 3;
    case Interval.OneWeek:
      return 1000 * 60 * 60 * 24 * 7;
    case Interval.OneMonth:
      return 1000 * 60 * 60 * 24 * 30;
    default:
      return 1000 * 60 * 60 * 24;
  }
};
