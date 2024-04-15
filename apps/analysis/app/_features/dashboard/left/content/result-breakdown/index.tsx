'use client';

import { Decimal } from 'decimal.js';
import Image from 'next/image';
import React, { Fragment } from 'react';

import { Stat } from '@app/_components/shared/Stat';
import {
  BalanceChartWidget,
  DetailsWidget,
  ProfitToLossWidget,
  TotalReturnGridWidget,
  TotalTradesWidget,
  TradingFrequencyWidget,
  WinLoseWidget,
} from '@app/_components/widgets';
import DashboardContentWrapper from '@app/_features/dashboard/DashboardContentWrapper';
import { PerformanceData } from '@app/_lib/calculation';

type TResultBreakdownProps = {
  performance: PerformanceData;
};

export const ResultBreakdown = ({ performance }: TResultBreakdownProps) => {
  const netProfit = new Decimal(performance.netProfit);
  const initialCapital = new Decimal(performance.initialCapital);
  const finalBalance = new Decimal(performance.finalBalance);
  const totalWinningTrades = parseFloat(String(performance.totalWinningTrades));
  const totalLosingTrades = parseFloat(String(performance.totalLosingTrades));
  const totalTrades = parseFloat(String(performance.totalTrades));
  const profitFactor = new Decimal(performance.profitFactor);
  const winRate = new Decimal(performance.winRate);
  const largestRoi = new Decimal(performance.largestRoi);
  const smallestRoi = new Decimal(performance.smallestRoi);
  const bestTrade = new Decimal(performance.bestTradePnl);
  const worstTrade = new Decimal(performance.worstTradePnl);

  return (
    <Fragment>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#F1F1F1]">
        <Image
          className="w-full h-full object-cover"
          src="/images/particles_bg.png"
          alt="background"
          fill
          fetchPriority="high"
        />
      </div>
      <DashboardContentWrapper className="relative h-[90%] my-5">
        <div className="absolute w-full h-full font-sora grid auto-rows-[auto_1fr] gap-10">
          <Stat
            containerClassName="gap-2"
            label="Overall increment :"
            labelClassName="text-md"
            content={`${netProfit
              .toDecimalPlaces(2)
              .div(initialCapital.toNumber() > 0 ? initialCapital.toDecimalPlaces(2) : 1)
              .mul(100)
              .toDecimalPlaces(2)
              .toNumber()}
              %`}
            contentClassName="text-primary text-8xl font-bold"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="grid auto-rows-[60%_1fr] gap-3">
              <BalanceChartWidget
                startingBalance={`USDT ${initialCapital.toFixed(2)}`}
                finalBalance={`USDT ${finalBalance.toFixed(2)}`}
              />
              <div className="grid grid-cols-2 gap-3">
                <WinLoseWidget
                  totalWinningTrades={totalWinningTrades}
                  totalLosingTrades={totalLosingTrades}
                />
                <TotalReturnGridWidget
                  totalReturn={
                    netProfit.greaterThanOrEqualTo(0)
                      ? `+USDT ${netProfit.toFixed(2)}`
                      : `-USDT ${netProfit.abs().toFixed(2)}`
                  }
                />
              </div>
            </div>
            <div className="grid auto-rows-[50%_1fr] gap-3">
              <div className="grid grid-cols-3 gap-3">
                <TotalTradesWidget totalTrades={totalTrades} />
                <ProfitToLossWidget profitFactor={profitFactor.toDecimalPlaces(2).toNumber()} />
                <TradingFrequencyWidget />
              </div>
              <DetailsWidget
                details={{ winRate, profitFactor, largestRoi, smallestRoi, bestTrade, worstTrade }}
              />
            </div>
          </div>
        </div>
      </DashboardContentWrapper>
    </Fragment>
  );
};
