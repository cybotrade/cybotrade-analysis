import { type Kline } from 'binance';
import type {
  CandlestickData,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  UTCTimestamp,
} from 'lightweight-charts';
import { ColorType, createChart } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { cn } from '@app/_lib/utils';

import { IBackTestData } from '../type';

const socketUrl = 'wss://stream.binance.com:9443/stream';

export const CandleChart = ({
  backtestData,
  klineData,
}: {
  backtestData: IBackTestData;
  klineData: Kline[];
}) => {
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
  const { sendJsonMessage } = useWebSocket(socketUrl);

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
          time: (+time / 1000) as UTCTimestamp,
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
    if (klineData && klineData.length < 1) return;
    setBinanceKlineData(
      klineData.map(([time, open, high, low, close]) => ({
        time: (time / 1000) as UTCTimestamp,
        open: parseFloat(open as string),
        high: parseFloat(high as string),
        low: parseFloat(low as string),
        close: parseFloat(close as string),
      })),
    );
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
      setCandleSeries(candleSeries);
      candleSeries.setMarkers(orders);

      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
      };
      window.addEventListener('resize', handleResize);

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

  return (
    <div className="h-96">
      <div className="w-full h-full px-3 py-4" ref={chartContainerRef}>
        <div className="h-0">
          <div
            className={cn(
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
