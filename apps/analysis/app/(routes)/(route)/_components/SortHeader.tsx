import { useState } from 'react';

import { Label } from '@app/_ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';

type SortHeaderProps = {
  permutationOptions: string[];
  selectedPermutation: string;
  onPermutationChange: (option: string) => void;
};
const SortHeader = ({
  permutationOptions,
  selectedPermutation,
  onPermutationChange,
}: SortHeaderProps) => {
  return (
    <div className="px-5 py-5">
      <div className="font-sora space-y-2">
        <Label>Permutations</Label>
        <Select value={selectedPermutation || ''} onValueChange={onPermutationChange}>
          <SelectTrigger className="w-fit bg-[#F4F4F4] dark:bg-[#392910] border-none px-4 py-6 rounded-xl data-[placeholder]:font-normal">
            <SelectValue defaultValue={selectedPermutation} placeholder="Select One" />
          </SelectTrigger>
          <SelectContent className="h-[230px] overflow-auto dark:bg-[#392910]">
            {permutationOptions.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SortHeader;
