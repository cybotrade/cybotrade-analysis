import { Kline } from 'binance';
import { ColorType, createChart } from 'lightweight-charts';
import type { IChartApi, UTCTimestamp } from 'lightweight-charts';
import { FolderSearch } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '@app/_components/loading';

import { IBackTestData } from '../type';
import { SettingsValue } from './SettingsForm';
import { FullPerformance } from './BackTestResults';

export interface IEquityData {
  value: number;
  time: UTCTimestamp;
}

export const EquityCurve = ({
  fullPerformance,
  selectedBacktest,
  // klineData,
  // userSettings,
}: {
  fullPerformance: FullPerformance[];
  selectedBacktest: IBackTestData;
  // klineData: Kline[];
  // userSettings?: SettingsValue;
}) => {
  const { resolvedTheme } = useTheme();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [equityData, setEquityData] = useState<IEquityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  let chart: IChartApi | null = null;

  const mapEquityData = async () => {
    console.log("mapEquityData")
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
      chart = createChart(chartContainerRef.current, {
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

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart?.remove();
      };
    }
  }, [resolvedTheme === 'dark', equityData]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loading description="Loading ..." />
      </div>
    );

  return (
    <div className={`p-4 ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <div className="w-full h-96 rounded-xlflex items-center justify-center">
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
