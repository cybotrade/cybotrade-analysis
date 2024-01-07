import Decimal from 'decimal.js';

import { Interval, OrderSide } from '@cybotrade/core';

export interface ITrade {
  quantity: number;
  side: OrderSide | string;
  price: number;
  time: string;
}

export interface IBackTestData {
  id: string;
  params: string | null;
  symbols: string;
  intervals: Interval[] | string[];
  trades: ITrade[];
  version: string;
  start_time: string;
  end_time: string;
}

export interface IBackTestDataMultiSymbols
  extends Omit<IBackTestData, 'symbols' | 'intervals' | 'trades'> {
  // version 1.1.1alpha
  symbols: string[];
  intervals: { [key: string]: Interval[] | string[] }[];
  trades: { [key: string]: ITrade[] };
}

export interface IClosedTrade {
  entryPrice: Decimal;
  entryTime: Date;
  exitPrice: Decimal;
  exitTime: Date;
  quantity: Decimal;
  side: OrderSide;
}
