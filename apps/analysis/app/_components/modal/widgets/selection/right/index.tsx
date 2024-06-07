import React, { PropsWithChildren } from 'react';

export const DataDisplaySelectionGrid = ({ children }: PropsWithChildren) => {
  return (
    <div className="col-[2] justify-self-end w-fit h-full dashed-border rounded-md p-6 grid grid-cols-2 grid-rows-3 justify-between gap-5">
      {children}
    </div>
  );
};
