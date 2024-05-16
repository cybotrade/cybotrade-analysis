'use client';

import React, { useRef } from 'react';

import { IClosedTradeProfit } from '@app/(routes)/(route)/type';
import { MonteCarloChart } from '@app/_features/dashboard/left/content/monte-carlo/MonteCarloChart';
import { useBacktestData } from '@app/_providers/backtest';

export const NewMonteCarlo = () => {
  const { selectedBacktest, initialCapital } = useBacktestData();

  const tradesWithProfit = selectedBacktest.data.values().next().value.tradesWithProfit;
  if (!tradesWithProfit) throw new Error('Invalid Visit');

  return (
    <MonteCarloChart
      key={selectedBacktest.id}
      initialCapital={initialCapital}
      tradesWithProfit={tradesWithProfit}
    />
  );
};
