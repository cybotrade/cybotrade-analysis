import React from 'react';

import ResultBreakdownCard from './ResultBreakdown.Card';

const CompareResultBreakdown = () => {
  return (
    <div className="flex justify-between p-6 gap-6">
      <ResultBreakdownCard />
      <ResultBreakdownCard />
    </div>
  );
};

export default CompareResultBreakdown;
