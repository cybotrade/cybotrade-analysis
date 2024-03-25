import { BarsBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

export const WinRateWidget = () => {
  return (
    <Widget
      className="bg-gradient-to-b from-[#FFE5E4]  to-transparent relative flex flex-col justify-between gap-5"
      background={
        <BarsBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3 p-12" />
      }
    >
      <Stat
        containerClassName="h-full items-left justify-between"
        label="Win Rate"
        content="+34.5%"
        labelClassName="text-2xl"
        contentClassName="text-5xl"
      />
    </Widget>
  );
};
