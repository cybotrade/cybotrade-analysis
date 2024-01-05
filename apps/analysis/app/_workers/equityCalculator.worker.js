import { calculateEquity } from '@app/_lib/calculation';

onmessage = async (event) => {
  const { klineData, trades, initialCapital } = event.data;

  try {
    const result = await calculateEquity({
      klineData,
      trades,
      initialCapital,
    });

    postMessage(result);
  } catch (error) {
    postMessage({ error: error.message });
  }
};
