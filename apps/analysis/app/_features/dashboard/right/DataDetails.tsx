import { Decimal } from 'decimal.js';
import React from 'react';

import { Stat } from '@app/_components/shared/Stat';
import { cn } from '@app/_lib/utils';
import { daysToHours } from '@app/_utils/helper';

type TDataDetailsProps = {
  details: {
    sharpeRatio: Decimal;
    calmarRatio: Decimal;
    maxDrawdown: Decimal;
    largestRoi: Decimal;
    averageTradesPerDay: number;
    bestTrade: Decimal;
    worstTrade: Decimal;
    totalTradesDuration: number;
  };
};

export const DataDetails = ({
  details: {
    sharpeRatio,
    calmarRatio,
    maxDrawdown,
    largestRoi,
    averageTradesPerDay,
    bestTrade,
    worstTrade,
    totalTradesDuration,
  },
}: TDataDetailsProps) => {
  return (
    <div className="row-[3] flex flex-col justify-between h-full gap-2">
      <div className="flex justify-between items-center">
        <Stat
          label="Sharpe Ratio"
          content={sharpeRatio.toFixed(2)}
          labelClassName="text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="Calmar Ratio"
          content={calmarRatio.toFixed(2)}
          labelClassName="text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF]"></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Sortino Ratio"
          content="37.63%"
          labelClassName="text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="MDD"
          content={`${maxDrawdown.mul(100).toFixed(2)}%`}
          labelClassName="text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Largest ROI"
          content={`${largestRoi.greaterThanOrEqualTo(0) ? '+' : '-'}${largestRoi
            .abs()
            .mul(100)
            .toFixed(2)}%`}
          labelClassName="text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            largestRoi.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
        <Stat
          label="Avg. Trades/Day"
          content={averageTradesPerDay.toFixed(2)}
          labelClassName="text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Best Trade"
          content={`${bestTrade.greaterThanOrEqualTo(0) ? '+' : '-'}${bestTrade.abs().toFixed(2)}`}
          labelClassName="text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            bestTrade.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Worst Trade"
          content={`${worstTrade.greaterThanOrEqualTo(0) ? '+' : '-'}${worstTrade
            .abs()
            .toFixed(2)}`}
          labelClassName="text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            worstTrade.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Max Trade Duration"
          content={`${totalTradesDuration} Hours`}
          labelClassName="text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="Avg. Trade Duration"
          content={`${daysToHours(averageTradesPerDay)} Hours`}
          labelClassName="text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg"
        />
      </div>
    </div>
  );
};
