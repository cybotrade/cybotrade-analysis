import React from 'react';

import { WidgetsModalDataDisplaySelection } from '@app/_components/modal/widgets/WidgetsModalDataDisplaySelection';
import { WidgetsModalHeader } from '@app/_components/modal/widgets/WidgetsModalHeader';
import { DialogContent } from '@app/_ui/Dialog';

export const WidgetsModalContent = () => {
  return (
    <DialogContent hideIcon className="max-w-[75rem] rounded-md font-sora p-14">
      <WidgetsModalHeader />
      <WidgetsModalDataDisplaySelection />
    </DialogContent>
  );
};
