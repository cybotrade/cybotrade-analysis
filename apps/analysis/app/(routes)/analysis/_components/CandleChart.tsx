// import { type RouterOutput } from '@server/trpc';
import { type Kline } from 'binance';
import clsx from 'clsx';
import type {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  LogicalRange,
  MouseEventParams,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  UTCTimestamp,
} from 'lightweight-charts';
import { ColorType, createChart } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { Interval } from '@cybotrade/core';

import { Loading } from '@app/_components/loading';
import { intervalToMilliseconds } from '@app/_lib/utils';

import { IBackTestData } from '../type';

const socketUrl = 'wss://stream.binance.com:9443/stream';

export const CandleChart = ({ backtestData }: { backtestData: IBackTestData }) => {
  const { resolvedTheme } = useTheme();
  const [binanceKlineData, setBinanceKlineData] = useState<
    {
      time: UTCTimestamp | string;
      open: number;
      high: number;
      low: number;
      close: number;
    }[]
  >([]);
  const klineDataPerFetch = 500;
  const { sendJsonMessage } = useWebSocket(socketUrl);
  const [klineData, setKlineData] = useState<Kline[]>([]);
  const [isFetchingKlineData, setIsFetchingKlineData] = useState<boolean>(true);
  const [fetchedKlineDate, setFetchedKlineDate] = useState<number | undefined>();
  const [lastLogicalRange, setLastLogicalRange] = useState<LogicalRange | null>(null);
  const [symbol, setSymbol] = useState<string>();
  const [interval, setInterval] = useState<Interval>();
  const [startTime, setStartTime] = useState<number>();

  useEffect(() => {
    const symbol = backtestData ? backtestData.symbol.split('/').join('') : 'BTCUSDT';
    setSymbol(symbol);

    const interval = backtestData
      ? Interval[backtestData.intervals[0] as unknown as keyof typeof Interval]
      : Interval.OneDay;
    setInterval(interval);

    const startTime = backtestData
      ? parseInt(backtestData?.trades[0]?.time.toString() || '')
      : undefined;
    setStartTime(startTime);
    const fetchCompleteKlineData = async (pStartTime: string) => {
      setIsFetchingKlineData(true);
      try {
        const req = await fetch(
          '/api/candle?' +
            new URLSearchParams({
              symbol,
              interval,
              startTime: pStartTime,
              endTime: new Date().getTime().toString(),
            }),
          {
            method: 'GET',
          },
        );
        if (!req.ok) {
          throw new Error(`HTTP error! Status: ${req.status}`);
        }
        const res: Kline[] = await req.json();
        setKlineData(res);
        setIsFetchingKlineData(false);
        return res;
      } catch (error) {
        console.error('Error fetching kline data:', error);
        setIsFetchingKlineData(false);
        return [];
      }
    };

    fetchCompleteKlineData(
      (new Date().getTime() - intervalToMilliseconds(interval) * klineDataPerFetch).toString(),
    );

    return () => {
      setKlineData([]);
    };
  }, [backtestData]);

  useEffect(() => {
    if (!isFetchingKlineData || !interval || !symbol || !klineData || !startTime || !chart) return;
    const currentFetchedKlineStartDate = klineData[0]?.[0] ?? 0;

    setLastLogicalRange(chart.timeScale().getVisibleLogicalRange());
    if (fetchedKlineDate === currentFetchedKlineStartDate) return;
    if (fetchedKlineDate && fetchedKlineDate < startTime) return;
    const nextStartTime =
      (fetchedKlineDate || currentFetchedKlineStartDate) -
      intervalToMilliseconds(interval) * klineDataPerFetch;

    const fetchCompleteKlineData = async (pStartTime: string) => {
      const req = await fetch(
        '/api/candle?' +
          new URLSearchParams({
            symbol,
            interval,
            startTime: pStartTime,
            endTime: new Date().getTime().toString(), //to change
          }),
        {
          method: 'GET',
        },
      );
      const res: Kline[] = await req.json();
      setKlineData((prev) => [...prev, ...res]);
      setFetchedKlineDate(res[0]?.[0]);
      setIsFetchingKlineData(false);
      return res;
    };
    fetchCompleteKlineData(nextStartTime.toString());
  }, [isFetchingKlineData]);

  const orders = useMemo(() => {
    const markers: {
      time: UTCTimestamp;
      position: SeriesMarkerPosition;
      color: string;
      shape: SeriesMarkerShape;
      text: string;
      id: string;
    }[] = [];
    if (backtestData) {
      const trades = backtestData?.trades;
      trades?.map((trade) => {
        const { price, quantity, side, time } = trade;
        markers.push({
          time: (new Date(time).getTime() / 1000) as UTCTimestamp,
          position: side === 'Sell' ? 'belowBar' : ('aboveBar' as SeriesMarkerPosition),
          color: side === 'Sell' ? '#ff4976' : '#4bffb5',
          shape: side === 'Sell' ? 'arrowDown' : ('arrowUp' as SeriesMarkerShape),
          text: `${side.toUpperCase()} ${quantity}\n${price}`,
          id: `${new Date(time).getTime()}`,
        });
      });
    }
    return markers.sort((a, b) => a.time - b.time);
  }, [backtestData]);

  useEffect(() => {
    sendJsonMessage({
      method: 'SUBSCRIBE',
      params: ['btcusdt@kline_1d'],
      id: 1,
    });

    return () => {
      sendJsonMessage({
        method: 'UNSUBSCRIBE',
        params: ['btcusdt@kline_1d'],
        id: 1,
      });
    };
  }, []);

  useEffect(() => {
    if (klineData.length < 1) return;
    const historicalData = klineData.map(([time, open, high, low, close]) => ({
      time: (time / 1000) as UTCTimestamp,
      open: parseFloat(open as string),
      high: parseFloat(high as string),
      low: parseFloat(low as string),
      close: parseFloat(close as string),
    }));
    setBinanceKlineData((prev) => {
      const arr = [...historicalData, ...prev];
      arr.sort((a, b) => (a.time as number) - (b.time as number));
      return arr.filter((data, index) => {
        if (index === arr.map((d) => d.time).lastIndexOf(data.time)) return true;
        else return false;
      });
    });
  }, [klineData]);

  const chartContainerRef: any = useRef<HTMLDivElement>(null);
  const chartTooltipRef: any = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [left, setLeft] = useState<number>();
  const [top, setTop] = useState<number>();
  const [timeData, setTimeData] = useState<string>();
  const [candleData, setCandleData] = useState<number>();

  const [chart, setChart] = useState<IChartApi>();
  const [candleSeries, setCandleSeries] = useState<ISeriesApi<'Candlestick'> | undefined>();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: {
            type: ColorType.Solid,
            color: resolvedTheme === 'dark' ? '#473E2D' : 'transparent',
          },
          textColor: resolvedTheme === 'dark' ? 'white' : 'black',
        },
        grid: {
          vertLines: {
            color: resolvedTheme === 'dark' ? '#706C6C' : '#E2E2E2',
          },
          horzLines: {
            color: resolvedTheme === 'dark' ? '#706C6C' : '#E2E2E2',
          },
        },
        rightPriceScale: {
          visible: true,
        },
        leftPriceScale: {
          visible: true,
        },
        width: chartContainerRef.current.clientWidth,
        height: 350,
      });
      const candleSeries = chart.addCandlestickSeries({
        upColor: resolvedTheme === 'dark' ? '#00FC65' : '#4bffb5',
        downColor: resolvedTheme === 'dark' ? '#FF4646' : '#ff4976',
        borderUpColor: resolvedTheme === 'dark' ? '#00FC65' : '#4bffb5',
        borderDownColor: resolvedTheme === 'dark' ? '#FF4646' : '#ff4976',
        wickUpColor: '#838ca1',
        wickDownColor: '#838ca1',
      });
      candleSeries.setData(binanceKlineData);
      const logicalRange = chart.timeScale().getVisibleLogicalRange();
      if (fetchedKlineDate && interval && logicalRange && lastLogicalRange) {
        chart.timeScale().setVisibleLogicalRange({
          from: lastLogicalRange.from + 500,
          to: lastLogicalRange.to + 500,
        });
      }
      candleSeries.setMarkers(orders);
      setCandleSeries(candleSeries);

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
      };
      window.addEventListener('resize', handleResize);

      const subs = (newVisibleTimeRange: any) => {
        if (!newVisibleTimeRange) return;
        const chartStartTime = (newVisibleTimeRange.from as number) * 1000;
        if (chartStartTime <= parseInt(binanceKlineData[0]?.time as string) * 1000) {
          !isFetchingKlineData && setIsFetchingKlineData(true);
        } else setIsFetchingKlineData(false);
      };
      chart.timeScale().subscribeVisibleTimeRangeChange(subs);

      const toolTipWidth = 80;
      const toolTipHeight = 80;
      const toolTipMargin = 15;

      chart.subscribeCrosshairMove((param) => {
        if (
          param.point === undefined ||
          !param.time ||
          param.point.x < 0 ||
          param.point.x > chartContainerRef.clientWidth ||
          param.point.y < 0 ||
          param.point.y > chartContainerRef.clientHeight
        ) {
          setIsTooltipVisible(false);
        } else {
          setIsTooltipVisible(true);
          setTimeData(param.time.toString());

          const y = param.point.y;
          let left = param.point.x + toolTipMargin;
          if (left > chartContainerRef.clientWidth - toolTipWidth) {
            left = param.point.x - toolTipMargin - toolTipWidth;
          }
          if (
            left + 70 + chartTooltipRef.current.clientWidth >
            chartContainerRef.current.clientWidth
          ) {
            left = left - chartTooltipRef.current.clientWidth - 12 - 20;
          }

          let top = y + toolTipMargin;
          if (top > chartContainerRef.clientHeight - toolTipHeight) {
            top = y - toolTipHeight - toolTipMargin;
          }
          setLeft(left);
          setTop(top);
        }
      });

      setChart(chart);
      return () => {
        setChart(undefined);
        window.removeEventListener('resize', handleResize);
        chart.timeScale().unsubscribeVisibleTimeRangeChange(subs);
        chart.remove();
      };
    }
  }, [binanceKlineData, orders]);

  useEffect(() => {
    if (!chart) return;

    chart.applyOptions({
      layout: {
        background: {
          type: ColorType.Solid,
          color: resolvedTheme === 'dark' ? '#473E2D' : 'transparent',
        },
        textColor: resolvedTheme === 'dark' ? 'white' : 'black',
      },
      grid: {
        vertLines: {
          color: resolvedTheme === 'dark' ? '#706C6C' : '#E2E2E2',
        },
        horzLines: {
          color: resolvedTheme === 'dark' ? '#706C6C' : '#E2E2E2',
        },
      },
    });
  }, [resolvedTheme]);

  useEffect(() => {
    if (!chart || isTooltipVisible === false) return;

    const event = (param: MouseEventParams) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > chartContainerRef.clientWidth ||
        param.point.y < 0 ||
        param.point.y > chartContainerRef.clientHeight
      )
        return;
      if (candleSeries)
        setCandleData((param.seriesData.get(candleSeries) as CandlestickData).close);
    };

    chart.subscribeCrosshairMove(event);

    return () => {
      chart.unsubscribeCrosshairMove(event);
    };
  }, [candleSeries, isTooltipVisible]);

  if (isFetchingKlineData && klineData.length === 0)
    return (
      <div className="flex justify-center items-center h-96">
        <Loading description="Loading ..." />
      </div>
    );

  return (
    <div className="h-96">
      <div className="w-full h-full px-3 py-4" ref={chartContainerRef}>
        <div className="h-0">
          <div
            className={clsx(
              'z-50 border w-fit rounded-md px-3 py-1 relative bg-white text-black dark:bg-[#37332A] dark:text-white',
              isTooltipVisible ? 'block' : '-z-10 hidden',
            )}
            style={{
              left: left ? left + 70 : undefined,
              top: top ? top - 50 : undefined,
            }}
            ref={chartTooltipRef}
          >
            {timeData && (
              <div>
                {new Intl.DateTimeFormat('en-MY', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                  timeZone: 'GMT',
                }).format(new Date(parseInt(timeData) * 1000))}
              </div>
            )}
            {candleData && <div>Price: {candleData.toFixed(2)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};
