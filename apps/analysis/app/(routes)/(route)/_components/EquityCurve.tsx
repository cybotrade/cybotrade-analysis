import { Kline } from 'binance';
import { ColorType, type ISeriesApi, createChart } from 'lightweight-charts';
import type { IChartApi, UTCTimestamp } from 'lightweight-charts';
import { FolderSearch } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

import { IntervalsToolbar } from '@app/_components/chart/IntervalsToolbar';
import { Loading } from '@app/_components/loading';
import { Interval, intervalSince, intervalToSeconds } from '@app/_lib/utils';

import { IBackTestData } from '../type';
import { FullPerformance } from './BackTestResults';
import { SettingsValue } from './SettingsForm';

export interface IEquityData {
  value: number;
  time: UTCTimestamp;
}

export const EquityCurve = ({
  fullPerformance,
  selectedBacktest, // klineData,
} // userSettings,
: {
  fullPerformance: FullPerformance[];
  selectedBacktest: IBackTestData;
  // klineData: Kline[];
  // userSettings?: SettingsValue;
}) => {
  const { resolvedTheme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [equityData, setEquityData] = useState<IEquityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chart, setChart] = useState<IChartApi>();
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Area'> | undefined>();

  const mapEquityData = async () => {
    let performanceData = fullPerformance.find((x) => x.id === selectedBacktest.id);
    setIsLoading(true);
    setEquityData(performanceData?.performance.equityData!);
    setIsLoading(false);
  };

  useEffect(() => {
    mapEquityData();
    const handleResize = () => {
      chart?.applyOptions({ width: chartContainerRef.current?.clientWidth ?? 0 });
    };

    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: {
            type: ColorType.Solid,
            color: resolvedTheme === 'dark' ? 'transparent' : 'transparent',
          },
          textColor: resolvedTheme === 'dark' ? '#ffffff' : '#000000',
        },
        width: chartContainerRef.current.clientWidth,
        height: 370,
        grid: {
          vertLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
          horzLines: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        timeScale: {
          minBarSpacing: 0,
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

      if (chart && newSeries) {
        newSeries.setData(equityData);
        setChart(chart);
        setLineSeries(newSeries);
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart?.remove();
      };
    }
  }, [resolvedTheme === 'dark', equityData, selectedBacktest]);

  const handleIntervalSelect = (interval: Interval) => {
    if (!lineSeries) return;

    if (!interval) {
      lineSeries.setData(equityData);
      return;
    }

    let nextIntervalTime = intervalSince(+equityData[0].time, +equityData[0].time, interval);
    let filteredEquityData = equityData.filter((tick) => {
      if (+tick.time < nextIntervalTime) return false;

      nextIntervalTime = intervalSince(
        +tick.time + intervalToSeconds(interval)!,
        +equityData[0].time,
        interval,
      );

      return true;
    });

    lineSeries.setData(filteredEquityData);
    chart?.timeScale().fitContent();
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loading description="Loading ..." />
      </div>
    );

  return (
    <div className={`p-4 ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <IntervalsToolbar
        intervals={[
          Interval.TwoHour,
          Interval.FourHour,
          Interval.SixHour,
          Interval.TwelveHour,
          Interval.OneDay,
          Interval.OneWeek,
        ]}
        onIntervalSelect={handleIntervalSelect}
      />
      <div className="w-full h-96 rounded-xl flex items-center justify-center">
        {equityData.length > 0 ? (
          <div className="pl-12 h-full w-full">
            <div ref={chartContainerRef} />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full ">
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
