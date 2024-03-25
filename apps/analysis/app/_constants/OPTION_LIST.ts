const WINRATE_OPTION = [
  { label: 'WIN RATE', value: 'winRate' },
  { label: '≥ 20%', value: '20%' },
  { label: '≥ 40%', value: '40%' },
  { label: '≥ 60%', value: '60%' },
  { label: '≥ 80%', value: '80%' },
  { label: '≥ 100%', value: '100%' },
];

const PROFIT_FACTOR_OPTION = [
  { label: 'PROFIT FACTOR', value: 'profitFactor' },
  { label: '≥ 0.5', value: '0.5' },
  { label: '≥ 1', value: '1' },
  { label: '≥ 2', value: '2' },
  { label: '≥ 3', value: '3' },
  { label: '≥ 4', value: '4' },
];

const MAX_DRAWDOWN_OPTION = [
  { label: 'MAX DRAWDOWN', value: 'maxDrawdown' },
  { label: '≥ 5%', value: '5%' },
  { label: '≥ 15%', value: '15%' },
  { label: '≥ 30%', value: '30%' },
  { label: '≥ 60%', value: '60%' },
  { label: '≥ 100%', value: '100%' },
];

const SHARPE_OPTION = [
  { label: 'SHARPE', value: 'sharpeRatio' },
  { label: '≥ 1', value: '1' },
  { label: '≥ 3', value: '3' },
  { label: '≥ 5', value: '5' },
  { label: '≥ 8', value: '8' },
];

const PERMUTATIONS_OPTION = [
  { label: 'PERMUTATIONS', value: 'permutations' },
  { label: '≥ 100', value: '100' },
  { label: '≥ 1000', value: '1000' },
  { label: '≥ 10000', value: '10000' },
  { label: '≥ 100000', value: '100000' },
  { label: '≥ 1000000', value: '1000000' },
];

export const OPTION_LIST = [
  { category: 'WIN RATE', options: WINRATE_OPTION },
  { category: 'PROFIT FACTOR', options: PROFIT_FACTOR_OPTION },
  { category: 'MAX DRAWDOWN', options: MAX_DRAWDOWN_OPTION },
  { category: 'SHARPE', options: SHARPE_OPTION },
  { category: 'PERMUTATIONS', options: PERMUTATIONS_OPTION },
] as const;
