import Image from 'next/image';
import React, { Fragment } from 'react';

import { Stat } from '@app/_components/shared/Stat';
import {
  BalanceChartWidget,
  DetailsWidget,
  ProfitToLossWidget,
  TotalReturnGridWidget,
  TotalTradesWidget,
  TradingFrequencyWidget,
  WinLoseWidget,
} from '@app/_components/widgets';
import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';

const ResultBreakdownPage = () => {
  return (
    <Fragment>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#F1F1F1]">
        <Image
          className="w-full h-full object-cover"
          src="/images/particles_bg.png"
          alt="background"
          fill
          fetchPriority="high"
        />
      </div>
      <DashboardContentWrapper className="relative h-[90%] my-5">
        <div className="absolute w-full h-full font-sora grid auto-rows-[auto_1fr] gap-10">
          <Stat
            containerClassName="gap-2"
            label="Overall increment :"
            labelClassName="text-md"
            content="56%"
            contentClassName="text-primary text-8xl font-bold"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="grid auto-rows-[60%_1fr] gap-3">
              <BalanceChartWidget />
              <div className="grid grid-cols-2 gap-3">
                <WinLoseWidget />
                <TotalReturnGridWidget />
              </div>
            </div>
            <div className="grid auto-rows-[50%_1fr] gap-3">
              <div className="grid grid-cols-3 gap-3">
                <TotalTradesWidget />
                <ProfitToLossWidget />
                <TradingFrequencyWidget />
              </div>
              <DetailsWidget />
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    </Fragment>
  );
};

export default ResultBreakdownPage;
