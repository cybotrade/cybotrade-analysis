'use client';

import React, { useState } from 'react';

import { Button } from '@app/_components/ui/Button';
import Drawer from '@app/_components/ui/Drawer';
import useDrawer from '@app/_hooks/useDrawer';

import BackTestResultsDrawer from './_components/BackTestResults';
// import { useTestResultContext } from '@app/_contexts/TestResultContextProvider';
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
  const [data, setData] = useState({});
  const { close, isOpen, open } = useDrawer();
  const sampleData: IBackTestData[] = [
    {
      id: 'default_permutation',
      params: null,
      symbol: 'BTC/USDT',
      intervals: ['FourHour'],
      trades: [
        // {
        //   quantity: 100,
        //   side: 'Buy',
        //   price: 32000,
        //   time: '2023-10-23T18:00:00Z',
        // },
        // {
        //   quantity: 30,
        //   side: 'Buy',
        //   price: 34800,
        //   time: '2023-10-25T12:00:00Z',
        // },
        // {
        //   quantity: 2,
        //   side: 'Sell',
        //   price: 34500,
        //   time: '2023-10-26T07:00:00Z',
        // },
        // {
        //   quantity: 1,
        //   side: 'Sell',
        //   price: 34500,
        //   time: '2023-10-27T07:00:00Z',
        // },

        {
          quantity: 10,
          side: 'Buy',
          price: 10000,
          time: '2023-05-30T12:00:00Z',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 20000,
          time: '2023-06-05T12:00:00Z',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 20000,
          time: '2023-10-03T12:00:00Z',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 20000,
          time: '2023-10-04T12:00:00Z',
        },
        {
          quantity: 30,
          side: 'Sell',
          price: 50000,
          time: '2023-10-05T12:00:00Z',
        },
        {
          quantity: 10,
          side: 'Buy',
          price: 10000,
          time: '2023-10-06T12:00:00Z',
        },
        {
          quantity: 20,
          side: 'Sell',
          price: 10000,
          time: '2023-10-07T12:00:00Z',
        },
        {
          quantity: 30,
          side: 'Buy',
          price: 10000,
          time: '2023-10-08T12:00:00Z',
        },
        {
          quantity: 40,
          side: 'Sell',
          price: 50000,
          time: '2023-10-09T12:00:00Z',
        },
        {
          quantity: 50,
          side: 'Buy',
          price: 10000,
          time: '2023-10-10T12:00:00Z',
        },
        {
          quantity: 60,
          side: 'Sell',
          price: 10000,
          time: '2023-10-11T12:00:00Z',
        },
        {
          quantity: 70,
          side: 'Buy',
          price: 10000,
          time: '2023-10-12T12:00:00Z',
        },
      ],
      version: '1.0.0alpha',
    },
    {
      id: '0',
      params: "['rsi=7', 'crypto=scam']",
      symbol: 'BTC/USDT',
      intervals: ['FourHour'],
      trades: [
        {
          quantity: 0.01,
          side: 'Buy',
          price: 29645.0,
          time: '2023-04-30T12:00:00Z',
        },
        {
          quantity: 0.01,
          side: 'Sell',
          price: 29545.0,
          time: '2023-12-15T01:31:30.713499747Z',
        },
        {
          quantity: 0.01,
          side: 'Buy',
          price: 29349.9,
          time: '2023-04-30T16:00:00Z',
        },
        {
          quantity: 0.01,
          side: 'Sell',
          price: 29249.9,
          time: '2023-12-15T01:31:30.725309918Z',
        },
      ],
      version: '1.0.0alpha',
    },
    {
      id: '1',
      params: "['rsi=7', 'crypto=scam']",
      symbol: 'BTC/USDT',
      intervals: ['FourHour'],
      trades: [
        {
          quantity: 0.01,
          side: 'Buy',
          price: 29645.0,
          time: '2023-04-30T12:00:00Z',
        },
        {
          quantity: 0.01,
          side: 'Sell',
          price: 29545.0,
          time: '2023-12-15T01:31:31.463255077Z',
        },
        {
          quantity: 0.01,
          side: 'Buy',
          price: 29349.9,
          time: '2023-04-30T16:00:00Z',
        },
        {
          quantity: 0.01,
          side: 'Sell',
          price: 29249.9,
          time: '2023-12-15T01:31:31.471684799Z',
        },
      ],
      version: '1.0.0alpha',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A] text-black dark:text-white rounded-lg border border-[#E1C3A0] flex flex-col justify-center items-center gap-6 relative p-8">
      <Button onClick={open} className="z-50">
        open
      </Button>
      <div className="max-w-lg text-center z-10 flex flex-col gap-5">
        <p className="text-6xl font-semibold">Drop your json file to start</p>
        <p className="text-xl">
          Your most comprehensive and professional backtest reporting system
        </p>
      </div>
      <FileDropAndParse
        className="max-w-xl z-10"
        onChange={(file, value) => {
          console.log('file', file);
          console.log('value', value);
          setData(value);
          // router.push('analysis/result');
        }}
      />
      <BackTestResultsDrawer onOpen={open} open={isOpen} onClose={close} data={sampleData} />

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

// 1696248000000
