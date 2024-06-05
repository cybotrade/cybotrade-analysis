import { CircleTileBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TAverageTradesDaysWidgetProps = {
  averageTradesPerDay: number;
};

export const AverageTradesDaysWidget = ({ averageTradesPerDay }: TAverageTradesDaysWidgetProps) => {
  return (
    <Widget
      className="min-w-[140px] min-h-[140px] p-3 3xl:p-3 bg-gradient-to-b from-[#FBECFF] to-transparent relative flex flex-col justify-between gap-5"
      background={
        <CircleTileBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="items-left"
        label="Average  Trades / Days"
        content={averageTradesPerDay.toFixed(2)}
        labelClassName="text-xs order-last text-[#7E6F82]"
        contentClassName="text-xl"
      />
    </Widget>
  );
};
