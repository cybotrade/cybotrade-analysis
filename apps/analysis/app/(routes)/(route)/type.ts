import Decimal from 'decimal.js';

import { Interval, OrderSide } from '@app/_lib/utils';

export interface ITrade {
  quantity: number;
  side: OrderSide | string;
  price: number;
  time: string;
  fees?: number;
}

export interface IBackTestData {
  id: string;
  symbols: string;
  intervals: Interval[] | string[];
  trades: ITrade[];
  version?: string;
  start_time: string;
  end_time: string;
}

export interface IBackTestDataMultiSymbols extends Pick<IBackTestData, 'start_time' | 'end_time'> {
  // version 1.2.0
  candle_topics: string[];
  trades: {
    [permutations: string]: string;
  };
}

export interface IClosedTrade {
  entryPrice: Decimal;
  entryTime: Date;
  exitPrice: Decimal;
  exitTime: Date;
  quantity: Decimal;
  side: OrderSide;
}
