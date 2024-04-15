import { hoursToMilliseconds, millisecondsToHours } from 'date-fns';

export function capitalize(input: string) {
  if (input && typeof input === 'string') {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  return input;
}

export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export function getPercentile(series: number[], percentile: number) {
  series.sort(function (a, b) {
    return a - b;
  });

  const index = (percentile / 100) * series.length;
  let result;
  if (Math.floor(index) == index) {
    result = (series[index - 1] + series[index]) / 2;
  } else {
    result = series[Math.floor(index)];
  }
  return result;
}

export function random_hex_color_code() {
  const n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
}

export function daysToHours(days: number) {
  const hoursInDay = 24;
  const millisecondsInDay = hoursToMilliseconds(hoursInDay);
  const totalMilliseconds = days * millisecondsInDay;
  const totalHours = millisecondsToHours(totalMilliseconds);
  return totalHours;
}
