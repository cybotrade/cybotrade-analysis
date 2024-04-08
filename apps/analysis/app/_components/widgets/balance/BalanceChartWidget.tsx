'use client';

import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  ScriptableContext,
  registerables,
} from 'chart.js';
import React, { useMemo, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

Chart.register(...registerables);

const dummyChartData = {
  label: ['1 Apr 23', '', '', '', 'JUL', '', '', '', '', '', '', 'SEP', '', '', '', '1 Jan 24'],
  data: [0.5, 0.55, 0.6, 0.7, 0.8, 0.85, 0.9, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.7, 0.75, 0.8],
};
export const BalanceChartWidget = () => {
  const data: ChartData<'bar'> = useMemo(
    () => ({
      labels: dummyChartData.label,
      datasets: [
        {
          data: dummyChartData.data,
          fill: 'start',
          backgroundColor: (context: ScriptableContext<'bar'>) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, '#FC9E26');
            gradient.addColorStop(1, '#F7EFE5');
            return gradient;
          },
          borderRadius: 50,
          borderSkipped: false,
          barPercentage: 0.8,
          categoryPercentage: 1.0,
        },
      ],
    }),
    [],
  );
  const options = useRef<ChartOptions<'bar'>>({
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          callback: (value, index) => {
            if (index === 0 || index === 4 || index === 11 || index === 15) {
              return String(data.labels![index]);
            }
          },
          color: '#232222',
          font: {
            family: 'Sora, sans-serif',
            size: 16,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 1,
        ticks: {
          maxTicksLimit: 3,
          callback: (value, index, ticks) => `${value}%`,
          color: '#8A8A8A',
          font: {
            family: 'Sora, sans-serif',
            size: 16,
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  });

  return (
    <Widget className="font-sora bg-white p-8 rounded-2xl flex flex-col justify-between h-full gap-2">
      <div>
        <Stat
          containerClassName="float-left"
          label="Starting Balance"
          content="USDT 10000"
          labelClassName="text-[#9A9A9A] order-last"
          contentClassName="text-2xl text-primary font-bold"
        />
        <Stat
          containerClassName="float-right text-right"
          label="Final Balance"
          content="USDT 12731.03"
          labelClassName="text-[#9A9A9A] order-last"
          contentClassName="text-2xl text-primary font-bold"
        />
      </div>
      <div className="w-full">
        <Bar className="!w-full !max-h-[12rem]" data={data} options={options.current} />
      </div>
    </Widget>
  );
};
