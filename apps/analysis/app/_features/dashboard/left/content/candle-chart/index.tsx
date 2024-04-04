'use client';

import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import {
  CandlestickData,
  CandlestickStyleOptions,
  ChartOptions,
  ColorType,
  DeepPartial,
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  SeriesMarker,
  SeriesOptionsCommon,
  Time,
  type UTCTimestamp,
  createChart,
} from 'lightweight-charts';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ITrade } from '@app/(routes)/(route)/type';
import { CandlestickChart } from '@app/_features/dashboard/left/content/candle-chart/CandlestickChart';
import { Page } from '@app/_hooks/useKlineInfiniteQuery';
import { cn } from '@app/_lib/utils';
import { useBacktestData } from '@app/_providers/backtest';
import { debounce } from '@app/_utils/helper';

type TNewCandleChartProps = {};

const NewCandleChart = ({}: TNewCandleChartProps) => {
  const queryClient = useQueryClient();
  const [queryKey, data] = queryClient.getQueriesData<InfiniteData<Page>>({
    queryKey: ['candles'],
  })[0];
  const { backtests } = useBacktestData();
  const trades = useRef(new Map<string, ITrade[]>(backtests.values().next().value[1].trades));
  if (data?.pages.length === 0) throw new Error('No candles Data');
  return <CandlestickChart data={data} trades={trades.current} />;
};

export default NewCandleChart;
