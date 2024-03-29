import { type KlineInterval, MainClient } from 'binance';
import { NextRequest, NextResponse } from 'next/server';

const client = new MainClient({});

export const GET = async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  if (!params) {
    // Handle the case where params is undefined
    return NextResponse.json({ error: 'Invalid parameters' });
  }
  const symbol = String(params.get('symbol'));
  const interval = <KlineInterval>params.get('interval');
  const startTime = Number(params.get('start_time'));
  const endTime = Number(params.get('end_time'));

  try {
    const kline = await client.getKlines({
      symbol,
      interval,
      startTime,
      endTime,
    });

    if (Array.isArray(kline)) {
      return NextResponse.json({ kline, nextCursor: kline[kline.length - 1] });
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
