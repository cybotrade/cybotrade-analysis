import { useCallback, useEffect, useMemo, useState } from 'react';

import { IBackTestData, IBackTestDataMultiSymbols, ITrade } from '@app/(routes)/(route)/type';
import { Interval, roundIntervalDate, sortByTimestamp } from '@app/_lib/utils';

export function useBacktests(data: IBackTestDataMultiSymbols) {
  const [backtestData, setBacktestData] = useState<IBackTestData[]>([]);
  const [selectedPermutation, setSelectedPermutation] = useState('');

  const computeBacktests = useCallback(() => {
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

    const permutations = Object.entries(data.trades).flatMap(([id, trades]) => {
      let parsedTrades = JSON.parse(trades).trades;
      let symbols = Object.keys(parsedTrades)[0];
      let interval = intervals[symbols];

      if (parsedTrades[symbols].length === 0) return [];

      return {
        id: id || 'default=0,default=0',
        symbols: symbols,
        intervals: interval,
        trades: parsedTrades[symbols].map((trade: ITrade) => ({ ...trade, fees: 0 })),
        start_time: roundIntervalDate(data.start_time, interval[0] as Interval).toString(),
        end_time: roundIntervalDate(data.end_time, interval[0] as Interval).toString(),
      };
    });

    setBacktestData(permutations);
    setSelectedPermutation(permutations[0].id);
  }, [setBacktestData]);

  useEffect(() => {
    computeBacktests();
  }, [computeBacktests]);

  const permutationOptions = useMemo(
    () => (backtestData ? backtestData.map(({ id }) => id) : []),
    [backtestData],
  );

  const selectedBacktest = useMemo(
    () => backtestData.filter((backtest) => backtest.id === selectedPermutation)[0],
    [selectedPermutation],
  );

  const symbol = useMemo(
    () => (selectedBacktest ? (selectedBacktest.symbols.split('/').join('') as string) : 'BTCUSDT'),
    [selectedPermutation],
  );
  const interval = useMemo(
    () => (selectedBacktest ? (selectedBacktest.intervals[0] as Interval) : Interval.OneDay),
    [selectedPermutation],
  );

  return {
    backtestData,
    selectedBacktest,
    symbol,
    interval,
    permutationOptions,
    selectedPermutation,
    setSelectedPermutation,
  };
}
