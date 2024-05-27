import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import { IFileDataState } from '@app/_providers/file';

export function usePermutationsWorker(
  fileData: IFileDataState['data'],
  callbacks: {
    onProcessSuccess: (data: any) => void;
  },
) {
  const worker = useRef<Worker | null>(null);

  const queryClient = useQueryClient();

  const startPermutationsWorker = useCallback(() => {
    if (!worker.current)
      worker.current = new Worker(new URL('@app/_workers/permutations.worker.js', import.meta.url));
    try {
      const kline = queryClient.getQueriesData({ queryKey: ['candles'] });
      worker.current.postMessage({ kline, fileData });
      worker.current.addEventListener('message', (event) => {
        callbacks.onProcessSuccess(event.data);
      });
      worker.current.addEventListener('error', (event) => {
        throw new Error('Process Failed');
      });
    } catch (e) {
      throw new Error('Process Failed');
    }
  }, [fileData]);

  return { startPermutationsWorker };
}
