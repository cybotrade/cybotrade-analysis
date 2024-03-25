import { SelectionItem } from '@app/_components/modal/widgets/selection/left/SelectionItem';
import { Text } from '@app/_components/shared/Text';
import { Selection } from '@app/_constants/DATA_DISPLAY_SELECTION_LIST';

type SelectionSectionProps = {
  label: string;
  selections: Selection[];
};

export const SelectionSection = ({ label, selections }: SelectionSectionProps) => {
  return (
    <div>
      <Text content={label} className="text-lg" />
      <div className="border border-t-0 border-[#DFDFDF] my-3"></div>
      <div className="flex flex-wrap gap-3">
        {selections.map((item) => (
          <SelectionItem key={item.id} text={item.value} />
        ))}
      </div>
    </div>
  );
};
