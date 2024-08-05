import { type Kline } from 'binance';
import { Decimal } from 'decimal.js';
import { UTCTimestamp } from 'lightweight-charts';

import { IEquityData } from '@app/(routes)/(route)/_components/EquityCurve';
import { IClosedTrade, ITrade } from '@app/(routes)/(route)/type';
import { Interval, OrderSide, addIntervalTime, intervalForDays } from '@app/_lib/utils';

import { intervalToDays } from './utils';

export type PerformanceData = {
  finalBalance: Decimal;
  initialCapital: Decimal;
  totalTrades: number;
  totalLosingTrades: number;
  totalWinningTrades: number;
  bestTradePnl: Decimal;
  worstTradePnl: Decimal;
  averagePnl: Decimal;
  highestWinningStreak: number;
  highestLosingStreak: number;

  winRate: Decimal;
  netProfit: Decimal;
  profitFactor: Decimal;
  totalProfit: Decimal;
  totalLoss: Decimal;
  averageProfit: Decimal;
  averageLoss: Decimal;
  maxDrawdown: Decimal;

  // Duration in seconds
  averageTradeDuration: Decimal;

  sharpeRatio: Decimal;
  calmarRatio: Decimal;

  roi: Decimal;
  largestRoi: Decimal;
  smallestRoi: Decimal;

  averageTradesPerDay: number;
  annualizedReturn: Decimal;
  equityData: IEquityData[];
  intervalPriceChanges: Decimal[];
};

/**
 * Inverse the order side. Eg. Buy -> Sell, Sell -> Buy.
 *
 * @param side The order side.
 * @returns The inverse order side.
 * @example
 *  inverseOrderSide(OrderSide.Buy); // OrderSide.Sell
 *  inverseOrderSide(OrderSide.Sell); // OrderSide.Buy
 */
export const inverseOrderSide = (side: OrderSide): OrderSide =>
  side === OrderSide.Buy ? OrderSide.Sell : OrderSide.Buy;

/**
 * Count the number of consecutive values that satisfy a predicate.
 *
 * @param values The values to count.
 * @param predicate The predicate to satisfy.
 * @returns The number of consecutive values that satisfy the predicate.
 * @example
 *   streak([1, 2, 3, 4, 5, 6, 7, 8, 9], (x) => x % 2 === 0); // 1
 *   streak([2, 2, 3, 4, 5, 6, 7, 8, 9], (x) => x % 2 === 0); // 2
 */
export const streak = <T>(values: T[], predicate: (value: T) => boolean): number => {
  let [streak, count] = [0, 0];

  for (const value of values)
    if (predicate(value)) count += 1;
    else {
      if (count > streak) streak = count;
      count = 0;
    }

  return streak;
};

/**
 * Calculate the profit and loss of a trade.
 *
 * @param entryPrice The entry price of the trade.
 * @param entryQuantity The entry quantity of the trade.
 * @param exitPrice The exit price of the trade.
 * @param exitQuantity The exit quantity of the trade.
 * @param comission The comission of the trade.
 * @param orderSide The order side of the trade.
 * @returns The profit and loss of the trade.
 * @example
 *   pnl({
 *     entryPrice: 100,
 *     entryQuantity: 10,
 *     exitPrice: 110,
 *     exitQuantity: 10,
 *     comission: 0.01,
 *     orderSide: OrderSide.Buy,
 *   }); // 89
 */
export const pnl = ({
  entryPrice,
  entryQuantity,
  exitPrice,
  exitQuantity,
  comission,
  orderSide,
}: {
  entryPrice: Decimal;
  entryQuantity: Decimal;
  exitPrice: Decimal;
  exitQuantity: Decimal;
  comission: Decimal;
  orderSide: OrderSide;
}): Decimal => {
  switch (orderSide) {
    case OrderSide.Buy:
      // exitPrice * exitQuantity * (1 - comission) - entryPrice * entryQuantity
      return new Decimal(entryPrice)
        .mul(exitQuantity)
        .mul(new Decimal(1).sub(comission))
        .sub(exitPrice.mul(exitQuantity));
    case OrderSide.Sell:
      // entryPrice * entryQuantity * (1 - comission) - exitPrice * exitQuantity

      return new Decimal(exitPrice)
        .mul(exitQuantity)
        .mul(new Decimal(1).sub(comission))
        .sub(entryPrice.mul(exitQuantity));
    default:
      return new Decimal(0);
  }
};

/**
 * Calculate the mean given a series of numbers.
 *
 * @param values The series of numbers.
 * @returns The mean of the series of numbers.
 */
export const mean = ({ values }: { values: Decimal[] }): Decimal =>
  values.length == 0 ? new Decimal(0) : Decimal.sum(...values).div(values.length);

/**
 * Calculate the standard deviation given a series of numbers. By default, the sample standard deviation is used.
 *
 * @param values The series of numbers.
 * @param usePopulation Whether to use the population standard deviation or the sample standard deviation.
 * @returns The standard deviation of the series of numbers.
 */
export const standardDeviation = ({
  values,
  usePopulation = false,
}: {
  values: Decimal[];
  usePopulation?: boolean;
}): Decimal => {
  const _mean = mean({ values });
  return Decimal.sqrt(
    values
      .reduce((acc, val) => acc.concat(val.sub(_mean).pow(2)), [] as Decimal[])
      .reduce((acc, val) => acc.add(val), new Decimal(0))
      .div(values.length - (usePopulation ? 0 : 1)),
  );
};

/**
 * Calculate the percentage change between two numbers.
 * See https://www.investopedia.com/terms/p/percentage-change.asp for more information.
 *
 * Formula: (y - x) / x
 *
 * @param x The first number.
 * @param y The second number.
 * @returns The percentage change between the two numbers.
 */
export const percentageChange = ({ x, y }: { x: Decimal; y: Decimal }): Decimal =>
  new Decimal(y).sub(x).div(x);

/**
 * Calculate the returns given a series of numbers. Note that the result will always have one element lesser
 * than the original values.
 * See https://www.investopedia.com/terms/r/return.asp for more information.
 *
 * @param values The series of numbers.
 * @returns The returns of the series of numbers.
 */
export const returns = ({ values }: { values: Decimal[] }): Decimal[] =>
  values
    .map((_, i, values) =>
      i === 0 ? null : percentageChange({ x: values[i - 1] as Decimal, y: values[i] as Decimal }),
    )
    .filter((val) => val !== null) as Decimal[];

// Calculate all the required performance data
export const calculatePerformance = ({
  parameters: { initialCapital, comission, riskFreeRate, globalFees = 0 },
  tradeOrders,
}: {
  parameters: {
    initialCapital: number;
    comission: number;
    riskFreeRate: number;
    globalFees?: number;
  };
  tradeOrders?: { klineData: Kline[]; trades: ITrade[]; interval: Interval };
}): PerformanceData => {
  let zero = new Decimal(0);
  let interval = tradeOrders?.interval ?? Interval.OneDay;
  let intervalPriceChanges: Decimal[] = [];
  let klineData = tradeOrders?.klineData;
  let equityData: { value: number; time: UTCTimestamp }[] = [];
  let sumOfAriUnrealizedPnlInfo: Decimal = zero;
  let latestCumuUnrealizedPnl = zero;
  let globalEntryPrice: Decimal = zero;
  let globalSide: OrderSide | null = null;
  let position: Decimal = zero;
  let pnlLength = 0;
  let finalPnl = zero;
  let prevAriPosition: Decimal = zero;
  let initialCapitalDec = new Decimal(initialCapital);
  let totalTrades = tradeOrders!.trades.length;
  let firstTradeTime = +tradeOrders!.trades[0].time;
  let lastTradeTime = +tradeOrders!.trades[totalTrades - 1].time;

  // Drawdowns
  let maxDrawdown = zero;
  let maxFromStart = zero;

  // Pnls
  let bestTradePnl = zero;
  let worstTradePnl = zero;
  let totalWinningTrades = 0;
  let totalLosingTrades = 0;
  let totalProfit = zero;
  let totalLoss = zero;
  let sumOfPnl = zero;

  let [winStreak, winCount] = [0, 0];
  let [loseStreak, loseCount] = [0, 0];

  let lastProcessedIndex = 0;

  let stdDevM2 = zero;
  let stdDevMean = zero;
  let feeDec = new Decimal(globalFees / 100);
  let feeMultiplierBuy = new Decimal(1).add(feeDec);
  let feeMultiplierSell = new Decimal(1).sub(feeDec);

  klineData?.map((kline, index, klineArr) => {
    let candleClosePrice = new Decimal(kline[4]);
    const candleOpenTime = kline[0];
    const candleCloseTime = kline[6];

    const tradeOnCandle = [];

    // Iterate from last processed index to avoid reprocessing trades
    for (let i = lastProcessedIndex; i < tradeOrders?.trades.length!; i++) {
      const trade = tradeOrders?.trades[i];
      const tradeTimeWithInterval = +addIntervalTime(new Date(trade?.time!), interval).getTime();

      if (tradeTimeWithInterval > candleCloseTime) {
        break;
      }

      if (tradeTimeWithInterval >= candleOpenTime && tradeTimeWithInterval <= candleCloseTime) {
        tradeOnCandle.push(trade!);
      }

      lastProcessedIndex = i + 1; // Update the last processed index
    }
    let previousPosition;
    let prevAriCumUnrealizedPnl = latestCumuUnrealizedPnl;

    tradeOnCandle?.forEach((x) => {
      const { quantity, side, price, fees = 0 } = x;
      let current_side = side === 'buy' ? OrderSide.Buy : OrderSide.Sell;
      previousPosition = position;

      let pnl = zero;
      let qty = new Decimal(+quantity);

      let tradePrice = new Decimal(+price);
      if (current_side == OrderSide.Buy) {
        tradePrice = tradePrice.mul(feeMultiplierBuy);
      } else if (current_side == OrderSide.Sell) {
        tradePrice = tradePrice.mul(feeMultiplierSell);
      }

      if (globalEntryPrice.equals(zero)) {
        globalEntryPrice = tradePrice;
        globalSide = current_side;
        position = current_side == OrderSide.Sell ? position.sub(qty) : qty;
      } else {
        if (current_side == OrderSide.Buy) {
          position = position.add(qty);
        } else if (current_side == OrderSide.Sell) {
          position = position.sub(qty);
        }

        if (current_side == globalSide) {
          globalEntryPrice = globalEntryPrice
            .mul(previousPosition.abs())
            .add(tradePrice.mul(qty))
            .div(position.abs());
        } else if (current_side !== globalSide) {
          let minQty = Decimal.min(previousPosition.abs(), qty);

          if (current_side == OrderSide.Buy) {
            pnl = globalEntryPrice.sub(tradePrice).mul(minQty);
          } else if (current_side == OrderSide.Sell) {
            pnl = tradePrice.sub(globalEntryPrice).mul(minQty);
          }

          if (qty.greaterThan(previousPosition.abs())) {
            globalEntryPrice = tradePrice;
          } else if (qty.equals(zero)) {
            globalEntryPrice = zero;
          }
        }

        if (!pnl.equals(zero)) {
          // PNL Calculations
          // Best and worst trades
          if (pnl.greaterThan(bestTradePnl)) bestTradePnl = pnl;
          if (pnl.lessThan(worstTradePnl)) worstTradePnl = pnl;

          // Win and lose counts
          if (pnl.greaterThan(zero)) {
            totalWinningTrades++;
            totalProfit = totalProfit.add(pnl);
          }
          if (pnl.lessThan(zero)) {
            totalLosingTrades++;
            totalLoss = totalLoss.add(pnl);
          }

          // Winning and losing streaks
          if (pnl.greaterThan(zero)) {
            winCount += 1;

            if (loseCount > loseStreak) {
              loseStreak = loseCount;
            }

            loseCount = 0;
          } else if (pnl.lessThan(zero)) {
            loseCount += 1;

            if (winCount > winStreak) {
              winStreak = winCount;
            }
            winCount = 0;
          }

          // sum of all Pnl
          sumOfPnl = sumOfPnl.add(pnl);
          pnlLength++;
          finalPnl = finalPnl.add(pnl);
        }
      }
      globalSide = position.greaterThanOrEqualTo(0) ? OrderSide.Buy : OrderSide.Sell;
      // let index = tradeOrders?.trades.indexOf(x);
      // tradeOrders?.trades.splice(index!);
    });

    let geometricUnrealizedPnl;
    if (globalSide == OrderSide.Buy) {
      geometricUnrealizedPnl = candleClosePrice.sub(globalEntryPrice).mul(position.abs());
    } else {
      geometricUnrealizedPnl = globalEntryPrice.sub(candleClosePrice).mul(position.abs());
    }

    let priceChange =
      index > 0
        ? candleClosePrice.div(new Decimal(+klineArr[index - 1][4])).sub(new Decimal(1))
        : zero;
    intervalPriceChanges.push(priceChange);

    // Geometric way of calculating unrealized pnl
    // geoUnrealizedPnlInfo.push(geometricUnrealizedPnl);
    // let prevGeoCumUnrealizedPnl =
    //   geoCumulativeUnrealizedPnlInfo.length > 0
    //     ? geoCumulativeUnrealizedPnlInfo[geoCumulativeUnrealizedPnlInfo.length - 1]
    //     : zero;
    // geoCumulativeUnrealizedPnlInfo.push(prevGeoCumUnrealizedPnl.add(geometricUnrealizedPnl));

    let ariUnrealizedPnl = prevAriPosition.mul(priceChange);
    let arithmeticPosition = 0;
    if (position.greaterThan(zero)) {
      arithmeticPosition = 1;
    } else if (position.lessThan(zero)) {
      arithmeticPosition = -1;
    }
    prevAriPosition = new Decimal(arithmeticPosition);

    // Arithmetic way of calculating unrealized pnl
    // ariUnrealizedPnlInfo.push(ariUnrealizedPnl);
    sumOfAriUnrealizedPnlInfo = sumOfAriUnrealizedPnlInfo.add(ariUnrealizedPnl);
    latestCumuUnrealizedPnl = prevAriCumUnrealizedPnl.add(ariUnrealizedPnl);

    // Standard Deviation Calculation for arithmetic Sharpe
    let delta = ariUnrealizedPnl.minus(stdDevMean);
    stdDevMean = stdDevMean.add(delta.div(new Decimal(index).add(new Decimal(1))));
    let delta2 = ariUnrealizedPnl.minus(stdDevMean);
    stdDevM2 = stdDevM2.add(delta.mul(delta2));

    maxFromStart = Decimal.max(maxFromStart, latestCumuUnrealizedPnl);
    let drawdown = latestCumuUnrealizedPnl.minus(maxFromStart);
    maxDrawdown = Decimal.min(maxDrawdown, drawdown);

    // This is to get the interval equity curve
    equityData.push({
      value: initialCapitalDec.add(finalPnl).add(geometricUnrealizedPnl).toNumber(),
      time: (candleCloseTime / 1000) as UTCTimestamp,
    });
  });

  let averageTradesPerDay =
    totalTrades / Math.round((+lastTradeTime - firstTradeTime) / (1000 * 3600 * 24));

  let finalBalance = new Decimal(equityData[equityData.length - 1].value);

  maxDrawdown = maxDrawdown.abs();
  let avgAriUnrealizedPnl = sumOfAriUnrealizedPnlInfo.div(klineData!.length);
  let annualizedReturn = avgAriUnrealizedPnl.mul(365).mul(intervalForDays(interval));

  let performanceResult = {
    // to calculate average total trade per day
    averageTradesPerDay: averageTradesPerDay,

    finalBalance,
    initialCapital: new Decimal(initialCapital),
    totalTrades: tradeOrders?.trades.length ?? 0,

    totalWinningTrades,
    totalLosingTrades,
    bestTradePnl,
    worstTradePnl,
    averagePnl: sumOfPnl.div(pnlLength),
    highestWinningStreak: winStreak,
    highestLosingStreak: loseStreak,
    winRate: pnlLength === 0 ? zero : new Decimal(totalWinningTrades).div(pnlLength),
    netProfit: finalBalance.sub(initialCapitalDec),
    profitFactor: totalLoss.equals(0) ? zero : totalProfit.div(totalLoss.abs()),
    totalProfit,
    totalLoss,
    averageProfit: totalWinningTrades === 0 ? zero : totalProfit.div(totalWinningTrades),
    averageLoss: totalLosingTrades === 0 ? zero : totalLoss.div(totalLosingTrades),
    maxDrawdown,

    averageTradeDuration: zero,
    annualizedReturn,
    sharpeRatio: calculateSharpeRatioLight({
      M2: stdDevM2,
      n: new Decimal(klineData!.length),
      meanPnl: avgAriUnrealizedPnl,
      interval,
    }),
    calmarRatio: calculateCalmarRatio({ maxDrawdown, annualizedReturn }),
    roi:
      initialCapital === 0
        ? zero
        : new Decimal(finalBalance.sub(initialCapital)).div(initialCapital),
    largestRoi: initialCapital === 0 ? zero : bestTradePnl.div(initialCapital),
    smallestRoi: initialCapital === 0 ? zero : worstTradePnl.div(initialCapital),
    equityData,
    intervalPriceChanges,
  };
  return performanceResult;
};

export const transformToClosedTrades = (inputTrades: ITrade[]) => {
  let globalEntryPrice: number = 0;
  let globalEntryTime: Date | null = null;
  let position: number = 0;
  let closedTrades: IClosedTrade[] = [];
  let globalSide: OrderSide | null = null;

  inputTrades.map((trade, index) => {
    const { quantity, side, price, time } = trade;

    let qty = +quantity;
    if (index === 0) {
      globalEntryPrice = price;
      globalEntryTime = new Date(+time);
      globalSide = side as OrderSide;
      position = qty;
      return;
    }
    if (side === globalSide) {
      globalEntryPrice = (globalEntryPrice * position + price * qty) / (position + qty);
      position = position + qty;
      return;
    }
    if (side !== globalSide) {
      if (qty > position) {
        closedTrades.push({
          entryPrice: new Decimal(globalEntryPrice),
          entryTime: new Date(globalEntryTime ?? 0),
          exitPrice: new Decimal(price),
          exitTime: new Date(+time),
          quantity: new Decimal(position),
          side: side as OrderSide,
        });

        position = qty - position;
        globalEntryPrice = price;
        globalEntryTime = new Date(+time);
        globalSide = side as OrderSide;
        return;
      }
      closedTrades.push({
        entryPrice: new Decimal(globalEntryPrice),
        entryTime: new Date(globalEntryTime ?? 0),
        exitPrice: new Decimal(price),
        exitTime: new Date(+time),
        quantity: new Decimal(qty),
        side: side as OrderSide,
      });
      position = position - qty;
    }
  });

  return closedTrades;
};

// sharpe ratio
export const calculateSharpeRatio = ({
  intervalPnl,
  interval,
}: {
  intervalPnl: Decimal[];
  interval: Interval;
}) => {
  const meanPNL = mean({
    values: intervalPnl,
  });
  const standardDeviationValue = standardDeviation({ values: intervalPnl });
  const tradeInterval = new Decimal(intervalToDays(interval));
  const sharpeRatio = meanPNL
    .div(standardDeviationValue)
    .mul(new Decimal(365).div(tradeInterval).sqrt());

  return sharpeRatio;
};
// sharpe ratio
export const calculateSharpeRatioLight = ({
  M2,
  n,
  meanPnl,
  interval,
}: {
  M2: Decimal;
  n: Decimal;
  meanPnl: Decimal;
  interval: Interval;
}) => {
  let variance = M2.div(n);
  let standardDeviationValue = Decimal.sqrt(variance);
  const tradeInterval = new Decimal(intervalToDays(interval));
  const sharpeRatio = meanPnl
    .div(standardDeviationValue)
    .mul(new Decimal(365).div(tradeInterval).sqrt());

  return sharpeRatio;
};

// calmar ratio
export const calculateCalmarRatio = ({
  maxDrawdown,
  annualizedReturn,
}: {
  maxDrawdown: Decimal;
  annualizedReturn: Decimal;
}) => {
  return annualizedReturn.div(maxDrawdown);
};
