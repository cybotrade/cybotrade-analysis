import { Kline } from 'binance';
import Decimal from 'decimal.js';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { Interval } from '@app/_lib/utils';

import { calculatePerformance } from '@app/_lib/calculation';
import { cn } from '@app/_lib/utils';

import { IClosedTrade, ITrade } from '../type';

export const ResultBreakdown = ({
  klineData,
  trades,
  interval,
  closedTrades,
  initialCapital = 10000,
  fees,
}: {
  klineData: Kline[];
  trades: ITrade[];
  interval: Interval;
  closedTrades: IClosedTrade[];
  initialCapital?: number;
  fees: number;
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const performanceAll = useMemo(() => {
    if (!closedTrades) return null;

    const calculatePerformanceForTimeframe = (timeframe: {
      days?: number | undefined;
      months?: number | undefined;
      years?: number | undefined;
    }) => {
      // let startDate: Date;
      // const endDate = new Date(+closedTrades[closedTrades.length - 1]?.exitTime);
      // if (!endDate) return;

      // if (timeframe.days) {
      //   startDate = sub(endDate, { days: timeframe.days });
      // } else if (timeframe.months) {
      //   startDate = sub(endDate, { months: timeframe.months });
      // } else if (timeframe.years) {
      //   startDate = sub(endDate, { years: timeframe.years });
      // } else {
      //   startDate = new Date(0);
      // }
      // const filteredClosedTrades = closedTrades.filter(
      //   (t) =>
      //     isAfter(new Date(+t.exitTime), startDate) && isBefore(new Date(+t.exitTime), endDate),
      // );
      return calculatePerformance({
        history: {
          // closedTrades: filteredClosedTrades,
          closedTrades,
          openedTrades: [],
        },
        tradeOrders: { klineData, trades, interval },
        parameters: {
          comission: 0,
          initialCapital,
          riskFreeRate: 0.02,
          fees,
        },
      });
    };
    return {
      all: calculatePerformanceForTimeframe({}),
      // '90D': calculatePerformanceForTimeframe({ days: 90 }),
      // '7D': calculatePerformanceForTimeframe({ days: 7 }),
      // '1M': calculatePerformanceForTimeframe({ months: 1 }),
      // '3M': calculatePerformanceForTimeframe({ months: 3 }),
      // '1Y': calculatePerformanceForTimeframe({ years: 1 }),
    };
  }, [closedTrades]);

  const performanceData =
    performanceAll && performanceAll[selectedPeriod as keyof typeof performanceAll];

  return (
    <div className="px-[56px] py-[46px]">
      <div className="grid grid-cols-3 border border-[#DFDFDF] rounded-md relative px-3">
        {/* OVERALL */}
        <div className="z-10 flex flex-col w-full py-4">
          <div className="px-2">
            <h6 className="inline-flex w-full items-center font-sans font-medium">
              <div className="rounded-full w-4 h-4 bg-[#F9EBD5] mr-2 "></div>
              <span>Overall</span>
            </h6>
            <div className="border border-t-0 border-[#DFDFDF] my-2"></div>
          </div>

          <div className="flex flex-col items-center gap-5 px-8 my-4 font-sora">
            <div className="text-center">
              <h6 className="font-normal">Total Return on Account $</h6>
              <h6 className="text-primary text-lg font-extrabold">
                {performanceData &&
                  (performanceData.netProfit.greaterThanOrEqualTo(0)
                    ? `+USDT ${performanceData.netProfit.toFixed(2)}`
                    : `-USDT ${performanceData.netProfit.abs().toFixed(2)}`)}
              </h6>
            </div>
            <div className="p-4">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full w-[10rem] h-[10rem]',
                  'border border-primary ring-1 ring-offset-[14px] ring-primary',
                  'bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A]',
                )}
              >
                <h2 className="text-primary text-4xl font-extrabold">
                  {performanceData &&
                    performanceData.netProfit
                      .toDecimalPlaces(2)
                      .div(
                        performanceData?.initialCapital.toNumber() > 0
                          ? performanceData?.initialCapital.toDecimalPlaces(2)
                          : 1,
                      )
                      .mul(100)
                      .toDecimalPlaces(2)
                      .toNumber()}
                  %
                </h2>
              </div>
            </div>

            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal">Starting Balance</h6>
                <h6 className="text-lg font-extrabold">
                  USDT {performanceData && performanceData.initialCapital.toFixed(2)}
                </h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Final Balance</h6>
                <h6 className="text-lg font-extrabold">
                  USDT {performanceData && performanceData.finalBalance.toFixed(2)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        {/* DETAILS */}
        <div className="z-10 flex flex-col w-full h-full py-4">
          <div className="px-2">
            <h6 className="inline-flex w-full  items-center font-sans font-medium">
              <div className="rounded-full w-4 h-4 bg-[#F9EBD5] mr-2 "></div>
              <span>Details</span>
            </h6>
            <div className="border border-t-0 border-[#DFDFDF] my-2"></div>
          </div>

          <div className="w-full h-full flex flex-wrap px-2 border-x border-x-[#DFDFDF] font-sora">
            <div className="flex flex-col gap-3 w-full px-5">
              <div>
                <div className="mb-5 py-2 capitalize">
                  <h6 className="float-left font-normal">Win</h6>
                  <span className="float-right font-normal">Lose</span>
                </div>
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#87BF90] to-[#F2F2F2]" />
                <div className="pt-2">
                  <span className="float-left text-[#009C3E] dark:text-[#00FC65] font-bold font-sora text-xl">
                    {performanceData && performanceData.totalWinningTrades}
                  </span>

                  <span className="float-right text-[#FF4646] dark:text-[#FF6F6F] font-bold font-sora text-xl">
                    {performanceData && performanceData.totalLosingTrades}
                  </span>
                </div>
              </div>
              <div className="border border-t-0 border-[#DFDFDF]"></div>
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h6 className="text-sm font-normal capitalize">Total Trades</h6>
                  <h6 className="text-lg font-extrabold">
                    {performanceData && performanceData.totalTrades}
                  </h6>
                </div>
                <div className="text-right">
                  <h6 className="text-sm font-normal">Profit-to-Loss</h6>
                  <h6 className="text-lg font-extrabold">
                    {performanceData &&
                      performanceData.totalProfit
                        .div(performanceData.totalLoss.abs())
                        .toNumber()
                        .toFixed(2)}{' '}
                    : 1
                  </h6>
                </div>
              </div>
              <div className="border border-t-0 border-[#DFDFDF]"></div>
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h6 className="text-sm font-normal capitalize">Sharpe Ratio</h6>
                  <h6 className="text-lg font-extrabold">
                    {performanceData && performanceData.sharpeRatio.toFixed(2)}
                  </h6>
                </div>
                <div className="text-right">
                  <h6 className="text-sm font-normal capitalize">Calmar Ratio</h6>
                  <h6 className="text-lg font-extrabold">
                    {performanceData && performanceData.calmarRatio.toFixed(2)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* PERFORMANCE */}
        <div className="z-10 flex flex-col w-full py-4">
          <div className="px-2">
            <h6 className="inline-flex w-full  items-center font-sans font-medium">
              <div className="rounded-full w-4 h-4 bg-[#F9EBD5] mr-2 "></div>
              <span>Performance</span>
            </h6>
            <div className="border border-t-0 border-[#DFDFDF] my-2"></div>
          </div>

          <div className="w-full h-full flex flex-wrap px-2 font-sora">
            <div className="flex flex-col gap-3 w-full px-5">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h6 className="text-sm font-normal capitalize">Win Rate</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.winRate.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.winRate.greaterThanOrEqualTo(0) ? '+' : '-'}
                    {performanceData &&
                      Decimal.abs(performanceData.winRate ?? 0)
                        .mul(100)
                        .toFixed(2)}
                    %
                  </h6>
                </div>
                <div className="text-right">
                  <h6 className="text-sm font-normal">Profit Factor</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.profitFactor.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.profitFactor.greaterThanOrEqualTo(0)
                      ? '+'
                      : '-'}
                    {performanceData && performanceData.profitFactor.abs().toFixed(2)}%
                  </h6>
                </div>
              </div>
              <div className="border border-t-0 border-[#DFDFDF]"></div>
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h6 className="text-sm font-normal capitalize">Largest ROI</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.largestRoi.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.largestRoi.greaterThanOrEqualTo(0)
                      ? '+'
                      : '-'}
                    {performanceData && performanceData.largestRoi.abs().mul(100).toFixed(2)}%
                  </h6>
                </div>
                <div className="text-right">
                  <h6 className="text-sm font-normal">Smallest ROI</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.smallestRoi.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.smallestRoi.greaterThanOrEqualTo(0)
                      ? '+'
                      : '-'}
                    {performanceData && performanceData.smallestRoi.abs().mul(100).toFixed(2)}%
                  </h6>
                </div>
              </div>
              <div className="border border-t-0 border-[#DFDFDF]"></div>
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h6 className="text-sm font-normal capitalize">Best Trade</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.bestTradePnl.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.bestTradePnl.greaterThanOrEqualTo(0)
                      ? '+'
                      : '-'}
                    {performanceData && performanceData.bestTradePnl.abs().toFixed(2)}
                  </h6>
                </div>
                <div className="text-right">
                  <h6 className="text-sm font-normal">Worst Trade</h6>
                  <h6
                    className={cn(
                      'text-lg font-extrabold',
                      performanceData && performanceData.worstTradePnl.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF4646] dark:text-[#FF6F6F]',
                    )}
                  >
                    {performanceData && performanceData.worstTradePnl.greaterThanOrEqualTo(0)
                      ? '+'
                      : '-'}
                    {performanceData && performanceData.worstTradePnl.abs().toFixed(2)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* IMAGES */}
        <div className="absolute bottom-0 right-0  min-w-[50rem] h-full max-h-[20rem]">
          {theme === 'light' ? (
            <Image src="/images/LightModeGraph.png" alt="Cybotrade" fill className="object-fill" />
          ) : (
            <Image src="/images/DarkModeGraph.png" alt="Cybotrade" fill className="object-fill" />
          )}
        </div>
      </div>
    </div>
  );
};
