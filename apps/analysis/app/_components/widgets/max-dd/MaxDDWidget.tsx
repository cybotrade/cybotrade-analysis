import { Decimal } from 'decimal.js';

import { TrailBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TMaxDDWidgetProps = {
  maxDrawdown: Decimal;
};

export const MaxDDWidget = ({ maxDrawdown }: TMaxDDWidgetProps) => {
  return (
    <Widget
      className="min-w-[140px] min-h-[140px] p-3 3xl:p-3 bg-gradient-to-b from-[#DDFFDC] to-80% to-[#FBFFFB] relative flex flex-col justify-between gap-5"
      background={
        <TrailBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="h-full items-left justify-between"
        label="Max DD."
        content={`${maxDrawdown.mul(100).toFixed(2)}%`}
        labelClassName="text-lg"
        contentClassName="text-xl text-right"
      />
    </Widget>
  );
};