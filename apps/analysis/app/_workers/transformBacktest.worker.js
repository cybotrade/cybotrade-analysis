import { calculatePerformance, transformToClosedTrades } from '../_lib/calculation';

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
    let performance = new Map();

    for (const [index, symbol] of symbols.entries()) {
      if (parsedTrades[symbol].length === 0) continue;
      let sortedTrades = parsedTrades[symbol].sort((a, b) => a.time - b.time);
      trades.set(
        symbol,
        sortedTrades.map((trade) => ({ ...trade, fees: 0 })),
      );
      closedTrades.set(symbol, transformToClosedTrades(sortedTrades));
      performance.set(
        symbol,
        calculatePerformance({
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
        }),
      );
    }
    if (trades.size === 0) continue;

    backtestsMap.set(id || 'default=0,default=0', {
      trades: Array.from(trades),
      closedTrades: Array.from(closedTrades),
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
