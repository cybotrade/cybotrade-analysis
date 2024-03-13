import { CrownIcon } from '@app/_assets/icons';
import { Orbit } from '@app/_components/shared/Orbit';
import { Text } from '@app/_components/shared/Text';
import { Button } from '@app/_ui/Button';

export const Banner = () => {
  return (
    <div className="font-sora relative w-full min-h-max bg-[#FFF2D9] border border-primary rounded-lg p-10">
      <div className="flex flex-col gap-1">
        <Text content="Hi Zheng Ran," className="text-xl" />
        <Text content="Your ROI has increased to 60%! 🎉" className="text-3xl" />
        <Text content="#firstoftheyear!" className="text-xl" />
        <Button className="absolute right-0 bottom-0 bg-[#FFFCF6] text-primary hover:border-primary m-10">
          <CrownIcon className="w-4 h-4 mr-3" />
          <span> Share to your friends!</span>
        </Button>
      </div>
      <Orbit />
    </div>
  );
};
