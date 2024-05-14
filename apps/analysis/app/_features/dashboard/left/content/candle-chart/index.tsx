'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { ITrade } from '@app/(routes)/(route)/type';
import { CandlestickChart } from '@app/_features/dashboard/left/content/candle-chart/CandlestickChart';
import { Page } from '@app/_hooks/useKlineInfiniteQuery';
import { useBacktestData } from '@app/_providers/backtest';

type TNewCandleChartProps = {};

const NewCandleChart = ({}: TNewCandleChartProps) => {
  const queryClient = useQueryClient();
  const [queryKey, data] = queryClient.getQueriesData<InfiniteData<Page>>({
    queryKey: ['candles'],
  })[0];
  const { permutationId, backtests } = useBacktestData();

  const trades = backtests.values().next().value.trades;

  if (data?.pages.length === 0) throw new Error('No candles Data');
  return <CandlestickChart key={permutationId} data={data} trades={trades} />;
};

export default NewCandleChart;
