import React, { PropsWithChildren } from 'react';

import DashboardMainWrapper from '@app/_features/dashboard/DashboardMainWrapper';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardMainWrapper>{children}</DashboardMainWrapper>;
}
