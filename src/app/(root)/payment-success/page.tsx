'use client'
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaArrowRight, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {

    const params = useSearchParams()

    const bookingId = params.get('bookingId')

    const router = useRouter();

    useEffect(() => {
        if (!bookingId) {
            router.push('/');
            return;
        }
        let attempts = 0;
        const verifyPayment = async () => {
            while (attempts < 5) {
                try {
                    const res = await fetch(`/api/verify-payment?bookingId=${bookingId}`);
                    const data = await res.json();
                    if (data.success) {
                        // ✅ Only clear AFTER real verification
                        localStorage.removeItem('pendingBookingId');
                        localStorage.removeItem('formData');
                        return;
                    }
                } catch (error) {
                    console.error("Verification failed:", error);
                }
                // ⏳ wait before retry
                await new Promise(res => setTimeout(res, 1500));
                attempts++;
            }
            // ❌ If still not verified → treat as failed
            router.push('/payment-cancel');
        };
        verifyPayment();
    }, [bookingId, router]);

    return (
        /* Pure white background with responsive vertical centering */
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 md:px-6">
            <div className="w-full max-w-md mx-auto text-center">
                {/* Success Icon with standard Care Nest Teal & 2026 Pulse Animation */}
                <div className="mb-8 md:mb-10 flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-teal-600 z-10 relative">
                            <FaCheckCircle size={40} className="md:text-[48px]" />
                        </div>
                        {/* Decorative pulse effect - professional delight factor */}
                        <div className="absolute inset-0 bg-teal-400 rounded-[2rem] md:rounded-[2.5rem] animate-ping opacity-20"></div>
                    </div>
                </div>
                {/* Typography: Bold, black headers with teal highlights */}
                <header className="mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3">
                        Payment <span className="text-teal-600 italic">Successful!</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed px-2">
                        Your booking is now confirmed. We’ve sent a confirmation email with all the details to your inbox.
                    </p>
                </header>
                {/* Booking Summary Box - Using the signature #F3F4F6 gray fill */}
                <div className="bg-[#F3F4F6] rounded-2xl md:rounded-3xl p-5 md:p-6 mb-8 md:mb-10 flex items-center gap-4 text-left border border-slate-100/50">
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                        <FaCalendarCheck size={18} className="md:text-[20px]" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                            Status
                        </p>
                        <p className="text-slate-700 font-bold text-sm md:text-base truncate">
                            Booking Secured
                        </p>
                    </div>
                </div>
                {/* Primary Action Buttons */}
                <nav className="flex flex-col gap-4">
                    <Link
                        href="/dashboard/my-bookings"
                        className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-teal-700 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
                    >
                        <span>View My Bookings</span>
                        <FaArrowRight className="text-sm md:text-base group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/"
                        className="text-slate-400 font-bold hover:text-teal-600 transition-colors py-2 text-sm md:text-base"
                    >
                        Return to Home
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default PaymentSuccess;