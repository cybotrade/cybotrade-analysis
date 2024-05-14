import { Decimal } from 'decimal.js';
import { Fragment } from 'react';

import { ActionHeader } from '@app/_features/dashboard/right/ActionHeader';
import { DataCarousel } from '@app/_features/dashboard/right/DataCarousel';
import { DataDetails } from '@app/_features/dashboard/right/DataDetails';
import { PerformanceData } from '@app/_lib/calculation';

type TRightColumnContentProps = {
  performance: PerformanceData;
};

export const RightColumnContent = ({ performance }: TRightColumnContentProps) => {
  const netProfit = new Decimal(performance.netProfit);
  const initialCapital = new Decimal(performance.initialCapital);
  const winRate = new Decimal(performance.winRate);
  const sharpeRatio = new Decimal(performance.sharpeRatio);
  const calmarRatio = new Decimal(performance.calmarRatio);
  const maxDrawdown = new Decimal(performance.maxDrawdown);
  const largestRoi = new Decimal(performance.largestRoi);
  const averageTradesPerDay = performance.averageTradesPerDay;
  const bestTrade = new Decimal(performance.bestTradePnl);
  const worstTrade = new Decimal(performance.worstTradePnl);
  const totalTradesDuration = performance.totalTradesDuration;

  return (
    <Fragment>
      <ActionHeader className="mb-3" />
      <DataCarousel
        data={{
          netProfit,
          initialCapital,
          winRate,
          maxDrawdown,
          bestTrade,
          largestRoi,
          averageTradesPerDay,
        }}
      />
      <DataDetails
        details={{
          sharpeRatio,
          calmarRatio,
          maxDrawdown,
          largestRoi,
          averageTradesPerDay,
          bestTrade,
          worstTrade,
          totalTradesDuration,
        }}
      />
    </Fragment>
  );
};
