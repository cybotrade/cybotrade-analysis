'use client';

import Decimal from 'decimal.js';
import { Axis3D, Info, PencilIcon } from 'lucide-react';
import Plotly from 'plotly.js';
import { Dispatch, Fragment, SetStateAction, useEffect, useMemo, useRef } from 'react';

import { PerformanceData } from '@app/_lib/calculation';
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

import { Pair } from './BackTestResults';

type SurfacePlotProps = {
  datasets: { allPairs: Pair[]; id: string; performance: PerformanceData }[];
  delimitor: string;
  onDelimitorChange: Dispatch<SetStateAction<string>>;
  separator: string;
  onSeparatorChange: Dispatch<SetStateAction<string>>;
  xAxisSelected: string;
  yAxisSelected: string;
  onxAxisSelect: Dispatch<SetStateAction<string>>;
  onyAxisSelect: Dispatch<SetStateAction<string>>;
};
const SurfacePlot = ({
  datasets,
  delimitor,
  xAxisSelected,
  yAxisSelected,
  separator,
  onDelimitorChange,
  onSeparatorChange,
  onxAxisSelect,
  onyAxisSelect,
}: SurfacePlotProps) => {
  const surfacePlotContainerRef = useRef<HTMLDivElement | null>(null);

  const plotData = useMemo(() => {
    if (!datasets || datasets.length === 0) return [];

    return datasets
      .map(({ allPairs, id, performance }) => {
        let xPair = allPairs.find((pair) => pair.key === xAxisSelected);
        let yPair = allPairs.find((pair) => pair.key === yAxisSelected);
        return { xPair, yPair, value: performance.sharpeRatio };
      })
      .filter((d): d is { xPair: Pair; yPair: Pair; value: Decimal } => {
        return !!d.xPair && !!d.yPair;
      });
  }, [datasets, xAxisSelected, yAxisSelected]);

  const uniqueOptions = useMemo(() => {
    if (!datasets || datasets.length === 0) return [];
    let options: string[] = [];
    datasets.forEach(({ allPairs }) => {
      allPairs.forEach((pair) => {
        if (!options.includes(pair.key)) {
          options.push(pair.key);
        }
      });
    });
    return options;
  }, [datasets]);
  //
  useEffect(() => {
    if (!surfacePlotContainerRef.current) return;
    if (plotData.length === 0) return;

    const uniqueX = Array.from(new Set(plotData.map((d) => d.xPair.value))).sort((a, b) => a - b);
    const uniqueY = Array.from(new Set(plotData.map((d) => d.yPair.value))).sort((a, b) => a - b);
    const zMatrix = uniqueY.map(() => Array(uniqueX.length).fill(0));

    plotData.forEach((d) => {
      const xIndex = uniqueX.indexOf(d.xPair.value);
      const yIndex = uniqueY.indexOf(d.yPair.value);
      if (xIndex !== -1 && yIndex !== -1) {
        zMatrix[yIndex][xIndex] = d.value.toNumber();
      }
    });

    // const minVal = Decimal.min(...plotData.map((d) => d.value)).toNumber();
    const maxVal = Decimal.max(...plotData.map((d) => d.value)).toNumber();

    Plotly.newPlot(
      surfacePlotContainerRef.current,
      [
        {
          z: zMatrix,
          x: uniqueX,
          y: uniqueY,
          type: 'surface',
          colorbar: {
            tickmode: 'array',
            tickvals: [0, maxVal],
            tickfont: {
              family: 'Sora',
              size: 15,
              color: 'black',
            },
            tickformat: '.2f',
            thickness: 20,
            thicknessmode: 'pixels',
            len: 0.4,
            lenmode: 'fraction',
            outlinewidth: 0,
            xanchor: 'right',
            xpad: 200,
          },
          colorscale: [
            [0, '#021846'],
            [0.2, '#0F913D'],
            [0.8, '#C8BD64'],
            [1, '#FF435F'],
          ],
          hoverinfo: 'text',
          hovertemplate: `${xAxisSelected}: %{x}<br>${yAxisSelected}: %{y}<br>Sharpe Ratio: %{z}<extra></extra>`,
          // @ts-ignore
          lighting: {
            diffuse: 0.9,
            roughness: 0.5,
          },
        },
      ],
      {
        autosize: true,
        paper_bgcolor: '#00000000',
        plot_bgcolor: '#00000000',
        margin: {
          l: 15,
          r: 15,
          b: 0,
          t: 0,
          pad: 60,
        },
        // dragmode: false,
        scene: {
          xaxis: {
            title: xAxisSelected,
          },
          yaxis: {
            title: yAxisSelected,
          },
          zaxis: {
            title: { text: 'Sharpe Ratio' },
          },
          camera: {
            up: { x: 0, y: 0, z: 1 },
            center: { x: 0, y: 0, z: 0 },
            eye: { x: 0.5, y: 2.25, z: 0.9 },
          },
        },
      },
      {
        staticPlot: false,
        scrollZoom: true,
        doubleClick: false,
        displayModeBar: false,
      },
    );

    return () => {
      if (!surfacePlotContainerRef.current) return;
      Plotly.purge(surfacePlotContainerRef.current);
    };
  }, [plotData]);

  return (
    <div className="relative h-full">
      {!plotData || plotData.length === 0 ? (
        <div className="flex justify-center items-center h-full font-sans text-2xl">No Records</div>
      ) : (
        <Fragment>
          <div className="absolute w-full h-full bg-gradient-to-b from-10% from-[#FFFFFF] to-[#c6e0ff] rounded-3xl border border-[#DFDFDF]" />
          <div className="w-full min-h-[40rem]" ref={surfacePlotContainerRef}></div>
          <div className="absolute right-10 top-10 min-w-max h-auto p-1 rounded-md flex items-center justify-left gap-4 font-sora">
            <Menubar className="flex-col items-center h-fit border-none shadow-md">
              <MenubarMenu>
                <MenubarTrigger>
                  <Axis3D className="w-6 h-6 opacity-40" />
                </MenubarTrigger>
                <MenubarContent side="left" sideOffset={30}>
                  <div className="font-sans flex flex-col justify-left px-2 py-1.5">
                    <Label className="font-sans text-md float-left font-bold">Axis</Label>
                    <div className="font-sans flex items-center gap-8 px-2 py-1.5">
                      <Label className="font-medium">x-axis</Label>
                      <Select
                        value={xAxisSelected || ''}
                        onValueChange={(option) => onxAxisSelect(option)}
                      >
                        <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal border-[#AD967B] data-[placeholder]:opacity-30">
                          <SelectValue placeholder="Select One" defaultValue={xAxisSelected} />
                        </SelectTrigger>
                        <SelectContent className="h-auto overflow-auto dark:bg-[#392910]">
                          {uniqueOptions.map((key) => (
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
                        value={yAxisSelected || ''}
                        onValueChange={(option) => onyAxisSelect(option)}
                      >
                        <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal border-[#AD967B] data-[placeholder]:opacity-30">
                          <SelectValue placeholder="Select One" defaultValue={yAxisSelected} />
                        </SelectTrigger>
                        <SelectContent className="h-auto overflow-auto dark:bg-[#392910]">
                          {uniqueOptions.map((key) => (
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
                <MenubarTrigger>
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
                              You are encouraged to edit your delimiter under this section, make
                              sure the delimiters are correct.
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
                        onChange={(e) => onDelimitorChange(e.target.value)}
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
                        onChange={(e) => onSeparatorChange(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                  </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default SurfacePlot;
