import React from 'react';
import { FaArrowCircleDown, FaArrowCircleUp, FaExchangeAlt, FaFileInvoiceDollar, FaHistory, FaUniversity, FaWallet } from 'react-icons/fa';

// Strict interface tracking financial models inside payments collections
interface FinancialTransaction {
    _id: string;
    jobTitle: string;
    clientName: string;
    amount: number;
    date: string;
    payoutStatus: 'settled' | 'pending' | 'processing';
}

const Earnings = () => {

    // Configured summary architecture states
    const financialSummary = {
        totalEarned: 2420.00,
        thisMonth: 680.00,
        pendingPayout: 180.00,
        lastPayoutDate: "Apr 25, 2026",
        linkedBank: "Brac Bank Ltd (•••• 4892)"
    };

    // Historic payment tracking logs array
    const transactions: FinancialTransaction[] = [
        { _id: "tx-70412", jobTitle: "Senior Care Shift", clientName: "Rahim Uddin", amount: 120.00, date: "May 22, 2026", payoutStatus: "pending" },
        { _id: "tx-70399", jobTitle: "Medical Companion", clientName: "Mrs. Sufia Begum", amount: 140.00, date: "May 18, 2026", payoutStatus: "settled" },
        { _id: "tx-70211", jobTitle: "Infant Care Matrix", clientName: "Zayan Ahmed", amount: 168.00, date: "May 12, 2026", payoutStatus: "settled" },
        { _id: "tx-69954", jobTitle: "Senior Care Shift", clientName: "Rahim Uddin", amount: 120.00, date: "May 05, 2026", payoutStatus: "settled" }
    ];

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* 1. ROUTE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-teal-700 uppercase">
                        <span>Financial Node</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Accounting Ledger</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Earnings & Balances
                    </h1>
                    <p className="text-slate-400 text-xs font-medium">
                        Monitor real-time micro-payout vectors, check settlement statuses, and request secure clearing router transfers.
                    </p>
                </div>
            </div>

            {/* 2. AGGREGATION METRIC BALANCES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Earned Container Block */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-white/[0.03] text-9xl font-black select-none pointer-events-none">
                        $
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Gross Vault Volume</span>
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-teal-400">
                            <FaWallet size={11} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight">${financialSummary.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cumulative System Revenue</p>
                    </div>
                </div>

                {/* Current Month Container Block */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Cycles Margin</span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <FaArrowCircleUp size={12} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">${financialSummary.thisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Accrued This Calendar Month</p>
                    </div>
                </div>

                {/* Pending Clearing Matrix Block */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Escrow Hold Balance</span>
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <FaArrowCircleDown size={12} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">${financialSummary.pendingPayout.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Awaiting Settlement Pipeline</p>
                    </div>
                </div>
            </div>

            {/* 3. TRANSACTION HISTORY & PAYOUT CONTROL SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Ledger Transactions Audit Block */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-50 pb-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <FaFileInvoiceDollar size={12} className="text-teal-600" />
                            Recent Allocation Revenue Lines
                        </h3>
                        <span className="text-[10px] bg-slate-50 border border-slate-200/60 font-bold px-2 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                            <FaHistory size={8} /> Live Audit Log
                        </span>
                    </div>

                    {/* Fully Responsive Transaction Micro-Row Flow */}
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div
                                key={tx._id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 flex-shrink-0">
                                        <FaExchangeAlt size={10} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 leading-tight">{tx.jobTitle}</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recipient Workspace: {tx.clientName}</p>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 mt-1 sm:mt-0 border-t sm:border-0 border-slate-100 pt-2 sm:pt-0">
                                    <span className="text-[10px] text-slate-400 font-semibold">{tx.date}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900">${tx.amount.toFixed(2)}</span>
                                        <span className={`w-2 h-2 rounded-full ${tx.payoutStatus === 'settled' ? 'bg-emerald-500' : 'bg-amber-400'}`} title={tx.payoutStatus} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secure Clearing Payout Management Module Container */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <FaUniversity size={13} className="text-teal-600" />
                            Clearing & Settlements
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Automated Clearing House (ACH) Node Router</p>
                    </div>

                    {/* Linked Verification Node Bank Frame Badge */}
                    <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Verified Settlement Target</span>
                        <div className="flex items-center gap-3 text-xs font-extrabold text-slate-800">
                            <FaUniversity className="text-teal-600 flex-shrink-0" size={14} />
                            <span className="truncate">{financialSummary.linkedBank}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>Last Payout Cleared:</span>
                            <span className="text-slate-600">{financialSummary.lastPayoutDate}</span>
                        </div>
                    </div>

                    {/* Interactive Clearing Operational Actions Trigger Button */}
                    <button
                        type="button"
                        disabled={financialSummary.pendingPayout <= 0}
                        className="w-full bg-slate-900 text-white disabled:bg-slate-100 disabled:text-slate-400 hover:bg-teal-600 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm shadow-slate-900/5 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <span>Trigger Clearance Router</span>
                    </button>

                    <div className="bg-teal-50/30 rounded-xl p-3 border border-teal-50 text-[10px] text-teal-800 font-semibold leading-relaxed">
                        Payout triggers clear instantly inside business cycle verification windows. Platform processing rules apply.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Earnings;