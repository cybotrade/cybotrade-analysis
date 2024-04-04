'use client';

import { useRef } from 'react';

import { EquityCurveChart } from '@app/_features/dashboard/left/content/equity-curve/EquityCurveChart';
import { PerformanceData } from '@app/_lib/calculation';
import { cn } from '@app/_lib/utils';
import { useBacktestData } from '@app/_providers/backtest';

export const NewEquityCurve = () => {
  const { backtests } = useBacktestData();
  const performance = useRef(
    new Map<string, PerformanceData>(backtests.values().next().value[1].performance),
  );
  const equityData = performance.current.values().next().value.equityData;

  if (backtests.size === 0) throw new Error('Invalid Visit');

  return (
    <div className={cn('w-full h-full rounded-xl flex items-center justify-center')}>
      <EquityCurveChart equityData={equityData} />
    </div>
  );
};
