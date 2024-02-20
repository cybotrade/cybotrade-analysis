import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export function useDebounce<T>(
  initialValue: T,
  time: number = 500,
): [T, T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebouncedValue(value);
    }, time);
    return () => {
      clearTimeout(debounce);
    };
  }, [value, time]);

  return [debouncedValue, value, setValue];
}
