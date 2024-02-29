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

export const roundIntervalDate = (givenDate: string, interval: Interval) => {
  let date = new Date(givenDate);
  switch (interval) {
    case Interval.OneMinute:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      break;
    case Interval.ThreeMinute:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(date.getUTCMinutes() - (date.getUTCMinutes() % 3));
      break;

    case Interval.FiveMinute:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(date.getUTCMinutes() - (date.getUTCMinutes() % 5));
      break;
    case Interval.FifteenMinute:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(date.getUTCMinutes() - (date.getUTCMinutes() % 15));
      break;
    case Interval.ThirtyMinute:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(date.getUTCMinutes() - (date.getUTCMinutes() % 30));
      break;
    case Interval.OneHour:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      break;
    case Interval.TwoHour:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(date.getUTCHours() - (date.getUTCHours() % 2));
      break;
    case Interval.FourHour:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(date.getUTCHours() - (date.getUTCHours() % 4));
      break;
    case Interval.SixHour:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(date.getUTCHours() - (date.getUTCHours() % 6));
      break;
    case Interval.TwelveHour:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(date.getUTCHours() - (date.getUTCHours() % 12));
      break;
    case Interval.OneDay:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(0);
      break;
    case Interval.ThreeDay:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDate() % 3));
      break;
    case Interval.OneWeek:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDate() % 7));
      break;
    case Interval.OneMonth:
      date.setUTCMilliseconds(0);
      date.setUTCSeconds(0);
      date.setUTCMinutes(0);
      date.setUTCHours(0);
      date.setUTCDate(0);
      break;
    default:
      console.error('Invalid Interval found');
      break;
  }
  return date.getTime();
};

export const addIntervalTime = (date: Date, interval: Interval) => {
  let newDate = new Date(date);
  switch (interval) {
    case Interval.OneMinute:
      newDate.setUTCMinutes(newDate.getUTCMinutes() + 1);
      break;
    case Interval.ThreeMinute:
      newDate.setUTCMinutes(newDate.getUTCMinutes() + 3);
      break;
    case Interval.FiveMinute:
      newDate.setUTCMinutes(newDate.getUTCMinutes() + 5);
      break;
    case Interval.FifteenMinute:
      newDate.setUTCMinutes(newDate.getUTCMinutes() + 15);
      break;
    case Interval.ThirtyMinute:
      newDate.setUTCMinutes(newDate.getUTCMinutes() + 30);
      break;
    case Interval.OneHour:
      newDate.setUTCHours(newDate.getUTCHours() + 1);
      break;
    case Interval.TwoHour:
      newDate.setUTCHours(newDate.getUTCHours() + 2);
      break;
    case Interval.FourHour:
      newDate.setUTCHours(newDate.getUTCHours() + 4);
      break;
    case Interval.SixHour:
      newDate.setUTCHours(newDate.getUTCHours() + 6);
      break;
    case Interval.TwelveHour:
      newDate.setUTCHours(newDate.getUTCHours() + 12);
      break;
    case Interval.OneDay:
      newDate.setUTCDate(newDate.getUTCDate() + 1);
      break;
    case Interval.ThreeDay:
      newDate.setUTCDate(newDate.getUTCDate() + 3);
      break;
    case Interval.OneWeek:
      newDate.setUTCDate(newDate.getUTCDate() + 7);
      break;
    case Interval.OneMonth:
      newDate.setUTCMonth(newDate.getUTCMonth() + 1);
      break;
    default:
      console.error('Invalid Interval found');
      break;
  }
  return newDate;
};
