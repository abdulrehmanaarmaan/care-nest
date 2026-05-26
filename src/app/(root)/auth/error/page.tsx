import Link from 'next/link';
import React from 'react';

const AuthError = async ({
    searchParams
}: {
    searchParams: Promise<{ error?: string }>
}) => {

    const { error } = await searchParams

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Main Error Container */}
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-[2rem] p-8 sm:p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.03)] relative overflow-hidden flex flex-col items-center justify-center">
                {/* Decorative Top Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/60 rounded-bl-full pointer-events-none" aria-hidden="true" />
                {/* Visual Status Indicator Icon */}
                <div className="w-16 h-16 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600 relative">
                    <span className="absolute inline-flex h-2 w-2 rounded-full bg-amber-400 top-3 right-3 animate-pulse" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-6v2m0-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                {/* Typography Content Layer */}
                <div className="space-y-3 max-w-sm mb-8">
                    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-[0.15em] text-amber-800 uppercase bg-amber-50 border border-amber-100/70 rounded-md">
                        Security Notice
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                        Access Unavailable
                    </h1>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
                        {error === "AccessDenied"
                            ? "This Google account has been temporarily or permanently deactivated by an administrator. Please reach out to Care Nest support if you believe this is an error."
                            : "We are currently unable to sign you in using this single sign-on verification channel."
                        }
                    </p>
                </div>
                {/* Interactive Navigation Control Modules */}
                <div className="w-full space-y-3 relative z-10">
                    <Link
                        href="/login"
                        className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-teal-600 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-900/5 hover:shadow-teal-600/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Return to Login</span>
                    </Link>
                    <a
                        href="mailto:support@carenest.com" // Update with your actual platform support line
                        className="w-full inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        Contact Administration
                    </a>
                </div>
                {/* Subtle Brand Footer */}
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-8 pointer-events-none">
                    Care Nest Core Security
                </p>
            </div>
        </div>
    );
};

export default AuthError;