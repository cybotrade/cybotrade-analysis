'use client';

import React from 'react';

import { ResultBreakdown } from '@app/_features/dashboard/left/content/result-breakdown';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { PerformanceData } from '@app/_lib/calculation';
import { useBacktestData } from '@app/_providers/backtest';

const ResultBreakdownPage = () => {
  const { processing, backtests, permutationId } = useBacktestData();

  return processing ? (
    <Processing />
  ) : backtests.size === 0 ? (
    <NoRecord />
  ) : (
    <ResultBreakdown
      key={permutationId}
      performance={backtests.values().next().value.performance}
    />
  );
};

export default ResultBreakdownPage;
