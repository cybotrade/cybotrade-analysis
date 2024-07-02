import { useInfiniteQuery } from '@tanstack/react-query';
import { Kline, KlinesParams } from 'binance';

export interface Page {
  kline: Kline[];
  nextCursor?: Kline;
}

export const fetchKline = async ({ symbol, interval, startTime, endTime }: KlinesParams) => {
  const params = new URLSearchParams({
    symbol: symbol,
    interval: interval,
    startTime: String(startTime),
    endTime: String(endTime),
  });

  const response = await fetch(`https://api.binance.com/api/v3/klines?${params}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed fetch');
  }

  const data = await response.json();
  return {
    kline: data,
    nextCursor:
      data[data.length - 1] && data[data.length - 1][0] <= endTime! ? data.pop() : undefined,
  };
};

export function useKlineInfiniteQuery(params: KlinesParams) {
  return useInfiniteQuery({
    queryKey: ['candles', params?.symbol],
    queryFn: ({ pageParam = params?.startTime }) => {
      if (!params) {
        return Promise.reject(undefined);
      }
      return fetchKline({ ...params, startTime: pageParam });
    },
    initialPageParam: params?.startTime,
    getNextPageParam: (lastPage: Page, pages: Page[]) => {
      if (!params || !lastPage || !lastPage.nextCursor) return undefined;
      return Number(lastPage.nextCursor![0]);
    },
  });
}
