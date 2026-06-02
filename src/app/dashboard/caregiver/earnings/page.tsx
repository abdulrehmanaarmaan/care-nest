'use client'
import React, { useMemo, useState } from 'react';
import { FaArrowCircleDown, FaArrowCircleUp, FaExchangeAlt, FaFileInvoiceDollar, FaHistory, FaUniversity, FaWallet } from 'react-icons/fa';
import useBookingsData from '../../../../hooks/useBookingsData';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useWithdrawals from '../../../../hooks/useWithdrawals';
import useBankAccount from '../../../../hooks/useBankAccount';
import Link from 'next/link';

const Earnings = () => {

    const { data } = useSession()
    const { id, name, email } = data?.user || {}

    const { bookings, refetch: refetchBookings } = useBookingsData('Completed', id)

    const totalEarned = useMemo(() => bookings.map(booking => booking?.pricing?.total_amount).reduce((a, b) => a + b, 0), [bookings])

    const now = new Date();

    const completedThisMonth = bookings.filter((booking) => {
        const completedAt = new Date(booking?.updated_at);

        return (
            completedAt.getFullYear() === now.getFullYear() &&
            completedAt.getMonth() === now.getMonth()
        );

    })

    const earnedThisMonth = useMemo(() => completedThisMonth.map(booking => booking?.pricing?.total_amount).reduce((a, b) => a + b, 0), [completedThisMonth])

    const availableBalance = useMemo(
        () =>
            bookings
                .filter(
                    booking =>
                        booking?.payout_status === 'Available'
                )
                .reduce(
                    (sum, booking) =>
                        sum + booking?.pricing?.total_amount,
                    0
                ),
        [bookings]
    )

    const pendingWithdrawals = useMemo(
        () =>
            bookings
                .filter(
                    booking =>
                        booking?.payout_status === 'Requested' ||
                        booking?.payout_status === 'Processing'
                )
                .reduce(
                    (sum, booking) =>
                        sum + booking?.pricing?.total_amount,
                    0
                ),
        [bookings]
    )

    const { data: withdrawal, refetch: refetchWithdrawals } = useQuery({
        queryKey: ['withdrawal', id],
        queryFn: async () => {
            const result = await fetch(`/api/withdrawals?caregiver_id=${id}&status=Paid`)
            return result.json()
        }
    })

    const { bankAccount } = useBankAccount(id)

    const { withdrawals } = useWithdrawals(id)

    const transactions = useMemo(() => {

        return withdrawals
            .map(withdrawal => ({
                _id: withdrawal?._id,
                title:
                    withdrawal?.status === 'Paid'
                        ? 'Withdrawal Paid'
                        : withdrawal?.status === 'Processing'
                            ? 'Withdrawal Processing'
                            : withdrawal?.status === 'Rejected'
                                ? 'Withdrawal Rejected'
                                : 'Withdrawal Requested',

                amount: withdrawal?.amount,

                status: withdrawal?.status,

                date:
                    withdrawal?.status === 'Paid'
                        ? withdrawal?.paid_at
                        : withdrawal?.requested_at
            }))
            .sort(
                (a, b) =>
                    new Date(b?.date).getTime() -
                    new Date(a?.date).getTime()
            )

    }, [withdrawals])

    const requestWithdrawal = async () => {

        const eligibleBooking =
            bookings.filter(
                booking =>
                    booking?.payout_status === 'Available'
            )

        const bookingIds = eligibleBooking.map(booking => booking?._id)

        const withdrawal = {
            caregiver_id: id,
            caregiver_name: name,
            caregiver_email: email,
            amount: availableBalance,
            status: 'Pending',
            booking_ids: bookingIds
        }

        const res = await fetch('api/caregiver-withdrawals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(withdrawal)
        })

        const result = await res.json()

        if (result?.success) {
            const payoutRes = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    booking_ids: bookingIds,
                    payout_status: 'Requested'
                })
            })

            const payoutResult = await payoutRes.json()

            if (payoutResult?.success) {
                refetchBookings()
                refetchWithdrawals()
                Swal.fire('Done', 'Withdrawal successfully made', 'success')
            }
        }
    }

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
                        Track your earnings, review payout history and request withdrawals securely.
                    </p>
                </div>
            </div>

            {/* 2. AGGREGATION METRIC BALANCES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Earned Container Block */}
                <div className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Total Earnings</span>
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-teal-400">
                            <FaWallet size={11} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight">${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Lifetime Earnings</p>
                    </div>
                </div>

                {/* Current Month Container Block */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">This Month</span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <FaArrowCircleUp size={12} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">${earnedThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Earnings This Month</p>
                    </div>
                </div>

                {/* Pending Clearing Matrix Block */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Pending Withdrawal</span>
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <FaArrowCircleDown size={12} />
                        </div>
                    </div>
                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">${pendingWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Awaiting Payout</p>
                    </div>
                </div>

                {/* Available Balance */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                            Available Balance
                        </span>

                        <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                            <FaWallet size={12} />
                        </div>
                    </div>

                    <div className="mt-6 space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900">
                            ${availableBalance.toLocaleString(
                                'en-US',
                                { minimumFractionDigits: 2 }
                            )}
                        </h2>

                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">  Ready For Withdrawal
                        </p>
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
                            Recent Transactions
                        </h3>
                        <span className="text-[10px] bg-slate-50 border border-slate-200/60 font-bold px-2 py-1 rounded-lg text-slate-500 flex items-center gap-1">
                            <FaHistory size={8} /> Latest Activity
                        </span>
                    </div>

                    {/* Fully Responsive Transaction Micro-Row Flow */}
                    <div className="space-y-3">
                        {transactions.length ?
                            transactions.map((tx) => (
                                <div
                                    key={tx._id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <FaExchangeAlt size={10} />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 leading-tight">{tx.title}</h4>
                                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                Service Recipient
                                                Status: {tx.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 mt-1 sm:mt-0 border-t sm:border-0 border-slate-100 pt-2 sm:pt-0">
                                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(tx.date).toLocaleDateString(
                                            'en-US',
                                            {
                                                month: 'short',
                                                day: 'numeric'
                                            }
                                        )}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-slate-900">${tx.amount.toFixed(2)}</span>
                                            <span
                                                className={`w-2 h-2 rounded-full ${tx.status === 'Paid'
                                                    ? 'bg-emerald-500'
                                                    : tx.status === 'Processing'
                                                        ? 'bg-blue-500'
                                                        : tx.status === 'Rejected'
                                                            ? 'bg-rose-500'
                                                            : 'bg-amber-500'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )) :
                            <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                                    <FaHistory size={24} />
                                </div>

                                <h3 className="text-lg font-black text-slate-900">
                                    No Transaction History Yet
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
                                    Withdrawal requests and completed payouts will appear here once
                                    earnings are transferred from your available balance.
                                </p>

                                <div className="mt-6 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-500">
                                    Your earnings summary is still being tracked above.
                                </div>
                            </div>
                        }
                    </div>
                </div>

                {/* Secure Clearing Payout Management Module Container */}
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.01)] space-y-6">
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <FaUniversity size={13} className="text-teal-600" />
                            Clearing & Settlements
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {bankAccount?._id
                                ? 'Withdraw earnings to your saved bank account.'
                                : 'Set up a bank account before requesting withdrawals.'}
                        </p>
                    </div>

                    {/* Linked Verification Node Bank Frame Badge */}
                    <div className="bg-slate-50 border border-slate-100/80 rounded-xl p-4 space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Linked Bank Account</span>
                        <div className="flex items-center gap-3 text-xs font-extrabold text-slate-800">
                            <FaUniversity className="text-teal-600 flex-shrink-0" size={14} />
                            <span className="truncate">
                                {bankAccount?._id
                                    ? `${bankAccount?.bank_name} (•••• ${bankAccount?.account_number_last4})`
                                    : 'No bank account configured'}
                            </span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span>
                                {bankAccount?._id
                                    ? 'Last Payout Cleared:'
                                    : 'Payout Setup:'}
                            </span>
                            <span className="text-slate-600">
                                {bankAccount?._id
                                    ? withdrawal?.paid_at
                                        ? new Date(withdrawal?.paid_at).toLocaleDateString()
                                        : 'No payouts yet'
                                    : 'Required'}
                            </span>
                        </div>
                    </div>

                    {/* Interactive Clearing Operational Actions Trigger Button */}
                    <button
                        onClick={() => requestWithdrawal()}
                        type="button"
                        disabled={!bankAccount?._id || availableBalance <= 0}
                        className="w-full bg-slate-900 text-white disabled:bg-slate-100 disabled:text-slate-400 hover:bg-teal-600 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-sm shadow-slate-900/5 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                        <span>Request Withdrawal</span>
                    </button>

                    {!bankAccount?._id && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800 font-semibold leading-relaxed">
                            Add a bank account before requesting withdrawals.

                            <Link
                                href="/dashboard/caregiver/bank-account"
                                className="ml-1 underline font-black"
                            >
                                Configure Bank Account
                            </Link>
                        </div>
                    )}

                    {bankAccount?._id && availableBalance <= 0 && (
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800 font-semibold leading-relaxed">
                            You need available earnings before requesting a withdrawal.
                        </div>
                    )}

                    <div className="bg-teal-50/30 rounded-xl p-3 border border-teal-50 text-[10px] text-teal-800 font-semibold leading-relaxed">
                        Withdrawals are processed according to platform payout schedules.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;