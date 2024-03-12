import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useActivePath(): readonly [(path: string) => boolean | undefined, string | null] {
  const pathname = usePathname();

  const checkActivePath = useCallback(
    (path: string) => {
      if (!pathname) return;
      if (path === '/' && pathname !== path) {
        return false;
      }
      return pathname.includes(path.split('/')[1]);
    },
    [pathname],
  );

  return [checkActivePath, pathname] as const;
}
