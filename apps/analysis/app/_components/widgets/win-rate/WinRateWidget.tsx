import { Decimal } from 'decimal.js';

import { BarsBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TWinRateWidgetProps = {
  winRate: Decimal;
};

export const WinRateWidget = ({ winRate }: TWinRateWidgetProps) => {
  return (
    <Widget
      className="min-w-[170px] min-h-[170px] 3xl:p-3 bg-gradient-to-b from-[#FFE5E4] to-transparent relative flex flex-col justify-between gap-5"
      background={
        <BarsBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3 p-4" />
      }
    >
      <Stat
        containerClassName="h-full items-left justify-between"
        label="Win Rate"
        content={`${winRate.greaterThanOrEqualTo(0) ? '+' : '-'}${winRate
          .abs()
          .mul(100)
          .toFixed(2)}%`}
        labelClassName="text-lg"
        contentClassName="text-2xl"
      />
    </Widget>
  );
};
