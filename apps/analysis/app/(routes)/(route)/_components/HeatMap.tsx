import { Kline } from 'binance';
import * as d3 from 'd3';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  backtestData: IBackTestData[];
  klineData: Kline[];
  interval: Interval;
  minDomain?: number;
  maxDomain?: number;
};

const HeatMap = ({
  backtestData,
  klineData,
  interval,
  minDomain = 1,
  maxDomain = 100,
}: HeatMapProps) => {
  const heatMapContainerRef = useRef<HTMLDivElement | null>(null);

  const [xSelect, setXSelect] = useState('');
  const [ySelect, setYSelect] = useState('');

  const [delimitor, setDelimitor] = useState('=');
  const [separator, setSeparator] = useState(',');

  const datasets = useMemo(() => {
    if (!backtestData) return [];
    if (!delimitor || !separator) return [];

    const data = backtestData.map((d) => {
      if (d.id.indexOf(delimitor) === -1 || d.id.indexOf(separator) === -1) return null;
      const allPairs = d.id
        .split(separator)
        .map((pair) => {
          if (pair.indexOf(delimitor) === -1) return undefined;
          const [key, value] = pair.split(delimitor);
          return { key: key.trim(), value: +value };
        })
        .filter((p) => p);

      let sharpeRatio = calculateSharpeRatio({
        klineData,
        inputTrades: d.trades,
        interval,
      }).toDecimalPlaces(2);

      return {
        allPairs,
        value: sharpeRatio.isNaN() ? new Decimal(0) : sharpeRatio,
      };
    });
    return data;
  }, [backtestData, separator, delimitor]);

  const filteredDatasets = useMemo(() => {
    if (!datasets || datasets.length === 0) return [];
    const data = datasets.filter((d): d is { allPairs: Pair[]; value: Decimal } => !!d);
    setXSelect(data[0]!.allPairs[0].key);
    setYSelect(data[0]!.allPairs[1].key);
    return data;
  }, [datasets]);

  const uniqueOptions = useMemo(() => {
    if (!filteredDatasets || filteredDatasets.length === 0) return [];
    let options: string[] = [];
    filteredDatasets.forEach(({ allPairs }) => {
      allPairs.forEach((pair) => {
        if (!options.includes(pair.key)) {
          options.push(pair.key);
        }
      });
    });
    return options;
  }, [filteredDatasets]);

  const chartData = useMemo(() => {
    if (!filteredDatasets || filteredDatasets.length === 0) return [];
    return filteredDatasets
      .map(({ allPairs, value }) => {
        let xPair = allPairs.find((pair) => pair.key === xSelect);
        let yPair = allPairs.find((pair) => pair.key === ySelect);
        return { xPair, yPair, value };
      })
      .filter((d): d is { xPair: Pair; yPair: Pair; value: Decimal } => {
        return !!d.xPair && !!d.yPair;
      });
  }, [filteredDatasets, xSelect, ySelect]);

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
    const correspondingData = chartData.find((d) => d.xPair!.key === xSelect);

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

    heatMapContainerRef.current.scrollIntoView({ behavior: 'instant' });

    return () => {
      svg.remove();
    };
  }, [chartData, xSelect, ySelect]);

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
            onChange={(e) => setDelimitor(e.target.value)}
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
            onChange={(e) => setSeparator(e.target.value)}
            maxLength={5}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>x-axis</Label>
          <Select value={xSelect || ''} onValueChange={setXSelect}>
            <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal">
              <SelectValue placeholder="Select One" defaultValue={xSelect} />
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
          <Select value={ySelect || ''} onValueChange={setYSelect}>
            <SelectTrigger className="w-40 dark:bg-[#392910] data-[placeholder]:font-normal">
              <SelectValue placeholder="Select One" defaultValue={ySelect} />
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
