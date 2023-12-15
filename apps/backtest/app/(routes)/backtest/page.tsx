'use client';
import React from 'react';
import FileDropZone from './_components/FileDropZone';

const FloatCard = ({
    text,
    className,
}: {
    text: string;
    className: string;
}) => (
    <div
        className={`py-5 px-10 w-[200px] border flex justify-center items-center text-clip text-center overflow-wrap-break-word bg-white/40 rounded-lg ${className}`}
    >
        {text}
    </div>
);

const Backtest = () => {
    return (
        <div
            className="bg-gradient-to-b from-[#FFEFDC] to-white dark:bg-gradient-to-b dark:from-[#2E1C05] dark:to-[#73501A] text-black dark:text-white min-h-[75vh] rounded-lg border border-[#E1C3A0] flex flex-col justify-center items-center gap-6 relative p-8"
        >
            <div className="max-w-lg text-center z-10 flex flex-col gap-5">
                <p className="text-6xl font-semibold">
                    Drop your json file to start
                </p>
                <p className="text-xl">
                    Your most comprehensive and professional backtest reporting
                    system
                </p>
            </div>
            <FileDropZone className="max-w-xl z-10" />
            <div className="rounded-full min-h-[815px] min-w-[815px] border border-primary-light2 absolute top-[-235px] left-[-216px]"></div>
            <div className="rounded-full min-h-[815px] min-w-[815px] border border-primary-light2 absolute bottom-[-336px] right-[-175px]"></div>
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
