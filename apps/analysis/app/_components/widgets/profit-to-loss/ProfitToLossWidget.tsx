import { CoreLoopBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

export const ProfitToLossWidget = () => {
  return (
    <Widget
      className="bg-[#F6FFF5] relative flex flex-col justify-between gap-5"
      background={
        <CoreLoopBackground className="absolute w-full h-full -bottom-45 left-1/2 -translate-x-1/2" />
      }
    >
      <Stat
        containerClassName="z-10 h-full items-left"
        label="Profit-to-Loss"
        content="1.3728 : 1"
        labelClassName="text-xl 3xl:text-2xl"
        contentClassName="text-2xl text-[#B0B0B0]"
      />
    </Widget>
  );
};
