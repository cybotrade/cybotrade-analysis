import Decimal from 'decimal.js';

import { Interval, OrderSide } from '@cybotrade/core';

export interface ITrade {
  quantity: number;
  side: OrderSide | string;
  price: number;
  time: Date | string;
}
export interface IBackTestData {
  id: string;
  params: string | null;
  symbol: string;
  intervals: Interval[] | string[];
  trades: ITrade[];
  version: string;
}

export interface IClosedTrade {
  entryPrice: Decimal;
  entryTime: Date;
  exitPrice: Decimal;
  exitTime: Date;
  quantity: Decimal;
  side: OrderSide;
}
