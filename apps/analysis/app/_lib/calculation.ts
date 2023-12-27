import { type Kline } from 'binance';
import { Decimal } from 'decimal.js';
import { UTCTimestamp } from 'lightweight-charts';

import { OrderSide } from '@cybotrade/core';

import { IBackTestData, IClosedTrade, ITrade } from '@app/(routes)/analysis/type';

export type Performance = {
  finalBalance: Decimal;
  initialCapital: number;
  totalTrades: number;
  totalLosingTrades: number;
  totalWinningTrades: number;
  // bestTradePnl: Decimal;
  // worstTradePnl: Decimal;
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
  maxDrawdown: { value: Decimal; percentage: Decimal };

  // Duration in seconds
  averageTradeDuration: Decimal;
  sharpeRatio: {
    monthly: { startTime: Decimal; endTime: Decimal; value: Decimal }[];
    yearly: { startTime: Decimal; endTime: Decimal; value: Decimal }[];
    total: Decimal;
  };

  // monteCarlo: {
  //   drawdown: { median: Decimal; p95: Decimal };
  //   profit: { median: Decimal; p95: Decimal };
  // };

  roi: Decimal;
  // largestRoi: Decimal;
  // smallestRoi: Decimal;

  openedTrades: {
    id: string;
    quantity: Decimal;
    side: OrderSide;
    entryPrice: Decimal;
    entryTime: Date;
  }[];
  closedTrades: {
    // id: string;
    quantity: Decimal;
    side: OrderSide;
    entryPrice: Decimal;
    entryTime: Date;
    exitPrice: Decimal;
    exitTime: Date;
  }[];
  drawdowns: { timestamp: Date; value: Decimal }[];

  totalTradesPerDay: number[];
  averageTotalTradesPerDay: number;
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
  values.length == 0
    ? new Decimal(0)
    : values.reduce((acc, val) => acc.add(val), new Decimal(0)).div(values.length);

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

/**
 * Calculate the sharpe ratio for a portfolio.
 * See https://www.investopedia.com/terms/s/sharperatio.asp for more information.
 *
 * Formula: (expectedReturn - riskFreeRate) / standardDeviation
 *
 * @param expectedReturn The expected portfolio returns.
 * @param riskFreeRate The risk free rate of the portfolio.
 * @param standardDeviation The standard deviation of the portfolio returns.
 * @returns The sharpe ratio for the portfolio.
 */
export const sharpeRatio = ({
  expectedReturn,
  riskFreeRate,
  standardDeviation,
}: {
  expectedReturn: Decimal;
  riskFreeRate: Decimal;
  standardDeviation: Decimal;
}): Decimal =>
  !standardDeviation.equals(0)
    ? expectedReturn.sub(riskFreeRate).div(standardDeviation)
    : new Decimal(0);

/**
 * Convert other timeframe equities to daily equities.
 *
 * @param equities The other timeframe equities.
 * @returns The daily equities.
 */
// export const convertEquitiesToDaily = (
//   equities: { value: Decimal; timestamp: Date }[],
// ): { value: Decimal; timestamp: Date }[] => {
//   const dailyEquities: { value: Decimal; timestamp: Date }[] = [];
//   for (const equity of equities) {
//     const date = equity.timestamp;
//     const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
//     if (!dailyEquities.map((e) => e.timestamp.getTime()).includes(utcDate))
//       dailyEquities.push({ value: equity.value, timestamp: new Date(utcDate) });
//     else
//       dailyEquities[dailyEquities.map((e) => e.timestamp.getTime()).indexOf(utcDate)].value =
//         equity.value;
//   }
//   return dailyEquities;
// };

const convertCloseTradesToDaily = (
  closedTrades: {
    // id: string;
    quantity: Decimal;
    side: OrderSide;
    entryPrice: Decimal;
    entryTime: Date;
    exitPrice: Decimal;
    exitTime: Date;
  }[],
) => {
  const dailyClosedTrades: { value: Decimal; timestamp: Date }[] = [];
  for (const ct of closedTrades) {
    const date = new Date(ct.exitTime);
    const utcDate = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    if (!dailyClosedTrades.map((e) => e.timestamp.getTime()).includes(utcDate))
      dailyClosedTrades.push({ value: ct.exitPrice, timestamp: new Date(utcDate) });
    else
      dailyClosedTrades[
        dailyClosedTrades.map((e) => e.timestamp.getTime()).indexOf(utcDate)
      ].value = ct.exitPrice;
  }
  return dailyClosedTrades;
};

export const calculatePerformance = ({
  history: { openedTrades, closedTrades },
  parameters: { initialCapital, comission, riskFreeRate },
}: {
  history: {
    openedTrades: {
      id: string;
      quantity: Decimal;
      side: OrderSide;
      entryPrice: Decimal;
      entryTime: Date;
    }[];
    closedTrades: {
      // id: string;
      quantity: Decimal;
      side: OrderSide;
      entryPrice: Decimal;
      entryTime: Date;
      exitPrice: Decimal;
      exitTime: Date;
    }[];
  };
  parameters: { initialCapital: number; comission: number; riskFreeRate: number };
}): Performance => {
  const pnlFromTrade = (trade: (typeof closedTrades)[0]): Decimal =>
    pnl({
      entryPrice: new Decimal(trade.entryPrice),
      entryQuantity: new Decimal(trade.quantity),
      exitPrice: new Decimal(trade.exitPrice),
      exitQuantity: new Decimal(trade.quantity),
      orderSide: trade.side.toLowerCase() as OrderSide,
      comission: new Decimal(comission),
    });
  const closedTradesInDaily = convertCloseTradesToDaily(closedTrades);

  const pnls = closedTrades.map(pnlFromTrade);
  const drawdowns = closedTrades.map((v) => ({
    timestamp: v.exitTime,
    value: pnlFromTrade(v),
  }));
  const winningTrades = closedTrades.filter((trade) => pnlFromTrade(trade).greaterThan(0));
  const losingTrades = closedTrades.filter((trade) => pnlFromTrade(trade).lessThan(0));
  // const bestTradePnl = (() => {
  //   try {
  //     return Decimal.max(...pnls);
  //   } catch (e) {
  //     return new Decimal(0);
  //   }
  // })();
  // const worstTradePnl = (() => {
  //   try {
  //     return Decimal.min(...pnls);
  //   } catch (e) {
  //     return new Decimal(0);
  //   }
  // })();
  const totalProfit = winningTrades.reduce(
    (acc, trade) => acc.add(pnlFromTrade(trade)),
    new Decimal(0),
  );
  const totalLoss = losingTrades.reduce(
    (acc, trade) => acc.add(pnlFromTrade(trade)),
    new Decimal(0),
  );
  const finalBalance = new Decimal(initialCapital || 0).plus(totalProfit).plus(totalLoss);

  const maxDrawdown = (() => {
    try {
      return Decimal.max(...drawdowns.map(({ value }) => value));
    } catch (e) {
      return new Decimal(0);
    }
  })();
  const closedTradesReturns = returns({ values: closedTradesInDaily.map(({ value }) => value) });

  //total trade
  const tradesPerDay: Record<string, number> = {};

  closedTrades.forEach((trade) => {
    const closeDate = new Date(trade.exitTime).toISOString().split('T')[0];
    tradesPerDay[closeDate] = (tradesPerDay[closeDate] || 0) + 1;
  });

  const tradingTime =
    closedTrades.length > 0
      ? closedTrades[0].entryTime.getTime() -
        new Date(closedTrades[closedTrades.length - 1].exitTime).getTime()
      : 0;
  const tradingDays = tradingTime / (1000 * 60 * 60 * 24);
  const totalTradesPerDay = Object.values(tradesPerDay);
  const averageTotalTradesPerDay =
    totalTradesPerDay.length === 0
      ? 0
      : totalTradesPerDay.reduce((sum, count) => sum + count, 0) / totalTradesPerDay.length;
  const adjustedRiskFree = (1 + riskFreeRate) ** (tradingDays / 365) - 1;
  return {
    // to calculate average total trade per day
    totalTradesPerDay,
    averageTotalTradesPerDay,

    finalBalance,
    initialCapital,
    totalTrades: closedTrades.length,

    totalWinningTrades: pnls.filter((pnl) => pnl.greaterThan(0)).length,
    totalLosingTrades: pnls.filter((pnl) => pnl.lessThan(0)).length,
    // bestTradePnl,
    // worstTradePnl,
    averagePnl: mean({ values: pnls }),
    highestWinningStreak: streak(pnls, (pnl) => pnl.greaterThan(0)),
    highestLosingStreak: streak(pnls, (pnl) => pnl.lessThan(0)),

    winRate:
      closedTrades.length === 0
        ? new Decimal(0)
        : new Decimal(winningTrades.length).div(closedTrades.length),
    netProfit: pnls.reduce((acc, pnl) => acc.add(pnl), new Decimal(0)),
    profitFactor: totalLoss.equals(0) ? new Decimal(0.0) : totalProfit.div(totalLoss),
    totalProfit,
    totalLoss,
    averageProfit:
      winningTrades.length === 0 ? new Decimal(0) : totalProfit.div(winningTrades.length),
    averageLoss: losingTrades.length === 0 ? new Decimal(0) : totalLoss.div(losingTrades.length),
    maxDrawdown: {
      value: maxDrawdown,
      percentage: initialCapital === 0 ? new Decimal(0) : maxDrawdown.div(initialCapital),
    },

    averageTradeDuration: closedTrades
      .reduce(
        (acc, trade) =>
          acc.add(new Decimal(new Date(trade.exitTime).getTime()).sub(trade.entryTime.getTime())),
        new Decimal(0),
      )
      .div(Math.max(1, closedTrades.length)),

    sharpeRatio: {
      monthly: [],
      yearly: [],
      total: sharpeRatio({
        expectedReturn: mean({ values: closedTradesReturns }),
        riskFreeRate: new Decimal(adjustedRiskFree),
        standardDeviation: standardDeviation({ values: closedTradesReturns }),
      }),
    },

    // Not using
    // monteCarlo: {
    //   drawdown: { median: new Decimal(0), p95: new Decimal(0) },
    //   profit: { median: new Decimal(0), p95: new Decimal(0) },
    // },

    roi:
      initialCapital === 0
        ? new Decimal(0)
        : new Decimal(finalBalance.sub(initialCapital)).div(initialCapital),
    // largestRoi: initialCapital === 0 ? new Decimal(0) : bestTradePnl.div(initialCapital), // Currently not using
    // smallestRoi: initialCapital === 0 ? new Decimal(0) : worstTradePnl.div(initialCapital), // Currently not using

    drawdowns,
    closedTrades,
    openedTrades,
  };
};

export function transformTrades(trades: ITrade[]) {
  let currentQuantity = 0;
  let totalCost = 0;
  let transformedTrades = [];
  for (const trade of trades) {
    if (trade.side === 'Buy') {
      const entryPrice = currentQuantity === 0 ? trade.price : totalCost / currentQuantity;
      transformedTrades.push({
        quantity: trade.quantity,
        entryQuantity: currentQuantity,
        side: 'Buy',
        entryPrice: entryPrice,
        entryTime: trade.time,
        // transformedTrades.length > 0
        //   ? transformedTrades[transformedTrades.length - 1].exitTime
        //   : null,
        exitPrice: trade.price,
        exitTime: trade.time,
      });

      // Update current position and total cost
      currentQuantity += +trade.quantity;
      totalCost += +trade.quantity * +trade.price;
    } else if (trade.side === 'Sell') {
      // Calculate entryPrice based on previous position and total cost
      const entryPrice = currentQuantity === 0 ? trade.price : totalCost / currentQuantity;
      transformedTrades.push({
        quantity: trade.quantity,
        entryQuantity: currentQuantity,
        side: 'Sell',
        entryPrice: entryPrice,
        entryTime: trade.time,
        // transformedTrades.length > 0
        //   ? transformedTrades[transformedTrades.length - 1].exitTime
        //   : trade.time,
        exitPrice: trade.price,
        exitTime: trade.time,
      });

      // Update current position and total cost
      currentQuantity -= +trade.quantity;
      totalCost -= +trade.quantity * +trade.price;
    }
  }

  return transformedTrades;
}

export const transformToClosedTrades = (inputTrades: ITrade[]) => {
  let globalEntryPrice: number = 0;
  let globalEntryTime: Date | null = null;
  let position: number = 0;
  let closedTrades: IClosedTrade[] = [];
  let globalSide: OrderSide | null = null;

  inputTrades.map((trade, index) => {
    const { quantity, side, price, time } = trade;

    if (index === 0) {
      globalEntryPrice = price;
      globalEntryTime = time as Date;
      globalSide = side as OrderSide;
      position = quantity;
      return;
    }
    if (side === globalSide) {
      globalEntryPrice = (globalEntryPrice * position + price * quantity) / (position + quantity);
      position = position + quantity;
      return;
    }
    if (side !== globalSide) {
      if (quantity > position) {
        closedTrades.push({
          entryPrice: new Decimal(globalEntryPrice),
          entryTime: new Date(globalEntryTime ?? 0),
          exitPrice: new Decimal(price),
          exitTime: time as Date,
          quantity: new Decimal(position),
          side: side as OrderSide,
        });

        position = quantity - position;
        globalEntryPrice = price;
        globalEntryTime = time as Date;
        globalSide = side as OrderSide;
        return;
      }
      closedTrades.push({
        entryPrice: new Decimal(globalEntryPrice),
        entryTime: new Date(globalEntryTime ?? 0),
        exitPrice: new Decimal(price),
        exitTime: time as Date,
        quantity: new Decimal(quantity),
        side: side as OrderSide,
      });
      position = position - quantity;
    }
  });

  return closedTrades;
};

export const calculateEquity = ({
  klineData,
  trades,
}: {
  klineData: Kline[];
  trades: ITrade[];
}): { value: number; time: UTCTimestamp }[] => {
  const equityData: { value: number; time: UTCTimestamp }[] = [];
  let globalEntryPrice: number | null = null;
  let globalSide: OrderSide | null = null;
  let position: number = 0;
  let accumulatePnl = 0;
  klineData.map((kline) => {
    const candleClosePrice = kline[4];
    const candleCloseTime = kline[6];
    const tradeOnCandle = trades.find(
      (trade) =>
        new Date(trade.time).getTime() <= kline[6] && new Date(trade.time).getTime() >= kline[0],
    );
    if (tradeOnCandle) {
      const { quantity, side, price, time } = tradeOnCandle;

      if (globalEntryPrice === null) {
        globalEntryPrice = price;
        globalSide = side as OrderSide;
        position = quantity;
        return;
      }

      if (side === globalSide) {
        globalEntryPrice = (globalEntryPrice * position + price * quantity) / (position + quantity);
        position = position + quantity;
        return;
      }
      if (side !== globalSide) {
        if (quantity > position) {
          accumulatePnl = accumulatePnl + (price - globalEntryPrice) * quantity - position;
          position = quantity - position;
          globalEntryPrice = price;
          globalSide = side as OrderSide;
          return;
        }
        accumulatePnl = accumulatePnl + (price - globalEntryPrice) * quantity;
        position = position - quantity;
      }
    }
    equityData.push({
      value:
        position === 0
          ? accumulatePnl
          : new Decimal(
              (+candleClosePrice - (globalEntryPrice ? +globalEntryPrice : 0)) * +position +
                accumulatePnl,
            ).toNumber(),
      time: (candleCloseTime / 1000) as UTCTimestamp,
    });
  });
  return equityData;
};
