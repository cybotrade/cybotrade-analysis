'use client';

import { EquityCurveChart } from '@app/_features/dashboard/left/content/equity-curve/EquityCurveChart';
import { PerformanceData } from '@app/_lib/calculation';
import { cn } from '@app/_lib/utils';
import { useBacktestData } from '@app/_providers/backtest';

export const NewEquityCurve = () => {
  const { permutationId, backtests } = useBacktestData();
  const performance = backtests.values().next().value.performance;
  const equityData = performance.equityData;

  if (backtests.size === 0) throw new Error('Invalid Visit');
  return (
    <div className={cn('w-full h-full rounded-xl flex items-center justify-center')}>
      <EquityCurveChart key={permutationId} equityData={equityData} />
    </div>
  );
};
