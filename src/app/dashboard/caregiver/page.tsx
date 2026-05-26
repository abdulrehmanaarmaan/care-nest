import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaBookmark, FaCircle, FaRegCalendarCheck, FaStar, FaWallet } from 'react-icons/fa';

const Caregiver = () => {

    // Configured summary mock parameters
    const providerProfile = {
        name: "Abdul Rehman Aarmaan",
        jobsThisMonth: 12,
        upcomingVisits: 3,
        monthlyEarningsBDT: 28000,
        aggregateRating: 4.88
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* PERSONALIZED ROUTE WELCOME BLOCK */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                            Workspace Profile
                        </span>
                        <FaCircle className="text-emerald-500 text-[6px] animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Live</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Welcome Back, {providerProfile.name.split(' ')[0]}
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Platform terminal reporting clear operational checks. Review incoming slots and gross margins.
                    </p>
                </div>

                {/* Secondary Meta Performance Node */}
                <div className="flex items-center gap-2 border border-slate-100 bg-slate-50/60 rounded-2xl px-4 py-2.5 self-start sm:self-center text-xs">
                    <FaStar className="text-amber-500 fill-amber-500" size={11} />
                    <span className="font-black text-slate-900">{providerProfile.aggregateRating.toFixed(2)}</span>
                    <span className="text-slate-400 font-bold">Network Standing</span>
                </div>
            </div>

            {/* OPERATIONAL SUMMARY MATRIX TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Upcoming Shifts Scheduled', value: providerProfile.upcomingVisits, desc: 'Awaiting deployment tracks', icon: <FaRegCalendarCheck />, color: 'bg-teal-50 border-teal-100/60 text-teal-700' },
                    { label: 'Performance This Month', value: `${providerProfile.jobsThisMonth} Jobs`, desc: 'Completed lifecycle requests', icon: <FaBookmark />, color: 'bg-blue-50 border-blue-100/60 text-blue-700' },
                    { label: 'Gross Cyclical Earnings', value: `৳${providerProfile.monthlyEarningsBDT.toLocaleString()}`, desc: 'Accrued current ledger', icon: <FaWallet />, color: 'bg-slate-900 border-slate-900 text-white', invert: true }
                ].map((card, idx) => (
                    <div key={idx} className={`border rounded-[2rem] p-6 flex flex-col justify-between shadow-[0_12px_30px_rgba(15,23,42,0.01)] ${card.invert ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200'}`}>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${card.invert ? 'bg-white/10 text-teal-400' : card.color}`}>
                            {card.icon}
                        </div>
                        <div className="mt-8 space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{card.value}</h2>
                            <div>
                                <span className={`block text-[10px] font-black uppercase tracking-wider ${card.invert ? 'text-slate-400' : 'text-slate-900'}`}>{card.label}</span>
                                <span className="block text-[10px] text-slate-400 font-medium mt-0.5">{card.desc}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CORE COMMAND ROUTER LINKS */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Rapid Navigation Channels</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { title: 'See Assigned Jobs', path: '/dashboard/caregiver/jobs', memo: 'Review active work channels.' },
                        { title: 'Configure Availability', path: '/dashboard/caregiver/availability', memo: 'Edit visibility scheduler rules.' },
                        { title: 'View Earnings Ledger', path: '/dashboard/caregiver/earnings', memo: 'Audit pay matrices and clearances.' }
                    ].map((btn, i) => (
                        <Link
                            key={i}
                            href={btn.path}
                            className="group bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm transition-all duration-300 cursor-pointer"
                        >
                            <div className="space-y-0.5 text-left">
                                <span className="block text-xs font-black text-slate-900">{btn.title}</span>
                                <span className="block text-[10px] text-slate-400 font-medium">{btn.memo}</span>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-teal-50 group-hover:border-teal-100 flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors flex-shrink-0">
                                <FaArrowRight size={8} />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Caregiver;