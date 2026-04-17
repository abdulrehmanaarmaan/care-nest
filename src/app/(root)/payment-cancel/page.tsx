'use client'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { FaArrowLeft, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {

    const params = useSearchParams()

    const serviceId = params.get("serviceId")

    return (
        /* Base wrapper: pure white background with consistent padding for mobile */
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 md:px-6">
            <div className="w-full max-w-md mx-auto text-center">
                {/* Visual Indicator - Scaled for responsiveness */}
                <div className="mb-6 md:mb-10 flex justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-sm transition-transform hover:scale-105">
                        <FaTimesCircle size={40} className="md:text-[48px]" />
                    </div>
                </div>
                {/* Typography: Using text-slate-900 and red-500 for high-end contrast */}
                <header className="mb-6 md:mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3">
                        Booking <span className="text-red-500 italic">Not Confirmed</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed px-2">
                        Your payment was not completed, so your appointment hasn't been scheduled yet. You can try again to secure your spot.
                    </p>
                </header>
                {/* Support Box: Responsive flex and signature #F3F4F6 background */}
                <div className="bg-[#F3F4F6] rounded-2xl md:rounded-3xl p-5 md:p-6 mb-8 md:mb-10 flex items-center gap-4 text-left border border-slate-100/50">
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-red-400 shadow-sm">
                        <FaExclamationTriangle size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                            Appointment Status
                        </p>
                        <p className="text-slate-700 font-bold text-sm md:text-base truncate">
                            Unconfirmed Booking
                        </p>
                    </div>
                </div>
                {/* Action Buttons: Full-width on mobile with clear hierarchy */}
                <nav className="flex flex-col gap-4">
                    {/* Primary Retry Button */}
                    <Link
                        href={`/booking/${serviceId || ''}`}
                        className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3"
                    >
                        Try Again
                    </Link>
                    {/* Secondary Home Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 font-black text-slate-400 hover:text-teal-600 transition-all group py-2 text-sm md:text-base"
                    >
                        <FaArrowLeft className="text-xs md:text-sm group-hover:-translate-x-1 transition-transform" />
                        <span>Return to Home</span>
                    </Link>
                </nav>
                {/* Footer Support Link - Subtle standard 2026 UX */}
                <div className="mt-12 text-xs md:text-sm text-slate-400 font-medium">
                    Having trouble? <button className="text-teal-600 font-bold underline underline-offset-4 decoration-2">Contact Support</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;