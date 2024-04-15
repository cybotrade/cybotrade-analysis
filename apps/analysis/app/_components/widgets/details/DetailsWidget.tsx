import { Decimal } from 'decimal.js';
import Image from 'next/image';
import React from 'react';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';
import { cn } from '@app/_lib/utils';

type TDetailsWidgetProps = {
  details: {
    profitFactor: Decimal;
    winRate: Decimal;
    largestRoi: Decimal;
    smallestRoi: Decimal;
    bestTrade: Decimal;
    worstTrade: Decimal;
  };
};

export const DetailsWidget = ({
  details: { winRate, profitFactor, largestRoi, smallestRoi, bestTrade, worstTrade },
}: TDetailsWidgetProps) => {
  return (
    <Widget
      className="relative bg-white p-8 rounded-2xl flex flex-col justify-between h-full gap-2"
      background={
        <Image
          className="absolute bottom-0 left-1/2 -translate-x-1/2 max-h-[14rem]"
          src="/images/LightModeGraph.png"
          alt="background"
          width={500}
          height={200}
          fetchPriority="high"
        />
      }
    >
      <div className="flex justify-between items-center">
        <Stat
          label="Win Rate"
          content={`${winRate.greaterThanOrEqualTo(0) ? '+' : '-'}${winRate
            .abs()
            .mul(100)
            .toFixed(2)}%`}
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            winRate.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
        <Stat
          label="Profit Factor"
          content={`${profitFactor.greaterThanOrEqualTo(0) ? '+' : '-'}${profitFactor.toFixed(2)}`}
          labelClassName="text-sm md:text-xs text-end 2xl:text-md"
          contentClassName={cn(
            'font-bold text-end md:text-sm 2xl:text-lg',
            profitFactor.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
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
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            largestRoi.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
        <Stat
          label="Smallest ROI"
          content={`${smallestRoi.greaterThanOrEqualTo(0) ? '+' : '-'}${smallestRoi
            .abs()
            .mul(100)
            .toFixed(2)}%`}
          labelClassName="text-sm text-end md:text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold text-end md:text-sm 2xl:text-lg',
            smallestRoi.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Best Trade"
          content={`${bestTrade.greaterThanOrEqualTo(0) ? '+' : '-'}${bestTrade.abs().toFixed(2)}`}
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold md:text-sm 2xl:text-lg',
            bestTrade.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
        <Stat
          label="Worst Trade"
          content={`${worstTrade.greaterThanOrEqualTo(0) ? '+' : '-'}${worstTrade
            .abs()
            .toFixed(2)}`}
          labelClassName="text-sm text-end md:text-xs 2xl:text-md"
          contentClassName={cn(
            'font-bold text-end md:text-sm 2xl:text-lg',
            worstTrade.greaterThanOrEqualTo(0)
              ? 'text-[#009C3E] dark:text-[#00FC65]'
              : 'text-[#FF4646] dark:text-[#FF6F6F]',
          )}
        />
      </div>
    </Widget>
  );
};
