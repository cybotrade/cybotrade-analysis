'use client';

import { Kline } from 'binance';
import Decimal from 'decimal.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';

import { Interval } from '@cybotrade/core';

import HeatMap from '@app/(routes)/(route)/_components/HeatMap';
import useDrawer, { IDrawer } from '@app/_hooks/useDrawer';
import { transformToClosedTrades } from '@app/_lib/calculation';
import { cn, sortByTimestamp } from '@app/_lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@app/_ui/Accordion';
import { Sheet, SheetContent, SheetTrigger } from '@app/_ui/Sheet';

import { IBackTestData, IBackTestDataMultiSymbols, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { ResultBreakdown } from './ResultBreakdown';
import SettingsForm, { SettingsValue } from './SettingsForm';
import { Trend } from './Trend';

const SharpeRatio = dynamic(() => import('./SharpeRatio'), {
  ssr: false,
}); // using dynamic import here because it is not able to support SSR for 'chartjs-plugin-zoom' in SharpeRation component

interface IBackTestResultsDrawer {
  data: IBackTestDataMultiSymbols[] | undefined;
  drawer: IDrawer;
  fetchedKlinePercentage: (percentage: number, error?: string) => void;
}

const BackTestResultsDrawer = (props: IBackTestResultsDrawer) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const settingDrawer = useDrawer();
  const [userSettings, setUserSettings] = useState<SettingsValue>({
    initial_capital: 10000,
    order_size_unit: 'usdt',
    order_size_value: undefined,
    // leverage: undefined,
    fees: undefined,
    // take_profit: [{ value: undefined }, { value: undefined }],
    // stop_lost: [{ value: undefined }, { value: undefined }],
    // entry: [{ value: undefined }, { value: undefined }],
  });

  const onSettingsFormUpdate = (values: SettingsValue) => {
    setUserSettings(values);
  };

  const { data, drawer, fetchedKlinePercentage } = props;
  if (!data) return null;

  const filteredSymbol = data[selectedIndex].symbols[0]; // temporary to support only one symbol
  const sortedTrades = (trades: ITrade[]) => {
    if (!trades) return [] as ITrade[];
    if (trades.length === 0) return [] as ITrade[];
    trades = trades.map((trade) => {
      return {
        ...trade,
        quantity: userSettings.order_size_value
          ? new Decimal(userSettings.order_size_value).div(trade.price).toNumber()
          : trade.quantity,
        fees: userSettings.fees ?? 0,
      };
    });
    return sortByTimestamp<ITrade>(trades);
  };
  const backtestData = data.map((d) => {
    return {
      ...d,
      symbols: filteredSymbol,
      intervals: d.intervals[filteredSymbol],
      trades: sortedTrades(d.trades[filteredSymbol]),
    } as IBackTestData;
  });

  const symbol = backtestData ? (backtestData[0].symbols.split('/').join('') as string) : 'BTCUSDT';
  const interval = backtestData
    ? Interval[backtestData[0].intervals[0] as unknown as keyof typeof Interval]
    : Interval.OneDay;
  const closedTrades = backtestData ? transformToClosedTrades(backtestData[0].trades) : [];

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

        if (abortController.signal.aborted) {
          console.log('Request aborted');
          return;
        }

        const res = await req.json();
        if (!req.ok) {
          throw new Error(`${res.error}`);
        }
        if (req.ok) {
          setKlineData((prev) => {
            const filteredPrev: Kline[] = prev ? prev?.filter((r) => r[0] !== +endTime) : [];
            return [...res, ...filteredPrev];
          });
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Request aborted');
          return;
        }
        fetchedKlinePercentage(0, error as string);
      }
    };

    if (klineData?.length === 0) {
      fetchKlineData({ startTime: backtestData[0].start_time, endTime: backtestData[0].end_time });
    }
    if (klineData && klineData[0] && klineData[0][0] > +backtestData[0].start_time) {
      const fetchedPercentage = Math.round(
        ((+backtestData[0].end_time - klineData[0][0]) /
          (+backtestData[0].end_time - +backtestData[0].start_time)) *
          100,
      );
      fetchedKlinePercentage(fetchedPercentage);
      fetchKlineData({
        startTime: backtestData[0].start_time,
        endTime: klineData[0][0].toString(),
      });
    }
    if (klineData && klineData[0] && klineData[0][0] < +backtestData[0].start_time) {
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
      content: <CandleChart backtestData={backtestData[0]} klineData={klineData ?? []} />,
    },
    {
      value: 'equity-curve',
      label: 'Equity Curve',
      content: (
        <EquityCurve
          backtestData={backtestData[0]}
          symbol={symbol}
          interval={interval}
          klineData={klineData ?? []}
          userSettings={userSettings}
        />
      ),
    },
    {
      value: 'result-breakdown',
      label: 'Result Breakdown',
      content: (
        <ResultBreakdown
          klineData={klineData ?? []}
          trades={backtestData[0].trades}
          interval={interval}
          closedTrades={closedTrades}
          initialCapital={userSettings.initial_capital}
          fees={userSettings.fees ?? 0}
        />
      ),
    },
    { value: 'trend', label: 'Trend', content: <Trend closedTrades={closedTrades} /> },
    {
      value: 'sharpe-ratio',
      label: 'Sharpe Ratio',
      content: (
        <SharpeRatio backtestData={backtestData} klineData={klineData ?? []} interval={interval} />
      ),
    },
    {
      value: 'monte-carlo',
      label: 'Monte Carlo',
      content: (
        <MonteCarlo closedTrades={closedTrades} initialCapital={userSettings.initial_capital} />
      ),
    },
    {
      value: 'heat-map',
      label: 'Heat Map',
      content: (
        <HeatMap backtestData={backtestData} klineData={klineData ?? []} interval={interval} />
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
        overlayChildren={
          <Sheet
            key={'2'}
            open={settingDrawer.isOpen}
            onOpenChange={() =>
              settingDrawer.isOpen ? settingDrawer.close() : settingDrawer.open()
            }
            modal={false}
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
              onInteractOutside={(e) => e.preventDefault()}
            >
              <div
                onClick={settingDrawer.close}
                className="absolute z-50 h-[58px] w-[58px] mb-8 bottom-0 right-0 translate-x-1/2 bg-white rounded-full border-2 border-primary-light duration-200 flex items-center justify-center shadow-xl cursor-pointer hover:bg-primary"
              >
                <ChevronLeft color="#E1C3A0" strokeWidth={2.5} className="h=[20px]" />
              </div>
              <SettingsForm onUpdate={onSettingsFormUpdate} values={userSettings} />
            </SheetContent>
          </Sheet>
        }
      >
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
  );
};

export default BackTestResultsDrawer;
