import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { IBacktest } from '@app/_providers/backtest';
import { IFileDataState } from '@app/_providers/file';

export function useBacktestWorker(
  fileData: IFileDataState['data'],
  {
    onProcessing,
    onProcessSuccess,
  }: {
    onProcessing: (progress: number) => void;
    onProcessSuccess: (data: {
      id: string;
      backtest: Map<string, IBacktest>;
      progress: number;
    }) => void;
  },
) {
  const worker = useRef<Worker | null>(null);
  const queryClient = useQueryClient();
  const startBacktestWorker = useCallback(
    (permutationId: string, backtestExist: Map<string, IBacktest> | undefined) => {
      if (backtestExist) {
        onProcessSuccess({ id: permutationId, backtest: backtestExist, progress: 100 });
        return;
      }
      if (!worker.current)
        worker.current = new Worker(new URL('@app/_workers/backtest.worker.js', import.meta.url));
      onProcessing(0);

      try {
        const kline = queryClient.getQueriesData({ queryKey: ['candles'] });

        worker.current.postMessage({ fileData, permutationId, kline });

        worker.current.addEventListener('message', (event) => {
          let percent = Math.max(0, Math.min(1, event.data.progress)) * 100;
          onProcessing(percent);
          if (event.data.type === 'COMPLETE') {
            setTimeout(() => {
              const backtest = new Map<string, IBacktest>(JSON.parse(event.data.result));
              onProcessSuccess({ id: permutationId, backtest, progress: 100 });
            }, 4000);
          }
        });

        worker.current.addEventListener('error', (event) => {
          throw new Error('Plot Failed');
        });
      } catch (e) {
        throw new Error('Plot Failed');
      }
    },
    [fileData],
  );

  return { startBacktestWorker };
}
