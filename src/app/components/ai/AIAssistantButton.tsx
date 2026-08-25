'use client';

import Link from 'next/link';
import { Bot, Sparkles, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import useUserData from '../../../hooks/useUserData';

const AIAssistantButton = () => {
    const { status } = useSession();
    const { user } = useUserData();

    if (status !== 'authenticated') {
        return null;
    }

    if (user?.role !== 'user' && user?.role !== 'caregiver') {
        return null;
    }

    return (
        <Link
            href="/dashboard/ai-assistant"
            aria-label="Open CareNest AI Assistant"
            className="group fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-999 flex items-center gap-3 rounded-2xl sm:rounded-full bg-slate-900/95 backdrop-blur-md p-2.5 pr-4 sm:p-3 sm:pr-6 text-white shadow-2xl shadow-teal-900/30 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] select-none"
        >
            {/* Ambient Background Glow Effect */}
            <div className="absolute -inset-0.5 rounded-2xl sm:rounded-full bg-linear-to-r from-teal-500 to-emerald-500 opacity-0 blur group-hover:opacity-30 transition duration-500" />

            {/* Icon Container with Floating Sparkle Pill */}
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/30 group-hover:bg-teal-500 group-hover:scale-105 transition-all duration-300">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-6" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-teal-300 text-slate-950 ring-2 ring-slate-900">
                    <Sparkles className="h-2 w-2 animate-pulse" />
                </span>
            </div>

            {/* Responsive Text & Label Details */}
            <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-teal-400 transition-colors">
                        AI Assistant
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-teal-300 border border-teal-500/30">
                        Care AI
                    </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                    24/7 Smart Guidance
                </span>
            </div>

            {/* Hover Action Indicator */}
            <ArrowRight className="h-4 w-4 text-slate-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-teal-400 transition-all duration-300 hidden sm:block" />
        </Link>
    );
};

export default AIAssistantButton;