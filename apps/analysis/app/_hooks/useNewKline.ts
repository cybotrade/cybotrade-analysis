import { useQueryClient } from '@tanstack/react-query';
import { KlinesParams } from 'binance';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useKlineInfiniteQuery } from '@app/_hooks/useKlineInfiniteQuery';
import { Interval, addIntervalTime } from '@app/_lib/utils';
import { IFileDataState } from '@app/_providers/file';

export function useNewKline(
  state: IFileDataState,
  {
    onFetchingKline,
    onFetchFailed,
  }: {
    onFetchingKline: (progress: number) => void;
    onFetchFailed: (error: string) => void;
  },
) {
  const queryClient = useQueryClient();
  const startTime = useRef(0);

  const endTime = useRef(0);
  const params = useMemo<KlinesParams | null>(() => {
    if (!state.data) return null;
    return {
      interval: state.data.topics[0].interval as Interval,
      symbol: state.data.topics[0].symbol,
      startTime: state.data.startTime,
      endTime: state.data.endTime,
    };
  }, [state.data]);
  const { data, isError, fetchNextPage } = useKlineInfiniteQuery(params);
  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    if (!timerId.current) return;
    if (isError) {
      clearInterval(timerId.current);
      onFetchFailed('Failed to fetch');
    }
    if (data && data.pages.length > 0) {
      const lastPage = data.pages[data.pages.length - 1];
      const nextCursor = lastPage.nextCursor;
      startTime.current = addIntervalTime(
        new Date(nextCursor![0]),
        params?.interval as Interval,
      ).getTime();
      onFetchingKline(
        Math.min(
          100,
          Math.round(
            ((startTime.current - params!.startTime!) / (params!.endTime! - params!.startTime!)) *
              100,
          ),
        ),
      );

      if (startTime.current >= endTime.current) {
        clearInterval(timerId.current);
        timerId.current = null;
        return;
      }

      await fetchNextPage();
    }
  }, [data, isError]);

  useEffect(() => {
    if (!params) {
      queryClient.removeQueries({ queryKey: ['candles'] });
      return;
    }
    startTime.current = params.startTime!;
    endTime.current = params.endTime!;

    timerId.current = setInterval(fetchData, 1000);
    return () => clearInterval(timerId.current!);
  }, [params, fetchData]);
}
