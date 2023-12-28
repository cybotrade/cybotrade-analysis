'use client';

import React, { useState } from 'react';
import useDrawer from '@app/_hooks/useDrawer';

import BackTestResultsDrawer from './_components/BackTestResults';
import FileDropAndParse from './_components/FileDropAndParse';
import { IBackTestData } from './type';

const FloatCard = ({ text, className }: { text: string; className: string }) => (
  <div
    className={`py-5 px-10 w-[200px] border flex justify-center items-center text-clip text-center overflow-wrap-break-word bg-white/40 rounded-lg ${className}`}
  >
    {text}
  </div>
);

const Backtest = () => {
  const [data, setData] = useState<IBackTestData[] | undefined>(undefined);
  const { close, isOpen, open } = useDrawer();

  return (
    <div className="bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A] text-black dark:text-white rounded-lg border border-[#E1C3A0] flex flex-col justify-center items-center gap-6 relative p-8">
      <div className="max-w-lg text-center z-10 flex flex-col gap-5">
        <p className="text-6xl font-semibold">Drop your json file to start</p>
        <p className="text-xl">
          Your most comprehensive and professional backtest reporting system
        </p>
      </div>
      <FileDropAndParse
        className="max-w-xl z-10"
        onChange={(file, value) => {
          setData(value as IBackTestData[]);
        }}
      />
      {data && <BackTestResultsDrawer onOpen={open} open={isOpen} onClose={close} data={data} />}

      {/* Background element */}
      <div className="rounded-full h-[815px] min-w-[815px] border border-primary-light2 absolute top-[-235px] left-[-216px]"></div>
      <div className="rounded-full h-[815px] min-w-[815px] border border-primary-light2 absolute bottom-[-336px] right-[-175px]"></div>
      <FloatCard
        text="Comparing results"
        className="text-[#ADF79A] border-[#ADF79A] absolute top-[40%] left-[7%]"
      />
      <FloatCard
        text="Save your backtests"
        className="text-[#9ADBF7] border-[#9ADBF7] absolute top-[10%] right-[15%]"
      />
      <FloatCard
        text="Find optimal results"
        className="text-[#F79A9A] border-[#F79A9A] absolute bottom-[15%] right-[7%]"
      />
    </div>
  );
};

export default Backtest;
