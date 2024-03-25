import React from 'react';

import { DataDisplaySelectionList } from '@app/_components/modal/widgets/selection/left';

export const WidgetsModalDataDisplaySelection = () => {
  return (
    <div className="grid auto-cols-[1fr_28rem] h-fit gap-8">
      <DataDisplaySelectionList />
      <div className="col-[2] w-full h-full bg-red-500"></div>
    </div>
  );
};
