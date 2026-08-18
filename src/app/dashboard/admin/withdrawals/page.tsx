'use client'
import React from 'react';
import useWithdrawals from '../../../../hooks/useWithdrawals';
import Swal from 'sweetalert2';
import { FaCalendarAlt, FaClock, FaDollarSign, FaEnvelope, FaInbox, FaSync, FaUser, FaWallet } from 'react-icons/fa';
import { toast } from 'sonner';

const Withdrawals = () => {

    const { withdrawals, refetch } = useWithdrawals()

    const approveWithdrawal = async withdrawal => {

        Swal.fire({
            title: 'Approve Withdrawal?',
            text: `Move this withdrawal request to Processing?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Approve',
            confirmButtonColor: '#0f766e'
        }).then(async res => {
            if (res?.isConfirmed) {
                const res = await fetch(`/api/caregiver-withdrawals/${withdrawal?._id}?status=Processing`, {
                    method: 'PATCH'
                })
                const result = await res.json()
                if (result?.success) {
                    changePayoutStatus(withdrawal, 'processing')
                }
            }
        })
    }

    const rejectWithdrawal = async withdrawal => {

        Swal.fire({
            title: 'Reject Withdrawal?',
            text: 'This payout request will be rejected.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            confirmButtonColor: '#dc2626'
        }).then(async res => {
            if (res?.isConfirmed) {
                const res = await fetch(`/api/caregiver-withdrawals/${withdrawal?._id}?status=Rejected`, {
                    method: 'PATCH'
                })
                const result = await res.json()
                if (result?.success) {
                    changePayoutStatus(withdrawal, 'available')
                }
            }
        })
    }

    const markPaid = async withdrawal => {
        Swal.fire({
            title: 'Mark as Paid?',
            text: 'Confirm that the payout has been successfully transferred.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Mark Paid',
            confirmButtonColor: '#059669'
        }).then(async res => {
            if (res?.isConfirmed) {
                const res = await fetch(`/api/caregiver-withdrawals/${withdrawal?._id}?status=Paid`, {
                    method: 'PATCH'
                })
                const result = await res.json()
                if (result?.success) {
                    changePayoutStatus(withdrawal, 'paid')

                    const notification = {
                        recipient_id: withdrawal?.caregiver_id,
                        recipient_role: 'caregiver',
                        type: 'payout_processed',
                        title: "Payout Processed",
                        message: "Your payout for a completed service has been processed.",
                        reference_type: "withdrawal",
                        reference_id: withdrawal?._id,
                        is_read: false,
                    }
                    await fetch('/api/caregiver-notifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(notification)
                    })
                }
            }
        })
    }

    const changePayoutStatus = async (withdrawal, status) => {

        const payoutRes = await fetch('/api/jobs', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                booking_ids: withdrawal?.booking_ids,
                payout_status: status
            })
        })

        const payoutResult = await payoutRes.json()

        if (payoutResult?.success) {
            refetch()
            return toast.success(status === 'processing' ? 'Withdrawal request approved' : status === 'available' ? 'Withdrawal request rejected' : 'Withdrawal marked as paid')
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-teal-600">
                        <span>Administrative Core</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Payout Operations</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Withdrawal Management
                    </h1>
                    <p className="text-xs text-slate-400 font-semibold">
                        Review caregiver payout requests and manage settlement processing pipeline mechanics.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100/70 text-amber-700 text-[10px] font-black uppercase tracking-wider self-start sm:self-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Requests: {withdrawals.filter(w => w?.status === 'Pending').length}
                </div>
            </div>

            {/* KPI CARDS METRIC GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* Total Requests */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group transition-all">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Total Requests</p>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{withdrawals.length}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <FaWallet className="text-sm" />
                    </div>
                </div>

                {/* Pending Payouts */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group transition-all">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Pending</p>
                        <h2 className="text-3xl font-black text-amber-600 tracking-tight">
                            {withdrawals.filter(w => w?.status === 'Pending').length}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100/40">
                        <FaClock className="text-sm animate-spin-slow" />
                    </div>
                </div>

                {/* Processing Volume */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group transition-all">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Processing</p>
                        <h2 className="text-3xl font-black text-blue-600 tracking-tight">
                            {withdrawals.filter(w => w?.status === 'Processing').length}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100/40">
                        <FaSync className="text-sm animate-spin-slow" />
                    </div>
                </div>

                {/* Settled Gross Amount */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm flex items-center justify-between group transition-all">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Paid Amount</p>
                        <h2 className="text-3xl font-black text-teal-600 tracking-tight">
                            ${withdrawals.filter(w => w?.status === 'Paid').reduce((sum, w) => sum + w?.amount, 0)}
                        </h2>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100/40">
                        <FaDollarSign className="text-sm" />
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL DATA ARCHITECTURE TABLE VIEW */}
            <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                {withdrawals.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100/80">
                                    <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Caregiver Profile
                                    </th>
                                    <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Requested Timestamp
                                    </th>
                                    <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Settlement Amount
                                    </th>
                                    <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        Pipeline Status
                                    </th>
                                    <th className="px-6 py-4.5 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right pr-8">
                                        Actions Control Matrix
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/60">
                                {withdrawals.map(withdrawal => (
                                    <tr key={withdrawal?._id} className="hover:bg-slate-50/40 transition-colors group">

                                        {/* CAREGIVER */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:text-teal-600 transition-colors">
                                                    <FaUser className="text-xs" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-sm leading-snug">
                                                        {withdrawal?.caregiver_name}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <FaEnvelope className="text-[9px] text-slate-300" />
                                                        {withdrawal?.caregiver_email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* REQUEST DATE */}
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-slate-600 font-semibold inline-flex items-center gap-1.5">
                                                <FaCalendarAlt className="text-slate-300 text-[10px]" />
                                                {new Date(withdrawal?.requested_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>

                                        {/* AMOUNT */}
                                        <td className="px-6 py-4">
                                            <span className="font-black text-slate-900 text-sm bg-slate-50 border border-slate-100/50 px-2.5 py-1 rounded-lg">
                                                ${withdrawal?.amount.toFixed(2)}
                                            </span>
                                        </td>

                                        {/* STATUS BADGES */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${withdrawal?.status === 'Paid'
                                                ? 'bg-teal-50 border-teal-100/60 text-teal-700'
                                                : withdrawal?.status === 'Processing'
                                                    ? 'bg-blue-50 border-blue-100/60 text-blue-700'
                                                    : withdrawal?.status === 'Rejected'
                                                        ? 'bg-rose-50 border-rose-100/60 text-rose-700'
                                                        : 'bg-amber-50 border-amber-100/60 text-amber-700'
                                                }`}>
                                                <span className={`w-1 h-1 rounded-full ${withdrawal?.status === 'Paid' ? 'bg-teal-500' : withdrawal?.status === 'Processing' ? 'bg-blue-500' : withdrawal?.status === 'Rejected' ? 'bg-rose-500' : 'bg-amber-500'
                                                    }`} />
                                                {withdrawal?.status}
                                            </span>
                                        </td>

                                        {/* ACTIONS PIPELINE TRIPPERS */}
                                        <td className="px-6 py-4 pr-8 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {withdrawal?.status === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => approveWithdrawal(withdrawal)}
                                                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-wider hover:bg-blue-100 border border-blue-100/40 transition active:scale-95 cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => rejectWithdrawal(withdrawal)}
                                                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 font-black text-[10px] uppercase tracking-wider hover:bg-rose-100 border border-rose-100/40 transition active:scale-95 cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {withdrawal?.status === 'Processing' && (
                                                    <button
                                                        onClick={() => markPaid(withdrawal)}
                                                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-black text-[10px] uppercase tracking-wider hover:bg-teal-700 transition shadow-sm shadow-teal-600/10 active:scale-95 cursor-pointer"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                {['Paid', 'Rejected'].includes(withdrawal?.status) && (
                                                    <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider pr-2">
                                                        Archived Log
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* EMPTY AUDIT FALLBACK STATE */
                    <div className="p-12 text-center max-w-sm mx-auto flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300">
                            <FaInbox className="text-base" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                                No Payout Activity Present
                            </h3>
                            <p className="text-xs text-slate-400 font-medium leading-normal">
                                Ledger indices are currently clean. Settlement workflows appear whenever a service provider flags manual payment withdrawals.
                            </p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Withdrawals;