'use client';

import React, { useRef } from 'react';

import { IClosedTradeProfit } from '@app/(routes)/(route)/type';
import { MonteCarloChart } from '@app/_features/dashboard/left/content/monte-carlo/MonteCarloChart';
import { useBacktestData } from '@app/_providers/backtest';

export const NewMonteCarlo = () => {
  const { backtests, initialCapital } = useBacktestData();

  const tradesWithProfit = useRef(
    new Map<string, IClosedTradeProfit[]>(backtests.values().next().value[1].tradesWithProfit),
  );
  
  if (backtests.size === 0) throw new Error('Invalid Visit');

  return (
    <MonteCarloChart initialCapital={initialCapital} tradesWithProfit={tradesWithProfit.current} />
  );
};