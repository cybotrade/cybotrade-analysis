import { OrbitLoopBackground } from '@app/_assets/icons';
import { Text } from '@app/_components/shared/Text';
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
      <div className="z-10 flex flex-col justify-between h-full">
        <Text content="Trading Frequency" className="text-xl 3xl:text-2xl" />
        <div className="inline-flex items-end gap-1">
          <Text content={averageTradesPerDay} className="text-4xl 3xl:text-5xl" />
          <Text content="/ Day" className="text-lg 3xl:text-2xl text-[#d0b9d9]" />
        </div>
      </div>
    </Widget>
  );
};
