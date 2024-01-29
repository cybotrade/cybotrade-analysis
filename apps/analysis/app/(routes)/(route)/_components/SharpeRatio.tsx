import { Kline } from 'binance';
import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import { Interval } from '@cybotrade/core';

import { IBackTestData } from '@app/(routes)/(route)/type';
import { calculateSharpeRatio } from '@app/_lib/calculation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

type SharpeRatioProps = {
  backtestData: IBackTestData[];
  klineData: Kline[];
  interval: Interval;
};

const SharpeRatio = ({ backtestData, klineData, interval }: SharpeRatioProps) => {
  const { resolvedTheme } = useTheme();
  const chartData: ChartData<'bar'> = useMemo(() => {
    const data = backtestData.map((d) => {
      let sharpeRatio = calculateSharpeRatio({
        klineData,
        inputTrades: d.trades,
        interval,
      }).toDecimalPlaces(2);
      return {
        id: d.id,
        sharpeRatio,
      };
    });
    return {
      labels: data.map((d) => d.id),
      datasets: [
        {
          data: data.map((d) => d.sharpeRatio.toNumber()),
          backgroundColor: 'rgb(255,194,120)',
        },
      ],
    };
  }, [backtestData]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
          scaleMode: 'xy',
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div className={`relative w-full h-[35rem] ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <div className="absolute left-0 p-4  w-full h-full">
        <Bar data={chartData} options={options} className="p-10" />
      </div>
    </div>
  );
};

export default SharpeRatio;
