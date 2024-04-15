import { type Kline } from 'binance';
import { differenceInMilliseconds, millisecondsToHours } from 'date-fns';
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
  totalTradesDuration: number;
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
  parameters: { initialCapital, comission, riskFreeRate, fees },
  tradeOrders,
}: {
  parameters: { initialCapital: number; comission: number; riskFreeRate: number; fees?: number };
  tradeOrders?: { klineData: Kline[]; trades: ITrade[]; interval: Interval };
}): PerformanceData => {
  let interval = tradeOrders?.interval ?? Interval.OneDay;
  let intervalPriceChanges: Decimal[] = [];
  let klineData = tradeOrders?.klineData;
  let equityData: { value: number; time: UTCTimestamp }[] = [];
  let geoUnrealizedPnlInfo: Decimal[] = [];
  let geoCumulativeUnrealizedPnlInfo: Decimal[] = [];
  let ariUnrealizedPnlInfo: Decimal[] = [];
  let ariCumulativeUnrealizedPnlInfo: Decimal[] = [];
  let globalEntryPrice: Decimal = new Decimal(0);
  let globalSide: OrderSide | null = null;
  let position: Decimal = new Decimal(0);
  let pnlList: Decimal[] = [];
  let finalPnl = new Decimal(0);
  let positionList: Decimal[] = [];
  let initialCapitalDec = new Decimal(initialCapital);
  klineData?.map((kline, index, klineArr) => {
    let candleClosePrice = new Decimal(kline[4]);
    const candleOpenTime = kline[0];
    const candleCloseTime = kline[6];
    const tradeOnCandle = tradeOrders?.trades.filter(
      (trade) =>
        +addIntervalTime(new Date(trade.time), interval).getTime() <= candleCloseTime &&
        +addIntervalTime(new Date(trade.time), interval).getTime() >= candleOpenTime,
    );
    let previousPosition;
    tradeOnCandle?.forEach((x) => {
      const { quantity, side, price, fees = 0 } = x;

      let current_side = side === 'buy' ? OrderSide.Buy : OrderSide.Sell;
      previousPosition = position;

      let pnl = new Decimal(0);
      let qty = new Decimal(+quantity);
      let tradePrice = new Decimal(+price);
      if (globalEntryPrice.equals(new Decimal(0))) {
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
            pnl = globalEntryPrice.mul(minQty).sub(tradePrice.mul(minQty));
          } else if (current_side == OrderSide.Sell) {
            pnl = tradePrice.mul(minQty).sub(globalEntryPrice.mul(minQty));
          }

          if (qty.greaterThan(previousPosition.abs())) {
            globalEntryPrice = tradePrice;
          } else if (qty.equals(new Decimal(0))) {
            globalEntryPrice = new Decimal(0);
          }
        }

        if (!pnl.equals(new Decimal(0))) {
          pnlList.push(pnl);
          finalPnl = finalPnl.add(pnl);
        }
      }
      globalSide = position.greaterThanOrEqualTo(0) ? OrderSide.Buy : OrderSide.Sell;
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
        : new Decimal(0);
    intervalPriceChanges.push(priceChange);

    // Geometric way of calculating unrealized pnl
    geoUnrealizedPnlInfo.push(geometricUnrealizedPnl);
    let prevGeoCumUnrealizedPnl =
      geoCumulativeUnrealizedPnlInfo.length > 0
        ? geoCumulativeUnrealizedPnlInfo[geoCumulativeUnrealizedPnlInfo.length - 1]
        : new Decimal(0);
    geoCumulativeUnrealizedPnlInfo.push(prevGeoCumUnrealizedPnl.add(geometricUnrealizedPnl));

    let arimetricUnrealizedPnl = (
      positionList.length > 0 ? positionList[positionList.length - 1] : new Decimal(0)
    ).mul(priceChange);
    let arithmeticPosition = 0;
    if (position.greaterThan(new Decimal(0))) {
      arithmeticPosition = 1;
    } else if (position.lessThan(new Decimal(0))) {
      arithmeticPosition = -1;
    }
    positionList.push(new Decimal(arithmeticPosition));

    // Atrihmetic way of calculating unrealized pnl
    ariUnrealizedPnlInfo.push(arimetricUnrealizedPnl);
    let prevAriCumUnrealizedPnl =
      ariCumulativeUnrealizedPnlInfo.length > 0
        ? ariCumulativeUnrealizedPnlInfo[ariCumulativeUnrealizedPnlInfo.length - 1]
        : new Decimal(0);
    ariCumulativeUnrealizedPnlInfo.push(prevAriCumUnrealizedPnl.add(arimetricUnrealizedPnl));

    // This is to get the interval equity curve
    equityData.push({
      value: initialCapitalDec.add(finalPnl).add(geometricUnrealizedPnl).toNumber(),
      time: (candleCloseTime / 1000) as UTCTimestamp,
    });
  });
  let averageTradesPerDay =
    tradeOrders!.trades.length /
    Math.round(
      (+tradeOrders!.trades[tradeOrders!.trades.length - 1].time - +tradeOrders!.trades[0].time) /
        (1000 * 3600 * 24),
    );
  let totalTradesDuration = calculateTotalTradesDuration(tradeOrders!.trades);
  let bestTradePnl = pnlList.length > 0 ? Decimal.max(...pnlList) : new Decimal(0);
  let worstTradePnl = pnlList.length > 0 ? Decimal.min(...pnlList) : new Decimal(0);
  let winningTrades = pnlList.filter((pnl) => pnl.greaterThan(0));
  let losingTrades = pnlList.filter((pnl) => pnl.lessThan(0));
  let totalProfit = winningTrades.reduce((acc, curr) => acc.add(curr), new Decimal(0));
  let totalLoss = losingTrades.reduce((acc, curr) => acc.add(curr), new Decimal(0));
  let totalWinningTrades = winningTrades.length;
  let totalLosingTrades = losingTrades.length;
  let finalBalance = new Decimal(equityData[equityData.length - 1].value);

  let drawdowns = ariCumulativeUnrealizedPnlInfo.map((currentValue, index) => {
    const maxFromStart = Decimal.max(...ariCumulativeUnrealizedPnlInfo.slice(0, index + 1)); // Slice the array to get the sublist from 0 to index
    return currentValue.minus(maxFromStart);
  });
  let maxDrawdown = Decimal.min(...drawdowns).abs();
  let annualizedReturn = mean({ values: ariUnrealizedPnlInfo })
    .mul(365)
    .div(intervalForDays(interval));
  let performance = {
    // to calculate average total trade per day
    averageTradesPerDay: averageTradesPerDay,
    totalTradesDuration,
    finalBalance,
    initialCapital: new Decimal(initialCapital),
    totalTrades: tradeOrders?.trades.length ?? 0,

    totalWinningTrades,
    totalLosingTrades,
    bestTradePnl,
    worstTradePnl,
    averagePnl: mean({ values: pnlList }),
    highestWinningStreak: streak(pnlList, (pnl) => pnl.greaterThan(0)),
    highestLosingStreak: streak(pnlList, (pnl) => pnl.lessThan(0)),

    winRate:
      pnlList.length === 0 ? new Decimal(0) : new Decimal(totalWinningTrades).div(pnlList.length),
    netProfit: finalBalance.sub(initialCapitalDec),
    profitFactor: totalLoss.equals(0) ? new Decimal(0.0) : totalProfit.div(totalLoss.abs()),
    totalProfit,
    totalLoss,
    averageProfit: totalWinningTrades === 0 ? new Decimal(0) : totalProfit.div(totalWinningTrades),
    averageLoss: totalLosingTrades === 0 ? new Decimal(0) : totalLoss.div(totalLosingTrades),
    maxDrawdown,

    averageTradeDuration: new Decimal(0),
    annualizedReturn,
    sharpeRatio: calculateSharpeRatio({ intervalPnl: ariUnrealizedPnlInfo, interval }),
    calmarRatio: calculateCalmarRatio({ maxDrawdown, annualizedReturn }),
    roi:
      initialCapital === 0
        ? new Decimal(0)
        : new Decimal(finalBalance.sub(initialCapital)).div(initialCapital),
    largestRoi: initialCapital === 0 ? new Decimal(0) : bestTradePnl.div(initialCapital),
    smallestRoi: initialCapital === 0 ? new Decimal(0) : worstTradePnl.div(initialCapital),
    equityData,
    intervalPriceChanges,
  };
  return performance;
};

export const transformToClosedTrades = (inputTrades: ITrade[]) => {
  let globalEntryPrice: number = 0;
  let globalEntryTime: Date | null = null;
  let position: number = 0;
  let closedTrades: IClosedTrade[] = [];
  let globalSide: OrderSide | null = null;

  if (inputTrades.length === 0) return [];
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

export const calculateTotalTradesDuration = (trades: ITrade[]) => {
  if (trades.length === 0) {
    return 0;
  }
  const totalMilliseconds = trades.slice(1).reduce((total, trade, index) => {
    const startTimestamp = trades[index].time;
    if (+trade.time !== +startTimestamp) {
      const duration = +trade.time - +startTimestamp;
      return total + duration;
    }
    return total;
  }, 0);
  return millisecondsToHours(totalMilliseconds);
};
