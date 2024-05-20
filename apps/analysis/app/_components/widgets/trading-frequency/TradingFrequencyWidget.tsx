import { OrbitLoopBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

type TradingFrequencyWidgetProps = {
  averageTradesPerDay: number;
};

export const TradingFrequencyWidget = ({ averageTradesPerDay }: TradingFrequencyWidgetProps) => {
  return (
    <Widget
      className="bg-[#FBF0FF] relative flex flex-col justify-between gap-5"
      background={<OrbitLoopBackground className="absolute w-full h-full bottom-0 right-0" />}
    >
      <Stat
        containerClassName="z-10 h-full items-left justify-between"
        label="Trading Frequency"
        content={averageTradesPerDay}
        labelClassName="text-xl 3xl:text-2xl"
        contentClassName="text-4xl 3xl:text-5xl"
      />
    </Widget>
  );
};
