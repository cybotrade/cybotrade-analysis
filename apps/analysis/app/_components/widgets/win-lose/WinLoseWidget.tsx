import React from 'react';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

export const WinLoseWidget = () => {
  return (
    <Widget className="bg-[#F6FFF5] p-8 rounded-2xl flex flex-col justify-between h-full gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex w-full justify-between capitalize">
          <span className="float-left font-normal">Win</span>
          <span className="float-right font-normal">Lose</span>
        </div>
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#87BF90] to-[#F2F2F2]" />
        <div className="flex w-full justify-between">
          <Stat content="70" contentClassName="float-left font-bold text-[#009C3E]" />
          <Stat content="30" contentClassName="float-right font-bold text-[#FF4646]" />
        </div>
      </div>
      <div className="border border-t-0 border-[#DFDFDF]"></div>
      <div className="flex w-full justify-between">
        <Stat content="1 Apr 23" contentClassName="float-left" />
        <Stat content="1 Jan 24" contentClassName="float-right" />
      </div>
    </Widget>
  );
};
