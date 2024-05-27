'use client';

import React from 'react';

import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { NewMonteCarlo } from '@app/_features/dashboard/left/content/monte-carlo';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { useBacktestData } from '@app/_providers/backtest';

const MonteCarloPage = () => {
  const { progress, selectedBacktest } = useBacktestData();

  return (
    <DashboardContentWrapper>
      {progress !== 100 ? (
        <Processing />
      ) : !selectedBacktest || selectedBacktest.data.size === 0 ? (
        <NoRecord />
      ) : (
        <NewMonteCarlo />
      )}
    </DashboardContentWrapper>
  );
};

export default MonteCarloPage;
