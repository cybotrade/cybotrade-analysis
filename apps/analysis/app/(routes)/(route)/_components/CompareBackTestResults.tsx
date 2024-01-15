import { Kline } from 'binance';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Interval } from '@cybotrade/core';

import useDrawer, { IDrawer } from '@app/_hooks/useDrawer';
import { transformToClosedTrades } from '@app/_lib/calculation';
import { cn, sortByTimestamp } from '@app/_lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@app/_ui/Accordion';
import { Sheet, SheetContent, SheetTrigger } from '@app/_ui/Sheet';

import { IBackTestData, IBackTestDataMultiSymbols, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import CompareResultBreakdown from './CompareResultBreakdown';
import CompareSettingsForm, { SettingsValue } from './CompareSettingsForm';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { Trend } from './Trend';

interface ICompareBackTestResultsDrawer {
  data: IBackTestDataMultiSymbols[] | undefined;
  drawer: IDrawer;
  fetchedKlinePercentage: (percentage: number) => void;
}

const CompareBackTestResultsDrawer = (props: ICompareBackTestResultsDrawer) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const settingDrawer = useDrawer();
  const [userSettings, setUserSettings] = useState<SettingsValue>({
    initial_capital: 10000,
    order_size_unit: undefined,
    order_size_value: undefined,
    leverage: undefined,
    fees: undefined,
    take_profit: [{ value: undefined }, { value: undefined }],
    stop_lost: [{ value: undefined }, { value: undefined }],
    entry: [{ value: undefined }, { value: undefined }],
  });

  const onSettingsFormUpdate = (values: SettingsValue) => {
    setUserSettings(values);
    settingDrawer.close();
  };

  const { data, drawer, fetchedKlinePercentage } = props;
  if (!data) return null;
  const filteredSymbol = data[selectedIndex].symbols[0]; // temporary to support only one symbol
  const backtestData = {
    ...data[selectedIndex],
    symbols: filteredSymbol,
    intervals: data[selectedIndex].intervals[filteredSymbol],
    trades: sortByTimestamp<ITrade>(data[selectedIndex]?.trades[filteredSymbol] as ITrade[]),
  } as IBackTestData;
  const symbol = backtestData ? (backtestData.symbols.split('/').join('') as string) : 'BTCUSDT';
  const interval = backtestData
    ? Interval[backtestData.intervals[0] as unknown as keyof typeof Interval]
    : Interval.OneDay;
  const closedTrades = backtestData ? transformToClosedTrades(backtestData.trades) : [];

  const [klineData, setKlineData] = useState<Kline[] | null>([]);
  const [doneFetchingKline, setDoneFetchingKline] = useState(false);

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
      const fetchedPercentage = Math.round(
        ((+backtestData.end_time - klineData[0][0]) /
          (+backtestData.end_time - +backtestData.start_time)) *
          100,
      );
      fetchedKlinePercentage(fetchedPercentage);
      fetchKlineData({ startTime: backtestData.start_time, endTime: klineData[0][0].toString() });
    }
    if (klineData && klineData[0] && klineData[0][0] < +backtestData.start_time) {
      setDoneFetchingKline(true);
      fetchedKlinePercentage(100);
    }
    return () => abortController.abort();
  }, [klineData]);

  useEffect(() => {
    if (data && klineData && klineData?.length > 0 && doneFetchingKline) {
      drawer.open();
    }
  }, [data, klineData, doneFetchingKline]);

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
          initialCapital={userSettings.initial_capital}
        />
      ),
    },
    {
      value: 'result-breakdown',
      label: 'Result Breakdown',
      content: (
        // <ResultBreakdown
        //   closedTrades={closedTrades}
        //   initialCapital={userSettings.initial_capital}
        // />
        <CompareResultBreakdown />
      ),
    },
    { value: 'trend', label: 'Trend', content: <Trend closedTrades={closedTrades} /> },
    {
      value: 'monte-carlo',
      label: 'Monte Carlo',
      content: (
        <MonteCarlo closedTrades={closedTrades} initialCapital={userSettings.initial_capital} />
      ),
    },
  ];

  return (
    <Sheet
      key={'1'}
      open={drawer.isOpen}
      onOpenChange={() => (drawer.isOpen ? drawer.close() : drawer.open())}
    >
      <SheetContent
        side={'right'}
        className="min-w-[75%] overflow-y-scroll overflow-x-clip"
        onPointerDownOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        overlayChildren={
          <Sheet
            key={'2'}
            open={settingDrawer.isOpen}
            onOpenChange={() =>
              settingDrawer.isOpen ? settingDrawer.close() : settingDrawer.open()
            }
          >
            <SheetTrigger
              className={cn(
                'absolute m-8 bottom-0 bg-white rounded-full border-2 border-primary-light p-4 shadow-xl hover:bg-primary duration-200',
                settingDrawer.isOpen ? 'opacity-0' : 'opacity-100',
              )}
            >
              <ChevronRight
                onClick={settingDrawer.open}
                color="#E1C3A0"
                strokeWidth={2.5}
                className="h-5 w-5"
              />
            </SheetTrigger>
            <SheetContent
              side={'left'}
              className="min-w-[26%] rounded-r-lg"
              overlayClassName="hidden"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div
                onClick={settingDrawer.close}
                className="absolute z-50 h-[58px] w-[58px] mb-8 bottom-0 right-0 translate-x-1/2 bg-white rounded-full border-2 border-primary-light duration-200 flex items-center justify-center shadow-xl cursor-pointer hover:bg-primary"
              >
                <ChevronLeft color="#E1C3A0" strokeWidth={2.5} className="h=[20px]" />
              </div>
              <CompareSettingsForm onUpdate={onSettingsFormUpdate} values={userSettings} />
            </SheetContent>
          </Sheet>
        }
      >
        <Accordion type="multiple" defaultValue={['result-breakdown']}>
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
  );
};

export default CompareBackTestResultsDrawer;
