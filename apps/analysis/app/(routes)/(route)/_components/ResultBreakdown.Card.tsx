import { useTheme } from 'next-themes';
import Image from 'next/image';
import React from 'react';

import { cn } from '@app/_lib/utils';

const ResultBreakdownCard = () => {
  const { theme } = useTheme();

  return (
    <div className="border border-[#DFDFDF] group hover:border-primary rounded-md relative p-3 flex-1 duration-300">
      <div className="inline-flex w-full items-center font-sans font-medium">
        <div className="rounded-full w-4 h-4 bg-[#F9EBD5] mr-2 "></div>
        <span>name</span>
      </div>
      <div className="border border-t-0 border-[#DFDFDF] my-2"></div>
      <div className="flex flex-col items-center gap-5">
        <div className="text-center">
          <div className="font-normal">Total Return on Account $</div>
          <div className="group-hover:text-primary text-[#D3AA85] text-lg font-extrabold">
            {/* {performanceData &&
            (performanceData.netProfit.greaterThanOrEqualTo(0)
              ? `+USDT ${performanceData.netProfit.toFixed(2)}`
              : `-USDT ${performanceData.netProfit.abs().toFixed(2)}`)} */}
            +USDT 'profit'
          </div>
        </div>
        <div className="p-4 relative min-w-full flex justify-center ">
          <div
            className={cn(
              'flex items-center justify-center rounded-full w-[10rem] h-[10rem] pb-4',
              'border group-hover:border-primary border-gray-300 ring-1 ring-offset-[14px] group-hover:ring-primary ring-gray-300',
              'bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A]',
            )}
          >
            <h2 className="group-hover:text-primary text-[#D3AA85] text-4xl font-extrabold">00%</h2>
          </div>
          <div className="absolute bottom-0 border-t group-hover:border-t-primary border-t-[#D3AA85] min-w-full bg-white pt-4 px-2">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal capitalize">Starting Balance</h6>
                <h6 className="text-lg font-extrabold">USDT 0</h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Final Balance</h6>
                <h6 className="text-lg font-extrabold">USDT 0</h6>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-full flex flex-wrap px-2 border border-[#DFDFDF] bg-gradient-to-b from-[#FFEFDC] to-white rounded-md">
          <div className="flex flex-col gap-3 w-full px-5 z-10">
            <div>
              <div className="mb-5 py-2 capitalize">
                <h6 className="float-left font-normal">Win</h6>
                <span className="float-right font-normal">Lose</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gradient-to-r from-[#87BF90] to-[#F2F2F2]" />
              <div className="pt-2">
                <span className="float-left text-[#009C3E] dark:text-[#00FC65] font-bold font-sora text-xl">
                  {/* {performanceData && performanceData.totalWinningTrades} */}0
                </span>

                <span className="float-right text-[#FF4646] dark:text-[#FF6F6F] font-bold font-sora text-xl">
                  {/* {performanceData && performanceData.totalLosingTrades} */}0
                </span>
              </div>
            </div>
            <div className="border border-t-0 border-[#DFDFDF]"></div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal capitalize">Total Trades</h6>
                <h6 className="text-lg font-extrabold">
                  {/* {performanceData && performanceData.totalTrades}0 */}0
                </h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Profit-to-Loss</h6>
                <h6 className="text-lg font-extrabold">
                  {/* {performanceData &&
                      performanceData.totalProfit
                        .div(performanceData.totalLoss.abs())
                        .toNumber()
                        .toFixed(2)}{' '}
                    : 1 */}
                  0
                </h6>
              </div>
            </div>
            <div className="border border-t-0 border-[#DFDFDF]"></div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal capitalize">Trading Frequency</h6>
                <h6 className="text-lg font-extrabold">
                  {/* {performanceData && performanceData.tradingFrequency.toFixed(2)}% */}0
                </h6>
              </div>
            </div>
            <div className="border border-t-0 border-[#DFDFDF]"></div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal capitalize">Sharpe Ratio</h6>
                <h6 className="text-lg font-extrabold">
                  {/* {performanceData && performanceData.sharpeRatio.total.toFixed(2)}% */}0
                </h6>
              </div>
            </div>
            <div className="border border-t-0 border-[#DFDFDF]"></div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h6 className="text-sm font-normal capitalize">Win Rate</h6>
                <h6
                  className={cn(
                    'text-lg font-extrabold',
                    // performanceData && performanceData.winRate.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.winRate.greaterThanOrEqualTo(0) ? '+' : '-'}
                  {performanceData &&
                    Decimal.abs(performanceData.winRate ?? 0)
                      .mul(100)
                      .toFixed(2)} */}
                  0 %
                </h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Profit Factor</h6>
                <h6
                  className={cn(
                    'text-lg font-extrabold',
                    // performanceData && performanceData.profitFactor.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.profitFactor.greaterThanOrEqualTo(0)
                    ? '+'
                    : '-'}
                  {performanceData && performanceData.profitFactor.abs().toFixed(2)}% */}
                  0
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
                    // performanceData && performanceData.largestRoi.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.largestRoi.greaterThanOrEqualTo(0)
                    ? '+'
                    : '-'}
                  {performanceData && performanceData.largestRoi.abs().mul(100).toFixed(2)}% */}
                  0
                </h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Smallest ROI</h6>
                <h6
                  className={cn(
                    'text-lg font-extrabold',
                    // performanceData && performanceData.smallestRoi.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.smallestRoi.greaterThanOrEqualTo(0)
                    ? '+'
                    : '-'}
                  {performanceData && performanceData.smallestRoi.abs().mul(100).toFixed(2)}% */}
                  0
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
                    // performanceData && performanceData.bestTradePnl.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.bestTradePnl.greaterThanOrEqualTo(0)
                    ? '+'
                    : '-'}
                  {performanceData && performanceData.bestTradePnl.abs().toFixed(2)} */}
                  0
                </h6>
              </div>
              <div className="text-right">
                <h6 className="text-sm font-normal">Worst Trade</h6>
                <h6
                  className={cn(
                    'text-lg font-extrabold',
                    // performanceData && performanceData.worstTradePnl.greaterThanOrEqualTo(0)
                    1 === 1
                      ? 'text-[#009C3E] dark:text-[#00FC65]'
                      : 'text-[#FF4646] dark:text-[#FF6F6F]',
                  )}
                >
                  {/* {performanceData && performanceData.worstTradePnl.greaterThanOrEqualTo(0)
                    ? '+'
                    : '-'}
                  {performanceData && performanceData.worstTradePnl.abs().toFixed(2)} */}
                  0
                </h6>
              </div>
            </div>
          </div>
          {/* IMAGES */}
          <div className="absolute bottom-0 left-0 min-w-full min-h-[250px] z-0">
            {theme === 'light' ? (
              <Image
                src="/images/LightModeGraph.png"
                alt="Cybotrade"
                fill
                className="object-fill"
              />
            ) : (
              <Image src="/images/DarkModeGraph.png" alt="Cybotrade" fill className="object-fill" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultBreakdownCard;
