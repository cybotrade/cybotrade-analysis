import React, { useState } from 'react';

import { Input } from '@app/_ui/Input';

type TSimulationsInputProps = {
  onSimulationsEnter: (numSimulations: number) => void;
};

export const SimulationsInput = ({ onSimulationsEnter }: TSimulationsInputProps) => {
  const [numSimulations, setNumSimulations] = useState(10);

  return (
    <div className="absolute left-12 w-fit border rounded-lg border-[#DFDFDF] p-4 flex justify-between items-center bg-white/90 dark:bg-[#392910]/90 text-black dark:text-white z-50">
      <div className="flex items-center">
        <label className="mr-2">Number of Simulations:</label>
        <Input
          type="number"
          value={numSimulations}
          onChange={(e) => setNumSimulations(parseInt(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSimulationsEnter(numSimulations);
            }
          }}
          className="w-[85px] h-8 border-[#f0ece9] border bg-[#fffcf6]/90"
        />
      </div>
    </div>
  );
};
