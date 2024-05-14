'use client';

import React, { useRef } from 'react';

import { IClosedTradeProfit } from '@app/(routes)/(route)/type';
import { MonteCarloChart } from '@app/_features/dashboard/left/content/monte-carlo/MonteCarloChart';
import { useBacktestData } from '@app/_providers/backtest';

export const NewMonteCarlo = () => {
  const { permutationId, backtests, initialCapital } = useBacktestData();

  const tradesWithProfit = backtests.values().next().value.tradesWithProfit;
  console.log(tradesWithProfit);
  if (backtests.size === 0) throw new Error('Invalid Visit');

  return (
    <MonteCarloChart
      key={permutationId}
      initialCapital={initialCapital}
      tradesWithProfit={tradesWithProfit}
    />
  );
};
