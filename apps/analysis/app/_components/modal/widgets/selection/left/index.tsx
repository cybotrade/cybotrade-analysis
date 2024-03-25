import React from 'react';

import { SelectionSection } from '@app/_components/modal/widgets/selection/left/SelectionSection';
import {
  LISTING_DATA_SELECTIONS,
  WIDGETS_DATA_SELECTIONS,
} from '@app/_constants/DATA_DISPLAY_SELECTION_LIST';

export const DataDisplaySelectionList = () => {
  return (
    <div className="col-[1] w-full h-full max-w-[30rem] space-y-10">
      <SelectionSection label="Widgets Data Display" selections={WIDGETS_DATA_SELECTIONS} />
      <SelectionSection label="Listing Data Display" selections={LISTING_DATA_SELECTIONS} />
    </div>
  );
};
