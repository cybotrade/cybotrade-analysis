'use client';

import React, { useEffect, useState } from 'react';

import useDrawer from '@app/_hooks/useDrawer';

import BackTestResultsDrawer from './_components/BackTestResults';
import CompareBackTestResultsDrawer from './_components/CompareBackTestResults';
import FileDropAndParse from './_components/FileDropAndParse';
import SurfacePlot from './_components/SurfacePlot';
import { IBackTestData, IBackTestDataMultiSymbols } from './type';

const FloatCard = ({ text, className }: { text: string; className: string }) => (
  <div
    className={`py-5 px-10 w-[200px] border flex justify-center items-center text-clip text-center overflow-wrap-break-word bg-white/40 rounded-lg ${className}`}
  >
    {text}
  </div>
);

const Backtest = () => {
  const [data, setData] = useState<IBackTestDataMultiSymbols[] | undefined>(undefined);
  const drawer = useDrawer();
  const drawer2 = useDrawer();
  const [analysingProgress, setAnalysingProgress] = useState(0);
  const [analysingProgress2, setAnalysingProgress2] = useState(0);

  useEffect(() => drawer2.open(), []);
  return (
    <div className="bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A] text-black dark:text-white rounded-lg border border-primary-light flex flex-col justify-center items-center gap-6 relative p-8">
      <div className="max-w-lg text-center z-10 flex flex-col gap-5">
        <p className="text-6xl font-semibold">Drop your json file to start</p>
        <p className="text-xl">
          Your most comprehensive and professional backtest reporting system
        </p>
      </div>
      <SurfacePlot />
      <FileDropAndParse
        className="max-w-xl z-10"
        onChange={(file, value) => {
          setData(value as IBackTestDataMultiSymbols[]);
        }}
        onShowResult={drawer.open}
        analysingProgress={analysingProgress}
      />
      {/* {data && (
        <BackTestResultsDrawer
          data={data}
          drawer={drawer}
          fetchedKlinePercentage={(percentage) => {
            setAnalysingProgress(percentage);
          }}
        />
      )} */}
      <CompareBackTestResultsDrawer
        data={sampleData}
        drawer={drawer2}
        fetchedKlinePercentage={(percentage) => {
          setAnalysingProgress2(percentage);
        }}
      />
      {/* Background element */}
      {/* <div className="rounded-full h-[815px] min-w-[815px] border border-primary-light2 absolute top-[-235px] left-[-216px]"></div>
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
      /> */}
    </div>
  );
};

export default Backtest;

const sampleData = [
  {
    id: 'default_permutation',
    params: null,
    symbols: ['BTC/USDT'],
    initial_capital: 100000000,
    intervals: {
      'BTC/USDT': ['OneDay'],
    },
    trades: {
      'BTC/USDT': [
        {
          quantity: 1,
          side: 'Buy',
          price: 9301.5,
          time: '1589328000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 8710,
          time: '1590278400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 9194.5,
          time: '1590537600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 9622.5,
          time: '1591315200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 9776.5,
          time: '1591574400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 9769.5,
          time: '1591660800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 9884,
          time: '1591747200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 9275.5,
          time: '1591833600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 9922.5,
          time: '1595721600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 11325,
          time: '1598313600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 11303.5,
          time: '1602288000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 18026,
          time: '1607644800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 18779.5,
          time: '1607731200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 30911.5,
          time: '1611187200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 32969.5,
          time: '1611273600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 32099.5,
          time: '1611360000000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 34222,
          time: '1611878400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 34307.5,
          time: '1611964800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 35506.5,
          time: '1612224000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 54111,
          time: '1616371200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 55859.5,
          time: '1616803200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 55760,
          time: '1616889600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 57709.5,
          time: '1616976000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 55957,
          time: '1617753600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 58048.5,
          time: '1617840000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 58128,
          time: '1617926400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 59790,
          time: '1618012800000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 60065.5,
          time: '1618617600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 35348.5,
          time: '1627171200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 46839.5,
          time: '1630972800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 49176.5,
          time: '1633305600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 63691.5,
          time: '1636934400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 43825.5,
          time: '1644192000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 42354,
          time: '1644537600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 42536.5,
          time: '1644796800000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 40515,
          time: '1645056000000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 43150.5,
          time: '1646006400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 39114.5,
          time: '1646352000000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 42359.5,
          time: '1647907200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 43158.5,
          time: '1649203200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 22423,
          time: '1658102400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 21301,
          time: '1658707200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 22938,
          time: '1658880000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 23327,
          time: '1660694400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 20756,
          time: '1666742400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 20143.5,
          time: '1667347200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 21132,
          time: '1667520000000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 20582.5,
          time: '1667779200000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 17929,
          time: '1673395200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 21802,
          time: '1675900800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 24330.3,
          time: '1676419200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 23936.4,
          time: '1677110400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 24112.2,
          time: '1678665600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 28797.1,
          time: '1681862400000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 28286,
          time: '1687219200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 30221.4,
          time: '1689465600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 27979,
          time: '1696118400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 27484.1,
          time: '1696204800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 27764.7,
          time: '1696377600000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 27397.3,
          time: '1696464000000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 27912.5,
          time: '1696550400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 27579.2,
          time: '1696809600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 28480.9,
          time: '1697414400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 42552,
          time: '1703548800000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 43454,
          time: '1703635200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 42607,
          time: '1703721600000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 44235.5,
          time: '1704067200000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 42871.9,
          time: '1704240000000',
        },
        {
          quantity: 1,
          side: 'Buy',
          price: 44156.3,
          time: '1704326400000',
        },
        {
          quantity: 1,
          side: 'Sell',
          price: 44156.8,
          time: '1704412800000',
        },
      ],
    },
    start_time: '1589155200000',
    end_time: '1704412800000',
    version: '1.0.1alpha',
  },
];
