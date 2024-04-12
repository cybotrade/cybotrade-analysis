import { Axis3D, Info, PencilIcon } from 'lucide-react';
import { ChangeEvent, PropsWithChildren } from 'react';

import { Input } from '@app/_ui/Input';
import { Label } from '@app/_ui/Label';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@app/_ui/Menubar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@app/_ui/Tooltip';

type TPlotActionProps = {
  options: string[];
  delimitor: string;
  separator: string;
  onDelimitorChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSeparatorChange: (e: ChangeEvent<HTMLInputElement>) => void;
  axis: { x: string; y: string };
  onAxisSelect: (axis: { x: string; y: string }) => void;
};

export const PlotAction = ({
  options,
  delimitor,
  separator,
  onDelimitorChange,
  onSeparatorChange,
  axis,
  onAxisSelect,
}: TPlotActionProps) => {
  return (
    <div className="absolute right-10 top-10 min-w-max h-auto p-1 rounded-md flex items-center justify-left gap-4 font-sora">
      <Menubar className="flex-col items-center h-fit border-none shadow-md">
        <MenubarMenu>
          <MenubarTrigger disabled={options.length === 0}>
            <Axis3D className="w-6 h-6 opacity-40" />
          </MenubarTrigger>
          <MenubarContent side="left" sideOffset={30}>
            <div className="font-sans flex flex-col justify-left px-2 py-1.5">
              <Label className="font-sans text-md float-left font-bold">Axis</Label>
              <div className="font-sans flex items-center gap-8 px-2 py-1.5">
                <Label className="font-medium">x-axis</Label>
                <Select
                  value={axis.x || ''}
                  onValueChange={(option) => onAxisSelect({ ...axis, x: option })}
                >
                  <SelectTrigger className="w-fit dark:bg-[#392910] data-[placeholder]:font-normal border-[#AD967B] data-[placeholder]:opacity-30">
                    <SelectValue placeholder="Select One" defaultValue={axis.x} />
                  </SelectTrigger>
                  <SelectContent className="h-auto overflow-auto dark:bg-[#392910]">
                    {options.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="font-sans flex items-center gap-8 px-2 py-1.5">
                <Label className="font-medium">y-axis</Label>
                <Select
                  value={axis.y || ''}
                  onValueChange={(option) => onAxisSelect({ ...axis, y: option })}
                >
                  <SelectTrigger className="w-fit dark:bg-[#392910] data-[placeholder]:font-normal border-[#AD967B] data-[placeholder]:opacity-30">
                    <SelectValue placeholder="Select One" defaultValue={axis.y} />
                  </SelectTrigger>
                  <SelectContent className="h-auto overflow-auto dark:bg-[#392910]">
                    {options.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </MenubarContent>
        </MenubarMenu>
        <MenubarSeparator />
        <MenubarMenu>
          <MenubarTrigger disabled={options.length === 0}>
            <PencilIcon className="w-6 h-6 opacity-40" />
          </MenubarTrigger>
          <MenubarContent side="left" sideOffset={30}>
            <div className="font-sans flex flex-col justify-left px-2 py-1.5">
              <Label className="flex justify-between items-center font-sans text-md float-left font-bold">
                <span>Edit</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 opacity-40" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-primary rounded-xl p-4 max-w-[20rem]">
                      <Label className="text-primary text-md">Edit Delimiter</Label>
                      <p className="font-sora font-light text-[#706C6C] text-md mt-1">
                        You are encouraged to edit your delimiter under this section, make sure the
                        delimiters are correct.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="font-sans flex items-center gap-8 px-2 py-1.5">
                <Label className="font-medium">Delimitor</Label>
                <Input
                  className="w-40"
                  type="text"
                  value={delimitor}
                  placeholder="Delimiter"
                  onChange={onDelimitorChange}
                  maxLength={5}
                />
              </div>
              <div className="font-sans flex items-center gap-8 px-2 py-1.5">
                <Label className="font-medium">Separator</Label>
                <Input
                  className="w-40"
                  type="text"
                  value={separator}
                  placeholder="Separator"
                  onChange={onSeparatorChange}
                  maxLength={5}
                />
              </div>
            </div>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
