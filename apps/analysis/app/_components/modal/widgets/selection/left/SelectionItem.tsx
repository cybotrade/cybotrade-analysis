import { Check } from 'lucide-react';

import { Selection } from '@app/_constants/DATA_DISPLAY_SELECTION_LIST';
import { cn } from '@app/_lib/utils';

type TSelectionItemProps = {
  item: Selection;
  dropped: boolean;
};

export const SelectionItem = ({ item, dropped }: TSelectionItemProps) => {
  return (
    <button
      className={cn(
        'flex gap-2 items-center px-3 py-2 border border-[#7A7A7A] text-sm text-[#7A7A7A] rounded-md cursor-pointer',
        dropped && 'text-primary bg-[#FFFCF6] border-primary cursor-default',
      )}
    >
      {dropped && <Check className="w-4 h-4" />}
      <span>{item.value}</span>
    </button>
  );
};
