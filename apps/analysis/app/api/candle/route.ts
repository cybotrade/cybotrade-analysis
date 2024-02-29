import { type KlineInterval, MainClient } from 'binance';
import { NextResponse } from 'next/server';

const client = new MainClient({});

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

  try {
    const kline = await client.getKlines({
      symbol: params['symbol'] as string,
      interval: params['interval'] as KlineInterval,
      startTime: parseInt(params['startTime']),
      endTime: parseInt(params['endTime']),
    });

    if (Array.isArray(kline)) {
      return NextResponse.json(kline);
    } else {
      // Check if the response contains an error property
      if (kline && 'error' in kline) {
        const errorResponse = kline as { error: { message: string } };
        return NextResponse.json({ error: errorResponse.error.message });
      } else {
        // Handle unexpected response format
        return NextResponse.json(
          { error: 'Unexpected response format from server' },
          { status: 500 },
        );
      }
    }
  } catch (error) {
    console.error('Error fetching klines:', error);
    const errorResponse = error as { message: string };
    return NextResponse.json(
      { error: `Failed to fetch klines: ${errorResponse.message}` },
      { status: 500 },
    );
  }
};
