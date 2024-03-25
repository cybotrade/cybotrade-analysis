import React, { PropsWithChildren } from 'react';

import { DashboardHeader } from '@app/_features/dashboard/left/DashboardHeader';
import { DashboardSidebar } from '@app/_features/dashboard/left/DashboardSidebar';

const DashboardLeftSide = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex gap-5">
      <DashboardSidebar />
      <div className="w-full h-auto">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLeftSide;
