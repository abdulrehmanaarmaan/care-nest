'use client'
import React from 'react';

const Loader = () => {
    return (
        <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-slate-50/30 p-4">
            <div className="relative flex flex-col items-center">
                {/* Main Logo/Icon Loader */}
                <div className="relative mb-8">
                    {/* Outer Glowing Ring */}
                    <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-ping opacity-25"></div>
                    {/* Inner Square Branding Block */}
                    <div className="relative w-20 h-20 bg-white border-2 border-slate-100 rounded-[2rem] shadow-2xl shadow-teal-600/10 flex items-center justify-center overflow-hidden">
                        <div className="w-10 h-10 bg-teal-600 rounded-xl animate-pulse flex items-center justify-center">
                            <span className="text-white font-black text-xl italic">C</span>
                        </div>
                    </div>
                </div>
                {/* Animated Text Section */}
                <div className="text-center space-y-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        Care <span className="text-teal-600">Nest</span>
                    </h3>
                    {/* Professional Loading Bar */}
                    <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-teal-600 rounded-full w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] pt-2">
                        Optimizing Your Dashboard
                    </p>
                </div>
            </div>
            {/* Subtle Tailwind Animation for the progress bar */}
            <style jsx global>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
    `}</style>
        </div>
    );
};

export default Loader;