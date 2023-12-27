import React from 'react';

type LoadingProps = {
  description: string | React.ReactElement;
};

export const Loading: React.FC<LoadingProps> = ({ description }) => {
  return (
    <div>
      <div className=" flex justify-center items-center h-full">
        <div className="text-center max-w-lg rounded-xl p-5">
          <div className="title font-bold text-4xl text-red-600">Hold On!</div>
          <div className="text-xl">{description}</div>
        </div>
      </div>
    </div>
  );
};
