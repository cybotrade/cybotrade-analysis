'use client';

import React from 'react';

import { ResultBreakdown } from '@app/_features/dashboard/left/content/result-breakdown';
import { PerformanceData } from '@app/_lib/calculation';
import { useBacktestData } from '@app/_providers/backtest';

const ResultBreakdownPage = () => {
  const { backtests, selectedPermutationId } = useBacktestData();
  const performance = backtests.get(selectedPermutationId)?.performance.values().next().value;

  if (backtests.size === 0) throw new Error('Invalid Visit');

  return <ResultBreakdown key={selectedPermutationId} performance={performance} />;
};

export default ResultBreakdownPage;
