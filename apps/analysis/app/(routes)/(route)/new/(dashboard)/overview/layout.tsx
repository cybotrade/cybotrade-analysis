import React, { Fragment, PropsWithChildren } from 'react';

import DashboardLeftSide from '@app/_features/dashboard/left';

export default function OverviewLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <DashboardLeftSide>{children}</DashboardLeftSide>
    </Fragment>
  );
}
