import { Kline } from 'binance';
import * as d3 from 'd3';
import { ZoomBehavior } from 'd3';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useRef } from 'react';

import { IBackTestData } from '@app/(routes)/(route)/type';
import { calculateSharpeRatio } from '@app/_lib/calculation';
import { Interval } from '@app/_lib/utils';

type SharpeRatioProps = {
  backtestData: IBackTestData[];
  klineData: Kline[];
  interval: Interval;
};

type ChartDataType = {
  x: string;
  y: number;
};

const SharpeRatio = ({ backtestData, klineData, interval }: SharpeRatioProps) => {
  const sharpeRatioContainerRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme } = useTheme();
  const chartData: ChartDataType[] = useMemo(() => {
    const data = backtestData.map((d) => {
      let sharpeRatio = calculateSharpeRatio({
        klineData,
        inputTrades: d.trades,
        interval,
      }).toDecimalPlaces(2);

      return {
        id: d.id,
        sharpeRatio,
      };
    });
    return data.map((d) => ({ x: d.id, y: d.sharpeRatio.toNumber() }));
  }, [backtestData]);

  useEffect(() => {
    if (!sharpeRatioContainerRef.current) return;

    const margin = { top: 20, right: 180, bottom: 50, left: 100 };
    const width = sharpeRatioContainerRef.current.offsetWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    if (sharpeRatioContainerRef.current.firstChild) {
      Array.from(sharpeRatioContainerRef.current.children).forEach((c) => c.remove());
    }
    const xDomain = chartData.map((d) => d.x);
    const yDomain = chartData.map((d) => d.y);

    const zoomBehavior: ZoomBehavior<SVGSVGElement, unknown> = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 10])
      .translateExtent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.top],
      ])
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.top],
      ])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const mouseX = event.sourceEvent.offsetX;
        const mouseY = event.sourceEvent.offsetY;

        if (
          mouseX > margin.left &&
          mouseX < margin.left + width &&
          mouseY > margin.top &&
          mouseY < margin.top + height
        ) {
          let newX = xScale.range([0, width].map((d) => event.transform.applyX(d)));
          let newY = event.transform.rescaleY(yScale);

          bars
            .attr('x', (d) => newX(d.x)!)
            .attr('y', (d) => (d.y < 0 ? newY(0) : newY(d.y)))
            .attr('width', newX.bandwidth() - newX.paddingInner())
            .attr('height', (d) =>
              d.y < 0 ? Math.abs(newY(d.y) - newY(0)) : Math.abs(newY(0) - newY(d.y)),
            );

          xAxis.call(xAxisTicks).call((g) => g.select('.domain').remove());
          yAxis
            .call(
              d3
                .axisLeft(newY)
                .tickFormat(d3.format('.2f'))
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(15),
            )
            .call((g) => g.select('.domain').remove())
            .selectAll('line')
            .attr('stroke', '#adadad')
            .attr('stroke-dasharray', '2,2');
        }
      });

    const svg = d3
      .select(sharpeRatioContainerRef.current as HTMLElement)
      .append('svg')
      .attr('viewBox', [
        0,
        0,
        width + margin.left + margin.right,
        height + margin.top + margin.bottom,
      ])
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 100)
      .call(zoomBehavior)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale: d3.ScaleBand<string> = d3
      .scaleBand<string>()
      .domain(xDomain)
      .range([0, width])
      .paddingInner(0.4)
      .paddingOuter(0);
    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .attr('clip-path', 'url(#chart-area)');
    const xAxisTicks = d3.axisBottom(xScale).tickSize(0).tickSizeOuter(0).tickPadding(15);

    const yMax = d3.max(yDomain) || 0;
    const yMin = d3.min(yDomain) || 0;
    const maxAbsValue = Math.max(Math.abs(yMin), Math.abs(yMax));
    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain(yMin < 0 ? [-maxAbsValue - 0.2, maxAbsValue] : [0, maxAbsValue + 0.2])
      .nice();
    const yAxis = svg.append('g').attr('class', 'y-axis');
    const yAxisTicks = d3
      .axisLeft(yScale)
      .tickFormat(d3.format('.2f'))
      .tickSizeInner(-width)
      .tickSizeOuter(0)
      .tickPadding(15);

    const areaDefs = svg.append('defs');
    areaDefs
      .append('clipPath')
      .attr('id', 'chart-area')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    const bars = svg
      .append('g')
      .attr('class', 'bars')
      .attr('clip-path', 'url(#chart-area)')
      .selectAll('rect')
      .data(chartData)
      .join('rect');
    xAxis
      .call(xAxisTicks)
      .call((g) => g.select('.domain').remove())
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '.8em')
      .attr('dy', '1.6em')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif');
    svg
      .append('text')
      .attr('x', width + 25)
      .attr('y', height + 3)
      .text('Permutations')
      .attr('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif')
      .attr('text-anchor', 'start');

    yAxis
      .call(yAxisTicks)
      .call((g) => g.select('.domain').remove())
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif')
      .selectAll('line')
      .attr('stroke', '#adadad')
      .attr('stroke-dasharray', '2,2');
    svg
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', -30)
      .text('Sharpe Ratio')
      .attr('fill', 'black')
      .style('font-size', '15px')
      .style('font-family', '"DM Sans", sans-serif')
      .attr('text-anchor', 'end');

    const patternDefs = svg.append('defs');
    const pattern = patternDefs
      .append('pattern')
      .attr('id', 'striped-pattern')
      .attr('width', 32)
      .attr('height', 32)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('patternTransform', 'rotate(45)');
    pattern.append('rect').attr('width', 32).attr('height', 32).attr('fill', '#7505ff');
    pattern.append('rect').attr('width', 16).attr('height', 32).attr('fill', 'rgba(0,0,0,0.2)');

    bars
      .attr('x', (d) => xScale(d.x)!)
      .attr('y', (d) => yScale(0))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('rx', 20)
      .attr('fill', 'url(#striped-pattern)');

    bars
      .transition()
      .duration(800)
      .attr('y', (d) => (d.y > 0 ? yScale(d.y) : yScale(0)))
      .attr('height', (d) => (d.y > 0 ? yScale(0) - yScale(d.y) : yScale(d.y) - yScale(0)))
      .delay((d, i) => i * 100);
    
    return () => {
      svg.remove();
    };
  }, [backtestData]);

  return <div className="w-full max-h-fit p-10" ref={sharpeRatioContainerRef}></div>;
};

export default SharpeRatio;
