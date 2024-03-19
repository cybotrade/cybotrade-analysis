import Image from 'next/image';
import React from 'react';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

export const DetailsWidget = () => {
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
          label="Max Trade Duration"
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
    </Widget>
  );
};
