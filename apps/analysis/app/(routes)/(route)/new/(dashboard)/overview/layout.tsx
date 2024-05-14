import React, { PropsWithChildren } from 'react';

import DashboardLeftSide from '@app/_features/dashboard/left';

export default function OverviewLayout({ children }: PropsWithChildren) {
  return <DashboardLeftSide>{children}</DashboardLeftSide>;
}
