import { Decimal } from 'decimal.js';

import { CircularBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Text } from '@app/_components/shared/Text';
import { Widget } from '@app/_components/shared/Widget';

type TLargestRoiWidgetProps = {
  largestRoi: Decimal;
};

export const LargestRoiWidget = ({ largestRoi }: TLargestRoiWidgetProps) => {
  return (
    <Widget
      className="min-w-[170px] min-h-[170px] 3xl:p-3 bg-[#E4EFFF] relative flex flex-col justify-between gap-5"
      background={
        <CircularBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="items-left"
        label="Largest"
        content="ROI"
        labelClassName="text-lg"
        contentClassName="text-sm text-[#A7C3E9]"
      />
      <Text
        className="font-sora text-xl absolute bottom-10 left-1/2 -translate-x-1/2"
        content={`${largestRoi.greaterThanOrEqualTo(0) ? '+' : '-'}${largestRoi
          .abs()
          .mul(100)
          .toFixed(2)}%`}
      />
    </Widget>
  );
};
