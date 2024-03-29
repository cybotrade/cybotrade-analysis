'use client';

import { PropsWithChildren } from 'react';

import RadialMenu from '@app/_components/shared/RadialMenu';
import { BacktestDataProvider } from '@app/_providers/backtest';
import { useFileData } from '@app/_providers/file';

const DashboardMainWrapper = ({ children }: PropsWithChildren) => {
  const { data } = useFileData();
  if (!data) throw new Error('Invalid Visit');

  return (
    <BacktestDataProvider>
      <RadialMenu />
      <div className="w-full h-full grid auto-cols-[1fr_28rem] gap-8">{children}</div>
    </BacktestDataProvider>
  );
};

export default DashboardMainWrapper;
