import React, { PropsWithChildren } from 'react';

import { DashboardHeader } from '@app/_features/dashboard/left/DashboardHeader';
import { DashboardSidebar } from '@app/_features/dashboard/left/DashboardSidebar';
import { useBacktestData } from '@app/_providers/backtest';

const DashboardLeftSide = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex gap-5">
      <DashboardSidebar />
      <div className="w-full grid auto-rows-[min-content_1fr_min-content]">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLeftSide;
