'use client';

import React, { PropsWithChildren } from 'react';

import { RightColumnContent } from '@app/_features/dashboard/right/RightColumnContent';
import { useBacktestData } from '@app/_providers/backtest';

type TDashboardRightSideProps = {
  loading: React.ReactNode;
  error: React.ReactNode;
};

const DashboardRightSide = ({ loading, error }: TDashboardRightSideProps) => {
  const { backtests, permutationId, processing } = useBacktestData();
  return (
    <div className="col-[2] grid grid-rows-[5%_auto_min-content] w-full h-full gap-3 rounded-lg bg-[#FFFFFF] border border-[#E1D9D6] px-5 py-3">
      {processing ? (
        loading
      ) : backtests.size === 0 ? (
        error
      ) : (
        <RightColumnContent
          key={permutationId}
          performance={backtests.values().next().value.performance}
        />
      )}
    </div>
  );
};

export default DashboardRightSide;
