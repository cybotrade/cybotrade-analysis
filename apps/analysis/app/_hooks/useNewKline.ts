import { useQueryClient } from '@tanstack/react-query';
import { KlinesParams } from 'binance';
import { isFuture } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useKlineInfiniteQuery } from '@app/_hooks/useKlineInfiniteQuery';
import { Interval, addIntervalTime } from '@app/_lib/utils';
import { IFileDataState } from '@app/_providers/file';

export function useNewKline(
  fileData: IFileDataState['data'],
  {
    onFetchingKline,
    onFetchComplete,
    onFetchFailed,
  }: {
    onFetchingKline: (progress: number) => void;
    onFetchComplete: () => void;
    onFetchFailed: (error: string) => void;
  },
) {
  const queryClient = useQueryClient();
  const startTime = useRef(0);

  const endTime = useRef(0);
  const params = useMemo<KlinesParams>(() => {
    if (!fileData) throw new Error('No File Data');
    return {
      interval: fileData.topics[0].interval as Interval,
      symbol: fileData.topics[0].symbol,
      startTime: fileData.startTime,
      endTime: fileData.endTime,
    };
  }, [fileData]);
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
      if (isFuture(startTime.current)) {
        clearInterval(timerId.current);
        timerId.current = null;
        onFetchingKline(100);
        return;
      }
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
        onFetchComplete();
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
