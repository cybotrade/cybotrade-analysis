'use client';

import {
  AreaStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  SeriesOptionsCommon,
  type UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import { FolderSearch } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

export interface IEquityData {
  value: number;
  time: UTCTimestamp;
}

type TEquityCurveChart = {
  equityData: IEquityData[];
};

export const EquityCurveChart = ({ equityData }: TEquityCurveChart) => {
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
          color: 'transparent',
        },
        fontFamily: 'DM Sans, sans-serif',
        textColor: '#9A9A9A',
      },
      leftPriceScale: {
        visible: false,
      },
      rightPriceScale: {
        visible: true,
      },
    }),
    [],
  );
  const seriesOptions = useMemo<DeepPartial<AreaStyleOptions & SeriesOptionsCommon>>(
    () => ({
      lineColor: '#66FF30',
      topColor: 'rgba(235, 255, 234, 1)',
      bottomColor: 'rgba(177, 240, 171, 0)',
      crosshairMarkerBackgroundColor: '#E59E2E',
      lineWidth: 3,
      lineType: 2,
    }),
    [],
  );

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chart.current = createChart(chartContainerRef.current, chartOptions);

    const newSeries = chart.current.addAreaSeries(seriesOptions);
    newSeries.setData(equityData);
    chart.current.timeScale().fitContent();

    return () => {
      chart.current?.remove();
    };
  }, []);

  return equityData.length > 0 ? (
    <div ref={chartContainerRef} className="w-full h-full" />
  ) : (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="icon">
        <FolderSearch className="w-24 h-24" />
      </div>
      <span className="font-bold text-xl">There are no results.</span>
    </div>
  );
};
