import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react';

import { Draggable } from '@app/_components/modal/widgets/selection/left/Draggable';
import { SelectionItem } from '@app/_components/modal/widgets/selection/left/SelectionItem';
import { Text } from '@app/_components/shared/Text';
import { Selection } from '@app/_constants/DATA_DISPLAY_SELECTION_LIST';

type SelectionSectionProps = {
  label: string;
  selections: Selection[];
  droppedItems: UniqueIdentifier[];
};

export const SelectionSection = ({ label, selections, droppedItems }: SelectionSectionProps) => {
  return (
    <div>
      <Text content={label} className="text-lg" />
      <div className="border border-t-0 border-[#DFDFDF] my-3"></div>
      <div className="flex flex-wrap gap-3">
        {selections.map((item) => (
          <Draggable key={item.id} id={item.id} disabled={droppedItems.includes(item.id)}>
            <SelectionItem item={item} dropped={droppedItems.includes(item.id)} />
          </Draggable>
        ))}
      </div>
    </div>
  );
};
