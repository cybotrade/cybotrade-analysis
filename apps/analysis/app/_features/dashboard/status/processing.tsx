import React from 'react';

import { Loading } from '@app/_components/loading';

export const Processing = () => {
  return (
    <div className="row-[2] flex justify-center items-center h-full">
      <Loading description="Loading ..." />
    </div>
  );
};
