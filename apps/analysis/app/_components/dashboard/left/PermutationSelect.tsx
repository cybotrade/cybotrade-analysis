import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import React, { useState } from 'react';

import { cn } from '@app/_lib/utils';
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/_ui/Select';

type TPermutationSelectProps = {
  options: { label: string; value: string }[];
  onOptionSelected: (option: string) => void;
};

export const PermutationSelect = ({ options, onOptionSelected }: TPermutationSelectProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <Select
      open={open}
      onOpenChange={setOpen}
      onValueChange={(option) => {
        setSelectedOption(option);
        onOptionSelected(option);
      }}
    >
      <SelectTrigger
        className="text-black font-semibold dark:text-white w-fit focus:ring-0 data-[state=open]:border-primary"
        hideIcon
      >
        <SelectValue placeholder="PERMUTATIONS">PERMUTATIONS</SelectValue>
        <SelectIcon asChild className="h-5 w-5 ml-3">
          {selectedOption ? (
            <button
              className="text-primary text-xl z-50  bg-neutral-50 dark:bg-[#392910]"
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelectedOption(options[0].value);
                onOptionSelected(options[0].value);
              }}
            >
              <X />
            </button>
          ) : open ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          )}
        </SelectIcon>
      </SelectTrigger>
      <SelectContent side="top" className="bg-[#FFFAF2] data-[state=open]:border-primary p-0">
        {options.map(({ label, value }) => (
          <SelectItem
            key={value}
            value={value}
            className="cursor-pointer py-3 items-center data-[highlighted]:bg-[#FEECD4]"
            hideCheck
          >
            <span
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full',
                value === selectedOption ? 'bg-primary' : 'border border-[#DFDFDF]',
              )}
            >
              {value === selectedOption && <Check className="w-3 h-3 text-white" />}
            </span>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
