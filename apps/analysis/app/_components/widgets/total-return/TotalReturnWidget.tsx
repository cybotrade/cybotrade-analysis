import { Decimal } from 'decimal.js';

import { SparksBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Text } from '@app/_components/shared/Text';
import { Widget } from '@app/_components/shared/Widget';

type TTotalReturnWidgetProps = {
  netProfit: Decimal;
  initialCapital: Decimal;
};

export const TotalReturnWidget = ({ netProfit, initialCapital }: TTotalReturnWidgetProps) => {
  return (
    <Widget
      className="bg-gradient-to-b from-[#FFE2C1] to-80% to-transparent relative flex flex-col justify-between gap-5"
      background={
        <SparksBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3 p-12" />
      }
    >
      <Stat
        containerClassName="items-center"
        label="Total Return on Account $"
        content={
          netProfit.greaterThanOrEqualTo(0)
            ? `+USDT ${netProfit.toFixed(2)}`
            : `-USDT ${netProfit.abs().toFixed(2)}`
        }
        labelClassName="text-md text-[#706C6C]"
        contentClassName="text-xl text-primary font-bold"
      />
      <div className="place-self-center w-60 h-full max-h-72 border border-[#E59E2E] outline-[#FFBD6D] outline outline-1 outline-offset-8 rounded-full flex justify-center items-center">
        <Text
          className="font-sora text-5xl font-extrabold text-primary"
          content={`${netProfit
            .toDecimalPlaces(2)
            .div(initialCapital.toNumber() > 0 ? initialCapital.toDecimalPlaces(2) : 1)
            .mul(100)
            .toDecimalPlaces(2)
            .toNumber()}%`}
        />
      </div>
    </Widget>
  );
};
