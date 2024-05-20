import React, { CSSProperties } from 'react';

import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';
import { cn } from '@app/_lib/utils';

type TWinLoseWidgetProps = {
  totalWinningTrades: number;
  totalLosingTrades: number;
};

export const WinLoseWidget = ({
  totalWinningTrades = 0,
  totalLosingTrades = 0,
}: TWinLoseWidgetProps) => {
  const total = totalWinningTrades + totalLosingTrades;

  const winPercentage = (totalWinningTrades / total) * 100;
  const losePercentage = (totalLosingTrades / total) * 100;

  return (
    <Widget className="bg-[#F6FFF5] p-8 rounded-2xl flex flex-col justify-between h-full gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex w-full justify-between capitalize">
          <span className="float-left font-normal">Win</span>
          <span className="float-right font-normal">Lose</span>
        </div>
        <div
          style={
            {
              '--win-width': winPercentage,
            } as CSSProperties
          }
          className={cn(
            'relative w-full h-3',
            'before:absolute before:w-full before:h-3 before:bg-[#F2F2F2] before:rounded-full',
            `after:absolute after:w-[calc(var(--win-width)*1%)] after:h-3 after:bg-gradient-to-r after:from-[#87BF90] after:from-[calc(var(--win-width)*1%)] after:to-transparent after:rounded-full`,
          )}
        ></div>
        <div className="flex w-full justify-between">
          <Stat
            content={totalWinningTrades}
            contentClassName="float-left font-bold text-[#009C3E]"
          />
          <Stat
            content={totalLosingTrades}
            contentClassName="float-right font-bold text-[#FF4646]"
          />
        </div>
      </div>
    </Widget>
  );
};
