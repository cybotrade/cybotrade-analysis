'use client';

import React, { useRef } from 'react';

import { IClosedTradeProfit } from '@app/(routes)/(route)/type';
import { MonteCarloChart } from '@app/_features/dashboard/left/content/monte-carlo/MonteCarloChart';
import { useBacktestData } from '@app/_providers/backtest';

export const NewMonteCarlo = () => {
  const { backtests, initialCapital, selectedPermutationId } = useBacktestData();

  const tradesWithProfit = new Map<string, IClosedTradeProfit[]>(
    backtests.get(selectedPermutationId)?.tradesWithProfit,
  );

  if (backtests.size === 0) throw new Error('Invalid Visit');

  return (
    <MonteCarloChart
      key={selectedPermutationId}
      initialCapital={initialCapital}
      tradesWithProfit={tradesWithProfit}
    />
  );
};
