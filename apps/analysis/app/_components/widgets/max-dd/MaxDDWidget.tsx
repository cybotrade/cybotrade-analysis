import { TrailBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Widget } from '@app/_components/shared/Widget';

export const MaxDDWidget = () => {
  return (
    <Widget
      className="bg-gradient-to-b from-[#DDFFDC] to-80% to-[#FBFFFB] relative flex flex-col justify-between gap-5"
      background={
        <TrailBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="h-full items-left justify-between"
        label="Max DD."
        content="5.11%"
        labelClassName="text-2xl"
        contentClassName="text-5xl text-right"
      />
    </Widget>
  );
};
