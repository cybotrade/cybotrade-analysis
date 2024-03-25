import { BackSquareIcon, ChangeIcon } from '@app/_assets/icons';
import { ToggleSwitch } from '@app/_components/dashboard/right/ToggleSwitch';
import { WidgetsModal, WidgetsModalContent } from '@app/_components/modal/widgets';
import { cn } from '@app/_lib/utils';

type ActionHeaderProps = { className?: string };

export const ActionHeader = ({ className }: ActionHeaderProps) => {
  return (
    <div className={cn(className, 'font-sora flex justify-between items-center h-10')}>
      <ToggleSwitch />
      <div className="flex items-center justify-end gap-5">
        <WidgetsModal
          button={<ChangeIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />}
          content={<WidgetsModalContent />}
        />
        <BackSquareIcon className="w-5 h-auto text-[#7B7878] cursor-pointer" />
      </div>
    </div>
  );
};
