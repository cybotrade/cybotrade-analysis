'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import React, { Fragment, PropsWithChildren } from 'react';

import RadialMenu from '@app/_components/shared/RadialMenu';
import DashboardLeftSide from '@app/_features/dashboard/left';
import { DashboardFooter } from '@app/_features/dashboard/left/DashboardFooter';
import DashboardRightSide from '@app/_features/dashboard/right';
import { NoRecord } from '@app/_features/dashboard/status/no-record';
import { Processing } from '@app/_features/dashboard/status/processing';
import { useFileData } from '@app/_providers/file';

const DashboardMainWrapper = ({ children }: PropsWithChildren) => {
  const segment = useSelectedLayoutSegment();
  const { data } = useFileData();
  if (!data || data.permutations.size === 0) throw new Error('Invalid Visit');

  return (
    <Fragment>
      <RadialMenu />
      <div className="w-full h-full grid auto-cols-[1fr_28rem] gap-8">
        <DashboardLeftSide>
          {children}
          {segment === 'analysis' && <DashboardFooter />}
        </DashboardLeftSide>
        {segment === 'analysis' && (
          <DashboardRightSide loading={<Processing />} error={<NoRecord />} />
        )}
      </div>
    </Fragment>
  );
};

export default DashboardMainWrapper;
