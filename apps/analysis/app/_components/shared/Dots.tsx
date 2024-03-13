import * as React from 'react';

import { cn } from '@app/_lib/utils';

type DotsProps = {
  count: number;
  activeIndex: number;
  handleDotClick: (index: number) => void;
};

type DotProps = {
  index: number;
  active: boolean;
  onDotClick: (index: number) => void;
};

export const Dots = ({ count, activeIndex, handleDotClick }: DotsProps) => {
  return (
    <div className="flex justify-center items-center min-h-[1rem] p-1">
      {Array.from(new Array(count)).map((_, i) => {
        return <Dot key={i} index={i} active={i === activeIndex} onDotClick={handleDotClick} />;
      })}
    </div>
  );
};

const Dot = ({ index, active, onDotClick }: DotProps) => {
  return (
    <div
      className={cn(
        'w-1 h-1 m-1 rounded-full bg-[#DFDFDF] transition-colors duration-300 ease-in',
        active && 'bg-primary',
      )}
      onClick={() => onDotClick(index)}
    />
  );
};
