'use client';

import React from 'react';

import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import NewCandleChart from '@app/_features/dashboard/left/content/candle-chart';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { useBacktestData } from '@app/_providers/backtest';

const CandleChartPage = () => {
  const { processing, selectedBacktest } = useBacktestData();
  return (
    <DashboardContentWrapper>
      {processing ? (
        <Processing />
      ) : !selectedBacktest || selectedBacktest.data.size === 0 ? (
        <NoRecord />
      ) : (
        <NewCandleChart />
      )}
    </DashboardContentWrapper>
  );
};

export default CandleChartPage;
