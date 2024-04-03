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
    start_time: String(startTime),
    end_time: String(endTime),
  });

  const response = await fetch(`/api/candle?${params}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed fetch');
  }

  const data = await response.json();
  return data;
};

export function useKlineInfiniteQuery(params: KlinesParams | null) {
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
      if (!params) {
        return undefined;
      }
      if (!lastPage) return undefined;
      const nextCursor = lastPage.nextCursor;
      if (nextCursor && nextCursor[0] >= params.endTime!) return undefined;
      return Number(lastPage.nextCursor![0]);
    },
  });
}
