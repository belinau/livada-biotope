import React from 'react';

const ChartWrapper = ({ title, children }) => (
    <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border border-border-color/50 flex flex-col min-h-[400px] hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-center mb-4">
            <h4 className="heading-playful text-lg text-center px-4 py-2 bg-gradient-to-r from-bg-main to-bg-main rounded-full border border-border-color shadow-sm">{title}</h4>
        </div>
        <div className="flex-grow relative overflow-hidden">{children}</div>
    </div>
);

export default ChartWrapper;
