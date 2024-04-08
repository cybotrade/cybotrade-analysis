import { Decimal } from 'decimal.js';

import { calculatePerformance, pnl, transformToClosedTrades } from '../_lib/calculation';
import { OrderSide } from '../_lib/utils';

onmessage = (e) => {
  const { kline, fileData } = e.data;
  const { initial_capital, candle_topics, trades, start_time, end_time } = fileData.content;
  const splitedStrings = candle_topics.map((t) => t.split('|'));
  const topics = splitedStrings.map((topic) => {
    const [category, interval, symbol, exchange] = topic[0].split('-');
    const type = topic[1];
    return {
      category,
      interval,
      symbol,
      type,
      exchange,
    };
  });
  const klineData = kline[0][1].pages.map((page) => page.kline).flat();
  const backtestsMap = new Map();

  for (const [id, orders] of Object.entries(trades)) {
    let parsedTrades = JSON.parse(orders).trades;
    let symbols = Object.keys(parsedTrades);
    let trades = new Map();
    let closedTrades = new Map();
    let tradesWithProfit = new Map();
    let drawdowns = new Map();
    let performance = new Map();

    for (const [index, symbol] of symbols.entries()) {
      if (parsedTrades[symbol].length === 0) continue;

      let sortedTrades = parsedTrades[symbol]
        .sort((a, b) => a.time - b.time)
        .map((trade) => ({ ...trade, fees: 0 }));
      let transformedClosedTrades = transformToClosedTrades(sortedTrades);
      let mappedTradesWithProfit = transformedClosedTrades.map((t) => ({
        ...t,
        pnl: pnl({
          comission: new Decimal(0),
          entryPrice: t.entryPrice,
          entryQuantity: t.quantity,
          exitPrice: t.exitPrice,
          exitQuantity: t.quantity,
          orderSide: t.side.toLowerCase(),
        }),
      }));
      let mappedDrawdowns = transformedClosedTrades.map(
        ({ exitTime, entryPrice, exitPrice }, i) => ({
          timestamp: exitTime,
          value: new Decimal(exitPrice).sub(entryPrice),
        }),
      );
      let performanceResult = calculatePerformance({
        tradeOrders: {
          klineData: klineData ?? [],
          trades: sortedTrades,
          interval: topics[index].interval,
        },
        parameters: {
          comission: 0,
          initialCapital: 10000,
          riskFreeRate: 0.02,
          fees: 0,
        },
      });

      trades.set(symbol, sortedTrades);
      closedTrades.set(symbol, transformedClosedTrades);
      tradesWithProfit.set(symbol, mappedTradesWithProfit);
      drawdowns.set(symbol, mappedDrawdowns);
      performance.set(symbol, performanceResult);
    }
    if (trades.size === 0) continue;

    backtestsMap.set(id || 'default=0,default=0', {
      trades: Array.from(trades),
      closedTrades: Array.from(closedTrades),
      tradesWithProfit: Array.from(tradesWithProfit),
      drawdowns: Array.from(drawdowns),
      performance: Array.from(performance),
    });
  }

  const result = JSON.stringify({
    topics,
    initial_capital,
    backtests: Array.from(backtestsMap),
    start_time,
    end_time,
  });
  const buffer = new ArrayBuffer(result.length * 2);
  const view = new Uint16Array(buffer);
  for (let i = 0; i < result.length; i++) {
    view[i] = result.charCodeAt(i);
  }
  postMessage(buffer, [buffer]);
};
