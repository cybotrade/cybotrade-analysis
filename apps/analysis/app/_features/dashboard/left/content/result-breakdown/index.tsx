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
  let netProfit = new Decimal(performance.netProfit);
  let initialCapital = new Decimal(performance.initialCapital);
  let finalBalance = new Decimal(performance.finalBalance);
  let totalWinningTrades = parseFloat(String(performance.totalWinningTrades));
  let totalLosingTrades = parseFloat(String(performance.totalLosingTrades));
  let totalTrades = parseFloat(String(performance.totalTrades));
  let profitFactor = new Decimal(performance.profitFactor);
  let winRate = new Decimal(performance.winRate);
  let largestRoi = new Decimal(performance.largestRoi);
  let smallestRoi = new Decimal(performance.smallestRoi);
  let bestTrade = new Decimal(performance.bestTradePnl);
  let worstTrade = new Decimal(performance.worstTradePnl);
  let averageTradesPerDay = new Decimal(performance.averageTradesPerDay);
  let totalTradesDays = parseFloat(String(performance.totalTradesDays));
  let ariCumulativeUnrealizedPnlInfo = performance.ariCumulativeUnrealizedPnlInfo;
  let geoCumulativeUnrealizedPnlInfo = performance.geoCumulativeUnrealizedPnlInfo;

  return (
    <Fragment>
      <div className="pointer-events-none absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#F1F1F1]">
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
                ariCumulativeUnrealizedPnlInfo={ariCumulativeUnrealizedPnlInfo}
                geoCumulativeUnrealizedPnlInfo={geoCumulativeUnrealizedPnlInfo}
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
                <TotalTradesWidget totalTrades={totalTrades} totalTradesDays={totalTradesDays} />
                <ProfitToLossWidget profitFactor={profitFactor.toDecimalPlaces(2).toNumber()} />
                <TradingFrequencyWidget
                  averageTradesPerDay={averageTradesPerDay.toDecimalPlaces(2).toNumber()}
                />
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
