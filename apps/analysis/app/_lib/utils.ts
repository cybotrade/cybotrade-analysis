import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export enum OrderSide {
  Buy = 'buy',
  Sell = 'sell',
}

export enum Interval {
  OneMinute = '1m',
  ThreeMinute = '3m',
  FiveMinute = '5m',
  FifteenMinute = '15m',
  ThirtyMinute = '30m',
  OneHour = '1h',
  TwoHour = '2h',
  FourHour = '4h',
  SixHour = '6h',
  TwelveHour = '12h',
  OneDay = '1d',
  ThreeDay = '3d',
  OneWeek = '1w',
  OneMonth = '1M',
}

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

export const intervalForDays = (interval: Interval) => {
  switch (interval) {
    case Interval.OneMinute:
      return 1440;
    case Interval.ThreeMinute:
      return 1440 / 3;
    case Interval.FiveMinute:
      return 1440 / 5;
    case Interval.FifteenMinute:
      return 1440 / 15;
    case Interval.ThirtyMinute:
      return 1440 / 30;
    case Interval.OneHour:
      return 24;
    case Interval.TwoHour:
      return 24 / 2;
    case Interval.FourHour:
      return 24 / 4;
    case Interval.SixHour:
      return 24 / 6;
    case Interval.TwelveHour:
      return 24 / 12;
    case Interval.OneDay:
      return 1;
    case Interval.ThreeDay:
      return 1 / 3;
    case Interval.OneWeek:
      return 1 / 7;
    case Interval.OneMonth:
      return 1 / 30;
    default:
      return 1; // Default to one day if the interval is not recognized
  }
};

export const addDays = function (date: Date, days: number) {
  var newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}