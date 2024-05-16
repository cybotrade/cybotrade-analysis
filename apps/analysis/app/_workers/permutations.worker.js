import { Decimal } from 'decimal.js';

import { calculatePerformance, pnl, transformToClosedTrades } from '../_lib/calculation';

onmessage = (e) => {
  const {
    kline,
    fileData: { permutations, topics },
  } = e.data;
  const klineData = kline[0][1].pages.map((page) => page.kline).flat();
  const result = [];

  permutations.forEach((value, id) => {
    let parsedTrades = JSON.parse(value).trades;
    let symbols = Object.keys(parsedTrades);
    let data = [];
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

      data.push([
        symbol,
        {
          trades: sortedTrades,
          closedTrades: transformedClosedTrades,
          tradesWithProfit: mappedTradesWithProfit,
          drawdowns: mappedDrawdowns,
          performance: performanceResult,
        },
      ]);
    }
    
    result.push([id, data]);
  });

  postMessage({ result: JSON.stringify(result) });
};
