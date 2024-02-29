import { Kline } from 'binance';
import { addDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

import { IBackTestData } from '@app/(routes)/(route)/type';
import { Performance, calculatePerformance } from '@app/_lib/calculation';
import { Interval, addIntervalTime, intervalToDays } from '@app/_lib/utils';

type klineParams = {
  symbol: string;
  interval: Interval;
  startTime: string;
  endTime: string;
};

const fetchkline = async (params: klineParams, controller: AbortController) => {
  const response = await fetch('/api/candle?' + new URLSearchParams(params), {
    method: 'GET',
    signal: controller.signal,
  });

  if (!response.ok) {
    const res = await response.json();
    throw new Error(`${res.error}`);
  }

  return response;
};

export function useKline(
  selectedBacktest: IBackTestData,
  symbol: string,
  interval: Interval,
  fetchedKlinePercentage: (percentage: number, error?: string) => void,
) {
  const [klineData, setklineData] = useState<Kline[] | null>([]);
  const [doneFetchingKline, setDoneFetchingKline] = useState(false);
  const [performanceData, setPerformanceData] = useState<Performance>();

  useEffect(() => {
    if (!selectedBacktest) return;
    const abortController = new AbortController();
    const loadKline = async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
      try {
        const req = await fetchkline(
          {
            symbol,
            interval,
            startTime,
            endTime,
          },
          abortController,
        );

        if (abortController.signal.aborted) {
          console.log('Request aborted');
          return;
        }

        const res = await req.json();
        if (!req.ok) {
          throw new Error(`${res.error}`);
        }
        if (req.ok) {
          setklineData((prev) => {
            const filteredPrev: Kline[] = prev
              ? prev?.filter(
                  (r) => r[0] >= +selectedBacktest.start_time && r[0] <= +selectedBacktest.end_time,
                )
              : [];
            return [...filteredPrev, ...res];
          });
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        fetchedKlinePercentage(0, error as string);
      }
    };

    if (klineData?.length === 0) {
      loadKline({ startTime: selectedBacktest.start_time, endTime: selectedBacktest.end_time });
    }
    if (klineData?.[0] && klineData[klineData.length - 1][0] < +selectedBacktest.end_time) {
      let newStartTime = addIntervalTime(new Date(klineData[klineData.length - 1][0]), interval)
        .getTime()
        .toString();

      const fetchedPercentage = Math.round(
        ((+newStartTime - +selectedBacktest.start_time) /
          (+selectedBacktest.end_time - +selectedBacktest.start_time)) *
          100,
      );
      fetchedKlinePercentage(fetchedPercentage);

      loadKline({
        startTime: newStartTime,
        endTime: selectedBacktest.end_time,
      });
    }
    if (klineData?.[0] && klineData[klineData.length - 1][0] >= +selectedBacktest.end_time) {
      setDoneFetchingKline(true);
      fetchedKlinePercentage(100);
    }
    return () => abortController.abort();
  }, [selectedBacktest, klineData]);

  useEffect(() => {
    if (doneFetchingKline) {
      setPerformanceData(
        calculatePerformance({
          tradeOrders: { klineData: klineData ?? [], trades: selectedBacktest.trades, interval },
          parameters: {
            comission: 0,
            initialCapital: 10000,
            riskFreeRate: 0.02,
            fees: 0,
          },
        }),
      );
    }
  }, [klineData]);

  return { klineData, doneFetchingKline };
}
