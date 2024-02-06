import * as d3 from 'd3';
import Decimal from 'decimal.js';
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

import { Interval } from '@app/_lib/utils';

import { IBackTestData } from '@app/(routes)/(route)/type';
import { calculateSharpeRatio } from '@app/_lib/calculation';

import { Input } from '@app/_ui/Input';
import { Label } from '@app/_ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@app/_ui/Select';

type Pair = {
  key: string;
  value: number;
};

type HeatMapProps = {
  datasets: { allPairs: Pair[]; value: Decimal }[];
  delimitor: string;
  onDelimitorChange: Dispatch<SetStateAction<string>>;
  separator: string;
  onSeparatorChange: Dispatch<SetStateAction<string>>;
  xAxisSelected: string;
  yAxisSelected: string;
  onxAxisSelect: Dispatch<SetStateAction<string>>;
  onyAxisSelect: Dispatch<SetStateAction<string>>;
  minDomain?: number;
  maxDomain?: number;
};

const HeatMap = ({
  datasets,
  delimitor,
  xAxisSelected,
  yAxisSelected,
  separator,
  onDelimitorChange,
  onSeparatorChange,
  onxAxisSelect,
  onyAxisSelect,
  minDomain = 1,
  maxDomain = 100,
}: HeatMapProps) => {
  const heatMapContainerRef = useRef<HTMLDivElement | null>(null);

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

  const chartData = useMemo(() => {
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

  useEffect(() => {
    if (!heatMapContainerRef.current) return;

    const margin = { top: 100, right: 100, bottom: 50, left: 100 };
    const width = heatMapContainerRef.current?.offsetWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    if (heatMapContainerRef.current.firstChild) {
      Array.from(heatMapContainerRef.current.children).forEach((c) => c.remove());
    }

    const xDomain = [...new Set(chartData.map((d) => d.xPair!.value))];
    const yDomain = [...new Set(chartData.map((d) => d.yPair!.value))];
    const correspondingData = chartData.find((d) => d.xPair!.key === xAxisSelected);

    const svg = d3
      .select(heatMapContainerRef.current as HTMLElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand<number>().domain(xDomain).range([0, width]).padding(0.01);
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickSize(10).tickSizeOuter(0).tickPadding(15))
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif');

    svg
      .append('text')
      .attr('x', width + 25)
      .attr('y', height + 3)
      .text((d) => {
        return correspondingData ? correspondingData.xPair!.key : '';
      })
      .attr('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif')
      .attr('text-anchor', 'start');

    const yScale = d3.scaleBand<number>().range([height, 0]).domain(yDomain).padding(0.01);
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickSize(10).tickSizeOuter(0).tickPadding(15))
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif');

    svg
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', -30)
      .text((d) => {
        return correspondingData ? correspondingData.yPair!.key : '';
      })
      .attr('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif')
      .attr('text-anchor', 'middle');

    const color = d3
      .scaleLinear<string>()
      .range(['#e4f1ff', '#00a8ff'])
      .domain([minDomain, maxDomain]);

    svg
      .selectAll()
      .data(chartData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(d.xPair!.value)!)
      .attr('y', (d, i) => yScale(d.yPair!.value)!)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => d!.value.toFixed(2))
      .style('fill', (d) => color(d!.value.toDecimalPlaces(2).toNumber()));

    svg
      .selectAll()
      .data(chartData)
      .join('text')
      .attr('x', (d, i) => xScale(d.xPair!.value)! + xScale.bandwidth() / 2)
      .attr('y', (d, i) => yScale(d.yPair!.value)! + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => d!.value.toFixed(2))
      .style('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif');

    return () => {
      svg.remove();
    };
  }, [chartData, xAxisSelected, yAxisSelected]);

  return (
    <div className="p-10">
      <div className="flex items-center justify-left gap-4 font-sora">
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
            <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal data-[placeholder]:opacity-30">
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
            <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal data-[placeholder]:opacity-30">
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
      {!chartData || chartData.length === 0 ? (
        <div className="flex justify-center items-center h-96 font-sans text-2xl">No Records</div>
      ) : (
        <div className="w-full max-h-fit" ref={heatMapContainerRef}></div>
      )}
    </div>
  );
};

export default HeatMap;
