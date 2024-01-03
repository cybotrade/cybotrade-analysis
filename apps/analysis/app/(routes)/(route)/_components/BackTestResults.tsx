import { Kline } from 'binance';
import React, { useEffect, useState } from 'react';

import { Interval } from '@cybotrade/core';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@app/_components/ui/Accordion';
import useDrawer from '@app/_hooks/useDrawer';
import { transformToClosedTrades } from '@app/_lib/calculation';
import { sortByTimestamp } from '@app/_lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@app/ui/sheet';

import { IBackTestData, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { ResultBreakdown } from './ResultBreakdown';
import { Trend } from './Trend';

interface IBackTestResultsDrawer {
  data: IBackTestData[] | undefined;
}

const BackTestResultsDrawer = (props: IBackTestResultsDrawer) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { close, isOpen, open } = useDrawer();
  const { data } = props;
  if (!data) return null;
  const backtestData = {
    ...data[selectedIndex],
    trades: sortByTimestamp<ITrade>(data[selectedIndex]?.trades),
  } as IBackTestData;
  const symbol = backtestData ? (backtestData.symbol?.split('/').join('') as string) : 'BTCUSDT';
  const interval = backtestData
    ? Interval[backtestData.intervals[0] as unknown as keyof typeof Interval]
    : Interval.OneDay;
  const closedTrades = backtestData ? transformToClosedTrades(backtestData.trades) : [];

  const [klineData, setKlineData] = useState<Kline[] | null>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchKlineData = async ({
      startTime,
      endTime,
    }: {
      startTime: string;
      endTime: string;
    }) => {
      try {
        const req = await fetch(
          '/api/candle?' +
            new URLSearchParams({
              symbol,
              interval,
              startTime,
              endTime,
            }),
          {
            signal: abortController.signal,
            method: 'GET',
          },
        );
        const res: Kline[] = await req.json();
        if (!req.ok) {
          throw new Error(`HTTP error! Status: ${req.status}`);
        }

        setKlineData((prev) => {
          const filteredPrev: Kline[] = prev ? prev?.filter((r) => r[0] !== +endTime) : [];
          return [...res, ...filteredPrev];
        });
      } catch (error) {
        console.log('error', error);
      }
    };

    if (klineData?.length === 0) {
      fetchKlineData({ startTime: backtestData.start_time, endTime: backtestData.end_time });
    }
    if (klineData && klineData[0] && klineData[0][0] > +backtestData.start_time) {
      fetchKlineData({ startTime: backtestData.start_time, endTime: klineData[0][0].toString() });
    }
    return () => abortController.abort();
  }, [klineData]);

  useEffect(() => {
    if (data && klineData && klineData?.length > 0) {
      open();
    }
  }, [data, klineData]);
  const resultContents = [
    {
      value: 'candle-chart',
      label: 'Candle Chart',
      content: <CandleChart backtestData={backtestData} klineData={klineData ?? []} />,
    },
    {
      value: 'equity-curve',
      label: 'Equity Curve',
      content: (
        <EquityCurve
          backtestData={backtestData}
          symbol={symbol}
          interval={interval}
          klineData={klineData ?? []}
        />
      ),
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
    // <Drawer
    //   header={false}
    //   onClose={props.onClose}
    //   open={open}
    //   onOpen={props.onOpen}
    //   size={'lg'}
    //   className="relative"
    // >
    <Sheet key={'1'} open={isOpen} onOpenChange={() => (isOpen ? close() : open())}>
      <SheetContent
        side={'right'}
        className="min-w-[70%] overflow-y-scroll overflow-x-clip"
        onPointerDownOutside={(e) => e.preventDefault()}
        overlayChildren={
          <Sheet key={'2'}>
            <SheetTrigger className="fixed left-0">Open</SheetTrigger>
            <SheetContent side={'left'} className="min-w-[30%]" overlayClassName="hidden">
              second sheet
            </SheetContent>
          </Sheet>
        }
      >
        {/* <BackTestResults data={data} /> */}
        <Accordion type="multiple" defaultValue={['candle-chart']}>
          {resultContents.map((item) => (
            <AccordionItem value={item.value} data-accordion-item={item.value} key={item.value}>
              <AccordionTrigger className="rounded-xl border font-normal">
                <div>{item.label}</div>
              </AccordionTrigger>
              <AccordionContent className="p-0 dark:bg-[#473E2D]" id={item.value}>
                <div id={`${item.value}-content`}>{item.content}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
    // </Drawer>
  );
};

export default BackTestResultsDrawer;
