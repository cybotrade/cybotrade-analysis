import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, useEffect, useRef, useState } from 'react';

import { IBacktest, TActions } from '@app/_providers/backtest';
import { IFileContent } from '@app/_providers/file';

export function useBacktestWorker(fileData: IFileContent | null, dispatch: Dispatch<TActions>) {
  const queryClient = useQueryClient();
  const worker = useRef<Worker>();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const kline = queryClient.getQueriesData({ queryKey: ['candles'] });
    worker.current = new Worker(
      new URL('@app/_workers/transformBacktest.worker.js', import.meta.url),
    );

    worker.current.postMessage({ kline, fileData });
    worker.current.addEventListener('message', (event) => {
      const result = new Uint16Array(event.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      );
      const parsedJson = JSON.parse(result);
      const backtestsMap = new Map(parsedJson.backtests as [string, IBacktest][]);

      for (const [id, { trades, closedTrades, tradesWithProfit, performance }] of backtestsMap) {
        backtestsMap.set(id, {
          trades: new Map(trades),
          closedTrades: new Map(closedTrades),
          tradesWithProfit: new Map(tradesWithProfit),
          performance: new Map(performance),
        });
      }
      dispatch({
        type: 'SET_DATA',
        payload: {
          topics: parsedJson.topics,
          initialCapital: parsedJson.initial_capital,
          backtests: parsedJson.backtests,
          startTime: parsedJson.start_time,
          endTime: parsedJson.end_time,
        },
      });
      setProcessing(false);
    });

    worker.current.addEventListener('error', (event) => {
      throw new Error('Process Failed');
    });
    return () => {
      worker.current?.terminate();
    };
  }, []);

  return { processing };
}
