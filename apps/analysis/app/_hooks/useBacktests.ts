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

    const permutations = Object.entries(data.trades).map(([id, trades]) => {
      return {
        id,
        trades: JSON.parse(trades).trades,
      };
    });

    setBacktestData(
      permutations.map(({ id, trades }) => {
        let interval = intervals[Object.keys(trades)[0]];

        return {
          id: id,
          symbols: Object.keys(trades)[0],
          intervals: interval,
          trades: trades[Object.keys(trades)[0]].map((trade: ITrade) => ({ ...trade, fees: 0 })),
          start_time: roundIntervalDate(data.start_time, interval[0] as Interval).toString(),
          end_time: roundIntervalDate(data.end_time, interval[0] as Interval).toString(),
        };
      }),
    );
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
