'use client';

import React from 'react';

import { ResultBreakdown } from '@app/_features/dashboard/left/content/result-breakdown';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { PerformanceData } from '@app/_lib/calculation';
import { useBacktestData } from '@app/_providers/backtest';

const ResultBreakdownPage = () => {
  const { progress, selectedBacktest } = useBacktestData();

  return progress !== 100 ? (
    <Processing />
  ) : !selectedBacktest || selectedBacktest.data.size === 0 ? (
    <NoRecord />
  ) : (
    <ResultBreakdown
      key={selectedBacktest.id}
      performance={selectedBacktest.data.values().next().value.performance}
    />
  );
};

export default ResultBreakdownPage;
