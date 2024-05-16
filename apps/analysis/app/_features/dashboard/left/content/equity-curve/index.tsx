'use client';

import { EquityCurveChart } from '@app/_features/dashboard/left/content/equity-curve/EquityCurveChart';
import { PerformanceData } from '@app/_lib/calculation';
import { cn } from '@app/_lib/utils';
import { useBacktestData } from '@app/_providers/backtest';

export const NewEquityCurve = () => {
  const { selectedBacktest } = useBacktestData();
  const performance = selectedBacktest.data.values().next().value.performance;
  const equityData = performance.equityData;

  if (!performance) throw new Error('Invalid Visit');
  return (
    <div className={cn('w-full h-full rounded-xl flex items-center justify-center')}>
      <EquityCurveChart key={selectedBacktest.id} equityData={equityData} />
    </div>
  );
};
