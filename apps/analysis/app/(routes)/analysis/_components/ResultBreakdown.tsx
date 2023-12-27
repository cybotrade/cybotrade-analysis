import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { isAfter, isBefore, sub, subDays } from 'date-fns';
import Decimal from 'decimal.js';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { calculatePerformance } from '@app/_lib/calculation';

import { IClosedTrade } from '../type';

export const ResultBreakdown = ({ closedTrades }: { closedTrades: IClosedTrade[] }) => {
  const { theme } = useTheme();

  const [selectDay, setSelectDay] = useState('all');

  const performanceAll = useMemo(() => {
    if (!closedTrades) return null;

    const calculatePerformanceForTimeframe = (timeframe: {
      days?: number | undefined;
      months?: number | undefined;
      years?: number | undefined;
    }) => {
      let startDate: Date;
      const endDate = closedTrades[closedTrades.length - 1]?.exitTime;
      if (!endDate) return;

      if (timeframe.days) {
        startDate = sub(endDate, { days: timeframe.days });
      } else if (timeframe.months) {
        startDate = sub(endDate, { months: timeframe.months });
      } else if (timeframe.years) {
        startDate = sub(endDate, { years: timeframe.years });
      } else {
        startDate = new Date(0);
      }
      const filteredClosedTrades = closedTrades.filter(
        (t) => isAfter(new Date(t.exitTime), startDate) && isBefore(new Date(t.exitTime), endDate),
      );

      return calculatePerformance({
        history: {
          closedTrades: filteredClosedTrades,
          openedTrades: [],
        },
        parameters: {
          comission: 0,
          initialCapital: 0,
          riskFreeRate: 0.02,
        },
      });
    };
    return {
      all: calculatePerformanceForTimeframe({}),
      '90D': calculatePerformanceForTimeframe({ days: 90 }),
      '7D': calculatePerformanceForTimeframe({ days: 7 }),
      '1M': calculatePerformanceForTimeframe({ months: 1 }),
      '3M': calculatePerformanceForTimeframe({ months: 3 }),
      '1Y': calculatePerformanceForTimeframe({ years: 1 }),
    };
  }, [closedTrades]);

  const performanceData =
    performanceAll && performanceAll[selectDay as keyof typeof performanceAll];

  return (
    <div>
      <>
        <div className="flex px-[56px] py-[46px]">
          <div className="w-1/3 h-auto  border dark:border-[#575757]  rounded-xl bg-[#FDFDFD] dark:bg-[#473e2d] mr-9 pb-[30px]">
            <div className="w-full text-center border-b-black flex justify-between py-4 px-[18px] font-bold">
              <div className="flex items-center">
                <div className="rounded-full w-3 h-3 bg-[#F9EBD5] mr-2 "></div>
                <div>Overall</div>
              </div>
            </div>
            <div className="border dark:border-[#575757] border-t-0 w-full"></div>
            <div className="w-full  flex flex-wrap px-[18px]">
              <div className="w-full py-2 border border-l-0 border-t-0 border-r-0 dark:border-[#575757]">
                <p className="font-sora">Starting Balance (USDT)</p>
                {performanceData && (
                  <p className="font-bold font-sora text-xl">
                    {performanceData.initialCapital?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full  flex flex-wrap px-[18px]">
              <div className="w-full py-2 border border-l-0 border-r-0 border-t-0 dark:border-[#575757]">
                <p className="font-sora">Final Balance (USDT)</p>
                {performanceData && (
                  <p className="font-bold font-sora text-xl">
                    {performanceData.finalBalance?.toFixed(2, Decimal.ROUND_UP)}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full  flex flex-wrap px-[18px]">
              <div className="w-1/2 py-2 border border-l-0 border-r-0 border-b-0 border-t-0 dark:border-[#575757]">
                <p className="font-sora">Total Profit (USDT)</p>sedrawR
                {performanceData && (
                  <p
                    className={clsx(
                      'font-bold font-sora text-xl',
                      performanceData.netProfit?.greaterThanOrEqualTo(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF6F6F] dark:text-[#FF4646]',
                    )}
                  >
                    {performanceData.netProfit?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-1/3 h-auto  border dark:border-[#575757]  rounded-xl bg-[#FDFDFD] dark:bg-[#473e2d] mr-9 pb-[30px] relative">
            <div className="w-full text-center border-b-black flex justify-between py-4 px-[18px] font-bold">
              <div className="flex items-center">
                <div className="rounded-full w-3 h-3 bg-[#F9EBD5] mr-2 "></div>
                <div>Details</div>
              </div>
            </div>
            <div className="border dark:border-[#575757] border-t-0 w-full"></div>
            <div className="flex h-auto">
              <div className="absolute bottom-0 left-0 w-full">
                {theme === 'light' ? (
                  <Image
                    src="/images/LightModeGraph.png"
                    width={400}
                    height={210}
                    alt="Cybotrade"
                    className="mb-1 mx-auto"
                  />
                ) : (
                  <Image
                    src="/images/DarkModeGraph.png"
                    width={400}
                    height={210}
                    alt="Cybotrade"
                    className="mb-1 mx-auto"
                  />
                )}
              </div>
              <div className="w-full  flex flex-wrap px-[18px]">
                <div className="w-full py-2 ">
                  <div className="mb-5 py-2">
                    <span className="float-left font-sora">Win</span>
                    <span className="float-right font-sora">Lose</span>
                  </div>
                  <div className="w-full bg-gray-300 h-4 rounded-xl ">
                    <div className="h-full rounded-xl bg-gradient-to-r from-[#87BF90] to-[#F2F2F2]"></div>
                  </div>
                  <div className="pt-2">
                    <span className="float-left text-[#009C3E] dark:text-[#00FC65] font-bold font-sora text-xl">
                      {performanceData && performanceData.totalWinningTrades}
                    </span>

                    <span className="float-right text-[#FF4646] dark:text-[#FF6F6F] font-bold font-sora text-xl">
                      {performanceData && performanceData.totalLosingTrades}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full  flex flex-wrap px-[18px]">
              <div className="w-1/2 py-2 border border-l-0 border-r-0 dark:border-[#575757]">
                <p className="font-sora">Total Trades</p>
                {performanceData && (
                  <p className="font-sora text-xl font-bold">{performanceData.totalTrades}</p>
                )}
              </div>
              <div className="w-1/2 px-4 py-2 border border-r-0 border-l-0 dark:border-[#575757]">
                <div className="float-right">
                  <p className="font-sora flex justify-end text-right">Profit Factor</p>

                  {performanceData && (
                    <p className="flex justify-end font-sora text-xl font-bold text-right">
                      {performanceData.profitFactor?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-wrap px-[18px]">
              <div className="w-full py-2 border  border-l-0 border-t-0 border-r-0 border-b-0 dark:border-[#575757]">
                <p className="font-sora">Average Trades per day</p>
                {performanceData && (
                  <p className="font-sora text-xl font-bold">
                    {performanceData.averageTotalTradesPerDay?.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="w-1/3 h-auto flex flex-wrap justify-center border  dark:border-[#575757] rounded-xl bg-[#FDFDFD] dark:bg-[#473e2d] pb-[30px] relative">
            <div className="w-full text-center flex justify-between py-4 px-4 font-bold">
              <div className="flex items-center ">
                <span className="flex items-center ">
                  <div className="rounded-full w-3 h-3 bg-[#F9EBD5] mr-2 mb-1"></div>
                  Performance
                </span>
              </div>

              <div className="flex items-center">
                <Tabs defaultValue="7D" className="ml-6">
                  <TabsList>
                    <TabsTrigger
                      value="7D"
                      className={`mx-1 ${selectDay === '7D' ? 'text-primary' : ''}`}
                      onClick={() => setSelectDay('7D')}
                    >
                      7D
                    </TabsTrigger>
                    <TabsTrigger
                      value="1M"
                      className={`mx-1 ${selectDay === '1M' ? 'text-primary' : ''}`}
                      onClick={() => setSelectDay('1M')}
                    >
                      1M
                    </TabsTrigger>
                    <TabsTrigger
                      value="3M"
                      className={`mx-1 ${selectDay === '3M' ? 'text-primary' : ''}`}
                      onClick={() => setSelectDay('3M')}
                    >
                      3M
                    </TabsTrigger>
                    <TabsTrigger
                      value="1Y"
                      className={`mx-1 ${selectDay === '1Y' ? 'text-primary' : ''}`}
                      onClick={() => setSelectDay('1Y')}
                    >
                      1Y
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="w-full border dark:border-[#575757] border-t-0"></div>
            <div className="w-full flex flex-wrap mx-[18px]">
              <div className="absolute bottom-0 left-0 w-full">
                {theme === 'light' ? (
                  <Image
                    src="/images/LightModeGraph.png"
                    width={400}
                    height={210}
                    alt="Cybotrade"
                    className="mb-1 mx-auto"
                  />
                ) : (
                  <Image
                    src="/images/DarkModeGraph.png"
                    width={400}
                    height={210}
                    alt="Cybotrade"
                    className="mb-1 mx-auto"
                  />
                )}
              </div>
              <div className="w-1/2 py-2 border border-l-0 border-t-0 dark:border-[#575757]">
                <p>ROI</p>
                {performanceData && (
                  <p
                    className={clsx(
                      'font-bold font-sora text-xl',
                      performanceData.roi?.greaterThan(0)
                        ? 'text-[#009C3E] dark:text-[#00FC65]'
                        : 'text-[#FF6F6F] dark:text-[#FF4646]',
                    )}
                  >
                    {performanceData.roi?.mul(100).toFixed(2, Decimal.ROUND_UP)}%
                  </p>
                )}
              </div>

              <div className="w-1/2  py-2 border  border-r-0 border-l-0 border-t-0 dark:border-[#575757]">
                <div className="float-right">
                  <p className="font-sora ">Win Rate</p>
                  {performanceData && (
                    <p className="font-bold font-sora text-xl">
                      {Decimal.abs(performanceData.winRate ?? 0)
                        .mul(100)
                        .toFixed(2)}
                      %
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* 4th Row */}
            <div className="w-full flex flex-wrap mx-[18px]">
              <div className="w-1/2 py-2  border border-l-0 border-b-0 border-t-0 dark:border-[#575757]">
                <p className="font-sora">Max. Drawdown</p>

                {performanceData && (
                  <p className="font-bold font-sora text-xl">
                    {Decimal.abs(performanceData.maxDrawdown?.percentage.mul(100) ?? 0).toFixed(2)}%
                  </p>
                )}
              </div>
              <div className="w-1/2 py-2  ">
                <div className="float-right">
                  <p className="font-sora text-right">Avg, PnL per Trade</p>
                  {performanceData && (
                    <p
                      className={
                        performanceData.averagePnl?.greaterThanOrEqualTo(0)
                          ? 'text-[#009C3E] dark:text-[#00FC65] float-right font-bold  font-sora text-xl'
                          : 'text-[#FF6F6F] dark:text-[#FF4646] float-right font-bold font-sora text-xl'
                      }
                    >
                      {performanceData.averagePnl?.greaterThanOrEqualTo(0) ? '+' : '-'}
                      {Decimal.abs(performanceData.averagePnl ?? 0)?.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};
