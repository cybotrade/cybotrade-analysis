import React, { useState } from 'react';

import { Interval } from '@cybotrade/core';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@app/_components/ui/Accordion';
import Drawer from '@app/_components/ui/Drawer';
import { transformToClosedTrades, transformTrades } from '@app/_lib/calculation';
import { sortByTimestamp } from '@app/_lib/utils';

import { IBackTestData, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { ResultBreakdown } from './ResultBreakdown';
import { Trend } from './Trend';

interface IBackTestResultsDrawer {
  onOpen: () => void;
  open: boolean;
  onClose: () => void;
  data: IBackTestData[];
}

const BackTestResultsDrawer = (props: IBackTestResultsDrawer) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, onClose, onOpen, open } = props;
  const backtestData = {
    ...data[selectedIndex],
    trades: sortByTimestamp<ITrade>(data[selectedIndex]?.trades),
  } as IBackTestData;

  const symbol = backtestData ? (backtestData.symbol?.split('/').join('') as string) : 'BTCUSDT';

  const interval = backtestData
    ? Interval[backtestData.intervals[0] as unknown as keyof typeof Interval]
    : Interval.OneDay;

  const closedTrades = backtestData ? transformToClosedTrades(backtestData.trades) : [];
  const resultContents = [
    // { value: 'logs', label: 'Logs', content: 'Logs' },
    {
      value: 'candle-chart',
      label: 'Candle Chart',
      content: <CandleChart backtestData={backtestData} />,
    },
    {
      value: 'equity-curve',
      label: 'Equity Curve',
      content: <EquityCurve backtestData={backtestData} symbol={symbol} interval={interval} />,
    },
    {
      value: 'result-breakdown',
      label: 'Result Breakdown',
      content: <ResultBreakdown closedTrades={closedTrades} />,
    },
    { value: 'trend', label: 'Trend', content: <Trend closedTrades={closedTrades} /> },
    {
      value: 'monte-carlo',
      label: 'Monte Carlo',
      content: <MonteCarlo closedTrades={closedTrades} />,
    },
  ];

  return (
    <Drawer
      header={false}
      onClose={props.onClose}
      open={props.open}
      onOpen={props.onOpen}
      size={'lg'}
    >
      <Accordion type="multiple" defaultValue={['trend']}>
        {resultContents.map((item) => (
          <AccordionItem value={item.value} data-accordion-item={item.value} key={item.value}>
            <AccordionTrigger
              className="rounded-xl border font-normal"
              // onClick={() => handleScroll('logs')}
            >
              <div>{item.label}</div>
            </AccordionTrigger>
            <AccordionContent className="p-0 dark:bg-[#473E2D]" id={item.value}>
              <div id={`${item.value}-content`}>{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Drawer>
  );
};

export default BackTestResultsDrawer;
