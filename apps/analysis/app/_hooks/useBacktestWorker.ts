import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { IBacktest } from '@app/_providers/backtest';
import { IFileDataState, ITopic } from '@app/_providers/file';

export function useBacktestWorker(
  permutationId: string,
  fileData: IFileDataState['data'],
  backtestExist: Map<string, IBacktest> | undefined,
  callbacks: {
    onProcessSuccess: (data: { id: string; backtest: Map<string, IBacktest> }) => void;
  },
) {
  const [processing, setProcessing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (backtestExist) {
      callbacks.onProcessSuccess({ id: permutationId, backtest: backtestExist });
      return;
    }

    setProcessing(true);
    const worker = new Worker(new URL('@app/_workers/backtest.worker.js', import.meta.url));

    try {
      const kline = queryClient.getQueriesData({ queryKey: ['candles'] });

      worker.postMessage({ fileData, permutationId, kline });

      worker.addEventListener('message', (event) => {
        const backtest = new Map<string, IBacktest>(JSON.parse(event.data.result));
        callbacks.onProcessSuccess({ id: permutationId, backtest });
        setProcessing(false);
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
  }, [permutationId]);

  return { processing };
}
