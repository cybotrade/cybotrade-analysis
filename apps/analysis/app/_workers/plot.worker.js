import { Decimal } from 'decimal.js';
import { UTCTimestamp } from 'lightweight-charts';

import { calculateSharpeRatio } from '../_lib/calculation';
import { OrderSide, addIntervalTime } from '../_lib/utils';

function calculate(klineData, interval, trades) {
  let ariUnrealizedPnlInfo = [];
  let ariCumulativeUnrealizedPnlInfo = [];
  let globalEntryPrice = new Decimal(0);
  let globalSide = null;
  let position = new Decimal(0);
  let pnlList = [];
  let finalPnl = new Decimal(0);
  let positionList = [];

  klineData.map((kline, index, klineArr) => {
    let candleClosePrice = new Decimal(kline[4]);
    const candleOpenTime = kline[0];
    const candleCloseTime = kline[6];
    const tradeOnCandle = trades.filter(
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
    let priceChange =
      index > 0
        ? candleClosePrice.div(new Decimal(+klineArr[index - 1][4])).sub(new Decimal(1))
        : new Decimal(0);

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
  });

  return calculateSharpeRatio({ intervalPnl: ariUnrealizedPnlInfo, interval }).toNumber();
}

onmessage = async (event) => {
  const { topics, permutations, kline } = event.data;
  const klineData = kline[0][1].pages.map((page) => page.kline).flat();

  let data = [];

  permutations.forEach((value, key) => {
    let parsedTrades = JSON.parse(value).trades;
    let symbols = Object.keys(parsedTrades);
    for (const [index, symbol] of symbols.entries()) {
      if (parsedTrades[symbol].length === 0) continue;

      let sortedTrades = parsedTrades[symbol]
        .sort((a, b) => a.time - b.time)
        .map((trade) => ({ ...trade, fees: 0 }));
      data.push({
        id: key,
        sharpeRatio: calculate(klineData, topics[index].interval, sortedTrades),
      });
    }
  });
  postMessage(data);
};
