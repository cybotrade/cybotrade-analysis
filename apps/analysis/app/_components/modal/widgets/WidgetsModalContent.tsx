import { WidgetsModalDataDisplaySelection } from '@app/_components/modal/widgets/WidgetsModalDataDisplaySelection';
import { PerformanceData } from '@app/_lib/calculation';
import { DialogContent } from '@app/_ui/Dialog';

type TWidgetsModalContentProps = {
  performance: PerformanceData;
  onToggleModal: (open: boolean) => void;
};

export const WidgetsModalContent = ({ performance, onToggleModal }: TWidgetsModalContentProps) => {
  return (
    <DialogContent hideIcon className="max-w-[75rem] rounded-md font-sora p-14 space-y-10">
      <WidgetsModalDataDisplaySelection performance={performance} onToggleModal={onToggleModal} />
    </DialogContent>
  );
};
