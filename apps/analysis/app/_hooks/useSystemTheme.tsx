import { useTheme } from 'next-themes';
import { useCallback, useMemo } from 'react';

export function useSystemTheme(): readonly [
  boolean,
  string | undefined,
  'dark' | 'light' | undefined,
  () => void,
] {
  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  const isDark = useMemo(
    () => (theme === 'system' ? systemTheme === 'dark' : theme === 'dark'),
    [theme, systemTheme],
  );

  const onToggleTheme = useCallback(
    () => (resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark')),
    [resolvedTheme],
  );

  return [isDark, theme, systemTheme, onToggleTheme] as const;
}
