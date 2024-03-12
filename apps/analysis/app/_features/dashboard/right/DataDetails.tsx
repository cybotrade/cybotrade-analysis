import React from 'react';

import { Stat } from '@app/_components/shared/Stat';

export const DataDetails = () => {
  return (
    <div className="row-[3] flex flex-col justify-between h-full gap-2">
      <div className="flex justify-between items-center">
        <Stat
          label="Sharpe Ratio"
          content="37.63%"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="Calmar Ratio"
          content="34.23%"
          labelClassName="text-sm md:text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg text-[#009C3E]"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF]"></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Sortino Ratio"
          content="37.63%"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="MDD"
          content="+37,314.21"
          labelClassName="text-sm md:text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg text-[#009C3E]"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Largest ROI"
          content="37.63%"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="Avg. Trades/Day"
          content="423"
          labelClassName="text-sm md:text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg text-[#009C3E]"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Best Trade"
          content="USDT 121.21241"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Worst Trade"
          content="USDT 12412.33"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg text-[#009C3E]"
        />
      </div>
      <div className="border border-t-0 border-[#DFDFDF] "></div>
      <div className="flex justify-between items-center">
        <Stat
          label="Max Trade Durtion"
          content="13.23 Hours"
          labelClassName="text-sm md:text-xs 2xl:text-md"
          contentClassName="font-bold md:text-sm 2xl:text-lg"
        />
        <Stat
          label="Avg. Trade Duration"
          content="12.422 Hours"
          labelClassName="text-sm md:text-xs text-end 2xl:text-md"
          contentClassName="font-bold text-end md:text-sm 2xl:text-lg text-[#009C3E]"
        />
      </div>
    </div>
  );
};
