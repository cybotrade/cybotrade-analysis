'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import {
  CandlestickData,
  CandlestickStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesMarker,
  SeriesOptionsCommon,
  Time,
  type UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ITrade } from '@app/(routes)/(route)/type';
import { Page } from '@app/_hooks/useKlineInfiniteQuery';
import { cn } from '@app/_lib/utils';
import { useBacktestData } from '@app/_providers/backtest';
import { debounce } from '@app/_utils/helper';

type TNewCandleChartProps = {};

const NewCandleChart = ({}: TNewCandleChartProps) => {
  const chartOptions: DeepPartial<ChartOptions> = useMemo(
    () => ({
      layout: {
        background: {
          type: ColorType.Solid,
          color: 'transparent',
        },
        textColor: 'black',
      },
      grid: {
        vertLines: {
          color: '#E2E2E2',
        },
        horzLines: {
          color: '#E2E2E2',
        },
      },
      rightPriceScale: {
        visible: true,
      },
      leftPriceScale: {
        visible: true,
      },
      trackingMode: {},
    }),
    [],
  );
  const candleOptions: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon> = useMemo(
    () => ({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderUpColor: '#4bffb5',
      borderDownColor: '#ff4976',
      wickUpColor: '#838ca1',
      wickDownColor: '#838ca1',
    }),
    [],
  );
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<IChartApi | null>(null);
  const series = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const queryClient = useQueryClient();
  const [queryKey, data] = queryClient.getQueriesData<InfiniteData<Page>>({
    queryKey: ['candles'],
  })[0];
  const pageIndex = useRef(data ? data.pages.length - 2 : 0);

  const { backtests } = useBacktestData();
  const trades = useRef(new Map<string, ITrade[]>(backtests.values().next().value[1].trades));

  const chartTooltipRef = useRef<HTMLDivElement>(null);
  const tooltipLayout = useRef({
    width: 80,
    height: 80,
    margin: 15,
  });

  const onVisibleLogicalRangeChanged = useCallback(
    (chart: IChartApi, candleSeries: ISeriesApi<'Candlestick'>) => {
      if (!data || pageIndex.current < 0) {
        return false;
      }
      const range = chart.timeScale().getVisibleLogicalRange();
      if (!range) {
        return false;
      }

      const barsInfo = candleSeries.barsInLogicalRange(range);
      if (!barsInfo) {
        return false;
      }

      if (barsInfo.barsBefore < 50) {
        let oldCandles = candleSeries.data();
        let newCandles = data?.pages[pageIndex.current].kline.map(
          ([time, open, high, low, close]) => ({
            time: (time / 1000) as UTCTimestamp,
            open: parseFloat(open as string),
            high: parseFloat(high as string),
            low: parseFloat(low as string),
            close: parseFloat(close as string),
          }),
        );
        // newCandles.pop();
        candleSeries.setData([...(newCandles ?? []), ...oldCandles] as CandlestickData[]);
        pageIndex.current -= 1;
      }
      return false;
    },
    [],
  );
  const onVisibleLogicalRangeChangedRef = useRef(
    debounce(onVisibleLogicalRangeChanged, 500),
  ).current;
  const onCrosshairMoved = useCallback(({ point, time, seriesData }: MouseEventParams) => {
    if (!chartContainerRef.current || !chartTooltipRef.current) return false;
    if (!series.current) return false;
    if (
      point === undefined ||
      !time ||
      point.x < 0 ||
      point.x > chartContainerRef.current.clientWidth ||
      point.y < 0 ||
      point.y > chartContainerRef.current.clientHeight
    ) {
      chartTooltipRef.current.style.display = 'none';
    } else {
      chartTooltipRef.current.style.display = 'flex';
      chartTooltipRef.current.style.flexDirection = 'column';

      const y = point.y;
      let left = point.x + tooltipLayout.current.margin;
      if (left > chartContainerRef.current.clientWidth - tooltipLayout.current.width) {
        left = point.x - tooltipLayout.current.margin - tooltipLayout.current.width;
      }
      if (left + 70 + chartTooltipRef.current.clientWidth > chartContainerRef.current.clientWidth) {
        left = left - chartTooltipRef.current.clientWidth - 12 - 20;
      }

      let top = y + tooltipLayout.current.margin;
      if (top > chartContainerRef.current.clientHeight - tooltipLayout.current.height) {
        top = y - tooltipLayout.current.height - tooltipLayout.current.margin;
      }
      chartTooltipRef.current.style.left = `${left + 70 || 0}px`;
      chartTooltipRef.current.style.top = `${top - 70 || 0}px`;

      chartTooltipRef.current.innerHTML = `<span>${Intl.DateTimeFormat('en-MY', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'GMT',
      }).format(new Date(parseInt(time.toString()) * 1000))}</span>
        <span>Price: ${(seriesData.get(series.current) as CandlestickData).close.toFixed(
          2,
        )}</span>`;
    }
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chart.current = createChart(chartContainerRef.current, chartOptions);
    series.current = chart.current.addCandlestickSeries(candleOptions);
    const candleStickData = data?.pages[data?.pages.length - 1].kline.map(
      ([time, open, high, low, close]) => ({
        time: (time / 1000) as UTCTimestamp,
        open: parseFloat(open as string),
        high: parseFloat(high as string),
        low: parseFloat(low as string),
        close: parseFloat(close as string),
      }),
    );
    const markers = trades.current
      .values()
      .next()
      .value.map(({ price, quantity, side, time }: ITrade) => ({
        time: (+time / 1000) as UTCTimestamp,
        position: side === 'sell' ? 'belowBar' : 'aboveBar',
        color: side === 'sell' ? '#ff4976' : '#4bffb5',
        shape: side === 'sell' ? 'arrowDown' : 'arrowUp',
        text: `${side.toUpperCase()} ${quantity}\n${price}`,
        id: `${new Date(time).getTime()}`,
      })) as SeriesMarker<Time>[];

    series.current.setData(candleStickData as CandlestickData[]);
    series.current.setMarkers(markers);
    chart.current
      .timeScale()
      .subscribeVisibleLogicalRangeChange(() =>
        onVisibleLogicalRangeChangedRef(chart.current!, series.current),
      );
    chart.current.subscribeCrosshairMove(onCrosshairMoved);

    return () => {
      chart.current?.remove();
    };
  }, []);

  return (
    <div className="h-full">
      <div className="w-full h-full relative" ref={chartContainerRef}>
        <div
          className={cn(
            'z-50 border w-fit rounded-md px-3 py-1 absolute bg-white text-black dark:bg-[#37332A] dark:text-white',
          )}
          ref={chartTooltipRef}
        ></div>
      </div>
    </div>
  );
};

export default NewCandleChart;
