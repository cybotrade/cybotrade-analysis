import { ToggleGroup } from '@radix-ui/react-toggle-group';

import { Interval } from '@app/_lib/utils';
import { ToggleGroupItem } from '@app/_ui/Togglegroup';

type IntervalsToolbarProps = {
  intervals: Interval[];
  onIntervalSelect: (value: Interval) => void;
};
export const IntervalsToolbar = ({ intervals, onIntervalSelect }: IntervalsToolbarProps) => {
  return (
    <ToggleGroup
      type="single"
      className="m-4"
      onValueChange={(value) => onIntervalSelect(value as Interval)}
    >
      {intervals.map((interval) => (
        <ToggleGroupItem
          value={interval}
          className="w-16 text-black/40 font-bold hover:bg-none! data-[state=on]:text-primary"
        >
          {interval}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
