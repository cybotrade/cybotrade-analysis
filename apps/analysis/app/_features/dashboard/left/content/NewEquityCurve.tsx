'use client';

import { toDate } from 'date-fns';
import {
  AreaData,
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  SeriesOptionsCommon,
  TickMarkFormatter,
  TickMarkType,
  Time,
  TimeChartOptions,
  createChart,
} from 'lightweight-charts';
import type { IChartApi, UTCTimestamp } from 'lightweight-charts';
import { FolderSearch } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Loading } from '@app/_components/loading';
import { useSystemTheme } from '@app/_hooks/useSystemTheme';
import { cn } from '@app/_lib/utils';

export interface IEquityData {
  value: number;
  time: UTCTimestamp;
}

const data = [
  { value: 0, time: 1642425322 },
  { value: 8, time: 1642511722 },
  {
    value: 10,
    time: 1642598122,
  },
  { value: 20, time: 1642684522 },
  { value: 3, time: 1642770922 },
  { value: 43, time: 1642857322 },
  {
    value: 41,
    time: 1642943722,
  },
  { value: 43, time: 1643030122 },
  { value: 56, time: 1643116522 },
  { value: 46, time: 1643202922 },
];

export const NewEquityCurve = () => {
  const [_, theme] = useSystemTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chart = useRef<IChartApi | null>(null);
  const chartOptions = useMemo<DeepPartial<ChartOptions>>(
    () => ({
      autoSize: true,
      grid: {
        vertLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        horzLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: theme === 'dark' ? 'transparent' : 'transparent',
        },
        fontFamily: 'DM Sans, sans-serif',
        textColor: theme === 'dark' ? '#ffffff' : '#9A9A9A',
      },
      leftPriceScale: {
        visible: true,
      },
      rightPriceScale: {
        visible: false,
      },
    }),
    [],
  );
  const seriesOptions = useMemo<DeepPartial<AreaStyleOptions & SeriesOptionsCommon>>(
    () => ({
      lineColor: theme === 'dark' ? '#00FC65' : '#66FF30',
      topColor: theme === 'dark' ? '#589947' : 'rgba(235, 255, 234, 1)',
      bottomColor: theme === 'dark' ? 'rgba(51, 249, 34, 0)' : 'rgba(177, 240, 171, 0)',
      crosshairMarkerBackgroundColor: '#E59E2E',
      lineWidth: 3,
      lineType: 2,
    }),
    [],
  );
  const [equityData, setEquityData] = useState<IEquityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chartContainerRef.current) {
      if (chart.current) {
        chart.current.remove();
      }
      chart.current = createChart(chartContainerRef.current, chartOptions);
    }

    if (chart.current) {
      const newSeries = chart.current.addAreaSeries(seriesOptions);
      newSeries.setData(data as AreaData[]);
      chart.current.timeScale().fitContent();
    }

    // const handleResize = () => {
    //   chart.current?.applyOptions({ width: chartContainerRef.current?.clientWidth ?? 0 });
    // };
    //
    // window.addEventListener('resize', handleResize);
    //
    // return () => {
    //   window.removeEventListener('resize', handleResize);
    // };
  }, [theme === 'dark', equityData]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loading description="Loading ..." />
      </div>
    );

  return (
    <div
      className={cn(
        'p-12',
        theme === 'dark' && 'dark',
        'w-full h-full rounded-xl flex items-center justify-center',
      )}
    >
      {equityData.length > 0 ? (
        <div ref={chartContainerRef} className="w-full h-full" />
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="icon">
            <FolderSearch className="w-24 h-24" />
          </div>
          <span className="font-bold text-xl">There are no results.</span>
        </div>
      )}
    </div>
  );
};
