import React from 'react';

import { WidgetsModalDataDisplaySelection } from '@app/_components/modal/widgets/WidgetsModalDataDisplaySelection';
import { WidgetsModalHeader } from '@app/_components/modal/widgets/WidgetsModalHeader';
import { PerformanceData } from '@app/_lib/calculation';
import { DialogContent } from '@app/_ui/Dialog';

type TWidgetsModalContentProps = {
  performance: PerformanceData;
};

export const WidgetsModalContent = ({ performance }: TWidgetsModalContentProps) => {
  return (
    <DialogContent hideIcon className="max-w-[75rem] rounded-md font-sora p-14 space-y-10">
      <WidgetsModalHeader />
      <WidgetsModalDataDisplaySelection performance={performance} />
    </DialogContent>
  );
};
