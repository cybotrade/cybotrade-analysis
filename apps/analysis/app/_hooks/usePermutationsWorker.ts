import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, useEffect, useRef, useState } from 'react';

import { IBacktest, TActions } from '@app/_providers/backtest';
import { IFileContent, IFileDataState, ITopic } from '@app/_providers/file';

export function usePermutationsWorker(
  fileData: IFileDataState['data'],
  callbacks: {
    onProcessSuccess: (data: any) => void;
  },
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const worker = new Worker(new URL('@app/_workers/permutations.worker.js', import.meta.url));

    try {
      const kline = queryClient.getQueriesData({ queryKey: ['candles'] });
      worker.postMessage({ kline, fileData });
      worker.addEventListener('message', (event) => {
        callbacks.onProcessSuccess(event.data);
      });
      worker.addEventListener('error', (event) => {
        throw new Error('Process Failed');
      });
    } catch (e) {
      throw new Error('Process Failed');
    }

    return () => {
      worker.terminate();
    };
  }, []);
}
