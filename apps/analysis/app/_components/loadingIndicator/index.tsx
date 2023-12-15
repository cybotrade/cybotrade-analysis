import React from 'react';

const ProgressLoader = ({ percent = '50%' }: { percent: string }) => {
    return (
        <div className="min-w-full min-h-[3px] flex">
            <div
                className={`bg-primary rounded-full transition-all duration-100`}
                style={{ width: percent }}
            ></div>
        </div>
    );
};

export default ProgressLoader;
