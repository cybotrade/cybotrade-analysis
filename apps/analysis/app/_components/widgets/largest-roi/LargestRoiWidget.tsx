import { CircularBackground, VertexBackground } from '@app/_assets/icons';
import { Stat } from '@app/_components/shared/Stat';
import { Text } from '@app/_components/shared/Text';
import { Widget } from '@app/_components/shared/Widget';

export const LargestRoiWidget = () => {
  return (
    <Widget
      className="bg-[#E4EFFF] relative flex flex-col justify-between gap-5"
      background={
        <CircularBackground className="absolute w-full h-full bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/3" />
      }
    >
      <Stat
        containerClassName="items-left"
        label="Largest"
        content="ROI"
        labelClassName="text-3xl"
        contentClassName="text-xl text-[#A7C3E9]"
      />
      <Text
        className="font-sora text-5xl absolute bottom-20 left-1/2 -translate-x-1/2"
        content="56%"
      />
    </Widget>
  );
};
