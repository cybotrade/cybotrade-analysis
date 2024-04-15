import { Decimal } from 'decimal.js';

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
    <div className="col-[2] grid grid-rows-[5%_auto_min-content] w-full h-full gap-3 rounded-lg bg-[#FFFFFF] border border-[#E1D9D6] px-5 py-3">
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
    </div>
  );
};
