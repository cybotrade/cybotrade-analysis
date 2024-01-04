import { type KlineInterval, MainClient } from 'binance';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const paramsString = req.url.split('?')[1];
  const params = paramsString
    ? paramsString.split('&').reduce(
        (acc, cur) => {
          const [key, value] = cur.split('=');

          // Use a type guard to ensure key and value are defined
          if (key !== undefined && value !== undefined) {
            acc[key] = value;
          }

          return acc;
        },
        {} as Record<string, string>,
      )
    : undefined;

  if (!params) {
    // Handle the case where params is undefined
    return NextResponse.json({ error: 'Invalid parameters' });
  }

  const client = new MainClient({});
  const kline = await client.getKlines({
    symbol: params['symbol'] as string,
    interval: params['interval'] as KlineInterval,
    // startTime: parseInt(params['startTime']),
    endTime: parseInt(params['endTime']),
    // limit: 1500,
  });

  return NextResponse.json(kline);
};
