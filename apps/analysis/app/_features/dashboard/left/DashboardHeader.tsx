import { BackIcon, CybotradeLogo, NotificationIcon, SettingsIcon } from '@app/_assets/icons';
import { Text } from '@app/_components/shared/Text';
import { Badge } from '@app/_ui/Badge';

export const DashboardHeader = () => {
  return (
    <div className="font-sora flex w-full h-16 min-h-16 relative gap-2">
      <button className="rounded-full w-16 h-full bg-[#FFFFFF] border border-[#E1D9D6] flex justify-center items-center">
        <BackIcon className="text-[#706C6C]" />
      </button>
      <div className="relative rounded-xl w-full h-full bg-[#FFFFFF] border border-[#E1D9D6] p-4 flex justify-between items-center">
        <CybotradeLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="flex items-center gap-5 z-10">
          <Text content="unknown.json // testing.json" className="text-md underline font-bold" />
          <Badge className="text-[#00439B] bg-[#DAEAFF] text-xs px-2 font-light pointer-events-none">
            ID: 4523
          </Badge>
        </div>
        <div className="flex justify-end items-center gap-5 z-10">
          <SettingsIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />
          <NotificationIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
