'use client';

import {
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  ScriptableContext,
  registerables,
} from 'chart.js';
import { format } from 'date-fns';
import React, { useMemo, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';
import { PnlInfo } from '@app/_lib/calculation';
import { useBacktestData } from '@app/_providers/backtest';

Chart.register(...registerables);

type TBalanceChartWidgetProps = {
  startingBalance: string;
  finalBalance: string;
  ariCumulativeUnrealizedPnlInfo: PnlInfo[];
  geoCumulativeUnrealizedPnlInfo: PnlInfo[];
};
export const BalanceChartWidget = ({
  startingBalance,
  finalBalance,
  ariCumulativeUnrealizedPnlInfo,
  geoCumulativeUnrealizedPnlInfo,
}: TBalanceChartWidgetProps) => {
  const { mode } = useBacktestData();
  const data: ChartData<'bar'> = useMemo(() => {
    let chartData: { labels: string[]; data: number[] } = { labels: [], data: [] };
    if (mode === 'ARITHMETIC') {
      chartData = {
        labels: ariCumulativeUnrealizedPnlInfo.map((info, i) => format(info.time, 'd MMM yy')),
        data: ariCumulativeUnrealizedPnlInfo.map((info) => Number(info.value)),
      };
    } else if (mode === 'GEOMETRIC') {
      chartData = {
        labels: geoCumulativeUnrealizedPnlInfo.map((info, i) => format(info.time, 'd MMM yy')),
        data: geoCumulativeUnrealizedPnlInfo.map((info) => Number(info.value)),
      };
    }
    return {
      labels: chartData.labels,
      datasets: [
        {
          data: chartData.data,
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
          // barPercentage: 0.8,
          // categoryPercentage: 1.0,
        },
      ],
    };
  }, []);
  const options = useRef<ChartOptions<'bar'>>({
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
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
        ticks: {
          display: false,
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
          content={startingBalance}
          labelClassName="text-[#9A9A9A] order-last"
          contentClassName="text-2xl text-primary font-bold"
        />
        <Stat
          containerClassName="float-right text-right"
          label="Final Balance"
          content={finalBalance}
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
