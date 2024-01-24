import { Kline } from 'binance';
import * as d3 from 'd3';
import Decimal from 'decimal.js';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Interval } from '@cybotrade/core';

import { IBackTestData } from '@app/(routes)/(route)/type';
import { calculateSharpeRatio } from '@app/_lib/calculation';

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

  const datasets = useMemo(() => {
    if (!backtestData) return [];

    const data = backtestData.map((d) => {
      if (d.id.indexOf(',') === -1) return null;

      const [xPair, yPair] = d.id.split(', ').map((pair) => {
        const [key, value] = pair.split('=');
        return { key, value: +value };
      });
      let sharpeRatio = calculateSharpeRatio({
        klineData,
        inputTrades: d.trades,
        interval,
      }).toDecimalPlaces(2);

      return {
        xPair,
        yPair,
        value: sharpeRatio.isNaN() ? new Decimal(0) : sharpeRatio,
      };
    });

    const findFirstData = data.find((d) => d && d);

    if (findFirstData) {
      setXSelect(findFirstData.xPair.key);
      return data;
    }
    return [];
  }, [backtestData]);

  const chartData = useMemo(
    () =>
      datasets.filter((data) => {
        return data && (data.xPair.key === xSelect || data.yPair.key === ySelect);
      }),
    [datasets, xSelect, ySelect],
  );

  useEffect(() => {
    if (!heatMapContainerRef.current) return;
    const margin = { top: 100, right: 180, bottom: 50, left: 100 };
    const width = heatMapContainerRef.current?.offsetWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    if (heatMapContainerRef.current.firstChild) {
      Array.from(heatMapContainerRef.current.children).forEach((c) => c.remove());
    }

    const xDomain = [...new Set(chartData.map((d) => d!.xPair.value))];
    const yDomain = [...new Set(chartData.map((d) => d!.yPair.value))];
    const correspondingData = chartData.find((data) => data!.xPair.key === xSelect);

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
        return correspondingData ? correspondingData.xPair.key : '';
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
        return correspondingData ? correspondingData.yPair.key : '';
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
      .attr('x', (d, i) => xScale(d!.xPair.value)!)
      .attr('y', (d, i) => yScale(d!.yPair.value)!)
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
      .attr('x', (d, i) => xScale(d!.xPair.value)! + xScale.bandwidth() / 2)
      .attr('y', (d, i) => yScale(d!.yPair.value)! + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => d!.value.toFixed(2))
      .style('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif');

    return () => {
      svg.remove();
    };
  }, [backtestData, xSelect, ySelect]);
  if (!backtestData) return null;
  return <div className="max-h-fit" ref={heatMapContainerRef}></div>;
};

export default HeatMap;
