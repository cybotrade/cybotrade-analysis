import { BarsStripeBackground } from '@app/_assets/icons';
import { Text } from '@app/_components/shared/Text';
import { Widget } from '@app/_components/shared/Widget';

export const TotalTradesWidget = () => {
  return (
    <Widget
      className="bg-[#FFF5F5] relative"
      background={
        <BarsStripeBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <div className="z-10 flex flex-col justify-between h-full">
        <Text content="Total Trades" className="text-xl 3xl:text-2xl" />
        <div className="inline-flex items-end gap-1">
          <Text content="350" className="text-4xl 3xl:text-5xl" />
          <Text content="90D" className="text-lg 3xl:text-2xl text-[#FFD4D4]" />
        </div>
      </div>
    </Widget>
  );
};
