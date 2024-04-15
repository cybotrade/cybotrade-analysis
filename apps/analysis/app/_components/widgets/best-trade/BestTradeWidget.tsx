import { Decimal } from 'decimal.js';

import { VertexBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TBestTradeWidgetProps = {
  bestTrade: Decimal;
};

export const BestTradeWidget = ({ bestTrade }: TBestTradeWidgetProps) => {
  return (
    <Widget
      className="bg-[#FFFBDB] relative flex flex-col justify-between gap-5"
      background={
        <VertexBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="items-left"
        label="Best Trade"
        content={`${bestTrade.greaterThanOrEqualTo(0) ? '+' : '-'}${bestTrade.abs().toFixed(2)}`}
        labelClassName="text-xl order-last text-[#DBD6AC]"
        contentClassName="text-4xl"
      />
    </Widget>
  );
};
