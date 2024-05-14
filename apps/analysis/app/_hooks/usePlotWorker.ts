import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ITopic } from '@app/_providers/file';

export function usePlotWorker(
  topics: ITopic[],
  permutations: Map<string, string>,
  callbacks: {
    onProcessSuccess: (data: any) => void;
  },
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const worker = new Worker(new URL('@app/_workers/plot.worker.js', import.meta.url));

    try {
      const kline = queryClient.getQueriesData({ queryKey: ['candles'] });

      worker.postMessage({ topics, permutations, kline });

      worker.addEventListener('message', (event) => {
        callbacks.onProcessSuccess(event.data);
      });
      worker.addEventListener('error', (event) => {
        throw new Error('Plot Failed');
      });
    } catch (e) {
      throw new Error('Plot Failed');
    }

    return () => {
      worker.terminate();
    };
  }, []);
}
