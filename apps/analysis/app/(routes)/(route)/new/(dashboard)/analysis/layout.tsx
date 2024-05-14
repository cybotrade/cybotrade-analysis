import React, { Fragment, PropsWithChildren } from 'react';

import DashboardLeftSide from '@app/_features/dashboard/left';
import { DashboardFooter } from '@app/_features/dashboard/left/DashboardFooter';
import DashboardRightSide from '@app/_features/dashboard/right';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';

export default function AnalysisLayout({ children }: PropsWithChildren) {
  return (
    <Fragment>
      <DashboardLeftSide>
        {children}
        <DashboardFooter />
      </DashboardLeftSide>
      <DashboardRightSide loading={<Processing />} error={<NoRecord />} />
    </Fragment>
  );
}
