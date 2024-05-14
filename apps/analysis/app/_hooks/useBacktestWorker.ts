import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, useEffect, useRef, useState } from 'react';

import { IBacktest, TActions } from '@app/_providers/backtest';
import { IFileContent, ITopic } from '@app/_providers/file';

export function useBacktestWorker(
  message: {
    topics: ITopic[];
    initialCapital: number;
    permutation: string[];
    startTime: number;
    endTime: number;
  },
  callbacks: {
    onProcessSuccess: (data: any) => void;
  },
) {
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    setProcessing(true);
    const worker = new Worker(
      new URL('@app/_workers/transformBacktest.worker.js', import.meta.url),
    );
    
    try {
      const kline = queryClient.getQueriesData({ queryKey: ['candles'] });
      worker.postMessage({ kline, message });
      worker.addEventListener('message', (event) => {
        callbacks.onProcessSuccess(event.data);
        setProcessing(false);
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
  }, [message]);

  return { processing };
}
