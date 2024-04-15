import React from 'react';

import { WaveLinesBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TTotalReturnGridWidgetProps = { totalReturn: string };

export const TotalReturnGridWidget = ({ totalReturn }: TTotalReturnGridWidgetProps) => {
  return (
    <Widget
      className="bg-[#FFF8EF] p-8 rounded-2xl relative flex flex-col justify-between h-full gap-2"
      background={
        <WaveLinesBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="gap-1"
        label="Total Return on Account $"
        labelClassName="text-md 3xl:text-xl"
        content={totalReturn}
        contentClassName="text-2xl 3xl:text-3xl font-bold text-[#009C3E]"
      />
    </Widget>
  );
};
