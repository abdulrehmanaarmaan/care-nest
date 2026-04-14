import React from 'react';

const LoadingSkeleton = () => {
    return (
        <div className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm animate-pulse">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Left Side: Image Placeholder */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-20 h-20 bg-slate-200 rounded-3xl shrink-0"></div>
                    <div className="space-y-3 w-full md:w-48">
                        <div className="h-5 bg-slate-200 rounded-lg w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
                    </div>
                </div>
                {/* Middle: Data Points */}
                <div className="flex flex-wrap gap-8 w-full md:w-auto">
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-12"></div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-12"></div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </div>
                </div>
                {/* Right Side: Button Placeholder */}
                <div className="w-full md:w-32 h-12 bg-slate-200 rounded-2xl"></div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;