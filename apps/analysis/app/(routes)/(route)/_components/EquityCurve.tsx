import { Kline } from 'binance';
import { ColorType, createChart } from 'lightweight-charts';
import type {
  IChartApi,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  UTCTimestamp,
} from 'lightweight-charts';
import { FolderSearch } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Interval } from '@cybotrade/core';

import { Loading } from '@app/_components/loading';
import { calculateEquity } from '@app/_lib/calculation';

import { IBackTestData } from '../type';

interface IEquityData {
  value: number;
  time: UTCTimestamp;
}

export const EquityCurve = ({
  backtestData,
  klineData,
}: {
  backtestData: IBackTestData;
  symbol: string;
  interval: Interval;
  klineData: Kline[];
}) => {
  const { resolvedTheme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [equityData, setEquityData] = useState<IEquityData[]>([]);

  let chart: IChartApi | null = null;

  useEffect(() => {
    if (klineData && klineData.length > 0 && backtestData.trades.length > 0) {
      const equityData = calculateEquity({ klineData: klineData, trades: backtestData.trades });
      setEquityData(equityData);
    }
  }, [klineData]);

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
      backtestData?.trades.map((trade) => {
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
    const handleResize = () => {
      chart?.applyOptions({ width: chartContainerRef.current?.clientWidth ?? 0 });
    };

    if (chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: {
            type: ColorType.Solid,
            color: resolvedTheme === 'dark' ? 'transparent' : 'transparent',
          },
          textColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        grid: {
          vertLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
          horzLines: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
      });

      const timeScale = chart.timeScale();
      timeScale.fitContent();
      const newSeries = chart.addAreaSeries({
        lineColor: resolvedTheme === 'dark' ? '#00FC65' : '#66FF30',
        topColor: resolvedTheme === 'dark' ? '#589947' : 'rgba(235, 255, 234, 1)',
        bottomColor: resolvedTheme === 'dark' ? 'rgba(51, 249, 34, 0)' : 'rgba(177, 240, 171, 0)',
        lineWidth: 3,
        lineType: 2,
      });
      if (chart && newSeries) newSeries.setData(equityData);
      newSeries.setMarkers(orders);

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart?.remove();
      };
    }
  }, [resolvedTheme === 'dark', equityData]);

  if (!backtestData && klineData.length === 0)
    return (
      <div className="flex justify-center items-center h-96">
        <Loading description="Loading ..." />
      </div>
    );

  return (
    <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
      <div className="w-full h-[600px] rounded-xl ">
        <div className="flex mx-[60px] pt-12 items-center ">
          <div className="w-5 h-5 rounded-full bg-[#55AEFF] dark:bg-[#107394] border dark:border-white mr-4"></div>
          <div className="text-lg mr-10 text-black dark:text-white">Account Balance</div>
          <div className="w-5 h-5 rounded-full bg-[#2BB89F] dark:bg-[#00FC65] border dark:border-white mr-4"></div>
          <div className="text-lg text-black dark:text-white">Account Equity</div>
        </div>
        {!backtestData ? (
          <Loading description={'Loading data...'} />
        ) : backtestData ? (
          <>
            <div className="pb-12 mx-[60px]">
              <div ref={chartContainerRef} />
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-96 ">
            <div className="icon">
              <FolderSearch className="w-24 h-24" />
            </div>
            <span className="font-bold text-xl">There are no results.</span>
          </div>
        )}
      </div>
    </div>
  );
};