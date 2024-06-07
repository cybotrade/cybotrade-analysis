import React from 'react';

import { SelectionSection } from '@app/_components/modal/widgets/selection/left/SelectionSection';
import {
  LISTING_DATA_SELECTIONS,
  WIDGETS_DATA_SELECTIONS,
} from '@app/_constants/DATA_DISPLAY_SELECTION_LIST';
import { TCell } from '@app/_providers/file';

type TDataDisplaySelectionListProps = {
  items: Record<string, TCell[]>;
};

export const DataDisplaySelectionList = ({ items }: TDataDisplaySelectionListProps) => {
  const droppedItems = Object.keys(items)
    .map((key) => items[key].flatMap((item) => item.children?.type || []))
    .flat();
  return (
    <div className="col-[1] w-full h-full max-w-[30rem] space-y-10">
      {/*<SelectionSection*/}
      {/*  label="Widgets Data Display"*/}
      {/*  selections={WIDGETS_DATA_SELECTIONS}*/}
      {/*  droppedItems={droppedItems}*/}
      {/*/>*/}
      <SelectionSection
        label="Listing Data Display"
        selections={LISTING_DATA_SELECTIONS}
        droppedItems={droppedItems}
      />
    </div>
  );
};
