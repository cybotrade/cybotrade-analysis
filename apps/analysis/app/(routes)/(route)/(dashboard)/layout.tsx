import React, { PropsWithChildren } from 'react';

import DashboardMainWrapper from '@app/_features/dashboard/DashboardMainWrapper';
import DashboardLeftSide from '@app/_features/dashboard/left';
import DashboardRightSide from '@app/_features/dashboard/right';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardMainWrapper>{children}</DashboardMainWrapper>;
}
