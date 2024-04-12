import { Decimal } from 'decimal.js';
import { Axis3D, Info, PencilIcon } from 'lucide-react';
import Plotly from 'plotly.js';
import { ChangeEvent, Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Pair } from '@app/(routes)/(route)/_components/BackTestResults';
import { PlotAction } from '@app/_features/dashboard/left/content/surface-plot/PlotAction';
import { useDebounce } from '@app/_hooks/useDebounce';
import { PerformanceData } from '@app/_lib/calculation';
import { IBacktest } from '@app/_providers/backtest';
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

export type TPair = {
  key: string;
  value: number;
};

export type TPermutation = {
  pairs: TPair[];
  sharpeRatio: Decimal;
};

type TCoordinate = {
  x: TPair;
  y: TPair;
  z: Decimal;
};

export type TSurfacePlotGraphProps = {
  backtests: Map<string, IBacktest>;
};
export const SurfacePlotGraph = ({ backtests }: TSurfacePlotGraphProps) => {
  const surfacePlotContainerRef = useRef<HTMLDivElement | null>(null);
  const [permutations, setPermutations] = useState<TPermutation[]>([]);
  const [debouncedDelimitor, delimitor, setDelimitor] = useDebounce<string>('=', 500);
  const [debouncedSeparator, separator, setSeparator] = useDebounce<string>(',', 500);

  const [axisSelected, setAxisSelected] = useState({
    x: '',
    y: '',
  });

  const searchPermutations = useCallback(() => {
    const data = Array.from(backtests.entries())
      .map(([key, value], index, arr) => {
        if (key.indexOf(debouncedDelimitor) === -1 || key.indexOf(debouncedSeparator) === -1)
          return null;
        let pairs = key.split(debouncedSeparator).map((pair) => {
          if (pair.indexOf(debouncedDelimitor) === -1) return { key: '', value: 0 };
          const [key, value] = pair.split(debouncedDelimitor);
          return { key: key.trim(), value: +value };
        });

        return {
          pairs,
          sharpeRatio: new Decimal(
            value.performance.values().next().value.sharpeRatio,
          ).toDecimalPlaces(2),
        };
      })
      .filter((d): d is TPermutation => !!d && d.pairs.length > 1);

    setAxisSelected({
      x: data.length === 0 ? '' : data[0].pairs[0].key,
      y: data.length === 0 ? '' : data[0].pairs[1].key,
    });

    setPermutations(data);
  }, [debouncedDelimitor, debouncedSeparator]);

  useEffect(() => {
    searchPermutations();
  }, [searchPermutations]);

  const coordinate = useMemo<TCoordinate[]>(() => {
    if (permutations.length === 0) return [];
    const data = permutations
      .map(({ pairs, sharpeRatio }) => {
        let xPair = pairs.find((pair) => pair.key === axisSelected.x);
        let yPair = pairs.find((pair) => pair.key === axisSelected.y);
        return { x: xPair, y: yPair, z: sharpeRatio };
      })
      .filter((d): d is TCoordinate => {
        return !!d.x?.key && !!d.y?.key;
      });

    return data;
  }, [permutations, axisSelected.x, axisSelected.y]);

  const uniqueOptions = useMemo(
    () => [...new Set(permutations.flatMap((d) => [d.pairs[0].key, d.pairs[1].key]))],
    [permutations],
  );

  useEffect(() => {
    if (coordinate.length === 0) return;
    if (!surfacePlotContainerRef.current) return;

    const uniqueX = Array.from(new Set(coordinate.map((d) => d.x.value))).sort((a, b) => a - b);
    const uniqueY = Array.from(new Set(coordinate.map((d) => d.y.value))).sort((a, b) => a - b);
    const zMatrix = uniqueY.map(() => Array(uniqueX.length).fill(0));

    coordinate.forEach((d) => {
      const xIndex = uniqueX.indexOf(d.x.value);
      const yIndex = uniqueY.indexOf(d.y.value);
      if (xIndex !== -1 && yIndex !== -1) {
        zMatrix[yIndex][xIndex] = d.z.toNumber();
      }
    });

    // const minVal = Decimal.min(...plotData.map((d) => d.value)).toNumber();
    const maxVal = Decimal.max(...coordinate.map((d) => d.z)).toNumber();

    const plotData = [
      {
        z: zMatrix,
        x: uniqueX,
        y: uniqueY,
        type: 'surface',
        colorbar: {
          tickmode: 'array',
          tickvals: [0, maxVal],
          tickfont: { family: 'Sora', size: 15, color: 'black' },
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
        hovertemplate: `${axisSelected.x}: %{x}<br>${axisSelected.y}: %{y}<br>Sharpe Ratio: %{z}<extra></extra>`,
        // @ts-ignore
        lighting: { diffuse: 0.9, roughness: 0.5 },
      },
    ] satisfies Plotly.Data[];

    const layout = {
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
          title: axisSelected.x,
        },
        yaxis: {
          title: axisSelected.y,
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
    } satisfies Partial<Plotly.Layout>;

    const config = {
      staticPlot: false,
      scrollZoom: true,
      doubleClick: false,
      displayModeBar: false,
    } satisfies Partial<Plotly.Config>;

    Plotly.newPlot(surfacePlotContainerRef.current, plotData, layout, config);

    return () => {
      if (!surfacePlotContainerRef.current) return;
      Plotly.purge(surfacePlotContainerRef.current);
    };
  }, [coordinate]);

  return (
    <Fragment>
      <div className="absolute w-full h-full bg-gradient-to-b from-10% from-[#FFFFFF] to-[#c6e0ff] rounded-3xl border border-[#DFDFDF]" />
      {backtests.size === 0 || coordinate.length === 0 ? (
        <div className="absolute flex justify-center items-center w-full h-full font-sans text-2xl">
          No Records
        </div>
      ) : (
        <div className="w-full min-h-[40rem]" ref={surfacePlotContainerRef}></div>
      )}
      <PlotAction
        options={uniqueOptions}
        delimitor={delimitor}
        separator={separator}
        onDelimitorChange={(e) => setDelimitor(e.target.value)}
        onSeparatorChange={(e) => setSeparator(e.target.value)}
        axis={axisSelected}
        onAxisSelect={(axis) => setAxisSelected(axis)}
      />
    </Fragment>
  );
};
