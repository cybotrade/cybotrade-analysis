import { OptionSelect } from '@app/_components/dashboard/left/OptionSelect';
import { OPTION_LIST } from '@app/_constants/OPTION_LIST';

export const DashboardFooter = () => {
  return (
    <div className="font-sora flex justify-center items-end gap-10 max-w-4xl h-auto mx-auto rounded-full border border-[#F8E6C9] bg-white px-12 py-4 shadow-md shadow-primary-light/50">
      <OptionSelect data={OPTION_LIST[0]} />
      <OptionSelect data={OPTION_LIST[1]} />
      <OptionSelect data={OPTION_LIST[2]} />
      <OptionSelect data={OPTION_LIST[3]} />
    </div>
  );
};
