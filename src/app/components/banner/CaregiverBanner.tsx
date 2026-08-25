import React from 'react';
import { FaExclamationCircle, FaArrowRight } from 'react-icons/fa';

const CaregiverBanner = ({ message, buttonText, onClick }) => {
    return (
        <div className="group relative mb-6 overflow-hidden rounded-[2rem] border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white p-5 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-md sm:p-6">
            {/* Background Decorative Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl transition-all group-hover:bg-amber-400/20" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Section: Icon & Content */}
                <div className="flex items-start gap-4">
                    {/* Action Required Icon Pill */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner sm:h-12 sm:w-12">
                        <FaExclamationCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                                Action Required
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                                Profile Pending
                            </span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Right Section: Action Button */}
                <div className="shrink-0 pt-2 sm:pt-0">
                    <button
                        onClick={onClick}
                        className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-teal-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-teal-600/30 active:translate-y-0 sm:w-auto sm:text-sm cursor-pointer"
                    >
                        <span>{buttonText}</span>
                        <FaArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaregiverBanner;