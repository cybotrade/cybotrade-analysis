'use client';

import Decimal from 'decimal.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useState } from 'react';
import { errorUtil } from 'zod/lib/helpers/errorUtil';

import HeatMap from '@app/(routes)/(route)/_components/HeatMap';
import SharpeRatio from '@app/(routes)/(route)/_components/SharpeRatio';
import SortHeader from '@app/(routes)/(route)/_components/SortHeader';
import { useBacktests } from '@app/_hooks/useBacktests';
import { useDebounce } from '@app/_hooks/useDebounce';
import useDrawer, { IDrawer } from '@app/_hooks/useDrawer';
import { useKline } from '@app/_hooks/useKline';
import {
  PerformanceData,
  calculatePerformance,
  transformToClosedTrades,
} from '@app/_lib/calculation';
import { cn, sortByTimestamp } from '@app/_lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@app/_ui/Accordion';
import { Sheet, SheetContent } from '@app/_ui/Sheet';

import { IBackTestDataMultiSymbols, ITrade } from '../type';
import { CandleChart } from './CandleChart';
import { EquityCurve } from './EquityCurve';
import { MonteCarlo } from './MonteCarlo';
import { ResultBreakdown } from './ResultBreakdown';
import SettingsForm, { SettingsValue } from './SettingsForm';

// import { Trend } from './Trend';

const SurfacePlot = dynamic(() => import('./SurfacePlot'), {
  ssr: false,
});

export type Pair = {
  key: string;
  value: number;
};

export type FullPerformance = {
  allPairs: Pair[];
  id: string;
  performance: PerformanceData;
};

interface IBackTestResultsDrawer {
  data: IBackTestDataMultiSymbols;
  drawer: IDrawer;
  fetchedKlinesPercentage: (percentage: number, error?: string) => void;
  onAnalysisFailed: (error: string) => void;
}

const BackTestResultsDrawer = ({
  data,
  drawer,
  fetchedKlinesPercentage,
  onAnalysisFailed,
}: IBackTestResultsDrawer) => {
  const [userSettings, setUserSettings] = useState<SettingsValue>({
    initial_capital: 10000,
    // order_size_unit: 'usdt',
    // order_size_value: undefined,
    // leverage: undefined,
    fees: 0,
    // take_profit: [{ value: undefined }, { value: undefined }],
    // stop_lost: [{ value: undefined }, { value: undefined }],
    // entry: [{ value: undefined }, { value: undefined }],
  });

  const calculateFees = useMemo(
    () => new Decimal(userSettings.fees!).div(100).toNumber(),
    [userSettings.fees],
  );

  const {
    backtestData,
    selectedBacktest,
    symbol,
    interval,
    permutationOptions,
    selectedPermutation,
    setSelectedPermutation,
  } = useBacktests(data, onAnalysisFailed);

  const sortedTrades = useMemo(() => {
    if (!selectedBacktest) return [];
    const trades = selectedBacktest.trades.map((trade) => {
      return {
        ...trade,
        // quantity: userSettings.order_size_value
        //   ? new Decimal(userSettings.order_size_value).div(trade.price).toNumber()
        //   : trade.quantity,
        fees: userSettings.fees,
      };
    });
    return sortByTimestamp<ITrade>(trades);
  }, [selectedBacktest, userSettings.fees]);
  const closedTrades = useMemo(
    () => (selectedBacktest ? transformToClosedTrades(selectedBacktest.trades) : []),
    [sortedTrades],
  );

  const { klineData, doneFetchingKline } = useKline(
    selectedBacktest,
    symbol,
    interval,
    fetchedKlinesPercentage,
  );
  // const performanceData = useMemo(() => {
  //   if (!doneFetchingKline) return;
  //   return calculatePerformance({
  //     tradeOrders: { klineData: klineData ?? [], trades: sortedTrades, interval },
  //     parameters: {
  //       comission: 0,
  //       initialCapital: userSettings.initial_capital ?? 10000,
  //       riskFreeRate: 0.02,
  //       fees: userSettings.fees,
  //     },
  //   });
  // }, [selectedBacktest, doneFetchingKline]);
  const [debouncedDelimitor, delimitor, setDelimitor] = useDebounce<string>('=', 500);
  const [debouncedSeparator, separator, setSeparator] = useDebounce<string>(',', 500);

  const [completeData, setCompleteData] = useState<FullPerformance[]>([]);

  const [xAxisSelected, setxAxisSelected] = useState('');
  const [yAxisSelected, setyAxisSelected] = useState('');

  const settingDrawer = useDrawer();

  const onSettingsFormUpdate = (values: SettingsValue) => {
    setUserSettings(values);
  };

  useEffect(() => {
    if (!doneFetchingKline) {
      setCompleteData([]);
      return;
    }
    if (!backtestData || !klineData) {
      setCompleteData([]);
      return;
    }
    if (backtestData.length === 0 || klineData.length === 0) {
      setCompleteData([]);
      return;
    }
    if (!debouncedDelimitor || !separator) {
      setCompleteData([]);
      return;
    }
    const data = backtestData.map((d) => {
      let pairs;
      if (d.id.indexOf(debouncedDelimitor) === -1 || d.id.indexOf(debouncedSeparator) === -1) {
        pairs = [{ key: '', value: 0 }];
      } else {
        pairs = d.id
          .split(debouncedSeparator)
          .map((pair) => {
            if (pair.indexOf(debouncedDelimitor) === -1) return { key: '', value: 0 };
            const [key, value] = pair.split(debouncedDelimitor);
            return { key: key.trim(), value: +value };
          })
          .filter((p) => p);
      }
      let performance = calculatePerformance({
        tradeOrders: { klineData: klineData ?? [], trades: d.trades, interval },
        parameters: {
          comission: 0,
          initialCapital: 10000,
          riskFreeRate: 0.02,
          globalFees: calculateFees,
        },
      });

      return {
        allPairs: pairs,
        id: d.id,
        performance: performance,
      };
    });

    setCompleteData(data);
  }, [klineData, debouncedDelimitor, debouncedSeparator, !doneFetchingKline, calculateFees]);

  const filteredDatasets = useMemo(() => {
    if (!completeData || completeData.length === 0) return [];
    const datasets = completeData.filter(
      (d): d is { allPairs: Pair[]; id: string; performance: PerformanceData } =>
        !!d && d.allPairs.length > 1,
    );

    return datasets;
  }, [completeData]);

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
    if (data && klineData && klineData?.length > 0 && doneFetchingKline) {
      drawer.open();
    }
  }, [data, klineData, doneFetchingKline]);
  const resultContents = [
    {
      value: 'result-breakdown',
      label: 'Result Breakdown',
      content: (
        <ResultBreakdown fullPerformance={completeData} selectedBacktest={selectedBacktest} />
      ),
    },
    {
      value: 'candle-chart',
      label: 'Candle Chart',
      content: <CandleChart backtestData={selectedBacktest} klineData={klineData ?? []} />,
    },
    {
      value: 'equity-curve',
      label: 'Equity Curve',
      content: (
        <EquityCurve
          fullPerformance={completeData}
          selectedBacktest={selectedBacktest}
          // klineData={klineData ?? []}
          // userSettings={userSettings}
        />
      ),
    },
    {
      value: 'sharpe-ratio',
      label: 'Sharpe Ratio',
      content: <SharpeRatio fullResult={completeData} />,
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
            <SettingsForm onUpdate={onSettingsFormUpdate} values={userSettings} />
          </SheetContent>
        </Sheet>
        <SortHeader
          permutationOptions={permutationOptions}
          selectedPermutation={selectedPermutation}
          onPermutationChange={(option) => setSelectedPermutation(option)}
        />
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

export default BackTestResultsDrawer;
