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
