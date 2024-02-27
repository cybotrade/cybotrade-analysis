'use client';

import { Kline } from 'binance';
import Decimal from 'decimal.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import HeatMap from '@app/(routes)/(route)/_components/HeatMap';
import SharpeRatio from '@app/(routes)/(route)/_components/SharpeRatio';
import SortHeader from '@app/(routes)/(route)/_components/SortHeader';
import { useDebounce } from '@app/_hooks/useDebounce';
import useDrawer, { IDrawer } from '@app/_hooks/useDrawer';
import { calculateSharpeRatio, transformToClosedTrades } from '@app/_lib/calculation';
import { Interval } from '@app/_lib/utils';
import { cn, sortByTimestamp } from '@app/_lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@app/_ui/Accordion';
import { Sheet, SheetContent } from '@app/_ui/Sheet';

import { IBackTestData, IBackTestDataMultiSymbols, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { ResultBreakdown } from './ResultBreakdown';
import SettingsForm, { SettingsValue } from './SettingsForm';
import { Trend } from './Trend';

const SurfacePlot = dynamic(() => import('./SurfacePlot'), {
  ssr: false,
});

type Pair = {
  key: string;
  value: number;
};

interface IBackTestResultsDrawer {
  data: IBackTestDataMultiSymbols;
  drawer: IDrawer;
  fetchedKlinePercentage: (percentage: number, error?: string) => void;
}

const BackTestResultsDrawer = ({
  data,
  drawer,
  fetchedKlinePercentage,
}: IBackTestResultsDrawer) => {
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
  const backtestData = useMemo(() => {
    const topics = data.candle_topics.map((t) => t.split('|'));
    const details = topics.map((topic) => {
      const [category, interval, symbol, exchange] = topic[0].split('-');
      const type = topic[1];
      const [base, quote] = symbol.split('/');
      return {
        category,
        interval,
        currency: {
          base,
          quote,
        },
        type,
      };
    });

    const symbols = details.map(({ currency }) => `${currency.base}${currency.quote}`);
    const intervals = details.reduce<{
      [key: string]: Interval[] | string[];
    }>((acc, _, i) => {
      acc[symbols[i]] = [details[i].interval];
      return acc;
    }, {});

    const permutations = Object.entries(data.trades).map(([id, trades]) => {
      return {
        id,
        trades: JSON.parse(trades).trades,
      };
    });

    return permutations.map(({ id, trades }) => {
      let sortedTrades = trades[Object.keys(trades)[0]].map((trade: ITrade) => {
        return {
          ...trade,
          quantity: userSettings.order_size_value
            ? new Decimal(userSettings.order_size_value).div(trade.price).toNumber()
            : trade.quantity,
          fees: userSettings.fees ?? 0,
        };
      }) as ITrade[];

      return {
        id: id,
        symbols: Object.keys(trades)[0],
        intervals: intervals[Object.keys(trades)[0]],
        trades: sortByTimestamp<ITrade>(sortedTrades),
        start_time: data.start_time.toString(),
        end_time: data.end_time.toString(),
      };
    });
  }, [data]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedPermutation, setSelectedPermutation] = useState(backtestData[0].id);

  const [debouncedDelimitor, delimitor, setDelimitor] = useDebounce<string>('=', 500);
  const [debouncedSeparator, separator, setSeparator] = useDebounce<string>(',', 500);

  const [pairs, setPairs] = useState<({ allPairs: (Pair | undefined)[]; value: Decimal } | null)[]>(
    [],
  );

  const [xAxisSelected, setxAxisSelected] = useState('');
  const [yAxisSelected, setyAxisSelected] = useState('');

  const [klineData, setKlineData] = useState<Kline[] | null>([]);
  const [doneFetchingKline, setDoneFetchingKline] = useState(false);

  const settingDrawer = useDrawer();

  const onSettingsFormUpdate = (values: SettingsValue) => {
    setUserSettings(values);
  };

  const selectedBacktest = useMemo(() => {
    return backtestData.filter((backtest) => backtest.id === selectedPermutation)[0];
  }, [selectedPermutation]);

  const symbol = selectedBacktest
    ? (selectedBacktest.symbols.split('/').join('') as string)
    : 'BTCUSDT';
  const interval = selectedBacktest ? (selectedBacktest.intervals[0] as Interval) : Interval.OneDay;
  const closedTrades = selectedBacktest ? transformToClosedTrades(selectedBacktest.trades) : [];

  const permutationIds = useMemo(
    () => (backtestData ? backtestData.map(({ id }) => id) : []),
    [backtestData],
  );

  useEffect(() => {
    if (!backtestData || !klineData) return;
    if (!debouncedDelimitor || !separator) {
      setPairs([]);
      return;
    }

    const data = backtestData.map((d) => {
      if (d.id.indexOf(debouncedDelimitor) === -1 || d.id.indexOf(debouncedSeparator) === -1)
        return null;

      const allPairs = d.id
        .split(debouncedSeparator)
        .map((pair) => {
          if (pair.indexOf(debouncedDelimitor) === -1) return undefined;
          const [key, value] = pair.split(debouncedDelimitor);
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

    setPairs(data);
  }, [klineData, debouncedDelimitor, debouncedSeparator]);

  const filteredDatasets = useMemo(() => {
    if (!pairs || pairs.length === 0) return [];
    const datasets = pairs.filter(
      (d): d is { allPairs: Pair[]; value: Decimal } => !!d && d.allPairs.length > 1,
    );

    return datasets;
  }, [pairs]);

  useEffect(() => {
    if (filteredDatasets.length === 0) {
      setxAxisSelected('');
      setyAxisSelected('');
      return;
    }
    setxAxisSelected(filteredDatasets[0].allPairs[0].key);
    setyAxisSelected(filteredDatasets[0].allPairs[1].key);
  }, [filteredDatasets]);

  useEffect(() => {
    if (!selectedBacktest) return;
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
      fetchKlineData({
        startTime: selectedBacktest.start_time,
        endTime: selectedBacktest.end_time,
      });
    }
    if (klineData && klineData[0] && klineData[0][0] > +selectedBacktest.start_time) {
      const fetchedPercentage = Math.round(
        ((+selectedBacktest.end_time - klineData[0][0]) /
          (+selectedBacktest.end_time - +selectedBacktest.start_time)) *
          100,
      );
      fetchedKlinePercentage(fetchedPercentage);
      fetchKlineData({
        startTime: selectedBacktest.start_time,
        endTime: klineData[0][0].toString(),
      });
    }
    if (klineData && klineData[0] && klineData[0][0] < +selectedBacktest.start_time) {
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

  const handlePermutationChange = useCallback(
    (option: string) => {
      setSelectedPermutation(option);
      setKlineData([]);
    },
    [selectedPermutation],
  );

  const resultContents = [
    {
      value: 'candle-chart',
      label: 'Candle Chart',
      content: (
        <CandleChart
          backtestData={selectedBacktest}
          klineData={klineData ?? []}
          symbol={symbol}
          interval={interval}
        />
      ),
    },
    {
      value: 'equity-curve',
      label: 'Equity Curve',
      content: (
        <EquityCurve
          backtestData={selectedBacktest}
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
      content: selectedBacktest && (
        <ResultBreakdown
          klineData={klineData ?? []}
          trades={selectedBacktest.trades}
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
        <HeatMap
          datasets={filteredDatasets ?? []}
          delimitor={delimitor}
          separator={separator}
          xAxisSelected={xAxisSelected}
          yAxisSelected={yAxisSelected}
          onDelimitorChange={setDelimitor}
          onSeparatorChange={setSeparator}
          onxAxisSelect={setxAxisSelected}
          onyAxisSelect={setyAxisSelected}
        />
      ),
    },
    {
      value: 'surface-plot',
      label: 'Surface Plot',
      content: (
        <SurfacePlot
          datasets={filteredDatasets}
          delimitor={delimitor}
          separator={separator}
          xAxisSelected={xAxisSelected}
          yAxisSelected={yAxisSelected}
          onDelimitorChange={setDelimitor}
          onSeparatorChange={setSeparator}
          onxAxisSelect={setxAxisSelected}
          onyAxisSelect={setyAxisSelected}
        />
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
        overlayChildren={
          <div
            className={cn(
              'absolute h-[58px] w-[58px] m-8 bottom-0 bg-white rounded-full border-2 border-primary-light p-4 shadow-xl hover:bg-primary duration-200',
              settingDrawer.isOpen ? 'opacity-0' : 'opacity-100',
            )}
            onPointerDown={(e) => {
              e.stopPropagation();
              settingDrawer.open();
            }}
          >
            <ChevronRight color="#E1C3A0" strokeWidth={2.5} className="h-5 w-5" />
          </div>
        }
      >
        <Sheet
          key={'2'}
          open={settingDrawer.isOpen}
          onOpenChange={() => (settingDrawer.isOpen ? settingDrawer.close() : settingDrawer.open())}
          modal={false}
        >
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
        <SortHeader
          permutationOptions={permutationIds}
          selectedPermutation={selectedPermutation}
          onPermutationChange={handlePermutationChange}
        />
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
