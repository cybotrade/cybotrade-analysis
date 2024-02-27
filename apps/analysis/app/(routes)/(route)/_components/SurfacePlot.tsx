import Decimal from 'decimal.js';
import Plotly, { Layout } from 'plotly.js';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@app/_ui/Input';
import { Label } from '@app/_ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';

type Pair = {
  key: string;
  value: number;
};

type SurfacePlotProps = {
  datasets: { allPairs: Pair[]; value: Decimal }[];
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
      .map(({ allPairs, value }) => {
        let xPair = allPairs.find((pair) => pair.key === xAxisSelected);
        let yPair = allPairs.find((pair) => pair.key === yAxisSelected);
        return { xPair, yPair, value };
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
          x: uniqueX,
          y: uniqueY,
          z: zMatrix,
          type: 'surface',
          colorbar: {
            tickmode: 'array',
            tickvals: [0, maxVal],
            tickfont: {
              family: 'Sora',
              size: 15,
              color: 'black',
            },
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
    <div className="relative h-auto bg-gradient-to-b from-10% from-[#FFFFFF] to-[#c6e0ff]">
      {!plotData || plotData.length === 0 ? (
        <div className="flex justify-center items-center h-[40rem] font-sans text-2xl">
          No Records
        </div>
      ) : (
        <div className="w-full min-h-[40rem]" ref={surfacePlotContainerRef}></div>
      )}
      <div className="absolute right-10 top-10 min-w-max h-auto px-3 py-3 bg-white border border-[#DFDFDF] rounded-md flex items-center justify-left gap-4 font-sora">
        <div className="flex flex-col gap-2">
          <Label>Delimiter</Label>
          <Input
            className="w-40"
            type="text"
            value={delimitor}
            placeholder="Delimiter"
            onChange={(e) => onDelimitorChange(e.target.value)}
            maxLength={5}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Separator</Label>
          <Input
            className="w-40"
            type="text"
            value={separator}
            placeholder="Separator"
            onChange={(e) => onSeparatorChange(e.target.value)}
            maxLength={5}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>x-axis</Label>
          <Select value={xAxisSelected || ''} onValueChange={(option) => onxAxisSelect(option)}>
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
        <div className="flex flex-col gap-2">
          <Label>y-axis</Label>
          <Select value={yAxisSelected || ''} onValueChange={(option) => onyAxisSelect(option)}>
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
    </div>
  );
};

export default SurfacePlot;
